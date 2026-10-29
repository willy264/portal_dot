# MeterMend progress report

**October 29, 2026 · engineering baseline reviewed at `f54bb1b`; logo added in `0a93b70`**

MeterMend's contracts, web interface, chain client, workers and deployment scripts are implemented and tested. The web app and permanent proof report are public. A small contract and funded runtime probes have genuinely run on Portaldot V3. **Cronpot and MeterMend themselves are not yet deployed; their live rental demonstration remains blocked by test-token funding.**

[Public app](https://metermend.vercel.app/) · [Application proof page](https://metermend.vercel.app/proof) · [Permanent proof report](https://willy264.github.io/portal_dot/) · [Repository](https://github.com/willy264/portal_dot)

All three public pages returned HTTP 200 during this review. Their current content distinguishes runtime verification from a completed application deployment.

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

[CI passed for `f54bb1b`](https://github.com/willy264/portal_dot/actions/runs/40879526520), including contract checks, TypeScript checks and the production web build.

| Test suite                      |  Passed |
| ------------------------------- | ------: |
| Foundry contracts               |      43 |
| Chain client                    |      26 |
| Shared service code             |       6 |
| Refund relayer                  |      10 |
| Community bot                   |       5 |
| Web                             |      53 |
| Scripts                         |      15 |
| **TypeScript/JavaScript total** | **115** |

Contract tests cover accounting, permissions, disputes, refunds, callback failures and fuzzed fee splits. Browser recovery tests cover uncertain submissions, persistence failure and concurrent tabs.

**22 public-browser checks** passed at desktop and mobile widths with no recorded browser exceptions. They cover navigation, responsive layout, dark mode, missing-wallet states, image-byte verification and recovery after reload. The image backend was intercepted in memory, and recovery used an explicitly synthetic transaction record; these checks did not submit a payment or prove live storage delivery. The [Pages publishing run](https://github.com/willy264/portal_dot/actions/runs/40879104792) also passed.

## Funding and remaining work

The latest [saved funding snapshot](../deployments/funding-status.json), taken October 29 at finalized block **238486**, records:

| Deployment budget                             |       tPOT |
| --------------------------------------------- | ---------: |
| Deployer balance                              |     446.49 |
| Remaining application storage estimate        |    1158.00 |
| Deployment guard: storage + 20% + 25 retained |    1414.60 |
| **Shortfall to that guard**                   | **968.11** |

Transaction fees, role funding and further item/rental state require additional funds beyond that guard. No underfunded application deployment was submitted.

Remaining work is to fund and deploy both application contracts; run and preserve the automatic refund, dispute, repair and unchanged-reserve proof; activate a persistent worker/evidence host; demonstrate delivered DeBox or Telegram messages; and record/upload the two-minute video before updating the hackathon BUIDL. The [recording plan](DEMO_VIDEO.md) is prepared. Public video and final submission remain pending.

Physical damage decisions still rely on people. Missing dispute votes can delay settlement; native evidence expires; pruned chain history requires retained records. Labeled demo-image fixtures test the workflow without claiming an actual physical rental or repair.
