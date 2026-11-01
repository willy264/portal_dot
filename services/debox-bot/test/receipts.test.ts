import { afterEach, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { Hono } from "hono";
import { Store } from "@metermend/service-core";
import { deliveryRoutes, recordDelivery } from "../src/receipts.js";
import type { Notification } from "../src/messages.js";
import type { DeliveryReceipt } from "../src/delivery.js";

const stores: Store[] = [];
const directories: string[] = [];
const hash = `0x${"ab".repeat(32)}`;
const receipt: DeliveryReceipt = {
  provider: "telegram",
  messageId: 42,
  providerSentAt: "2026-10-31T12:00:00.000Z",
  acknowledgedAt: "2026-10-31T12:00:01.000Z",
};
const message: Notification = {
  content: "Private message body is not public proof",
  eventId: "event-1",
  eventName: "Rented",
  txHash: hash,
  block: 123,
  blockHash: hash,
  network: "portaldot-v3-testnet",
  itemId: "3",
  rentalId: "7",
  link: "https://metermend.vercel.app/rentals/7?token=private-query#private-fragment",
};
const open = (path = ":memory:") => {
  const store = new Store(path);
  stores.push(store);
  return store;
};
const app = (store: Store) =>
  new Hono().route("/deliveries", deliveryRoutes(store));
afterEach(() => {
  vi.restoreAllMocks();
  for (const store of stores.splice(0)) store.close();
  for (const directory of directories.splice(0)) {
    if (
      !resolve(directory).startsWith(
        resolve(tmpdir()) + sep + "metermend-delivery-",
      )
    )
      throw new Error("Unexpected cleanup path");
    rmSync(directory, { recursive: true, force: true });
  }
});

it("persists delivery proof with outbox completion and serves it after restart without private fields", async () => {
  const directory = mkdtempSync(join(tmpdir(), "metermend-delivery-"));
  directories.push(directory);
  const path = join(directory, "bot.sqlite");
  let store = open(path);
  store.enqueue(message.eventId, {
    ...message,
    token: "private-token",
    chatId: "private-chat",
  });
  expect(
    recordDelivery(store, message.eventId, {
      ...receipt,
      chat: "private-chat",
    } as DeliveryReceipt),
  ).toBe(true);
  expect(store.queueSize()).toBe(0);
  expect(recordDelivery(store, message.eventId, receipt)).toBe(false);
  stores.pop();
  store.close();
  store = open(path);
  const response = await app(store).request("/deliveries");
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.deliveries).toHaveLength(1);
  expect(body.deliveries[0]).toMatchObject({
    eventId: message.eventId,
    eventName: "Rented",
    txHash: hash,
    block: 123,
    itemId: "3",
    rentalId: "7",
    link: "https://metermend.vercel.app/rentals/7",
    receipt,
  });
  expect(body).toMatchObject({ nextAfter: 1, hasMore: false });
  expect(JSON.stringify(body)).not.toMatch(/private|content|chatId|token/);
  expect(JSON.stringify(store.observations())).not.toMatch(
    /private|content|chatId|token/,
  );
});

it("rolls back the sent state if the delivery proof cannot be persisted", () => {
  const store = open();
  store.enqueue(message.eventId, message);
  vi.spyOn(store, "observation").mockImplementation(() => {
    throw new Error("Disk write failed");
  });
  expect(() => recordDelivery(store, message.eventId, receipt)).toThrow(
    "Disk write failed",
  );
  expect(store.pending(Date.now())?.id).toBe(message.eventId);
  expect(store.observations()).toEqual([]);
});

it("does not manufacture provenance for legacy queued messages or missing outbox entries", async () => {
  const store = open();
  expect(() => recordDelivery(store, "absent", receipt)).toThrow(
    "missing from the outbox",
  );
  store.enqueue("legacy", {
    content: "Legacy notification",
    eventId: "legacy",
    link: "https://metermend.vercel.app/",
  });
  recordDelivery(store, "legacy", receipt);
  const body = await (await app(store).request("/deliveries")).json();
  expect(body.deliveries[0]).toMatchObject({ eventId: "legacy", receipt });
  expect(body.deliveries[0].eventName).toBeUndefined();
  expect(body.deliveries[0].txHash).toBeUndefined();
});

it("paginates persisted acknowledgements and ignores unrelated observations", async () => {
  const store = open();
  store.observation("private-debug", { token: "secret" });
  for (let id = 1; id <= 3; id++) {
    store.enqueue(`event-${id}`, { ...message, eventId: `event-${id}` });
    recordDelivery(store, `event-${id}`, { ...receipt, messageId: 40 + id });
  }
  const api = app(store);
  const first = await (await api.request("/deliveries?limit=2")).json();
  expect(
    first.deliveries.map((item: { eventId: string }) => item.eventId),
  ).toEqual(["event-1", "event-2"]);
  expect(first.hasMore).toBe(true);
  const last = await (
    await api.request(`/deliveries?after=${first.nextAfter}&limit=2`)
  ).json();
  expect(
    last.deliveries.map((item: { eventId: string }) => item.eventId),
  ).toEqual(["event-3"]);
  expect(last.hasMore).toBe(false);
  for (const query of [
    "after=-1",
    "after=NaN",
    "limit=0",
    "limit=501",
    "limit=2.5",
  ])
    expect((await api.request(`/deliveries?${query}`)).status).toBe(400);
});

it("does not export corrupt retained delivery proof", async () => {
  const store = open();
  store.observation("notification-delivered", {
    ...message,
    receipt: { provider: "telegram", token: "secret", chatId: "private-chat" },
  });
  const response = await app(store).request("/deliveries");
  expect(response.status).toBe(503);
  expect(await response.text()).not.toMatch(/secret|private-chat/);
});
