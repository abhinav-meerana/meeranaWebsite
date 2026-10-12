"use client";

import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";

/* ============================================================================
   The rail (FINAL-SPEC §4.9): a native horizontal scroller with mandatory
   snap, one scene per swipe. No GSAP and no scroll-linked script motion.

     index      an IntersectionObserver on the track (threshold 0.6) reports
                the scene that holds the frame, so the counter follows a swipe
                or a snap and never a half-way position
     progress   the dock's bar follows scrollLeft, one rAF per frame at most
                (through --ps-progress, read by a transform in app/stage.css)
     keys       PageUp / PageDown inside the track move one scene; the arrows
                stay native and mandatory snap makes them one scene each
     buttons    scrollToIndex(i): smooth, or instant under reduced motion

   Active in rail and pending (once hydrated) only; the list and the stage
   have their own navigation.
   ========================================================================== */

type RailOptions = {
  track: RefObject<HTMLElement | null>;
  bar: RefObject<HTMLElement | null>;
  active: boolean;
  count: number;
  reduced: boolean;
  /** The scene now holding the frame. */
  onIndex: (i: number) => void;
};

export function useRail({ track, bar, active, count, reduced, onIndex }: RailOptions) {
  const current = useRef(0);
  const report = useRef(onIndex);
  useEffect(() => {
    report.current = onIndex;
  });

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const k = Math.max(0, Math.min(count - 1, i));
      el.scrollTo({ left: k * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
    },
    [track, count, reduced],
  );

  useEffect(() => {
    const el = track.current;
    if (!active || !el) return;
    const scenes = Array.from(el.querySelectorAll<HTMLElement>(":scope > .ps-scene"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || e.intersectionRatio < 0.6) continue;
          const i = Number((e.target as HTMLElement).dataset.i);
          if (Number.isFinite(i) && i !== current.current) {
            current.current = i;
            report.current(i);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    scenes.forEach((s) => io.observe(s));

    let raf = 0;
    const paint = () => {
      raf = 0;
      const b = bar.current;
      if (!b) return;
      const max = el.scrollWidth - el.clientWidth;
      /* A custom property, not an inline transform: the static rail carries no
         inline transforms at all (P-12). */
      b.style.setProperty("--ps-progress", String(max > 0 ? Math.min(1, el.scrollLeft / max) : 0));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    paint();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "PageDown" && e.key !== "PageUp") return;
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const next = current.current + (e.key === "PageDown" ? 1 : -1);
      if (next < 0 || next > count - 1) return; // at either end the page scrolls on
      e.preventDefault();
      scrollToIndex(next);
    };
    el.addEventListener("keydown", onKey);

    return () => {
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(raf);
    };
  }, [active, track, bar, count, scrollToIndex]);

  /** Where the rail is, read from the scroller itself (used when the mode changes). */
  const readIndex = useCallback(() => {
    const el = track.current;
    if (!el || !el.clientWidth) return current.current;
    return Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, [track, count]);

  /** Places the rail on scene i without animation (mode changes, hash loads). */
  const jumpTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      current.current = i;
      el.scrollTo({ left: i * el.clientWidth, behavior: "auto" });
    },
    [track],
  );

  return useMemo(() => ({ scrollToIndex, readIndex, jumpTo }), [scrollToIndex, readIndex, jumpTo]);
}
