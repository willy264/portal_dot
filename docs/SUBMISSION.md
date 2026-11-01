# MeterMend BUIDL answers

Working draft dated **November 1, 2026**. The text below reports the current evidence. Both application contracts are deployed; the live golden path, video, and final BUIDL submission remain pending. Replace pending fields only after recording their actual result.

**Internal submission deadline: November 5, 2026, 22:00 WAT (21:00 UTC).** The supplied official cutoff is November 6, 2026, 05:00 WAT (04:00 UTC). Use the internal deadline for the final paste/upload action.

## Project name and one-line description

**MeterMend — Every rental funds its next repair.**

MeterMend gives shared workshop equipment a protected repair reserve, an evidence-backed rental history, and permissionless deposit refunds on Portaldot V3.

## Problem

Makerspaces, campus hubs and tool libraries share valuable equipment, but repeated use creates wear without necessarily creating a maintenance budget. Operators need to separate earned income from refundable deposits and future repairs. When damage is disputed, members need a clear record of the evidence, decision and resulting payment.

## How it works

An operator registers an item, assigns a distinct arbiter and prints its QR code. A renter scans the code and pays a fee plus deposit. A configured share of the fee goes to that item's protected repair reserve; the rest becomes operator income. The operator records return evidence, starting a dispute window and scheduling a Cronpot job.

refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it.

The refund contract independently checks the deadline and rental status. A damage proposal counts as the operator's approval and needs either the distinct renter or arbiter to approve a deduction; both other parties must reject to return the full deposit. Only an arbiter-approved repair can spend the item reserve. Operator income withdrawal cannot release reserve money. Damage assessment still relies on people, and unresolved votes can delay settlement.

## Why Portaldot

MeterMend combines Solidity accounting through pallet-revive with Substrate-signed wallet transactions. A funded runtime probe verified the exact conversion between native 14-decimal and EVM 18-decimal amounts: a factor of 10,000. On the observed V3 runtime, funding automatically maps native accounts to H160 addresses.

TransactionStorage provides native evidence storage; the funded P6 probe stored 1 KiB successfully. The application hashes the final displayed bytes and retains a persistent backup because native retention is finite. Cronpot is reusable timed-call infrastructure, and the indexer retains finalized native events beyond public-node pruning.

The signed Scheduler probe finalized with `BadOrigin`. We selected keeper execution and do not claim that the native Scheduler executes refunds.

## Progress to date

The contracts, mobile web interface, wallet flow, operator and arbiter screens, evidence handling, refund worker, durable event indexer, notification integration and resumable deployment/demo scripts are implemented. The web app and permanent proof report are public. Ping deployment, funded value movement, the Scheduler rejection and native evidence storage have finalized on V3, with actual receipts retained in the repository.

The October 31 engineering baseline records 137 TypeScript/JavaScript tests, 29 browser checks with no browser exceptions, and a passing production build. The unchanged Foundry suite previously passed 43 tests in CI. Subsequent Telegram-receipt checks pass all 13 bot tests, and the printable-QR evidence checks pass three tests. Replace this dated baseline with the final combined CI counts before submission. Recovery tests exercise uncertain submissions and browser reloads with labeled synthetic records; those tests are separate from live settlement proof.

Both application contracts are now finalized on V3. Cronpot deployed at block 265131 to `0x41635a685448cfa86da1600656f103a211e398f4`. MeterMend deployed at block 271379 to `0x61382db168db646b899234cd707c7ba0142c4071` in transaction `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17`. Before the deliberate same-nonce replacement, the original MeterMend hash was reconciled against account nonce, pool and contract state; the retained checks and journals preserve that history. Read-backs passed at finalized block 271384: Cronpot `nextJobId = 1`, MeterMend `cronpot()` matches the deployed Cronpot address, and `cronTip() = 1000000000000000` EVM base units (0.001 tPOT). The live application demonstration remains pending.

## Outstanding work / current blocker

Fund the distinct demo roles and register demo items with 120-second dispute windows. Then record the live automatic refund, approved dispute, reserve-funded repair, income-only withdrawal and rejected reserve-withdrawal attempt. The owner has agreed to the actual phone/printed-QR rehearsal; [PHONE_REHEARSAL.md](PHONE_REHEARSAL.md) provides its runbook and evidence checklist. Agreement and prepared labels are not completion evidence.

Persistent keeper/evidence hosting, delivered Telegram event notifications and screenshots, the final live-only video, and BUIDL submission remain pending. Telegram credentials and the configured destination passed read-only checks. DeBox remains the target community integration; no live DeBox delivery is claimed.

The node previously stalled with zero peers and finalized block 265122, then resumed; both deployments have now finalized. Connectivity/finality have been intermittent, rather than permanently halted. See `deployments/deployment-status.json`, the transaction journals and newer chain observations for timestamped status; do not present an older pool observation as a current deployment result.

## Business model

The proposed business model is a small service fee per completed rental, aimed at makerspaces, campus hubs and tool libraries. Protected deposits and repair reserves remain separate from service revenue. The current testnet contract does not collect a MeterMend platform fee. Pilot work will validate pricing, repeat usage, maintenance coverage and the support needed by operators.

## Roadmap / why continued support matters

First, finish the complete live golden path and public deployment with durable operations and delivered notifications. Next, pilot with workshop operators to test onboarding, evidence retention, dispute handling, reserve adequacy and willingness to pay. Then document Cronpot for other Portaldot contracts and improve keeper reliability and community integrations. Continued support can provide reliable testnet access, persistent hosting and pilot partners while producing reusable infrastructure for the ecosystem.

## Testnet deployment details

Network: **Portaldot V3 testnet**. Chain ID: **420420777 (`0x190f1ca9`)**. Runtime spec: **3002**. Genesis hash: `0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd`.

| Record                            | Actual address / transaction hash                                    | Block / outcome                                                                            |
| --------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Ping runtime probe address        | `0x96ee88d272550530b518cbaa15a80cf5d38cdcfd`                         | Finalized deployment                                                                       |
| Ping deployment transaction       | `0x5003af976f3c78775fd5911a1a6308565a97136d18feeeb8406f1254324a011c` | 213570                                                                                     |
| P4 funded value movement          | `0x1e4af77310fe6f7afbf03b9310963a7a84bbfaebab50d291315c10127cbef7c2` | 213573 · Successful                                                                        |
| P5 signed Scheduler request       | `0x7a05968d67b82e52899f6414ec7acefda443b0fa76aae4a49aaa216e8ef16276` | 213576 · Failed with `BadOrigin`                                                           |
| P6 native evidence store          | `0x76ffd5d81bf8e97d1dde819ba38e1fb1b94f90e1cbfec8216667b5a75abcc4b1` | 213579 · Successful                                                                        |
| Cronpot deployment transaction    | `0xd60b3e1372d10c1ce547da5f7aeadbb943ec803634a161597ef855c501a0df93` | 265131 · Finalized successfully                                                            |
| Cronpot address                   | `0x41635a685448cfa86da1600656f103a211e398f4`                         | Finalized deployment                                                                       |
| MeterMend deployment transaction  | `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17` | 271379 · Finalized successfully                                                            |
| MeterMend address                 | `0x61382db168db646b899234cd707c7ba0142c4071`                         | Finalized deployment                                                                       |
| Earlier MeterMend attempt         | `0xcd4488ec20cc250520bb944ffca6d21806e379dfc35e3f2aea72147cf259e782` | Reconciled before deliberate same-nonce replacement; not the successful deployment receipt |
| Live golden-path transaction list | Pending `deployments/demo-run.json`                                  | Not yet completed                                                                          |

The source of truth for completed deployments is `deployments/portaldot-v3.json`. Every new success must include its actual transaction and block hash. Retain failures and uncertain attempts as such.

## Links for the form

| Form field        | Value / status                                                                                                                                                                                                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub            | https://github.com/willy264/portal_dot                                                                                                                                                                                                                                                                                        |
| Public app        | https://metermend.vercel.app/                                                                                                                                                                                                                                                                                                 |
| Application proof | https://metermend.vercel.app/proof                                                                                                                                                                                                                                                                                            |
| Permanent report  | https://willy264.github.io/portal_dot/                                                                                                                                                                                                                                                                                        |
| Pitch deck PDF    | [Public PDF](https://metermend.vercel.app/metermend-pitch.pdf); [Permanent report mirror](https://willy264.github.io/portal_dot/metermend-pitch.pdf). The earlier revision was verified publicly on November 1. This revised deck includes both finalized contracts; re-publish and verify its new SHA-256 before submitting. |
| Video             | **Pending. No completed video or public video URL exists yet.**                                                                                                                                                                                                                                                               |

## Final paste checklist

- Preserve both finalized deployment receipts; add the live golden-path evidence to the deck and regenerate the PDF/report when the demo completes.
- Confirm the golden-path transaction list and both reserve assertions are in `deployments/demo-run.json`.
- Verify public worker/evidence health and the real phone/printed-QR rehearsal.
- Attach actual Telegram delivery screenshots; retain DeBox's honest status.
- Both public PDF links matched the generated artifact on November 1. Recheck the SHA-256 after regenerating the deck, then paste the verified link above.
- Record only real testnet footage, add the voiceover, keep the video under 2:30, upload it, and replace the pending video field.
- Check README links and CI for the final commit; paste/update the BUIDL and retain submission confirmation before **November 5, 22:00 WAT**.
