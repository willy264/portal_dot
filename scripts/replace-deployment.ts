import { Blake2256 } from "@polkadot-api/substrate-bindings";
import { encodeAbiParameters, hexToBytes, toHex, type Hex } from "viem";
import { configureChain, getAccountState, getApi, getClient, getFinalizedHead } from "../packages/chain/src/client";
import { buildReviveDeploy, submitAndWatch } from "../packages/chain/src/revive";
import { Journal, amount, artifact, hash, instantiated, json, manifest, now, option, requireBudget, run, signer, writeJson } from "./lib";

// Explicit operator tool. The normal deployment command never replaces unknown transactions.
configureChain({ timeoutMs: Number(option("timeout-ms", "120000")) });
await run(async () => {
  const originalHash = option("original-hash");
  const deployment = manifest();
  const account = signer("DEPLOYER");
  if (!deployment.contracts.Cronpot) throw new Error("Confirm Cronpot before replacing MeterMend deployment");
  if (deployment.contracts.MeterMend) throw new Error("MeterMend is already recorded; no replacement allowed");
  const originalJournal = new Journal("deployments/deploy-journal.json");
  const replacement = new Journal("deployments/deploy-replacement-journal.json");
  try {
    const original = originalJournal.data.steps["deploy-MeterMend"];
    if (!originalHash || original?.txHash !== originalHash || original.signer !== account.address || !["unknown", "submitted"].includes(original.state))
      throw new Error("Supply the exact retained unresolved MeterMend transaction hash");
    const compiled = artifact("MeterMend");
    const tip = amount("0.001");
    const ctorData = encodeAbiParameters([{ type: "address" }, { type: "uint128" }], [deployment.contracts.Cronpot.address, tip]);
    const intent = { name: "MeterMend", bytecodeSha256: compiled.bytecodeSha256, ctorData };
    if (hash(intent) !== original.intentHash) throw new Error("The replacement must preserve the original constructor and bytecode");
    const key = `replace-${originalHash}`;
    const evidence = await replacement.step(key, { ...intent, originalHash, nonce: original.nonce }, account, async (options) => {
      const estimate = await buildReviveDeploy({ signer: account, code: compiled.code, ctorData, abi: compiled.abi });
      const fee = await estimate.tx.getEstimatedFees(account.txCreator);
      await requireBudget(account, estimate.storage_deposit_limit + fee, amount("25", 14));
      const client = getClient();
      const finalized = await getFinalizedHead();
      const bestHash = await client._request<string>("chain_getBlockHash", []);
      const [state, best, nextIndex, pool, code, bestCode, originalBlock] = await Promise.all([
        getAccountState(account.address),
        getApi().query.System.Account.getValue(account.address, { at: bestHash, signal: AbortSignal.timeout(30000) }),
        client._request<number>("system_accountNextIndex", [account.address]),
        client._request<Hex[]>("author_pendingExtrinsics", []),
        getApi().query.Revive.AccountInfoOf.getValue(estimate.simulatedAddress, { at: finalized.hash, signal: AbortSignal.timeout(30000) }),
        getApi().query.Revive.AccountInfoOf.getValue(estimate.simulatedAddress, { at: bestHash, signal: AbortSignal.timeout(30000) }),
        client._request<string | null>("chain_getBlockHash", [original.startBlock]),
      ]);
      const hashes = pool.map((raw) => toHex(Blake2256(hexToBytes(raw))));
      const checked = { observedAt: now(), originalHash, originalNonce: original.nonce, finalized, bestHash, finalizedNonce: state.nonce, bestNonce: best.nonce, nextIndex, pendingPoolMatch: hashes.includes(originalHash as Hex), pendingPoolSize: hashes.length, predictedAddress: estimate.simulatedAddress, contractPresentAtFinalized: code != null, contractPresentAtBest: bestCode != null, originalStartBlockHash: originalBlock, historyEvidence: "deployments/metermend-reconciliation-2026-11-01.json", replacementNonce: original.nonce };
      writeJson("deployments/deploy-replacement-check.json", checked);
      if (state.nonce !== original.nonce || best.nonce !== original.nonce || nextIndex !== original.nonce || hashes.length !== 0 || code != null || bestCode != null)
        throw new Error("Replacement refused: nonce, pool or contract state changed; reconcile without another write");
      // Pin the original nonce even if the original reappears after these reads.
      // Consensus can consume this account nonce only once.
      return submitAndWatch(estimate.tx, account, { ...options, nonce: original.nonce });
    });
    const current = manifest();
    current.contracts.MeterMend = { ...evidence, address: instantiated(evidence), bytecodeSha256: compiled.bytecodeSha256, deployedAt: now() };
    current.deploymentReplacements = { MeterMend: { originalHash, replacementHash: evidence.txHash, nonce: original.nonce, journal: "deployments/deploy-replacement-journal.json" } };
    current.cronTipEvm = tip.toString();
    current.cronTip = tip.toString();
    current.deployedAt = now();
    writeJson("deployments/portaldot-v3.json", current);
    console.log(json(current.contracts.MeterMend));
  } finally { replacement.close(); originalJournal.close(); }
});
