import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TxCreator } from "polkadot-api";
import { encodeFunctionData, encodeAbiParameters, hexToBytes } from "viem";
import { cronpotAbi, meterMendAbi } from "@metermend/chain/abi";
import { executeKeeperRefund } from "./preflight.js";
import { SUPPORTED_RUNTIME } from "./execution-profile.js";
import {
  expected,
  fixtureProfile,
  fixtureTrace,
  jobLog,
} from "../test/preflight-fixtures.js";

const mocks = vi.hoisted(() => ({
  api: vi.fn(),
  read: vi.fn(),
  request: vi.fn(),
  prepare: vi.fn(),
  submit: vi.fn(),
  trace: vi.fn(),
  fee: vi.fn(),
  head: vi.fn(),
}));
vi.mock("@metermend/chain", async (original) => ({
  ...(await original<typeof import("@metermend/chain")>()),
  getApi: mocks.api,
  getClient: () => ({ _request: mocks.request }),
  getFinalizedHead: mocks.head,
  readContract: mocks.read,
  prepareBoundedReviveCall: mocks.prepare,
  submitAndWatch: mocks.submit,
}));
const signer = {
  address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  txCreator: vi.fn() as unknown as TxCreator,
};
const at = { number: 42, hash: `0x${"ab".repeat(32)}`, timestamp: 1000n };
let trace = fixtureTrace();
const tx = {
  getEstimatedFees: mocks.fee,
  getEncodedData: vi.fn(async () => new Uint8Array([1, 2, 3])),
};
beforeEach(() => {
  vi.clearAllMocks();
  trace = fixtureTrace();
  mocks.head.mockResolvedValue(at);
  mocks.fee.mockResolvedValue(1000n);
  mocks.request.mockImplementation(async (method: string) => {
    if (method === "chain_getBlockHash") return SUPPORTED_RUNTIME.genesisHash;
    if (method === "state_getStorageHash") return SUPPORTED_RUNTIME.codeHash;
    return {
      specName: SUPPORTED_RUNTIME.specName,
      specVersion: 3002,
      transactionVersion: 2,
    };
  });
  mocks.trace.mockImplementation(async () => ({
    success: true,
    value: { type: "V1", value: { type: "Call", value: trace } },
  }));
  mocks.api.mockReturnValue({
    constants: {
      Revive: { NativeToEthRatio: async () => 10000n },
      Balances: { ExistentialDeposit: async () => 1n },
    },
    query: {
      System: {
        Account: {
          getValue: async () => ({
            nonce: 2,
            data: { free: 3000000000000000n, frozen: 0n },
          }),
        },
      },
      Revive: {
        OriginalAccount: { getValue: async () => signer.address },
        AccountInfoOf: {
          getValue: async () => ({
            account_type: {
              type: "Contract",
              value: { code_hash: `0x${"ef".repeat(32)}` },
            },
          }),
        },
        PristineCode: { getValue: async () => hexToBytes("0x6000") },
      },
    },
    apis: {
      ReviveApi: {
        address: async () => expected.executor,
        gas_price_versioned: async () => ({
          type: "V1",
          value: [25360n, 0n, 0n, 0n],
        }),
        trace_call_versioned: mocks.trace,
      },
    },
  });
  mocks.read.mockImplementation(async (_abi, _address, name) => {
    const values: Record<string, unknown> = {
      TARGET_GAS_LIMIT: 550000000000000n,
      POST_CALL_GAS_RESERVE: 200000000000000n,
      TIP_GAS_LIMIT: 30000n,
      MIN_CALL_GAS: 758730158740159n,
      cronpot: expected.cronpot,
      getJob: {
        owner: expected.meterMend,
        target: expected.meterMend,
        status: 1,
        executeAfter: 900n,
        tip: 1n,
        data: encodeFunctionData({
          abi: meterMendAbi,
          functionName: "finalizeRefund",
          args: [expected.rentalId],
        }),
      },
      rentals: [
        expected.itemId,
        expected.renter,
        expected.deposit,
        800n,
        900n,
        2,
        expected.jobId,
      ],
    };
    return values[name];
  });
  mocks.prepare.mockResolvedValue({
    tx,
    output: encodeAbiParameters([{ type: "bool" }], [true]),
    initial: { result: { flags: 0 } },
    bounded: { result: { flags: 0 } },
    caps: {
      weight_limit: { ref_time: 10000000000n, proof_size: 1048576n },
      storage_deposit_limit: 2500000000000000n,
    },
  });
  mocks.submit.mockResolvedValue({ txHash: `0x${"cd".repeat(32)}`, block: 43 });
});
const execute = (journal = vi.fn()) =>
  executeKeeperRefund({
    profile: fixtureProfile(),
    signer,
    jobId: expected.jobId,
    journal,
  });

describe("keeper preflight broadcast boundary", () => {
  it("submits the exact bounded transaction after same-state no-override trace validation and durable journal", async () => {
    const journal = vi.fn();
    const receipt = await execute(journal);
    expect(mocks.prepare.mock.calls[0][2]).toEqual(at);
    expect(mocks.prepare.mock.calls[0][0].data).toBe(
      encodeFunctionData({
        abi: cronpotAbi,
        functionName: "execute",
        args: [expected.jobId],
      }),
    );
    const [traceArg, traceOptions] = mocks.trace.mock.calls[0];
    expect(traceOptions.at).toBe(at.hash);
    expect(traceArg.value.state_overrides).toBeUndefined();
    expect(traceArg.value.tx.from).toBe(expected.executor);
    expect(traceArg.value.tx.value).toEqual([0n, 0n, 0n, 0n]);
    expect(traceArg.value.tx.gas_price).toEqual([25360n, 0n, 0n, 0n]);
    expect(mocks.submit.mock.calls[0][0]).toBe(tx);
    expect(journal.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.submit.mock.invocationCallOrder[0],
    );
    expect(receipt.preflight.ethereum.events.depositRefunded.amount).toBe(
      expected.deposit.toString(),
    );
    expect(receipt.preflight.ethereum.basis).toContain("not an equivalence");
  });
  it("never broadcasts when the outer native return succeeds but the trace reports a failed job", async () => {
    trace.logs = [jobLog({ success: false })];
    const journal = vi.fn();
    await expect(execute(journal)).rejects.toThrow("success=true");
    expect(mocks.submit).not.toHaveBeenCalled();
    expect(journal.mock.calls[0][0]).toMatchObject({
      status: "rejected",
      signedTransactions: 0,
      details: { at: { number: at.number, hash: at.hash, timestamp: "1000" } },
    });
  });
  it("never broadcasts for an empty trace, RPC error, missing mapping or insufficient actual funds", async () => {
    trace.logs = [];
    trace.calls[0].logs = [];
    await expect(execute()).rejects.toThrow("exactly one");
    mocks.trace.mockResolvedValue({
      success: false,
      value: { type: "Message", value: "Invalid Transaction: Payment" },
    });
    await expect(execute()).rejects.toThrow("Ethereum trace failed");
    const api = mocks.api();
    api.query.Revive.OriginalAccount.getValue = async () => undefined;
    await expect(execute()).rejects.toThrow("already be funded and mapped");
    api.query.Revive.OriginalAccount.getValue = async () => signer.address;
    api.query.System.Account.getValue = async () => ({
      nonce: 2,
      data: { free: 500000000000000n, frozen: 0n },
    });
    await expect(execute()).rejects.toThrow("actual spendable balance");
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it("does not enter the trace or broadcast path after the second native pass fails", async () => {
    mocks.prepare.mockRejectedValueOnce(new Error("bounded dry-run failed"));
    await expect(execute()).rejects.toThrow("bounded dry-run failed");
    expect(mocks.trace).not.toHaveBeenCalled();
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it.each([encodeAbiParameters([{ type: "bool" }], [false]), "0x"])(
    "rejects false or empty native callback output %# despite outer flags=0",
    async (output) => {
      const prepared = await mocks.prepare();
      mocks.prepare.mockResolvedValueOnce({ ...prepared, output });
      await expect(execute()).rejects.toThrow(/native.*(false|boolean)/);
      expect(mocks.trace).not.toHaveBeenCalled();
      expect(mocks.submit).not.toHaveBeenCalled();
    },
  );
  it("rejects deployed bytecode that differs from the reviewed runtime", async () => {
    mocks.api().query.Revive.PristineCode.getValue = async () =>
      hexToBytes("0x6001");
    await expect(execute()).rejects.toThrow("runtime bytecode differs");
    expect(mocks.prepare).not.toHaveBeenCalled();
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it("rechecks the runtime immediately before signing and rejects changed metadata", async () => {
    let checks = 0;
    mocks.request.mockImplementation(async (method: string) => {
      if (method === "chain_getBlockHash") return SUPPORTED_RUNTIME.genesisHash;
      if (method === "state_getStorageHash")
        return ++checks === 1
          ? SUPPORTED_RUNTIME.codeHash
          : `0x${"ff".repeat(32)}`;
      return {
        specName: "portaldot-v3",
        specVersion: 3002,
        transactionVersion: 2,
      };
    });
    await expect(execute()).rejects.toThrow("unsupported runtime codeHash");
    expect(mocks.trace).toHaveBeenCalledOnce();
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it("refuses a fee above the reviewed reserve and a failed journal before any broadcast", async () => {
    mocks.fee.mockResolvedValueOnce(
      BigInt(fixtureProfile().native.feeReserve) + 1n,
    );
    await expect(execute()).rejects.toThrow("fee exceeds");
    await expect(
      execute(
        vi.fn(() => {
          throw new Error("SQLite unavailable");
        }),
      ),
    ).rejects.toThrow("SQLite unavailable");
    expect(mocks.submit).not.toHaveBeenCalled();
  });
});
