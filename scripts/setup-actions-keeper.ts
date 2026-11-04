import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  fsyncSync,
  openSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { parse } from "dotenv";
import { Enum } from "polkadot-api";
import { formatUnits, type Address } from "viem";
import { getAccountState, getApi } from "../packages/chain/src/client";
import { signerFromSeed } from "../packages/chain/src/node";
import { submitAndWatch, type ChainSigner } from "../packages/chain/src/revive";
import {
  Journal,
  amount,
  flag,
  json,
  now,
  pathAt,
  readJson,
  run,
  signer,
  writeJson,
} from "./lib";
import { checkedNonce } from "./live-guards";

const KEY = "fund-actions-keeper";
const TARGET = amount("10", 14);
const FEE_CAP = amount("0.1", 14);
const RETAIN = amount("200", 14);
type FundingIntent = {
  type: "actions-keeper-initial-funding";
  from: string;
  to: string;
  h160: Address;
  targetNative: string;
  amountNative: string;
  recipientBalanceBeforeNative: string;
};

export function assertActionsFundingIntent(
  intent: FundingIntent,
  from: string,
  to: string,
  h160: Address,
) {
  if (
    intent.type !== "actions-keeper-initial-funding" ||
    intent.from !== from ||
    intent.to !== to ||
    intent.h160.toLowerCase() !== h160.toLowerCase() ||
    intent.targetNative !== String(TARGET) ||
    !/^\d+$/.test(intent.amountNative) ||
    !/^\d+$/.test(intent.recipientBalanceBeforeNative)
  )
    throw Error(
      "Actions keeper funding intent does not match the saved account and fixed target",
    );
  const before = BigInt(intent.recipientBalanceBeforeNative);
  const required = before < TARGET ? TARGET - before : 0n;
  if (BigInt(intent.amountNative) !== required || required > TARGET)
    throw Error(
      "Actions keeper funding must be the original frozen amount, at most 10 tPOT",
    );
}

/** Creates or reuses one ignored seed. No secret value is returned in logs or public artifacts. */
function savedKeeper(hasFundingEvidence: boolean): ChainSigner {
  const envPath = pathAt(".env");
  // Refuse to put a generated secret in a tracked file or an unignored path.
  if (
    execFileSync("git", ["ls-files", "--", ".env"], {
      cwd: pathAt("."),
      encoding: "utf8",
    }).trim()
  )
    throw Error("Refusing to save the Actions keeper seed: .env is tracked");
  try {
    execFileSync("git", ["check-ignore", "--quiet", "--", ".env"], {
      cwd: pathAt("."),
      stdio: "ignore",
    });
  } catch {
    throw Error(
      "Refusing to save the Actions keeper seed: .env is not ignored",
    );
  }
  const contents = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  const stored = parse(contents).ACTIONS_KEEPER_SEED;
  let secret: string;
  if (stored !== undefined) {
    if (!/^0x[0-9a-f]{64}$/i.test(stored))
      throw Error(
        "Saved ACTIONS_KEEPER_SEED must be a 32-byte hex seed; it was not replaced",
      );
    if (
      process.env.ACTIONS_KEEPER_SEED &&
      process.env.ACTIONS_KEEPER_SEED !== stored
    )
      throw Error(
        "Process ACTIONS_KEEPER_SEED differs from ignored .env; no seed was changed",
      );
    secret = stored;
  } else {
    if (hasFundingEvidence)
      throw Error(
        "The saved Actions keeper seed is missing; restore it before continuing. No replacement was generated",
      );
    if (process.env.ACTIONS_KEEPER_SEED)
      throw Error(
        "A process Actions seed exists without an ignored .env copy; reconcile it before generating an account",
      );
    secret = `0x${randomBytes(32).toString("hex")}`;
    const fd = openSync(envPath, "a", 0o600);
    try {
      writeFileSync(
        fd,
        `${contents && !contents.endsWith("\n") ? "\n" : ""}ACTIONS_KEEPER_SEED=${secret}\n`,
      );
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
  }
  process.env.ACTIONS_KEEPER_SEED = secret;
  try {
    return signerFromSeed(secret);
  } catch {
    throw Error(
      "Unable to derive the saved Actions keeper account; no secret was printed",
    );
  }
}

/** Run with --execute to make at most one initial funding transfer. Never replenishes a spent keeper. */
await run(async () => {
  if (flag("retry-failed"))
    throw Error(
      "Actions keeper setup never retries a failed or uncertain funding transfer",
    );
  const recordPath = "deployments/actions-keeper-account.json";
  const journal = new Journal(
    "deployments/actions-keeper-funding-journal.json",
  );
  try {
    let record = readJson<any>(recordPath, null);
    const entry = journal.data.steps[KEY];
    if (Object.keys(journal.data.steps).some((key) => key !== KEY))
      throw Error("Unexpected entry in Actions keeper funding journal");
    const keeper = savedKeeper(Boolean(record || entry));
    const funder = signer("DEPLOYER");
    if (
      keeper.address === funder.address ||
      (process.env.RELAYER_SEED && keeper.address === signer("RELAYER").address)
    )
      throw Error(
        "Actions keeper must be distinct from the deployer and local recording keeper",
      );
    const initial = await getAccountState(keeper.address);
    if (!initial.autoMap)
      throw Error(
        "This setup requires verified Revive.AutoMap=true; no separate mapping transaction is authorized here",
      );
    if (
      record &&
      (record.ss58 !== keeper.address ||
        record.h160?.toLowerCase() !== initial.h160.toLowerCase())
    )
      throw Error(
        "Saved public Actions keeper account differs from its ignored seed; do not fund another account",
      );
    if (record?.funding?.receipt && !entry)
      throw Error(
        "Funding receipt exists without its journal; reconcile it before proceeding",
      );
    const intent: FundingIntent = record?.funding?.intent ??
      entry?.intent ?? {
        type: "actions-keeper-initial-funding",
        from: funder.address,
        to: keeper.address,
        h160: initial.h160,
        targetNative: String(TARGET),
        amountNative: String(
          initial.nativeBalance < TARGET ? TARGET - initial.nativeBalance : 0n,
        ),
        recipientBalanceBeforeNative: String(initial.nativeBalance),
      };
    assertActionsFundingIntent(
      intent,
      funder.address,
      keeper.address,
      initial.h160,
    );
    record ??= {
      schemaVersion: 1,
      createdAt: now(),
      network: "portaldot-v3-testnet",
      ss58: keeper.address,
      h160: initial.h160,
      role: "dedicated-free-GitHub-Actions-keeper",
      secretLocation:
        "ignored .env: ACTIONS_KEEPER_SEED; GitHub KEEPER_SEED is configured separately",
      noContractDeployment: true,
      localRecordingKeeperChanged: false,
    };
    record.funding ??= { intent, before: initial };
    const save = () => {
      record.observedAt = now();
      writeJson(recordPath, record);
    };
    record.status ??= "funding-intent-frozen";
    save(); // Freeze destination, target and amount before preparing any transaction.
    let receipt = entry
      ? await journal.recover(KEY, intent, funder)
      : undefined;
    const value = BigInt(intent.amountNative);
    if (!receipt && value > 0n) {
      const recipient = await getAccountState(keeper.address);
      if (
        recipient.nativeBalance !== BigInt(intent.recipientBalanceBeforeNative)
      )
        throw Error(
          "Recipient balance changed after the funding intent was frozen; reconcile instead of topping up again",
        );
      const before = await checkedNonce(funder);
      const tx = getApi().tx.Balances.transfer_keep_alive({
        dest: Enum("Id", keeper.address),
        value,
      });
      const fee = await tx.getEstimatedFees(funder.txCreator);
      if (
        fee > FEE_CAP ||
        before.nativeBalance - before.nativeFrozen < value + fee + RETAIN
      )
        throw Error(
          "Actions keeper funding exceeds the 0.1 tPOT fee cap or 200 tPOT deployer retention guard",
        );
      record.funding.preflight = {
        observedAt: now(),
        nonce: before.nonce,
        account: before,
        valueNative: String(value),
        feeNative: String(fee),
        feeTPOT: formatUnits(fee, 14),
        feeCapTPOT: "0.1",
        deployerRetainedTPOT: "200",
        signedTransactions: 0,
      };
      record.status = "funding-preflight-passed";
      save();
      if (!flag("execute")) {
        console.log(
          json({
            status: record.status,
            ss58: keeper.address,
            h160: initial.h160,
            fundingTPOT: formatUnits(value, 14),
            feeTPOT: formatUnits(fee, 14),
            signedTransactions: 0,
          }),
        );
        return;
      }
      receipt = await journal.step(
        KEY,
        intent,
        funder,
        async (options) => {
          const fresh = await checkedNonce(funder);
          const unchanged = await getAccountState(keeper.address);
          const freshFee = await tx.getEstimatedFees(funder.txCreator);
          if (
            fresh.nonce !== before.nonce ||
            freshFee > FEE_CAP ||
            fresh.nativeBalance - fresh.nativeFrozen < value + freshFee + RETAIN
          )
            throw Error(
              "Actions funding nonce, fee or retained balance changed before signing",
            );
          if (
            unchanged.nativeBalance !==
            BigInt(intent.recipientBalanceBeforeNative)
          )
            throw Error(
              "Actions keeper received funds before signing; no duplicate transfer submitted",
            );
          return submitAndWatch(tx, funder, {
            ...options,
            nonce: before.nonce,
          });
        },
        { expectedNonce: before.nonce },
      );
    }
    if (receipt) {
      record.funding.receipt = receipt;
      record.status = "funding-finalized-readback-pending";
      save();
    }
    const after = await getAccountState(keeper.address);
    record.readback = after;
    record.balanceNative = String(after.nativeBalance);
    record.balanceTPOT = formatUnits(after.nativeBalance, 14);
    record.mapped = after.mapped;
    record.status = after.mapped
      ? "funded-and-mapping-verified"
      : "funded-mapping-unverified";
    save();
    if (!after.mapped || after.nativeBalance <= 0n)
      throw Error(
        "Funding is retained in the journal, but account funding/mapping readback is incomplete; do not transfer again",
      );
    console.log(
      json({
        status: record.status,
        ss58: keeper.address,
        h160: after.h160,
        balanceTPOT: record.balanceTPOT,
        mapped: after.mapped,
        txHash: receipt?.txHash ?? null,
        block: receipt?.block ?? null,
      }),
    );
    // The root agent may explicitly merge the receipt into demo-run.json after review.
  } finally {
    journal.close();
  }
});
