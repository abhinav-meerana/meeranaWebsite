import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import CopyEmail from "@/components/ui/CopyEmail";
import {
  AWARDS,
  COMPANY,
  EVENTS,
  FEATURE_VIDEO,
  OFFICES,
  PARTNERS,
  PRESS,
  UNCONFIRMED_PORTFOLIO,
} from "@/content/company";
import { PREVIEW } from "@/lib/flags";
import { pageMeta } from "@/lib/seo";
import FeatureVideo from "./FeatureVideo";
import "../pages.css";

/** The YouTube id of the feature video (EV-022); null keeps the plain link. */
const videoId = (() => {
  try {
    const u = new URL(FEATURE_VIDEO.url);
    return u.hostname === "youtu.be" ? u.pathname.slice(1) || null : u.searchParams.get("v");
  } catch {
    return null;
  }
})();

export const metadata = pageMeta({
  title: "Company",
  description:
    "Meerana Technologies: founded in Dubai in 2022, building AI-powered enterprise products. Offices, recognition, partners and press.",
  path: "/company/",
});

/* Everything here cites the evidence register (see content/company.ts). Not
   shown, on purpose: a mission statement (EV-011 unverified), leadership
   (needs consent, EV-013), social profiles (EV-021 unverified), and any client
   or case study (none exist, no permissions on file). */
export default function CompanyPage() {
  return (
    <main id="main" className="page">
      <div className="container page-wide">
        <SectionHeader id="company-title" level={1} annotation="Company">
          Meerana Technologies
        </SectionHeader>
        {/* PROVISIONAL – owner approval required: composed from verified facts
            (EV-020 founding year, EV-006 brand line, the six-product scope). */}
        <p className="t-lede page-lede">
          An AI-powered ecosystem of six enterprise products, and the consulting and
          engineering to put them to work. Founded in Dubai in {COMPANY.founded}.
        </p>

        <section className="company-block" aria-labelledby="co-offices">
          <h2 id="co-offices" className="t-h2">
            Offices
          </h2>
          <ul className="company-offices">
            {OFFICES.map((o) => (
              <li key={o.place}>
                <b>{o.place}</b>
                {o.detail ? <span className="annot">{o.detail}</span> : null}
              </li>
            ))}
          </ul>
          <p className="t-small">
            {COMPANY.legalName} · {COMPANY.address}
          </p>
        </section>

        <section className="company-block" aria-labelledby="co-recognition">
          <h2 id="co-recognition" className="t-h2">
            Recognition
          </h2>
          <ul className="awards">
            {AWARDS.map((a) => (
              <li key={a.title}>
                <b>{a.title}</b>
                <span>{a.issuer}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="company-block" aria-labelledby="co-partners">
          <h2 id="co-partners" className="t-h2">
            Partnerships
          </h2>
          <ul className="partners">
            {PARTNERS.map((p) => (
              <li key={p.name}>
                <b>{p.name}</b>
                <span>{p.relationship}</span>
              </li>
            ))}
          </ul>

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
        </section>

        <section className="company-block" aria-labelledby="co-events">
          <h2 id="co-events" className="t-h2">
            Events
          </h2>
          <ul className="events">
            {EVENTS.map((e) => (
              <li key={e.title + e.year}>
                <span className="annot tnum">{e.year}</span>
                <b>{e.title}</b>
                <span>{e.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="company-block" aria-labelledby="co-news">
          <h2 id="co-news" className="t-h2">
            In the news
          </h2>
          <ul className="press">
            {PRESS.map((p) => (
              <li key={p.url}>
                <span className="annot tnum">
                  {p.outlet} · {p.date}
                </span>
                <a
                  className="link-quiet"
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          {videoId ? (
            <>
              <h3 className="t-h3 fv-head">Featured</h3>
              <FeatureVideo
                id={videoId}
                title={FEATURE_VIDEO.title}
                outlet={FEATURE_VIDEO.outlet}
                url={FEATURE_VIDEO.url}
              />
            </>
          ) : (
            <p className="t-small">
              Also: {FEATURE_VIDEO.title}, by {FEATURE_VIDEO.outlet} (video):{" "}
              <a
                className="link-quiet"
                href={FEATURE_VIDEO.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                watch on YouTube
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          )}
        </section>

        <section className="company-cta" aria-labelledby="co-cta">
          <h2 id="co-cta" className="t-h2">
            Talk to Meerana
          </h2>
          <div className="cta-actions">
            <Link className="btn btn-primary" href="/contact/">
              Contact us
            </Link>
            <Link className="btn btn-ghost" href="/services/">
              Our services
            </Link>
            <CopyEmail email={COMPANY.email} />
          </div>
        </section>
      </div>
    </main>
  );
}
