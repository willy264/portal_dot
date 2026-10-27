import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Store, jsonRequest, nextDeliveryAt, backoffMs, RemoteError, type ChainEvent } from '@metermend/service-core';
import { deliver, type DeliveryConfig } from './delivery.js';
import { notificationFor, type ItemState, type Notification } from './messages.js';

loadEnv({ path: fileURLToPath(new URL('../../../.env', import.meta.url)), quiet: true });
const store = new Store(process.env.BOT_DB_PATH ?? './data/debox.sqlite');
const indexer = process.env.CHAIN_INDEXER_URL ?? process.env.RELAYER_URL ?? 'http://localhost:8787';
const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
const decimals = Number(process.env.EVM_DECIMALS ?? '18');
if (!Number.isInteger(decimals) || decimals < 0 || decimals > 30) throw new Error('Invalid EVM_DECIMALS');
const config: DeliveryConfig | null = process.env.DEBOX_API_KEY && process.env.DEBOX_GROUP_ID
  ? { mode: 'debox', key: process.env.DEBOX_API_KEY, group: process.env.DEBOX_GROUP_ID }
  : process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
    ? { mode: 'telegram', token: process.env.TELEGRAM_BOT_TOKEN, chat: process.env.TELEGRAM_CHAT_ID } : null;
let lastError: string | null = null;
let busy = false;
let stopped = false;

async function ingest(): Promise<void> {
  const from = (store.cursor('messages')?.block ?? -1) + 1;
  const response = await jsonRequest<{ events: ChainEvent[]; throughBlock: number; throughHash: string; gap: string | null; startBlock: number }>(new URL(`/events?fromBlock=${from}`, indexer).href);
  if (!Array.isArray(response.events) || !Number.isSafeInteger(response.throughBlock) || typeof response.throughHash !== 'string') throw new Error('Invalid indexer page');
  if (response.throughBlock < from) return;
  const events = response.events.filter(e => e.eventName !== 'Scheduler.Scheduled' && e.eventName !== 'Scheduler.Dispatched');
  // Persist input first. A crash before reduction replays safely from the messages cursor.
  store.saveBlock('history', response.throughBlock, response.throughHash, events);
  store.transaction(() => {
    for (const event of events) {
      const key = `item:${String(event.args.itemId ?? '')}`;
      const result = notificationFor(event, store.value<ItemState>(key), appUrl, decimals);
      store.setValue(key, result.item);
      for (const message of result.messages) store.enqueue(message.eventId, message);
    }
    store.setCursor('messages', response.throughBlock, response.throughHash);
  });
  if (response.gap) lastError = `History incomplete: ${response.gap}`;
}

async function tick(): Promise<void> {
  if (busy || stopped) return;
  busy = true;
  try {
    if (store.queueSize() < 900) {
      try { await ingest(); }
      catch (error) { lastError = error instanceof Error ? error.message : 'Notification ingestion failed'; }
    }
    const now = Date.now();
    const message = store.pending(now);
    if (config && message && nextDeliveryAt(store.recentDeliveryAttempts(now - 60_000), now, config.mode === 'debox' ? 5 : 60) <= now) {
      store.recordDeliveryAttempt(now);
      try { await deliver(config, message.payload as Notification); store.sent(message.id, Date.now()); lastError = null; }
      catch (error) {
        // Error details never contain keys, request URLs or provider response bodies.
        const reason = error instanceof RemoteError ? error.message : 'Notification request failed; delivery may be ambiguous';
        store.retry(message.id, now + backoffMs(message.attempts, error instanceof RemoteError ? error.retryAfterMs : 0), reason);
        lastError = reason;
      }
    }
  } catch (error) { lastError = error instanceof Error ? error.message : 'Notification ingestion failed'; console.error(lastError); }
  finally { busy = false; }
}

const app = new Hono();
app.get('/health', c => c.json({ configured: !!config, mode: config?.mode ?? 'unconfigured', cursor: store.cursor('messages') ?? null, queued: store.queueSize(), error: lastError }));
const server = serve({ fetch: app.fetch, port: Number(process.env.BOT_PORT ?? '8788'), hostname: '0.0.0.0' });
const timer = setInterval(() => void tick(), 1000);
void tick();
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  stopped = true; clearInterval(timer); server.close();
  const finish = setInterval(() => { if (!busy) { clearInterval(finish); store.close(); process.exit(0); } }, 100);
});
