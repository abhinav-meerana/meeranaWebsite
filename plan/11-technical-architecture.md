# 11 — Technical architecture & proposed file structure

**Governing skills:** `meerana-frontend`, `meerana-webgl-scenes`, `meerana-scroll-choreography`, `meerana-a11y-responsive`.
**Version facts:** see §20 (verified 2026-10-02 in `research/sources/tech-verification.md`).

---

## 1. Evaluation of existing code

| Source | What it is | Verdict | Salvage |
|---|---|---|---|
| **Figma Make v17** (`research/recovered/figma-make-v17/src`) | React 19 + Vite + react-router SPA. 1 home component (1,071 lines). Product page template. `products.ts` (4 products). ReactBits-style effects: MetaBalls (ogl), GradualBlur, ClickSpark, ScrollReveal. Tailwind v4 base + ~70 KB custom CSS with many dead selectors. | **Replace** | `products.ts` *shape* (slug, code, modules, environments, outcomes, architecture) as input to the new schema. Product module/feature text **only where the evidence register confirms it** (it appears derived from meerana.ae). Nothing visual: the effects communicate nothing, the console data is invented, and the palette is off-brand. |
| **Dark Draft v2** (single HTML) | Vanilla CSS/JS. CSS 3D tilted panels, 3D card carousel, SVG diagrams. Manrope; off-brand blues. | **Replace** | Content leads to verify: stats, pillars, solution areas, awards wording, offices. The *idea* of a services sequence (Consult → Design → Build → Integrate → Operate), pending evidence. |
| **Live meerana.ae** (CRA SPA, `research/live-site/main.5717dfa4.js`) | Client-rendered React; content in the JS bundle; assets under `/assets/`. | Content source, not code | Routes for the redirect map; asset URLs; copy as `company-claim` evidence. |

**Why replace rather than refactor:**
- Neither codebase separates content from presentation.
- Neither has SSR/SSG: both are client-rendered, so SEO is poor.
- Neither has reduced-motion, WebGL-fallback or provenance handling.
- Their visual systems conflict with the brand.

Refactoring would cost more than a clean build on the stack below. The domain knowledge they contain is carried over through the content schema.

## 2. Recommended stack (one primary)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js, App Router, static export (`output: 'export'`)** | Static HTML per route (SEO; content outside the canvas). React Server Components keep content out of client JS. One React tree per page lets one canvas, chapter timelines and demo state share context. Portable to any static host, including the current Apache hosting. |
| Language | **TypeScript (strict)** | Typed content schema, demo state machines, the API contract |
| 3D | **three.js (WebGLRenderer) + @react-three/fiber + minimal @react-three/drei** (`View`/`View.Port`, `useGLTF`, `PerformanceMonitor`, `AdaptiveDpr`) | Declarative scenes colocated with React state. One **persistent** canvas in the root layout survives client navigation (Next layouts don't re-render). Inline drei `<View>`s scissor several DOM-anchored scenes through **one** WebGL context. The `track` prop is deprecated; use inline Views. |
| Choreography | **GSAP + ScrollTrigger + @gsap/react (`useGSAP`)** | Mature scrubbed/pinned timelines on native scroll. `gsap.matchMedia()` gives breakpoint and reduced-motion branches. One engine for DOM and 3D progress. |
| Micro-interactions | **CSS transitions** (+ CSS scroll-driven animations as progressive enhancement where supported) | No second animation library (no Motion/Framer, AOS, Lenis). |
| Styling | **CSS Modules + CSS custom properties** generated from `design-tokens.json` | The token tiers map 1:1 to custom properties; `data-surface`/`data-product` theming; no utility-class sprawl |
| Content | **TypeScript modules validated by zod** + generated `evidence.ts` from the register CSV | Build-time evidence gate (§6). No CMS in v1 (DL-T03). |
| Forms | Native form + shared zod schema → **FastAPI** endpoint | Contract in §15 |
| Testing | Vitest, Playwright (+ @axe-core/playwright), Lighthouse CI, size-limit | See §19 |
| Images | Build-time **sharp** script → AVIF/WebP `srcset` + `<picture>` component | `next/image` optimisation is unavailable in static export |
| Fonts | `next/font` (Poppins, Almarai, product display faces), self-hosted at build | No runtime Google requests (privacy); subsetting |

**Alternatives considered:**
- **Astro + React islands.** Excellent for content sites and ships less JS by default. Rejected: the homepage's chapters, shared canvas (`View` requires one React tree) and demos would collapse into one large island anyway, removing Astro's advantage while adding cross-island state plumbing.
- **Vite SPA** (like the recovered code). Rejected for SEO and first-paint reasons.
- **Lenis/ScrollSmoother.** Rejected: native scrolling is non-negotiable.
- **Framer Motion/Motion alongside GSAP.** Rejected: two engines cause ownership conflicts and duplicate bundle weight.
- **WebGPU renderer.** Not in v1 (see §20).

## 3. Routes and page templates

| Route | Template | Notes |
|---|---|---|
| `/` | Home | Narrative homepage (06) |
| `/products` | Product index | All products with status, links to pages or factual entries |
| `/products/wasel` | `ProductStoryPage` | Full storyboard (07) |
| `/products/mandoobee` | `ProductStoryPage` | |
| `/products/tasree3` | `ProductStoryPage` | Links out to tasree3.ae if confirmed as the official product site |
| `/products/yisbir` | `ProductStoryPage` | Positioning per DL-P01 |
| `/products/<other>` | `ProductFactPage` (shorter, no story) | Only for products whose status is confirmed active and documented (DL-P05) |
| `/services` | `ServicesPage` | Delivery capabilities and solution areas (DL-S01) |
| `/company` | `CompanyPage` | About, offices, recognition, certifications, events, partners |
| `/contact` | `ContactPage` | Form; `?interest=` preselect |
| `/privacy` | `LegalPage` | Required by the form and analytics (PDPL) |
| `/ar/...` | Mirrors of the above | RTL. Launch or phase 2 per DL-L01. |
| `404` | `NotFound` | Links to products and contact |

Metadata routes: `sitemap.xml`, `robots.txt`, OG images per product (static, pre-rendered).
Redirects from current meerana.ae paths (e.g. `/tasree3`) are configured at the host (DL-T02).

## 4. Proposed file structure

```
meerana-web/
├─ app/
│  ├─ (en)/                      # root layout #1: <html lang="en" dir="ltr">; English keeps clean URLs (/products/wasel)
│  │  ├─ layout.tsx              # fonts, SiteHeader, SiteFooter, skip link, <PersistentStage/> (client, lazy)
│  │  ├─ page.tsx                # Home (server) → sections/home/*
│  │  ├─ products/page.tsx
│  │  ├─ products/[slug]/page.tsx   # generateStaticParams from content/products
│  │  ├─ services/page.tsx  company/page.tsx  contact/page.tsx  privacy/page.tsx
│  │  └─ not-found.tsx
│  ├─ (ar)/ar/                   # root layout #2: <html lang="ar" dir="rtl">; same page components with locale="ar" (phase per DL-L01)
│  ├─ sitemap.ts  robots.ts
├─ components/                   # design-system primitives (Button, SectionHeader, ProofCard, Picture, …)
├─ sections/
│  ├─ home/                      # Hero, ProductIndex, EcosystemChapter, ProductChapter, HowWeDeliver, Proof, CompanyStrip, ContactCTA
│  └─ product/                   # ProductHero, ProblemBeat, ContextBeat, InterfaceBeat, TaskWalkthrough, FeatureMoments, OutcomeBeat, ValueProof, ProductCTA
├─ demos/
│  ├─ core/                      # DemoFrame, ProvenanceLabel, StepControls, useDemoMachine
│  ├─ wasel/  mandoobee/  tasree3/  yisbir/   # screens + state machine per product
├─ scenes/
│  ├─ PersistentStage.tsx        # client; ONE fixed full-viewport <Canvas> in the root layout; <View.Port/>; error boundary; perf monitor
│  ├─ SceneSlot.tsx              # DOM slot + poster fallback + IntersectionObserver; renders an inline drei <View> when eligible
│  ├─ progress.ts                # per-scene progress refs (set by timelines, read in useFrame)
│  ├─ lattice/                   # shared instanced-cell primitives (from logo geometry)
│  ├─ ecosystem/                 # home ecosystem model
│  └─ wasel-gate/  yisbir-site/  mandoobee-desk/  tasree3-graph/
├─ motion/
│  ├─ gsap.ts                    # registerPlugin, defaults, matchMedia presets
│  └─ useChapterTimeline.ts      # shared hook (pin rules, skip link, reduced-motion branch)
├─ content/
│  ├─ schema.ts                  # zod schemas (§6)
│  ├─ evidence.generated.ts      # built from plan/03-evidence-register.csv
│  ├─ site.ts  services.ts  proof.ts  company.ts
│  ├─ products/{wasel,mandoobee,tasree3,yisbir}.ts
│  └─ demo-data/{wasel,mandoobee,tasree3,yisbir}.ts
├─ tokens/  design-tokens.json → generated tokens.css
├─ lib/  contact-client.ts  analytics.ts  webgl.ts  i18n.ts  motion-preference.ts
├─ public/
│  ├─ logos/ (SVG masters when supplied)  images/  posters/  video/
│  └─ 3d/<scene>/ (*.glb, *.ktx2, README.md with source, poly counts, licence)
├─ scripts/  build-tokens.mjs  build-images.mjs  content-check.mjs  evidence-to-ts.mjs
├─ tests/  unit/  e2e/  a11y/  visual/
└─ lighthouserc.json  playwright.config.ts  .size-limit.json
```

## 5. Component boundaries

**Server components** (zero client JS): all text content, section shells, proof, services, footer, metadata, JSON-LD.

**Client islands** (each lazily hydrated where possible):

| Island | Responsibility |
|---|---|
| `SiteHeader` (menu state only) | Disclosure mega-nav, scroll state |
| `ChapterTimeline` (wrapper per chapter) | Owns the chapter's GSAP timeline; sets scene progress and demo step; skip link |
| `ProductDemo` | State machine + DOM screens; controlled by timeline *or* buttons |
| `Stage` | The single canvas; scene registry; WebGL detection; error boundary; perf monitor |
| `ContactForm` | Validation, Turnstile, submission, states |
| `MotionPreference` | OS reduced-motion + on-page toggle (persisted) |

## 6. Content schema (abridged)

```ts
const EvidenceId = z.string().regex(/^EV-\d{3,4}$/);
const Claim = z.object({ text: z.string().min(1), textAr: z.string().optional(), evidence: z.array(EvidenceId).min(1) });
const Asset = z.object({ src: z.string(), alt: z.string(), provenance: z.enum(['real','reconstructed','illustrative','photo','logo']), evidence: z.array(EvidenceId).optional() });

const Product = z.object({
  slug: z.enum(['wasel','mandoobee','tasree3','yisbir']),
  name: z.string(), nameAr: z.string().optional(),
  tier: z.enum(['lead','supporting','listed']),
  brandKey: z.enum(['wasel','mandoobee','tasree3','yisbir']),
  logo: Asset,
  positioning: Claim,                 // one sentence, approved
  problem: Claim,
  users: z.array(Claim), buyer: Claim,
  environments: z.array(Claim),
  workflows: z.array(z.object({ id: z.string(), title: z.string(), steps: z.array(Claim) })),
  capabilities: z.array(Claim.extend({ group: z.string() })),
  integrations: z.array(Claim).default([]),
  deployment: z.array(Claim).default([]),
  proof: z.array(z.object({ kind: z.enum(['award','certification','client','event']), ref: z.string() })).default([]),
  demo: z.object({ id: z.string(), provenance: z.enum(['real','reconstructed','illustrative']), steps: z.array(z.object({ id: z.string(), label: z.string(), feature: Claim })) }),
  cta: z.object({ label: z.string(), interest: z.string() }),
  externalSite: Claim.optional(),
  seo: z.object({ title: z.string().max(60), description: z.string().max(160) }),
});
```

**Evidence gate** (`scripts/content-check.mjs`, runs in CI and before `next build`):
1. Parse all content through zod.
2. Load `evidence.generated.ts` (from the CSV).
3. In **production** mode, fail if any referenced EV id has `public_status` ∉ {`ok-to-use`, `use-with-edit`}.
4. In **preview** mode, allow them but render a visible "UNCONFIRMED" badge (`data-unconfirmed`), so reviewers see what is pending.
5. Fail if any `illustrative` demo lacks its on-screen label component.

## 7. Scene and animation ownership

```
ScrollTrigger (native scroll)
   └─ ChapterTimeline (one GSAP timeline per chapter, built in gsap.matchMedia branches)
        ├─ DOM: text containers, UI panels, callouts           (transform/opacity only)
        ├─ ProductDemo.setStep(i)                               (state machine; also button-driven)
        └─ sceneProgress[sceneId].current = p  → invalidate()   (scene reads in useFrame)
PersistentStage (root layout; one <Canvas frameloop="demand">; <View.Port/>)
   └─ inline <View> inside each eligible SceneSlot → scene components (never read scroll)
```

**Rules:**
- One timeline writes each property.
- Scenes are pure functions of `progress`/`step`.
- Reduced-motion and mobile branches don't create pinning timelines; they use step buttons + posters.

## 8. Asset organisation & pipeline

| Asset | Source of truth | Pipeline | Output |
|---|---|---|---|
| Logos | Vector masters from Meerana (pending) | SVGO | `public/logos/*.svg` |
| Photos (events, offices) | `research/asset-inventory.csv`, approved selection | sharp: 640/960/1440/1920 widths, AVIF + WebP, EXIF stripped | `public/images/` |
| Product screens | Meerana-supplied captures (pending) or demo components | Real screens → PNG→AVIF at 1×/2× | `public/images/products/<slug>/` |
| 3D | Procedural (lattice) + simple models | gltf-transform `optimize --compress meshopt --texture-compress ktx2` | `public/3d/<scene>/` |
| Posters (3D fallbacks) | Rendered from the scenes at final state | sharp | `public/posters/<scene>-<state>.avif` |
| Video (if supplied) | Meerana product videos (`/assets/*.mp4` on meerana.ae; quality unknown) | ffmpeg → H.264 + AV1, ≤ 6 MB, muted, captions if speech | `public/video/` |

## 9. Responsive behaviour

| Breakpoint | Chapter layout | 3D | Demos |
|---|---|---|---|
| ≥ 1280 | Text column + sticky stage; pins per spec | Full scenes | Full device frames |
| 1024–1279 | Same, narrower stage | Full scenes, DPR cap 1.25 | Same |
| 768–1023 | Stage above text, short pins (≤ 100vh) | Light scene variant or poster (by perf tier) | Device frames scaled; step buttons visible |
| < 768 | Stacked; **no pins**; step-based reveals on intersection | Poster/short muted loop by default; 3D opt-in on high-tier devices only | Phone-first variants; focused crops; step buttons |

## 10. Lazy loading & scene lifecycle

`idle → eligible → loading → ready → active ⇄ paused → disposed`

1. **idle:** the SSR poster renders in the `SceneSlot` (LCP-safe).
2. **eligible:** WebGL check passes, no reduced-motion, no Save-Data, perf tier OK, and the slot is within 1 viewport.
3. **loading:** dynamic import of the three/R3F chunk (once per page) and scene assets.
4. **ready:** first frame rendered. Cross-fade from the poster (opacity only).
5. **active:** renders on demand while its chapter timeline is moving.
6. **paused:** after 2 viewports out of view, stop invalidation.
7. **disposed:** on route change, free geometries, textures and the renderer.

## 11. Error boundaries & non-WebGL fallback

- A `Stage` error boundary on any thrown error or `webglcontextlost` hides the canvas and shows posters. It logs an anonymous `webgl_fallback` analytics event.
- Pre-flight check: `canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })` runs before loading the 3D chunk.
- `PerformanceMonitor`: sustained < 40 fps for 2 s, then drop DPR. Still < 30 fps, then posters.
- Demos and all copy are DOM, so nothing is lost without WebGL.
- Without JS, pages read fully. The contact form degrades to the visible email/phone contacts (static export has no server action).

## 12. SEO & semantic HTML

- Static HTML per route.
- Unique `<title>`/description per page.
- Canonical URLs; `hreflang` en/ar when Arabic ships.
- JSON-LD:
  - `Organization`: legal name per DL-C01, logo, address, contactPoint, verified `sameAs`.
  - `WebSite`.
  - `BreadcrumbList`.
  - `SoftwareApplication` per product, with **only verified fields**: no ratings or offers unless real.
- Heading hierarchy: one `h1` per page; chapters use `h2`; beats use `h3`.
- Product names appear as text, not only in logos.
- OG images: static per product, in brand surfaces.

## 13. Keyboard & assistive technology

- Skip link.
- Disclosure-pattern mega-menu.
- Demo steps are `<button>`s with `aria-pressed`/`aria-current`.
- Step announcements via `aria-live="polite"`.
- Canvas `aria-hidden`.
- Every pinned chapter has a "Skip chapter" link.
- Focus never lands inside an invisible element.
- The on-page reduced-motion toggle is in the header utility area.
- Full rules in `meerana-a11y-responsive`.

## 14. Internationalisation (RTL-ready)

- `lang`/`dir` set per route group.
- Logical CSS properties only.
- Strings in content files (`text`/`textAr`).
- Product names stay in Latin script unless an Arabic name is officially specified (DL-L03).
- Timelines that animate along the x-axis read `dir` and mirror.
- Almarai is loaded only on `/ar`.

## 15. Contact form integration (FastAPI contract)

**Endpoint:** `POST https://<api-host>/v1/enquiries`. The host is decided in DL-T04; it is not assumed to exist.

**Request headers:** `Content-Type: application/json`, `Idempotency-Key: <uuid v4>`.

```json
{
  "name": "string 2–120",
  "company": "string 0–160",
  "email": "RFC 5322, ≤ 254",
  "phone": "optional, ≤ 32, digits/+/spaces",
  "interest": "wasel | mandoobee | tasree3 | yisbir | other-product | consulting | bespoke-development | staff-augmentation | reselling | managed-services | partnership | other",
  "message": "string 20–4000",
  "locale": "en | ar",
  "source": { "page": "/products/wasel", "cta": "wasel-hero", "utm": { "source": "", "medium": "", "campaign": "" } },
  "consent": { "privacy_notice_ack": true, "marketing_opt_in": false },
  "website": "",
  "elapsed_ms": 18342,
  "turnstile_token": "…"
}
```

The `interest` enum is final once DL-S01/DL-P05 settle the services and products.

**Responses:**

| Status | Body |
|---|---|
| `202 Accepted` | `{ "id": "enq_…", "status": "received" }` |
| `422` | `{ "errors": [ { "field": "email", "code": "invalid", "message": "…" } ] }`. Field codes are localised client-side. |
| `409` | A repeated `Idempotency-Key` with a different body. A repeat with the *same* body returns the original 202. |
| `429` | `{ "retry_after": 600 }` |
| `503` | Generic message. The client shows the email/phone fallback. |

**Abuse protection (server side, required):**
- Turnstile `siteverify` (or the chosen provider, DL-T05), checking hostname and action.
- Honeypot `website` must be empty.
- `elapsed_ms` ≥ 3000.
- Rate limits: per IP 5/10 min and 20/day; per email 3/hour (e.g. slowapi + Redis).
- Body ≤ 16 KB. Strict pydantic models with `extra="forbid"`. Control-character stripping. URL-count heuristic on `message`.
- CORS allowlist (production + preview origins). HTTPS only. Generic error texts.

**Data handling:**
- Store with a retention period (DL-T06).
- Notify sales by email *without* the message body in the subject.
- No PII in logs or analytics.
- Admin access audited.
- Subject-access/deletion process per PDPL (see `research/sources/tech-verification.md`).

**Client:**
- Mirrors validation with the same zod schema (generated from or kept in sync with the pydantic model; contract tests in CI against a FastAPI OpenAPI snapshot).
- Disables double submit.
- Accessible error summary.
- Success state shows the next step ("We reply within … " only if Meerana commits to an SLA, DL-C04).

## 16. Analytics & privacy

- **Default:** cookieless, privacy-friendly analytics (Plausible or self-hosted Umami; DL-T07). If GA4 is mandated, add a consent banner and Consent Mode v2 *before* any tag loads.
- **Events** (no PII):
  - `product_index_click{product}`
  - `chapter_progress{chapter, 50|100}`
  - `demo_step{product, step}`
  - `cta_click{interest, location}`
  - `form_submit{interest, result}`
  - `webgl_fallback{reason}`
  - `motion_reduced{source}`
- No session replay. No third-party pixels in v1.
- Privacy notice covers: controller entity, purposes (enquiry handling, aggregate analytics), retention, transfers (hosting regions), rights and contact.

## 17. Deployment assumptions

- **Static export** deployed to a CDN host with per-PR previews (DL-T01). Viable if Meerana's existing Apache host is retained: static files plus rewrite and redirect rules.
- **Headers:**
  - CSP: `default-src 'self'`, plus `connect-src` for the API host and `challenges.cloudflare.com` if Turnstile.
  - HSTS.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy` (camera, mic and geolocation off).
  - Immutable caching for hashed assets.
- The FastAPI service is deployed separately. Region per DL-T04: a UAE region is advisable for government-sector buyers.

## 18. Performance targets

| Metric | Target | Where |
|---|---|---|
| LCP | ≤ 2.5 s p75 (lab ≤ 2.0 s) | All routes, mobile |
| INP | ≤ 200 ms p75 | All routes |
| CLS | ≤ 0.1 p75 (target ≤ 0.05) | All routes |
| Initial JS (gzip) | ≤ 180 KB home, ≤ 150 KB product, ≤ 110 KB static pages | size-limit in CI |
| 3D chunk (gzip) | ≤ 250 KB, lazy | |
| Scene assets | ≤ 1.5 MB per scene desktop, ≤ 600 KB mobile tier | |
| Hero poster | ≤ 120 KB AVIF | |
| Frame rate | ≥ 55 fps desktop (integrated GPU), ≥ 45 fps mid-tier Android, else auto-fallback | Chapter traces |
| Lighthouse mobile | Perf ≥ 85 (3D routes), ≥ 95 (others); A11y/SEO/Best-practices ≥ 95 | LHCI |

## 19. Testing matrix

| Dimension | Coverage |
|---|---|
| Desktop browsers | Chrome + Edge on Windows 11 (integrated-GPU laptop), Safari macOS, Firefox |
| Mobile | iPhone (current iOS, Safari) + iPhone SE size; mid-tier Android (Pixel 6a / Galaxy A-series, Chrome); low-tier Android (Moto G class) |
| Tablet | iPad Safari (portrait and landscape) |
| Modes | Reduced motion (OS + toggle); WebGL disabled; JS disabled; Save-Data; 4× CPU throttle; Slow 4G; 200% zoom; 320 px reflow |
| AT | Keyboard-only; NVDA + Chrome; VoiceOver iOS; VoiceOver macOS (spot check) |
| Locale | EN; AR/RTL when shipped |
| Automated | Vitest (schemas, state machines); Playwright e2e (nav, deep links, demo steps by keyboard, reduced motion, no-WebGL, contact with mocked API incl. 422/429/503); axe on all routes; Lighthouse CI budgets; size-limit; visual snapshots of chapter final states |

## 20. Verified versions & platform facts

Source: `research/sources/tech-verification.md`. npm registry, PyPI and docs were checked on 2026-10-02.

| Package | Latest stable | Pin / note |
|---|---|---|
| next | 16.3.8 | App Router, `output: 'export'` |
| react / react-dom | 19.3.0 | **Pin 19.3.x**: R3F 9.8.1 peer range is `>=19 <19.4` |
| typescript | 7.0.2 latest | **Use 6.0.3**: typescript-eslint supports TypeScript only below 6.1 |
| three | 0.186.1 | **Pin 0.186.x**: `postprocessing` caps three below 0.187; avoid postprocessing unless needed |
| @react-three/fiber | 9.8.1 | v10 (WebGPU-first) is alpha. Not for v1. |
| @react-three/drei | 10.7.9 | Inline `<View>` + `<View.Port/>`. The `track` prop is deprecated. |
| gsap / @gsap/react | 3.15.0 / 2.1.2 | All plugins free for commercial use since 3.13. The restriction applies only to no-code tools competing with Webflow. |
| zod | 4.6.5 | |
| @gltf-transform/cli / meshoptimizer | 4.5.1 / 1.3.0 | Asset pipeline |
| fastapi / pydantic / slowapi | 0.142.2 / 2.13.5 / 0.1.10 | slowapi + Redis. Key on a **trusted** client IP; don't blindly trust `X-Forwarded-For`. |
| @react-three/a11y | 3.0.0 (May 2022) | **Not used**: unmaintained. DOM equivalents instead. |
| lenis, motion | 1.3.26, 13.5.0 | **Not used** (native scroll; single animation engine) |

**Platform facts that shape the plan:**
- **Static export cannot provide:** middleware/proxy, rewrites, redirects, headers, cookies, Server Actions, ISR, or request-reading route handlers. Redirects, security headers and any locale detection therefore live at the **host/CDN** (DL-T01). `next/image` needs `unoptimized` → our sharp pipeline.
- **i18n/RTL are fully static.** Two root layouts via route groups (`(en)`, `(ar)/ar`) each set `<html lang dir>`. Switching language is a full page load, which is acceptable.
- **Layouts persist across client navigation,** so a canvas in the root layout survives route changes. Scenes must still dispose their own resources on unmount.
- **WebGPU:** the three.js docs still call WebGPURenderer experimental, and Firefox support is incomplete. **Use the WebGLRenderer.**
- **CSS scroll-driven animations:** Chrome/Edge 115+, Safari 26+, Samsung 23+. Firefox stable only behind a flag. Use them only as progressive enhancement inside `@supports (animation-timeline: view())`, with content visible by default.
- **ScrollTrigger 3.15:** `ignoreMobileResize` is on by default for touch-only devices. Size pinned panels with `svh`/`lvh` (Baseline since 2025-06). Refresh after `document.fonts.ready`.
- **Core Web Vitals thresholds:** unchanged (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, p75).
- **Bot protection:** Cloudflare Turnstile (free; server `siteverify`; tokens valid 5 min, single use). hCaptcha is the fallback. Not reCAPTCHA (data to Google; paid beyond 10k/month).
- **UAE PDPL** (Federal Decree-Law 45/2021):
  - In force since 2 Jan 2022.
  - **Executive Regulations still not issued** per law-firm sources (Mar and Jul 2026). Official portals were not reachable to confirm.
  - Mainland Dubai (Business Bay), so the federal PDPL applies, not DIFC/ADGM.
  - Design for consent clarity, purpose limitation, retention limits, notice before collection, a cross-border transfer basis and breach handling. IPs are personal data.
  - Get legal review before launch (DL-T06).
- **Fonts:**
  - Almarai on Google Fonts: weights 300/400/700/800 only. Load 400/700 (+800 for display).
  - Poppins has no Arabic glyphs. Load 400/500/600 (700 only if a display style needs it).
  - `next/font` self-hosts fonts at build time.
