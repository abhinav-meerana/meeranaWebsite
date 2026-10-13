"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A subtle perspective tilt for a screenshot composition — the idea of React
 * Bits' TiltedCard, re-implemented without `motion` (see
 * components/reactbits/LICENSE.md). The pointer position inside the box
 * writes two custom properties once per frame; CSS turns them into a
 * rotation (no highlight: the cursor changes no light on this site). Fine
 * pointers only, never under reduced motion, and it eases back to flat when
 * the pointer leaves.
 */
export default function TiltScreen({
  children,
  className = "",
  amplitude = 7,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  amplitude?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const allowed = () =>
    window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !allowed()) return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const nx = ((clientX - r.left) / r.width) * 2 - 1;
      const ny = ((clientY - r.top) / r.height) * 2 - 1;
      el.style.setProperty("--tilt-x", (-ny * amplitude).toFixed(2));
      el.style.setProperty("--tilt-y", (nx * amplitude).toFixed(2));
      el.dataset.tilting = "";
    });
  };
  const onLeave = () => {
    const el = ref.current;
    cancelAnimationFrame(raf.current);
    if (!el) return;
    el.style.setProperty("--tilt-x", "0");
    el.style.setProperty("--tilt-y", "0");
    delete el.dataset.tilting;
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`.trim()}
      style={{ "--tilt-x": 0, "--tilt-y": 0 } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="tilt-inner">{children}</div>
    </div>
  );
}
