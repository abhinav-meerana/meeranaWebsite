---
name: ui-system
description: Design system for the Meerana and YISBIR web builds on Tailwind CSS v4 + shadcn/ui. Covers @theme tokens (colour, type scale, spacing, radius, borders, elevation, motion), dark-first theming with data-surface / data-brand / data-product, WCAG AA enforcement with a contrast gate script, the component inventory, shadcn/ui setup conventions (Base UI or Radix, components.json, the token mapping), and a "never do" list. Use it whenever you create, style or review a component, page, Tailwind CSS file, globals.css, theme, colour, font, icon or spacing choice, or set up or extend shadcn/ui — including asks like "make this card look better", "add a dark section", "which blue do I use", "install shadcn", or "is this accessible". For brand-governance questions (which sub-brand colour, logo usage) defer to meerana-brand. For copy and evidence defer to meerana-evidence.
---

# UI system: Tailwind v4 tokens and shadcn/ui

## Purpose
One token system, compiled from the verified brand values, makes off-brand UI hard to write and easy to catch.
- Components speak only **semantic** tokens (`bg-surface`, `text-fg`, `border-line`, `bg-action`).
- Sections choose a surface; products identify themselves with an accent.
- shadcn/ui provides accessible interaction primitives restyled to these tokens. It never provides the look.

## Source of truth and relationship to project skills
| Concern | Authority | This skill's role |
|---|---|---|
| Brand values (hex, fonts, logos, sub-brands) | `meerana-brand` + `plan/design-tokens.json` | Compiles them into `references/tokens.css` (Tailwind v4) |
| Token tiers (primitive → derived → semantic) | `plan/09-design-system.md` | Keeps them. Primitives live in `:root` and generate **no** utilities. |
| Styling stack | **Open decision DD-01** (`docs/DESIGN-DIRECTIONS.md` §7) | `plan/11` and `meerana-frontend` specify CSS Modules. This skill implements the brief's Tailwind v4 + shadcn/ui path with **identical token semantics**, so either outcome reuses the same values. If DD-01 rejects Tailwind, use `tokens.css` §2–§5 verbatim as plain CSS custom properties. |
| Accessibility gate | `meerana-a11y-responsive` | Supplies the contrast gate (`scripts/contrast.py`) |

## Files
- `references/tokens.css`: the complete Tailwind v4 theme. It contains:
  - the default-palette reset;
  - primitives;
  - Meerana and YISBIR semantic layers (dark + light);
  - product accents;
  - shadcn mapping;
  - type, radius, shadow and motion tokens;
  - base styles;
  - reduced motion.
- `references/contrast-pairs.json` and `references/contrast-matrix.md`: every semantic pairing with its required ratio. The matrix is generated.
- `references/shadcn-setup.md`: install and configure shadcn/ui on Tailwind v4 against these tokens (2026 CLI, Base UI vs Radix).
- `references/component-inventory.md`: the component list with anatomy, tokens, states, a11y and the shadcn base.
- `scripts/contrast.py`: `--gate` checks all pairs (exit 1 on failure); `FG BG` checks one pair.

## Workflow
1. **Pick the brand root and surface.**
   - Meerana pages: `<html data-brand="meerana">`. YISBIR: `<html data-brand="yisbir">`.
   - Each `<section>` declares `data-surface="dark"` (the default) or `"light"`. Choose by purpose (DD-05): dark for hero, video, monitoring and the close; light for structure, process maps, reading and proof.
   - Product sections add `data-product="wasel|mandoobee|tasree3|yisbir|nazo"`.
2. **Style with semantic utilities only.**

   | Group | Utilities |
   |---|---|
   | Surface | `bg-surface`, `bg-surface-deep`, `bg-surface-raised`, `bg-surface-muted`, `bg-surface-tint` |
   | Text | `text-fg`, `text-fg-secondary`, `text-fg-muted`, `text-signal` (accent: cyan on dark, blue on light), `text-link` |
   | Lines | `border-line` (decorative hairline), `border-line-strong` (≥ 3:1 UI boundary) |
   | Actions | `bg-action`, `text-on-action`, `hover:bg-action-hover`, `border-action-secondary` |
   | Focus | `outline-focus` / `ring-focus` |
   | States | `text-success`, `text-warning`, `text-danger` (functional only) |
   | Product | `bg-product`, `text-product`, `text-on-product`, `bg-product-surface-dark`, `text-product-ink` |
   | Type | `text-display-xl`, `text-display-1`, `text-display-2`, `text-heading-1…3`, `text-lede`, `text-body`, `text-small`, `text-ui`, `text-label`, `text-mono`; families `font-sans`, `font-arabic`, `font-mono` |
   | Radius | `rounded-control` 6 · `rounded-input` 8 · `rounded-card` 16 · `rounded-panel` 24 · `rounded-pill` |

3. **Check contrast** when you introduce a new pairing.
   - Add it to `contrast-pairs.json`, then run `python .claude/skills/ui-system/scripts/contrast.py --gate`.
   - Rules that are never negotiable:
     - Meerana blue is never text on navy (2.53).
     - Cyan is never text on white (1.80).
     - Yisbir blue is never text on abyss (2.84).
     - Aqua is never text on white (1.65).
     - Muted text on dark raised panels uses navy-900, never navy-800 (4.38, DD-14).
4. **Typography.**
   - **Meerana:** Poppins (EN) + Almarai (AR). Mono is the **system stack** (no webfont, DD-06). Display uses Poppins 300 (M1) or 600 (M2), tracking −0.03 to −0.035em.
   - **YISBIR:** Montserrat + Tajawal + IBM Plex Mono.
   - At most **two** webfont families on first load per brand layer (Meerana). Product display faces load lazily with their chapter (`meerana-brand`).
   - Arabic (`:lang(ar)`): no letter-spacing, no uppercase, line-height 1.85.
5. **Layout.**
   - 12 columns; content max 1280 px; media max 1440 px; gutter `clamp(16px, 4vw, 48px)`.
   - Section padding: 96–160 px desktop, 64–96 px mobile.
   - Use **logical properties**: `ps-*`/`pe-*`/`ms-*`/`me-*`/`inset-s-*` (Tailwind 4.2+), not `pl-*`/`left-*`, so RTL works without a rewrite.
6. **Elevation.**
   - Light surfaces: at most `shadow-sm` and `shadow-md`.
   - Dark surfaces: **borders, not shadows** (`border border-line`).
7. **Components.**
   - Build from `references/component-inventory.md`.
   - Use shadcn/ui only for interactive primitives (Dialog/Sheet, Tabs, Accordion, NavigationMenu, Select, Tooltip, Form controls, Toast). Restyle them through the token mapping; never ship a default shadcn theme.

## Never do (fail any review that contains these)
1. **Glassmorphism stacking.** `backdrop-blur` panels over gradients or moving content, more than one translucent layer, or glass as identity. Use opaque `bg-surface-raised` with a hairline `border-line`.
2. **Gradient buttons everywhere.** No `bg-gradient-*` on buttons or links, and no glow shadows on CTAs. Buttons are a flat `bg-action`.
3. **Purple-blue default gradients.** No `from-purple-*`, `to-indigo-*` or similar (the default palette is reset, so these classes don't exist). The only gradient allowed is the brand ramp (blue → navy → cyan → neutral) as a 1 px rule or the lattice light (`plan/09` §3).
4. **Generic SaaS card grids.** No 3- or 4-up grids of identical icon + title + blurb cards. Use a bento with differentiated cells, a list, a placard rail or real product UI.
5. **Raw hex in components.** Hex lives only in `tokens.css`. Grep `#[0-9a-fA-F]{3,8}` outside the tokens file before merging.
6. **Default Tailwind palette and colour drift.** No `slate-*`, `indigo-*` or `gray-*`, and no `#0052FF` / `#00E5FF` neon substitutes (`meerana-brand`).
7. **Emoji as icons.** Use Lucide at 1.5 px stroke on a 24 px grid. One icon set.
8. **Fake OS chrome** (macOS traffic lights) around product UI. Use the product's own chrome or a neutral frame.
9. **Text that only exists after animation.** The LCP text must be visible at first paint (`web-animations`).
10. **Off-scale values.** No spacing, radius or type outside the tokens (`p-[13px]`, `rounded-[20px]`). If a value is truly needed, add a token with a reason.
11. **More than one primary CTA per section.** And never two filled buttons side by side: primary + secondary or text link.
12. **Centred-everything layouts.** The hero and section headers are left-aligned on the grid. Centring is reserved for short closing statements.

## Expected outputs
- Components using semantic utilities only.
- Token diffs with recipes and a contrast-gate run.
- A short "UI review" note: deviations found → fixes applied.

## Quality checks / acceptance
- `python .claude/skills/ui-system/scripts/contrast.py --gate` exits 0.
- No raw hex, no default-palette classes, no `bg-gradient-*` on interactive elements, no `backdrop-blur` (grep).
- Focus-visible is present on every interactive element (2 px `--focus-ring`, 2 px offset) and is never removed.
- Touch targets are ≥ 44 × 44 px.
- At 320 px width and 200 % zoom: no horizontal scroll.
- `anti-generic-audit` passes on the page.

## Failure modes
- **Token bypass:** using primitives (`--meerana-blue`) directly in components "just once". Add a semantic token instead.
- **Theme by accent swap:** products that differ only by colour. Differentiate by workflow and UI (`meerana-narrative`).
- **`dark:` variants on nested surfaces.** Variants match ancestors, so a light section inside a dark page still matches `dark:`. Rely on the semantic tokens, which resolve at the nearest `data-surface`.
- **shadcn `--accent` confusion.** shadcn's `accent` is a hover background. The product colour is `product`.
- **Play CDN drops every utility** (no-build prototypes on `@tailwindcss/browser@4`). The browser build prepends the framework import only if the stylesheet text contains no at-import string anywhere, *including comments*. A comment mentioning one silently yields zero utilities, with no console error. Found and fixed while building `prototypes/` on 2026-10-04. Always start the `<style type="text/tailwindcss">` block with an explicit `@import "tailwindcss";`.
