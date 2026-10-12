import type { MetadataRoute } from "next";
import { SHOWCASE } from "@/content/showcase";
import { SITE } from "@/lib/seo";

/* Static export: generated once at build. Every public route is listed; the
   privacy shell is not (it is noindex until its text exists). */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/products/",
    ...SHOWCASE.map((p) => `/products/${p.slug}/`),
    "/services/",
    "/company/",
    "/contact/",
  ];
  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
