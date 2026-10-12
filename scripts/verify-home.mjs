/**
 * Homepage: FINAL-SPEC §12.3 (H-01…H-05, G-01…G-08, S-01…S-03), the homepage
 * columns of the §12.1 matrix and the §3.3 resolved token values, measured in
 * Playwright Chromium against the build on :4173 (or VERIFY_URL).
 * `verify-landing.mjs` (the name §10 uses) runs this file.
 *
 *   node scripts/verify-home.mjs [--quick] [--vp 1366x657,390x844t]
 *                                [--only tokens,hero,room,gallery,sections,axe]
 *                                [--shots none|key|all]
 *
 * Viewports: every row of §12.1, plus 1024×560 (the first §7.4 framing row)
 * and 320×568 (the H-02 smallest phone). Screenshots of the hero, gallery
 * cards 1 and 3, scenario step 01, the CTA and the footer go to
 * docs/review/2026-10-11-r3/<WxH>/home-*.png.
 */
import AxeBuilder from "@axe-core/playwright";
import {
  ARGS, FRAMING, IS_DEV, MATRIX, TOKENS,
  check, fail, finish, goto, group, guard, inRun, info, launch, loadBreakpoints,
  newPage, notRun, parseRgb, pass, pixel, shot, steady, until, vpKey, vpLabel, want,
} from "./verify-lib.mjs";

const { MQ } = await loadBreakpoints();
const VPS = [
  ...MATRIX,
  { w: 1024, h: 560, product: "stage", gallery: "pinned", variant: null, card: null, h1: null, cta: 16 },
  { w: 320, h: 568, touch: true, product: "rail", gallery: "rail", variant: "stacked", card: "fit", h1: null, cta: null, tiny: true },
].filter(inRun);

/** §3.2 --u and --fs-hero for any viewport (the table values come from this). */
function expectedHero(w, h) {
  const portrait = h > w;
  const u = portrait ? (w <= 599 ? Math.min(2.15 * w, 1.1 * h) : Math.min(1.5 * w, 1.1 * h)) / 100 : Math.min(w, 1.85 * h) / 100;
  return Math.min(120, Math.max(36, 5.2 * u));
}
/** The card variant a card of this size gets from its container queries (§8.2). */
const variantOf = (w, h) => (w < 760 ? "stacked" : h >= 600 ? "regular" : h >= 480 ? "compact" : "tight");
const parseBox = (s) => {
  if (!s) return null;
  try {
    const j = JSON.parse(s);
    if (Array.isArray(j)) return { l: j[0], t: j[1], r: j[2], b: j[3] };
    return { l: j.l ?? j.left, t: j.t ?? j.top, r: j.r ?? j.right, b: j.b ?? j.bottom };
  } catch {
    const n = s.split(/[\s,]+/).map(Number);
    return n.length >= 4 ? { l: n[0], t: n[1], r: n[2], b: n[3] } : null;
  }
};
const near3 = (a, b) => Math.abs(a - b) <= Math.max(3, Math.abs(b) * 0.03);

const browser = await launch();
const contexts = [];
async function open(vp, opts) {
  for (const c of contexts.splice(0)) await c.close().catch(() => {});
  const p = await newPage(browser, vp, opts);
  contexts.push(p.ctx);
  return p;
}
async function home(page) {
  await goto(page, "/", "load");
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(1500);
}
const resolved = (page, prop, value, host) =>
  page.evaluate(([p, v, h]) => window.__v.probe(p, v, h ? document.querySelector(h) : null), [prop, value, host]);
const current = (page) => page.evaluate(() => Number(document.querySelector(".sc-panel.is-current")?.dataset.i ?? -1));

/* ================================================================ tokens */

if (want("tokens")) {
  group("§3.3 resolved values (u, header, hero H1, product title, scene H2, product body)");
  for (const [w, h, u, header, heroH1, psTitle, sceneH2, psBody] of TOKENS) {
    const vp = { w, h, touch: w < 1024 };
    if (!inRun(vp) && !inRun({ w, h })) continue;
    await guard("T-3.3", vpLabel(vp), async () => {
      const { page } = await open(vp);
      await home(page);
      const got = {
        u: (await resolved(page, "width", "calc(var(--u) * 100)")) / 100,
        header: await resolved(page, "height", "var(--header-h)"),
        heroH1: await resolved(page, "font-size", "var(--fs-hero)"),
        psTitle: await resolved(page, "font-size", "var(--fs-ps-title)"),
        sceneH2: await resolved(page, "font-size", "var(--fs-ps-h)"),
        psBody: await resolved(page, "font-size", "var(--fs-ps-body)"),
        rendered: await page.evaluate(() => document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0),
      };
      const exp = { u, header, heroH1, psTitle, sceneH2, psBody };
      const bad = Object.entries(exp).filter(([k, e]) => Math.abs(got[k] - e) > (k === "u" ? 0.05 : 1)).map(([k, e]) => `${k} ${got[k].toFixed(2)}≠${e}`);
      check(bad.length === 0, "T-3.3", `${vpLabel(vp)}: tokens resolve per §3.3`, bad.join(", "));
      check(Math.abs(got.rendered - header) <= 1, "T-3.3", `${vpLabel(vp)}: rendered header ${got.rendered.toFixed(1)} px = --header-h ${header}`);
    });
  }
}

/* ========================================================== per viewport */

for (const vp of VPS) {
  const tag = vpLabel(vp);
  const groups = ["hero", "room", "gallery", "sections", "axe"].filter(want);
  if (!groups.length) break;
  group(`home ${tag}: ${groups.join(", ")}`);
  const { page, errors } = await open(vp);
  const threeReqs = [];
  page.on("response", async (r) => {
    if (!/\.js(\?|$)/.test(r.url())) return;
    if (/three|react-three|@react-three|fiber|drei/i.test(r.url())) return threeReqs.push(r.url().split("/").pop());
    // Hashed build chunks carry no package name, and size alone misfires on
    // the dev server (react-dom's development build is ~1 MB), so look for
    // three.js itself in the body.
    const body = await r.text().catch(() => "");
    if (/\bWebGLRenderer\b/.test(body) && /\bPerspectiveCamera\b/.test(body))
      threeReqs.push(`${r.url().split("/").pop()} (${Math.round(body.length / 1024)} KB, contains three.js)`);
  });
  if (!(await guard("H-01", `${tag}: load`, () => home(page).then(() => true)))) continue;
  const env = await page.evaluate((MQ) => ({
    split: matchMedia(MQ.heroSplit).matches,
    pinned: matchMedia(MQ.pinned).matches,
    webgl: matchMedia(MQ.roomWebgl).matches,
    W: innerWidth, H: innerHeight, cw: document.documentElement.clientWidth,
  }), MQ);
  const hdr = await resolved(page, "height", "var(--header-h)");

  /* ---------------------------------------------------------------- hero */
  if (want("hero")) {
    await guard("H-01", tag, async () => {
      const r = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        return {
          over: document.documentElement.scrollWidth - innerWidth,
          lines: h1 ? window.__v.lines(h1) : 0,
          fs: h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0,
          text: h1?.textContent?.trim().slice(0, 60),
        };
      });
      check(r.over === 0, "H-01", `${tag}: scrollWidth === innerWidth`, `+${r.over}px`);
      check(r.lines === 3, "H-01", `${tag}: H1 is 3 lines`, `${r.lines} lines: "${r.text}"`);
      const e = vp.h1 ?? expectedHero(vp.w, vp.h);
      check(Math.abs(r.fs - e) <= 1, "H-01", `${tag}: H1 ${r.fs.toFixed(1)} px (expect ${e.toFixed(1)})`);
    });
    await guard("H-02", tag, async () => {
      const r = await page.evaluate(() => {
        const hero = document.querySelector(".hero")?.getBoundingClientRect();
        const cta = document.querySelector(".hero-cta")?.getBoundingClientRect();
        const btn = document.querySelector(".hero .btn-primary, .btn-primary")?.getBoundingClientRect();
        return { heroH: hero?.height ?? 0, cta: cta?.bottom ?? null, btn: btn?.bottom ?? null };
      });
      if (env.split) check(Math.abs(r.heroH - vp.h) <= 1, "H-02", `${tag}: S tier hero height ${Math.round(r.heroH)} = innerHeight`);
      if (vp.tiny) check(r.btn !== null && r.btn <= vp.h, "H-02", `${tag}: first .btn-primary bottom ${Math.round(r.btn)} ≤ ${vp.h}`);
      else if (vp.cta !== null) check(r.cta !== null && r.cta <= vp.h - vp.cta, "H-02", `${tag}: hero CTA bottom ${r.cta === null ? "missing" : Math.round(r.cta)} ≤ ${vp.h - vp.cta}`);
    });
    await shot(page, vp, "home-hero");
  }

  /* ---------------------------------------------------------------- room */
  if (want("room")) {
    // The room loads after first paint (its chunk is lazy); give it time to mount.
    if (env.split && env.webgl) await until(page, () => !!document.querySelector(".hero-room canvas"), null, IS_DEV ? 20000 : 8000, 200);
    const noThree = vp.h > vp.w || vp.w < 1024 || vp.h < 500;
    if (noThree) check(threeReqs.length === 0, "H-05", `${tag}: no three.js request (portrait, <1024 wide or <500 tall)`, threeReqs.slice(0, 2).join(", "));
    if (env.split) {
      await guard("H-03", tag, async () => {
        const r = await page.evaluate(() => {
          const room = document.querySelector(".hero-room");
          const copy = document.querySelector(".hero-copy-inner")?.getBoundingClientRect();
          return {
            canvas: !!room?.querySelector("canvas"),
            bbox: room?.getAttribute("data-bbox") ?? null,
            col: room?.getAttribute("data-col") ?? null,
            near: room?.getAttribute("data-near") ?? null,
            copyRight: copy?.right ?? null,
          };
        });
        if (!r.canvas) return env.webgl ? fail("H-03", `${tag}: WebGL room`, "no canvas inside .hero-room") : undefined;
        const bbox = parseBox(r.bbox);
        const col = parseBox(r.col);
        if (!bbox || !col) return notRun("H-03", tag, "no data-bbox/data-col on .hero-room (C: Framing writes them)");
        const inside = bbox.l >= col.l - 1 && bbox.r <= col.r + 1 && bbox.t >= col.t - 1 && bbox.b <= col.b + 1;
        check(inside, "H-03", `${tag}: bbox inside the column`, `bbox ${JSON.stringify(bbox)} col ${JSON.stringify(col)}`);
        check(col.l >= r.copyRight + 24, "H-03", `${tag}: column starts ≥24 px right of the copy`, `col.l ${Math.round(col.l)} copyRight ${Math.round(r.copyRight)}`);
        check(bbox.r <= vp.w - 8, "H-03", `${tag}: bbox.r ${Math.round(bbox.r)} ≤ innerWidth − 8`);
        const nearW = r.near === null ? null : Number(r.near);
        if (nearW === null) notRun("H-03", `${tag}: near panel`, "no data-near on .hero-room (C)");
        else check(nearW >= 0.3 * (col.r - col.l), "H-03", `${tag}: near panel ${Math.round(nearW)} ≥ 0.30 × column ${Math.round(col.r - col.l)}`);
        const f = FRAMING[vpKey({ w: vp.w, h: vp.h })];
        if (f) {
          const ok = near3(col.l, f.col[0]) && near3(col.r, f.col[1]) && near3(col.t, f.col[2]) && near3(col.b, f.col[3])
            && near3(bbox.l, f.bbox[0]) && near3(bbox.t, f.bbox[1]) && near3(bbox.r, f.bbox[2]) && near3(bbox.b, f.bbox[3])
            && (nearW === null || near3(nearW, f.near));
          check(ok, "H-03", `${tag}: framing matches §7.4 ±3%`, `col ${[col.l, col.r, col.t, col.b].map(Math.round)} bbox ${[bbox.l, bbox.t, bbox.r, bbox.b].map(Math.round)} near ${nearW}`);
        }
      });
      await guard("H-04", tag, async () => {
        const p = await page.evaluate(() => {
          const c = document.querySelector(".hero-copy-inner")?.getBoundingClientRect();
          const h = document.querySelector("h1")?.getBoundingClientRect();
          const d = document.createElement("div");
          d.style.background = "var(--surface-page)";
          document.body.appendChild(d);
          const bg = getComputedStyle(d).backgroundColor;
          d.remove();
          return c && h ? { x: c.right - 4, y: h.top + h.height / 2, bg } : null;
        });
        if (!p) return fail("H-04", tag, "no .hero-copy-inner or h1");
        // Hide the copy for the sample so a glyph can never be the pixel read.
        const hide = await page.addStyleTag({ content: ".hero-copy{visibility:hidden!important}" });
        await page.waitForTimeout(100);
        const px = await pixel(page, p.x, p.y);
        await hide.evaluate((el) => el.remove());
        if (!px) return notRun("H-04", tag, "sharp unavailable to decode the pixel");
        const want_ = parseRgb(p.bg);
        const d = Math.max(...px.map((c, k) => Math.abs(c - want_[k])));
        check(d <= 3, "H-04", `${tag}: scrim at (copyRight − 4, H1 centre) is --surface-page`, `rgb(${px}) vs rgb(${want_}) Δ${d}`);
      });
    }
  }

  /* ------------------------------------------------------------- gallery */
  if (want("gallery")) {
    await guard("G-01", tag, async () => {
      const cls = await page.evaluate(() => document.querySelector(".showcase")?.className ?? "missing");
      const pinned = /\bis-pinned\b/.test(cls);
      check(pinned === env.pinned, "G-01", `${tag}: is-pinned exactly when MQ.pinned matches`, `MQ ${env.pinned}, class "${cls}"`);
      check((vp.gallery === "pinned") === pinned, "G-01", `${tag}: gallery ${pinned ? "pinned" : "rail"} (matrix: ${vp.gallery})`);
    });
    const film = await page.evaluate(() => {
      const f = document.querySelector(".sc-film") ?? document.querySelector(".showcase");
      return f ? { top: f.getBoundingClientRect().top + scrollY, h: f.getBoundingClientRect().height } : null;
    });
    const pinned = await page.evaluate(() => !!document.querySelector(".showcase.is-pinned"));
    /* Card i's rest, as the gallery itself defines it: scroll 12 px short of
       the linear position (well inside the return threshold) and let its
       settle glide home, so rounding in the test can never pass for rounding
       in the gallery. */
    const restAt = async (i) => {
      const travel = film.h - vp.h;
      const y = film.top + (i / 5) * travel + (i === 5 ? -12 : i === 0 ? 0 : 12);
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(y));
      await page.waitForTimeout(900);
      await steady(page, ".sc-track", 3000);
    };
    if (pinned && film) await restAt(0);
    else await page.evaluate(() => document.querySelector(".sc-pin, .sc-track")?.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(600);

    await guard("G-02", tag, async () => {
      const r = await page.evaluate(() => {
        const s = document.querySelector(".showcase");
        const ctl = parseFloat(getComputedStyle(s).getPropertyValue("--sc-controls-h")) || 56;
        return {
          ctl,
          cards: [...document.querySelectorAll(".sc-card")].map((c) => {
            // Layout size: the pinned neighbours are scaled by GSAP, which a
            // bounding box would include.
            const copy = c.querySelector(".sc-copy");
            return { w: c.offsetWidth, h: c.offsetHeight, over: copy ? copy.scrollHeight - copy.clientHeight : 0 };
          }),
        };
      });
      if (r.cards.length !== 6) return fail("G-02", tag, `${r.cards.length} .sc-card`);
      const cap = vp.card === "fit" ? vp.h - hdr - 52 : vp.h - hdr - r.ctl;
      const tall = r.cards.filter((c) => c.h > cap + 1);
      check(tall.length === 0, "G-02", `${tag}: cards ≤ innerHeight − header − controls (${Math.round(cap)})`, tall.map((c) => Math.round(c.h)).join(","));
      if (typeof vp.card === "number")
        check(r.cards.every((c) => Math.abs(c.h - vp.card) <= 2), "G-02", `${tag}: card height ${Math.round(r.cards[0].h)} (expect ${vp.card} ±2)`);
      const over = r.cards.map((c, i) => [i + 1, c.over]).filter(([, o]) => o > 0);
      check(over.length === 0, "G-02", `${tag}: no .sc-copy overflows`, over.map(([i, o]) => `card ${i} +${o}px`).join(", "));
      if (vp.variant) {
        const v = variantOf(r.cards[0].w, r.cards[0].h);
        check(v === vp.variant, "G-02", `${tag}: card ${Math.round(r.cards[0].w)}×${Math.round(r.cards[0].h)} gets the ${v} variant (matrix: ${vp.variant})`);
      }
    });
    await guard("G-03", tag, async () => {
      if (pinned) {
        const b = await page.evaluate(() => document.querySelector(".sc-controls")?.getBoundingClientRect().bottom ?? null);
        // Half a pixel of tolerance: a fractional --u can leave the bottom at
        // 520.3 when the controls sit flush with the bottom edge.
        check(b !== null && b <= vp.h + 0.5, "G-03", `${tag}: with the pin at the top, controls bottom ${b === null ? "missing" : b.toFixed(1)} ≤ ${vp.h}`);
      } else if ((vp.w === 1024 && vp.h === 768) || (vp.w === 390 && vp.h === 844)) {
        // Bring the current card to just under the header, as a reader would.
        await page.evaluate((hdr) => {
          const card = document.querySelector(".sc-panel.is-current .sc-card, .sc-card");
          window.scrollTo(0, card.getBoundingClientRect().top + scrollY - hdr - 8);
        }, hdr);
        await page.waitForTimeout(500);
        const g = await page.evaluate(() => ({
          card: document.querySelector(".sc-panel.is-current .sc-card, .sc-card")?.getBoundingClientRect().bottom,
          ctl: document.querySelector(".sc-controls")?.getBoundingClientRect().bottom ?? null,
        }));
        check(g.ctl !== null && g.card <= vp.h && g.ctl <= vp.h, "G-03", `${tag}: rail card and controls visible together`, `card ${Math.round(g.card)} controls ${g.ctl === null ? "missing" : Math.round(g.ctl)} / ${vp.h}`);
      }
    });
    await shot(page, vp, "home-card-1");

    if (pinned && film) {
      await guard("G-04", tag, async () => {
        const travel = film.h - vp.h;
        check(Math.abs(travel - 2.5 * vp.h) <= 2, "G-04", `${tag}: travel ${Math.round(travel)} = 2.5 × innerHeight`);
        await restAt(0);
        await page.mouse.move(vp.w / 2, vp.h / 2);
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(1300);
        const c1 = await current(page);
        check(c1 === 1, "G-04", `${tag}: one wheel notch moves one card`, `card ${c1 + 1}`);
        await restAt(0);
        const next = page.locator('button[aria-label="Next product"]');
        for (let k = 0; k < 4; k++) {
          await next.click();
          await page.waitForTimeout(1100);
        }
        const c4 = await current(page);
        check(c4 === 4, "G-04", `${tag}: 4 × Next lands on card 5`, `card ${c4 + 1}`);
        await shot(page, vp, "home-card-5", "all");
        const strip = page.locator('button[aria-label="Show Yisbir"]');
        if (await strip.count()) {
          await strip.click();
          await page.waitForTimeout(1300);
          const c = await current(page);
          const pressed = await strip.getAttribute("aria-pressed");
          check(c === 3 && pressed === "true", "G-04", `${tag}: name strip "Show Yisbir" settles on card 4`, `card ${c + 1}, aria-pressed=${pressed}`);
        } else fail("G-04", `${tag}: name strip`, 'no button[aria-label="Show Yisbir"]');
      });
      await guard("G-05", tag, async () => {
        await restAt(2);
        const r = await page.evaluate(() => [...document.querySelectorAll(".sc-panel")].map((p) => ({
          cur: p.classList.contains("is-current"), inert: p.inert, op: parseFloat(getComputedStyle(p).opacity),
        })));
        const bad = r.filter((p) => !p.cur && (!p.inert || Math.abs(p.op - 0.35) > 0.01));
        const cur = r.filter((p) => p.cur);
        check(bad.length === 0 && cur.length === 1 && !cur[0].inert && cur[0].op > 0.99, "G-05", `${tag}: neighbours inert at 0.35, current live at 1`, JSON.stringify(bad[0] ?? cur[0] ?? ""));
        await shot(page, vp, "home-card-3");
      });
      await guard("G-06", tag, async () => {
        await restAt(0);
        const r = await page.evaluate(() => {
          const v = window.__v;
          const ps = document.querySelectorAll(".sc-panel");
          const card0 = ps[0].querySelector(".sc-card");
          const media0 = ps[0].querySelector(".sc-media-3d");
          const m1 = v.matrix(ps[1].querySelector(".sc-card"));
          return { card: v.identity(card0), media: media0 ? v.identity(media0) : null, nb: m1.raw, ry: m1.is3d ? Math.abs(m1.v[2]) + Math.abs(m1.v[8]) : 0 };
        });
        check(r.card && r.media !== false, "G-06", `${tag}: current card and media identity at rest`, `card ${r.card} media ${r.media}`);
        check(r.ry > 0.01, "G-06", `${tag}: the neighbour is rotated (rotationY ≠ 0)`, r.nb.slice(0, 70));
      });
      await guard("G-07", tag, async () => {
        const off = [];
        for (let i = 0; i < 6; i++) {
          await restAt(i);
          const c = await page.evaluate((i) => {
            const b = document.querySelectorAll(".sc-card")[i].getBoundingClientRect();
            return { mid: b.left + b.width / 2, cw: document.documentElement.clientWidth, cur: Number(document.querySelector(".sc-panel.is-current")?.dataset.i ?? -1) };
          }, i);
          off.push([c.mid - c.cw / 2, c.cur]);
        }
        const bad = off.map(([d, cur], i) => [i + 1, d, cur]).filter(([i, d, cur]) => Math.abs(d) > 1 || cur !== i - 1);
        check(bad.length === 0, "G-07", `${tag}: each card centred at its rest (${env.cw < env.W ? "classic scrollbar" : "overlay scrollbar"})`, bad.map(([i, d, cur]) => `card ${i} ${d.toFixed(1)}px (current ${cur + 1})`).join(", "));
      });
      if (vp.w === 1366 || vp.w === 1024) {
        await guard("G-05", `${tag}: Tab stops`, async () => {
          await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement instanceof HTMLElement && document.activeElement.blur(); });
          await page.waitForTimeout(400);
          const bad = [];
          for (let t = 1; t <= 40; t++) {
            await page.keyboard.press("Tab");
            const ok = await until(page, (hdr) => {
              const a = document.activeElement;
              if (!a || a === document.body || a.closest("nextjs-portal") || a.tagName === "NEXTJS-PORTAL") return true;
              const b = a.getBoundingClientRect();
              const inHdr = !!a.closest(".site-header") || /skip/.test(a.className);
              return b.width > 0 && b.left >= -1 && b.right <= innerWidth + 1 && b.bottom <= innerHeight + 1 && (inHdr || b.top >= hdr - 1);
            }, hdr, 1100, 80);
            if (!ok) bad.push(`#${t} ${await page.evaluate(() => window.__v.name(document.activeElement))}`);
          }
          check(bad.length === 0, "G-05", `${tag}: first 40 Tab stops visible, top ≥ header`, bad.slice(0, 3).join(" | "));
        });
      }
    } else if (!pinned) {
      for (const id of ["G-04", "G-06", "G-07"]) if (vp.gallery === "pinned") notRun(id, tag, "gallery is not pinned");
      if (vp.reduced) {
        await guard("G-08", tag, async () => {
          const r = await page.evaluate(() => ({
            cls: document.querySelector(".showcase")?.className,
            ops: [...document.querySelectorAll(".sc-panel")].map((p) => getComputedStyle(p).opacity),
            tf: [...document.querySelectorAll(".sc-bg, .sc-media, .sc-shot2")].map((e) => getComputedStyle(e).transform).filter((t) => t !== "none"),
          }));
          check(/is-rail/.test(r.cls) && r.ops.every((o) => o === "1") && r.tf.length === 0, "G-08", `${tag}: rail, panels at opacity 1, layers untransformed`, `${r.cls}; opacities ${r.ops.join(",")}; transforms ${r.tf.slice(0, 2).join(" ")}`);
        });
      }
      if (vp.touch && vp.w < 1024 && vp.w >= 390) {
        await guard("G-05", `${tag}: focus sync`, async () => {
          const r = await page.evaluate(async () => {
            const link = document.querySelectorAll(".sc-panel")[2]?.querySelector("a");
            if (!link) return null;
            link.focus();
            await new Promise((res) => setTimeout(res, 900));
            return Number(document.querySelector(".sc-panel.is-current")?.dataset.i ?? -1);
          });
          check(r === 2, "G-05", `${tag}: focusing card 3 makes it current`, `current ${r === null ? "n/a" : r + 1}`);
        });
      }
    }
  }

  /* ------------------------------------------------------------ sections */
  if (want("sections")) {
    if (vp.w >= 1024) {
      await guard("S-01", tag, async () => {
        const steps = await page.locator(".how-step").count();
        if (!steps) return notRun("S-01", tag, "no .how-step");
        const counts = [];
        for (let i = 0; i < steps; i++) {
          await page.locator(".how-step").nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }));
          await page.waitForTimeout(600);
          counts.push(await page.evaluate(() => document.querySelectorAll(".how-shot.is-shown, .how-shot.is-pre").length));
          if (i === 0) await shot(page, vp, "home-scenario-01");
        }
        check(counts.every((c) => c === 1), "S-01", `${tag}: one shot shown at every step`, counts.join(","));
        const sticky = await page.evaluate(() => document.querySelector(".how-sticky")?.getBoundingClientRect().height ?? null);
        if (sticky !== null) check(sticky <= vp.h - hdr + 1, "S-01", `${tag}: .how-sticky ${Math.round(sticky)} ≤ innerHeight − header`);
      });
      if (vp.h >= 520 && vp.w >= vp.h) {
        await guard("S-02", tag, async () => {
          await page.evaluate((hdr) => {
            const c = document.getElementById("contact");
            window.scrollTo(0, c.getBoundingClientRect().top + scrollY - hdr);
          }, hdr);
          await page.waitForTimeout(700);
          const r = await page.evaluate(() => {
            const c = document.getElementById("contact");
            return { h2: c.querySelector("h2")?.getBoundingClientRect().bottom, act: c.querySelector(".cta-actions")?.getBoundingClientRect().bottom };
          });
          check(r.h2 <= vp.h && r.act <= vp.h, "S-02", `${tag}: CTA heading and actions on screen under the header`, `h2 ${Math.round(r.h2)} actions ${Math.round(r.act)} / ${vp.h}`);
          await shot(page, vp, "home-cta");
        });
      }
    }
    await guard("S-03", tag, async () => {
      const r = await page.evaluate(() => {
        const f = document.querySelector(".sc-film");
        const hs = document.querySelector(".hero-stage");
        const hero = document.querySelector(".hero");
        return {
          footer: document.querySelector(".site-footer")?.getBoundingClientRect().height ?? 0,
          doc: document.documentElement.scrollHeight,
          pin: Math.max(0, f ? f.getBoundingClientRect().height - innerHeight : 0) + Math.max(0, hs && hero ? hs.getBoundingClientRect().height - hero.getBoundingClientRect().height : 0),
        };
      });
      if (vp.w === 390 && vp.h === 844) check(r.footer <= 720, "S-03", `${tag}: footer ${Math.round(r.footer)} ≤ 720`);
      if (vp.w === 1440 && vp.h === 900) check(r.doc <= 8.5 * vp.h, "S-03", `${tag}: homepage ${(r.doc / vp.h).toFixed(2)} × innerHeight (≤8.5)`);
      check(r.pin <= 3 * vp.h + 2, "S-03", `${tag}: total pin ${(r.pin / vp.h).toFixed(2)} × innerHeight (≤3)`);
      await page.evaluate(() => document.querySelector(".site-footer")?.scrollIntoView({ block: "end" }));
      await page.waitForTimeout(400);
      await shot(page, vp, "home-footer");
    });
  }

  /* ----------------------------------------------------------------- axe */
  if (want("axe") && (vp.w === 1366 || vp.w === 390 || vp.w === 1024 || vp.reduced)) {
    await guard("AXE", tag, async () => {
      await page.evaluate(() => window.scrollTo(0, 0));
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      check(bad.length === 0, "AXE", `${tag}: homepage axe serious/critical`, bad.map((v) => `${v.id}(${v.nodes.length}) ${v.nodes[0]?.target?.[0] ?? ""}`).slice(0, 3).join("; "));
    });
  }

  check(errors.length === 0, "X-01", `${tag}: homepage console errors`, errors.slice(0, 2).join(" | "));
}

/* ======================================================= H-05 DPR, reduced */

if (want("room")) {
  group("room budget and reduced motion (H-05)");
  if (inRun({ w: 1440, h: 900 }) || !ARGS.vp) {
    await guard("H-05", "1440×900 @2x", async () => {
      const { page } = await open({ w: 1440, h: 900, dsf: 2 });
      await home(page);
      // The room's chunk is lazy (and compiles on first request on the dev server).
      await until(page, () => !!document.querySelector(".hero-room canvas"), null, 12000, 200);
      const r = await page.evaluate(() => {
        const c = document.querySelector(".hero-room canvas");
        return c ? c.width / c.getBoundingClientRect().width : null;
      });
      if (r === null) notRun("H-05", "1440×900 @2x", "no canvas (WebGL unavailable or depth mode)");
      else check(r <= 1.51, "H-05", `1440×900 at DPR 2: canvas renders at ${r.toFixed(2)}× (≤1.5)`);
    });
  }
  const rv = { w: 1366, h: 657, reduced: true };
  if (inRun(rv) || !ARGS.vp) {
    await guard("H-05", vpLabel(rv), async () => {
      const { page } = await open(rv);
      await home(page);
      await until(page, () => !!document.querySelector(".hero-room canvas"), null, IS_DEV ? 20000 : 8000, 200);
      const r = await page.evaluate(() => {
        const c = document.querySelector(".hero-room canvas");
        const fl = document.querySelector(".hero-room [data-frameloop], .hero-room[data-frameloop]")?.getAttribute("data-frameloop") ?? null;
        const b = c?.getBoundingClientRect();
        return { fl, clip: b ? { x: b.left, y: b.top, width: Math.min(b.width, innerWidth - b.left), height: Math.min(b.height, innerHeight - b.top) } : null };
      });
      check(r.fl === "demand", "H-05", `${vpLabel(rv)}: data-frameloop="demand"`, String(r.fl));
      if (!r.clip) return notRun("H-05", `${vpLabel(rv)}: pointer`, "no canvas");
      await page.waitForTimeout(2500);
      const a0 = await page.screenshot({ clip: r.clip });
      await page.waitForTimeout(600);
      const a = await page.screenshot({ clip: r.clip });
      if (!a0.equals(a)) return fail("H-05", `${vpLabel(rv)}: the room is still`, "frames differ with no input (an animation runs under reduced motion)");
      await page.mouse.move(r.clip.x + r.clip.width * 0.2, r.clip.y + r.clip.height * 0.3);
      await page.mouse.move(r.clip.x + r.clip.width * 0.8, r.clip.y + r.clip.height * 0.7, { steps: 8 });
      await page.waitForTimeout(600);
      const b = await page.screenshot({ clip: r.clip });
      check(a.equals(b), "H-05", `${vpLabel(rv)}: the room does not move with the pointer`);
    });
  }
}

info(`viewports run: ${VPS.map(vpKey).join(" ")}`);
await browser.close();
process.exit(await finish("verify-home"));
