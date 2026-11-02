import { afterEach, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  deployment: { contracts: {} } as any,
  signer: vi.fn(),
  artifact: vi.fn(),
  writeJson: vi.fn(),
}));
vi.mock("../packages/chain/src/revive", () => ({
  buildReviveDeploy: vi.fn(),
  submitAndWatch: vi.fn(),
}));
vi.mock("./lib", () => ({
  Journal: class {
    constructor() {
      throw new Error("Historical journal must stay unopened");
    }
  },
  amount: vi.fn(),
  instantiated: vi.fn(),
  json: vi.fn(),
  now: vi.fn(),
  option: vi.fn(),
  readJson: vi.fn(),
  requireBudget: vi.fn(),
  run: async (main: () => Promise<void>) => main(),
  manifest: () => state.deployment,
  signer: state.signer,
  artifact: state.artifact,
  writeJson: state.writeJson,
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

it("reuses the completed v1 pair without opening a signer or loading replacement artifacts", async () => {
  const receipt = {
    txHash: `0x${"ab".repeat(32)}`,
    blockHash: `0x${"cd".repeat(32)}`,
    block: 100,
    extrinsicIndex: 1,
    events: [{ type: "System", value: { type: "ExtrinsicSuccess" } }],
  };
  state.deployment = { contracts: { Cronpot: receipt, MeterMend: receipt } };
  await import("./deploy");
  expect(state.signer).not.toHaveBeenCalled();
  expect(state.artifact).not.toHaveBeenCalled();
  expect(state.writeJson).not.toHaveBeenCalled();
});

it("blocks the changed constructor from entering the historical deployment journal", async () => {
  state.deployment = { contracts: {} };
  state.signer.mockReturnValue({ address: "synthetic-account" });
  state.artifact.mockReturnValue({
    abi: [{ type: "constructor", inputs: [{ type: "uint256" }] }],
  });
  await expect(import("./deploy")).rejects.toThrow(
    "isolated versioned release",
  );
  expect(state.writeJson).not.toHaveBeenCalled();
});
