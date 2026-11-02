import { describe, expect, it } from "vitest";
import {
  assertProfileReadbacks,
  assertSupportedRuntime,
  parseExecutionProfile,
  traceBudget,
} from "./execution-profile.js";
import { expected, fixtureProfile } from "../test/preflight-fixtures.js";

const parse = (value: unknown) =>
  parseExecutionProfile(value, expected.cronpot, expected.meterMend);
describe("reviewed keeper runtime and deployment profile", () => {
  it("disables writes for an old manifest or unverified candidate", () => {
    expect(() => parse(undefined)).toThrow(
      "verified manifest.executionProfile",
    );
    expect(() => parse({ ...fixtureProfile(), verified: false })).toThrow(
      "verified manifest.executionProfile",
    );
    expect(parse(fixtureProfile()).id).toBe("synthetic-unit-profile");
    const pendingNative = fixtureProfile();
    pendingNative.verification.nativeBoundedSuccess = false;
    expect(parse(pendingNative).verification.nativeBoundedSuccess).toBe(false);
  });
  it.each([
    "genesisHash",
    "specName",
    "specVersion",
    "transactionVersion",
    "codeHash",
    "nativeToEthRatio",
  ] as const)(
    "rejects a changed %s even when the manifest claims verification",
    (key) => {
      const profile = fixtureProfile();
      (profile.runtime as Record<string, unknown>)[key] =
        typeof profile.runtime[key] === "number" ? 999 : "unreviewed";
      expect(() => parse(profile)).toThrow("unsupported runtime");
      expect(() => assertSupportedRuntime(profile.runtime)).toThrow(
        "recalibrate",
      );
    },
  );
  it("binds the profile to both contract addresses and all four immutable gas readbacks", () => {
    const profile = fixtureProfile();
    expect(() =>
      parseExecutionProfile(profile, expected.meterMend, expected.cronpot),
    ).toThrow("addresses");
    const readbacks = {
      targetGasLimit: 550000000000000n,
      postCallGasReserve: 200000000000000n,
      tipGasLimit: 30000n,
      minCallGas: 758730158740159n,
      cronpot: expected.cronpot,
    };
    assertProfileReadbacks(profile, readbacks);
    for (const key of [
      "targetGasLimit",
      "postCallGasReserve",
      "tipGasLimit",
      "minCallGas",
    ] as const)
      expect(() =>
        assertProfileReadbacks(profile, { ...readbacks, [key]: 1n }),
      ).toThrow(key);
    expect(() =>
      assertProfileReadbacks(profile, {
        ...readbacks,
        cronpot: expected.meterMend,
      }),
    ).toThrow("MeterMend.cronpot");
  });
  it("requires finite positive caps, exact constructor arithmetic and calibration evidence", () => {
    const profile = fixtureProfile();
    profile.contractGas.minCallGas = "758730158740158";
    expect(() => parse(profile)).toThrow("constructor");
    profile.contractGas.minCallGas = "758730158740159";
    profile.native.storageDepositLimit = "0";
    expect(() => parse(profile)).toThrow("positive decimal");
    const missing = fixtureProfile();
    missing.verification.artifact = "deployments/../.env.json";
    expect(() => parse(missing)).toThrow("evidence");
  });
  it("derives a rounded-down finite gas envelope from native caps and real spendable balance", () => {
    const profile = fixtureProfile();
    const budget = traceBudget(profile, 25360n, 3000000000000000n);
    expect(budget.gas * budget.gasPrice).toBeLessThanOrEqual(
      budget.nativeBudget * 10000n,
    );
    expect(budget.gas).toBeGreaterThan(BigInt(profile.contractGas.minCallGas));
    expect(() => traceBudget(profile, 25361n, 3000000000000000n)).toThrow(
      "calibrated range",
    );
    expect(() => traceBudget(profile, 25360n, budget.nativeBudget)).toThrow(
      "actual spendable",
    );
  });
});
