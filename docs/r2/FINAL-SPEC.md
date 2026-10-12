# Horizontal product stories and responsive landing: final spec

Design lead synthesis, 2026-10-11. Project root: `C:\Users\abhin\Desktop\meerana`.

**Base design:** A (Film Strip). It takes the following from B (Engineering Stage):
- the perspective lattice floor;
- the installed module (plinth and registration marks);
- callouts on real screens;
- the walkthrough laid out as horizontal stations;
- the single-writer rule and the dwell assertion;
- the scroll-per-scene formula;
- container-unit centring;
- the stored list-view preference.

The landing spec is adopted for the hero, the gallery and the fluid type system, with changes listed in §2.

I re-checked several items against the repository before writing:
- `body { overflow-x: hidden }` is set in `app/globals.css:69`.
- `--fs-*` is already the font-size token namespace in `app/tokens.css:91-97`.
- `MQ.pinned` is set to ≥1280×760 in `lib/breakpoints.ts`.
- EV-422 is internal-only.
- EV-427 is `confirm-with-meerana`, which conflicts with EV-116 ("Arabic and English").
- EV-520 and EV-521 are not in either evidence register.
- The current copy contains several do-not-say strings. They are listed in §5.6.

---

## 0. Scores

| Criterion | A: Film Strip | B: Engineering Stage |
|---|---|---|
| Fidelity to the client's ask (horizontal, layered depth, cinematic per-scene motion, more content) | **9.5**: 5 depth layers, 14 per-kind choreographies, act wipes and cuts, 10–14 scenes, FAQ as its own scene | **8.5**: strong depth (perspective floor, plinth) and rich per-element motion, but no transitions or act structure; FAQ is folded into the last scene |
| Brand fit (isometric lattice, enterprise credibility, honesty) | **8**: one lattice, new isometric diagrams, PROVISIONAL and PREVIEW gating. Uses Mandoobee "Arabic and English" (EV-427 conflict). | **7.5**: best visual language (drafting floor, plinths, callouts). Honesty slips: Mandoobee "Arabic or English"; Yisbir face-recognition copy; AI in a Box FAQ repeats two do-not-say lines ("voice in English and Arabic", "the agent never signs"); "uniform … compliance" |
| Fit at short viewports | **8**: explicit fit proofs and tiers. But list view switches on automatically below 560 px tall, so 1366×768 at 125% (1093×529) would get a vertical list again. | **8.5**: fit tables down to 1024×560, `--scene-max` cap for tall screens, `100cqw` fix. Same 560 gate, but falls back to the rail rather than a list. |
| Accessibility and reduced motion | **8.5**: static horizontal rail, scenes are not landmarks, focus sync, cut for long jumps | **8.5**: same rail, single-writer table, dwell assertion. 13 `aria-labelledby` regions flood the landmark list. |
| Performance | **8.5**: CSS sticky (no pin spacer), one trigger per scene, `will-change` only on near scenes | **7.5**: GSAP `pin:true` plus up to 4 triggers per scene (≤50), CSS `contain` |
| Implementability in this codebase | **8**: choreography lives in one registry file, which suits parallel ownership. The `.fs-` prefix collides with the `--fs-*` font tokens. | **7.5**: data-attribute timings spread motion into every visual's JSX, coupling two owners. `calc(5*1fr)` and `gsap.utils.debounce` errors are already flagged by B itself. |
| **Weighted total** | **8.5** | **8.0** |

---

## 1. The final design in one paragraph

Every `/products/<slug>/` page becomes one horizontal strip of 12–14 full-viewport scenes in three acts (I The problem, II The product, III The fit). Vertical wheel, trackpad or keyboard input drives the strip. The strip sits behind a CSS-sticky pin with one root ScrollTrigger and no GSAP `pin`.

Each scene has separate planes:
- a global perspective lattice floor at 0.25× track speed;
- a background (accent field plus outlined big type) at 0.70×;
- a midground "installed module" (real screen or isometric diagram on a plinth, with real 3D entry and exit) at 0.88×;
- foreground copy at 1.00×, always at rest when the scene settles;
- a near gutter label at 1.15×.

One gesture moves one scene. Act changes use a shutter wipe, and long jumps use a cut.

On touch, narrow screens and reduced motion the same scenes become a native horizontal snap rail. List view is only automatic below 500 px of viewport height; otherwise it is opt-in.

The homepage uses one height-aware fluid unit, `--u`, so hero and gallery fit 1024×520 to 2560×1440:
- the hero always fits the first viewport;
- the 3D room is framed into the visible column;
- the gallery pins horizontally at every desktop or laptop size from 1024×520 up, with cards sized from the viewport and three depth layers per card.

---

## 2. Conflicts resolved

| # | Conflict | Resolution |
|---|---|---|
| C1 | Gate height: A/B/landing say 560, criticism says 520 | **≥1024×520**, fine pointer, motion allowed, for both the product stage and the gallery. This covers 1366×768 at 125% in Chrome (1093×529). A tight tier applies at ≤620 px tall. |
| C2 | Automatic list view (A: <560 tall; B: never) | Automatic only at **height ≤499 px**, in pure CSS. That is landscape phones and 200% zoom on laptops (WCAG 1.4.10). Otherwise list view is opt-in, stored, and also used for print. |
| C3 | Reduced motion (criticism suggested vertical) | **Static horizontal rail**, as A and B agree. The client explicitly rejected vertical, and Windows "Animation effects: off" reports `reduce`. |
| C4 | Pin mechanism (B and landing use GSAP `pin`) | **CSS sticky plus one un-pinned root trigger** for both the product stage and the gallery. |
| C5 | Scroll per scene: A `clamp(560px,50vw,840px)`, B `clamp(480px,.7vh,720px)` | **B's formula**, `--ps-step: clamp(480px, 70svh, 720px)`. Settle makes it one notch per scene anyway, and the shorter document makes the scrollbar honest. |
| C6 | Naming: A's `.fs-*`/`--fs-*` collides with the font tokens; B's bare `.scene` is generic | **`.ps-*` classes and `--ps-*` variables** for the product story; `.sc-*` stays for the gallery. |
| C7 | A and B assume a 72 px header; the landing spec makes it fluid | The header is fluid, `clamp(56px, 4.6u, 72px)`. All stage geometry reads `var(--header-h)`. |
| C8 | Three type systems (vw-only, min(vw,vh), `--u`) | Every role is a `--u` token in `app/tokens.css` (§3.2). No ad-hoc clamps in component CSS. |
| C9 | Far layer: flat lattice drift (A) vs perspective floor (B) | **B's floor.** Period fixed to **448 px**: the 224 px accent family has a 448 px horizontal period, so B's wrap at 112 would visibly jump. |
| C10 | Choreography authored as a registry (A) or as data attributes (B) | **A's registry** (`components/stage/choreo.ts`), using B's preset vocabulary, B's single-writer table and a dev-only dwell assertion. Visual components only emit hook class names (§6.2). |
| C11 | FAQ: separate scene (A) or inside `next` (B) | **Separate `faq` scene** (more content, fits the 1024×520 budget, §4.4). |
| C12 | Walkthrough: steps in the mid column (A) or stations (B) | **B's stations** in a `wide` layout at ≥1024: steps run along the direction of travel. A vertical list is used below 1024. Stations are the only copy of the steps. |
| C13 | Callouts on screens (B only) | Adopted. At most 3 per screen. `text` must be visible verbatim in the image; a `note` needs an ok-to-use EV. None on AI in a Box (EV pending). |
| C14 | Scenes as landmarks (B) | No. Scenes are unnamed `<section>`s; headings carry the structure (A). |
| C15 | Gallery geometry (A / B / landing) | **Landing geometry and container-query variants**, using `cqw` instead of `vw`, controls inside the pin, heading outside. CSS owns card opacity (0.35/1, A's I7); GSAP owns transforms only. |
| C16 | Gallery depth (A: per-card child triggers; landing: c-model) | **c-model**, driven from the **tween's** `onUpdate` (smoothed), not ScrollTrigger's `onUpdate` (raw), so layers match the track. |
| C17 | Neighbour noise: blur 2px (audit), opacity only (current) | **No filters (I3).** Neighbours are scaled to 0.94, at opacity 0.35, with static edge-fade overlays over the peeks. |
| C18 | Homepage pin budget | Gallery travel 250svh plus the hero sticky hand-off 40svh = **290svh ≤ 300**. Product pages are exempt (client override, D1). |
| C19 | Honesty slips in both designs | §5.6 is binding. It excludes Mandoobee bilingual, Yisbir face copy, "uniform", AI in a Box "voice EN/AR" and "never signs", "immutable", parking and toll, and time-limited grants. |
| C20 | `body{overflow-x:hidden}` and sticky | Sticky works today because the value propagates to the viewport. **Rule:** `.ps-pin` and `.sc-pin` are `overflow: clip`, so off-screen scenes never add to the document's scroll width and focus can never scroll the viewport sideways. No ancestor of `.ps` may get `overflow: hidden/auto`. |

---

## 3. Shared foundations (owner E, delivered first as contracts)

### 3.1 `lib/breakpoints.ts` (replace the whole file)

```ts
/**
 * Breakpoints, one set for CSS and JS. Width: 480/768/1024/1280. Height tiers: tight ≤620, compact ≤760, list ≤499.
 * DD-23 amended 2026-10-11 (client): horizontal stage and gallery from 1024×520 (was 1280×760).
 */
export const BP = { sm: 480, md: 768, lg: 1024, xl: 1280 } as const;
export const STAGE_MIN_H = 520;
export const LIST_MAX_H = 499;
/** @deprecated alias, kept for existing imports */
export const PIN_MIN_HEIGHT = STAGE_MIN_H;

const STAGE = `(min-width: ${BP.lg}px) and (min-height: ${STAGE_MIN_H}px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`;

export const MQ = {
  md: `(min-width: ${BP.md}px)`,
  lg: `(min-width: ${BP.lg}px)`,
  xl: `(min-width: ${BP.xl}px)`,
  /** Product stage (scrubbed horizontal story). */
  stage: STAGE,
  /** Homepage gallery pin: same gate as the stage. */
  pinned: STAGE,
  /** Automatic list view (landscape phones, 200% zoom). */
  listOnly: `(max-height: ${LIST_MAX_H}px)`,
  heroSplit: "(min-width: 900px) and (min-aspect-ratio: 5/4) and (min-height: 500px)",
  roomWebgl: "(min-width: 1024px) and (min-aspect-ratio: 5/4) and (min-height: 500px)",
  compact: "(max-height: 760px)",
  tight: "(max-height: 620px)",
  finePointer: "(hover: hover) and (pointer: fine)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
```

CSS media queries use these literal values only. F's lint step greps `app/*.css` for any `@media` value outside {479, 480, 599, 600, 767, 768, 1023, 1024, 1279, 1280, 499, 500, 520, 620, 700, 760}.

### 3.2 `app/tokens.css` additions (inside `@layer tokens :root`; values replace existing ones where the names match)

```css
--u: min(1vw, 1.85svh);                       /* width-driven until shorter than ~16:9, then height-driven */
--fs-hero:    clamp(2.25rem, calc(5.2 * var(--u)), 7.5rem);      /* homepage H1 only */
--fs-display: clamp(2.25rem, calc(4.4 * var(--u)), 6rem);        /* CTA headline (.t-display) */
--fs-h2:      clamp(1.75rem, calc(2.6 * var(--u)), 2.75rem);
--fs-lede:    clamp(1.0625rem, calc(1.45 * var(--u)), 1.5rem);
--fs-sc-name: clamp(1.75rem, calc(3.4 * var(--u)), 3.25rem);
--fs-ps-title:     clamp(2.25rem, calc(4.4 * var(--u)), 4.5rem);   /* product title H1 */
--fs-ps-h:         clamp(1.5rem,  calc(2.9 * var(--u)), 2.75rem);  /* scene H2 */
--fs-ps-statement: clamp(2rem,    calc(4   * var(--u)), 4rem);     /* value / next H2 */
--fs-ps-body: clamp(0.9375rem, calc(0.55rem + 0.6 * var(--u)), 1.0625rem);  /* floor 15px */
--fs-ps-item: clamp(0.8125rem, calc(0.5rem + 0.5 * var(--u)), 0.9375rem);   /* floor 13px */
--fs-bigtype: clamp(9rem, 38svh, 26rem);
--sp-fluid-xs: clamp(6px,  calc(0.8 * var(--u)), 12px);
--sp-fluid-s:  clamp(10px, calc(1.9 * var(--u)), 32px);
--sp-fluid-m:  clamp(16px, calc(3.2 * var(--u)), 56px);
--sp-fluid-l:  clamp(32px, calc(5   * var(--u)), 96px);
--section-py:  clamp(48px, calc(7   * var(--u)), 128px);
--header-h: clamp(56px, calc(4.6 * var(--u)), 72px);
--content-max: clamp(1280px, 72vw, 1560px);
--dur-cinematic: 900ms;
```

Unlayered, after the layer, so these win:

```css
@media (orientation: portrait) { :root { --u: min(1.5vw, 1.1svh); } }
@media (orientation: portrait) and (max-width: 599px) { :root { --u: min(2.15vw, 1.1svh); } }
```

`.t-display`, `.t-h2` and `.t-lede` in `globals.css` read the new tokens. Body, small and label stay at 17, 15 and 13 px.

### 3.3 Resolved values (implementations must match within ±1 px; F asserts them)

| Viewport | `--u` | header | hero H1 | ps title | scene H2 | ps body |
|---|---|---|---|---|---|---|
| 1024×520 | 9.62 | 56 | 50.0 | 42.3 | 27.9 | 15 |
| 1093×529 | 9.79 | 56 | 50.9 | 43.1 | 28.4 | 15 |
| 1280×601 | 11.12 | 56 | 57.8 | 48.9 | 32.2 | 15.5 |
| 1366×657 | 12.15 | 56 | 63.2 | 53.5 | 35.2 | 16.1 |
| 1536×730 | 13.50 | 62 | 70.2 | 59.4 | 39.2 | 16.9 |
| 1440×900 | 14.40 | 66 | 74.9 | 63.4 | 41.8 | 17 |
| 1536×864 | 15.36 | 71 | 79.9 | 67.6 | 44 | 17 |
| 1920×937 | 17.33 | 72 | 90.1 | 72 | 44 | 17 |
| 2560×1440 | 25.60 | 72 | 120 | 72 | 44 | 17 |
| 768×1024 (portrait) | 11.26 | 56 | 58.6 | 49.5 | 32.7 | 15.6 |
| 390×844 | 8.39 | 56 | 43.6 | 36.9 | 24.3 | 15 |
| 375×667 | 7.34 | 56 | 38.2 | 36 | 24 | 15 |

---

## 4. Product story (owner A, with B's visuals)

### 4.1 Modes

| Mode | When | Layout | Motion |
|---|---|---|---|
| `pending` | Server HTML and before hydration | Rail styles (or list styles if `html[data-view="list"]`) | None |
| `stage` | `MQ.stage` and list view not chosen, **after** GSAP has built | Sticky pin; vertical scroll drives the track | Layers, choreography, settle, keys |
| `rail` | Anything else with height ≥500: touch, <1024 wide, short (500–519), reduced motion | Native `overflow-x:auto; scroll-snap-type:x mandatory`, 1 scene = 100% | CSS view-timeline parallax only when motion is allowed (§4.9); static under reduced motion |
| `list` | `@media (max-height:499px)` (CSS only), the List view toggle (`localStorage["meerana:view"]="list"`), or `@media print` | Scenes stacked, each composed as a frame | None |

```ts
// components/stage/useStageMode.ts
export type StageMode = "pending" | "stage" | "rail" | "list";
export function useStageMode() {
  const [mode, setMode] = useState<StageMode>("pending");
  const [list, setList] = useState(false);
  useEffect(() => { try { setList(localStorage.getItem("meerana:view") === "list"); } catch {} }, []);
  useEffect(() => {
    const st = matchMedia(MQ.stage), lo = matchMedia(MQ.listOnly);
    const decide = () => setMode(list || lo.matches ? "list" : st.matches ? "stage" : "rail");
    decide(); st.addEventListener("change", decide); lo.addEventListener("change", decide);
    return () => { st.removeEventListener("change", decide); lo.removeEventListener("change", decide); };
  }, [list]);
  const setListView = (v: boolean) => { setList(v); try { localStorage.setItem("meerana:view", v ? "list" : "deck"); } catch {}
    try { document.documentElement.dataset.view = v ? "list" : ""; } catch {} };
  return { mode, setListView };
}
```

- `data-mode="stage"` is written to `.ps` only after `buildStage()` succeeds. If GSAP fails, the page stays in rail.
- Mode changes keep the scene:
  - rail → stage maps `round(scrollLeft / clientWidth)` to `restY(i)`;
  - stage → rail maps the index back to `scrollLeft`;
  - list maps to `scene.offsetTop`.

### 4.2 Geometry: one frame in every mode (no CLS when stage turns on)

```css
/* app/stage.css (A) */
.ps {
  --ps-step: clamp(480px, 70svh, 720px);
  --ps-dock: 56px;
  --ps-pad-y: clamp(8px, 2.4svh, 32px);
  --ps-content-h: min(calc(100svh - var(--header-h) - var(--ps-dock) - 2 * var(--ps-pad-y)), 820px);
  --p-line: var(--p-accent-2, var(--p-accent));
  position: relative;
}
@media (max-height: 760px) { .ps { --ps-dock: 52px; } }
@media (max-height: 620px) { .ps { --ps-dock: 48px; } }

.ps-pin   { position: relative; height: 100svh; overflow: clip; container-type: inline-size; }
.ps[data-mode="stage"]          { height: calc(100svh + (var(--ps-n) - 1) * var(--ps-step)); }
.ps[data-mode="stage"] .ps-pin  { position: sticky; top: 0; }
.ps-track { position: relative; z-index: 1; display: flex; height: 100%; }
.ps[data-mode="stage"] .ps-track { will-change: transform; }
.ps-scene { position: relative; flex: 0 0 100%; height: 100%; overflow: clip; isolation: isolate; contain: layout paint style; }
.ps-frame {
  position: absolute; inset: var(--header-h) 0 var(--ps-dock); z-index: 2;
  max-width: var(--content-max); margin-inline: auto; padding: var(--ps-pad-y) var(--gutter);
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(16px, 2vw, 32px);
  align-items: center; align-content: center;
}
.ps-scene[data-layout="split"]   .ps-fg  { grid-column: 1 / 6; }
.ps-scene[data-layout="split"]   .ps-mid { grid-column: 7 / -1; }
.ps-scene[data-layout="reverse"] .ps-mid { grid-column: 1 / 7; grid-row: 1; }
.ps-scene[data-layout="reverse"] .ps-fg  { grid-column: 8 / -1; grid-row: 1; }
.ps-scene[data-layout="wide"]    .ps-fg  { grid-column: 1 / -1; grid-row: 1; display: grid; grid-template-columns: minmax(0,7fr) minmax(0,5fr); column-gap: inherit; align-items: end; }
.ps-scene[data-layout="wide"]    .ps-body{ grid-column: 2; grid-row: 1 / span 2; }
.ps-scene[data-layout="wide"]    .ps-mid { grid-column: 1 / -1; grid-row: 2; }
.ps-scene[data-layout="center"]  .ps-fg  { grid-column: 2 / 12; text-align: center; }
.ps-scene[data-kind="title"]     .ps-fg  { grid-column: 1 / 7; }
@media (max-height: 620px) {
  .ps-scene[data-layout="split"] .ps-fg, .ps-scene[data-kind="title"] .ps-fg { grid-column: 1 / 7; }
  .ps-scene[data-layout="split"] .ps-mid { grid-column: 7 / -1; }
  .ps-scene[data-layout="reverse"] .ps-fg { grid-column: 7 / -1; }
}
.ps-mid { min-width: 0; max-height: var(--ps-content-h); display: grid; place-items: center; }
```

**Never `100vw` for scene or track geometry.** A scene is 100% of the pin, and the pin excludes the scrollbar.

**Content box (`--ps-content-h`), computed:**

| Viewport | Tier | Header | Dock | Pad | Content box |
|---|---|---|---|---|---|
| 1024×520 | tight | 56 | 48 | 12.5 | **391** |
| 1093×529 | tight | 56 | 48 | 12.7 | **400** |
| 1280×601 | tight | 56 | 48 | 14.4 | **468** |
| 1366×657 | compact | 56 | 52 | 15.8 | **517** |
| 1536×730 | compact | 62 | 52 | 17.5 | **581** |
| 1536×864 | normal | 71 | 56 | 20.7 | 696 |
| 1440×900 | normal | 66 | 56 | 21.6 | 735 |
| 1920×937 | normal | 72 | 56 | 22.5 | 764 |
| ≥1920×1080 | normal | 72 | 56 | ≥26 | 820 (cap; frame centred) |

**Scroll length** is (N − 1) × step. At 1366×657 the step is 480 px, so Tasree3 (14 scenes) is 6,240 px. At 1920×937 the step is 656 px, so Tasree3 is 8,528 px.

**Fit proof at 1024×520** (content box 391; the copy column is 6 columns = 461 px at the tight tier):

| Scene | Stack | Total |
|---|---|---|
| title | eyebrow 18 + H1 3 lines 133 + sub 3 lines 70 + name moment 20 + CTAs 44 + gaps 32 | **317** ✓ |
| walkthrough (wide, stations) | heading row 2-line H2 63 + body alongside; stations 5 × 172 px cols: n/label 40 + copy 4 × 19 + tick 12; gaps 32 | **≈230** ✓ |
| deploy (6 facts, 2 columns) | eyebrow 18 + H2 2 lines 63 + body 3 lines 70 + facts 3 rows × 54 + 16 + gaps 32 | **361** ✓ |
| usecases (wide, 3×2 tiles) | heading row 63 + tiles 2 × 97 + 8 + sectors line 20 + gaps 24 | **≈309** ✓ |
| Yisbir usecases (reverse, 4 cases 2×2) | 18 + 63 + body 47 + cases 2 × 100 + 8 + gaps 24 | **360** ✓; screen 460×287 + provenance 24 |
| faq (wide, 2×2) | 18 + H2 31 + 2 rows × 86 + 16 + gaps 32 | **269** ✓ |

These fit only if the budgets in §5.3 hold.

### 4.3 Depth stack

| Z | Layer | Class | Contents | Rate (×track) | Offset rule |
|---|---|---|---|---|---|
| 0 | Far, global | `.ps-far > .ps-floor > .ps-floor-grid`, `.ps-horizon` | Lattice floor in perspective. This is the **only** lattice on the page. | 0.25 | `x = −(p·travel·0.25) mod 448` via quickSetter |
| 1 | Background | `.ps-bg > .ps-field, .ps-bigtype` | Accent radial (centre 68%/32% by layout) and outlined big type, **on the media side** | 0.70 | `(p−0.5)·2W·0.30` |
| 2a | Shadow | `.ps-shadow` | Radial ellipse under the module (no filter) | 0.82 | `(p−0.5)·2W·0.18` |
| 2b | Midground | `.ps-mid > .ps-module > (.ps-plinth, .ps-reg ×4, .ps-stage3d > visual)` | Real screen or diagram, installed on a plinth with registration corners | 0.88 | `(p−0.5)·2W·0.12`, plus 3D choreography on `.ps-stage3d` |
| 3 | Foreground | `.ps-fg > .ps-copy` | Eyebrow, H1/H2, body, lists, CTAs | 1.00 | No rate tween; choreography only; identity at rest |
| 4 | Near | `.ps-near` (aria-hidden) | Vertical mono label "TASREE3 · 04 / 14" in the right gutter | 1.15 | `−(p−0.5)·2W·0.15` |
| 5 | Shutter | `.ps-shutter` (first scene of acts II and III only) | Solid `--p-bg` with act label "II · The product" | choreography | Off-scene at rest |
| – | Seam | `.ps-seam` | 1 px `--line-strong` at the scene's left edge, floor area only | 1.00 | – |

**Floor CSS** (from B, period corrected):

```css
.ps-far { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.ps-floor { position: absolute; left: -30%; right: -30%; bottom: -8%; height: 62%;
  transform: perspective(900px) rotateX(64deg); transform-origin: 50% 100%;
  -webkit-mask-image: linear-gradient(to top, #000 0 38%, transparent 92%); mask-image: linear-gradient(to top, #000 0 38%, transparent 92%); }
.ps-floor-grid { position: absolute; inset: 0 -448px; background-image:
  repeating-linear-gradient(30deg,  var(--lattice-line) 0 1px, transparent 1px 56px),
  repeating-linear-gradient(-30deg, var(--lattice-line) 0 1px, transparent 1px 56px),
  repeating-linear-gradient(30deg,  color-mix(in srgb, var(--p-line) 18%, transparent) 0 1px, transparent 1px 224px); }
.ps-horizon { position: absolute; inset: 0; background: radial-gradient(70% 45% at 50% 38%, color-mix(in srgb, var(--p-bg) 40%, transparent), transparent 70%); }
@media (prefers-reduced-motion: no-preference) { .ps-floor { animation: lattice-assemble var(--dur-signature) var(--ease-enter) both; } }
@media (forced-colors: active) { .ps-far, .ps-bg { display: none; } }
```

**Never animate `.ps-floor` itself.** GSAP's transform order would destroy the perspective.

**3D rules**
- Use `gsap.set(".ps-stage3d", { transformPerspective: 1400 })` per element. Do not use `preserve-3d` across the scene; clip and contain flatten it, and they should.
- Never fade an element that has 3D children. Fade the children instead.
- Static offsets inside visuals use the CSS `translate`/`scale` **properties**, never `transform`, so GSAP can own `transform`. For example, Yisbir layers use `translate: 0 calc(var(--i)*16px) calc(var(--i)*-36px)`.
- CSS has no hidden pre-states. GSAP applies `from` states only in stage mode.

**Big type:** `color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, var(--p-line) 26%, transparent)`, with a fill at 6% where stroke is unsupported. Font size is `var(--fs-bigtype)`, line-height 0.8. The text depends on the scene:
- `title`: the Arabic name moment (`lang="ar" dir="rtl"`; Tasree3 تسريع, Yisbir يسبر) or the product name;
- `value`: the product name;
- every other scene: its number.

### 4.4 Invariants (each is asserted in §12)

- **I1 Rest is final.** For scene-local p ∈ [0.46, 0.54]:
  - opacity 1 on every element;
  - identity transform on `.ps-fg` and every text node;
  - the shutter is outside the scene.
- **I2** `h1` and `h2` never animate opacity. They only move.
- **I3** Only `transform` and `opacity` are written. No filter, clip-path, size, box-shadow or stroke-dashoffset animation. Line draws are `scaleX`/`scaleY` on hairline elements.
- **I4** Text never sits on a picture. Copy and media are in separate grid columns. Big type sits on the media side.
- **I5** One root ScrollTrigger per film, plus one `containerAnimation` child timeline per scene. Trigger elements (`.ps-scene`, `.sc-panel`) are never animated.
- **I6** Layer-rate tweens use `ease:"none"`. Choreography uses power1–power3 only; no back, elastic or bounce.
- **I7, single writer:**
  - `.ps-track` x is written by the master tween only;
  - `.ps-floor-grid` x by the quickSetter only;
  - `.ps-bg`, `.ps-mid`, `.ps-shadow` and `.ps-near` x by layer rates only;
  - `.ps-stage3d`, `.ps-fg` children and visual hook classes by choreography only;
  - `.ps-track` opacity by cuts only.
  - The dev build throws if a choreography target is a layer wrapper.
- **I8** Every scene fits the content box at ≥1024×520 with no internal scroll.
- **I9** A real product screen appears at most once per page, is never shown above its intrinsic width, and always carries its provenance.
- **I10** With no JS, or if GSAP fails, the rail shows every scene in its final state.

### 4.5 Files and markup

| File | Owner | Role |
|---|---|---|
| `components/stage/ProductStage.tsx` (client) | A | Root: mode, markup, index state for the dock, keyboard, focus and hash wiring. Replaces `components/story/Story.tsx`. |
| `components/stage/Scene.tsx` (memoised) | A | One scene's layers and foreground lists |
| `components/stage/Dock.tsx` | A | Progress, chapters, counter, previous/next, List view |
| `components/stage/engine.ts` | A | `buildStage()` |
| `components/stage/choreo.ts` | A | `CHOREO[kind]`, `ENTER[transition]`, helpers, dev assertions |
| `components/stage/useStageMode.ts`, `useRail.ts` | A | Modes; rail index and buttons |
| `lib/settle.ts` | A | Shared settle (D consumes) |
| `components/stage/SceneVisual.tsx` | **B** | From `BeatVisual.tsx`: all `viz` kinds, with hook classes per §6.2 |
| `app/stage.css` | A | Replaces `app/story.css` |
| `app/viz.css` | **B** | Every `.viz-*`, `.port-*`, `.chain-*`, `.boundary-*`, `.callout*`, `.screen.is-fit` rule (moved out of `story.css`, then extended) |
| `app/products/[slug]/page.tsx` | A | `<ProductStage key={story.slug} story={story} />`; imports `../../stage.css` and `../../viz.css` |

```tsx
// ProductStage.tsx (abridged)
<div className="ps" data-mode={mode} data-static={reduced || undefined} data-slug={story.slug} ref={root}
     style={{ "--ps-n": scenes.length, "--p-bg": story.surface.bg, "--p-fg": story.surface.fg,
              "--p-accent": story.surface.accent, "--p-accent-2": story.surface.accent2 } as React.CSSProperties}>
  <a className="ps-skip" href="#ps-end">Skip the {story.name} story</a>
  <p className="sr-only">Use the arrow keys, Page Up, Page Down or Space to move between scenes.</p>
  <div className="ps-pin" ref={pin}>
    <div className="ps-far" aria-hidden="true"><div className="ps-floor"><div className="ps-floor-grid" /></div><div className="ps-horizon" /></div>
    <div className="ps-track" ref={track}
         {...(mode !== "stage" ? { tabIndex: 0, role: "region", "aria-label": `${story.name} story` } : {})}>
      {scenes.map((s, i) => <Scene key={s.id} scene={s} index={i} total={scenes.length} story={story} eager={i < 2} />)}
    </div>
    <Dock scenes={scenes} story={story} mode={mode} onGo={go} onListView={setListView} />
  </div>
</div>
<span id="ps-end" tabIndex={-1} />
```

```tsx
// Scene.tsx
<section className="ps-scene" id={s.id} data-kind={s.kind} data-layout={s.layout} data-enter={s.enter} data-act={s.act} data-i={index}>
  {index > 0 ? <span className="ps-seam" aria-hidden="true" /> : null}
  <div className="ps-bg" aria-hidden="true"><div className="ps-field" />
    <span className="ps-bigtype" lang={s.bigType?.lang} dir={s.bigType?.lang === "ar" ? "rtl" : undefined}>{s.bigType?.text ?? s.n}</span></div>
  {s.enter === "wipe" ? <div className="ps-shutter" aria-hidden="true"><span className="ps-shutter-act">{ACT_LABEL[s.act]}</span></div> : null}
  <div className="ps-frame">
    <div className="ps-fg"><div className="ps-copy">
      <p className="annot ps-eyebrow"><span className="tnum">{s.n}</span> · {s.eyebrow}</p>
      {s.kind === "title" ? <h1 className="ps-h ps-h1">{s.heading}</h1>
                          : <h2 className="ps-h" id={`${s.id}-h`} tabIndex={-1}>{s.heading}</h2>}
      {s.body ? <p className="ps-body">{s.body}</p> : null}
      <SceneLists scene={s} story={story} />   {/* .ps-features, .ps-facts (dl), .ps-cases (copy-column variant), .ps-faq (dl > .ps-qa), .ps-links, .ps-ctas, .ps-sectors */}
    </div></div>
    {s.viz.kind !== "none" ? (
      <div className="ps-mid"><span className="ps-shadow" aria-hidden="true" />
        <div className="ps-module"><svg className="ps-plinth" aria-hidden="true" />{/* 4 × */}<span className="ps-reg" aria-hidden="true" />
          <div className="ps-stage3d"><SceneVisual scene={s} story={story} eager={eager} /></div></div></div>
    ) : null}
  </div>
  <div className="ps-near" aria-hidden="true">{story.name} · {s.n} / {pad(total)}</div>
</section>
```

```tsx
// Dock.tsx
<nav className="ps-dock" aria-label={`${story.name} scenes`}>
  <div className="ps-progress" aria-hidden="true"><span className="ps-progress-bar" /></div>
  <ol className="ps-chapters">{scenes.map((s, i) => (
    <li key={s.id} className={i > 0 && scenes[i-1].act !== s.act ? "is-act-start" : undefined}>
      <a href={`#${s.id}`} aria-current={i === index ? "location" : undefined} onClick={(e) => onChapter(e, i)}>
        <span className="ps-tick" aria-hidden="true" /><span className="ps-chapter-label">{s.n} · {s.eyebrow}</span></a></li>))}</ol>
  <p className="annot ps-counter" aria-hidden="true"><span className="tnum">{scenes[index].n} / {pad(scenes.length)}</span> · {index === 0 ? hint : scenes[index].eyebrow}</p>
  <p className="sr-only" aria-live="polite" aria-atomic="true">{settledLabel}</p>  {/* updated on settle only */}
  <div className="ps-buttons">
    <button type="button" className="ps-btn" aria-label="Previous scene" disabled={index === 0} onClick={() => onGo(index - 1)}>←</button>
    <button type="button" className="ps-btn" aria-label="Next scene" disabled={index === scenes.length - 1} onClick={() => onGo(index + 1)}>→</button>
  </div>
  <button type="button" className="ps-view btn-text" aria-pressed={mode === "list"} onClick={toggle}>{mode === "list" ? "Horizontal view" : "List view"}</button>
</nav>
```

Dock rules:
- **Hint on scene 01:** "Scroll or press →" (stage), "Swipe for more" (coarse pointer), "Use ← → or the buttons" (reduced motion).
- **Size:** dock height is `var(--ps-dock)`, solid `color-mix(in srgb, var(--surface-deep) 94%, transparent)`, no backdrop-filter.
- **Ticks:** each is 24×44 px (WCAG 2.5.8); labels are clipped and shown on `:hover`/`:focus-visible`.
- **Buttons:** ≥44×44 px.
- **Below 768 px:** the chapter list moves into `<details><summary>All scenes</summary>`.
- **Before hydration:** `.ps:not([data-hydrated]) .ps-buttons { display:none }`.

**Class reference (A owns all `.ps-*`):** `.ps`, `[data-mode]`, `[data-static]`, `.is-live`, `.ps-skip`, `.ps-pin`, `.ps-far`, `.ps-floor`, `.ps-floor-grid`, `.ps-horizon`, `.ps-track`, `.ps-scene`, `[data-kind|layout|enter|act|i]`, `.is-near`, `.ps-seam`, `.ps-bg`, `.ps-field`, `.ps-bigtype`, `.ps-shutter`, `.ps-shutter-act`, `.ps-frame`, `.ps-fg`, `.ps-copy`, `.ps-eyebrow`, `.ps-h`, `.ps-h1`, `.ps-body`, `.ps-features`, `.ps-facts`, `.ps-fact`, `.ps-cases`, `.ps-case`, `.ps-faq`, `.ps-qa`, `.ps-links`, `.ps-ctas`, `.ps-sectors`, `.ps-mid`, `.ps-shadow`, `.ps-module`, `.ps-plinth`, `.ps-reg`, `.ps-stage3d`, `.ps-near`, `.ps-dock`, `.ps-progress`, `.ps-progress-bar`, `.ps-chapters`, `.ps-tick`, `.ps-chapter-label`, `.ps-counter`, `.ps-buttons`, `.ps-btn`, `.ps-view`.

### 4.6 Engine

```ts
// components/stage/engine.ts
export const RATES = { bg: 0.70, shadow: 0.82, mid: 0.88, near: 1.15, far: 0.25 } as const;
const LATTICE_PERIOD = 448;
export type Range = "full" | "first" | "last";
/** Scene-local p: 0 = left edge at viewport right · 0.5 = at rest · 1 = right edge at viewport left. */
export const mapper = (r: Range) => (p: number) =>
  r === "first" ? (p < 0.5 ? null : (p - 0.5) * 2) : r === "last" ? (p > 0.5 ? null : p * 2) : p;

export function buildStage(gsap: G, ScrollTrigger: ST, root: HTMLElement, hooks: { onRaw(p: number): void }) {
  const pin = root.querySelector<HTMLElement>(".ps-pin")!, track = root.querySelector<HTMLElement>(".ps-track")!;
  const floor = root.querySelector<HTMLElement>(".ps-floor-grid"), bar = root.querySelector<HTMLElement>(".ps-progress-bar");
  const scenes = gsap.utils.toArray<HTMLElement>(".ps-scene", track); const N = scenes.length;
  const W = () => pin.clientWidth, H = () => pin.clientHeight;
  let master!: gsap.core.Tween;
  const ctx = gsap.context(() => {
    master = gsap.to(track, { x: () => -(track.scrollWidth - W()), ease: "none",
      scrollTrigger: { id: "ps", trigger: root, start: "top top", end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true,
        onToggle: (s) => { document.documentElement.classList.toggle("has-pin", s.isActive); root.classList.toggle("is-live", s.isActive); },
        onUpdate: (s) => hooks.onRaw(s.progress) } });
    // far floor + progress follow the SMOOTHED tween, not raw scroll
    const setFloor = floor ? gsap.quickSetter(floor, "x", "px") : null;
    const setBar = bar ? gsap.quickSetter(bar, "scaleX") : null;
    master.eventCallback("onUpdate", () => { const p = master.progress();
      setFloor?.(-((p * (N - 1) * W() * RATES.far) % LATTICE_PERIOD)); setBar?.(p); });

    scenes.forEach((scene, i) => {
      const range: Range = i === 0 ? "first" : i === N - 1 ? "last" : "full";
      gsap.set(scene.querySelectorAll(".ps-stage3d"), { transformPerspective: 1400 });
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
        trigger: scene, containerAnimation: master, scrub: true, invalidateOnRefresh: true,
        start: range === "first" ? "left left" : "left right", end: range === "last" ? "left left" : "right left" } });
      const at = mapper(range);
      layerRates(tl, scene, W, range);                                  // fixes timeline length at 1
      CHOREO[scene.dataset.kind as SceneKind](tl, scene, at, { W, H });
      ENTER[scene.dataset.enter as Enter]?.(tl, scene, at, { W, H });
    });
  }, root);
  const restY = (i: number) => { const st = master.scrollTrigger!; return st.start + (i / (N - 1)) * (st.end - st.start); };
  return { ctx, master, scenes, N, restY,
    kill() { document.documentElement.classList.remove("has-pin"); ctx.revert(); } };
}

function layerRates(tl: TL, scene: HTMLElement, W: () => number, range: Range) {
  const [p0, p1] = range === "full" ? [0, 1] : range === "first" ? [0.5, 1] : [0, 0.5];
  const dx = (r: number, p: number) => (p - 0.5) * 2 * W() * (1 - r);
  (["bg", "shadow", "mid", "near"] as const).forEach((k) => {
    const el = scene.querySelector(`.ps-${k}`); const r = RATES[k];
    if (el) tl.fromTo(el, { x: () => dx(r, p0) }, { x: () => dx(r, p1), duration: 1 }, 0);
  });
}
```

**Loading** (stage mode only; phones, rail, list and reduced motion never download GSAP):
1. `Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/ScrollToPlugin")])`.
2. `registerPlugin`, then `await document.fonts.ready`.
3. `buildStage`, then set `root.dataset.mode = "stage"`.
4. `ScrollTrigger.refresh()`, then `syncFromHashOrScroll()`.

**Refresh:** use a ResizeObserver on `.ps` with a local 150 ms debounce (GSAP 3.15 has no `utils.debounce`), plus a refresh on `window load`. On each refresh, if not moving, call `scrollTo(0, restY(index))`.

**Index, near scenes and lazy media:**
- `onRaw(p)` does nothing while settle is moving. Otherwise it sets `i = round(p·(N−1))`, and on change calls `setIndex(i)`.
- `setIndex` toggles `.is-near` on |k−i| ≤ 1 and sets `img.loading = "eager"` for scenes i−1 … i+2.
- `setIndex` updates React state for the Dock only. Scenes are memoised, and the progress bar never renders through React.
- `.ps.is-live .ps-scene.is-near :is(.ps-bg,.ps-shadow,.ps-mid,.ps-stage3d,.ps-near) { will-change: transform; }` — that is all the `will-change` there is.

### 4.7 Settle, go, cut, keyboard, focus, hash

```ts
// lib/settle.ts — frozen API (A delivers in phase 0; D consumes)
export type Settle = { restY(i: number): number; toIndex(i: number, o?: { instant?: boolean; duration?: number }): void;
  markSettled(y: number): void; readonly moving: boolean; destroy(): void };
export function createSettle(o: { gsap: G; st: () => ScrollTrigger | null; count: number;
  threshold: (step: number) => number; duration: number; idleMs?: number;
  onIndex: (i: number, settled: boolean) => void }): Settle {
  let moving = false, settledAt = 0, timer = 0, held = false;
  const step = () => { const s = o.st()!; return (s.end - s.start) / (o.count - 1); };
  const restY = (i: number) => o.st()!.start + i * step();
  const toIndex = (i: number, x: { instant?: boolean; duration?: number } = {}) => {
    const y = restY(i); moving = true; o.onIndex(i, false);
    o.gsap.to(window, { scrollTo: { y, autoKill: true }, duration: x.instant ? 0 : x.duration ?? o.duration, ease: "power2.inOut", overwrite: true,
      onComplete: () => { moving = false; settledAt = y; o.onIndex(i, true); }, onInterrupt: () => { moving = false; } });
  };
  const settle = () => { const s = o.st(); if (!s || moving || held) return; const y = scrollY;
    if (y < s.start - 2 || y > s.end + 2) return;                         // outside: never pull back
    const from = Math.round((settledAt - s.start) / step()); let i = Math.round((y - s.start) / step());
    if (i === from && Math.abs(y - settledAt) > o.threshold(step())) i = from + Math.sign(y - settledAt);
    i = Math.max(0, Math.min(o.count - 1, i));
    if (Math.abs(restY(i) - y) < 2) { settledAt = restY(i); o.onIndex(i, true); return; }
    toIndex(i); };
  const onScroll = () => { if (moving) return; clearTimeout(timer); timer = window.setTimeout(settle, o.idleMs ?? 140); };
  const down = () => { held = true; }, up = () => { held = false; onScroll(); };   // no settle while dragging the scrollbar
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("mousedown", down); addEventListener("mouseup", up);
  return { restY, toIndex, markSettled: (y) => { settledAt = y; }, get moving() { return moving; },
    destroy() { clearTimeout(timer); removeEventListener("scroll", onScroll); removeEventListener("mousedown", down); removeEventListener("mouseup", up); o.gsap.killTweensOf(window); } };
}
```

| Setting | Product stage | Gallery |
|---|---|---|
| `threshold` | `s => Math.min(s * 0.12, 40)` (one 100 px wheel notch always advances) | `s => s * 0.12` (unchanged) |
| `duration` | 0.48 | 0.38 |
| `idleMs` | 140 | 140 |

**`go(i)`** has two paths:

```ts
const d = Math.abs(i - index);
if (d <= 2) settle.toIndex(i, { duration: 0.48 + 0.14 * (d - 1) });          // pan
else gsap.timeline({ onComplete: () => settle.markSettled(restY(i)) })           // cut
  .to(track, { opacity: 0, duration: 0.12, ease: "power1.in" })
  .add(() => { scrollTo(0, restY(i)); ScrollTrigger.update(); master.scrollTrigger?.getTween()?.progress(1); setIndex(i); })
  .to(track, { opacity: 1, duration: 0.2, ease: "power1.out" });
```

**Keyboard (stage mode):**
- ArrowRight, ArrowDown, PageDown and Space move +1. ArrowLeft, ArrowUp, PageUp and Shift+Space move −1.
- Ignored when:
  - a modifier key is held;
  - focus is in `.site-header`, a form field, `[contenteditable]` or `dialog`, or on `[aria-expanded="true"]`;
  - the scroll position is outside `[start−2, end+2]`;
  - the key is Space and focus is on a link, button or summary.
- At either end the key is not prevented, so native scroll leaves the film.
- Home and End stay native.
- In rail mode, PageUp and PageDown inside `.ps-track` move one scene; arrows stay native, and mandatory snap makes them one scene each.

**Focus:** `focusin` inside a scene whose index ≠ current calls `requestAnimationFrame(() => go(i))` (instant under reduced motion). No product scene is inert, because neighbours are fully off-screen at rest.

**Chapter link (stage):** `preventDefault()`, then `go(i)`. On complete, call `history.replaceState(null, "", "#" + id)` and `heading.focus({ preventScroll: true })`. In rail and list modes chapter links are native anchors.

**Hash on load and back/forward:**
1. After refresh, find the scene matching `location.hash`; otherwise use `round((scrollY − start)/step)`.
2. Instant `scrollTo`, then `getTween().progress(1)`, then `markSettled`.

**Teardown** (unmount, mode change, `key={slug}`), in this order:
1. `settle.destroy()`;
2. remove the key, focus and resize listeners;
3. `stage.kill()`;
4. `gsap.set(track, { clearProps: "opacity" })`;
5. set `data-mode` to the next mode.

### 4.8 Choreography (`components/stage/choreo.ts`)

**Windows (scene-local p):**

| Phase | Window | Ease |
|---|---|---|
| Entrance | inside [0.10, 0.46] | power2.out or power3.out |
| Rest | [0.46, 0.54] | everything final |
| Exit | inside [0.54, 0.92] | power2.in, `immediateRender:false` on every exit tween |

The dev assertion throws if an entrance ends after 0.4601, an exit starts before 0.5399, or any tween extends the timeline beyond 1.

```ts
export function span(tl: TL, at: At, p0: number, p1: number, t: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars) {
  const a = at(p0), b = at(p1); if (a === null || b === null || !t || (Array.isArray(t) && !t.length)) return;
  assertWindow(p0, p1, t); tl.fromTo(t, from, { ...to, duration: b - a }, a);
}
export function cascade(tl: TL, at: At, items: Element[], p0: number, step: number, d: number, from: gsap.TweenVars, to: gsap.TweenVars) {
  const s = items.length > 1 ? Math.min(step, (0.46 - p0 - d) / (items.length - 1)) : 0;   // auto-fit to the rest edge (B's seq)
  items.forEach((el, k) => span(tl, at, p0 + k * s, p0 + k * s + d, el, from, to));
}
export const PRESET = {        // B's vocabulary: transform + opacity only, never autoAlpha
  rise:    { from: { y: 18, opacity: 0 }, to: { y: 0, opacity: 1, ease: "power2.out" } },
  standUp: { from: { rotationX: 72, y: 24, opacity: 0, transformOrigin: "50% 100%", transformPerspective: 900 }, to: { rotationX: 0, y: 0, opacity: 1, ease: "power2.out" } },
  install: { from: { y: -36, z: 60, opacity: 0, transformPerspective: 1600 }, to: { y: 0, z: 0, opacity: 1, ease: "power3.out" } },
  arrive:  { from: { z: -220, y: 28, opacity: 0, transformPerspective: 1200 }, to: { z: 0, y: 0, opacity: 1, ease: "power2.out" } },
  feed:    { from: { x: -56, opacity: 0 }, to: { x: 0, opacity: 1, ease: "power2.out" } },
  emit:    { from: { x: -16, opacity: 0 }, to: { x: 0, opacity: 1, ease: "power2.out" } },
  drawX:   { from: { scaleX: 0, transformOrigin: "0% 50%" }, to: { scaleX: 1, ease: "power1.inOut" } },
  drawY:   { from: { scaleY: 0, transformOrigin: "50% 0%" }, to: { scaleY: 1, ease: "power1.inOut" } },
  pop:     { from: { scale: 0, opacity: 0 }, to: { scale: 1, opacity: 1, ease: "power2.out" } },
} as const;
export function copyIn(tl, s, at, { W }) {           // heading moves only (I2)
  span(tl, at, 0.14, 0.38, q(s, ".ps-eyebrow"), { x: () => 0.04 * W() }, { x: 0, ease: "power2.out" });
  span(tl, at, 0.16, 0.44, q(s, ".ps-h"), { x: () => 0.07 * W() }, { x: 0, ease: "power3.out" });
  cascade(tl, at, qa(s, ".ps-copy > :not(.ps-eyebrow):not(.ps-h)"), 0.22, 0.03, 0.18, { x: () => 0.03 * W(), opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out" });
}
export function copyOut(tl, s, at, { W }) { /* mirror: eyebrow 0.58–0.82 → −0.04W; heading 0.56–0.86 → −0.05W; rest 0.60+ → −0.03W, opacity 0; all immediateRender:false */ }
export function midIn(tl, s, at, { W }, f: Partial<{ x: number; z: number; ry: number; sc: number }> = {}) {
  span(tl, at, 0.12, 0.46, q(s, ".ps-stage3d"), { x: () => (f.x ?? 0.08) * W(), z: f.z ?? -180, rotationY: f.ry ?? -12, scale: f.sc ?? 0.94 },
       { x: 0, z: 0, rotationY: 0, scale: 1, ease: "power3.out" });
}
```

"Copy" below means `copyIn` plus `copyOut`. Hook classes are defined in §6.2.

| Kind | Shot | Midground entrance | Extras | Exit | Default enter |
|---|---|---|---|---|---|
| `title` (exit only) | Establishing, then dolly-out | Load is CSS time-based: annotation, sub, name moment and CTAs go opacity 0→1, y 8→0, 420 ms, 60 ms stagger, `animation-fill-mode: backwards`. **The H1 never animates.** Floor `lattice-assemble` once. Plinth `scaleX` 0→1 over 480 ms after 200 ms. | Ribbon words: word k extra x −0.04W·k over [0.5, 0.95] | `.ps-stage3d` scale 1→0.88, z→−240, rotationY→14 over [0.52, 0.92]; copy out | – |
| `problem` | Fracture | `midIn` ry −16, z −200. `.viz-divide` drawY [0.18, 0.30]. Calm `.viz-node:not(.is-warn)` and `.viz-cam` rise, cascade(0.18, 0.03, 0.14). **Warn nodes last:** pop from 0.96, cascade(0.34, 0.02, 0.10). Wall: `.viz-scan` y 0→100% [0.20, 0.44] with opacity in and out. | Copy | `.ps-stage3d` scale→1.07 [0.56, 0.90], opacity→0 [0.66, 0.90] | pan |
| `people` (reverse) | Ensemble | `.viz-tile` standUp, cascade(0.16, 0.05, 0.22). Lanes: `.viz-lane` feed, cascade(0.18, 0.04, 0.18); `.viz-lane-path` opacity [0.36, 0.46]. | Copy | Tile k extra x −0.02W·(k+1), opacity→0 from 0.58 | dolly |
| `intro` | Reveal | `midIn` x .10, z −320, ry 20, sc .80. Hub pop [0.30, 0.44], nodes from the hub cascade(0.28, 0.012, 0.12). Tiles install, cascade(0.22, 0.06, 0.20). **Layers (Yisbir):** fan from stacked (translate 0) to the CSS rest translate (which GSAP writes as y/z offsets back to 0) over [0.24, 0.46], each `.viz-layer-name` rise. | Copy | Rack focus: scale→0.94, rotationY→−12 [0.56, 0.90] | **wipe** (act II) |
| `interface` | Screen reveal and shadow lag | `midIn` x .10, z −220, ry −16. `.ps-shadow` opacity 0→0.6 [0.20, 0.40]. Callouts: `.callout-line` drawX, cascade(0.34, 0.03, 0.08); `.callout-label` rise, cascade(0.36, 0.03, 0.08). Records variant: `.viz-record` rise, cascade(0.22, 0.04, 0.12); `.viz-record-rule` drawX. Phone variant: `.viz-phone-body` install [0.15, 0.40]; `.viz-phone-row` rise, cascade(0.30, 0.04, 0.12). | Copy | rotationY→14 [0.56, 0.90]; opacity→0 [0.80, 0.92] | pan |
| `walkthrough` (wide) | Stations along the travel | `.viz-rail` drawX [0.14, 0.38]. Station k: `.viz-station-tick` pop [0.20+.045k, 0.28+.045k]; `.viz-station-n`, `.viz-station-l` and `.viz-station-copy` rise [0.22+.045k, 0.34+.045k] (k=4 ends at 0.46). | Heading and body only | Station k x→−0.06W, opacity→0 [0.56+.04k, 0.72+.04k] | pan |
| `features` | Contact sheet | Grid item at diagonal d (`data-d`): standUp over [0.18+.04d, 0.32+.04d]. **Columns** (Nazo AI actions): `.viz-column` arrive, cascade(0.20, 0.05, 0.16); column items rise from 0.28, auto-fitted. | Copy | Reverse diagonal: z→−120, opacity→0 | dolly |
| `output` | Print | `.viz-record` rise, cascade(0.22, 0.04, 0.12); `.viz-scan` y over [0.20, 0.46] with opacity in and out. Screen variant: `midIn` x −0.06, ry +16, then callouts as `interface`. | Copy | Rows x→−0.04W, opacity→0 from 0.58 | pan |
| `usecases` (wide or reverse) | Montage | `.viz-case` k: even from z −260, odd from z 80, opacity 0, over [0.16+.028k, 0.32+.028k]. Each case also has a linear rate r_k = 0.94 + 0.04k over [0, 1] (dx = 0 at rest), so cases shear during the pan. Screen variant (Yisbir): `midIn`, with `.ps-case` in the copy rising. | Copy (wide: the `.ps-sectors` line rises last) | Shear continues; opacity→0 [0.70, 0.90] | **wipe** (act III) |
| `integrations` (split) | Flow-through | `.port-in` feed, cascade(0.16, 0.03, 0.14). `.port-core` install [0.28, 0.42]. `.port-wire` drawX, cascade(0.30, 0.02, 0.10). `.port-out` emit, cascade(0.34, 0.02, 0.10). | Copy; `.ps-fact` rise, cascade(0.24, 0.02, 0.12) | Stage x→−0.04W, opacity→0 [0.60, 0.90] | pan |
| `governance` (reverse) | Chain of custody | `.chain-node` rise, cascade(0.18, 0.05, 0.14). `.chain-edge` drawX, each starting 0.04 after its left node. `.chain-branches` opacity [0.38, 0.46]. | Copy; facts as `integrations` | Rack focus | dolly |
| `deploy` (split) | Boundary | Edges drawn in order: top drawX [0.12, 0.22]; right drawY [0.20, 0.30]; bottom drawX (origin 100% 50%) [0.28, 0.38]; left drawY (origin 50% 100%) [0.34, 0.44]. `.boundary-node` y −0.05H→0, cascade(0.24, 0.03, 0.14), power3.out. Ports or chain variants reuse their rows above. | Copy; facts as `integrations` | Rack focus | pan |
| `value` (center) | Title card | `.viz-tile` standUp, cascade(0.30, 0.05, 0.12) | **Type:** big type scale 1.12→1 [0.10, 0.46] and extra x from `dx(1.35,0)` to 0 over [0, 0.5]. Heading from x 0.10W. | Heading x→−0.08W [0.56, 0.90]; tiles opacity→0 [0.62, 0.86] | type |
| `faq` (wide, no mid) | Two-shot | – | `.ps-qa` k: x 0.04W→0, opacity, over [0.18+.04k, 0.32+.04k]. `dt` is not a heading, so opacity is allowed. | `.ps-qa` x→−0.03W, opacity→0 [0.58+.03k, 0.74+.03k] | pan |
| `next` (entry only) | End card | `.next-card` from z −200, scale 0.9, rotationY −10 over [0.14, 0.46] | Statement H2 `closingLine` moves only; `.ps-ctas` rise [0.30, 0.44] | None. The film ends and the page scrolls to the footer. | dolly |

**Transitions (`ENTER`, incoming scene only):**
- `pan`: nothing extra.
- `dolly`: overrides `midIn` to sc 0.86, z −260.
- `wipe`: `.ps-shutter` xPercent 0→101 over [0.04, 0.38], power2.inOut, with the act label riding it. It is forced on the first scene of acts II and III. The shutter is solid `--p-bg` with `--p-fg` text.
- `type`: as in `value` above.
- `cut`: programmatic only (§4.7).

### 4.9 Rail, list, reduced motion and no JavaScript

```css
.ps:is([data-mode="rail"],[data-mode="pending"]) .ps-track { overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: none; }
.ps:is([data-mode="rail"],[data-mode="pending"]) .ps-scene { scroll-snap-align: start; scroll-snap-stop: always; }
@media (max-width: 767px) {
  .ps:is([data-mode="rail"],[data-mode="pending"]) .ps-pin { height: auto; }
  .ps:is([data-mode="rail"],[data-mode="pending"]) .ps-scene { height: auto; min-height: 100svh; }
  .ps:is([data-mode="rail"],[data-mode="pending"]) .ps-frame { position: relative; inset: auto; padding-top: calc(var(--header-h) + var(--ps-pad-y)); padding-bottom: calc(var(--ps-dock) + var(--ps-pad-y)); grid-template-columns: minmax(0,1fr); }
  .ps-scene .ps-fg, .ps-scene .ps-mid { grid-column: 1 / -1 !important; grid-row: auto !important; }
  .ps-mid { max-height: 34svh; }
  .ps-dock { position: sticky; bottom: 0; }
}
@media (min-width: 768px) and (max-width: 1023px) { .ps-scene .ps-fg, .ps-scene .ps-mid { grid-column: 1 / -1; } .ps-mid { max-height: 42svh; } }
@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {
  .ps[data-mode="rail"]:not([data-static]) .ps-scene { view-timeline: --ps-scene inline; }
  .ps[data-mode="rail"]:not([data-static]) .ps-bg     { animation: ps-rail-bg linear both;  animation-timeline: --ps-scene; }
  .ps[data-mode="rail"]:not([data-static]) .ps-module { animation: ps-rail-mid linear both; animation-timeline: --ps-scene; }
}}
@keyframes ps-rail-bg  { from { transform: translateX(-30%); } to { transform: translateX(30%); } }
@keyframes ps-rail-mid { from { transform: perspective(1400px) translateX(-8%) rotateY(-10deg); } 50% { transform: none; } to { transform: perspective(1400px) translateX(8%) rotateY(8deg); } }
```

**Phones:**
- Copy comes first, then the visual.
- Below 768, visuals that only echo a list are `display:none`. These are the aria-hidden diagrams for walkthrough, features, usecases, integrations, deploy and governance; the list carries the content.
- **Real screens are never hidden.**
- Lists switch to 2 columns at ≥360 px wide.
- Scenes fit `100svh` at ≥360×640 by budget. Below that size a scene may grow; there is never a nested vertical scroller.

**Rail index:** an IntersectionObserver on the track root at threshold 0.6. Buttons call `track.scrollTo({ left: i * track.clientWidth, behavior: reduced ? "auto" : "smooth" })`.

**List:**
- Triggered by `.ps[data-mode="list"]`, `html[data-view="list"] .ps[data-mode="pending"]`, or `@media (max-height:499px)` / `print`.
- `.ps-track { display:block }`, `.ps-scene { height:auto; content-visibility:auto; contain-intrinsic-size:auto 100svh }` from the third scene on.
- `.ps-frame` is in normal flow with `padding-block: clamp(48px, 8vh, 96px)`.
- The dock is a sticky top bar of chapter links plus "Horizontal view" (hidden below 500 px tall).

**Reduced motion:**
- rail with `data-static`;
- no GSAP request and no view-timeline;
- `.ps-shutter { display:none }`;
- no load intro and no floor assembly;
- buttons and chapters jump instantly.

**No JS:** the server HTML is the rail. The title scene is the first frame, every scene is reachable by scrolling the scroller, and chapter links work.

### 4.10 Accessibility and performance contract

**Accessibility**
- One `h1` (title scene) and one `h2` per scene, in DOM order. Scenes are unnamed `<section>`s.
- The live region announces "Scene 5 of 14: Interface" on settle only.
- Every focus target sits inside `[--header-h, 100svh − --ps-dock]` (WCAG 2.4.11), with the focus ring at least 8 px inside the scene clip.
- Contrast is ≥4.5:1 for body text over the worst big-type stroke pixel.
- No autoplay over 5 s. The only time-based motion is the 420 ms load settle and the 720 ms floor assembly.
- **Known limitation:** find-in-page cannot reveal an off-screen scene in stage mode. List view and the rail both support find.

**Performance**
- ≤ N+1 ScrollTriggers per page.
- `will-change` only on `.is-near`.
- The header is solid while `html.has-pin` is set (E).
- Images:
  - title screen: `fetchpriority="high"`, eager;
  - scenes 2 and 3: eager;
  - all others: lazy, upgraded for i+2;
  - `sizes="(min-width:1024px) 46vw, 92vw"`;
  - width and height always set.
- Initial product JS (gzip) ≤150 KB. The GSAP chunk plus engine plus choreography ≤50 KB, stage mode only.
- No long task over 50 ms while scrolling at 4× CPU throttle. CLS ≤0.02. LCP stays the title H1 text.

---

## 5. Content (owner B)

### 5.1 Data model (`content/storyboards.ts`)

```ts
export type SceneKind = "title" | "problem" | "people" | "intro" | "interface" | "walkthrough" | "features"
  | "output" | "usecases" | "integrations" | "governance" | "deploy" | "value" | "faq" | "next";
export type Act = 1 | 2 | 3;
export type Enter = "pan" | "dolly" | "wipe" | "type";
export type Layout = "split" | "reverse" | "wide" | "center";
/** ok: ships · provisional: ships, listed for owner approval · confirm: PREVIEW builds only. */
export type Status = "ok" | "provisional" | "confirm";

export type Viz =
  | /* existing: split, lanes, tiles, flow, steps (rendered as stations), grid, layers, wall, phone, records, system, screen */
  | { kind: "ribbon"; words: string[] }
  | { kind: "cases" }                                                   // drawn from scene.cases
  | { kind: "ports"; inputs: string[]; core: string; outputs: string[] }
  | { kind: "boundary"; inside: string[]; caption: string }
  | { kind: "chain"; nodes: string[]; branches?: string[] }
  | { kind: "columns"; cols: { label: string; items: string[] }[] }
  | { kind: "next"; slug: string }
  | { kind: "none" };

export type Scene = {
  id: string; kind: SceneKind; act: Act; eyebrow: string; heading: string; body?: string;
  evidence: string;                          // required except title (story.heroEvidence) and next
  status?: Status;                           // default "ok"; composed headings → "provisional"
  layout?: Layout; enter?: Enter; bigType?: { text: string; lang?: "ar" };
  steps?: { label: string; copy: string }[];
  features?: string[];
  cases?: { label: string; copy: string; evidence: string; status?: Status }[];
  facts?: { label: string; value: string; evidence: string }[];
  faq?: { q: string; a: string; evidence: string; status?: Status }[];
  links?: { label: string; href: string; external?: boolean }[];
  sectors?: { text: string; evidence: string };
  provenance?: Provenance;                   // required for every non-screen viz except none/next/columns/cases
  viz: Viz;
  callouts?: boolean;                        // draw viz.screen.labels
  n?: string;                                // computed
};

export type ProductStory = Omit<OldProductStory, "beats"> & {
  heroEvidence: string;   // tasree3 "EV-400 EV-401 EV-410" · yisbir "EV-440" · mandoobee "EV-113" · wasel "EV-101 EV-103" · nazo "EV-141 EV-142" · ai-in-a-box "EV-520 (OWNER-PENDING)"
  titleArt: Viz;          // screen or ribbon
  scenes: Scene[];        // 02 … N−1
};

export const DEFAULT_LAYOUT: Record<SceneKind, Layout> = { title: "split", problem: "split", people: "reverse", intro: "split",
  interface: "split", walkthrough: "wide", features: "reverse", output: "split", usecases: "wide", integrations: "split",
  governance: "reverse", deploy: "split", value: "center", faq: "wide", next: "split" };
export const DEFAULT_ENTER: Record<SceneKind, Enter> = { title: "pan", problem: "pan", people: "dolly", intro: "pan",
  interface: "pan", walkthrough: "pan", features: "dolly", output: "pan", usecases: "pan", integrations: "pan",
  governance: "dolly", deploy: "pan", value: "type", faq: "pan", next: "dolly" };
export const STORY_ORDER = ["mandoobee", "tasree3", "nazo", "yisbir", "wasel", "ai-in-a-box"] as const; // = SHOWCASE order, wraps

export function visibleScenes(story: ProductStory): Scene[] {
  const title: Scene = { id: "overview", kind: "title", act: 1, eyebrow: `Products · ${story.name}`, heading: story.hero,
    body: story.heroSub, evidence: story.heroEvidence, viz: story.titleArt,
    bigType: story.nameMoment ? { text: story.nameMoment.ar, lang: "ar" } : { text: story.name } };
  const next: Scene = { id: "next", kind: "next", act: 3, eyebrow: "Next", heading: story.closingLine, evidence: "",
    viz: { kind: "next", slug: nextSlug(story.slug) } };
  const list = [title, ...story.scenes.filter((s) => s.status !== "confirm" || PREVIEW), next]
    .map((s) => ({ ...s, cases: s.cases?.filter((c) => c.status !== "confirm" || PREVIEW) }));
  return list.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0"), layout: s.layout ?? DEFAULT_LAYOUT[s.kind],
    enter: i > 0 && list[i - 1].act !== s.act ? "wipe" : s.enter ?? DEFAULT_ENTER[s.kind],
    bigType: s.bigType ?? (s.kind === "value" ? { text: story.name } : undefined) }));
}
```

**`content/media.ts`:**
- `Screen` gains `labels?: MediaLabel[]` and `labelInAsset?: boolean`.
- `MediaLabel = { at: [number, number]; side?: "left" | "right"; text?: string; note?: string; ev?: string }`.
- New entry `mandoobeeApp` (`/media/v3/wall-08-mandoobee-app.webp`, 1200×750, "App mock-up").
- New entry `yisbirPpeCompliance600` (a downscale of wall-01, ≤30 KB, for C's depth stack).
- Set `labelInAsset: true` on `waselGateAccess` and `waselPhoneToGate`.
- Re-check the `yisbirPpeWall` alt text: the verified review says "no camera image".

**`content/showcase.ts`:** `ShowcasePanel` gains:
- `layout: "phones" | "wide" | "iso" | "matrix" | "doc"`;
- `proof?: { text: string; evidence: string }`;
- `shot2?: Screen`.

**`content/company.ts`:** gains `PRESS: { outlet: string; date: string; title: string; url: string; evidence: string }[]` and `FEATURE_VIDEO: { title; outlet; url; evidence: "EV-022" }`.

### 5.2 Scene lists

`=` means an existing beat with unchanged copy (except fixes in §5.6). **Bold** means new.

| # | Act | Tasree3 (14) | Yisbir (14) | Mandoobee (12) | Wasel (12) | Nazo (13) | AI in a Box (10) |
|---|---|---|---|---|---|---|---|
| 01 | I | title: screen `tasree3CommandCenter`, تسريع | title: screen `yisbirFireSmoke`, يسبر | title: ribbon "Attendance · Requests · Tasks · Documents · Assistant" | title: `waselGateAccess` (illustration) | title: ribbon "Draft · Registered · In review · In approval · Signed · Sealed · Verified" (EV-543) | title: ribbon "Legal · Finance · HR · Research · IT Security" |
| 02 | I | problem = | problem = (wall redrawn as a rack) | problem = | problem = | problem = | problem = |
| 03 | I | people = | people = | people = (EV re-cite) | people = | people = | people = |
| 04 | II | intro = | intro = (layers exploded) | intro = (EV re-cite) | intro = | intro = | intro = (agent matrix) |
| 05 | II | interface = (flow) | interface = (records) | interface: screen **`mandoobeeApp`** + callouts | interface = (phone) | interface = (draft) + callout | interface = (contract review) |
| 06 | II | walkthrough = | walkthrough = | walkthrough = | walkthrough (fix) | walkthrough (fix) | walkthrough (fix) |
| 07 | II | features = (fixed) | features = (fixed) | features (fix body) | features = | **ai-actions** | features (fix) |
| 08 | II | output (+features, callouts) | output = | output (fix body) | output (fix) | features (fix) | output = |
| 09 | III | **usecases** | **usecases** (screen alerts) | **usecases** | **usecases** | output = | value = |
| 10 | III | **integrations** | **integrations** (search) | **deploy** (+store links) | **deploy** (connectivity) | **usecases** | next |
| 11 | III | **governance** | **deploy** | **faq** | **faq** | **deploy** | |
| 12 | III | **deploy** | value (screen → `yisbirPpeWall`) | next | next | **faq** | |
| 13 | III | **faq** | **faq** | | | next | |
| 14 | III | next | next | | | | |

Notes on the list:
- **Value beats dropped** where they repeated other scenes: Tasree3 (its ZGB line moves to the usecases body), Mandoobee, Wasel (its heading becomes the deploy heading) and Nazo (its heading becomes the deploy heading).
- **AI in a Box gets no new scenes** (DL-P13; EV-520 and EV-521 are unregistered; D8).
- **Screen allocation (I9):** Mandoobee's title is a ribbon so that `mandoobeeApp` appears only in interface. Nazo is the same with `nazoDraft`. Yisbir uses `yisbirFireSmoke` in the title, `yisbirAlerts` in usecases and `yisbirPpeWall` in value. `card-yisbir-ppe` (six small workers) is withdrawn.

### 5.3 Content budgets (`scripts/content-check.mjs` fails the build)

| Field | Limit |
|---|---|
| `hero` / `heroSub` | ≤52 / ≤170 characters |
| `heading` | ≤60 (≤56 when the copy column also holds `facts` or `cases`) |
| `body` | ≤160 (≤120 with `facts`/`cases` in the copy column) |
| `steps` | ≤5; label ≤14; copy ≤90 |
| `features` | ≤6, each ≤44 |
| `cases` | wide tiles: ≤6, label ≤32, copy ≤90. Copy-column variant: ≤4, copy ≤72. |
| `facts` | ≤6; label ≤16; value ≤60 |
| `faq` | ≤4; q ≤52; a ≤160 |
| `links` | ≤3 |
| `labels` | ≤3 per screen, ≤28 characters |
| ribbon | 3–7 words |

The check also enforces:
- every cited EV exists with `ok-to-use` or `use-with-edit`. EV-520 and EV-521 are reported as **OWNER-PENDING** (not a pass, not a failure; listed in the build log);
- the banned strings in §5.6;
- `provenance` on every pictorial viz;
- unique ids matching `/^[a-z][a-z-]*$/`;
- no `Screen.src` twice on one page;
- every `labels[].note` has an ok-to-use `ev`;
- no `confirm` item in a production build.

Add `"content:check": "node scripts/content-check.mjs"` and `"prebuild": "npm run content:check"` to `package.json` (B is the only editor of `package.json`; no new dependencies).

### 5.4 New scene copy

**P** marks composed copy: `status: "provisional"`, listed for D4. All other text is taken from the cited row.

**Tasree3**

- **09 `usecases`** (wide)
  - Eyebrow: "Use cases"
  - Heading: "From the first map to the next audit." **P**
  - Body: "Built for the re-engineering work the UAE's Zero Government Bureaucracy programme calls for." (EV-410; alignment, never endorsement)
  - Cases:

    | Label | Copy | EV |
    |---|---|---|
    | Government service redesign | Map a service as it runs, remove the steps that add nothing, publish the approved version. | EV-410 EV-403 EV-405 |
    | Event logs to an as-is map | Upload CSV, JSON, PDF or DOCX files, or connect an HRMS, and mine how work really runs. | EV-552 |
    | Bottlenecks before the workshop | Switch between frequency and performance views and inspect any step for waiting time. | EV-556 |
    | Audit against the approved model | Run a global audit from the Conformance Center and export the report as PDF or Excel. | EV-557 EV-404 |
    | Manuals and RACI from one source | Generate process manuals, RACI matrices and gap analyses from the shared repository. | EV-557 EV-402 |
    | Governed change, department-wide | Route a revised model through ordered reviewers, with an AI summary of what changed. | EV-555 |

  - `sectors`: "Sectors: Manufacturing · Banking and finance · Healthcare · Government · Enterprise" (EV-124)
  - viz `cases`

- **10 `integrations`** (split)
  - Eyebrow: "Data in, documents out"
  - Heading: "Start from the event data you already have." **P**
  - Body: "Load files or connect an HRMS. Tasree3 maps the columns and explains anything it cannot read." (EV-552)
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Sources | CSV, JSON, PDF or DOCX files, or a connected HRMS | EV-552 |
    | Documents | AI extracts events from PDF and Word files | EV-552 |
    | Required fields | Case ID, activity and timestamp, mapped automatically | EV-552 |
    | Models | BPMN 2.0 XML import and export | EV-554 |
    | Exports | PDF, Excel and PowerPoint | EV-402 |
    | Maps | PNG, PDF (A4 or A3), HTML or animated GIF | EV-554 EV-556 |

  - viz `ports {inputs:["CSV","JSON","PDF","DOCX","HRMS"], core:"Tasree3", outputs:["As-is process map","BPMN 2.0 XML","PDF · Excel · PowerPoint"]}`, "Illustrative diagram"

- **11 `governance`** (reverse)
  - Eyebrow: "Governance"
  - Heading: "Every change approved. Every version kept." **P**
  - Body: "Submit, review, approve, publish: a version is captured on every approval, with full history and one-click rollback." (EV-405; never "immutable")
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Roles | Viewer, Author, Reviewer, Endorser, Approver, Admin | EV-405 |
    | Review | An ordered chain of reviewers and a final approver | EV-555 |
    | Changes | Reviewers read an AI summary of what changed | EV-555 |
    | History | Approval cycle time and the full workflow trail | EV-555 |
    | Restore | Archived versions can be restored as a draft | EV-555 |

  - viz `chain {nodes:["Submit","In review","Approved","Published"], branches:["Request changes","Return to author","Reject"]}`, "Illustrative diagram" (EV-405)

- **12 `deploy`** (split)
  - Eyebrow: "Deployment and security"
  - Heading: "It can run in your own cloud or data centre."
  - Body: "In the region you choose, under your rules. No black box and no offshore lock-in." (EV-407)
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Identity | SSO via Microsoft Entra ID, SAML 2.0 and OIDC | EV-408 |
    | Accounts | Provisioned by your administrator; no self-registration | EV-551 |
    | Data | Encryption at rest and role-based access control | EV-408 |
    | Staging | Separated as-is and to-be environments | EV-408 |
    | Logging | SIEM-compatible | EV-408 |
    | Language | English and Arabic, with right-to-left layouts | EV-551 EV-123 |

  - viz `boundary {inside:["Tasree3","Your event data","Your identity provider"], caption:"Your cloud or data centre"}`

- **13 `faq`** (wide)
  - Eyebrow: "Questions"
  - Heading: "What process teams ask first." **P**
  - Questions:
    1. "Do we need clean event logs to start?" → "No. Model in the editor, describe a process in plain language, or upload files; AI extracts events and the wizard maps the fields." (EV-552 EV-554)
    2. "Which notations does Tasree3 support?" → "BPMN 2.0, EPC and value chains, plus organisation diagrams, with BPMN 2.0 XML import and export." (EV-403 EV-553 EV-554)
    3. "Can it run on our own infrastructure?" → "It can run in your own cloud or data centre, in the region you choose. We confirm the configuration with you." (EV-407)
    4. "Does Tasree3 work in Arabic?" → "Yes. Users switch between English and Arabic at sign-in, and layouts support right-to-left." (EV-551 EV-123)

- **08 `output` additions**
  - features: "Conformance Center global audit", "Conformance report in PDF or Excel", "RACI matrix and process manuals", "Gap and process analysis" (EV-557)
  - `callouts: true` on `tasree3Conformance`, labels "Global fitness" and "Deviations" (text is in the alt; verify at 1:1)

- **`next` links:** primary CTA `/contact/?interest=tasree3`; "Visit tasree3.ae ↗" (EV-400); "All six products" → `/products/`.

**Yisbir**

- **09 `usecases`** (reverse; mid = `yisbirAlerts`)
  - Eyebrow: "Use cases"
  - Heading: "From the archive to the live site." **P**
  - Body: "The same platform indexes recorded video and watches live cameras." (EV-533 EV-534)
  - Cases (copy-column variant, 2×2):

    | Label | Copy | EV |
    |---|---|---|
    | Lecture and meeting archives | Find a topic, phrase or slide across years of recordings. | EV-533 EV-440 EV-442 |
    | Evidence review | Index CCTV exports and interviews; share only the relevant clips. | EV-533 EV-442 |
    | Construction safety | Missing helmets and vests, restricted-zone entry and falls, flagged. | EV-133 EV-134 |
    | After-hours site security | Intrusion, perimeter breaches and unauthorised access, after hours. | EV-537 |

  - PREVIEW only (`status:"confirm"`):
    - "Headcount attendance": "Count people by room or shift, with nobody identified." (EV-138 EV-534 EV-535)
    - "Retail shelves": "Spot misplaced products beside footfall by zone." (EV-533 EV-138)
  - Callouts: up to 3 of the alert-type labels **only if visible verbatim** in wall-15; otherwise none.

- **10 `integrations`** (split; id `search`)
  - Eyebrow: "Search and integration"
  - Heading: "Ask for a moment the way you would describe it." **P**
  - Body: "Phrase, metadata, similarity, fuzzy and synonym, vector and natural-language search over one index." (EV-442 EV-136)
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Transcripts | 50+ languages, with speaker diarization | EV-440 EV-442 |
    | On-screen text | Signage, slides and paperwork read with OCR | EV-442 EV-136 |
    | Sharing | Secure downloads with access control | EV-442 |
    | Systems | API integration with your existing systems | EV-442 |

  - viz `ports {inputs:["Recorded video","Existing cameras","Scanned documents"], core:"Yisbir index", outputs:["Search","Clips","API"]}` (EV-444 for cameras)

- **11 `deploy`** (split)
  - Eyebrow: "Deployment"
  - Heading: "Your infrastructure, the cameras you have." **P**
  - Body: "Cloud, on-premise or hybrid. It can run fully on-premises, with no hardware changes required." (EV-444 EV-443)
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Deployment | Cloud, on-premise or hybrid | EV-444 |
    | Public cloud | Not required: it can run fully on-premises | EV-443 |
    | Cameras | Your existing cameras and infrastructure | EV-444 |
    | Overhead | Runs in your own data centre with minimal GPU overhead | EV-443 |
    | Sovereignty | Built for organisations that prioritise data sovereignty | EV-446 |

  - viz `boundary {inside:["Existing cameras","Yisbir","Your teams"], caption:"Can run fully on-premises"}`

- **13 `faq`**
  1. "Do we need new cameras?" → "No. Yisbir works with your existing cameras and infrastructure, with no hardware changes required." (EV-444)
  2. "Can Yisbir run without the public cloud?" → "Yes. It can run fully on-premises, or in the cloud or a hybrid set-up if you prefer." (EV-443 EV-444)
  3. "What can it detect on live cameras?" → "Fire and smoke, missing helmets and vests, restricted-zone entry, falls, after-hours intrusion and perimeter breaches." (EV-134 EV-138 EV-534 EV-537)
  4. "Which languages can it transcribe?" → "More than 50, with speaker diarization so each passage is attributed to a speaker." (EV-440 EV-442)

  The face-recognition FAQ is excluded (D7).

**Mandoobee**

- **05 `interface`:** viz → `mandoobeeApp`, `callouts:true`, labels "Swipe here to clock in" and "Clocked In from Remote" (verify visible at 1:1)

- **09 `usecases`** (wide)
  - Eyebrow: "Use cases"
  - Heading: "One app for the rest of the working day." **P**
  - Body: "Beyond attendance: payroll, projects, documents, meetings and an AI assistant, in the same app." (EV-421 EV-114)
  - Cases:

    | Label | Copy | EV |
    |---|---|---|
    | The workforce at a glance | Admin dashboards and reports show who clocked in at the office, remotely, or not yet. | EV-115 EV-421 |
    | Meetings with shared minutes | Schedule meetings and record minutes, with the AI note assistant and speech to text. | EV-421 EV-115 |
    | Paperless document approval | Create, review, sign and archive documents, with OCR scanning and PDF tools. | EV-421 EV-114 EV-115 |
    | Payroll and assets | Payroll management and an asset register beside attendance and leave. | EV-421 |
    | Projects and tasks | Assign tasks, track projects and keep shared folders and links next to the work. | EV-421 EV-114 |
    | AI for documents and notes | Ask questions of a document, review a contract or summarise meeting notes. | EV-114 EV-421 |

- **10 `deploy`** (split)
  - Eyebrow: "Deployment"
  - Heading: "Deploy it your way, under your brand." **P**
  - Body: "On-premise, in the cloud or hybrid, with native apps on the App Store and Google Play." (EV-116 EV-420)
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Deployment | On-premise, cloud or hybrid | EV-116 |
    | Brand | White-labelling and customisation | EV-116 |
    | Integrations | Third-party integrations, scoped per project | EV-116 |
    | Apps | iOS and Android | EV-420 |

  - Links (text only; F checks both resolve before release; EV-420):
    - "Download on the App Store ↗" → `https://apps.apple.com/app/id6473241950`
    - "Get it on Google Play ↗" → `https://play.google.com/store/apps/details?id=ae.meerana.mandoobee`
  - viz `tiles ["On-premise","Cloud","Hybrid"]`, "Illustrative diagram"
  - **No language claim** (D5).

- **11 `faq`**
  1. "Is Mandoobee on iOS and Android?" → "Yes. Mandoobee is listed on the App Store and Google Play." (EV-420)
  2. "Can we host Mandoobee ourselves?" → "Yes. It deploys on-premise, in the cloud or as a hybrid." (EV-116)
  3. "Can it carry our brand?" → "Yes. Mandoobee supports white-labelling and customisation." (EV-116)
  4. "What does the AI assistant do?" → "It answers questions about documents, reviews contracts, keeps smart notes, turns speech into text and reads scanned paper." (EV-114 EV-115 EV-421)

**Wasel**

- **09 `usecases`** (wide)
  - Eyebrow: "Use cases"
  - Heading: "From villas to multi-gate sites." **P**
  - Body: "Designed for residential communities, villas, apartments, commercial facilities and multi-gate environments." (EV-101)
  - Cases:

    | Label | Copy | EV |
    |---|---|---|
    | Communities with several gates | Residents open the gates they are allowed through; managers see every gate's status. | EV-101 EV-103 |
    | Villas and apartments | Open the building door or gate from a phone, with every opening logged. | EV-101 EV-103 |
    | Commercial buildings | Give staff and contractors role-based access, secured with encrypted keys. | EV-101 EV-103 |
    | Sites where the network drops | Wasel falls back to the local network, and Bluetooth opens the gate offline. | EV-102 EV-103 |
    | Warehouses and industrial sites | Gate position, temperature and humidity at the controller, for loading gates. | EV-104 EV-103 |
    | Construction sites | Control site gates from the app and keep access working offline. | EV-104 EV-103 |

  - No parking or toll content.

- **10 `deploy`** (split)
  - Eyebrow: "Connectivity and security"
  - Heading: "Access that keeps working when the network does not." (existing, approved)
  - Body: "Cellular, local Wi-Fi, Bluetooth or local offline, on Meerana's own industrial-grade controller." (EV-103 EV-530)
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Controller | Industrial-grade, plug-and-play; Meerana's own | EV-103 EV-530 |
    | Sensors | Gate position, temperature and humidity | EV-103 |
    | Keys | Encrypted keys and role-based access | EV-103 |
    | Setup | Controllers provisioned over the air | EV-103 |
    | Sites | Multi-gate management in one account | EV-103 EV-101 |

  - viz `ports {inputs:["Cellular","Local Wi-Fi","Bluetooth","Local offline"], core:"Wasel controller", outputs:["Gates","Doors"]}`

- **11 `faq`**
  1. "What happens if the internet goes down?" → "Wasel switches to the local network. With no network at all, Bluetooth still opens the gate from the phone." (EV-102 EV-103)
  2. "Whose hardware does Wasel use?" → "Meerana's own controller: industrial-grade, with plug-and-play connections." (EV-530 EV-103)
  3. "Can one account manage several gates?" → "Yes. Wasel is built for multi-gate sites, with every gate managed from one app." (EV-103 EV-101)
  4. "What does the controller report?" → "Gate position from its sensors, plus temperature and humidity." (EV-103)

**Nazo**

- **05 `interface`:** `callouts:true`, label `{at:[0.515,0.335], text:"Holiday Date"}` (verify).

- **07 `ai-actions`** (kind `features`, wide)
  - Eyebrow: "AI by role"
  - Heading: "Fourteen AI actions, each scoped to a role." **P**
  - Body: "Requesters, approvers and administrators each see only the actions their role needs." (EV-542)
  - viz `columns`:
    - Requester: Auto-fill · Check errors · Draft content · Generate reference · Translate
    - Approver: Draft comment · Missing-information check · Summarise · What changed
    - Administrator: Generate template · Translate template · Build workflow · Validate workflow · Suggest variables
  - The columns are real lists, not aria-hidden.

- **10 `usecases`** (wide)
  - Eyebrow: "Use cases"
  - Heading: "Every official letter, in and out." **P**
  - Body: "Internal and external correspondence, initiated, tracked, approved, signed and archived." (EV-141)
  - Cases:

    | Label | Copy | EV |
    |---|---|---|
    | Multi-signature letters | Ordered review, approval and signing, with each signature placed by the template. | EV-545 EV-543 |
    | Recipient verification | Scanning a sealed letter's QR code shows whether it is unchanged since sealing. | EV-544 |
    | Bilingual correspondence | English and Arabic template twins, and AI translation of a draft on request. | EV-545 EV-542 |
    | Reviewers who see what changed | An AI summary, a missing-information check and a what-changed view before deciding. | EV-542 EV-543 |
    | Standard templates | Administrators generate templates and build and validate versioned workflows. | EV-542 EV-545 |
    | Inbound and outbound together | One register for inbox and outbox, with OCR search across scanned documents. | EV-142 EV-141 |

- **11 `deploy`** (split)
  - Eyebrow: "Security and deployment"
  - Heading: "Your correspondence, your servers." (existing)
  - Body: "On-premises or in the cloud, with its AI model on the same servers as the application." (EV-142 EV-541)
  - Facts:

    | Label | Value | EV |
    |---|---|---|
    | Seal | SHA-256, on every signed document | EV-544 |
    | Verification | A QR code re-checks the archived file | EV-544 |
    | AI guardrails | Suggestions checked against the form; people approve | EV-546 |
    | Vault | Encryption and a full audit trail | EV-142 |
    | Authority | Users, roles and signature authority, managed centrally | EV-142 |

  - viz `chain {nodes:["Signed PDF","SHA-256 hash","Sealed in vault","QR code","Re-hash and compare"]}`, "Illustrative diagram" (EV-544)

- **12 `faq`**
  1. "How can a recipient tell a letter is genuine?" → "By scanning its QR code. The verification page re-hashes the archived file and confirms it is unchanged since sealing." (EV-544)
  2. "Does Nazo send documents to an outside AI service?" → "No. Nazo's AI model runs on the same servers as the application." (EV-541)
  3. "Can the AI change a letter on its own?" → "No. AI suggestions are checked against the form before they are applied, and people approve every step." (EV-546 EV-543)
  4. "Does Nazo work in Arabic?" → "Yes. Templates have English and Arabic twins, and the interface supports right-to-left layouts." (EV-545 EV-541)

### 5.5 Homepage content additions (data only; renderers are D and E)

**Gallery proof chips** (`proof`, one per card, regular and compact variants only):

| Product | Chip | EV |
|---|---|---|
| Mandoobee | "On the App Store and Google Play" | EV-420 |
| Tasree3 | "Three modules. One AI-native core." | EV-401 |
| Nazo | "14 AI actions, scoped by role" | EV-542 |
| Yisbir | "Audio transcription in 50+ languages" | EV-442 |
| Wasel | "Cellular, Wi-Fi, Bluetooth or offline" | EV-103 |
| AI in a Box | none | – |

**Gallery shots:**
- Mandoobee shot → `mandoobeeApp`, layout `wide` (D6).
- Yisbir shot → `yisbirFireSmoke`, `shot2: yisbirPpeWall`.
- Tasree3 `shot2: tasree3Conformance`.
- Wasel `shot2: waselPhoneToGate`.
- AI in a Box `shot2: aiboxContractReview`.
- Nazo has no shot2.

**Layouts:** Tasree3, Yisbir and Mandoobee `wide`; Nazo `doc`; Wasel `iso`; AI in a Box `matrix`.

**`PRESS`** (EV-514; Future 100 also EV-202). Copy exact URLs from `research/sources/company-web-research.md` §F:
- Dubai Media Office 2024-08-08
- FPT Software newsroom 2024-08-19
- Security MEA 2024-10-17
- Intelligent CISO 2025-02-13
- Entrepreneur ME 2023 (Future 100)

Exclude The EastAfrican (sponsored) and Al Bayan 2024-05-10 (unverified hiring figure).

**`FEATURE_VIDEO`:** "Dubai Dreamers: From Dubai to the World with Meerana Technologies" (Dubai Chambers, link only; EV-022).

### 5.6 Mandatory honesty fixes in existing copy (B)

| Location | Now | Change to | Reason |
|---|---|---|---|
| `content/showcase.ts:82`, `storyboards.ts:709, 715, 730` | "Approval chains with due dates" | "Ordered review, approval and signing" (body 709: "Ordered approval steps, and a seal that can be checked later.") | Not in any register row |
| `storyboards.ts:733` (Nazo features) | "English and Arabic" | "English and Arabic templates" | EV-545 |
| `storyboards.ts:765`, value tiles "Bilingual" | – | Removed with the value beat | – |
| `storyboards.ts:582` (Wasel Grant) | "…for a period you set." | "Give a person or role access to the gates they need." | Not in EV-101–103 |
| `storyboards.ts:611, 619, 620` (Wasel output) | "which direction … to the second … exportable" | Body: "Audit and activity logs for every gate, in one account." Rows: Who · Which gate · When. | EV-103 only |
| `storyboards.ts:456` (Mandoobee features body) | "From a single team to a group with several entities." | "HR, projects, documents, communication and AI in one platform." | EV-113 |
| `storyboards.ts:473` (Mandoobee output body) | "…exportable for HR and audit." | "Attendance, requests and approvals in one record, with admin dashboards and reports." | EV-421 EV-115 |
| `storyboards.ts:411, 421, 440, 474`; `showcase.ts:55` | EV-422 cited | Re-cite EV-421 / EV-113 / EV-115 | EV-422 is internal-only |
| `storyboards.ts:775` (AI in a Box heroSub) | "…with voice in English and Arabic." | "It reads, drafts, schedules and reports. Five agents working together." | The demo shows English only |
| `storyboards.ts:858`; `showcase.ts:137` | "Voice in English and Arabic" | storyboards: "Voice mode"; showcase capability: "Contract review with clause flags" | Same |
| `storyboards.ts:841` | "…The agent never signs." | "A person reviews and decides." | No register row |
| `showcase.ts:97` (Yisbir line) | "…fire, PPE, uniform, attendance…" | "…turn live camera events — fire and smoke, PPE, restricted zones — into insight." | Uniform and headcount are unconfirmed (D7) |
| Everywhere | "immutable", "legally binding", "to be confirmed", "100% secure", "10x", parking or toll, face search, "suspicious behaviour", licence plates | Banned (content-check) | – |

### 5.7 Data adapter

So that A is never blocked, B ships a typed temporary `scenesFromBeats(story)` in phase 0. It maps the current 8 beats to `Scene[]` (act and id assigned). It is deleted when the real scenes land.

---

## 6. Visuals (owner B: `SceneVisual.tsx`, `ScreenFrame.tsx`, `app/viz.css`)

### 6.1 Drawing language

The drafting floor:
- nodes are hairline rectangles (1 px `--line-strong`) filled with `--ink-900`;
- flow edges are 1.5 px `--p-line`;
- problems are dashed in `--p-accent`;
- isometric slabs use `iso(x,y,z)`: X = (x−y)·cos30°, Y = (x+y)·sin30° − z, with the accent on the front edge;
- labels are **HTML, never SVG `<text>`**, at ≥12 px and ≥4.5:1;
- drawings are `aria-hidden` with a visible provenance label, except stations, columns, cases, chain, ports, FAQ and facts, which are real lists.

Kind-specific requirements:

| Kind | Requirement |
|---|---|
| `wall` (Yisbir) | Redrawn as an isometric camera rack with a `.viz-scan` line. No striped placeholders. |
| `layers` (Yisbir) | Exploded isometric stack. **All four labels legible.** Static offsets use the `translate` property. |
| `grid` | Renders the features list **without a provenance gate** (fixes the empty beat 06 on all six pages). |
| `steps` | Renders as `ol.viz-stations` at ≥1024 and a vertical list below. It is the only copy of the steps. |
| `tiles` | Cap raised to 9. Never an odd orphan in a 2-column grid: use 3 columns for 3 or 6 items. |

**ScreenFrame** gains:
- `fit` (adds `.is-fit` and a `.screen-box` wrapper; `img { max-height: calc(var(--ps-content-h) - 32px); width:auto; max-width:100% }`);
- `callouts` (renders `screen.labels` as `ol.callouts[aria-hidden]`: 6 px ring, 1 px leader `clamp(24px,4vw,64px)`, mono 11 px chip on `--ink-950`; never covering the provenance label);
- `labelInAsset` (provenance becomes sr-only);
- `sizes` passthrough.

### 6.2 Motion hook contract (B emits; A's `choreo.ts` targets; neither renames them without the other)

| Viz | Hook classes |
|---|---|
| split | `.viz-col`, `.viz-node`, `.viz-node.is-warn`, `.viz-divide` |
| lanes | `.viz-lane`, `.viz-lane-path` |
| tiles | `.viz-tile` |
| flow | `.viz-box`, `.viz-edge`, `.viz-rework` |
| steps (stations) | `.viz-stations`, `.viz-rail`, `.viz-station`, `.viz-station-tick`, `.viz-station-n`, `.viz-station-l`, `.viz-station-copy` |
| grid | `.viz-grid-list > li[data-d]` (d = row + col) |
| layers | `.viz-layer[style="--i:k"]`, `.viz-layer-name` |
| wall | `.viz-cam[data-order]`, `.viz-scan` |
| phone | `.viz-phone-body`, `.viz-phone-row` |
| records | `.viz-record`, `.viz-record-rule`, `.viz-scan` |
| system | `.viz-hub`, `.viz-sys-node` |
| screen | `.screen`, `.callout`, `.callout-line`, `.callout-label` |
| ribbon | `.viz-ribbon-word` |
| cases | `.viz-case` |
| ports | `.port-in`, `.port-core`, `.port-wire`, `.port-out` |
| boundary | `.boundary-edge[data-edge="top|right|bottom|left"]`, `.boundary-node`, `.boundary-caption` |
| chain | `.chain-node`, `.chain-edge`, `.chain-branches` |
| columns | `.viz-column`, `.viz-column li` |
| next | `.next-card` (an `<a>` to `/products/<slug>/`: the next product's `SHOWCASE.shot`, lazy, with provenance, name, descriptor and "Explore →") |

No hook element may carry a CSS `transform`, `opacity < 1` or `visibility` rest state.

---

## 7. Homepage hero and room (owner C)

### 7.1 Tiers (`MQ.heroSplit`; landing spec §2.1)

| Tier | Condition | Composition |
|---|---|---|
| S | `heroSplit` | `.hero` is exactly `100svh` (`min-height:500px; max-height:1600px`). Copy on the left; full-bleed canvas behind; room column on the right. |
| S-short | S and `max-height:700px` | Moments padding `10px 12px 8px 0` (59 px row), buttons 44 px, eyebrow margin `--sp-fluid-xs` |
| S-tight | S and `max-height:580px` | Lede line-height 1.45, moments 52 px rows, eyebrow margin 0 |
| P | not S, width ≥600 | `100svh`, stacked: copy, then `.hero-depth` band (`flex:1 1 auto; min-height:240px; max-height:520px`) |
| M | width <600 | Stacked, `min-height:auto`, depth band `clamp(220px, 34svh, 320px)` |
| L-phone | landscape and `max-height:499px` | Copy only; depth band `display:none` |

### 7.2 Copy (`app/hero.css`, `Hero.tsx`)

```css
.hero { --hero-copy-w: clamp(27.5rem, calc(var(--fs-hero) * 7.6), 58rem); --hero-gap-x: clamp(32px, 3.5vw, 96px);
        --copy-l: calc((100vw - min(100vw, var(--content-max))) / 2 + var(--gutter)); --copy-r: calc(var(--copy-l) + var(--hero-copy-w));
        position: relative; overflow: clip; }
.hero-copy-inner { inline-size: var(--hero-copy-w); max-inline-size: 100%; }
.hero-title { font-size: var(--fs-hero); line-height: 1.04; margin: var(--sp-fluid-s) 0 0; text-wrap: balance; }
.hero-lede  { font-size: var(--fs-lede); margin-top: calc(var(--sp-fluid-s) * .75); max-width: 46ch; }
.moments, .hero-cta { margin-top: var(--sp-fluid-s); }
/* S: */ .hero { display: grid; align-items: center; height: 100svh; padding-block: calc(var(--header-h) + 16px) 24px; }
```

- The H1 switches from `.t-display` to `.hero-title`. A copy width of 7.6em always breaks the H1 as "We engineer / intelligence for / the real world." (3 lines).
- Delete:
  - the `min-height:860px` and `max-height:800px` blocks;
  - the `max-width:1279px` restack and its `padding-block:128px 64px`;
  - `max-width:18ch`;
  - the `-22%` bleed and the left mask.
- Mandated copy is verbatim; the H1 is static.
- **Optional "All six products →" link** under the moments, pointing to `/products/`. Render it only at `min-height:640px` so the CTA check still passes at 1024×520.

### 7.3 Layered room (S tiers)

- `.hero-room { position:absolute; inset:0; z-index:0 }`.
- `Hero.tsx` uses a ResizeObserver to measure `.hero` and `.hero-copy-inner`, writes `--room-l` onto `.hero`, and passes `frame={{l,t,r,b}}` to `<Room>`:

  | Edge | Value |
  |---|---|
  | `l` | copyRight + `--hero-gap-x` |
  | `r` | vw − clamp(16px,2vw,48px) |
  | `t` | `--header-h` + 16 |
  | `b` | hero height − 24 |

- `.hero::before` scrim: solid `--surface-page` up to `--room-l − gap`, 55% at the half gap, transparent at `--room-l + 3vw`.

**Depth layers in one canvas:**

| Layer | Content |
|---|---|
| Background (z −16…−40) | Isometric lattice floor as `THREE.LineSegments`: ±30° families, ≤150 segments each, `#16405f` at α 0.35 fading by 60% depth. This **replaces `gridHelper`**. Back wall at z −30, α 0.05. Fog `near = 1.1·dist`, `far = 2.6·dist`. Far panel. |
| Midground (z −6) | 3 panels (2 when the column is <560 px wide) |
| Foreground (z +2) | The 2 near panels, **dark-UI only** (wall-11 fire-smoke, wall-12 AI in a Box governance). Light-UI captures move to the mid row; near-row scrim ≤0.2. |
| Foreground DOM | `.room-callout` ×2, aria-hidden, mono 11 px: "Yisbir · Design concept · sample data" and "AI in a Box · Product screen · demo data". Positioned by `useFrame` writing `style.transform`. |

Other room rules:
- DPR `[1, 1.5]`.
- Colours come from new `lib/scene-colors.ts` (mirrors tokens; replaces the 8 hex literals in `Room.tsx` and `themeColor` — tell E).
- Panels: drop `wall-08` and the far panel when the column is <560 px wide.

### 7.4 Camera framed from the column (`components/room/room-layout.ts`, pure and node-testable)

```ts
export function fitRoom(W: number, H: number, col: { l: number; t: number; r: number; b: number }, panels: Panel[]) {
  const ca = (col.r - col.l) / (col.b - col.t);
  const fov = clamp(30, 40 / Math.pow(ca, 0.35), 46);
  const xc = (col.l + col.r) / 2, yc = (col.t + col.b) / 2;
  const fullW = 2 * Math.max(xc, W - xc), offX = xc >= W / 2 ? 0 : fullW - W;
  const fullH = 2 * Math.max(yc, H - yc), offY = yc >= H / 2 ? 0 : fullH - H;
  // keep today's view direction; 6 passes: bisect distance d∈[8,200] so all panel corners project inside the column (6% inset),
  // then shift target in the camera plane by the bbox-centre pixel error (k = 2·d·tan(fov/2)/fullH); final bisect.
  return { fov, aspect: fullW / fullH, viewOffset: [fullW, fullH, offX, offY, W, H] as const, position, target, dist };
}
```

**R3F wiring:**
- `<Canvas camera={{ manual: true, fov: 40, near: 1, far: 200 }}>`.
- `<Framing>` runs a `useLayoutEffect` on size and frame. It sets fov, aspect and `setViewOffset`, positions the camera, calls `lookAt(target)`, then `updateProjectionMatrix()` and `invalidate()`.
- `CameraRig` orbits `target` by ≤4° yaw and ≤1.8° pitch.
- `Framing` writes `data-bbox` and `data-col` onto `.hero-room` for tests.

**Expected framing (±3%):**

| Viewport | Column | fov | Projected bbox | Near panel width |
|---|---|---|---|---|
| 1024×560 | 517–1004 × 72–536 | 39.3 | 546,173 → 974,435 | 229 |
| 1280×601 | 533–1254 × 72–577 | 35.3 | 649,102 → 1138,547 | 259 |
| 1366×657 | 618–1339 × 72–633 | 36.6 | 704,106 → 1253,599 | 295 |
| 1536×730 | 714–1505 × 78–706 | 36.9 | 801,116 → 1418,668 | 333 |
| 1920×937 | 1020–1882 × 88–913 | 39.4 | 1072,163 → 1830,838 | 412 |
| 2560×1440 | 1550–2512 × 88–1416 | 44.8 | 1607,365 → 2454,1139 | 447 |

**`RoomClient.tsx` modes:** `pending | webgl | depth`.
- `webgl` needs `MQ.roomWebgl`, not `lowPower()`, `hasWebGL()`, and a column ≥440×380.
- Anything else, or context loss, gives `depth`.
- Delete `RoomPoster.tsx`. `RoomFallback.tsx` becomes **`RoomDepth.tsx`**:
  - `.hero-depth` with `perspective:1100px` and `container-type:size`;
  - `.hd-back` (LatticeField, `translateZ(-120px) scale(1.12)`);
  - `.hd-mid` (`yisbirFireSmokePoster`, `width: min(86cqw, 85cqh*1.6)`, `rotateY(-12deg) rotateX(5deg)`);
  - `.hd-front` (`yisbirPpeCompliance600`, 44% width, bottom-left, `translateZ(60px)`);
  - `.hd-prov` (one "Design concept · sample data" label);
  - below 1024 wide, images use `loading="lazy"` and `fetchpriority="low"`.

### 7.5 Hero motion (GSAP inside `gsap.matchMedia`, tier S only; CSS for P and M)

| Id | Movement | Reduced motion |
|---|---|---|
| M-home-hero-01 entrance | On first texture: floor and wall opacity over 0–600 ms; far row z −2.2→0 at 200 ms, mid at 320, near at 440 (900 ms ease-out); callouts at 900 ms. Total ≤1.4 s. H1 static. | Final state, `frameloop="demand"` |
| M-home-hero-02 pointer | Orbit ≤4° (`hover:hover` only) | Off |
| M-home-hero-03 scroll exit | Trigger `.hero-stage`, `start:"top top"`, `end:"bottom top"`, `scrub:0.5`, no pin. `Room.setProgress(p)`: dist → 0.72·dist, target x +2, near panels yaw ±8°, canvas opacity 1→0.5, callouts out by p 0.3. Copy never transforms. | Off |
| M-home-hero-04 hand-off (D15) | `Hero.tsx` returns `<div className="hero-stage">` (`height: calc(100svh + 40svh)`) wrapping a sticky `.hero`. **`hero.css` owns** `.hero-stage + .showcase { margin-top: -40svh; position: relative; z-index: 2; background: linear-gradient(to bottom, transparent, var(--surface-page) 120px); }` | No sticky; `margin-top: 0` |
| M-home-hero-05 depth band (P, M) | `@supports (animation-timeline: view())`: `.hd-back` y 0→12 px, `.hd-mid` 0→−16 px, `.hd-front` 0→−40 px; `.hd-front` one-shot x 24→0 over 420 ms | Static |

---

## 8. Homepage gallery (owner D: `Showcase.tsx`, `showcase.css`)

### 8.1 Modes and structure

- **pinned:** `MQ.pinned` (≥1024×520, fine pointer, motion allowed).
  - CSS sticky: `.sc-film { height: calc(100svh + 2.5 * 100svh) }` wraps `.sc-pin { position:sticky; top:0; height:100svh }`.
  - One un-pinned ScrollTrigger on `.sc-film` with `start:"top top"`, `end:"bottom bottom"`, `scrub:0.5`, and `onToggle` → `html.has-pin`.
  - Remove `pin`, `anticipatePin` and `PIN_VH`.
- **rail:** everything else. Native `scroll-snap-type:x mandatory`, same card geometry, controls under the track.
- **Settle:** `lib/settle.ts` with `{ threshold: s => s*0.12, duration: 0.38 }` — identical behaviour to today. Until A ships the module, keep the inline settle.
- **Kept:** inert dimmed neighbours, focus sync, the counter (`aria-live`), previous/next and the skip link.
- **Heading:** `.sc-head` stays outside the pin with `padding-block: var(--sp-fluid-l) var(--sp-fluid-s)`; delete the `max-width:767px` override. `.sc-head`, `.sc-hint` and `.sc-controls` share the container's left edge; the first-card offset lives on the track.
- **Hint by pointer:** fine pointer gives "Scroll or use the arrows to browse the six products"; coarse gives "Swipe to browse the six products"; hidden in pinned mode.

### 8.2 Geometry

```css
.showcase { --sc-controls-h: 56px; --sc-pad-y: clamp(8px, 2svh, 24px);
  --card-h: min(calc(100svh - var(--header-h) - var(--sc-controls-h) - 2 * var(--sc-pad-y)), 900px);
  --card-w: min(calc(var(--card-h) * 2.05), 86cqw, 1600px); }
@media (max-width: 599px) { .showcase { --card-w: calc(100cqw - 60px); --sc-controls-h: 52px; } }
.sc-pin { container-type: inline-size; overflow: clip; position: relative; }
.showcase.is-pinned .sc-pin { display: grid; grid-template-rows: var(--header-h) minmax(0, 1fr) var(--sc-controls-h); }
.showcase.is-pinned .sc-track { grid-row: 2; align-self: center; padding-inline: calc((100cqw - var(--card-w)) / 2); }
.showcase.is-rail .sc-track { padding-inline: calc((100cqw - var(--card-w)) / 2); scroll-padding-inline: calc((100cqw - var(--card-w)) / 2); }
.sc-panel { flex: 0 0 var(--card-w); inline-size: var(--card-w); block-size: var(--card-h); container: card / size; scroll-snap-align: center; }
.sc-card { height: 100%; overflow: clip; }
.sc-panel { opacity: .35; transition: opacity var(--dur-base) var(--ease-standard); } .sc-panel.is-current { opacity: 1; }   /* CSS owns opacity */
.showcase.is-pinned .sc-pin::before, .showcase.is-pinned .sc-pin::after {     /* static edge fades over the peeks: no filters */
  content: ""; position: absolute; z-index: 3; pointer-events: none; top: var(--header-h); bottom: var(--sc-controls-h);
  width: max(24px, calc((100cqw - var(--card-w)) / 2)); }
.sc-pin::before { left: 0;  background: linear-gradient(90deg,  var(--surface-page), transparent); }
.sc-pin::after  { right: 0; background: linear-gradient(270deg, var(--surface-page), transparent); }
```

Remove `--cw`, `min(74svh,700px)`, `calc((100vw - var(--cw))/2)` and the `max-width:1023px` single-column rule.

**Card variants** (container queries on `card`):

| Variant | Query | Layout |
|---|---|---|
| regular | `min-height:600px` and `min-width:760px` | `5fr 7fr`, padding `clamp(24px,4cqh,48px)`, `--fs-sc-name`, proof chip and shot2 shown |
| compact | 480–599 tall, ≥760 wide | Padding 24, gaps 12, name `clamp(1.75rem,6cqh,2.5rem)`, capabilities 15 px with a 4 px gap, Deploys as one inline row, actions in one row, proof chip shown, shot2 hidden |
| tight | `max-height:479px`, ≥760 wide | Index folds into the name row; capabilities become ≤3 inline chips; Deploys inline; proof chip hidden |
| stacked | `max-width:759px` | `grid-template-rows: minmax(120px,1fr) auto`: **media first**, absorbing the leftover height (`img{max-height:100%;width:auto;object-fit:contain}`), copy below. Padding 20; name 1.75rem; full-width primary button with "Explore →" under it. Deploys hidden at `max-height:559px`. |

- Every `.sc-copy` keeps `scrollHeight ≤ clientHeight`. No line-clamp: the copy is owner text.
- `data-media` composition: `phones` 6fr/6fr; `wide` 5fr/7fr; `iso` 5fr/7fr unframed; `doc` 5fr/7fr with the screen offset; `matrix` 5fr/7fr with shot2 at translateZ.
- At ≥1024 a **name strip** of 6 `<button aria-label="Show {name}" aria-pressed>` sits in the controls row and calls `go(i)`.

### 8.3 Layers and motion

```tsx
<li className={`sc-panel ${cur ? "is-current" : ""}`} data-i={i} inert={pinned && !cur ? true : undefined}>
  <article className="sc-card" data-media={p.layout}>
    <div className="sc-bg" aria-hidden="true"><span className="sc-field" /><span className="sc-num">{p.index}</span><span className="sc-frame" /></div>
    <div className="sc-copy">…unchanged copy, SpecList, actions…</div>
    <div className="sc-media"><div className="sc-media-3d"><ScreenFrame screen={p.shot} className="sc-shot" eager={eagerFirst && i === 0} /></div>
      {p.shot2 ? <ScreenFrame screen={p.shot2} className="sc-shot2" /> : null}
      {p.proof ? <p className="sc-proof">{p.proof.text}</p> : null}</div>
  </article>
</li>
```

- `.sc-bg` is **not a lattice**. It is a radial `--p-accent` at 14% plus a 1 px inset frame with 8 px corner ticks.
- The section's one `LatticeField` stays farthest back, static.

```ts
// pinned: driven by the SMOOTHED tween, one writer per element+property
const sets = panels.map((p) => ({ card: gsap.quickSetter(q(p, ".sc-card"), "css"), bg: gsap.quickSetter(q(p, ".sc-bg"), "xPercent"),
  media: gsap.quickSetter(q(p, ".sc-media-3d"), "css"), front: qa(p, ".sc-shot2, .sc-proof").map((el) => gsap.quickSetter(el, "xPercent")) }));
panels.forEach((p) => gsap.set([q(p, ".sc-card"), q(p, ".sc-media-3d")], { transformPerspective: 1500 }));
tween.eventCallback("onUpdate", () => { const t = tween.progress() * (N - 1);
  sets.forEach((s, i) => { const c = gsap.utils.clamp(-1.5, 1.5, t - i), a = Math.abs(c);
    s.card({ scale: 1 - 0.06 * a, rotationY: -5 * c }); s.bg(18 * c);
    s.media({ rotationY: 6 * c, xPercent: -4 * c }); s.front.forEach((f) => f(-12 * c)); }); });
```

- **Rail parallax:** CSS only, via landing §3.5 keyframes on `view-timeline: --sc inline`, never GSAP on the same elements.
- **Arrival accent** (`.is-arrived` for 700 ms after settle or counter change):
  - `.sc-bg` opacity .55→1 (CSS transition; GSAP never writes its opacity);
  - `.sc-shot2` and `.sc-proof` use the CSS **`translate`** property 0 10px → 0 over 420 ms with an 80 ms delay. This composes with GSAP's `transform`.
- **Reduced motion:** rail, every panel at opacity 1, computed transform `none` on all layers.
- **Images:** the first card is eager only when the gallery is in the first viewport and the width is ≥1024. Pinned mode upgrades current+1 to eager on index change. Below-the-fold product `Link`s use `prefetch={false}`.

**Computed cards (pinned; ±20 px for scrollbar width):**

| Viewport | card-h | card-w | Variant |
|---|---|---|---|
| 1024×520 | 387 | 793 | tight |
| 1093×529 | 396 | 812 | tight |
| 1280×601 | 465 | 953 | tight |
| 1366×657 | 519 | 1064 | compact |
| 1536×730 | 583 | 1195 | compact |
| 1440×900 | 742 | 1224 | regular |
| 1536×864 | 702 | 1306 | regular |
| 1920×937 | 771 | 1581 | regular |
| 2560×1440 | 900 | 1600 | regular |

Rail examples: 1024×768 touch 625 tall (regular); 768×1024 about 660×860 (stacked); 390×844 330×702 (stacked).

---

## 9. Header, sections, footer (owner E)

- **Header:**
  - `.hdr-inner { min-height: var(--header-h); padding-block: var(--sp-fluid-xs) }`;
  - `.hdr-mark` height `clamp(20px, calc(1.9*var(--u)), 24px)`;
  - CTA ≥44 px;
  - `html.has-pin .site-header.is-condensed { backdrop-filter: none; background: var(--surface-page); }`;
  - repoint "All six products" in `Header.tsx` to `/products/`.
- **Lockup (D14):** if approved, `public/brand/meerana-lockup-horizontal-white.png` (from `research/recovered/figma-make-v17/public-meerana-assets/MEERANA-Logo-final-transparent-white-08.png`, checked against the brand PDF) at about 28 px with `alt=""`; remove `.hdr-word`. Otherwise show the symbol only, with sr-only text.
- **`app/layout.tsx`:**
  - add before first paint: `<script dangerouslySetInnerHTML={{ __html: 'try{if(localStorage.getItem("meerana:view")==="list")document.documentElement.dataset.view="list"}catch(e){}' }} />`;
  - `themeColor` from `lib/scene-colors.ts` (C provides);
  - `body { overflow-x: clip }` (C20).
- **Scenario (`Scenario.tsx`, `sections.css`):**
  - `.section { padding-block: var(--section-py) }`;
  - `SHOWN[0] = 1` with a `.is-pre` state: `::after` of `--surface-page` at 55%, opacity-only, provenance visible. The stage is never empty.
  - At ≥1024: `.how-step { min-height: max(160px, 28svh); align-content: start; padding-block: 8svh }`; `.how-node { top: calc(8svh + 4px) }` so the diamond marks its title row;
  - `.how-sticky { top: calc(var(--header-h) + 12px); height: calc(100svh - var(--header-h) - 24px) }`;
  - `.how-shot img { max-height: calc(100svh - var(--header-h) - 64px); width:auto; object-fit:contain }`;
  - below 1024: `.how-inline .screen img { max-height: 42svh }`.
- **World (`Sections.tsx`):**
  - two columns at ≥1024 (`minmax(0,1fr) minmax(0,1.6fr)`);
  - partners in 3/2/1 columns;
  - an "In the news" ruled list of 5 `PRESS` rows (outlet · date · headline ↗, new tab);
  - one line "Featured by Dubai Chambers: *Dubai Dreamers* (video) ↗" (D17);
  - "Built in the UAE. Engineered for the world." verbatim.
- **CTA:** `padding-block: clamp(56px, calc(9*var(--u)), 160px) clamp(48px, calc(7*var(--u)), 128px)`; `.cta .t-display { max-width: 18ch }`; "Together, let's build what comes next." verbatim.
- **Footer (`ui.css`):**
  - `padding-block: clamp(40px, calc(5*var(--u)), 64px) clamp(20px, calc(2.5*var(--u)), 32px)`;
  - `.footer-base { margin-top: clamp(24px, calc(4*var(--u)), 64px) }`;
  - logo `clamp(120px, calc(12*var(--u)), 168px)`;
  - below 480 px: 2 columns, with brand and Products spanning both. Target ≤720 px tall at 390×844.
- **Phase 2, after core acceptance:**
  - Dynamic Island nav (criticism spec: pill, compact after 80 px, a contextual chapter label for ≤2 s, router panel grows from the pill via transform or clip-path, `--ease-spring` used only here, instant under reduced motion; keep the focus trap and Escape);
  - `.tone-sunken::before` lattice horizon strip;
  - `.sec-head .annot` entry (x −8→0 over 240 ms);
  - `components/ui/Button.tsx`.

---

## 10. Products index, OG images, verification, docs (owner F)

- **`app/products/page.tsx`** (server):
  - `pageMeta({ title: "Products — Meerana Technologies", path: "/products/" })`;
  - a SectionHeader plus 6 `.pi-row`s (not identical cards): accent tick, index, `h2` name, descriptor, line, Deploys (if present), a small ScreenFrame (eager for the first 2), "Explore {name} →" and "Request a briefing";
  - styles in `app/pages.css` under `.pi-*`;
  - add to `app/sitemap.ts`;
  - repoint `app/contact/page.tsx` to `/products/`.
- **`app/products/[slug]/opengraph-image.tsx`:**
  - `dynamic = "force-static"`, `generateStaticParams` from `STORIES`, `ImageResponse` 1200×630;
  - content: navy ground, lattice lines, the white symbol from `public/brand`, product name, descriptor, accent bar, a cropped real screen with mono provenance;
  - no network font fetch: use a local Poppins TTF if one exists in the repo, otherwise the default font (flag it);
  - give `lib/seo.ts` `pageMeta` an `image?: string | false` override so file-based OG wins;
  - verify that `og:image` differs on all 6 routes.
- **Verification scripts:**
  - `scripts/verify-stage.mjs` (product pages);
  - `scripts/verify-landing.mjs` (homepage);
  - update `scripts/verify-launch.mjs`:
    - delete the "1280x720 rail = PASS" assertion;
    - assert a pin at 1093×529, 1280×601, 1366×657, 1536×730 and 1920×937;
    - product pages are checked against P-02, not ≤300vh;
    - homepage total pin ≤300vh;
    - restore homepage length ≤8.5×innerHeight at 1440×900;
  - retire `verify-story.mjs`;
  - the CSS `@media` value lint (§3.1).
  - All scripts run Playwright Chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader` against :4173 and save screenshots to `docs/review/2026-10-11-r3/<viewport>/`.
- **Builds:** F is the **only** person who runs `npm run build` and restarts :4173. Everyone else uses the :3000 dev server and `npm run typecheck`.
- **Docs:**
  - decision-log entries DD-26a to DD-26f (D1–D3, the gate, rail, list view) in `docs/DESIGN-DIRECTIONS.md` and `plan/05-conflict-decision-log.md`;
  - a plan/08 pointer to this spec (motion ids `M-stage-01` engine, `M-<slug>-S01…S14`, `M-home-gallery` revised, `M-home-hero-01…05`);
  - the implementation report.
- **Phase 2:** company page poster-first `youtube-nocookie` player (click to load, no autoplay).

---

## 11. Ownership, contracts and sequencing

**No git.** Every engineer copies any file they will delete or heavily rewrite into `.backup/2026-10-11-r3/<path>` first. No one edits a file they do not own. Requests go to the owner.

| Engineer | Owns (exclusive) | Consumes |
|---|---|---|
| **A: Product story engine** | `components/stage/{ProductStage,Scene,Dock,engine,choreo,useStageMode,useRail}.ts(x)`, `lib/settle.ts`, `app/stage.css`, `app/products/[slug]/page.tsx`. Deletes `components/story/Story.tsx` and `app/story.css` at integration. | E: MQ and tokens. B: types, `visibleScenes`, `SceneVisual`, hook classes. |
| **B: Content and visuals** | `content/{storyboards,media,showcase,company,scenario}.ts`, `components/stage/SceneVisual.tsx` (moved from `BeatVisual.tsx`, which is deleted), `components/ui/ScreenFrame.tsx`, `app/viz.css`, new files in `public/media/v3/`, `scripts/content-check.mjs`, `package.json` | A: scene markup and class contract |
| **C: Hero and room** | `components/sections/Hero.tsx`, `app/hero.css` (including the `.hero-stage + .showcase` rule), `components/room/*` (new `RoomDepth.tsx`; delete `RoomPoster.tsx` and `RoomFallback.tsx`), `lib/scene-colors.ts` | E: tokens and MQ. B: `yisbirPpeCompliance600`, `yisbirFireSmokePoster`. |
| **D: Gallery** | `components/sections/Showcase.tsx`, `app/showcase.css` | E: MQ and tokens. A: `lib/settle.ts`. B: `ShowcasePanel` fields. |
| **E: Foundations and sections** | `lib/breakpoints.ts`, `app/tokens.css`, `app/globals.css`, `app/header.css`, `components/site/Header.tsx`, `components/site/SiteFooter.tsx`, `app/ui.css`, `app/layout.tsx`, `app/sections.css`, `components/sections/{Scenario,Sections}.tsx`, `app/page.tsx` (only if needed) | B: `PRESS`, `FEATURE_VIDEO`. C: `scene-colors`. |
| **F: Index, OG, QA, docs** | `app/products/page.tsx`, `app/products/[slug]/opengraph-image.tsx`, `app/pages.css`, `lib/seo.ts`, `app/sitemap.ts`, `app/contact/page.tsx`, `app/company/page.tsx` (phase 2), all `scripts/verify-*.mjs`, `docs/**`, `plan/05-conflict-decision-log.md` | Everything (read-only) |

**Phase 0 (contracts, before parallel work):**
1. E lands §3.1 and §3.2 verbatim.
2. B lands the types in §5.1, `scenesFromBeats` (§5.7), the `ShowcasePanel` and `PRESS` types, and the hook-class names in §6.2 (an empty `SceneVisual` that renders the existing visuals).
3. A lands `lib/settle.ts` with the frozen API in §4.7.

**Phase 1 (parallel):**
- A: rail, list and static markup first (passes P-04 in rail at desktop sizes without JS), then the engine, then choreography.
- B: the new scenes, honesty fixes, visuals and content-check.
- C: hero and room.
- D: gallery.
- E: header and sections.
- F: index, OG and scripts against current pages.

**Phase 2 (integration, F runs):** remove the adapter, delete `Story.tsx`, `story.css` and `BeatVisual.tsx`, run the full build, run every check, take screenshots.

**Phase 3:** fix the failures each owner is assigned, then the phase-2 extras.

**Definition of done (every engineer):**
- `npm run typecheck` is clean;
- their acceptance IDs pass on :3000 and then on F's :4173 build;
- no console errors;
- axe shows 0 serious or critical issues on their surface;
- no new dependencies.

---

## 12. Acceptance

### 12.1 Per-viewport matrix (F asserts every cell)

| Viewport | Product mode | Content box | Gallery | Card h | Hero H1 | Hero CTA bottom ≤ |
|---|---|---|---|---|---|---|
| 1024×520 | stage | 391 | pinned, tight | 387 | 50.0 | innerHeight − 8 |
| 1093×529 | stage | 400 | pinned, tight | 396 | 50.9 | innerHeight − 8 |
| 1024×640 | stage | 512 | pinned, compact | 507 | 53.2 | innerHeight − 16 |
| 1280×601 | stage | 468 | pinned, tight | 465 | 57.8 | innerHeight − 16 |
| 1280×720 | stage | 568 | pinned, compact | 573 | 66.6 | innerHeight − 16 |
| 1366×657 | stage | 517 | pinned, compact | 519 | 63.2 | innerHeight − 16 |
| 1440×900 | stage | 735 | pinned, regular | 742 | 74.9 | innerHeight − 16 |
| 1536×730 | stage | 581 | pinned, compact | 583 | 70.2 | innerHeight − 16 |
| 1536×864 | stage | 696 | pinned, regular | 702 | 79.9 | innerHeight − 16 |
| 1920×937 | stage | 764 | pinned, regular | 771 | 90.1 | innerHeight − 16 |
| 1920×1080 | stage | 820 (cap) | pinned, regular | 900 | 99.8 | innerHeight − 16 |
| 2560×1440 | stage | 820 (cap) | pinned, regular | 900 | 120 | innerHeight − 16 |
| 1024×768 touch | rail | 609 | rail, regular | 625 | 53.2 | innerHeight − 16 |
| 820×1180 / 768×1024 | rail | – | rail, stacked | ≤ innerHeight − header − 52 | 58.6 (768) | innerHeight − 16 |
| 390×844 / 375×667 / 360×640 | rail | – | rail, stacked | ≤ innerHeight − header − 52 | 43.6 / 38.2 / 36.6 | innerHeight − 16 |
| 844×390, 1280×480 | list (auto) | – | rail; L-phone hero | – | – | not forced |
| 1366×657, reduced motion | static rail | 517 | rail | – | 63.2 | innerHeight − 16 |

### 12.2 Product pages (`verify-stage.mjs`, all 6 products × the stage viewports above)

| ID | Check |
|---|---|
| P-01 | `.ps[data-mode]` matches the matrix within 1.5 s of `load`. `list` persists across a reload after the toggle. |
| P-02 | Scene width = `documentElement.clientWidth` ±1. `.ps` height = innerHeight + (N−1) × clamp(480, 0.7·innerHeight, 720) ±2. |
| P-03 | For each scene i: `scrollTo(restY(i))`, wait 700 ms, then: |scene left| ≤1; every text node opacity 1; `.ps-fg`, `h1` and `h2` transforms identity (±0.5 px/°); shutter outside the scene. |
| P-04 | At rest, every descendant of `.ps-fg` and `.ps-mid` lies within x ∈ [0, innerWidth] and y ∈ [header-h, innerHeight − dock]. `scrollHeight ≤ clientHeight + 1` for `.ps-copy`, `.ps-mid` and `.viz`. Scene H2 ≤3 lines; title H1 ≤4 lines at 1024×520 and ≤3 at ≥1280. |
| P-05 | In scene 04 at p 0.25, measured displacement ratios bg : mid : fg are 0.70 : 0.88 : 1.00 ±0.05. Floor x stays in (−448, 0] and is monotonic between wraps. |
| P-06 | During the scene 05 entrance, `.ps-stage3d` has a `matrix3d` transform with m34 ≠ 0. |
| P-07 | From rest on scene k: `wheel(0,100)` settles on k+1 within 900 ms; `wheel(0,45)` advances; `wheel(0,25)` returns; two notches 300 ms apart reach k+2; six fast notches end at a rest position. |
| P-08 | →, ↓, PageDown and Space move +1; ←, ↑, PageUp and Shift+Space move −1. ↓ on the last scene scrolls into the footer. Arrows in the open header panel do not move scenes. Space on a focused button activates it. |
| P-09 | Over 80 Tab presses, each focused element is fully visible within 900 ms, outside the header and dock bands, with a non-`none` outline. The film follows focus. |
| P-10 | A chapter click lands on restY(k) within 1 s, with `aria-current` and focus on `#id-h`. `/products/tasree3/#deploy` loads settled with no glide. Back/forward restores the scene. |
| P-11 | A chapter jump of ≥3 dips track opacity below 0.2 within 150 ms, then returns to 1, with no frame showing more than 2 scenes. |
| P-12 | Reduced motion: no GSAP chunk requested; no inline transforms in `.ps`; `scroll-snap-type: x mandatory`; buttons jump instantly; `document.getAnimations().length === 0` after load; every text node opacity 1. |
| P-13 | Rail: `track.scrollWidth = N × clientWidth` ±2; snap updates the counter; buttons ≥44 px; no inner vertical scroller; `documentElement.scrollWidth ≤ innerWidth`; at ≥360×640 each scene `scrollHeight ≤ 100svh`. |
| P-14 | List: stacked; `track.scrollWidth ≤ clientWidth`; no horizontal overflow. |
| P-15 | With JS disabled: the title H1 is visible in the first frame, all N scenes are in the DOM, and the rail scrolls. |
| P-16 | Content: content-check passes (EV-520/521 listed as OWNER-PENDING); no banned string or `confirm` item in production HTML; each screen `src` appears once per page; no image rendered wider than `naturalWidth`; beat-06 features are visible on all 6 pages. |
| P-17 | axe: 0 serious or critical issues in stage (scenes 01, 06, last-but-one), rail, list and static rail. Exactly one H1. Sampled `.ps-body` contrast over big type ≥4.5:1. |
| P-18 | Bundle within §4.10. 4× CPU trace at 1366×657 over 3 scenes shows no long task >50 ms. ≤3 scenes have `.is-near`. CLS ≤0.02. |
| P-19 | Settled: `elementsFromPoint` at x = 2 and x = innerWidth − 2 (5 heights) returns only current-scene, `.ps-far` or dock elements. |
| P-20 | A MutationObserver on `style` inside `.ps` during a full traverse sees only transform, translate, rotate, scale, opacity and will-change. |
| P-21 | At load only scenes 1–3 request images. After settling on k, images in scenes ≤ k+2 are `complete`. |
| P-22 | The dev build throws on a window violation or a layer-wrapper target (unit test of `choreo.ts` in node with a fake timeline). |

### 12.3 Homepage

| ID | Check |
|---|---|
| H-01 | At every viewport: `documentElement.scrollWidth === innerWidth`; H1 exactly 3 lines with font-size per §3.3 ±1. |
| H-02 | S tiers: `.hero` height = innerHeight ±1. CTA bottom per §12.1. At 320×568 the first `.btn-primary` bottom ≤ innerHeight. |
| H-03 | WebGL S: `[data-bbox]` inside `[data-col]`; `col.l ≥ copyRight + 24`; `bbox.r ≤ innerWidth − 8`; near panel ≥0.30 × column width; values match §7.4 ±3%. |
| H-04 | Scrim pixel at (copyRight − 4, H1 centre y) equals `--surface-page` ±3 per channel. |
| H-05 | No `three` request when portrait, below 1024 wide or below 500 tall. Canvas DPR ≤1.5. Reduced motion gives `data-frameloop="demand"` with no camera change on pointer move. |
| G-01 | `is-pinned` exactly when `MQ.pinned` matches. |
| G-02 | All 6 `.sc-card`: height per §8.3 ±2 and ≤ innerHeight − header − controls; `.sc-copy` `scrollHeight ≤ clientHeight`. |
| G-03 | With `.sc-pin` at the top, `.sc-controls` bottom ≤ innerHeight. Rail: controls visible together with the card at 1024×768 and 390×844. |
| G-04 | Travel = 2.5 × innerHeight ±2. One wheel notch moves one card. 4 × Next lands on card 5. Name-strip button i settles on card i. |
| G-05 | Neighbours are `inert` at opacity 0.35. Focus sync works. The first 40 Tab stops are visible with top ≥ header-h. |
| G-06 | At rest the current `.sc-media-3d` and `.sc-card` transforms are identity; a neighbour's rotationY ≠ 0. |
| G-07 | Card centre = viewport centre ±1 px at each rest position, with classic scrollbars. |
| G-08 | Reduced motion: rail; every panel opacity 1; `.sc-bg`, `.sc-media` and `.sc-shot2` computed transform `none`. |
| S-01 | Scenario: exactly one `.how-shot.is-shown` or `.is-pre` at every step. `.how-sticky` height ≤ innerHeight − header. |
| S-02 | CTA: with `#contact` under the header, the h2 and `.cta-actions` bottom ≤ innerHeight from 1024×520 up. |
| S-03 | Footer ≤720 px at 390×844. Homepage ≤8.5 × innerHeight at 1440×900. Homepage total pin ≤300vh. |
| X-01 | 0 console errors on all routes at 3 widths. All internal links 200. `/products/` is in the sitemap. `og:image` is unique per product. |
| X-02 | **Manual (client hardware):** 1366×768 Windows laptop, Edge and Chrome, 100% and 125% scaling, mouse wheel and Precision touchpad: one notch = one scene or card; flicks settle; no floor tearing. Repeat with Windows "Animation effects" off: horizontal static rail. NVDA + Chrome reads all scenes in order. |

---

## 13. Criticism ledger

| Item (priority) | Status in this plan | Owner |
|---|---|---|
| Gallery pins only at ≥1280×760 (P0) | Fixed: ≥1024×520 (§3.1, §8) | E, D |
| Rail card taller than the screen; controls off-screen; "Swipe" for mouse users (P0) | Fixed: viewport-sized cards, controls inside the pin, hint by pointer (§8.2) | D |
| Pinned card overflow at 1440×789 (P0) | Fixed: container-query variants, G-02 | D |
| Product pages scroll vertically (P0) | Fixed (§4) | A |
| No real background/foreground depth (P0) | Fixed: 5 planes plus floor (§4.3, §8.3) | A, D |
| Same cross-fade everywhere (P0) | Fixed: 15 per-kind choreographies plus 4 transitions (§4.8) | A |
| Thin content (P0) | Fixed: 12–14 scenes from the register; proof chips, shot2, press list (§5) | B |
| Beat 06 renders nothing (P0) | Fixed: `grid` has no provenance gate; P-16 | B |
| Hero CTA below the fold; dead band; cropped room (P0) | Fixed (§7), H-02/H-03 | C |
| Test suite blind to laptop viewports (P0) | Fixed (§10, §12) | F |
| Product hero CTA below the fold (P1) | Fixed: the title scene fits the frame (P-04) | A |
| Stage visuals taller than the space (P1) | Fixed: `--ps-content-h` | A, B |
| Scenario empty first view and node drift (P1) | Fixed (§9) | E |
| Near panels dimmed or cropped (P1) | Fixed: dark-UI near row plus `fitRoom` | C |
| gridHelper floor (P2) | Fixed: isometric LineSegments | C |
| Homepage signature lattice motion (P1) | Fixed: lattice floor assembly in M-hero-01 (in canvas; no SVG duplicate, so one lattice per viewport) | C |
| Flat, non-isometric diagrams (P1) | Fixed for every new kind, `wall` and `layers`; the remaining existing kinds restyled to §6.1 | B |
| Six identical gallery cards (P1) | Fixed: `data-media` variants plus layers | B, D |
| Wasel double provenance (P2) | Fixed: `labelInAsset` | B |
| Mobile gallery copy over media (P1) | Fixed: stacked variant with media first | D |
| Header recreated wordmark (P1) | D14, then E | E |
| Dynamic Island (P2) | Phase 2 | E |
| No `/products/` index (P1) | Fixed | F |
| No per-product OG images (P2) | Fixed | F |
| Type roles not one system (P2) | Fixed: `--u` tokens. The H1 300-vs-600 weight question stays with the owner. | E |
| Breakpoints desktop-first, no height tier (P1) | Partly: shared height tiers plus a CSS value lint; new files are mobile-first. A full `max-width`→`min-width` conversion of untouched files is deferred (risk without git). | E, F |
| Mobile LCP (P1) | Partly: first gallery card and poster no longer eager, `prefetch={false}`. The font-weight cut is declined (body uses 400). | C, D |
| No srcset (P2) | Deferred: needs `sharp` (check whether Next's optional copy exists). Until then the next card is eager and the others lazy. | B |
| Interface beats lack real screens (P1) | Partly: Mandoobee, Nazo and AI in a Box show real screens. Tasree3 and Yisbir keep diagrams by story design; held screens wait for D13. Wasel is blocked (no assets). | B |
| SVG label legibility (P2) | Fixed: HTML labels | B |
| Walkthrough duplicated on mobile (P2) | Fixed: stations are the only copy | B |
| Dead-end ending (P1) | Fixed: `next` scene | A, B |
| Tone-sunken horizon (P3); annotation entry (P3); Button component (P3) | Phase 2 | E |
| Hero fifth affordance (P3) | Fixed, gated at ≥640 px tall | C |
| View transitions (P3) | Declined: needs unstable flags | – |
| Raw hex in Room.tsx (P3) | Fixed: `lib/scene-colors.ts` | C |
| `--surface-raised`; contact form; git/CI; native captures and vector logos | Blocked on the owner | – |
| Company video player (P3) | Phase 2 | F |
| Homepage length (P2) | S-03 | C, D, E |

---

## 14. Decisions needed from the client

1. **D1, product-page scroll length.** The product pages drop the pin budget, which gives about (N−1) × step of scrolling: 6,240 px for Tasree3 at 1366×657 (about 9.5 screens, one wheel notch per scene).
2. **D2, horizontal gate.** Horizontal from ≥1024×520 with a mouse or trackpad (DD-23 amended). This includes 1366×768 at 125% scaling.
3. **D3, reduced motion.** Reduced motion gets the static horizontal rail, and List view is opt-in. Please run `matchMedia('(prefers-reduced-motion: reduce)').matches` in DevTools on your own machine: if it returns true, you have been seeing the old static vertical layout.
4. **D4, composed copy.** Approve the PROVISIONAL headings and FAQ questions marked **P** in §5.4.
5. **D5, Mandoobee language claim.** The Mandoobee "Arabic and English" claim is held until EV-427 is confirmed (EV-116 conflicts with the App Store metadata).
6. **D6, Mandoobee images.** The Mandoobee three-phone cut-out (blurred personal photos; source EV-117 `confirm-with-meerana`) is withdrawn across the site in favour of `wall-08` until cleared.
7. **D7, Yisbir.** The face-recognition FAQ stays excluded (EV-535 allows it; DL-P07 default). Headcount attendance and retail shelves are PREVIEW-only. "Uniform" and "attendance" come out of the gallery line.
8. **D8, AI in a Box.** EV-520 and EV-521 must be merged into the register; the page currently rests on unregistered rows. Approve the copy fixes ("voice in English and Arabic", "the agent never signs"). Choose whether the Output scene shows the wall-12 governance screen (B's idea) or keeps the records. The EV-573 governance scene stays PREVIEW-only.
9. **D9, owner-carried copy edits.** Approve the edits in §5.6 (Nazo due dates; Wasel time-limited, direction and to-the-second; Mandoobee entities and exportable).
10. **D10, "Meerana Intelligence Layer".** It stays as mandated copy even though EV-473 marks it do-not-use.
11. **D11, next-product order.** The next product follows the gallery order and wraps around.
12. **D12, store links.** The Mandoobee App Store and Google Play links are text only, with no badge artwork.
13. **D13, held screens.** Clear the held screens: Tasree3 text-to-BPMN; Yisbir headcount, occupancy and footfall vector screens.
14. **D14, header logo.** Use the official horizontal white lockup in the header, or the symbol only.
15. **D15, hero hand-off.** Approve the moment where the gallery slides over the hero (M-hero-04; 40svh, within the homepage's 300vh total).
16. **D16, raised surface colour.** `--surface-raised` #1B2D46 (DD-14) is still open.
17. **D17, press list.** Approve the "In the news" list (EV-514) and the Dubai Chambers video link on the homepage World section.