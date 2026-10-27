import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { demoSteps, eventSummary } from "./report-model";

const escape = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
async function optional(path: string): Promise<any | null> {
  try {
    return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
function testSummary(
  report: any,
): { passed: number; failed: number; skipped: number } | null {
  if (!report || typeof report !== "object") return null;
  const counts = { passed: 0, failed: 0, skipped: 0 };
  for (const suite of Object.values(report) as any[]) {
    for (const test of Object.values(suite.test_results ?? {}) as any[]) {
      if (test.status === "Success") counts.passed++;
      else if (test.status === "Skipped") counts.skipped++;
      else counts.failed++;
    }
  }
  return counts.passed + counts.failed + counts.skipped ? counts : null;
}

const [probe, deployment, demo, tests, decisions, funded] = await Promise.all([
  optional("deployments/probe.json"),
  optional("deployments/portaldot-v3.json"),
  optional("deployments/demo-run.json"),
  optional(process.env.FOUNDRY_RESULTS_PATH ?? "reports/foundry.json"),
  readFile("docs/DECISIONS.md", "utf8"),
  optional("deployments/funded-probe.json"),
]);
const summary = testSummary(tests);
const blockEvidence = (hash: unknown, block: unknown) =>
  typeof hash === "string" && /^0x[0-9a-f]{64}$/i.test(hash)
    ? `<a href="https://node-console.portaldot.dev/?rpc=wss%3A%2F%2Ftest-node-v3.portaldot.dev#/explorer/query/${hash}">${escape(block)}</a>`
    : escape(block);
const contractRows = Object.entries(deployment?.contracts ?? {})
  .map(
    ([name, c]: [string, any]) =>
      `<tr><td>${escape(name)}</td><td><code>${escape(c.address)}</code></td><td><code>${escape(c.txHash)}</code></td><td>${blockEvidence(c.blockHash, c.block)}</td></tr>`,
  )
  .join("");
const steps = demoSteps(demo);
const transactionRows = steps
  .map((s) => {
    const summary = eventSummary(
      s,
      deployment?.contracts,
      deployment?.units?.verified ? deployment.units.evmDecimals : undefined,
    );
    return `<tr><td>${escape(s.step ?? s.name)}</td><td><code>${escape(s.txHash ?? "Native block initialization; no extrinsic hash")}</code></td><td>${blockEvidence(s.blockHash, s.block)}</td><td>${escape(summary.events)}</td><td>${escape(summary.amounts)}</td></tr>`;
  })
  .join("");
const probeRows = Object.entries({ ...probe?.checks, ...funded?.checks })
  .map(
    ([name, check]: [string, any]) =>
      `<tr><th>${escape(name)}</th><td>${escape(check.status)}</td><td><details><summary>Recorded evidence</summary><pre>${escape(JSON.stringify(check, null, 2))}</pre></details></td></tr>`,
  )
  .join("");
const fundedRows = Object.entries(funded?.checks ?? {})
  .map(
    ([name, check]: [string, any]) =>
      `<tr><td>${escape(name)}</td><td>${escape(check.status)}</td><td><code>${escape(check.evidence?.txHash)}</code></td><td>${blockEvidence(check.evidence?.blockHash, check.evidence?.block)}</td></tr>`,
  )
  .join("");
const applicationReady =
  !!deployment?.contracts?.MeterMend && !!deployment?.contracts?.Cronpot;
const scheduler = steps.filter((s) =>
  /schedul/i.test(String(s.step ?? s.event)),
);
const now = new Date().toISOString();
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MeterMend · deployment proof</title>
<style>:root{color-scheme:light dark;--bg:#f6f3eb;--fg:#171713;--line:#d4d0c6;--muted:#625e53}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:clamp(20px,5vw,64px)}a{color:inherit;text-underline-offset:4px}header{border-bottom:3px solid #ff6a13;padding-bottom:26px}h1{font-size:clamp(40px,7vw,80px);letter-spacing:-.065em;line-height:1.05;margin:12px 0}h2{margin-top:40px;font-size:24px}small,.muted{color:var(--muted)}.tag{font:12px monospace;text-transform:uppercase;letter-spacing:.12em;color:#ba4300}.scroll{overflow:auto;border:1px solid var(--line);border-radius:8px}table{width:100%;border-collapse:collapse;text-align:left;font-size:14px}th,td{padding:12px;vertical-align:top;border-bottom:1px solid var(--line)}code,pre{font:12px/1.65 ui-monospace,monospace;overflow-wrap:anywhere}pre{white-space:pre-wrap;max-height:500px;overflow:auto}summary{cursor:pointer}.status{border-left:4px solid #ff6a13;padding:12px 20px;background:#ff6a1310}footer{margin-top:50px;border-top:1px solid var(--line);padding-top:18px}@media(prefers-color-scheme:dark){:root{--bg:#171713;--fg:#f4efe5;--line:#3b3a34;--muted:#b2ad9f}.tag{color:#ff8b46}}</style>
<main><header><div class="tag">Portaldot V3 · permanent proof ledger</div><h1>Every rental funds<br>its next repair.</h1><p>MeterMend keeps deposits, operator income and each item's repair reserve separate.</p><a href="https://github.com/willy264/portal_dot">Source code</a> · <a href="https://node-console.portaldot.dev/?rpc=wss%3A%2F%2Ftest-node-v3.portaldot.dev">V3 node console</a></header>
<p class="status">${applicationReady ? "Application deployment manifest recorded. Verify the transaction evidence below." : "Application deployment pending. A live runtime probe is distinct from a deployed MeterMend application and its full demo."}</p>
<h2>Network and verification</h2><p>Chain ID: <code>${escape(deployment?.chainId ?? probe?.checks?.P1?.chainId ?? "not observed")}</code> · Runtime: <code>${escape(deployment?.specVersion ?? probe?.checks?.P1?.runtime?.specVersion ?? "not observed")}</code> · Code: <code>${escape(deployment?.codeFormat ?? "not deployed")}</code> · Refund execution: <code>${escape(deployment?.cronpotMode ?? "unverified")}</code></p>
<p>Foundry results: ${summary ? `${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped in this report's build.` : "No test report attached to this build."}</p>
<h2>Contracts</h2>${contractRows ? `<div class="scroll"><table><thead><tr><th>Contract</th><th>Address</th><th>Deployment transaction</th><th>Block</th></tr></thead><tbody>${contractRows}</tbody></table></div>` : "<p>No contract addresses have been recorded.</p>"}
<h2>Funded runtime probes</h2>${fundedRows ? `<div class="scroll"><table><thead><tr><th>Check</th><th>Result</th><th>Transaction</th><th>Block</th></tr></thead><tbody>${fundedRows}</tbody></table></div>` : "<p>No funded probe transactions recorded.</p>"}
<h2>Live demonstration</h2><p>Status: ${escape(demo?.status ?? (demo?.completedAt ? "completed" : demo ? "in progress" : "not run"))}.</p>${transactionRows ? `<div class="scroll"><table><thead><tr><th>Step</th><th>Transaction hash</th><th>Block</th><th>Event</th><th>Amount</th></tr></thead><tbody>${transactionRows}</tbody></table></div>` : "<p>No live demo transactions have been recorded.</p>"}
<h2>Scheduler evidence</h2>${scheduler.length ? `<pre>${escape(JSON.stringify(scheduler, null, 2))}</pre>` : "<p>No successful native scheduler execution is claimed.</p>"}
<h2>Phase 0 runtime probe</h2><p>Observed ${escape(probe?.observedAt ?? "not run")}. Probe mode: ${escape(probe?.mode ?? "unknown")}.</p><div class="scroll"><table><thead><tr><th>Check</th><th>Status</th><th>Evidence</th></tr></thead><tbody>${probeRows}</tbody></table></div>
<h2>Implementation decisions</h2><pre>${escape(decisions)}</pre><footer><small>Generated ${escape(now)} · Commit ${escape(process.env.GITHUB_SHA ?? "local working tree")} · MIT license. This self-contained report retains observed evidence even when testnet RPC history is pruned.</small></footer></main></html>`;
const position = process.argv.indexOf("--out");
const output = resolve(
  position >= 0
    ? (process.argv[position + 1] ?? "site/index.html")
    : "site/index.html",
);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(
  `Proof report written: ${output}. Deployment ${deployment ? "recorded" : "pending"}; ${steps.length} demo steps.`,
);
