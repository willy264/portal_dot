/** A scheduler is only a liveness optimization; the contract checks chain time. */
export function delayBlocks(
  executeAfter: bigint,
  chainNow: bigint,
  blockTimeMs: number,
): number {
  if (!Number.isFinite(blockTimeMs) || blockTimeMs <= 0)
    throw new Error("Invalid observed block time");
  const delta = executeAfter > chainNow ? executeAfter - chainNow : 0n;
  if (delta > BigInt(Math.floor(Number.MAX_SAFE_INTEGER / 1000)))
    throw new Error("Deadline is outside the supported range");
  return Math.ceil((Number(delta) * 1000) / blockTimeMs) + 2;
}

export function keeperReady(
  executeAfter: bigint,
  finalizedChainTime: bigint,
  graceSeconds = 30n,
): boolean {
  return finalizedChainTime >= executeAfter + graceSeconds;
}

export function backoffMs(attempt: number, retryAfterMs = 0): number {
  return Math.max(
    retryAfterMs,
    Math.min(300_000, 1000 * 2 ** Math.min(Math.max(0, attempt), 8)),
  );
}

/** Enforces both one/second and the ordinary DeBox five/rolling-minute quota. */
export function nextDeliveryAt(
  sentAt: number[],
  now: number,
  quota = 5,
): number {
  if (!Number.isInteger(quota) || quota < 1)
    throw new Error("Invalid delivery quota");
  const recent = sentAt.filter((t) => t > now - 60_000).sort((a, b) => a - b);
  const perSecond = recent.length ? recent[recent.length - 1]! + 1000 : now;
  const perMinute =
    recent.length >= quota ? recent[recent.length - quota]! + 60_000 : now;
  return Math.max(now, perSecond, perMinute);
}
