# MeterMend implementation decisions

Date: October 27, 2026. Facts below distinguish observed read-only results from funded probes that have not run. The authoritative requirements and amendments are in [SPEC.md](../SPEC.md).

## Phase 0

| Probe | Status | Evidence / decision |
|---|---|---|
| P1 V3 identity | Read-only verified | Supplied V3 endpoints respond with runtime spec3002 and EVM chain420420777. Correct hex is0x190f1ca9; original0x190F1B29 represented420420393. Reproducible script evidence is being collected in deployments/probe.json. |
| P2 pallets | Metadata inspected | Revive and Scheduler exist. Presence does not establish the signed origin's permission to schedule. Final metadata summary will be emitted by probe.ts. |
| P3 bytecode | Pending dry-run | Do not select EVM/PVM from marketing or implement product contracts until the probe records format acceptance. |
| P4 units | Constant observed; funded verification pending | NativeToEthRatio=10000, native tPOT decimals14; implies EVM decimals18. Exact conversions must reject non-divisible amounts. Runtime extrinsic value denomination will be checked against metadata and a funded movement. |
| P5 scheduler | Unverified funded stage | No successful Scheduler.Dispatched evidence yet. Keeper is the safe default, not proof that native mode is unavailable. |
| P6 evidence bytes | Metadata/write checks pending | Hash-only application storage is the default until practical native limits and a store call are verified. |
| P7 raw EOA | Optional; not run | Default all writes remain Substrate-signed. |

The old mainnet endpoint is deliberately excluded from implementation/deployment. No seeds, credentials or signer private material belong in evidence files.

## Exact toolchain

Requested package lines were checked against the npm registry. Pins: Node22.23.4; pnpm10.34.9; TypeScript5.9.3; solc0.8.30; PAPI3.3.0; substrate-bindings0.21.2; viem2.57.12; RxJS7.8.2; tsx4.23.15; Vitest5.0.5. Foundry1.8.6 (commit6bad0a66de7c83f7b33695044138f0f5fa4c5990) is the current stable release fetched from the official repository. Node22 is installed in an ignored project-local tools directory because the machine default Node25 falls outside the selected Vitest engine range.

PAPI3 migration is material: imports use `polkadot-api/ws`; extension accounts supply `txCreator`; transactions use `createSubmitAndWatch`. Exact Revive types come from generated metadata. Sources: [PAPI3 migration](https://papi.how/v3migration/), [extension API](https://papi.how/signers/extensions/).

## Contract review corrections

Before implementation, SPEC amendments6–9 add unsettled-rental transfer protection, distinct voter roles, bounded tip conversion, deferred executor tips and explicit wide arithmetic/zero-refund behavior. These preserve the specified rental/refund/reserve model while closing concrete callback and role-transition failures. Original Cronpot cancellation already had a reentrancy modifier; retaining it is a transcription clarification rather than a newly discovered original-code defect.

Cancelled Cronpot tips received by MeterMend remain unallocated surplus/dust, as explicitly requested. They are not operator income or item reserve. No new dispute timeout is introduced: a missing human vote can leave funds disputed. Checked push refunds can fail for a renter contract that refuses payment; the liability remains intact, and permissionless finalization does not bypass recipient refusal.

## Evidence and durability

Hash the final stored image bytes after compression. Native transaction storage, if enabled, is expiring storage and must retain an app-side availability strategy. Application disk/SQLite must live on persistent storage; a Vercel function's ephemeral disk is not a production persistence mechanism.

## Notifications

DeBox ordinary-bot rate limits can be stricter than1message/second: the documented ordinary quota is5messages per rolling minute. The outbox must satisfy both, respect Retry-After/business errors, and never label unconfigured delivery successful. Exact body fields: chat_id, chat_type, content, parse_mode. Source: [DeBox API](https://docs.debox.pro/en/ApiOnePage/).

## Git workflow

Commit and push each completed verified feature separately, as requested. Root commits only the intended files; unfinished concurrent features remain unstaged. Preserve factual deployment timestamps and real progress history.
