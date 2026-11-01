import { Enum } from "polkadot-api";
import { formatUnits } from "viem";
import { getAccountState, getApi } from "../packages/chain/src/client";
import { submitAndWatch } from "../packages/chain/src/revive";
import { syncManifestOperations } from "./manifest-operations";
import {
  Journal,
  amount,
  json,
  now,
  option,
  readJson,
  requireBudget,
  run,
  signer,
  writeJson,
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
  const recordAccount = (
    role: string,
    ss58: string,
    state: Awaited<ReturnType<typeof getAccountState>>,
  ) => {
    const report = readJson<{ accounts: Record<string, unknown> }>(
      "deployments/account-funding.json",
      { accounts: {} },
    );
    report.accounts[role.toLowerCase()] = {
      ss58,
      ...state,
      nativeBalance: state.nativeBalance.toString(),
      nativeFrozen: state.nativeFrozen.toString(),
      nativeReserved: state.nativeReserved.toString(),
      observedAt: now(),
    };
    writeJson("deployments/account-funding.json", report);
    syncManifestOperations();
  };
  try {
    for (const role of roles as ("RENTER" | "ARBITER" | "RELAYER")[]) {
      const destination = signer(role);
      if (destination.address === source.address)
        throw new Error("Funding role must differ from deployer");
      const key = `fund-${role}-${target}-${option("attempt", "initial")}`;
      const intent = {
        role,
        destination: destination.address,
        targetNative: target.toString(),
      };
      const previous = journal.data.steps[key];
      if (previous && previous.state !== "failed")
        await journal.recover(key, intent, source);
      const state = await getAccountState(destination.address);
      if (state.nativeBalance >= target) {
        if (!state.mapped)
          throw new Error(
            `${role} has sufficient balance but no confirmed address mapping`,
          );
        recordAccount(role, destination.address, state);
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
      await journal.step(key, intent, source, (options) =>
        submitAndWatch(tx, source, options),
      );
      const final = await getAccountState(destination.address);
      if (final.nativeBalance < target || !final.mapped)
        throw new Error(
          `${role} transfer confirmed but expected funded AutoMap state is absent; inspect the journal before retrying`,
        );
      recordAccount(role, destination.address, final);
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
    syncManifestOperations();
  }
});
