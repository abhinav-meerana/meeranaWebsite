# Hero dashboard wall — spec

**Date:** 2026-10-10 · **Status:** spike done, ready to port into M3 · **Owner directive:** "on the landing page, on the right side, bring the dashboards and screenshots, which is scrollable, with 3d view"

| | |
|---|---|
| Spike (open in Chrome) | `prototypes/_hero-wall-spike.html` (sits in `prototypes/` so `media/m3/*.webp` resolves) |
| Screenshots | `docs/review/m3-2026-10-10/hero-wall/` (list in §2.3) |
| Wasel illustrations as files | `hero-wall/wall-wasel-gate-access.svg`, `hero-wall/wall-wasel-phone-to-gate.svg` (copy into `media/m3/v3/`) |
| QA hashes | `#noauto` (no autoplay) · `#qa=ai\|auto\|iot\|sec` (moment, instant) · `#comp=lay\|iso\|tilt` · `#rx=…&ry=…&rz=…&persp=…&tile=…&gap=…&cols=…` · `#phase=0..1` · `#noguard` |
| Code in this file | §11, copied verbatim from the spike between its `HERO WALL … BEGIN/END` markers |

---

## 1. What was built

The hero keeps the M3 left column. It has the eyebrow "Meerana Technologies · Dubai, UAE", the H1 "We engineer intelligence for the real world." (72 px, Poppins 300), a one-line lede, two CTAs, and the four moments AI → Automation → IoT → Security as a ruled row. The right side, from grid column 7 to the viewport edge, holds a 3D wall of product screens:

- **13 solid 16:10 tiles in 4 columns** on one tilted plane. Columns run in alternating directions, loop without end and drift at 24 px/s. Page scroll nudges them.
- **Pointer use.** Hovering pauses the wall, and the hovered tile lifts and brightens. A mouse or pen can drag to scrub the wall. The wheel is never captured. A click opens a lightbox.
- **Keyboard use.** The wall is one tab stop. Arrow keys move between tiles, a focused tile lifts with a cyan ring, and Enter opens the tile.
- **Moments API** `focusProduct('ai'|'auto'|'iot'|'sec'|null)`. Each column eases the product's nearest tile to its front line, and the other tiles dim to 35 %. The hero autoplay and the moment buttons both use it.
- **Below 1280 px.** Tablets get a full-width plane with two columns under the CTAs. Phones get one tilted strip that scrolls natively with scroll-snap.
- **Reduced motion or Pause motion.** The wall is static and focus changes are instant. A frame guard makes the wall static on machines that cannot composite (§7).
- **Surfaces.** Tiles are solid: navy-900 with a 1 px white-8 % hairline and a soft shadow. Nothing on the wall uses `backdrop-filter`. Glass stays on the floating nav only.

## 2. Composition

### 2.1 Decision: "lay" — a table-top plane, near-isometric

`rotateX(38deg) rotateY(-6deg) rotateZ(-24deg)`, perspective 2400 px, 4 columns, gap 26 px. Tile width is `clamp(300, 0.47 × stage width, 420)`: 300 px at 1280, ≈ 333 px at 1440 and 420 px at 1920. The plane centre sits at 56 % / 50 % of the stage and the "front" (focal point) at 42 % / 52 %. Under the tiles lies a faint fixed drafting grid (navy-800 at 70 %, quarter-tile pitch, radial fade), so the wall reads as an architectural model on a table rather than a screenshot collage.

| Preset | Transform | Vertical legibility (cos rx) | Verdict |
|---|---|---|---|
| **lay (chosen)** | rx 38, ry −6, rz −24, persp 2400 | 0.79 | KPI numbers, panel titles and BPMN shapes stay readable at tile size. The diagonal columns echo the brand's isometric grid without the squash. The long perspective keeps near and far tiles nearly the same size, so it reads calm and expensive and does not fight the H1. |
| iso (near-isometric) | rx 54, rz −38, persp 3600 | 0.59 | The strongest brand echo, but UI text is squashed to ~60 % height. At 333 px tiles the screens read as texture, not product, which defeats "bring the dashboards". |
| tilt (tilted showcase) | rx 20, ry −26, rz 6, persp 1500 | 0.94 | The most legible tile by tile, but it is the generic SaaS "tilted screenshot fan". Its strong perspective makes the near top-right tiles large and bright, and they compete with the H1. The columns are almost vertical, so there is no isometric echo. |

Both alternatives stay in the engine as presets (`#comp=iso`, `#comp=tilt`) for the owner to compare.

### 2.2 Craft details that carry the "premium" read

- **Light scrims.** A resting scrim (navy-950 at 20 %, 40 % for light UIs) keeps bright Tasree3 and Mandoobee screens from outshining the H1. Hover or front removes the scrim; a front light UI keeps 10 %.
- **Tile edges.** Two inner hairlines on every tile: a 1 px white-8 % border and a 1 px white-6 % top highlight. Hover raises them to 18 % and 10 %, front to 24 % and 12 %.
- **Hover tag.** On hover, focus or front, a mono tag fades in: product name, divider, provenance ("YISBIR | PRODUCT SCREEN · DEMO DATA").
- **Legend.** A flat legend outside the 3D plane is always legible: "ALL PRODUCTS · PRODUCT SCREENS · DEMO DATA · WASEL: ILLUSTRATION". The product label follows the moment.
- **Edge fades.** The stage edges fade out with masks: left 96 px into the copy column, top 112 px under the nav, bottom 72 px into the next section.
- **Entrance.** The wall fades in (420 ms) only after the six eager tiles have decoded, with a 600 ms cap, so the H1 stays the LCP element.

### 2.3 Screenshots (`docs/review/m3-2026-10-10/hero-wall/`)

| File | What |
|---|---|
| 01-desktop-1440-rest | 1440×900, no autoplay |
| 02-desktop-1440-autoplay-ai | autoplay, AI in a Box in front |
| 03-desktop-1440-autoplay-automation-mid | autoplay mid-ease to Tasree3 |
| 04 / 05 | IoT (Wasel illustrations) / Security (Yisbir) in front |
| 06 / 06b | 1280×800 rest / AI in front |
| 07 | 1920×1080 |
| 08 / 08b | tablet 1024×768 / scrolled, Security in front |
| 09 / 09b / 09c | phone 390×844 strip / IoT / Security |
| 10-…-hover-gpu, 11-…-keyboard-focus-gpu, 12-…-lightbox-gpu, 12b-…-after-drag-gpu | interaction states, real GPU (Intel Iris Xe) |
| 13-reduced-motion | prefers-reduced-motion |
| 14-compare-near-isometric, 15-compare-tilted-showcase | rejected presets, same moment |

Shots 01–09 and 13–15 come from the SwiftShader harness. 02 and 03 use `#noguard`, because otherwise the frame guard (§7) makes SwiftShader static. That is correct behaviour, but it would hide the ease.

## 3. Layout per breakpoint

| Width | Wall | Rules |
|---|---|---|
| ≥ 1280 | `position:absolute` against `.hero`, `top:0; bottom:0; right:0`, `left` = left edge of grid column 7 (exact calc in §11.2) | 4 columns, preset `lay`, bleeds off the right and bottom edges, edge fades on, legend bottom-left of the wall |
| 768–1279 | in flow under the CTAs, above the moments; full bleed (`margin-inline: -pad`); height `clamp(400px, 60svh, 620px)` | 2 columns, preset `tablet` (rx 34, ry −4, rz −18, persp 2200), tile = min(380, (0.86 W − gap) / 2), top fade 56, bottom fade 96, no left fade |
| < 768 | one horizontal strip under the CTAs; `rotateY(-16deg) rotateX(7deg)` from the left edge; tile `min(72vw, 40svh × 1.6 − 64px)` so the strip stays ≤ 40svh | native `overflow-x: auto` + `scroll-snap-type: x mandatory`, no clones, no auto-scroll, tags always on (no hover), provenance in the legend below; moments become 2×2 under the strip |

The layout reads the stage size once per resize or mode change through a ResizeObserver plus rAF. It rebuilds the DOM only when the structure signature changes (mode, columns, tile size, angles, per-column item lists).

## 4. Data contract

The wall reads one array, so swapping in the final crops changes only data:

```js
{ src,                    // required (or `svg` for a generated illustration) — 'media/m3/v3/wall-07-yisbir-ppe.webp'
  product,                // required — 'aibox' | 'tasree3' | 'wasel' | 'yisbir' | 'mandoobee' | 'nazo'
  caption,                // required — what the screen shows, ≤ 60 chars, British English, no claims
  alt,                    // required — full description for screen readers
  kind: 'screen',         // 'screen' | 'mock' | 'concept' | 'illustration' → provenance text (below)
  w: 1600, h: 1000,       // source pixels → width/height attributes (no CLS)
  crop: [x, y, width],    // spike only: 16:10 window into a wide board (source px). Omit for v3 files (object-fit: cover)
  bg: '#FFFFFF',          // optional under-image colour (letterbox)
  tone: 'light' }         // optional: light UI → stronger resting scrim
```

- **Provenance strings** (fixed): screen → "Product screen · demo data"; mock → "App mock-up"; concept → "Design concept · sample data"; illustration → "Illustration".
- **Product → moment map** (in the engine): aibox → `ai`, tasree3 → `auto`, wasel → `iot`, yisbir → `sec`. Mandoobee and Nazo have no moment. Mandoobee stays on the wall and dims in every moment. The brief asked "IoT → Wasel and Mandoobee?", and the answer is no: Mandoobee is the smart-office app, and lighting it up under a moment labelled "IoT · Wasel" would mislabel it. Nazo is left off the wall until a capture without government-tenant content exists.
- **Order = priority.** The engine deals each product's tiles one per column, starting with the most visible column, so every moment has a tile near the front of the best-placed columns. Leftover tiles go to the shortest column, and each column is then interleaved round-robin so neighbouring tiles differ.
- **Limits.** At most 18 unique items (13 today). The first 6 originals load eagerly and the rest lazily, all with `decoding="async"`.
- **Final crop requirements (media worker, `media/m3/v3/wall-<nn>-<product>-<topic>.webp`).** 16:10, 1600×1000, WebP q≈80, ≤ 120 KB. That is 2× the 420 px maximum tile at DPR 2, and still sharp in the 1120 px lightbox. The current placeholders are cropped from boards 680–1250 px wide, so the lightbox upscales them and they look soft (12-…-lightbox-gpu). Wasel uses the two SVG files.
- **Compliance, for anything a viewer can see.** No personal names, no identifiable faces, no licence plates, no weapons, armoury, K9, VIP or drone panels, no "Sovereignty in Your Hands", no Nazo government templates, and real client names (e.g. "ZAYED UNIVERSITY", "UAE POLICE") masked. Every current crop was checked at full size. One was fixed today: the Yisbir perimeter crop ran into the "ANPR PLATE DETECTION" rows, and it now stops above them (`crop: [324, 0, 360]`).
  **The lightbox must show the same crop as the tile, never the full source board.** The full `yisbir-safety.webp` contains the plate rows. With pre-cropped v3 files this problem disappears.

**build.py: proposed `m3_wall()` output.** The engine builds the DOM itself, so the build step emits only the container, the JSON data island and a no-JS fallback:

```python
def m3_wall(wall_fallback):
    idx = m3_media_index()
    rows = [it for (slug, use), items in sorted(idx.items()) if use == "wall" for it in items] or wall_fallback
    rows = sorted(rows, key=lambda t: t["file"])
    def kind(cap):
        c = (cap or "").lower()
        return "illustration" if c.startswith("illustration") else "mock" if c.startswith("app mock") else "concept" if c.startswith("design concept") else "screen"
    items = [{"src": _media_path(it["file"], "v3"), "product": _slug(it.get("product")), "caption": it.get("title") or it.get("tab_label") or it.get("alt", ""),
              "alt": it.get("alt", ""), "kind": kind(it.get("caption")), "w": it.get("w") or 1600, "h": it.get("h") or 1000,
              **({"tone": it["tone"]} if it.get("tone") else {}), **({"bg": it["bg"]} if it.get("bg") else {})} for it in rows]
    data = json.dumps(items, ensure_ascii=False).replace("</", "<\\/")
    fallback = "".join('<li><img src="%s" alt="%s" width="%s" height="%s" loading="lazy" decoding="async"></li>'
                       % (i["src"], _esc(i["alt"]), i["w"], i["h"]) for i in items[:6])
    return ('<div class="hero-wall" id="wall" data-wall role="region" aria-roledescription="gallery" aria-label="Product screens" aria-describedby="wall-help">'
            '<p id="wall-help" class="sr-only">Arrow keys move between screens. Enter opens a screen larger. The wall stops moving while you browse it.</p>'
            '<div class="wall-stage" data-wall-stage><ul class="wall-fallback">%s</ul></div>'
            '<p class="wall-legend" aria-hidden="true"><b data-legend-product>All products</b><i></i><span>Product screens · demo data</span><i></i><span>Wasel: illustration</span></p>'
            '<script type="application/json" data-wall-items>%s</script></div>') % (fallback, data)
```

Two requests to the media worker follow from this. Add a short descriptive `title` per wall item, because `caption` in `m3_media.json` is the provenance line. Add `tone: "light"` for light UIs (Tasree3, Mandoobee). The no-JS fallback (`.wall-fallback`, a plain 2-column grid, CSS in §10) is cleared by the engine on its first layout.

## 5. Moments API and autoplay

```js
const wall = HeroWall.create(el, items, opts);
wall.focusProduct('sec');                 // 'ai' | 'auto' | 'iot' | 'sec' | null
wall.focusProduct('ai', { instant: true });
wall.motion();                            // call after the page's motion preference changes
wall.pause('dialog'); wall.resume('dialog');   // or any reason string; the wall moves only when no reason holds it
wall.items;                               // normalised items (illustrations resolved to src), for the lightbox
```

- **`focusProduct(m)`** sets `.has-focus` on the wall and `.is-front` on every tile, clones included, whose product maps to `m`. Every other tile dims to 35 % over 420 ms. For each column the engine finds the nearest tile of that product, taking the shortest way round the loop, and eases the column so that tile's centre lands on the column's front line. The ease is an exponential approach with τ = 0.32 s and settles in about 1 s. While a product is in front the drift slows to 20 %. `null` restores full drift and 100 % opacity. The legend label changes to the product name.
  On the phone strip, the strip scrolls to the first tile of that moment: smooth normally, instant when reduced.
- **Autoplay (page-owned).** AI → Automation → IoT → Security, 2800 ms each, run once and then `null`. It starts 0.9–1.2 s after load and only while the hero is the active beat. It stops for good on any moment click, any direct use of the wall (the engine calls `opts.onUserInput` on drag, wheel, touch or a tile click), Pause motion and reduced motion. The moment's cyan rule fills over the hold time (`--hold`). M3 already has this controller (`setMoment` / `autoplay`). Only `WALL.focus` changes to call `focusProduct` (§10).

## 6. Motion and interaction rules

| Input | Behaviour |
|---|---|
| Idle | Drift 24 px/s along the plane × per-column factors [1, 0.84, 1.1, 0.92], alternating directions, seamless loop (K copies per column, computed so the visible range is always covered and every original can reach the front line). |
| Page scroll | The passive scroll handler accumulates `scrollY` deltas. The loop turns them into a boost (≤ 520 px/s, decays τ 0.45 s) applied in each column's own direction, so scrolling the page visibly "pushes" the wall. Page scroll is never prevented. |
| Mouse hover | The wall eases to a stop (τ 0.35 s), and the tile lifts `translateZ(36px)` and loses its scrim. |
| Mouse or pen drag | After a 6 px threshold all columns scrub together along the plane's y axis (screen delta projected on the plane axis). Release gives inertia (≤ 1800 px/s, τ 0.3 s). The click that ends a drag does not open the lightbox. The cursor is `grabbing` while dragging. |
| Wheel | Never captured; it scrolls the page, which nudges the wall. The wheel only ends the autoplay. |
| Touch (tablet) | `touch-action: pan-y` on the stage: vertical page panning is untouched, there is no drag scrub, and a tap opens the lightbox. Phones use the native strip instead. |
| Keyboard | §8. Focus holds the wall still and pins the focused column. |
| Click or Enter | Opens the lightbox with that item. Focus returns to the original tile (clones map to their original). |
| Off-screen or hidden tab | The loop stops (IntersectionObserver, `visibilitychange`) and restarts on return. |

**Implementation constraints, all met:**
- Only `transform` (columns, hover lift) and `opacity` (dim, scrims, tags) animate.
- `will-change: transform` is set only on the moving `.wall-track` elements.
- There is one rAF loop. It sleeps when nothing moves (held, reduced, settled) and wakes on input.
- The loop does no layout reads. It uses numbers cached at layout time, and `scrollY` is read in the passive scroll handler.
- The projection model used for column ranges, focal lines and the drag axis is a `DOMMatrix` copy of the CSS transform, evaluated at layout time only.

## 7. Reduced motion, Pause motion, low power

The engine treats `prefers-reduced-motion: reduce` and `html[data-motion="reduce"]` (the page's persisted Pause motion toggle, key `meerana-motion`) the same way:

- **Static wall.** No drift, no scroll boost, no inertia. Easing columns snap to their targets when the preference flips (`wall.motion()`).
- **Instant changes.** `focusProduct` jumps, and every wall transition is off (`transition: none`), so dimming and hover lift change instantly.
- **No autoplay.** The autoplay never starts and stops if it was running.
- **Phone strip.** Smooth scrolling becomes instant.
- **Still usable.** Hover, focus, the lightbox and drag-to-scrub (without inertia) keep working, because they are user-initiated.

**Frame guard (new).** On machines that cannot composite, the wall does more harm than good, so the engine samples rAF deltas for 2 s of free drift after the entrance. If the median frame exceeds 34 ms it sets `lowPower`, adds `data-low-power` to the wall and behaves exactly as under reduced motion. Such machines include VDI sessions, thin clients and software GL; the SwiftShader harness measured 50 ms frames. The guard does not trip on the Intel Iris Xe GPU (16.7 ms median), and `#noguard` disables it for QA.

## 8. Accessibility

- **Region.** `role="region"` with `aria-roledescription="gallery"`, `aria-label="Product screens"` and `aria-describedby` hidden help text ("Arrow keys move between screens. Enter opens a screen larger. The wall stops moving while you browse it.").
- **Tab order.** The wall is one tab stop: a roving `tabindex` on the original tile nearest the front of the primary column, updated every 0.3 s while drifting.
  - **Arrow keys.** ↑/↓ move within the column (wrapping) and ←/→ move to the nearest-to-front tile of the next or previous column. Home and End also work, and Enter or Space opens.
  - **Focus.** The focused tile eases to the front line and its column is pinned.
- **Clones.** Clones are `aria-hidden="true"` with `tabindex=-1`, and `pointerdown` is prevented on them, so they never take focus. A click on a clone opens the original. QA confirmed 1 tabbable tile, 0 focusable clones and a 13-item lightbox sequence.
- **Labels.** Each original tile's `aria-label` is "Product: caption. Provenance. Opens larger.", and the image `alt` carries the long description. The visual tag and legend are `aria-hidden`, because the label already says it.
- **Visible focus.** A 2 px cyan (`--focus-ring`) outline, offset 4 px, plus the same lift and brighten as hover. The ring is computed on the 3D-transformed tile, so it follows the tilt (11-…-keyboard-focus-gpu).
- **WCAG 2.2.2 (pause, stop, hide).** Motion stops on hover and on keyboard focus inside the wall. Pause motion in the nav stops it page-wide and persists. The autoplay runs once (≈ 12 s) and never loops.
- **Contrast** (token values from tokens.css): tag text navy-200 on navy-950 is 8.9:1, legend text navy-300 on navy-950 is 6.8:1, and moments use text-primary and text-muted. The 10.5–11 px mono tags are supplementary; the same text is in the aria-label and the lightbox caption.
- **Hit testing (bug found and fixed today).** In one `preserve-3d` context the plane, columns and tracks are coplanar with the tiles at z = 0. Chrome resolved the depth tie to the container for 3 of 8 tile centres, so clicks did nothing. The containers now have `pointer-events: none` and only tiles are hit-testable: 8/8 and 4/4 in QA.
- **Lightbox.** The native `<dialog>` closes on Esc and on a backdrop click and returns focus to the tile. ←/→ step through the items, and the wall holds still while the dialog is open.
- **Touch targets.** Tiles are ≥ 300×187 px, and moment buttons are ≥ 72 px tall.

## 9. Performance (measured)

**Method.**
- **Probe.** `wall.perf(ms)` records rAF deltas (frame time) and the JS cost of each loop iteration. QA scripts drove headless Chrome over CDP on the real GPU (Intel Iris Xe, D3D11, DPR 1) through drift, a full moment cycle and page scrolling.
- **Trace.** A CDP trace captured one moment change.
- **SwiftShader.** The same probe ran with software GL.
- **Caveat.** This machine was shared with other jobs. CPU load was 76 % during the final runs, which shows up as isolated long frames, including loop iterations "taking" 18–38 ms, which is preemption, not script.

| Scenario | Frame p50 | Frame p95 | Max | Loop JS avg / p95 |
|---|---|---|---|---|
| 1440 drift — quiet machine | 16.7 | 16.9 | 18.3 | 0.24 / 1.5 ms |
| 1440 drift — final build, loaded machine | 16.7 | 17.1 | 18.6–50 | 0.22–0.42 / 0.7–2.7 ms |
| 1440 moment changes (ease) — quiet | 16.7 | 16.8–16.9 | 17–33 | 0.12–0.18 / ≤ 0.5 ms |
| 1440 moment changes — loaded | 16.7 | 17–30 | 34–84 | 0.18–0.32 / ≤ 1.4 ms |
| 1440 page scroll coupling | 16.7 | 16.8–17.1 | 16.9–17.5 | — |
| 1280 drift / moments — loaded | 16.7 | 17.8 / 17–33 | 33 / 50–133 | 0.39 / 1.0 ms |
| 1920 drift / moments | 16.7 | 16.8–17.1 / 16.8–32 | 21–33 / 17–100 | 0.24–0.30 / 0.9–1.6 ms |
| 1024 tablet (2 cols) drift / moments | 16.7 | 16.8–19 / 16.8–19.8 | 24–50 / 17–83 | 0.25–0.35 / 0.7–2.1 ms |
| SwiftShader (no GPU) 1440 | 50 | 67 | 150 | 0.17 ms → guard trips → static |

- **Trace of one moment change.** One long frame, ≈ 29 ms on the main thread: style recalc 13 ms for 43 tiles flipping `.is-front`, plus paint. A ≈ 34 ms GPU raster flush follows. After that the 1 s ease runs at 60 fps. So a moment change costs one or two dropped frames at its start, and the drift itself costs nothing measurable.
- **Rejected optimisations, measured.**
  - Lifting front tiles with `translateZ` layerised 3–5 tiles mid-ease, with 50–80 ms hitches, so front tiles now only brighten.
  - Pre-promoting every tile with `will-change: opacity` evened out p95 but kept the maxima. It also breaks the "will-change only on moving columns" budget and costs ≈ 12 MB of GPU memory at DPR 1 (≈ 48 MB at DPR 2).
  - Rasterising the SVG illustrations to WebP did not help.
- **Budget.**
  - Unique images: 13 (≤ 18).
  - DOM tiles: 43 desktop (2×4, 4×3, 5×3, 2×4 copies), 39 tablet, 13 phone. Clones reuse the same URLs, so there are no extra requests.
  - Bytes: ≈ 490 KB of WebP placeholders (9 files) plus 14 KB of SVG.
  - Eager images: 6, with `decoding=async` on all.
  - Script: engine ≈ 29 KB unminified with comments, no dependencies, no GSAP. GSAP is optional and not needed here.

## 10. Integration into M3 — what the page template must change

The template (`prototypes/src/m3.tpl.html`, edited by another worker) already has a simpler wall: 3 columns, `WALL.focus(m)`, `WALL.motion()` and `.wall-cap`. To adopt this spec:

1. **CSS.** Replace the block `.hero-wall … .wall-cap` (currently around lines 254–269) with §11.2. Add one alias (M3 calls the page margin `--margin`) and the no-JS fallback:
   ```css
   .hero-wall { --pad: var(--margin); }   /* the wall's bleed and legend inset use --pad; its left edge is calc(50% + var(--gutter) / 2) */
   .wall-fallback { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 120px var(--pad) 0 calc(var(--pad) + 96px); list-style: none; }
   .wall-fallback img { width: 100%; height: auto; border-radius: 14px; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--meerana-white) 8%, transparent); }
   ```
   `--focus-ring`, `--font-mono`, `--navy-*`, `--text-*`, `--dur-*` and `--ease-*` already come from tokens.css.
2. **Markup position.** Move `{{M3_HERO_WALL}}` from after `.wrap` into `.c-text`, between the CTA row and `<ol class="moments">`. This gives tablet and phone their order (wall under the CTAs, above the moments). On desktop the wall must resolve against `.hero`, so at ≥ 1280 `.wrap.grid12` and `.c-text` must stay `position: static`. Keep the copy above the wall with `.c-text > :not(.hero-wall) { position: relative; z-index: 2; }`. On tablet, `.c-text` currently has `max-width: 640px` (768–1279), which would cap the wall at 640 px. Lift the cap from `.c-text` and put it on its text children instead: `@media (min-width: 768px) and (max-width: 1279px) { .c-text { max-width: none; } .c-text > .eyebrow, .c-text > h1, .c-text > .t-lede { max-width: 640px; } }`. `.hero` keeps `overflow: clip`, which clips the bleed. Its `padding-top: 168px` is fine because the wall uses `top:0; bottom:0`.
3. **build.py.** Replace `m3_wall()` with the §4 version: container, JSON island, no-JS fallback and legend. Delete `.wall-cap`; the legend replaces it.
4. **JS.** Paste §11.4 (engine), and §11.6 only if illustrations are generated rather than shipped as the SVG files. Replace the `var WALL = (function () { … })();` IIFE (around lines 748–791) with this adapter. The rest of the controller (`setMoment`, `autoplay`, `motionChanged`) stays as is:
   ```js
   var WALL = (function () {
     var el = document.querySelector('[data-wall]'); if (!el || !window.HeroWall) return null;
     var items = JSON.parse(el.querySelector('[data-wall-items]').textContent);
     var w = HeroWall.create(el, items, {
       isReduced: isReduced,
       onUserInput: function () { stopAutoplay(); },
       onOpen: function (i, tileEl) {                       // reuse the page lightbox: it expects <img> with data-full / data-title
         var list = w.items.map(function (it) {
           var im = new Image(); im.src = it.src; im.alt = it.alt; im.setAttribute('data-full', it.src);
           im.setAttribute('data-title', HeroWall.PRODUCTS[it.product].name + ': ' + it.caption + ' — ' + HeroWall.PROVENANCE[it.kind]);
           return im; });
         tileEl.focus({ preventScroll: true });             // openLightbox stores document.activeElement as the return target
         w.pause('dialog');
         document.querySelector('.lightbox').addEventListener('close', function () { w.resume('dialog'); }, { once: true });
         openLightbox(list, i);
       }
     });
     return { focus: function (m) { w.focusProduct(m); }, motion: function () { w.motion(); } };
   })();
   ```
   Note: the page lightbox shows `data-full`, which is the whole source file. That is only safe with pre-cropped v3 files (see the compliance note in §4).
5. **Leave alone.** The nav (glass), Pause motion, the beat system and the WebGL scene stay as they are. The scene is already hidden in the hero.
6. **RTL (FR toggle is LTR; Arabic later).** Mirror the wall to the inline start: flip the sign of `ry`/`rz`, swap the left and right fades, and use `inset-inline-*` in the desktop rule. The engine's column maths is direction-agnostic.

## 11. Code (verbatim from the spike)

### 11.1 Markup

```html
<div class="hero-wall" id="wall" data-wall role="region" aria-roledescription="gallery" aria-label="Product screens" aria-describedby="wall-help">
  <p id="wall-help" class="sr-only">Arrow keys move between screens. Enter opens a screen larger. The wall stops moving while you browse it.</p>
  <div class="wall-stage" data-wall-stage></div>
  <p class="wall-legend" data-wall-legend aria-hidden="true"><b data-legend-product>All products</b><i></i><span>Product screens · demo data</span><i></i><span>Wasel: illustration</span></p>
</div>
```

### 11.2 CSS — the wall (tokens from tokens.css)

```css
/* ===== HERO WALL CSS: BEGIN ===== */
/* =====================================================================================
   THE WALL — solid tiles on a tilted 3D plane. Only .wall-track moves (transform, one rAF).
   Structure: .hero-wall > .wall-stage (perspective, clip, edge masks) > .wall-plane (rotate, preserve-3d)
              > .wall-col > .wall-track (translateY) > .wall-tile (button) — clones are aria-hidden.
   ===================================================================================== */
.hero-wall { --hw-tile: 336px; --hw-gap: 22px; --hw-persp: 1600px; position: relative; z-index: 1; }
.wall-stage { position: absolute; inset: 0; overflow: clip; perspective: var(--hw-persp); perspective-origin: 50% 50%; touch-action: pan-y;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 var(--hw-fade-l, 96px)), linear-gradient(to bottom, transparent 0, #000 var(--hw-fade-t, 112px), #000 calc(100% - var(--hw-fade-b, 72px)), transparent 100%);
  -webkit-mask-composite: source-in; mask-image: linear-gradient(to right, transparent 0, #000 var(--hw-fade-l, 96px)), linear-gradient(to bottom, transparent 0, #000 var(--hw-fade-t, 112px), #000 calc(100% - var(--hw-fade-b, 72px)), transparent 100%);
  mask-composite: intersect; }
.wall-stage.is-dragging { cursor: grabbing; }
.wall-stage { transition: opacity var(--dur-3) var(--ease-enter); }
.hero-wall:not(.is-ready) .wall-stage { opacity: 0; }          /* quiet entrance once the first tiles decode (the H1 stays the LCP) */
.wall-plane { position: absolute; top: 0; left: 0; transform-style: preserve-3d; transform-origin: 50% 50%; }
.wall-plane::before { /* the "drafting mat": a faint fixed grid the tiles glide over — reads as an architectural model, matches the isometric brand */
  content: ""; position: absolute; inset: -60% -12%; pointer-events: none; opacity: .5;
  background-image: linear-gradient(to right, color-mix(in srgb, var(--navy-800) 70%, transparent) 1px, transparent 1px),
                    linear-gradient(to bottom, color-mix(in srgb, var(--navy-800) 70%, transparent) 1px, transparent 1px);
  background-size: calc((var(--hw-tile) + var(--hw-gap)) / 4) calc((var(--hw-tile) + var(--hw-gap)) / 4); background-position: calc(var(--hw-gap) / -2) 0;
  -webkit-mask-image: radial-gradient(closest-side, #000 30%, transparent); mask-image: radial-gradient(closest-side, #000 30%, transparent); }
.wall-col { position: absolute; top: 0; width: var(--hw-tile); transform-style: preserve-3d; }
.wall-track { display: flex; flex-direction: column; gap: var(--hw-gap); transform-style: preserve-3d; will-change: transform; }
/* Hit testing: in one preserve-3d context the plane, columns and tracks are coplanar with the tiles (z = 0), and Chrome
   resolves the depth tie to the container about a third of the time (measured: 3 of 8 tile centres hit .wall-col).
   Containers are therefore transparent to the pointer; only tiles are hit-testable. The stage keeps its listeners. */
.wall-plane, .wall-col, .wall-track { pointer-events: none; }
.wall-plane .wall-tile { pointer-events: auto; }

.wall-tile { --hw-scrim: .2; position: relative; display: block; flex: none; width: var(--hw-tile); aspect-ratio: 16 / 10; border-radius: 14px; background: var(--navy-900);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--meerana-white) 4%, transparent), 0 28px 48px -24px rgb(0 0 0 / .72);
  transition: transform var(--dur-3) var(--ease-standard), opacity var(--dur-3) var(--ease-standard); }
.wall-tile[data-tone="light"] { --hw-scrim: .4; }
.wall-media { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; background: var(--hw-tile-bg, var(--navy-950)); }
.wall-media img { position: absolute; max-width: none; height: auto; user-select: none; -webkit-user-drag: none; }
.wall-media img.cover { inset: 0; width: 100%; height: 100%; object-fit: cover; }
.wall-scrim { position: absolute; inset: 0; border-radius: inherit; background: var(--navy-950); opacity: var(--hw-scrim); pointer-events: none; transition: opacity var(--dur-3) var(--ease-standard); }
.wall-tile::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--meerana-white) 8%, transparent), inset 0 1px 0 color-mix(in srgb, var(--meerana-white) 6%, transparent);
  transition: box-shadow var(--dur-2) var(--ease-standard); }
.wall-tag { position: absolute; left: 10px; bottom: 10px; display: inline-flex; align-items: center; gap: 8px; height: 24px; padding-inline: 9px; border-radius: 6px;
  background: var(--navy-950); color: var(--text-secondary); font: 500 10.5px/1 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; white-space: nowrap;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--meerana-white) 10%, transparent); opacity: 0; transform: translateY(4px);
  transition: opacity var(--dur-2) var(--ease-standard), transform var(--dur-2) var(--ease-standard); }
.wall-tag b { font-weight: 600; color: var(--text-primary); }
.wall-tag i { width: 1px; height: 10px; background: var(--navy-600); }

/* hover / keyboard focus: lift toward the viewer and brighten */
@media (hover: hover) { .wall-tile:hover { transform: translateZ(36px); } .wall-tile:hover .wall-scrim { opacity: 0; } .wall-tile:hover .wall-tag { opacity: 1; transform: none; }
  .wall-tile:hover::after { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--meerana-white) 18%, transparent), inset 0 1px 0 color-mix(in srgb, var(--meerana-white) 10%, transparent); } }
.wall-tile:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 4px; transform: translateZ(36px); }
.wall-tile:focus-visible .wall-scrim { opacity: 0; }
.wall-tile:focus-visible .wall-tag { opacity: 1; transform: none; }

/* moments API: the focused product comes to the front, everything else dims to 35 % */
.hero-wall.has-focus .wall-tile { opacity: .35; }
.hero-wall.has-focus .wall-tile.is-front { opacity: 1; }   /* no translateZ here: lifting 3–5 tiles at once layerizes them mid-ease (measured 50–80 ms hitches) */
.hero-wall.has-focus .wall-tile.is-front .wall-scrim { opacity: 0; }
.hero-wall.has-focus .wall-tile.is-front[data-tone="light"] .wall-scrim { opacity: .1; }   /* light UIs never outshine the H1 */
.hero-wall.has-focus .wall-tile.is-front::after { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--meerana-white) 24%, transparent), inset 0 1px 0 color-mix(in srgb, var(--meerana-white) 12%, transparent); }
.hero-wall.has-focus .wall-tile.is-front .wall-tag { opacity: 1; transform: none; }
@media (hover: hover) { .hero-wall.has-focus .wall-tile:hover { opacity: 1; transform: translateZ(36px); } }

/* flat legend (outside the 3D plane, always legible): provenance for everything on the wall */
.wall-legend { position: absolute; z-index: 3; right: var(--pad); bottom: 24px; display: inline-flex; align-items: center; gap: 10px; margin: 0;
  height: 30px; padding-inline: 12px; border-radius: 8px; background: var(--navy-950); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--meerana-white) 8%, transparent);
  font: 500 11px/1 var(--font-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; }
.wall-legend b { font-weight: 600; color: var(--text-secondary); }
.wall-legend i { width: 1px; height: 12px; background: var(--navy-600); }

/* desktop ≥ 1280: absolute, from grid column 7 to the right viewport edge, full hero height */
@media (min-width: 1280px) {
  .hero-wall { position: absolute; top: 0; bottom: 0; right: 0;
    left: calc(50% + var(--gutter) / 2); }   /* = left edge of grid column 7 for any centred 12-column wrap (same as M3's .hero-wall) */
  .wall-legend { right: auto; left: 96px; bottom: 28px; }
}
/* tablet 768–1279: under the text, full bleed, two columns */
@media (min-width: 768px) and (max-width: 1279px) {
  .hero-text { max-width: none; }
  .hero-text > .eyebrow, .hero-text > .h1, .hero-text > .lede { max-width: 40rem; }
  .hero-wall { height: clamp(400px, 60svh, 620px); margin-top: 40px; margin-inline: calc(-1 * var(--pad)); --hw-fade-l: 0px; --hw-fade-t: 56px; --hw-fade-b: 96px; }
  .wall-legend { right: var(--pad); bottom: 20px; }
}
/* phone < 768: one tilted horizontal strip under the CTAs, native scroll-snap, ≤ 40svh */
.hero-wall[data-mode="strip"] { height: auto; margin: 32px calc(-1 * var(--pad)) 0; }
.hero-wall[data-mode="strip"] .wall-stage { position: relative; inset: auto; overflow-x: clip; overflow-y: visible; -webkit-mask-image: none; mask-image: none; perspective: 1100px; perspective-origin: 0 50%; touch-action: auto; }
.wall-strip { display: flex; gap: 14px; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scroll-padding-inline: var(--pad); padding: 18px var(--pad) 26px;
  scrollbar-width: none; transform: rotateY(-16deg) rotateX(7deg); transform-origin: 0 50%; }
.wall-strip::-webkit-scrollbar { display: none; }
.wall-strip .wall-tile { --hw-tile: min(72vw, calc(40svh * 1.6 - 64px)); scroll-snap-align: start; }
.hero-wall[data-mode="strip"] .wall-legend { position: static; flex-wrap: wrap; row-gap: 6px; height: auto; min-height: 30px; padding-block: 8px; margin: 0 var(--pad); white-space: normal; }
.hero-wall[data-mode="strip"] .wall-tag { opacity: 1; transform: none; }   /* touch has no hover: the product name is always on */
.hero-wall[data-mode="strip"] .wall-tag i, .hero-wall[data-mode="strip"] .wall-tag .prov { display: none; }   /* provenance lives in the legend below */

/* reduced motion / Pause motion: everything static, focus changes instant */
@media (prefers-reduced-motion: reduce) { .wall-tile, .wall-scrim, .wall-tag, .moment .m-rule { transition: none !important; } }
html[data-motion="reduce"] .wall-tile, html[data-motion="reduce"] .wall-scrim, html[data-motion="reduce"] .wall-tag, html[data-motion="reduce"] .moment .m-rule { transition: none !important; }
.hero-wall[data-low-power] .wall-tile, .hero-wall[data-low-power] .wall-scrim, .hero-wall[data-low-power] .wall-tag { transition: none !important; }   /* set by the frame guard */
/* ===== HERO WALL CSS: END ===== */
```

### 11.3 Data (placeholders in use today; for v3 swap `src`, drop `crop`, set `w:1600, h:1000`, and Wasel to `src: 'media/m3/v3/wall-wasel-*.svg', kind: 'illustration'`)

```js
/* =====================================================================================
   HERO WALL DATA: BEGIN · 1. DATA CONTRACT — the only thing to edit when the final crops (media/m3/v3/wall-<nn>-<product>-<topic>.webp) land.
   { src, product, caption, alt,               required
     kind: 'screen'|'mock'|'concept'|'illustration'   → provenance caption (default 'screen')
     w, h: source pixel size                   → width/height attributes (default 1600×1000)
     crop: [x, y, width] in source px, 16:10   → spike only: crops the current wide boards; omit for v3 files (object-fit: cover)
     bg: letterbox / under-image colour        · tone: 'light' for light UIs (stronger resting scrim) }
   Compliance (applies to anything a viewer sees): crops below exclude names, faces, plates, weapons/VIP/K9/drone panels,
   the AI in a Box tagline and the Nazo government templates. Nazo has no compliant capture yet, so it is not on the wall.
   ===================================================================================== */
const WALL_ITEMS = [
  { src: 'media/m3/aibox-contract-review.webp', w: 1600, h: 760, crop: [208, 88, 1024], product: 'aibox', kind: 'screen',
    caption: 'Contract review with clause-level fixes', alt: 'AI in a Box document review: two flagged contract clauses, each with a suggested fix' },
  { src: 'media/m3/aibox-home.webp', w: 1600, h: 760, crop: [585, 236, 680], product: 'aibox', kind: 'screen',
    caption: 'Assistant: ask, upload a file or pick an agent', alt: 'AI in a Box assistant: a prompt box with upload, voice and agent-selection controls' },
  { src: 'media/m3/aibox-agent-matrix.webp', w: 1600, h: 760, crop: [290, 96, 1040], product: 'aibox', kind: 'screen',
    caption: 'Agent matrix: task agents and their status', alt: 'AI in a Box agent matrix: legal, finance, research, HR and IT security agents, each with a status, linked in a topology' },
  { src: 'media/m3/tasree3-command-center.webp', w: 1600, h: 781, crop: [0, 0, 1249], product: 'tasree3', kind: 'screen', tone: 'light',
    caption: 'Command Center: processes, reports and pending actions', alt: 'Tasree3 Command Center: totals for processes, relationship reports and pending actions, with configuration health' },
  { src: 'media/m3/tasree3-text-to-bpmn.webp', w: 1600, h: 778, crop: [120, 0, 1245], product: 'tasree3', kind: 'screen', tone: 'light',
    caption: 'Text to BPMN: a billing process drafted from a description', alt: 'Tasree3 process editor showing a billing process as a BPMN diagram, from meter reading to bill sent' },
  { src: 'media/m3/yisbir-campus.webp', w: 1600, h: 580, crop: [405, 8, 790], product: 'yisbir', kind: 'screen',
    caption: 'Campus operations: incident queue, cameras and zone counts', alt: 'Yisbir campus board: an incident queue, a camera matrix and occupancy counts per zone' },
  { src: 'media/m3/yisbir-safety.webp', w: 1600, h: 719, crop: [8, 183, 300], product: 'yisbir', kind: 'screen',
    caption: 'PPE compliance counters by category', alt: 'Yisbir PPE compliance panel: helmet, vest, glove and boot detection rates' },
  { src: 'media/m3/yisbir-retail.webp', w: 1600, h: 616, crop: [0, 0, 800], product: 'yisbir', kind: 'screen',
    caption: 'Retail: footfall and loss-prevention alerts', alt: 'Yisbir retail board: hourly footfall bars and a list of loss-prevention alerts by camera' },
  { src: 'media/m3/yisbir-safety.webp', w: 1600, h: 719, crop: [324, 0, 360], product: 'yisbir', kind: 'screen',   // stops above the ANPR plate rows
    caption: 'Perimeter crossing detection with a 24-hour timeline', alt: 'Yisbir perimeter view: a fence camera with a crossing alert box and a 24-hour crossing timeline' },
  { src: 'media/m3/yisbir-retail.webp', w: 1600, h: 616, crop: [805, 0, 795], product: 'yisbir', kind: 'screen',
    caption: 'Retail: store cameras, shrinkage and cold-chain sensors', alt: 'Yisbir retail board: store camera feeds, inventory shrinkage by category and cold-chain temperatures' },
  { src: 'media/m3/mandoobee-app.webp', w: 825, h: 653, crop: [150, 140, 528], product: 'mandoobee', kind: 'screen', tone: 'light', bg: '#FFFFFF',
    caption: 'Smart office app: services, clock-in and workforce', alt: 'Mandoobee phone screens: HR services, a swipe-to-clock-in card and a workforce attendance ring' },
  { svg: 'waselGate', product: 'wasel', kind: 'illustration',
    caption: 'Gate controller and barrier, opened from a phone', alt: 'Illustration: an isometric barrier gate with its controller, opened by a signal from a phone' },
  { svg: 'waselFlow', product: 'wasel', kind: 'illustration',
    caption: 'Phone → controller → gate', alt: 'Illustration: a phone, the Wasel controller and a gate connected by a signal path' },
];
/* ===== HERO WALL DATA: END ===== */
```

### 11.4 Engine — `HeroWall.create`

```js
/* ===== HERO WALL ENGINE: BEGIN ===================================================================
   HeroWall.create(el, items, opts) — vanilla, no dependencies, one rAF loop, transform/opacity only.
     el     the .hero-wall element; it must contain [data-wall-stage] and may contain [data-legend-product]
     items  WALL_ITEMS (data contract in HERO-WALL-SPEC.md §3)
     opts   isReduced()           page motion preference (default: prefers-reduced-motion or html[data-motion="reduce"])
            onOpen(index, tileEl) open the page's lightbox for items[index]; tileEl is always an original tile (focus return)
            onUserInput()         the visitor used the wall directly (drag, wheel, touch, click): stop the hero autoplay
            illustrations         { name: () => svgString } for items that carry `svg` instead of `src`
            dev                   URLSearchParams of QA overrides (comp, rx, ry, rz, persp, tile, gap, cx, cy, fx, fy, cols, phase, noguard)
   returns { focusProduct(m, {instant}), motion(), pause(reason), resume(reason), items, debug(), perf(ms) }
   ================================================================================================ */
window.HeroWall = (function () {
  'use strict';
  const PRODUCTS = {
    aibox: { name: 'AI in a Box', moment: 'ai' }, tasree3: { name: 'Tasree3', moment: 'auto' }, wasel: { name: 'Wasel', moment: 'iot' },
    yisbir: { name: 'Yisbir', moment: 'sec' }, mandoobee: { name: 'Mandoobee', moment: null }, nazo: { name: 'Nazo', moment: null },
  };
  const MOMENT_NAME = { ai: 'AI in a Box', auto: 'Tasree3', iot: 'Wasel', sec: 'Yisbir' };
  const PROVENANCE = { screen: 'Product screen · demo data', mock: 'App mock-up', concept: 'Design concept · sample data', illustration: 'Illustration' };

  /* Compositions. rx/ry/rz: plane rotation (deg). persp: perspective (px). tile/gap: px.
     cx/cy: plane centre in the stage (0–1). fx/fy: focal point ("the front") in the stage (0–1). */
  const PRESETS = {
    lay:    { rx: 38, ry: -6,  rz: -24, persp: 2400, tile: 336, gap: 26, cx: .56, cy: .50, fx: .42, fy: .52, cols: 4 },   // chosen
    iso:    { rx: 54, ry: 0,   rz: -38, persp: 3600, tile: 330, gap: 26, cx: .58, cy: .50, fx: .40, fy: .52, cols: 4 },   // near-isometric
    tilt:   { rx: 20, ry: -26, rz: 6,   persp: 1500, tile: 336, gap: 22, cx: .52, cy: .46, fx: .34, fy: .5,  cols: 4 },   // tilted showcase
    tablet: { rx: 34, ry: -4,  rz: -18, persp: 2200, tile: 380, gap: 24, cx: .52, cy: .46, fx: .46, fy: .46, cols: 2 },
  };
  const BASE_SPEED = 24;                    // px/s along the plane, inside the 20–30 brief
  const COL_SPEED = [1, .84, 1.1, .92];     // per-column variance so rows never line up
  const FOCUS_SPEED = .2;                   // drift while a product is in front
  const EASE_TAU = .32;                     // s — exponential approach for focus moves (≈ 1 s to settle)
  const SPEED_TAU = .35;                    // s — hover pause / resume ease

  /* one tile's media. `crop` ([x, y, width] in source px, 16:10) positions a wide board inside the tile; without it, object-fit: cover */
  function mediaHTML(it, eager) {
    const load = eager ? 'loading="eager"' : 'loading="lazy"';
    if (!it.crop) return `<img class="cover" src="${it.src}" width="${it.w}" height="${it.h}" alt="" decoding="async" ${load} draggable="false">`;
    const [x, y, cw] = it.crop, ch = cw * 10 / 16;
    const st = `width:${(it.w / cw * 100).toFixed(3)}%;left:${(-x / cw * 100).toFixed(3)}%;top:${(-y / ch * 100).toFixed(3)}%`;
    return `<img src="${it.src}" width="${it.w}" height="${it.h}" alt="" decoding="async" ${load} draggable="false" style="${st}">`;
  }

  function create(wall, WALL_ITEMS, opts) {
    opts = opts || {};
    const Q = opts.dev || new URLSearchParams();
    const root = document.documentElement;
    const stage = wall.querySelector('[data-wall-stage]');
    const legendProduct = wall.querySelector('[data-legend-product]');
    const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
    const mqDesk = matchMedia('(min-width: 1280px)');
    const mqTab = matchMedia('(min-width: 768px)');
    const isReduced = opts.isReduced || (() => mqReduce.matches || root.dataset.motion === 'reduce');
    const onOpen = opts.onOpen || (() => {});
    const userInput = opts.onUserInput || (() => {});
    const ILL = opts.illustrations || {};
    let lowPower = false, ready = false;      // lowPower: set by the frame guard on machines without GPU compositing (VDI, thin clients)
    const still = () => isReduced() || lowPower;
    const guard = { on: !Q.has('noguard'), t0: 0, prev: 0, s: [] };
    const items = WALL_ITEMS.map((it, i) => Object.assign({ kind: 'screen', w: 1600, h: 1000 }, it, { i, moment: (PRODUCTS[it.product] || {}).moment || null }));
    items.forEach(it => { if (it.svg && ILL[it.svg]) { it.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ILL[it.svg]()); it.w = 640; it.h = 400; } });

    /* ---------- state ---------- */
    let mode = null, preset = null, cols = [], primaryCol = 0, th = 0, pitch = 0;
    let focus = null, speedMul = 1, boost = 0, scrollAcc = 0, lastScrollY = scrollY;
    let raf = 0, last = 0, inView = true, docVisible = !document.hidden, roveClock = 0, entry = null;
    const hold = new Set();                   // 'hover' | 'focus' | 'dialog' | 'api' | any reason passed to pause()
    const drag = { id: null, x: 0, y: 0, moved: false, pending: 0, vel: 0, t: 0, ax: 0, ay: 1, scale: 1, quietUntil: 0 };
    let inertia = 0;
    const probe = { on: false, frames: [], loop: [], lastT: 0 };

    /* ---------- a. one tile (button). Clones: aria-hidden + tabindex -1 (the mouse still works on them). ---------- */
    function tileEl(it, isClone, eager) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'wall-tile'; b.dataset.i = it.i; b.tabIndex = -1;
      if (it.moment) b.dataset.wallMoment = it.moment;
      if (it.tone) b.dataset.tone = it.tone;
      if (it.bg) b.style.setProperty('--hw-tile-bg', it.bg);
      const p = PRODUCTS[it.product] || { name: it.product };
      if (isClone) b.setAttribute('aria-hidden', 'true');
      else b.setAttribute('aria-label', `${p.name}: ${it.caption}. ${PROVENANCE[it.kind]}. Opens larger.`);
      b.innerHTML = `<span class="wall-media">${mediaHTML(it, eager)}</span><span class="wall-scrim"></span>` +
        `<span class="wall-tag" aria-hidden="true"><b>${p.name}</b><i></i><span class="prov">${PROVENANCE[it.kind]}</span></span>`;
      b.querySelector('img').alt = isClone ? '' : it.alt;
      return b;
    }

    /* ---------- b. distribute items over columns, most visible columns first ----------
       Every product deals its tiles (in data order = priority) one per column, starting with the most visible column,
       so each moment has a tile in the best-placed columns. Leftovers go to the shortest column. Then interleave. */
    function distribute(n, rank) {
      const groups = {};
      items.forEach(it => (groups[it.product] = groups[it.product] || []).push(it));
      const out = Array.from({ length: n }, () => []), spill = [];
      Object.values(groups).forEach(g => g.forEach((it, k) => (k < n ? out[rank[k]].push(it) : spill.push(it))));
      spill.forEach(it => { let best = rank[0]; rank.forEach(c => { if (out[c].length < out[best].length) best = c; }); out[best].push(it); });
      return out.map(list => {                                    // round-robin by product so neighbours differ
        const by = {}; list.forEach(it => (by[it.product] = by[it.product] || []).push(it));
        const qs = Object.values(by).sort((x, y) => y.length - x.length), r = [];
        while (qs.some(q => q.length)) qs.forEach(q => q.length && r.push(q.shift()));
        return r;
      });
    }

    /* ---------- c. projection model of the CSS 3D transform (layout time only, never per frame) ---------- */
    function projector(P, W, H, PW, PH) {
      const m = new DOMMatrix(`rotateX(${P.rx}deg) rotateY(${P.ry}deg) rotateZ(${P.rz}deg)`);
      const pcx = P.cx * W, pcy = P.cy * H, ox = W / 2, oy = H / 2, d = P.persp;
      return (x, y) => {
        const q = m.transformPoint(new DOMPoint(x - PW / 2, y - PH / 2, 0));
        const k = d / (d - q.z);
        return [ox + (q.x + pcx - ox) * k, oy + (q.y + pcy - oy) * k];
      };
    }

    /* ---------- d. layout: measure once per resize/mode change, rebuild DOM only when the structure changes ---------- */
    function layout() {
      const m = mqDesk.matches ? 'desk' : mqTab.matches ? 'tab' : 'strip';
      if (m === 'strip') return buildStrip();
      const W = stage.clientWidth, H = stage.clientHeight;
      if (!W || !H) return;
      const comp = Q.get('comp');
      const P = Object.assign({}, m === 'desk' ? PRESETS[PRESETS[comp] && comp !== 'tablet' ? comp : 'lay'] : PRESETS.tablet);
      ['rx', 'ry', 'rz', 'persp', 'tile', 'gap', 'cx', 'cy', 'fx', 'fy', 'cols'].forEach(k => { if (Q.has(k)) P[k] = +Q.get(k); });   // dev overrides
      if (m === 'tab') P.tile = Math.min(P.tile, Math.round((W * .86 - P.gap) / 2));
      else if (!Q.has('tile')) P.tile = Math.round(Math.min(420, Math.max(300, W * .47)));        // desktop: tile scales with the stage (336 at 1440)
      const n = P.cols, tile = P.tile, gap = P.gap;
      th = tile * 10 / 16; pitch = th + gap;
      const PW = n * tile + (n - 1) * gap, PH = H;
      const proj = projector(P, W, H, PW, PH);
      const F = [P.fx * W, P.fy * H], M = 60;
      // "comfortably visible" box for a tile centre: clear of the edge fades (keep in sync with --hw-fade-* in CSS) and the legend
      const fade = m === 'desk' ? [96, 112, 72] : [0, 56, 96];
      const box = [fade[0] + tile * .22, fade[1] + th * .3, W - tile * .2, H - fade[2] - th * .45];
      const prev = cols;
      // pass 1 — geometry per column: visible plane-y range, the "front" (focal) and a visibility score
      const geo = Array.from({ length: n }, (_, c) => {
        const x0 = c * (tile + gap), xs = [x0 + 2, x0 + tile / 2, x0 + tile - 2];
        let V0 = Infinity, V1 = -Infinity, focal = 0, best = Infinity, focalAny = 0, bestAny = Infinity, vis = 0;
        for (let y = -6000; y <= 6000; y += 12) {
          for (const x of xs) {
            const [sx, sy] = proj(x, y);
            if (sx > -M && sx < W + M && sy > -M && sy < H + M) { if (y < V0) V0 = y; if (y > V1) V1 = y; }
          }
          const [sx, sy] = proj(xs[1], y), dd = (sx - F[0]) ** 2 + (sy - F[1]) ** 2, ok = sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];
          if (ok) vis++;
          if (dd < bestAny) { bestAny = dd; focalAny = y; }
          if (ok && dd < best) { best = dd; focal = y; }
        }
        if (best === Infinity) focal = focalAny;
        if (V0 === Infinity) { V0 = 0; V1 = th; }
        return { V0: V0 - th / 2, V1: V1 + th / 2, focal, vis, fscreen: proj(xs[1], focal) };   // ± th/2: the hover lift shows a sliver more
      });
      const rank = geo.map((g, c) => c).sort((x, y) => geo[y].vis - geo[x].vis || x - y);
      const lists = distribute(n, rank);
      // pass 2 — loop length, copies and the copy that holds the originals
      const next = lists.map((list, c) => {
        const { V0, V1, focal, vis, fscreen } = geo[c];
        const cnt = list.length, L = cnt * pitch;
        if (!cnt) return { c, list, cnt, L: 0, K: 0, mid: 0, V0, V1, focal, vis, lo: 0, rLo: 0, rHi: 0, dir: 1, speed: 0, phase: 0, pos: 0, drawn: NaN, target: null, pinned: false, dom: [], fscreen };
        // K copies so the track always covers [V0, V1]; originals sit in copy `mid` so every original can reach the focal line
        let K = Math.ceil((V1 - V0 + gap) / L) + 1, mid = 0;
        for (; K < 12; K++) {
          const lo = V1 - K * L + gap, hi = V0, mmin = Math.ceil((focal - th / 2 - hi) / L), mmax = Math.floor((focal - th / 2 - (cnt - 1) * pitch - lo) / L);
          if (hi - lo >= L && mmin <= mmax) { mid = Math.max(0, mmin); break; }
        }
        const rLo = V1 - K * L + gap, rHi = V0, lo = rLo + (rHi - rLo - L) / 2;
        return { c, list, cnt, L, K, mid, V0, V1, focal, vis, lo, rLo, rHi, dir: c % 2 ? 1 : -1, speed: COL_SPEED[c % 4],
          phase: prev[c] && prev[c].L ? (prev[c].pos - prev[c].lo) / prev[c].L : ((c * .618 + .2) % 1), pos: 0, drawn: NaN, target: null, pinned: false, dom: [], fscreen };
      });
      // primary column: the one whose focal point is nearest the stage focal point (roving tab entry)
      let bd = Infinity; next.forEach(col => { const d = (col.fscreen[0] - F[0]) ** 2 + (col.fscreen[1] - F[1]) ** 2; if (d < bd) { bd = d; primaryCol = col.c; } });
      // drag mapping: unit screen direction of the plane's +y axis, and px-on-screen per px-on-plane
      const a = proj(PW / 2, PH / 2), b = proj(PW / 2, PH / 2 + 100), vx = b[0] - a[0], vy = b[1] - a[1], vl = Math.hypot(vx, vy) || 1;
      drag.ax = vx / vl; drag.ay = vy / vl; drag.scale = 100 / vl;

      const sig = [m, n, tile, P.rx, P.ry, P.rz].join('|') + next.map(c => c.K + ':' + c.list.map(it => it.i).join('.')).join(',');
      if (sig !== wall.dataset.sig) {
        wall.dataset.sig = sig; wall.dataset.mode = m;
        stage.textContent = ''; entry = null;
        const plane = document.createElement('div'); plane.className = 'wall-plane';
        let eager = 0;
        next.forEach(col => {
          const ce = document.createElement('div'); ce.className = 'wall-col'; ce.style.left = col.c * (tile + gap) + 'px';
          const tr = document.createElement('div'); tr.className = 'wall-track';
          for (let k = 0; k < col.K; k++) col.list.forEach(it => {
            const el = tileEl(it, k !== col.mid, k === col.mid && eager++ < 6);
            tr.appendChild(el); col.dom.push({ el, it, orig: k === col.mid, j: col.dom.length });
          });
          ce.appendChild(tr); plane.appendChild(ce); col.track = tr;
        });
        stage.appendChild(plane);
        reveal();
      } else {
        next.forEach((col, c) => { col.track = prev[c].track; col.dom = prev[c].dom; });
      }
      const plane = stage.firstElementChild;
      wall.style.setProperty('--hw-tile', tile + 'px'); wall.style.setProperty('--hw-gap', gap + 'px'); wall.style.setProperty('--hw-persp', P.persp + 'px');
      plane.style.width = PW + 'px'; plane.style.height = PH + 'px';
      plane.style.left = (P.cx * W - PW / 2) + 'px'; plane.style.top = (P.cy * H - PH / 2) + 'px';
      plane.style.transform = `rotateX(${P.rx}deg) rotateY(${P.ry}deg) rotateZ(${P.rz}deg)`;
      cols = next; mode = m; preset = P;
      cols.forEach(col => { col.pos = col.lo + col.phase * col.L; if (Q.has('phase')) col.pos = col.lo + (+Q.get('phase')) * col.L; write(col); });
      applyFocusClasses(); rove(true);
      if (focus) focusProduct(focus, { instant: true });
      kick();
    }

    /* phone: one native horizontal strip, no clones, no auto-scroll */
    function buildStrip() {
      if (wall.dataset.sig === 'strip') return;
      wall.dataset.sig = 'strip'; wall.dataset.mode = 'strip'; mode = 'strip'; cols = [];
      stage.textContent = '';
      const s = document.createElement('div'); s.className = 'wall-strip';
      // deal in moment order (AI, Automation, IoT, Security, then the rest) so neighbours differ and each moment is near the start
      const ORDER = ['ai', 'auto', 'iot', 'sec', null], qs = ORDER.map(mo => items.filter(it => it.moment === mo)), dealt = [];
      while (qs.some(q => q.length)) qs.forEach(q => q.length && dealt.push(q.shift()));
      dealt.forEach((it, k) => { const el = tileEl(it, false, k < 3); el.tabIndex = 0; s.appendChild(el); });
      stage.appendChild(s);
      applyFocusClasses(); reveal();
    }
    function reveal() {                                       // fade the stage in when the eager tiles have decoded (≤ 600 ms)
      const imgs = [...stage.querySelectorAll('img[loading="eager"]')];
      Promise.race([Promise.all(imgs.map(i => i.decode().catch(() => {}))), new Promise(r => setTimeout(r, 600))])
        .then(() => requestAnimationFrame(() => { wall.classList.add('is-ready'); setTimeout(() => { ready = true; }, 500); }));
    }

    function write(col) {
      if (Math.abs(col.pos - col.drawn) < .01) return;
      col.track.style.transform = `translate3d(0,${col.pos.toFixed(2)}px,0)`;
      col.drawn = col.pos;
    }

    /* ---------- e. the single rAF loop: drift + scroll boost + drag inertia + focus easing. No layout reads. ---------- */
    function kick() { if (!raf && mode !== 'strip' && inView && docVisible) { last = 0; raf = requestAnimationFrame(frame); } }
    function frame(now) {
      raf = 0;
      const t0 = performance.now();
      const dt = last ? Math.min(.05, (now - last) / 1000) : 1 / 60; last = now;
      const reduced = still();
      if (guard.on && ready && !hold.size && !probe.on) {   // frame guard: 2 s of drifting with a median frame > 34 ms → static wall
        if (!guard.t0) guard.t0 = now; else guard.s.push(now - guard.prev);
        guard.prev = now;
        if (now - guard.t0 > 2000) {
          guard.on = false; const s = guard.s.sort((x, y) => x - y), med = s[s.length >> 1] || 0;
          if (med > 34) { lowPower = true; wall.dataset.lowPower = Math.round(med); }
        }
      }
      const want = reduced || hold.size ? 0 : focus ? FOCUS_SPEED : 1;
      speedMul = (reduced || hold.has('focus') || hold.has('dialog')) ? want : speedMul + (want - speedMul) * (1 - Math.exp(-dt / SPEED_TAU));
      if (Math.abs(speedMul - want) < .002) speedMul = want;
      boost = reduced || hold.size ? 0 : Math.min(520, boost * Math.exp(-dt / .45) + Math.min(Math.abs(scrollAcc), 220) * 1.1);
      if (boost < .5) boost = 0;
      scrollAcc = 0;
      let shift = 0;
      if (drag.id !== null) { shift = drag.pending; drag.pending = 0; }
      else if (inertia) { shift = inertia * dt; inertia *= Math.exp(-dt / .3); if (Math.abs(inertia) < 4) inertia = 0; }
      const k = 1 - Math.exp(-dt / EASE_TAU);
      let busy = speedMul > 0 || boost > 0 || drag.id !== null || inertia !== 0;
      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        if (!col.L) continue;                              // an empty column (more columns than items) never moves
        const v = col.dir * (BASE_SPEED * col.speed * speedMul + boost);
        let p = col.pos + v * dt + shift;
        if (col.target !== null) {
          col.target += v * dt + shift;
          const d = col.target - p;
          if (Math.abs(d) < .3) { p = col.target; col.target = null; } else { p += d * k; busy = true; }
        }
        if (!col.pinned) {
          while (p < col.lo) { p += col.L; if (col.target !== null) col.target += col.L; }
          while (p >= col.lo + col.L) { p -= col.L; if (col.target !== null) col.target -= col.L; }
        }
        col.pos = p; write(col);
      }
      if ((roveClock += dt) > .3) { roveClock = 0; rove(); }
      if (probe.on) { probe.loop.push(performance.now() - t0); if (probe.lastT) probe.frames.push(now - probe.lastT); probe.lastT = now; busy = true; }
      if (busy) raf = requestAnimationFrame(frame);
    }

    /* ---------- f. roving tabindex: one tab stop, the original tile nearest the front ---------- */
    function rove(force) {
      if (mode === 'strip' || !cols.length || (!force && hold.has('focus'))) return;
      const col = cols[primaryCol]; let best = null, bd = Infinity;
      col.dom.forEach(t => { if (!t.orig) return; const d = Math.abs(col.pos + t.j * pitch + th / 2 - col.focal); if (d < bd) { bd = d; best = t; } });
      if (best && best.el !== entry) { if (entry) entry.tabIndex = -1; entry = best.el; entry.tabIndex = 0; }
    }
    function moveTo(col, t, instant) {                // bring one tile to the column's focal line
      const target = col.focal - t.j * pitch - th / 2;
      if (instant || still()) { col.pos = target; col.target = null; write(col); } else { col.target = target; kick(); }
    }
    function focusTile(col, t) {
      if (entry && entry !== t.el) entry.tabIndex = -1;
      entry = t.el; entry.tabIndex = 0;
      cols.forEach(c => c.pinned = c === col);
      moveTo(col, t);
      t.el.focus({ preventScroll: true });
    }
    stage.addEventListener('keydown', e => {
      if (mode === 'strip') return;
      const el = e.target.closest('.wall-tile'); if (!el) return;
      const col = cols.find(c => c.dom.some(t => t.el === el)); if (!col) return;
      const cur = col.dom.find(t => t.el === el), origs = col.dom.filter(t => t.orig), idx = origs.indexOf(cur);
      let go = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') go = [col, origs[(idx + (e.key === 'ArrowDown' ? 1 : -1) + origs.length) % origs.length]];
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const nc = cols[(col.c + (e.key === 'ArrowRight' ? 1 : -1) + cols.length) % cols.length];
        let best = null, bd = Infinity;
        nc.dom.forEach(t => { if (!t.orig) return; const d = Math.abs(nc.pos + t.j * pitch + th / 2 - nc.focal); if (d < bd) { bd = d; best = t; } });
        go = [nc, best];
      } else if (e.key === 'Home' || e.key === 'End') go = [col, origs[e.key === 'Home' ? 0 : origs.length - 1]];
      if (go && go[1]) { e.preventDefault(); focusTile(go[0], go[1]); }
    });
    stage.addEventListener('focusin', e => {
      const el = e.target.closest('.wall-tile'); if (!el || mode === 'strip' || !el.matches(':focus-visible')) return;   // keyboard focus only; a mouse click does not freeze the wall
      hold.add('focus'); speedMul = 0;
      const col = cols.find(c => c.dom.some(t => t.el === el)), t = col && col.dom.find(x => x.el === el);
      if (t && !col.pinned) { cols.forEach(c => c.pinned = c === col); moveTo(col, t); }
    });
    stage.addEventListener('focusout', e => {
      if (stage.contains(e.relatedTarget) || hold.has('dialog')) return;
      hold.delete('focus'); cols.forEach(c => c.pinned = false); kick();
    });
    stage.addEventListener('pointerdown', e => { if (e.target.closest('.wall-tile[aria-hidden]')) e.preventDefault(); }); // clones never take focus
    ['pointerdown', 'wheel', 'touchstart'].forEach(t => stage.addEventListener(t, () => userInput(), { passive: true }));   // any direct use of the wall ends the autoplay

    /* ---------- g. hover pause (mouse only) and drag-to-scrub (mouse / pen; never wheel, never touch) ---------- */
    stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hold.add('hover'); kick(); } });
    stage.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hold.delete('hover'); kick(); } });
    stage.addEventListener('pointerdown', e => {
      if (mode === 'strip' || e.pointerType === 'touch' || e.button !== 0) return;
      drag.id = e.pointerId; drag.x = e.clientX; drag.y = e.clientY; drag.moved = false; drag.vel = 0; drag.t = e.timeStamp; inertia = 0;
    });
    stage.addEventListener('pointermove', e => {
      if (e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 6) return;
      if (!drag.moved) { drag.moved = true; stage.setPointerCapture(e.pointerId); stage.classList.add('is-dragging'); userInput(); }
      const along = (dx * drag.ax + dy * drag.ay) * drag.scale;          // screen drag → plane px along the columns
      const dtm = Math.max(1, e.timeStamp - drag.t);
      drag.pending += along; drag.vel = drag.vel * .7 + (along / dtm * 1000) * .3;
      drag.x = e.clientX; drag.y = e.clientY; drag.t = e.timeStamp;
      cols.forEach(c => c.target = null); kick();
    });
    function endDrag(e) {
      if (e.pointerId !== drag.id) return;
      if (drag.moved) { inertia = still() ? 0 : Math.max(-1800, Math.min(1800, drag.vel)); stage.classList.remove('is-dragging'); drag.quietUntil = performance.now() + 80; }
      drag.id = null; drag.moved = false; kick();
    }
    stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('click', e => {
      const el = e.target.closest('.wall-tile'); if (!el) return;
      if (e.detail && performance.now() < drag.quietUntil) { e.preventDefault(); return; }   // the click that ends a drag is not a click (keyboard clicks have detail 0)
      userInput();
      const i = +el.dataset.i, orig = el.getAttribute('aria-hidden') ? (stage.querySelector(`.wall-tile[data-i="${i}"]:not([aria-hidden])`) || el) : el;
      onOpen(i, orig);
    });

    /* ---------- h. page scroll nudges the columns (read scrollY in the passive handler, consume in the loop) ---------- */
    addEventListener('scroll', () => { const y = scrollY; scrollAcc += y - lastScrollY; lastScrollY = y; if (scrollAcc) kick(); }, { passive: true });
    new IntersectionObserver(es => { inView = es[0].isIntersecting; if (inView) kick(); }).observe(wall);
    document.addEventListener('visibilitychange', () => { docVisible = !document.hidden; if (docVisible) kick(); });

    /* ---------- i. MOMENTS API ---------- */
    function applyFocusClasses() {
      wall.classList.toggle('has-focus', !!focus);
      wall.querySelectorAll('.wall-tile').forEach(el => el.classList.toggle('is-front', !!focus && el.dataset.wallMoment === focus));
      if (legendProduct) legendProduct.textContent = focus ? MOMENT_NAME[focus] : 'All products';
    }
    function focusProduct(m, o) {
      focus = MOMENT_NAME[m] ? m : null;
      const instant = (o && o.instant) || still();
      applyFocusClasses();
      if (mode === 'strip') {
        const el = focus && stage.querySelector(`.wall-tile[data-wall-moment="${focus}"]`), sc = stage.firstElementChild;
        if (el && sc) sc.scrollTo({ left: el.offsetLeft - sc.firstElementChild.offsetLeft, behavior: instant ? 'auto' : 'smooth' });
        return;
      }
      if (focus) cols.forEach(col => {
        let best = null;
        col.list.forEach((it, i) => {
          if (it.moment !== focus) return;
          let d = col.focal - (col.pos + i * pitch + th / 2);
          d = ((d % col.L) + col.L * 1.5) % col.L - col.L / 2;              // shortest way round the loop
          if (best === null || Math.abs(d) < Math.abs(best)) best = d;
        });
        if (best === null) return;
        if (instant) { col.pos += best; col.target = null; write(col); } else col.target = col.pos + best;
      });
      if (instant) rove(true);
      kick();
    }

    /* ---------- j. motion preference changed (the page's Pause motion toggle, or the OS setting) ---------- */
    function motion() {
      if (still()) { inertia = 0; cols.forEach(c => { if (c.target !== null) { c.pos = c.target; c.target = null; write(c); } }); }
      kick();
    }
    mqReduce.addEventListener('change', motion);
    function pause(reason) { reason = reason || 'api'; hold.add(reason); if (reason === 'dialog') speedMul = 0; kick(); }
    function resume(reason) {
      reason = reason || 'api'; hold.delete(reason);
      if (reason === 'dialog' && !stage.contains(document.activeElement)) { hold.delete('focus'); cols.forEach(c => c.pinned = false); }
      kick();
    }

    /* ---------- k. boot + resize ---------- */
    let rz = 0;
    new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(layout); }).observe(wall);
    [mqDesk, mqTab].forEach(q => q.addEventListener('change', layout));
    layout();

    /* ---------- public API (+ dev probes) ---------- */
    return {
      focusProduct, motion, pause, resume, items,
      debug() { return { mode, preset, primaryCol, lowPower, cols: cols.map(c => ({ c: c.c, vis: c.vis, items: c.list.map(it => it.product + ':' + it.i), K: c.K, mid: c.mid, L: Math.round(c.L), V: [Math.round(c.V0), Math.round(c.V1)], focal: Math.round(c.focal), fscreen: c.fscreen.map(Math.round), pos: Math.round(c.pos) })) }; },
      perf(ms = 3000) {       // frame-time probe: frames (rAF deltas) and JS cost of one loop iteration
        probe.on = true; probe.frames = []; probe.loop = []; probe.lastT = 0; kick();
        return new Promise(res => setTimeout(() => {
          probe.on = false;
          const s = a => a.slice().sort((x, y) => x - y), q = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : 0;
          const f = s(probe.frames), l = s(probe.loop), avg = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
          res({ frames: f.length, frameMs: { avg: +avg(f).toFixed(2), p50: +q(f, .5).toFixed(2), p95: +q(f, .95).toFixed(2), max: +(f[f.length - 1] || 0).toFixed(2) },
            loopMs: { avg: +avg(l).toFixed(3), p95: +q(l, .95).toFixed(3), max: +(l[l.length - 1] || 0).toFixed(3) },
            tiles: { unique: items.length, dom: wall.querySelectorAll('.wall-tile').length, perColumn: cols.map(c => c.cnt + '×' + c.K) }, mode, comp: Q.get('comp') || 'lay', lowPower });
        }, ms));
      },
    };
  }
  return { create, mediaHTML, PRODUCTS, MOMENT_NAME, PROVENANCE, PRESETS };
})();
/* ===== HERO WALL ENGINE: END ===== */
```

### 11.5 Reference host glue (spike page: lightbox, autoplay, moments, Pause motion)

```js
/* ===== SPIKE PAGE GLUE: BEGIN =====================================================================
   What the host page provides around the engine: lightbox, hero autoplay, moment buttons, Pause motion.
   In M3 these already exist in the page controller (openLightbox, setMoment/autoplay, motionChanged) — see the
   adapter in HERO-WALL-SPEC.md §6; this block is the stand-alone equivalent for the spike.
   ================================================================================================ */
(function () {
  'use strict';
  const Q = new URLSearchParams(location.hash.slice(1));
  const root = document.documentElement;
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => mqReduce.matches || root.dataset.motion === 'reduce';

  /* ---------- lightbox (simple dialog) ---------- */
  const lb = document.getElementById('lb'), lbMedia = lb.querySelector('[data-lb-media]');
  let lbIndex = 0, lbReturn = null, wall = null;
  function renderLightbox() {
    const it = wall.items[lbIndex], p = HeroWall.PRODUCTS[it.product] || { name: it.product };
    lbMedia.style.setProperty('--hw-tile-bg', it.bg || (it.tone === 'light' ? '#FFFFFF' : 'var(--navy-950)'));
    lbMedia.innerHTML = HeroWall.mediaHTML(it, true);
    lbMedia.querySelector('img').alt = it.alt;
    lb.querySelector('[data-lb-title]').textContent = p.name;
    lb.querySelector('[data-lb-caption]').textContent = it.caption;
    lb.querySelector('[data-lb-prov]').textContent = HeroWall.PROVENANCE[it.kind];
  }
  function openLightbox(i, tileEl) { lbIndex = i; lbReturn = tileEl; renderLightbox(); wall.pause('dialog'); lb.showModal(); }
  lb.addEventListener('close', () => { if (lbReturn) lbReturn.focus({ preventScroll: true }); wall.resume('dialog'); });
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.querySelector('[data-lb-close]').addEventListener('click', () => lb.close());
  const step = d => { lbIndex = (lbIndex + d + wall.items.length) % wall.items.length; renderLightbox(); };
  lb.querySelector('[data-lb-prev]').addEventListener('click', () => step(-1));
  lb.querySelector('[data-lb-next]').addEventListener('click', () => step(1));
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1); });

  /* ---------- hero autoplay AI → Automation → IoT → Security (once), moment buttons ---------- */
  const SEQ = ['ai', 'auto', 'iot', 'sec'], HOLD = 2800;
  const momentsEl = document.querySelector('.moments'), momentBtns = [...document.querySelectorAll('.moment[data-moment]')];
  let apTimer = 0, apIdx = -1;
  momentsEl.style.setProperty('--hold', HOLD + 'ms');
  function setMoment(m) { momentBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.moment === m))); wall.focusProduct(m); }
  function stopAutoplay() { clearTimeout(apTimer); apTimer = 0; apIdx = -1; momentsEl.classList.remove('is-autoplay'); }
  function stepAutoplay() {
    if (isReduced()) return stopAutoplay();
    if (apIdx < SEQ.length) { setMoment(SEQ[apIdx++]); apTimer = setTimeout(stepAutoplay, HOLD); }
    else { stopAutoplay(); setMoment(null); }
  }
  function autoplay(delay) { stopAutoplay(); if (isReduced() || Q.has('qa') || Q.has('noauto')) return; momentsEl.classList.add('is-autoplay'); apIdx = 0; apTimer = setTimeout(stepAutoplay, delay); }
  momentBtns.forEach(b => b.addEventListener('click', () => {
    stopAutoplay(); setMoment(b.getAttribute('aria-pressed') === 'true' ? null : b.dataset.moment);
  }));

  /* ---------- Pause motion (persisted; same key as M3) ---------- */
  const toggles = [...document.querySelectorAll('[data-motion-toggle]')];
  function syncToggle() { toggles.forEach(t => { t.setAttribute('aria-pressed', String(isReduced())); t.setAttribute('aria-label', isReduced() ? 'Resume motion' : 'Pause motion'); }); }
  toggles.forEach(t => t.addEventListener('click', () => {
    if (root.dataset.motion === 'reduce') { delete root.dataset.motion; try { localStorage.removeItem('meerana-motion'); } catch (e) {} }
    else { root.dataset.motion = 'reduce'; try { localStorage.setItem('meerana-motion', 'reduce'); } catch (e) {} stopAutoplay(); }
    syncToggle(); wall.motion();
  }));
  mqReduce.addEventListener('change', () => { syncToggle(); if (isReduced()) stopAutoplay(); });

  /* ---------- boot ---------- */
  wall = HeroWall.create(document.getElementById('wall'), WALL_ITEMS, {
    isReduced, illustrations: ILLUSTRATIONS, dev: Q, onOpen: openLightbox, onUserInput: stopAutoplay,
  });
  window.MeeranaWall = wall;                       // QA handle (perf probe, debug); not needed in production
  syncToggle();
  const qa = Q.get('qa');
  if (HeroWall.MOMENT_NAME[qa]) { momentBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.moment === qa))); wall.focusProduct(qa, { instant: true }); }
  else autoplay(1200);
})();
/* ===== SPIKE PAGE GLUE: END ===== */
```

### 11.6 Wasel illustration generator (optional; the two SVG files in `hero-wall/` are its output)

```js
/* =====================================================================================
   HERO WALL ILLUSTRATIONS: BEGIN · 0. WASEL ILLUSTRATIONS — isometric hairline drawings (navy + copper), returned as SVG strings and used as
      data-URI images (WALL_ITEMS[].svg). In production, export them once as static .svg files instead.
   ===================================================================================== */
const ILLUSTRATIONS = (function () {
  /* Drawn on a 640×400 board shown at ≈ 336×210 on the wall, so strokes are ≈ 2 units (1 px on screen) and labels 19 units (10 px). */
  const C = { bg: '#071629', grid: '#33465F', road: '#0B1D35', edge: '#46586F', dash: '#8A94A2', label: '#B5BBC3', lead: '#6B7889',
    cu: '#C58A52', sand: '#D9C1A3', top: '#25405F', left: '#1A3150', right: '#112540', ink: '#C1C6CD' };
  const C30 = Math.cos(Math.PI / 6), r1 = n => Math.round(n * 10) / 10;
  const iso = (S, cx, cy) => (x, y, z = 0) => [r1(cx + (x - y) * C30 * S), r1(cy + (x + y) * .5 * S - z * S)];
  function fit(pts3, [x0, y0, x1, y1]) {             // scale + centre a set of 3D key points into a screen box
    const xy = pts3.map(p => [(p[0] - p[1]) * C30, (p[0] + p[1]) * .5 - (p[2] || 0)]);
    const minx = Math.min(...xy.map(p => p[0])), maxx = Math.max(...xy.map(p => p[0])), miny = Math.min(...xy.map(p => p[1])), maxy = Math.max(...xy.map(p => p[1]));
    const S = Math.min((x1 - x0) / (maxx - minx), (y1 - y0) / (maxy - miny));
    return iso(S, (x0 + x1) / 2 - S * (minx + maxx) / 2, (y0 + y1) / 2 - S * (miny + maxy) / 2);
  }
  const pts = (P, a) => a.map(p => P(p[0], p[1], p[2] || 0).join(',')).join(' ');
  const poly = (P, a, attr) => `<polygon points="${pts(P, a)}" ${attr}/>`;
  const ln = (P, a, b, attr) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attr}/>`; };
  function box(P, [x0, x1], [y0, y1], [z0, z1], s = C.ink, w = 2) {   // visible faces in this view: +x (right), +y (left), top
    const st = `stroke="${s}" stroke-width="${w}" stroke-linejoin="round"`;
    return poly(P, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], `fill="${C.right}" ${st}`) +
           poly(P, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], `fill="${C.left}" ${st}`) +
           poly(P, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], `fill="${C.top}" ${st}`);
  }
  function grid(P, n) {
    let g = '';
    for (let i = -n; i <= n; i++) g += ln(P, [i, -n], [i, n], '') + ln(P, [-n, i], [n, i], '');
    return `<g stroke="${C.grid}" stroke-width="1.2" mask="url(#fade)">${g}</g>`;
  }
  const FONT = 'font-family="ui-monospace, Consolas, Menlo, monospace" font-size="19" letter-spacing="1.5"';
  const label = (x, y, text, anchor = 'start', fill = C.label) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" ${FONT} fill="${fill}">${text}</text>`;
  const lead = (a, b) => `<polyline points="${a[0]},${a[1]} ${r1(b[0])},${r1(b[1])}" fill="none" stroke="${C.lead}" stroke-width="1.5"/><circle cx="${a[0]}" cy="${a[1]}" r="3.5" fill="${C.lead}"/>`;
  function frame(body, title) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400">` +
      `<defs><radialGradient id="rg" cx="50%" cy="56%" r="64%"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".65" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
      `<mask id="fade"><rect width="640" height="400" fill="url(#rg)"/></mask></defs>` +
      `<rect width="640" height="400" fill="${C.bg}"/>${body}` +
      label(30, 46, 'WASEL', 'start', C.sand) + label(110, 46, title, 'start', C.dash) + label(610, 46, 'ILLUSTRATION', 'end', C.lead) + `</svg>`;
  }
  // a barrier arm raised by `deg`, pivoting at (px,py,pz), pointing toward −y; copper / navy stripes
  function arm(P, px, py, pz, len, deg) {
    const a = deg * Math.PI / 180, dy = -Math.cos(a), dz = Math.sin(a), t = .2, seg = 7;
    let s = '';
    for (let i = 0; i < seg; i++) {
      const u0 = len * i / seg, u1 = len * (i + 1) / seg;
      const A = [px + .09, py + dy * u0, pz + dz * u0], B = [px + .09, py + dy * u1, pz + dz * u1];
      s += poly(P, [A, B, [B[0], B[1], B[2] + t], [A[0], A[1], A[2] + t]], `fill="${i % 2 ? C.right : C.cu}" stroke="${C.cu}" stroke-width="1.6" stroke-linejoin="round"`);
    }
    const E = [px - .09, py + dy * len, pz + dz * len + t], E2 = [px + .09, py + dy * len, pz + dz * len + t];
    return s + ln(P, [px - .09, py, pz + t], E, `stroke="${C.cu}" stroke-width="1.6"`) + ln(P, E, E2, `stroke="${C.cu}" stroke-width="1.6"`);
  }
  function phone(P, x0, y0, z, w = .8, h = 1.45) {
    let s = poly(P, [[x0 + .16, y0 + .16, 0], [x0 + w + .16, y0 + .16, 0], [x0 + w + .16, y0 + h + .16, 0], [x0 + .16, y0 + h + .16, 0]], `fill="#000" opacity=".3"`);
    s += box(P, [x0, x0 + w], [y0, y0 + h], [z, z + .1], C.ink, 1.8);
    s += poly(P, [[x0 + .09, y0 + .11, z + .1], [x0 + w - .09, y0 + .11, z + .1], [x0 + w - .09, y0 + h - .11, z + .1], [x0 + .09, y0 + h - .11, z + .1]], `fill="${C.bg}" stroke="${C.lead}" stroke-width="1.2"`);
    s += poly(P, [[x0 + .2, y0 + h - .55, z + .1], [x0 + w - .2, y0 + h - .55, z + .1], [x0 + w - .2, y0 + h - .3, z + .1], [x0 + .2, y0 + h - .3, z + .1]], `fill="${C.cu}"`);
    return s;
  }
  function waves(cx, cy, angDeg) {                       // three signal arcs in screen space, opening toward angDeg
    let s = ''; const a = angDeg * Math.PI / 180, span = .55;
    [20, 34, 48].forEach((r, i) => {
      const x1 = cx + r * Math.cos(a - span), y1 = cy + r * Math.sin(a - span), x2 = cx + r * Math.cos(a + span), y2 = cy + r * Math.sin(a + span);
      s += `<path d="M${r1(x1)} ${r1(y1)} A${r} ${r} 0 0 1 ${r1(x2)} ${r1(y2)}" fill="none" stroke="${C.cu}" stroke-width="2.6" stroke-linecap="round" opacity="${1 - i * .28}"/>`;
    });
    return s;
  }
  function controller(P, x0, y0, h = 1.25) {
    let s = box(P, [x0, x0 + .72], [y0, y0 + .56], [0, h], C.cu, 2);
    s += poly(P, [[x0 + .12, y0 + .56, h * .5], [x0 + .6, y0 + .56, h * .5], [x0 + .6, y0 + .56, h * .85], [x0 + .12, y0 + .56, h * .85]], `fill="${C.bg}" stroke="${C.lead}" stroke-width="1.2"`);
    const [lx, ly] = P(x0 + .24, y0 + .56, h * .3); s += `<circle cx="${lx}" cy="${ly}" r="4" fill="${C.cu}"/>`;
    s += ln(P, [x0 + .56, y0 + .14, h], [x0 + .56, y0 + .14, h + .6], `stroke="${C.ink}" stroke-width="2"`);
    const [ax, ay] = P(x0 + .56, y0 + .14, h + .6); s += `<circle cx="${ax}" cy="${ay}" r="3.5" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
    return s;
  }
  function road(P, n) {
    return poly(P, [[-n, -1.6], [n, -1.6], [n, 1.6], [-n, 1.6]], `fill="${C.road}" mask="url(#fade)"`) +
      `<g mask="url(#fade)">` + ln(P, [-n, -1.6], [n, -1.6], `stroke="${C.edge}" stroke-width="1.8"`) + ln(P, [-n, 1.6], [n, 1.6], `stroke="${C.edge}" stroke-width="1.8"`) +
      ln(P, [-n, 0], [n, 0], `stroke="${C.dash}" stroke-width="1.8" stroke-dasharray="12 14" opacity=".75"`) + `</g>`;
  }
  return {
    waselGate() {
      const pts3 = [[-3.6, 3.0, 0], [-2.88, 3.56, 0], [-3.04, 3.14, 1.9], [-1.9, 1.95, 2.1], [-1.1, 2.65, 0], [-1.5, -1.5, 4.05], [2.0, 2.9, 0], [2.9, 4.4, 0], [2.7, 4.2, 1.6], [-4.4, 3.0, 2.6], [4.4, 4.2, 1.2]];
      const P = fit(pts3, [56, 86, 600, 376]);
      let s = grid(P, 7) + road(P, 8);
      s += ln(P, [-2.2, -1.6], [-2.2, 1.6], `stroke="${C.ink}" stroke-width="3" opacity=".5"`);            // stop line
      s += arm(P, -1.5, 1.95, 1.72, 4.0, 32);
      s += box(P, [-1.9, -1.1], [1.95, 2.65], [0, 2.05], C.cu, 2);                                        // barrier housing
      s += poly(P, [[-1.9, 2.65, 1.5], [-1.1, 2.65, 1.5], [-1.1, 2.65, 1.72], [-1.9, 2.65, 1.72]], `fill="${C.cu}"`);
      s += ln(P, [-2.88, 3.28, 0], [-1.9, 2.4, 0], `stroke="${C.cu}" stroke-width="2" stroke-dasharray="5 5"`); // cable
      s += controller(P, -3.6, 3.0);
      s += phone(P, 1.9, 2.75, 1.45);
      const ph = P(2.3, 2.75, 1.65); s += waves(ph[0] - 8, ph[1] - 16, -150);
      const c1 = P(-3.25, 3.28, 0), a1 = P(-1.5, -1.1, 3.95), p1 = P(2.75, 4.2, 1.55);
      s += lead(c1, [c1[0] - 6, c1[1] + 30]) + label(c1[0] - 6, c1[1] + 52, 'CONTROLLER', 'middle');
      s += lead(a1, [a1[0] + 34, a1[1] + 8]) + label(a1[0] + 40, a1[1] + 15, 'GATE ARM');
      s += lead(p1, [p1[0] + 30, p1[1] + 10]) + label(p1[0] + 36, p1[1] + 17, 'PHONE');
      return frame(s, '· GATE ACCESS');
    },
    waselFlow() {
      const pts3 = [[-4.0, 1.85, 0], [-3.15, 3.35, 0], [-4.0, 1.85, 1.1], [-.7, 2.2, 0], [-.14, 2.9, 0], [-.14, 2.34, 1.9], [2.3, -.85, 0], [3.0, -.15, 0], [2.65, -3.85, 1.75], [2.3, -.85, 1.9], [-4.6, 4.6, 0], [3.4, -.15, -1.2]];
      const P = fit(pts3, [60, 88, 590, 362]);
      let s = grid(P, 7);
      const path = [[-2.9, 2.5], [-0.3, 2.5], [-0.3, -0.5], [2.3, -0.5]];
      s += `<polyline points="${pts(P, path)}" fill="none" stroke="${C.cu}" stroke-width="2.4" stroke-dasharray="9 9" stroke-linejoin="round"/>`;
      s += phone(P, -4.0, 1.85, 1.0, .85, 1.5);
      s += controller(P, -.7, 2.2);
      s += box(P, [2.3, 3.0], [-0.85, -0.15], [0, 1.9], C.cu, 2);
      s += arm(P, 2.65, -0.85, 1.55, 3.0, 0);
      [[P(-3.4, 3.5, 0), 'PHONE'], [P(-.3, 2.95, 0), 'CONTROLLER'], [P(2.75, -.1, 0), 'GATE']].forEach(([at, txt], i) => {
        s += label(at[0], at[1] + 34, '0' + (i + 1) + ' ' + txt, 'middle');
      });
      return frame(s, '· PHONE TO GATE');
    },
  };
})();
/* ===== HERO WALL ILLUSTRATIONS: END ===== */
```

## 12. Open issues

1. **Final crops.** `media/m3/v3/` is still empty, so the wall uses cropped placeholders. Two of them (aibox contract review, agent matrix) show a captured mouse cursor, and several are soft in the lightbox. Swap them in when the v3 set lands, with the sizes in §4.
2. **Caption field.** `m3_media.json` needs a short descriptive `title` per wall item (today's `caption` is the provenance line), plus `tone: "light"` for light UIs.
3. **Moment-change hitch.** One or two dropped frames at the start of each moment change (style recalc for 43 tiles plus a raster flush). It could be halved by reducing clones: the outer columns hold 2 items × 4 copies. Re-measure on a quiet machine and on a MacBook at DPR 2 before porting.
4. **Tablet touch.** There is no swipe scrub on the 2-column plane (it pans the page, by design). If the owner wants touch scrubbing on tablets, use the phone strip up to 1023 px instead.
5. **AI in a Box contract sample.** The text says "sovereign-procurement minimum" and "non-sovereign region". This is sample contract content, not the forbidden "Sovereignty in Your Hands" claim, but the owner may prefer a neutral sample.
6. **Arabic.** RTL mirroring is specified (§10.6) but not built in the spike.
