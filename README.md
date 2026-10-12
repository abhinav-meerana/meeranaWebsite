# Meerana website

The Meerana Technologies website: a **Next.js 16 static export** with a WebGL hero
room, a pinned horizontal product gallery, and six product story pages, built on
brand tokens.

> **Status (2026-10-11):** the audit implementation has landed. Homepage,
> six product pages, `/company/`, `/services/`, `/contact/`, a branded 404, a
> shared header and footer, sitemap, robots, icons and an Open Graph image.
> What is still blocked, and why, is in
> [`docs/IMPLEMENTATION-REPORT-2026-10-11.md`](docs/IMPLEMENTATION-REPORT-2026-10-11.md).
> The audit and the brief it was built from:
> [`docs/AUDIT-IMPLEMENTATION-PROMPT-2026-10-11.md`](docs/AUDIT-IMPLEMENTATION-PROMPT-2026-10-11.md).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export -> out/, then flattens RSC payload files
npm start          # serve the export on http://localhost:4173
```

`npm run build` runs `next build && node scripts/postexport-rsc.mjs`. The second
step works around a Windows export quirk (see the script header): without it,
every `<Link>` prefetch 404s in the console.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production static export to `out/` |
| `npm start` | serves the built export locally on :4173 |
| `npm run typecheck` | `tsc --noEmit` |
| `node scripts/verify-launch.mjs` | **the acceptance suite**: honesty grep, link crawl, console errors, overflow at 7 widths, keyboard focus, reduced motion, menu focus management, pin budget, 3D gating, axe. Run against `npm start`. `--only keyboard,axe` runs groups. |
| `node scripts/shoot-routes.mjs [outDir]` | one viewport screenshot per route at 390 / 1024 / 1440 (the before/after record) |
| `node scripts/shoot.mjs --mode all` | screenshots at 1440/1280/1024/390, plus reduced-motion and no-WebGL |
| `node scripts/shoot-full.mjs 1440 900` | walks the page and captures section frames |
| `node scripts/verify-page1.mjs`, `verify-pages.mjs`, `verify-showcase.mjs`, `verify-story.mjs` | earlier per-feature measurements |
| `NEXT_PUBLIC_PREVIEW=1 npm run build` | a **preview** build: shows the prototype note and unconfirmed content, each flagged |

## Build-time switches (`lib/flags.ts`)

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_PREVIEW=1` | Preview build. Adds a footer note and shows register items still marked `confirm-with-meerana`, flagged "Unconfirmed". Never set for production. |
| `NEXT_PUBLIC_ENQUIRY_API` | The enquiry endpoint (plan/11 §15). |
| `NEXT_PUBLIC_PRIVACY_URL` | The privacy notice. |

The contact form renders only when **both** `NEXT_PUBLIC_ENQUIRY_API` and
`NEXT_PUBLIC_PRIVACY_URL` are set. Until then `/contact/` offers email only, with
the topic in the subject line, and the footer has no Privacy link. A form that
collects personal data must not ship before its endpoint and notice exist.

---

## Architecture

```
app/
  layout.tsx            root layout: fonts, metadata, Organization JSON-LD, header, footer
  page.tsx              homepage: Hero, Showcase, Scenario, World, Cta
  products/[slug]/      six product story pages (dynamicParams = false)
  company/ services/ contact/ privacy/   content pages (privacy is a noindex shell)
  not-found.tsx         branded 404
  sitemap.ts robots.ts  generated at build
  icon.png apple-icon.png opengraph-image.png   from the official logo raster
  tokens.css            design tokens (the ONLY place raw colour lives)
  globals.css           grade stack, type roles, buttons, focus; Tailwind sources
  ui.css                shared UI: annotation voice, screen frame, lattice, footer, proof lists
  header.css hero.css showcase.css sections.css story.css pages.css
components/
  ui/                   ProvenanceLabel ScreenFrame LatticeField SectionHeader SpecList CopyEmail
  site/                 Header (router panel, focus-trapped sheet), SiteFooter
  sections/             Hero Showcase Scenario Sections(World, Cta)
  story/                Story (the stage engine), BeatVisual (data-driven diagrams)
  room/                 the WebGL room, its fallbacks and the poster
  contact/              ContactPanel (email-only), ContactForm (flag-gated)
content/
  showcase.ts           the six products: name, descriptor, copy, accent, deploy, screen
  storyboards.ts        the eight beats per product, each carrying its own visual data
  media.ts              the typed registry of real product screens and the Provenance union
  scenario.ts           the five mandated steps and the Yisbir screens they use
  company.ts            facts, recognition, partners, offices, services, events, press
lib/
  breakpoints.ts        480 / 768 / 1024 / 1280, shared by CSS comments and JS matchMedia
  flags.ts seo.ts
scripts/                verification, screenshots, the RSC post-export fix
media-src/              raw sources and HELD media (see media-src/held/README.md)
```

### Honesty, enforced in code

- `Provenance` (`content/media.ts`) is a union of seven allowed labels. A free-form
  or mislabelled string fails `tsc`, and a diagram can never be labelled a product
  screen.
- `BeatVisual` draws only the data its beat carries. There are no fallback labels,
  so one product's vocabulary cannot appear on another product's page; a beat with
  missing data throws in development.
- A product's `deploy` field is **omitted**, never "to be confirmed", when the
  register has no answer (AI in a Box). `SpecList` skips empty rows.
- `verify-launch.mjs` greps the whole export for internal notes and placeholders.

### Held media

`next build` with `output: "export"` publishes every file in `public/`. Partner and
client logos (including government marks), the Nazo and AI in a Box demo videos,
and every screenshot no page uses were moved to `media-src/held/` on 2026-10-11.
See `media-src/held/README.md` for why and what releases each.

### The depth system

The page's depth comes from a five-layer grade stack, not from decoration:

| Layer | Implementation | Values |
|---|---|---|
| 1 Base | `body` background-color | `#071b36` |
| 2 Atmospheric mesh | 4 radial gradients on `body` | 5–14% alpha, one hue family |
| 3 Hairline grid | `.grade-overlay` | 3.5% lines, 56px cells, radially masked |
| 4 Vignette | `.vignette-overlay` | clear at 45%, `rgba(2,6,12,.55)` at the edge |
| 5 Film grain | `.grain-overlay` | baked 128px tile, 4.5%, `mix-blend-mode: overlay` |

On top of it, the **lattice** (the brand's isometric geometry, `LatticeField`)
replaces the earlier AI-generated background plates. Rationale:
[`docs/DEPTH-DIRECTION-2026-10-10.md`](docs/DEPTH-DIRECTION-2026-10-10.md).

### Motion

GSAP + ScrollTrigger and CSS only; native scroll, no smooth-scroll library, and no
`scroll-behavior: smooth` (it fights ScrollTrigger; see `globals.css`).

- The **H1 never animates.** The lede, moments and buttons settle once (opacity and
  an 8px lift, CSS only).
- The **gallery** pins only at ≥1280×760 with a fine pointer and motion allowed,
  for 2.5 × the viewport height (DD-23). One gesture moves one card. Elsewhere, and
  under reduced motion, it is a native scroll-snap rail with buttons and a counter.
  Focus inside a pinned card scrolls it into view.
- The **3D room** loads only at ≥1280px with WebGL and no Save-Data / low-memory
  signal, stops rendering when off-screen, and is a separate chunk. Everywhere else
  the hero shows one real screen (`RoomPoster`).
- **Product pages** use a sticky stage: the visual in the right-hand columns, copy
  on the left, never overlapping. Reduced motion renders every beat as a static
  section.

---

## Rules that must not be broken

1. **No raw colour outside `app/tokens.css`.** Everything references a token.
2. **Mandated copy is verbatim.** The H1, the four moments, "Meerana Intelligence
   Layer", "Built in the UAE. Engineered for the world.", the five-step story and
   the CTA line come from the owner and may not be reworded.
3. **Every product claim carries an evidence id** (`EV-…`, `plan/03-evidence-register.csv`).
4. **Every screen carries one honest provenance label**, from the `Provenance` union.
5. **No heading may depend on animation to be visible.**
6. **Text never sits on an image or a diagram.** Copy and media have their own columns.
7. **No AI-generated product imagery** (plan/13 §A9) and no logos without written
   permission.
8. **The room is `aria-hidden` and decorative.** All meaning is in the DOM.
9. **No placeholder strings on a production build** (`to be confirmed`, `prototype`,
   `retrieved on`). Omit the field instead.

## Compliance

Never appear: licence plates / ANPR tables, weapons or armory references,
armed-trespass incidents, VIP or K9 personnel boards, the phrase **"Sovereignty in
Your Hands"** (forbidden for AI in a Box by DL-P13), faces, and government or
ministry tenant documents in Nazo media. Per the owner (OWNER-DECISIONS), face
recognition never appears in demos.

## Accessibility

- WCAG 2.2 AA target; `verify-launch.mjs` runs axe on every route at 1440 and 390.
- Reduced motion: no pin, no dimming, no entrance animation, static stage; the room
  stops rendering. Reduced transparency: grain, grid and mesh are removed.
- No WebGL, a lost context, a phone, a tablet, Save-Data: a complete page with one
  poster screen and zero console errors.
- No JS: all copy is in the static HTML.
- Focus rings are never removed; the skip link is first; the mobile sheet traps
  focus and returns it; the desktop Products panel is arrow-key navigable.

## Toolchain

Versions are pinned per `plan/11-technical-architecture.md` §20:

| Package | Version | Note |
|---|---|---|
| next | 16.4.0 | App Router, `output: 'export'` |
| react / react-dom | 19.3.0 | pinned for the R3F 9.x peer range |
| three | 0.186.1 | pinned |
| @react-three/fiber | 9.8.1 | |
| @react-three/drei | 10.7.9 | |
| gsap | 3.15.0 | ScrollTrigger and ScrollToPlugin only |
| typescript | 6.0.3 | |
| tailwindcss | 4.3.3 | scans only `app/`, `components/`, `content/`, `lib/` |
| @axe-core/playwright | ^4.13 | dev only: the accessibility check in `verify-launch.mjs` |

`motion`, `ogl`, `@gsap/react` and the React Bits components were removed: nothing
rendered them after the stats counter, the logo marquee and the H1 split-text were
retired.
