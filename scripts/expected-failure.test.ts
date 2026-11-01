import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { encodeErrorResult } from "viem";
import { meterMendAbi } from "../packages/chain/src/abi";
import {
  FinalizedDispatchError,
  SimulationError,
  type ChainSigner,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
vi.mock("../packages/chain/src/client", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getAccountState: vi.fn(async () => ({ block: 10, nonce: 4 })),
  getFinalizedHead: vi.fn(async () => {
    throw new Error("Outcome unavailable; no resubmission");
  }),
}));
import { Journal } from "./lib";
import {
  expectFinalizedContractRevert,
  requireNotArbiter,
  requireUnchangedReserveAndRepair,
} from "./expected-failure";

const directories: string[] = [];
const originalArgv = [...process.argv];
const account = { address: "public-operator" } as ChainSigner;
const dispatchError = {
  type: "Module",
  value: { type: "Revive", value: { type: "ContractReverted" } },
};
const evidence = {
  txHash: `0x${"ab".repeat(32)}`,
  block: 11,
  blockHash: `0x${"cd".repeat(32)}`,
  extrinsicIndex: 0,
  events: [
    {
      type: "System",
      value: {
        type: "ExtrinsicFailed",
        value: { dispatch_error: dispatchError },
      },
    },
  ],
} as unknown as TransactionEvidence;
function journalAt() {
  const directory = mkdtempSync(join(tmpdir(), "metermend-negative-"));
  directories.push(directory);
  return new Journal(join(directory, "journal.json"));
}
afterEach(() => {
  process.argv = [...originalArgv];
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe("negative reserve-spending proof", () => {
  it("requires the exact NotArbiter revert, never a network error or different revert", () => {
    const expected = new SimulationError("reverted", {
      flags: 1,
      data: encodeErrorResult({ abi: meterMendAbi, errorName: "NotArbiter" }),
    });
    expect(requireNotArbiter(expected).error).toBe("NotArbiter");
    expect(() => requireNotArbiter(new Error("RPC disconnected"))).toThrow(
      "RPC disconnected",
    );
    expect(() =>
      requireNotArbiter(
        new SimulationError("wrong", {
          flags: 1,
          data: encodeErrorResult({
            abi: meterMendAbi,
            errorName: "InsufficientReserve",
          }),
        }),
      ),
    ).toThrow("wrong");
  });
  it("persists a real finalized failed receipt and reuses it even with --retry-failed", async () => {
    const journal = journalAt();
    const action = vi.fn(async () => {
      throw new FinalizedDispatchError(evidence, dispatchError);
    });
    const input = {
      journal,
      key: "negative",
      intent: { value: "0" },
      account,
      action,
    };
    expect((await expectFinalizedContractRevert(input)).evidence).toEqual(
      evidence,
    );
    expect(journal.data.steps.negative?.state).toBe("failed");
    journal.close();
    process.argv.push("--retry-failed");
    const resumed = new Journal(journal.path);
    expect(
      (await expectFinalizedContractRevert({ ...input, journal: resumed }))
        .evidence,
    ).toEqual(evidence);
    expect(action).toHaveBeenCalledTimes(1);
    resumed.close();
  });
  it("reconciles an unknown hash without invoking the write again", async () => {
    const journal = journalAt();
    const action = vi.fn(async (options: any) => {
      options.onStatus({ type: "broadcasted", txHash: evidence.txHash });
      throw new Error("Disconnected");
    });
    const input = {
      journal,
      key: "negative",
      intent: { value: "0" },
      account,
      action,
    };
    await expect(expectFinalizedContractRevert(input)).rejects.toThrow(
      "Disconnected",
    );
    process.argv.push("--retry-failed");
    await expect(expectFinalizedContractRevert(input)).rejects.toThrow(
      "no resubmission",
    );
    expect(action).toHaveBeenCalledTimes(1);
    journal.close();
  });
  it("does not mislabel a different dispatch failure or unexpected success", async () => {
    const journal = journalAt();
    const wrong = {
      ...evidence,
      events: [
        {
          type: "System",
          value: {
            type: "ExtrinsicFailed",
            value: { dispatch_error: { type: "BadOrigin" } },
          },
        },
      ],
    } as unknown as TransactionEvidence;
    await expect(
      expectFinalizedContractRevert({
        journal,
        key: "wrong",
        intent: {},
        account,
        action: async () => {
          throw new FinalizedDispatchError(wrong, {});
        },
      }),
    ).rejects.toThrow("other than Revive.ContractReverted");
    await expect(
      expectFinalizedContractRevert({
        journal,
        key: "success",
        intent: {},
        account,
        action: async () => evidence,
      }),
    ).rejects.toThrow("unexpectedly succeeded");
    journal.close();
  });
  it("requires reserve and repair state to stay identical, including after JSON persistence", () => {
    const before = {
      reserve: "500",
      repair: ["1", "0xrepairer", "200", "0xreceipt", false, false],
    };
    expect(() =>
      requireUnchangedReserveAndRepair(before, {
        reserve: 500n,
        repair: [1n, "0xrepairer", 200n, "0xreceipt", false, false],
      }),
    ).not.toThrow();
    expect(() =>
      requireUnchangedReserveAndRepair(before, { ...before, reserve: "300" }),
    ).toThrow("changed");
    expect(() =>
      requireUnchangedReserveAndRepair(before, {
        ...before,
        repair: [...before.repair.slice(0, 4), true, false],
      }),
    ).toThrow("changed");
  });
});
