/**
 * Self-test for lib/settle.ts (FINAL-SPEC §4.7, owner A). No browser and no GSAP:
 * `window`, ScrollToPlugin (with autoKill) and the clock are stubbed, and time moves
 * in 16 ms frames. Node ≥22.18 strips the module's types, so it runs as written.
 *
 *   node scripts/selftest-settle.mjs
 *
 * Product-stage settings (14 scenes, step 480, threshold min(12%, 40 px), 0.48 s)
 * unless a test says otherwise.
 */
import assert from "node:assert/strict";

/* package.json has no "type" (and is not A's to change), so node warns that it
   reparsed settle.ts as ESM. That one warning is noise here; drop it. */
const emitWarning = process.emitWarning;
process.emitWarning = function (warning, ...rest) {
  const code = typeof rest[0] === "object" ? rest[0]?.code : rest[1];
  if (code === "MODULE_TYPELESS_PACKAGE_JSON") return;
  return emitWarning.call(this, warning, ...rest);
};
const { createSettle } = await import("../lib/settle.ts");

const FRAME = 16;
const STEP = 480;
const N = 14;

/* ---- fake window: scroll position, listeners and timers on a manual clock ---- */
let now = 0;
let seq = 0;
let lastY = 0;
const timers = new Map();
const listeners = [];
const win = {
  scrollY: 0,
  maxY: 20000,
  addEventListener(type, fn, o) {
    listeners.push({ type, fn, capture: typeof o === "boolean" ? o : Boolean(o?.capture) });
  },
  removeEventListener(type, fn, o) {
    const capture = typeof o === "boolean" ? o : Boolean(o?.capture);
    const k = listeners.findIndex((l) => l.type === type && l.fn === fn && l.capture === capture);
    if (k >= 0) listeners.splice(k, 1);
  },
  setTimeout(fn, ms) {
    timers.set(++seq, { at: now + ms, fn });
    return seq;
  },
  clearTimeout(id) {
    timers.delete(id);
  },
};
globalThis.window = win;

const setScroll = (y) => {
  win.scrollY = Math.max(0, Math.min(win.maxY, y));
};
const dispatch = (type) => listeners.filter((l) => l.type === type).forEach((l) => l.fn());

/* ---- fake gsap: just the window glide settle asks for ---- */
const tweens = new Set();
const easeInOut2 = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
const render = (t, p) => {
  setScroll(t.y0 + (t.vars.scrollTo.y - t.y0) * easeInOut2(p));
  t.set = win.scrollY;
  t.vars.onUpdate();
  if (p >= 1) {
    tweens.delete(t);
    t.vars.onComplete();
  }
};
const gsap = {
  killed: 0,
  to(target, vars) {
    assert.equal(target, win, "settle only tweens the window");
    assert.equal(vars.ease, "power2.inOut");
    if (vars.overwrite) [...tweens].forEach((t) => t.kill());
    const t = {
      vars,
      y0: win.scrollY,
      set: win.scrollY,
      elapsed: 0,
      kill() {
        if (tweens.delete(t)) vars.onInterrupt(); // GSAP: killed before completion
      },
    };
    tweens.add(t);
    if (vars.duration === 0) render(t, 1); // GSAP renders a zero-length tween at once
    return t;
  },
  killTweensOf(target) {
    assert.equal(target, win);
    gsap.killed++;
    [...tweens].forEach((t) => t.kill());
  },
};

/* One frame: due timers, then the scroll event (if the position moved), then the
   GSAP tick. ScrollToPlugin's autoKill stops a glide the reader has moved by >7 px. */
function frame() {
  now += FRAME;
  for (const [id, t] of [...timers].sort((a, b) => a[1].at - b[1].at)) {
    if (t.at <= now && timers.has(id)) {
      timers.delete(id);
      t.fn();
    }
  }
  if (win.scrollY !== lastY) {
    lastY = win.scrollY;
    dispatch("scroll");
  }
  for (const t of [...tweens]) {
    if (t.vars.scrollTo.autoKill && Math.abs(win.scrollY - t.set) > 7) {
      t.kill();
      continue;
    }
    t.elapsed += FRAME;
    render(t, Math.min(1, t.elapsed / (t.vars.duration * 1000)));
  }
}
const run = (ms) => {
  for (let k = 0; k < Math.ceil(ms / FRAME); k++) frame();
};
/** A wheel notch. `smooth` spreads it over 8 frames, front-loaded like Chrome's. */
function wheel(dy, smooth = false) {
  if (!smooth) return setScroll(win.scrollY + dy);
  let done = 0;
  for (let k = 1; k <= 8; k++) {
    const to = dy * (1 - (1 - k / 8) ** 3);
    setScroll(win.scrollY + (to - done));
    done = to;
    frame();
  }
}

/* ---- harness ---- */
let trig;
let passed = 0;
function make(over = {}) {
  const log = [];
  const s = createSettle({
    gsap,
    st: () => trig,
    count: N,
    threshold: (step) => Math.min(step * 0.12, 40),
    duration: 0.48,
    idleMs: 140,
    onIndex: (i, settled) => log.push([i, settled]),
    ...over,
  });
  return { s, log };
}
function restOn(s, log, i) {
  setScroll(s.restY(i));
  s.markSettled(s.restY(i));
  run(400);
  assert.equal(s.moving, false);
  log.length = 0;
}
/** Runs until the page rests on y with no glide; returns the time taken. */
function untilRest(s, y, maxMs) {
  const t0 = now;
  while (now - t0 <= maxMs) {
    frame();
    if (!s.moving && Math.abs(win.scrollY - y) < 0.5) return now - t0;
  }
  assert.fail(`not at rest on ${y} within ${maxMs} ms (scrollY ${win.scrollY.toFixed(1)})`);
}
function test(name, fn) {
  assert.equal(listeners.length, 0, "the previous instance left listeners behind");
  timers.clear();
  tweens.clear();
  now = 0;
  win.scrollY = lastY = 0;
  trig = { start: 0, end: (N - 1) * STEP };
  try {
    fn();
  } catch (e) {
    console.error(`  FAIL  ${name}`);
    throw e;
  }
  passed++;
  console.log(`  ok    ${name}`);
}

/* ---- tests ---- */
test("restY maps scenes onto the trigger and clamps", () => {
  const { s } = make();
  assert.equal(s.restY(0), 0);
  assert.equal(s.restY(5), 5 * STEP);
  assert.equal(s.restY(-3), 0);
  assert.equal(s.restY(99), (N - 1) * STEP);
  trig = { start: 900, end: 900 + (N - 1) * 400 };
  assert.equal(s.restY(2), 1700, "reads the trigger on every call");
  s.destroy();
});

test("before the trigger exists nothing moves", () => {
  trig = null;
  const { s, log } = make();
  setScroll(700);
  assert.equal(s.restY(4), 700, "restY falls back to the current scroll");
  s.toIndex(3);
  s.markSettled(100);
  run(600);
  assert.equal(win.scrollY, 700);
  assert.equal(tweens.size, 0);
  assert.deepEqual(log, []);
  s.destroy();
});

for (const smooth of [false, true]) {
  const how = smooth ? "smooth" : "instant";
  test(`a 100 px notch from rest settles on the next scene within 900 ms (${how})`, () => {
    const { s, log } = make();
    restOn(s, log, 4);
    wheel(100, smooth);
    const ms = untilRest(s, s.restY(5), 900);
    assert.ok(ms <= 900, `${ms} ms`);
    assert.deepEqual(log, [[5, false], [5, true]]);
    s.destroy();
  });

  test(`two notches 300 ms apart move two scenes (${how})`, () => {
    const { s, log } = make();
    restOn(s, log, 4);
    wheel(100, smooth);
    run(smooth ? 300 - 8 * FRAME : 300);
    assert.equal(s.moving, true, "the second notch lands mid-glide");
    wheel(100, smooth);
    untilRest(s, s.restY(6), 1500);
    assert.deepEqual(log.at(-1), [6, true]);
    assert.ok(!log.some(([i, done]) => i === 5 && done), "never rests on the scene in between");
    s.destroy();
  });
}

test("45 px advances, 25 px returns, a push up goes back", () => {
  const { s, log } = make();
  restOn(s, log, 4);
  wheel(45);
  untilRest(s, s.restY(5), 900);
  wheel(25);
  run(140);
  untilRest(s, s.restY(5), 900);
  assert.deepEqual(log.at(-1), [5, true]);
  wheel(-100);
  untilRest(s, s.restY(4), 900);
  assert.deepEqual(log.at(-1), [4, true]);
  s.destroy();
});

test("the gallery threshold (12% of the step) is honoured", () => {
  trig = { start: 900, end: 900 + 5 * 400 }; // threshold 48
  const { s, log } = make({ count: 6, threshold: (step) => step * 0.12, duration: 0.38 });
  restOn(s, log, 2);
  wheel(45);
  untilRest(s, s.restY(2), 900);
  wheel(50);
  untilRest(s, s.restY(3), 900);
  s.destroy();
});

test("six fast notches end at a rest position", () => {
  const { s, log } = make();
  restOn(s, log, 4);
  for (let k = 0; k < 6; k++) {
    wheel(100);
    run(50);
  }
  run(1500);
  assert.equal(s.moving, false);
  const [i, done] = log.at(-1);
  assert.equal(done, true);
  assert.equal(win.scrollY, s.restY(i));
  s.destroy();
});

test("a long scrollbar drag lands on the nearest scene, and only after release", () => {
  const { s, log } = make();
  restOn(s, log, 2);
  dispatch("mousedown");
  setScroll(s.restY(6) + 30);
  run(1000);
  assert.equal(win.scrollY, s.restY(6) + 30, "no settling while the button is down");
  assert.deepEqual(log, []);
  dispatch("mouseup");
  untilRest(s, s.restY(6), 1200);
  s.destroy();
});

test("a window blur releases a held button", () => {
  const { s, log } = make();
  restOn(s, log, 4);
  dispatch("mousedown");
  setScroll(s.restY(4) + 200);
  run(500);
  assert.equal(win.scrollY, s.restY(4) + 200);
  dispatch("blur");
  untilRest(s, s.restY(5), 1200);
  s.destroy();
});

test("outside the film it never pulls back", () => {
  const { s, log } = make();
  restOn(s, log, N - 1);
  wheel(300); // into the footer
  run(1000);
  assert.equal(win.scrollY, s.restY(N - 1) + 300);
  assert.deepEqual(log, []);
  s.destroy();
});

test("entering the film lands on the nearest scene, not a stale rest", () => {
  trig = { start: 900, end: 900 + 5 * 400 }; // a film lower on the page (the gallery)
  const { s, log } = make({ count: 6, threshold: (step) => step * 0.12, duration: 0.38 });
  setScroll(950);
  untilRest(s, 900, 1200);
  assert.deepEqual(log, [[0, false], [0, true]]);
  setScroll(500); // back up into the hero
  run(600);
  assert.equal(win.scrollY, 500);
  setScroll(960); // 60 px in: past the threshold from the old rest, but a fresh entry
  untilRest(s, 900, 1200);
  s.destroy();
});

test("instant toIndex jumps and reports the rest once", () => {
  const { s, log } = make();
  restOn(s, log, 0);
  s.toIndex(9, { instant: true });
  assert.equal(win.scrollY, s.restY(9));
  assert.equal(s.moving, false);
  assert.deepEqual(log, [[9, false], [9, true]]);
  run(600); // the jump's scroll event settles on the same rest
  assert.deepEqual(log, [[9, false], [9, true]]);
  s.destroy();
});

test("a replaced glide never reports; moving holds until the last one lands", () => {
  const { s, log } = make();
  restOn(s, log, 4);
  s.toIndex(6, { duration: 0.62 });
  assert.equal(s.moving, true);
  run(100);
  s.toIndex(8);
  assert.equal(s.moving, true);
  run(100);
  assert.equal(s.moving, true);
  untilRest(s, s.restY(8), 1000);
  assert.deepEqual(log, [[6, false], [8, false], [8, true]]);
  s.destroy();
});

test("a resize pauses settling, then settles", () => {
  const { s, log } = make();
  restOn(s, log, 4);
  dispatch("resize");
  setScroll(s.restY(4) + 100);
  run(300);
  assert.equal(win.scrollY, s.restY(4) + 100, "quiet while the triggers re-measure");
  assert.equal(s.moving, false);
  untilRest(s, s.restY(5), 1200);
  s.destroy();
});

test("a refresh that rescales the film keeps the current scene", () => {
  const { s, log } = make();
  restOn(s, log, 5);
  trig = { start: 0, end: (N - 1) * 520 }; // taller viewport: step 480 → 520
  setScroll(s.restY(5)); // the engine re-scrolls to the new rest
  run(1000);
  assert.equal(win.scrollY, 5 * 520);
  assert.ok(!log.some(([, done]) => !done), "no glide");
  s.destroy();
});

test("markSettled sets where the next gesture is measured from", () => {
  const { s, log } = make();
  restOn(s, log, 2);
  setScroll(s.restY(10)); // a cut: the engine jumps and then marks the rest
  s.markSettled(s.restY(10));
  run(400);
  assert.deepEqual(log, [[10, true]], "the cut's destination is reported once, as a rest");
  wheel(-45);
  untilRest(s, s.restY(9), 900);
  s.destroy();
});

test("one scene: nothing to settle", () => {
  trig = { start: 100, end: 100 };
  const { s, log } = make({ count: 1 });
  assert.equal(s.restY(0), 100);
  assert.equal(s.restY(3), 100);
  setScroll(130);
  run(600);
  assert.equal(win.scrollY, 130);
  assert.deepEqual(log, []);
  s.destroy();
});

test("destroy mid-glide removes listeners, timers and the glide; twice is safe", () => {
  const { s, log } = make();
  restOn(s, log, 4);
  wheel(30);
  run(FRAME); // a settle timer is pending
  s.toIndex(7);
  run(100);
  const y = win.scrollY;
  const killed = gsap.killed;
  s.destroy();
  assert.equal(gsap.killed, killed + 1);
  assert.equal(listeners.length, 0);
  assert.equal(timers.size, 0);
  assert.equal(tweens.size, 0);
  assert.equal(s.moving, false);
  run(1000);
  assert.equal(win.scrollY, y, "the glide stopped where it was");
  s.toIndex(2);
  s.destroy();
  assert.deepEqual(log, [[7, false]], "a destroyed glide never reports a rest");
});

console.log(`settle self-test: ${passed} passed`);
