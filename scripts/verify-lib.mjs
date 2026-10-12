/**
 * Shared harness for the verify-* scripts (FINAL-SPEC §10, §12).
 *
 * Everything here measures rendered behaviour in Playwright Chromium (software
 * GL, so the 3D room and the stage run headless). Nothing asserts that code
 * exists. Each check is filed under its acceptance id (P-03, G-04, …) so the
 * summary can say which ids passed, failed or could not run, and why.
 *
 *   VERIFY_URL   base URL (default http://localhost:4173, the static build)
 *   --only a,b   run only these groups (each script lists its groups)
 *   --vp WxH,…   run only these viewports (a touch viewport is "1024x768t")
 *   --slug a,b   product slugs (verify-stage only)
 *   --quick      a small viewport set (1024x520, 1366x657, 1920x937 + one rail)
 *   --shots none|key|all   screenshots into docs/review/2026-10-11-r3/<WxH>/
 *
 * Shared by verify-stage.mjs, verify-home.mjs (alias verify-landing.mjs) and
 * verify-launch.mjs. The spec tables they assert against live at the bottom.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const BASE = (process.env.VERIFY_URL ?? "http://localhost:4173").replace(/\/$/, "");
/** The Next dev server: chunk sizes and timings mean nothing there. */
export const IS_DEV = /:3000$/.test(BASE) || process.env.VERIFY_DEV === "1";
/**
 * Time-budget multiplier for the interaction checks (P-07…P-11, P-21). The
 * spec budgets hold on the build (1×). On the dev server, with on-demand
 * compiles and other owners' work competing for a software-GL browser, GSAP's
 * lag smoothing stretches a 480 ms glide, so the windows are widened (3×) and
 * every result prints the measured time next to the spec budget.
 */
export const SLACK = Number(process.env.VERIFY_SLACK ?? (IS_DEV ? 3 : 1));
export const T = (ms) => Math.round(ms * SLACK);
export const ROOT = process.cwd();
export const SHOT_ROOT = path.join(ROOT, "docs", "review", "2026-10-11-r3");

/* ---------------------------------------------------------------- args */

const argv = process.argv.slice(2);
const val = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};
export const ARGS = {
  only: val("--only") ? new Set(val("--only").split(",")) : null,
  vp: val("--vp") ? new Set(val("--vp").split(",")) : null,
  slug: val("--slug") ? new Set(val("--slug").split(",")) : null,
  quick: argv.includes("--quick"),
  shots: val("--shots") ?? "key",
};
export const want = (group) => !ARGS.only || ARGS.only.has(group);

/* ------------------------------------------------------------ reporter */

const results = new Map(); // id → { pass, fail, notrun, notes[] }
const rec = (id) => {
  if (!results.has(id)) results.set(id, { pass: 0, fail: 0, notrun: 0, notes: [] });
  return results.get(id);
};
const line = (tag, id, name, detail) =>
  console.log(`  ${tag}  [${id}] ${name}${detail ? ` — ${detail}` : ""}`);

export function pass(id, name, detail = "") {
  rec(id).pass++;
  line("PASS", id, name, detail);
}
export function fail(id, name, detail = "") {
  const r = rec(id);
  r.fail++;
  if (r.notes.length < 6) r.notes.push(`${name}${detail ? `: ${detail}` : ""}`);
  line("FAIL", id, name, detail);
}
export function notRun(id, name, why) {
  const r = rec(id);
  r.notrun++;
  if (r.notes.length < 6) r.notes.push(`not run (${name}): ${why}`);
  line("SKIP", id, name, why);
}
export const check = (ok, id, name, detail) => (ok ? pass(id, name, detail) : fail(id, name, detail));
export const info = (msg) => console.log(`        ${msg}`);
export const group = (title) => console.log(`\n[${title}]`);

/** Run one check body; an exception is a FAIL of that id, never a crash. */
export async function guard(id, name, fn) {
  try {
    return await fn();
  } catch (e) {
    fail(id, name, `error: ${String(e?.message ?? e).split("\n")[0].slice(0, 200)}`);
    return undefined;
  }
}

/** Per-id summary, a JSON copy for the implementation report, and the exit code. */
export async function finish(script) {
  console.log(`\n${script}: summary by acceptance id (${BASE}${IS_DEV ? ", dev server" : ""}${SLACK !== 1 ? `, interaction time budgets ×${SLACK}` : ""})`);
  const out = {};
  let failed = 0;
  for (const [id, r] of [...results].sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))) {
    const status = r.fail ? "fail" : r.pass ? "pass" : "not-run";
    if (r.fail) failed++;
    out[id] = { status, ...r };
    console.log(`  ${status.toUpperCase().padEnd(7)} ${id.padEnd(6)} pass ${r.pass}, fail ${r.fail}, not run ${r.notrun}${r.notes[0] ? ` — ${r.notes[0]}` : ""}`);
  }
  await mkdir(SHOT_ROOT, { recursive: true });
  await writeFile(
    path.join(SHOT_ROOT, `${script}-results.json`),
    JSON.stringify({ base: BASE, dev: IS_DEV, slack: SLACK, at: new Date().toISOString(), results: out }, null, 2),
  );
  console.log(failed ? `\n${failed} acceptance id(s) FAILED.` : "\nNo acceptance id failed.");
  return failed ? 1 : 0;
}

/* -------------------------------------------------------------- browser */

export async function launch() {
  return chromium.launch({
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
}

/** Viewport spec: { w, h, touch?, reduced?, noJs?, dsf? }. */
export const vpKey = (vp) => `${vp.w}x${vp.h}${vp.touch ? "t" : ""}${vp.reduced ? "r" : ""}`;
export const vpLabel = (vp) =>
  `${vp.w}×${vp.h}${vp.touch ? " touch" : ""}${vp.reduced ? " reduced" : ""}${vp.noJs ? " no-JS" : ""}`;
export const vpWanted = (vp) => !ARGS.vp || ARGS.vp.has(vpKey(vp)) || ARGS.vp.has(`${vp.w}x${vp.h}`);

/* In-page helpers, installed before any page script runs. They only read. */
const HELPERS = `
window.__v = {
  lh(el) { const cs = getComputedStyle(el); const l = parseFloat(cs.lineHeight); return isNaN(l) ? parseFloat(cs.fontSize) * 1.2 : l; },
  lines(el) {
    if (!el) return 0;
    const L = this.lh(el), r = document.createRange(); r.selectNodeContents(el);
    const mids = [];
    for (const b of r.getClientRects()) {
      if (b.width < 1 || b.height < 1) continue;
      const m = b.top + b.height / 2;
      if (!mids.some((x) => Math.abs(x - m) < L * 0.5)) mids.push(m);
    }
    return mids.length;
  },
  opacity(el, stop) { let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) { o *= parseFloat(getComputedStyle(n).opacity); if (n === stop) break; } return o; },
  matrix(el) {
    const t = getComputedStyle(el).transform;
    if (!t || t === "none") return { is3d: false, v: [1, 0, 0, 1, 0, 0], raw: "none" };
    const m = t.match(/matrix(3d)?\\(([^)]+)\\)/);
    return { is3d: !!m[1], v: m[2].split(",").map(Number), raw: t };
  },
  identity(el, px = 0.5, deg = 0.5) {
    const { is3d, v } = this.matrix(el), s = Math.sin((deg * Math.PI) / 180);
    if (!is3d) return Math.abs(v[4]) <= px && Math.abs(v[5]) <= px && Math.abs(v[0] - 1) <= 0.01 && Math.abs(v[3] - 1) <= 0.01 && Math.abs(v[1]) <= s && Math.abs(v[2]) <= s;
    const diag = [0, 5, 10].every((i) => Math.abs(v[i] - 1) <= 0.01);
    const off = [1, 2, 4, 6, 8, 9].every((i) => Math.abs(v[i]) <= s);
    return diag && off && [12, 13, 14].every((i) => Math.abs(v[i]) <= px);
  },
  textEls(root, skip) {
    const out = new Set(), w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!/\\S/.test(n.nodeValue) || !n.parentElement) continue;
      if (skip && n.parentElement.closest(skip)) continue;
      out.add(n.parentElement);
    }
    return [...out];
  },
  srOnly(el) { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return (b.width <= 1 && b.height <= 1) || cs.clipPath === "inset(50%)" || cs.clip === "rect(0px, 0px, 0px, 0px)"; },
  name(el) { return (el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/).slice(0, 2).join(".") : "")); },
  probe(prop, value, host) {
    const d = document.createElement("div");
    d.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;" + prop + ":" + value;
    (host || document.body).appendChild(d);
    const cs = getComputedStyle(d), b = d.getBoundingClientRect();
    const r = prop === "font-size" ? parseFloat(cs.fontSize) : prop === "width" ? b.width : b.height;
    d.remove(); return r;
  },
  stage() {
    const ps = document.querySelector(".ps"); if (!ps) return null;
    const scenes = [...ps.querySelectorAll(".ps-scene")], N = scenes.length;
    const top = ps.getBoundingClientRect().top + scrollY;
    const travel = ps.offsetHeight - innerHeight;
    return { N, top, travel, step: N > 1 ? travel / (N - 1) : 0, mode: ps.dataset.mode, ids: scenes.map((s) => s.id), kinds: scenes.map((s) => s.dataset.kind) };
  },
};`;

export async function newPage(browser, vp, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dsf ?? 1,
    reducedMotion: vp.reduced ? "reduce" : "no-preference",
    isMobile: Boolean(vp.touch && vp.w < 1024),
    hasTouch: Boolean(vp.touch),
    javaScriptEnabled: !vp.noJs,
    ...opts,
  });
  await ctx.addInitScript({ content: HELPERS });
  const page = await ctx.newPage();
  // The dev server compiles on first request; the build answers in milliseconds.
  page.setDefaultNavigationTimeout(90_000);
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(`PAGEERROR ${e.message}`));
  return { ctx, page, errors };
}

/**
 * Navigate, then wait for `waitUntil` separately. A busy dev server (another
 * owner's edit recompiling) can hold `load` past any sane timeout; the page is
 * then measured anyway, with a note, rather than reported as a failed load.
 */
export async function goto(page, route, waitUntil = "load") {
  const res = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 90_000 });
  if (waitUntil !== "domcontentloaded") {
    await page
      .waitForLoadState(waitUntil, { timeout: IS_DEV ? 60_000 : 30_000 })
      .catch(() => info(`(${route}: no "${waitUntil}" event in time; measuring anyway)`));
  }
  return res?.status() ?? 0;
}

/** Screenshot into docs/review/2026-10-11-r3/<WxH>/<name>.png (level: key|all). */
export async function shot(page, vp, name, level = "key") {
  if (ARGS.shots === "none" || (ARGS.shots === "key" && level === "all")) return;
  const dir = path.join(SHOT_ROOT, vpKey(vp));
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`) }).catch(() => {});
}

/** Poll an in-page predicate until true or the timeout; returns the last value. */
export async function until(page, fn, arg, ms = 1500, every = 50) {
  const t0 = Date.now();
  let v;
  do {
    v = await page.evaluate(fn, arg).catch(() => undefined);
    if (v) return v;
    await page.waitForTimeout(every);
  } while (Date.now() - t0 < ms);
  return v;
}

/**
 * Wait until a track's transform stops changing (three reads 120 ms apart
 * within 0.5 px), up to `ms`. Software GL in headless Chromium can starve the scrub
 * of frames; this separates "not at rest yet" from "at rest in the wrong
 * place". Returns the extra time it took.
 */
export async function steady(page, selector, ms = 2000) {
  const read = () =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return 0;
      const { is3d, v } = window.__v.matrix(el);
      return is3d ? v[12] : v[4];
    }, selector);
  const t0 = Date.now();
  let a = await read();
  let still = 0;
  while (Date.now() - t0 < ms) {
    await page.waitForTimeout(120);
    const b = await read();
    // Two still intervals in a row: one alone can be a starved frame, not rest.
    still = Math.abs(b - a) < 0.5 ? still + 1 : 0;
    if (still >= 2) return Math.max(0, Date.now() - t0 - 240);
    a = b;
  }
  return ms;
}

/** Breakpoints straight from lib/breakpoints.ts, so the scripts never drift. */
export async function loadBreakpoints() {
  const emit = process.emitWarning;
  process.emitWarning = function (w, ...rest) {
    const code = typeof rest[0] === "object" ? rest[0]?.code : rest[1];
    if (code === "MODULE_TYPELESS_PACKAGE_JSON") return;
    return emit.call(this, w, ...rest);
  };
  return import("../lib/breakpoints.ts");
}

/** RGB of one screen pixel (decoded with Next's optional sharp; null without it). */
export async function pixel(page, x, y) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    return null;
  }
  const buf = await page.screenshot({ clip: { x: Math.round(x), y: Math.round(y), width: 1, height: 1 } });
  const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return [data[0], data[1], data[2]];
}

/** Every pixel of a clip, as [r,g,b] triples (for contrast sampling). */
export async function pixels(page, clip) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    return null;
  }
  const buf = await page.screenshot({ clip });
  const { data, info: i } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const out = [];
  for (let k = 0; k < data.length; k += i.channels) out.push([data[k], data[k + 1], data[k + 2]]);
  return out;
}

export const parseRgb = (s) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const luminance = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/* --------------------------------------------------- spec tables (§3.3, §12) */

/** §3.3 resolved values: [w, h, u, header, heroH1, psTitle, sceneH2, psBody]. */
export const TOKENS = [
  [1024, 520, 9.62, 56, 50.0, 42.3, 27.9, 15],
  [1093, 529, 9.79, 56, 50.9, 43.1, 28.4, 15],
  [1280, 601, 11.12, 56, 57.8, 48.9, 32.2, 15.5],
  [1366, 657, 12.15, 56, 63.2, 53.5, 35.2, 16.1],
  [1536, 730, 13.5, 62, 70.2, 59.4, 39.2, 16.9],
  [1440, 900, 14.4, 66, 74.9, 63.4, 41.8, 17],
  [1536, 864, 15.36, 71, 79.9, 67.6, 44, 17],
  [1920, 937, 17.33, 72, 90.1, 72, 44, 17],
  [2560, 1440, 25.6, 72, 120, 72, 44, 17],
  [768, 1024, 11.26, 56, 58.6, 49.5, 32.7, 15.6],
  [390, 844, 8.39, 56, 43.6, 36.9, 24.3, 15],
  [375, 667, 7.34, 56, 38.2, 36, 24, 15],
];

/**
 * §12.1 per-viewport matrix. `product`: expected `.ps[data-mode]`; `box`:
 * `--ps-content-h` (null = not asserted); `gallery`: is-pinned/is-rail plus the
 * card variant; `card`: card height (number) or "fit" (≤ innerHeight − header
 * − 52); `h1`: hero H1 size; `cta`: hero CTA inset from the bottom (null = not
 * forced).
 *
 * Integration round 1 (2026-10-12): three cells of the spec's §12.1 table are
 * arithmetic slips against its own normative CSS (§4.2 `--ps-content-h`, §8.2
 * `--card-h`), so they are asserted at the formula's value instead:
 *   1024×640  box 512 → 501 (640 − 56 − 52 − 2 × 15.36), card 507 → 502 (640 − 56 − 56 − 2 × 12.8)
 *   1280×720  box 568 → 575 (720 − 58.9 − 52 − 2 × 17.28), card 573 → 576 (720 − 58.9 − 56 − 2 × 14.4)
 *   1024×768  box 609 → 619 (768 − 56 − 56 − 2 × 18.43)
 * Every other cell matches the formula within 1 px.
 */
export const MATRIX = [
  { w: 1024, h: 520, product: "stage", box: 391, gallery: "pinned", variant: "tight", card: 387, h1: 50.0, cta: 8 },
  { w: 1093, h: 529, product: "stage", box: 400, gallery: "pinned", variant: "tight", card: 396, h1: 50.9, cta: 8 },
  { w: 1024, h: 640, product: "stage", box: 501, gallery: "pinned", variant: "compact", card: 502, h1: 53.2, cta: 16 },
  { w: 1280, h: 601, product: "stage", box: 468, gallery: "pinned", variant: "tight", card: 465, h1: 57.8, cta: 16 },
  { w: 1280, h: 720, product: "stage", box: 575, gallery: "pinned", variant: "compact", card: 576, h1: 66.6, cta: 16 },
  { w: 1366, h: 657, product: "stage", box: 517, gallery: "pinned", variant: "compact", card: 519, h1: 63.2, cta: 16 },
  { w: 1440, h: 900, product: "stage", box: 735, gallery: "pinned", variant: "regular", card: 742, h1: 74.9, cta: 16 },
  { w: 1536, h: 730, product: "stage", box: 581, gallery: "pinned", variant: "compact", card: 583, h1: 70.2, cta: 16 },
  { w: 1536, h: 864, product: "stage", box: 696, gallery: "pinned", variant: "regular", card: 702, h1: 79.9, cta: 16 },
  { w: 1920, h: 937, product: "stage", box: 764, gallery: "pinned", variant: "regular", card: 771, h1: 90.1, cta: 16 },
  { w: 1920, h: 1080, product: "stage", box: 820, gallery: "pinned", variant: "regular", card: 900, h1: 99.8, cta: 16 },
  { w: 2560, h: 1440, product: "stage", box: 820, gallery: "pinned", variant: "regular", card: 900, h1: 120, cta: 16 },
  { w: 1024, h: 768, touch: true, product: "rail", box: 619, gallery: "rail", variant: "regular", card: 625, h1: 53.2, cta: 16 },
  { w: 820, h: 1180, touch: true, product: "rail", box: null, gallery: "rail", variant: "stacked", card: "fit", h1: null, cta: 16 },
  { w: 768, h: 1024, touch: true, product: "rail", box: null, gallery: "rail", variant: "stacked", card: "fit", h1: 58.6, cta: 16 },
  { w: 390, h: 844, touch: true, product: "rail", box: null, gallery: "rail", variant: "stacked", card: "fit", h1: 43.6, cta: 16 },
  { w: 375, h: 667, touch: true, product: "rail", box: null, gallery: "rail", variant: "stacked", card: "fit", h1: 38.2, cta: 16 },
  { w: 360, h: 640, touch: true, product: "rail", box: null, gallery: "rail", variant: "stacked", card: "fit", h1: 36.6, cta: 16 },
  { w: 844, h: 390, touch: true, product: "list", box: null, gallery: "rail", variant: null, card: null, h1: null, cta: null },
  { w: 1280, h: 480, product: "list", box: null, gallery: "rail", variant: null, card: null, h1: null, cta: null },
  { w: 1366, h: 657, reduced: true, product: "rail", static: true, box: 517, gallery: "rail", variant: null, card: null, h1: 63.2, cta: 16 },
];

/** The quick subset: two short laptops, one wide desktop, one phone. */
export const QUICK = new Set(["1024x520", "1366x657", "1920x937", "390x844t"]);
export const inRun = (vp) => vpWanted(vp) && (!ARGS.quick || QUICK.has(vpKey(vp)));

/** §5.2 scene counts per product (production build). */
export const SCENES_N = { tasree3: 14, yisbir: 14, mandoobee: 12, wasel: 12, nazo: 13, "ai-in-a-box": 10 };
export const SLUGS = ["mandoobee", "tasree3", "nazo", "yisbir", "wasel", "ai-in-a-box"];

/** §7.4 expected framing: column [l,r,t,b], fov, bbox [l,t,r,b], near panel width. */
export const FRAMING = {
  "1024x560": { col: [517, 1004, 72, 536], fov: 39.3, bbox: [546, 173, 974, 435], near: 229 },
  "1280x601": { col: [533, 1254, 72, 577], fov: 35.3, bbox: [649, 102, 1138, 547], near: 259 },
  "1366x657": { col: [618, 1339, 72, 633], fov: 36.6, bbox: [704, 106, 1253, 599], near: 295 },
  /* Integration round 1: §7.4's row put the column at 714, which drops the
     48 px gutter from copyRight (128 + 48 + 7.6 × 70.2 + 53.8 = 763). These are
     fitRoom()'s own values for the 763 column, computed in node from
     components/room/room-layout.ts. The other rows match it within 1 px. */
  "1536x730": { col: [763, 1505, 78, 706], fov: 37.7, bbox: [824, 116, 1444, 668], near: 336 },
  /* Same slip as 1536×730 (269 + 48 + 7.6 × 90.1 + 67.2 = 1069, not 1020). */
  "1920x937": { col: [1069, 1882, 88, 913], fov: 40.2, bbox: [1118, 180, 1833, 821], near: 386 },
  "2560x1440": { col: [1550, 2512, 88, 1416], fov: 44.8, bbox: [1607, 365, 2454, 1139], near: 447 },
};

/** §5.6 banned strings (content-check enforces them in source; these check the HTML). */
export const BANNED = [
  /\bimmutable\b/i,
  /legally binding/i,
  /to be confirmed/i,
  /100% secure/i,
  /\b10x\b/i,
  /\bparking\b/i,
  /\btolls?\b/i,
  /face search/i,
  /suspicious behaviou?r/i,
  /licen[cs]e plates?/i,
  /Approval chains with due dates/i,
  /voice in English and Arabic/i,
  /The agent never signs/i,
  /for a period you set/i,
];
