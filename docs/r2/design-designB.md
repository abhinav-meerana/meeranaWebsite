# Horizontal Engineering Stage: design spec for product pages and the homepage gallery

**Date:** 2026-10-11 · **Status:** implementation-ready, pending owner sign-off on §0.3 · **Angle:** the "Engineering stage"

**Scope:**
- (A) Each product page (`/products/<slug>/`) becomes one horizontal, layered-depth story.
- (B) The homepage product gallery pins horizontally at every desktop or laptop size from 1024×560 up, with cards sized to fit the viewport.

**Code read for this spec:**
- `C:\Users\abhin\Desktop\meerana\components\story\Story.tsx`, `BeatVisual.tsx`
- `C:\Users\abhin\Desktop\meerana\app\story.css`, `app\showcase.css`, `app\ui.css`, `app\header.css`, `app\tokens.css`
- `C:\Users\abhin\Desktop\meerana\components\sections\Showcase.tsx`
- `C:\Users\abhin\Desktop\meerana\content\storyboards.ts`, `content\media.ts`, `content\showcase.ts`
- `C:\Users\abhin\Desktop\meerana\lib\breakpoints.ts`
- `C:\Users\abhin\Desktop\meerana\docs\MOTION-RESEARCH-2026-10-10.md`, `docs\IMPLEMENTATION-REPORT-2026-10-11.md`, `docs\STORY-PAGES-2026-10-11.md`, `docs\DEPTH-DIRECTION-2026-10-10.md`
- `C:\Users\abhin\Desktop\meerana\plan\08-scroll-animation-spec.md`
- `C:\Users\abhin\Desktop\meerana\.claude\skills\meerana-scroll-choreography\SKILL.md`, `.claude\skills\meerana-a11y-responsive\SKILL.md`
- `C:\Users\abhin\Desktop\meerana\plan\03-evidence-register.csv`, `docs\evidence-addendum-2026-10-10.csv`
- Every image in `public\media\v3\`, viewed one by one to place the callouts.

---

## 0. Summary and decisions

### 0.1 What changes

1. **Product pages scroll horizontally.**
   - Vertical input (wheel, trackpad or keyboard) drives a pinned, horizontal track of full-viewport scenes.
   - Each product page has 10 to 13 scenes (it has 8 beats today). The hero and the closing call to action are now the first and last scenes.
   - One gesture moves one scene, using the settle logic already in `Showcase.tsx`, moved into a shared module.
2. **Real layered depth.** The layers are:
   - a global *far* layer: the brand lattice drawn as a 3D floor in perspective, at 0.25× track speed;
   - a per-scene *background*: the product colour field and a large outlined numeral, at 0.70×;
   - a *midground*: an "installed module" (a product screen or a line-drawn diagram on a plinth, with `rotateY` and `translateZ`), at 0.88×;
   - a *foreground*: the copy, at 1.00×.

   These are GSAP `containerAnimation` children of one pinned ScrollTrigger.
3. **A separate choreography for each scene type**, built from a 15-preset motion vocabulary that uses only transform and opacity. It is declared in the markup (`data-e`, `data-x`) so the timings are visible and testable.
4. **More content.** New scene types (`usecases`, `trust`, `connect`, `next` with FAQ) are filled only from register rows marked `ok-to-use` or `use-with-edit`. Six more real screens get used, and callouts are placed on visible UI text.
5. **Every scene fits the viewport.**
   - Type and media sizes are `clamp()` values driven by vh and vw.
   - The fit rules are calculated for 1024×560, 1280×601, 1366×657, 1536×730, 1920×937 and larger (§4.3).
   - Content-length budgets are enforced by a check script.
6. **Gallery.** It pins at ≥1024×560 instead of ≥1280×760. Cards get their height from the viewport and the same layered depth. The existing settle logic and the inert neighbours stay.

### 0.2 Modes (layout follows the viewport, the engine follows the mode)

| Mode | When | What the visitor gets |
|---|---|---|
| `stage` | `(min-width:1024px) and (min-height:560px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)`, and list view is not chosen | A pinned horizontal track, parallax, choreography, settle. GSAP is loaded. |
| `rail` | Everything else: touch, narrower than 1024px, shorter than 560px, **and reduced motion** | A native horizontal scroll-snap rail, one scene per swipe, with previous/next buttons, chapter links and a progress bar. No GSAP. Under reduced motion nothing animates on its own. |
| `list` | Only when chosen: the "List view" button, saved in localStorage; also print | Scenes stacked as a document |
| `pending` | Server-rendered first paint, before hydration | `rail` styles (or `list` if the inline head script finds the saved preference). It works without JavaScript. |

Scenes are never stacked vertically unless the visitor asks for list view (§12).

### 0.3 Decisions for the owner to sign off (log in `plan/05-conflict-decision-log.md`)

| ID | Decision | Overrides |
|---|---|---|
| DD-NEW-1 | The product-page pin is (N − 1) × `step`, where `step = clamp(480px, 0.7 × innerHeight, 720px)`. That is 5,760 px at 1366×657 (8.8 viewports) and 7,872 px at 1920×937, for 13 scenes. | plan/08's hard-pin budget (≤150vh per pin, ≤300vh per page) and DD-23, **on product pages only**, on the client's instruction of 2026-10-11. The rule in `.claude/skills/meerana-scroll-choreography/SKILL.md` conflicts. Flag it to the owner; do not edit the skill unasked. |
| DD-NEW-2 | The gallery pins at ≥1024×560 with a fine pointer (was ≥1280×760). The pin stays at 2.5 viewport heights. | DD-23's height threshold. The homepage's total pin stays ≤300vh. |
| DD-NEW-3 | Reduced motion gets the **static horizontal rail**, not a stacked list. List view is available to everyone. | Earlier reduced-motion pattern (static stacked beats). Reasons in §12. |
| DD-NEW-4 | The hero and the closing CTA become scene 0 and scene N−1 of the track. | The current vertical `story-hero` and `story-close` |

> **Check this first on the client's own machine.** Windows with "Animation effects" turned off (common on managed enterprise laptops and in RDP sessions) makes Chrome and Edge report `prefers-reduced-motion: reduce`. The current build then shows the static, **vertical** beats, which may be exactly what the client saw. In DevTools, run `matchMedia('(prefers-reduced-motion: reduce)').matches`. DD-NEW-3 keeps such machines horizontal either way.

---

## 1. What is wrong today

Measured on 2026-10-11 against the production build on :4173, in headless Chromium with SwiftShader.

| # | Defect | Measurement | Fixed by |
|---|---|---|---|
| 1 | The product story is vertical | 8 beats in normal flow. Document height 6,801 px at 1280×601 and 9,201 px at 1920×937. | §5–§9 |
| 2 | The gallery does not pin at common laptop sizes | `is-rail` at 1280×601, 1366×657, 1536×730 and 1024×640 (needs ≥1280×**760**) | §15 |
| 3 | Gallery cards are taller than the viewport | `.sc-card` is 665 px on a 601 or 657 px viewport, 692 px at 1024×640. The card starts at y = 318 at 1366×657, so its lower half is below the fold. | §15.2 |
| 4 | The product hero is taller than the viewport | 794 px at 1280×601, 802 px at 1366×657, 814 px at 1024×640. At 1280×601 the H1 wraps to 4 lines and both buttons are below the fold. | §4, scene 0 |
| 5 | The walkthrough beat overflows | 897 px tall at heights of 601, 657 and 730; 1,006 px at 1024×640 | §4.4 budgets, §9 stations |
| 6 | The homepage hero CTA is cut at the fold at 1280×601 | Hero is 675 px on a 601 px viewport (screenshot: buttons clipped at y ≈ 595) | Hand-off, §18.3 |
| 7 | `100vw` padding includes the scrollbar | `.sc-track` padding is `calc((100vw - var(--cw))/2)`. With Windows' 17 px classic scrollbar, card 0 sits 8.5 px off-centre. | §15.2 (`100cqw`) |
| 8 | Header `backdrop-filter: blur(14px)` sits over moving pinned content | `.site-header.is-condensed`: repaints every frame during scrub | §14.4 |
| 9 | Diagrams are restyled, not redrawn | Report, "Not done": no isometric line language and no plinth or floor | §2, §9 |
| 10 | The same real screen is used twice on one page | Mandoobee `mandoobeePhones` (hero and interface); Nazo `nazoDraft` (hero and interface) | §10.4 |
| 11 | Layers move on a vertical axis, so the depth reads as a slideshow | `stage-bg` and `stage-grid` move ±0.07–0.1 × 0.5svh vertically; only the active visual is visible | §5 |

---

## 2. The Engineering stage: visual vocabulary

The stage is a drafting floor. Each scene is a bay on that floor, and each product module is "installed" into its bay.

| Element | Specification |
|---|---|
| **Floor (far layer)** | The brand lattice: two line sets at ±30°, cell 56 px, line `var(--lattice-line)` (6% white), every 4th line `color-mix(in srgb, var(--p-line) 18%, transparent)`. Drawn on a plane with `perspective(900px) rotateX(64deg)`, `transform-origin: 50% 100%`, filling the bottom 62% of the stage and fading to the horizon with a mask. |
| **Plinth** | Under every module: an isometric slab outline, two rhombi 12 px apart, as an inline SVG with 1 px strokes in `--p-line` at 35%. It makes the module look installed. |
| **Registration marks** | 10 px L-shaped corners at the four module corners, 1 px `--line-strong` |
| **Callouts** | A 6 px ring on the target, a 1 px leader 24–64 px long (`clamp(24px,4vw,64px)`), and a mono chip: 11 px, uppercase, 0.06em tracking, padding 3 px 6 px, background `--ink-950`, 1 px border `--line-strong`, radius 3 px. Text never sits on an image without its chip. At most 3 per screen. |
| **Diagrams** | Line-drawn. Nodes are hairline rectangles (1 px `--line-strong`) with fill `--ink-900`. The flow path is 1.5 px `--p-line`, and problems are dashed in `--p-accent`. Labels are mono annotation text or `--fs-label` Poppins. |
| **Numerals** | Per-scene index ("04"): Poppins 600, `font-size: clamp(9rem, 38vh, 26rem)`, line-height 0.8, letter-spacing −0.06em, `color: transparent`, `-webkit-text-stroke: 1px color-mix(in srgb, var(--p-line) 26%, transparent)`. Always on the **media side**, never behind the copy. Scene 0 uses the product name in outline across the floor instead of a number. |
| **Colour discipline** | `--p-line: var(--p-accent-2, var(--p-accent))` for structure (Tasree3: sky). `--p-accent` for warnings and the primary CTA (Tasree3: orange marks problems only). |
| **Motion character** | Calm and engineered. Rotation ≤18°, depth ≤220 px, copy travel ≤32 px. Eases only from `power1`/`power2`/`power3` (no back, elastic or bounce). No blur, no scale above 1. |

---

## 3. Modes and breakpoints

### 3.1 `lib/breakpoints.ts` (replaces the current `PIN_MIN_HEIGHT` and `MQ.pinned`)

```ts
export const BP = { sm: 480, md: 768, lg: 1024, xl: 1280 } as const;
/** Minimum height for any pinned horizontal stage (DD-NEW-1/2). */
export const PIN_MIN_HEIGHT = 560;

export const MQ = {
  md: `(min-width: ${BP.md}px)`,
  lg: `(min-width: ${BP.lg}px)`,
  xl: `(min-width: ${BP.xl}px)`,
  /** Product stage and homepage gallery pin here. */
  stage: `(min-width: ${BP.lg}px) and (min-height: ${PIN_MIN_HEIGHT}px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`,
  /** @deprecated alias, kept until Showcase migrates */
  pinned: "",            // = MQ.stage (set below)
  short: "(max-height: 700px)",
  tight: "(max-height: 620px)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
(MQ as { pinned: string }).pinned = MQ.stage;
```

### 3.2 `components/stage/useStageMode.ts`

```ts
export type StageMode = "pending" | "stage" | "rail" | "list";
const KEY = "meerana:view";             // "list" | "deck"

export function useStageMode() {
  const [mode, setMode] = useState<StageMode>("pending");
  const [list, setList] = useState(false);
  useEffect(() => { try { setList(localStorage.getItem(KEY) === "list"); } catch {} }, []);
  useEffect(() => {
    const mq = window.matchMedia(MQ.stage);
    const decide = () => setMode(list ? "list" : mq.matches ? "stage" : "rail");
    decide();
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, [list]);
  const setListView = (v: boolean) => {
    setList(v);
    try { localStorage.setItem(KEY, v ? "list" : "deck"); } catch {}
  };
  return { mode, setListView };
}
```

An inline script in `app/layout.tsx` `<head>` (wrapped in try/catch) sets `document.documentElement.dataset.view = localStorage.getItem("meerana:view") ?? ""` before first paint. CSS reads `html[data-view="list"] .ps[data-mode="pending"]` so a saved list view never flashes the rail first.

---

## 4. Stage geometry and fit

### 4.1 Tokens (on `.ps`)

```css
.ps {
  --stage-top: calc(var(--header-h) + clamp(8px, 2vh, 24px));   /* header 72px overlays the stage */
  --stage-bottom: clamp(52px, 8vh, 72px);                        /* HUD bar */
  --scene-h: calc(100svh - var(--stage-top) - var(--stage-bottom));
  --scene-max: 820px;                                            /* content box never taller */
  --scene-pad-x: var(--gutter);                                  /* clamp(16px, 4vw, 48px) */
  --col-gap: clamp(24px, 3.2vw, 64px);
  --gap-y: clamp(8px, 1.6vh, 20px);
  --media-max-h: calc(min(var(--scene-h), var(--scene-max)) - 28px); /* 28 = provenance row */

  --h-cover: clamp(2rem, min(3.6vw, 7vh) + 0.5rem, 4.25rem);
  --h-scene: clamp(1.5rem, min(2.6vw, 4.6vh) + 0.4rem, 3rem);
  --t-body:  clamp(0.9375rem, min(1.05vw, 1.9vh) + 0.35rem, 1.125rem);
  --t-item:  clamp(0.8125rem, 1.6vh + 0.2rem, 0.9375rem);
  --t-station: clamp(0.875rem, 1.9vh + 0.1rem, 1rem);
}
```

Because the type uses `min(vw, vh)`, short and wide screens get type limited by height, which is what makes 1366×657 work.

### 4.2 Resolved values at the target viewports

| Viewport | stage-top | stage-bottom | **scene-h** | h-cover | h-scene | t-body | t-item |
|---|---|---|---|---|---|---|---|
| 1024×560 | 83 | 52 | **425** | 44.9 | 32.2 | 16.2 | 13 |
| 1280×601 | 84 | 52 | **465** | 50.1 | 34.0 | 17.0 | 13 |
| 1366×657 | 85 | 53 | **519** | 54.0 | 36.6 | 18 | 13.7 |
| 1536×730 | 87 | 58 | **585** | 59.1 | 40.0 | 18 | 14.9 |
| 1024×768 | 87 | 61 | **619** | 44.9 | 32.2 | 16.2 | 15 |
| 1536×864 | 89 | 69 | **706** | 59.4 | 41.8 | 18 | 15 |
| 1440×900 | 90 | 72 | **738** | 59.8 | 43.8 | 18 | 15 |
| 1920×937 | 91 | 72 | **774** | 68 | 48 | 18 | 15 |
| 1920×1080 | 94 | 72 | 914 → **820** (capped, centred) | 68 | 48 | 18 | 15 |

### 4.3 Grid and fit arithmetic

- **`split`** (copy left): columns `minmax(0,5fr) minmax(0,7fr)`. **`split-rev`**: `7fr 5fr`, with the visual in column 1; the DOM order stays copy first. **`wide`**: a heading row, then a full-width stage row. **cover**: `6fr 6fr`.
- The grid's `max-width` is 1440 px, centred.
- **Copy column at 1280×601:** (1280 − 2×48 − 41) × 5/12 = **476 px**.
  - A 34 px heading fits about 25 characters per line, so a 60-character heading takes 3 lines = 112 px.
  - 17 px body fits about 56 characters per line, so 160 characters take 3 lines = 79 px.
  - Six features in 2 columns: 3 rows × 44 = 132 px.
  - Eyebrow 18, plus gaps: **total 385 ≤ 465 ✓**.
- **Cover at 1280×601**, copy column 571 px (about 20 characters per line at 50 px):
  - The worst H1 ("Turn hours of video into searchable intelligence.") takes 3 lines = 158 px.
  - Hero sub (165 characters, 3 lines) 79, name moment 22, buttons 44, eyebrow 18, gaps 56: **377 ≤ 465 ✓**.
- **Cover at 1024×560:** the H1 takes 4 lines = 189 px; total **396 ≤ 425 ✓**.
- **Media:** `max-height: var(--media-max-h)`, width auto, aspect ratio kept.
  - A 16:10 screen in the 7fr column is 667 px wide = 417 px tall at 1280×601 (limit 437 ✓).
  - 715 × 447 at 1366×657 (limit 491 ✓).
  - 530 × 331 at 1024×560 (limit 397 ✓).
  - The Mandoobee cut-out (1.21:1) is height-limited to 437 px tall × 530 px wide at 1280×601.
- **Wide (walkthrough at 1280×601):**
  - Heading row: 2-line heading in 6 of 12 columns, with the body beside it in the other 5: about 101 px.
  - Stations row: 5 × 218 px columns, each about 123 px tall at `--t-station`.
  - **Total 256 ≤ 465 ✓.** Even the 1,006 px walkthrough at 1024×640 now fits in 619 px.
- **Next scene at 1280×601:**
  - Left (5fr): closing line in 2 lines (75), buttons wrapped onto 2 rows (100), annotation: 229.
  - Right (7fr): a 2×2 grid of question cards, each 145 px, so 306 + 30 px heading = **336 ≤ 465 ✓**.

### 4.4 Content budgets (enforced by `scripts/content-check.mjs`; the build fails on violation)

| Field | Budget |
|---|---|
| `heading` | ≤60 characters (≤40 when the scene has `items` in the copy column) |
| `body` | ≤160 characters (≤110 with `items`) |
| `features` | ≤6 items, each ≤40 characters |
| `steps` | ≤5; `label` ≤14 characters; `copy` ≤90 characters |
| `items` | ≤4 in the copy column (laid out 2×2); `note` ≤70 characters. Tiles in a visual: ≤9. |
| `faq` | ≤4; `q` ≤48 characters; `a` ≤110 characters |
| cover `hero` | ≤52 characters; `heroSub` ≤170 characters |
| callout chip | ≤28 characters; ≤3 per screen |

### 4.5 Rules for short heights (no content is ever hidden or truncated)

```css
@media (max-height: 700px) {
  .ps { --gap-y: 8px; }
  .scene-list { row-gap: 6px; }
  .scene-fg .provenance, .screen figcaption { font-size: 11px; line-height: 16px; }
  .viz { padding: 16px; }
}
@media (max-height: 620px) {                /* 1024×560, 1280×601 */
  .ps { --stage-top: calc(var(--header-h) + 4px); --stage-bottom: 48px; }
  .scene-eyebrow { margin: 0; }
  .module-plinth { display: none; }         /* decoration only */
}
@media (max-width: 1179px) and (min-width: 1024px) {
  .scene[data-layout="split"]     .scene-grid { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
  .scene[data-layout="split-rev"] .scene-grid { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
}
```

`-webkit-line-clamp` and `display: none` on content are forbidden. Only decorations may drop out.

---

## 5. The depth model

### 5.1 Layers and rates

| Layer | Element | Moves with | Rate (relative to track) | Implementation |
|---|---|---|---|---|
| Far | `.ps-floor-grid` (global) | track tween `onUpdate` | **0.25** at the near edge, less toward the horizon (perspective) | `x = −(p · travel · 0.25) mod 112` px via `quickSetter`. 112 px is the horizontal period of a ±30° lattice at a 56 px cell, so the wrap is seamless. |
| Horizon | `.ps-horizon` (global) | static | 0 | Radial gradient of `--p-bg` / `--p-line` at 8–12% alpha |
| Background | `.scene-bg` (per scene, oversized) | containerAnimation child | **0.70** | `x: −d → +d` over the scene's full pass, `d = (1 − 0.70) × sceneWidth` |
| Midground | `.scene-mid` (per scene) | containerAnimation child | **0.88** | `d = 0.12 × sceneWidth`, plus per-kind 3D entry and exit on `.module` and `.module-inner` |
| Foreground | `.scene-fg` | the track itself | **1.00** | No parallax tween, so the copy is exactly placed at rest |
| Seam | `.scene-seam` (1 px vertical hairline at the scene's left edge, floor area only) | track | 1.00 | aria-hidden |

**The maths.** A scene's pass is 2 × sceneWidth of track travel: its left edge goes from the viewport's right edge to −sceneWidth. A layer that counter-moves by 2d over the pass travels 2W − 2d on screen. Setting that equal to `rate × 2W` gives `d = W(1 − rate)`. At the midpoint, when the scene is aligned, every layer is at offset 0.

**Edge scenes**, so no ScrollTrigger position is ever extrapolated before or after the container animation:
- scene 0 runs only the second half (`start "left left"` → `end "right left"`, `x: 0 → +d`);
- scene N−1 runs only the first half (`"left right"` → `"left left"`, `x: −d → 0`).

### 5.2 Clipping (required)

`.scene { overflow: clip; contain: layout paint style; }`.

Any layer slower than the track lags toward the viewport once its scene has left. Without the clip, the previous scene's background would show 0.3 × W into the current scene at rest. With the clip, each scene is a window and its slower layers slide inside it.

- `.scene-field` gets `inset: 0 -32%` so it covers every offset.
- Use `overflow: clip`, **never `hidden`**. `hidden` makes the element scrollable by the browser: focusing an off-screen control would change its `scrollLeft` and break the track. `clip` never scrolls, and it does not break pinning.

### 5.3 Perspective

- Modules use GSAP `transformPerspective: 1600` (it becomes the first transform function). Do not rely on `preserve-3d` across the track or the scene: `contain: paint` and `overflow: clip` flatten it, and they should.
- The floor is a static outer element `.ps-floor` (`perspective(900px) rotateX(64deg)`) with a moving inner `.ps-floor-grid`. The inner translation happens in the rotated plane, so near rows move faster than far rows from a single 2D transform.
- **Do not** animate `.ps-floor` itself. GSAP's transform order (translate before rotate) would move it in screen space and lose the perspective.

---

## 6. Component and DOM structure

### 6.1 Files

```
components/stage/
  ProductStage.tsx     client root: mode, state (current, near set), renders Scene[] + StageHud
  Scene.tsx            one scene: SceneBg / SceneCopy / SceneModule
  SceneVisual.tsx      ← BeatVisual.tsx renamed; existing kinds redrawn + new kinds (§9.3)
  StageHud.tsx         count, sr-only live region, chapter nav, progress, prev/next, list-view toggle
  engine.ts            buildStage(): one pin + containerAnimation children (§7)
  moves.ts             ENTER / EXIT presets + seq() timing helper (§8)
  useStageMode.ts      (§3.2)
  useRail.ts           rail-mode index via IntersectionObserver + button scrolling (§11)
lib/settle.ts          createSettle(), extracted unchanged from Showcase.tsx (§7.4)
app/stage.css          replaces app/story.css
```

**Delete:**
- `components/story/Story.tsx`
- `.stage`, `.stage-*`, `.beats`, `.beat*`, `.story-hero*` and `.story-close*` in `story.css`

`app/products/[slug]/page.tsx` renders `<ProductStage story={story} />` and imports `../../stage.css`.

### 6.2 Markup

```html
<div class="ps" data-mode="pending|stage|rail|list" data-slug="tasree3"
     style="--p-bg:…; --p-fg:…; --p-accent:…; --p-accent-2:…">
  <a class="ps-skip" href="#next">Skip to Tasree3 questions and contact</a>

  <div class="ps-pin">                                     <!-- pinned in stage; container-type: inline-size -->
    <div class="ps-far" aria-hidden="true">
      <div class="ps-floor"><div class="ps-floor-grid"></div></div>
      <div class="ps-horizon"></div>
    </div>

    <div class="ps-track">
      <section class="scene" id="cover" data-i="0" data-kind="cover" data-layout="split"
               aria-labelledby="cover-h">
        <span class="scene-seam" aria-hidden="true"></span>
        <div class="scene-bg" aria-hidden="true">          <!-- parallax 0.70 -->
          <div class="scene-field" data-e="fade" data-at="0" data-dur="0.6"></div>
          <span class="scene-numeral" data-e="fade" data-at="0.1" data-dur="0.45">TASREE3</span>
        </div>
        <div class="scene-grid">
          <div class="scene-fg" data-x="leave" data-x-at="0.15" data-x-dur="0.4">
            <p class="annot scene-eyebrow">Products · <span class="accent-text">Tasree3</span></p>
            <h1 id="cover-h" class="scene-h scene-h--cover" tabindex="-1">Zero bureaucracy. One process solution.</h1>
            <p class="scene-body">…</p>
            <p class="annot scene-name-moment"><span lang="ar" dir="rtl">تسريع</span> — acceleration</p>
            <div class="scene-ctas">…primary + external…</div>
          </div>
          <div class="scene-mid">                           <!-- parallax 0.88 -->
            <div class="module" data-x="recede" data-x-at="0.1" data-x-dur="0.75">
              <svg class="module-plinth" aria-hidden="true">…</svg>
              <div class="module-inner">
                <figure class="screen is-fit">
                  <div class="screen-box"><img … fetchpriority="high" loading="eager"></div>
                  <figcaption><span class="provenance">Product screen · demo data</span></figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- scenes 1 … N−2: same shape, <h2 id="{id}-h">, eyebrow "02 · Problem" -->

      <section class="scene" id="next" data-kind="next" …> closing line, CTA, FAQ </section>
    </div>

    <div class="ps-hud">…§13.3…</div>
  </div>
  <span id="ps-end" tabindex="-1"></span>
</div>
```

**Rules:**
- There is one `<h1>`, in the cover. Every other scene has an `<h2>` with `tabindex="-1"` so it can receive focus from the chapter nav.
- Scene `id`s are the URL fragments: `cover`, `problem`, `people`, `platform`, `interface`, `walkthrough`, `features`, the per-product new ids (§10), and `next`.
- **Never put `data-e` or `data-x` on `.scene-bg` or `.scene-mid`.** Those two own parallax `x`. Entry goes on inner elements and exit on outer elements, so no element and property pair is ever written by two timelines (§8.3).
- CSS has **no hidden pre-states**. The `from` states are applied only by GSAP in stage mode, so rail, list, no-JS and reduced-motion visitors always see the finished layout.

---

## 7. The engine (GSAP)

### 7.1 Loading

Stage mode only:

```ts
const [{ default: gsap }, { ScrollTrigger }, { ScrollToPlugin }] = await Promise.all([
  import("gsap"), import("gsap/ScrollTrigger"), import("gsap/ScrollToPlugin"),
]);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
await document.fonts.ready;                       // measure after fonts
requestAnimationFrame(() => { teardown = buildStage(gsap, ScrollTrigger, root, api); });
```

Rail and list modes never download GSAP; check this in the network log, AC-15.

### 7.2 `components/stage/engine.ts`

```ts
import { ENTER, EXIT } from "./moves";
import { createSettle } from "@/lib/settle";

export const STAGE = {
  step: () => Math.min(720, Math.max(480, window.innerHeight * 0.7)),  // scroll px per scene
  bgRate: 0.70, midRate: 0.88, farRate: 0.25,
  latticePeriod: 112, scrub: 0.5,
};

type Api = { onIndex(i: number, settled: boolean): void; onLive(live: boolean): void };

export function buildStage(gsap: GSAP, ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger,
                           root: HTMLElement, api: Api) {
  const pin = root.querySelector<HTMLElement>(".ps-pin")!;
  const track = root.querySelector<HTMLElement>(".ps-track")!;
  const floor = root.querySelector<HTMLElement>(".ps-floor-grid");
  const fill = root.querySelector<HTMLElement>(".ps-progress-fill");
  const scenes = gsap.utils.toArray<HTMLElement>(".scene", track);
  const N = scenes.length;
  let travel = 0;                                         // measured, never 100vw × n (scrollbars)
  const measure = () => { travel = scenes[N - 1].offsetLeft - scenes[0].offsetLeft; };
  let trackTween!: gsap.core.Tween;
  let settle!: ReturnType<typeof createSettle>;

  const ctx = gsap.context(() => {
    /* 1 · the one pinned ScrollTrigger; its tween is the containerAnimation (ease MUST be none) */
    trackTween = gsap.to(track, {
      x: () => -travel,
      ease: "none",
      scrollTrigger: {
        id: "ps",
        trigger: pin,
        start: "top top",
        end: () => `+=${STAGE.step() * (N - 1)}`,
        pin: true,
        scrub: STAGE.scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onToggle: (self) => {
          root.classList.toggle("is-live", self.isActive);
          document.documentElement.classList.toggle("has-pin", self.isActive);
          api.onLive(self.isActive);
        },
        onUpdate: (self) => { if (!settle?.moving) api.onIndex(Math.round(self.progress * (N - 1)), false); },
      },
    });

    /* 2 · far floor + progress bar: driven by the (smoothed) tween, not a 2nd trigger */
    const setFloor = floor ? gsap.quickSetter(floor, "x", "px") : null;
    const setFill = fill ? gsap.quickSetter(fill, "scaleX") : null;
    trackTween.eventCallback("onUpdate", () => {
      const p = trackTween.progress();
      setFloor?.(-((p * travel * STAGE.farRate) % STAGE.latticePeriod));
      setFill?.(p);
    });

    scenes.forEach((scene, i) => {
      const child = (start: string, end: string) => ({
        trigger: scene, containerAnimation: trackTween, start, end, scrub: true, invalidateOnRefresh: true,
      });

      /* 3 · parallax, full pass (edge scenes run one half only, §5.1) */
      const layer = (sel: string, rate: number) => {
        const el = scene.querySelector<HTMLElement>(sel);
        if (!el) return;
        const d = () => (1 - rate) * scene.offsetWidth;
        if (i === 0)        gsap.fromTo(el, { x: 0 },        { x: () => d(), ease: "none", scrollTrigger: child("left left", "right left") });
        else if (i === N-1) gsap.fromTo(el, { x: () => -d() }, { x: 0,       ease: "none", scrollTrigger: child("left right", "left left") });
        else                gsap.fromTo(el, { x: () => -d() }, { x: () => d(), ease: "none", scrollTrigger: child("left right", "right left") });
      };
      layer(".scene-bg", STAGE.bgRate);
      layer(".scene-mid", STAGE.midRate);

      /* 4 · rest pose for 3D modules (CSS rest transforms are disabled in stage mode, §16) */
      scene.querySelectorAll<HTMLElement>(".module-inner[data-rest-ry]").forEach((m) =>
        gsap.set(m, { rotateY: Number(m.dataset.restRy), transformPerspective: 1600 }));

      /* 5 · entry: inner elements, scene arrives from the right (not for the cover) */
      if (i > 0) {
        const tl = gsap.timeline({ scrollTrigger: child("left right", "left left") });
        fill(tl, scene, "e");
      }
      /* 6 · exit: outer elements, scene leaves to the left (not for the last scene) */
      if (i < N - 1) {
        const tl = gsap.timeline({ scrollTrigger: child("left left", "right left") });
        fill(tl, scene, "x");
      }
    });
  }, root);

  /* 7 · settle: one gesture = one scene (§7.4) */
  settle = createSettle({
    gsap, count: N, trigger: () => trackTween.scrollTrigger ?? null,
    duration: 0.6, ease: "power2.inOut", idleMs: 140,
    nudge: (step) => Math.min(step * 0.12, 40),            // a 100px wheel notch always advances
    onIndex: api.onIndex,
  });

  /* 8 · keyboard, focus, hash (§7.5) */
  const offKeys = bindKeys(() => trackTween.scrollTrigger!, settle, N, root);
  const offFocus = bindFocusSync(root, settle);
  jumpToHash(scenes, settle, trackTween);

  const ro = new ResizeObserver(gsap.utils.debounce?.(() => ScrollTrigger.refresh(), 150)
                                ?? (() => ScrollTrigger.refresh()));
  ro.observe(root);
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

  return () => {
    ro.disconnect(); offKeys(); offFocus(); settle.destroy();
    document.documentElement.classList.remove("has-pin");
    ctx.revert();
  };
}

/** Builds a scene's entry or exit timeline from its data attributes; normalised to duration 1. */
function fill(tl: gsap.core.Timeline, scene: HTMLElement, w: "e" | "x") {
  const sel = w === "e" ? "[data-e]" : "[data-x]";
  scene.querySelectorAll<HTMLElement>(sel).forEach((el) => {
    const name = (w === "e" ? el.dataset.e : el.dataset.x)!;
    const preset = (w === "e" ? ENTER : EXIT)[name];
    const at = Number(w === "e" ? el.dataset.at : el.dataset.xAt);
    const dur = Number(w === "e" ? el.dataset.dur : el.dataset.xDur);
    if (process.env.NODE_ENV !== "production") assertTiming(el, w, name, preset, at, dur);
    tl.fromTo(el, preset.from(el), { ...preset.to(el), duration: dur, immediateRender: w === "e" }, at);
  });
  tl.set({}, {}, 1);
}
```

`gsap.utils.debounce` does not exist in GSAP 3.15. Implement a local `debounce(fn, 150)`; the line above only marks where it goes.

### 7.3 Index state, lazy media and `is-near`

`api.onIndex(i, settled)` does three things:
- `setCurrent(i)` only when the index changes.
- On `settled === true`, it writes the sr-only live region ("Scene 5 of 13: Interface") and calls `history.replaceState(null, "", "#" + scenes[i].id)`.
- It sets `.scene.is-near` on scenes with `|k − i| ≤ 1`, which carry the `will-change` rules in §14.

Media loading is `loading={k <= current + 2 ? "eager" : "lazy"}`. Changing `lazy` to `eager` starts the fetch at once. Lazy images inside a clipped, translated track might otherwise never come near the viewport.

### 7.4 `lib/settle.ts`

Extracted from `Showcase.tsx` with no behaviour change for the homepage.

```ts
export function createSettle(o: {
  gsap: GSAP; count: number; trigger: () => ScrollTrigger | null;
  duration: number; ease?: string; idleMs?: number;
  nudge: (step: number) => number;            // home: s => s * 0.12 (today's value)
  onIndex: (i: number, settled: boolean) => void;
}) {
  let timer = 0, moving = false, settledAt = 0;
  const yOf = (i: number) => { const st = o.trigger(); return st ? st.start + (i / (o.count - 1)) * (st.end - st.start) : 0; };
  const toIndex = (i: number, instant = false) => {
    const y = yOf(i); moving = true; o.onIndex(i, false);
    o.gsap.to(window, {
      scrollTo: { y, autoKill: true }, duration: instant ? 0 : o.duration,
      ease: o.ease ?? "power2.inOut", overwrite: true,
      onComplete: () => { moving = false; settledAt = y; o.onIndex(i, true); },
      onInterrupt: () => { moving = false; },
    });
  };
  const settle = () => {
    const st = o.trigger(); if (!st || moving) return;
    const y = window.scrollY;
    if (y < st.start - 2 || y > st.end + 2) return;                 // outside the pin: never pull back
    const step = (st.end - st.start) / (o.count - 1);
    const from = Math.round((settledAt - st.start) / step);
    let i = Math.round((y - st.start) / step);
    if (i === from && Math.abs(y - settledAt) > o.nudge(step)) i = from + Math.sign(y - settledAt);
    i = Math.max(0, Math.min(o.count - 1, i));
    const target = yOf(i);
    if (Math.abs(target - y) < 2) { settledAt = target; o.onIndex(i, true); return; }
    toIndex(i);
  };
  const onScroll = () => { if (moving) return; clearTimeout(timer); timer = window.setTimeout(settle, o.idleMs ?? 140); };
  window.addEventListener("scroll", onScroll, { passive: true });
  return {
    toIndex, yOf,
    get moving() { return moving; },
    sync() { settledAt = window.scrollY; },
    destroy() { clearTimeout(timer); window.removeEventListener("scroll", onScroll); o.gsap.killTweensOf(window); },
  };
}
```

- Homepage: `duration 0.38`, `nudge: s => s * 0.12`. This is identical to today.
- Product stage: `duration 0.6`, `nudge: s => Math.min(s * 0.12, 40)`. At step 480–720, 12% would be 58–86 px; the 40 px cap guarantees that one 100 px wheel notch always advances.

### 7.5 Keyboard, focus and hash

```ts
function bindKeys(st: () => ScrollTrigger, settle: Settle, N: number, root: HTMLElement) {
  const onKey = (e: KeyboardEvent) => {
    if (!st().isActive || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const a = document.activeElement as HTMLElement | null;
    const inStage = !a || a === document.body || root.contains(a);
    if (!inStage) return;                                   // header menus keep their arrow keys
    if (a?.closest("input,textarea,select,[contenteditable],[aria-expanded='true']")) return;
    const interactive = a?.matches("button,a,summary");
    const next = ["ArrowRight", "ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey && !interactive);
    const prev = ["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey && !interactive);
    if (!next && !prev) return;
    const cur = Math.round(st().progress * (N - 1));
    const to = cur + (next ? 1 : -1);
    if (to < 0 || to > N - 1) return;                       // native scroll leaves the pin
    e.preventDefault();
    settle.toIndex(to);
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}

function bindFocusSync(root: HTMLElement, settle: Settle) {
  const onFocus = (e: FocusEvent) => {
    const s = (e.target as HTMLElement).closest<HTMLElement>(".scene");
    if (!s) return;
    const i = Number(s.dataset.i);
    requestAnimationFrame(() => settle.toIndex(i, matchMedia(MQ.reduced).matches));
  };
  root.addEventListener("focusin", onFocus);
  return () => root.removeEventListener("focusin", onFocus);
}
```

**Chapter link click (stage mode):**
1. `preventDefault`.
2. `settle.toIndex(i)`.
3. On complete, `heading.focus({ preventScroll: true })` and `replaceState`.

In rail and list modes the links stay native fragment links.

**Hash on load (`jumpToHash`):**
1. If `#id` matches scene i > 0, call `window.scrollTo(0, settle.yOf(i))`.
2. `ScrollTrigger.update()`.
3. `trackTween.scrollTrigger.getTween()?.progress(1)` to skip the scrub glide.
4. `settle.sync()`.

`Home` and `End` stay native (page top and bottom), so the visitor is never trapped.

---

## 8. Motion vocabulary

### 8.1 `components/stage/moves.ts`

Transform and opacity only. **Never use `autoAlpha` or visibility**, which would remove entering scenes from the accessibility tree.

```ts
type P = { from: (el: HTMLElement) => gsap.TweenVars; to: (el: HTMLElement) => gsap.TweenVars };
const k = (v: gsap.TweenVars) => () => v;
const num = (el: HTMLElement, key: string, d = 0) => Number(el.dataset[key] ?? d);

export const ENTER: Record<string, P> = {
  rise:    { from: k({ y: 18, opacity: 0 }),                                        to: k({ y: 0, opacity: 1, ease: "power2.out" }) },
  fade:    { from: k({ opacity: 0 }),                                               to: k({ opacity: 1, ease: "none" }) },
  standUp: { from: k({ rotateX: 72, y: 24, opacity: 0, transformOrigin: "50% 100%", transformPerspective: 900 }),
             to: k({ rotateX: 0, y: 0, opacity: 1, ease: "power2.out" }) },
  install: { from: k({ y: -36, z: 60, opacity: 0, transformPerspective: 1600 }),     to: k({ y: 0, z: 0, opacity: 1, ease: "power3.out" }) },
  dolly:   { from: k({ rotateY: -18, z: -120, scale: 0.94, opacity: 0, transformPerspective: 1600 }),
             to: (el) => ({ rotateY: num(el, "restRy", -3), z: 0, scale: 1, opacity: 1, ease: "power2.out" }) },
  floorUp: { from: k({ rotateX: 14, y: 30, opacity: 0, transformOrigin: "50% 100%", transformPerspective: 1600 }),
             to: k({ rotateX: 0, y: 0, opacity: 1, ease: "power2.out" }) },
  arrive:  { from: k({ z: -220, y: 28, opacity: 0, transformPerspective: 1200 }),    to: k({ z: 0, y: 0, opacity: 1, ease: "power2.out" }) },
  feed:    { from: k({ x: -56, opacity: 0 }),                                       to: k({ x: 0, opacity: 1, ease: "power2.out" }) },
  emit:    { from: k({ x: -16, opacity: 0 }),                                       to: k({ x: 0, opacity: 1, ease: "power2.out" }) },
  scatter: { from: (el) => ({ x: num(el, "fx"), y: num(el, "fy"), opacity: 0 }),      to: k({ x: 0, y: 0, opacity: 1, ease: "power2.out" }) },
  drawX:   { from: (el) => ({ scaleX: 0, transformOrigin: el.dataset.origin ?? "0% 50%" }), to: k({ scaleX: 1, ease: "power1.inOut" }) },
  drawY:   { from: (el) => ({ scaleY: 0, transformOrigin: el.dataset.origin ?? "50% 0%" }), to: k({ scaleY: 1, ease: "power1.inOut" }) },
  pop:     { from: k({ scale: 0, opacity: 0 }),                                     to: k({ scale: 1, opacity: 1, ease: "power2.out" }) },
  plinth:  { from: k({ scale: 0.92, opacity: 0 }),                                  to: k({ scale: 1, opacity: 1, ease: "power2.out" }) },
  fan:     { from: k({ y: 0, z: 0 }),                                               to: (el) => ({ y: num(el, "ty"), z: num(el, "tz"), ease: "power2.out" }) },
  deal:    { from: (el) => ({ x: num(el, "fx"), rotateY: -12, z: -80, opacity: num(el, "fo", 1), transformPerspective: 1400 }),
             to: k({ x: 0, rotateY: -3, z: 0, opacity: 1, ease: "power2.out" }) },
};

export const EXIT: Record<string, P> = {
  leave:  { from: k({ x: 0, opacity: 1 }),                                          to: k({ x: -32, opacity: 0, ease: "power1.in" }) },
  recede: { from: k({ rotateY: 0, z: 0, opacity: 1, transformPerspective: 1600 }),  to: k({ rotateY: 14, z: -140, opacity: 0, ease: "power1.in" }) },
  fade:   { from: k({ opacity: 1 }),                                                to: k({ opacity: 0, ease: "none" }) },
};

/** Staggered timing that always lands by the dwell edge (default 0.86). */
export const seq = (n: number, base: number, dur: number, maxStep: number, end = 0.86) => {
  const step = n > 1 ? Math.min(maxStep, (end - base - dur) / (n - 1)) : 0;
  return (i: number) => ({ "data-at": (base + step * i).toFixed(3), "data-dur": String(dur) });
};
```

### 8.2 Timing windows and the dwell rule

Positions are fractions of the scene's window:
- **E (entry):** `"left right" → "left left"`. At 0 the scene is off to the right; at 1 it is aligned.
- **X (exit):** `"left left" → "right left"`. At 0 it is aligned; at 1 it is gone to the left.

**Dwell rule (asserted in development):**
- Every entry finishes by **E 0.86**: `at + dur ≤ 0.86`.
- Every exit starts at **X ≥ 0.10**.

This leaves a ±10–14% band around alignment in which nothing moves except the track. Combined with settle, copy never moves while it is being read (skill rule 5). Because the scrub is reversible, scrolling back plays both windows in reverse.

### 8.3 Single-writer rule

| Element | Written by | Never also written by |
|---|---|---|
| `.ps-track` | track tween (`x`) | anything |
| `.ps-floor-grid` | `quickSetter` (`x`) | anything |
| `.scene-bg`, `.scene-mid` | parallax (`x`) | entry or exit |
| `.scene-fg`, `.module` | exit (`data-x`) | entry |
| children of `.scene-fg`, `.module-inner`, diagram parts, `.scene-field`, `.scene-numeral` | entry (`data-e`) | exit |

The development assert throws if an element carries both `data-e` and `data-x`, or if `.scene-bg` or `.scene-mid` carries either.

---

## 9. Scene catalogue: layout and choreography

### 9.1 Shared timings (every scene except the cover; components emit these attributes)

| Element | Preset | at | dur |
|---|---|---|---|
| `.scene-field` | fade | 0.00 | 0.60 |
| `.scene-numeral` | fade | 0.10 | 0.45 |
| `.scene-eyebrow` | rise | 0.30 | 0.24 |
| `.scene-h` | rise | 0.34 | 0.28 |
| `.scene-body` | rise | 0.42 | 0.28 |
| `.scene-list > li` | rise | `seq(n, 0.48, 0.22, 0.025)` | |
| `.scene-items > li` | rise | `seq(n, 0.48, 0.24, 0.04)` | |
| `.scene-links`, `.scene-ctas` | rise | 0.60 | 0.22 |
| `.module-plinth` | plinth | 0.08 | 0.34 |
| **Exit** `.scene-fg` | leave | X 0.12 | 0.43 |
| **Exit** `.module` | recede | X 0.10 | 0.75 |

### 9.2 By scene type

All `at`/`dur` values are in E units unless marked X. "k" is the item index.

| Kind (layout) | Narrative purpose | Module and diagram choreography |
|---|---|---|
| **cover** (split 6/6) | The product, installed and at rest on load | **No entry.** On load, CSS only (motion allowed): `.ps-floor` runs `lattice-assemble` (existing, 720 ms, the page's single signature motion); `.module-plinth` draws in with CSS `scaleX` 0→1 over 480 ms after a 200 ms delay. The H1 and the hero screen never animate on load (LCP). Exit: `.scene-fg` leave X 0.15/0.40; `.module` recede X 0.10/0.75. |
| **problem / split** (split) | Drawn versus real diverge | `.module-inner` fade 0.10/0.30. `.viz-divide` drawY 0.20/0.25. Left nodes rise `seq(n,0.28,0.20,0.035)`. Right non-warning nodes feed `seq(n,0.38,0.22,0.035)`. **Warning nodes land last**: rise `seq(n,0.62,0.18,0.04)`. |
| problem / wall (Yisbir) | Too much footage | `.viz-cam` arrive, order [4,1,5,0,3,2], `at = 0.20 + 0.06·order`, dur 0.26 |
| problem / system, no hub | Disconnected tools | Each `li`: scatter from `data-fx = (k − (n−1)/2)·48`, `data-fy = k%2 ? 20 : −20`, `seq(n,0.25,0.30,0.05)`. Dashed outlines are static. |
| **people / tiles** (split-rev) | People standing on the floor | `.viz-tile` standUp `seq(n,0.28,0.30,0.06)` |
| people / lanes (Tasree3) | One case across departments | `.viz-lane` feed `seq(4,0.24,0.24,0.05)`. `.viz-lane-path` fade 0.58/0.24. |
| **intro / tiles** (split) | Modules installed one by one | `.viz-tile` install `seq(n,0.22,0.32,0.10)` |
| intro / system with hub (Mandoobee) | One app, five functions | `.viz-hub` pop 0.22/0.24. `li` rise `seq(n,0.36,0.22,0.05)`. |
| intro / layers (Yisbir) | One frame separates into four layers, which is literal depth | `.viz-layer` fan 0.30/0.50 with `data-ty = 16k`, `data-tz = −36k`. CSS rest state = the fanned state (`translate3d(0, calc(var(--i)*16px), calc(var(--i)*-36px))`); delete the inline styles in BeatVisual. The list has `perspective: 900px; transform-style: preserve-3d`. |
| intro / chain (Nazo, new) | Lifecycle | `.chain-node` rise `seq(7,0.24,0.20,0.06)`. `.chain-edge` drawX at node + 0.06, dur 0.14. `.chain-branches` fade 0.70/0.16. |
| intro / screen (Wasel, AI in a Box) | The product itself | `.module-inner` install 0.18/0.50 |
| **interface / screen** (split) | A camera dolly onto the real UI | `.module-inner` dolly 0.05/0.72 (rest `data-rest-ry="-3"`). Provenance rise 0.55/0.22. Callouts: `.callout-line` drawX `seq(n,0.62,0.14,0.04)`; `.callout-label` rise `seq(n,0.66,0.18,0.04)`. |
| interface / records (Yisbir) | Search results arrive | `.module-inner` fade 0.10/0.30. `li` rise `seq(n,0.32,0.22,0.06)`. `.rec-rule` drawX at li + 0.04. |
| interface / phone (Wasel) | Gate status on a phone | `.viz-phone-body` install 0.15/0.45. `.viz-phone-row` rise `seq(3,0.45,0.20,0.06)`. |
| interface / flow with rework (Tasree3) | Mined reality, including the loop | SVG edges fade `seq(n,0.30,0.12,0.06)` left to right. Rework group rise 0.62/0.20 (dashed warning stroke). |
| **walkthrough / stations** (wide) | Steps laid out along the direction of travel | `.walk-rail` drawX 0.14/0.40. For station k: `.walk-tick` pop 0.24+0.09k / 0.12; `.walk-n, .walk-l` rise 0.27+0.09k / 0.18; `.walk-copy` rise 0.31+0.09k / 0.18 (k = 4 ends at 0.85 ✓). |
| **features / grid** (split-rev) | Capabilities stand up from the floor | `li` standUp `seq(n,0.28,0.24,0.035)`, row-major. `.viz-tick` comes with its row. |
| **usecases / tiles** (split) | Contexts arriving on the stage | `.viz-tile` arrive `seq(n,0.22,0.30,0.07)` (9 tiles: step falls to 0.0425) |
| usecases / gallery (Yisbir) | Real screens dealt like cards | `.gallery-shot` deal 0.22+0.12k / 0.40; card k > 0 starts stacked on card 0 (`data-fx = −slotX`, `data-fo = 0`) |
| usecases / matrix (Nazo) | Actions by role | `.matrix-col` arrive `seq(3,0.22,0.30,0.08)`. Column items rise `0.36 + 0.08·col + 0.02·j`, dur 0.16, then fitted by `seq`. |
| **trust / stack** (split or split-rev) | A boundary drawn around the system | Boundary drawn in order: top drawX 0.12/0.18; right drawY 0.24/0.18; bottom drawX (`data-origin="100% 50%"`) 0.36/0.18; left drawY (`data-origin="50% 100%"`) 0.48/0.18. `.stack-layer` rise from the bottom up, `seq(n,0.40,0.24,0.07)`. |
| trust / chain (Tasree3 governance, Nazo seal) | Cause, then result | As intro / chain |
| **connect / ports** (wide) | Data flows in the direction of travel | `.port-in` feed `seq(n,0.18,0.24,0.05)`. `.port-core` install 0.30/0.28. `.port-wire` drawX `seq(n,0.40,0.16,0.03)`. `.port-out` emit `seq(n,0.58,0.22,0.05)`. |
| **output / records** (split) | The record prints | `li` rise `seq(n,0.30,0.22,0.06)`. `.rec-rule` drawX at li + 0.04, dur 0.20. |
| output / screen | The result rises from the floor | `.module-inner` floorUp 0.10/0.66, plus callouts as for interface |
| **value / tiles** (split-rev) | Calm close | `.viz-tile` standUp `seq(n,0.30,0.30,0.08)` |
| value / screen (Yisbir) | | floorUp 0.10/0.66 |
| **next** (split 5/7) | Questions, then contact | `.next-close` rise 0.30/0.30. `.scene-ctas` rise 0.52/0.24. `.qa-card` arrive `seq(4,0.34,0.30,0.06)`. No exit (last scene); the pin releases into the footer. |

### 9.3 SceneVisual kinds

| Kind | Status | Renders | Accessibility |
|---|---|---|---|
| split, lanes, flow, layers, wall, phone, records, system, tiles | Existing, **redrawn** to §2 (plinth, hairlines, registration marks). Tiles raises its cap from 6 to 9. | | `aria-hidden` echo of the copy, plus the provenance label (as now) |
| `steps`, now drawn as **stations** | Changed: it is the only copy of the steps (remove the duplicate `beat-steps` from the copy) | `ol.viz-stations` | **Content**, not hidden |
| `chain` *(new)* | `{ nodes: string[]; branches?: string[] }` | `ol` of nodes with `.chain-edge` connectors; branches as a small dashed list | Content |
| `ports` *(new)* | `{ inputs: string[]; core: string; outputs: string[] }` | three columns: `ul.port-ins`, `.port-core`, `ul.port-outs`, with `.port-wire` hairlines | Content |
| `matrix` *(new)* | `{ cols: { label: string; items: string[] }[] }` | 3 columns, each `h3` + `ul` | Content |
| `stack` *(new)* | `{ layers: string[]; boundary: string }` | `ol.stack-layers` inside 4 boundary edge spans and a boundary label chip | aria-hidden echo + provenance |
| `gallery` *(new)* | `{ screens: Screen[] }` (2–3) | Fanned `ScreenFrame`s, each with its own provenance | Each image keeps its alt text |
| `qa` (next scene) | from `story.faq` | `dl.viz-qa` with `.qa-card > dt.qa-q + dd.qa-a` | Content |

`ScreenFrame` gains:
- `fit` (adds `.is-fit` and a `.screen-box` wrapper);
- `callouts` (renders `screen.labels` as `ol.callouts[aria-hidden]`, since the alt text and copy carry the meaning);
- `restRy`.

---

## 10. Content

### 10.1 Data model (`content/storyboards.ts`)

```ts
export type SceneKind = "cover" | "problem" | "people" | "intro" | "interface" | "walkthrough"
  | "features" | "usecases" | "trust" | "connect" | "output" | "value" | "next";
export type SceneLayout = "split" | "split-rev" | "wide";

export type Viz = /* existing members */
  | { kind: "chain"; nodes: string[]; branches?: string[] }
  | { kind: "ports"; inputs: string[]; core: string; outputs: string[] }
  | { kind: "matrix"; cols: { label: string; items: string[] }[] }
  | { kind: "stack"; layers: string[]; boundary: string }
  | { kind: "gallery"; screens: Screen[] };

export type Scene = {
  kind: Exclude<SceneKind, "cover" | "next">;
  id: string;                         // URL fragment, unique per page
  eyebrow: string; heading: string; body: string; evidence: string;
  steps?: { label: string; copy: string }[];
  features?: string[];
  items?: { label: string; note?: string }[];
  links?: { label: string; href: string }[];
  provenance?: Provenance;            // required for pictorial viz only
  viz: Viz;
  layout?: SceneLayout;               // default DEFAULT_LAYOUT[kind]
  callouts?: boolean;                 // draw the screen's own labels
  provisional?: true;                 // PROVISIONAL – owner approval required
};
export type Faq = { q: string; a: string; evidence: string; provisional?: true };

export type ProductStory = {
  /* existing: slug, name, descriptor, hero, heroSub, nameMoment, cta, interest,
     external, surface, heroScreen, closingLine */
  scenes: Scene[];                    // was `beats`; numbering ("02") is computed from position
  faq: Faq[];                         // 0–4, rendered in the generated `next` scene
};
// Scene 0 (cover) and scene N−1 (next) are generated by ProductStage from story fields.

export const DEFAULT_LAYOUT: Record<Scene["kind"], SceneLayout> = {
  problem: "split", people: "split-rev", intro: "split", interface: "split",
  walkthrough: "wide", features: "split-rev", usecases: "split", trust: "split-rev",
  connect: "wide", output: "split", value: "split-rev",
};
```

**`content/media.ts`:**

```ts
/** A callout anchored on the image (x, y are 0–1 of the image box). `text` must be visible
 *  verbatim in the image; `note` is a description taken from the register and needs `ev`. */
export type MediaLabel = { at: [number, number]; side?: "left" | "right"; text?: string; note?: string; ev?: string };
export type Screen = { /* existing */ labels?: MediaLabel[] };
```

### 10.2 Scene lists

`=` means unchanged existing beat. `Δ` means changed. **NEW** means new content.

| # | Mandoobee (13) | Tasree3 (13) | Nazo (13) | Yisbir (13) | Wasel (12) | AI in a Box (10) |
|---|---|---|---|---|---|---|
| 0 | cover | cover | cover | cover | cover | cover |
| 1 | problem = | problem = | problem = | problem = | problem = | problem = |
| 2 | people = | people = | people = | people = | people = | people = |
| 3 | intro = | intro = | intro Δ chain | intro = | intro = | intro = |
| 4 | interface Δ media | interface = | interface Δ callouts | interface = | interface = | interface Δ callouts |
| 5 | walkthrough = | walkthrough = | walkthrough = | walkthrough = | walkthrough = | walkthrough = |
| 6 | features = | features = | features = | features = | features = | features = |
| 7 | **modules** | **sectors** | **ai-actions** | **use-cases** | **sites** | output Δ media |
| 8 | **deployment** | **data** | **seal** | **deployment** | **connectivity** | value = |
| 9 | **get-the-app** | **governance** | **templates** | **search** | output = | next (FAQ) |
| 10 | output = | output Δ | output = | output = | value = | |
| 11 | value = | value = | value = | value = | next (FAQ) | |
| 12 | next (FAQ) | next (FAQ) | next (FAQ) | next (FAQ) | | |

AI in a Box gets **no new content scenes**. Its copy rests on EV-520, which is only a proposed register row ("internal until DV-01"; it is not in `plan/03-evidence-register.csv`). DL-P13 blocks any deployment claim, and EV-573 (governance) is publishable only "once confirmed implemented". `content-check` must list EV-520 as an owner-pending exception, not a pass.

### 10.3 New and changed scene copy

All headings for new scenes are composed, so they carry `provisional: true`.

**Tasree3**

| id (kind, layout) | Eyebrow / heading / body | List / visual | EV |
|---|---|---|---|
| `sectors` (usecases, split-rev) | Where it's used / **Where process work is the work.** / Built for process teams in manufacturing, banking and finance, healthcare, government and the wider enterprise. | tiles: Manufacturing · Banking and finance · Healthcare · Government · Enterprise; "Illustrative diagram" | EV-124 |
| `data` (connect, wide) | Data in / **Start from the event data you already have.** / Upload CSV, JSON, PDF or Word files, or connect an HRMS. Three fields are required: case ID, activity and timestamp. | ports in: CSV, JSON, PDF, DOCX, Connected HRMS · core: Ingestion wizard · out: Mined as-is process, BPMN 2.0 XML, PDF · GIF · HTML. Features: Automatic header mapping; Events extracted from PDF and Word by AI; Validation with explanatory messages. | EV-552 EV-554 |
| `governance` (trust, split-rev) | Governance and security / **Every change approved. Every version kept.** / Submit, review, approve, publish — with a version captured on every approval, full history and one-click rollback. | chain: Submit → In review → Approved → Published; branches: Request changes, Return to author, Reject. Features: Encryption at rest; Role-based access control; SIEM-compatible logging; Separate as-is and to-be staging; Six roles, viewer to admin; No self-registration. | EV-405 EV-408 EV-551 |
| `output` Δ | (copy unchanged) | Adds features: Conformance Center global audit; Conformance report in PDF or Excel; RACI matrix and process manuals; Gap and process analysis. `callouts: true` on `tasree3Conformance`. | + EV-557 |

**Yisbir**

| id | Eyebrow / heading / body | List / visual | EV |
|---|---|---|---|
| `use-cases` (usecases, split) | Use cases / **From archives to live sites.** / The same platform searches recorded video and watches live cameras — and turns what it sees into insight. | items (2×2): Construction sites — Missing helmets and vests, restricted-zone entry, falls. · Site security — After-hours intrusion, perimeter breaches, equipment theft. · Operations — Fire and smoke, attendance, uniform and PPE compliance. · Archives — Search hours of footage by phrase, on-screen text or object. Visual: gallery [`yisbirAlerts`, `yisbirPpeWall`]. | EV-134 EV-533 EV-534 EV-537 EV-442 |
| `deployment` (trust, split-rev) | Deployment and privacy / **Your cameras, your network, your servers.** / Cloud, on-premise or hybrid — it can run fully on-premises, on your existing infrastructure, with no hardware changes. | stack: Your existing cameras / Your network / Yisbir, on your servers / Your teams; boundary "Your infrastructure". Features: Face recognition switched per deployment; Role-based access; Secure downloads; Access-controlled sharing. | EV-444 EV-443 EV-535 EV-442 |
| `search` (connect, wide) | Search and integration / **Ask for a moment the way you would describe it.** / Phrase, metadata, similarity, fuzzy and synonym, and vector search — over transcripts in 50+ languages. | ports in: Uploaded video, Connected cameras, Scanned documents · core: AI index · out: Search, Clips, API. Features: Transcription in 50+ languages; Speaker diarization; Text read from frames and documents; API integration. | EV-442 EV-440 EV-136 |

Face search and person clips are excluded everywhere (DL-P07). "Suspicious behaviour" from EV-537 is not used.

**Mandoobee**

| id | Eyebrow / heading / body | List / visual | EV |
|---|---|---|---|
| `interface` Δ | (copy unchanged) | Media changes from `mandoobeePhones` (already the hero) to a new `mandoobeeApp` (wall-08). Callouts: text "Swipe here to clock in" at [0.38, 0.36]; text "Clocked In from Remote" at [0.52, 0.81]. | EV-421 |
| `modules` (usecases, split) | Modules / **Beyond attendance: the rest of the working day.** / Payroll, projects, internal chat, minutes of meeting, shared folders, asset management and AI document tools — in the same app. | tiles (9): Payroll management · Project management · Internal chat · Minutes of meeting · Shared folders · Asset management · OCR and scan · AI note assistant · AI document engine | EV-421 |
| `deployment` (trust, split-rev) | Deployment and language / **Your servers or the cloud. Arabic or English.** / On-premise, cloud or hybrid — white-labelled, customised and connected to third-party systems. | stack: Web and mobile apps / Mandoobee / On-premise, cloud or hybrid; boundary "Your choice of deployment". Features: On-premise, cloud or hybrid; Arabic and English; White-labelling; Customisation; Third-party integrations. | EV-116 |
| `get-the-app` (connect, split) | Get the app / **On the phone your team already carries.** / On Google Play and the App Store, published by Meerana Information Technology — and on the web. | links: Google Play ↗ `https://play.google.com/store/apps/details?id=ae.meerana.mandoobee`; App Store ↗ `https://apps.apple.com/app/id6473241950`. Check both resolve before release; use text links, not badge artwork. Visual: tiles Web app · Android · Google Play · iOS · App Store. | EV-420 EV-113 |

**Nazo**

| id | Eyebrow / heading / body | List / visual | EV |
|---|---|---|---|
| `platform` (intro) Δ | (copy unchanged) | Visual changes from flow to chain: Draft → Registered → In review → In approval → Signed → Sealed → Verified · archived; branches: Reject, Revise, Redirect, Skip | + EV-543 |
| `interface` Δ | (copy unchanged) | Callout: `{ at: [0.515, 0.335], text: "Holiday Date", note: "Typed template field", ev: "EV-545" }` | + EV-545 |
| `ai-actions` (usecases, wide) | AI, by role / **Fourteen AI actions, each scoped to a role.** / Requesters, approvers and admins each see only the actions their role needs. | matrix: **Requester**: Auto-fill, Check errors, Draft content, Generate reference, Translate · **Approver**: Draft comment, Missing-information check, Summarise, What changed · **Admin**: Generate template, Translate template, Build workflow, Validate workflow, Suggest variables | EV-542 |
| `seal` (trust, split-rev) | Seal and verify / **Sealed when signed. Verifiable by QR.** / The signed PDF is hashed with SHA-256 and sealed in the vault; its QR code re-hashes the archived file and compares. | chain: Signed PDF → SHA-256 hash → Sealed in vault → QR code → Re-hash and compare. Features: Tamper-evident seal; Verifiable by QR; AI on the same servers; AI suggestions checked first; People approve. Never "immutable" or "legally binding". | EV-544 EV-541 EV-546 |
| `templates` (connect, split) | Templates and workflows / **Bilingual templates. Versioned workflows.** / Templates with English and Arabic twins and typed fields; workflows with ordered reviewing, approving and signing steps. | ports in: English template, Arabic twin, Typed fields · core: Versioned workflow · out: Reviewing, Approving, Signing. Features: Text, date and signature fields; Signature placement on attachments; Versioned workflow definitions. | EV-545 |

**Wasel**

| id | Eyebrow / heading / body | List / visual | EV |
|---|---|---|---|
| `sites` (usecases, split-rev) | Where it's used / **From villas to multi-gate sites.** / Designed for residential communities, villas, apartments, commercial facilities and multi-gate environments. | tiles: Residential communities · Villas and apartments · Commercial facilities · Multi-gate environments · Industries and warehouses · Construction sites. No parking or toll billing claim. | EV-101 EV-104 |
| `connectivity` (trust, wide) | Connectivity and resilience / **Four ways to connect, including offline.** / Cellular, local Wi-Fi, Bluetooth and local offline modes, on Meerana's own industrial-grade, plug-and-play controller. | ports in: Cellular, Local Wi-Fi, Bluetooth, Local offline · core: Meerana controller · out: Gates, Barriers, Doors. Features: Gate position sensors; Temperature and humidity; Encrypted keys and roles; Over-the-air provisioning; Multi-gate management. | EV-103 EV-530 EV-101 |

**AI in a Box**

| id | Change | EV |
|---|---|---|
| `interface` Δ | Callouts on `aiboxContractReview`: `{at:[0.055,0.468], note:"Clause flag", ev:"EV-520"}`, `{at:[0.055,0.548], note:"Suggested fix", ev:"EV-520"}`, `{at:[0.04,0.79], text:"saved to the contract file"}` | EV-520 (owner-pending) |
| `output` Δ | Visual changes from records to a new `aiboxGovernance` screen (wall-12, already published in the hero room as "Product screen · demo data"). Callout `{at:[0.57,0.50], text:"All reviewed by a person"}`. The old record rows become `features`: What was read; What was drafted; What was approved; By whom. Body copy unchanged. | EV-520 |

**FAQ** (`story.faq`, rendered in the `next` scene)

| Product | q → a | EV |
|---|---|---|
| Tasree3 | Where does it run? → It can run in your own cloud or data centre, in the region you choose. · What data does it need? → Event data with a case ID, an activity and a timestamp — from files or a connected HRMS. · Does it work in Arabic? → Yes. Arabic and right-to-left layouts are supported, with an English/Arabic switch. · Which notations does it use? → BPMN 2.0, EPC and value chains, with APQC L1–L4 benchmarking. | EV-407 EV-552 EV-123 EV-551 EV-403 |
| Yisbir | Do we need new cameras? → No. It works with your existing cameras and infrastructure — no hardware changes required. · Can it stay on our premises? → Yes. It can run fully on-premises; cloud and hybrid deployments are also available. · Is face recognition always on? → No. It is a switchable feature, set per deployment. · Which languages can it transcribe? → More than 50, with speaker diarization. | EV-444 EV-443 EV-535 EV-440 EV-442 |
| Mandoobee | Where does it run? → On-premise, in the cloud or hybrid. · Which languages? → Arabic and English. · Is there a mobile app? → Yes — on Google Play and the App Store, alongside the web app. · Can it carry our brand? → Yes. White-labelling and customisation are supported, with third-party integrations. | EV-116 EV-420 EV-113 |
| Nazo | Where does it run? → On-premises or in the cloud. Its AI model runs on the same servers as the application. · Can a sealed letter be checked later? → Yes. Its QR code opens a page that re-hashes the archived file and compares it with the seal. · Who has the final say? → People. AI suggestions are checked against the form before they touch the record, and people approve. · Does it handle Arabic? → Yes. Templates have English and Arabic twins, and the interface supports right-to-left. | EV-142 EV-541 EV-544 EV-546 EV-545 |
| Wasel | What if the internet is down? → Bluetooth and local offline modes keep the gate working. · Whose hardware is the controller? → Meerana's own industrial-grade controller, with plug-and-play connections. · Can we see who came through? → Yes. Every open and every grant is recorded in the audit trail. · Which sites is it for? → Residential communities, villas, apartments, commercial facilities and multi-gate environments. | EV-103 EV-530 EV-102 EV-101 |
| AI in a Box | Who makes the decision? → A person reviews and decides. The agent never signs. · Which agents are included? → Legal, Finance, HR, Research and IT Security agents, working in one matrix. · Which languages does voice support? → English and Arabic. (Already-published copy only. No deployment question: DL-P13.) | EV-520 (pending) |

### 10.4 Media additions (`content/media.ts`)

All four images were checked: 1200×750, and no faces or plates.

```ts
mandoobeeApp:   { src: "/media/v3/wall-08-mandoobee-app.webp", width: 1200, height: 750,
                  alt: "Mandoobee clock-in screen with working hours and the team attendance status",
                  provenance: "App mock-up",
                  labels: [{ at: [0.38, 0.36], text: "Swipe here to clock in" },
                           { at: [0.52, 0.81], text: "Clocked In from Remote" }] },
aiboxGovernance:{ src: "/media/v3/wall-12-aibox-governance.webp", width: 1200, height: 750,
                  alt: "AI in a Box daily summary: actions taken and approvals completed",
                  provenance: "Product screen · demo data",
                  labels: [{ at: [0.57, 0.50], text: "All reviewed by a person" }] },
// labels added to existing entries:
tasree3Conformance.labels = [{ at: [0.05, 0.23], text: "Global fitness" }, { at: [0.55, 0.74], text: "Deviations" }];
yisbirAlerts.labels       = [{ at: [0.61, 0.33], text: "PPE flags" }, { at: [0.61, 0.46], text: "Restricted zone" }, { at: [0.61, 0.86], text: "Smoke & fire" }];
yisbirPpeWall.labels      = [{ at: [0.45, 0.30], text: "Helmet" }, { at: [0.53, 0.78], text: "Zone D" }];
nazoDraft.labels          = [{ at: [0.515, 0.335], text: "Holiday Date", note: "Typed template field", ev: "EV-545" }];
aiboxContractReview.labels= [{ at: [0.055, 0.468], note: "Clause flag", ev: "EV-520" },
                             { at: [0.055, 0.548], note: "Suggested fix", ev: "EV-520" },
                             { at: [0.04, 0.79], text: "saved to the contract file" }];
```

Positions are estimated from the files. Check them at 1:1 and adjust by ±2%.

### 10.5 `scripts/content-check.mjs` (runs in CI and `prebuild`)

1. Every EV id in `scenes`, `faq` and `labels[].ev` exists, with `public_status` of `ok-to-use` or `use-with-edit`. EV-520 is reported as `OWNER-PENDING`.
2. The budgets in §4.4 hold.
3. Banned strings are absent: "to be confirmed", "immutable", "legally binding", "100% Secure", "10x", and "Face" in any Yisbir search list.
4. Every `labels[].note` has an `ev`.
5. `provenance` is present on every pictorial visual.
6. Scene ids are unique per page and match `/^[a-z][a-z-]*$/`.
7. No `Screen` appears twice on one page (except the `heroScreen` reused as an interface fallback, which is listed as allowed).

---

## 11. Rail mode (touch, narrow, short, reduced motion)

```css
.ps[data-mode="rail"] .ps-track,
.ps[data-mode="pending"] .ps-track {
  display: flex; overflow-x: auto; overflow-y: hidden;
  scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
  scrollbar-width: none;
}
.ps[data-mode="rail"] .scene, .ps[data-mode="pending"] .scene {
  flex: 0 0 100cqw; width: 100cqw;
  min-height: calc(100svh - var(--header-h) - var(--stage-bottom));
  scroll-snap-align: start; scroll-snap-stop: always;     /* one swipe = one scene */
}
.ps[data-mode="rail"] .ps-hud { position: sticky; bottom: 0; }
```

- **≥1024 wide (tablet landscape, or a short or reduced-motion desktop):** the same scene layouts as stage, at rest. CSS gives `.module-inner` its rest angle, `transform: perspective(1600px) rotateY(-3deg)`, only `:not([data-mode="stage"])`.
- **<1024:** one column. Media first, at `max-height: 32svh`, then copy. Heading `clamp(1.375rem, 5.6vw, 1.75rem)`, lists in one column. Walkthrough stations become a vertical list *inside* the scene. FAQ cards stack inside the scene. A scene may grow taller than the viewport (the page scrolls; the HUD stays visible at the bottom). There is never a nested vertical scroller.
- **Index:** `IntersectionObserver` with `root: track` and `threshold: 0.6` sets the current scene. Buttons call `track.scrollTo({ left: scene.offsetLeft, behavior: reduced ? "auto" : "smooth" })`. Chapter links stay native fragments; fragment navigation scrolls the horizontal scroller.
- **Optional enhancement (motion allowed, touch only, no GSAP):**

  ```css
  @supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {
    .ps[data-mode="rail"] .scene { view-timeline: --scene inline; }
    .ps[data-mode="rail"] .scene-bg { animation: ps-rail-bg linear both; animation-timeline: --scene; }
    .ps[data-mode="rail"] .module   { animation: ps-rail-mid linear both; animation-timeline: --scene; }
  }}
  @keyframes ps-rail-bg  { from { transform: translateX(-30%); } to { transform: translateX(30%); } }
  @keyframes ps-rail-mid { from { transform: perspective(1400px) translateX(-8%) rotateY(-10deg); }
                           to   { transform: perspective(1400px) translateX(8%)  rotateY(8deg); } }
  ```

  GSAP never runs in rail mode, so CSS scroll timelines and GSAP never write the same element.
- **No JavaScript:** the rail scrolls natively and chapter links work. `.ps:not([data-hydrated]) .ps-buttons { display: none; }`.

---

## 12. Reduced motion and list view

**Why reduced motion gets the static horizontal rail (DD-NEW-3):**
1. The horizontal sequence is the content's structure (ordered chapters), not decoration.
2. The rail moves only when the visitor moves it: native scrolling, and instant programmatic jumps (`behavior: "auto"`). The page starts no motion, which satisfies WCAG 2.3.3 and the project rule ("reduced motion must render everything static and complete").
3. Every scene is complete in the DOM. Find-in-page, screen readers and native anchors all work in a native scroller.
4. Many enterprise and government Windows machines report reduced motion because "Animation effects" is off. With a stacked list, those visitors (possibly the client) would get a different, vertical page, which is the exact complaint.
5. Anyone who prefers a document (screen-magnifier users, printing) has **List view** one click away.

Under reduced motion:
- no pin, parallax, scrub, choreography or smooth scrolling;
- 3D rest angles become 0;
- the floor is static;
- `lattice-assemble` is off (existing).

**List view** (`data-mode="list"`, opt-in and saved):
- scenes stacked;
- `padding-block: clamp(48px, 8vh, 96px)`;
- the same layouts at rest;
- `content-visibility: auto; contain-intrinsic-size: auto 100svh` on scenes after the second;
- HUD reduced to the chapter links plus a "Horizontal view" button.

Print: `@media print` forces list layout with no transforms.

---

## 13. Accessibility contract (WCAG 2.2 AA)

### 13.1 Structure

- One `h1` (cover); one `h2` per scene, in DOM order.
- Each scene is a `section[aria-labelledby]`.
- Pictorial diagrams are `aria-hidden` and keep a visible provenance label. Content visuals (stations, chain, ports, matrix, FAQ) are real lists.

### 13.2 Keyboard and focus

- Arrow keys, PageUp/PageDown and Space move one scene (§7.5). At either end they hand control back to native scrolling. Home and End stay native.
- Tab order is DOM order. A `focusin` in any scene glides to that scene; the browser cannot move it because the pin uses `overflow: clip`.
- **No `inert` on product scenes.** At rest the neighbouring scenes are entirely off-screen, not dimmed peeks. So nothing visible fails contrast, and inert would wrongly remove 12 scenes from the accessibility tree. The homepage gallery keeps `inert` on its dimmed neighbours (§15).
- Focus ring: `outline: 2px solid var(--focus-ring); outline-offset: 3px`. Every focus target sits inside `--stage-top … 100svh − --stage-bottom`, so the header never covers a ring.
- Skip link "Skip to {name} questions and contact" points to `#next`.

### 13.3 HUD (`StageHud.tsx`)

```html
<div class="ps-hud" role="group" aria-label="Tasree3 scenes">
  <p class="ps-count annot" aria-hidden="true"><span class="tnum">05 / 13</span> · Interface</p>
  <p class="sr-only" aria-live="polite" aria-atomic="true">Scene 5 of 13: Interface</p>  <!-- updated on settle only -->
  <nav class="ps-chapters" aria-label="Tasree3 chapters">
    <ol>
      <li><a class="ps-seg" href="#problem" aria-current="location">
            <span class="ps-seg-label">Problem</span></a></li> …
    </ol>
    <div class="ps-progress" aria-hidden="true"><div class="ps-progress-fill"></div></div>
  </nav>
  <div class="ps-buttons">
    <button class="ps-btn" data-dir="prev" aria-label="Previous scene">←</button>
    <button class="ps-btn" data-dir="next" aria-label="Next scene">→</button>
    <button class="ps-view" aria-pressed="false">List view</button>
  </div>
</div>
```

- Segments are 44 px tall, with a width of the bar width ÷ N (about 40–70 px). Labels are visually hidden but read by screen readers, and they appear as a chip above the segment on `:hover` or `:focus-visible`.
- On the cover, the count reads "Scroll or press → · 13 scenes".
- Width budget at 1024: count 180 + segments 13 × 40 + buttons 3 × 44 + gaps = **≈ 900 ≤ 960 ✓**.

### 13.4 Other requirements

- Contrast: copy always sits on the solid scene field. Numerals, floor and plinths are decorative and hidden.
- Under `forced-colors: active`, hide `.ps-far` and `.scene-bg`.
- Zoom: 1366 px at 150% = 910 CSS px, which switches to rail mode with no overflow.
- **Known limitation:** find-in-page in stage mode cannot bring an off-screen scene into view (the track is moved by transforms). Document it; list view and rail mode support find.

---

## 14. Performance contract

1. **Transform and opacity only.** The engine writes only `transform` (`x`, `y`, `z`, `rotateX`, `rotateY`, `scale`, `scaleX`, `scaleY`) and `opacity`. No filters, clip-path, box-shadow, `stroke-dashoffset`, width, height or background-position animation. The "line draws" are `scaleX`/`scaleY` on hairline elements.
2. **`will-change` discipline:**

   ```css
   .ps.is-live .ps-track, .ps.is-live .ps-floor-grid { will-change: transform; }
   .ps.is-live .scene.is-near :is(.scene-bg, .scene-mid, .module, .module-inner, .scene-fg) { will-change: transform, opacity; }
   ```

   At most about 3 × 5 + 2 = **17 layers** at once.
3. **Triggers:** one pinned ScrollTrigger plus ≤4 `containerAnimation` children per scene (bg, mid, entry, exit), so ≤50 for 13 scenes. No other scroll listeners except settle (passive, reads `scrollY` only). No layout reads during scroll; `travel` is measured in `onRefreshInit`.
4. **Header:** `html.has-pin .site-header.is-condensed { backdrop-filter: none; background: var(--surface-page); }`. Applies to both the product pin and the gallery pin.
5. **Media:** eager for scene ≤ current + 2; `fetchpriority="high"` only on the cover screen; `decoding="async"`; width and height reserved; `sizes="(min-width:1024px) 58vw, 92vw"`.
6. **Bundle:** the engine plus moves plus settle is ≤7 KB gzip. GSAP (core + ScrollTrigger + ScrollToPlugin, about 45 KB gzip) is fetched only in stage mode. The product route's initial JS grows by ≤8 KB gzip.
7. **Floor:** one composited layer of about 160vw × 70vh, rasterised once. The modulo-112 wrap means it never repaints.
8. `.scene { contain: layout paint style }`. No `content-visibility` in stage mode (it would make scenes appear late during fast travel); list mode only.
9. Do not use `normalizeScroll`, Lenis or `scroll-behavior: smooth` (they fight ScrollTrigger; finding #1 in the 2026-10-11 report).

---

## 15. Homepage gallery

### 15.1 Behaviour

- **Mode:** `MQ.stage` (≥1024×560, fine pointer, motion allowed, list view not chosen) gives `is-pinned`; anything else gives `is-rail` (unchanged).
- Pin length stays `2.5 × innerHeight` for 5 steps (homepage total ≤300vh).
- The settle module is shared, with `{ duration: 0.38, nudge: s => s * 0.12 }`, so the behaviour is identical to today.
- Inert neighbours at opacity 0.35, the focus sync, previous/next buttons, the live counter and the skip link all stay as they are.
- The heading stays **outside** the pin. Add the hint "Scroll to browse the six products" to the left of the controls row in pinned mode.

### 15.2 Fit (replaces the `is-pinned` rules in `showcase.css`)

```css
.showcase.is-pinned {
  --controls-h: 60px;
  --pin-pad: clamp(10px, 2.2vh, 28px);
  --card-h: min(700px, calc(100svh - var(--header-h) - var(--controls-h) - 2 * var(--pin-pad)));
  --cw: min(1120px, 80cqw, calc(var(--card-h) * 2.3));       /* resolves against .sc-pin */
  --card-pad: clamp(18px, calc(var(--card-h) * 0.05), 48px);
  --copy-fr: 5; --media-fr: 7;
}
@media (max-width: 1279px) { .showcase.is-pinned { --copy-fr: 6; --media-fr: 6; } }

.showcase.is-pinned .sc-pin {
  container-type: inline-size; height: 100svh;
  display: grid; grid-template-rows: var(--header-h) minmax(0, 1fr) var(--controls-h);
}
.showcase.is-pinned .sc-track { grid-row: 2; align-self: center;
  padding-inline: calc((100cqw - var(--cw)) / 2); }          /* fixes the 100vw scrollbar offset */
.showcase.is-pinned .sc-controls { grid-row: 3; position: static; }
.showcase.is-pinned .sc-card {
  height: var(--card-h); padding: var(--card-pad); overflow: clip;
  grid-template-columns: minmax(0, calc(var(--copy-fr) * 1fr)) minmax(0, calc(var(--media-fr) * 1fr));
  gap: clamp(20px, 2.6vw, 48px);
}
```

`calc(5 * 1fr)` is not valid CSS. Implement the two column ratios as two modifier classes (`.is-57`, `.is-66`) or two `grid-template-columns` declarations; the variables above only show the intent.

```css
.showcase.is-pinned .sc-copy      { gap: clamp(6px, calc(var(--card-h) * 0.022), 16px); }
.showcase.is-pinned .sc-name      { font-size: clamp(1.5rem, calc(var(--card-h) * 0.07), 3rem); }
.showcase.is-pinned .sc-descriptor{ font-size: clamp(0.9375rem, calc(var(--card-h) * 0.036), 1.3125rem); }
.showcase.is-pinned .sc-line      { font-size: clamp(0.875rem, calc(var(--card-h) * 0.033), 1.0625rem); }
.showcase.is-pinned .sc-caps li   { font-size: clamp(0.8125rem, calc(var(--card-h) * 0.03), 0.9375rem); }
.showcase.is-pinned .sc-media .screen img {
  width: auto; max-width: 100%;
  max-height: calc(var(--card-h) - 2 * var(--card-pad) - 28px - 64px);  /* provenance + Deploys row */
}
```

**Markup change:** move `<SpecList Deploys>` from `.sc-copy` into a new `.sc-media` column, under the `ScreenFrame`. Copy column: annotation, name, descriptor, line, capabilities, actions. Media column: module, provenance, Deploys.

| Viewport | card-h | cw | Copy-column budget | Fits |
|---|---|---|---|---|
| 1024×560 | 403 | 819 (6/6) | 340 / 363 | ✓ |
| 1280×601 | 443 | 1,012 | 351 / 399 | ✓ |
| 1366×657 | 496 | 1,093 | 351 / 452 | ✓ |
| 1536×730 | 569 | 1,120 | ✓ | ✓ |
| 1920×937 | 700 | 1,120 | ✓ | ✓ |

### 15.3 Layered depth inside each card

Each card's DOM becomes:
- `.sc-card` (`overflow: clip`) containing:
  - `.sc-bg[aria-hidden]` = `.sc-field` (radial `--p-accent` 10%) + `.sc-numeral` (index "01", outline, `font-size: calc(var(--card-h) * 0.7)`, on the media side);
  - `.sc-copy`;
  - `.sc-media` > `.sc-module` (plinth + `ScreenFrame` fit) + `SpecList`.

Add this inside `setup()` after `tween` is created. Each element gets one tween, with half-passes on the edge cards as in §5.1.

```ts
panels.forEach((panel, i) => {
  const last = panels.length - 1;
  const range = i === 0 ? ["center center", "right left"] : i === last ? ["left right", "center center"] : ["left right", "right left"];
  const st = { trigger: panel, containerAnimation: tween, start: range[0], end: range[1], scrub: true };
  const bg = panel.querySelector(".sc-bg"), mod = panel.querySelector(".sc-module");
  const [bgFrom, bgTo] = i === 0 ? [0, 10] : i === last ? [-10, 0] : [-10, 10];
  const [ryFrom, ryTo] = i === 0 ? [-2, 8] : i === last ? [-12, -2] : [-12, 8];
  gsap.fromTo(bg,  { xPercent: bgFrom }, { xPercent: bgTo, ease: "none", scrollTrigger: st });
  gsap.fromTo(mod, { rotateY: ryFrom, xPercent: bgFrom * 0.4, transformPerspective: 1400 },
                   { rotateY: ryTo,   xPercent: bgTo * 0.4,   ease: "none", scrollTrigger: st });
});
```

The copy rides the track (rate 1.0). The dimmed neighbours show their layers mid-pass, which is itself the depth cue in the peek.

---

## 16. CSS reference (`app/stage.css`, core rules)

```css
.ps { --p-line: var(--p-accent-2, var(--p-accent)); position: relative; }
.ps-pin { position: relative; container-type: inline-size; overflow: clip; }
.ps[data-mode="stage"] .ps-pin { height: 100svh; }
.ps-track { position: relative; z-index: 1; display: flex; }
.scene { position: relative; flex: 0 0 100cqw; width: 100cqw; height: 100svh;
         overflow: clip; contain: layout paint style; background: transparent; }

.ps-far { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.ps-floor { position: absolute; left: -30%; right: -30%; bottom: -8%; height: 62%;
            transform: perspective(900px) rotateX(64deg); transform-origin: 50% 100%;
            -webkit-mask-image: linear-gradient(to top, #000 0 38%, transparent 92%);
                    mask-image: linear-gradient(to top, #000 0 38%, transparent 92%); }
.ps-floor-grid { position: absolute; inset: 0 -112px; background-image:
    repeating-linear-gradient(30deg,  var(--lattice-line) 0 1px, transparent 1px 56px),
    repeating-linear-gradient(-30deg, var(--lattice-line) 0 1px, transparent 1px 56px),
    repeating-linear-gradient(30deg,  color-mix(in srgb, var(--p-line) 18%, transparent) 0 1px, transparent 1px 224px); }
@media (prefers-reduced-motion: no-preference) {
  .ps-floor { animation: lattice-assemble var(--dur-signature) var(--ease-enter) both; }
}
.ps-horizon { position: absolute; inset: 0; background:
    radial-gradient(70% 45% at 50% 38%, color-mix(in srgb, var(--p-bg) 40%, transparent), transparent 70%); }

.scene-bg { position: absolute; inset: 0; z-index: 0; }
.scene-field { position: absolute; inset: 0 -32%; background:
    radial-gradient(42% 50% at var(--field-x, 68%) 46%, color-mix(in srgb, var(--p-line) 10%, transparent), transparent 70%); }
.scene[data-layout="split-rev"] { --field-x: 32%; }
.scene-numeral { position: absolute; inset-inline-end: 4%; bottom: calc(var(--stage-bottom) + 2vh);
    font: 600 clamp(9rem, 38vh, 26rem)/0.8 var(--font-poppins), system-ui, sans-serif;
    letter-spacing: -0.06em; color: transparent;
    -webkit-text-stroke: 1px color-mix(in srgb, var(--p-line) 26%, transparent); }
.scene[data-layout="split-rev"] .scene-numeral { inset-inline: 4% auto; }

.scene-grid { position: absolute; z-index: 1; inset: var(--stage-top) var(--scene-pad-x) var(--stage-bottom);
    max-width: 1440px; max-height: var(--scene-max); margin: auto;
    display: grid; column-gap: var(--col-gap); align-items: center;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
.scene[data-kind="cover"] .scene-grid { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); }
.scene[data-layout="split-rev"] .scene-grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
.scene[data-layout="split-rev"] .scene-mid { grid-column: 1; grid-row: 1; }
.scene[data-layout="split-rev"] .scene-fg  { grid-column: 2; grid-row: 1; }
.scene[data-layout="wide"] .scene-grid { grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr); row-gap: var(--gap-y); align-content: center; }
.scene[data-layout="wide"] .scene-fg { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    column-gap: var(--col-gap); align-items: end; }
.scene[data-layout="wide"] .scene-body { grid-column: 2; grid-row: 1 / span 2; }
.scene[data-layout="wide"] { --media-max-h: calc(min(var(--scene-h), var(--scene-max)) - 160px); }

.scene-fg { display: flex; flex-direction: column; gap: var(--gap-y); min-width: 0; }
.scene-fg > * { margin: 0; }
.scene-h { font-size: var(--h-scene); line-height: 1.1; letter-spacing: -0.02em; font-weight: 600; text-wrap: balance; }
.scene-h--cover { font-size: var(--h-cover); line-height: 1.05; letter-spacing: -0.03em; }
.scene-body { font-size: var(--t-body); line-height: 1.55; color: var(--text-secondary); max-width: 52ch; }
.scene-list { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-y) var(--sp-5); font-size: var(--t-item); color: var(--text-secondary); }
.scene-items { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap-y) var(--sp-5); }

.scene-mid { min-width: 0; display: grid; place-items: center; }
.module { position: relative; display: grid; place-items: center; width: 100%; }
.module-plinth { position: absolute; inset: auto 6% -18px 6%; height: 36px; pointer-events: none; }
.ps:not([data-mode="stage"]) .module-inner[data-rest-ry] { transform: perspective(1600px) rotateY(calc(var(--rest-ry) * 1deg)); }
@media (prefers-reduced-motion: reduce) { .module-inner[data-rest-ry] { transform: none !important; } }

.screen.is-fit { justify-items: center; }
.screen.is-fit .screen-box { position: relative; width: fit-content; max-width: 100%; }
.screen.is-fit img { width: auto; max-width: 100%; height: auto; max-height: var(--media-max-h); }

.callouts { position: absolute; inset: 0; list-style: none; margin: 0; padding: 0; pointer-events: none; }
.callout { position: absolute; left: calc(var(--cx) * 100%); top: calc(var(--cy) * 100%); display: flex; align-items: center; }
.callout-dot { width: 6px; height: 6px; border: 1px solid var(--p-line); border-radius: 50%; background: var(--ink-950); }
.callout-line { width: clamp(24px, 4vw, 64px); height: 1px; background: var(--p-line); }
.callout-label { font: 11px/1.3 var(--font-mono); letter-spacing: .06em; text-transform: uppercase;
    padding: 3px 6px; background: var(--ink-950); border: 1px solid var(--line-strong); border-radius: 3px; color: var(--text-primary); white-space: nowrap; }
.callout[data-side="left"] { flex-direction: row-reverse; transform: translateX(-100%); }

.ps-hud { position: absolute; inset: auto 0 0 0; z-index: 3; height: var(--stage-bottom);
    display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: var(--sp-5);
    padding-inline: var(--gutter); background: color-mix(in srgb, var(--surface-deep) 94%, transparent);
    border-top: 1px solid var(--line); }          /* solid: no backdrop-filter over moving content */
.ps-progress { position: relative; height: 2px; background: var(--line-strong); }
.ps-progress-fill { position: absolute; inset: 0; background: var(--p-line); transform-origin: 0 50%; transform: scaleX(0); }
.ps-seg { display: grid; place-items: center; min-height: 44px; }
```

---

## 17. Acceptance checks

Script: `scripts/verify-stage.mjs` (Playwright 1.64, launched with `--use-angle=swiftshader --enable-unsafe-swiftshader`, against :4173). Navigation uses the chapter links; there are no test hooks in production.

Desktop matrix: 1024×560, 1024×768, 1280×601, 1280×720, 1366×657, 1440×900, 1536×730, 1536×864, 1920×937, 2560×1271 (fine pointer). Touch: 390×844, 768×1024, 1180×820. Reduced motion: 1366×657 and 390×844.

| ID | Check | Pass |
|---|---|---|
| AC-01 | Mode | `.ps[data-mode]` is `stage` at every desktop size ≥1024×560; `rail` at 1024×559, on touch emulation and under reduced motion; `list` after the toggle (and it persists across a reload) |
| AC-02 | **Fit**, every product × scene × desktop size, after settling | `.scene-grid` `scrollHeight ≤ clientHeight + 1`. Every descendant's box is inside x ∈ [0, innerWidth] and y ∈ [stageTop, innerHeight − stageBottom]. The copy column and the visual do not overlap. Scene headings ≤3 lines; cover H1 ≤4 lines. |
| AC-03 | Pin length | `st.end − st.start = (N−1) × clamp(480, 0.7·innerHeight, 720) ± 2px` |
| AC-04 | One gesture, one scene | From scene k, one `wheel` (deltaY 100) settles on k+1 within 1.2 s with track `x = −(k+1) × sceneWidth ± 1px`. Two notches 300 ms apart reach k+2. deltaY 30 settles back on k. |
| AC-05 | Keyboard | →, ↓, PageDown and Space each move +1; ←, ↑ and PageUp each move −1. ↓ on the last scene scrolls past `st.end` into the footer. Arrow keys inside the open header menu do not move scenes. |
| AC-06 | Focus | Tab through every focusable element on the page: within 900 ms each focused element is fully inside the viewport and outside the header and HUD bands, with a visible outline (computed `outline-style` is not `none`) |
| AC-07 | Chapter navigation and hash | Clicking `.ps-seg[href="#x"]` settles on scene x, focuses `#x-h` and updates `location.hash`. Loading `/products/tasree3/#governance` opens settled on that scene with no glide. |
| AC-08 | Parallax rates | Mid-transition, the measured on-screen displacement ratio is bg/track 0.70 ± 0.05 and mid/track 0.88 ± 0.04. Floor `x` stays in (−112, 0] and changes monotonically between wraps. |
| AC-09 | Rest state | When settled, every `[data-e]` in the current scene has opacity 1 and an identity transform (±0.5 px, ±0.5°), except `.module-inner[data-rest-ry]` at its rest angle. |
| AC-10 | No neighbour leak | When settled, `elementsFromPoint` at x = 2 and x = innerWidth − 2, at five heights, returns only current-scene, `.ps-far` or HUD elements |
| AC-11 | Properties written | A MutationObserver on `style` attributes inside `.ps` during a full traverse sees only `transform`, `translate`, `rotate`, `scale`, `opacity` and `will-change` |
| AC-12 | Dwell rule | The development build throws if any `at + dur > 0.86` (entry), `x-at < 0.10` (exit), or an element carries both `data-e` and `data-x` |
| AC-13 | Performance | Chrome trace at 1366×657, 4× CPU throttle, while traversing 3 scenes: no long task over 50 ms; ≥55 fps without throttling; ≤17 composited layers when settled (CDP LayerTree) |
| AC-14 | Lazy media | At load, only scenes 0–2 have requested images; after settling on scene k, every image in scenes ≤ k+2 has `complete === true` |
| AC-15 | GSAP gating | No `gsap` chunk is requested in rail mode, list mode or under reduced motion |
| AC-16 | axe | 0 serious or critical issues in stage (each scene settled), rail and list modes, on all 6 products |
| AC-17 | Reduced motion | No element in `.ps` has a non-`none` transform; the track scrolls horizontally with snap; all scenes are present; no animation runs (`document.getAnimations().length === 0` after load) |
| AC-18 | Rail | A touch swipe moves exactly one scene (`scroll-snap-stop`); buttons are ≥44 px; the counter updates; no scene has an inner vertical scroller; `documentElement.scrollWidth === clientWidth` |
| AC-19 | Content | `npm run content:check` passes; EV-520 is reported as `OWNER-PENDING`; no screen repeats on a page (§10.5) |
| AC-20 | Gallery | `is-pinned` at 1024×560, 1280×601, 1366×657, 1536×730 and 1920×937. `.sc-card` height = `--card-h` and fits within innerHeight − 72 − 60. `scrollHeight ≤ clientHeight` for all 6 cards. Pin = 2.5 × innerHeight. One notch moves one card. Neighbours are `inert` at opacity 0.35. Card 0 is centred within ±1 px with classic scrollbars. |
| AC-21 | Pin budget | `verify-launch.mjs`: homepage total pin ≤300vh; product pages are checked against AC-03 (DD-NEW-1) instead of the ≤300vh rule |
| AC-22 | Manual | On a real 1366×768 Windows laptop with a mouse wheel and a Precision touchpad, in Edge and Chrome, at 100% and 125% scaling: one notch moves one scene; trackpad flicks settle; no visible tearing on the floor. Repeat with Windows "Animation effects" off: rail mode, horizontal. NVDA + Chrome reads all scenes in order. |

---

## 18. Build order, files and risks

### 18.1 Order

Each step ships verifiably on its own.

1. Content model, new scenes, FAQ, media labels and `content-check` (§10). The UI keeps rendering through a temporary `beats = scenes` adapter.
2. `Scene`, `SceneVisual` (redraws and new kinds), `ScreenFrame` fit and callouts, and `stage.css` in **rail and list** modes. Verify AC-02 in rail mode at the desktop sizes first: it works without JavaScript.
3. `lib/settle.ts` extraction, with `Showcase.tsx` switched over and AC-20's one-notch check run unchanged.
4. `engine.ts`: pin, track, floor, progress, settle, keys, focus and hash (AC-03 to AC-07).
5. Parallax and choreography: `moves.ts`, the timing attributes in the components, the development asserts (AC-08 to AC-12).
6. HUD, live region and list-view toggle (§13).
7. Gallery: MQ change, fit, `.sc-media` column, card layers (§15).
8. `verify-stage.mjs`, axe, traces, screenshots at the 10 desktop sizes into `docs/review/<date>/`.
9. Docs: decision-log entries DD-NEW-1 to 4; a pointer in plan/08 to this spec (motion ids `M-stage-01` engine, `M-<slug>-S00…S12` scenes, `M-home-gallery` revised); implementation report.

### 18.2 Files touched

**New:**
- `components/stage/ProductStage.tsx`, `Scene.tsx`, `SceneVisual.tsx`, `StageHud.tsx`, `engine.ts`, `moves.ts`, `useStageMode.ts`, `useRail.ts`
- `lib/settle.ts`
- `app/stage.css`
- `scripts/verify-stage.mjs`, `scripts/content-check.mjs`

**Changed:**
- `content/storyboards.ts`, `content/media.ts`
- `components/ui/ScreenFrame.tsx`
- `components/sections/Showcase.tsx`, `app/showcase.css`
- `lib/breakpoints.ts`
- `app/products/[slug]/page.tsx`
- `app/layout.tsx` (inline view-preference script)
- `app/header.css` (`html.has-pin` solid header)
- `scripts/verify-launch.mjs`

**Deleted:** `components/story/Story.tsx`, `components/story/BeatVisual.tsx` (moved), `app/story.css`.

### 18.3 Risks and hand-offs

- **Pin length (8–9 viewports).** Visitors can feel stuck. Mitigations: one notch per scene, a visible "05 / 13" with a progress bar, chapter links, the skip link to `#next`, list view, and native exit at both ends. This needs owner sign-off (DD-NEW-1).
- **Edge-trigger maths.** Half-pass ranges on the first and last items avoid relying on ScrollTrigger extrapolating before or after the container animation. Do not "simplify" them back to a full pass.
- **Safari and Firefox.** `animation-timeline` is missing in Firefox, so the rail parallax is simply off there. Check `100svh` plus pinning in desktop Safari (AC-22 extension).
- **Find-in-page in stage mode** (§13.4) is accepted and documented.
- **Homepage hero (outside this spec, but the client named it).** At 1280×601 the hero is 675 px and the CTA is clipped at the fold. At 1366×657 the right half rendered empty in our headless run (verify the room or its fallback poster on a real laptop). It needs the same treatment: type sized by `min(vw, vh)`, a `max-height: 700px` branch below the current 800 px one, and a check that hero height ≤ innerHeight with the CTA bottom ≤ innerHeight − 16 at 1280×601, 1366×657 and 1536×730. Run it as a separate workstream with its own checks.