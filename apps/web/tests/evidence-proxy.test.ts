import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { Hono } from "../../../services/cronpot-relayer/node_modules/hono";
import { evidenceRoutes } from "../../../services/cronpot-relayer/src/evidence";
import { POST } from "../app/api/evidence/route";
import { GET } from "../app/api/evidence/[hash]/route";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("web to persistent relayer evidence integration", () => {
  it("authenticates the backend, stores exact final bytes, and verifies them on read", async () => {
    const directory = await mkdtemp(
      path.join(tmpdir(), "metermend-proxy-test-"),
    );
    try {
      const token = "local-test-token-never-a-real-credential";
      const app = new Hono().route(
        "/api/evidence",
        evidenceRoutes(directory, token),
      );
      vi.stubEnv("EVIDENCE_BACKEND_URL", "http://evidence.local");
      vi.stubEnv("EVIDENCE_BACKEND_TOKEN", token);
      vi.stubEnv("VERCEL", "1");
      vi.stubGlobal(
        "fetch",
        (input: string | URL | Request, init?: RequestInit) =>
          app.fetch(new Request(input, init)),
      );
      const bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 2, 3, 4]);
      const hash = createHash("sha256").update(bytes).digest("hex");
      const stored = await POST(
        new Request("http://localhost/api/evidence", {
          method: "POST",
          headers: {
            origin: "http://localhost",
            "content-type": "image/png",
            "x-content-sha256": `0x${hash}`,
          },
          body: bytes,
        }),
      );
      expect(stored.status).toBe(201);
      expect(await stored.json()).toMatchObject({
        hash: `0x${hash}`,
        url: `/api/evidence/${hash}`,
        size: bytes.length,
      });
      const loaded = await GET(
        new Request(`http://localhost/api/evidence/${hash}`),
        { params: Promise.resolve({ hash }) },
      );
      expect(loaded.status).toBe(200);
      expect(loaded.headers.get("content-type")).toBe("image/png");
      expect(new Uint8Array(await loaded.arrayBuffer())).toEqual(bytes);
      vi.stubEnv("EVIDENCE_BACKEND_TOKEN", "wrong-test-token");
      const denied = await GET(
        new Request(`http://localhost/api/evidence/${hash}`),
        { params: Promise.resolve({ hash }) },
      );
      expect(denied.status).toBe(404);
    } finally {
      if (directory.startsWith(path.join(tmpdir(), "metermend-proxy-test-")))
        await rm(directory, { recursive: true, force: true });
    }
  });
});
