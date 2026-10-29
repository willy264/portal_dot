"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  RefreshCw,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  amount,
  exactAmount,
  dateTime,
  errorMessage,
  rentalStatuses,
  shortAddress,
} from "@/lib/format";
import type { Item, LedgerEvent, Rental } from "@/lib/types";
import { useApp } from "./providers";
import { consoleLink } from "@/lib/proof";

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Money({
  value,
  decimals = 18,
  className = "",
}: {
  value: string | bigint;
  decimals?: number;
  className?: string;
}) {
  return (
    <span
      className={`money ${className}`}
      title={`${exactAmount(value, decimals)} tPOT`}
    >
      {amount(value, decimals)} <span>tPOT</span>
    </span>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "orange" | "red";
}) {
  return (
    <span className={`badge ${tone}`}>
      <span />
      {children}
    </span>
  );
}
export function ReserveMeter({
  item,
  large = false,
}: {
  item: Pick<Item, "reserveBps" | "reserve">;
  large?: boolean;
}) {
  return (
    <div className={`reserve-meter ${large ? "large" : ""}`}>
      <div className="reserve-meter-label">
        <span>
          <Wrench size={13} /> Repair reserve
        </span>
        <Money value={item.reserve} />
      </div>
      <div
        className="meter-track"
        role="meter"
        aria-label="Rental fee allocated to repairs"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={item.reserveBps / 100}
      >
        <div style={{ width: `${item.reserveBps / 100}%` }} />
        <span className="meter-ticks" />
      </div>
      <div className="meter-caption">
        <span>{item.reserveBps / 100}% of every rental fee</span>
        <ShieldCheck size={12} />
      </div>
    </div>
  );
}
export function EquipmentArt({
  category = "camera",
  className = "",
}: {
  category?: Item["category"];
  className?: string;
}) {
  return (
    <div
      className={`equipment-art ${category} ${className}`}
      aria-hidden="true"
    >
      <span className="art-grid" />
      <svg viewBox="0 0 420 270" fill="none">
        {category === "camera" ? (
          <>
            <ellipse
              cx="218"
              cy="229"
              rx="124"
              ry="15"
              fill="currentColor"
              opacity=".09"
            />
            <path
              d="M89 89h55l15-28h75l14 28h64a17 17 0 0 1 17 17v93a17 17 0 0 1-17 17H89a17 17 0 0 1-17-17v-93a17 17 0 0 1 17-17Z"
              fill="#252725"
            />
            <path
              d="M92 90h37v126H91a19 19 0 0 1-19-19v-88a19 19 0 0 1 20-19Z"
              fill="#363a37"
            />
            <path d="M160 61h73l14 28h-101l14-28Z" fill="#454945" />
            <rect
              x="277"
              y="105"
              width="30"
              height="13"
              rx="3"
              fill="#f3f0e7"
            />
            <rect x="98" y="78" width="23" height="11" rx="4" fill="#252725" />
            <circle
              cx="215"
              cy="153"
              r="73"
              fill="#191b19"
              stroke="#4b4f4a"
              strokeWidth="7"
            />
            <circle
              cx="215"
              cy="153"
              r="54"
              fill="#313b37"
              stroke="#111713"
              strokeWidth="7"
            />
            <circle cx="215" cy="153" r="37" fill="#131e1b" />
            <path
              d="M184 146a32 32 0 0 1 44-21"
              stroke="#8bafa4"
              strokeWidth="7"
              opacity=".6"
              strokeLinecap="round"
            />
            <path
              d="M109 105v91"
              stroke="#555b55"
              strokeWidth="2"
              strokeDasharray="2 4"
            />
            <circle cx="309" cy="133" r="5" fill="#ff6a13" />
          </>
        ) : category === "printer" ? (
          <>
            <ellipse
              cx="212"
              cy="237"
              rx="121"
              ry="14"
              fill="currentColor"
              opacity=".08"
            />
            <path d="M99 49h218v175H99V49Z" stroke="#292e2b" strokeWidth="14" />
            <path d="M120 196h178l18 28H99l21-28Z" fill="#4b514b" />
            <path d="M124 199h172l-9-8H133l-9 8Z" fill="#c6c8ba" />
            <path
              d="M151 50v130m111-130v130M107 108h200"
              stroke="#646c63"
              strokeWidth="6"
            />
            <rect x="181" y="89" width="47" height="39" rx="4" fill="#252b25" />
            <rect x="193" y="128" width="22" height="15" fill="#ff6a13" />
            <path d="m182 190 9-29h30l10 29h-49Z" fill="#ff6a13" />
            <path
              d="M189 170h34m-37 9h40m-42 8h45"
              stroke="#a94004"
              strokeWidth="2"
            />
            <rect
              x="258"
              y="211"
              width="41"
              height="21"
              rx="3"
              fill="#1e241f"
            />
            <rect x="265" y="216" width="19" height="10" fill="#92b9a3" />
          </>
        ) : (
          <>
            <ellipse
              cx="209"
              cy="235"
              rx="108"
              ry="12"
              fill="currentColor"
              opacity=".08"
            />
            <path
              d="M106 64h133l24 15v66l-24 15h-31l10 59h-69l5-74h-44L93 122V83l13-19Z"
              fill="#ff6a13"
            />
            <rect x="251" y="83" width="42" height="57" rx="6" fill="#2a302b" />
            <path d="M293 95h39v31h-39V95Z" fill="#555d54" />
            <path d="M332 105h40v11h-40v-11Z" fill="#858a7d" />
            <path d="M158 146h45l8 61h-58l5-61Z" fill="#333a33" />
            <path d="M140 207h86v24h-86z" fill="#252c26" />
            <path d="M112 82h116v12H112zM112 107h53v12h-53z" fill="#b64104" />
            <path
              d="M161 161h39m-40 10h41m-42 10h44"
              stroke="#646d60"
              strokeWidth="3"
            />
          </>
        )}
      </svg>
      <span className="art-cross top">+</span>
      <span className="art-cross bottom">+</span>
    </div>
  );
}
export function ItemCard({ item }: { item: Item }) {
  return (
    <article className="item-card">
      <Link
        href={`/items/${item.id}`}
        className="item-image-link"
        aria-label={`View ${item.name}`}
      >
        {item.image ? (
          <img className="item-photo" src={item.image} alt={item.name} />
        ) : (
          <EquipmentArt category={item.category} />
        )}
        <span className="item-number mono">
          MM / {item.id.padStart(3, "0")}
        </span>
        <span className="image-arrow">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="item-card-content">
        <div className="item-card-heading">
          <h3>
            <Link href={`/items/${item.id}`}>{item.name}</Link>
          </h3>
          <Badge
            tone={!item.active ? "neutral" : item.rented ? "orange" : "green"}
          >
            {!item.active ? "Paused" : item.rented ? "In use" : "Available"}
          </Badge>
        </div>
        <div className="item-pricing">
          <div>
            <span>Rental fee</span>
            <Money value={item.fee} />
          </div>
          <div>
            <span>Refundable deposit</span>
            <Money value={item.deposit} />
          </div>
        </div>
        <ReserveMeter item={item} />
      </div>
    </article>
  );
}
export function ChainStatus() {
  const { ledger, loading, loadError, refresh } = useApp();
  if (loading)
    return (
      <div className="callout">
        <RefreshCw className="spin" size={16} /> Reading the workshop ledger…
      </div>
    );
  if (loadError)
    return (
      <div className="callout warning" role="alert">
        {loadError}
        <button className="text-button" onClick={() => void refresh()}>
          Retry
        </button>
      </div>
    );
  if (ledger?.state === "unconfigured")
    return (
      <div className="callout">
        <span className="status-dot" />
        <div>
          <strong>The workshop is waiting for deployment.</strong>
          <span>
            Equipment, reserves and completed refunds will appear after a
            verified Portaldot deployment.
          </span>
        </div>
        <Link className="text-button" href="/proof">
          View progress <ArrowRight size={15} />
        </Link>
      </div>
    );
  if (ledger?.state === "error")
    return (
      <div className="callout warning" role="alert">
        <div>
          <strong>Ledger temporarily unavailable</strong>
          <span>{ledger.error}</span>
        </div>
        <button className="text-button" onClick={() => void refresh()}>
          Retry
        </button>
      </div>
    );
  if (ledger && !ledger.config.unitsVerified)
    return (
      <div className="callout warning">
        <strong>Read-only preview</strong>
        <span>
          Payment-unit verification is pending. Wallet transactions are
          disabled.
        </span>
      </div>
    );
  return null;
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Wrench size={27} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function ActionButton({
  children,
  onAction,
  className = "primary",
  disabled = false,
}: {
  children: ReactNode;
  onAction: () => Promise<unknown>;
  className?: string;
  disabled?: boolean;
}) {
  const { busy, writesBlocked } = useApp();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="action-wrap">
      <button
        type="button"
        className={`button ${className}`}
        disabled={disabled || !!busy || writesBlocked}
        onClick={async () => {
          setError(null);
          try {
            await onAction();
          } catch (e) {
            setError(errorMessage(e));
          }
        }}
      >
        {children}
      </button>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export function Countdown({ rental }: { rental: Rental }) {
  const { ledger } = useApp();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const elapsed = ledger
    ? Math.max(0, Math.floor((now - Date.parse(ledger.observedAt)) / 1000))
    : 0;
  const observedNow = (ledger?.blockTimestamp ?? 0) + elapsed;
  const seconds = Math.max(0, rental.refundAt - observedNow);
  const stale = ledger ? now - Date.parse(ledger.observedAt) > 60000 : true;
  if (rental.status !== 2)
    return (
      <Badge tone={rental.status === 3 ? "orange" : "neutral"}>
        {rentalStatuses[rental.status] ?? "Unknown"}
      </Badge>
    );
  return (
    <div className="countdown">
      <Clock3 size={18} />
      <strong className="mono">
        {stale
          ? "Refresh chain time"
          : seconds > 0
            ? `${Math.floor(seconds / 3600)
                .toString()
                .padStart(2, "0")}:${Math.floor((seconds % 3600) / 60)
                .toString()
                .padStart(
                  2,
                  "0",
                )}:${(seconds % 60).toString().padStart(2, "0")}`
            : "Refund can be finalized"}
      </strong>
      <small>{dateTime(rental.refundAt)} · display estimate</small>
    </div>
  );
}
export function History({
  events,
  emptyLabel = "No persisted events yet.",
}: {
  events: LedgerEvent[];
  emptyLabel?: string;
}) {
  const { ledger } = useApp();
  return (
    <section className="history">
      <div className="section-heading">
        <h2>Item history</h2>
        <span className="mono small">{events.length} RECORDS</span>
      </div>
      <p className="muted small">{ledger?.historyStatus}</p>
      {events.length ? (
        <ol className="timeline">
          {[...events].reverse().map((event) => (
            <li key={event.id}>
              <span className="timeline-icon">
                <Check size={12} />
              </span>
              <div>
                <strong>
                  {event.name.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </strong>
                <p className="mono small">
                  Block {event.blockNumber} ·{" "}
                  {event.transactionHash
                    ? shortAddress(event.transactionHash, 10)
                    : `Native block event ${event.eventIndex ?? ""}`}
                </p>
                <a
                  className="text-button"
                  href={consoleLink(
                    ledger?.config.wssUrl ?? "wss://test-node-v3.portaldot.dev",
                    event.blockHash,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Inspect block <ArrowUpRight size={11} />
                </a>
                <details>
                  <summary>Recorded details</summary>
                  <dl className="event-details">
                    {Object.entries(event.args).map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd className="hash">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-inline">{emptyLabel}</p>
      )}
    </section>
  );
}
