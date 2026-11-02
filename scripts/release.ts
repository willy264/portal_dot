import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Binary, Enum } from "polkadot-api";
import { Blake2256 } from "@polkadot-api/substrate-bindings";
import { concatHex, hexToBytes, toHex, type Address, type Hex } from "viem";
import {
  getAccountState,
  getApi,
  getClient,
  getFinalizedHead,
  verifyNetwork,
} from "../packages/chain/src/client";
import {
  buildReviveDeploy,
  submitAndWatch,
  type TransactionEvidence,
} from "../packages/chain/src/revive";
import {
  Journal,
  artifact,
  hash,
  instantiated,
  json,
  manifest,
  now,
  pathAt,
  readJson,
  run,
  signer,
  writeJson,
} from "./lib";
import {
  RELEASE_DIRECTORY as DIR,
  RELEASE_NAMES,
  assertDraftReplaceAllowed,
  assertNoUnresolvedAttempts,
  assertNoncePreflight,
  assertSimulationNonce,
  constructorData,
  remainingBudget,
  successfulReceipt,
  unsigned,
  validateCandidate,
  type CandidateProfile,
  type ReleaseName,
} from "./release-model";

const digest = (bytes: Uint8Array | string) =>
  createHash("sha256").update(bytes).digest("hex");
const profilePath = `${DIR}/candidate-profile.json`;
const budgetPath = "deployments/release-v2-budget.json";
const manifestPath = `${DIR}/manifest.json`;
const journalPath = `${DIR}/journal.json`;

// This command never activates a release, modifies v1 evidence, or retries an existing attempt.
await run(async () => {
  if (
    process.argv
      .slice(2)
      .some((a) => a !== "--execute" && !a.startsWith("--timeout-ms="))
  )
    throw new Error(
      "Supported arguments: --execute, --timeout-ms=NUMBER. Failed/unknown attempts require separate reconciliation; --retry-failed is forbidden.",
    );
  const execute = process.argv.includes("--execute");
  const profile = readJson<CandidateProfile>(profilePath);
  validateCandidate(profile);
  const profileSha256 = digest(readFileSync(pathAt(profilePath)));
  const verificationBytes = readFileSync(pathAt(profile.verification.artifact));
  if (digest(verificationBytes) !== profile.verification.sha256)
    throw new Error("Candidate simulation hash changed");
  const verification = JSON.parse(verificationBytes.toString());
  const budget = readJson<any>(budgetPath);
  const prior = manifest();
  const account = signer("DEPLOYER");
  const compiled = {
    Cronpot: artifact("Cronpot"),
    MeterMend: artifact("MeterMend"),
  };
  const tip = unsigned(
    String(prior.cronTipEvm ?? prior.cronTip),
    "retained v1 cron tip",
  );
  for (const name of RELEASE_NAMES) {
    if (
      !prior.contracts[name]?.address ||
      !successfulReceipt(prior.contracts[name])
    )
      throw new Error(
        `Active v1 ${name} lacks a finalized successful deployment receipt`,
      );
    if (
      budget.estimates?.[name]?.creationBytecodeSha256 !==
      compiled[name].bytecodeSha256
    )
      throw new Error(`${name} budget bytecode differs from compiled release`);
  }
  if (
    compiled.Cronpot.bytecodeSha256 === prior.contracts.Cronpot!.bytecodeSha256
  )
    throw new Error("Refusing a duplicate of the active Cronpot bytecode");
  for (const key of [
    "targetGasLimit",
    "postCallGasReserve",
    "tipGasLimit",
  ] as const)
    if (
      budget.profile?.[key] !== profile.contractGas[key] ||
      verification.candidateProfile?.[key] !== profile.contractGas[key]
    )
      throw new Error("Budget, trace and candidate gas profiles differ");
  const source = readFileSync(
    pathAt("contracts/src/Cronpot.sol"),
    "utf8",
  ).replace(/\r\n/g, "\n");
  if (
    verification.source?.["Cronpot.sol"]?.content?.replace(/\r\n/g, "\n") !==
      source ||
    verification.constructorMinCallGas !== profile.contractGas.minCallGas ||
    verification.executeReturnValue !== true ||
    verification.execution?.frame?.output !== `0x${"0".repeat(63)}1` ||
    !verification.decodedEvents?.some(
      (e: any) => e.eventName === "JobExecuted" && e.args?.success === true,
    ) ||
    !verification.decodedEvents?.some(
      (e: any) => e.eventName === "DepositRefunded",
    )
  )
    throw new Error(
      "Corrected-contract simulation does not match this source/profile or successful callback events",
    );
  const creation = verification.creation?.frame?.input;
  const cronCtor = constructorData(
    "Cronpot",
    profile.contractGas,
    undefined,
    tip,
  );
  if (
    typeof creation !== "string" ||
    creation.toLowerCase() !==
      concatHex([compiled.Cronpot.code, cronCtor]).toLowerCase()
  )
    throw new Error(
      "Simulation constructor bytecode differs from this release",
    );
  const runtimeOutput = verification.creation?.frame?.output;
  if (
    profile.code.compiler !== verification.compiler ||
    profile.code.creationBytecodeSha256 !== compiled.Cronpot.bytecodeSha256 ||
    profile.code.creationBytecodeSha256 !==
      verification.candidateCreationBytecodeSha256 ||
    profile.code.runtimeBytecodeSha256 !==
      verification.candidateRuntimeSha256 ||
    typeof runtimeOutput !== "string" ||
    !/^0x[\da-f]+$/i.test(runtimeOutput) ||
    digest(Buffer.from(runtimeOutput.slice(2), "hex")) !==
      profile.code.runtimeBytecodeSha256
  )
    throw new Error(
      "Reviewed compiler or creation/runtime code differs from the candidate simulation",
    );
  if (
    budget.genesis !== profile.runtime.genesisHash ||
    budget.runtimeCodeHash !== profile.runtime.codeHash ||
    verification.genesis !== profile.runtime.genesisHash ||
    verification.runtimeCodeHash !== profile.runtime.codeHash
  )
    throw new Error(
      "Budget, simulation and candidate runtime identities differ",
    );
  const intent = {
    release: "v2",
    reason:
      "Correct the finalized v1 Cronpot callback OutOfGas using calibrated immutable gas limits",
    originalFailure:
      "0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35",
    priorContracts: Object.fromEntries(
      RELEASE_NAMES.map((name) => [
        name,
        {
          address: prior.contracts[name]!.address,
          txHash: prior.contracts[name]!.txHash,
        },
      ]),
    ),
    compiled: Object.fromEntries(
      RELEASE_NAMES.map((name) => [name, compiled[name].bytecodeSha256]),
    ),
    profileSha256,
    cronTipEvm: tip.toString(),
    signer: account.address,
  };
  const freshDraft = () => ({
    schemaVersion: 1,
    id: "v2",
    createdAt: now(),
    status: "prepared-not-deployed",
    intent,
    intentHash: hash(intent),
    contracts: {},
    candidateExecutionProfile: profile,
    active: false,
  });
  const journal = new Journal(journalPath);
  try {
    let release = readJson<any>(manifestPath, freshDraft());
    if (release.intentHash !== hash(intent) || release.active !== false) {
      assertDraftReplaceAllowed(release, journal.data.steps);
      writeJson(`${DIR}/prepared-${release.intentHash}.json`, release);
      release = freshDraft();
    }
    assertNoUnresolvedAttempts(journal.data.steps);
    for (const name of RELEASE_NAMES) {
      const entry = journal.data.steps[`deploy-${name}`];
      if (!entry && release.contracts[name])
        throw new Error(
          `${name} manifest has no matching confirmed release journal; reconcile before continuing`,
        );
      if (!entry) continue;
      const ctorData = constructorData(
        name,
        profile.contractGas,
        release.contracts.Cronpot?.address,
        tip,
      );
      const opIntent = {
        releaseIntentHash: release.intentHash,
        name,
        bytecodeSha256: compiled[name].bytecodeSha256,
        ctorData,
      };
      const receipt = await journal.recover(
        `deploy-${name}`,
        opIntent,
        account,
      );
      if (!receipt || !successfulReceipt(receipt))
        throw new Error(`${name} confirmed journal evidence is invalid`);
      const address = instantiated(receipt);
      if (
        release.contracts[name] &&
        (release.contracts[name].txHash !== receipt.txHash ||
          release.contracts[name].address.toLowerCase() !==
            address.toLowerCase())
      )
        throw new Error(`${name} manifest and confirmed journal disagree`);
      release.contracts[name] = {
        ...receipt,
        address,
        bytecodeSha256: compiled[name].bytecodeSha256,
        ctorData,
        deployedAt: entry.startedAt,
      };
    }
    writeJson(manifestPath, release);
    const pending = RELEASE_NAMES.filter((name) => !release.contracts[name]);
    if (!pending.length) {
      release.status = "deployed-not-activated";
      writeJson(manifestPath, release);
      console.log(
        "Both v2 deployments are confirmed; no transaction submitted and no activation performed.",
      );
      return;
    }
    const runtime = async () => {
      await verifyNetwork();
      const at = await getFinalizedHead();
      const client = getClient();
      const [genesisHash, version, codeHash, ratio] = await Promise.all([
        client._request<string>("chain_getBlockHash", [0]),
        client._request<any>("state_getRuntimeVersion", [at.hash]),
        client._request<string>("state_getStorageHash", [
          "0x3a636f6465",
          at.hash,
        ]),
        getApi().constants.Revive.NativeToEthRatio({
          at: at.hash,
          signal: AbortSignal.timeout(30_000),
        }),
      ]);
      const actual = {
        genesisHash,
        specName: version.specName,
        specVersion: version.specVersion,
        transactionVersion: version.transactionVersion,
        codeHash,
        nativeToEthRatio: ratio.toString(),
      };
      if (
        Object.entries(profile.runtime).some(
          ([key, value]) => actual[key as keyof typeof actual] !== value,
        )
      )
        throw new Error(
          "Live runtime differs from the calibrated candidate profile",
        );
      return { at, ...actual };
    };
    const allowance = unsigned(
      budget.plan?.seedDemoPhoneAllowanceNative,
      "seed/demo/phone allowance",
    );
    const retained = unsigned(
      budget.plan?.retainedBalanceNative,
      "retained balance",
    );
    const observedRuntime = await runtime();
    const balance = await getAccountState(account.address);
    if (!balance.mapped)
      throw new Error(
        "Release deployer must already be mapped; no automatic mapping transaction",
      );
    const available =
      balance.nativeBalance > balance.nativeFrozen
        ? balance.nativeBalance - balance.nativeFrozen
        : 0n;
    const storedEstimate = remainingBudget({
      complete: budget.plan?.complete === true,
      allowance,
      retained,
      available,
      estimates: pending.map((name) => ({
        storageLimit: unsigned(
          budget.estimates[name].storageLimitWith20PercentNative,
          `${name} storage`,
        ),
        fee: unsigned(
          budget.nativeFeeQuotes?.quotes?.[name]?.estimatedFeeNative,
          `${name} fee`,
        ),
      })),
    });
    const plan: any = {
      observedAt: now(),
      mode: execute ? "explicit-execution-requested" : "read-only-plan",
      release: "v2",
      pending,
      runtime: observedRuntime,
      budgetArtifact: budgetPath,
      budgetSha256: digest(readFileSync(pathAt(budgetPath))),
      storedEstimate,
      signedTransactions: 0,
      activation: false,
    };
    writeJson(`${DIR}/plan.json`, plan);
    if (!storedEstimate.funded) {
      plan.status = "blocked-insufficient-full-plan-funds";
      writeJson(`${DIR}/plan.json`, plan);
      throw new Error(
        `Release requires ${storedEstimate.required} native base units including all remaining contracts, fees and rehearsal reserves; available ${available}. No deployment submitted.`,
      );
    }
    const prepare = async (name: ReleaseName, cronpot?: Address) => {
      const before = await getAccountState(account.address);
      const ctorData = constructorData(name, profile.contractGas, cronpot, tip);
      const estimate = await buildReviveDeploy({
        signer: account,
        code: compiled[name].code,
        ctorData,
        abi: compiled[name].abi,
      });
      const api = getApi();
      const bounded = (
        await api.apis.ReviveApi.instantiate_versioned(
          Enum("V1", {
            origin: account.address,
            value: 0n,
            gas_limit: estimate.weight_limit,
            storage_deposit_limit: estimate.storage_deposit_limit,
            code: Enum(
              "Upload",
              Binary.fromHex(concatHex([compiled[name].code, ctorData])),
            ),
            data: Binary.fromHex("0x"),
            salt: undefined,
          }),
          { signal: AbortSignal.timeout(45_000) },
        )
      ).value;
      if (
        !bounded.result.success ||
        bounded.result.value.result.flags !== 0 ||
        bounded.result.value.addr.toLowerCase() !==
          estimate.simulatedAddress.toLowerCase()
      )
        throw new Error(
          `${name} exact bounded deployment simulation failed or changed address`,
        );
      const fee = await estimate.tx.getEstimatedFees(account.txCreator);
      const after = await getAccountState(account.address);
      assertSimulationNonce(before.nonce, after.nonce);
      return {
        name,
        ctorData,
        estimate,
        fee,
        bounded,
        simulationNonce: before.nonce,
      };
    };
    const prepareRemaining = async () => {
      const results: Awaited<ReturnType<typeof prepare>>[] = [];
      let cronpot = release.contracts.Cronpot?.address as Address | undefined;
      for (const name of RELEASE_NAMES.filter((n) => !release.contracts[n])) {
        const result = await prepare(name, cronpot);
        results.push(result);
        if (name === "Cronpot") cronpot = result.estimate.simulatedAddress;
      }
      const state = await getAccountState(account.address);
      const fresh = remainingBudget({
        complete: true,
        allowance,
        retained,
        available:
          state.nativeBalance > state.nativeFrozen
            ? state.nativeBalance - state.nativeFrozen
            : 0n,
        estimates: results.map((r) => ({
          storageLimit: r.estimate.storage_deposit_limit,
          fee: r.fee,
        })),
      });
      writeJson(`${DIR}/plan.json`, {
        ...plan,
        observedAt: now(),
        status: fresh.funded ? "fresh-plan-funded" : "fresh-plan-underfunded",
        fresh,
        estimates: results.map((r) => ({
          name: r.name,
          ctorData: r.ctorData,
          simulatedAddress: r.estimate.simulatedAddress,
          simulationNonce: r.simulationNonce,
          weightLimit: r.estimate.weight_limit,
          storageDepositLimit: r.estimate.storage_deposit_limit,
          fee: r.fee,
          bounded: r.bounded,
        })),
        signedTransactions: Object.keys(journal.data.steps).length,
      });
      if (!fresh.funded)
        throw new Error(
          "Fresh simulations exceed the full remaining release budget; no new deployment submitted",
        );
      return results;
    };
    if (!execute) {
      await prepareRemaining();
      console.log(
        "Read-only v2 plan saved. No deployment submitted; --execute is required for a deliberate release.",
      );
      return;
    }
    for (const name of pending) {
      await runtime();
      const preparations = await prepareRemaining();
      const prepared = preparations.find((p) => p.name === name)!;
      assertSimulationNonce(
        prepared.simulationNonce,
        (await getAccountState(account.address)).nonce,
      );
      const opIntent = {
        releaseIntentHash: release.intentHash,
        name,
        bytecodeSha256: compiled[name].bytecodeSha256,
        ctorData: prepared.ctorData,
      };
      const receipt = await journal.step(
        `deploy-${name}`,
        opIntent,
        account,
        async (options) => {
          const client = getClient(),
            api = getApi();
          const finalized = await getFinalizedHead();
          const bestHash = await client._request<Hex>("chain_getBlockHash", []);
          const [
            finalState,
            bestState,
            nextIndex,
            pool,
            finalizedCode,
            bestCode,
          ] = await Promise.all([
            api.query.System.Account.getValue(account.address, {
              at: finalized.hash,
              signal: AbortSignal.timeout(30_000),
            }),
            api.query.System.Account.getValue(account.address, {
              at: bestHash,
              signal: AbortSignal.timeout(30_000),
            }),
            client._request<number>("system_accountNextIndex", [
              account.address,
            ]),
            client._request<Hex[]>("author_pendingExtrinsics", []),
            api.query.Revive.AccountInfoOf.getValue(
              prepared.estimate.simulatedAddress,
              { at: finalized.hash, signal: AbortSignal.timeout(30_000) },
            ),
            api.query.Revive.AccountInfoOf.getValue(
              prepared.estimate.simulatedAddress,
              { at: bestHash, signal: AbortSignal.timeout(30_000) },
            ),
          ]);
          const observation = {
            observedAt: now(),
            name,
            runtime: await runtime(),
            finalized,
            bestHash,
            finalizedNonce: finalState.nonce,
            bestNonce: bestState.nonce,
            nextIndex,
            expectedNonce: journal.data.steps[`deploy-${name}`]!.nonce,
            simulationNonce: prepared.simulationNonce,
            pendingPoolSize: pool.length,
            pendingHashes: pool.map((raw) => toHex(Blake2256(hexToBytes(raw)))),
            predictedAddress: prepared.estimate.simulatedAddress,
            contractPresentAtFinalized: finalizedCode != null,
            contractPresentAtBest: bestCode != null,
          };
          writeJson(`${DIR}/preflight-${name}.json`, observation);
          assertNoncePreflight(observation);
          return submitAndWatch(prepared.estimate.tx, account, {
            ...options,
            nonce: observation.expectedNonce,
          });
        },
        { expectedNonce: prepared.simulationNonce },
      );
      if (!successfulReceipt(receipt))
        throw new Error(
          "Release returned no authoritative finalized success; retain journal and reconcile",
        );
      release.contracts[name] = {
        ...receipt,
        address: instantiated(receipt),
        bytecodeSha256: compiled[name].bytecodeSha256,
        ctorData: prepared.ctorData,
        deployedAt: now(),
      };
      release.status =
        name === "MeterMend"
          ? "deployed-not-activated"
          : "partially-deployed-not-activated";
      release.updatedAt = now();
      writeJson(manifestPath, release);
    }
    console.log(
      json({
        status: release.status,
        contracts: Object.fromEntries(
          RELEASE_NAMES.map((name) => [name, release.contracts[name].address]),
        ),
        active: false,
        next: "Read back both addresses and validate actual bounded native execution before preparing a verified operational profile. Active v1 manifest is untouched.",
      }),
    );
  } finally {
    journal.close();
  }
});
