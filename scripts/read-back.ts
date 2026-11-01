import {
  configureChain,
  disconnectChain,
  getFinalizedHead,
  readContract,
  verifyNetwork,
} from "../packages/chain/src/client";
import {
  initialize,
  json,
  manifest,
  now,
  option,
  readJson,
  writeJson,
} from "./lib";
import { verifyReadBack } from "./read-back-model";
import { syncManifestOperations } from "./manifest-operations";

configureChain({ timeoutMs: Number(option("timeout-ms", "45000")) });
const startedAt = now();
function recordAttempt(result: unknown) {
  const history = readJson<{ attempts: unknown[] }>(
    "deployments/read-back-attempts.json",
    { attempts: [] },
  );
  history.attempts.push({
    startedAt,
    finishedAt: now(),
    mode: "read-only",
    signedTransactions: 0,
    result,
  });
  writeJson("deployments/read-back-attempts.json", history);
}
initialize();
try {
  await verifyNetwork();
  const at = await getFinalizedHead();
  const result = await verifyReadBack(manifest(), at, readContract);
  recordAttempt(result);
  if (result.status !== "failed") {
    writeJson("deployments/read-back.json", result);
    // Reload before writing so a concurrently finalized deployment is not replaced.
    const current = manifest();
    current.readBack = result;
    writeJson("deployments/portaldot-v3.json", current);
    syncManifestOperations();
  }
  console.log(json(result));
  if (result.status === "failed") process.exitCode = 1;
} catch (error) {
  const result = {
    status: "blocked",
    error: error instanceof Error ? error.message : String(error),
    note: "No successful historical read-back evidence was replaced.",
  };
  recordAttempt(result);
  console.error(json(result));
  process.exitCode = 1;
} finally {
  disconnectChain();
}
