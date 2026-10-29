"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  Moon,
  Sun,
  Wallet,
  X,
  LoaderCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useApp } from "./providers";
import { useDialog } from "./use-dialog";
import { TransactionRecovery } from "./transaction-recovery";
import { amount, shortAddress } from "@/lib/format";

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="MeterMend home">
      <img
        className="brand-image"
        src="/brand/logo.svg"
        width="787"
        height="200"
        alt="MeterMend"
      />
      <img
        className="brand-image brand-image-reversed"
        src="/brand/logo-reversed.svg"
        width="787"
        height="200"
        alt="MeterMend"
      />
    </Link>
  );
}
const links = [
  ["/items", "Equipment"],
  ["/operator", "Workshop"],
  ["/arbiter", "Decisions"],
  ["/proof", "Proof"],
] as const;
export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const app = useApp();
  const closeWallet = useCallback(() => setWalletOpen(false), []);
  useDialog(walletOpen, closeWallet);
  useEffect(() => {
    const value = localStorage.getItem("metermend-theme") === "dark";
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
  }, []);
  useEffect(() => {
    setMenu(false);
  }, [pathname]);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("metermend-theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }
  async function openWallet() {
    setWalletOpen(true);
    await app.discoverWallets();
  }
  return (
    <>
      <div className="network-strip">
        <span>
          <span
            className={`status-dot ${app.ledger?.state === "ready" ? "live" : ""}`}
          />
          {app.ledger?.config.network ?? "Portaldot V3 testnet"}
        </span>
        <Link href="/proof">
          Built to keep things in use <ArrowUpRight size={12} />
        </Link>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav
            className={menu ? "main-nav open" : "main-nav"}
            aria-label="Main navigation"
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={pathname.startsWith(href) ? "active" : ""}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-button"
              onClick={toggleTheme}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="button wallet-button"
              onClick={() => void openWallet()}
            >
              <Wallet size={16} />
              <span>
                {app.wallet
                  ? shortAddress(app.wallet.address, 4)
                  : "Connect wallet"}
              </span>
              <ChevronDown size={14} />
            </button>
            <button
              className="icon-button mobile-menu"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <TransactionRecovery />
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div>
          <Logo />
          <p>Good equipment deserves a longer story.</p>
        </div>
        <div className="footer-links">
          <Link href="/proof">
            Verify the work <ArrowUpRight size={14} />
          </Link>
          <span>Every rental funds its next repair.</span>
          <span className="mono small">PORTALDOT HACKER HOUSE / 2026</span>
        </div>
      </footer>
      {(app.busy || app.failure || app.notice) && (
        <div
          className={`toast ${app.failure ? "toast-error" : ""}`}
          role={app.failure ? "alert" : "status"}
        >
          {app.busy ? (
            <LoaderCircle className="spin" size={18} />
          ) : app.failure ? (
            <span aria-hidden="true">!</span>
          ) : (
            <Check size={18} />
          )}
          <div>
            {app.busy ?? app.failure ?? app.notice}
            {app.busy && (
              <small>Do not close this page or submit a duplicate.</small>
            )}
          </div>
          {!app.busy && (
            <button
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={app.clearNotice}
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
      {walletOpen && (
        <div className="modal-backdrop" onClick={() => setWalletOpen(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <h2 id="wallet-title">Your workshop wallet</h2>
              <button
                className="icon-button"
                aria-label="Close wallet"
                onClick={() => setWalletOpen(false)}
              >
                <X />
              </button>
            </div>
            <p className="muted">
              Use a SubWallet, Talisman or Polkadot.js-compatible account on
              Portaldot V3.
            </p>
            {app.wallet ? (
              <>
                <label className="field">
                  Account
                  <select
                    disabled={!!app.busy}
                    value={app.wallet.address}
                    onChange={(e) => void app.selectAccount(e.target.value)}
                  >
                    {app.accounts.map((a) => (
                      <option key={a.address} value={a.address}>
                        {a.name ?? "Account"} · {shortAddress(a.address)}
                      </option>
                    ))}
                  </select>
                </label>
                <dl className="detail-list">
                  <div>
                    <dt>Balance</dt>
                    <dd className="mono">
                      {app.wallet.nativeBalance === null
                        ? "Unavailable"
                        : `${amount(app.wallet.nativeBalance, 14)} tPOT`}
                    </dd>
                  </div>
                  <div>
                    <dt>SS58 account</dt>
                    <dd className="hash">{app.wallet.address}</dd>
                  </div>
                  <div>
                    <dt>Runtime contract address</dt>
                    <dd className="hash">
                      {app.wallet.h160 ?? "Waiting for the runtime"}
                    </dd>
                  </div>
                  <div>
                    <dt>Activation</dt>
                    <dd>
                      {app.wallet.mapped === null
                        ? "Checking"
                        : app.wallet.mapped
                          ? "Active"
                          : "Required"}
                    </dd>
                  </div>
                </dl>
                {app.wallet.mapped === false && app.wallet.autoMap === true && (
                  <div className="callout">
                    <div>
                      <strong>Fund this account to activate</strong>
                      <span>
                        Portaldot V3 automatically maps funded native accounts.
                        Ask the organizer for test funds, then check your
                        account again.
                      </span>
                      <button
                        className="text-button"
                        disabled={!!app.busy}
                        onClick={() =>
                          void app.selectAccount(app.wallet!.address)
                        }
                      >
                        <RefreshCw size={14} /> Check account
                      </button>
                    </div>
                  </div>
                )}
                {app.wallet.mapped === false &&
                  app.wallet.autoMap === false && (
                    <button
                      className="button primary full"
                      disabled={!!app.busy}
                      onClick={() => void app.activate()}
                    >
                      Activate account <ArrowRight size={17} />
                    </button>
                  )}
                <button
                  className="button full"
                  disabled={!!app.busy}
                  onClick={app.disconnect}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="wallet-options">
                {app.extensions.length ? (
                  app.extensions.map((name) => (
                    <button
                      key={name}
                      className="button full"
                      disabled={!!app.busy}
                      onClick={() => void app.connect(name)}
                    >
                      {name}
                      <ArrowRight size={18} />
                    </button>
                  ))
                ) : (
                  <p className="callout">
                    No wallet detected. On mobile, open this page inside your
                    wallet’s browser.
                  </p>
                )}
                <button
                  className="text-button"
                  onClick={() => void app.discoverWallets()}
                >
                  <RefreshCw size={14} /> Check again
                </button>
              </div>
            )}
            <p className="small muted">
              Only testnet tPOT is used. Wallet approval is required for every
              transaction. Test funds come from the organizer’s Discord process.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
