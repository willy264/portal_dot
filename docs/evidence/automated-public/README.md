# Public mobile layout audit

These are genuine screenshots of `https://metermend.vercel.app/`, captured on November 1, 2026 using Microsoft Edge headless at a 390 × 844 CSS-pixel mobile viewport. They are automated browser checks, not photographs of a physical phone or a printed QR scan.

The audit visited the home page, equipment catalogue, operator dashboard, arbiter inbox and proof page. It checked horizontal overflow and mobile navigation, without connecting a wallet, injecting a signer, submitting a transaction or uploading evidence. The catalogue shows the actual registered items read from the public app. The operator and arbiter screens were viewed without a connected account.

Most captures include the full page. The catalogue uses ordinary viewport captures, including a second view scrolled to its actual item cards, because one full-page Chromium capture repeated tiles. The malformed capture was replaced; it was a screenshot capture problem rather than a demonstrated application bug.

Capture timestamps, hashes, exact CI revisions, public PDF download hashes and the public ledger response summary are retained in [final-checks.json](../../../deployments/final-checks.json). A successful page load does not establish persistent backend hosting: the observed public ledger reported that its history service was not configured.

The physical-phone printed-QR rehearsal and actual Telegram group screenshots remain separate requirements. Follow [PHONE_REHEARSAL.md](../../PHONE_REHEARSAL.md) and the [notification evidence guide](../README.md).
