"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SHOWCASE } from "@/content/showcase";
import { MQ } from "@/lib/breakpoints";
import type { Rect } from "@/components/room/room-layout";
import type { RoomApi } from "@/components/room/Room";

/* The room chooser is tiny; the heavy three.js scene is its own chunk, loaded
   by RoomClient only when the split tier, the device and the column allow it. */
const RoomClient = dynamic(() => import("@/components/room/RoomClient"), {
  ssr: false,
  loading: () => null,
});

/* Mandated copy — owner binding (docs/NEXT-TASK-PROMPT-2026-10-10.md §2).
   The H1, the four rapid moments, the lede and both CTA labels are verbatim and
   must not be rewritten.

   The H1 is plain, static markup, visible at first paint. It is the LCP element
   and is never animated (MOTION-RESEARCH §A #5). Only the lede, moments and
   buttons settle in, with opacity and a 8px lift. */
const MOMENTS = [
  { key: "ai", label: "AI", product: "AI in a Box", slug: "ai-in-a-box" },
  { key: "auto", label: "Automation", product: "Tasree3", slug: "tasree3" },
  { key: "iot", label: "IoT", product: "Wasel", slug: "wasel" },
  { key: "sec", label: "Security", product: "Yisbir", slug: "yisbir" },
];

/** M-home-hero-03 runs in the split tier with motion allowed, nowhere else. */
const EXIT_QUERY = `${MQ.heroSplit} and (prefers-reduced-motion: no-preference)`;

/**
 * The room column (FINAL-SPEC §7.3), in hero px: from the copy's right edge
 * plus --hero-gap-x to the right gutter, and from under the header to 24px off
 * the bottom. The CSS resolves the fluid values: `column-gap` carries
 * --hero-gap-x and the padding carries --header-h, so nothing is duplicated.
 */
function measureColumn(hero: HTMLElement, copy: HTMLElement): Rect {
  const cs = getComputedStyle(hero);
  const heroLeft = hero.getBoundingClientRect().left;
  const gap = parseFloat(cs.columnGap) || 32;
  const inset = Math.min(48, Math.max(16, window.innerWidth * 0.02));
  return {
    l: Math.round(copy.getBoundingClientRect().right - heroLeft + gap),
    t: Math.round(parseFloat(cs.paddingTop)),
    r: Math.round(hero.clientWidth - inset),
    b: Math.round(hero.clientHeight - parseFloat(cs.paddingBottom)),
  };
}

const sameRect = (a: Rect | null, b: Rect | null) =>
  a === b || (!!a && !!b && a.l === b.l && a.t === b.t && a.r === b.r && a.b === b.b);

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const roomApi = useRef<RoomApi | null>(null);
  const [frame, setFrame] = useState<Rect | null>(null);
  const [roomReady, setRoomReady] = useState(false);
  const onRoomReady = useCallback(() => setRoomReady(true), []);

  /* Measure the column whenever the hero or the copy changes size, write
     --room-l for the scrim, and hand the column to the room. Outside the split
     tier there is no column: the depth band sits under the copy instead. */
  useEffect(() => {
    const hero = heroRef.current;
    const copy = copyRef.current;
    if (!hero || !copy) return;
    const split = window.matchMedia(MQ.heroSplit);
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!split.matches) {
          hero.style.removeProperty("--room-l");
          setFrame(null);
          return;
        }
        const next = measureColumn(hero, copy);
        hero.style.setProperty("--room-l", `${next.l}px`);
        setFrame((prev) => (sameRect(prev, next) ? prev : next));
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(hero);
    ro.observe(copy);
    split.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      split.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* M-home-hero-03, the scroll exit: while the gallery slides over the sticky
     hero (M-home-hero-04, CSS), the camera flies into the room. GSAP is loaded
     only once the live room is up, so tiers P and M never download it here.
     The copy is never transformed. */
  useEffect(() => {
    const el = stageRef.current;
    if (!roomReady || !el) return;
    const query = window.matchMedia(EXIT_QUERY);
    let disposed = false;
    let revert: (() => void) | null = null;

    const boot = async () => {
      if (revert || !query.matches) return;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || revert) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(EXIT_QUERY, () => {
        const exit = { p: 0 };
        gsap.to(exit, {
          p: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
          onUpdate: () => roomApi.current?.setProgress(exit.p),
        });
        return () => roomApi.current?.setProgress(0);
      });
      revert = () => mm.revert();
    };

    boot();
    query.addEventListener("change", boot);
    return () => {
      disposed = true;
      query.removeEventListener("change", boot);
      revert?.();
    };
  }, [roomReady]);

  return (
    <div className="hero-stage" ref={stageRef}>
      <section className="hero" id="top" aria-labelledby="hero-title" ref={heroRef}>
        {/* ---- the room: full-bleed behind the copy, framed into the column ---- */}
        <div className="hero-room">
          <RoomClient frame={frame} onReady={onRoomReady} apiRef={roomApi} />
        </div>

        <div className="hero-copy">
          <div className="hero-copy-inner" ref={copyRef}>
            <p className="annot hero-eyebrow">Meerana Technologies · Dubai, UAE</p>

            {/* 7.6em measure: always "We engineer / intelligence for / the
                real world." (§7.2). */}
            <h1 id="hero-title" className="hero-title">
              We engineer intelligence for the real world.
            </h1>

            <p className="t-lede hero-lede hero-enter" style={{ "--i": 0 } as React.CSSProperties}>
              An AI-powered ecosystem of six enterprise products — for AI,
              automation, IoT and security.
            </p>

            <ul
              className="moments hero-enter"
              aria-label="Product moments"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {MOMENTS.map((m) => {
                const target = SHOWCASE.find((p) => p.slug === m.slug);
                return (
                  <li key={m.key}>
                    <Link className="moment" href={`/products/${m.slug}/`}>
                      {/* The space keeps the link's name "AI AI in a Box", not
                          "AIAI in a Box"; between two blocks it renders nothing. */}
                      <span className="m-label">{m.label}</span>{" "}
                      <span
                        className="m-product"
                        style={target ? { color: target.accent } : undefined}
                      >
                        {m.product}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* The fifth affordance (§7.2), shown only from 640px tall so the
                CTA still clears the fold at 1024×520.
                PROVISIONAL: composed link label, pending owner approval. */}
            <p className="hero-all hero-enter" style={{ "--i": 1 } as React.CSSProperties}>
              <Link className="btn-text" href="/products/" prefetch={false}>
                All six products <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </p>

            <div className="hero-cta hero-enter" style={{ "--i": 2 } as React.CSSProperties}>
              <a className="btn btn-primary" href="#products">
                Explore the ecosystem
              </a>
              <a className="btn btn-ghost" href="#how">
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
