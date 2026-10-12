/**
 * Settle: one gesture moves one scene. Shared by the product stage (A) and the
 * homepage gallery (D). FINAL-SPEC §4.7; the API is frozen, change it only with D.
 *
 * A pinned horizontal film is a vertical scroll range [start, end] holding `count`
 * rest positions, one `step` apart. When the reader has not scrolled for `idleMs`,
 * settle glides the page to one of them:
 *   - a push of more than `threshold(step)` px goes one scene in its direction, or
 *     to the nearest scene if that is further (a long fling, a scrollbar drag);
 *   - a smaller push returns to the scene it started from;
 *   - outside [start − 2, end + 2] it never pulls the page back, and the next entry
 *     lands on the nearest scene;
 *   - nothing settles while a mouse button is down (a scrollbar drag), or for 400 ms
 *     after a window resize, while the triggers are re-measured.
 * A gesture during a glide stops it (ScrollToPlugin `autoKill`) and is measured from
 * where the glide had got to, towards the glide's target. So two wheel notches in a
 * row move two scenes even when the second lands mid-glide.
 *
 * Pure and dependency-free: no imports, nothing runs at import time, and only
 * `window` is touched (so node can stub it). GSAP is passed in; register
 * ScrollToPlugin before the first `toIndex`. Self-test: node scripts/selftest-settle.mjs
 *
 *   const settle = createSettle({ gsap, st: () => master.scrollTrigger, count: N,
 *     threshold: (s) => Math.min(s * 0.12, 40), duration: 0.48, idleMs: 140,
 *     onIndex: (i, settled) => { setIndex(i); if (settled) announce(i); } });
 */

/** The part of GSAP that settle uses. `gsap` itself satisfies it. */
export type SettleGsap = {
  to(target: Window, vars: SettleTweenVars): unknown;
  killTweensOf(target: Window): void;
};

/** The one tween settle asks for: a ScrollToPlugin glide of the window. */
export type SettleTweenVars = {
  scrollTo: { y: number; autoKill: boolean };
  duration: number;
  ease: string;
  overwrite: boolean;
  onUpdate: () => void;
  onComplete: () => void;
  onInterrupt: () => void;
};

/** The part of a ScrollTrigger that settle reads. A `ScrollTrigger` satisfies it. */
export type SettleTrigger = { readonly start: number; readonly end: number };

export type SettleOptions = {
  gsap: SettleGsap;
  /** The film's root trigger, or null before it exists. Read on every use, so refreshes are picked up. */
  st: () => SettleTrigger | null | undefined;
  /** Rest positions (scenes or cards). Fixed for the life of the instance; make a new one if it changes. */
  count: number;
  /** px a push must exceed to move one scene, given the step in px. */
  threshold: (step: number) => number;
  /** Glide length in seconds. */
  duration: number;
  /** Quiet time after the last scroll event before settling. Default 140 ms. */
  idleMs?: number;
  /** `settled` is false when a glide towards i starts, true when the page comes to rest on i (once per rest). */
  onIndex: (i: number, settled: boolean) => void;
};

export type Settle = {
  /** Scroll y of scene i at rest, i clamped to the film. With no trigger yet it returns the current scroll, so an early call moves nothing. */
  restY(i: number): number;
  /** Glide to scene i (clamped). `instant` jumps; `duration` overrides the default. No-op before the trigger exists or after destroy. */
  toIndex(i: number, o?: { instant?: boolean; duration?: number }): void;
  /** The page is at rest at y (after a cut, a hash jump or a refresh); the next gesture is measured from there. */
  markSettled(y: number): void;
  /** True while a glide runs. Scroll-driven index updates should wait for it. */
  readonly moving: boolean;
  /** Removes the listeners, clears the timers and stops any glide. Safe to call twice. */
  destroy(): void;
};

const EDGE = 2; // px of slack at the film's ends and around a rest position
const RESIZE_QUIET_MS = 400; // longer than ScrollTrigger's own resize debounce (200 ms)

export function createSettle(o: SettleOptions): Settle {
  const last = Math.max(0, o.count - 1);
  let moving = false;
  let held = false; // a mouse button is down: the reader may be dragging the scrollbar
  let quiet = false; // a resize is under way: the trigger's range is about to change
  let dead = false;
  let timer = 0;
  let quietTimer = 0;
  let glide = 0; // id of the current glide; callbacks from a replaced glide are ignored
  /* The next gesture departs from scene `from`, measured from `anchor`. Both are in
     scene units ((y − start) / step), so a refresh that rescales the film keeps them
     valid. NaN: no rest yet, or the reader has left the film. */
  let from = NaN;
  let anchor = NaN;
  let told = NaN; // the index last reported as settled, so each rest is reported once

  const clamp = (i: number) => Math.max(0, Math.min(last, i));
  const stepOf = (s: SettleTrigger) => (last > 0 ? (s.end - s.start) / last : 0);
  const unitsAt = (y: number) => {
    const s = o.st();
    const step = s ? stepOf(s) : 0;
    return s && step > 0 ? (y - s.start) / step : NaN;
  };
  const restY = (i: number) => {
    const s = o.st();
    return s ? s.start + clamp(i) * stepOf(s) : window.scrollY;
  };
  const land = (i: number) => {
    from = anchor = i;
    if (told !== i) {
      told = i;
      o.onIndex(i, true);
    }
  };
  const forget = () => {
    from = anchor = told = NaN;
  };
  const arm = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(settle, o.idleMs ?? 140);
  };

  function settle() {
    const s = o.st();
    if (dead || moving || held || quiet || !s) return;
    const step = stepOf(s);
    if (!(step > 0)) return;
    const y = window.scrollY;
    if (y < s.start - EDGE || y > s.end + EDGE) return forget(); // outside: never pull back
    const at = (y - s.start) / step;
    let i = Math.round(at);
    if (!Number.isNaN(from) && !Number.isNaN(anchor)) {
      const push = (at - anchor) * step;
      if (Math.abs(push) <= o.threshold(step)) i = from;
      else {
        const dir = Math.sign(push);
        if (dir * (i - (from + dir)) < 0) i = from + dir; // never short of one scene
      }
    }
    i = clamp(i);
    if (Math.abs(restY(i) - y) < EDGE) land(i);
    else toIndex(i);
  }

  function toIndex(i: number, x: { instant?: boolean; duration?: number } = {}) {
    if (dead || !o.st()) return;
    i = clamp(i);
    const y = restY(i);
    const id = ++glide;
    let reached = window.scrollY; // where this glide has got to; a gesture is measured from here
    window.clearTimeout(timer);
    moving = true;
    from = i;
    anchor = NaN;
    told = NaN;
    o.onIndex(i, false);
    o.gsap.to(window, {
      scrollTo: { y, autoKill: true },
      duration: x.instant || Math.abs(y - reached) < 1 ? 0 : (x.duration ?? o.duration),
      ease: "power2.inOut",
      overwrite: true, // kills the previous glide; its callbacks see a stale id
      onUpdate: () => {
        reached = window.scrollY;
      },
      onComplete: () => {
        if (id !== glide) return;
        moving = false;
        land(i);
      },
      onInterrupt: () => {
        if (id !== glide) return;
        moving = false;
        anchor = unitsAt(reached);
        arm();
      },
    });
  }

  const onScroll = () => {
    if (dead || moving) return;
    const s = o.st();
    const y = window.scrollY;
    if (s && (y < s.start - EDGE || y > s.end + EDGE)) {
      window.clearTimeout(timer);
      return forget();
    }
    arm();
  };
  const down = () => {
    held = true;
    window.clearTimeout(timer);
  };
  const up = () => {
    if (!held) return;
    held = false;
    onScroll();
  };
  const onResize = () => {
    quiet = true;
    window.clearTimeout(timer);
    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(() => {
      quiet = false;
      if (!moving) arm();
    }, RESIZE_QUIET_MS);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousedown", down, true);
  window.addEventListener("mouseup", up, true);
  window.addEventListener("blur", up); // a release we never saw must not freeze settling
  window.addEventListener("resize", onResize);

  return {
    restY,
    toIndex,
    markSettled(y: number) {
      const at = unitsAt(y);
      if (Number.isNaN(at)) return;
      from = clamp(Math.round(at));
      anchor = at;
    },
    get moving() {
      return moving;
    },
    destroy() {
      if (dead) return;
      dead = true;
      glide++; // the interrupt fired by the kill below is ignored
      moving = held = quiet = false;
      window.clearTimeout(timer);
      window.clearTimeout(quietTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", down, true);
      window.removeEventListener("mouseup", up, true);
      window.removeEventListener("blur", up);
      window.removeEventListener("resize", onResize);
      o.gsap.killTweensOf(window);
    },
  };
}
