import { describe, expect, it } from "vitest";
import {
  demoTransactionsFrom,
  failedDemoTransactionsFrom,
  expectedFailuresFrom,
} from "../lib/proof";

// Synthetic model fixtures only; never written to deployments/ or claimed live.
const failureHash = `0x${"f".repeat(64)}`;
const successHash = `0x${"a".repeat(64)}`;
const blockHash = `0x${"b".repeat(64)}`;
const key = "operator-reserve-spending-approval-rejected";
const receipt = {
  label: "Operator reserve-spending approval rejected",
  status: "finalized-rejected",
  finalized: true,
  txHash: failureHash,
  blockHash,
  block: 24,
  extrinsicIndex: 2,
  expectedError: "NotArbiter",
  expectedErrorSource: "live operator simulation before signing",
  dispatchError: {
    type: "Module",
    value: { type: "Revive", value: { type: "ContractReverted" } },
  },
  signedBy: "test-operator",
  value: "0",
  events: [{ type: "System", value: { type: "ExtrinsicFailed" } }],
};

describe("expected rejection proof", () => {
  it("separates a real-failure-shaped callback receipt from successful demo evidence", () => {
    const demo = {
      transactions: { rent: { txHash: successHash, block: 20 } },
      failedTransactions: {
        callback: {
          txHash: failureHash,
          blockHash,
          block: 24,
          label: "Cronpot callback failed",
          status: "Callback failed; no refund",
          event: "JobExecuted(success=false); no DepositRefunded event",
        },
      },
    };
    expect(demoTransactionsFrom(demo).map((row) => row.txHash)).toEqual([
      successHash,
    ]);
    expect(failedDemoTransactionsFrom(demo)[0]).toMatchObject({
      txHash: failureHash,
      label: "Cronpot callback failed",
      status: "Callback failed; no refund",
      eventNames: ["JobExecuted(success=false); no DepositRefunded event"],
    });
    expect(expectedFailuresFrom(demo)).toEqual([]);
  });
  it("keeps rejection receipts and their assertions out of the successful flow", () => {
    const demo = {
      transactions: { rent: { txHash: successHash, block: 20 } },
      expectedFailures: { [key]: receipt },
      assertions: { [key]: { passed: true, txHash: failureHash } },
    };
    expect(demoTransactionsFrom(demo).map((row) => row.txHash)).toEqual([
      successHash,
    ]);
    expect(expectedFailuresFrom(demo)[0]).toMatchObject({
      label: receipt.label,
      txHash: failureHash,
      blockHash,
      block: "24",
      status: "Finalized rejection",
      dispatchError: "Module.Revive.ContractReverted",
      expectedError: "NotArbiter",
      expectedErrorSource: "live operator simulation before signing",
      eventNames: ["System.ExtrinsicFailed"],
      reserveAssertion: "Reserve and repair unchanged (verified)",
    });
  });

  it("does not promote a dry run or incomplete receipt into finalized evidence", () => {
    expect(
      expectedFailuresFrom({
        expectedFailures: { [key]: { preflight: { error: "NotArbiter" } } },
      }),
    ).toEqual([]);
    const result = expectedFailuresFrom({
      expectedFailures: { [key]: { ...receipt, events: [] } },
    });
    expect(result[0].status).toBe("Rejection finality not verified");
    expect(result[0].reserveAssertion).toBe(
      "Reserve and repair comparison pending",
    );
  });

  it("requires the unchanged-state assertion to reference this rejection receipt", () => {
    const result = expectedFailuresFrom({
      expectedFailures: { [key]: receipt },
      assertions: { [key]: { passed: true, txHash: successHash } },
    });
    expect(result[0].status).toBe("Finalized rejection");
    expect(result[0].reserveAssertion).toBe(
      "Reserve and repair comparison pending",
    );
  });

  it("does not confirm contradictory receipts or invalid block identifiers", () => {
    for (const invalid of [
      { ...receipt, block: -1 },
      { ...receipt, block: "not-a-block" },
      {
        ...receipt,
        events: [
          ...receipt.events,
          { type: "System", value: { type: "ExtrinsicSuccess" } },
        ],
      },
      { ...receipt, events: [...receipt.events, ...receipt.events] },
    ]) {
      expect(
        expectedFailuresFrom({ expectedFailures: { [key]: invalid } })[0]
          .status,
      ).toBe("Rejection finality not verified");
    }
  });

  it("handles reconciled event wrappers and publishes only selected evidence fields", () => {
    const result = expectedFailuresFrom({
      expectedFailures: {
        [key]: {
          ...receipt,
          events: [{ event: receipt.events[0] }],
          dispatchError: {
            dispatch_error: receipt.dispatchError,
            privateKey: "DO_NOT_PUBLISH",
          },
          preflight: { error: "NotArbiter", revertData: "PRIVATE_RAW_INPUT" },
          seed: "SECRET_SEED",
        },
      },
    });
    expect(result[0].dispatchError).toBe("Module.Revive.ContractReverted");
    expect(result[0].status).toBe("Finalized rejection");
    expect(JSON.stringify(result)).not.toMatch(
      /DO_NOT_PUBLISH|PRIVATE_RAW_INPUT|SECRET_SEED/,
    );
  });
});
