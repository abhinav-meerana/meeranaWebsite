import Link from "next/link";
import ScreenFrame from "@/components/ui/ScreenFrame";
import SectionHeader from "@/components/ui/SectionHeader";
import SpecList from "@/components/ui/SpecList";
import { SHOWCASE } from "@/content/showcase";
import { SITE, pageMeta } from "@/lib/seo";
import "../pages.css";

export const metadata = pageMeta({
  title: "Products",
  // PROVISIONAL – owner approval required: composed from the six product names.
  description:
    "Six enterprise products from Meerana Technologies: Mandoobee, Tasree3, Nazo, Yisbir, Wasel and AI in a Box.",
  path: "/products/",
});

/* The product list as structured data: names and addresses only. */
const ITEM_LIST = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: SHOWCASE.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.name,
    url: `${SITE.url}/products/${p.slug}/`,
  })),
};

/**
 * The products index (FINAL-SPEC §10): one ruled row per product, in gallery
 * order. Every line of copy is the product's own verified gallery copy
 * (content/showcase.ts, EV ids per panel); nothing here is new product copy.
 *
 * Rows are not cards: they alternate the screen's side at ≥1024 px and carry
 * the product's accent on a tick, the index and the descriptor only.
 */
export default function ProductsPage() {
  return (
    <main id="main" className="page">
      <div className="container page-wide">
        <div className="pi-top">
          <div className="pi-intro">
            {/* PROVISIONAL – owner approval required: the gallery caption, used as
                this page's heading; the lede is the register-checked hero lede. */}
            <SectionHeader id="products-title" level={1} annotation="Products" className="pi-head">
              Six products. Each one deploys on its own.
            </SectionHeader>
            <p className="t-lede page-lede">
              An AI-powered ecosystem of six enterprise products — for AI, automation,
              IoT and security.
            </p>
          </div>

          {/* The six rows at a glance, as a strip under the lede from 1024 px
              (pages.css). Same names and descriptors as the rows below. */}
          <nav className="pi-jump" aria-label="Jump to a product">
            <ol>
              {SHOWCASE.map((p) => (
                <li key={p.slug} style={{ "--p-accent": p.accent } as React.CSSProperties}>
                  <a href={`#${p.slug}`}>
                    <span className="tnum pi-jump-i">{p.index}</span>
                    <span className="pi-jump-name">{p.name}</span>
                    <span className="pi-jump-desc">{p.descriptor}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <ol className="pi-list" aria-labelledby="products-title">
          {SHOWCASE.map((p, i) => (
            <li
              key={p.slug}
              className="pi-row"
              id={p.slug}
              data-media={p.layout}
              style={{ "--p-accent": p.accent } as React.CSSProperties}
            >
              <div className="pi-copy">
                <p className="annot pi-index">
                  <span className="pi-tick" aria-hidden="true" />
                  <span className="tnum accent-text">{p.index}</span> / 06
                </p>
                <h2 className="pi-name">{p.name}</h2>
                <p className="pi-descriptor accent-text">{p.descriptor}</p>
                <p className="pi-line">{p.line}</p>

                {/* Omitted, not "to be confirmed", when the register has no answer. */}
                <SpecList className="pi-spec" rows={[{ label: "Deploys", value: p.deploy }]} />

                <div className="pi-actions">
                  <Link className="btn btn-primary" href={`/products/${p.slug}/`}>
                    Explore {p.name} <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                  <Link className="btn-text" href={`/contact/?interest=${p.slug}`}>
                    Request a briefing<span className="sr-only"> on {p.name}</span>
                  </Link>
                </div>
              </div>

              <div className="pi-media">
                <ScreenFrame
                  screen={p.shot}
                  eager={i < 2}
                  className="pi-shot"
                  sizes="(min-width: 1024px) 44vw, 92vw"
                />
              </div>
            </li>
          ))}
        </ol>

        <p className="page-more pi-more t-small">
          Beyond the six products, Meerana consults, builds, partners and supplies
          skilled people.{" "}
          <Link className="btn-text" href="/services/">
            Our services <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST) }}
      />
    </main>
  );
}
