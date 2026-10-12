/**
 * Full-page review capture.
 *
 * Walks the page a viewport at a time and saves each frame, plus one frame per
 * named section. Uses viewport captures rather than `fullPage: true`: the hero
 * room renders continuously, and a full-page capture has to composite the whole
 * document in one pass, which never stabilises while a canvas is animating.
 *
 * Usage: node scripts/shoot-full.mjs [width] [height]
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const WIDTH = Number(process.argv[2] ?? 1440);
const HEIGHT = Number(process.argv[3] ?? 900);
const BASE = process.env.SHOOT_URL ?? "http://localhost:4173/";
const OUT = path.join(process.cwd(), "docs", "review", "m4-2026-10-10");

const browser = await chromium.launch({
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

/*
 * Capture through CDP rather than page.screenshot().
 *
 * The page always has something animating — the hero room renders continuously
 * and the logo strip loops — so Playwright's actionability/stability wait never
 * settles and the screenshot times out. Page.captureScreenshot grabs the current
 * frame without waiting for quiescence, which is exactly what a review capture
 * needs.
 */
const cdp = await page.context().newCDPSession(page);

async function shot(file) {
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(file, Buffer.from(data, "base64"));
}

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(3000);

const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
await mkdir(OUT, { recursive: true });

/* ---- step through the page, one viewport at a time --------------------- */
const step = Math.floor(HEIGHT * 0.9);
let frame = 0;
for (let y = 0; y < docHeight - 40; y += step) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  // Let scroll-driven reveals settle before capturing.
  await page.waitForTimeout(1100);
  await shot(
    path.join(OUT, `walk-${WIDTH}-${String(frame).padStart(2, "0")}.png`),
  );
  frame += 1;
}

/* ---- one frame per named section --------------------------------------- */
const sections = await page.evaluate(() =>
  [...document.querySelectorAll("section")].map((s, i) => {
    const r = s.getBoundingClientRect();
    return {
      id: s.id || `sec${i}`,
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
    };
  }),
);

for (const s of sections) {
  await page.evaluate((v) => window.scrollTo(0, v), s.top);
  await page.waitForTimeout(1000);
  await shot(path.join(OUT, `sec-${s.id}.png`));
}

const metrics = await page.evaluate(() => ({
  docHeight: document.documentElement.scrollHeight,
  scrollW: document.documentElement.scrollWidth,
  innerW: window.innerWidth,
  sections: document.querySelectorAll("section").length,
  cards: document.querySelectorAll(".product-card").length,
  logos: document.querySelectorAll(".logo-loop img").length,
  h1s: document.querySelectorAll("h1").length,
  h2s: document.querySelectorAll("h2").length,
  imgsNoAlt: [...document.querySelectorAll("img")].filter(
    (i) => !i.hasAttribute("alt") && !i.closest("[aria-hidden='true']"),
  ).length,
}));

await browser.close();

console.log(
  `viewport=${WIDTH}x${HEIGHT}  docHeight=${metrics.docHeight}  overflowX=${
    metrics.scrollW > metrics.innerW
  }\n` +
    `frames=${frame}  sections=${metrics.sections}  cards=${metrics.cards}  logos=${metrics.logos}  h1=${metrics.h1s}  h2=${metrics.h2s}  imgsWithoutAlt=${metrics.imgsNoAlt}\n` +
    `consoleErrors=${errors.length ? errors.slice(0, 4).join(" | ") : "none"}`,
);
for (const s of sections) console.log(`  sec-${s.id}.png  y=${s.top}  h=${s.height}`);
