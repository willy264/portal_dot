# Community notifications

Run `pnpm --filter @metermend/debox-bot start` from the repository root. Configure `DEBOX_API_KEY` and `DEBOX_GROUP_ID` in the ignored `.env`; alternatively configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. With neither, the service reports `unconfigured` and never claims delivery.

The bot reads complete event pages from `CHAIN_INDEXER_URL` or `RELAYER_URL`. It persists its own history, item reserve state, processed cursor and bounded outbox in SQLite. Message derivation and cursor advancement are atomic. A restart/replay does not duplicate ordinary deliveries. An accepted provider request whose HTTP response is lost, or whose acknowledgement cannot be saved locally, may be retried; delivery is at-least-once, not exactly-once.

Telegram is the selected delivery channel for the submission. Keep the DeBox fields empty when selecting Telegram; DeBox remains the target integration. Telegram delivery requires `ok: true`, a positive integer `result.message_id` and a valid `result.date`. The bot retains only the provider, message ID, provider send time and local acknowledgement time. An incomplete or zero-ID response is treated as ambiguous rather than delivered. DeBox preserves its existing two-success-flag check and records acknowledgement-only proof without inventing a provider message ID.

For the supervised local rehearsal, start the keeper/indexer first and confirm its `/health` and `/events` responses contain the actual deployments. Then use the following PowerShell command from the repository root. The bot loads Telegram credentials from the ignored `.env`; the explicit process settings ensure messages link to the public app and use the local indexer. Starting this process can deliver actual queued messages, so run it only when ready to record the real event notifications.

```powershell
$env:APP_URL = 'https://metermend.vercel.app'
$env:CHAIN_INDEXER_URL = 'http://localhost:8787'
$env:BOT_DB_PATH = Join-Path (Get-Location) 'data/debox.sqlite'
$env:BOT_PORT = '8788'
& .\.tools\node-v22.23.4-win-x64\node.exe node_modules/tsx/dist/cli.mjs services/debox-bot/src/index.ts
```

Read `http://localhost:8788/health` and `/deliveries` from a separate terminal. Keep the SQLite path unchanged across restarts so the sent-state/outbox proof survives. This supervised local process does not establish always-on public hosting.

After a provider acknowledges delivery, the outbox's sent state and a `notification-delivered` observation are committed in one SQLite transaction. The observation links the receipt to the actual indexed event ID/name, transaction hash, block/hash, item/rental IDs and application link where available. Existing queued records without provenance remain usable, but missing event details are not guessed. Provider response bodies, message content, API credentials and private chat identifiers are excluded from public proof.

DeBox requests use the documented `chat_id`, `chat_type`, `content`, `parse_mode` fields and server-only `X-API-KEY`. Both response success flags are required. Attempts, including failures, obey one/second and five/rolling-minute limits. Backoff respects `Retry-After`; ingestion outages do not block delivery of already queued messages. The1000-message queue pauses ingestion when full.

`GET /health` reports configuration, cursor, queued count and the last error. `GET /deliveries?after=0&limit=100` exports persisted delivery observations; follow `nextAfter` while `hasMore` is true. `limit` is bounded to 1–500. The endpoint reads SQLite only and neither sends nor retries messages. It projects an explicit field allowlist and removes query/fragment data from application links. Corrupt retained proof returns HTTP 503 instead of a delivery claim. Save the fetched actual results in `deployments/notification-status.json` and match screenshots to the provider message IDs and chain event receipts; an empty response does not prove delivery.

Set `BOT_DB_PATH` to a persistent SQLite path, `APP_URL` to the public web app, and `BOT_PORT` (default8788). The host must explicitly expose/proxy the bot's read-only endpoints if remote proof collection is needed. `EVM_DECIMALS` must match the observed runtime/probe value18. No bot key belongs in a browser or deployment evidence.

Sources: [DeBox OpenAPI](https://docs.debox.pro/en/ApiOnePage/), [Telegram sendMessage](https://core.telegram.org/bots/api#sendmessage), [Telegram Message fields](https://core.telegram.org/bots/api#message). Configured credentials and a running process do not establish delivery; actual acknowledgements and matching group screenshots do. Provider receipt tests use mocked responses and make no live delivery claim.
