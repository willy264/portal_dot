import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Store, type ChainEvent } from "../src/store.js";

describe("durable ingestion and delivery", () => {
  it("resumes after restart and does not duplicate a replayed finalized event or message", () => {
    const directory = mkdtempSync(join(tmpdir(), "metermend-store-"));
    const path = join(directory, "events.sqlite");
    const event: ChainEvent = {
      id: "v3:block:tx:0",
      network: "v3",
      address: "0x1",
      eventName: "Rented",
      args: { fee: 100n },
      txHash: "0x2",
      block: 42,
      blockHash: "0x3",
      eventIndex: 0,
      observedAt: "2026-10-27T00:00:00Z",
      source: "substrate",
    };
    let store = new Store(path);
    store.saveBlock("meter", 42, "0x3", [event]);
    store.enqueue(event.id, { message: "rented" });
    store.sent(event.id, 100);
    store.close();
    store = new Store(path);
    expect(store.cursor("meter")).toEqual({ block: 42, hash: "0x3" });
    store.saveBlock("meter", 42, "0x3", [event]);
    expect(store.events()).toHaveLength(1);
    expect(store.events()[0]?.args.fee).toBe("100");
    expect(store.enqueue(event.id, { message: "rented" })).toBe(false);
    expect(store.pending(1000)).toBeUndefined();
    store.close();
    if (
      !resolve(directory).startsWith(
        resolve(tmpdir()) + "\\metermend-store-",
      ) &&
      !resolve(directory).startsWith(resolve(tmpdir()) + "/metermend-store-")
    )
      throw new Error("Unexpected temporary directory");
    rmSync(directory, { recursive: true, force: true });
  });
});
