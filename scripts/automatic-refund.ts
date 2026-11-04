import { resolve } from "node:path";
import { decodeFunctionData, encodeFunctionData, type Address } from "viem";
import {
  getAccountState,
  getApi,
  getFinalizedHead,
  readContract,
} from "../packages/chain/src/client";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
import {
  prepareBoundedReviveCall,
  submitAndWatch,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
import { verifyProfileRuntime } from "../services/cronpot-relayer/src/preflight";
import {
  prepareExternalKeeperRefund,
  type ExternalChainJob,
} from "./external-keeper-preflight";
import {
  Journal,
  amount,
  eventArgs,
  flag,
  json,
  now,
  option,
  pathAt,
  readJson,
  run,
  signer,
  sleep,
  writeJson,
} from "./lib";
import { checkedNonce } from "./live-guards";

type Rental = readonly [
  bigint,
  Address,
  bigint,
  bigint,
  bigint,
  number,
  bigint,
];
type DirectIntent = {
  type: "direct-refund";
  cronpot: Address;
  meterMend: Address;
  rentalId: string;
  data: `0x${string}`;
  value: "0";
  expected: {
    itemId: string;
    renter: Address;
    deposit: string;
    refundAt: string;
  };
};

export function correctedRefundRentalId(
  job: ExternalChainJob,
  meterMend: Address,
): bigint | null {
  if (job.target.toLowerCase() !== meterMend.toLowerCase()) return null;
  try {
    const decoded = decodeFunctionData({ abi: meterMendAbi, data: job.data });
    if (decoded.functionName !== "finalizeRefund" || !decoded.args?.length)
      return null;
    const rentalId = BigInt(decoded.args[0] as bigint);
    if (
      rentalId <= 0n ||
      job.data.toLowerCase() !==
        encodeFunctionData({
          abi: meterMendAbi,
          functionName: "finalizeRefund",
          args: [rentalId],
        }).toLowerCase()
    )
      return null;
    return rentalId;
  } catch {
    return null;
  }
}

export function directRefundEligibility(
  rental: Rental,
  finalizedTimestamp: bigint,
  activeCorrectedJob: boolean,
  recordingProof: boolean,
): string | null {
  if (recordingProof)
    return "Direct fallback disabled during corrected Cronpot proof";
  if (rental[5] !== 2 || rental[2] <= 0n)
    return "Rental is not Returned with a held deposit";
  if (rental[4] <= 0n || finalizedTimestamp < rental[4])
    return "Refund window has not elapsed at finality";
  if (activeCorrectedJob)
    return "An active corrected Cronpot job owns this refund attempt";
  return null;
}

export function assertDirectRefundResult(
  intent: DirectIntent,
  refunded: Record<string, unknown>,
  after: Rental,
) {
  if (
    String(refunded.rentalId) !== intent.rentalId ||
    String(refunded.itemId) !== intent.expected.itemId ||
    String(refunded.renter).toLowerCase() !==
      intent.expected.renter.toLowerCase() ||
    String(refunded.amount) !== intent.expected.deposit ||
    String(after[0]) !== intent.expected.itemId ||
    after[1].toLowerCase() !== intent.expected.renter.toLowerCase() ||
    after[5] !== 4 ||
    after[2] !== 0n
  )
    throw Error(
      "Direct refund receipt/readback does not match the exact held deposit and renter",
    );
}

/** Executes corrected jobs and eligible direct fallbacks. Never deploys or silently retries. */
await run(async () => {
  if (!flag("keeper-only") || flag("retry-failed"))
    throw Error("Use --keeper-only; retries require explicit reconciliation");
  process.env.RELAYER_SEED =
    process.env.KEEPER_SEED || process.env.RELAYER_SEED;
  process.env.CHAIN_TIMEOUT_MS ??= option("timeout-ms", "120000");
  const keeper = signer("RELAYER");
  const deployed = readJson<any>("deployments/corrected-cronpot.json");
  if (deployed.status !== "deployed-and-readbacks-verified")
    throw Error("Verified corrected Cronpot deployment required");
  const cron = deployed.deployment.address as Address,
    meter = deployed.meterMend as Address,
    oldCron = deployed.originalCronpot as Address;
  const directory = resolve(
    process.env.DATA_DIR || pathAt("data/corrected-keeper"),
  );
  const journal = new Journal(
    resolve(directory, "corrected-keeper-journal.json"),
  );
  writeJson(journal.path, journal.data);
  const statusPath = resolve(directory, "automatic-refund-status.json");
  const status: any = {
    schemaVersion: 1,
    status: "starting",
    observedAt: now(),
    cronpot: cron,
    meterMend: meter,
    keeper: keeper.address,
    jobs: [],
    executedJobs: [],
    rentals: [],
    directRefunds: [],
    directFallbackEnabled: !flag("record-proof"),
  };
  const save = () => {
    status.observedAt = now();
    writeJson(statusPath, status);
  };
  save();
  const record = async (
    jobId: bigint,
    rentalId: bigint,
    receipt: TransactionEvidence,
  ) => {
    const executed = eventArgs(receipt, cronpotAbi, cron, "JobExecuted");
    const refunded = eventArgs(receipt, meterMendAbi, meter, "DepositRefunded");
    if (
      executed.success !== true ||
      BigInt(executed.jobId as bigint) !== jobId ||
      BigInt(refunded.rentalId as bigint) !== rentalId
    )
      throw Error(
        "Finalized transaction lacks matching successful job/refund events",
      );
    const after = await readContract<any[]>(meterMendAbi, meter, "rentals", [
      rentalId,
    ]);
    if (after[5] !== 4 || after[2] !== 0n)
      throw Error("Finalized rental readback is not closed with zero deposit");
    const result = {
      jobId: jobId.toString(),
      rentalId: rentalId.toString(),
      txHash: receipt.txHash,
      block: receipt.block,
    };
    if (!status.executedJobs.some((x: any) => x.txHash === receipt.txHash))
      status.executedJobs.push(result);
    save();
    if (flag("record-proof")) {
      const demo = readJson<any>("deployments/demo-run.json"),
        c = demo.correctedAutomation;
      if (
        c.cronpot !== cron ||
        BigInt(c.jobId) !== jobId ||
        BigInt(c.rentalId) !== rentalId
      )
        throw Error("Proof binding differs");
      const preflight = readJson<any>(resolve(directory, "preflight.json"));
      writeJson(
        "deployments/corrected-keeper-execution-preflight.json",
        preflight,
      );
      writeJson(
        "deployments/corrected-keeper-execution-journal.json",
        journal.data,
      );
      c.transactions["corrected-keeper-execute"] = receipt;
      demo.transactions["corrected-keeper-execute"] = receipt;
      c.execution = {
        ...receipt,
        jobExecuted: executed,
        depositRefunded: refunded,
      };
      c.after = {
        rental: after,
        item: await readContract(meterMendAbi, meter, "items", [after[0]]),
        keeper: await getAccountState(keeper.address),
      };
      c.status = "completed";
      c.completedAt = now();
      c.proof =
        "JobExecuted(success=true) and DepositRefunded emitted by the same finalized corrected-Cronpot execution";
      demo.updatedAt = now();
      writeJson("deployments/demo-run.json", demo);
    }
    console.log(
      json({
        status: "automatic-refund-finalized",
        ...result,
        callbackSuccess: true,
      }),
    );
  };
  const recordDirect = async (
    intent: DirectIntent,
    receipt: TransactionEvidence,
  ) => {
    if (flag("record-proof"))
      throw Error("Direct fallback cannot record corrected Cronpot proof");
    const refunded = eventArgs(receipt, meterMendAbi, meter, "DepositRefunded");
    const after = await readContract<Rental>(meterMendAbi, meter, "rentals", [
      BigInt(intent.rentalId),
    ]);
    assertDirectRefundResult(intent, refunded, after);
    const result = {
      mode: "permissionless-direct-fallback",
      status: "direct-refund-finalized",
      rentalId: intent.rentalId,
      txHash: receipt.txHash,
      block: receipt.block,
      blockHash: receipt.blockHash,
      depositRefunded: refunded,
      returnedStatusBefore: 2,
      refundAt: intent.expected.refundAt,
      rentalStatusAfter: after[5],
      depositAfter: after[2].toString(),
      automaticCronpotRefund: false,
    };
    if (!status.directRefunds.some((x: any) => x.txHash === receipt.txHash))
      status.directRefunds.push(result);
    save();
    console.log(json(result));
  };
  try {
    // Reconcile all previously signed intents before inspecting or creating another one.
    for (const [key, entry] of Object.entries(journal.data.steps)) {
      const intent = entry.intent as any;
      if (
        intent.cronpot !== cron ||
        intent.meterMend !== meter ||
        entry.signer !== keeper.address
      )
        throw Error(
          "Restored keeper journal belongs to another deployment/account",
        );
      if (intent.type !== undefined && intent.type !== "direct-refund")
        throw Error("Unknown restored keeper intent type");
      const receipt = await journal.recover(key, intent, keeper);
      if (receipt) {
        if (intent.type === "direct-refund") {
          // Reconciliation is mandatory even in proof mode, but never labels a direct receipt as a Cronpot job.
          if (!flag("record-proof")) await recordDirect(intent, receipt);
        } else
          await record(BigInt(intent.jobId), BigInt(intent.rentalId), receipt);
      }
    }
    do {
      const at = await getFinalizedHead(),
        account = await getAccountState(keeper.address);
      await verifyProfileRuntime(deployed.profile, at.hash);
      const next = await readContract<bigint>(
        cronpotAbi,
        cron,
        "nextJobId",
        [],
        { at },
      );
      if (next > 10000n) throw Error("Job scan exceeds explicit safety bound");
      const timestamp = await getApi().query.Timestamp.Now.getValue({
        at: at.hash,
      });
      status.jobs = [];
      status.rentals = [];
      const activeCorrectedRentals = new Set<string>();
      let submittedThisSnapshot = false;
      for (let jobId = 1n; jobId < next; jobId++) {
        const job = await readContract<ExternalChainJob>(
          cronpotAbi,
          cron,
          "getJob",
          [jobId],
          { at },
        );
        const rentalId = correctedRefundRentalId(job, meter);
        if (rentalId === null) continue;
        const key = `execute-${cron}-${jobId}`;
        if (job.status === 1) activeCorrectedRentals.add(rentalId.toString());
        if (job.owner.toLowerCase() !== account.h160.toLowerCase()) continue;
        const row: any = {
          jobId: jobId.toString(),
          rentalId: rentalId.toString(),
          status:
            job.status === 2
              ? "executed-on-chain"
              : job.status === 4
                ? "failed-on-chain"
                : job.status === 3
                  ? "cancelled"
                  : "scheduled",
          executeAfter: job.executeAfter.toString(),
        };
        status.jobs.push(row);
        save();
        if (job.status !== 1 || journal.data.steps[key]?.state === "confirmed")
          continue;
        if (timestamp / 1000n < job.executeAfter) {
          row.reason = "Refund window has not elapsed";
          continue;
        }
        const rental = await readContract<any[]>(
          meterMendAbi,
          meter,
          "rentals",
          [rentalId],
        );
        if (rental[5] !== 2 || rental[2] === 0n) {
          row.status = "skipped";
          row.reason = "Rental is no longer awaiting an undisputed refund";
          continue;
        }
        const oldJobId = BigInt(rental[6]);
        const oldJob = await readContract<ExternalChainJob>(
          cronpotAbi,
          oldCron,
          "getJob",
          [oldJobId],
        );
        if (oldJob.status !== 4) {
          row.status = "waiting-for-original-job";
          row.reason =
            "Original job failure is required by this external recovery integration";
          continue;
        }
        const intent = {
          cronpot: cron,
          meterMend: meter,
          jobId: jobId.toString(),
          rentalId: rentalId.toString(),
          data: encodeFunctionData({
            abi: cronpotAbi,
            functionName: "execute",
            args: [jobId],
          }),
        };
        const prepared = await prepareExternalKeeperRefund({
          profile: deployed.profile,
          signer: keeper,
          jobId,
          rentalId,
          oldCronpot: oldCron,
          oldJobId,
        });
        writeJson(resolve(directory, "preflight.json"), prepared.evidence);
        console.log(
          json({
            stage: "bounded-native-and-trace-passed",
            jobId,
            rentalId,
            observedAt: prepared.evidence.observedAt,
          }),
        );
        const nonce = await checkedNonce(keeper);
        if (nonce.nonce !== prepared.evidence.account.nonce)
          throw Error("Keeper nonce changed after preflight");
        const receipt = await journal.step(
          key,
          intent,
          keeper,
          async (options) => {
            const last = await checkedNonce(keeper);
            if (last.nonce !== nonce.nonce)
              throw Error("Keeper nonce changed before signing");
            await verifyProfileRuntime(deployed.profile, last.blockHash);
            return submitAndWatch(prepared.tx, keeper, {
              ...options,
              nonce: nonce.nonce,
            });
          },
          { expectedNonce: nonce.nonce },
        );
        await record(jobId, rentalId, receipt);
        row.status = "executed";
        row.txHash = receipt.txHash;
        row.block = receipt.block;
        submittedThisSnapshot = true;
        // A fresh invocation/snapshot is required before any additional execution.
        break;
      }
      // App returns use MeterMend's immutable original Cronpot. A direct permissionless
      // fallback avoids paying for another job registration for every ordinary rental.
      // Never run this branch during the separately recorded corrected-Cronpot proof.
      if (!flag("record-proof") && !submittedThisSnapshot) {
        const nextRental = await readContract<bigint>(
          meterMendAbi,
          meter,
          "nextRentalId",
          [],
          { at },
        );
        if (nextRental > 1001n)
          throw Error(
            "Direct refund rental scan exceeds explicit safety bound",
          );
        for (let rentalId = 1n; rentalId < nextRental; rentalId++) {
          const rental = await readContract<Rental>(
            meterMendAbi,
            meter,
            "rentals",
            [rentalId],
            { at },
          );
          if (rental[5] !== 2) continue;
          const key = `direct-refund-${meter}-${rentalId}`;
          const reason = directRefundEligibility(
            rental,
            timestamp / 1000n,
            activeCorrectedRentals.has(String(rentalId)),
            false,
          );
          const row: any = {
            rentalId: String(rentalId),
            mode: "permissionless-direct-fallback",
            returnedStatus: rental[5],
            deposit: String(rental[2]),
            refundAt: String(rental[4]),
            finalizedTimestamp: String(timestamp / 1000n),
            snapshotBlock: at.number,
            status: reason ? "skipped" : "eligible",
            reason,
          };
          status.rentals.push(row);
          save();
          if (reason) continue;
          if (journal.data.steps[key]) {
            // Restored entries were reconciled above; never create a second attempt.
            row.status = "already-recorded";
            continue;
          }
          const intent: DirectIntent = {
            type: "direct-refund",
            cronpot: cron,
            meterMend: meter,
            rentalId: String(rentalId),
            data: encodeFunctionData({
              abi: meterMendAbi,
              functionName: "finalizeRefund",
              args: [rentalId],
            }),
            value: "0",
            expected: {
              itemId: String(rental[0]),
              renter: rental[1],
              deposit: String(rental[2]),
              refundAt: String(rental[4]),
            },
          };
          const prepared = await prepareBoundedReviveCall(
            {
              signer: keeper,
              to: meter,
              data: intent.data,
              value: 0n,
              abi: meterMendAbi,
            },
            {
              weight_limit: { ref_time: 10000000000n, proof_size: 1048576n },
              storage_deposit_limit: amount("5", 14),
            },
            at,
          );
          const fee = await prepared.tx.getEstimatedFees(keeper.txCreator);
          const storage =
            prepared.bounded.max_storage_deposit.type === "Charge"
              ? prepared.bounded.max_storage_deposit.value
              : 0n;
          const nonce = await checkedNonce(keeper);
          const existentialDeposit =
            await getApi().constants.Balances.ExistentialDeposit({
              at: nonce.blockHash,
            });
          const retain = [
            nonce.nativeFrozen,
            existentialDeposit,
            amount("0.1", 14),
          ].reduce((a, b) => (a > b ? a : b));
          if (
            !nonce.mapped ||
            fee > amount("0.1", 14) ||
            storage > amount("5", 14) ||
            nonce.nativeBalance < retain + storage + fee
          )
            throw Error(
              "Direct fallback mapping, fee/storage cap or minimum retained balance guard failed",
            );
          const preflight = {
            kind: "permissionless-direct-refund",
            observedAt: now(),
            at,
            intent,
            returnedStatus: rental[5],
            finalizedTimestamp: timestamp / 1000n,
            bounded: prepared.bounded,
            caps: prepared.caps,
            nonce: nonce.nonce,
            feeNative: fee,
            maximumStorageNative: storage,
            retainedNative: retain,
            signedTransactions: 0,
          };
          writeJson(resolve(directory, "preflight.json"), preflight);
          row.preflight = preflight;
          save();
          // Recheck jobs registered while the simulation ran. Existing jobs cannot
          // return to Scheduled, so only newly allocated IDs can introduce a conflict.
          const freshJobsAt = await getFinalizedHead();
          const freshNext = await readContract<bigint>(
            cronpotAbi,
            cron,
            "nextJobId",
            [],
            { at: freshJobsAt },
          );
          if (freshNext < next || freshNext > 10000n)
            throw Error("Corrected job range changed unexpectedly");
          let newActiveJob = false;
          for (let newJobId = next; newJobId < freshNext; newJobId++) {
            const newJob = await readContract<ExternalChainJob>(
              cronpotAbi,
              cron,
              "getJob",
              [newJobId],
              { at: freshJobsAt },
            );
            if (
              newJob.status === 1 &&
              correctedRefundRentalId(newJob, meter) === rentalId
            )
              newActiveJob = true;
          }
          if (newActiveJob) {
            row.status = "skipped";
            row.reason =
              "A corrected Cronpot job was registered during direct preflight";
            continue;
          }
          const receipt = await journal.step(
            key,
            intent,
            keeper,
            async (options) => {
              const last = await checkedNonce(keeper);
              if (last.nonce !== nonce.nonce)
                throw Error("Direct fallback nonce changed before signing");
              await verifyProfileRuntime(deployed.profile, last.blockHash);
              const freshAt = await getFinalizedHead();
              const fresh = await readContract<Rental>(
                meterMendAbi,
                meter,
                "rentals",
                [rentalId],
                { at: freshAt },
              );
              const ineligible = directRefundEligibility(
                fresh,
                freshAt.timestamp,
                false,
                flag("record-proof"),
              );
              if (
                ineligible ||
                fresh[2] !== rental[2] ||
                fresh[1].toLowerCase() !== rental[1].toLowerCase() ||
                fresh[4] !== rental[4]
              )
                throw Error(
                  ineligible ??
                    "Direct fallback rental changed after preflight",
                );
              if (last.nativeBalance < retain + storage + fee)
                throw Error("Direct fallback balance changed before signing");
              return submitAndWatch(prepared.tx, keeper, {
                ...options,
                nonce: nonce.nonce,
              });
            },
            { expectedNonce: nonce.nonce },
          );
          await recordDirect(intent, receipt);
          row.status = "direct-refund-finalized";
          row.txHash = receipt.txHash;
          row.block = receipt.block;
          // One write per snapshot/invocation; the next pass observes fresh finalized state.
          submittedThisSnapshot = true;
          break;
        }
      }
      status.status =
        status.executedJobs.length || status.directRefunds.length
          ? "completed"
          : "idle";
      save();
      console.log(
        json({
          status: status.status,
          jobs: status.jobs,
          executedJobs: status.executedJobs,
          rentals: status.rentals,
          directRefunds: status.directRefunds,
        }),
      );
      if (flag("once")) break;
      await sleep(Math.max(1000, Number(option("poll-ms", "10000"))));
    } while (true);
  } catch (error) {
    status.status = "blocked";
    status.errors = [error instanceof Error ? error.message : String(error)];
    save();
    throw error;
  } finally {
    journal.close();
  }
});
