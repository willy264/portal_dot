import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-space">
      <div className="empty-state">
        <span className="eyebrow">404 / NOT ON THE SHELF</span>
        <h1>That page isn’t here.</h1>
        <p>Find the equipment you need in the workshop ledger.</p>
        <Link className="button primary" href="/items">
          Browse equipment
        </Link>
      </div>
    </div>
  );
}
