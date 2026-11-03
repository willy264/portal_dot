import { expect, it } from "vitest";
import {
  checkQuote,
  CONTINUATION_CAP,
  NATIVE,
  plannedMaximum,
} from "./continuation-budget";
it("reserves the complete flow below the hard cap without crediting storage refunds", () => {
  expect(plannedMaximum).toBe(8_139_100_000_000_000n);
  expect(plannedMaximum).toBeLessThan(CONTINUATION_CAP);
});
it("refuses increased storage, fees, changed value and unknown actions", () => {
  expect(() => checkQuote("direct-refund", 1n, 1n, 0n)).toThrow();
  expect(() =>
    checkQuote("rent-second", 0n, NATIVE, 6_000_000_000_000n),
  ).toThrow();
  expect(() => checkQuote("rent-second", 0n, 1n, 0n)).toThrow();
  expect(() => checkQuote("deploy", 0n, 0n, 0n)).toThrow();
});
