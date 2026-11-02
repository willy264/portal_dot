import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TxCreator } from "polkadot-api";
import { prepareBoundedReviveCall } from "./revive";

const mocks = vi.hoisted(() => ({
  simulate: vi.fn(),
  call: vi.fn(),
  request: vi.fn(),
  head: vi.fn(),
}));
vi.mock("./client", () => ({
  verifyNetwork: vi.fn(async () => undefined),
  getFinalizedHead: mocks.head,
  getClient: () => ({ _request: mocks.request }),
  getApi: () => ({
    apis: { ReviveApi: { call_versioned: mocks.simulate } },
    tx: { Revive: { call: mocks.call } },
  }),
}));
const at = { number: 42, hash: `0x${"ab".repeat(32)}` };
const caps = {
  weight_limit: { ref_time: 1000n, proof_size: 500n },
  storage_deposit_limit: 300n,
};
const input = {
  signer: {
    address: "public-unit-account",
    txCreator: vi.fn() as unknown as TxCreator,
  },
  to: "0x1111111111111111111111111111111111111111" as const,
  data: "0x12345678" as const,
  value: 0n,
};
const success = () => ({
  type: "V1",
  value: {
    weight_required: { ref_time: 800n, proof_size: 100n },
    max_storage_deposit: { type: "Charge", value: 200n },
    result: { success: true, value: { flags: 0, data: new Uint8Array() } },
  },
});
beforeEach(() => {
  vi.resetAllMocks();
  mocks.head.mockResolvedValue({ ...at, timestamp: 1n });
  mocks.request.mockResolvedValue(at.hash);
  mocks.simulate.mockImplementation(async () => success());
});
describe("exact native submission caps", () => {
  it("pins both passes to one finalized hash and prepares the second pass's exact finite caps", async () => {
    const tx = { createSubmitAndWatch: vi.fn() };
    mocks.call.mockReturnValue(tx);
    const prepared = await prepareBoundedReviveCall(input, caps, at);
    expect(mocks.simulate).toHaveBeenCalledTimes(2);
    expect(mocks.simulate.mock.calls[0][0].value.gas_limit).toBeUndefined();
    expect(mocks.simulate.mock.calls[1][0].value).toMatchObject({
      gas_limit: caps.weight_limit,
      storage_deposit_limit: caps.storage_deposit_limit,
    });
    for (const invocation of mocks.simulate.mock.calls)
      expect(invocation[1].at).toBe(at.hash);
    expect(mocks.call.mock.calls[0][0]).toMatchObject({
      dest: input.to,
      value: 0n,
      ...caps,
    });
    expect(prepared.tx).toBe(tx);
    expect(tx.createSubmitAndWatch).not.toHaveBeenCalled();
  });
  it("refuses a bounded failure even when the initial unbounded return succeeded", async () => {
    const failed = success();
    failed.value.result.value.flags = 1;
    mocks.simulate
      .mockResolvedValueOnce(success())
      .mockResolvedValueOnce(failed);
    await expect(prepareBoundedReviveCall(input, caps, at)).rejects.toThrow(
      "reverted",
    );
    expect(mocks.call).not.toHaveBeenCalled();
  });
  it("rejects a snapshot mismatch and budget overrun before constructing a transaction", async () => {
    mocks.request.mockResolvedValue("different-hash");
    await expect(prepareBoundedReviveCall(input, caps, at)).rejects.toThrow(
      "canonical finalized",
    );
    expect(mocks.simulate).not.toHaveBeenCalled();
    mocks.request.mockResolvedValue(at.hash);
    const overrun = success();
    overrun.value.max_storage_deposit.value = 301n;
    mocks.simulate.mockResolvedValue(overrun);
    await expect(prepareBoundedReviveCall(input, caps, at)).rejects.toThrow(
      "exceeds",
    );
    expect(mocks.call).not.toHaveBeenCalled();
  });
});
