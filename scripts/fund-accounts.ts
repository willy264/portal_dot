import { Enum } from "polkadot-api";
import { formatUnits } from "viem";
import { getAccountState, getApi } from "../packages/chain/src/client";
import { submitAndWatch } from "../packages/chain/src/revive";
import {
  Journal,
  amount,
  json,
  option,
  requireBudget,
  run,
  signer,
} from "./lib";

await run(async () => {
  const requested = option("amount");
  if (requested === undefined)
    throw new Error(
      "Specify an explicit target per-role balance: --amount 30 --roles renter,arbiter,relayer. Existing balances are topped up, not paid twice.",
    );
  const target = amount(requested, 14);
  if (target <= 0n) throw new Error("Funding amount must be positive");
  const roles = option("roles", "renter,arbiter,relayer")!
    .split(",")
    .map((role) => role.trim().toUpperCase());
  if (
    new Set(roles).size !== roles.length ||
    roles.some((role) => !["RENTER", "ARBITER", "RELAYER"].includes(role))
  )
    throw new Error(
      "Only unique project renter, arbiter and relayer roles can be funded",
    );
  const source = signer("DEPLOYER");
  const keep = amount(option("keep", "25")!, 14);
  const journal = new Journal("deployments/funding-journal.json");
  try {
    for (const role of roles as ("RENTER" | "ARBITER" | "RELAYER")[]) {
      const destination = signer(role);
      if (destination.address === source.address)
        throw new Error("Funding role must differ from deployer");
      const state = await getAccountState(destination.address);
      if (state.nativeBalance >= target) {
        console.log(
          json({
            role,
            address: destination.address,
            status: "already-funded",
            balanceTPOT: formatUnits(state.nativeBalance, 14),
          }),
        );
        continue;
      }
      const transfer = target - state.nativeBalance;
      const tx = getApi().tx.Balances.transfer_keep_alive({
        dest: Enum("Id", destination.address),
        value: transfer,
      });
      const fee = await tx.getEstimatedFees(source.txCreator);
      await requireBudget(source, transfer + fee, keep);
      await journal.step(
        `fund-${role}-${target}-${option("attempt", "initial")}`,
        {
          role,
          destination: destination.address,
          targetNative: target.toString(),
        },
        source,
        (options) => submitAndWatch(tx, source, options),
      );
      const final = await getAccountState(destination.address);
      if (final.nativeBalance < target || !final.mapped)
        throw new Error(
          `${role} transfer confirmed but expected funded AutoMap state is absent; inspect the journal before retrying`,
        );
      console.log(
        json({
          role,
          address: destination.address,
          h160: final.h160,
          mapped: final.mapped,
          balanceTPOT: formatUnits(final.nativeBalance, 14),
        }),
      );
    }
  } finally {
    journal.close();
  }
});
