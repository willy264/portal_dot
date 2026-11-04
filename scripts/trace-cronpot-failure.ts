import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import {
  Binary as ScaleBinary,
  Blake2256,
  blockHeader,
} from "@polkadot-api/substrate-bindings";
import { Enum } from "polkadot-api";
import {
  decodeEventLog,
  decodeFunctionData,
  encodeFunctionData,
  hexToBytes,
  toHex,
  type Hex,
} from "viem";
import {
  GENESIS_HASH,
  disconnectChain,
  getApi,
  getClient,
} from "../packages/chain/src/client";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
import { initialize, json, option, writeJson } from "./lib";

const REVIEWED_RUNTIME_CODE_HASH =
  "0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2";
type RpcHeader = {
  parentHash: Hex;
  number: Hex;
  stateRoot: Hex;
  extrinsicsRoot: Hex;
  digest: { logs: Hex[] };
};
type Frame = {
  from: string;
  to: string;
  input: Uint8Array;
  output: Uint8Array;
  gas: bigint;
  gas_used: bigint;
  error?: string;
  revert_reason?: string;
  calls: Frame[];
};
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

function runtimeDigest(encoded: Hex) {
  const digest = blockHeader.inner.digests.inner.dec(hexToBytes(encoded));
  if (digest.type === "other") return Enum("Other", digest.value);
  if (digest.type === "runtimeUpdated")
    return Enum("RuntimeEnvironmentUpdated");
  const pair: [Hex, Uint8Array] = [
    toHex(digest.value.engine, { size: 4 }),
    hexToBytes(digest.value.payload as Hex),
  ];
  if (digest.type === "preRuntime") return Enum("PreRuntime", pair);
  if (digest.type === "seal") return Enum("Seal", pair);
  return Enum("Consensus", pair);
}

function collectCallbacks(frame: Frame, path = "root") {
  const results: Array<{
    path: string;
    from: string;
    to: string;
    rentalId: bigint;
    input: Hex;
    output: Hex;
    gas: bigint;
    gasUsed: bigint;
    error: string | null;
    revertReason: string | null;
  }> = [];
  try {
    const decoded = decodeFunctionData({
      abi: meterMendAbi,
      data: toHex(frame.input),
    });
    if (decoded.functionName === "finalizeRefund") {
      const canonical = encodeFunctionData({
        abi: meterMendAbi,
        functionName: "finalizeRefund",
        args: decoded.args,
      });
      if (canonical !== toHex(frame.input))
        throw new Error("Noncanonical refund callback input");
      results.push({
        path,
        from: frame.from,
        to: frame.to,
        rentalId: decoded.args[0],
        input: canonical,
        output: toHex(frame.output),
        gas: frame.gas,
        gasUsed: frame.gas_used,
        error: frame.error ?? null,
        revertReason: frame.revert_reason ?? null,
      });
    }
  } catch {
    // Other calls (including the outer execute and tip payment) are preserved in trace.
  }
  for (const [index, child] of frame.calls.entries())
    results.push(...collectCallbacks(child, `${path}.calls[${index}]`));
  return results;
}

/** Replay an actual finalized native extrinsic, including earlier block extrinsics. */
export async function traceCronpotFailure(input: {
  txHash: Hex;
  block: number;
  out: string;
}) {
  if (!/^0x[\da-f]{64}$/i.test(input.txHash))
    throw new Error("--tx must be a native extrinsic hash");
  if (!Number.isSafeInteger(input.block) || input.block < 1)
    throw new Error("--block must be a positive integer");
  const timeoutMs = Number(option("timeout-ms", "60000"));
  const evidence: Record<string, unknown> = {
    schemaVersion: 1,
    kind: "finalized-native-cronpot-transaction-trace",
    observedAt: new Date().toISOString(),
    mode: "read-only",
    signedTransactions: 0,
    txHash: input.txHash,
    block: input.block,
    stateOverrides: false,
    timestampOverride: false,
    method: "ReviveApi.trace_tx_versioned(V1)",
    basis:
      "Replay of the exact finalized native block at its parent state, selecting the hash-matched extrinsic index; not a hypothetical call simulation.",
    status: "incomplete",
  };
  const rpc = async <T>(method: string, params: unknown[]): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        getClient()._request<T>(method, params),
        new Promise<never>((_resolve, reject) => {
          timer = setTimeout(
            () => reject(new Error(`${method} timed out`)),
            timeoutMs,
          );
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
  try {
    const [genesis, blockHash, finalizedHash] = await Promise.all([
      rpc<string>("chain_getBlockHash", [0]),
      rpc<Hex | null>("chain_getBlockHash", [input.block]),
      rpc<Hex>("chain_getFinalizedHead", []),
    ]);
    if (genesis !== GENESIS_HASH || !blockHash)
      throw new Error("V3 genesis mismatch or requested block unavailable");
    const [body, finalizedHeader] = await Promise.all([
      rpc<{ block: { header: RpcHeader; extrinsics: Hex[] } } | null>(
        "chain_getBlock",
        [blockHash],
      ),
      rpc<RpcHeader>("chain_getHeader", [finalizedHash]),
    ]);
    if (!body || Number(finalizedHeader.number) < input.block)
      throw new Error("Requested block is unavailable or not finalized");
    const header = body.block.header;
    if (Number(header.number) !== input.block)
      throw new Error("RPC block number does not match requested number");
    const digests = header.digest.logs.map((value) =>
      blockHeader.inner.digests.inner.dec(hexToBytes(value)),
    );
    const computedBlockHash = toHex(
      Blake2256(
        blockHeader.enc({
          parentHash: header.parentHash,
          number: input.block,
          stateRoot: header.stateRoot,
          extrinsicRoot: header.extrinsicsRoot,
          digests,
        }),
      ),
    );
    if (!same(computedBlockHash, blockHash))
      throw new Error("RPC header hash does not match canonical block hash");
    const indices = body.block.extrinsics.flatMap((extrinsic, index) =>
      same(toHex(Blake2256(hexToBytes(extrinsic))), input.txHash)
        ? [index]
        : [],
    );
    if (indices.length !== 1)
      throw new Error("Transaction hash must occur exactly once in the block");
    const extrinsicIndex = indices[0]!;
    const [parentHash, runtime, runtimeCodeHash] = await Promise.all([
      rpc<Hex>("chain_getBlockHash", [input.block - 1]),
      rpc<{
        specName: string;
        specVersion: number;
        transactionVersion: number;
      }>("state_getRuntimeVersion", [header.parentHash]),
      rpc<Hex>("state_getStorageHash", ["0x3a636f6465", header.parentHash]),
    ]);
    if (
      parentHash !== header.parentHash ||
      runtime.specName !== "portaldot-v3" ||
      runtime.specVersion !== 3002 ||
      runtimeCodeHash !== REVIEWED_RUNTIME_CODE_HASH
    )
      throw new Error(
        "Historical parent or reviewed runtime identity mismatch",
      );
    Object.assign(evidence, {
      identity: { genesis, runtime, runtimeCodeHash },
      blockHash,
      parentHash,
      finalizedAtObservation: {
        number: Number(finalizedHeader.number),
        hash: finalizedHash,
      },
      extrinsicIndex,
      rawExtrinsic: body.block.extrinsics[extrinsicIndex],
      rawBlock: body.block,
    });
    const api = getApi();
    const block = {
      header: {
        parent_hash: header.parentHash,
        number: input.block,
        state_root: header.stateRoot,
        extrinsics_root: header.extrinsicsRoot,
        digest: header.digest.logs.map(runtimeDigest),
      },
      // OpaqueExtrinsic is SCALE Bytes; remove its RPC length prefix exactly once.
      extrinsics: body.block.extrinsics.map((value) =>
        ScaleBinary.fromOpaque(value),
      ),
    };
    const [decoded, records] = await Promise.all([
      api.apis.ReviveApi.trace_tx_versioned(
        Enum("V1", {
          block,
          tx_index: extrinsicIndex,
          config: Enum("CallTracer", { with_logs: true, only_top_call: false }),
        }),
        { at: parentHash, signal: AbortSignal.timeout(timeoutMs) },
      ),
      api.query.System.Events.getValue({
        at: blockHash,
        signal: AbortSignal.timeout(timeoutMs),
      }),
    ]);
    evidence.trace = decoded;
    const events = records.filter(
      (record) =>
        record.phase.type === "ApplyExtrinsic" &&
        record.phase.value === extrinsicIndex,
    );
    evidence.nativeEvents = events;
    if (decoded.type !== "V1" || decoded.value?.type !== "Call")
      throw new Error(
        "Runtime returned no V1 call trace for the selected extrinsic",
      );
    const trace = decoded.value.value;
    const outer = decodeFunctionData({
      abi: cronpotAbi,
      data: toHex(trace.input),
    });
    if (outer.functionName !== "execute")
      throw new Error("Selected transaction is not a Cronpot.execute call");
    const jobId = outer.args[0];
    const contractEvents = events.flatMap((record) => {
      if (
        record.event.type !== "Revive" ||
        record.event.value.type !== "ContractEmitted"
      )
        return [];
      const emitted = record.event.value.value;
      try {
        const event = decodeEventLog({
          abi: [...cronpotAbi, ...meterMendAbi],
          data: toHex(emitted.data),
          topics: emitted.topics as [Hex, ...Hex[]],
          strict: true,
        });
        return [{ address: emitted.contract, ...event }];
      } catch {
        return [];
      }
    });
    evidence.contractEvents = contractEvents;
    const callbacks = collectCallbacks(trace).filter((call) =>
      same(call.from, trace.to),
    );
    evidence.callbacks = callbacks;
    evidence.cronpot = trace.to;
    evidence.jobId = jobId;
    const outerSucceeded = events.some(
      (record) =>
        record.event.type === "System" &&
        record.event.value.type === "ExtrinsicSuccess",
    );
    const failedEvent = contractEvents.find(
      (event) =>
        same(event.address, trace.to) &&
        event.eventName === "JobExecuted" &&
        event.args.jobId === jobId &&
        event.args.success === false,
    );
    const refundEmitted = contractEvents.some(
      (event) =>
        event.eventName === "DepositRefunded" &&
        callbacks.some(
          (callback) =>
            same(callback.to, event.address) &&
            callback.rentalId === event.args.rentalId,
        ),
    );
    if (
      !outerSucceeded ||
      !failedEvent ||
      trace.error ||
      callbacks.length !== 1 ||
      refundEmitted
    )
      throw new Error(
        "Finalized events and trace do not establish a single failed refund callback",
      );
    evidence.finding = {
      outerExtrinsicSucceeded: true,
      jobExecutedSuccess: false,
      depositRefundedEmitted: false,
      callback: callbacks[0],
      exactNestedError: callbacks[0]!.error,
      exactNestedRevertReason: callbacks[0]!.revertReason,
    };
    evidence.status =
      callbacks[0]!.error === "OutOfGas"
        ? "callback-out-of-gas-confirmed"
        : "callback-failure-recorded";
    return evidence;
  } catch (error) {
    evidence.error = error instanceof Error ? error.message : String(error);
    throw error;
  } finally {
    evidence.completedAt = new Date().toISOString();
    writeJson(input.out, evidence);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const txHash = option("tx");
  const block = option("block");
  const out = option("out");
  if (!txHash || !block || !out) {
    console.error(
      "Usage: tsx scripts/trace-cronpot-failure.ts --tx <hash> --block <number> --out <path>",
    );
    process.exitCode = 1;
  } else {
    try {
      initialize();
      const evidence = await traceCronpotFailure({
        txHash: txHash as Hex,
        block: Number(block),
        out,
      });
      console.log(
        json({
          out,
          status: evidence.status,
          txHash,
          block: Number(block),
          finding: evidence.finding,
        }),
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    } finally {
      disconnectChain();
    }
  }
}
