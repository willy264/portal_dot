import { config as loadEnv } from "dotenv";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { type Address } from "viem";
import {
  configureChain,
  configureNativeScheduler,
  disconnectChain,
  getApi,
  readContract,
  scheduleCronpot,
  verifyNetwork,
  type ChainSigner,
} from "@metermend/chain";
import { signerFromSeed } from "@metermend/chain/node";
import { cronpotAbi, meterMendAbi } from "@metermend/chain/abi";
import { Store, Scanner, json } from "@metermend/service-core";
import { JobEngine } from "./engine.js";
import { SubstrateSource } from "./source.js";
import { evidenceRoutes } from "./evidence.js";
import { eventRoutes } from "./events.js";
import {
  parseExecutionProfile,
  type ExecutionProfile,
} from "./execution-profile.js";
import { executeKeeperRefund, verifyKeeperConfiguration } from "./preflight.js";
import { bootstrapPreview } from "./bootstrap.js";

const root = fileURLToPath(new URL("../../../", import.meta.url));
loadEnv({ path: root + ".env", quiet: true });
configureChain({
  wssUrl: process.env.WSS_URL ?? "wss://test-node-v3.portaldot.dev",
  evmRpcUrl: process.env.EVM_RPC_URL ?? "https://test-evm-rpc-v3.portaldot.dev",
  timeoutMs: Number(process.env.CHAIN_TIMEOUT_MS ?? "45000"),
});
const store = new Store(process.env.DB_PATH ?? root + "data/cronpot.sqlite");
let manifest: any = null;
try {
  manifest = JSON.parse(
    await readFile(
      resolve(
        root,
        process.env.DEPLOYMENT_MANIFEST ?? "deployments/portaldot-v3.json",
      ),
      "utf8",
    ),
  );
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
await bootstrapPreview(store, root, manifest);
const cronpot = (process.env.CRONPOT_ADDRESS ||
  manifest?.contracts?.Cronpot?.address) as Address | undefined;
const meterMend = (process.env.METERMEND_ADDRESS ||
  manifest?.contracts?.MeterMend?.address) as Address | undefined;
const startBlock = Number(
  process.env.START_BLOCK ??
    Math.min(
      manifest?.contracts?.Cronpot?.block ?? NaN,
      manifest?.contracts?.MeterMend?.block ?? NaN,
    ),
);
const requestedMode = process.env.MODE ?? manifest?.cronpotMode ?? "keeper";
const mode: "native" | "keeper" =
  requestedMode === "native" && manifest?.nativeScheduler?.verified === true
    ? "native"
    : "keeper";
let signer: ChainSigner | null = null;
let scanner: Scanner | null = null;
let engine: JobEngine | null = null;
let lastError: string | null = null;
let signerError: string | null = null;
const readOnly = process.env.READ_ONLY === "1";
let profile: ExecutionProfile | null = null;
try {
  profile = parseExecutionProfile(
    manifest?.executionProfile,
    cronpot ?? "",
    meterMend ?? "",
  );
} catch (error) {
  signerError = error instanceof Error ? error.message : String(error);
}
let busy = false;
let stopped = false;

async function initialize() {
  if (
    !cronpot ||
    !meterMend ||
    !/^0x[0-9a-fA-F]{40}$/.test(cronpot) ||
    !/^0x[0-9a-fA-F]{40}$/.test(meterMend) ||
    !Number.isSafeInteger(startBlock) ||
    startBlock < 0
  )
    throw new Error(
      "Verified contract addresses and deployment/start block are required",
    );
  await verifyNetwork();
  if (mode === "native") {
    const capability = manifest.nativeScheduler;
    configureNativeScheduler({
      ...capability,
      p5Verified: true,
      weight: {
        ref_time: BigInt(capability.weight.ref_time),
        proof_size: BigInt(capability.weight.proof_size),
      },
      storageDepositLimit: BigInt(capability.storageDepositLimit),
    });
  }
  const source = new SubstrateSource([
    { address: cronpot, abi: cronpotAbi },
    { address: meterMend, abi: meterMendAbi },
  ]);
  scanner = new Scanner(store, source, startBlock);
  const blockTimeMs = Number(await getApi().constants.Babe.ExpectedBlockTime());
  engine = new JobEngine(
    store,
    {
      readJob: async (id) => {
        const result = await readContract<
          readonly [Address, Address, bigint, number, bigint]
        >(cronpotAbi, cronpot, "jobs", [id]);
        return { status: result[3], executeAfter: result[2] };
      },
      execute: async (id, onStatus) => {
        if (!signer || !profile || readOnly)
          throw new Error(
            "Relayer writes are disabled; verify the deployment execution profile first",
          );
        return await executeKeeperRefund({
          signer,
          profile,
          jobId: id,
          journal: (evidence) =>
            store.observation("keeper-preflight", evidence),
          onStatus,
        });
      },
      schedule: async (job, delayBlocks, onStatus) => {
        if (!signer) throw new Error("Relayer signer is not configured");
        return await scheduleCronpot({
          signer,
          address: cronpot,
          jobId: BigInt(job.id),
          delayBlocks,
          onStatus,
        });
      },
      reconcile: (txHash, fromBlock, throughBlock, operation) =>
        source.reconcile(txHash, fromBlock, throughBlock, operation),
    },
    mode,
    meterMend,
    blockTimeMs,
  );
}

async function tick() {
  if (busy || stopped) return;
  busy = true;
  try {
    if (!scanner || !engine) await initialize();
    if (!signer && !readOnly && profile && process.env.RELAYER_SEED) {
      try {
        const candidate = signerFromSeed(process.env.RELAYER_SEED);
        const verification = await verifyKeeperConfiguration(
          profile,
          root,
          candidate,
        );
        store.observation("keeper-configuration-verified", verification);
        signer = candidate;
        signerError = null;
      } catch (error) {
        signerError =
          error instanceof Error
            ? error.message
            : "Relayer funding/mapping unavailable";
      }
    }
    await scanner!.tick();
    const cursor = store.cursor("chain");
    const from = (store.cursor("jobs")?.block ?? startBlock - 1) + 1;
    if (cursor && cursor.block >= from)
      store.transaction(() => {
        engine!.ingest(store.eventRange(from, cursor.block));
        store.setCursor("jobs", cursor.block, cursor.hash);
      });
    if (signer && scanner!.lastHead)
      await engine!.tick(scanner!.lastHead.timestamp, scanner!.lastHead.number);
    lastError = null;
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error);
    console.error(lastError);
  } finally {
    busy = false;
  }
}
const app = new Hono();
app.get("/health", (c) =>
  c.json({
    network: "portaldot-v3-testnet",
    configured: !!scanner,
    mode,
    requestedMode,
    startBlock,
    signer: signer?.address ?? null,
    signerError,
    writesEnabled: !!signer && !!profile && !readOnly,
    readOnly,
    storageMode: process.env.STORAGE_MODE ?? "local-persistent-disk",
    executionProfile: profile?.id ?? null,
    cursor: store.cursor("chain") ?? null,
    gap: scanner?.gap ?? null,
    error: lastError,
  }),
);
app.get("/jobs", (c) =>
  c.body(
    json({ mode, jobs: store.jobs(), observations: store.observations(50) }),
    200,
    { "Content-Type": "application/json" },
  ),
);
app.route(
  "/events",
  eventRoutes(store, startBlock, () => ({
    gap: scanner?.gap ?? lastError,
    automaticRefundCount: engine?.automaticRefundCount() ?? null,
  })),
);
app.route(
  "/api/evidence",
  evidenceRoutes(
    process.env.EVIDENCE_DIR ?? root + "data/evidence",
    process.env.EVIDENCE_BACKEND_TOKEN,
  ),
);
const server = serve({
  fetch: app.fetch,
  port: Number(process.env.PORT ?? "8787"),
  hostname: "0.0.0.0",
});
const timer = setInterval(() => void tick(), 10_000);
void tick();
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    stopped = true;
    clearInterval(timer);
    server.close();
    const drain = setInterval(() => {
      if (!busy) {
        clearInterval(drain);
        store.close();
        disconnectChain();
        process.exit(0);
      }
    }, 100);
  });
