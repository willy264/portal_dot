import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const JOURNAL = "corrected-keeper-journal.json";
export const STATUS = "automatic-refund-status.json";
const PREFIX = "corrected-keeper-journal-";
const FILES = new Set([
  JOURNAL,
  STATUS,
  "preflight.json",
  "workflow-state.json",
]);

/** The latest attempt is mandatory: an older artifact could omit a broadcast hash. */
export function previousAttempt(current, runs) {
  if (current.run_attempt > 1) {
    if (
      runs.some(
        (run) =>
          run.head_branch === current.head_branch &&
          run.run_number > current.run_number,
      )
    ) {
      throw new Error(
        "Refusing an older rerun after a newer keeper run exists; dispatch a fresh run to preserve journal order.",
      );
    }
    return { id: current.id, run_attempt: current.run_attempt - 1 };
  }
  const previous = runs
    .filter(
      (run) =>
        run.run_number < current.run_number &&
        run.head_branch === current.head_branch,
    )
    .sort((a, b) => b.run_number - a.run_number)[0];
  if (previous && previous.status !== "completed") {
    throw new Error(
      "Previous keeper run is not completed; refusing concurrent or uncertain signing.",
    );
  }
  return previous;
}

export function requireArtifact(source, artifacts) {
  const name = `${PREFIX}${source.id}-${source.run_attempt}`;
  const matches = artifacts.filter(
    (artifact) => artifact.name === name && !artifact.expired,
  );
  if (matches.length !== 1) {
    throw new Error(
      `Required journal artifact ${name} is missing, expired or ambiguous. Stop and reconcile the original hashes and account nonce; never bootstrap over this run.`,
    );
  }
  return matches[0];
}

export function validateJournal(journal) {
  if (
    journal?.schemaVersion !== 1 ||
    journal.network !== "portaldot-v3-testnet" ||
    !journal.steps ||
    typeof journal.steps !== "object" ||
    Array.isArray(journal.steps)
  ) {
    throw new Error(
      "Invalid keeper journal; refusing to replace it with an empty journal.",
    );
  }
  // Unknown, failed and prior attempts remain untouched for on-chain reconciliation.
  return journal;
}

export function summaryLines(status) {
  const rows = new Map();
  const decimal = (value) =>
    /^\d+$/.test(String(value ?? "")) ? String(value) : null;
  const outcome = (value) =>
    String(value ?? "recorded")
      .replace(/[^a-zA-Z0-9 _-]/g, "")
      .slice(0, 60);
  const visit = (value, inheritedJob, inheritedState, inheritedBlock) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((item) =>
        visit(item, inheritedJob, inheritedState, inheritedBlock),
      );
      return;
    }
    const job = decimal(value.jobId) ?? inheritedJob;
    const block = decimal(value.block) ?? inheritedBlock ?? "unrecorded";
    const hash = value.txHash ?? value.transactionHash;
    const state = outcome(
      value.state ?? value.status ?? value.success ?? inheritedState,
    );
    if (job && /^0x[0-9a-f]{64}$/i.test(String(hash ?? ""))) {
      const key = `${job}:${hash}`;
      if (
        !rows.has(key) ||
        value.state !== undefined ||
        value.status !== undefined ||
        value.success !== undefined
      )
        rows.set(key, `| ${job} | \`${hash}\` | ${block} | ${state} |`);
    }
    Object.values(value).forEach((item) => visit(item, job, state, block));
  };
  // Only explicit job arrays can supply Cronpot evidence. A direct refund's
  // incidental job metadata must never promote it into an executed Cronpot job.
  visit(status?.jobs);
  visit(status?.executedJobs);
  visit(status?.executions);
  const directRows = new Map();
  for (const entry of Array.isArray(status?.directRefunds)
    ? status.directRefunds
    : []) {
    if (!entry || typeof entry !== "object") continue;
    const rental = decimal(entry.rentalId);
    const txHash = entry.txHash;
    if (!rental || !/^0x[0-9a-f]{64}$/i.test(String(txHash ?? ""))) continue;
    directRows.set(
      `${rental}:${txHash}`,
      `| ${rental} | \`${txHash}\` | ${decimal(entry.block) ?? "unrecorded"} | ${outcome(entry.status)} |`,
    );
  }
  return [
    "### MeterMend keeper",
    "",
    /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(String(status?.observedAt ?? ""))
      ? `Status snapshot observed at ${status.observedAt}; a failed run can retain the preceding snapshot.`
      : "No timestamped worker status snapshot is available.",
    "",
    "#### Corrected Cronpot jobs",
    "",
    ...(rows.size
      ? [
          "| Job ID | Transaction hash | Block | Recorded outcome |",
          "| --- | --- | --- | --- |",
          ...rows.values(),
        ]
      : ["No job transaction was recorded in this status snapshot."]),
    "",
    "#### Direct permissionless refund fallback",
    "",
    ...(directRows.size
      ? [
          "| Rental ID | Transaction hash | Block | Recorded outcome |",
          "| --- | --- | --- | --- |",
          ...directRows.values(),
        ]
      : ["No direct refund transaction was recorded in this status snapshot."]),
    "",
    "Direct fallback calls MeterMend.finalizeRefund; it is not evidence of a Cronpot job execution.",
    "",
    "The artifact preserves all journal states, including unknown attempts. A hash alone does not prove finalization.",
    "",
  ].join("\n");
}

function ghJson(endpoint, paginate = false) {
  const arguments_ = [
    "api",
    endpoint,
    ...(paginate ? ["--paginate", "--slurp"] : []),
  ];
  return JSON.parse(
    execFileSync("gh", arguments_, {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    }),
  );
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}
function saveJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function downloadArtifact(source, artifact, repository, staging) {
  execFileSync(
    "gh",
    [
      "run",
      "download",
      String(source.id),
      "--repo",
      repository,
      "--name",
      artifact.name,
      "--dir",
      staging,
    ],
    { stdio: "inherit" },
  );
}

export function restore(
  environment = process.env,
  { api = ghJson, download = downloadArtifact } = {},
) {
  const repository = environment.GITHUB_REPOSITORY;
  const runId = environment.GITHUB_RUN_ID;
  if (repository !== "willy264/portal_dot" || !/^\d+$/.test(runId ?? ""))
    throw new Error("Unexpected keeper repository or run ID.");
  const dataDirectory = resolve(
    environment.DATA_DIR ?? "data/corrected-keeper",
  );
  mkdirSync(dataDirectory, { recursive: true });
  if (readdirSync(dataDirectory).length)
    throw new Error(
      "DATA_DIR is not empty; keep its existing journal and reconcile before changing it.",
    );
  const current = api(`repos/${repository}/actions/runs/${runId}`);
  if (current.head_branch !== "main")
    throw new Error("Keeper signing is restricted to main.");
  const pages = api(
    `repos/${repository}/actions/workflows/keeper.yml/runs?branch=main&per_page=100`,
    true,
  );
  const source = previousAttempt(
    current,
    pages.flatMap((page) => page.workflow_runs),
  );
  let sourceArtifact = null;
  if (source) {
    const artifactPages = api(
      `repos/${repository}/actions/runs/${source.id}/artifacts?per_page=100`,
      true,
    );
    sourceArtifact = requireArtifact(
      source,
      artifactPages.flatMap((page) => page.artifacts),
    );
    const staging = resolve(
      environment.RUNNER_TEMP ?? ".tmp",
      `keeper-restore-${runId}-${current.run_attempt}`,
    );
    mkdirSync(staging, { recursive: true });
    if (readdirSync(staging).length)
      throw new Error("Restore staging is not empty; refusing stale state.");
    // Download errors propagate. Never initialize or fall back to an earlier artifact.
    download(source, sourceArtifact, repository, staging);
    validateJournal(readJson(join(staging, JOURNAL)));
    for (const file of readdirSync(staging)) {
      if (!FILES.has(file))
        throw new Error(`Unexpected file in keeper artifact: ${file}`);
      readJson(join(staging, file));
    }
    for (const file of readdirSync(staging))
      cpSync(join(staging, file), join(dataDirectory, file), {
        errorOnExist: true,
        force: false,
      });
  } else {
    if (
      environment.GITHUB_EVENT_NAME !== "workflow_dispatch" ||
      environment.BOOTSTRAP !== "true" ||
      current.run_attempt !== 1 ||
      current.run_number !== 1
    ) {
      throw new Error(
        "An empty journal is allowed only for manual bootstrap=true on the very first workflow run, after checking the account nonce and pending pool.",
      );
    }
    saveJson(join(dataDirectory, JOURNAL), {
      schemaVersion: 1,
      network: "portaldot-v3-testnet",
      steps: {},
    });
  }
  saveJson(join(dataDirectory, "workflow-state.json"), {
    schemaVersion: 1,
    restoredAt: new Date().toISOString(),
    runId: Number(runId),
    runAttempt: current.run_attempt,
    sourceRunId: source?.id ?? null,
    sourceRunAttempt: source?.run_attempt ?? null,
    sourceArtifactId: sourceArtifact?.id ?? null,
  });
  if (environment.GITHUB_OUTPUT)
    appendFileSync(environment.GITHUB_OUTPUT, "ready=true\n");
  console.log(
    source
      ? `Restored ${sourceArtifact.name}; unknown attempts retained.`
      : "Explicit first-run bootstrap prepared.",
  );
}

// One-time recovery of the Nov 9 download outage. Never a general bootstrap.
export async function recoverZeroNonce(
  environment = process.env,
  { api = ghJson, rpc } = {},
) {
  if (
    environment.GITHUB_REPOSITORY !== "willy264/portal_dot" ||
    environment.GITHUB_EVENT_NAME !== "workflow_dispatch"
  )
    throw new Error(
      "Recovery requires manual dispatch in the keeper repository.",
    );
  const current = api(
    `repos/willy264/portal_dot/actions/runs/${environment.GITHUB_RUN_ID}`,
  );
  if (
    current.head_branch !== "main" ||
    current.run_number !== 46 ||
    current.run_attempt !== 1
  )
    throw new Error("Recovery is restricted to run 46 attempt 1 on main.");
  const runs = api(
    "repos/willy264/portal_dot/actions/workflows/keeper.yml/runs?branch=main&per_page=100",
    true,
  ).flatMap((page) => page.workflow_runs);
  const previous = previousAttempt(current, runs);
  if (
    previous?.id !== 43696492379 ||
    previous.run_attempt !== 1 ||
    runs.some((run) => run.run_number > 46)
  )
    throw new Error("Recovery run history changed; review again.");
  const call =
    rpc ??
    (async (method, params = []) => {
      const response = await fetch("https://test-node-v3.portaldot.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`Recovery RPC HTTP ${response.status}`);
      const body = await response.json();
      if (body.error || body.result === undefined)
        throw new Error("Recovery RPC failed.");
      return body.result;
    });
  const genesis = await call("chain_getBlockHash", [0]);
  if (
    genesis !==
    "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd"
  )
    throw new Error("Recovery chain identity changed.");
  const finalized = await call("chain_getFinalizedHead");
  const codeHash = await call("state_getStorageHash", [
    "0x3a636f6465",
    finalized,
  ]);
  if (
    codeHash !==
    "0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2"
  )
    throw new Error("Recovery runtime changed; review account codec.");
  const best = await call("chain_getBlockHash");
  const key =
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9dc6a09b1c3a7e441e523999161afb263580b765da614f51788dda1df5759e5755bca34ee92a35369dc7965ed2a74770d";
  const nonce = (raw) => {
    if (!/^0x[0-9a-f]{160}$/i.test(raw ?? ""))
      throw new Error("Recovery account codec changed.");
    return Buffer.from(raw.slice(2), "hex").readUInt32LE(0);
  };
  const finalizedNonce = nonce(
    await call("state_getStorage", [key, finalized]),
  );
  const bestNonce = nonce(await call("state_getStorage", [key, best]));
  const nextIndex = await call("system_accountNextIndex", [
    "5E49UZgRcyc8xpfbXz4WhsaF8PM29ZBcNEj55oW1HVYMfPP7",
  ]);
  const pool = await call("author_pendingExtrinsics");
  if (
    finalizedNonce !== 0 ||
    bestNonce !== 0 ||
    Number(nextIndex) !== 0 ||
    !Array.isArray(pool) ||
    !pool.every(isUnsignedExtrinsic)
  )
    throw new Error(
      "Recovery requires zero finalized/best/next nonce and no signed pending extrinsics.",
    );
  const directory = resolve(environment.DATA_DIR ?? "data/corrected-keeper");
  mkdirSync(directory, { recursive: true });
  if (readdirSync(directory).length)
    throw new Error("Recovery DATA_DIR must be empty.");
  saveJson(join(directory, JOURNAL), {
    schemaVersion: 1,
    network: "portaldot-v3-testnet",
    steps: {},
    recovery: {
      reason: "Run 23 artifact download HTTP 503; expired predecessor",
      reviewedThroughRun: 45,
      observedAt: new Date().toISOString(),
      genesis,
      finalized,
      best,
      finalizedNonce,
      bestNonce,
      nextIndex,
      pendingPoolCount: pool.length,
      signedPendingCount: 0,
    },
  });
  saveJson(join(directory, "workflow-state.json"), {
    schemaVersion: 1,
    runId: Number(environment.GITHUB_RUN_ID),
    runAttempt: 1,
    recovery: "reviewed-zero-nonce-run-46",
  });
  if (environment.GITHUB_OUTPUT)
    appendFileSync(environment.GITHUB_OUTPUT, "ready=true\n");
  console.log(
    "One-time run 46 recovery verified: zero nonce and no signed pending extrinsics.",
  );
}

export function isUnsignedExtrinsic(hex) {
  if (!/^0x(?:[0-9a-f]{2})+$/i.test(hex ?? "")) return false;
  const bytes = Buffer.from(hex.slice(2), "hex");
  const mode = bytes[0] & 3;
  if (mode === 3) return false;
  const prefix = [1, 2, 4][mode];
  if (bytes.length <= prefix) return false;
  const length =
    mode === 0
      ? bytes[0] >>> 2
      : mode === 1
        ? bytes.readUInt16LE(0) >>> 2
        : bytes.readUInt32LE(0) >>> 2;
  // Version 4 with the signed bit clear: no account signer or account nonce.
  return length === bytes.length - prefix && bytes[prefix] === 4;
}

function main() {
  if (process.argv[2] === "restore")
    return process.env.RECOVER_ZERO_NONCE === "true"
      ? recoverZeroNonce()
      : restore();
  if (process.argv[2] === "summary") {
    const file = join(
      resolve(process.env.DATA_DIR ?? "data/corrected-keeper"),
      STATUS,
    );
    const summary = summaryLines(existsSync(file) ? readJson(file) : null);
    if (process.env.GITHUB_STEP_SUMMARY)
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
    console.log(summary);
    return;
  }
  throw new Error(
    "Usage: node scripts/keeper-artifact-state.mjs restore|summary",
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  Promise.resolve(main()).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
