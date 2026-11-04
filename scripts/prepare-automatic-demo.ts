import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Enum } from "polkadot-api";
import {
  encodeFunctionData,
  formatUnits,
  type Abi,
  type Address,
  type Hex,
} from "viem";
import {
  getAccountState,
  getApi,
  getFinalizedHead,
  readContract,
} from "../packages/chain/src/client";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
import {
  buildReviveCall,
  prepareBoundedReviveCall,
  submitAndWatch,
  type ChainSigner,
} from "../packages/chain/src/revive";
import { verifyProfileRuntime } from "../services/cronpot-relayer/src/preflight";
import {
  Journal,
  amount,
  contractEvents,
  eventArgs,
  flag,
  json,
  now,
  pathAt,
  readJson,
  run,
  signer,
  sleep,
  writeJson,
} from "./lib";
import { checkedNonce } from "./live-guards";

/** Prepare one explicitly recorded demonstration. Re-running recovers the same intents. */
await run(async () => {
  if (!flag("execute") || flag("retry-failed"))
    throw Error("Use --execute; automatic retries are forbidden");
  const deployed = readJson<any>("deployments/corrected-cronpot.json");
  if (deployed.status !== "deployed-and-readbacks-verified")
    throw Error("Verified corrected deployment required");
  const meter = deployed.meterMend as Address,
    cron = deployed.deployment.address as Address,
    oldCron = deployed.originalCronpot as Address;
  const keeper = signer("RELAYER"),
    renter = signer("RENTER"),
    operator = signer("DEPLOYER");
  const report = readJson<any>("deployments/demo-run.json"),
    c = report.correctedAutomation;
  if (!c || c.cronpot !== cron || c.meterMend !== meter)
    throw Error("Deployment/demo binding differs");
  if (c.status === "completed") {
    console.log("Automatic demonstration already complete; no transactions");
    return;
  }
  c.quotes ??= {};
  const save = () => {
    report.updatedAt = now();
    writeJson("deployments/demo-run.json", report);
  };
  const record = (key: string, receipt: any) => {
    c.transactions[key] = receipt;
    report.transactions[key] = receipt;
    save();
  };
  const journal = new Journal("deployments/corrected-automation-journal.json");
  try {
    const call = async (
      key: string,
      account: ChainSigner,
      to: Address,
      abi: Abi,
      fn: string,
      args: readonly unknown[],
      value = 0n,
      ceiling = "40",
    ) => {
      const data = encodeFunctionData({ abi, functionName: fn, args } as any);
      const intent = { to, data, value: value.toString() };
      let receipt = await journal.recover(key, intent, account);
      if (!receipt) {
        const sized = await buildReviveCall({
          signer: account,
          to,
          data,
          value,
          abi,
        });
        if (sized.storage_deposit_limit > amount(ceiling, 14))
          throw Error(
            `${key}: storage ceiling exceeded (${formatUnits(sized.storage_deposit_limit, 14)} tPOT)`,
          );
        const storageLimit =
          sized.storage_deposit_limit > 0n ? sized.storage_deposit_limit : 1n;
        const at = await getFinalizedHead();
        const bounded = await prepareBoundedReviveCall(
          { signer: account, to, data, value, abi },
          {
            weight_limit: { ref_time: 10000000000n, proof_size: 1048576n },
            storage_deposit_limit: storageLimit,
          },
          at,
        );
        const fee = await bounded.tx.getEstimatedFees(account.txCreator),
          state = await checkedNonce(account);
        if (
          fee > amount("1", 14) ||
          state.nativeBalance - state.nativeFrozen <
            sized.storage_deposit_limit +
              fee +
              value / 10000n +
              amount("0.1", 14)
        )
          throw Error(`${key}: fee/balance guard failed`);
        c.quotes[key] = {
          observedAt: now(),
          at,
          nonce: state.nonce,
          account: account.address,
          feeNative: fee,
          feeTPOT: formatUnits(fee, 14),
          storageLimitNative: sized.storage_deposit_limit,
          storageLimitTPOT: formatUnits(sized.storage_deposit_limit, 14),
          valueNative: value / 10000n,
          bounded: bounded.bounded,
        };
        save();
        console.log(
          json({
            preflight: key,
            feeTPOT: formatUnits(fee, 14),
            storageLimitTPOT: formatUnits(sized.storage_deposit_limit, 14),
            balanceTPOT: formatUnits(state.nativeBalance, 14),
          }),
        );
        receipt = await journal.step(
          key,
          intent,
          account,
          async (options) => {
            const fresh = await checkedNonce(account);
            if (fresh.nonce !== state.nonce)
              throw Error("Nonce changed after preparation");
            await verifyProfileRuntime(deployed.profile, fresh.blockHash);
            return submitAndWatch(bounded.tx, account, {
              ...options,
              nonce: state.nonce,
            });
          },
          { expectedNonce: state.nonce },
        );
      }
      record(key, receipt);
      return receipt;
    };
    if (!c.funding) {
      const state = await getAccountState(keeper.address);
      c.funding = {
        account: keeper.address,
        before: state.nativeBalance,
        targetNative: amount("60", 14),
        amountNative:
          state.nativeBalance < amount("60", 14)
            ? amount("60", 14) - state.nativeBalance
            : 0n,
      };
      save();
    }
    if (BigInt(c.funding.amountNative) > 0n) {
      const value = BigInt(c.funding.amountNative),
        intent = {
          to: keeper.address,
          value: value.toString(),
          target: "60tPOT",
        };
      let receipt = await journal.recover(
        "fund-corrected-keeper",
        intent,
        operator,
      );
      if (!receipt) {
        const state = await checkedNonce(operator),
          tx = getApi().tx.Balances.transfer_keep_alive({
            dest: Enum("Id", keeper.address),
            value,
          });
        const fee = await tx.getEstimatedFees(operator.txCreator);
        if (
          value > amount("60", 14) ||
          fee > amount("1", 14) ||
          state.nativeBalance - state.nativeFrozen <
            value + fee + amount("200", 14)
        )
          throw Error("Keeper funding cap failed");
        receipt = await journal.step(
          "fund-corrected-keeper",
          intent,
          operator,
          async (options) => {
            const last = await checkedNonce(operator);
            if (last.nonce !== state.nonce)
              throw Error("Funding nonce changed");
            return submitAndWatch(tx, operator, {
              ...options,
              nonce: state.nonce,
            });
          },
          { expectedNonce: state.nonce },
        );
      }
      record("fund-corrected-keeper", receipt);
    }
    if (!c.renterFunding) {
      const state = await getAccountState(renter.address);
      c.renterFunding = {
        account: renter.address,
        before: state.nativeBalance,
        targetNative: amount("40", 14),
        amountNative:
          state.nativeBalance < amount("40", 14)
            ? amount("40", 14) - state.nativeBalance
            : 0n,
      };
      save();
    }
    if (BigInt(c.renterFunding.amountNative) > 0n) {
      const value = BigInt(c.renterFunding.amountNative),
        intent = {
          to: renter.address,
          value: value.toString(),
          target: "40tPOT",
        };
      let receipt = await journal.recover(
        "fund-automatic-renter",
        intent,
        operator,
      );
      if (!receipt) {
        const state = await checkedNonce(operator),
          tx = getApi().tx.Balances.transfer_keep_alive({
            dest: Enum("Id", renter.address),
            value,
          });
        const fee = await tx.getEstimatedFees(operator.txCreator);
        if (
          value > amount("40", 14) ||
          fee > amount("1", 14) ||
          state.nativeBalance - state.nativeFrozen <
            value + fee + amount("200", 14)
        )
          throw Error("Renter funding cap failed");
        receipt = await journal.step(
          "fund-automatic-renter",
          intent,
          operator,
          async (options) => {
            const last = await checkedNonce(operator);
            if (last.nonce !== state.nonce)
              throw Error("Funding nonce changed");
            return submitAndWatch(tx, operator, {
              ...options,
              nonce: state.nonce,
            });
          },
          { expectedNonce: state.nonce },
        );
      }
      record("fund-automatic-renter", receipt);
    }
    if (!c.before) {
      c.before = {
        item: await readContract(meterMendAbi, meter, "items", [1n]),
        keeper: await getAccountState(keeper.address),
        renter: await getAccountState(renter.address),
      };
      save();
    }
    const rented = await call(
      "automatic-rent",
      renter,
      meter,
      meterMendAbi,
      "rent",
      [1n],
      amount("0.06"),
      "40",
    );
    const rentalId = BigInt(
      eventArgs(rented, meterMendAbi, meter, "Rented").rentalId as bigint,
    );
    c.rentalId = rentalId;
    save();
    if (!c.rentReadback) {
      const item = await readContract<any[]>(meterMendAbi, meter, "items", [
        1n,
      ]);
      if (item[8] !== BigInt(c.before.item[8]) + amount("0.002"))
        throw Error("New rental reserve split differs");
      c.rentReadback = { item, reserveIncrease: amount("0.002") };
      save();
    }
    const bytes = readFileSync(pathAt("scripts/fixtures/return.png"));
    const evidenceHash =
      `0x${createHash("sha256").update(bytes).digest("hex")}` as Hex;
    c.returnEvidence = {
      hash: evidenceHash,
      source: "scripts/fixtures/return.png",
      fixture: true,
      nativeUpload: false,
      bytes: bytes.length,
    };
    const returned = await call(
      "automatic-return",
      operator,
      meter,
      meterMendAbi,
      "markReturned",
      [rentalId, evidenceHash],
      amount("0.001"),
    );
    const returnedArgs = eventArgs(returned, meterMendAbi, meter, "Returned");
    const rental = await readContract<any[]>(meterMendAbi, meter, "rentals", [
      rentalId,
    ]);
    c.refundAt = rental[4];
    c.oldJobId = rental[6];
    c.returned = returnedArgs;
    save();
    const data = encodeFunctionData({
      abi: meterMendAbi,
      functionName: "finalizeRefund",
      args: [rentalId],
    });
    const scheduled = await call(
      "corrected-job-schedule",
      keeper,
      cron,
      cronpotAbi,
      "schedule",
      [meter, data, BigInt(c.refundAt)],
      amount("0.001"),
      "35",
    );
    const jobId = BigInt(
      eventArgs(scheduled, cronpotAbi, cron, "JobScheduled").jobId as bigint,
    );
    c.jobId = jobId;
    c.status = "scheduled-awaiting-original-job-failure";
    save();
    const oldJobId = BigInt(c.oldJobId);
    while (true) {
      const stamp = await getApi().query.Timestamp.Now.getValue();
      if (stamp / 1000n >= BigInt(c.refundAt)) break;
      console.log(
        json({ waitingForRefundAt: c.refundAt, chainTimestamp: stamp / 1000n }),
      );
      await sleep(10000);
    }
    const failed = await call(
      "original-cronpot-failed-new-rental",
      keeper,
      oldCron,
      cronpotAbi,
      "execute",
      [oldJobId],
      0n,
      "25",
    );
    const event = eventArgs(failed, cronpotAbi, oldCron, "JobExecuted");
    const stillReturned = await readContract<any[]>(
      meterMendAbi,
      meter,
      "rentals",
      [rentalId],
    );
    if (
      event.success !== false ||
      stillReturned[5] !== 2 ||
      stillReturned[2] !== amount("0.05") ||
      contractEvents(failed, meterMendAbi, meter).some(
        (e) => e.eventName === "DepositRefunded",
      )
    )
      throw Error(
        "Original callback failure expectation differs; stop and record actual outcome",
      );
    c.originalFailure = {
      ...failed,
      callbackSuccess: false,
      event,
      reason: "Callback failed; exact native trace pending",
      rentalAfter: stillReturned,
    };
    c.status = "ready-for-corrected-keeper";
    save();
    console.log(
      json({
        status: c.status,
        rentalId,
        jobId,
        oldJobId,
        refundAt: c.refundAt,
      }),
    );
  } finally {
    journal.close();
  }
});
