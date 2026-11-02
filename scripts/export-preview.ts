import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Store } from "../packages/service-core/src/store";
import { restorePreviewSnapshot } from "../services/cronpot-relayer/src/bootstrap";
import { manifest, now, pathAt, writeJson } from "./lib";

const deployment = manifest();
const db = new DatabaseSync(pathAt("data/cronpot.sqlite"), { readOnly: true });
try {
  db.exec("BEGIN");
  const through = db
    .prepare("SELECT block,hash FROM cursors WHERE name='chain'")
    .get();
  if (!through) throw new Error("No retained chain cursor to export");
  const snapshot = {
    schemaVersion: 1,
    genesisHash:
      "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd",
    observedAt: now(),
    contracts: {
      Cronpot: deployment.contracts.Cronpot!.address,
      MeterMend: deployment.contracts.MeterMend!.address,
    },
    startBlock: 271379,
    through,
    blocks: db
      .prepare(
        "SELECT block,hash FROM finalized_blocks WHERE block>=? AND block<=? ORDER BY block",
      )
      .all(271379, through.block!),
    events: db
      .prepare(
        "SELECT payload FROM events WHERE block>=? AND block<=? ORDER BY block,id",
      )
      .all(271379, through.block!)
      .map((row) => JSON.parse(String(row.payload))),
    jobs: db
      .prepare("SELECT payload FROM jobs ORDER BY id")
      .all()
      .map((row) => JSON.parse(String(row.payload))),
  };
  db.exec("COMMIT");
  const check = new Store(":memory:");
  try {
    restorePreviewSnapshot(check, snapshot as any, deployment);
  } finally {
    check.close();
  }
  writeJson("deployments/preview-chain.json", snapshot);
  const bytes = readFileSync(pathAt("deployments/preview-chain.json"));
  writeJson("deployments/preview-snapshot.json", {
    observedAt: snapshot.observedAt,
    status: "exported-real-finalized-history",
    path: "deployments/preview-chain.json",
    sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    through,
    blocks: snapshot.blocks.length,
    events: snapshot.events.length,
    jobs: snapshot.jobs.length,
    source:
      "Consistent read-only SQLite transaction from the actual local indexer",
    limitations: [
      "A retained snapshot is not an always-on host or a successful automatic refund.",
      "No outbox, credentials, arbitrary state or private evidence files are included.",
      "The free preview cannot sign transactions or accept evidence uploads.",
    ],
  });
  console.log(
    JSON.stringify({
      through,
      blocks: snapshot.blocks.length,
      events: snapshot.events.length,
      jobs: snapshot.jobs.length,
    }),
  );
} finally {
  db.close();
}
