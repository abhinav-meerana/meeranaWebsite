"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SCENE } from "@/lib/scene-colors";

/* ============================================================================
   The page background (brief §6–§7). One fixed, non-interactive stack behind
   every route, mounted once in the root layout, so it never resets between
   sections or on client-side navigation:

     1  base      CSS: midnight navy with a stationary royal/cyan mesh. Always
                  painted, so a failed or missing WebGL context, reduced
                  motion, a phone or no JavaScript still get the full palette.
     2  deep      CSS: the dark Meerana-logo blue (--meerana-deep). Its opacity
                  follows how far down the page the reader is (--deep, 0 → 1),
                  so the page turns from midnight navy to deep logo blue
                  towards the bottom (owner decision 2026-10-13).
     3  bends     React Bits ColorBends (WebGL): the bands drift on their own;
                  their colour blends towards brand blue with --deep, so they
                  stay visible on the deeper base.
     4  dots      React Bits DotField (canvas 2D): a quiet sparkling grid.
     5  shade     vignette + baked grain.

   Nothing here reacts to the cursor (owner decision 2026-10-13: "remove the
   light change while moving the cursor, keep the animation"): the pointer
   glow layer is gone, ColorBends runs with followPointer={false} and DotField
   with interactive={false}.

   Layers 3–4 run only with a fine pointer at ≥1024 px, without Save-Data or a
   low-memory signal; everywhere else the base and the deep layer carry the
   look. Under reduced motion the live layers draw one still frame.
   ========================================================================== */

const ColorBends = dynamic(() => import("@/components/reactbits/ColorBends"), { ssr: false, loading: () => null });
const DotField = dynamic(() => import("@/components/reactbits/DotField"), { ssr: false, loading: () => null });

const LIVE_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

type Mode = "pending" | "live" | "static";

function lowPower(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return nav.connection?.saveData === true || (nav.deviceMemory ?? 8) <= 4;
}

let glProbe: boolean | undefined;
function canWebGL(): boolean {
  if (glProbe !== undefined) return glProbe;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    glProbe = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    glProbe = false;
  }
  return glProbe;
}

/* The brief's ColorBends configuration. `color` is passed as the real
   `colors` array; `fadeTop` is implemented by the adapted component. */
const BENDS_COLORS = [SCENE.bends];
const BENDS_DEEP = [SCENE.bendsDeep];

/**
 * How deep the reader is: 0 until the element marked [data-deep-start] (the
 * homepage's platform section) reaches the middle of the screen, rising to
 * 1 at the bottom of the page. Pages without the marker start at the top.
 * Smoothstep, so the colour change has no visible edges.
 */
function depth(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  const marker = document.querySelector<HTMLElement>("[data-deep-start]");
  const start = marker
    ? Math.min(max * 0.9, marker.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5)
    : 0;
  const t = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, max - start)));
  return t * t * (3 - 2 * t);
}

export default function MeeranaInteractiveBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const deepRef = useRef(0);
  const [mode, setMode] = useState<Mode>("pending");
  const [reduced, setReduced] = useState(false);
  const [glOk, setGlOk] = useState(true);

  useEffect(() => {
    const live = window.matchMedia(LIVE_QUERY);
    const rm = window.matchMedia(REDUCED_QUERY);
    const decide = () => {
      setReduced(rm.matches);
      setMode(live.matches && !lowPower() ? "live" : "static");
    };
    decide();
    live.addEventListener("change", decide);
    rm.addEventListener("change", decide);
    return () => {
      live.removeEventListener("change", decide);
      rm.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (mode === "live") setGlOk(canWebGL());
  }, [mode]);

  /* Scroll depth → one custom property on this root (the deep layer reads
     it), and a ref the ColorBends loop reads. One rAF per scroll burst; no
     React state, no restyling outside this subtree. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const d = depth();
      deepRef.current = d;
      el.style.setProperty("--deep", d.toFixed(3));
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    /* Route changes and late layout (fonts, images) move the marker. */
    const ro = new ResizeObserver(request);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro.disconnect();
    };
  }, []);

  const readDeep = useCallback(() => deepRef.current, []);
  const live = mode === "live";

  return (
    <div ref={rootRef} className="mib" data-mode={mode} aria-hidden="true">
      <div className="mib-base" />
      <div className="mib-deep" />
      {live && glOk ? (
        <div className="mib-layer mib-bends">
          <ColorBends
            colors={BENDS_COLORS}
            colorsTo={BENDS_DEEP}
            mix={readDeep}
            speed={0.4}
            frequency={1.8}
            noise={0.18}
            bandWidth={0.22}
            rotation={115}
            fadeTop={0.7}
            iterations={1}
            intensity={1.4}
            mouseInfluence={0}
            parallax={0}
            followPointer={false}
            renderScale={0.5}
            maxFps={30}
            animate={!reduced}
            onError={() => setGlOk(false)}
          />
        </div>
      ) : null}
      {live ? (
        <div className="mib-layer mib-dots">
          <DotField
            dotRadius={2.2}
            dotSpacing={14}
            cursorRadius={420}
            cursorForce={0.26}
            bulgeOnly
            bulgeStrength={105}
            glowRadius={210}
            sparkle
            waveAmplitude={0}
            gradientFrom={SCENE.dotFrom}
            gradientTo={SCENE.dotTo}
            glowColor={SCENE.dotGlow}
            interactive={false}
            animate={!reduced}
          />
        </div>
      ) : null}
      <div className="mib-shade" />
    </div>
  );
}
