import { Hono } from "hono";
import { Store } from "@metermend/service-core";
import type { DeliveryReceipt } from "./delivery.js";
import type { Notification } from "./messages.js";

export type DeliveryProof = Omit<Notification, "content"> & {
  receipt: DeliveryReceipt;
};
const hash = (value: unknown): value is string =>
  typeof value === "string" && /^0x[0-9a-f]{64}$/i.test(value);
const timestamp = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value));

/** Copy an allowlist; never retain a provider response, chat identifier or message content. */
export function deliveryProof(
  message: Omit<Notification, "content">,
  receipt: DeliveryReceipt,
): DeliveryProof {
  if (
    !message ||
    typeof message.eventId !== "string" ||
    !message.eventId ||
    !receipt ||
    !timestamp(receipt.acknowledgedAt)
  )
    throw new Error("Invalid notification delivery evidence");
  let safeReceipt: DeliveryReceipt;
  if (receipt.provider === "telegram") {
    if (
      !Number.isSafeInteger(receipt.messageId) ||
      receipt.messageId <= 0 ||
      !timestamp(receipt.providerSentAt)
    )
      throw new Error("Invalid Telegram delivery evidence");
    safeReceipt = {
      provider: "telegram",
      messageId: receipt.messageId,
      providerSentAt: receipt.providerSentAt,
      acknowledgedAt: receipt.acknowledgedAt,
    };
  } else if (receipt.provider === "debox") {
    safeReceipt = {
      provider: "debox",
      messageId: null,
      providerSentAt: null,
      acknowledgedAt: receipt.acknowledgedAt,
    };
  } else throw new Error("Unknown notification provider");
  const url = new URL(message.link);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error(
      "Notification proof needs an application link without credentials",
    );
  const proof: DeliveryProof = {
    eventId: message.eventId,
    link: url.origin + url.pathname,
    receipt: safeReceipt,
  };
  if (
    typeof message.eventName === "string" &&
    /^[A-Za-z][A-Za-z0-9.]{0,79}$/.test(message.eventName)
  )
    proof.eventName = message.eventName;
  if (hash(message.txHash)) proof.txHash = message.txHash;
  if (Number.isSafeInteger(message.block) && message.block! >= 0)
    proof.block = message.block;
  if (hash(message.blockHash)) proof.blockHash = message.blockHash;
  if (
    typeof message.network === "string" &&
    /^[A-Za-z0-9-]{1,80}$/.test(message.network)
  )
    proof.network = message.network;
  if (typeof message.itemId === "string" && /^\d+$/.test(message.itemId))
    proof.itemId = message.itemId;
  if (typeof message.rentalId === "string" && /^\d+$/.test(message.rentalId))
    proof.rentalId = message.rentalId;
  if (message.variant === "available") proof.variant = "available";
  return proof;
}

/** An acknowledged message leaves the pending queue only when its proof is durable too. */
export function recordDelivery(
  store: Store,
  id: string,
  receipt: DeliveryReceipt,
): boolean {
  return store.transaction(() => {
    const row = store.db
      .prepare("SELECT state,payload FROM outbox WHERE id=?")
      .get(id);
    if (!row)
      throw new Error("Acknowledged notification is missing from the outbox");
    if (row.state === "sent") return false;
    const message = JSON.parse(String(row.payload)) as Notification;
    if (message.eventId !== id)
      throw new Error("Notification proof does not match its outbox entry");
    const proof = deliveryProof(message, receipt);
    store.sent(id, Date.parse(receipt.acknowledgedAt));
    store.observation("notification-delivered", proof);
    return true;
  });
}

/** Read-only evidence endpoint; pagination uses persistent observation IDs. */
export function deliveryRoutes(store: Store): Hono {
  const app = new Hono();
  app.get("/", (c) => {
    const rawAfter = c.req.query("after") ?? "0";
    const rawLimit = c.req.query("limit") ?? "100";
    const after = Number(rawAfter);
    const limit = Number(rawLimit);
    if (
      !/^\d+$/.test(rawAfter) ||
      !/^\d+$/.test(rawLimit) ||
      !Number.isSafeInteger(after) ||
      !Number.isSafeInteger(limit) ||
      after < 0 ||
      limit < 1 ||
      limit > 500
    )
      return c.json(
        {
          error:
            "after must be nonnegative and limit must be between 1 and 500",
        },
        400,
      );
    const rows = store.db
      .prepare(
        "SELECT id,observed_at,payload FROM observations WHERE kind='notification-delivered' AND id>? ORDER BY id LIMIT ?",
      )
      .all(after, limit + 1);
    try {
      const deliveries = rows.slice(0, limit).map((row) => {
        const saved = JSON.parse(String(row.payload)) as DeliveryProof;
        return {
          observationId: Number(row.id),
          observedAt: String(row.observed_at),
          ...deliveryProof(saved, saved.receipt),
        };
      });
      return c.json({
        deliveries,
        nextAfter: deliveries.at(-1)?.observationId ?? after,
        hasMore: rows.length > limit,
      });
    } catch {
      return c.json(
        {
          error:
            "Retained delivery evidence is unreadable; no delivery claim can be exported for this page",
        },
        503,
      );
    }
  });
  return app;
}
