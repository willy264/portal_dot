import { loadEvidence, readBoundedBody } from "@/lib/evidence-storage";
import { imageMime, normalizeHash } from "@/lib/evidence";
import { createHash } from "node:crypto";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const hash = normalizeHash((await params).hash);
    let bytes: Uint8Array;
    let mime: string;
    if (process.env.EVIDENCE_BACKEND_URL) {
      const response = await fetch(
        new URL(`/api/evidence/${hash}`, process.env.EVIDENCE_BACKEND_URL),
        {
          headers: process.env.EVIDENCE_BACKEND_TOKEN
            ? { Authorization: `Bearer ${process.env.EVIDENCE_BACKEND_TOKEN}` }
            : {},
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!response.ok) throw new Error("Evidence unavailable");
      bytes = await readBoundedBody(response);
      const detected = imageMime(bytes);
      if (!detected) throw new Error("Unsupported image");
      mime = detected;
      if (createHash("sha256").update(bytes).digest("hex") !== hash)
        throw new Error("Integrity failure");
    } else {
      const stored = await loadEvidence(hash);
      bytes = new Uint8Array(stored.bytes);
      mime = stored.mime;
    }
    return new Response(new Uint8Array(bytes).buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Content-Disposition": `inline; filename="${hash}"`,
      },
    });
  } catch {
    return Response.json(
      { error: "Evidence is unavailable or did not pass its integrity check." },
      { status: 404 },
    );
  }
}
