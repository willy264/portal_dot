import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { Transaction, TxCreator } from "polkadot-api";
import {
  configureChain,
  disconnectChain,
  GENESIS_HASH,
  getClient,
  h160Of,
  verifyNetwork,
} from "./client";
import { submitAndWatch } from "./revive";

const mocks = vi.hoisted(() => ({
  request: vi.fn(),
  ratio: vi.fn(),
  chainId: vi.fn(),
  evmChainId: vi.fn(),
  address: vi.fn(),
  destroy: vi.fn(),
  wsProvider: vi.fn(),
}));
vi.mock("polkadot-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("polkadot-api")>()),
  createClient: () => ({
    _request: mocks.request,
    destroy: mocks.destroy,
    getTypedApi: () => ({
      constants: {
        Revive: { NativeToEthRatio: mocks.ratio, ChainId: mocks.chainId },
      },
      apis: { ReviveApi: { address: mocks.address } },
    }),
  }),
}));
vi.mock("polkadot-api/ws", () => ({ getWsProvider: mocks.wsProvider }));
vi.mock("viem", async (importOriginal) => ({
  ...(await importOriginal<typeof import("viem")>()),
  createPublicClient: () => ({ getChainId: mocks.evmChainId }),
}));

const never = () => new Promise<never>(() => undefined);

beforeEach(() => {
  disconnectChain();
  vi.resetAllMocks();
  vi.useFakeTimers();
  configureChain({ timeoutMs: 25 });
  mocks.request.mockImplementation(async (method: string) =>
    method === "chain_getBlockHash"
      ? GENESIS_HASH
      : { specName: "portaldot-v3" },
  );
  mocks.ratio.mockResolvedValue(10_000);
  mocks.chainId.mockResolvedValue(420420777n);
  mocks.evmChainId.mockResolvedValue(420420777);
});
afterEach(() => {
  disconnectChain();
  vi.useRealTimers();
});

it("times out an unresponsive identity RPC before creating or broadcasting a transaction", async () => {
  mocks.request.mockImplementation(never);
  const createSubmitAndWatch = vi.fn();
  const tx = { createSubmitAndWatch } as unknown as Transaction;
  const signer = {
    address: "public-test-address",
    txCreator: vi.fn() as unknown as TxCreator,
  };
  const pending = submitAndWatch(tx, signer).catch((error) => error);
  await vi.advanceTimersByTimeAsync(25);
  expect(await pending).toMatchObject({
    message: "V3 network identity verification timed out after 25ms",
  });
  expect(createSubmitAndWatch).not.toHaveBeenCalled();
  expect(signer.txCreator).not.toHaveBeenCalled();
  expect(mocks.request).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});

it("bounds unresolved metadata constants, aborts their signal and clears the cached failure", async () => {
  mocks.chainId.mockImplementation(never);
  const pending = verifyNetwork().catch((error) => error);
  await vi.advanceTimersByTimeAsync(25);
  expect(await pending).toMatchObject({
    message: "V3 network identity verification timed out after 25ms",
  });
  expect(mocks.chainId.mock.calls[0]![0].signal.aborted).toBe(true);
  mocks.chainId.mockResolvedValue(420420777n);
  await expect(verifyNetwork()).resolves.toBeUndefined();
  expect(mocks.request).toHaveBeenCalledTimes(4);
  expect(vi.getTimerCount()).toBe(0);
});

it("bounds the repeated denomination check and requires fresh identity verification after it fails", async () => {
  await verifyNetwork();
  expect(mocks.request).toHaveBeenCalledTimes(2);
  mocks.ratio.mockImplementationOnce(never);
  const pending = verifyNetwork().catch((error) => error);
  await vi.advanceTimersByTimeAsync(25);
  expect(await pending).toMatchObject({
    message: "Runtime denomination verification timed out after 25ms",
  });
  await expect(verifyNetwork()).resolves.toBeUndefined();
  expect(mocks.request).toHaveBeenCalledTimes(4);
  expect(vi.getTimerCount()).toBe(0);
});

it("bounds runtime address mapping without retrying an unresponsive provider", async () => {
  mocks.address.mockImplementation(never);
  const pending = h160Of("public-test-address").catch((error) => error);
  await vi.advanceTimersByTimeAsync(25);
  expect(await pending).toMatchObject({
    message: "Revive address lookup timed out after 25ms",
  });
  expect(mocks.address).toHaveBeenCalledTimes(1);
  expect(mocks.address.mock.calls[0]![1].signal.aborted).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it("allows WebSocket connection establishment to use the configured network timeout", () => {
  configureChain({ timeoutMs: 45_000 });
  getClient();
  expect(mocks.wsProvider).toHaveBeenCalledWith(
    "wss://test-node-v3.portaldot.dev",
    { timeout: 45_000 },
  );
});

it("falls back to verified native identity when the optional EVM facade never answers", async () => {
  mocks.evmChainId.mockImplementation(never);
  const pending = verifyNetwork();
  await vi.advanceTimersByTimeAsync(12);
  await expect(pending).resolves.toBeUndefined();
  expect(mocks.chainId).toHaveBeenCalled();
  expect(mocks.ratio).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});

it("still rejects a reachable EVM facade reporting another chain", async () => {
  mocks.evmChainId.mockResolvedValue(1);
  await expect(verifyNetwork()).rejects.toThrow("Endpoint identity differs");
});

it("does not accept an incorrect native identity when the EVM facade is unavailable", async () => {
  mocks.evmChainId.mockImplementation(never);
  mocks.chainId.mockResolvedValue(1n);
  const pending = verifyNetwork().catch((error) => error);
  await vi.advanceTimersByTimeAsync(12);
  expect(await pending).toMatchObject({
    message: "Endpoint identity differs from the verified Portaldot V3 testnet",
  });
});
