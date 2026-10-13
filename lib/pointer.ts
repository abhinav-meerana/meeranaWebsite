/**
 * One pointer for the whole site (brief §8, §10).
 *
 * Every pointer-reactive layer (the ColorBends bands, the DotField bulge, the
 * background glow and the platform universe) reads this store instead of
 * attaching its own listener, so they all share one coordinate system and
 * one smoothing curve, and React never re-renders on pointer movement.
 *
 *   · one passive `pointermove` listener on window, mouse and pen only (touch
 *     never drives the light: it would follow a scrolling finger);
 *   · raw viewport coordinates (`x`, `y`) and smoothed ones (`sx`, `sy`);
 *   · `presence` eases to 1 while the pointer is over the page and back to 0
 *     when it leaves, so consumers return to rest instead of freezing;
 *   · one rAF loop, which sleeps as soon as the smoothed values settle.
 *
 * Consumers normalise against whatever box they care about, e.g. the universe
 * container: `((sx - rect.left) / rect.width) * 2 - 1`.
 */

export type PointerState = {
  /** Raw viewport px. */
  x: number;
  y: number;
  /** Smoothed viewport px. */
  sx: number;
  sy: number;
  /** 0 → 1: how present the pointer is (eases out when it leaves). */
  presence: number;
  /** True while the pointer is over the document. */
  active: boolean;
};

type Listener = (p: Readonly<PointerState>) => void;

const state: PointerState = { x: 0, y: 0, sx: 0, sy: 0, presence: 0, active: false };
const listeners = new Set<Listener>();
/** Smoothing time constant in ms: higher is lazier. */
const TAU_POS = 140;
const TAU_PRESENCE = 420;

let raf = 0;
let last = 0;
let bound = false;
let seeded = false;

function frame(now: number) {
  const dt = Math.min(64, now - (last || now));
  last = now;
  const kPos = 1 - Math.exp(-dt / TAU_POS);
  const kPres = 1 - Math.exp(-dt / TAU_PRESENCE);
  state.sx += (state.x - state.sx) * kPos;
  state.sy += (state.y - state.sy) * kPos;
  const target = state.active ? 1 : 0;
  state.presence += (target - state.presence) * kPres;

  const settled =
    Math.abs(state.x - state.sx) < 0.15 &&
    Math.abs(state.y - state.sy) < 0.15 &&
    Math.abs(target - state.presence) < 0.002;
  if (settled) {
    state.sx = state.x;
    state.sy = state.y;
    state.presence = target;
  }
  listeners.forEach((fn) => fn(state));
  raf = settled ? 0 : requestAnimationFrame(frame);
}

function wake() {
  if (raf) return;
  last = 0;
  raf = requestAnimationFrame(frame);
}

function onMove(e: PointerEvent) {
  if (e.pointerType === "touch") return;
  state.x = e.clientX;
  state.y = e.clientY;
  if (!seeded) {
    /* The first event places the smoothed point too, so nothing sweeps in
       from the top-left corner. */
    seeded = true;
    state.sx = state.x;
    state.sy = state.y;
  }
  state.active = true;
  wake();
}

function onLeave(e: PointerEvent | MouseEvent) {
  /* `relatedTarget === null` means the pointer left the window. */
  if ((e as MouseEvent).relatedTarget) return;
  state.active = false;
  wake();
}

function onBlur() {
  state.active = false;
  wake();
}

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  state.x = state.sx = window.innerWidth / 2;
  state.y = state.sy = window.innerHeight / 2;
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  document.addEventListener("mouseout", onLeave);
  window.addEventListener("blur", onBlur);
}

function unbind() {
  if (!bound) return;
  bound = false;
  seeded = false;
  window.removeEventListener("pointermove", onMove);
  document.documentElement.removeEventListener("pointerleave", onLeave);
  document.removeEventListener("mouseout", onLeave);
  window.removeEventListener("blur", onBlur);
  cancelAnimationFrame(raf);
  raf = 0;
}

/** Subscribe to smoothed frames. The listener runs only while something moves. */
export function subscribePointer(fn: Listener): () => void {
  bind();
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && consumers === 0) unbind();
  };
}

let consumers = 0;
/** For render loops that poll `getPointer()` each frame instead of subscribing. */
export function retainPointer(): () => void {
  bind();
  consumers++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    consumers--;
    if (listeners.size === 0 && consumers === 0) unbind();
  };
}

export function getPointer(): Readonly<PointerState> {
  return state;
}
