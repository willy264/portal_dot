import { afterEach, describe, expect, it, vi } from "vitest";
import { Subject } from "rxjs";
import type { Transaction, TxCreator, TxEvent } from "polkadot-api";
import {
  FinalizedDispatchError,
  SubmissionUnknownError,
  submitAndWatch,
  buildEvidenceStore,
  submitEvidenceStore,
} from "./revive";
import { getAccountState, getApi } from "./client";

vi.mock("./client", () => ({
  verifyNetwork: vi.fn(async () => undefined),
  getAccountState: vi.fn(),
  getApi: vi.fn(),
  getClient: vi.fn(),
  h160Of: vi.fn(),
}));

const txHash = `0x${"ab".repeat(32)}` as const;
const blockHash = `0x${"cd".repeat(32)}` as const;
const signer = {
  address: "public-test-address",
  txCreator: (() => Promise.resolve("0x")) as TxCreator,
};
const block = { hash: blockHash, number: 42, index: 3 };

function fixture() {
  const events = new Subject<TxEvent>();
  const createSubmitAndWatch = vi.fn(() => events);
  const tx = { createSubmitAndWatch } as unknown as Transaction;
  return { events, tx, createSubmitAndWatch };
}

async function subscribed() {
  await Promise.resolve();
  await Promise.resolve();
}
afterEach(() => vi.useRealTimers());

describe("submission finality and durable uncertainty", () => {
  it("prepares native storage without signing and preserves Stored proof when submitted", async () => {
    const { events, tx, createSubmitAndWatch } = fixture();
    const nativeTx = Object.assign(tx, {
      getEstimatedFees: vi.fn(async () => 10n),
    });
    vi.mocked(getAccountState).mockResolvedValue({
      mapped: true,
      nativeBalance: 10000n,
      nativeFrozen: 0n,
    } as Awaited<ReturnType<typeof getAccountState>>);
    vi.mocked(getApi).mockReturnValue({
      tx: { TransactionStorage: { store: () => nativeTx } },
      constants: {
        TransactionStorage: { MaxTransactionSize: async () => 65536 },
        Balances: { ExistentialDeposit: async () => 1n },
      },
      query: {
        TransactionStorage: {
          ByteFee: { getValue: async () => 1n },
          EntryFee: { getValue: async () => 1n },
          RetentionPeriod: { getValue: async () => 100800 },
        },
      },
    } as unknown as ReturnType<typeof getApi>);
    const prepared = await buildEvidenceStore({
      signer,
      bytes: new Uint8Array(1024),
    });
    expect(createSubmitAndWatch).not.toHaveBeenCalled();
    const pending = submitEvidenceStore(prepared, signer);
    await subscribed();
    events.next({
      type: "finalized",
      txHash,
      ok: true,
      block,
      events: [
        {
          type: "TransactionStorage",
          value: {
            type: "Stored",
            value: { index: 7, content_hash: blockHash },
          },
        },
      ],
    } as unknown as TxEvent);
    await expect(pending).resolves.toMatchObject({
      txHash,
      block: 42,
      storageIndex: 7,
      storageContentHash: blockHash,
      bytes: 1024,
      retentionBlocks: 100800,
    });
    expect(createSubmitAndWatch).toHaveBeenCalledTimes(1);
    vi.mocked(getAccountState).mockResolvedValue({
      mapped: true,
      nativeBalance: 10n,
      nativeFrozen: 0n,
    } as Awaited<ReturnType<typeof getAccountState>>);
    await expect(
      buildEvidenceStore({ signer, bytes: new Uint8Array(1024) }),
    ).rejects.toThrow("Insufficient native balance");
    expect(createSubmitAndWatch).toHaveBeenCalledTimes(1);
  });
  it("journals the hash immediately and resolves only finalized inclusion with one subscription", async () => {
    const { events, tx, createSubmitAndWatch } = fixture();
    const journal: string[] = [];
    let resolved = false;
    const pending = submitAndWatch(tx, signer, {
      onStatus: (event) => journal.push(`${event.type}:${event.txHash}`),
    });
    void pending.then(() => {
      resolved = true;
    });
    await subscribed();
    events.next({ type: "created", txHash });
    expect(journal).toEqual([`created:${txHash}`]);
    events.next({ type: "inBestBlock", txHash, ok: true, block, events: [] });
    await subscribed();
    expect(resolved).toBe(false);
    events.next({ type: "notInBestBlock", txHash });
    events.next({ type: "finalized", txHash, ok: true, block, events: [] });
    await expect(pending).resolves.toMatchObject({
      txHash,
      block: 42,
      blockHash,
      extrinsicIndex: 3,
    });
    expect(createSubmitAndWatch).toHaveBeenCalledTimes(1);
    expect(events.observed).toBe(false);
  });

  it("retains the transaction hash after a connection loss and never retries broadcasting", async () => {
    const { events, tx, createSubmitAndWatch } = fixture();
    const pending = submitAndWatch(tx, signer);
    const rejected = pending.catch((error) => error);
    await subscribed();
    events.next({ type: "created", txHash });
    events.next({ type: "broadcasted", txHash });
    events.error(new Error("websocket disconnected"));
    const error = await rejected;
    expect(error).toBeInstanceOf(SubmissionUnknownError);
    expect(error).toMatchObject({ ambiguous: true, txHash });
    expect(createSubmitAndWatch).toHaveBeenCalledTimes(1);
  });

  it("keeps a rejected signature distinct from an unknown submitted outcome", async () => {
    const { events, tx } = fixture();
    const pending = submitAndWatch(tx, signer);
    const original = new Error("wallet signature rejected");
    const rejected = pending.catch((error) => error);
    await subscribed();
    events.error(original);
    expect(await rejected).toBe(original);
    expect(await rejected).not.toBeInstanceOf(SubmissionUnknownError);
  });

  it("preserves explicit finalized dispatch failure as known evidence", async () => {
    const { events, tx } = fixture();
    const pending = submitAndWatch(tx, signer);
    const rejected = pending.catch((error) => error);
    await subscribed();
    events.next({ type: "created", txHash });
    events.next({
      type: "finalized",
      txHash,
      block,
      events: [],
      ok: false,
      dispatchError: { type: "BadOrigin", value: undefined },
    });
    const error = await rejected;
    expect(error).toBeInstanceOf(FinalizedDispatchError);
    expect(error).toMatchObject({
      ambiguous: false,
      evidence: { txHash, block: 42 },
      dispatchError: { type: "BadOrigin" },
    });
  });

  it("pauses on journal failure instead of returning success without durable evidence", async () => {
    const { events, tx } = fixture();
    const pending = submitAndWatch(tx, signer, {
      onStatus: () => {
        throw new Error("database unavailable");
      },
    });
    const rejected = pending.catch((error) => error);
    await subscribed();
    events.next({ type: "created", txHash });
    expect(await rejected).toMatchObject({ ambiguous: true, txHash });
    expect(events.observed).toBe(false);
  });

  it("times out after broadcast with an ambiguous hash and cleans up its subscription", async () => {
    vi.useFakeTimers();
    const { events, tx, createSubmitAndWatch } = fixture();
    const pending = submitAndWatch(tx, signer, { timeoutMs: 100 });
    const rejected = pending.catch((error) => error);
    await subscribed();
    events.next({ type: "created", txHash });
    await vi.advanceTimersByTimeAsync(100);
    expect(await rejected).toMatchObject({ ambiguous: true, txHash });
    expect(events.observed).toBe(false);
    expect(createSubmitAndWatch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not treat stream completion or best-block inclusion as finality", async () => {
    const { events, tx } = fixture();
    const pending = submitAndWatch(tx, signer);
    const rejected = pending.catch((error) => error);
    await subscribed();
    events.next({ type: "inBestBlock", txHash, ok: true, block, events: [] });
    events.complete();
    expect(await rejected).toMatchObject({ ambiguous: true, txHash });
  });

  it("cleans up the timeout when transaction creation throws synchronously", async () => {
    vi.useFakeTimers();
    const original = new Error("creator unavailable");
    const tx = {
      createSubmitAndWatch: () => {
        throw original;
      },
    } as unknown as Transaction;
    await expect(submitAndWatch(tx, signer)).rejects.toBe(original);
    expect(vi.getTimerCount()).toBe(0);
  });
});
