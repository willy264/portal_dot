# Community notifications

Run `pnpm --filter @metermend/debox-bot start` from the repository root. Configure `DEBOX_API_KEY` and `DEBOX_GROUP_ID` in the ignored `.env`; alternatively configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. With neither, the service reports `unconfigured` and never claims delivery.

The bot reads complete event pages from `CHAIN_INDEXER_URL` or `RELAYER_URL`. It persists its own history, item reserve state, processed cursor and bounded outbox in SQLite. Message derivation and cursor advancement are atomic. A restart/replay does not duplicate ordinary deliveries. An accepted provider request whose HTTP response is lost may be retried; delivery is at-least-once, not exactly-once.

DeBox requests use the documented `chat_id`, `chat_type`, `content`, `parse_mode` fields and server-only `X-API-KEY`. Both response success flags are required. Attempts, including failures, obey one/second and five/rolling-minute limits. Backoff respects `Retry-After`; ingestion outages do not block delivery of already queued messages. The1000-message queue pauses ingestion when full.

`GET /health` reports configuration, cursor, queued count and the last error. Set `BOT_DB_PATH` to a persistent SQLite path, `APP_URL` to the web app, and `BOT_PORT` (default8788). `EVM_DECIMALS` must match the observed runtime/probe value18. No bot key belongs in a browser or deployment evidence.

Sources: [DeBox OpenAPI](https://docs.debox.pro/en/ApiOnePage/), [Telegram Bot API](https://core.telegram.org/bots/api#sendmessage). Live community delivery remains pending until credentials and a target group/chat are configured.
