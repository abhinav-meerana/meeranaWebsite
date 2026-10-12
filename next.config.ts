import type { NextConfig } from "next";

/**
 * Static export per plan/11-technical-architecture.md §20:
 * one static HTML file per route, portable to any static host including the
 * existing Apache hosting. No server runtime, so no server actions.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // next/image optimisation is unavailable under static export (plan/11 §17).
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    /* Inline the stylesheets into each page's HTML. The site is static, the CSS
       is small, and it removes three render-blocking requests from the critical
       path (the simulated mobile LCP was waiting on them). */
    inlineCss: true,
  },
};

export default nextConfig;
