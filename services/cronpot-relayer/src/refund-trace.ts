import {
  decodeEventLog,
  decodeFunctionResult,
  encodeFunctionData,
  toEventSelector,
  toHex,
  parseAbi,
  type Address,
  type Hex,
} from "viem";
import { cronpotAbi, meterMendAbi } from "@metermend/chain/abi";

export interface RefundExpectation {
  cronpot: Address;
  meterMend: Address;
  executor: Address;
  jobId: bigint;
  rentalId: bigint;
  itemId: bigint;
  renter: Address;
  deposit: bigint;
}
export interface CallTrace {
  from: string;
  to: string;
  input: Uint8Array;
  output: Uint8Array;
  error?: string;
  revert_reason?: string;
  value?: readonly bigint[];
  gas: bigint;
  gas_used: bigint;
  call_type: { type: string };
  child_call_count?: number;
  calls: CallTrace[];
  logs: {
    address: string;
    topics: readonly string[];
    data: Uint8Array;
    position: number;
  }[];
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const zeroValue = (value: readonly bigint[] | undefined) =>
  value !== undefined && value.every((n) => n === 0n);
const jobTopic = toEventSelector("JobExecuted(uint256,address,bool,bytes)");
const refundTopic = toEventSelector(
  "DepositRefunded(uint256,uint256,address,uint128)",
);

const executeResultAbi = parseAbi([
  "function execute(uint256 jobId) returns (bool success)",
]);
/** Native dispatch success alone is insufficient: Cronpot must return its actual callback result. */
export function assertNativeCallbackResult(output: Hex): void {
  let success: unknown;
  try {
    success = decodeFunctionResult({
      abi: executeResultAbi,
      functionName: "execute",
      data: output,
    });
  } catch {
    throw new Error(
      "Keeper preflight: bounded native execution did not return its callback-success boolean",
    );
  }
  if (success !== true)
    throw new Error(
      "Keeper preflight: bounded native callback returned false; no broadcast",
    );
}

/** Only successful call branches contribute logs; outer flags alone prove no callback outcome. */
export function validateRefundTrace(
  trace: CallTrace,
  expected: RefundExpectation,
) {
  const executeData = encodeFunctionData({
    abi: cronpotAbi,
    functionName: "execute",
    args: [expected.jobId],
  });
  const refundData = encodeFunctionData({
    abi: meterMendAbi,
    functionName: "finalizeRefund",
    args: [expected.rentalId],
  });
  if (
    trace.error ||
    trace.revert_reason ||
    trace.call_type.type !== "Call" ||
    !same(trace.from, expected.executor) ||
    !same(trace.to, expected.cronpot) ||
    toHex(trace.input) !== executeData ||
    !zeroValue(trace.value)
  )
    throw new Error(
      "Keeper preflight: root trace failed or does not match the exact zero-value Cronpot execution",
    );
  const callbacks = trace.calls.filter(
    (call) =>
      same(call.from, expected.cronpot) &&
      same(call.to, expected.meterMend) &&
      toHex(call.input) === refundData,
  );
  if (
    callbacks.length !== 1 ||
    callbacks[0].error ||
    callbacks[0].revert_reason ||
    callbacks[0].call_type.type !== "Call" ||
    !zeroValue(callbacks[0].value)
  )
    throw new Error(
      "Keeper preflight: expected MeterMend refund callback is missing, duplicated or failed",
    );
  const callback = callbacks[0];
  const ordered: { call: CallTrace; log: CallTrace["logs"][number] }[] = [];
  function walk(call: CallTrace) {
    if (call.error || call.revert_reason) return;
    if (
      call.child_call_count !== undefined &&
      call.child_call_count !== call.calls.length
    )
      throw new Error("Keeper preflight: incomplete nested call trace");
    let previous = -1;
    for (const log of call.logs) {
      if (
        !Number.isInteger(log.position) ||
        log.position < previous ||
        log.position > call.calls.length
      )
        throw new Error("Keeper preflight: invalid trace log ordering");
      previous = log.position;
    }
    for (let position = 0; position <= call.calls.length; position++) {
      for (const log of call.logs.filter((log) => log.position === position))
        ordered.push({ call, log });
      if (position < call.calls.length) walk(call.calls[position]);
    }
  }
  walk(trace);
  const executed = ordered.filter(
    ({ log }) =>
      same(log.address, expected.cronpot) && log.topics[0] === jobTopic,
  );
  const refunded = ordered.filter(
    ({ log }) =>
      same(log.address, expected.meterMend) && log.topics[0] === refundTopic,
  );
  if (
    executed.length !== 1 ||
    refunded.length !== 1 ||
    executed[0].call !== trace ||
    refunded[0].call !== callback
  )
    throw new Error(
      "Keeper preflight: exactly one JobExecuted and one callback DepositRefunded are required",
    );
  const job = decodeEventLog({
    abi: cronpotAbi,
    eventName: "JobExecuted",
    strict: true,
    topics: executed[0].log.topics as [Hex, ...Hex[]],
    data: toHex(executed[0].log.data),
  }).args;
  const refund = decodeEventLog({
    abi: meterMendAbi,
    eventName: "DepositRefunded",
    strict: true,
    topics: refunded[0].log.topics as [Hex, ...Hex[]],
    data: toHex(refunded[0].log.data),
  }).args;
  if (
    job.jobId !== expected.jobId ||
    job.success !== true ||
    !same(job.executor, expected.executor)
  )
    throw new Error(
      "Keeper preflight: JobExecuted must match the job, executor and success=true",
    );
  if (
    refund.rentalId !== expected.rentalId ||
    refund.itemId !== expected.itemId ||
    !same(refund.renter, expected.renter) ||
    refund.amount !== expected.deposit
  )
    throw new Error(
      "Keeper preflight: DepositRefunded does not match the complete rental deposit",
    );
  if (ordered.indexOf(refunded[0]) >= ordered.indexOf(executed[0]))
    throw new Error(
      "Keeper preflight: refund must precede JobExecuted in the successful callback",
    );
  return {
    jobExecuted: { ...job },
    depositRefunded: { ...refund },
    callbackGas: callback.gas,
  };
}
