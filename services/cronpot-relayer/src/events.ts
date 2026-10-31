import { Hono } from "hono";
import { Store, json } from "@metermend/service-core";

/** Historical pages must remain readable after the node prunes their blocks. */
export function eventRoutes(
  store: Store,
  startBlock: number,
  status: () => { gap: string | null; automaticRefundCount: number | null },
): Hono {
  const app = new Hono();
  app.get("/", (c) => {
    const cursor = store.cursor("chain") ?? null;
    const supplied = c.req.query("fromBlock");
    if (!Number.isSafeInteger(startBlock) || startBlock < 0)
      return c.json({ error: "Indexer deployment is not configured" }, 503);
    const requested = supplied === undefined ? startBlock : Number(supplied);
    if (
      (supplied !== undefined && !/^\d+$/.test(supplied)) ||
      !Number.isSafeInteger(requested) ||
      requested < 0
    )
      return c.json(
        { error: "fromBlock must be a nonnegative safe integer" },
        400,
      );
    const from = Math.max(startBlock, requested);
    const through = cursor
      ? supplied === undefined
        ? cursor.block
        : Math.min(cursor.block, from + 49)
      : from - 1;
    const current = status();
    let throughHash = "";
    if ((cursor && through === cursor.block) || through >= from) {
      try {
        throughHash = store.blockHash(through) ?? "";
        if (!throughHash)
          throw new Error(`Finalized block ${through} has no retained hash`);
      } catch (error) {
        const gap =
          error instanceof Error
            ? error.message
            : "Retained block hash is unavailable";
        return c.json(
          {
            error:
              "The event page boundary cannot be verified from retained history. Restore authoritative block evidence before advancing the consumer cursor.",
            gap: [current.gap, gap].filter(Boolean).join("; "),
            cursor,
            startBlock,
          },
          503,
        );
      }
    }
    return c.body(
      json({
        events: through >= from ? store.eventRange(from, through) : [],
        cursor,
        ...current,
        startBlock,
        throughBlock: through,
        throughHash,
      }),
      200,
      { "Content-Type": "application/json" },
    );
  });
  return app;
}
