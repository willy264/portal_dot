import type { Hex } from "./types";
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
  txHash?: Hex;
  proof?: NativeEvidenceProof;
  error?: string;
  updatedAt: string;
};
export type EvidenceJournal = {
  read: (hash: Hex) => EvidenceJournalEntry | null;
  write: (entry: EvidenceJournalEntry) => void;
};
const key = "metermend-native-evidence";
export const browserEvidenceJournal: EvidenceJournal = {
  read(hash) {
    try {
      const records = JSON.parse(localStorage.getItem(key) ?? "{}");
      return records[hash] ?? null;
    } catch {
      return null;
    }
  },
  write(entry) {
    const records = JSON.parse(localStorage.getItem(key) ?? "{}");
    records[entry.hash] = entry;
    localStorage.setItem(key, JSON.stringify(records));
  },
};
export class UncertainEvidenceError extends Error {
  constructor(readonly record: EvidenceJournalEntry) {
    super(
      `A previous evidence submission needs reconciliation${record.txHash ? `: ${record.txHash}` : ""}. Check that outcome before storing these bytes again.`,
    );
    this.name = "UncertainEvidenceError";
  }
}
export async function submitNativeEvidence(input: {
  hash: Hex;
  account: string;
  fromBlock: number;
  journal: EvidenceJournal;
  submit: (onHash: (hash: Hex) => void) => Promise<NativeEvidenceProof>;
}): Promise<NativeEvidenceProof> {
  const previous = input.journal.read(input.hash);
  if (
    previous?.state === "finalized" &&
    previous.proof &&
    input.fromBlock < previous.proof.block + previous.proof.retentionBlocks
  )
    return previous.proof;
  if (
    previous &&
    (previous.state === "submitting" || previous.state === "unknown")
  )
    throw new UncertainEvidenceError(previous);
  let record: EvidenceJournalEntry = {
    hash: input.hash,
    account: input.account,
    state: "submitting",
    fromBlock: input.fromBlock,
    updatedAt: new Date().toISOString(),
  };
  input.journal.write(record);
  try {
    const proof = await input.submit((txHash) => {
      record = { ...record, txHash, updatedAt: new Date().toISOString() };
      input.journal.write(record);
    });
    record = {
      ...record,
      state: "finalized",
      txHash: proof.txHash,
      proof,
      updatedAt: new Date().toISOString(),
    };
    input.journal.write(record);
    return proof;
  } catch (error) {
    const value = error as {
      ambiguous?: boolean;
      txHash?: Hex;
      message?: string;
    };
    const ambiguous =
      value.ambiguous === true ||
      (!!record.txHash && value.ambiguous !== false);
    record = {
      ...record,
      txHash: value.txHash ?? record.txHash,
      state: ambiguous ? "unknown" : "failed",
      error: value.message ?? "Evidence storage did not finish",
      updatedAt: new Date().toISOString(),
    };
    input.journal.write(record);
    if (ambiguous) throw new UncertainEvidenceError(record);
    throw error;
  }
}
