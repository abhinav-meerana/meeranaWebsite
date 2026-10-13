#!/usr/bin/env node
/**
 * Review screenshots of the redesign: every story keyframe and the landing
 * sections, at desktop, laptop, tablet and phone sizes, plus reduced motion
 * and the open PillNav panel / expanded wheel. Against the export on :4173.
 *
 *   node scripts/shoot-redesign.mjs [outDir=docs/review/2026-10-12-redesign/shots]
 *
 * PNGs under docs/review are git-ignored (regenerated, not committed).
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { BASE, launch, newPage, goto, until } from "./verify-lib.mjs";

const OUT = path.resolve(process.argv[2] ?? "docs/review/2026-10-12-redesign/shots");
const { KEYS, SCHEDULE } = await import(pathToFileURL(path.resolve("components/story/poses.ts")).href);

const mids = (() => {
  let t = SCHEDULE.opening[1];
  const m = { opening: SCHEDULE.opening[1] / 2 };
  for (const k of KEYS.slice(1)) {
    t += SCHEDULE[k][0];
    m[k] = t + SCHEDULE[k][1] / 2;
    t += SCHEDULE[k][1];
  }
  return Object.fromEntries(KEYS.map((k) => [k, m[k] / t]));
})();

async function settle(p) {
  await p.waitForTimeout(700);
  const t0 = Date.now();
  while (Date.now() - t0 < 25000) {
    const lag = await p.evaluate(() => {
      const s = document.querySelector(".story");
      const bar = document.querySelector(".story-progress-bar");
      if (!s || !bar || getComputedStyle(s.querySelector(".story-pin")).position !== "sticky") return 0;
      const want = Math.min(1, Math.max(0, (scrollY - s.offsetTop) / (s.offsetHeight - innerHeight)));
      return Math.abs(want - new DOMMatrix(getComputedStyle(bar).transform).a);
    });
    if (lag < 0.0015) break;
    await p.waitForTimeout(150);
  }
  await p.waitForTimeout(400);
}

const browser = await launch();
const VPS = [
  { name: "desktop-1440", w: 1440, h: 900 },
  { name: "laptop-1366", w: 1366, h: 657 },
  { name: "tablet-820", w: 820, h: 1180, touch: true },
  { name: "phone-390", w: 390, h: 844, touch: true },
];
for (const vp of VPS) {
  const dir = path.join(OUT, vp.name);
  await mkdir(dir, { recursive: true });
  const { page: p, ctx } = await newPage(browser, vp);
  await goto(p, "/");
  await until(p, () => document.querySelector(".story")?.dataset.story === "ready", null, 10000);
  for (const [i, k] of KEYS.entries()) {
    await p.evaluate((prog) => {
      const s = document.querySelector(".story");
      window.scrollTo(0, Math.round(s.offsetTop + prog * (s.offsetHeight - innerHeight)));
    }, mids[k]);
    await settle(p);
    if (k === "universe" && !vp.touch) {
      await p.mouse.move(vp.w * 0.82, vp.h * 0.7, { steps: 6 });
      await p.waitForTimeout(1500);
    }
    await p.screenshot({ path: path.join(dir, `story-${String(i).padStart(2, "0")}-${k}.png`) });
  }
  for (const id of ["platforms", "solutions", "technology", "how", "proof", "about", "contact"]) {
    await p.evaluate((x) => document.getElementById(x)?.scrollIntoView(), id);
    await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(dir, `section-${id}.png`) });
  }
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(dir, "section-footer.png") });
  /* Navigation open. */
  await p.evaluate(() => document.getElementById("about").scrollIntoView());
  await p.waitForTimeout(500);
  if (vp.w >= 1024) {
    await p.click(".pill-nav button.pill");
  } else {
    await p.tap(".wheel-dock .option-wheel");
  }
  await p.waitForTimeout(1600);
  await p.screenshot({ path: path.join(dir, "nav-open.png") });
  await ctx.close();
}
/* Reduced motion: the static story. */
for (const vp of [{ name: "desktop-1440-reduced", w: 1440, h: 900, reduced: true }, { name: "phone-390-reduced", w: 390, h: 844, touch: true, reduced: true }]) {
  const dir = path.join(OUT, vp.name);
  await mkdir(dir, { recursive: true });
  const { page: p, ctx } = await newPage(browser, vp);
  await goto(p, "/");
  await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(dir, "story-static-full.png"), fullPage: false });
  await p.evaluate(() => document.querySelector(".story-world").scrollIntoView({ block: "center" }));
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(dir, "story-static-universe.png") });
  await ctx.close();
}
/* Other routes with the new nav and background. */
{
  const { page: p, ctx } = await newPage(browser, { w: 1440, h: 900 });
  const dir = path.join(OUT, "routes-1440");
  await mkdir(dir, { recursive: true });
  for (const r of ["/products/", "/products/wasel/", "/company/", "/services/", "/contact/"]) {
    await goto(p, r);
    await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(dir, `${r.replace(/\//g, "-").replace(/^-|-$/g, "") || "home"}.png`) });
  }
  await ctx.close();
}
await browser.close();
console.log(`shoot-redesign: screenshots in ${OUT} (${BASE})`);
