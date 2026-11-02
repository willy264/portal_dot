import {
  GENESIS_HASH,
  NATIVE_TO_EVM_RATIO,
  nativeToEvm,
} from "@metermend/chain";

/** A runtime upgrade requires a new measured profile and an explicit code review. */
export const SUPPORTED_RUNTIME = {
  genesisHash: GENESIS_HASH,
  specName: "portaldot-v3",
  specVersion: 3002,
  transactionVersion: 2,
  codeHash:
    "0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2",
  nativeToEthRatio: NATIVE_TO_EVM_RATIO.toString(),
} as const;

export interface ExecutionProfile {
  schemaVersion: 1;
  id: string;
  verified: true;
  /** Reviewed compiled code; verified configuration does not claim a live refund. */
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
  contracts: { Cronpot: string; MeterMend: string };
  contractGas: {
    targetGasLimit: string;
    postCallGasReserve: string;
    tipGasLimit: string;
    minCallGas: string;
  };
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
    ethereumTraceSuccess: true;
  };
}

const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const same = (a: unknown, b: string) =>
  typeof a === "string" && a.toLowerCase() === b.toLowerCase();
const UINT64_MAX = (1n << 64n) - 1n;

export function positiveInteger(
  value: unknown,
  name: string,
  max = (1n << 128n) - 1n,
): bigint {
  if (typeof value !== "string" || !/^[1-9][0-9]*$/.test(value))
    throw new Error(
      `Execution profile ${name} must be a positive decimal string`,
    );
  const n = BigInt(value);
  if (n > max)
    throw new Error(`Execution profile ${name} exceeds its finite limit`);
  return n;
}

export function assertSupportedRuntime(
  runtime: ExecutionProfile["runtime"],
): void {
  for (const [key, expected] of Object.entries(SUPPORTED_RUNTIME)) {
    if (runtime[key as keyof typeof runtime] !== expected)
      throw new Error(
        `Keeper writes disabled: unsupported runtime ${key}; recalibrate and review the runtime allowlist`,
      );
  }
}

/** Manifest values never silently fall back to the original failing gas constants. */
export function parseExecutionProfile(
  value: unknown,
  cronpot: string,
  meterMend: string,
): ExecutionProfile {
  const p = object(value);
  if (
    p.schemaVersion !== 1 ||
    p.verified !== true ||
    typeof p.id !== "string" ||
    !p.id.trim()
  )
    throw new Error(
      "Keeper writes disabled: a verified manifest.executionProfile is required; keep indexing until calibrated deployment evidence is recorded",
    );
  assertSupportedRuntime(
    object(p.runtime) as unknown as ExecutionProfile["runtime"],
  );
  const code = object(p.code);
  if (
    typeof code.compiler !== "string" ||
    !/^0\.8\.30\+/.test(code.compiler) ||
    ![code.creationBytecodeSha256, code.runtimeBytecodeSha256].every(
      (value) => typeof value === "string" && /^[\da-f]{64}$/i.test(value),
    )
  )
    throw new Error(
      "Keeper writes disabled: reviewed compiler and creation/runtime bytecode hashes are required",
    );
  const contracts = object(p.contracts);
  if (
    !/^0x[\da-f]{40}$/i.test(cronpot) ||
    !/^0x[\da-f]{40}$/i.test(meterMend) ||
    !same(contracts.Cronpot, cronpot) ||
    !same(contracts.MeterMend, meterMend)
  )
    throw new Error(
      "Keeper writes disabled: execution profile contract addresses do not match this deployment",
    );
  const gas = object(p.contractGas);
  const target = positiveInteger(
    gas.targetGasLimit,
    "targetGasLimit",
    UINT64_MAX,
  );
  const reserve = positiveInteger(
    gas.postCallGasReserve,
    "postCallGasReserve",
    UINT64_MAX,
  );
  const tip = positiveInteger(gas.tipGasLimit, "tipGasLimit", UINT64_MAX);
  const minimum = positiveInteger(gas.minCallGas, "minCallGas", UINT64_MAX);
  if (
    reserve <= tip ||
    minimum !== target + (target + 62n) / 63n + 10_000n + reserve
  )
    throw new Error(
      "Execution profile gas reserves do not match the Cronpot constructor",
    );
  const native = object(p.native),
    weight = object(native.weightLimit);
  positiveInteger(weight.ref_time, "weight.ref_time", UINT64_MAX);
  positiveInteger(weight.proof_size, "weight.proof_size", UINT64_MAX);
  positiveInteger(native.storageDepositLimit, "storageDepositLimit");
  positiveInteger(native.feeReserve, "feeReserve");
  const eth = object(p.ethereum);
  const minPrice = positiveInteger(eth.gasPriceMin, "gasPriceMin");
  const maxPrice = positiveInteger(eth.gasPriceMax, "gasPriceMax");
  if (minPrice > maxPrice)
    throw new Error("Execution profile gas price range is reversed");
  const verified = object(p.verification);
  if (
    typeof verified.nativeBoundedSuccess !== "boolean" ||
    verified.ethereumTraceSuccess !== true ||
    typeof verified.artifact !== "string" ||
    !/^deployments\/[\w./-]+\.json$/.test(verified.artifact) ||
    verified.artifact.split("/").includes("..") ||
    typeof verified.sha256 !== "string" ||
    !/^[\da-f]{64}$/i.test(verified.sha256)
  )
    throw new Error(
      "Keeper writes disabled: native verification status and Ethereum trace calibration evidence, path and SHA-256 are required",
    );
  return p as unknown as ExecutionProfile;
}

export function assertProfileReadbacks(
  profile: ExecutionProfile,
  actual: {
    targetGasLimit: bigint;
    postCallGasReserve: bigint;
    tipGasLimit: bigint;
    minCallGas: bigint;
    cronpot: string;
  },
): void {
  for (const key of [
    "targetGasLimit",
    "postCallGasReserve",
    "tipGasLimit",
    "minCallGas",
  ] as const)
    if (actual[key] !== BigInt(profile.contractGas[key]))
      throw new Error(
        `Keeper writes disabled: deployed Cronpot ${key} differs from its verified execution profile`,
      );
  if (!same(actual.cronpot, profile.contracts.Cronpot))
    throw new Error(
      "Keeper writes disabled: MeterMend.cronpot does not match the execution profile",
    );
}

/** Spending envelope comparison, not an equivalence between EVM gas and native weight. */
export function traceBudget(
  profile: ExecutionProfile,
  gasPrice: bigint,
  spendableNative: bigint,
) {
  if (
    gasPrice < BigInt(profile.ethereum.gasPriceMin) ||
    gasPrice > BigInt(profile.ethereum.gasPriceMax)
  )
    throw new Error(
      "Keeper preflight: runtime gas price is outside the calibrated range",
    );
  const nativeBudget =
    BigInt(profile.native.storageDepositLimit) +
    BigInt(profile.native.feeReserve);
  if (spendableNative <= nativeBudget)
    throw new Error(
      "Keeper preflight: actual spendable balance must exceed the full storage and fee envelope",
    );
  const gas = nativeToEvm(nativeBudget) / gasPrice;
  if (gas <= BigInt(profile.contractGas.minCallGas) || gas > UINT64_MAX)
    throw new Error(
      "Keeper preflight: finite trace envelope cannot cover the configured Cronpot call reserve",
    );
  return { gas, gasPrice, nativeBudget, evmBudget: gas * gasPrice };
}
