# MeterMend progress report

**Updated October 31, 2026 · previous committed baseline `7a76f70`**

MeterMend's contracts, web interface, chain client, workers and deployment scripts are implemented and tested. The web app and permanent proof report are public. **Cronpot and MeterMend are finalized at blocks 265131 and 271379. Both contracts passed read-back checks at block 271384. The full live rental demonstration remains pending.**

[Public app](https://metermend.vercel.app/) · [Application proof page](https://metermend.vercel.app/proof) · [Permanent proof report](https://willy264.github.io/portal_dot/) · [Repository](https://github.com/willy264/portal_dot)

The public app and report are published from committed evidence. A successful contract deployment is separate from completion of the live rental, refund, dispute and repair demonstration.

## November 1 continuation

- Reconciled the dropped MeterMend transaction using its hash, canonical history, pool, account nonce and absent predicted contract. A deliberate replacement pinned the same nonce 7 and finalized once at block 271379. The original unknown attempt remains preserved.
- Verified Cronpot `nextJobId=1`, MeterMend `cronpot()` and `cronTip()` against one finalized block.
- Funded and mapped the renter, arbiter and keeper. Registered camera item 1 at block 271442 and printer item 2 at block 271469, both with 120-second dispute windows. Generated printable QR labels from their finalized receipts.
- Started the local keeper from the validated deployment block and preserved SQLite records across the handoff from read-only indexing. Telegram acknowledged the first actual item-registration message. Persistent hosting and the six required rental-event notifications remain separate milestones.
- Verified public pitch PDFs on Vercel and GitHub Pages. Render service creation still awaits account authentication and approval for the proposed $14.50/month base cost.

## October 31 continuation

- Refreshed the finalized funding snapshot and verified the runtime identity and compiled artifact hashes. The deployer holds 1466.24 tPOT, above the 1414.60 tPOT deployment guard; the renter, arbiter and relayer accounts still need funding.
- Fixed historical event pagination to retain finalized block hashes, including empty blocks. SQLite serves retained pages without contacting a pruned or unavailable node; older unverifiable page boundaries report an explicit gap.
- Added durable native-photo submission recovery, validated per-photo storage, account locks across tabs, and global pending-upload recovery after reload. Preparation failures are distinguished from uncertain submissions.
- Fixed the WebSocket provider's unintended five-second connection limit and bounded the optional EVM identity check so its timeout allows native verification to complete. Native chain identity and denomination checks remain mandatory.
- Verified Telegram bot credentials and the configured destination using read-only requests. No message was sent; delivery remains pending.
- Recovered the original Cronpot transaction after the node resumed, checking its exact hash, finalized dispatch result and account nonce. No replacement Cronpot was submitted. MeterMend uses the confirmed Cronpot address and has its own pending journal entry.
- Prepared the ten-slide pitch PDF, submission answers, Render configuration and physical-phone rehearsal materials. Each artifact's publication and live verification status is recorded separately. Internal submission deadline: **November 5, 22:00 WAT**.

## Logo and brand files

A MeterMend logo now combines the existing rising reserve bars with a returning repair loop. The [logo kit](BRAND.md) includes outlined SVG masters, transparent PNG wordmarks, light/dark and monochrome variants, standalone marks, a profile icon, favicon and a presentation board. The header and footer use the theme-appropriate logo. These are directly authored vector assets, with PNG exports, rather than an image-generation API result.

## Research and selection

The initial [research report](../PORTALDOT_RESEARCH_AND_IDEAS.md) developed **12 proposals: three for each of the four tracks**, with architecture, product use cases, risks and partner integration analysis.

| Track                           | Proposals                                       |
| ------------------------------- | ----------------------------------------------- |
| Modular Cloud & Middleware      | Runtime Passport, Continuity Vault, ReceiptMesh |
| Multi-Chain & Cross-Chain Infra | RescueRoute, CapacityLane, RightRelay           |
| Node Operations & Tooling       | FinalityFlight, Faultline, RoundSafe            |
| Ecosystem DApps                 | ReproPay, MeterMend, ExitLane                   |

The research separated documented technology from unverified partner claims. MeterMend was selected for the Ecosystem DApps track: repeated equipment rentals contribute to an item's own repair reserve, while deposits, income and repair money remain separate. Implementation began October 27.

## Implemented components

| Component                 | Completed work                                                                                                                                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MeterMend contract        | Item registration, rental payments, reserve allocation, return evidence, refund deadlines, dispute voting, approved repairs, income withdrawal and ownership-transfer restrictions.                                           |
| Cronpot contract          | Generic timed-call registry, permissionless execution, cancellation, bounded callback gas/return data and deferred tips when an executor rejects payment.                                                                     |
| Portaldot client          | Committed runtime metadata, Substrate-signed EVM calls, simulations, exact unit conversion, mapped account lookup, finalized event decoding and transaction reconciliation.                                                   |
| Mobile web                | Catalogue, item/QR pages, operator and arbiter flows, rental history, wallet connection, dark mode, image hashing and proof views. Uncertain contract submissions remain blocked across reloads until their outcome is known. |
| Refund worker and history | SQLite event persistence, restart recovery, keeper execution, bounded retries and explicit history-gap reporting.                                                                                                             |
| Community integration     | Durable DeBox notification outbox and Telegram fallback. Actual delivery requires credentials and a configured destination.                                                                                                   |
| Operations and evidence   | Resumable deployment/funding/seed/demo scripts, native image-storage support with persistent backup, hosting configuration, CI and a permanent proof-report generator.                                                        |

## What actually ran on V3

Verified network: **chain ID 420420777**, runtime **3002**. The deployed Ping address is `0x96ee88d272550530b518cbaa15a80cf5d38cdcfd`.

| Operation                   | Finalized result                                                       |  Block |
| --------------------------- | ---------------------------------------------------------------------- | -----: |
| Ping deployment             | Successful contract deployment                                         | 213570 |
| P4 value movement           | Native 14 decimals / EVM 18 decimals; measured conversion factor 10000 | 213573 |
| P5 signed Scheduler request | Failed with `BadOrigin`; keeper mode selected                          | 213576 |
| P6 TransactionStorage       | Successful signed 1 KiB store; retention 100800 blocks                 | 213579 |

Actual transaction hashes, in that order:

```text
Ping  0x5003af976f3c78775fd5911a1a6308565a97136d18feeeb8406f1254324a011c
P4    0x1e4af77310fe6f7afbf03b9310963a7a84bbfaebab50d291315c10127cbef7c2
P5    0x7a05968d67b82e52899f6414ec7acefda443b0fa76aae4a49aaa216e8ef16276
P6    0x76ffd5d81bf8e97d1dde819ba38e1fb1b94f90e1cbfec8216667b5a75abcc4b1
```

The [deployment manifest](../deployments/portaldot-v3.json) and [funded probe evidence](../deployments/funded-probe.json) preserve receipts and events. These probes do not establish that the application refund, dispute or repair workflow has completed. Native Scheduler execution is not claimed.

## Verification

[CI passed for committed baseline `ccf123f`](https://github.com/willy264/portal_dot/actions/runs/41214043607), including contract checks, TypeScript checks and the production web build. The October 31 changes passed the affected package typechecks, script checks and production web build locally. The contract suite is unchanged.

| Test suite                      |  Passed |
| ------------------------------- | ------: |
| Foundry contracts               |      43 |
| Chain client                    |      31 |
| Shared service code             |       8 |
| Refund relayer                  |      16 |
| Community bot                   |       5 |
| Web                             |      62 |
| Scripts                         |      15 |
| **TypeScript/JavaScript total** | **137** |

Contract tests cover accounting, permissions, disputes, refunds, callback failures and fuzzed fee splits. Browser recovery tests cover uncertain submissions, persistence failure and concurrent tabs.

**29 local production-browser checks** passed at desktop and mobile widths with no recorded browser exceptions. They cover navigation, responsive layout, dark mode, missing-wallet states, image-byte verification, contract and native-upload recovery after reload, missing hashes and corrupt browser storage. The image backend was intercepted in memory, and recovery used explicitly synthetic records in an isolated browser profile; these checks did not submit a payment or prove live storage delivery. The previous [Pages publishing run](https://github.com/willy264/portal_dot/actions/runs/40879104792) also passed.

## Funding and remaining work

The latest [saved funding snapshot](../deployments/funding-status.json), taken October 31 at finalized block **265063**, records:

| Deployment budget                             |     tPOT |
| --------------------------------------------- | -------: |
| Deployer balance                              |  1466.24 |
| Remaining application storage estimate        |  1158.00 |
| Deployment guard: storage + 20% + 25 retained |  1414.60 |
| **Shortfall to that guard**                   | **0.00** |

This is the predeployment funding snapshot. Cronpot subsequently finalized in transaction `0xd60b3e1372d10c1ce547da5f7aeadbb943ec803634a161597ef855c501a0df93`, block **265131**, extrinsic **2**. The [deployment journal](../deployments/deploy-journal.json) retains its original nonce 5 and recovered successful receipt. Before the next deployment, the finalized account nonce and `system_accountNextIndex` were both 7, and the pool was empty.

MeterMend is finalized at **`0x61382db168db646b899234cd707c7ba0142c4071`** in transaction `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17`, block **271379**. The [replacement journal](../deployments/deploy-replacement-journal.json) and [reconciliation](../deployments/metermend-reconciliation-2026-11-01.json) preserve the deliberate same-nonce replacement checks and original unknown attempt. The post-deployment balance was **306.74945 tPOT** at block 271383; [measured seed costs](../deployments/funding-seed-budget.json) guide the remaining allocations.

Remaining work is to preserve the automatic refund, dispute, repair, rejected reserve-access attempt and unchanged-reserve proof; activate persistent Render hosting; demonstrate all six required Telegram event messages; complete the physical-phone rehearsal; and record/upload the video before updating the BUIDL. The [recording plan](DEMO_VIDEO.md) stays under 2:30. Public video and final submission remain pending.

Physical damage decisions still rely on people. Missing dispute votes can delay settlement; native evidence expires; pruned chain history requires retained records. Labeled demo-image fixtures test the workflow without claiming an actual physical rental or repair.
