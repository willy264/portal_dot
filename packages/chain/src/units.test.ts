import { describe, expect, it } from "vitest";
import { evmToNative, nativeToEvm, withTwentyPercentMargin } from "./units";

describe("native / EVM denomination boundary", () => {
  it("represents one tPOT consistently across native and EVM interfaces", () => {
    expect(nativeToEvm(100_000_000_000_000n)).toBe(1_000_000_000_000_000_000n);
    expect(evmToNative(1_000_000_000_000_000_000n)).toBe(100_000_000_000_000n);
  });
  it("preserves large escrow amounts exactly without JavaScript number rounding", () => {
    const original = (1n << 110n) + 987654321n;
    expect(evmToNative(nativeToEvm(original))).toBe(original);
  });
  it("refuses silent loss of EVM dust and negative values", () => {
    expect(() => evmToNative(10_001n)).toThrow(/dust/);
    expect(() => nativeToEvm(-1n)).toThrow(/non-negative/);
    expect(() => evmToNative(-10_000n)).toThrow(/non-negative/);
  });
  it("rounds estimation headroom upward, including small proof sizes", () => {
    expect(withTwentyPercentMargin(1n)).toBe(2n);
    expect(withTwentyPercentMargin(101n)).toBe(122n);
    expect(withTwentyPercentMargin(0n)).toBe(0n);
  });
});
