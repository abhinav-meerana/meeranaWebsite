import { memo, type CSSProperties } from "react";
import Link from "next/link";
import type { Act, ProductStory, ResolvedScene } from "@/content/storyboards";
import SceneVisual from "./SceneVisual";

/* ============================================================================
   One scene of the product story (FINAL-SPEC §4.3, §4.5).

   The planes, back to front, each its own element so each can move at its
   own rate (components/stage/engine.ts):
     .ps-bg      accent field + outlined big type, on the media side   0.70×
     .ps-mid     .ps-shadow (0.82×) and the installed module: a plinth,
                 four registration corners and .ps-stage3d, which holds
                 the visual and takes the 3D entrance                 0.88×
     .ps-fg      the copy: eyebrow, heading, body, lists, CTAs        1.00×
     .ps-near    the vertical scene label in the right gutter         1.15×
     .ps-shutter the act wipe, on the first scene of acts II and III
   The global lattice floor (0.25×) lives once in ProductStage, behind the
   track.

   Copy and media sit in separate grid columns, so text never sits on a
   picture (I4). Scenes are unnamed <section>s: the h1/h2 carry the
   structure, and fourteen named regions would flood the landmark list. No
   element here has a hidden pre-state; GSAP applies `from` states in stage
   mode only, so the rail, the list and reduced motion show the final frame.

   Memoised: the parent re-renders for the dock's index, never the scenes.
   ========================================================================== */

export const ACT_LABEL: Record<Act, string> = {
  1: "I · The problem",
  2: "II · The product",
  3: "III · The fit",
};

const pad = (n: number) => String(n).padStart(2, "0");

/* Registration corners: 10 px L-marks where the module is installed. */
const CORNERS = ["tl", "tr", "bl", "br"] as const;

type SceneProps = {
  scene: ResolvedScene;
  index: number;
  total: number;
  story: ProductStory;
  /** Images in the first three scenes load eagerly (FINAL-SPEC §4.10). */
  eager: boolean;
};

function Scene({ scene: s, index, total, story, eager }: SceneProps) {
  const isTitle = s.kind === "title";
  const ar = s.bigType?.lang === "ar";
  const big = s.bigType?.text ?? s.n;

  return (
    <section
      className="ps-scene"
      id={s.id}
      data-kind={s.kind}
      data-layout={s.layout}
      data-enter={s.enter}
      data-act={s.act}
      data-i={index}
    >
      {index > 0 ? <span className="ps-seam" aria-hidden="true" /> : null}

      <div className="ps-bg" aria-hidden="true">
        <div className="ps-field" />
        <span
          className="ps-bigtype"
          lang={s.bigType?.lang}
          dir={ar ? "rtl" : undefined}
          style={{ "--ps-big-len": big.length } as CSSProperties}
        >
          {big}
        </span>
      </div>

      {s.enter === "wipe" ? (
        <div className="ps-shutter" aria-hidden="true">
          <span className="ps-shutter-act">{ACT_LABEL[s.act]}</span>
        </div>
      ) : null}

      <div className="ps-frame">
        <div className="ps-fg">
          <div className="ps-copy">
            <p className="annot ps-eyebrow">
              <span className="tnum">{s.n}</span> · {s.eyebrow}
            </p>
            {isTitle ? (
              <h1 className="ps-h ps-h1" id={`${s.id}-h`} tabIndex={-1}>
                {s.heading}
              </h1>
            ) : (
              <h2 className="ps-h" id={`${s.id}-h`} tabIndex={-1}>
                {s.heading}
              </h2>
            )}
            {s.body ? <p className="ps-body">{s.body}</p> : null}
            <SceneLists scene={s} story={story} />
          </div>
        </div>

        {s.viz.kind !== "none" ? (
          <div className="ps-mid">
            <span className="ps-shadow" aria-hidden="true" />
            <div className="ps-module">
              <Plinth />
              {CORNERS.map((c) => (
                <span key={c} className="ps-reg" data-c={c} aria-hidden="true" />
              ))}
              <div className="ps-stage3d">
                <SceneVisual scene={s} story={story} eager={eager} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="ps-near" aria-hidden="true">
        <span className="ps-near-label">
          {story.name} · {s.n} / {pad(total)}
        </span>
      </div>
    </section>
  );
}

export default memo(Scene);

/* ---- the copy column's lists -------------------------------------------- */

/**
 * Lists that belong to the copy column. Anything the scene's visual already
 * draws as a list (steps as stations, features as a grid, cases as tiles) is
 * not repeated here.
 */
function SceneLists({ scene: s, story }: { scene: ResolvedScene; story: ProductStory }) {
  const v = s.viz.kind;
  return (
    <>
      {s.kind === "title" && story.nameMoment ? (
        <p className="annot ps-name">
          <span className="ps-ar" lang="ar" dir="rtl">
            {story.nameMoment.ar}
          </span>{" "}
          — {story.nameMoment.en}
        </p>
      ) : null}

      {/* Defensive: steps are drawn as stations by the visual. A scene that
          carries steps without that visual still lists them. */}
      {s.steps?.length && v !== "steps" ? (
        <ol className="ps-features ps-steps">
          {s.steps.map((st) => (
            <li key={st.label}>
              <strong>{st.label}</strong> {st.copy}
            </li>
          ))}
        </ol>
      ) : null}

      {s.features?.length && v !== "grid" && v !== "tiles" ? (
        <ul className="ps-features">
          {s.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}

      {s.cases?.length && v !== "cases" ? (
        <ul className="ps-cases">
          {s.cases.map((c) => (
            <li key={c.label} className="ps-case">
              <span className="ps-case-l">{c.label}</span>
              <span className="ps-case-copy">{c.copy}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {s.facts?.length ? (
        <dl className="ps-facts">
          {s.facts.map((f) => (
            <div key={f.label} className="ps-fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {s.faq?.length ? (
        <dl className="ps-faq">
          {s.faq.map((f) => (
            <div key={f.q} className="ps-qa">
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {s.links?.length ? (
        <ul className="ps-links">
          {s.links.map((l) => (
            <li key={l.href}>
              {l.external ? (
                <a className="btn-text" href={l.href} rel="noopener noreferrer" target="_blank">
                  {l.label} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link className="btn-text" href={l.href} prefetch={false}>
                  {l.label} <span aria-hidden="true">→</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {s.sectors ? <p className="annot ps-sectors">{s.sectors.text}</p> : null}

      {s.kind === "title" ? (
        <div className="ps-ctas">
          <Link className="btn btn-primary" href={`/contact/?interest=${story.interest}`} prefetch={false}>
            {story.cta}
          </Link>
          {story.external ? (
            <a className="btn btn-ghost" href={story.external} rel="noopener noreferrer" target="_blank">
              Visit {story.external.replace(/^https?:\/\//, "")} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      ) : null}

      {s.kind === "next" ? (
        <div className="ps-ctas">
          <Link className="btn btn-primary" href={`/contact/?interest=${story.interest}`} prefetch={false}>
            {story.cta}
          </Link>
          {/* PROVISIONAL: composed UI label (D4); the count is the six stories in STORY_ORDER. */}
          <Link className="btn btn-ghost" href="/products/" prefetch={false}>
            All six products
          </Link>
        </div>
      ) : null}
    </>
  );
}

/* ---- the plinth: an isometric slab outline under the module ------------- */

function Plinth() {
  return (
    <svg className="ps-plinth" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="ps-plinth-top" d="M0 12 L50 0 L100 12 L50 24 Z" vectorEffect="non-scaling-stroke" />
      <path d="M0 12 V24 L50 36 L100 24 V12 M50 24 V36" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
