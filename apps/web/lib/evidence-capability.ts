import type { Hex, NativeEvidenceCapability } from "./types";
export function nativeEvidenceCapability(
  funded: unknown,
): NativeEvidenceCapability | null {
  if (!funded || typeof funded !== "object") return null;
  if (
    (funded as Record<string, unknown>).network !== "portaldot-v3-testnet" ||
    (funded as Record<string, unknown>).mode !== "funded-writes"
  )
    return null;
  const checks = (funded as Record<string, unknown>).checks;
  if (!checks || typeof checks !== "object") return null;
  const c = (checks as Record<string, unknown>).P6 as
    Record<string, unknown> | undefined;
  if (!c || c.status !== "passed") return null;
  const evidence = c.evidence as Record<string, unknown> | undefined;
  const stored = c.stored as
    | {
        event?: {
          type?: string;
          value?: { type?: string; value?: { index?: number } };
        };
      }
    | undefined;
  if (
    !evidence ||
    !/^0x[\da-f]{64}$/i.test(String(evidence.txHash)) ||
    !/^0x[\da-f]{64}$/i.test(String(evidence.blockHash)) ||
    stored?.event?.type !== "TransactionStorage" ||
    stored.event.value?.type !== "Stored" ||
    !Number.isInteger(stored.event.value.value?.index)
  )
    return null;
  const maximum = Number(c.maximum);
  const retention = Number(c.retentionPeriod);
  const bytes = Number(c.bytes);
  if (
    !Number.isSafeInteger(maximum) ||
    maximum < 1024 ||
    !Number.isSafeInteger(retention) ||
    retention <= 0 ||
    !Number.isSafeInteger(bytes) ||
    bytes <= 0
  )
    return null;
  return {
    maxBytes: Math.min(65536, maximum),
    retentionBlocks: retention,
    probeTxHash: evidence.txHash as Hex,
    probeBlockHash: evidence.blockHash as Hex,
    probeBytes: bytes,
  };
}
