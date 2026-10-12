# DESIGN-DIRECTIONS: Meerana · YISBIR (with Nazo)

**Phase 2 of the revamp brief.** Prepared 2026-10-04.

**Inputs:**
- `docs/REPORT.md` (audit);
- `plan/` (2026-10-02 concept plan, evidence register, design tokens, decision log);
- first-hand measurements of reference sites taken in the in-app browser at 1440×900 on 2026-10-04 (§1).

**Evidence notation:** `EV-###` (register row), `DL-###` (decision log), `DD-##` (new decision proposed here, §7), `B` (brief), `M:` (my measurement, §1).

Every design decision below names the evidence or research it comes from. Copy shown in prototypes is **proposed copy**. It must pass `meerana-evidence` sign-off before shipping.

---

## 0. Summary

| Brand | Direction | One line | Prototype |
|---|---|---|---|
| Meerana | **M1 · Quiet Futurist** *(recommended for the hero)* | Night-time engineering drawing. Navy, hairlines and true metadata in mono. The logo's own lattice assembles into five labelled operating environments, once, then rests. | `prototypes/meerana-m1-quiet-futurist.html` |
| Meerana | **M2 · Operating Model, Daylight** | The Oct 2 plan's "architectural model", promoted into a white hero. An isometric plinth of lattice cells where each product occupies a zone. | `prototypes/meerana-m2-operating-model.html` |
| YISBIR | **Y1 · Camera Chrome** | "The product is the design": a machine-view camera panel with bounding boxes, track IDs, timecodes and an event stream, on abyss. | `prototypes/yisbir-y1-camera-chrome.html` |
| YISBIR | **Y2 · Search Is the Interface** *(recommended for the hero)* | Daylight search UI: one query resolves into transcript, on-screen-text and object hits on a 24-hour index timeline. | `prototypes/yisbir-y2-search-index.html` |

**Recommendations:**
- **Meerana:** the M1 hero, plus M2's daylight model for the explanatory "ecosystem" section. That is exactly the surface map of `plan/09` §8: a dark hero and a light model.
- **YISBIR:** the Y2 hero (search is the core, DL-P01), plus Y1 as the real-time construction and security chapter.
- **Nazo** joins the Meerana layer as a fifth product (user decision, 2026-10-04). It is presented through its real approval-and-seal workflow (§3.6).

---

## 1. Reference research: what makes premium tech sites feel premium

### 1.1 First-hand measurements (computed styles, 1440×900, 2026-10-04)

| Site | Display type (measured) | Body / secondary | Mono | Background | Signature device | Real product UI | Hero CTA pattern |
|---|---|---|---|---|---|---|---|
| **Linear** | Inter Variable **64/64 px, weight 510, −0.022em**; H2 48 px; closing 72 px | 15/24 px `#8A8F98` | **Berkeley Mono**: 215 of ~800 text nodes | `#08090A` | None animated. Mono "FIG 0.1–0.3" captions on **isometric line drawings** (one is a hexagon-cell lattice). | **Yes**: the full app (issue view, sidebar, agent panel) rendered in HTML as the hero visual | Left-aligned. Secondary is a changelog link ("New Loops →"). |
| **Vercel** | Geist **64/64 px, weight 400, −0.06em** | Geist 16; cycling **Geist Mono** subhead | Geist Mono | `#000` | One: the logo triangle with a radial glow (canvas); hairline grid frame | Case study with real Notion AI UI + the products it uses | "Deploy now" (light pill) + "Talk to sales" (dark pill). Monochrome logo band directly under the hero. |
| **Stripe** | Söhne **48/55 px, weight 300, −0.02em**, two-tone | Söhne only (1 family) | — | `#FFF` | One: the WebGL gradient wave. **Live real metric:** "Global GDP running on Stripe: 1.7268…%". | Bento cards with real POS, checkout and billing UI | "Get started" (r 4 px) + "Sign up with Google". Logo band. |
| **Resend** | **Domaine (serif) 96/96 px, 400, −0.01em**; H2 ABC Favorit 56 px | Inter 18/27 `#A1A4A5` | **Commit Mono**: 518 nodes | `#000` | One: a monochrome 3D cube (video) | Code samples, SDK selector row | "Get started" + "Documentation". Event pill eyebrow. Logo band. |
| **Frame.io** | FrameGothic **80/83 px, 600, −0.045em** | 18/26 px | Display-face eyebrows | Deep violet | Product UI on a large canvas | **Yes**: the app on canvas; full-width asset browser later | "Start Free Trial" + "Take a Product Tour →". Two-tone section heads. |
| **Cuebric** | **Poppins** 72 px, 400 ("From Concept to Camera.") | Inter | — | Photo | Cinematic **real in-situ photography** (an LED-volume stage) | — | A single "Get in Touch". Manifesto block of three statements. |
| **Intenseye** (computer-vision safety) | Roobert **76 px, 600, −0.02em**, 7-word imperative H1 | Roobert | **Roobert Mono**: 238 nodes; uppercase eyebrow | `#0E0E12` | Real dome-camera photo; an orange **connector line linking narrative sections** | **Real CCTV footage** tiles | A single "Book a demo". Copy: "runs computer vision on the cameras you already have … detect 50+ types of high-risk hazards". |
| **Verkada** | normsPro 56 px / 600 | — | — | Video | Full-bleed video | **A search field as the feature visual:** "Find footage in seconds with any search criteria" | "Get demo". Uses the phrase "operational intelligence", so YISBIR must differentiate. |
| **Awwwards** | — | — | — | — | Jury criteria shown on every entry: **Design · Usability · Creativity · Content**. The 2026-09-26 AI nominee pitches "working experiments" that *explain* how AI works. | — | — |

**Probe results on the six sites probed for them** (Linear, Vercel, Stripe, Resend, Frame.io, Cuebric; the Intenseye and Verkada probes did not record these fields):
- `html.lenis` was **absent on all six**.
- `window.gsap` was **absent on all six**.
- Linear ships no canvas at all. The premium feel comes from type, real UI and content, not scroll hijacking.

This informs DD-02 and DD-03.

### 1.2 Twelve patterns we will use, and how

| # | Pattern | Seen on | How we apply it (without copying) |
|---|---|---|---|
| P1 | **Scale contrast with light weights.** The hero is 4–6× the body, at 300–510 weight with negative tracking. | Linear, Vercel, Stripe, Resend | Poppins **300** display at −0.035em (M1). Poppins 600 per the plan token (M2). Montserrat 500/600 (Y1/Y2). Bold 700+ is reserved for wordmark-like lines (`plan/09` §4). |
| P2 | **Two or three families, maximum** | Linear, Vercel, Resend | Meerana: Poppins + Almarai + *system* mono (DD-06). YISBIR: Montserrat + Tajawal + IBM Plex Mono. |
| P3 | **Mono for metadata only:** figure numbers, eyebrows, IDs, timecodes | Linear, Vercel, Resend, Intenseye | True facts only: "EST. 2022", HQ coordinates from the live map embed, product reference formats, video timecodes |
| P4 | **Real product UI as the visual** | Linear, Frame.io, Stripe, Vercel | The Nazo approval chain (reconstructed from the observed demo), the YISBIR search UI, Mandoobee screens (real, DL-A02). Illustrative UI is labelled. |
| P5 | **Two-tone headline:** bright clause plus muted clause | Linear, Stripe, Frame.io | Used once per page, on the hero or the deployment statement |
| P6 | **One signature visual per page; everything else static** | Vercel, Stripe, Resend | M1 lattice assembly · M2 model build · Y1 detection lock-on · Y2 timeline ticks |
| P7 | **Left-aligned hero** | Linear, Vercel, Stripe, Frame.io, Intenseye | All four prototypes are left-aligned on a 12-column grid |
| P8 | **Proof immediately after the hero** | Vercel, Stripe, Resend, Intenseye | Meerana: the **museum placard rail** of verified partners (six placards). YISBIR: deployment facts. No unverified logos (DL-R02). |
| P9 | **Dual CTA: self-serve plus human** | Vercel, Resend, Frame.io | "Explore the products" + "Talk to Meerana". "Try a sample search" + "Request a demo". |
| P10 | **Real numbers, shown live** | Stripe (GDP ticker) | Only numbers with register rows: 2022, 50+ languages (EV-440), 6 verified partners, 3 verified awards. **No accuracy, uptime or latency figures** (§2.4). |
| P11 | **Engineering-drawing language:** figure labels, isometric line art, hairline frames | Linear, Vercel | Meerana's own **isometric parallelogram lattice** (brand PDF), so the device is owned, not borrowed |
| P12 | **In-situ reality over renders** | Cuebric, Intenseye | Commission deployment and hardware photography (REPORT §8 P1). Until then: honest line art and labelled UI. No stock, no AI imagery (DL-A03). |

### 1.3 Template smells: observed on our own properties and drafts

| Smell | Where observed | Rule |
|---|---|---|
| Purple→indigo gradient buttons with glow | meerana.ae product pages (`from-purple-600 to-indigo-600`) | No gradient buttons. One brand ramp only, for hairlines (`plan/09` §3). |
| Gradient text, cyan→purple | yisbir.com hero | Never |
| macOS traffic-light window chrome | yisbir.com, meerana.ae/yisbir | Product frames use the product's own chrome or none |
| Pill badge + centred hero + Space Grotesk/Inter | yisbir.com | Left-aligned hero; brand faces only |
| Emoji as UI icons | meerana.ae/yisbir console (🎥🔍📊🚨⚙️) | Lucide 1.5 px only (`plan/09` §9) |
| Stock "people with laptops", server racks, watermarked comps | meerana.ae solutions and hero | Never |
| Spinning globes and world-network maps | Live 3D globe (698 KB texture); Dark Draft map | No globes: decorative, heavy, no information |
| Telemetry theatre ("LIVE TELEMETRY · 4 OPERATING LAYERS") | Figma Make v17 | Live-looking numbers only as labelled samples tied to a task |
| Unverifiable stat rows (5+/60+/40+/50+; 99.2%; 512+) | Dark Draft; live product pages | Register row or nothing |
| Identical card grids with an identical subtitle | meerana.ae Solutions (4 cards, same subtitle ×4) | Bento with differentiated cells, or a list |
| Glassmorphism stacks (`backdrop-blur`) | Dark Draft cards; live product pages | No backdrop-filter over moving content; borders, not glass |

---

## 2. Shared foundations (both brands)

### 2.1 Principles
1. **Evidence before effect.** Every number, partner, award and capability carries an `EV-` id (`meerana-evidence`).
2. **One signature motion per page.** Everything else is a quiet reveal or nothing (P6).
3. **Real UI over imagery.** Provenance labels: `real` / `reconstructed` / `illustrative` (`meerana-product-ui`).
4. **LCP is text.** No hero depends on canvas or WebGL for first paint. The canvas never is the LCP element; the H1 is (stack facts §8). Posters render first. Motion mounts after first paint.
5. **Accessible by construction.**
   - WCAG 2.2 AA contrast (all pairs below are verified).
   - A **visible pause control** for any motion that runs longer than 5 s (SC 2.2.2). `prefers-reduced-motion` is honoured, but it is *not* sufficient on its own.
   - RTL-ready logical properties.

### 2.2 Motion scale (shared tokens, from `plan/design-tokens.json`, trimmed to the brief's "max 3 durations")

| Token | Value | Use |
|---|---|---|
| `--dur-1` | 160 ms | State feedback: hover, press, focus, bracket snap. (The plan's "instant 100 ms" folds in here, DD-13.) |
| `--dur-2` | 240 ms | Component enter/exit; quiet reveals |
| `--dur-3` | 420 ms | Section-level choreography steps |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-enter` | `cubic-bezier(0, 0, 0, 1)` | Entrances |
| `--ease-exit` | `cubic-bezier(0.3, 0, 1, 1)` | Exits |

- Signature sequences are built from these steps. The longest one-shot is 2.4 s, made of staggered 420 ms steps.
- Scrubbed scroll has no duration; smoothing is ≤ 0.5 s.

### 2.3 Typography rules
- **Display:** a single family per brand. Size `clamp()`; tracking −0.03 to −0.035em; line-height 0.98–1.04.
- **Body:** 17 px / 1.65 (Latin), 1.85 (Arabic). Arabic gets no letter-spacing and no uppercase.
- **Headlines:** ≤ 8 words (B). Cards are two sentences (B).

### 2.4 Numbers policy (brief: "numbers over adjectives")

**Publishable now** (register-backed):

| Number | Source |
|---|---|
| Founded **2022** | EV-020 |
| **50+** transcription languages, Yisbir | EV-440 |
| **6** verified partners | EV-240, EV-505, EV-506, EV-507, EV-508, EV-509 |
| **3** verified recognitions | DL-R01; one still needs its certificate |
| HQ coordinates **25.1876° N, 55.2680° E** (Blue Bay Tower) | Live `locationInfo` map embed |

**Not publishable until registered:** all accuracy, uptime, user, organisation, hours-processed and speed-up figures (REPORT §4.4).

---

## 3. Meerana · M1 "Quiet Futurist" *(recommended hero)*

### 3.1 Concept and evidence

**Concept.** A night-time engineering drawing of the company: navy paper, hairlines, true metadata in mono. One signature event: scattered nodes (devices, endpoints) **assemble into the Meerana logo's isometric lattice**. The lattice then resolves into **five labelled operating environments**: Perimeter (Wasel) · Cameras (Yisbir) · Workplace (Mandoobee) · Processes (Tasree3) · Correspondence (Nazo).

| Source | What it supports |
|---|---|
| Brand PDF | The navy hero, the lattice symbol, "Built in the UAE" |
| `plan/09` | Lattice as signature, ≤ 1 application per viewport |
| B | "Quiet futuristic, particle/node-graph hero (IoT metaphor)" |
| M: Linear, Vercel | Hairline engineering-drawing language |
| DL-P06 | No data-flow lines between products (edges stay inside the lattice geometry) |

### 3.2 Type system

| Role | Spec |
|---|---|
| Display | Poppins **300**, `clamp(2.6rem, 1.15rem + 4.1vw, 4.4rem)` (token `display-xl`), lh 1.02, −0.035em, `text-wrap: balance`. Sized so the 8-word H1 sets on two lines in a 7-of-12 column; 6rem broke it onto four in the prototype. (P1; Cuebric shows Poppins 400 at display size reads premium.) |
| Headings | Poppins 400, 40/48 px, −0.02em |
| Body | Poppins 400, 17/28 px |
| Labels | Poppins 500, 13 px, +0.06em, uppercase |
| Metadata | **System mono** (`ui-monospace, SFMono-Regular, Menlo, Consolas`), 12–13 px, +0.04em: a zero-byte webfont cost (DD-06) |
| Arabic | Almarai 400/700, lh 1.85 |

### 3.3 Palette (WCAG verified; ratios from `scratchpad/contrast_directions.py`, cross-checked with `meerana-brand/scripts/contrast_check.py`)

| Pair | Use | Ratio | Result |
|---|---|---|---|
| White on navy `#071B36` | Display, body | **17.23** | AAA |
| White on navy-950 `#051326` | Deep surface | 18.62 | AAA |
| navy-200 `#B5BBC3` on navy | Secondary text | 8.91 | AAA |
| navy-300 `#9CA4AF` on navy | Mono metadata, muted | 6.84 | AA |
| Cyan `#3FD0FF` on navy | Accent text, focus ring, live data | 9.58 | AAA |
| Navy on white | Primary button label (white button) | 17.23 | AAA |
| navy-500 `#778290` on navy | Hairlines, UI boundaries | 4.41 | ≥ 3:1 non-text ✓ |
| **Blue `#0D3BFF` on navy** | — | **2.53** | **Decorative fills only.** Never text or UI. |
| Navy on neutral `#EDEDED` | Museum placard title | 14.71 | AAA |
| navy-600 `#515F72` on neutral | Placard metadata | 5.55 | AA |
| Blue on neutral | Placard link | 5.81 | AA |
| navy-300 on **navy-900** `#1B2D46` (new raised panel) | Muted text on cards | 5.52 | AA |

**Finding (DD-14).** The plan's dark `surface-raised` (navy-800 `#2C3D54`) with its muted text (navy-300) is **4.38:1, which fails AA**. M1 cards therefore use a new derived **navy-900 `#1B2D46`** (mix(navy, white, .08)). Its ratios: white 13.90 · navy-200 7.19 · navy-300 5.52 · cyan 7.73 · control border 3.56.

### 3.4 Motion concept
- **Signature (hero, once).** The lattice assembly takes ≈ 2.2 s: nodes ease from scattered positions into lattice vertices in staggered `--dur-3` steps along `--ease-enter`. The five zone labels (DOM) fade in on settle.
  - Then **rest**: no idle loop, so SC 2.2.2 does not apply. There is a visible **Replay** control.
  - **Pointer proximity:** nodes within 90 px brighten, and a mono readout shows the nearest cell index. This is interaction-triggered, and off for touch and reduced motion.
- **Everywhere else:** quiet reveal (opacity, plus translateY 8 px → 0 at `--dur-2`), driven by IntersectionObserver. Native scroll (plan; DD-02). Chapters use sticky stages, not hard pins (`plan/08`).
- **Reduced motion:** the static SVG poster of the settled lattice; labels visible; no transforms.

### 3.5 Hero concept (desktop wireframe, 1440)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [MEERANA logo]   Products  Services  Company                       [Talk to Meerana] │ 72px, hairline bottom
├────────────────────────────────────────────────────────────────────────────────────────┤
│ MEERANA TECHNOLOGIES · DUBAI, UAE · EST. 2022           (mono, navy-300)               │
│                                                    ┌──────────────────────────────────┐ │
│ From the front gate                                │  canvas: nodes → lattice         │ │
│ to the final approval.        (Poppins 300, 96px)  │  (poster SVG underneath = LCP-   │ │
│                                                    │   safe; canvas fades in after    │ │
│ Meerana builds AI products for access control,     │   first paint)                   │ │
│ video, workplace, processes and correspondence.    │  01 PERIMETER — Wasel            │ │
│ Built in the UAE; deployable on your own servers.  │  02 CAMERAS — Yisbir             │ │
│                                                    │  03 WORKPLACE — Mandoobee        │ │
│ [Explore the products]  Talk to Meerana →          │  04 PROCESSES — Tasree3          │ │
│                                                    │  05 CORRESPONDENCE — Nazo        │ │
│ ── 25.1876°N 55.2680°E · ON-PREM / CLOUD / HYBRID  │  [Replay] [Pause motion]         │ │
│                                                    └──────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PARTNERS, ON THE RECORD   (light "gallery wall" band, neutral #EDEDED)                 │
│ 01 Software AG     02 FPT Software   03 CyberHive    04 Dubai Chambers  05 Commvault … │
│ PartnerConnect ·   Strategic MoU ·   MoU · 2025      Supported by ·     Value Added    │
│ GITEX 2022         2024              (EV-507)        trade missions     Partner · 2024 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile (390):**
- Stacked.
- The poster lattice sits above the headline at a 4:3 crop; no canvas below 768 px (battery and LCP).
- The zone labels become a 5-item horizontal scroller (the product index).
- Full-width CTAs.

### 3.6 Section-by-section outline (M1)

| # | Section · surface | Visitor question | Content (evidence) | Interaction |
|---|---|---|---|---|
| 1 | Hero · navy | Who is Meerana? | As above. H1 is 8 words (B). Lede [EV-006, EV-007, EV-101, EV-440, EV-113, EV-400, EV-141/Nazo demo, EV-461] | Lattice assembly (signature) |
| 2 | **Museum placard rail** · neutral | Who vouches for them? | Six verified partners with relationship + year [EV-240, EV-505, EV-506, EV-507, EV-508, EV-509]. Placards: index no. (mono), name (Poppins 500, 24 px), relationship (mono label), year, source line. Logos only once supplied *and* permitted (DL-R02, DD-10). | Arrow-key scrollable rail; no auto-scroll |
| 3 | Product index · navy-950 | Which product fits? | "Five products. Start where the problem is." (7 words). One card per product: official logo (raster ≤ native), descriptor, one verb-led line. Product accent only as a 2 px top rule (`plan/06` H2). | Links to chapters and pages |
| 4–8 | Product chapters · sub-brand surfaces | What does each do, for whom? | Wasel (brown) · Yisbir (abyss) · Mandoobee (mist) · Tasree3 (white + ink/orange) · **Nazo (navy, Meerana layer; DD-07)**. Each chapter has one interface moment (provenance-labelled). | Sticky stage, step buttons |
| 6′ | **Nazo chapter** detail | "How does a decision get signed and kept?" | "The final approval, signed and sealed." (6 words). Reconstructed Tracking table: reference `ORG/REQ/2026/031`, approver chain shown as **role initials** (Director → GM → Chair), statuses Signed & Complete / Active / Returned. Archive card: **Sealed · Verify**. AI actions: Summarize · Draft my comment · Anything missing? Toggle **EN ⇄ ع** to show true RTL mirroring. (Observed 2026-10-04; tenant branding removed, REPORT §6.2.) | Step buttons; RTL toggle |
| 9 | Deployment · navy | Where does our data live? | "Deployed where your data has to stay." (7 words). Fact table per product [EV-407, EV-444, EV-116, EV-103, EV-142]. **No certifications implied** (DL-R03). | Entrance only |
| 10 | Services **bento** · navy-950 | Can they build the rest? | Asymmetric bento: **Consulting** (2×2: data management · data centre · CX · digital transformation · EA · process re-engineering [EV-030]), **Bespoke development** (2×1 [EV-031]), **Technology partnerships** (1×1, linking to placards), **Staff augmentation** (1×1 [EV-032]), plus a bridge cell "Process re-engineering → Tasree3". Cards are two sentences, plus a mono list. | Hover lifts 2 px only |
| 11 | Recognition · neutral | Are they credible? | The same placard device: Future 100 (2023) [EV-202] · ELMA 2023 [EV-200, confirm] · Best small enterprise in the UAE, Doha 2024 [EV-203] | — |
| 12 | Contact · navy | How do I start? | "Tell us what you want to run better." Form per `plan/11` §15. | — |

### 3.7 Risks
- The node graph must not drift into "decorative particles" (`meerana-webgl-scenes`). It is acceptable only because the nodes **become the brand lattice and the labelled environments**, play once, and fall back to a poster (DD-04).

---

## 4. Meerana · M2 "Operating Model, Daylight"

### 4.1 Concept and evidence

**Concept.** The Oct 2 plan's recommended language, with its explanatory model **promoted into the hero** and set in daylight: an isometric "architectural model" built from lattice cells on a white plinth.
- **Five zones:** a gate on the front edge (Wasel), camera masts (Yisbir), an office block (Mandoobee), department blocks joined by an orange path (Tasree3), and a vault block with a seal (Nazo).
- **Inversion:** every reference AI site but Stripe is dark (§1.1), so a light hero is itself a differentiator.

| Source | What it supports |
|---|---|
| `plan/09` §6 | Lattice applications |
| `plan/06` | H3 "Four operating environments. One company behind them." (now five) |
| `plan/09` §8 | The light model surface |
| M: Stripe | A light, single-family premium site |

### 4.2 Type system

| Role | Spec |
|---|---|
| Display | Poppins **600**, token `display-xl` = `clamp(2.6rem, 1.15rem + 4.1vw, 4.4rem)`, lh 1.02, −0.035em. The prototype uses the shared hero token so all four directions compare at one size. The plan's display-1 stays available for section openers. |
| Labels | Poppins 600, 13 px, +0.06em, uppercase (plan label token) |
| Body | Poppins 400, 17/28 |
| Metadata | System mono |
| Arabic | Almarai |

### 4.3 Palette (verified)

| Pair | Use | Ratio |
|---|---|---|
| Navy on white | Text | **17.23** |
| navy-800 on white | Secondary | 11.04 |
| navy-600 on white | Muted, labels | 6.50 |
| Blue `#0D3BFF` on white | Links, button fill | **6.80** |
| White on blue | Button label | 6.80 |
| White on blue-hover `#0C35D7` | Button label, hover | 8.38 |
| Blue on blue-050 `#ECEFFF` | Link on tint | 5.95 |
| navy-500 on white | Control borders | 3.90 (≥ 3:1 ✓) |
| **Cyan on white** | **Decorative lattice lines only** | **1.80** |

Product tiles are navy `#071B36` (white logos at 17.23). The white-only product rasters require dark tiles on a light page.

### 4.4 Motion concept
- **Signature (once).** The model **builds**: lattice cells extrude (`scaleY` 0 → 1) in a wave from the gate at the front to the vault at the back. Steps are 420 ms, ≈ 1.6 s total.
  - Zones then react to hover and focus. Each zone label is a real `<a>` that highlights its zone (`aria-describedby` caption).
  - No loop.
- **Elsewhere:** reveals as in M1.
- **Reduced motion:** the built model is static.

### 4.5 Hero concept (desktop)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [MEERANA logo — blue colourway]  Products  Services  Company          [Talk to Meerana] │ white, hairline
├────────────────────────────────────────────────────────────────────────────────────────┤
│ BUILT IN THE UAE · SINCE 2022                                                           │
│ Five operating environments.            ┌───────────────────────────────────────────┐  │
│ One company behind them. (Poppins 600)  │   isometric plinth (SVG, inline = poster)  │  │
│                                         │    [vault]·Nazo   [blocks]·Tasree3         │  │
│ Perimeter, cameras, workplace,          │   [office]·Mandoobee   [masts]·Yisbir      │  │
│ processes and correspondence — each     │          [gate]·Wasel  (front edge)        │  │
│ run by a Meerana product.               └───────────────────────────────────────────┘  │
│ [Explore the products]  Talk to Meerana →   01 Wasel 02 Yisbir 03 Mandoobee 04 Tasree3 05 Nazo (zone links)
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile:** a static isometric illustration (the same SVG, cropped); zone list beneath; no build animation under 768 px.

### 4.6 Section outline (M2)
It follows `plan/06` H1–H11, with the hero merged into H3:
1. Hero = model.
2. Product chapters (sticky stage keeps the model, zooming to each zone).
3. Deployment (white, navy text).
4. Services bento: light cells on `#EDEDED`, one navy cell for emphasis.
5. Proof: placards plus full-colour logos on white tiles when permitted (`plan/09` §8).
6. Contact: a **navy close** (the only dark section).

**Risk.** A light hero loses the PDF's "Built in the UAE" night-skyline association, and the white-only logos need tiles. Mitigation: a navy close and a navy chapter for Nazo.

---

## 5. YISBIR · Y1 "Camera Chrome"

### 5.1 Concept and evidence

**Concept.** The hero *is* a camera panel seen through the model's eyes: a perspective ground grid, outline-only figures (non-identifying by construction, DL-P07), and bounding boxes with **corner brackets**, class + confidence labels and **track IDs**.

| Element | Detail |
|---|---|
| Zones | A dashed **restricted-zone polygon** |
| Camera chrome | REC · `CAM-03 · GATE 2 — NORTH ENTRANCE` · sample timecode · `LOCAL NODE · ON-PREM` |
| Event stream | A DOM list of sample events |
| Label | **"Illustrative interface · simulated detections"** |

| Source | What it supports |
|---|---|
| EV-134 | The six HSE classes: missing helmet, missing vest, unsafe work practices, restricted-zone entry, falls and incidents, workers in hazardous areas |
| EV-136 | Object detection (person, vehicle) and real-time alerts |
| EV-444 | Existing cameras; no hardware changes |
| EV-443 | On-premise |
| B | "Bounding boxes, camera chrome, timestamps, telemetry mono, event-stream dividers, live counters" |
| M: Intenseye | Real-footage + mono-eyebrow pattern |

### 5.2 Type system

| Role | Spec |
|---|---|
| Display | **Montserrat 600** (brand), token `display-xl` = `clamp(2.6rem, 1.15rem + 4.1vw, 4.4rem)`, lh 1.02, −0.035em (one hero token across all four directions) |
| Body | Montserrat 400, 17/28 |
| Telemetry | **IBM Plex Mono** 400/500, 11–13 px, tabular figures (DD-06) |
| Arabic | Tajawal |

### 5.3 Palette (verified; new YISBIR-derived set in `ui-system`)

| Pair | Use | Ratio |
|---|---|---|
| White on abyss `#00132D` | Text | **18.57** |
| White on abyss-950 `#000D20` | Video frame | 19.47 |
| abyss-200 `#B2B8C0` on abyss | Secondary | 9.29 |
| abyss-300 `#99A1AB` on abyss | Mono telemetry | 7.11 |
| **Aqua `#43DAFE` on abyss** | Detection boxes, accent | **11.23** |
| Abyss on aqua | Primary button label | 11.23 |
| Warning `#FDB022` on abyss-950 | PPE alert label | 10.58 |
| Error `#F97066` on abyss-950 | Zone alert label | 6.99 |
| Success `#12B76A` on abyss | Compliant | 7.08 |
| abyss-500 `#737D8C` on abyss | Panel hairlines | 4.46 (≥ 3:1 ✓) |
| **Yisbir blue `#0045F8` on abyss** | **Never text/UI** | **2.84** |

**Overlay rule.** Boxes are 1.5 px aqua with a 1 px abyss outline, so they hold ≥ 3:1 over any footage (SC 1.4.11).

### 5.4 Motion concept
- **Signature (continuous feed).** **Lock-on**: brackets snap from 140 % → 100 % box size at `--dur-1` when a track is acquired. Event rows enter at `--dur-2`.
  - Because the feed loops, there is a **visible Pause feed button** (SC 2.2.2). Its state persists.
  - **Reduced motion:** one static frame with all boxes drawn.
- **Event-stream section dividers** use the **video-chapter metaphor**, not fake operations logs: `CH 02 · 00:42 · WHAT IT DETECTS`. Sections read like chapters of an indexed video (honest, on-concept).
- **Scroll:** native. DD-02 allows Lenis on yisbir.com, but this page doesn't need it, so the prototype doesn't load it.
- **As built (`prototypes/yisbir-y1-camera-chrome.html`):**
  - Figures are outline pose skeletons, with keypoints in the detection colour and no face, gender or identity cues (DL-P07).
  - Detections are person and vehicle (EV-136), missing helmet and restricted-zone entry (EV-134), and *near Zone B* (EV-134 "workers in hazardous areas", with hysteresis).
  - Story: a worker without a helmet leaves the site office, crosses the road and enters Zone B. A van arrives about 1 s after Play, so the first live event lands early.
  - The event list starts from 40 s of pre-rolled history, so its timestamps are staggered rather than identical.
  - Track IDs renew each cycle.
  - One module (`prototypes/src/y1_scene.js`) draws the canvas and, through Node at build time, the poster SVG. Frame t = 0 and the poster therefore match.
  - Below 640 px the in-scene labels are hidden (they would render at about 5 px) and the event list carries the text. Below 768 px the feed starts paused on the poster.

### 5.5 Hero concept (desktop)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [YISBIR logo]  Platform  Search  Deployment  Governance      A Meerana product  [Demo] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ OPERATIONAL INTELLIGENCE · REAL-TIME MODULE (mono)                                      │
│ Safer sites from the       ┌───────────────── CAM-03 · GATE 2 — NORTH ENTRANCE ── ● REC┐ │
│ cameras you already have.  │ ┌PERSON 0.94·ID 07┐   ╱restricted zone B╲     07:42:13    │ │
│                            │ │ (outline figure) │  ╱  dashed polygon   ╲              │ │
│ YISBIR watches existing    │ └ NO HELMET ───────┘    ┌VEHICLE 0.91·ID 12┐            │ │
│ CCTV for missing PPE,      │   perspective grid floor …                              │ │
│ restricted-zone entry and  │ LOCAL NODE · ON-PREM            Illustrative · simulated │ │
│ falls. Runs on your        └──────────────────────────────────────────────────────────┘ │
│ servers. No new cameras.    EVENTS ▸ 07:42:13 Restricted zone B · ID 07  ▸ 07:41:58 …  │
│ [Request a demo] See how search works →          [Pause feed]  People in zone: 2       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.6 Section outline (Y1, as the yisbir.com real-time page or chapter)

| # | Section | Content |
|---|---|---|
| 1 | Hero | The camera panel |
| 2 | `CH 01 · 00:00 · THE PROBLEM` | "Hours of footage. One minute that matters." (`plan/06` H5) |
| 3 | `CH 02 · What it detects` | Documented classes only: the six EV-134 HSE classes. The live site's security list (after-hours intrusion, perimeter breaches, vehicle movement anomalies) is in `research/sources/live-site-extract.md` but not yet in the register, so it stays out until registered. **No faces, gender or plates** (DL-P07). |
| 4 | `CH 03 · Investigate` | Search by clothing, helmet or vest colour, zone, camera and time [EV-135]. Links to Y2. |
| 5 | `CH 04 · Runs where your footage lives` | On-prem, cloud or hybrid; existing cameras [EV-443, EV-444] |
| 6 | `CH 05 · Governance` | Access control, secure downloads, API integration [EV-442]. No audit-logging claim: it is not in the register. |
| 7 | `CH 06 · Who it's for` | Construction & infrastructure; data-sovereign organisations [EV-133, EV-446] |
| 8 | CTA | — |

**Brief-only capabilities** (Deep Sort tracking, people counting, mobile app) appear only with a `[CONFIRM]` flag in drafts and never ship unconfirmed. The track IDs in the illustration are explicitly sample data.

---

## 6. YISBIR · Y2 "Search Is the Interface" *(recommended hero)*

### 6.1 Concept and evidence

**Concept.** Daylight, document-like. The hero is a real DOM search field.
- A query types itself once (`permit approved`), then filter chips apply: Transcript · On-screen text · Objects · Zones · Time.
- Three result cards resolve. Each has a dark inset frame, a mono timecode, a source and a hit-type badge. One hit is an **Arabic transcript line** set in Tajawal with `dir="rtl"`, labelled as sample.
- Hit ticks drop onto a **24-hour index timeline**, like a seismograph.
- The visitor can click other sample queries. No network calls; sample data only.

| Source | What it supports |
|---|---|
| DL-P01 | Lead with search and indexing |
| EV-440, EV-442 | Phrase, metadata and OCR search; 50+ languages; Upload → Process → Search → Export |
| M: Verkada | Search field as the visual |
| P4 | Real UI as the hero |

### 6.2 Type system

| Role | Spec |
|---|---|
| Display | Montserrat **500**, token `display-xl` = `clamp(2.6rem, 1.15rem + 4.1vw, 4.4rem)`, −0.035em (lighter than Y1, to read as "document") |
| Body | Montserrat 400 |
| Timecodes, IDs | IBM Plex Mono |
| Arabic | Tajawal 400/500 |

### 6.3 Palette (verified)

| Pair | Use | Ratio |
|---|---|---|
| Abyss on white | Text | **18.57** |
| abyss-600 `#4C5A6C` on white | Secondary | 7.03 |
| **Yisbir blue `#0045F8` on white** | Links, primary fill, hit ticks | **6.55** |
| White on blue | Button label | 6.55 |
| Abyss on aqua-050 `#ECFBFF` | Matched-text highlight | 17.51 |
| Blue on aqua-050 | Link on highlight | 6.18 |
| abyss-500 on white | Input border | 4.17 (≥ 3:1 ✓) |
| Aqua on abyss (inset frames) | Overlays | 11.23 |
| **Aqua on white** | **Decorative only** | **1.65** |

### 6.4 Motion concept
- **Signature (once per query):** typewriter ≤ 1.2 s → results cross-fade at `--dur-2` → **timeline ticks drop** (30 ms stagger, `--ease-enter`) → rest.
- No loop, so no pause needed. A "Replay" link is still offered.
- **Reduced motion:** query pre-filled, results shown, ticks static.
- **Interaction:** sample-query chips re-run the search (INP-safe: pure DOM swaps).
- **As built (`prototypes/yisbir-y2-search-index.html`), with two deliberate changes from the concept above:**
  1. **The Arabic hit is not in the default results.** Returning an Arabic transcript for the English query "permit approved" would imply cross-language search, which no workspace evidence claims. Arabic appears instead as the visible sample query "اعتماد التصريح", set in Tajawal with `lang="ar" dir="rtl"` on each snippet.
  2. **Filters are match types that exist in the sample:** All · Transcript · On-screen text · Objects, with live counts, and a filter is disabled when its count is 0. "Zones" and "Time" were dropped because nothing in the sample could exercise them.
- The 24-hour index sits directly under the result count, so it is visible at the 1440 × 900 fold.
- The query and results are pre-rendered for no-JS and reduced motion. The intro hides them with a class that a 3 s safety timer removes if scripts fail.
- One module (`prototypes/src/y2_index.js`) renders the results in the page and the pre-rendered HTML at build time.
- An unknown query returns an honest "No matches in this sample index".

### 6.5 Hero concept (desktop)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [YISBIR logo — blue colourway]  Platform  Search  Deployment        A Meerana product │ white
├────────────────────────────────────────────────────────────────────────────────────────┤
│ OPERATIONAL INTELLIGENCE · AI VIDEO INDEX (mono)                                        │
│ Search hours of video        ┌──────────────────────────────────────────────────────┐  │
│ like a document.             │ 🔍  permit approved▌                     [Search]    │  │
│ (Montserrat 500, 80px)       │ Transcript · On-screen text · Objects · Zones · Time │  │
│ YISBIR indexes what is said  │ ┌▣ frame┐ 02:14:07 · CAM-11 · TRANSCRIPT · EN        │  │
│ in 50+ languages, what text  │ │       │ "…the permit is approved for zone B…"     │  │
│ appears on screen and what   │ ┌▣ frame┐ 09:31:52 · CAM-04 · ON-SCREEN TEXT         │  │
│ happens in frame. On your    │ ┌▣ frame┐ 16:05:33 · ARCHIVE · TRANSCRIPT · AR (rtl) │  │
│ own servers.                 │ 00:00 ▏▏ ▏    ▏▏▏      ▏   ▏▏      ▏         24:00   │  │
│ [Try a sample search] [Request a demo]   Illustrative interface · sample data         │  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

(The magnifier is a Lucide icon, not an emoji.)

### 6.6 Section outline (Y2 = yisbir.com home)

| # | Section | Content |
|---|---|---|
| 1 | Hero search | As above |
| 2 | "How the index is built" | Four mono-numbered steps: Upload · AI processing · Search & discover · Export & share [EV-442] |
| 3 | "Search the way you think" | Phrase/transcript · metadata · on-screen text (OCR) · objects · similarity · vector. *Person search appears only with approved governance wording* (DL-P07). |
| 4 | "Also live" | A dark inset card linking to the Y1 real-time module |
| 5 | "On your infrastructure" | On-prem / cloud / hybrid; existing cameras; "no hardware changes required" [EV-443, EV-444] |
| 6 | "Governance" | Access control, secure downloads, API integration [EV-442]. No audit claim (not in the register). |
| 7 | "Built by Meerana" | Endorsement: Meerana logo, founded 2022, Dubai [EV-020]; links to meerana.ae |
| 8 | CTA | — |

---

## 7. Reconciliation with the Oct 2 plan (decisions for you)

Nothing in `plan/` or the `meerana-*` skills was edited. These are the points where this brief and that plan differ. Each needs an owner's decision.

**Format of each item:** Brief vs plan · Recommendation · Owner.

**DD-01 · Styling stack**
- **Brief:** Tailwind v4 + shadcn/ui.
- **Plan** (`plan/11`; `meerana-frontend`): CSS Modules, no Tailwind.
- **Recommendation:** **Tailwind v4 compiled from `plan/design-tokens.json`**.
  - Reset defaults with `--color-*: initial`, so only brand tokens exist as utilities. Off-brand colours then become *impossible to write*.
  - Keep the `data-surface` / `data-product` theming via `@custom-variant`.
  - Use shadcn/ui only for interactive primitives (Dialog, Sheet, Tabs, Accordion, NavigationMenu, Select, Tooltip), restyled to semantic tokens.
  - The "utility sprawl" concern is handled by cva variants inside components.
- **Owner:** tech lead.

**DD-02 · Smooth scroll**
- **Brief:** Lenis.
- **Plan:** native scroll only.
- **Recommendation:**
  - **meerana.ae: native** (pinned chapters, iOS, a11y). None of the six premium sites probed uses Lenis (§1.1).
  - **yisbir.com: optional Lenis**, desktop wheel only: `syncTouch: false`, `anchors: true`, `respectReducedMotion` (the default since 1.3.26), driven by the GSAP ticker.
  - Remove it if INP or scroll-latency traces regress.
- **Owner:** tech lead.

**DD-03 · Motion engine**
- **Brief:** GSAP + Framer Motion.
- **Plan:** GSAP only.
- **Recommendation:**
  - GSAP for scroll choreography.
  - CSS (`tw-animate-css`, `@starting-style`) for component states.
  - **Motion only in React app surfaces that need layout or exit animation.** Not on meerana.ae.
- **Owner:** tech lead.

**DD-04 · Node-graph / particle hero**
- **Brief:** a particle hero.
- **Plan:** "no decorative particles".
- **Recommendation:** allowed only as M1 specifies:
  - nodes **become** the logo lattice and labelled zones;
  - one-shot ≤ 2.4 s;
  - 2D canvas;
  - poster-first;
  - no loop.
- Otherwise choose M2.
- **Owner:** marketing + brand.

**DD-05 · Default surface**
- **Brief:** dark-first.
- **Plan:** light or dark by purpose.
- **Recommendation:** these are compatible. Tokens default to `data-surface="dark"`; light sections are chosen by purpose. M1 is dark-dominant, M2 light-dominant.
- **Owner:** design lead.

**DD-06 · Mono typeface**
- **Brief:** "engineering-grade mono".
- **Plan:** not specified. The brand allows ≤ 2 webfont families.
- **Recommendation:**
  - Meerana: the **system mono stack** (no webfont).
  - YISBIR: **IBM Plex Mono** (1 family, 2 weights, Latin subset), as a derived decision.
- **Owner:** brand owner.

**DD-07 · Nazo**
- **Brief:** —.
- **Plan:** exclude unless confirmed (DL-P05).
- **Recommendation:** include, per the user on 2026-10-04.
  - Use the Meerana master palette until a Nazo sub-brand is defined.
  - Name "Nazo" / "NAZO" pending DL-P08.
  - Show reconstructed UI from a **neutral tenant**.
- **Owner:** leadership + brand.

**DD-08 · Live counters and telemetry**
- **Brief:** "live counters, latency/confidence motifs".
- **Plan:** no live-looking telemetry.
- **Recommendation:**
  - Confidence scores and counters are allowed **only inside labelled illustrative UI**, and only when tied to the task shown.
  - **No latency, uptime or accuracy figures** unless they are measured and registered.
- **Owner:** product owners.

**DD-09 · Logo colourways**
- **Brief:** —.
- **Plan:** "no recolouring; no traces".
- **Recommendation:**
  - Render the PDF's official blue-on-white colourway via a CSS **mask** of the official raster, in exact `#0D3BFF`.
  - Keep SVG traces internal only.
  - Replace both when vector masters arrive (DL-B02).
- **Owner:** brand owner.

**DD-10 · Partner band**
- **Brief:** "museumcore partner band, surface prominently".
- **Plan:** verified logos with labels.
- **Recommendation:**
  - **Typographic placards now**: name, relationship, year, source.
  - Add logos once the files and permissions exist (DL-R02).
- **Owner:** marketing.

**DD-11 · YISBIR property**
- **Brief:** a separate company site.
- **Plan:** link out to yisbir.com.
- **Recommendation:**
  - Keep **yisbir.com as the product site** with a "A Meerana product" endorsement.
  - meerana.ae carries the Yisbir chapter and links out.
- **Owner:** leadership.

**DD-12 · Headline length**
- **Brief:** ≤ 8 words.
- **Plan:** H1 is 13 words.
- **Recommendation:** ≤ 8 words for display lines. Longer phrasing moves to ledes.
- **Owner:** content lead.

**DD-13 · Durations**
- **Brief:** max 3 durations.
- **Plan:** 4 (adds 100 ms).
- **Recommendation:** fold 100 ms into 160 ms. Three durations, one easing family.
- **Owner:** design lead.

**DD-14 · Dark raised surface (contrast defect in the plan tokens)**
- **Plan:** `surface-raised` = navy-800 `#2C3D54`, with muted text navy-300 = **4.38:1 (fails AA)**.
- **Recommendation:** add the derived **navy-900 `#1B2D46`** (mix 0.08) as the dark raised surface. Keep navy-800 for hairlines only. Already applied in `ui-system/references/tokens.css`.
- **Owner:** design lead.

*DD-15 and DD-16 are in `docs/PRODUCT-SCOPE-2026-10-10.md` §7.*

**Reviewer comments of 2026-10-10 → prototype M3** (`prototypes/meerana-m3-intelligent-ecosystem.html`)

**DD-17 · A full-page 3D experience**
- **Reviewer:** "Pure 3D page"; "more movement, storytelling and intelligence"; "entering an intelligent technology ecosystem".
- **Plan and skills:** one signature motion; no decorative loops; poster first; one WebGL context per page; no hard pins on the mobile homepage (DD-04, `meerana-webgl-scenes`, `meerana-scroll-choreography`).
- **How M3 reconciles them:**
  - The whole page's 3D is **one** signature: one fixed canvas, one pool of isometric cells.
  - Every state explains a beat: the core, the four moments, the layer, the offices, the five story steps, the close.
  - Loops (the core breathing, flow lines, smoke) stop with the header's **Pause motion** control (WCAG 2.2.2), which persists.
  - Sticky stages, plus **one** hard pin for the horizontal product gallery that the owner requested (DD-23). Native scroll. The H1 is the LCP element. Below 768 px and without WebGL, the page uses SVG posters drawn by the same module.
- **Recommendation:** use M3 as the homepage direction if the reviewers' "ecosystem" feel is the goal, with M1 as the fallback.
  - **Pending:** a performance trace on a mid-tier Android, and on a real GPU (the screenshots used SwiftShader).
- **Owner:** marketing + tech lead.

**DD-18 · Hero line**
- **Reviewer:** "We engineer intelligence for the real world." (7 words).
- **Previous proposal:** "From the front gate to the final approval." (PRODUCT-SCOPE §4).
- **Recommendation:** use the reviewer's line in M3. It is positioning, not a checkable claim; the four moments under it carry the specifics, each with an EV id.
- **Owner:** marketing.

**DD-19 · "Meerana Intelligence Layer": the name, Asset Tracking and Wasel**
- **Reviewer:** Mandoobee → Tasree3 → Nazo → Yisbir → Asset Tracking → AI.
- **Evidence:**
  - "Intelligence Layer" is not a public Meerana term (EV-473). It implies integration between the products, which no dossier documents (DL-P06).
  - Asset Tracking is excluded from v1 (DL-P05; PRODUCT-SCOPE "Excluded (unchanged)"). Only its live-site positioning is registered (EV-151).
  - Wasel, which the owner confirmed (EV-530), is missing from the list.
- **What M3 does:**
  - Follows the reviewer's order as written.
  - Captions the stack "Six products as one layer. Each one deploys on its own."
  - Draws no flow lines between plates (scroll-choreography rule).
  - Shows Wasel as the IoT moment in the hero.
- **Decisions needed:**
  - (a) Keep Asset Tracking, which then needs a dossier, current material and a product page, or swap Wasel into the layer.
  - (b) Keep "Intelligence Layer" as a portfolio name, or rename it "the Meerana ecosystem" unless an integration layer actually exists.
- **Owner:** leadership + product owners.

**DD-20 · The story scenario (Problem → AI detects → Automation acts → Dashboard shows → Business outcome)**
- **M3 uses one documented Yisbir workflow:**
  - Smoke in a storage bay, seen by an existing camera (EV-138, EV-444; storage areas EV-537).
  - Alert, clip and task → dashboard by zone and hour (EV-138, EV-534; YISBIR-USE-CASES §1).
  - Every ID and number is labelled sample. The outcome line makes no measured claim.
- **Not shown:** cross-product automation (e.g. a Yisbir alert opening a Tasree3 workflow), until an integration is documented.
- **Alternative scenario:** PPE compliance on a site (EV-134).
- **Owner:** the Yisbir product owner confirms that alert → task → dashboard matches the product.

**DD-21 · Closing CTA**
- **Reviewer:** "Together Let's build what comes next."
- **M3:**
  - Headline "Together, let's build what comes next." (punctuation normalised).
  - Primary action "Talk to Meerana" → info@meerana.ae (EV-531).
- **Note:** the landing-page formula asks for a product-named final CTA. A brand-level close suits the homepage; product pages keep product-named CTAs.
- **Owner:** marketing.

**DD-22 · Glass (owner, 2026-10-10, revised the same day)**
- **First ask:** "Bring premium glassmorphism everywhere." This overrides ui-system rule 1 (no glass stacking).
- **Revision:** "Keep the cards solid, bring glassmorphism only to places necessary."
- **Rule:** glass only on layers that float over the moving 3D scene: the Dynamic Island nav and its menu sheet. Every card, chip, control and the lightbox are solid.
  - *Status:* the cards are solid since 2026-10-10. Chips, the gallery counter, zoom buttons and the lightbox still use glass, and turn solid in Phase 1 of the change plan.
  - Recipe: navy-950 at 80 %, `saturate(180%) blur(20px)` inside `@supports`, a 1 px white 8 % border and a 10 % inset top highlight.
  - Opaque fallback under `prefers-reduced-transparency`.
  - The audit's G10 is waived at page level with this reason.
- **Owner:** decided.

**DD-23 · Horizontal product gallery (owner, 2026-10-10)**
- **Ask:** "For each product details make it horizontal scrolling, with fade in fade out."
- **Conflicts with:** the scroll-choreography pin limits (≤ 150vh per pin, ≤ 300vh per page). The first build pinned about 750vh.
- **Recommendation** (judge, review round 2026-10-10):
  - One 250vh pin with per-card snap, only at ≥ 1280×760.
  - A native swipe rail below that and under reduced motion.
  - The page total stays ≤ 300vh because the story uses sticky stages.
- **Owner decision needed:** approve the 250vh exception, or fall back to a rail with no pin.

**DD-24 · Spring easing for the Dynamic Island only**
- `--ease-spring: cubic-bezier(0.34, 1.32, 0.64, 1)` on the island morph. This is a motion_lint M14 warning, accepted.
- No spring anywhere else: the 3D morphs use the token family.
- **Owner:** design lead.

**DD-25 · Professional review round (2026-10-10)**
- **Reviews:** four specialist reviews (visual, components, 3D/motion, brand/UX/mobile), two benchmarks against 20 top software sites, and a judge pass.
- **Where:** `docs/review/m3-2026-10-10/`; the change plan is `docs/M3-CHANGE-PLAN-2026-10-10.md`.
- **Owner:** owner (decisions listed in the plan).

### Round 3 (2026-10-11): horizontal product stories and the responsive landing

The binding spec is `docs/r2/FINAL-SPEC.md` (§1, §2 and §14 hold the reasoning). The same entries are in `plan/05-conflict-decision-log.md` §I. The D numbers are the client questions in FINAL-SPEC §14.

**DD-26a · Product-page scroll length (D1)**
- **Ask:** every product page is one horizontal strip of 10–14 scenes, driven by vertical wheel, trackpad or keys.
- **Conflicts with:** the 300vh per-page pin budget (plan/08 conventions, C18).
- **Decision:** product pages are exempt from the budget. Each scene costs one step, `--ps-step: clamp(480px, 70svh, 720px)`. That is (N − 1) × step of scrolling: about 6,240 px for Tasree3 at 1366×657, or one wheel notch per scene. The homepage keeps ≤ 300vh (gallery 250svh + hero hand-off 40svh).
- **Checked by:** P-02 in `scripts/verify-stage.mjs`; the homepage budget by S-03 and `verify-launch.mjs` `pin`.
- **Owner:** client approval pending (D1). **Status:** recommended, built.

**DD-26b · The horizontal gate moves to 1024×520 (D2; DD-23 amended)**
- **Ask (client):** products must be horizontal on every desktop and laptop, short screens included (1366×657, 1280×601, 1536×730).
- **Decision:** the product stage and the homepage gallery both turn horizontal from ≥ 1024×520 with a fine pointer and motion allowed (was 1280×760). This includes 1366×768 at 125% Windows scaling (1093×529 in Chrome).
- **Where:** `lib/breakpoints.ts` (`STAGE_MIN_H = 520`, `MQ.stage`, `MQ.pinned`).
- **Checked by:** P-01, G-01 and `verify-launch.mjs` `pin` (1093×529, 1280×601, 1366×657, 1536×730, 1920×937). The old "1280×720 is a rail = PASS" assertion is deleted.
- **Owner:** client (2026-10-11). **Status:** decided.

**DD-26c · Reduced motion is a static horizontal rail (D3)**
- **Ask:** the audit suggested a vertical layout for reduced motion. The client rejected vertical outright.
- **Decision:** under `prefers-reduced-motion: reduce` the product story is the same horizontal rail with `data-static`. There is no GSAP request and no view-timeline, buttons jump instantly, and every scene is complete. The gallery is a rail too. Windows "Animation effects: off" reports `reduce`, so a client machine with that setting saw the old static vertical page.
- **Checked by:** P-12, G-08 and `verify-launch.mjs` `reduced`.
- **Owner:** client confirmation pending (D3: run `matchMedia('(prefers-reduced-motion: reduce)').matches` on the client's machine). **Status:** recommended, built.

**DD-26d · One gate for the stage and the gallery**
- **Decision:** `MQ.stage` and `MQ.pinned` are the same query: `(min-width: 1024px) and (min-height: 520px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`. Height tiers are shared: tight ≤ 620, compact ≤ 760. Stage mode is written only after GSAP has built, so a failed chunk leaves the page a working rail.
- **Pin mechanism:** CSS sticky plus one un-pinned root ScrollTrigger for both. No GSAP `pin` and no pin spacer.
- **CSS lint:** every `@media` px value in `app/*.css` comes from the shared set (`scripts/verify-css.mjs`, also run as `verify-launch.mjs` `lint`). The set adds the three hero-tier values §7 itself uses: 900, 580 and 640.
- **Owner:** design lead. **Status:** decided.

**DD-26e · The rail (touch, narrow, short and reduced motion)**
- **Decision:** everything outside the gate with a height of ≥ 500 px gets a native horizontal snap rail: `overflow-x: auto; scroll-snap-type: x mandatory`, one scene per screen width. It has no inner vertical scroller, and buttons and controls are ≥ 44 px. When motion is allowed and `animation-timeline: view()` is supported, the rail adds a CSS parallax. The server HTML is the rail, so the page works without JavaScript.
- **Checked by:** P-13 and P-15; gallery G-03.
- **Owner:** design lead. **Status:** decided.

**DD-26f · List view: automatic only below 500 px tall, otherwise opt-in**
- **Decision:** scenes stack vertically only:
  - at `max-height: 499px` (landscape phones, 200% zoom on laptops; WCAG 1.4.10), in CSS;
  - when the reader picks List view (stored as `localStorage["meerana:view"]`);
  - in print.
  It is never automatic at 520–560 px tall, which would have turned 1366×768 at 125% back into a vertical page.
- **Checked by:** P-01 (the toggle survives a reload) and P-14.
- **Owner:** design lead. **Status:** decided.

**DD-26g · Product Open Graph cards are `.png` route handlers**
- **Spec:** FINAL-SPEC §10 names `app/products/[slug]/opengraph-image.tsx`.
- **Finding (measured on Next 16.4 with a throwaway static export):** the file convention does export, but it writes an extensionless file (`out/products/<slug>/opengraph-image`). `serve` and Apache send no Content-Type for it, and LinkedIn and Facebook reject an `og:image` without an image type. The `generateImageMetadata` variant, which would add an extension, fails `output: export` for a dynamic segment.
- **Decision:** `app/products/[slug]/og.png/route.tsx` renders the same card (`ImageResponse`, 1200×630, `force-static`, `generateStaticParams` from `STORIES`) into `out/products/<slug>/og.png`. `lib/seo.ts` `pageMeta` points each product route's `og:image` at it, and any host serves it as `image/png`. Nothing on the card is new: the name, descriptor, accent, white symbol and the product's own gallery screen with its provenance label. There are no people and no generated imagery.
- **Checked by:** X-01 in `verify-launch.mjs` `links`: one image per product, each a 1200×630 PNG served as `image/png`.
- **Owner:** F (verification). **Status:** decided.

---

## 8. Rejected alternatives (considered, not prototyped)

| Alternative | Why rejected |
|---|---|
| Neon command centre (Figma Make lineage) | Telemetry theatre, neon off-palette, invented chips (`meerana-brand`, `meerana-product-ui`) |
| Glass dashboard collage (Dark Draft lineage) | Generic; glass stacking; invented stats |
| World-network globe | Decorative, heavy (the live 698 KB texture), says nothing true |
| Bilingual "parity hero" (EN \| AR mirrored) | Strong and ownable, but needs **transcreated** Arabic (DL-L01, phase 2). Revisit at the Arabic launch. The Nazo demo proves the product side is already RTL-real. |

## 9. Next steps

1. Review the prototypes from `prototypes/index.html`, then choose directions:
   - Meerana: M3 (full-page 3D, from the 2026-10-10 reviewer comments; DD-17 … DD-21), M1 (+ M2 model section) or M2.
   - YISBIR: Y2 (+ Y1 chapter) or Y1.
2. Decide DD-01 … DD-14, plus the plan items the prototypes depend on:
   - DL-P07: face and person search wording; both prototypes leave it out.
   - DL-T08: live-site security fixes, and the dead `info@yisbir.ai`. Prototype CTAs route to info@meerana.ae (EV-004).
   - Whether to register the live site's YISBIR security list (after-hours intrusion, perimeter breaches, vehicle movement anomalies; `research/sources/live-site-extract.md` §Security) so Y1 can show it.
3. Supply the P0 assets from REPORT §8: vector logos, neutral-tenant Nazo access, Yisbir and Tasree3 recordings, and partner logo permissions.
4. Build the vertical slice. The plan proposes Tasree3. If Nazo becomes a lead product, the **Nazo approval chapter** is an equally strong slice candidate, because real UI exists for it today.
5. Run `anti-generic-audit` on every new page before review (`.claude/skills/anti-generic-audit`).

---

## Appendix A: hero copy decks with evidence

| Direction | Eyebrow | H1 (≤ 8 words) | Lede (≤ 2 sentences) | CTAs |
|---|---|---|---|---|
| M1 | MEERANA TECHNOLOGIES · DUBAI, UAE · EST. 2022 [EV-020] | From the front gate to the final approval. (`plan/06` H1, shortened) | Meerana builds AI products for access control, video intelligence, workplace operations, process management and official correspondence. Built in the UAE and deployable on your own infrastructure. [EV-006/007, EV-101, EV-440, EV-113, EV-400, EV-141, EV-461] | Explore the products · Talk to Meerana |
| M2 | BUILT IN THE UAE · SINCE 2022 [EV-007, EV-020] | Five operating environments. One company behind them. (`plan/06` H3 + Nazo) | Perimeter, cameras, workplace, processes and correspondence — each is run by a Meerana product, built in the UAE. [EV-007, EV-101, EV-440, EV-113, EV-400, EV-141]. Deployment detail per product lives in the fact table, not in the lede: "your own cloud or data centre" is true of Tasree3 (EV-407) but not of Wasel (cloud / local / BLE, EV-103). | Explore the products · Talk to Meerana |
| Y1 | OPERATIONAL INTELLIGENCE · REAL-TIME MODULE [EV-131, EV-133] | Safer sites from the cameras you already have. | YISBIR watches existing CCTV for missing PPE, restricted-zone entry and falls, and alerts your team as it happens. It runs on your own servers, with no new cameras required. [EV-133, EV-134, EV-443, EV-444] | Request a demo · See how search works |
| Y2 | OPERATIONAL INTELLIGENCE · AI VIDEO INDEX [EV-131, EV-440] | Search hours of video like a document. | YISBIR indexes what is said in 50+ languages, what text appears on screen and what happens in frame. Teams find the moment in seconds, on their own infrastructure. [EV-440, EV-442, EV-444] | Try a sample search · Request a demo |

**Nazo lines (M1 chapter / product card):**
- H: "The final approval, signed and sealed."
- Card: "Nazo routes official correspondence through every approval, e-signature and archive step. Every closed record is sealed and verifiable." [EV-141, EV-142, Nazo demo 2026-10-04]

## Appendix B: full contrast tables
Generated by `contrast_directions.py`: 53 pairs across M1, M2, Y1 and Y2. All text pairs used for content meet AA. Pairs failing 4.5:1 are restricted to 3:1 non-text use or decoration, as marked in §3.3, §4.3, §5.3 and §6.3. The machine-readable values live in `.claude/skills/ui-system/references/tokens.css` and `.claude/skills/ui-system/references/contrast-matrix.md`.
