# Portaldot runtime, middleware, and cross-chain research

Research date: 24 October 2026. Researcher role: technical feasibility and original middleware/cross-chain concepts. This is research, not a claim that any proposed integration has been built. No transaction was signed or broadcast.

## Decision-relevant result

The opportunity is strong for tools that make a new dual-runtime ecosystem dependable: compatibility evidence, durable services, and explicitly recoverable cross-chain workflows. The main implementation risk is the gap between the advertised V3 environment and the publicly documented endpoint. Get a working V3 **testnet** deployment recipe before committing to a dual-VM or official-bridge-dependent product.

I performed a live read-only check of the endpoint in the official documentation. At `2026-10-24T17:55:22.884Z`, `wss://mainnet.portaldot.io` returned:

| Query | Observed result |
|---|---|
| `system_chain` | `Portaldot Mainnet` |
| `system_name` | `Portaldot Node` |
| `system_version` | `2.0.0-unknown-x86_64-linux-gnu` |
| `state_getRuntimeVersion` | `specName: portaldot`, `specVersion: 1002`, `transactionVersion: 2` |
| `system_properties` | POT, 14 decimals, SS58 prefix 42 |
| `eth_chainId` | JSON-RPC `-32601`, Method not found |
| `eth_blockNumber` | JSON-RPC `-32601`, Method not found |
| `rpc_methods` | Legacy `contracts_*`, including `contracts_rentProjection`; no `eth_*` methods |
| Other relevant RPC surface | `chain_getFinalizedHead`, `grandpa_proveFinality`, `grandpa_subscribeJustifications`, `state_getReadProof`, `mmr_generateProof`, `system_dryRun` |

Exact response: [runtime-probe.json](runtime-probe.json). Reproducible probe: [probe-runtime.mjs](probe-runtime.mjs). This establishes the interface of that endpoint at that time. It does **not** establish that V3 is unavailable at other endpoints, or that a separate Ethereum RPC proxy is unavailable. RPC method advertisement also does not prove a particular method is fully operational for every historical block.

## What the technologies actually provide

### 1. Portaldot's documented native surface

The official chain-info page gives the mainnet WebSocket, POT14/SS58 42, Ubuntu/macOS binaries and Windows through WSL. The local guide starts a node with `portaldot_dev --dev --alice`. The filename containing `testnet` refers to a local development binary; it is not evidence of a public V3 testnet endpoint. [Chain info](https://portaldot-dev.readthedocs.io/en/latest/chain-info.html), [local guide](https://portaldot-dev.readthedocs.io/en/latest/getting-started/local_test.html)

The Python quickstart installs `substrate-interface`, and the examples cover composing native extrinsics, fees, multisig, contract deployment/calls, historical queries, and subscriptions. Treat those as interface orientation, not an exact compatibility guarantee: contract metadata, runtime API versions, gas types and compiler versions must match. [Installation](https://portaldot-dev.readthedocs.io/en/latest/python-sdk/Install.html), [examples](https://portaldot-dev.readthedocs.io/en/latest/python-sdk/Examples.html)

The public source inspected at `main/bin/node/runtime/src/lib.rs` specifies runtime version 1001 and contains `Contracts`, `Assets`, `Utility`, `Proxy`, `Identity`, `Staking`, `Multisig`, `Bounties`, `Scheduler`, `Mmr`, BABE and GRANDPA modules. That source's contract configuration has `ChainExtension = ()`; it does not expose a custom contract-to-pallet extension. It contains no `Revive`, `Ethereum`, or `EVM` runtime module. This is an older public snapshot, not proof of the V3 configuration. [Runtime source](https://github.com/portaldotVolunteer/Portaldot/blob/main/bin/node/runtime/src/lib.rs)

**Design implication:** use native pallets through transaction adapters and wallets when appropriate. Do not assume an ink! contract can directly inspect or mutate native `Assets`, `Staking` or `Identity` state. A normal application cannot install a new pallet into the shared testnet; that requires a runtime upgrade by network authorities. Hackathon middleware should work as contracts plus off-chain services using existing modules.

### 2. WASM, ink!, EVM and Revive are not interchangeable labels

There are at least three execution paths to distinguish:

| Execution path | Typical artifacts/tooling | Relevant uncertainty |
|---|---|---|
| Legacy `pallet-contracts` | WASM plus ink! metadata; SCALE and Substrate wallet/API | Old ABI versus ink! version, storage rent/deposit model, runtime API compatibility |
| Revive with EVM/REVM backend | Ordinary Solidity/EVM bytecode; Ethereum ABI and tooling | Whether Portaldot enabled this backend and which Ethereum RPC proxy exposes it |
| Revive with PolkaVM backend | Solidity compiled by `resolc` or compatible Rust/ink! tooling to RISC-V | Whether enabled, exact compiler/runtime versions, behavior differences |

Current upstream Polkadot docs describe a dual REVM/PVM architecture and an Ethereum JSON-RPC proxy in front of `pallet_revive`. Thus a Substrate node without `eth_*` methods can coexist with a separate Ethereum RPC endpoint. These are **upstream facts**, not a claim that Portaldot has every Polkadot Hub feature. [Dual VM stack](https://docs.polkadot.com/smart-contracts/for-eth-devs/dual-vm-stack/)

The revive compiler repository describes `resolc` as Solidity-to-PolkaVM tooling and identifies semantic differences from Ethereum concerning gas, contract creation and memory. The PVM deployment path may require code to be uploaded before a factory instantiates it; REVM has different deployment behavior. Pin the chosen backend explicitly rather than treating EVM compatibility as universal bytecode equivalence. [Revive compiler](https://github.com/paritytech/revive), [deployment differences](https://docs.polkadot.com/smart-contracts/for-eth-devs/contract-deployment/), [compiler differences](https://paritytech.github.io/revive/user_guide/differences.html)

ink! v6 documentation targets RISC-V and `pallet-revive`, whereas v5 documentation is marked outdated. Both sites announce that active ink! maintenance stopped in January 2026. Installing “latest ink!” is therefore not a reliable way to target the event's advertised WASM path. Ask the organizer for the exact supported release and example artifact. [ink! v6](https://use.ink/docs/v6/), [ink! v5](https://use.ink/docs/v5/)

**Design implication:** coexistence of a WASM VM and an EVM-compatible VM does not establish synchronous cross-calls, shared storage, common accounts, or atomicity between them. None of those properties was verified for Portaldot. Build a single-runtime core first, or use explicit asynchronous adapters with documented trust and failure behavior. If direct calls are available, prove them using a minimal example before making them architecture-critical.

### 3. Modular architecture: useful composition with real boundaries

Portaldot's native runtime can supply primitives; the application adds a coherent workflow and contracts supply application-specific state. A strong composition uses each primitive for an actual responsibility, for example native identity for operator profiles, finalized chain observations for evidence, an application contract for service escrow, and external storage for artifacts.

The official utility documentation distinguishes `batch`, which may partially execute and signals interruption via events, from `batchAll`, which rolls back the grouped calls on failure. Its listed API surface is broader than the older public runtime source, so discover the live metadata before using it. Native batching does not create cross-chain atomicity. [Utility reference](https://portaldot-dev.readthedocs.io/en/latest/module-interface/extrinsics/utility.html)

**Design implication:** do not call an app modular merely because the repository has folders. Provide replaceable adapters with stable interfaces and reusable outputs: storage backends, chain observers, evidence verifiers, settlement engines and wallet adapters. Demonstrate switching one adapter while the rest of the product continues working.

### 4. Cross-chain claims need a concrete transport

The Portaldot cross-chain page advertises assets/data interoperability with Ethereum, Polygon, Solana and other networks. It links back to generic docs, without giving a usable bridge deployment, message schema, verifier implementation, ABI, supported route table, or finality model in the material inspected. Its iBridge links lead to that descriptive page. [Official cross-chain page](https://www.portaldot.world/protocol/modules/cross-chain)

A bridge must decide which external events to accept and who can authorize destination actions. Ethereum's developer documentation distinguishes bridge designs and security assumptions; an RPC result alone does not make a trustless proof. [Bridge architecture](https://ethereum.org/developers/docs/bridges/)

**Design implication:** three acceptable implementation tiers must be labeled accurately:

1. **Official transport**: integrate a supplied and verified Portaldot bridge/light-client route if available, including deployment addresses and verification rules.
2. **Explicitly trusted prototype relay**: two or three independent observers submit authenticated observations; destination contracts enforce threshold, source chain, source contract, nonce, expiry and replay protection. This is a committee bridge, not trustless interoperability.
3. **No general bridge**: a paired hashed timelock exchange, or multi-chain read/coordination product with no wrapped asset minting. This can demonstrate a real multi-chain flow with narrower trust, but the value proposition must go beyond a basic swap or dashboard.

Do not present locally fabricated events as public testnet messages. If one endpoint is unavailable, keep a labeled local integration test while retaining real Portaldot contract deployment and transactions for the core product. Confirm with organizers whether the fallback still satisfies the selected track.

### 5. External primitives worth composing

IPFS content addressing verifies that returned bytes match a content identifier. It does not guarantee that someone continues storing those bytes; pinning and an economically sustainable retention policy are separate responsibilities. This distinction creates a useful middleware opportunity. [IPFS persistence](https://docs.ipfs.tech/concepts/persistence/)

ERC-4907 gives an NFT a time-bounded `user` role separate from its owner. It can inspire cross-chain usage delegation without pretending that ownership moved. It does not solve cross-chain verification. [ERC-4907](https://eips.ethereum.org/EIPS/eip-4907)

ERC-7683 is currently a **draft**, and the fetched version standardizes solver-facing resolvers and order representation, rather than requiring one universal settlement contract. A new project should pin its reference version and avoid copying assumptions about an older draft's structs. It supplies an interoperability vocabulary, not a bridge or a guarantee of fulfillment. [ERC-7683](https://eips.ethereum.org/EIPS/eip-7683)

## Middleware ideas

These are original product proposals informed by the research. Their projected customers and commercial models are hypotheses to validate, not demonstrated demand. Each is scoped for a small experienced team working roughly 10–13 days after chain access is resolved.

### M1. Runtime Passport — deployment compatibility that expires when the chain changes

**Problem and customer.** A team sees “EVM compatible,” deploys a contract that passed Ethereum tests, then discovers different runtime behavior or a changed chain configuration. Ecosystem reviewers also cannot tell what a deployment actually tested.

**Product.** A CI tool and public registry bind a contract release to its chain genesis/chain ID, source commit, compiler, backend, ABI, runtime metadata hash, runtime version, actual runtime code hash where exposed, and observed behavioral tests. Include proxy implementation/configuration for upgradeable contracts. The application frontend consumes the resulting manifest before enabling sensitive actions. When the runtime or contract code changes, the manifest becomes stale and a reproducible revalidation job is triggered. Metadata/version alone may miss behavior changes; disclose weaker detection when runtime-code introspection is unavailable.

**What makes it different.** This is not a Solidity transpiler and not a new differential testing framework. The novel unit is a **deployment-specific, expiring compatibility claim** with operational enforcement: “These behaviors passed against this chain state and this code.” It connects developers, wallets and ecosystem reviewers. Existing upstream differential tests can be dependencies rather than reinvented.

**Portaldot integration.** One registry contract on the official testnet stores the release commitment, issuer, tested runtime identifier, manifest CID and revocation state. Observer adapters inspect the Substrate and Ethereum interfaces. Optional native identity identifies maintainers. A verifier client performs the runtime comparison locally; the registry does not somehow read native runtime version without a supported interface.

**MVP.** Three representative contracts: token, escrow and factory. Check caller/address conversion, failure behavior, token conservation, contract creation, events and fee/deposit estimates where relevant. Support one actual Portaldot contract environment and one local Ethereum reference first. Add the second Portaldot VM only when available. Present claims per tested property, never as an audit certification.

**Three-minute demo.** A release passes and the frontend enables escrow. Change a fixture to simulate an incompatible runtime or testnet upgrade; the manifest is rejected and the UI explains the failed assumption. Revalidate and publish a replacement commitment, showing both transactions. The simulated change must be labeled; do not imply a public network upgrade occurred during the demo.

**Commercial hypothesis.** Paid CI, managed compatibility monitoring and support for teams deploying across heterogeneous runtimes; free public manifest format benefits the whole ecosystem.

**Risks and gate.** Need reliable introspection and one working deployment toolchain. Passing a finite suite is not formal verification. No need for synchronous VM interoperability. Sponsor path: a node/infrastructure partner can run an independent attestor; a partner application can serve as a real pilot, if a documented API/integration exists.

### M2. Continuity Vault — a dApp's data survives its original operator

**Problem and customer.** A small dApp has on-chain assets but its metadata, evidence files or API state disappear when the developer stops paying for hosting. A hash on-chain is not enough to reconstruct the product.

**Product.** Developers register a recovery bundle: encrypted files where needed, a manifest, version history, retention term and a minimal restoration recipe. Independent storage providers accept the job and receive periodic payments only after agreed retrieval challenges. A standby operator can take over the serving role after missed service windows, using the same immutable bundle and contract configuration.

**Creative composition.** Content-addressed storage + recoverable service state + prepaid escrow becomes **continuity as a service** for small ecosystem dApps. The output is not just a storage marketplace: it is a demonstrably restorable product component.

**Portaldot integration.** Registry and retention escrow run on Portaldot; native identity can identify providers. Content stays off-chain and commitments/checkpoints settle on-chain. Use independently signed challenge receipts or customer-confirmed delivery; clarify that an HTTP failure is not by itself objectively provable on-chain. A bounded dispute window and explicit arbitrator are honest MVP choices.

**MVP.** One metadata collection, two independently operated local/container storage providers, one customer, one backup gateway and prepaid POT escrow. Verify actual downloaded bytes against CID/hash. Restrict challenges to a known object-size range. Include lease expiry, provider cancellation, stale evidence, and customer withdrawal. No bespoke decentralized storage network or new cryptographic proof system.

**Three-minute demo.** Register a dataset, pay for continuity, retrieve it. Stop provider A. Provider B restores the identical data and an app remains usable. Show an altered file being rejected, then release a payment against a valid receipt. Different local processes prove workflow, not genuine decentralization; public independent operators are a later milestone.

**Commercial hypothesis.** Developers pay a predictable retention-and-recovery subscription; providers earn service fees. The ecosystem gains reusable retention infrastructure.

**Risks and gate.** Economic retrieval fraud, correlated hosts and arbitration are unresolved production concerns. Pinning itself is not proof of an entire retention period. Sponsor path: infrastructure partner for hosting, research partner for preserving reproducibility bundles, community app for media durability. No sponsor dependency in the core.

### M3. ReceiptMesh — APIs that carry enough evidence to explain a wrong result

**Problem and customer.** A cross-chain app consumes an API response, but later cannot reconstruct which chain state, schema or transformation produced it. A stale response can look identical to a fresh one.

**Product.** An API gateway returns data together with a machine-readable evidence envelope: source chain and block hash, finality status, schema version, transformation code hash, response commitment, provider signature and expiry. Consumers choose a policy—finalized only, two agreeing providers, bounded age—and reject unsuitable data. The product offers paid subscriptions with a modest bonded provider registry.

**Creative composition.** Combine indexed blockchain data, reproducible transformations and application-level acceptance policies. The result is **debuggable data procurement**, useful to developers and AI agents alike. It is not an oracle that claims to prove arbitrary real-world truth.

**Portaldot integration.** Portaldot hosts provider registration, subscription escrow and batch roots of evidence envelopes. Native chain adapters gather finalized observations. A WASM or Solidity verifier checks small commitments/receipts if supported; transforms run off-chain. Avoid expensive raw response storage on-chain. Optional storage proofs are verified against an authenticated header; an untrusted RPC's self-reported root alone is insufficient.

**MVP.** Two API methods: asset balance at a finalized block and staking exposure summary. Two adapters plus a simple SDK. Batch receipts periodically; the UI displays provenance and cost. Providers can attest different but legitimate block heights, so compare at a common requested block rather than treating every difference as dishonesty.

**Three-minute demo.** Query a balance and inspect a reproducible receipt. Inject a stale provider response and show the consumer policy rejecting it. Tamper with one field and fail signature/hash verification. Retrieve the original inputs and replay the transformation to the same output.

**Commercial hypothesis.** Usage-based API fees and hosted observability for ecosystem developers; open-source envelope and verification SDK.

**Risks and gate.** Availability, authenticating chain headers and signature support. A signed receipt proves who claimed something, not that the source was true. Sponsor path: a partner's API or research dataset can supply a concrete additional adapter; only claim this once permission and endpoints are available.

## Cross-chain ideas

### C1. RescueRoute — cross-chain intents with a rehearsed recovery path

**Problem and customer.** Most cross-chain demos show an uninterrupted transfer. Real users get stuck between a lock, relay, fill and payout with no precise answer about whether to wait, retry or refund.

**Product.** A user buys an outcome by a deadline, such as delivery of a specified test asset to a destination account. An explicit state machine records acceptance, origin commitment, destination fulfillment, confirmation and settlement. Every transition has an idempotency key, evidence requirements and an allowed recovery action. The distinctive product is a safe recovery console plus SDK, not another best-price bridge router.

**Portaldot role.** Coordination and service-bond accounting sit on Portaldot. A destination adapter handles one external testnet. Use an official bridge only after verifying its availability. Otherwise demonstrate a precisely labeled threshold relay. The contract prevents duplicate settlement and separates user refunds from disputed solver compensation.

**MVP.** One route, one test token, two solver identities, no swaps and no arbitrary calldata. Include four adversarial cases: duplicate delivery, delayed confirmation, destination failure before fill, and evidence arriving around expiry. The contract state model must prevent “refund paid and solver later paid for the same order.” During uncertainty, use a bounded pending/dispute state rather than inventing an instant safe refund.

**Three-minute demo.** Complete one order. Pause the relay on a second. Resume it and reject a duplicate. Fail a third before delivery and refund according to the policy, showing origin/destination transaction hashes and the Portaldot recovery state.

**Differentiation and business.** Charge infrastructure teams for integration and recovery monitoring. ERC-7683 can inform the solver-facing adapter, but standards compliance is optional for the first version. A strong pitch is lower support cost and fewer stranded orders, measured through fault-injection completion rate.

**Limits.** An asynchronous relay is not atomic execution. A timeout alone cannot prove no destination payment happened. Committee collusion and chain halts remain material; never describe a bond as eliminating those risks. Sponsor path: a documented exchange/chain integration can serve as a later route; do not promise custody or withdrawals without explicit API support.

### C2. CapacityLane — reserve cross-chain liquidity before promising a payment

**Problem and customer.** A merchant or payroll app needs predictable delivery at a future time, while a spot bridge quote says little about whether usable destination inventory will still exist then.

**Product.** Liquidity providers sell short-lived reservations for a specific route, asset, quantity and delivery window. Reservations consume capacity in an on-chain ledger so an operator cannot sell the same committed inventory repeatedly within the system. The user later exercises or cancels; the operator receives a reservation fee and settlement fee. Unused capacity is released.

**Creative composition.** Bring the distinction between **capacity reservation** and **execution** to cross-chain payments. The novel artifact is a bounded service commitment, not a synthetic yield token or another wrapped asset.

**Portaldot role.** Portaldot is the reservation and provider-bond coordinator. A destination vault holds demo inventory. Evidence of inventory and delivery is supplied through a verified transport or an explicitly trusted observer set. A native identity ties commitments to an operator. No guaranteed ownership of remote assets should be inferred from a Portaldot balance entry.

**MVP.** One merchant, two providers, two chains, one asset, 10 reservations. One provider's capacity is fully reserved; a new request must route elsewhere or fail. Demonstrate cancellation before exercise, expiry after non-use, and exercise with a deadline. Prefer a destination vault that restricts unauthorized inventory withdrawal over an unverifiable balance screenshot.

**Three-minute demo.** Schedule three future merchant settlements. Show a fourth being rejected because capacity is exhausted. Cancel one, free capacity and accept a new request. Exercise a reservation and link the destination payment to Portaldot settlement.

**Commercial hypothesis.** Reservation fees for predictable merchant/payroll delivery, with providers competing on reliability and capacity utilization. Useful metrics: overbooking prevented, reserved versus delivered capacity, cost of idle inventory.

**Risks and gate.** Cross-chain synchronized reservation and withdrawal policies are difficult. MVP must have one authoritative coordinator and disallow out-of-band inventory use, or clearly label resulting counterparty risk. This is medium/high feasibility risk compared with the middleware concepts. Sponsor path: any real liquidity/exchange partner could be a provider, but such access is not established by event partnership.

### C3. RightRelay — move a bounded permission while ownership stays put

**Problem and customer.** A game, membership community or research service on Portaldot wants to recognize an entitlement held on another chain. Bridging the entire asset introduces custody, double-minting and redemption complexity even when the user only needs temporary access.

**Product.** The owner grants a narrowly scoped, expiring right on the origin chain: access one dataset, use one game item, attend one event, or invoke one paid capability. A destination registry on Portaldot activates that permission after checking an authenticated origin observation. The right has an audience, expiry, origin identifier, holder, nonce and revocation state. Original ownership remains on the source chain.

**Creative composition.** ERC-4907-style owner/user separation + cross-chain authenticated messages + Portaldot identity/access produces a **permission bridge** with smaller asset-custody exposure. The target app enforces the right; it does not claim control over the original NFT.

**Portaldot role.** All access consumption, revocation checks and app actions occur on Portaldot, making it the active application environment. The external chain is the source of a bounded entitlement. Optional token payment on Portaldot covers the rental/use fee.

**MVP.** One ERC-721/4907-like mock collection on an external testnet and one Portaldot registry. One clear use case: a dataset owner rents access to a reproducibility workspace for one hour. The relay verifies owner authorization, allowed audience and bounded expiry. Add revocation, replay protection and a freshness policy; if the source observation is stale, disable high-value access.

**Three-minute demo.** Delegate the right, use it on Portaldot, show ownership unchanged, then revoke or expire it and deny the next request. Replaying the old grant must fail. A low-stakes game/community demo avoids pretending to enforce physical asset ownership or copyright law.

**Commercial hypothesis.** SDK and usage fees for games, memberships and paid research access. Ecosystem effect: users can start using a Portaldot product without first transferring valuable assets.

**Risks and gate.** Revocation travels asynchronously; there is a real stale-access window. Expiry requires the consuming app to check time. The MVP can use threshold attestations but must disclose that trust. Sponsor path: a social/community or research partner can be the consuming app if its SDK supports the required integration; otherwise build an independent demo.

## Relative prioritization

Prior art constrains novelty: [InkPort](https://github.com/freedanjeremiah/portaldot-hackathon-2026-inkport-dmk) already translates a Solidity subset to legacy seal0 WASM for Portaldot, while [revive-differential-tests](https://github.com/paritytech/revive-differential-tests) already addresses differential contract behavior testing upstream. Runtime Passport should reuse existing verification machinery and differentiate through deployment manifests, runtime drift, application enforcement and public evidence. A new compiler or a generic EVM-versus-WASM benchmark would be a substantially weaker novelty claim.

| Idea | Main advantage | Main risk | My judgment |
|---|---|---|---|
| Runtime Passport | Specific to V3 rollout; reusable ecosystem tooling; sharp evidence-based pitch | Both runtimes unavailable limits dual-runtime story | Best middleware bet if team strong in tooling |
| Continuity Vault | Visceral demo; real storage/service gap; limited contract scope | Retrieval disputes and economics need honest scope | Best middleware bet for product/demo team |
| ReceiptMesh | Useful developer primitive; no asset bridge required | Can drift into generic API/indexer unless receipts drive behavior | Strong if one real consumer is included |
| RescueRoute | Failure demo is memorable; reusable cross-chain infra | Settlement/refund ambiguity | Best cross-chain bet with a working transport |
| CapacityLane | More distinctive than swaps; clear capacity economics | Inventory controls and cross-chain coordination | Highest complexity; choose only with strong backend experience |
| RightRelay | Avoids full ownership bridging; understandable user value | Revocation delay/attestor trust | Best cross-chain/product balance |

## Questions that unblock implementation

These are concrete questions to take to organizers; this research did not send them externally.

1. What is the current V3 **public testnet** WebSocket endpoint, genesis hash, runtime version and explorer?
2. What is the V3 Ethereum HTTP/WebSocket RPC endpoint and chain ID, and is it a separate proxy?
3. Is the enabled Solidity backend REVM/EVM bytecode, PolkaVM via `resolc`, or both? Which `solc`, `resolc`, Hardhat/Foundry plugin versions are validated?
4. Which ink! release/artifact targets the live WASM path? Please provide a working deploy-and-call example.
5. Are direct calls between legacy WASM and EVM/Revive supported? If so, provide an executable example and explain address mapping, ABI translation and atomicity.
6. Can contracts access native Assets/Identity/Staking through precompiles or chain extensions? Which addresses/interfaces and runtime versions?
7. Which official cross-chain route is usable now? Provide source/destination chains, deployed contract addresses, ABI/SDK, verifier model, finality policy, replay protection and recovery behavior.
8. Is a self-hosted testnet node accepted for final deployment evidence, or must deployment target a specific shared testnet? How is test POT obtained?
9. Are the website's iBridge, iSwap, DaaS and `@portaldot/sdk` APIs released developer products or architectural descriptions? Which repositories/deployment registries are authoritative?

## Source hygiene

The `.world` pages are useful descriptions, but performance numbers, “battle-tested” language, logos and simulated product pages are not implementation evidence. An upstream Polkadot capability is not automatically a Portaldot capability. Existing S1 entries are prior art, not documentation of the current V3 deployment. Ethereum token standards do not automatically describe native `Assets` or old ink! token interfaces. A relay's valid signature proves who endorsed a message; it does not independently prove the external chain event. These distinctions are central to keeping the ideas buildable and the eventual pitch credible.
