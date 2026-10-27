export type HistoryResult<T> = {
  logs: T[];
  complete: boolean;
  source: "substrate" | "evm-rpc" | "unavailable";
  gap?: { native: string; evm?: string };
};

const message = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/** An EVM facade can omit native transactions silently, so it cannot close a native history gap. */
export async function historyWithFallback<T>(
  native: () => Promise<T[]>,
  evm: () => Promise<T[]>,
): Promise<HistoryResult<T>> {
  try {
    return { logs: await native(), complete: true, source: "substrate" };
  } catch (nativeError) {
    try {
      return {
        logs: await evm(),
        complete: false,
        source: "evm-rpc",
        gap: { native: message(nativeError) },
      };
    } catch (evmError) {
      return {
        logs: [],
        complete: false,
        source: "unavailable",
        gap: { native: message(nativeError), evm: message(evmError) },
      };
    }
  }
}

export class HistoryGapError<T = unknown> extends Error {
  readonly code = "HISTORY_GAP";
  constructor(
    readonly fromBlock: bigint,
    readonly toBlock: bigint,
    readonly partial: HistoryResult<T>,
  ) {
    super(
      `Complete native event history unavailable for blocks ${fromBlock}–${toBlock}; EVM fallback does not establish completeness`,
    );
    this.name = "HistoryGapError";
  }
}
