import { describe, expect, it, vi } from "vitest";
import type { Address } from "viem";

// Load only the funding policy; never generate a key, inspect .env, or contact the chain.
vi.mock("./lib", async (original) => ({
  ...await original<typeof import("./lib")>(),
  run: vi.fn(),
}));
import { assertActionsFundingIntent } from "./setup-actions-keeper";

const h160 = `0x${"a".repeat(40)}` as Address;
const base = {
  type: "actions-keeper-initial-funding" as const,
  from: "deployer", to: "dedicated-keeper", h160,
  targetNative: "1000000000000000", amountNative: "1000000000000000", recipientBalanceBeforeNative: "0",
};
const check = (intent = base) => assertActionsFundingIntent(intent, "deployer", "dedicated-keeper", h160);

describe("one-time dedicated Actions keeper funding", () => {
  it("allows exactly 10 tPOT for an empty account and only the shortfall for a funded one", () => {
    expect(() => check()).not.toThrow();
    expect(() => check({ ...base, recipientBalanceBeforeNative: "400000000000000", amountNative: "600000000000000" })).not.toThrow();
    expect(() => check({ ...base, recipientBalanceBeforeNative: "1200000000000000", amountNative: "0" })).not.toThrow();
  });
  it("rejects an increased amount, moved target, or changed source/destination", () => {
    for (const changed of [
      { ...base, amountNative: "1000000000000001" },
      { ...base, targetNative: "1100000000000000" },
      { ...base, from: "someone-else" },
      { ...base, to: "another-keeper" },
      { ...base, h160: `0x${"b".repeat(40)}` as Address },
      { ...base, amountNative: "-1" },
    ]) expect(() => check(changed)).toThrow();
  });
  it("does not allow reusing the original transfer after the recorded account already has the target", () => {
    expect(() => check({ ...base, recipientBalanceBeforeNative: base.targetNative })).toThrow("original frozen amount");
  });
});
