# MeterMend — Full Build Spec

> Every rental funds its next repair.
> Portaldot Hacker House 2026 · Ecosystem DApps · Portaldot V3 testnet.
> Submit by November 5, 2026; official cutoff November 6, 05:00 WAT.

This is the project's build authority, transcribed from the user's complete specification on October 27, 2026. MUST requirements may change only with an explicit amendment here and an evidence-backed entry in `docs/DECISIONS.md`. Preserve the research already in this repository. Work in the existing repository root (the `metermend/` directory in the proposed layout denotes this root).

**Delivery instruction:** commit and push per completed feature, never batch the whole implementation into one final commit. Verify each feature before publishing it. Do not fabricate development history or deployment evidence.

## 0. Deliverables and invariants

Build a Node 22 / pnpm 10 TypeScript monorepo:

1. `contracts/`: Solidity `MeterMend.sol`, `Cronpot.sol`, `ICronpot.sol`, a probe `Ping.sol`, and Foundry tests.
2. `services/cronpot-relayer/`: observe `JobScheduled`, persist jobs, and register `scheduler.schedule_after(revive.call(Cronpot.execute(jobId)))` where actually supported. Otherwise execute due jobs as a keeper.
3. `services/debox-bot/`: community availability, rental, refund, dispute and repair notifications; documented Telegram fallback if DeBox access is unavailable.
4. `apps/web/`: Next.js App Router, mobile QR rental, operator/arbiter views, evidence verification, history and public `/proof`.
5. Shared `packages/chain`, deployment/seed/demo scripts, CI and a permanent GitHub Pages proof report.

The final demo MUST use real V3 testnet interactions and preserve real transaction hashes. Security MUST NOT depend on Cronpot or any service: `MeterMend.finalizeRefund` is permissionless and time-gated. Never claim native scheduling when only keeper execution was observed.

## 1. Product

### Actors

| Actor | Authority |
|---|---|
| Operator | Register/update items, confirm physical return, open disputes, propose repairs, withdraw rental income, transfer items |
| Renter | Rent and approve/reject a proposed deposit deduction |
| Arbiter | Neutral officer selected per item; approve/reject deductions and repair proposals |
| Repairer | Receive approved repair payments |
| Anyone / Cronpot | Finalize an undisputed refund after its deadline |

### Required core flow

1. Register a Canon EOS camera with rental fee, deposit, reserve share (example 20%), arbiter and dispute window.
2. Renter scans `/items/[id]` and pays exactly fee plus deposit in one transaction.
3. Immediately allocate `fee * reserveBps / 10000` to the item's ring-fenced reserve and the remainder to its operator's withdrawable income.
4. Operator confirms physical return and supplies a photo evidence hash. Bytes use native transaction storage when verified practical, otherwise application storage.
5. Set `refundAt = block.timestamp + disputeWindow`; schedule a Cronpot call to `finalizeRefund(rentalId)`. Operator pays exactly `cronTip` separately from renter funds.
6. Without a dispute, at/after the deadline native scheduling or the keeper triggers refund and the community receives a notification.
7. Before the deadline, operator may propose a positive deduction no greater than the deposit. That is the operator's approval. One approval from renter or arbiter resolves the deduction into the item's reserve and refunds the remainder. Both renter and arbiter rejecting resolves a full refund. Each party votes once.
8. Operator proposes a repair payment; only arbiter approval pays the repairer from that item's reserve. No operator withdrawal path may spend reserves.
9. Transfer keeps the reserve and complete event history attached to the item.

Non-goals: no stranger marketplace, reputation scores, pricing oracles, fiat, cross-chain functionality, or AI damage judgment. Humans decide; contracts enforce recorded decisions.

## 2. Chain facts to verify

| Field | Supplied value |
|---|---|
| Substrate WSS | `wss://test-node-v3.portaldot.dev` |
| Expected runtime | `portaldot-v3`, spec approximately 3002; verify exact reported spelling |
| Ethereum read RPC | `https://test-evm-rpc-v3.portaldot.dev` |
| EVM chain ID | Decimal `420420777` |
| Native asset | tPOT, 14 native decimals; verify EVM scaling and extrinsic units |
| Address format | SS58 42 |
| Explorer | `https://node-console.portaldot.dev`; no assumed EVM explorer |
| Faucet | No public faucet; obtain test funds through the organizer's Discord process |
| Prohibited deployment target | `wss://mainnet.portaldot.io` (legacy runtime 1002) |

Known reported issues: raw EOA EVM writes may fail despite successful reads; node history and eth receipts may be pruned around 1,000 blocks; WSS can disconnect with 1006; each Substrate contract caller needs `revive.map_account()`; H160 mapping MUST come from `ReviveApi.address(accountId)` rather than a handwritten derivation.

All default writes MUST be Substrate-signed `revive.call` / `revive.instantiate_with_code` using PAPI. EVM RPC is for reads and ABI/event handling. All services persist observations/cursors in SQLite. Transaction evidence is saved immediately on inclusion/finalization; never blindly resubmit an uncertain value transfer after reconnect.

## 3. Toolchain

Use Node 22 LTS (>=22.12), pnpm 10 workspaces, TypeScript 5.9. Pin exact chain-related dependency versions without `^`.

| Purpose | Requested version |
|---|---|
| Solidity compiler | `solc` 0.8.30; target prague or cancun after probe |
| Optional PVM compiler | `@parity/resolc` 1.4.0 |
| Contracts tests | Latest stable Foundry forge/anvil, recorded exact release |
| Optional PVM Hardhat | Hardhat 2.26.x + `@parity/hardhat-polkadot` 0.3.0; do not use Hardhat 3 with that plugin |
| Contract helpers | `@openzeppelin/contracts` 5.6.1, or handwritten guard |
| PAPI | `polkadot-api` 3.3.0 |
| EVM reads / ABI | `viem` 2.57.x |
| Web | Next 16.4.x, React 19.3.x, Tailwind 4.3.x |
| QR | `qrcode.react` 4.2.0, `html5-qrcode` 2.3.8 |
| HTTP | `hono` 4.13.x |
| Persistence | `better-sqlite3` or Node 22 `node:sqlite` |
| TS tests | `vitest` 5.0.x |
| DeBox | OpenAPI `https://open.debox.pro`, server-side `X-API-KEY` |
| Actions | checkout@v5, pnpm/action-setup@v4, setup-node@v5, foundry-toolchain@v1, deploy-pages@v4 |

If a requested version cannot install or breaks compatibility, use the newest working compatible release, record the exact choice/evidence in `docs/DECISIONS.md`, and continue. Spend no more than 20 minutes on one toolchain issue. Latest package marketing must not override actual registry/runtime evidence.

## 4. Phase 0 — before product contract implementation

Create `scripts/probe.ts`, saving machine-readable `deployments/probe.json` and evidence-backed decisions. Read-only inspection comes first. Funded write probes P4–P7 must be explicitly identified; no transaction is to be called read-only. The original specification described one optional write while also prescribing several funded probes; implement these as an explicit funded probe stage, never silently on an ordinary read-only run.

| ID | Required observation | Decision |
|---|---|---|
| P1 | WSS runtime name/version and EVM chain ID | Abort dependent deployment and ask for corrected organizer details if not V3 / chain 420420777 |
| P2 | Runtime metadata for Revive, Scheduler, TransactionStorage, Multisig, Proxy, Identity, Utility | Which native integrations can be tested |
| P3 | `ReviveApi.instantiate` dry-run of tiny solc output; if code-format rejection, try resolc PVM | EVM vs PVM pipeline, no guessing |
| P4 | Runtime H160 mapping, native system account balance, EVM balance, ratio constants; verify one funded value movement | EVM/native decimals, exact integer conversions and extrinsic value units |
| P5 | A real scheduler entry calling `Ping.ping()` three blocks out; `Scheduler.Dispatched(Ok)` plus Ping event | Native scheduler only if signed-origin dispatch actually succeeds; otherwise keeper |
| P6 | TransactionStorage limits/fees/period and 1KB store test | Native bytes if practical; otherwise hash-only app storage |
| P7 | Optional raw EOA signed test transaction from a funded H160 | Optional MetaMask writes only if proven; default remains PAPI |

The user-supplied P1 hex literal `0x190F1B29` was incorrect. Decimal 420420777 is **`0x190f1ca9`**; observed V3 RPC confirms the latter. This transcription correction is normative and must also appear in DECISIONS.

Preauthorized fallbacks: P3 EVM failure + PVM success selects resolc with the same Solidity; P5 unavailable/unauthorized/failing selects keeper and changes the pitch; P6 tries a JPEG thumbnail <=64KB only if it fits, otherwise stores a SHA-256 on-chain with bytes in app disk/SQLite. No approval is needed for these specified fallbacks. Missing funds or unperformed writes must be reported as unverified, not successful or failed probes.

## 5. Repository layout

```text
SPEC.md
README.md
docs/{DECISIONS,ARCHITECTURE}.md
contracts/foundry.toml
contracts/src/{MeterMend,Cronpot,ICronpot}.sol
contracts/src/test/Ping.sol
contracts/test/{MeterMend,Cronpot}.t.sol
packages/chain/src/{client,revive,units}.ts
packages/chain/src/abi/*.ts
packages/chain/.papi/
scripts/{probe,deploy,seed,demo,report}.ts
services/{cronpot-relayer,debox-bot}/
apps/web/
deployments/{probe,portaldot-v3,demo-run}.json
.github/workflows/{ci,pages}.yml
```

## 6. Contracts

### 6.1 Shared rules

Compile with Solidity 0.8.30 and `pragma solidity ^0.8.28;`. Operator income uses pull withdrawals. Renter refunds and repair payments use checked `call{value: amount}("")`, checks-effects-interactions and reentrancy protection. Never use `transfer` or `send`. Use timestamp timing rather than block-number timing in contracts. Avoid selfdestruct, `address.code`, EXTCODESIZE/EXTCODECOPY tricks and CREATE2 address assumptions. Use custom errors and emit events for every business-state change.

### 6.2 ICronpot

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
interface ICronpot {
    function schedule(address target, bytes calldata data, uint64 executeAfter)
        external payable returns (uint256 jobId);
    function cancel(uint256 jobId) external;
}
```

### 6.3 Cronpot required reference behavior

`Status { None, Scheduled, Executed, Cancelled, Failed }`.

`Job { address owner; address target; uint64 executeAfter; Status status; uint128 tip; bytes data; }`.

Store `nextJobId = 1`, `mapping(uint256 => Job) public jobs`, and a reentrancy lock. `schedule` stores caller as owner, target/data/deadline, and attached payment as executor tip, then emits `JobScheduled(jobId, owner, target, executeAfter, tip, data)` with the first three fields indexed. `cancel` is owner-only, requires Scheduled, marks Cancelled and zeroes the tip before refunding it, emitting `JobCancelled(jobId)`.

`execute(jobId)` is nonReentrant and permissionless: require Scheduled and timestamp >= executeAfter; execute the target/data; mark Executed on success or Failed on target failure; zero/pay executor tip; emit `JobExecuted(jobId, executor, success, returnData)`. A failing target MUST mark Failed without making the enclosing execution revert, so native scheduler consumption is clean. Never retry Failed automatically. `isDue(jobId)` checks Scheduled and timestamp. Errors include NotOwner, NotScheduled, TooEarly(deadline), Reentrant; use custom errors for additional validation/transfers.

Preserve the supplied public method/event/enum intent. The reference's unchecked narrowing to uint128 and `require(ok)` transfer paths need audit before implementation. Any corrections belong in the amendments section, not silent edits.

### 6.4 MeterMend schema and complete behavior

`RentalStatus { None, Active, Returned, Disputed, Closed }`.

```solidity
struct Item {
    address operator; address arbiter;
    uint128 fee; uint128 deposit; uint16 reserveBps; uint32 disputeWindow;
    bool active; bool rented; uint256 reserve; string metadataURI;
}
struct Rental {
    uint256 itemId; address renter; uint128 deposit;
    uint64 startedAt; uint64 refundAt; RentalStatus status; uint256 cronJobId;
}
struct Dispute {
    uint128 amount; bytes32 evidenceHash;
    bool renterVoted; bool renterApproved; bool arbiterVoted; bool arbiterApproved;
}
struct Repair {
    uint256 itemId; address repairer; uint128 amount; bytes32 receiptHash;
    bool paid; bool rejected;
}
```

Immutable `ICronpot cronpot` and `uint128 cronTip`. IDs start at 1. Public mappings: `items`, `rentals`, `disputes` (rental ID), `repairs`, `operatorIncome`. Custom errors: NotOperator, NotArbiter, NotParty, BadParams, WrongValue(expected), ItemUnavailable, BadStatus, WindowOpen(refundAt), WindowClosed, AlreadyVoted, InsufficientReserve, Reentrant, TransferFailed.

The complete required ABI/behavior:

| Function | Rules and effects |
|---|---|
| constructor(ICronpot,uint128) | Set scheduling module and per-return tip |
| registerItem(address arbiter,uint128 fee,uint128 deposit,uint16 reserveBps,uint32 disputeWindow,string metadataURI) returns(uint256) | Nonzero arbiter distinct from operator; bps <=5000; window >=60 seconds and <=30 days; active new item owned by caller |
| updateItem(uint256,uint128 fee,uint128 deposit,bool active) | Operator-only; no currently rented item; update terms for future rentals |
| rent(uint256) payable returns(uint256) | Existing active available item; renter not operator; exact fee+deposit; reserve += floor(fee*bps/10000); income += fee-reserveShare; rented=true; new Active rental snapshots deposit/start |
| markReturned(uint256,bytes32 evidenceHash) payable | Item operator only; Active rental; exact cronTip; set Returned/refundAt and rented=false; schedule this.finalizeRefund(rentalId), forwarding tip; save job ID |
| finalizeRefund(uint256) | Anyone, nonReentrant; require Returned and deadline reached; close rental and zero deposit before sending full refund |
| openDispute(uint256,uint128 amount,bytes32 evidenceHash) | Operator only; Returned, strictly before deadline; 0<amount<=deposit; mark Disputed/store proposal and unset vote flags; best-effort cancel Cronpot job as its owner |
| voteDispute(uint256,bool approve) | NonReentrant; Disputed; renter or arbiter only, at most one vote per role; any approval completes operator+approver majority; both rejections complete zero-deduction resolution |
| private _resolve(uint256,uint128 deducted) | Close/zero deposit; add deduction to same item reserve; refund remainder; emit DisputeResolved |
| proposeRepair(uint256,address repairer,uint128 amount,bytes32 receiptHash) returns(uint256) | Operator-only; nonzero repairer/amount, amount <= current reserve; store unpaid/unrejected proposal |
| decideRepair(uint256,bool approve) | Arbiter-only, nonReentrant; neither paid nor rejected; rejection terminal; approval rechecks reserve, debits before sending repairer payment |
| transferItem(uint256,address newOperator) | Operator-only; not rented; new operator nonzero and not arbiter; preserve reserve/history and emit transfer |
| withdrawIncome() | NonReentrant; zero caller's income before checked payout; never debit reserve |
| receive() payable | Accept cancelled Cronpot tip refunds as unallocated dust; document this simple policy |

Events (indexed identifiers as in the supplied reference):

```solidity
event ItemRegistered(uint256 indexed itemId,address indexed operator,address arbiter,uint128 fee,uint128 deposit,uint16 reserveBps,uint32 disputeWindow,string metadataURI);
event ItemUpdated(uint256 indexed itemId,uint128 fee,uint128 deposit,bool active);
event Rented(uint256 indexed rentalId,uint256 indexed itemId,address indexed renter,uint128 fee,uint128 toReserve,uint128 deposit);
event Returned(uint256 indexed rentalId,uint256 indexed itemId,bytes32 evidenceHash,uint64 refundAt,uint256 cronJobId);
event DepositRefunded(uint256 indexed rentalId,uint256 indexed itemId,address indexed renter,uint128 amount);
event DisputeOpened(uint256 indexed rentalId,uint256 indexed itemId,uint128 amount,bytes32 evidenceHash);
event DisputeVote(uint256 indexed rentalId,address indexed voter,bool approve);
event DisputeResolved(uint256 indexed rentalId,uint256 indexed itemId,uint128 deducted,uint128 refunded);
event RepairProposed(uint256 indexed repairId,uint256 indexed itemId,address indexed repairer,uint128 amount,bytes32 receiptHash);
event RepairPaid(uint256 indexed repairId,uint256 indexed itemId,address indexed repairer,uint128 amount);
event RepairRejected(uint256 indexed repairId,uint256 indexed itemId);
event ItemTransferred(uint256 indexed itemId,address indexed from,address indexed to,uint256 reserveCarried);
event IncomeWithdrawn(address indexed operator,uint256 amount);
```

Reference observations to review, not silently override: markReturned clears rented before financial closure; authorization reads current item operator/arbiter; the reference permits arbiter as renter; cancellation refunds its tip to MeterMend's receive; no dispute timeout is specified. Human silence may keep a disputed deposit locked; disclose that if preserved. A manual refund may leave a scheduled job whose later call fails harmlessly.

### 6.5 Required Foundry tests

All MUST pass in CI:

1. `test_RentSplitsFeeIntoReserve`: 100 fee / 2000 bps gives 20 reserve / 80 income.
2. `test_RentWrongValueReverts`.
3. `test_ItemCannotBeDoubleRented`.
4. `test_MarkReturnedSchedulesCronJob`: correct job and refundAt.
5. `test_FinalizeRefundBeforeWindowReverts`.
6. `test_CronpotExecutesRefundAfterWindow`: vm.warp, deposit refund, Executed, tip paid.
7. `test_AnyoneCanFinalizeWithoutCronpot`.
8. `test_DisputeApprovedByRenter`, `test_DisputeApprovedByArbiter`: deduction reserve + remainder refund.
9. `test_DisputeRejectedByBothRefundsFully`.
10. `test_DisputeAfterWindowReverts`.
11. `test_ScheduledRefundCannotFireDuringDispute`: job Failed/Cancelled, deposit retained.
12. `test_RepairRequiresArbiter`, `test_RepairPaysFromReserveOnly`, `test_RepairCannotExceedReserve`.
13. `test_OperatorCannotWithdrawReserve`: exactly income paid, reserve unchanged; required failure-case proof.
14. `test_TransferCarriesReserve`.
15. Fuzz `testFuzz_SplitNeverLosesFunds(fee,bps)`: reserve+income==fee.

Cronpot: early execution, double execution, failed target status without revert, owner-only cancellation, executor tip. Add regression tests for any audited corrections. Live `scripts/demo.ts` separately verifies the real-chain golden path and preserves its evidence.

## 7. Shared chain package

Generate and commit runtime descriptors and metadata using the installed PAPI tooling, e.g. `papi add portaldot -w wss://test-node-v3.portaldot.dev` then `papi generate`. CI MUST build without querying runtime metadata over the network.

Expose:

```ts
ensureMapped(signer: PolkadotSigner): Promise<void>
h160Of(ss58: string): Promise<`0x${string}`>
reviveDeploy({ signer, code, ctorData, value? }): Promise<{ address, txHash, block }>
reviveCall({ signer, to, data, value? }): Promise<{ txHash, block, events }>
readContract<T>(abi, address, fn, args): Promise<T>
getLogs(abi, address, fromBlock): Promise<Log[]>
```

Mapping is idempotent and uses the actual runtime mapping storage/API. Deploy/call dry-run before sending; use returned weight/storage-deposit estimates with 20% margin. Exact generated field names, types, optional values and Weight(ref_time,proof_size) shapes MUST come from metadata, never guess. Unit conversions belong in `units.ts`, use bigint and tests, and require measured ratio plus verified extrinsic denomination. EVM read failures fall back to ReviveApi dry-runs where possible; EVM log failures fall back to Substrate Revive.ContractEmitted decoding. Reconnect automatically; re-check uncertain transaction inclusion before resubmission.

## 8. Cronpot relayer

On each new finalized block, read unseen JobScheduled logs, persist them in SQLite, then in verified native mode submit the generated scheduler call with relayer Signed origin. Delay estimate is `ceil((executeAfter-nowSeconds)/blockTimeSeconds)+2`, priority127, no periodic repetition. Use actual call type variants from metadata. Relayer must be mapped/funded. Persist scheduler task location and transaction evidence.

Both modes have a 10-second safety loop: once current time >= executeAfter+30s grace, re-read status and directly execute jobs still Scheduled. Derive time from chain observations for transaction readiness; never send blindly from stale wall-clock estimates. Record Scheduler.Scheduled/Dispatched evidence. Missing events during a pruning gap must be surfaced rather than fabricated.

Block time from Babe.ExpectedBlockTime if present, otherwise measured last20 blocks. Hono `GET /health` and `GET /jobs`. Env: RELAYER_SEED,WSS_URL,EVM_RPC_URL,CRONPOT_ADDRESS,MODE=native|keeper,DB_PATH. Services survive disconnect/restart with persisted finalized cursors and deduplication.

## 9. DeBox bot

BotMother supplies credentials; secrets remain server-side. Read official exact body schema before implementing POST `https://open.debox.pro/openapi/bot/sendMessage`, header X-API-KEY, target gid from DEBOX_GROUP_ID. Use durable event/cursor/outbox storage, bounded queue, <=1 message/second and backoff. DeBox failures do not crash chain processing.

| Event | Message content |
|---|---|
| ItemRegistered | Name, rental fee, item link |
| Rented | Name, contribution and resulting reserve |
| Returned | Return confirmation and refund deadline/dispute condition |
| DepositRefunded | Refunded amount and transaction link; do not label a manual call automatic without evidence |
| DisputeOpened | Claim amount, item and decision link |
| DisputeResolved | Deduction to reserve and amount refunded |
| RepairPaid | Item and reserve-funded repair amount |
| Derived ItemAvailable | Item is available again |

If DeBox approval is unavailable, equivalent Telegram messages via grammy are a preauthorized fallback and must be documented honestly. A missing key or group means delivery is unconfigured, never “working”. User authorization covers the requested application's notifications to its configured demo group; no unrelated external messages.

## 10. Web app

Next.js16 App Router, Tailwind4, TypeScript. Mobile-first workshop ledger: warm off-white, ink-black text, safety orange `#FF6A13`, monospace amounts/hashes, reserve meters as the hero visual; dark mode. Keep product language clear and show implementation detail only where useful to the user or judge.

Wallet: injected SubWallet/Talisman/Polkadot.js via the actual PAPI injected-extension signer API. Show SS58, runtime-mapped H160 and tPOT balance. Unmapped users get one-click Activate account. MetaMask writes only if optional P7 passes.

| Route | Required UI |
|---|---|
| `/` | Live item count, total repair reserves, automated-refund count, six-step explanation |
| `/items` | Photo cards, fees/deposits, availability and reserve meters |
| `/items/[id]` | QR target; prominent fee+deposit rent button; my rental/countdown; complete persisted event history |
| `/operator` | Register/form/QR; active rentals; return with photo; dispute; repair proposal; income withdrawal; transfer; printable QR |
| `/arbiter` | Pending disputes/repairs and evidence previews; approve/reject |
| `/rentals/[id]` | State transition view, deadline and relayer job status |
| `/proof` | All real addresses/deploy/demo/scheduler transactions, blocks, node-console links and Phase0 results |

Evidence: hash bytes with WebCrypto SHA-256. If compression is necessary, hash the final bytes actually stored/displayed (hashing the original then compressing would make verification impossible). Verified native mode submits within P6 constraints and retains block/index. Otherwise `/api/evidence` stores disk/SQLite blobs keyed by hash. Pass that same hash to contract calls. Rehash displayed bytes and show a match indicator only on an actual match. On ephemeral hosting use persistent external storage/backend rather than assuming Vercel's local disk is durable; document the selected mode.

## 11. Deployment and demo scripts

deploy.ts loads DEPLOYER_SEED from ignored .env, ensures mapping, selects the empirically validated artifact format, deploys Cronpot then MeterMend(cronpot,cronTip), and writes addresses/tx/block evidence immediately. `deployments/portaldot-v3.json` includes network, chainId, specVersion, codeFormat, cronpotMode, contracts and deployedAt. Never populate it with invented addresses or example hashes.

seed.ts registers camera, 3D printer and cordless drill, demo disputeWindow120 seconds; production UI default24hours.

demo.ts uses operator/renter/arbiter plus relayer, all funded. Append each transaction and assertion to `deployments/demo-run.json`:

1. Rent camera; verify reserve increase.
2. Return; verify Cronpot event and, only in native mode, Scheduler.Scheduled.
3. Await deadline; verify refund and actual scheduling/keeper evidence.
4. Rent again, return, propose30% deduction; arbiter approval; verify reserve increase.
5. Propose and approve repair; verify RepairPaid.
6. Withdraw operator income; verify item reserve unchanged.

Record block hashes and transaction success as well as identifiers. Preserve failed attempts clearly and never present a reverted/dry-run transaction as successful settlement.

## 12. Judge-facing README

Required: pitch plus three-line problem; real V3 deployment status/addresses/chainID; `/proof` and Pages links; Mermaid architecture web→PAPI→Revive→MeterMend↔Cronpot→relayer→scheduler plus community bot; Why Portaldot primitive responsibilities and Cronpot explanation; quickstart `pnpm i`, recursive build, env example, `pnpm deploy`, `pnpm seed`, `pnpm demo`, `pnpm dev`; Phase0 findings; human judgment/pruning/wallet limitations; real demo video link when produced; MIT license and accurate statement of code provenance during the Hacker House window. Missing deployments/hosting/video must be visibly marked pending, not invented.

## 13. CI and GitHub Pages

ci.yml on push/PR: checkout@v5 (recursive submodules); Foundry setup@v1, version/build sizes/test-vvv in contracts. TS job: pnpm setup@v4 version10, node setup@v5 node22/cachepnpm; frozen install; recursive typecheck/tests; web build. Pin installation/toolchain decisions consistently. Required TS tests include conversions, event decoding and relayer timing.

pages.yml on main deployment/decision/report changes and workflow_dispatch: contents:read, pages:write, id-token:write. Install frozen dependencies and run `pnpm tsx scripts/report.ts --out site/index.html`; upload-pages-artifact@v4 then deploy-pages@v4 with github-pages environment. Include dependency/workflow changes needed to keep report deployment current. Generated self-contained report contains network facts, Phase0 table, real addresses, chronological demo evidence and actual Foundry count from CI (or clearly unavailable, not a fixed invented count). Permanent report must remain useful after node pruning or app-host failure.

## 14. Build plan and cuts

| Sprint hours | Work / exit criterion |
|---|---|
| 0–1.5 | Scaffold, metadata, Phase0 evidence and decisions |
| 1.5–5 | Contracts and required green Foundry suite |
| 5–7 | Shared chain client, real V3 deployments |
| 7–9 | Seed/live golden path, keeper mode first |
| 9–11 | Prove native scheduler if supported |
| 11–17 | Complete mobile web flows and evidence |
| 17–18.5 | Live DeBox or documented Telegram delivery |
| 18.5–20 | Proof UI/report, CI/Pages, README |
| 20–21.5 | Public web (Vercel) and persistent services (Railway/Render/Fly/VPS) |
| 21.5–23 | Live rehearsal, fixes and screen capture |
| 23–24 | Two-minute video and BUIDL update |

Cut order: arbiter polish, transfer UI (retain contract), native evidence (retain hash-only), DeBox (Telegram), native scheduler (keeper). NEVER cut live testnet deployment, automatic refund, reserve-withdrawal proof or video. Unavailable accounts/funds/platform access are external blockers to resolve, not grounds to fabricate completion.

## 15. Definition of done

- [ ] Both contracts genuinely deployed on V3, published addresses.
- [ ] Live golden path with every transaction recorded.
- [ ] Automatic refund observed; native/keeper mode labeled accurately.
- [ ] Live two-of-three dispute and approved reserve-funded repair.
- [ ] Operator cannot withdraw reserve demonstrated.
- [ ] Public mobile web and functional QR flow.
- [ ] Configured DeBox or documented fallback notifications delivered.
- [ ] Green CI and live Pages proof.
- [ ] Complete README, MIT, ignored secrets and env.example only.
- [ ] Real two-minute video uploaded and linked in BUIDL.

## 16. Demo video script and recording

Target two minutes maximum, 1080p footage with separate voice-over. Use120-second demo windows and edit waits honestly with block/date overlays. Pre-fund accounts and rehearse first. Retain raw recordings. A prior real testnet run may be used with its actual date clearly stated.

**0:00–0:12 — shared makerspace shelf → logo:**
“Every makerspace and campus tech hub has the same problem. Shared equipment breaks, deposits get disputed, and when the 3D printer dies, there's no money set aside to fix it.”

**0:12–0:22 — landing page and reserve meters:**
“MeterMend fixes that on Portaldot. Every rental automatically funds that item's own repair reserve, and deposits refund themselves.”

**0:22–0:42 — QR camera page → rental → SubWallet:**
“Ada scans the QR code on a camera and rents it. One transaction pays the fee and a refundable deposit. Watch the split: twenty percent of the fee goes straight into this camera's repair reserve. It can't be spent on anything else.”

**0:42–1:05 — return photo → countdown → actual scheduling evidence → refund → message:**
“When she brings it back, the operator marks it returned with a photo. Now the dispute window starts. Here's the Portaldot-native part: our Cronpot module hands the refund to Portaldot's built-in on-chain scheduler. No one presses a button. When the window closes, the chain itself executes the refund, and the community gets notified in DeBox.”

In keeper mode, this section MUST instead state that execution is permissionless and the relayer executes the due job. Name Telegram if that is what delivered the notification. Never use native-scheduler footage/claims without actual successful evidence.

**1:05–1:25 — second rental → damage claim30% → arbiter approval → reserve growth:**
“If something is damaged, the operator opens a claim with evidence. It needs two of three: operator, renter, or a neutral arbiter. The arbiter approves, the deduction goes into the camera's repair fund, and the rest returns to the renter.”

The operator's proposal counts as its vote; the contract is operator-plus-renter-or-arbiter approval, with both other roles able to reject. Explain this accurately in UI/docs.

**1:25–1:40 — approved repair → income withdrawal → unchanged reserve:**
“Repairs are paid only from that reserve, only with approval. And if the operator tries to withdraw it as profit? They can't. The contract only releases rental income.”

**1:40–1:52 — proof page → repository:**
“Everything you just saw ran live on the Portaldot V3 testnet. Every transaction is listed on our proof page, and Cronpot is open source for any Portaldot contract that needs scheduled actions.”

**1:52–2:00 — logo, tagline and real URL:**
“MeterMend. Every rental funds its next repair.”

## Amendments recorded before implementation

1. Chain ID hex correction: `420420777 == 0x190f1ca9`.
2. Phase0 read-only run and explicit funded write stages are distinct; unresolved checks remain unverified.
3. Evidence hashes commit the final stored bytes after any compression.
4. Use this existing repository root; retain prior research; push completed features separately as instructed.
5. Dependency substitutions explicitly permitted by section3 must be evidence-backed and pinned in DECISIONS.
6. Preserve dispute authority through financial closure: maintain `unsettledRentals[itemId]`, increment on rent and decrement only on successful refund/dispute closure; transfer requires zero. Physical return still clears `rented`, permitting another rental. Closing an older rental must not clear the current rental's occupancy.
7. Keep voting roles distinct: neither the operator nor arbiter may rent that item. Disputes retain the specified two-of-three behavior and have no new automatic timeout.
8. Cronpot accepts only tips fitting uint128. Both execute and cancel use the same reentrancy guard; consume job eligibility/tip before external callbacks. An executor rejecting its tip gets a recorded pull credit and event so the already-completed target execution is not reverted; provide guarded credit withdrawal. Cancelled MeterMend tips remain documented unallocated dust.
9. Use uint256 intermediates for fee-plus-deposit and fee-times-bps, and skip zero-value refund sends. Preserve checked push refunds: a recipient rejecting funds reverts that settlement and leaves its liability intact; document this limitation.
10. Actual PAPI3 uses injected-account `txCreator` and `createSubmitAndWatch`, not the older signer/submission method names. Descriptor-derived interfaces and observed V3 behavior override stale example names.
