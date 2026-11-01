import { isAddress, type Abi, type Address } from "viem";
import { cronpotAbi, meterMendAbi } from "../packages/chain/src/abi";
import type { Manifest } from "./lib";

export type ReadBackSnapshot = { number: number; hash: string };
type Reader = (
  abi: Abi,
  address: Address,
  fn: string,
  args: readonly unknown[],
  options: { at: ReadBackSnapshot },
) => Promise<unknown>;

export async function verifyReadBack(
  deployment: Manifest,
  at: ReadBackSnapshot,
  read: Reader,
) {
  const contracts: Record<string, any> = {};
  const cron = deployment.contracts.Cronpot;
  const meter = deployment.contracts.MeterMend;
  for (const [name, entry] of [
    ["Cronpot", cron],
    ["MeterMend", meter],
  ] as const) {
    if (!entry) {
      contracts[name] = { status: "pending-deployment" };
      continue;
    }
    if (
      !isAddress(entry.address) ||
      !Number.isSafeInteger(entry.block) ||
      entry.block < 0 ||
      entry.block > at.number ||
      !/^0x[\da-f]{64}$/i.test(entry.txHash) ||
      !/^0x[\da-f]{64}$/i.test(entry.blockHash)
    ) {
      contracts[name] = {
        status: "failed",
        address: entry.address,
        error: "Deployment receipt is not valid at this finalized snapshot",
      };
      continue;
    }
    try {
      if (name === "Cronpot") {
        const value = await read(cronpotAbi, entry.address, "nextJobId", [], {
          at,
        });
        if (typeof value !== "bigint" || value < 1n)
          throw new Error("Cronpot.nextJobId must be a positive uint256");
        contracts[name] = {
          status: "passed",
          address: entry.address,
          nextJobId: value.toString(),
        };
      } else {
        const [configuredCron, tip] = await Promise.all([
          read(meterMendAbi, entry.address, "cronpot", [], { at }),
          read(meterMendAbi, entry.address, "cronTip", [], { at }),
        ]);
        const expectedTip = deployment.cronTipEvm ?? deployment.cronTip;
        if (
          !cron ||
          typeof configuredCron !== "string" ||
          configuredCron.toLowerCase() !== cron.address.toLowerCase()
        )
          throw new Error(
            "MeterMend.cronpot does not match the finalized Cronpot deployment",
          );
        if (typeof expectedTip !== "string" || !/^\d+$/.test(expectedTip))
          throw new Error(
            "The immutable constructor cronTip was not retained in the manifest",
          );
        if (typeof tip !== "bigint" || tip !== BigInt(expectedTip))
          throw new Error(
            "MeterMend.cronTip does not match the recorded constructor value",
          );
        contracts[name] = {
          status: "passed",
          address: entry.address,
          cronpot: configuredCron,
          cronTipEvm: tip.toString(),
          expectedCronTipEvm: expectedTip,
        };
      }
    } catch (error) {
      contracts[name] = {
        status: "failed",
        address: entry.address,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  const statuses = Object.values(contracts).map((record: any) => record.status);
  return {
    schemaVersion: 1,
    network: deployment.network,
    chainId: deployment.chainId,
    mode: "read-only",
    signedTransactions: 0,
    observedAt: new Date().toISOString(),
    at,
    status: statuses.includes("failed")
      ? "failed"
      : statuses.every((status) => status === "passed")
        ? "passed"
        : "partial",
    contracts,
  };
}
