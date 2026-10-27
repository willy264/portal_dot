/** Node-only signer construction. Never import this subpath into a browser bundle. */
import { sr25519CreateDerive, withNetworkAccount } from "@polkadot-labs/hdkd";
import { mnemonicToMiniSecret, parseSuri } from "@polkadot-labs/hdkd-helpers";
import { getTxCreator } from "polkadot-api/tx-creator";
import type { ChainSigner } from "./revive";

/** Reads no files and logs no secrets; the process owner supplies an ignored-env value. */
export function signerFromSeed(secret: string): ChainSigner {
  if (!secret?.trim()) throw new Error("A testnet seed is required");
  const { phrase, paths, password } = parseSuri(secret);
  if (!phrase) throw new Error("Provide an explicit testnet mnemonic or 32-byte mini-secret");
  const seed = /^0x[0-9a-f]{64}$/i.test(phrase) ? phrase : mnemonicToMiniSecret(phrase, password);
  const account = withNetworkAccount(sr25519CreateDerive(seed)(paths ?? ""), 42);
  return { address: account.ss58Address, txCreator: getTxCreator(account.publicKey, "Sr25519", account.sign) };
}
