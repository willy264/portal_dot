import { AccountId } from "polkadot-api";
import { Blake2128, Twox128 } from "@polkadot-api/substrate-bindings";
import { formatUnits, hexToBytes, toHex } from "viem";
import { readJson, writeJson, now, json } from "./lib";

const endpoint = "https://test-node-v3.portaldot.dev";
const address = "5Gn8dCfyVQkKzoidcXXfncDR6amfmp5zVxFiXidsdzrZH3uB";
async function rpc<T = any>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw Error(`${method}: HTTP ${response.status}`);
  const data = await response.json() as any;
  if (data.error) throw Error(`${method}: ${JSON.stringify(data.error)}`);
  return data.result;
}
const startedAt = now();
const [genesis, health, bestHash, finalHash] = await Promise.all([rpc("chain_getBlockHash", [0]), rpc("system_health"), rpc("chain_getBlockHash"), rpc("chain_getFinalizedHead")]);
const [runtime, codeHash] = await Promise.all([rpc("state_getRuntimeVersion", [finalHash]), rpc("state_getStorageHash", ["0x3a636f6465", finalHash])]);
if (genesis !== "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd" || runtime.specVersion !== 3002 || codeHash !== "0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2") throw Error("Identity changed; account codec must be reviewed");
const id = AccountId().enc(address);
const key = toHex(new Uint8Array([...Twox128(new TextEncoder().encode("System")), ...Twox128(new TextEncoder().encode("Account")), ...Blake2128(id), ...id]));
const [bestHeader, finalHeader, bestRaw, finalRaw, nextIndex, pool] = await Promise.all([rpc("chain_getHeader", [bestHash]), rpc("chain_getHeader", [finalHash]), rpc("state_getStorage", [key, bestHash]), rpc("state_getStorage", [key, finalHash]), rpc("system_accountNextIndex", [address]), rpc<string[]>("author_pendingExtrinsics")]);
function account(raw: `0x${string}`) {
  const b = hexToBytes(raw); if (b.length !== 80) throw Error("Account codec changed");
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const u128 = (i: number) => v.getBigUint64(i, true) + (v.getBigUint64(i + 8, true) << 64n);
  return { nonce: v.getUint32(0, true), freeNative: u128(16), freeTPOT: formatUnits(u128(16), 14), frozenNative: u128(48) };
}
const finalAccount = account(finalRaw), bestAccount = account(bestRaw);
const observation = { startedAt, observedAt: now(), endpoint, genesis, runtimeCodeHash: codeHash, specVersion: runtime.specVersion, health, best: { number: parseInt(bestHeader.number, 16), hash: bestHash }, finalized: { number: parseInt(finalHeader.number, 16), hash: finalHash }, pendingPoolCount: pool.length, account: { address, finalizedNonce: finalAccount.nonce, bestNonce: bestAccount.nonce, nextIndex, finalized: finalAccount, best: bestAccount } };
const path = "deployments/chain-status-2026-11-03.json";
const report = readJson<any>(path, { observations: [] });
const previous = report.observations.at(-1);
report.observations.push(observation);
report.observedAt = observation.observedAt;
if (previous) report.progress = { newBlocks: observation.best.number - previous.best.number, newFinalizedBlocks: observation.finalized.number - previous.finalized.number };
writeJson(path, report);
console.log(json(observation));
