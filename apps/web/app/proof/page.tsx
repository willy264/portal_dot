import { ProofAccordion } from "@/components/proof-accordion";
import { ArrowUpRight, FileCheck2, Radio } from "lucide-react";
import { isAddress } from "viem";
import { existsSync } from "node:fs";
import path from "node:path";
import { Badge, EmptyState, PageHeading } from "@/components/ui";
import { publicConfig, readDeployment } from "@/lib/server-config";
import { historyEndpoint } from "@/lib/history-endpoint";
import { readHistoryJson } from "@/lib/history-service";
import { errorMessage } from "@/lib/format";
import {
  demoStatus,
  correctedRefundFrom,
  demoTransactionsFrom,
  failedDemoTransactionsFrom,
  expectedFailuresFrom,
  consoleLink,
  probeRows,
  transactionsFrom,
  type ProofTransaction,
} from "@/lib/proof";
import {
  KEEPER_EXPLANATION,
  hasGeneratedDeck,
  executorJobs,
  operationalCards,
} from "@/lib/operational-proof";
export const dynamic = "force-dynamic";
export default async function Proof() {
  const [config, probe, deployment, demo, funded] = await Promise.all([
    publicConfig(),
    readDeployment("probe.json"),
    readDeployment("portaldot-v3.json"),
    readDeployment("demo-run.json"),
    readDeployment("funded-probe.json"),
  ]);
  const [
    deploymentStatus,
    chainStatus,
    rpcDiscovery,
    hosting,
    notifications,
    submission,
    refundCalibration,
    keeperHosting,
    correctedCronpot,
  ] = await Promise.all([
    readDeployment("deployment-status.json"),
    readDeployment("chain-status-2026-11-04.json"),
    readDeployment("rpc-discovery.json"),
    readDeployment("hosting-status.json"),
    readDeployment("notification-status.json"),
    readDeployment("submission-materials.json"),
    readDeployment("refund-calibration-summary.json"),
    readDeployment("corrected-keeper-hosting-plan.json"),
    readDeployment("corrected-cronpot.json"),
  ]);
  let jobs: unknown = null;
  let jobsError: string | null = null;
  let executorHealth: Record<string, any> | null = null;
  const base = await historyEndpoint();
  if (base) {
    const readExecutor = async (route: string) => {
      const body = await readHistoryJson(base, route, 6000);
      if (!body || typeof body !== "object" || Array.isArray(body))
        throw new Error("Invalid executor response");
      return body;
    };
    const [jobResponse, healthResponse] = await Promise.allSettled([
      readExecutor("/jobs"),
      readExecutor("/health"),
    ]);
    if (jobResponse.status === "fulfilled") jobs = jobResponse.value;
    else jobsError = errorMessage(jobResponse.reason);
    executorHealth =
      healthResponse.status === "fulfilled"
        ? { ...healthResponse.value, observedAt: new Date().toISOString() }
        : {
            status: "Unavailable",
            observedAt: new Date().toISOString(),
            error: errorMessage(healthResponse.reason),
          };
  }
  const deployTransactions = [
    ...transactionsFrom(deployment, "Deployment"),
    ...transactionsFrom(
      correctedCronpot?.deployment,
      "Corrected Cronpot deployment",
    ),
  ];
  const demoTransactions = demoTransactionsFrom(demo);
  const correctedRefund = correctedRefundFrom(demo);
  const failedDemoTransactions = failedDemoTransactionsFrom(demo);
  const rejectedTransactions = expectedFailuresFrom(demo);
  const probeTransactions = [
    ...transactionsFrom(probe, "Phase 0"),
    ...transactionsFrom(funded, "Funded Phase 0"),
  ];
  const schedulerTransactions = transactionsFrom(jobs, "Executor");
  const jobList = executorJobs(jobs);
  const operations = operationalCards({
    demo,
    deploymentStatus,
    chainStatus,
    rpcDiscovery,
    hosting,
    notifications,
    submission,
    executorHealth,
    refundCalibration,
    correctedCronpot,
    keeperHosting,
  });
  const deckAvailable = hasGeneratedDeck(
    submission,
    existsSync(path.join(process.cwd(), "public/metermend-pitch.pdf")),
  );
  const rows = probeRows({
    ...probe,
    checks: { ...probe?.checks, ...funded?.checks },
  });
  const ping = funded?.ping;
  const hasPingProof =
    typeof ping?.address === "string" &&
    isAddress(ping.address) &&
    /^0x[\da-f]{64}$/i.test(String(ping.txHash)) &&
    /^0x[\da-f]{64}$/i.test(String(ping.blockHash));
  return (
    <div className="container page-space">
      <PageHeading
        eyebrow="PUBLIC PROOF / PORTALDOT V3"
        title="Good records. No guesswork."
        description="Contract addresses, runtime checks and transaction evidence from the actual deployment. A dry run, a queued job and a completed payment are shown as different things."
        action={
          <a
            className="button"
            href={consoleLink(config.wssUrl)}
            target="_blank"
            rel="noreferrer"
          >
            Open node console <ArrowUpRight size={16} />
          </a>
        }
      />
      <div className="proof-lead">
        <section className="panel">
          <span className="eyebrow">
            <FileCheck2 size={14} /> DEPLOYMENT RECORD
          </span>
          <h2 style={{ marginTop: 16 }}>
            {config.meterMend
              ? "Contract address recorded."
              : "Live deployment is pending."}
          </h2>
          <p className="muted">
            {config.meterMend
              ? "Addresses below come from the deployment manifest. Inspect the recorded transaction outcomes to verify deployment and use."
              : "Application contracts and the rental demonstration are pending. The deployed runtime probe and its observations remain available below."}
          </p>
          <dl className="detail-list">
            <div>
              <dt>Network</dt>
              <dd>Portaldot V3 testnet</dd>
            </div>
            <div>
              <dt>Chain ID</dt>
              <dd className="mono">420420777 / 0x190f1ca9</dd>
            </div>
            <div>
              <dt>Runtime spec</dt>
              <dd className="mono">
                {deployment?.specVersion ??
                  probe?.checks?.P1?.runtime?.specVersion ??
                  "Not observed"}
              </dd>
            </div>
            <div>
              <dt>Code format deployed</dt>
              <dd>{deployment?.codeFormat ?? "Not deployed"}</dd>
            </div>
          </dl>
        </section>
        <section className="panel">
          <span className="eyebrow">
            <Radio size={14} /> EXECUTION & STORAGE
          </span>
          <h2 style={{ marginTop: 16 }}>Permissionless keeper</h2>
          <p>{KEEPER_EXPLANATION}</p>
          <p className="small muted">
            The signed native Scheduler probe returned BadOrigin (P5). No native
            Scheduler refund execution is claimed.
          </p>
          <dl className="detail-list">
            <div>
              <dt>Funded units check</dt>
              <dd>
                <Badge tone={config.unitsVerified ? "green" : "orange"}>
                  {config.unitsVerified ? "Verified" : "Pending"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt>Payment writes</dt>
              <dd>
                {config.unitsVerified && config.meterMend
                  ? "Enabled after wallet approval"
                  : "Disabled"}
              </dd>
            </div>
            <div>
              <dt>Evidence bytes</dt>
              <dd>
                {config.nativeEvidence
                  ? config.storageConfigured
                    ? "Native + persistent backup"
                    : "Native verified; backup unconfigured"
                  : config.storageConfigured
                    ? "Persistent application storage"
                    : "Storage unconfigured"}
              </dd>
            </div>
            {config.nativeEvidence && (
              <>
                <div>
                  <dt>Funded native store observed</dt>
                  <dd>{config.nativeEvidence.probeBytes} bytes</dd>
                </div>
                <div>
                  <dt>Photo preparation limit</dt>
                  <dd>64 KiB JPEG thumbnail</dd>
                </div>
                <div>
                  <dt>Native retention</dt>
                  <dd>
                    {config.nativeEvidence.retentionBlocks.toLocaleString()}{" "}
                    blocks
                  </dd>
                </div>
              </>
            )}
            <div>
              <dt>Evidence commitment</dt>
              <dd>SHA-256 of final stored bytes</dd>
            </div>
            <div>
              <dt>Demonstration</dt>
              <dd>{demoStatus(demo)}</dd>
            </div>
          </dl>
        </section>
      </div>
      <ProofAccordion
        id="refund-proof"
        level={2}
        title={<>Refund execution evidence</>}
        meta={
          <>
            <span className="eyebrow">FINALIZED RECEIPTS</span>
          </>
        }
      >
        <p>
          Original Cronpot failed (OutOfGas, tx{" "}
          <code className="hash">
            {demo?.failedTransactions?.["cronpot-callback-failed"]?.txHash ??
              "not recorded"}
          </code>
          ). The deposit was refunded directly (tx{" "}
          <code className="hash">
            {demo?.directRefund?.txHash ?? "not recorded"}
          </code>
          ).
          {correctedRefund ? (
            <>
              {" "}
              The corrected Cronpot then executed a live automatic refund (tx{" "}
              <code className="hash">{correctedRefund.txHash}</code>).
            </>
          ) : (
            <>
              {" "}
              The corrected Cronpot has been deployed; its live automatic refund
              is pending verified JobExecuted(success=true) and DepositRefunded.
            </>
          )}
        </p>
        <p className="small muted">
          MeterMend retains its original built-in Cronpot address. The keeper
          schedules the new callback on the corrected Cronpot, targeting the
          existing MeterMend contract after refundAt.
        </p>
      </ProofAccordion>
      <ProofAccordion
        id="hosting"
        level={2}
        title={<>Hosting</>}
        meta={
          <>
            <span className="eyebrow">FREE SERVICES</span>
          </>
        }
      >
        <p>
          Vercel app, GitHub Pages proof, GitHub Actions keeper (free, runs
          every ~10 min), permissionless refunds as fallback. Scheduled runs can
          be delayed; the rental page’s Finalize refund button is available
          after the dispute deadline and displays its finalized transaction
          hash.
        </p>
        <dl className="detail-list">
          <div>
            <dt>Public app</dt>
            <dd>
              <a href="https://metermend.vercel.app">Vercel</a>
            </dd>
          </div>
          <div>
            <dt>Proof report</dt>
            <dd>
              <a href="https://willy264.github.io/portal_dot/">GitHub Pages</a>
            </dd>
          </div>
          <div>
            <dt>GitHub Actions keeper</dt>
            <dd>
              {keeperHosting?.githubActions?.status ?? "Not yet verified"}
              {" · "}
              <a href="https://github.com/willy264/portal_dot/actions/workflows/keeper.yml">
                Workflow runs
              </a>
            </dd>
          </div>
          <div>
            <dt>History service</dt>
            <dd>
              <a href="https://metermend-preview.onrender.com/health">
                Render Free · read only
              </a>
            </dd>
          </div>
        </dl>
        <p className="small muted">
          Render Free may be waking up when history is requested; its filesystem
          is temporary. Known limitation: the history indexer can lag, so
          finalized transaction receipts and direct contract reads are the
          evidence for the live demo.
        </p>
      </ProofAccordion>
      <ProofAccordion
        id="demo-evidence"
        level={2}
        title={<>Demo evidence images</>}
        meta={
          <>
            <span className="eyebrow">PUBLIC COPIES</span>
          </>
        }
      >
        <p>
          These are the labeled return, dispute and repair fixtures submitted
          during the live testnet demo. They are generated demonstration images,
          not photographs or real-world receipts. Their SHA-256 hashes and
          source files are recorded in the repository.
        </p>
        <div className="decision-actions">
          {["return", "dispute", "repair"].map((name) => (
            <a
              key={name}
              className="button"
              href={`https://raw.githubusercontent.com/willy264/portal_dot/main/docs/evidence/demo/${name}.png`}
              target="_blank"
              rel="noreferrer"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)} image{" "}
              <ArrowUpRight size={16} />
            </a>
          ))}
          <a
            className="text-button"
            href="https://github.com/willy264/portal_dot/blob/main/docs/evidence/demo/README.md"
          >
            Image provenance and hashes <ArrowUpRight size={14} />
          </a>
        </div>
      </ProofAccordion>
      <ProofAccordion
        level={2}
        title={<>Submission readiness and operational evidence</>}
        meta={
          <>
            <span className="eyebrow">TIMESTAMPED OBSERVATIONS</span>
          </>
        }
      >
        <p>
          These are retained observations, not a live guarantee of node health
          or completed deployment. Pending transactions remain separate from
          finalized receipts.
        </p>
        {operations.map((operation) => (
          <ProofAccordion
            key={operation.title}
            level={3}
            title={<>{operation.title}</>}
            meta={
              <>
                <Badge>{operation.status}</Badge>
              </>
            }
          >
            <p className="small muted">
              Observed: {operation.observedAt ?? "Not recorded"}
            </p>
            <dl className="detail-list">
              {operation.fields.map((field) => (
                <div key={field.label}>
                  <dt>{field.label}</dt>
                  <dd className="hash">{field.value}</dd>
                </div>
              ))}
            </dl>
          </ProofAccordion>
        ))}
        {deckAvailable && (
          <a
            className="button"
            href="/metermend-pitch.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Open pitch deck PDF <ArrowUpRight size={16} />
          </a>
        )}
      </ProofAccordion>
      <ProofAccordion
        level={2}
        title={<>Application contract addresses</>}
        meta={
          <>
            <span className="eyebrow">RECORDED IDENTIFIERS</span>
          </>
        }
      >
        {config.meterMend || config.cronpot ? (
          <div className="proof-addresses">
            {[
              ["MeterMend", config.meterMend],
              ["Original built-in Cronpot", config.cronpot],
              ...(isAddress(String(correctedCronpot?.deployment?.address))
                ? [
                    [
                      "Corrected external Cronpot",
                      correctedCronpot!.deployment.address,
                    ],
                  ]
                : []),
            ].map(([name, address]) => (
              <article className="panel" key={name}>
                <h3>{name}</h3>
                <code className="hash">{address ?? "No address recorded"}</code>
                <p className="small muted" style={{ marginTop: 14 }}>
                  Substrate-signed Revive calls · EVM RPC reads
                </p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Application addresses are pending."
            description="This section fills from the actual deployment manifest after the contracts are deployed."
          />
        )}
      </ProofAccordion>
      {hasPingProof && (
        <ProofAccordion
          level={2}
          title={<>Runtime probe contract</>}
          meta={
            <>
              <span className="eyebrow">DEPLOYED PROBE</span>
            </>
          }
        >
          <ProofAccordion
            level={3}
            title={<>Ping</>}
            meta={
              <>
                <Badge tone="green">Deployment recorded</Badge>
              </>
            }
          >
            <p className="small muted">
              This probe verified runtime behavior. It is separate from the
              MeterMend and Cronpot application contracts.
            </p>
            <dl className="detail-list">
              <div>
                <dt>Contract address</dt>
                <dd className="hash">{ping.address}</dd>
              </div>
              <div>
                <dt>Deployment transaction</dt>
                <dd className="hash">{ping.txHash}</dd>
              </div>
              <div>
                <dt>Block</dt>
                <dd className="mono">{String(ping.block)}</dd>
              </div>
              <div>
                <dt>Block hash</dt>
                <dd className="hash">{ping.blockHash}</dd>
              </div>
            </dl>
            <a
              className="text-button"
              href={consoleLink(config.wssUrl, ping.blockHash)}
              target="_blank"
              rel="noreferrer"
            >
              Inspect probe deployment <ArrowUpRight size={14} />
            </a>
          </ProofAccordion>
        </ProofAccordion>
      )}
      <ProofAccordion
        level={2}
        title={<>Phase 0 observations</>}
        meta={
          <>
            <span className="eyebrow">{probe?.mode ?? "NOT RUN"}</span>
          </>
        }
      >
        <p>
          {probe?.observedAt
            ? `Observed ${new Date(probe.observedAt).toUTCString()}.`
            : "No probe artifact has been recorded."}{" "}
          Metadata support and simulations do not count as successful funded
          executions.
        </p>
        <div className="proof-table-wrap">
          <table className="proof-table">
            <thead>
              <tr>
                <th>CHECK</th>
                <th>RESULT</th>
                <th>WHAT IT ESTABLISHES</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="mono">{row.id}</span>
                    <p>{row.label}</p>
                  </td>
                  <td>
                    <Badge
                      tone={
                        row.status === "passed"
                          ? "green"
                          : row.status === "failed"
                            ? "red"
                            : "orange"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td>{row.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProofAccordion>
      <TransactionSection
        title="Deployment transactions"
        records={deployTransactions}
        wss={config.wssUrl}
        empty="No live deployment transaction has been recorded."
      />
      <TransactionSection
        title="Live demonstration"
        records={demoTransactions}
        wss={config.wssUrl}
        empty="No live rental, refund, dispute or repair transaction has been recorded."
      />
      {failedDemoTransactions.length > 0 && (
        <>
          <p className="callout">
            The keeper's outer transaction finalized, but its Cronpot callback
            failed. No DepositRefunded event was emitted, so this attempt does
            not establish an automatic refund.
          </p>
          <TransactionSection
            title="Failed live demonstration attempts"
            records={failedDemoTransactions}
            wss={config.wssUrl}
            empty="No failed live attempt has been recorded."
          />
        </>
      )}
      <ProofAccordion
        level={2}
        title={<>Expected rejection evidence</>}
        meta={
          <>
            <span className="eyebrow">
              {rejectedTransactions.length} RECORDS
            </span>
          </>
        }
      >
        <p>
          These signed attempts exercise permission checks. The dispatch error
          records the on-chain rejection; the decoded preflight error comes from
          the live simulation before signing.
        </p>
        {rejectedTransactions.length ? (
          rejectedTransactions.map((record) => (
            <ProofAccordion
              key={record.txHash}
              level={3}
              title={<>{record.label}</>}
              meta={
                <>
                  <Badge>{record.status}</Badge>
                </>
              }
            >
              <code className="hash">{record.txHash}</code>
              <dl className="detail-list">
                <div>
                  <dt>Block</dt>
                  <dd>{record.block ?? "Not retained"}</dd>
                </div>
                <div>
                  <dt>Block hash</dt>
                  <dd className="hash">{record.blockHash ?? "Not retained"}</dd>
                </div>
                <div>
                  <dt>On-chain dispatch error</dt>
                  <dd>{record.dispatchError ?? "Not retained"}</dd>
                </div>
                <div>
                  <dt>Preflight error</dt>
                  <dd>
                    {record.expectedError ?? "Not retained"} (
                    {record.expectedErrorSource ?? "source not recorded"})
                  </dd>
                </div>
                <div>
                  <dt>Signed by</dt>
                  <dd className="hash">{record.signedBy ?? "Not retained"}</dd>
                </div>
                <div>
                  <dt>Call value (base units)</dt>
                  <dd>{record.value ?? "Not retained"}</dd>
                </div>
                <div>
                  <dt>Recorded events</dt>
                  <dd>{record.eventNames.join(", ") || "Not retained"}</dd>
                </div>
                <div>
                  <dt>State comparison</dt>
                  <dd>{record.reserveAssertion}</dd>
                </div>
              </dl>
              <a
                className="text-button"
                href={consoleLink(config.wssUrl, record.blockHash)}
                target="_blank"
                rel="noreferrer"
              >
                Inspect rejection receipt <ArrowUpRight size={14} />
              </a>
            </ProofAccordion>
          ))
        ) : (
          <p className="callout">
            No signed rejection receipt has been recorded.
          </p>
        )}
      </ProofAccordion>
      <TransactionSection
        title="Funded probe transactions"
        records={probeTransactions}
        wss={config.wssUrl}
        empty="No signed probe transaction identifier has been recorded."
      />
      <TransactionSection
        title="Cronpot keeper execution evidence"
        records={schedulerTransactions}
        wss={config.wssUrl}
        empty={
          jobsError ??
          "No executor transaction evidence is available from the persisted service."
        }
      />
      <ProofAccordion
        level={2}
        title={<>Keeper job list</>}
        meta={
          <>
            <span className="eyebrow">{jobList.length} JOBS</span>
          </>
        }
      >
        {jobList.length ? (
          <div className="proof-table-wrap">
            <table className="proof-table">
              <thead>
                <tr>
                  <th>JOB</th>
                  <th>STATE</th>
                  <th>EXECUTION</th>
                  <th>DUE AT (UNIX SECONDS)</th>
                  <th>ATTEMPTS</th>
                </tr>
              </thead>
              <tbody>
                {jobList.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.state}</td>
                    <td>{job.scheduling}</td>
                    <td>{job.executeAfter}</td>
                    <td>{job.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="callout">
            {jobsError ??
              (base
                ? "No jobs were returned by the configured keeper."
                : "The persistent keeper service has not been configured.")}
          </p>
        )}
      </ProofAccordion>
      <p className="proof-note">
        Refunds execute automatically via Cronpot; execution is permissionless
        and our keeper runs it. Testnet history may be pruned; the persisted
        event ledger and permanent proof report retain observations. A manual
        refund may leave a later scheduled job that safely fails because the
        deposit is already closed.
      </p>
    </div>
  );
}
function TransactionSection({
  title,
  records,
  wss,
  empty,
}: {
  title: string;
  records: ProofTransaction[];
  wss: string;
  empty: string;
}) {
  return (
    <ProofAccordion
      level={2}
      title={<>{title}</>}
      meta={
        <>
          <span className="eyebrow">{records.length} RECORDS</span>
        </>
      }
    >
      {records.length ? (
        records.map((record, index) => (
          <ProofAccordion
            key={`${record.txHash ?? record.blockHash}-${index}`}
            level={3}
            title={<>{record.label}</>}
            meta={
              <>
                <Badge>{record.status}</Badge>
              </>
            }
          >
            {record.txHash ? (
              <code className="hash">{record.txHash}</code>
            ) : (
              <p className="small muted">Block execution · no extrinsic hash</p>
            )}
            <dl className="detail-list">
              <div>
                <dt>Block</dt>
                <dd className="mono">{record.block ?? "Not retained"}</dd>
              </div>
              <div>
                <dt>Block hash</dt>
                <dd className="hash">{record.blockHash ?? "Not retained"}</dd>
              </div>
              {record.eventNames.length > 0 && (
                <div>
                  <dt>Recorded events</dt>
                  <dd>{record.eventNames.join(", ")}</dd>
                </div>
              )}
            </dl>
            <a
              href={consoleLink(wss, record.blockHash)}
              className="text-button"
              target="_blank"
              rel="noreferrer"
            >
              {record.blockHash ? "Inspect this block" : "Open node console"}
              <ArrowUpRight size={14} />
            </a>
          </ProofAccordion>
        ))
      ) : (
        <p className="callout">{empty}</p>
      )}
    </ProofAccordion>
  );
}
