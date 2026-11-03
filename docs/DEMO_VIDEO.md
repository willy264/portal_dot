# MeterMend recording plan: 2 minutes 20 seconds

Updated November 3, 2026. The [direct recovery](LIVE_RECOVERY.md) completed on the existing deployment. Its first Cronpot callback failed with `OutOfGas`; the keeper subsequently refunded rental 1 by calling MeterMend directly. The second rental, dispute, approved repair, income-only withdrawal and signed reserve-spending rejection all finalized. Do not label this run a successful automatic Cronpot refund.

The selected mechanism remains: **refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it.** Follow this immediately with the actual finding: **the first live callback ran out of gas; this demo refunded directly. Corrected Cronpot passes 49 tests and is not deployed.** The signed native Scheduler probe returned `BadOrigin` (P5); native Scheduler did not execute refunds.

Use actual testnet UI, finalized receipts and delivered Telegram messages. Label repository images **DEMO FIXTURE**, and disclose that the renter also served as the demo repair provider. The physical-phone rehearsal is not yet recorded. Keep fresh phone transactions separate from the November 1/3 scripted receipts.

| Time | Actual footage | Voiceover |
| --- | --- | --- |
| 0:00-0:15 | Logo, catalogue and camera | Shared equipment wears out. MeterMend gives each item a protected repair reserve, separate from deposits and income. |
| 0:15-0:35 | Real printed QR scan and phone terms, then clearly labeled recorded rental receipt | A renter pays 0.01 tPOT plus a 0.05 deposit. Twenty percent of the fee goes into the camera's repair reserve. |
| 0:35-0:55 | Return, native evidence and scheduled job; failed callback receipt | Returns carry evidence and a dispute window. Refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it. Our first live callback ran out of gas. |
| 0:55-1:10 | Direct refund at 311559 and Telegram message | We preserved that failure and recovered the exact 0.05 deposit with a direct keeper call. Corrected Cronpot passes 49 tests; it is not deployed. |
| 1:10-1:30 | Second rental, atomic return/dispute and arbiter receipt at 311952 | The operator proposes a 30 percent deduction. The distinct arbiter approves: 0.015 goes to the reserve and 0.035 returns to the renter. |
| 1:30-1:50 | RepairPaid at 311961; withdrawal at 311966; reserve comparison | An approved repair pays 0.0095 from the reserve. Withdrawing 0.016 in income leaves the remaining 0.0095 reserve untouched. |
| 1:50-2:05 | Signed rejection at 311970; proof page and real Telegram messages | An unauthorized reserve-spending approval was rejected. These receipts preserve what ran live, including failures. |
| 2:05-2:20 | Addresses, proof/deck links and logo | Built with pallet-revive, Substrate signing and native evidence on Portaldot V3. MeterMend: every rental funds its next repair. |

Full hashes and actual costs are in [LIVE_RECOVERY.md](LIVE_RECOVERY.md) and [demo-run.json](../deployments/demo-run.json). Overlay the actual UTC date, block and shortened hash. Return/dispute used one native atomic batch; do not depict separate wallet approvals for it. Use time-jump captions and keep raw footage. Simulations, fixtures and desktop screenshots must not be represented as phone transactions.

Telegram has acknowledged all six required event types. Capture the real group messages; DeBox is the target integration and is not live. Free Render provides a read-only preview, not an always-on signer or durable evidence uploads. Retain those limitations in the submission.

The owner handles physical QR/phone capture, voiceover and video upload. Follow [PHONE_REHEARSAL.md](PHONE_REHEARSAL.md), the [recording manifest](templates/recording-manifest.template.json) and [shot map](templates/shot-map.template.csv). Export a readable 1080p MP4 under 2:30, watch it through, verify anonymous public playback, then add its actual URL and duration to [SUBMISSION.md](SUBMISSION.md). Video URL remains **pending**; no recording or upload is claimed.

Internal submission deadline: **November 5, 2026, 22:00 WAT**.
