# 13 — Acceptance criteria & launch checklist

Each criterion is testable. "Owner" names the role that signs off: **M** = Meerana (business/content owner), **D** = design lead, **F** = frontend lead, **Q** = QA/accessibility, **B** = backend owner.

---

## A. Content & evidence (owner M + F)

| # | Criterion | How verified |
|---|---|---|
| A1 | Every public factual claim (product capability, figure, award, certification, partner/client label, office, event caption) references an evidence row with `public_status` `ok-to-use` or `use-with-edit`. | `npm run content:check` in production mode passes |
| A2 | Meerana has signed off every row used in production. | Sign-off column / decision log entry DL-C00 |
| A3 | No invented metrics, live telemetry, uptime/latency, customer names, personal names or testimonials anywhere, including demos. | Review against the 10 §5 rules; grep demo data |
| A4 | Product names use the canonical spellings: Wasel, Mandoobee, Tasree3, Yisbir. The legal entity string matches DL-C01. | Content lint list |
| A5 | Every open conflict in 05 is resolved or explicitly excluded from launch scope. | Decision log status |
| A6 | Certifications are shown only with a verified certificate (entity, standard, scope, body, validity) and permission to use the mark. | Evidence rows + written permission |
| A7 | Partner logos appear only under evidence-backed relationship headings, and with permission where the partner programme requires it. | Evidence rows |
| A8 | Event photos are captioned with event name and date (verified), and have consent/permission. No private data in frame. | Asset register |
| A9 | No AI-generated product media (the existing meerana.ae product videos and cover banners) is used as product imagery or evidence. Concept renders are labelled illustrative. | Asset register review (EV-305, EV-106, EV-118, EV-128, EV-144) |
| A10 | Outbound links to product-owned properties (tasree3.ae, yisbir.com, app stores) work, and their contact routes work. `info@yisbir.ai` is fixed before linking. | Link check + test email |

## B. Brand (owner D)

| # | Criterion | How verified |
|---|---|---|
| B1 | Only token values are used. No raw hex outside `tokens/`. | Lint rule / grep in CI |
| B2 | Product accents match the brand reference. Tasree3 is never green or teal; Wasel is never cyan. | Visual review + token test |
| B3 | Contrast passes for all text pairs (AA) and UI boundaries (3:1). | `contrast_check.py` + axe |
| B4 | Logos are official artwork (vector masters, or approved rasters at ≤ native size) with clear space respected. | Design review |
| B5 | ≤ 2 font families on initial load. Product display faces load only in their chapter or page. | Network panel |

## C. Narrative & UX (owner D + M)

| # | Criterion | How verified |
|---|---|---|
| C1 | Any lead product is reachable in ≤ 1 click from the hero and ≤ 2 interactions from any scroll position. | Manual + Playwright |
| C2 | The homepage reads coherently with JS and animation disabled. No content exists only in animation or canvas. | JS-off and reduced-motion runs |
| C3 | No product card set repeats without new information. | Design review against 06 |
| C4 | Each product page completes its storyboard beats 1–8 and ends in a product-specific CTA that preselects the form. | Review against 07 + e2e |
| C5 | The homepage is ≤ ~11 viewport heights on desktop at 1440×900 and ≤ ~16 screens on mobile at 390×844. | Measured scrollHeight / innerHeight |

## D. Motion & 3D (owner F + D)

| # | Criterion | How verified |
|---|---|---|
| D1 | Native scroll only. No scroll-speed manipulation. Hard-pinned distance ≤ 300vh per page (desktop). No hard pins on mobile homepage. | Code review + spec |
| D2 | Each pinned or sticky chapter has a skip link. Anchors land on the correct final state. | Playwright |
| D3 | Reduced motion (OS flag or on-page toggle): no scrub, pin, parallax, autoplay or counters. All steps are reachable via buttons. | Playwright with `reducedMotion: 'reduce'` |
| D4 | WebGL unavailable or context lost: posters render, no layout shift, no console errors. | Playwright with WebGL disabled; forced context loss test |
| D5 | Frame rate ≥ 55 fps desktop (integrated GPU) and ≥ 45 fps mid-tier Android per chapter, otherwise auto-fallback triggers. | Chrome performance traces attached to the release |
| D6 | Scene budgets met (tris, draw calls, texture size, transfer size). Memory stable across 10 route changes. | `renderer.info`, heap snapshots |

## E. Product demos (owner F + M)

| # | Criterion | How verified |
|---|---|---|
| E1 | Every screen has a provenance level. Illustrative screens show "Illustrative interface · sample data" visibly. | Visual review + automated check of `ProvenanceLabel` presence |
| E2 | Demos are operable by keyboard. Steps are announced via `aria-live`. They work at 375 px. | Playwright + screen reader pass |
| E3 | Demo data is non-identifying and purposeful (see 10 §5). | Data review |
| E4 | Product owners confirm the reconstructed and illustrative UIs don't misrepresent the shipping product. | M sign-off per product |

## F. Accessibility (owner Q)

| # | Criterion | How verified |
|---|---|---|
| F1 | axe: 0 serious or critical issues on all routes, EN and AR. | CI |
| F2 | WCAG 2.2 AA manual checklist passes (contrast, reflow at 320 px, 200% zoom, keyboard, focus visible/not obscured, target size, pause/stop/hide, forms). | QA report |
| F3 | NVDA + Chrome and VoiceOver iOS: header, product index, one product page and the contact form are fully usable. | QA report |
| F4 | Arabic/RTL (if in launch scope): mirrored layout, Almarai, correct `dir`, no clipped glyphs, numerals per DL-L02. | QA report |

## G. Performance (owner F)

| # | Criterion | How verified |
|---|---|---|
| G1 | Lighthouse mobile: Perf ≥ 85 on home and product pages; ≥ 95 elsewhere. A11y, SEO and Best Practices ≥ 95. | Lighthouse CI on 3 runs (median) |
| G2 | LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (lab proxies; field monitoring after launch). | LHCI + post-launch RUM |
| G3 | JS budgets: ≤ 180 KB home, ≤ 150 KB product, ≤ 110 KB static (gzip, initial). 3D chunk ≤ 250 KB, lazy. | size-limit CI |
| G4 | Images: AVIF/WebP with `srcset`. The hero poster is ≤ 120 KB. No image larger than 2× its rendered size. | Build report |

## H. Contact & privacy (owner B + M)

| # | Criterion | How verified |
|---|---|---|
| H1 | The form posts to the agreed FastAPI contract. All response codes (202/409/422/429/503) are handled, with accessible messages. | Contract tests + e2e with mock |
| H2 | Server abuse controls are live: bot verification, honeypot, timing check, rate limits, size limits, CORS allowlist. | B test report |
| H3 | Enquiries reach the agreed inbox or CRM within the agreed time. No PII in logs or analytics. | End-to-end test in staging |
| H4 | The privacy notice is published and covers controller, purposes, retention, transfers and rights. Consent UI matches the analytics choice. | Legal review (M) |

## I. SEO & technical (owner F)

| # | Criterion | How verified |
|---|---|---|
| I1 | Unique titles and descriptions; canonical tags; `sitemap.xml`; `robots.txt`; JSON-LD validates (Rich Results test). Only verified fields are in structured data. | CI + manual |
| I2 | Redirects from all current meerana.ae routes resolve with 301 to the nearest new page. No 404s for known inbound URLs. | Redirect test list |
| I3 | Security headers present (CSP, HSTS, Referrer-Policy, Permissions-Policy). No mixed content. | securityheaders scan |
| I4 | Zero console errors on all routes across the browser matrix. | Playwright |

---

## Launch checklist (in order)

1. ☐ Decision log: all launch-blocking decisions closed (05, "Blocking" column).
2. ☐ Evidence register: all production rows `ok-to-use`/`use-with-edit`, signed off by Meerana (A1, A2).
3. ☐ Assets: vector logos received; product screenshots/videos received or illustrative labels in place; photo permissions on file (A8, B4).
4. ☐ Content freeze: EN copy approved; AR copy approved (if in scope).
5. ☐ Staging deploy with production build flags; `content:check` in production mode passes.
6. ☐ QA matrix complete (11 §19): browsers, devices, modes, AT; all P1/P2 issues fixed.
7. ☐ Performance budgets met on staging (G1–G4).
8. ☐ Contact pipeline verified end-to-end in staging (H1–H3); monitoring and alerting on the API.
9. ☐ Privacy notice live; analytics configured per DL-T07; consent behaviour verified.
10. ☐ Redirect map deployed and tested (I2).
11. ☐ DNS/TLS/headers verified (I3); rollback plan (previous site artefacts kept for 30 days).
11a. ☐ Legacy exposure closed (DL-T08): old bundle and source maps no longer served; `api.meerana.ae/allDataInfo/*` legacy endpoints reviewed and closed or secured; the exposed third-party key rotated; staging hosts de-indexed.
12. ☐ Launch; smoke test on production; submit sitemap in Search Console.
13. ☐ Post-launch (week 1): RUM Core Web Vitals check; form deliverability; analytics sanity; 404 log review.
