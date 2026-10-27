/** Verified against Portaldot V3 spec 3002, Revive.NativeToEthRatio. */
export const NATIVE_DECIMALS = 14;
export const EVM_DECIMALS = 18;
export const NATIVE_TO_EVM_RATIO = 10_000n;

export function nativeToEvm(value: bigint): bigint {
  if (value < 0n) throw new RangeError("Amounts must be non-negative");
  return value * NATIVE_TO_EVM_RATIO;
}

export function evmToNative(value: bigint): bigint {
  if (value < 0n) throw new RangeError("Amounts must be non-negative");
  if (value % NATIVE_TO_EVM_RATIO !== 0n) {
    throw new RangeError("EVM amount contains dust smaller than one native unit; exact conversion required");
  }
  return value / NATIVE_TO_EVM_RATIO;
}

export function withTwentyPercentMargin(value: bigint): bigint {
  if (value < 0n) throw new RangeError("Limits must be non-negative");
  return (value * 120n + 99n) / 100n;
}
