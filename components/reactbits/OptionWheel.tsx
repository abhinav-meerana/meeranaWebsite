"use client";

/**
 * OptionWheel — adapted from React Bits (https://reactbits.dev, DavidHDev/react-bits,
 * TS-CSS registry). MIT + Commons Clause: see ./LICENSE.md.
 *
 * Kept from the original: the single rAF loop with frame-rate-independent
 * exponential smoothing, the circular layout (radius chosen so neighbouring
 * rows are one row height apart along the arc), per-item opacity/blur/colour
 * by distance, the drag that only captures the pointer after 4 px of travel,
 * the one-step-per-notch wheel handling, and the side mirroring.
 *
 * Changed, so the wheel can be the site's tablet/phone navigation without
 * making the page hard to use:
 *
 *   · controlled: `selected` moves the wheel silently (no onCommit), so page
 *     scrolling can keep it in step with the visible section. Nothing remounts;
 *   · browse vs commit: dragging, the mouse wheel and the arrow keys only move
 *     the highlight; a tap, Enter or Space commits (`onCommit`). A drag can
 *     never navigate by accident, and a section change caused by navigating
 *     can never feed back into another navigation;
 *   · `interactive`: while false (the collapsed dock) the wheel neither
 *     cancels wheel events nor sets `touch-action: none`, so the page scrolls
 *     straight through it; a tap calls `onActivate` instead of selecting.
 *     The original set `touch-action: none` and called preventDefault() on
 *     every wheel event over its whole box;
 *   · accessibility: a labelled listbox with aria-activedescendant; Home/End;
 *     Escape calls `onEscape`;
 *   · the sound option was removed (no audio on a corporate site).
 */

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";

type Side = "left" | "right";

export interface OptionWheelProps {
  items: string[];
  /** Initial position when uncontrolled. */
  defaultSelected?: number;
  /** Controlled position: the wheel glides here silently when it changes. */
  selected?: number;
  /** A deliberate choice: tap, Enter or Space. */
  onCommit?: (index: number, item: string) => void;
  /** Fires as the highlight moves (browse), never used for navigation. */
  onChange?: (index: number, item: string) => void;
  /** False: pass scrolling through and treat a tap as `onActivate`. */
  interactive?: boolean;
  onActivate?: () => void;
  onEscape?: () => void;
  ariaLabel?: string;
  textColor?: string;
  activeColor?: string;
  side?: Side;
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  className?: string;
}

interface WheelConfig {
  count: number;
  items: string[];
  rowH: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: Side;
  loop: boolean;
  smoothing: number;
  draggable: boolean;
  interactive: boolean;
}

export default function OptionWheel({
  items,
  defaultSelected = 0,
  selected,
  onCommit,
  onChange,
  interactive = true,
  onActivate,
  onEscape,
  ariaLabel = "Options",
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  side = "left",
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  className = "",
}: OptionWheelProps) {
  const start = selected ?? defaultSelected;
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(start);
  const targetRef = useRef(start);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const cfgRef = useRef<WheelConfig>({} as WheelConfig);
  const onChangeRef = useRef(onChange);
  const onCommitRef = useRef(onCommit);
  const onActivateRef = useRef(onActivate);
  const highlightRef = useRef(start);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);
  const [highlight, setHighlight] = useState(start);
  const [isDragging, setIsDragging] = useState(false);
  const uid = useId().replace(/:/g, "");

  const remPx =
    typeof window !== "undefined" ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16;

  onChangeRef.current = onChange;
  onCommitRef.current = onCommit;
  onActivateRef.current = onActivate;
  cfgRef.current = {
    count: items.length,
    items,
    rowH: Math.max(fontSize * spacing * remPx, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    interactive,
  };

  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const cfg = cfgRef.current;
    const tau = Math.max(cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    const target = targetRef.current;
    const cur = posRef.current;
    let next = cur + (target - cur) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    posRef.current = next;

    const els = itemRefs.current;
    const n = cfg.count;
    const mirror = cfg.side === "right" ? -1 : 1;
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;
    for (let i = 0; i < n; i++) {
      const el = els[i];
      if (!el) continue;
      let d = i - next;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const dist = Math.abs(d);
      let x = 0;
      let y = d * cfg.rowH;
      let rot = 0;
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
        rot = (mirror * ang * 180) / Math.PI;
      }
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter = cfg.blur > 0 && dist > 0.01 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : "none";
      el.style.setProperty("--ow-p", Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
    }

    rafRef.current = settled ? null : requestAnimationFrame(runFrame);
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const wrap = (v: number) => {
    const n = cfgRef.current.count;
    return ((Math.round(v) % n) + n) % n;
  };

  /** Move the target; `silent` skips onChange (controlled sync). */
  const applyTarget = useCallback(
    (value: number, snap: boolean, silent = false) => {
      const cfg = cfgRef.current;
      let v = value;
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
      if (snap) v = Math.round(v);
      targetRef.current = v;
      const idx = wrap(v);
      if (idx !== highlightRef.current) {
        highlightRef.current = idx;
        setHighlight(idx);
        if (!silent) onChangeRef.current?.(idx, cfg.items[idx]);
      }
      startLoop();
    },
    [startLoop],
  );

  const commit = useCallback((idx: number) => {
    onCommitRef.current?.(idx, cfgRef.current.items[idx]);
  }, []);

  /* Controlled sync: glide silently to `selected`, unless the reader is dragging. */
  useEffect(() => {
    if (selected == null || dragRef.current) return;
    if (Math.round(targetRef.current) === selected && highlightRef.current === selected) return;
    applyTarget(selected, true, true);
  }, [selected, applyTarget]);

  /* Leaving interactive mode without a commit hands the wheel back to the
     page: snap to `selected` again. */
  useEffect(() => {
    if (interactive || selected == null || dragRef.current) return;
    applyTarget(selected, true, true);
    // `selected` changes are handled above; this reacts to the mode only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, applyTarget]);

  /* Wheel / touchpad: captured only while interactive. Registered manually so
     it can be non-passive; when not interactive it returns before
     preventDefault(), so the page scrolls normally over the wheel. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const cfg = cfgRef.current;
      if (!cfg.interactive) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const cfg = cfgRef.current;
    if (!cfg.draggable || !cfg.interactive) return;
    dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId };
    dragMovedRef.current = false;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(dy) > 4) {
        dragMovedRef.current = true;
        setIsDragging(true);
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (dragMovedRef.current) applyTarget(drag.start - dy / cfgRef.current.rowH, false);
    },
    [applyTarget],
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
    /* Leave dragMovedRef set until the click that follows a drag is ignored. */
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  }, [applyTarget]);

  /* Collapsed: a tap anywhere on the wheel (not only on a label) expands it. */
  const handleRootClick = useCallback(() => {
    if (dragMovedRef.current || cfgRef.current.interactive) return;
    onActivateRef.current?.();
  }, []);

  const handleItemClick = useCallback(
    (index: number) => {
      if (dragMovedRef.current) return;
      /* Collapsed, the click bubbles to the root, which expands the wheel. */
      if (!cfgRef.current.interactive) return;
      const cfg = cfgRef.current;
      const cur = targetRef.current;
      let d = index - wrap(cur);
      if (cfg.loop && cfg.count > 1) {
        if (d > cfg.count / 2) d -= cfg.count;
        else if (d < -cfg.count / 2) d += cfg.count;
      }
      applyTarget(cur + d, true);
      commit(index);
    },
    [applyTarget, commit],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const cfg = cfgRef.current;
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }
      if (!cfg.interactive) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          onActivateRef.current?.();
        }
        return;
      }
      let to: number | null = null;
      const cur = Math.round(targetRef.current);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") to = cur - 1;
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") to = cur + 1;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = cfg.count - 1;
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        commit(wrap(targetRef.current));
        return;
      }
      if (to == null) return;
      e.preventDefault();
      applyTarget(to, true);
    },
    [applyTarget, commit, onEscape],
  );

  /* Re-lay the items whenever the geometry changes. */
  useEffect(() => {
    applyTarget(targetRef.current, false, true);
  }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, applyTarget]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-activedescendant={`${uid}-opt-${highlight}`}
      className={`option-wheel${side === "right" ? " option-wheel--right" : ""}${isDragging ? " option-wheel--dragging" : ""}${interactive ? " option-wheel--interactive" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          "--ow-text-color": textColor,
          "--ow-active-color": activeColor,
          "--ow-font-size": `${fontSize}rem`,
          "--ow-inset": `${inset}px`,
        } as CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      onClick={handleRootClick}
    >
      {items.map((label, index) => (
        <div
          key={label}
          id={`${uid}-opt-${index}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          role="option"
          aria-selected={highlight === index}
          className={`option-wheel__item${highlight === index ? " option-wheel__item--selected" : ""}`}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
