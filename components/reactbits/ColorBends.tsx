"use client";

/**
 * ColorBends — adapted from React Bits (https://reactbits.dev, DavidHDev/react-bits,
 * TS-CSS registry). MIT + Commons Clause: see ./LICENSE.md.
 *
 * The fragment shader and the uniform model are the original's. Changes, all
 * for running it as a fixed, full-viewport, non-interactive page background:
 *
 *   · pointer: read from the shared store (lib/pointer.ts) instead of a
 *     `pointermove` listener on the container, because the layer is
 *     `pointer-events: none` and must still follow the cursor across the page;
 *   · `renderScale`: the canvas renders at a fraction of the CSS size (the
 *     bands are soft, so 0.5 is visually identical and costs a quarter);
 *   · `paused` and the tab's visibility stop the rAF loop; `animate={false}`
 *     draws one still frame (reduced motion);
 *   · `maxFps`: the bands move slowly, so 30 fps is indistinguishable from 60,
 *     and every frame the canvas skips is a frame the compositor does not have
 *     to redraw (re-applying the blur filters of the layers above it);
 *   · `fadeTop`: the brief's prop, which the official component does not have,
 *     implemented as a CSS mask (0 = no fade, 1 = the top is fully faded);
 *   · `onError`: no WebGL, a failed context or a lost context reports up, so
 *     the parent can keep its static gradient instead;
 *   · `colors` (an array) is the real API; the brief's `color` maps onto it;
 *   · `followPointer={false}`: the bands never react to the cursor (the site
 *     uses this — the cursor changes no light anywhere);
 *   · `colorsTo` + `mix()`: the band colours blend towards a second set by a
 *     value read every frame (the page's scroll depth), with no React render.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { getPointer, retainPointer } from "@/lib/pointer";

export type ColorBendsProps = {
  className?: string;
  style?: CSSProperties;
  rotation?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  iterations?: number;
  intensity?: number;
  bandWidth?: number;
  /** Adaptation: fade the top of the layer (0–1). */
  fadeTop?: number;
  /** Adaptation: canvas resolution as a fraction of CSS px × DPR (capped at DPR 1). */
  renderScale?: number;
  /** Adaptation: stop the loop (e.g. while a page section covers the layer). */
  paused?: boolean;
  /** Adaptation: false draws a single still frame. */
  animate?: boolean;
  /** Adaptation: called once if WebGL is unavailable or the context is lost. */
  onError?: () => void;
  /** Adaptation: frame-rate cap for the render loop. */
  maxFps?: number;
  /** Adaptation: false ignores the pointer (no parallax, no warp). */
  followPointer?: boolean;
  /** Adaptation: a second colour set, blended in by `mix()` (0–1). */
  colorsTo?: string[];
  mix?: () => number;
};

const MAX_COLORS = 8 as const;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3); // strong response across 0..1
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); // allow >1 to amplify displacement
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const toVec3 = (hex: string) => {
  const h = hex.replace("#", "").trim();
  const v =
    h.length === 3
      ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
      : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
};

export default function ColorBends({
  className = "",
  style,
  rotation = 90,
  speed = 0.2,
  colors = [],
  transparent = true,
  autoRotate = 0,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.15,
  iterations = 1,
  intensity = 1.5,
  bandWidth = 6,
  fadeTop = 0,
  renderScale = 0.5,
  paused = false,
  animate = true,
  onError,
  maxFps = 60,
  followPointer = true,
  colorsTo,
  mix,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const renderOnceRef = useRef<(() => void) | null>(null);
  const loopCtlRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);
  const animateRef = useRef(animate);
  const pausedRef = useRef(paused);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const mixRef = useRef(mix);
  mixRef.current = mix;
  /* Base and target colours, read by the render loop. */
  const fromRef = useRef<THREE.Vector3[]>([]);
  const toRef = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
        premultipliedAlpha: true,
      });
    } catch {
      onErrorRef.current?.();
      return;
    }
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: uColorsArray },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uIterations: { value: iterations },
        uIntensity: { value: intensity },
        uBandWidth: { value: bandWidth },
      },
      premultipliedAlpha: true,
      transparent: true,
    });
    materialRef.current = material;
    scene.add(new THREE.Mesh(geometry, material));

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, transparent ? 0 : 1);
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      onErrorRef.current?.();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      /* DPR capped at 1, then scaled: soft bands do not need retina pixels. */
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1) * renderScale);
      renderer.setSize(w, h, false);
      (material.uniforms.uCanvas.value as THREE.Vector2).set(w, h);
      if (!rafRef) renderOnce();
    };

    const pointerCur = new THREE.Vector2(0, 0);
    const pointerTgt = new THREE.Vector2(0, 0);
    const releasePointer = followPointer ? retainPointer() : () => {};
    const startTime = performance.now();
    let last = startTime;
    let rafRef = 0;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const elapsed = (now - startTime) / 1000;
      material.uniforms.uTime.value = animateRef.current ? elapsed : 2.4;

      const deg = (rotationRef.current % 360) + autoRotateRef.current * (animateRef.current ? elapsed : 0);
      const rad = (deg * Math.PI) / 180;
      (material.uniforms.uRot.value as THREE.Vector2).set(Math.cos(rad), Math.sin(rad));

      if (followPointer) {
        const p = getPointer();
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        const tx = ((p.sx / w) * 2 - 1) * p.presence;
        const ty = -((p.sy / h) * 2 - 1) * p.presence;
        pointerCur.lerp(pointerTgt.set(tx, ty), Math.min(1, dt * 8));
        (material.uniforms.uPointer.value as THREE.Vector2).copy(pointerCur);
      }
      const k = mixRef.current ? Math.max(0, Math.min(1, mixRef.current())) : 0;
      const from = fromRef.current;
      const to = toRef.current;
      if (to.length) {
        const slots = material.uniforms.uColors.value as THREE.Vector3[];
        for (let i = 0; i < from.length; i++) slots[i].copy(from[i]).lerp(to[i] ?? from[i], k);
      }
      renderer.render(scene, camera);
    };

    const minInterval = 1000 / Math.max(1, maxFps) - 2; // 2 ms slack for rAF jitter
    let lastDraw = 0;
    const loop = (now: number) => {
      if (now - lastDraw >= minInterval) {
        lastDraw = now;
        draw(now);
      }
      rafRef = requestAnimationFrame(loop);
    };
    function start() {
      if (rafRef || !animateRef.current || pausedRef.current || document.hidden) return;
      last = performance.now();
      rafRef = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(rafRef);
      rafRef = 0;
    }
    function renderOnce() {
      draw(performance.now());
    }
    renderOnceRef.current = renderOnce;
    loopCtlRef.current = { start, stop };

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    renderOnce();
    start();

    return () => {
      stop();
      ro.disconnect();
      releasePointer();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvas.parentElement === container) container.removeChild(canvas);
      materialRef.current = null;
      rendererRef.current = null;
      renderOnceRef.current = null;
      loopCtlRef.current = null;
    };
    // The renderer is created once; prop changes are applied by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderScale, maxFps, followPointer]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uScale.value = scale;
    material.uniforms.uFrequency.value = frequency;
    material.uniforms.uWarpStrength.value = warpStrength;
    material.uniforms.uMouseInfluence.value = mouseInfluence;
    material.uniforms.uParallax.value = parallax;
    material.uniforms.uNoise.value = noise;
    material.uniforms.uIterations.value = iterations;
    material.uniforms.uIntensity.value = intensity;
    material.uniforms.uBandWidth.value = bandWidth;

    const arr = (colors || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
    fromRef.current = arr;
    toRef.current = (colorsTo || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
    const slots = material.uniforms.uColors.value as THREE.Vector3[];
    for (let i = 0; i < MAX_COLORS; i++) {
      if (i < arr.length) slots[i].copy(arr[i]);
      else slots[i].set(0, 0, 0);
    }
    material.uniforms.uColorCount.value = arr.length;
    material.uniforms.uTransparent.value = transparent ? 1 : 0;
    rendererRef.current?.setClearColor(0x000000, transparent ? 0 : 1);
    renderOnceRef.current?.();
  }, [rotation, autoRotate, speed, scale, frequency, warpStrength, mouseInfluence, parallax, noise, iterations, intensity, bandWidth, colors, colorsTo, transparent]);

  useEffect(() => {
    animateRef.current = animate;
    pausedRef.current = paused;
    const ctl = loopCtlRef.current;
    if (!ctl) return;
    if (paused || !animate) {
      ctl.stop();
      renderOnceRef.current?.();
    } else ctl.start();
  }, [animate, paused]);

  const fade = Math.max(0, Math.min(1, fadeTop));
  const mask =
    fade > 0
      ? `linear-gradient(to bottom, rgba(0,0,0,${(1 - fade).toFixed(3)}) 0%, rgba(0,0,0,1) ${Math.round(28 + fade * 52)}%)`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`color-bends-container ${className}`.trim()}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", WebkitMaskImage: mask, maskImage: mask, ...style }}
      aria-hidden="true"
    />
  );
}
