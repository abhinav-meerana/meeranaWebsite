"use client";

/**
 * DotField — adapted from React Bits (https://reactbits.dev, DavidHDev/react-bits,
 * TS-CSS registry). MIT + Commons Clause: see ./LICENSE.md.
 *
 * The dot grid, the bulge/force maths, the engagement curve, the sparkle hash
 * and the SVG cursor glow are the original's. Changes, for a fixed,
 * full-viewport, `pointer-events: none` background layer:
 *
 *   · pointer: viewport coordinates from the shared store (lib/pointer.ts).
 *     The original subtracted the canvas's page offset from `pageX`, which is
 *     wrong once a fixed layer is scrolled past its first screen;
 *   · idle throttling: once the pointer is still and every dot is back at rest,
 *     the canvas redraws only when the sparkle pattern changes (every 8th
 *     frame), or not at all without sparkle;
 *   · the loop stops while the tab is hidden; `animate={false}` draws one
 *     still frame (reduced motion);
 *   · no prop spreading onto the DOM (`...rest` forwarded arbitrary props);
 *   · `interactive={false}`: no cursor bulge and no cursor glow at all — the
 *     grid only sparkles (the site uses this; the pointer drives nothing here).
 */

import { memo, useEffect, useRef } from "react";
import { getPointer, retainPointer } from "@/lib/pointer";

const TWO_PI = Math.PI * 2;

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  /** Adaptation: false draws one still frame. */
  animate?: boolean;
  /** Adaptation: false ignores the pointer entirely (no bulge, no glow). */
  interactive?: boolean;
  className?: string;
}

const DotField = memo(function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "rgba(168, 85, 247, 0.35)",
  gradientTo = "rgba(180, 151, 207, 0.25)",
  glowColor = "#120F17",
  animate = true,
  interactive = true,
  className = "",
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const propsRef = useRef({ dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeOnly, bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo, animate });
  propsRef.current = { dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeOnly, bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo, animate };
  const rebuildRef = useRef<(() => void) | null>(null);
  const kickRef = useRef<(() => void) | null>(null);
  const glowIdRef = useRef(`dot-field-glow-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glowEl = glowRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const releasePointer = interactive ? retainPointer() : () => {};

    const size = { w: 0, h: 0, left: 0, top: 0 };
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
    let engagement = 0;
    let glowOpacity = 0;
    let frameCount = 0;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    function buildDots(w: number, h: number) {
      const p = propsRef.current;
      const step = p.dotRadius + p.dotSpacing;
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      const dots: Dot[] = new Array(rows * cols);
      let idx = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
        }
      }
      dotsRef.current = dots;
    }

    function doResize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      size.w = w;
      size.h = h;
      /* The layer is fixed, so its viewport offset is stable between resizes. */
      size.left = rect.left;
      size.top = rect.top;
      buildDots(w, h);
      kick();
    }
    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 100);
    };

    /* Speed sampling, as in the original (every 20 ms). */
    const speedInterval = setInterval(() => {
      const dx = mouse.prevX - mouse.x;
      const dy = mouse.prevY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouse.speed += (dist - mouse.speed) * 0.5;
      if (mouse.speed < 0.001) mouse.speed = 0;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      if (mouse.speed > 0.01) kick();
    }, 20);

    function draw(): boolean {
      frameCount++;
      const dots = dotsRef.current;
      const p = propsRef.current;
      const ptr = getPointer();
      if (interactive && ptr.active) {
        mouse.x = ptr.x - size.left;
        mouse.y = ptr.y - size.top;
      }
      const { w, h } = size;
      const len = dots.length;
      const t = frameCount * 0.02;
      const live = p.animate;

      const targetEngagement = interactive && live && ptr.active ? Math.min(mouse.speed / 5, 1) : 0;
      engagement += (targetEngagement - engagement) * 0.06;
      if (engagement < 0.001) engagement = 0;
      const eng = engagement;
      glowOpacity += (eng - glowOpacity) * 0.08;
      if (glowEl) {
        glowEl.setAttribute("cx", String(mouse.x));
        glowEl.setAttribute("cy", String(mouse.y));
        glowEl.style.opacity = String(glowOpacity);
      }

      ctx!.clearRect(0, 0, w, h);
      const grad = ctx!.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, p.gradientFrom);
      grad.addColorStop(1, p.gradientTo);
      ctx!.fillStyle = grad;

      const cr = p.cursorRadius;
      const crSq = cr * cr;
      const rad = p.dotRadius / 2;
      const isBulge = p.bulgeOnly;
      let moving = 0; // the largest distance any dot still has to travel home

      ctx!.beginPath();
      for (let i = 0; i < len; i++) {
        const d = dots[i];
        const dx = mouse.x - d.ax;
        const dy = mouse.y - d.ay;
        const distSq = dx * dx + dy * dy;

        if (distSq < crSq && eng > 0.01) {
          const dist = Math.sqrt(distSq);
          if (isBulge) {
            const k = 1 - dist / cr;
            const push = k * k * p.bulgeStrength * eng;
            const angle = Math.atan2(dy, dx);
            d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
            d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
          } else {
            const angle = Math.atan2(dy, dx);
            const move = (500 / Math.max(dist, 1)) * (mouse.speed * p.cursorForce);
            d.vx += Math.cos(angle) * -move;
            d.vy += Math.sin(angle) * -move;
          }
        } else if (isBulge) {
          d.sx += (d.ax - d.sx) * 0.1;
          d.sy += (d.ay - d.sy) * 0.1;
        }

        if (!isBulge) {
          d.vx *= 0.9;
          d.vy *= 0.9;
          d.x = d.ax + d.vx;
          d.y = d.ay + d.vy;
          d.sx += (d.x - d.sx) * 0.1;
          d.sy += (d.y - d.sy) * 0.1;
        }
        const off = Math.abs(d.sx - d.ax) + Math.abs(d.sy - d.ay);
        if (off > moving) moving = off;

        let drawX = d.sx;
        let drawY = d.sy;
        if (live && p.waveAmplitude > 0) {
          drawY += Math.sin(d.ax * 0.03 + t) * p.waveAmplitude;
          drawX += Math.cos(d.ay * 0.03 + t * 0.7) * p.waveAmplitude * 0.5;
        }

        if (live && p.sparkle) {
          const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
          const r = hash % 100 < 3 ? rad * 1.8 : rad;
          ctx!.moveTo(drawX + r, drawY);
          ctx!.arc(drawX, drawY, r, 0, TWO_PI);
        } else {
          ctx!.moveTo(drawX + rad, drawY);
          ctx!.arc(drawX, drawY, rad, 0, TWO_PI);
        }
      }
      ctx!.fill();

      /* Busy while anything moves; otherwise idle. */
      return eng > 0 || glowOpacity > 0.002 || moving > 0.05 || (live && p.waveAmplitude > 0);
    }

    let idleSkip = 0;
    function tick() {
      raf = 0;
      if (document.hidden) return;
      const p = propsRef.current;
      const busy = draw();
      if (busy) {
        idleSkip = 0;
        raf = requestAnimationFrame(tick);
      } else if (p.animate && p.sparkle) {
        /* Idle with sparkle: the pattern changes every 8 frames, so wait 8. */
        idleSkip = 7;
        raf = requestAnimationFrame(idle);
      }
    }
    function idle() {
      raf = 0;
      if (document.hidden) return;
      if (idleSkip-- > 0) {
        frameCount++;
        raf = requestAnimationFrame(idle);
        return;
      }
      tick();
    }
    function kick() {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    }
    kickRef.current = kick;

    const onVisibility = () => {
      if (!document.hidden) kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    doResize();
    window.addEventListener("resize", resize);

    rebuildRef.current = () => {
      if (size.w > 0 && size.h > 0) buildDots(size.w, size.h);
      kick();
    };

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(speedInterval);
      clearTimeout(resizeTimer);
      releasePointer();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      kickRef.current = null;
      rebuildRef.current = null;
    };
  }, []);

  useEffect(() => {
    rebuildRef.current?.();
  }, [dotRadius, dotSpacing]);

  useEffect(() => {
    kickRef.current?.();
  }, [animate, sparkle, gradientFrom, gradientTo]);

  return (
    <div className={`dot-field-container ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {interactive ? (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <radialGradient id={glowIdRef.current}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          ref={glowRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill={`url(#${glowIdRef.current})`}
          style={{ opacity: 0, willChange: "opacity" }}
        />
      </svg>
      ) : null}
    </div>
  );
});

export default DotField;
