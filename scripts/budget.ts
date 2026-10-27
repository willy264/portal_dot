import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { getFakeTxCreator } from "polkadot-api/tx-creator";
import { encodeAbiParameters, formatUnits, parseUnits, type Hex } from "viem";
import { getApi, getFinalizedHead, disconnectChain } from "../packages/chain/src/client";
import { simulateReviveDeploy } from "../packages/chain/src/revive";

// Public state and unsigned runtime simulations only. This entrypoint never submits.
try {
  const api = getApi();
  const head = await getFinalizedHead();
  const options = { at: head.hash, signal: AbortSignal.timeout(90_000) };
  const entries = await api.query.Revive.OriginalAccount.getEntries(options);
  const accounts = await api.query.System.Account.getValues(entries.map((entry) => [entry.value]), options);
  const candidates = entries.map((entry, i) => ({ address: entry.value, balance: accounts[i]!.data.free }))
    .sort((a, b) => a.balance > b.balance ? -1 : a.balance < b.balance ? 1 : 0);
  const origin = candidates[0]!;
  if (!origin) throw new Error("No public mapped account is available for simulation");
  const signer = { address: origin.address, txCreator: getFakeTxCreator(origin.address) };
  const estimates: Record<string, unknown> = {};
  let total = 0n;
  for (const name of ["Cronpot", "MeterMend", "Ping"]) {
    const artifact = JSON.parse(await readFile(`contracts/out/${name}.sol/${name}.json`, "utf8")) as {
      abi: readonly unknown[]; bytecode: { object: Hex }; deployedBytecode: { object: Hex };
    };
    const ctorData = name === "MeterMend"
      ? encodeAbiParameters([{ type: "address" }, { type: "uint128" }], ["0x0000000000000000000000000000000000000001", parseUnits("0.001", 18)])
      : "0x";
    const estimate = await simulateReviveDeploy({ signer, code: artifact.bytecode.object, ctorData });
    const charge = estimate.simulation.max_storage_deposit.type === "Charge" ? estimate.simulation.max_storage_deposit.value : 0n;
    total += charge;
    estimates[name] = {
      status: "simulation-passed", creationBytes: (artifact.bytecode.object.length - 2) / 2,
      runtimeBytes: (artifact.deployedBytecode.object.length - 2) / 2,
      bytecodeSha256: createHash("sha256").update(Buffer.from(artifact.bytecode.object.slice(2), "hex")).digest("hex"),
      storageDepositNative: charge, storageDepositTPOT: formatUnits(charge, 14),
      storageDepositLimitWithMargin: estimate.storage_deposit_limit,
      weightLimitWithMargin: estimate.weight_limit,
      simulation: estimate.simulation,
    };
  }
  const result = {
    observedAt: new Date().toISOString(), mode: "read-only", signedTransactions: 0,
    publicSimulationOrigin: origin.address, ownsSimulationOrigin: false, originBalance: origin.balance,
    atDiscovery: head, estimates, combinedStorageDepositNative: total,
    combinedStorageDepositTPOT: formatUnits(total, 14),
    caveats: ["Independent unsigned simulations; addresses returned are not deployed contracts.", "MeterMend uses a nonzero illustrative constructor address; real deployment will be simulated with the deployed Cronpot address.", "Storage deposits exclude transaction fees, funded movement, demo escrow and subsequent contract storage.", "Origin was selected from public mapped chain accounts solely to avoid insufficient-balance simulation failure; no signature or key is available or required."],
  };
  await writeFile("deployments/budget.json", `${JSON.stringify(result, (_key, value: unknown) => typeof value === "bigint" ? value.toString() : value instanceof Uint8Array ? `0x${Buffer.from(value).toString("hex")}` : value, 2)}\n`);
  console.log(JSON.stringify({ artifact: "deployments/budget.json", origin: origin.address, combinedStorageDepositTPOT: result.combinedStorageDepositTPOT, estimates: Object.fromEntries(Object.entries(estimates).map(([name, value]) => [name, (value as { storageDepositTPOT: string }).storageDepositTPOT])) }));
} finally { disconnectChain(); }
