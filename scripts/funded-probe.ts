import { createHash } from "node:crypto";
import { encodeFunctionData, formatUnits, type Address } from "viem";
import {
  getAccountState,
  getApi,
  getClient,
  getEvmClient,
  getFinalizedHead,
  getLogs,
  h160Of,
} from "../packages/chain/src/client";
import {
  buildReviveCall,
  buildReviveDeploy,
  FinalizedDispatchError,
  submitAndWatch,
} from "../packages/chain/src/revive";
import { nativeToEvm } from "../packages/chain/src/units";
import { pingAbi } from "../packages/chain/src/abi";
import {
  Journal,
  amount,
  artifact,
  eventArgs,
  flag,
  hash,
  instantiated,
  json,
  manifest,
  now,
  option,
  readJson,
  requireBudget,
  run,
  signer,
  waitUntil,
  writeJson,
} from "./lib";

await run(async () => {
  if (!flag("execute"))
    throw new Error(
      "This entrypoint performs funded testnet writes. Use --execute to run the requested P4/P5/P6 probes.",
    );
  const account = signer("DEPLOYER");
  const api = getApi();
  const journal = new Journal("deployments/funded-probe-journal.json");
  const report = readJson<Record<string, any>>(
    "deployments/funded-probe.json",
    {
      network: "portaldot-v3-testnet",
      mode: "funded-writes",
      checks: {},
      startedAt: now(),
    },
  );
  const save = () => {
    report.updatedAt = now();
    writeJson("deployments/funded-probe.json", report);
  };
  const keep = amount(option("keep", "10")!, 14);
  try {
    const initial = await getAccountState(account.address);
    report.signer = account.address;
    report.initialAccount ??= initial;
    save();
    let ping = manifest().contracts.Ping;
    if (!ping) {
      const compiled = artifact("Ping");
      const evidence = await journal.step(
        "deploy-ping",
        { codeHash: compiled.bytecodeSha256 },
        account,
        async (options) => {
          const estimate = await buildReviveDeploy({
            signer: account,
            code: compiled.code,
            ctorData: "0x",
            abi: pingAbi,
          });
          const fee = await estimate.tx.getEstimatedFees(account.txCreator);
          await requireBudget(
            account,
            estimate.storage_deposit_limit + fee,
            keep,
          );
          report.pingBudget = {
            storageLimit: estimate.storage_deposit_limit,
            fee,
          };
          save();
          return submitAndWatch(estimate.tx, account, options);
        },
      );
      ping = {
        ...evidence,
        address: instantiated(evidence),
        bytecodeSha256: compiled.bytecodeSha256,
        deployedAt: now(),
      };
      const deployment = manifest();
      deployment.contracts.Ping = ping;
      writeJson("deployments/portaldot-v3.json", deployment);
    }
    report.ping = ping;
    save();
    const movementNative = amount("0.0001", 14);
    const movementEvm = nativeToEvm(movementNative);
    if (report.checks.P4?.status !== "passed") {
      const before = await getAccountState(account.address);
      const evmBalance = await getEvmClient().getBalance({
        address: before.h160,
      });
      report.p4Before ??= { account: before, evmBalance };
      save();
      const evidence = await journal.step(
        "P4-value-movement",
        {
          to: ping.address,
          nativeValue: movementNative.toString(),
          evmValue: movementEvm.toString(),
        },
        account,
        async (options) => {
          const estimate = await buildReviveCall({
            signer: account,
            to: ping!.address,
            data: encodeFunctionData({ abi: pingAbi, functionName: "ping" }),
            value: movementEvm,
            abi: pingAbi,
          });
          const fee = await estimate.tx.getEstimatedFees(account.txCreator);
          await requireBudget(
            account,
            estimate.value + estimate.storage_deposit_limit + fee,
            keep,
          );
          return submitAndWatch(estimate.tx, account, options);
        },
      );
      const emitted = eventArgs(evidence, pingAbi, ping.address, "Pinged");
      if (BigInt(emitted.value as string | bigint) !== movementEvm)
        throw new Error(
          "P4 Ping event value differs from measured native-to-EVM conversion",
        );
      report.checks.P4 = {
        status: "passed",
        before: report.p4Before.account,
        evmBalanceBefore: report.p4Before.evmBalance,
        nativeValue: movementNative,
        emittedEvmValue: emitted.value,
        measuredRatio: movementEvm / movementNative,
        evidence,
        after: await getAccountState(account.address),
      };
      save();
    }
    const current = manifest();
    current.units = {
      nativeDecimals: 14,
      evmDecimals: 18,
      nativeToEthRatio: "10000",
      verified: true,
      evidence: report.checks.P4.evidence.txHash,
    };
    writeJson("deployments/portaldot-v3.json", current);
    if (!report.checks.P5) {
      try {
        const estimate = await buildReviveCall({
          signer: account,
          to: ping.address,
          data: encodeFunctionData({ abi: pingAbi, functionName: "ping" }),
          abi: pingAbi,
        });
        const schedulerTx = api.tx.Scheduler.schedule_after({
          after: 3,
          maybe_periodic: undefined,
          priority: 127,
          call: estimate.tx.decodedCall,
        });
        const fee = await schedulerTx.getEstimatedFees(account.txCreator);
        await requireBudget(
          account,
          fee + estimate.storage_deposit_limit,
          keep,
        );
        const evidence = await journal.step(
          "P5-schedule-ping",
          { to: ping.address, delayBlocks: 3 },
          account,
          (options) => submitAndWatch(schedulerTx, account, options),
        );
        const scheduled = evidence.events.find(
          (event) =>
            event.type === "Scheduler" && event.value.type === "Scheduled",
        );
        if (!scheduled)
          throw new Error(
            "Scheduler extrinsic confirmed without Scheduled event",
          );
        const task = scheduled.value.value as { when: number; index: number };
        report.checks.P5 = {
          status: "awaiting-dispatch",
          scheduled: evidence,
          task,
          futureWeight: estimate.weight_limit,
          storageLimit: estimate.storage_deposit_limit,
        };
        save();
      } catch (error) {
        if (!(error instanceof FinalizedDispatchError)) throw error;
        report.checks.P5 = {
          status: "unavailable",
          nativeSchedulerVerified: false,
          fallbackMode: "keeper",
          reason: error.message,
          evidence: error.evidence,
        };
        save();
      }
    }
    if (report.checks.P5?.status === "awaiting-dispatch") {
      const task = report.checks.P5.task as { when: number; index: number };
      const result = await waitUntil(
        "finalized scheduled Ping dispatch",
        async () => {
          const head = await getFinalizedHead();
          if (head.number < task.when) return undefined;
          for (
            let block = task.when;
            block <= Math.min(head.number, task.when + 30);
            block++
          ) {
            const blockHash = await getClient()._request<string>(
              "chain_getBlockHash",
              [block],
            );
            const records = await api.query.System.Events.getValue({
              at: blockHash,
            });
            const found = records.find(
              (record) =>
                record.event.type === "Scheduler" &&
                record.event.value.type === "Dispatched" &&
                record.event.value.value.task[0] === task.when &&
                record.event.value.value.task[1] === task.index,
            );
            if (
              found &&
              found.event.type === "Scheduler" &&
              found.event.value.type === "Dispatched"
            ) {
              const logs = await getLogs(pingAbi, ping!.address, block, block);
              return {
                block,
                blockHash,
                event: found,
                dispatchSuccess: found.event.value.value.result.success,
                pingEvents: logs.filter((log) => log.eventName === "Pinged"),
              };
            }
          }
          return undefined;
        },
      );
      const passed = result.dispatchSuccess && result.pingEvents.length > 0;
      report.checks.P5 = {
        ...report.checks.P5,
        status: passed ? "passed" : "unavailable",
        nativeSchedulerVerified: passed,
        cronpotExecutionBudgetVerified: false,
        dispatch: result,
        runtimeCodeHash: await getClient()._request<string>(
          "state_getStorageHash",
          ["0x3a636f6465"],
        ),
        note: "Ping proves signed scheduler eligibility only. Cronpot future-call gas/weight must still be verified separately.",
      };
      save();
    }
    if (!report.checks.P6) {
      const bytes = new TextEncoder()
        .encode("MeterMend funded TransactionStorage probe. ".repeat(30))
        .slice(0, 1024);
      const [byteFee, entryFee, retentionPeriod, maximum] = await Promise.all([
        api.query.TransactionStorage.ByteFee.getValue(),
        api.query.TransactionStorage.EntryFee.getValue(),
        api.query.TransactionStorage.RetentionPeriod.getValue(),
        api.constants.TransactionStorage.MaxTransactionSize(),
      ]);
      if (bytes.length !== 1024 || maximum < bytes.length)
        throw new Error("Probe bytes do not fit TransactionStorage");
      if (byteFee === undefined || entryFee === undefined)
        throw new Error("TransactionStorage fee configuration is unavailable");
      const storageFee = byteFee * BigInt(bytes.length) + entryFee;
      if (storageFee > amount("2", 14))
        throw new Error(
          `1KiB storage fee ${formatUnits(storageFee, 14)} tPOT exceeds the modest probe budget`,
        );
      const tx = api.tx.TransactionStorage.store({ data: bytes });
      const fee = await tx.getEstimatedFees(account.txCreator);
      await requireBudget(account, storageFee + fee, keep);
      try {
        const sha256 = createHash("sha256").update(bytes).digest("hex");
        const evidence = await journal.step(
          "P6-store-1KiB",
          { bytes: bytes.length, sha256 },
          account,
          (options) => submitAndWatch(tx, account, options),
        );
        const stored = evidence.events.find(
          (event) =>
            event.type === "TransactionStorage" &&
            event.value.type === "Stored",
        );
        if (!stored)
          throw new Error("Storage transaction confirmed without Stored event");
        report.checks.P6 = {
          status: "passed",
          bytes: bytes.length,
          sha256,
          storageFee,
          byteFee,
          entryFee,
          retentionPeriod,
          maximum,
          stored,
          evidence,
          note: "Native data expires unless renewed; retain application copies and permanent commitments.",
        };
        save();
      } catch (error) {
        if (!(error instanceof FinalizedDispatchError)) throw error;
        report.checks.P6 = {
          status: "unavailable",
          fallbackMode: "hash-only application storage",
          reason: error.message,
          evidence: error.evidence,
        };
        save();
      }
    }
    report.finalAccount = await getAccountState(account.address);
    save();
    console.log(
      json({
        artifact: "deployments/funded-probe.json",
        checks: Object.fromEntries(
          Object.entries(report.checks).map(([key, value]) => [
            key,
            (value as { status: string }).status,
          ]),
        ),
        nativeBalanceRemaining: report.finalAccount.nativeBalance,
      }),
    );
  } finally {
    journal.close();
  }
});
