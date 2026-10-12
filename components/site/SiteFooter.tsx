import Link from "next/link";
import { COMPANY } from "@/content/company";
import { SHOWCASE } from "@/content/showcase";
import { PREVIEW, PRIVACY_URL } from "@/lib/flags";

/**
 * The shared footer, rendered once from the root layout so every route has it
 * (plan/06 §3). Facts are the owner-supplied values (EV-531). No phone number
 * and no social links: neither is verified (EV-021).
 *
 * The prototype note appears only in a preview build (NEXT_PUBLIC_PREVIEW=1).
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          {/* The official stacked lockup, white colourway, at less than its
              native 365px width. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/meerana-lockup-stacked-white.png"
            width={365}
            height={223}
            alt="Meerana Technologies"
            className="footer-logo"
            loading="lazy"
            decoding="async"
          />
          <p className="t-small">
            {COMPANY.legalName}
            <br />
            {COMPANY.address}
          </p>
          <p className="t-small">
            <a className="link-quiet" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
          </p>
          <p className="annot">Founded in Dubai in {COMPANY.founded}</p>
        </div>

        <nav className="footer-col" aria-label="Products">
          <p className="annot">Products</p>
          <ul>
            {SHOWCASE.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}/`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Company">
          <p className="annot">Company</p>
          <ul>
            <li>
              <Link href="/company/">Company</Link>
            </li>
            <li>
              <Link href="/services/">Services</Link>
            </li>
            <li>
              <Link href="/contact/">Contact</Link>
            </li>
            {PRIVACY_URL ? (
              <li>
                <Link href={PRIVACY_URL}>Privacy</Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      <div className="container footer-base">
        <p className="annot">
          © {new Date().getFullYear()} {COMPANY.legalName}
        </p>
        {PREVIEW ? (
          <p className="annot footer-preview">
            Preview build · copy proposed · unconfirmed content flagged
          </p>
        ) : null}
      </div>
    </footer>
  );
}
