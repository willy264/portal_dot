import { afterEach, describe, expect, it } from "vitest";
import { Store } from "@metermend/service-core";
import { restorePreviewSnapshot } from "../src/bootstrap";

const genesis =
  "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd";
const address = `0x${"11".repeat(20)}`;
const blockHash = `0x${"22".repeat(32)}`;
const manifest = {
  contracts: { Cronpot: { address }, MeterMend: { address } },
};
const snapshot = () => ({
  schemaVersion: 1,
  genesisHash: genesis,
  contracts: { Cronpot: address, MeterMend: address },
  startBlock: 10,
  through: { block: 11, hash: blockHash },
  blocks: [
    { block: 10, hash: blockHash },
    { block: 11, hash: blockHash },
  ],
  events: [
    {
      id: "actual-event",
      network: "portaldot-v3-testnet",
      address,
      eventName: "Rented",
      args: {},
      txHash: `0x${"33".repeat(32)}`,
      block: 10,
      blockHash,
      eventIndex: 2,
      observedAt: "2026-11-01T00:00:00Z",
      source: "substrate" as const,
    },
  ],
  jobs: [
    {
      id: "1",
      owner: address,
      target: address,
      executeAfter: "1",
      state: "Failed",
      scheduling: "keeper-executed",
      attempts: 1,
    },
  ],
});
const stores: Store[] = [];
const store = () => {
  const s = new Store(":memory:");
  stores.push(s);
  return s;
};
afterEach(() => stores.splice(0).forEach((s) => s.close()));
describe("retained preview bootstrap", () => {
  it("restores real history including empty block boundaries and a failed job", () => {
    const s = store();
    expect(restorePreviewSnapshot(s, snapshot(), manifest).restored).toBe(true);
    expect(s.events()).toHaveLength(1);
    expect(s.blockHash(11)).toBe(blockHash);
    expect(s.job("1")?.state).toBe("Failed");
    expect(s.cursor("jobs")).toEqual({ block: 11, hash: blockHash });
  });
  it.each(["block", "event", "network", "contract", "unfinished"])(
    "rejects a %s mismatch before touching storage",
    (kind) => {
      const input = snapshot();
      if (kind === "block") input.blocks.splice(0, 1);
      if (kind === "event") input.events[0]!.blockHash = `0x${"44".repeat(32)}`;
      if (kind === "network") input.genesisHash = "wrong";
      if (kind === "contract") input.contracts.Cronpot = `0x${"55".repeat(20)}`;
      if (kind === "unfinished") input.jobs[0]!.state = "Scheduled";
      const s = store();
      expect(() => restorePreviewSnapshot(s, input, manifest)).toThrow();
      expect(s.events()).toHaveLength(0);
      expect(s.cursor("chain")).toBeUndefined();
    },
  );
  it("preserves an existing index without rolling its cursor back", () => {
    const s = store();
    s.saveBlock("chain", 20, blockHash, []);
    expect(restorePreviewSnapshot(s, snapshot(), manifest).restored).toBe(
      false,
    );
    expect(s.cursor("chain")?.block).toBe(20);
    expect(s.events()).toHaveLength(0);
  });
});
