import { encodeFunctionData, type Address } from "viem";
import { h160Of } from "../packages/chain/src/client";
import { buildReviveCall, submitAndWatch } from "../packages/chain/src/revive";
import { meterMendAbi } from "../packages/chain/src/abi";
import {
  Journal,
  amount,
  eventArgs,
  json,
  now,
  readJson,
  requireBudget,
  requireContract,
  run,
  signer,
  writeJson,
} from "./lib";

await run(async () => {
  const operator = signer("DEPLOYER");
  const arbiter = await h160Of(signer("ARBITER").address);
  if (arbiter === (await h160Of(operator.address)))
    throw new Error("Operator and arbiter must be distinct");
  const deployment = requireContract("MeterMend");
  const report = readJson<{
    contract: Address;
    items: Record<string, unknown>;
  }>("deployments/seed.json", { contract: deployment.address, items: {} });
  if (report.contract.toLowerCase() !== deployment.address.toLowerCase())
    throw new Error("Seed manifest belongs to another deployment");
  const definitions = [
    {
      key: "camera",
      name: "Canon EOS camera",
      fee: "0.01",
      deposit: "0.05",
      description:
        "Shared makerspace camera. Physical returns are confirmed by the operator.",
    },
    {
      key: "printer",
      name: "3D printer",
      fee: "0.02",
      deposit: "0.08",
      description:
        "Shared workshop printer with an item-specific maintenance reserve.",
    },
    {
      key: "drill",
      name: "Cordless drill",
      fee: "0.005",
      deposit: "0.03",
      description:
        "Shared drill. Each rental contributes 20% of its fee to future repairs.",
    },
  ];
  const journal = new Journal("deployments/seed-journal.json");
  try {
    for (const item of definitions) {
      const metadata = {
        name: item.name,
        description: item.description,
        equipmentClass: item.key,
        demo: true,
      };
      const metadataURI = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
      const fee = amount(item.fee);
      const deposit = amount(item.deposit);
      const evidence = await journal.step(
        `register-${item.key}`,
        {
          contract: deployment.address,
          arbiter,
          fee: fee.toString(),
          deposit: deposit.toString(),
          reserveBps: 2000,
          disputeWindow: 120,
          metadataURI,
        },
        operator,
        async (options) => {
          const data = encodeFunctionData({
            abi: meterMendAbi,
            functionName: "registerItem",
            args: [arbiter, fee, deposit, 2000, 120, metadataURI],
          });
          const estimate = await buildReviveCall({
            signer: operator,
            to: deployment.address,
            data,
            abi: meterMendAbi,
          });
          const txFee = await estimate.tx.getEstimatedFees(operator.txCreator);
          await requireBudget(operator, estimate.storage_deposit_limit + txFee);
          return submitAndWatch(estimate.tx, operator, options);
        },
      );
      const args = eventArgs(
        evidence,
        meterMendAbi,
        deployment.address,
        "ItemRegistered",
      );
      report.items[item.key] = {
        itemId: String(args.itemId),
        name: item.name,
        metadataURI,
        seededAt: now(),
        ...evidence,
      };
      writeJson("deployments/seed.json", report);
      console.log(
        json({ item: item.key, itemId: args.itemId, txHash: evidence.txHash }),
      );
    }
  } finally {
    journal.close();
  }
});
