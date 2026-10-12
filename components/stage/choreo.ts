/// <reference types="gsap" />
import type { Enter, SceneKind } from "@/content/storyboards";

/* ============================================================================
   Per-scene choreography (FINAL-SPEC §4.8). One registry, so every scene kind
   has its own shot and every visual its own entrance, and the visual
   components only emit hook classes (§6.2) for this file to target.

   Time is scene-local progress p (components/stage/engine.ts):
     0     the scene's left edge at the viewport's right
     0.5   at rest, exactly in frame
     1     the scene's right edge at the viewport's left
   Windows:
     entrance  inside [0.10, 0.46]   power2.out / power3.out
     rest      [0.46, 0.54]          everything final (I1)
     exit      inside [0.54, 0.92]   power2.in, immediateRender: false
   The first scene has no entrance and the last none of an exit: the engine's
   mapper returns null for those halves and span() skips them.

   Only transform and opacity are written (I3); line draws are scaleX/scaleY on
   hairlines. Headings only move, never fade (I2). Layer wrappers belong to
   the layer rates and are never targets here (I7). In development each of
   these rules throws (scripts/selftest-choreo.mjs exercises them in node).

   No runtime imports, so node can load this file with its types stripped.
   ========================================================================== */

export type TL = gsap.core.Timeline;
/** Maps scene-local p to a position on the scene's timeline, or null when
 * that half of the window does not exist (first and last scenes). */
export type At = (p: number) => number | null;
export type Ctx = { W: () => number; H: () => number };
type Vars = gsap.TweenVars;
type Item = Element | Element[];
type Choreo = (tl: TL, s: HTMLElement, at: At, c: Ctx) => void;

const DEV = typeof process === "undefined" || process.env.NODE_ENV !== "production";
const IN_END = 0.4601;
const OUT_START = 0.5399;

/* ---- dev assertions (P-22) ---------------------------------------------- */

/** Layer wrappers and trigger elements: their transform has another owner. */
const LAYER = ".ps-scene, .ps-track, .ps-pin, .ps-far, .ps-floor, .ps-floor-grid, .ps-bg, .ps-mid, .ps-near";
/** The shadow's x belongs to its layer rate; choreography may fade it only. */
const SHADOW = ".ps-shadow";
const TIMING = new Set(["ease", "duration", "immediateRender"]);
/** I3 and P-20: transform components and opacity, nothing else (not even transform-origin). */
const WRITABLE = new Set(["x", "y", "z", "xPercent", "yPercent", "scale", "scaleX", "scaleY", "rotation", "rotationX", "rotationY", "opacity", "transformPerspective"]);

const name = (el: Element) => `${el.tagName.toLowerCase()}.${String(el.className).trim().replace(/\s+/g, ".")}`;

export function assertWindow(p0: number, p1: number) {
  if (!(p0 >= -1e-4 && p1 <= 1 + 1e-4 && p1 >= p0)) {
    throw new Error(`choreo: window [${p0}, ${p1}] is outside the scene's timeline [0, 1]`);
  }
  if (p0 < 0.5 && p1 > IN_END) {
    throw new Error(`choreo: an entrance [${p0.toFixed(3)}, ${p1.toFixed(3)}] ends inside the rest band [0.46, 0.54]`);
  }
  if (p0 >= 0.5 && p0 < OUT_START) {
    throw new Error(`choreo: an exit [${p0.toFixed(3)}, ${p1.toFixed(3)}] starts inside the rest band [0.46, 0.54]`);
  }
}

export function assertTargets(els: Element[], vars: Vars) {
  const props = Object.keys(vars).filter((k) => !TIMING.has(k));
  const other = props.filter((k) => !WRITABLE.has(k));
  if (other.length) throw new Error(`choreo: ${other.join(", ")} written; only transforms and opacity animate (I3)`);
  for (const el of els) {
    if (el.matches(LAYER)) {
      throw new Error(`choreo: ${name(el)} is a layer wrapper; only the layer rates move it (I7)`);
    }
    if (el.matches(SHADOW) && props.some((k) => k !== "opacity")) {
      throw new Error(`choreo: ${name(el)} may only be faded; its x is a layer rate (I7)`);
    }
    if (el.matches("h1, h2") && props.includes("opacity")) {
      throw new Error(`choreo: ${name(el)} is a heading; headings move but never fade (I2)`);
    }
  }
}

/* ---- helpers ------------------------------------------------------------ */

export const q = (s: ParentNode, sel: string) => s.querySelector(sel);
export const qa = (s: ParentNode, sel: string) => Array.from(s.querySelectorAll(sel));

const flat = (t: Item | null | undefined): Element[] => (!t ? [] : Array.isArray(t) ? t.filter(Boolean) : [t]);

/** One tween from p0 to p1, mapped onto the scene's timeline. Exits never
 * render their start state early. */
export function span(tl: TL, at: At, p0: number, p1: number, t: Item | null | undefined, from: Vars, to: Vars) {
  const els = flat(t);
  if (!els.length) return;
  if (DEV) {
    assertWindow(p0, p1);
    assertTargets(els, { ...from, ...to });
  }
  const a = at(p0);
  const b = at(p1);
  if (a === null || b === null) return;
  const exit = p0 >= 0.5;
  tl.fromTo(els, { ...from }, { ...to, duration: Math.max(0, b - a), ...(exit ? { immediateRender: false } : null) }, a);
}

/**
 * Item k from p0 + k·step for d. The step shrinks so the last item still ends
 * before the rest band (entrances) or by 0.92 (exits): B's auto-fit `seq`.
 */
export function cascade(tl: TL, at: At, items: Item[], p0: number, step: number, d: number, from: Vars, to: Vars) {
  const n = items.length;
  if (!n) return;
  const limit = p0 < 0.5 ? 0.46 : 0.92;
  const s = n > 1 ? Math.max(0, Math.min(step, (limit - p0 - d) / (n - 1))) : 0;
  items.forEach((el, k) => span(tl, at, p0 + k * s, p0 + k * s + d, el, from, to));
}

/**
 * A linear extra rate on one element, zero across the rest band: the element
 * leads or lags the track by (1 − r) while the scene pans, and is exactly in
 * place at rest (I1).
 */
export function rate(tl: TL, at: At, el: Element, r: number, { W }: Ctx) {
  const dx = (p: number) => (p - 0.5) * 2 * W() * (1 - r);
  span(tl, at, 0, 0.46, el, { x: () => dx(0) }, { x: 0, ease: "none" });
  span(tl, at, 0.54, 1, el, { x: 0 }, { x: () => dx(1), ease: "none" });
}

/* B's preset vocabulary: transform and opacity only, never autoAlpha. Not
   even transform-origin is written here (P-20): the origins every hook needs
   (lines drawn from their start, tiles standing up on their foot) are fixed
   in app/stage.css. */
export const PRESET = {
  rise: { from: { y: 18, opacity: 0 }, to: { y: 0, opacity: 1, ease: "power2.out" } },
  standUp: {
    from: { rotationX: 72, y: 24, opacity: 0, transformPerspective: 900 },
    to: { rotationX: 0, y: 0, opacity: 1, transformPerspective: 900, ease: "power2.out" },
  },
  install: {
    from: { y: -36, z: 60, opacity: 0, transformPerspective: 1600 },
    to: { y: 0, z: 0, opacity: 1, transformPerspective: 1600, ease: "power3.out" },
  },
  arrive: {
    from: { z: -220, y: 28, opacity: 0, transformPerspective: 1200 },
    to: { z: 0, y: 0, opacity: 1, transformPerspective: 1200, ease: "power2.out" },
  },
  feed: { from: { x: -56, opacity: 0 }, to: { x: 0, opacity: 1, ease: "power2.out" } },
  emit: { from: { x: -16, opacity: 0 }, to: { x: 0, opacity: 1, ease: "power2.out" } },
  drawX: { from: { scaleX: 0 }, to: { scaleX: 1, ease: "power1.inOut" } },
  drawY: { from: { scaleY: 0 }, to: { scaleY: 1, ease: "power1.inOut" } },
  pop: { from: { scale: 0, opacity: 0 }, to: { scale: 1, opacity: 1, ease: "power2.out" } },
} as const satisfies Record<string, { from: Vars; to: Vars }>;

type Preset = keyof typeof PRESET;
const P = (k: Preset) => [PRESET[k].from, PRESET[k].to] as const;

/* ---- the copy column ---------------------------------------------------- */

/** The copy column's blocks after the eyebrow and heading, minus any block
 * whose items get their own cascade. */
const copyRest = (s: HTMLElement, skip: string[] = []) =>
  qa(s, ".ps-copy > :not(.ps-eyebrow):not(.ps-h)").filter((el) => !skip.some((sel) => el.matches(sel)));

export function copyIn(tl: TL, s: HTMLElement, at: At, { W }: Ctx, skip: string[] = [], hx = 0.07) {
  span(tl, at, 0.14, 0.38, q(s, ".ps-eyebrow"), { x: () => 0.04 * W() }, { x: 0, ease: "power2.out" });
  span(tl, at, 0.16, 0.44, q(s, ".ps-h"), { x: () => hx * W() }, { x: 0, ease: "power3.out" }); // I2: moves only
  cascade(tl, at, copyRest(s, skip), 0.22, 0.03, 0.18, { x: () => 0.03 * W(), opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out" });
}

export function copyOut(tl: TL, s: HTMLElement, at: At, { W }: Ctx, skip: string[] = [], hx = 0.05) {
  span(tl, at, 0.58, 0.82, q(s, ".ps-eyebrow"), { x: 0 }, { x: () => -0.04 * W(), ease: "power2.in" });
  span(tl, at, 0.56, 0.86, q(s, ".ps-h"), { x: 0 }, { x: () => -hx * W(), ease: "power2.in" });
  cascade(tl, at, copyRest(s, skip), 0.6, 0.03, 0.2, { x: 0, opacity: 1 }, { x: () => -0.03 * W(), opacity: 0, ease: "power2.in" });
}

const copy = (tl: TL, s: HTMLElement, at: At, c: Ctx, skip: string[] = []) => {
  copyIn(tl, s, at, c, skip);
  copyOut(tl, s, at, c, skip);
};

/** Facts, cases (copy-column variant) and FAQ items: their own cascade. */
function itemsIn(tl: TL, s: HTMLElement, at: At) {
  cascade(tl, at, qa(s, ".ps-fact"), 0.24, 0.02, 0.12, ...P("rise"));
  cascade(tl, at, qa(s, ".ps-copy .ps-case"), 0.24, 0.03, 0.14, ...P("rise"));
}
function itemsOut(tl: TL, s: HTMLElement, at: At, { W }: Ctx) {
  cascade(tl, at, [...qa(s, ".ps-fact"), ...qa(s, ".ps-copy .ps-case")], 0.6, 0.02, 0.18, { x: 0, opacity: 1 }, {
    x: () => -0.03 * W(),
    opacity: 0,
    ease: "power2.in",
  });
}
const ITEM_BLOCKS = [".ps-facts", ".ps-cases"];

/* ---- the midground ------------------------------------------------------ */

/** Scenes whose stage got a 3D entrance, so a dolly does not add a second. */
const entered = new WeakSet<Element>();

type MidF = Partial<{ x: number; z: number; ry: number; sc: number }>;

/** The installed module flies into registration: x, depth, yaw and scale. */
export function midIn(tl: TL, s: HTMLElement, at: At, { W }: Ctx, f: MidF = {}) {
  const st = q(s, ".ps-stage3d");
  if (!st) return;
  entered.add(s);
  const dolly = s.dataset.enter === "dolly"; // ENTER.dolly: a deeper push
  const z = dolly ? -260 : (f.z ?? -180);
  const sc = dolly ? 0.86 : (f.sc ?? 0.94);
  span(tl, at, 0.12, 0.46, st, { x: () => (f.x ?? 0.08) * W(), z, rotationY: f.ry ?? -12, scale: sc }, {
    x: 0,
    z: 0,
    rotationY: 0,
    scale: 1,
    ease: "power3.out",
  });
}

/** Exit: the module turns away and drops back, as a camera pulls focus. */
function rackFocus(tl: TL, s: HTMLElement, at: At) {
  span(tl, at, 0.56, 0.9, q(s, ".ps-stage3d"), { scale: 1, rotationY: 0 }, { scale: 0.94, rotationY: -12, ease: "power2.in" });
}

/* ---- visual entrances, one per hook family (§6.2) ------------------------ */

type VizOpts = { tiles?: "standUp" | "install" | "value" | "rise" };

/** Centre of `el` relative to `root`, from layout offsets (transforms ignored). */
function centre(el: HTMLElement, root: Element) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    const parent = n.offsetParent as HTMLElement | null;
    if (!parent || !root.contains(parent)) break;
    n = parent;
  }
  return { x, y };
}

/** A scan line climbs from the foot of its panel to its resting place at the top. */
function scan(tl: TL, s: HTMLElement, at: At) {
  for (const line of qa(s, ".viz-scan")) {
    const panel = line.parentElement;
    span(tl, at, 0.2, 0.44, line, { y: () => panel?.clientHeight ?? 0 }, { y: 0, ease: "power1.inOut" });
    span(tl, at, 0.2, 0.26, line, { opacity: 0 }, { opacity: 1, ease: "power1.out" });
  }
}

export function vizIn(tl: TL, s: HTMLElement, at: At, c: Ctx, o: VizOpts = {}) {
  /* split: the line between plan and reality is drawn, calm nodes rise, the
     warned ones arrive last */
  span(tl, at, 0.18, 0.3, q(s, ".viz-divide"), ...P("drawY"));
  cascade(tl, at, qa(s, ".viz-node:not(.is-warn)"), 0.18, 0.03, 0.14, ...P("rise"));
  cascade(tl, at, qa(s, ".viz-node.is-warn"), 0.34, 0.02, 0.1, { scale: 0.96, y: 10, opacity: 0 }, { scale: 1, y: 0, opacity: 1, ease: "power2.out" });

  /* lanes: rows feed in against the travel, then the path through them */
  cascade(tl, at, qa(s, ".viz-lane"), 0.18, 0.04, 0.18, ...P("feed"));
  span(tl, at, 0.36, 0.46, q(s, ".viz-lane-path"), { opacity: 0 }, { opacity: 1, ease: "power1.out" });

  /* tiles: the variant is the scene's (people stand up, intro installs) */
  const tiles = qa(s, ".viz-tile");
  if (o.tiles === "standUp") cascade(tl, at, tiles, 0.16, 0.05, 0.22, ...P("standUp"));
  else if (o.tiles === "install") cascade(tl, at, tiles, 0.22, 0.06, 0.2, ...P("install"));
  else if (o.tiles === "value") cascade(tl, at, tiles, 0.3, 0.05, 0.12, ...P("standUp"));
  else cascade(tl, at, tiles, 0.22, 0.04, 0.16, ...P("rise"));

  /* flow: boxes rise along the path, edges draw after them, the rework
     detour drops in last */
  cascade(tl, at, qa(s, ".viz-box:not(.is-warn)"), 0.2, 0.03, 0.12, ...P("rise"));
  cascade(tl, at, qa(s, ".viz-edge:not(.is-warn)"), 0.24, 0.03, 0.1, ...P("drawX"));
  span(tl, at, 0.34, 0.46, q(s, ".viz-rework"), { y: -12, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out" });

  /* steps as stations: the rail is drawn, then each station ticks and rises */
  span(tl, at, 0.14, 0.38, q(s, ".viz-rail"), ...P("drawX"));
  const stations = qa(s, ".viz-station");
  cascade(tl, at, stations.map((st) => qa(st, ".viz-station-tick")).flat(), 0.2, 0.045, 0.08, ...P("pop"));
  cascade(tl, at, stations.map((st) => qa(st, ".viz-station-n, .viz-station-l, .viz-station-copy")), 0.22, 0.045, 0.12, ...P("rise"));

  /* grid: a contact sheet, item by diagonal */
  const grid = qa(s, ".viz-grid-list > li[data-d]") as HTMLElement[];
  if (grid.length) {
    const dmax = Math.max(...grid.map((li) => Number(li.dataset.d) || 0));
    const step = dmax > 0 ? Math.min(0.04, (0.46 - 0.32) / dmax) : 0;
    for (const li of grid) {
      const d = Number(li.dataset.d) || 0;
      span(tl, at, 0.18 + step * d, 0.32 + step * d, li, ...P("standUp"));
    }
  }

  /* layers: the frames start as one stack on the first and fan out to their
     resting places. viz.css places them with `top` (in isometric projection
     an explode along z is a straight vertical offset), so a frame's stacked
     state is y = −(offsetTop − first.offsetTop). Each name rises with its frame. */
  const layers = qa(s, ".viz-layer") as HTMLElement[];
  layers.slice(1).forEach((layer) =>
    span(tl, at, 0.24, 0.46, layer, { y: () => layers[0].offsetTop - layer.offsetTop }, { y: 0, ease: "power2.out" }),
  );
  cascade(tl, at, qa(s, ".viz-layer-name"), 0.3, 0.03, 0.12, ...P("rise"));

  /* wall: cameras light in their own order, then the scan */
  const cams = (qa(s, ".viz-cam[data-order]") as HTMLElement[]).sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
  cascade(tl, at, cams, 0.18, 0.03, 0.14, ...P("rise"));
  scan(tl, s, at);

  /* phone */
  span(tl, at, 0.15, 0.4, q(s, ".viz-phone-body"), ...P("install"));
  cascade(tl, at, qa(s, ".viz-phone-row"), 0.3, 0.04, 0.12, ...P("rise"));

  /* records: rows print in, each rule draws under its row */
  cascade(tl, at, qa(s, ".viz-record"), 0.22, 0.04, 0.12, ...P("rise"));
  cascade(tl, at, qa(s, ".viz-record-rule"), 0.26, 0.04, 0.12, ...P("drawX"));

  /* system: the hub pops, the nodes leave it for their places */
  const hub = q(s, ".viz-hub") as HTMLElement | null;
  const nodes = qa(s, ".viz-sys-node") as HTMLElement[];
  if (hub) {
    span(tl, at, 0.3, 0.44, hub, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, ease: "power2.out" });
    const wrap = hub.parentElement ?? s;
    const from = (el: HTMLElement) => {
      const h = centre(hub, wrap);
      const n = centre(el, wrap);
      return { x: h.x - n.x, y: h.y - n.y };
    };
    const step = nodes.length > 1 ? Math.min(0.012, 0.06 / (nodes.length - 1)) : 0;
    nodes.forEach((el, k) =>
      span(tl, at, 0.28 + step * k, 0.4 + step * k, el, { x: () => from(el).x, y: () => from(el).y, scale: 0.6, opacity: 0 }, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        ease: "power2.out",
      }),
    );
  } else {
    cascade(tl, at, nodes, 0.2, 0.04, 0.14, ...P("rise"));
  }

  /* callouts on a real screen: leaders draw, then their chips */
  cascade(tl, at, qa(s, ".callout-line"), 0.34, 0.03, 0.08, ...P("drawX"));
  cascade(tl, at, qa(s, ".callout-label"), 0.36, 0.03, 0.08, ...P("rise"));

  /* cases: a montage, alternately from deep and from near */
  qa(s, ".viz-case").forEach((el, k, all) => {
    const step = all.length > 1 ? Math.min(0.028, (0.46 - 0.32) / (all.length - 1)) : 0;
    span(tl, at, 0.16 + step * k, 0.32 + step * k, el, { z: k % 2 ? 80 : -260, opacity: 0, transformPerspective: 1200 }, {
      z: 0,
      opacity: 1,
      transformPerspective: 1200,
      ease: "power2.out",
    });
  });

  /* ports: inputs feed the core, wires draw, outputs leave it */
  cascade(tl, at, qa(s, ".port-in"), 0.16, 0.03, 0.14, ...P("feed"));
  span(tl, at, 0.28, 0.42, q(s, ".port-core"), ...P("install"));
  cascade(tl, at, qa(s, ".port-wire"), 0.3, 0.02, 0.1, ...P("drawX"));
  cascade(tl, at, qa(s, ".port-out"), 0.34, 0.02, 0.1, ...P("emit"));

  /* boundary: the four edges close in order, then the nodes drop inside */
  span(tl, at, 0.12, 0.22, q(s, '.boundary-edge[data-edge="top"]'), ...P("drawX"));
  span(tl, at, 0.2, 0.3, q(s, '.boundary-edge[data-edge="right"]'), ...P("drawY"));
  span(tl, at, 0.28, 0.38, q(s, '.boundary-edge[data-edge="bottom"]'), ...P("drawX"));
  span(tl, at, 0.34, 0.44, q(s, '.boundary-edge[data-edge="left"]'), ...P("drawY"));
  cascade(tl, at, qa(s, ".boundary-node"), 0.24, 0.03, 0.14, { y: () => -0.05 * c.H(), opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out" });
  span(tl, at, 0.36, 0.46, q(s, ".boundary-caption"), ...P("rise"));

  /* chain: each state rises, its incoming edge draws just after the one before */
  const chain = qa(s, ".chain-node");
  if (chain.length) {
    const step = chain.length > 1 ? Math.min(0.05, (0.46 - 0.18 - 0.14) / (chain.length - 1)) : 0;
    chain.forEach((el, k) => {
      span(tl, at, 0.18 + step * k, 0.32 + step * k, el, ...P("rise"));
      if (k > 0) span(tl, at, 0.22 + step * (k - 1), 0.32 + step * (k - 1), q(el, ".chain-edge"), ...P("drawX"));
    });
    span(tl, at, 0.38, 0.46, q(s, ".chain-branches"), { opacity: 0 }, { opacity: 1, ease: "power1.out" });
  }

  /* columns: each column arrives from depth, then its items */
  cascade(tl, at, qa(s, ".viz-column"), 0.2, 0.05, 0.16, ...P("arrive"));
  cascade(tl, at, qa(s, ".viz-column li"), 0.28, 0.02, 0.1, ...P("rise"));

  /* the end card */
  span(tl, at, 0.14, 0.46, q(s, ".next-card"), { z: -200, scale: 0.9, rotationY: -10, transformPerspective: 1200 }, {
    z: 0,
    scale: 1,
    rotationY: 0,
    transformPerspective: 1200,
    ease: "power2.out",
  });
}

/* ---- per-kind exits used by more than one kind --------------------------- */

/** Visual items leave first-in first-out, against the travel. */
function itemsAway(tl: TL, at: At, items: Item[], { W }: Ctx, p0 = 0.58) {
  cascade(tl, at, items, p0, 0.03, 0.18, { x: 0, opacity: 1 }, { x: () => -0.04 * W(), opacity: 0, ease: "power2.in" });
}

const hasScreen = (s: HTMLElement) => Boolean(q(s, ".ps-stage3d .screen"));

/**
 * The near label (1.15×) reads only around rest: it fades in late in the
 * entrance and out early in the exit, so the fastest plane never crosses its
 * own scene's picture (I4). The wrapper keeps its rate; its label fades.
 */
export function nearLabel(tl: TL, s: HTMLElement, at: At) {
  const label = q(s, ".ps-near-label");
  span(tl, at, 0.3, 0.44, label, { opacity: 0 }, { opacity: 1, ease: "power1.out" });
  span(tl, at, 0.56, 0.66, label, { opacity: 1 }, { opacity: 0, ease: "power1.in" });
}

/* ---- the registry ------------------------------------------------------- */

export const CHOREO: Record<SceneKind, Choreo> = {
  /** Establishing shot, then a dolly out. Exit only: the load is CSS. */
  title(tl, s, at, c) {
    copyOut(tl, s, at, c);
    span(tl, at, 0.54, 0.92, q(s, ".ps-stage3d"), { scale: 1, z: 0, rotationY: 0 }, { scale: 0.88, z: -240, rotationY: 14, ease: "power1.in" });
    qa(s, ".viz-ribbon-word").forEach((w, k) =>
      span(tl, at, 0.54, 0.95, w, { x: 0 }, { x: () => -0.04 * c.W() * k, ease: "none" }),
    );
  },

  /** Fracture: calm first, the warnings last, then a push in. */
  problem(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    midIn(tl, s, at, c, { ry: -16, z: -200 });
    vizIn(tl, s, at, c);
    span(tl, at, 0.56, 0.9, q(s, ".ps-stage3d"), { scale: 1 }, { scale: 1.07, ease: "power2.in" });
    span(tl, at, 0.66, 0.9, q(s, ".ps-stage3d"), { opacity: 1 }, { opacity: 0, ease: "power1.in" });
  },

  /** Ensemble: people stand up, then disperse. */
  people(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    vizIn(tl, s, at, c, { tiles: "standUp" });
    const crowd = [...qa(s, ".viz-tile"), ...qa(s, ".viz-lane")];
    if (crowd.length) {
      crowd.forEach((el, k) =>
        span(tl, at, 0.58 + Math.min(0.016 * k, 0.1), 0.82 + Math.min(0.016 * k, 0.1), el, { x: 0, opacity: 1 }, {
          x: () => -0.02 * c.W() * (k + 1),
          opacity: 0,
          ease: "power2.in",
        }),
      );
    } else {
      midIn(tl, s, at, c);
      rackFocus(tl, s, at);
    }
  },

  /** Reveal: the biggest dolly on the page, then a rack focus. */
  intro(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    midIn(tl, s, at, c, { x: 0.1, z: -320, ry: 20, sc: 0.8 });
    vizIn(tl, s, at, c, { tiles: "install" });
    rackFocus(tl, s, at);
  },

  /** A real screen turns into frame; its shadow lags it. */
  interface(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    midIn(tl, s, at, c, { x: 0.1, z: -220, ry: -16 });
    span(tl, at, 0.2, 0.4, q(s, ".ps-shadow"), { opacity: 0 }, { opacity: 1, ease: "power1.out" });
    vizIn(tl, s, at, c);
    span(tl, at, 0.56, 0.9, q(s, ".ps-stage3d"), { rotationY: 0 }, { rotationY: 14, ease: "power2.in" });
    span(tl, at, 0.8, 0.92, q(s, ".ps-stage3d"), { opacity: 1 }, { opacity: 0, ease: "power1.in" });
  },

  /** Stations along the direction of travel; first in, first out. */
  walkthrough(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    vizIn(tl, s, at, c);
    const stations = qa(s, ".viz-station");
    if (stations.length) {
      stations.forEach((st, k) => {
        const o = Math.min(0.04 * k, 0.2);
        span(tl, at, 0.56 + o, 0.72 + o, st, { x: 0, opacity: 1 }, { x: () => -0.06 * c.W(), opacity: 0, ease: "power2.in" });
      });
      /* The rail fades as its stations leave (its origin is the left end, so a
         retracting scale would pull away from the stations). */
      span(tl, at, 0.56, 0.8, q(s, ".viz-rail"), { opacity: 1 }, { opacity: 0, ease: "power2.in" });
    } else {
      midIn(tl, s, at, c);
      rackFocus(tl, s, at);
    }
  },

  /** A contact sheet: items stand up by diagonal, leave by the reverse one. */
  features(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    vizIn(tl, s, at, c);
    const grid = qa(s, ".viz-grid-list > li[data-d]") as HTMLElement[];
    const cols = qa(s, ".viz-column");
    if (grid.length) {
      const dmax = Math.max(...grid.map((li) => Number(li.dataset.d) || 0));
      for (const li of grid) {
        const o = Math.min(0.04 * (dmax - (Number(li.dataset.d) || 0)), 0.18);
        span(tl, at, 0.58 + o, 0.74 + o, li, { z: 0, opacity: 1, transformPerspective: 900 }, {
          z: -120,
          opacity: 0,
          transformPerspective: 900,
          ease: "power2.in",
        });
      }
    } else if (cols.length) {
      cascade(tl, at, cols.reverse(), 0.58, 0.04, 0.2, { z: 0, opacity: 1, transformPerspective: 1200 }, {
        z: -120,
        opacity: 0,
        transformPerspective: 1200,
        ease: "power2.in",
      });
    } else {
      if (!entered.has(s)) midIn(tl, s, at, c);
      rackFocus(tl, s, at);
    }
  },

  /** Print: rows arrive under a scan line. A screen comes in from the other side. */
  output(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    if (hasScreen(s)) {
      midIn(tl, s, at, c, { x: -0.06, ry: 16 });
      vizIn(tl, s, at, c);
      span(tl, at, 0.56, 0.9, q(s, ".ps-stage3d"), { rotationY: 0 }, { rotationY: -14, ease: "power2.in" });
      span(tl, at, 0.8, 0.92, q(s, ".ps-stage3d"), { opacity: 1 }, { opacity: 0, ease: "power1.in" });
      return;
    }
    vizIn(tl, s, at, c);
    const rows = qa(s, ".viz-record");
    if (rows.length) itemsAway(tl, at, rows, c);
    else rackFocus(tl, s, at);
  },

  /** Montage: cases shear during the pan and are exactly placed at rest. */
  usecases(tl, s, at, c) {
    if (hasScreen(s)) {
      copy(tl, s, at, c, ITEM_BLOCKS);
      itemsIn(tl, s, at);
      itemsOut(tl, s, at, c);
      midIn(tl, s, at, c);
      vizIn(tl, s, at, c);
      rackFocus(tl, s, at);
      return;
    }
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    vizIn(tl, s, at, c);
    const cases = qa(s, ".viz-case");
    cases.forEach((el, k) => {
      rate(tl, at, el, 0.94 + 0.04 * k, c);
      span(tl, at, 0.7, 0.9, el, { opacity: 1 }, { opacity: 0, ease: "power1.in" });
    });
    if (!cases.length) {
      midIn(tl, s, at, c);
      rackFocus(tl, s, at);
    }
  },

  /** Flow-through: sources feed a core that emits outputs. */
  integrations(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    if (!q(s, ".port-in")) midIn(tl, s, at, c);
    vizIn(tl, s, at, c);
    span(tl, at, 0.6, 0.9, q(s, ".ps-stage3d"), { x: 0, opacity: 1 }, { x: () => -0.04 * c.W(), opacity: 0, ease: "power2.in" });
  },

  /** Chain of custody: a tracking shot along the states, each edge drawn
   * after the state before it; the states leave in the order they came. */
  governance(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    if (q(s, ".chain-node")) {
      entered.add(s);
      span(tl, at, 0.12, 0.46, q(s, ".ps-stage3d"), { x: () => 0.05 * c.W(), rotationY: 8 }, { x: 0, rotationY: 0, ease: "power2.out" });
    } else midIn(tl, s, at, c);
    vizIn(tl, s, at, c);
    itemsAway(tl, at, qa(s, ".chain-node"), c);
    rackFocus(tl, s, at);
  },

  /** A crane down onto the boundary as it closes around what runs inside
   * your infrastructure; then the contents settle out and the frame pulls focus. */
  deploy(tl, s, at, c) {
    copy(tl, s, at, c, ITEM_BLOCKS);
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    if (q(s, ".boundary-edge")) {
      entered.add(s);
      /* Pivots on the module's foot (transform-origin in app/stage.css). */
      span(tl, at, 0.12, 0.46, q(s, ".ps-stage3d"), { z: -120, rotationX: 14 }, { z: 0, rotationX: 0, ease: "power3.out" });
    } else if (!q(s, ".port-in, .chain-node")) midIn(tl, s, at, c);
    vizIn(tl, s, at, c);
    cascade(tl, at, qa(s, ".boundary-node"), 0.58, 0.03, 0.18, { y: 0, opacity: 1 }, { y: () => 0.04 * c.H(), opacity: 0, ease: "power2.in" });
    rackFocus(tl, s, at);
  },

  /** A title card: big type settles behind a centred statement. */
  value(tl, s, at, c) {
    copyIn(tl, s, at, c, ITEM_BLOCKS, 0.1);
    copyOut(tl, s, at, c, [...ITEM_BLOCKS, ".ps-h"]);
    span(tl, at, 0.56, 0.9, q(s, ".ps-h"), { x: 0 }, { x: () => -0.08 * c.W(), ease: "power2.in" });
    itemsIn(tl, s, at);
    itemsOut(tl, s, at, c);
    if (hasScreen(s)) midIn(tl, s, at, c, { ry: 0, x: 0, z: -220 });
    vizIn(tl, s, at, c, { tiles: "value" });
    cascade(tl, at, qa(s, ".viz-tile"), 0.62, 0.02, 0.24, { opacity: 1 }, { opacity: 0, ease: "power1.in" });
    if (hasScreen(s)) span(tl, at, 0.62, 0.86, q(s, ".ps-stage3d"), { opacity: 1 }, { opacity: 0, ease: "power1.in" });
  },

  /** Two-shot: question and answer arrive together, pair by pair. */
  faq(tl, s, at, c) {
    copy(tl, s, at, c, [...ITEM_BLOCKS, ".ps-faq"]);
    qa(s, ".ps-qa").forEach((qa_, k) => {
      const o = Math.min(0.04 * k, 0.14);
      span(tl, at, 0.18 + o, 0.32 + o, qa_, { x: () => 0.04 * c.W(), opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out" });
      span(tl, at, 0.58 + Math.min(0.03 * k, 0.12), 0.74 + Math.min(0.03 * k, 0.12), qa_, { x: 0, opacity: 1 }, {
        x: () => -0.03 * c.W(),
        opacity: 0,
        ease: "power2.in",
      });
    });
  },

  /** End card. Entrance only: the film ends and the page scrolls on. */
  next(tl, s, at, c) {
    copyIn(tl, s, at, c, [...ITEM_BLOCKS, ".ps-ctas"]);
    span(tl, at, 0.3, 0.44, q(s, ".ps-ctas"), ...P("rise"));
    vizIn(tl, s, at, c);
  },
};

/* ---- transitions: the incoming scene only (§4.8) ------------------------- */

export const ENTER: Partial<Record<Enter, Choreo>> = {
  /** Layer rates alone carry a pan. */
  pan() {},
  /** A push in. Kinds that gave their module no entrance of its own get one. */
  dolly(tl, s, at, c) {
    if (!entered.has(s)) midIn(tl, s, at, c, { x: 0.06, ry: 0 });
  },
  /**
   * Act change: the incoming scene arrives as a solid panel carrying the act's
   * name, which then wipes off to the right, its label riding it. The wipe
   * runs late in the entrance ([0.26, 0.46], not §4.8's [0.04, 0.38]): the
   * shutter travels with its scene, so an early wipe happens off-screen and
   * the act label is never seen.
   */
  wipe(tl, s, at) {
    span(tl, at, 0.26, 0.46, q(s, ".ps-shutter"), { xPercent: 0 }, { xPercent: 101, ease: "power2.inOut" });
  },
  /** The big type overtakes, then settles at the background rate. */
  type(tl, s, at, c) {
    const big = q(s, ".ps-bigtype");
    const dx = (r: number, p: number) => (p - 0.5) * 2 * c.W() * (1 - r);
    span(tl, at, 0, 0.46, big, { x: () => dx(1.35, 0) }, { x: 0, ease: "power1.out" });
    span(tl, at, 0.1, 0.46, big, { scale: 1.12 }, { scale: 1, ease: "power2.out" });
  },
};
