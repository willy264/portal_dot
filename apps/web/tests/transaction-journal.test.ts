import { afterEach, describe, expect, it, vi } from "vitest";
import { AccountId } from "polkadot-api";
import {
  createIntentJournal,
  canonicalAccount,
  submitContractIntent,
  assertAccountClear,
  isPendingIntent,
  applyTransactionReconciliation,
  CONTRACT_JOURNAL_KEY,
  CONTRACT_INTENT_PREFIX,
  verifyTransactionStorage,
  PendingTransactionError,
  UnknownTransactionError,
  withAccountWriteLock,
  type ContractIntent,
  type FinalizedReceipt,
  type StorageLike,
} from "../lib/transaction-journal";
import type { Hex } from "../lib/types";
const address = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
const accountKey = canonicalAccount(address);
const txHash = `0x${"a".repeat(64)}` as Hex;
const blockHash = `0x${"b".repeat(64)}` as Hex;
const receipt: FinalizedReceipt = {
  txHash,
  block: 12,
  blockHash,
  extrinsicIndex: 0,
  events: [],
};
function intent(id = "one"): ContractIntent {
  return {
    id,
    chainId: 420420777,
    account: address,
    accountKey,
    action: "rent",
    target: `0x${"c".repeat(40)}`,
    data: "0x12345678",
    value: "6000000000000000000",
    fromBlock: 10,
    nextBlock: 10,
    state: "preparing",
    createdAt: "2026-10-27T12:00:00Z",
    updatedAt: "2026-10-27T12:00:00Z",
  };
}
function memory() {
  const values = new Map<string, string>();
  let fail = false;
  const store: StorageLike = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (fail) throw new Error("Storage quota exceeded");
      values.set(key, value);
    },
    key: (index) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size;
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
  return {
    values,
    store,
    fail: () => {
      fail = true;
    },
    journal: createIntentJournal(() => store),
  };
}
afterEach(() => vi.unstubAllGlobals());
describe("contract payment recovery", () => {
  it("restores an in-memory hash after storage recovers and records its finalized outcome", () => {
    const m = memory();
    m.journal.put({ ...intent(), state: "awaiting-signature" });
    const observed = { ...intent(), state: "unknown" as const, txHash };
    const next = applyTransactionReconciliation(m.journal, observed, {
      status: "confirmed",
      evidence: receipt,
    });
    expect(next).toMatchObject({ state: "confirmed", txHash });
    expect(m.journal.list()[0]?.receipt).toEqual(receipt);
  });
  it("allows an explicit retry after a read-only preparation failure without signing", async () => {
    const m = memory();
    const submit = vi.fn(async () => receipt);
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent(),
        prepare: async () => {
          throw new Error("Simulation reverted");
        },
        submit,
      }),
    ).rejects.toThrow("Simulation reverted");
    expect(submit).not.toHaveBeenCalled();
    expect(m.journal.list()[0]?.state).toBe("failed");
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent("retry"),
        prepare: async () => true,
        submit,
      }),
    ).resolves.toEqual(receipt);
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("retains a direct finalized dispatch failure and does not treat it as uncertain", async () => {
    const m = memory();
    const submit = vi.fn(
      async (
        _prepared: unknown,
        onStatus: (event: { txHash: Hex; stage: string }) => void,
      ) => {
        onStatus({ txHash, stage: "finalized" });
        throw Object.assign(new Error("Finalized extrinsic failed"), {
          ambiguous: false,
          evidence: receipt,
          dispatchError: "BadOrigin",
        });
      },
    );
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent(),
        prepare: async () => true,
        submit,
      }),
    ).rejects.toThrow("Finalized extrinsic failed");
    expect(m.journal.list()[0]).toMatchObject({
      state: "failed",
      txHash,
      receipt,
    });
    expect(() =>
      assertAccountClear(m.journal, accountKey, 420420777),
    ).not.toThrow();
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("preserves interleaved writes from two accounts without a shared array overwrite", () => {
    const m = memory();
    const tab1 = m.journal;
    const tab2 = createIntentJournal(() => m.store);
    const first = { ...intent("first"), state: "submitted" as const, txHash };
    const second = {
      ...intent("second"),
      accountKey: "2".repeat(64),
      state: "submitted" as const,
      txHash: blockHash,
    };
    tab1.put(first);
    tab2.put(second);
    tab1.put({ ...first, state: "unknown" });
    tab2.put({ ...second, state: "unknown" });
    const reloaded = createIntentJournal(() => m.store);
    expect(reloaded.list()).toHaveLength(2);
    expect(reloaded.list().find((item) => item.id === "first")?.txHash).toBe(
      txHash,
    );
    expect(reloaded.list().find((item) => item.id === "second")?.txHash).toBe(
      blockHash,
    );
    expect(m.store.getItem(CONTRACT_JOURNAL_KEY)).toBeNull();
  });
  it("probes storage using a sentinel while another tab records a payment", () => {
    const m = memory();
    m.journal.put(intent("first"));
    const originalSet = m.store.setItem;
    m.store.setItem = (key, value) => {
      if (key.startsWith("metermend-storage-check:"))
        m.journal.put({
          ...intent("second"),
          accountKey: "2".repeat(64),
          state: "submitted",
          txHash,
        });
      originalSet(key, value);
    };
    verifyTransactionStorage(() => m.store);
    expect(m.journal.list()).toHaveLength(2);
    expect(
      Array.from(m.values.keys()).every((key) =>
        key.startsWith(CONTRACT_INTENT_PREFIX),
      ),
    ).toBe(true);
  });
  it("keeps a finalized outcome when a stale tab reports an inconclusive scan", () => {
    const m = memory();
    const original = { ...intent(), state: "unknown" as const, txHash };
    m.journal.put(original);
    applyTransactionReconciliation(m.journal, original, {
      status: "confirmed",
      evidence: receipt,
    });
    const next = applyTransactionReconciliation(
      createIntentJournal(() => m.store),
      original,
      {
        status: "unknown",
        txHash,
        searchedThrough: 11,
        nextBlock: 12,
        reason: "stale scan",
      },
    );
    expect(next.state).toBe("confirmed");
    expect(() => m.journal.put({ ...original, state: "submitted" })).toThrow(
      "finalized",
    );
  });
  it("reads legacy pending records and safely updates only the corresponding new key", () => {
    const m = memory();
    const legacy = { ...intent(), state: "unknown" as const, txHash };
    const raw = JSON.stringify([legacy]);
    m.values.set(CONTRACT_JOURNAL_KEY, raw);
    applyTransactionReconciliation(m.journal, legacy, {
      status: "confirmed",
      evidence: receipt,
    });
    expect(m.store.getItem(CONTRACT_JOURNAL_KEY)).toBe(raw);
    expect(m.journal.list()).toHaveLength(1);
    expect(m.journal.list()[0]?.state).toBe("confirmed");
  });
  it("refuses to prepare or sign when the intent cannot be durably stored", async () => {
    const m = memory();
    m.fail();
    const prepare = vi.fn(async () => "prepared");
    const submit = vi.fn(async () => receipt);
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent(),
        prepare,
        submit,
      }),
    ).rejects.toThrow("quota");
    expect(prepare).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });
  it("persists signer, target, exact payment, calldata and start block before signing", async () => {
    const m = memory();
    await submitContractIntent({
      journal: m.journal,
      intent: intent(),
      prepare: async () => true,
      submit: async (_, onStatus) => {
        expect(m.journal.list()[0]).toMatchObject({
          state: "awaiting-signature",
          account: address,
          target: intent().target,
          value: intent().value,
          data: intent().data,
          fromBlock: 10,
        });
        onStatus({ txHash, stage: "broadcasted" });
        expect(m.journal.list()[0]?.txHash).toBe(txHash);
        return receipt;
      },
    });
    expect(m.journal.list()[0]).toMatchObject({ state: "confirmed", receipt });
  });
  it("blocks every new write for the same account after an unknown result and a reload", async () => {
    const m = memory();
    const submit = vi.fn(
      async (
        _prepared: unknown,
        onStatus: (event: { txHash: Hex; stage: string }) => void,
      ) => {
        onStatus({ txHash, stage: "broadcasted" });
        throw Object.assign(new Error("Connection lost"), {
          ambiguous: true,
          txHash,
        });
      },
    );
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent(),
        prepare: async () => true,
        submit,
      }),
    ).rejects.toBeInstanceOf(UnknownTransactionError);
    const reloaded = createIntentJournal(() => m.store);
    const other = { ...intent("two"), action: "withdrawIncome" };
    await expect(
      submitContractIntent({
        journal: reloaded,
        intent: other,
        prepare: async () => true,
        submit,
      }),
    ).rejects.toBeInstanceOf(PendingTransactionError);
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("keeps an uncertain transaction locked when no hash was returned", async () => {
    const m = memory();
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent(),
        prepare: async () => true,
        submit: async () => {
          throw new Error("Creation stream timed out");
        },
      }),
    ).rejects.toBeInstanceOf(UnknownTransactionError);
    expect(m.journal.list()[0]).toMatchObject({ state: "unknown" });
    expect(() =>
      assertAccountClear(
        createIntentJournal(() => m.store),
        accountKey,
        420420777,
      ),
    ).toThrow(PendingTransactionError);
  });
  it("throws synchronously from created-hash persistence and preserves the earlier account lock", async () => {
    const m = memory();
    let hashCallbackThrew = false;
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent(),
        prepare: async () => true,
        submit: async (_, onStatus) => {
          m.fail();
          try {
            onStatus({ txHash, stage: "signed" });
          } catch (error) {
            hashCallbackThrew = true;
            throw Object.assign(
              new Error("SDK journal callback failed", { cause: error }),
              { ambiguous: true, txHash },
            );
          }
          return receipt;
        },
      }),
    ).rejects.toMatchObject({ intent: { txHash, state: "unknown" } });
    expect(hashCallbackThrew).toBe(true);
    expect(createIntentJournal(() => m.store).list()[0]?.state).toBe(
      "awaiting-signature",
    );
  });
  it("allows a new explicit attempt after the user rejects before any hash exists", async () => {
    const m = memory();
    const submit = vi.fn(async () => {
      throw Object.assign(new Error("User rejected the request"), {
        code: 4001,
      });
    });
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent(),
        prepare: async () => true,
        submit,
      }),
    ).rejects.toThrow("User rejected");
    expect(submit).toHaveBeenCalledTimes(1);
    expect(m.journal.list()[0]?.state).toBe("rejected");
    await expect(
      submitContractIntent({
        journal: m.journal,
        intent: intent("retry"),
        prepare: async () => true,
        submit: async () => receipt,
      }),
    ).resolves.toEqual(receipt);
  });
  it("keeps pruned or missing history uncertain and only advances the read cursor", () => {
    const m = memory();
    const original = { ...intent(), state: "unknown" as const, txHash };
    m.journal.put(original);
    const next = applyTransactionReconciliation(m.journal, original, {
      status: "unknown",
      txHash,
      searchedThrough: 19,
      nextBlock: 20,
      reason: "Historical block pruned",
    });
    expect(next).toMatchObject({
      state: "unknown",
      fromBlock: 10,
      nextBlock: 20,
    });
    expect(() => assertAccountClear(m.journal, accountKey, 420420777)).toThrow(
      PendingTransactionError,
    );
  });
  it("records a confirmed failure without resubmitting, then permits an explicit retry", async () => {
    const m = memory();
    const original = { ...intent(), state: "unknown" as const, txHash };
    m.journal.put(original);
    const submit = vi.fn(async () => receipt);
    applyTransactionReconciliation(m.journal, original, {
      status: "failed",
      evidence: receipt,
      dispatchError: "Dispatch failed",
    });
    expect(submit).not.toHaveBeenCalled();
    expect(m.journal.list()[0]?.state).toBe("failed");
    await submitContractIntent({
      journal: m.journal,
      intent: intent("retry"),
      prepare: async () => true,
      submit,
    });
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("unlocks after the matching finalized success, but rejects proof for another hash", () => {
    const m = memory();
    const original = { ...intent(), state: "unknown" as const, txHash };
    m.journal.put(original);
    expect(() =>
      applyTransactionReconciliation(m.journal, original, {
        status: "confirmed",
        evidence: { ...receipt, txHash: blockHash },
      }),
    ).toThrow("different transaction");
    expect(isPendingIntent(m.journal.list()[0]!)).toBe(true);
    applyTransactionReconciliation(m.journal, original, {
      status: "confirmed",
      evidence: receipt,
    });
    expect(() =>
      assertAccountClear(m.journal, accountKey, 420420777),
    ).not.toThrow();
  });
  it("treats damaged persisted records as blocking instead of discarding them", () => {
    const m = memory();
    m.values.set(CONTRACT_JOURNAL_KEY, "not-json");
    expect(() => m.journal.list()).toThrow("unavailable or damaged");
  });
  it("recognizes the same public account across SS58 prefixes", () => {
    const publicKey = AccountId().enc(address);
    const otherPrefix = AccountId(0).dec(publicKey);
    expect(canonicalAccount(otherPrefix)).toBe(accountKey);
  });
  it("blocks a second tab before its submission callback is entered", async () => {
    const run = vi.fn(async () => true);
    vi.stubGlobal("navigator", {
      locks: {
        request: async (
          _name: string,
          _options: unknown,
          callback: (lock: null) => Promise<unknown>,
        ) => callback(null),
      },
    });
    await expect(withAccountWriteLock(accountKey, run)).rejects.toThrow(
      "another MeterMend tab",
    );
    expect(run).not.toHaveBeenCalled();
  });
});
