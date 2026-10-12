"use client";

import { useEffect, useState, type MouseEvent, type RefObject } from "react";
import type { ProductStory, ResolvedScene } from "@/content/storyboards";
import { MQ } from "@/lib/breakpoints";
import type { StageMode } from "./useStageMode";

/* ============================================================================
   The dock (FINAL-SPEC §4.5): progress, chapters, counter, previous / next
   and the List view toggle, in one solid bar at the foot of the frame.

   Chapters are real in-page links (href="#scene-id"), so they work with no
   JavaScript, in the rail and in the list. In the stage, ProductStage
   intercepts them and pans or cuts to the scene instead. Each tick is a
   24 × 44 px target (WCAG 2.5.8); its label is clipped and shown on hover
   and keyboard focus. Below 768 px the chapters fold into "All scenes".

   The counter is decoration (aria-hidden). The polite live region next to it
   speaks "Scene 5 of 14: Interface" only once a move has come to rest, never
   while scrubbing. The progress bar is written outside React (GSAP or the
   rail's scroll handler), so scrolling never renders this component.
   ========================================================================== */

const pad = (n: number) => String(n).padStart(2, "0");

type DockProps = {
  scenes: ResolvedScene[];
  story: ProductStory;
  mode: StageMode;
  index: number;
  /** Scene 01's hint: how to move, for the current input and mode. */
  hint: string;
  /** The live region's text, set on settle only. */
  announce: string;
  /** False at ≤499 px tall, where the list is the only layout. */
  canToggle: boolean;
  barRef: RefObject<HTMLSpanElement | null>;
  onGo: (i: number) => void;
  onChapter: (e: MouseEvent<HTMLAnchorElement>, i: number) => void;
  onListView: (list: boolean) => void;
};

export default function Dock({
  scenes,
  story,
  mode,
  index,
  hint,
  announce,
  canToggle,
  barRef,
  onGo,
  onChapter,
  onListView,
}: DockProps) {
  /* "All scenes" is a disclosure below 768 px only. From 768 px up the list
     is always open and its summary is not shown. */
  const [narrow, setNarrow] = useState(false);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(MQ.md);
    const apply = () => {
      setNarrow(!mq.matches);
      setOpen(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const current = scenes[Math.min(index, scenes.length - 1)];
  const last = scenes.length - 1;

  return (
    <nav className="ps-dock" aria-label={`${story.name} scenes`}>
      <div className="ps-progress" aria-hidden="true">
        <span className="ps-progress-bar" ref={barRef} />
      </div>

      <details
        className="ps-toc"
        open={open}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="ps-toc-summary">All scenes</summary>
        <ol className="ps-chapters">
          {scenes.map((s, i) => (
            <li key={s.id} className={i > 0 && scenes[i - 1].act !== s.act ? "is-act-start" : undefined}>
              <a
                href={`#${s.id}`}
                aria-current={i === index ? "location" : undefined}
                onClick={(e) => {
                  if (narrow) setOpen(false);
                  onChapter(e, i);
                }}
              >
                <span className="ps-tick" aria-hidden="true" />
                <span className="ps-chapter-label">
                  {s.n} · {s.eyebrow}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </details>

      <p className="annot ps-counter" aria-hidden="true">
        <span className="tnum">
          {current.n} / {pad(scenes.length)}
        </span>
        <span className="ps-counter-label"> · {index === 0 && hint ? hint : current.eyebrow}</span>
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>

      <div className="ps-buttons">
        <button
          type="button"
          className="ps-btn"
          aria-label="Previous scene"
          disabled={index === 0}
          onClick={() => onGo(index - 1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="ps-btn"
          aria-label="Next scene"
          disabled={index === last}
          onClick={() => onGo(index + 1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {canToggle ? (
        <button
          type="button"
          className="ps-view btn-text"
          aria-pressed={mode === "list"}
          onClick={() => onListView(mode !== "list")}
        >
          {mode === "list" ? "Horizontal view" : "List view"}
        </button>
      ) : null}
    </nav>
  );
}
