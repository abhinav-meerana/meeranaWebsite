/**
 * Launch verification: the cross-route acceptance criteria (FINAL-SPEC §12.3
 * X-01, S-03, the pin budget of §2 C18 and §10, honesty, menus, the room's
 * loading rules and axe), measured against the built static export served on
 * http://localhost:4173 (`npm run build`, then serve out/), or VERIFY_URL.
 *
 * Every check prints PASS or FAIL with the measured value. Exit code 1 if any
 * check fails. Nothing here asserts that code exists; it measures behaviour.
 * Product-page and homepage detail lives in verify-stage.mjs and
 * verify-home.mjs; this script is the release gate across routes.
 *
 * Usage: node scripts/verify-launch.mjs [--only honesty,links,console,...]
 *
 * Groups: lint honesty links external console overflow keyboard reduced menus pin gpu axe
 *
 * Redesign (2026-10-12): `reduced`, `menus`, `pin` and `gpu` now measure the
 * cinematic story, PillNav / option wheel and the interactive background;
 * the retired hero room, gallery and header are gone. The homepage's own
 * detail checks are in verify-redesign.mjs.
 * (`external` needs network access: it requests the store and press links.)
 *
 * Screenshots: the `console` group saves the first screen of every route at
 * 1440×900, 1024×768 and 390×844 to docs/review/2026-10-11-r3/<WxH>/route-*.png
 * (`--shots none` turns them off).
 *
 * Changes for the r3 structure (2026-10-11):
 *   · the "1280×720 is a rail = PASS" assertion is gone: the gallery pins from
 *     1024×520 (DD-23 amended), and this now asserts the pin at 1093×529,
 *     1280×601, 1366×657, 1536×730 and 1920×937;
 *   · the homepage keeps its budget (total pin ≤ 300vh, page ≤ 8.5 × innerHeight
 *     at 1440×900); product pages are exempt from it (D1) and are checked
 *     against P-02 instead (`.ps` = innerHeight + (N − 1) × step);
 *   · the pin is CSS sticky now (`.sc-film`), so nothing looks for `.pin-spacer`;
 *   · /products/ is a route, is in the sitemap, and each product has its own
 *     Open Graph image at /products/<slug>/og.png, a 1200×630 PNG served as
 *     image/png (X-01, DD-26g);
 *   · the CSS @media value lint (§3.1) runs as the `lint` group.
 */
import AxeBuilder from "@axe-core/playwright";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { lintCss } from "./verify-css.mjs";
import { BANNED, BASE, SCENES_N, SLUGS, launch, newPage as libPage, shot } from "./verify-lib.mjs";

const OUT_DIR = path.join(process.cwd(), "out");
const only = process.argv.includes("--only")
  ? new Set(process.argv[process.argv.indexOf("--only") + 1].split(","))
  : null;
const want = (g) => !only || only.has(g);

const PRODUCTS = SLUGS.map((s) => `/products/${s}/`);
const ROUTES = [
  "/",
  "/products/",
  ...PRODUCTS,
  "/company/",
  "/services/",
  "/contact/",
  "/contact/?interest=yisbir",
];

let failed = 0;
const pass = (name, detail = "") => console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ""}`);
const fail = (name, detail = "") => {
  failed++;
  console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
};
const check = (ok, name, detail) => (ok ? pass(name, detail) : fail(name, detail));
// Every page can run a WebGL scene on a software renderer, so contexts from
// earlier checks are closed before the next group starts; left open they starve
// the timers of the checks that follow and make timing-based checks flaky.
const contexts = [];
const group = async (g) => {
  for (const c of contexts.splice(0)) await c.close().catch(() => {});
  console.log(`\n[${g}]`);
};

const browser = await launch();

/** A group that throws (a navigation timeout, a missing element) fails, and the
 * run goes on to the next group. */
async function safely(name, fn) {
  try {
    await fn();
  } catch (e) {
    fail(`[${name}] stopped early`, String(e?.message ?? e).split(/\r?\n/)[0].slice(0, 200));
  }
}

async function newPage(width, height, opts = {}) {
  const p = await libPage(browser, { w: width, h: height, touch: width < 768, reduced: opts.reduced, noJs: opts.noJs });
  contexts.push(p.ctx);
  return p;
}
const settle = (page) => page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});

/* ------------------------------------------------------------------- lint */
if (want("lint")) await safely("lint", async () => {
  await group("lint: @media values are shared breakpoints; raw colours only in tokens.css");
  const { files, media, colours } = await lintCss();
  check(media.length === 0, `@media values across ${files.length} stylesheets`, media.slice(0, 4).join("; "));
  check(colours.length === 0, "no raw colour outside app/tokens.css", colours.slice(0, 4).join("; "));
});

/* ---------------------------------------------------------------- honesty */
if (want("honesty")) await safely("honesty", async () => {
  await group("honesty: no internal notes, placeholders, banned claims or unsourced numbers in out/");
  const banned = [
    /Prototype\s*·\s*internal/i,
    /internal design exploration/i,
    /retrieved\s+2\s+October/i,
    /being confirmed/i,
    /copy proposed/i,
    /Course provider/i,
    /Sovereignty in Your Hands/i,
    ...BANNED,
  ];
  async function walk(dir) {
    const out = [];
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "_next") out.push(...(await walk(p)));
      } else if (/\.html$/.test(e.name)) out.push(p);
    }
    return out;
  }
  const files = await walk(OUT_DIR).catch(() => []);
  if (!files.length) fail("out/ has exported HTML", "run `npm run build` first");
  const hits = [];
  for (const f of files) {
    // Visible text only: a banned word inside a script payload or an attribute
    // is not shown, and the RSC payload repeats the HTML anyway.
    const text = (await readFile(f, "utf8")).replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
    for (const re of banned) if (re.test(text)) hits.push(`${path.relative(OUT_DIR, f)} :: ${re}`);
  }
  check(hits.length === 0, `no banned strings across ${files.length} exported pages`, hits.slice(0, 3).join("; "));

  const home = await readFile(path.join(OUT_DIR, "index.html"), "utf8").catch(() => "");
  check(!/stat-value|Client and partner organisations/.test(home), "no stats counter on the homepage");
  const media = await readdir(path.join(OUT_DIR, "media")).catch(() => []);
  check(!media.includes("proof"), "public/media/proof (client and government marks) is not in the export");
  const v3 = await readdir(path.join(OUT_DIR, "media", "v3")).catch(() => []);
  check(!v3.some((f) => f.endsWith(".mp4")), "uncleared demo videos are not in the export");
});

/* ------------------------------------------------------------------ links */
if (want("links")) await safely("links", async () => {
  await group("links: every internal link resolves; sitemap, icons and per-product OG images (X-01)");
  const { page } = await newPage(1440, 900);
  const seen = new Map();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    const hrefs = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
    for (const h of hrefs) {
      if (!h || h.startsWith("mailto:") || h.startsWith("http") || h.startsWith("#")) continue;
      const clean = h.split("#")[0];
      if (clean) seen.set(clean, route);
    }
  }
  const broken = [];
  for (const [href, from] of seen) {
    const res = await page.request.get(new URL(href, BASE).toString());
    if (res.status() >= 400) broken.push(`${href} (from ${from}) → ${res.status()}`);
  }
  check(broken.length === 0, `${seen.size} distinct internal links, 0 broken`, broken.join("; "));

  // Every in-page anchor target exists: homepage, products index, each product page.
  for (const route of ["/", "/products/", ...PRODUCTS]) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")).filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
    );
    check(missing.length === 0, `every #anchor on ${route} has a target`, missing.join(", "));
  }

  for (const f of ["/sitemap.xml", "/robots.txt", "/icon.png", "/apple-icon.png", "/opengraph-image.png"]) {
    const r = await page.request.get(BASE + f);
    check(r.status() === 200, `${f} is served`, String(r.status()));
  }
  const sitemap = await (await page.request.get(BASE + "/sitemap.xml")).text();
  check(/\/products\/<\/loc>/.test(sitemap), "/products/ is in the sitemap");
  check(PRODUCTS.every((p) => sitemap.includes(`${p}</loc>`)), "all six product pages are in the sitemap");

  const meta = [];
  for (const route of ROUTES.filter((r) => !r.includes("?"))) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    const m = await page.evaluate(() => ({
      og: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? null,
      site: !!document.querySelector('meta[property="og:site_name"]'),
      canonical: !!document.querySelector('link[rel="canonical"]'),
      icon: !!document.querySelector('link[rel~="icon"]'),
      title: document.title,
    }));
    meta.push({ route, ...m });
  }
  const incomplete = meta.filter((m) => !(m.og && m.site && m.canonical && m.icon));
  check(incomplete.length === 0, "OG image, site name, canonical and icon on every route", incomplete.map((m) => m.route).join(", "));
  const titles = new Set(meta.map((m) => m.title));
  check(titles.size === meta.length, `${meta.length} distinct page titles`, `${titles.size} unique`);
  const productOg = meta.filter((m) => m.route.startsWith("/products/") && m.route !== "/products/").map((m) => m.og);
  check(new Set(productOg).size === PRODUCTS.length && productOg.every((u) => u && !/\/opengraph-image\.png$/.test(u)), "og:image is unique per product (X-01)", productOg.map((u) => u?.split("/").slice(-3).join("/")).join(" "));
  for (const u of productOg) {
    if (!u) continue;
    const local = BASE + new URL(u).pathname;
    const r = await page.request.get(local);
    const body = await r.body();
    const png = body.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    // 1200×630 from the IHDR chunk; the type header is what LinkedIn and
    // Facebook read, so a PNG served without image/png still fails (DD-26g).
    const dims = png ? [body.readUInt32BE(16), body.readUInt32BE(20)] : [0, 0];
    const type = r.headers()["content-type"] ?? "no content-type";
    check(
      r.status() === 200 && png && dims[0] === 1200 && dims[1] === 630 && /^image\/png/.test(type),
      `${new URL(u).pathname} is a 1200×630 PNG served as image/png`,
      `${r.status()} ${type} ${dims.join("×")} ${body.length} bytes`,
    );
  }
});

/* --------------------------------------------------------------- external */
if (want("external")) await safely("external", async () => {
  await group("external: store and press links resolve (FINAL-SPEC §5.4 Mandoobee deploy, EV-420; company press)");
  const { page } = await newPage(1440, 900);
  const hrefs = new Map();
  for (const route of ["/products/mandoobee/", "/company/"]) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    const found = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="https://"]')].map((a) => a.href).filter((h) => !/youtube(-nocookie)?\.com/.test(h)),
    );
    for (const h of found) hrefs.set(h, route);
  }
  const stores = [...hrefs.keys()].filter((h) => /apps\.apple\.com|play\.google\.com/.test(h));
  check(stores.length === 2, "Mandoobee links to the App Store and Google Play", stores.join(" "));
  const bad = [];
  for (const [h, from] of hrefs) {
    // A browser user agent: some outlets answer 403 to a bare client.
    const get = () =>
      page.request
        .get(h, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }, timeout: 30_000, maxRedirects: 5 })
        .catch((e) => ({ status: () => `error ${String(e.message).split(/\r?\n/)[0].slice(0, 60)}` }));
    let st = (await get()).status();
    // One retry for a network error (a DNS hiccup is not a dead link).
    if (typeof st !== "number") {
      await page.waitForTimeout(2000);
      st = (await get()).status();
    }
    // Playwright's request context resolves names in its driver process,
    // which on Windows intermittently answers ENOTFOUND for hosts that resolve
    // everywhere else (seen 2026-10-12: four press hosts, while node's own
    // resolver and curl returned 200). A network error there is retried once
    // with this script's own fetch before the link counts as dead.
    if (typeof st !== "number") {
      st = await fetch(h, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }, redirect: "follow", signal: AbortSignal.timeout(30_000) })
        .then((r) => r.status)
        .catch((e) => `${st}; fetch: ${String(e.cause?.code ?? e.message).slice(0, 40)}`);
    }
    if (typeof st !== "number" || st >= 400) bad.push(`${h} (from ${from}) → ${st}`);
  }
  check(bad.length === 0, `${hrefs.size} external links resolve`, bad.slice(0, 4).join("; "));
});

/* --------------------------------------------------------------- console */
if (want("console")) await safely("console", async () => {
  await group("console: zero errors, per route and viewport (X-01)");
  for (const [w, h] of [[1440, 900], [1024, 768], [390, 844]]) {
    const { page } = await newPage(w, h);
    const errs = [];
    page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
    page.on("response", (r) => r.status() >= 400 && errs.push(`HTTP ${r.status()} ${r.url()}`));
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "load" });
      await settle(page);
      await page.waitForTimeout(800);
      // First screen of every route, for the review set (§10).
      const name = route === "/" ? "home" : route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      await shot(page, { w, h, touch: w < 768 }, `route-${name}`);
    }
    check(errs.length === 0, `${w}px: ${ROUTES.length} routes`, errs.slice(0, 3).join(" | "));
  }
});

/* -------------------------------------------------------------- overflow */
if (want("overflow")) await safely("overflow", async () => {
  await group("overflow: no horizontal page scroll at any width");
  for (const [w, h] of [[320, 568], [390, 844], [768, 1024], [1024, 520], [1280, 601], [1366, 657], [1440, 900], [1920, 937]]) {
    const { page } = await newPage(w, h);
    const bad = [];
    for (const route of ["/", "/products/", "/products/yisbir/", "/company/", "/contact/", "/services/"]) {
      await page.goto(BASE + route, { waitUntil: "load" });
      await settle(page);
      await page.waitForTimeout(400);
      const o = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (o > 0) bad.push(`${route}+${o}px`);
    }
    check(bad.length === 0, `${w}×${h}`, bad.join(", "));
    await page.context().close();
  }
});

/* --------------------------------------------------------------- keyboard */
if (want("keyboard")) await safely("keyboard", async () => {
  await group("keyboard: focus stays visible (inside the viewport, below the header)");
  for (const [w, h] of [[1440, 900], [1366, 657], [1024, 768]]) {
    const { page } = await newPage(w, h);
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(1500);
    const bad = [];
    for (let i = 1; i <= 40; i++) {
      await page.keyboard.press("Tab");
      // Focus can scroll the page (the pinned gallery scrubs for half a second),
      // so measure once it has settled.
      await page.waitForTimeout(1100);
      const r = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        const b = a.getBoundingClientRect();
        const hdr = document.querySelector(".pill-nav")?.getBoundingClientRect().bottom ?? 0;
        return {
          t: (a.textContent || a.getAttribute("aria-label") || a.tagName).trim().slice(0, 30),
          inView: b.width > 0 && b.height > 0 && b.left >= -1 && b.right <= innerWidth + 1 && b.bottom <= innerHeight + 1,
          belowHeader: b.top >= hdr - 1 || hdr === 0 || a.closest(".pill-nav-container") !== null || /skip/.test(a.className),
          outline: getComputedStyle(a).outlineStyle !== "none",
          top: Math.round(b.top),
        };
      });
      if (r && (!r.inView || !r.belowHeader || !r.outline)) bad.push(`#${i} "${r.t}" top=${r.top} inView=${r.inView} outline=${r.outline}`);
    }
    check(bad.length === 0, `${w}×${h}: first 40 Tab stops visible and outlined`, bad.slice(0, 3).join(" | "));
  }
});

/* ---------------------------------------------------------------- reduced */
if (want("reduced")) await safely("reduced", async () => {
  await group("reduced motion: nothing animates, everything is visible, stories stay horizontal");
  const { page } = await newPage(1440, 900, { reduced: true });
  await page.addInitScript(() => {
    window.__h1 = [];
    setInterval(() => {
      const h = document.querySelector("h1");
      if (h) {
        const cs = getComputedStyle(h);
        window.__h1.push({ o: cs.opacity, t: cs.transform, f: cs.filter });
      }
    }, 100);
  });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3200);
  const s = await page.evaluate(() => window.__h1);
  const bad = s.filter((x) => x.o !== "1" || (x.t !== "none" && x.t !== "matrix(1, 0, 0, 1, 0, 0)") || x.f !== "none");
  check(s.length >= 4 && bad.length === 0, `H1 opacity 1, no transform or filter in ${s.length} samples over 3 s`, JSON.stringify(bad[0] ?? ""));
  const story = await page.evaluate(() => ({
    motion: document.documentElement.dataset.motion,
    pin: getComputedStyle(document.querySelector(".story-pin")).position,
    hidden: [...document.querySelectorAll("[data-copy]")].filter((c) => getComputedStyle(c).visibility === "hidden" || getComputedStyle(c).opacity !== "1").length,
    blurred: [...document.querySelectorAll(".sp")].filter((x) => getComputedStyle(x).display !== "none" && getComputedStyle(x).filter !== "none").length,
  }));
  check(story.motion === "reduced" && story.pin !== "sticky", "the story is not pinned", JSON.stringify(story));
  check(story.hidden === 0, "every story beat and caption is visible", String(story.hidden));
  check(story.blurred === 0, "no story screen is blurred", String(story.blurred));
  // C3: reduced motion keeps the product story horizontal (a static rail).
  for (const slug of ["tasree3", "ai-in-a-box"]) {
    await page.goto(`${BASE}/products/${slug}/`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => {
      const ps = document.querySelector(".ps");
      const t = ps?.querySelector(".ps-track");
      return ps && t ? { mode: ps.dataset.mode, st: ps.hasAttribute("data-static"), sw: t.scrollWidth, cw: t.clientWidth, n: ps.querySelectorAll(".ps-scene").length } : null;
    });
    check(!!r && r.mode === "rail" && r.st && Math.abs(r.sw - r.n * r.cw) <= 2, `/products/${slug}/: static horizontal rail`, JSON.stringify(r));
  }
});

/* ------------------------------------------------------------------ menus */
if (want("menus")) await safely("menus", async () => {
  await group("menus: PillNav (desktop) and the option wheel (tablet/phone) — focus in, out and back");
  const waitFor = async (page, fn, ms = 8000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (await page.evaluate(fn)) return true;
      await page.waitForTimeout(150);
    }
    return false;
  };
  {
    const { page } = await newPage(1440, 900);
    await page.goto(BASE + "/company/", { waitUntil: "load" });
    await settle(page);
    const BTN = ".pill-nav button.pill";
    await page.locator(BTN).focus();
    await page.keyboard.press("Enter");
    const open = await waitFor(page, () => {
      const b = document.querySelector(".pill-nav button.pill");
      const panel = document.getElementById(b.getAttribute("aria-controls"));
      return b.getAttribute("aria-expanded") === "true" && !panel.hidden;
    });
    check(open, "Enter opens the Platforms panel");
    const links = await page.locator(".pill-panel:not([hidden]) a").count();
    check(links === 7, "the panel lists 7 real destinations (six platforms and the overview)", String(links));
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest(".pill-panel"));
    check(inside, "Tab from the open button moves into the panel");
    await page.keyboard.press("Escape");
    const closed = await waitFor(page, () => document.querySelector(".pill-nav button.pill").getAttribute("aria-expanded") === "false");
    const back = await page.evaluate(() => document.activeElement?.matches(".pill-nav button.pill"));
    check(closed && back, "Escape closes it and returns focus to the button");
    const ctl = await page.evaluate(() => !!document.getElementById(document.querySelector(".pill-nav button.pill").getAttribute("aria-controls")));
    check(ctl, "aria-controls resolves while the panel is closed");
  }
  {
    const { page } = await newPage(390, 844);
    await page.goto(BASE + "/company/", { waitUntil: "load" });
    await settle(page);
    await page.locator(".wheel-dock .option-wheel").focus();
    await page.keyboard.press("Enter");
    const expanded = await waitFor(page, () => document.querySelector(".wheel-dock").classList.contains("is-expanded"));
    check(expanded, "Enter expands the wheel");
    await page.keyboard.press("Escape");
    const collapsed = await waitFor(page, () => !document.querySelector(".wheel-dock").classList.contains("is-expanded"));
    const kept = await page.evaluate(() => document.activeElement?.classList.contains("option-wheel"));
    check(collapsed && kept, "Escape collapses it and focus stays on the wheel");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    await page.waitForURL(/\/contact\/$/, { timeout: 8000 }).catch(() => {});
    check(/\/contact\/$/.test(page.url()), "End then Enter goes to Contact", page.url());
  }
});

/* -------------------------------------------------------------------- pin */
if (want("pin")) await safely("pin", async () => {
  await group("motion budget: the homepage story is one CSS-sticky scene of a fixed length; short screens get the static layout");
  for (const [w, h, len] of [[1440, 900, 7.4], [1366, 657, 7.4], [1920, 937, 7.4], [1024, 768, 7.4], [390, 844, 5.9], [768, 1024, 5.9], [1280, 480, 0]]) {
    const { page } = await newPage(w, h);
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForFunction(() => document.querySelector(".story")?.dataset.story === "ready", null, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(600);
    const m = await page.evaluate(() => ({
      travel: (document.querySelector(".story").getBoundingClientRect().height - innerHeight) / innerHeight,
      sticky: getComputedStyle(document.querySelector(".story-pin")).position === "sticky",
      spacer: !!document.querySelector(".pin-spacer"),
      layout: document.querySelector(".story").dataset.layout,
      screens: document.documentElement.scrollHeight / innerHeight,
    }));
    if (len === 0) check(!m.sticky && m.layout === "static", `${w}×${h}: short landscape → static story, no pin`, JSON.stringify(m));
    else check(m.sticky && !m.spacer && Math.abs(m.travel - len) < 0.02, `${w}×${h}: story travel ${m.travel.toFixed(2)} × innerHeight (= ${len}), CSS sticky, no pin spacer`, m.layout);
    console.log(`        ${w}×${h}: homepage is ${m.screens.toFixed(1)} screens long`);
    /* Close at once: software GL (SwiftShader) renders every open homepage,
       and several at a time starve each other's loads. */
    await page.context().close();
  }

  // Product pages are exempt from the homepage budget (D1); their length is P-02.
  for (const [w, h] of [[1366, 657], [1920, 937]]) {
    const { page } = await newPage(w, h);
    for (const slug of SLUGS) {
      await page.goto(`${BASE}/products/${slug}/`, { waitUntil: "load" });
      await page.waitForFunction(() => document.querySelector(".ps")?.dataset.mode !== "pending", null, { timeout: 8000 }).catch(() => {});
      const r = await page.evaluate(() => {
        const ps = document.querySelector(".ps");
        return ps ? { mode: ps.dataset.mode, h: ps.getBoundingClientRect().height, n: ps.querySelectorAll(".ps-scene").length, ih: innerHeight } : null;
      });
      if (!r) {
        fail(`${w}×${h} /products/${slug}/: P-02 length`, "no .ps");
        continue;
      }
      const step = Math.min(720, Math.max(480, 0.7 * r.ih));
      const exp = r.ih + (r.n - 1) * step;
      check(r.mode === "stage" && Math.abs(r.h - exp) <= 2 && r.n === SCENES_N[slug], `${w}×${h} /products/${slug}/: stage, ${r.n} scenes, length ${Math.round(r.h)} = ${Math.round(exp)} (P-02)`, `mode ${r.mode}`);
    }
  }
});

/* -------------------------------------------------------------------- gpu */
if (want("gpu")) await safely("gpu", async () => {
  await group("background: WebGL (ColorBends) and the dot field load only on fine-pointer desktops");
  for (const [w, h, label, expect, touch] of [[1440, 900, "desktop", true, false], [1366, 657, "laptop", true, false], [1024, 768, "tablet landscape (touch)", false, true], [768, 1024, "tablet", false, true], [390, 844, "phone", false, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && w < 1024 });
    contexts.push(ctx);
    const page = await ctx.newPage();
    const three = [];
    page.on("response", async (r) => {
      if (!/\.js(\?|$)/.test(r.url())) return;
      const b = await r.text().catch(() => "");
      if (/\bWebGLRenderer\b/.test(b)) three.push(r.url().split("/").pop());
    });
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    /* Wait for the background's decision (and, when live, both canvases). */
    await page.waitForFunction((live) => {
      const m = document.querySelector(".mib")?.dataset.mode;
      return live ? m === "live" && document.querySelectorAll(".mib canvas").length === 2 : m === "static";
    }, expect, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(800);
    const c = await page.evaluate(() => ({ mode: document.querySelector(".mib")?.dataset.mode, canvases: document.querySelectorAll(".mib canvas").length }));
    await ctx.close();
    check(
      expect ? c.mode === "live" && c.canvases === 2 && three.length >= 1 : c.mode === "static" && c.canvases === 0 && three.length === 0,
      `${label} ${w}×${h}: ${expect ? "ColorBends + DotField running" : "static gradient, no three.js chunk, no canvas"}`,
      `mode=${c.mode} canvases=${c.canvases} three.js chunks=${three.length}`,
    );
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    contexts.push(ctx);
    await ctx.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true }));
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(1500);
    check((await page.evaluate(() => document.querySelectorAll(".mib canvas").length)) === 0, "Save-Data on a wide screen: no WebGL or canvas background");
  }
  {
    // Reduced motion: ColorBends draws one still frame and stops its loop.
    // Frames are attributed to the script that asked for them (the three.js
    // chunk), since GSAP's ticker legitimately keeps its own loop.
    const { page } = await newPage(1440, 900, { reduced: true });
    await page.addInitScript(() => {
      window.__raf = [];
      const orig = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => {
        window.__raf.push(new Error().stack || "");
        return orig(cb);
      };
    });
    const chunks = [];
    page.on("response", async (r) => {
      if (!/\.js(\?|$)/.test(r.url())) return;
      const b = await r.text().catch(() => "");
      if (/\bWebGLRenderer\b/.test(b)) chunks.push(r.url().split("/").pop().split("?")[0]);
    });
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(2500);
    await page.evaluate(() => { window.__raf = []; });
    await page.waitForTimeout(1500);
    const n = await page.evaluate((c) => window.__raf.filter((s) => c.some((x) => s.includes(x))).length, chunks);
    check(chunks.length >= 1 && n === 0, `reduced motion: ColorBends requests no frames while idle (${n} in 1.5 s)`);
  }
});

/* -------------------------------------------------------------------- axe */
if (want("axe")) await safely("axe", async () => {
  await group("axe: no serious or critical violations");
  for (const [w, h] of [[1440, 900], [1366, 657], [390, 844]]) {
    const { page } = await newPage(w, h);
    for (const route of ROUTES.filter((r) => !r.includes("?"))) {
      await page.goto(BASE + route, { waitUntil: "load" });
      await settle(page);
      await page.waitForTimeout(1200);
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      check(bad.length === 0, `${w}px ${route}`, bad.map((v) => `${v.id}(${v.nodes.length}) e.g. ${v.nodes[0]?.target?.[0]}`).slice(0, 3).join("; "));
    }
    await page.context().close();
  }
});

await browser.close();
console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) FAILED.`);
process.exit(failed === 0 ? 0 : 1);
