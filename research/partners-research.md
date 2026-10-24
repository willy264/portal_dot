# Portaldot Hacker House 2026 — partner technology and integration research

Research date: 24 October 2026. Research includes primary documentation, public repositories, direct read-only API probes, and limited social-profile mirrors for identity discovery. No accounts created, messages sent, transactions signed, or assets transferred.

## Main finding

I could not verify a separate sponsor bounty, sponsor-specific prize, or sponsor-track scoring rule for this event. The available event brief describes four Portaldot tracks. The organizer's partner announcement describes supporting teams, organizations, and media partners. Accordingly, the integrations below are **optional partner integrations, not verified sponsor bounty qualifications**. Neither a logo nor a partnership announcement proves an API integration, chain deployment, or extra prize.

Event source: [DoraHacks brief](https://dorahacks.io/hackathon/portaldot-hacker-house-2026/detail), whose fetch returned 405; [brief mirror](https://www.hackathonradar.com/database/hackathon/portaldot-hacker-house-2026). The organizer partner announcement is reproduced in [this social mirror](https://zamantika.com/profile/haoyouknow_) and [Portaldot Vietnam's mirror](https://boldnet.twstalker.com/_portaldot_vn). Original organizer identity is [@PortaldotL0](https://x.com/PortaldotL0). Treat mirrored announcements as a lower evidence tier than directly fetched primary documents.

The three most actionable technical integrations found are **DeBox**, **Matrix**, and **Echobit public market data**. These are unusually different components: community interaction, a BNB-derived execution network, and an external financial data source. Their value comes from assigning each a narrow role in a Portaldot product.

## Integration readiness at a glance

| Partner | What was established | Concrete integration surface | Readiness and limitation |
|---|---|---|---|
| DeBox / `@DeBox_Social` | Substantial official developer docs | Bot OpenAPI; Go/Node/Python SDKs; H5 DApps; EVM wallet provider | Best documented. Bot credentials needed; custom Portaldot wallet-chain support unverified. Use bot + external DApp if necessary. |
| Matrix / `@Matrix__Chain` | Official site links matching X handle, docs and GitHub; live read RPC responds | BNB envelope transactions, derived EVM state, TypeScript SDK, JSON-RPC | Real technical surface, but docs/source contain stale Facet wording. Latest block time anomaly observed; deployment smoke test required. |
| Echobit / `@EchobitExchange` | Official API docs and successful unauthenticated read | REST/WS tickers, depth, trades, candles | Public market feed usable now. Trading/account endpoints require approved API keys; no need for them for this hackathon. |
| The Web3 / `@0xtheweb3` | Primary GitHub confirms education, solutions, incubation and public code | Code examples, community testing, architecture review | A technical/community collaborator, not a verified hosted middleware dependency or bounty. |
| GoldHouse / `@goldhousedotcc` | Official app website and App Store product | Social identity, payments, governance, app hub advertised | Potential distribution channel; no documented public SDK/API found. Do not promise programmatic integration. |
| Noma / `@noma_network` | Official linked GitHub NClaw repository found | README describes AI + BNB applications | Repository currently has one short README and one commit, not a runnable agent SDK. Optional future worker, not MVP dependency. |
| Mintellect / `@Mintellect_AI` | Identity and knowledge-asset product claims found | Claimed code/model/dataset licensing | Official domain could not resolve in this session; no public SDK verified. Best treated as potential pilot user or future marketplace. |
| Cortex Network / `@Cortex_Network_` | Agent-work identity resolved | Advertised autonomous agent execution | This is cortexnetwork.ai, not automatically Cortex Labs/CTXC. Domain unavailable and no runnable SDK verified. |
| RunePool / `@RunePoolBTC` | Official runepool.ai site reachable; matching social links in app assets | Agent capital/execution product and app advertised | This is not automatically THORChain RUNEPool. No public integration specification verified. |
| XPower / `@XPowerFinance` | xpower.cc official product page found | Cooperative pooled-finance product advertised | No verified contract ABI, deployment manifest, public testnet or SDK located. Avoid making it essential. |
| TronBank / `@TronBankPro` | Official Telegram identifies energy leasing/TRX staking | TRON resource product | No usable public developer API verified. Native TRON tools are not proof of TronBank integration. |

The full announcement also names NodeLab, Jinse Finance, Odaily, Feixiaohao, HNUBA, CUFE association, DeSci Sino, BUPT3DAO, UpchainDAO, RUChain, CUIT association, and CityUHK Web3AI. Most are ecosystem, media, educational, or community partners. Do not invent APIs for them. In particular **RUChain is the Renmin University of China Blockchain Association, not a separate execution chain**, and NodeLab's profile describes acceleration/incubation rather than a node-operation SDK. Profile evidence: [RUChain mirror](https://jilbab.twstalker.com/OfficialRUChain), [NodeLab profile mirror](https://www.twitterspacegpt.com/hosts/NodeLab_). University acronyms beyond those resolved here need organizer confirmation before naming exact institutions.

## DeBox: how it fits technically

[DeBox Open Capabilities](https://docs.debox.pro/en/OpenPlatform/) documents bots, web DApps, SDKs, deep links and a separate revenue-sharing protocol. The social layer can acquire users, deliver incident updates, collect task applications, and return users to a transaction interface. It does not itself establish Portaldot consensus or validate real-world claims.

[Bot guide](https://docs.debox.pro/en/APIs/BotGuide/): create a bot via BotMother; keep App Key/Secret on the server. Ordinary direct-mention text commands are the simplest integration path. Listening to ordinary unmentioned group messages or some richer message types requires permission review, so an MVP should avoid depending on that review. Webhook and polling are alternative receiving configurations; bot visibility is a separate permission. Public launch/discovery is not necessary to demonstrate a private test bot.

[OpenAPI](https://docs.debox.pro/en/ApiOnePage/): `https://open.debox.pro` is the base URL; authenticated endpoints use `X-API-KEY`. Useful calls include `POST /openapi/bot/sendMessage`, `POST /openapi/bot/getUpdates`, `GET /openapi/group/is_join`, and user/group lookups. Use group `gid` for group routing and `user_id` for private routing. Rate limits and permissions are per API, so design a bounded notification queue with backoff rather than broadcasting every chain event.

[H5 DApp guide](https://docs.debox.pro/en/MiniApp/): HTTPS web pages can run inside the app. `window.deboxWallet` is the preferred EVM provider, with `window.ethereum` fallback; the docs include `personal_sign` and transaction examples. Wallet prompts still require user confirmation. I found no evidence confirming a Portaldot custom network can be added to this client. The reliable fallback is a DeBox message with a link to an ordinary Portaldot DApp. Linking DeBox identity to a Portaldot account requires an explicit signed challenge; do not equate an EVM address with an SS58 account automatically.

[Shares protocol](https://docs.debox.pro/en/Shares/) lists Ethereum, Arbitrum, Base, BSC, Optimism, and Polygon for DApp payment sharing. **Portaldot is not listed.** Native payment splitting on Portaldot should use the project's own contract. A separate Shares payment on a supported network is possible only with an explicit cross-chain design; it is not a free composability feature.

Strong creative fits:

- **Reproducibility escrow:** researchers create a benchmark task from a community; a Portaldot contract holds bounty funds and records a pinned evaluation specification; DeBox routes independent reviewers to the test, posts status, and links a wallet-approved settlement. The differentiator is reusable verification work with explicit acceptance conditions, not chat-driven token transfer.
- **Service continuity escrow:** a community prepays a provider, monitors attest availability, and after a defined failure interval Portaldot moves unearned credits to a backup provider. DeBox makes the recovery understandable and actionable to affected customers. Membership is distribution/context; it is not a proof of outage.
- **Incident response coordination:** after an observed finality gap, the bot posts one signed incident digest, opens a diagnostic page, and lets operators acknowledge responsibility. On-chain incident commitments allow a later postmortem to check whether evidence was altered. The bot should never request validator signing keys.

## Matrix: a technically meaningful second network

Identity link was checked in live HTML: [matrixlabs.app](https://matrixlabs.app/) links [@Matrix__Chain](https://x.com/Matrix__Chain), [Matrix docs](https://docs.matrixlabs.app/), and [MatrixonBNB GitHub](https://github.com/MatrixonBNB). Its docs' social page still names `@Unstoppable_BSC`, so the live site provides a clearer current identity link.

[Architecture](https://docs.matrixlabs.app/introduction/architecture-overview): users put payloads in BNB L1 transaction calldata; Matrix-node derives the input stream; Matrix-geth executes it and exposes EVM state. Matrix describes BNB as the ordering, data-availability and finality base. This is a useful architecture to understand because a successful L1 envelope and a successful L2 contract execution are distinct observations. Treat performance and security slogans as protocol claims, not benchmarks independently verified here.

[Sending transactions](https://docs.matrixlabs.app/sequencing-by-bnb/sending-transactions): the wallet remains on BNB; an envelope targets the documented inbox `0x00000000000000000000000000000000000bbbb1`, with envelope `value=0` and encoded calldata. This differs from ordinary direct EVM JSON-RPC sending to the execution network. The docs do not clearly prove that the shown inbox is correct for every environment; verify testnet constants before use.

[Transaction specification](https://docs.matrixlabs.app/sequencing-by-bnb/matrix-transaction-spec): typed payload `0x46` plus an RLP encoding of chain ID, recipient, value, gas limit, data and mine boost. Contract creation has an empty recipient. Sender identity is derived from the outer BNB transaction rather than a separate payload signature. The page has inconsistent token/minting terminology; do not reuse it uncritically for monetary logic.

[Network information](https://docs.matrixlabs.app/reference/network-information.md), fetched directly, documents testnet chain ID `768946` / `0xbbbb2`, RPC `https://testnet.matrixlabs.app/`, and explorer `https://test-explorer.matrixlabs.app/`; mainnet RPC is marked coming soon. The web search tool's cached HTML had stale links pointing at Facet, whereas current Markdown had Matrix endpoints. The runtime probe, not a stale link, confirmed the chain ID.

[Matrix SDK](https://github.com/MatrixonBNB/Matrix-sdk) is a TypeScript fork of Facet's SDK with viem/wagmi adapters. It contains `sendMatrixTransaction`, `writeMatrixContract`, transaction hashing/encoding, and React hooks. However its README still calls the network an Ethereum rollup and uses ETH/FCT examples. Inspect source constants and pin a commit; a package name in a README is insufficient evidence of correct deployed defaults.

**Read-only probe evidence** is saved in `partner-probes.json`. On 24 October 2026, `eth_chainId` returned `0xbbbb2`; latest height advanced across two calls several minutes apart. The later block was `0x3d69e42`, hash `0x13869af4023fb5a479968e166adceb6e825577c989cd2ec974b83eddcffb5a2b`. Its timestamp decoded to **2027-12-08 04:34:35 UTC**, inconsistent with the research date. This establishes endpoint reachability, not reliable clock/finality semantics. Do not use its timestamp for escrow deadlines before resolving the anomaly.

Strong creative fits:

- **Recoverable cross-chain workflows:** Portaldot holds a job budget and state machine; Matrix performs a bounded EVM action; an observer records both envelope inclusion and execution receipt. Demonstrate a destination revert, delayed receipt, duplicate delivery and eventual refund/retry. This exposes the failure boundary that generic bridge demos hide. Portaldot acceptance relies on the disclosed observer/quorum unless a real verification bridge is implemented.
- **Portable receipt/credential bridge:** an issuer records a license or completed task on Matrix; a Portaldot verifier imports a scoped, expiring signed assertion with source chain, block hash, schema and replay ID. Revocation/freshness checks are part of the product. A signed assertion is not a trustless state proof.
- **Compatibility manifest:** the same contract test vector runs on Portaldot EVM and Matrix EVM, but deployment and finality adapters are deliberately separate. The manifest reports which assumptions actually hold. The stale-SDK differences found during this research make the pain point concrete.

## Echobit: usable public data without a trading dependency

[Official API landing page](https://www.echobit.com/en-us/api-apply) links a developer documentation site. Its API keys require application/approval. That requirement applies to private/account/trading uses; public market reads are separately documented.

[HTTP docs](https://echobit.gitbook.io/echobit-user-docs/en/http.md) specify `https://uapi.echobit.com`; [market-data docs](https://echobit.gitbook.io/echobit-user-docs/en/http/market-data.md) provide unauthenticated tickers, trades, depth and candles. Relevant routes are `/uapi/exchange/ticker?symbol=BTCUSDT`, `/uapi/exchange/depth`, `/uapi/exchange/trades`, and `/uapi/exchange/klines`. A direct ticker request returned a successful `code: "0"` JSON response in this session. No trading account or secret was used.

[Authentication/rate limits](https://echobit.gitbook.io/echobit-user-docs/en/http/authentication-and-rate-limits) document unsigned common/market reads at 1,200 requests per 60 seconds, while account/trade endpoints require timestamp, HMAC signature, and `X-EC-APIKEY`. [WebSocket quote docs](https://echobit.gitbook.io/echobit-user-docs/en/websocket/quote.md) describe an unsigned live feed at `wss://uapi.echobit.com/uapi/exchange/ws` with ticker, depth, candles and trades subscriptions. Check current limits while implementing.

[EchoAgent](https://www.echobit.com/en-us/echo-agent) advertises MCP/skills and spot/perpetual capabilities. I did not verify a runnable public EchoAgent package or full installation path. Ordinary REST/WS integration is the better-evidenced dependency.

Strong creative fits:

- **Liquidity exposure limits:** use depth/volatility/staleness as external inputs to a Portaldot policy contract that limits new cross-chain commitments. The product's action is "reduce allowed exposure while evidence is weak," not an AI price prediction. Have separate evidence for bridge reserves and chain health; exchange prices cannot prove either.
- **Auditable data-source adapter:** an event middleware stamps each received market observation with source, retrieval time, payload hash and signer, and gives downstream apps freshness/replay controls. Commit a compact batch root on Portaldot. This makes one centralized source auditable; it does not decentralize truth.
- **Failure lab:** replay a captured feed, then inject stale or missing data and show a deterministic policy pause with a DeBox incident notice. Replay data must be visibly labeled. Live market prices alone are not enough to value POT or an asset without a documented liquid trading pair.

## Mapping to the candidate portfolio

| Candidate | Strongest optional integration | Why this combination is useful | Keep outside the MVP |
|---|---|---|---|
| Compatibility manifest / drift detection | Matrix SDK + The Web3 pilot testers | Two EVM environments with genuinely different transaction/finality plumbing | Claiming universal EVM/WASM equivalence |
| Proof-aware event middleware | Matrix receipts + Echobit observations | Normalizes evidence from chains and external APIs without hiding their trust differences | Calling every signed API result a cryptographic state proof |
| Storage renewal | DeBox reminder/renewal flow | Gives organizations a place to act when durable data becomes unavailable | Claiming DeBox itself supplies decentralized storage |
| Recoverable cross-chain workflows | Matrix execution adapter | Demonstrates receipt lag, failed execution and retry/refund semantics | Asset bridge security or atomicity not implemented |
| Bridge exposure/health budget | Echobit market data + Matrix observer | Combines market conditions and execution status to cap exposure | Autonomous trading, exchange withdrawals, promised hedge liquidity |
| Credential/data bridge | Matrix source registry + DeBox distribution | Portable, expiring evidence with a revocation path | Trustless verification without the verifier |
| Finality incident recorder | DeBox incident channels | Shortens detection-to-response loop; commits evidence for later review | Automatic validator-key actions |
| Upgrade rehearsal | Matrix comparison adapter + The Web3 reviewers | Finds compatibility changes; produces reproducible checks | Claim that a third-party chain can preview Portaldot's runtime migration |
| Correlated staking risk | DeBox staking-group reporting | Makes concentration and downtime correlation understandable to delegators | Treating a social identity as proof of independent infrastructure |
| Reproducibility escrow | DeBox workflow; university/DeSci pilot users | Independent reproduction and explicit reward conditions | Mintellect SDK dependency before docs/access are obtained |
| Repair reserve | DeBox community coordination | Shared equipment users see contributions and approve documented repair spend | Unverified GoldHouse payment or card API |
| Service continuity escrow | DeBox customer notifications | Makes the failure-to-backup-provider flow visible and usable | Noma/Cortex hosted worker dependency without runnable access |

## Remaining identity and dependency notes

- [The Web3 GitHub](https://github.com/the-web3) links `@0xtheweb3`, documents technical solutions and education, and exposes contract/chain/project repositories. It is a plausible source of reviewers and developer pilots, not guaranteed free labor or an organizer-endorsed audit.
- [GoldHouse official site](https://www.goldhouse.cc/) describes a single account for social, payments, governance and apps. [App Store listing](https://apps.apple.com/la/app/goldhouse-social/id6772489278) confirms a shipping iPhone product and identifies its developer. Neither establishes a public developer SDK or Portaldot wallet support.
- [Noma GitHub](https://github.com/NomaNetwork) links noma.network and `@noma_network`; [NClaw](https://github.com/NomaNetwork/NClaw) has only README content in the inspected branch. Avoid confusing it with unrelated NClaw/NemoClaw projects found in search results.
- [Mintellect identity evidence](https://www.mexc.com/announcements/new-listings/airdrop-32) links mintellect.xyz and `@Mintellect_AI`; product claims concern content/code/model ownership and licensing. [Cortex identity mirror](https://www.sotwe.com/cortex_network_?lang=id) points to cortexnetwork.ai. These are identity discovery sources, not implementation docs.
- [RunePool](https://www.runepool.ai/) is an agent-capital/execution app according to its own downloaded frontend content; its JS links `@RunePoolBTC` and app.runepool.ai. Frontend implementation details are not a supported public API contract.
- [XPower](https://www.xpower.cc/) describes pooled participation and on-chain strategies. A marketing explanation does not demonstrate audited contracts, deployed composability, or loss protection; do not make any such promise in a proposal.
- [TronBank official Telegram](https://t.me/tronbankpro) describes TRON energy leasing and TRX staking. Any integration needs an actual TronBank API/ABI and supported environment; do not substitute another TRON energy service and label it a partner integration.

## Recommended selection rule

Use **one essential Portaldot component plus at most one or two supporting integrations** in the first demo. DeBox is the clearest product-access integration. Matrix is the strongest technical cross-chain candidate after resolving deployment/clock questions. Echobit is the easiest live external-data integration. Treat the other partners as possible early users, reviewers, or later adapters until an actual supported API and test environment are in hand.

The most useful organizer questions are: Is there a separate unpublished sponsor bounty sheet? Which partner engineers are offering technical support? Is Matrix's present testnet the intended environment and why is its block timestamp ahead? Does DeBox's current wallet accept the Portaldot EVM network? Are any Mintellect/Noma/Cortex/RunePool integration SDKs available to hackers? These are dependencies to resolve, not reasons to delay a self-contained Portaldot MVP.
