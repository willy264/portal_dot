import { describe, expect, it } from "vitest";
import {
  assertNativeCallbackResult,
  validateRefundTrace,
} from "./refund-trace.js";
import { encodeAbiParameters } from "viem";
import {
  call,
  expected,
  fixtureTrace,
  jobLog,
  refundLog,
} from "../test/preflight-fixtures.js";

describe("successful refund callback trace proof", () => {
  it("requires exactly a true ABI callback result from native execution", () => {
    expect(() =>
      assertNativeCallbackResult(
        encodeAbiParameters([{ type: "bool" }], [true]),
      ),
    ).not.toThrow();
    expect(() =>
      assertNativeCallbackResult(
        encodeAbiParameters([{ type: "bool" }], [false]),
      ),
    ).toThrow("returned false");
    expect(() => assertNativeCallbackResult("0x")).toThrow(
      "callback-success boolean",
    );
  });
  it("accepts the complete successful callback and matching event pair", () => {
    expect(validateRefundTrace(fixtureTrace(), expected)).toMatchObject({
      jobExecuted: {
        jobId: expected.jobId,
        executor: expected.executor,
        success: true,
      },
      depositRefunded: {
        rentalId: expected.rentalId,
        amount: expected.deposit,
      },
    });
  });
  it("rejects outer success with a failed callback, false job result or empty logs", () => {
    const failed = fixtureTrace();
    failed.calls[0].error = "OutOfGas";
    failed.logs = [jobLog({ success: false })];
    expect(() => validateRefundTrace(failed, expected)).toThrow("callback");
    const falseResult = fixtureTrace();
    falseResult.logs = [jobLog({ success: false })];
    expect(() => validateRefundTrace(falseResult, expected)).toThrow(
      "success=true",
    );
    const noLogs = fixtureTrace();
    noLogs.logs = [];
    noLogs.calls[0].logs = [];
    expect(() => validateRefundTrace(noLogs, expected)).toThrow("exactly one");
  });
  it.each([
    { rentalId: 99n },
    { itemId: 99n },
    { renter: expected.executor },
    { deposit: expected.deposit - 1n },
  ])("rejects a mismatched refund %#", (change) => {
    const trace = fixtureTrace();
    trace.calls[0].logs = [refundLog(change)];
    expect(() => validateRefundTrace(trace, expected)).toThrow(
      "complete rental deposit",
    );
  });
  it("rejects a different job or executor even with an otherwise successful refund", () => {
    for (const change of [{ jobId: 99n }, { executor: expected.renter }]) {
      const trace = fixtureTrace();
      trace.logs = [jobLog(change)];
      expect(() => validateRefundTrace(trace, expected)).toThrow(
        "job, executor",
      );
    }
    const trace = fixtureTrace();
    trace.from = expected.renter;
    expect(() => validateRefundTrace(trace, expected)).toThrow(
      "exact zero-value",
    );
  });
  it("rejects nonzero outer or callback value, root revert and forged callback logs", () => {
    const nonzero = fixtureTrace();
    nonzero.value = [1n, 0n, 0n, 0n];
    expect(() => validateRefundTrace(nonzero, expected)).toThrow("zero-value");
    const paid = fixtureTrace();
    paid.calls[0].value = [1n, 0n, 0n, 0n];
    expect(() => validateRefundTrace(paid, expected)).toThrow("callback");
    const reverted = fixtureTrace();
    reverted.error = "ContractReverted";
    expect(() => validateRefundTrace(reverted, expected)).toThrow(
      "root trace failed",
    );
    const forged = fixtureTrace();
    forged.calls[0].logs = [];
    forged.logs.unshift(refundLog());
    expect(() => validateRefundTrace(forged, expected)).toThrow("exactly one");
  });
  it("rejects missing branches, duplicated events and reversed execution order", () => {
    const incomplete = fixtureTrace();
    incomplete.child_call_count = 2;
    expect(() => validateRefundTrace(incomplete, expected)).toThrow(
      "incomplete",
    );
    const duplicate = fixtureTrace();
    duplicate.logs.push(jobLog());
    expect(() => validateRefundTrace(duplicate, expected)).toThrow(
      "exactly one",
    );
    const reversed = fixtureTrace();
    reversed.logs[0].position = 0;
    expect(() => validateRefundTrace(reversed, expected)).toThrow(
      "refund must precede",
    );
  });
  it("allows a deferred tip but discards all logs in its reverted branch", () => {
    const trace = fixtureTrace();
    const tip = call(expected.cronpot, expected.executor, "0x");
    tip.error = "OutOfGas";
    tip.logs = [refundLog()];
    trace.calls.push(tip);
    trace.child_call_count = 2;
    trace.logs[0].position = 2;
    expect(validateRefundTrace(trace, expected).jobExecuted.success).toBe(true);
  });
});
