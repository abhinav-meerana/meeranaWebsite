/**
 * Self-test for components/stage/choreo.ts (FINAL-SPEC §4.8, P-22; owner A).
 * No browser and no GSAP: a fake timeline records every tween, and a small
 * fake DOM (tag, class, attribute and :not() selectors, descendant and child
 * combinators) stands in for a scene. Node ≥22.18 strips the module's types.
 *
 *   node scripts/selftest-choreo.mjs
 *
 * Checks, in development mode:
 *   · a window that ends in, or starts in, the rest band [0.46, 0.54] throws;
 *   · a tween past the end of the scene's timeline throws;
 *   · a layer wrapper (.ps-bg, .ps-mid, .ps-near, .ps-scene …) as a target throws,
 *     .ps-shadow may be faded but not moved, and a heading may move but not fade;
 *   · every CHOREO kind and every ENTER transition, run on a scene that carries
 *     every hook class, in the first, middle and last positions, keeps the rest
 *     band free and the timeline within [0, 1], and exits never render early.
 */
import assert from "node:assert/strict";

/* package.json has no "type" (and is not A's to change), so node warns that it
   reparsed choreo.ts as ESM. That one warning is noise here; drop it. */
const emitWarning = process.emitWarning;
process.emitWarning = function (warning, ...rest) {
  const code = typeof rest[0] === "object" ? rest[0]?.code : rest[1];
  if (code === "MODULE_TYPELESS_PACKAGE_JSON") return;
  return emitWarning.call(this, warning, ...rest);
};
const choreo = await import("../components/stage/choreo.ts");
const { CHOREO, ENTER, span, cascade, assertWindow, assertTargets, nearLabel } = choreo;

/* ---- a fake DOM, just enough for the selectors choreo.ts uses ---------------- */

function splitTop(s, sepRe) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (depth === 0 && sepRe.test(ch)) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCompound(src) {
  const c = { tag: null, classes: [], attrs: [], nots: [] };
  let s = src.trim();
  const tag = s.match(/^[a-z][a-z0-9]*/i);
  if (tag) {
    c.tag = tag[0].toLowerCase();
    s = s.slice(tag[0].length);
  }
  while (s.length) {
    let m;
    if ((m = s.match(/^\.([\w-]+)/))) c.classes.push(m[1]);
    else if ((m = s.match(/^\[([\w-]+)(?:="([^"]*)")?\]/))) c.attrs.push([m[1], m[2]]);
    else if ((m = s.match(/^:not\(([^)]*)\)/))) c.nots.push(parseCompound(m[1]));
    else throw new Error(`fake DOM cannot parse "${src}" at "${s}"`);
    s = s.slice(m[0].length);
  }
  return c;
}

function parseComplex(src) {
  /* tokens: compound, then (combinator, compound)* */
  const parts = [];
  const re = /\s*(>)\s*|\s+/g;
  const s = src.trim();
  let last = 0;
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (depth) continue;
    re.lastIndex = i;
    const m = re.exec(s);
    if (m && m.index === i) {
      parts.push(parseCompound(s.slice(last, i)));
      parts.push(m[1] ? ">" : " ");
      last = i + m[0].length;
      i = last - 1;
    }
  }
  parts.push(parseCompound(s.slice(last)));
  return parts;
}

const parseList = (sel) => splitTop(sel, /,/).map(parseComplex);

function matchCompound(el, c) {
  if (c.tag && el.tag !== c.tag) return false;
  if (!c.classes.every((k) => el.classes.has(k))) return false;
  if (!c.attrs.every(([k, v]) => (v === undefined ? k in el.attrs : el.attrs[k] === v))) return false;
  return !c.nots.some((n) => matchCompound(el, n));
}

function matchComplex(el, parts, scope) {
  let i = parts.length - 1;
  if (!matchCompound(el, parts[i])) return false;
  let node = el;
  while (i > 0) {
    const comb = parts[i - 1];
    const want = parts[i - 2];
    if (comb === ">") {
      node = node.parent;
      if (!node || node === scope?.parent || !matchCompound(node, want)) return false;
    } else {
      node = node.parent;
      while (node && !matchCompound(node, want)) node = node.parent;
      if (!node) return false;
    }
    i -= 2;
  }
  return true;
}

class El {
  constructor(tag, cls = "", attrs = {}, children = []) {
    this.tag = tag;
    this.className = cls;
    this.classes = new Set(cls.split(/\s+/).filter(Boolean));
    this.attrs = attrs;
    this.dataset = Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith("data-")).map(([k, v]) => [k.slice(5), v]));
    this.children = [];
    this.parent = null;
    children.forEach((c) => this.append(c));
  }
  get tagName() {
    return this.tag.toUpperCase();
  }
  get parentElement() {
    return this.parent;
  }
  append(c) {
    c.parent = this;
    this.children.push(c);
  }
  *walk() {
    for (const c of this.children) {
      yield c;
      yield* c.walk();
    }
  }
  matches(sel) {
    return parseList(sel).some((p) => matchComplex(this, p));
  }
  querySelectorAll(sel) {
    const list = parseList(sel);
    return [...this.walk()].filter((el) => list.some((p) => matchComplex(el, p, this)));
  }
  querySelector(sel) {
    return this.querySelectorAll(sel)[0] ?? null;
  }
}
const h = (tag, cls, attrs, ...children) => new El(tag, cls, attrs ?? {}, children);
const many = (n, f) => Array.from({ length: n }, (_, k) => f(k));

/** A scene carrying every hook class in §6.2, plus the copy column's blocks. */
function scene(kind, enter = "pan") {
  return h(
    "section",
    "ps-scene",
    { "data-kind": kind, "data-enter": enter, "data-layout": "split" },
    h("span", "ps-seam"),
    h("div", "ps-bg", null, h("div", "ps-field"), h("span", "ps-bigtype")),
    h("div", "ps-shutter", null, h("span", "ps-shutter-act")),
    h(
      "div",
      "ps-frame",
      null,
      h(
        "div",
        "ps-fg",
        null,
        h(
          "div",
          "ps-copy",
          null,
          h("p", "annot ps-eyebrow"),
          h("h2", "ps-h"),
          h("p", "ps-body"),
          h("ul", "ps-features", null, ...many(4, () => h("li"))),
          h("ul", "ps-cases", null, ...many(4, () => h("li", "ps-case"))),
          h("dl", "ps-facts", null, ...many(6, () => h("div", "ps-fact"))),
          h("dl", "ps-faq", null, ...many(4, () => h("div", "ps-qa"))),
          h("p", "annot ps-sectors"),
          h("div", "ps-ctas"),
        ),
      ),
      h(
        "div",
        "ps-mid",
        null,
        h("span", "ps-shadow"),
        h(
          "div",
          "ps-module",
          null,
          h(
            "div",
            "ps-stage3d",
            null,
            h("figure", "screen", null, h("ol", "callouts", null, ...many(3, () => h("li", "callout", null, h("span", "callout-line"), h("span", "callout-label"))))),
            h("div", "viz-split-cols", null, h("div", "viz-col", null, ...many(6, () => h("li", "viz-node"))), h("div", "viz-divide"), h("div", "viz-col", null, ...many(6, (k) => h("li", k % 3 ? "viz-node" : "viz-node is-warn")))),
            h("div", "viz-lanes", null, ...many(4, () => h("div", "viz-lane")), h("svg", "viz-lane-path")),
            h("ul", "viz-tiles", null, ...many(9, () => h("li", "viz-tile"))),
            h("div", "viz-flow", null, ...many(5, () => h("div", "viz-box")), ...many(4, () => h("span", "viz-edge")), h("div", "viz-rework")),
            h("span", "viz-rail"),
            h("ol", "viz-stations", null, ...many(5, () => h("li", "viz-station", null, h("span", "viz-station-tick"), h("span", "viz-station-n"), h("span", "viz-station-l"), h("span", "viz-station-copy")))),
            h("ul", "viz-grid-list", null, ...many(6, (k) => h("li", "", { "data-d": String(Math.floor(k / 2) + (k % 2)) }))),
            h("ul", "viz-layers", null, ...many(4, (k) => h("li", "viz-layer", { style: `--i:${k}` }, h("span", "viz-layer-name")))),
            h("div", "viz-wall", null, ...many(6, (k) => h("span", "viz-cam", { "data-order": String((k * 7) % 6) })), h("span", "viz-scan")),
            h("div", "viz-phone-body", null, ...many(4, () => h("span", "viz-phone-row"))),
            h("ul", "viz-records", null, ...many(5, () => h("li", "viz-record", null, h("span", "viz-record-rule")))),
            h("div", "viz-system", null, h("span", "viz-hub"), ...many(6, () => h("li", "viz-sys-node"))),
            h("ul", "viz-ribbon", null, ...many(5, () => h("li", "viz-ribbon-word"))),
            h("ul", "viz-cases", null, ...many(6, () => h("li", "viz-case"))),
            h("div", "viz-ports", null, ...many(4, () => h("li", "port-in", null, h("span", "port-wire"))), h("p", "port-core"), ...many(3, () => h("li", "port-out", null, h("span", "port-wire")))),
            h("div", "viz-boundary", null, ...["top", "right", "bottom", "left"].map((e) => h("span", "boundary-edge", { "data-edge": e })), ...many(4, () => h("li", "boundary-node")), h("p", "boundary-caption")),
            h("ol", "chain-nodes", null, ...many(5, (k) => h("li", "chain-node", null, ...(k ? [h("span", "chain-edge")] : []), h("span", "chain-label"))), h("ul", "chain-branches")),
            h("div", "viz-columns", null, ...many(3, () => h("div", "viz-column", null, h("ul", "", null, ...many(4, () => h("li")))))),
            h("a", "next-card"),
          ),
        ),
      ),
    ),
    h("div", "ps-near", null, h("span", "ps-near-label")),
  );
}

/* ---- a fake timeline ------------------------------------------------------ */

function timeline() {
  const calls = [];
  return {
    calls,
    fromTo(targets, from, to, pos) {
      calls.push({ targets: [targets].flat(), from, to, pos, end: pos + to.duration });
      return this;
    },
    duration() {
      return calls.reduce((m, c) => Math.max(m, c.end), 0);
    },
  };
}

const mapper = (r) => (p) => (r === "first" ? (p < 0.5 ? null : (p - 0.5) * 2) : r === "last" ? (p > 0.5 ? null : p * 2) : p);
/** Timeline position back to scene-local p. */
const unmap = (r) => (t) => (r === "first" ? 0.5 + t / 2 : r === "last" ? t / 2 : t);
const ctx = { W: () => 1366, H: () => 657 };

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
};

/* ---- the assertions themselves -------------------------------------------- */

test("an entrance ending in the rest band throws", () => {
  assert.throws(() => assertWindow(0.3, 0.47), /entrance/);
  assert.throws(() => assertWindow(0.2, 0.6), /entrance/);
  assert.doesNotThrow(() => assertWindow(0.1, 0.46));
  assert.doesNotThrow(() => assertWindow(0.12, 0.4601));
});

test("an exit starting in the rest band throws", () => {
  assert.throws(() => assertWindow(0.5, 0.8), /exit/);
  assert.throws(() => assertWindow(0.53, 0.9), /exit/);
  assert.doesNotThrow(() => assertWindow(0.54, 0.92));
  assert.doesNotThrow(() => assertWindow(0.5399, 1));
});

test("a window past the end of the timeline throws", () => {
  assert.throws(() => assertWindow(0.6, 1.02), /outside/);
  assert.throws(() => assertWindow(-0.05, 0.3), /outside/);
  assert.throws(() => assertWindow(0.4, 0.3), /outside/);
});

test("layer wrappers are never choreography targets (I7)", () => {
  for (const cls of ["ps-bg", "ps-mid", "ps-near", "ps-scene", "ps-track", "ps-floor-grid"]) {
    assert.throws(() => assertTargets([h("div", cls)], { x: 10 }), /layer wrapper/, cls);
    assert.throws(() => assertTargets([h("div", cls)], { opacity: 0 }), /layer wrapper/, cls);
  }
  assert.doesNotThrow(() => assertTargets([h("div", "ps-stage3d")], { x: 10, rotationY: 4 }));
  assert.doesNotThrow(() => assertTargets([h("li", "viz-tile")], { y: 10, opacity: 0 }));
});

test("only transforms and opacity are written, not even transform-origin (I3, P-20)", () => {
  for (const vars of [{ transformOrigin: "0 50%" }, { filter: "blur(2px)" }, { width: 10 }, { autoAlpha: 0 }]) {
    assert.throws(() => assertTargets([h("li", "viz-tile")], vars), /only transforms and opacity/, Object.keys(vars)[0]);
  }
  assert.doesNotThrow(() => assertTargets([h("li", "viz-tile")], { scaleX: 0, rotationX: 72, transformPerspective: 900, ease: "power2.out" }));
});

test("the shadow may be faded but not moved", () => {
  assert.doesNotThrow(() => assertTargets([h("span", "ps-shadow")], { opacity: 0, ease: "power1.out" }));
  assert.throws(() => assertTargets([h("span", "ps-shadow")], { opacity: 0, x: 4 }), /faded/);
});

test("headings move but never fade (I2)", () => {
  assert.doesNotThrow(() => assertTargets([h("h2", "ps-h")], { x: 40 }));
  assert.throws(() => assertTargets([h("h2", "ps-h")], { x: 40, opacity: 0 }), /heading/);
  assert.throws(() => assertTargets([h("h1", "ps-h ps-h1")], { opacity: 1 }), /heading/);
});

test("span() throws on a layer-wrapper target and on a rest-band window", () => {
  const s = scene("intro");
  assert.throws(() => span(timeline(), mapper("full"), 0.1, 0.4, s.querySelector(".ps-mid"), { x: 0 }, { x: 10 }), /layer wrapper/);
  assert.throws(() => span(timeline(), mapper("full"), 0.1, 0.5, s.querySelector(".ps-stage3d"), { x: 0 }, { x: 10 }), /rest band/);
});

test("span() maps through the first/last halves and never renders an exit early", () => {
  const s = scene("intro");
  const el = s.querySelector(".ps-stage3d");
  const first = timeline();
  span(first, mapper("first"), 0.12, 0.46, el, { x: 9 }, { x: 0 });
  assert.equal(first.calls.length, 0, "the first scene has no entrance");
  span(first, mapper("first"), 0.56, 0.9, el, { x: 0 }, { x: 9 });
  assert.equal(first.calls.length, 1);
  assert.equal(first.calls[0].to.immediateRender, false);
  assert.ok(Math.abs(first.calls[0].pos - 0.12) < 1e-9 && Math.abs(first.calls[0].end - 0.8) < 1e-9);
  const last = timeline();
  span(last, mapper("last"), 0.56, 0.9, el, { x: 0 }, { x: 9 });
  assert.equal(last.calls.length, 0, "the last scene has no exit");
});

test("cascade() fits its last item before the rest band", () => {
  const tl = timeline();
  const items = many(14, () => h("li", "viz-node"));
  cascade(tl, mapper("full"), items, 0.18, 0.03, 0.14, { y: 10 }, { y: 0 });
  assert.equal(tl.calls.length, 14);
  assert.ok(Math.max(...tl.calls.map((c) => c.end)) <= 0.4601);
});

/* ---- every kind, every transition, every position ------------------------- */

const KINDS = Object.keys(CHOREO);
assert.equal(KINDS.length, 15, "one choreography per scene kind");

for (const kind of KINDS) {
  test(`CHOREO.${kind} keeps the rest band free (first, middle, last)`, () => {
    for (const range of ["first", "full", "last"]) {
      for (const enter of ["pan", "dolly", "wipe", "type"]) {
        const s = scene(kind, enter);
        const tl = timeline();
        nearLabel(tl, s, mapper(range));
        CHOREO[kind](tl, s, mapper(range), ctx);
        ENTER[enter]?.(tl, s, mapper(range), ctx);
        assert.ok(tl.duration() <= 1 + 1e-9, `${kind}/${range}/${enter} runs past the end (${tl.duration()})`);
        for (const c of tl.calls) {
          const p0 = unmap(range)(c.pos);
          const p1 = unmap(range)(c.end);
          const inBand = p1 > 0.4601 + 1e-9 && p0 < 0.5399 - 1e-9;
          assert.ok(!inBand, `${kind}/${range}/${enter}: [${p0.toFixed(3)}, ${p1.toFixed(3)}] touches the rest band`);
          if (p0 >= 0.5) assert.equal(c.to.immediateRender, false, `${kind}: an exit renders early`);
          for (const k of Object.keys({ ...c.from, ...c.to })) {
            assert.ok(
              /^(x|y|z|xPercent|yPercent|scale|scaleX|scaleY|rotationX|rotationY|opacity|transformOrigin|transformPerspective|ease|duration|immediateRender)$/.test(k),
              `${kind}: writes "${k}" (only transform and opacity, I3)`,
            );
          }
        }
        if (range === "full" && kind !== "faq") assert.ok(tl.calls.length > 4, `${kind} does almost nothing`);
      }
    }
  });
}

test("each kind has its own shot (no two kinds write the same tween list)", () => {
  const sig = (kind) => {
    const tl = timeline();
    CHOREO[kind](tl, scene(kind), mapper("full"), ctx);
    return tl.calls.map((c) => `${c.targets.map((t) => t.className).join("+")}@${c.pos.toFixed(3)}`).join("|");
  };
  const seen = new Map();
  for (const k of KINDS) {
    const s = sig(k);
    assert.ok(!seen.has(s), `${k} is identical to ${seen.get(s)}`);
    seen.set(s, k);
  }
});

console.log(`selftest-choreo: ${passed} passed`);
