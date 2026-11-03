# MeterMend BUIDL answers

Working draft dated **November 3, 2026**. The direct-recovery demonstration is complete; successful automatic Cronpot execution, phone rehearsal, video and final submission remain outstanding.

**Internal submission deadline: November 5, 2026, 22:00 WAT (21:00 UTC).** The supplied official cutoff is November 6, 2026, 05:00 WAT (04:00 UTC). Use the internal deadline for the final paste/upload action.

## Project name and one-line description

**MeterMend â€” Every rental funds its next repair.**

MeterMend gives shared workshop equipment a protected repair reserve, an evidence-backed rental history, and permissionless deposit refunds on Portaldot V3.

## Problem

Makerspaces, campus hubs and tool libraries share valuable equipment, but repeated use creates wear without necessarily creating a maintenance budget. Operators need to separate earned income from refundable deposits and future repairs. When damage is disputed, members need a clear record of the evidence, decision and resulting payment.

## How it works

An operator registers an item, assigns a distinct arbiter and prints its QR code. A renter scans the code and pays a fee plus deposit. A configured share of the fee goes to that item's protected repair reserve; the rest becomes operator income. The operator records return evidence, starting a dispute window and scheduling a Cronpot job.

refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it.

This is the selected execution mechanism. The current live rehearsal has not proved a successful automatic refund: its first keeper call emitted `JobExecuted(success=false)` without `DepositRefunded`.

The refund contract independently checks the deadline and rental status. A damage proposal counts as the operator's approval and needs either the distinct renter or arbiter to approve a deduction; both other parties must reject to return the full deposit. Only an arbiter-approved repair can spend the item reserve. Operator income withdrawal cannot release reserve money. Damage assessment still relies on people, and unresolved votes can delay settlement.

## Why Portaldot

MeterMend combines Solidity accounting through pallet-revive with Substrate-signed wallet transactions. A funded runtime probe verified the exact conversion between native 14-decimal and EVM 18-decimal amounts: a factor of 10,000. On the observed V3 runtime, funding automatically maps native accounts to H160 addresses.

TransactionStorage provides native evidence storage; the funded P6 probe stored 1 KiB and the first live return stored a 42,569-byte labeled image. The application hashes the final displayed bytes and supports a persistent backup because native retention is finite; a durable public backup host is still outstanding. Cronpot is reusable timed-call infrastructure, and the indexer retains finalized native events beyond public-node pruning.

The signed Scheduler probe finalized with `BadOrigin`. We selected keeper execution and do not claim that the native Scheduler executes refunds.

## Progress to date

The contracts, mobile web interface, wallet flow, operator and arbiter screens, evidence handling, refund worker, durable event indexer, notification integration and resumable deployment/demo scripts are implemented. The web app and permanent proof report are public. Ping deployment, funded value movement, the Scheduler rejection and native evidence storage have finalized on V3, with actual receipts retained in the repository.

GitHub Actions passed **241 TypeScript/JavaScript tests and 49 Foundry tests**, typechecks and production build on revision `8253778f9948bf3ee8414363e63ec6266f41fac2` ([CI run](https://github.com/willy264/portal_dot/actions/runs/41730706218)). The earlier 29 browser checks and public mobile audit remain separate from the physical-phone rehearsal.

Both application contracts are finalized on V3. Cronpot deployed at block 265131 to `0x41635a685448cfa86da1600656f103a211e398f4`. MeterMend deployed at block 271379 to `0x61382db168db646b899234cd707c7ba0142c4071` in transaction `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17`. Before the deliberate same-nonce replacement, the original MeterMend hash was reconciled against account nonce, pool and contract state; the retained checks and journals preserve that history. Read-backs passed at finalized block 271384: Cronpot `nextJobId = 1`, MeterMend `cronpot()` matches the deployed Cronpot address, and `cronTip() = 1000000000000000` EVM base units (0.001 tPOT).

The distinct demo roles are funded and mapped. The camera (item 1) and printer (item 2) are registered with 120-second dispute windows, and their [public printable QR labels](https://metermend.vercel.app/metermend-qr.html) match the actual registration receipts. The camera's first rental finalized at block 271490; the reserve increased from zero to 0.002 tPOT, the expected 20% of its 0.01 tPOT fee. Native TransactionStorage stored the 42,569-byte return image at block 271494, and the return scheduled Cronpot job 1 at block 271498. That image is an explicitly labeled demo fixture, not evidence of an actual physical rental or repair. These completed steps are recorded in `deployments/demo-run.json`.

## Completed direct recovery

The existing-contract direct recovery completed on November 3, 2026. Rental 1 refunded **0.05 tPOT** through a direct keeper call. The second rental contributed **0.002 tPOT** to the reserve; its approved dispute added **0.015 tPOT** and refunded **0.035 tPOT**. The approved repair paid **0.0095 tPOT**. Income withdrawal paid **0.016 tPOT**, leaving the **0.0095 tPOT** reserve unchanged. A signed unauthorized repair approval finalized with `Revive.ContractReverted`; its live simulation decoded `NotArbiter` and the reserve/repair state stayed unchanged.

The original Cronpot callback remains a failed live attempt (OutOfGas). The successful refund was direct, not successful Cronpot execution. Corrected Cronpot passes 49 tests but is not deployed. MeterMend was not changed or redeployed. The 2,200 tPOT top-up arrived; recovery still stayed within the separate 83.49 tPOT cap.

| Step | Transaction | Block | Fee tPOT | New storage held tPOT | Value tPOT |
| --- | --- | ---: | ---: | ---: | ---: |
| Direct keeper refund | `0x53739d89deade004318a522a9517e97dc103432c73aad50f226cf6606ad523a7` | 311559 | 0.01851166742868 | 0 | 0 |
| Second rental | `0xadbf4bcdebde6cd209bc9f7e7337e0539389500c3511aeb372eda87ac032276e` | 311944 | 0.01911557879971 | 19.2075 | 0.06 |
| Atomic return and dispute | `0x8334168734195084b296cc894e5db67454211e62cba5902aafa4099a71811539` | 311948 | 0.03693391118196 | 34.5735 | 0.001 |
| Arbiter approves deduction | `0x93339980a2a8a6be74f1bd5dfd9911a7e7db171d90e3570ac43b5fc1b9621df5` | 311952 | 0.02181422393831 | 0 | 0 |
| Repair proposal | `0xbe3562ed2da7c14d43516299b61ba8c4ce316645033071ba362bfc83643ec7df` | 311957 | 0.02821192003563 | 15.366 | 0 |
| Arbiter approves repair | `0x055af7ced3d7504d8dbc72b93fe438c8b9469d25211b2ea23e5b99d7f9d679be` | 311961 | 0.02181174137856 | 3.8415 | 0 |
| Income withdrawal | `0x0f8dc5da23b5bc24c1e496da7b7cddb5cd20683fcd0b4f8d89579ae246743134` | 311966 | 0.01530933064561 | 0 | 0 |
| Unauthorized reserve spending rejected | `0x4882c3c260dca2c76c03f6fb6bbffe541e7656b2788e1e2fbd666169dd7fc3ed` | 311970 | 0.02180732110382 | 0 | 0 |

Conservative recovery spend: **73.23301569451228 tPOT**. No deployment spending was required.

## Outstanding work / current blocker

Successful automatic Cronpot refund remains outstanding. Keeper transaction `0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35` finalized at block 271528 with successful outer dispatch, but Cronpot emitted `JobExecuted` for job 1 with `success=false` and empty return data. No `DepositRefunded` event was emitted. The retained native trace identified an out-of-gas callback. A corrected Cronpot with deployment-specific gas bounds passes 49 contract tests and a simulation against historical chain state that emits both successful job execution and the matching refund. That simulation used code and balance overrides; it is not a live refund. The 2,200 tPOT top-up arrived. The owner selected direct recovery on the existing contracts; no new contract was deployed. A new Cronpot cannot rewrite MeterMend's immutable Cronpot address. The original failed receipt remains in `deployments/keeper-refund-observation.json`; no automatic retry or duplicate deployment is authorized by this result.

The direct refund, second-rental dispute and approval, reserve-funded repair, income-only withdrawal and signed reserve-spending rejection are complete. Successful automatic Cronpot execution remains outstanding. The owner has agreed to the actual phone/printed-QR rehearsal; [PHONE_REHEARSAL.md](PHONE_REHEARSAL.md) provides its runbook and evidence checklist. Agreement, generated labels and automated mobile screenshots are not completion evidence.

The keeper/indexer and Telegram bot are running locally; persistent public keeper/evidence hosting remains pending. The owner selected Render Free on November 2. A separate [read-only history preview](https://metermend-preview.onrender.com/health) is live, with signing and evidence uploads disabled because that plan sleeps and has ephemeral storage. Public health and the retained job list passed verification, recorded in `deployments/hosting-status.json`. The existing local keeper has not loaded the corrected code. Telegram acknowledged all six required event types, including the direct refund and finalized dispute/repair events. Actual group screenshots, the final video and BUIDL submission remain pending. See `deployments/notification-status.json` for the timestamped provider receipts. DeBox remains the target community integration; no live DeBox delivery is claimed.

The node previously stalled with zero peers and finalized block 265122, then resumed; both deployments have now finalized. Connectivity/finality have been intermittent, rather than permanently halted. See `deployments/deployment-status.json`, the transaction journals and newer chain observations for timestamped status; do not present an older pool observation as a current deployment result.

## Business model

The proposed business model is a small service fee per completed rental, aimed at makerspaces, campus hubs and tool libraries. Protected deposits and repair reserves remain separate from service revenue. The current testnet contract does not collect a MeterMend platform fee. Pilot work will validate pricing, repeat usage, maintenance coverage and the support needed by operators.

## Roadmap / why continued support matters

First, finish the complete live golden path and public deployment with durable operations and delivered notifications. Next, pilot with workshop operators to test onboarding, evidence retention, dispute handling, reserve adequacy and willingness to pay. Then document Cronpot for other Portaldot contracts and improve keeper reliability and community integrations. Continued support can provide reliable testnet access, persistent hosting and pilot partners while producing reusable infrastructure for the ecosystem.

## Testnet deployment details

Network: **Portaldot V3 testnet**. Chain ID: **420420777 (`0x190f1ca9`)**. Runtime spec: **3002**. Genesis hash: `0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd`.

| Record                           | Actual address / transaction hash                                    | Block / outcome                                                                            |
| -------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Ping runtime probe address       | `0x96ee88d272550530b518cbaa15a80cf5d38cdcfd`                         | Finalized deployment                                                                       |
| Ping deployment transaction      | `0x5003af976f3c78775fd5911a1a6308565a97136d18feeeb8406f1254324a011c` | 213570                                                                                     |
| P4 funded value movement         | `0x1e4af77310fe6f7afbf03b9310963a7a84bbfaebab50d291315c10127cbef7c2` | 213573 Â· Successful                                                                        |
| P5 signed Scheduler request      | `0x7a05968d67b82e52899f6414ec7acefda443b0fa76aae4a49aaa216e8ef16276` | 213576 Â· Failed with `BadOrigin`                                                           |
| P6 native evidence store         | `0x76ffd5d81bf8e97d1dde819ba38e1fb1b94f90e1cbfec8216667b5a75abcc4b1` | 213579 Â· Successful                                                                        |
| Cronpot deployment transaction   | `0xd60b3e1372d10c1ce547da5f7aeadbb943ec803634a161597ef855c501a0df93` | 265131 Â· Finalized successfully                                                            |
| Cronpot address                  | `0x41635a685448cfa86da1600656f103a211e398f4`                         | Finalized deployment                                                                       |
| MeterMend deployment transaction | `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17` | 271379 Â· Finalized successfully                                                            |
| MeterMend address                | `0x61382db168db646b899234cd707c7ba0142c4071`                         | Finalized deployment                                                                       |
| Earlier MeterMend attempt        | `0xcd4488ec20cc250520bb944ffca6d21806e379dfc35e3f2aea72147cf259e782` | Reconciled before deliberate same-nonce replacement; not the successful deployment receipt |
| First camera rental              | `0xb5485a043aa46e182a6511163a1716711262a5be98d437b42c1cf8fd13d13b67` | 271490 Â· Finalized; 0.002 tPOT reserve contribution verified                               |
| First return-image native store  | `0x958a2258295503cb547704b8c41a1f5b23ac06a64a7632808fd5a7d325c59226` | 271494 Â· Finalized; labeled fixture, 42,569 bytes                                          |
| First return / Cronpot schedule  | `0x826d77cd7a5ee1c7133f57051ae96d8e6593c3234b39de397f7ef16029c4ce4b` | 271498 Â· Finalized; job 1 scheduled                                                        |
| First keeper execution           | `0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35` | 271528 Â· Outer dispatch succeeded; callback failed; no refund                              |
| Complete live golden path        | Full direct-recovery receipts in `deployments/demo-run.json`                      | Direct recovery completed; original automatic callback failed                  |

The source of truth for completed deployments is `deployments/portaldot-v3.json`. Every new success must include its actual transaction and block hash. Retain failures and uncertain attempts as such.

## Links for the form

| Form field        | Value / status                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub            | https://github.com/willy264/portal_dot                                                                                                                                                                                                                                                                                                                                          |
| Public app        | https://metermend.vercel.app/                                                                                                                                                                                                                                                                                                                                                   |
| Application proof | https://metermend.vercel.app/proof                                                                                                                                                                                                                                                                                                                                              |
| Permanent report  | https://willy264.github.io/portal_dot/                                                                                                                                                                                                                                                                                                                                          |
| Pitch deck PDF    | [Public PDF](https://metermend.vercel.app/metermend-pitch.pdf); [Permanent report mirror](https://willy264.github.io/portal_dot/metermend-pitch.pdf). Both copies of the revised deck were downloaded and verified on November 1 with SHA-256 `31b14f906f0bb3781096ca9d54e889e74e412d8cdf48a791bda64137f6a11b85`. Refresh the deck again after the complete live demonstration. |
| Video             | **Pending. No completed video or public video URL exists yet.**                                                                                                                                                                                                                                                                                                                 |

## Final paste checklist

- Preserve both finalized deployment receipts; add the live golden-path evidence to the deck and regenerate the PDF/report when the demo completes.
- Confirm the golden-path transaction list and both reserve assertions are in `deployments/demo-run.json`.
- Verify public worker/evidence health and the real phone/printed-QR rehearsal.
- Attach actual Telegram delivery screenshots; retain DeBox's honest status.
- Both public PDF links matched the generated artifact on November 1. Recheck the SHA-256 after regenerating the deck, then paste the verified link above.
- Record only real testnet footage, add the voiceover, keep the video under 2:30, upload it, and replace the pending video field.
- Check README links and CI for the final commit; paste/update the BUIDL and retain submission confirmation before **November 5, 22:00 WAT**.
