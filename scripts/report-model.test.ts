import { expect, it } from "vitest";
import { demoSteps, eventSummary } from "./report-model";
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
