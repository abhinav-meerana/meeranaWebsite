"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { visibleScenes, type ProductStory } from "@/content/storyboards";
import { MQ } from "@/lib/breakpoints";
import { createSettle, type Settle } from "@/lib/settle";
import Dock from "./Dock";
import Scene from "./Scene";
import type { Stage } from "./engine";
import { useRail } from "./useRail";
import { useStageMode, type StageMode } from "./useStageMode";

/* ============================================================================
   The product story (FINAL-SPEC §4). One horizontal strip of full-frame
   scenes in three acts, in every mode:

     stage  vertical wheel, trackpad or keys drive the strip behind a CSS
            sticky pin; layers move at their own rates, each scene kind has
            its own choreography, one gesture moves one scene
     rail   a native horizontal snap rail (touch, narrow, short, reduced
            motion — static there)
     list   scenes stacked, each composed as a frame (≤499 px tall, or chosen)

   The server HTML is the rail: every scene is in the DOM in its final state,
   the scroller works and the chapter links work with no JavaScript (I10).
   `data-mode="stage"` is written only after GSAP has built the stage, so a
   failed import leaves a working rail. The scene frame is identical in the
   rail and the stage, so turning the stage on shifts nothing.

   What lives here: the mode, the dock's index, settle, go (pan or cut), the
   keyboard, focus sync and the URL hash. The engine and the choreography are
   loaded on demand, in stage mode only.
   ========================================================================== */

type Gsap = typeof import("gsap").default;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Build = typeof import("./engine").buildStage;

/** What the stage exposes to the dock and the chapter links while it runs. */
type Engine = { go: (i: number, after?: () => void) => void };

/* The stage's code (GSAP, its two plugins, the engine and the choreography),
   requested once. When this module first runs in a browser that will get the
   stage, the request starts at once, so it downloads while React hydrates
   instead of after. Phones, the rail, the list and reduced motion never ask
   for it. A failed request is forgotten, so a later attempt can retry. */
let stageCode: Promise<
  [typeof import("gsap"), typeof import("gsap/ScrollTrigger"), typeof import("gsap/ScrollToPlugin"), typeof import("./engine")]
> | null = null;
function loadStageCode() {
  stageCode ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/ScrollToPlugin"),
    import("./engine"),
  ]).catch((err) => {
    stageCode = null;
    throw err;
  });
  return stageCode;
}
if (typeof window !== "undefined") {
  try {
    if (window.matchMedia(MQ.stage).matches && localStorage.getItem("meerana:view") !== "list") {
      loadStageCode().catch(() => {
        /* reported when the stage asks for it */
      });
    }
  } catch {
    /* storage blocked: the stage asks for its code after hydration */
  }
}

const DEBUG_HASH = false;
/** Arrow keys, Page keys and Space move one scene (Shift+Space goes back). */
const STEP: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  PageDown: 1,
  " ": 1,
  ArrowLeft: -1,
  ArrowUp: -1,
  PageUp: -1,
};
/** Focus here keeps its own keys: the header (its menu uses arrows), fields, dialogs, open disclosures. */
const OWN_KEYS =
  '.site-header, input, textarea, select, [contenteditable]:not([contenteditable="false"]), dialog, [aria-expanded="true"]';

export default function ProductStage({ story }: { story: ProductStory }) {
  const scenes = useMemo(() => visibleScenes(story), [story]);
  const N = scenes.length;

  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const { mode: wanted, setListView, reduced, coarse, autoList } = useStageMode();
  /* The mode the DOM shows. It lags `wanted` while GSAP loads (pending) and
     falls back to the rail if the stage cannot be built. */
  const [mode, setMode] = useState<StageMode>("pending");
  const [index, setIndexState] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const indexRef = useRef(0);
  const engine = useRef<Engine | null>(null);
  const wantedRef = useRef<StageMode>(wanted);
  /** Where the reader was when a stage was torn down, for the next mode. */
  const leave = useRef<{ inFilm: boolean; below: number } | null>(null);
  /** The last scene announced and written to the URL, so each is done once. */
  const told = useRef(0);
  /** The mode last laid out, so a change can carry the reader's scene across. */
  const shown = useRef<StageMode>("pending");

  useEffect(() => {
    setHydrated(true);
    told.current = Math.max(0, sceneFromHash(scenes)); // a deep link is not news
  }, [scenes]);
  useLayoutEffect(() => {
    wantedRef.current = wanted;
  }, [wanted]);

  /* ---- index: the dock, near scenes and lazy media ---- */
  const setIndex = useCallback((i: number) => {
    indexRef.current = i;
    const list = track.current ? Array.from(track.current.children) : [];
    list.forEach((s, k) => {
      s.classList.toggle("is-near", Math.abs(k - i) <= 1);
      /* Every scene up to i+2 loads its images now (a cut may have skipped
         some); the rest stay lazy. */
      if (k <= i + 2) {
        s.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = "eager"));
      }
    });
    setIndexState(i);
  }, []);

  /** A move came to rest on scene i: announce it and keep it in the URL, once. */
  const settled = useCallback(
    (i: number) => {
      if (i === told.current) return;
      told.current = i;
      const s = scenes[i];
      setAnnounce(`Scene ${i + 1} of ${N}: ${s.eyebrow}`);
      if (DEBUG_HASH) writeHash(i === 0 ? "" : s.id);
    },
    [scenes, N],
  );

  /* ---- rail ---- */
  const rail = useRail({
    track,
    bar,
    active: hydrated && (mode === "rail" || mode === "pending"),
    count: N,
    reduced,
    onIndex: (i) => {
      /* The stage writes data-mode before React hears of it; from then on the
         track is no longer a scroller and its observer reports nonsense. */
      if (root.current?.dataset.mode === "stage") return;
      setIndex(i);
      settled(i);
    },
  });

  /* ---- list: the dock follows the scene crossing the middle of the screen ---- */
  useEffect(() => {
    if (mode !== "list" || !track.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (root.current?.dataset.mode !== "list") return; // the stage is taking over
        for (const e of entries) {
          if (e.isIntersecting) setIndex(Number((e.target as HTMLElement).dataset.i) || 0);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    Array.from(track.current.children).forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [mode, setIndex]);

  /* ---- stage: load GSAP and the engine, build, wire, tear down ---- */
  useEffect(() => {
    if (wanted === "pending") return;
    if (wanted !== "stage") {
      setMode(wanted);
      return;
    }
    let cancelled = false;
    let teardown: (() => void) | null = null;
    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }, { ScrollToPlugin }, { buildStage }] = await loadStageCode();
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        await document.fonts.ready; // line breaks settle before anything is measured
        if (cancelled) return;
        teardown = start(gsap, ScrollTrigger, buildStage);
      } catch (err) {
        console.error("ProductStage: the stage could not be built; staying on the rail.", err);
        if (!cancelled) {
          if (root.current) root.current.dataset.mode = "rail";
          setMode("rail");
        }
      }
    })();
    return () => {
      cancelled = true;
      teardown?.();
    };
    // `start` reads only refs and stable callbacks; the stage is rebuilt when the mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted]);

  /** Builds the stage on the current DOM and returns its teardown. */
  function start(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic, buildStage: Build) {
    const el = root.current!;
    const tr = track.current!;
    const railAt = rail.readIndex();
    /* Back from the list: the scene on the reading line, read now, while the
       list layout is still on screen. */
    const listAt = shown.current === "list" ? sceneAtLine(tr) : -1;
    let cutting = false;
    let cut: gsap.core.Tween | null = null;
    let after: { i: number; fn: () => void } | null = null;
    let settle: Settle | null = null;

    const stage: Stage = buildStage(gsap, ScrollTrigger, el, {
      onRaw: (p) => {
        if (cutting || !settle || settle.moving) return;
        const i = Math.round(p * (N - 1));
        if (i !== indexRef.current) setIndex(i);
      },
    });
    el.dataset.mode = "stage"; // the tall sticky layout switches on only now
    setMode("stage");

    settle = createSettle({
      gsap,
      st: stage.st,
      count: N,
      threshold: (s) => Math.min(s * 0.12, 40), // one 100 px wheel notch always advances
      duration: 0.48,
      idleMs: 140,
      onIndex: (i, done) => {
        setIndex(i);
        if (!done) return;
        settled(i);
        if (after && after.i !== i) after = null; // the reader went elsewhere
        if (after && after.i === i) {
          const fn = after.fn;
          after = null;
          fn();
        }
      },
    });
    const s = settle;

    const inFilm = () => {
      const st = stage.st();
      return !!st && window.scrollY >= st.start - 2 && window.scrollY <= st.end + 2;
    };
    /** Lands on scene i with no glide: hash loads, refreshes, mode changes. */
    const jump = (i: number) => {
      const y = stage.restY(i);
      window.scrollTo(0, y);
      ScrollTrigger.update();
      stage.master.scrollTrigger?.getTween()?.progress(1);
      s.markSettled(y);
      setIndex(i);
    };

    ScrollTrigger.refresh();

    /* Where to start. A mode change keeps the reader's scene: back from the
       list, the scene on its reading line; back from the rail (a window
       widened past 1024), the rail's scene while the film is in view. A first
       build honours the hash, then a swipe made before hydration, then
       wherever the scroll position already is. */
    const st0 = stage.st();
    const fromHash = sceneFromHash(scenes);
    const filmInView = !!st0 && window.scrollY >= st0.start - window.innerHeight && window.scrollY <= st0.end + 2;
    if (shown.current === "list") jump(listAt >= 0 ? listAt : indexRef.current);
    else if (shown.current === "rail" && filmInView) jump(railAt);
    else if (fromHash >= 0) jump(fromHash);
    else if (st0 && railAt > 0 && window.scrollY <= st0.start + 8) jump(railAt);
    else if (inFilm() && st0) jump(Math.round(((window.scrollY - st0.start) / (st0.end - st0.start || 1)) * (N - 1)));
    else setIndex(Math.round((stage.st()?.progress ?? 0) * (N - 1)));
    told.current = indexRef.current;

    /* ---- go: a pan for 1–2 scenes, a cut for longer jumps ---- */
    const go = (target: number, fn?: () => void) => {
      const i = Math.max(0, Math.min(N - 1, target));
      if (cut) {
        /* A new destination during a cut replaces it. */
        cut.kill();
        cut = null;
        cutting = false;
        gsap.set(tr, { opacity: 1 });
      }
      const d = Math.abs(i - indexRef.current);
      if (d <= 2) {
        after = fn ? { i, fn } : null;
        s.toIndex(i, { duration: 0.48 + 0.14 * Math.max(0, d - 1) });
        return;
      }
      after = null;
      cutting = true;
      /* Two tweens rather than one timeline: the frame that ends the fade-out
         is always drawn at opacity 0, however long the frames are, because
         the fade-in only starts on the tick after the jump. */
      cut = gsap.to(tr, {
        opacity: 0,
        duration: 0.12,
        ease: "power1.in",
        onComplete: () => {
          /* The jump goes through settle (instant), so a glide still running
             from an earlier gesture is replaced rather than left to drag the
             page back, and the next gesture is measured from scene i. */
          s.toIndex(i, { instant: true });
          if (Math.abs(window.scrollY - stage.restY(i)) > 1) window.scrollTo(0, stage.restY(i));
          ScrollTrigger.update();
          stage.master.scrollTrigger?.getTween()?.progress(1);
          s.markSettled(stage.restY(i));
          setIndex(i);
          cut = gsap.to(tr, {
            opacity: 1,
            duration: 0.2,
            delay: 0.001,
            ease: "power1.out",
            onComplete: () => {
              cut = null;
              cutting = false;
              settled(i);
              fn?.();
            },
          });
        },
      });
    };
    engine.current = { go };

    /* ---- keyboard ---- */
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      let d = STEP[e.key];
      if (!d) return;
      if (e.shiftKey && e.key !== " ") return; // Shift+arrows select text
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest(OWN_KEYS)) return;
      if (e.key === " " && t?.closest("a, button, summary, [role='button']")) return; // Space activates controls
      if (e.key === " " && e.shiftKey) d = -1;
      if (!inFilm()) return;
      const next = indexRef.current + d;
      if (next < 0 || next > N - 1) return; // at either end, native scroll leaves the film
      e.preventDefault();
      go(next);
    };

    /* ---- the film follows focus ---- */
    const onFocus = (e: FocusEvent) => {
      const sc = e.target instanceof Element ? e.target.closest<HTMLElement>(".ps-scene") : null;
      if (!sc) return;
      const i = Number(sc.dataset.i);
      if (!Number.isFinite(i)) return;
      if (i !== indexRef.current || !inFilm()) window.requestAnimationFrame(() => go(i));
    };

    /* ---- in-page links to a scene (#id) ---- */
    const onHash = () => {
      const i = sceneFromHash(scenes);
      if (i >= 0) go(i);
    };

    /* ---- refresh on resize (local debounce: GSAP 3.15 has no utils.debounce) and on load ---- */
    let timer = 0;
    const refresh = () => {
      const was = inFilm();
      ScrollTrigger.refresh();
      if (was && !s.moving && !cutting) jump(indexRef.current);
    };
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(refresh, 150);
    });
    ro.observe(el);

    window.addEventListener("keydown", onKey);
    el.addEventListener("focusin", onFocus);
    window.addEventListener("hashchange", onHash);
    const loading = document.readyState !== "complete";
    if (loading) window.addEventListener("load", refresh, { once: true });

    return () => {
      const st = stage.st();
      leave.current = {
        inFilm: inFilm(),
        below: st && window.scrollY > st.end + 2 ? window.scrollY - st.end : -1,
      };
      s.destroy();
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("focusin", onFocus);
      window.removeEventListener("hashchange", onHash);
      if (loading) window.removeEventListener("load", refresh);
      ro.disconnect();
      window.clearTimeout(timer);
      cut?.kill();
      engine.current = null;
      stage.kill();
      /* ScrollTrigger remembers scroll positions and restores them on its
         next resize refresh; with the stage gone that would undo where the
         next mode places the reader. */
      ScrollTrigger.clearScrollMemory();
      gsap.set(tr, { clearProps: "opacity" });
      el.dataset.mode = wantedRef.current === "list" ? "list" : "rail";
    };
  }

  /* ---- keep the reader's scene across a mode change ---- */
  useLayoutEffect(() => {
    const prev = shown.current;
    shown.current = mode;
    if (prev === mode || mode === "stage") return; // the stage places itself in start()
    const el = root.current;
    const i = indexRef.current;
    const left = leave.current;
    leave.current = null;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (mode === "rail" || mode === "pending") {
      if (i > 0) rail.jumpTo(i);
      if (left?.inFilm || prev === "list") window.scrollTo(0, top);
      else if (left && left.below >= 0) window.scrollTo(0, top + el.offsetHeight - window.innerHeight + left.below);
    } else if (mode === "list" && prev !== "pending") {
      const sc = track.current?.children[i] as HTMLElement | undefined;
      if (sc && (left?.inFilm || prev === "rail")) sc.scrollIntoView({ block: "start" });
    }
  }, [mode, rail]);

  /* ---- dock actions ---- */
  const onGo = useCallback(
    (i: number) => {
      const k = Math.max(0, Math.min(N - 1, i));
      if (mode === "stage") engine.current?.go(k);
      else if (mode === "list") {
        const sc = track.current?.children[k] as HTMLElement | undefined;
        sc?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      } else rail.scrollToIndex(k);
    },
    [mode, N, rail, reduced],
  );

  const onChapter = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, i: number) => {
      /* The rail and the list keep native anchors. */
      if (mode !== "stage" || !engine.current) return;
      e.preventDefault();
      const s = scenes[i];
      engine.current.go(i, () => {
        writeHash(i === 0 ? "" : s.id);
        document.getElementById(`${s.id}-h`)?.focus({ preventScroll: true });
      });
    },
    [mode, scenes],
  );

  const hint = !hydrated
    ? ""
    : mode === "stage"
      ? "Scroll or press →"
      : reduced
        ? "Use ← → or the buttons"
        : coarse
          ? "Swipe for more"
          : "Use ← → or the buttons";

  return (
    <>
      <div
        className="ps"
        ref={root}
        data-mode={mode}
        data-static={reduced || undefined}
        data-hydrated={hydrated || undefined}
        data-slug={story.slug}
        style={
          {
            "--ps-n": N,
            "--p-bg": story.surface.bg,
            "--p-fg": story.surface.fg,
            "--p-accent": story.surface.accent,
            "--p-accent-2": story.surface.accent2,
          } as CSSProperties
        }
      >
        <a className="ps-skip" href="#ps-end">
          Skip the {story.name} story
        </a>
        <p className="sr-only">Use the arrow keys, Page Up, Page Down or Space to move between scenes.</p>
        <div className="ps-pin">
          <div className="ps-far" aria-hidden="true">
            <div className="ps-floor">
              <div className="ps-floor-grid" />
            </div>
            <div className="ps-horizon" />
          </div>
          <div
            className="ps-track"
            ref={track}
            {...(mode !== "stage" ? { tabIndex: 0, role: "region", "aria-label": `${story.name} story` } : {})}
          >
            {scenes.map((s, i) => (
              <Scene key={s.id} scene={s} index={i} total={N} story={story} eager={i < 3} />
            ))}
          </div>
          <Dock
            scenes={scenes}
            story={story}
            mode={mode}
            index={index}
            hint={hint}
            announce={announce}
            canToggle={!autoList}
            barRef={bar}
            onGo={onGo}
            onChapter={onChapter}
            onListView={setListView}
          />
        </div>
      </div>
      <span id="ps-end" className="ps-end" tabIndex={-1} />
    </>
  );
}

/* ------------------------------------------------------------------------ */

/** The scene crossing 45% of the viewport's height (the list's reading line,
 * as its index observer uses), or −1. */
function sceneAtLine(track: HTMLElement) {
  const y = window.innerHeight * 0.45;
  return Array.from(track.children).findIndex((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= y && r.bottom > y;
  });
}

/** The scene named by location.hash, or −1. */
function sceneFromHash(scenes: { id: string }[]) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return id ? scenes.findIndex((s) => s.id === id) : -1;
}

/** Keeps the URL on the scene at rest (no history entry), so back/forward and
 * a reload come back to it. Scene 01 is the page itself: no hash. */
function writeHash(id: string) {
  try {
    const url = `${window.location.pathname}${window.location.search}${id ? `#${id}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, "", url);
    }
  } catch {
    /* sandboxed frames can refuse; the scene is still shown */
  }
}
