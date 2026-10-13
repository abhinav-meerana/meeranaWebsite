"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DashboardFrame from "@/components/dashboards/DashboardFrame";
import { PRODUCT_CAPTIONS, STAGE_NOTE, STAGE_SCREENS, STORY_BEATS, visualOf, type BeatId, type StoryBeat } from "@/content/story";
import { getPointer, subscribePointer } from "@/lib/pointer";
import { KEYS, PRODUCT_KEYS, SCHEDULE, TILT, poseAt, poseVars, type Key, type Layout, type Pose } from "./poses";

const PRODUCT_KEYS_SET = new Set<string>(PRODUCT_KEYS);

/* ============================================================================
   The homepage story (brief §3–§4, §10): the opening product composition,
   five scroll stages and the six-platform universe, in one pinned scene.

   Architecture
     · The section is tall (app/cinematic.css: 100svh × (1 + story length));
       `.story-pin` inside it is CSS sticky. No ScrollTrigger pin, so there is
       no pin-spacer, no reflow on refresh, and resizing or scrolling back is
       just CSS. One ScrollTrigger scrubs ONE timeline across the section.
     · Every screen's pose at every keyframe comes from poses.ts. The same
       numbers are written into the markup as custom properties, so the CSS
       paints the opening composition before JavaScript, and GSAP's first
       frame equals it (both use container units of the stage).
     · One owner per element and property: the timeline owns each `.sp`
       (transform, opacity, filter) and the copy; the pointer loop owns
       `.story-tilt` (whole-scene rotation) and each `.sp-par` (depth
       parallax). They never write the same element.
     · The copy is server-rendered, word by word (React Bits BlurText's idea,
       driven by the scrubbed timeline instead of `motion`), so every heading
       is in the static HTML and readable without JavaScript.

   Modes (html[data-motion], set before first paint by app/layout.tsx)
     full     cinematic, wide (landscape) or narrow (portrait) poses
     reduced  static layout: copy in normal flow and the universe as a still
     static   the same static layout, used when the story failed to start
   Short landscape screens (under 500 px tall) always use the static layout.
   ========================================================================== */

const WIDE = "(min-width: 768px) and (min-aspect-ratio: 1/1) and (min-height: 500px)";
const NARROW = "(max-aspect-ratio: 1/1)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";

/** The copy on screen at each keyframe: a beat, or a product caption. */
const COPY_AT: Record<Key, string> = {
  opening: "beat-opening",
  reveal: "beat-reveal",
  platforms: "beat-platforms",
  p0: "cap-0",
  p1: "cap-1",
  p2: "cap-2",
  p3: "cap-3",
  p4: "cap-4",
  p5: "cap-5",
  p6: "cap-6",
  capability: "beat-capability",
  next: "beat-next",
  universe: "beat-universe",
};

/** The central scrim behind centred copy, per keyframe. */
const SHADE: Record<Key, number> = {
  opening: 0.7,
  reveal: 0.35,
  platforms: 0.85,
  p0: 0.2,
  p1: 0.2,
  p2: 0.2,
  p3: 0.2,
  p4: 0.2,
  p5: 0.2,
  p6: 0.2,
  capability: 0.9,
  next: 0.9,
  universe: 0.25,
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((w, i) => (
        <span key={i}>
          <span className="w">{w}</span>
          {i < parts.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** First-frame and still-universe custom properties for one screen. */
function screenVars(key: string, product: boolean): CSSProperties {
  return {
    ...poseVars(poseAt("wide", key, "opening")),
    ...poseVars(poseAt("narrow", key, "opening"), "-n"),
    ...(product
      ? { ...poseVars(poseAt("wide", key, "universe"), "-u"), ...poseVars(poseAt("narrow", key, "universe"), "-un") }
      : {}),
  } as CSSProperties;
}

const beatById = (id: BeatId) => STORY_BEATS.find((b) => b.id === id)!;

function Beat({ beat, children }: { beat: StoryBeat; children?: React.ReactNode }) {
  const H = beat.id === "opening" ? "h1" : "h2";
  return (
    <div className={`beat beat--${beat.id} beat--${beat.place}`} data-copy={`beat-${beat.id}`}>
      <H id={beat.id === "opening" ? "story-title" : `story-${beat.id}`} className="beat-title">
        <Words text={beat.title} />
      </H>
      <p className="beat-lede">{beat.lede}</p>
      {children}
    </div>
  );
}

export default function CinematicStory() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"pending" | "ready">("pending");
  const [layout, setLayout] = useState<Layout | "static" | undefined>(undefined);
  const [deferred, setDeferred] = useState(true);

  /* Later screens load once the reader starts moving, or 2.5 s after load,
     so the first paint fetches only the opening composition. */
  useEffect(() => {
    if (!deferred) return;
    let timer = 0;
    const release = () => setDeferred(false);
    const arm = () => {
      timer = window.setTimeout(release, 2500);
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener("scroll", release, opts);
    window.addEventListener("keydown", release, { once: true });
    window.addEventListener("pointerdown", release, opts);
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", release);
      window.removeEventListener("keydown", release);
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("load", arm);
    };
  }, [deferred]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;
    gsap.registerPlugin(ScrollTrigger);
    const html = document.documentElement;
    const mqWide = window.matchMedia(WIDE);
    const mqNarrow = window.matchMedia(NARROW);
    const mqReduced = window.matchMedia(REDUCED);

    let teardown: (() => void) | null = null;
    let built: string | null = null;

    const decide = () => {
      if (html.dataset.motion === "static") {
        /* The fallback already fired: stay static rather than jump. */
        teardown?.();
        teardown = null;
        setLayout("static");
        setPhase("ready");
        return;
      }
      const reduced = mqReduced.matches;
      html.dataset.motion = reduced ? "reduced" : "full";
      const next: Layout | null = reduced ? null : mqWide.matches ? "wide" : mqNarrow.matches ? "narrow" : null;
      const sig = next ? `${next}:${pin.clientWidth}x${pin.clientHeight}` : "static";
      if (sig === built) return;
      teardown?.();
      teardown = null;
      built = sig;
      setLayout(next ?? "static");
      if (next) {
        try {
          teardown = build(next, root, pin);
        } catch (err) {
          console.error("Story could not start; showing the static layout.", err);
          html.dataset.motion = "static";
          setLayout("static");
        }
      }
      setPhase("ready");
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(decide, 220);
    };
    decide();
    mqWide.addEventListener("change", decide);
    mqNarrow.addEventListener("change", decide);
    mqReduced.addEventListener("change", decide);
    const ro = new ResizeObserver(onResize);
    ro.observe(pin);

    return () => {
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      mqWide.removeEventListener("change", decide);
      mqNarrow.removeEventListener("change", decide);
      mqReduced.removeEventListener("change", decide);
      teardown?.();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="story"
      id="top"
      data-nav="home"
      data-story={phase}
      data-layout={layout}
      aria-labelledby="story-title"
    >
      <div className="story-pin" ref={pinRef}>
        <Beat beat={beatById("opening")} />

        {/* First in the tab order after the headline: the way past the story. */}
        <div className="story-cue">
          <span className="story-cue-line" aria-hidden="true" />
          <span className="story-cue-text">Scroll to explore</span>
          <a className="story-skip" href="#platforms">
            Skip the intro
          </a>
        </div>

        <div className="story-world">
          <div className="story-tilt">
            {STAGE_SCREENS.map((s) => {
              const product = s.role === "product";
              const caption = s.tag ? PRODUCT_CAPTIONS.find((c) => c.key === s.key) : undefined;
              const { alt, provenance } = visualOf(s);
              return (
                <div
                  key={s.key}
                  className="sp"
                  data-key={s.key}
                  data-role={s.role}
                  data-narrow={s.narrow ? undefined : "false"}
                  data-extra={product && !s.tag ? "" : undefined}
                  data-defer-wide={deferred && !s.initial ? "" : undefined}
                  data-defer-narrow={deferred && !(s.initialNarrow ?? s.initial) ? "" : undefined}
                  style={screenVars(s.key, product)}
                >
                  <div className="sp-par">
                    <figure className="sp-frame">
                      {s.dash ? (
                        <DashboardFrame spec={s.dash} focus="controlled" />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={s.screen!.src}
                          alt={alt}
                          width={s.screen!.width}
                          height={s.screen!.height}
                          loading={s.initial ? "eager" : "lazy"}
                          fetchPriority={s.initial ? "auto" : "low"}
                          decoding="async"
                          draggable={false}
                        />
                      )}
                      <figcaption className="sr-only">{provenance}</figcaption>
                    </figure>
                    {caption ? (
                      <span className="sp-tag" aria-hidden="true" style={{ "--p-accent": caption.accent } as CSSProperties}>
                        {caption.name}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="story-shade" aria-hidden="true" />

        <Beat beat={beatById("reveal")} />
        <Beat beat={beatById("platforms")} />

        <ol className="story-captions" aria-label="The six platforms">
          {PRODUCT_CAPTIONS.map((c, i) => (
            <li key={c.key} className="bp" data-copy={`cap-${i}`} style={{ "--p-accent": c.accent } as CSSProperties}>
              <p className="bp-meta">
                <span className="bp-index">{c.index} / 06</span>
                <span className="prov">{c.provenance}</span>
              </p>
              <h3 className="bp-name">{c.name}</h3>
              <p className="bp-desc">{c.descriptor}</p>
              <p className="bp-line">{c.line}</p>
              <Link className="bp-link" href={`/products/${c.slug}/`}>
                {c.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>

        <Beat beat={beatById("capability")} />
        <Beat beat={beatById("next")} />
        <Beat beat={beatById("universe")}>
          <p className="beat-cta">
            <a className="btn btn-primary" href="#platforms">
              Explore the platforms
            </a>
            <Link className="btn btn-ghost" href="/contact/">
              Talk to Meerana
            </Link>
          </p>
          <p className="beat-note prov" aria-hidden="true">
            {STAGE_NOTE}
          </p>
        </Beat>

        <p className="story-note prov">{STAGE_NOTE}</p>

        <div className="story-progress" aria-hidden="true">
          <span className="story-progress-bar" />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   The timeline. Returns its teardown.
   ------------------------------------------------------------------------- */
function build(layout: Layout, root: HTMLElement, pin: HTMLElement): () => void {
  const screens = Array.from(pin.querySelectorAll<HTMLElement>(".sp")).filter(
    (el) => layout === "wide" || el.dataset.narrow !== "false",
  );
  const pars = screens.map((el) => el.querySelector<HTMLElement>(".sp-par")!);
  /* Coded dashboards animate in (bars grow, rows rise) the first time their
     screen appears; scrubbing back before that moment resets them. */
  const dashes = screens.map((el) => el.querySelector<HTMLElement>(".dash-frame"));
  const tags = Array.from(pin.querySelectorAll<HTMLElement>(".sp-tag"));
  const copy = (id: string) => pin.querySelector<HTMLElement>(`[data-copy="${id}"]`)!;
  const shade = pin.querySelector<HTMLElement>(".story-shade");
  const cue = pin.querySelector<HTMLElement>(".story-cue");
  const note = pin.querySelector<HTMLElement>(".story-note");
  const bar = pin.querySelector<HTMLElement>(".story-progress-bar");
  const world = pin.querySelector<HTMLElement>(".story-world")!;
  const tilt = pin.querySelector<HTMLElement>(".story-tilt")!;

  /* The stage's container units: identical to the CSS first frame's cqw/cqh. */
  const cw = world.clientWidth / 100;
  const ch = world.clientHeight / 100;
  const fine = window.matchMedia(FINE).matches;
  /* Touch devices get a third of the blur: it is the costliest property here. */
  const blurK = fine ? 1 : 0.35;
  /* Portrait screens vary from phones to tablets, so the heading band takes a
     very different share of the height. Lift the assembled platforms to sit
     just under it (measured: the beat is laid out even while transparent).
     43 is the approximate top of the narrow universe, tags included, in %. */
  let lift = 0;
  if (layout === "narrow") {
    const band = copy("beat-universe").getBoundingClientRect();
    const top = world.getBoundingClientRect().top;
    const bottomPct = ((band.bottom - top) / (world.clientHeight || 1)) * 100;
    lift = clamp(bottomPct + 6 - 43, -20, 0);
  }
  const posed = (key: string, k: Key) => {
    const p = poseAt(layout, key, k);
    return lift && (k === "next" || k === "universe") && PRODUCT_KEYS_SET.has(key) ? { ...p, y: p.y + lift } : p;
  };
  const vars = (p: Pose) => ({
    x: p.x * cw,
    y: p.y * ch,
    z: p.z,
    rotationX: p.rx ?? 0,
    rotationY: p.ry ?? 0,
    scale: p.s,
    autoAlpha: p.o,
    /* A plain number, never toFixed(): GSAP 3.15 will not interpolate a
       filter whose end value has trailing zeros ("blur(3.00px)"); it
       switches it at the end of the tween instead, which turned the
       progressive blur-to-focus into a jump (measured, verify-redesign). */
    filter: `blur(${Math.round(p.b * blurK * 100) / 100}px)`,
  });

  const motion = { tilt: TILT.opening };
  let st: ScrollTrigger | undefined;
  let onFocus: ((e: FocusEvent) => void) | null = null;

  /* ---- pointer: whole-scene tilt + depth parallax, relative to the stage ---- */
  let raf = 0;
  let rect = world.getBoundingClientRect();
  let rectDirty = false;
  const applyPointer = () => {
    raf = 0;
    if (rectDirty) {
      rect = world.getBoundingClientRect();
      rectDirty = false;
    }
    const p = getPointer();
    const nx = clamp(((p.sx - rect.left) / (rect.width || 1)) * 2 - 1, -1, 1) * p.presence;
    const ny = clamp(((p.sy - rect.top) / (rect.height || 1)) * 2 - 1, -1, 1) * p.presence;
    const k = motion.tilt;
    tilt.style.transform = `rotateX(${(-ny * 5 * k).toFixed(3)}deg) rotateY(${(nx * 7 * k).toFixed(3)}deg)`;
    for (let i = 0; i < screens.length; i++) {
      const z = Number(gsap.getProperty(screens[i], "z")) || 0;
      const depth = clamp((z + 1100) / 1170, 0, 1);
      pars[i].style.transform = `translate3d(${(nx * 30 * depth * k).toFixed(2)}px, ${(ny * 20 * depth * k).toFixed(2)}px, 0)`;
    }
  };
  const requestPointer = () => {
    if (fine && !raf) raf = requestAnimationFrame(applyPointer);
  };
  const onScroll = () => {
    rectDirty = true;
    requestPointer();
  };
  const unsubscribe = fine ? subscribePointer(requestPointer) : () => {};
  if (fine) window.addEventListener("scroll", onScroll, { passive: true });

  const ctx = gsap.context(() => {
    /* ---- the first frame (equal to the CSS one) ---- */
    screens.forEach((el) => gsap.set(el, vars(poseAt(layout, el.dataset.key!, "opening"))));
    pin.querySelectorAll<HTMLElement>("[data-copy]").forEach((el) => {
      const words = Array.from(el.querySelectorAll(".w"));
      const rest = Array.from(el.querySelectorAll(".beat-lede, .beat-cta, .beat-note"));
      const first = el.dataset.copy === COPY_AT.opening;
      gsap.set(el, { opacity: first ? 1 : 0, attr: { "data-live": first ? "1" : "0" } });
      if (words.length) {
        gsap.set(words, first ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(12px)", y: 26 });
        gsap.set(rest, first ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(8px)", y: 16 });
      } else if (!first) {
        gsap.set(el, { filter: "blur(8px)", y: 18 });
      }
    });
    gsap.set(tags, { autoAlpha: 0 });
    const seen = screens.map((el) => poseAt(layout, el.dataset.key!, "opening").o > 0);
    dashes.forEach((d, i) => d && gsap.set(d, { attr: { "data-focus": seen[i] ? "1" : "0" } }));
    if (shade) gsap.set(shade, { opacity: SHADE.opening });
    if (bar) gsap.set(bar, { scaleX: 0 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

    /* BlurText, scrubbed: words leave upward into blur and arrive from below
       out of it, staggered. A caption (no words) moves as one block. */
    const exit = (id: string, at: number, T: number) => {
      const el = copy(id);
      const words = Array.from(el.querySelectorAll(".w"));
      if (words.length) {
        tl.to(words, { opacity: 0, filter: "blur(10px)", y: -22, duration: T * 0.36, stagger: (T * 0.1) / words.length, ease: "power1.in" }, at);
        tl.to(el.querySelectorAll(".beat-lede, .beat-cta, .beat-note"), { opacity: 0, filter: "blur(6px)", y: -12, duration: T * 0.3, ease: "power1.in" }, at);
        tl.set(el, { opacity: 0 }, at + T * 0.42);
      } else {
        tl.to(el, { opacity: 0, filter: "blur(8px)", y: -16, duration: T * 0.38, ease: "power1.in" }, at);
      }
      tl.set(el, { attr: { "data-live": "0" } }, at);
    };
    const enter = (id: string, at: number, T: number) => {
      const el = copy(id);
      const words = Array.from(el.querySelectorAll(".w"));
      tl.set(el, { attr: { "data-live": "1" } }, at + T * 0.3);
      if (words.length) {
        tl.set(el, { opacity: 1 }, at);
        tl.to(words, { opacity: 1, filter: "blur(0px)", y: 0, duration: T * 0.62, stagger: (T * 0.3) / words.length, ease: "power2.out" }, at);
        tl.to(el.querySelectorAll(".beat-lede, .beat-cta, .beat-note"), { opacity: 1, filter: "blur(0px)", y: 0, duration: T * 0.5, ease: "power2.out" }, at + T * 0.34);
      } else {
        tl.to(el, { opacity: 1, filter: "blur(0px)", y: 0, duration: T * 0.6, ease: "power2.out" }, at);
      }
    };

    let t = SCHEDULE.opening[1];
    let shown = COPY_AT.opening;
    KEYS.forEach((k, i) => {
      if (i === 0) return;
      const [T, hold] = SCHEDULE[k];
      screens.forEach((el, j) => {
        const p = posed(el.dataset.key!, k);
        tl.to(el, { ...vars(p), duration: T }, t);
        if (!seen[j] && p.o > 0) {
          seen[j] = true;
          const d = dashes[j];
          if (d) tl.set(d, { attr: { "data-focus": "1" } }, t + T * 0.35);
        }
      });
      tl.to(motion, { tilt: TILT[k], duration: T, onUpdate: requestPointer }, t);
      if (shade) tl.to(shade, { opacity: SHADE[k], duration: T }, t);
      const next = COPY_AT[k];
      if (next !== shown) {
        exit(shown, t, T);
        enter(next, t + T * 0.42, T * 0.58);
        shown = next;
      }
      if (k === "reveal") {
        if (cue) tl.to(cue, { autoAlpha: 0, duration: T * 0.4 }, t);
        if (note) tl.to(note, { autoAlpha: 0, duration: T * 0.4 }, t);
      }
      if (k === "universe") tl.to(tags, { autoAlpha: 1, duration: T * 0.4, stagger: 0.04 }, t + T * 0.6);
      t += T + hold;
    });
    /* The progress bar spans the whole timeline, so the last hold is scroll
       distance too: the settled universe stays a moment before the pin ends. */
    if (bar) tl.to(bar, { scaleX: 1, ease: "none", duration: t }, 0);
    else tl.set({}, {}, t);

    /* Keyboard focus that lands in copy which is not on screen (a caption's
       link, the universe's buttons) brings that moment of the story into
       view, so focus is never on something invisible. */
    const copyAt = new Map<string, number>();
    {
      let at = SCHEDULE.opening[1];
      copyAt.set(COPY_AT.opening, 0);
      KEYS.slice(1).forEach((k) => {
        const [T, hold] = SCHEDULE[k];
        at += T;
        copyAt.set(COPY_AT[k], at + hold / 2);
        at += hold;
      });
    }
    onFocus = (e: FocusEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-copy]");
      if (!el || el.dataset.live === "1" || !st) return;
      const time = copyAt.get(el.dataset.copy ?? "");
      if (time === undefined) return;
      const y = st.start + (time / tl.duration()) * (st.end - st.start);
      window.scrollTo({ top: Math.round(y), behavior: "auto" });
    };
    pin.addEventListener("focusin", onFocus);

    st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: layout === "wide" ? 0.6 : 0.4,
      animation: tl,
      onUpdate: requestPointer,
    });
    /* Arriving mid-story (a reload, a back navigation): start there. */
    tl.progress(st.progress);
  }, root);

  requestPointer();

  return () => {
    unsubscribe();
    if (onFocus) pin.removeEventListener("focusin", onFocus);
    if (fine) window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(raf);
    st?.kill();
    ctx.revert();
    tilt.style.removeProperty("transform");
    pars.forEach((p) => p.style.removeProperty("transform"));
  };
}
