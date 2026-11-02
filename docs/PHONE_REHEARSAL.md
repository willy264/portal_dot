# Public phone and printed-QR rehearsal

This is a runbook, not evidence that the phone rehearsal has already passed. The owner has agreed to print the labels and run the phone flow. Do this after the scripted live golden path is recorded; keep its existing receipts and record the phone run as a separate rehearsal.

**November 2 readiness:** the original release's automatic refund failed. The corrected release is awaiting test tokens and deployment. The existing public labels come from the original registrations; regenerate them from the corrected release's finalized records before the payment rehearsal. The free Render preview is read-only and does not provide the required keeper or persistent evidence uploads.

**Submission target: November 5, 2026, 22:00 WAT.** Allow time for recording, voiceover and uploading after the phone checks.

## Prepare the real labels

Both contracts are finalized and two items are registered: camera **1**, printer **2**, each with a 120-second dispute window. The generated labels and registration receipts are retained in `deployments/qr-labels.json`. Regenerate only from those verified records:

```sh
pnpm exec tsx scripts/print-qr.ts
```

The generator reads the actual seed IDs and checks that each retained successful receipt contains the matching `ItemRegistered` event from the deployed MeterMend contract. It creates `apps/web/public/metermend-qr.html` and `deployments/qr-labels.json`. It refuses to invent IDs when deployment or seeding is missing.

After publishing, open **https://metermend.vercel.app/metermend-qr.html**. Use **Print labels / Save as PDF**, A4, 100% scale. Keep the QR's white border. Cut out a label and attach it to the corresponding demonstration item. Photograph the printed label in place. The generator's output alone is not proof that the phone scan or rental flow works.

## Accounts and readiness

Use a phone browser with an installed, supported Substrate wallet injection. The app supports the injected account interface used by SubWallet/Talisman/Polkadot.js; mobile browser/wallet compatibility must be checked on the actual phone. If no wallet appears, use the wallet's browser if it exposes compatible injection, or record the incompatibility as a UI/platform blocker. Never claim a phone payment succeeded from a desktop-only check.

| Role     | What it does                                                                        | Identity check                                                                            |
| -------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Operator | Registers the item, marks returns, proposes a deduction/repair and withdraws income | The item operator must match the selected wallet's mapped H160                            |
| Renter   | Pays rental fee + deposit and receives refunds                                      | Must differ from both operator and arbiter                                                |
| Arbiter  | Approves the damage deduction and repair                                            | Must match the item's assigned arbiter                                                    |
| Keeper   | Executes due Cronpot jobs automatically                                             | Confirm the running relayer signer and keeper mode; do not use this account as the renter |

The public SS58 identities in `deployments/accounts.json` are:

| Role                | Public SS58 identity                               |
| ------------------- | -------------------------------------------------- |
| Operator / deployer | `5Gn8dCfyVQkKzoidcXXfncDR6amfmp5zVxFiXidsdzrZH3uB` |
| Renter              | `5HMeeW8k8ZHUJf1H5seQbkf3oTJGyhdb7KmUqNnaESTqQ31R` |
| Arbiter             | `5DjjjeBpydQRtt4wDHF9hq1xpKPDEWoeREbRkc4YbghL6fua` |
| Keeper / relayer    | `5Dt7Xte4QDLeyTTDQH7vNveCXy7akearVuYPXW3m2rDXCe4a` |

Resolve their H160 mappings from the live account view or retained role funding/mapping evidence; do not derive or guess a mapping by trimming a public key. Keep testnet account setup off-camera. Never record wallet recovery phrases, `.env`, signing seeds or bot tokens.

Before starting, confirm both contract read-backs, funded/mapped roles, the public app's current addresses, the persistent `/health` and job views, evidence upload/read availability, and the camera item's actual **120-second dispute window**. Record the starting reserve and operator income. Pause other scripted rental activity on that item during this rehearsal. Have return, damage and repair images ready before the second rental's short window starts.

Use real operator-supplied photos where possible. If using repository fixtures, keep their **DEMO FIXTURE / not evidence of an actual physical rental or repair** labels visible, and mark the recording **Testnet workflow demonstration · labeled demo images**.

## Run the public web flow

1. **Scan the physical QR on the phone.** Film the printed label and scan action. Confirm it opens the expected `https://metermend.vercel.app/items/<actual seed ID>` URL, with the correct item name and live availability. Capture the public URL, fee, deposit and starting repair reserve.
2. **First rental — renter wallet.** Connect the distinct renter account. Tap **Rent for …**, approve fee + deposit, and wait for the original transaction's finalized receipt. Record its hash, block and rental ID. Verify the reserve increased by `fee × reserveBps / 10000`; use actual displayed values, not a planned overlay.
3. **First return — operator wallet.** Open `/operator`, find that rental, attach its return photo, and tap **Confirm physical return**. Native photo storage can require its own separate signature before the return. Keep its native block/index and final SHA-256 distinct from the return transaction. Record `Returned`, the linked Cronpot `JobScheduled`, job ID and refund deadline.
4. **Wait for the keeper.** The demo window is 120 seconds, followed by the keeper's 30-second grace and block finality. Allow at least 150 seconds plus finality from the recorded return timestamp. Do not manually finalize this proof step. Capture the successful `JobExecuted` and `DepositRefunded` in the **same transaction**, the configured keeper executor, and the refunded amount. A countdown reaching zero is not execution evidence.
5. **Second rental and return.** Rent the same available item again with the renter wallet. Record the new rental ID. Switch to the operator and record the second return. The evidence should already be prepared; wallet round trips count against the 120-second dispute window.
6. **Open the 30% dispute promptly.** Before the return deadline, choose **Propose deduction**, attach the damage evidence and enter exactly 30% of the actual deposit. The operator's proposal is its approval. On `/arbiter`, select the distinct arbiter and **Approve deduction**. Record `DisputeOpened` and `DisputeResolved`, the deduction credited to the reserve, and the remaining 70% refunded. If the window expires first, retain that outcome and start a separately recorded rental; do not label it a successful dispute.
7. **Approve a repair.** On `/operator`, choose the item, an explicitly identified repairer H160 and an amount within the live reserve, then attach the receipt and **Send repair for approval**. On `/arbiter`, approve the repair. Record the actual proposal/approval hashes, `RepairPaid`, repairer payment and matching reserve decrease. The renter may act separately as the demo repair provider if that choice is disclosed; approval still comes from the distinct arbiter.
8. **Withdraw income.** Capture the item's reserve and operator's withdrawable income, tap **Withdraw rental income**, and record `IncomeWithdrawn`. Confirm only income was paid and the item reserve is unchanged. The public UI does not offer an arbitrary reserve-withdrawal amount; also show the separately recorded live rejection proof from `scripts/demo.ts`/the proof page. Label a simulation/preflight rejection as such; do not present it as a finalized failed transaction.
9. **Notifications and reload.** Capture actual Telegram group messages for rented, returned, refunded, dispute opened/resolved and repair paid. Match them to this run's item/rental IDs and receipts. Reload the phone item/rental/proof pages and confirm the same history and reserve remain visible.

Use this exact execution explanation in captions and voiceover:

> refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it.

The signed native Scheduler request returned `BadOrigin` in P5. Do not narrate it as the refund executor.

If a wallet operation times out, retain its original hash and browser recovery record. Recheck inclusion, finality and the account nonce/pool status before any retry. Never approve another payment just because the first screen stopped updating.

## Save the evidence and UI issues

Start from the blank [phone-run template](templates/phone-run.template.json) and its [field guide](templates/README.md). Populate it only from the actual session; the template itself is not deployment or phone evidence.

Keep uncropped originals outside the public repository. Copy shareable screenshots into `docs/evidence/phone/` and delivered-message screenshots into `docs/evidence/telegram/`; redact unrelated private conversations while retaining the matching event and message timestamp. Use filenames containing the actual run date, step and rental ID.

Record one row per action with UTC/WAT time, phone/OS/browser/wallet versions, selected public account, public URL, item/rental/job ID, original transaction hash, finalized block/hash, observed result and screenshot filename. Save the completed record as `deployments/phone-rehearsal.json`; do not create success entries ahead of the real run.

Required captures: printed QR and scan; live item terms; renter signature and finalized reserve increase; return photo hash/native proof; scheduled job and deadline; same-transaction keeper execution/refund; 30% dispute and arbiter resolution; approved repair/payment; income before/after and unchanged reserve; clearly labeled reserve rejection; delivered Telegram messages; public proof page after reload.

For any UI defect, record exact steps, expected/observed behavior, viewport, URL, screenshot and whether a transaction was submitted. Fix and repeat the affected check; preserve the original receipt so a repeated UI check cannot duplicate a payment. If blocked for more than 45 minutes, record the blocker in `docs/DECISIONS.md` and move to an unblocked submission task.

## Recording and upload hand-off

Use the live receipts and captures in [DEMO_VIDEO.md](DEMO_VIDEO.md). Aim for approximately two minutes and stay **under 2:30**. Record voiceover separately. Honest time-jump cards can shorten chain waits; keep real dates, blocks and receipt links. Do not mix the scripted and phone runs into one apparent transaction history without labeling the separate runs.

The owner supplies the physical phone scan, off-camera wallet setup, voiceover and final video upload. After uploading, verify a public viewer can play the video, record its actual URL/duration/date in submission evidence, and replace the pending video field in [SUBMISSION.md](SUBMISSION.md). Check the public deck/proof links and final CI before pasting the BUIDL answers by **November 5, 22:00 WAT**.
