# Chain operations and rehearsal

Run from the repository root with Node 22 and the pinned pnpm version. Secrets belong in ignored `.env`; these scripts only print public addresses and transaction evidence. Every command verifies the Portaldot V3 testnet identity before proceeding. Native balances have 14 decimals; EVM contract amounts have 18. Amount arguments are tPOT decimals and reject excess precision.

## Web launcher

`node scripts/web.mjs dev` and `node scripts/web.mjs start` run Next from `apps/web` while reading the allowlisted web settings in the root `.env`. Additional arguments such as `--port 3100` are forwarded unchanged. Host settings take precedence. `APP_URL` supplies `PUBLIC_APP_URL` when the latter is absent, and relative evidence/deployment paths are resolved from the repository root. The child receives only the web configuration and required operating-system settings: signer seeds, bot credentials, arbitrary host tokens and `NODE_OPTIONS` are excluded. The evidence backend token remains server-only and is intentionally available to the web proxy.

## Deployment sequence

```sh
pnpm tsx scripts/accounts.ts
pnpm tsx scripts/budget.ts
pnpm tsx scripts/funded-probe.ts --execute
pnpm run deploy
pnpm tsx scripts/fund-accounts.ts --amount 30 --roles renter,arbiter,relayer
pnpm run seed
# Start the configured relayer in another terminal, then:
pnpm run demo
```

`accounts.ts` preserves existing project seeds. Review the printed public addresses before requesting faucet funding. The funded probe deploys Ping once, proves actual value conversion, attempts the signed scheduler operation once and stores 1 KiB through TransactionStorage. Its existing confirmed stages are reused on restart.

The completed probe is recorded in `deployments/funded-probe.json`: P4 passed, P5 returned finalized `BadOrigin`, and P6 passed. The operational mode is therefore **keeper**. A successful native Ping call does not imply permission to use Scheduler.

`deploy.ts` deploys Cronpot and MeterMend in that order, persisting each real address, transaction hash, block and decoded events immediately. It checks the current artifact hashes against `deployments/budget.json` and requires the combined remaining storage estimate plus 20% and a retained balance before starting. Each individual transaction also receives a fresh simulation and fee check. `--cron-tip 0.001` and `--keep 25` are the defaults. The budget file is an estimate; fees and further contract storage for item registration and rentals require additional funds.

`fund-accounts.ts` tops up the known project roles to an explicit target balance. It never accepts arbitrary recipient addresses. `--keep 25` retains that many tPOT in the deployer. Repeating a completed target does not pay it twice. For a deliberately new top-up after a role has spent funds, supply a distinct `--attempt` label. Choose funding targets using the current simulations; the command's example is not a guarantee that 30 tPOT covers every future operation.

`seed.ts` registers the camera, printer and drill with 20% maintenance reserves and 120-second demo dispute windows. Their metadata is a self-contained JSON data URI. Their records describe demonstration equipment and do not attest that a physical rental occurred.

## Durable recovery

Deployment, funding, probes, seeding and the demo each have a JSON transaction journal and an exclusive process lock. A transaction hash is synchronously flushed from the SDK status callback before the callback returns. Confirmed intent keys are never submitted again. A missing deployment manifest is restored from confirmed journal evidence before a new deployment budget is assessed.

When an interrupted transaction has a hash, restart performs read-only reconciliation against finalized native blocks. An unknown outcome blocks a replacement write, including when `--retry-failed` is supplied. Missing hashes or history outside the conservative recovery window require inspecting account history and recovering authoritative evidence. Do not delete journals to bypass this protection.

Only a known failed operation can be retried with `--retry-failed`; its previous attempt remains preserved. Correct the reported cause first. Changing a recorded intent, signer or evidence image is rejected. Resume with the same inputs. A failed dispute submission after its 120-second window cannot reverse an already finalized refund; retain its records and prepare a separately recorded rehearsal.

## Image evidence and the live demo

`demo.ts` requires both real deployments, verified P4 units, seeded items and a healthy relayer using the configured `RELAYER_SEED`. It performs two rentals, waits for an actual Cronpot refund from that relayer, opens a 30% dispute, records arbiter approval, pays an approved repair from the item reserve and withdraws operator income. Each transaction and assertion is appended to `deployments/demo-run.json`. The automatic-refund assertion matches `DepositRefunded` and a successful `JobExecuted` in the same real transaction and checks the executor identity. The script does not manually execute that step.

The default PNG files in `scripts/fixtures/` explicitly say **DEMO FIXTURE** and **Not evidence of an actual physical rental or repair**. They exercise image hashing, storage and the approval workflow while the report proves actual testnet transactions only. `provenance.json` records their local SVG source, exact byte length and SHA256. Regenerate them with `node scripts/make-demo-fixtures.mjs`; this uses the installed Next.js Sharp dependency. It does not generate photographic evidence.

Supply your own final compressed images to exercise a physical workflow:

```sh
pnpm run demo --return-photo ./photos/returned-camera.jpg --dispute-photo ./photos/damage.jpg --repair-receipt ./photos/receipt.png
```

Each file must be PNG, JPEG or WebP and at most 64 KiB. The SHA256 commitment covers those exact bytes. The script retains a local application backup, uploads to the configured evidence backend when its token is present, and, after verified P6, submits those same bytes to native TransactionStorage. It records native transaction/block/index separately from the application SHA256: the runtime storage content hash is a different commitment and must not be substituted for the contract evidence hash. Native retention is finite; preserve the application backup and proof artifacts.

Configure `EVIDENCE_BACKEND_URL` and `EVIDENCE_BACKEND_TOKEN` when the relayer runs remotely. Local evidence is written under `data/evidence/`, matching the repository's default persistent evidence directory. `--wait-seconds 420` is the default automatic-refund timeout; restarting keeps prior transactions. Real images are operator-supplied claims, not automatically verified physical facts.

## Local checks

```sh
pnpm exec tsc -p scripts/tsconfig.json --noEmit
pnpm exec vitest run scripts/*.test.*
```

Journal tests cover durable hashes, successful recovery, finalized failure, explicit retries, changed intents and refusal to resubmit ambiguous writes. Launcher tests cover environment isolation, path handling and argument forwarding, including a real child-process check that signer and bot secrets are absent. These tests do not substitute for the live transaction evidence.
