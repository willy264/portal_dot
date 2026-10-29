import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const requireWeb = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const requireNext = createRequire(requireWeb.resolve("next/package.json"));
const sharp = requireNext("sharp");
const root = fileURLToPath(
  new URL("../apps/web/public/brand/", import.meta.url),
);
const exports = [
  ["logo", 2400],
  ["logo-reversed", 2400],
  ["logo-mono", 2400],
  ["logo-white", 2400],
  ["mark", 1024],
  ["mark-mono", 1024],
  ["icon", 1024],
  ["preview", 1600],
];
for (const [name, width] of exports) {
  const bytes = await readFile(`${root}${name}.svg`);
  await sharp(bytes, { density: 300 })
    .resize({ width })
    .png()
    .toFile(`${root}${name}.png`);
}
const icon = await readFile(`${root}icon.svg`);
await sharp(icon, { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(`${root}apple-touch-icon.png`);
await writeFile(`${root}favicon.svg`, icon);
console.log(
  `Exported ${exports.length} PNG variants, an Apple touch icon and an SVG favicon.`,
);
