import { AccountId } from "polkadot-api";
import { Blake2128, Twox128 } from "@polkadot-api/substrate-bindings";
import { hexToBytes, toHex } from "viem";
import { getAccountState } from "../packages/chain/src/client";
import type { ChainSigner } from "../packages/chain/src/revive";

export async function nativeRpc<T = any>(
  method: string,
  params: unknown[] = [],
): Promise<T> {
  if (
    ![
      "chain_getBlockHash",
      "state_getStorage",
      "system_accountNextIndex",
      "author_pendingExtrinsics",
    ].includes(method)
  )
    throw Error("This retrying helper accepts read-only RPC methods only");
  let response: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await fetch("https://test-node-v3.portaldot.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        signal: AbortSignal.timeout(30000),
      });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
  if (!response) throw Error("Read-only RPC unavailable");
  if (!response.ok) throw Error(`${method}: HTTP ${response.status}`);
  const data = (await response.json()) as any;
  if (data.error) throw Error(`${method}: ${JSON.stringify(data.error)}`);
  return data.result;
}

export async function checkedNonce(account: ChainSigner) {
  const state = await getAccountState(account.address);
  const best = await nativeRpc<string>("chain_getBlockHash");
  const id = AccountId().enc(account.address);
  const key = toHex(
    new Uint8Array([
      ...Twox128(new TextEncoder().encode("System")),
      ...Twox128(new TextEncoder().encode("Account")),
      ...Blake2128(id),
      ...id,
    ]),
  );
  const [raw, nextIndex, pool] = await Promise.all([
    nativeRpc<`0x${string}`>("state_getStorage", [key, best]),
    nativeRpc<number>("system_accountNextIndex", [account.address]),
    nativeRpc<string[]>("author_pendingExtrinsics"),
  ]);
  const b = hexToBytes(raw);
  if (b.length !== 80) throw Error("Account codec changed");
  const bestNonce = new DataView(
    b.buffer,
    b.byteOffset,
    b.byteLength,
  ).getUint32(0, true);
  if (
    state.nonce !== bestNonce ||
    state.nonce !== Number(nextIndex) ||
    pool.length
  )
    throw Error("Finalized/best/next nonce or pool differs; no submission");
  return {
    ...state,
    bestHash: best,
    bestNonce,
    nextIndex: Number(nextIndex),
    pendingPoolCount: pool.length,
  };
}
