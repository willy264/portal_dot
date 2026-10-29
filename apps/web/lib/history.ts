import type { Ledger, LedgerEvent, Hex } from "./types";
function hash(value: unknown): Hex | null {
  return typeof value === "string" && /^0x[0-9a-fA-F]{64}$/.test(value)
    ? (value as Hex)
    : null;
}
/** Native on_initialize events have a block hash and event position, but no extrinsic hash. */
export function normalizeEvents(data: unknown): LedgerEvent[] {
  const object =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const events = Array.isArray(data)
    ? data
    : Array.isArray(object.events)
      ? object.events
      : [];
  return events.flatMap((value: unknown) => {
    if (!value || typeof value !== "object") return [];
    const event = value as Record<string, unknown>;
    const transactionHash = hash(event.transactionHash ?? event.txHash);
    const blockHash = hash(event.blockHash);
    if (!transactionHash && !blockHash) return [];
    let args = event.args ?? {};
    if (typeof args === "string") {
      try {
        args = JSON.parse(args);
      } catch {
        args = {};
      }
    }
    if (!args || typeof args !== "object") args = {};
    const safeArgs = Object.fromEntries(
      Object.entries(args).filter(([, v]) =>
        ["string", "boolean", "number"].includes(typeof v),
      ),
    ) as LedgerEvent["args"];
    const eventIndex =
      typeof event.eventIndex === "number"
        ? event.eventIndex
        : typeof event.logIndex === "number"
          ? event.logIndex
          : null;
    return [
      {
        id: String(
          event.id ??
            `${transactionHash ?? blockHash}:${eventIndex ?? "unknown"}`,
        ),
        name: String(
          event.eventName ?? event.name ?? event.event ?? "Chain event",
        ),
        transactionHash,
        blockHash,
        blockNumber: String(event.blockNumber ?? event.block ?? ""),
        eventIndex,
        args: safeArgs,
        source:
          event.source === "substrate"
            ? ("substrate" as const)
            : event.source === "evm"
              ? ("evm" as const)
              : ("indexer" as const),
      },
    ];
  });
}
export function eventsForItem(
  ledger: Ledger | null,
  itemId: string,
): LedgerEvent[] {
  if (!ledger) return [];
  const rentals = ledger.rentals.filter((r) => r.itemId === itemId);
  const rentalIds = new Set(rentals.map((r) => r.id));
  const jobs = new Set(
    rentals.filter((r) => r.cronJobId !== "0").map((r) => r.cronJobId),
  );
  const repairs = new Set(
    ledger.repairs.filter((r) => r.itemId === itemId).map((r) => r.id),
  );
  return ledger.events.filter(
    (event) =>
      String(event.args.itemId) === itemId ||
      rentalIds.has(String(event.args.rentalId)) ||
      jobs.has(String(event.args.jobId)) ||
      repairs.has(String(event.args.repairId)),
  );
}
export function eventsForRental(
  ledger: Ledger | null,
  rentalId: string,
): LedgerEvent[] {
  if (!ledger) return [];
  const rental = ledger.rentals.find((r) => r.id === rentalId);
  return ledger.events.filter(
    (event) =>
      String(event.args.rentalId) === rentalId ||
      (rental?.cronJobId !== "0" &&
        rental?.cronJobId === String(event.args.jobId)),
  );
}
