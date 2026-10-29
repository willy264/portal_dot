import "server-only";
import { chainAdapter } from "./wallet-chain";
import { snapshotReader } from "./snapshot-reader";
import { publicConfig } from "./server-config";
import { errorMessage, metadata } from "./format";
import { normalizeEvents } from "./history";
import type { Ledger, Rental } from "./types";

async function backend(path: string): Promise<any> {
  const base = process.env.CHAIN_INDEXER_URL ?? process.env.RELAYER_URL;
  if (!base) throw new Error("The history service is not configured.");
  const response = await fetch(new URL(path, base), {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok)
    throw new Error(`History service returned ${response.status}.`);
  return response.json();
}
async function range<T>(
  next: bigint,
  read: (id: bigint) => Promise<T>,
): Promise<T[]> {
  if (next > 1001n)
    throw new Error(
      "This workshop is larger than the direct-read limit. Configure a paginated indexer before continuing.",
    );
  const values: T[] = [];
  for (let first = 1n; first < next; first += 12n) {
    const ids = Array.from(
      { length: Number(next - first > 12n ? 12n : next - first) },
      (_, index) => first + BigInt(index),
    );
    values.push(...(await Promise.all(ids.map(read))));
  }
  return values;
}
let pendingSnapshot: Promise<Ledger> | null = null;
/** Overlapping browser polls share the in-flight read instead of multiplying RPC work. */
export function readLedger(): Promise<Ledger> {
  if (!pendingSnapshot)
    pendingSnapshot = loadLedger().finally(() => {
      pendingSnapshot = null;
    });
  return pendingSnapshot;
}
async function loadLedger(): Promise<Ledger> {
  const config = await publicConfig();
  const empty: Ledger = {
    config,
    state: "unconfigured",
    observedAt: new Date().toISOString(),
    block: null,
    blockTimestamp: null,
    items: [],
    rentals: [],
    repairs: [],
    events: [],
    jobs: [],
    automaticRefundCount: null,
    historyStatus: "A verified deployment is required to load the workshop.",
  };
  if (!config.meterMend) return empty;
  try {
    const chain = await chainAdapter(config, 8000);
    await chain.verifyNetwork();
    const block = await chain.getFinalizedHead();
    const observedAt = new Date().toISOString();
    const read = snapshotReader(chain, config.meterMend, block);
    const [nextItems, nextRentals, nextRepairs, cronTip] = await Promise.all([
      read("nextItemId"),
      read("nextRentalId"),
      read("nextRepairId"),
      read("cronTip"),
    ]);
    config.cronTip = cronTip.toString();
    const [items, rentals, repairs, historyResult, jobsResult] =
      await Promise.all([
        range(nextItems, async (id) => {
          const i = await read("items", [id]);
          return {
            id: id.toString(),
            operator: i[0],
            arbiter: i[1],
            fee: i[2].toString(),
            deposit: i[3].toString(),
            reserveBps: i[4],
            disputeWindow: i[5],
            active: i[6],
            rented: i[7],
            reserve: i[8].toString(),
            metadataURI: i[9],
            ...metadata(i[9], id.toString()),
          };
        }),
        range(nextRentals, async (id) => {
          const r = await read("rentals", [id]);
          const rental: Rental = {
            id: id.toString(),
            itemId: r[0].toString(),
            renter: r[1],
            deposit: r[2].toString(),
            startedAt: Number(r[3]),
            refundAt: Number(r[4]),
            status: r[5],
            cronJobId: r[6].toString(),
          };
          if (r[5] === 3) {
            const d = await read("disputes", [id]);
            rental.dispute = {
              amount: d[0].toString(),
              evidenceHash: d[1],
              renterVoted: d[2],
              renterApproved: d[3],
              arbiterVoted: d[4],
              arbiterApproved: d[5],
            };
          }
          return rental;
        }),
        range(nextRepairs, async (id) => {
          const r = await read("repairs", [id]);
          return {
            id: id.toString(),
            itemId: r[0].toString(),
            repairer: r[1],
            amount: r[2].toString(),
            receiptHash: r[3],
            paid: r[4],
            rejected: r[5],
          };
        }),
        backend("/events")
          .then((value) => ({ value, error: null }))
          .catch((error) => ({ value: null, error: errorMessage(error) })),
        backend("/jobs")
          .then((value) => ({ value, error: null }))
          .catch((error) => ({ value: null, error: errorMessage(error) })),
      ]);
    const h = historyResult.value;
    return {
      ...empty,
      config,
      state: "ready",
      observedAt,
      block: block.number.toString(),
      blockTimestamp: Number(block.timestamp),
      items,
      rentals,
      repairs,
      events: normalizeEvents(h),
      historyStatus:
        historyResult.error ??
        (h?.gap
          ? "The indexer reports a history gap. Previously stored events are retained; completeness is unverified."
          : "Persisted events from the workshop indexer."),
      jobs: Array.isArray(jobsResult.value)
        ? jobsResult.value
        : (jobsResult.value?.jobs ?? []),
      jobsError: jobsResult.error ?? undefined,
      automaticRefundCount:
        typeof h?.automaticRefundCount === "number"
          ? h.automaticRefundCount
          : null,
    };
  } catch (error) {
    return {
      ...empty,
      state: "error",
      error: errorMessage(error),
      historyStatus:
        "Current chain state could not be verified. Refresh before taking action.",
    };
  }
}
