/// <reference types="gsap" />
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { Enter, SceneKind } from "@/content/storyboards";
import { CHOREO, ENTER, nearLabel, type Ctx } from "./choreo";

/* ============================================================================
   The stage engine (FINAL-SPEC §4.6). Loaded only in stage mode, together
   with GSAP: phones, the rail, the list and reduced motion never download it.

   One root ScrollTrigger and no GSAP pin: `.ps-pin` is CSS sticky inside a
   `.ps` that is 100svh + (N − 1) × step tall, and the master tween moves the
   track sideways across that range (scrub 0.5). Each scene gets one child
   timeline on the master (`containerAnimation`, scrub: true), so there are
   N + 1 triggers in all (I5). The trigger elements are never animated.

   Layer rates, per scene, relative to the track:
     .ps-bg 0.70 · .ps-shadow 0.82 · .ps-mid 0.88 · .ps-fg 1.00 · .ps-near 1.15
   A layer of rate r is offset by (p − 0.5) · 2W · (1 − r): zero at rest, so
   every plane is exactly in place when the scene is (I1). The global lattice
   floor follows the smoothed master at 0.25 through a quickSetter, wrapping
   every 448 px (the period of the 224 px accent family).

   Single writer (I7): the master owns the track's x, the quickSetters own the
   floor and the progress bar, these layer tweens own the wrappers' x, and
   choreo.ts owns everything inside them.
   ========================================================================== */

type Gsap = typeof import("gsap").default;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;

export const RATES = { bg: 0.7, shadow: 0.82, mid: 0.88, near: 1.15, far: 0.25 } as const;
const LATTICE_PERIOD = 448;
const DEV = process.env.NODE_ENV !== "production";

export type Range = "full" | "first" | "last";

/** Scene-local p: 0 = left edge at viewport right · 0.5 = at rest · 1 = right edge at viewport left.
 * The first and last scenes only have half a window; their timelines span that half. */
export const mapper = (r: Range) => (p: number) =>
  r === "first" ? (p < 0.5 ? null : (p - 0.5) * 2) : r === "last" ? (p > 0.5 ? null : p * 2) : p;

export type Stage = {
  master: gsap.core.Tween;
  scenes: HTMLElement[];
  N: number;
  /** The root trigger (read on every use: refreshes replace its numbers). */
  st: () => ScrollTriggerType | undefined;
  /** Scroll y at which scene i is at rest. */
  restY: (i: number) => number;
  kill: () => void;
};

export function buildStage(
  gsap: Gsap,
  ScrollTrigger: ScrollTriggerStatic,
  root: HTMLElement,
  hooks: { onRaw(p: number): void },
): Stage {
  const pin = root.querySelector<HTMLElement>(".ps-pin")!;
  const track = root.querySelector<HTMLElement>(".ps-track")!;
  const floor = root.querySelector<HTMLElement>(".ps-floor-grid");
  const bar = root.querySelector<HTMLElement>(".ps-progress-bar");
  const scenes = gsap.utils.toArray<HTMLElement>(".ps-scene", track);
  const N = scenes.length;
  /* The pin, never the viewport: on Windows 100vw includes the scrollbar. */
  const W = () => pin.clientWidth;
  const H = () => pin.clientHeight;
  const c: Ctx = { W, H };
  let master!: gsap.core.Tween;

  const ctx = gsap.context(() => {});
  try {
    ctx.add(() => {
      master = gsap.to(track, {
        x: () => -(N - 1) * W(),
        ease: "none",
        scrollTrigger: {
          id: "ps",
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onToggle: (s) => {
            document.documentElement.classList.toggle("has-pin", s.isActive);
            root.classList.toggle("is-live", s.isActive);
          },
          onUpdate: (s) => hooks.onRaw(s.progress),
        },
      });

      /* The floor and the bar follow the SMOOTHED tween, not raw scroll, so
         they never run ahead of the track. The grid is written as translate3d
         (force3D), so it moves as its own composited layer inside the
         perspective plane instead of re-rasterising three gradients the width
         of the floor on every frame. */
      if (floor) gsap.set(floor, { force3D: true, x: 0 });
      const setFloor = floor ? gsap.quickSetter(floor, "x", "px") : null;
      const setBar = bar ? gsap.quickSetter(bar, "scaleX") : null;
      const follow = () => {
        const p = master.progress();
        setFloor?.(-((p * (N - 1) * W() * RATES.far) % LATTICE_PERIOD));
        setBar?.(p);
      };
      master.eventCallback("onUpdate", follow);
      follow();

      scenes.forEach((scene, i) => {
        const range: Range = N < 2 ? "full" : i === 0 ? "first" : i === N - 1 ? "last" : "full";
        const stage3d = scene.querySelectorAll(".ps-stage3d");
        if (stage3d.length) gsap.set(stage3d, { transformPerspective: 1400 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scene,
            containerAnimation: master,
            scrub: true,
            invalidateOnRefresh: true,
            start: range === "first" ? "left left" : "left right",
            end: range === "last" ? "left left" : "right left",
          },
        });
        const at = mapper(range);
        layerRates(tl, scene, W, range); // fixes the timeline's length at 1
        nearLabel(tl, scene, at);
        CHOREO[scene.dataset.kind as SceneKind]?.(tl, scene, at, c);
        ENTER[scene.dataset.enter as Enter]?.(tl, scene, at, c);
        if (DEV && tl.duration() > 1.0001) {
          throw new Error(`stage: scene ${scene.id} has a tween past the end of its window (${tl.duration().toFixed(3)} > 1)`);
        }
      });
    });
  } catch (err) {
    ctx.revert();
    gsap.set([floor, bar].filter(Boolean), { clearProps: "transform" });
    throw err;
  }

  return {
    master,
    scenes,
    N,
    st: () => master.scrollTrigger,
    restY: (i: number) => {
      const st = master.scrollTrigger;
      if (!st) return window.scrollY;
      const k = Math.max(0, Math.min(N - 1, i));
      return st.start + (N > 1 ? (k / (N - 1)) * (st.end - st.start) : 0);
    },
    kill() {
      document.documentElement.classList.remove("has-pin");
      root.classList.remove("is-live");
      ctx.revert();
      /* quickSetter writes are not tweens, so the context does not revert them. */
      gsap.set([floor, bar].filter(Boolean), { clearProps: "transform" });
    },
  };
}

/** Layer-rate tweens, linear over the scene's whole window. */
function layerRates(tl: gsap.core.Timeline, scene: HTMLElement, W: () => number, range: Range) {
  const [p0, p1] = range === "full" ? [0, 1] : range === "first" ? [0.5, 1] : [0, 0.5];
  const off = (r: number, p: number) => (p - 0.5) * 2 * W() * (1 - r);
  (["bg", "shadow", "mid", "near"] as const).forEach((k) => {
    const el = scene.querySelector<HTMLElement>(`.ps-${k}`);
    if (!el) return;
    /* The shadow sits inside .ps-mid, so its own offset is what it needs on
       top of the mid's to read 0.82 against the track. */
    const nested = k === "shadow" && el.parentElement?.closest(".ps-mid") ? RATES.mid : null;
    const dx = (p: number) => off(RATES[k], p) - (nested === null ? 0 : off(nested, p));
    tl.fromTo(el, { x: () => dx(p0) }, { x: () => dx(p1), duration: 1, ease: "none" }, 0);
  });
}
