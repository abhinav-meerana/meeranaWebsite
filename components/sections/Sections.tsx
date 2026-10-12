import Link from "next/link";
import {
  AWARDS,
  COMPANY,
  FEATURE_VIDEO,
  OFFICES,
  PARTNERS,
  PRESS,
  UNCONFIRMED_PORTFOLIO,
} from "@/content/company";
import { PREVIEW } from "@/lib/flags";
import CopyEmail from "@/components/ui/CopyEmail";
import SectionHeader from "@/components/ui/SectionHeader";

/* ============================================================================
   The sections below the gallery: where we build, and the closing call to
   action. Server components: all of it is static HTML.

   Wording for recognition and partners is verbatim from JUDGE-VERDICT §4a.
   There are no logos: partner and client marks are held in media-src/held/
   until each organisation's written permission is on file (DL-R02, EV-243).
   Press rows and the Dubai Chambers feature are outbound links only, from
   content/company.ts (EV-514, EV-202, EV-022; FINAL-SPEC §5.5, §9).
   ========================================================================== */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-08-08" -> "8 Aug 2024"; a bare year stays a year. Fixed format, so
   the static HTML never depends on the build machine's locale. */
function pressDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** The feature's short title, the part before the subtitle. */
const FEATURE_SHORT = FEATURE_VIDEO.title.split(":")[0];

export function World() {
  return (
    <section className="section" id="world" aria-labelledby="world-title">
      <div className="container">
        <div className="world-head">
          {/* Mandated copy, verbatim. */}
          <SectionHeader id="world-title" annotation="Where we build">
            Built in the UAE.{" "}
            <span className="text-fg-secondary">Engineered for the world.</span>
          </SectionHeader>
          <Link className="btn-text world-more" href="/company/">
            More about Meerana <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Where we are, beside what has been written about us. */}
        <div className="world-grid">
          <div className="world-col">
            <div className="card world-offices">
              <h3 className="t-h3">Offices</h3>
              <ul className="offices">
                {OFFICES.map((o) => (
                  <li key={o.place}>
                    <span className="off-city">{o.place}</span>
                    {o.detail ? <span className="annot">{o.detail}</span> : null}
                  </li>
                ))}
              </ul>
            </div>

            <p className="world-feature">
              <svg className="world-play" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
                <circle cx="14" cy="14" r="13.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
                <path d="M11.5 9.25v9.5L19 14z" fill="currentColor" />
              </svg>
              <span>
                Featured by {FEATURE_VIDEO.outlet}:{" "}
                <a className="link-quiet" href={FEATURE_VIDEO.url} target="_blank" rel="noopener noreferrer">
                  <cite>{FEATURE_SHORT}</cite> (video)&nbsp;<span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </span>
            </p>
          </div>

          <div className="world-col world-news">
            <h3 className="t-h3">In the news</h3>
            <ul className="press">
              {PRESS.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <span className="annot press-meta">
                      {p.outlet} · <time dateTime={p.date}>{pressDate(p.date)}</time>
                    </span>
                    <span className="press-title">{p.title}</span>
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Two proof rows on one three-column rhythm: recognition, then
            partnerships. */}
        <h3 className="t-h3 partners-head">Recognition</h3>
        <ul className="awards awards-row">
          {AWARDS.map((a) => (
            <li key={a.title}>
              <b>{a.title}</b>
              <span>{a.issuer}</span>
            </li>
          ))}
        </ul>

        <h3 className="t-h3 partners-head">Partnerships</h3>
        <ul className="partners">
          {PARTNERS.map((p) => (
            <li key={p.name}>
              <b>{p.name}</b>
              <span>{p.relationship}</span>
            </li>
          ))}
        </ul>

        {/* Preview builds only: lines the register still marks
            confirm-with-meerana (EV-034), each flagged. */}
        {PREVIEW ? (
          <>
            <h3 className="t-h3 partners-head">
              Reselling portfolio <span className="flag-unconfirmed">Unconfirmed</span>
            </h3>
            <ul className="partners">
              {UNCONFIRMED_PORTFOLIO.map((p) => (
                <li key={p.name}>
                  <b>{p.name}</b>
                  <span>{p.relationship}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="section cta" id="contact" aria-labelledby="cta-title">
      <div className="container">
        <p className="annot">What comes next</p>
        {/* Mandated copy, verbatim. */}
        <h2 id="cta-title" className="t-display">
          Together, let&rsquo;s build{" "}
          <span className="text-fg-secondary">what comes next.</span>
        </h2>
        <div className="cta-actions">
          <Link className="btn btn-primary" href="/contact/">
            Talk to Meerana
          </Link>
          <CopyEmail email={COMPANY.email} />
        </div>
      </div>
    </section>
  );
}
