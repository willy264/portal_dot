import "dotenv/config";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { createClient, Binary, Enum } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws";
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings";
import { firstValueFrom } from "rxjs";
import { portaldot } from "../packages/chain/.papi/descriptors/dist/index.js";

/** Phase 0 deliberately imports no signer and never broadcasts a transaction. */
const require = createRequire(import.meta.url);
const solc = require("solc") as { version(): string; compile(input: string): string };
const WSS_URL = process.env.WSS_URL ?? "wss://test-node-v3.portaldot.dev";
const EVM_RPC_URL = process.env.EVM_RPC_URL ?? "https://test-evm-rpc-v3.portaldot.dev";
const EXPECTED_CHAIN_ID = 420420777;
const PUBLIC_ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
const probeAccount = process.env.PROBE_SS58 ?? PUBLIC_ALICE;
const artifactPath = resolve("deployments/probe.json");
const timeoutMs = 45_000;
const PING_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
contract Phase0Ping {
    uint256 public count;
    event Pinged(address indexed caller, uint256 value, uint256 count);
    function ping() external payable { count += 1; emit Pinged(msg.sender, msg.value, count); }
}`;

type Check = { status: string; [key: string]: unknown };
type Probe = {
  schemaVersion: 1;
  observedAt: string;
  completedAt?: string;
  mode: "read-only";
  signedTransactions: 0;
  endpoints: { substrate: string; evm: string };
  checks: Record<string, Check>;
  [key: string]: unknown;
};
const result: Probe = {
  schemaVersion: 1,
  observedAt: new Date().toISOString(),
  mode: "read-only",
  signedTransactions: 0,
  endpoints: { substrate: WSS_URL, evm: EVM_RPC_URL },
  simulationAccount: {
    address: probeAccount,
    provenance: process.env.PROBE_SS58 ? "PROBE_SS58 configuration" : "Public development Alice address",
    ownsAccount: false,
    explanation: "Runtime dry-runs accept an origin without its private key. This is not a funded transaction or proof of account ownership.",
  },
  checks: {},
};

function json(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) => {
    if (typeof item === "bigint") return item.toString();
    if (item instanceof Uint8Array) return `0x${Buffer.from(item).toString("hex")}`;
    if (item && typeof item === "object" && "asHex" in item && typeof item.asHex === "function") return item.asHex();
    return item;
  }, 2);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : json(error);
}

async function timed<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function evmRpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(EVM_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status}`);
  const body = await response.json() as { result?: T; error?: { code: number; message: string } };
  if (body.error) throw new Error(`${method}: ${body.error.code} ${body.error.message}`);
  if (!("result" in body)) throw new Error(`${method}: missing JSON-RPC result`);
  return body.result as T;
}

async function checkpoint(): Promise<void> {
  await mkdir(dirname(artifactPath), { recursive: true });
  // An ordinary read-only refresh must not erase separately recorded funded evidence.
  if (!("funded" in result)) {
    try {
      const previous = JSON.parse(await readFile(artifactPath, "utf8")) as { funded?: unknown };
      if (previous.funded) result.funded = previous.funded;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  await writeFile(artifactPath, `${json(result)}\n`);
}

function compilePing(evmVersion: "prague" | "cancun") {
  const compilerInput = {
    language: "Solidity",
    sources: { "Phase0Ping.sol": { content: PING_SOURCE } },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion,
      outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(compilerInput))) as {
    errors?: { severity: string; formattedMessage: string }[];
    contracts: Record<string, Record<string, { evm: { bytecode: { object: string } } }>>;
  };
  const fatal = output.errors?.filter((item) => item.severity === "error") ?? [];
  if (fatal.length) throw new Error(fatal.map((item) => item.formattedMessage).join("\n"));
  const code = `0x${output.contracts["Phase0Ping.sol"]!.Phase0Ping!.evm.bytecode.object}` as `0x${string}`;
  return {
    code,
    compiler: solc.version(),
    evmVersion,
    bytes: (code.length - 2) / 2,
    sourceSha256: createHash("sha256").update(PING_SOURCE).digest("hex"),
    bytecodeSha256: createHash("sha256").update(Buffer.from(code.slice(2), "hex")).digest("hex"),
  };
}

async function main(): Promise<void> {
  if (process.argv.includes("--funded")) {
    throw new Error("This entrypoint is read-only. Funded P4/P5/P6/P7 require the explicit funded-probe workflow and funded signers; none was submitted.");
  }
  if (WSS_URL.includes("mainnet.portaldot.io")) throw new Error("Legacy mainnet is prohibited by SPEC.md.");
  const client = createClient(getWsProvider(WSS_URL));
  const api = client.getTypedApi(portaldot);
  try {
    const [runtime, properties, nodeName, nodeVersion, chainName, genesisHash, chainIdHex, methods] = await Promise.all([
      timed(client._request<{ specName: string; specVersion: number; transactionVersion: number }>("state_getRuntimeVersion", []), "runtime version"),
      timed(client._request<{ tokenSymbol: string; tokenDecimals: number; ss58Format: number }>("system_properties", []), "chain properties"),
      timed(client._request<string>("system_name", []), "node name"),
      timed(client._request<string>("system_version", []), "node version"),
      timed(client._request<string>("system_chain", []), "chain name"),
      timed(client._request<string>("chain_getBlockHash", [0]), "genesis hash"),
      evmRpc<string>("eth_chainId"),
      timed(client._request<{ methods: string[] }>("rpc_methods", []), "RPC methods"),
    ]);
    const chainId = Number(BigInt(chainIdHex));
    result.checks.P1 = {
      status: runtime.specName === "portaldot-v3" && chainId === EXPECTED_CHAIN_ID ? "passed" : "failed",
      chainName, nodeName, nodeVersion, runtime, properties, genesisHash, chainId, chainIdHex,
      correctedSuppliedHex: { supplied: "0x190F1B29", actualSuppliedDecimal: 420420393, correct: "0x190f1ca9" },
      rpcMethods: methods.methods,
    };
    await checkpoint();
    if (result.checks.P1.status !== "passed") throw new Error("P1 mismatch: dependent deployment blocked; corrected organizer endpoint details are required.");

    const finalized = await timed(firstValueFrom(client.finalizedBlock$), "finalized block");
    const options = { at: finalized.hash, signal: AbortSignal.timeout(timeoutMs) };
    result.at = finalized;
    const [rawMetadata, runtimeCodeHash, staticApis] = await Promise.all([
      timed(client.getMetadata(finalized.hash, AbortSignal.timeout(timeoutMs)), "metadata"),
      timed(client._request<string>("state_getStorageHash", ["0x3a636f6465", finalized.hash]), "runtime code hash"),
      timed(api.getStaticApis(options), "typed static APIs"),
    ]);
    const metadata = unifyMetadata(decAnyMetadata(rawMetadata));
    const constantsFor = (name: string) => Object.fromEntries(
      (metadata.pallets.find((pallet) => pallet.name === name)?.constants ?? []).map((constant) => [
        constant.name,
        (staticApis.constants as unknown as Record<string, Record<string, unknown>>)[name]![constant.name],
      ]),
    );
    const wanted = new Set(["Revive", "Scheduler", "TransactionStorage", "Multisig", "Proxy", "Identity", "Utility"]);
    result.runtimeCodeHash = runtimeCodeHash;
    result.checks.P2 = {
      status: "passed",
      metadataVersion: metadata.version,
      metadataBytes: rawMetadata.length,
      metadataSha256: createHash("sha256").update(rawMetadata).digest("hex"),
      pallets: [...wanted].map((name) => {
        const pallet = metadata.pallets.find((entry) => entry.name === name);
        return pallet ? {
          name, present: true, index: pallet.index, calls: pallet.calls,
          storageEntries: pallet.storage?.items.map((entry) => entry.name),
          constants: pallet.constants,
          associatedTypes: pallet.associatedTypes,
        } : { name, present: false };
      }),
      reviveApi: metadata.apis.find((entry) => entry.name === "ReviveApi"),
      caveat: "Metadata establishes available interfaces, not permission to dispatch Scheduler or successful funded execution.",
    };
    await checkpoint();

    const attempts: unknown[] = [];
    for (const evmVersion of ["prague", "cancun"] as const) {
      const compiled = compilePing(evmVersion);
      const simulation = await timed(api.apis.ReviveApi.instantiate_versioned(Enum("V1", {
        origin: probeAccount,
        value: 0n,
        gas_limit: undefined,
        storage_deposit_limit: undefined,
        code: Enum("Upload", Binary.fromHex(compiled.code)),
        data: Binary.fromHex("0x"),
        salt: undefined,
      }), options), `P3 ${evmVersion} dry-run`);
      attempts.push({ ...compiled, code: undefined, runtimeApi: "ReviveApi.instantiate_versioned/V1", simulation });
      // PAPI codegen unwraps the one-field V1 result wrapper.
      const contractResult = simulation.value;
      if (contractResult.result.success && !(contractResult.result.value.result.flags & 1)) {
        result.checks.P3 = {
          status: "passed", codeFormat: "evm", evmVersion, attempts,
          deploymentStatus: "Dry-run only: no contract was deployed; simulated addresses are not deployments.",
        };
        break;
      }
      result.checks.P3 = { status: "inconclusive", attempts, reason: "Simulation did not complete successfully; inspect the dispatch/revert result before selecting a code pipeline." };
    }
    if (result.checks.P3?.status !== "passed") {
      result.checks.P3 = {
        ...result.checks.P3!,
        pvmFallback: "Not yet attempted. A code-format rejection requires resolc 1.4.0 compilation and PVM dry-run; funding/mapping errors do not establish bytecode incompatibility.",
      };
      process.exitCode = 1;
    }
    await checkpoint();

    const [mappedH160, account, versionDeclarations] = await Promise.all([
      timed(api.apis.ReviveApi.address(probeAccount, options), "runtime address mapping"),
      timed(api.query.System.Account.getValue(probeAccount, options), "native account"),
      timed(api.apis.ReviveApi.version_declarations(options), "Revive API versions"),
    ]);
    const ratio = BigInt(staticApis.constants.Revive.NativeToEthRatio);
    const ethBalance = await evmRpc<string>("eth_getBalance", [mappedH160, "latest"]);
    result.checks.P4 = {
      status: "partial", nativeDecimals: properties.tokenDecimals, nativeToEthRatio: ratio,
      derivedEvmDecimals: properties.tokenDecimals + Math.log10(Number(ratio)),
      mappedH160, nativeAccount: account, evmBalance: BigInt(ethBalance),
      nativeBalanceAt: finalized.hash, evmBalanceAt: "latest (different snapshot; not a value-movement proof)",
      versionDeclarations,
      autoMap: staticApis.constants.Revive.AutoMap,
      allowEvmBytecode: staticApis.constants.Revive.AllowEVMBytecode,
      depositPerByte: staticApis.constants.Revive.DepositPerByte,
      depositPerItem: staticApis.constants.Revive.DepositPerItem,
      depositPerChildTrieItem: staticApis.constants.Revive.DepositPerChildTrieItem,
      fundedValueMovement: { status: "not-run", reason: "Requires an explicitly funded signer; no transaction was signed." },
      arithmetic: "For native-denominated amounts, evmUnits = nativeUnits * 10000. App conversions back must reject non-divisible values rather than silently discarding EVM dust.",
      caveat: "Ratio and signatures are observed; funded extrinsic denomination has not yet been measured.",
    };
    result.checks.P5 = {
      status: "not-run", fallbackMode: "keeper", nativeSchedulerVerified: false,
      schedulerConstants: constantsFor("Scheduler"),
      reason: "A funded schedule_after call and Scheduler.Dispatched(Ok) plus Ping event are required. Metadata presence does not prove Signed-origin permission.",
    };
    const txStorage = metadata.pallets.find((entry) => entry.name === "TransactionStorage");
    const [byteFee, entryFee, retentionPeriod] = await Promise.all([
      api.query.TransactionStorage.ByteFee.getValue(options),
      api.query.TransactionStorage.EntryFee.getValue(options),
      api.query.TransactionStorage.RetentionPeriod.getValue(options),
    ]);
    result.checks.P6 = {
      status: "partial", present: !!txStorage,
      constants: constantsFor("TransactionStorage"),
      byteFee, entryFee, retentionPeriod,
      storageEntries: txStorage?.storage?.items,
      oneKiBStore: { status: "not-run", reason: "Requires an explicitly funded signer." },
      selectedModeUntilWriteVerified: "hash-only application storage",
    };
    result.checks.P7 = {
      status: "not-run", optional: true, metaMaskWritesEnabled: false,
      reason: "No raw EOA transaction was signed. Default writes remain Substrate-signed PAPI Revive calls.",
    };
  } finally {
    client.destroy();
  }
}

try {
  await main();
} catch (error) {
  result.error = errorMessage(error);
  process.exitCode = 1;
} finally {
  result.completedAt = new Date().toISOString();
  await checkpoint();
  console.log(json({ artifact: artifactPath, checks: Object.fromEntries(Object.entries(result.checks).map(([id, check]) => [id, check.status])), error: result.error }));
}
