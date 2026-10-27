import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";
import type { PublicConfig } from "./types";
let configuredEndpoints:string|null=null;
export async function chainAdapter(config:PublicConfig) {
  const chain=await import("@metermend/chain");
  const endpoints=`${config.wssUrl}|${config.evmRpcUrl}`;
  if(configuredEndpoints&&configuredEndpoints!==endpoints)throw new Error("The configured network changed. Reload the page before continuing.");
  if(!configuredEndpoints){chain.configureChain({wssUrl:config.wssUrl,evmRpcUrl:config.evmRpcUrl});configuredEndpoints=endpoints;}
  return chain;
}
export function chainSigner(account:InjectedPolkadotAccount) {return {address:account.address,txCreator:account.txCreator};}
