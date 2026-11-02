import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  Store,
  type ChainEvent,
  type StoredJob,
} from "@metermend/service-core";

const genesis =
  "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd";
type Snapshot = {
  schemaVersion: number;
  genesisHash: string;
  contracts: { Cronpot: string; MeterMend: string };
  startBlock: number;
  through: { block: number; hash: string };
  blocks: { block: number; hash: string }[];
  events: ChainEvent[];
  jobs: StoredJob[];
};

/** Only a read-only preview may restore this public, reviewed chain snapshot. */
export function restorePreviewSnapshot(
  store: Store,
  snapshot: Snapshot,
  manifest: any,
) {
  if (snapshot.schemaVersion !== 1 || snapshot.genesisHash !== genesis)
    throw new Error("Preview snapshot network mismatch");
  for (const name of ["Cronpot", "MeterMend"] as const)
    if (
      snapshot.contracts[name].toLowerCase() !==
      manifest?.contracts?.[name]?.address?.toLowerCase()
    )
      throw new Error("Preview snapshot contract mismatch");
  const hash = /^0x[0-9a-f]{64}$/i;
  if (
    !Number.isSafeInteger(snapshot.startBlock) ||
    snapshot.startBlock < 0 ||
    snapshot.blocks.length < 1 ||
    snapshot.blocks.length > 100_000 ||
    snapshot.blocks.some(
      (b, i) => b.block !== snapshot.startBlock + i || !hash.test(b.hash),
    ) ||
    snapshot.blocks.at(-1)?.block !== snapshot.through.block ||
    snapshot.blocks.at(-1)?.hash !== snapshot.through.hash
  )
    throw new Error(
      "Preview snapshot must retain every finalized block in its range",
    );
  const blocks = new Map(snapshot.blocks.map((b) => [b.block, b.hash]));
  if (
    snapshot.events.some(
      (e) =>
        e.network !== "portaldot-v3-testnet" ||
        blocks.get(e.block) !== e.blockHash ||
        !Number.isSafeInteger(e.eventIndex) ||
        e.eventIndex < 0 ||
        (e.txHash !== null && !hash.test(e.txHash)) ||
        !Object.values(snapshot.contracts).some(
          (a) => a.toLowerCase() === e.address.toLowerCase(),
        ),
    ) ||
    new Set(snapshot.events.map((e) => e.id)).size !== snapshot.events.length
  )
    throw new Error(
      "Preview events do not match their retained contract blocks",
    );
  if (
    snapshot.jobs.some(
      (j) => !["Failed", "Executed", "Cancelled"].includes(j.state),
    )
  )
    throw new Error(
      "A preview bootstrap cannot carry an unfinished keeper job",
    );
  // Do not roll back, merge over, or conceal a gap in an existing index.
  if (
    store.cursor("chain") ||
    Number(
      store.db.prepare("SELECT count(*) AS n FROM finalized_blocks").get()!.n,
    ) !== 0
  )
    return { restored: false, reason: "existing-index-preserved" };
  store.transaction(() => {
    const block = store.db.prepare(
      "INSERT INTO finalized_blocks(block,hash) VALUES(?,?)",
    );
    for (const b of snapshot.blocks) block.run(b.block, b.hash);
    const event = store.db.prepare(
      "INSERT INTO events(id,block,payload) VALUES(?,?,?)",
    );
    for (const e of snapshot.events)
      event.run(e.id, e.block, JSON.stringify(e));
    for (const job of snapshot.jobs) store.putJob(job);
    store.setCursor("chain", snapshot.through.block, snapshot.through.hash);
    store.setCursor("jobs", snapshot.through.block, snapshot.through.hash);
  });
  return { restored: true, through: snapshot.through };
}

export async function bootstrapPreview(
  store: Store,
  root: string,
  manifest: any,
) {
  if (process.env.PREVIEW_SNAPSHOT !== "1") return;
  if (process.env.READ_ONLY !== "1" || process.env.RELAYER_SEED)
    throw new Error("Preview snapshot requires read-only mode and no signer");
  const info = JSON.parse(
    await readFile(resolve(root, "deployments/preview-snapshot.json"), "utf8"),
  );
  const bytes = await readFile(resolve(root, "deployments/preview-chain.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== info.sha256)
    throw new Error("Preview snapshot SHA-256 mismatch");
  return restorePreviewSnapshot(
    store,
    JSON.parse(bytes.toString("utf8")),
    manifest,
  );
}
