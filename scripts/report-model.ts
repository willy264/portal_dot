import { decodeEventLog, formatUnits, toHex, type Abi, type Hex } from "viem";
import { cronpotAbi, meterMendAbi, pingAbi } from "../packages/chain/src/abi";

export function demoSteps(demo: any): any[] {
  const input = demo?.steps ?? demo?.transactions ?? [];
  const steps = Array.isArray(input)
    ? [...input]
    : Object.entries(input).map(([step, value]) => ({
        ...(value as object),
        step,
      }));
  const automatic = demo?.automaticRefund;
  if (automatic?.refund) {
    steps.push({
      ...automatic.refund,
      step: `automatic-refund (${automatic.mode})`,
      event: "DepositRefunded + JobExecuted",
      amount:
        automatic.refund.args?.amount === undefined
          ? ""
          : `${automatic.refund.args.amount} EVM base units`,
    });
  }
  return steps.sort(
    (a, b) =>
      Number(a.block ?? a.blockNumber ?? 0) -
        Number(b.block ?? b.blockNumber ?? 0) ||
      Number(a.extrinsicIndex ?? 0) - Number(b.extrinsicIndex ?? 0),
  );
}

export function eventSummary(
  step: any,
  contracts: any,
  decimals: number | undefined,
): { events: string; amounts: string } {
  const names: string[] = [];
  const amounts: string[] = [];
  const abis: Record<string, Abi> = {
    MeterMend: meterMendAbi,
    Cronpot: cronpotAbi,
    Ping: pingAbi,
  };
  for (const raw of step.events ?? []) {
    if (typeof raw === "string") {
      names.push(raw);
      continue;
    }
    const event = raw.event ?? raw;
    if (event.type === "Revive" && event.value?.type === "ContractEmitted") {
      const emitted = event.value.value;
      const entry = Object.entries(contracts ?? {}).find(
        ([, c]: [string, any]) =>
          String(c.address).toLowerCase() ===
          String(emitted.contract).toLowerCase(),
      );
      if (!entry || !abis[entry[0]]) continue;
      try {
        const decoded = decodeEventLog({
          abi: abis[entry[0]]!,
          data:
            typeof emitted.data === "string"
              ? (emitted.data as Hex)
              : toHex(emitted.data),
          topics: emitted.topics,
          strict: true,
        });
        if (decoded.eventName) names.push(decoded.eventName);
        for (const [key, value] of Object.entries(decoded.args ?? {})) {
          if (
            ![
              "amount",
              "fee",
              "toReserve",
              "deposit",
              "deducted",
              "refunded",
            ].includes(key)
          )
            continue;
          amounts.push(
            `${key}: ${decimals === undefined ? `${value} EVM base units` : `${formatUnits(BigInt(String(value)), decimals)} tPOT`}`,
          );
        }
      } catch {
        names.push("ContractEmitted (ABI decode unavailable)");
      }
    } else if (
      event.type === "TransactionStorage" ||
      event.type === "Scheduler"
    )
      names.push(`${event.type}.${event.value?.type ?? "event"}`);
  }
  return {
    events: step.event ?? names.join(", "),
    amounts: step.amount ?? amounts.join("; "),
  };
}
