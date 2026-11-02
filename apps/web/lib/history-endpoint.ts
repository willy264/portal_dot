import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Prefer host settings; otherwise use only a published, verified service record. */
export async function historyEndpoint(): Promise<string | null> {
  const explicit = process.env.CHAIN_INDEXER_URL ?? process.env.RELAYER_URL;
  if (explicit) return explicit;
  try {
    const directory =
      process.env.DEPLOYMENTS_DIR ??
      path.resolve(process.cwd(), "../../deployments");
    const record = JSON.parse(
      await readFile(path.join(directory, "hosting-status.json"), "utf8"),
    );
    if (
      record.verification?.publicHealth !== "passed" ||
      typeof record.publicUrl !== "string"
    )
      return null;
    const url = new URL(record.publicUrl);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/" ||
      !url.hostname.endsWith(".onrender.com")
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}
