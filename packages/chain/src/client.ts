import { createClient, AccountId } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws";
import { portaldot } from "../.papi/descriptors/dist/index.js";
import { firstValueFrom, timeout } from "rxjs";
import { Blake2256 } from "@polkadot-api/substrate-bindings";
import { Binary, Enum } from "polkadot-api";
import {
  createPublicClient,
  decodeEventLog,
  decodeFunctionResult,
  encodeFunctionData,
  hexToBytes,
  http,
  toHex,
  type Abi,
  type Address,
  type Hex,
} from "viem";
import { NATIVE_TO_EVM_RATIO } from "./units";
import { historyWithFallback, HistoryGapError } from "./history";
export { HistoryGapError } from "./history";
export type { HistoryResult } from "./history";

export const CHAIN_ID = 420420777;
export const GENESIS_HASH =
  "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd";
export const DEFAULT_WSS_URL = "wss://test-node-v3.portaldot.dev";
export const DEFAULT_EVM_RPC_URL = "https://test-evm-rpc-v3.portaldot.dev";
let settings = {
  wssUrl: DEFAULT_WSS_URL,
  evmRpcUrl: DEFAULT_EVM_RPC_URL,
  timeoutMs: 45_000,
  readOrigin: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
};
type NativeClient = ReturnType<typeof createClient>;
let nativeClient: NativeClient | undefined;
let evmClient: ReturnType<typeof makeEvmClient> | undefined;
let verified: Promise<void> | undefined;

/** Bounds read-only RPC work even when the provider never settles its promise. */
async function boundedRead<T>(
  label: string,
  read: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(() => read(controller.signal)),
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => {
          const error = new Error(
            `${label} timed out after ${settings.timeoutMs}ms`,
          );
          reject(error);
          controller.abort(error);
        }, settings.timeoutMs);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

function makeEvmClient() {
  return createPublicClient({
    transport: http(settings.evmRpcUrl, {
      timeout: settings.timeoutMs,
      retryCount: 0,
    }),
  });
}

/** Configure once before connecting; no Node-only environment imports in this module. */
export function configureChain(options: Partial<typeof settings>): void {
  if (nativeClient || evmClient)
    throw new Error("Configure the chain before opening a connection");
  const next = { ...settings, ...options };
  if (next.wssUrl.includes("mainnet.portaldot.io"))
    throw new Error("Legacy mainnet is prohibited");
  if (!/^wss:\/\//.test(next.wssUrl) || !/^https:\/\//.test(next.evmRpcUrl))
    throw new Error("Secure V3 endpoints are required");
  if (!Number.isSafeInteger(next.timeoutMs) || next.timeoutMs < 1)
    throw new RangeError(
      "Network timeout must be a positive integer in milliseconds",
    );
  settings = next;
}

export function getClient() {
  return (nativeClient ??= createClient(getWsProvider(settings.wssUrl)));
}
export function getApi() {
  return getClient().getTypedApi(portaldot);
}
export function getEvmClient() {
  return (evmClient ??= makeEvmClient());
}
export function disconnectChain(): void {
  nativeClient?.destroy();
  nativeClient = undefined;
  evmClient = undefined;
  verified = undefined;
}

/** Every write calls this guard; upgraded metadata remains PAPI compatibility-checked. */
export async function verifyNetwork(): Promise<void> {
  try {
    await (verified ??= boundedRead(
      "V3 network identity verification",
      async (signal) => {
        const api = getApi();
        const [genesis, runtime, id, ratio, nativeChainId] = await Promise.all([
          getClient()._request<string>("chain_getBlockHash", [0]),
          getClient()._request<{ specName: string }>(
            "state_getRuntimeVersion",
            [],
          ),
          getEvmClient()
            .getChainId()
            .catch(() => null),
          api.constants.Revive.NativeToEthRatio({ signal }),
          api.constants.Revive.ChainId({ signal }),
        ]);
        if (
          genesis !== GENESIS_HASH ||
          runtime.specName !== "portaldot-v3" ||
          (id !== null && id !== CHAIN_ID) ||
          nativeChainId !== BigInt(CHAIN_ID)
        ) {
          throw new Error(
            "Endpoint identity differs from the verified Portaldot V3 testnet",
          );
        }
        if (BigInt(ratio) !== NATIVE_TO_EVM_RATIO)
          throw new Error(
            "Native/EVM ratio changed; refresh probe and conversion policy before writing",
          );
      },
    ).catch((error: unknown) => {
      verified = undefined;
      throw error;
    }));
    // Runtime upgrades can change denomination while a process keeps its connection open.
    const ratio = await boundedRead(
      "Runtime denomination verification",
      (signal) => getApi().constants.Revive.NativeToEthRatio({ signal }),
    );
    if (BigInt(ratio) !== NATIVE_TO_EVM_RATIO)
      throw new Error(
        "Native/EVM ratio changed; refresh probe and conversion policy before writing",
      );
  } catch (error) {
    verified = undefined;
    throw error;
  }
}

export async function h160Of(address: string): Promise<Address> {
  return (await boundedRead("Revive address lookup", (signal) =>
    getApi().apis.ReviveApi.address(address, { signal }),
  )) as Address;
}

export async function getAccountState(address: string) {
  const api = getApi();
  const head = await firstValueFrom(
    getClient().finalizedBlock$.pipe(timeout(settings.timeoutMs)),
  );
  const options = {
    at: head.hash,
    signal: AbortSignal.timeout(settings.timeoutMs),
  };
  const [account, h160, autoMap] = await Promise.all([
    api.query.System.Account.getValue(address, options),
    api.apis.ReviveApi.address(address, options),
    api.constants.Revive.AutoMap(options),
  ]);
  const original = await api.query.Revive.OriginalAccount.getValue(
    h160,
    options,
  );
  const same =
    original &&
    AccountId()
      .enc(original)
      .every((byte, index) => byte === AccountId().enc(address)[index]);
  return {
    mapped: Boolean(same),
    autoMap,
    h160: h160 as Address,
    nativeBalance: account.data.free,
    nativeFrozen: account.data.frozen,
    nativeReserved: account.data.reserved,
    nonce: account.nonce,
    block: head.number,
    blockHash: head.hash,
  };
}

export async function getFinalizedHead() {
  const head = await firstValueFrom(
    getClient().finalizedBlock$.pipe(timeout(settings.timeoutMs)),
  );
  const timestampMs = await getApi().query.Timestamp.Now.getValue({
    at: head.hash,
    signal: AbortSignal.timeout(settings.timeoutMs),
  });
  return {
    number: head.number,
    hash: head.hash,
    timestamp: timestampMs / 1000n,
  };
}

export async function getBlock(number: number) {
  if (!Number.isSafeInteger(number) || number < 0)
    throw new RangeError("Invalid block number");
  const hash = await getClient()._request<string | null>("chain_getBlockHash", [
    number,
  ]);
  if (!hash) throw new Error(`Block ${number} is unavailable`);
  const timestampMs = await getApi().query.Timestamp.Now.getValue({
    at: hash,
    signal: AbortSignal.timeout(settings.timeoutMs),
  });
  return { number, hash, timestamp: timestampMs / 1000n };
}

export type ContractReadOptions = { at?: { number: number; hash: string } };
const checkedSnapshots = new Map<number, string>();
export async function readContract<T = unknown>(
  abi: Abi,
  address: Address,
  fn: string,
  args: readonly unknown[] = [],
  options: ContractReadOptions = {},
): Promise<T> {
  const head = await firstValueFrom(
    getClient().finalizedBlock$.pipe(timeout(settings.timeoutMs)),
  );
  const finalized = options.at ?? head;
  if (
    !Number.isSafeInteger(finalized.number) ||
    finalized.number < 0 ||
    finalized.number > head.number
  )
    throw new RangeError("Contract reads require a finalized snapshot");
  if (options.at && checkedSnapshots.get(finalized.number) !== finalized.hash) {
    const canonicalHash = await getClient()._request<string>(
      "chain_getBlockHash",
      [finalized.number],
    );
    if (canonicalHash !== finalized.hash)
      throw new Error(
        "Requested contract snapshot hash does not match the finalized chain",
      );
    if (checkedSnapshots.size >= 128) checkedSnapshots.clear();
    checkedSnapshots.set(finalized.number, finalized.hash);
  }
  try {
    return (await getEvmClient().readContract({
      abi,
      address,
      functionName: fn,
      args,
      blockNumber: BigInt(finalized.number),
    })) as T;
  } catch (evmError) {
    try {
      const data = encodeFunctionData({ abi, functionName: fn, args });
      const simulation = await getApi().apis.ReviveApi.call_versioned(
        Enum("V1", {
          origin: settings.readOrigin,
          dest: address,
          value: 0n,
          gas_limit: undefined,
          storage_deposit_limit: undefined,
          input_data: Binary.fromHex(data),
        }),
        { at: finalized.hash, signal: AbortSignal.timeout(settings.timeoutMs) },
      );
      const result = simulation.value.result;
      if (!result.success)
        throw new Error(`Runtime read failed: ${JSON.stringify(result.value)}`);
      if (result.value.flags & 1)
        throw new Error(`Runtime read reverted: ${toHex(result.value.data)}`);
      return decodeFunctionResult({
        abi,
        functionName: fn,
        data: toHex(result.value.data),
      }) as T;
    } catch (runtimeError) {
      throw new AggregateError(
        [evmError, runtimeError],
        `Both EVM RPC and native Revive reads failed for ${fn}`,
      );
    }
  }
}

export type DecodedLog = {
  address: Address;
  eventName: string;
  args: Record<string, unknown>;
  txHash: Hex | null;
  blockHash: Hex;
  block: number;
  logIndex: number;
  eventIndex?: number;
  source: "evm-rpc" | "substrate";
};

/** Caller supplies a finalized end block; never treats a head log as finalized proof. */
export async function getLogs(
  abi: Abi,
  address: Address,
  fromBlock: bigint | number,
  toBlock?: bigint | number,
): Promise<DecodedLog[]> {
  const result = await getLogsWithProvenance(abi, address, fromBlock, toBlock);
  if (!result.complete)
    throw new HistoryGapError(result.fromBlock, result.toBlock, result);
  return result.logs;
}

/** Explicit partial-history API for diagnostics. Never advance a durable cursor when complete=false. */
export async function getLogsWithProvenance(
  abi: Abi,
  address: Address,
  fromBlock: bigint | number,
  toBlock?: bigint | number,
) {
  const finalizedEnd = BigInt((await getFinalizedHead()).number);
  const end = toBlock === undefined ? finalizedEnd : BigInt(toBlock);
  const start = BigInt(fromBlock);
  if (start < 0n || end < start || end > BigInt(Number.MAX_SAFE_INTEGER))
    throw new RangeError("Invalid log block range");
  if (end > finalizedEnd)
    throw new RangeError("Requested log range includes unfinalized blocks");
  // Native events cover signed Revive calls and on_initialize Scheduler executions,
  // which an EVM facade may omit without returning an RPC error.
  const result = await historyWithFallback(
    () => getNativeContractLogs(abi, address, Number(start), Number(end)),
    () => getEvmContractLogs(abi, address, start, end),
  );
  return { ...result, fromBlock: start, toBlock: end };
}

export async function getEvmContractLogs(
  abi: Abi,
  address: Address,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<DecodedLog[]> {
  const logs = await getEvmClient().getLogs({ address, fromBlock, toBlock });
  const output: DecodedLog[] = [];
  for (const log of logs) {
    if (
      log.removed ||
      log.blockNumber === null ||
      log.blockHash === null ||
      log.transactionHash === null ||
      log.logIndex === null
    )
      continue;
    try {
      const decoded = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics,
        strict: true,
      });
      if (!decoded.eventName) continue;
      output.push({
        address: log.address,
        eventName: decoded.eventName,
        args: decoded.args as unknown as Record<string, unknown>,
        txHash: log.transactionHash,
        blockHash: log.blockHash,
        block: Number(log.blockNumber),
        logIndex: log.logIndex,
        source: "evm-rpc",
      });
    } catch {
      /* This address can emit an event outside the supplied ABI. */
    }
  }
  return output;
}

export async function getNativeContractLogs(
  abi: Abi,
  address: Address,
  fromBlock: number,
  toBlock: number,
): Promise<DecodedLog[]> {
  const output: DecodedLog[] = [];
  for (let block = fromBlock; block <= toBlock; block++) {
    const hash = await getClient()._request<string | null>(
      "chain_getBlockHash",
      [block],
    );
    if (!hash) throw new Error(`Native block ${block} is unavailable`);
    const [records, body] = await Promise.all([
      getApi().query.System.Events.getValue({
        at: hash,
        signal: AbortSignal.timeout(settings.timeoutMs),
      }),
      getClient()._request<{ block: { extrinsics: Hex[] } } | null>(
        "chain_getBlock",
        [hash],
      ),
    ]);
    if (!body) throw new Error(`Native block body ${block} is unavailable`);
    for (let index = 0; index < records.length; index++) {
      const record = records[index]!;
      if (
        record.event.type !== "Revive" ||
        record.event.value.type !== "ContractEmitted"
      )
        continue;
      const emitted = record.event.value.value;
      if (emitted.contract.toLowerCase() !== address.toLowerCase()) continue;
      const decoded = decodeEventLog({
        abi,
        data: toHex(emitted.data),
        topics: emitted.topics as [Hex, ...Hex[]],
        strict: true,
      });
      if (!decoded.eventName) continue;
      const extrinsic =
        record.phase.type === "ApplyExtrinsic"
          ? body.block.extrinsics[record.phase.value]
          : undefined;
      output.push({
        address: emitted.contract as Address,
        eventName: decoded.eventName,
        args: decoded.args as unknown as Record<string, unknown>,
        txHash: extrinsic ? toHex(Blake2256(hexToBytes(extrinsic))) : null,
        blockHash: hash as Hex,
        block,
        logIndex: index,
        eventIndex: index,
        source: "substrate",
      });
    }
  }
  return output;
}
