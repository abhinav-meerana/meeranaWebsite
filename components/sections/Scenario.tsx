"use client";

import { useEffect, useRef, useState } from "react";
import { SCENARIO, SCENARIO_NOTE } from "@/content/scenario";
import ScreenFrame from "@/components/ui/ScreenFrame";

/* ============================================================================
   From problem to business outcome.

   One connected sequence, not five equal cards. At ≥1024px the steps scroll
   in a left column while a sticky media column keeps the matching screen in
   view (CSS sticky, no pin, no scroll hijack). Below 1024px each step carries
   its own screen inline.

   The step text is normal static markup. Only which screen is shown changes,
   so nothing here depends on JavaScript or animation to be readable.
   ========================================================================== */

/** The first step that brings a screen of its own. */
const FIRST_SCREEN = SCENARIO.findIndex((s) => s.screen);

/** The screen the sticky column shows at each step: a step with no screen of
   its own keeps the previous one. Step 01 has none before it, so it shows the
   first screen in a held-back `is-pre` state rather than an empty stage
   (FINAL-SPEC §9, S-01): the detection is about to happen, not happened. */
const SHOWN = SCENARIO.map((_, i) => {
  for (let j = i; j >= 0; j--) if (SCENARIO[j].screen) return j;
  return FIRST_SCREEN;
});

export default function Scenario() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const media = useRef<HTMLDivElement>(null);

  /* The sticky screens are lazy and start hidden, so the browser neither
     fetches nor decodes them until one is shown, and a reader who scrolls in
     briskly sees an empty frame for a moment. A viewport before the section
     arrives, fetch and decode all three (desktop column only: below 1024px
     the column is display:none and the inline screens load on their own). */
  useEffect(() => {
    const col = media.current;
    if (!col || getComputedStyle(col).display === "none") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        col.querySelectorAll("img").forEach((img) => {
          const decode = () => void img.decode().catch(() => {});
          if (img.complete) decode();
          else img.addEventListener("load", decode, { once: true });
          img.loading = "eager";
        });
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(col);
    return () => io.disconnect();
  }, []);

  /* The active step is the last one whose top has passed the reading line,
     just below the middle of the viewport. It is read from positions rather
     than from crossing events: a crossing observer missed steps on a fast
     fling or a jump that lands with the line between two steps, and left
     step 01's preview on screen beside step 05. The scroll listener is only
     attached while the section is near, and reads five rects once a frame. */
  useEffect(() => {
    const els = steps.current.filter((e): e is HTMLLIElement => !!e);
    const section = els[0]?.closest("section");
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.55;
      let i = 0;
      els.forEach((el, k) => {
        if (el.getBoundingClientRect().top <= line) i = k;
      });
      setActive(i);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const listen = (on: boolean) => {
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("scroll", onScroll, { passive: true });
      window[method]("resize", onScroll);
    };
    const io = new IntersectionObserver(([e]) => {
      listen(e.isIntersecting);
      if (e.isIntersecting) update();
    });
    io.observe(section);
    return () => {
      io.disconnect();
      listen(false);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const shown = SHOWN[active];
  /* Before the first screen's own step, that screen is only previewed. */
  const pre = active < FIRST_SCREEN;

  return (
    <section className="section tone-sunken scenario" id="how" aria-labelledby="story-title">
      <div className="container how-grid">
        {/* The heading leads the step column rather than spanning the page,
            so at ≥1024px the sticky screen starts level with it: the section
            opens on the heading, step 01 and its screen together, instead of
            a screen centred half below the fold beside an empty corner. */}
        <div className="how-main">
          <header className="sec-head">
            <p className="annot">How it works</p>
            <h2 id="story-title" className="t-h2">
              From problem to business outcome.
            </h2>
            <p className="annot">{SCENARIO_NOTE}</p>
          </header>

          <ol className="how-steps">
            {SCENARIO.map((s, i) => (
              <li
                key={s.step}
                data-i={i}
                ref={(el) => {
                  steps.current[i] = el;
                }}
                className={`how-step ${i === active ? "is-active" : ""} ${i < active ? "is-past" : ""}`}
              >
                <span className="how-node" aria-hidden="true" />
                <p className="annot">{s.step}</p>
                <h3 className="t-h3">{s.label}</h3>
                <p className="how-copy">{s.copy}</p>
                {s.screen ? (
                  <div className="how-inline">
                    <ScreenFrame screen={s.screen} />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        {/* Shown at ≥1024px only, where the inline screens are display:none,
            so each screen is in the accessibility tree once. Screens that
            are not shown are visibility:hidden and drop out of it too. */}
        <div className="how-media" ref={media}>
          <div className="how-sticky">
            {SCENARIO.map((s, i) =>
              s.screen ? (
                <div
                  key={s.step}
                  className={`how-shot ${i === shown ? (pre ? "is-pre" : "is-shown") : ""}`}
                >
                  <ScreenFrame screen={s.screen} />
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
