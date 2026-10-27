import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type {
  ChainSigner,
  TransactionEvidence,
} from "../packages/chain/src/revive";
vi.mock("../packages/chain/src/client", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getAccountState: vi.fn(async () => ({ block: 10, nonce: 4 })),
  getFinalizedHead: vi.fn(async () => {
    throw new Error("Outcome unavailable; no resubmission");
  }),
}));
import { Journal, amount } from "./lib";

const directories: string[] = [];
const originalArgv = [...process.argv];
const account = { address: "test-public-address" } as ChainSigner;
const evidence = {
  txHash: `0x${"ab".repeat(32)}`,
  block: 11,
  blockHash: `0x${"cd".repeat(32)}`,
  extrinsicIndex: 0,
  events: [],
} as TransactionEvidence;
function destination() {
  const directory = mkdtempSync(join(tmpdir(), "metermend-journal-"));
  directories.push(directory);
  return join(directory, "journal.json");
}
afterEach(() => {
  process.argv = [...originalArgv];
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe("transaction journal", () => {
  it("persists a broadcast hash before returning and never resubmits a confirmed intent", async () => {
    const path = destination();
    const journal = new Journal(path);
    let calls = 0;
    const action = vi.fn(async (options: any) => {
      calls++;
      options.onStatus({ type: "broadcasted", txHash: evidence.txHash });
      expect(JSON.parse(readFileSync(path, "utf8")).steps.deploy.txHash).toBe(
        evidence.txHash,
      );
      return evidence;
    });
    await journal.step("deploy", { code: "same" }, account, action);
    journal.close();
    const resumed = new Journal(path);
    expect(
      await resumed.step("deploy", { code: "same" }, account, action),
    ).toEqual(evidence);
    expect(calls).toBe(1);
    resumed.close();
  });
  it("blocks an ambiguous result without invoking the write again", async () => {
    const path = destination();
    const journal = new Journal(path);
    const action = vi.fn(async (options: any) => {
      options.onStatus({ type: "broadcasted", txHash: evidence.txHash });
      throw new Error("Disconnected");
    });
    await expect(
      journal.step("pay", { value: "10" }, account, action),
    ).rejects.toThrow("Disconnected");
    journal.close();
    const resumed = new Journal(path);
    process.argv.push("--retry-failed");
    await expect(
      resumed.step("pay", { value: "10" }, account, action),
    ).rejects.toThrow("no resubmission");
    expect(action).toHaveBeenCalledTimes(1);
    resumed.close();
  });
  it("rejects reused intent keys with changed payment parameters", async () => {
    const journal = new Journal(destination());
    await journal.step("pay", { value: "10" }, account, async () => evidence);
    await expect(
      journal.step("pay", { value: "11" }, account, async () => evidence),
    ).rejects.toThrow("intent changed");
    journal.close();
  });
  it("does not turn a finalized failed dispatch into success after restart", async () => {
    const path = destination();
    const journal = new Journal(path);
    await expect(
      journal.step("pay", {}, account, async (options) => {
        options.onStatus?.({
          type: "finalized",
          txHash: evidence.txHash,
          ok: false,
          dispatchError: { type: "BadOrigin" },
          events: [],
          block: { number: 11, hash: evidence.blockHash, index: 0 },
        } as any);
        // Emulate an interruption immediately after the callback by preserving its file below.
        const snapshot = readFileSync(path, "utf8");
        expect(JSON.parse(snapshot).steps.pay.state).toBe("failed");
        throw new Error("Dispatch failed");
      }),
    ).rejects.toThrow();
    journal.close();
    const resumed = new Journal(path);
    const action = vi.fn(async () => evidence);
    await expect(resumed.step("pay", {}, account, action)).rejects.toThrow(
      "previously failed",
    );
    expect(action).not.toHaveBeenCalled();
    resumed.close();
  });
  it("recovers a finalized successful transaction after interruption without a new write", async () => {
    const path = destination();
    const journal = new Journal(path);
    await expect(
      journal.step("deploy", { code: "same" }, account, async (options) => {
        options.onStatus?.({
          type: "finalized",
          txHash: evidence.txHash,
          ok: true,
          events: [],
          block: { number: 11, hash: evidence.blockHash, index: 0 },
        } as any);
        throw new Error("Interrupted before manifest write");
      }),
    ).rejects.toThrow("Interrupted");
    journal.close();
    const resumed = new Journal(path);
    expect(await resumed.recover("deploy", { code: "same" }, account)).toEqual(
      evidence,
    );
    expect(resumed.data.steps.deploy?.state).toBe("confirmed");
    expect(await resumed.recover("missing", {}, account)).toBeUndefined();
    resumed.close();
  });
  it("preserves a failed attempt before an explicit corrected retry", async () => {
    const path = destination();
    const journal = new Journal(path);
    await expect(
      journal.step("pay", { value: "10" }, account, async () => {
        throw new Error("Budget preflight failed");
      }),
    ).rejects.toThrow("Budget");
    process.argv.push("--retry-failed");
    expect(
      await journal.step("pay", { value: "10" }, account, async () => evidence),
    ).toEqual(evidence);
    expect(journal.data.priorAttempts?.pay).toHaveLength(1);
    expect(journal.data.priorAttempts?.pay?.[0]?.state).toBe("failed");
    journal.close();
  });
});

it("requires exact decimal amounts and never silently rounds a funded value", () => {
  expect(amount("0.001", 14)).toBe(100_000_000_000n);
  expect(() => amount("-1")).toThrow();
  expect(() => amount("0.000000000000001", 14)).toThrow();
});
