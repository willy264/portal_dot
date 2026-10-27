import { expect, it, vi } from "vitest";
import { historyWithFallback } from "./history";

it("accepts a genuinely empty native block range without querying a weaker facade", async () => {
  const evm = vi.fn(async () => ["unrelated"]);
  expect(await historyWithFallback(async () => [], evm)).toEqual({
    logs: [],
    complete: true,
    source: "substrate",
  });
  expect(evm).not.toHaveBeenCalled();
});

it("does not turn pruned native history plus empty EVM logs into a complete history", async () => {
  const result = await historyWithFallback(
    async () => {
      throw new Error("historical state pruned");
    },
    async () => [],
  );
  expect(result).toEqual({
    logs: [],
    complete: false,
    source: "evm-rpc",
    gap: { native: "historical state pruned" },
  });
});

it("preserves useful fallback logs while explicitly marking unverified coverage", async () => {
  const result = await historyWithFallback(
    async () => {
      throw new Error("archive offline");
    },
    async () => [{ txHash: "public-evm-hash" }],
  );
  expect(result.complete).toBe(false);
  expect(result.logs).toEqual([{ txHash: "public-evm-hash" }]);
  expect(result.source).toBe("evm-rpc");
});

it("retains both failure reasons when neither interface can serve history", async () => {
  const result = await historyWithFallback(
    async () => {
      throw new Error("native pruned");
    },
    async () => {
      throw new Error("EVM range unavailable");
    },
  );
  expect(result).toEqual({
    logs: [],
    complete: false,
    source: "unavailable",
    gap: { native: "native pruned", evm: "EVM range unavailable" },
  });
});
