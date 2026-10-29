# Hosting MeterMend

The web app, refund worker and notification worker are independently restartable. SQLite and evidence bytes must survive restarts. Deployments and their proof files are part of the release; rebuild after recording a new verified deployment.

## One persistent host

1. Install Docker with Compose on a host you control.
2. Clone this repository and configure the ignored `.env`. Keep only testnet seeds in this project.
3. Generate a random `EVIDENCE_BACKEND_TOKEN` and set `APP_URL` to the public HTTPS URL.
4. Run `docker compose up -d --build`. The web app listens on port 3000; the worker API on port 8787. Put the web app behind an HTTPS reverse proxy. Restrict direct access to the worker port as appropriate for your hosting environment.
5. Check `/health` on the worker API, then `/proof` and the wallet flow on a phone. Back up both Docker volumes.

Compose supplies each service only the credentials it needs. It does not put deployer, renter or arbiter seeds in the web container. Never copy an `.env` into a container image or public hosting environment variable prefix.

## Vercel web with a persistent worker host

The connected Vercel project is `willy264s-projects/metermend`, with root directory `apps/web`, framework Next.js, Node 22, build command `pnpm build`, and the default `.next` output directory. Include workspace sources outside the root directory. Run Vercel CLI from the repository root so it uploads the shared packages and committed deployment records. Configure public network endpoints and the server-only `RELAYER_URL`, `CHAIN_INDEXER_URL`, `EVIDENCE_BACKEND_URL` and `EVIDENCE_BACKEND_TOKEN`. Deploy the relayer and bot from this Dockerfile on a persistent host, overriding the command as in Compose and mounting `/data`.

Vercel must proxy evidence to the persistent backend. A local `/public/evidence` directory or writable serverless `/tmp` is not a durable substitute. Browser bundles receive only the public configuration allowlist; the backend token and signing seeds are never public.

## Native scheduler mode

`MODE=native` alone does not establish permission or adequate execution weight. The deployment manifest must include a successful funded P5 probe and a proven Cronpot execution budget tied to the runtime code hash. Otherwise the relayer selects keeper mode. Preserve the actual Scheduler task/block evidence when enabled.

## Current external requirements

The web app is published at https://metermend.vercel.app/ and the permanent report at https://willy264.github.io/portal_dot/. The persistent refund worker and evidence backend still require a host; local execution can support a supervised demonstration. Live notifications require a DeBox App Key/group or Telegram token/chat. The software reports these missing states rather than claiming delivery or evidence persistence.
