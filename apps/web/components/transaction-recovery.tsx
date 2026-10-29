"use client";
import { RefreshCw, ArrowUpRight } from "lucide-react";
import { useApp } from "./providers";
import { shortAddress } from "@/lib/format";
import { consoleLink } from "@/lib/proof";
export function TransactionRecovery() {
  const app = useApp();
  const records = app.pendingIntents.filter(
    (record) => !app.busy || record.state === "unknown",
  );
  if (!records.length && !app.journalError) return null;
  return (
    <aside
      className="container transaction-recovery"
      aria-label="Transaction recovery"
    >
      {app.journalError && (
        <div className="callout warning" role="alert">
          <div>
            <strong>Transaction storage needs attention</strong>
            <p>{app.journalError}</p>
            <p className="small">
              Keep this browser’s stored data intact. It may contain an
              unresolved payment.
            </p>
          </div>
          <button
            type="button"
            className="button"
            disabled={!!app.busy}
            onClick={app.checkStorage}
          >
            Recheck browser storage
          </button>
        </div>
      )}
      {records.map((record) => (
        <section className="callout warning" key={record.id}>
          <div>
            <strong>Check the previous {record.action} transaction</strong>
            <p className="small">
              Further writes from {shortAddress(record.account, 8)} are blocked
              until its original outcome is known. Rechecking only reads
              finalized blocks.
            </p>
            <dl className="recovery-details">
              <div>
                <dt>Transaction</dt>
                <dd className="hash">
                  {record.txHash ?? "No transaction hash was retained."}
                </dd>
              </div>
              <div>
                <dt>Contract</dt>
                <dd className="hash">{record.target}</dd>
              </div>
              <div>
                <dt>Started at block</dt>
                <dd className="mono">{record.fromBlock}</dd>
              </div>
            </dl>
            {record.reason && <p className="small muted">{record.reason}</p>}
            {!record.txHash && (
              <p className="small">
                The app cannot prove this outcome without its hash. Keep the
                pending record and inspect your wallet history; do not repeat
                the action.
              </p>
            )}
            <div className="recovery-actions">
              <button
                type="button"
                className="button"
                disabled={!!app.busy || !record.txHash}
                onClick={() => void app.recheckTransaction(record.id)}
              >
                <RefreshCw size={14} /> Recheck transaction
              </button>
              <a
                className="text-button"
                href={consoleLink(
                  app.ledger?.config.wssUrl ??
                    "wss://test-node-v3.portaldot.dev",
                  record.receipt?.blockHash,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Node console <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </section>
      ))}
    </aside>
  );
}
