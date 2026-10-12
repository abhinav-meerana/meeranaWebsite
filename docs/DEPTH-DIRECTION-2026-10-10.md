# Depth direction — M4 (2026-10-10)

**Why this document exists:** the previous assessment found the page read "plain
and lifeless". This records the diagnosis, the direction chosen, and the exact
values used, so the depth work is reviewable and repeatable rather than a matter
of taste.

---

## 1. The diagnosis, measured

Flatness had a single measurable cause, and it was not a shortage of effects.

```css
/* prototypes/meerana-m3-intelligent-ecosystem.html */
body { background: var(--surface-page); }
```

A single flat navy fill. Measured across the whole built page:

| Technique | Count before |
|---|---|
| `feTurbulence` / noise / grain | **0** |
| vignette | **0** |
| `mask-image` edge fades | **0** |
| `mix-blend-mode` | **0** |
| `oklch` / `lch` | **0** |
| `radial-gradient` | 2 |

The wall was flat for a *separate* reason. `.wall-plane` did carry
`rotateX(22deg) rotateY(-26deg) rotateZ(5deg)`, but every `.wall-tile` sat at an
**identical Z on that one plane**:

```css
.wall-tile:hover { transform: translateZ(28px); }   /* 3D only on hover */
```

So a far tile was exactly as crisp, bright and saturated as a near one. That is a
tilted poster wall, not a space.

**The generalisable lesson:** flatness on a dark page is a *large-scale luminance
non-uniformity* failure, not a texture failure. No amount of grain rescues a
single flat field.

---

## 2. The direction

> Design this as a **dark enterprise homepage** for **technical and government
> buyers in the UAE**, using a **cinematic but restrained** language, centred on
> **one isometric room that gives the product screens real depth**.

The explicit constraint, from the research: the techniques that make dark sites
look like AI slop fail in the same three ways — **saturation, speed, and
full-screen brightness**. So every value below is calibrated against those three,
and grain never exceeds 6%.

The one test applied throughout: *is this a lighting or texture decision, or is
it a decoration added to look busy?* Only the former was kept.

---

## 3. The grade stack

Five layers, painted bottom to top. Each has one job.

| # | Layer | Where | Values | Job |
|---|---|---|---|---|
| 1 | Base surface | `body` background-color | `#071b36` | the page's own colour |
| 2 | Atmospheric mesh | `body` background-image | 4 radials, 5–14% alpha | **fixes the flatness** |
| 3 | Hairline grid | `.grade-overlay` | 3.5% line, 56px cell, radially masked | engineered structure |
| 4 | Vignette | `.vignette-overlay` | clear at 45%, `rgba(2,6,12,.55)` at edge | corners recede |
| 5 | Film grain | `.grain-overlay` | baked tile, 4.5%, `overlay` | kills banding, adds tactility |

Layer 2 does the real work. It is painted as **pure gradients, not blurred divs**:
gradient falloff is infinitely soft and costs nothing, while a blurred div costs a
full-radius blur pass at every frame.

All four radial stops sit inside a single hue family within roughly ±15° of brand
navy. Multi-hue meshes (cyan → magenta → purple) are the recognisable
"AI startup gradient" and were rejected deliberately.

---

## 4. Grain: baked, never live

`scripts/make-grain.mjs` generates the tile. It is dependency-free — PNG is
assembled by hand and compressed with `node:zlib`.

| Decision | Value | Reason |
|---|---|---|
| Method | baked PNG tile | a live `feTurbulence` or shader grain is fill-rate bound at *every* viewport size: the worst possible cost model |
| Size | 128×128 | grain repetition is invisible at 4.5% opacity; 128 saves ~38 KB |
| Blur | 1 pass, wrapping | wrapping keeps the tile seamless; a non-wrapping blur darkens the borders into a visible grid |
| Centring | mid-grey (128) | `overlay` then pushes symmetrically — darker and lighter |
| Opacity | 0.045 | research range 0.03–0.06; above 0.08 reads as a dirty screen |
| Blend | `overlay` | breaks banding on near-black ramps without greying the page |

---

## 5. The room: three depth cues

The wall was replaced by an isometric room of 7 floating panels. Depth is not
implied by a transform — it is produced by three separate mechanisms:

1. **Genuine Z scatter** (`z` from `2.0` to `−16.0`) — perspective makes far
   panels physically smaller.
2. **Haze by depth** — `hazeAt(z)` drives both saturation and opacity of the
   material:
   ```ts
   color:  new THREE.Color().setHSL(0.58, 0.36 * haze, 1 - 0.30 * haze),
   opacity: 1 - 0.20 * haze,
   ```
   **This is the cue a CSS transform can never produce**, and it is the single
   biggest reason the old wall read as pasted screenshots.
3. **Light response** — one key `directionalLight` with cast shadows onto a real
   floor plane, plus a cyan rim light.

Plus:

- **Resting scrim** on light-coloured UI (42% colour reduction). A mostly-white
  dashboard would otherwise outshine the H1. Nothing on the page is allowed to be
  brighter than the headline.
- **Contact shadows** and a drafting `gridHelper`, which tie the room to the
  logo's isometric lattice and give perspective something to measure against.
- **Pointer parallax capped at 4°** with frame-rate-independent exponential
  damping, so it feels identical at 60 Hz and 120 Hz.

### Composition

Panels form an ascending diagonal — near row low and left, far row high and
right. **Seven panels, deliberately**: ten overlapped into a clump and read as
clutter. The depth cue only works when the eye can see separation between rows.

---

## 6. The legibility contract

Depth must never cost contrast. Product screenshots are mostly bright, so an
unprotected headline over them would fail AA.

- The copy column is protected by a **directional scrim** that is fully opaque
  across the text and falls away by 78% of the width.
- The room is `aria-hidden` and `pointer-events: none` — decoration, always.
- **Section headings are never wrapped in a scroll reveal.** A heading at
  `opacity: 0` until an animation completes is content that exists only in
  animation, which `plan/13 §C2` forbids — and it fails in the worst way, by
  simply not being there. This was caught in review: the "Meerana Intelligence
  Layer" `<h2>` was rendering invisible.

---

## 7. Failure modes, handled

| Condition | Behaviour |
|---|---|
| `prefers-reduced-motion: reduce` | room renders static final state, `frameloop="demand"` so it costs nothing; grain and grid still paint |
| `prefers-reduced-transparency: reduce` | grain, grid and atmospheric mesh removed entirely |
| **No WebGL** | capability probe, then `RoomFallback` — the same 7 panels as real `<img>` in a CSS-composed diagonal with blur, scale and opacity standing in for depth |
| WebGL context lost mid-session | `RoomBoundary` catches the throw and swaps in the same fallback |
| Slow GPU | `PerformanceMonitor` → `AdaptiveDpr`, resolution drops before frame rate does |
| No JS | hero copy, products, story, proof and footer are all in the static HTML |

The no-WebGL path was a real bug found in testing: before `RoomBoundary`, a
machine that could not create a context rendered **"This page couldn't load"** —
the whole document went with it.

---

## 8. Motion budget

| Property | Value |
|---|---|
| Pointer parallax ceiling | 4° |
| Ambient drift | 0.05 rad/s, ±0.05 world units |
| Entrance | one reveal per panel, cubic ease-out, never loops |
| Section reveals | one per element, `IntersectionObserver`-gated |
| Logo strip | 34 s loop, pauses on hover |
| Ease tokens | `cubic-bezier(0.2, 0, 0, 1)` standard; no second easing family |

Research discipline applied: only `transform` and `opacity` are animated, offloaded
to the GPU, with `IntersectionObserver` gating so off-screen work stops.

---

## 9. What was deliberately rejected

| Rejected | Why |
|---|---|
| Aurora drift, multi-hue mesh | full-spectrum gradients are the signature of AI-startup sameness |
| Volumetric light beams | one beam can be gorgeous; more than one is a sci-fi game menu |
| Chromatic aberration | the technique is literally framed as a *glitch* effect; it reads erroneous, not premium |
| Bloom / HDR glow | the fastest route to "gamer" on a dark surface |
| Animated colour cycling | saturation + speed is the failure mode this whole document avoids |
| Live shader grain | worst possible performance model; bake it |
| Animated caustics | expensive and decorative; no informational job |
| React Bits' loud shader components (Balatro, Hyperspeed, Ballpit, LetterGlitch, PixelBlast) | each one's own description reads as spectacle; excluded by name |

---

## 10. Verified outcome

| Check | Result |
|---|---|
| `npm run build` | static export, 3/3 pages |
| Screenshots 1440 / 1280 / 1024 / 390 | all captured, no overflow at any width |
| Console errors | **0** in every mode including no-WebGL |
| `<h1>` count | 1 |
| Images missing `alt` outside `aria-hidden` | **0** |
| Reduced motion | complete, static page |
| No WebGL | complete page, composed fallback, 0 errors |
| Page length | 5,732 px at 1440×900 ≈ **6.4 screens** (target ≤ 11) |
