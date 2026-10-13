import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import MeeranaInteractiveBackground from "@/components/background/MeeranaInteractiveBackground";
import SiteNav from "@/components/nav/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { COMPANY } from "@/content/company";
import { SCENE } from "@/lib/scene-colors";
import { SITE } from "@/lib/seo";
import "./globals.css";
import "./background.css";
import "./nav.css";

/* Poppins is the brand Latin face (brand-reference.md §1). Self-hosted at build
   time by next/font, so there are no runtime Google requests — a privacy and
   performance requirement from plan/11 §17. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

const DESCRIPTION =
  "An AI-powered ecosystem of six enterprise products — for AI, automation, IoT and security. Built in the UAE. Engineered for the world.";
const TITLE = "Meerana Technologies — Complexity, meet clarity";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s · ${SITE.name}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

/* themeColor is --surface-page. Metadata cannot read a custom property, so
   it comes from the token mirror in lib/scene-colors.ts (FINAL-SPEC §9). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SCENE.page,
};

/* The stored List view preference (FINAL-SPEC §4.1), applied before first
   paint so a product page that was left in List view never flashes the rail
   first. Storage can throw (private windows, blocked site data), so it is
   guarded; with no stored value nothing changes. */
const VIEW_PREF =
  'try{if(localStorage.getItem("meerana:view")==="list")document.documentElement.dataset.view="list"}catch(e){}';

/* The motion mode, set before first paint so the homepage story renders in
   its cinematic or its static layout from the first frame (no flash, no
   hydration mismatch: <html> is suppressHydrationWarning). "full" lets the
   story arm itself; "reduced" keeps the static layout. A script that fails to
   load switches to "static" at once; if the story still has not reported
   ready after 8 s, the page drops to "static" too, where every line of copy
   is in normal flow. */
const MOTION_MODE =
  'var d=document.documentElement;try{d.dataset.motion=matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full"}catch(e){d.dataset.motion="full"}' +
  /* A script that fails to load cannot start the story: go static at once. */
  'addEventListener("error",function(e){var t=e.target;if(t&&t.tagName==="SCRIPT"&&d.dataset.motion==="full")d.dataset.motion="static"},true);' +
  /* Last resort: a script that loaded but never started it. */
  'setTimeout(function(){var s=document.querySelector("[data-story]");if(s&&s.getAttribute("data-story")!=="ready"&&d.dataset.motion==="full")d.dataset.motion="static"},8000)';

/* Organization data: verified fields only (EV-020 founding year, EV-531 entity,
   address and email). No logo URL until the vector masters exist (DL-B02), and
   no social profiles until they are confirmed (EV-021). */
const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: COMPANY.legalName,
  url: SITE.url,
  email: COMPANY.email,
  foundingDate: COMPANY.founded,
  address: {
    "@type": "PostalAddress",
    streetAddress: "#1704, Blue Bay Tower, Business Bay",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: VIEW_PREF }} />
        <script dangerouslySetInnerHTML={{ __html: MOTION_MODE }} />
      </head>
      <body>
        {/* The interactive background: one fixed, decorative stack behind
            every route, mounted once so it never resets between pages. */}
        <MeeranaInteractiveBackground />

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <SiteNav />

        <div className="page-content">
          {children}
          <SiteFooter />
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
        />
      </body>
    </html>
  );
}
