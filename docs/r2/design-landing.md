# Responsive Landing Spec: Meerana homepage, revision 2

Author: responsive-landing subagent · 2026-10-11 · Scope: `/`, covering the hero, gallery, scenario, world, CTA, footer and header.
Evidence: Playwright screenshots and geometry of `http://localhost:4173/` (current build) are in `C:/Users/abhin/AppData/Local/Temp/mrn/r2l/shots/`. The scripts are `shoot.js`, `hero-only.js` and `frame.mjs` in the same folder. The camera-framing numbers in section 2.4 come from `frame.mjs`, which uses three 0.186 and the real `room-layout.ts` geometry.

> **Authority note.** The client asked for "more contents" in the latest request. That overrides the audit's net-content rule (AUDIT §0, "do not add homepage content"). Everything added in section 5 is backed by evidence-register rows marked `ok-to-use`. Nothing else changes: mandated copy stays verbatim, there are no invented metrics, and no AI imagery is used.

---

## 0. What is wrong today (measured)

| Viewport | Hero | Room | Gallery | Other |
|---|---|---|---|---|
| **1280×601** | `.hero` is 675px tall on a 601px viewport. **The CTA bottom is at 643, 42px below the fold.** H1 is 64px. | Box is `inset:0 -22% 0 60%`, so 301px of the canvas is off-screen and the panel bbox is clipped 77px at the right edge. | Rail mode (601 < 760). Card is 1120×665, taller than the 528px usable height, so the card top sits under the header and the controls are below the fold. | Rail cards start at x=48 but the heading starts at x=91, so the left edges don't line up. |
| **1366×657** | 675px tall on 657 (18px overflow). The CTA clears the fold by only 14px. Copy box is 736px wide. | Canvas starts at x=820, right against the 827px copy edge. Panels are clipped 69px. Only 3 of the 6 panels are visible and the middle-right of the hero is a dead zone. | Rail mode. Card 665 + controls 92 does not fit 584. **Each product reads as a tall card you scroll down**, which is the client's complaint. | Scenario step 01 shows an **empty 635×400 lattice box**. |
| **1536×730** (1920 @125%) | Fits, with 60px spare. | Clipped 69px. | Rail mode (730 < 760) on a desktop with a mouse. Same overflow as above. | |
| **1920×937** | Fits. H1 is 96px. | Clipped 93px. Near panel is 346px wide. | Pinned. Card height is `min(74svh,700)`=693, which leaves a **~150px empty band** between the heading and the cards. | |
| **2560×1440** | Copy is locked to the 1280 container. About 430px empty at the top and a large gap between the copy and the room. | Clipped 179px, crammed into the far right. | Pinned. Card 1120×700 in 1440, so roughly 500px of the height is empty. | |
| **1024×768** | 1076px tall. The poster screen (307px) sits **below** the CTA, outside the first viewport. | Poster only (no 3D below 1280). | Rail mode. Card is 2-column but the copy column is only 315px. | |
| **768×1024** | 1205px tall. Poster below the CTA. | Poster. | Rail mode. **Card is 676×1077, taller than the viewport.** | Scenario section is 2,411px tall. |
| **390×844** | 1077px tall. The CTA fits at 717. | Poster at 265px. | **Card is 343×904, taller than the viewport.** | Footer is 842px. Page is 7,180px. |

Root causes:

1. Type and spacing scale only with `vw`. There is one `max-height:800px` patch, and nothing in the system knows the viewport height.
2. The hero's room box bleeds a fixed `-22%` and the camera is fixed, so framing ignores aspect ratio.
3. The pin is gated at ≥1280×760, so most laptop browsers (whose inner height is 600–760) get the stacked rail.
4. Card height is set by content, not by the viewport.
5. Rail cards stack copy over media below 1024.

---

## 1. Fluid system: one axis-aware unit

### 1.1 Tokens (`app/tokens.css`, inside `@layer tokens :root`)

```css
/* The axis-aware unit. In landscape it is min(1vw, 1.85svh): width-driven
   until the viewport is shorter than 16:9, then height-driven. So everything
   built on --u fits short laptop browsers by construction. */
--u: min(1vw, 1.85svh);

/* Display and headings: clamp(min, coefficient x --u, max) */
--fs-hero:    clamp(2.25rem, calc(5.2  * var(--u)), 7.5rem);  /* H1 only */
--fs-display: clamp(2.25rem, calc(4.4  * var(--u)), 6rem);    /* CTA headline */
--fs-h2:      clamp(1.75rem, calc(2.6  * var(--u)), 2.75rem);
--fs-lede:    clamp(1.0625rem, calc(1.45 * var(--u)), 1.5rem);
--fs-sc-name: clamp(1.75rem, calc(3.4 * var(--u)), 3.25rem);  /* gallery product name */
/* Body, small and label stay fixed: 17 / 15 / 13 px. Body never drops below 16px. */

/* Fluid space */
--sp-fluid-xs: clamp(6px,  calc(0.8 * var(--u)), 12px);
--sp-fluid-s:  clamp(10px, calc(1.9 * var(--u)), 32px);   /* hero stack gap */
--sp-fluid-m:  clamp(16px, calc(3.2 * var(--u)), 56px);
--sp-fluid-l:  clamp(32px, calc(5   * var(--u)), 96px);
--section-py:  clamp(48px, calc(7   * var(--u)), 128px);

--header-h: clamp(56px, calc(4.6 * var(--u)), 72px);       /* replaces the fixed 72px */
--content-max: clamp(1280px, 72vw, 1560px);                /* only grows above 1778px wide */
--gutter: clamp(16px, 4vw, 48px);                          /* unchanged */
```

Orientation overrides go in the same file, outside the layer's `:root` block:

```css
@media (orientation: portrait) { :root { --u: min(1.5vw, 1.1svh); } }
@media (orientation: portrait) and (max-width: 599px) { :root { --u: min(2.15vw, 1.1svh); } }
```

- `--fs-display` was `clamp(2.75rem, 1.6rem + 4.6vw, 5.25rem)`. Keep `.t-display` mapped to it. The hero H1 switches from `.t-display` to its own `.hero-title { font-size: var(--fs-hero) }`.
- `--fs-h2` was vw-only. `.t-h2` keeps the token name, so every section picks up the change.
- `--content-max` grows only above 1778px wide, so all routes keep one left edge (plan/11 §4). At 1366 nothing changes.

### 1.2 Resolved values (check implementation against these, ±1px)

| Viewport | `--u` | H1 | Lede | H2 | CTA display | Header |
|---|---|---|---|---|---|---|
| 1024×560 | 10.24 | 53.2 | 17 | 28 | 45.1 | 56 |
| 1280×601 | 11.12 | 57.8 | 17 | 28.9 | 48.9 | 56 |
| 1366×657 | 12.15 | 63.2 | 17.6 | 31.6 | 53.5 | 56 |
| 1440×789 | 14.40 | 74.9 | 20.9 | 37.4 | 63.4 | 66 |
| 1536×730 | 13.50 | 70.2 | 19.6 | 35.1 | 59.4 | 62 |
| 1536×864 | 15.36 | 79.9 | 22.3 | 39.9 | 67.6 | 71 |
| 1920×937 | 17.33 | 90.1 | 24 | 44 | 76.3 | 72 |
| 2560×1440 | 25.60 | 120 | 24 | 44 | 96 | 72 |
| 768×1024 (portrait) | 11.26 | 58.6 | 17 | 29.3 | 49.5 | 56 |
| 390×844 | 8.39 | 43.6 | 17 | 28 | 36.9 | 56 |
| 360×640 | 7.04 | 36.6 | 17 | 28 | 36 | 56 |
| 320×568 | 6.25 | 36 | 17 | 28 | 36 | 56 |

### 1.3 Header at short heights (`app/header.css`)

- `.hdr-inner { min-height: var(--header-h); padding-block: var(--sp-fluid-xs); }`
- `.hdr-mark { height: clamp(20px, calc(1.9 * var(--u)), 24px); }`
- The header CTA stays at least 44px tall, which fits inside 56 with 6px padding.
- `html { scroll-padding-top }` already reads `--header-h`, so it follows automatically.

---

## 2. Hero

### 2.1 Tiers (`lib/breakpoints.ts`, used by CSS and JS)

```ts
export const PIN_MIN_HEIGHT = 560;
export const MQ = {
  ...,
  /** Copy left, room right. */
  heroSplit: "(min-width: 900px) and (min-aspect-ratio: 5/4) and (min-height: 500px)",
  /** The three.js room may load (plus the JS column checks in 2.4). */
  roomWebgl: "(min-width: 1024px) and (min-aspect-ratio: 5/4) and (min-height: 500px)",
  short: "(max-height: 700px)",
  pinned: "(min-width: 1024px) and (min-height: 560px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
};
```

| Tier | Condition | Composition |
|---|---|---|
| **S: landscape split** | `heroSplit` | `.hero` is exactly `100svh` (`min-height:500px; max-height:1600px`). Copy on the left, room column on the right. The canvas is full-bleed behind everything (2.3). |
| **S-short** | `heroSplit` and `max-height:700px` | Same as S with compact moments and 44px buttons (2.2). |
| **S-ultra** | `heroSplit` and `min-aspect-ratio: 21/9` | Same as S. The room column is wide, so all 6 panels show. |
| **P: portrait / narrow** | not `heroSplit`, width ≥ 600 | `.hero` is `100svh` and stacked: copy, then the **depth band** filling the remaining height (`flex:1 1 auto; min-height:240px; max-height:520px`). |
| **M: phone** | width < 600 | Stacked and `min-height:auto`: copy, then a depth band of `clamp(220px, 34svh, 320px)` that peeks into the first viewport. |
| **L-phone** | landscape and `max-height:499px` | Copy only, `min-height:auto`. The depth band is `display:none`. |

### 2.2 Copy column (`app/hero.css`, `components/sections/Hero.tsx`)

```css
.hero {
  --hero-copy-w: clamp(27.5rem, calc(var(--fs-hero) * 7.6), 58rem);
  --hero-gap-x: clamp(32px, 3.5vw, 96px);
  --copy-l: calc((100vw - min(100vw, var(--content-max))) / 2 + var(--gutter));
  --copy-r: calc(var(--copy-l) + var(--hero-copy-w));
  position: relative; overflow: clip;
}
.hero-copy-inner { inline-size: var(--hero-copy-w); max-inline-size: 100%; }
.hero-title { font-size: var(--fs-hero); line-height: 1.04; margin: var(--sp-fluid-s) 0 0; text-wrap: balance; }
.hero-lede  { font-size: var(--fs-lede); margin-top: calc(var(--sp-fluid-s) * .75); max-width: 46ch; }
.moments    { margin-top: var(--sp-fluid-s); }
.hero-cta   { margin-top: var(--sp-fluid-s); }
```

- **Three-line H1 by construction.** "intelligence for" measures 7.09em in Poppins 600 at −0.03em (measured: 454px at 64px). A box of 7.6em always breaks as "We engineer / intelligence for / the real world." It cannot reach 4 lines (needs < 7.1em) or 2 lines (needs ≥ 12.4em). Remove `max-width: 18ch` from `.hero-title` in the `max-width:1279px` block.
- Resolved copy widths: 1024 → 440 · 1280 → 440 · 1366 → 480 · 1536×730 → 534 · 1920×937 → 685 · 2560 → 912. In tiers P and M the width is `100%` of the container.
- **S-short** (`@media (max-height:700px)` inside `heroSplit`):
  - `.moment { padding: 10px 12px 8px 0 }`, giving a 59px row.
  - `.hero-cta .btn { height: 44px }`.
  - `.hero-eyebrow` gets a margin of `--sp-fluid-xs`.
- **Phones:**
  - Moments stay 2×2.
  - `.hero-cta .btn { flex: 1 1 100% }`.
  - On `max-height:600px` phones, `.moment` padding drops to `8px 8px 6px 0`.
- **Vertical placement (S):**
  - `.hero { display:grid; grid-template-columns: 1fr; align-items:center; padding-block: calc(var(--header-h) + 16px) 24px; height:100svh }`.
  - The copy block is centred in the space below the header.
- Delete the old `@media (min-height:860px)` and `@media (max-height:800px)` blocks. `--u` replaces both.
- **Height budget, all within 100svh:**

  | Viewport | Hero content | Viewport | Spare |
  |---|---|---|---|
  | 1024×560 | 502 | 560 | 58 |
  | 1280×601 | 521 | 601 | 80 |
  | 1366×657 | 546 | 657 | 111 |
  | 1920×937 | 846 | 937 | 91 |

  Below 500px tall the hero is no longer forced to fit (L-phone).
- Mandated copy is unchanged. The H1 is never animated. The lede, moments and CTA keep the existing 8px/420ms settle.

### 2.3 Layered room (S tiers): background, midground, foreground

**DOM and CSS**

- `.hero-room { position:absolute; inset:0; z-index:0; }`. Remove the `-22%` bleed and the left mask: the canvas is now exactly the hero box.
- The **room column** is the area where panels may project:

  | Edge | Value |
  |---|---|
  | `l` | `copy right + --hero-gap-x` |
  | `r` | `vw − clamp(16px, 2vw, 48px)` |
  | `t` | `--header-h + 16` |
  | `b` | `hero height − 24` |

- `Hero.tsx` measures `.hero` and `.hero-copy-inner` with a ResizeObserver. It writes `--room-l` (px) onto `.hero` and passes `frame={{l,t,r,b}}` (canvas px) to `<Room>`.
- The scrim guarantees text contrast instead of hoping for it:

```css
.hero::before { /* replaces the 100deg gradient */
  background: linear-gradient(90deg,
    var(--surface-page) 0,
    var(--surface-page) calc(var(--room-l, var(--copy-r)) - var(--hero-gap-x)),
    color-mix(in srgb, var(--surface-page) 55%, transparent) calc(var(--room-l, var(--copy-r)) - var(--hero-gap-x) / 2),
    transparent calc(var(--room-l, var(--copy-r)) + 3vw));
}
.hero::after { height: 22%; } /* bottom fade into the gallery, unchanged otherwise */
```

**Depth layers (one canvas)**

| Layer | z (world) | Content | Treatment |
|---|---|---|---|
| **Background** | −16 … −40 | Fog. Isometric lattice floor (replaces `gridHelper`): a plane with ±30° hairlines, 2-unit cell, `#16405f` at α 0.35 fading to 0 by 60% of the depth. A back lattice wall at z=−30, α 0.05. The far panel. | Full-bleed and passes under the scrim. Fog `near = 1.1·dist`, `far = 2.6·dist` (today 34/78 at dist 29.6). |
| **Midground** | −6 | 3 mid panels (2 when the column is under 560px wide) | Haze ramp as today (`hazeAt`). |
| **Foreground** | +2 | 2 near panels at full legibility | No haze. Light-UI scrim stays at 0.42. |
| **Foreground DOM** | above canvas, below copy | `.room-callout` ×2: mono 11px provenance plus product, e.g. "Yisbir · Design concept · sample data". Anchored to each near panel's top-left projected corner. | `aria-hidden`. Positioned by `useFrame` writing `style.transform` on refs, with no React state per frame. Hidden until ready. They give the hero's real screens their provenance label (plan/13 §E1). |

- Panel set: if the column is under 560px wide, drop `wall-08-mandoobee-app` and the far panel, leaving 4 panels. Otherwise use all 6.
- DPR is `[1, 1.5]`, down from 1.75, to match the WebGL skill cap.

### 2.4 Camera framed from the column (replaces the fixed `CAMERA_POS` + fov 42)

Add `fitRoom()` as a pure function in `components/room/room-layout.ts` so it can be tested in node. A reference implementation is `C:/Users/abhin/AppData/Local/Temp/mrn/r2l/frame.mjs`.

```ts
export function fitRoom(W:number, H:number, col:{l:number;t:number;r:number;b:number}, panels:Panel[]) {
  const cw = col.r - col.l, ch = col.b - col.t, ca = cw / ch;
  const fov = clamp(30, 40 / Math.pow(ca, 0.35), 46);          // tall column → wider fov
  const xc = (col.l + col.r) / 2, yc = (col.t + col.b) / 2;
  const fullW = 2 * Math.max(xc, W - xc), offX = xc >= W / 2 ? 0 : fullW - W;
  const fullH = 2 * Math.max(yc, H - yc), offY = yc >= H / 2 ? 0 : fullH - H;
  const dir = normalize(CAMERA_POS − LOOK_AT);                  // keep today's elevated view angle
  let target = aabbCentre(panelCorners(panels));
  // 6 passes: bisect distance d∈[8,200] so every panel corner projects inside the column
  // with a 6% inset; then shift target in the camera plane by the bbox-centre pixel error
  //   (target += right·ex·k − up·ey·k, k = 2·d·tan(fov/2)/fullH); final bisect.
  return { fov, aspect: fullW / fullH, viewOffset: [fullW, fullH, offX, offY, W, H], position, target, dist };
}
```

**R3F wiring**

- `<Canvas camera={{ manual: true, fov: 40, near: 1, far: 200 }}>`.
- A `<Framing frame panels/>` component runs `useLayoutEffect([size.width, size.height, frame])`. It sets `camera.fov` and `camera.aspect = fullW/fullH`, calls `camera.setViewOffset(...)`, sets position and `lookAt(target)`, calls `updateProjectionMatrix()` and then `invalidate()`.
- `CameraRig` orbits around `target` at ≤ 4° yaw and ≤ 1.8° pitch, with the same damping as today, and keeps the view offset.

**Expected results.** Bbox is in viewport px. The near-panel width is the smaller of the two.

| Viewport | Column (l–r × t–b) | Panels | fov | dist | Projected bbox | Near panel (today) |
|---|---|---|---|---|---|---|
| 1024×560 | 517–1004 × 72–536 | 4 | 39.3 | 27.7 | 546,173 → 974,435 | 229 (no 3D today) |
| 1280×601 | 533–1254 × 72–577 | 6 | 35.3 | 33.3 | 649,102 → 1138,547 | 259 (249, clipped 77) |
| 1366×657 | 618–1339 × 72–633 | 6 | 36.6 | 31.3 | 704,106 → 1253,599 | 295 (249, clipped 69) |
| 1536×730 | 714–1505 × 78–706 | 6 | 36.9 | 30.9 | 801,116 → 1418,668 | 333 (270, clipped 69) |
| 1920×937 | 1020–1882 × 88–913 | 6 | 39.4 | 30.1 | 1072,163 → 1830,838 | 412 (346, clipped 93) |
| 2560×1440 | 1550–2512 × 88–1416 | 6 | 44.8 | 34.2 | 1607,365 → 2454,1139 | 447 (532, clipped 179) |
| 3440×1440 | 1996–3392 × 88–1416 | 6 | 39.3 | 28.4 | 2080,212 → 3308,1292 | 677 |
| 1024×768 | 517–1004 × 72–744 | 4 | 44.8 | 32.1 | 546,276 → 974,540 | 224 |

No panel crosses the copy column or a viewport edge at any size. When the column is under 440px wide or under 380px tall, `RoomClient` uses the depth stack (2.5) instead of WebGL.

**Mode choice (`RoomClient.tsx`)**

| Condition | Mode |
|---|---|
| `roomWebgl`, not `lowPower()`, `hasWebGL()`, column ≥ 440×380 | `webgl` |
| Any of those fails, or context loss | `depth` |

Delete the `poster` and `collage` modes. `RoomFallback`'s hand-placed `FALLBACK_POS` belonged to the old bleed box, so it becomes the column-scoped depth stack.

### 2.5 Depth stack: CSS 3D for tiers P, M and no-WebGL S (new `components/room/RoomDepth.tsx`, replaces `RoomPoster`)

```html
<div class="hero-depth" aria-hidden="true">       <!-- perspective: 1100px; container-type: size -->
  <div class="hd-back"><LatticeField/></div>       <!-- translateZ(-120px) scale(1.12) -->
  <figure class="hd-mid">  yisbirFireSmokePoster (71 KB) </figure>        <!-- 86% wide, rotateY(-12deg) rotateX(5deg) -->
  <figure class="hd-front"> wall-01 PPE, 600w crop ≤30 KB </figure>      <!-- 44% wide, bottom-left, translateZ(60px), shadow-room -->
  <p class="hd-prov"><ProvenanceLabel>Design concept · sample data</ProvenanceLabel></p>
</div>
```

- Both screens are Yisbir design concepts, so one combined provenance label covers them.
- `-600.webp` is a downscale of the existing reviewed file, which keeps the 120 KB hero-poster budget: 71 + ≤30.
- In the S tier with no WebGL, the stack fills the room column (`left: var(--room-l)`). In P and M it is the band.
- `.hd-mid` width is `min(86cqw, 85cqh * 1.6)`, so the main screen is about 607×380 at 768×1024 and about 300×188 at 390.

### 2.6 Hero motion (GSAP only, inside `gsap.matchMedia`)

| id | Purpose | Trigger and range | Movement | Reduced motion |
|---|---|---|---|---|
| **M-home-hero-01** entrance | The room assembles out of the haze, one depth layer at a time, without gating copy. | First texture ready, once. | Floor/wall opacity 0→1 over 0–600ms. Far row settles (z −2.2→0) at 200ms, mid at 320ms, near at 440ms (ease-out cubic, 900ms each). Callouts opacity and y 6→0 at 900ms. **Total ≤ 1.4s. H1 static.** | Final state, `frameloop="demand"`. |
| **M-home-hero-02** pointer parallax | Depth reads from relative motion. | `(hover:hover)` only. | Orbit ≤ 4°. Near layers move most because of real perspective. Callouts follow their projected anchors. | Off. |
| **M-home-hero-03** scroll exit | Hand off into the gallery by flying through the room. | `.hero`, `start:"top top"`, `end:"bottom top"`, `scrub:0.5`, **no pin**. | `Room.setProgress(p)`: dist → 0.72·dist, target x +2, near panels yaw ±8° outward, canvas opacity 1→0.5, callouts fade out by p=0.3. Copy is never transformed. | Off. |
| **M-home-hero-04** foreground hand-off (S tier) | The gallery slides over the hero like a foreground sheet. | Natural scroll. | Wrap the hero in `<div class="hero-stage">` with `height: calc(100svh + 40svh)`. Then `.hero { position: sticky; top: 0 }` and `.showcase { margin-top: -40svh; position: relative; z-index: 2; background: linear-gradient(to bottom, transparent, var(--surface-page) 120px) }`. This is a sticky stage, not a hard pin. | No sticky, `margin-top:0`. |
| **M-home-hero-05** depth band (P, M) | Same layered idea on phones, at no GPU cost. | CSS `@supports (animation-timeline: view())` and no-preference. `view()` on `.hero-depth`, range `exit 0% exit 100%`. | `.hd-back` y 0→+12px, `.hd-mid` 0→−16px, `.hd-front` 0→−40px. `.hd-front` also has a one-shot entrance: x 24→0, 420ms, 200ms delay. | Static. |

- `Room` exposes `setProgress` through a ref and never reads scroll itself (scroll-choreography rule 2).
- GSAP keeps loading only in tier S. Phones still never download it for the homepage.

---

## 3. Gallery: horizontal at every size, cards fit the viewport

### 3.1 Modes (`Showcase.tsx`)

| Mode | Condition | Mechanism |
|---|---|---|
| **pinned** | `MQ.pinned`: ≥1024 wide, ≥560 tall, fine pointer, motion allowed | Same GSAP pin. `end: +=2.5·innerHeight` (DD-23: ≤250vh; homepage total ≤300vh because M-hero-03/04 are not hard pins). Same settle logic and focus sync. |
| **rail** | everything else: touch at any size, reduced motion, short or narrow | Native `scroll-snap-type: x mandatory` with prev/next buttons, the "1 / 6" counter (`aria-live=polite`), and the hint above the rail. |

Both modes are horizontal and use the same card geometry. **No card is ever taller than the viewport** (except L-phone, see 3.4).

### 3.2 Card geometry (`app/showcase.css`)

```css
.showcase {
  --sc-controls-h: 56px;
  --sc-pad-y: clamp(8px, 2svh, 24px);
  --card-h: min(calc(100svh - var(--header-h) - var(--sc-controls-h) - 2 * var(--sc-pad-y)), 900px);
  --card-w: min(calc(var(--card-h) * 2.05), 86vw, 1600px);
  --gap: clamp(16px, 2vw, 32px);
}
.sc-panel { flex: 0 0 var(--card-w); inline-size: var(--card-w); block-size: var(--card-h);
            container: card / size; }                 /* size containment: both axes are explicit */
.sc-track { padding-inline: calc((100vw - var(--card-w)) / 2); }           /* both modes: card 1 centred */
.showcase.is-rail .sc-track { scroll-padding-inline: calc((100vw - var(--card-w)) / 2); }
.showcase.is-pinned .sc-pin { height: 100svh; display: grid; align-content: center;
                              padding-block: calc(var(--header-h) + var(--sc-pad-y)) 0; }
.showcase.is-pinned .sc-card, .showcase.is-rail .sc-card { height: 100%; }
@media (max-width: 599px) { .showcase { --card-w: calc(100vw - 60px); --sc-controls-h: 52px; } }
```

In the table, P means portrait.

| Viewport | Mode | Card w×h | Variant |
|---|---|---|---|
| 1024×560 (mouse) | pinned | 873×426 | tight |
| 1280×601 | pinned | 953×465 | tight |
| 1366×657 | pinned | 1064×519 | compact |
| 1536×730 | pinned | 1195×583 | compact |
| 1920×937 | pinned | 1580×771 (was 1120×693) | regular |
| 2560×1440 | pinned | 1600×900 | regular |
| 1024×768 (touch) | rail | 880×626 | regular |
| 768×1024 | rail | 660×860 (P) | stacked |
| 390×844 | rail | 330×712 (Safari, toolbars shown: ~532) | stacked |

Remove the old `--cw` and the `max-width:1023px` single-column rule. Container queries replace them.

### 3.3 Card variants (container queries on `card`)

| Variant | Query | Layout |
|---|---|---|
| **regular** | `min-height:600px` and `min-width:760px` | `grid-template-columns: 5fr 7fr`, padding `clamp(24px,4cqh,48px)`. Name uses `--fs-sc-name`. All copy rows. Proof chip and second screen (L3) shown. |
| **compact** | `(480px ≤ h < 600px)` and `min-width:760px` | Padding 24px. Gaps 12px. Name `clamp(1.75rem, 6cqh, 2.5rem)`. Capabilities at 15px with a 4px gap. Deploys becomes one inline row (`dt` inline: "DEPLOYS · On-premise, cloud or hybrid"). Actions in one row. Proof chip shown, second screen hidden. |
| **tight** | `max-height:479px` and `min-width:760px` | Index folds into the name row ("01" in mono before the name). Capabilities become 3 inline chips (≤2 rows). Deploys inline. Proof chip hidden. |
| **stacked** | `max-width:759px` | `grid-template-rows: minmax(120px, 1fr) auto`. **The media row absorbs the leftover height**, with `img { max-height:100%; width:auto; object-fit:contain }`. Copy below. Padding 20px. Name 1.75rem. Capabilities at 14px. Primary button full width with "Explore →" under it. On `max-height:559px` the Deploys row hides; it is on every product page. |

- Media in landscape variants: `.sc-shot img { max-height: calc(var(--card-h) - 2 * pad - 28px); width:auto; max-width:100%; object-fit:contain }`.
- Screens are never upscaled past intrinsic size (ScreenFrame `max-width`).
- **Rule:** every `.sc-copy` has `scrollHeight ≤ clientHeight` at every size in section 6. Text is never truncated with line-clamp, because the copy is verbatim.

### 3.4 Exceptions

- **L-phone** (`max-height:499px`, landscape): `--card-h:auto`, side-by-side card (media 40%, copy 60%). The vertical overflow here is accepted and documented.
- **Under 320px wide:** reflow per WCAG 1.4.10. The rail stays inside its own scroller, so there is no page-level horizontal scroll.

### 3.5 Layered "3D" card: separate background, midground and foreground

```html
<li class="sc-panel"><div class="sc-card">
  <div class="sc-bg" aria-hidden="true"></div>   <!-- L0: accent light-pool + blueprint hairline frame with corner ticks -->
  <div class="sc-copy">…verbatim copy…</div>     <!-- L2: solid surface, moves only with the card -->
  <div class="sc-media">                         <!-- L1 -->
    <ScreenFrame shot class="sc-shot"/>
    <ScreenFrame shot2 class="sc-shot2"/>          <!-- L3 front: 38% of media width, overlaps bottom-left by 18% -->
    <p class="sc-proof">…</p>                       <!-- L3 front chip: solid --surface-raised, top-right -->
  </div>
</div></li>
```

- The stage keeps its **one** `LatticeField` (plan/09 §6: at most one lattice per viewport), static and farthest back.
- `.sc-bg` must **not** be a lattice. It is `radial-gradient(60% 55% at 70% 45%, color-mix(var(--p-accent) 14%, transparent), transparent 70%)` plus a 1px inset frame (`inset:12px; border:1px solid color-mix(var(--p-accent) 22%, transparent)`) with 8px corner ticks.

**Per-card progress `c`:** −1 is one step right, 0 is centred, +1 is one step left. Offsets are zero at c=0, so text never moves while it is being read.

| Layer | Transform at c | Notes |
|---|---|---|
| card (neighbours) | `scale(1 − .06·|c|)`, `rotateY(−5°·c)`, perspective 1600px, opacity `max(.35, 1 − .65·|c|)` | DD-23 floor 0.35. Neighbours stay `inert`. |
| L0 `.sc-bg` | `translateX(+18%·c)` | Lags, so it reads as far. |
| L1 `.sc-media` | `rotateY(6°·c) translateX(−4%·c)` (perspective 1400px) | |
| L3 `.sc-shot2`, `.sc-proof` | `translateX(−12%·c)` | Leads, so it reads as near. |

- **Pinned:** GSAP. In the existing `onUpdate`, compute `c_i = progress·(N−1) − i`, clamp to [−1.5, 1.5], and apply it with `gsap.quickSetter` per layer. `will-change` is set only while pinned.
- **Rail:** CSS only, never GSAP on the same elements:

```css
@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {
  .showcase.is-rail .sc-panel { view-timeline: --sc inline; }
  .showcase.is-rail .sc-bg    { animation: sc-bg linear both;    animation-timeline: --sc; }
  .showcase.is-rail .sc-media { animation: sc-media linear both; animation-timeline: --sc; }
  .showcase.is-rail .sc-shot2, .showcase.is-rail .sc-proof { animation: sc-front linear both; animation-timeline: --sc; }
}}
@keyframes sc-bg    { from { transform: translateX(-18%) } 50% { transform: none } to { transform: translateX(18%) } }
@keyframes sc-media { from { transform: perspective(1400px) rotateY(-6deg) translateX(4%) } 50% { transform: none }
                      to   { transform: perspective(1400px) rotateY(6deg) translateX(-4%) } }
@keyframes sc-front { from { transform: translateX(12%) } 50% { transform: none } to { transform: translateX(-12%) } }
```

- **M-home-gallery-03, arrival accent:** when the settle tween completes (pinned) or the counter changes (rail), add `.is-arrived` for 700ms. `.sc-bg` opacity goes .55→1 (420ms). `.sc-shot2` and `.sc-proof` go y 10px→0 (420ms, 80ms delay). Reduced motion: no class, everything at its final state.
- **Reduced motion:** rail mode, all opacity 1, computed transform `none` on all layers.

### 3.6 Section header and controls at short heights

- `.sc-head { padding-block: var(--sp-fluid-l) var(--sp-fluid-s); }` gives about 61/23px at 1366×657 instead of 64/24. Remove the `max-width:767px` override.
- `.sc-head`, `.sc-hint` and `.sc-controls` share the container's left edge. Fix the 91 vs 48 misalignment by putting the rail's first-card offset on the track, not on the container.
- `.sc-controls`: in pinned mode it is absolute at the bottom with height `var(--sc-controls-h)`. In rail mode it sits directly under the track.
- At ≥1024 add a **product name strip**: 6 `<button>`s in the controls row, `aria-label="Show {name}"`, `aria-pressed` on the current one. They call `go(i)`. This is navigation, not new content. Hidden below 1024; the counter is enough there.

---

## 4. Scenario, world, CTA and footer at short heights

### 4.1 Scenario (`components/sections/Scenario.tsx`, `app/sections.css`)

- `.section { padding-block: var(--section-py); }`. `.how-grid { margin-top: var(--sp-fluid-m); gap: var(--sp-fluid-l); }`.
- At ≥1024:
  - `.how-step { min-height: max(160px, 28svh); }` (was 30svh).
  - `.how-sticky { top: calc(var(--header-h) + 12px); height: calc(100svh - var(--header-h) - 24px); }`.
  - `.how-shot img { max-height: calc(100svh - var(--header-h) - 64px); width:auto; max-width:100%; object-fit:contain; }`.
- **No empty stage.** Change `SHOWN` so step 01 shows step 02's screen (`SHOWN[0] = 1`) in a `.is-pre` state: a `::after` overlay of `--surface-page` at 55% opacity, faded by opacity only (no animated filter). Its provenance label stays visible. This adds no new copy.
- Below 1024: `.how-inline .screen img { max-height: 42svh; width:auto }`.
- Width breakpoint for the two-column layout stays at 1024.

### 4.2 World (`Sections.tsx`, `app/sections.css`, `app/ui.css`)

- `.world-grid` goes two-column at **≥1024** (was ≥1280): `minmax(0,1fr) minmax(0,1.6fr)`, gap `--sp-fluid-m`.
- `.partners`: 3 columns at ≥1024, 2 at ≥600, 1 below.
- Target at 1366×657: header plus the Offices/Recognition grid ≤ 470px, so they read together in one viewport.

### 4.3 CTA

- `.cta { padding-block: clamp(56px, calc(9 * var(--u)), 160px) clamp(48px, calc(7 * var(--u)), 128px); }`.
- `.cta .t-display { font-size: var(--fs-display); max-width: 18ch; }`.
- **Rule:** the headline and both actions fit inside `100svh − header` at every size from 1024×560 up. At 1366×657 the block is about 444px.

### 4.4 Footer (`app/ui.css`)

- `.site-footer { padding-block: clamp(40px, calc(5 * var(--u)), 64px) clamp(20px, calc(2.5 * var(--u)), 32px); }`
- `.footer-base { margin-top: clamp(24px, calc(4 * var(--u)), 64px); }`
- `.footer-logo { width: clamp(120px, calc(12 * var(--u)), 168px); }`
- Below 480px: `grid-template-columns: 1fr 1fr`, with brand and Products spanning both columns and Company/Legal side by side. Target phone footer ≤ 720px (842 today).

---

## 5. More verified content, without clutter

All of these are `ok-to-use`. Each new line carries its EV id in `content/*.ts`.

| Where | What | Evidence | Clutter control |
|---|---|---|---|
| Gallery L3 proof chip (one per card) | Mandoobee: "On the App Store and Google Play" | EV-420 | One chip per card. Shown in regular and compact only. |
| | Tasree3: "Three modules. One AI-native core." | EV-401 (verbatim) | |
| | Nazo: "14 AI actions, scoped by role" | EV-542 (5 + 4 + 5 actions) | |
| | Yisbir: "Audio transcription in 50+ languages" | EV-442 | Not about faces (DL-P07 applies to faces only). |
| | Wasel: "Cellular, Wi-Fi, Bluetooth or offline" | EV-103 | |
| | AI in a Box: **no chip** | EV-573 is use-with-edit and conditional on confirmation | Second screen only. |
| Gallery L3 second screen | Mandoobee `wall-08-mandoobee-app.webp` (1200×750, 24 KB, "App mock-up"). Add it to `content/media.ts`. | media registry | Regular variant only. Its own provenance label. |
| | Tasree3 `tasree3Conformance`, Yisbir `yisbirAlerts`, Wasel `waselPhoneToGate`, AI in a Box `aiboxContractReview` | content/media.ts | Nazo has no second screen and gets the chip only. |
| World, under Recognition: "In the news" | 5 links (outlet · date · headline, opening in a new tab): Dubai Media Office 2024-08-08 · FPT Software newsroom 2024-08-19 · Security MEA 2024-10-17 · Intelligent CISO 2025-02-13 · Entrepreneur ME 2023 (Future 100 profile). URLs come from `research/sources/company-web-research.md` §F. | EV-514, EV-202 | One ruled list of 5 rows. **Exclude** The EastAfrican (sponsored) and the Al Bayan 2024-05-10 headline (it carries an unverified "3000 programmers" figure). |
| World, after Recognition | "Featured by Dubai Chambers: *Dubai Dreamers* (video) ↗", as a link, not an embed | EV-022 | One line, no weight cost. |
| Hero | **Nothing.** Mandated copy only. "All six products" stays in the header router (IMPLEMENTATION-REPORT, not done). | | |

`ShowcasePanel` gains `proof?: { text: string; evidence: string }` and `shot2?: Screen`. `company.ts` gains `PRESS` (`{outlet, date, title, url, evidence}`).

---

## 6. Acceptance checks (`scripts/verify-landing.mjs`, Playwright, Chromium with swiftshader)

**Viewports:** 1024×560, 1280×601, 1366×657, 1440×789, 1536×730, 1536×864, 1920×937, 2560×1440, 3440×1440, 1024×768 (touch), 768×1024 (touch), 820×1180, 390×844 (mobile), 360×640, 320×568, 844×390. Run each once normally and once with `reducedMotion:'reduce'`.

**Every viewport:**

1. `documentElement.scrollWidth === innerWidth`.
2. axe: 0 serious or critical violations.
3. H1 is exactly 3 lines, and its `font-size` matches section 1.2 within ±1px.

**Hero:**

- **S tiers:** `.hero` height equals `innerHeight` (±1).
- **S, P and M at ≥360×640:** `.hero-cta` bottom ≤ `innerHeight − 16`.
- **320×568:** the first `.btn-primary` bottom ≤ `innerHeight`.
- **WebGL S:** `.hero-room[data-bbox]` (written by `Framing`) lies inside `[data-col]`, with `col.l ≥ copyRight + 24`, `bbox.r ≤ innerWidth − 8`, and near-panel width ≥ 0.30 × column width. Numbers match the 2.4 table within ±3%.
- **Scrim:** the pixel colour at (copyRight − 4, H1 centre y) equals `--surface-page` within ±3 per channel.
- **Network:** no `three` chunk request when portrait, below 1024 wide, or below 500 tall. Canvas `devicePixelRatio ≤ 1.5`.

**Gallery:**

- Mode is `is-pinned` exactly when `MQ.pinned` matches, otherwise `is-rail`.
- For all 6 cards: `.sc-card` height ≤ `innerHeight − header − 56`, and `.sc-copy` has `scrollHeight ≤ clientHeight` (L-phone excepted).
- With `#products .sc-pin` scrolled to the top, `.sc-controls` bottom ≤ `innerHeight`.
- **Pinned:** pin distance ≤ 2.5 × `innerHeight`. Tabbing to every card's CTA leaves `activeElement`'s rect fully inside the viewport with top ≥ `--header-h`.
- **Reduced motion:** no `.is-pinned`, every `.sc-panel` opacity is 1, and the computed transform of `.sc-bg`, `.sc-media` and `.sc-shot2` is `none`.

**Scenario:**

- At every IntersectionObserver step there is exactly one `.how-shot.is-shown` or `.is-pre`, so the stage is never empty.
- `.how-sticky` height ≤ `innerHeight − header`.

**CTA:** with `#contact` scrolled under the header, the h2 and `.cta-actions` bottom are ≤ `innerHeight`.

**Footer:** at 390×844, height ≤ 720px.

**Motion:**

- With reduced motion, the hero canvas reports `data-frameloop="demand"` with no camera change on pointer move.
- M-hero-04 is not applied (`.showcase` `margin-top` is 0).
- No element has an animated `filter`.

**Screenshots:** save hero, gallery card 1 and 3, scenario step 01, CTA and footer for every viewport into `docs/review/r2-landing/` for human sign-off.

---

## 7. Files to change

| File | Change |
|---|---|
| `lib/breakpoints.ts` | `PIN_MIN_HEIGHT=560`, `MQ.heroSplit`, `MQ.roomWebgl`, `MQ.short`, new `MQ.pinned`. Update the header comment. |
| `app/tokens.css` | `--u`, fluid type and space tokens, `--header-h`, `--content-max`, orientation overrides (1.1). |
| `app/globals.css` | `.t-display`, `.t-h2` and `.t-lede` read the new tokens. |
| `app/hero.css` | Section 2 in full. Delete the old height patches, the `-22%` bleed, the room-poster rules and the 1279px restacking. |
| `components/sections/Hero.tsx` | `.hero-stage` wrapper, ResizeObserver → `--room-l` and `frame`, GSAP `matchMedia` for M-hero-03/04. |
| `components/room/room-layout.ts` | `fitRoom()`, `panelCorners()`, `panelsForColumn(width)`. |
| `components/room/Room.tsx` | Manual camera and `<Framing>`, lattice floor shader, `setProgress` ref, `RoomCallouts`, DPR 1.5, fog derived from distance. |
| `components/room/RoomClient.tsx` | Modes `pending \| webgl \| depth`, using the column checks in 2.4. |
| `components/room/RoomDepth.tsx` | New. Replaces `RoomPoster`. `RoomFallback` becomes this. |
| `public/media/v3/wall-01-yisbir-ppe-compliance-600.webp` | Downscale of the existing reviewed file, ≤30 KB. |
| `components/sections/Showcase.tsx` | Layered markup, layer quickSetters in pinned mode, `.is-arrived`, name strip. |
| `app/showcase.css` | Section 3 in full. |
| `content/showcase.ts`, `content/media.ts` | `proof`, `shot2`, `mandoobeeApp` entry. |
| `components/sections/Scenario.tsx`, `app/sections.css` | Section 4.1, plus World and CTA spacing. |
| `components/sections/Sections.tsx`, `content/company.ts` | World grid at ≥1024, `PRESS`, Dubai Chambers link. |
| `app/ui.css`, `app/header.css` | Footer and header at short heights. |
| `scripts/verify-landing.mjs` | Section 6. |

**Decisions to log** (`plan/decision-log`, `docs/IMPLEMENTATION-REPORT`):

- **DD-23 amended:** the pin opens at ≥1024×560 with a fine pointer, instead of ≥1280×760. The length cap stays at ≤250vh.
- **Net-content rule superseded** by the client's request for more content, limited to the verified items in section 5.
- **`--content-max` grows above 1778px** on all routes.
- **The skill's 150vh hard-pin cap vs DD-23's 250vh:** DD-23 governs, and the homepage total stays ≤300vh.
- **Owner flag unchanged:** "Intelligence Layer" is marked do-not-use in EV-473 but is still mandated copy.