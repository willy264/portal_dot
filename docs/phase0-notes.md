# Phase 0 — observed V3 facts

The reproducible read-only entrypoint is `scripts/probe.ts`; the full result is `deployments/probe.json`. It never imports a signer or broadcasts. Run with Node 22 and `PROBE_SS58` set to a public, funded, mapped account for constructor simulation. A public origin does not imply possession of its key. The successful run used the user's publicly supplied registered address, not a locally controlled account.

| Check | Result | Evidence and boundary |
| --- | --- | --- |
| P1 | Passed | `portaldot-v3`, spec 3002, transaction version 2; system `PortaldotV3 Test`, node `3.0.0-dev-fddd43141f2`; EVM chain ID **420420777 / 0x190f1ca9**. The initially supplied `0x190F1B29` encodes 420420393 and is incorrect. |
| P2 | Passed | Generated PAPI 3.3.0 descriptors from live metadata v16; Revive, Scheduler, TransactionStorage, Multisig, Proxy, Identity and Utility all present. Metadata proves interface availability, not Signed-origin permission. |
| P3 | Passed, dry-run only | `ReviveApi.instantiate_versioned(V1)` accepted solc 0.8.30 Prague EVM bytecode (291 bytes), success true and flags 0. No contract was deployed. PVM/resolc fallback was unnecessary. |
| P4 | Partial | Native 14 decimals; `NativeToEthRatio = 10000`; EVM amounts have 18 decimals. Address derived with `ReviveApi.address`. Actual funded value movement remains pending. |
| P5 | Not run | Scheduler present; native scheduling and executor rewards remain unverified. Keeper mode is the selected fallback until a funded schedule is dispatched successfully and emits the Ping event. |
| P6 | Partial | MaxTransactionSize 8,388,608 bytes; MaxBlockTransactions 512; ByteFee 10 native units; EntryFee 1000; RetentionPeriod 100800 blocks. A signed 1 KiB store and any thumbnail upload remain unverified. App remains hash-only until verified. |
| P7 | Not run | No EOA transaction; MetaMask writes remain disabled. Default writes use Substrate signatures. |

Verified endpoints: `wss://test-node-v3.portaldot.dev` and `https://test-evm-rpc-v3.portaldot.dev`. Genesis `0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd`; runtime `:code` hash `0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2`. No legacy mainnet endpoint is used for the build.

## Metadata details that affect implementation

- **Automatic mapping is enabled.** `Revive.AutoMap = true`. Metadata explicitly documents that `map_account` and `unmap_account` are disabled in this mode. `ensureMapped` therefore checks `Revive.OriginalAccount`, returns for an existing mapping, and asks an unfunded account to receive native funds and wait for finality. It does not issue a disabled mapping call.
- Native signed `Revive.call` uses `dest`, **`value` in native units**, **`weight_limit`**, mandatory scalar `storage_deposit_limit`, and `data`. Its names differ from the simulation API, which uses optional `gas_limit`, optional `storage_deposit_limit`, and `input_data`.
- Runtime simulations return `weight_required` and `max_storage_deposit`, not the older `gas_required`. Generated PAPI types unwrap the one-field V1 wrapper: the contract result is `simulation.value`, not `simulation.value.contract_result`.
- The shared API accepts app payment values in EVM units, requires exact divisibility by 10000, and supplies native units to both runtime simulation and signed Revive extrinsics. It rounds estimated weight and storage deposit upward by 20%. Dust is rejected rather than silently truncated.
- `Revive.AllowEVMBytecode = true`; the successful P3 simulation independently verifies the selected compiler path.
- EVM constructor arguments must be appended to creation bytecode, leaving the native `data` field empty. A real MeterMend dry-run returned `EvmConstructorNonEmptyData` when arguments were supplied separately. The shared deploy helper now concatenates `code + ctorData`; the corrected constructor passed.
- `DepositPerByte = 6000000000000` native units (**0.06 tPOT/byte**); `DepositPerItem = 0.15 tPOT`; `DepositPerChildTrieItem = 0.0015 tPOT`. The tiny Ping constructor simulated a **33.624 tPOT** storage charge. Product deployments require their own simulation before deciding funding amounts.
- Public Alice's dry-run failed `StorageDepositNotEnoughFunds` for both Prague and Cancun. This was a funding failure, not evidence of unsupported bytecode. Retrying with the funded registered public origin succeeded. No Alice key was imported or used.
- `Scheduler.MaximumWeight` and `MaxScheduledPerBlock = 50` are visible; `ScheduleOrigin` is not established by metadata. A pre-deadline `TooEarly` revert cannot estimate a scheduled job's later execution cost. `scheduleCronpot` requires explicit finalized P5 proof, matching runtime code hash and a separately proven Cronpot execution budget through `configureNativeScheduler`. Without that configuration it returns a capability error, selecting keeper execution. The implemented native path uses priority 127 and a signed `schedule_after` wrapping the generated Revive call.
- TransactionStorage fees and retention are storage entries, not constants in this runtime. Their current values are recorded with the finalized snapshot. A maximum size does not establish authorization, affordability, availability of historical blobs, or permanent retention.

## Shared package boundaries

`@metermend/chain/client`, `/revive`, `/units`, `/abi`, and the root entrypoint are browser-safe. Node seed handling is isolated under `/node`. `getApi` and `getClient` expose the generated typed API for native event indexing. `readContract` falls back to native Revive simulation if EVM reads fail. `getLogs` scans native `Revive.ContractEmitted` first, because the EVM facade may silently omit Substrate-origin calls; an EVM retrieval fallback is also available. Native events emitted during block initialization correctly carry `txHash: null`.

`scripts/budget.ts` simulated the actual compiled product constructors with a public mapped account selected solely for its sufficient balance. `deployments/budget.json` records **383.4735 tPOT** for Cronpot, **774.5265 tPOT** for MeterMend, and **29.49 tPOT** for Ping: **1187.49 tPOT** total storage deposits, excluding fees, subsequent storage and demo balances. These are independent read-only simulations, not contract deployments. The MeterMend simulation uses an illustrative nonzero Cronpot constructor address; real deployment must simulate again with the deployed address.

Writes use PAPI 3.3.0 `txCreator` and `createSubmitAndWatch`, one subscription and no automatic retry. Finalized inclusion is required. The synchronous `onStatus` callback lets services persist a created transaction hash immediately. A timeout/disconnect after creation throws `SubmissionUnknownError` with `ambiguous = true` and the hash; callers must reconcile it before retrying. A known finalized dispatch failure is distinct from uncertain inclusion.

The committed `.papi/metadata/portaldot.scale` and `.papi/descriptors/dist` files permit CI builds without a live metadata fetch. `metadata:update` is an explicit maintenance action, not part of CI or ordinary application startup.

## Validation

Read-only probe completed successfully with P1–P3 passed and remaining funded stages labeled honestly. Shared chain TypeScript check passes. Four unit tests cover native/EVM one-token equivalence, large-amount precision, dust/negative-value rejection and upward estimation margin. These checks do not substitute for funded deployment, value movement, native scheduling, or TransactionStorage write tests.

Primary API references: [PAPI code generation](https://papi.how/codegen/), [PAPI typed runtime APIs](https://papi.how/typed/apis/), [upstream Revive runtime API](https://paritytech.github.io/polkadot-sdk/master/pallet_revive/trait.ReviveApi.html). Live metadata and simulation output, rather than upstream defaults, determine the implementation above.
