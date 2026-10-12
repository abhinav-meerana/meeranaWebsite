/**
 * One viewport screenshot per route per width (390 / 1024 / 1440), for the
 * before/after record the acceptance checklist asks for (plan/13, audit §M).
 *
 * Usage: node scripts/shoot-routes.mjs [outDir]
 * Default outDir: docs/review/<today>/after
 * Needs the export served on http://localhost:4173 (`npm run build && npm start`).
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.VERIFY_URL ?? "http://localhost:4173";
const today = new Date().toISOString().slice(0, 10);
const OUT = process.argv[2] ?? path.join(process.cwd(), "docs", "review", today, "after");
await mkdir(OUT, { recursive: true });

const ROUTES = [
  ["home", "/"],
  ["mandoobee", "/products/mandoobee/"],
  ["tasree3", "/products/tasree3/"],
  ["nazo", "/products/nazo/"],
  ["yisbir", "/products/yisbir/"],
  ["wasel", "/products/wasel/"],
  ["ai-in-a-box", "/products/ai-in-a-box/"],
  ["company", "/company/"],
  ["services", "/services/"],
  ["contact", "/contact/?interest=yisbir"],
  ["not-found", "/this-page-does-not-exist/"],
];
const WIDTHS = [
  [390, 844],
  [1024, 768],
  [1440, 900],
];

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
for (const [w, h] of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: w < 768,
    hasTouch: w < 768,
  });
  const page = await ctx.newPage();
  for (const [name, route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(w >= 1280 && name === "home" ? 4500 : 1800);
    await page.screenshot({ path: path.join(OUT, `${name}-${w}.png`) });
    console.log(`${name} @ ${w}`);
  }
  await ctx.close();
}
await browser.close();
console.log(`\nWrote ${ROUTES.length * WIDTHS.length} screenshots to ${OUT}`);
