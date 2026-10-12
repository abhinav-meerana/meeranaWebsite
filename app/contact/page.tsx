import Link from "next/link";
import ContactPanel from "@/components/contact/ContactPanel";
import SectionHeader from "@/components/ui/SectionHeader";
import { COMPANY, OFFICES } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import "../pages.css";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Talk to Meerana about Mandoobee, Tasree3, Nazo, Yisbir, Wasel, AI in a Box, or our services.",
  path: "/contact/",
});

/* Every enquiry call to action on the site lands here, with `?interest=` set to
   the product or service that sent the visitor. */
export default function ContactPage() {
  return (
    <main id="main" className="page">
      <div className="container page-narrow">
        <SectionHeader id="contact-title" level={1} annotation="Contact">
          Talk to Meerana
        </SectionHeader>
        {/* PROVISIONAL – owner approval required */}
        <p className="t-lede page-lede">
          Tell us what you want to see. We&rsquo;ll reply from {COMPANY.email}.
        </p>

        <ContactPanel />

        <div className="contact-direct">
          <div>
            <h2 className="t-h3">Write to us</h2>
            <p className="t-small">
              <a className="link-quiet" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="t-h3">Visit</h2>
            <p className="t-small">
              {COMPANY.legalName}
              <br />
              {COMPANY.address}
            </p>
          </div>
          <div>
            <h2 className="t-h3">Offices</h2>
            <ul className="plain-list t-small">
              {OFFICES.map((o) => (
                <li key={o.place}>
                  {o.place}
                  {o.detail ? <span className="annot"> · {o.detail}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="page-more">
          <Link className="btn-text" href="/products/">
            Explore the six products <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
