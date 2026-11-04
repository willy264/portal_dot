# Live notification and phone evidence

The [public demo image copies](demo/README.md) contain the generated, labeled return/dispute/repair fixtures and their SHA-256 hashes. They are distinct from the genuine Telegram and phone captures requested below.

**Status: screenshots are pending.** This directory is a collection guide, not proof of completed delivery or a completed phone rental. Provider tests use mocked responses and must never be presented as live Telegram messages.

After the actual live golden path sends notifications, capture the messages in the configured Telegram group for:

| Required message | Chain event to match |
| ---------------- | -------------------- |
| Rented           | `Rented`             |
| Returned         | `Returned`           |
| Refunded         | `DepositRefunded`    |
| Dispute opened   | `DisputeOpened`      |
| Dispute resolved | `DisputeResolved`    |
| Repair paid      | `RepairPaid`         |

Save shareable captures under `docs/evidence/telegram/`. Include the visible message timestamp and enough item/rental text to match the live run. Retain uncropped originals privately. Redact unrelated conversations, personal contact details and private group identifiers before committing public screenshots; never include bot tokens or wallet recovery material.

The bot's read-only `GET /deliveries?after=0&limit=100` endpoint exports persisted acknowledgements. Follow `nextAfter` while `hasMore` is true. Save the actual pages and retrieval timestamp in `deployments/notification-status.json`, linking each captured message to its provider `messageId`, `providerSentAt`, indexed event ID/name, transaction hash and block. The endpoint excludes provider response bodies, message content, chat identifiers and credentials.

A Telegram receipt requires `ok: true`, a positive message ID and a valid provider send date. It proves the provider acknowledged that message; retain the matching group screenshot as the requested visual delivery evidence. A configured token, a queued message, an availability message, an empty receipt list or a mocked API response does not complete the six-message requirement. DeBox remains the target integration and must stay labeled not live until actual delivery is recorded.

## Match receipts to real screenshots

1. Export `/deliveries` from the running bot, following every page. The export needs no Telegram API token or group identifier. Record the fetch timestamp and endpoint separately from the provider's send time.
2. Filter to `receipt.provider === "telegram"`, the six required event names, and entries without `variant: "available"`. Match their transaction hash and rental/item IDs to the actual live demo receipts. Multiple rentals can produce several messages of the same type; keep each run distinguishable.
3. In the Telegram group's normal app, find the actual message using its provider timestamp and item/rental content. If a private Telegram message link is needed to locate its message ID, keep that link private: it can encode the group's identifier. The public receipt intentionally has no group link or identifier.
4. Capture the genuine group message, retaining its visible timestamp and event content. A rendered receipt table or generated chat image is not a group screenshot. Keep the uncropped original privately; remove unrelated messages, phone numbers and private group details from the shareable copy.
5. Name the public file, for example, `2026-11-01-rented-message-42.png`, using the actual message ID. Add its path and SHA-256 beside the matching event/receipt in `deployments/notification-status.json`. Record who captured it, when, and whether privacy redaction was applied. Do not fill any capture fields before the screenshot exists.

If no authenticated Telegram client is available in the workspace, the owner captures the group screenshots and supplies them for matching. The bot's acknowledgement API cannot retrieve or fabricate a screenshot of the private group conversation.

Phone captures belong under `docs/evidence/phone/` after following [PHONE_REHEARSAL.md](../PHONE_REHEARSAL.md). Record the phone/browser/wallet version, printed-QR scan, actual public URLs and finalized transaction references in `deployments/phone-rehearsal.json`. Keep the scripted live demo and the phone rehearsal identifiable as separate runs.
