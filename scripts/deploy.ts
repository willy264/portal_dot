import { encodeAbiParameters, type Address } from "viem";
import {
  buildReviveDeploy,
  submitAndWatch,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
import {
  evmToNative,
  withTwentyPercentMargin,
} from "../packages/chain/src/units";
import {
  Journal,
  amount,
  artifact,
  instantiated,
  json,
  manifest,
  now,
  option,
  readJson,
  requireBudget,
  run,
  signer,
  writeJson,
} from "./lib";

await run(async () => {
  const account = signer("DEPLOYER");
  const deployment = manifest();
  const compiled = {
    Cronpot: artifact("Cronpot"),
    MeterMend: artifact("MeterMend"),
  };
  const tip = amount(option("cron-tip", "0.001")!);
  evmToNative(tip); // Reject fractional native-unit dust before constructing immutable terms.
  const journal = new Journal("deployments/deploy-journal.json");
  try {
    const names = ["Cronpot", "MeterMend"] as const;
    const constructorData = (name: (typeof names)[number]) =>
      name === "MeterMend"
        ? encodeAbiParameters(
            [{ type: "address" }, { type: "uint128" }],
            [deployment.contracts.Cronpot!.address, tip],
          )
        : "0x";
    const intent = (name: (typeof names)[number]) => ({
      name,
      bytecodeSha256: compiled[name].bytecodeSha256,
      ctorData: constructorData(name),
    });
    const record = (
      name: (typeof names)[number],
      evidence: TransactionEvidence,
    ) => {
      const address: Address = instantiated(evidence);
      deployment.contracts[name] = {
        ...evidence,
        address,
        bytecodeSha256: compiled[name].bytecodeSha256,
        deployedAt: now(),
      };
      deployment.deployedAt = now();
      deployment.cronTipEvm = tip.toString();
      deployment.cronTip = tip.toString();
      writeJson("deployments/portaldot-v3.json", deployment);
      console.log(
        json({
          contract: name,
          address,
          txHash: evidence.txHash,
          block: evidence.block,
        }),
      );
    };
    // A crash after finalization but before the manifest write must not charge twice,
    // or count already-spent storage against the remaining deployment budget.
    for (const name of names) {
      const entry = journal.data.steps[`deploy-${name}`];
      if (!deployment.contracts[name] && entry && entry.state !== "failed") {
        const recovered = await journal.recover(
          `deploy-${name}`,
          intent(name),
          account,
        );
        if (recovered) record(name, recovered);
      }
    }
    const pending = names.filter((name) => !deployment.contracts[name]);
    if (pending.length === 0) {
      console.log(
        "Both confirmed deployments already exist; no transactions submitted.",
      );
      return;
    }
    // Refuse a partial application deployment when the complete remaining plan is underfunded.
    const budget = readJson<{
      estimates: Record<
        string,
        { status: string; bytecodeSha256: string; storageDepositNative: string }
      >;
    }>("deployments/budget.json");
    let totalStorage = 0n;
    for (const name of pending) {
      const estimate = budget.estimates[name];
      if (
        !estimate ||
        estimate.status !== "simulation-passed" ||
        estimate.bytecodeSha256 !== compiled[name].bytecodeSha256
      )
        throw new Error(
          `Run scripts/budget.ts for the current ${name} artifact before deployment`,
        );
      totalStorage += BigInt(estimate.storageDepositNative);
    }
    await requireBudget(
      account,
      withTwentyPercentMargin(totalStorage),
      amount(option("keep", "25")!, 14),
    );
    for (const name of pending) {
      const ctorData = constructorData(name);
      const evidence = await journal.step(
        `deploy-${name}`,
        intent(name),
        account,
        async (options) => {
          const estimate = await buildReviveDeploy({
            signer: account,
            code: compiled[name].code,
            ctorData,
            abi: compiled[name].abi,
          });
          const fee = await estimate.tx.getEstimatedFees(account.txCreator);
          await requireBudget(
            account,
            estimate.storage_deposit_limit + fee,
            amount("10", 14),
          );
          return submitAndWatch(estimate.tx, account, options);
        },
      );
      record(name, evidence);
    }
  } finally {
    journal.close();
  }
});
