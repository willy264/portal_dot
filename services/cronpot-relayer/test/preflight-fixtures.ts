import {
  encodeAbiParameters,
  encodeEventTopics,
  encodeFunctionData,
  hexToBytes,
  type Hex,
} from "viem";
import { cronpotAbi, meterMendAbi } from "@metermend/chain/abi";
import {
  SUPPORTED_RUNTIME,
  type ExecutionProfile,
} from "../src/execution-profile.js";
import type { CallTrace, RefundExpectation } from "../src/refund-trace.js";
import { createHash } from "node:crypto";

// Synthetic test vectors, never deployment or live execution evidence.
export const expected: RefundExpectation = {
  cronpot: "0x1111111111111111111111111111111111111111",
  meterMend: "0x2222222222222222222222222222222222222222",
  executor: "0x3333333333333333333333333333333333333333",
  renter: "0x4444444444444444444444444444444444444444",
  jobId: 3n,
  rentalId: 7n,
  itemId: 2n,
  deposit: 50_000_000_000_000_000n,
};
export function fixtureProfile(): ExecutionProfile {
  return {
    schemaVersion: 1,
    id: "synthetic-unit-profile",
    verified: true,
    code: {
      compiler: "0.8.30+unit-test",
      creationBytecodeSha256: createHash("sha256")
        .update(hexToBytes("0x6001"))
        .digest("hex"),
      runtimeBytecodeSha256: createHash("sha256")
        .update(hexToBytes("0x6000"))
        .digest("hex"),
    },
    runtime: { ...SUPPORTED_RUNTIME },
    contracts: { Cronpot: expected.cronpot, MeterMend: expected.meterMend },
    contractGas: {
      targetGasLimit: "550000000000000",
      postCallGasReserve: "200000000000000",
      tipGasLimit: "30000",
      minCallGas: "758730158740159",
    },
    native: {
      weightLimit: { ref_time: "10000000000", proof_size: "1048576" },
      storageDepositLimit: "2500000000000000",
      feeReserve: "10000000000000",
    },
    ethereum: { gasPriceMin: "25355", gasPriceMax: "25360" },
    verification: {
      artifact: "deployments/synthetic-unit-calibration.json",
      sha256: "ab".repeat(32),
      nativeBoundedSuccess: true,
      ethereumTraceSuccess: true,
    },
  };
}
const topics = (values: readonly unknown[]) => values as readonly string[];
export function jobLog(
  args: {
    jobId?: bigint;
    executor?: typeof expected.executor;
    success?: boolean;
  } = {},
) {
  return {
    address: expected.cronpot,
    topics: topics(
      encodeEventTopics({
        abi: cronpotAbi,
        eventName: "JobExecuted",
        args: {
          jobId: args.jobId ?? expected.jobId,
          executor: args.executor ?? expected.executor,
        },
      }),
    ),
    data: hexToBytes(
      encodeAbiParameters(
        [{ type: "bool" }, { type: "bytes" }],
        [args.success ?? true, "0x"],
      ),
    ),
    position: 1,
  };
}
export function refundLog(args: Partial<RefundExpectation> = {}) {
  const value = { ...expected, ...args };
  return {
    address: expected.meterMend,
    topics: topics(
      encodeEventTopics({
        abi: meterMendAbi,
        eventName: "DepositRefunded",
        args: {
          rentalId: value.rentalId,
          itemId: value.itemId,
          renter: value.renter,
        },
      }),
    ),
    data: hexToBytes(
      encodeAbiParameters([{ type: "uint128" }], [value.deposit]),
    ),
    position: 0,
  };
}
export function call(from: string, to: string, input: Hex): CallTrace {
  return {
    from,
    to,
    input: hexToBytes(input),
    output: new Uint8Array(),
    gas: 980_000_000_000_000n,
    gas_used: 1n,
    value: [0n, 0n, 0n, 0n],
    call_type: { type: "Call" },
    child_call_count: 0,
    calls: [],
    logs: [],
  };
}
export function fixtureTrace(): CallTrace {
  const root = call(
    expected.executor,
    expected.cronpot,
    encodeFunctionData({
      abi: cronpotAbi,
      functionName: "execute",
      args: [expected.jobId],
    }),
  );
  const refund = call(
    expected.cronpot,
    expected.meterMend,
    encodeFunctionData({
      abi: meterMendAbi,
      functionName: "finalizeRefund",
      args: [expected.rentalId],
    }),
  );
  refund.logs = [refundLog()];
  root.calls = [refund];
  root.child_call_count = 1;
  root.logs = [jobLog()];
  return root;
}
