import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AccountId, Binary, Enum } from "polkadot-api";
import {
  decodeFunctionData,
  encodeFunctionData,
  toHex,
  type Address,
} from "viem";
import {
  CHAIN_ID,
  getApi,
  getClient,
  getFinalizedHead,
  prepareBoundedReviveCall,
  readContract,
  submitAndWatch,
  SimulationError,
  type ChainSigner,
  type SubmissionOptions,
} from "@metermend/chain";
import { cronpotAbi, meterMendAbi } from "@metermend/chain/abi";
import {
  assertProfileReadbacks,
  assertSupportedRuntime,
  parseExecutionProfile,
  traceBudget,
  type ExecutionProfile,
} from "./execution-profile.js";
import {
  assertNativeCallbackResult,
  validateRefundTrace,
  type RefundExpectation,
} from "./refund-trace.js";
import { assertCalibrationBinding } from "./calibration.js";

const timeoutMs = () => Number(process.env.CHAIN_TIMEOUT_MS ?? "45000");
const optionsAt = (hash: string) => ({
  at: hash,
  signal: AbortSignal.timeout(timeoutMs()),
});
const equalAddress = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase();
const json = (value: unknown) =>
  JSON.stringify(value, (_key, item) =>
    typeof item === "bigint"
      ? item.toString()
      : item instanceof Uint8Array
        ? toHex(item)
        : item,
  );
const u256 = (n: bigint): [bigint, bigint, bigint, bigint] => {
  if (n < 0n || n >= 1n << 256n) throw new RangeError("Invalid U256");
  const mask = (1n << 64n) - 1n;
  return [n & mask, (n >> 64n) & mask, (n >> 128n) & mask, n >> 192n];
};
const fromU256 = (limbs: readonly bigint[]) =>
  limbs.reduce((sum, limb, index) => sum + (limb << BigInt(64 * index)), 0n);

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      getClient()._request<T>(method, params),
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Keeper preflight ${method} timed out`)),
          timeoutMs(),
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** The reviewed runtime identity is checked at the proof snapshot and again before signing. */
export async function verifyProfileRuntime(
  profile: ExecutionProfile,
  hash: string,
) {
  const [genesisHash, runtime, codeHash, ratio] = await Promise.all([
    rpc<string>("chain_getBlockHash", [0]),
    rpc<{ specName: string; specVersion: number; transactionVersion: number }>(
      "state_getRuntimeVersion",
      [hash],
    ),
    rpc<string>("state_getStorageHash", ["0x3a636f6465", hash]),
    getApi().constants.Revive.NativeToEthRatio(optionsAt(hash)),
  ]);
  const identity = {
    genesisHash,
    specName: runtime.specName,
    specVersion: runtime.specVersion,
    transactionVersion: runtime.transactionVersion,
    codeHash,
    nativeToEthRatio: ratio.toString(),
  };
  assertSupportedRuntime(identity);
  for (const key of Object.keys(identity) as (keyof typeof identity)[])
    if (identity[key] !== profile.runtime[key])
      throw new Error(
        `Keeper preflight: runtime ${key} differs from the manifest`,
      );
  return identity;
}

export async function verifyProfileContracts(
  profile: ExecutionProfile,
  at: { number: number; hash: string },
) {
  const cronpot = profile.contracts.Cronpot as Address,
    meterMend = profile.contracts.MeterMend as Address;
  const [
    targetGasLimit,
    postCallGasReserve,
    tipGasLimit,
    minCallGas,
    actualCronpot,
  ] = await Promise.all([
    readContract<bigint>(cronpotAbi, cronpot, "TARGET_GAS_LIMIT", [], { at }),
    readContract<bigint>(cronpotAbi, cronpot, "POST_CALL_GAS_RESERVE", [], {
      at,
    }),
    readContract<bigint>(cronpotAbi, cronpot, "TIP_GAS_LIMIT", [], { at }),
    readContract<bigint>(cronpotAbi, cronpot, "MIN_CALL_GAS", [], { at }),
    readContract<Address>(meterMendAbi, meterMend, "cronpot", [], { at }),
  ]);
  const readbacks = {
    targetGasLimit,
    postCallGasReserve,
    tipGasLimit,
    minCallGas,
    cronpot: actualCronpot,
  };
  assertProfileReadbacks(profile, readbacks);
  const api = getApi();
  const info = await api.query.Revive.AccountInfoOf.getValue(
    cronpot,
    optionsAt(at.hash),
  );
  if (info?.account_type.type !== "Contract")
    throw new Error(
      "Keeper writes disabled: Cronpot runtime code is not a deployed contract",
    );
  const codeHash = info.account_type.value.code_hash;
  const code = await api.query.Revive.PristineCode.getValue(
    codeHash,
    optionsAt(at.hash),
  );
  const runtimeBytecodeSha256 =
    code && createHash("sha256").update(code).digest("hex");
  if (runtimeBytecodeSha256 !== profile.code.runtimeBytecodeSha256)
    throw new Error(
      "Keeper writes disabled: actual Cronpot runtime bytecode differs from the reviewed calibration",
    );
  return { ...readbacks, codeHash, runtimeBytecodeSha256 };
}

/** All checks are read-only, including address mapping; no implicit account-registration transaction. */
export async function verifyKeeperConfiguration(
  profile: ExecutionProfile,
  root: string,
  signer: ChainSigner,
) {
  parseExecutionProfile(
    profile,
    profile.contracts.Cronpot,
    profile.contracts.MeterMend,
  );
  const artifact = await readFile(resolve(root, profile.verification.artifact));
  if (
    createHash("sha256").update(artifact).digest("hex") !==
    profile.verification.sha256.toLowerCase()
  )
    throw new Error(
      "Keeper writes disabled: calibration artifact SHA-256 does not match the reviewed execution profile",
    );
  assertCalibrationBinding(profile, JSON.parse(artifact.toString("utf8")));
  const at = await getFinalizedHead();
  const [runtime, readbacks, account] = await Promise.all([
    verifyProfileRuntime(profile, at.hash),
    verifyProfileContracts(profile, at),
    signerStateAt(signer, at.hash),
  ]);
  return {
    at,
    runtime,
    readbacks,
    executor: account.h160,
    artifact: profile.verification,
  };
}

async function signerStateAt(signer: ChainSigner, hash: string) {
  const api = getApi(),
    options = optionsAt(hash);
  const [account, h160, existentialDeposit] = await Promise.all([
    api.query.System.Account.getValue(signer.address, options),
    api.apis.ReviveApi.address(signer.address, options),
    api.constants.Balances.ExistentialDeposit(options),
  ]);
  const original = await api.query.Revive.OriginalAccount.getValue(
    h160,
    options,
  );
  if (
    !original ||
    !AccountId()
      .enc(original)
      .every((byte, index) => byte === AccountId().enc(signer.address)[index])
  )
    throw new Error(
      "Keeper writes disabled: relayer must already be funded and mapped; map explicitly before starting the keeper",
    );
  const retained =
    account.data.frozen > existentialDeposit
      ? account.data.frozen
      : existentialDeposit;
  return {
    h160: h160 as Address,
    nonce: account.nonce,
    balance: account.data.free,
    spendable: account.data.free > retained ? account.data.free - retained : 0n,
  };
}

type ChainJob = {
  owner: Address;
  target: Address;
  executeAfter: bigint;
  status: number;
  tip: bigint;
  data: `0x${string}`;
};
type ChainRental = readonly [
  bigint,
  Address,
  bigint,
  bigint,
  bigint,
  number,
  bigint,
];

/** Produces a prepared transaction only after both independent simulations pass. Never signs. */
export async function prepareKeeperRefund(
  profile: ExecutionProfile,
  signer: ChainSigner,
  jobId: bigint,
) {
  parseExecutionProfile(
    profile,
    profile.contracts.Cronpot,
    profile.contracts.MeterMend,
  );
  const at = await getFinalizedHead();
  const api = getApi(),
    cronpot = profile.contracts.Cronpot as Address,
    meterMend = profile.contracts.MeterMend as Address;
  const [runtime, readbacks, account, job, price] = await Promise.all([
    verifyProfileRuntime(profile, at.hash),
    verifyProfileContracts(profile, at),
    signerStateAt(signer, at.hash),
    readContract<ChainJob>(cronpotAbi, cronpot, "getJob", [jobId], { at }),
    api.apis.ReviveApi.gas_price_versioned(Enum("V1"), optionsAt(at.hash)),
  ]);
  if (
    job.status !== 1 ||
    !equalAddress(job.owner, meterMend) ||
    !equalAddress(job.target, meterMend) ||
    job.executeAfter > at.timestamp
  )
    throw new Error(
      "Keeper preflight: job is not a due MeterMend refund owned by this deployment",
    );
  const decoded = decodeFunctionData({ abi: meterMendAbi, data: job.data });
  if (decoded.functionName !== "finalizeRefund")
    throw new Error(
      "Keeper preflight: job calldata is outside the refund policy",
    );
  const rentalId = decoded.args[0];
  if (
    job.data !==
    encodeFunctionData({
      abi: meterMendAbi,
      functionName: "finalizeRefund",
      args: [rentalId],
    })
  )
    throw new Error(
      "Keeper preflight: refund calldata has trailing or noncanonical bytes",
    );
  const rental = await readContract<ChainRental>(
    meterMendAbi,
    meterMend,
    "rentals",
    [rentalId],
    { at },
  );
  if (
    rental[5] !== 2 ||
    rental[6] !== jobId ||
    rental[4] > at.timestamp ||
    rental[4] !== job.executeAfter
  )
    throw new Error(
      "Keeper preflight: rental is not returned with this due Cronpot job",
    );
  const expected: RefundExpectation = {
    cronpot,
    meterMend,
    executor: account.h160,
    jobId,
    rentalId,
    itemId: rental[0],
    renter: rental[1],
    deposit: rental[2],
  };
  const budget = traceBudget(profile, fromU256(price.value), account.spendable);
  const data = encodeFunctionData({
    abi: cronpotAbi,
    functionName: "execute",
    args: [jobId],
  });
  const prepared = await prepareBoundedReviveCall(
    { signer, to: cronpot, data, abi: cronpotAbi, timeoutMs: timeoutMs() },
    {
      weight_limit: {
        ref_time: BigInt(profile.native.weightLimit.ref_time),
        proof_size: BigInt(profile.native.weightLimit.proof_size),
      },
      storage_deposit_limit: BigInt(profile.native.storageDepositLimit),
    },
    at,
  );
  try {
    assertNativeCallbackResult(prepared.output);
  } catch (error) {
    throw new SimulationError(
      error instanceof Error ? error.message : String(error),
      { at, expected, caps: prepared.caps, native: prepared.bounded },
    );
  }
  // This is an independent Ethereum-context check; it is not proof of native gas equivalence.
  const response = await api.apis.ReviveApi.trace_call_versioned(
    Enum("V1", {
      tx: {
        authorization_list: [],
        blob_versioned_hashes: [],
        blobs: [],
        chain_id: u256(BigInt(CHAIN_ID)),
        access_list: undefined,
        nonce: undefined,
        max_fee_per_blob_gas: undefined,
        max_fee_per_gas: undefined,
        max_priority_fee_per_gas: undefined,
        "r#type": undefined,
        from: account.h160,
        gas: u256(budget.gas),
        gas_price: u256(budget.gasPrice),
        input: { input: Binary.fromHex(data), data: undefined },
        to: cronpot,
        value: u256(0n),
      },
      config: Enum("CallTracer", { with_logs: true, only_top_call: false }),
      state_overrides: undefined,
    }),
    optionsAt(at.hash),
  );
  if (
    !response.success ||
    response.value.type !== "V1" ||
    response.value.value.type !== "Call"
  )
    throw new SimulationError("Keeper preflight: Ethereum trace failed", {
      at,
      expected,
      response,
    });
  const trace = response.value.value.value;
  let events: ReturnType<typeof validateRefundTrace>;
  try {
    events = validateRefundTrace(trace, expected);
  } catch (error) {
    throw new SimulationError(
      error instanceof Error ? error.message : String(error),
      { at, expected, trace },
    );
  }
  // PAPI estimates against its latest finalized block, while both simulations above are pinned to at.hash.
  const feeEstimate = await prepared.tx.getEstimatedFees(signer.txCreator);
  if (feeEstimate > BigInt(profile.native.feeReserve))
    throw new Error(
      "Keeper preflight: estimated native fee exceeds the reviewed profile fee reserve",
    );
  const encodedCall = toHex(await prepared.tx.getEncodedData());
  return {
    tx: prepared.tx,
    evidence: {
      schemaVersion: 1,
      kind: "keeper-refund-preflight",
      profileId: profile.id,
      observedAt: new Date().toISOString(),
      at,
      runtime,
      readbacks,
      expected,
      account: { address: signer.address, ...account },
      native: {
        caps: prepared.caps,
        initial: prepared.initial,
        bounded: prepared.bounded,
        callbackSuccess: true,
        feeEstimate,
        feeEstimateSnapshot: "SDK latest finalized block",
        encodedCall,
      },
      ethereum: {
        ...budget,
        stateOverrides: false,
        timestampOverride: false,
        basis:
          "Independent Ethereum-context check with real balances; not an equivalence to native gas accounting",
        events,
        trace,
      },
      signedTransactions: 0,
    },
  };
}

/** Journal the verified preparation before entering the existing single-submission path. */
export async function executeKeeperRefund(input: {
  profile: ExecutionProfile;
  signer: ChainSigner;
  jobId: bigint;
  journal: (evidence: unknown) => void;
  onStatus?: SubmissionOptions["onStatus"];
}) {
  let prepared: Awaited<ReturnType<typeof prepareKeeperRefund>>;
  try {
    prepared = await prepareKeeperRefund(
      input.profile,
      input.signer,
      input.jobId,
    );
    const latest = await getFinalizedHead();
    await verifyProfileRuntime(input.profile, latest.hash);
    input.journal(JSON.parse(json(prepared.evidence)));
  } catch (error) {
    input.journal(
      JSON.parse(
        json({
          kind: "keeper-refund-preflight",
          status: "rejected",
          observedAt: new Date().toISOString(),
          jobId: input.jobId,
          signedTransactions: 0,
          error: error instanceof Error ? error.message : String(error),
          details: error instanceof SimulationError ? error.details : undefined,
        }),
      ),
    );
    throw error;
  }
  const receipt = await submitAndWatch(prepared.tx, input.signer, {
    onStatus: input.onStatus,
  });
  return { ...receipt, preflight: JSON.parse(json(prepared.evidence)) };
}
