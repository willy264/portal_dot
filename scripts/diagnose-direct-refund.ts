import { encodeFunctionData, formatUnits } from "viem";
import {
  getAccountState,
  getClient,
  getFinalizedHead,
  readContract,
} from "../packages/chain/src/client";
import {
  prepareBoundedReviveCall,
  buildReviveCall,
} from "../packages/chain/src/revive";
import { meterMendAbi, cronpotAbi } from "../packages/chain/src/abi";
import {
  run,
  signer,
  requireContract,
  writeJson,
  json,
  now,
  amount,
} from "./lib";

await run(async () => {
  const meter = requireContract("MeterMend"),
    cron = requireContract("Cronpot");
  const roles = {
    operator: signer("DEPLOYER"),
    renter: signer("RENTER"),
    arbiter: signer("ARBITER"),
    keeper: signer("RELAYER"),
  };
  const at = await getFinalizedHead();
  const [rental, item, job, health, pool, accounts] = await Promise.all([
    readContract(meterMendAbi, meter.address, "rentals", [1n], { at }),
    readContract(meterMendAbi, meter.address, "items", [1n], { at }),
    readContract(cronpotAbi, cron.address, "getJob", [1n], { at }),
    getClient()._request("system_health", []),
    getClient()._request<string[]>("author_pendingExtrinsics", []),
    Promise.all(
      Object.entries(roles).map(async ([role, account]) => ({
        role,
        address: account.address,
        ...(await getAccountState(account.address)),
      })),
    ),
  ]);
  const evidence: any = {
    schemaVersion: 1,
    observedAt: now(),
    mode: "read-only-current-state-no-overrides",
    signedTransactions: 0,
    contract: meter.address,
    cronpot: cron.address,
    rentalId: "1",
    at,
    health,
    poolCount: pool.length,
    rental,
    item,
    job,
    accounts: accounts.map((a) => ({
      ...a,
      availableTPOT: formatUnits(a.nativeBalance - a.nativeFrozen, 14),
    })),
  };
  try {
    const data = encodeFunctionData({
      abi: meterMendAbi,
      functionName: "finalizeRefund",
      args: [1n],
    });
    const prepared = await prepareBoundedReviveCall(
      { signer: roles.keeper, to: meter.address, data, abi: meterMendAbi },
      {
        weight_limit: { ref_time: 10000000000n, proof_size: 1048576n },
        storage_deposit_limit: amount("5", 14),
      },
      at,
    );
    const fee = await prepared.tx.getEstimatedFees(roles.keeper.txCreator);
    evidence.direct = {
      status: "passed",
      output: prepared.output,
      initial: prepared.initial,
      bounded: prepared.bounded,
      caps: prepared.caps,
      feeNative: fee,
      feeTPOT: formatUnits(fee, 14),
      maximumCashRequiredTPOT: formatUnits(amount("5", 14) + fee, 14),
      revertReason: null,
    };
  } catch (error) {
    evidence.direct = {
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
      details: (error as any)?.details,
    };
  }
  const quotes: any[] = [];
  for (const [step, role, fn, args, value] of [
    ["rent-second", "renter", "rent", [1n], amount("0.06")],
    [
      "propose-repair-current-reserve",
      "operator",
      "proposeRepair",
      [
        1n,
        accounts.find((a) => a.role === "renter")!.h160,
        amount("0.001"),
        `0x${"11".repeat(32)}`,
      ],
      0n,
    ],
    ["withdraw-current-income", "operator", "withdrawIncome", [], 0n],
  ] as const) {
    try {
      const estimate = await buildReviveCall({
        signer: roles[role],
        to: meter.address,
        data: encodeFunctionData({
          abi: meterMendAbi,
          functionName: fn,
          args,
        } as any),
        value,
        abi: meterMendAbi,
      });
      const fee = await estimate.tx.getEstimatedFees(roles[role].txCreator);
      quotes.push({
        step,
        role,
        status: "simulated-current-state",
        storage: estimate.simulation.storage_deposit,
        storageMaximum: estimate.simulation.max_storage_deposit,
        capNative: estimate.storage_deposit_limit,
        feeNative: fee,
        valueNative: estimate.value,
        maximumCashRequiredTPOT: formatUnits(
          estimate.storage_deposit_limit + fee + estimate.value,
          14,
        ),
        simulation: estimate.simulation,
      });
    } catch (error) {
      quotes.push({
        step,
        status: "unavailable",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  evidence.quotes = quotes;
  evidence.limitations = [
    "Future dependent steps require a fresh simulation after their preceding state exists. Fee estimates are quoted at the observed state, not guaranteed final charges.",
    "The direct simulation does not execute Cronpot and proves no live refund.",
  ];
  writeJson("deployments/direct-refund-diagnosis-2026-11-03.json", evidence);
  console.log(
    json({
      at,
      health,
      accounts: evidence.accounts.map((a: any) => ({
        role: a.role,
        availableTPOT: a.availableTPOT,
        nonce: a.nonce,
      })),
      direct: evidence.direct,
      quotes: quotes.map(({ simulation, ...q }) => q),
    }),
  );
});
