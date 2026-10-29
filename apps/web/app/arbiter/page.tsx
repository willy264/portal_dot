"use client";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { useApp } from "@/components/providers";
import {
  ActionButton,
  Badge,
  ChainStatus,
  EmptyState,
  Money,
  PageHeading,
} from "@/components/ui";
import { EvidencePreview } from "@/components/evidence";
import { sameAddress, shortAddress } from "@/lib/format";
export default function Arbiter() {
  const { ledger, wallet, execute } = useApp();
  const assigned = (ledger?.items ?? []).filter((item) =>
    sameAddress(item.arbiter, wallet?.h160),
  );
  const disputes = (ledger?.rentals ?? []).filter(
    (rental) =>
      rental.status === 3 && assigned.some((item) => item.id === rental.itemId),
  );
  const repairs = (ledger?.repairs ?? []).filter(
    (repair) =>
      !repair.paid &&
      !repair.rejected &&
      assigned.some((item) => item.id === repair.itemId),
  );
  return (
    <div className="container page-space">
      <PageHeading
        eyebrow="HUMAN JUDGMENT. CLEAR RULES."
        title="A fair decision keeps things moving."
        description="Review the evidence before approving a deduction or repair. Your wallet signs the decision; the contract follows it."
      />
      <ChainStatus />
      {!wallet && (
        <div className="callout">
          Connect the account assigned as an item’s arbiter to see its pending
          decisions.
        </div>
      )}
      <div className="decision-heading">
        <h2>Deposit deductions</h2>
        <Badge tone={disputes.length ? "orange" : "neutral"}>
          {disputes.length} pending
        </Badge>
      </div>
      {disputes.length ? (
        <div className="decision-grid">
          {disputes.map((rental) => {
            const item = assigned.find((i) => i.id === rental.itemId)!;
            const claim = rental.dispute!;
            return (
              <article className="panel" key={rental.id}>
                <span className="eyebrow">RENTAL #{rental.id}</span>
                <h3>{item.name}</h3>
                <dl className="detail-list">
                  <div>
                    <dt>Proposed reserve deduction</dt>
                    <dd>
                      <Money value={claim.amount} />
                    </dd>
                  </div>
                  <div>
                    <dt>Returned to renter if approved</dt>
                    <dd>
                      <Money
                        value={BigInt(rental.deposit) - BigInt(claim.amount)}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt>Renter’s decision</dt>
                    <dd>
                      {!claim.renterVoted
                        ? "Not yet voted"
                        : claim.renterApproved
                          ? "Approved"
                          : "Rejected"}
                    </dd>
                  </div>
                </dl>
                <EvidencePreview hash={claim.evidenceHash} />
                <p className="small muted">
                  The operator’s proposal is their approval. Your approval
                  resolves the claim immediately. Rejection returns the full
                  deposit only after the renter also rejects.
                </p>
                {claim.arbiterVoted ? (
                  <Badge>Your vote is recorded</Badge>
                ) : (
                  <div className="decision-actions">
                    <ActionButton
                      onAction={() =>
                        execute("voteDispute", [BigInt(rental.id), true])
                      }
                    >
                      <Check size={15} /> Approve deduction
                    </ActionButton>
                    <ActionButton
                      className=""
                      onAction={() =>
                        execute("voteDispute", [BigInt(rental.id), false])
                      }
                    >
                      <X size={15} /> Reject
                    </ActionButton>
                  </div>
                )}
                <Link href={`/rentals/${rental.id}`} className="text-button">
                  Full rental record <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No deposit decisions waiting."
          description="Disputed rentals assigned to your arbiter account will appear here."
        />
      )}
      <div className="decision-heading">
        <h2>Repair approvals</h2>
        <Badge tone={repairs.length ? "orange" : "neutral"}>
          {repairs.length} pending
        </Badge>
      </div>
      {repairs.length ? (
        <div className="decision-grid">
          {repairs.map((repair) => {
            const item = assigned.find((i) => i.id === repair.itemId)!;
            return (
              <article className="panel" key={repair.id}>
                <span className="eyebrow">REPAIR #{repair.id}</span>
                <h3>{item.name}</h3>
                <dl className="detail-list">
                  <div>
                    <dt>Proposed payment</dt>
                    <dd>
                      <Money value={repair.amount} />
                    </dd>
                  </div>
                  <div>
                    <dt>Available reserve</dt>
                    <dd>
                      <Money value={item.reserve} />
                    </dd>
                  </div>
                  <div>
                    <dt>Repairer</dt>
                    <dd className="mono" title={repair.repairer}>
                      {shortAddress(repair.repairer)}
                    </dd>
                  </div>
                </dl>
                <EvidencePreview hash={repair.receiptHash} />
                <p className="small muted">
                  Approval pays this repairer immediately from the item’s
                  reserve. Other proposals may change the available balance; the
                  contract checks it again.
                </p>
                <div className="decision-actions">
                  <ActionButton
                    disabled={BigInt(repair.amount) > BigInt(item.reserve)}
                    onAction={() =>
                      execute("decideRepair", [BigInt(repair.id), true])
                    }
                  >
                    <Check size={15} /> Approve payment
                  </ActionButton>
                  <ActionButton
                    className=""
                    onAction={() =>
                      execute("decideRepair", [BigInt(repair.id), false])
                    }
                  >
                    <X size={15} /> Reject
                  </ActionButton>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="The repair bench is clear."
          description="Proposed repairs for equipment you oversee will appear here with their receipts."
        />
      )}
    </div>
  );
}
