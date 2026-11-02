import { createHash } from "node:crypto";
import { encodeAbiParameters, hexToBytes, type Hex } from "viem";
import type { ExecutionProfile } from "./execution-profile.js";
import { assertNativeCallbackResult } from "./refund-trace.js";

const hash = (hex: Hex) =>
  createHash("sha256").update(hexToBytes(hex)).digest("hex");
const object = (value: unknown): Record<string, any> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};

/** Bind an integrity-checked artifact to the reviewed code, constructor and runtime. */
export function assertCalibrationBinding(
  profile: ExecutionProfile,
  raw: unknown,
): void {
  const artifact = object(raw);
  if (
    artifact.schemaVersion !== 1 ||
    artifact.status !== "candidate-full-execution-simulated" ||
    artifact.genesis !== profile.runtime.genesisHash ||
    artifact.runtimeCodeHash !== profile.runtime.codeHash ||
    artifact.compiler !== profile.code.compiler ||
    artifact.candidateCreationBytecodeSha256 !==
      profile.code.creationBytecodeSha256 ||
    artifact.candidateRuntimeSha256 !== profile.code.runtimeBytecodeSha256
  )
    throw new Error(
      "Keeper calibration artifact does not match the reviewed compiler, bytecode or runtime",
    );
  for (const key of [
    "targetGasLimit",
    "postCallGasReserve",
    "tipGasLimit",
  ] as const)
    if (artifact.candidateProfile?.[key] !== profile.contractGas[key])
      throw new Error(
        `Keeper calibration ${key} does not match the execution profile`,
      );
  if (artifact.constructorMinCallGas !== profile.contractGas.minCallGas)
    throw new Error(
      "Keeper calibration minimum gas differs from the execution profile",
    );
  const constructor = encodeAbiParameters(
    [{ type: "uint256" }, { type: "uint256" }, { type: "uint256" }],
    [
      BigInt(profile.contractGas.targetGasLimit),
      BigInt(profile.contractGas.postCallGasReserve),
      BigInt(profile.contractGas.tipGasLimit),
    ],
  ).slice(2);
  const creation = artifact.creation?.frame?.input,
    runtime = artifact.creation?.frame?.output;
  if (
    typeof creation !== "string" ||
    !/^0x([\da-f]{2})+$/i.test(creation) ||
    typeof runtime !== "string" ||
    !/^0x([\da-f]{2})+$/i.test(runtime) ||
    !creation.toLowerCase().endsWith(constructor) ||
    creation.length <= constructor.length + 2 ||
    hash(creation.slice(0, -constructor.length) as Hex) !==
      profile.code.creationBytecodeSha256 ||
    hash(runtime as Hex) !== profile.code.runtimeBytecodeSha256
  )
    throw new Error(
      "Keeper calibration raw constructor or runtime bytecode does not match its hashes",
    );
  // Per-job native bool and exact Ethereum logs are required afresh; this artifact is not a live receipt.
  if (
    artifact.execution?.decoded?.success !== true ||
    artifact.execution?.frame?.error ||
    artifact.execution?.frame?.revert_reason ||
    !Array.isArray(artifact.decodedEvents) ||
    !artifact.decodedEvents.some(
      (event: any) =>
        event.eventName === "JobExecuted" && event.args?.success === true,
    ) ||
    !artifact.decodedEvents.some(
      (event: any) => event.eventName === "DepositRefunded",
    )
  )
    throw new Error(
      "Keeper calibration lacks its successful callback simulation events",
    );
  // Reject a pre-fix artifact even if someone rewrites its descriptive success fields.
  assertNativeCallbackResult(artifact.execution.frame.output);
}
