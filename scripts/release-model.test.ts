import { describe, expect, it } from "vitest";
import { decodeAbiParameters } from "viem";
import {
  assertNoUnresolvedAttempts,
  assertDraftReplaceAllowed,
  assertSimulationNonce,
  assertNoncePreflight,
  constructorData,
  remainingBudget,
  successfulReceipt,
  validateCandidate,
  type CandidateProfile,
} from "./release-model";

function profile(): CandidateProfile {
  return {
    schemaVersion: 1,
    id: "synthetic-test-only",
    verified: false,
    code: {
      compiler: "0.8.30+synthetic",
      creationBytecodeSha256: "12".repeat(32),
      runtimeBytecodeSha256: "34".repeat(32),
    },
    contracts: null,
    runtime: {
      genesisHash: `0x${"ab".repeat(32)}`,
      specName: "portaldot-v3",
      specVersion: 3002,
      transactionVersion: 2,
      codeHash: `0x${"cd".repeat(32)}`,
      nativeToEthRatio: "10000",
    },
    contractGas: {
      targetGasLimit: "1000000",
      postCallGasReserve: "100000",
      tipGasLimit: "30000",
      minCallGas: "1125874",
    },
    native: {
      weightLimit: { ref_time: "100", proof_size: "10" },
      storageDepositLimit: "20",
      feeReserve: "10",
    },
    ethereum: { gasPriceMin: "1", gasPriceMax: "1" },
    verification: {
      artifact: "deployments/synthetic-test.json",
      sha256: "ef".repeat(32),
      nativeBoundedSuccess: false,
      ethereumTraceSuccess: true,
    },
  };
}
function receipt() {
  return {
    txHash: `0x${"ab".repeat(32)}`,
    blockHash: `0x${"cd".repeat(32)}`,
    block: 100,
    extrinsicIndex: 1,
    events: [{ type: "System", value: { type: "ExtrinsicSuccess" } }],
  };
}
const clear = {
  finalizedNonce: 18,
  bestNonce: 18,
  nextIndex: 18,
  expectedNonce: 18,
  simulationNonce: 18,
  pendingPoolSize: 0,
  contractPresentAtFinalized: false,
  contractPresentAtBest: false,
};

describe("isolated release safety", () => {
  it("keeps predeployment simulation status distinct from a verified addressed profile", () => {
    expect(() => validateCandidate(profile())).not.toThrow();
    const activated = profile();
    activated.verified = true as false;
    expect(() => validateCandidate(activated)).toThrow("unverified candidate");
    const addressed = profile();
    addressed.contracts = {} as unknown as null;
    expect(() => validateCandidate(addressed)).toThrow("unverified candidate");
  });
  it("refuses altered arithmetic, saturated budgets and incomplete native caps", () => {
    const bad = profile();
    bad.contractGas.minCallGas = "1125873";
    expect(() => validateCandidate(bad)).toThrow("immutable");
    const huge = profile();
    huge.contractGas.targetGasLimit = ((1n << 64n) - 1n).toString();
    expect(() => validateCandidate(huge)).toThrow("immutable");
    const missing = profile();
    delete (missing.native.weightLimit as any).proof_size;
    expect(() => validateCandidate(missing)).toThrow("proof_size");
    const reserve = profile();
    reserve.contractGas.postCallGasReserve = "30000";
    expect(() => validateCandidate(reserve)).toThrow("immutable");
  });
  it("requires matching runtime denomination and contained evidence paths", () => {
    const units = profile();
    units.runtime.nativeToEthRatio = "1";
    expect(() => validateCandidate(units)).toThrow("runtime identity");
    const path = profile();
    path.verification.artifact = "deployments/../../private.json";
    expect(() => validateCandidate(path)).toThrow("simulation");
  });
  it("encodes all immutable arguments and exact dependent MeterMend address", () => {
    const gas = profile().contractGas;
    expect(
      decodeAbiParameters(
        [{ type: "uint256" }, { type: "uint256" }, { type: "uint256" }],
        constructorData("Cronpot", gas, undefined, 0n),
      ),
    ).toEqual([1_000_000n, 100_000n, 30_000n]);
    const addr = "0x1111111111111111111111111111111111111111";
    expect(
      decodeAbiParameters(
        [{ type: "address" }, { type: "uint128" }],
        constructorData("MeterMend", gas, addr, 10000n),
      ),
    ).toEqual([addr, 10000n]);
    expect(() => constructorData("MeterMend", gas, undefined, 10000n)).toThrow(
      "exact release Cronpot",
    );
    expect(() => constructorData("MeterMend", gas, addr, 10001n)).toThrow(
      "native-unit",
    );
  });
  it("blocks every nonconfirmed original attempt even when its receipt exists", () => {
    for (const state of [
      "preparing",
      "submitted",
      "unknown",
      "failed",
      "finalized",
    ])
      expect(() =>
        assertNoUnresolvedAttempts({
          "deploy-Cronpot": { state, evidence: receipt() },
        }),
      ).toThrow("never retries");
    expect(() =>
      assertNoUnresolvedAttempts({
        "deploy-Cronpot": { state: "confirmed", evidence: receipt() },
      }),
    ).not.toThrow();
    expect(() =>
      assertNoUnresolvedAttempts({
        extra: { state: "confirmed", evidence: receipt() },
      }),
    ).toThrow("Unexpected");
  });
  it("does not treat a failed or incomplete receipt as a reusable deployment", () => {
    expect(successfulReceipt(receipt())).toBe(true);
    const failed = receipt();
    failed.events.push({ type: "System", value: { type: "ExtrinsicFailed" } });
    expect(successfulReceipt(failed)).toBe(false);
    expect(successfulReceipt({ ...receipt(), blockHash: null })).toBe(false);
    expect(successfulReceipt({ ...receipt(), events: [] })).toBe(false);
  });
  it("requires finalized/best/next nonces to agree, an empty pool and absent destination", () => {
    expect(() => assertNoncePreflight(clear)).not.toThrow();
    for (const field of [
      "finalizedNonce",
      "bestNonce",
      "nextIndex",
      "expectedNonce",
      "simulationNonce",
    ])
      expect(() => assertNoncePreflight({ ...clear, [field]: 19 })).toThrow(
        "no broadcast",
      );
    expect(() =>
      assertNoncePreflight({ ...clear, pendingPoolSize: 1 }),
    ).toThrow("no broadcast");
    expect(() =>
      assertNoncePreflight({ ...clear, contractPresentAtFinalized: true }),
    ).toThrow("no broadcast");
    expect(() =>
      assertNoncePreflight({ ...clear, contractPresentAtBest: true }),
    ).toThrow("no broadcast");
  });
  it("rejects a nonce change between simulation and journal preparation", () => {
    expect(() => assertSimulationNonce(18, 18)).not.toThrow();
    expect(() => assertSimulationNonce(18, 19)).toThrow("re-plan");
    expect(() =>
      assertNoncePreflight({
        ...clear,
        finalizedNonce: 19,
        bestNonce: 19,
        nextIndex: 19,
        expectedNonce: 19,
      }),
    ).toThrow("no broadcast");
  });
  it("archives only an untouched draft, preserving every prior attempt", () => {
    const draft = {
      active: false,
      status: "prepared-not-deployed",
      contracts: {},
      intentHash: "12".repeat(32),
    };
    expect(() => assertDraftReplaceAllowed(draft, {})).not.toThrow();
    for (const state of [
      "preparing",
      "submitted",
      "unknown",
      "failed",
      "confirmed",
    ])
      expect(() =>
        assertDraftReplaceAllowed(draft, { "deploy-Cronpot": { state } }),
      ).toThrow("preserve");
    for (const changed of [
      { active: true },
      { contracts: { Cronpot: {} } },
      { status: "deployed-not-activated" },
      { intentHash: "../unsafe" },
    ])
      expect(() =>
        assertDraftReplaceAllowed({ ...draft, ...changed }, {}),
      ).toThrow("preserve");
  });
  it("requires the whole remaining plan and rehearsal reserve, not just the first deploy", () => {
    const input = {
      complete: true,
      estimates: [
        { storageLimit: 500n, fee: 10n },
        { storageLimit: 900n, fee: 20n },
      ],
      allowance: 600n,
      retained: 25n,
      available: 1500n,
    };
    expect(remainingBudget(input)).toEqual({
      deployment: 1436n,
      required: 2061n,
      available: 1500n,
      funded: false,
      shortfall: 561n,
    });
    expect(remainingBudget({ ...input, available: 2061n }).funded).toBe(true);
    expect(() => remainingBudget({ ...input, complete: false })).toThrow(
      "Complete deployment",
    );
    expect(() => remainingBudget({ ...input, allowance: 0n })).toThrow(
      "Complete deployment",
    );
    expect(
      remainingBudget({
        ...input,
        estimates: input.estimates.slice(1),
        available: 1549n,
      }).funded,
    ).toBe(true);
  });
});
