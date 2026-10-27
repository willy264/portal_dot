import { beforeEach, expect, it, vi } from "vitest";
import { Blake2256 } from "@polkadot-api/substrate-bindings";
import { hexToBytes, toHex } from "viem";
import { reconcileTransaction } from "./revive";

const mocks = vi.hoisted(() => ({
  request: vi.fn(),
  events: vi.fn(),
  head: vi.fn(),
}));
vi.mock("./client", () => ({
  verifyNetwork: vi.fn(async () => undefined),
  getClient: () => ({ _request: mocks.request }),
  getApi: () => ({ query: { System: { Events: { getValue: mocks.events } } } }),
  getFinalizedHead: mocks.head,
  getAccountState: vi.fn(),
  h160Of: vi.fn(),
}));

const transaction = "0x01020304";
const txHash = toHex(Blake2256(hexToBytes(transaction)));
const hash = `0x${"ab".repeat(32)}`;
const record = (index: number, name: string, value: unknown = {}) => ({
  phase: { type: "ApplyExtrinsic", value: index },
  topics: [],
  event: { type: "System", value: { type: name, value } },
});

beforeEach(() => {
  vi.resetAllMocks();
  mocks.head.mockResolvedValue({ number: 20, hash, timestamp: 100n });
  mocks.request.mockImplementation(async (method: string) =>
    method === "chain_getBlockHash"
      ? hash
      : { block: { extrinsics: ["0x00", transaction] } },
  );
});

it("confirms the exact native transaction using only its own finalized extrinsic events", async () => {
  mocks.events.mockResolvedValue([
    record(0, "ExtrinsicFailed", { dispatch_error: "unrelated" }),
    record(1, "ExtrinsicSuccess"),
  ]);
  const result = await reconcileTransaction({
    txHash,
    fromBlock: 10,
    maxBlocks: 1,
  });
  expect(result).toMatchObject({
    status: "confirmed",
    evidence: { txHash, block: 10, extrinsicIndex: 1 },
  });
  if (result.status === "confirmed")
    expect(result.evidence.events).toHaveLength(1);
});

it("returns known finalized dispatch failure instead of an ambiguous or successful outcome", async () => {
  mocks.events.mockResolvedValue([
    record(1, "ExtrinsicFailed", { dispatch_error: { type: "BadOrigin" } }),
  ]);
  expect(
    await reconcileTransaction({ txHash, fromBlock: 10, maxBlocks: 1 }),
  ).toMatchObject({
    status: "failed",
    evidence: { txHash, block: 10 },
    dispatchError: { dispatch_error: { type: "BadOrigin" } },
  });
});

it("does not borrow another transaction's success when the matching dispatch proof is missing", async () => {
  mocks.events.mockResolvedValue([record(0, "ExtrinsicSuccess")]);
  expect(
    await reconcileTransaction({ txHash, fromBlock: 10, maxBlocks: 1 }),
  ).toMatchObject({
    status: "unknown",
    searchedThrough: 9,
    nextBlock: 10,
  });
});

it("persists bounded progress without treating a missing transaction as permission to resend", async () => {
  mocks.request.mockImplementation(async (method: string) =>
    method === "chain_getBlockHash"
      ? hash
      : { block: { extrinsics: ["0x00"] } },
  );
  expect(
    await reconcileTransaction({ txHash, fromBlock: 10, maxBlocks: 2 }),
  ).toMatchObject({
    status: "pending",
    searchedThrough: 11,
    nextBlock: 12,
  });
  expect(mocks.request).toHaveBeenCalledTimes(4);
  expect(mocks.events).not.toHaveBeenCalled();
});

it("does not advance its cursor across a pruned finalized block body", async () => {
  mocks.request.mockImplementation(async (method: string) =>
    method === "chain_getBlockHash" ? hash : null,
  );
  expect(
    await reconcileTransaction({ txHash, fromBlock: 10, maxBlocks: 2 }),
  ).toMatchObject({
    status: "unknown",
    searchedThrough: 9,
    nextBlock: 10,
    reason: "Block body 10 is unavailable",
  });
});

it("does not inspect blocks beyond the current native finalized head", async () => {
  expect(
    await reconcileTransaction({ txHash, fromBlock: 21, maxBlocks: 10 }),
  ).toMatchObject({
    status: "pending",
    searchedThrough: 20,
    nextBlock: 21,
  });
  expect(mocks.request).not.toHaveBeenCalled();
});
