# MeterMend implementation decisions

Date: October 27, 2026. Facts below distinguish read-only simulations, completed funded probes and work still pending. The authoritative requirements and amendments are in [SPEC.md](../SPEC.md).

## Phase 0

| Probe             | Status                                  | Evidence / decision                                                                                                                                                                                                                                                                  |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1 V3 identity    | Read-only verified                      | Supplied V3 endpoints respond with runtime spec3002 and EVM chain420420777. Correct hex is0x190f1ca9; original0x190F1B29 represented420420393. Reproducible script evidence is being collected in deployments/probe.json.                                                            |
| P2 pallets        | Read-only verified                      | Revive, Scheduler, TransactionStorage, Multisig, Proxy, Identity and Utility exist. Scheduler presence does not establish the signed origin's permission to schedule. Metadata and constants are saved in probe.json.                                                                |
| P3 bytecode       | Read-only simulation passed             | V3 accepted solc0.8.30 EVM bytecode, targetprague, with successful instantiate result and flags0. Use EVM/Foundry compilation. The simulation used the participant's funded public address without signing; this is not deployment evidence. Full results in deployments/probe.json. |
| P4 units          | Funded verification passed              | A native value of10000000000 produced Ping's EVM value100000000000000: exact ratio10000. Transaction0x1e4af77310fe6f7afbf03b9310963a7a84bbfaebab50d291315c10127cbef7c2, block213573. Native14/EVM18 decimals; reject fractional native-unit dust.                                    |
| P5 scheduler      | Signed origin rejected; keeper selected | The actual schedule_after request finalized with BadOrigin, tx0x7a05968d67b82e52899f6414ec7acefda443b0fa76aae4a49aaa216e8ef16276, block213576. No Scheduler.Dispatched success is claimed. Use the pre-authorized keeper fallback.                                                   |
| P6 evidence bytes | Funded store passed                     | A1KiB store succeeded, tx0x76ffd5d81bf8e97d1dde819ba38e1fb1b94f90e1cbfec8216667b5a75abcc4b1, block213579. Storage fee11240 native units; MaxTransactionSize8MiB, retention100800 blocks. Enable native evidence with an application backup.                                          |
| P7 raw EOA        | Optional; not run                       | Default all writes remain Substrate-signed.                                                                                                                                                                                                                                          |

The old mainnet endpoint is deliberately excluded from implementation/deployment. No seeds, credentials or signer private material belong in evidence files.

The dedicated Ping contract deployed at0x96ee88d272550530b518cbaa15a80cf5d38cdcfd in transaction0x5003af976f3c78775fd5911a1a6308565a97136d18feeeb8406f1254324a011c, block213570. [Funded probe results](../deployments/funded-probe.json) preserve all receipts, including the scheduler rejection. Ping is not an application deployment. The100tPOT funding transfer left66.48817150285716tPOT after these probes; additional funds are required for Cronpot/MeterMend.

## Exact toolchain

Requested package lines were checked against the npm registry. Pins: Node22.23.4; pnpm10.34.9; TypeScript5.9.3; solc0.8.30; PAPI3.3.0; substrate-bindings0.21.2; viem2.57.12; RxJS7.8.2; tsx4.23.15; Vitest5.0.5. Foundry1.8.6 (commit6bad0a66de7c83f7b33695044138f0f5fa4c5990) is the current stable release fetched from the official repository. Node22 is installed in an ignored project-local tools directory because the machine default Node25 falls outside the selected Vitest engine range.

PAPI3 migration is material: imports use `polkadot-api/ws`; extension accounts supply `txCreator`; transactions use `createSubmitAndWatch`. Exact Revive types come from generated metadata. Sources: [PAPI3 migration](https://papi.how/v3migration/), [extension API](https://papi.how/signers/extensions/).

GitHub dependency scanning and the npm audit identified vulnerable transitive build-tool packages. Pin overrides to `tmp@0.2.7` (used by solc, including the follow-up type-confusion fix) and `deepmerge-ts@8.0.0` (used by PAPI CLI's package writer), preserving requested chain-facing versions. Validate compilation and offline descriptor generation after these substitutions. Sources: [tmp follow-up advisory](https://github.com/advisories/GHSA-7c78-jf6q-g5cm), [deepmerge-ts advisory](https://github.com/RebeccaStevens/deepmerge-ts/security/advisories/GHSA-ggr8-5vv4-36mx).

## Contract review corrections

Before implementation, SPEC amendments6–9 add unsettled-rental transfer protection, distinct voter roles, bounded tip conversion, deferred executor tips and explicit wide arithmetic/zero-refund behavior. These preserve the specified rental/refund/reserve model while closing concrete callback and role-transition failures. Original Cronpot cancellation already had a reentrancy modifier; retaining it is a transcription clarification rather than a newly discovered original-code defect.

Cancelled Cronpot tips received by MeterMend remain unallocated surplus/dust, as explicitly requested. They are not operator income or item reserve. No new dispute timeout is introduced: a missing human vote can leave funds disputed. Checked push refunds can fail for a renter contract that refuses payment; the liability remains intact, and permissionless finalization does not bypass recipient refusal.

SPEC amendment11 bounds Cronpot target execution and return data. Insufficient outer gas must leave a job scheduled, rather than allowing an executor to manufacture failure and collect its tip. A target that exceeds the documented allowance can still fail; compatibility and the refund allowance require actual V3 simulation before scheduling.

The tiny Phase0 deployment simulation required a maximum storage deposit of33.624tPOT. Budget application deployment from each compiled contract's dry-run rather than assuming ordinary EVM gas costs or treating the initial100tPOT transfer as sufficient for the entire demo.

Observed Revive.AutoMap=true means finalized funding automatically registers the native account's H160; explicit map_account/unmap_account are disabled in this configuration. SPEC amendment12 updates wallet activation accordingly. Native-to-EVM balance ratios must account for the existential deposit: the funded500tPOT account exposes499.9tPOT in the EVM balance view. Amount conversion uses the runtime constant10000, not naive division of those two balances.

Storage constants are DepositPerByte=0.06tPOT, DepositPerItem=0.15tPOT, and DepositPerChildTrieItem=0.0015tPOT. Contract bytecode/storage deposits can exceed the participant's initial allocation. Record the compiled-contract estimate before broadcasting.

The product constructor dry-run rejected nonempty native `data` with `Revive.EvmConstructorNonEmptyData`. For EVM deployments, append ABI-encoded constructor arguments to creation bytecode and leave native `data` empty. The shared helper performs this centrally while preserving separate code/ctorData inputs for callers. No deployment transaction was sent to discover this behavior.

## Evidence and durability

Hash the final stored image bytes after compression. Native transaction storage, if enabled, is expiring storage and must retain an app-side availability strategy. Application disk/SQLite must live on persistent storage; a Vercel function's ephemeral disk is not a production persistence mechanism.

## Notifications

DeBox ordinary-bot rate limits can be stricter than1message/second: the documented ordinary quota is5messages per rolling minute. The outbox must satisfy both, respect Retry-After/business errors, and never label unconfigured delivery successful. Exact body fields: chat_id, chat_type, content, parse_mode. Source: [DeBox API](https://docs.debox.pro/en/ApiOnePage/).

## Git workflow

Commit and push each completed verified feature separately, as requested. Root commits only the intended files; unfinished concurrent features remain unstaged. Preserve factual deployment timestamps and real progress history.

## October 29 continuation

An additional 380 tPOT reached the dedicated deployer, taking its free balance to 446.48817150285716 tPOT. V3 genesis, runtime spec 3002 and runtime code hash remain unchanged. Fresh unsigned simulations still estimate 383.4735 tPOT for Cronpot and 774.5265 tPOT for MeterMend. The guarded deployment has not submitted either contract because the available balance remains below its full-plan budget.

The web app is published at https://metermend.vercel.app/ with Node 22 and the monorepo project root set to `apps/web`. Anonymous home, proof and public-configuration requests succeeded. The configuration retains verified P4/P6 data and reports missing application contracts and persistent evidence storage honestly. Persistent keeper/evidence hosting and notification credentials remain separate requirements.
