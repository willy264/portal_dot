import { decodeErrorResult, type Hex } from "viem";
import { meterMendAbi } from "../packages/chain/src/abi";
import {
  FinalizedDispatchError,
  SimulationError,
  type ChainSigner,
  type SubmissionOptions,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
import { hash, type Journal } from "./lib";

/** A transport error or a different revert must never authorize this negative demonstration. */
export function requireNotArbiter(error: unknown) {
  if (!(error instanceof SimulationError)) throw error;
  const details = error.details as { flags?: number; data?: Hex } | null;
  if (
    !details ||
    typeof details.flags !== "number" ||
    !(details.flags & 1) ||
    !details.data
  )
    throw error;
  const decoded = decodeErrorResult({ abi: meterMendAbi, data: details.data });
  if (decoded.errorName !== "NotArbiter") throw error;
  return {
    error: decoded.errorName,
    revertData: details.data,
    flags: details.flags,
  };
}

function contractRevert(evidence: TransactionEvidence) {
  if (
    !/^0x[\da-f]{64}$/i.test(evidence.txHash) ||
    !/^0x[\da-f]{64}$/i.test(evidence.blockHash) ||
    !Number.isSafeInteger(evidence.block) ||
    evidence.block < 0 ||
    !Number.isSafeInteger(evidence.extrinsicIndex) ||
    evidence.extrinsicIndex < 0
  )
    throw new Error(
      "The negative demonstration has an incomplete finalized receipt",
    );
  const events = evidence.events.map((raw: any) => raw.event ?? raw);
  const failed = events.filter(
    (event) =>
      event.type === "System" && event.value?.type === "ExtrinsicFailed",
  );
  if (
    failed.length !== 1 ||
    events.some(
      (event) =>
        event.type === "System" && event.value?.type === "ExtrinsicSuccess",
    )
  )
    throw new Error(
      "The negative demonstration has no unambiguous finalized failed dispatch",
    );
  const error = failed[0].value.value.dispatch_error;
  if (
    error?.type !== "Module" ||
    error.value?.type !== "Revive" ||
    error.value.value?.type !== "ContractReverted"
  )
    throw new Error(
      "The negative demonstration failed for a reason other than Revive.ContractReverted; inspect its original receipt, do not resubmit",
    );
  return { evidence, dispatchError: error };
}

/** Reuse a finalized failure, reconcile an ambiguous hash, and never retry this deliberate failure. */
export async function expectFinalizedContractRevert(input: {
  journal: Journal;
  key: string;
  intent: unknown;
  account: ChainSigner;
  action: (options: SubmissionOptions) => Promise<TransactionEvidence>;
}) {
  const { journal, key, intent, account, action } = input;
  const old = journal.data.steps[key];
  if (
    old &&
    (old.intentHash !== hash(intent) || old.signer !== account.address)
  )
    throw new Error(
      `Journal intent changed for ${key}; refusing a different negative demonstration`,
    );
  if (old?.state === "failed") {
    if (!old.evidence)
      throw new Error(
        `${key} failed without a finalized receipt; inspect its original status before any new attempt`,
      );
    return contractRevert(old.evidence);
  }
  try {
    if (old) await journal.recover(key, intent, account);
    else await journal.step(key, intent, account, action);
  } catch (error) {
    if (!(error instanceof FinalizedDispatchError)) throw error;
    return contractRevert(error.evidence);
  }
  throw new Error(
    "The unauthorized reserve-spending approval unexpectedly succeeded; stop the demo and inspect the receipt",
  );
}

export function requireUnchangedReserveAndRepair(
  before: { reserve: unknown; repair: unknown },
  after: { reserve: unknown; repair: unknown },
) {
  if (hash(before) !== hash(after))
    throw new Error(
      "The rejected reserve-spending approval changed the reserve or repair state",
    );
}
