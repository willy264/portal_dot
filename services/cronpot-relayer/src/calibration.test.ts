import { describe, expect, it } from "vitest";
import { encodeAbiParameters } from "viem";
import { assertCalibrationBinding } from "./calibration.js";
import { fixtureProfile } from "../test/preflight-fixtures.js";

function fixture() {
  const profile = fixtureProfile();
  const constructor = encodeAbiParameters(
    [{ type: "uint256" }, { type: "uint256" }, { type: "uint256" }],
    [550000000000000n, 200000000000000n, 30000n],
  );
  return {
    profile,
    artifact: {
      schemaVersion: 1,
      status: "candidate-full-execution-simulated",
      genesis: profile.runtime.genesisHash,
      runtimeCodeHash: profile.runtime.codeHash,
      compiler: profile.code.compiler,
      candidateCreationBytecodeSha256: profile.code.creationBytecodeSha256,
      candidateRuntimeSha256: profile.code.runtimeBytecodeSha256,
      candidateProfile: {
        targetGasLimit: profile.contractGas.targetGasLimit,
        postCallGasReserve: profile.contractGas.postCallGasReserve,
        tipGasLimit: profile.contractGas.tipGasLimit,
      },
      constructorMinCallGas: profile.contractGas.minCallGas,
      creation: {
        frame: { input: `0x6001${constructor.slice(2)}`, output: "0x6000" },
      },
      execution: {
        decoded: { success: true },
        frame: { output: encodeAbiParameters([{ type: "bool" }], [true]) },
      },
      decodedEvents: [
        { eventName: "JobExecuted", args: { success: true } },
        { eventName: "DepositRefunded" },
      ],
    },
  };
}
describe("semantic calibration binding", () => {
  it("accepts an internally matching reviewed configuration without claiming live execution", () => {
    const { profile, artifact } = fixture();
    expect(() => assertCalibrationBinding(profile, artifact)).not.toThrow();
  });
  it("rejects a changed compiler, runtime, creation hash or constructor profile", () => {
    for (const key of [
      "compiler",
      "runtimeCodeHash",
      "candidateCreationBytecodeSha256",
    ] as const) {
      const { profile, artifact } = fixture();
      artifact[key] = "other";
      expect(() => assertCalibrationBinding(profile, artifact)).toThrow(
        "reviewed compiler",
      );
    }
    const { profile, artifact } = fixture();
    artifact.candidateProfile.tipGasLimit = "1";
    expect(() => assertCalibrationBinding(profile, artifact)).toThrow(
      "tipGasLimit",
    );
  });
  it("rejects mutated raw code or constructor even when success booleans remain true", () => {
    const { profile, artifact } = fixture();
    artifact.creation.frame.output = "0x6001";
    expect(() => assertCalibrationBinding(profile, artifact)).toThrow(
      "raw constructor or runtime",
    );
    artifact.creation.frame.output = "0x6000";
    artifact.creation.frame.input =
      artifact.creation.frame.input.slice(0, -2) + "00";
    expect(() => assertCalibrationBinding(profile, artifact)).toThrow(
      "raw constructor or runtime",
    );
  });
  it("rejects a pre-fix empty return artifact or an unsuccessful recorded callback", () => {
    const { profile, artifact } = fixture();
    artifact.execution.frame.output = "0x";
    expect(() => assertCalibrationBinding(profile, artifact)).toThrow(
      "callback-success boolean",
    );
    artifact.execution.frame.output = encodeAbiParameters(
      [{ type: "bool" }],
      [true],
    );
    artifact.decodedEvents[0].args!.success = false;
    expect(() => assertCalibrationBinding(profile, artifact)).toThrow(
      "successful callback simulation events",
    );
  });
});
