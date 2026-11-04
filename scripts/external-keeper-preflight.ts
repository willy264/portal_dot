import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { AccountId, Binary, Enum } from "polkadot-api";
import { encodeFunctionData, toHex, type Address, type Hex } from "viem";
import {
  CHAIN_ID,
  getApi,
  getFinalizedHead,
  readContract,
} from "../packages/chain/src/client";
import {
  prepareBoundedReviveCall,
  SimulationError,
  type ChainSigner,
} from "../packages/chain/src/revive";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
import {
  parseExecutionProfile,
  traceBudget,
  type ExecutionProfile,
} from "../services/cronpot-relayer/src/execution-profile";
import { assertCalibrationBinding } from "../services/cronpot-relayer/src/calibration";
import { verifyProfileRuntime } from "../services/cronpot-relayer/src/preflight";
import {
  assertNativeCallbackResult,
  validateRefundTrace,
  type RefundExpectation,
} from "../services/cronpot-relayer/src/refund-trace";
import { pathAt } from "./lib";

const timeoutMs = () => Number(process.env.CHAIN_TIMEOUT_MS ?? "60000");
const optionsAt = (hash: string) => ({
  at: hash,
  signal: AbortSignal.timeout(timeoutMs()),
});
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const u256 = (n: bigint): [bigint, bigint, bigint, bigint] => {
  if (n < 0n || n >= 1n << 256n) throw new RangeError("Invalid U256");
  const mask = (1n << 64n) - 1n;
  return [n & mask, (n >> 64n) & mask, (n >> 128n) & mask, n >> 192n];
};
const fromU256 = (limbs: readonly bigint[]) =>
  limbs.reduce((n, limb, index) => n + (limb << BigInt(64 * index)), 0n);

export type ExternalChainJob = {
  owner: Address;
  target: Address;
  executeAfter: bigint;
  status: number;
  tip: bigint;
  data: Hex;
};
export type ExternalChainRental = readonly [
  bigint,
  Address,
  bigint,
  bigint,
  bigint,
  number,
  bigint,
];
export type ExternalJobBinding = {
  cronpot: Address;
  meterMend: Address;
  keeper: Address;
  oldCronpot: Address;
  actualBuiltInCronpot: Address;
  jobId: bigint;
  rentalId: bigint;
  oldJobId: bigint;
  timestamp: bigint;
  job: ExternalChainJob;
  oldJob: ExternalChainJob;
  rental: ExternalChainRental;
};

/** An external keeper registration is a distinct integration, never an implicit rewiring. */
export function assertExternalRefundBinding(input: ExternalJobBinding): void {
  const {
    cronpot,
    meterMend,
    keeper,
    oldCronpot,
    actualBuiltInCronpot,
    jobId,
    rentalId,
    oldJobId,
    timestamp,
    job,
    oldJob,
    rental,
  } = input;
  if (same(cronpot, oldCronpot) || !same(actualBuiltInCronpot, oldCronpot))
    throw new Error(
      "External keeper: MeterMend must retain the separately recorded original Cronpot",
    );
  if (jobId < 1n || rentalId < 1n || oldJobId < 1n)
    throw new Error(
      "External keeper: positive explicit job and rental identifiers required",
    );
  const data = encodeFunctionData({
    abi: meterMendAbi,
    functionName: "finalizeRefund",
    args: [rentalId],
  });
  if (
    job.status !== 1 ||
    !same(job.owner, keeper) ||
    !same(job.target, meterMend) ||
    job.data !== data
  )
    throw new Error(
      "External keeper: job must be scheduled by the keeper for the exact MeterMend refund",
    );
  if (
    oldJob.status !== 4 ||
    !same(oldJob.owner, meterMend) ||
    !same(oldJob.target, meterMend) ||
    oldJob.data !== data
  )
    throw new Error(
      "External keeper: original built-in job must have a recorded terminal failure for this refund",
    );
  if (rental[5] !== 2 || rental[2] <= 0n || rental[6] !== oldJobId)
    throw new Error(
      "External keeper: rental must remain returned and funded with its original job identifier",
    );
  if (
    rental[4] !== job.executeAfter ||
    rental[4] !== oldJob.executeAfter ||
    rental[4] > timestamp
  )
    throw new Error(
      "External keeper: both jobs must use the exact elapsed rental refund deadline",
    );
}

/** Read back the new Cronpot while explicitly preserving MeterMend's original built-in address. */
export async function verifyExternalContracts(
  profile: ExecutionProfile,
  oldCronpot: Address,
  at: { number: number; hash: string },
) {
  parseExecutionProfile(
    profile,
    profile.contracts.Cronpot,
    profile.contracts.MeterMend,
  );
  const cronpot = profile.contracts.Cronpot as Address;
  const meterMend = profile.contracts.MeterMend as Address;
  if (!/^0x[\da-f]{40}$/i.test(oldCronpot) || same(oldCronpot, cronpot))
    throw new Error(
      "External keeper requires distinct original and corrected Cronpot addresses",
    );
  const [
    targetGasLimit,
    postCallGasReserve,
    tipGasLimit,
    minCallGas,
    actualBuiltInCronpot,
  ] = await Promise.all([
    readContract<bigint>(cronpotAbi, cronpot, "TARGET_GAS_LIMIT", [], { at }),
    readContract<bigint>(cronpotAbi, cronpot, "POST_CALL_GAS_RESERVE", [], {
      at,
    }),
    readContract<bigint>(cronpotAbi, cronpot, "TIP_GAS_LIMIT", [], { at }),
    readContract<bigint>(cronpotAbi, cronpot, "MIN_CALL_GAS", [], { at }),
    readContract<Address>(meterMendAbi, meterMend, "cronpot", [], { at }),
  ]);
  const gas = { targetGasLimit, postCallGasReserve, tipGasLimit, minCallGas };
  for (const key of Object.keys(gas) as (keyof typeof gas)[])
    if (gas[key] !== BigInt(profile.contractGas[key]))
      throw new Error(
        `External keeper: corrected Cronpot ${key} differs from its reviewed profile`,
      );
  if (!same(actualBuiltInCronpot, oldCronpot))
    throw new Error("External keeper: MeterMend built-in Cronpot changed");
  const api = getApi();
  const info = await api.query.Revive.AccountInfoOf.getValue(
    cronpot,
    optionsAt(at.hash),
  );
  if (info?.account_type.type !== "Contract")
    throw new Error("External keeper: corrected Cronpot is not deployed");
  const codeHash = info.account_type.value.code_hash;
  const code = await api.query.Revive.PristineCode.getValue(
    codeHash,
    optionsAt(at.hash),
  );
  const runtimeBytecodeSha256 =
    code && createHash("sha256").update(code).digest("hex");
  if (runtimeBytecodeSha256 !== profile.code.runtimeBytecodeSha256)
    throw new Error(
      "External keeper: deployed Cronpot runtime bytecode differs from the calibrated code",
    );
  return { ...gas, actualBuiltInCronpot, codeHash, runtimeBytecodeSha256 };
}

async function signerStateAt(signer: ChainSigner, hash: string) {
  const api = getApi();
  const options = optionsAt(hash);
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
      .every((byte, i) => byte === AccountId().enc(signer.address)[i])
  )
    throw new Error(
      "External keeper: signer must already be funded and mapped",
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

/** Read-only preparation: fresh native bool=true and matching Ethereum trace, without state overrides. */
export async function prepareExternalKeeperRefund(input: {
  profile: ExecutionProfile;
  signer: ChainSigner;
  jobId: bigint;
  rentalId: bigint;
  oldCronpot: Address;
  oldJobId: bigint;
}) {
  const { profile, signer, jobId, rentalId, oldCronpot, oldJobId } = input;
  parseExecutionProfile(
    profile,
    profile.contracts.Cronpot,
    profile.contracts.MeterMend,
  );
  const bytes = await readFile(pathAt(profile.verification.artifact));
  if (
    createHash("sha256").update(bytes).digest("hex") !==
    profile.verification.sha256
  )
    throw new Error("External keeper: calibration artifact SHA-256 mismatch");
  assertCalibrationBinding(profile, JSON.parse(bytes.toString("utf8")));
  const at = await getFinalizedHead();
  const api = getApi();
  const cronpot = profile.contracts.Cronpot as Address;
  const meterMend = profile.contracts.MeterMend as Address;
  const [runtime, readbacks, account, job, oldJob, rental, price] =
    await Promise.all([
      verifyProfileRuntime(profile, at.hash),
      verifyExternalContracts(profile, oldCronpot, at),
      signerStateAt(signer, at.hash),
      readContract<ExternalChainJob>(cronpotAbi, cronpot, "getJob", [jobId], {
        at,
      }),
      readContract<ExternalChainJob>(
        cronpotAbi,
        oldCronpot,
        "getJob",
        [oldJobId],
        { at },
      ),
      readContract<ExternalChainRental>(
        meterMendAbi,
        meterMend,
        "rentals",
        [rentalId],
        { at },
      ),
      api.apis.ReviveApi.gas_price_versioned(Enum("V1"), optionsAt(at.hash)),
    ]);
  const binding: ExternalJobBinding = {
    cronpot,
    meterMend,
    keeper: account.h160,
    oldCronpot,
    actualBuiltInCronpot: readbacks.actualBuiltInCronpot,
    jobId,
    rentalId,
    oldJobId,
    timestamp: at.timestamp,
    job,
    oldJob,
    rental,
  };
  assertExternalRefundBinding(binding);
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
    throw new SimulationError(
      "External keeper: independent Ethereum trace failed",
      { at, expected, response },
    );
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
  const feeEstimate = await prepared.tx.getEstimatedFees(signer.txCreator);
  if (feeEstimate > BigInt(profile.native.feeReserve))
    throw new Error(
      "External keeper: native fee estimate exceeds profile fee reserve",
    );
  return {
    tx: prepared.tx,
    evidence: {
      schemaVersion: 1,
      kind: "external-keeper-refund-preflight",
      profileId: profile.id,
      observedAt: new Date().toISOString(),
      at,
      runtime,
      readbacks,
      binding,
      expected,
      account: { address: signer.address, ...account },
      native: {
        caps: prepared.caps,
        initial: prepared.initial,
        bounded: prepared.bounded,
        callbackSuccess: true,
        feeEstimate,
        encodedCall: toHex(await prepared.tx.getEncodedData()),
      },
      ethereum: {
        ...budget,
        stateOverrides: false,
        timestampOverride: false,
        basis:
          "Independent Ethereum-context check with actual balances; not a native gas equivalence",
        events,
        trace,
      },
      signedTransactions: 0,
    },
  };
}
