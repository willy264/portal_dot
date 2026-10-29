import { AccountId } from "polkadot-api";
import type { Hex } from "./types";

export const CONTRACT_JOURNAL_KEY = "metermend-contract-intents-v1";
export const CONTRACT_INTENT_PREFIX = "metermend-contract-intent-v2:";
export type IntentState =
  | "preparing"
  | "awaiting-signature"
  | "submitted"
  | "unknown"
  | "confirmed"
  | "failed"
  | "rejected";
export type FinalizedReceipt = {
  txHash: Hex;
  block: number;
  blockHash: Hex;
  extrinsicIndex: number;
  events?: unknown;
};
export type ContractIntent = {
  id: string;
  chainId: number;
  account: string;
  accountKey: string;
  action: string;
  target: Hex;
  data: Hex;
  value: string;
  fromBlock: number;
  nextBlock: number;
  state: IntentState;
  txHash?: Hex;
  createdAt: string;
  updatedAt: string;
  reason?: string;
  receipt?: FinalizedReceipt;
};
export type IntentJournal = {
  list: () => ContractIntent[];
  put: (record: ContractIntent) => void;
};
export type StorageLike = Pick<
  Storage,
  "getItem" | "setItem" | "key" | "length" | "removeItem"
>;
const terminal = new Set<IntentState>(["confirmed", "failed", "rejected"]);
export function isPendingIntent(record: ContractIntent) {
  return !terminal.has(record.state);
}
export function canonicalAccount(address: string) {
  return Array.from(AccountId().enc(address), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
function serialized(value: unknown) {
  return JSON.stringify(value, (_key, item: unknown) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}
function parseRecords(raw: string | null): ContractIntent[] {
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (
    !Array.isArray(parsed) ||
    parsed.some(
      (record) =>
        !record ||
        typeof record !== "object" ||
        typeof record.id !== "string" ||
        typeof record.accountKey !== "string" ||
        !/^[\da-f]{64}$/i.test(record.accountKey) ||
        typeof record.account !== "string" ||
        typeof record.action !== "string" ||
        !Number.isSafeInteger(record.chainId) ||
        !Number.isSafeInteger(record.fromBlock) ||
        record.fromBlock < 0 ||
        !Number.isSafeInteger(record.nextBlock) ||
        record.nextBlock < 0 ||
        typeof record.target !== "string" ||
        !/^0x[\da-f]{40}$/i.test(record.target) ||
        typeof record.data !== "string" ||
        !/^0x[\da-f]*$/i.test(record.data) ||
        typeof record.value !== "string" ||
        !/^\d+$/.test(record.value) ||
        ![
          "preparing",
          "awaiting-signature",
          "submitted",
          "unknown",
          "confirmed",
          "failed",
          "rejected",
        ].includes(record.state),
    )
  )
    throw new Error(
      "The transaction journal is unreadable. Writes are blocked until its retained evidence can be recovered.",
    );
  return parsed as ContractIntent[];
}
export function createIntentJournal(storage: () => StorageLike): IntentJournal {
  function readAll(store: StorageLike) {
    const records = new Map(
      parseRecords(store.getItem(CONTRACT_JOURNAL_KEY)).map((record) => [
        record.id,
        record,
      ]),
    );
    const keys: string[] = [];
    for (let index = 0; index < store.length; index++) {
      const key = store.key(index);
      if (key?.startsWith(CONTRACT_INTENT_PREFIX)) keys.push(key);
    }
    for (const key of keys) {
      const raw = store.getItem(key);
      if (raw === null) continue;
      const record = parseRecords(`[${raw}]`)[0]!;
      if (key !== CONTRACT_INTENT_PREFIX + record.id)
        throw new Error(
          "Transaction record identifier does not match its storage key.",
        );
      records.set(record.id, record);
    }
    return Array.from(records.values());
  }
  return {
    list() {
      try {
        return readAll(storage());
      } catch (error) {
        throw new Error(
          "Browser transaction storage is unavailable or damaged. Writes are blocked; keep this browser's data intact.",
          { cause: error },
        );
      }
    },
    put(record) {
      const store = storage();
      const current = readAll(store).find((item) => item.id === record.id);
      if (current) {
        for (const field of [
          "accountKey",
          "chainId",
          "target",
          "data",
          "value",
          "action",
          "fromBlock",
        ] as const)
          if (current[field] !== record[field])
            throw new Error(
              "An existing transaction intent cannot be replaced with a different payment.",
            );
        if (current.txHash && current.txHash !== record.txHash)
          throw new Error(
            "A retained transaction hash cannot be changed or removed.",
          );
        if (!isPendingIntent(current) && record.state !== current.state)
          throw new Error(
            "A finalized transaction outcome cannot be replaced by a stale observation.",
          );
      }
      const key = CONTRACT_INTENT_PREFIX + record.id;
      const value = serialized(record);
      parseRecords(`[${value}]`);
      store.setItem(key, value);
      if (store.getItem(key) !== value)
        throw new Error(
          "The browser did not retain the transaction intent. No new write can be submitted safely.",
        );
    },
  };
}
export const browserIntentJournal = createIntentJournal(() => localStorage);
/** A unique sentinel tests writes without rewriting another tab's transaction records. */
export function verifyTransactionStorage(storage: () => StorageLike) {
  const store = storage();
  createIntentJournal(storage).list();
  const key = `metermend-storage-check:${crypto.randomUUID()}`;
  const value = "verified-write-read";
  try {
    store.setItem(key, value);
    if (store.getItem(key) !== value)
      throw new Error(
        "The browser did not retain the transaction storage check.",
      );
  } finally {
    store.removeItem(key);
  }
}
export function verifyBrowserTransactionStorage() {
  verifyTransactionStorage(() => localStorage);
}
export function assertAccountClear(
  journal: IntentJournal,
  accountKey: string,
  chainId: number,
) {
  const pending = journal
    .list()
    .filter(
      (record) =>
        record.accountKey === accountKey &&
        record.chainId === chainId &&
        isPendingIntent(record),
    );
  if (pending.length) throw new PendingTransactionError(pending[0]!);
}
export class PendingTransactionError extends Error {
  constructor(readonly intent: ContractIntent) {
    super(
      `A previous ${intent.action} transaction still needs a finalized outcome. Recheck it before submitting another write from this account.`,
    );
    this.name = "PendingTransactionError";
  }
}
export class UnknownTransactionError extends PendingTransactionError {
  constructor(
    intent: ContractIntent,
    readonly cause?: unknown,
  ) {
    super(intent);
    this.name = "UnknownTransactionError";
  }
}
function userRejected(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: unknown; name?: unknown; message?: unknown };
  return (
    e.code === 4001 ||
    e.name === "UserRejectedRequestError" ||
    (typeof e.message === "string" &&
      /\buser\b.*\b(rejected|cancelled|canceled|denied|declined)\b|\b(rejected|cancelled|canceled|denied|declined)\b.*\b(by user|by the user)\b/i.test(
        e.message,
      ))
  );
}
export type SubmissionUpdate = { txHash: Hex; stage: string };
/** Persist before preparation and signing. A nonterminal record survives process loss. */
export async function submitContractIntent<Prepared>(input: {
  journal: IntentJournal;
  intent: ContractIntent;
  prepare: () => Promise<Prepared>;
  submit: (
    prepared: Prepared,
    onStatus: (event: SubmissionUpdate) => void,
  ) => Promise<FinalizedReceipt>;
  onRecord?: (record: ContractIntent) => void;
}): Promise<FinalizedReceipt> {
  assertAccountClear(
    input.journal,
    input.intent.accountKey,
    input.intent.chainId,
  );
  let record = input.intent;
  let submissionStarted = false;
  const persist = (next: ContractIntent) => {
    record = next;
    input.onRecord?.(record);
    input.journal.put(record);
  };
  persist(record);
  try {
    const prepared = await input.prepare();
    persist({
      ...record,
      state: "awaiting-signature",
      updatedAt: new Date().toISOString(),
    });
    submissionStarted = true;
    const receipt = await input.submit(prepared, (event) =>
      persist({
        ...record,
        txHash: event.txHash,
        state: "submitted",
        reason: event.stage,
        updatedAt: new Date().toISOString(),
      }),
    );
    persist({
      ...record,
      state: "confirmed",
      txHash: receipt.txHash,
      receipt,
      reason: undefined,
      updatedAt: new Date().toISOString(),
    });
    return receipt;
  } catch (error) {
    const failure = error as {
      ambiguous?: boolean;
      txHash?: Hex;
      evidence?: FinalizedReceipt;
      message?: string;
    };
    const receipt = failure.evidence;
    const definitiveFailure = !!receipt && failure.ambiguous === false;
    const rejected =
      submissionStarted &&
      !record.txHash &&
      failure.ambiguous !== true &&
      userRejected(error);
    const knownUnsubmitted = !submissionStarted;
    const state: IntentState =
      definitiveFailure || knownUnsubmitted
        ? "failed"
        : rejected
          ? "rejected"
          : "unknown";
    const next = {
      ...record,
      state,
      txHash: receipt?.txHash ?? failure.txHash ?? record.txHash,
      ...(receipt ? { receipt } : {}),
      reason: failure.message ?? "Transaction outcome was not retained.",
      updatedAt: new Date().toISOString(),
    };
    try {
      persist(next);
    } catch (storageError) {
      input.onRecord?.({ ...next, state: "unknown" });
      throw new UnknownTransactionError(
        { ...next, state: "unknown" },
        storageError,
      );
    }
    if (state === "unknown") throw new UnknownTransactionError(next, error);
    throw error;
  }
}
export type ReconciledTransaction =
  | {
      status: "confirmed" | "failed";
      evidence: FinalizedReceipt;
      dispatchError?: unknown;
    }
  | {
      status: "pending" | "unknown";
      txHash: Hex;
      searchedThrough: number;
      nextBlock: number;
      reason: string;
    };
export function applyTransactionReconciliation(
  journal: IntentJournal,
  intent: ContractIntent,
  result: ReconciledTransaction,
): ContractIntent {
  const latest = journal.list().find((record) => record.id === intent.id);
  if (latest) {
    if (!isPendingIntent(latest)) return latest;
    if (!latest.txHash && intent.txHash) {
      // A quota error may have left the hash only in this tab's memory.
      // put() verifies all immutable fields before restoring that observation.
      journal.put({ ...intent, state: "unknown" });
    } else intent = latest;
  }
  if (!intent.txHash)
    throw new Error(
      "No transaction hash was retained; the outcome cannot be proven automatically.",
    );
  const returnedHash =
    "evidence" in result ? result.evidence.txHash : result.txHash;
  if (returnedHash.toLowerCase() !== intent.txHash.toLowerCase())
    throw new Error(
      "The reconciliation result belongs to a different transaction.",
    );
  const next: ContractIntent =
    "evidence" in result
      ? {
          ...intent,
          state: result.status,
          receipt: result.evidence,
          reason:
            result.status === "failed"
              ? "The original transaction finalized with a dispatch failure. A new attempt requires a new action."
              : "The original transaction is finalized. Review the refreshed ledger.",
          updatedAt: new Date().toISOString(),
        }
      : {
          ...intent,
          state: "unknown",
          nextBlock: Math.max(intent.nextBlock, result.nextBlock),
          reason: result.reason,
          updatedAt: new Date().toISOString(),
        };
  journal.put(next);
  return next;
}
/** Do not race writes from separate tabs using the same account. */
export async function withAccountWriteLock<T>(
  accountKey: string,
  run: () => Promise<T>,
): Promise<T> {
  if (typeof navigator === "undefined" || !navigator.locks)
    throw new Error(
      "This wallet browser cannot lock transaction submissions. Open MeterMend in a browser with Web Locks support.",
    );
  return navigator.locks.request(
    `metermend-write:${accountKey}`,
    { mode: "exclusive", ifAvailable: true },
    async (lock) => {
      if (!lock)
        throw new Error(
          "This account already has a transaction open in another MeterMend tab.",
        );
      return run();
    },
  );
}
/** Secondary public receipt archive; failures must never be silently ignored by a submit callback. */
export function retainTransaction(record: {
  txHash: string;
  action: string;
  account: string;
  status: string;
  block?: unknown;
  blockHash?: string;
  extrinsicIndex?: number;
  events?: unknown;
}) {
  const key = `metermend-transaction-receipt:${record.txHash}`;
  const value = serialized({ ...record, observedAt: new Date().toISOString() });
  localStorage.setItem(key, value);
  if (localStorage.getItem(key) !== value)
    throw new Error("The browser did not retain the transaction receipt.");
}
