import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const requireWeb = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const requireNext = createRequire(requireWeb.resolve("next/package.json"));
const sharp = requireNext("sharp");
const directory = fileURLToPath(new URL("./fixtures/", import.meta.url));
await mkdir(directory, { recursive: true });
const records = [];
for (const [name, title] of [
  ["return", "RETURN WORKFLOW"],
  ["dispute", "DEDUCTION REVIEW"],
  ["repair", "REPAIR PAYMENT"],
]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#f6f2eb"/><rect x="44" y="44" width="872" height="452" rx="22" fill="#fff" stroke="#161616" stroke-width="3"/><rect x="44" y="44" width="872" height="84" rx="22" fill="#ff6a13"/><text x="80" y="100" font-family="Arial,sans-serif" font-size="38" font-weight="700">MeterMend / ${title}</text><text x="80" y="210" font-family="Arial,sans-serif" font-size="42" font-weight="700">DEMO FIXTURE</text><text x="80" y="278" font-family="Arial,sans-serif" font-size="28">Not evidence of an actual physical</text><text x="80" y="320" font-family="Arial,sans-serif" font-size="28">rental or repair.</text><text x="80" y="404" font-family="Arial,sans-serif" font-size="24">Exercises image hashing, storage and approval.</text><text x="80" y="447" font-family="Arial,sans-serif" font-size="24">Real testnet transactions are recorded separately.</text></svg>`;
  const png = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(`${directory}/${name}.svg`, svg);
  await writeFile(`${directory}/${name}.png`, png);
  records.push({
    name,
    path: `scripts/fixtures/${name}.png`,
    bytes: png.length,
    sha256: createHash("sha256").update(png).digest("hex"),
    provenance:
      "Locally rendered labeled SVG text fixture; not a photograph or a real-world receipt.",
  });
}
await writeFile(
  `${directory}/provenance.json`,
  `${JSON.stringify({ generator: "scripts/make-demo-fixtures.mjs", fixtures: records }, null, 2)}\n`,
);
console.log(JSON.stringify(records));
