/* M3 · Intelligent ecosystem: the formation library. ONE source for the build-time hero poster (node),
   the runtime WebGL scene and the no-WebGL / small-screen SVG fallback, so all three draw the same shapes.

   Visual language (meerana-webgl-scenes): the logo's isometric cell. Every formation is built from the
   same pool of matte cells seen through a true isometric camera (from +x +y +z), so one set of building
   blocks becomes a document stack, a process, a gate, a camera, the product layer, a site and a dashboard.
   Units: one cell = 1. No colour values live here: tones are indices that the page resolves from tokens.css.
   Lines between products are NOT drawn (scroll-choreography rule: no integration that the dossiers do not
   document). Flow lines only connect parts of ONE documented workflow (camera → alert → task → record). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.M3Scene = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var S2 = Math.SQRT2, S3 = Math.sqrt(3), S6 = Math.sqrt(6);
  var R = [1 / S2, 0, -1 / S2], U = [-1 / S6, 2 / S6, -1 / S6], F = [1 / S3, 1 / S3, 1 / S3];
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function W(X, Y) { return [R[0] * X + U[0] * Y, R[1] * X + U[1] * Y, R[2] * X + U[2] * Y]; }   // screen plane → world

  // tones: resolved by the page from CSS custom properties (see .m3p .t* rules in the template)
  var T = { base: 0, accent: 1, white: 2, blue: 3, danger: 4, smoke: 5, orange: 6, copper: 7, azure: 8, aqua: 9, ghost: 10, zone: 11 };
  var CUBE = [0.86, 0.86, 0.86], TILE = [0.92, 0.16, 0.92], NONE = [0, 0, 0];

  function mk(family, opts) {
    var f = { family: family, cells: [], lines: [], anchors: {}, anim: null, dim: 1, rect: 'main', sweep: 'diag', frame: null };   // frame: tag of the cells the camera fits (others may run past the frame)
    for (var k in opts || {}) f[k] = opts[k];
    return f;
  }
  function C(f, x, y, z, t, s, g, extra) {
    var c = { p: [x, y, z], s: s || CUBE, t: t === undefined ? T.base : t, g: g || '' };
    for (var k in extra || {}) c[k] = extra[k];
    f.cells.push(c); return c;
  }
  function tiles(f, x0, x1, z0, z1, t, g, y) {
    for (var x = x0; x <= x1; x++) for (var z = z0; z <= z1; z++) C(f, x, (y || 0) - 0.42, z, t === undefined ? T.ghost : t, TILE, g || 'floor');
  }
  // one object per part, stacked flush (bottom to top): [height, tone, group, extra]. Each lower part is a hair
  // narrower and overlaps the next by .02, so the joint has no gap, no coplanar z-fight and (seam mask) no chamfer.
  function stack(f, x, z, w, d, y0, parts) {
    var y = y0, out = [];
    parts.forEach(function (pt, i) { var top = i === parts.length - 1, h = pt[0] + (top ? 0 : 0.02), k = top ? 0 : 0.004;
      out.push(C(f, x, y + h / 2, z, pt[1], [w - k, h, d - k], pt[2], pt[3])); y += pt[0]; });
    return out;
  }
  function phone(f, x, y, z, screen) {   // one slab with a screen inset on its face (towards the camera)
    C(f, x, y, z, T.base, [1.62, 2.74, 0.16], 'phone');
    C(f, x, y + 0.04, z + 0.1, T.white, [1.4, 2.36, 0.04], 'phone', screen);
  }
  function L(f, pts, t, a, flow, g, depth) { f.lines.push({ pts: pts, t: t, a: a, flow: !!flow, g: g || 0, depth: !!depth }); }
  function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function qb(a, c, b, n) { var o = []; for (var i = 0; i <= n; i++) { var t = i / n; o.push(lerp3(lerp3(a, c, t), lerp3(c, b, t), t)); } return o; }
  function arc(a, b, h, n) { var o = []; for (var i = 0; i <= n; i++) { var t = i / n, p = lerp3(a, b, t); p[1] += 4 * h * t * (1 - t); o.push(p); } return o; }
  function seg(a, b) { return [a, b]; }
  // rotations: unit quaternions [x, y, z, w]. A cell may carry a rest orientation (q), a hinge for its micro-story
  // (hinge: pivot p, axis ax, start offset a0 in radians, timing t = [start, duration] ms after the formation settles;
  // the rest state is the story's END state, so posters and reduced motion show the outcome) and a blink window.
  function qAxis(ax, a) { var s = Math.sin(a / 2); return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(a / 2)]; }
  function qMul(a, b) { return [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]]; }
  function qRot(q, v) {
    var x = v[0], y = v[1], z = v[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
    return [ix * qw - iw * qx - iy * qz + iz * qy, iy * qw - iw * qy - iz * qx + ix * qz, iz * qw - iw * qz - ix * qy + iy * qx];
  }
  function add3(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function clone(f, family, opts) {   // variant of a family: same cells in the same order (stable morph mapping)
    var g = mk(family || f.family, {});
    g.cells = f.cells.map(function (c) { var d = {}; for (var k in c) d[k] = c[k]; d.p = c.p.slice(); d.s = c.s.slice(); return d; });
    g.lines = []; g.anchors = {}; g.anim = f.anim; g.dim = f.dim; g.rect = f.rect; g.sweep = f.sweep; g.frame = f.frame;
    for (var k in opts || {}) g[k] = opts[k];
    return g;
  }
  function rnd(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  var FM = {};

  /* ---- 0 · hero: the intelligence core. A 5×5×5 open lattice reads as the logo's hexagon in isometric view.
     Four input streams flow into it (documents, processes, devices, cameras): the four rapid moments. ---- */
  (function () {
    var f = mk('hero', { anim: 'breathe' }), sp = 1.75;
    var skip = { '2,2,-2': 1, '-2,2,2': 1, '2,-2,2': 1, '-2,-2,-2': 1, '2,-2,-2': 1 };
    var lift = { '0,2,0': 1.15, '1,2,-1': 0.7, '-1,2,1': 0.45, '2,0,-1': 0.5 };
    for (var i = -2; i <= 2; i++) for (var j = -2; j <= 2; j++) for (var k = -2; k <= 2; k++) {
      var key = i + ',' + j + ',' + k; if (skip[key]) continue;
      var p = [i * sp, j * sp, k * sp], t = T.base;
      if (key === '2,2,2') { t = T.accent; p = [p[0] + 0.55, p[1] + 0.55, p[2] + 0.55]; }
      else if (lift[key]) { t = T.white; if (j === 2) p[1] += lift[key]; else p[0] += lift[key]; }
      C(f, p[0], p[1], p[2], t, [0.9, 0.9, 0.9], 'core');
    }
    // streams: [moment index, screen angle°]. Three parallel lines each; they end at the lattice silhouette.
    [[0, 104], [1, 228], [2, 318], [3, 14]].forEach(function (s) {
      var a = s[1] * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      for (var o = -1; o <= 1; o++) {
        var ox = -sa * o * 0.5, oy = ca * o * 0.5, r0 = (s[1] > 90 && s[1] < 270 ? 10.5 : 13) - Math.abs(o) * 0.8;
        var start = W(ca * r0 + ox, sa * r0 + oy), end = W(ca * 6.2 + ox * 0.3, sa * 6.2 + oy * 0.3);
        var ctrl = W(ca * 9.5 - sa * 2.4 + ox, sa * 9.5 + ca * 2.4 + oy);
        L(f, qb(start, ctrl, end, 30), T.accent, o === 0 ? 0.75 : 0.42, true, s[0] + 1);
      }
    });
    FM.hero = f;
  })();

  /* ---- 1 · AI (AI in a Box): a stack of documents; the top sheet's lines are read, one clause is flagged,
     a draft card waits beside it for a person to approve [EV-520]. ---- */
  (function () {
    var f = mk('ai', { anim: 'scan' }), rows = [6, 5, 6, 0, 6, 6, 4, 0], flag = 4;   // one clause flagged (one cyan)
    for (var sh = 0; sh < 3; sh++) { var off = (2 - sh) * 1.1; C(f, -off, sh * 1.25, off, T.base, [5.96, 0.22, 7.96], 'sheet'); }
    // the top sheet's text: one thin strip per line, laid on the page; the flagged clause in accent
    for (var z = 0; z < 8; z++) if (rows[z]) C(f, -3 + rows[z] / 2, 2.5 + 0.16, z - 3.5, z === flag ? T.accent : T.white, [rows[z] - 0.04, 0.08, 0.36], 'text', { row: z });
    C(f, 5.4, 3.4, -0.9, T.blue, [2.9, 0.22, 3.9], 'draft');   // the draft: proposed, not sent
    [-1.4, -0.4].forEach(function (dz) { C(f, 4.9, 3.55, dz, T.white, [1.9, 0.08, 0.5], 'draft'); });
    L(f, arc([2.6, 2.7, 1.0], [4.2, 3.55, -0.9], 0.9, 20), T.accent, 0.8, true, 1);
    FM.ai = f;
  })();

  /* ---- 2 · Automation (Tasree3): a process on a plate. Work queues before one step; the slow step is
     raised in Tasree3 orange, and a token walks the route [EV-401–405]. ---- */
  (function () {
    var f = mk('auto', { anim: 'token' });
    tiles(f, -5, 5, -3, 3);
    var nodes = [[-4, 1], [-2, -2], [0.5, 1], [2.5, -2], [4.5, 1]];
    nodes.forEach(function (n, i) {
      stack(f, n[0], n[1], 1.9, 1.9, -0.45, i === 2 ? [[1.0, T.base, 'node' + i], [0.9, T.orange, 'node' + i]] : [[0.9, T.white, 'node' + i]]);
    });
    [[-1.1, 0.7], [-1.6, 0.0], [-0.9, -0.3]].forEach(function (q) { C(f, q[0], -0.12, q[1] + 0.6, T.white, [0.42, 0.42, 0.42], 'queue'); });
    var path = nodes.map(function (n, i) { return [n[0], (i === 2 ? 2 : 1) + 0.2, n[1]]; });
    for (var i = 0; i < path.length - 1; i++) L(f, arc(path[i], path[i + 1], 0.7, 16), i === 1 ? T.orange : T.accent, 0.55, true, 1);
    f.path = []; for (i = 0; i < path.length - 1; i++) f.path = f.path.concat(arc(path[i], path[i + 1], 0.7, 16).slice(i ? 1 : 0));
    C(f, f.path[0][0], f.path[0][1] + 0.25, f.path[0][2], T.accent, [0.46, 0.46, 0.46], 'token');
    FM.auto = f;
  })();

  /* ---- 3 · IoT (Wasel): a perimeter, a gate with its barrier arm (Wasel copper), the controller and a phone.
     Signals run phone → controller → arm: open, monitor and manage gates from your phone [EV-100, EV-103]. ---- */
  (function () {
    var f = mk('iot', { anim: 'none' });
    tiles(f, -6, 6, -3, 3);
    [-4, 4].forEach(function (wx) { C(f, wx, 0, -1, T.base, [4.92, 0.86, 0.5], 'wall'); });
    [-1.2, 1.2].forEach(function (px) { stack(f, px, -1, 0.5, 0.5, -0.46, [[2.0, T.base, 'post'], [0.92, T.white, 'post']]); });
    // micro-story (after the formation settles): the phone pulses (420 ms) → the controller blinks (160 ms) → the
    // barrier arm swings open on its hinge at the left post (0 → 78°, 420 ms). Rest state = open.
    var hp = [-1.2, 2.25, -1], ZA = [0, 0, 1], open = qAxis(ZA, 78 * Math.PI / 180), swing = { p: hp, ax: ZA, a0: -78 * Math.PI / 180, t: [580, 420] };
    var ao = add3(hp, qRot(open, [1.2, 0, 0]));
    C(f, ao[0], ao[1], ao[2], T.copper, [1.9, 0.2, 0.2], 'arm', { q: open, hinge: swing });
    stack(f, -2.4, 0.3, 0.7, 0.55, -0.46, [[1.0, T.base, 'ctrl'], [0.92, T.blue, 'ctrl', { blink: [420, 160] }]]);
    phone(f, 3.51, 1.42, 2.2, { blink: [0, 420] });
    L(f, arc([3.5, 3.3, 2.2], [-2.4, 1.6, 0.3], 2.2, 28), T.accent, 0.6, true, 1);
    L(f, arc([-2.4, 1.6, 0.3], [-1.2, 2.55, -1], 0.6, 12), T.copper, 0.6, true, 1);
    FM.iot = f;
  })();

  /* ---- 4 · Security (Yisbir): a camera on a mast watches a restricted zone on the ground; one figure is
     inside it. Outline forms only, no identity cues (DL-P07) [EV-134, EV-537, EV-444]. ---- */
  (function () {
    var f = mk('sec', { anim: 'none', coneAt: 420 });
    for (var x = -6; x <= 6; x++) for (var z = -4; z <= 4; z++) {
      var inZone = x >= 0 && x <= 3 && z >= -1 && z <= 2;   // zone tiles keep a danger rim (edge alpha above the rim threshold)
      C(f, x, -0.42, z, inZone ? T.zone : T.ghost, TILE, inZone ? 'zone' : 'floor', inZone ? { ea: 1.15 } : null);
    }
    C(f, -5, 2.5, -3, T.base, [0.4, 5.92, 0.4], 'mast');
    // the camera head sits on the mast top, aimed at the zone (yaw, then pitched down); micro-story: it pans the
    // last 12° onto the zone (420 ms), then the lens blinks as the bracket locks (160 ms). Rest state = on target.
    var hp = [-5, 5.62, -3], YA = [0, 1, 0], aim = Math.atan2(0.5 - hp[2], 1.5 - hp[0]);
    var qh = qMul(qAxis(YA, -aim), qAxis([0, 0, 1], -0.5)), pan = { p: hp, ax: YA, a0: -12 * Math.PI / 180, t: [0, 420] };
    var hc = add3(hp, qRot(qh, [0.42, 0, 0])), lens = add3(hp, qRot(qh, [1.1, 0, 0]));
    C(f, hc[0], hc[1], hc[2], T.white, [1.2, 0.56, 0.56], 'cam', { q: qh, hinge: pan });
    C(f, lens[0], lens[1], lens[2], T.accent, [0.3, 0.34, 0.34], 'lens', { q: qh, hinge: pan, blink: [420, 160] });
    [[1.6, 0.6, T.white], [-2.2, 2.6, T.base], [4.6, -2.4, T.base]].forEach(function (m) {
      C(f, m[0], 0.1, m[1], m[2], [0.5, 1.1, 0.5], 'figure'); C(f, m[0], 0.95, m[1], m[2], [0.36, 0.36, 0.36], 'figure');
    });
    var q = [[-0.5, -0.34, -1.5], [3.5, -0.34, -1.5], [3.5, -0.34, 2.5], [-0.5, -0.34, 2.5]];
    q.forEach(function (c, i) { L(f, seg(lens, c), T.accent, 0.45, false, 0, true); L(f, seg(c, q[(i + 1) % 4]), T.danger, 0.9, false, 0, true); });
    f.cone = { apex: lens, base: q };   // the detection cone, drawn as a soft additive volume over these lines
    f.anchors.target = [1.6, 0.4, 0.6];
    FM.sec = f;
  })();

  /* ---- 5 · Meerana Intelligence Layer: seven plates, bottom to top (the reviewer's order, with Wasel beside
     Asset Tracking, the other IoT product). The active plate slides out and takes its product colour; the others
     keep a product-coloured edge only. Structure lines are static (a frame), never flows between products. ---- */
  var PT = [T.azure, T.orange, T.accent, T.aqua, T.copper, T.white, T.blue];   // Mandoobee, Tasree3, Nazo, Yisbir, Wasel, Asset Tracking, AI in a Box
  var LAYERS = PT.length, GAP = 1.7;
  function layer(active) {
    var f = mk('layer', { anim: 'none' });
    for (var k = 0; k < LAYERS; k++) { var on = active === k;
      C(f, on ? 1.6 : 0, k * GAP, 0, on ? PT[k] : T.base, [5.92, 0.38, 5.92], 'plate' + k, { e: PT[k], ea: on ? 1 : (active < 0 ? 0.75 : 0.42) });
    }
    var top = (LAYERS - 1) * GAP + 0.4;
    [[-3.1, -3.1], [3.1, -3.1], [-3.1, 3.1], [3.1, 3.1]].forEach(function (c) { L(f, seg([c[0], -0.4, c[1]], [c[0], top, c[1]]), T.ghost, 0.9, false, 0, true); });
    if (active >= 0) f.anchors.plate = [4.7, active * GAP + 0.3, 2.6];
    return f;
  }
  FM.layerAll = layer(-1);
  for (var li = 0; li < LAYERS; li++) FM['layer' + li] = layer(li);

  /* ---- 5b · Asset Tracking (illustrative, poster only): pallets carry RFID tags; a reader on a post picks them up
     [EV-151]. No product screens exist yet, so the panel shows this drawing with an "illustrative" label. ---- */
  (function () {
    var f = mk('assets', { anim: 'none' });
    tiles(f, -5, 5, -3, 3);
    [[-3, -1], [0, 1.2], [3, -1.2]].forEach(function (pl, i) {
      for (var dx = -0.5; dx <= 0.5; dx += 1) for (var dz = -0.5; dz <= 0.5; dz += 1) {
        C(f, pl[0] + dx, -0.2, pl[1] + dz, T.base, [0.96, 0.2, 0.96], 'pallet');
        for (var y = 0; y < (i === 1 ? 2 : 1); y++) C(f, pl[0] + dx, 0.42 + y * 0.9, pl[1] + dz, y === (i === 1 ? 1 : 0) ? T.white : T.base, [0.86, 0.86, 0.86], 'box');
      }
      C(f, pl[0] + 1.02, 0.42, pl[1] + 0.5, T.accent, [0.12, 0.34, 0.34], 'tag');
    });
    C(f, -4.6, 1.5, 2.6, T.base, [0.36, 3.92, 0.36], 'reader');
    C(f, -4.6, 4.0, 2.6, T.blue, [0.7, 0.4, 0.7], 'reader');
    [[-2.0, 0.42, -0.5], [1.0, 1.32, 1.7], [4.0, 0.42, -0.7]].forEach(function (t) { L(f, arc([-4.6, 4.1, 2.6], t, 0.8, 18), T.accent, 0.55, true, 1); });
    FM.assets = f;
  })();

  /* ---- 6 · Built in the UAE. Engineered for the world: a lattice ground with the four offices the live
     website lists (Dubai headquarters, London, Egypt, Chennai) [EV-532], placed by longitude/latitude. ---- */
  (function () {
    var f = mk('world', { anim: 'none' });
    tiles(f, -9, 9, -6, 6);
    function at(lon, lat) { return [Math.round((lon / 80) * 16 - 8), Math.round(-(lat - 13) / 38.5 * 10 + 5)]; }
    var offices = [['dubai', 55.3, 25.2, 4, T.accent], ['london', -0.1, 51.5, 2, T.white], ['egypt', 31.2, 30.0, 2, T.white], ['chennai', 80.3, 13.1, 2, T.white]];
    var tops = {};
    offices.forEach(function (o) {
      var g = at(o[1], o[2]);
      stack(f, g[0], g[1], 0.72, 0.72, -0.46, [[o[3] - 1, T.base, 'office'], [0.92, o[4], 'office']]);
      tops[o[0]] = [g[0], o[3] - 0.4, g[1]]; f.anchors[o[0]] = [g[0], o[3] + 0.2, g[1]];
    });
    ['london', 'egypt', 'chennai'].forEach(function (k) {
      var a = tops.dubai, b = tops[k], d = Math.hypot(a[0] - b[0], a[2] - b[2]);
      L(f, arc(a, b, 1.6 + d * 0.22, 36), T.accent, 0.6, true, 1);
    });
    FM.world = f;
  })();

  /* ---- 7 · The story site: a storage bay after hours [EV-537 "Storage Areas"]. Variants share cells.
     Micro-stories in the live beats: on "AI detects" the camera pans the last 12° onto the plume, the lens blinks
     as the bracket locks and the cone lands on the smoke; on "Automation acts" the phone pulses, then the task. ---- */
  var BHP = [4.6, 4.62, -4.4], YA = [0, 1, 0], BQ = qMul(qAxis(YA, -Math.atan2(0 - BHP[2], -1.6 - BHP[0])), qAxis([0, 0, 1], -0.42));
  var BCAM = add3(BHP, qRot(BQ, [0.4, 0, 0])), LENS = add3(BHP, qRot(BQ, [1.02, 0, 0]));
  // the plume's visual centre (puffs are largest low down: area-weighted mean height fraction ≈ .35), where the cone
  // lands and the page's bracket and chip anchor, so cone, bracket and chip frame the same smoke
  var SMOKE = [-1.15, 3.75, 0];
  var PAN = -12 * Math.PI / 180, BQ1 = qMul(qAxis(YA, PAN), BQ), PANH = { p: BHP, ax: YA, a0: PAN, t: [0, 420] };
  function coneBase(apex, c, hu, hv) {   // a frame around c, square to the line of sight (horizontal axis) and upright
    var dx = c[0] - apex[0], dz = c[2] - apex[2], l = Math.hypot(dx, dz) || 1, u = [dz / l * hu, 0, -dx / l * hu];
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (k) { return [c[0] + u[0] * k[0], c[1] + hv * k[1], c[2] + u[2] * k[0]]; });
  }
  var bay = (function () {
    var f = mk('bay', { anim: 'smoke', dim: 0.55 }), r = rnd(1704);
    tiles(f, -6, 5, -4, 4);
    C(f, -0.895, 0.5, -5, T.base, [12.71, 1.92, 0.5], 'wall');   // an L of two walls, flush at the corner
    C(f, -7, 0.5, -0.145, T.base, [0.5, 1.92, 9.21], 'wall');
    [-2.5, 0, 2.5].forEach(function (rz) {
      for (var s = 0; s < 3; s++) C(f, -1.5, s + 0.1, rz, T.base, [5.94, 0.14, 0.7], 'shelf');   // one plank per level
      [-4.52, 1.52].forEach(function (ex) { C(f, ex, 0.98, rz, T.base, [0.08, 2.64, 0.7], 'rack'); });
      for (var x = -4; x <= 1; x++) for (s = 0; s < 3; s++)
        if (r() < 0.55) C(f, x, s + 0.42, rz, r() < 0.25 ? T.white : T.base, [0.58, 0.5, 0.5], 'box');
    });
    C(f, 4.6, 2, -4.4, T.base, [0.36, 4.92, 0.36], 'mast');
    C(f, BCAM[0], BCAM[1], BCAM[2], T.base, [1.1, 0.52, 0.52], 'cam', { q: BQ });
    C(f, LENS[0], LENS[1], LENS[2], T.white, [0.28, 0.32, 0.32], 'lens', { q: BQ });
    for (var k = 0; k < 16; k++) {   // the plume: phase = height fraction; the static frame is a rising column
      var ph = k / 16, sz = 0.42 + r() * 0.36;
      C(f, -1.3 + (r() - 0.5) * 0.9 + ph * 0.7, 2.7 + ph * 3.4, (r() - 0.5) * 0.9, T.smoke, [sz, sz, sz], 'smoke', { ph: ph, sz: sz });
    }
    return f;
  })();
  FM.bay1 = (function () {   // the problem: the camera is there, but it looks 12° away from the plume
    var f = clone(bay, 'bay');
    f.cells.forEach(function (c) { if (c.g === 'cam' || c.g === 'lens') { c.q = BQ1; c.p = add3(BHP, qRot(BQ1, [c.g === 'cam' ? 0.4 : 1.02, 0, 0])); } });
    return f;
  })();
  FM.bay2 = (function () {   // the AI switches the light on: the camera pans onto the plume and flags it
    var f = clone(bay, 'bay', { dim: 0.82, coneAt: 420 });
    f.cells.forEach(function (c) { if (c.g === 'cam' || c.g === 'lens') { c.t = T.accent; c.hinge = PANH; } if (c.g === 'lens') c.blink = [420, 160]; });
    var q = coneBase(LENS, SMOKE, 0.95, 1.35);
    q.forEach(function (c) { L(f, seg(LENS, c), T.accent, 0.4, false, 0, true); });
    f.cone = { apex: LENS, base: q };
    f.anchors.smoke = SMOKE;
    return f;
  })();
  function endpoints(f, resolved, story) {   // the duty officer's phone and the response task, on a pad outside the bay
    for (var i = 0; i < 3; i++) for (var z = -3; z <= 2; z++) C(f, 7.4 + i, -0.42, z, T.ghost, TILE, 'pad');
    phone(f, 8.41, 1.42, 2.2, story ? { blink: [300, 420] } : null);
    C(f, 8.4, 0.1, -2.1, resolved ? T.accent : T.blue, [2.92, 0.22, 1.92], 'task', story ? { blink: [720, 160] } : null);
  }
  FM.bay3 = (function () {
    var f = clone(FM.bay2, 'bay', { dim: 0.7, coneAt: 0 });
    f.cells.forEach(function (c) { delete c.hinge; delete c.blink; });
    endpoints(f, false, true);
    L(f, arc(LENS, [8.4, 3.4, 2.2], 1.6, 26), T.accent, 0.65, true, 1);
    L(f, arc(LENS, [8.4, 0.5, -2.1], 1.2, 26), T.accent, 0.65, true, 1);
    f.anchors.phone = [8.4, 3.6, 2.2]; f.anchors.task = [8.4, 0.6, -2.1]; f.anchors.smoke = SMOKE;
    return f;
  })();
  FM.bay5 = (function () {
    var f = clone(bay, 'bay', { dim: 1, anim: 'none' });
    f.cells.forEach(function (c) { if (c.g === 'smoke') c.s = NONE.slice(); });
    endpoints(f, true, false);
    L(f, arc(LENS, [8.4, 0.5, -2.1], 1.2, 26), T.accent, 0.5, false, 1);
    f.anchors.task = [8.4, 0.6, -2.1];
    return f;
  })();

  /* ---- 8 · Dashboard: fire & smoke events by zone (x) and time band (z), 30 days, SAMPLE DATA.
     The same numbers are in the DOM table next to it; Bay 3 after hours is the insight. ---- */
  var ZONES = ['Bay 1', 'Bay 2', 'Bay 3', 'Loading', 'Office', 'Yard'], BANDS = ['00–06', '06–12', '12–18', '18–24'];
  var EVENTS = [[0, 1, 1, 0], [0, 0, 1, 0], [3, 0, 1, 3], [0, 2, 1, 0], [0, 0, 0, 0], [1, 0, 0, 1]];
  (function () {
    var f = mk('bars', { anim: 'none' });
    EVENTS.forEach(function (row, i) {
      row.forEach(function (n, j) {
        // one bar per value (a body and a flush cap). One cyan: the 18–24 cap the chip names; the other after-hours
        // bar (00–06) keeps a white cap with a cyan rim only.
        var x = (i - 2.5) * 1.9, z = (j - 1.5) * 1.9, hot = i === 2 && j === 3, late = i === 2 && j === 0;
        C(f, x, -0.42, z, T.ghost, [1.7, 0.16, 1.7], 'base');
        if (n) stack(f, x, z, 1.2, 1.2, -0.34, [[n * 0.95 - 0.39, T.base, 'bar', { zb: i }], [0.3, hot ? T.accent : T.white, 'cap', late ? { e: T.accent, zb: i } : { zb: i }]]);
      });
    });
    var x0 = -2.5 * 1.9 - 1.1, x1 = 2.5 * 1.9 + 1.1, z0 = -1.5 * 1.9 - 1.1, z1 = 1.5 * 1.9 + 1.1;
    L(f, seg([x0, -0.34, z1], [x1, -0.34, z1]), T.ghost, 1, false, 0, true);
    L(f, seg([x1, -0.34, z0], [x1, -0.34, z1]), T.ghost, 1, false, 0, true);
    f.anchors.peak = [(2 - 2.5) * 1.9, 3.3, (3 - 1.5) * 1.9];
    FM.bars = f;
  })();

  /* ---- 9 · What comes next: the core, smaller, on a lattice field that runs past the edge of the frame. ---- */
  (function () {
    var f = mk('next', { anim: 'wave', sweep: 'radial', frame: 'frame', fadeR: [3.6, 7.5] }), sp = 1.75;   // the field fades out under the CTA
    for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) for (var k = -1; k <= 1; k++)
      C(f, i * sp, j * sp + 1.6, k * sp, i === 1 && j === 1 && k === 1 ? T.accent : (j === 1 && (i + k) % 2 === 0 ? T.white : T.base), [1, 1, 1], 'frame');
    for (var x = -9; x <= 9; x++) for (var z = -9; z <= 9; z++) {
      var d = Math.hypot(x, z); if (d > 9.6) continue;
      C(f, x * 1.1, -1.9, z * 1.1, T.ghost, TILE, Math.max(Math.abs(x), Math.abs(z)) <= 3 ? 'frame' : 'field', { d: d });
    }
    FM.next = f;
  })();

  // ---------------------------------------------------------------- framing + sorting
  function ext(c) {   // half-extent of a cell on screen (isometric projection of its box)
    var h = [c.s[0] / 2, c.s[1] / 2, c.s[2] / 2];
    return [h[0] * Math.abs(R[0]) + h[1] * Math.abs(R[1]) + h[2] * Math.abs(R[2]), h[0] * Math.abs(U[0]) + h[1] * Math.abs(U[1]) + h[2] * Math.abs(U[2])];
  }
  function bbox(f) {
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, cx = 0, cy = 0, cz = 0, n = 0;
    f.cells.forEach(function (c) {
      if (!c.s[0] || (f.frame && c.g !== f.frame)) return;
      var X = dot(c.p, R), Y = dot(c.p, U), e = ext(c);
      x0 = Math.min(x0, X - e[0]); x1 = Math.max(x1, X + e[0]); y0 = Math.min(y0, Y - e[1]); y1 = Math.max(y1, Y + e[1]);
      cx += c.p[0]; cy += c.p[1]; cz += c.p[2]; n++;
    });
    var pad = 0.35;
    return { x0: x0 - pad, x1: x1 + pad, y0: y0 - pad, y1: y1 + pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad,
             cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, pivot: [cx / n, cy / n, cz / n] };
  }
  // Stable instance order per family: sort the family's first formation by screen x, so cells flow
  // sideways when the scene changes family, and stay put when only a variant changes.
  var famOrder = {};
  Object.keys(FM).forEach(function (name) {
    var f = FM[name];
    if (!famOrder[f.family]) {
      var idx = f.cells.map(function (c, i) { return i; });
      idx.sort(function (a, b) { var A = f.cells[a].p, B = f.cells[b].p; return (dot(A, R) - dot(B, R)) || (dot(A, U) - dot(B, U)); });
      famOrder[f.family] = idx;
    }
  });
  Object.keys(FM).forEach(function (name) {
    var f = FM[name], ord = famOrder[f.family], base = ord.length;
    var sorted = ord.map(function (i) { return f.cells[i]; });
    for (var i = base; i < f.cells.length; i++) sorted.push(f.cells[i]);   // variant extras keep their place at the end
    f.cells = sorted; f.name = name;
  });
  // Morph mapping (4.8): the bay is the hub of the story, so the one-formation families that morph to or from it
  // (offices → Problem, Dashboard ↔ story, Outcome → next) take their slots by greedy nearest neighbour against the
  // bay's cells: every cell travels to the closest free cell, so paths stay short and do not cross the frame. The
  // smoke's slots are kept for the Bay 3 bars only: on "Dashboard shows" the plume condenses into the after-hours bars.
  function d2(a, b) { var x = a[0] - b[0], y = a[1] - b[1], z = a[2] - b[2]; return x * x + y * y + z * z; }
  function greedy(cells, ci, hub, sj, slot, used) {
    var near = ci.map(function (i) { var m = Infinity; sj.forEach(function (j) { var v = d2(cells[i].p, hub[j].p); if (v < m) m = v; }); return m; });
    ci.map(function (i, k) { return k; }).sort(function (a, b) { return near[a] - near[b]; }).forEach(function (k) {
      var i = ci[k], best = -1, bd = Infinity;
      for (var q = 0; q < sj.length; q++) { var j = sj[q]; if (used[j]) continue; var v = d2(cells[i].p, hub[j].p); if (v < bd) { bd = v; best = j; } }
      if (best >= 0) { used[best] = 1; slot[i] = best; }
    });
  }
  function remap(f, hub, pre) {
    var cells = f.cells, m = hub.length, slot = cells.map(function () { return -1; }), used = new Uint8Array(m), out = [], j;
    function live(c) { return c && c.s[0] > 0; }
    var smoke = [], other = [];
    for (j = 0; j < m; j++) if (live(hub[j])) (hub[j].g === 'smoke' ? smoke : other).push(j);
    var ci = [], pi = [];
    cells.forEach(function (c, i) { if (live(c)) (pre && pre(c) ? pi : ci).push(i); });
    if (pi.length) greedy(cells, pi, hub, smoke, slot, used);
    greedy(cells, ci.concat(pi.filter(function (i) { return slot[i] < 0; })), hub, other, slot, used);
    for (j = 0; j < m; j++) out[j] = { p: hub[j].p.slice(), s: NONE.slice(), t: T.base, g: '' };   // empty slots
    cells.forEach(function (c, i) { if (slot[i] >= 0) out[slot[i]] = c; else if (live(c)) out.push(c); });
    f.cells = out;
  }
  remap(FM.world, FM.bay1.cells);
  remap(FM.bars, FM.bay3.cells, function (c) { return c.zb === 2; });
  remap(FM.next, FM.bay5.cells);
  Object.keys(FM).forEach(function (name) { FM[name].box = bbox(FM[name]); });
  var N = 0; Object.keys(FM).forEach(function (k) { N = Math.max(N, FM[k].cells.length); });

  // ---------------------------------------------------------------- tone ramps + bake (engine-independent)
  // KEEP: 1 = a saturated tone whose shadow sides keep their chroma (orange stays orange, not rust); 0 = a neutral
  // tone whose sides turn cool and blue-shifted, and whose lit colour is capped at navy-200 (nothing outshines the copy).
  // RIM: tones that keep a crisp edge in their own colour (accent, danger, product colours); every other cell
  // gets a lit chamfer instead of an outline.
  var KEEP = [0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0];
  var RIM = [0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1];
  function isTile(c) { return c.s[1] <= 0.2 && c.s[0] >= 0.9 && c.s[2] >= 0.9; }
  function boxOf(c) { var h = [c.s[0] / 2, c.s[1] / 2, c.s[2] / 2];
    if (c.q) { var a = qRot(c.q, [h[0], 0, 0]), b = qRot(c.q, [0, h[1], 0]), d = qRot(c.q, [0, 0, h[2]]);
      h = [0, 1, 2].map(function (i) { return Math.abs(a[i]) + Math.abs(b[i]) + Math.abs(d[i]); }); }
    return [c.p[0] - h[0], c.p[1] - h[1], c.p[2] - h[2], c.p[0] + h[0], c.p[1] + h[1], c.p[2] + h[2]]; }
  // Per cell: ambient occlusion of its +x, +y and +z faces (the three the isometric camera sees), sampled just in
  // front of each face (a floor, a wall or an overhang darkens it; a coplanar neighbour does not); whether it stands
  // on a support (a cell of another group whose top meets its foot and that reaches past its side faces), which
  // drives a narrow contact darkening at the foot of its side faces; and a seam mask: for each visible face, which
  // of its four edges continue flush into a neighbour (a cap on its pillar, a part on its stand), so the engine
  // draws no chamfer or rim there. Also the floor plane that contact shadows fall on, and which cells cast one
  // (floor tiles do not). Cached on the formation.
  var W9 = [[-1, -1, 0.06], [0, -1, 0.14], [1, -1, 0.06], [-1, 0, 0.14], [0, 0, 0.22], [1, 0, 0.14], [-1, 1, 0.06], [0, 1, 0.14], [1, 1, 0.06]];
  var AX = [[0, 1, 2], [1, 0, 2], [2, 0, 1]];
  var TG = [[2, 1], [0, 2], [0, 1]];   // per face axis: the two edge tangents in the engine's order (x: z, y; y: x, z; z: x, y)
  function bake(f) {
    if (f.bk) return f.bk;
    var cells = f.cells, n = cells.length, H = {}, B = [], ao = new Float32Array(n * 4), seam = new Float32Array(n * 3), cast = new Uint8Array(n), RAD = 0.3, i, c, supTop = 0;
    for (i = 0; i < n; i++) {
      c = cells[i]; B[i] = c.s[0] > 0 ? boxOf(c) : null; if (!B[i]) continue;
      var b = B[i];
      for (var x = Math.floor(b[0] - RAD); x <= Math.floor(b[3] + RAD); x++) for (var y = Math.floor(b[1] - RAD); y <= Math.floor(b[4] + RAD); y++)
        for (var z = Math.floor(b[2] - RAD); z <= Math.floor(b[5] + RAD); z++) { var k = x + ',' + y + ',' + z; (H[k] || (H[k] = [])).push(i); }
    }
    // 1 inside or touching a neighbour's box, falling to 0 at RAD. foot: supports only. minTop: ignore neighbours whose
    // top is no higher than this (a side face is not darkened as a whole by the floor or stand it rests on: the narrow
    // foot ramp in the engine draws that contact, so a tall bar or a wall keeps its lit tone up its whole height)
    function occ(px, py, pz, self, foot, minTop) {
      var L = H[Math.floor(px) + ',' + Math.floor(py) + ',' + Math.floor(pz)], best = 0;
      if (!L) return 0;
      if (foot !== undefined) supTop = -Infinity;
      for (var j = 0; j < L.length; j++) {
        if (L[j] === self) continue;
        var bb = B[L[j]];
        if (minTop !== undefined && bb[4] <= minTop) continue;
        var dx = Math.max(bb[0] - px, 0, px - bb[3]), dy = Math.max(bb[1] - py, 0, py - bb[4]), dz = Math.max(bb[2] - pz, 0, pz - bb[5]);
        if (foot !== undefined && (dx > 0 || dz > 0 || cells[L[j]].g === cells[self].g || Math.abs(bb[4] - foot) > 0.15)) continue;
        var t = Math.sqrt(dx * dx + dy * dy + dz * dz) / RAD;
        if (t < 1) { var v = 1 - t * t * (3 - 2 * t); if (v > best) { best = v; if (foot !== undefined) supTop = bb[4]; } }
      }
      return best;
    }
    function inside(px, py, pz, self) {
      var L = H[Math.floor(px) + ',' + Math.floor(py) + ',' + Math.floor(pz)];
      if (L) for (var j = 0; j < L.length; j++) { var bb = B[L[j]];
        if (L[j] !== self && px > bb[0] && px < bb[3] && py > bb[1] && py < bb[4] && pz > bb[2] && pz < bb[5]) return true; }
      return false;
    }
    var q = [0, 0, 0], lowT = Infinity, minB = Infinity;
    for (i = 0; i < n; i++) {
      c = cells[i]; ao[i * 4] = ao[i * 4 + 1] = ao[i * 4 + 2] = 1; ao[i * 4 + 3] = 0;
      if (!B[i]) continue;
      var h = [c.s[0] / 2, c.s[1] / 2, c.s[2] / 2];
      for (var a = 0; a < 3; a++) {
        // edge samples (just past the face's edges) weigh less on a long face: a neighbour at one end darkens about one
        // unit of it, not a 12-unit wall or a 5-unit mast as a whole
        var ax = AX[a][0], t1 = AX[a][1], t2 = AX[a][2], sum = 0, mt = a === 1 ? undefined : c.p[1] - h[1] + 0.25;
        var s1 = Math.min(1, 0.5 / h[t1]), s2 = Math.min(1, 0.5 / h[t2]);
        for (var w = 0; w < 9; w++) {
          q[ax] = c.p[ax] + h[ax] + 0.25; q[t1] = c.p[t1] + W9[w][0] * (h[t1] + 0.12); q[t2] = c.p[t2] + W9[w][1] * (h[t2] + 0.12);
          sum += W9[w][2] * (W9[w][0] ? s1 : 1) * (W9[w][1] ? s2 : 1) * occ(q[0], q[1], q[2], i, undefined, mt);
        }
        ao[i * 4 + a] = Math.max(0.4, 1 - sum);
        if (!c.q) {   // seam mask, bits: 1 = +ta, 2 = −ta, 4 = +tb, 8 = −tb
          var m = 0;
          for (var e = 0; e < 4; e++) {
            var tt = TG[a][e >> 1], sg = e & 1 ? -1 : 1, o3 = 3 - a - tt;
            q[a] = c.p[a] + h[a] - 0.02; q[tt] = c.p[tt] + sg * (h[tt] + 0.03); q[o3] = c.p[o3];
            if (inside(q[0], q[1], q[2], i)) m |= 1 << e;
          }
          seam[i * 3 + a] = m;
        }
      }
      // foot: 0 = free; 1 + s = stands on a support whose top is s above its foot (the engine starts the ramp there)
      var fy = c.p[1] - h[1], ft = 0, ftop = fy;
      for (var u = -1; u <= 1; u++) for (var side = 0; side < 2; side++) {
        var v = side ? occ(c.p[0] + u * 0.3 * h[0], fy - 0.04, c.p[2] + h[2] + 0.06, i, fy) : occ(c.p[0] + h[0] + 0.06, fy - 0.04, c.p[2] + u * 0.3 * h[2], i, fy);
        if (v > ft) { ft = v; ftop = supTop; }
      }
      ao[i * 4 + 3] = ft >= 0.5 ? 1 + Math.min(0.2, Math.max(0, ftop - fy)) : 0;
      if (isTile(c)) lowT = Math.min(lowT, c.p[1] + h[1]); else { cast[i] = f.anim === 'wave' ? 0 : 1; minB = Math.min(minB, c.p[1] - h[1]); }
    }
    var tiles = lowT < Infinity && lowT <= minB + 0.25, floorY = tiles ? lowT : (minB < Infinity ? minB : 0) - 0.6;
    return (f.bk = { ao: ao, seam: seam, cast: cast, floorY: floorY, gridY: tiles ? floorY - 0.17 : floorY - 0.004 });
  }

  // ---------------------------------------------------------------- SVG poster (same projection)
  function n2(v) { return Math.round(v * 100) / 100; }
  var BOXF = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(function (n) {   // [normal, 4 unit corners]
    var a = n[0] ? 0 : n[1] ? 1 : 2, u = a === 0 ? 1 : 0, v = a === 2 ? 1 : 2, s = n[a], o = [];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { var p = [0, 0, 0]; p[a] = s; p[u] = q[0]; p[v] = q[1]; o.push(p); });
    return [n, o];
  });
  function P(p) { return n2(dot(p, R)) + ',' + n2(-dot(p, U)); }
  function poster(f, cls) {
    var b = f.box, out = [];
    out.push('<svg class="m3p ' + (cls || '') + '" data-f="' + f.name + '" viewBox="' + n2(b.x0) + ' ' + n2(-b.y1) + ' ' + n2(b.w) + ' ' + n2(b.h) +
      '" preserveAspectRatio="xMidYMid meet" overflow="visible" aria-hidden="true" focusable="false">');
    // Hooks for the page CSS (same look as WebGL): ' k' = chroma-keeping tone ramp, ' rim' = keeps a coloured edge
    // (every other face is unstroked), style --ao = baked occlusion of that face (only written when it darkens).
    var bk = bake(f), ix = f.cells.map(function (c, i) { return i; }).filter(function (i) { return f.cells[i].s[0] > 0; })
      .sort(function (a, b) { return dot(f.cells[a].p, F) - dot(f.cells[b].p, F); });
    function aoAt(i, a) { var v = bk.ao[i * 4 + a]; return v < 0.97 ? '" style="--ao:' + n2(v) : ''; }
    out.push('<g class="cells">');
    ix.forEach(function (i) {
      var c = f.cells[i], x = c.p[0], y = c.p[1], z = c.p[2], hx = c.s[0] / 2, hy = c.s[1] / 2, hz = c.s[2] / 2;
      var k = ' t' + c.t + (c.e !== undefined ? ' e' + c.e : '') + (c.ea !== undefined && c.ea < 1 ? ' ea' : '') +
        (KEEP[c.t] ? ' k' : '') + ((RIM[c.t] || (c.e !== undefined && RIM[c.e])) && (c.ea === undefined || c.ea >= 1) ? ' rim' : '');
      if (c.q) {   // rotated cell (micro-story end state): draw the faces that turn towards the camera
        BOXF.forEach(function (fc) {
          var n = qRot(c.q, fc[0]); if (dot(n, F) <= 0.001) return;
          var cls = Math.abs(n[1]) >= Math.abs(n[0]) && Math.abs(n[1]) >= Math.abs(n[2]) ? 'ft' : (Math.abs(n[0]) >= Math.abs(n[2]) ? 'fx' : 'fz');
          out.push('<polygon class="' + cls + k + '" points="' + fc[1].map(function (v) { return P(add3(c.p, qRot(c.q, [v[0] * hx, v[1] * hy, v[2] * hz]))); }).join(' ') + '"/>');
        });
        return;
      }
      out.push('<polygon class="fz' + k + aoAt(i, 2) + '" points="' + [P([x - hx, y - hy, z + hz]), P([x + hx, y - hy, z + hz]), P([x + hx, y + hy, z + hz]), P([x - hx, y + hy, z + hz])].join(' ') + '"/>');
      out.push('<polygon class="fx' + k + aoAt(i, 0) + '" points="' + [P([x + hx, y - hy, z - hz]), P([x + hx, y + hy, z - hz]), P([x + hx, y + hy, z + hz]), P([x + hx, y - hy, z + hz])].join(' ') + '"/>');
      out.push('<polygon class="ft' + k + aoAt(i, 1) + '" points="' + [P([x - hx, y + hy, z - hz]), P([x + hx, y + hy, z - hz]), P([x + hx, y + hy, z + hz]), P([x - hx, y + hy, z + hz])].join(' ') + '"/>');
    });
    out.push('</g><g class="lines">');
    f.lines.forEach(function (l) {
      out.push('<polyline class="ln t' + l.t + (l.flow ? ' fl' : '') + '" style="--a:' + l.a + '" points="' + l.pts.map(P).join(' ') + '"/>');
    });
    out.push('</g></svg>');
    return out.join('');
  }

  var api = { T: T, R: R, U: U, F: F, N: N, formations: FM, poster: poster, dot: dot, bake: bake, KEEP: KEEP, RIM: RIM,
              sample: { zones: ZONES, bands: BANDS, events: EVENTS } };

  // node: print the build-time parts (hero poster + counts)
  if (typeof module === 'object' && typeof require === 'function' && require.main === module) {
    var counts = {}; Object.keys(FM).forEach(function (k) { counts[k] = FM[k].cells.length; });
    process.stdout.write(JSON.stringify({ poster: poster(FM.hero, 'is-on rect-main'), posterIot: poster(FM.iot, 'panel-poster'), posterAssets: poster(FM.assets, 'panel-poster'), N: N, counts: counts, sample: api.sample }));
  }
  return api;
});
