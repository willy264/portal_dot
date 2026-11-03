import { Store, type ChainEvent } from "../packages/service-core/src/store";
import { getNativeContractLogs, GENESIS_HASH, getFinalizedHead } from "../packages/chain/src/client";
import { meterMendAbi } from "../packages/chain/src/abi";
import { notificationFor, type ItemState, type Notification } from "../services/debox-bot/src/messages";
import { run, readJson, writeJson, requireContract, pathAt, flag, now, json } from "./lib";

// Replay only canonical finalized demo events into the existing bot's deduplicated
// outbox. Its regular ingestion cursor and item reducer state are never advanced.
await run(async () => {
  const demo = readJson<any>("deployments/demo-run.json");
  if (demo.continuation?.status !== "completed") throw Error("Completed live recovery required");
  const meter = requireContract("MeterMend");
  const head = await getFinalizedHead();
  const events: ChainEvent[] = [];
  for (const key of Object.keys(demo.continuation.costs)) {
    const receipt = demo.transactions[key];
    if (!receipt) continue; // Expected failed reserve attempt emits no notification.
    if (receipt.block > head.number) throw Error("Receipt is not finalized");
    const logs = await getNativeContractLogs(meterMendAbi, meter.address, receipt.block, receipt.block);
    for (const log of logs) {
      if (log.txHash !== receipt.txHash || log.blockHash !== receipt.blockHash) continue;
      if (!Number.isSafeInteger(log.eventIndex)) throw Error("Missing native event index");
      events.push({ ...log, id: `${GENESIS_HASH}:${log.blockHash}:${log.eventIndex}`, eventIndex: log.eventIndex!, network: "portaldot-v3-testnet", observedAt: now(), source: "substrate" });
    }
    console.log(json({ verified: key, block: receipt.block, events: logs.length }));
  }
  const store = new Store(process.env.BOT_DB_PATH ?? pathAt("data/debox.sqlite"));
  try {
    const states = new Map<string, ItemState>();
    const messages: Notification[] = [];
    for (const event of events.sort((a, b) => a.block - b.block || a.eventIndex - b.eventIndex)) {
      const key = `item:${String(event.args.itemId ?? "")}`;
      const previous = states.get(key) ?? store.value<ItemState>(key);
      const result = notificationFor(event, previous, "https://metermend.vercel.app", 18);
      states.set(key, result.item);
      for (const message of result.messages) {
        message.content = `Testnet demo with labeled fixture images. ${message.content}`;
        if (event.eventName === "DepositRefunded") message.content += " Direct keeper refund; the original Cronpot callback failed.";
        messages.push(message);
      }
    }
    const proof: any = { observedAt: now(), status: flag("enqueue") ? "enqueued-for-existing-worker" : "prepared-not-enqueued", source: "fresh canonical native block events matched to finalized demo receipts", modifiesIndexerCursor: false, events, notifications: messages.map(({ content, ...m }) => m) };
    writeJson("deployments/notification-recovery.json", proof);
    if (flag("enqueue")) {
      proof.newlyEnqueued = store.transaction(() => messages.reduce((n, m) => n + Number(store.enqueue(m.eventId, m)), 0));
      writeJson("deployments/notification-recovery.json", proof);
    }
    console.log(json({ status: proof.status, notifications: messages.length, newlyEnqueued: proof.newlyEnqueued }));
  } finally { store.close(); }
});
