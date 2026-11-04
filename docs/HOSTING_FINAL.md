# Free corrected-Cronpot keeper

Prepared November 4, 2026, within the **08:13–09:13 WAT** hosting timebox. Paid Render hosting was declined. No paid worker or disk has been created. The selected workflow is GitHub Actions every ten minutes, with a local keeper for the recording. Configuration alone is not evidence that a scheduled run has succeeded: see [the hosting record](../deployments/corrected-keeper-hosting-plan.json) for observed status.

## GitHub Actions

The [keeper workflow](../.github/workflows/keeper.yml) runs on the public `willy264/portal_dot` repository's `main` branch. It uses Node 22.23.4, pnpm 10.34.9 and the frozen lockfile. Its command is:

```sh
node --import tsx scripts/automatic-refund.ts --keeper-only --once --timeout-ms=120000
```

Store only the dedicated keeper account's testnet seed as repository secret **`KEEPER_SEED`**; the workflow maps it to `RELAYER_SEED`. Do not supply the deployer seed. Keep the keeper balance small. The committed `deployments/corrected-cronpot.json` identifies the corrected Cronpot. The worker executes eligible jobs already registered on that contract, then checks ordinary returned rentals for a direct permissionless refund fallback. It journals both types of transaction and does not depend on indexer catch-up.

The existing MeterMend still schedules its built-in job on the original Cronpot. For an ordinary rental in `Returned` state with a held deposit, an elapsed refund window at finality, and no active corrected-Cronpot job, the free keeper can call `MeterMend.finalizeRefund(rentalId)` directly. It records this separately as `permissionless-direct-fallback`, including the rental ID, transaction hash and block. This fallback does not require executing the original failed callback first and is not proof of a corrected-Cronpot execution.

The separately recorded corrected-Cronpot demonstration follows its explicit original-failure proof requirement and must produce `JobExecuted(success=true)` plus `DepositRefunded` from the corrected execution. Direct fallback is disabled when `--record-proof` is used. No new Cronpot job is automatically registered for an ordinary web-app return.

Enable it only after stopping another process signing with the same keeper key and reconciling every earlier keeper hash against inclusion/finality, `system.account.nonce`, `account_nextIndex` and the pending pool. The first workflow run must be manually dispatched with **`bootstrap=true`**, after that check. Later manual runs use the default `false`. Dispatch the initial run immediately after pushing the workflow, before its first scheduled trigger. An accidental first scheduled run safely stops; do not bypass the missing-state guard to make it run.

The schedule is `*/10 * * * *`. GitHub can delay or drop scheduled runs, so this gives periodic attempts and does not guarantee a refund within ten minutes. Scheduled workflows operate on the default branch and can be disabled after 60 days without repository activity. Standard GitHub-hosted runners are free for public repositories. See [GitHub's schedule behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) and [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

## Journal persistence and failure recovery

One concurrency group prevents overlapping workflow signers; in-progress runs are not cancelled. Every run restores the **immediately previous run's latest attempt**, including a failed run. A rerun restores the immediately previous attempt of the same run, and rerunning an older run after a newer run exists is refused to prevent journal rollback. Prefer a fresh manual dispatch. The artifact name is `corrected-keeper-journal-{runId}-{runAttempt}` and contains only these public, non-secret records:

- `corrected-keeper-journal.json`: intentions, original hashes/nonces, confirmed and unknown attempts.
- `automatic-refund-status.json`: job observations, Cronpot execution evidence and separate `directRefunds` records.
- `preflight.json`: checks made before execution.
- `workflow-state.json`: the source run, attempt and artifact used for restoration.

The workflow uploads the state even if dependency installation or the keeper fails after a successful restore. Artifacts request **three-day retention** with maximum ZIP compression to limit storage use; each new artifact carries the complete journal forward. Artifact storage consumes the account's shared allowance even though public standard-runner compute is free. Keep paid Actions overage disabled and archive submission evidence in `deployments/`. Missing, expired, ambiguous, malformed or failed downloads stop signing; the workflow never falls back to an older artifact or silently empties a journal. Unknown entries remain intact for on-chain reconciliation. Downloaded state is validated in a separate directory before being copied into `DATA_DIR`; lock files and secrets are excluded.

If a previous run has no usable artifact, stop automation and recover that run's original journal before trying again. Inspect its logs and all recorded hashes, current account nonce and pending pool. A missing artifact is not evidence that a transaction failed. The initial `bootstrap` option is deliberately unavailable after the first run. A hard runner shutdown can prevent artifact upload; this free workflow is not a persistent disk.

Each run writes separate summary tables for corrected Cronpot jobs and direct refunds. Both include hashes and blocks; direct refunds are identified by rental ID and are never counted as Cronpot job executions. Review the worker's status and chain evidence before calling any transaction finalized. Keep durable copies of the artifacts required for submission before their retention expires. [GitHub artifact API](https://docs.github.com/en/rest/actions/artifacts) describes download and expiry behavior.

## One-command local recording keeper

From the repository root in PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-recording-keeper.ps1
```

The wrapper uses Node 22, the ignored `.env` or process environment for `RELAYER_SEED` / `KEEPER_SEED`, and `data/corrected-keeper/` for the journal. Use `-Check` to validate prerequisites without starting it, `-Once` for one eligible-job scan, or `-DataDirectory 'D:\MeterMend\keeper'` for another persistent location. Keep the computer awake and connected during recording. This is supervised local execution.

Never run local and Actions keepers with the same seed simultaneously. When moving an account between them, preserve its journal and reconcile all outstanding attempts first; the Actions first-run bootstrap must not erase a local pending transaction. Do not delete the local journal to retry an uncertain call.

## Public services and limitations

The app remains on [Vercel](https://metermend.vercel.app/). The existing [Render preview](https://metermend-preview.onrender.com) stays free and read-only. GitHub Actions does not provide a public evidence-upload service or persistent SQLite/filesystem hosting; the original always-on evidence-service requirement remains outstanding.

The indexer can lag current finality; the corrected keeper reads Cronpot jobs directly, and indexer catch-up is outside this final-push scope.
