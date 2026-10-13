import type { CSSProperties } from "react";
import Link from "next/link";
import {
  AWARDS,
  COMPANY,
  FEATURE_VIDEO,
  OFFICES,
  PARTNERS,
  PRESS,
  SERVICES,
  UNCONFIRMED_PORTFOLIO,
} from "@/content/company";
import { DASHBOARDS } from "@/content/dashboards";
import { SCREENS, type Provenance, type Screen } from "@/content/media";
import { SHOWCASE } from "@/content/showcase";
import { PREVIEW } from "@/lib/flags";
import CopyEmail from "@/components/ui/CopyEmail";
import ProvenanceLabel from "@/components/ui/ProvenanceLabel";
import DashboardFrame, { type DashboardSpec } from "@/components/dashboards/DashboardFrame";
import TiltScreen from "./TiltScreen";

/* ============================================================================
   The landing page below the story (brief §11). Server components: all of
   it is static HTML; only the screenshot tilt is a client island.

   Every line is existing, register-checked copy (content/showcase.ts,
   content/company.ts) or a heading that makes no claim. Nothing is invented:
   no metrics beyond counts of listed things, no logos (held until written
   permission, DL-R02), no testimonials (none are verified).
   ========================================================================== */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2024-08-08" → "8 Aug 2024"; a bare year stays a year. Locale-independent. */
function pressDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : iso;
}

function Shot({ screen, className, sizes }: { screen: Screen; className: string; sizes?: string }) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={screen.src}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        loading="lazy"
        decoding="async"
        sizes={sizes}
      />
    </figure>
  );
}

/** Platforms shown by their coded dashboards instead of a screenshot
 *  (owner, 2026-10-13): [main screen, optional second screen]. */
const PLATFORM_DASHES: Record<string, [DashboardSpec, DashboardSpec?]> = {
  nazo: [DASHBOARDS.nazo],
  yisbir: [DASHBOARDS.yisbirOps, DASHBOARDS.yisbirIndex],
  wasel: [DASHBOARDS.wasel],
  "ai-in-a-box": [DASHBOARDS.aiboxChat, DASHBOARDS.aiboxAnalytics],
};

function Dash({ spec, className }: { spec: DashboardSpec; className: string }) {
  return (
    <figure className={`${className} plat-dash`}>
      <DashboardFrame spec={spec} />
    </figure>
  );
}

/* ---------------------------------------------------------------------------
   A · Platform ecosystem
   ------------------------------------------------------------------------- */
export function PlatformEcosystem() {
  return (
    <section
      className="home-section plat-section"
      id="platforms"
      data-nav="platforms"
      data-deep-start=""
      aria-labelledby="platforms-title"
    >
      <div className="container">
        <header className="home-head">
          <p className="annot">The platforms</p>
          <h2 id="platforms-title" className="home-title">
            Six platforms, each built for a different need.
          </h2>
          {/* The register-checked lede (EV-006 brand line). */}
          <p className="home-lede">
            An AI-powered ecosystem of six enterprise products — for AI, automation, IoT and security.
          </p>
        </header>

        <ol className="plat-grid">
          {SHOWCASE.map((p) => {
            const dashes = PLATFORM_DASHES[p.slug];
            const second = dashes ? dashes[1] : p.shot2;
            const main: { provenance: Provenance; labelInAsset?: boolean } = dashes ? dashes[0] : p.shot;
            const labels = [main.provenance, ...(second && second.provenance !== main.provenance ? [second.provenance] : [])];
            const assetLabelled = main.labelInAsset;
            return (
              <li key={p.slug} className="plat" style={{ "--p-accent": p.accent } as CSSProperties}>
                <TiltScreen className={`plat-media ${second ? "has-second" : ""}`}>
                  {dashes ? (
                    <>
                      <Dash spec={dashes[0]} className="plat-shot" />
                      {dashes[1] ? <Dash spec={dashes[1]} className="plat-shot2" /> : null}
                    </>
                  ) : (
                    <>
                      <Shot screen={p.shot} className="plat-shot" sizes="(min-width: 1024px) 50vw, 100vw" />
                      {p.shot2 ? <Shot screen={p.shot2} className="plat-shot2" sizes="(min-width: 1024px) 22vw, 45vw" /> : null}
                    </>
                  )}
                </TiltScreen>
                <p className={`plat-prov ${assetLabelled ? "sr-only" : ""}`}>
                  {labels.map((l) => (
                    <ProvenanceLabel key={l}>{l}</ProvenanceLabel>
                  ))}
                </p>

                <div className="plat-body">
                  <p className="plat-index">
                    <span className="plat-tick" aria-hidden="true" />
                    {p.index}
                  </p>
                  <h3 className="plat-name">{p.name}</h3>
                  <p className="plat-desc">{p.descriptor}</p>
                  <p className="plat-line">{p.line}</p>
                  <ul className="plat-caps">
                    {p.capabilities.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  {p.deploy || p.proof ? (
                    <dl className="plat-facts">
                      {p.deploy ? (
                        <div>
                          <dt>Deployment</dt>
                          <dd>{p.deploy}</dd>
                        </div>
                      ) : null}
                      {p.proof ? (
                        <div>
                          <dt>Highlight</dt>
                          <dd>{p.proof.text}</dd>
                        </div>
                      ) : null}
                    </dl>
                  ) : null}
                  <p className="plat-actions">
                    <Link className="plat-link" href={`/products/${p.slug}/`}>
                      Explore {p.name} <span aria-hidden="true">→</span>
                    </Link>
                    <Link className="plat-link plat-link--quiet" href={`/contact/?interest=${p.slug}`}>
                      {p.cta}
                    </Link>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="home-more">
          <Link className="btn btn-ghost" href="/products/">
            All six platforms, side by side
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   B · Solutions and capabilities
   The four domains are the verified lede's (AI, automation, IoT, security),
   each paired with the product the site has always used for it, and shown
   through that product's own interface rather than an icon.
   ------------------------------------------------------------------------- */
const DOMAINS: { key: string; label: string; slug: string; screen: Screen }[] = [
  { key: "ai", label: "AI", slug: "ai-in-a-box", screen: SCREENS.aiboxContractReview },
  { key: "automation", label: "Automation", slug: "tasree3", screen: SCREENS.tasree3Conformance },
  { key: "iot", label: "IoT", slug: "wasel", screen: SCREENS.waselPhoneToGate },
  { key: "security", label: "Security", slug: "yisbir", screen: SCREENS.yisbirAlerts },
];

export function Solutions() {
  return (
    <section className="home-section sol-section" id="solutions" data-nav="solutions" aria-labelledby="solutions-title">
      <div className="container">
        <header className="home-head">
          <p className="annot">Solutions</p>
          <h2 id="solutions-title" className="home-title">
            Four domains. Four ways to work together.
          </h2>
          <p className="home-lede">
            Products for AI, automation, IoT and security — and the consulting, development, partnership and
            staffing work around them.
          </p>
        </header>

        <ul className="dom-grid">
          {DOMAINS.map((d) => {
            const p = SHOWCASE.find((x) => x.slug === d.slug)!;
            return (
              <li key={d.key} className="dom" style={{ "--p-accent": p.accent } as CSSProperties}>
                <Link className="dom-link" href={`/products/${p.slug}/`}>
                  <div className="dom-media">
                    <Shot screen={d.screen} className="dom-shot" sizes="(min-width: 1024px) 25vw, 50vw" />
                  </div>
                  <span className="dom-label">{d.label}</span>
                  <span className="dom-product">
                    {p.name} <span className="dom-desc">· {p.descriptor}</span>
                  </span>
                  <span className="dom-line">{p.line}</span>
                  <span className="dom-go" aria-hidden="true">
                    →
                  </span>
                </Link>
                <p className="dom-prov">
                  <ProvenanceLabel>{d.screen.provenance}</ProvenanceLabel>
                </p>
              </li>
            );
          })}
        </ul>

        <h3 className="sol-subhead">How we work with you</h3>
        <ol className="svc-grid">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="svc">
              <p className="svc-index">0{i + 1}</p>
              <h4 className="svc-name">{s.name}</h4>
              {/* PROVISIONAL – owner approval required (content/company.ts):
                  the same summaries /services/ already carries. */}
              <p className="svc-summary">{s.summary}</p>
              <ul className="svc-caps">
                {s.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {s.related.length ? (
                <p className="svc-related">
                  {s.related.map((r) => (
                    <Link key={r.slug} href={`/products/${r.slug}/`}>
                      {r.name} <span className="svc-why">{r.why}</span>
                    </Link>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="home-more">
          <Link className="btn btn-ghost" href="/services/">
            Services in detail
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   C · Technology: where each platform runs, then one scenario end to end.
   There is no cross-product architecture claim (EV-473, DD-20): each row is
   one product's own deployment fact; AI in a Box has none confirmed, so it
   has no row (DL-P13).
   ------------------------------------------------------------------------- */
export function TechnologyIntro() {
  const rows = SHOWCASE.filter((p) => p.deploy);
  return (
    <div className="container tech-intro">
      <header className="home-head">
        <p className="annot">Technology</p>
        <h2 id="tech-title" className="home-title">
          Deployment, platform by platform.
        </h2>
        <p className="home-lede">
          Each platform has its own deployment options. Here is where each one runs — then one sample scenario,
          from problem to outcome.
        </p>
      </header>
      <dl className="deploy-list">
        {rows.map((p) => (
          <div key={p.slug} className="deploy-row" style={{ "--p-accent": p.accent } as CSSProperties}>
            <dt>
              <span className="plat-tick" aria-hidden="true" />
              <Link href={`/products/${p.slug}/`}>{p.name}</Link>
            </dt>
            <dd>{p.deploy}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   D · Trust and proof. Wording verbatim from JUDGE-VERDICT §4a (via
   content/company.ts). Press rows and the feature are outbound links only.
   ------------------------------------------------------------------------- */
export function Proof() {
  const featureShort = FEATURE_VIDEO.title.split(":")[0];
  return (
    <section className="home-section proof-section" id="proof" data-nav="about" aria-labelledby="proof-title">
      <div className="container">
        <header className="home-head">
          <p className="annot">Recognition and partnerships</p>
          <h2 id="proof-title" className="home-title">
            Recognised, partnered and in the news.
          </h2>
        </header>

        <ul className="award-row">
          {AWARDS.map((a) => (
            <li key={a.title}>
              <p className="award-title">{a.title}</p>
              <p className="award-issuer">{a.issuer}</p>
            </li>
          ))}
        </ul>

        <div className="proof-split">
          <div>
            <h3 className="proof-sub">Partnerships</h3>
            <ul className="partner-list">
              {PARTNERS.map((p) => (
                <li key={p.name}>
                  <b>{p.name}</b>
                  <span>{p.relationship}</span>
                </li>
              ))}
            </ul>
            {PREVIEW ? (
              <>
                <h3 className="proof-sub">
                  Reselling portfolio <span className="flag-unconfirmed">Unconfirmed</span>
                </h3>
                <ul className="partner-list">
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
          <div>
            <h3 className="proof-sub">In the news</h3>
            <ul className="press-list">
              {PRESS.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <span className="press-meta">
                      {p.outlet} · <time dateTime={p.date}>{pressDate(p.date)}</time>
                    </span>
                    <span className="press-title">{p.title}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="proof-feature">
              Featured by {FEATURE_VIDEO.outlet}:{" "}
              <a href={FEATURE_VIDEO.url} target="_blank" rel="noopener noreferrer">
                <cite>{featureShort}</cite> (video) <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   E · About Meerana. The heading is owner-mandated copy, verbatim. The
   figures are counts of things listed on this page, not performance claims.
   ------------------------------------------------------------------------- */
export function About() {
  const facts = [
    { value: COMPANY.founded, label: "Founded in Dubai" },
    { value: String(SHOWCASE.length), label: "Platforms" },
    { value: String(SERVICES.length), label: "Service lines" },
    { value: String(OFFICES.length), label: "Offices" },
  ];
  return (
    <section className="home-section about-section" id="about" data-nav="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <header className="home-head home-head--left">
          <p className="annot">About Meerana</p>
          <h2 id="about-title" className="home-title">
            Built in the UAE. <span className="text-fg-secondary">Engineered for the world.</span>
          </h2>
          <p className="home-lede">
            {COMPANY.legalName}: an AI-powered enterprise products ecosystem, headquartered in Business Bay, Dubai.
          </p>
          <p>
            <Link className="btn btn-ghost" href="/company/">
              More about Meerana
            </Link>
          </p>
        </header>

        <div className="about-side">
          <dl className="about-facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="about-offices" aria-label="Offices">
            {OFFICES.map((o) => (
              <li key={o.place}>
                <span className="about-city">{o.place}</span>
                {o.detail ? <span className="about-detail">{o.detail}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   F · Contact. Mandated copy, verbatim. The form lives on /contact/ (and only
   renders there when its endpoint and privacy notice exist).
   ------------------------------------------------------------------------- */
export function Contact() {
  return (
    <section className="home-section contact-section" id="contact" data-nav="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <p className="annot">What comes next</p>
        <h2 id="contact-title" className="contact-title">
          Together, let&rsquo;s build <span className="text-fg-secondary">what comes next.</span>
        </h2>
        <div className="contact-actions">
          <Link className="btn btn-primary" href="/contact/">
            Talk to Meerana
          </Link>
          <CopyEmail email={COMPANY.email} />
        </div>
        <p className="contact-address">{COMPANY.address}</p>
      </div>
    </section>
  );
}
