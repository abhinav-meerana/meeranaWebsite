import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/site/Header";
import SiteFooter from "@/components/site/SiteFooter";
import { COMPANY } from "@/content/company";
import { SCENE } from "@/lib/scene-colors";
import { SITE } from "@/lib/seo";
import "./globals.css";
import "./header.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Meerana Technologies — We engineer intelligence for the real world",
    template: `%s · ${SITE.name}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: "Meerana Technologies — We engineer intelligence for the real world",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meerana Technologies — We engineer intelligence for the real world",
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
      </head>
      <body>
        {/* The grade stack. Painted in DOM rather than in the WebGL scene so it
            covers the whole page, costs one composite each, and survives having
            no WebGL at all. All three are non-interactive decoration. */}
        <div className="grade-overlay" aria-hidden="true" />
        <div className="vignette-overlay" aria-hidden="true" />

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <Header />

        <div className="page-content">
          {children}
          <SiteFooter />
        </div>

        {/* Grain is last so it films the entire page including the room. */}
        <div className="grain-overlay" aria-hidden="true" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
        />
      </body>
    </html>
  );
}
