import { afterEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  JOURNAL,
  previousAttempt,
  requireArtifact,
  restore,
  summaryLines,
  validateJournal,
} from "./keeper-artifact-state.mjs";

// Synthetic recovery fixtures, never recorded as live chain evidence.
const current = { id: 40, run_number: 4, run_attempt: 1, head_branch: "main" };
const prior = {
  id: 30,
  run_number: 3,
  run_attempt: 2,
  head_branch: "main",
  status: "completed",
  conclusion: "failure",
};
const temporaryDirectories = [];
afterEach(() => {
  temporaryDirectories
    .splice(0)
    .forEach((directory) =>
      rmSync(directory, { recursive: true, force: true }),
    );
});

function context() {
  const directory = mkdtempSync(
    join(tmpdir(), "metermend-keeper-artifact-test-"),
  );
  temporaryDirectories.push(directory);
  return {
    GITHUB_REPOSITORY: "willy264/portal_dot",
    GITHUB_RUN_ID: "40",
    GITHUB_EVENT_NAME: "workflow_dispatch",
    BOOTSTRAP: "false",
    DATA_DIR: join(directory, "data"),
    RUNNER_TEMP: join(directory, "staging"),
    GITHUB_OUTPUT: join(directory, "outputs"),
  };
}

function recoveryApi(endpoint) {
  if (endpoint.includes("/artifacts?"))
    return [
      {
        artifacts: [
          { id: 99, name: "corrected-keeper-journal-30-2", expired: false },
        ],
      },
    ];
  if (endpoint.includes("/workflows/"))
    return [{ workflow_runs: [current, prior] }];
  return current;
}

describe("keeper artifact recovery", () => {
  it("requires the immediately previous failed run and its latest attempt", () => {
    expect(
      previousAttempt(current, [
        { ...prior, id: 20, run_number: 2, conclusion: "success" },
        prior,
      ]),
    ).toEqual(prior);
  });
  it("restores the previous attempt of a rerun before considering older runs", () => {
    expect(previousAttempt({ ...current, run_attempt: 3 }, [prior])).toEqual({
      id: 40,
      run_attempt: 2,
    });
  });
  it("refuses an old rerun that would roll back a newer run journal", () => {
    expect(() =>
      previousAttempt({ ...prior, run_attempt: 3 }, [current]),
    ).toThrow("older rerun");
  });
  it("refuses an unfinished predecessor", () => {
    expect(() =>
      previousAttempt(current, [{ ...prior, status: "in_progress" }]),
    ).toThrow("not completed");
  });
  it("does not replace a missing or expired latest artifact with older state", () => {
    expect(() =>
      requireArtifact(prior, [
        { name: "corrected-keeper-journal-30-1", expired: false },
      ]),
    ).toThrow("missing");
    expect(() =>
      requireArtifact(prior, [
        { name: "corrected-keeper-journal-30-2", expired: true },
      ]),
    ).toThrow("expired");
  });
  it("preserves uncertain hashes and prior attempts without modification", () => {
    const journal = {
      schemaVersion: 1,
      network: "portaldot-v3-testnet",
      steps: { execute: { state: "unknown", txHash: `0x${"1".repeat(64)}` } },
      priorAttempts: { execute: [{ state: "failed" }] },
    };
    expect(validateJournal(journal)).toBe(journal);
    expect(journal.steps.execute.state).toBe("unknown");
  });
  it("rejects malformed journals", () => {
    expect(() => validateJournal({ steps: {} })).toThrow(
      "Invalid keeper journal",
    );
  });
  it("prints job IDs and hashes without printing arbitrary status payloads", () => {
    const txHash = `0x${"2".repeat(64)}`;
    const summary = summaryLines({
      executions: [{ jobId: "7", state: "confirmed", evidence: { txHash } }],
      seed: "must never appear",
    });
    expect(summary).toContain("| 7 |");
    expect(summary).toContain(txHash);
    expect(summary).toContain("confirmed");
    expect(summary).not.toContain("must never appear");
  });
  it("reports direct rental refunds separately from corrected Cronpot jobs", () => {
    const cronHash = `0x${"4".repeat(64)}`;
    const directHash = `0x${"5".repeat(64)}`;
    const summary = summaryLines({
      jobs: [{ jobId: "7", status: "executed", txHash: cronHash, block: 200 }],
      executedJobs: [
        { jobId: "7", rentalId: "8", txHash: cronHash, block: 200 },
      ],
      directRefunds: [
        {
          rentalId: "9",
          jobId: "99",
          txHash: directHash,
          block: 201,
          status: "direct-refund-finalized",
        },
      ],
    });
    const [cronSection, directSection] = summary.split(
      "#### Direct permissionless refund fallback",
    );
    expect(cronSection).toContain(`| 7 | \`${cronHash}\` | 200 | executed |`);
    expect(cronSection).not.toContain(directHash);
    expect(cronSection).not.toContain("| 99 |");
    expect(directSection).toContain(
      `| 9 | \`${directHash}\` | 201 | direct-refund-finalized |`,
    );
    expect(directSection).not.toContain(cronHash);
    expect(directSection).toContain("not evidence of a Cronpot job execution");
    expect(summary.split(cronHash)).toHaveLength(2);
  });
  it("does not render malformed direct records or invent missing blocks", () => {
    const txHash = `0x${"6".repeat(64)}`;
    const summary = summaryLines({
      directRefunds: [
        null,
        { rentalId: "bad|value", txHash },
        { rentalId: "3", txHash: "invalid" },
        { rentalId: "4", txHash },
      ],
    });
    expect(summary).toContain(`| 4 | \`${txHash}\` | unrecorded | recorded |`);
    expect(summary).not.toContain("bad|value");
    expect(summary).not.toContain("| 3 |");
    expect(summary).toContain("No job transaction was recorded");
  });
  it("propagates download failure without initializing an empty journal", () => {
    const environment = context();
    expect(() =>
      restore(environment, {
        api: recoveryApi,
        download: () => {
          throw new Error("Synthetic download outage");
        },
      }),
    ).toThrow("download outage");
    expect(existsSync(join(environment.DATA_DIR, JOURNAL))).toBe(false);
    expect(existsSync(environment.GITHUB_OUTPUT)).toBe(false);
  });
  it("restores an unknown attempt unchanged and only then marks the bundle ready", () => {
    const environment = context();
    const journal = {
      schemaVersion: 1,
      network: "portaldot-v3-testnet",
      steps: {
        execute: {
          state: "unknown",
          txHash: `0x${"3".repeat(64)}`,
          nonce: "9",
        },
      },
    };
    restore(environment, {
      api: recoveryApi,
      download: (_source, _artifact, _repository, staging) =>
        writeFileSync(join(staging, JOURNAL), JSON.stringify(journal)),
    });
    expect(
      JSON.parse(readFileSync(join(environment.DATA_DIR, JOURNAL), "utf8")),
    ).toEqual(journal);
    expect(readFileSync(environment.GITHUB_OUTPUT, "utf8")).toBe(
      "ready=true\n",
    );
  });
  it("allows empty state only on the explicitly dispatched first run", () => {
    const environment = context();
    environment.BOOTSTRAP = "true";
    const api = (endpoint) =>
      endpoint.includes("/workflows/")
        ? [{ workflow_runs: [] }]
        : { ...current, run_number: 1 };
    restore(environment, { api });
    expect(
      JSON.parse(readFileSync(join(environment.DATA_DIR, JOURNAL), "utf8"))
        .steps,
    ).toEqual({});
    const scheduled = {
      ...context(),
      BOOTSTRAP: "true",
      GITHUB_EVENT_NAME: "schedule",
    };
    expect(() => restore(scheduled, { api })).toThrow("manual bootstrap");
    expect(existsSync(join(scheduled.DATA_DIR, JOURNAL))).toBe(false);
  });
});
