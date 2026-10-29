import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isAddress } from "viem";
import type { Hex, PublicConfig } from "./types";
import { nativeEvidenceCapability } from "./evidence-capability";

export function deploymentDirectory() {
  if (process.env.DEPLOYMENTS_DIR)
    return path.resolve(process.env.DEPLOYMENTS_DIR);
  // Next runs with apps/web as cwd. Custom hosts set DEPLOYMENTS_DIR explicitly.
  return path.resolve(process.cwd(), "../../deployments");
}
export async function readDeployment(
  name:
    "probe.json" | "funded-probe.json" | "portaldot-v3.json" | "demo-run.json",
): Promise<Record<string, any> | null> {
  try {
    return JSON.parse(
      await readFile(
        /* turbopackIgnore: true */ path.join(
          /* turbopackIgnore: true */ deploymentDirectory(),
          name,
        ),
        "utf8",
      ),
    );
  } catch {
    return null;
  }
}
function address(value: unknown): Hex | null {
  return typeof value === "string" && isAddress(value) ? (value as Hex) : null;
}
function deploymentAddress(value: unknown): Hex | null {
  return (
    address(value) ??
    (value && typeof value === "object" && "address" in value
      ? address(value.address)
      : null)
  );
}
export async function publicConfig(): Promise<PublicConfig> {
  const [d, funded] = await Promise.all([
    readDeployment("portaldot-v3.json"),
    readDeployment("funded-probe.json"),
  ]);
  const units = d?.units;
  const unitMatch =
    units?.nativeDecimals === 14 &&
    units?.evmDecimals === 18 &&
    String(units?.nativeToEthRatio) === "10000";
  return {
    network: "Portaldot V3 testnet",
    chainId: 420420777,
    meterMend:
      address(process.env.METERMEND_ADDRESS) ??
      deploymentAddress(
        d?.contracts?.MeterMend ?? d?.contracts?.meterMend ?? d?.meterMend,
      ),
    cronpot:
      address(process.env.CRONPOT_ADDRESS) ??
      deploymentAddress(
        d?.contracts?.Cronpot ?? d?.contracts?.cronpot ?? d?.cronpot,
      ),
    wssUrl: process.env.WSS_URL ?? "wss://test-node-v3.portaldot.dev",
    evmRpcUrl:
      process.env.EVM_RPC_URL ?? "https://test-evm-rpc-v3.portaldot.dev",
    explorer: "https://node-console.portaldot.dev",
    cronpotMode:
      d?.cronpotMode === "native"
        ? "native"
        : d?.cronpotMode === "keeper"
          ? "keeper"
          : "unverified",
    cronTip: d?.cronTip !== undefined ? String(d.cronTip) : null,
    nativeDecimals: 14,
    evmDecimals: 18,
    unitsVerified:
      unitMatch && units?.verified === true && Number(d?.chainId) === 420420777,
    storageConfigured:
      !!process.env.EVIDENCE_BACKEND_URL ||
      (!!process.env.WEB_EVIDENCE_DIR && !process.env.VERCEL),
    nativeEvidence: nativeEvidenceCapability(funded),
    appUrl: process.env.PUBLIC_APP_URL ?? process.env.APP_URL ?? null,
    deploymentBlock:
      d?.contracts?.MeterMend?.blockNumber?.toString() ??
      d?.contracts?.MeterMend?.block?.toString() ??
      d?.deploymentBlock?.toString() ??
      null,
  };
}
