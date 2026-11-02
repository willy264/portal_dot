# Hosting MeterMend

The web app, refund worker and notification worker are independently restartable. SQLite and evidence bytes must survive restarts. Deployments and their proof files are part of the release; rebuild after recording a new verified deployment.

## Selected free Render deployment

On November 2 the owner authorized Render login and selected **the free version**, declining the proposed paid services. [`render-free.yaml`](../render-free.yaml) defines `metermend-preview`: a public read-only history API. It restores the reviewed public chain snapshot from `deployments/preview-chain.json`, verifies its SHA-256 and block/event consistency, and continues indexing without a signer. Existing cursors are preserved. The app can use its verified public origin from `deployments/hosting-status.json`.

The free preview is live at **https://metermend-preview.onrender.com**. Public `/health` and `/jobs` checks passed on November 2: read-only mode is enabled, no signer is present, indexing advanced beyond the snapshot, and the retained original failed job is visible. Evidence uploads return HTTP 503 as intended. [Public verification](../deployments/render-free-verification.json) records the exact deployed commit and responses.

This service is **not an always-on keeper or persistent evidence backend**. Render Free sleeps after 15 minutes without inbound traffic and loses filesystem changes on sleep, restart or redeploy; it cannot attach a persistent disk. Its wrapper forces read-only mode and disables evidence uploads. The retained snapshot survives as a repository artifact, but newly indexed records on the instance remain ephemeral. Local keeper and Telegram SQLite databases remain separate. No paid services or disks are authorized. [Render Free limitations](https://render.com/docs/free).

Before switching any actual keeper or Telegram sender, preserve its complete transaction/outbox journal on durable storage and stop the old sender. The free preview contains only public chain events and terminal jobs, and cannot replay notifications or submit a refund. Durable hosting remains an outstanding submission item under this cost constraint.

## Render persistent services

[`render.yaml`](../render.yaml) defines two Docker services in Frankfurt. The public `metermend-relayer` service runs the Cronpot keeper, event indexer and authenticated evidence backend; its 1GB disk stores `/data/cronpot.sqlite` and `/data/evidence`. The separate `metermend-telegram` worker reads the indexer over Render's private network and keeps its delivery outbox in `/data/debox.sqlite` on its own 1GB disk. Both use the smallest paid `0.5c-512mb` plan (512MB RAM, 0.5 CPU). Automatic deploys are off so a source push does not interrupt the live proof run.

Refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it. The blueprint fixes `MODE=keeper`. P5 rejected the signed native Scheduler origin with `BadOrigin`; native scheduling is not part of the delivered flow.

The explicit initial indexer start is block **271379**, MeterMend's finalized deployment. The [bootstrap evidence](../deployments/indexer-bootstrap.json) proves Cronpot had no earlier jobs, using `nextJobId=1` at finalized block 271384. Import the local retained SQLite database before starting the hosted worker so previously indexed events, job submissions and Telegram deliveries are not replayed. Existing cursors are never skipped or cleared. The blueprint allows 120 seconds for the observed slow typed RPC initialization.

This unselected paid alternative has an estimated base cost of **US$14.50/month**: $7 for the web service, $7 for the Telegram worker, and $0.25 per 1GB disk. It assumes the free Hobby workspace; workspace upgrades, excess usage and tax are additional. The owner selected the free plan, so this blueprint must not be provisioned under the current authorization. See [Render pricing](https://render.com/pricing), [compute plans](https://render.com/docs/compute-plans) and [persistent disks](https://render.com/docs/disks).

### Deploy after cost approval

1. Authenticate the Render CLI and select the intended workspace. CLI v2.34.0 stopped on OAuth `slow_down` before storing credentials in the first attempt. Its lost device grant cannot be recovered from the displayed user code. The local ignored helper `.tools/render-login.mjs` handles this server response and can resume its own saved grant; launch it only as a coordinated browser login. This is an account authentication issue, not a service deployment.
2. Commit a manifest containing both finalized contract addresses and their deployment blocks. Confirm the relayer account is funded and mapped. The image reads these records from `deployments/portaldot-v3.json`; do not point a running service at a pending deployment.
3. Validate `render.yaml`, connect `willy264/portal_dot` and create the Blueprint from the approved commit. Provide `RELAYER_SEED` only to `metermend-relayer`. Provide `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` only to `metermend-telegram`. These secret fields use `sync: false`; no credential belongs in YAML or public evidence. Creating the notification worker starts delivery of indexed real events, so confirm the intended Telegram group before this step.
4. Set the Vercel project's server-only `RELAYER_URL`, `CHAIN_INDEXER_URL` and `EVIDENCE_BACKEND_URL` to the relayer's actual public HTTPS origin. Securely copy the generated `EVIDENCE_BACKEND_TOKEN` from the relayer to Vercel. Redeploy the web app with these server-side settings. The bot constructs its private HTTP indexer URL at runtime from Render's `hostport` service reference.
5. Inspect the relayer's `/health` JSON: require `configured: true`, `mode: "keeper"`, a signer, no error and no history gap. HTTP 200 alone proves only that its API is running. Check `/jobs` and the public app's `/proof` page. If old deployment blocks were pruned before the indexer started, preserve/import a verified local SQLite backup or find a verified V3 archive endpoint; do not skip history and claim completeness.
6. Verify persistence before claiming hosting complete: record the indexed block, job IDs and an evidence file's hash; restart the relayer and confirm those records and evidence bytes survive. Restart the notification worker and verify its saved cursor/outbox prevents duplicate delivery. Save sanitized service IDs, actual URLs, deploy IDs, timestamps and before/after results in `deployments/hosting-status.json`.

Render disks preserve only files below the mount path. Each disk is attached to one service instance, and disk-backed services have brief downtime during deploys. Keep one relayer instance and one notification worker to avoid competing SQLite writers. Back up SQLite with its backup API (or stop the service before copying the database and WAL files), and back up evidence bytes. Render's daily disk snapshots supplement these backups. Follow the [Blueprint reference](https://render.com/docs/blueprint-spec) and [disk limitations](https://render.com/docs/disks).

## Alternative: one persistent Docker host

1. Install Docker with Compose on a host you control.
2. Clone this repository and configure the ignored `.env`. Keep only testnet seeds in this project.
3. Generate a random `EVIDENCE_BACKEND_TOKEN` and set `APP_URL` to the public HTTPS URL.
4. Run `docker compose up -d --build`. The web app listens on port 3000; the worker API on port 8787. Put the web app behind an HTTPS reverse proxy. Restrict direct access to the worker port as appropriate for your hosting environment.
5. Check `/health` on the worker API, then `/proof` and the wallet flow on a phone. Back up both Docker volumes.

Compose supplies each service only the credentials it needs. It does not put deployer, renter or arbiter seeds in the web container. Never copy an `.env` into a container image or public hosting environment variable prefix.

## Vercel web with a persistent worker host

The connected Vercel project is `willy264s-projects/metermend`, with root directory `apps/web`, framework Next.js, Node 22, build command `pnpm build`, and the default `.next` output directory. Include workspace sources outside the root directory. Run Vercel CLI from the repository root so it uploads the shared packages and committed deployment records. Configure public network endpoints and the server-only `RELAYER_URL`, `CHAIN_INDEXER_URL`, `EVIDENCE_BACKEND_URL` and `EVIDENCE_BACKEND_TOKEN`. Deploy the relayer and bot from this Dockerfile on a persistent host, overriding the command as in Compose and mounting `/data`.

Vercel must proxy evidence to the persistent backend. A local `/public/evidence` directory or writable serverless `/tmp` is not a durable substitute. Browser bundles receive only the public configuration allowlist; the backend token and signing seeds are never public.

## Current external requirements

The web app is published at https://metermend.vercel.app/ and the permanent report at https://willy264.github.io/portal_dot/. Render authentication succeeded and the free preview configuration passed workspace validation. Its actual provisioning and health checks are recorded in `deployments/hosting-status.json`. Local Telegram has acknowledged actual registration, rental and return messages; remaining event types and group screenshots are pending. DeBox is the target integration and is not live. Durable worker/evidence hosting remains outstanding.
