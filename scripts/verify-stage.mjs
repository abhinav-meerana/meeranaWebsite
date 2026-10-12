/**
 * Product pages: FINAL-SPEC §12.2 (P-01 … P-22) and the product column of
 * the §12.1 matrix, measured in Playwright Chromium against the build on :4173
 * (or VERIFY_URL). Every check is filed under its id; see verify-lib.mjs.
 *
 *   node scripts/verify-stage.mjs [--quick] [--full] [--slug tasree3] [--vp 1366x657]
 *                                 [--only mode,rest,depth,wheel,keys,focus,chapters,reduced,
 *                                         rail,list,nojs,content,axe,perf,mutations,media,choreo]
 *                                 [--shots none|key|all]
 *
 * Coverage. The fit and rest checks (P-01…P-04, P-19) run for all 6 products at
 * every stage viewport of §12.1. The interaction and motion checks (P-05…P-11,
 * P-20, P-21) run at three of them (1024×520, 1366×657, 1920×937) unless
 * `--full` is given, which runs them at every stage viewport (about an hour).
 *
 * No test hooks: rest positions come from the DOM (`.ps` top + i × step, the
 * same numbers the engine derives), and settle is held off where a check needs
 * an in-between scroll position by a synthetic window `mousedown`, which is
 * the scrollbar-drag hold of lib/settle.ts.
 */
import AxeBuilder from "@axe-core/playwright";
import { spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import {
  ARGS, BANNED, IS_DEV, MATRIX, ROOT, SCENES_N, SLACK, SLUGS, BASE, T,
  check, contrast, fail, finish, goto, group, guard, inRun, info, launch, newPage,
  notRun, parseRgb, pass, pixels, shot, steady, until, vpKey, vpLabel, want,
} from "./verify-lib.mjs";

const FULL = process.argv.includes("--full");
const KEY_VPS = new Set(["1024x520", "1366x657", "1920x937"]);
const slugs = SLUGS.filter((s) => !ARGS.slug || ARGS.slug.has(s));
const STAGE = MATRIX.filter((m) => m.product === "stage").filter(inRun);
const DEEP = STAGE.filter((m) => FULL || KEY_VPS.has(vpKey(m)));
const RAIL = MATRIX.filter((m) => m.product === "rail" && !m.reduced).filter(inRun);
const LIST = MATRIX.filter((m) => m.product === "list").filter(inRun);
const STATIC = MATRIX.filter((m) => m.reduced).filter(inRun);
const ALLOWED_STYLE = new Set(["transform", "translate", "rotate", "scale", "opacity", "will-change"]);
const route = (slug) => `/products/${slug}/`;

const browser = await launch();
const contexts = [];
async function open(vp, slug, opts) {
  for (const c of contexts.splice(0)) await c.close().catch(() => {});
  const p = await newPage(browser, vp, opts);
  contexts.push(p.ctx);
  return p;
}

/* ------------------------------------------------------------- helpers */

/** Load a product page and wait (≤1.5 s after `load`) for its final mode. */
async function load(page, slug, expected, hash = "") {
  const status = await goto(page, route(slug) + hash);
  const t0 = Date.now();
  // 1.5 s is the build's budget (P-01). The dev server compiles the stage
  // chunk on first request, so there the wait is longer and the time is noted.
  const mode = await until(
    page,
    (exp) => {
      const m = document.querySelector(".ps")?.dataset.mode;
      return m && m !== "pending" && (!exp || m === exp) ? m : null;
    },
    expected,
    IS_DEV ? 15000 : 1500,
  );
  const ms = Date.now() - t0;
  if (mode && IS_DEV && ms > 1500) info(`${slug}: data-mode="${mode}" after ${ms} ms (dev server; the 1.5 s budget applies to the build)`);
  const final = mode || (await page.evaluate(() => document.querySelector(".ps")?.dataset.mode ?? "missing"));
  return { status, mode: final, ms, st: await page.evaluate(() => window.__v.stage()) };
}

const restY = (st, i) => Math.round(st.top + i * st.step);

/**
 * Scroll to scene i's rest position and wait the 700 ms P-03 allows. If the
 * scene has not arrived by then (a starved scrub on software GL), wait for it
 * to come within 2 px and for the track to stop, and return the overshoot,
 * which callers report next to the result. "Late" and "at rest in the wrong
 * place" stay separate: the P-03 check itself still demands ≤ 1 px.
 */
async function rest(page, st, i, wait = 700) {
  await page.evaluate((y) => window.scrollTo(0, y), restY(st, i));
  await page.waitForTimeout(wait);
  const t0 = Date.now();
  await until(page, (k) => {
    const s = document.querySelectorAll(".ps-scene")[k];
    return !!s && Math.abs(s.getBoundingClientRect().left) <= 2;
  }, i, T(2500), 60);
  const arrive = Date.now() - t0;
  const still = await steady(page, ".ps-track", T(1500));
  return arrive > 120 ? arrive + still : still;
}

/** Hold settle off (the scrollbar-drag hold) while a check sits between scenes. */
const hold = (page, on) =>
  page.evaluate((down) => window.dispatchEvent(new MouseEvent(down ? "mousedown" : "mouseup")), on);

/** The scene index the page rests on now (±2 px, still over 160 ms), or null. */
async function settledOn(page, st, ms = 900) {
  const t0 = Date.now();
  const ys = [];
  while (Date.now() - t0 < ms) {
    ys.push(await page.evaluate(() => scrollY));
    const y = ys[ys.length - 1];
    const i = Math.round((y - st.top) / st.step);
    const still = ys.length >= 4 && ys.slice(-4).every((v) => Math.abs(v - y) <= 0.5);
    if (still && i >= 0 && i < st.N && Math.abs(y - restY(st, i)) <= 2) return { i, ms: Date.now() - t0 };
    await page.waitForTimeout(40);
  }
  return { i: null, ms, y: await page.evaluate(() => scrollY) };
}

/**
 * Wait (≤ ms) for the page to arrive at scene `target`'s rest; a glide that
 * has not started yet can never read as arrival. Returns the time taken, or
 * where it was when time ran out.
 */
async function reach(page, st, target, ms = 900) {
  const t0 = Date.now();
  let hits = 0;
  while (Date.now() - t0 < ms) {
    const y = await page.evaluate(() => scrollY);
    hits = Math.abs(y - restY(st, target)) <= 2 ? hits + 1 : 0;
    if (hits >= 2) return { ok: true, ms: Date.now() - t0 };
    await page.waitForTimeout(40);
  }
  const s = await settledOn(page, st, 600);
  return { ok: false, ms, at: s.i, y: s.y };
}
const where = (r) => (r.ok ? `in ${r.ms} ms` : r.at === null || r.at === undefined ? `still moving (y ${Math.round(r.y)})` : `rests on scene ${r.at + 1}`);

const resolved = (page, prop, value, host) =>
  page.evaluate(([p, v, h]) => window.__v.probe(p, v, h ? document.querySelector(h) : null), [prop, value, host]);

/* Texts of PREVIEW-only items, read from the content source, to prove none ships. */
async function confirmTexts() {
  const src = await readFile(path.join(ROOT, "content", "storyboards.ts"), "utf8").catch(() => "");
  const out = [];
  for (const m of src.matchAll(/status:\s*"confirm"/g)) {
    let depth = 0;
    let i = m.index;
    for (; i > 0; i--) {
      if (src[i] === "}") depth++;
      if (src[i] === "{" && depth-- === 0) break;
    }
    const obj = src.slice(i, m.index);
    for (const t of obj.matchAll(/(?:heading|label|q|copy|text):\s*"([^"]{12,})"/g)) out.push(t[1]);
  }
  return [...new Set(out)];
}

/* ===================================================== stage: mode + fit */

if (want("mode") || want("rest")) {
  for (const vp of STAGE) {
    group(`stage ${vpLabel(vp)}: mode, geometry, rest and fit (P-01…P-04, P-16, P-19)`);
    for (const slug of slugs) {
      const { page, errors } = await open(vp, slug);
      const tag = `${vpLabel(vp)} ${slug}`;
      const L0 = await guard("P-01", tag, () => load(page, slug, "stage"));
      if (!L0) continue;
      check(L0.mode === "stage", "P-01", `${tag}: data-mode within 1.5 s of load`, L0.mode);
      if (!L0.st) {
        fail("P-02", `${tag}: no .ps element`, `HTTP ${L0.status}`);
        continue;
      }
      const { st } = L0;
      check(st.N === SCENES_N[slug], "P-16", `${tag}: ${st.N} scenes (§5.2 says ${SCENES_N[slug]})`);

      // Content box (§12.1 column) and P-02 geometry.
      await guard("P-01", `${tag}: content box`, async () => {
        const box = await resolved(page, "height", "var(--ps-content-h)", ".ps");
        check(Math.abs(box - vp.box) <= 1, "P-01", `${tag}: --ps-content-h ${box.toFixed(1)} (expect ${vp.box})`);
      });
      await guard("P-02", tag, async () => {
        const g = await page.evaluate(() => {
          const ps = document.querySelector(".ps");
          return {
            cw: document.documentElement.clientWidth,
            widths: [...ps.querySelectorAll(".ps-scene")].map((s) => s.getBoundingClientRect().width),
            h: ps.getBoundingClientRect().height,
            ih: innerHeight,
          };
        });
        const step = Math.min(720, Math.max(480, 0.7 * g.ih));
        const bad = g.widths.filter((w) => Math.abs(w - g.cw) > 1);
        check(bad.length === 0, "P-02", `${tag}: scene width = clientWidth ${g.cw}`, bad.length ? `widths ${[...new Set(bad.map(Math.round))].join(",")}` : "");
        const exp = g.ih + (st.N - 1) * step;
        check(Math.abs(g.h - exp) <= 2, "P-02", `${tag}: .ps height ${Math.round(g.h)} (expect ${Math.round(exp)})`);
      });

      if (!want("rest")) continue;
      if (L0.mode !== "stage") {
        for (const id of ["P-03", "P-04", "P-19"]) notRun(id, tag, `page is not in stage mode (${L0.mode})`);
        continue;
      }
      const hdr = await resolved(page, "height", "var(--header-h)");
      const fitFails = [];
      const restFails = [];
      const leakFails = [];
      let late = 0;
      for (let i = 0; i < st.N; i++) {
        late = Math.max(late, await rest(page, st, i));
        const r = await guard("P-03", `${tag} scene ${i + 1}`, () =>
          page.evaluate(
            ({ i, hdr }) => {
              const v = window.__v;
              const ps = document.querySelector(".ps");
              const scene = ps.querySelectorAll(".ps-scene")[i];
              const W = innerWidth;
              const H = innerHeight;
              const sr = scene.getBoundingClientRect();
              const dockEl = ps.querySelector(".ps-dock");
              const dockTop = dockEl && dockEl.getBoundingClientRect().height > 0
                ? dockEl.getBoundingClientRect().top
                : H - (parseFloat(getComputedStyle(ps).getPropertyValue("--ps-dock")) || 56);
              const hdrBottom = Math.max(hdr, document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0);
              // P-03
              const dim = v.textEls(scene, ".ps-shutter")
                .filter((el) => !v.srOnly(el) && v.opacity(el, scene) < 0.999)
                .map((el) => `${v.name(el)}@${v.opacity(el, scene).toFixed(2)}`);
              const moved = [...scene.querySelectorAll(".ps-fg, h1, h2")]
                .filter((el) => !v.identity(el))
                .map((el) => `${v.name(el)} ${v.matrix(el).raw}`);
              const sh = scene.querySelector(".ps-shutter");
              let shutter = false;
              if (sh) {
                const b = sh.getBoundingClientRect();
                shutter = b.width > 0 && b.right > Math.max(0, sr.left) + 1 && b.left < Math.min(W, sr.right) - 1;
              }
              // P-04
              const out = [];
              for (const el of scene.querySelectorAll(".ps-fg *, .ps-mid *")) {
                if (el.closest(".ps-shadow") || v.srOnly(el)) continue;
                const cs = getComputedStyle(el);
                if (cs.display === "none" || cs.visibility === "hidden") continue;
                const b = el.getBoundingClientRect();
                if (b.width < 1 || b.height < 1) continue;
                if (b.left < -1 || b.right > W + 1 || b.top < hdr - 1 || b.bottom > dockTop + 1)
                  out.push(`${v.name(el)} [${Math.round(b.left)},${Math.round(b.top)} → ${Math.round(b.right)},${Math.round(b.bottom)}]`);
              }
              const scroll = [...scene.querySelectorAll(".ps-copy, .ps-mid, .viz")]
                .filter((el) => el.scrollHeight > el.clientHeight + 1)
                .map((el) => `${v.name(el)} ${el.scrollHeight}>${el.clientHeight}`);
              const h1 = scene.querySelector("h1");
              const h2 = scene.querySelector("h2");
              // P-19
              const ys = [0, 1, 2, 3, 4].map((k) => hdrBottom + ((dockTop - hdrBottom) * (k + 0.5)) / 5);
              const leak = new Set();
              for (const x of [2, W - 2])
                for (const y of ys)
                  for (const el of document.elementsFromPoint(x, y)) {
                    if (scene.contains(el) || el.contains(scene) || el.closest(".ps-far, .ps-dock, nextjs-portal")) continue;
                    leak.add(`${v.name(el)}@${x},${Math.round(y)}`);
                  }
              // P-16: features visible; images never wider than intrinsic.
              const feats = scene.dataset.kind === "features"
                ? [...scene.querySelectorAll(".viz-grid-list li, .ps-features li, .viz-column li")].filter((li) => {
                    const b = li.getBoundingClientRect();
                    return b.width > 0 && b.height > 0 && v.opacity(li, scene) > 0.99;
                  }).length
                : null;
              const wide = [...scene.querySelectorAll("img")]
                .filter((im) => im.complete && im.naturalWidth && im.getBoundingClientRect().width > im.naturalWidth + 1)
                .map((im) => `${im.getAttribute("src")} ${Math.round(im.getBoundingClientRect().width)}>${im.naturalWidth}`);
              return {
                left: sr.left, dim, moved, shutter, out, scroll, leak: [...leak],
                h1: h1 ? v.lines(h1) : null, h2: h2 ? v.lines(h2) : null, kind: scene.dataset.kind, feats, wide,
              };
            },
            { i, hdr },
          ),
        );
        if (!r) continue;
        const n = String(i + 1).padStart(2, "0");
        const bad3 = [];
        if (Math.abs(r.left) > 1) bad3.push(`left ${r.left.toFixed(1)}`);
        if (r.dim.length) bad3.push(`opacity: ${r.dim.slice(0, 2).join(", ")}`);
        if (r.moved.length) bad3.push(`transform: ${r.moved.slice(0, 1).join(", ")}`);
        if (r.shutter) bad3.push("shutter inside the scene");
        if (bad3.length) restFails.push(`${n} ${r.kind}: ${bad3.join("; ")}`);
        const bad4 = [];
        if (r.out.length) bad4.push(`${r.out.length} outside the frame, e.g. ${r.out[0]}`);
        if (r.scroll.length) bad4.push(`overflow ${r.scroll[0]}`);
        if (r.h2 !== null && r.h2 > 3) bad4.push(`H2 ${r.h2} lines`);
        const h1Max = vp.w >= 1280 ? 3 : 4;
        if (r.h1 !== null && r.h1 > h1Max) bad4.push(`H1 ${r.h1} lines (max ${h1Max})`);
        if (bad4.length) fitFails.push(`${n} ${r.kind}: ${bad4.join("; ")}`);
        if (r.leak.length) leakFails.push(`${n}: ${r.leak.slice(0, 2).join(", ")}`);
        if (r.feats !== null) check(r.feats > 0, "P-16", `${tag} scene ${n}: features visible`, `${r.feats} items`);
        if (r.wide.length) fail("P-16", `${tag} scene ${n}: image wider than intrinsic`, r.wide[0]);
        await shot(page, vp, `${slug}-${n}`, i === 0 || i === 5 ? "key" : "all");
      }
      check(restFails.length === 0, "P-03", `${tag}: every scene final at rest (${st.N})`, restFails.slice(0, 3).join(" | "));
      if (late > 0) info(`${tag}: the track was still moving after 700 ms (up to +${late} ms) at some scenes`);
      check(fitFails.length === 0, "P-04", `${tag}: every scene fits the frame (${st.N})`, fitFails.slice(0, 3).join(" | "));
      check(leakFails.length === 0, "P-19", `${tag}: no neighbour at the edges (${st.N})`, leakFails.slice(0, 3).join(" | "));
      check(errors.length === 0, "P-01", `${tag}: no console errors`, errors.slice(0, 2).join(" | "));
    }
  }
}

/* ============================================ stage: depth, wheel, keys */

for (const vp of DEEP) {
  const groups = ["depth", "wheel", "keys", "focus", "chapters", "mutations", "media"].filter(want);
  if (!groups.length) break;
  group(`stage ${vpLabel(vp)}: ${groups.join(", ")} (P-05…P-11, P-20, P-21)`);
  for (const slug of slugs) {
    const tag = `${vpLabel(vp)} ${slug}`;
    let { page } = await open(vp, slug);
    let L0 = await guard("P-05", tag, () => load(page, slug, "stage"));
    if (!L0 || L0.mode !== "stage" || !L0.st) {
      for (const id of ["P-05", "P-06", "P-07", "P-08", "P-09", "P-10", "P-11", "P-20", "P-21"])
        notRun(id, tag, `page is not in stage mode (${L0?.mode ?? "load failed"})`);
      continue;
    }
    let { st } = L0;

    if (want("depth")) {
      await guard("P-05", tag, async () => {
        const at = () =>
          page.evaluate(() => {
            const s = document.querySelectorAll(".ps-scene")[3];
            const x = (sel) => s.querySelector(sel)?.getBoundingClientRect().left ?? null;
            return { bg: x(".ps-bg"), mid: x(".ps-mid"), fg: x(".ps-fg") };
          });
        await rest(page, st, 3, 900);
        const r0 = await at();
        await hold(page, true);
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(st.top + 2.5 * st.step));
        await page.waitForTimeout(1000);
        const r1 = await at();
        await hold(page, false);
        if (r0.mid === null || r0.bg === null) return notRun("P-05", tag, "scene 04 has no .ps-bg or .ps-mid");
        const d = { bg: r1.bg - r0.bg, mid: r1.mid - r0.mid, fg: r1.fg - r0.fg };
        const rb = d.bg / d.fg;
        const rm = d.mid / d.fg;
        check(
          Math.abs(rb - 0.7) <= 0.05 && Math.abs(rm - 0.88) <= 0.05 && Math.abs(d.fg) > 50,
          "P-05",
          `${tag}: scene 04 at p 0.25, bg:mid:fg = ${rb.toFixed(2)} : ${rm.toFixed(2)} : 1.00`,
          `fg moved ${Math.round(d.fg)} px`,
        );
        // Floor: (−448, 0], monotonic between wraps, sampled across the whole
        // film in steps small enough (≤ ~90 px of floor travel) that a wrap
        // (+448 less one step) can never be mistaken for moving backwards.
        await hold(page, true);
        const xs = [];
        const samples = Math.max(48, Math.ceil((st.N - 1) * vp.w * 0.25 / 90));
        for (let k = 0; k <= samples; k++) {
          await page.evaluate((y) => window.scrollTo(0, y), Math.round(st.top + (k / samples) * st.travel));
          // Read only once the scrub has landed: a starved frame repeats the old
          // value and the next read then jumps by more than half a period,
          // which would read as moving backwards. (The first sample also comes
          // after a jump back from scene 04.)
          await steady(page, ".ps-track", k === 0 ? 3000 : T(600));
          await page.waitForTimeout(40);
          xs.push(await page.evaluate(() => {
            const f = document.querySelector(".ps-floor-grid");
            if (!f) return null;
            const { is3d, v } = window.__v.matrix(f);
            return is3d ? v[12] : v[4];
          }));
        }
        await hold(page, false);
        if (xs[0] === null) return fail("P-05", `${tag}: floor`, "no .ps-floor-grid");
        const outOfRange = xs.findIndex((x) => !(x > -448 && x <= 0.5));
        const backwards = xs.slice(1).findIndex((x, k) => !(x - xs[k] <= 0.5 || x - xs[k] >= 224)) + 1;
        const around = (k) => xs.slice(Math.max(0, k - 2), k + 3).map((x) => x.toFixed(1)).join(",");
        check(
          outOfRange < 0 && backwards <= 0,
          "P-05",
          `${tag}: floor x in (−448, 0], monotonic between wraps (${xs.length} samples)`,
          outOfRange >= 0
            ? `sample ${outOfRange} out of range: …${around(outOfRange)}…`
            : backwards > 0
              ? `sample ${backwards} moves backwards: …${around(backwards)}…`
              : `${xs.slice(0, 6).map((x) => x.toFixed(0)).join(",")}…`,
        );
      });
      await guard("P-06", tag, async () => {
        await rest(page, st, 3, 600);
        await hold(page, true);
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(st.top + 3.6 * st.step));
        await page.waitForTimeout(1000);
        const m = await page.evaluate(() => {
          const el = document.querySelectorAll(".ps-scene")[4]?.querySelector(".ps-stage3d");
          return el ? window.__v.matrix(el) : null;
        });
        await hold(page, false);
        if (!m) return notRun("P-06", tag, "scene 05 has no .ps-stage3d");
        check(m.is3d && Math.abs(m.v[11]) > 1e-6, "P-06", `${tag}: scene 05 entrance is matrix3d with perspective`, m.raw.slice(0, 80));
      });
    }

    if (want("wheel")) {
      await guard("P-07", tag, async () => {
        const k = 2;
        await page.mouse.move(vp.w / 2, vp.h / 2);
        const from = async (n) => { await rest(page, st, n, 900); };
        await from(k);
        await page.mouse.wheel(0, 100);
        const a = await reach(page, st, k + 1, T(900));
        check(a.ok, "P-07", `${tag}: wheel 100 settles on k+1 within 900 ms`, where(a));
        await from(k);
        await page.mouse.wheel(0, 45);
        const b = await reach(page, st, k + 1, T(1400));
        check(b.ok, "P-07", `${tag}: wheel 45 advances`, where(b));
        await from(k);
        await page.mouse.wheel(0, 25);
        await page.waitForTimeout(T(700));
        const c = await settledOn(page, st, T(1400));
        check(c.i === k, "P-07", `${tag}: wheel 25 returns`, c.i === null ? `still moving (y ${Math.round(c.y)})` : `rests on scene ${c.i + 1}`);
        await from(k);
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(300);
        await page.mouse.wheel(0, 100);
        const d = await reach(page, st, k + 2, T(1800));
        check(d.ok, "P-07", `${tag}: two notches 300 ms apart reach k+2`, where(d));
        await from(k);
        for (let n = 0; n < 6; n++) {
          await page.mouse.wheel(0, 100);
          await page.waitForTimeout(40);
        }
        await page.waitForTimeout(T(1200));
        const e = await settledOn(page, st, T(2000));
        check(e.i !== null, "P-07", `${tag}: six fast notches end at a rest`, e.i === null ? `y ${Math.round(e.y)}` : `scene ${e.i + 1}`);
      });
    }

    if (want("keys")) {
      await guard("P-08", tag, async () => {
        const press = async (key, start, expect) => {
          await rest(page, st, start, 800);
          await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
          await page.keyboard.press(key);
          return reach(page, st, expect, T(900));
        };
        const res = [];
        for (const key of ["ArrowRight", "ArrowDown", "PageDown", "Space"]) res.push([key, await press(key, 2, 3)]);
        for (const key of ["ArrowLeft", "ArrowUp", "PageUp", "Shift+Space"]) res.push([key, await press(key, 3, 2)]);
        const bad = res.filter(([, r]) => !r.ok).map(([k, r]) => `${k}: ${where(r)}`);
        check(bad.length === 0, "P-08", `${tag}: 8 keys move one scene each`, bad.join(", "));
        // ↓ on the last scene leaves the film.
        await rest(page, st, st.N - 1, 800);
        await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
        await page.keyboard.press("ArrowDown");
        await page.waitForTimeout(T(1200));
        const y = await page.evaluate(() => scrollY);
        check(y > restY(st, st.N - 1) + 2, "P-08", `${tag}: ↓ on the last scene scrolls into the footer`, `y ${Math.round(y)} vs end ${restY(st, st.N - 1)}`);
        // Arrows inside the open header panel do not move scenes.
        await rest(page, st, 2, 800);
        const trig = page.locator(".hdr-trigger").first();
        if (await trig.count()) {
          await trig.focus();
          await page.keyboard.press("Enter");
          await page.waitForTimeout(250);
          const y0 = await page.evaluate(() => scrollY);
          await page.keyboard.press("ArrowDown");
          await page.keyboard.press("ArrowDown");
          await page.waitForTimeout(900);
          const y1 = await page.evaluate(() => scrollY);
          await page.keyboard.press("Escape");
          check(Math.abs(y1 - y0) <= 2, "P-08", `${tag}: arrows in the open header panel do not move scenes`, `Δy ${Math.round(y1 - y0)}`);
        } else notRun("P-08", `${tag}: header panel`, "no .hdr-trigger");
        // Space on a focused button activates it (one scene, not two).
        await rest(page, st, 2, 800);
        const next = page.locator('.ps-btn[aria-label="Next scene"]');
        if (await next.count()) {
          await next.focus();
          await page.keyboard.press("Space");
          await page.waitForTimeout(T(900));
          const s = await settledOn(page, st, T(1500));
          check(s.i === 3, "P-08", `${tag}: Space on the Next button moves exactly one scene`, s.i === null ? `still moving (y ${Math.round(s.y)})` : `rests on scene ${s.i + 1}`);
        } else fail("P-08", `${tag}: Space on a button`, 'no .ps-btn[aria-label="Next scene"]');
      });
    }

    if (want("focus")) {
      await guard("P-09", tag, async () => {
        await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement instanceof HTMLElement && document.activeElement.blur(); });
        await page.waitForTimeout(500);
        const hdr = await resolved(page, "height", "var(--header-h)");
        const bad = [];
        let followed = 0;
        for (let t = 1; t <= 80; t++) {
          await page.keyboard.press("Tab");
          const r = await until(
            page,
            (hdr) => {
              const a = document.activeElement;
              if (!a || a === document.body || a.closest("nextjs-portal") || a.tagName === "NEXTJS-PORTAL") return { ok: true, none: true };
              const b = a.getBoundingClientRect();
              const W = innerWidth;
              const H = innerHeight;
              // Skip links sit over the header by design once focused.
              const inHeader = !!a.closest(".site-header") || /skip/.test(a.className);
              const inDock = !!a.closest(".ps-dock");
              const scene = a.closest(".ps-scene");
              const dock = document.querySelector(".ps-dock")?.getBoundingClientRect();
              const hb = Math.max(hdr, document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0);
              let ok = b.width > 0 && b.height > 0 && b.left >= -1 && b.right <= W + 1 && b.top >= -1 && b.bottom <= H + 1;
              if (!inHeader) ok = ok && b.top >= hb - 1;
              if (scene && dock && !inDock) ok = ok && b.bottom <= dock.top + 1;
              const outline = getComputedStyle(a).outlineStyle !== "none";
              const follows = scene ? Math.abs(scene.getBoundingClientRect().left) <= 1 : null;
              const good = ok && outline && follows !== false;
              return good ? { ok: true, follows } : null;
            },
            hdr,
            T(900),
            60,
          );
          if (!r) {
            const d = await page.evaluate(() => {
              const a = document.activeElement;
              const b = a.getBoundingClientRect();
              return `${window.__v.name(a)} [${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.bottom)}] outline=${getComputedStyle(a).outlineStyle}`;
            });
            bad.push(`#${t} ${d}`);
          } else if (r.follows) followed++;
        }
        check(bad.length === 0, "P-09", `${tag}: 80 Tab stops visible, outside header and dock, outlined`, bad.slice(0, 3).join(" | "));
        check(followed > 0, "P-09", `${tag}: the film follows focus into scenes`, `${followed} stops inside a settled scene`);
      });
    }

    if (want("chapters")) {
      await guard("P-10", tag, async () => {
        await rest(page, st, 0, 800);
        const links = page.locator(".ps-chapters a");
        if ((await links.count()) < st.N) return fail("P-10", tag, `${await links.count()} chapter links for ${st.N} scenes`);
        await links.nth(2).click();
        const s = await reach(page, st, 2, T(1000));
        const m = await page.evaluate((id) => ({
          current: document.querySelectorAll(".ps-chapters a")[2]?.getAttribute("aria-current"),
          focus: document.activeElement?.id,
          hash: location.hash,
          id,
        }), st.ids[2]);
        check(s.ok && m.current === "location" && m.focus === `${m.id}-h`, "P-10", `${tag}: chapter 03 lands within 1 s, aria-current, focus on #${m.id}-h`,
          `${where(s)}, aria-current=${m.current}, focus=${m.focus}, hash=${m.hash}`);
      });
      await guard("P-11", tag, async () => {
        await rest(page, st, 0, 800);
        await page.evaluate((budget) => {
          window.__cut = [];
          const track = document.querySelector(".ps-track");
          const scenes = [...document.querySelectorAll(".ps-scene")];
          const t0 = performance.now();
          window.__cutT0 = t0;
          const tick = () => {
            const op = parseFloat(getComputedStyle(track).opacity);
            const vis = scenes.filter((s) => { const b = s.getBoundingClientRect(); return b.right > 1 && b.left < innerWidth - 1; }).length;
            window.__cut.push({ t: performance.now() - t0, op, vis });
            if (performance.now() - t0 < budget) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          document.querySelectorAll(".ps-chapters a")[6]?.click();
        }, T(1400));
        await page.waitForTimeout(T(1400) + 200);
        const f = await page.evaluate(() => window.__cut);
        const dip = f.find((x) => x.op < 0.2);
        const end = f[f.length - 1];
        const crowd = Math.max(...f.filter((x) => x.op > 0.02).map((x) => x.vis));
        check(dip && dip.t <= T(150) && end.op >= 0.999 && crowd <= 2, "P-11", `${tag}: jump 01→07 cuts (dip <0.2 by ${T(150)} ms, back to 1, ≤2 scenes in any frame)`,
          `dip ${dip ? Math.round(dip.t) + " ms" : "none"}, end ${end?.op}, max scenes ${crowd}`);
        const s = await settledOn(page, st, T(800));
        check(s.i === 6, "P-10", `${tag}: the long jump lands on scene 07`, s.i === null ? `still moving (y ${Math.round(s.y)})` : `rests on scene ${s.i + 1}`);
      });
      await guard("P-10", `${tag}: hash`, async () => {
        const id = slug === "tasree3" ? "deploy" : st.ids[st.N - 2];
        const idx = st.ids.indexOf(id);
        if (idx < 0) return fail("P-10", `${tag}: hash`, `no scene #${id}`);
        await page.addInitScript(() => {
          window.__ys = [];
          const tick = () => { window.__ys.push(scrollY); requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
        });
        // A hash change on the same URL would not load a new document.
        await page.goto("about:blank");
        const L1 = await load(page, slug, "stage", `#${id}`);
        await page.waitForTimeout(1200);
        st = L1.st;
        // A dev-server full reload (Fast Refresh) can leave a fresh document
        // that has not sampled yet; treat that as "no frames seen".
        const ys = (await page.evaluate(() => window.__ys)) ?? [];
        const target = restY(st, idx);
        const first = ys.findIndex((y) => y > 0);
        const between = first < 0 ? 0 : ys.slice(first).filter((y) => Math.abs(y - target) > 2).length;
        const s = await settledOn(page, st, 600);
        check(s.i === idx && between <= 2, "P-10", `${tag}: /#${id} loads settled with no glide`, `scene ${s.i === null ? "none" : s.i + 1} (expect ${idx + 1}), ${between} in-between frames`);
        await goto(page, "/products/");
        await page.goBack({ waitUntil: "load" });
        await until(page, () => document.querySelector(".ps")?.dataset.mode === "stage", null, T(2500));
        await page.waitForTimeout(T(1200));
        st = await page.evaluate(() => window.__v.stage());
        const b = await settledOn(page, st, T(800));
        check(b.i === idx, "P-10", `${tag}: back restores scene ${idx + 1}`, `scene ${b.i === null ? "none" : b.i + 1}`);
      });
    }

    if (want("mutations")) {
      await guard("P-20", tag, async () => {
        ({ page } = await open(vp, slug));
        L0 = await load(page, slug, "stage");
        st = L0.st;
        await page.waitForTimeout(800);
        // transform-origin is tolerated when it is set once and never changes:
        // GSAP writes it from the spec's own presets (standUp, drawX, drawY)
        // the first time a tween renders. Changing it would be a violation.
        await page.evaluate(() => {
          window.__mut = new Set();
          window.__origin = new Map();
          const parse = (s) => {
            const m = new Map();
            for (const d of (s || "").split(/;(?![^(]*\))/)) {
              const k = d.indexOf(":");
              if (k > 0) m.set(d.slice(0, k).trim(), d.slice(k + 1).trim());
            }
            return m;
          };
          new MutationObserver((recs) => {
            for (const r of recs) {
              const a = parse(r.oldValue);
              const b = parse(r.target.getAttribute("style"));
              for (const k of new Set([...a.keys(), ...b.keys()])) {
                if (a.get(k) === b.get(k)) continue;
                if (k === "transform-origin" && b.get(k)) {
                  const was = window.__origin.get(r.target);
                  if (was === undefined || was === b.get(k)) {
                    window.__origin.set(r.target, b.get(k));
                    continue;
                  }
                }
                window.__mut.add(k);
              }
            }
          }).observe(document.querySelector(".ps"), { subtree: true, attributes: true, attributeFilter: ["style"], attributeOldValue: true });
        });
        await hold(page, true);
        for (let k = 0; k <= (st.N - 1) * 4; k++) {
          await page.evaluate((y) => window.scrollTo(0, y), Math.round(st.top + (k / 4) * st.step));
          await page.waitForTimeout(90);
        }
        await hold(page, false);
        await page.waitForTimeout(800);
        const props = await page.evaluate(() => [...window.__mut]);
        const bad = props.filter((p) => !ALLOWED_STYLE.has(p));
        check(props.length > 0 && bad.length === 0, "P-20", `${tag}: style writes during a full traverse`, `${props.join(", ") || "none seen"}${bad.length ? ` — not allowed: ${bad.join(", ")}` : ""}`);
      });
    }

    if (want("media")) {
      await guard("P-21", tag, async () => {
        ({ page } = await open(vp, slug));
        L0 = await load(page, slug, "stage");
        st = L0.st;
        await page.waitForTimeout(1500);
        const early = await page.evaluate(() => {
          const got = new Set(performance.getEntriesByType("resource").map((e) => e.name));
          return [...document.querySelectorAll(".ps-scene")].flatMap((s, i) =>
            [...s.querySelectorAll("img")].filter((im) => got.has(im.currentSrc || im.src)).map((im) => ({ i, src: im.getAttribute("src") })));
        });
        const late = early.filter((x) => x.i >= 3);
        check(late.length === 0, "P-21", `${tag}: at load only scenes 1–3 request images`, late.slice(0, 2).map((x) => `scene ${x.i + 1} ${x.src}`).join(", "));
        const k = Math.min(5, st.N - 1);
        await rest(page, st, k, 2500);
        const pending = await page.evaluate((k) =>
          [...document.querySelectorAll(".ps-scene")].slice(0, k + 3).flatMap((s, i) =>
            [...s.querySelectorAll("img")].filter((im) => !(im.complete && im.naturalWidth > 0)).map((im) => `scene ${i + 1} ${im.getAttribute("src")}`)), k);
        check(pending.length === 0, "P-21", `${tag}: settled on ${k + 1}, images in scenes ≤ ${k + 3} complete`, pending.slice(0, 2).join(", "));
      });
    }
  }
}

/* ===================================================== list persistence */

if (want("list")) {
  const vp = MATRIX.find((m) => m.w === 1366 && m.h === 657 && !m.reduced);
  group(`list view toggle persists across a reload (P-01), ${vpLabel(vp)}`);
  for (const slug of slugs.slice(0, ARGS.slug ? slugs.length : 2)) {
    const tag = `${vpLabel(vp)} ${slug}`;
    await guard("P-01", `${tag}: list toggle`, async () => {
      const { page } = await open(vp, slug);
      await load(page, slug, "stage");
      const btn = page.locator(".ps-view");
      if (!(await btn.count())) return fail("P-01", `${tag}: list toggle`, "no .ps-view button");
      await btn.click();
      const m1 = await until(page, () => document.querySelector(".ps")?.dataset.mode === "list" ? "list" : null, null, IS_DEV ? 15000 : 1500);
      await page.reload({ waitUntil: "load" });
      const m2 = await until(page, () => document.querySelector(".ps")?.dataset.mode === "list" ? "list" : null, null, IS_DEV ? 15000 : 1500);
      const pre = await page.evaluate(() => document.documentElement.dataset.view);
      check(m1 === "list" && m2 === "list", "P-01", `${tag}: List view sticks after reload`, `after click ${m1 ?? "no"}, after reload ${m2 ?? "no"}, html[data-view]=${pre}`);
      await page.locator(".ps-view").click().catch(() => {});
      await page.evaluate(() => { try { localStorage.removeItem("meerana:view"); } catch {} });
    });
  }
}

/* ====================================================== rail and list */

if (want("rail")) {
  for (const vp of RAIL) {
    group(`rail ${vpLabel(vp)} (P-01, P-13)`);
    for (const slug of slugs) {
      const tag = `${vpLabel(vp)} ${slug}`;
      await guard("P-13", tag, async () => {
        const { page, errors } = await open(vp, slug);
        const L0 = await load(page, slug, "rail");
        check(L0.mode === "rail", "P-01", `${tag}: data-mode`, L0.mode);
        if (!L0.st) return fail("P-13", tag, "no .ps element");
        if (vp.box) {
          const box = await resolved(page, "height", "var(--ps-content-h)", ".ps");
          check(Math.abs(box - vp.box) <= 1, "P-01", `${tag}: --ps-content-h ${box.toFixed(1)} (expect ${vp.box})`);
        }
        const r = await page.evaluate(() => {
          const ps = document.querySelector(".ps");
          const track = ps.querySelector(".ps-track");
          const scenes = [...ps.querySelectorAll(".ps-scene")];
          const scrollers = [...ps.querySelectorAll("*")].filter((el) => {
            if (el === track) return false;
            const o = getComputedStyle(el).overflowY;
            return (o === "auto" || o === "scroll") && el.scrollHeight > el.clientHeight + 1;
          }).map((el) => window.__v.name(el));
          const btns = [...ps.querySelectorAll(".ps-btn")].filter((b) => b.getBoundingClientRect().width > 0).map((b) => { const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
          return {
            sw: track.scrollWidth, cw: track.clientWidth, N: scenes.length,
            snap: getComputedStyle(track).scrollSnapType,
            tall: scenes.map((s, i) => [i + 1, s.scrollHeight]).filter(([, h]) => h > innerHeight + 1),
            scrollers, btns, docOver: document.documentElement.scrollWidth - innerWidth,
          };
        });
        check(Math.abs(r.sw - r.N * r.cw) <= 2, "P-13", `${tag}: track scrollWidth = N × clientWidth`, `${r.sw} vs ${r.N}×${r.cw}`);
        check(/x/.test(r.snap) && /mandatory/.test(r.snap), "P-13", `${tag}: scroll-snap-type x mandatory`, r.snap);
        check(r.btns.length > 0 && r.btns.every(([w, h]) => w >= 44 && h >= 44), "P-13", `${tag}: buttons ≥44 px`, JSON.stringify(r.btns));
        check(r.scrollers.length === 0, "P-13", `${tag}: no inner vertical scroller`, r.scrollers.slice(0, 3).join(", "));
        check(r.docOver <= 0, "P-13", `${tag}: no horizontal page overflow`, `+${r.docOver}px`);
        if (vp.w >= 360 && vp.h >= 640)
          check(r.tall.length === 0, "P-13", `${tag}: every scene fits 100svh`, r.tall.slice(0, 3).map(([i, h]) => `${i}:${h}`).join(", "));
        await page.evaluate(() => { const t = document.querySelector(".ps-track"); t.scrollTo({ left: 2 * t.clientWidth, behavior: "instant" }); });
        await page.waitForTimeout(900);
        const counter = await page.evaluate(() => document.querySelector(".ps-counter")?.textContent ?? "");
        check(/\b03\b/.test(counter), "P-13", `${tag}: snapping to scene 03 updates the counter`, counter.trim().slice(0, 40));
        await shot(page, vp, `${slug}-rail-03`);
        check(errors.length === 0, "P-01", `${tag}: no console errors`, errors.slice(0, 2).join(" | "));
      });
    }
  }
}

if (want("list")) {
  for (const vp of LIST) {
    group(`list ${vpLabel(vp)} (P-01, P-14)`);
    for (const slug of slugs) {
      const tag = `${vpLabel(vp)} ${slug}`;
      await guard("P-14", tag, async () => {
        const { page } = await open(vp, slug);
        const L0 = await load(page, slug, "list");
        check(L0.mode === "list", "P-01", `${tag}: data-mode`, L0.mode);
        if (!L0.st) return fail("P-14", tag, "no .ps element");
        const r = await page.evaluate(() => {
          const track = document.querySelector(".ps-track");
          const rs = [...document.querySelectorAll(".ps-scene")].map((s) => s.getBoundingClientRect());
          return {
            stacked: rs.slice(1).every((b, i) => b.top >= rs[i].bottom - 1 && Math.abs(b.left - rs[0].left) <= 1),
            sw: track.scrollWidth, cw: track.clientWidth, over: document.documentElement.scrollWidth - innerWidth,
          };
        });
        check(r.stacked && r.sw <= r.cw + 1 && r.over <= 0, "P-14", `${tag}: stacked, no horizontal overflow`, `stacked=${r.stacked} track ${r.sw}/${r.cw} page +${r.over}`);
        await shot(page, vp, `${slug}-list`);
      });
    }
  }
}

/* ===================================================== reduced motion */

if (want("reduced")) {
  for (const vp of STATIC) {
    group(`static rail ${vpLabel(vp)} (P-12)`);
    for (const slug of slugs) {
      const tag = `${vpLabel(vp)} ${slug}`;
      await guard("P-12", tag, async () => {
        const { page } = await open(vp, slug);
        const gsapChunks = [];
        page.on("response", async (res) => {
          if (!/\.js(\?|$)/.test(res.url())) return;
          const body = await res.text().catch(() => "");
          if (/GreenSock|gsap\.com|_gsap\b/.test(body)) gsapChunks.push(res.url().split("/").pop());
        });
        const L0 = await load(page, slug, "rail");
        await page.waitForTimeout(1500);
        const r = await page.evaluate(() => {
          const ps = document.querySelector(".ps");
          const v = window.__v;
          return {
            mode: ps?.dataset.mode, isStatic: ps?.hasAttribute("data-static"),
            inline: ps ? [...ps.querySelectorAll("[style]")].filter((e) => e.style.transform || e.style.translate || e.style.rotate || e.style.scale).map(v.name) : [],
            snap: ps ? getComputedStyle(ps.querySelector(".ps-track")).scrollSnapType : "",
            anims: document.getAnimations().length,
            // Scene text only: dock chapter labels are clipped until hover by design.
            dim: ps ? v.textEls(ps.querySelector(".ps-track"), ".ps-shutter").filter((el) => !v.srOnly(el) && v.opacity(el) < 0.999).map((el) => `${v.name(el)}@${v.opacity(el).toFixed(2)} "${el.textContent.trim().slice(0, 24)}"`) : [],
          };
        });
        check(gsapChunks.length === 0, "P-12", `${tag}: no GSAP chunk requested`, gsapChunks.join(", "));
        check(r.mode === "rail" && r.isStatic, "P-12", `${tag}: rail with data-static`, `${r.mode} static=${r.isStatic}`);
        if (vp.box) {
          // §12.1: the static rail keeps the stage's content box.
          const box = await resolved(page, "height", "var(--ps-content-h)", ".ps");
          check(Math.abs(box - vp.box) <= 1, "P-01", `${tag}: --ps-content-h ${box.toFixed(1)} (expect ${vp.box})`);
        }
        check(r.inline.length === 0, "P-12", `${tag}: no inline transforms in .ps`, r.inline.slice(0, 3).join(", "));
        check(/x/.test(r.snap) && /mandatory/.test(r.snap), "P-12", `${tag}: scroll-snap-type x mandatory`, r.snap);
        check(r.anims === 0, "P-12", `${tag}: document.getAnimations() is empty`, String(r.anims));
        check(r.dim.length === 0, "P-12", `${tag}: every text node opacity 1`, r.dim.slice(0, 3).join(", "));
        const next = page.locator('.ps-btn[aria-label="Next scene"]');
        if (await next.count()) {
          await next.click();
          await page.waitForTimeout(60);
          const j = await page.evaluate(() => { const t = document.querySelector(".ps-track"); return { l: t.scrollLeft, w: t.clientWidth }; });
          check(Math.abs(j.l - j.w) <= 2, "P-12", `${tag}: Next jumps instantly`, `scrollLeft ${Math.round(j.l)} after 60 ms (expect ${j.w})`);
        } else fail("P-12", `${tag}: Next button`, "missing");
        await shot(page, vp, `${slug}-static`);
        if (!L0.st) fail("P-12", tag, "no .ps element");
      });
    }
  }
}

/* ========================================================== no JS */

if (want("nojs")) {
  const vp = { w: 1366, h: 657, noJs: true };
  group(`no JavaScript ${vpLabel(vp)} (P-15)`);
  for (const slug of slugs) {
    const tag = `${vpLabel(vp)} ${slug}`;
    await guard("P-15", tag, async () => {
      const { page } = await open(vp, slug);
      await goto(page, route(slug));
      const h1 = page.locator("h1").first();
      const box = await h1.boundingBox();
      const n = await page.locator(".ps-scene").count();
      const vis = box && box.y >= 0 && box.y + box.height <= vp.h && box.x >= 0 && box.x + box.width <= vp.w;
      check(Boolean(vis), "P-15", `${tag}: title H1 in the first frame`, box ? `[${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}×${Math.round(box.height)}]` : "no h1");
      check(n === SCENES_N[slug], "P-15", `${tag}: all ${SCENES_N[slug]} scenes in the DOM`, `${n}`);
      if (n === 0) return fail("P-15", `${tag}: the rail scrolls`, "no .ps-scene in the server HTML");
      // The rail scrolls: the track is wider than its box and is a horizontal scroller.
      const track = page.locator(".ps-track").first();
      const tb = await track.boundingBox();
      const last = await page.locator(".ps-scene").last().boundingBox();
      check(Boolean(tb && last && last.x >= tb.x + tb.width - 2), "P-15", `${tag}: scenes run off to the right inside the rail`, last ? `last scene x ${Math.round(last.x)}` : "no scenes");
      await track.hover().catch(() => {});
      // More than half a scene, so mandatory snap carries it to scene 02.
      await page.mouse.wheel(Math.round(vp.w * 0.8), 0);
      await page.waitForTimeout(600);
      const first = await page.locator(".ps-scene").first().boundingBox();
      check(Boolean(first && first.x < -100), "P-15", `${tag}: the rail scrolls horizontally`, first ? `scene 01 x ${Math.round(first.x)}` : "");
      await shot(page, vp, `${slug}-nojs`);
    });
  }
}

/* ========================================================== content */

if (want("content")) {
  group("content (P-16)");
  await guard("P-16", "content-check", async () => {
    const script = path.join(ROOT, "scripts", "content-check.mjs");
    if (!(await access(script).then(() => true, () => false))) return notRun("P-16", "content-check", "scripts/content-check.mjs not there yet (owner B)");
    const r = spawnSync(process.execPath, [script], { cwd: ROOT, encoding: "utf8" });
    const outText = `${r.stdout}\n${r.stderr}`;
    check(r.status === 0, "P-16", "content-check passes", r.status === 0 ? "" : outText.trim().split("\n").slice(-3).join(" | "));
    // EV-521 is listed only where something cites it.
    check(/OWNER-PENDING/.test(outText) && /EV-520/.test(outText), "P-16", "content-check lists EV-520 as OWNER-PENDING", /EV-521/.test(outText) ? "EV-521 listed too" : "EV-521 is not cited");
  });
  const held = await confirmTexts();
  info(`${held.length} PREVIEW-only strings read from content/storyboards.ts`);
  const { page } = await open({ w: 1366, h: 657 }, "content");
  for (const slug of slugs) {
    await guard("P-16", slug, async () => {
      const res = await page.request.get(BASE + route(slug));
      const html = await res.text();
      const text = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
      const banned = BANNED.filter((re) => re.test(text)).map(String);
      check(banned.length === 0, "P-16", `${slug}: no banned string in the HTML`, banned.join(", "));
      const leaked = held.filter((t) => html.includes(t));
      check(leaked.length === 0, "P-16", `${slug}: no PREVIEW-only item in the HTML`, leaked.slice(0, 2).join(" | "));
      await goto(page, route(slug));
      const dup = await page.evaluate(() => {
        const seen = new Map();
        for (const im of document.querySelectorAll(".ps img")) {
          const s = im.getAttribute("src");
          seen.set(s, (seen.get(s) ?? 0) + 1);
        }
        return [...seen].filter(([, n]) => n > 1).map(([s, n]) => `${s} ×${n}`);
      });
      check(dup.length === 0, "P-16", `${slug}: each screen appears once`, dup.join(", "));
    });
  }
}

/* ============================================================= axe */

if (want("axe")) {
  group("axe and contrast (P-17)");
  const runAxe = async (page, tag) => {
    const r = await new AxeBuilder({ page }).include(".ps").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    check(bad.length === 0, "P-17", `${tag}: axe serious/critical`, bad.map((v) => `${v.id}(${v.nodes.length}) ${v.nodes[0]?.target?.[0] ?? ""}`).slice(0, 3).join("; "));
  };
  const stageVp = MATRIX.find((m) => m.w === 1366 && m.h === 657 && !m.reduced);
  for (const slug of slugs) {
    const tag = `${vpLabel(stageVp)} ${slug}`;
    await guard("P-17", tag, async () => {
      const { page } = await open(stageVp, slug);
      const L0 = await load(page, slug, "stage");
      const h1s = await page.locator("h1").count();
      check(h1s === 1, "P-17", `${tag}: exactly one H1`, String(h1s));
      if (L0.mode !== "stage") return notRun("P-17", `${tag}: stage scenes`, `mode ${L0.mode}`);
      const st = L0.st;
      for (const i of [0, 5, st.N - 2]) {
        await rest(page, st, i);
        await runAxe(page, `${tag} stage scene ${String(i + 1).padStart(2, "0")}`);
        // Contrast of the body copy over the worst background pixel (big type included).
        const c = await page.evaluate((i) => {
          const body = document.querySelectorAll(".ps-scene")[i].querySelector(".ps-body");
          if (!body) return null;
          const b = body.getBoundingClientRect();
          const color = getComputedStyle(body).color;
          body.style.setProperty("color", "transparent", "important");
          return { clip: { x: Math.max(0, b.left), y: Math.max(0, b.top), width: Math.min(b.width, innerWidth - b.left), height: Math.min(b.height, innerHeight - b.top) }, color };
        }, i);
        if (!c || c.clip.width < 2 || c.clip.height < 2) continue;
        const px = await pixels(page, c.clip);
        await page.evaluate((i) => document.querySelectorAll(".ps-scene")[i].querySelector(".ps-body")?.style.removeProperty("color"), i);
        if (!px) {
          notRun("P-17", `${tag}: contrast`, "sharp unavailable");
          continue;
        }
        const fg = parseRgb(c.color);
        const worst = Math.min(...px.map((p) => contrast(fg, p)));
        check(worst >= 4.5, "P-17", `${tag} scene ${i + 1}: .ps-body contrast over its worst background pixel`, worst.toFixed(2));
      }
    });
    for (const vp of [MATRIX.find((m) => m.w === 390 && m.h === 844), MATRIX.find((m) => m.w === 1280 && m.h === 480), MATRIX.find((m) => m.reduced)]) {
      if (!inRun(vp)) continue;
      await guard("P-17", `${vpLabel(vp)} ${slug}`, async () => {
        const { page } = await open(vp, slug);
        await load(page, slug, vp.product);
        await runAxe(page, `${vpLabel(vp)} ${slug} ${vp.static ? "static rail" : vp.product}`);
      });
    }
  }
}

/* ===================================================== performance */

if (want("perf")) {
  group("performance (P-18)");
  if (IS_DEV) {
    notRun("P-18", "bundle, long tasks, CLS", "dev server: chunk sizes and timings are not representative; run against the build");
  } else {
    const vp = MATRIX.find((m) => m.w === 1366 && m.h === 657 && !m.reduced);
    for (const slug of slugs) {
      const tag = `${vpLabel(vp)} ${slug}`;
      await guard("P-18", tag, async () => {
        const jsOf = async (v) => {
          const { page } = await open(v, slug);
          const urls = new Set();
          page.on("response", (r) => /\.js(\?|$)/.test(r.url()) && urls.add(r.url()));
          await load(page, slug, v.reduced ? "rail" : "stage");
          await page.waitForTimeout(1500);
          return { page, urls };
        };
        const gz = async (page, urls) => {
          let n = 0;
          for (const u of urls) n += zlib.gzipSync(await (await page.request.get(u)).body()).length;
          return n;
        };
        const base = await jsOf({ ...vp, reduced: true });
        const initial = await gz(base.page, base.urls);
        const full = await jsOf(vp);
        const extra = [...full.urls].filter((u) => !base.urls.has(u));
        const stageKb = (await gz(full.page, extra)) / 1024;
        check(initial / 1024 <= 150, "P-18", `${tag}: initial JS ${(initial / 1024).toFixed(1)} KB gzip (≤150)`);
        check(stageKb <= 50, "P-18", `${tag}: stage-only JS ${stageKb.toFixed(1)} KB gzip (≤50)`, `${extra.length} chunk(s)`);
        const near = await full.page.evaluate(() => document.querySelectorAll(".ps-scene.is-near").length);
        check(near <= 3, "P-18", `${tag}: ${near} scenes .is-near at rest (≤3)`);
      });
      if (slug !== "tasree3" && !ARGS.slug) continue;
      await guard("P-18", `${tag}: trace`, async () => {
        const { page } = await open(vp, slug);
        await page.addInitScript(() => {
          window.__lt = [];
          window.__cls = 0;
          try {
            new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push({ t: e.startTime, d: e.duration }))).observe({ type: "longtask", buffered: true });
            new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true });
          } catch {}
        });
        const L0 = await load(page, slug, "stage");
        await page.waitForTimeout(3000);
        const cls = await page.evaluate(() => window.__cls);
        check(cls <= 0.02, "P-18", `${tag}: CLS ${cls.toFixed(3)} (≤0.02)`);
        if (L0.mode !== "stage") return notRun("P-18", `${tag}: trace`, `mode ${L0.mode}`);
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await rest(page, L0.st, 1, 900);
        const t0 = await page.evaluate(() => performance.now());
        for (let k = 0; k < 3; k++) {
          await page.keyboard.press("ArrowRight");
          await page.waitForTimeout(1100);
        }
        const long = await page.evaluate((t0) => window.__lt.filter((e) => e.t >= t0 && e.d > 50), t0);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        check(long.length === 0, "P-18", `${tag}: no long task >50 ms over 3 scenes at 4× CPU`, long.slice(0, 3).map((e) => `${Math.round(e.d)} ms`).join(", "));
      });
    }
  }
}

/* ============================================================ P-22 */

if (want("choreo")) {
  group("choreography dev assertions (P-22)");
  await guard("P-22", "selftest-choreo", async () => {
    const own = path.join(ROOT, "scripts", "selftest-choreo.mjs");
    if (!(await access(own).then(() => true, () => false))) return notRun("P-22", "selftest-choreo", "A's scripts/selftest-choreo.mjs not there");
    const r = spawnSync(process.execPath, [own], { cwd: ROOT, encoding: "utf8" });
    const tail = [r.stdout, r.stderr].join(" ").trim().split(/[\r\n]+/).slice(-3).join(" | ");
    check(r.status === 0, "P-22", "A's selftest-choreo.mjs passes", r.status === 0 ? "" : tail);
  });
  await guard("P-22", "choreo.ts", async () => {
    const file = path.join(ROOT, "components", "stage", "choreo.ts");
    if (!(await access(file).then(() => true, () => false))) return notRun("P-22", "choreo.ts", "components/stage/choreo.ts not there yet (owner A)");
    const emit = process.emitWarning;
    process.emitWarning = function (w, ...rest) {
      const code = typeof rest[0] === "object" ? rest[0]?.code : rest[1];
      return code === "MODULE_TYPELESS_PACKAGE_JSON" ? undefined : emit.call(this, w, ...rest);
    };
    let mod;
    try {
      mod = await import("../components/stage/choreo.ts");
    } catch (e) {
      return notRun("P-22", "choreo.ts", `cannot import in node (${String(e.message).split("\n")[0].slice(0, 120)}); A to ship a node self-test or keep choreo.ts free of runtime relative imports`);
    }
    if (typeof mod.span !== "function") return notRun("P-22", "choreo.ts", "no exported span()");
    const tl = { fromTo() { return tl; }, to() { return tl; }, from() { return tl; }, set() { return tl; }, add() { return tl; }, duration: () => 1 };
    const at = (p) => p;
    const el = (cls) => ({ nodeType: 1, classList: { contains: (c) => c === cls }, matches: (s) => s.includes(cls ? `.${cls}` : "\u0000"), className: cls ?? "", closest: () => null });
    const throws = (fn) => { try { fn(); return false; } catch { return true; } };
    check(throws(() => mod.span(tl, at, 0.3, 0.5, el("viz-node"), { y: 10 }, { y: 0 })), "P-22", "an entrance ending after 0.4601 throws");
    check(throws(() => mod.span(tl, at, 0.52, 0.7, el("viz-node"), { y: 0 }, { y: 10 })), "P-22", "an exit starting before 0.5399 throws");
    check(throws(() => mod.span(tl, at, 0.12, 0.3, el("ps-mid"), { x: 10 }, { x: 0 })), "P-22", "a layer wrapper as a choreography target throws");
    const heading = { nodeType: 1, tagName: "H2", className: "ps-h", classList: { contains: () => false }, matches: (sel) => sel.split(",").some((x) => x.trim() === "h2"), closest: () => null };
    check(throws(() => mod.span(tl, at, 0.16, 0.44, heading, { opacity: 0 }, { opacity: 1 })), "P-22", "fading a heading throws (I2)");
    check(!throws(() => mod.span(tl, at, 0.12, 0.3, el("viz-node"), { y: 10 }, { y: 0 })), "P-22", "a legal entrance does not throw");
  });
}

await browser.close();
process.exit(await finish("verify-stage"));
