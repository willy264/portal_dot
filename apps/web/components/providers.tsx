"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  InjectedExtension,
  InjectedPolkadotAccount,
} from "polkadot-api/pjs-signer";
import { encodeFunctionData } from "viem";
import { meterMendAbi } from "@/lib/abi";
import { request } from "@/lib/request";
import { errorMessage } from "@/lib/format";
import { chainAdapter, chainSigner } from "@/lib/wallet-chain";
import {
  retainTransaction,
  browserIntentJournal,
  canonicalAccount,
  assertAccountClear,
  isPendingIntent,
  submitContractIntent,
  applyTransactionReconciliation,
  withAccountWriteLock,
  verifyBrowserTransactionStorage,
  UnknownTransactionError,
  type ContractIntent,
} from "@/lib/transaction-journal";
import {
  browserEvidenceJournal,
  submitNativeEvidence,
  type NativeEvidenceProof,
} from "@/lib/native-evidence";
import { hashBytes } from "@/lib/evidence";
import type { Hex, Ledger, TxReceipt, WalletIdentity } from "@/lib/types";

type ActionArgs = {
  registerItem: [Hex, bigint, bigint, number, number, string];
  updateItem: [bigint, bigint, bigint, boolean];
  rent: [bigint];
  markReturned: [bigint, Hex];
  finalizeRefund: [bigint];
  openDispute: [bigint, bigint, Hex];
  voteDispute: [bigint, boolean];
  proposeRepair: [bigint, Hex, bigint, Hex];
  decideRepair: [bigint, boolean];
  transferItem: [bigint, Hex];
  withdrawIncome: [];
};
type AppContextValue = {
  ledger: Ledger | null;
  loading: boolean;
  loadError: string | null;
  refresh: () => Promise<void>;
  wallet: WalletIdentity | null;
  accounts: InjectedPolkadotAccount[];
  extensions: string[];
  discoverWallets: () => Promise<void>;
  connect: (name: string) => Promise<void>;
  selectAccount: (address: string) => Promise<void>;
  disconnect: () => void;
  activate: () => Promise<void>;
  execute: <N extends keyof ActionArgs>(
    name: N,
    args: ActionArgs[N],
    value?: bigint,
  ) => Promise<TxReceipt>;
  storeNativeEvidence: (
    hash: Hex,
    bytes: Uint8Array,
  ) => Promise<NativeEvidenceProof>;
  pendingIntents: ContractIntent[];
  journalError: string | null;
  writesBlocked: boolean;
  checkStorage: () => void;
  recheckTransaction: (id: string) => Promise<void>;
  busy: string | null;
  notice: string | null;
  failure: string | null;
  clearNotice: () => void;
  lastReceipt: TxReceipt | null;
};
const AppContext = createContext<AppContextValue | null>(null);
export function Providers({ children }: { children: ReactNode }) {
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletIdentity | null>(null);
  const [accounts, setAccounts] = useState<InjectedPolkadotAccount[]>([]);
  const [extensions, setExtensions] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<TxReceipt | null>(null);
  const [intents, setIntents] = useState<ContractIntent[]>([]);
  const [journalError, setJournalError] = useState<string | null>(null);
  const syncJournal = useCallback(() => {
    try {
      const stored = browserIntentJournal.list();
      setIntents((previous) =>
        stored.map((record) => {
          const memory = previous.find((item) => item.id === record.id);
          return isPendingIntent(record) && !record.txHash && memory?.txHash
            ? memory
            : record;
        }),
      );
    } catch (error) {
      setJournalError(errorMessage(error));
    }
  }, []);
  const updateIntent = useCallback((record: ContractIntent) => {
    setIntents((previous) => [
      ...previous.filter((item) => item.id !== record.id),
      record,
    ]);
  }, []);
  useEffect(() => {
    syncJournal();
    const listener = () => syncJournal();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [syncJournal]);
  const transactionLocked = useRef(false);
  const currentAccount = useRef<InjectedPolkadotAccount | null>(null);
  const connected = useRef<InjectedExtension | null>(null);
  const unsub = useRef<(() => void) | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    try {
      const data = await request<Ledger>("/api/ledger", {
        signal: controller.signal,
      });
      setLedger(data);
      setLoadError(null);
    } catch (error) {
      if (!controller.signal.aborted) setLoadError(errorMessage(error));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 15000);
    return () => {
      clearInterval(timer);
      requestController.current?.abort();
    };
  }, [refresh]);
  const loadAccount = useCallback(
    async (account: InjectedPolkadotAccount) => {
      currentAccount.current = account;
      setWallet({
        address: account.address,
        name: account.name,
        h160: null,
        mapped: null,
        autoMap: null,
        nativeBalance: null,
      });
      if (!ledger) return;
      try {
        const chain = await chainAdapter(ledger.config);
        const state = await chain.getAccountState(account.address);
        if (currentAccount.current?.address === account.address)
          setWallet({
            address: account.address,
            name: account.name,
            h160: state.h160,
            mapped: state.mapped,
            autoMap: state.autoMap,
            nativeBalance: state.nativeBalance.toString(),
          });
      } catch (error) {
        setFailure(`Account details unavailable: ${errorMessage(error)}`);
      }
    },
    [ledger],
  );
  const disconnect = useCallback(() => {
    unsub.current?.();
    unsub.current = null;
    connected.current?.disconnect();
    connected.current = null;
    currentAccount.current = null;
    setAccounts([]);
    setWallet(null);
  }, []);
  useEffect(
    () => () => {
      unsub.current?.();
      connected.current?.disconnect();
    },
    [],
  );
  async function discoverWallets() {
    setFailure(null);
    const { getInjectedExtensions } = await import("polkadot-api/pjs-signer");
    const names = getInjectedExtensions();
    setExtensions(names);
    if (!names.length)
      setFailure(
        "No compatible wallet was found. Open this page in a SubWallet or Talisman browser, or install a Polkadot.js-compatible extension.",
      );
  }
  async function connect(name: string) {
    setBusy("Connecting wallet");
    setFailure(null);
    try {
      const { connectInjectedExtension } =
        await import("polkadot-api/pjs-signer");
      const extension = await connectInjectedExtension(name, "MeterMend");
      disconnect();
      connected.current = extension;
      const list = extension.getAccounts();
      setAccounts(list);
      unsub.current = extension.subscribe((next) => {
        setAccounts(next);
        if (
          currentAccount.current &&
          !next.some((a) => a.address === currentAccount.current?.address)
        ) {
          currentAccount.current = null;
          setWallet(null);
        }
      });
      if (list[0]) await loadAccount(list[0]);
      else
        setFailure(
          "The wallet did not share an account. Allow an account in the wallet and reconnect.",
        );
    } catch (error) {
      setFailure(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }
  async function selectAccount(address: string) {
    const account = accounts.find((a) => a.address === address);
    if (account) await loadAccount(account);
  }
  async function activate() {
    if (!currentAccount.current || !ledger)
      throw new Error("Connect a wallet first.");
    setBusy("Confirm account activation in your wallet");
    setFailure(null);
    try {
      assertAccountClear(
        browserIntentJournal,
        canonicalAccount(currentAccount.current.address),
        ledger.config.chainId,
      );
      verifyBrowserTransactionStorage();
      const chain = await chainAdapter(ledger.config);
      await chain.ensureMapped(chainSigner(currentAccount.current));
      await loadAccount(currentAccount.current);
      setNotice("Account activation confirmed on Portaldot.");
    } catch (error) {
      setFailure(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }
  async function execute<N extends keyof ActionArgs>(
    name: N,
    args: ActionArgs[N],
    value = 0n,
  ): Promise<TxReceipt> {
    if (busy || transactionLocked.current)
      throw new Error("Wait for the current transaction to finish.");
    if (!currentAccount.current || !wallet)
      throw new Error("Connect a wallet before continuing.");
    if (!ledger || ledger.state !== "ready" || !ledger.config.meterMend)
      throw new Error("A verified deployment is not available.");
    if (!ledger.config.unitsVerified)
      throw new Error(
        "Funded unit verification is pending. Transactions remain disabled.",
      );
    if (wallet.mapped !== true)
      throw new Error(
        wallet.autoMap
          ? "Fund this native account and wait for activation before using the workshop."
          : "Activate this account before using the workshop.",
      );
    const submittingAccount = currentAccount.current;
    transactionLocked.current = true;
    setFailure(null);
    setNotice(null);
    setBusy("Check the transaction in your wallet");
    try {
      const key = canonicalAccount(submittingAccount.address);
      assertAccountClear(browserIntentJournal, key, ledger.config.chainId);
      verifyBrowserTransactionStorage();
      const receipt = await withAccountWriteLock(key, async () => {
        assertAccountClear(browserIntentJournal, key, ledger.config.chainId);
        const chain = await chainAdapter(ledger.config);
        const head = await chain.getFinalizedHead();
        const data = encodeFunctionData({
          abi: meterMendAbi,
          functionName: name,
          args,
        } as Parameters<typeof encodeFunctionData>[0]);
        const now = new Date().toISOString();
        const intent: ContractIntent = {
          id: crypto.randomUUID(),
          chainId: ledger.config.chainId,
          account: submittingAccount.address,
          accountKey: key,
          action: name,
          target: ledger.config.meterMend!,
          data,
          value: value.toString(),
          fromBlock: head.number,
          nextBlock: head.number,
          state: "preparing",
          createdAt: now,
          updatedAt: now,
        };
        return submitContractIntent({
          journal: browserIntentJournal,
          intent,
          onRecord: updateIntent,
          prepare: () =>
            chain.buildReviveCall({
              signer: chainSigner(submittingAccount),
              to: intent.target,
              data,
              value,
              abi: meterMendAbi,
            }),
          submit: (prepared, onStatus) =>
            chain.submitAndWatch(prepared.tx, chainSigner(submittingAccount), {
              onStatus: (event) => {
                onStatus({ txHash: event.txHash as Hex, stage: event.type });
                setBusy(
                  event.type === "finalized"
                    ? "Transaction finalized; refreshing the ledger"
                    : "Transaction submitted; waiting for finality",
                );
              },
            }),
        });
      });
      setLastReceipt(receipt);
      setNotice(`Transaction finalized: ${receipt.txHash}`);
      await refresh();
      if (currentAccount.current?.address === submittingAccount.address)
        await loadAccount(submittingAccount);
      syncJournal();
      return receipt;
    } catch (error) {
      if (error instanceof UnknownTransactionError) updateIntent(error.intent);
      setFailure(errorMessage(error));
      try {
        verifyBrowserTransactionStorage();
      } catch (storageError) {
        setJournalError(errorMessage(storageError));
      }
      throw error;
    } finally {
      transactionLocked.current = false;
      setBusy(null);
    }
  }
  async function storeNativeEvidence(
    hash: Hex,
    bytes: Uint8Array,
  ): Promise<NativeEvidenceProof> {
    if (busy || transactionLocked.current)
      throw new Error("Wait for the current transaction to finish.");
    const account = currentAccount.current;
    if (!account || !wallet)
      throw new Error("Connect a wallet before storing evidence on Portaldot.");
    assertAccountClear(
      browserIntentJournal,
      canonicalAccount(account.address),
      ledger?.config.chainId ?? 420420777,
    );
    verifyBrowserTransactionStorage();
    if (!ledger?.config.nativeEvidence)
      throw new Error(
        "Native evidence storage has not passed its funded probe.",
      );
    if (
      bytes.length > ledger.config.nativeEvidence.maxBytes ||
      bytes.length === 0
    )
      throw new Error(
        "The prepared photo exceeds the verified thumbnail limit.",
      );
    if ((await hashBytes(new Uint8Array(bytes).buffer)) !== hash)
      throw new Error("Prepared evidence bytes changed before submission.");
    transactionLocked.current = true;
    setFailure(null);
    setBusy("Approve storing this photo on Portaldot");
    try {
      const chain = await chainAdapter(ledger.config);
      const head = await chain.getFinalizedHead();
      const proof = await submitNativeEvidence({
        hash,
        account: account.address,
        fromBlock: head.number,
        journal: browserEvidenceJournal,
        submit: async (onHash) => {
          const result = await chain.storeEvidence({
            signer: chainSigner(account),
            bytes,
            onStatus: (event) => {
              onHash(event.txHash as Hex);
              retainTransaction({
                txHash: event.txHash,
                action: "TransactionStorage.store",
                account: account.address,
                status: event.type,
              });
              setBusy("Photo submitted; waiting for finalized storage");
            },
          });
          return result;
        },
      });
      retainTransaction({
        ...proof,
        action: "TransactionStorage.store",
        account: account.address,
        status: "finalized",
      });
      setNotice(
        `Photo stored in block ${proof.block}, storage index ${proof.storageIndex}.`,
      );
      return proof;
    } catch (error) {
      setFailure(errorMessage(error));
      throw error;
    } finally {
      transactionLocked.current = false;
      setBusy(null);
    }
  }
  function checkStorage() {
    try {
      verifyBrowserTransactionStorage();
      for (const record of intents) {
        if (!record.txHash) continue;
        const stored = browserIntentJournal
          .list()
          .find((item) => item.id === record.id);
        if (stored && isPendingIntent(stored) && !stored.txHash)
          browserIntentJournal.put(record);
      }
      setJournalError(null);
      syncJournal();
    } catch (error) {
      setJournalError(errorMessage(error));
    }
  }
  async function recheckTransaction(id: string) {
    if (busy || transactionLocked.current) return;
    const record = intents.find((item) => item.id === id);
    if (!record?.txHash || !ledger) {
      setFailure(
        "A retained transaction hash and network configuration are required to check finality.",
      );
      return;
    }
    transactionLocked.current = true;
    setBusy("Checking the original transaction; no new write is submitted");
    setFailure(null);
    try {
      const next = await withAccountWriteLock(record.accountKey, async () => {
        const stored = browserIntentJournal
          .list()
          .find((item) => item.id === record.id);
        if (stored && !isPendingIntent(stored)) return stored;
        const latest = stored?.txHash ? stored : record;
        if (stored && !stored.txHash) browserIntentJournal.put(latest);
        const chain = await chainAdapter(ledger.config);
        const result = await chain.reconcileTransaction({
          txHash: latest.txHash!,
          fromBlock: latest.nextBlock,
        });
        return applyTransactionReconciliation(
          browserIntentJournal,
          latest,
          result,
        );
      });
      updateIntent(next);
      if (next.state === "confirmed" || next.state === "failed") {
        setNotice(next.reason ?? "Finalized outcome recorded.");
        await refresh();
      } else
        setNotice(
          "The original outcome is still uncertain. Further writes remain blocked for this account.",
        );
    } catch (error) {
      setFailure(errorMessage(error));
    } finally {
      transactionLocked.current = false;
      setBusy(null);
    }
  }
  const pendingIntents = intents.filter(isPendingIntent);
  let writesBlocked = !!journalError;
  if (wallet) {
    try {
      const key = canonicalAccount(wallet.address);
      writesBlocked ||= pendingIntents.some(
        (intent) =>
          intent.accountKey === key &&
          intent.chainId === (ledger?.config.chainId ?? 420420777),
      );
    } catch {
      writesBlocked = true;
    }
  }
  return (
    <AppContext.Provider
      value={{
        ledger,
        loading,
        loadError,
        refresh,
        wallet,
        accounts,
        extensions,
        discoverWallets,
        connect,
        selectAccount,
        disconnect,
        activate,
        execute,
        storeNativeEvidence,
        pendingIntents,
        journalError,
        writesBlocked,
        checkStorage,
        recheckTransaction,
        busy,
        notice,
        failure,
        clearNotice: () => {
          setNotice(null);
          setFailure(null);
        },
        lastReceipt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("MeterMend provider is missing.");
  return context;
}
