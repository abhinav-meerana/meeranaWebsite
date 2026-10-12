import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { SERVICES } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import "../pages.css";

export const metadata = pageMeta({
  title: "Services",
  description:
    "Consulting, bespoke development, technology partnerships and staff augmentation from Meerana Technologies.",
  path: "/services/",
});

/* The four service lines the owner confirmed (DL-S01). Capability lists come from
   the evidence register (EV-030, EV-031, EV-032/033). The one-line summaries are
   PROVISIONAL – owner approval required. */
export default function ServicesPage() {
  return (
    <main id="main" className="page">
      <div className="container page-wide">
        <SectionHeader id="services-title" level={1} annotation="Services">
          How we work with you
        </SectionHeader>
        <p className="t-lede page-lede">
          Beyond the six products, Meerana consults, builds, partners and supplies
          skilled people.
        </p>

        <div className="service-list">
          {SERVICES.map((s) => (
            <section key={s.id} id={s.id} className="service" aria-labelledby={`${s.id}-title`}>
              <div className="service-head">
                <h2 id={`${s.id}-title`} className="t-h2">
                  {s.name}
                </h2>
                <p className="t-lede">{s.summary}</p>
              </div>

              <div className="service-body">
                <ul className="service-caps">
                  {s.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>

                {s.related.length > 0 ? (
                  <p className="t-small service-related">
                    Related:{" "}
                    {s.related.map((r, i) => (
                      <span key={r.slug}>
                        {i > 0 ? ", " : ""}
                        <Link className="link-quiet" href={`/products/${r.slug}/`}>
                          {r.name}
                        </Link>{" "}
                        {r.why}
                      </span>
                    ))}
                  </p>
                ) : null}

                <Link className="btn btn-ghost" href={`/contact/?interest=${s.interest}`}>
                  Ask about {s.name.toLowerCase()}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
