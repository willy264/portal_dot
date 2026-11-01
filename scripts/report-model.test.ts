import { expect, it } from "vitest";
import { demoSteps, demoExpectedFailures, eventSummary } from "./report-model";
import { encodeAbiParameters, encodeEventTopics } from "viem";
import { meterMendAbi } from "../packages/chain/src/abi";
it("accepts the resumable demo transaction map and includes the worker transaction in chronological order", () => {
  const result = demoSteps({
    transactions: {
      later: { txHash: "b", block: 20 },
      earlier: { txHash: "a", block: 10 },
    },
    automaticRefund: {
      mode: "keeper",
      refund: { txHash: "worker", block: 15, args: { amount: "5" } },
    },
  });
  expect(result.map((step) => step.txHash)).toEqual(["a", "worker", "b"]);
  expect(result[1].step).toBe("automatic-refund (keeper)");
});
it("decodes real contract event bytes instead of displaying only the Revive pallet name", () => {
  const contract = "0x1111111111111111111111111111111111111111";
  const topics = encodeEventTopics({
    abi: meterMendAbi,
    eventName: "IncomeWithdrawn",
    args: { operator: contract },
  });
  const data = encodeAbiParameters(
    [{ type: "uint256" }],
    [1000000000000000000n],
  );
  const result = eventSummary(
    {
      events: [
        {
          type: "Revive",
          value: { type: "ContractEmitted", value: { contract, topics, data } },
        },
      ],
    },
    { MeterMend: { address: contract } },
    18,
  );
  expect(result.events).toBe("IncomeWithdrawn");
  expect(result.amounts).toBe("amount: 1 tPOT");
});
it("renders expected rejections separately without increasing successful demo step counts", () => {
  // Synthetic model input, not a deployment artifact.
  const demo = {
    transactions: { rent: { txHash: "success", block: 1 } },
    expectedFailures: {
      "operator-reserve-spending-approval-rejected": {
        label: "Operator reserve-spending approval rejected",
        txHash: `0x${"a".repeat(64)}`,
        blockHash: `0x${"b".repeat(64)}`,
        block: 2,
        finalized: true,
        expectedError: "NotArbiter",
        dispatchError: { type: "Revive", value: { type: "ContractReverted" } },
        events: [{ type: "System", value: { type: "ExtrinsicFailed" } }],
      },
    },
  };
  expect(demoSteps(demo)).toHaveLength(1);
  expect(demoExpectedFailures(demo)).toHaveLength(1);
  expect(demoExpectedFailures(demo)[0].status).toBe("Finalized rejection");
  expect(demoExpectedFailures(demo)[0].dispatchError).toBe(
    "Revive.ContractReverted",
  );
});
it("retains a failed Cronpot callback without inventing an automatic refund", () => {
  // Synthetic receipt used only to check report behavior.
  const result = demoSteps({
    transactions: { returned: { txHash: "return", block: 1 } },
    failedTransactions: {
      callback: {
        label: "Cronpot callback failed",
        txHash: "failed-callback",
        block: 2,
        event: "JobExecuted(success=false); no DepositRefunded event",
        status: "Callback failed",
      },
    },
  });
  expect(result.map((row) => row.txHash)).toEqual([
    "return",
    "failed-callback",
  ]);
  expect(result[1]).toMatchObject({
    outcome: "failed",
    status: "Callback failed",
  });
  expect(
    result.some((row) => String(row.step).startsWith("automatic-refund")),
  ).toBe(false);
  expect(eventSummary(result[1], {}, 18).events).toBe(
    "JobExecuted(success=false); no DepositRefunded event",
  );
});
