"use client";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useApp } from "@/components/providers";
import {
  ChainStatus,
  EmptyState,
  EquipmentArt,
  ItemCard,
  Money,
} from "@/components/ui";
import { ScanButton } from "@/components/qr";
const steps = [
  [
    "Make it available",
    "The operator lists an item, sets the terms and chooses a neutral arbiter.",
  ],
  [
    "Scan. Rent. Get to work.",
    "One payment covers the rental fee and your refundable deposit.",
  ],
  [
    "Build its repair reserve",
    "A fixed share of every fee stays with that item for future repairs.",
  ],
  [
    "Bring it back",
    "The operator confirms the physical return with a photo and a clear deadline.",
  ],
  [
    "Return the deposit",
    "After the dispute window, the refund can be finalized by anyone or an executor.",
  ],
  [
    "Keep it in use",
    "The operator proposes a repair. The arbiter approves payment from the item’s reserve.",
  ],
];
export default function Home() {
  const { ledger } = useApp();
  const ready = ledger?.state === "ready";
  const total =
    ledger?.items.reduce((sum, item) => sum + BigInt(item.reserve), 0n) ?? 0n;
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-square" /> THE WORKSHOP THAT LOOKS AFTER
            ITSELF
          </span>
          <h1>
            Borrow today.
            <br />
            Build for{" "}
            <span className="accent-word">
              tomorrow.
              <svg viewBox="0 0 430 18" aria-hidden="true">
                <path d="M3 12C130 2 280 2 425 7" />
              </svg>
            </span>
          </h1>
          <p>
            A camera. A drill. A 3D printer.
            <br />
            Every rental puts something back into the equipment you share — a
            repair reserve that stays with it.
          </p>
          <div className="hero-actions">
            <Link href="/items" className="button primary">
              Find your next tool <ArrowRight size={18} />
            </Link>
            <ScanButton />
          </div>
          <div className="hero-assurance">
            <ShieldCheck size={17} />
            <span>Clear deposits. Human decisions. Verifiable records.</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-note mono">
            BUILT TO BE USED.
            <br />
            FUNDED TO LAST.
          </div>
          <EquipmentArt category="camera" className="hero-equipment" />
          <div className="reserve-ticket">
            <div className="ticket-header">
              <span className="eyebrow">THE REPAIR RESERVE</span>
              <Wrench size={18} />
            </div>
            <div className="ticket-value">
              <strong>
                20<span>%</span>
              </strong>
              <span>
                of each rental fee
                <br />
                set aside for repairs
              </span>
            </div>
            <div className="hero-ruler">
              {Array.from({ length: 25 }, (_, i) => (
                <i key={i} className={i < 5 ? "filled" : ""} />
              ))}
            </div>
            <div className="ticket-footer">
              <span>
                <Check size={12} /> Stays with the item
              </span>
              <span className="mono">ILLUSTRATIVE SPLIT</span>
            </div>
          </div>
          <span className="vertical-caption mono">
            SHARED EQUIPMENT / SHARED CARE
          </span>
        </div>
      </section>
      <section className="metrics-band">
        <div className="container metrics">
          <div>
            <span className="eyebrow">ON THE SHELF</span>
            <strong className="mono">
              {ready ? String(ledger.items.length).padStart(2, "0") : "—"}
            </strong>
            <span>registered items</span>
          </div>
          <div>
            <span className="eyebrow">SET ASIDE FOR WHAT’S NEXT</span>
            <strong>
              {ready ? (
                <Money value={total} />
              ) : (
                <span className="mono">—</span>
              )}
            </strong>
            <span>in item repair reserves</span>
          </div>
          <div>
            <span className="eyebrow">DEPOSITS RETURNED AUTOMATICALLY</span>
            <strong className="mono">
              {ready && ledger.automaticRefundCount !== null
                ? String(ledger.automaticRefundCount).padStart(2, "0")
                : "—"}
            </strong>
            <span>
              {ready && ledger.automaticRefundCount === null
                ? "awaiting verified executor records"
                : "verified automatic refunds"}
            </span>
          </div>
          <Link href="/proof" className="metric-proof">
            Every number
            <br />
            has a record.
            <ArrowUpRight size={23} />
          </Link>
        </div>
      </section>
      <section className="container section-space">
        <ChainStatus />
        <div className="section-heading shelf-heading">
          <div>
            <span className="eyebrow">GOOD TOOLS. MORE POSSIBILITIES.</span>
            <h2>What will you make next?</h2>
          </div>
          <Link className="text-button" href="/items">
            The whole workshop <ArrowRight size={17} />
          </Link>
        </div>
        {ledger?.items.length ? (
          <div className="item-grid">
            {ledger.items.slice(0, 3).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="The next project starts here."
            description="Registered equipment will appear with live availability, rental terms and its own repair reserve."
            action={
              <Link className="button" href="/operator">
                Set up your workshop <ArrowRight size={16} />
              </Link>
            }
          />
        )}
      </section>
      <section className="how-section">
        <div className="container">
          <div className="how-intro">
            <div>
              <span className="eyebrow">A BETTER CYCLE</span>
              <h2>
                Use it.
                <br />
                Care for it.
                <br />
                <span>Pass it on.</span>
              </h2>
            </div>
            <p>
              Equipment should get a second act, a third act, and a hundred
              projects after that. Here’s how each rental helps make that
              happen.
              <ArrowDown size={24} />
            </p>
          </div>
          <div className="steps-grid">
            {steps.map(([title, description], index) => (
              <article key={title}>
                <span className="step-number mono">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container closing-cta">
        <span className="eyebrow">FOR THE THINGS WE SHARE</span>
        <h2>
          Less “who pays for this?”
          <br />
          More getting back to work.
        </h2>
        <Link href="/operator" className="button primary">
          Open your workshop <ArrowRight size={18} />
        </Link>
        <p className="small muted">
          Made for makerspaces, campus labs and community tool libraries.
        </p>
      </section>
    </>
  );
}
