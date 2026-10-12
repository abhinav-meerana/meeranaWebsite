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
        const hdr = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
        return {
          t: (a.textContent || a.getAttribute("aria-label") || a.tagName).trim().slice(0, 30),
          inView: b.width > 0 && b.height > 0 && b.left >= -1 && b.right <= innerWidth + 1 && b.bottom <= innerHeight + 1,
          belowHeader: b.top >= hdr - 1 || hdr === 0 || a.closest(".site-header") !== null || /skip/.test(a.className),
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
  const mode = await page.evaluate(() => document.querySelector(".showcase")?.className ?? "");
  check(/is-rail/.test(mode), "gallery is a rail (no pin)", mode);
  const enter = await page.evaluate(() => [...document.querySelectorAll(".hero-enter")].map((el) => getComputedStyle(el).animationName).filter((n) => n !== "none"));
  check(enter.length === 0, "hero entrance animation is off", enter.join(","));
  const dim = await page.evaluate(() => [...document.querySelectorAll(".sc-panel")].map((p) => getComputedStyle(p).opacity));
  check(dim.length === 6 && dim.every((o) => o === "1"), "no gallery card is dimmed", dim.join(","));
  const hs = await page.evaluate(() => getComputedStyle(document.querySelector(".showcase")).marginTop);
  check(hs === "0px", "the hero hand-off is off (.showcase margin-top 0)", hs);
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
  await group("menus: focus moves in, cycles, and returns");
  {
    const { page } = await newPage(1440, 900);
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    const trigger = page.locator(".hdr-trigger");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    const open = await page.evaluate(() => !document.querySelector("#hdr-products-panel").hidden);
    check(open, "Enter opens the products panel");
    const links = await page.locator("#hdr-products-panel a").count();
    check(links === 7, "panel lists six products plus 'All six products'", String(links));
    const all = await page.evaluate(() => [...document.querySelectorAll("#hdr-products-panel a")].find((a) => /all six/i.test(a.textContent))?.getAttribute("href"));
    check(all === "/products/", "'All six products' points to /products/", String(all));
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(150);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(150);
    const focused = await page.evaluate(() => document.activeElement?.closest("#hdr-products-panel") !== null);
    check(focused, "ArrowDown moves focus inside the panel");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    const back = await page.evaluate(() => document.activeElement?.classList.contains("hdr-trigger"));
    const closed = await page.evaluate(() => document.querySelector("#hdr-products-panel").hidden);
    check(back && closed, "Escape closes the panel and returns focus to its button");
  }
  {
    const { page } = await newPage(390, 844);
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.locator(".hdr-toggle").click();
    await page.waitForTimeout(300);
    const inside = await page.evaluate(() => document.querySelector("#hdr-sheet").contains(document.activeElement));
    check(inside, "opening the sheet moves focus inside it");
    const n = await page.locator("#hdr-sheet a, #hdr-sheet button").count();
    let escaped = false;
    for (let i = 0; i < n + 3; i++) {
      await page.keyboard.press("Tab");
      if (!(await page.evaluate(() => document.querySelector("#hdr-sheet").contains(document.activeElement)))) escaped = true;
    }
    check(!escaped, `Tab cycles within the sheet (${n} stops, ${n + 3} presses)`);
    await page.keyboard.press("Shift+Tab");
    check(await page.evaluate(() => document.querySelector("#hdr-sheet").contains(document.activeElement)), "Shift+Tab stays inside the sheet");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const ret = await page.evaluate(() => document.activeElement?.classList.contains("hdr-toggle"));
    const hiddenNow = await page.evaluate(() => document.querySelector("#hdr-sheet").hidden);
    check(ret && hiddenNow, "Escape closes the sheet and returns focus to the toggle");
    const ctl = await page.evaluate(() => !!document.getElementById(document.querySelector(".hdr-toggle").getAttribute("aria-controls")));
    check(ctl, "aria-controls resolves while the sheet is closed");
  }
});

/* -------------------------------------------------------------------- pin */
if (want("pin")) await safely("pin", async () => {
  await group("motion budget: the gallery pins on every laptop; homepage ≤ 300vh pinned, ≤ 8.5 screens");
  for (const [w, h] of [[1093, 529], [1280, 601], [1366, 657], [1536, 730], [1920, 937], [1440, 900]]) {
    const { page } = await newPage(w, h);
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const s = document.querySelector(".showcase");
      const film = document.querySelector(".sc-film");
      const hs = document.querySelector(".hero-stage");
      const hero = document.querySelector(".hero");
      return {
        cls: s?.className ?? "none",
        film: film ? film.getBoundingClientRect().height - innerHeight : null,
        hand: hs && hero ? Math.max(0, hs.getBoundingClientRect().height - hero.getBoundingClientRect().height) : 0,
        spacer: !!document.querySelector(".pin-spacer"),
        docH: document.documentElement.scrollHeight,
        vh: innerHeight,
      };
    });
    check(/is-pinned/.test(m.cls), `${w}×${h}: the gallery is pinned`, m.cls);
    check(m.film !== null && Math.abs(m.film - 2.5 * m.vh) <= 2, `${w}×${h}: gallery travel = 2.5 × innerHeight`, `${m.film === null ? "no .sc-film" : Math.round(m.film)} vs ${2.5 * m.vh}`);
    check(!m.spacer, `${w}×${h}: CSS sticky, no GSAP pin spacer`);
    const total = (m.film ?? 0) + m.hand;
    check(total <= 3 * m.vh + 2, `${w}×${h}: homepage total pin ${(total / m.vh).toFixed(2)} × innerHeight (≤ 3)`);
    if (w === 1440) check(m.docH / m.vh <= 8.5, `${w}×${h}: homepage is ${(m.docH / m.vh).toFixed(2)} screens (≤ 8.5)`);
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

  // Previous/next move the pinned gallery one card at a time; the card they land
  // on has its call to action on screen and its neighbours are inert.
  for (const [w, h] of [[1366, 657], [1440, 900]]) {
    const { page } = await newPage(w, h);
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(1500);
    const start = await page.evaluate(() => Math.round(document.querySelector(".sc-film").getBoundingClientRect().top + scrollY));
    await page.evaluate((y) => window.scrollTo(0, y), start);
    await page.waitForTimeout(1200);
    for (let i = 0; i < 4; i++) {
      await page.locator('button[aria-label="Next product"]').click();
      await page.waitForTimeout(1300);
    }
    const r = await page.evaluate(() => {
      const p = document.querySelector('.sc-panel[data-i="4"]');
      const b = p?.querySelector(".btn-primary")?.getBoundingClientRect();
      return {
        cur: p?.classList.contains("is-current"),
        cta: b ? { l: Math.round(b.left), r: Math.round(b.right), t: Math.round(b.top), b: Math.round(b.bottom) } : null,
        w: innerWidth, h: innerHeight,
        inertOthers: [...document.querySelectorAll(".sc-panel")].filter((x) => x !== p).every((x) => x.inert),
      };
    });
    const c = r.cta;
    check(r.cur && c && c.l >= 0 && c.r <= r.w && c.t >= 0 && c.b <= r.h, `${w}×${h}: 4 × Next lands on card 5 with its call to action on screen`, JSON.stringify(r));
    check(r.inertOthers, `${w}×${h}: the dimmed neighbours are inert`);
    await page.evaluate((y) => window.scrollTo(0, y), start);
    await page.waitForTimeout(1300);
    await page.mouse.move(w / 2, h / 2);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(1500);
    const cur = await page.evaluate(() => document.querySelector(".sc-panel.is-current")?.dataset.i);
    check(cur === "1", `${w}×${h}: one wheel notch moves exactly one card`, `current ${Number(cur) + 1}`);
  }
});

/* -------------------------------------------------------------------- gpu */
if (want("gpu")) await safely("gpu", async () => {
  await group("3D room: loaded only where it should be (H-05)");
  for (const [w, h, label, expect] of [[1440, 900, "desktop", true], [1366, 657, "laptop", true], [768, 1024, "tablet", false], [390, 844, "phone", false], [1280, 480, "short", false]]) {
    const { page } = await newPage(w, h);
    const big = [];
    page.on("response", async (r) => {
      if (!/\.js(\?|$)/.test(r.url())) return;
      // three.js by content, not size: size misfires on dev builds of React.
      const b = await r.text().catch(() => "");
      if (/\bWebGLRenderer\b/.test(b) && /\bPerspectiveCamera\b/.test(b)) big.push(r.url().split("/").pop());
    });
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(2500);
    const canvas = await page.evaluate(() => !!document.querySelector(".hero-room canvas"));
    const depth = await page.evaluate(() => !!document.querySelector(".hero-depth"));
    check(
      expect ? canvas && big.length >= 1 : !canvas && big.length === 0,
      `${label} ${w}×${h}: ${expect ? "3D canvas rendered" : "no three.js chunk, no canvas"}`,
      `canvas=${canvas} depth-band=${depth} three.js chunks=${big.length}`,
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
    check(!(await page.evaluate(() => !!document.querySelector(".hero-room canvas"))), "Save-Data on a wide screen: no 3D canvas");
  }
  {
    // The room must stop rendering once the hero is off screen. GSAP's ticker
    // legitimately keeps its own frame loop, so frames are attributed to the
    // script that asked for them and only the 3D chunk's are counted.
    const { page } = await newPage(1440, 900);
    await page.addInitScript(() => {
      window.__raf = [];
      window.__on = false;
      const orig = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => {
        if (window.__on) window.__raf.push(new Error().stack || "");
        return orig(cb);
      };
    });
    // The chunk that carries three.js (and so the room's render loop), by content.
    const threeChunks = [];
    page.on("response", async (r) => {
      if (!/\.js(\?|$)/.test(r.url())) return;
      const b = await r.text().catch(() => "");
      if (/\bWebGLRenderer\b/.test(b)) threeChunks.push(r.url().split("/").pop().split("?")[0]);
    });
    await page.goto(BASE + "/", { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(2000);
    const chunk =
      threeChunks[0] ??
      (await page.evaluate(() => {
        const js = performance.getEntriesByType("resource").filter((e) => e.name.endsWith(".js"));
        js.sort((a, b) => b.decodedBodySize - a.decodedBodySize);
        return js[0]?.name.split("/").pop() ?? "";
      }));
    // The room renders on demand (frameloop "demand"): once the entrance has
    // settled it draws only when something changes, so an idle hero draws no
    // frames by design. The pointer orbit (M-home-hero-02) is what must draw,
    // so the mouse sweeps across the room column during both windows; with the
    // hero scrolled away the same sweep must draw nothing.
    const count = async () => {
      await page.evaluate(() => { window.__raf = []; window.__on = true; });
      for (let k = 0; k < 10; k++) {
        await page.mouse.move(900 + 40 * k, 300 + 20 * k);
        await page.waitForTimeout(150);
      }
      return page.evaluate((c) => ({ all: window.__raf.length, three: window.__raf.filter((s) => s.includes(c)).length }), chunk);
    };
    const visible = await count();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
    await page.waitForTimeout(2500);
    const away = await count();
    check(visible.three >= 2 && away.three === 0, `3D frames in 1.5 s with the pointer moving: ${visible.three} with the hero in view, ${away.three} after scrolling past it (all frame loops: ${away.all})`);
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
  }
});

await browser.close();
console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) FAILED.`);
process.exit(failed === 0 ? 0 : 1);
