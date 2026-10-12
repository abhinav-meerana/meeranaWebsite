---
name: meerana-brand
description: Brand governance for the Meerana Technologies website and its product sub-brands (Wasel, Mandoobee, Tasree3, Yisbir). Use whenever choosing or reviewing colours, typography, logos, surfaces, gradients, iconography or design tokens for any Meerana page, product chapter, dashboard mock or 3D scene — including "make it look more premium", "pick an accent for Tasree3", "dark or light section?", or building/changing the token files. Also use before shipping any visual to catch off-brand values such as a green Tasree3 or a cyan Wasel.
---

# Meerana brand governance

## Purpose
Keep one recognisable Meerana ecosystem while each product keeps its own documented identity. The brand PDF is the visual authority. Two previous drafts went off-brand: Figma Make v17 used neon azure and cyan, a green Tasree3 and a cyan Wasel. This skill exists to stop that drift.

## When to use
- Any colour, type, logo, surface, gradient or token decision.
- Reviewing a page, a component, a dashboard mock or a 3D material.
- Adding a product accent.
- Answering "is this on-brand?".

## Required inputs
- `references/brand-reference.md`: verified hex values, fonts, logo inventory, and known PDF errors. Read it first.
- `plan/09-design-system.md`: token architecture and usage rules.
- `plan/05-conflict-decision-log.md`: brand decisions already taken or still pending.
- The component or page being styled.

## Workflow
1. **Identify the layer.**
   - Meerana layer: navigation, hero, ecosystem, services, proof, contact, footer.
   - Product layer: product chapters and product pages.
   - A product accent may appear on the Meerana layer only to *identify* that product (chip, rule, logo). Never as a page theme.
2. **Pick from tokens, not hex.**
   - Use semantic tokens (`--surface-*`, `--text-*`, `--accent-*`) that resolve to brand primitives.
   - If you need a value that doesn't exist (tints, shades, elevation), derive it in `tokens/derived` with a comment naming its parent primitive. Mark it *derived*. Brand-specified primitives and derived values must never be confused.
3. **Check contrast.**
   - Run `python .claude/skills/meerana-brand/scripts/contrast_check.py` (add pairs as needed).
   - Hard rules from the verified ratios:
     - `#0D3BFF` blue is **never text or UI on navy `#071B36`** (2.53:1). Use cyan or white.
     - `#3FD0FF` cyan is **never text on white or light neutral** (1.80:1). It is for accents on navy only.
     - Tasree3 orange `#FD5D01` with white text is large-text only (3.11:1). Orange buttons carry ink `#001731` text (5.78:1).
     - Mandoobee azure `#047AFF` on mist is large-text/UI only (3.63:1). Body text uses royal `#0D3D91`.
     - Wasel copper `#C58A52` on ivory fails (2.68:1). Use it decoratively; text uses brown `#6B3E26`.
     - Yisbir blue `#0045F8` on abyss `#00132D` fails (2.84:1). Use aqua `#43DAFE` on abyss.
4. **Typography.**
   - Poppins (EN) and Almarai (AR) everywhere on the Meerana layer.
   - Product faces (Avenir+Cairo, Kufam+Alexandria, Exo 2+Changa, Montserrat+Tajawal) are allowed only for product display moments: chapter titles and wordmark-adjacent lines. Use at most one weight per product face, subset and lazy-loaded with that chapter.
   - Body copy, UI labels and dashboards inside product chapters stay in Poppins/Almarai unless a real product screenshot shows otherwise.
   - Avenir LT Pro needs a commercial webfont licence. Until one is confirmed, Wasel display text falls back to Poppins SemiBold.
5. **Logos.**
   - Use only official artwork, unmodified: no recolouring, stretching, effects or redrawing.
   - Current files are raster and white-only. Record each use in the asset spec as "awaiting vector".
   - Never rebuild a logo as an SVG trace and present it as official.
6. **Surfaces.**
   - Choose light or dark per section by *what the section must communicate*. Dark is not a brand requirement.
   - The PDF itself pairs a dark navy hero with white/neutral panels and coloured product cards.
7. **Record.** Any new decision (new derived token, font fallback, exception) goes into the decision log with its rationale.

## Expected outputs
- Token diffs (primitives untouched; semantic and derived tokens documented).
- A contrast report for changed pairs.
- A short brand review note listing deviations and fixes.

## Quality checks / acceptance
- Zero raw hex values in components. Grep for `#[0-9a-fA-F]{3,8}` outside `tokens/`.
- Every product accent matches the brand-reference table:
  - Tasree3 uses orange/navy/sky. Never green or teal.
  - Wasel uses brown/sand/copper/ivory. Never cyan.
- Every text pair meets AA (4.5:1; 3:1 for ≥24px or ≥18.66px bold). Every UI boundary or meaningful graphic meets 3:1.
- No more than 2 webfont families load on initial page view (Poppins and, for Arabic, Almarai). Product faces load on demand.
- Logos come from the approved asset list. Raster logos display at or below their native pixel size.

## Project constraints
- Visual authority order:
  1. Visible content of the brand PDF.
  2. Explicit decisions in the decision log.
  3. Everything else.
- The hidden boards inside the PDF are superseded and must not be used (see `references/brand-reference.md` §3).
- Do not repeat the visible PDF's Yisbir subtitle error. Its approved positioning lives in the product dossier and decision log.
- No logos, colours or fonts sourced from Figma Make v17 or Dark Draft v2.

## Failure modes and anti-patterns
- **Neon drift:** substituting `#0052FF` or `#00E5FF` "because it pops". Brand blue is `#0D3BFF`; brand cyan is `#3FD0FF`.
- **Theme by accent swap:** products that differ only by accent colour. Differentiation comes from story, workflow and UI (see meerana-narrative). Colour only supports it.
- **Glow/glass as identity:** using glow, glassmorphism, metaballs or particles as the brand signature. The documented signature is the isometric cell lattice and clean geometric type.
- **Font sprawl:** loading all eight product font families globally.
- **Off-brand page chrome:** cyan body text on white, or blue labels on navy.
- **Bad logo handling:** tracing or recolouring logos, or upscaling the 235 px draft logo.
