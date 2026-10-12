# Judge verdict: M3 homepage, review round 2026-10-10

**Checked:**
- The four reviews and two benchmarks, with their screenshots, plus our d/t/m screenshots.
- `m3.tpl.html`, `m3_scene.js`, the built page and `media/m3/*`.
- The evidence register and addendum, plan/05, plan/11 §15, the owner decisions, the product scope, DD-17–21, YISBIR-USE-CASES, DEMO-MEDIA-PLAN and the project skills.

**Key:**
- **Src:** V/C/M/B are the reviews; E = an ENT gap; D = a DESIGN gap or craft item.
- **St:** **C** confirmed · **P** partly · **R** rejected.
- **l.** = a line in `m3.tpl.html`.

## 1. Verdict

M3 is the right concept for this brief. No benchmark has one continuous isometric world built from the logo cell, and it is the only honest route to the owner's "pure 3D page". The execution is a first-pass wireframe: viewport-arithmetic layout, unlit 3D shaded by fixed factors, and back-office labels on the public page. The owner's "MS Paint" verdict is fair.

About 80 % of the reviewers' P0/P1 findings hold up in code or pixels. Most of the overreach comes from the benchmarks. They rewrite the mandated H1, confine 3D to the hero, cut the owner's horizontal gallery, and add a form, FAQ, trust section and mega-menu. Those are rejected here or turned into owner decisions.

All six reviews missed three P0 media problems (J1–J3). Fix order: hygiene and compliance (≈1 day), then the system, then the gallery and 3D.

**Root causes, ranked:**
1. **No system.** No grid, spacing scale or type scale, and no component recipes: 9 control heights, 9 radii, 13+ type sizes, boxes nested 3 deep.
2. **Un-art-directed 3D.** Fixed face factors, 42 % fog at the pivot, outlines on every face, one camera, and morphs fired by thresholds. The #EDEDED cubes outshine the copy.
3. **Viewport-arithmetic layout with a 1024 breakpoint.** `50vw−330px` and `100vh−330px` widths, an 8,208 px page width and a 750vh pin.
4. **Unchecked provenance and media.** Internal IDs and contradictory honesty labels, plus J1–J3.
5. **Metadata louder than content.** About 60 uppercase mono strings, 4 position indicators and 20 glass elements.
6. **No five-second answer.** No lede, no proof, and 7 CTA verbs, all `mailto:`.
7. **Broken pacing.** 16.9 viewports; each hero moment settles for only 0.6 s; the story spreads 70 words over 5.3 viewports.

## 2. Verified ledger

| ID | Src | Claim | St | Evidence checked | Note |
|---|---|---|---|---|---|
| L01 | D§3.13 | 8,208 px page width | C | 7×1100 + 6×28 + 2×170 = 8,208; `.is-pinned .hs-viewport{overflow:visible}`; no ancestor clips | |
| L02 | M17, D§5, E8 | Gallery pin of 750vh, against the ≤150vh rule | C | `dist` = 8,208 − 1,440 = 6,768 px = 7.5 vh | Conflict (b) |
| L03 | C15, B08, V25 | `100vh−330px` card | C | min(560, 438) → `min-height:440` wins; t02 cuts the deploy line and CTA | |
| L04 | V20, B09, C25 | Story column `50vw−330px` | C | l.344: 390 px at 1440, 182 px at 1024 (t03) | |
| L05 | V06, C12, B03 | Moments collide; two bars active | C / P | Collision confirmed: t01 "AutomatioIoT". The logic sets only one `aria-pressed` (l.897); the two bars are the 420 ms `::before` scale-out overlapping the next scale-in, seen in ≈28 % of each 1.5 s hold (d19-t3) | A real defect, but in CSS, not state |
| L06 | V25, B08/09, C | Desktop starts at 1024 | C | `mqWide (min-width:1024px)`, l.789 | |
| L07 | B04, C18, E6 | Internal IDs in public text | C | "name DV-03" l.582, "(DL-P13)" l.655, "name DV-01" l.668; also "v4 film", "Yisbir Figma", "pending", "under review", "to be confirmed" | |
| L08 | B05, C10, E6, D | Provenance labels contradict each other | C | "Real app UI" (l.519) next to "app mock-up" (l.533); the eyebrow "real product screens" is false for 4 of 7 cards | |
| L09 | E§2 | Tailwind runtime loaded without `defer` | C | l.27 (template and built) | Fix by precompiling: `defer` causes FOUC |
| L10 | M02 | 42 % fog at the pivot | C | VS l.1083 `clamp(0.42−…,0,0.62)` | |
| L11 | M01, V07, B02, D8 | Flat faces; white cubes outrank the H1 | C | FS l.1081 factors 1/.66/.46/.3; tone t2 #EDEDED is 15.9:1 against the page | |
| L12 | M03, M04, M07 | Outlines everywhere, no AO, seamed stacks | C | `fwidth*1.15` band; smoke built from cubes (d12) | |
| L13 | M05, M13, M14 | No rotation, so no gate, cone or smoke stories | C | The matrix holds position and scale only (l.1251); iot/sec `anim:'none'` | |
| L14 | M09, M10 | One camera; zoom pumps between chapters | C | `(70,70,70)` plus `framing()` refit; bay cells ≈25 px vs bars ≈85 px | |
| L15 | M11, M12 | Morph fires at 58 %; straight lerp | C | l.1038, l.1234–1244 | "281 cells" not re-measured |
| L16 | M root 5, M06 | Moment settled for only 0.6 s | C | HOLD 1500 − (420 + 480) | |
| L17 | M16, M18, V10 | Gallery 3D wasted; card rotation | C | stage .62 (l.172); rotationY −18→16, z −140, opacity .2 (l.953) | |
| L18 | M19, M20, C, D7 | Glass over a live canvas; loop cost | C / P | 20 glass elements in the markup (D's 24 is a DOM count); DPR 1.5; closures in `frame` | |
| L19 | M15 | 1 px hairlines | C | `THREE.LineSegments` | |
| L20 | V02, E9 | No grid | C | Left edges at 128/140/163/170/282/316 (d01, d03, d10, d12) | |
| L21 | V03, V04, D | Flat type scale | C | H1 70.4 px vs H2 60 px = 1.17×; ≥ 13 sizes | |
| L22 | B21, V12, C, C17, D | Mono caps; "pill soup" | C | ≈60 uppercase strings; 8 capsule styles; Consolas on Windows | Conflict (h) |
| L23 | V01, C, D | Boxes nested 3 deep | C | `.surface` › `.office` / `.dash` / `.surface-inset` | Fix per (d) |
| L24 | V11, C15, B11 | Card void | C | `margin-top:auto` (l.298) | B11's spec strip **R**: new content, and Mandoobee's languages are unconfirmed (EV-427) |
| L25 | C13, C14, B12, V10 | Position shown 4 times | C | Island, `hs-count`, `hs-seq`, `pc-index` | |
| L26 | V13–15, C19, D | Screens pasted in | C | White JPEG with `contain`; d05 "Gener"; AI in a Box text ≈5 px; radius 20, sheen, tilt | |
| L27 | V16, C16 | Logos vary; strip the descriptors | P | Sizes vary ≈3×, but stripping a lockup modifies official artwork (meerana-brand §5) | Use the official symbol-only lockup; drop the duplicated HTML descriptor |
| L28 | V17, D9 | Cyan does 9 jobs | C | d01–d18 | |
| L29 | V18, C21 | Lightbox is glass on glass | C | `glass-strong` over a 78 % scrim; close button bottom-right | |
| L30 | V09, C01–03, C06 | Island widths, voids, glass, "II" | C | Fixed 860 and 428 px; `flex:1` on the chapter; both the label and `aria-pressed` flip | |
| L31 | C04, B15, V24 | Mobile "01 ·"; 2.6 s activity | C | <480 hides only the name; `setTimeout 2600` | |
| L32 | D7, E4 | Nav degrades after the hero | C / P | d03–d18. E's mega-panel **R**: there are no product pages, and it adds content | Conflict (c) |
| L33 | C05, B16 | Mobile sheet | C | The icon stays "="; no trap, scrim or focus return | B16's EN/عربي switch **R**: Arabic is phase 2 (DL-L01) |
| L34 | C09, V05, C11 | Eyebrow indent, meta line, Replay | C | `.eyebrow` padding 12; Replay is a 24 px `.tag` | |
| L35 | V19, C26, C22, B07 | Offices | C / P | Nesting, and "UK" next to "EET", confirmed. "Cities placed arbitrarily" **P**: `at()` does project lon/lat, but coarsely | Keep the clocks as a ruled column (D says keep, B says cut) |
| L36 | V08, V20, B17, C23–25, M22, D4 | Story voids, triple labels, 5.3 viewports | C | 6 beats at 86–100vh; 44 px numeral; "Sample" ×3 | B17/D4 hard pin **R** (pin budget). V08 "no card" **R** (the owner wants solid cards over live 3D) |
| L37 | V21, C27 | Dashboard nesting and fold | C | d15 | C27 "hyphen" **R**: `BANDS` uses U+2013 |
| L38 | V22, C28, B13, B19, D9, E3 | Same `mailto:` twice; 7 verbs | C | 9 `mailto:` links | A form **R** for the prototype: there is no backend. Conflict (i) |
| L39 | V23, C29, B20, E5, D5 | Footer is a toast | C | `margin:0 12px 12px`, so text sits at x 36 | The "Prototype" note is honest; it only blocks launch |
| L40 | B10, B14, V24, E10, D10 | Mobile voids; no CTA above the fold | C | `--r-bottom:56%`, `padding-top:46svh`; m01 | Bottom bar **R**: a second nav |
| L41 | B01, E2, D2 | Unclear in five seconds | C | No lede | H1 rewrites **R**: the H1 is binding, and "government" implies unverified clients (EV-243). B01's clause "deployed on-premise or in your cloud" **R**: a blanket claim, contradicted by DL-P13 |
| L42 | B02, E2, D3 | Moments don't read; real UI in the hero | P | d02b reads as a "striped slab" | UI replacing the 3D hero **R** ("Pure 3D"); larger UI goes in the gallery |
| L43 | B07, E1, D1 | No proof | C / P | Grep finds none | Wording errors: Future 100 is a *selection*; Dubai Chambers = "Supported by"; ELMA 2023 is omitted; the founder needs consent (EV-013) |
| L44 | E4, E5, E7, E§3.12 | Product pages, trust centre, deployment section, FAQ | R / P | "Don't add more content"; no pages exist | Production backlog |
| L45 | E8, D4 | 16.9 viewports | C | ENT metrics | 8–9 viewports **R** as infeasible: conflict (j) |
| L46 | B22, C08, C07 | Accessibility | P | 11 px labels and the index hidden <768: confirmed. C08: the rule is in `@layer base`, so component radii win | Real gaps: focus untested in island, gallery and lightbox; no `:active`/`:disabled`. `.btn-glass` unused |
| L47 | B23, B18 | Taxonomy; "Automation acts" | C (P2) | DD-20 already avoids cross-product claims | The "auditors" line needs Yisbir PO confirmation |
| **J1** | judge | **Yisbir boards break DL-P07** | **C P0** | `yisbir-safety` and `yisbir-security` show ANPR/LPR plates (D18 "not in public demos"), "Weapon armory" and "Armed trespass" (D20 "do not publish"), plus K9, VIP and drone tiles with no evidence. The source is the "dubaiPolice" Figma, so it needs permission | Missed by all |
| **J2** | judge | **AI in a Box media claim sovereignty** | **C P0** | "AI in a Box. Sovereignty in Your Hands" appears under the logo and in the UI footer of the poster, loop and stills; DL-P13 forbids it | Missed |
| **J3** | judge | **Nazo media show a government tenant** | **C P0** | The loop and `nazo-templates.webp` show "Trademark Registration Approval" and "Ministry staff / Undersecretary" (EV-547 do-not-use, B1) | Missed |
| J4 | judge | Docs contradict the code | C P1 | DD-17 says "no hard pins"; DD-22 and DD-24 are cited but not recorded; l.33 says "glass on every surface" | Doc owner |
| J5 | judge | DD-19 caption missing | C P1 | The heading alone implies integration (EV-473, DL-P06) | |
| J6 | judge | Tasree3 deploy line stated as fact | C P2 | EV-407: phrase it as an option | |
| J7 | judge | `interest` enum incomplete | C P2 | plan/11 §15 lacks `nazo` and `ai-in-a-box` | Production |

## 3. Conflict resolutions

| # | Resolution | Owner decision? |
|---|---|---|
| a · Pure 3D vs hero + one sequence | Keep one persistent world: it is the owner's ask and the differentiator. Adopt the benchmarks' **discipline**, not their scope:<br>• nothing brighter than navy-200;<br>• one cyan accent per frame;<br>• never under body text without a solid card or a 60 % scrim;<br>• the loop stops while the stage is hidden (gallery, lightbox) or idle;<br>• formations go from 21 to 12 (cut `layer0–6`, `layerAll`, `assets`). | No |
| b · Horizontal gallery vs pin rule | Keep the horizontal scroll and fade.<br>• **≥1280×760:** one hard pin of **250vh** (5 × 50vh), snapping per card, opacity .35↔1, never 0. This exceeds the 150vh per-pin limit but stays within the 300vh page limit, because the story becomes a sticky stage.<br>• **Below that, or with reduced motion:** a native snap rail. | **Yes**: approve the exception. Fallback: rail, 0vh |
| c · Dynamic Island vs visible links | **≥1280:** expanded at every scroll position, with links. "Dynamic" means the pill settles narrower after the hero, and a live-activity row drops *below* the links for ≤2 s during the story. Compact only below 1280. | No |
| d · Solid cards vs remove boxes | These are compatible.<br>• **Solid cards stay:** the 6 product cards, the 5 story steps (they sit over live 3D), the lightbox and the sheet.<br>• **Boxes go:** the moments tray, offices, CTA, footer, office cells, the inner dashboard box, the tab inset.<br>• One recipe, one level. | No |
| e · No new content vs additions | **Net-content rule:** add only what is structural or legal, or owner-approved, and pay for each addition with cuts.<br>• **Footer:** yes.<br>• **Lede and proof:** owner. The lede is paid for by cutting the coordinates, "Fig. 1", Replay, and the moment numerals and captions (≈ −20 words). Proof goes *inside* "Built in the UAE" and replaces the office cards.<br>• **Rejected:** picker, form, FAQ, trust section, spec strip, language switch, bottom bar. | **Yes** (lede, proof) |
| f · Six-item layer vs 7 panels; EV-473 | **Six panels** in the reviewer's order, with **Wasel in Asset Tracking's slot**: Mandoobee → Tasree3 → Nazo → Yisbir → Wasel → AI in a Box.<br>• **Why:** Asset Tracking is excluded (DL-P05) and has no screens or logo. Wasel is owner-confirmed (EV-530) and is already the IoT moment.<br>• **Heading:** keep it only as a portfolio heading, with the DD-19 caption, and re-class EV-473 once it is approved. | **Yes** (swap; heading) |
| g · Poppins 300 vs 400–500 | **300 for the H1 and the CTA headline only** (the ui-system M1 rule). All other headings 400; nothing below 18 px under weight 400. Fix the hierarchy by **scale** (72/44). Gate: a Windows Chrome render check; set the grey span to 400 if it breaks up. | No |
| h · System mono vs "code editor" | Keep the system mono (DD-06); no Plex Mono, which is YISBIR's. Use mono only for data (times, table figures, sample IDs), with tabular numerals. Never uppercase mono for nav, eyebrows, tags or deployment lines. At most 2 mono strings per viewport. | No |
| i · `mailto:` vs form | **Prototype:** `mailto:` only, one verb pattern, a prefilled subject, no fake form.<br>**Production:** a 5-field form to `POST /v1/enquiries` (plan/11 §15), with Turnstile, consent and an email fallback on 503. Add `nazo` and `ai-in-a-box` to `interest`. | No (DL-T04 and T06 already open) |
| j · Length vs mandated chapters | **≤10 viewports at 1440:** hero 1 · layer 3.5 · UAE 1 · story 3 · CTA and footer 1.2 = 9.7. Mobile ≤9 screens. Without the pin exception, ≈7.4. | No |

## 4. Change plan

### 4a. Proof and copy, verified against the register (use verbatim)

| Item | Allowed wording | EV · status | Condition |
|---|---|---|---|
| Future 100 | "Selected for Future 100 (2023) — UAE Ministry of Economy & the Government Development and the Future Office" | EV-202 · ok-to-use | A selection: never "award" or "Top 100" |
| ELMA | "Emirates Labour Market Award 2023 (MOHRE) — Workforce Wellbeing & Quality of Life" | EV-200 · use-with-edit | Only after the certificate is seen |
| Best small enterprise | "Best small enterprise in the UAE — honoured at the GCC Labour Ministers Committee ceremony, Doha (September 2024)" | EV-203 · ok-to-use | Never "best in the GCC" or "MOHRE 2024" (EV-201, EV-204) |
| Software AG | "Joined Software AG's PartnerConnect programme (2022)" | EV-240 · ok-to-use | Past tense |
| FPT Software | "Strategic partnership (MoU) with FPT Software, 2024" | EV-505 · ok-to-use | |
| Commvault | "Value Added Partner for Commvault — announced at GITEX Global 2024" | EV-506 · ok-to-use | |
| CyberHive | "MoU with CyberHive, 2025 — Dubai Business Forum, London" | EV-507 · ok-to-use | Never attribute its ISO 27001 to Meerana |
| Botminds | "Regional partner — Botminds" | EV-508 · ok-to-use | No year |
| Dubai Chambers | "Supported by Dubai Chambers" | EV-509 · ok-to-use | A host, not a partner |
| Lede | "An AI-powered ecosystem of six enterprise products — for AI, automation, IoT and security." | EV-006, EV-536 · ok-to-use | Needs owner approval |
| **Never** | Logos (DL-R02); client names or logos (EV-243); ISO (EV-220/221); SAP Gold (EV-242); Microsoft (EV-510); "40+/50+" (EV-018); "Dubai SME" (EV-019); the founder (EV-013, consent); any AI in a Box sovereignty or on-prem claim (DL-P13) | | Text placards only, in a ruled list |

### Phase 0: bugs and hygiene (≈1 day)

| ID | Change | Exact spec | Files / functions | Eff | Dep | Acceptance |
|---|---|---|---|---|---|---|
| 0.1 | Overflow | `#products{overflow-x:clip}` | tpl `.hs` | S | — | `scrollWidth = innerWidth` at 390/1024/1440 at all scroll positions |
| 0.2 | Internal strings | Remove visible DV/DL/EV IDs and "film", "Figma", "pending", "to be confirmed", "under review", "to come"; keep the source in `data-source` | l.519–668 | S | — | Visible-text grep = 0 |
| 0.3 | One caption per card | **Allowed labels:**<br>• "Product screen · demo data" (Tasree3, Nazo, AI in a Box)<br>• "App mock-up" (Mandoobee)<br>• "Design concept · sample data" (Yisbir)<br>• "Illustration" (Wasel)<br>Delete the top tags; the eyebrow becomes "Products" | `.pc-top`, `.pc-meta` | S | 1.7 | No double or contradictory label |
| 0.4 | Media compliance (J1–J3) | **AI in a Box:** mask "Sovereignty in Your Hands" and "Meerana OS v…".<br>**Nazo:** crop the loop to the generator panel (top ≈40 %); delete `nazo-templates.webp`.<br>**Yisbir:** use 3 crops of evidenced detections (PPE counters, attendance/zone counts, a smoke incident), with tabs "PPE · Attendance · Fire & smoke". No plates, faces, weapons, K9, VIP or drone. Full boards stay internal until permission | `media/m3/*`, l.574–668 | M | Owner 6, 7 | A frame-by-frame review is clean |
| 0.5 | Moments | `.moment{height:100%}`; 4 columns ≥1280, 2×2 below; drop `.m-no` and `.m-cap`.<br>Bar: `[aria-pressed=true]::before{animation:mp var(--hold) linear forwards}`, with no transition on exit; HOLD 2,800 ms | `.moment*`, `stepAutoplay` | S | — | A 60 fps capture never shows 2 bars; no overlap at 1024/1280/1440 |
| 0.6 | Breakpoint 1280 | `mqWide (min-width:1280px)`; pin only `and (min-height:760px)`; `.pcard{height:auto}`; story column `min(32rem,100%)` | l.54/168/272/344/789, `hsBuild` | S | — | At 1024×768 and 1366×768: nothing clipped |
| 0.7 | Counters | Island shows the chapter name only; no "01–05" numerals; one "What comes next" | `CH`, `setBeat` | S | — | No disagreeing counters |
| 0.8 | Island overlap | `.island-wrap::before` 96 px fade from navy-950; `scroll-margin-top:96px` | CSS | S | — | No legible text behind the island |
| 0.9 | Copy | Hide the AI in a Box deploy row; Tasree3 "Can run in your own cloud or data centre"; add the DD-19 caption | l.498/545/655 | S | — | Matches the EV rows |
| 0.10 | Toggles | Fixed label "Pause motion" + `aria-pressed`; the icon swaps pause/play; menu icon → × | `syncToggle`, `openSheet` | S | — | axe clean |

### Phase 1: foundation system

| ID | Change | Exact spec | Eff | Acceptance |
|---|---|---|---|---|
| 1.1 | Grid | 12 columns; `--margin:clamp(16px,5.56vw,80px)`, `--gutter:clamp(16px,1.67vw,24px)`, container `min(1280px,100%−2×margin)`. Text in columns 1–6 (628 px at 1440); scene rect from column 6 | M | One left edge per viewport |
| 1.2 | Spacing | 4/8/12/16/24/32/48/64/96/128 only; section padding 128/96/64 | M | No 6/10/14/18/22/26/30 px |
| 1.3 | Type (8 sizes) | 72 display (300, lh 1.0, −0.035em, max 9.5em) · 44 H2 (400, −0.025em) · 28 H3 · 20 lede · 16 body · 14 UI · 13 caption/label · 12 mono data. Override in m3 `:root` | M | ≤8 computed sizes; H1:H2 = 1.64 |
| 1.4 | Colour roles | Page navy-950; card `--meerana-navy`. Text white / navy-200 / navy-300. Cyan = interactive, active, focus, plus one 3D accent. Product accents only on the card's 2 px rule and logo | S | Cyan on ≤4 element types |
| 1.5 | Card (only one) | `--meerana-navy`, 1 px white 8 %, `inset 0 1px 0` white 6 %, radius 24, padding 32 (24 <768), `overflow:hidden`, no gradient or shadow. 2 px accent rule full width at the top edge (modern-tech rule) | S | Surface depth ≤1 |
| 1.6 | Buttons | lg 48 / md 44 / sm 32 with a 44 hit area. Primary white; secondary 1 px navy-500 → hover fill 6 %; ghost. `:active` .98; disabled .4; no lift; arrow `currentColor`; delete `.btn-glass` | S | Touch targets ≥44 |
| 1.7 | Caption (replaces `.tag`) | 13/400 navy-300, sentence case, 6 px square (cyan = screen; navy-500 = concept); never bordered | S | No bordered static capsules |
| 1.8 | Segmented control | Track 40 (44 on touch), padding 4, navy-950 + 1 px line; segment 32, 13/500; selected navy-900; `role=tablist`, arrow keys, nowrap with overflow-x | S | No wrap at 390 |
| 1.9 | Radii | 4/8/16/24/pill; fix the `.surface-inset` cascade | S | ≤5 values |
| 1.10 | Nav material | navy-950 80 %, `saturate(180%) blur(20px)` in `@supports`, 1 px white 8 %, inset top 10 %, shadow `0 12px 32px -12px #0008`; no noise, sheen or gradient edge | S | `backdrop-filter` on 2 elements (island, sheet) |

### Phase 2: page architecture and content

| ID | Change | Exact spec | Eff | Dep | Acceptance |
|---|---|---|---|---|---|
| 2.1 | Order and length | Hero 1 → Layer 3.5 → Built in the UAE 1 → Story 3 → CTA 0.8 → Footer 0.4 viewports (the owner's order) | M | 3.2 | ≤10 viewports |
| 2.2 | Hero | Eyebrow "Meerana Technologies · Dubai, UAE" 13/500, no pill. H1 72/300; the continuation span `display:block`. Lede 20/400 navy-200, max 34rem (if approved). "Explore the ecosystem" (lg) + "See how it works" → `#story`. Moments: 4 cells divided by 1 px rules, category 16/500, product 14 navy-300, cyan progress rule. Delete coordinates, "Fig. 1" and Replay | S | 0.5 | 5 of 5 testers name what Meerana makes within 5 s |
| 2.3 | Layer header | H2 44/400 on one line + caption + segmented names + 44 px paddles | S | 1.8 | One position indicator |
| 2.4 | Built in the UAE | Mandated H2. Ruled table: city 20 white, "Headquarters" on Dubai only, time mono 14 tabular via `Intl` `shortOffset`. Placards from §4a (if approved), as a 3-column ruled list | S | Owner 5 | No nesting; wording verbatim |
| 2.5 | Story | Intro merged into step 1; 5 steps × 60vh; sticky stage.<br>Card 32rem: label 13/500 + H3 28 + one line. No numeral and no step eyebrow; one "Sample scenario · illustrative data" per section.<br>Dashboard: one surface, `border-spacing:2px`, "–" for zeros, ≤70vh | M | 4.9 | ≤3 viewports |
| 2.6 | CTA | No card; mandated headline 72/300 over a 60 % scrim; "Talk to Meerana" (`mailto:` with subject) + "info@meerana.ae" as a text link | S | — | One button |
| 2.7 | Verbs | Global "Talk to Meerana"; products "Request a ‹Product› briefing", subject "‹Product› briefing" | S | — | 2 verb patterns |
| 2.8 | Footer | Full width, 1 px top rule, padding 64/32. Columns: logo + entity + address (EV-531) · Products · Company · Contact. "© 2026 Meerana Technologies LLC"; prototype note at 12 px; no dead links | S | 1.1 | On the grid; legal links remain a launch gate (plan/13) |

### Phase 3: product gallery rebuild (horizontal, per the owner)

| ID | Change | Exact spec | Eff | Dep | Acceptance |
|---|---|---|---|---|---|
| 3.1 | Six cards | Mandoobee → Tasree3 → Nazo → Yisbir → Wasel → AI in a Box; delete Asset Tracking and its `assets` formation | S | Owner 2 | 6 cards |
| 3.2 | Pin and snap | ≥1280×760: `end:'+='+2.5*innerHeight`, `snap:{snapTo:1/5,duration:{min:.2,max:.42},ease:'power2.inOut'}`, `anticipatePin:1`; `--cw:min(1120px,78vw)`, gap 32, neighbours peek ≈128 px | M | Owner 1 | Pin ≤250vh; one gesture = one card |
| 3.3 | Fade in and out | Card opacity .35→1 and scale .96→1, at rest by 35 % of its travel, mirrored on exit. Frame only: rotationY 8→0°, z −60→0, lagging 15 %. Info y 8→0, 60 ms stagger | S | 3.2 | Text crisp at rest |
| 3.4 | Anatomy | Logo slot 40 px (≤200 wide) → 16 → line 20 px (≤2 lines) → 24 → 3 capabilities as a plain list (14, navy-200, 28 px rows) → 32 → deploy line (mono 12 key + 14 value) → 16 → CTA. Media column 7 of 12: radius 16, no sheen or tilt, tabs left, caption right; 32 px zoom on hover/focus | M | 1.5–1.8 | No void >48 px |
| 3.5 | Screens | 2× crops at 16:10, UI text ≥12 px at 1440. Mandoobee phones cut out. AI in a Box cropped to the review panel. Wasel as a hairline isometric drawing (navy-300 + copper), "Illustration" | M | 0.4 | No mid-word crops |
| 3.6 | Stage | Canvas opacity → 0 over 240 ms with `cancelAnimationFrame` while pinned. Stretch goal: M16's plate index | S | — | GPU idle in the gallery |
| 3.7 | Rail fallback | `scroll-snap x mandatory`, cards 88vw, `view(inline)` fade, 44 px paddles, tabs visible <768 | S | 1.8 | Keyboard and swipe parity |
| 3.8 | Lightbox | Solid navy-950, radius 24, padding 8, image radius 16; header "1 / 3 · title" with close top-right; 48 px paddles; backdrop 94 % + `blur(8px)` | S | — | Focus returns |

### Phase 4: 3D art direction and motion

| ID | Change | Exact spec | Eff | Acceptance |
|---|---|---|---|---|
| 4.1 | Fog | `d=dot(wp−uCenter,−F)/uSpan+.5; vFog=.5*smoothstep(.45,1.,d)`; fog colour = the backdrop | S | 0 % at the pivot |
| 4.2 | Key light | `vN=normalize(mat3(modelMatrix*instanceMatrix)*normal)`; `k=max(dot(vN,uKey),0.)`; `col=mix(vTop*uShadowTint,vTop,.38+.62*k)`; uKey = normalize(.55,1,.3). Neutral tops ≤ navy-200; one cyan per frame | S | Brightest scene pixel in d01 ≤ #B5BBC3 |
| 4.3 | Chamfer, not outline | World-unit edge distance; `col+=(1−smoothstep(0,.045,d))*.25*k`; cyan edge only where `aEdge.a>.8` | S | No outlines on seams |
| 4.4 | AO and shadows | Baked `aAO` (−.15 per neighbour, floor .4), lerped through morphs; shadow quads at y −.335, opacity `.35*(1−h/3)` | M | +1 draw call |
| 4.5 | Backdrop and floor | Radial gradient at `var(--gx) var(--gy)`: `color-mix(blue 14 %, navy)` → navy at 45 % → navy-950, tokens only. fwidth floor grid, alpha `.07*(1−smoothstep(6,18,r))` | S | No raw hex |
| 4.6 | Objects | One instance per object (sheet, bar, phone); per-instance quaternion, pre-allocated `compose` | M | ≤0.15 ms per frame |
| 4.7 | Camera rig | M's shot table (hero 45°/35.3°/1.0 … next 45°/35.3°/0.85); fixed scale per group; `bbox` and `poster` per basis | L | Posters match the live frames |
| 4.8 | Morph | Bézier path per cell: lift 420 `power2.out` → travel 420 `power2.inOut` → settle 420 `expo.out`, 140 ms overlaps, sweep ≤480; nearest-neighbour mapping; smoke maps onto the Bay 3 bars. No spring | M | No straight crossings |
| 4.9 | Scrubbed story | `ScrollTrigger({start:'top 85%',end:'top 45%',scrub:.5,onUpdate:st=>GL.setProgress(a,b,st.progress)})`; reduced motion → `go(name,true)` | M | Reverses exactly |
| 4.10 | Micro-stories | Wasel: pulse 420 → blink 160 → arm 0→78° over 420. Yisbir: head −12→0°, bracket 160. Additive cone; 16 smoke billboards | M | +2 draw calls |
| 4.11 | Lines, chips, mood | `LineSegments2` at 2 px. Chips solid navy-950 90 %, 24–40 px leaders, outside the bbox, ≤2 at a time; world labels as 12 px text. Exposure .55 on "Problem"; cyan-white key snap (160 ms) on "AI detects" | M | No chip overlaps |
| 4.12 | Hero | Spacing 1.75→1.3; lifted cells dock at their stream; hold 2,800 ms (morph ≤1,100 ms, settled ≥1,700 ms); one cycle | S | "Rapid" kept; readable |
| 4.13 | Cost | `setScissor` to the framing rect; ambient frames at 30 fps; no closures in `frame` | S | ≤8 ms per frame on an iGPU |
| 4.14 | Figma | Island drop-row, card fade and moment timing as Figma keyframes (`figma-use-motion`), implemented from `get_motion_context`; the 3D stays in code | M | Owner signs off. Deferred: M recipe 12 (RoundedBox, MeshPhysical, PMREM) |

### Phase 5: mobile and tablet

| ID | Exact spec | Eff | Acceptance |
|---|---|---|---|
| 5.1 | <768 one column; 768–1279 stacked, no pin, compact island; ≥1280 desktop | S | No regressions at 1024 |
| 5.2 | No fixed stage <1024: an inline poster per beat (4/3, ≤38svh); remove `min-height:100svh` and `padding-top:46svh`; 64 px between sections | M | No gap >96 px |
| 5.3 | Hero order: H1 → lede → CTA → poster ≤32svh → moments 2×2 | S | CTA ends ≤600 px at 390×844 |
| 5.4 | Card order: logo → line → 4:3 single-tile crop → caption → capabilities → CTA; tabs scroll | S | Logo visible first |
| 5.5 | Island: symbol lockup + chapter + pause + menu at full width −32. Sheet solid 96 %, 52 px rows, primary last, focus trap, Esc returns focus, 60 % scrim | M | VoiceOver pass |
| 5.6 | Tablet story: card ≤560 px stacked with its poster | S | Headings ≤4 lines |

### Phase 6: accessibility and performance gates

| Gate | Threshold |
|---|---|
| Overflow | `scrollWidth = innerWidth` at 375/390/768/1024/1280/1440 |
| Motion | Pause stops all loops, autoplay and video; reduced motion → rail and final states (WCAG 2.2.2, 2.3.3) |
| Focus | Visible 2 px ring on every control; focus inside the gallery scrolls to its card; menu and lightbox trap and return focus |
| Contrast and type | Text ≥4.5:1 (captions 6.84:1); nothing <12 px; weight ≥400 below 18 px; targets ≥44 px on touch |
| Performance | Tailwind precompiled in `build.py`. Mobile LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.05. 3D ≤250 KB gzip and ≤80 draw calls. Traces on a real GPU and a mid-tier Android (DD-17 pending) |
| Evidence | `data-ev` on every fact; internal-ID grep = 0; media provenance signed off (J1–J3) |
| Density | ≤2 uppercase or mono strings per viewport; ≤10 viewports; Lighthouse accessibility ≥95, performance ≥85 |

## 5. Owner decisions needed

1. **Gallery pin exception:** 250vh, above the 150vh per-pin rule but within the 300vh page total. *Default: approve.*
2. **Asset Tracking → Wasel** in the layer. *Default: swap.*
3. **"Meerana Intelligence Layer"** as a portfolio heading, with "Six products. Each one deploys on its own." *Default: keep.*
4. **Hero lede** from §4a, paid for by cuts. *Default: approve.*
5. **Proof placards** with the §4a wording; marketing confirms the ELMA certificate. *Default: approve, text only.*
6. **Public use of the "dubaiPolice"-derived Yisbir boards.** *Default: evidenced crops only; the boards stay internal.*
7. **Demo media:** mask and crop now, or re-record on neutral tenants (DV-04). *Default: mask now, re-record later.*
8. **Figma motion authoring** needs the Figma connector authorised. *Default: authorise.*
9. *(Doc owner, not the owner:)* update DD-17 ("one hard pin") and record DD-22–24.

## 6. Target scorecard (1–5)

| Dimension | ENT / DESIGN today | Judged today | After plan | Benchmark median (20 sites) |
|---|---|---|---|---|
| 1 Five-second clarity | 2 / 2 | 2 | 4 (3 without the lede) | 4 |
| 2 Hero composition | 2 / 3 | 2 | 4 | 4 |
| 3 Navigation | 2 / 3 | 2 | 4 | 5 |
| 4 Product presentation | 3 / 3 | 3 | 4 | 4 |
| 5 Proof and trust | 1 / 1 | 1 | 3 (logos are needed for 4) | 4 |
| 6 Visual system | 2 / 2 | 2 | 4 | 4 |
| 7 Motion and 3D | 2 / 3 | 2 | 4 | 3 |
| 8 Density and length | 1 / 2 | 1 | 4 | 4 |
| 9 CTA and conversion | 2 / 3 | 2 | 3 (4 with the form) | 5 |
| 10 Footer | 1 / 1 | 1 | 4 (5 with legal pages) | 5 |
| 11 Mobile | 2 / 3 | 2 | 4 | 4 |
| 12 Accessibility and performance | 3 / 3 | 3 | 4 | 3.5 |
| **Total /60** | 23 / 29 | **23** | **46** | **49.5** |

After the plan, 3D and motion should beat the median. What remains below the median is proof (permissions), CTA (backend) and footer (legal pages): launch dependencies, not design work.
