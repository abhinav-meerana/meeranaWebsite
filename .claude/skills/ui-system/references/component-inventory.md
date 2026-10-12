# Component inventory

**Conventions:**
- Semantic tokens only.
- Every interactive part is keyboard operable.
- Motion follows `web-animations`.
- Provenance labels follow `meerana-product-ui`.
- "shadcn base" names the primitive to install (Radix or Base UI). "—" means build it from plain semantic HTML.

## Site chrome

| Component | Anatomy | Tokens / classes | States | A11y | shadcn base |
|---|---|---|---|---|---|
| `SiteHeader` | Logo (official raster ≤ native size, or a vector when supplied) · primary nav · one CTA · utility ("Reduce motion", later "العربية") | Transparent over the hero, then `bg-surface` with `border-b border-line` after 80 px of scroll. Height 72 px desktop, 64 px mobile. | default · scrolled · menu-open | `<header>`, skip link first, logo `alt="Meerana Technologies"` | — |
| `MegaNav` (Products) | 4–5 product rows (logo, descriptor, one line) · outbound links (tasree3.ae ↗, yisbir.com ↗, app stores) · "All products →" | `bg-surface-raised`, `rounded-panel`, `border border-line` | closed · open · item focus | **Disclosure pattern**, not `role=menu`. Esc closes and returns focus. | `navigation-menu` |
| `MobileNav` | Full-height sheet; same structure; Contact stays visible | `bg-surface` | — | Focus trap; `aria-modal` | `sheet` |
| `SiteFooter` | Legal entity (DL-C01) · address · email · phone (DL-C04) · verified socials · privacy · "Founded in Dubai in 2022" | `bg-surface-deep`, `text-fg-muted` 14 px | — | `<footer>`, `<nav aria-label="Footer">` | — |
| `MotionControl` | "Pause motion" toggle with a constant label, plus "Replay" | Mono label 12 px, `border border-line-strong`, `rounded-pill`, `aria-hidden` ❚❚/▶ glyph | playing · paused (persisted in localStorage, try/catch) | Required for any animation running > 5 s (WCAG 2.2.2). `aria-pressed` carries the state and the label never changes (APG). | — |

## Content blocks

| Component | Anatomy | Notes |
|---|---|---|
| `Eyebrow` | Mono or label text, uppercase, +0.06em | **Facts only** ("EST. 2022"). Never slogans. |
| `SectionHeader` | Eyebrow · title (≤ 8 words) · lede (≤ 2 sentences) | Left-aligned. Max width 62ch for the lede. |
| `TwoToneHeading` | Bright clause (`text-fg`) + muted clause (`text-fg-muted`) | Max once per page (reference pattern P5) |
| `ProductIndexCard` | Official logo · descriptor (label) · one verb-led line · "Explore →" | The product accent appears only as a 2 px top rule (`border-t-2 border-product`). The **only** product card set on the page (`meerana-narrative`). |
| `Placard` (museum) | Index no. (mono) · name (Poppins 500, 24 px) · relationship (mono label) · year · source line · optional logo slot | For partners and awards. `bg-surface` on a `data-surface="light"` neutral band, hairline top rule, generous padding (40 px). Renders only with evidence ids (`ok-to-use`). |
| `PlacardRail` | Horizontal list of placards | Native scroll-snap. Arrow buttons + keyboard. **No auto-scroll.** `role="list"`. |
| `BentoGrid` / `BentoCell` | CSS grid with named areas; cells vary in span (2×2, 2×1, 1×1) | Each cell: title + 2 sentences + mono list or real UI. No identical cells. Desktop 4 columns, tablet 2, mobile 1 (stack in reading order). |
| `FactTable` | Product · deployment facts · evidence | A real `<table>` with `<caption>`. Mobile: a stacked definition list. |
| `ChapterShell` | Text column (5–6 cols) + `StickyStage` (6–7 cols) + "Skip to next section" link | Sticky stage, not a hard pin (`meerana-scroll-choreography`) |
| `StatFigure` | Number (display) + label + evidence id | **Only for register-backed numbers.** No animated counters under reduced motion; prefer static. |

## Product UI (demo) components

| Component | Product | Anatomy | Rules |
|---|---|---|---|
| `DemoFrame` | All | Device or app frame · `ProvenanceLabel` · step controls · `aria-live="polite"` region | The label is visible near the UI: "Illustrative interface · sample data" / "Interface reconstruction — simplified" |
| `CameraPanel` | Yisbir | Frame (`bg-surface-deep`) · camera chrome (REC, camera ID + generic site name, timecode, `LOCAL NODE`) · detection layer · zone polygons | Boxes are 1.5 px `--product-accent` with a 1 px dark outline (≥ 3:1 over footage). Labels: class + confidence (`0.94`) + track ID. **Documented classes only**; no faces, gender or plates (DL-P07). Canvas is `aria-hidden`; a DOM event list mirrors the states. |
| `EventStream` | Yisbir | Timestamped rows: time (mono) · camera · event · zone | Sample data; `aria-live="off"` by default (avoids noisy announcements); paused by `MotionControl` |
| `SearchField` + `ResultCard` + `IndexTimeline` | Yisbir | Query input · filter chips · cards (inset frame, timecode, source, hit type, language tag, highlighted snippet) · 24 h timeline with ticks | Real `<input type="search">` with a `<label>`. Results in a `role="list"`. Arabic snippets get `lang="ar" dir="rtl"`. |
| `ApprovalTrack` | Nazo | Reference ID (mono, LTR even in RTL) · title · status pill · approver chain (role initials) · requester role · updated date | Statuses: Signed & Complete (`text-success`), Active (`text-signal`), Returned (`text-warning`). Role initials, never names. Reconstructed from the observed demo (REPORT §6). |
| `SealBadge` | Nazo | "Sealed" / "Unsealed" + "Verify" button | Never imply a certification or legal standard that isn't documented |
| `AssistantPanel` | Nazo, Mandoobee | Bounded actions (Summarize · Draft my comment · Anything missing?) · output with "Draft" state · human approval | Show model output as **draft until a person approves** (`modern-ai-company`) |
| `ProcessMap` | Tasree3 | Nodes (lattice-cell shape allowed) · flow · bottleneck in orange · as-is / to-be | Light canvas; orange marks the problem; ink text on orange |
| `PhoneFrame` | Mandoobee, Wasel | Device frame + reconstructed screen | Mandoobee: reconstructed from real store screenshots (DL-A02) |

## Forms

| Component | Notes | shadcn base |
|---|---|---|
| `ContactForm` | Visible labels; `autocomplete`; inline errors plus a summary; interest preselected from `?interest=`; Turnstile (managed); honeypot; privacy acknowledgement | `form`, `input`, `textarea`, `select`, `checkbox` |
| `Button` | Variants: primary / secondary / link / product. Sizes: md `h-11` (44 px) / sm `h-9`. | `button` (cva) |
| `Tabs` | WAI-ARIA tabs; arrow keys | `tabs` |
| `Accordion` | Services on mobile | `accordion` |
| `Dialog` | Video and lightbox; focus return | `dialog` |
| `Tooltip` | Supplementary only; never essential information | `tooltip` |
| `Toast` | Form confirmation | `toast` (Base UI) / `sonner` (Radix) |
