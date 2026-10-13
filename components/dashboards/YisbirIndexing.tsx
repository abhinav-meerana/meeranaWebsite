import type { CSSProperties } from "react";
import { YISBIR_INDEX } from "@/content/demo-data";
import Icon, { type IconName } from "./Icon";

/* Yisbir · Video indexing — an interface reconstruction of the indexing UI in
   the owner's demo recording: search across video, audio and documents, a
   grounded answer with its sources, results by type and a mini player. The
   recording's sample media (a ministry's documents, people on camera) are
   replaced by neutral site-safety media; video frames show no people.
   Design canvas 1440 × 900. */

const KIND_ICON: Record<string, IconName> = { doc: "doc", video: "play", audio: "wave" };
const RAIL: IconName[] = ["search", "home", "chart", "grid", "book", "cloud", "archive", "settings"];

export default function YisbirIndexing() {
  const d = YISBIR_INDEX;
  return (
    <div className="dz dz--index">
      <header className="dv-top">
        <span className="dv-logo">
          YISBIR <small>Video indexing</small>
        </span>
        <span className="dv-top-right">
          <Icon name="chart" size={18} />
          <Icon name="bell" size={18} />
          <span className="dv-lang">EN</span>
          <span className="dv-user">
            <span>
              <b>Media library</b>
              <small>Admin</small>
            </span>
            <i>ML</i>
          </span>
        </span>
      </header>

      <div className="dv-body">
        <nav className="dv-rail">
          {RAIL.map((n, i) => (
            <span key={n} className={i === 0 ? "is-on" : ""}>
              <Icon name={n} size={18} />
            </span>
          ))}
        </nav>

        <aside className="dv-filters">
          <p className="dv-filters-head">
            <b>Filters</b> <span>Reset</span>
          </p>
          <p className="dv-flabel">Type</p>
          <p className="dv-pills">
            <span className="is-on">All</span>
            <span>Video</span>
            <span>Audio</span>
            <span>Document</span>
          </p>
          <p className="dv-flabel">
            Min confidence <b>60%</b>
          </p>
          <span className="dv-slider">
            <i />
          </span>
          <p className="dv-flabel">Language</p>
          <span className="dv-select">Any of 50+ languages</span>
          <p className="dv-flabel">Project</p>
          <span className="dv-select">All projects</span>
        </aside>

        <section className="dv-results">
          <p className="dv-query">
            Showing results for: <b>“{d.query}”</b> <span className="dv-count">{d.results} results</span>
            <span className="dv-sort">
              Sort: <b>Relevance</b> Date Duration
            </span>
          </p>

          <div className="dv-answer">
            <p className="dv-answer-head">
              <Icon name="spark" size={16} /> Answer <span className="dv-grounded">✓ Grounded</span>
            </p>
            <p className="dv-answer-text">{d.answer}</p>
            <p className="dv-flabel">Sources</p>
            {d.sources.map((s) => (
              <p key={s.title} className="dv-source">
                <span className="dv-source-ico">
                  <Icon name={KIND_ICON[s.kind]} size={15} />
                </span>
                <span>
                  <b>{s.title}</b>
                  <small>{s.meta}</small>
                </span>
                <span className="dv-match">{s.match}% match ↗</span>
              </p>
            ))}
          </div>

          {d.items.map((it, i) => (
            <div key={it.title} className="dv-item dz-rise" style={{ "--i": i } as CSSProperties}>
              <span className={`dv-thumb is-${it.kind}`}>
                <Icon name={KIND_ICON[it.kind]} size={it.kind === "doc" ? 26 : 22} />
                <em>{it.kind === "doc" ? "Page 4" : it.extra}</em>
              </span>
              <span className="dv-item-text">
                <b>{it.title}</b>
                <small>{it.meta}</small>
                <span className="dv-hit">
                  {it.snippet[0]}
                  <mark>{it.snippet[1]}</mark>
                  {it.snippet[2]}
                </span>
                <span className="dv-meta">
                  <i>{it.extra}</i>
                  <i>{it.conf}% conf.</i>
                </span>
              </span>
              <span className="dv-actions">
                <span className="dv-btn">{it.actions[0]}</span>
                <span className="dv-btn is-primary">
                  <Icon name="download" size={14} /> {it.actions[1]}
                </span>
              </span>
            </div>
          ))}
        </section>
      </div>

      <div className="dv-player">
        <span className="dv-player-frame">
          <Icon name="play" size={16} />
        </span>
        <span>
          <b>Weekly safety briefing — Week 11</b>
          <small>32:14 / 46:02</small>
          <span className="dv-progress">
            <i />
          </span>
        </span>
      </div>
    </div>
  );
}
