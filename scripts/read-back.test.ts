import { describe, expect, it, vi } from "vitest";
import type { Manifest } from "./lib";
import { verifyReadBack } from "./read-back-model";
import { collectManifestOperations } from "./manifest-operations";

const cron = `0x${"11".repeat(20)}`;
const meter = `0x${"22".repeat(20)}`;
const receipt = {
  txHash: `0x${"ab".repeat(32)}`,
  blockHash: `0x${"cd".repeat(32)}`,
  block: 10,
  extrinsicIndex: 1,
  events: [{ type: "System", value: { type: "ExtrinsicSuccess" } }],
};
const deployment = () =>
  ({
    network: "portaldot-v3-testnet",
    chainId: 420420777,
    specVersion: 3002,
    codeFormat: "evm",
    cronpotMode: "keeper",
    cronTipEvm: "10000",
    contracts: {
      Cronpot: { ...receipt, address: cron },
      MeterMend: { ...receipt, address: meter },
    },
  }) as unknown as Manifest;
const at = { number: 12, hash: `0x${"ef".repeat(32)}` };

describe("finalized contract read-back", () => {
  it("reads all constructor values at one immutable snapshot", async () => {
    const read = vi.fn(async (_abi, _address, fn) =>
      fn === "nextJobId" ? 3n : fn === "cronpot" ? cron : 10000n,
    );
    const result = await verifyReadBack(deployment(), at, read);
    expect(result.status).toBe("passed");
    expect(result.contracts.Cronpot.nextJobId).toBe("3");
    expect(read).toHaveBeenCalledTimes(3);
    for (const call of read.mock.calls as unknown[][])
      expect(call[4]).toEqual({ at });
  });
  it("keeps an absent MeterMend deployment pending and performs no call for it", async () => {
    const input = deployment();
    delete input.contracts.MeterMend;
    const read = vi.fn(async () => 1n);
    const result = await verifyReadBack(input, at, read);
    expect(result.status).toBe("partial");
    expect(result.contracts.MeterMend).toEqual({
      status: "pending-deployment",
    });
    expect(read).toHaveBeenCalledTimes(1);
  });
  it("fails a wrong immutable Cronpot address or unrecorded tip", async () => {
    const read = vi.fn(async (_abi, _address, fn) =>
      fn === "nextJobId" ? 1n : fn === "cronpot" ? meter : 10000n,
    );
    expect(
      (await verifyReadBack(deployment(), at, read)).contracts.MeterMend.status,
    ).toBe("failed");
    const input = deployment();
    delete input.cronTipEvm;
    expect(
      (
        await verifyReadBack(input, at, async (_abi, _address, fn) =>
          fn === "nextJobId" ? 1n : fn === "cronpot" ? cron : 10000n,
        )
      ).contracts.MeterMend.status,
    ).toBe("failed");
  });
  it("does not read a deployment newer than the fixed finalized block", async () => {
    const input = deployment();
    input.contracts.Cronpot!.block = 13;
    delete input.contracts.MeterMend;
    const read = vi.fn();
    expect((await verifyReadBack(input, at, read)).status).toBe("failed");
    expect(read).not.toHaveBeenCalled();
  });
});

it("indexes only confirmed successful funding and matching seeded-item receipts", () => {
  const entry = {
    state: "confirmed",
    signer: "public-source",
    intent: {
      role: "RENTER",
      destination: "public-renter",
      targetNative: "123",
      contract: meter,
      arbiter: cron,
      disputeWindow: 120,
    },
    evidence: receipt,
  };
  const input = {
    funding: {
      steps: {
        valid: entry,
        pending: { ...entry, state: "submitted" },
        failed: {
          ...entry,
          evidence: {
            ...receipt,
            events: [{ type: "System", value: { type: "ExtrinsicFailed" } }],
          },
        },
      },
    },
    seedJournal: { steps: { "register-camera": entry } },
    seed: {
      contract: meter,
      items: {
        camera: { itemId: "1", name: "Camera", txHash: receipt.txHash },
      },
    },
    meterMend: meter,
  };
  const result = collectManifestOperations(input);
  expect(Object.keys(result.funding)).toEqual(["valid"]);
  expect(Object.keys(result.items)).toEqual(["camera"]);
  expect((result.items.camera as any).disputeWindow).toBe(120);
  expect(
    collectManifestOperations({
      ...input,
      seed: { ...input.seed, contract: cron },
    }).items,
  ).toEqual({});
  expect(
    collectManifestOperations({
      ...input,
      seed: {
        ...input.seed,
        items: {
          camera: { ...input.seed.items.camera, txHash: "0xdifferent" },
        },
      },
    }).items,
  ).toEqual({});
});
