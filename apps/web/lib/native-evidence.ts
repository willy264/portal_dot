import type { Hex } from "./types";
import {
  canonicalAccount,
  type StorageLike,
  type FinalizedReceipt,
} from "./transaction-journal";
export type NativeEvidenceProof = {
  txHash: Hex;
  block: number;
  blockHash: Hex;
  extrinsicIndex: number;
  storageIndex: number;
  storageContentHash?: Hex;
  bytes: number;
  retentionBlocks: number;
};
export type EvidenceJournalEntry = {
  hash: Hex;
  account: string;
  state: "submitting" | "unknown" | "finalized" | "failed";
  fromBlock: number;
  nextBlock?: number;
  txHash?: Hex;
  proof?: NativeEvidenceProof;
  error?: string;
  updatedAt: string;
};
export type EvidenceJournal = {
  list: () => EvidenceJournalEntry[];
  read: (hash: Hex) => EvidenceJournalEntry | null;
  write: (entry: EvidenceJournalEntry) => void;
};
export const EVIDENCE_JOURNAL_KEY = "metermend-native-evidence";
export const EVIDENCE_ENTRY_PREFIX = "metermend-native-evidence-v2:";
const hexHash = (value: unknown): value is Hex =>
  typeof value === "string" && /^0x[\da-f]{64}$/i.test(value);
const blockNumber = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0;
function validateEntry(value: unknown): EvidenceJournalEntry {
  const record = value as EvidenceJournalEntry | null;
  if (
    !record ||
    typeof record !== "object" ||
    !hexHash(record.hash) ||
    typeof record.account !== "string" ||
    !blockNumber(record.fromBlock) ||
    (record.nextBlock !== undefined &&
      (!blockNumber(record.nextBlock) ||
        record.nextBlock < record.fromBlock)) ||
    !["submitting", "unknown", "finalized", "failed"].includes(record.state) ||
    typeof record.updatedAt !== "string" ||
    (record.txHash !== undefined && !hexHash(record.txHash))
  )
    throw new Error("Invalid native evidence record");
  canonicalAccount(record.account);
  const proof = record.proof;
  if (record.state === "finalized" && !proof)
    throw new Error("Finalized evidence proof is missing");
  if (
    proof &&
    (!hexHash(proof.txHash) ||
      proof.txHash !== record.txHash ||
      !hexHash(proof.blockHash) ||
      !blockNumber(proof.block) ||
      !blockNumber(proof.extrinsicIndex) ||
      !blockNumber(proof.storageIndex) ||
      !Number.isSafeInteger(proof.bytes) ||
      proof.bytes < 1 ||
      !Number.isSafeInteger(proof.retentionBlocks) ||
      proof.retentionBlocks < 1)
  )
    throw new Error("Invalid native storage proof");
  return record;
}
export function isPendingEvidence(record: EvidenceJournalEntry) {
  return record.state === "submitting" || record.state === "unknown";
}
export function createEvidenceJournal(
  storage: () => StorageLike,
): EvidenceJournal {
  const list = () => {
    try {
      const store = storage();
      const legacy: unknown = JSON.parse(
        store.getItem(EVIDENCE_JOURNAL_KEY) ?? "{}",
      );
      if (!legacy || typeof legacy !== "object" || Array.isArray(legacy))
        throw new Error("Invalid legacy evidence journal");
      const entries = new Map<Hex, EvidenceJournalEntry>();
      for (const [hash, value] of Object.entries(legacy)) {
        const entry = validateEntry(value);
        if (entry.hash !== hash)
          throw new Error("Evidence record does not match its key");
        entries.set(entry.hash, entry);
      }
      const keys: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (key?.startsWith(EVIDENCE_ENTRY_PREFIX)) keys.push(key);
      }
      for (const key of keys) {
        const raw = store.getItem(key);
        if (raw === null) continue;
        const entry = validateEntry(JSON.parse(raw));
        if (key !== EVIDENCE_ENTRY_PREFIX + entry.hash)
          throw new Error("Evidence record does not match its key");
        entries.set(entry.hash, entry);
      }
      return [...entries.values()];
    } catch (cause) {
      throw new Error(
        "Browser evidence storage is unavailable or damaged. Writes are blocked; keep this browser's data intact.",
        { cause },
      );
    }
  };
  return {
    list,
    read: (hash) => list().find((entry) => entry.hash === hash) ?? null,
    write(entry) {
      validateEntry(entry);
      const current = list().find((record) => record.hash === entry.hash);
      if (current && isPendingEvidence(current)) {
        if (
          canonicalAccount(current.account) !==
            canonicalAccount(entry.account) ||
          current.fromBlock !== entry.fromBlock ||
          (current.txHash && current.txHash !== entry.txHash)
        )
          throw new Error(
            "An unresolved evidence submission cannot be replaced or its hash removed.",
          );
      }
      if (
        current &&
        !isPendingEvidence(current) &&
        entry.state !== "submitting" &&
        (entry.state !== current.state || entry.txHash !== current.txHash)
      )
        throw new Error(
          "A finalized evidence outcome cannot be replaced by a stale observation.",
        );
      const store = storage();
      const key = EVIDENCE_ENTRY_PREFIX + entry.hash;
      const value = JSON.stringify(entry, (_key, item: unknown) =>
        typeof item === "bigint" ? item.toString() : item,
      );
      store.setItem(key, value);
      if (store.getItem(key) !== value)
        throw new Error(
          "The browser did not retain the evidence intent. No new write can be submitted safely.",
        );
    },
  };
}
export const browserEvidenceJournal = createEvidenceJournal(() => localStorage);
export function assertEvidenceAccountClear(
  journal: EvidenceJournal,
  account: string,
) {
  const key = canonicalAccount(account);
  const pending = journal
    .list()
    .find(
      (entry) =>
        isPendingEvidence(entry) && canonicalAccount(entry.account) === key,
    );
  if (pending) throw new UncertainEvidenceError(pending);
}
export class UncertainEvidenceError extends Error {
  constructor(readonly record: EvidenceJournalEntry) {
    super(
      `A previous evidence submission needs reconciliation${record.txHash ? `: ${record.txHash}` : ""}. Check that outcome before storing these bytes again.`,
    );
    this.name = "UncertainEvidenceError";
  }
}
export async function submitNativeEvidence<Prepared = undefined>(input: {
  hash: Hex;
  account: string;
  fromBlock: number;
  journal: EvidenceJournal;
  prepare?: () => Promise<Prepared>;
  submit: (
    onHash: (hash: Hex) => void,
    prepared: Prepared,
  ) => Promise<NativeEvidenceProof>;
  onRecord?: (record: EvidenceJournalEntry) => void;
}): Promise<NativeEvidenceProof> {
  const previous = input.journal.read(input.hash);
  if (
    previous?.state === "finalized" &&
    previous.proof &&
    input.fromBlock < previous.proof.block + previous.proof.retentionBlocks
  )
    return previous.proof;
  if (previous && isPendingEvidence(previous))
    throw new UncertainEvidenceError(previous);
  assertEvidenceAccountClear(input.journal, input.account);
  let record: EvidenceJournalEntry = {
    hash: input.hash,
    account: input.account,
    state: "submitting",
    fromBlock: input.fromBlock,
    nextBlock: input.fromBlock,
    updatedAt: new Date().toISOString(),
  };
  const persist = (next: EvidenceJournalEntry) => {
    record = next;
    input.onRecord?.(record);
    input.journal.write(record);
  };
  persist(record);
  let submissionStarted = false;
  try {
    const prepared = input.prepare
      ? await input.prepare()
      : (undefined as Prepared);
    submissionStarted = true;
    const proof = await input.submit((txHash) => {
      persist({ ...record, txHash, updatedAt: new Date().toISOString() });
    }, prepared);
    record = {
      ...record,
      state: "finalized",
      txHash: proof.txHash,
      proof,
      updatedAt: new Date().toISOString(),
    };
    persist(record);
    return proof;
  } catch (error) {
    const value = error as {
      ambiguous?: boolean;
      txHash?: Hex;
      message?: string;
      evidence?: FinalizedReceipt;
      code?: unknown;
    };
    const rejected =
      !record.txHash &&
      value.ambiguous !== true &&
      (value.code === 4001 ||
        /\b(?:user|wallet)\b.*\b(?:rejected|cancelled|canceled|denied)\b/i.test(
          value.message ?? "",
        ));
    const ambiguous =
      submissionStarted &&
      !rejected &&
      !(value.ambiguous === false && value.evidence);
    record = {
      ...record,
      txHash: value.evidence?.txHash ?? value.txHash ?? record.txHash,
      state: ambiguous ? "unknown" : "failed",
      error: value.message ?? "Evidence storage did not finish",
      updatedAt: new Date().toISOString(),
    };
    try {
      persist(record);
    } catch {
      record = { ...record, state: "unknown" };
      input.onRecord?.(record);
      throw new UncertainEvidenceError(record);
    }
    if (ambiguous) throw new UncertainEvidenceError(record);
    throw error;
  }
}

export type ReconciledEvidence =
  | { status: "confirmed"; evidence: NativeEvidenceProof }
  | { status: "failed"; evidence: FinalizedReceipt; dispatchError?: unknown }
  | {
      status: "pending" | "unknown";
      txHash: Hex;
      nextBlock: number;
      reason: string;
    };
export function applyEvidenceReconciliation(
  journal: EvidenceJournal,
  record: EvidenceJournalEntry,
  result: ReconciledEvidence,
) {
  const stored = journal.read(record.hash);
  if (stored && !isPendingEvidence(stored)) return stored;
  if (stored?.txHash) record = stored;
  if (!record.txHash)
    throw new Error(
      "No transaction hash was retained; this outcome cannot be proven automatically.",
    );
  const hash = "evidence" in result ? result.evidence.txHash : result.txHash;
  if (hash.toLowerCase() !== record.txHash.toLowerCase())
    throw new Error(
      "The reconciliation result belongs to a different transaction.",
    );
  const next: EvidenceJournalEntry = {
    ...record,
    updatedAt: new Date().toISOString(),
    ...(result.status === "confirmed"
      ? { state: "finalized", proof: result.evidence, error: undefined }
      : result.status === "failed"
        ? {
            state: "failed",
            error:
              "The original storage transaction finalized with a dispatch failure.",
          }
        : {
            state: "unknown",
            nextBlock: Math.max(
              record.nextBlock ?? record.fromBlock,
              result.nextBlock,
            ),
            error: result.reason,
          }),
  };
  journal.write(next);
  return next;
}
