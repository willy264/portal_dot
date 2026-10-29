import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { imageMime, MAX_EVIDENCE_BYTES, normalizeHash } from "./evidence";

export function evidenceStorageDirectory() {
  if (process.env.VERCEL)
    throw new Error(
      "Persistent evidence storage is not configured for this host. Configure EVIDENCE_BACKEND_URL.",
    );
  if (!process.env.WEB_EVIDENCE_DIR)
    throw new Error(
      "Evidence storage is not configured. An operator must attach persistent storage before uploads are accepted.",
    );
  return path.resolve(process.env.WEB_EVIDENCE_DIR);
}
export async function readBoundedBody(
  request: Pick<Request, "headers" | "body">,
): Promise<Buffer> {
  const stated = Number(request.headers.get("content-length") ?? 0);
  if (stated > MAX_EVIDENCE_BYTES)
    throw new Error("Evidence files must be 5 MB or smaller.");
  if (!request.body) throw new Error("Select an image to upload.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.byteLength;
      if (length > MAX_EVIDENCE_BYTES) {
        await reader.cancel();
        throw new Error("Evidence files must be 5 MB or smaller.");
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
export async function saveEvidence(bytes: Buffer, claimedHash: string) {
  const hash = normalizeHash(claimedHash);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== hash)
    throw new Error("The uploaded bytes do not match the supplied hash.");
  const mime = imageMime(bytes);
  if (!mime)
    throw new Error("Only JPEG, PNG and WebP image evidence is supported.");
  const directory = evidenceStorageDirectory();
  await mkdir(directory, { recursive: true });
  try {
    await writeFile(path.join(directory, hash), bytes, {
      flag: "wx",
      mode: 0o600,
    });
  } catch (error) {
    if (!(
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "EEXIST"
    ))
      throw error;
    const stored = await readFile(path.join(directory, hash));
    if (createHash("sha256").update(stored).digest("hex") !== hash)
      throw new Error("Stored evidence failed its integrity check.");
  }
  return {
    hash: `0x${hash}`,
    url: `/api/evidence/${hash}`,
    size: bytes.length,
    mime,
    mode: "application-storage",
  };
}
export async function loadEvidence(value: string) {
  const hash = normalizeHash(value);
  const bytes = await readFile(path.join(evidenceStorageDirectory(), hash));
  if (
    bytes.length > MAX_EVIDENCE_BYTES ||
    createHash("sha256").update(bytes).digest("hex") !== hash
  )
    throw new Error("Stored evidence failed its integrity check.");
  const mime = imageMime(bytes);
  if (!mime) throw new Error("Stored evidence is not a supported image.");
  return { bytes, mime };
}
