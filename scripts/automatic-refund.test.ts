import { describe, expect, it, vi } from "vitest";
import { encodeFunctionData, type Address } from "viem";
import { meterMendAbi } from "../packages/chain/src/abi";

// Import the policies without invoking the executable worker, loading a signer or making RPC calls.
vi.mock("./lib", async (original) => ({
  ...(await original<typeof import("./lib")>()),
  run: vi.fn(),
}));
import {
  assertDirectRefundResult,
  correctedRefundRentalId,
  directRefundEligibility,
} from "./automatic-refund";

const address = (digit: string) => `0x${digit.repeat(40)}` as Address;
const meter = address("1"),
  renter = address("2");
const rental = [1n, renter, 50000n, 100n, 220n, 2, 4n] as const;
const data = encodeFunctionData({
  abi: meterMendAbi,
  functionName: "finalizeRefund",
  args: [3n],
});

describe("ordinary rental direct fallback", () => {
  it("allows only a funded Returned rental whose deadline has elapsed at finality", () => {
    expect(directRefundEligibility(rental, 220n, false, false)).toBeNull();
    expect(directRefundEligibility(rental, 219n, false, false)).toContain(
      "not elapsed",
    );
    for (const status of [0, 1, 3, 4])
      expect(
        directRefundEligibility(
          [1n, renter, 50000n, 100n, 220n, status, 4n],
          300n,
          false,
          false,
        ),
      ).toContain("not Returned");
    expect(
      directRefundEligibility(
        [1n, renter, 0n, 100n, 220n, 2, 4n],
        300n,
        false,
        false,
      ),
    ).not.toBeNull();
  });
  it("preserves active corrected jobs and disables fallback during recorded proof", () => {
    expect(directRefundEligibility(rental, 300n, true, false)).toContain(
      "active corrected",
    );
    expect(directRefundEligibility(rental, 300n, false, true)).toContain(
      "disabled",
    );
  });
  it("binds active jobs to the exact MeterMend target and canonical refund calldata", () => {
    const job = {
      owner: address("3"),
      target: meter,
      executeAfter: 220n,
      status: 1,
      tip: 0n,
      data,
    };
    expect(correctedRefundRentalId(job, meter)).toBe(3n);
    expect(
      correctedRefundRentalId({ ...job, target: address("4") }, meter),
    ).toBeNull();
    expect(
      correctedRefundRentalId({ ...job, data: `${data}00` }, meter),
    ).toBeNull();
    expect(
      correctedRefundRentalId({ ...job, data: "0x1234" }, meter),
    ).toBeNull();
    expect(
      correctedRefundRentalId(
        {
          ...job,
          data: encodeFunctionData({
            abi: meterMendAbi,
            functionName: "rent",
            args: [3n],
          }),
        },
        meter,
      ),
    ).toBeNull();
  });
  it("requires the exact refund recipient and amount plus a closed zero-deposit readback", () => {
    const intent = {
      type: "direct-refund" as const,
      cronpot: address("3"),
      meterMend: meter,
      rentalId: "3",
      data,
      value: "0" as const,
      expected: { itemId: "1", renter, deposit: "50000", refundAt: "220" },
    };
    const refunded = { rentalId: 3n, itemId: 1n, renter, amount: 50000n };
    const after = [1n, renter, 0n, 100n, 220n, 4, 4n] as const;
    expect(() =>
      assertDirectRefundResult(intent, refunded, after),
    ).not.toThrow();
    for (const invalid of [
      { ...refunded, amount: 49999n },
      { ...refunded, rentalId: 4n },
      { ...refunded, renter: address("5") },
    ])
      expect(() => assertDirectRefundResult(intent, invalid, after)).toThrow(
        "does not match",
      );
    expect(() => assertDirectRefundResult(intent, refunded, rental)).toThrow(
      "does not match",
    );
  });
});
