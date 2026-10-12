# Implementation prompt: Meerana website, from prototype to a credible launch build

**To the coding agent.** This prompt is based on an audit of the running site and its repository, done on 2026-10-11. Every finding has an evidence tag:

- **[OBS]**: seen in the browser.
- **[SRC]**: confirmed in source or build output.
- **[HYP]**: likely, but verify before you act on it.
- **[JDG]**: a subjective creative judgement.

Read the whole prompt before you edit anything.

---

## A. Mission and desired outcome

Turn the current Meerana Technologies site into a launch-grade build. A serious enterprise buyer and a technical evaluator should both leave it understanding what Meerana makes and why it can be trusted, and should have a working way to start a conversation. The site today is a well-researched prototype that still *looks* like one: there are internal disclaimers on screen, the logo is a placeholder, the diagrams are faint, generic AI-generated backgrounds sit behind the products, and the main product calls to action lead to a 404.

The quality bar, which must be demonstrable and not a matter of opinion:

1. **Honest.** No visible internal notes, placeholder strings, mislabelled media or unsourced numbers.
2. **Navigable.** Every product and every planned core page is reachable within two interactions from any route. No link returns a 404.
3. **Legible evidence.** Real product screens and diagrams pass contrast checks and sit in their own space, never under a scrim and never behind text.
4. **One system.** Tokens, spacing, breakpoints, buttons, labels and footer are shared and consistent on every route.
5. **Motion that serves.** Each page has one signature motion. No content needs animation in order to be visible. Reduced motion is fully respected. The pinning budget follows the repo's own decisions.
6. **Fast and accessible.** Meet the budgets and WCAG 2.2 AA criteria already written in `plan/13-acceptance-and-launch-checklist.md`.
7. **Distinctive.** A visual language that comes from Meerana's own brand geometry, not from stock "AI" atmosphere.

Do not describe the result as "world-class". Meet the acceptance criteria in section M.

---

## B. Project URL, detected stack, and repository context

- **Local URL:** `http://localhost:4173/`. This serves `out/` through `npx serve out -l 4173` (README "Quick start"). `out/` was current with source at the time of the audit: no source file is newer than `out/index.html` (2026-10-11 18:44) **[SRC]**.
- **Repository:** `C:\Users\abhin\Desktop\meerana`. **It is not a git repository and has no CI** **[SRC]** (`docs/STORY-PAGES-2026-10-11.md` §5 says the same).
- **Stack** **[SRC]**:
  - Next.js 16.4 App Router, static export: `next.config.ts` sets `output: "export"`, `trailingSlash: true` and `images.unoptimized: true`.
  - React 19.3, Tailwind CSS 4.3 via `@tailwindcss/postcss`, TypeScript 6.
  - GSAP 3.15 (ScrollTrigger, SplitText) with `@gsap/react`.
  - three 0.186, @react-three/fiber 9.8 and drei 10.7 for the hero room.
  - `motion` 12 (used only by React Bits CountUp).
  - `ogl` (used only by an unused component).
  - Playwright 1.64 (dev dependency, with screenshot and verify scripts in `scripts/`).
- **Fonts:** Poppins 400/500/600/700 through `next/font/google`, Latin subset (`app/layout.tsx`) **[SRC]**.
- **Key files:**
  - `app/layout.tsx`, `app/page.tsx` (homepage, plus a footer defined inside this file), `app/products/[slug]/page.tsx`.
  - `app/tokens.css` (the only allowed home for raw colour), `app/globals.css`, `app/header.css`, `app/hero.css`, `app/sections.css`, `app/showcase.css`, `app/story.css`.
  - `components/site/Header.tsx`.
  - `components/sections/Hero.tsx`, `Showcase.tsx`, `Sections.tsx` (World, Story, Proof, Cta, plus an unrendered `Products()`).
  - `components/story/Story.tsx`, `BeatVisual.tsx`.
  - `components/room/{Room,RoomClient,RoomBoundary,RoomFallback}.tsx`, `room-layout.ts`.
  - `components/reactbits/*` (16 installed; only SplitText, CountUp and LogoLoop are rendered).
  - Content: `content/products.ts`, `content/showcase.ts`, `content/storyboards.ts`. The same product copy is duplicated across all three.
- **Binding context you must respect.** Read these before designing anything:
  - `docs/OWNER-DECISIONS-2026-10-10.md`: owner rulings. Six products in scope, company facts, no phone number, face-recognition rules.
  - `docs/NEXT-TASK-PROMPT-2026-10-10.md` §2: **copy mandated verbatim.**
    - H1 "We engineer intelligence for the real world."
    - Moments AI → Automation → IoT → Security.
    - "Meerana Intelligence Layer"
    - "Built in the UAE. Engineered for the world."
    - Story steps: Problem → AI detects → Automation acts → Dashboard shows → Business outcome.
    - CTA headline "Together, let's build what comes next."
    - **A net-content rule: do not add homepage content.**
  - `docs/review/m3-2026-10-10/JUDGE-VERDICT.md`: never-claim list, partner wording, rejected proposals.
  - `docs/DEPTH-DIRECTION-2026-10-10.md`, `docs/MOTION-RESEARCH-2026-10-10.md`, `docs/DESIGN-DIRECTIONS.md` (DD-22: solid cards, glass only on the nav; DD-23: pin exception; DD-24: Dynamic Island).
  - `plan/06-sitemap-and-homepage-plan.md`, `plan/08-scroll-animation-spec.md`, `plan/09-design-system.md`, `plan/11-technical-architecture.md` (§15 is the enquiry API contract), `plan/13-acceptance-and-launch-checklist.md`.
  - `.claude/skills/meerana-brand/references/brand-reference.md`: brand colours, product palettes, logo rules.
- **Limitations of this audit.** The agent must close these gaps:
  - The in-app browser pane was hidden for part of the audit, which pauses `requestAnimationFrame`. Long headline delays seen in the pane were an artefact of that and are **not** a site bug. Timing was then re-measured in headless Playwright Chromium, which uses SwiftShader software WebGL. Long-task numbers from that run are inflated, and network timing is localhost-only.
  - Not done: real-device testing, screen-reader testing, Lighthouse runs, a comparison with the live meerana.ae, or a reading of every planning doc.

---

## C. Honest current-state verdict and scorecard

### Verdict

**Is the homepage impressive, or just reasonably styled?** Reasonably styled. The navy palette, the Poppins display H1 and the clean header are competent. Nothing on the page is memorable, and the most expensive element, the WebGL room, reads as a hazy grey collage of screenshots stacked behind the headline **[OBS]**.

**Does it feel distinctive or like a template? Plain, noisy or overdesigned?** It leans template **[JDG]**:
- six product panels built from one identical layout;
- numbered eyebrows ("02 · Products");
- a five-equal-card "how it works";
- a logo marquee;
- AI-generated plexus, fibre-optic, light-trail and empty-office backgrounds, the generic visual vocabulary of "AI company" sites.

It is plain in structure and noisy in atmosphere.

**Does it say what the company does in the first few seconds?** Partly. The lede ("six enterprise products — for AI, automation, IoT and security") is clear. However:
- Only four products are named in the hero.
- The four owner-confirmed service lines (Consulting, Bespoke development, Technology partnerships, Staff augmentation) appear **nowhere on the site**.
- The heading "Intelligence Layer" implies the products are integrated, while its own caption says "each one deploys on its own" **[OBS][SRC]**.

**Does it tell a serious buyer why to trust Meerana?** Not yet. It has real credentials: three recognitions and named partnerships. These are undermined by:
- a footer reading "Prototype · internal design exploration · copy proposed…";
- "Deployment options to be confirmed with your team";
- "As published on meerana.ae (retrieved 2 October 2026)";
- a CSS gradient square instead of the real logo;
- no case studies;
- partner entries such as "SAS — Course provider" next to MoUs;
- a "32 client and partner organisations" counter with no source **[OBS][SRC]**.

**Memorable visual identity?** No. The brand's own signature, the isometric lattice symbol, is absent. The logo is a placeholder (`header.css`, a gradient square plus text) **[SRC]**.

**A coherent story as you scroll?** The skeleton is right: what → who → how → proof → act. The pacing is broken:
- At 1440×900 the product gallery pins for **8,305 px** of a 12,308 px page (about 9 viewports of sideways travel) **[OBS]**.
- After that come a text-heavy "World" section, a separate partner logo strip that overlaps with it, and a call to action that is only a `mailto:`.

**Will visitors explore, make contact or leave?** Explorers are under-served:
- **On desktop, nothing on the homepage links to the Mandoobee or Nazo product pages**, and the product panels do not link to product pages at all **[SRC]**.
- On product pages, both primary calls to action go to `/contact?interest=…`, which **returns a 404** **[SRC]**.
- Everything on the homepage funnels into a `mailto:` link **[SRC]**.

**What creates credibility?**
- the named recognitions (Future 100 selection 2023, Best small enterprise in the UAE 2024, Emirates Labour Market Award 2023);
- the dated partnerships;
- real product screens where they appear (Mandoobee app, Tasree3 Command Center, Yisbir PPE);
- honest provenance labelling as a principle;
- clear one-line product descriptors.

**What undermines it?** Everything listed above, plus faint, overlapping diagrams on product pages and diagrams whose labels belong to another product (section D).

**The single biggest reason it does not feel first-rate:** **There is no proof layer.** The site claims an "ecosystem" and "intelligence", but the evidence a buyer can actually see is small, faint, generically framed or mislabelled, and every path to action ends in a mailto or a 404. That is a content-and-system problem first and a motion problem last.

### Visitor lenses

- **Enterprise buyer** (capability, reliability, delivery). Finds product names and awards. Does **not** find:
  - how Meerana engages (services);
  - who it has delivered for (case studies or permitted client names);
  - who runs the company;
  - what deployment and support look like;
  - a form that captures the enquiry with context.

  The "Prototype" footer alone would end many evaluations.
- **Technical decision-maker** (engineering depth). Finds one "Deploys" line per product. AI in a Box's line literally says "to be confirmed". There are no architecture or deployment diagrams, no integration or API notes, no security or data-residency statement, and the product-page diagrams are ghost wireframes under a scrim **[OBS]**. Nothing demonstrates engineering judgement.

### Scorecard

Subjective, on a 1–10 scale.

| Area | Score | Why |
|---|---|---|
| First impression | 5 | Strong H1 and clean nav. The hero's right half is a muddy panel collage that collides with the H1, and the headline blurs in after it has already been painted. |
| Visual identity | 4 | Correct brand colours, but no real logo and no lattice motif. The AI-generated plates are generic. |
| Typography | 6 | Confident Poppins display and a sensible scale. Little contrast between roles, uppercase tracked labels everywhere, no annotation voice. |
| Layout & composition | 5 | Stacked sections with sound alignment. Six identical panels, large dead zones (after the gallery; the room area on mobile and tablet), and product-page diagrams centred under the text column. |
| Content clarity | 6 | Product one-liners are clear. Company positioning and service lines are missing, and the "Intelligence Layer" message contradicts itself. |
| Credibility | 4 | Real awards and partners, outweighed by internal notes on screen, placeholders, a placeholder logo, an unsourced stat and mislabelled media. |
| Motion & interaction | 4 | A lot of motion with little choreography. The H1 blur-in and the count-ups ignore reduced motion, the gallery pins for about 9 viewports, the marquee has no pause, and keyboard focus is lost inside the pinned track. |
| Mobile | 6 | Clean stacking, a working menu sheet, no horizontal overflow. The WebGL room still loads, five of six products hide in a swipe rail whose hint comes after the first panel, and diagrams become long stacks of pills. |
| Conversion journey | 2 | Product-page CTAs go to a 404, homepage CTAs are mailto-only, there is no form, and two products are unreachable on desktop. |
| Overall execution | 4 | Strong research and rules. The build has drifted from the team's own documented rules (listed in D). |

**An important pattern:** the repo's own docs already forbid much of what the build does:
- split-text on the LCP H1 (MOTION-RESEARCH §A #5);
- animated blur, and headings that depend on animation to be visible (DEPTH-DIRECTION §6);
- count-ups from zero (plan/08 M-home-10);
- pins over 300vh per page and the DD-23 gate of 250vh at ≥1280×760;
- Motion alongside GSAP (DD-03);
- the JS budget of ≤180 KB on the homepage (plan/13 G).

Much of this work is bringing the build back into line with decisions already made.

---

## D. Route inventory and page-specific findings

### Routes

| Route | Status | Purpose today | Proposed role |
|---|---|---|---|
| `/` | Built, has defects | Hero → product gallery → World → How it works → stats → logos → CTA → footer | The front door: orient, prove, route |
| `/products/{mandoobee,tasree3,nazo,yisbir,wasel,ai-in-a-box}/` | Built, thin evidence, broken CTA | 8-beat story pages | Product evaluation and briefing requests |
| `/contact/` | **Missing**, but linked from 12 CTAs | n/a | Enquiry with product context (P0) |
| `/company/` | Missing. Header "Company" points to `/#world` | n/a | Who Meerana is (P1) |
| `/services/` | Missing. Four owner-confirmed service lines are absent from the site | n/a | How to engage (P1) |
| `/privacy/` | Missing | n/a | Required before any form collects data (P1, blocked on legal text) |
| `/products/` | Missing (planned in plan/06) | n/a | Optional product index (P2) |
| 404 | Next.js default: black page, home title, no footer **[OBS]** | n/a | Branded recovery page (P2) |
| `/ar/…` | Not built | n/a | Phase 2, **out of scope** (keep the CSS RTL-ready) |

### Homepage `/`: findings

1. **Footer shows internal disclaimers.** It reads "Prototype · internal design exploration · copy proposed · sample data labelled · background imagery is illustrative" (`app/page.tsx:17-20`) **[OBS][SRC]**. The Proof section shows "As published on meerana.ae (retrieved 2 October 2026)." (`components/sections/Sections.tsx:199`) **[OBS][SRC]**.
2. **AI in a Box placeholder.** "Deployment options to be confirmed with your team" appears in the gallery (`content/showcase.ts:159`, `content/products.ts:117`). Product page: `content/storyboards.ts:752, 770` **[OBS][SRC]**.
3. **Stats row.**
   - `CountUp` from 0 to hard-coded 6 / 4 / 32 (`Sections.tsx:169, 175, 181`).
   - The static HTML ships **empty** values.
   - A capture taken mid-animation showed "5 Enterprise products" and "28", contradicting "six products" for a moment **[OBS]**.
   - "32" has no source in content or in the evidence register **[SRC]**. Its likely origin is the count of logo files.
   - CountUp has no reduced-motion handling **[SRC]**.
   - This breaks plan/08 M-home-10 and DL-C07 (no stats row unless dated figures are confirmed).
4. **Hero H1 animation.**
   - The SSR H1 is painted (LCP ≈ 0.25 s locally). After hydration, SplitText hides the words and re-animates them with `blur(10px)` over about 1.5–3 s **[OBS headless][SRC `Hero.tsx:48-60`]**.
   - **It still animates with `prefers-reduced-motion: reduce`.** Measured: the last word was at opacity 0.50 at 973 ms in a reduced-motion context **[OBS headless]**.
   - It leaves `will-change` set permanently **[SRC]**.
5. **Hero room composition.**
   - At 1440×900 the front panels sit directly behind "for", "the real world." and the lede. Panels are hazed to grey and illegible **[OBS]**.
   - At 768 and 390 the room drops below the CTAs and renders as a near-empty dark block of roughly 300–450 px **[OBS headless, verify on device]**.
   - The room loads on phones: no size gating, `frameloop="always"`, no off-screen pause (`components/room/Room.tsx`) **[SRC]**.
6. **The gallery is a long horizontal pin.**
   - Pinned whenever the viewport is ≥1024 px wide and has a fine pointer (`Showcase.tsx:36-39`).
   - Distance = track width − viewport, about 5 viewport widths (`Showcase.tsx:61-73`).
   - Measured section heights: **8,305 px at 1440×900** and **6,091 px at 1024×768** **[OBS]**.
   - This breaks DD-23 (≤250vh, only at ≥1280×760) and plan/13 D1 (≤300vh per page).
7. **Keyboard focus is lost in the pinned gallery.** At 1440×900, Tab stops 13–21 ("Request a Mandoobee briefing", "Skip Mandoobee", … "Book a Wasel site assessment") land on elements **outside the viewport**, and the page does not scroll to them **[OBS headless]**. This fails WCAG 2.4.11 (focus not obscured) and, in effect, 2.4.7.
8. **Product panels.**
   - All six use one identical layout **[OBS]**.
   - Provenance is rendered twice per panel: next to the CTA, where it reads like a second button, and under the image (`Showcase.tsx:206` and `:224`) **[OBS][SRC]**.
   - **No link to the product page** **[SRC]**.
   - The "Skip X" pills stay visible permanently **[OBS]**.
9. **Two products unreachable on desktop.** Mandoobee and Nazo can only be reached through the mobile menu sheet (shown below 1024 px). The hero moments link only four products (`Hero.tsx:24-29`) **[SRC]**.
10. **Reduced-motion desktop.** The gallery falls back to a single-column rail. The Mandoobee screenshot stretches to about 1184 px and looks soft. The source `public/media/v3/card-mandoobee-app.webp` is 1920×1200, but its phone captures look upscaled inside that canvas **[OBS][HYP on asset source]**.
11. **World section.**
    - The offices card shows hard-coded GMT offsets. London and Egypt show summer offsets that are wrong in winter, and the `tz` field is unused **[SRC]**.
    - The 13-item partnership text list mixes MoUs with "Course provider" and "Integration" entries **[OBS]**.
    - Separately, a 12-logo marquee mixes partners with unlabelled companies (Ruya, Cronos International, Dell, Modon Global, Sabeel Technologies) **[SRC]**. Their client-or-partner status must be confirmed (PROOF-INVENTORY).
12. **LogoLoop** runs a continuous rAF marquee with pause-on-hover only. There is no visible pause control, which fails WCAG 2.2.2 **[SRC]**.
13. **CTA section.** Both buttons are `mailto:info@meerana.ae` ("Talk to Meerana" and "info@meerana.ae"), so they duplicate each other **[SRC]**.
14. **Footer** exists only on `/`, because it is defined inside `app/page.tsx`. It has no navigation, no product links, no privacy link and no "Founded in Dubai in 2022" **[SRC]**.
15. **Console errors.**
    - What happens: every product-link prefetch requests `products/<slug>/__next.products.$d$slug.__PAGE__.txt` and gets 404 (4 per load).
    - Cause: the export writes nested files, `products/<slug>/__next.products/$d$slug/__PAGE__.txt` **[SRC][OBS]**.
    - Root cause unknown. It could be a Next 16.4 export quirk or the static server. Verify on the target host (Apache per plan/11).
    - plan/13 I4 requires zero console errors.

### Product pages `/products/<slug>/`: findings

1. **The primary CTA in the hero and the closing section goes to `/contact?interest=<slug>`**, a route that does not exist (`components/story/Story.tsx:338, 366`) **[SRC]**.
2. **Diagrams sit under the text and under a scrim.**
   - `.stage-mid` centres the visual (`place-items: center`, width `min(46rem, 80vw)`), so at 1440 px it spans about 352–1088 px, across the text column at 128–640 px (`app/story.css:147-169`).
   - The reading-zone scrim then darkens it.
   - The plate image sits at opacity 0.5 behind it.
   - Result: faint, half-covered diagrams. Headings overlap them, as in Yisbir "One frame, four layers." and Mandoobee "Too many tools…" **[OBS][SRC]**.
3. **Labels leak between products.** `BeatVisual.tsx` archetypes fall back to hard-coded labels **[SRC][OBS]**:
   - `Tiles` → "One core", "One record" (lines 206–210), shown on Yisbir and Nazo as "People and place / One core / One record".
   - `Records` → Nazo's "Draft / In review / Approved / Sealed" (line 380), shown on **Yisbir's** search and output beats.
   - `Split` → Tasree3's process chain (lines 142–143), used for Wasel's and Nazo's problem beats.
   - `Flow` → "Intake/Review/Rework/Finance/Approval", reused for Nazo.
4. **Mislabelled provenance.** Six beats are labelled "Product screen · demo data" but render illustrative SVG/DOM diagrams (`content/storyboards.ts:130, 183, 606, 709, 719, 763`) **[SRC]**. This undermines the honesty principle the site depends on (plan/13 E1).
5. **The closing line is templated.** "See {name} on your own process." (`Story.tsx:363`) is wrong for Yisbir (cameras), Wasel (gates) and AI in a Box **[SRC]**.
6. **No footer, no OG image, no real screenshots** in the beats, except as background plates **[SRC]**. Real screens exist in `public/media/v3/` but are not used here.
7. **Background plates.** Generated plexus, fibre-optic and empty-office images dominate the stage, as in AI in a Box's network plate **[OBS]**. **[JDG]** They read as stock "AI" imagery and work against the brand guidance ("glow, glass, metaballs and particles are not the brand").
8. **The closing section overlaps the last stage visual.** Ghost tiles ("01 Every desk", "02 Human decides") show through behind the "NEXT" CTA on AI in a Box **[OBS]**.
9. **Mobile.** The stage is dropped and visuals render inline (good). The Tasree3 split diagram becomes about 14 stacked pills, roughly 900 px tall with little information **[OBS]**.
10. **Before hydration**, every stage visual has `data-no-js` → opacity 0.5. All 8 may overlap at half opacity until JS runs **[HYP: verify with JS disabled]**.
11. Arabic name moments (Tasree3, Yisbir) have no `lang="ar" dir="rtl"` **[SRC]**.

### Global and system findings

- **Dead weight** **[SRC]**:
  - 11 of the 16 React Bits components are unused; FadeContent and SpotlightCard appear only in the unrendered `Products()`.
  - `ogl` is unused, and `motion` exists only for CountUp.
  - Unused CSS: `sections.css:30-158` for `Products()`, `.lit-type`, a duplicate `.sr-only`.
  - A corrupted character at `sections.css:402`.
- **Tailwind scans the whole repo.** The global CSS chunk `out/_next/static/chunks/3w055iqhrno9-.css` is **172 KB** and includes utilities such as `.to-teal-600` that come from `research/` and `prototypes/` **[SRC]**.
- **Payload.** Homepage at 1440: about **3.3 MB decoded across 55 requests**: JS ≈ 1.57 MB decoded (the three.js chunk alone ≈ 928 KB uncompressed), images ≈ 1.24 MB **[OBS headless]**.
  - Both the 1280 and 1920 variants of all six plates downloaded at 1440 **[OBS]**.
  - Compare with the plan/13 budgets: JS ≤180 KB homepage, 3D chunk ≤250 KB. Measure compressed sizes with a proper analyser before judging.
- **Public assets ship unpermitted marks.** Unreferenced logos in `public/media/proof/logos/` include MOHRE, the Ministry of Cabinet Affairs, MOI Dubai Civil Defence, DEWA, GCAA, Emirates NBD and ADIB. **Static export publishes everything in `public/`**, so these are publicly reachable by URL even though unused **[SRC]**. PROOF-INVENTORY flags 11 high-risk marks and 3 state emblems that need permission.
- **No favicon, no OG image, no apple-touch icon** (0 `rel="icon"` in `out/index.html`) **[SRC]**.
- **Inconsistent breakpoints:** 1279 px (hero, sections), 1023/1024 px (header, story, Showcase JS), 767 px, 479 px **[SRC]**.
- **`.story` class collision:** the homepage step grid and the product-page root both use `.story` **[SRC]**. It may leak on client-side navigation **[HYP]**.
- **Mobile menu sheet:** it has `role="dialog" aria-modal="true"` and Escape and the scrim close it (both verified), but **there is no focus trap and focus does not return to the toggle**. The comment at `Header.tsx:15` promises one **[SRC]**. `aria-controls` points to an element that is not in the DOM while the menu is closed **[SRC]**.
- **Raw hex outside tokens** (e.g. `story.css` `#04101f`, `Sections.tsx` `fadeOutColor="#071b36"`, storyboard surface colours), which breaks the rule at `tokens.css:5` **[SRC]**.
- **Token discrepancy to resolve:** DD-14 names `#1B2D46` as the raised navy surface; `tokens.css` defines `--navy-900: #06192e`.

---

## E. Chosen creative direction and rationale

### Options considered

**1. "Isometric Lattice: the operating floor" (recommended)**
- **Core idea:** everything Meerana builds sits on one isometric lattice, the same geometry as the brand symbol. The site is drawn like an engineering elevation: a precise isometric plane, hairline annotations, measured spacing. Real product screens are "installed" on that plane as modules. The hero room becomes the operating floor.
- **Personality:** precise, calm, accountable. Engineered, not decorated.
- **Typography:** Poppins for display and body (brand), plus the **system mono stack** (allowed by DD-06; zero font cost) for annotations, provenance, step indices and spec rows. Use tabular numerals.
- **Colour and surfaces:**
  - Navy base. One solid raised surface for cards (DD-22).
  - Cyan reserved for focus, live states and annotation markers.
  - Product accents only inside product contexts.
  - Replace the AI-generated plates with code-drawn, accent-tinted lattice fields.
- **Graphic language:** isometric line drawings, extending the style of the existing `public/media/v3/wasel-gate-access.svg`, which already speaks it. Diagrams are redrawn in the same line language. No AI imagery.
- **Motion:** "assemble and settle". Elements travel along the lattice axes and snap into place, and lines draw before fills. No blur, float or glow pulses.
- **Engineering competence:** shown through precision, honest spec-style provenance, and per-product deployment diagrams (on-premise / cloud / hybrid nodes) drawn in the lattice.
- **Distinctive because:** it comes from Meerana's own mark and unifies the room, the Wasel illustration and the brand symbol, while competitors default to glows and plexus.
- **Complexity:** moderate. It keeps the WebGL room (an owner ask: "pure 3D page") and the horizontal gallery (the judge rejected cutting it), and removes about 800 KB of plates.

**2. "Evidence theatre"**
Large real product UI on a quiet dark stage, plus documentary photography of deployments.
- Strongest for credibility.
- **Blocked on assets:** clean Tasree3 recaptures (DV-11), Wasel app and controller photos, re-recorded demos.
- Leans toward "replace 3D with product UI", which the judge rejected.
- Treat it as the asset roadmap inside option 1, not as a separate direction.

**3. "Quiet editorial"**
Light, typographic and bilingual-first, close to the archived `prototypes/meerana-m1-quiet-futurist.html`.
- Excellent for the Arabic phase.
- Conflicts with the owner's 3D/dark asks.
- Already explored.

### Recommendation: option 1

It fixes the root problems (generic atmosphere, no identity, illegible evidence) using assets and code the repo already has. It respects every binding decision: mandated copy, 3D, horizontal gallery, solid cards, no AI imagery as evidence, and the lattice motif used at most once per viewport (plan/09 §6). It also makes accuracy visible: the annotation system *is* the provenance system.

---

## F. Shared design-system specification

Build these foundations **before** restyling pages.

1. **Tokens** (`app/tokens.css`, the only place raw colour lives)
   - Keep the existing brand, product and semantic tokens.
   - Add:
     - `--surface-raised` (resolve `#1B2D46` from DD-14 against the current `--navy-900`) for solid cards;
     - `--surface-sunken: var(--navy-950)`;
     - `--annotation: var(--meerana-cyan)`;
     - `--font-mono: ui-monospace, "Cascadia Mono", "Segoe UI Mono", "SF Mono", Menlo, Consolas, monospace`.
   - Lattice tokens:
     - `--lattice-cell: 56px` (reuse the existing grid cell);
     - `--lattice-line: rgba(255,255,255,.06)`;
     - `--lattice-line-strong: rgba(255,255,255,.12)`;
     - an isometric angle of 30°.
   - Motion: keep 100/160/240/420 ms and `--ease-standard (.2,0,0,1)`, `--ease-enter (0,0,0,1)`, `--ease-exit (.3,0,1,1)`. Add `--dur-signature: 720ms`, used **only** by each page's single signature motion.
   - Move every raw hex found in section D into tokens.
2. **Breakpoints**
   - Standardise on **480 / 768 / 1024 / 1280** (`min-width`, mobile-first).
   - Export the same numbers from one TS module (e.g. `lib/breakpoints.ts`) for any JS `matchMedia` call.
   - Remove the 1279 / 1023 / 767 / 479 drift.
3. **Type roles**
   - Keep the scale in `tokens.css`. Define roles:
     - Display (H1 and CTA headline only);
     - H2 for section titles;
     - H3;
     - Lede;
     - Body;
     - **Annotation** (mono, 12–13 px, uppercase optional, tracking .04em) for provenance, indices and spec labels;
     - Label (Poppins 600) only for UI labels.
   - Use tabular numerals for every number.
   - **Open decision:** JUDGE §3g specifies Poppins 300 for the H1 and CTA headline, but the build uses a heavy weight and does not load 300. Test both over the redesigned hero and ask the owner. Do not change it silently.
4. **Shared components.** Create them in `components/ui/` or similar; reuse what exists.
   - `Button`: primary, ghost, and text-with-arrow variants. ≥44 px targets, a single focus style.
   - `ProvenanceLabel`: mono annotation, exactly **one** per media item, with a controlled vocabulary: "Product screen · demo data", "App mock-up", "Design concept · sample data", "Illustrative diagram", "Illustration". Type it as a union so a mislabel fails typecheck where possible.
   - `SectionHeader`: index annotation, H2, optional caption.
   - `ScreenFrame`: a hairline frame for real product screens. Images are never displayed above intrinsic resolution: set `max-width` to the intrinsic width and give explicit `width`/`height`.
   - `LatticeField`: an SVG/CSS isometric plane, tinted by `--p-accent` at 6–10% alpha, fading with depth, `aria-hidden`. **One per viewport.**
   - `SpecList`: key/value rows for Deploys, Languages, Interfaces and similar facts.
   - `SiteFooter`: shared, rendered from `app/layout.tsx`.
   - `ContactForm`: see section I.
   - `NotFound`: `app/not-found.tsx`.
5. **Content model**
   - Merge the duplicated product copy in `content/products.ts`, `showcase.ts` and `storyboards.ts` into one typed source of truth per product.
   - Fields: slug, name, descriptor, oneLiner, capabilities[3], deploy (optional; **omit when unconfirmed, never write "to be confirmed"**), accent, closingLine, interestEnum, screens[] (src, w, h, provenance), and beats[] with explicit visual data.
6. **Surfaces and depth rules** (section 5 of the brief, applied)
   - Keep the global grade stack (mesh, grid, vignette, grain): it is subtle and correct.
   - Remove competing image plates.
   - Cards are solid `--surface-raised` with a 1px `--line` border and a single shadow token. Glass is used only on the condensed header and the menu sheet (DD-22).
   - Text never sits on an image or diagram. Copy and media occupy separate grid columns at ≥1024 px, and stack below that.
   - Section transitions use a tonal step (base → sunken → base) and a lattice horizon line, not just hairlines, so the page stops reading as one undifferentiated navy wash **[JDG]**.

---

## G. Component-by-component changes

Each component gets: **verdict** · what exists · what works · what's weak and why it matters · the change · desktop/mobile behaviour · files.

1. **Header** (`components/site/Header.tsx`, `app/header.css`). **Refine.**
   - **Works:** fixed, condenses after 80 px, skip link, visible cyan focus ring, mobile sheet listing all six products.
   - **Weak:**
     - placeholder logo (gradient square plus text);
     - desktop has no product access, so two products are unreachable;
     - "Company" goes to an anchor;
     - no focus trap in the sheet.
   - **Change:**
     - Use the official logo raster through the DD-09 CSS mask in exact `#0D3BFF`, or a white-on-navy lockup, until vector masters arrive. Never trace or recolour it.
     - Desktop "Products" becomes a button that opens a compact **router panel** (plan/06 §3; not a mega-menu): six rows, each with name, descriptor and accent tick, linking to `/products/<slug>/`, plus "All products". Keyboard: Enter/Space opens it, arrows move, Escape closes it and returns focus.
     - Links become Products ▾ · Services · Company · [Talk to Meerana → `/contact/`].
     - Add a focus trap and focus return to the mobile sheet. Render the sheet hidden rather than unmounted, so `aria-controls` resolves, or drop `aria-controls`.
     - **Dynamic Island** (DD-24) is P3. Do it only after the foundations, and keep DD-24's constraints.
   - **Mobile:** keep the current sheet layout and fix the "01 Mandoobee" spacing inconsistency **[OBS]**.

2. **Hero copy** (`components/sections/Hero.tsx`). **Refine. The copy is mandated; do not rewrite it.**
   - **Change:**
     - Remove SplitText from the H1. Render a plain `<h1>`, visible at first paint.
     - Optional entrance on the *lede, moments and CTAs only*: opacity 0→1 and y 8→0, 420 ms, 60 ms stagger, starting after first paint. **Never animate blur**, and never animate the H1.
     - Moments stay as links. Add a fifth affordance, "All six products →", to the router or `#products`. This is a link, not new content.
   - **Mobile:** unchanged structure. Verify that the H1 is 3 lines or fewer, as `scripts/verify-page1.mjs` already checks.

3. **Hero room** (`components/room/*`, `app/hero.css`). **Refine.**
   - **Works:** a real Z-depth cue, haze by depth, a capped parallax of 4°, a fallback, an error boundary, a reduced-motion static mode.
   - **Weak:**
     - it collides with the H1 and lede;
     - its panels are uniformly grey and illegible, so it shows "screenshots" without showing products;
     - 8 panels where the docs say 7;
     - it renders on phones and keeps rendering off-screen.
   - **Change:**
     - At ≥1280 px, constrain the room's projected bounds to the right side, so **no panel overlaps the H1, lede or moments bounding boxes**. Check with a screenshot-overlay test.
     - Reduce to 5–6 panels. Render the nearest 2 at near-full legibility (they are the evidence); the rest haze progressively.
     - Re-skin the floor as the isometric `LatticeField`, replacing the `gridHelper` look.
     - Pause rendering when the hero leaves the viewport (IntersectionObserver → `frameloop="demand"`) and when the tab is hidden.
     - **Below 768 px, or with `navigator.connection.saveData` or `deviceMemory` ≤ 4, do not load the three.js chunk at all.** Show `RoomFallback`, re-composed as a single legible ScreenFrame of one product screen, ≤120 KB poster (plan/13 G).
     - Remove the dead block below the CTAs on tablet and mobile.
     - Shadow map 2048² → 1024² unless the difference is visible.
   - **Desktop:** room right, copy left. **Tablet:** a single framed screen below the CTAs, at most 40svh. **Mobile:** the same, or omit it.

4. **Gallery section header** (`Showcase.tsx:129`, "02 · Products"). **Refine.**
   - Keep "Meerana Intelligence Layer" and the caption "Six products. Each one deploys on its own." (mandated; J5).
   - Fix the numbering: either annotate the hero as 01 or drop numeric indices. Increase the vertical rhythm so the header isn't stranded above an empty band.
   - **Flag to the owner:** the register marks "Intelligence Layer" as do-not-use (EV-473), yet it is mandated copy. Do not change it.

5. **Gallery panels** (`components/sections/Showcase.tsx`, `app/showcase.css`). **Refine. Keep the horizontal gallery.**
   - **Change:**
     - **Pin budget:** pin only at ≥1280×760 with a fine pointer and no reduced motion. Total pinned distance ≤ **250vh**. Panels are about 72vw wide with the next one peeking (this shortens travel). Snap per card. Inactive cards sit at opacity 0.35, never 0 (DD-23).
     - Below that size, or under reduced motion: a native `scroll-snap-type: x mandatory` rail with **visible prev/next buttons**, a "1 / 6" counter (`aria-live="polite"`), and the swipe hint **above** the rail.
     - **Keyboard:** on `focusin` inside a panel while pinned, scroll the window to that panel's snap position. Compute it from the ScrollTrigger start + index × step, and make sure a focused element is never off-screen. Keep skip links visually hidden until focused.
     - Each panel gets a secondary link, "Explore {name} →" to `/products/<slug>/`. The primary CTA becomes "Request a {name} briefing" → `/contact/?interest=<slug>`.
     - Render provenance **once**, under the image.
     - Remove the per-panel AI plates. Use `LatticeField` tinted by the product accent instead.
     - Vary composition by product type so six panels don't read as one template **[JDG]**:
       - app products (Mandoobee) get a phone pair;
       - dashboard products (Tasree3, Yisbir) get a wide screen;
       - document products (Nazo) get a document-plus-panel composition;
       - hardware-plus-app products (Wasel) get the isometric illustration;
       - agent products (AI in a Box) get the agent matrix.

       Each panel uses the same grid with a different media slot.
     - Screens are never upscaled beyond intrinsic size, and soft assets are replaced (section N).
     - AI in a Box: **omit the Deploys row** until it is confirmed.
   - **Mobile:** a rail with buttons, a counter and the hint above. Each card shows name, descriptor, one-liner, primary CTA, "Explore" link and the screen. Capabilities collapse to 3 short lines.

6. **World: "Built in the UAE. Engineered for the world."** (`Sections.tsx`). **Refine.**
   - **Change:**
     - **Offices:** city plus country and no GMT offsets, or compute the local time with `Intl.DateTimeFormat`, which handles DST. London is kept per owner decision (it is risk-flagged; see N).
     - **Recognition:** keep the three items with exact verified wording (Future 100 is a "selection"). Add award thumbnails only once certificates are confirmed (`public/media/proof/awards/` exists but is unverified).
     - **Partnerships:** merge with the Proof strip into **one** partners block. Logos and one dated line each for the verified partners in JUDGE §4a wording: Software AG 2022, Commvault 2024, FPT 2024, CyberHive 2025, Botminds, "Supported by Dubai Chambers".
     - Move Kofax, AgilePoint, Confluent, SAP, SAS, Sprinklr and Zing HR to "Technology we work with" **only if the owner confirms the relationship**. Otherwise remove the "Course provider" and "Integration" entries.
     - This consolidation *reduces* content (net-content rule).
   - **Desktop:** two columns, Offices card and Recognition. Partners grid below. **Mobile:** stacked, with partners as a 2-column logo grid.

7. **How it works: "From problem to business outcome."** (`Sections.tsx` Story). **Refine. The steps are mandated.**
   - **Change:** make it one connected sequence instead of five equal cards. A horizontal (desktop) or vertical (mobile) lattice path links the five steps. Pair steps 02–04 with **existing real Yisbir screens**:
     - `public/media/v3/wall-11-yisbir-fire-smoke.webp` (AI detects);
     - `wall-15-yisbir-alerts.webp` (Automation acts);
     - `wall-01-yisbir-ppe-compliance.webp` or the classroom heatmap (Dashboard shows).

     Each carries its own ProvenanceLabel. Keep "Sample scenario · illustrative data". No cross-product claim (DD-20).
   - **Desktop:** a sticky media column on the right that swaps images as each step enters (CSS sticky, no pin). **Mobile:** each step with its image inline.

8. **Stats row** (`Sections.tsx:166-183`). **Remove** for now (DL-C07, M-home-10). If the owner confirms dated figures, reintroduce them as **static, server-rendered** numbers (for example "Founded in Dubai · 2022", "6 products", "4 offices") with no counting animation. Delete "32" unless it is sourced.

9. **Proof logo strip** (`Sections.tsx` Proof, `LogoLoop`). **Replace** with the merged partners block from item 6. If any marquee survives, it must have a visible Pause/Play button (WCAG 2.2.2) and must be static under reduced motion. Remove the visible "retrieved…" line; keep provenance in code comments or docs.

10. **CTA section** (`Sections.tsx:220-239`). **Refine.** Keep the headline (mandated). Primary "Talk to Meerana" → `/contact/`. Secondary: the email address as a plain `mailto:` text link with a copy-to-clipboard button. Optionally add a one-line expectation, but only if the owner supplies it (e.g. response time). Don't invent one.

11. **Footer.** **Build**, shared through `app/layout.tsx`. Contents (plan/06):
    - logo;
    - "Meerana Technologies LLC · #1704, Blue Bay Tower, Business Bay, Dubai, UAE";
    - info@meerana.ae;
    - "Founded in Dubai in 2022";
    - columns for Products (6), Company (Company, Services, Contact) and Legal (Privacy);
    - verified social links only (EV-021 is unverified, so omit them until supplied);
    - ©.

    **Remove the prototype disclaimer** from the public build. If internal review builds need it, gate it behind `NEXT_PUBLIC_PROTOTYPE_BANNER=1`, defaulting to off.

12. **Product page hero** (`Story.tsx` StoryHero). **Refine.** Keep the strong H1s. Fix the CTA route. Add `lang="ar" dir="rtl"` to the Arabic name moments. Replace the plate with `LatticeField` plus one hero ScreenFrame of a real product screen where one exists (Tasree3, Yisbir, Mandoobee, Nazo, AI in a Box). Wasel uses its isometric SVG.

13. **Story stage and beats** (`Story.tsx`, `app/story.css`). **Refine.**
    - At ≥1024 px use a **12-column grid**: copy in columns 1–5, the stage visual in columns 7–12. Remove `place-items:center` across the full width and remove the scrim over the visual.
    - Visuals are full-opacity when active.
    - Inactive visuals are hidden (`visibility:hidden` after the fade) so they never ghost behind other content. This fixes the CTA overlap.
    - Cross-fade 420 ms (`--ease-standard`) with y 12→0; down from 620 ms.
    - The Interface beat shows a **real screen** in ScreenFrame. Other beats use diagrams.
    - Keep the progress rail, and make it keyboard-navigable as a list of in-page links.
    - Before hydration, show only the first visual. Fix the `data-no-js` rule so the visuals don't stack.

14. **BeatVisual archetypes** (`components/story/BeatVisual.tsx`). **Refine.**
    - **Delete every hard-coded fallback label.** Each archetype must receive explicit data from the beat. If data is missing, throw in development and render nothing in production.
    - Redraw the archetypes in the isometric line language.
    - Labels inside diagrams must reach ≥4.5:1 contrast.
    - Wasel and Nazo problem beats get product-true content: for Wasel, "gate offline / internet down → Bluetooth fallback"; for Nazo, "version signed vs version approved".
    - Fix the six mislabelled provenance strings to "Illustrative diagram".
    - On mobile, cap any diagram at about 1.2 viewports in height. Convert long pill stacks into a compact two-column comparison or a horizontal mini-rail.

15. **Story close** (`Story.tsx:360-370`). **Refine.** Add a per-product `closingLine` field. Provisional examples, **labelled PROVISIONAL and needing owner approval**:
    - Yisbir: "See Yisbir on your own cameras."
    - Wasel: "See Wasel on your own gates."
    - AI in a Box: "See AI in a Box on your own documents."

    Keep "All six products" → `/#products` (or `/products/` if built). Add the shared footer below.

16. **404** (`app/not-found.tsx`). **Build:** a branded page with the H1 "This page doesn't exist.", links to the six products, Contact and Home, the shared header and footer, and a correct `<title>`.

17. **Skip links** (global and per panel). Keep them. Per-panel skip links stay visually hidden until focused.

---

## H. Landing-page redesign specification

The goal is re-composition, not new content. The order below is recommended. **Confirm with the owner**, because it changes the M3 default order (Hero, Showcase, World, Story, Proof, CTA).

| # | Section | Viewport budget (1440×900) | Notes |
|---|---|---|---|
| 1 | Hero | 1.0 | Static H1 at first paint; room on the right with no overlap; moments plus an "All six products" link; two CTAs. |
| 2 | Meerana Intelligence Layer (gallery) | ≤ 2.5 pinned, plus 0.5 header | DD-23 pin at ≥1280×760 only, otherwise a rail with buttons. Panels link to product pages. |
| 3 | From problem to business outcome | ~1.5 | A connected sequence with real Yisbir screens and a sticky media column. |
| 4 | Built in the UAE. Engineered for the world. | ~1.5 | Offices, recognition, merged partners block. |
| 5 | Together, let's build what comes next. | ~0.7 | Primary → `/contact/`; email secondary. |
| 6 | Footer | ~0.4 | Shared. |

- **Target:** about 8 viewports on desktop (from about 13.7 today). On mobile, ≤ about 9 screens (7,325 px today at 390×844 should go down once the room block and stats are removed).
- **Rhythm:** sections use `padding-block: clamp(var(--sp-8), 10vw, var(--sp-10))`. Use one tonal step: section 3 on `--surface-sunken`, with a lattice horizon line at its top edge.
- **Focal points per viewport:** exactly one dominant element (the H1, the active product screen, the active scenario screen, the recognition list, the CTA headline).

---

## I. Plans for empty and incomplete pages

Mark all provisional copy as `{/* PROVISIONAL – owner approval required */}` in code and list it in your report. **Never invent clients, testimonials, certifications, metrics, team bios or years.**

### `/contact/` (P0: build now)
- **Role:** the destination of every enquiry CTA (12 product-page CTAs, six gallery CTAs, header, closing CTA).
- **Sections:**
  1. H1, plus one line (provisional: "Tell us what you want to see. We'll reply from info@meerana.ae.").
  2. Form. Fields per plan/06 H11 and plan/11 §15:
     - Name;
     - Work email;
     - Company;
     - Interest (enum preselected from `?interest=`, including `nazo` and `ai-in-a-box` per JUDGE J7, plus Services/Other);
     - Message (20–4000 characters);
     - privacy acknowledgement;
     - honeypot `website`;
     - `elapsed_ms`;
     - Turnstile once DL-T05 is decided.
  3. A direct-contact block: email and the address. **No phone number** (owner decision).
  4. Offices (static; no map embed).
- **Behaviour:**
  - Client-side validation with inline errors linked through `aria-describedby`.
  - A submit button in a loading state.
  - A status region with `role="status"` / `aria-live`.
  - Handle 202/409/422/429/503 per plan/11 §15, with the email fallback on 503.
  - **No animation on form fields** (M-home-11).
- **Blocked:** the API host (DL-T04), Turnstile (DL-T05), retention and privacy text (DL-T06). **Until these are unblocked**, ship the page with the form hidden behind a feature flag. The primary action is then `mailto:info@meerana.ae?subject=<Product>%20briefing%20request` (product name only in the subject, no personal data) plus a copy-email button. The `?interest=` preselect still drives the subject.
- **CTAs:** primary is "Send enquiry" (or the mailto fallback); secondary is "Explore the products".

### `/company/` (P1)
- **Role:** the "who" for buyers.
- **Sections** (plan/06 §6):
  1. About: founded in Dubai in 2022 (EV-020, verified). Mission is a placeholder (EV-011 unverified).
  2. Offices (Dubai HQ, London, Egypt, Chennai; risk notes in N).
  3. Recognition.
  4. Partners (the merged block).
  5. Events: GITEX 2022 and 2024, Dubai Business Forum USA 2025, the Vietnam/Jakarta trade mission 2024 (use-with-edit).
  6. In the news (EV-514 press list).
  7. Dubai Chambers feature video (EV-022). Lazy, poster first, user-initiated.
  8. Leadership **only with consent** (EV-013).
- **Primary CTA:** Talk to Meerana. **Secondary:** Services.
- Point the header "Company" link here, and redirect `/#world` links where appropriate.

### `/services/` (P1)
- **Role:** how to engage. These are owner-confirmed lines that currently appear nowhere.
- **Sections:** four anchored blocks (`#consulting`, `#bespoke-development`, `#partnerships`, `#staff-augmentation`). Each has a two-line description, three capabilities, related products, and a CTA to `/contact/?interest=services-<line>`.
- **Dependency:** owner-approved descriptions. Draft provisional text and label it.

### `/privacy/` (P1, blocked)
- Page structure and route only. **Do not write legal text.** It must exist, with owner-supplied text, before the form is enabled (UAE PDPL; DL-T06).

### `/products/` (P2, optional)
- A product index: six rows (not an identical card grid, which DESIGN-DIRECTIONS rejected), each with name, descriptor, one-liner, deploy line (if confirmed), a ScreenFrame thumbnail, and a link.
- Header "Products ▾" → "All products" goes here.

### 404 (P2)
See G-16.

---

## J. Motion and transition specification

**Library rule:** GSAP plus ScrollTrigger and CSS only.
- Remove the `motion` dependency, with CountUp, once the stats row is gone.
- No Lenis or ScrollSmoother, no scroll hijacking, no custom cursor.
- Every timeline is created inside `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` condition.
- Under reduced motion, everything renders in its final state.

| # | Element / route | Purpose | Trigger | Properties: from → to | Duration · stagger · easing | Replay | Mobile | Reduced motion | Risk / notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Signature: lattice assembly**, `/` hero floor | Brand imprint | First load, after first paint (idle callback) | SVG lattice lines `stroke-dashoffset` 100%→0; floor opacity 0→1 | 720 ms · 30 ms per line group · `--ease-enter` | Once per session (`sessionStorage`, in a try/catch) | Static lattice | Static, final state | Keep the SVG under ~150 paths. Must not delay H1 paint or LCP. |
| 2 | Hero lede, moments, CTAs, `/` | Settle the reading order | After first paint | opacity 0→1, y 8→0 | 420 ms · 60 ms · `--ease-standard` | Once | Same | None | The **H1 is never animated**. |
| 3 | Room panels, `/` | Depth | Room ready | Existing settle in depth order; parallax ≤4° | Existing | n/a | Not loaded below 768 px | Static (existing) | Pause off-screen and when the tab is hidden. |
| 4 | Gallery track, `/` ≥1280×760 | Browse six products | Scroll (pin) | `x` of the track, scrub 0.5; snap per card | ≤250vh total · snap 240 ms `--ease-standard` | Scrubbed | Native snap rail + buttons | Native snap rail | Focus sync (G-5). Measure that pin distance ≤ 2.5 × innerHeight. |
| 5 | Gallery screen tilt, `/` | Ties the gallery to the 3D language | Card becomes active | `rotateY` 6°→0°, `translateZ` −20→0; inactive opacity 0.35↔1 | 420 ms · `--ease-standard` | On each activation | No tilt; opacity only | No tilt, opacity 1 | Use `transform` and `opacity` only. |
| 6 | Scenario steps, `/#how` | Show cause → effect | Each step crosses 50% of the viewport | Sticky media swap: opacity 0→1, y 12→0; lattice path `stroke-dashoffset` advances by step | 420 ms · `--ease-standard` | Reversible | Inline images, no swap; the path draws once on entry | Static: all images shown inline | No pin; CSS sticky only. |
| 7 | Section headers (H2), all routes | Gentle entry | Enters at 85% of the viewport | opacity 0.001→1 is **not allowed**; the heading stays visible and only the index annotation slides x −8→0 | 240 ms · `--ease-enter` | Once | Same | None | Headings never depend on animation (DEPTH-DIRECTION §6). |
| 8 | Buttons | Feedback | hover / focus / active | Background tint; arrow x 0→3 px; active scale .98 | 160 ms · `--ease-standard` | n/a | Active state only | Colour change only | n/a |
| 9 | Header condense | Context | `scrollY` > 80 | Background and blur (existing) | 240 ms | n/a | Same | Same, no transition | n/a |
| 10 | Router panel / mobile sheet | Navigation | Open / close | opacity 0→1, y −6→0 (panel); sheet y 12→0 | 240 ms open / 160 ms close · enter / exit easing | n/a | Sheet | Instant | Focus management is mandatory. |
| 11 | Product-page stage visual | Beat change | Active beat changes | Cross-fade: opacity, y 12→0; diagram lines draw once per activation | 420 ms; line draw 600 ms · 40 ms node stagger | Line draw once per beat per visit | Inline, static | Static | `visibility:hidden` after fade-out to stop ghosting. |
| 12 | Product-page plate parallax | Depth | Scroll | The existing 0.14 / 0.38 rates apply to the **LatticeField** that replaces the plate | Scrub ≤0.5 | Scrubbed | None | None | n/a |
| 13 | Route change, home ↔ product | Continuity | Navigation | **Optional, P3:** evaluate React `<ViewTransition>` / Next `experimental.viewTransition` for a 240 ms cross-fade of `<main>` | 240 ms | n/a | Same | Disabled | **[HYP]** Skip it if it needs unstable flags or causes layout jank in Next 16.4. |
| 14 | Contact form | Status | Submit result | **No field animation.** The status message appears; focus moves to the message | n/a | n/a | Same | Same | M-home-11. |

**Explicitly removed:**
- the H1 SplitText blur;
- CountUp;
- the LogoLoop marquee (or it gets a pause control);
- the long homepage pin;
- the ghost overlays.

**With animation disabled, the site must look finished:**
- every heading and screen is visible in its final position;
- the gallery is a usable rail with buttons;
- the scenario shows all five steps with images;
- product pages show every beat statically.

---

## K. Responsive, accessibility, and performance requirements

- **Viewports to verify:** 390×844, 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080. Also check reflow at 320 px and 200% zoom. No horizontal page overflow at any width (the gallery rail scrolls inside its own container).
- **WCAG 2.2 AA** (plan/13 F2):
  - text contrast ≥4.5:1 (≥3:1 for large text and UI boundaries), including labels **inside diagrams**;
  - focus visible and **not obscured**: in the pinned gallery, and under the fixed header (add `scroll-padding-top` equal to the header height);
  - targets ≥44 px (repo standard);
  - pause/stop for any motion over 5 s;
  - one H1 per page;
  - landmarks (`header`, `nav`, `main`, `footer`);
  - `lang` on Arabic text;
  - menu and router focus management.
  - axe: 0 serious or critical issues.
- **Reduced motion:** see section J. **Reduced transparency:** keep the existing handling.
- **No-JS:** the H1, copy and the first product panel are readable. Product pages show the first visual only (plan/13 C2).
- **Performance** (plan/13 G; measure compressed):
  - LCP ≤2.5 s and CLS ≤0.1 on mobile Lighthouse at default throttling.
  - JS ≤180 KB on the homepage, excluding the lazy 3D chunk. The 3D chunk ≤250 KB, never requested below 768 px or with Save-Data.
  - Hero poster ≤120 KB.
  - Fix Tailwind scanning so the global CSS is well under the current 172 KB: in `app/globals.css` use `@import "tailwindcss" source(none);` plus `@source "../app"; @source "../components"; @source "../content";`, or `@source not` for `research/`, `prototypes/`, `docs/`, `media-src/`. Verify the syntax against Tailwind 4.3.
  - Only one size of each image should load per viewport: fix `srcset`/`sizes`, and lazy-load panels after the first two.
  - Remove the unused dependencies (`ogl`, `motion`) and the unused React Bits sources.
  - Remove unreferenced files from `public/`. **The unpermitted government and client marks must leave `public/` entirely**; move them to a non-deployed folder.
- **Console:** 0 errors on every route. Resolve the RSC prefetch 404s and verify on the target static host. Options: fix the host's path mapping, or set `prefetch={false}` on product `<Link>`s if the export's nested files can't be served. Document the root cause.
- **SEO** (plan/13 I1):
  - unique titles and descriptions per route (product pages already have them);
  - a full OpenGraph object per route, including `siteName` and `locale` (product pages currently replace the root object);
  - OG images (one site-wide plus one per product);
  - favicon and apple-touch icon, from the official logo only;
  - `sitemap.xml` and `robots.txt`, generated at build;
  - Organization JSON-LD with **verified fields only** (name, url, email, address, founding year 2022).

---

## L. Implementation order and dependencies

**Phase 0: Safety (do first).**
- Ask the owner to approve `git init` plus an initial commit, so each phase can be reviewed and reverted. Do not proceed with destructive edits without version control or a full backup.
- Run the existing `scripts/verify-*.mjs` and `scripts/shoot.mjs` to record a baseline, and save the output under `docs/review/<date>/baseline/`.

**Phase 1: P0 correctness and honesty.** About 1–2 days; no design dependencies.
1. Build `/contact/` with the mailto fallback (form behind a flag). Fix every `/contact?interest=` link to `/contact/?interest=`.
2. Remove the prototype footer text (env-flagged), the "retrieved…" line, and all "to be confirmed" strings (omit the field instead).
3. Fix the six mislabelled provenance strings. Remove the duplicate gallery provenance. Delete the BeatVisual fallback labels and supply explicit data per beat.
4. Remove the stats row and CountUp.
5. Remove SplitText from the H1.
6. Add keyboard focus sync for the pinned gallery, or temporarily switch the gallery to the rail at all sizes until Phase 4.
7. Add a focus trap and focus return to the mobile sheet.
8. Pause control for the logo marquee, or make it static.
9. Remove the unpermitted marks from `public/`.

**Phase 2: Foundations (P2 system work, done first because pages depend on it).**
- Tokens; breakpoints module; type roles including the mono annotation; the shared components (Button, ProvenanceLabel, SectionHeader, ScreenFrame, LatticeField, SpecList, SiteFooter).
- Single-source content model.
- Tailwind sources; dead code and dependency removal.
- Footer moved to the layout.
- `not-found.tsx`.

**Phase 3: Navigation and journey (P1).**
- Header with the official logo raster and the desktop router panel; header links to Services, Company and Contact.
- Gallery panels link to product pages.
- `/company/` and `/services/` with labelled provisional copy.
- `/privacy/` route shell, unlinked until its text arrives.

**Phase 4: Homepage re-composition (P1/P2).**
- Hero room bounds, legibility, mobile gating and off-screen pause.
- Gallery pin budget, rail with buttons, composition variants, LatticeField replacing the plates.
- Scenario section with real Yisbir screens.
- World section consolidation.
- CTA re-wiring.
- Section order change **only after owner confirmation**.

**Phase 5: Product pages (P1/P2).**
- Grid split (no overlap, no scrim over visuals); visibility fix for ghosting; real screens in the Interface beats.
- Archetypes redrawn in the lattice line language.
- Mobile diagram caps; per-product closing lines; footer; Arabic `lang`.

**Phase 6: Motion (P3).**
- Signature lattice assembly, gallery tilt, scenario path, product-page line draws.
- Optional Dynamic Island (DD-24) and route transitions.

**Phase 7: Performance, SEO and launch checks.**
- Budgets, srcset, room chunk, OG images, favicon, sitemap, robots, JSON-LD, console clean-up, Lighthouse, axe.

**Running in parallel:**
- Owner and content requests (section N): send them at the start of Phase 1.
- Phase 3 page shells can proceed alongside Phase 2.
- Asset recaptures (Tasree3, Wasel, Mandoobee native-resolution captures) can arrive at any time and be dropped into ScreenFrame.

**Blocked:**
- The form going live (API host, Turnstile, privacy text).
- Logo vectors, favicon quality and the OG image look (vector masters).
- Partner and client logos (permissions).
- The AI in a Box deploy row and public name.
- Company leadership and mission.
- Case studies (none exist).

**Wait:**
- Dynamic Island and route transitions, until Phases 1–5 pass acceptance.

**Do not build:**
- testimonials;
- a stats counter;
- a globe or world map;
- FAQ, trust page or mega-menu (rejected);
- a language switch before the Arabic launch;
- a custom cursor;
- smooth-scroll libraries;
- any AI-generated product imagery.

---

## M. Acceptance criteria and testing checklist

Extend the existing Playwright scripts (`scripts/verify-page1.mjs`, `verify-pages.mjs`, `verify-showcase.mjs`, `verify-story.mjs`) instead of writing new harnesses where possible. Each item below must be observable.

**Honesty and content**
- [ ] `out/` contains none of: "Prototype · internal", "retrieved 2 October", "to be confirmed", "being confirmed". Check with a grep across `out/**/*.html` and `*.txt`.
- [ ] Every beat whose visual is a diagram is labelled "Illustrative diagram". A test maps `VISUAL_MAP` archetypes to the allowed provenance values.
- [ ] No BeatVisual renders a label that isn't present in that product's content data. Unit-test each slug.
- [ ] The rendered homepage has no stats counters, and no number appears that lacks a source in the evidence register.

**Navigation and links**
- [ ] A link checker crawls `out/` and finds 0 internal links that resolve to a missing file, including `/contact/?interest=*`, which must resolve to `/contact/index.html`.
- [ ] At 1440×900, all six product pages are reachable from `/` in ≤2 interactions (router panel or gallery "Explore" links).
- [ ] The header links resolve: Products router, `/services/`, `/company/`, `/contact/`.
- [ ] Every route renders the shared footer.

**Accessibility**
- [ ] With reduced motion: the H1's computed `opacity` is 1 and its `transform` is `none` at DOMContentLoaded and at every 100 ms sample up to 3 s. The gallery is a rail. No element animates transform or opacity. This can be checked with a MutationObserver on inline styles.
- [ ] Keyboard: at 1440×900 and 1024×768, after each of the first 40 Tab presses on `/`, `document.activeElement.getBoundingClientRect()` lies fully inside the viewport and below the header.
- [ ] Mobile sheet and desktop router panel: focus moves inside on open, Tab cycles within, and Escape closes and returns focus to the trigger.
- [ ] axe: 0 serious or critical on every route at 390 and 1440.
- [ ] Every diagram label and provenance label measures ≥4.5:1 against its rendered background (sample with a contrast script on screenshots, or computed colours on solid surfaces).
- [ ] Any auto-moving content has a visible pause control.

**Composition**
- [ ] At 1440×900, a screenshot test confirms that no hero room panel pixels overlap the H1, lede or moments bounding boxes. Use a mask diff with the room on and off, or a fallback-render comparison.
- [ ] On product pages at ≥1024 px, the active stage visual's bounding box does not intersect the beat copy's bounding box. Inactive visuals have `visibility: hidden`.
- [ ] No `<img>` displays at a CSS width greater than its intrinsic width.

**Motion budget**
- [ ] The gallery pin end minus start is ≤ 2.5 × `innerHeight` at 1440×900. There is no pin at 1024×768 or below 1280×760. Extend `verify-showcase.mjs`.
- [ ] The homepage document height at 1440×900 is ≤ about 8.5 × `innerHeight`.

**Performance**
- [ ] Lighthouse mobile on `/` and one product page: Performance ≥85; Accessibility, SEO and Best Practices ≥95; LCP ≤2.5 s; CLS ≤0.1.
- [ ] Compressed JS on `/`, excluding the 3D chunk, is ≤180 KB. The 3D chunk is ≤250 KB and **is not requested** at 390×844 (verify with network logs).
- [ ] The room stops rendering when the hero is off-screen: the rAF callback count from R3F drops to about 0 after scrolling past the hero.
- [ ] The global CSS chunk contains none of the utilities that exist only in `research/` (e.g. `to-teal-600`).
- [ ] 0 console errors on all routes at 390, 1024 and 1440.

**SEO and meta**
- [ ] Each route has a unique title and description, a full OG set with an image, a canonical URL and a favicon. `sitemap.xml` lists every public route. `robots.txt` exists. JSON-LD validates and contains verified fields only.

**Visual comparison**
- [ ] Before and after screenshots for every route at 390, 1024 and 1440, saved under `docs/review/<date>/`, with a short note per route on what changed.

---

## N. Missing company information and asset requirements

Ask the owner. Until each item is supplied, use explicit placeholders or omit the element.

1. **Logo vector masters** for Meerana and each product (DL-B02/B03), plus clear-space and minimum-size rules. Needed for the header, favicon, OG images and footer.
2. **Contact infrastructure:** the enquiry API host (DL-T04), the Turnstile decision (DL-T05), data retention and privacy-notice text (DL-T06), and analytics (DL-T07). These block the live form and `/privacy/`.
3. **AI in a Box:** its public name (DV-01), confirmed deployment options (DL-P13), and which features are live (DL-P14). Until then, no Deploys row and no sovereignty or on-premise claim.
4. **Nazo:** the public name (NAZO vs "U Sign", DV-03), and clearance of the demo media (EV-547 do-not-use tenant; DEMO-MEDIA-PLAN B1). The unused `public/media/v3/nazo-loop-ai-drafting*.mp4` and `aibox-loop-contract-review*.mp4` may only be used once cleared, and then as muted, user-paused loops with posters.
5. **Native-resolution product captures:**
   - Mandoobee (the current card looks upscaled);
   - clean Tasree3 recaptures without the IP markings (DV-11);
   - Wasel app screens and controller photos;
   - Yisbir captures under the neutral demo-tenant policy (DV-04).
6. **Proof:**
   - award certificates (to confirm the wording and show thumbnails);
   - written partner-logo permissions;
   - confirmation of each partner relationship (Kofax, AgilePoint, Confluent, SAP, SAS, Sprinklr, Zing HR);
   - whether Ruya, Cronos International, Dell, Modon Global and Sabeel Technologies are clients or partners, with permission to show them;
   - the source of "32" or its withdrawal.
7. **Case studies:** at least one per product with a named, consenting customer (REPORT §8; plan/12 L-07). There are none today, so no testimonials or case-study pages until then.
8. **Company:** the mission statement (EV-011), leadership names and consent (EV-013), verified social links (EV-021), and the legal name and unit number (EV-002/EV-003: "Meerana Technologies LLC" and #1704 are the owner-supplied values in use).
9. **Office risk note:** the UK company was dissolved on 2025-11-25 (EV-502). London is shown on the owner's instruction. Get explicit sign-off before launch. The Egypt and India entities are unverified (EV-501/503).
10. **Service-line descriptions** for Consulting, Bespoke development, Technology partnerships and Staff augmentation.
11. **Owner rulings pending:**
    - the overall direction and the six-product sitemap (OWNER-DECISIONS §3 #1);
    - the M3 defaults (250vh pin, "Intelligence Layer" heading despite EV-473);
    - the H1 weight (300 vs heavier);
    - the homepage section order in H.

---

## O. Out of scope

- The Arabic site (`/ar`), a language switch, and the Almarai font. Phase 2. Do keep using logical CSS properties so RTL stays possible.
- Rewriting any mandated copy (section B).
- New homepage content sections (net-content rule). Consolidation is allowed.
- Testimonials, invented metrics, client logos without permission, certifications, team bios, "years of experience".
- Face-recognition imagery or demos; licence plates; weapons or violence detection content (OWNER-DECISIONS; YISBIR-USE-CASES §6).
- The live-site security findings (owner waived them, DL-T08).
- New animation or scroll libraries (Lenis, ScrollSmoother, Framer Motion alongside GSAP), custom cursors, globes, particles or plexus, glass on cards, gradient text, AI-generated product imagery, a long preloader.
- FAQ, a trust page, a mega-menu, a mobile sticky bottom bar, `/insights`, `/careers` (unless the owner confirms hiring).
- Backend implementation of the enquiry API (only the client contract and fallback are in scope).

---

## Working rules for you, the coding agent

1. **Inspect before editing.** Read the files named in each item. Confirm each [HYP] finding before you act on it.
2. **Preserve working functionality and legitimate content:**
   - the mandated copy;
   - verified awards and partner wording;
   - the reduced-transparency handling;
   - the skip links;
   - the room's fallback and error boundary;
   - the existing verify scripts.
3. **Reuse before you create.** Extend the existing tokens, scripts and components. No new dependencies unless a requirement cannot be met otherwise; if one is needed, justify it in your report.
4. **Build the shared foundations (Phase 2) before page-level styling.** Do not duplicate per-page CSS.
5. **Verify each phase in a real browser** at 390, 1024 and 1440. Rebuild (`npm run build`) and serve `out/` (`npm start`) before you verify, because the audit was done against the static export.
6. **Test every route** and the interaction states: hover, focus, active, open and closed menus, form validation, error and success, reduced motion, no-WebGL (`scripts/shoot.mjs --mode nowebgl`), and JS disabled.
7. **Compare desktop and mobile screenshots** before and after each phase.
8. **Report at the end of each phase:** what changed (files), what you verified (commands, screenshots, metrics), what is still blocked and on what (section N), and any provisional copy you introduced.
