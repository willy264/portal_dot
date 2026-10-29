"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useApp } from "@/components/providers";
import {
  ChainStatus,
  EmptyState,
  ItemCard,
  PageHeading,
} from "@/components/ui";
import { ScanButton } from "@/components/qr";
export default function Items() {
  const { ledger } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const items = (ledger?.items ?? []).filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter !== "available" || (item.active && !item.rented)),
  );
  return (
    <div className="container page-space">
      <PageHeading
        eyebrow="THE EQUIPMENT LEDGER"
        title="Pick a tool. Make something."
        description="Check the terms, see what’s set aside for repairs, and borrow with confidence."
        action={<ScanButton />}
      />
      <ChainStatus />
      <div className="filter-bar">
        <div className="segmented">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "selected" : ""}
          >
            All equipment
          </button>
          <button
            onClick={() => setFilter("available")}
            className={filter === "available" ? "selected" : ""}
          >
            Available now
          </button>
        </div>
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="Search equipment"
            placeholder="Find your tool…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      {items.length ? (
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            query
              ? "Nothing on this shelf matches."
              : "A little room for something useful."
          }
          description={
            query
              ? "Try another name or show all equipment."
              : "Once an operator registers equipment on Portaldot, its live record will appear here."
          }
        />
      )}
    </div>
  );
}
