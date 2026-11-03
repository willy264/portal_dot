import { createHash } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { AccountId, Binary } from "polkadot-api";
import {
  Blake2128,
  Blake2256,
  Twox128,
} from "@polkadot-api/substrate-bindings";
import {
  encodeFunctionData,
  formatUnits,
  hexToBytes,
  toHex,
  type Address,
  type Hex,
} from "viem";
import {
  getAccountState,
  getApi,
  getClient,
  getFinalizedHead,
  readContract,
  verifyNetwork,
} from "../packages/chain/src/client";
import {
  buildReviveCall,
  prepareBoundedReviveCall,
  submitAndWatch,
  type ChainSigner,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
import { meterMendAbi, cronpotAbi } from "../packages/chain/src/abi";
import {
  amount,
  eventArgs,
  flag,
  Journal,
  json,
  now,
  option,
  pathAt,
  readJson,
  requireContract,
  run,
  signer,
  writeJson,
} from "./lib";
import {
  expectFinalizedContractRevert,
  requireNotArbiter,
  requireUnchangedReserveAndRepair,
} from "./expected-failure";
import {
  checkQuote,
  CONTINUATION_CAP,
  plannedMaximum,
  STEP_LIMITS,
} from "./continuation-budget";

/** Legacy RPC reads need their own deadline; they do not submit anything. */
async function rawRpc<T = any>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch("https://test-node-v3.portaldot.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status}`);
  const result = await response.json() as { result: T; error?: unknown };
  if (result.error) throw new Error(`${method}: ${JSON.stringify(result.error)}`);
  return result.result;
}

await run(async () => {
  const meter = requireContract("MeterMend"),
    cron = requireContract("Cronpot");
  const roles = {
    operator: signer("DEPLOYER"),
    renter: signer("RENTER"),
    arbiter: signer("ARBITER"),
    keeper: signer("RELAYER"),
  };
  const report = readJson<any>("deployments/demo-run.json");
  const diagnosis = readJson<any>(
    "deployments/direct-refund-diagnosis-2026-11-03.json",
  );
  if (
    diagnosis.direct.status !== "passed" ||
    diagnosis.contract !== meter.address ||
    report.contract !== meter.address ||
    report.context.itemId !== "1"
  )
    throw Error(
      "Current-deployment direct diagnosis and original item evidence required",
    );
  if (flag("retry-failed"))
    throw Error("This continuation never blindly retries failed operations");
  const plan = {
    status: "reviewed-spending-limits-not-exact-future-fees",
    capTPOT: formatUnits(CONTINUATION_CAP, 14),
    plannedMaximumTPOT: formatUnits(plannedMaximum, 14),
    limits: Object.fromEntries(
      Object.entries(STEP_LIMITS).map(([k, v]) => [
        k,
        {
          storageTPOT: formatUnits(v.storage, 14),
          feeCeilingTPOT: formatUnits(v.fee, 14),
          valueTPOT: formatUnits(v.value, 14),
        },
      ]),
    ),
    assumptions: [
      "Existing contracts, funded/mapped roles and item1 reused; no deployment, account top-up or item registration.",
      "Each ordinary call gets a fresh native simulation and fee quote. Return/dispute uses one atomic native batch: the return is simulated, dispute storage is bounded, and the batch fee is quoted. Final fees come from receipts.",
      "Native return evidence already exists; remaining labeled fixture hashes use repository bytes and local backup, without additional native uploads.",
      "No storage refunds, rental refunds, incoming faucet funds or reserve payments enlarge the 83.49 cap.",
    ],
  };
  writeJson("deployments/existing-release-continuation-plan.json", {
    observedAt: now(),
    ...plan,
    signedTransactions: 0,
  });
  if (!flag("execute")) {
    console.log(json(plan));
    return;
  }
  console.log("Verifying original receipt, current nonce and pool before direct recovery");
  const rpcGenesis = await rawRpc<string>("chain_getBlockHash", [0]);
  if (rpcGenesis !== "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd")
    throw new Error("Native HTTP endpoint genesis mismatch");
  const journal = new Journal("deployments/continuation-journal.json");
  const save = () => {
    report.updatedAt = now();
    writeJson("deployments/demo-run.json", report);
  };
  const item = () =>
    readContract<any[]>(meterMendAbi, meter.address, "items", [1n]);
  const rental = (id: bigint) =>
    readContract<any[]>(meterMendAbi, meter.address, "rentals", [id]);
  const snapshotAccounts = async () =>
    Object.fromEntries(
      await Promise.all(
        Object.entries(roles).map(async ([role, a]) => [
          role,
          { address: a.address, ...(await getAccountState(a.address)) },
        ]),
      ),
    );
  const evidence = (name: string): Hex => {
    const bytes = readFileSync(pathAt(`scripts/fixtures/${name}.png`));
    const hash = createHash("sha256").update(bytes).digest("hex");
    mkdirSync(pathAt("data/evidence"), { recursive: true });
    writeFileSync(pathAt(`data/evidence/${hash}`), bytes);
    report.context.evidence[`continuation-${name}`] = {
      hash: `0x${hash}`,
      bytes: bytes.length,
      source: `scripts/fixtures/${name}.png`,
      fixture: true,
      mode: "repository-fixture-with-local-backup",
      nativeUpload: false,
      provenance:
        "Labeled DEMO FIXTURE; not a physical rental or repair claim.",
    };
    save();
    return `0x${hash}`;
  };
  const observeNonce = async (account: ChainSigner) => {
    const state = await getAccountState(account.address),
      best = await rawRpc<string>("chain_getBlockHash", []);
    const id = AccountId().enc(account.address),
      key = toHex(
        new Uint8Array([
          ...Twox128(new TextEncoder().encode("System")),
          ...Twox128(new TextEncoder().encode("Account")),
          ...Blake2128(id),
          ...id,
        ]),
      );
    const [raw, next, pool] = await Promise.all([
      rawRpc<string>("state_getStorage", [key, best]),
      rawRpc<number>("system_accountNextIndex", [
        account.address,
      ]),
      rawRpc<string[]>("author_pendingExtrinsics", []),
    ]);
    const bytes = hexToBytes(raw as Hex);
    if (bytes.length !== 80) throw Error("Account codec changed");
    const bestNonce = new DataView(
      bytes.buffer,
      bytes.byteOffset,
      bytes.byteLength,
    ).getUint32(0, true);
    if (
      state.nonce !== bestNonce ||
      state.nonce !== Number(next) ||
      pool.length
    )
      throw Error("Nonce/pool changed; no submission");
    return {
      ...state,
      bestNonce,
      nextIndex: Number(next),
      pendingPoolCount: pool.length,
    };
  };
  const receiptCost = (
    receipt: TransactionEvidence,
    account: ChainSigner,
    valueNative: bigint,
  ) => {
    const events = receipt.events.map((e: any) => e.event ?? e);
    const payment = events.find(
      (e: any) =>
        e.type === "TransactionPayment" &&
        e.value.type === "TransactionFeePaid" &&
        e.value.value.who === account.address,
    );
    const balanceEvents = events
      .filter((e: any) => e.type === "Balances")
      .map((e: any) => e.value);
    const sum = (kind: string, field: string) =>
      balanceEvents
        .filter((e: any) => e.type === kind && e.value.who === account.address)
        .reduce((n: bigint, e: any) => n + BigInt(e.value[field]), 0n);
    const fee = payment
      ? BigInt(payment.value.value.actual_fee)
      : sum("Withdraw", "amount") - sum("Deposit", "amount");
    const holds = balanceEvents
      .filter(
        (e: any) =>
          e.type === "TransferAndHold" &&
          e.value.source === account.address &&
          e.value.reason?.value?.type === "StorageDepositReserve",
      )
      .reduce((n: bigint, e: any) => n + BigInt(e.value.transferred), 0n);
    if (fee < 0n) throw Error("Unable to establish actual transaction fee");
    return {
      feeNative: fee,
      storageHeldNative: holds,
      valueNative,
      conservativeSpentNative: fee + holds + valueNative,
      feeTPOT: formatUnits(fee, 14),
      storageHeldTPOT: formatUnits(holds, 14),
      valueTPOT: formatUnits(valueNative, 14),
      conservativeSpentTPOT: formatUnits(fee + holds + valueNative, 14),
      feeSource: payment
        ? "TransactionPayment.TransactionFeePaid"
        : "Balances.Withdraw minus fee refund to signer",
      balanceEvents,
    };
  };
  const assert = (key: string, passed: boolean, values: any) => {
    if (report.assertions[key]?.passed) return;
    if (!passed) throw Error(`Assertion failed: ${key}`);
    report.assertions[key] = { passed: true, observedAt: now(), values };
    save();
  };
  try {
    const original = readJson<any>(
      "deployments/keeper-refund-observation.json",
    );
    const failedHash =
      "0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35";
    const failedBlock = await rawRpc<string>(
      "chain_getBlockHash",
      [271528],
    );
    if (
      failedBlock !==
      "0x4c48aacbf687fba94bb09d227c9b96ec840b4c7c3f96ba3a3b9e502994e19ab5"
    )
      throw Error("Original failed receipt block changed");
    const body = await rawRpc<any>("chain_getBlock", [
      failedBlock,
    ]);
    if (
      !body.block.extrinsics.some(
        (raw: Hex) => toHex(Blake2256(hexToBytes(raw))) === failedHash,
      )
    )
      throw Error("Original failed transaction not found at retained block");
    const originalNonce = await observeNonce(roles.keeper);
    if (!report.continuation) {
      report.continuation = {
        startedAt: now(),
        status: "in-progress",
        mode: "keeper-direct-finalizeRefund-existing-contracts",
        capNative: CONTINUATION_CAP,
        plan,
        accountsBefore: await snapshotAccounts(),
        quotes: {},
        costs: {},
        originalFailure: {
          txHash: failedHash,
          block: 271528,
          canonicalHashVerified: true,
          keeperNonceCheck: originalNonce,
          retainedEvidence: "deployments/keeper-refund-observation.json",
        },
      };
      report.status =
        "Direct-refund recovery in progress; original Cronpot callback failed";
      save();
    }
    const c = report.continuation;
    c.plan = plan;
    const spent = () =>
      Object.values(c.costs).reduce(
        (n: bigint, v: any) => n + BigInt(v.conservativeSpentNative),
        0n,
      );
    const costCheck = (key: string, cost: any) => {
      c.costs[key] = cost;
      const total = spent();
      c.conservativeSpentNative = total;
      c.conservativeSpentTPOT = formatUnits(total, 14);
      save();
      if (
        BigInt(cost.storageHeldNative) > STEP_LIMITS[key]!.storage ||
        BigInt(cost.feeNative) > STEP_LIMITS[key]!.fee ||
        total > CONTINUATION_CAP
      )
        throw Error(
          "Finalized cost exceeded reviewed limit; stop without any retry",
        );
    };
    const call = async (
      key: string,
      role: keyof typeof roles,
      fn: string,
      args: readonly unknown[],
      value = 0n,
    ) => {
      const account = roles[role],
        data = encodeFunctionData({
          abi: meterMendAbi,
          functionName: fn,
          args,
        } as any),
        intent = { to: meter.address, data, value: value.toString() };
      const old = journal.data.steps[key];
      let receipt: TransactionEvidence;
      if (old) {
        receipt = (await journal.recover(key, intent, account))!;
      } else {
        const at = await getFinalizedHead();
        const sized = await buildReviveCall({
          signer: account,
          to: meter.address,
          data,
          value,
          abi: meterMendAbi,
        });
        const caps = {
          weight_limit: { ref_time: 10000000000n, proof_size: 1048576n },
          storage_deposit_limit:
            sized.storage_deposit_limit > 0n ? sized.storage_deposit_limit : 1n,
        };
        const prepared = await prepareBoundedReviveCall(
          {
            signer: account,
            to: meter.address,
            data,
            value,
            abi: meterMendAbi,
          },
          caps,
          at,
        );
        const fee = await prepared.tx.getEstimatedFees(account.txCreator);
        const storage =
          prepared.bounded.storage_deposit.type === "Charge"
            ? prepared.bounded.storage_deposit.value
            : 0n;
        checkQuote(key, storage, fee, prepared.value);
        const future = Object.entries(STEP_LIMITS)
          .filter(([k]) => k !== key && !c.costs[k])
          .reduce((n, [, v]) => n + v.storage + v.fee + v.value, 0n);
        if (
          spent() + storage + STEP_LIMITS[key]!.fee + prepared.value + future >
          CONTINUATION_CAP
        )
          throw Error("Remaining complete flow exceeds cap");
        const state = await observeNonce(account);
        if (
          state.nativeBalance - state.nativeFrozen <
          caps.storage_deposit_limit + prepared.value + fee + amount("0.1", 14)
        )
          throw Error("Signer lacks required temporary storage balance");
        c.quotes[key] = {
          observedAt: now(),
          at,
          role,
          fn,
          args,
          value,
          storage: prepared.bounded.storage_deposit,
          maximumStorage: prepared.bounded.max_storage_deposit,
          caps,
          feeNative: fee,
          feeTPOT: formatUnits(fee, 14),
          nonce: state.nonce,
        };
        save();
        console.log(
          json({
            preflight: key,
            feeTPOT: formatUnits(fee, 14),
            netStorage: prepared.bounded.storage_deposit,
            cashLimitTPOT: formatUnits(
              caps.storage_deposit_limit + fee + prepared.value,
              14,
            ),
          }),
        );
        await verifyNetwork();
        receipt = await journal.step(
          key,
          intent,
          account,
          async (options) => {
            const last = await observeNonce(account);
            if (last.nonce !== state.nonce)
              throw Error("Nonce changed after preparation");
            return submitAndWatch(prepared.tx, account, {
              ...options,
              nonce: state.nonce,
            });
          },
          { expectedNonce: state.nonce },
        );
      }
      report.transactions[key] = receipt;
      save();
      costCheck(key, receiptCost(receipt, account, value / 10000n));
      return receipt;
    };
    if (c.status === "completed") {
      console.log("Existing continuation already complete; no transactions");
      return;
    }
    const direct = await call("direct-refund", "keeper", "finalizeRefund", [
      1n,
    ]);
    const refunded = eventArgs(
      direct,
      meterMendAbi,
      meter.address,
      "DepositRefunded",
    );
    const firstState = await rental(1n);
    assert(
      "direct-refund-exact-deposit",
      BigInt(refunded.rentalId as bigint) === 1n &&
        BigInt(refunded.amount as bigint) === amount("0.05") &&
        firstState[5] === 4 &&
        firstState[2] === 0n,
      { ...refunded, finalRental: firstState },
    );
    report.directRefund = {
      mode: "direct call by keeper account; Cronpot callback not used",
      txHash: direct.txHash,
      block: direct.block,
      refund: refunded,
      automaticCronpotRefund: false,
    };
    save();
    if (option("through") === "direct-refund") return;
    const returnHash = evidence("return"),
      disputeHash = evidence("dispute"),
      repairHash = evidence("repair");
    const second = await call(
      "rent-second",
      "renter",
      "rent",
      [1n],
      amount("0.06"),
    );
    const secondId = BigInt(
      eventArgs(second, meterMendAbi, meter.address, "Rented")
        .rentalId as bigint,
    );
    c.secondRentalId = secondId;
    save();
    const reserve2 = (await item())[8];
    assert("second-rental-reserve-split", reserve2 === amount("0.004"), {
      reserve: reserve2,
    });
    // Both calls use the operator origin. Atomic execution guarantees the dispute
    // is opened in the return's block, despite intermittent RPC latency.
    const batchKey = "return-dispute";
    const returnData = encodeFunctionData({ abi: meterMendAbi, functionName: "markReturned", args: [secondId, returnHash] });
    const disputeData = encodeFunctionData({ abi: meterMendAbi, functionName: "openDispute", args: [secondId, amount("0.015"), disputeHash] });
    const batchIntent = { to: meter.address, calls: [returnData, disputeData], value: amount("0.001").toString(), atomic: true };
    let batchReceipt: TransactionEvidence;
    if (journal.data.steps[batchKey]) {
      batchReceipt = (await journal.recover(batchKey, batchIntent, roles.operator))!;
    } else {
      const at = await getFinalizedHead();
      const prepared = await prepareBoundedReviveCall(
        { signer: roles.operator, to: meter.address, data: returnData, value: amount("0.001"), abi: meterMendAbi },
        { weight_limit: { ref_time: 10000000000n, proof_size: 1048576n }, storage_deposit_limit: amount("34", 14) },
        at,
      );
      const currentRental = await rental(secondId);
      if (currentRental[5] !== 1 || currentRental[2] !== amount("0.05"))
        throw Error("Atomic return/dispute requires the active second rental and its exact deposit");
      const disputeCall = getApi().tx.Revive.call({
        dest: meter.address, value: 0n,
        weight_limit: { ref_time: 10000000000n, proof_size: 1048576n },
        storage_deposit_limit: amount("16", 14), data: Binary.fromHex(disputeData),
      });
      const batch = getApi().tx.Utility.batch_all({ calls: [prepared.tx.decodedCall, disputeCall.decodedCall] });
      const fee = await batch.getEstimatedFees(roles.operator.txCreator);
      const bound = STEP_LIMITS[batchKey]!;
      checkQuote(batchKey, bound.storage, fee, amount("0.001", 14));
      const future = Object.entries(STEP_LIMITS).filter(([k]) => k !== batchKey && !c.costs[k])
        .reduce((n, [, v]) => n + v.storage + v.fee + v.value, 0n);
      if (spent() + bound.storage + bound.fee + bound.value + future > CONTINUATION_CAP)
        throw Error("Atomic return/dispute exceeds complete-flow cap");
      const state = await observeNonce(roles.operator);
      if (state.nativeBalance - state.nativeFrozen < amount("50.101", 14) + fee)
        throw Error("Operator lacks temporary storage balance for atomic return/dispute");
      c.quotes[batchKey] = {
        observedAt: now(), at, role: "operator", calls: ["markReturned", "openDispute"],
        mode: "Utility.batch_all", feeNative: fee, feeTPOT: formatUnits(fee, 14), nonce: state.nonce,
        returnSimulation: prepared.bounded, storageBoundNative: bound.storage,
        limitation: "The return was simulated; the dependent dispute was not simulated independently against future state. Native batch_all rolls back both calls if either fails.",
      };
      save();
      console.log(json({ preflight: batchKey, feeTPOT: formatUnits(fee, 14), storageBoundTPOT: formatUnits(bound.storage, 14) }));
      batchReceipt = await journal.step(batchKey, batchIntent, roles.operator, async (options) => {
        const last = await observeNonce(roles.operator);
        if (last.nonce !== state.nonce) throw Error("Nonce changed after atomic batch preparation");
        return submitAndWatch(batch, roles.operator, { ...options, nonce: state.nonce });
      }, { expectedNonce: state.nonce });
    }
    report.transactions[batchKey] = batchReceipt;
    save();
    costCheck(batchKey, receiptCost(batchReceipt, roles.operator, amount("0.001", 14)));
    const returnedArgs = eventArgs(batchReceipt, meterMendAbi, meter.address, "Returned");
    const disputeArgs = eventArgs(batchReceipt, meterMendAbi, meter.address, "DisputeOpened");
    assert("return-and-dispute-atomic", BigInt(returnedArgs.rentalId as bigint) === secondId && BigInt(disputeArgs.rentalId as bigint) === secondId,
      { returned: returnedArgs, dispute: disputeArgs, txHash: batchReceipt.txHash, block: batchReceipt.block });
    const decision = await call("approve-dispute", "arbiter", "voteDispute", [
      secondId,
      true,
    ]);
    const resolved = eventArgs(
        decision,
        meterMendAbi,
        meter.address,
        "DisputeResolved",
      ),
      afterDispute = (await item())[8];
    assert(
      "dispute-deduction-and-refund",
      BigInt(resolved.deducted as bigint) === amount("0.015") &&
        BigInt(resolved.refunded as bigint) === amount("0.035") &&
        afterDispute === amount("0.019"),
      { ...resolved, reserve: afterDispute },
    );
    const proposal = await call("propose-repair", "operator", "proposeRepair", [
      1n,
      report.context.roles.repairer as Address,
      amount("0.0095"),
      repairHash,
    ]);
    const repairId = BigInt(
      eventArgs(proposal, meterMendAbi, meter.address, "RepairProposed")
        .repairId as bigint,
    );
    c.repairId = repairId;
    save();
    const paid = await call("approve-repair", "arbiter", "decideRepair", [
      repairId,
      true,
    ]);
    const paidArgs = eventArgs(paid, meterMendAbi, meter.address, "RepairPaid"),
      afterRepair = (await item())[8];
    assert(
      "repair-paid-from-item-reserve",
      BigInt(paidArgs.amount as bigint) === amount("0.0095") &&
        afterRepair === amount("0.0095"),
      { ...paidArgs, reserve: afterRepair },
    );
    const withdrawal = await call(
      "withdraw-income",
      "operator",
      "withdrawIncome",
      [],
    );
    const withdrawn = eventArgs(
        withdrawal,
        meterMendAbi,
        meter.address,
        "IncomeWithdrawn",
      ),
      reserveAfterIncome = (await item())[8];
    assert(
      "operator-cannot-withdraw-reserve",
      BigInt(withdrawn.amount as bigint) === amount("0.016") &&
        reserveAfterIncome === amount("0.0095"),
      {
        ...withdrawn,
        reserveBefore: afterRepair,
        reserveAfter: reserveAfterIncome,
      },
    );
    const rejectionKey = "reserve-rejection",
      data = encodeFunctionData({
        abi: meterMendAbi,
        functionName: "decideRepair",
        args: [repairId, true],
      });
    const snapshot = async () => ({
      reserve: (await item())[8],
      repair: await readContract(meterMendAbi, meter.address, "repairs", [
        repairId,
      ]),
    });
    c.rejectionBefore ??= await snapshot();
    save();
    const rejected = await expectFinalizedContractRevert({
      journal,
      key: rejectionKey,
      intent: {
        to: meter.address,
        data,
        value: "0",
        expectedError: "NotArbiter",
      },
      account: roles.operator,
      action: async (options) => {
        const at = await getFinalizedHead(),
          caps = {
            weight_limit: { ref_time: 10000000000n, proof_size: 1048576n },
            storage_deposit_limit: amount("5", 14),
          };
        let rejection;
        try {
          await prepareBoundedReviveCall(
            {
              signer: roles.operator,
              to: meter.address,
              data,
              abi: meterMendAbi,
            },
            caps,
            at,
          );
        } catch (error) {
          rejection = requireNotArbiter(error);
        }
        if (!rejection) throw Error("Expected NotArbiter rejection is absent");
        c.rejectionPreflight = rejection;
        save();
        const tx = getApi().tx.Revive.call({
          dest: meter.address,
          value: 0n,
          ...caps,
          data: Binary.fromHex(data),
        });
        const fee = await tx.getEstimatedFees(roles.operator.txCreator);
        checkQuote(rejectionKey, 0n, fee, 0n);
        if (spent() + STEP_LIMITS[rejectionKey]!.fee > CONTINUATION_CAP)
          throw Error("Rejection fee exceeds remaining cap");
        const nonce = await observeNonce(roles.operator);
        return submitAndWatch(tx, roles.operator, {
          ...options,
          nonce: nonce.nonce,
        });
      },
    });
    (report.expectedFailures ??= {})[rejectionKey] = {
      label: "Operator reserve-spending approval rejected",
      status: "finalized-rejected",
      finalized: true,
      expectedError: "NotArbiter",
      expectedErrorSource: "live operator simulation before signing",
      signedBy: roles.operator.address,
      value: "0",
      preflight: c.rejectionPreflight,
      dispatchError: rejected.dispatchError,
      ...rejected.evidence,
    };
    save();
    costCheck(rejectionKey, receiptCost(rejected.evidence, roles.operator, 0n));
    const rejectionAfter = await snapshot();
    requireUnchangedReserveAndRepair(c.rejectionBefore, rejectionAfter);
    assert("operator-reserve-spending-approval-rejected", true, {
      before: c.rejectionBefore,
      after: rejectionAfter,
      txHash: rejected.evidence.txHash,
    });
    c.accountsAfter = await snapshotAccounts();
    c.status = "completed";
    c.completedAt = now();
    report.status =
      "Direct-refund recovery completed; original Cronpot automatic refund failed";
    report.directRecoveryCompletedAt = now();
    save();
    console.log(
      json({
        status: report.status,
        conservativeSpentTPOT: c.conservativeSpentTPOT,
        capTPOT: "83.49",
        transactions: Object.keys(c.costs),
      }),
    );
  } finally {
    journal.close();
  }
});
