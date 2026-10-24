# portal_dot

Research and project ideas for the [Portaldot Hacker House 2026](https://dorahacks.io/hackathon/portaldot-hacker-house-2026/detail).

Start with the **[research report and twelve build proposals](PORTALDOT_RESEARCH_AND_IDEAS.md)**. It contains three ideas per competition track, technology findings, partner integration options, MVP scopes, demo plans, and implementation risks.

## Research files

| File | Contents |
|---|---|
| [Brief and prior art](research/brief-and-prior-art.md) | Event requirements, schedule updates, and existing solutions |
| [Runtime research](research/runtime-research.md) | Portaldot execution environments, deployment boundaries, and infrastructure ideas |
| [Partner research](research/partners-research.md) | Documented partner technologies and integration readiness |
| [Node and DApp research](research/node-dapp-research.md) | Detailed product concepts, architectures, and demos |
| [Runtime probe results](research/runtime-probe.json) | Recorded read-only Portaldot RPC responses |
| [Partner probe results](research/partner-probes.json) | Recorded read-only partner API responses |

Research was conducted on October 24, 2026. Findings distinguish documented claims, observed behavior, and assumptions requiring confirmation. This repository currently contains research and a diagnostic script; proposed applications have not been implemented.

## Repeat the runtime probe

With Node.js 22 or later, run from the repository root:

```sh
node research/probe-runtime.mjs
```

The script makes read-only RPC requests and overwrites `research/runtime-probe.json` with the latest observations. It does not sign or submit transactions.
