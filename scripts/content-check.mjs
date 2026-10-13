#!/usr/bin/env node
/**
 * content:check — the content gate (FINAL-SPEC §5.3, §5.6, §12.2 P-16).
 *
 * Runs before every production build (`prebuild`). It imports the typed
 * content modules themselves (content/*.ts, via Node's type stripping and a
 * small resolver for extensionless imports), so it checks exactly what the
 * pages render, and fails the build when:
 *   · a field is over its budget (§5.3);
 *   · a cited EV id is missing from the register, or is not `ok-to-use` /
 *     `use-with-edit` (EV-520 and EV-521 are listed as OWNER-PENDING: not a
 *     pass, not a failure);
 *   · a banned string appears (§5.6), or a withdrawn image is referenced;
 *   · a pictorial visual has no provenance label;
 *   · a scene id is malformed or repeated on a page;
 *   · a real screen appears twice on one page (I9), or its file is missing;
 *   · a callout note has no ok-to-use EV;
 *   · a `confirm` item would render in a production build.
 *
 * Usage:
 *   node scripts/content-check.mjs              check the content data
 *   node scripts/content-check.mjs --html out   also scan the exported HTML
 *   node scripts/content-check.mjs --url http://localhost:3000
 *                                               also scan the routes a server renders
 *
 * Exit code 0 when clean, 1 on any failure. No dependencies.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { register } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---- load the TypeScript content ----------------------------------------- */

/* package.json has no "type", so Node notes that it parsed the .ts content as
   ES modules, and type stripping may be flagged experimental. Both are
   expected here; any other warning still prints. */
process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w.code === "MODULE_TYPELESS_PACKAGE_JSON" || /type stripping/i.test(w.message)) return;
  console.warn(w);
});

/* The content modules import each other without extensions ("./media"), as
   the Next bundler allows. Resolve those to the .ts file. */
const RESOLVER = `
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (/^\\.{1,2}\\//.test(specifier) && !/\\.[cm]?[jt]sx?$/.test(specifier)) {
      return next(specifier + ".ts", context);
    }
    throw error;
  }
}`;
register(`data:text/javascript,${encodeURIComponent(RESOLVER)}`, import.meta.url);

/* Production unless the build is a preview build (lib/flags.ts reads this). */
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

const load = (p) => import(pathToFileURL(join(ROOT, p)).href);
const { STORIES, visibleScenes } = await load("content/storyboards.ts");
const { SCREENS } = await load("content/media.ts");
const { SHOWCASE } = await load("content/showcase.ts");
const company = await load("content/company.ts");
const { SCENARIO } = await load("content/scenario.ts");
const demo = await load("content/demo-data.ts");
const { DASHBOARDS } = await load("content/dashboards.ts");

/* ---- the evidence register ----------------------------------------------- */

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

const REGISTERS = ["plan/03-evidence-register.csv", "docs/evidence-addendum-2026-10-10.csv"];
const register_ = new Map();
for (const file of REGISTERS) {
  const rows = parseCsv(readFileSync(join(ROOT, file), "utf8"));
  const head = rows[0];
  const id = head.indexOf("id");
  const status = head.indexOf("public_status");
  for (const r of rows.slice(1)) if (r[id]) register_.set(r[id].trim(), (r[status] ?? "").trim());
}

const OK_STATUS = new Set(["ok-to-use", "use-with-edit"]);
/** Proposed rows not yet merged into the register (D8). */
const OWNER_PENDING = new Set(["EV-520", "EV-521"]);

/* ---- reporting ----------------------------------------------------------- */

const failures = [];
const pending = new Map(); // EV id → set of places
const provisional = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);

function checkEvidence(where, evidence, { okOnly = false, required = true } = {}) {
  const ids = String(evidence ?? "").match(/EV-\d{3}/g) ?? [];
  if (required && ids.length === 0) fail(where, "cites no evidence");
  for (const id of ids) {
    if (OWNER_PENDING.has(id)) {
      if (!pending.has(id)) pending.set(id, new Set());
      pending.get(id).add(where);
      continue;
    }
    const status = register_.get(id);
    if (status === undefined) fail(where, `${id} is not in the evidence register`);
    else if (okOnly ? status !== "ok-to-use" : !OK_STATUS.has(status)) {
      fail(where, `${id} is "${status}" (needs ${okOnly ? "ok-to-use" : "ok-to-use or use-with-edit"})`);
    }
  }
}

function budget(where, field, value, max) {
  if (typeof value === "string" && value.length > max) {
    fail(where, `${field} is ${value.length} characters (max ${max}): "${value}"`);
  }
}

/* ---- banned strings (§5.6) and withdrawn media --------------------------- */

const BANNED = [
  [/\bimmutable\b/i, "immutable"],
  [/legally binding/i, "legally binding"],
  [/to be confirmed/i, "to be confirmed"],
  [/100\s?%\s*secure/i, "100% secure"],
  [/\b10\s?[x×]\b/i, "10x"],
  [/\bparking\b/i, "parking"],
  [/\btolls?\b/i, "toll"],
  [/\bface (search|recognition)\b|\bfacial\b/i, "face search / recognition"],
  [/suspicious behaviou?r/i, "suspicious behaviour"],
  [/licen[cs]e plates?|number plates?/i, "licence plates"],
  [/never signs/i, "the agent never signs"],
  [/voice,? in English and Arabic/i, "voice in English and Arabic"],
  [/\buniform\b/i, "uniform"],
  [/approval chains? with due dates/i, "approval chains with due dates"],
  [/for a period you set/i, "for a period you set"],
  [/\bexportable\b/i, "exportable"],
  [/to the second/i, "to the second"],
  [/several entities/i, "several entities"],
];
const WITHDRAWN_MEDIA = ["mandoobee-phones-cutout", "card-yisbir-ppe.webp"];

/** Every string value in a data structure, with its path. */
function* strings(value, path) {
  if (typeof value === "string") yield [path, value];
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* strings(value[i], `${path}[${i}]`);
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) yield* strings(v, `${path}.${k}`);
}

function scanBanned(label, data) {
  for (const [path, s] of strings(data, label)) {
    for (const [re, name] of BANNED) if (re.test(s)) fail(path, `banned string "${name}": "${s}"`);
    for (const m of WITHDRAWN_MEDIA) if (s.includes(m)) fail(path, `withdrawn image ${m}`);
  }
}

/* ---- visuals ------------------------------------------------------------- */

/** Kinds that need no provenance label: real screens carry their own; the
 * rest are type, links or real lists (§5.1; grid per §6.1). */
const NO_PROVENANCE = new Set(["screen", "none", "next", "columns", "cases", "ribbon", "grid"]);
const ID = /^[a-z][a-z-]*$/;

function checkScreen(where, screen, { callouts }) {
  const file = join(ROOT, "public", screen.src);
  if (!existsSync(file)) fail(where, `screen file is missing: ${screen.src}`);
  if (!screen.provenance) fail(where, `screen ${screen.src} has no provenance`);
  if (!screen.alt) fail(where, `screen ${screen.src} has no alt text`);
  if (!callouts) return;
  const labels = screen.labels ?? [];
  if (labels.length === 0) fail(where, `callouts are on, but ${screen.src} has no labels`);
  if (labels.length > 3) fail(where, `${labels.length} callouts on one screen (max 3)`);
  labels.forEach((l, i) => {
    const w = `${where} label ${i + 1}`;
    const text = l.text ?? l.note;
    if (!text) fail(w, "has neither text nor note");
    budget(w, "label", text, 28);
    if (!Array.isArray(l.at) || l.at.some((n) => typeof n !== "number" || n < 0 || n > 1)) {
      fail(w, "`at` must be two fractions between 0 and 1");
    }
    if (l.note) checkEvidence(w, l.ev, { okOnly: true });
  });
}

/* ---- products ------------------------------------------------------------ */

const BEAT_COUNT = { min: 10, max: 14 };

for (const story of STORIES) {
  const page = `/products/${story.slug}/`;
  budget(page, "hero", story.hero, 52);
  budget(page, "heroSub", story.heroSub, 170);
  budget(page, "closingLine", story.closingLine, 60);
  checkEvidence(`${page} title`, story.heroEvidence);
  if (story.slug === "mandoobee") {
    /* No language claim until EV-427 is confirmed (D5). */
    for (const [path, s] of strings(story, "mandoobee")) {
      if (/\barabic\b/i.test(s)) fail(path, `language claim on Mandoobee (D5): "${s}"`);
    }
  }
  scanBanned(story.slug, { ...story, beats: undefined });

  /* Everything a production build renders. */
  const scenes = visibleScenes(story);
  if (scenes.length < BEAT_COUNT.min || scenes.length > BEAT_COUNT.max) {
    fail(page, `${scenes.length} scenes (expected ${BEAT_COUNT.min}–${BEAT_COUNT.max})`);
  }

  const ids = new Set();
  const srcs = new Map();
  let act = 1;
  scenes.forEach((s, i) => {
    const where = `${page}#${s.id}`;
    if (!ID.test(s.id)) fail(where, `id "${s.id}" does not match ${ID}`);
    if (ids.has(s.id)) fail(where, `id "${s.id}" is used twice on the page`);
    ids.add(s.id);
    if (s.act < act) fail(where, `act ${s.act} follows act ${act}`);
    act = s.act;
    if (i === 0 && s.kind !== "title") fail(where, "the first scene is not the title");
    if (i === scenes.length - 1 && s.kind !== "next") fail(where, "the last scene is not next");

    if (!PREVIEW) {
      for (const x of [s, ...(s.cases ?? []), ...(s.faq ?? [])]) {
        if (x.status === "confirm") fail(where, "a `confirm` item renders in a production build");
      }
    }
    if (s.status === "provisional") provisional.push(`${where} — ${s.heading}`);

    if (s.kind !== "next" && s.kind !== "title") checkEvidence(where, s.evidence);

    const v = s.viz;
    const copyCases = s.cases?.length && v.kind !== "cases";
    const tight = Boolean(s.facts?.length || copyCases);
    budget(where, "heading", s.heading, tight ? 56 : 60);
    budget(where, "body", s.body, tight ? 120 : 160);

    if (s.steps) {
      if (s.steps.length > 5) fail(where, `${s.steps.length} steps (max 5)`);
      s.steps.forEach((x, k) => {
        budget(`${where} step ${k + 1}`, "label", x.label, 14);
        budget(`${where} step ${k + 1}`, "copy", x.copy, 90);
      });
    }
    if (s.features) {
      if (s.features.length > 6) fail(where, `${s.features.length} features (max 6)`);
      s.features.forEach((f, k) => budget(`${where} feature ${k + 1}`, "feature", f, 44));
    }
    if (s.cases) {
      /* The budget is for what production renders; a preview build may show
         its PREVIEW-only cases past it (they are listed, not failed). */
      const max = copyCases ? 4 : 6;
      const live = s.cases.filter((c) => c.status !== "confirm").length;
      if (live > max) fail(where, `${live} cases (max ${max} in this variant)`);
      else if (s.cases.length > max) console.log(`note: ${where} shows ${s.cases.length} cases in this preview build (production ${live})`);
      /* Every case is measured, PREVIEW-only ones included. */
      const all = story.scenes.find((x) => x.id === s.id)?.cases ?? s.cases;
      all.forEach((c, k) => {
        const w = `${where} case ${k + 1}`;
        budget(w, "label", c.label, 32);
        budget(w, "copy", c.copy, copyCases ? 72 : 90);
        checkEvidence(w, c.evidence);
      });
    }
    if (s.facts) {
      if (s.facts.length > 6) fail(where, `${s.facts.length} facts (max 6)`);
      s.facts.forEach((f, k) => {
        const w = `${where} fact ${k + 1}`;
        budget(w, "label", f.label, 16);
        budget(w, "value", f.value, 60);
        checkEvidence(w, f.evidence);
      });
    }
    if (s.faq) {
      if (s.faq.length > 4) fail(where, `${s.faq.length} questions (max 4)`);
      s.faq.forEach((q, k) => {
        const w = `${where} question ${k + 1}`;
        budget(w, "q", q.q, 52);
        budget(w, "a", q.a, 160);
        checkEvidence(w, q.evidence);
      });
    }
    if (s.links && s.links.length > 3) fail(where, `${s.links.length} links (max 3)`);
    if (s.sectors) checkEvidence(`${where} sectors`, s.sectors.evidence);

    if (!NO_PROVENANCE.has(v.kind) && !s.provenance) fail(where, `a "${v.kind}" visual has no provenance label`);
    if (v.kind === "ribbon" && (v.words.length < 3 || v.words.length > 7)) {
      fail(where, `ribbon has ${v.words.length} words (3–7)`);
    }
    if (v.kind === "steps" && !s.steps?.length) fail(where, "steps visual without steps");
    if (v.kind === "grid" && !s.features?.length) fail(where, "grid visual without features");
    if (v.kind === "cases" && !s.cases?.length) fail(where, "cases visual without cases");
    if (v.kind === "tiles" && v.items.length > 9) fail(where, `${v.items.length} tiles (max 9)`);
    if (s.callouts && v.kind !== "screen") fail(where, "callouts on a visual that is not a screen");

    /* Real screens on this page, including the next product's card (I9). */
    const shown = v.kind === "screen" ? v.screen : v.kind === "next" ? SHOWCASE.find((p) => p.slug === v.slug)?.shot : null;
    if (v.kind === "next" && !shown) fail(where, `next scene points at an unknown product "${v.slug}"`);
    if (shown) {
      if (srcs.has(shown.src)) fail(where, `${shown.src} is already shown in #${srcs.get(shown.src)} (I9)`);
      srcs.set(shown.src, s.id);
      if (v.kind === "screen") checkScreen(where, shown, { callouts: s.callouts });
    }
  });
}

/* ---- the gallery, media registry, homepage and company data -------------- */

SHOWCASE.forEach((p) => {
  const where = `gallery ${p.slug}`;
  checkEvidence(where, p.evidence);
  if (p.proof) checkEvidence(`${where} proof`, p.proof.evidence);
  checkScreen(`${where} shot`, p.shot, { callouts: false });
  if (p.shot2) {
    checkScreen(`${where} shot2`, p.shot2, { callouts: false });
    if (p.shot2.src === p.shot.src) fail(where, "shot2 repeats shot");
  }
});
scanBanned("gallery", SHOWCASE);

Object.entries(SCREENS).forEach(([key, screen]) => {
  checkScreen(`SCREENS.${key}`, screen, { callouts: false });
  (screen.labels ?? []).forEach((l, i) => {
    budget(`SCREENS.${key} label ${i + 1}`, "label", l.text ?? l.note, 28);
    if (l.note) checkEvidence(`SCREENS.${key} label ${i + 1}`, l.ev, { okOnly: true });
  });
});
scanBanned("media", SCREENS);

SCENARIO.forEach((s, i) => s.screen && checkScreen(`scenario step ${i + 1}`, s.screen, { callouts: false }));
scanBanned("scenario", SCENARIO);

for (const name of ["AWARDS", "PARTNERS", "SERVICES", "EVENTS", "PRESS"]) {
  (company[name] ?? []).forEach((x, i) => checkEvidence(`company ${name}[${i}]`, x.evidence));
}
checkEvidence("company FEATURE_VIDEO", company.FEATURE_VIDEO?.evidence);
(company.PRESS ?? []).forEach((p, i) => {
  if (!/^https:\/\//.test(p.url)) fail(`company PRESS[${i}]`, `not an https URL: ${p.url}`);
  if (!/^\d{4}(-\d{2}-\d{2})?$/.test(p.date)) fail(`company PRESS[${i}]`, `date "${p.date}" is not YYYY or YYYY-MM-DD`);
});
scanBanned("company", {
  AWARDS: company.AWARDS,
  PARTNERS: company.PARTNERS,
  SERVICES: company.SERVICES,
  EVENTS: company.EVENTS,
  PRESS: company.PRESS,
  FEATURE_VIDEO: company.FEATURE_VIDEO,
});

/* ---- coded dashboards (components/dashboards) ---------------------------- */

/* Sample data must look like sample data: no operational telemetry, no
   people, nothing from the excluded material (README compliance list). */
const DASHBOARD_BANNED = [
  [/\buptime\b|\blatency\b|\bSLA\b|nodes online|events\/hour/i, "telemetry figure"],
  [/\bANPR\b|\bplates?\b/i, "plates / ANPR"],
  [/\bweapons?\b|\bfirearms?\b|\bK-?9\b|\bVIP\b/i, "excluded board"],
  [/\bpolice\b|\bministry\b|\bgovernment\b/i, "tenant organisation"],
  [/sovereignty in your hands/i, "the AI in a Box sovereignty line"],
  [/\bfaces?\b|\bbehaviou?r\b/i, "faces or behaviour"],
];
const DASHBOARD_PROVENANCE = new Set(["Interface reconstruction · sample data", "Illustrative interface · sample data"]);
const demoData = Object.fromEntries(Object.entries(demo).filter(([, v]) => v && typeof v === "object"));
scanBanned("demo-data", demoData);
for (const [path, s] of strings(demoData, "demo-data")) {
  for (const [re, name] of DASHBOARD_BANNED) if (re.test(s)) fail(path, `${name} in sample data: "${s}"`);
}
Object.entries(DASHBOARDS).forEach(([key, d]) => {
  const where = `DASHBOARDS.${key}`;
  if (!d.alt) fail(where, "has no alt text");
  if (!DASHBOARD_PROVENANCE.has(d.provenance)) fail(where, `provenance "${d.provenance}" is not a dashboard label`);
  if (d.crop && (d.crop.x < 0 || d.crop.y < 0 || d.crop.x + d.crop.w > 1440)) fail(where, "crop leaves the 1440 px canvas");
});
scanBanned("dashboards", DASHBOARDS);

/* ---- optional: rendered HTML (P-16) -------------------------------------- */

/* Text that only a preview build may show. */
const previewOnly = PREVIEW
  ? []
  : STORIES.flatMap((s) =>
      s.scenes.flatMap((x) => [
        ...(x.status === "confirm" ? [x.heading] : []),
        ...(x.cases ?? []).filter((c) => c.status === "confirm").map((c) => c.copy),
        ...(x.faq ?? []).filter((q) => q.status === "confirm").map((q) => q.q),
      ]),
    );

/** One rendered page, `rel` as its export path ("products/tasree3/index.html"). */
function scanPage(rel, html) {
  /* Visible text only: drop scripts (the RSC payload repeats the page) and
     tags. */
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"');
  for (const [re, name] of BANNED) if (re.test(text)) fail(`html ${rel}`, `banned string "${name}"`);
  for (const t of previewOnly) if (text.includes(t)) fail(`html ${rel}`, `preview-only text: "${t}"`);
  for (const m of WITHDRAWN_MEDIA) if (html.includes(m)) fail(`html ${rel}`, `withdrawn image ${m}`);
  if (/^products\/[^/]+\/index\.html$/.test(rel)) {
    /* Each real screen once per product page (I9). */
    const seen = new Map();
    for (const m of html.replace(/<script[\s\S]*?<\/script>/gi, "").matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
      seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
    }
    for (const [src, n] of seen) if (n > 1 && src.includes("/media/")) fail(`html ${rel}`, `${src} appears ${n} times`);
  }
}

/* --html <dir>: the static export. */
const htmlFlag = process.argv.indexOf("--html");
if (htmlFlag > -1) {
  const outDir = resolve(ROOT, process.argv[htmlFlag + 1] ?? "out");
  if (!existsSync(outDir)) fail("--html", `no export at ${outDir}`);
  else {
    const files = [];
    const walk = (d) => {
      for (const f of readdirSync(d)) {
        const p = join(d, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (f.endsWith(".html")) files.push(p);
      }
    };
    walk(outDir);
    for (const file of files) scanPage(file.slice(outDir.length + 1).replace(/\\/g, "/"), readFileSync(file, "utf8"));
    console.log(`content:check scanned ${files.length} exported HTML files in ${outDir}`);
  }
}

/* --url <origin>: the same scan against a running server (the dev server on
   :3000, or the export served on :4173), route by route. */
const urlFlag = process.argv.indexOf("--url");
if (urlFlag > -1) {
  const origin = (process.argv[urlFlag + 1] ?? "http://localhost:3000").replace(/\/$/, "");
  const routes = ["/", "/products/", ...STORIES.map((s) => `/products/${s.slug}/`), "/services/", "/company/", "/contact/", "/privacy/"];
  for (const route of routes) {
    const rel = `${route.slice(1)}index.html`;
    try {
      const res = await fetch(origin + route);
      if (!res.ok) fail(`url ${route}`, `HTTP ${res.status}`);
      else scanPage(rel, await res.text());
    } catch (error) {
      fail(`url ${route}`, `could not fetch: ${error.message}`);
    }
  }
  console.log(`content:check scanned ${routes.length} routes on ${origin}`);
}

/* ---- result -------------------------------------------------------------- */

const count = STORIES.map((s) => `${s.slug} ${visibleScenes(s).length}`).join(" · ");
console.log(`content:check ${PREVIEW ? "(preview build)" : "(production build)"} — scenes: ${count}`);
if (pending.size) {
  console.log("OWNER-PENDING (not in the register yet; neither a pass nor a failure, D8):");
  for (const [id, where] of pending) console.log(`  ${id}: ${where.size} citation(s), e.g. ${[...where].slice(0, 3).join("; ")}`);
}
console.log(`PROVISIONAL scenes for owner approval (D4, D9): ${provisional.length}`);
for (const p of provisional) console.log(`  ${p}`);

if (failures.length) {
  console.error(`\ncontent:check FAILED with ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("content:check passed.");
