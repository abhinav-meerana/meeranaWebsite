# 08 — Scroll & animation specification

**Governing skills:** `meerana-scroll-choreography`, `meerana-webgl-scenes`.

## Conventions
- **Engine:** GSAP ScrollTrigger on native scroll, one timeline per chapter, built inside `gsap.matchMedia()` with three branches:
  - `desktop`: `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`
  - `tablet`: `(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)`
  - `mobile`: `(max-width: 767px) and (prefers-reduced-motion: no-preference)`

  Reduced motion gets no timeline at all: final states + step buttons.
- **Pin types:**
  - **sticky stage**: a visual sticks while text scrolls.
  - **hard pin**: nothing scrolls; scroll drives animation.
- **Hard-pin budget:** ≤ 150vh each, ≤ 300vh per page (desktop); none on the mobile homepage.
- **Ranges** are written as ScrollTrigger `start → end` (`"top 70%" → "bottom 40%"`).
- **Ids:**
  - `M-home-NN`: homepage
  - `M-<slug>-NN`: product page
  - `M-global-NN`: site-wide
- **Fallback vocabulary:**
  - *Poster*: pre-rendered final-state image of the scene, same framing.
  - *Steps*: visible `StepList` buttons driving the same state machine.

---

## Global

### M-global-01 — Section entrance (text and cards)
- **Purpose:** signal a new section without hiding content.
- **Technique:** CSS only. An IntersectionObserver adds `.is-in`. Translate 16 px → 0 and opacity 0 → 1 over 240 ms, staggered 60 ms across ≤ 4 items. Progressive `animation-timeline: view()` where supported.
- **Initial state:** content is visible by default. The hidden pre-state is applied only when JS has run *and* motion is allowed, so no-JS users see everything.
- **Mobile:** same, with distances halved.
- **Reduced motion:** none.
- **Failure:** if JS fails, content is visible.
- **Performance risk:** negligible.

### M-global-02 — Header behaviour
- **Purpose:** keep navigation and the product index reachable at all times.
- **Behaviour:**
  - Transparent over the hero.
  - After 80 px of scroll: solid surface, 1 px border, and a 64 px compact height (transition 160 ms).
  - Never hides on scroll-down. Visitors must always be able to jump to products or contact.
- **Reduced motion:** instant change.

### M-global-03 — Chapter progress & skip
- **Purpose:** orientation inside long chapters.
- **Behaviour:** a thin progress rail on the chapter's inline-start edge, plus a "Skip to <next section>" link that becomes visible on focus and on hover of the rail.
- **Mobile:** the rail is hidden; the skip link stays in the tab order.

---

## Homepage

The entries below cover the homepage sections planned in 06 (H1–H11). Each product chapter entry follows the same structure, with its product-specific beat filled in 06/07.

### M-home-01 — Hero: lattice assembles into the Meerana symbol, then opens into the model
- **Narrative purpose:** introduce the brand's own geometry (the logo lattice) as the building block of everything that follows. "Meerana builds the systems an organisation runs on, cell by cell."
- **Trigger and range:**
  - On load: the assemble animation, ≤ 1.6 s, plays once.
  - Scroll: hero `top top` → `bottom top` scrubs the camera pull-back from the symbol to the full model (the model appears in M-home-03).
- **States:**
  - Initial: the poster (symbol on navy, DOM headline visible immediately; LCP = headline text).
  - Intermediate: cells drift into the isometric symbol.
  - Final: the symbol tilts to isometric and the camera begins to pull back.
- **Pin:** none. The hero is 100svh and scrolls away normally.
- **Movement:** camera dolly-out and slight tilt (scene); headline static; product index chips fade/slide in after 400 ms (DOM, M-global-01).
- **Transition:** the canvas slot continues into the sticky stage of H3.
- **Mobile:** poster image of the symbol plus a CSS shimmer on the lattice lines (opacity only); no WebGL on the hero.
- **Reduced motion:** poster only.
- **Fallback:** poster; no layout shift (slot has fixed aspect ratio).
- **Performance risks:**
  - The first WebGL initialisation competes with LCP. Mitigation: delay `Stage` creation until `requestIdleCallback` *after* LCP, so the hero assembly may start ~300 ms late. Accepted.
  - Instanced cells (≤ 400 instances).

### M-home-03 — Ecosystem model: four operating zones
- **Narrative purpose:** show *where* each product operates, as a spatial map. This is the strongest reason for 3D on the site.
- **Composition:** sticky stage (desktop: right 7 columns; tablet: top) with an isometric "architectural model" built from lattice cells:
  - perimeter and gate (Wasel)
  - site under construction with camera masts (Yisbir)
  - office building (Mandoobee)
  - an abstract process layer floating above the departments (Tasree3)

  Zones are labelled in the DOM: a legend list beside the stage, not canvas text.
- **Trigger and range:** section `top 80%` → `bottom bottom`. The stage becomes sticky at `top top`.
- **States:**
  - Initial: model in neutral white/grey; all zones equal.
  - Intermediate: zones highlight in sequence as the legend items scroll past. Product accent applies to that zone only.
  - Final: the camera eases toward the first chapter's zone.
- **Pin type:** sticky stage across H3 and all product chapters (H4–H7). Text scrolls normally. No hard pin.
- **Mobile:**
  - No sticky stage. One static isometric illustration (poster) with the 4 zones numbered.
  - The legend is a list linking to each chapter and its product page.
- **Reduced motion:** poster + legend.
- **Fallback:** poster. Zone highlight states are pre-rendered as 4 posters, swapped by IntersectionObserver (cross-fade 0 ms in reduced motion).
- **Performance risks:** model ≤ 120k triangles (instanced), 1 directional light + ambient, baked AO texture ≤ 1024².

### M-home-04…07 — Product chapter pattern (Wasel, Yisbir, Mandoobee, Tasree3)
- **Narrative purpose:** one operational problem → one interface moment → a door to the full story.
- **Trigger:** chapter `top 75%` → `bottom 25%`, as text scrolls past the sticky stage.
- **States:**
  1. **Approach:** the camera flies to the product's zone; the zone takes the product accent; text beat 1 (problem) is in view.
  2. **Resolve:** the zone "resolves into its interface". A DOM `DemoFrame` scales from the zone's projected screen rectangle to its resting position (FLIP-style, transform only) while the 3D zone dims to 30%. Text beat 2 (one task) is in view.
  3. **Act:** one demo step plays (or is clicked), e.g. Wasel "Open gate" raises the 3D barrier. The step's result is stated in text.
  4. **Exit:** the `DemoFrame` scales back down, and the camera eases to the next zone (or out to the full model after the last chapter).
- **Pin type:** sticky stage. ~125vh of text per chapter.
- **Mobile:** inline per chapter: a static zone poster, then the `DemoFrame` (phone-first variant) with step buttons; no fly-through.
- **Reduced motion:** final-state `DemoFrame` with step buttons; zone poster.
- **Fallback:** the `DemoFrame` is DOM, so it works without WebGL; only the zone visuals fall back to posters.
- **Performance risks:** the FLIP calculation must read layout once per chapter enter (not per frame). The demo's DOM must avoid large `backdrop-filter`.

### M-home-08 — Deployed on your terms (H8)
- **Purpose:** state per-product deployment facts clearly. This section is about trust, not spectacle.
- **Technique:** entrance only (M-global-01). The four fact rows reveal with a 60 ms stagger. Optionally, a single static lattice "boundary" line drawn once (CSS `stroke-dashoffset`, 600 ms) marks "inside your organisation". It never loops.
- **Mobile:** same, with no line animation.
- **Reduced motion:** static.

### M-home-09 — How Meerana delivers (H9, services)
- **Purpose:** show the four service lines as one delivery capability.
- **Technique:** a horizontal row of lattice cells fills as the columns scroll into view (CSS, M-global-01 variant). No pin.
- **Mobile:** an accordion with a cell icon per item.
- **Reduced motion:** static, all filled.

### M-home-10 — Proof (H10)
- **Purpose:** trust, built only from verified awards, partners and events.
- **Technique:** entrance only. **No counters animating from zero**: they distract and misstate. Static numbers only, and only if verified.

### M-home-11 — Contact close (H11)
- **Purpose:** action.
- **Technique:** none beyond entrance. The form is never animated in a way that delays input.

---

## Product pages

Per-product entries (`M-wasel-*`, `M-yisbir-*`, `M-mandoobee-*`, `M-tasree3-*`) are specified with their storyboards in **07** so each animation sits next to the beat it serves. All of them follow the conventions above.

---

## Round 3 (2026-10-11): pointer to the binding spec

For product pages, the homepage hero and the homepage gallery, `docs/r2/FINAL-SPEC.md` supersedes this file. Where the two disagree, the spec wins. The motion ids are:

| Id | What | Spec |
|---|---|---|
| `M-stage-01` | Product story engine: CSS-sticky pin, one root ScrollTrigger, layer rates (floor 0.25×, background 0.70×, midground 0.88×, copy 1.00×, gutter label 1.15×), settle (one gesture moves one scene), keys, focus follow, chapter cut, hash | §4.3, §4.6, §4.7 |
| `M-<slug>-S01…S14` | Per-scene choreography for each product (`mandoobee`, `tasree3`, `nazo`, `yisbir`, `wasel`, `ai-in-a-box`), from the registry in `components/stage/choreo.ts`, plus the act wipes and cuts | §4.8, §6.2 |
| `M-home-gallery` (revised) | Gallery pin from ≥ 1024×520: CSS sticky, 250svh travel, per-card settle, three depth layers per card | §8 |
| `M-home-hero-01…05` | Hero entrance, pointer orbit, scroll exit, hand-off to the gallery (40svh, D15) and the CSS depth band | §7.5 |

What changes in the conventions above:
- **Pin budget:** the homepage total stays ≤ 300vh (gallery 250svh + hero hand-off 40svh). Product pages are exempt, at one step per scene (DD-26a).
- **Hard pins:** the gallery and the product story are not GSAP hard pins any more. Each is CSS `position: sticky` with one un-pinned scrubbed trigger (DD-26d).
- **Breakpoint branches:** horizontal motion runs at ≥ 1024×520 with a fine pointer and motion allowed (`MQ.stage`, `MQ.pinned`; DD-26b). Everything else is a native snap rail (DD-26e).
- **Reduced motion:** a static horizontal rail with final states, never a vertical stack (DD-26c).

The acceptance checks are FINAL-SPEC §12: `scripts/verify-stage.mjs` (P-01…P-22), `scripts/verify-home.mjs` (alias `verify-landing.mjs`; H-, G-, S- ids and the §3.3 token values) and `scripts/verify-launch.mjs` (cross-route, X-01).
