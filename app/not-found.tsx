import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { SHOWCASE } from "@/content/showcase";
import "./pages.css";

export const metadata = { title: "Page not found" };

/* A recovery page, not a dead end: the shared header and footer come from the
   root layout, and every product is one click away. */
export default function NotFound() {
  return (
    <main id="main" className="page">
      <div className="container page-narrow">
        <SectionHeader id="nf-title" level={1} annotation="404">
          This page doesn&rsquo;t exist.
        </SectionHeader>
        <p className="t-lede page-lede">
          It may have moved, or the address may be mistyped. Try one of these.
        </p>

        <ul className="nf-links">
          {SHOWCASE.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}/`}>
                <span className="nf-name">{p.name}</span>
                <span className="annot">{p.descriptor}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="cta-actions">
          <Link className="btn btn-primary" href="/">
            Back to the homepage
          </Link>
          <Link className="btn btn-ghost" href="/contact/">
            Contact Meerana
          </Link>
        </div>
      </div>
    </main>
  );
}
