export const NATIVE = 100_000_000_000_000n;
export const CONTINUATION_CAP = 8_349_000_000_000_000n;
const native = (v: string) =>
  BigInt(v.replace(".", "").padEnd((v.split(".")[0]?.length ?? 0) + 14, "0"));
export const STEP_LIMITS: Record<
  string,
  { storage: bigint; fee: bigint; value: bigint }
> = {
  "direct-refund": { storage: 0n, fee: native("0.5"), value: 0n },
  "rent-second": {
    storage: native("19.2075"),
    fee: native("0.5"),
    value: native("0.06"),
  },
  "return-second": {
    storage: native("26.8905"),
    fee: native("0.5"),
    value: native("0.001"),
  },
  "open-dispute": { storage: native("7.683"), fee: native("0.5"), value: 0n },
  "approve-dispute": {
    storage: native("3.8415"),
    fee: native("0.5"),
    value: 0n,
  },
  "propose-repair": {
    storage: native("15.366"),
    fee: native("0.5"),
    value: 0n,
  },
  "approve-repair": {
    storage: native("3.8415"),
    fee: native("0.5"),
    value: 0n,
  },
  "withdraw-income": { storage: 0n, fee: native("0.5"), value: 0n },
  "reserve-rejection": { storage: 0n, fee: native("0.5"), value: 0n },
};
export const plannedMaximum = Object.values(STEP_LIMITS).reduce(
  (sum, s) => sum + s.storage + s.fee + s.value,
  0n,
);
/** No storage refunds or incoming transfers enlarge the user's spending cap. */
export function checkQuote(
  step: string,
  storage: bigint,
  fee: bigint,
  value: bigint,
) {
  const limit = STEP_LIMITS[step];
  if (
    !limit ||
    storage < 0n ||
    fee < 0n ||
    value < 0n ||
    storage > limit.storage ||
    fee > limit.fee ||
    value !== limit.value ||
    plannedMaximum > CONTINUATION_CAP
  )
    throw new Error(
      `Continuation quote exceeds the reviewed 83.49 tPOT plan: ${step}`,
    );
  return storage + fee + value;
}
