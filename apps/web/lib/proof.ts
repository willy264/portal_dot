export type ProofTransaction = {
  label: string;
  txHash: string | null;
  blockHash: string | null;
  block: string | null;
  status: string;
  eventNames: string[];
};
export type ExpectedFailureProof = ProofTransaction & {
  expectedError: string | null;
  expectedErrorSource: string | null;
  dispatchError: string | null;
  signedBy: string | null;
  value: string | null;
  reserveAssertion: string;
};
export type ProbeRow = {
  id: string;
  label: string;
  status: string;
  summary: string;
};
export function demoStatus(value: unknown): string {
  if (!value || typeof value !== "object") return "Not run";
  const report = value as Record<string, unknown>;
  if (typeof report.status === "string") return report.status;
  if (
    typeof report.completedAt === "string" &&
    Number.isFinite(Date.parse(report.completedAt))
  )
    return "Completed (recorded)";
  if (typeof report.startedAt === "string") return "Started; not completed";
  return "Not run";
}
const hash = (value: unknown) =>
  typeof value === "string" && /^0x[\da-f]{64}$/i.test(value) ? value : null;
const scalar = (value: unknown) =>
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean"
    ? String(value)
    : null;
const labels: Record<string, string> = {
  P1: "Network identity",
  P2: "Runtime integrations",
  P3: "Contract code format",
  P4: "Mapping & payment units",
  P5: "Native scheduling",
  P6: "Evidence storage",
  P7: "Optional EVM writes",
};
export function probeRows(probe: any): ProbeRow[] {
  return Object.entries(labels).map(([id, label]) => {
    const c = probe?.checks?.[id];
    let summary = "No observation recorded.";
    if (c) {
      if (id === "P1")
        summary = `Runtime ${c.runtime?.specName ?? "unreported"} · spec ${c.runtime?.specVersion ?? "unreported"} · chain ${c.chainId ?? c.evmChainId ?? "unreported"}.`;
      else if (id === "P2")
        summary =
          "Runtime metadata was inspected. A present pallet alone does not prove a signed caller can use it.";
      else if (id === "P3")
        summary =
          (c.selectedCodeFormat ?? c.codeFormat)
            ? `${c.selectedCodeFormat ?? c.codeFormat} selected by the recorded runtime simulation.`
            : "See the recorded code-format probe; a dry run is not a deployment.";
      else if (id === "P4")
        summary =
          c.status === "passed"
            ? "A funded value movement was verified. The actual transaction evidence is retained below."
            : (c.caveat ??
              c.reason ??
              "Payment-unit conversion is enabled only after a funded value movement is verified.");
      else if (id === "P6")
        summary =
          c.status === "passed"
            ? `A ${c.bytes ?? "recorded"}-byte native store finalized. Larger thumbnails use the observed runtime limit; persistent copies remain necessary after native retention expires.`
            : (c.selectedModeUntilWriteVerified ??
              c.reason ??
              "Evidence bytes require a verified native store or persistent application storage.");
      else
        summary =
          c.reason ??
          (c.status === "passed"
            ? "A successful execution is recorded in the probe artifact."
            : "Successful execution has not been verified.");
    }
    return { id, label, status: scalar(c?.status) ?? "not-run", summary };
  });
}
/** Publish only evidence identifiers. Never return raw manifests, account files or secret-like fields. */
export function transactionsFrom(
  value: unknown,
  source: string,
): ProofTransaction[] {
  const results: ProofTransaction[] = [];
  const seen = new Set<string>();
  function visit(input: unknown, path: string, depth: number) {
    if (depth > 14 || !input || typeof input !== "object") return;
    if (Array.isArray(input)) {
      input.forEach((entry, i) => visit(entry, `${path} ${i + 1}`, depth + 1));
      return;
    }
    const item = input as Record<string, unknown>;
    const txHash = hash(
      item.txHash ?? item.transactionHash ?? item.extrinsicHash,
    );
    const blockHash = hash(
      item.blockHash ??
        (item.block && typeof item.block === "object"
          ? (item.block as Record<string, unknown>).hash
          : undefined),
    );
    const block = scalar(
      item.blockNumber ??
        (typeof item.block === "object"
          ? (item.block as Record<string, unknown> | null)?.number
          : item.block),
    );
    const label =
      scalar(item.step ?? item.name ?? item.label ?? item.operation) ?? path;
    const status =
      scalar(item.status ?? item.state) ??
      (item.success === true
        ? "success recorded"
        : item.success === false
          ? "failed"
          : "recorded; inspect outcome");
    const events = Array.isArray(item.events) ? item.events : [];
    const eventNames = events
      .flatMap((event) => {
        if (typeof event === "string") return [event];
        if (!event || typeof event !== "object") return [];
        const e = event as Record<string, unknown>;
        const n = scalar(e.eventName ?? e.name ?? e.type);
        return n ? [n] : [];
      })
      .slice(0, 20);
    if (
      txHash ||
      (blockHash && (item.eventName || item.scheduler || eventNames.length))
    ) {
      const key = `${txHash ?? blockHash}:${label}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          label: label.slice(0, 160),
          txHash,
          blockHash,
          block,
          status: status.slice(0, 120),
          eventNames,
        });
      }
    }
    for (const [key, child] of Object.entries(item)) {
      if (
        /seed|mnemonic|secret|private|password|token|credential|account|raw|code|bytecode|metadata|args|input|returnData|data/i.test(
          key,
        )
      )
        continue;
      visit(child, `${path} / ${key}`, depth + 1);
    }
  }
  visit(value, source, 0);
  return results;
}

/** The successful flow excludes assertions and expected rejection receipts. */
export function demoTransactionsFrom(value: any): ProofTransaction[] {
  return transactionsFrom(
    {
      steps: value?.steps,
      transactions: value?.transactions,
      automaticRefund: value?.automaticRefund,
    },
    "Demonstration",
  );
}

function dispatchErrorName(value: unknown, depth = 0): string | null {
  if (depth > 8) return null;
  if (typeof value === "string") return value.slice(0, 240);
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (item.dispatch_error)
    return dispatchErrorName(item.dispatch_error, depth + 1);
  const kind =
    typeof item.type === "string" && /^[A-Za-z_][\w]*$/.test(item.type)
      ? item.type
      : null;
  const nested = dispatchErrorName(item.value, depth + 1);
  return [kind, nested].filter(Boolean).join(".") || null;
}

/** A simulation's decoded error is distinct from the finalized dispatch error. */
export function expectedFailuresFrom(value: any): ExpectedFailureProof[] {
  const input = value?.expectedFailures;
  if (!input || typeof input !== "object") return [];
  return Object.entries(input).flatMap(([key, entry]) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, any>;
    const txHash = hash(item.txHash);
    // A preflight alone is not a signed rejection transaction.
    if (!txHash) return [];
    const blockHash = hash(item.blockHash);
    const block = scalar(item.block);
    const events: string[] = Array.isArray(item.events)
      ? item.events.flatMap((raw: any) => {
          const event = raw?.event ?? raw;
          if (typeof event === "string") return [event];
          const pallet = scalar(event?.type);
          const name = scalar(event?.value?.type);
          return pallet ? [[pallet, name].filter(Boolean).join(".")] : [];
        })
      : [];
    const finalized =
      (item.finalized === true || item.status === "finalized-rejected") &&
      blockHash &&
      Number.isSafeInteger(item.block) &&
      item.block >= 0 &&
      events.filter((event) => event === "System.ExtrinsicFailed").length ===
        1 &&
      !events.includes("System.ExtrinsicSuccess");
    const assertion = value?.assertions?.[key];
    const reserveVerified =
      finalized && assertion?.passed === true && assertion?.txHash === txHash;
    return [
      {
        label: (scalar(item.label) ?? key).slice(0, 160),
        txHash,
        blockHash,
        block,
        status: finalized
          ? "Finalized rejection"
          : "Rejection finality not verified",
        eventNames: events.slice(0, 20),
        expectedError: scalar(item.expectedError),
        expectedErrorSource: scalar(item.expectedErrorSource),
        dispatchError: dispatchErrorName(item.dispatchError),
        signedBy: scalar(item.signedBy),
        value: scalar(item.value),
        reserveAssertion: reserveVerified
          ? "Reserve and repair unchanged (verified)"
          : "Reserve and repair comparison pending",
      },
    ];
  });
}
export function consoleLink(wssUrl: string, blockHash?: string | null) {
  const url = new URL("https://node-console.portaldot.dev/");
  url.searchParams.set("rpc", wssUrl);
  url.hash = blockHash ? `/explorer/query/${blockHash}` : "/explorer";
  return url.toString();
}
