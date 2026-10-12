/* Y1 · Camera Chrome scene: ONE source for the build-time poster (node) and the runtime canvas (browser).
   Scene units 1600 × 900 (16:9). Outline pose skeletons only: no faces, gender or identity cues (DL-P07).
   Classes shown are documented ones: person/vehicle object detection (EV-136), missing helmet and
   restricted-zone entry (EV-134). Every number on screen is sample data inside a labelled frame. */
(function (root) {
  'use strict';
  var W = 1600, H = 900, HOR = 175, VPX = 800, VPY = 120, FENCE = 252;
  var AQUA = '#43DAFE', WARN = '#FDB022', DANGER = '#F97066', LINE = '#B2B8C0', DEEP = '#000D20';
  var FONT = '500 22px "IBM Plex Mono", ui-monospace, monospace', ADV = 13.2;   // Plex Mono advance = 0.6 em
  var CLOCK0 = 7 * 3600 + 42 * 60;                                               // sample clock 07:42:00
  var ZONE = [[1013, 440], [1205, 440], [1560, 720], [1200, 720]];               // perspective-correct (VP 800,120)
  var WALK = 80, DRIVE = 170;                                                    // scene units / s at scale 1

  // at = path vertex where the actor stands at t = 0 (the poster composition), or delay = seconds until it first
  // appears; gap = seconds hidden per cycle. Track IDs renew each cycle, as a real tracker's would.
  // Story: 07 leaves the site office without a helmet and walks across the road into Zone B
  // (missing helmet → near hazard → zone entry). The others give the frame depth and keep events spaced.
  var ACTORS = [
    { id: '03', kind: 'person', helmet: true,  at: 1, gap: 2, speed: WALK, path: [[-100, 760], [220, 780], [400, 840], [480, 990]] },
    { id: '07', kind: 'person', helmet: false, at: 1, gap: 2, speed: WALK, path: [[350, 400], [520, 500], [760, 560], [1000, 600], [1180, 640], [1340, 700], [1700, 760]] },
    { id: '11', kind: 'person', helmet: true,  at: 2, gap: 1, speed: WALK, path: [[1680, 560], [1380, 600], [1250, 640], [1290, 780], [1330, 990]] },
    { id: '14', kind: 'person', helmet: true,  at: 1, gap: 1, speed: WALK, path: [[790, 262], [760, 330], [700, 560], [660, 990]] },
    { id: '12', kind: 'vehicle', delay: 1, gap: 6, speed: DRIVE, path: [[840, 255], [900, 420], [1020, 650], [1120, 1000]] }   // rolls in through the gate ~1 s after Play
  ];

  function sAt(y) { return Math.max(0.25, Math.min(1.45, (y - HOR) / (H - HOR) * 1.45)); }
  function f1(v) { return Math.round(v * 10) / 10; }
  function pt(x, y) { return f1(x) + ',' + f1(y); }
  function circle(cx, cy, r) { return 'M' + pt(cx - r, cy) + 'a' + f1(r) + ',' + f1(r) + ' 0 1,0 ' + f1(2 * r) + ',0a' + f1(r) + ',' + f1(r) + ' 0 1,0 ' + f1(-2 * r) + ',0'; }
  function rect(x, y, w, h) { return 'M' + pt(x, y) + 'h' + f1(w) + 'v' + f1(h) + 'h' + f1(-w) + 'z'; }
  function easeEnter(x) { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 4); }   // ≈ cubic-bezier(0,0,0,1)
  function inZone(x, y) { var p = ZONE, inside = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      if (((p[i][1] > y) !== (p[j][1] > y)) && (x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0])) inside = !inside; }
    return inside; }
  function zoneDist(x, y) { var best = Infinity;   // distance from the feet to the zone outline
    for (var i = 0, j = ZONE.length - 1; i < ZONE.length; j = i++) {
      var ax = ZONE[j][0], ay = ZONE[j][1], dx = ZONE[i][0] - ax, dy = ZONE[i][1] - ay;
      var u = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
      best = Math.min(best, Math.hypot(x - ax - u * dx, y - ay - u * dy)); }
    return best; }
  function tc(sec) { sec = Math.floor(CLOCK0 + sec); var h = Math.floor(sec / 3600) % 24, m = Math.floor(sec / 60) % 60, s = sec % 60;
    return [h, m, s].map(function (v) { return (v < 10 ? '0' : '') + v; }).join(':'); }

  /* ---- motion: perspective-correct speed via a time lookup table (far = slower on screen) ---- */
  ACTORS.forEach(function (a) {
    var pts = [[0, a.path[0][0], a.path[0][1], 0]], t = 0, wd = 0, t0 = 0;
    for (var i = 1; i < a.path.length; i++) {
      var x0 = a.path[i - 1][0], y0 = a.path[i - 1][1], x1 = a.path[i][0], y1 = a.path[i][1];
      var L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(L / 4)), ds = L / n;
      for (var k = 1; k <= n; k++) {
        var y = y0 + (y1 - y0) * k / n, sm = sAt(y - (y1 - y0) / n / 2);
        t += ds / (a.speed * sm); wd += ds / sm;
        pts.push([t, x0 + (x1 - x0) * k / n, y, wd]);
      }
      if (i === a.at) t0 = t;
    }
    var period = t + (a.gap || 0);
    a.tr = { pts: pts, run: t, period: period, t0: a.delay != null ? period - a.delay : t0 };
  });
  function trackId(a, t) {   // cycle 0 keeps the base ID (the poster); later and earlier cycles get fresh two-digit IDs
    var c = Math.floor((t + a.tr.t0) / a.tr.period), n = ((Number(a.id) - 1 + c * 17) % 99 + 99) % 99 + 1;
    return (n < 10 ? '0' : '') + n;
  }
  function sample(a, t) {
    var tr = a.tr, tau = ((t + tr.t0) % tr.period + tr.period) % tr.period;
    if (tau > tr.run) return { tau: tau, alpha: 0 };
    var lo = 0, hi = tr.pts.length - 1;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (tr.pts[mid][0] <= tau) lo = mid; else hi = mid; }
    var A = tr.pts[lo], B = tr.pts[hi], f = B[0] > A[0] ? (tau - A[0]) / (B[0] - A[0]) : 0;
    var dx = B[1] - A[1], dy = B[2] - A[2], dl = Math.hypot(dx, dy) || 1;
    return { tau: tau, x: A[1] + dx * f, y: A[2] + dy * f, wd: A[3] + (B[3] - A[3]) * f, ux: dx / dl,
             alpha: Math.max(0, Math.min(1, Math.min(tau, tr.run - tau) / 0.6)) };
  }

  /* ---- drawing primitives: {d, s(troke), w, sa, f(ill), fa, dash, cap, a(lpha), cls} or {t:'chip', x, y, text, c, a} ---- */
  function chipW(text) { return 18 + ADV * text.length; }
  function chipBox(p) { var w = chipW(p.text), x = Math.max(8, Math.min(W - 8 - w, p.x)), y = Math.max(46, p.y); return [x, y, w]; }
  function brackets(out, x0, y0, x1, y1, color, s, lock, a) {
    var g = 1 + 0.4 * (1 - easeEnter(lock)), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, L = Math.max(8, 0.42 * (x1 - x0) * 0.4);
    x0 = cx + (x0 - cx) * g; x1 = cx + (x1 - cx) * g; y0 = cy + (y0 - cy) * g; y1 = cy + (y1 - cy) * g;
    var d = 'M' + pt(x0, y0 + L) + 'V' + f1(y0) + 'H' + f1(x0 + L) + 'M' + pt(x1 - L, y0) + 'H' + f1(x1) + 'V' + f1(y0 + L) +
            'M' + pt(x1, y1 - L) + 'V' + f1(y1) + 'H' + f1(x1 - L) + 'M' + pt(x0 + L, y1) + 'H' + f1(x0) + 'V' + f1(y1 - L);
    out.push({ d: d, s: DEEP, w: Math.max(2.5, 4.5 * s), a: a });          // keyline keeps ≥ 3:1 over real footage
    out.push({ d: d, s: color, w: Math.max(1.4, 2.4 * s), a: a });
    return [x0, y0];
  }
  function person(out, a, p, color, label, lock) {
    var s = sAt(p.y), h = 200 * s, al = p.alpha;
    var sw = Math.sin(2 * Math.PI * p.wd / 150), A = (0.35 + 0.65 * Math.abs(p.ux)) * (p.ux < 0 ? -1 : 1);
    function J(px, py) { return [p.x + px * h, p.y + py * h]; }
    var j = { neck: J(0, -0.83), pel: J(0, -0.5), shL: J(-0.11, -0.8), shR: J(0.11, -0.8),
      elL: J(-0.135 + 0.05 * sw * A, -0.645), elR: J(0.135 - 0.05 * sw * A, -0.645),
      wrL: J(-0.125 + 0.1 * sw * A, -0.49), wrR: J(0.125 - 0.1 * sw * A, -0.49),
      hpL: J(-0.07, -0.5), hpR: J(0.07, -0.5),
      knL: J(-0.07 - 0.07 * sw * A, -0.26), knR: J(0.07 + 0.07 * sw * A, -0.26),
      anL: J(-0.07 - 0.13 * sw * A, -0.015), anR: J(0.07 + 0.13 * sw * A, -0.015) };
    function M(k) { return 'M' + pt(j[k][0], j[k][1]); } function Lk(k) { return 'L' + pt(j[k][0], j[k][1]); }
    var d = M('neck') + Lk('pel') + M('shL') + Lk('shR') + M('hpL') + Lk('hpR') + M('shL') + Lk('elL') + Lk('wrL') + M('shR') + Lk('elR') + Lk('wrR') +
            M('hpL') + Lk('knL') + Lk('anL') + M('hpR') + Lk('knR') + Lk('anR');
    var hx = p.x, hy = p.y - 0.915 * h, r = 0.062 * h;
    out.push({ d: d + circle(hx, hy, r), s: LINE, w: Math.max(1.4, 2.4 * s), cap: 'round', a: al });
    if (a.helmet) out.push({ d: 'M' + pt(hx - 1.12 * r, hy - 0.12 * r) + 'A' + f1(1.12 * r) + ',' + f1(1.12 * r) + ' 0 0 1 ' + pt(hx + 1.12 * r, hy - 0.12 * r) + 'Z' +
                                 rect(hx - 1.4 * r, hy - 0.2 * r, 2.8 * r, Math.max(1.5, 0.22 * r)), f: LINE, a: al });
    var dots = '', dr = Math.max(1.8, 0.014 * h);
    ['shL', 'shR', 'elL', 'elR', 'wrL', 'wrR', 'hpL', 'hpR', 'knL', 'knR', 'anL', 'anR'].forEach(function (k) { dots += circle(j[k][0], j[k][1], dr); });
    out.push({ d: dots, f: color, a: al });                                         // pose keypoints in the detection colour
    var b = brackets(out, p.x - 0.25 * h, p.y - 1.0 * h, p.x + 0.25 * h, p.y + 0.03 * h, color, s, lock, al);
    out.push({ t: 'chip', x: b[0], y: b[1] - 4, text: label, c: color, a: al });
  }
  function vehicle(out, id, p, lock) {
    var s = sAt(p.y), vw = 250 * s, vh = 160 * s, x = p.x, y = p.y, al = p.alpha;
    var d = rect(x - vw / 2, y - vh, vw, vh * 0.8) +
            'M' + pt(x - vw * 0.36, y - vh * 0.9) + 'L' + pt(x + vw * 0.36, y - vh * 0.9) + 'L' + pt(x + vw * 0.42, y - vh * 0.56) + 'L' + pt(x - vw * 0.42, y - vh * 0.56) + 'Z' +
            'M' + pt(x - vw * 0.3, y - vh * 0.36) + 'L' + pt(x + vw * 0.3, y - vh * 0.36) +
            rect(x - vw * 0.46, y - vh * 0.2, vw * 0.16, vh * 0.2) + rect(x + vw * 0.3, y - vh * 0.2, vw * 0.16, vh * 0.2);
    out.push({ d: d, s: LINE, w: Math.max(1.4, 2.4 * s), cap: 'round', a: al });
    var b = brackets(out, x - vw / 2 - 6 * s, y - vh - 6 * s, x + vw / 2 + 6 * s, y + 6 * s, AQUA, s, lock, al);
    out.push({ t: 'chip', x: b[0], y: b[1] - 4, text: 'VEHICLE 0.91 · ID ' + id, c: AQUA, a: al });
  }

  /* ---- static site backdrop (SVG only, drawn once behind the transparent canvas) ---- */
  function staticPrims() {
    var o = [{ d: rect(0, 0, W, H), f: DEEP }], g = '', k, x, y, step;
    for (k = -12; k <= 12; k++) { var xb = VPX + k * 150, xs = VPX + (xb - VPX) * (FENCE + 3 - VPY) / (H - VPY); g += 'M' + pt(xs, FENCE + 3) + 'L' + pt(xb, H); }
    for (y = FENCE + 3, step = 9; y < H; step *= 1.24, y += step) g += 'M' + pt(0, y) + 'H' + W;
    o.push({ d: g, s: AQUA, w: 1.2, sa: 0.08 });
    var fence = 'M0,226H716M884,226H' + W + 'M0,244H716M884,244H' + W;
    for (x = 12; x < W; x += 48) if (x < 708 || x > 892) fence += 'M' + x + ',212V' + FENCE;
    o.push({ d: fence, s: LINE, w: 1.5, sa: 0.32 });
    o.push({ d: 'M716,194V' + FENCE + 'M884,194V' + FENCE, s: LINE, w: 3, sa: 0.5 });                                   // gate posts
    o.push({ d: 'M716,205H872', s: LINE, w: 5, sa: 0.55, dash: [12, 8] });                                               // barrier arm
    o.push({ d: 'M716,' + (FENCE + 3) + 'L323,' + H + 'M884,' + (FENCE + 3) + 'L1277,' + H, s: LINE, w: 1.6, sa: 0.24 });  // road edges
    o.push({ d: 'M800,' + (FENCE + 3) + 'V' + H, s: LINE, w: 2, sa: 0.18, dash: [18, 24] });                               // centre line
    o.push({ d: rect(90, 272, 310, 126) + 'M80,272H410M86,262H404' + rect(318, 318, 34, 80) + rect(120, 300, 80, 44) + rect(220, 300, 80, 44),
             s: LINE, w: 2, sa: 0.42 });                                                                                     // site office cabin
    o.push({ d: 'M540,' + FENCE + 'V70H582' + rect(574, 64, 30, 12), s: LINE, w: 2, sa: 0.32 });                       // light pole
    var crane = 'M1404,18V' + FENCE + 'M1424,18V' + FENCE + 'M1030,22H1590M1030,40H1590M1395,52H1433V78H1395Z';
    for (y = 18; y < FENCE - 20; y += 22) crane += 'M1404,' + y + 'L1424,' + (y + 22);
    for (x = 1030; x < 1590; x += 30) crane += 'M' + x + ',40L' + (x + 15) + ',22L' + (x + 30) + ',40';
    crane += 'M1414,0L1150,22M1414,0L1560,22M1186,40V138M1180,138h12v10h-12z';
    o.push({ d: crane, s: LINE, w: 1.4, sa: 0.28 });
    o.push({ d: rect(1520, 40, 60, 22), f: LINE, fa: 0.16 });                                                           // counterweight
    o.push({ d: 'M' + ZONE.map(function (q) { return pt(q[0], q[1]); }).join('L') + 'Z', f: DANGER, fa: 0.07, s: DANGER, w: 2.5, dash: [14, 10], cls: 'zone' });
    var cones = '';
    [500, 590, 680].forEach(function (cy) { var cx = 1013 + (1200 - 1013) * (cy - 440) / 280 - 14, cs = sAt(cy);
      cones += 'M' + pt(cx - 10 * cs, cy) + 'L' + pt(cx, cy - 30 * cs) + 'L' + pt(cx + 10 * cs, cy) + 'Z'; });
    o.push({ d: cones, s: LINE, w: 1.6, sa: 0.55 });
    o.push({ t: 'chip', x: 1200, y: 768, text: 'ZONE B · RESTRICTED', c: DANGER });
    return o;
  }

  /* ---- simulation: stateful only for events, lock-on timing and trails ---- */
  function placeChips(chips) {   // labels never overlap: a colliding chip steps up one row (identical in node and browser)
    var placed = [];
    chips.forEach(function (c) {
      for (var n = 0; n < 4; n++) {
        var b = chipBox(c), hit = placed.some(function (q) { return b[0] < q[0] + q[2] + 6 && q[0] < b[0] + b[2] + 6 && b[1] - 38 < q[1] - 4 && q[1] - 38 < b[1] - 4; });
        if (!hit) break; c.y -= 34;
      }
      placed.push(chipBox(c));
    });
    return chips;
  }
  var PREROLL = 40;   // seconds of history simulated before t = 0, so the event list starts with real, staggered timestamps
  function createSim() {
    var ppe = 0;
    var st = ACTORS.map(function () { return { inFrame: false, zone: 'out', lockT: -1e9, trail: [], tau: -1 }; });
    function step(t, now) {
      var prims = [], chips = [], events = [], nZone = 0;
      ACTORS.forEach(function (a, i) {
        var p = sample(a, t), S = st[i], id = trackId(a, t);
        if (p.tau < S.tau) S.trail = [];                                            // new cycle: fresh track
        S.tau = p.tau;
        var inFrame = p.alpha > 0.5 && p.x > 20 && p.x < W - 20 && p.y > HOR && p.y < H + 30;
        if (inFrame && !S.inFrame) {                                                 // acquired
          S.lockT = now;
          if (a.kind === 'vehicle') events.push({ t: t, text: 'Vehicle detected', zone: 'Yard road', id: id, lvl: 'info' });
          else if (!a.helmet) { ppe++; events.push({ t: t, text: 'Missing helmet', zone: 'Gate 2', id: id, lvl: 'warning' }); }
        }
        S.inFrame = inFrame;
        if (!(p.alpha > 0)) { S.zone = 'out'; return; }
        var zone = 'out';
        if (a.kind === 'person' && inFrame) {                                        // EV-134: restricted-zone entry; workers in hazardous areas
          var dz = zoneDist(p.x, p.y);
          zone = inZone(p.x, p.y) ? 'in' : (dz < (S.zone === 'out' ? 70 : 90) ? 'near' : 'out');   // hysteresis: no flicker on the edge
        }
        if (zone === 'in' && S.zone !== 'in') { S.lockT = now; events.push({ t: t, text: 'Restricted-zone entry', zone: 'Zone B', id: id, lvl: 'danger' }); }
        if (zone === 'near' && S.zone === 'out') { S.lockT = now; events.push({ t: t, text: 'Worker near hazard', zone: 'Zone B', id: id, lvl: 'warning' }); }
        S.zone = zone; if (zone === 'in') nZone++;
        var last = S.trail[S.trail.length - 1];
        if (!last || Math.hypot(last[0] - p.x, last[1] - p.y) > 6) { S.trail.push([p.x, p.y]); if (S.trail.length > 24) S.trail.shift(); }
        if (S.trail.length > 1) prims.push({ d: 'M' + S.trail.map(function (q) { return pt(q[0], q[1]); }).join('L'), s: AQUA, w: 1.5, sa: 0.28, cap: 'round', a: p.alpha });
        var lock = (now - S.lockT) / 160;
        var n0 = prims.length;
        if (a.kind === 'vehicle') vehicle(prims, id, p, lock);
        else {
          var color = zone === 'in' ? DANGER : zone === 'near' || !a.helmet ? WARN : AQUA;
          var label = zone === 'in' ? 'ZONE B ENTRY · ID ' + id : zone === 'near' ? 'NEAR ZONE B · ID ' + id :
                      a.helmet ? 'PERSON 0.9' + (Number(id) % 7 + 2) + ' · ID ' + id : 'NO HELMET · ID ' + id;
          person(prims, a, p, color, label, lock);
        }
        for (var k = n0; k < prims.length; k++) if (prims[k].t === 'chip') { chips.push(prims.splice(k, 1)[0]); k--; }
      });
      return { prims: prims.concat(placeChips(chips)), events: events, inZone: nZone, ppe: ppe };   // labels above every figure
    }
    function prime() {   // run the history; lock-ons from it are long settled by t = 0
      var hist = [];
      for (var t = -PREROLL; t < -1e-9; t += 0.1) hist = hist.concat(step(t, t * 1000 - 1e6).events);
      return hist.slice(-6);
    }
    return { step: step, prime: prime };
  }

  /* ---- renderers ---- */
  function toSVG(prims, cls) {
    var o = ['<svg class="' + cls + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false">'];
    prims.forEach(function (p) {
      var op = p.a != null && p.a < 1 ? ' opacity="' + p.a.toFixed(3) + '"' : '';
      if (p.t === 'chip') { var b = chipBox(p);
        o.push('<g class="chip"' + op + '><rect x="' + f1(b[0]) + '" y="' + f1(b[1] - 38) + '" width="' + f1(b[2]) + '" height="30" rx="4" fill="' + DEEP + '" fill-opacity=".85"/>' +
               '<text x="' + f1(b[0] + 9) + '" y="' + f1(b[1] - 16) + '" fill="' + p.c + '">' + p.text + '</text></g>'); return; }
      var s = '<path d="' + p.d + '"' + (p.cls ? ' class="' + p.cls + '"' : '') + ' fill="' + (p.f || 'none') + '"' + (p.f && p.fa != null ? ' fill-opacity="' + p.fa + '"' : '');
      if (p.s) s += ' stroke="' + p.s + '" stroke-width="' + p.w + '"' + (p.sa != null ? ' stroke-opacity="' + p.sa + '"' : '') +
                    (p.dash ? ' stroke-dasharray="' + p.dash.join(' ') + '"' : '') + (p.cap ? ' stroke-linecap="' + p.cap + '" stroke-linejoin="round"' : '');
      o.push(s + op + '/>');
    });
    o.push('</svg>');
    return o.join('');
  }
  function draw(ctx, prims, noChips) {   // noChips: narrow screens, where 22-unit labels would be illegible
    for (var i = 0; i < prims.length; i++) {
      var p = prims[i], a = p.a == null ? 1 : p.a;
      if (!(a > 0)) continue;
      if (p.t === 'chip') { if (noChips) continue; var b = chipBox(p);
        ctx.globalAlpha = a * 0.85; ctx.fillStyle = DEEP; ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(b[0], b[1] - 38, b[2], 30, 4); else ctx.rect(b[0], b[1] - 38, b[2], 30);
        ctx.fill(); ctx.globalAlpha = a; ctx.fillStyle = p.c; ctx.font = FONT; ctx.fillText(p.text, b[0] + 9, b[1] - 16); continue; }
      var P = new Path2D(p.d);
      if (p.f) { ctx.globalAlpha = a * (p.fa == null ? 1 : p.fa); ctx.fillStyle = p.f; ctx.fill(P); }
      if (p.s) { ctx.globalAlpha = a * (p.sa == null ? 1 : p.sa); ctx.strokeStyle = p.s; ctx.lineWidth = p.w; ctx.setLineDash(p.dash || []);
        ctx.lineCap = p.cap || 'butt'; ctx.lineJoin = p.cap ? 'round' : 'miter'; ctx.stroke(P); }
    }
    ctx.globalAlpha = 1; ctx.setLineDash([]);
  }
  function eventHTML(e) {   // shared by the build (pre-rendered list) and the live stream
    return '<li class="event"><time class="mono-xs text-fg-muted">' + tc(e.t) + '</time><span class="text-small lvl-' + e.lvl + '">' + e.text + '</span>' +
           '<span></span><span class="mono-xs text-fg-muted">CAM-03 · ' + e.zone + ' · ID ' + e.id + '</span></li>';
  }

  var Y1 = { W: W, H: H, createSim: createSim, draw: draw, toSVG: toSVG, staticPrims: staticPrims, eventHTML: eventHTML, tc: tc, FONT: FONT };
  root.Y1 = Y1;

  /* ---- build: `node y1_scene.js` prints the static scene, the t = 0 poster, and the events that frame produces ---- */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Y1;
    if (typeof require !== 'undefined' && require.main === module) {
      var sim = createSim(), hist = sim.prime(), out = sim.step(0, 0), settled = sim.step(0, 1e6);   // second call: same t, locks settled
      var scene = toSVG(staticPrims(), 'scene' + (out.inZone > 0 ? ' zone-hot' : ''));
      process.stdout.write(JSON.stringify({ scene: scene, poster: toSVG(settled.prims, 'poster'),
        events: hist.concat(out.events).slice(-6).reverse().map(eventHTML).join(''), inZone: out.inZone, ppe: out.ppe }));
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
