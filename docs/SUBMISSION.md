# MeterMend BUIDL answers

Submission draft dated **November 4, 2026**. Corrected Cronpot is deployed; MeterMend remains at its original address. The direct-recovery demonstration is complete. The corrected automatic-refund run is complete; phone rehearsal, video and final submission remain outstanding.

**Internal submission deadline: November 5, 2026, 22:00 WAT (21:00 UTC).** The supplied official cutoff is November 6, 2026, 05:00 WAT (04:00 UTC). Use the internal deadline for the final paste/upload action.

## Project name and one-line description

**MeterMend ? Every rental funds its next repair.**

MeterMend gives shared workshop equipment a protected repair reserve, an evidence-backed rental history, and permissionless deposit refunds on Portaldot V3.

## Problem

Makerspaces, campus hubs and tool libraries share valuable equipment, but repeated use creates wear without necessarily creating a maintenance budget. Operators need to separate earned income from refundable deposits and future repairs. When damage is disputed, members need a clear record of the evidence, decision and resulting payment.

## How it works

An operator registers an item, assigns a distinct arbiter and prints its QR code. A renter scans the code and pays a fee plus deposit. A configured share of the fee goes to that item's protected repair reserve; the rest becomes operator income. The operator records return evidence, starting a dispute window and scheduling a Cronpot job.

refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it.

MeterMend still creates its built-in job on the immutable original Cronpot. For the corrected demonstration, the keeper separately registers `MeterMend.finalizeRefund(rentalId)` on corrected Cronpot with `executeAfter = refundAt`, then executes the due job. MeterMend has not been redeployed or rewired. The corrected live execution is counted only after `JobExecuted(success=true)` and `DepositRefunded` appear in the same finalized transaction.

The refund contract independently checks the deadline and rental status. A damage proposal counts as the operator's approval and needs either the distinct renter or arbiter to approve a deduction; both other parties must reject to return the full deposit. Only an arbiter-approved repair can spend the item reserve. Operator income withdrawal cannot release reserve money. Damage assessment still relies on people, and unresolved votes can delay settlement.

## Why Portaldot

MeterMend combines Solidity accounting through pallet-revive with Substrate-signed wallet transactions. A funded runtime probe verified the exact conversion between native 14-decimal and EVM 18-decimal amounts: a factor of 10,000. On the observed V3 runtime, funding automatically maps native accounts to H160 addresses.

TransactionStorage provides native evidence storage; the funded P6 probe stored 1 KiB and the first live return stored a 42,569-byte labeled image. The application hashes the final displayed bytes and supports a persistent backup because native retention is finite; a durable public backup host is still outstanding. Cronpot is reusable timed-call infrastructure, and the indexer retains finalized native events beyond public-node pruning.

The signed Scheduler probe finalized with `BadOrigin`. We selected keeper execution and do not claim that the native Scheduler executes refunds.

## Progress to date

The contracts, mobile web interface, wallet flow, operator and arbiter screens, evidence handling, refund worker, durable event indexer, notification integration and resumable deployment/demo scripts are implemented. The web app and permanent proof report are public. Ping deployment, funded value movement, the Scheduler rejection and native evidence storage have finalized on V3, with actual receipts retained in the repository.

November 4 validation passed **276 TypeScript/JavaScript tests and 49 Foundry tests**, all typechecks and the production build. Current CI and publication checks are recorded in `deployments/final-push-verification.json`. The earlier 29 browser checks and public mobile audit are not the physical-phone rehearsal.

Both application contracts are finalized on V3. Cronpot deployed at block 265131 to `0x41635a685448cfa86da1600656f103a211e398f4`. MeterMend deployed at block 271379 to `0x61382db168db646b899234cd707c7ba0142c4071` in transaction `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17`. Before the deliberate same-nonce replacement, the original MeterMend hash was reconciled against account nonce, pool and contract state; the retained checks and journals preserve that history. Read-backs passed at finalized block 271384: Cronpot `nextJobId = 1`, MeterMend `cronpot()` matches the deployed Cronpot address, and `cronTip() = 1000000000000000` EVM base units (0.001 tPOT).

The distinct demo roles are funded and mapped. The camera (item 1) and printer (item 2) are registered with 120-second dispute windows, and their [public printable QR labels](https://metermend.vercel.app/metermend-qr.html) match the actual registration receipts. The camera's first rental finalized at block 271490; the reserve increased from zero to 0.002 tPOT, the expected 20% of its 0.01 tPOT fee. Native TransactionStorage stored the 42,569-byte return image at block 271494, and the return scheduled Cronpot job 1 at block 271498. That image is an explicitly labeled demo fixture, not evidence of an actual physical rental or repair. These completed steps are recorded in `deployments/demo-run.json`.

## Completed direct recovery

The existing-contract direct recovery completed on November 3, 2026. Rental 1 refunded **0.05 tPOT** through a direct keeper call. The second rental contributed **0.002 tPOT** to the reserve; its approved dispute added **0.015 tPOT** and refunded **0.035 tPOT**. The approved repair paid **0.0095 tPOT**. Income withdrawal paid **0.016 tPOT**, leaving the **0.0095 tPOT** reserve unchanged. A signed unauthorized repair approval finalized with `Revive.ContractReverted`; its live simulation decoded `NotArbiter` and the reserve/repair state stayed unchanged.

Original Cronpot failed (OutOfGas, tx `0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35`). The deposit was refunded directly (tx `0x53739d89deade004318a522a9517e97dc103432c73aad50f226cf6606ad523a7`). The corrected Cronpot then executed a live automatic refund (tx `0x8c45df7bebdaaa714c7490bac16538455196445eec253097b4d6a4e80b373b63`). The original failure and direct recovery remain preserved separately. MeterMend was not changed or redeployed. The 2,200 tPOT top-up arrived; the November 3 recovery stayed within its separate 83.49 tPOT cap.

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

## Corrected Cronpot demonstration

Only corrected Cronpot was deployed on November 4: address `0x232c9673766794d6106a68cf4480678c73658f4c`, transaction `0x295eb372f486fbc53a10b11cbc1aa2265fd35a5d88bbf5d78abca9e3a7f21a7b`, finalized block **317301**. Its deployment and read-back evidence are in [corrected-cronpot.json](../deployments/corrected-cronpot.json). The new rental uses existing MeterMend `0x61382db168db646b899234cd707c7ba0142c4071`; the keeper's external registration on corrected Cronpot is an explicitly disclosed integration path.

Rental **3** finalized at block **317426**, transaction `0x227e8d1a237afa3eff399667dc769d9a474cc2cda8ddc42f1557cc69d12b571c`, increasing the item's reserve from **0.0095** to **0.0115 tPOT**. Return finalized at block **318675**, transaction `0x091fe007d82f4968590cfbc7800c70eab4a714f9bf0582024bb93eacca1a217b`. It created original job **3**; the keeper separately registered corrected job **1** at the same `refundAt = 1793785644` deadline. The built-in original job failed with OutOfGas (actual native trace). Corrected execution finalized at block **322488**, transaction `0x8c45df7bebdaaa714c7490bac16538455196445eec253097b4d6a4e80b373b63`, emitting both `JobExecuted(success=true)` and `DepositRefunded`. Exactly **0.05 tPOT** returned to the renter; rental 3 is Closed with zero deposit.

| Corrected run record | Transaction | Finalized block / result |
| --- | --- | --- |
| Corrected Cronpot deployment | `0x295eb372f486fbc53a10b11cbc1aa2265fd35a5d88bbf5d78abca9e3a7f21a7b` | 317301; address `0x232c9673766794d6106a68cf4480678c73658f4c` |
| Keeper funding | `0xcf995fd8410642f8d62c6629f468f864f13dafe46624d4cfdebae72b5c3af242` | 317378 |
| Renter funding | `0xa0a4007cc6cfc0190f5dcd502d8db467c2d835d28c7d50576ba609d83e024fdd` | 317421 |
| Rental 3 | `0x227e8d1a237afa3eff399667dc769d9a474cc2cda8ddc42f1557cc69d12b571c` | 317426; reserve increased by 0.002 tPOT |
| Rental 3 return | `0x091fe007d82f4968590cfbc7800c70eab4a714f9bf0582024bb93eacca1a217b` | 318675; original job 3 scheduled |
| Keeper registration on corrected Cronpot | `0xc03b258b0f6985cfdc367492e1320ba7ef06fba5ac9f34c08e051ce6fdd8011e` | 318704; corrected job 1, same refund deadline |
| Original Cronpot execution for rental 3 | `0x2b3591d343415e03c1fa12bc252aa8bacfcfc3ef5e935554d5d0d5f947f14599` | 318709; `JobExecuted(success=false)`, no refund; actual native trace confirms OutOfGas |

| Corrected automatic refund | `0x8c45df7bebdaaa714c7490bac16538455196445eec253097b4d6a4e80b373b63` | 322488; JobExecuted(success=true) and DepositRefunded |
| Dedicated Actions keeper funding | `0x89dfafd2ec8fc020c0efd0bfa29e98170c6d084f164e785483263b34e2f41b39` | 322619; 10 tPOT, mapped account |

## Hosting and outstanding work

Paid hosting was declined. The selected free setup prepares GitHub Actions to run the corrected keeper approximately every ten minutes, with restored transaction journals and no overlapping signer. GitHub may delay scheduled runs; this is not an always-on guarantee. A one-command supervised local keeper is ready for recording. For ordinary app rentals lacking an active corrected job, the keeper provides a permissionless direct fallback; this produces `DepositRefunded`, not `JobExecuted(success=true)`. The public rental page also offers **Finalize refund** with its finalized transaction hash. The corrected recording run disables direct fallback so its successful proof must come through the corrected Cronpot. [Commands and observed hosting status](HOSTING_FINAL.md).

The app is on [Vercel](https://metermend.vercel.app/); [Render Free](https://metermend-preview.onrender.com/health) provides a read-only history preview that can sleep. It has no signer or durable evidence uploads. The UI identifies when that free history service may be waking up. Persistent public evidence storage remains outstanding.

Telegram acknowledged all six required event types from the existing direct-recovery run. Actual group screenshots, the physical phone/printed-QR rehearsal, recorded footage and voiceover, video upload and final BUIDL submission remain pending. DeBox remains the target integration and is not live. Use [PHONE_REHEARSAL.md](PHONE_REHEARSAL.md) and [DEMO_VIDEO.md](DEMO_VIDEO.md); generated labels and automated mobile checks do not establish a completed physical-phone rehearsal.

## Known limitations

The indexer is behind the live chain; retained transaction proofs and direct contract reads remain available, but the history feed is incomplete.

Human judgment determines damage, native evidence retention is finite, free scheduled execution can be delayed, and the corrected job is separately registered by the keeper rather than by MeterMend's immutable original integration. Demo images are labeled fixtures. The renter also served as the demo repair provider; the arbiter was distinct.

## Business model

The proposed business model is a small service fee per completed rental, aimed at makerspaces, campus hubs and tool libraries. Protected deposits and repair reserves remain separate from service revenue. The current testnet contract does not collect a MeterMend platform fee. Pilot work will validate pricing, repeat usage, maintenance coverage and the support needed by operators.

## Roadmap / why continued support matters

Finish the recorded demonstration and submission, then provide durable public evidence storage and improve keeper reliability. Pilot with workshop operators to test onboarding, evidence retention, dispute handling, reserve adequacy and willingness to pay. Document Cronpot for other Portaldot contracts and pursue community integrations. Continued support can provide reliable testnet access, persistent hosting and pilot partners while producing reusable infrastructure for the ecosystem.

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

The original deployment manifest is `deployments/portaldot-v3.json`; the separate corrected contract is in `deployments/corrected-cronpot.json`. All corrected-run receipts belong in `deployments/demo-run.json.correctedAutomation`, preserving the original failure and direct recovery. Every success includes its actual transaction and block hash.

## Links for the form

| Form field        | Value / status                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub            | https://github.com/willy264/portal_dot                                                                                                                                                                                                                                                                                                                                          |
| Public app        | https://metermend.vercel.app/                                                                                                                                                                                                                                                                                                                                                   |
| Application proof | https://metermend.vercel.app/proof                                                                                                                                                                                                                                                                                                                                              |
| Permanent report  | https://willy264.github.io/portal_dot/                                                                                                                                                                                                                                                                                                                                          |
| Pitch deck PDF | [Public PDF](https://metermend.vercel.app/metermend-pitch.pdf) and [permanent mirror](https://willy264.github.io/portal_dot/metermend-pitch.pdf). Both verified November 3, 2026; SHA-256 `7ce9479973bace084a84c843f7f4da4cf4a47e7d681256466e538bf13ac94dd8`. |
| Video             | **Pending. No completed video or public video URL exists yet.**                                                                                                                                                                                                                                                                                                                 |

## Final paste checklist

- Preserve both finalized deployment receipts; add the live golden-path evidence to the deck and regenerate the PDF/report when the demo completes.
- Confirm the golden-path transaction list and both reserve assertions are in `deployments/demo-run.json`.
- Verify public worker/evidence health and the real phone/printed-QR rehearsal.
- Attach actual Telegram delivery screenshots; retain DeBox's honest status.
- Both revised public PDFs matched the generated artifact on November 3. Use the verified links above.
- Record only real testnet footage, add the voiceover, keep the video under 2:30, upload it, and replace the pending video field.
- Check README links and CI for the final commit; paste/update the BUIDL and retain submission confirmation before **November 5, 22:00 WAT**.
