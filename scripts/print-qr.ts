import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeEventLog, toHex, type Hex } from "viem";
import { meterMendAbi } from "../packages/chain/src/abi";

const root = fileURLToPath(new URL("../", import.meta.url));
const origin = "https://metermend.vercel.app";
const hashPattern = /^0x[0-9a-f]{64}$/i;
const addressPattern = /^0x[0-9a-f]{40}$/i;
type Receipt = {
  txHash: string;
  block: number;
  blockHash: string;
  events: any[];
};
type Deployment = {
  network: string;
  chainId: number;
  contracts: Record<string, Receipt & { address: string }>;
};
type Seed = {
  contract: string;
  items: Record<string, Receipt & { itemId: string; name: string }>;
};
export type QRPlan = {
  network: string;
  chainId: number;
  origin: string;
  contract: string;
  labels: {
    name: string;
    itemId: string;
    url: string;
    registration: Omit<Receipt, "events">;
  }[];
};

function verifiedReceipt(value: Receipt | undefined): value is Receipt {
  if (
    !value ||
    !hashPattern.test(value.txHash) ||
    !hashPattern.test(value.blockHash) ||
    !Number.isSafeInteger(value.block) ||
    value.block < 0 ||
    !Array.isArray(value.events)
  )
    return false;
  const events = value.events.map((raw) => raw.event ?? raw);
  return (
    events.some(
      (event) =>
        event.type === "System" && event.value?.type === "ExtrinsicSuccess",
    ) &&
    !events.some(
      (event) =>
        event.type === "System" && event.value?.type === "ExtrinsicFailed",
    )
  );
}

/** Labels come only from the current deployment's retained successful registration receipts. */
export function qrPlan(deployment: Deployment, seed: Seed): QRPlan {
  if (
    deployment.network !== "portaldot-v3-testnet" ||
    deployment.chainId !== 420420777
  )
    throw new Error(
      "A verified V3 deployment is required before printing labels",
    );
  for (const name of ["Cronpot", "MeterMend"]) {
    const contract = deployment.contracts[name];
    if (!verifiedReceipt(contract) || !addressPattern.test(contract!.address))
      throw new Error(
        `A finalized ${name} deployment receipt is required before printing labels`,
      );
  }
  const address = deployment.contracts.MeterMend!.address;
  if (!seed || seed.contract?.toLowerCase() !== address.toLowerCase())
    throw new Error(
      "Seed records must belong to the current MeterMend deployment",
    );
  const records = Object.values(seed.items ?? {});
  if (records.length === 0)
    throw new Error(
      "No recorded demo items are available; run the guarded seed script first",
    );
  const seen = new Set<string>();
  const labels = records.map((item) => {
    if (
      !verifiedReceipt(item) ||
      typeof item.itemId !== "string" ||
      !/^[1-9]\d*$/.test(item.itemId) ||
      seen.has(item.itemId) ||
      typeof item.name !== "string" ||
      !item.name.trim()
    )
      throw new Error(
        "Every label needs a unique real item ID and successful registration receipt",
      );
    let matches = false;
    for (const raw of item.events) {
      const event = raw.event ?? raw;
      if (event.type !== "Revive" || event.value?.type !== "ContractEmitted")
        continue;
      const value = event.value.value;
      if (String(value.contract).toLowerCase() !== address.toLowerCase())
        continue;
      try {
        const decoded = decodeEventLog({
          abi: meterMendAbi,
          data:
            typeof value.data === "string"
              ? (value.data as Hex)
              : toHex(value.data),
          topics: value.topics,
          strict: true,
        });
        if (
          decoded.eventName === "ItemRegistered" &&
          String(decoded.args.itemId) === item.itemId
        )
          matches = true;
      } catch {
        /* Other events are not registration evidence. */
      }
    }
    if (!matches)
      throw new Error(
        `Item ${item.itemId} does not match its retained ItemRegistered event`,
      );
    seen.add(item.itemId);
    return {
      name: item.name,
      itemId: item.itemId,
      url: `${origin}/items/${item.itemId}`,
      registration: {
        txHash: item.txHash,
        block: item.block,
        blockHash: item.blockHash,
      },
    };
  });
  return {
    network: deployment.network,
    chainId: deployment.chainId,
    origin,
    contract: address,
    labels,
  };
}

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
export function qrHTML(plan: QRPlan): string {
  const requireWeb = createRequire(resolve(root, "apps/web/package.json"));
  const { createElement } = requireWeb("react");
  const { renderToStaticMarkup } = requireWeb("react-dom/server");
  const { QRCodeSVG } = requireWeb("qrcode.react");
  const labels = plan.labels
    .map(
      (item) =>
        `<article><h2>${escape(item.name)}</h2>${renderToStaticMarkup(createElement(QRCodeSVG, { value: item.url, size: 240, level: "M", marginSize: 4, title: `${item.name}: ${item.url}` }))}<strong>MM / ${escape(item.itemId)} · SCAN TO RENT</strong><a href="${escape(item.url)}">${escape(item.url)}</a><p>Portaldot V3 testnet · demonstration equipment</p><small>Registration block ${item.registration.block}<br>${escape(item.registration.txHash)}</small></article>`,
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>MeterMend · printable equipment labels</title><style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#20251e;max-width:186mm;margin:16px auto}h1{font-size:26px;margin:0 0 10px}.instruction{font-size:14px;line-height:1.5}main{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin-top:7mm}article{border:1.5px dashed #20251e;padding:5mm;text-align:center;break-inside:avoid;page-break-inside:avoid}h2{font-size:19px;margin:0 0 4mm}svg{display:block;width:58mm;height:58mm;max-width:100%;margin:auto}strong,a{display:block;margin-top:3mm;font-size:14px}a{color:inherit;overflow-wrap:anywhere}p{font-size:12px}small{font:10px Consolas,monospace;overflow-wrap:anywhere}footer{margin-top:8mm;font-size:11px;line-height:1.5;overflow-wrap:anywhere}button{padding:9px 16px;margin:10px 0}@media print{body{margin:0}.no-print{display:none}}</style></head><body><h1>MeterMend · Every rental funds its next repair.</h1><p class="instruction">Print at 100% scale on A4; keep the white QR border. Attach each label to its matching demo item. Scan with a real phone and confirm the printed URL before approving any wallet request.</p><button class="no-print" onclick="window.print()">Print labels / Save as PDF</button><main>${labels}</main><footer>Chain ${plan.chainId} · MeterMend ${escape(plan.contract)}<br>Generated from retained registration receipts. Printed labels do not establish that the public phone rental flow has passed. Record that rehearsal separately.</footer></body></html>`;
}

async function main() {
  const destination = resolve(root, "apps/web/public/metermend-qr.html");
  try {
    const [deployment, seed] = await Promise.all([
      readFile(resolve(root, "deployments/portaldot-v3.json"), "utf8"),
      readFile(resolve(root, "deployments/seed.json"), "utf8"),
    ]);
    const plan = qrPlan(JSON.parse(deployment), JSON.parse(seed));
    const html = qrHTML(plan);
    await writeFile(destination, html, "utf8");
    const evidence = {
      observedAt: new Date().toISOString(),
      status: "generated-phone-rehearsal-pending",
      ...plan,
      artifact: "apps/web/public/metermend-qr.html",
      sha256: createHash("sha256").update(html).digest("hex"),
      publicUrl: `${origin}/metermend-qr.html`,
      publicLinkVerified: false,
      phoneRehearsal: "not-yet-recorded",
    };
    await writeFile(
      resolve(root, "deployments/qr-labels.json"),
      `${JSON.stringify(evidence, null, 2)}\n`,
    );
    console.log(
      JSON.stringify(
        {
          artifact: evidence.artifact,
          labels: plan.labels.map(({ itemId, url }) => ({ itemId, url })),
        },
        null,
        2,
      ),
    );
  } catch (error) {
    const reason =
      (error as NodeJS.ErrnoException).code === "ENOENT"
        ? "Finalized deployment and deployments/seed.json are required; no labels were generated."
        : error instanceof Error
          ? error.message
          : String(error);
    await writeFile(
      resolve(root, "deployments/qr-labels.json"),
      `${JSON.stringify({ observedAt: new Date().toISOString(), status: "blocked-awaiting-finalized-deployment-and-seeding", reason, artifact: null, phoneRehearsal: "not-yet-recorded" }, null, 2)}\n`,
    );
    console.error(reason);
    process.exitCode = 1;
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
