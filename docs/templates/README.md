# Capture templates

These files are blank planning aids. They contain no recorded actions, finalized receipts or completed phone/video claims.

Copy [phone-run.template.json](phone-run.template.json) when the real phone session begins. Keep `template: true` until actual observations are added; then change it to `false` and use `status: "in-progress"`, `"blocked"` or `"completed"` as the evidence supports. Save the populated public record to `deployments/phone-rehearsal.json`. Duplicate the blank action object for each action, including native image storage when it has a separate transaction. Use decimal strings for base-unit amounts and IDs. Leave unknown values `null`; a timeout is not a failed transaction.

Use the corrected release's actual manifest, addresses and seed receipts. Confirm the public app and printed labels point to that same release. Keep the original scripted run and the phone run separate. The `sameTransactionRefundProof` field becomes `true` only after the same finalized receipt contains both `JobExecuted(success=true)` and the matching `DepositRefunded`.

Copy [recording-manifest.template.json](recording-manifest.template.json) and [shot-map.template.csv](shot-map.template.csv) beside the original recordings. Add one source-capture entry and shot-map row per actual clip. Times in the shot map are seconds within the named source and final export. Record the real transaction and block for overlays; leave those columns empty for an opening title or a shot with no transaction. The CSV contains headers only so no planned shot can be mistaken for captured footage.

Preserve the raw recordings privately. In a public copy, include only shareable filenames and hashes, never private filesystem paths, recovery phrases, account seeds, bot credentials or unrelated conversations. Match actual Telegram screenshots to retained provider message IDs and timestamps. Record redaction or cropping without changing event content.

The recording manifest stays unpublished until the real export has been watched, lasts less than 150 seconds, and plays from its public link without authentication. A template, a rendered title card or a simulated trace is not live footage. Use [PHONE_REHEARSAL.md](../PHONE_REHEARSAL.md) and [DEMO_VIDEO.md](../DEMO_VIDEO.md) for the required actions and narration.
