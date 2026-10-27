import { expect, it } from "vitest";
import { Scanner } from "../src/scanner.js";
import { Store } from "../src/store.js";

it("does not advance past a missing finalized block and resumes from the persisted cursor", async () => {
  const store = new Store(":memory:");
  let missing = true;
  const scanner = new Scanner(
    store,
    {
      head: async () => ({ number: 103, hash: "103", timestamp: 1000n }),
      block: async (number) => {
        if (number === 102 && missing) throw new Error("History pruned");
        return { number, hash: String(number), timestamp: 1000n, events: [] };
      },
    },
    100,
  );
  await expect(scanner.tick()).rejects.toThrow("History pruned");
  expect(store.cursor("chain")?.block).toBe(101);
  expect(scanner.gap).toBe("History pruned");
  missing = false;
  await scanner.tick();
  expect(store.cursor("chain")?.block).toBe(103);
  expect(scanner.gap).toBeNull();
  store.close();
});

it("rolls back a partially enqueued block when processing fails", () => {
  const store = new Store(":memory:");
  expect(() =>
    store.transaction(() => {
      store.enqueue("one", { message: "first" });
      store.setCursor("messages", 42, "hash");
      throw new Error("storage failure");
    }),
  ).toThrow();
  expect(store.queueSize()).toBe(0);
  expect(store.cursor("messages")).toBeUndefined();
  store.close();
});
