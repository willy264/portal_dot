import { expect, it } from "vitest";
import { encodeFunctionData, parseAbi } from "viem";
import { Store, type ChainEvent } from "@metermend/service-core";
import { JobEngine, type ExecutionAdapter } from "../src/engine.js";
const address = "0x1111111111111111111111111111111111111111";
const scheduled: ChainEvent = {
  id: "one",
  network: "v3",
  address: "cronpot",
  eventName: "JobScheduled",
  args: {
    jobId: "1",
    owner: address,
    target: address,
    executeAfter: "100",
    data: encodeFunctionData({
      abi: parseAbi(["function finalizeRefund(uint256 rentalId)"]),
      functionName: "finalizeRefund",
      args: [7n],
    }),
  },
  txHash: "tx",
  block: 10,
  blockHash: "hash",
  eventIndex: 0,
  observedAt: "",
  source: "substrate",
};

it("falls back after a rejected scheduler origin and never executes before grace", async () => {
  const store = new Store(":memory:");
  let executions = 0;
  let status = 1;
  const adapter: ExecutionAdapter = {
    readJob: async () => ({ status, executeAfter: 100n }),
    schedule: async () => {
      throw new Error("BadOrigin");
    },
    execute: async () => {
      executions++;
      status = 2;
      return { txHash: "exec", block: 12 };
    },
  };
  const engine = new JobEngine(store, adapter, "native", address, 6000);
  engine.ingest([scheduled]);
  await engine.tick(90n);
  expect(store.job("1")?.scheduling).toBe("keeper-fallback");
  await engine.tick(129n);
  expect(executions).toBe(0);
  await engine.tick(130n);
  expect(executions).toBe(1);
  await engine.tick(140n);
  expect(executions).toBe(1);
  store.close();
});
it("persists an ambiguous keeper submission and avoids rebroadcasting after restart", async () => {
  const store = new Store(":memory:");
  let executions = 0;
  const adapter: ExecutionAdapter = {
    readJob: async () => ({ status: 1, executeAfter: 100n }),
    schedule: async () => ({ txHash: "s", block: 1 }),
    execute: async () => {
      executions++;
      throw Object.assign(new Error("Inclusion unknown"), { ambiguous: true });
    },
  };
  const engine = new JobEngine(store, adapter, "keeper", address, 6000);
  engine.ingest([scheduled]);
  await engine.tick(131n);
  await new JobEngine(store, adapter, "keeper", address, 6000).tick(160n);
  expect(executions).toBe(1);
  expect(store.job("1")?.scheduling).toBe("execution-unknown");
  store.close();
});
it("retains a finalized failed receipt and never retries it after restart", async () => {
  const store = new Store(":memory:");
  const receipt = {
    txHash: `0x${"a".repeat(64)}`,
    block: 12,
    blockHash: `0x${"b".repeat(64)}`,
    extrinsicIndex: 2,
    events: [{ type: "System", value: { type: "ExtrinsicFailed" } }],
  };
  const dispatchError = {
    type: "Module",
    value: { type: "Revive", value: { type: "OutOfGas" } },
  };
  let executions = 0;
  const adapter: ExecutionAdapter = {
    readJob: async () => ({ status: 1, executeAfter: 100n }),
    schedule: async () => ({ txHash: "unused", block: 1 }),
    execute: async (_id, onStatus) => {
      executions++;
      onStatus({ type: "finalized", txHash: receipt.txHash, ok: false });
      throw Object.assign(new Error("Finalized extrinsic failed"), {
        ambiguous: false,
        evidence: receipt,
        dispatchError,
      });
    },
  };
  try {
    const engine = new JobEngine(store, adapter, "keeper", address, 6000);
    engine.ingest([scheduled]);
    await engine.tick(131n, 10);
    await new JobEngine(store, adapter, "keeper", address, 6000).tick(
      1000n,
      100,
    );
    expect(executions).toBe(1);
    expect(store.job("1")).toMatchObject({
      scheduling: "manual-review",
      attempts: 1,
      evidence: {
        failedSubmission: { ...receipt, dispatchError },
        retryPolicy: expect.stringContaining("account nonce"),
      },
    });
  } finally {
    store.close();
  }
});
it("does not subsidize arbitrary jobs or count manual refunds as automatic", async () => {
  const store = new Store(":memory:");
  let executions = 0;
  const adapter: ExecutionAdapter = {
    readJob: async () => ({ status: 1, executeAfter: 1n }),
    schedule: async () => ({ txHash: "", block: 1 }),
    execute: async () => {
      executions++;
      return { txHash: "", block: 1 };
    },
  };
  const engine = new JobEngine(store, adapter, "keeper", address, 6000);
  engine.ingest([
    { ...scheduled, args: { ...scheduled.args, owner: "stranger" } },
  ]);
  await engine.tick(1000n);
  expect(executions).toBe(0);
  expect(engine.automaticRefundCount()).toBe(0);
  store.close();
});
it("retains the native submission hash and pauses after an uncertain scheduling result", async () => {
  const store = new Store(":memory:");
  let executions = 0;
  const adapter: ExecutionAdapter = {
    readJob: async () => ({ status: 1, executeAfter: 100n }),
    schedule: async (_job, _blocks, onStatus) => {
      onStatus({ type: "broadcasted", txHash: "0xpending" });
      throw Object.assign(new Error("disconnected"), {
        ambiguous: true,
        txHash: "0xpending",
      });
    },
    execute: async () => {
      executions++;
      return { txHash: "", block: 1 };
    },
  };
  const engine = new JobEngine(store, adapter, "native", address, 6000);
  engine.ingest([scheduled]);
  await engine.tick(90n);
  await new JobEngine(store, adapter, "native", address, 6000).tick(200n);
  expect(executions).toBe(0);
  expect(store.job("1")?.scheduling).toBe("native-unknown");
  expect(store.job("1")?.evidence).toMatchObject({
    pendingSubmission: {
      jobId: "1",
      operation: "schedule",
      txHash: "0xpending",
    },
    lastError: { txHash: "0xpending" },
  });
  store.close();
});
it("does not associate a manual refund with a different transaction in the same block", () => {
  const store = new Store(":memory:");
  const adapter: ExecutionAdapter = {
    readJob: async () => ({ status: 1, executeAfter: 100n }),
    schedule: async () => ({ txHash: "", block: 1 }),
    execute: async () => ({ txHash: "", block: 1 }),
  };
  const engine = new JobEngine(store, adapter, "keeper", address, 6000);
  engine.ingest([scheduled]);
  const completion = {
    ...scheduled,
    id: "completed",
    eventName: "JobExecuted",
    txHash: "cron-tx",
    eventIndex: 3,
    args: { jobId: "1", success: true },
  };
  const refund = {
    ...scheduled,
    id: "refund",
    address,
    eventName: "DepositRefunded",
    txHash: "manual-tx",
    eventIndex: 2,
    args: { rentalId: "7" },
  };
  store.saveBlock("chain", 10, "hash", [completion, refund]);
  engine.ingest([completion]);
  expect(engine.automaticRefundCount()).toBe(0);
  store.close();
});
