import { config } from "dotenv";
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Blake2256 } from "@polkadot-api/substrate-bindings";
import {
  decodeEventLog,
  formatUnits,
  hexToBytes,
  parseUnits,
  toHex,
  type Abi,
  type Address,
  type Hex,
} from "viem";
import type { TxEvent } from "polkadot-api";
import {
  configureChain,
  disconnectChain,
  getAccountState,
  getApi,
  getClient,
  getFinalizedHead,
  verifyNetwork,
} from "../packages/chain/src/client";
import {
  FinalizedDispatchError,
  type ChainSigner,
  type SubmissionOptions,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
import { signerFromSeed } from "../packages/chain/src/node";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const json = (value: unknown) =>
  JSON.stringify(
    value,
    (_key, item: unknown) =>
      typeof item === "bigint"
        ? item.toString()
        : item instanceof Uint8Array
          ? toHex(item)
          : item,
    2,
  );
export const pathAt = (path: string) => resolve(ROOT, path);
export const now = () => new Date().toISOString();
export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
export const hash = (value: unknown) =>
  createHash("sha256").update(json(value)).digest("hex");

export function readJson<T>(path: string, fallback?: T): T {
  try {
    return JSON.parse(readFileSync(pathAt(path), "utf8")) as T;
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException).code === "ENOENT" &&
      fallback !== undefined
    )
      return fallback;
    throw error;
  }
}

/** A synchronous, flushed replacement: onStatus must not return before the hash is durable. */
export function writeJson(path: string, value: unknown): void {
  const destination = pathAt(path);
  mkdirSync(dirname(destination), { recursive: true });
  const temporary = `${destination}.${process.pid}.tmp`;
  const fd = openSync(temporary, "w");
  try {
    writeFileSync(fd, `${json(value)}\n`);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  renameSync(temporary, destination);
}

export function option(name: string, fallback?: string): string | undefined {
  const key = `--${name}`;
  const equals = process.argv.find((argument) =>
    argument.startsWith(`${key}=`),
  );
  if (equals) return equals.slice(key.length + 1);
  const index = process.argv.indexOf(key);
  return index >= 0 &&
    process.argv[index + 1] &&
    !process.argv[index + 1]!.startsWith("--")
    ? process.argv[index + 1]
    : fallback;
}
export const flag = (name: string) => process.argv.includes(`--${name}`);

export function initialize(): void {
  config({ path: pathAt(".env"), quiet: true });
  configureChain({
    wssUrl: process.env.WSS_URL ?? "wss://test-node-v3.portaldot.dev",
    evmRpcUrl:
      process.env.EVM_RPC_URL ?? "https://test-evm-rpc-v3.portaldot.dev",
  });
}

export function signer(
  role: "DEPLOYER" | "RENTER" | "ARBITER" | "RELAYER",
): ChainSigner {
  const seed = process.env[`${role}_SEED`];
  if (!seed) throw new Error(`${role}_SEED is not configured in ignored .env`);
  return signerFromSeed(seed);
}

export function amount(value: string, decimals = 18): bigint {
  if (
    !/^\d+(?:\.\d+)?$/.test(value) ||
    (value.split(".")[1]?.length ?? 0) > decimals
  )
    throw new Error(`Invalid exact tPOT amount: ${value}`);
  return parseUnits(value, decimals);
}

export async function requireBudget(
  account: ChainSigner,
  cost: bigint,
  keep = amount("5", 14),
) {
  if (cost < 0n || keep < 0n) throw new Error("Negative budget");
  const state = await getAccountState(account.address);
  const spendable =
    state.nativeBalance > state.nativeFrozen
      ? state.nativeBalance - state.nativeFrozen
      : 0n;
  if (spendable < cost + keep)
    throw new Error(
      `Insufficient tPOT for ${account.address}: ${formatUnits(spendable, 14)} available; ${formatUnits(cost + keep, 14)} required including retained balance. No transaction submitted.`,
    );
  return state;
}

export function artifact(name: "Cronpot" | "MeterMend" | "Ping") {
  const value = readJson<{ abi: Abi; bytecode: { object: Hex } }>(
    `contracts/out/${name}.sol/${name}.json`,
  );
  if (!/^0x[0-9a-f]+$/i.test(value.bytecode.object))
    throw new Error(`Missing compiled ${name} bytecode; run forge build`);
  return {
    abi: value.abi,
    code: value.bytecode.object,
    bytecodeSha256: createHash("sha256")
      .update(Buffer.from(value.bytecode.object.slice(2), "hex"))
      .digest("hex"),
  };
}

export type Deployment = TransactionEvidence & {
  address: Address;
  bytecodeSha256: string;
  deployedAt: string;
};
export type Manifest = {
  network: string;
  chainId: number;
  specVersion: number;
  codeFormat: "evm";
  cronpotMode: "keeper" | "native";
  contracts: Partial<Record<"Cronpot" | "MeterMend" | "Ping", Deployment>>;
  deployedAt?: string;
  [key: string]: unknown;
};
export function manifest(): Manifest {
  return readJson<Manifest>("deployments/portaldot-v3.json", {
    network: "portaldot-v3-testnet",
    chainId: 420420777,
    specVersion: 3002,
    codeFormat: "evm",
    cronpotMode: "keeper",
    contracts: {},
  });
}
export function requireContract(name: "Cronpot" | "MeterMend"): Deployment {
  const entry = manifest().contracts[name];
  if (!entry?.address || !entry.txHash || !entry.blockHash)
    throw new Error(`${name} has no confirmed deployment manifest`);
  return entry;
}

export function instantiated(evidence: TransactionEvidence): Address {
  const events = evidence.events.filter(
    (event) => event.type === "Revive" && event.value.type === "Instantiated",
  );
  if (events.length !== 1)
    throw new Error(
      "Expected exactly one Instantiated event; review confirmed evidence before proceeding",
    );
  return (events[0]!.value.value as { contract: Address }).contract;
}

export function contractEvents(
  evidence: TransactionEvidence,
  abi: Abi,
  address: Address,
) {
  return evidence.events.flatMap((event) => {
    if (event.type !== "Revive" || event.value.type !== "ContractEmitted")
      return [];
    const value = event.value.value;
    if (value.contract.toLowerCase() !== address.toLowerCase()) return [];
    const bytes =
      typeof value.data === "string" ? (value.data as Hex) : toHex(value.data);
    try {
      return [
        decodeEventLog({
          abi,
          data: bytes,
          topics: value.topics as [Hex, ...Hex[]],
          strict: true,
        }),
      ];
    } catch {
      return [];
    }
  });
}
export function eventArgs(
  evidence: TransactionEvidence,
  abi: Abi,
  address: Address,
  name: string,
): Record<string, unknown> {
  const found = contractEvents(evidence, abi, address).find(
    (event) => event.eventName === name,
  );
  if (!found)
    throw new Error(
      `Confirmed transaction ${evidence.txHash} has no ${name} event`,
    );
  return found.args as unknown as Record<string, unknown>;
}

type Entry = {
  intent: unknown;
  intentHash: string;
  signer: string;
  startedAt: string;
  startBlock: number;
  nonce: number;
  state:
    | "preparing"
    | "submitted"
    | "finalized"
    | "confirmed"
    | "failed"
    | "unknown";
  txHash?: Hex;
  statuses: unknown[];
  evidence?: TransactionEvidence;
  error?: string;
};
type JournalData = {
  schemaVersion: 1;
  network: string;
  steps: Record<string, Entry>;
  priorAttempts?: Record<string, Entry[]>;
};

/** Persistent write-once intent keys. Unknown outcomes must be reconciled, never blindly retried. */
export class Journal {
  readonly data: JournalData;
  private readonly lock: string;
  constructor(readonly path: string) {
    this.lock = pathAt(`${path}.lock`);
    mkdirSync(dirname(this.lock), { recursive: true });
    let fd: number;
    try {
      fd = openSync(this.lock, "wx");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const prior = JSON.parse(readFileSync(this.lock, "utf8")) as {
        pid: number;
      };
      let alive = true;
      try {
        process.kill(prior.pid, 0);
      } catch (failure) {
        if ((failure as NodeJS.ErrnoException).code === "ESRCH") alive = false;
      }
      if (alive) throw new Error(`Journal is locked by process ${prior.pid}`);
      unlinkSync(this.lock);
      fd = openSync(this.lock, "wx");
    }
    try {
      writeFileSync(fd, json({ pid: process.pid, startedAt: now() }));
    } finally {
      closeSync(fd);
    }
    this.data = readJson(path, {
      schemaVersion: 1,
      network: "portaldot-v3-testnet",
      steps: {},
    });
  }
  close() {
    try {
      unlinkSync(this.lock);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  private save() {
    writeJson(this.path, this.data);
  }
  /** Read-only recovery can restore a missing manifest before any new spending check. */
  async recover(
    key: string,
    intent: unknown,
    account: ChainSigner,
  ): Promise<TransactionEvidence | undefined> {
    const entry = this.data.steps[key];
    if (!entry) return undefined;
    if (entry.intentHash !== hash(intent) || entry.signer !== account.address)
      throw new Error(
        `Journal intent changed for ${key}; inspect the recorded operation instead of reusing its key`,
      );
    if (entry.state === "failed")
      throw new Error(
        `${key} previously failed: ${entry.error}. Inspect its evidence, correct the cause, then use --retry-failed for a new recorded attempt.`,
      );
    if (entry.state === "confirmed") return entry.evidence!;
    try {
      const evidence = entry.evidence ?? (await reconcile(entry));
      entry.evidence = evidence;
      entry.state = "confirmed";
      this.save();
      return evidence;
    } catch (error) {
      if (error instanceof FinalizedDispatchError) {
        entry.state = "failed";
        entry.evidence = error.evidence;
        entry.txHash = error.evidence.txHash;
        entry.error = error.message;
        this.save();
      }
      throw error;
    }
  }
  async step(
    key: string,
    intent: unknown,
    account: ChainSigner,
    action: (options: SubmissionOptions) => Promise<TransactionEvidence>,
  ): Promise<TransactionEvidence> {
    const old = this.data.steps[key];
    if (old) {
      if (old.intentHash !== hash(intent) || old.signer !== account.address)
        throw new Error(
          `Journal intent changed for ${key}; inspect the recorded operation instead of reusing its key`,
        );
      if (old.state === "confirmed") return old.evidence!;
      if (old.state === "failed") {
        if (!flag("retry-failed"))
          throw new Error(
            `${key} previously failed: ${old.error}. Inspect its evidence, correct the cause, then use --retry-failed for a new recorded attempt.`,
          );
        (this.data.priorAttempts ??= {})[key] ??= [];
        this.data.priorAttempts[key]!.push(old);
        delete this.data.steps[key];
        this.save();
      } else {
        return (await this.recover(key, intent, account))!;
      }
    }
    const state = await getAccountState(account.address);
    const entry: Entry = {
      intent,
      intentHash: hash(intent),
      signer: account.address,
      startedAt: now(),
      startBlock: state.block,
      nonce: state.nonce,
      state: "preparing",
      statuses: [],
    };
    this.data.steps[key] = entry;
    this.save();
    try {
      const evidence = await action({
        onStatus: (event) => {
          entry.txHash = event.txHash as Hex;
          entry.state =
            event.type === "finalized"
              ? event.ok
                ? "finalized"
                : "failed"
              : "submitted";
          if (event.type === "finalized" && !event.ok)
            entry.error = `Finalized dispatch failed: ${json(event.dispatchError)}`;
          entry.statuses.push(event);
          if (event.type === "finalized")
            entry.evidence = {
              txHash: event.txHash as Hex,
              block: event.block.number,
              blockHash: event.block.hash as Hex,
              extrinsicIndex: event.block.index,
              events: event.events,
            };
          this.save();
        },
      });
      entry.evidence = evidence;
      entry.txHash = evidence.txHash;
      entry.state = "confirmed";
      this.save();
      console.log(
        json({
          step: key,
          status: "confirmed",
          txHash: evidence.txHash,
          block: evidence.block,
          blockHash: evidence.blockHash,
        }),
      );
      return evidence;
    } catch (error) {
      if (error instanceof FinalizedDispatchError) {
        entry.state = "failed";
        entry.evidence = error.evidence;
        entry.txHash = error.evidence.txHash;
      } else if (entry.state !== "failed")
        entry.state = entry.txHash ? "unknown" : "failed";
      entry.error = error instanceof Error ? error.message : String(error);
      this.save();
      throw error;
    }
  }
}

async function reconcile(entry: Entry): Promise<TransactionEvidence> {
  if (!entry.txHash)
    throw new Error(
      "Interrupted journal entry has no transaction hash. Review account nonce and finalized history before a new attempt; automatic resubmission is disabled.",
    );
  const head = await getFinalizedHead();
  if (head.number - entry.startBlock > 900)
    throw new Error(
      `Transaction ${entry.txHash} is outside the conservative history window; recover archived evidence instead of resubmitting.`,
    );
  for (let number = entry.startBlock; number <= head.number; number++) {
    const blockHash = await getClient()._request<Hex | null>(
      "chain_getBlockHash",
      [number],
    );
    if (!blockHash) throw new Error(`Cannot reconcile pruned block ${number}`);
    const body = await getClient()._request<{
      block: { extrinsics: Hex[] };
    } | null>("chain_getBlock", [blockHash]);
    if (!body) throw new Error(`Cannot reconcile missing block body ${number}`);
    const index = body.block.extrinsics.findIndex(
      (value) => toHex(Blake2256(hexToBytes(value))) === entry.txHash,
    );
    if (index < 0) continue;
    const records = await getApi().query.System.Events.getValue({
      at: blockHash,
    });
    const events = records
      .filter(
        (record) =>
          record.phase.type === "ApplyExtrinsic" &&
          record.phase.value === index,
      )
      .map((record) => ({ ...record, ...record.event }));
    const evidence = {
      txHash: entry.txHash,
      block: number,
      blockHash,
      extrinsicIndex: index,
      events,
    };
    const failed = events.find(
      (event) =>
        event.type === "System" && event.value.type === "ExtrinsicFailed",
    );
    if (failed) throw new FinalizedDispatchError(evidence, failed.value.value);
    if (
      !events.some(
        (event) =>
          event.type === "System" && event.value.type === "ExtrinsicSuccess",
      )
    )
      throw new Error("No authoritative dispatch outcome in recovered events");
    return evidence;
  }
  throw new Error(
    `Transaction ${entry.txHash} is not yet found in finalized history. Its outcome remains unknown; no resubmission.`,
  );
}

export async function run(main: () => Promise<void>) {
  initialize();
  try {
    await verifyNetwork();
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    disconnectChain();
  }
}

export async function waitUntil<T>(
  description: string,
  check: () => Promise<T | undefined>,
  timeoutMs = 240_000,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await check();
    if (result !== undefined) return result;
    console.log(json({ waiting: description, observedAt: now() }));
    await sleep(6000);
  }
  throw new Error(
    `Timed out waiting for ${description}; persisted transactions remain resumable`,
  );
}
