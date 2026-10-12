# SEO and metadata (Next.js 16 App Router)

## Root metadata
```tsx
// app/layout.tsx (Server Component)
import type { Metadata } from "next";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.meerana.ae"),
  title: { template: "%s | Meerana Technologies", default: "Meerana Technologies — AI products built in the UAE" },
  description:
    "Meerana builds AI products for access control, video intelligence, workplace operations, process management and official correspondence — built in the UAE, deployable on your own infrastructure.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Meerana Technologies", locale: "en_AE" },
  twitter: { card: "summary_large_image" },
};
```
- The description is 160 characters or fewer and is built from EV-006/007, the product list and EV-461. Confirm it with `meerana-evidence` before launch.
- Per page, use `export const metadata` or `generateMetadata` (await `params` in Next 16), and a file-based `opengraph-image.tsx` (1200×630).

## JSON-LD (evidence-backed fields only)
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Meerana Technologies",            // legal name per DL-C01 before launch
  "url": "https://www.meerana.ae",
  "foundingDate": "2022",                    // EV-020
  "address": { "@type": "PostalAddress", "streetAddress": "Blue Bay Tower, Business Bay", "addressLocality": "Dubai", "addressCountry": "AE" }, // unit per DL-C06
  "email": "info@meerana.ae",
  "sameAs": ["https://www.linkedin.com/company/meerana"]   // add verified socials only
}) }} />
```
- Product pages use `SoftwareApplication` with `applicationCategory` and `operatingSystem` (from store listings for Mandoobee, EV-420).
- **No** `aggregateRating`, `review` or `offers` without real data.

## Crawl files
```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.meerana.ae";
  return ["", "/products", "/products/tasree3", "/products/yisbir", "/products/mandoobee", "/products/wasel", "/products/nazo",
          "/services", "/company", "/contact", "/privacy"].map((p) => ({ url: base + p, lastModified: new Date() }));
}
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://www.meerana.ae/sitemap.xml" };
}
```
- `/products/nazo` and `/products/wasel` belong in the sitemap only once DL-P05/P02/P08 are decided.
- Static export: configure 301s at the host (DL-T01/T02).

## Live-site fix list (REPORT §4.6)
| Live today | Fix |
|---|---|
| Title "Meerana" on every route | Per-route titles via the Metadata API |
| CRA default meta description | Real descriptions |
| No robots.txt / sitemap.xml / manifest | `robots.ts`, `sitemap.ts`, `manifest.ts` |
| SPA soft-404s (unknown URLs return 200) | Static export with a real `not-found.tsx` and host 404 status |
| 12+ `<h1>` per page | One h1. Nav items become links. |
| 31/31 images without alt | Alt on every image; logos get the organisation name |
| No OG/Twitter, no canonical, no `lang`/`hreflang` | Metadata API; `hreflang` with the Arabic launch |
| `http://` not redirected | HTTPS redirect + HSTS at the host |
| Product pages unreachable (orphaned) | Real routes in nav, sitemap and product index |
