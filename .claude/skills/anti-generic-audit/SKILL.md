---
name: anti-generic-audit
description: Audit any generated or hand-built web page (HTML, JSX/TSX, prototype or live URL) for "AI slop" and template markers, and fail it with a specific fix for every failure. The markers are default Tailwind palette, purple/indigo gradient heroes, emoji bullets, Lorem/placeholder text, identical card grids, Inter-only typography with no display face, stock or robot illustrations, centred-everything layouts, no signature interaction, glassmorphism stacks, gradient buttons, fake macOS window chrome, unverified numbers, hype language, hidden LCP text and missing reduced-motion handling. Use it before any design review, before shipping a page, after generating UI with an AI tool, when reviewing a prototype or pull request, or when someone says "this looks generic", "does this look like a template", "review this page", "is this premium enough" or "audit the site".
---

# Anti-generic audit

## Purpose
A page passes only if it could not be mistaken for a template:
- It shows the company's real product, facts and geometry.
- It has one deliberate signature interaction.
- Every visual device earns its place.

This skill **fails** pages with template markers and **prescribes a concrete fix for each failure**. A failure without a fix is not a finished audit.

## When to use
- Before any review or merge of a page or section.
- After an AI tool, Figma Make or a template produced UI.
- On the live site, on prototypes (`prototypes/*.html`) and on built routes.

## Workflow
1. **Static scan (deterministic):**
   ```bash
   python .claude/skills/anti-generic-audit/scripts/audit_page.py <page.html | component.tsx> --brand meerana|yisbir [--strict]
   ```
   - Exit code 1 means at least one FAIL.
   - `--strict` turns unbacked numbers (G13) into FAIL. Use it for production builds.
   - For motion specifics, also run `python .claude/skills/web-animations/scripts/motion_lint.py <path>`.
2. **Rendered pass (manual, at 1440 and 390 px):** work through `references/checklist.md`. These checks need eyes: imagery, composition, rhythm, the "swap the logo" test and the squint test. Take screenshots: hero, first scroll, one mid-page section, footer.
3. **Report** with `references/report-template.md`. Every FAIL row carries:
   - the evidence (selector, class, line, screenshot region);
   - the **specific fix** (`references/fix-recipes.md`), naming exact tokens, components and copy changes.
4. **Re-run** after fixes. A page ships at **0 FAIL**. WARNs need a written justification in the report.

## The checks
`audit_page.py` implements the automated checks. The visual-review items live in `references/checklist.md`.

| ID | Marker (FAIL unless noted) | Automated | Typical fix |
|---|---|---|---|
| G01 | Default Tailwind palette (`slate-*`, `indigo-*` …) | ✓ | Reset the palette and use ui-system semantic tokens. The script maps each class to its token. |
| G02 | Purple/indigo/violet gradients (hero, text, CTA) | ✓ | Delete. Brand ramp only, as a 1 px rule. |
| G03 | Emoji as icons or bullets | ✓ | Lucide 1.5 px, or text |
| G04 | Lorem / placeholder / TODO copy | ✓ | Real copy with an evidence id, or delete |
| G05 | Identical card grids (≥ 3 same-structure cards) | ✓ heuristic | Bento with differentiated cells, a placard rail, a list, or real UI |
| G06 | Inter-only / generic typography; no display face; off-brand fonts | ✓ | Brand faces + display treatment (Poppins 300/600; Montserrat 500/600) + mono for metadata |
| G07 | Stock or "AI robot / brain" imagery | ✓ (URLs, alt) + visual | Model output, product UI, lattice line art, verified photography |
| G08 | Centred-everything; centred hero (WARN) | ✓ heuristic | Left-aligned 12-column hero; centring only for one closing line |
| G09 | No declared signature interaction, or more than one | ✓ (`data-signature`) | Exactly one signature that explains something |
| G10 | Glassmorphism stacking (≥ 2 backdrop-filters; 1 = WARN) | ✓ | Opaque raised surface + hairline |
| G11 | Gradient buttons / glow CTAs | ✓ | Flat `bg-action` |
| G12 | Fake macOS traffic-light chrome | ✓ | The product's own chrome, or a neutral frame + provenance label |
| G13 | Numbers without evidence (WARN; FAIL with `--strict`) | ✓ | `data-ev="EV-###"`, or a labelled `data-illustrative` frame, or drop the number |
| G14 | Hype filler ("revolutionary", "seamless", "AI-powered" ×3+) (WARN) | ✓ | Workflow verbs and nouns |
| G15 | H1/H2 over 8 words (WARN) | ✓ | Cut; move the rest to the lede |
| G16 | Not exactly one `<h1>` | ✓ | One h1 |
| G17 | `<img>` without alt | ✓ | Meaningful alt / `alt=""` |
| G18 | Motion without reduced-motion handling | ✓ | CSS + JS reduced branches |
| G19 | Loop > 5 s without a pause control (WARN) | ✓ | `data-motion-control` button |
| G20 | Missing title/description/lang; default CRA description (FAIL) | ✓ | Metadata API |
| G21 | ISO logo / roundel badges | ✓ | Certificate wording + the certification body's mark only |
| G22 | Hero H1 hidden at first paint | ✓ | Visible LCP text |
| G24 | Off-brand neon/purple hex (Meerana) | ✓ | Brand tokens |
| V1–V12 | Visual and judgement checks: "swap the logo" test, real product visible above the fold, rhythm, density, imagery provenance, copy specificity, motion purpose … | Manual (`references/checklist.md`) | See the recipes |

## Waivers (visible, never silent)
- **Element level (G05 only):** `data-audit-ok="G05"` on the parent of a deliberately repeated structure, such as the single product index or a placard rail. It is reported as INFO with the element, and the report must say why.
- **Page level:** `data-audit-ok="G09"` on `<html>` or `<body>`, **plus** `data-audit-reason="…"`. Use it for pages that are not landing pages, such as an internal prototype index with no signature motion. It is reported as INFO with the reason. A waiver without a reason raises a WARN (G00).
- Never waive G01–G04, G13, G16–G18 or G20–G24 on a public page. Those are defects, not judgement calls.

## Scoring
- Score = 100 − 15 per FAIL − 5 per WARN (floor 0).
- **The verdict is binary**: PASS only with zero FAIL. The score just tracks progress.

## Relationship to project skills
- Fixes must respect:
  - `meerana-brand` (colours, fonts, logos);
  - `ui-system` (tokens, components);
  - `web-animations` (signature rule, reduced motion);
  - `meerana-evidence` (numbers, partners, awards);
  - `meerana-product-ui` (provenance labels, sample data);
  - `meerana-narrative` (copy voice).
- This audit is a pre-gate for `meerana-a11y-responsive`, which remains the release gate.

## Known limits
- Heuristics can misfire. G05 may flag a legitimately repeated list; G08 may flag an intentionally centred closing line. Justify those as WARN in the report.
- The script can't see rendered colour on images or canvas, judge photo authenticity, or tell whether a signature motion is *meaningful*. Those belong to the manual checklist.
