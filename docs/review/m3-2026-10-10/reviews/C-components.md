# Reviewer C: component craft (design-systems lens)

## 1. Systemic problems
1. **No scale.**
   - Nine control heights: 24/28/32/34/40/44/48/56/60 px.
   - Nine radii: 4/6/14/16/18/20/24/30/pill. Four of them (14/18/20/30) are not tokens.
   - Off-scale type: 11 px (chips, tags, table heads) and 44 px (step numerals).
   - Five dot sizes (6–11 px) with three different glow rings.
2. **Pill soup.**
   - There are eight capsule styles: eyebrow, tag, tag.real, scene chip, capability chip, sequence chip, tab and nav link.
   - Static and interactive capsules look identical. Capability chips look like buttons; Replay is a button dressed as a tag.
   - The Tasree3 card alone carries 10 capsules.
3. **Everything is said three or four times.**
   - Gallery position appears four times: island, counter, sequence chips, card index.
   - Story step appears three times: rail, eyebrow, numeral.
   - Provenance is stacked: section eyebrow, top tag, source tag, deployment hedge.
   - "Talk to Meerana" appears 4×.
   - Mandoobee says "Real app UI" *and* "app mock-up". The eyebrow "real product screens" is false for at least 3 of the 7 cards.
4. **Boxes inside boxes, with six surface recipes.**
   - The recipes: `.surface` (gradient + 2 insets + drop shadow), `.surface-inset`, `.office`, `.dash`, `.pc-frame` (+ sheen + tilt), and a nine-layer glass.
   - Nine different white alphas (4–34 %).
   - Glass is still on the zoom buttons, counter, chips, stage note and lightbox, which breaks "glass only where necessary".
5. **No state model, and fixed-pixel layout.**
   - No component focus, active or disabled styles.
   - Hover is a lift, a recolour or a fill, with no rule.
   - The nav's "current" state looks the same as hover.
   - The menu icon never becomes ×, and pause never becomes play.
   - Touch targets of 24/32/34/40 px, below the 44 px minimum.
   - Fixed widths (428, 860, `50vw−330px`, `100vh−330px`) break at 1024 and 390.

## 2. Component table

| ID | Component | Shots | Sev | Problem | Exact fix | Ref |
|---|---|---|---|---|---|---|
| C01 | Island, expanded | d01, t01 | P1 | Fixed 860 px; links off-centre; 94 px void before pause; nine-layer glass with a bright gradient edge; logo tagline illegible | `width:fit-content` (≤ 960); grid `auto 1fr auto`, links centred; §3 material only (delete noise, sheen, glow, `::before`, `::after`); wordmark-only logo, 20 px | Raycast, Linear |
| C02 | Nav links + CTA | d01 | P1 | Current = hover; CTA 40 px vs hero 48 px; repeats the hero secondary label | Hover: text-primary; current: + `--fill-selected`; CTA = md; hero secondary → "See how it works" | Linear |
| C03 | Island, compact | d03–d09 | P1 | 428 px + `flex:1` chapter = 100–125 px void; "02 · Nazo" sits beside "03 / 07" | fit-content ≤ 400; `flex:none`; label "Products · Nazo", no numerals; ring 16 px | Apple HIG |
| C04 | Island, mobile + activity | m01, m05 | P0 | <480 px leaves an orphan "01 ·"; activity layer cross-fades over compact in the same shape (text over text); 2.6 s; a pill nested in a pill | One layer: activity swaps the label text only (160 ms), ≤ 2 s; dot 8 px, no glow; "Sample" as a text-muted suffix | Apple HIG |
| C05 | Mobile sheet | m08 | P1 | Icon stays "=" when open; CTA styled as a list row; no focus trap or return; no scrim | Icon → Lucide `x`; rows 52 px, text-body 500, `--line` dividers; last row = primary lg, full width; focus trap, Esc returns focus to the menu button; scrim navy-950 60 % | Apple |
| C06 | Pause control | d01, d03 | P1 | Bare 18 px "II" reads as a stray glyph; no play state; both the label *and* `aria-pressed` flip | Icon button md secondary; swap `pause`/`play` at 16 px; fixed label "Pause motion" + `aria-pressed` | Apple AirPods Pro |
| C07 | Buttons | d01, d17 | P2 | Primary lifts, secondary only recolours; arrows navy on one, cyan on the other; no `:active`/`:disabled`; unused `.btn-glass` | §3 spec; arrow `currentColor`; no lift; delete `.btn-glass` | Vercel |
| C08 | Focus | all | P1 | No component focus styles; the base `:focus-visible` sets the element's own radius to 6 px | `outline:2px solid var(--focus-ring); outline-offset:2px`; remove `border-radius` from the base rule | — |
| C09 | Eyebrow | d01, d03, d12, m01 | P0 | Pill padding with no fill indents it 12 px off the heading edge; inline-flex splits it into 3 columns on mobile | `display:block; padding:0`; 6 px dot as inline-block, `margin-inline-end:8px`; text-mono 12 | — |
| C10 | Honesty tags | d03–d09 | P0 | "Real app UI" vs "Real product UI"; the Mandoobee contradiction; eyebrow overclaims; 11 px | One tag per card, in the caption row: "Product UI · <source>", "Design concept · sample data", "Drawing · screens pending", "App mock-up · meerana.ae"; delete the top-right tags; eyebrow "02 · Products" | — |
| C11 | Replay | d01, t01 | P1 | A 24 px tag acting as a button; sits alone on its own line at 1024 | Button sm ghost with `rotate-ccw` 16, 44 px hit area; or delete it | — |
| C12 | Moment tiles | d01, d02, d19-t3, t01 | P0 | "Automation" runs into "IoT" ("AutomatioIoT" at 1024); four text levels in a 100–134 px tile; pressed fill shorter than the row; the top bar looks like a timer but isn't one; radius 18 | Drop the number and caption; name text-small 500, product text-label in accent; `.moment{height:100%}`; `repeat(auto-fit,minmax(8.5rem,1fr))`; radius 16; bar = a real 1,500 ms linear progress, or none | Apple |
| C13 | Gallery counter | d03 | P1 | A 56 px glass pill far right; the fourth position indicator | Delete `hs-count` and `pc-index`; prev/next = icon buttons md secondary, solid, on the switcher row | Apple paddles |
| C14 | Sequence chips | d03–d09 | P1 | The "→" renders inside the active fill; 32 px; the numerals are redundant | Becomes the segmented control: names only, no `::before`, nowrap | Linear |
| C15 | Product card shell | d03–d09, d09b, t02 | P0 | `100vh−330px` spills content out at 1024×768; `.rule` reads as a mis-drawn edge; 100–150 px void; neighbouring cards still legible | `height:auto; min-height:520px`; delete `.rule` and `margin-top:auto`; neighbours opacity .35, `rotateY` ≤ 6°, `pointer-events:none` | Stripe |
| C16 | Logo + descriptor | d03–d09 | P1 | Logos at inconsistent optical sizes, two set as Poppins text; the Mandoobee lockup repeats the descriptor; the descriptor is a 4th label style | Logo slot 40 px high, ≤ 180 px wide, scaled per logo; text names in heading-2; mark without tagline; descriptor = eyebrow style | — |
| C17 | Capability chips | d03–d09 | P1 | Static, but styled as 32 px filled buttons next to real tabs | Plain list: text-ui text-secondary, `check` 16 in accent, 28 px rows; no fill or border | Linear |
| C18 | Deployment line | d04, d09 | P2 | Mono caps wrap; exposes the internal ID "DL-P13" | "Deploys" in text-mono muted + the value in text-ui; hide the row when it is TBC | — |
| C19 | Screen frame + zoom | d03, d05 | P1 | Radius 20; Mandoobee is a square white image in a rounded dark frame; the Nazo crop cuts off "Generate"; sheen + tilt; the glass zoom button covers data | Radius 16, 1 px `--line`, no `::after`, no tilt; export shots at 16:10, full bleed; zoom → icon button sm in the caption row, solid | Raycast |
| C20 | Screen tabs | d04, d05, m03 | P1 | `.surface-inset` overrides `.pill` (18 px radius, cascade order); wraps to 2 rows on mobile; the source tag jumps between lines | Segmented spec; nowrap + overflow-x; tag ellipsis | Vercel |
| C21 | Lightbox | d09c | P1 | Glass over a 78 % scrim; radii not concentric (24/14/14); close button bottom-right; the caption is the full alt text | Solid `--surface-raised`, radius 24, padding 8, image radius 16; header "1 / 4" + short title, close top-right; prev/next lg on the image edges | Apple |
| C22 | Scene chips + brackets | d02, d10, d13–d16, m04–m06 | P1 | Every chip is glass; 11 px; the world chips repeat the office cells; clipped at the viewport edge on mobile; brackets 2 px | Tag recipe on solid navy-950 85 %; ≤ 2 visible at once; clamp to 16 px gutters and auto-flip; delete the world chips; brackets 1.5 px | — |
| C23 | Stage note | d11–d16 | P1 | Tag border + glass edge = a double outline; a third "sample" label on screen | Keep it as the single stage label: tag recipe, solid navy-950 85 %, no glass; replace the per-step `Sample` tags with a "Sample ·" text prefix | — |
| C24 | Timeline rail | d12–d16, t03 | P1 | The 130 px column shoves the cards off the grid (x 282 vs 128); labels wrap to 2–3 lines; 11 px dots with glow | ≥1280 px only, placed in the gutter, 160 px wide, one-line labels; dots 8 px, current = 2 px ring | Apple |
| C25 | Step cards + numerals | d12–d16, t03 | P0 | 182 px wide at 1024: one word per line, heading overflows; the 44 px numeral outranks the content; "R-0142" breaks across lines | `max-width:min(32rem,100%)`; heading-2; delete the numeral; data tokens `white-space:nowrap` | — |
| C26 | Office cells | d10, m04 | P2 | Card inside a card; times at 20 vs 14 px; radius 18; "UK" next to "EET" | Hairline list with 56 px rows; time in text-mono 14, tabular-nums, end-aligned; UTC offsets throughout | — |
| C27 | Dashboard table | d15, m06 | P1 | A third nested box; heat cells merge together; mixed header fonts; "00-06" with a hyphen; the tag wraps | No fill; `border-spacing:2px`; cells 28 px, radius 4; headers text-mono 12 muted, "00–06", tabular-nums | Linear |
| C28 | CTA card | d17 | P2 | 42 rem wide vs 34 rem siblings; the email address is an arrow button; island says "What's next", eyebrow says "What comes next" | Same width as siblings; email → text link + a copy icon button; one label | — |
| C29 | Footer | d18 | P1 | A floating card off the grid (x 36 vs 128); no logo, nav or legal | Full bleed, border-top `--line`, inside `.wrap`; rows for logo + nav, offices, legal; the prototype note as one tag | Linear, Vercel |

## 3. Spec sheet

**New tokens:**
- `--line`: white 8 %.
- `--fill-hover`: white 6 %.
- `--fill-selected`: white 10 %.

**Radius scale:**
- 4: heat cells.
- 8: tooltips.
- 16: nested media, tiles.
- 24: cards, sheet, lightbox.
- pill: buttons, tag, segmented control, nav.
- Rule: inner radius = outer radius − padding.

**Spacing scale (4-pt):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Card padding 24, or 32 at ≥768.
- Inside a card: label→title 8, title→body 16, →list 24, →actions 32.

**Buttons.** All are pill-shaped, Poppins 500, gap 8, Lucide icons at 1.5 stroke.

| Size | Height | Padding | Text | Icon |
|---|---|---|---|---|
| sm | 32 (44 px hit via `::after{inset:-6px}`) | 12 | text-label | 16 |
| md | 40 | 16 | text-ui | 16 |
| lg | 48 | 24 | text-ui | 20 |

- Primary: `--action-primary-bg`; hover `--action-primary-hover`.
- Secondary: 1 px `--border-control`; hover `--fill-hover`.
- Ghost: no border.
- Active: `scale(.98)`.
- Disabled: opacity .4.
- Focus: 2 px `--focus-ring`, offset 2.
- Transitions: `--dur-1`, colour only.

**Tag (the only pill):**
- 24 px high, padding 10, 1 px `--line`, text-mono 12 caps, text-secondary.
- Optional 6 px dot: accent = product UI, muted = concept or drawing, `--state-danger` = alert.
- Never interactive; one per card.

**Card:**
- Solid `--surface-raised`, 1 px `--line`, `inset 0 1px 0` white 4 %, radius 24.
- No shadow and no gradient. Use dividers inside, not nested boxes.
- Elevation: L0 = `--surface-deep`; L1 = card; L2 = nav and sheet only (the only glass).

**Segmented control:**
- Track: 40 px high, padding 4, pill, `--surface-deep` + `--line`.
- Segments: 32 px high, padding 12, text-label 500, text-secondary.
- Selected: `--surface-raised`, text-primary.
- Layout: nowrap with overflow-x.
- Behaviour: `role=tablist`, arrow keys.

**Nav:**
- **Shell:** fixed, top 16, centred pill, padding 6, height 56 in every state. Morph only the width (clip-path 420 ms; labels cross-fade 160 ms).
- **Material:** navy-950 80 %; `saturate(180%) blur(20px)` inside `@supports`; 1 px white 8 %; `inset 0 1px 0` white 10 %; shadow `0 12px 32px -12px` black 50 %.
- **Expanded (≤ 960):** logo | links (md ghost) | pause + CTA (md).
- **Compact (≤ 400):** mark 24 | divider | "Products · Tasree3" in mono 12 | ring 16 | pause | menu.
- **Mobile:** full width − 32; sheet as in C05.
