import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourcePath = join(root, "docs/pitch/index.html");
const pdfPath = join(root, "apps/web/public/metermend-pitch.pdf");
const evidencePath = join(root, "deployments/submission-materials.json");
let previousEvidence = {};
try {
  previousEvidence = JSON.parse(await readFile(evidencePath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const previews = join(root, "docs/pitch/previews");
const profile = join(root, ".tools", `pitch-browser-${Date.now()}`);
await Promise.all([
  mkdir(previews, { recursive: true }),
  mkdir(profile, { recursive: true }),
]);
let html = await readFile(sourcePath, "utf8");
for (const match of [...html.matchAll(/src="([^"]+\.svg)"/g)]) {
  const path = resolve(dirname(sourcePath), match[1]);
  if (
    !path.startsWith(resolve(root) + "/") &&
    !path.startsWith(resolve(root) + "\\")
  )
    throw new Error("A deck image must be inside the repository");
  const bytes = await readFile(path);
  html = html.replaceAll(
    match[0],
    `src="data:image/svg+xml;base64,${bytes.toString("base64")}"`,
  );
}
const server = createServer((_request, response) => {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
});
await new Promise((resolveReady) =>
  server.listen(0, "127.0.0.1", resolveReady),
);
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = spawn(
  process.env.CHROMIUM_PATH ??
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
let socket;
let sequence = 0;
const calls = new Map();
const pause = (ms) =>
  new Promise((resolvePause) => setTimeout(resolvePause, ms));
const browserErrors = [];
const send = (method, params = {}) =>
  new Promise((resolveCall, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => {
      calls.delete(id);
      reject(new Error(`${method} timed out`));
    }, 30_000);
    calls.set(id, { resolve: resolveCall, reject, timeout });
    socket.send(JSON.stringify({ id, method, params }));
  });
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      port = Number(
        (await readFile(join(profile, "DevToolsActivePort"), "utf8")).split(
          "\n",
        )[0],
      );
    } catch {}
    if (port) break;
    await pause(200);
  }
  if (!port) throw new Error("Chromium debugging did not become available");
  const target = await (
    await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
      method: "PUT",
    })
  ).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    socket.onopen = resolveOpen;
    socket.onerror = reject;
  });
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const call = calls.get(message.id);
      if (!call) return;
      clearTimeout(call.timeout);
      calls.delete(message.id);
      if (message.error) call.reject(new Error(JSON.stringify(message.error)));
      else call.resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown")
      browserErrors.push(message.params.exceptionDetails);
  };
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1600,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: origin });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails)
      throw new Error("Deck browser evaluation failed");
    return result.result?.value;
  };
  for (let attempt = 0; attempt < 100; attempt++) {
    if (
      await evaluate(
        "document.readyState === 'complete' && Array.from(document.images).every(image => image.complete && image.naturalWidth > 0)",
      )
    )
      break;
    if (attempt === 99) throw new Error("Deck images did not load");
    await pause(100);
  }
  const slides =
    await evaluate(`Array.from(document.querySelectorAll('.slide')).map(slide => {
    const r = slide.getBoundingClientRect();
    const overflow = Array.from(slide.querySelectorAll('*')).filter(el => {
      const box = el.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && (box.left < r.left - 1 || box.right > r.right + 1 || box.top < r.top - 1 || box.bottom > r.bottom + 1 || el.scrollWidth > el.clientWidth + 2);
    }).map(el => ({tag:el.tagName,text:el.textContent?.trim().slice(0,80)}));
    const footerTop = slide.querySelector('.foot').getBoundingClientRect().top;
    const footerOverlap = Array.from(slide.children).filter(el => !el.classList.contains('foot') && el.getBoundingClientRect().bottom > footerTop - 16).map(el => el.tagName);
    return {id:slide.id,top:r.top + window.scrollY,width:r.width,height:r.height,overflow,footerOverlap};
  })`);
  if (
    slides.length !== 10 ||
    slides.some((slide) => slide.overflow.length || slide.footerOverlap.length)
  )
    throw new Error(`Deck page layout failed: ${JSON.stringify(slides)}`);
  if (browserErrors.length)
    throw new Error("The deck produced browser exceptions");
  for (let index = 0; index < slides.length; index++) {
    const slide = slides[index];
    const screenshot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { x: 0, y: slide.top, width: 1600, height: 900, scale: 1 },
    });
    await writeFile(
      join(previews, `slide-${String(index + 1).padStart(2, "0")}.png`),
      Buffer.from(screenshot.data, "base64"),
    );
  }
  await send("Emulation.setEmulatedMedia", { media: "print" });
  const printed = await send("Page.printToPDF", {
    printBackground: true,
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  });
  const pdf = Buffer.from(printed.data, "base64");
  await writeFile(pdfPath, pdf);
  const requireWeb = createRequire(join(root, "apps/web/package.json"));
  const requireNext = createRequire(requireWeb.resolve("next/package.json"));
  const sharp = requireNext("sharp");
  const tiles = await Promise.all(
    slides.map(async (_slide, index) => ({
      input: await sharp(
        join(previews, `slide-${String(index + 1).padStart(2, "0")}.png`),
      )
        .resize(800, 450)
        .toBuffer(),
      left: (index % 2) * 800,
      top: Math.floor(index / 2) * 450,
    })),
  );
  await sharp({
    create: { width: 1600, height: 2250, channels: 3, background: "#f8f7f2" },
  })
    .composite(tiles)
    .png()
    .toFile(join(previews, "contact-sheet.png"));
  const evidence = {
    ...previousEvidence,
    observedAt: new Date().toISOString(),
    status: "live-corrected-refund-recorded-video-and-submission-pending",
    summary:
      "Ten-slide pitch deck exported and browser-checked. Original Cronpot failed with OutOfGas; the first deposit was refunded directly, and corrected Cronpot executed a live automatic refund on the existing MeterMend. Free scheduled keeper and permissionless fallback replace paid hosting. Phone rehearsal, video and final submission remain outstanding. This revised PDF requires publication verification.",
    deadline: {
      internal: "2026-11-05T22:00:00+01:00",
      official: "2026-11-06T05:00:00+01:00",
      timezone: "Africa/Lagos",
    },
    deck: {
      status: "generated",
      path: "apps/web/public/metermend-pitch.pdf",
      publicUrl: "https://metermend.vercel.app/metermend-pitch.pdf",
      publicLinkVerified: false,
      source: "docs/pitch/index.html",
      sha256: createHash("sha256").update(pdf).digest("hex"),
      bytes: pdf.length,
      slides: slides.length,
      layout: "16:9",
      exportedWith:
        "Chromium Page.printToPDF; CSS page size 1600px x 900px; vector text and SVG",
      validation: {
        overflowChecks: "passed",
        browserExceptions: 0,
        screenshots: "docs/pitch/previews/",
        visualReview: "pending",
      },
      previousPublications: [
        ...(previousEvidence.deck?.previousPublications ?? []),
        ...(previousEvidence.deck?.publicLinkVerified
          ? [
              {
                sha256: previousEvidence.deck.sha256,
                publicLinks: previousEvidence.deck.publicLinks ?? [],
                verifiedAt: previousEvidence.deck.publicLinkVerifiedAt,
              },
            ]
          : []),
      ],
    },
    submission: {
      path: "docs/SUBMISSION.md",
      status: "ready-for-final-video-link-and-owner-submission",
    },
    video: previousEvidence.video ?? {
      status: "not-recorded",
      publicUrl: null,
    },
    caveats: [
      "The proposed business model is not implemented platform-fee collection.",
      "Test counts are engineering evidence, not live application settlement.",
      "Public deck URL is the intended location; verify it after publishing before claiming availability.",
    ],
  };
  await writeFile(
    join(root, "deployments/submission-materials.json"),
    `${JSON.stringify(evidence, null, 2)}\n`,
  );
  console.log(
    JSON.stringify(
      {
        pdf: pdfPath,
        slides: slides.length,
        bytes: pdf.length,
        sha256: evidence.deck.sha256,
        overflow: 0,
        browserExceptions: 0,
        screenshots: previews,
      },
      null,
      2,
    ),
  );
} finally {
  socket?.close();
  for (const call of calls.values()) clearTimeout(call.timeout);
  browser.kill();
  await new Promise((resolveClosed) => server.close(resolveClosed));
}
