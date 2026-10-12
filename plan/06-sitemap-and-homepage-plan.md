# 06 — Sitemap, navigation & homepage plan

**Governing skill:** `meerana-narrative`.
**Copy status:** every line is *proposed copy* built from cited evidence (`EV-…`). Nothing ships until the cited rows are `ok-to-use`/`use-with-edit` and Meerana signs off. Motion ids (`M-…`) are in 08.

## 1. Scope recommendation

| Page / template | v1? | Why |
|---|---|---|
| Narrative homepage | ✔ | The ecosystem story plus direct access to every product |
| Lead product story pages: Tasree3, Yisbir, Mandoobee | ✔ | Strong, current, product-owned evidence (04) |
| Wasel product page | ✔ *if DL-P02 confirms availability*; otherwise a short "available on request" fact page | One of the four brand sub-brands, but thinly evidenced |
| Supporting fact pages (NAZO) | Only if DL-P05/P08 confirm | Documented on meerana.ae only |
| Products index `/products` | ✔ | One place listing products at status-appropriate depth, with links to tasree3.ae, yisbir.com and the app stores |
| Services `/services` | ✔ | Four service lines (DL-S01) |
| Company `/company` | ✔ | About, offices, recognition, partners, events |
| Contact `/contact` | ✔ | Conversion; `?interest=` preselect |
| Privacy `/privacy` | ✔ | Required for the form and analytics (PDPL) |
| Careers | Optional | Only if hiring |
| Arabic `/ar/…` | Phase 2 (DL-L01) | RTL-ready from day one |
| News/insights | ✘ v1 | No publishing cadence (the newest live item is Sep 2024). The company page carries a curated "In the news" list instead (EV-514). |
| Courses, Accelerator, Gallery | ✘ | Legacy or off-strategy (DL-S04) |

## 2. Sitemap

```
/
├─ /products
│   ├─ /products/tasree3     (lead · story · vertical slice)   ↗ tasree3.ae
│   ├─ /products/yisbir      (lead · story)                    ↗ yisbir.com
│   ├─ /products/mandoobee   (lead · story)                    ↗ App Store / Google Play
│   ├─ /products/wasel       (lead · story or fact page — DL-P02)
│   └─ /products/nazo        (fact page — only if DL-P05/P08)
├─ /services    (#consulting #bespoke-development #partnerships #staff-augmentation)
├─ /company     (#about #offices #recognition #partners #events #news [#leadership])
├─ /contact     (?interest=…)
├─ /privacy
└─ /ar/…        (phase 2)
```

## 3. Navigation model

**Header (desktop):**
- `[Meerana logo]` · `Products ▾` · `Services` · `Company` · `[Contact us]`
- Utility: `Reduce motion`; `العربية` from phase 2.

**Products ▾ disclosure panel:**
- The four lead products, each with logo, descriptor and one line. This is a router, not marketing copy.
- Outbound links: "tasree3.ae ↗", "yisbir.com ↗", "Get the Mandoobee app".
- "All products →".

**Mobile:**
- `Logo` · `Contact` · `☰`.
- A full-height panel with the same structure. The Contact button stays visible.

**Footer:**
- Products · Services · Company · Contact · Privacy
- Legal entity (DL-C01) · "#1704, Blue Bay Tower, Business Bay, Dubai" (unit per DL-C06) · info@meerana.ae · phone (DL-C04) · verified socials (EV-021) · "Founded in Dubai in 2022" (EV-020)
- Brand lines (EV-006/007)

**Direct access guarantees:**
- The hero contains a four-product index: one click to any product.
- The header is always available: at most two interactions from any scroll position.
- Each chapter has an anchor (`#tasree3` …) and links to its product page.

## 4. Narrative arc: "From the front gate to the final approval"

| Act | Visitor question | Section |
|---|---|---|
| Who | Who is Meerana? | H1 Hero |
| Route | Which product fits my problem? | H2 Product index |
| Where | Where do these products sit in an organisation? | H3 Ecosystem model |
| How (×4) | What does each product do, for whom? | H4 Wasel (perimeter) → H5 Yisbir (cameras & video) → H6 Mandoobee (workplace) → H7 Tasree3 (processes) |
| Control | Where does our data live? | H8 Deployed on your terms |
| Beyond products | Can Meerana build or integrate the rest? | H9 How Meerana delivers |
| Trust | Can we trust them? | H10 Proof |
| Act | How do I start? | H11 Contact |

**Why outside-in:**
- The sequence moves from the most tangible (a gate) to the most abstract (an organisation's processes as data).
- It ends on Tasree3, the flagship, matching "the final approval" in the H1.
- The ecosystem is **four operating environments served by one company and one design language**. It does not claim the products are integrated with each other (DL-P06).

**Contingency:**
- If Wasel is not commercially available (DL-P02), H4 becomes a compact "Also from Meerana" strip and H1 changes to "From the camera feed to the final approval."
- The remaining order is unchanged.

**Estimated length:**
- Desktop (1440×900): ~11.1 viewports.
- Mobile (390×844): ~15.5 screens.
- Hard-pinned distance on the homepage: 0. Chapters use a sticky stage while text scrolls (08).

---

## 5. Section-by-section plan

### H1. Hero · `#top` · navy

| | |
|---|---|
| **Purpose** | Identity, category and origin in under 5 seconds |
| **Question** | "Who is Meerana and what do they do?" |
| **Eyebrow** | "Meerana Technologies · Dubai, UAE · since 2022" [EV-001, EV-003, EV-020] |
| **H1** | **"Technology for the whole operation — from the front gate to the final approval."** *Alternative: "AI-powered enterprise products, built in the UAE." [EV-006, EV-007]* |
| **Lede** | "Meerana builds AI-powered enterprise products for access control, video intelligence, workplace operations and process management — and the consulting and engineering to put them to work." [EV-006, EV-101, EV-440, EV-113, EV-400, EV-030–032] |
| **Brand line** | "AI-Powered Enterprise Products Ecosystem · Built in the UAE for a smarter future" [EV-006, EV-007] |
| **CTAs** | Primary "Explore the products" → `#ecosystem`. Secondary "Talk to Meerana" → `/contact`. |
| **Composition** | Text in cols 1–6; lattice symbol `SceneSlot` in cols 7–12 (poster first). The H2 index peeks above the fold. |
| **Interaction** | M-home-01 (the lattice assembles once; scroll pulls back) |
| **Assets** | Vector symbol (DL-B02); hero poster; optional licensed night-Dubai photography (the brand-PDF hero image's source and licence are unknown) |
| **Mobile** | Stacked; poster symbol (no WebGL); full-width buttons |
| **No-motion** | Static poster; LCP = H1 text |

### H2. Product index · `#products` · light neutral

| | |
|---|---|
| **Question** | "Which product fits my problem?" |
| **Heading** | "Four products. Start where your problem is." |
| **Cards** | **Wasel** — Smart gate & access control — "Open, monitor and manage gates from your phone — with Bluetooth fallback when the internet is down." [EV-100, EV-103]<br>**Yisbir** — Operational intelligence — "Search hours of video by who appears, what's said and what's on screen." [EV-131, EV-440, EV-442]<br>**Mandoobee** — Smart office application — "Attendance, requests, tasks, documents and an AI assistant in one workplace app." [EV-112, EV-421]<br>**Tasree3** — AI-native process management — "Zero bureaucracy. One process solution." [EV-400] |
| **Composition** | 4 equal cards: official logo, descriptor, one line, "Explore →" and "See it below ↓". The product accent appears only as a 2 px top rule. |
| **CTA** | Card → `/products/<slug>` |
| **Mobile** | A 2×2 grid at ≥ 375 px (test against a horizontal snap-scroller) |
| **Repetition rule** | The **only** card set on the page |

### H3. Ecosystem model · `#ecosystem` · light ("architectural model")

| | |
|---|---|
| **Question** | "Where would these products sit in my organisation?" |
| **Headline** | "Four operating environments. One company behind them." |
| **Body** | "Each Meerana product works in a different part of an organisation: the perimeter, the cameras that watch it, the workplace, and the processes that run through all of them." *(interpretation of EV-101, EV-440, EV-113, EV-400)* |
| **Legend** (DOM) | 1 Perimeter & access — Wasel · 2 Cameras & video — Yisbir · 3 Workplace — Mandoobee · 4 Processes — Tasree3 |
| **Composition** | A sticky stage (cols 6–12): an isometric model built from lattice cells (perimeter + gate; a site with camera masts; an office building; department blocks with a process path). Legend and text in cols 1–5. |
| **Interaction** | M-home-03; zones highlight as the legend scrolls |
| **Mobile** | Static illustration with numbered zones; legend items link to the chapters |
| **Honesty** | No data lines between products (DL-P06) |

### H4. Wasel chapter · `#wasel` · Wasel brown *(contingency per DL-P02)*

| | |
|---|---|
| **Question** | "How do we control many gates — and not get locked out when connectivity fails?" |
| **Beat A** | "**A gate is only as reliable as its connection.**" |
| **Beat B** | "Wasel connects a controller at each gate to a mobile app, the cloud and your local network — and keeps working over Bluetooth when the internet drops." [EV-101–EV-103] |
| **Interface moment** | `UI-wasel-01` (illustrative): Open (the barrier in the zone rises) → Internet off → "Bluetooth fallback" → Open |
| **CTA** | "Explore Wasel →" |
| **Mobile / no-motion** | Zone poster + 3 step buttons |

### H5. Yisbir chapter · `#yisbir` · Yisbir abyss

| | |
|---|---|
| **Question** | "Our cameras record everything — how do we find what matters, and catch risks as they happen?" |
| **Beat A** | "**Hours of footage. One minute that matters.**" |
| **Beat B** | "Yisbir indexes your video — who appears, what's said in 50+ languages, what text is on screen — so teams can search it like documents. On sites, it also watches live for missing PPE and restricted-zone entry." [EV-440, EV-442, EV-133, EV-134] |
| **Interface moment** | `UI-yisbir-01` (illustrative): query "permit approved" → 3 transcript hits → open one → the site camera view shows a "Restricted zone · Zone B" alert overlay |
| **CTA** | "Explore Yisbir →" |
| **Sensitive data** | No faces, gender or plates (DL-P07) |

### H6. Mandoobee chapter · `#mandoobee` · Mandoobee mist

| | |
|---|---|
| **Question** | "How do we get attendance, requests and approvals out of paper and five different apps?" |
| **Beat A** | "**Too many tools. Not enough productivity.**" (live-page heading) |
| **Beat B** | "Mandoobee puts attendance, HR requests, tasks, documents, meetings and an AI assistant into one app for employees — and one dashboard for managers." [EV-113, EV-421, EV-422] |
| **Interface moment** | `UI-mandoobee-01/02` (**reconstructed** from real screenshots, DL-A02): swipe to clock in → the manager's attendance ring updates (sample data) |
| **CTA** | "Explore Mandoobee →" |

### H7. Tasree3 chapter · `#tasree3` · white canvas, ink + orange

| | |
|---|---|
| **Question** | "Where do our processes slow down — and how do we change them, with control?" |
| **Beat A** | "**Zero bureaucracy. One process solution.**" [EV-400] |
| **Beat B** | "Tasree3 mines how your processes actually run, helps you re-engineer them, and governs every approved version — on one AI-native platform, in your own cloud or data centre." [EV-401, EV-404, EV-405, EV-407] |
| **Interface moment** | `UI-tasree3-01/02` (illustrative): a discovered map → an orange wait between *Review* and *Approval* → "Parallelize" applied → the to-be model beside the as-is |
| **CTA** | "Explore Tasree3 →" (also "tasree3.ae ↗" in the page header) |
| **Exit** | The stage pulls back to the whole model; the sticky stage releases |

### H8. Deployed on your terms · `#deployment` · navy *(new; DL-P12)*

| | |
|---|---|
| **Purpose** | Answer data-sovereignty concerns with product-specific facts. This replaces the invented "Gov-Ready / ISO-Aligned" banner of earlier drafts. |
| **Question** | "Where does our data live, and who controls it?" |
| **Headline** | "Built in the UAE. Deployed where your data has to stay." [EV-007, EV-461] |
| **Body** | "Meerana builds its platforms to run locally when you need them to." [EV-461] |
| **Fact table** (4 rows) | **Tasree3:** your own cloud or data centre, in the region you choose; bring your own AI model endpoint [EV-407, PRODWEB §1.6]<br>**Yisbir:** on-premise, cloud or hybrid; works with your existing cameras [EV-444]<br>**Mandoobee:** on-premise, cloud or hybrid [EV-116]<br>**Wasel:** cloud, local network, or Bluetooth when offline [EV-103] |
| **Not included** | Certifications (DL-R03); "AI in a Box" until specified (DL-P05) |
| **Interaction** | Entrance only (M-global-01) |
| **Mobile** | Stacked rows |

### H9. How Meerana delivers · `#services` · light

| | |
|---|---|
| **Question** | "Can Meerana build or integrate what else we need?" |
| **Headline** | "Products — and the people to make them work." |
| **Columns** | **Consulting:** data management · data centre · customer experience · digital transformation · enterprise IT architecture · process re-engineering [EV-030]<br>**Bespoke development:** software & cloud · ERP · RPA · data services · cybersecurity testing · IoT solutions [EV-031, DL-S02]<br>**Technology partnerships:** Software AG · Commvault · FPT Software · CyberHive · Botminds [EV-240, EV-506, EV-505, EV-507, EV-508]<br>**Staff augmentation:** skilled technology professionals on flexible terms [EV-032, EV-033] |
| **Interaction** | M-home-09 (cells fill as columns enter) |
| **CTA** | "Explore services →" |
| **Mobile** | Accordion |

### H10. Proof · `#proof` · light neutral

| | |
|---|---|
| **Question** | "Can we trust Meerana?" |
| **Headline** | "Recognised in the UAE." |
| **Awards** (DL-R01) | **Future 100 (2023)**, selected by the UAE Ministry of Economy & Government Development and the Future Office [EV-202]<br>**Emirates Labour Market Award 2023 (MOHRE)**, Workforce Wellbeing & Quality of Life [EV-200; confirm with certificate]<br>**Best small enterprise in the UAE**, GCC Labour Ministers Committee ceremony, Doha, Sept 2024 [EV-203] |
| **Featured** | Dubai Chambers' "Dubai Dreamers: From Dubai to the World with Meerana Technologies" (2023) [EV-022] |
| **Partners strip** | Verified partner logos with relationship labels (DL-R02) |
| **Where we've been** (max 3) | Dubai International Chamber trade mission to Vietnam, 2024 [EV-261] · GITEX Global 2022 & 2024 [EV-513] · Dubai Business Forum – USA, 2025 [EV-512]. Photos per DL-R04. |
| **Rule** | Rendered only for `ok-to-use` evidence (`content:check`). No animated counters. |
| **CTA** | "About Meerana →" `/company` |

### H11. Contact · `#contact` · navy

| | |
|---|---|
| **Question** | "How do I start?" |
| **Headline** | "Tell us what you want to run better." |
| **Form** | Name · Work email · Company · Interest (Tasree3 / Yisbir / Mandoobee / Wasel / Services / Other) · Message · privacy acknowledgement · Turnstile (managed). Contract in 11 §15. |
| **Direct** | info@meerana.ae · phone (DL-C04) · Business Bay address |

---

## 6. Other pages (outline)

**`/products`:**
- Four lead products as larger cards: descriptor, one line, environment, three capabilities, and outbound links (tasree3.ae, yisbir.com, stores).
- Supporting products as compact rows (if any).

**`/services`:**
- Four sections (DL-S01), each with:
  - description and capabilities [EV-030–034];
  - related products (process re-engineering → Tasree3; IoT solutions → Wasel);
  - a CTA with `?interest=`.

**`/company`:**
- About [EV-009, EV-010]
- Founded 2022 [EV-020]
- Vision (DL-C05)
- Offices (DL-C06: UAE HQ; India if confirmed; **not** the UK)
- Recognition (DL-R01)
- Partners (DL-R02)
- Events (DL-R04)
- "In the news": outbound links [EV-514]
- Dubai Chambers feature [EV-022]
- Optional leadership (DL-C03)

**`/contact`:**
- The full form, direct contacts, and a static office map image with a maps link (no third-party embed by default).
