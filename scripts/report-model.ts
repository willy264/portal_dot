import { decodeEventLog, formatUnits, toHex, type Abi, type Hex } from "viem";
import { cronpotAbi, meterMendAbi, pingAbi } from "../packages/chain/src/abi";
import { correctedRefundFrom } from "../apps/web/lib/proof";
export { expectedFailuresFrom as demoExpectedFailures } from "../apps/web/lib/proof";

export function demoSteps(demo: any): any[] {
  const input = demo?.steps ?? demo?.transactions ?? [];
  const steps = Array.isArray(input)
    ? [...input]
    : Object.entries(input).map(([step, value]) => ({
        ...(value as object),
        step,
      }));
  const corrected = demo?.correctedAutomation;
  for (const [step, receipt] of Object.entries(corrected?.transactions ?? {})) {
    if (!receipt || typeof receipt !== "object") continue;
    const row = receipt as Record<string, unknown>;
    if (!steps.some((existing) => row.txHash && existing.txHash === row.txHash))
      steps.push({ ...row, step });
  }
  const originalFailure = corrected?.originalFailure;
  if (originalFailure?.callbackSuccess === false) {
    const existing = steps.find((row) => row.txHash === originalFailure.txHash);
    const failure = {
      ...originalFailure,
      step: "original-cronpot-failed-new-rental",
      outcome: "failed",
      status: originalFailure.reason ?? "Callback failed",
      event: "JobExecuted(success=false); no DepositRefunded event",
    };
    if (existing) Object.assign(existing, failure);
    else steps.push(failure);
  }
  for (const row of steps) {
    if (String(row.step).includes("original-cronpot-failed-new-rental")) {
      row.outcome = "failed";
      row.status ??= "Original Cronpot callback failed; inspect retained trace";
      row.event = "JobExecuted(success=false); no DepositRefunded event";
    }
  }
  const failures = demo?.failedTransactions;
  if (failures && typeof failures === "object") {
    for (const [name, value] of Object.entries(failures)) {
      if (!value || typeof value !== "object") continue;
      const receipt = value as Record<string, unknown>;
      const failure = {
        ...receipt,
        step: receipt.label ?? receipt.step ?? name,
        outcome: "failed",
        status: receipt.status ?? "Failed live attempt",
      };
      const existing = steps.find((row) => row.txHash === receipt.txHash);
      if (existing) Object.assign(existing, failure);
      else steps.push(failure);
    }
  }
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
  const correctedRefund = correctedRefundFrom(demo);
  if (correctedRefund) {
    const row = {
      ...corrected.execution,
      step: correctedRefund.label,
      status: correctedRefund.status,
      event: correctedRefund.eventNames.join(" + "),
    };
    const existing = steps.find((step) => step.txHash === row.txHash);
    if (existing) Object.assign(existing, row);
    else steps.push(row);
  } else if (corrected?.execution?.txHash) {
    const row = steps.find(
      (step) => step.txHash === corrected.execution.txHash,
    );
    if (row) {
      row.status = "Corrected refund outcome not verified";
      row.event =
        "Pending matched JobExecuted(success=true) and DepositRefunded";
    }
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
    CorrectedCronpot: cronpotAbi,
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
