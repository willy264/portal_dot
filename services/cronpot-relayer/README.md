# Cronpot relayer

Run from the repository root with `pnpm --filter @metermend/cronpot-relayer start`. It loads the ignored root `.env` and the deployment manifest. `RELAYER_SEED` controls only the funded testnet worker; the scanner can run without a signing account.

The worker indexes finalized native events, including scheduler initialization events with no extrinsic hash. SQLite stores each complete block and cursor atomically. A pruned block reports a history gap and stops cursor advancement. Only jobs owned by MeterMend, targeting MeterMend's `finalizeRefund`, receive this relayer's subsidy; the on-chain Cronpot registry remains generic.

`MODE=native` needs a verified capability in the manifest: P5 transaction/block proof, matching runtime code hash and a separately measured successful execution weight. Otherwise keeper mode executes due jobs after a30-second grace period. Timing uses finalized chain time. Never use a pre-deadline `TooEarly` simulation as the execution budget.

Submission hashes are saved with the job ID and operation. Restarted `executing`, `scheduling`, `execution-unknown` and `native-unknown` jobs pause until reconciliation; they are never blindly broadcast again. Confirmed terminal contract state may settle them. Known failures back off and stop after five attempts in `manual-review`. To recover an uncertain submission, inspect its recorded hash/task and finalized chain evidence before changing its persisted scheduling state. A user may always call MeterMend's time-gated finalization directly.

Endpoints: `/health`, `/jobs`, `/events`. `/events?fromBlock=N` returns complete pages of at most50 blocks, with `throughBlock` and `throughHash`; no query returns the stored workshop history. Automated refund totals require an actual successful Cronpot execution and matching refund event in the same transaction context, not merely a refund event.

The authenticated `/api/evidence` backend stores content-addressed JPEG/PNG/WebP files on persistent disk. Set `EVIDENCE_BACKEND_TOKEN`, `EVIDENCE_DIR` and optionally `EVIDENCE_STORAGE_LIMIT_BYTES` (default250MiB). Each file is limited to5MiB and checked on upload and read.

Environment: `RELAYER_SEED`, `WSS_URL`, `EVM_RPC_URL`, `CRONPOT_ADDRESS`, `METERMEND_ADDRESS`, `START_BLOCK`, `MODE`, `DB_PATH`, `PORT` (8787), and evidence settings. Addresses/start block normally come from the manifest. Do not start at a later block simply to hide an ingestion gap.
