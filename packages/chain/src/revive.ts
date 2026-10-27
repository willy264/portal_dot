import {
  Binary,
  Enum,
  type Transaction,
  type TxCreator,
  type TxEvent,
  type TxFinalized,
} from "polkadot-api";
import { Blake2256 } from "@polkadot-api/substrate-bindings";
import {
  type Abi,
  type Address,
  type Hex,
  concatHex,
  decodeErrorResult,
  encodeFunctionData,
  hexToBytes,
  toHex,
} from "viem";
import {
  getAccountState,
  getApi,
  getClient,
  getFinalizedHead,
  h160Of,
  verifyNetwork,
} from "./client";
import { evmToNative, withTwentyPercentMargin } from "./units";

export type ChainSigner = { address: string; txCreator: TxCreator };
export type SubmissionOptions = {
  /** Called synchronously: services should persist the created hash before returning. */
  onStatus?: (event: TxEvent) => void;
  timeoutMs?: number;
};
export type TransactionEvidence = {
  txHash: Hex;
  block: number;
  blockHash: Hex;
  extrinsicIndex: number;
  events: TxFinalized["events"];
};

export class SubmissionUnknownError extends Error {
  readonly ambiguous = true;
  constructor(
    message: string,
    readonly txHash?: Hex,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SubmissionUnknownError";
  }
}

export class FinalizedDispatchError extends Error {
  readonly ambiguous = false;
  constructor(
    readonly evidence: TransactionEvidence,
    readonly dispatchError: unknown,
  ) {
    super(`Finalized extrinsic failed: ${stringify(dispatchError)}`);
    this.name = "FinalizedDispatchError";
  }
}

export class SimulationError extends Error {
  readonly ambiguous = false;
  constructor(
    message: string,
    readonly details: unknown,
  ) {
    super(message);
    this.name = "SimulationError";
  }
}

function stringify(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

/** One subscription, no automatic write retries. Resolve only after finalized inclusion. */
export async function submitAndWatch(
  tx: Transaction,
  signer: ChainSigner,
  options: SubmissionOptions = {},
): Promise<TransactionEvidence> {
  await verifyNetwork();
  return await new Promise((resolve, reject) => {
    let txHash: Hex | undefined;
    let finished = false;
    let subscription: { unsubscribe(): void } | undefined;
    const stop = (error?: unknown, result?: TransactionEvidence) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      subscription?.unsubscribe();
      if (error) reject(error);
      else resolve(result!);
    };
    const timer = setTimeout(
      () =>
        stop(
          txHash
            ? new SubmissionUnknownError(
                "Finalization timed out. Reconcile this transaction hash before any retry.",
                txHash,
              )
            : new Error(
                "Transaction creation timed out before a transaction hash was available",
              ),
        ),
      options.timeoutMs ?? 180_000,
    );
    try {
      subscription = tx.createSubmitAndWatch(signer.txCreator).subscribe({
        next(event) {
          if (finished) return;
          txHash = event.txHash as Hex;
          try {
            options.onStatus?.(event);
          } catch (error) {
            stop(
              new SubmissionUnknownError(
                "Transaction journal callback failed; reconcile the transaction before retrying",
                txHash,
                { cause: error },
              ),
            );
            return;
          }
          if (event.type !== "finalized") return;
          const evidence: TransactionEvidence = {
            txHash,
            block: event.block.number,
            blockHash: event.block.hash as Hex,
            extrinsicIndex: event.block.index,
            events: event.events,
          };
          if (!event.ok)
            stop(new FinalizedDispatchError(evidence, event.dispatchError));
          else stop(undefined, evidence);
        },
        error(error: unknown) {
          stop(
            txHash
              ? new SubmissionUnknownError(
                  "Submission outcome is unknown. Reconcile this transaction hash before any retry.",
                  txHash,
                  { cause: error },
                )
              : error,
          );
        },
        complete() {
          if (!finished)
            stop(
              new SubmissionUnknownError(
                "Transaction stream ended without finalized proof",
                txHash,
              ),
            );
        },
      });
    } catch (error) {
      stop(
        txHash
          ? new SubmissionUnknownError(
              "Submission creation threw after a hash was observed; reconcile before retrying",
              txHash,
              { cause: error },
            )
          : error,
      );
    }
  });
}

export async function ensureMapped(
  signer: ChainSigner,
  options: SubmissionOptions = {},
) {
  await verifyNetwork();
  const state = await getAccountState(signer.address);
  if (state.mapped) return { h160: state.h160, alreadyMapped: true };
  const api = getApi();
  if (await api.constants.Revive.AutoMap()) {
    throw new Error(
      "This runtime automatically maps funded accounts. Fund the native account and wait for finality before contract writes.",
    );
  }
  const tx = api.tx.Revive.map_account();
  const fees = await tx.getEstimatedFees(signer.txCreator);
  if (state.nativeBalance <= fees)
    throw new Error(
      "Insufficient native balance to register the address mapping",
    );
  const evidence = await submitAndWatch(tx, signer, options);
  const mapped = await getAccountState(signer.address);
  if (!mapped.mapped)
    throw new SubmissionUnknownError(
      "Mapping extrinsic finalized but mapping is unavailable; inspect finalized state",
      evidence.txHash,
    );
  return { h160: mapped.h160, alreadyMapped: false, ...evidence };
}

type Weight = { ref_time: bigint; proof_size: bigint };
type Estimate = {
  weight_required: Weight;
  max_storage_deposit: { type: string; value: bigint };
};
function limits(result: Estimate) {
  return {
    weight_limit: {
      ref_time: withTwentyPercentMargin(result.weight_required.ref_time),
      proof_size: withTwentyPercentMargin(result.weight_required.proof_size),
    },
    storage_deposit_limit:
      result.max_storage_deposit.type === "Charge"
        ? withTwentyPercentMargin(result.max_storage_deposit.value)
        : 0n,
  };
}

function assertNotReverted(flags: number, data: Uint8Array, abi?: Abi): void {
  if (!(flags & 1)) return;
  let detail: string = toHex(data);
  if (abi) {
    try {
      const decoded = decodeErrorResult({ abi, data: toHex(data) });
      detail = `${decoded.errorName}(${stringify(decoded.args ?? [])})`;
    } catch {
      /* Preserve the exact revert bytes if ABI decoding is unavailable. */
    }
  }
  throw new SimulationError(`Contract simulation reverted: ${detail}`, {
    flags,
    data: toHex(data),
  });
}

export type ReviveCallInput = SubmissionOptions & {
  signer: ChainSigner;
  to: Address;
  data: Hex;
  value?: bigint;
  abi?: Abi;
};

/** Public value is EVM units. Both runtime simulation and native extrinsic take native units. */
export async function simulateReviveCall(
  input: Omit<ReviveCallInput, "onStatus" | "timeoutMs">,
) {
  await verifyNetwork();
  const value = evmToNative(input.value ?? 0n);
  const simulation = await getApi().apis.ReviveApi.call_versioned(
    Enum("V1", {
      origin: input.signer.address,
      dest: input.to,
      value,
      gas_limit: undefined,
      storage_deposit_limit: undefined,
      input_data: Binary.fromHex(input.data),
    }),
    { signal: AbortSignal.timeout(45_000) },
  );
  const result = simulation.value;
  if (!result.result.success)
    throw new SimulationError(
      `Revive dry-run failed: ${stringify(result.result.value)}`,
      result,
    );
  assertNotReverted(
    result.result.value.flags,
    result.result.value.data,
    input.abi,
  );
  return {
    value,
    ...limits(result),
    output: toHex(result.result.value.data),
    simulation: result,
  };
}

export async function reviveCall(
  input: ReviveCallInput,
): Promise<TransactionEvidence> {
  await ensureMapped(input.signer, input);
  const { tx } = await buildReviveCall(input);
  return await submitAndWatch(tx, input.signer, input);
}

/** Read-only preparation for fee/balance preflight; does not map, sign or submit. */
export async function buildReviveCall(input: ReviveCallInput) {
  const estimate = await simulateReviveCall(input);
  const tx = getApi().tx.Revive.call({
    dest: input.to,
    value: estimate.value,
    weight_limit: estimate.weight_limit,
    storage_deposit_limit: estimate.storage_deposit_limit,
    data: Binary.fromHex(input.data),
  });
  return { ...estimate, tx };
}

export type ReviveDeployInput = SubmissionOptions & {
  signer: ChainSigner;
  code: Hex;
  ctorData: Hex;
  value?: bigint;
  abi?: Abi;
};

export async function simulateReviveDeploy(
  input: Omit<ReviveDeployInput, "onStatus" | "timeoutMs">,
) {
  await verifyNetwork();
  const value = evmToNative(input.value ?? 0n);
  const simulation = await getApi().apis.ReviveApi.instantiate_versioned(
    Enum("V1", {
      origin: input.signer.address,
      value,
      gas_limit: undefined,
      storage_deposit_limit: undefined,
      // EVM constructor arguments are part of initcode. Revive rejects nonempty native data.
      code: Enum(
        "Upload",
        Binary.fromHex(concatHex([input.code, input.ctorData])),
      ),
      data: Binary.fromHex("0x"),
      salt: undefined,
    }),
    { signal: AbortSignal.timeout(45_000) },
  );
  const result = simulation.value;
  if (!result.result.success)
    throw new SimulationError(
      `Revive deployment dry-run failed: ${stringify(result.result.value)}`,
      result,
    );
  assertNotReverted(
    result.result.value.result.flags,
    result.result.value.result.data,
    input.abi,
  );
  return {
    value,
    ...limits(result),
    simulatedAddress: result.result.value.addr as Address,
    simulation: result,
  };
}

export async function reviveDeploy(
  input: ReviveDeployInput,
): Promise<TransactionEvidence & { address: Address }> {
  await ensureMapped(input.signer, input);
  const { tx } = await buildReviveDeploy(input);
  const evidence = await submitAndWatch(tx, input.signer, input);
  const deployer = await h160Of(input.signer.address);
  for (const event of evidence.events) {
    if (event.type !== "Revive" || event.value.type !== "Instantiated")
      continue;
    const value = event.value.value as { deployer: string; contract: Address };
    if (value.deployer.toLowerCase() === deployer.toLowerCase())
      return { ...evidence, address: value.contract };
  }
  throw new SubmissionUnknownError(
    "Instantiation finalized without the expected Revive.Instantiated event; inspect evidence before retrying",
    evidence.txHash,
  );
}

/** Read-only preparation for fee/balance preflight; does not map, sign or submit. */
export async function buildReviveDeploy(input: ReviveDeployInput) {
  const estimate = await simulateReviveDeploy(input);
  const tx = getApi().tx.Revive.instantiate_with_code({
    value: estimate.value,
    weight_limit: estimate.weight_limit,
    storage_deposit_limit: estimate.storage_deposit_limit,
    code: Binary.fromHex(concatHex([input.code, input.ctorData])),
    data: Binary.fromHex("0x"),
    salt: undefined,
  });
  return { ...estimate, tx };
}

export type StoredEvidence = TransactionEvidence & {
  storageIndex: number;
  /** Runtime content identifier; distinct from the app's WebCrypto SHA-256 commitment. */
  storageContentHash: Hex;
  bytes: number;
  retentionBlocks: number;
};

/** Stores the final thumbnail bytes; callers hash and back up these exact bytes first. */
export async function storeEvidence(
  input: {
    signer: ChainSigner;
    bytes: Uint8Array;
  } & SubmissionOptions,
): Promise<StoredEvidence> {
  if (input.bytes.byteLength < 1 || input.bytes.byteLength > 64 * 1024)
    throw new RangeError("Evidence thumbnails must contain 1–65536 bytes");
  const bytes = Uint8Array.from(input.bytes);
  await ensureMapped(input.signer, input);
  const api = getApi();
  const tx = api.tx.TransactionStorage.store({ data: bytes });
  const [
    maximum,
    byteFee,
    entryFee,
    retentionBlocks,
    existentialDeposit,
    fee,
    account,
  ] = await Promise.all([
    api.constants.TransactionStorage.MaxTransactionSize(),
    api.query.TransactionStorage.ByteFee.getValue(),
    api.query.TransactionStorage.EntryFee.getValue(),
    api.query.TransactionStorage.RetentionPeriod.getValue(),
    api.constants.Balances.ExistentialDeposit(),
    tx.getEstimatedFees(input.signer.txCreator),
    getAccountState(input.signer.address),
  ]);
  if (bytes.byteLength > maximum)
    throw new RangeError(`Runtime evidence limit is ${maximum} bytes`);
  if (byteFee === undefined || entryFee === undefined)
    throw new Error(
      "TransactionStorage fees are not configured on this runtime",
    );
  const required =
    byteFee * BigInt(bytes.byteLength) +
    entryFee +
    withTwentyPercentMargin(fee) +
    existentialDeposit;
  if (account.nativeBalance - account.nativeFrozen < required)
    throw new Error(
      "Insufficient native balance for evidence storage, transaction fee and account survival",
    );
  const evidence = await submitAndWatch(tx, input.signer, input);
  for (const event of evidence.events) {
    if (event.type === "TransactionStorage" && event.value.type === "Stored") {
      const stored = event.value.value as { index: number; content_hash: Hex };
      return {
        ...evidence,
        storageIndex: stored.index,
        storageContentHash: stored.content_hash,
        bytes: bytes.byteLength,
        retentionBlocks,
      };
    }
  }
  throw new SubmissionUnknownError(
    "Storage finalized without TransactionStorage.Stored; reconcile the recorded transaction hash before retrying",
    evidence.txHash,
  );
}

export type TransactionReconciliation =
  | { status: "confirmed"; evidence: TransactionEvidence }
  | { status: "failed"; evidence: TransactionEvidence; dispatchError: unknown }
  | {
      status: "pending" | "unknown";
      txHash: Hex;
      searchedThrough: number;
      nextBlock: number;
      reason: string;
    };

/** Bounded, read-only recovery. Not found is never permission to resend automatically. */
export async function reconcileTransaction(input: {
  txHash: Hex;
  fromBlock: number;
  maxBlocks?: number;
}): Promise<TransactionReconciliation> {
  const maxBlocks = input.maxBlocks ?? 64;
  if (
    !/^0x[0-9a-f]{64}$/i.test(input.txHash) ||
    !Number.isSafeInteger(input.fromBlock) ||
    input.fromBlock < 0 ||
    !Number.isSafeInteger(maxBlocks) ||
    maxBlocks < 1 ||
    maxBlocks > 256
  )
    throw new RangeError(
      "A transaction hash, nonnegative start block and 1–256 block scan limit are required",
    );
  let searchedThrough = input.fromBlock - 1;
  try {
    await verifyNetwork();
    const head = await getFinalizedHead();
    const through = Math.min(head.number, input.fromBlock + maxBlocks - 1);
    const api = getApi();
    for (let block = input.fromBlock; block <= through; block++) {
      const blockHash = await getClient()._request<Hex | null>(
        "chain_getBlockHash",
        [block],
      );
      if (!blockHash) throw new Error(`Block ${block} is unavailable`);
      const body = await getClient()._request<{
        block: { extrinsics: Hex[] };
      } | null>("chain_getBlock", [blockHash]);
      if (!body) throw new Error(`Block body ${block} is unavailable`);
      const extrinsicIndex = body.block.extrinsics.findIndex(
        (tx) =>
          toHex(Blake2256(hexToBytes(tx))).toLowerCase() ===
          input.txHash.toLowerCase(),
      );
      if (extrinsicIndex < 0) {
        searchedThrough = block;
        continue;
      }
      const records = await api.query.System.Events.getValue({
        at: blockHash,
        signal: AbortSignal.timeout(45_000),
      });
      const events = records
        .filter(
          (record) =>
            record.phase.type === "ApplyExtrinsic" &&
            record.phase.value === extrinsicIndex,
        )
        .map((record) => ({
          ...record,
          ...record.event,
        })) as TxFinalized["events"];
      const evidence: TransactionEvidence = {
        txHash: input.txHash,
        block,
        blockHash,
        extrinsicIndex,
        events,
      };
      const failure = events.find(
        (event) =>
          event.type === "System" && event.value.type === "ExtrinsicFailed",
      );
      if (failure)
        return {
          status: "failed",
          evidence,
          dispatchError: failure.value.value,
        };
      const success = events.some(
        (event) =>
          event.type === "System" && event.value.type === "ExtrinsicSuccess",
      );
      if (!success)
        throw new Error(
          "The transaction was found but its finalized dispatch outcome is unavailable",
        );
      return { status: "confirmed", evidence };
    }
    return {
      status: "pending",
      txHash: input.txHash,
      searchedThrough,
      nextBlock: searchedThrough + 1,
      reason:
        through < head.number
          ? "More finalized blocks remain to inspect; continue from nextBlock"
          : "No finalized inclusion found in this range; the transaction may still be pending. Do not automatically resend.",
    };
  } catch (error) {
    return {
      status: "unknown",
      txHash: input.txHash,
      searchedThrough,
      nextBlock: searchedThrough + 1,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

export type EvidenceReconciliation =
  | { status: "confirmed"; evidence: StoredEvidence }
  | Exclude<TransactionReconciliation, { status: "confirmed" }>;

/** Adds native storage proof to generic finalized transaction reconciliation. */
export async function reconcileEvidence(input: {
  txHash: Hex;
  fromBlock: number;
  maxBlocks?: number;
}): Promise<EvidenceReconciliation> {
  const result = await reconcileTransaction(input);
  if (result.status !== "confirmed") return result;
  const evidence = result.evidence;
  try {
    const stored = evidence.events.find(
      (event) =>
        event.type === "TransactionStorage" && event.value.type === "Stored",
    );
    if (!stored)
      throw new Error(
        "The transaction finalized successfully but TransactionStorage.Stored proof is missing",
      );
    const value = stored.value.value as { index: number; content_hash: Hex };
    const options = {
      at: evidence.blockHash,
      signal: AbortSignal.timeout(45_000),
    };
    const api = getApi();
    const [metadata, retentionBlocks] = await Promise.all([
      api.query.TransactionStorage.Transactions.getValue(
        evidence.block,
        options,
      ),
      api.query.TransactionStorage.RetentionPeriod.getValue(options),
    ]);
    const transaction = metadata?.[value.index];
    if (!transaction || transaction.content_hash !== value.content_hash)
      throw new Error(
        "Stored event and native transaction metadata could not be reconciled",
      );
    return {
      status: "confirmed",
      evidence: {
        ...evidence,
        storageIndex: value.index,
        storageContentHash: value.content_hash,
        bytes: transaction.size,
        retentionBlocks,
      },
    };
  } catch (error) {
    return {
      status: "unknown",
      txHash: input.txHash,
      searchedThrough: evidence.block - 1,
      nextBlock: evidence.block,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

export type NativeSchedulerCapability = {
  p5Verified: true;
  proofTxHash: Hex;
  proofBlock: number;
  runtimeCodeHash: Hex;
  /** An explicit budget proven for successful Cronpot execution, never a TooEarly estimate. */
  weight: Weight;
  storageDepositLimit: bigint;
  executionBudgetEvidence: string;
};
let schedulerCapability: NativeSchedulerCapability | undefined;

export function configureNativeScheduler(
  capability?: NativeSchedulerCapability,
): void {
  if (
    capability &&
    (!capability.p5Verified ||
      capability.weight.ref_time <= 0n ||
      capability.weight.proof_size < 0n ||
      capability.storageDepositLimit < 0n ||
      !capability.executionBudgetEvidence.trim() ||
      !/^0x[0-9a-f]{64}$/i.test(capability.proofTxHash) ||
      !/^0x[0-9a-f]{64}$/i.test(capability.runtimeCodeHash) ||
      !Number.isSafeInteger(capability.proofBlock) ||
      capability.proofBlock < 1)
  ) {
    throw new Error(
      "Native Scheduler requires finalized P5 proof and a successful execution budget",
    );
  }
  schedulerCapability = capability;
}

/** Native scheduling stays disabled until the funded P5 proof is configured. */
export class NativeSchedulerUnavailableError extends Error {
  readonly ambiguous = false;
  constructor() {
    super(
      "Native Scheduler execution has not passed funded P5 verification; use the keeper path",
    );
    this.name = "NativeSchedulerUnavailableError";
  }
}

export async function scheduleCronpot(
  input: {
    signer: ChainSigner;
    address: Address;
    jobId: bigint;
    delayBlocks: number;
  } & SubmissionOptions,
): Promise<TransactionEvidence & { task: { when: number; index: number } }> {
  const capability = schedulerCapability;
  if (!capability) throw new NativeSchedulerUnavailableError();
  if (
    !Number.isSafeInteger(input.delayBlocks) ||
    input.delayBlocks < 1 ||
    input.delayBlocks > 0xffffffff
  )
    throw new RangeError("Invalid schedule delay");
  if (input.jobId < 1n) throw new RangeError("Invalid Cronpot job ID");
  await verifyNetwork();
  const codeHash = await getClient()._request<string>("state_getStorageHash", [
    "0x3a636f6465",
  ]);
  if (codeHash !== capability.runtimeCodeHash)
    throw new Error(
      "Runtime changed after Scheduler verification; rerun funded P5 before native scheduling",
    );
  const api = getApi();
  const maximum = await api.constants.Scheduler.MaximumWeight();
  if (
    capability.weight.ref_time > maximum.ref_time ||
    capability.weight.proof_size > maximum.proof_size
  )
    throw new Error(
      "Configured future execution weight exceeds Scheduler.MaximumWeight",
    );
  await ensureMapped(input.signer, input);
  const data = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "execute",
        stateMutability: "nonpayable",
        inputs: [{ type: "uint256", name: "jobId" }],
        outputs: [],
      },
    ],
    functionName: "execute",
    args: [input.jobId],
  });
  const inner = api.tx.Revive.call({
    dest: input.address,
    value: 0n,
    weight_limit: capability.weight,
    storage_deposit_limit: capability.storageDepositLimit,
    data: Binary.fromHex(data),
  });
  const tx = api.tx.Scheduler.schedule_after({
    after: input.delayBlocks,
    maybe_periodic: undefined,
    priority: 127,
    call: inner.decodedCall,
  });
  // Estimate the scheduling extrinsic itself. Future execution uses the separately proven budget.
  await tx.getPaymentInfo(input.signer.txCreator);
  const evidence = await submitAndWatch(tx, input.signer, input);
  for (const event of evidence.events) {
    if (event.type === "Scheduler" && event.value.type === "Scheduled") {
      return {
        ...evidence,
        task: event.value.value as { when: number; index: number },
      };
    }
  }
  throw new SubmissionUnknownError(
    "Scheduling finalized without its Scheduler.Scheduled event; reconcile before retrying",
    evidence.txHash,
  );
}
