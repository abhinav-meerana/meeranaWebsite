/**
 * Screenshot harness.
 *
 * Captures the built static export at the viewports the acceptance criteria
 * name (1440x900, 1280x800, 1024x768, 390x844), plus the special modes the
 * launch checklist requires: reduced motion, and no-WebGL.
 *
 * Usage: node scripts/shoot.mjs [--mode all|desktop|reduced|nowebgl]
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SHOOT_URL ?? "http://localhost:4173/";
const OUT = path.join(process.cwd(), "docs", "review", "m4-2026-10-10");

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "390", width: 390, height: 844 },
];

const mode = process.argv.includes("--mode")
  ? process.argv[process.argv.indexOf("--mode") + 1]
  : "all";

async function shoot(browser, vp, opts = {}) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: opts.reduced ? "reduce" : "no-preference",
  });

  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

  if (opts.noWebgl) {
    // Force WebGL context creation to fail, exercising the no-WebGL path.
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        if (String(type).includes("webgl")) return null;
        return orig.call(this, type, ...rest);
      };
    });
  }

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  // Let the room assemble and the entrance settle.
  await page.waitForTimeout(opts.reduced ? 1200 : 4200);

  const suffix = [opts.reduced ? "reduced" : null, opts.noWebgl ? "nowebgl" : null]
    .filter(Boolean)
    .join("-");
  const file = path.join(OUT, `${vp.name}${suffix ? `-${suffix}` : ""}.png`);
  await page.screenshot({ path: file });

  // Measure depth evidence rather than asserting it: report whether the room
  // canvas exists, whether the grade layers are painted, and the page height.
  const metrics = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const grain = getComputedStyle(document.querySelector(".grain-overlay") ?? document.body);
    const room = document.querySelector(".hero-room");
    return {
      hasCanvas: !!canvas,
      canvasW: canvas?.width ?? 0,
      canvasH: canvas?.height ?? 0,
      grainOpacity: grain.opacity,
      grainImage: grain.backgroundImage?.slice(0, 60) ?? "",
      roomOpacity: room ? getComputedStyle(room).opacity : "n/a",
      docHeight: document.documentElement.scrollHeight,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      h1: document.querySelector("h1")?.textContent?.trim().slice(0, 80) ?? "MISSING",
    };
  });

  await context.close();
  return { vp: vp.name, suffix, errors, metrics, file };
}

const browser = await chromium.launch({
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});

await mkdir(OUT, { recursive: true });
const results = [];

if (mode === "all" || mode === "desktop") {
  for (const vp of VIEWPORTS) results.push(await shoot(browser, vp));
}
if (mode === "all" || mode === "reduced") {
  results.push(await shoot(browser, VIEWPORTS[0], { reduced: true }));
}
if (mode === "all" || mode === "nowebgl") {
  results.push(await shoot(browser, VIEWPORTS[0], { noWebgl: true }));
}

await browser.close();

for (const r of results) {
  const m = r.metrics;
  console.log(
    `\n${r.vp}${r.suffix ? ` (${r.suffix})` : ""} -> ${path.basename(r.file)}\n` +
      `  canvas=${m.hasCanvas} ${m.canvasW}x${m.canvasH}  roomOpacity=${m.roomOpacity}  grain=${m.grainOpacity}\n` +
      `  h1="${m.h1}"\n` +
      `  docHeight=${m.docHeight}  overflowX=${m.overflowX} (${m.scrollW} vs ${m.innerW})\n` +
      `  consoleErrors=${r.errors.length ? r.errors.slice(0, 3).join(" | ") : "none"}`,
  );
}
