"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3 } from "lucide-react";
import { useApp } from "./providers";
import {
  ActionButton,
  Badge,
  ChainStatus,
  Countdown,
  EmptyState,
  History,
  Money,
  PageHeading,
} from "./ui";
import { EvidencePreview } from "./evidence";
import { eventsForRental } from "@/lib/history";
import {
  dateTime,
  rentalStatuses,
  sameAddress,
  shortAddress,
} from "@/lib/format";
export function RentalDetail({ id }: { id: string }) {
  const { ledger, wallet, execute } = useApp();
  const rental = ledger?.rentals.find((r) => r.id === id);
  const item = ledger?.items.find((i) => i.id === rental?.itemId);
  const job = ledger?.jobs.find((j) => String(j.id) === rental?.cronJobId);
  const events = eventsForRental(ledger, id);
  const returnEvent = events.find((event) => event.name === "Returned");
  const claim = rental?.dispute;
  const ownRenter = sameAddress(wallet?.h160, rental?.renter);
  return (
    <div className="container page-space">
      <Link className="back-link" href={item ? `/items/${item.id}` : "/items"}>
        <ArrowLeft size={14} /> Back to equipment
      </Link>
      <ChainStatus />
      {rental && item ? (
        <>
          <PageHeading
            eyebrow={`RENTAL RECORD / #${id.padStart(3, "0")}`}
            title={item.name}
            description="The equipment has a history. Your deposit does too."
            action={
              <Badge
                tone={
                  rental.status === 3
                    ? "orange"
                    : rental.status === 4
                      ? "green"
                      : "neutral"
                }
              >
                {rentalStatuses[rental.status]}
              </Badge>
            }
          />
          <ol className="rental-progress">
            {["Rented", "Returned", "Dispute window", "Settled"].map(
              (step, index) => {
                const complete =
                  rental.status === 4 ||
                  index === 0 ||
                  (index === 1 && rental.status >= 2);
                return (
                  <li
                    key={step}
                    className={
                      complete
                        ? "complete"
                        : index === 2 && rental.status >= 2
                          ? "current"
                          : ""
                    }
                  >
                    <span>
                      {complete ? (
                        <Check size={15} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>
                    <strong>{step}</strong>
                  </li>
                );
              },
            )}
          </ol>
          <div className="rental-layout">
            <div>
              <section className="panel">
                <span className="eyebrow">DEPOSIT STATUS</span>
                <h2>
                  {rental.status === 1
                    ? "Your deposit is held while you borrow."
                    : rental.status === 2
                      ? "Return confirmed. Refund on the way."
                      : rental.status === 3
                        ? "A deduction has been proposed."
                        : "This rental is financially closed."}
                </h2>
                <div className="deposit-value">
                  <Money value={rental.deposit} />
                  <span className="muted small">currently held</span>
                </div>
                {rental.status === 2 && (
                  <>
                    <Countdown rental={rental} />
                    <p className="muted">
                      If no dispute is opened, anyone can finalize the refund
                      after the deadline. The executor service is a convenience;
                      it does not control eligibility.
                    </p>
                    <ActionButton
                      disabled={(ledger?.blockTimestamp ?? 0) < rental.refundAt}
                      onAction={() => execute("finalizeRefund", [BigInt(id)])}
                    >
                      Finalize eligible refund <ArrowRight size={16} />
                    </ActionButton>
                  </>
                )}
                {rental.status === 1 && (
                  <p className="muted">
                    Return the equipment to the operator. They will confirm the
                    physical return and attach a photo before the dispute window
                    starts.
                  </p>
                )}
                {rental.status === 3 && claim && (
                  <>
                    <dl className="detail-list">
                      <div>
                        <dt>Proposed deduction to reserve</dt>
                        <dd>
                          <Money value={claim.amount} />
                        </dd>
                      </div>
                      <div>
                        <dt>Refund if approved</dt>
                        <dd>
                          <Money
                            value={
                              BigInt(rental.deposit) - BigInt(claim.amount)
                            }
                          />
                        </dd>
                      </div>
                      <div>
                        <dt>Operator</dt>
                        <dd>Approved by making this proposal</dd>
                      </div>
                      <div>
                        <dt>Renter</dt>
                        <dd>
                          {claim.renterVoted
                            ? claim.renterApproved
                              ? "Approved"
                              : "Rejected"
                            : "Not yet voted"}
                        </dd>
                      </div>
                      <div>
                        <dt>Arbiter</dt>
                        <dd>
                          {claim.arbiterVoted
                            ? claim.arbiterApproved
                              ? "Approved"
                              : "Rejected"
                            : "Not yet voted"}
                        </dd>
                      </div>
                    </dl>
                    <EvidencePreview hash={claim.evidenceHash} />
                    <p className="small muted">
                      Either renter or arbiter approval resolves the operator’s
                      claim. Both must reject to return the full deposit. There
                      is no dispute timeout: a missing decision can keep the
                      deposit locked.
                    </p>
                    {ownRenter && !claim.renterVoted && (
                      <div className="decision-actions">
                        <ActionButton
                          onAction={() =>
                            execute("voteDispute", [BigInt(id), true])
                          }
                        >
                          Approve deduction
                        </ActionButton>
                        <ActionButton
                          className=""
                          onAction={() =>
                            execute("voteDispute", [BigInt(id), false])
                          }
                        >
                          Reject deduction
                        </ActionButton>
                      </div>
                    )}
                  </>
                )}
                {rental.status === 4 && (
                  <p className="muted">
                    The contract has closed the deposit. The recorded refund or
                    dispute-resolution event below contains the settled amounts.
                  </p>
                )}
              </section>
              {returnEvent &&
                typeof returnEvent.args.evidenceHash === "string" && (
                  <section className="panel">
                    <h3>Return photograph</h3>
                    <EvidencePreview hash={returnEvent.args.evidenceHash} />
                  </section>
                )}
              <History events={events} />
            </div>
            <aside>
              <section className="panel">
                <h3>Rental details</h3>
                <dl className="detail-list">
                  <div>
                    <dt>Started</dt>
                    <dd>{dateTime(rental.startedAt)}</dd>
                  </div>
                  <div>
                    <dt>Renter</dt>
                    <dd className="mono" title={rental.renter}>
                      {shortAddress(rental.renter)}
                    </dd>
                  </div>
                  <div>
                    <dt>Equipment ID</dt>
                    <dd>
                      <Link href={`/items/${item.id}`}>
                        MM-{item.id.padStart(3, "0")}
                      </Link>
                    </dd>
                  </div>
                </dl>
              </section>
              <section className="panel">
                <span className="eyebrow">
                  <Clock3 size={13} /> REFUND EXECUTOR
                </span>
                <h3>
                  {ledger?.config.cronpotMode === "native"
                    ? "Native scheduler"
                    : ledger?.config.cronpotMode === "keeper"
                      ? "Permissionless keeper"
                      : "Mode not verified"}
                </h3>
                {rental.cronJobId !== "0" ? (
                  <>
                    <p className="mono">JOB #{rental.cronJobId}</p>
                    {job ? (
                      <dl className="detail-list">
                        <div>
                          <dt>State</dt>
                          <dd>{String(job.state ?? "Unknown")}</dd>
                        </div>
                        <div>
                          <dt>Scheduling</dt>
                          <dd>{String(job.scheduling ?? "Not reported")}</dd>
                        </div>
                        {!!job.lastError && (
                          <div>
                            <dt>Last observation</dt>
                            <dd>{String(job.lastError)}</dd>
                          </div>
                        )}
                      </dl>
                    ) : (
                      <p className="muted small">
                        {ledger?.jobsError ??
                          "The indexer has not recorded this job yet."}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="muted small">
                    A refund job is created when the operator confirms return.
                  </p>
                )}
                <Link href="/proof" className="text-button">
                  See execution evidence <ArrowRight size={14} />
                </Link>
              </section>
            </aside>
          </div>
        </>
      ) : (
        <EmptyState
          title="Rental record unavailable."
          description="A registered rental and a reachable contract are needed to show its actual status."
        />
      )}
    </div>
  );
}
