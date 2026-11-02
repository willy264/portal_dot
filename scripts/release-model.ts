import { encodeAbiParameters, isAddress, type Address, type Hex } from "viem";

export const RELEASE_DIRECTORY = "deployments/releases/v2";
export const RELEASE_NAMES = ["Cronpot", "MeterMend"] as const;
export type ReleaseName = (typeof RELEASE_NAMES)[number];
export type GasProfile = {
  targetGasLimit: string;
  postCallGasReserve: string;
  tipGasLimit: string;
  minCallGas: string;
};
export type CandidateProfile = {
  schemaVersion: 1;
  id: string;
  verified: false;
  code: {
    compiler: string;
    creationBytecodeSha256: string;
    runtimeBytecodeSha256: string;
  };
  runtime: {
    genesisHash: string;
    specName: string;
    specVersion: number;
    transactionVersion: number;
    codeHash: string;
    nativeToEthRatio: string;
  };
  contracts: null;
  contractGas: GasProfile;
  native: {
    weightLimit: { ref_time: string; proof_size: string };
    storageDepositLimit: string;
    feeReserve: string;
  };
  ethereum: { gasPriceMin: string; gasPriceMax: string };
  verification: {
    artifact: string;
    sha256: string;
    nativeBoundedSuccess: boolean;
    ethereumTraceSuccess: boolean;
  };
};

export function unsigned(value: unknown, label: string): bigint {
  if (typeof value !== "string" || !/^(0|[1-9]\d*)$/.test(value))
    throw new Error(`${label} must be an unsigned decimal string`);
  return BigInt(value);
}

export function validateCandidate(profile: CandidateProfile): void {
  if (
    profile?.schemaVersion !== 1 ||
    !profile.id ||
    profile.verified !== false ||
    profile.contracts !== null
  )
    throw new Error(
      "Release requires an unverified candidate profile with no deployed addresses",
    );
  const { targetGasLimit, postCallGasReserve, tipGasLimit, minCallGas } =
    profile.contractGas ?? {};
  const target = unsigned(targetGasLimit, "target gas"),
    reserve = unsigned(postCallGasReserve, "post-call reserve"),
    tip = unsigned(tipGasLimit, "tip gas");
  const minimum = target + (target + 62n) / 63n + 10_000n + reserve;
  if (
    target === 0n ||
    tip === 0n ||
    reserve <= tip ||
    minimum > (1n << 64n) - 1n ||
    unsigned(minCallGas, "minimum gas") !== minimum
  )
    throw new Error("Invalid immutable Cronpot gas configuration");
  const r = profile.runtime;
  if (
    !/^0\.8\.30\+/.test(profile.code?.compiler ?? "") ||
    ![
      profile.code?.creationBytecodeSha256,
      profile.code?.runtimeBytecodeSha256,
    ].every(
      (value) => typeof value === "string" && /^[\da-f]{64}$/i.test(value),
    )
  )
    throw new Error("Candidate requires reviewed compiler and bytecode hashes");
  if (
    !r ||
    !/^0x[\da-f]{64}$/i.test(r.genesisHash) ||
    !/^0x[\da-f]{64}$/i.test(r.codeHash) ||
    r.specName !== "portaldot-v3" ||
    r.specVersion !== 3002 ||
    !Number.isSafeInteger(r.transactionVersion) ||
    r.transactionVersion < 0 ||
    r.nativeToEthRatio !== "10000"
  )
    throw new Error("Candidate runtime identity is incomplete or unsupported");
  for (const [key, value] of Object.entries({
    ref_time: profile.native?.weightLimit?.ref_time,
    proof_size: profile.native?.weightLimit?.proof_size,
    storageDepositLimit: profile.native?.storageDepositLimit,
    feeReserve: profile.native?.feeReserve,
  }))
    if (unsigned(value, key) === 0n) throw new Error(`${key} must be positive`);
  const low = unsigned(profile.ethereum?.gasPriceMin, "minimum gas price"),
    high = unsigned(profile.ethereum?.gasPriceMax, "maximum gas price");
  if (low === 0n || high < low) throw new Error("Invalid gas price range");
  if (
    !profile.verification?.ethereumTraceSuccess ||
    !/^deployments\/[\w/.-]+\.json$/.test(profile.verification.artifact) ||
    profile.verification.artifact.split("/").includes("..") ||
    !/^[\da-f]{64}$/i.test(profile.verification.sha256)
  )
    throw new Error(
      "Candidate lacks the recorded corrected-contract simulation",
    );
}

export function constructorData(
  name: ReleaseName,
  profile: GasProfile,
  cronpot: Address | undefined,
  tip: bigint,
): Hex {
  if (name === "Cronpot")
    return encodeAbiParameters(
      [{ type: "uint256" }, { type: "uint256" }, { type: "uint256" }],
      [
        BigInt(profile.targetGasLimit),
        BigInt(profile.postCallGasReserve),
        BigInt(profile.tipGasLimit),
      ],
    );
  if (!cronpot || !isAddress(cronpot) || /^0x0{40}$/i.test(cronpot))
    throw new Error("MeterMend requires the exact release Cronpot address");
  if (tip < 0n || tip > (1n << 128n) - 1n || tip % 10_000n !== 0n)
    throw new Error("Invalid exact native-unit Cronpot tip");
  return encodeAbiParameters(
    [{ type: "address" }, { type: "uint128" }],
    [cronpot, tip],
  );
}

export function successfulReceipt(value: any): boolean {
  return (
    !!value &&
    /^0x[\da-f]{64}$/i.test(value.txHash) &&
    /^0x[\da-f]{64}$/i.test(value.blockHash) &&
    Number.isSafeInteger(value.block) &&
    value.block >= 0 &&
    Number.isSafeInteger(value.extrinsicIndex) &&
    value.extrinsicIndex >= 0 &&
    Array.isArray(value.events) &&
    value.events.some((raw: any) => {
      const e = raw.event ?? raw;
      return e.type === "System" && e.value?.type === "ExtrinsicSuccess";
    }) &&
    !value.events.some((raw: any) => {
      const e = raw.event ?? raw;
      return e.type === "System" && e.value?.type === "ExtrinsicFailed";
    })
  );
}

export function assertNoUnresolvedAttempts(steps: Record<string, any>): void {
  for (const [key, entry] of Object.entries(steps)) {
    if (!RELEASE_NAMES.some((name) => key === `deploy-${name}`))
      throw new Error(`Unexpected release journal key ${key}`);
    if (entry.state !== "confirmed" || !successfulReceipt(entry.evidence))
      throw new Error(
        `${key} has a prior ${entry.state} attempt. Reconcile its original hash and nonce; release tooling never retries it.`,
      );
  }
}

export function assertNoncePreflight(observation: {
  finalizedNonce: number;
  bestNonce: number;
  nextIndex: number;
  pendingPoolSize: number;
  expectedNonce: number;
  simulationNonce: number;
  contractPresentAtFinalized: boolean;
  contractPresentAtBest: boolean;
}): void {
  const {
    finalizedNonce,
    bestNonce,
    nextIndex,
    expectedNonce,
    simulationNonce,
  } = observation;
  if (
    ![
      finalizedNonce,
      bestNonce,
      nextIndex,
      expectedNonce,
      simulationNonce,
    ].every((n) => Number.isSafeInteger(n) && n >= 0) ||
    finalizedNonce !== bestNonce ||
    finalizedNonce !== nextIndex ||
    finalizedNonce !== expectedNonce ||
    finalizedNonce !== simulationNonce ||
    observation.pendingPoolSize !== 0 ||
    observation.contractPresentAtFinalized ||
    observation.contractPresentAtBest
  )
    throw new Error(
      "Release preflight changed: nonce, pool or predicted contract state requires reconciliation; no broadcast",
    );
}

/** A changed draft may be archived only before any deployment attempt exists. */
export function assertDraftReplaceAllowed(
  release: any,
  steps: Record<string, unknown>,
): void {
  if (
    release?.active !== false ||
    release.status !== "prepared-not-deployed" ||
    !release.contracts ||
    Object.keys(release.contracts).length !== 0 ||
    Object.keys(steps).length !== 0 ||
    typeof release.intentHash !== "string" ||
    !/^[\da-f]{64}$/i.test(release.intentHash)
  )
    throw new Error(
      "Existing v2 release intent changed after an attempt or activation; preserve its records",
    );
}

export function assertSimulationNonce(before: number, after: number): void {
  if (!Number.isSafeInteger(before) || before < 0 || before !== after)
    throw new Error(
      "Deployer nonce changed during preparation; re-plan before any release journal entry or broadcast",
    );
}

export function remainingBudget(input: {
  complete: boolean;
  estimates: { storageLimit: bigint; fee: bigint }[];
  allowance: bigint;
  retained: bigint;
  available: bigint;
}) {
  if (
    !input.complete ||
    input.allowance <= 0n ||
    input.retained <= 0n ||
    input.available < 0n ||
    input.estimates.some((e) => e.storageLimit < 0n || e.fee <= 0n)
  )
    throw new Error(
      "Complete deployment, fees, rehearsal allowance and retained-funds budget is required",
    );
  const deployment = input.estimates.reduce(
    (sum, e) => sum + e.storageLimit + (e.fee * 120n + 99n) / 100n,
    0n,
  );
  const required = deployment + input.allowance + input.retained;
  return {
    deployment,
    required,
    available: input.available,
    funded: input.available >= required,
    shortfall: input.available < required ? required - input.available : 0n,
  };
}
