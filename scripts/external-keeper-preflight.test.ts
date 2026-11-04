import { describe, expect, it } from "vitest";
import { encodeFunctionData, type Address } from "viem";
import { meterMendAbi } from "../packages/chain/src/abi";
import {
  assertExternalRefundBinding,
  type ExternalJobBinding,
} from "./external-keeper-preflight";

// Synthetic policy fixtures only; never written as live chain evidence.
const a = (digit: string) => `0x${digit.repeat(40)}` as Address;
function binding(): ExternalJobBinding {
  const meterMend = a("1"),
    keeper = a("2"),
    oldCronpot = a("3"),
    cronpot = a("4");
  const data = encodeFunctionData({
    abi: meterMendAbi,
    functionName: "finalizeRefund",
    args: [7n],
  });
  return {
    cronpot,
    meterMend,
    keeper,
    oldCronpot,
    actualBuiltInCronpot: oldCronpot,
    jobId: 1n,
    rentalId: 7n,
    oldJobId: 8n,
    timestamp: 1200n,
    job: {
      owner: keeper,
      target: meterMend,
      executeAfter: 1200n,
      status: 1,
      tip: 1n,
      data,
    },
    oldJob: {
      owner: meterMend,
      target: meterMend,
      executeAfter: 1200n,
      status: 4,
      tip: 0n,
      data,
    },
    rental: [3n, a("5"), 50000000000000000n, 1000n, 1200n, 2, 8n],
  };
}
describe("explicit external keeper refund policy", () => {
  it("accepts distinct corrected/old job IDs while preserving the built-in Cronpot", () => {
    expect(() => assertExternalRefundBinding(binding())).not.toThrow();
  });
  it("rejects treating the new Cronpot as MeterMend's built-in address", () => {
    const b = binding();
    b.actualBuiltInCronpot = b.cronpot;
    expect(() => assertExternalRefundBinding(b)).toThrow("original Cronpot");
  });
  it("rejects foreign owners and noncanonical callback bytes", () => {
    const b = binding();
    b.job.owner = b.meterMend;
    expect(() => assertExternalRefundBinding(b)).toThrow(
      "scheduled by the keeper",
    );
    const c = binding();
    c.job.data = `${c.job.data}00`;
    expect(() => assertExternalRefundBinding(c)).toThrow(
      "exact MeterMend refund",
    );
  });
  it("requires the original callback to have failed before corrected execution", () => {
    const b = binding();
    b.oldJob.status = 1;
    expect(() => assertExternalRefundBinding(b)).toThrow("terminal failure");
  });
  it("refuses closed/empty rentals and a mismatched original job", () => {
    for (const rental of [
      [3n, a("5"), 0n, 1000n, 1200n, 2, 8n],
      [3n, a("5"), 1n, 1000n, 1200n, 4, 8n],
      [3n, a("5"), 1n, 1000n, 1200n, 2, 1n],
    ] as const) {
      const b = binding();
      b.rental = rental;
      expect(() => assertExternalRefundBinding(b)).toThrow(
        "returned and funded",
      );
    }
  });
  it("enforces the exact due timestamp on both jobs", () => {
    for (const change of ["early", "new-deadline", "old-deadline"]) {
      const b = binding();
      if (change === "early") b.timestamp = 1199n;
      if (change === "new-deadline") b.job.executeAfter = 1199n;
      if (change === "old-deadline") b.oldJob.executeAfter = 1199n;
      expect(() => assertExternalRefundBinding(b)).toThrow("exact elapsed");
    }
  });
});
