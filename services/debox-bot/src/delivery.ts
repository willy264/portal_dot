import { jsonRequest, RemoteError } from '@metermend/service-core';
import type { Notification } from './messages.js';

export type DeliveryConfig = { mode: 'debox'; key: string; group: string } | { mode: 'telegram'; token: string; chat: string };

export async function deliver(config: DeliveryConfig, message: Notification): Promise<void> {
  if (config.mode === 'debox') {
    const body = await jsonRequest<{ ok?: boolean; success?: boolean; retry_after?: number }>('https://open.debox.pro/openapi/bot/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-KEY': config.key },
      body: JSON.stringify({ chat_id: config.group, chat_type: 'group', content: message.content, parse_mode: 'text' })
    });
    if (body.ok !== true || body.success !== true) throw new RemoteError('DeBox did not acknowledge successful delivery', 200, Math.max(0, body.retry_after ?? 0) * 1000);
  } else {
    const body = await jsonRequest<{ ok?: boolean; parameters?: { retry_after?: number } }>(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: config.chat, text: message.content, link_preview_options: { is_disabled: true } })
    });
    if (body.ok !== true) throw new RemoteError('Telegram did not acknowledge successful delivery', 200, (body.parameters?.retry_after ?? 0) * 1000);
  }
}
