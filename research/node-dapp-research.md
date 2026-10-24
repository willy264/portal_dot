# Portaldot Hacker House 2026 — Node and DApp research

Research date: 24 October 2026. This report develops original project proposals, not claims that these products already exist. It separates documented interfaces from verified deployment readiness.

## Decision summary

My strongest **Node Operations & Tooling** direction is **Finality Flight Recorder** for an attainable, demonstrable operational product; **Upgrade Rehearsal** has the strongest V3-specific technical story if the organizer supplies the actual V3 runtime/testnet quickly. **Faultline** is the strongest native staking product, but needs sufficient historical observations and must not promise that nomination target weights equal actual exposure.

My strongest **Ecosystem DApp** direction is **MeterMend**, a shared-equipment rental product where every rental funds a portable maintenance reserve. It offers frequent meaningful actions, a clear consumer flow, and a concrete physical-industry use case. **ReproPay** is a more distinctive DeSci/AI ecosystem play with a clear partner-community pilot; **ExitLane** turns service continuity into a working product but is more operationally involved.

Each should enter one primary track. Do not enter a single vague platform into four tracks. The organizer's track announcement calls for infrastructure the node program can keep using and, for DApps, repeat real-world use with measurable users and gas consumption. [Organizer post, mirrored](https://boldnet.twstalker.com/PortaldotL0/status/2108611245314072679)

## Technical findings that affect the ideas

- The official documentation lists native contracts, staking, session, identity, assets, multisig, proxy, utility and transaction-storage interfaces. This is a useful API map, **not proof that every documented call is available in the hackathon runtime**. Discover live metadata first. [Documentation](https://portaldot-dev.readthedocs.io/en/latest/)
- The runtime researcher tested the documented mainnet RPC on 24 October: node 2.0.0/specVersion 1002; `eth_chainId` and `eth_blockNumber` returned method-not-found. That does **not** disprove the promised V3 testnet; it means the older public mainnet endpoint must not be presented as a verified V3 EVM environment. See `runtime-probe.json` and `runtime-research.md` in this directory.
- GRANDPA proof, round-state and justification subscription interfaces are documented; these enable more precise finality diagnosis than counting arriving blocks. [Portaldot GRANDPA RPC](https://portaldot-dev.readthedocs.io/en/latest/module-interface/rpc/grandpa.html)
- Staking storage documents era reward/exposure/preferences and nomination information. Read **actual era exposure**, not merely a user's selected targets, when showing allocation. History depth is bounded. [Staking storage](https://portaldot-dev.readthedocs.io/en/latest/module-interface/storage/staking.html)
- Proxy permissions and announcement delays are runtime-defined. Check the live `ProxyType` and filters before allowing any automation. A nominally narrow proxy is not automatically a product-specific spending policy. [Proxy calls](https://portaldot-dev.readthedocs.io/en/latest/module-interface/extrinsics/proxy.html)
- `transactionStorage.store` indexes data off chain and retention expires unless renewed. It is not permanent decentralized storage; preserve source artifacts separately and use an on-chain contract for their stable commitments. [Transaction storage](https://portaldot-dev.readthedocs.io/en/latest/module-interface/extrinsics/transactionStorage.html)
- Treasury bounties cannot be treated as arbitrary user-funded escrows: bounty approval and curator assignment require a runtime-authorized spending origin. Implement permissionless product escrow as a contract, unless the organizer explicitly provides a suitable privileged flow. [Bounty calls](https://portaldot-dev.readthedocs.io/en/latest/module-interface/extrinsics/bounties.html)
- Documentation of WASM contract instantiation exists. Runtime/toolchain versions must match; current ink! versions and PolkaVM examples must not automatically be substituted for legacy WASM contracts. [Contract calls](https://portaldot-dev.readthedocs.io/en/latest/module-interface/extrinsics/contracts.html)
- **Direct EVM↔WASM contract calls, native-asset access from a contract, Ethereum account-to-Substrate mapping and built-in cross-chain transport remain unverified.** A two-VM design needs either a demonstrated native interface or an explicitly trusted signed adapter with nonce/replay protection and acknowledgement. Most DApp MVPs should use one verified settlement VM.

Shared implementation gate: obtain the actual V3 testnet endpoints, genesis hash, chain ID where relevant, faucet, explorer, compatible compiler/deployment example and one confirmed deployment transaction **before** committing to the final idea. A locally simulated chain alone does not satisfy the deployment requirement.

## Node idea N1 — Finality Flight Recorder

**Pitch:** When a Portaldot application stops settling, identify whether the problem is its RPC provider, one node, or network finality—and produce a reproducible incident bundle that the node-quality program can review.

**User/problem.** RPC operators, validators and the Portaldot technical team lose time comparing dashboards that disagree. A browser can continue receiving best-head blocks while finalized state stops advancing. A provider outage can look like a chain outage, and a chain outage can look like a broken frontend.

**Non-obvious mechanism.** Collect observations from independent vantage points, correlate their finalized heads with local node metrics and authority-round information, and generate a small causal hypothesis tree. A disconnected endpoint with healthy peer observations is a provider incident; shared finality lag with continuing best heads is a consensus/finality incident. Claims carry confidence and evidence. A signed incident bundle can later be challenged or independently reproduced; it is not an automatic verdict against validators.

**Architecture.** Three light collectors subscribe to heads/finalized heads and query supported GRANDPA methods. An operator-side opt-in exporter supplies CPU, peer count, disk and process metrics. A correlator records timestamps, runtime hash, metadata version, endpoint identity, block hashes and observed errors into an append-only local log. Hash its sealed incident bundle into an `IncidentRegistry` contract on the actual Portaldot testnet. The contract supports incident revisions, operator acknowledgements and evidence references. A web viewer renders a timeline and links each diagnosis to the raw evidence.

**Why Portaldot is material.** This is specific to the network's consensus/RPC/runtime interfaces and contributes directly to the announced node-quality program. The on-chain registry makes operator acknowledgements and report versions durable without claiming that hashing proves the diagnosis. It can later accept incident reports from both EVM and native clients through one documented schema.

**Three-minute demo.** Show three healthy RPC paths and a real registry deployment. Disconnect a local test provider: diagnose an endpoint outage while the other providers advance. Replay a separately labelled local multi-node finality-stall recording: distinguish it from an RPC outage. Restore the provider, generate the incident report, anchor its hash in the real testnet, and modify one observation to demonstrate failed artifact-integrity verification.

**MVP, 7–10 focused engineering days.** Read-only collectors; two fault scenarios; deterministic classification rules; incident viewer; deployed registry; install instructions. Ship with a deliberately small supported-method matrix. Runtime changes and limited GRANDPA method exposure must degrade gracefully.

**Prior art/difference.** [Substrate Telemetry](https://github.com/paritytech/substrate-telemetry) already ingests node connection, block import and finalization messages. Rebuilding that screen is weak. The proposed addition is a reproducible multi-vantage incident package, explicit uncertainty, and auditable operator follow-up. Do not claim globally novel monitoring.

**Risks.** During a chain halt the registry cannot accept writes: seal locally and anchor after recovery, preserving observed-time versus anchored-time. RPC majority agreement does not prove consensus truth. Start with incident explanation, not automatic slashing or validator failover. Do not automate validator key migration, which could create duplicate signing.

**Commercial path / measures.** Hosted incident retention and team operations subscriptions; open-source collectors and schema. Measure detection delay, diagnostic accuracy across controlled faults, operator setup time, mean time to repair, and independently reproduced reports.

**Partner fit.** DeBox bot notifications can direct operators to reports. NodeLab might help recruit operators as a community/accelerator, but it is not a verified node-monitoring SDK.

## Node idea N2 — Upgrade Rehearsal

**Pitch:** Before a node or runtime upgrade, prove that the complete user workflows depending on it still work—and give operators a verifiable go/no-go package.

**User/problem.** A runtime change can preserve block production while breaking wallet signing, fee estimation, storage deposits, event parsing, indexers, or a dependent app. Existing contract-unit tests are narrower than the business flow an operator actually has to keep functioning.

**Non-obvious mechanism.** Developers publish workflow manifests: input state, runtime/genesis fingerprint, contract artifacts, ordered wallet/RPC steps and semantic assertions. The runner compares old and candidate environments and generates the smallest failing workflow. Operators and app teams sign the same evidence package; a deployed registry records compatibility claims and expiry by runtime hash. This is service-level upgrade certification, not opcode equivalence.

**Architecture.** A runner uses snapshots/local nodes and, if compatible, Chopsticks forks. Its adapters exercise native extrinsics and the verified V3 contract interfaces. Start with three workflows: token approval/payment/refund; contract storage growth and withdrawal; nomination/proxy permission changes. Normalize status, events and balances into business invariants, not raw equality across unrelated VMs. Store signed reports and dependency graph in `CompatibilityRegistry`. A web view answers which apps are blocked and why.

**Why Portaldot is material.** V3 introduces a particularly useful compatibility boundary: legacy native/WASM clients and incoming Ethereum tooling can fail in different ways on the same network upgrade. The result is reusable release infrastructure for the chain, its nodes, and its builders.

**Three-minute demo.** Register an app's workflow. Run against two local environments with an intentionally changed permission/deposit/event assumption. Show the exact failing user step and before/after effects. Correct the adapter or candidate configuration, rerun, and publish the compatibility manifest to a real Portaldot testnet contract. Make clear that the intentionally modified runtime is local, while the report registry is deployed.

**MVP, 10–13 days, conditional.** One chain version pair, three workflow types, one deliberate regression, one report format, one registry. If no candidate V3 artifact arrives, reduce to app-release compatibility on the current testnet and label it accurately. Do not pretend to test an unavailable runtime upgrade.

**Prior art/difference.** [Chopsticks](https://github.com/AcalaNetwork/chopsticks) provides forks, dry-runs and storage diffs, but mocks several production mechanisms including finalization. [Revive Differential Tests](https://github.com/paritytech/revive-differential-tests) already compares execution behavior between Ethereum-compatible platforms. The distinctive product must be workflow dependencies, wallet/RPC/indexer compatibility, operator review and evidence lineage. Neither tool's existence proves compatibility with Portaldot's older runtime or legacy ink! contracts.

**Risks.** Source/runtime artifact availability; unsupported host functions; incomplete historical state; simulated consensus. A passing rehearsal is evidence for the tested workflow, not a security audit. A local replay cannot certify live network liveness. Do not call PVM and WASM interchangeable.

**Commercial path / measures.** CI integration for app teams, release certification services for node operators, supported workflow packs. Measure distinct regressions caught, reproducibility on a clean machine, time saved in release review, and coverage of actual ecosystem apps.

**Partner fit.** DeBox distributes signed release notices and collects operator acknowledgements. Developer communities can submit workflow packs. Do not bolt on an AI partner unless it materially helps explain a failing trace; deterministic verdicts remain primary.

## Node idea N3 — Faultline

**Pitch:** Help POT nominators choose validators that are less exposed to the same failure, then explain how the network actually allocated their stake.

**User/problem.** A list of attractive commissions can hide correlated operational failures. Selecting many validator names does not necessarily mean independent operators or diverse infrastructure. A nominator also needs to know whether chosen targets became active and earned rewards.

**Non-obvious mechanism.** Build a graph of co-occurring missed activity, commission changes and voluntarily disclosed shared operator/infrastructure affiliations. Separate observed correlation from verified ownership. Let users constrain concentration and simulate historical outcomes. After the election, compare the requested target set against actual era exposure and explain the difference. Recommendations are reproducible policy outputs with provenance, not an opaque APY score.

**Architecture.** Index supported staking/session/offence/reward data from finalized blocks. Optionally accept signed operator disclosures. A deterministic optimizer proposes a target **set**, not fictitious exact weights. A policy registry contract stores a user's policy hash, observation window and acknowledgement. The wallet signs the actual native nomination extrinsic. Later automation uses a runtime-verified restricted proxy with announcement/cancellation; MVP keeps explicit user signatures.

**Why Portaldot is material.** It directly uses native nomination and era-exposure mechanics rather than wrapping stake in a separate financial token. The reports give the node-quality program evidence about where operational concentration exists.

**Three-minute demo.** Show a real validator set and clearly labelled supplemental historical fixture where necessary. Two nominally different validators share correlated outage history. Change the concentration constraint, see a different target set and an honest reward tradeoff, sign a testnet nomination, then show an existing completed-era comparison. Do not wait for a full live era inside the demo or invent a completed result.

**MVP, 8–12 days.** Native data indexer; two policies; one risk graph; manual nomination; deployed policy registry; replayable completed-era report. Do not build liquid staking, yield guarantees or insurance.

**Prior art/difference.** The [Web3 Foundation Thousand Validators backend](https://github.com/w3f/1k-validators-be) already ranks candidates and changes nominations. A rank-and-nominate clone is weak. Faultline adds evidence-labelled correlation constraints, counterfactual explanations and requested-versus-realized exposure accounting. General [Polkadot nomination documentation](https://wiki.polkadot.network/learn/learn-nomination-pools/) provides conceptual context; its constants and pool support must not be copied into Portaldot.

**Risks.** Short history weakens statistics; a public IP is not proof of who owns a validator; correlated downtime is not proof of collusion; topology disclosure may be sensitive. The runtime decides stake allocation. Re-nomination does not remove existing slash exposure or eliminate unbonding constraints. Present operational risk signals, not guaranteed financial returns.

**Commercial path / measures.** Nominator tooling and node-program analytics subscription. Measure concentration of realized exposure, missed rewards explained, active nominations, disclosed operators and policy reproducibility.

**Partner fit.** Community/operator recruitment; DeBox notifications when a signed policy materially changes. No exchange custody or API trading needed.

## Node idea N4 — RoundSafe (preferred alternative when N2 overlaps middleware)

**Pitch:** Coordinate maintenance across independent node operators so that individually sensible restarts do not collectively interrupt finality.

**User/problem.** Independent validators can all react to the same upgrade announcement or cloud-maintenance notice at once. Every operator can have a healthy local deployment process while the aggregate network loses its finality quorum. A shared calendar does not automatically account for current outages or authority-set changes.

**Non-obvious mechanism.** Treat maintenance time as a shared, expiring network resource. An operator requests a window; a deterministic scheduler budgets the actual voting weight expected to be unavailable, adds a safety margin and respects declared correlated failure domains. Before the window opens, it rechecks finality, authority-set ID, current observed outages and prior reservations. A surprise outage pauses new windows. A completed restart requires evidence of recovery before the next reserved window is released.

**Architecture.** A read-only watcher obtains authority-set membership/weights and finalized chain health from the actual supported Portaldot interfaces. A scheduler proposes non-overlapping windows. A deployed `MaintenanceRegistry` records operator-signed reservations, snapshot hash, dependencies and completion acknowledgements. A local sidecar advises the operator whether its reserved window is still eligible; the MVP requires a human to restart the node. If contract-level eligibility is implemented, use explicit signed watcher attestations—do not assume the contract can read the GRANDPA pallet directly. Ownership linkage between operator and validator must be demonstrated with an appropriate known account mapping, never by exporting or sharing validator session keys.

**Why Portaldot is material.** This uses the network's actual consensus membership and provides an actionable coordination service for the high-quality node program. Unlike a generic calendar, reservations become invalid when the chain's authority membership changes. It complements monitoring while delivering a separate operational action.

**Three-minute demo.** Four validators in a clearly labelled local devnet each have unit voting weight. Two operators request overlapping maintenance; only one window is eligible under the configured margin. Make an unplanned node unavailable: new maintenance freezes. Restore it, complete the first restart, then unlock the next window. Show the signed plan and completed reservations in the real Portaldot testnet registry. No deliberate disruption of the shared public testnet.

**MVP, 9–12 days.** Four-node local demonstration, one authority-set snapshot adapter, reservation/conflict view, one interruption scenario, real testnet registry and advisory sidecar. No automatic validator failover, remote shell control or key handling. A simpler four-node simulator is acceptable for illustrating scheduling if clearly labelled, but a real local consensus demonstration is substantially stronger.

**Prior art/difference.** [Kubernetes Pod Disruption Budgets](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) already limit voluntary disruption inside managed clusters. RoundSafe coordinates independent organizations using consensus membership, finality observations and public signed reservations. [Polkadot's GRANDPA explanation](https://medium.com/polkadot-network/polkadot-consensus-part-2-grandpa-fb1963ef6c70) describes a greater-than-two-thirds vote threshold and weighted voting. Use Portaldot's actual GRANDPA authority weights; do not substitute stake balance or assume Polkadot's equal-weight configuration applies. The product is a coordination layer, not a modification to consensus.

**Risks.** Operators can ignore reservations; observed health can be stale; unexpected outages can consume the margin after maintenance starts. Consequently the product reduces coordination risk rather than guaranteeing liveness. Explicitly freeze on stale observations and authority-set transitions, keep emergency manual procedures, and leave restart decisions to operators during the MVP.

**Commercial path / measures.** Node-program managed operations and hosted scheduler; open-source advisory sidecar. Measure coordinated maintenance completion, overlap conflicts prevented, stale-state rejections and finality continuity during controlled drills. DeBox can carry reservations and changes to operator groups; operator communities supply the adoption channel.

## DApp idea D1 — ReproPay

**Pitch:** A marketplace that pays for independently reproducible computation and pays challengers who catch incorrect results.

**User/problem.** Research groups and small AI teams repeatedly pay for evaluations, data processing and model comparisons, yet a result file alone gives weak evidence about what code and inputs produced it. Funding an entire research project before assessing its technical work is a much larger and slower product.

**Non-obvious mechanism.** A buyer posts a small, well-specified computational job with committed inputs, container digest, evaluation policy and escrow. The worker and reviewers all submit salted, job- and participant-bound result commitments before anyone reveals; fixed commit/reveal deadlines govern missing or conflicting submissions. Independent reviewers reproduce a sample or the entire small job, with separate payment for honest review. Disagreement pauses worker payment and routes to a defined adjudicator. Reports retain the full provenance graph so future jobs can reuse approved artifacts while paying again for new computation. A negative result is rewarded if it is correctly reproduced.

**Architecture.** One contract runtime handles job states, deposits, result commitments, reveal windows and payouts. A sandboxed off-chain runner executes one allowlisted workload and produces content-addressed input/output manifests. A backend relays signed reviewer observations; the contract verifies authorized signers, job IDs, nonces and policy version. Optional native identity is displayed as provenance, not proof that accounts are independent. A small registry exposes reusable approved data/model artifacts. Heavy compute and confidential data stay off chain.

**Why Portaldot is material.** The reusable on-chain job/attestation/escrow components contribute a new economic activity primitive to the ecosystem. Rust/WASM can be chosen for deterministic policy code if the correct toolchain is supported, or EVM for compatibility with existing job/payment tooling. Both VMs are not necessary for the MVP; forcing a bridge between them would add avoidable trust.

**Three-minute demo.** Buy a deterministic data-quality or model-evaluation job. Run it and two independent review processes. A deliberately tampered result fails a committed checksum/metric constraint and its payout stays locked; an honest rerun is accepted and paid on the Portaldot testnet. Show the transaction, artifact hashes, review provenance and next repeat job. No medical efficacy claim and no pretend zkML.

**MVP, 9–12 days.** One deterministic CPU workload; two reviewer identities; three states plus dispute; escrow; reusable manifest; live job UI. Do not build a general compute marketplace, scientific peer-review replacement or token launchpad.

**Frequency and measurement.** Each model revision or data import can produce a genuine new evaluation job. Track funded jobs, completed jobs, unique paying buyers, repeat-buyer rate, accepted independent reviews, disputed jobs and gas per completed job. Batch tiny evidence updates; do not generate empty transactions to inflate gas metrics.

**Prior art/difference.** [LabDAO Plex](https://github.com/labdao/plex) already links reproducible computational biology, content addressing and compute records. [Molecule's IP-NFT contracts](https://github.com/moleculeprotocol/IPNFT) and [funding lifecycle](https://docs.molecule.to/documentation/molecule-labs/project-lifecycle) cover research ownership/funding. The wedge is repeat small paid jobs with adversarial reproduction and compensation for discovering bad results. Do not claim to have invented reproducible computing or DeSci.

**Risks.** Reviewer collusion, nondeterministic floating point, hidden data and arbitrary-code execution. Start with deterministic public inputs, pinned container/architecture, explicit tolerances, an allowlisted job and controlled reviewer identities. Hashes prove artifact identity, not scientific truth. A future decentralized reviewer network needs a credible Sybil model.

**Commercial path / partner fit.** Small fee on paid jobs and hosted lab workspaces. DeBox can deliver job/review notifications and group-gated discovery using its documented API. Mintellect or DeSci academic partners are plausible users of the workflow, not verified SDK dependencies. Ask for a real repeatable benchmark from a partner before scaling the feature set.

## DApp idea D2 — MeterMend

**Pitch:** Rent shared equipment, automatically fund its next repair, and keep the service reserve attached to the equipment when its owner changes.

**User/problem.** Makerspaces, equipment cooperatives and small rental fleets collect usage fees but underfund maintenance. A buyer of used equipment cannot easily verify the service history or whether a promised repair budget still exists. A passive equipment NFT does not solve either problem.

**Non-obvious mechanism.** Every completed rental splits payment into operator income and a transparent, capped maintenance reserve. A renter obtains temporary usage rights without owning the equipment. A signed service event unlocks reserve money for a repairer. Ownership transfers carry the reserve and service history forward, with transfer blocked while an unresolved rental or claim exists. This makes the asset's future obligations visible alongside its rights.

**Architecture.** A single-runtime equipment registry/escrow controls reservations, usage grants, refunds and maintenance balance. On EVM, ERC-721 plus the ERC-4907 owner/user distinction is an appropriate interface; on WASM use equivalent documented roles without pretending to implement an ERC address standard. QR codes open the item record. Check-out/check-in are signed by the venue or an authorized attendant, with renter acknowledgement. Repair invoices have public hashes and private optional files; a named adjudicator resolves contested damage. Payment settlement and reserve accounting happen on the Portaldot testnet.

**Why Portaldot is material.** The application turns native payments/contracts and standard-compatible asset interfaces into repeated physical-industry transactions. It also produces reusable reservation, service-record and escrow modules. Native identity can expose operator attestations after metadata verification; it must not be presented as automatic real-world identity verification.

**Three-minute demo.** Scan a QR code for one shared power tool. Reserve it and receive a time-limited usage role. Check it back in, observe deposit refund and automatic repair-reserve allocation. Authorize a documented repair and pay the repairer from the reserve. Transfer the equipment passport to a new owner and show the remaining reserve and history still attached. Use a labelled demo device/attendant; the blockchain cannot detect physical possession unaided.

**MVP, 8–11 days.** One equipment class, one venue, fixed rental duration/rate, checkout/check-in, reserve split and one repair flow. No IoT hardware purchase, automatic insurance, fractional ownership or unsecured lending. Reserve accounting is prepaid maintenance, not an insurance promise.

**Frequency and measurement.** Real reservations and returns recur daily in a shared venue. Measure paying renters, repeat rentals, completed sessions, dispute rate, maintenance reserve utilization and gas per completed rental. Pilot with a known club/makerspace instead of attempting a general marketplace cold start.

**Prior art/difference.** [ERC-4907](https://eips.ethereum.org/EIPS/eip-4907) already separates ownership from expiring usage. [Boson](https://www.bosonprotocol.io/docs-app/concepts/exchange-state-machine/) already models physical commerce and disputes. The proposed wedge is the recurring rental-to-maintenance funding loop and transfer of funded obligations with the asset. Neither standard establishes legal title or physical possession.

**Risks.** Fraudulent equipment records, colluding attendants, damage disputes and reserve insufficiency. One known venue and explicit attestations are adequate for a scoped demo; a consumer launch would require operational agreements and trained dispute handling. Never present token ownership alone as legal ownership of the physical equipment.

**Commercial path / partner fit.** Venue subscription plus small rental settlement fee. DeBox community bot/miniapp for equipment availability, reservation links and return reminders is a substantive integration. Its Portaldot wallet support is unverified: bot-to-external-DApp is the reliable fallback. Community partners can supply pilot users; no technical SDK from NodeLab or RUChain should be invented.

## DApp idea D3 — ExitLane

**Pitch:** Prepay for a digital service without losing the unused balance when its operator disappears: approved backup providers can take over the remaining work.

**User/problem.** Small teams prepay for niche APIs, data services or open-source hosting and depend on one operator. A refund alone may be insufficient when the service is embedded in a workflow. A normal recurring-payment contract does not solve continuity.

**Non-obvious mechanism.** A service subscription includes a portable workload specification, a reserve of unused service credits, and a prequalified backup provider. Providers publish evidence that they can serve the same interface. After multiple signed availability failures plus a grace/challenge window, the active-provider record changes and unspent escrow moves to the backup's claimable work budget. Completed work still earns the original provider its accrued payment. Subscribers can opt for withdrawal instead of migration.

**Architecture.** One on-chain `ServiceAgreement` stores service definition hash, active/backup provider, accumulated work receipts, prepaid balance and failover state. A simple open gateway routes according to finalized on-chain state. Two providers run the same narrow deterministic API. Three controlled watcher processes produce signed health receipts; MVP identities and trust are disclosed. Usage is settled in batches. User-owned input data is encrypted off chain and portable; no operator secrets need to be transferred.

**Why Portaldot is material.** This is a new recurring economic flow for ecosystem infrastructure: a service agreement and prepaid balance continue across operators. The components can later be reused by either VM's clients, but the MVP needs only one deployed contract and a functioning routing gateway.

**Three-minute demo.** Prepay for ten deterministic processing jobs. Complete two with provider A and show its earned balance. Stop A locally, produce labelled health receipts, advance a short demo grace period, and switch to B using the testnet contract. Complete a job with B using the same client URL. Show the untouched user exit/refund path and that A cannot claim B's work.

**MVP, 10–13 days.** One stateless API, two equivalent providers, one portable agreement, three disclosed watchers, a grace-period transition, refund and batch settlement. No automatic migration of arbitrary databases, DNS credentials, AI models or production secrets.

**Frequency and measurement.** Repeated jobs consume service credits and generate meaningful batch settlements. Measure paying subscribers, executed jobs, successful continuity drills, recovery time and gas per settlement. Daily use is the product; on-chain heartbeat spam is unnecessary.

**Prior art/difference.** [Safe modules](https://docs.safe.global/advanced/smart-account-modules) already support recurring transactions and automation. [UMA's oracle implementation](https://github.com/UMAprotocol/protocol/blob/master/packages/core/contracts/optimistic-oracle-v3/implementation/OptimisticOracleV3.sol) illustrates challenge periods and configurable adjudication. This proposal's wedge is continuing the actual service and assigning prepaid work to a compatible backup. Neither Safe nor UMA is assumed deployed on Portaldot; implementing a small explicit adjudicator is more feasible for the hackathon.

**Risks.** Watcher collusion, false downtime reports, data divergence and a centralized gateway. Keep a visible challenge/withdraw path; make providers test-compatible; allow direct client routing from the on-chain registry. A takeover cannot be truly automatic when the chain itself is halted. The MVP demonstrates an explicitly trusted operational policy, not trustless proof of internet availability.

**Commercial path / partner fit.** Fee on service settlements and hosted continuity orchestration. DeBox exposes notifications and subscriber decisions. An AI/compute partner is useful only if it supplies a portable, reproducible workload; inaccessible partner APIs must not block the core demo.

## Integration notes from partner research

- **DeBox** has actual [OpenAPI documentation](https://docs.debox.pro/en/ApiOnePage/) and [miniapp documentation](https://docs.debox.pro/en/MiniApp/). Bot credentials belong on the backend. A group-membership check is an off-chain access rule, not decentralized identity or Sybil resistance. Custom Portaldot wallet support needs a real test; use external-wallet links until verified.
- **NodeLab** appears to be an accelerator/community rather than a node SDK. Its useful contribution would be operator access and pilots.
- **RUChain** is a university blockchain association, not automatically another chain to bridge.
- **Mintellect** is a plausible DeSci/AI product partner but a working SDK was not established by partner research. A demo cannot be architecturally dependent on it.
- Sponsor or partner appearance alone does not establish a bounty, judging criterion, deployment support or integration prize. Parent research handles formal track/prize verification.

## Comparative recommendation

| Idea | Track | Distinctive contribution | 13-day feasibility | Main gate | Best evidence in demo |
|---|---|---|---|---|---|
| Finality Flight Recorder | Node | Reproducible diagnosis across multiple viewpoints | High after endpoint access | Enough independent RPC/metrics views | Two different faults correctly distinguished + registry receipt |
| Upgrade Rehearsal | Node | App workflow compatibility across runtime releases | Medium | Candidate runtime + compatible fork/node runner | Minimal failing workflow, fix, signed registry report |
| Faultline | Node | Correlation-aware target selection and actual exposure accounting | Medium-high | Historical data and nomination availability | Explainable recommendation + real nomination |
| RoundSafe | Node | Consensus-aware maintenance scheduling across independent operators | Medium-high | Authority-set mapping and local multi-node drill | Overlapping restart blocked, surprise outage freezes plan |
| ReproPay | DApps | Repeat paid computation with adversarial reproduction | Medium-high | Small deterministic workload + reviewer trust model | Bad result blocked, good result paid |
| MeterMend | DApps | Repeated rental automatically funds portable maintenance | High | Known pilot venue and attestation model | Rental/refund/reserve/repair/transfer lifecycle |
| ExitLane | DApps | Service continuity and prepaid balance survive operator exit | Medium | Two truly compatible service providers | Provider failure, live takeover, continued job, preserved balances |

These feasibility estimates assume a small experienced team, an operational testnet and immediate compiler/deployment validation. They do not override the event's already-due check-in or commit-history requirements. Do not claim six prototypes; select one, prove the hard dependency first, then implement a complete vertical flow.
