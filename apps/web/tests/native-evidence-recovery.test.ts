import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createEvidenceJournal,
  EVIDENCE_JOURNAL_KEY,
  EVIDENCE_ENTRY_PREFIX,
  submitNativeEvidence,
  assertEvidenceAccountClear,
  applyEvidenceReconciliation,
  type EvidenceJournalEntry,
  type NativeEvidenceProof,
} from "../lib/native-evidence";
import {
  canonicalAccount,
  withAccountWriteLock,
  type StorageLike,
} from "../lib/transaction-journal";
import type { Hex } from "../lib/types";

const account = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
const hash = `0x${"a".repeat(64)}` as Hex;
const txHash = `0x${"b".repeat(64)}` as Hex;
const blockHash = `0x${"c".repeat(64)}` as Hex;
const proof: NativeEvidenceProof = {
  txHash,
  blockHash,
  block: 12,
  extrinsicIndex: 1,
  storageIndex: 0,
  bytes: 1024,
  retentionBlocks: 100800,
};
const record = (): EvidenceJournalEntry => ({
  hash,
  account,
  fromBlock: 10,
  nextBlock: 10,
  state: "unknown",
  txHash,
  updatedAt: "test",
});
function memory() {
  const values = new Map<string, string>();
  let broken = false;
  const storage: StorageLike = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (broken) throw new Error("Storage quota");
      values.set(key, value);
    },
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
  return {
    values,
    storage,
    journal: createEvidenceJournal(() => storage),
    breakWrites: () => {
      broken = true;
    },
  };
}
afterEach(() => vi.unstubAllGlobals());

describe("durable native evidence recovery", () => {
  it("reads legacy records and overlays per-photo recovery without replacing another photo", () => {
    const m = memory();
    const another = { ...record(), hash: blockHash };
    m.values.set(
      EVIDENCE_JOURNAL_KEY,
      JSON.stringify({ [hash]: record(), [blockHash]: another }),
    );
    m.journal.write({ ...record(), state: "finalized", proof });
    const reloaded = createEvidenceJournal(() => m.storage);
    expect(reloaded.read(hash)?.state).toBe("finalized");
    expect(reloaded.read(blockHash)).toEqual(another);
    expect(m.values.has(EVIDENCE_ENTRY_PREFIX + hash)).toBe(true);
    expect(m.values.has(EVIDENCE_JOURNAL_KEY)).toBe(true);
  });
  it("blocks malformed legacy and individual records instead of treating them as empty", () => {
    const m = memory();
    m.values.set(EVIDENCE_JOURNAL_KEY, "not-json");
    expect(() => m.journal.read(hash)).toThrow("unavailable or damaged");
    m.values.set(EVIDENCE_JOURNAL_KEY, "{}");
    m.values.set(
      EVIDENCE_ENTRY_PREFIX + hash,
      JSON.stringify({ ...record(), fromBlock: -1 }),
    );
    expect(() => m.journal.list()).toThrow("unavailable or damaged");
    m.values.set(
      EVIDENCE_ENTRY_PREFIX + hash,
      JSON.stringify({ ...record(), hash: blockHash }),
    );
    expect(() => m.journal.list()).toThrow("unavailable or damaged");
  });
  it("does not sign when storage reads fail or writes are silently discarded", async () => {
    const m = memory();
    const submit = vi.fn(async () => proof);
    const broken = createEvidenceJournal(() => {
      throw new Error("Storage unavailable");
    });
    await expect(
      submitNativeEvidence({
        hash,
        account,
        fromBlock: 10,
        journal: broken,
        submit,
      }),
    ).rejects.toThrow("unavailable or damaged");
    const dropped = createEvidenceJournal(() => ({
      ...m.storage,
      setItem: () => {},
    }));
    await expect(
      submitNativeEvidence({
        hash,
        account,
        fromBlock: 10,
        journal: dropped,
        submit,
      }),
    ).rejects.toThrow("did not retain");
    expect(submit).not.toHaveBeenCalled();
  });
  it("retains a missing-hash failure across reload and blocks other uploads from the account", async () => {
    const m = memory();
    const submit = vi.fn(async () => {
      throw new Error("Connection ended before its outcome arrived");
    });
    await expect(
      submitNativeEvidence({
        hash,
        account,
        fromBlock: 10,
        journal: m.journal,
        submit,
      }),
    ).rejects.toMatchObject({
      record: { state: "unknown", txHash: undefined },
    });
    const reloaded = createEvidenceJournal(() => m.storage);
    expect(() => assertEvidenceAccountClear(reloaded, account)).toThrow(
      "reconciliation",
    );
    await expect(
      submitNativeEvidence({
        hash: blockHash,
        account,
        fromBlock: 11,
        journal: reloaded,
        submit,
      }),
    ).rejects.toThrow("reconciliation");
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("separates a known preflight failure from an ambiguous submission", async () => {
    const m = memory();
    const submit = vi.fn(async () => proof);
    await expect(
      submitNativeEvidence({
        hash,
        account,
        fromBlock: 10,
        journal: m.journal,
        prepare: async () => {
          throw new Error("Insufficient balance");
        },
        submit,
      }),
    ).rejects.toThrow("Insufficient balance");
    expect(m.journal.read(hash)?.state).toBe("failed");
    expect(submit).not.toHaveBeenCalled();
    await expect(
      submitNativeEvidence({
        hash,
        account,
        fromBlock: 10,
        journal: m.journal,
        submit,
      }),
    ).resolves.toEqual(proof);
  });
  it("keeps the hash in memory when persistence fails after signing", async () => {
    const m = memory();
    const observed: EvidenceJournalEntry[] = [];
    await expect(
      submitNativeEvidence({
        hash,
        account,
        fromBlock: 10,
        journal: m.journal,
        onRecord: (entry) => observed.push(entry),
        submit: async (onHash) => {
          m.breakWrites();
          onHash(txHash);
          return proof;
        },
      }),
    ).rejects.toMatchObject({ record: { state: "unknown", txHash } });
    expect(observed.at(-1)).toMatchObject({ state: "unknown", txHash });
    expect(createEvidenceJournal(() => m.storage).read(hash)?.state).toBe(
      "submitting",
    );
  });
  it("recovers a matching native proof and releases the account without resubmitting", () => {
    const m = memory();
    m.journal.write(record());
    expect(() =>
      applyEvidenceReconciliation(m.journal, record(), {
        status: "confirmed",
        evidence: { ...proof, txHash: blockHash },
      }),
    ).toThrow("different transaction");
    const next = applyEvidenceReconciliation(m.journal, record(), {
      status: "confirmed",
      evidence: proof,
    });
    expect(next).toMatchObject({ state: "finalized", proof });
    expect(() => assertEvidenceAccountClear(m.journal, account)).not.toThrow();
  });
  it("keeps the original start block while paging unknown history and permits retry only on finalized failure", () => {
    const m = memory();
    m.journal.write(record());
    const next = applyEvidenceReconciliation(m.journal, record(), {
      status: "unknown",
      txHash,
      nextBlock: 20,
      reason: "History pruned",
    });
    expect(next).toMatchObject({
      fromBlock: 10,
      nextBlock: 20,
      state: "unknown",
    });
    expect(() => assertEvidenceAccountClear(m.journal, account)).toThrow();
    applyEvidenceReconciliation(m.journal, next, {
      status: "failed",
      evidence: proof,
    });
    expect(() => assertEvidenceAccountClear(m.journal, account)).not.toThrow();
  });
  it("serializes native storage under the same account lock as contract writes", async () => {
    const m = memory();
    let locked = false;
    vi.stubGlobal("navigator", {
      locks: {
        request: async (
          _name: string,
          _options: unknown,
          callback: (lock: object | null) => Promise<unknown>,
        ) => {
          if (locked) return callback(null);
          locked = true;
          try {
            return await callback({});
          } finally {
            locked = false;
          }
        },
      },
    });
    const second = vi.fn(async () => proof);
    let release!: () => void;
    const paused = new Promise<void>((resolve) => {
      release = resolve;
    });
    const first = withAccountWriteLock(canonicalAccount(account), () =>
      submitNativeEvidence({
        hash,
        account,
        fromBlock: 10,
        journal: m.journal,
        submit: async () => {
          await paused;
          return proof;
        },
      }),
    );
    await expect(
      withAccountWriteLock(canonicalAccount(account), second),
    ).rejects.toThrow("another MeterMend tab");
    expect(second).not.toHaveBeenCalled();
    release();
    await expect(first).resolves.toEqual(proof);
  });
});
