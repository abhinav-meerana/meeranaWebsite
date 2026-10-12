# Film Strip: horizontal, layered product stories and a gallery that fits the viewport

Design spec, 2026-10-11. Project root: `C:\Users\abhin\Desktop\meerana`.

**Scope**
1. Every `/products/<slug>/` page becomes one horizontal strip of full-viewport scenes. Each scene has separate depth layers and its own choreography.
2. The homepage gallery (`#products`) pins horizontally at every desktop or laptop size of at least 1024×560, and each card fits the viewport.

The hero, scenario, world and contact sections are out of scope. One measured hero defect is listed in §17.

**What the client's ask changes**
- The pin budgets no longer apply to product pages. That means plan/08 (at most 150vh per pin and 300vh per page) and the hard-pin limits in the `meerana-scroll-choreography` skill.
- DD-23's gallery gate of at least 1280×760 becomes at least 1024×560. The gallery's 250vh pin length stays.

**What does not change:** mandated copy, the evidence rules, no AI imagery, GSAP + CSS only, complete reduced-motion rendering, visible focus, WCAG 2.2 AA.

**Files read for this spec:**
- `components/story/Story.tsx`, `components/story/BeatVisual.tsx`, `app/story.css`
- `components/sections/Showcase.tsx`, `app/showcase.css`
- `content/storyboards.ts`, `content/media.ts`, `content/showcase.ts`
- `lib/breakpoints.ts`, `app/tokens.css`
- `docs/MOTION-RESEARCH-2026-10-10.md`, `plan/08-scroll-animation-spec.md`
- `docs/AUDIT-IMPLEMENTATION-PROMPT-2026-10-11.md`, `docs/IMPLEMENTATION-REPORT-2026-10-11.md`, `docs/STORY-PAGES-2026-10-11.md`, `docs/DEPTH-DIRECTION-2026-10-10.md`, `docs/YISBIR-USE-CASES.md`
- `plan/03-evidence-register.csv`, `docs/evidence-addendum-2026-10-10.csv`
- `.claude/skills/meerana-scroll-choreography/SKILL.md`

---

## 0. Decisions at a glance

| # | Decision | Value |
|---|---|---|
| D1 | Product page structure | One horizontal strip of 10–14 full-viewport scenes in three acts. The hero is scene 01 and the closing CTA is the last scene. No vertical beats. |
| D2 | Desktop/laptop engine | CSS `position: sticky` film plus **one** root ScrollTrigger (no `pin`) scrubbing the track's `x`. Every scene timeline is a `containerAnimation` child. |
| D3 | Film gate | `(min-width:1024px) and (min-height:560px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)` |
| D4 | Scroll per scene | `S = clamp(560px, 50vw, 840px)`, so 683 px at 1366 wide. Settle: one gesture moves one scene, with a 40 px threshold. |
| D5 | Touch, mobile, tablet | Native horizontal `scroll-snap` rail with a dock (previous/next, counter, progress). CSS scroll-driven parallax where supported. |
| D6 | Reduced motion | **Static horizontal rail**: no parallax, no choreography, instant jumps. Justified in §3.3. |
| D7 | List view | Stacked "contact sheet". Automatic below 560 px viewport height (zoom, landscape phones); available to anyone through a "List view" button. |
| D8 | Depth | Global far layer (lattice + product field, about 2% of track speed). Per scene: background (r 0.70), midground (r 0.90, with 3D rotateY/translateZ), foreground copy (r 1.00, at rest when the scene settles) and a near annotation (r 1.15). |
| D9 | Choreography | 14 scene kinds, each with its own entrance/exit. Five transitions: pan, dolly, wipe, type, and cut (cut is used only for programmatic jumps of more than 2 scenes). |
| D10 | Content | Five new scene kinds (`usecases`, `integrations`, `deploy`, `faq`, `next`) plus a title scene, all fed **only** by ok-to-use / use-with-edit register items. AI in a Box gets **no** new claims. |
| D11 | Fit | Every scene fits the content box at ≥1024×560 with no internal scrolling. clamp() type uses `min(vw, vh)`. Compact rules at heights of 760 px and below, tight rules at 640 px and below. |
| D12 | Gallery | Pins at ≥1024×560. Card height = viewport minus header and controls, capped at 720. Card width ≤ 1.95 × card height. Layered depth inside each card. The existing settle and the inert neighbours stay. |

---

## 1. What is wrong today (measured)

Measured on 2026-10-11 against the :4173 build in headless Chromium (swiftshader), using Playwright.

| Viewport | Gallery mode | Card height vs viewport | Product walkthrough copy (top → bottom) | Stage visual height | Product page height |
|---|---|---|---|---|---|
| 1024×640 | still `pending` after 0.9 s | 691 vs 640 | 814 px tall, −43 → 770 | 265 px | 7,225 |
| 1280×601 | rail | **664 vs 601** | **705 px, −8 → 697** | 265 px | 6,801 |
| 1366×657 | rail | **665 vs 657** | **705 px, 19 → 724** | 265 px | 7,201 |
| 1536×730 | rail | 665 vs 730 | 705 px, 56 → 761 | 265 px | 7,712 |
| 1440×900 | pinned | 666 | fits | 265 px | 8,905 |
| 1920×937 | pinned | 693 | fits | 265 px (28 % of height) | 9,201 |

What these numbers mean:
- **Laptop heights (601–730) never get the pinned gallery** (the gate needs a height of 760). The rail card is taller than the viewport, so no product card is ever seen whole. This is very likely the client's "in my resolution it's bad."
- **Product pages scroll vertically.** Copy scrolls past a sticky visual.
  - The walkthrough copy is taller than the viewport at every laptop height.
  - The visual is a fixed ~265 px box at any screen size.
  - The product hero is 793–814 px tall, taller than every laptop viewport.
- **Every visual is rendered twice:** once on the stage and once as a hidden inline copy (`Story.tsx`).
- **The gallery adds `100vw` padding** (`showcase.css`). On Windows, `100vw` includes the 17 px scrollbar, so cards sit about 8 px off centre.

---

## 2. The film grammar

| Film term | On the page | Implementation |
|---|---|---|
| Strip | The whole product story | `.fs` (sticky film) → `.fs-pin` → `.fs-track` |
| Shot (scene) | One full-viewport frame | `.fs-scene`: 100 % of the pin width × 100svh |
| Frame at rest | The settled position, with the scene exactly aligned | Scene-local progress **p = 0.5** |
| Pan | Horizontal travel; layers move at different rates | `containerAnimation` child timelines, linear |
| Dolly | Push in or pull out | `scale` + `z` (translateZ) on `.fs-stage3d` |
| Wipe | Act change | A solid `.fs-shutter` slides off the incoming scene (xPercent) |
| Cut | Chapter jump of more than 2 scenes | Track opacity dip of 120/200 ms plus an instant scroll |
| Title card / typographic moment | Giant outlined type | `.fs-bigtype` in the background layer; the `value` scene |
| Acts | I The problem · II The product · III The fit | `scene.act` |
| Splice | The seam between scenes | `.fs-splice`: a 1 px rule |
| End card | Closing line, CTAs, next product | `next` scene |

**Invariants.** The acceptance tests in §16 check each one.

- **I1 Rest is final.** For p ∈ [0.46, 0.54], every element of the scene is in its final state:
  - opacity 1;
  - identity transform on `.fs-fg` and on every text node;
  - the shutter is off-scene.
- **I2** Headings (`h1`, `h2`) never animate opacity. They only move.
- **I3** Only `transform` and `opacity` animate. No filter, clip-path, size, position, box-shadow or stroke-dashoffset animation.
- **I4** Text never sits on a picture.
  - Copy and media occupy separate grid columns.
  - Background type is a 1 px outline at ≤26 % accent alpha, or a fill at ≤6 %.
- **I5** Each film has one root ScrollTrigger (no pin; CSS sticky does the pinning). Scene timelines are `containerAnimation` children. The trigger element (`.fs-scene`, `.sc-panel`) is never itself animated.
- **I6** Layer-rate tweens are `ease: "none"`. Choreography tweens may ease.
- **I7** Each property has one owner:
  - the layer wrapper owns rate `x`;
  - inner elements own choreography;
  - in the gallery, CSS owns card opacity.
- **I8** Each scene fits the content box at ≥1024×560 with no internal scroll.
- **I9** A real product screen:
  - appears at most once per page;
  - is never shown above its intrinsic width;
  - always carries its own provenance label.
- **I10** Nothing exists only in animation. With JS off, or if GSAP fails to load, the rail shows every scene in its final state.

---

## 3. Modes and gating

### 3.1 Modes

| Mode | When | Layout | Motion |
|---|---|---|---|
| `film` | D3 media query matches **and** GSAP has finished setting up | Sticky pin; vertical scroll drives the horizontal track | Layers, choreography, settle, keyboard |
| `rail` | Anything else that is not `list`: touch, <1024 wide, coarse pointer, before hydration | Native `overflow-x:auto` + `scroll-snap-type:x mandatory`, each scene 100 % wide | CSS scroll-driven parallax when supported (§10) |
| `rail` static | `prefers-reduced-motion: reduce` | As rail | None. Jumps are instant (`behavior:"auto"`). |
| `list` | Viewport height < 560 (pure CSS), or the user picks "List view" | Scenes stacked vertically, each composed as a frame | None |

### 3.2 Resolution order and code (`lib/breakpoints.ts`)

```ts
export const FILM_MIN_W = 1024;
export const FILM_MIN_H = 560;
export const PIN_MIN_HEIGHT = 560; // was 760 (DD-23 amended 2026-10-11, client)

export const MQ = {
  // …existing md, lg, xl, reduced
  film: `(min-width: ${FILM_MIN_W}px) and (min-height: ${FILM_MIN_H}px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`,
  /** The gallery pins under the same gate as the film. */
  pinned: `(min-width: ${FILM_MIN_W}px) and (min-height: ${PIN_MIN_HEIGHT}px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`,
  listOnly: `(max-height: ${FILM_MIN_H - 1}px)`,
} as const;
```

```ts
// components/film/useFilmMode.ts
type Mode = "rail" | "film" | "list";
function resolve(userView: "film" | "list" | null): Mode {
  if (userView === "list") return "list";
  if (matchMedia(MQ.listOnly).matches) return "list";
  if (matchMedia(MQ.film).matches) return "film"; // promoted to data-mode="film" only after buildFilm() succeeds
  return "rail";                                   // the static variant is chosen in CSS and JS via MQ.reduced
}
```

- **Server and pre-hydration markup** is always `data-mode="rail"`.
  - `@media (max-height:559px)` restyles the rail as the list without JS.
  - Film mode turns on only once GSAP is loaded and built. If GSAP fails, the rail still works.
- **Switching to film keeps the reader's place.** Before switching, the current rail scene `round(scrollLeft / clientWidth)` is mapped to its film rest Y. The frame does not move because both modes use identical scene geometry.
- **Resizing across the gate tears film mode down.** The current index is mapped back to rail `scrollLeft`, and to the list's `scene.offsetTop` in list mode.
- **User choice** is stored in `localStorage["meerana:story-view"]`, with every read and write in try/catch. The page renders correctly without storage.

### 3.3 Why reduced motion gets a static horizontal rail, not a stacked list

1. **The client may be a reduced-motion user without knowing it.** Turning off Windows' "Animation effects" makes Chrome and Edge report `prefers-reduced-motion: reduce`. It is often off on managed or performance-tuned Windows machines. A stacked fallback would show such a viewer the vertical page they just rejected.
2. **A native snap rail has no scripted or scroll-linked animation.** Every movement is a direct scroll by the user:
   - no parallax;
   - no choreography;
   - no smooth programmatic scroll; the previous/next buttons jump instantly.
3. **The stacked list is still there:**
   - automatically below 560 px height, which covers browser zoom of 200 % or more on laptops (the WCAG 1.4.10 reflow path) and landscape phones;
   - on demand through "List view", for magnifier users and anyone who prefers it.
4. **Find-in-page works in the rail.** The browser scrolls the horizontal scroller to the match. In film mode it does not (§12, known limitation), and List view covers that case.

---

## 4. Geometry and fit

### 4.1 The frame

```css
.fs {
  --fs-step: clamp(560px, 50vw, 840px);           /* scroll distance per scene (D4) */
  --fs-head: var(--header-h);                      /* 72px */
  --fs-dock: 56px;
  --fs-pad-y: clamp(8px, 2.4vh, 32px);
  --fs-content-h: calc(100svh - var(--fs-head) - var(--fs-dock) - 2 * var(--fs-pad-y));
  position: relative;
}
@media (max-height: 760px) { .fs { --fs-dock: 52px; } }  /* compact */
@media (max-height: 640px) { .fs { --fs-dock: 48px; } }  /* tight (44px targets + 2px each side) */

.fs[data-mode="film"] { height: calc(100svh + (var(--fs-n) - 1) * var(--fs-step)); }
.fs-pin { position: relative; height: calc(100svh - var(--fs-head)); overflow: clip; }
.fs[data-mode="film"] .fs-pin { position: sticky; top: 0; height: 100svh; }
.fs-track { display: flex; height: 100%; }
.fs[data-mode="film"] .fs-track { will-change: transform; }
/* 100% of the pin, never 100vw: on Windows 100vw includes the scrollbar and every scene would be 17px too wide. */
.fs-scene { position: relative; flex: 0 0 100%; height: 100%; overflow: clip; isolation: isolate; }
.fs-frame {
  position: absolute; inset: var(--fs-head) 0 var(--fs-dock); z-index: 2;
  max-width: var(--content-max); margin-inline: auto;
  padding: var(--fs-pad-y) var(--gutter);
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2vw, 32px); align-items: center;
}
.fs-scene[data-layout="split"]   .fs-fg  { grid-column: 1 / 6; }  .fs-scene[data-layout="split"]   .fs-mid { grid-column: 7 / -1; }
.fs-scene[data-layout="reverse"] .fs-mid { grid-column: 1 / 7; grid-row: 1; } .fs-scene[data-layout="reverse"] .fs-fg { grid-column: 8 / -1; grid-row: 1; }
.fs-scene[data-layout="wide"]    .fs-fg  { grid-column: 1 / -1; }
.fs-scene[data-layout="center"]  .fs-fg  { grid-column: 2 / 12; }
.fs-scene[data-kind="title"]     .fs-fg  { grid-column: 1 / 7; }  /* the H1 gets six columns */
@media (max-height: 640px) {          /* tight: a wider copy column means fewer heading lines */
  .fs-scene[data-layout="split"] .fs-fg { grid-column: 1 / 7; }
  .fs-scene[data-layout="split"] .fs-mid { grid-column: 7 / -1; }
}
```

`.fs-pin` is `overflow: clip`, never `hidden`. A `hidden` box is programmatically scrollable, so focusing an off-screen link would make the browser scroll it sideways and desync the track.

### 4.2 Scroll length

| Viewport | S | Tasree3 (14 scenes) | 13-scene products | AI in a Box (10) | Horizontal px per vertical px |
|---|---|---|---|---|---|
| 1024×640 | 560 | 7,280 | 6,720 | 5,040 | 1.83 |
| 1280×601 | 640 | 8,320 | 7,680 | 5,760 | 2.00 |
| 1366×657 | 683 | 8,879 | 8,196 | 6,147 | 2.00 |
| 1536×730 | 768 | 9,984 | 9,216 | 6,912 | 2.00 |
| 1920×937 | 840 | 10,920 | 10,080 | 7,560 | 2.29 |

Film scroll is (N − 1) × S. This is in line with today's 6,801–9,201 px pages. The settle makes it one wheel notch per scene, so 13 notches cover all of Tasree3.

### 4.3 Type scale (computed at five viewports)

| Role | Declaration | 1024×640 | 1280×601 | 1366×657 | 1536×730 | 1920×937 |
|---|---|---|---|---|---|---|
| Title H1 (static, never animated) | `clamp(2.25rem, min(5.2vw, 8.2vh), 4.75rem)`, line-height 1.05 | 52.5 | 49.3 | 53.9 | 59.9 | 76 |
| Scene H2 | `clamp(1.5rem, min(3.1vw, 5.4vh), 2.75rem)`, line-height 1.12 | 31.7 | 32.5 | 35.5 | 39.4 | 44 |
| Statement H2 (`value`, `next`) | `clamp(2rem, min(4.4vw, 7.4vh), 4rem)` | 45 | 44.5 | 48.6 | 54 | 64 |
| Body | `clamp(0.9375rem, calc(0.55rem + 1.1vh), 1.0625rem)`, line-height 1.55 | 15.8 | 15.4 | 16.0 | 16.8 | 17 |
| Lists, facts, FAQ answers | `clamp(0.8125rem, calc(0.5rem + 0.95vh), 0.9375rem)` | 14.1 | 13.7 | 14.2 | 14.9 | 15 |
| Annotation (eyebrow, provenance, counter) | 12px mono (fixed; the floor) | 12 | 12 | 12 | 12 | 12 |
| Background big type | `clamp(10rem, 46vh, 32rem)`, line-height 0.8 | 294 | 276 | 302 | 336 | 431 |

### 4.4 Content box and media

| Viewport | Tier | Header | Dock | Pad | `--fs-content-h` | Mid column width (cols 7–12) |
|---|---|---|---|---|---|---|
| 1024×640 | tight | 72 | 48 | 15.4 | **489** | 452 |
| 1280×601 | tight | 72 | 48 | 14.4 | **452** | 579 |
| 1366×657 | compact | 72 | 52 | 15.8 | **501** | 621 |
| 1536×730 | compact | 72 | 52 | 17.5 | **571** | 627 (content max 1280) |
| 1536×864 | normal | 72 | 56 | 20.7 | 695 | 627 |
| 1920×937 | normal | 72 | 56 | 22.5 | 764 | 627 |

```css
.fs-mid { min-width: 0; max-height: var(--fs-content-h); display: grid; align-items: center; }
.fs-mid .screen img { max-height: calc(var(--fs-content-h) - 32px); width: auto; max-width: 100%; } /* 32 = provenance row */
.fs-mid .viz { max-height: var(--fs-content-h); padding: clamp(14px, 2.6vh, 32px); }
```

`ScreenFrame`'s `maxWidth: intrinsic width` stays, so a screen is never shown above its intrinsic size. A 1920×1200 screen at 1280×601 renders at 579×362.

### 4.5 Compact and tight rules

These rules reflow content. They never use `display:none`.

| Rule | Compact (≤760) | Tight (≤640) |
|---|---|---|
| Copy column (split) | cols 1–5 | cols 1–6 |
| Feature, case and fact lists | 1 column | 2 columns (`grid-template-columns: repeat(2, minmax(0,1fr))`) |
| FAQ | 2×2 grid | 2×2 grid, answer line-height 1.45 |
| Walkthrough steps | In the mid column: label and copy side by side, `grid-template-columns: 2rem 7rem 1fr` | Same, row padding 6 px |
| List gaps | `--sp-3` | 6 px |
| Header | 72 px | 72 px (header height is global; changing it is out of scope) |

### 4.6 Content budget (enforced by `content:check`)

| Field | Limit |
|---|---|
| `heading` | ≤ 64 characters (≤ 3 lines at tight in the copy column) |
| `body` | ≤ 180 characters |
| `steps` | ≤ 5, each `copy` ≤ 90 characters (the longest today is 84) |
| `features` | ≤ 6 · `cases` ≤ 6 · `facts` ≤ 6 · `faq` ≤ 4 (answer ≤ 160 characters) · `records` ≤ 5 |

### 4.7 Fit proof at 1280×601 (content box 452 px)

| Scene | Copy column stack | Mid column stack | Fits |
|---|---|---|---|
| title | annotation 25 + H1 3 lines 155 + sub 2 lines 46 + name moment 34 + CTAs 68 + gaps 16 = **344** | screen 579×362 + label 24 = 386 | yes |
| walkthrough | eyebrow 25 + H2 2 lines 73 + body 2 lines 48 + gaps = **158** | 5 steps × 70 + padding 32 + label 24 = **406** | yes |
| deploy (6 facts) | 158 + facts in 2 columns, 3 rows × 56 = 168 + gap 24 = **350** | diagram ≤ 360 | yes |
| usecases (6) | 158 | 2×3 tiles × 79 + gaps 24 + padding 32 + label 24 = **317** | yes |
| faq (4, wide) | 158 + 2 rows × 105 = **368** | none | yes |

---

## 5. Depth: the layer stack

| Z | Layer | Class | Contents | Rate r (vs track) | Extra x relative to the scene, p∈[0,1] | Size | Promoted |
|---|---|---|---|---|---|---|---|
| 0 | Far (global) | `.fs-far` (in `.fs-pin`, behind the track) | `LatticeField` (the **only** lattice on the page, plan/09 §6) + a `--p-bg` radial field | ≈0.02 (pans −30 % of pin width across the whole film) | n/a | `inset: 0 -30% 0 0` | yes (film) |
| 1 | Background | `.fs-bg` | `.fs-field` (accent radial; centre alternates 72 %/28 % by scene parity) + `.fs-bigtype` | 0.70 | `(p−0.5)·2W·0.30` = ±0.30W | `inset: 0 -30%` (160 % wide) | near scenes only |
| 2 | Midground | `.fs-mid` → `.fs-stage3d` | The visual (screen or diagram) + `.fs-shadow` | 0.90 | ±0.10W | grid cell | near scenes only |
| 3 | Foreground | `.fs-fg` → `.fs-copy` | Eyebrow, H1/H2, body, lists, CTAs | 1.00 (no rate tween; choreography only) | 0 | grid cell | no |
| 4 | Near | `.fs-near` (aria-hidden) | Vertical mono label "TASREE3 · 04 / 14" in the right gutter | 1.15 | ∓0.15W | gutter strip | near scenes only |
| 5 | Shutter | `.fs-shutter` (act-start scenes only) | Solid `--p-bg` + act label | choreography | n/a | `inset: 0` | during the wipe only |
| – | Splice | `.fs-splice` | 1 px `--line-strong` seam at the scene's left edge (not on the first scene) | 1.00 | 0 | 1 px | no |

**3D rules**
- **Perspective goes on the element itself:** `gsap.set(".fs-stage3d", { transformPerspective: 1400 })`. A `perspective` on `.fs-scene` would be flattened by the intermediate `.fs-mid`, which has its own 2D transform and is not `preserve-3d`.
- **Lists whose items move in Z** (tiles, cases, the feature grid) put `perspective: 1200px` on their direct parent.
- **Never use `transform-style: preserve-3d` on anything that fades.** Opacity below 1 flattens it. Fade children, never a 3D container.
- **Static offsets inside visuals move to the CSS `translate` and `scale` properties.** Today the Yisbir "layers" stack uses inline `transform: translateY(i*16px) scale(…)`; it becomes `translate: 0 calc(var(--i) * 16px); scale: calc(1 - var(--i) * .03)`. GSAP can then own `transform`, and the two compose.
- **Shadow lag:** `.fs-shadow` is a radial-gradient ellipse (no filter) under the screen, with its own rate of 0.82. While the scene travels, the gap between screen and shadow changes. That is a real depth cue at zero cost.

**Big type**
- 1 px outline: `color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, var(--p-accent) 26%, transparent)`.
- Fallback without stroke support: fill at 6 %.
- Text per scene kind:
  - `title`: the Arabic name moment where the register supports one (Tasree3 تسريع, Yisbir يسبر), with `lang="ar" dir="rtl"`; otherwise the product name.
  - `value`: the product name.
  - every other scene: its number ("04").

---

## 6. Component structure

### 6.1 Files

| File | Status | Role |
|---|---|---|
| `components/film/Film.tsx` | new, client | Mode resolution, markup, dock, keyboard and focus wiring. Replaces `components/story/Story.tsx`. |
| `components/film/Scene.tsx` | new, memoised | One scene's layers. Re-renders only when its props change. |
| `components/film/SceneVisual.tsx` | from `BeatVisual.tsx` | Existing visual kinds plus `ribbon`, `cases`, `ingest`, `boundary`, `modes`, `columns`, `next`, `none` |
| `components/film/Dock.tsx` | new | Progress bar, chapter links, counter, previous/next, List view |
| `components/film/engine.ts` | new | `buildFilm()`: master tween, far layer, scene timelines, layer rates |
| `components/film/choreo.ts` | new | `CHOREO[kind]`, `ENTER[transition]`, helpers |
| `lib/settle.ts` | new, extracted from `Showcase.tsx` | `createSettle()`, shared by the film and the gallery |
| `app/film.css` | new | Replaces the stage rules in `app/story.css`. Visual styles move to `app/viz.css`. |
| `app/products/[slug]/page.tsx` | edit | `<Film key={story.slug} story={story} />`; imports `film.css` and `viz.css` |
| `content/storyboards.ts` | edit | `Scene` model, new scenes (§9) |
| `components/sections/Showcase.tsx`, `app/showcase.css` | edit | §14 |
| `scripts/verify-film.mjs` | new | §16 |

Every new class uses the `.fs-` prefix. That also resolves the audit's `.story` class collision between the homepage and product pages.

### 6.2 Markup

```tsx
<div className="fs" data-mode={mode} data-static={reduced || undefined} ref={root}
     style={{ "--fs-n": scenes.length, ...surfaceVars(story) } as React.CSSProperties}>
  <a className="fs-skip" href="#fs-end">Skip the {story.name} story</a>
  <div className="fs-pin" ref={pin}>
    <div className="fs-far" aria-hidden="true"><LatticeField className="fs-far-lattice" assemble /></div>
    <div className="fs-track" ref={track}
         {...(mode === "rail" ? { tabIndex: 0, role: "region", "aria-label": `${story.name} story` } : {})}>
      {scenes.map((s, i) => <Scene key={s.id} scene={s} index={i} total={scenes.length} story={story} eager={i < 2} />)}
    </div>
    <Dock scenes={scenes} index={index} onGo={go} view={view} onView={setView} mode={mode} />
  </div>
</div>
<span id="fs-end" tabIndex={-1} />
```

```tsx
// Scene.tsx (no aria-labelledby: 14 named regions would flood the landmark list; headings carry the structure)
<section className="fs-scene" id={s.id} data-kind={s.kind} data-layout={layout} data-enter={enter} data-act={s.act} data-i={index}>
  <div className="fs-bg" aria-hidden="true">
    <div className="fs-field" />
    <span className="fs-bigtype" lang={s.bigType?.lang} dir={s.bigType?.lang === "ar" ? "rtl" : undefined}>{bigText}</span>
  </div>
  {enter === "wipe" ? (
    <div className="fs-shutter" aria-hidden="true"><span className="fs-shutter-act">{ACT_LABEL[s.act]}</span></div>
  ) : null}
  <div className="fs-frame">
    <div className="fs-fg">
      <div className="fs-copy">
        <p className="annot fs-eyebrow"><span className="tnum">{s.n}</span> · {s.eyebrow}</p>
        {s.kind === "title"
          ? <h1 className="fs-h fs-h1">{s.heading}</h1>
          : <h2 className="fs-h" id={`${s.id}-h`} tabIndex={-1}>{s.heading}</h2>}
        {s.body ? <p className="fs-body">{s.body}</p> : null}
        <SceneLists scene={s} />  {/* steps (phones), cases (when viz is a screen), facts → SpecList, faq → <dl>, links, CTAs */}
      </div>
    </div>
    {s.viz.kind !== "none" ? (
      <div className="fs-mid">
        <span className="fs-shadow" aria-hidden="true" />
        <div className="fs-stage3d"><SceneVisual scene={s} eager={eager} /></div>
      </div>
    ) : null}
  </div>
  <div className="fs-near" aria-hidden="true">{story.name} · {s.n} / {pad(total)}</div>
  {index > 0 ? <span className="fs-splice" aria-hidden="true" /> : null}
</section>
```

```tsx
// Dock.tsx
<nav className="fs-dock" aria-label="Story scenes">
  <div className="fs-progress" aria-hidden="true"><span className="fs-progress-bar" /></div>
  <ol className="fs-chapters">
    {scenes.map((s, i) => (
      <li key={s.id} className={i > 0 && scenes[i - 1].act !== s.act ? "is-act-start" : undefined}>
        <a href={`#${s.id}`} aria-current={i === index ? "location" : undefined} onClick={(e) => onChapter(e, i)}>
          <span className="fs-tick" aria-hidden="true" />
          <span className="fs-chapter-label">{s.n} · {s.eyebrow}</span> {/* clipped; shown on :hover / :focus-visible */}
        </a>
      </li>
    ))}
  </ol>
  <p className="annot fs-counter" aria-live="polite">{/* updated on settle only */}
    <span className="tnum">{scenes[index].n} / {pad(scenes.length)}</span> · {scenes[index].eyebrow}
  </p>
  <div className="fs-buttons">
    <button type="button" className="sc-btn" aria-label="Previous scene" disabled={index === 0} onClick={() => onGo(index - 1)}>←</button>
    <button type="button" className="sc-btn" aria-label="Next scene" disabled={index === scenes.length - 1} onClick={() => onGo(index + 1)}>→</button>
  </div>
  <button type="button" className="btn-text fs-view" aria-pressed={view === "list"} onClick={toggleView}>List view</button>
</nav>
```

**Dock layout**
- At ≥1024: chapter ticks are 28 px each (24×44 hit area; 14 × 28 = 392 px), then the counter, the buttons and the toggle. That totals about 854 px.
- Below 768: counter, buttons and toggle, with the chapter list inside `<details><summary>All scenes</summary>…`.

### 6.3 CSS class reference

| Class | Purpose |
|---|---|
| `.fs`, `[data-mode]`, `[data-static]` | Film root and mode |
| `.fs-pin`, `.fs-track` | Sticky viewport and moving strip |
| `.fs-far`, `.fs-far-lattice` | Global far layer |
| `.fs-scene`, `[data-kind] [data-layout] [data-enter] [data-act]` | Scene |
| `.fs-bg`, `.fs-field`, `.fs-bigtype` | Background layer |
| `.fs-frame`, `.fs-fg`, `.fs-copy`, `.fs-eyebrow`, `.fs-h`, `.fs-h1`, `.fs-body` | Foreground |
| `.fs-mid`, `.fs-stage3d`, `.fs-shadow` | Midground |
| `.fs-near`, `.fs-splice`, `.fs-shutter`, `.fs-shutter-act` | Near layer, seam, wipe |
| `.fs-dock`, `.fs-progress(-bar)`, `.fs-chapters`, `.fs-tick`, `.fs-chapter-label`, `.fs-counter`, `.fs-buttons`, `.fs-view` | Dock |
| `.fs-qa`, `.fs-facts`, `.fs-cases`, `.fs-links` | List blocks |
| `.is-near` | Applied by JS to current±1 scenes; enables `will-change` |

---

## 7. Engine (GSAP sketches)

### 7.1 Loading

GSAP loads only in film mode. Phones, tablets, the rail, the list and reduced motion never download it.

```ts
const [{ default: gsap }, { ScrollTrigger }, { ScrollToPlugin }] = await Promise.all([
  import("gsap"), import("gsap/ScrollTrigger"), import("gsap/ScrollToPlugin"),
]);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
await document.fonts.ready;                    // line breaks settle before measuring
const film = buildFilm(gsap, ScrollTrigger, root.current!, hooks);
root.current!.dataset.mode = "film";           // the height and sticky layout switch on only now
ScrollTrigger.refresh();
syncFromScrollOrHash(film);                    // §7.8
```

### 7.2 Master tween, far layer, scene timelines, layer rates

```ts
// components/film/engine.ts
export const RATES = { bg: 0.70, mid: 0.90, near: 1.15, shadow: 0.82 } as const;
type Range = "full" | "first" | "last";

/** Scene-local progress p: 0 = left edge at the viewport's right, 0.5 = at rest, 1 = right edge at the left.
 *  The first and last scenes only have half a window, so their tweens are authored in p and mapped here. */
export const mapper = (r: Range) => (p: number) =>
  r === "first" ? (p < 0.5 ? null : (p - 0.5) * 2) : r === "last" ? (p > 0.5 ? null : p * 2) : p;

export function buildFilm(gsap: G, ScrollTrigger: ST, root: HTMLElement, hooks: Hooks) {
  const pin = root.querySelector<HTMLElement>(".fs-pin")!;
  const track = root.querySelector<HTMLElement>(".fs-track")!;
  const far = root.querySelector<HTMLElement>(".fs-far");
  const scenes = gsap.utils.toArray<HTMLElement>(".fs-scene", track);
  const N = scenes.length;
  const W = () => pin.clientWidth;          // excludes the scrollbar
  const H = () => pin.clientHeight;
  let master!: gsap.core.Tween;

  const ctx = gsap.context(() => {
    master = gsap.to(track, {
      x: () => -(track.scrollWidth - W()),
      ease: "none",
      scrollTrigger: {
        id: "film", trigger: root, start: "top top", end: "bottom bottom",
        scrub: 0.5, invalidateOnRefresh: true,
        onUpdate: (self) => hooks.onProgress(self.progress),
      },
    });

    if (far) gsap.to(far, {
      x: () => -0.3 * W(), ease: "none",
      scrollTrigger: { trigger: track, containerAnimation: master, start: "left left", end: "right right",
                       scrub: true, invalidateOnRefresh: true },
    });

    scenes.forEach((scene, i) => {
      const range: Range = i === 0 ? "first" : i === N - 1 ? "last" : "full";
      gsap.set(scene.querySelectorAll(".fs-stage3d"), { transformPerspective: 1400 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scene, containerAnimation: master, scrub: true, invalidateOnRefresh: true,
          start: range === "first" ? "left left" : "left right",
          end: range === "last" ? "left left" : "right left",
        },
      });
      const at = mapper(range);
      layerRates(tl, scene, W, range);                                     // spans the whole timeline: length 1
      CHOREO[scene.dataset.kind as SceneKind](tl, scene, at, { W, H });
      ENTER[scene.dataset.enter as Enter]?.(tl, scene, at, { W, H });
    });
  }, root);

  return { ctx, master, scenes, N, restY: (i: number) => {
    const st = master.scrollTrigger!; return st.start + (i / (N - 1)) * (st.end - st.start);
  } };
}

function layerRates(tl: gsap.core.Timeline, scene: HTMLElement, W: () => number, range: Range) {
  const [p0, p1] = range === "full" ? [0, 1] : range === "first" ? [0.5, 1] : [0, 0.5];
  const dx = (r: number, p: number) => (p - 0.5) * 2 * W() * (1 - r);
  ([["bg", RATES.bg], ["mid", RATES.mid], ["near", RATES.near], ["shadow", RATES.shadow]] as const).forEach(([k, r]) => {
    const el = scene.querySelector(`.fs-${k}`);
    if (el) tl.fromTo(el, { x: () => dx(r, p0) }, { x: () => dx(r, p1), ease: "none", duration: 1 }, 0);
  });
}
```

Notes:
- **Children use `scrub: true`.** They follow the container exactly; only the master smooths (0.5).
- **The first and last scenes use half-range triggers.** Don't rely on ScrollTrigger resolving a negative start position.
- **No choreography tween may extend a timeline beyond 1.** The layer-rate tweens fix the length at 1, and `cascade()` asserts this in development.

### 7.3 Index, progress, near scenes, lazy media

```ts
const setBar = gsap.quickSetter(root.querySelector(".fs-progress-bar"), "scaleX");
hooks.onProgress = (p) => {
  setBar(p);                                             // no React render per frame
  if (settle.moving) return;
  const i = Math.round(p * (N - 1));
  if (i !== index) setIndex(i);                          // React state: the dock only (scenes are memoised)
};
function setIndex(i: number) {
  index = i;
  scenes.forEach((s, k) => s.classList.toggle("is-near", Math.abs(k - i) <= 1));
  scenes.slice(Math.max(0, i - 1), i + 3).forEach((s) =>
    s.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = "eager")));
  dockSetIndex(i);
}
```

```css
.fs[data-mode="film"] .fs-scene.is-near :is(.fs-bg, .fs-mid, .fs-near, .fs-stage3d, .fs-shadow) { will-change: transform; }
```

### 7.4 Settle (shared `lib/settle.ts`, the Showcase algorithm kept)

```ts
export function createSettle(o: {
  gsap: G; st: () => ScrollTrigger | null; count: number;
  threshold: (step: number) => number; idleMs?: number; onIndex: (i: number) => void;
}) {
  let moving = false, settledAt = 0, timer = 0, held = false;
  const step = () => { const s = o.st()!; return (s.end - s.start) / (o.count - 1); };
  const restY = (i: number) => o.st()!.start + i * step();
  const toY = (y: number, i: number, duration: number) => {
    moving = true; o.onIndex(i);
    o.gsap.to(window, { scrollTo: { y, autoKill: true }, duration, ease: "power2.inOut", overwrite: true,
      onComplete: () => { moving = false; settledAt = y; }, onInterrupt: () => { moving = false; } });
  };
  const settle = () => {
    const s = o.st(); if (!s || moving || held) return;
    const y = window.scrollY; if (y < s.start - 2 || y > s.end + 2) return;
    const from = Math.round((settledAt - s.start) / step());
    let i = Math.round((y - s.start) / step());
    if (i === from && Math.abs(y - settledAt) > o.threshold(step())) i = from + Math.sign(y - settledAt);
    i = Math.max(0, Math.min(o.count - 1, i));
    if (Math.abs(restY(i) - y) < 2) { settledAt = restY(i); return; }
    toY(restY(i), i, 0.42);
  };
  const onScroll = () => { if (moving) return; clearTimeout(timer); timer = window.setTimeout(settle, o.idleMs ?? 140); };
  const down = () => (held = true), up = () => { held = false; onScroll(); }; // no settle while dragging the scrollbar
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("mousedown", down); addEventListener("mouseup", up);
  return { restY, toY, get moving() { return moving; }, markSettled: (y: number) => (settledAt = y),
           destroy() { clearTimeout(timer); removeEventListener("scroll", onScroll); removeEventListener("mousedown", down); removeEventListener("mouseup", up); } };
}
```

| Setting | Film | Gallery |
|---|---|---|
| threshold | `() => 40` (one wheel notch, 48–125 px, always advances) | `(s) => s * 0.12` (unchanged) |
| idleMs | 140 | 140 |

### 7.5 `go()`: pan or cut

```ts
function go(i: number) {
  i = Math.max(0, Math.min(N - 1, i)); const d = Math.abs(i - index); const y = film.restY(i);
  if (d <= 2) { settle.toY(y, i, 0.42 + 0.14 * Math.max(0, d - 1)); return; }      // pan
  gsap.timeline({ onComplete: () => settle.markSettled(y) })                        // cut
    .to(track, { opacity: 0, duration: 0.12, ease: "power1.in" })
    .add(() => { window.scrollTo(0, y); ScrollTrigger.update(); film.master.scrollTrigger?.getTween()?.progress(1); setIndex(i); })
    .to(track, { opacity: 1, duration: 0.2, ease: "power1.out" });
}
```

The track's opacity is used only by cuts, so it keeps a single owner. A cut also spares vestibular-sensitive users a 10-scene whoosh.

### 7.6 Keyboard (film mode)

```ts
const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, " ": 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 };
function onKey(e: KeyboardEvent) {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const t = e.target as HTMLElement;
  if (t.closest(".site-header, input, textarea, select, [contenteditable], dialog")) return; // the router panel uses arrows
  if (e.key === " " && t.closest("a, button, summary, [role=button]")) return;              // Space activates controls
  const st = film.master.scrollTrigger!; if (scrollY < st.start - 2 || scrollY > st.end + 2) return;
  let d = STEP[e.key]; if (!d) return; if (e.key === " " && e.shiftKey) d = -1;
  const next = index + d; if (next < 0 || next > N - 1) return;   // at either end, native scroll leaves the film
  e.preventDefault(); go(next);
}
```

Home and End stay native (page top and bottom). **Rail mode:** when focus is inside `.fs-track`, PageDown and PageUp move one scene with `scrollTo({ left, behavior })`. Arrow keys stay native, and mandatory snap turns them into one scene each.

### 7.7 Focus, chapter links, hash, history

- **focusin:** if focus lands inside `.fs-scene` with index ≠ current, call `requestAnimationFrame(() => go(i))`. No scene is ever dimmed at rest, so none is inert. Tab walks every scene's links in order and the film follows.
- **Chapter link (film):** `preventDefault()`, `go(i)`, `history.replaceState(null, "", "#" + id)`, then `heading.focus({ preventScroll: true })`. In the rail, the native anchor scrolls the scroller.
- **Load with a hash or on back/forward:**
  - after `refresh()`, find the scene whose id matches `location.hash`;
  - otherwise use `round((scrollY − start) / step)`;
  - instant `scrollTo` plus `getTween().progress(1)`, then `markSettled`.
- **Refresh:** `ScrollTrigger.addEventListener("refresh", () => { if (!settle.moving) window.scrollTo(0, film.restY(index)); })` keeps the same scene through a resize.

### 7.8 Teardown

On unmount, mode change or slug change (`key={story.slug}`):

```ts
settle.destroy(); removeEventListener("keydown", onKey); root.removeEventListener("focusin", onFocus);
gsap.killTweensOf(window); film.ctx.revert(); root.dataset.mode = nextMode; gsap.set(track, { clearProps: "opacity" });
```

---

## 8. Choreography

### 8.1 Windows and easing

All windows are in scene-local p.
- **Entrances:** inside [0.10, 0.46], ease `power2.out` or `power3.out`.
- **Rest band:** [0.46, 0.54]. Every tween is final (I1).
- **Exits:** inside [0.54, 0.92], ease `power2.in`, with `immediateRender: false` on every exit tween.
- **Layer rates:** `none`.

There is one easing family for the whole page: power1–power3, with no back, elastic or bounce. Every scene shares the same camera grammar, so the page reads as one system.

### 8.2 Helpers and the shared copy move

```ts
// components/film/choreo.ts
export function span(tl: TL, at: At, p0: number, p1: number, t: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars) {
  const a = at(p0), b = at(p1); if (a === null || b === null || (Array.isArray(t) && !t.length) || !t) return;
  tl.fromTo(t, from, { ...to, duration: b - a }, a);
}
export function cascade(tl: TL, at: At, items: HTMLElement[], p0: number, step: number, d: number, from: gsap.TweenVars, to: gsap.TweenVars) {
  items.forEach((el, k) => span(tl, at, p0 + k * step, p0 + k * step + d, el, from, to));
  if (process.env.NODE_ENV !== "production" && p0 < 0.5 && p0 + (items.length - 1) * step + d > 0.4601)
    throw new Error("choreo: an entrance ends inside the rest band");
}
const rest = (s: HTMLElement) => qa(s, ".fs-copy > :not(.fs-eyebrow):not(.fs-h)");

export function copyIn(tl: TL, s: HTMLElement, at: At, { W }: Ctx) {
  span(tl, at, 0.14, 0.38, q(s, ".fs-eyebrow"), { x: () => 0.04 * W() }, { x: 0, ease: "power2.out" });
  span(tl, at, 0.16, 0.44, q(s, ".fs-h"), { x: () => 0.07 * W() }, { x: 0, ease: "power3.out" });     // I2: transform only
  const r = rest(s); cascade(tl, at, r, 0.22, 0.06 / Math.max(1, r.length - 1), 0.18,
    { x: () => 0.03 * W(), opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out" });                 // last ends at 0.46
}
export function copyOut(tl: TL, s: HTMLElement, at: At, { W }: Ctx) {
  span(tl, at, 0.58, 0.82, q(s, ".fs-eyebrow"), { x: 0 }, { x: () => -0.04 * W(), ease: "power2.in", immediateRender: false });
  span(tl, at, 0.56, 0.86, q(s, ".fs-h"), { x: 0 }, { x: () => -0.05 * W(), ease: "power2.in", immediateRender: false });
  const r = rest(s); cascade(tl, at, r, 0.60, 0.04 / Math.max(1, r.length - 1), 0.20,
    { x: 0, opacity: 1 }, { x: () => -0.03 * W(), opacity: 0, ease: "power2.in", immediateRender: false });
}
export function midIn(tl: TL, s: HTMLElement, at: At, { W }: Ctx, f: Partial<{ x: number; z: number; ry: number; sc: number }> = {}) {
  span(tl, at, 0.12, 0.46, q(s, ".fs-stage3d"),
    { x: () => (f.x ?? 0.08) * W(), z: f.z ?? -180, rotationY: f.ry ?? -12, scale: f.sc ?? 0.94 },
    { x: 0, z: 0, rotationY: 0, scale: 1, ease: "power3.out" });
}
```

### 8.3 Per-kind choreography

"Copy" means `copyIn`/`copyOut` unless the row says otherwise. Windows are in p. "k" is the item index.

| Kind | Shot | Midground entrance | Foreground / background extras | Rest composition | Exit | Default entrance transition |
|---|---|---|---|---|---|---|
| `title` (first: exit only; at rest when the page loads) | Establishing shot, then dolly-out | Page load is time-based CSS, not scroll: annotation, sub-line, name moment and CTAs go opacity 0→1, y 8→0, 420 ms, 60 ms stagger, `animation-fill-mode: backwards` so GSAP owns them afterwards. **The H1 is never animated.** Far lattice `assemble` (720 ms, once): the page signature. | Ribbon words (where `viz` is a ribbon): word k gets extra x −0.04W·k across [0.5, 0.95], linear, giving typographic parallax | H1 left (cols 1–6), screen or ribbon right, Arabic or name big type behind | Stage scale 1→0.88, z 0→−240, rotationY 0→14 over [0.52, 0.92], power1.in. Copy exit. | n/a |
| `problem` | Fracture | `midIn` with ry −16, z −200. Calm items (`.viz-node:not(.is-warn)`, `.viz-cam`) cascade(0.18, 0.03, 0.14) y 10→0, opacity. **Warn items arrive last:** cascade(0.34, 0.02, 0.10) y 10→0, scale 0.96→1, opacity. | Copy | Split or wall, warn nodes in accent | Push-in: stage scale 1→1.07 [0.56, 0.90]; stage opacity 1→0 [0.66, 0.90] | pan |
| `people` (layout `reverse`) | Ensemble | Tiles and lane rows: cascade(0.14, 0.024, 0.20) from {z −260, opacity 0}. Lane path opacity [0.36, 0.46]. | Copy | Tiles flat | Disperse: tile k extra x −0.02W·(k+1), opacity→0, cascade(0.58, 0.016, 0.24) | dolly |
| `product` | Reveal | Big dolly-in: `midIn` with x 0.10, z −320, ry 20, sc 0.80. System: hub scale 0.5→1 [0.30, 0.44]; nodes from the hub centre (function x/y = hub − node), scale 0.6→1, cascade(0.28, 0.012, 0.12). Tiles: cascade(0.22, 0.02, 0.16) from z −200. Yisbir layers: frames fan from y 0 to their resting `translate` [0.24, 0.46]. | Copy | Diagram flat, full opacity | Rack focus: stage scale 1→0.94, rotationY 0→−12 [0.56, 0.90] | **wipe** (Act II) |
| `interface` | Screen reveal + shadow lag | `midIn` with x 0.10, z −220, ry −16. `.fs-shadow` opacity 0→0.6 [0.20, 0.40]. | Copy | Real screen flat (rotateY 0) with its provenance | Stage rotationY 0→14 [0.56, 0.90]; stage opacity 1→0 [0.80, 0.92] | pan |
| `walkthrough` | Sequence | Step k (`.viz-steps-list li`, which shows label + copy in film mode): from {x 0.10W, opacity 0} over [0.14+0.045k, 0.28+0.045k] (k=4 ends 0.46). Rule `.viz-step-rule` scaleX 0→1 (origin left) over [0.14+0.045k, 0.26+0.045k]. | Copy: heading and body only (steps live in the mid) | Five steps, one column | First in, first out: step k x→−0.06W, opacity→0 over [0.56+0.04k, 0.72+0.04k] | pan |
| `features` | Contact sheet | Grid item at diagonal d (row + col): from {z −160, y 12, opacity 0} over [0.18+0.04d, 0.32+0.04d] (d=3 ends 0.44) | Copy | Grid flat | Reverse diagonal: z→−120, opacity→0 over [0.58+0.04(3−d), 0.74+0.04(3−d)] | dolly |
| `output` | Print | Records: cascade(0.22, 0.04 (0.03 for 5 rows), 0.12) y 14→0, opacity. `.fs-scan` (1 px accent line): y 0 → list height [0.20, 0.46], opacity in [0.20, 0.24] and out [0.42, 0.46]. **Screen variant ("interface-reverse"):** `midIn` with x −0.06, ry +16. | Copy | Rows final, scan line gone | Rows x→−0.04W, opacity→0, cascade(0.58, 0.03, 0.18) | pan |
| `usecases` | Montage | Case tile k: even from {z −260}, odd from {z 80}, opacity 0, over [0.16+0.028k, 0.32+0.028k] (k=5 ends 0.46). Each tile also has its own linear rate r_k = 0.94 + 0.04k over [0, 1] (dx = 0 at rest), so tiles shear during the pan. Screen variant (Yisbir): `midIn`, with cases as a foreground list. | Copy | Tiles flat, 2×3 | Tiles keep shearing; opacity→0 over [0.70, 0.90] | **wipe** (Act III) |
| `integrations` | Flow-through | Sources: from x −0.06W (against the travel), opacity, cascade(0.16, 0.03, 0.14). Core scale 0.8→1 [0.28, 0.42]. Outputs: from the core position (function x = core − output), cascade(0.30, 0.02, 0.10). Connectors: opacity [0.26, 0.40]. | Copy (facts in the foreground) | Sources → core → outputs | Stage x→−0.04W, opacity→0 [0.60, 0.90] | pan |
| `deploy` | Boundary | Boundary: scale 0.92→1, opacity [0.14, 0.34]. Inside nodes drop: y −0.05H→0, cascade(0.24, 0.03, 0.14), power3.out. **Wasel modes:** hub scale 0.6→1 [0.24, 0.40]; modes radiate from the hub, cascade(0.26, 0.03, 0.12). | Facts: cascade(0.24, 0.02, 0.12), y 8→0, opacity | Boundary closed, facts in two columns at tight | Rack focus (as `product`) | pan |
| `value` (layout `center`) | Title card | Tile row (3): y 12→0, opacity, cascade(0.30, 0.04, 0.10) | **Type entrance:** big type (product name) scale 1.12→1 [0.10, 0.46] and overtakes at r 1.35 over [0, 0.5], then the background rate. Heading from x 0.10W. | Statement H2 centred, tiles under it | Heading x→−0.08W [0.56, 0.90]; tiles opacity→0 [0.62, 0.86] | type (wipe if it opens an act) |
| `faq` (layout `wide`, no mid) | Two-shot | none | Each `.fs-qa` (dt + dd): x 0.04W→0, opacity, over [0.18+0.04k, 0.32+0.04k] (k=3 ends 0.44). `dt` is not a heading, so opacity is allowed. | 2×2 Q&A | `.fs-qa` x→−0.03W, opacity→0, over [0.58+0.03k, 0.74+0.03k] | pan |
| `next` (last: entrance only) | End card | Next-product card: from {z −200, scale 0.9, rotationY −10} [0.14, 0.46] | Statement H2 = `closingLine`; CTAs y 8→0, opacity [0.30, 0.44] | Closing line + CTAs left, next product right | none. The film ends and the page scrolls vertically to the footer. | dolly |

### 8.4 Transitions (`ENTER`, incoming scene only, self-contained)

| Transition | What runs |
|---|---|
| `pan` | Nothing extra. Layer rates alone carry the transition. |
| `dolly` | Overrides `midIn` to sc 0.86, z −260. |
| `wipe` | `.fs-shutter` xPercent 0→101 over [0.04, 0.38], power2.inOut. The act label rides it (no scaleX, so no squashed text). The shutter is solid `--p-bg` with `--p-fg` text, so it passes contrast for every product surface. Applied **automatically to the first scene of each act** except the title. |
| `type` | Big type x from `dx(1.35, 0)` to 0 over [0, 0.5], plus scale 1.12→1. |
| `cut` | Programmatic only (§7.5). |

### 8.5 Example: `interface`

```ts
CHOREO.interface = (tl, s, at, c) => {
  copyIn(tl, s, at, c); copyOut(tl, s, at, c);
  midIn(tl, s, at, c, { x: 0.10, z: -220, ry: -16 });
  span(tl, at, 0.20, 0.40, q(s, ".fs-shadow"), { opacity: 0 }, { opacity: 0.6, ease: "power1.out" });
  span(tl, at, 0.56, 0.90, q(s, ".fs-stage3d"), { rotationY: 0 }, { rotationY: 14, ease: "power2.in", immediateRender: false });
  span(tl, at, 0.80, 0.92, q(s, ".fs-stage3d"), { opacity: 1 }, { opacity: 0, ease: "power1.in", immediateRender: false });
};
```

---

## 9. Content: more scenes, verified sources only

### 9.1 Scene list per product

| # | Act | Tasree3 | Yisbir | Mandoobee | Wasel | Nazo | AI in a Box |
|---|---|---|---|---|---|---|---|
| 01 | I | title: Command Center screen; big type تسريع | title: fire and smoke screen; big type يسبر | title: ribbon "Attendance · Requests · Tasks · Documents · Assistant" | title: gate-access illustration | title: ribbon "Draft · Registered · In review · In approval · Signed · Sealed · Verified" (EV-543) | title: ribbon "Legal · Finance · HR · Research · IT Security" |
| 02 | I | problem | problem | problem | problem | problem | problem |
| 03 | I | people | people | people | people | people | people |
| 04 | II | product | product | product | product | product | product (agent matrix) |
| 05 | II | interface | interface | interface (phones) | interface | interface (draft screen) | interface (contract review) |
| 06 | II | walkthrough | walkthrough | walkthrough | walkthrough | walkthrough | walkthrough |
| 07 | II | features | features | features | features | **assistant** (new) | features |
| 08 | II | output (conformance screen) | output | output | output | features | output |
| 09 | III | **usecases** | **usecases** | **usecases** | **usecases** | output | value |
| 10 | III | **integrations** | **deploy** | **deploy** | **deploy** (connectivity) | **usecases** | **next** |
| 11 | III | **deploy** | value | value | value | **deploy** (absorbs value) | |
| 12 | III | value | **faq** | **faq** | **faq** | **faq** | |
| 13 | III | **faq** | **next** | **next** | **next** | **next** | |
| 14 | III | **next** | | | | | |
| | | **14** | **13** | **13** | **13** | **13** | **10** (+1 governance scene in PREVIEW builds only) |

**Screen allocation (I9):** each real screen appears once per page. That is why Mandoobee, Nazo and AI in a Box open on a typographic ribbon: their only real screens belong to the interface and product scenes.

**Next-product order:** Mandoobee → Tasree3 → Nazo → Yisbir → Wasel → AI in a Box → Mandoobee.

Existing beats 02–08 keep their current copy, evidence and visuals unchanged. They become scenes with `act` and `id` (`problem`, `people`, `product`, `interface`, `walkthrough`, `features`, `output`, `value`).

### 9.2 New scene copy

The copy below is proposed. Items marked **P** are composed headings, FAQ questions or summaries; they need owner approval and are marked `PROVISIONAL` in code. Every answer and fact is taken from the cited register entry.

**Tasree3**
- **`usecases`**
  - Eyebrow: "Where it fits"
  - Heading (P): "Built for process-heavy organisations."
  - Body: "Scalable for SMEs, enterprises and government organisations." (EV-124)
  - Cases: Government · Banking and finance · Healthcare · Manufacturing · Enterprise (EV-124)
  - Annotation under the tiles: "Sectors the platform is built for, not a client list."
  - viz: `cases`
- **`integrations`**
  - Eyebrow: "Data in, documents out"
  - Heading (P): "Bring the event data you already have."
  - Body: "Load files or connect an HRMS. Tasree3 maps the columns and checks them before mining." (EV-552)
  - Facts:
    - Sources: CSV, JSON, PDF or DOCX files, or a connected HRMS (EV-552)
    - Documents: AI extracts events from PDF and DOCX (EV-552)
    - Required fields: case ID, activity and timestamp, mapped automatically (EV-552)
    - Models: BPMN 2.0 XML import and export (EV-554)
    - Exports: PDF, Excel and PowerPoint (EV-402)
    - Maps: PNG, PDF or animated GIF (EV-556)
  - viz: `ingest {sources:["CSV","JSON","PDF","DOCX","HRMS"], core:"Tasree3", outputs:["PDF","Excel","PowerPoint","BPMN 2.0 XML"]}`, "Illustrative diagram"
- **`deploy`**
  - Eyebrow: "Deployment and security"
  - Heading: "Run it in your own cloud or data centre." (EV-407)
  - Body: "In the region you choose, under your rules — no black box and no offshore lock-in." (EV-407)
  - Facts:
    - Identity: SSO via Microsoft Entra ID, SAML 2.0 and OIDC (EV-408)
    - Accounts: provisioned by your administrator; no self-registration (EV-551)
    - Data: encryption at rest and role-based access control (EV-408)
    - Change control: separated as-is and to-be staging (EV-408)
    - Logging: SIEM-compatible (EV-408)
    - History: a version on every approval, with one-click rollback (EV-405)
  - viz: `boundary {inside:["Tasree3","Your event data","Your identity provider"], caption:"Inside your infrastructure"}`
- **`value`** (tiles changed so they don't repeat `deploy`): "Zero-bureaucracy ready" · "Designed and developed in the UAE" · "Three modules, one AI-native core" (EV-410, EV-401)
- **`faq`**
  - Heading (P): "What process teams ask first."
  - Where does Tasree3 run? In your own cloud or data centre, in the region you choose. (EV-407)
  - What data does mining need? An event log with a case ID, an activity and a timestamp, from CSV, JSON, PDF or DOCX files or a connected HRMS. (EV-552)
  - Does it work in Arabic? Yes: English and Arabic, with right-to-left support. (EV-123, EV-551)
  - How do people sign in? Single sign-on through Microsoft Entra ID, SAML 2.0 or OIDC. Users are provisioned by your administrator. (EV-408, EV-551)

**Yisbir**
- **`usecases`**
  - Eyebrow: "Use cases"
  - Heading (P): "From the archive to the live site."
  - Body: "The same AI indexes recorded video and watches live cameras, then turns what it finds into insight." (EV-533, EV-534)
  - Cases:
    - Archives and media: search recorded video by what was said, in 50+ languages (EV-440, EV-442)
    - Construction and HSE: missing helmets and vests, restricted zones, falls (EV-133, EV-134)
    - Site security: after-hours intrusion, perimeter breaches, unauthorised access (EV-537)
    - Fire and smoke: flagged on existing cameras (EV-138, EV-444)
    - Attendance and occupancy: headcount by room or by shift (EV-138, EV-534)
    - Retail shelves: product misplacement and gaps (EV-533). `status:"confirm"`, PREVIEW only, until model readiness is confirmed.
  - viz: `screen` → `SCREENS.yisbirAlerts`, with the cases as a foreground list
- **`deploy`**
  - Eyebrow: "Deployment"
  - Heading (P): "On your infrastructure, with the cameras you have."
  - Body: "Cloud, on-premise or hybrid. It can run fully on-premises, with no hardware changes." (EV-444, EV-443)
  - Facts:
    - Deployment: cloud, on-premise or hybrid (EV-444)
    - Public cloud: not required; can run fully on-premises (EV-443)
    - Cameras: existing cameras, existing network (EV-444)
    - Access: role-based access control and secure downloads (EV-442)
    - Integration: API integration (EV-442)
  - viz: `boundary {inside:["Existing cameras","Yisbir"], caption:"Can run fully on-premises"}`
- **`faq`**
  - Do we need new cameras? No hardware changes required: it works with existing cameras and infrastructure. (EV-444)
  - Can it run without the public cloud? Yes, fully on-premises. Cloud and hybrid are also options. (EV-443, EV-444)
  - Which languages can it transcribe? More than 50, with speaker diarization. (EV-440, EV-442)
  - Can it connect to our systems? Yes, through API integration. (EV-442)

**Mandoobee**
- **`usecases`**
  - Eyebrow: "Inside the app"
  - Heading (P): "Five areas of the working day."
  - Body: "HR, projects, documents, communication and AI in one platform." (EV-113)
  - Cases:
    - People and HR: employees, attendance, leave and requests
    - Work and projects: projects and tasks
    - Documents and knowledge: document workflows, shared folders, OCR and PDF tools
    - Communication: chat, groups, announcements and directories
    - AI: assistant, document Q&A, contract review and smart notes
    - Sources for all five: EV-114, EV-421
  - viz: `cases`
- **`deploy`**
  - Eyebrow: "Deployment"
  - Heading (P): "Deploy it your way, in Arabic and English."
  - Body: "On-premise, in the cloud or hybrid, on web and mobile." (EV-116)
  - Facts:
    - Deployment: on-premise, cloud or hybrid (EV-116)
    - Languages: Arabic and English (EV-116)
    - Brand: white-labelling and customisation (EV-116)
    - Integrations: third-party integrations (EV-116)
    - Apps: iOS and Android (EV-420)
  - Links (text only, no store badge art until badge use is approved), both from EV-420:
    - "Download on the App Store ↗" → `https://apps.apple.com/app/id6473241950`
    - "Get it on Google Play ↗" → `https://play.google.com/store/apps/details?id=ae.meerana.mandoobee`
  - viz: `tiles ["On-premise","Cloud","Hybrid"]`
- **`faq`**
  - Where can it run? On-premise, in the cloud or hybrid. (EV-116)
  - Is it bilingual? Yes, Arabic and English. (EV-116)
  - Is there a mobile app? Yes, on iOS and Android, alongside the web app. (EV-420)
  - Can it carry our brand? Yes: white-labelling and customisation, with third-party integrations. (EV-116)

**Wasel**
- **`usecases`**
  - Eyebrow: "Where it runs"
  - Heading (P): "From villas to multi-gate sites."
  - Body: "Built for residential communities, villas, apartments, commercial facilities and multi-gate environments." (EV-101)
  - Cases: Residential communities · Villas and apartments · Commercial facilities · Multi-gate environments (EV-101) · Industries and warehouses · Construction sites (EV-104)
  - viz: `cases`
- **`deploy`**
  - Eyebrow: "Connectivity and security"
  - Heading (P): "Four ways to reach a gate."
  - Body: "Cellular, local Wi-Fi, Bluetooth or local offline, on Meerana's own controller." (EV-103, EV-530)
  - Facts:
    - Controller: industrial-grade and plug-and-play; Meerana's own (EV-103, EV-530)
    - Monitoring: position, temperature and humidity sensors (EV-103)
    - Security: encrypted keys and role-based access (EV-103)
    - Provisioning: over-the-air (EV-103)
    - Records: audit and activity logs (EV-103)
  - viz: `modes {hub:"Wasel controller", modes:["Cellular","Local Wi-Fi","Bluetooth","Offline"]}`
- **`faq`**
  - What if the internet is down? The gate keeps working over Bluetooth or in local offline mode. (EV-103)
  - Whose controller is it? Meerana's own industrial-grade controller, with plug-and-play connections. (EV-103, EV-530)
  - Can one app manage several gates? Yes: multi-gate management with real-time status. (EV-103, EV-102)
  - Is every opening recorded? Yes. Audit and activity logs record each open and each grant. (EV-103)

**Nazo**
- **`assistant`** (kind `features`)
  - Eyebrow: "AI by role"
  - Heading (P): "An assistant for each role in the chain."
  - Body: "Fourteen AI actions, each scoped to the person using it." (EV-542)
  - viz: `columns`, from EV-542:
    - Requester: Auto-fill · Check errors · Draft content · Generate reference · Translate
    - Approver: Draft comment · Missing-information check · Summarise · What changed
    - Admin: Generate template · Translate template · Build workflow · Validate workflow · Suggest variables
- **`usecases`**
  - Eyebrow: "Use cases"
  - Heading (P): "Every official letter, in and out."
  - Body: "Internal and external communications, initiated, tracked, approved, signed and archived." (EV-141)
  - Cases:
    - Outgoing letters: drafted from bilingual templates, approved, signed and sealed (EV-141, EV-545, EV-543)
    - Incoming correspondence: registered with a reference and routed (EV-142, EV-543)
    - Internal communications: routed through review and approval (EV-141, EV-545)
    - Signature authority: roles decide who may sign (EV-142)
- **`deploy`**
  - Eyebrow: "Security and deployment"
  - Heading: "Your correspondence, your servers." (the existing value heading)
  - Body: "On-premises or cloud, and the AI model runs on the same servers as the application." (EV-142, EV-541 public wording)
  - Facts:
    - Seal: a tamper-evident SHA-256 seal on every signed document (EV-544)
    - Verification: a QR code re-checks the archived document (EV-544)
    - AI guardrails: suggestions are checked against the form before they touch the record; people approve (EV-546)
    - Vault: encryption and audit trail (EV-142)
    - Languages: English and Arabic templates, right-to-left (EV-545)
  - viz: `flow {nodes:["Render","Hash","Seal","Archive","Verify"]}` (EV-544)
- **`faq`**
  - Does it work in Arabic? Yes. Templates come as English and Arabic twins, with right-to-left support. (EV-545, EV-541)
  - How is a signed letter verified later? Its QR code opens a check that re-hashes the archived document and compares it with the seal. (EV-544)
  - Where does the AI run? On the same servers as the application. (EV-541)
  - Who has the final say? People. AI suggestions are checked against the form before they touch the record. (EV-546)

**AI in a Box:** no new production scenes.
- A governance scene ("Agents that ask before they act.", EV-573, use-with-edit "once confirmed implemented") is authored with `status:"confirm"` and shows only in PREVIEW builds.
- There is no deploy, integrations or FAQ scene (DL-P13: EV-571 vs EV-460 is unresolved).

### 9.3 Deliberately excluded

| Excluded | Why |
|---|---|
| Tasree3 connectors (SAP, Oracle, Dynamics, ServiceNow, Salesforce) | EV-409 is confirm-with-meerana and contradicts itself on maturity |
| "70 % modelling speed-up", "−34 % cycle time", "98.2 % conformance" | EV-125 (confirm-with-meerana), EV-412 (do-not-use) |
| Tasree3 "ISO 9001 aligned" | EV-406 is confirm-with-meerana; it risks being read as a certification |
| Yisbir face recognition, person attributes, plates, gender | EV-135/136/535, DL-P07: legal review; the site focuses on other detections |
| Yisbir accuracy and volume metrics | EV-447 (do-not-use) |
| Wasel "99.9 % uptime", "AES-256", "<1 s" | EV-105 (do-not-use) |
| Wasel toll gates and parking billing | EV-104 note: needs confirmation |
| Mandoobee–Wasel "IoT Smart Pass" link | EV-115 note, DL-P06 |
| Nazo "immutable", "legally binding", "10× faster", "100 % secure" | EV-544 note, EV-143 |
| AI in a Box deployment, sovereignty or planned features | DL-P13, EV-570/571/572 |

### 9.4 Data model (`content/storyboards.ts`)

```ts
export type SceneKind =
  | "title" | "problem" | "people" | "product" | "interface" | "walkthrough" | "features"
  | "output" | "usecases" | "integrations" | "deploy" | "value" | "faq" | "next";
export type Act = 1 | 2 | 3;
export type Enter = "pan" | "dolly" | "wipe" | "type";
export type Layout = "split" | "reverse" | "wide" | "center";
/** ok: ships · provisional: ships, listed for owner approval · confirm: PREVIEW builds only. */
export type Status = "ok" | "provisional" | "confirm";

export type Viz =
  | /* …every existing kind… */
  | { kind: "ribbon"; words: string[] }                                         // typographic title art
  | { kind: "cases" }                                                           // drawn from scene.cases
  | { kind: "ingest"; sources: string[]; core: string; outputs: string[] }
  | { kind: "boundary"; inside: string[]; outside?: string[]; caption: string }
  | { kind: "modes"; hub: string; modes: string[] }
  | { kind: "columns"; cols: { label: string; items: string[] }[] }
  | { kind: "next"; slug: string }
  | { kind: "none" };

export type Scene = {
  id: string;                      // anchor, unique per page: "problem", "deploy"…
  kind: SceneKind;
  act: Act;
  eyebrow: string;
  heading: string;
  body?: string;
  evidence: string;                // required except for title (heroEvidence) and next (navigation)
  status?: Status;                 // default "ok"
  layout?: Layout;                 // default by kind: people → reverse, faq → wide, value/next → center, else split
  enter?: Enter;                   // default by kind; forced to "wipe" on the first scene of acts 2 and 3
  bigType?: { text: string; lang?: "ar" };   // default: the scene number
  steps?: { label: string; copy: string }[];
  features?: string[];
  cases?: { label: string; copy?: string; evidence: string; status?: Status }[];
  facts?: { label: string; value: string; evidence: string }[];
  faq?: { q: string; a: string; evidence: string }[];
  links?: { label: string; href: string; external?: boolean }[];
  provenance?: Provenance;
  viz: Viz;
  /** Computed by visibleScenes(): "01"…, with no gaps after filtering. */
  n?: string;
};

export type ProductStory = Omit<OldProductStory, "beats"> & {
  heroEvidence: string;            // Tasree3 "EV-400 EV-401 EV-410", Yisbir "EV-440", Mandoobee "EV-113",
                                   // Wasel "EV-102 EV-103", Nazo "EV-141 EV-142", AI in a Box "EV-520"
  titleArt: Viz;                   // { kind: "screen", screen } or { kind: "ribbon", words }
  scenes: Scene[];                 // scenes 02…N−1; title and next are added by visibleScenes()
};

export function visibleScenes(story: ProductStory): Scene[] {
  const title: Scene = { id: "overview", kind: "title", act: 1, eyebrow: `Products · ${story.name}`,
    heading: story.hero, body: story.heroSub, evidence: story.heroEvidence, viz: story.titleArt,
    bigType: story.nameMoment ? { text: story.nameMoment.ar, lang: "ar" } : { text: story.name } };
  const next: Scene = { id: "next", kind: "next", act: 3, eyebrow: "Next", heading: story.closingLine,
    evidence: "", viz: { kind: "next", slug: nextSlug(story.slug) } };
  const list = [title, ...story.scenes.filter((s) => s.status !== "confirm" || PREVIEW), next];
  return list.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0"),
    enter: i > 0 && list[i - 1].act !== s.act ? "wipe" : s.enter ?? DEFAULT_ENTER[s.kind] }));
}
```

`content:check` additions:
- the budgets in §4.6;
- non-empty evidence (except `title` and `next`);
- every cited EV is ok-to-use or use-with-edit in the register;
- no `confirm` scene and no forbidden strings in production HTML.

### 9.5 New visuals (`SceneVisual.tsx`, `app/viz.css`)

Each new kind is drawn in the isometric lattice language (30° axes).
- Strokes use `--lattice-line-strong`; nodes and key edges use the product accent.
- Labels are HTML, never SVG `<text>`, so they scale and pass 4.5:1.
- The drawing is aria-hidden. The provenance label is exposed.

| Kind | Drawing |
|---|---|
| `ribbon` | 3–7 words in a horizontal band, separated by a 1 px accent rule |
| `ingest` | Left column of source chips → isometric core block → right column of outputs; straight connectors |
| `boundary` | Isometric rectangle with a dashed edge, labelled by caption, holding the `inside` nodes |
| `modes` | Hub node with 4 spokes to mode nodes |
| `columns` | 2–3 labelled columns of short items |
| `cases` | 2×3 tiles: number, label, optional copy |
| `next` | `<a href="/products/<slug>/">`: the next product's real `SHOWCASE.shot` (lazy, with its provenance), plus name, descriptor and "Explore →" |

The existing kinds are restyled to the same tokens now. A full isometric redraw is P2.

---

## 10. Touch, mobile and tablet rail

```css
.fs[data-mode="rail"] .fs-track {
  overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain; scrollbar-width: none;
}
.fs[data-mode="rail"] .fs-scene { scroll-snap-align: start; scroll-snap-stop: always; } /* one swipe, one scene */
.fs[data-mode="rail"] .fs-frame { inset: 0 0 var(--fs-dock); }                          /* the header sits above the rail */
```

**Layout below 1024**
- Below 768 (phones): one column. Copy first, then the mid capped at `max-height: 34svh`.
- 768–1023 (tablets): copy on top, mid `max-height: 42svh`, lists in 2 columns.
- Diagrams that only echo a list may be omitted below 768. These are the aria-hidden drawings for walkthrough, features, usecases, deploy, integrations and FAQ; the list carries the content. **Real screens are never omitted.**
- Walkthrough steps render label + copy in the foreground on phones.

**Phone budget at 375×667:** content box = 667 − 72 − 56 − 24 = 515. The walkthrough stack is 186 (copy) + 5 × 63 (steps) = 501, so it fits.

**Depth on touch (progressive, no JS):**

```css
@supports (animation-timeline: view(inline)) {
  @media (prefers-reduced-motion: no-preference) {
    .fs[data-mode="rail"]:not([data-static]) .fs-bg  { animation: fs-par-bg linear both;  animation-timeline: view(inline); animation-range: cover; }
    .fs[data-mode="rail"]:not([data-static]) .fs-mid { animation: fs-par-mid linear both; animation-timeline: view(inline); animation-range: cover; }
  }
}
@keyframes fs-par-bg  { from { transform: translateX(-30%); } to { transform: translateX(30%); } }
@keyframes fs-par-mid { from { transform: translateX(-10%); } to { transform: translateX(10%); } }
```

The CSS timeline is the only owner of these transforms in rail mode. GSAP never runs there.

**Controls**
- The dock sits under the rail.
- The counter follows `scrollLeft` (rAF-throttled, using Showcase's centre-nearest logic).
- Previous/next call `scrollTo({ left: i × clientWidth, behavior: reduced ? "auto" : "smooth" })`.
- A hint above the rail reads "Swipe through 13 scenes" (it is text, so it never hides content).

---

## 11. Reduced motion, list view and no JavaScript

**Reduced motion (static rail):**
- `data-static` is set.
- No GSAP is downloaded and no CSS scroll timelines run.
- No shutter (`display:none`) and no load intro.
- Big type is static and every element is in its final state.
- Previous/next and chapter links jump instantly.
- The dock hint reads "Use ← → or the buttons."

**List view:**
- Triggered by `@media (max-height:559px)` in pure CSS, or by `data-mode="list"` from the toggle.
- `.fs-track { display:block }` and `.fs-scene { height:auto; min-height:0; content-visibility:auto; contain-intrinsic-size:auto 100svh; }`.
- Frames stay in normal flow with the same columns.
- Separated by the splice rule shown horizontally.
- The dock becomes a sticky top bar of chapter links.
- A "Film view" button sits at the top (hidden when height is below 560).

**No JavaScript:** the server markup is the rail.
- Scene 01 (H1, sub-line, CTAs, screen) is the first frame.
- Every scene can be reached by horizontal scroll and every chapter link works.
- Before hydration the dock buttons are absent; the links and the scroller still work.

---

## 12. Accessibility

- **Headings:** one H1 (the title scene) and one H2 per scene, in DOM order. Scenes are unnamed `<section>`s (not landmarks). The dock is `<nav aria-label="Story scenes">`.
- **Chapter links** are real `href="#id"` links with `aria-current="location"`. Their labels are always in the accessibility tree and become visible on `:hover` and `:focus-visible`.
- **Live region:** `aria-live="polite"` announces "Scene 4 of 14: Interface" after a settle only, never during scrubbing.
- **Keyboard:** the map in §7.6 is announced once, through sr-only text at the start of the film. Header menus, form fields and focused buttons are never hijacked.
- **Focus:**
  - Every focusable element sits inside the content box, so the 72 px header and the dock never obscure focus (WCAG 2.4.11).
  - The focus ring stays at least 8 px inside the scene's clip (gutter ≥ 16).
  - Focus inside an off-screen scene brings that scene to rest.
- **Inert:** no product-page scene is dimmed at rest, so none is inert. The gallery keeps inert dimmed neighbours (§14).
- **Targets:** at least 44×44 for buttons; chapter ticks are 24×44 (WCAG 2.5.8 at least 24).
- **Contrast:**
  - Body and secondary text must reach ≥4.5:1 against the worst background pixel, including big-type strokes. Tasree3's worst case is orange at 26 % on `#001731`; `--text-secondary` is still above 6:1.
  - Labels inside diagrams must reach ≥4.5:1.
  - Shutter act labels use `--p-fg` on `--p-bg`.
- **No autoplay.** The only time-based motion is the 420 ms load settle and the 720 ms lattice assembly, both under 5 s (WCAG 2.2.2).
- **Zoom and reflow:** at 200 % zoom on 1366×657 the CSS viewport is 683×328, below 560 high, so list view takes over. WCAG 1.4.10 is satisfied.
- **Language:** the Arabic big type carries `lang="ar" dir="rtl"`. The accessible name moment stays in the copy.
- **Known limitation:** find-in-page cannot bring a match in an off-screen scene into view in film mode. List view (one click, remembered) and the rail both support it.

---

## 13. Performance

| Budget or rule | Value |
|---|---|
| Product-page JS (gzip), excluding the GSAP chunk | ≤ 150 KB |
| GSAP chunk (core + ScrollTrigger + ScrollToPlugin) + engine + choreography | ≤ 50 KB gzip; film mode only |
| Root ScrollTriggers | 1 per film. Children: N + 1 (≤ 15). |
| Animated properties | transform and opacity only |
| Promoted layers | Track + far + `.is-near` scenes (current±1) × 5 layers. About 17 MB of GPU memory at 1366×657 for the background layers (2186×657×4 B × 3). |
| `will-change` | Only on `.is-near`, toggled on index change; never left on static elements |
| Header in film mode | `body:has(.fs[data-mode="film"]) .site-header { backdrop-filter: none; background: color-mix(in srgb, var(--surface-page) 94%, transparent); }`. No blur over moving content. |
| Images | Title screen: `loading="eager"`, `fetchpriority="high"`. Scenes 02–03 eager. The rest lazy, upgraded to eager for current+2 (§7.3). Mid `sizes="(min-width:1024px) 46vw, 92vw"`. width and height always set. |
| React | Scenes memoised. Index changes re-render the dock only. The progress bar uses `quickSetter`. |
| Scroll handlers | `scroll` only arms the settle timer and reads `scrollY`. No layout reads per frame. |
| Targets | No long task > 50 ms caused by scrolling (4× CPU throttle). Median ≥ 55 fps on a real GPU (swiftshader numbers are informative only). CLS ≤ 0.02. LCP stays the H1 text. |

---

## 14. Homepage gallery

### 14.1 Gate

`MQ.pinned` becomes the D3 gate (≥1024×560, fine pointer, motion allowed); see §3.2. The rail stays for touch, narrow windows and reduced motion. DD-23 is amended in the decision log.

### 14.2 Fit

```css
.showcase {
  --sc-controls-h: 64px;
  --sc-pad: clamp(12px, 2.4vh, 28px);
  --sc-card-h: min(calc(100svh - var(--header-h) - var(--sc-controls-h) - 2 * var(--sc-pad)), 720px);
  --cw: min(1120px, 80%, calc(var(--sc-card-h) * 1.95));   /* % of the pin, not vw */
}
.showcase.is-pinned .sc-film { height: 350svh; }           /* 100svh viewport + 250svh travel (DD-23 length kept) */
.showcase.is-pinned .sc-pin {
  position: sticky; top: 0; height: 100svh;
  display: grid; grid-template-rows: var(--header-h) 1fr var(--sc-controls-h);
}
.showcase.is-pinned .sc-track { grid-row: 2; align-self: center; padding-inline: calc((100% - var(--cw)) / 2); }
.showcase.is-pinned .sc-card  { height: var(--sc-card-h); padding: clamp(20px, 3.5vh, 48px); gap: clamp(16px, 3vh, 48px); }
.sc-name       { font-size: clamp(1.75rem, min(3vw, 6vh), 3rem); }
.sc-descriptor { font-size: clamp(1rem, calc(0.6rem + 1vh), 1.3125rem); }
.sc-line       { font-size: clamp(0.9375rem, calc(0.55rem + 1vh), 1.0625rem); }
.sc-shot img   { max-height: calc(var(--sc-card-h) - 2 * clamp(20px, 3.5vh, 48px) - 28px); width: auto; max-width: 100%; }
@media (max-height: 720px) {
  .sc-copy { gap: 10px; } .sc-caps { gap: 4px; }
  .sc-card .spec-list > * { display: flex; gap: var(--sp-2); }   /* Deploys label and value on one line */
}
/* Remove: .showcase.is-pinned .sc-card { height: min(74svh, 700px) } and padding-inline: calc((100vw - var(--cw)) / 2). */
```

| Viewport | Card height | Card width | Peek each side |
|---|---|---|---|
| 1024×640 | 473 | 819 | 102 |
| 1280×601 | 436 | 850 | 215 |
| 1366×657 | 489 | 954 | 206 |
| 1536×730 | 559 | 1090 | 223 |
| 1440×900 | 720 | 1120 | 160 |
| 1920×937 | 720 | 1120 | 400 |

**Copy stack at 436 px tall:**
- padding 42 + name 38 + descriptor 22 + line (2 lines) 49 + capabilities 75 + Deploys row 38 + actions 44 + gaps 72 = **380**, so it fits.
- Tasree3's long Deploys value wraps to 3 lines: 420, still within 436. The acceptance check enforces this.

### 14.3 Layers inside each card

The card stays a solid surface (DD-22).

```tsx
<li className="sc-panel" …>                                  {/* trigger element: never animated */}
  <div className="sc-card" data-media={panel.media}>          {/* "phones" | "wide" | "iso" | "matrix" | "doc" */}
    <div className="sc-bg" aria-hidden="true">
      <span className="sc-field" /><span className="sc-num">{panel.index}</span>   {/* outlined "01", 26% accent */}
    </div>
    <div className="sc-copy">…unchanged copy, SpecList, actions…</div>
    <div className="sc-media"><div className="sc-media-3d"><ScreenFrame screen={panel.shot} eager={eager} className="sc-shot" /></div></div>
  </div>
</li>
```

**Composition per media type** (the audit's G-5 "six identical panels"):
- `phones` (Mandoobee cut-out): columns 6fr/6fr.
- `wide` (Tasree3, Yisbir, Nazo, AI in a Box): 5fr/7fr.
- `iso` (Wasel): 5fr/7fr, with the illustration unframed and its translateZ start 30 px deeper.

### 14.4 Card choreography

Children of the gallery's existing track tween.

```ts
panels.forEach((panel, i) => {
  const range: Range = i === 0 ? "first" : i === panels.length - 1 ? "last" : "full";
  const at = mapper(range);
  const cw = () => panel.offsetWidth;
  const media = panel.querySelector(".sc-media-3d")!;
  gsap.set(media, { transformPerspective: 1200 });
  const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
    trigger: panel, containerAnimation: tween, scrub: true, invalidateOnRefresh: true,
    start: range === "first" ? "left left" : "left right", end: range === "last" ? "left left" : "right left" } });
  // linear depth across the full window (bg slower than the card, the numeral slower still)
  const [p0, p1] = range === "full" ? [0, 1] : range === "first" ? [0.5, 1] : [0, 0.5];
  tl.fromTo(panel.querySelector(".sc-bg"), { x: () => (p0 - 0.5) * 0.16 * cw() }, { x: () => (p1 - 0.5) * 0.16 * cw(), duration: 1 }, 0)
    .fromTo(panel.querySelector(".sc-num"), { x: () => (p0 - 0.5) * 0.10 * cw() }, { x: () => (p1 - 0.5) * 0.10 * cw(), duration: 1 }, 0);
  // coverflow-lite: neighbours show tilted screens; the current card's screen is flat at rest
  span(tl, at, 0, 0.5, media, { rotationY: -14, z: -90, scale: 0.94 }, { rotationY: 0, z: 0, scale: 1, ease: "power2.out" });
  span(tl, at, 0.5, 1, media, { rotationY: 0, z: 0, scale: 1 }, { rotationY: 14, z: -90, scale: 0.94, ease: "power2.in", immediateRender: false });
  span(tl, at, 0, 0.5, panel.querySelector(".sc-copy"), { x: () => 0.03 * cw() }, { x: 0, ease: "power2.out" });
  span(tl, at, 0.5, 1, panel.querySelector(".sc-copy"), { x: 0 }, { x: () => -0.03 * cw(), ease: "power2.in", immediateRender: false });
});
```

**What stays the same:**
- The track tween (`x: -distance`, `ease:"none"`, `scrub: 0.5`). Its trigger becomes `.sc-film` with `start:"top top"`, `end:"bottom bottom"`; `pin` and `anticipatePin` are removed.
- The settle algorithm (now through `lib/settle.ts` with `threshold: s => s * 0.12`).
- Inert neighbours.
- CSS-owned 0.35 ↔ 1 opacity. GSAP owns transforms only (I7).
- Focus sync, the counter and the buttons.

**Under reduced motion and in the rail:** no GSAP and no tilt. On touch, the optional CSS `view(inline)` parallax on `.sc-bg` and `.sc-media` is P2.

---

## 15. Criticism and fixes

| Criticism (source) | Fix |
|---|---|
| "Each product is vertically scrolling" (client) | Film mode (§3) and the touch rail (§10). No vertical beats in any default mode. |
| "3D: separate background and foreground" (client) | Five-layer stack with measured rates and real perspective (§5) |
| "Separate cinematic animations" (client) | 14 per-kind choreographies and 5 transitions (§8) |
| "More contents" (client) | 13–14 scenes; new use cases, integrations, deployment and security, FAQ and next product, all from the register (§9) |
| "Landing bad in my resolution" (client), gallery part | Pinned at ≥1024×560 with cards that fit (§14) |
| Walkthrough copy taller than the viewport at heights 601–730 (measured) | I8, tight rules, fit proof (§4.5–4.7) |
| Stage visual fixed at about 265 px (measured) | Media sized from `--fs-content-h` |
| Product hero taller than the viewport (measured) | The title scene fits the frame |
| Visual rendered twice (code) | One DOM copy per scene |
| Diagrams under the text or under a scrim (audit D-pp-2) | Separate columns; full opacity at rest (I1, I4) |
| Close section overlapping the last visual (D-pp-8) | The close becomes the `next` scene |
| 900 px stacks of pills on mobile (D-pp-9) | Phone budget; echo diagrams omitted on phones in favour of the list |
| Visuals stacking before hydration (D-pp-10) | The server-rendered rail shows scene 01 only |
| Diagrams not redrawn in the isometric language (report, "not done") | New visual kinds drawn on the lattice; the old ones restyled (redraw is P2) |
| Six identical gallery panels (G-5) | Media-slot variants (§14.3) |
| Gallery pinned only at ≥1280×760 (DD-23) | Amended to ≥1024×560; the 250vh length is kept |
| Keyboard focus lost in the pinned track (D-home-7) | Focus sync, real chapter links, inert gallery neighbours |
| `.story` class collision | `.fs-` namespace |
| `100vw` scrollbar offset (found in `showcase.css`) | Percentages of the pin width everywhere |
| `backdrop-filter` over moving content (skill rule) | Solid header in film mode |
| AI in a Box claims (DL-P13) | No deploy scene; governance gated to PREVIEW |

---

## 16. Acceptance checks (`scripts/verify-film.mjs`, Playwright, `--use-angle=swiftshader`)

**Viewports**
- Film: 1024×640, 1280×601, 1366×657, 1440×900, 1536×730, 1536×864, 1920×937, 1920×1080, 2560×1300.
- Rail: 768×1024, 390×844, 375×667.
- List: 1280×520.
- Static rail: 1366×657 with `reducedMotion: "reduce"`.

**Product pages**
- **A1 Mode.** Film-mode viewports have `.fs[data-mode="film"]` within 1.5 s of `load`. The others are `rail`, or `list` at 1280×520.
- **A2 Geometry.**
  - `scene.getBoundingClientRect().width === document.documentElement.clientWidth` (no scrollbar error).
  - `.fs` height = innerHeight + (N − 1) × S, ±2.
- **A3 Rest is final (I1).** For every scene i, `scrollTo(restY(i))`, wait 700 ms, then check:
  - |scene left| ≤ 1;
  - every text element in the scene has computed opacity 1;
  - `.fs-fg` and every `h1`/`h2` transform is identity (|tx| < 0.5);
  - the shutter's rect is outside the scene.
- **A4 Fit (I8).**
  - At rest, every element in `.fs-fg` and `.fs-mid` lies within [`--fs-head`, innerHeight − dock] vertically and [0, innerWidth] horizontally.
  - `scrollHeight ≤ clientHeight + 1` for `.fs-copy`, `.fs-mid` and `.viz`.
  - Checked at all film viewports, for every scene of every product.
- **A5 Parallax.** In scene 04 at p = 0.25, the offsets from rest satisfy |bg| < |mid| < |fg|, and the ratios bg:mid:fg are within ±10 % of 0.70 : 0.90 : 1.00.
- **A6 3D.** During the scene 05 entrance, the computed transform of `.fs-stage3d` is a `matrix3d` with perspective (m34 ≠ 0).
- **A7 Wheel.**
  - At rest on scene i, `mouse.wheel(0, 100)` reaches restY(i+1) ± 2 within 900 ms.
  - `wheel(0, 45)` advances one scene.
  - `wheel(0, 25)` returns to scene i.
  - Six notches in quick succession land on a rest position.
- **A8 Keyboard.**
  - ArrowRight, ArrowDown, PageDown and Space each move +1; ArrowLeft, ArrowUp, PageUp and Shift+Space move −1.
  - With focus in the header Products panel, arrow keys do not move scenes.
  - Space on a focused button activates the button.
- **A9 Focus.**
  - Over 80 Tab presses, every focused element is fully inside the viewport and not under the header or the dock (WCAG 2.4.11).
  - The film follows focus into the next scene.
- **A10 Chapters and deep links.**
  - Clicking chapter k lands on restY(k) within 1 s, with `aria-current` on k and focus on that scene's heading.
  - `/products/tasree3/#deploy` loads at the deploy rest position.
  - Back/forward restores the scene.
- **A11 Cut.** A chapter jump of 6 shows track opacity dropping below 0.2 within 150 ms, then 1 at rest, with no frame in between showing more than 2 scenes.
- **A12 Reduced motion.**
  - No request for any GSAP chunk.
  - `window.ScrollTrigger` is undefined.
  - Layers carry no inline transforms.
  - `scroll-snap-type` is `x mandatory`, and every scene is reachable with previous/next (instant).
  - Every text element has opacity 1.
- **A13 Rail.**
  - `track.scrollWidth = N × clientWidth` ± 2.
  - Each scene: `scrollHeight ≤ clientHeight`.
  - Setting `scrollLeft` snaps and updates the counter.
  - `documentElement.scrollWidth ≤ innerWidth`.
- **A14 List.** At 1280×520 the scenes are stacked, `track.scrollWidth ≤ clientWidth`, and nothing overflows horizontally.
- **A15 No JS.** With JavaScript disabled, the H1 is visible in the first frame and all N scenes are in the DOM and reachable by scrolling the scroller.
- **A16 Content.**
  - The production HTML contains no `status:"confirm"` text (for example the retail-shelves case or AI in a Box governance).
  - None of the excluded strings in §9.3 appear.
  - Every scene's EV ids resolve to ok-to-use or use-with-edit entries.
  - Each real screen `src` appears at most once per page.
  - No rendered image is wider than its `naturalWidth`.
- **A17 Accessibility.**
  - axe reports 0 serious or critical issues in film mode (scenes 01, 06, 11), rail, list and static rail.
  - Exactly one H1 per page.
  - Sampled contrast ≥ 4.5:1 for `.fs-body` over `.fs-bigtype`.
- **A18 Performance.**
  - Product page JS gzip ≤ 150 KB plus a GSAP chunk ≤ 50 KB.
  - Lighthouse mobile on `/products/yisbir/`: Performance ≥ 90, CLS ≤ 0.05.
  - Trace at 1366×657 with 4× CPU over 5 s of scrolling: no long task over 50 ms from scroll handlers.
  - No more than 3 scenes have `.is-near`.

**Homepage gallery**
- **A19.** At 1024×640, 1280×601, 1366×657, 1536×730 and 1920×937: `.showcase.is-pinned`; pinned travel = 2.5 × innerHeight ± 2.
- **A20.** At each rest position, the current card's rect lies within [header-h, innerHeight − 64] and its copy and media do not overflow.
- **A21.** One wheel notch moves to the next card. Neighbours are `inert` and at opacity 0.35. Focus sync works. Previous/next and the counter work.
- **A22.** At rest the current card's `.sc-media-3d` transform is identity, and a neighbour's carries rotationY ≠ 0.
- **A23.** Card centre = viewport centre ± 1 px at every rest position (no scrollbar offset).

---

## 17. Build order, owner decisions and an adjacent finding

**Build order** (each phase verified on the :3000 dev server, then on a :4173 build):
1. **Content and model.** `Scene` types, `visibleScenes`, new scenes and copy, `content:check`.
2. **Rail and list without GSAP.** `Film`, `Scene`, `SceneVisual`, `Dock`, `film.css`, `viz.css`. Pass A2, A4 (rail and list), A13–A16.
3. **Film engine.** Master tween, layer rates, settle, keyboard, focus, hash and cut. Pass A1–A3, A5, A7–A11.
4. **Choreography and transitions.** `CHOREO`, `ENTER`, development assertions. Pass A3, A6, A17, A18.
5. **Gallery.** Gate, fit, sticky, layers. Pass A19–A23.
6. **Docs.** Decision log, implementation report, and a `verify-launch.mjs` change (product pages leave the pin-budget check; the homepage keeps ≤ 2.5 × innerHeight).

**Owner decisions to log, dated 2026-10-11:**
- (a) The product-page pin budget is lifted (client).
- (b) DD-23 gate becomes ≥1024×560.
- (c) Reduced motion defaults to a static horizontal rail, with List view.
- (d) The composed headings and FAQ questions marked P are provisional.
- (e) Mandoobee store links are text, with no badge art.
- (f) Next-product order.
- (g) Yisbir retail shelves and AI in a Box governance stay PREVIEW-only until confirmed.
- (h) "Meerana Intelligence Layer" remains mandated even though EV-473 is flagged do-not-use. This flag is carried over.

**Adjacent finding (hero, outside this spec; hand to the hero owner):**
- At 1280×601 the homepage hero is 674 px tall and the last CTA ends at y = 642, so it is **below the fold**.
- At 1024×640 the CTA ends at y = 657, also below the fold.
- At 1366×657 the hero is 674 px tall, against a 657 px viewport.
- The `max-height: 800px` branch in `app/hero.css` (line 190) is not enough.
- In the headless capture at 1280×601 the room area rendered empty. Verify that on a real GPU before judging.
- This is likely the other half of "in my resolution it's bad."