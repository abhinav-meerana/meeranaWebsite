"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SHOWCASE, type ShowcasePanel } from "@/content/showcase";
import { MQ } from "@/lib/breakpoints";
import { createSettle, type Settle } from "@/lib/settle";
import LatticeField from "@/components/ui/LatticeField";
import ScreenFrame from "@/components/ui/ScreenFrame";
import SpecList from "@/components/ui/SpecList";

/* ============================================================================
   The product gallery (FINAL-SPEC §8).

   One card per product in a horizontal track. Two modes, decided on the client:

     pinned  MQ.pinned: ≥1024×520, a fine pointer, motion allowed. `.sc-film`
             is 100svh + 2.5 × 100svh tall and holds a CSS-sticky `.sc-pin`; one
             un-pinned ScrollTrigger on the film scrubs the track sideways, and
             lib/settle glides one card per gesture. The controls live inside the
             pin, so they are always on screen with the card.

     rail    everything else, including reduced motion. A native scroll-snap
             strip with previous/next buttons and a "1 / 6" counter under it.

   Cards are sized from the viewport (--card-h, --card-w in showcase.css) and
   pick a layout with container queries (regular, compact, tight, stacked), so
   a card always fits the screen it is on.

   Depth: every card has three planes. The background (.sc-bg: accent field,
   outlined index, hairline frame) lags, the media (.sc-media-3d) turns, the
   front (.sc-shot2, .sc-proof) leads. In pinned mode they are driven from the
   scrubbed tween; in the rail CSS view timelines do it. At rest every offset is
   zero, so nothing moves while it is being read.

   Neither mode hides a product behind the animation: every card is a real <li>
   with real links. The dimmed neighbours of the pinned gallery are inert, focus
   inside the gallery brings the current card to rest, and the counter, the
   name strip and the buttons work in both modes.
   ========================================================================== */

const N = SHOWCASE.length;
/** How long a card keeps `.is-arrived` after it settles (M-home-gallery-03). */
const ARRIVE_MS = 700;

type Mode = "pending" | "pinned" | "rail";
type Gsap = typeof import("gsap").default;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;

const clampIndex = (i: number) => Math.max(0, Math.min(N - 1, i));

/** scrollLeft that centres `panel` in the rail. */
const railLeft = (ol: HTMLElement, panel: HTMLElement) =>
  panel.offsetLeft - (ol.clientWidth - panel.offsetWidth) / 2;

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const settleRef = useRef<Settle | null>(null);
  const currentRef = useRef(0);
  const arriveTimer = useRef(0);
  const [mode, setMode] = useState<Mode>("pending");
  const [current, setCurrent] = useState(0);
  const [arrived, setArrived] = useState(-1);
  /* Cards up to this index load their images eagerly (§8.3 "Images"). */
  const [eagerUpTo, setEagerUpTo] = useState(-1);

  currentRef.current = current;

  /* The arrival accent: CSS keyframes keyed off `.is-arrived` (showcase.css).
     Never under reduced motion, where everything rests at its final state. */
  const arrive = useCallback((i: number) => {
    if (window.matchMedia(MQ.reduced).matches) return;
    window.clearTimeout(arriveTimer.current);
    setArrived(i);
    arriveTimer.current = window.setTimeout(() => setArrived(-1), ARRIVE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(arriveTimer.current), []);

  /* ---- decide the mode before GSAP is involved ---- */
  useEffect(() => {
    const mq = window.matchMedia(MQ.pinned);
    const decide = () => setMode(mq.matches ? "pinned" : "rail");
    decide();
    mq.addEventListener("change", decide);

    /* The first card loads eagerly only when the gallery is already in the
       first viewport on a wide screen (a reload part-way down the page). */
    const top = root.current?.getBoundingClientRect().top ?? Infinity;
    if (top < window.innerHeight && window.innerWidth >= 1024) {
      setEagerUpTo((n) => Math.max(n, 0));
    }
    return () => mq.removeEventListener("change", decide);
  }, []);

  /* Pinned: the card after the current one is fetched before it slides in. A
     lazy image in a clipped, translated track is only requested once it is
     already in the peek, which shows as a pop-in. */
  useEffect(() => {
    if (mode !== "pinned") return;
    setEagerUpTo((n) => Math.max(n, current + 1));
  }, [mode, current]);

  /* ---- pinned: scrub the track, settle on one card per gesture ---- */
  useEffect(() => {
    if (mode !== "pinned") return;
    const filmEl = film.current;
    const ol = track.current;
    if (!filmEl || !ol) return;

    /* GSAP is loaded only here, on a wide screen with a real pointer: phones,
       tablets and reduced motion never download it for the homepage. */
    let cancelled = false;
    let teardown = () => {};

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { ScrollToPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/ScrollToPlugin"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      teardown = setupPinned(gsap, ScrollTrigger, filmEl, ol);
    })();

    return () => {
      cancelled = true;
      teardown();
    };
    // setupPinned only closes over refs and stable callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /* Builds the pinned film. Returns its teardown. */
  function setupPinned(
    gsap: Gsap,
    ScrollTrigger: ScrollTriggerStatic,
    filmEl: HTMLDivElement,
    ol: HTMLOListElement,
  ) {
    const html = document.documentElement;
    const panels = gsap.utils.toArray<HTMLElement>(".sc-panel", ol);
    const pick = (p: HTMLElement, s: string) => p.querySelector<HTMLElement>(s);
    const layers = panels.map((p) => ({
      card: pick(p, ".sc-card"),
      bg: pick(p, ".sc-bg"),
      media: pick(p, ".sc-media-3d"),
      front: Array.from(p.querySelectorAll<HTMLElement>(".sc-shot2, .sc-proof")),
    }));
    const layerEls = [
      ol,
      ...layers.flatMap((l) =>
        [l.card, l.bg, l.media, ...l.front].filter((el): el is HTMLElement => el !== null),
      ),
    ];
    /* Assigned inside the context below; the cast keeps TS from narrowing it to null. */
    let settle = null as Settle | null;

    const ctx = gsap.context(() => {
      /* One step = one card plus its gap, measured, not assumed: the distance
         from the first slot to the last. The slots are never scaled (the cards
         inside them are) and share the track's translation, so the difference
         of their boxes is the exact layout distance; offsetLeft would round it
         to whole pixels and drift the last card off centre. Re-measured on
         every ScrollTrigger refresh (resize, fonts). */
      const measurePitch = () =>
        (panels[N - 1].getBoundingClientRect().left - panels[0].getBoundingClientRect().left) / (N - 1);
      let pitch = measurePitch();

      /* The track and the three depth planes, driven from the SMOOTHED tween
         (not the raw scroll), one writer per element and property (C16). c is
         a card's distance from the centre in steps: −1 one step right, 0
         centred, +1 one step left. Every offset is zero at c = 0. Perspective
         comes from CSS on the parents (.sc-panel, .sc-media), so a card at rest
         has an identity transform (G-06). */
      const setX = gsap.quickSetter(ol, "x", "px");
      const sets = layers.map((l) => ({
        card: l.card ? gsap.quickSetter(l.card, "css") : null,
        bg: l.bg ? gsap.quickSetter(l.bg, "xPercent") : null,
        media: l.media ? gsap.quickSetter(l.media, "css") : null,
        front: l.front.map((el) => gsap.quickSetter(el, "xPercent")),
      }));
      /* AI in a Box composes its second screen in front of the first (§8.2). */
      panels.forEach((p, i) => {
        if (p.querySelector('.sc-card[data-media="matrix"]')) {
          layers[i].front.forEach((el) => {
            if (el.classList.contains("sc-shot2")) gsap.set(el, { z: 60 });
          });
        }
      });

      /* The scrubbed tween drives one number, the film's progress; paint()
         writes the track and the card planes from it. */
      const film = { p: 0 };
      let scrollStep = 0; // px of scroll per card, from the trigger's range
      const paint = () => {
        /* Scroll positions are whole pixels but rest positions are not, one
           pixel of scroll is ~3.5 px of track, and settle calls a page within
           2 px of a rest settled without moving it. So each rest is a plateau
           2.5 px of scroll wide on either side, where the film shows the card
           exactly centred (G-07) and exactly flat (G-06). Between plateaus the
           film is stretched to meet them, so there is no snap, only a slope
           about 2% steeper than linear. */
        const raw = film.p * (N - 1);
        const base = Math.floor(raw);
        const flat = scrollStep > 0 ? Math.min(0.2, 2.5 / scrollStep) : 0;
        const u = gsap.utils.clamp(0, 1, (raw - base - flat) / (1 - 2 * flat));
        const t = Math.min(N - 1, base + u);
        setX(-t * pitch);
        sets.forEach((s, i) => {
          const c = gsap.utils.clamp(-1.5, 1.5, t - i);
          const a = Math.abs(c);
          s.card?.({ scale: 1 - 0.06 * a, rotationY: -5 * c });
          s.bg?.(18 * c);
          s.media?.({ rotationY: 6 * c, xPercent: -4 * c });
          s.front.forEach((f) => f(-12 * c));
        });
      };

      const tween = gsap.to(film, {
        p: 1,
        ease: "none",
        onUpdate: paint,
        scrollTrigger: {
          trigger: filmEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          /* The header drops its blur while a film is pinned (§9). */
          onToggle: (self) => html.classList.toggle("has-pin", self.isActive),
          onRefresh: (self) => {
            pitch = measurePitch();
            scrollStep = (self.end - self.start) / (N - 1);
            paint();
          },
          /* While settle glides to a card the target is already current;
             following the scroll too would flicker the counter and the inert
             state through the cards in between. */
          onUpdate: (self) => {
            if (!settle?.moving) setCurrent(Math.round(self.progress * (N - 1)));
          },
        },
      });
      const st0 = tween.scrollTrigger;
      if (st0) scrollStep = (st0.end - st0.start) / (N - 1);
      paint();

      settle = createSettle({
        gsap,
        st: () => tween.scrollTrigger,
        count: N,
        threshold: (step) => step * 0.12,
        duration: 0.38,
        onIndex: (i, settled) => {
          setCurrent(i);
          if (settled) arrive(i);
        },
      });
      settleRef.current = settle;
    }, filmEl);

    /* Fonts and images settle after first paint, and the hero above may change
       height; recompute so the film's range matches the real page. */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(() => {
      if (settleRef.current === settle) refresh();
    });
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      settle?.destroy();
      if (settleRef.current === settle) settleRef.current = null;
      ctx.revert();
      html.classList.remove("has-pin");
      /* quickSetter writes are not recorded by the context: clear them so the
         rail starts from untransformed cards. */
      gsap.set(layerEls, { clearProps: "transform" });
    };
  }

  /* ---- rail: the counter follows the native scroll position ---- */
  useEffect(() => {
    if (mode !== "rail") return;
    const ol = track.current;
    if (!ol) return;
    const panels = Array.from(ol.querySelectorAll<HTMLElement>(".sc-panel"));

    /* Coming from the pinned film (a resize), keep the card the reader was on. */
    const from = panels[currentRef.current];
    if (from && currentRef.current > 0) ol.scrollLeft = railLeft(ol, from);

    let raf = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const centre = ol.scrollLeft + ol.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        panels.forEach((p, i) => {
          const d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - centre);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setCurrent(best);
      });
    };
    ol.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      ol.removeEventListener("scroll", onScroll);
    };
  }, [mode]);

  /* Rail: the arrival accent plays when the counter changes. */
  const railStart = useRef(true);
  useEffect(() => {
    if (mode !== "rail") return;
    if (railStart.current) {
      railStart.current = false;
      return;
    }
    arrive(current);
  }, [mode, current, arrive]);

  /* Move to card i, in whichever mode is active. */
  const go = useCallback(
    (i: number) => {
      const next = clampIndex(i);
      if (mode === "pinned") {
        const settle = settleRef.current;
        if (settle) {
          settle.toIndex(next);
          return;
        }
        /* GSAP is still loading: jump to the card's rest position directly. */
        const el = film.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const step = (el.offsetHeight - window.innerHeight) / (N - 1);
        window.scrollTo(0, top + next * step);
      } else {
        const ol = track.current;
        const panel = ol?.querySelectorAll<HTMLElement>(".sc-panel")[next];
        if (!ol || !panel) return;
        ol.scrollTo({
          left: railLeft(ol, panel),
          behavior: window.matchMedia(MQ.reduced).matches ? "auto" : "smooth",
        });
      }
      setCurrent(next);
    },
    [mode],
  );

  /* Focus sync. Focus inside a card brings that card to rest; focus on the
     controls from outside the film (Shift+Tab back up from the next section)
     brings the current card to rest, so the card and its controls are seen
     together. Only the current card can take focus: its neighbours are inert.
     In the rail every card is live, and a focused card is centred, so the
     counter and the card being read always agree. */
  const onFocus = (e: React.FocusEvent) => {
    const panel = (e.target as HTMLElement).closest<HTMLElement>(".sc-panel");
    if (mode === "rail") {
      const ol = track.current;
      const i = Number(panel?.dataset.i);
      if (ol && panel && !Number.isNaN(i) && Math.abs(ol.scrollLeft - railLeft(ol, panel)) > 2) go(i);
      return;
    }
    if (mode !== "pinned") return;
    const settle = settleRef.current;
    if (!settle) return;
    const y = window.scrollY;
    if (panel) {
      const i = Number(panel.dataset.i);
      if (Number.isNaN(i) || Math.abs(settle.restY(i) - y) < 2) return;
      window.requestAnimationFrame(() => settle.toIndex(i));
      return;
    }
    if (y < settle.restY(0) - 2 || y > settle.restY(N - 1) + 2) {
      window.requestAnimationFrame(() => settle.toIndex(currentRef.current));
    }
  };

  const active = SHOWCASE[current];
  const pinned = mode === "pinned";

  return (
    <section
      ref={root}
      className={`showcase is-${mode}`}
      id="products"
      aria-labelledby="showcase-title"
      style={{ "--p-accent": active.accent } as React.CSSProperties}
    >
      {/* The heading sits OUTSIDE the film, so it scrolls away naturally and
          the cards keep a true full-height stage. */}
      <div className="sc-head container">
        <p className="annot">Products</p>
        <h2 id="showcase-title" className="t-h2">
          Meerana Intelligence Layer
        </h2>
        <p className="t-small sc-caption">Six products. Each one deploys on its own.</p>
        {/* Worded for the reader's pointer, chosen in CSS so the server render
            is right too. Hidden while the gallery is pinned. */}
        <p className="annot sc-hint">
          <span className="sc-hint-fine">Scroll or use the arrows to browse the six products</span>
          <span className="sc-hint-coarse">Swipe to browse the six products</span>
        </p>
      </div>

      <a className="sc-skip" href="#how">
        Skip the product gallery
      </a>

      <div className="sc-film" ref={film}>
        <div className="sc-pin" onFocus={onFocus}>
          <LatticeField />

          <ol className="sc-track" ref={track} aria-label="Products">
            {SHOWCASE.map((p, i) => (
              <Panel
                key={p.slug}
                panel={p}
                index={i}
                isCurrent={i === current}
                isNear={Math.abs(i - current) <= 1}
                isArrived={i === arrived}
                /* The dimmed neighbours of a pinned gallery are inert: they are a
                   peek, not content to read or tab into (their text could not
                   meet contrast at 0.35 opacity). The buttons, the name strip and
                   the counter move between cards. */
                inert={pinned && i !== current}
                eager={i <= eagerUpTo}
              />
            ))}
          </ol>

          <div className="sc-controls container">
            <p className="annot sc-counter" aria-live="polite" aria-atomic="true">
              <span className="tnum">
                {current + 1} / {N}
              </span>{" "}
              · {active.name}
            </p>

            {/* Navigation, not new content: one button per product (≥1024). */}
            <div className="sc-names" role="group" aria-label="Choose a product">
              {SHOWCASE.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  className="sc-name-btn"
                  aria-label={`Show ${p.name}`}
                  aria-pressed={i === current}
                  onClick={() => go(i)}
                  style={{ "--p-accent": p.accent } as React.CSSProperties}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="sc-buttons">
              <button
                type="button"
                className="sc-btn"
                onClick={() => go(current - 1)}
                disabled={current === 0}
                aria-label="Previous product"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className="sc-btn"
                onClick={() => go(current + 1)}
                disabled={current === N - 1}
                aria-label="Next product"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({
  panel,
  index,
  isCurrent,
  isNear,
  isArrived,
  inert,
  eager,
}: {
  panel: ShowcasePanel;
  index: number;
  isCurrent: boolean;
  isNear: boolean;
  isArrived: boolean;
  inert: boolean;
  eager: boolean;
}) {
  const { shot, shot2 } = panel;
  const nameId = `sc-name-${panel.slug}`;
  return (
    <li
      id={`panel-${panel.slug}`}
      tabIndex={-1}
      className={`sc-panel${isCurrent ? " is-current" : ""}${isNear ? " is-near" : ""}${isArrived ? " is-arrived" : ""}`}
      data-product={panel.slug}
      data-i={index}
      inert={inert}
      style={{ "--p-accent": panel.accent } as React.CSSProperties}
    >
      <article
        className="sc-card"
        data-media={panel.layout}
        data-shot2={shot2 ? "" : undefined}
        aria-labelledby={nameId}
      >
        {/* L0, farthest: accent field, outlined index (drawn from data-n, so it
            is not read or contrast-checked as text) and a hairline frame with
            corner ticks. Not a lattice: the section's one lattice is behind. */}
        <div className="sc-bg" aria-hidden="true">
          <span className="sc-field" />
          <span className="sc-num" data-n={panel.index} />
          <span className="sc-frame" />
        </div>

        <div className="sc-copy">
          <p className="annot sc-index">
            <span className="accent-text">{panel.index}</span> · {panel.name}
          </p>

          <h3 className="sc-name" id={nameId}>
            {/* The tight variant folds the index into the name row. */}
            <span className="sc-name-i accent-text" aria-hidden="true">
              {panel.index}
            </span>
            {panel.name}
          </h3>
          <p className="sc-descriptor accent-text">{panel.descriptor}</p>

          <p className="sc-line">{panel.line}</p>

          <ul className="sc-caps">
            {panel.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          {/* Omitted, not "to be confirmed", when the register has no answer. */}
          <SpecList className="sc-spec" rows={[{ label: "Deploys", value: panel.deploy }]} />

          <div className="sc-actions">
            <Link className="btn btn-primary" href={`/contact/?interest=${panel.slug}`} prefetch={false}>
              {panel.cta}
            </Link>
            <Link className="btn-text" href={`/products/${panel.slug}/`} prefetch={false}>
              Explore {panel.name} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* L1 the real product media, each screen with its one provenance
            label; L3 in front of it, the second screen and the proof chip. The
            aspect ratios and intrinsic widths size the composition in CSS. */}
        <div
          className="sc-media"
          style={
            {
              "--ar": shot.width / shot.height,
              "--shot-max": `${shot.width}px`,
              /* An asset that prints its own provenance has no label line under it. */
              ...(shot.labelInAsset ? { "--prov": "0px" } : {}),
              ...(shot2
                ? {
                    "--ar2": shot2.width / shot2.height,
                    "--shot2-max": `${shot2.width}px`,
                    ...(shot2.labelInAsset ? { "--prov2": "0px" } : {}),
                  }
                : {}),
            } as React.CSSProperties
          }
        >
          <div className="sc-media-3d">
            <ScreenFrame screen={shot} eager={eager} className="sc-shot" />
          </div>
          {shot2 ? <ScreenFrame screen={shot2} eager={eager} className="sc-shot2" /> : null}
          {panel.proof ? <p className="sc-proof">{panel.proof.text}</p> : null}
        </div>
      </article>
    </li>
  );
}
