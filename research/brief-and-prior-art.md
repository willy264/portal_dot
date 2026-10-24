# Portaldot Hacker House 2026: brief verification and prior art

Research date: 24 October 2026. This file records sources and reasoning for the main proposal report. Product recommendations are hypotheses, not validated customer demand or claims of global novelty.

## Event verification

The [requested DoraHacks brief](https://dorahacks.io/hackathon/portaldot-hacker-house-2026/detail) returned HTTP 405/human verification to automated access. No authenticated event dashboard or private Discord channel was accessed. A [full public brief mirror](https://www.hackathonradar.com/database/hackathon/portaldot-hacker-house-2026), [DoraHacks' Eventbrite listing](https://www.eventbrite.com/e/portaldot-hacker-house-2026-tickets-2002321816454), and organizer posts were cross-checked. Eventbrite identifies the numerical DoraHacks event as 2362. This is the October–November Hacker House, not the earlier Portaldot Mini Hackathon S1.

The four tracks are Modular Cloud & Middleware; Multi-Chain & Cross-Chain Infra; Node Operations & Tooling; Ecosystem DApps. The organizer's [track explanation, read through a public mirror](https://boldnet.twstalker.com/PortaldotL0/status/2108611245314072679) explicitly directs entrants to pick one track. It emphasizes reusable infrastructure, the node quality program, and repeated real-world DApp use with measurable users and gas consumption. [Original organizer post](https://x.com/PortaldotL0/status/2108611245314072679).

Evaluation: technical feasibility 30%, innovation 30%, ecosystem contribution 20%, business potential 20%. Testnet deployment, public source history, runnable functionality and a short demo are important evidence. This rewards a working, narrowly scoped product with an identifiable user more than an expansive concept.

## Schedule correction

The full brief mirror has an older schedule. A later [organizer update, accessed through a mirror](https://boldnet.twstalker.com/PortaldotL0/status/2109577148109381814) changes these dates. [Original organizer post](https://x.com/PortaldotL0/status/2109577148109381814).

| Milestone | Latest located timing | Lagos time / interpretation |
|---|---|---|
| Check-in | Oct 24, 20:00 UTC+8, in brief; no later change found | Oct 24, 13:00 WAT; already passed when research was conducted |
| Office-hour application | Oct 27, 12:00 UTC | Oct 27, 13:00 WAT; supersedes Oct 30 |
| Office hours | Oct 28–29 | Updated dates; session times need confirmation |
| Final/code freeze | Nov 6, 12:00 UTC+8 | Nov 6, 05:00 WAT; no later change found |
| Live demos | Nov 8–9 | Supersedes Nov 7–8 |
| Community voting | Nov 9, 16:00 UTC–Nov 10, 16:00 UTC | Nov 9, 17:00–Nov 10, 17:00 WAT |
| Winners | Nov 11 | Updated |
| Winner details | Nov 12–14 | Updated |
| Rewards | Nov 14, 12:00 UTC | Nov 14, 13:00 WAT |

Eligibility after missed check-in is not established. Research can continue, but a team that did not check in should resolve that with the organizer before relying on prize eligibility. No message was sent on the user's behalf.

## Prior art that materially changes idea selection

### Migration and compatibility tooling

[Parity's Revive differential testing framework](https://github.com/paritytech/revive-differential-tests) already compares execution outcomes, logs and state across Ethereum-compatible platforms. Simply wrapping these tests in a dashboard has weak novelty. A better product handles the operational gap: identify an actual Portaldot runtime and endpoint, attach compiler/runtime metadata to an application release, rehearse its critical user journeys, and invalidate readiness when the runtime changes. Existing tests are reusable inputs; a deployable compatibility manifest and drift policy are the proposed contribution.

[Polkadot's dual VM documentation](https://docs.polkadot.com/smart-contracts/for-eth-devs/dual-vm-stack/) describes EVM execution alongside PVM. [Revive's compiler repository](https://github.com/paritytech/revive) describes Solidity-to-PVM compilation and observable differences. Neither source establishes which backend Portaldot has enabled. [ink! v6 documentation](https://use.ink/docs/v6/) also makes it unsafe to equate every ink! version with WASM. Pin the toolchain against the actual chain.

### Cross-chain intents and recovery

[Across's intent architecture](https://docs.across.to/guides/concepts/intents-architecture) already separates quote discovery, relayer fills and settlement. A generic intent bridge or swap aggregator is not a strong new direction. [Across's refund documentation](https://docs.across.to/introduction/refunds) shows why an expired order is different from an immediate refund: settlement still has to establish what happened. A proposed recovery product should make cancellation acknowledgments, finality evidence, destination execution and compensation explicit. A timer alone cannot safely prove non-execution on another chain.

[Hyperbridge's Polkadot SDK integration guide](https://docs.hyperbridge.network/developers/polkadot/getting-started/) requires actual runtime/RPC modules. A hackathon team cannot claim Hyperbridge support merely because Portaldot is Substrate based. Adding pallets to a local fork does not add them to the official testnet. [Hyperlane](https://docs.hyperlane.xyz/index) offers chain deployment and messaging tooling, but that still requires compatible contracts, actual deployments, security configuration and relayers; no Portaldot deployment was established in this research.

### Bridge risk controls

[Chainlink's rate-limit reference](https://docs.chain.link/ccip/evm/concepts/cross-chain-token/rate-limits) already provides per-lane limits. Novelty cannot simply be 'a bridge with a pause button.' A more useful Portaldot contribution is a reusable adapter that combines finality health, unsettled obligations and per-route limits, with an incident replay demonstrating what value exposure it limits. It can govern only routes/contracts that actually enforce the adapter, not arbitrary bridges. Chainlink is prior art here, not a verified Portaldot sponsor integration.

### Storage and continuity

[IPFS persistence documentation](https://docs.ipfs.tech/concepts/persistence/) distinguishes a content address from a promise to keep bytes available. A useful storage middleware product is an availability/renewal service: funded retention periods, redundant providers, repair after retrieval failure, and independently inspectable receipts. A CID alone is insufficient evidence of retention, and a signed probe result is an attestation rather than a cryptographic proof of continuous storage.

### Account automation

[Safe's architecture documentation](https://docs.safe.global/advanced/smart-account-overview) already provides account modules and guards. 'AI agent with spending limits' is too generic unless tied to a specific workflow and a precise failure it prevents. A Portaldot automation product should evaluate native runtime calls as well as contract calls, use the actual proxy permissions, and make the difference between recommendation and delegated execution explicit. No Safe deployment on Portaldot was verified.

### Existing Portaldot applications

[PortalHouse's public repository](https://github.com/Investorquab/portaldot-hackathon-2026-portalhouse-investorquab) already describes chain health, transaction history, token creation, identity, contract deployment and AI-assisted commands for the earlier Mini S1. It is prior art, not a verified current Hacker House entrant or proof that every module works on V3. A general 'Portaldot super-app' would overlap heavily. New proposals should focus on a difficult workflow or decision that this interface does not resolve.

## Composition principles used in the proposal report

1. Keep large evidence and private data off-chain; commit identifiers, rules, state transitions and settlement evidence on Portaldot.
2. Use runtime metadata for what the chain actually permits. App developers cannot install arbitrary pallets into the shared testnet.
3. Treat WASM/EVM coexistence, direct cross-VM calls and external-chain messaging as three separate capabilities.
4. Separate source event observation, finality verification, message authorization and economic settlement. Naming something a proof does not supply those guarantees.
5. Use a partner where it adds a specific role: distribution, external data, research review or an optional remote-chain adapter. Partner logos do not establish APIs or prize eligibility.
6. Give each MVP one contract-backed product loop and one adversarial/failure demonstration. Supporting multiple runtimes/chains should follow a successful first deployment, not precede it.
7. Make revenue assumptions explicit and testable: a paying developer team, operator, service vendor or repair network. No user interviews, partner access agreements or purchase commitments were obtained during desk research.
