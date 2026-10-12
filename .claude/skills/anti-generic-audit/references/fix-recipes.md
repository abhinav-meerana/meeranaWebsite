# Fix recipes (specific, copy-pasteable)

Each recipe names the failing marker, the replacement, and the project source that justifies it.

## G01 Default Tailwind palette → semantic tokens
```css
/* globals.css: once */
@import "tailwindcss";
@import "./tokens.css";   /* ui-system/references/tokens.css: resets --color-* and defines semantic utilities */
```

| Found | Replace with |
|---|---|
| `bg-slate-950` / `bg-gray-900` | `bg-surface-deep` |
| `bg-slate-900` / `bg-slate-800` | `bg-surface-raised` (dark raised = navy-900, DD-14) |
| `text-white` on dark | `text-fg` |
| `text-slate-300` / `text-gray-300` | `text-fg-secondary` |
| `text-slate-400` / `text-gray-500` | `text-fg-muted` |
| `border-slate-800` | `border-line`; for inputs and UI boundaries, `border-line-strong` |
| `bg-blue-600` (CTA) | `bg-action text-on-action hover:bg-action-hover` |
| `text-cyan-400` | `text-signal` (dark surfaces only) |
| `text-red-500` | `text-danger` (functional only) |
| `text-green-500` | `text-success` (functional only) |
| `from-purple-600 to-indigo-600` | **delete** (no brand equivalent) |

## G02 Purple/indigo gradient hero
**Before:** `bg-gradient-to-r from-purple-600 to-indigo-600` (live meerana.ae product pages).

**After:**
- Flat surface: `bg-surface` (navy).
- If light is needed, use the brand ramp as a **1 px** rule only:
  ```html
  <hr class="h-px border-0" style="background: linear-gradient(90deg, var(--meerana-blue), var(--meerana-navy), var(--meerana-cyan), var(--meerana-neutral))">
  ```
- For gradient *text* (`bg-clip-text text-transparent`): remove it, and use `text-fg` or a two-tone heading (`text-fg` + `text-fg-muted`).

## G03 Emoji icons → Lucide
**Before:** `🎥 Video Streams · 🔍 Smart Search · 📊 Analytics` (live YISBIR console).

**After:**
```tsx
<Video aria-hidden className="size-4" strokeWidth={1.5} /> Video streams
<Search aria-hidden className="size-4" strokeWidth={1.5} /> Search
```
One set (lucide-react) only.

## G04 Placeholder copy
- **Testimonials with Lorem bodies** (live `testimonalsInfo`): delete the section until a named, consenting customer quote exists with an evidence row.
- **Generic headings:** replace with the evidence-backed copy decks in `docs/DESIGN-DIRECTIONS.md` Appendix A.

## G05 Identical card grid → bento or real UI
**Before:** 4 equal cards (image, title, the same subtitle ×4, bullet list): the live "Solutions" block.

**After (services bento, `modern-tech-company/references/services-bento.md`):**
```html
<div class="grid gap-4 md:grid-cols-4 md:grid-rows-2">
  <article class="md:col-span-2 md:row-span-2 rounded-card border border-line p-8">Consulting: 2 sentences + mono list of 6 practices</article>
  <article class="md:col-span-2 rounded-card border border-line p-8">Bespoke development: 2 sentences + stack list</article>
  <article class="rounded-card border border-line p-8">Technology partnerships → links to placards</article>
  <article class="rounded-card bg-surface-raised p-8">Staff augmentation</article>
</div>
```
Cells differ in size **and** content type.

## G06 Generic typography → brand display treatment
- **Meerana:** load Poppins 300/400/500/600 + Almarai 400/700.
  - Hero: `font-sans font-light text-display-xl` (−0.035em, lh 0.98).
  - Labels: `text-label uppercase`.
  - Metadata: `font-mono text-mono` (system mono).
- **YISBIR:** Montserrat 500/600, Tajawal, IBM Plex Mono 400/500.
- Remove Inter, Space Grotesk, JetBrains Mono and Manrope (draft and template fonts).

## G07 Stock / robot imagery → product truth
| Need | Use |
|---|---|
| Hero visual | Meerana lattice (poster SVG + canvas); YISBIR camera panel or search UI; Nazo approval track |
| People | Verified event photos with rights and consent (`research/photo-curation.md`), captioned with event and date |
| Never | Adobe Stock comps (one is live as the hero!), AI-generated product videos or covers (DL-A03), globes |

## G08 Centred-everything → grid
```html
<section class="mx-auto grid max-w-[80rem] grid-cols-12 gap-x-6 px-[clamp(16px,4vw,48px)]">
  <div class="col-span-12 lg:col-span-6"> eyebrow · h1 · lede · CTAs </div>
  <div class="col-span-12 lg:col-span-6"> signature visual </div>
</section>
```

## G09 No signature → one meaningful signature
Choose one per page and mark it `data-signature`:

| Page | Signature |
|---|---|
| Meerana home (M1) | Lattice assembly into five labelled environments, once, ≤ 2.2 s |
| Meerana home (M2) | Isometric model build, front → back, once |
| YISBIR real-time | Detection lock-on brackets, plus a pause control |
| YISBIR home | Index ticks dropping onto a 24 h timeline after a query |

Write the purpose sentence in a code comment.

## G10/G11 Glass and gradient buttons
```html
<!-- before --> <a class="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(37,99,235,.3)]">Explore</a>
<!-- after  --> <a class="inline-flex h-11 items-center rounded-control bg-action px-5 text-on-action hover:bg-action-hover">Explore the products</a>
```
Panels: `bg-surface-raised border border-line rounded-card` (no `backdrop-blur`).

## G12 Fake macOS chrome
Replace the three dots with the product's real frame language:

| Product | Frame |
|---|---|
| YISBIR | `CAM-03 · GATE 2 — NORTH ENTRANCE · ● REC · 07:42:13` |
| Nazo | The app header: "Tracking" + view toggle |
| Neutral | 1 px `border-line` frame + `ProvenanceLabel` |

## G13 Numbers
- **Backed:** `<span data-ev="EV-440">50+ languages</span>`.
- **Demo:** wrap it in `<figure data-illustrative>` and include the visible label "Illustrative interface · sample data".
- **Unbacked** (99.2%, 10M+, 512+, 99.9% uptime): delete it, and write the capability instead ("Searches transcripts in 50+ languages" [EV-440]).

## G14 Hype → workflow language
| Before | After |
|---|---|
| "Revolutionary AI-powered video intelligence" | "Search hours of video like a document." |
| "Seamless digital transformation" | "Model, mine and govern your processes on one platform." |
| "Cutting-edge correspondence" | "Route, approve, sign and seal official correspondence." |

## G16/G17/G20/G22 Basics
- One `<h1>`. Nav items are links in `<nav>`, not h1.
- `alt` on every image: logos use the organisation name; decoration uses `alt=""`.
- Metadata: title template `"%s | Meerana Technologies"` and a 140–160 character description. Open Graph image. `lang` and `dir`.
- Hero H1 visible at first paint. No `opacity-0` or `data-reveal` on it.

## G18/G19 Motion accessibility
- Add a `prefers-reduced-motion` CSS block, plus JS `matchMedia` branches that render final states.
- Loops over 5 s get `<button data-motion-control aria-pressed="false">Pause motion</button>`.

## G21 ISO badges
Remove the roundels. Once certificates exist: "Our information security management system is certified to ISO/IEC 27001:2022", plus the certification body's mark per its rules, plus the certificate number and scope (DL-R03).
