import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Binary, Enum } from "polkadot-api";
import { concatHex, formatUnits, type Address } from "viem";
import {
  getApi,
  getFinalizedHead,
  readContract,
} from "../packages/chain/src/client";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
import {
  buildReviveDeploy,
  submitAndWatch,
} from "../packages/chain/src/revive";
import { verifyProfileRuntime } from "../services/cronpot-relayer/src/preflight";
import { type ExecutionProfile } from "../services/cronpot-relayer/src/execution-profile";
import { verifyExternalContracts } from "./external-keeper-preflight";
import {
  constructorData,
  validateCandidate,
  type CandidateProfile,
} from "./release-model";
import {
  Journal,
  artifact,
  amount,
  flag,
  instantiated,
  json,
  now,
  pathAt,
  readJson,
  requireContract,
  run,
  signer,
  writeJson,
} from "./lib";
import { checkedNonce } from "./live-guards";

await run(async () => {
  if (flag("retry-failed")) throw Error("No automatic deployment retry");
  const path = "deployments/corrected-cronpot.json";
  const candidate = readJson<CandidateProfile>(
    "deployments/releases/v2/candidate-profile.json",
  );
  validateCandidate(candidate);
  const compiled = artifact("Cronpot");
  const old = requireContract("Cronpot"),
    meter = requireContract("MeterMend");
  const bytes = readFileSync(pathAt(candidate.verification.artifact));
  const sha = (b: Uint8Array) => createHash("sha256").update(b).digest("hex");
  if (
    sha(bytes) !== candidate.verification.sha256 ||
    compiled.bytecodeSha256 !== candidate.code.creationBytecodeSha256 ||
    compiled.bytecodeSha256 === old.bytecodeSha256
  )
    throw Error("Reviewed candidate/bytecode binding differs");
  const simulation = JSON.parse(bytes.toString());
  const ctorData = constructorData(
    "Cronpot",
    candidate.contractGas,
    undefined,
    0n,
  );
  if (
    simulation.creation.frame.input.toLowerCase() !==
      concatHex([compiled.code, ctorData]).toLowerCase() ||
    simulation.executeReturnValue !== true
  )
    throw Error(
      "Calibrated constructor or successful callback evidence differs",
    );
  const account = signer("DEPLOYER");
  const at = await getFinalizedHead();
  await verifyProfileRuntime(candidate as unknown as ExecutionProfile, at.hash);
  if (
    (
      await readContract<Address>(meterMendAbi, meter.address, "cronpot", [], {
        at,
      })
    ).toLowerCase() !== old.address.toLowerCase()
  )
    throw Error("Existing MeterMend binding changed");
  const journal = new Journal(
    "deployments/corrected-cronpot-deploy-journal.json",
  );
  const intent = {
    contract: "Cronpot",
    bytecodeSha256: compiled.bytecodeSha256,
    ctorData,
    existingMeterMend: meter.address,
    originalCronpot: old.address,
  };
  try {
    let record = readJson<any>(path, null);
    const entry = journal.data.steps["deploy-corrected-cronpot"];
    if (record?.deployment && !entry)
      throw Error(
        "Existing deployment lacks its journal; reconcile, never duplicate",
      );
    let receipt = entry
      ? await journal.recover("deploy-corrected-cronpot", intent, account)
      : undefined;
    if (!receipt) {
      const before = await checkedNonce(account);
      const prepared = await buildReviveDeploy({
        signer: account,
        code: compiled.code,
        ctorData,
        abi: compiled.abi,
      });
      const bounded = (
        await getApi().apis.ReviveApi.instantiate_versioned(
          Enum("V1", {
            origin: account.address,
            value: 0n,
            gas_limit: prepared.weight_limit,
            storage_deposit_limit: prepared.storage_deposit_limit,
            code: Enum(
              "Upload",
              Binary.fromHex(concatHex([compiled.code, ctorData])),
            ),
            data: Binary.fromHex("0x"),
            salt: undefined,
          }),
          { signal: AbortSignal.timeout(60000) },
        )
      ).value;
      if (
        !bounded.result.success ||
        bounded.result.value.result.flags !== 0 ||
        bounded.result.value.addr.toLowerCase() !==
          prepared.simulatedAddress.toLowerCase()
      )
        throw Error("Bounded deployment simulation failed");
      const fee = await prepared.tx.getEstimatedFees(account.txCreator);
      const last = await checkedNonce(account);
      if (
        before.nonce !== last.nonce ||
        prepared.storage_deposit_limit + fee > amount("500", 14) ||
        last.nativeBalance - last.nativeFrozen <
          prepared.storage_deposit_limit + fee + amount("200", 14)
      )
        throw Error(
          "Deployment nonce or 500 tPOT deployment/200 retained guard failed",
        );
      const noCode = await Promise.all([
        getApi().query.Revive.AccountInfoOf.getValue(
          prepared.simulatedAddress,
          { at: last.blockHash },
        ),
        getApi().query.Revive.AccountInfoOf.getValue(
          prepared.simulatedAddress,
          { at: last.bestHash },
        ),
      ]);
      if (noCode.some(Boolean))
        throw Error("Predicted address already exists; do not deploy twice");
      const quote = {
        observedAt: now(),
        status: "bounded-simulation-passed",
        contract: "Cronpot-only",
        existingMeterMend: meter.address,
        originalCronpot: old.address,
        simulatedAddress: prepared.simulatedAddress,
        nonce: last.nonce,
        feeNative: fee,
        feeTPOT: formatUnits(fee, 14),
        storageLimitNative: prepared.storage_deposit_limit,
        storageLimitTPOT: formatUnits(prepared.storage_deposit_limit, 14),
        bounded,
        account: last,
        signedTransactions: 0,
      };
      writeJson("deployments/corrected-cronpot-deploy-preflight.json", quote);
      console.log(
        json({
          preflight: "corrected-Cronpot-only",
          feeTPOT: quote.feeTPOT,
          storageLimitTPOT: quote.storageLimitTPOT,
          nonce: last.nonce,
          availableTPOT: formatUnits(last.nativeBalance, 14),
        }),
      );
      if (!flag("execute")) return;
      receipt = await journal.step(
        "deploy-corrected-cronpot",
        intent,
        account,
        async (options) => {
          const fresh = await checkedNonce(account);
          if (fresh.nonce !== last.nonce) throw Error("Deployer nonce changed");
          await verifyProfileRuntime(
            candidate as unknown as ExecutionProfile,
            fresh.blockHash,
          );
          return submitAndWatch(prepared.tx, account, {
            ...options,
            nonce: last.nonce,
          });
        },
        { expectedNonce: last.nonce },
      );
    }
    const address = instantiated(receipt!);
    const profile: ExecutionProfile = {
      ...candidate,
      verified: true,
      id: "portaldot-v3-corrected-cronpot-external-keeper",
      contracts: { Cronpot: address, MeterMend: meter.address },
      verification: { ...candidate.verification, ethereumTraceSuccess: true },
    };
    record = {
      schemaVersion: 1,
      observedAt: now(),
      status: "deployed-readbacks-pending",
      deployment: {
        ...receipt,
        address,
        bytecodeSha256: compiled.bytecodeSha256,
        ctorData,
      },
      originalCronpot: old.address,
      meterMend: meter.address,
      integration:
        "Keeper registers external jobs; MeterMend retains its original immutable Cronpot",
      profile,
    };
    writeJson(path, record);
    const snapshot = await getFinalizedHead();
    record.readbacks = {
      at: snapshot,
      ...(await verifyExternalContracts(profile, old.address, snapshot)),
      nextJobId: await readContract(cronpotAbi, address, "nextJobId", [], {
        at: snapshot,
      }),
      cronTip: await readContract(meterMendAbi, meter.address, "cronTip", [], {
        at: snapshot,
      }),
    };
    record.status = "deployed-and-readbacks-verified";
    writeJson(path, record);
    const demo = readJson<any>("deployments/demo-run.json");
    demo.transactions["deploy-corrected-cronpot"] = receipt;
    demo.correctedAutomation ??= {
      status: "deployed-awaiting-new-rental",
      startedAt: now(),
      originalCronpot: old.address,
      cronpot: address,
      meterMend: meter.address,
      transactions: {},
    };
    demo.correctedAutomation.deployment = record.deployment;
    writeJson("deployments/demo-run.json", demo);
    console.log(
      json({
        status: record.status,
        address,
        txHash: receipt!.txHash,
        block: receipt!.block,
        meterMendUnchanged: meter.address,
      }),
    );
  } finally {
    journal.close();
  }
});
