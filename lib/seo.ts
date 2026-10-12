import type { Metadata } from "next";

export const SITE = {
  name: "Meerana Technologies",
  url: "https://meerana.ae",
  locale: "en_AE",
} as const;

/** The site-wide Open Graph image (app/opengraph-image.png, 1200×630). */
const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Meerana Technologies",
};

/**
 * Product routes carry their own card: app/products/[slug]/og.png/route.tsx
 * renders one 1200×630 PNG per product into the export (FINAL-SPEC §10,
 * DD-26g). It is a route handler with a `.png` path rather than the
 * `opengraph-image` file convention because the convention exports an
 * extensionless file, which static hosts serve with no image Content-Type.
 * The product page does not have to pass anything: its path selects the card.
 */
const PRODUCT_ROUTE = /^\/products\/([a-z0-9-]+)\/$/;

/**
 * Per-route metadata with a COMPLETE Open Graph object.
 *
 * A route's `openGraph` replaces the layout's rather than merging with it, so a
 * page that sets only a title would lose `siteName`, `locale`, the URL and the
 * image (the file-convention image does not survive a page-level `openGraph`).
 * This helper always sets all of them.
 *
 * `image`:
 *   · omitted: the site-wide card, or on a product route that product's card;
 *   · a path: that 1200×630 image;
 *   · `false`: no image here, so a segment's `opengraph-image` file wins.
 */
export function pageMeta({
  title,
  description,
  path,
  noindex = false,
  image,
}: {
  /** The page title, without the site suffix. */
  title: string;
  description: string;
  /** Route path with trailing slash, e.g. "/company/". */
  path: string;
  noindex?: boolean;
  image?: string | false;
}): Metadata {
  const full = `${title} · ${SITE.name}`;
  const product = path.match(PRODUCT_ROUTE)?.[1];
  const mode = image ?? (product ? `/products/${product}/og.png` : OG_IMAGE.url);
  const og =
    mode === false
      ? null
      : mode === OG_IMAGE.url
        ? OG_IMAGE
        : { ...OG_IMAGE, url: mode, alt: product ? `${SITE.name} product card: ${title}` : full };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      title: full,
      description,
      url: path,
      ...(og ? { images: [og] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      ...(og ? { images: [og.url] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
