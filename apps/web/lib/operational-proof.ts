export const KEEPER_EXPLANATION =
  "Refunds execute automatically via Cronpot; execution is permissionless and our keeper runs it.";

export type OperationalCard = {
  title: string;
  status: string;
  observedAt: string | null;
  fields: { label: string; value: string }[];
};
type RecordValue = Record<string, any> | null | undefined;
const text = (value: unknown) =>
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean"
    ? String(value)
    : "Not recorded";
const hash = (value: unknown) =>
  typeof value === "string" && /^0x[\da-f]{64}$/i.test(value)
    ? value
    : "Not recorded";
function publicUrl(value: unknown) {
  if (typeof value !== "string") return "Not recorded";
  try {
    const url = new URL(value);
    if (
      !["https:", "wss:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return "Not recorded";
    return url.origin + url.pathname;
  } catch {
    return "Not recorded";
  }
}
function card(
  title: string,
  record: RecordValue,
  fields: [string, unknown][],
): OperationalCard {
  return {
    title,
    status:
      typeof record?.status === "string"
        ? record.status
        : record
          ? "Observation recorded"
          : "Pending; no evidence recorded",
    observedAt:
      typeof record?.observedAt === "string" ? record.observedAt : null,
    fields: fields.map(([label, value]) => ({ label, value: text(value) })),
  };
}

/** Keep pending submissions separate from finalized receipts; publish only selected public fields. */
export function operationalCards(input: {
  deploymentStatus?: RecordValue;
  chainStatus?: RecordValue;
  rpcDiscovery?: RecordValue;
  hosting?: RecordValue;
  notifications?: RecordValue;
  submission?: RecordValue;
  refundCalibration?: RecordValue;
  demo?: RecordValue;
  executorHealth?: RecordValue;
}): OperationalCard[] {
  const pending = input.deploymentStatus;
  const observations = input.chainStatus?.observations;
  const latest = Array.isArray(observations)
    ? observations.at(-1)
    : input.chainStatus;
  const chain = latest ?? pending;
  const account = chain?.account ?? pending?.account;
  const cards: OperationalCard[] = [
    card("Application deployment observation", pending, [
      ["Transaction", hash(pending?.txHash)],
      [
        "Finalized outcome",
        pending?.inclusion?.finalizedOutcome ?? pending?.journal?.state,
      ],
      ["In this node's pending pool", pending?.inclusion?.pendingPool?.matched],
      ["Original nonce", pending?.journal?.nonce],
      ["Submission start block", pending?.journal?.startBlock],
    ]),
    card("Observed V3 node health", chain, [
      ["Endpoint", publicUrl(chain?.endpoint ?? pending?.endpoint)],
      ["Best block", chain?.best?.number],
      ["Finalized block", chain?.finalized?.number],
      ["Peers", chain?.health?.peers],
      ["Syncing", chain?.health?.isSyncing],
      ["Deployer nonce at finality", account?.finalizedNonce],
      ["Deployer nonce at best block", account?.bestNonce],
      ["Account next index (includes pool)", account?.nextIndex],
    ]),
    card("Alternative RPC discovery", input.rpcDiscovery, [
      ["Finding", input.rpcDiscovery?.summary],
      ["Verified alternate", publicUrl(input.rpcDiscovery?.verifiedEndpoint)],
      [
        "Required genesis",
        "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd",
      ],
    ]),
    card("Refund diagnosis and recovery", input.refundCalibration, [
      ["Finding", input.refundCalibration?.summary],
      [
        "Transactions submitted by calibration",
        input.refundCalibration?.signedTransactions,
      ],
      [
        "Contracts deployed by calibration",
        input.refundCalibration?.contractsDeployed,
      ],
      ["Live corrected refund", "Pending deployment and live demonstration"],
      ["Direct keeper refund", input.demo?.directRefund?.txHash ? hash(input.demo.directRefund.txHash) : "Not recorded"],
      ["Direct refund block", input.demo?.directRefund?.block],
      ["Recovery budget spent (tPOT)", input.demo?.continuation?.conservativeSpentTPOT],
      ["Direct recovery status", input.demo?.continuation?.status],
    ]),
    card("Persistent worker and evidence hosting", input.hosting, [
      ["Finding", input.hosting?.summary],
      [
        "Public service",
        publicUrl(input.hosting?.publicUrl ?? input.hosting?.endpoint),
      ],
      ["Persistent storage verified", input.hosting?.persistenceVerified],
      ["Always on", input.hosting?.constraints?.alwaysOn],
      ["Signing", input.hosting?.constraints?.signing],
      ["Evidence uploads", input.hosting?.constraints?.evidenceUploads],
    ]),
    card("Telegram delivery", input.notifications, [
      ["Finding", input.notifications?.summary],
      [
        "Delivered event types",
        Array.isArray(input.notifications?.deliveredEvents)
          ? input.notifications.deliveredEvents
              .filter((entry: unknown) => typeof entry === "string")
              .join(", ") || "None recorded"
          : "None recorded",
      ],
      ["DeBox", "Target integration; live delivery not demonstrated"],
    ]),
    card("Submission materials", input.submission, [
      ["Finding", input.submission?.summary],
      ["Deck", input.submission?.deck?.status],
      [
        "Video",
        input.submission?.video?.status ??
          "Pending; no uploaded video recorded",
      ],
      ["Internal deadline", "November 5, 2026, 22:00 WAT (21:00 UTC)"],
    ]),
  ];
  if (input.executorHealth)
    cards.push(
      card("Executor health response", input.executorHealth, [
        ["Configured", input.executorHealth.configured],
        ["Execution mode", input.executorHealth.mode],
        [
          "Writes enabled",
          input.executorHealth.writesEnabled ?? "Not reported",
        ],
        ["Read only", input.executorHealth.readOnly ?? "Not reported"],
        ["Storage", input.executorHealth.storageMode ?? "Not reported"],
        ["Indexed through block", input.executorHealth.cursor?.block],
        ["History gap", input.executorHealth.gap ?? "None reported"],
        ["Service error", input.executorHealth.error ?? "None reported"],
      ]),
    );
  return cards;
}

export function hasGeneratedDeck(
  submission: RecordValue,
  fileExists: boolean,
): boolean {
  return fileExists && submission?.deck?.status === "generated";
}

export function executorJobs(value: unknown) {
  const jobs =
    value && typeof value === "object" && "jobs" in value ? value.jobs : null;
  if (!Array.isArray(jobs)) return [];
  return jobs
    .filter(
      (job) => job && typeof job === "object" && /^\d+$/.test(String(job.id)),
    )
    .map((job) => ({
      id: text(job.id),
      state: text(job.state),
      scheduling: text(job.scheduling),
      executeAfter: text(job.executeAfter),
      attempts: text(job.attempts),
    }));
}
