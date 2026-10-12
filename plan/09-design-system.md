# 09 — Design system & brand rules

**Status:** proposed, pending the decisions marked `DL-…` (see 05).
**Machine-readable tokens:** `plan/design-tokens.json`.
**Governing skill:** `.claude/skills/meerana-brand`. Verified brand values are in `.claude/skills/meerana-brand/references/brand-reference.md`.

---

## 1. Principles

1. **Evidence before effect.** Visual devices exist to make a verified fact or workflow clearer. If a device explains nothing, cut it.
2. **One ecosystem, distinct products.**
   - The Meerana layer (navigation, hero, ecosystem, services, proof, contact) is always Meerana blue, navy, cyan, neutral and white, set in Poppins/Almarai.
   - Products appear in their own documented palettes inside their chapters and pages.
   - Products feel different because their users and tasks differ (see 07). Colour only supports that.
3. **Architectural precision.** The brand's distinctive asset is the logo's **isometric parallelogram lattice**. Use its geometry as the structural motif for 3D cells, dividers, chips, the grid accent and the ecosystem diagram. It replaces the generic "AI glow" language of earlier drafts.
4. **Light and dark by purpose.** Use dark where the scene is about night, monitoring, or contrast for video. Use light where the reader must study structure (process maps, diagrams, forms). Dark is not a brand requirement: the brand PDF itself mixes a navy hero with white panels.
5. **Accessible by default.** Contrast, focus, reduced motion and RTL are designed in, not patched (see `meerana-a11y-responsive`).

## 2. Token architecture

| Tier | What | Who may change it |
|---|---|---|
| **Primitive** | The exact brand-PDF colours (Meerana + 4 products) and fonts | Only after a brand-owner decision (decision log) |
| **Derived** | Documented mixes of primitives: navy scale, blue tints, hover/pressed, plus non-brand functional state colours | Design lead, with a recipe and contrast note |
| **Semantic** | `surface-*`, `text-*`, `border-*`, `action-*`, `focus-ring`, `accent` | Design system; the only layer components use |

**Theming mechanism.** Sections declare `data-surface="light|dark"` and optionally `data-product="wasel|mandoobee|tasree3|yisbir"`. CSS custom properties resolve the semantic set. Components never reference primitives or hex values.

```css
[data-surface="dark"]  { --surface-page: var(--meerana-navy); --text-primary: var(--meerana-white); --focus-ring: var(--meerana-cyan); }
[data-product="tasree3"] { --accent: var(--tasree3-orange); --accent-2: var(--tasree3-sky); --on-accent: var(--tasree3-ink); }
```

## 3. Colour rules (from the verified contrast matrix)

| Rule | Ratio | Consequence |
|---|---|---|
| Blue `#0D3BFF` on white | 6.80 | Primary actions and links on light surfaces ✔ |
| Navy `#071B36` on white / neutral | 17.2 / 14.7 | Primary text on light ✔ |
| Cyan `#3FD0FF` on navy | 9.58 | Accent text, focus ring and data highlights on dark ✔ |
| **Blue on navy** | **2.53** | ✘ Never text, icons or UI boundaries. Decorative fills only, at large size. |
| **Cyan on white** | **1.80** | ✘ Never text on light. Decorative only (lattice lines, illustration). |
| Tasree3 orange on ink | 5.78 | Orange text and highlights on dark ✔ |
| White on Tasree3 orange | 3.11 | ✘ for body or button text. Orange buttons use **ink** text (5.78). |
| Mandoobee azure on mist | 3.63 | Large text/UI only. Body text uses royal (9.08). |
| Wasel copper on ivory | 2.68 | ✘ text. Copper is accent or line work; text uses brown (8.17). |
| Wasel sand on brown | 5.17 | Secondary text on dark Wasel surfaces ✔ |
| Yisbir aqua on abyss | 11.23 | Accent text and detection overlays on dark ✔ |
| **Yisbir blue on abyss** | **2.84** | ✘ text/UI. Yisbir blue belongs on white/light (6.55). |

**Functional states** (form validation, demo status) use the derived `state.*` set, which is non-brand. Never use them as decoration or to colour products.

**Gradients.**
- One brand ramp is allowed: blue → navy → cyan → neutral, as in the PDF strip. Use it for thin rules and the hero lattice light only.
- Product cards may use the product's own two-stop gradient, as the PDF cards do.
- No rainbow, mesh, or neon glows.

## 4. Typography

| Use | Latin | Arabic | Weights loaded |
|---|---|---|---|
| Meerana layer: all text | Poppins | Almarai | Poppins 400/500/600/700. Almarai 400/700 (800 only for display, if needed). |
| Product display moments (chapter title, product wordmark line) | Avenir LT Pro* / Kufam / Exo 2 / Montserrat | Cairo / Alexandria / Changa / Tajawal | **1 weight per face**, subset, lazy-loaded with the chapter |
| Product UI demos | Poppins/Almarai, unless real screenshots show the product's own UI font | | n/a |

\*Avenir LT Pro is commercial. Until a webfont licence is confirmed (DL-B04), Wasel display text uses Poppins SemiBold.

**Scale:** fluid `clamp()` values in `design-tokens.json → type.scale`.
- Display set in Poppins 600 with −0.03em tracking. Poppins is geometric and wide, so heavy weights look shouty at display sizes; reserve 700/800 for short wordmark-like lines.
- Body 17 px / 1.65.
- Arabic body line-height 1.85, no letter-spacing, no uppercase transforms.

**Numerals:** Western digits by default. For Arabic pages, use Eastern Arabic digits only if Meerana prefers them (DL-L02).

## 5. Logo rules

The brand PDF gives no clear-space, minimum-size or misuse rules, so the rules below are **provisional** until the brand owner confirms (DL-B02).

**Lockups:**
- Horizontal: header and footer.
- Stacked: hero and print-like moments.
- Symbol-only: favicon, 3D motif, small chips.

**Colourways:**
- White on blue `#0D3BFF`
- White on navy `#071B36`
- Blue on white or neutral

No other colours, gradients or effects. Never place the logo on a photo without a solid or scrim panel giving ≥ 4.5:1.

**Clear space (provisional):** ≥ the height of one lattice cell of the symbol on all sides.

**Minimum size (provisional):** horizontal lockup 112 px wide on screen; symbol 24 px.

**Files.** Only raster files exist today: 1579×333 white horizontal PNG, 1001 px stacked white, and 401 px tiles. **Vector masters (SVG + EPS) are required before launch.** Until then, raster logos are shown at ≤ their native size and logged as "awaiting vector".

**Product logos:**
- Use official artwork only.
- All are white-only rasters (Wasel 205 px, Mandoobee 644×271, Yisbir 279×67, Tasree3 308×308).
- Colour and mono vector versions are required.
- Never use the concept-board logos hidden in the PDF.

## 6. The lattice motif (signature device)

**Source:** the logo symbol is a lattice of parallelogram cells on an isometric grid. Measure the exact skew angle and cell proportions from the vector master once supplied; 30°/60° isometric is provisional.

**Applications:**
- **3D:** instanced extruded cells form the ecosystem "model". Products occupy zones of cells. See 08 and 11.
- **2D:** section dividers drawn as a single row of outline cells; chip shapes with one skewed edge; a 4% opacity lattice texture on navy hero surfaces; step indicators as cells filling in.
- **Data:** in the Tasree3 process map, activity nodes may use the cell shape. This is a defensible stylisation because nodes are abstract.

**Limits:**
- One lattice application per viewport. It's a signature, not wallpaper.
- Never distort the actual logo into the motif.

## 7. Layout, spacing, shape

- **Grid:** 12 columns. Content max 1280 px; media max 1440 px; gutter `clamp(16px, 4vw, 48px)`.
- **Chapter layout:** text column (5–6 cols) beside a sticky stage (6–7 cols) on desktop. On mobile they stack, with the stage above the related text.
- **Spacing:** 4 px base scale (4 … 160). Section padding is 96–160 px desktop and 64–96 px mobile.
- **Radius:** controls 6, inputs 8, cards 16, panels 24. This mirrors the PDF's rounded product cards; the lattice motif supplies the angular contrast.
- **Elevation:** at most 2 shadow levels on light surfaces. On dark, use borders (`border-subtle`) rather than shadows.

## 8. Surfaces per area

| Area | Surface | Rationale |
|---|---|---|
| Header | Transparent over the hero, then `light` with a 1 px border after scroll | Legible on any section |
| Hero | `dark` navy with the lattice and night-UAE photography (if supplied) | Echoes the brand PDF hero ("Built in the UAE") |
| Ecosystem model | `light` (white/neutral "architectural model") | Spatial mapping needs clarity; it's the explanatory moment |
| Wasel chapter | Wasel dark (brown) → ivory panels | Physical arrival; warm materials; brand-documented palette |
| Yisbir chapter | Yisbir abyss | Video and monitoring read best on dark; aqua overlays at 11:1 |
| Mandoobee chapter | Mandoobee mist (light) | Everyday office work; forms and approvals |
| Tasree3 chapter | Tasree3 white canvas with ink and orange (dark ink for the intro) | Process maps need a light, analytical canvas; orange marks the problem |
| Services / How we deliver | `light` | Reading-heavy |
| Proof (awards, certifications, events, partners) | `light` neutral. Partner logos in full colour on white tiles. | Legibility; Figma Make's grey-filtered logos were unreadable |
| Contact | `dark` navy | Strong close; form uses dark-surface tokens and a cyan focus ring |
| Footer | `dark` navy-950 | |

## 9. Iconography & imagery

**Icons:**
- One open-source line set, Lucide (MIT), at 1.5 px stroke on a 24 px grid.
- Product-specific pictograms are drawn in the same stroke.
- No mixed icon sets. No emoji. No 3D icons.

**Photography:**
- Verified event photography (see 10 §6). Real product hardware and screens once supplied.
- Use only permission-cleared, captioned images with dates verified.

**Existing product cover banners on meerana.ae** (`wasel_cover_banner.png`, `yisbir_cover_banner.png`, `tasree3_cover_banner.png`):
- They look like AI-generated illustrations. They contain fictional signage ("OAKWOOD RESERVE", a camera branded "SENTINEL AI-V12").
- They must **not** be used as product photography. At most they can be marked illustrative, pending DL-A03.

**Illustrations** follow the lattice/architectural-model language, never stock "AI brain" imagery.

## 10. Motion tokens

- **Durations:** instant 100 ms, fast 160 ms, base 240 ms, slow 420 ms.
- **Easings:** standard `cubic-bezier(.2,0,0,1)`, enter `(0,0,0,1)`, exit `(.3,0,1,1)`.
- **Scrub smoothing:** ≤ 0.5 s.
- Reduced motion collapses every duration to 0 and shows final states (see 08).

## 11. Core component inventory

| Component | Notes |
|---|---|
| `SiteHeader` + `MegaNav` | Products (4 lead products + "More solutions"), Services, Company, Contact CTA, language switch (when Arabic ships). Disclosure-pattern menu. |
| `ProductIndex` | Persistent 4-item index: hero chips on desktop, horizontal scroller on mobile. Each item has the logo, a one-liner and a link. |
| `Button` | primary / secondary / text. A product variant takes `--accent` and `--on-accent`. |
| `SectionHeader` | Eyebrow (label style), title, lede |
| `ChapterShell` | Text column + sticky `SceneSlot`/`DemoFrame`. Owns its GSAP timeline. Includes a skip link. |
| `SceneSlot` | Placeholder `div` the shared canvas renders into; shows a poster until ready |
| `DemoFrame` | Device frames (phone, laptop/browser, CCTV monitor, kiosk) + `ProvenanceLabel` + step controls + `aria-live` region |
| `StepList` | Numbered steps synced with the demo state machine |
| `ProofCard` | Award (issuer, year, evidence link) and certification (standard, scope, body, validity). Rendered only for `ok-to-use` evidence. |
| `PartnerGrid` | Full-colour logos on white tiles, grouped by relationship type ("Technology partners", "Clients") only where evidence supports the label |
| `EventGallery` | Captioned, dated photos; lightbox with keyboard support |
| `ContactForm` | Fields per 11 §contact. Interest preselected from the URL. Inline + summary errors. |
| `SiteFooter` | Legal entity (DL-C01), address, contacts, socials (verified URLs), privacy link |
