import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("node:fs/promises", () => ({ readFile: vi.fn() }));
import { readFile } from "node:fs/promises";
import { historyEndpoint } from "../lib/history-endpoint";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});
describe("verified public history endpoint", () => {
  it("keeps explicit host configuration authoritative", async () => {
    vi.stubEnv("CHAIN_INDEXER_URL", "http://localhost:8787");
    expect(await historyEndpoint()).toBe("http://localhost:8787");
    expect(readFile).not.toHaveBeenCalled();
  });
  it("uses the verified Render origin for a published free preview", async () => {
    vi.stubEnv("CHAIN_INDEXER_URL", "");
    vi.stubEnv("RELAYER_URL", "");
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        publicUrl: "https://metermend-preview.onrender.com",
        verification: { publicHealth: "passed" },
      }),
    );
    expect(await historyEndpoint()).toBe(
      "https://metermend-preview.onrender.com",
    );
  });
  it.each([
    "http://metermend-preview.onrender.com",
    "https://localhost",
    "https://a.onrender.com/path",
    "https://user:secret@a.onrender.com",
  ])("rejects an unsuitable manifest URL %s", async (publicUrl) => {
    vi.stubEnv("CHAIN_INDEXER_URL", "");
    vi.stubEnv("RELAYER_URL", "");
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({ publicUrl, verification: { publicHealth: "passed" } }),
    );
    expect(await historyEndpoint()).toBeNull();
  });
  it("does not publish a service before its health check passes", async () => {
    vi.stubEnv("CHAIN_INDEXER_URL", "");
    vi.stubEnv("RELAYER_URL", "");
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        publicUrl: "https://a.onrender.com",
        verification: { publicHealth: "pending" },
      }),
    );
    expect(await historyEndpoint()).toBeNull();
  });
});
