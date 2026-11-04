import { expect, it } from "vitest";
import { demoSteps, demoExpectedFailures, eventSummary } from "./report-model";
import { encodeAbiParameters, encodeEventTopics } from "viem";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
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

it("marks the new rental's original callback as failed and deduplicates the retained receipt", () => {
  const receipt = { txHash: "original-failed", block: 8 };
  const demo = {
    transactions: { "original-cronpot-failed-new-rental": receipt },
    correctedAutomation: {
      transactions: { "original-cronpot-failed-new-rental": receipt },
      originalFailure: {
        ...receipt,
        callbackSuccess: false,
        reason: "OutOfGas (native transaction trace)",
      },
    },
  };
  const result = demoSteps(demo);
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    outcome: "failed",
    status: "OutOfGas (native transaction trace)",
    event: "JobExecuted(success=false); no DepositRefunded event",
  });
});

function correctedFixture() {
  // Synthetic evidence for presentation guards, never deployment proof.
  const execution = {
    txHash: `0x${"a".repeat(64)}`,
    blockHash: `0x${"b".repeat(64)}`,
    block: 10,
    jobExecuted: { jobId: "1", success: true },
    depositRefunded: { rentalId: "3", amount: "500" },
  };
  return {
    transactions: { "corrected-refund": execution },
    correctedAutomation: {
      status: "completed",
      jobId: "1",
      rentalId: "3",
      execution,
      transactions: { "corrected-refund": execution },
    },
  };
}

it("publishes a corrected automatic refund once with matched successful callback and refund evidence", () => {
  const demo = correctedFixture();
  const rows = demoSteps(demo);
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({
    step: "Corrected Cronpot automatic refund",
    status: "Finalized automatic refund",
    event: "JobExecuted(success=true) + DepositRefunded",
  });
});

it("does not claim corrected automation from an incomplete status, false callback or wrong rental", () => {
  for (const alter of [
    (demo: ReturnType<typeof correctedFixture>) => {
      demo.correctedAutomation.status = "deployed";
    },
    (demo: ReturnType<typeof correctedFixture>) => {
      demo.correctedAutomation.execution.jobExecuted.success = false;
    },
    (demo: ReturnType<typeof correctedFixture>) => {
      demo.correctedAutomation.execution.depositRefunded.rentalId = "4";
    },
  ]) {
    const demo = correctedFixture();
    alter(demo);
    const rows = demoSteps(demo);
    expect(rows[0].status).toBe("Corrected refund outcome not verified");
    expect(
      rows.some((row) => row.status === "Finalized automatic refund"),
    ).toBe(false);
  }
});

it("decodes JobExecuted from the separately recorded corrected contract address", () => {
  const address = "0x2222222222222222222222222222222222222222";
  const data = encodeAbiParameters(
    [{ type: "bool" }, { type: "bytes" }],
    [true, "0x"],
  );
  const topics = encodeEventTopics({
    abi: cronpotAbi,
    eventName: "JobExecuted",
    args: { jobId: 1n, executor: address },
  });
  const row = {
    events: [
      {
        type: "Revive",
        value: {
          type: "ContractEmitted",
          value: { contract: address, data, topics },
        },
      },
    ],
  };
  expect(eventSummary(row, { CorrectedCronpot: { address } }, 18).events).toBe(
    "JobExecuted",
  );
});
