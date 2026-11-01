# MeterMend pitch deck

The ten-slide deck covers the problem, product flow, protected balances, Portaldot primitives, keeper execution, actual live evidence, engineering checks, proposed business model, roadmap and support request.

- [PDF](../../apps/web/public/metermend-pitch.pdf)
- [Editable HTML source](index.html)
- [Slide contact sheet](previews/contact-sheet.png)
- [Export evidence](../../deployments/submission-materials.json)
- Intended public PDF: https://metermend.vercel.app/metermend-pitch.pdf

The deck is dated November 1, 2026. It explicitly distinguishes the finalized Ping/P4/P6 probes, both finalized application deployments and passing read-backs from the unfinished application demo. Update the live-proof slide from recorded receipts before using a later completed-run narrative. Business pricing is a proposal, not an implemented platform fee or proven customer demand.

Run from the repository root with Node 22 and installed dependencies:

```sh
node scripts/build-pitch.mjs
```

The exporter uses installed Microsoft Edge on Windows. Set `CHROMIUM_PATH` to an installed compatible Chromium executable elsewhere. It embeds the repository's SVG logos, uses local fonts, checks all ten slide bounds and footer clearance, captures each slide, and exports a PDF with selectable text and clickable links. It writes the PDF into the web app's public directory and records its exact SHA-256 and byte count. The browser profile stays in ignored `.tools/`.

Review the full-size slide PNGs and the exported PDF before marking visual review complete. The initial export was also parsed with PyMuPDF: ten pages, approximately 1200 × 675 points (16:9), with working PDF link annotations. Python is not required to run the exporter.

Publication is a separate step. The intended public URL must return this exact PDF before it is claimed as delivered. The export evidence initially records `publicLinkVerified: false`; a hosting check can record the verified URL, timestamp and matching content hash after deployment. Re-exporting resets publication and visual-review status because the artifact has changed.
