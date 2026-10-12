"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { MQ } from "@/lib/breakpoints";
import { SCENE } from "@/lib/scene-colors";
import {
  CAMERA_POS,
  NARROW_COLUMN,
  ORBIT_PITCH,
  ORBIT_YAW,
  PANEL_ASPECT,
  calloutLabel,
  cameraPose,
  fitRoom,
  hazeAt,
  panelsForColumn,
  type Fit,
  type Panel,
  type Rect,
} from "./room-layout";

/* ============================================================================
   The isometric room (FINAL-SPEC §7.3–7.5).

   Three planes in one canvas, each moving at its own rate under the camera:
     · background: an isometric lattice floor and a faint back wall, drawn as
       hairline LineSegments (the brand's ±30° geometry, not a square grid),
       plus the far panel dissolving into fog;
     · midground: three product screens one step back;
     · foreground: the two dark-UI screens, each with a DOM callout carrying its
       provenance, positioned from the projected panel corner every frame.

   The camera is framed from the visible column (room-layout.ts `fitRoom`), so
   nothing is cropped by the viewport edge or crosses the copy.

   It renders on demand: a frame is drawn only while something moves (the
   entrance, the pointer orbit settling, the scroll exit). At rest the room
   costs nothing, and nothing moves on its own, so there is no autoplaying
   motion to pause (WCAG 2.2.2).

   Deliberately absent: bloom, chromatic aberration, colour cycling, fast camera
   moves, ambient drift.
   ========================================================================== */

const DEG = Math.PI / 180;
/** Entrance: each row settles forward from this much further back (world units). */
const ENTER_DEPTH = 2.2;
/** Scroll exit: the near panels open outward by this much (degrees). */
const EXIT_YAW = 8;
/** Callouts are gone by this share of the exit. */
const CALLOUT_EXIT = 0.3;

/** The floor plane, just below the lowest panel, so the screens stand over
    it rather than float far above it. */
const FLOOR_Y = -5;
/** The back wall's depth (§7.3). */
const WALL_Z = -30;
/** Lattice pitch: two world units between parallel hairlines. */
const LATTICE_PITCH = 2;

export type RoomApi = {
  /** Scroll-exit progress 0–1, written by Hero's ScrollTrigger (M-home-hero-03). */
  setProgress: (p: number) => void;
};

/** Every animated value in the room, 0 → 1. GSAP tweens this object. */
type Motion = {
  floor: number;
  far: number;
  mid: number;
  near: number;
  callouts: number;
  exit: number;
};

const AT_REST: Omit<Motion, "exit"> = { floor: 1, far: 1, mid: 1, near: 1, callouts: 1 };

type PanelRec = {
  panel: Panel;
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  /** Resting opacity. */
  opacity: number;
  /** Near row only: -1 for the left panel, +1 for the right; 0 otherwise. */
  side: number;
};

/** Shared, mutable scene state. Written by effects and GSAP; read in one useFrame. */
type Stage = {
  motion: Motion;
  recs: PanelRec[];
  lattice: THREE.ShaderMaterial[];
  fit: Fit | null;
  /** The column the room is framed into; callouts are kept inside it. */
  col: Rect | null;
  callouts: Array<HTMLSpanElement | null>;
  /** Callout widths, measured once per framing so the frame loop never reads layout. */
  calloutW: number[];
  host: HTMLElement | null;
  pointer: { x: number; y: number };
  orbit: { x: number; y: number };
  reduced: boolean;
  invalidate: () => void;
};

/* ---- background: the lattice --------------------------------------------- */

const LATTICE_VERT = /* glsl */ `
attribute float aT;
varying float vT;
#include <fog_pars_vertex>
void main() {
  vT = aT;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

/* aT runs 0 at the near edge to 1 at the far edge. Alpha holds through the
   first quarter, then eases to nothing at the far edge; uReveal is the
   assembly front that sweeps from the near edge back (the page's signature
   motion), with a soft leading edge. */
const LATTICE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uAlpha;
uniform float uReveal;
varying float vT;
#include <fog_pars_fragment>
void main() {
  float a = uAlpha * (1.0 - smoothstep(0.25, 1.0, vT)) * (1.0 - smoothstep(uReveal - 0.18, uReveal, vT));
  gl_FragColor = vec4(uColor, a);
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

/**
 * Two hairline families at ±30°, clipped to the rectangle [a0,a1] × [b0,b1] of
 * a plane. `toWorld` maps plane coordinates to world space; `aT` is the fade
 * coordinate along b. At most `max` segments per family (§7.3: ≤150).
 */
function latticeGeometry(
  [a0, a1]: [number, number],
  [b0, b1]: [number, number],
  toWorld: (a: number, b: number) => [number, number, number],
  max = 150,
): THREE.BufferGeometry {
  const pos: number[] = [];
  const fade: number[] = [];
  const c = Math.cos(30 * DEG);
  const s30 = Math.sin(30 * DEG);
  for (const s of [1, -1]) {
    const dir = [c, s * s30];
    const n = [-s * s30, c];
    const proj = [
      [a0, b0],
      [a1, b0],
      [a0, b1],
      [a1, b1],
    ].map(([a, b]) => n[0] * a + n[1] * b);
    const kMin = Math.ceil(Math.min(...proj) / LATTICE_PITCH);
    const kMax = Math.floor(Math.max(...proj) / LATTICE_PITCH);
    let count = 0;
    for (let k = kMin; k <= kMax && count < max; k++) {
      const p0 = [n[0] * k * LATTICE_PITCH, n[1] * k * LATTICE_PITCH];
      // Liang–Barsky: clip p0 + t·dir to the rectangle.
      let tMin = -Infinity;
      let tMax = Infinity;
      const bounds: Array<[number, number]> = [
        [a0, a1],
        [b0, b1],
      ];
      bounds.forEach(([lo, hi], i) => {
        const t1 = (lo - p0[i]) / dir[i];
        const t2 = (hi - p0[i]) / dir[i];
        tMin = Math.max(tMin, Math.min(t1, t2));
        tMax = Math.min(tMax, Math.max(t1, t2));
      });
      if (tMax - tMin < 1e-3) continue;
      for (const t of [tMin, tMax]) {
        const a = p0[0] + t * dir[0];
        const b = p0[1] + t * dir[1];
        pos.push(...toWorld(a, b));
        fade.push((b - b0) / (b1 - b0));
      }
      count++;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(fade, 1));
  return g;
}

function latticeMaterial(alpha: number): THREE.ShaderMaterial {
  const m = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uColor: { value: new THREE.Color(SCENE.lattice) },
        uAlpha: { value: 0 },
        uReveal: { value: 0 },
      },
    ]),
    vertexShader: LATTICE_VERT,
    fragmentShader: LATTICE_FRAG,
    transparent: true,
    depthWrite: false,
    fog: true,
    toneMapped: false,
  });
  m.userData.alpha = alpha;
  return m;
}

/**
 * Background plane. The floor fades with depth and is gone by 60% of it
 * (§7.3); the back wall at z −30 is a whisper at α 0.05, fading upward. No
 * solid floor and no shadow pass: from this camera the key light's shadows
 * fall behind the screens that cast them, so they cost a pass and showed
 * nothing. The hairlines alone give perspective something to measure against.
 */
function Lattice({ stage }: { stage: Stage }) {
  const parts = useMemo(() => {
    /* The floor starts just in front of the canvas's lower edge (z ≈ +1.5 at
       every fitted size) and is gone by 60% of its depth, which lands on the
       back wall: lines never pass behind it. */
    const zNear = 4;
    const cut = WALL_Z;
    const floor = latticeGeometry([-34, 62], [-zNear, -cut], (a, b) => [a, FLOOR_Y, -b]);
    const wall = latticeGeometry([-34, 62], [FLOOR_Y, FLOOR_Y + 30], (a, b) => [a, b, WALL_Z]);
    return {
      floor: { geometry: floor, material: latticeMaterial(0.35) },
      wall: { geometry: wall, material: latticeMaterial(0.05) },
    };
  }, []);

  useLayoutEffect(() => {
    const mats = [parts.floor.material, parts.wall.material];
    stage.lattice.push(...mats);
    stage.invalidate();
    return () => {
      stage.lattice = stage.lattice.filter((m) => !mats.includes(m));
      for (const p of [parts.floor, parts.wall]) {
        p.geometry.dispose();
        p.material.dispose();
      }
    };
  }, [parts, stage]);

  return (
    <>
      <lineSegments geometry={parts.floor.geometry} material={parts.floor.material} />
      <lineSegments geometry={parts.wall.geometry} material={parts.wall.material} />
    </>
  );
}

/* ---- mid and foreground: the panels -------------------------------------- */

function RoomPanel({
  panel,
  side,
  stage,
  onLoaded,
}: {
  panel: Panel;
  side: number;
  stage: Stage;
  onLoaded: (src: string) => void;
}) {
  const texture = useTexture(panel.src);
  const mesh = useRef<THREE.Mesh>(null);
  const height = panel.width / PANEL_ASPECT;
  const haze = hazeAt(panel.position[2]);

  /* The screenshots are UI captures, so they keep their own contrast rather
     than inheriting the scene's tone mapping. */
  const map = useMemo(() => {
    const t = texture.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [texture]);

  /* Haze is baked into the material colour (and the fog), so distant panels
     genuinely lose contrast and drift toward the page navy. Not into opacity:
     a see-through panel ghosts the one behind it. Light-UI captures keep a
     resting scrim so nothing on the page is brighter than the H1; the dark-UI
     near row needs none (§7.3: near-row scrim ≤0.2). Opacity is used only for
     the entrance fade. */
  const { material, opacity } = useMemo(() => {
    const scrim = panel.lightUI ? 0.42 : 0;
    const brightness = (1 - 0.3 * haze) * (1 - scrim);
    return {
      opacity: 1,
      material: new THREE.MeshStandardMaterial({
        map,
        roughness: 0.6,
        metalness: 0.03,
        color: new THREE.Color().setHSL(0.58, 0.36 * haze, brightness),
        transparent: true,
        opacity: 0,
      }),
    };
  }, [map, haze, panel.lightUI]);

  useLayoutEffect(() => {
    const el = mesh.current;
    if (!el) return;
    el.visible = false;
    const rec: PanelRec = { panel, mesh: el, material, opacity, side };
    stage.recs.push(rec);
    onLoaded(panel.src);
    stage.invalidate();
    return () => {
      stage.recs = stage.recs.filter((r) => r !== rec);
    };
  }, [panel, material, opacity, side, stage, onLoaded]);

  useEffect(
    () => () => {
      material.dispose();
      map.dispose();
    },
    [material, map],
  );

  return (
    <mesh ref={mesh} position={panel.position} rotation={[0, panel.yaw * DEG, 0]}>
      <planeGeometry args={[panel.width, height]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ---- camera -------------------------------------------------------------- */

/**
 * Frames the camera from the column whenever the canvas or the column changes:
 * field of view, view offset, distance and fog all come from `fitRoom`. Writes
 * the result onto `.hero-room` for the tests (H-03).
 */
function Framing({ frame, panels, stage }: { frame: Rect; panels: Panel[]; stage: Stage }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const invalidate = useThree((s) => s.invalidate);
  const { l, t, r, b } = frame;

  useLayoutEffect(() => {
    if (!width || !height) return;
    const fit = fitRoom(width, height, { l, t, r, b }, panels);
    stage.fit = fit;
    stage.col = { l, t, r, b };
    stage.calloutW = []; // re-measured on the next frame
    camera.fov = fit.fov;
    camera.aspect = fit.aspect;
    camera.setViewOffset(...fit.viewOffset);
    const pose = cameraPose(fit, stage.motion.exit, 0, 0);
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
    camera.updateProjectionMatrix();
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = 1.1 * fit.dist;
      scene.fog.far = 2.6 * fit.dist;
    }
    const host = stage.host;
    if (host) {
      const px = (n: number) => String(Math.round(n));
      host.dataset.col = [l, t, r, b].map(px).join(",");
      host.dataset.bbox = [fit.bbox.l, fit.bbox.t, fit.bbox.r, fit.bbox.b].map(px).join(",");
      host.dataset.near = px(fit.nearW);
      host.dataset.fov = fit.fov.toFixed(1);
    }
    invalidate();
  }, [camera, scene, width, height, l, t, r, b, panels, stage, invalidate]);

  return null;
}

/**
 * The one writer per frame: camera orbit and exit, panel entrance and exit,
 * lattice assembly, callout positions. One useFrame keeps the order fixed
 * (camera before projection) regardless of which panels have loaded.
 */
function Director({ stage }: { stage: Stage }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const v = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    stage.invalidate = invalidate;
    invalidate();
  }, [stage, invalidate]);

  useFrame((state, delta) => {
    const fit = stage.fit;
    if (!fit) return;
    const m = stage.motion;

    // Pointer orbit, exponentially damped so it feels the same at 60 and 120 Hz.
    // The delta is clamped: on demand, the first frame after a rest is late.
    const want = stage.reduced ? { x: 0, y: 0 } : stage.pointer;
    const k = 1 - Math.exp(-Math.min(delta, 1 / 30) * 4);
    const o = stage.orbit;
    o.x += (want.x - o.x) * k;
    o.y += (want.y - o.y) * k;
    const settled = Math.abs(want.x - o.x) < 1e-3 && Math.abs(want.y - o.y) < 1e-3;
    if (settled) {
      o.x = want.x;
      o.y = want.y;
    }
    const pose = cameraPose(fit, m.exit, o.x * ORBIT_YAW, -o.y * ORBIT_PITCH);
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
    camera.updateMatrixWorld();

    for (const rec of stage.recs) {
      const t = m[rec.panel.band];
      rec.mesh.position.z = rec.panel.position[2] - (1 - t) * ENTER_DEPTH;
      rec.mesh.rotation.y = (rec.panel.yaw - rec.side * EXIT_YAW * m.exit) * DEG;
      rec.material.opacity = rec.opacity * t;
      rec.mesh.visible = t > 0.01;
    }

    for (const mat of stage.lattice) {
      mat.uniforms.uAlpha.value = mat.userData.alpha * Math.min(1, m.floor * 2);
      mat.uniforms.uReveal.value = m.floor * 1.2;
    }

    // Callouts sit on each near panel's top-left corner, lifted 6px on entry.
    // A label wider than the room's right margin slides left along the
    // panel's top edge, so it never leaves the column (or reaches the
    // viewport edge) at narrow laptop widths.
    const shown = m.callouts * (1 - Math.min(1, m.exit / CALLOUT_EXIT));
    const { width, height } = state.size;
    for (const rec of stage.recs) {
      if (!rec.side) continue;
      const i = rec.side < 0 ? 0 : 1;
      const el = stage.callouts[i];
      if (!el) continue;
      rec.mesh.updateMatrixWorld();
      v.set(-rec.panel.width / 2, rec.panel.width / PANEL_ASPECT / 2, 0)
        .applyMatrix4(rec.mesh.matrixWorld)
        .project(camera);
      let x = ((v.x + 1) / 2) * width;
      const col = stage.col;
      if (col) {
        const w = stage.calloutW[i] || (stage.calloutW[i] = el.offsetWidth);
        x = Math.max(col.l, Math.min(x, col.r - w));
      }
      const y = ((1 - v.y) / 2) * height + (1 - m.callouts) * 6;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = shown.toFixed(3);
    }

    if (!settled) invalidate();
  });

  return null;
}

/** Scene lighting. One key, one fill, one rim. */
function Lights() {
  return (
    <>
      {/* Key light, up and to the left of the viewer: panel brightness
          follows each screen's angle to it. */}
      <directionalLight position={[-10, 18, 16]} intensity={2.2} color={SCENE.key} />
      {/* Cool fill from the opposite side so shadow sides are not black. */}
      <directionalLight position={[20, 8, -6]} intensity={0.65} color={SCENE.fill} />
      {/* Brand cyan rim, tying the room to the palette. */}
      <pointLight position={[6, 2, 14]} intensity={60} color={SCENE.cyan} distance={50} decay={2} />
      <ambientLight intensity={0.5} color={SCENE.ambient} />
    </>
  );
}

export type RoomProps = {
  /** The visible room column, in canvas px (Hero measures it). */
  frame: Rect;
  /** Called once, when the first panel set has decoded. */
  onReady?: () => void;
  /** The WebGL context was lost: the parent swaps in the depth stack. */
  onLost?: () => void;
  /** Receives the room's imperative API (scroll exit). */
  apiRef?: MutableRefObject<RoomApi | null>;
};

export default function Room({ frame, onReady, onLost, apiRef }: RoomProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(() => window.matchMedia(MQ.reduced).matches);
  const [degraded, setDegraded] = useState(false);
  const narrow = frame.r - frame.l < NARROW_COLUMN;
  const panels = useMemo(() => panelsForColumn(narrow ? 0 : NARROW_COLUMN), [narrow]);
  const near = useMemo(() => panels.filter((p) => p.band === "near"), [panels]);

  const [stage] = useState<Stage>(() => ({
    motion: reduced ? { ...AT_REST, exit: 0 } : { floor: 0, far: 0, mid: 0, near: 0, callouts: 0, exit: 0 },
    recs: [],
    lattice: [],
    fit: null,
    col: null,
    callouts: [],
    calloutW: [],
    host: null,
    pointer: { x: 0, y: 0 },
    orbit: { x: 0, y: 0 },
    reduced,
    invalidate: () => {},
  }));

  const entrance = useRef<{ progress: (p: number) => unknown; kill: () => unknown } | null>(null);
  const loaded = useRef(new Set<string>());
  const started = useRef(false);
  const alive = useRef(true);

  /* `.hero-room[data-room]` tells tests (and anyone else) where the room is:
     loading → entering → ready. Framing adds data-col, data-bbox, data-near
     and data-fov; all of them go when the room unmounts. */
  useEffect(() => {
    alive.current = true;
    const host = wrap.current?.closest<HTMLElement>(".hero-room") ?? null;
    stage.host = host;
    if (host && !started.current) host.dataset.room = "loading";
    return () => {
      alive.current = false;
      entrance.current?.kill();
      if (host) for (const k of ["room", "col", "bbox", "near", "fov"]) delete host.dataset[k];
    };
  }, [stage]);

  /** Jump to the composed, final state (reduced motion, or no GSAP). */
  const settle = useCallback(() => {
    Object.assign(stage.motion, AT_REST);
    if (stage.host) stage.host.dataset.room = "ready";
    stage.invalidate();
  }, [stage]);

  /* Reduced motion: the final state, no orbit, no entrance. Switching it on
     mid-entrance jumps straight to the end. */
  useEffect(() => {
    const mq = window.matchMedia(MQ.reduced);
    const apply = () => {
      setReduced(mq.matches);
      stage.reduced = mq.matches;
      if (mq.matches) {
        entrance.current?.progress(1);
        entrance.current?.kill();
        stage.orbit = { x: 0, y: 0 };
        if (started.current) settle();
      }
    };
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [stage, settle]);

  /* The callouts are set in the mono face; once it has loaded their widths
     change, so measure again before the next frame clamps them. */
  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => {
      if (!live) return;
      stage.calloutW = [];
      stage.invalidate();
    });
    return () => {
      live = false;
    };
  }, [stage]);

  /* M-home-hero-02: orbit on a hover-capable pointer only. */
  useEffect(() => {
    if (reduced || !window.matchMedia(MQ.finePointer).matches) return;
    const onMove = (e: PointerEvent) => {
      stage.pointer = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
      stage.invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      stage.pointer = { x: 0, y: 0 };
      stage.invalidate();
    };
  }, [reduced, stage]);

  /* The scroll exit is driven from outside (Hero owns the ScrollTrigger); the
     room never reads scroll itself. */
  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      setProgress(p: number) {
        const q = Math.min(1, Math.max(0, p));
        if (q === stage.motion.exit) return;
        stage.motion.exit = q;
        if (wrap.current) wrap.current.style.opacity = String(1 - 0.5 * q);
        stage.invalidate();
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, stage]);

  /* M-home-hero-01: once the panel set has decoded, the room assembles out of
     the haze one plane at a time: the lattice floor sweeps in (0–600 ms), then
     the far row (200 ms), mid (320 ms) and near (440 ms) settle forward, and
     the callouts arrive at 900 ms. ≤1.4 s in all. The H1 never waits. */
  const startEntrance = useCallback(() => {
    if (stage.reduced) {
      settle();
      return;
    }
    if (stage.host) stage.host.dataset.room = "entering";
    import("gsap")
      .then(({ default: gsap }) => {
        if (!alive.current) return;
        if (stage.reduced) {
          settle();
          return;
        }
        const m = stage.motion;
        entrance.current = gsap
          .timeline({
            onUpdate: () => stage.invalidate(),
            onComplete: () => {
              if (stage.host) stage.host.dataset.room = "ready";
            },
          })
          .to(m, { floor: 1, duration: 0.6, ease: "power1.inOut" }, 0)
          .to(m, { far: 1, duration: 0.9, ease: "power2.out" }, 0.2)
          .to(m, { mid: 1, duration: 0.9, ease: "power2.out" }, 0.32)
          .to(m, { near: 1, duration: 0.9, ease: "power2.out" }, 0.44)
          .to(m, { callouts: 1, duration: 0.42, ease: "power2.out" }, 0.9);
      })
      .catch(settle);
  }, [stage, settle]);

  const handleLoaded = useCallback(
    (src: string) => {
      loaded.current.add(src);
      if (started.current || !panels.every((p) => loaded.current.has(p.src))) return;
      started.current = true;
      startEntrance();
      onReady?.();
    },
    [panels, startEntrance, onReady],
  );

  return (
    <div className="room" aria-hidden="true" ref={wrap} data-frameloop="demand">
      <Canvas
        dpr={degraded ? 1 : [1, 1.5]}
        frameloop="demand"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ manual: true, fov: 40, near: 1, far: 200, position: CAMERA_POS }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onLost?.();
            },
            { once: true },
          );
        }}
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} onIncline={() => setDegraded(false)} />
        {/* Fog in the page navy, so the far plane dissolves into the page.
            near/far are set from the fitted distance in Framing. */}
        <fog attach="fog" args={[SCENE.page, 34, 78]} />
        <Lights />
        <Framing frame={frame} panels={panels} stage={stage} />
        <Lattice stage={stage} />
        {panels.map((panel) => (
          <Suspense key={panel.src} fallback={null}>
            <RoomPanel
              panel={panel}
              side={panel.band === "near" ? (panel === near[0] ? -1 : 1) : 0}
              stage={stage}
              onLoaded={handleLoaded}
            />
          </Suspense>
        ))}
        <Director stage={stage} />
      </Canvas>
      {near.map((panel, i) => (
        <span
          key={panel.src}
          className="room-callout"
          ref={(el) => {
            stage.callouts[i] = el;
          }}
        >
          {calloutLabel(panel)}
        </span>
      ))}
    </div>
  );
}
