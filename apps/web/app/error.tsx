"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page-space">
      <div className="empty-state">
        <h1>The workshop could not load.</h1>
        <p>
          Your funds remain governed by the contracts. Retry the page before
          submitting another transaction.
        </p>
        <button className="button primary" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
