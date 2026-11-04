# MeterMend final recording plan: 2 minutes 20 seconds

Updated November 4, 2026. Corrected Cronpot is deployed at `0x232c9673766794d6106a68cf4480678c73658f4c`; existing MeterMend remains `0x61382db168db646b899234cd707c7ba0142c4071`. The corrected automatic execution finalized at block **322488**, tx `0x8c45df7bebdaaa714c7490bac16538455196445eec253097b4d6a4e80b373b63`, with both `JobExecuted(success=true)` and `DepositRefunded`.

## The proof sequence

Original Cronpot failed (OutOfGas, tx `0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35`). The deposit was refunded directly (tx `0x53739d89deade004318a522a9517e97dc103432c73aad50f226cf6606ad523a7`). The corrected Cronpot then executed a live automatic refund (tx `0x8c45df7bebdaaa714c7490bac16538455196445eec253097b4d6a4e80b373b63`).

MeterMend still creates its built-in job on the immutable original Cronpot. For the corrected demonstration, the keeper separately registers `MeterMend.finalizeRefund(3)` on corrected Cronpot with `executeAfter = refundAt`, then executes the due job. This external registration does not redeploy or rewire MeterMend.

## Capture order and edit

| Time | Actual footage | Evidence / overlay |
| --- | --- | --- |
| 0:00-0:15 | Catalogue, camera and repair-reserve panel | Portaldot V3 testnet; actual capture date |
| 0:15-0:32 | Equipment page and new rental receipt; physical QR scan only if actually recorded | Rental 3, fee/deposit and reserve increase; tx `0x227e8d1a...2b571c` |
| 0:32-0:45 | Return evidence, original job and deadline | DEMO FIXTURE label; actual return hash; show the measured OutOfGas failure for original job 3 |
| 0:45-1:00 | Original failure and direct recovery receipts | Failure `0x2b9249...75e35`; direct refund `0x53739d89...d523a7`; actual dates |
| 1:00-1:25 | Corrected address, keeper registration, timer and finalized execution | Schedule 0xc03b258b...dd8011e; execute 0x8c45df7b...373b63; show both events at block 322488 |
| 1:25-1:45 | Earlier completed dispute and repair receipts | November 3 run: deduction 0.015, renter refund 0.035, repair payment 0.0095 tPOT |
| 1:45-2:00 | Earlier income withdrawal, unchanged reserve and signed rejection | November 3 run: income 0.016; reserve remains 0.0095 tPOT; rejection `0x4882c3c2...7fc3ed` |
| 2:00-2:12 | Public proof, actual Telegram messages and Portaldot findings | Native 14 / EVM 18 decimals; P5 `BadOrigin`; DeBox not live |
| 2:12-2:20 | Logo, app/proof URLs and closing line | Keep public links readable |

The voiceover is approximately 255 words: about 1:49 at 140 words/minute, or 2:19 at 110. Leave short pauses and export below 2:30. Display hashes instead of reading them aloud. Do not invent wallet approvals: the November 3 return/dispute used one atomic batch. Its reserve ended at 0.0095 tPOT; rental 3 then increased it to 0.0115. Label these separate snapshots.

## Voiceover

Shared equipment wears out. MeterMend gives each item a protected repair reserve, separate from rental income and refundable deposits.

A renter opens the equipment page and pays a fee plus deposit. In our camera demo, twenty percent of the fee goes into the item's repair reserve. Return evidence starts a two-minute dispute window.

refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it.

We kept the failures visible. The original Cronpot callback ran out of gas. We refunded that deposit directly, then deployed only corrected Cronpot. MeterMend stayed at the same address.

For a new rental, MeterMend still creates its original job. Our keeper separately registers the same refund deadline and callback on corrected Cronpot. After the deadline, the keeper executes that job. This live transaction emits both successful JobExecuted and DepositRefunded. The contract checks the deadline and rental status before releasing the deposit.

Separate finalized receipts show the dispute and repair flow. An operator proposes a thirty-percent deduction. The distinct arbiter approves: part of the deposit goes to the reserve, and the rest returns to the renter.

An approved repair is paid from that reserve. Withdrawing operator income leaves the reserve unchanged, and an unauthorized reserve-spending attempt is rejected.

Portaldot provides pallet-revive, Substrate signing and native evidence storage. We verified the native-to-EVM amount conversion. The signed native Scheduler request returned BadOrigin, so it does not execute refunds.

Telegram received the dispute and repair updates. The proof page preserves addresses, hashes, actual payments and failures.

MeterMend. Every rental funds its next repair.

## Recording integrity and handoff

The original failure, direct recovery and new corrected execution are separate transactions and separate rentals. Show actual dates and IDs. The native Scheduler did not execute refunds. External keeper registration on corrected Cronpot is part of the demonstrated integration path; do not imply MeterMend creates corrected jobs itself.

Use real testnet footage and actual Telegram group messages. Keep DEMO FIXTURE labels visible and disclose that the renter also acted as the demo repair provider. Retain uncut source clips and use explicit time-jump captions. Desktop checks and terminal receipts are not a physical-phone rehearsal.

Paid hosting was declined. Use the one-command [local recording keeper](HOSTING_FINAL.md):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-recording-keeper.ps1
```

Free GitHub Actions is configured for periodic attempts roughly every ten minutes; timing is not guaranteed, and configuration alone does not prove execution. Do not run it simultaneously with a local signer using the same account. Ordinary app rentals lacking an active corrected job use the keeper's permissionless direct fallback. The public **Finalize refund** button is another manual fallback; neither establishes successful Cronpot execution. The corrected proof run disables direct fallback and must show both Cronpot and MeterMend events. Render Free remains a read-only history preview that can sleep. Durable public evidence uploads remain outstanding.

The owner handles the real printed-QR phone scan, wallet rehearsal, Telegram screenshots, voiceover and video upload. The QR sheet remains valid because MeterMend and the item IDs are unchanged. Follow [PHONE_REHEARSAL.md](PHONE_REHEARSAL.md), the [recording manifest](templates/recording-manifest.template.json) and [shot map](templates/shot-map.template.csv). After exporting a readable 1080p MP4, watch it through and verify anonymous playback before inserting the actual URL in [SUBMISSION.md](SUBMISSION.md). Video URL remains **pending**; no recording or upload is claimed.

Internal submission deadline: **November 5, 2026, 22:00 WAT**.

Free keeper verification: [two manual scans passed, including journal restoration](https://github.com/willy264/portal_dot/actions/runs/41868737068). Both were idle and submitted no transactions. The scheduled trigger is enabled; timing is not guaranteed. It uses a separate mapped account funded with 10 tPOT. The live corrected refund was executed by the local keeper.
