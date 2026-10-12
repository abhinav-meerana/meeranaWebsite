/* m3_engine.js — the M3 WebGL engine (three.js r186). Inlined by build.py INSIDE the page controller's
   DOMContentLoaded closure, so it shares: S, FM, R, U, Q, stage, posters, canvas, vw, vh, rects, framing(),
   overlaysFor(), placeOverlays(), posterShow(), isReduced(), body, mode, current, GL.
   Public API returned by makeGL(THREE): go(name, instant), kick(), resize(), pointer(x, y), pointerOut(),
   drift(p), stream(g), reveal(), pause(on). Keep this API stable: the page controller calls only these.
   pause(true) keeps drawing while the page fades the stage out (its CSS opacity transition), then stops the loop;
   pause(false) resumes it. The first go() after the stage was fully hidden builds the new formation in place
   (cells grow, no camera travel) instead of morphing from a formation the viewer never saw.

   Art direction (JUDGE-VERDICT §4 Phase 4):
   - 4.1 fog only on far cells (0 % at the pivot), fading into the backdrop colour at that pixel;
   - 4.2 one world-space key light, blue-shifted shadow sides for neutral tones, chroma-keeping sides for saturated
     ones (S.KEEP); neutral tones capped at navy-200 in the shader;
   - 4.3 a lit chamfer (about 1.5 px, scaled by the cell's own tone and occlusion) only on the upper edges that face
     the key and the camera, never on a seam where a part continues flush into its neighbour (S.bake seam mask);
     a coloured rim only where the edge alpha is above .8 (accent, danger, product colours, hover);
   - 4.4 baked per-face ambient occlusion (S.bake) lerped through morphs, a narrow contact darkening at the foot of
     cells that stand on a support, and instanced contact shadows;
   - 4.5 a light-pool backdrop (full-screen triangle) and a persistent floor grid, both inside WebGL;
   - 4.8 a three-phase curved morph: lift → travel → settle (420 ms phases, 140 ms overlaps, sweep ≤ 480 ms;
     the hero moments use 340/110/300 so a moment morphs in ≤ 1.1 s);
   - 4.10 micro-stories from the scene data (hinges and blinks: the Wasel arm swings open, the Yisbir head pans
     onto the zone), smoke as soft billboards, the detection cone as an additive volume; per-instance rotation;
   - 4.11 (part) flow lines as 2 px anti-aliased screen-space quads; the travelling pulse is the only cyan;
   - 4.13 ambient-only frames at 30 fps; nothing allocated per frame; only changed instance ranges are uploaded;
     programs compiled off the critical path (compileAsync) on idle; DPR caps unchanged.
   Colours come from the page's palette probe and design tokens only (no hex literals here). */
  /* ---------------- WebGL ---------------- */
  function rgb(s) {   // "rgb(r, g, b)" or "color(srgb r g b)" (what color-mix() computes to) → [0..1]
    var str = String(s), m = str.match(/-?[\d.]+(?:e-?\d+)?/g);
    if (!m || m.length < 3) return [1, 1, 1];
    return /^\s*color\(/.test(str) ? [+m[0], +m[1], +m[2]] : [m[0] / 255, m[1] / 255, m[2] / 255];
  }
  function tok(name) {   // a design token resolved by the browser (never a hex literal in the engine)
    var el = document.createElement('i'); el.style.display = 'none'; el.style.color = 'var(' + name + ')';
    body.appendChild(el); var c = rgb(getComputedStyle(el).color); body.removeChild(el); return c;
  }
  function mix3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function readPalette() {
    var top = [], edge = [], ea = [], probe = document.querySelector('.m3p-probe');
    for (var k = 0; k < 12; k++) { var cs = getComputedStyle(probe.querySelector('.t' + k));
      top[k] = rgb(cs.fill); edge[k] = rgb(cs.stroke); ea[k] = parseFloat(cs.strokeOpacity) || 0; }
    return { top: top, edge: edge, ea: ea, bg: rgb(getComputedStyle(body).backgroundColor),
      navy: tok('--meerana-navy'), blue: tok('--meerana-blue'), cap: tok('--navy-200'), line: tok('--navy-800') };
  }
  function wantGL() {
    if (Q.webgl === 'off') return false;
    if (Q.webgl === 'force') return true;
    if (vw < 768) return false;                              // posters on small screens (battery, LCP)
    try { var c = document.createElement('canvas'), g = c.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
      if (!g) return false; var x = g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); return true; } catch (e) { return false; }
  }

  // the light pool: radial gradient centred on the framing (blue 14 % into navy → navy at 45 % → page colour), dithered
  var BACK = [
    'uniform vec2 uPoolC; uniform vec2 uPoolR; uniform vec3 uP0; uniform vec3 uP1; uniform vec3 uP2;',
    'float poolT(vec2 fc) { return length((fc - uPoolC) / uPoolR); }',
    'vec3 backdrop(vec2 fc) { float t = poolT(fc);',
    '  vec3 c = mix(mix(uP0, uP1, smoothstep(0.0, 0.45, t)), uP2, smoothstep(0.45, 1.0, t));',
    '  return c + (fract(52.9829189 * fract(dot(fc, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0; }'].join('\n');
  var BVS = 'void main() { gl_Position = vec4(position.xy, 1.0, 1.0); }';
  var BFS = [BACK, 'void main() { gl_FragColor = vec4(backdrop(gl_FragCoord.xy), 1.0); }'].join('\n');

  // cells: key light in world space, per-tone shadow ramp, baked AO, lit chamfer, coloured rim (accents only), fog
  var VS = [
    'attribute vec4 aTop; attribute vec4 aEdge; attribute vec4 aAO; attribute vec3 aSeam;',
    'uniform vec3 uCenter; uniform float uSpan; uniform vec3 uFwd; uniform vec3 uKey; uniform vec3 uFade;',
    'varying vec4 vTop; varying vec4 vEdge; varying float vFog; varying float vK; varying vec2 vFace; varying vec2 vEP; varying vec3 vN; varying vec3 vTa; varying vec3 vTb;',
    'varying float vAO; varying float vGY; varying float vFoot; varying float vSink; varying float vGH; varying float vSeam;',
    'void main() {',
    '  vTop = aTop; vEdge = aEdge;',
    '  vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));',
    '  mat3 rm = mat3(modelMatrix) * mat3(instanceMatrix);',
    '  vec3 an = abs(normal), ta = an.x > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0), tb = an.y > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);',
    '  vFace = vec2(dot(sc, ta), dot(sc, tb)); vEP = vec2(dot(position, ta), dot(position, tb)) * vFace;',   // face size and position on it, world units
    '  vN = normalize(rm * normal); vTa = normalize(rm * ta); vTb = normalize(rm * tb);',
    '  vK = max(dot(vN, uKey), 0.0);',
    '  vAO = an.x > 0.5 ? aAO.x : (an.y > 0.5 ? aAO.y : aAO.z);',
    '  vSeam = an.x > 0.5 ? step(0.0, normal.x) * aSeam.x : (an.y > 0.5 ? step(0.0, normal.y) * aSeam.y : step(0.0, normal.z) * aSeam.z);',
    // side faces of cells standing on a support darken in a narrow band just above where they meet it
    '  vFoot = (1.0 - an.y) * clamp(aAO.w, 0.0, 1.0); vSink = max(aAO.w - 1.0, 0.0); vGY = (position.y + 0.5) * sc.y; vGH = min(0.22, 0.35 * sc.y);',
    '  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);',
    // fog: 0 at the pivot, only far cells fade; plus an optional radial fade of a formation's outer field (uFade)
    '  vFog = max(0.5 * smoothstep(0.5, 1.0, dot(wp.xyz - uCenter, -uFwd) / uSpan + 0.5), uFade.x * smoothstep(uFade.y, uFade.z, length(wp.xz - uCenter.xz)));',
    '  gl_Position = projectionMatrix * viewMatrix * wp;',
    '}'].join('\n');
  var FS = [
    BACK,
    'uniform vec3 uCool; uniform vec3 uCap; uniform float uCapL; uniform vec3 uKey; uniform vec3 uFwd; uniform float uBevel; uniform float uExposure;',
    'varying vec4 vTop; varying vec4 vEdge; varying float vFog; varying float vK; varying vec2 vFace; varying vec2 vEP; varying vec3 vN; varying vec3 vTa; varying vec3 vTb;',
    'varying float vAO; varying float vGY; varying float vFoot; varying float vSink; varying float vGH; varying float vSeam;',
    // a bevel normal glints only where it faces the key, the camera and upwards (no glint on the vertical side-to-side edge)
    'float glint(vec3 n) { return max(dot(n, uKey), 0.0) * smoothstep(0.05, 0.35, dot(n, uFwd)) * smoothstep(0.3, 0.6, n.y); }',
    'float bit(float m, float b) { return mod(floor(m / b), 2.0); }',
    'void main() {',
    '  vec3 top = vTop.rgb * uExposure;',
    // key light (1 on a top face): neutral tones take a curved ramp the darker they are (the half-lit +x side stays up,
    // the far +z side falls), so the two sides of a navy cell separate by more than 10 levels, and their shadow sides
    // turn cool; saturated tones (vTop.a) take a flat ramp that keeps chroma. White keeps its linear 0.7 ramp.
    '  float lt = clamp(dot(top, vec3(0.2126, 0.7152, 0.0722)) / uCapL, 0.0, 1.0), dk = uKey.y - vK, dn = clamp((1.0 - lt) / 0.7, 0.0, 1.0);',
    '  vec3 col = mix(top * (1.0 - mix(0.7, 0.5, dn) * dk - 0.6 * dn * dk * dk) * mix(uCool, vec3(1.0), smoothstep(0.25, 0.85, vK)), top * (1.0 - 0.55 * dk), vTop.a);',
    '  col *= vAO * mix(1.0, mix(0.74, 1.0, smoothstep(vSink, vSink + vGH, vGY)), vFoot);',
    // chamfer, per edge: open edges only (the seam mask closes edges that continue flush into a neighbour); about
    // 1.5 px wide; it brightens the cell's own tone, so a navy cell gets a faint glint and a white one a clear one
    '  vec2 dd = vFace * 0.5 - abs(vEP), fw = max(vec2(fwidth(dd.x), fwidth(dd.y)), vec2(1e-4));',
    '  float m = floor(vSeam + 0.5);',
    '  vec2 open = vec2(1.0 - (vEP.x >= 0.0 ? bit(m, 1.0) : bit(m, 2.0)), 1.0 - (vEP.y >= 0.0 ? bit(m, 4.0) : bit(m, 8.0)));',
    '  vec2 band = open * (1.0 - smoothstep(vec2(0.0), fw * 1.5, dd));',
    '  float bev = max(band.x * glint(normalize(vN + vTa * sign(vEP.x))), band.y * glint(normalize(vN + vTb * sign(vEP.y))));',
    '  col += bev * uBevel * top * vAO;',
    '  col = mix(min(col, uCap), col, vTop.a);',                                  // neutral tones never outshine navy-200
    '  vec3 e = vEdge.rgb; float ch = max(e.r, max(e.g, e.b)) - min(e.r, min(e.g, e.b));',
    '  vec2 rb = open * (1.0 - smoothstep(vec2(0.0), fw * 1.25, dd));',
    '  col = mix(col, mix(min(e, uCap), e, step(0.25, ch)), max(rb.x, rb.y) * smoothstep(0.8, 0.86, vEdge.a) * 0.85);',   // coloured rim: accents only
    '  gl_FragColor = vec4(mix(col, backdrop(gl_FragCoord.xy), vFog), 1.0);',
    '}'].join('\n');

  // floor grid: one persistent plane, lines on the cell seams, fading with distance and outside the light pool
  var GVS = 'uniform vec2 uOff; uniform float uSize; varying vec2 vP; void main() { vP = position.xz * uSize + uOff; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
  var GFS = [BACK, 'uniform vec3 uCol; uniform vec2 uC; uniform float uA; varying vec2 vP;',
    'void main() { vec2 l = abs(fract(vP) - 0.5) / max(fwidth(vP), vec2(1e-4)); float line = 1.0 - min(min(l.x, l.y), 1.0);',
    '  float a = uA * line * (1.0 - smoothstep(6.0, 18.0, length(vP - uC))) * (1.0 - smoothstep(0.5, 1.0, poolT(gl_FragCoord.xy)));',
    '  if (a < 0.002) discard;',   // most of the plane lies between lines or outside the pool: no blend write there
    '  gl_FragColor = vec4(uCol, a); }'].join('\n');

  // contact shadows: one instanced soft quad per cell on the floor; size in the matrix x/z scale, opacity in its y scale
  var SVS = ['varying vec2 vUv; varying vec2 vQ; varying float vOp;',
    'void main() { vUv = uv; vQ = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[2].xyz)); vOp = length(instanceMatrix[1].xyz);',
    '  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }'].join('\n');
  var SFS = ['uniform vec3 uCol; uniform float uM; varying vec2 vUv; varying vec2 vQ; varying float vOp;',
    'void main() { vec2 p = abs(vUv - 0.5) * vQ, core = max(vQ * 0.5 - uM, vec2(0.0));',
    '  float t = clamp(length(max(p - core, 0.0)) / uM, 0.0, 1.0), a = vOp * (1.0 - t) * (1.0 - t);',
    '  if (a < 0.002) discard;',
    '  gl_FragColor = vec4(uCol, a); }'].join('\n');

  // flow lines: each segment is a screen-space quad uWidth px wide (anti-aliased), not a 1 px GL line
  var LVS = [
    'attribute vec3 aOther; attribute vec2 aSE; attribute float aT; attribute vec4 aCol; attribute float aFlow; attribute float aGrp; attribute float aAcc;',
    'uniform float uGrp; uniform vec2 uRes; uniform float uWidth;',
    'varying float vT; varying vec4 vCol; varying float vFlow; varying float vHi; varying float vDim; varying float vAcc; varying float vD;',
    'void main() {',
    '  vT = aT; vCol = aCol; vFlow = aFlow; vAcc = aAcc;',
    '  vHi = (uGrp > 0.5 && abs(aGrp - uGrp) < 0.5) ? 1.0 : 0.0;',
    '  vDim = (uGrp > 0.5 && aGrp > 0.5 && vHi < 0.5) ? 0.4 : 1.0;',
    '  mat4 mvp = projectionMatrix * modelViewMatrix; vec4 a = mvp * vec4(position, 1.0), b = mvp * vec4(aOther, 1.0);',
    '  vec2 d = (b.xy / b.w - a.xy / a.w) * uRes * (1.0 - 2.0 * aSE.y); float l = length(d); d = l > 1e-6 ? d / l : vec2(1.0, 0.0);',
    '  vD = aSE.x * (uWidth * 0.5 + 1.0);',
    '  a.xy += vec2(-d.y, d.x) * vD * 2.0 / uRes * a.w;',
    '  gl_Position = a;',
    '}'].join('\n');
  var LFS = [
    'uniform float uTime; uniform float uOpacity; uniform vec3 uSteel; uniform vec3 uCap; uniform float uWidth;',
    'varying float vT; varying vec4 vCol; varying float vFlow; varying float vHi; varying float vDim; varying float vAcc; varying float vD;',
    'void main() {',
    '  float p = fract(vT * 2.0 - uTime * 0.32);',
    '  float pulse = smoothstep(0.0, 0.05, p) * (1.0 - smoothstep(0.05, 0.22, p));',
    '  float a = vCol.a * (0.55 + vFlow * 1.7 * pulse) * (1.0 + vHi * 1.3) * vDim;',
    // accent-tone lines rest in steel; only the travelling pulse and a hovered stream carry the cyan (one accent per frame);
    // neutral line colours are capped at navy-200 like the cells
    '  vec3 c = mix(vCol.rgb, mix(mix(uSteel, vCol.rgb, 0.4), vCol.rgb, max(vHi, pulse * vFlow)), vAcc);',
    '  float ch = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b)); c = mix(min(c, uCap), c, step(0.25, ch));',
    '  gl_FragColor = vec4(c, min(a, 1.0) * uOpacity * clamp(uWidth * 0.5 + 0.5 - abs(vD), 0.0, 1.0));',
    '}'].join('\n');

  // smoke: soft camera-facing puffs (size in the matrix x scale, opacity in y, seed in z), lit from above
  var PVS = ['uniform vec3 uCamR; uniform vec3 uCamU; varying vec2 vUv; varying float vOp; varying float vSeed;',
    'void main() { vUv = uv; float s = length(instanceMatrix[0].xyz); vOp = length(instanceMatrix[1].xyz); vSeed = length(instanceMatrix[2].xyz);',
    '  vec3 c = (modelMatrix * vec4(instanceMatrix[3].xyz, 1.0)).xyz + (uCamR * position.x + uCamU * position.y) * s;',
    '  gl_Position = projectionMatrix * viewMatrix * vec4(c, 1.0); }'].join('\n');
  var PFS = ['uniform vec3 uCol; uniform vec3 uHi; uniform float uTime; varying vec2 vUv; varying float vOp; varying float vSeed;',
    'float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), f.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), f.x), f.y); }',
    'void main() { float n = 0.6 * vn(vUv * 3.0 + vSeed * 7.0 - vec2(0.0, uTime * 0.25)) + 0.4 * vn(vUv * 6.0 + vSeed * 3.0);',
    '  float a = smoothstep(0.5, 0.1, length(vUv - 0.5)) * (0.6 + 0.4 * n) * vOp;',
    '  if (a < 0.002) discard;',
    '  gl_FragColor = vec4(mix(uCol * 0.62, uHi, 0.2 + 0.5 * vUv.y), a); }'].join('\n');

  // detection cone: a soft volume from the lens to the watched area (normal blending, so it tints light cells instead
  // of pushing them past the neutral cap), brightest at the lens, with a scan band and a faint glow where it lands
  var CVS = ['attribute float aT; attribute vec3 aB; varying float vT; varying vec3 vB;',
    'void main() { vT = aT; vB = aB; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'].join('\n');
  var CFS = ['uniform vec3 uCol; uniform float uOp; uniform float uTime; varying float vT; varying vec3 vB;',
    'void main() { float edge = 1.0 - smoothstep(0.0, 0.05, min(vB.y, vB.z)), scan = exp(-pow((vT - fract(uTime * 0.45)) * 7.0, 2.0));',
    '  gl_FragColor = vec4(uCol, (0.085 * (1.0 - vT) + 0.11 * edge + 0.05 * scan + 0.07 * smoothstep(0.72, 1.0, vT)) * uOp); }'].join('\n');

  function makeGL(THREE) {
    var pal = readPalette(), N = S.N, T = S.T, KEEP = S.KEEP;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearAlpha(0);   // the backdrop pass paints every pixel; no clear colour needed
    var scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 20, 240);
    cam.position.set(70, 70, 70); cam.lookAt(0, 0, 0); cam.updateMatrixWorld();
    var pivotG = new THREE.Group(), inner = new THREE.Group(); pivotG.add(inner); scene.add(pivotG);
    function v3u(a) { return { value: new THREE.Vector3(a[0], a[1], a[2]) }; }

    // light: key from the upper right (world space). A top face is lit at 1, so the white tone sits on navy-200 and
    // the shader caps every neutral tone there. Shadow sides of neutral tones turn cool: the shadow tint (navy-800 with
    // 12 % blue) normalised to a mean of 1 and applied at 22 %. The zone floor takes a trace of its danger edge.
    var KEY = new THREE.Vector3(0.55, 1, 0.3).normalize();
    var TOP = pal.top.map(function (c) { return c.slice(); });
    TOP[T.white] = pal.cap.slice();
    TOP[T.zone] = mix3(pal.top[T.zone], pal.edge[T.zone], 0.18);
    var ACC = TOP[T.accent], SH = mix3(pal.line, pal.blue, 0.12), SHM = (SH[0] + SH[1] + SH[2]) / 3 || 1;
    var COOL = mix3([1, 1, 1], [SH[0] / SHM, SH[1] / SHM, SH[2] / SHM], 0.22), CAPL = 0.2126 * pal.cap[0] + 0.7152 * pal.cap[1] + 0.0722 * pal.cap[2];
    var U_BACK = { uPoolC: { value: new THREE.Vector2() }, uPoolR: { value: new THREE.Vector2(1, 1) },
      uP0: v3u(mix3(pal.navy, pal.blue, 0.14)), uP1: v3u(pal.navy), uP2: v3u(pal.bg) };
    function withBack(u) { for (var k in U_BACK) u[k] = U_BACK[k]; return u; }
    var U_RES = { value: new THREE.Vector2(1, 1) }, U_W = { value: 2 }, U_CAP = v3u(pal.cap);   // shared by every line material

    // backdrop: one full-screen triangle, drawn first
    var bgGeo = new THREE.BufferGeometry(); bgGeo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    var bgMesh = new THREE.Mesh(bgGeo, new THREE.ShaderMaterial({ vertexShader: BVS, fragmentShader: BFS, uniforms: withBack({}), depthTest: false, depthWrite: false }));
    bgMesh.frustumCulled = false; bgMesh.renderOrder = -10; scene.add(bgMesh);

    // cells
    var geo = new THREE.BoxGeometry(1, 1, 1);
    var aTop = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4), aEdge = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4),
      aAO = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4), aSeam = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
    aTop.setUsage(THREE.DynamicDrawUsage); aEdge.setUsage(THREE.DynamicDrawUsage); aAO.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aTop', aTop); geo.setAttribute('aEdge', aEdge); geo.setAttribute('aAO', aAO); geo.setAttribute('aSeam', aSeam);
    var mat = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: withBack({
      uCenter: { value: new THREE.Vector3() }, uSpan: { value: 10 }, uFwd: { value: new THREE.Vector3(1, 1, 1).normalize() }, uKey: { value: KEY },
      uFade: { value: new THREE.Vector3(0, 5, 10) }, uCool: v3u(COOL), uCap: U_CAP, uCapL: { value: CAPL || 1 }, uBevel: { value: 0.3 }, uExposure: { value: 1 } }) });
    var mesh = new THREE.InstancedMesh(geo, mat, N); mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); inner.add(mesh);
    var M = mesh.instanceMatrix.array;

    // floor grid (persistent) and contact shadows (+1 draw call each)
    var gGeo = new THREE.PlaneGeometry(1, 1); gGeo.rotateX(-Math.PI / 2);
    var GRID = 120, gMat = new THREE.ShaderMaterial({ vertexShader: GVS, fragmentShader: GFS, transparent: true, depthWrite: false,
      uniforms: withBack({ uOff: { value: new THREE.Vector2() }, uSize: { value: GRID }, uCol: v3u(pal.cap), uC: { value: new THREE.Vector2() }, uA: { value: 0.07 } }) });
    var grid = new THREE.Mesh(gGeo, gMat); grid.scale.set(GRID, 1, GRID); grid.frustumCulled = false; grid.renderOrder = 1; inner.add(grid);
    var SHW = 0.34, sMat = new THREE.ShaderMaterial({ vertexShader: SVS, fragmentShader: SFS, transparent: true, depthWrite: false,
      uniforms: { uCol: v3u([pal.bg[0] * 0.3, pal.bg[1] * 0.3, pal.bg[2] * 0.3]), uM: { value: SHW } } });
    var shadows = new THREE.InstancedMesh(gGeo, sMat, N); shadows.frustumCulled = false; shadows.renderOrder = 2; shadows.instanceMatrix.setUsage(THREE.DynamicDrawUsage); inner.add(shadows);
    var SM = shadows.instanceMatrix.array;

    // smoke billboards (+1 draw call while smoke is on screen): they take over the smoke cells' slots
    var cr = cam.matrixWorld.elements, pMat = new THREE.ShaderMaterial({ vertexShader: PVS, fragmentShader: PFS, transparent: true, depthWrite: false,
      uniforms: { uCamR: v3u([cr[0], cr[1], cr[2]]), uCamU: v3u([cr[4], cr[5], cr[6]]), uCol: v3u(pal.top[T.smoke]), uHi: v3u(pal.cap), uTime: { value: 0 } } });
    var puffs = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), pMat, N); puffs.frustumCulled = false; puffs.renderOrder = 3; puffs.instanceMatrix.setUsage(THREE.DynamicDrawUsage); inner.add(puffs);
    var PM = puffs.instanceMatrix.array;
    // instanceMatrix starts as identity: zero every slot (scale 0) so nothing shows before the first frame writes it
    M.fill(0); SM.fill(0); PM.fill(0);

    // flow lines (one quad mesh per formation and depth mode) and detection cones; faded in when their formation settles
    // (a formation with an aiming story, coneAt, holds its cone and structure lines until the aim has landed)
    var FADE = [], FLOW = {};
    Object.keys(FM).forEach(function (name) {
      var f = FM[name]; FLOW[name] = f.lines.some(function (q) { return q.flow; });
      [true, false].forEach(function (depth) {
        var P = [], O = [], SE = [], Tt = [], Cc = [], Fl = [], Gr = [], Ac = [], IX = [], nv = 0;
        f.lines.forEach(function (l) {
          if (l.depth !== depth) return;
          var n = l.pts.length, c = pal.edge[l.t], a = l.a * pal.ea[l.t], acc = l.t === T.accent || l.t === T.ghost ? 1 : 0, fl = l.flow ? 1 : 0;
          for (var i = 0; i < n - 1; i++) {
            var A = l.pts[i], B = l.pts[i + 1], tA = i / (n - 1), tB = (i + 1) / (n - 1);
            for (var k = 0; k < 4; k++) { var end = k >> 1, Pp = end ? B : A, Oo = end ? A : B;
              P.push(Pp[0], Pp[1], Pp[2]); O.push(Oo[0], Oo[1], Oo[2]); SE.push(k & 1 ? 1 : -1, end); Tt.push(end ? tB : tA);
              Cc.push(c[0], c[1], c[2], a); Fl.push(fl); Gr.push(l.g); Ac.push(acc); }
            IX.push(nv, nv + 1, nv + 2, nv + 2, nv + 1, nv + 3); nv += 4;
          }
        });
        if (!P.length) return;
        var g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('aOther', new THREE.Float32BufferAttribute(O, 3));
        g.setAttribute('aSE', new THREE.Float32BufferAttribute(SE, 2)); g.setAttribute('aT', new THREE.Float32BufferAttribute(Tt, 1));
        g.setAttribute('aCol', new THREE.Float32BufferAttribute(Cc, 4)); g.setAttribute('aFlow', new THREE.Float32BufferAttribute(Fl, 1));
        g.setAttribute('aGrp', new THREE.Float32BufferAttribute(Gr, 1)); g.setAttribute('aAcc', new THREE.Float32BufferAttribute(Ac, 1)); g.setIndex(IX);
        var m = new THREE.ShaderMaterial({ vertexShader: LVS, fragmentShader: LFS, transparent: true, depthWrite: false, depthTest: depth, side: THREE.DoubleSide, forceSinglePass: true,
          uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uGrp: { value: 0 }, uSteel: v3u(pal.top[T.smoke]), uCap: U_CAP, uRes: U_RES, uWidth: U_W } });
        var obj = new THREE.Mesh(g, m); obj.frustumCulled = false; obj.visible = false; obj.renderOrder = depth ? 4 : 5; inner.add(obj);
        FADE.push({ name: name, obj: obj, op: 0, uO: m.uniforms.uOpacity, uT: m.uniforms.uTime, uG: m.uniforms.uGrp, wait: depth ? f.coneAt || 0 : 0 });
      });
      if (f.cone) {
        var cp = [], ct = [], cb = [], A = f.cone.apex, Q4 = f.cone.base;
        for (var i = 0; i < 4; i++) { var B = Q4[i], D = Q4[(i + 1) % 4];
          cp.push(A[0], A[1], A[2], B[0], B[1], B[2], D[0], D[1], D[2]); ct.push(0, 1, 1); cb.push(1, 0, 0, 0, 1, 0, 0, 0, 1); }
        var cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3));
        cg.setAttribute('aT', new THREE.Float32BufferAttribute(ct, 1)); cg.setAttribute('aB', new THREE.Float32BufferAttribute(cb, 3));
        var cm = new THREE.ShaderMaterial({ vertexShader: CVS, fragmentShader: CFS, transparent: true, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true,
          uniforms: { uCol: v3u(ACC), uOp: { value: 0 }, uTime: { value: 0 } } });
        var co = new THREE.Mesh(cg, cm); co.frustumCulled = false; co.visible = false; co.renderOrder = 4; inner.add(co);
        FADE.push({ name: name, obj: co, op: 0, uO: cm.uniforms.uOp, uT: cm.uniforms.uTime, uG: null, wait: f.coneAt || 0 });
      }
    });
    var WV = new Uint8Array(FADE.length);

    // per-formation bake (AO, seam mask, shadow casters, floor, smoke slots, story length), padded to N; lazily,
    // pre-baked on idle
    function prep(f) {
      if (f.gl) return f.gl;
      var b = S.bake(f), n = Math.min(f.cells.length, N), ao = new Float32Array(N * 4), seam = new Float32Array(N * 3), cast = new Float32Array(N), sm = new Float32Array(N), end = 0;
      for (var i = 0; i < N; i++) { ao[i * 4] = ao[i * 4 + 1] = ao[i * 4 + 2] = 1; ao[i * 4 + 3] = 0; }
      ao.set(b.ao.subarray(0, n * 4)); seam.set(b.seam.subarray(0, n * 3));
      for (i = 0; i < n; i++) { var c = f.cells[i]; cast[i] = b.cast[i]; sm[i] = f.anim === 'smoke' && c.g === 'smoke' && c.s[0] > 0 ? 1 : 0;
        if (c.hinge) end = Math.max(end, c.hinge.t[0] + c.hinge.t[1]); if (c.blink) end = Math.max(end, c.blink[0] + c.blink[1]); }
      return (f.gl = { ao: ao, seam: seam, cast: cast, sm: sm, floorY: b.floorY, gridY: b.gridY, story: end });
    }
    var bakeQ = Object.keys(FM);
    function bakeIdle() { if (!bakeQ.length) return; prep(FM[bakeQ.shift()]); idle(bakeIdle); }

    // per-instance state: current, from (captured at each change), delays, lift heights
    function st() { var s = { pos: new Float32Array(N * 3), scl: new Float32Array(N * 3), top: new Float32Array(N * 4), edge: new Float32Array(N * 4),
      ao: new Float32Array(N * 4), q: new Float32Array(N * 4), cast: new Float32Array(N), sm: new Float32Array(N) };
      for (var i = 0; i < N; i++) { s.ao[i * 4] = s.ao[i * 4 + 1] = s.ao[i * 4 + 2] = 1; s.q[i * 4 + 3] = 1; } return s; }
    var cur = st(), from = st(), delay = new Float32Array(N), lift = new Float32Array(N), hov = new Float32Array(N), hovT = new Float32Array(N);
    var target = null, t0 = 0, dur = 0, frFrom = null, frTo = null, frCur = { s: 1, cx: 0, cy: 0, px: 0, py: 0 }, frInit = false;
    var pivFrom = [0, 0, 0], pivTo = [0, 0, 0], pivCur = [0, 0, 0], flFrom = 0, flTo = 0, grFrom = 0, grTo = 0, curFloor = 0, curGrid = 0;
    var fdFrom = 0, fdTo = 0, fdCur = 0, fdR0 = 5, fdR1 = 10;
    var time = Number(Q.t) || 0, last = 0, lastDraw = 0, raf = 0, grp = 0, settledShown = false, paused = false, ambientOnly = false, aoLive = false;
    var stopAt = 0, hiddenAt = Infinity, fresh = false, warmDraw = false, ovlDirty = true;
    var rot = { x: 0, y: 0 }, rotT = { x: 0, y: 0 }, drift = 0, driftT = 0, pointer = null;
    var tmpTop = [0, 0, 0, 0], tmpEdge = [0, 0, 0, 0], tmpPos = [0, 0, 0], tmpScl = [0, 0, 0], tmpQ = [0, 0, 0, 1], qa = [0, 0, 0, 1], vr = [0, 0, 0];
    var W16 = new Float32Array(16), W7 = new Float32Array(7), VIEW = new Float64Array(10);
    // morph tempo: lift → travel → settle, PH ms each with OV ms overlaps, plus a spatial sweep of SW ms (≤ 480).
    // Hero moments use the quick tempo so a moment's morph fits in 1.1 s; the micro-story starts once it has settled
    // (or after 240 ms for a variant of the same family, where the cells stay put).
    var MOMENT = { hero: 1, ai: 1, auto: 1, iot: 1, sec: 1 }, PH = 420, OV = 140, SW = 480, MEND = 980, GE = 1100, storyAt = 0, sMs = 1e9;

    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    function ease(x) { x = clamp01(x); return 1 - Math.pow(1 - x, 3.2); }   // ≈ cubic-bezier(0.2, 0, 0, 1) (--ease-standard)
    function easeIO(x) { x = clamp01(x); return x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x); }   // power2.inOut
    function qAxis(o, ax, a) { var s = Math.sin(a / 2); o[0] = ax[0] * s; o[1] = ax[1] * s; o[2] = ax[2] * s; o[3] = Math.cos(a / 2); }
    function qMul(o, a, b) { var x = a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], y = a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
      z = a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], w = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]; o[0] = x; o[1] = y; o[2] = z; o[3] = w; }
    function qRot(o, q, v) { var x = v[0], y = v[1], z = v[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3];
      var ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
      o[0] = ix * qw - iw * qx - iy * qz + iz * qy; o[1] = iy * qw - iw * qy - iz * qx + ix * qz; o[2] = iz * qw - iw * qz - ix * qy + iy * qx; }
    function colorOf(f, c, top, edge) {
      var nodim = c.t === T.accent || c.t === T.danger || c.t === T.smoke, d = nodim ? 1 : 0.35 + 0.65 * f.dim, et = c.e !== undefined ? c.e : c.t;
      var tp = TOP[c.t], ec = pal.edge[et], ed = nodim ? 1 : 0.55 + 0.45 * d;
      top[0] = tp[0] * d; top[1] = tp[1] * d; top[2] = tp[2] * d; top[3] = KEEP[c.t];
      edge[0] = ec[0] * ed; edge[1] = ec[1] * ed; edge[2] = ec[2] * ed; edge[3] = pal.ea[et] * (c.ea !== undefined ? c.ea : 1);
    }
    // live target for a cell: its rest pose plus the formation's ambient motion and micro-story at the current time
    function live(f, c, i, pos, scl, top, edge, q) {
      pos[0] = c.p[0]; pos[1] = c.p[1]; pos[2] = c.p[2]; scl[0] = c.s[0]; scl[1] = c.s[1]; scl[2] = c.s[2];
      if (c.q) { q[0] = c.q[0]; q[1] = c.q[1]; q[2] = c.q[2]; q[3] = c.q[3]; } else { q[0] = q[1] = q[2] = 0; q[3] = 1; }
      colorOf(f, c, top, edge);
      if (c.hinge) {   // swings from its start offset to rest about the hinge (rest = the story's end state)
        var hg = c.hinge, a = hg.a0 * (1 - ease((sMs - hg.t[0]) / hg.t[1]));
        if (a !== 0) { qAxis(qa, hg.ax, a); vr[0] = pos[0] - hg.p[0]; vr[1] = pos[1] - hg.p[1]; vr[2] = pos[2] - hg.p[2]; qRot(vr, qa, vr);
          pos[0] = hg.p[0] + vr[0]; pos[1] = hg.p[1] + vr[1]; pos[2] = hg.p[2] + vr[2]; qMul(q, qa, q); }
      }
      if (c.blink) {   // a short flash in the accent, with its rim
        var bu = (sMs - c.blink[0]) / c.blink[1];
        if (bu > 0 && bu < 1) { var bw = Math.sin(Math.PI * bu);
          for (var k = 0; k < 3; k++) { top[k] += (ACC[k] - top[k]) * bw * 0.85; edge[k] = ACC[k]; } top[3] = Math.max(top[3], bw); edge[3] = Math.max(edge[3], bw); }
      }
      if (f.anim === 'breathe') {
        var L = Math.hypot(pos[0], pos[1], pos[2]) || 1, w = 0.09 * Math.sin(time * 1.15 - L * 0.55) + hov[i];
        pos[0] += pos[0] / L * w; pos[1] += pos[1] / L * w; pos[2] += pos[2] / L * w;
        if (hov[i] > 0.01) { var kh = Math.min(1, hov[i] * 2); edge[3] = Math.min(1, edge[3] + 0.6 * kh); edge[0] += (1 - edge[0]) * kh * 0.5; edge[1] += (1 - edge[1]) * kh * 0.5; edge[2] += (1 - edge[2]) * kh * 0.5; }
      } else if (f.anim === 'smoke' && c.g === 'smoke') {
        var fr = (c.ph + time * 0.11) % 1;
        pos[0] = c.p[0] + (fr - c.ph) * 0.7; pos[1] = 2.7 + fr * 3.4; var z = c.sz * (1 - 0.5 * fr) * Math.min(1, (1 - fr) * 6);
        scl[0] = scl[1] = scl[2] = z;
      } else if (f.anim === 'token' && c.g === 'token') {
        var path = f.path, u = (time * 0.16) % 1 * (path.length - 1), j = Math.floor(u), qq = u - j, A = path[j], B = path[Math.min(j + 1, path.length - 1)];
        pos[0] = A[0] + (B[0] - A[0]) * qq; pos[1] = A[1] + (B[1] - A[1]) * qq + 0.25; pos[2] = A[2] + (B[2] - A[2]) * qq;
      } else if (f.anim === 'scan' && c.g === 'text') {
        var sz = (time * 0.32) % 1 * 10 - 1, h = Math.exp(-Math.pow(c.row - sz, 2) / 0.7);
        top[0] += (1 - top[0]) * 0.3 * h; top[1] += (1 - top[1]) * 0.3 * h; top[2] += (1 - top[2]) * 0.3 * h; edge[3] = Math.min(1, edge[3] + 0.5 * h);
      } else if (f.anim === 'wave' && c.d !== undefined) {
        pos[1] += 0.34 * Math.sin(c.d * 0.8 - time * 1.1) * Math.max(0, 1 - c.d / 11);
      }
    }
    function copyFrame(o, a) { o.s = a.s; o.cx = a.cx; o.cy = a.cy; o.px = a.px; o.py = a.py; return o; }
    function lerpFrame(o, a, b, t) { o.s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t); o.cx = a.cx + (b.cx - a.cx) * t; o.cy = a.cy + (b.cy - a.cy) * t;
      o.px = a.px + (b.px - a.px) * t; o.py = a.py + (b.py - a.py) * t; }

    function go(name, instant) {
      var f = FM[name], now = performance.now();
      if (f === target && !instant) { kick(); return; }   // already there (or on its way): do not restart its story
      var g = prep(f);
      var animate = !instant && !isReduced() && target !== null && !paused && !document.hidden;
      // entrance: the stage was fully hidden (hero, gallery) and has just come back, so the old formation was never
      // seen. Build the new one in place (cells grow in a sweep, no camera travel) instead of morphing from it.
      var entering = animate && fresh;
      var quick = animate && !entering && MOMENT[name] && MOMENT[target.name];
      var sameFam = animate && !entering && target.family === f.family;
      PH = quick ? 340 : 420; OV = quick ? 110 : 140; SW = quick ? 300 : 480; MEND = 3 * PH - 2 * OV; GE = MEND + SW * 0.25; storyAt = sameFam ? 240 : MEND + SW * 0.5;
      from.pos.set(cur.pos); from.scl.set(cur.scl); from.top.set(cur.top); from.edge.set(cur.edge); from.ao.set(cur.ao); from.q.set(cur.q);
      from.cast.set(cur.cast); from.sm.set(cur.sm);
      if (entering) { from.scl.fill(0); from.sm.fill(0); }
      sMs = animate ? -1 : 1e9;   // appearing cells start in the story's first pose
      var b = f.box, maxD = 0;
      for (var i = 0; i < N; i++) {
        var c = f.cells[i], X, Y, i3 = i * 3, i4 = i * 4, k;
        lift[i] = 0;
        if (c && c.s[0] > 0) {
          live(f, c, i, tmpPos, tmpScl, tmpTop, tmpEdge, tmpQ);
          if (from.scl[i3] === 0) {   // appears: grow in place, starting in its own colours, pose and occlusion
            from.pos.set(tmpPos, i3); from.top.set(tmpTop, i4); from.edge.set(tmpEdge, i4); from.q.set(tmpQ, i4);
            for (k = 0; k < 4; k++) from.ao[i4 + k] = g.ao[i4 + k];
          } else if (animate) {   // travels: lifts on a curved path, higher for longer trips (no straight crossings)
            var dl = Math.hypot(tmpPos[0] - from.pos[i3], tmpPos[1] - from.pos[i3 + 1], tmpPos[2] - from.pos[i3 + 2]);
            var rr = (Math.sin(i * 12.9898) * 43758.5453) % 1; if (rr < 0) rr += 1;
            lift[i] = (0.6 + 0.8 * rr) * clamp01(dl / 1.5);
          }
          X = S.dot(c.p, R); Y = S.dot(c.p, U);
        } else {
          tmpPos[0] = from.pos[i3]; tmpPos[1] = from.pos[i3 + 1]; tmpPos[2] = from.pos[i3 + 2];
          X = S.dot(tmpPos, R); Y = S.dot(tmpPos, U);
        }
        delay[i] = f.sweep === 'radial' ? (c && c.s[0] > 0 ? Math.hypot(c.p[0], c.p[2]) : Math.hypot(tmpPos[0], tmpPos[2])) : ((X - b.x0) / b.w) * 0.6 + ((b.y1 - Y) / b.h) * 0.4;
        if (delay[i] > maxD) maxD = delay[i];
      }
      for (i = 0; i < N; i++) delay[i] = maxD > 0 ? Math.max(0, delay[i] / maxD) * SW : 0;   // spatial sweep ≤ 480 ms
      aSeam.array.set(g.seam); aSeam.needsUpdate = true;   // seams are a property of the target formation
      frTo = framing(f); frFrom = frInit && !entering ? copyFrame({}, frCur) : frTo;
      pivFrom = pivCur.slice(); pivTo = b.pivot.slice(); if (!target || entering) pivFrom = pivTo.slice();
      flFrom = target && !entering ? curFloor : g.floorY; grFrom = target && !entering ? curGrid : g.gridY; flTo = g.floorY; grTo = g.gridY;
      fdFrom = entering ? (f.fadeR ? 1 : 0) : fdCur; fdTo = f.fadeR ? 1 : 0; if (f.fadeR) { fdR0 = f.fadeR[0]; fdR1 = f.fadeR[1]; }
      if (entering) for (i = 0; i < FADE.length; i++) { FADE[i].op = 0; FADE[i].obj.visible = false; }
      target = f; t0 = now; dur = animate ? 1 : 0; settledShown = false; aoLive = true; ovlDirty = true;
      overlaysFor(f.name, false);
      kick();
    }

    var pxy = [0, 0], v3 = new THREE.Vector3();
    function frame(now) {
      raf = 0;
      if (!target || (paused && now >= stopAt)) return;   // paused: drawn through the stage's fade-out, then stopped
      if (ambientOnly && now - lastDraw < 31) { raf = requestAnimationFrame(frame); return; }   // ambient-only frames: 30 fps
      var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; lastDraw = now;
      var moving = !isReduced() && !document.hidden;
      if (moving) time += dt;
      var el = now - t0, morphing = false, hovering = false, f = target, g = f.gl, k1 = Math.min(1, dt * 9), aoNow = aoLive, smoke = false, k;
      var ge = dur ? easeIO(el / GE) : 1, P2 = PH - OV, CW = 2 * PH;
      var mLo = N, mHi = -1, sLo = N, sHi = -1, pLo = N, pHi = -1, cLo = N, cHi = -1;   // changed instance ranges (uploaded alone)
      sMs = dur ? el - storyAt : 1e9;
      curFloor = flFrom + (flTo - flFrom) * ge; curGrid = grFrom + (grTo - grFrom) * ge; fdCur = fdFrom + (fdTo - fdFrom) * ge;
      for (var i = 0; i < N; i++) {
        var c = f.cells[i], i3 = i * 3, i4 = i * 4, u = el - delay[i], eP = 1, eC = 1, lh = 0, o = i * 16, ch;
        if (dur && u < MEND) {   // lift (power2.out) → travel (power2.inOut) → settle (expo.out), overlapping by OV
          morphing = true;
          var a1 = clamp01(u / PH), a3 = clamp01((u - 2 * P2) / PH);
          eP = easeIO((u - P2) / PH); eC = ease((u - OV * 0.5) / CW);
          lh = lift[i] * ((1 - (1 - a1) * (1 - a1)) - (a3 >= 1 ? 1 : 1 - Math.pow(2, -10 * a3)));
        }
        hov[i] += (hovT[i] - hov[i]) * k1;
        if (Math.abs(hovT[i] - hov[i]) > 0.002) hovering = true;
        if (c && c.s[0] > 0) live(f, c, i, tmpPos, tmpScl, tmpTop, tmpEdge, tmpQ);
        else { tmpPos[0] = from.pos[i3]; tmpPos[1] = from.pos[i3 + 1]; tmpPos[2] = from.pos[i3 + 2]; tmpScl[0] = tmpScl[1] = tmpScl[2] = 0;
          for (k = 0; k < 4; k++) { tmpTop[k] = from.top[i4 + k]; tmpEdge[k] = from.edge[i4 + k]; tmpQ[k] = from.q[i4 + k]; } }
        for (k = 0; k < 3; k++) {
          cur.pos[i3 + k] = from.pos[i3 + k] + (tmpPos[k] - from.pos[i3 + k]) * eP;
          cur.scl[i3 + k] = from.scl[i3 + k] + (tmpScl[k] - from.scl[i3 + k]) * eC;
        }
        cur.pos[i3 + 1] += lh;
        var qd = from.q[i4] * tmpQ[0] + from.q[i4 + 1] * tmpQ[1] + from.q[i4 + 2] * tmpQ[2] + from.q[i4 + 3] * tmpQ[3], qs = qd < 0 ? -1 : 1, qn = 0;
        for (k = 0; k < 4; k++) {
          cur.top[i4 + k] = from.top[i4 + k] + (tmpTop[k] - from.top[i4 + k]) * eC;
          cur.edge[i4 + k] = from.edge[i4 + k] + (tmpEdge[k] - from.edge[i4 + k]) * eC;
          cur.q[i4 + k] = from.q[i4 + k] + (tmpQ[k] * qs - from.q[i4 + k]) * eC; qn += cur.q[i4 + k] * cur.q[i4 + k];
        }
        qn = 1 / Math.sqrt(qn || 1); for (k = 0; k < 4; k++) cur.q[i4 + k] *= qn;
        if (aoNow) { for (k = 0; k < 4; k++) cur.ao[i4 + k] = from.ao[i4 + k] + (g.ao[i4 + k] - from.ao[i4 + k]) * eC;
          cur.cast[i] = from.cast[i] + (g.cast[i] - from.cast[i]) * eC; cur.sm[i] = from.sm[i] + (g.sm[i] - from.sm[i]) * eC; }
        // colours: written only where they changed
        ch = false; for (k = 0; k < 4; k++) { if (aTop.array[i4 + k] !== cur.top[i4 + k]) { aTop.array[i4 + k] = cur.top[i4 + k]; ch = true; }
          if (aEdge.array[i4 + k] !== cur.edge[i4 + k]) { aEdge.array[i4 + k] = cur.edge[i4 + k]; ch = true; } }
        if (ch) { if (i < cLo) cLo = i; cHi = i; }
        var smw = cur.sm[i], sx = cur.scl[i3], sy = cur.scl[i3 + 1], sz = cur.scl[i3 + 2], px = cur.pos[i3], py = cur.pos[i3 + 1], pz = cur.pos[i3 + 2];
        // rotation × scale + translation, written directly (Matrix4.compose, no allocation); smoke slots hand over to puffs
        var qx = cur.q[i4], qy = cur.q[i4 + 1], qz = cur.q[i4 + 2], qw = cur.q[i4 + 3], x2 = qx + qx, y2 = qy + qy, z2 = qz + qz;
        var xx = qx * x2, xy = qx * y2, xz = qx * z2, yy = qy * y2, yz = qy * z2, zz = qz * z2, wx = qw * x2, wy = qw * y2, wz = qw * z2, ks = 1 - smw;
        W16[0] = (1 - (yy + zz)) * sx * ks; W16[1] = (xy + wz) * sx * ks; W16[2] = (xz - wy) * sx * ks; W16[3] = 0;
        W16[4] = (xy - wz) * sy * ks; W16[5] = (1 - (xx + zz)) * sy * ks; W16[6] = (yz + wx) * sy * ks; W16[7] = 0;
        W16[8] = (xz + wy) * sz * ks; W16[9] = (yz - wx) * sz * ks; W16[10] = (1 - (xx + yy)) * sz * ks; W16[11] = 0;
        W16[12] = px; W16[13] = py; W16[14] = pz; W16[15] = 1;
        ch = false; for (k = 0; k < 16; k++) if (M[o + k] !== W16[k]) { M[o + k] = W16[k]; ch = true; }
        if (ch) { if (i < mLo) mLo = i; mHi = i; }
        // contact shadow: fades with the height of the cell's foot above the floor (x/z scale = size, y scale = opacity)
        var foot = py - sy * 0.5 - curFloor, op = 0.35 * cur.cast[i] * ks * clamp01(1 - Math.max(0, foot) / 3);
        if (op > 0.004 && sx > 0.01) { W7[0] = sx + 2 * SHW; W7[1] = op; W7[2] = sz + 2 * SHW; W7[3] = px; W7[4] = curFloor + 0.006; W7[5] = pz; W7[6] = 1; }
        else { W7[0] = W7[1] = W7[2] = W7[3] = W7[4] = W7[5] = 0; W7[6] = 1; }
        if (SM[o] !== W7[0] || SM[o + 5] !== W7[1] || SM[o + 10] !== W7[2] || SM[o + 12] !== W7[3] || SM[o + 13] !== W7[4] || SM[o + 14] !== W7[5] || SM[o + 15] !== 1) {
          SM[o] = W7[0]; SM[o + 5] = W7[1]; SM[o + 10] = W7[2]; SM[o + 12] = W7[3]; SM[o + 13] = W7[4]; SM[o + 14] = W7[5]; SM[o + 15] = 1;
          if (i < sLo) sLo = i; sHi = i; }
        // smoke puff in the same slot (x scale = size, y = opacity, z = seed)
        if (smw > 0.003 && sx > 0.01) { smoke = true; W7[0] = sx * 2.3; W7[1] = smw * 0.5; W7[2] = 1 + (i % 7) * 0.37; W7[3] = px; W7[4] = py; W7[5] = pz; }
        else { W7[0] = W7[1] = W7[2] = W7[3] = W7[4] = W7[5] = 0; }
        if (PM[o] !== W7[0] || PM[o + 5] !== W7[1] || PM[o + 10] !== W7[2] || PM[o + 12] !== W7[3] || PM[o + 13] !== W7[4] || PM[o + 14] !== W7[5] || PM[o + 15] !== 1) {
          PM[o] = W7[0]; PM[o + 5] = W7[1]; PM[o + 10] = W7[2]; PM[o + 12] = W7[3]; PM[o + 13] = W7[4]; PM[o + 14] = W7[5]; PM[o + 15] = 1;
          if (i < pLo) pLo = i; pHi = i; }
      }
      if (!morphing) aoLive = false;
      if (aoNow) { aAO.array.set(cur.ao); aAO.needsUpdate = true; }   // AO only changes in a morph
      upload(mesh.instanceMatrix, mLo, mHi, 16); upload(shadows.instanceMatrix, sLo, sHi, 16); upload(aTop, cLo, cHi, 4); upload(aEdge, cLo, cHi, 4);
      if (smoke) { if (puffs.visible) upload(puffs.instanceMatrix, pLo, pHi, 16); else full(puffs.instanceMatrix); pMat.uniforms.uTime.value = time; }
      puffs.visible = smoke;   // (while hidden its matrices are not uploaded; they go up whole when it shows again)

      lerpFrame(frCur, frFrom, frTo, ge); frInit = true;
      for (k = 0; k < 3; k++) pivCur[k] = pivFrom[k] + (pivTo[k] - pivFrom[k]) * ge;
      var l = frCur.cx - frCur.px / frCur.s, t = frCur.cy + frCur.py / frCur.s, dpr = renderer.getPixelRatio();
      cam.left = l; cam.right = l + vw / frCur.s; cam.top = t; cam.bottom = t - vh / frCur.s; cam.updateProjectionMatrix();
      mat.uniforms.uCenter.value.set(pivCur[0], pivCur[1], pivCur[2]); mat.uniforms.uSpan.value = Math.max(f.box.w, f.box.h) * 0.9;
      mat.uniforms.uFade.value.set(fdCur, fdR0, fdR1);
      U_BACK.uPoolC.value.set(frCur.px * dpr, (vh - frCur.py) * dpr); U_BACK.uPoolR.value.set(0.6 * vw * dpr, 0.55 * vh * dpr);
      grid.position.set(pivCur[0], curGrid, pivCur[2]); gMat.uniforms.uOff.value.set(pivCur[0], pivCur[2]); gMat.uniforms.uC.value.set(pivCur[0], pivCur[2]);

      // rotation: ambient sway + scroll drift + pointer parallax, all smoothed (≤ 0.5 s)
      var k2 = Math.min(1, dt * 7);
      drift += (driftT - drift) * k2; rot.x += (rotT.x - rot.x) * k2; rot.y += (rotT.y - rot.y) * k2;
      var sway = f.anim === 'none' ? 0 : 0.05 * Math.sin(time * 0.21), ry = sway + drift + rot.y;
      pivotG.position.set(pivCur[0], pivCur[1], pivCur[2]); inner.position.set(-pivCur[0], -pivCur[1], -pivCur[2]);
      pivotG.rotation.set(rot.x, ry, 0, 'YXZ');
      var converging = Math.abs(driftT - drift) > 0.0005 || Math.abs(rotT.x - rot.x) > 0.0005 || Math.abs(rotT.y - rot.y) > 0.0005;

      // lines and cones: the target formation's fade in once its cells have mostly arrived (and, for an aiming
      // story, once the aim has landed); all others fade out
      var lineAnim = false, kl = dur ? Math.min(1, dt * 5) : 1, red = isReduced();
      for (var li = 0; li < FADE.length; li++) {
        var Fd = FADE[li], want = Fd.name === f.name && ge > 0.55 && sMs >= Fd.wait ? 1 : 0;
        Fd.op += (want - Fd.op) * (red ? 1 : kl); if (Math.abs(want - Fd.op) < 0.003) Fd.op = want; else lineAnim = true;
        Fd.obj.visible = Fd.op > 0.001; Fd.uO.value = Fd.op; Fd.uT.value = time; if (Fd.uG) Fd.uG.value = grp;
      }

      renderer.render(scene, cam);
      if (warmDraw) warmPass();
      fresh = false;

      if (!settledShown && ge > 0.85) { settledShown = true; overlaysFor(f.name, true); ovlDirty = true; }
      // overlays follow the projection: re-place them only when it changed (static beats stop touching the DOM)
      if (ovlDirty || VIEW[0] !== frCur.s || VIEW[1] !== l || VIEW[2] !== t || VIEW[3] !== rot.x || VIEW[4] !== ry || VIEW[5] !== pivCur[0] ||
          VIEW[6] !== pivCur[1] || VIEW[7] !== pivCur[2] || VIEW[8] !== vw || VIEW[9] !== vh) {
        VIEW[0] = frCur.s; VIEW[1] = l; VIEW[2] = t; VIEW[3] = rot.x; VIEW[4] = ry; VIEW[5] = pivCur[0]; VIEW[6] = pivCur[1]; VIEW[7] = pivCur[2]; VIEW[8] = vw; VIEW[9] = vh;
        ovlDirty = false; placeOverlays(f.name, project, frCur.s);
      }

      var busy = morphing || ge < 1 || converging || lineAnim || hovering || (dur > 0 && sMs < g.story + 40);
      var ambient = moving && (f.anim !== 'none' || FLOW[f.name] || !!f.cone);
      ambientOnly = !busy && ambient;
      if (busy || ambient || (paused && now < stopAt)) raf = requestAnimationFrame(frame);
    }
    function upload(attr, lo, hi, w) {   // one bufferSubData for the changed instance range (none when nothing changed)
      if (lo > hi) return;
      if (attr.addUpdateRange) { attr.clearUpdateRanges(); attr.addUpdateRange(lo * w, (hi - lo + 1) * w); }
      attr.needsUpdate = true;
    }
    function full(attr) { if (attr.clearUpdateRanges) attr.clearUpdateRanges(); attr.needsUpdate = true; }
    function project(p) { v3.set(p[0], p[1], p[2]).applyMatrix4(inner.matrixWorld).project(cam); pxy[0] = (v3.x + 1) / 2 * vw; pxy[1] = (1 - v3.y) / 2 * vh; return pxy; }
    function kick() { ambientOnly = false; if (!raf && (!paused || performance.now() < stopAt) && !document.hidden && target) { last = 0; raf = requestAnimationFrame(frame); } }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, vw < 1024 ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr); renderer.setSize(vw, vh, false);
      renderer.getDrawingBufferSize(U_RES.value); U_W.value = 2 * dpr;   // lines: 2 CSS px
      if (target) { frTo = framing(target); if (!dur || performance.now() - t0 > GE) { frFrom = frTo; copyFrame(frCur, frTo); } }
      ovlDirty = true; kick();
    }
    resize();

    // micro-interaction: cells of the core near the pointer lift outward and take an interactive (cyan) rim
    var pending = false, pp = [0, 0, 0];
    function hoverPass() {
      pending = false;
      var hero = target && target.name === 'hero';
      for (var i = 0; i < N; i++) {
        if (!hero || !pointer || !(cur.scl[i * 3] > 0)) { hovT[i] = 0; continue; }
        pp[0] = cur.pos[i * 3]; pp[1] = cur.pos[i * 3 + 1]; pp[2] = cur.pos[i * 3 + 2];
        var xy = project(pp), d = Math.hypot(xy[0] - pointer[0], xy[1] - pointer[1]);
        hovT[i] = d < 150 ? 0.55 * (1 - d / 150) * (1 - d / 150) : 0;
      }
      kick();
    }
    function pointerAt(x, y) {
      if (isReduced()) { rotT.x = rotT.y = 0; return; }
      rotT.y = (x / vw - 0.5) * 0.09; rotT.x = (y / vh - 0.5) * 0.05; pointer = pointer || [0, 0]; pointer[0] = x; pointer[1] = y;
      if (!pending && !paused) { pending = true; requestAnimationFrame(hoverPass); }
      kick();
    }
    function pointerOut() { pointer = null; rotT.x = rotT.y = 0; for (var i = 0; i < N; i++) hovT[i] = 0; kick(); }

    // pause: the page fades the stage with a CSS opacity transition; keep drawing for that long, then stop
    function fadeMs() {
      if (isReduced()) return 0;
      var cs = getComputedStyle(stage), pr = cs.transitionProperty.split(','), du = cs.transitionDuration.split(','), de = cs.transitionDelay.split(','), ms = 0;
      if (parseFloat(cs.opacity) === 0) return 0;   // already hidden (at boot on the hero): stop now
      function sec(v) { v = String(v || '0').trim(); return (parseFloat(v) || 0) * (/ms$/.test(v) ? 1 : 1000); }
      for (var i = 0; i < pr.length; i++) { var p = pr[i].trim(); if (p === 'opacity' || p === 'all') ms = Math.max(ms, sec(du[i % du.length]) + sec(de[i % de.length])); }
      return Math.min(ms, 1200);
    }
    function pause(on) {
      on = !!on; if (on === paused) return;
      var now = performance.now(); paused = on;
      if (on) { stopAt = now + fadeMs(); hiddenAt = stopAt; if (stopAt <= now && raf) { cancelAnimationFrame(raf); raf = 0; } }
      else { fresh = now >= hiddenAt; hiddenAt = Infinity; kick(); }
    }

    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; GL = null; mode = 'poster';
      stage.classList.remove('is-gl'); posterShow(current, true); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else kick(); });
    var idle = window.requestIdleCallback ? function (cb) { window.requestIdleCallback(cb, { timeout: 2000 }); } : function (cb) { setTimeout(cb, 120); };
    idle(bakeIdle);
    // warm-up, on idle: compile every program, hidden ones included (lines, cones, smoke), without drawing anything;
    // compileAsync lets KHR_parallel_shader_compile link them off the main thread. The next rendered frame then draws
    // the hidden programs once, invisibly (opacity 0, zero-size puffs, in the same task as the real frame), so the
    // first morph into a formation that shows one does not stall on first use.
    function warmOn() { warmDraw = true; kick(); }
    function warm() {
      var pv = puffs.visible, i;
      for (i = 0; i < FADE.length; i++) { WV[i] = FADE[i].obj.visible ? 1 : 0; FADE[i].obj.visible = true; }
      puffs.visible = true;
      var par = renderer.extensions && renderer.extensions.has && renderer.extensions.has('KHR_parallel_shader_compile');
      try { if (par && renderer.compileAsync) renderer.compileAsync(scene, cam).then(warmOn, warmOn); else { renderer.compile(scene, cam); warmOn(); } } catch (e) { warmOn(); }
      puffs.visible = pv; for (i = 0; i < FADE.length; i++) FADE[i].obj.visible = !!WV[i];
    }
    function warmPass() {
      warmDraw = false;
      var pv = puffs.visible, i;
      bgMesh.visible = mesh.visible = grid.visible = shadows.visible = false;
      for (i = 0; i < FADE.length; i++) { WV[i] = FADE[i].obj.visible ? 1 : 0; FADE[i].obj.visible = !WV[i]; }   // only the hidden ones (opacity 0)
      if (!pv) { puffs.visible = true; full(puffs.instanceMatrix); }   // hidden puffs: zero-size matrices, uploaded whole
      renderer.autoClear = false; renderer.render(scene, cam); renderer.autoClear = true;
      bgMesh.visible = mesh.visible = grid.visible = shadows.visible = true; puffs.visible = pv;
      for (i = 0; i < FADE.length; i++) FADE[i].obj.visible = !!WV[i];
    }
    idle(warm);

    return { go: go, kick: kick, resize: resize, pointer: pointerAt, pointerOut: pointerOut,
      drift: function (p) { driftT = isReduced() ? 0 : p * 0.16; kick(); },
      stream: function (g) { grp = g; kick(); },
      reveal: function () { requestAnimationFrame(function () { stage.classList.add('is-gl'); }); },
      pause: pause };
  }

