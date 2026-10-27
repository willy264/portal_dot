import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { encodeFunctionData, type Abi, type Address, type Hex } from "viem";
import {
  getFinalizedHead,
  getLogs,
  h160Of,
  readContract,
} from "../packages/chain/src/client";
import {
  buildReviveCall,
  storeEvidence,
  submitAndWatch,
  type ChainSigner,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
import { NATIVE_TO_EVM_RATIO } from "../packages/chain/src/units";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
import {
  Journal,
  amount,
  eventArgs,
  json,
  manifest,
  now,
  option,
  pathAt,
  readJson,
  requireBudget,
  requireContract,
  run,
  signer,
  waitUntil,
  writeJson,
} from "./lib";

type Item = readonly [
  Address,
  Address,
  bigint,
  bigint,
  number,
  number,
  boolean,
  boolean,
  bigint,
  string,
];
type Rental = readonly [
  bigint,
  Address,
  bigint,
  bigint,
  bigint,
  number,
  bigint,
];
type Report = {
  schemaVersion: number;
  network: string;
  contract: Address;
  startedAt: string;
  updatedAt?: string;
  completedAt?: string;
  context: Record<string, any>;
  transactions: Record<string, TransactionEvidence>;
  assertions: Record<string, unknown>;
  automaticRefund?: unknown;
};

await run(async () => {
  const meter = requireContract("MeterMend");
  const cron = requireContract("Cronpot");
  if (!(manifest().units as { verified?: boolean } | undefined)?.verified)
    throw new Error("Funded P4 unit verification must precede the live demo");
  const operator = signer("DEPLOYER");
  const renter = signer("RENTER");
  const arbiter = signer("ARBITER");
  const relayer = signer("RELAYER");
  const relayerUrl = (
    process.env.RELAYER_URL ?? "http://localhost:8787"
  ).replace(/\/$/, "");
  const healthResponse = await fetch(`${relayerUrl}/health`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!healthResponse.ok)
    throw new Error(`Relayer health returned HTTP ${healthResponse.status}`);
  const health = (await healthResponse.json()) as {
    configured?: boolean;
    signer?: string;
    mode?: string;
    error?: string | null;
  };
  if (!health.configured || health.signer !== relayer.address || health.error)
    throw new Error(
      "Start the funded configured relayer before the live demo; the demo does not manually finalize the automatic-refund step",
    );
  const seed = readJson<{ items: { camera: { itemId: string } } }>(
    "deployments/seed.json",
  );
  const itemId = BigInt(option("item", seed.items.camera.itemId)!);
  const report = readJson<Report>("deployments/demo-run.json", {
    schemaVersion: 1,
    network: "portaldot-v3-testnet",
    contract: meter.address,
    startedAt: now(),
    context: {},
    transactions: {},
    assertions: {},
  });
  if (report.contract.toLowerCase() !== meter.address.toLowerCase())
    throw new Error("Demo journal belongs to another deployment");
  if (report.completedAt) {
    console.log(
      "This real demo is already complete; its proof is preserved. No transactions submitted.",
    );
    return;
  }
  const save = () => {
    report.updatedAt = now();
    writeJson("deployments/demo-run.json", report);
  };
  report.context.itemId ??= itemId.toString();
  if (BigInt(report.context.itemId) !== itemId)
    throw new Error("Cannot change item inside a resumed demo");
  const journal = new Journal("deployments/demo-journal.json");
  const getItem = () =>
    readContract<Item>(meterMendAbi, meter.address, "items", [itemId]);
  const getRental = (id: bigint) =>
    readContract<Rental>(meterMendAbi, meter.address, "rentals", [id]);
  const verify = async (key: string, check: () => Promise<unknown>) => {
    if (report.assertions[key]) return;
    const values = await check();
    const head = await getFinalizedHead();
    report.assertions[key] = {
      passed: true,
      observedAt: now(),
      at: head,
      values,
    };
    save();
  };
  const call = async (
    key: string,
    account: ChainSigner,
    fn: string,
    args: readonly unknown[],
    value = 0n,
  ) => {
    const data = encodeFunctionData({
      abi: meterMendAbi as Abi,
      functionName: fn,
      args,
    });
    const evidence = await journal.step(
      key,
      { to: meter.address, data, value: value.toString() },
      account,
      async (options) => {
        const estimate = await buildReviveCall({
          signer: account,
          to: meter.address,
          data,
          value,
          abi: meterMendAbi,
        });
        const fee = await estimate.tx.getEstimatedFees(account.txCreator);
        await requireBudget(
          account,
          estimate.value + estimate.storage_deposit_limit + fee,
          amount("2", 14),
        );
        return submitAndWatch(estimate.tx, account, options);
      },
    );
    report.transactions[key] = evidence;
    save();
    return evidence;
  };
  const evidenceFor = async (
    key: string,
    imageOption: string,
    fixture: string,
  ): Promise<Hex> => {
    report.context.evidence ??= {};
    const supplied = option(imageOption);
    const source = supplied ?? `scripts/fixtures/${fixture}.png`;
    const bytes = new Uint8Array(readFileSync(pathAt(source)));
    if (bytes.length > 64 * 1024)
      throw new Error(
        `${source} exceeds 64KiB; provide a final compressed thumbnail and preserve those exact bytes`,
      );
    const png =
      bytes.length >= 8 &&
      Buffer.from(bytes.slice(0, 8)).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      );
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp =
      Buffer.from(bytes.slice(0, 4)).toString() === "RIFF" &&
      Buffer.from(bytes.slice(8, 12)).toString() === "WEBP";
    if (!png && !jpeg && !webp)
      throw new Error("Evidence must be a PNG, JPEG or WebP image");
    const digest = createHash("sha256").update(bytes).digest("hex");
    const committed = `0x${digest}` as Hex;
    const previous = report.context.evidence[key];
    if (previous) {
      if (previous.hash !== committed)
        throw new Error(`Evidence bytes changed for resumed stage ${key}`);
      return committed;
    }
    const directory = pathAt("data/evidence");
    mkdirSync(directory, { recursive: true });
    writeFileSync(`${directory}/${digest}`, bytes);
    if (process.env.EVIDENCE_BACKEND_TOKEN) {
      const url = (process.env.EVIDENCE_BACKEND_URL ?? relayerUrl).replace(
        /\/$/,
        "",
      );
      const response = await fetch(`${url}/api/evidence`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EVIDENCE_BACKEND_TOKEN}`,
          "X-Content-SHA256": committed,
          "Content-Type": png
            ? "image/png"
            : jpeg
              ? "image/jpeg"
              : "image/webp",
        },
        body: bytes,
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok)
        throw new Error(
          `Evidence backup upload failed with HTTP ${response.status}`,
        );
      const uploaded = (await response.json()) as { hash: string };
      if (uploaded.hash.toLowerCase() !== committed)
        throw new Error("Evidence backend returned an unexpected commitment");
    }
    const p6 = readJson<{ checks: { P6?: { status: string } } }>(
      "deployments/funded-probe.json",
      { checks: {} },
    );
    let storage: TransactionEvidence | undefined;
    if (p6.checks.P6?.status === "passed") {
      storage = await journal.step(
        `store-evidence-${key}`,
        { hash: committed, bytes: bytes.length },
        operator,
        (options) => storeEvidence({ signer: operator, bytes, ...options }),
      );
      report.transactions[`store-evidence-${key}`] = storage;
    }
    const stored = storage?.events.find(
      (event) =>
        event.type === "TransactionStorage" && event.value.type === "Stored",
    );
    report.context.evidence[key] = {
      hash: committed,
      bytes: bytes.length,
      source,
      fixture: !supplied,
      provenance: supplied
        ? "Operator-supplied image; no automatic claim about physical truth."
        : "Locally rendered image marked DEMO FIXTURE, not evidence of an actual physical rental or repair.",
      mode: storage
        ? "native-transaction-storage-with-application-backup"
        : "application-storage",
      storage: stored
        ? {
            ...storage,
            storageIndex: stored.value.value.index,
            storageContentHash: stored.value.value.content_hash,
          }
        : undefined,
    };
    save();
    return committed;
  };
  try {
    const initial = await getItem();
    if (!report.context.terms) {
      const [operatorH160, renterH160, arbiterH160, relayerH160] =
        await Promise.all([
          h160Of(operator.address),
          h160Of(renter.address),
          h160Of(arbiter.address),
          h160Of(relayer.address),
        ]);
      if (
        initial[0].toLowerCase() !== operatorH160.toLowerCase() ||
        initial[1].toLowerCase() !== arbiterH160.toLowerCase()
      )
        throw new Error(
          "Configured demo identities do not own this item and arbitration role",
        );
      if (new Set([operatorH160, renterH160, arbiterH160]).size !== 3)
        throw new Error("Operator, renter and arbiter must differ");
      report.context.terms = {
        fee: initial[2].toString(),
        deposit: initial[3].toString(),
        reserveBps: initial[4],
        disputeWindow: initial[5],
        reserveBefore: initial[8].toString(),
      };
      report.context.roles = {
        operator: operatorH160,
        renter: renterH160,
        arbiter: arbiterH160,
        relayer: relayerH160,
        repairer: renterH160,
      };
      report.context.repairerNote =
        "The demo renter separately acts as the repair provider; payment still requires the independent arbiter.";
      report.context.relayerMode = health.mode;
      save();
    }
    const terms = report.context.terms as {
      fee: string;
      deposit: string;
      reserveBps: number;
      disputeWindow: number;
      reserveBefore: string;
    };
    const fee = BigInt(terms.fee);
    const deposit = BigInt(terms.deposit);
    const contribution = (fee * BigInt(terms.reserveBps)) / 10_000n;
    const tip = await readContract<bigint>(
      meterMendAbi,
      meter.address,
      "cronTip",
    );
    const first = await call(
      "rent-first",
      renter,
      "rent",
      [itemId],
      fee + deposit,
    );
    const firstRental = BigInt(
      eventArgs(first, meterMendAbi, meter.address, "Rented")
        .rentalId as bigint,
    );
    await verify("first-rental-reserve-split", async () => {
      const reserve = (await getItem())[8];
      const expected = BigInt(terms.reserveBefore) + contribution;
      if (reserve !== expected)
        throw new Error(
          "First rental reserve split differs from expected value",
        );
      return { fee, contribution, reserve, expected, rentalId: firstRental };
    });
    const evidenceHash = await evidenceFor(
      "return-first",
      "return-photo",
      "return",
    );
    const returned = await call(
      "return-first",
      operator,
      "markReturned",
      [firstRental, evidenceHash],
      tip,
    );
    const returnedArgs = eventArgs(
      returned,
      meterMendAbi,
      meter.address,
      "Returned",
    );
    const firstJob = BigInt(returnedArgs.cronJobId as bigint);
    if (!report.automaticRefund) {
      const observed = await waitUntil(
        "the configured relayer to execute the automatic refund",
        async () => {
          const rental = await getRental(firstRental);
          if (rental[5] !== 4) return undefined;
          const head = await getFinalizedHead();
          const logs = await getLogs(
            meterMendAbi,
            meter.address,
            returned.block,
            head.number,
          );
          const refund = logs.find(
            (log) =>
              log.eventName === "DepositRefunded" &&
              BigInt(log.args.rentalId as bigint) === firstRental,
          );
          if (!refund)
            throw new Error(
              "Rental closed without persisted matching refund evidence",
            );
          const jobs = await getLogs(
            cronpotAbi,
            cron.address,
            refund.block,
            refund.block,
          );
          const executed = jobs.find(
            (log) =>
              log.eventName === "JobExecuted" &&
              BigInt(log.args.jobId as bigint) === firstJob &&
              log.args.success === true &&
              log.txHash === refund.txHash,
          );
          if (
            !executed ||
            (executed.args.executor as string).toLowerCase() !==
              (report.context.roles.relayer as string).toLowerCase()
          )
            throw new Error(
              "Refund was not proven to be executed by the configured relayer through Cronpot",
            );
          if (BigInt(refund.args.amount as bigint) !== deposit)
            throw new Error(
              "Automatic refund amount differs from the rental deposit",
            );
          return {
            mode: health.mode,
            observedAt: now(),
            jobId: firstJob.toString(),
            refund,
            execution: executed,
          };
        },
        Number(option("wait-seconds", "420")) * 1000,
      );
      report.automaticRefund = observed;
      save();
    }
    const second = await call(
      "rent-second",
      renter,
      "rent",
      [itemId],
      fee + deposit,
    );
    const secondRental = BigInt(
      eventArgs(second, meterMendAbi, meter.address, "Rented")
        .rentalId as bigint,
    );
    const secondEvidence = await evidenceFor(
      "return-second",
      "return-photo",
      "return",
    );
    const disputeEvidence = await evidenceFor(
      "dispute",
      "dispute-photo",
      "dispute",
    );
    await call(
      "return-second",
      operator,
      "markReturned",
      [secondRental, secondEvidence],
      tip,
    );
    const deduction = (deposit * 30n) / 100n;
    await call("open-dispute", operator, "openDispute", [
      secondRental,
      deduction,
      disputeEvidence,
    ]);
    const decided = await call("approve-dispute", arbiter, "voteDispute", [
      secondRental,
      true,
    ]);
    await verify("dispute-deduction-and-refund", async () => {
      const args = eventArgs(
        decided,
        meterMendAbi,
        meter.address,
        "DisputeResolved",
      );
      const expected =
        BigInt(terms.reserveBefore) + contribution * 2n + deduction;
      const reserve = (await getItem())[8];
      if (
        BigInt(args.deducted as bigint) !== deduction ||
        BigInt(args.refunded as bigint) !== deposit - deduction ||
        reserve !== expected
      )
        throw new Error("Dispute payout/reserve assertion failed");
      return { deduction, refunded: args.refunded, reserve, expected };
    });
    if (!report.context.repairAmount) {
      const reserve = (await getItem())[8];
      const repairAmount =
        (reserve / 2n / NATIVE_TO_EVM_RATIO) * NATIVE_TO_EVM_RATIO;
      if (repairAmount <= 0n)
        throw new Error("Reserve is too small for the repair demonstration");
      report.context.repairAmount = repairAmount.toString();
      report.context.reserveBeforeRepair = reserve.toString();
      save();
    }
    const repairAmount = BigInt(report.context.repairAmount);
    const repairEvidence = await evidenceFor(
      "repair",
      "repair-receipt",
      "repair",
    );
    const proposal = await call("propose-repair", operator, "proposeRepair", [
      itemId,
      report.context.roles.repairer,
      repairAmount,
      repairEvidence,
    ]);
    const repairId = BigInt(
      eventArgs(proposal, meterMendAbi, meter.address, "RepairProposed")
        .repairId as bigint,
    );
    const paid = await call("approve-repair", arbiter, "decideRepair", [
      repairId,
      true,
    ]);
    await verify("repair-paid-from-item-reserve", async () => {
      const args = eventArgs(paid, meterMendAbi, meter.address, "RepairPaid");
      const reserve = (await getItem())[8];
      if (
        BigInt(args.amount as bigint) !== repairAmount ||
        reserve !== BigInt(report.context.reserveBeforeRepair) - repairAmount
      )
        throw new Error("Repair reserve debit differs from approved amount");
      return { amount: repairAmount, reserve, repairId };
    });
    if (!report.context.withdrawal) {
      report.context.withdrawal = {
        reserveBefore: (await getItem())[8].toString(),
        incomeBefore: String(
          await readContract<bigint>(
            meterMendAbi,
            meter.address,
            "operatorIncome",
            [report.context.roles.operator],
          ),
        ),
      };
      save();
    }
    const withdrawal = await call(
      "withdraw-income",
      operator,
      "withdrawIncome",
      [],
    );
    await verify("operator-cannot-withdraw-reserve", async () => {
      const args = eventArgs(
        withdrawal,
        meterMendAbi,
        meter.address,
        "IncomeWithdrawn",
      );
      const reserveAfter = (await getItem())[8];
      const incomeAfter = await readContract<bigint>(
        meterMendAbi,
        meter.address,
        "operatorIncome",
        [report.context.roles.operator],
      );
      if (
        reserveAfter !== BigInt(report.context.withdrawal.reserveBefore) ||
        BigInt(args.amount as bigint) !==
          BigInt(report.context.withdrawal.incomeBefore) ||
        incomeAfter !== 0n
      )
        throw new Error(
          "Income withdrawal touched reserve or paid an incorrect amount",
        );
      return {
        paid: args.amount,
        reserveBefore: report.context.withdrawal.reserveBefore,
        reserveAfter,
        incomeAfter,
      };
    });
    report.completedAt = now();
    save();
    console.log(
      json({
        status: "completed",
        artifact: "deployments/demo-run.json",
        assertions: Object.keys(report.assertions),
        automaticRefund: true,
      }),
    );
  } finally {
    journal.close();
  }
});
