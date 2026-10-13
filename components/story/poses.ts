/**
 * The story's choreography as data: where every screen is at every keyframe.
 *
 * Units: x in vw and y in vh from the stage centre, z in px (the stage has
 * `perspective: 1400px`), rotations in degrees, s = scale, o = opacity,
 * b = blur in px. The same tables feed the CSS first frame (custom properties
 * written into the markup, so the opening composition paints before any
 * JavaScript) and the GSAP timeline, so the hand-over is seamless.
 *
 * Keyframes:
 *   opening  "Complexity, Meet Clarity." — one focal screen, soft layers around
 *   reveal   the focal screen sharpens and comes forward, the layers part
 *   platforms  all six platforms in one arrangement behind the centred title
 *   p0…p6    the platforms come into focus in turn (Yisbir twice: operations,
 *            then video indexing); each previous one
 *            recedes to one side instead of vanishing
 *   capability  interface details gather around the centred message
 *   next     blur resolves, the six platforms start assembling
 *   universe the settled six-platform composition (pointer-reactive)
 */

export type Pose = {
  x: number;
  y: number;
  z: number;
  rx?: number;
  ry?: number;
  s: number;
  o: number;
  b: number;
};

export type Layout = "wide" | "narrow";

export const KEYS = ["opening", "reveal", "platforms", "p0", "p1", "p2", "p3", "p4", "p5", "p6", "capability", "next", "universe"] as const;
export type Key = (typeof KEYS)[number];

/** [transition into this keyframe, hold after it], in timeline units. */
export const SCHEDULE: Record<Key, [number, number]> = {
  opening: [0, 0.6],
  reveal: [1.0, 0.5],
  platforms: [1.0, 0.5],
  p0: [0.9, 0.4],
  p1: [0.6, 0.4],
  p2: [0.6, 0.4],
  p3: [0.6, 0.4],
  p4: [0.6, 0.4],
  p5: [0.6, 0.4],
  p6: [0.6, 0.45],
  capability: [1.0, 0.55],
  next: [1.0, 0.45],
  universe: [1.2, 0.9],
};

/** The scroll distance the story takes, in viewport heights. */
export const STORY_LENGTH: Record<Layout, number> = { wide: 7.4, narrow: 5.9 };

/** The six platforms (the "six" arrangement, the ring and the universe). */
export const PRODUCT_KEYS = ["mandoobee", "tasree3", "nazo", "yisbir", "wasel", "ai-in-a-box"] as const;
/** The focus order of the product beats p0…p6: Yisbir has two screens. */
export const FOCUS_SEQ = ["mandoobee", "tasree3", "nazo", "yisbir", "yisbir-index", "wasel", "ai-in-a-box"] as const;
export const DETAIL_KEYS = ["d-conformance", "d-alerts", "d-ppe", "d-governance", "d-contract", "d-gate"] as const;

/** The opening's focal screen and the universe's centre. On a phone the AI in
 *  a Box assistant is mostly text, so the narrow layout opens on Yisbir's
 *  operations dashboard instead. */
export const FOCAL: Record<Layout, string> = { wide: "ai-in-a-box", narrow: "yisbir" };

/* ---------------------------------------------------------------- wide -- */

const W = {
  hidden: { x: 0, y: 20, z: -1100, s: 0.8, o: 0, b: 12 } as Pose,
  focus: { x: 0, y: 17, z: 60, s: 0.86, o: 1, b: 0 } as Pose,
  /* Lower than centre and tipped back, so the headline overlaps only its top
     edge and most of the interface reads, softly, below the lede. */
  openingFocal: { x: 0, y: 19, z: -90, rx: 16, s: 0.92, o: 1, b: 1.2 } as Pose,
  /** Receded platforms, by how many steps ago they were in focus. side: −1 left, 1 right. */
  recede: (level: number, side: number): Pose => {
    if (level === 1) return { x: side * 34, y: 8, z: -380, ry: -side * 18, s: 0.62, o: 0.6, b: 4 };
    if (level === 2) return { x: side * 43, y: -8, z: -640, ry: -side * 22, s: 0.56, o: 0.32, b: 8 };
    /* Fully out: a layer at 12 % opacity still costs a blurred composite
       every frame, for almost nothing on screen. */
    return { x: side * 48, y: -22, z: -900, ry: -side * 24, s: 0.52, o: 0, b: 11 };
  },
  detail: {
    opening: {
      "d-conformance": { x: -34, y: -24, z: -460, ry: 18, rx: -4, s: 0.74, o: 0.5, b: 10 },
      "d-alerts": { x: 32, y: 23, z: -200, ry: -16, s: 0.66, o: 0.72, b: 5 },
      "d-ppe": { x: -31, y: 22, z: -240, ry: 16, s: 0.62, o: 0.7, b: 6 },
      "d-governance": { x: 35, y: -25, z: -420, ry: -18, rx: -4, s: 0.7, o: 0.5, b: 9 },
      "d-contract": { x: 50, y: 0, z: -600, ry: -26, s: 0.62, o: 0.35, b: 10 },
      "d-gate": { x: -50, y: -1, z: -580, ry: 26, s: 0.6, o: 0.35, b: 10 },
    },
    reveal: {
      "d-conformance": { x: -44, y: -28, z: -560, ry: 20, rx: -4, s: 0.7, o: 0.36, b: 12 },
      "d-alerts": { x: 42, y: 28, z: -300, ry: -18, s: 0.62, o: 0.5, b: 7 },
      "d-ppe": { x: -41, y: 27, z: -320, ry: 18, s: 0.6, o: 0.5, b: 7 },
      "d-governance": { x: 45, y: -29, z: -520, ry: -20, rx: -4, s: 0.66, o: 0.36, b: 11 },
      "d-contract": { x: 58, y: 2, z: -700, ry: -28, s: 0.6, o: 0.22, b: 12 },
      "d-gate": { x: -58, y: 1, z: -680, ry: 28, s: 0.6, o: 0.22, b: 12 },
    },
    capability: {
      "d-conformance": { x: -31, y: -21, z: -40, ry: 14, rx: -3, s: 0.46, o: 1, b: 0 },
      "d-governance": { x: 31, y: -22, z: -60, ry: -14, rx: -3, s: 0.44, o: 1, b: 0 },
      "d-ppe": { x: -33, y: 23, z: -20, ry: 12, rx: 3, s: 0.44, o: 1, b: 0 },
      "d-alerts": { x: 32, y: 24, z: 0, ry: -12, rx: 3, s: 0.46, o: 1, b: 0 },
      "d-contract": { x: 0, y: 38, z: -260, rx: 8, s: 0.5, o: 0.55, b: 2 },
      "d-gate": { x: 0, y: -38, z: -300, rx: -8, s: 0.46, o: 0.45, b: 2 },
    },
  } as Record<"opening" | "reveal" | "capability", Record<string, Pose>>,
  /** "Six platforms": all six at once, around the centred title. */
  six: {
    mandoobee: { x: -32, y: -20, z: -420, ry: 14, s: 0.5, o: 0.75, b: 3 },
    tasree3: { x: 0, y: -25, z: -520, s: 0.5, o: 0.7, b: 4 },
    nazo: { x: 32, y: -20, z: -420, ry: -14, s: 0.5, o: 0.75, b: 3 },
    yisbir: { x: -32, y: 22, z: -300, ry: 14, s: 0.5, o: 0.85, b: 2 },
    wasel: { x: 0, y: 27, z: -380, s: 0.5, o: 0.85, b: 2 },
    "ai-in-a-box": { x: 32, y: 22, z: -300, ry: -14, s: 0.5, o: 0.85, b: 2 },
  } as Record<string, Pose>,
  /** Platforms during the capability beat: they withdraw into the depth and
   *  fade out, so the interface details own the frame. */
  ring: {
    mandoobee: { x: -47, y: -30, z: -1000, s: 0.5, o: 0, b: 11 },
    tasree3: { x: 47, y: -31, z: -1000, s: 0.5, o: 0, b: 11 },
    nazo: { x: -50, y: 30, z: -1000, s: 0.5, o: 0, b: 11 },
    yisbir: { x: 50, y: 31, z: -1000, s: 0.5, o: 0, b: 11 },
    wasel: { x: 0, y: -40, z: -1000, s: 0.5, o: 0, b: 11 },
    "ai-in-a-box": { x: 0, y: 42, z: -1000, s: 0.5, o: 0, b: 11 },
  } as Record<string, Pose>,
  /** The six-platform universe. The focal screen is the opening's, so the
   *  story ends where it began. */
  universe: {
    "ai-in-a-box": { x: 0, y: 21, z: 40, rx: 4, s: 0.62, o: 1, b: 0 },
    yisbir: { x: -30, y: 10, z: -260, ry: 22, rx: 3, s: 0.48, o: 1, b: 0 },
    tasree3: { x: 30, y: 9, z: -300, ry: -22, rx: 3, s: 0.48, o: 1, b: 0 },
    mandoobee: { x: -36, y: 30, z: -80, ry: 18, rx: -4, s: 0.38, o: 1, b: 0 },
    nazo: { x: 36, y: 30, z: -100, ry: -18, rx: -4, s: 0.38, o: 1, b: 0 },
    wasel: { x: 0, y: 6, z: -640, s: 0.5, o: 0.9, b: 0 },
  } as Record<string, Pose>,
};

/* -------------------------------------------------------------- narrow -- */

const N = {
  hidden: { x: 0, y: 22, z: -900, s: 0.85, o: 0, b: 4 } as Pose,
  focus: { x: 0, y: 16, z: 40, s: 1, o: 1, b: 0 } as Pose,
  openingFocal: { x: 0, y: 20, z: -80, rx: 14, s: 0.98, o: 1, b: 0.8 } as Pose,
  recede: (level: number, side: number): Pose => {
    if (level === 1) return { x: side * 30, y: 31, z: -360, ry: -side * 14, s: 0.7, o: 0.45, b: 2 };
    if (level === 2) return { x: side * 36, y: 42, z: -600, ry: -side * 16, s: 0.6, o: 0.18, b: 3 };
    return { x: side * 40, y: 46, z: -800, s: 0.55, o: 0, b: 3 };
  },
  detail: {
    opening: {
      "d-conformance": { x: -40, y: -26, z: -400, ry: 14, s: 0.8, o: 0.45, b: 3 },
      "d-alerts": { x: 38, y: 26, z: -220, ry: -12, s: 0.72, o: 0.6, b: 2 },
      "d-ppe": { x: -36, y: 31, z: -300, ry: 12, s: 0.7, o: 0.5, b: 2 },
    },
    reveal: {
      "d-conformance": { x: -48, y: -34, z: -500, ry: 16, s: 0.76, o: 0.28, b: 3 },
      "d-alerts": { x: 46, y: 36, z: -300, ry: -14, s: 0.7, o: 0.36, b: 2 },
      "d-ppe": { x: -44, y: 40, z: -380, ry: 14, s: 0.68, o: 0.3, b: 2 },
    },
    capability: {
      "d-conformance": { x: -14, y: -31, z: -40, ry: 8, s: 0.66, o: 1, b: 0 },
      "d-alerts": { x: 16, y: 29, z: -20, ry: -8, s: 0.66, o: 1, b: 0 },
      "d-ppe": { x: -22, y: 41, z: -220, ry: 10, s: 0.6, o: 0.55, b: 1 },
    },
  } as Record<"opening" | "reveal" | "capability", Record<string, Pose>>,
  six: {
    mandoobee: { x: -24, y: -31, z: -380, ry: 10, s: 0.5, o: 0.7, b: 1.5 },
    tasree3: { x: 24, y: -29, z: -420, ry: -10, s: 0.5, o: 0.7, b: 1.5 },
    nazo: { x: -26, y: 26, z: -320, ry: 10, s: 0.5, o: 0.8, b: 1 },
    yisbir: { x: 26, y: 28, z: -300, ry: -10, s: 0.5, o: 0.8, b: 1 },
    wasel: { x: -12, y: 41, z: -460, s: 0.46, o: 0.6, b: 1.5 },
    "ai-in-a-box": { x: 14, y: -41, z: -480, s: 0.46, o: 0.6, b: 1.5 },
  } as Record<string, Pose>,
  ring: Object.fromEntries(PRODUCT_KEYS.map((k, i) => [k, { x: (i % 2 ? 1 : -1) * 46, y: i < 3 ? -40 : 44, z: -900, s: 0.55, o: 0, b: 3 }])) as Record<string, Pose>,
  universe: {
    yisbir: { x: 0, y: 20, z: 60, rx: 5, s: 0.82, o: 1, b: 0 },
    "ai-in-a-box": { x: -30, y: 8, z: -300, ry: 20, rx: 3, s: 0.56, o: 1, b: 0 },
    tasree3: { x: 30, y: 7, z: -320, ry: -20, rx: 3, s: 0.56, o: 1, b: 0 },
    mandoobee: { x: -26, y: 35, z: -120, ry: 16, rx: -4, s: 0.5, o: 1, b: 0 },
    nazo: { x: 26, y: 36, z: -140, ry: -16, rx: -4, s: 0.5, o: 1, b: 0 },
    wasel: { x: 0, y: 4, z: -640, s: 0.6, o: 0.85, b: 0 },
  } as Record<string, Pose>,
};

const SET = { wide: W, narrow: N };

const pushBack = (p: Pose, dz: number, o: number, b?: number): Pose => ({ ...p, z: p.z - dz, o, b: b ?? p.b });

/** Where screen `key` is at keyframe `k` in `layout`. */
export function poseAt(layout: Layout, key: string, k: Key): Pose {
  const S = SET[layout];
  const product = (FOCUS_SEQ as readonly string[]).indexOf(key);

  if (product >= 0) {
    /* A second screen of a platform (Yisbir's video indexing) appears only
       in its own beat; the arrangements show one screen per platform. */
    const extra = !(PRODUCT_KEYS as readonly string[]).includes(key);
    if (k === "opening") return key === FOCAL[layout] ? S.openingFocal : S.hidden;
    if (k === "reveal") return key === FOCAL[layout] ? S.focus : S.hidden;
    if (k === "platforms") return extra ? S.hidden : S.six[key];
    if (extra && (k === "capability" || k === "next" || k === "universe")) return { ...S.hidden, o: 0 };
    if (k.startsWith("p")) {
      const active = Number(k.slice(1));
      if (product === active) return S.focus;
      if (product > active) return S.hidden;
      /* Alternate sides so consecutive platforms never stack on each other. */
      return S.recede(active - product, product % 2 === 0 ? -1 : 1);
    }
    if (k === "capability") return S.ring[key];
    const u = S.universe[key];
    if (k === "next") return pushBack(u, 380, layout === "wide" ? 0.55 : 0.5, layout === "wide" ? 4 : 1.5);
    return u;
  }

  /* Details. Narrow layouts carry only three of them. */
  const table = S.detail;
  const open = table.opening[key];
  if (!open) return { ...S.hidden, o: 0 };
  if (k === "opening") return open;
  const reveal = table.reveal[key];
  if (k === "reveal") return reveal;
  if (k === "platforms") return pushBack(reveal, 300, 0);
  if (k.startsWith("p")) return pushBack(reveal, 360, 0);
  if (k === "capability") return table.capability[key];
  /* Leave by fading back, without animating blur (cheaper, and invisible). */
  return pushBack(table.capability[key], 520, 0);
}

/** Pointer tilt strength at each keyframe (0 = none, 1 = the universe's). */
export const TILT: Record<Key, number> = {
  opening: 0.35,
  reveal: 0.3,
  platforms: 0.35,
  p0: 0.25,
  p1: 0.25,
  p2: 0.25,
  p3: 0.25,
  p4: 0.25,
  p5: 0.25,
  p6: 0.25,
  capability: 0.4,
  next: 0.6,
  universe: 1,
};

/** CSS custom properties for a pose (the first frame and the static universe). */
export function poseVars(p: Pose, suffix = ""): Record<string, string> {
  return {
    [`--x${suffix}`]: String(p.x),
    [`--y${suffix}`]: String(p.y),
    [`--z${suffix}`]: String(p.z),
    [`--rx${suffix}`]: String(p.rx ?? 0),
    [`--ry${suffix}`]: String(p.ry ?? 0),
    [`--s${suffix}`]: String(p.s),
    [`--o${suffix}`]: String(p.o),
    [`--b${suffix}`]: String(p.b),
  };
}
