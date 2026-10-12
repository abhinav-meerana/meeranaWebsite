/**
 * The room geometry, its art direction and its camera framing.
 *
 * One source of truth for panel placement, so the scene and the tests agree on
 * the layout. Deliberately free of three.js: `fitRoom()` is plain vector maths,
 * so it runs in node (FINAL-SPEC §7.4, "pure and node-testable") and importing
 * this file never pulls the 3D chunk into the hero.
 *
 * WHY THIS IS NOT A FLAT TILTED PLANE
 * -----------------------------------
 * Depth in a real room needs three cues, and this file supplies all three:
 *   1. Genuine Z scatter   -> perspective makes far panels smaller.
 *   2. Haze by depth       -> far panels lose contrast and saturation.
 *   3. Light response      -> panel brightness follows its angle to the key light.
 * Cue 2 is the one a CSS transform can never produce.
 *
 * COMPOSITION
 * -----------
 * The copy owns the left of the hero, so the room is built to the RIGHT of it as
 * an ascending diagonal: the nearest panel sits low and close to the copy, and
 * each row beyond it steps further right, higher and deeper into haze.
 *
 * Six panels: two near, three mid, one far (four when the column is narrow).
 * The near row is dark UI only (FINAL-SPEC §7.3): a white capture in front
 * would outshine the H1, and dimming it to compensate is what made the near
 * panels look muddy. The light captures sit further back, behind haze and
 * their resting scrim.
 */

export type Band = "near" | "mid" | "far";

export type V3 = [number, number, number];

export type Panel = {
  /** Product slug, matching the media filenames. */
  product: string;
  /** Image path under /public. */
  src: string;
  /** Alt text: the human-readable name of the screen. */
  alt: string;
  /** Honest provenance label, per plan/13 §E1. */
  provenance: string;
  /** World position. x is across, y is height, z is depth (negative = away). */
  position: V3;
  /** Yaw in degrees. Panels face the camera but are not perfectly aligned. */
  yaw: number;
  /** Panel width in world units; height follows from the 16:10 aspect. */
  width: number;
  /** Which depth row this panel belongs to. */
  band: Band;
  /** Light-coloured UI: carries a resting scrim so it never outshines the H1. */
  lightUI?: boolean;
  /** Dropped when the room column is narrow (FINAL-SPEC §7.3). */
  optional?: boolean;
};

/** Aspect ratio of the room's product screenshots. */
export const PANEL_ASPECT = 16 / 10;

/** Below this column width the room drops wall-08 and the far panel. */
export const NARROW_COLUMN = 560;

/** The smallest column the live room is framed into; smaller gets the depth stack. */
export const MIN_WEBGL_COLUMN = { w: 440, h: 380 } as const;

/*
 * The diagonal. Each row steps right, up and back, and shrinks as it goes.
 *
 * Only three panels set the projected bbox: the Yisbir near screen (left and
 * bottom), Tasree3 (right) and the far panel (top). Their slots are unchanged
 * from the framing study in docs/r2, because the §7.4 expected-framing table
 * depends on them. The other three (AI in a Box near, PPE and alerts mid) sit
 * inside that hull, so they were moved to open the layers up: the PPE board
 * and the alerts panel now read beside the AI in a Box screen instead of
 * behind it, and the far panel shows above the alerts instead of as a sliver.
 * Overlap is kept on purpose: occlusion is itself a depth cue.
 */
const ROWS: Array<{
  band: Band;
  z: number;
  x: number;
  y: number;
  width: number;
  items: Array<{
    product: string;
    file: string;
    alt: string;
    provenance: string;
    /** Offsets from the row's base position. */
    dx: number;
    dy: number;
    yaw: number;
    lightUI?: boolean;
    optional?: boolean;
  }>;
}> = [
  {
    // Nearest row: the two dark-UI screens, each with its callout.
    band: "near",
    z: 2.0,
    x: 9.2,
    y: -2.0,
    width: 6.4,
    items: [
      {
        product: "yisbir",
        file: "wall-11-yisbir-fire-smoke.webp",
        alt: "Yisbir fire and smoke detection timeline",
        provenance: "Design concept · sample data",
        dx: -2.2,
        dy: -0.6,
        yaw: 14,
      },
      {
        product: "aibox",
        file: "wall-12-aibox-governance.webp",
        alt: "AI in a Box governance summary",
        provenance: "Product screen · demo data",
        dx: 2.4,
        dy: 1.6,
        yaw: -12,
      },
    ],
  },
  {
    // Middle row: stepped up and back. Tasree3's light capture sits on the
    // right, mostly behind the near row.
    band: "mid",
    z: -6.0,
    x: 12.4,
    y: 1.6,
    width: 5.6,
    items: [
      {
        product: "yisbir",
        file: "wall-01-yisbir-ppe-compliance.webp",
        alt: "Yisbir PPE compliance board, warehouse bay 3",
        provenance: "Design concept · sample data",
        dx: -2.8,
        dy: -1.0,
        yaw: 10,
      },
      {
        product: "yisbir",
        file: "wall-15-yisbir-alerts.webp",
        alt: "Yisbir alerts across all sites",
        provenance: "Design concept · sample data",
        dx: 0.6,
        dy: 1.0,
        yaw: -15,
        optional: true,
      },
      {
        product: "tasree3",
        file: "wall-02-tasree3-command-center.webp",
        alt: "Tasree3 Command Center",
        provenance: "Product screen · demo data",
        dx: 3.2,
        dy: -1.2,
        yaw: -20,
        lightUI: true,
      },
    ],
  },
  {
    // Far row: highest and deepest, one panel, dissolving into haze. The
    // Mandoobee phone mock-up is light UI with dark margins: in the mid row
    // those margins read as a black slab hiding the far panel; here the fog
    // takes them back into the page and the haze dims the white screen
    // further still. It and the top mid slot are the two dropped from a
    // narrow column (the §7.4 framing table depends on that pair).
    band: "far",
    z: -16.0,
    x: 16.0,
    y: 5.0,
    width: 5.0,
    items: [
      {
        product: "mandoobee",
        file: "wall-08-mandoobee-app.webp",
        alt: "Mandoobee workplace app",
        provenance: "App mock-up",
        dx: 0,
        dy: 0,
        yaw: -8,
        lightUI: true,
        optional: true,
      },
    ],
  },
];

/** Flattened panel list, derived from the rows above. */
export const PANELS: Panel[] = ROWS.flatMap((row) =>
  row.items.map((item) => ({
    product: item.product,
    src: `/media/v3/${item.file}`,
    alt: item.alt,
    provenance: item.provenance,
    position: [row.x + item.dx, row.y + item.dy, row.z] as V3,
    yaw: item.yaw,
    width: row.width,
    band: row.band,
    lightUI: item.lightUI,
    optional: item.optional,
  })),
);

/** The panel set for a room column of this width (px). */
export function panelsForColumn(width: number): Panel[] {
  return width < NARROW_COLUMN ? PANELS.filter((p) => !p.optional) : PANELS;
}

/** Display names for panel captions. */
export const PRODUCT_NAMES: Record<string, string> = {
  yisbir: "Yisbir",
  tasree3: "Tasree3",
  nazo: "Nazo",
  mandoobee: "Mandoobee",
  aibox: "AI in a Box",
  wasel: "Wasel",
};

/** The foreground callout text: "Yisbir · Design concept · sample data". */
export function calloutLabel(panel: Panel): string {
  return `${PRODUCT_NAMES[panel.product] ?? panel.product} · ${panel.provenance}`;
}

/** Depth range of the room, used by the haze ramp. */
export const NEAR_Z = 2.0;
export const FAR_Z = -16.0;

/**
 * The view direction the room was art-directed from: elevated and to the left,
 * so the colonnade recedes to the upper right. `fitRoom` keeps this direction
 * and solves only for distance, target and field of view.
 */
export const LOOK_AT: V3 = [11.6, 0.6, -5];
export const CAMERA_POS: V3 = [8.2, 5.6, 24];

/**
 * Haze ramp: 0 (no haze) at the front row, 1 (fully hazed) at the back row.
 * Slight ease-out so the mid row stays fully legible while the back row still
 * separates clearly from it.
 */
export function hazeAt(z: number): number {
  const t = (NEAR_Z - z) / (NEAR_Z - FAR_Z);
  return Math.min(1, Math.max(0, t)) ** 0.8;
}

/* ---- vector helpers (no three.js here, on purpose) ---------------------- */

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const normalize = (a: V3): V3 => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));
const clamp = (lo: number, v: number, hi: number) => Math.min(hi, Math.max(lo, v));
const DEG = Math.PI / 180;

/** Unit vector from the target towards the camera, as art-directed. */
export const VIEW_DIR: V3 = normalize(sub(CAMERA_POS, LOOK_AT));

/** The four world-space corners of each panel (yaw about Y, as three applies it). */
export function panelCorners(panels: Panel[]): V3[][] {
  return panels.map((p) => {
    const h = p.width / PANEL_ASPECT;
    const c = Math.cos(p.yaw * DEG);
    const s = Math.sin(p.yaw * DEG);
    return (
      [
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, -1],
      ] as const
    ).map(([u, v]) => {
      const lx = (u * p.width) / 2;
      const ly = (v * h) / 2;
      return [p.position[0] + lx * c, p.position[1] + ly, p.position[2] - lx * s] as V3;
    });
  });
}

/** A room column, or any rectangle, in canvas px. */
export type Rect = { l: number; t: number; r: number; b: number };

type View = {
  fov: number;
  fullW: number;
  fullH: number;
  offX: number;
  offY: number;
};

/**
 * Projects a world point to canvas px for a camera at `pos` looking at
 * `target` (up = +Y), using three's PerspectiveCamera + setViewOffset model:
 * the canvas is the (offX, offY, W, H) window of a fullW × fullH view.
 * Returns null for points at or behind the near plane.
 */
function projector(pos: V3, target: V3, v: View) {
  const fwd = normalize(sub(target, pos));
  const right = normalize(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  const tanHalf = Math.tan((v.fov * DEG) / 2);
  const aspect = v.fullW / v.fullH;
  return {
    right,
    up,
    project(p: V3): [number, number] | null {
      const d = sub(p, pos);
      const depth = dot(d, fwd);
      if (depth <= 1) return null;
      const xn = dot(d, right) / depth / (tanHalf * aspect);
      const yn = dot(d, up) / depth / tanHalf;
      return [((xn + 1) / 2) * v.fullW - v.offX, ((1 - yn) / 2) * v.fullH - v.offY];
    },
  };
}

function bboxOf(points: Array<[number, number] | null>): Rect | null {
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
  for (const p of points) {
    if (!p) return null;
    l = Math.min(l, p[0]);
    r = Math.max(r, p[0]);
    t = Math.min(t, p[1]);
    b = Math.max(b, p[1]);
  }
  return { l, t, r, b };
}

export type Fit = {
  fov: number;
  aspect: number;
  /** Arguments for camera.setViewOffset(fullW, fullH, x, y, W, H). */
  viewOffset: readonly [number, number, number, number, number, number];
  position: V3;
  target: V3;
  dist: number;
  /** Projected bbox of every panel corner, canvas px. */
  bbox: Rect;
  /** Projected width of the narrowest near panel, px. */
  nearW: number;
};

/** Inset kept between the panels and the column edge, as a share of its size. */
const COLUMN_INSET = 0.06;

/**
 * Frames the room into the visible column (FINAL-SPEC §7.4).
 *
 * The canvas is full-bleed, so the camera's optical centre is moved onto the
 * column's centre with a view offset, the field of view widens for tall
 * columns, and the distance is bisected so every panel corner lands inside the
 * column with a 6% inset. Five recentring passes shift the target in the camera
 * plane by the bbox-centre pixel error; a final bisect settles the distance.
 */
export function fitRoom(W: number, H: number, col: Rect, panels: Panel[]): Fit {
  const cw = col.r - col.l;
  const ch = col.b - col.t;
  const ca = cw / ch;
  const fov = clamp(30, 40 / Math.pow(ca, 0.35), 46);
  const xc = (col.l + col.r) / 2;
  const yc = (col.t + col.b) / 2;
  const fullW = 2 * Math.max(xc, W - xc);
  const offX = xc >= W / 2 ? 0 : fullW - W;
  const fullH = 2 * Math.max(yc, H - yc);
  const offY = yc >= H / 2 ? 0 : fullH - H;
  const view: View = { fov, fullW, fullH, offX, offY };

  const corners = panelCorners(panels).flat();
  // Start from the centre of the panels' world bounding box.
  const lo: V3 = [Infinity, Infinity, Infinity];
  const hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const c of corners) {
    for (let i = 0; i < 3; i++) {
      lo[i] = Math.min(lo[i], c[i]);
      hi[i] = Math.max(hi[i], c[i]);
    }
  }
  let target: V3 = mul(add(lo, hi), 0.5);

  const inset = {
    l: col.l + cw * COLUMN_INSET,
    r: col.r - cw * COLUMN_INSET,
    t: col.t + ch * COLUMN_INSET,
    b: col.b - ch * COLUMN_INSET,
  };
  const bboxAt = (d: number) => {
    const pr = projector(add(target, mul(VIEW_DIR, d)), target, view);
    return bboxOf(corners.map(pr.project));
  };
  const fits = (d: number) => {
    const bb = bboxAt(d);
    return !!bb && bb.l >= inset.l && bb.r <= inset.r && bb.t >= inset.t && bb.b <= inset.b;
  };
  const bisect = () => {
    let a = 8, z = 200;
    for (let k = 0; k < 40; k++) {
      const m = (a + z) / 2;
      if (fits(m)) z = m;
      else a = m;
    }
    return z;
  };

  let dist = 0;
  for (let pass = 0; pass < 6; pass++) {
    dist = bisect();
    const pos = add(target, mul(VIEW_DIR, dist));
    const pr = projector(pos, target, view);
    const bb = bboxOf(corners.map(pr.project));
    if (!bb) break;
    const ex = (bb.l + bb.r) / 2 - xc;
    const ey = (bb.t + bb.b) / 2 - yc;
    const k = (2 * dist * Math.tan((fov * DEG) / 2)) / fullH;
    target = add(target, add(mul(pr.right, ex * k), mul(pr.up, -ey * k)));
  }
  dist = bisect();

  const position = add(target, mul(VIEW_DIR, dist));
  const pr = projector(position, target, view);
  const bbox = bboxOf(corners.map(pr.project)) ?? { l: 0, t: 0, r: 0, b: 0 };
  const nearW = Math.min(
    ...panelCorners(panels.filter((p) => p.band === "near")).map((cs) => {
      const bb = bboxOf(cs.map(pr.project));
      return bb ? bb.r - bb.l : 0;
    }),
  );

  return {
    fov,
    aspect: fullW / fullH,
    viewOffset: [fullW, fullH, offX, offY, W, H] as const,
    position,
    target,
    dist,
    bbox,
    nearW,
  };
}

/** Exit pose: the camera flies 28% closer and drifts right (M-home-hero-03). */
export const EXIT_DOLLY = 0.28;
export const EXIT_SHIFT_X = 2;
/** Pointer orbit ceilings, degrees (M-home-hero-02). */
export const ORBIT_YAW = 4;
export const ORBIT_PITCH = 1.8;

/**
 * The camera pose for a fitted room, an exit progress p (0–1) and an orbit in
 * degrees around the target. Pure, so the rig and the tests share it.
 */
export function cameraPose(fit: Fit, p: number, yawDeg: number, pitchDeg: number) {
  const target: V3 = [fit.target[0] + EXIT_SHIFT_X * p, fit.target[1], fit.target[2]];
  const dist = fit.dist * (1 - EXIT_DOLLY * p);
  const az = Math.atan2(VIEW_DIR[0], VIEW_DIR[2]) + yawDeg * DEG;
  const el = Math.asin(VIEW_DIR[1]) + pitchDeg * DEG;
  const dir: V3 = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  return { position: add(target, mul(dir, dist)), target };
}
