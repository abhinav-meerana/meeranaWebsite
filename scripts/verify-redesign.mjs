#!/usr/bin/env node
/**
 * Redesign verification (docs/REDESIGN-PLAN-2026-10-12.md): measures the
 * rendered behaviour of the cinematic homepage, the interactive background
 * and the responsive navigation in Playwright Chromium (software GL). It
 * asserts behaviour, never that code exists.
 *
 *   npm run build && node scripts/serve-out.mjs &   (or VERIFY_URL=…)
 *   node scripts/verify-redesign.mjs [--only story,universe,background,pillnav,wheel,reduced,nojs,console]
 *
 * Groups
 *   story       opening composition, every stage's copy, blur-to-focus, the
 *               product sequence (seven beats: Yisbir twice), the coded
 *               dashboards animating in on their beat, scrolling back, rapid
 *               scrolling, desktop and phone
 *   universe    the six-platform composition and its pointer response
 *   background  ColorBends + DotField layers, no cursor light or bulge, the
 *               deep-blue transition towards the bottom, phone fallback
 *   pillnav     desktop PillNav: pills, the Platforms panel (open, links,
 *               Escape/outside/link close, focus return, arrow keys), CTA
 *   wheel       tablet/phone OptionWheel: page scrolls through it (wheel and
 *               touch), tap to expand, tap to go, drag never navigates,
 *               keyboard, selection follows the page
 *   reduced     prefers-reduced-motion: static story, nothing blurred or moving
 *   nojs        JavaScript off: every heading readable
 *   console     zero console errors (incl. hydration) while using the page
 *
 * Exit code 1 if any check fails. Results also go to
 * docs/review/2026-10-12-redesign/verify-redesign-results.json.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { BASE, launch, newPage, goto, until } from "./verify-lib.mjs";

const OUT = path.join(process.cwd(), "docs", "review", "2026-10-12-redesign");
const only = process.argv.includes("--only") ? new Set(process.argv[process.argv.indexOf("--only") + 1].split(",")) : null;
const want = (g) => !only || only.has(g);

/* The story's choreography, read from the source of truth. */
process.removeAllListeners("warning");
const poses = await import(pathToFileURL(path.join(process.cwd(), "components/story/poses.ts")).href);
const { KEYS, SCHEDULE, FOCUS_SEQ } = poses;

const results = [];
let failed = 0;
let label = "";
const check = (ok, group, name, detail = "") => {
  name = label ? `${label} ${name}` : name;
  results.push({ group, name, ok: !!ok, detail: String(detail) });
  if (!ok) failed++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail !== "" ? ` — ${detail}` : ""}`);
};
const info = (msg) => console.log(`        ${msg}`);
const section = (t) => console.log(`\n[${t}]`);
async function safely(groupName, fn) {
  try {
    await fn();
  } catch (e) {
    check(false, groupName, `${groupName} group ran to completion`, String(e?.message ?? e).split("\n")[0].slice(0, 220));
  }
}

const browser = await launch();
const contexts = [];
async function page(vp) {
  const p = await newPage(browser, vp);
  contexts.push(p.ctx);
  return p;
}
async function closeAll() {
  for (const c of contexts.splice(0)) await c.close().catch(() => {});
}

/* Keyframe midpoints (the middle of each hold) as story progress 0–1. */
const MIDS = (() => {
  let t = SCHEDULE.opening[1];
  const mid = { opening: SCHEDULE.opening[1] / 2 };
  for (const k of KEYS.slice(1)) {
    const [T, hold] = SCHEDULE[k];
    t += T;
    mid[k] = t + hold / 2;
    t += hold;
  }
  const out = {};
  for (const k of KEYS) out[k] = mid[k] / t;
  return out;
})();
/** Story progress at fraction `f` through the transition INTO keyframe k. */
const TRANSITION = (() => {
  let t = SCHEDULE.opening[1];
  const start = {};
  for (const k of KEYS.slice(1)) {
    start[k] = t;
    t += SCHEDULE[k][0] + SCHEDULE[k][1];
  }
  return (k, f) => (start[k] + f * SCHEDULE[k][0]) / t;
})();
const COPY_AT = {
  opening: "beat-opening", reveal: "beat-reveal", platforms: "beat-platforms",
  p0: "cap-0", p1: "cap-1", p2: "cap-2", p3: "cap-3", p4: "cap-4", p5: "cap-5", p6: "cap-6",
  capability: "beat-capability", next: "beat-next", universe: "beat-universe",
};
/** The six platforms (arrangement, universe); FOCUS_SEQ is the beat order. */
const PRODUCTS = ["mandoobee", "tasree3", "nazo", "yisbir", "wasel", "ai-in-a-box"];

async function scrollToKey(p, k) {
  await p.evaluate((prog) => {
    const s = document.querySelector(".story");
    window.scrollTo(0, Math.round(s.offsetTop + prog * (s.offsetHeight - innerHeight)));
  }, MIDS[k]);
  await settleStage(p);
}
/** Wait until the scrub has caught up with the scroll position. The progress
 *  bar's scaleX IS the timeline's progress (one linear tween across it), so
 *  "bar = scroll progress" means every tween is at its value for this
 *  position. Headless Chromium renders with SwiftShader (software GL), where
 *  a frame full of blurred layers can stall for over a second, so "nothing
 *  changed for a while" is not a reliable rest signal; this is exact. */
async function settleStage(p, ms = 25000) {
  const lag = () =>
    p.evaluate(() => {
      const s = document.querySelector(".story");
      const bar = document.querySelector(".story-progress-bar");
      const want = Math.min(1, Math.max(0, (scrollY - s.offsetTop) / (s.offsetHeight - innerHeight)));
      const have = new DOMMatrix(getComputedStyle(bar).transform).a;
      return Math.abs(want - have);
    });
  await p.waitForTimeout(700);
  const t0 = Date.now();
  while (Date.now() - t0 < ms && (await lag()) > 0.0015) await p.waitForTimeout(150);
  await p.waitForTimeout(350);
}
/** Stage state: each screen's box, blur, opacity, visibility; each copy block's visibility. */
const stage = (p) =>
  p.evaluate(() => {
    const blur = (f) => Number((/blur\(([\d.]+)px\)/.exec(f) ?? [0, 0])[1]);
    const screens = {};
    for (const s of document.querySelectorAll(".sp")) {
      const cs = getComputedStyle(s);
      const r = s.getBoundingClientRect();
      const img = s.querySelector("img");
      const dash = s.querySelector(".dash-frame");
      screens[s.dataset.key] = {
        area: Math.round(r.width * r.height),
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        l: r.left, t: r.top, r: r.right, b: r.bottom,
        blur: blur(cs.filter),
        o: Number(cs.opacity),
        shown: cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0.05,
        /* A screenshot has decoded; a coded dashboard has laid out its canvas. */
        loaded: img ? img.complete && img.naturalWidth > 0 : !!dash && dash.querySelector(".dash-zoom").getBoundingClientRect().width > 0,
        focus: dash ? dash.dataset.focus : undefined,
      };
    }
    const copy = {};
    for (const c of document.querySelectorAll("[data-copy]")) {
      const cs = getComputedStyle(c);
      copy[c.dataset.copy] = cs.visibility !== "hidden" && Number(cs.opacity) > 0.9;
    }
    const h1 = document.querySelector("#story-title").getBoundingClientRect();
    return { screens, copy, h1cx: h1.left + h1.width / 2, vw: innerWidth, vh: innerHeight, layout: document.querySelector(".story").dataset.layout, motion: document.documentElement.dataset.motion };
  });
const onlyCopy = (st, id) => st.copy[id] && Object.entries(st.copy).every(([k, v]) => k === id || !v);

/* ================================================================== story */
if (want("story")) await safely("story", async () => {
  for (const vp of [{ w: 1440, h: 900 }, { w: 1280, h: 720 }, { w: 390, h: 844, touch: true }]) {
    section(`story ${vp.w}×${vp.h}${vp.touch ? " touch" : ""}`);
    label = `[${vp.w}×${vp.h}]`;
    const { page: p, ctx: vctx } = await page(vp);
    await goto(p, "/");
    await until(p, () => document.querySelector(".story")?.dataset.story === "ready", null, 8000);
    await p.waitForTimeout(600);
    let st = await stage(p);
    const narrow = st.layout === "narrow";
    if (st.layout !== "wide" && st.layout !== "narrow") {
      check(false, "story", "cinematic mode armed", `layout=${st.layout} motion=${st.motion}`);
      await vctx.close();
      continue;
    }
    const focal = narrow ? "yisbir" : "ai-in-a-box";
    check(st.motion === "full" && st.layout === (vp.w < 768 ? "narrow" : "wide"), "story", `cinematic mode armed (${st.layout})`, `motion=${st.motion}`);

    /* Opening: real screens fill the first viewport, layered and mostly soft. */
    const vis = Object.entries(st.screens).filter(([, s]) => s.shown && s.loaded && s.r > 0 && s.l < st.vw && s.b > 0 && s.t < st.vh);
    check(vis.length >= (narrow ? 4 : 7), "story", `opening: ${vis.length} product screens visible in the first viewport`);
    /* Dashboards not yet on screen wait to animate in; visible ones are at rest. */
    const dashFocus = Object.entries(st.screens).filter(([, s]) => s.focus !== undefined);
    check(
      dashFocus.length >= 5 && dashFocus.every(([, s]) => (s.focus === "1") === (s.o > 0.05)),
      "story",
      `opening: ${dashFocus.length} coded dashboards, held back exactly until they appear`,
      dashFocus.map(([k, s]) => `${k}=${s.focus}`).join(" "),
    );
    const soft = vis.filter(([k, s]) => k !== focal && s.blur >= (narrow ? 0.5 : 4));
    check(soft.length >= (narrow ? 2 : 5), "story", `opening: ${soft.length} background screens blurred, focal ${st.screens[focal].blur}px`);
    check(st.screens[focal].area === Math.max(...Object.values(st.screens).map((s) => s.area)), "story", "opening: one dominant focal screen");
    check(onlyCopy(st, "beat-opening"), "story", "opening: only “Complexity, Meet Clarity.” is shown");
    check(Math.abs(st.h1cx - st.vw / 2) < st.vw * 0.02, "story", "opening: headline centred", `${Math.round(st.h1cx)} vs ${st.vw / 2}`);
    const openingFocal = st.screens[focal];

    /* Every stage. */
    for (const k of KEYS.slice(1)) {
      await scrollToKey(p, k);
      st = await stage(p);
      check(onlyCopy(st, COPY_AT[k]), "story", `${k}: its copy (${COPY_AT[k]}) is the only copy on screen`);
      if (k === "reveal") {
        check(st.screens[focal].blur === 0 && st.screens[focal].area > openingFocal.area, "story", "reveal: the focal screen sharpens and grows", `blur ${openingFocal.blur}→${st.screens[focal].blur}, area ×${(st.screens[focal].area / openingFocal.area).toFixed(2)}`);
      }
      if (k === "platforms") {
        const six = PRODUCTS.filter((x) => st.screens[x].shown);
        check(six.length === 6 && !st.screens["yisbir-index"].shown, "story", `platforms: all six platforms arranged together (${six.length}), one screen each`);
      }
      if (/^p\d$/.test(k)) {
        const i = Number(k[1]);
        const key = FOCUS_SEQ[i];
        const s = st.screens[key];
        const biggest = Object.entries(st.screens).sort((a, b) => b[1].area - a[1].area)[0][0];
        check(biggest === key && s.blur === 0 && s.loaded, "story", `${k}: ${key} is in focus (largest, sharp, loaded)`, `largest=${biggest} blur=${s.blur}`);
        if (s.focus !== undefined) check(s.focus === "1", "story", `${k}: its dashboard has animated in`, `data-focus=${s.focus}`);
        if (i > 0) {
          const prev = st.screens[FOCUS_SEQ[i - 1]];
          check(prev.shown && prev.area < s.area * 0.7, "story", `${k}: ${FOCUS_SEQ[i - 1]} recedes instead of vanishing`, `opacity ${prev.o.toFixed(2)}, blur ${prev.blur}`);
        }
      }
      if (k === "capability") {
        const details = Object.entries(st.screens).filter(([x, s]) => x.startsWith("d-") && s.shown && s.blur <= 2);
        check(details.length >= 3, "story", `capability: ${details.length} interface details framing the message`);
      }
    }

    /* Blur-to-focus is progressive: halfway into "p0", Mandoobee's blur is
       between its arrangement value and sharp, not switched at the end. */
    await p.evaluate((prog) => {
      const s = document.querySelector(".story");
      window.scrollTo(0, Math.round(s.offsetTop + prog * (s.offsetHeight - innerHeight)));
    }, TRANSITION("p0", 0.5));
    await settleStage(p);
    st = await stage(p);
    const from = poses.poseAt(st.layout, "mandoobee", "platforms").b;
    const k = vp.touch ? 0.35 : 1;
    const mid = st.screens.mandoobee.blur;
    check(mid > 0.05 && mid < from * k - 0.05, "story", "blur resolves progressively (mid-transition value)", `${from * k}px → ${mid}px → 0px`);

    /* Scrolling back to the start restores the opening exactly. */
    await scrollToKey(p, "opening");
    st = await stage(p);
    check(onlyCopy(st, "beat-opening") && Math.abs(st.screens[focal].blur - openingFocal.blur) < 0.15, "story", "scrolling back: the opening is restored", `focal blur ${st.screens[focal].blur}`);

    /* Rapid, random scrolling, then a deliberate stop. */
    await p.evaluate(async () => {
      const s = document.querySelector(".story");
      for (let i = 0; i < 30; i++) {
        window.scrollTo(0, s.offsetTop + Math.random() * (s.offsetHeight - innerHeight));
        await new Promise((r) => setTimeout(r, 25));
      }
    });
    await scrollToKey(p, "p3");
    st = await stage(p);
    const biggest = Object.entries(st.screens).sort((a, b) => b[1].area - a[1].area)[0][0];
    check(onlyCopy(st, "cap-3") && biggest === "yisbir" && st.screens.yisbir.blur === 0, "story", "rapid scrolling: lands cleanly on the expected stage (Yisbir)", `largest=${biggest}`);

    /* Accessibility in cinematic mode: no beat is removed from the
       accessibility tree, and keyboard focus brings hidden copy on screen. */
    const tree = await p.evaluate(() => [...document.querySelectorAll(".story h1, .story h2, .story h3")].filter((h) => {
      for (let n = h; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.visibility === "hidden" || cs.display === "none" || n.getAttribute("aria-hidden") === "true") return false;
      }
      return true;
    }).length);
    check(tree === 13, "story", "every story heading stays in the accessibility tree (13: 6 beats, 7 platform captions)", String(tree));
    await p.evaluate(() => window.scrollTo(0, 0));
    await settleStage(p);
    await p.evaluate(() => document.querySelector('[data-copy="cap-4"] a').focus());
    await settleStage(p);
    st = await stage(p);
    const live = await p.evaluate(() => document.querySelector('[data-copy="cap-4"]').dataset.live);
    check(onlyCopy(st, "cap-4") && live === "1", "story", "keyboard focus on an off-screen caption link scrolls its moment into view", `live=${live}`);
    const stray = await p.evaluate(() => [...document.querySelectorAll(".story [data-copy] a")].filter((a) => getComputedStyle(a).pointerEvents !== "none" && a.closest("[data-copy]").dataset.live !== "1").length);
    check(stray === 0, "story", "links in copy that is not on screen take no clicks", String(stray));

    /* The pin releases into the landing page. */
    await p.evaluate(() => document.getElementById("platforms").scrollIntoView());
    await p.waitForTimeout(700);
    const after = await p.evaluate(() => ({ top: Math.round(document.getElementById("platforms").getBoundingClientRect().top), plats: document.querySelectorAll("#platforms .plat").length }));
    check(after.top >= 0 && after.top < 200 && after.plats === 6, "story", "the story releases into the platform section (six platforms)", JSON.stringify(after));
    const len = await p.evaluate(() => (document.querySelector(".story").offsetHeight - innerHeight) / innerHeight);
    info(`story scroll distance: ${len.toFixed(2)} viewport heights`);
    /* Close now: software GL renders every open page, and a live homepage
       left open starves the next viewport's load. */
    await vctx.close();
  }
  label = "";
  await closeAll();
});

/* =============================================================== universe */
if (want("universe")) await safely("universe", async () => {
  section("universe 1440×900: six platforms, one pointer-reactive structure");
  const { page: p } = await page({ w: 1440, h: 900 });
  await goto(p, "/");
  await until(p, () => document.querySelector(".story")?.dataset.story === "ready", null, 8000);
  await scrollToKey(p, "universe");
  const st = await stage(p);
  const six = PRODUCTS.map((k) => st.screens[k]);
  check(six.every((s) => s.shown && s.loaded && s.blur <= 0.6), "universe", "all six platforms shown, loaded and sharp", six.map((s) => s.blur).join(","));
  const areas = six.map((s) => s.area);
  check(Math.max(...areas) / Math.min(...areas) > 1.8, "universe", "not equally prominent: one central focal screen", `area ratio ${(Math.max(...areas) / Math.min(...areas)).toFixed(2)}`);
  let overlaps = 0;
  for (let i = 0; i < 6; i++)
    for (let j = i + 1; j < 6; j++) {
      const a = six[i], b = six[j];
      if (a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b) overlaps++;
    }
  check(overlaps >= 3, "universe", `intentional overlaps between panels (${overlaps} pairs)`);
  const z = await p.evaluate(() => [...document.querySelectorAll('.sp[data-role="product"]')].map((s) => Math.round(new DOMMatrix(getComputedStyle(s).transform).m43)));
  check(new Set(z).size >= 5, "universe", "panels sit at different depths (translateZ)", z.join(", "));
  const tags = await p.evaluate(() => [...document.querySelectorAll(".sp-tag")].filter((t) => Number(getComputedStyle(t).opacity) > 0.9).length);
  check(tags === 6, "universe", "each platform is labelled", String(tags));
  check(!st.screens["yisbir-index"].shown, "universe", "one screen per platform (Yisbir's second screen has withdrawn)");

  /* The pointer loop writes these inline; read them exactly. */
  const read = () =>
    p.evaluate(() => {
      const t = document.querySelector(".story-tilt").style.transform;
      const num = (re, str) => Number((re.exec(str) ?? [0, 0])[1]);
      const par = (k) => num(/translate3d\((-?[\d.]+)px/, document.querySelector(`.sp[data-key="${k}"] .sp-par`).style.transform);
      return { ry: num(/rotateY\((-?[\d.]+)deg\)/, t), rx: num(/rotateX\((-?[\d.]+)deg\)/, t), near: par("ai-in-a-box"), far: par("wasel") };
    });
  /* Sweep, then poll until the smoothed response has (nearly) arrived.
     SwiftShader can starve rAF for a second, so a fixed wait is not enough. */
  const sweep = async (x, y, settled) => {
    for (let k = 0; k < 8; k++) await p.mouse.move(x + k * 2, y + k, { steps: 2 });
    const t0 = Date.now();
    let r = await read();
    while (Date.now() - t0 < 8000 && !settled(r)) {
      await p.waitForTimeout(250);
      r = await read();
    }
    await p.waitForTimeout(400);
    return read();
  };
  const left = await sweep(80, 450, (r) => r.ry < -2);
  const right = await sweep(1340, 450, (r) => r.ry > 2);
  check(left.ry < -2 && right.ry > 2, "universe", "the whole structure turns with the pointer (left vs right)", `rotateY ${left.ry.toFixed(1)}° → ${right.ry.toFixed(1)}°`);
  const up = await sweep(720, 60, (r) => Math.abs(r.rx) > 1.5);
  const down = await sweep(720, 860, (r) => Math.abs(r.rx) > 1.5 && Math.sign(r.rx) !== Math.sign(up.rx));
  check(Math.sign(up.rx) !== Math.sign(down.rx) && Math.abs(up.rx - down.rx) > 2, "universe", "and tilts with vertical movement", `rotateX ${up.rx.toFixed(1)}° vs ${down.rx.toFixed(1)}°`);
  check(Math.abs(right.near) > Math.abs(right.far) * 1.5 && Math.abs(right.near) > 5, "universe", "parallax is depth-aware (near panels move more)", `near ${right.near.toFixed(1)}px, far ${right.far.toFixed(1)}px`);
  check(Math.abs(right.ry) <= 8 && Math.abs(down.rx) <= 6, "universe", "rotation stays subtle (≤ 8°)", `${right.ry.toFixed(1)}°, ${down.rx.toFixed(1)}°`);
  /* Leaving the window: the structure returns to rest. */
  await p.mouse.move(1340, 450);
  await p.evaluate(() => document.dispatchEvent(new MouseEvent("mouseout", { relatedTarget: null, bubbles: true })));
  {
    const t0 = Date.now();
    while (Date.now() - t0 < 8000) {
      const r = await read();
      if (Math.abs(r.ry) < 0.6 && Math.abs(r.rx) < 0.6) break;
      await p.waitForTimeout(250);
    }
  }
  const rest = await read();
  check(Math.abs(rest.ry) < 0.6 && Math.abs(rest.rx) < 0.6, "universe", "pointer leaves: it eases back to rest", `${rest.ry.toFixed(2)}°, ${rest.rx.toFixed(2)}°`);
  await closeAll();
});

/* ============================================================= background */
if (want("background")) await safely("background", async () => {
  section("background: ColorBends + DotField on desktop, deep blue towards the bottom, static gradient on touch");
  {
    const { page: p } = await page({ w: 1440, h: 900 });
    await goto(p, "/");
    await until(p, () => document.querySelectorAll(".mib canvas").length === 2 && document.querySelector(".mib-dots canvas").height > 0, null, 15000);
    await p.waitForTimeout(1500);
    const bg = await p.evaluate(() => {
      const bends = document.querySelector(".mib-bends canvas");
      const dots = document.querySelector(".mib-dots canvas");
      const gl = bends?.getContext("webgl2") ?? bends?.getContext("webgl");
      const cs = getComputedStyle(document.querySelector(".mib"));
      let dotsPainted = 0;
      if (dots) {
        const d = dots.getContext("2d").getImageData(0, 0, dots.width, dots.height).data;
        for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 0) dotsPainted++;
      }
      return {
        mode: document.querySelector(".mib").dataset.mode,
        bends: bends ? { w: bends.width, h: bends.height, lost: gl ? gl.isContextLost() : "no-ctx" } : null,
        dots: dots ? { w: dots.width, h: dots.height, painted: dotsPainted } : null,
        z: cs.zIndex, pe: cs.pointerEvents, pos: cs.position,
        behind: Number(getComputedStyle(document.querySelector(".page-content")).zIndex) > Number(cs.zIndex),
      };
    });
    check(bg.mode === "live" && bg.bends && bg.bends.w > 0 && bg.bends.lost === false, "background", "ColorBends renders (WebGL canvas, context alive)", JSON.stringify(bg.bends));
    check(bg.dots && bg.dots.h > 0 && bg.dots.painted > 50, "background", "DotField renders its dot grid", JSON.stringify(bg.dots));
    check(bg.pos === "fixed" && bg.pe === "none" && bg.behind, "background", "fixed behind all content, never intercepts the pointer", `z ${bg.z}`);
    /* No cursor light and no dot bulge (owner, 2026-10-13): nothing in the
       background is drawn from the pointer. */
    const lights = await p.evaluate(() => ({
      glow: document.querySelectorAll(".mib-glow, .mib-dots svg").length,
      gx: getComputedStyle(document.querySelector(".mib")).getPropertyValue("--gx").trim(),
    }));
    check(lights.glow === 0 && lights.gx === "", "background", "no cursor light: no glow layer, no pointer-driven light", JSON.stringify(lights));
    /* The bands still move on their own (time). */
    await p.addStyleTag({ content: ".page-content, .mib-dots, .nav-desktop { visibility: hidden !important; }" });
    const a = await p.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
    await p.waitForTimeout(1500);
    const b = await p.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
    check(Buffer.compare(a, b) !== 0, "background", "ColorBends animates over time");
    /* Deep blue towards the bottom: none in the story, rising through the
       landing page, full at the end. */
    const deep = () =>
      p.evaluate(() => ({
        v: Number(getComputedStyle(document.querySelector(".mib")).getPropertyValue("--deep")),
        o: Number(getComputedStyle(document.querySelector(".mib-deep")).opacity),
      }));
    const at = async (y) => {
      await p.evaluate((y) => window.scrollTo(0, y === "end" ? document.documentElement.scrollHeight : y), y);
      await p.waitForTimeout(700);
      return deep();
    };
    const d0 = await at(0);
    /* Halfway between the start marker (the platform section at mid-screen)
       and the bottom: smoothstep(0.5) = 0.5. */
    const dMid = await p.evaluate(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const start = document.querySelector("[data-deep-start]").getBoundingClientRect().top + scrollY - innerHeight * 0.5;
      return Math.round(start + (max - start) / 2);
    }).then(at);
    const dEnd = await at("end");
    check(d0.v === 0 && d0.o < 0.01, "background", "deep blue: none at the top", JSON.stringify(d0));
    check(Math.abs(dMid.v - 0.5) < 0.08, "background", "deep blue: half way at the middle of the landing page", JSON.stringify(dMid));
    check(dEnd.v > 0.97 && dEnd.o > 0.97, "background", "deep blue: full at the bottom", JSON.stringify(dEnd));
  }
  for (const vp of [{ w: 390, h: 844, touch: true }, { w: 820, h: 1180, touch: true }]) {
    const { page: p } = await page(vp);
    await goto(p, "/");
    await p.waitForTimeout(1500);
    const m = await p.evaluate(() => ({ mode: document.querySelector(".mib").dataset.mode, canvases: document.querySelectorAll(".mib canvas").length, bg: getComputedStyle(document.querySelector(".mib-base")).backgroundImage.includes("gradient") }));
    check(m.mode === "static" && m.canvases === 0 && m.bg, "background", `${vp.w}×${vp.h} touch: lightweight static gradient, no canvas`, JSON.stringify(m));
  }
  await closeAll();
});

/* ================================================================ pillnav */
if (want("pillnav")) await safely("pillnav", async () => {
  section("desktop PillNav (≥1024 px)");
  const { page: p } = await page({ w: 1440, h: 900 });
  await goto(p, "/");
  await p.waitForTimeout(1200);
  /* The nav is fixed; test it over a light part of the page, so SwiftShader
     is not also compositing the story's blurred layers on every frame. */
  await p.evaluate(() => document.getElementById("about").scrollIntoView());
  await p.waitForTimeout(600);
  const vis = await p.evaluate(() => ({ d: getComputedStyle(document.querySelector(".nav-desktop")).display, m: getComputedStyle(document.querySelector(".nav-mobile")).display }));
  check(vis.d === "block" && vis.m === "none", "pillnav", "only the PillNav is active at 1440 px", JSON.stringify(vis));
  const bar = await p.evaluate(() => ({
    pills: [...document.querySelectorAll(".pill-nav .pill")].map((x) => x.querySelector(".pill-label")?.textContent.trim()),
    logo: document.querySelector(".pill-logo")?.getAttribute("href"),
    cta: document.querySelector(".pill-cta")?.getAttribute("href"),
    h: Math.round(document.querySelector(".pill-nav").getBoundingClientRect().height),
  }));
  check(bar.pills.join("|") === "Platforms|Solutions|Technology|About|Contact", "pillnav", "five pills: Platforms, Solutions, Technology, About, Contact", bar.pills.join(", "));
  check(bar.logo === "/" && bar.cta === "/contact/", "pillnav", "logo goes home, the CTA goes to the real contact page", JSON.stringify(bar));
  const state = () =>
    p.evaluate(() => {
      const btn = document.querySelector(".pill-nav button.pill");
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      return {
        exp: btn.getAttribute("aria-expanded"),
        hidden: panel.hidden,
        shown: !panel.hidden && getComputedStyle(panel).display !== "none" && panel.getBoundingClientRect().height > 80,
        focus: document.activeElement === btn ? "button" : document.activeElement?.closest(".pill-panel") ? "panel" : document.activeElement?.tagName ?? "",
      };
    });
  const waitState = async (ok, ms = 8000) => {
    const t0 = Date.now();
    let s = await state();
    while (Date.now() - t0 < ms && !ok(s)) {
      await p.waitForTimeout(150);
      s = await state();
    }
    return s;
  };
  const OPEN = (s) => s.exp === "true" && s.shown;
  const CLOSED = (s) => s.exp === "false" && s.hidden;
  const tag = await p.evaluate(() => document.querySelector(".pill-nav .pill[aria-controls]").tagName);
  check(tag === "BUTTON", "pillnav", "Platforms is a native button that controls its panel", tag);
  let s = await state();
  check(CLOSED(s), "pillnav", "the panel starts closed (hidden)", JSON.stringify(s));
  await p.click(".pill-nav button.pill");
  s = await waitState(OPEN);
  check(OPEN(s), "pillnav", "a click opens the Platforms panel", JSON.stringify(s));
  const links = await p.evaluate(() => [...document.querySelectorAll(".pill-panel:not([hidden]) a")].map((a) => a.getAttribute("href")));
  check(
    links.length === 7 && ["mandoobee", "tasree3", "nazo", "yisbir", "wasel", "ai-in-a-box"].every((x) => links.includes(`/products/${x}/`)) && links.includes("/products/"),
    "pillnav",
    `the panel lists all six platforms and the overview (${links.length} links)`,
    links.join(" "),
  );
  await p.keyboard.press("Escape");
  s = await waitState(CLOSED);
  check(CLOSED(s) && s.focus === "button", "pillnav", "Escape closes it and returns focus to the button", JSON.stringify(s));
  /* Keyboard: ArrowDown opens and moves into the panel; arrows cycle. */
  await p.focus(".pill-nav button.pill");
  await p.keyboard.press("ArrowDown");
  s = await waitState((x) => OPEN(x) && x.focus === "panel");
  check(OPEN(s) && s.focus === "panel", "pillnav", "keyboard: ArrowDown opens it and focuses the first platform", JSON.stringify(s));
  const first = await p.evaluate(() => document.activeElement.getAttribute("href"));
  await p.keyboard.press("ArrowDown");
  const second = await p.evaluate(() => document.activeElement.getAttribute("href"));
  check(first !== second && /^\/products\//.test(second), "pillnav", "arrow keys move between the panel's links", `${first} → ${second}`);
  /* Focus leaving the navigation closes it. */
  await p.evaluate(() => document.querySelector("footer a[href]").focus());
  s = await waitState(CLOSED);
  check(CLOSED(s), "pillnav", "focus moving out of the panel closes it", JSON.stringify(s));
  /* Outside click closes. */
  await p.click(".pill-nav button.pill");
  await waitState(OPEN);
  await p.mouse.click(720, 700);
  s = await waitState(CLOSED);
  check(CLOSED(s), "pillnav", "a click outside closes it", JSON.stringify(s));
  /* Rapid toggling (7 clicks) ends open and consistent. */
  for (let i = 0; i < 7; i++) {
    await p.click(".pill-nav button.pill");
    await p.waitForTimeout(45);
  }
  s = await waitState(OPEN);
  check(OPEN(s), "pillnav", "rapid toggling settles in the right state (open)", JSON.stringify(s));
  /* A platform link closes the panel and navigates. */
  await p.click('.pill-panel:not([hidden]) a[href="/products/wasel/"]');
  await p.waitForURL(/\/products\/wasel\/$/, { timeout: 10000 }).catch(() => {});
  check(/\/products\/wasel\/$/.test(p.url()), "pillnav", "a platform link goes to its product page", p.url());
  s = await waitState(CLOSED);
  check(CLOSED(s), "pillnav", "and the panel is closed after navigating", JSON.stringify(s));
  /* A section pill lands on its homepage section. */
  await goto(p, "/");
  await p.waitForTimeout(900);
  await p.click('.pill-nav a.pill[href="/#technology"]');
  await p.waitForTimeout(1200);
  const tech = await p.evaluate(() => Math.round(document.getElementById("technology").getBoundingClientRect().top));
  check(tech >= 0 && tech < 200, "pillnav", "the Technology pill lands on its section", `technology top ${tech}`);
  await closeAll();
});

/* ================================================================== wheel */
if (want("wheel")) await safely("wheel", async () => {
  for (const vp of [{ w: 390, h: 844, touch: true }, { w: 820, h: 1180, touch: true }]) {
    section(`OptionWheel ${vp.w}×${vp.h} touch`);
    label = `[${vp.w}×${vp.h}]`;
    const { page: p, ctx } = await page(vp);
    await goto(p, "/");
    await p.waitForTimeout(1500);
    const vis = await p.evaluate(() => ({ d: getComputedStyle(document.querySelector(".nav-desktop")).display, m: getComputedStyle(document.querySelector(".nav-mobile")).display }));
    check(vis.d === "none" && vis.m === "block", "wheel", "only the wheel is active", JSON.stringify(vis));
    const dock = await p.evaluate(() => {
      const r = document.querySelector(".wheel-dock").getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, right: innerWidth - r.right };
    });
    const wheelState = () =>
      p.evaluate(() => ({
        expanded: document.querySelector(".wheel-dock").classList.contains("is-expanded"),
        selected: document.querySelector('.option-wheel [aria-selected="true"]')?.textContent,
        ta: getComputedStyle(document.querySelector(".option-wheel")).touchAction,
        y: Math.round(scrollY),
      }));
    let w = await wheelState();
    check(w.ta === "pan-y" && !w.expanded && w.selected === "Home", "wheel", "collapsed: shows Home, lets vertical touch scrolling through", JSON.stringify(w));
    check(dock.right >= 8 && dock.w < vp.w * 0.5, "wheel", "compact, on the right edge", JSON.stringify(dock));

    /* A real touch swipe (raw CDP touch events, through Chromium's gesture
       pipeline; synthesizeScrollGesture does not scroll in headless) that
       starts on the collapsed wheel scrolls the page. */
    const cdp = await ctx.newCDPSession(p);
    const swipe = async (x, y, dy) => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      for (let i = 1; i <= 12; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - (dy * i) / 12 }] });
        await p.waitForTimeout(16);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await p.waitForTimeout(1200);
    };
    await swipe(Math.round(dock.x), Math.round(dock.y), 300);
    const y1 = (await wheelState()).y;
    check(y1 > 150, "wheel", "a touch swipe on the collapsed wheel scrolls the page", `scrollY ${y1}`);
    /* So does a mouse wheel over it (tablet with a trackpad). */
    await p.mouse.move(dock.x, dock.y);
    await p.mouse.wheel(0, 400);
    await p.waitForTimeout(500);
    const y2 = (await wheelState()).y;
    check(y2 > y1 + 200, "wheel", "a mouse wheel over the collapsed wheel scrolls the page", `${y1} → ${y2}`);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(600);

    /* Tap expands; nothing navigates. */
    await p.tap(".wheel-dock .option-wheel");
    await p.waitForTimeout(600);
    w = await wheelState();
    check(w.expanded && w.ta === "none" && w.y < 5, "wheel", "a tap expands it (drag mode) without navigating", JSON.stringify(w));
    /* While expanded, the mouse wheel moves the highlight, not the page. */
    const exp = await p.evaluate(() => { const r = document.querySelector(".wheel-dock").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await p.mouse.move(exp.x, exp.y);
    await p.mouse.wheel(0, 60);
    await p.waitForTimeout(600);
    w = await wheelState();
    check(w.y < 5 && w.selected === "Platforms", "wheel", "expanded: the wheel scrolls the options, not the page", JSON.stringify(w));
    /* A touch drag on the expanded wheel moves the highlight, not the page,
       and never navigates. */
    const before = w.selected;
    await swipe(Math.round(exp.x), Math.round(exp.y), 70);
    w = await wheelState();
    check(w.y < 5 && w.expanded && w.selected !== before, "wheel", "a touch drag on the expanded wheel browses options: no page scroll, no navigation", `${before} → ${w.selected}, ${JSON.stringify(w)}`);
    /* Tap an option: it navigates to the real section and collapses. */
    await p.evaluate(() => [...document.querySelectorAll(".option-wheel__item")].find((x) => x.textContent === "Platforms").click());
    await p.waitForTimeout(1200);
    w = await wheelState();
    const top = await p.evaluate(() => Math.round(document.getElementById("platforms").getBoundingClientRect().top));
    check(!w.expanded && top >= 0 && top < 140 && w.selected === "Platforms", "wheel", "tapping Platforms goes to the platform section and collapses", `top ${top}, ${JSON.stringify(w)}`);

    /* Selection follows ordinary scrolling (no feedback loop: the page does not move by itself). */
    for (const [id, label] of [["solutions", "Solutions"], ["technology", "Technology"], ["about", "About"], ["contact", "Contact"]]) {
      await p.evaluate((x) => document.getElementById(x).scrollIntoView(), id);
      let a = await wheelState();
      for (let t0 = Date.now(); a.selected !== label && Date.now() - t0 < 6000; a = await wheelState()) await p.waitForTimeout(200);
      await p.waitForTimeout(600);
      const b = await wheelState();
      check(a.selected === label && Math.abs(a.y - b.y) < 2, "wheel", `scrolling to #${id} selects “${label}” and nothing else moves`, `${a.selected}, y ${a.y}→${b.y}`);
    }
    /* Keyboard: Enter expands, ArrowUp ×3, Enter goes. */
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(900);
    await p.focus(".wheel-dock .option-wheel");
    await p.keyboard.press("Enter");
    await p.waitForTimeout(400);
    for (let i = 0; i < 2; i++) await p.keyboard.press("ArrowDown");
    await p.waitForTimeout(400);
    await p.keyboard.press("Enter");
    await p.waitForTimeout(1200);
    const sol = await p.evaluate(() => Math.round(document.getElementById("solutions").getBoundingClientRect().top));
    check(sol >= 0 && sol < 140, "wheel", "keyboard: Enter, ↓↓, Enter goes to Solutions", `top ${sol}`);
    await p.focus(".wheel-dock .option-wheel");
    await p.keyboard.press("Enter");
    await p.waitForTimeout(300);
    await p.keyboard.press("Escape");
    await p.waitForTimeout(400);
    const esc = await p.evaluate(() => ({ expanded: document.querySelector(".wheel-dock").classList.contains("is-expanded"), focus: document.activeElement?.classList.contains("option-wheel") }));
    check(!esc.expanded && esc.focus, "wheel", "Escape collapses it and keeps focus on the wheel", JSON.stringify(esc));
    /* Off the homepage the wheel navigates by route. */
    await p.focus(".wheel-dock .option-wheel");
    await goto(p, "/company/");
    await p.waitForTimeout(800);
    const sel = (await wheelState()).selected;
    check(sel === "About", "wheel", "on /company/ the wheel shows About", String(sel));
    await p.tap(".wheel-dock .option-wheel");
    await p.waitForTimeout(400);
    await p.evaluate(() => [...document.querySelectorAll(".option-wheel__item")].find((x) => x.textContent === "Contact").click());
    await p.waitForURL(/\/contact\/$/, { timeout: 8000 }).catch(() => {});
    check(/\/contact\/$/.test(p.url()), "wheel", "from another page, Contact routes to /contact/", p.url());
    await ctx.close();
  }
  label = "";
  await closeAll();
});

/* ================================================================ reduced */
if (want("reduced")) await safely("reduced", async () => {
  section("prefers-reduced-motion");
  for (const vp of [{ w: 1440, h: 900, reduced: true }, { w: 390, h: 844, touch: true, reduced: true }]) {
    const { page: p } = await page(vp);
    await goto(p, "/");
    await p.waitForTimeout(2000);
    const r = await p.evaluate(() => ({
      motion: document.documentElement.dataset.motion,
      pin: getComputedStyle(document.querySelector(".story-pin")).position,
      titles: [...document.querySelectorAll(".beat-title, .bp-name")].map((h) => ({ o: getComputedStyle(h.closest("[data-copy]") ?? h).opacity, v: getComputedStyle(h.closest("[data-copy]") ?? h).visibility })),
      blurred: [...document.querySelectorAll(".sp")].filter((s) => getComputedStyle(s).display !== "none" && getComputedStyle(s).filter !== "none").length,
      shown: [...document.querySelectorAll(".sp")].filter((s) => getComputedStyle(s).display !== "none").length,
      words: [...document.querySelectorAll(".beat-title .w")].filter((w) => getComputedStyle(w).transform !== "none" || getComputedStyle(w).filter !== "none").length,
    }));
    check(r.motion === "reduced" && r.pin !== "sticky", "reduced", `${vp.w}px: no pinned scroll sequence`, `${r.motion}, ${r.pin}`);
    check(r.titles.length >= 12 && r.titles.every((t) => t.o === "1" && t.v === "visible"), "reduced", `${vp.w}px: all ${r.titles.length} story headings visible in normal flow`);
    check(r.blurred === 0 && r.words === 0 && r.shown === 6, "reduced", `${vp.w}px: the six platforms as a still composition, nothing blurred or moved`, JSON.stringify({ blurred: r.blurred, shown: r.shown, words: r.words }));
  }
  {
    const { page: p } = await page({ w: 1440, h: 900, reduced: true });
    await goto(p, "/");
    await p.waitForTimeout(1200);
    await p.click(".pill-nav button.pill");
    await p.waitForTimeout(250);
    const h = await p.evaluate(() => document.querySelector(".pill-panel:not([hidden])")?.getBoundingClientRect().height ?? 0);
    check(h > 80, "reduced", "the Platforms panel opens without the movement", `${Math.round(h)}px after 250 ms`);
    const a = await p.screenshot({ clip: { x: 0, y: 500, width: 1440, height: 400 } });
    await p.waitForTimeout(1200);
    const b = await p.screenshot({ clip: { x: 0, y: 500, width: 1440, height: 400 } });
    check(Buffer.compare(a, b) === 0, "reduced", "the background holds still");
  }
  await closeAll();
});

/* =================================================================== nojs */
if (want("nojs")) await safely("nojs", async () => {
  section("JavaScript disabled");
  const { page: p } = await page({ w: 1440, h: 900, noJs: true });
  await goto(p, "/");
  const r = await p.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent,
    visible: [...document.querySelectorAll(".beat-title")].filter((h) => getComputedStyle(h.closest(".beat")).visibility === "visible" && getComputedStyle(h.closest(".beat")).opacity === "1").length,
    total: document.querySelectorAll(".beat-title").length,
    plats: document.querySelectorAll("#platforms .plat .plat-shot").length,
    dashes: document.querySelectorAll("#platforms .plat .dash-frame[role=img][aria-label]").length,
    navLinks: document.querySelectorAll(".pill-nav a").length,
  }));
  check(r.h1 === "Complexity, Meet Clarity." && r.visible === r.total && r.total === 6, "nojs", "every story heading is in the HTML and visible", JSON.stringify(r));
  check(r.plats === 6 && r.dashes >= 4, "nojs", "the six platforms and their screens (dashboards included) are in the HTML", JSON.stringify(r));
  check(r.navLinks >= 5, "nojs", "the navigation's links are in the HTML", String(r.navLinks));
  await closeAll();
});

/* ================================================================ console */
if (want("console")) await safely("console", async () => {
  section("console: zero errors (including hydration) while using the page");
  for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844, touch: true }, { w: 1024, h: 768 }]) {
    const { page: p, errors } = await page(vp);
    const warns = [];
    p.on("console", (m) => m.type() === "warning" && /hydrat/i.test(m.text()) && warns.push(m.text()));
    p.on("response", (res) => res.status() >= 400 && errors.push(`HTTP ${res.status()} ${res.url()}`));
    for (const route of ["/", "/products/", "/products/nazo/", "/company/", "/services/", "/contact/"]) {
      await goto(p, route);
      await p.waitForTimeout(900);
      if (route === "/") {
        for (const k of ["reveal", "p2", "capability", "universe"]) await p.evaluate((prog) => { const s = document.querySelector(".story"); window.scrollTo(0, s.offsetTop + prog * (s.offsetHeight - innerHeight)); }, MIDS[k]);
        await p.waitForTimeout(800);
        await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await p.waitForTimeout(600);
      }
    }
    check(errors.length === 0 && warns.length === 0, "console", `${vp.w}×${vp.h}: 6 routes, story scrolled`, [...errors, ...warns].slice(0, 3).join(" | "));
  }
  await closeAll();
});

await browser.close();
await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, "verify-redesign-results.json"), JSON.stringify({ base: BASE, at: new Date().toISOString(), failed, results }, null, 2));
console.log(`\nverify-redesign: ${results.length - failed} passed, ${failed} failed (${BASE}).`);
process.exit(failed ? 1 : 0);
