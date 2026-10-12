# REPORT: workspace audit and live-site analysis

**Scope:** Meerana Technologies (meerana.ae), YISBIR (yisbir.com, demo.yisbir.com) and Nazo (demo instance).

| | |
|---|---|
| **Audit dates** | 2026-10-01 (workspace + live sites) · updated 2026-10-04 (workspace changes, Nazo demo, reference research) |
| **Phase** | 1 of the revamp brief (read-only audit). Nothing outside `docs/` was changed to produce this report. |
| **Companion** | `docs/DESIGN-DIRECTIONS.md` (Phase 2), `.claude/skills/{web-animations,ui-system,landing-page,modern-tech-company,modern-ai-company,anti-generic-audit}` (Phase 3), `prototypes/` (Phase 4) |

**Evidence notation used throughout**

| Tag | Meaning |
|---|---|
| `W:` | A file in this workspace (path relative to `C:\Users\abhin\Desktop\meerana`) |
| `L:` | A live URL. Accessed 2026-10-01 unless a date is given. |
| `EV-###` | A row in `plan/03-evidence-register.csv`, researched by an earlier session on 2026-10-02. I cite these rows; I did not re-verify them unless I say so. |
| `DL-###` | A decision in `plan/05-conflict-decision-log.md` |
| `B` | The revamp brief. It is the *lowest* authority: "if the workspace contradicts the context above, the workspace wins". |

---

## 0. Executive summary

1. **There is no codebase in the workspace.**
   - The brief assumes a CRA repository to inventory. The workspace instead holds:
     - a brand-identity PDF;
     - a Google-Drive photo export;
     - two ISO badge images;
     - since 2026-10-02, a full concept plan (`plan/`), research extracts (`research/`) and eight `meerana-*` project skills.
   - The only copy of the live site's code is its **publicly served source map**, recovered into `W: research/live-site/sourcemap-app-src/`.
   - The rebuild therefore starts from zero code. What carries over is content, brand rules, evidence and assets.
2. **The workspace overrides several brief "facts".**
   - YISBIR is **a Meerana product**, not a separate company. The brand PDF ecosystem lists it, and yisbir.com says "YISBIR by Meerana Technologies".
   - The app is **Mandoobee**, not Mandoobi.
   - **Hi Legal** is a dormant legacy app.
   - The **UK company was dissolved** on 2025-11-25 (EV-502), and Egypt is a claim only (EV-503).
   - Full table in §3.
3. **Nazo is in scope (user decision, 2026-10-04).** The user confirmed that the demo at `https://array-yo2.taild8e203.ts.net/admin` is Nazo. It is white-labelled there as **"U Sign — Correspondence, reimagined"**.
   - This reverses the earlier plan's proposal to exclude NAZO (DL-P05/P08).
   - Its real UI is now the **best first-hand product-UI evidence after Mandoobee's**: bilingual with full RTL, sealed/verifiable archive and an AI assistant (§6).
4. **meerana.ae is a CRA single-page app with serious hygiene problems.** These should be fixed now, independent of the redesign (DL-T08):
   - The **6.8 MB source map is public**, including all source code.
   - A **third-party scraping API key is hard-coded** in client code. I redacted it here, and it should be rotated.
   - Chatbot backends run on **plain HTTP to a raw IP**.
   - `/openai-chatbot` is a public developer page with an "API Key" field.
   - HTTP does not redirect to HTTPS.
5. **Credibility defects are live on meerana.ae:**
   - the primary hero image carries visible **Adobe Stock watermarks**;
   - the testimonials API returns **Lorem Ipsum**;
   - the newest news item is **2024-09-13**;
   - the footer reads "© … 2024";
   - product pages make large unsupported claims (e.g. "99.2% AI detection accuracy", "512+ organisations", "100% Secure & Compliant").
6. **The site's SEO is effectively default:**
   - the meta description is still *"Web site created using create-react-app"* and the title is "Meerana" on every route;
   - there is no robots.txt, sitemap, Open Graph tags or canonical;
   - unknown URLs return HTTP 200 (soft-404);
   - **31 of 31 homepage images have empty `alt`**;
   - **at least 12 `<h1>` elements** sit on the homepage (the probe listed 12 and truncated there).
7. **Two unrelated visual systems are live, and neither follows the June 2026 brand kit:**
   - the legacy homepage uses Open Sans, `#072FA5` and stock photos;
   - the 2026 product pages use default Tailwind slate/indigo/purple, `from-purple-600 to-indigo-600` gradient buttons, `backdrop-blur` glass and macOS window dots;
   - the brand kit specifies Poppins + Almarai with `#0D3BFF / #071B36 / #3FD0FF`.
8. **YISBIR is positioned five different ways** across Meerana's own properties (§5.4). The product-owned site and the meerana.ae page agree on *AI video indexing/analytics*. The brand-PDF card subtitle ("Smart Gate & Access Control") and the chatbot ("AI talent acquisition") are errors (DL-P01).
9. **Proof is thinner than the current site implies, but the brief's four headline partners are all verifiable:**
   - Software AG (EV-240), FPT Software (EV-505), CyberHive (EV-507), Dubai International Chamber / Dubai Chambers (EV-509).
   - Commvault and Botminds are verified too.
   - **No public evidence of ISO 27001/22301 certification** was found (DL-R03). The two badge images are generic ISO-logo roundels, which ISO does not permit certified companies to use (§1.5).
10. **The earlier plan (`plan/`) is strong and mostly reusable.** My Phase 2–4 deliverables build on it. Where this brief's instructions differ from that plan, the conflict is logged for a decision in `DESIGN-DIRECTIONS.md` §7, never silently resolved. The differences are Tailwind + shadcn/ui vs CSS Modules, and Lenis/Motion vs native scroll with GSAP only.

---

## 1. Workspace inventory (state on 2026-10-04)

### 1.1 Tree

```
C:\Users\abhin\Desktop\meerana
├─ MEERANA-BRAND IDENTITY-04062026.pdf            10.8 MB · 3 pages · Canva export, created 2026-06-03
├─ drive-download-20261001T072045Z-1-001.zip     44.5 MB · 117 files (114 photos, 3 videos), 2023–2024 events
├─ WhatsApp Image 2026-09-26 at 21.33.50.jpeg      ISO 22301 badge (generic roundel)
├─ WhatsApp Image 2026-09-26 at 21.33.52.jpeg      ISO 27001 badge (generic roundel)
├─ .claude/skills/                                  8 project skills from 2026-10-02 (meerana-*)
├─ plan/                                            15 files from 2026-10-02: concept & delivery plan, evidence register (182 rows), tokens
├─ research/                                        2026-10-02 extracts: live site, sources, recovered drafts, captures, brand images
└─ docs/ · prototypes/ · .claude/skills/<6 new>     added by this session
```

**Not present anywhere:**
- `package.json`, `requirements.txt`, `src/`, `.git`, components, design-token code, copy docs, a CMS export or a sitemap.
- The brief's Phase 1 items "frameworks, existing components, design tokens" can therefore only be answered from the **live site** (§4) and the **brand PDF** (§1.3).

### 1.2 What the Oct 2 session added (reused, not duplicated)

| Path | What it gives this project |
|---|---|
| `plan/03-evidence-register.csv` | 182 classified claims (verified-fact / company-claim / illustrative …) with public status. The validator passes. |
| `plan/05-conflict-decision-log.md` | Decisions on positioning, proof, offices, brand errors and live-site security (DL-*) |
| `plan/04-product-dossiers.md` | Per-product facts, users, workflows, interfaces and unresolved questions |
| `plan/06`–`08` | Sitemap, homepage H1–H11 plan ("From the front gate to the final approval"), storyboards, motion spec |
| `plan/09-design-system.md`, `plan/design-tokens.json` | Three-tier tokens (primitive → derived → semantic) with a verified contrast matrix |
| `plan/11`–`13` | Architecture (Next.js 16 static export), backlog, acceptance checklist |
| `research/sources/*.md` | Live-site extract, product and company web research, tech verification, company-profile text |
| `research/recovered/` | Figma Make v17 source and Dark Draft v2. **Both are flagged as non-evidence**: they contain invented telemetry, names, stats and certifications. |
| `.claude/skills/meerana-*` | Governance for evidence, brand, narrative, product UI, scroll, WebGL, frontend and a11y |

### 1.3 Brand identity PDF: extracted facts

Values were verified by vector extraction (`W: .claude/skills/meerana-brand/references/brand-reference.md`). I independently confirmed the palette, fonts and taglines from the PDF text layer and page renders on 2026-10-01.

| Item | Value |
|---|---|
| Master palette | `#0D3BFF` blue · `#071B36` navy · `#3FD0FF` cyan · `#EDEDED` neutral · `#FFFFFF`. Gradient strip: blue → navy → cyan → near-white. |
| Typography | **Poppins** (EN: ExtraBold, SemiBold, Medium, Regular) · **Almarai** (AR) |
| Brand essence | AI-Driven · Future-Ready · Enterprise · Integrated · Scalable |
| Taglines (raster text in the hero) | "AI-POWERED ENTERPRISE PRODUCTS ECOSYSTEM" · "BUILT IN THE UAE FOR A SMARTER FUTURE" |
| Mock-up line | "Smart Technology. Stronger Tomorrow." (office and booth mock-ups only; treat as unapproved) |
| Logo | An isometric parallelogram-lattice symbol + "MEERΛNΛ" wordmark (custom Λ) + "TECHNOLOGIES", in horizontal, stacked and symbol-only lockups. **Raster only.** |
| Product ecosystem (p.1 hexagons) | WASEL (IoT) · MANDOOBEE (Smart Office) · TASREE3 (AI Process Intelligence) · YISBIR (Operational Intelligence) |
| Sub-brand palettes (p.3) | **Wasel** `#6B3E26 #D9C1A3 #C58A52 #F7F4EF` (Avenir LT Pro + Cairo) · **Mandoobee** `#0D3D91 #047AFF #6C819A #F0F4F9` (Kufam + Alexandria) · **Tasree3** `#001731 #009BFD #FD5D01 #FFFFFF` (Exo 2 + Changa) · **Yisbir** `#0045F8 #43DAFE #00132D #FFFFFF` (Montserrat + Tajawal) |
| Errors inside the PDF | Yisbir's card subtitle repeats Wasel's ("Smart Gate & Access Control System"). "Tajwal" is a misspelling of Tajawal. Off-palette title colours. Two superseded hidden boards: different palettes and a teal Tasree3 (DL-B01). |
| **No Nazo sub-brand** | Nazo has no palette or type pair in the PDF. A small white logo, "NAZO · CRYSTAL CLEAR" (108×120), exists only among the Dark Draft v2 images (`W: research/recovered/dark-draft-v2/images/img11.png`). **Confirm it is official.** |

**Logo files available (all raster):**
- 1579×333 white horizontal (`W: research/recovered/figma-make-v17/public-meerana-assets/MEERANA-Logo-final-transparent-white-08.png`, identical to the live `/assets/` file);
- 1001 px stacked white (PDF);
- 401 px tiles;
- product logos, white only: Wasel 205 px, Mandoobee 644×271, Yisbir 279×67, Tasree3 308×308, Nazo 108×120.

**Vector masters are a launch blocker (DL-B02).**
- I produced high-fidelity SVG traces as a test (IoU 0.96 vs. source). They are **deliberately not shipped**: `meerana-brand` forbids presenting traces as official.
- The prototypes use the official rasters at or below native size.

### 1.4 Photo archive (zip)

| Folder | Files | Date(s) | What it shows | Usability |
|---|---|---|---|---|
| SPIEF 2024-CEO Visit | 15 | 2024-06-06 | Meerana executive on a SPIEF'24 panel; group shots | Best quality (1600 px, professional). Caption pending (DL-R04). |
| North Star 2024 | 12 + 1 video | 2024-10-13/14 | Meerana-branded kiosk beside Dubai Chamber signage; also general GITEX pavilions | Kiosk shots usable after verification. Pavilion and dignitary shots excluded. |
| CEO Jakarta & Vietnam 2024 | 58 + 2 videos | 2024-05-05…09 | Dubai International Chamber "New Horizons" trade mission; B2B tables | Mostly repetitive. **Contains private data** (business card, handwritten list, name sign): never publish. |
| CEO Seoul visit 2023 | 8 | 2023-11-22 | Meerana booth at a Seoul startup festival (COMEUP per news, EV-264) | Phone quality; optional |
| Lithuania 2024 | 7 | 2024-08-22/23 | Delegation; Nord Security office | Third-party premises; verify |
| Paris 2024 | 6 | 2024-05-25 | UAE national pavilion; no Meerana branding in frame | Verify participation |
| (root) | 8 | 2024-06/08/10 | Moore Threads visit (China); Arabic tenders panel; Dubai Chamber × Serbia "New Horizons" group | Verify |

**Facts about the archive:**
- **2 exact-duplicate pairs** (MD5).
- 30 of 114 images are under 1600 px on the long edge.
- No EXIF GPS.
- All photos are **2023–2024**. There is nothing from 2025–2026, the period of the current product launches.

Full curation is in `W: research/photo-curation.md`. I agree with it.

### 1.5 The two ISO images

- They are generic "ISO … CERTIFIED" roundels built from the ISO logo, not certificates.
- ISO's help centre states that only ISO and its members may use the ISO logo, and that certified companies "should use the certification body's logo, not the ISO logo". The recommended phrasing is "certified to ISO/IEC 27001:2022".
  - Source: help.iso.org/en/articles/375997-can-i-use-the-iso-logo, fetched 2026-10-01 by this session's stack-fact check.
- **Do not publish these images.** Make no ISO claim until certificates (entity, scope, certification body, number, validity) are supplied (DL-R03).

### 1.6 Earlier drafts (context, never evidence)

| Draft | Look | Keep the lesson | Reject |
|---|---|---|---|
| Dark Draft v2 (Manrope, `#1769FF/#071B5E/#050A1E`) | All-navy page, glass dashboard cards, product carousel, "Meerana Intelligence Layer" hub diagram | The section order idea: products → services → proof | Invented "Intelligence Layer" (EV-473); "5+ / 60+ / 40+ / 50+" stats; overstated awards; FinTech/ZingHR sections |
| Figma Make v17 (Space Grotesk / Inter / JetBrains Mono, `#0052FF/#00E5FF`) | Mono eyebrows, two-tone hero, metaballs, "LIVE TELEMETRY · 4 OPERATING LAYERS", product tabs, marquee | Two-tone headline, mono metadata labels | Metaballs; fake telemetry; "Gov-Ready / ISO-Aligned" chips; neon palette; green Tasree3 |

---

## 2. Business fact base (what may be stated, and on what basis)

| Topic | Fact | Basis | Status |
|---|---|---|---|
| Founding | Founded in Dubai in **2022** | EV-020 (three agreeing sources); B | ok-to-use |
| HQ | Blue Bay Tower, Business Bay, Dubai | L: meerana.ae privacy policy "#1704"; EV-003 notes **1704 vs 1706** | Confirm unit (DL-C06) |
| Legal name | "Meerana Information Technology" (UAE operating name, EV-500) vs footer "Meerana Technologies LLC" | EV-500; L: footer | **Blocker** (DL-C01) |
| Offices | UAE HQ verified; India LLP (Chennai) active (EV-501) | EV-501 | List UAE (+ India once confirmed) |
| | UK: CMS lists 128 City Rd, London, but the **company was dissolved 2025-11-25** | EV-502 | Remove the UK |
| | Egypt: claim only | EV-503 | Remove unless evidenced |
| | Kenya/Rwanda: a 2023 sponsored article about expansion | L: CMS news | Do not list |
| Contact | info@meerana.ae (site, privacy policy). Phone: unconfirmed. | L; DL-C04 | Confirm phone |
| Socials | linkedin.com/company/meerana · x.com/MeeranaTech1 · Instagram **meeranatechnologies** (footer) vs **meerana.technologies** (gallery) | L: footer, gallery source | Confirm Instagram (DL-T08 #11) |
| Strategic voice (2026) | "Sovereign AI solutions and enterprise platforms, deployed locally and secured by design" | EV-461 | ok-to-use (company claim) |
| Lead products | Wasel, Mandoobee, Tasree3, Yisbir (brand PDF hexagon), **plus Nazo (user, 2026-10-04)** | Brand PDF; user | — |
| Partners (verified) | **Software AG** (PartnerConnect, signed at GITEX 2022) · **FPT Software** (MoU 2024) · **Commvault** (VAP 2024) · **CyberHive** (MoU 2025) · **Botminds** · **Dubai Chambers** ("supported by"; Dubai International Chamber trade missions) | EV-240, EV-505, EV-506, EV-507, EV-508, EV-509, EV-261 | ok-to-use with relationship labels |
| Partners (unverified) | SAP "Gold Partner" badge, Microsoft, Dell, Kofax, Confluent, AgilePoint, SAS …, and **all 32 logos on the live "Partners & Clients" wall** (incl. government entities) | EV-242, EV-243 | Remove until permission/evidence (DL-R02) |
| Awards | Future 100 (2023) · Emirates Labour Market Award 2023, Workforce Wellbeing (MOHRE) · Best small enterprise in the UAE (GCC Labour Ministers Committee ceremony, Doha, Sept 2024) | EV-202, EV-200, EV-203 | Use the verified wording (DL-R01) |
| Certifications | No public evidence of ISO 27001/22301 | DL-R03 | Do not claim |
| Founder & CEO | Named in the register; spelling varies | EV-013 | Choose spelling (DL-C03); leadership section only with consent |
| Feature video | "Dubai Dreamers: From Dubai to the World with Meerana Technologies" (YouTube embed on the live homepage) | L; EV-022 | Usable as a featured mention |
| Company profile | Live download "MEERANA-CP-DE-V1.0 2026.pdf" (email-gated). The 2024 profile text is in `W: research/sources/company-profile-pdf-text.md`. | L: bundle string | Request the 2026 profile from Meerana |

**Products: one line each (canonical sources)**

| Product | Canonical descriptor | Strongest source | Status |
|---|---|---|---|
| **Tasree3** | AI-native process management: re-engineering · mining · governance. "Zero bureaucracy. One process solution." | tasree3.ae (EV-400–416) | Active (flagship) |
| **Yisbir** | Operational Intelligence / AI video intelligence: index and search video (people, speech in 50+ languages, on-screen text), plus a real-time construction/security module | yisbir.com (EV-440–449), meerana.ae/yisbir (EV-132–136) | Active |
| **Mandoobee** | Smart Office Application: attendance, HR requests, tasks, documents, meetings, AI assistant; web + iOS + Android | App stores (EV-420–427) | Active (low public adoption) |
| **Wasel** | Smart Gate & Access Control: app + controller + cloud/local/BLE fallback | meerana.ae + brand PDF only (EV-100–104) | Availability unconfirmed (DL-P02) |
| **Nazo** | Correspondence & workflow management: initiate, route, approve, e-sign, seal and archive official correspondence, with an AI assistant; bilingual | meerana.ae `/nazoo` (EV-141/142) + **live demo observed 2026-10-04** (§6) | **Active (user-confirmed)**; naming open (DL-P08) |
| Hi Legal (brief) | Legal-management app | Legacy; 10+ installs (EV-472) | Exclude unless reinstated |

---

## 3. Brief vs workspace: contradictions (the workspace wins)

| Brief says | Workspace says | Resolution applied in Phases 2–4 |
|---|---|---|
| "Two companies": Meerana and YISBIR | YISBIR is one of Meerana's four ecosystem products (brand PDF p.1/p.3); yisbir.com: "YISBIR by Meerana Technologies"; LinkedIn launch by Meerana (EV-443) | YISBIR is an **endorsed product brand** with its own site ("A Meerana product") |
| Products "Mandoobi" and "Hi Legal" | **Mandoobee** is canonical (EV-110). "Mandoobi" is 2023 press only (EV-424). Hi Legal is legacy (DL-P05). | Mandoobee everywhere. Hi Legal is excluded. Nazo is added (user). |
| Offices: UAE, UK, Egypt, India | UK dissolved 2025-11-25 (EV-502); Egypt claim only (EV-503); India LLP active (EV-501) | UAE (+ India pending). No UK. No Egypt. |
| Focus: IoT, Blockchain, AI, cybersecurity, smart city | 2026 positioning: an "AI-powered enterprise products ecosystem" with sovereign deployment (EV-006, EV-461). Blockchain/metaverse are legacy (DL-S02). "Smart city" appears nowhere in the workspace. | Lead with AI products and sovereign deployment. IoT via Wasel. No blockchain, no "smart city" claim. |
| Key partners: Software AG, FPT, CyberHive, Dubai International Chamber | All four verified, plus Commvault and Botminds | All four are surfaced with relationship and year (museum-placard band) |
| Current site "create-react-app shell with thin content" | Confirmed live (CRA, React 18.2, Tailwind 3.3.3). **No code in the workspace.** | Rebuild from zero code. Reuse content, assets and evidence only. |
| YISBIR = CCTV retrofit: PPE, worker search, unauthorised entry, vehicle/visitor management, people counting, Deep Sort tracking, dashboard + mobile app | **Retrofit:** confirmed ("no hardware changes required", EV-444). **Core:** video indexing and search (EV-440/442). **Real-time module:** PPE, restricted zone, falls, intrusion, vehicle anomalies, attribute search (EV-133–136). **Demo portal:** "Video Analytics" and "Video Indexer", Residential/Institution sign-up. **Not found in the workspace:** Deep Sort, people counting, mobile app. | Both halves are designed (search + live module). Deep Sort, people counting and the mobile app are labelled `[CONFIRM]`. **No face, gender or plate demos** (DL-P07). |
| Partner band "surface prominently" | Logo permissions are unknown. Partner logos exist only for Software AG (`software.png`) and FPT (course-provider image). | Typographic **placards** that need no logo licence; logos added when supplied |

---

## 4. Live site: meerana.ae

### 4.1 Stack and architecture (observed)

**Front end:**
- Create React App build: `main.5717dfa4.js` is 1,961,794 B minified; `main.css` is 172,386 B.
- React **18.2.0**, react-router v6, **Tailwind CSS v3.3.3** (CSS banner).
- 56 npm dependencies. Notable: `react-globe.gl`/`three`/`globe.gl` (a 3D globe, with the stock `earth-night.jpg` texture at 698 KB), `aos`, `swiper`, `chart.js`, `react-chatbot-kit`, `axios`, `lucide-react`, `h3-js`, `d3-*`.
- **CRA is deprecated:** the React team announced "Sunsetting Create React App" on 2025-02-14.

**Content:**
- Runtime JSON from a PHP API: `https://api.meerana.ae/allDataInfo/*.php`.
- Read endpoints: homepageInfo, aboutusInfo, chooseusInfo, experienceInfo, solutionInfo, partners_clientsInfo, partnerinfoInfo, testimonalsInfo, latestnewsInfo, locationInfo, contactusinfoInfo, ourteamInfo, courseProviderInfo, courseInfo.
- Form endpoints (not touched): contactform, carrerform, subscribers, partnerform, courseRegistration, profiledownloders.
- **Hosting:** Apache. Every path returns `index.html` with HTTP 200.

### 4.2 Page structure (homepage, in order) and routes

**Homepage sections:**
1. Hamburger-only header, even on desktop.
2. 3-slide hero carousel: "Connecting the World Through Smart Technologies." / MOHRE award / Future 100.
3. About: "Meerana is your Digital Transformation Partner — An Emarati Group of Companies".
4. Vision quote and YouTube embed.
5. "Why Choose Us": "Most Trusted Community".
6. Solutions: 4 stock-photo cards (Consultation, Bespoke Products, Our Unique Products, Managed Services).
7. Team (2 members).
8. Latest News carousel (13 items).
9. Partners strip and "See more".
10. Contact form with a 249-country select, a product checklist and a 3D globe.
11. Footer: About, Company, Policies, Newsletter, "© … 2024".

**Routes:**

| Group | Routes | Notes |
|---|---|---|
| Product pages | `/mandobee`, `/yisbir`, `/tasree3`, `/nazoo`, `/wasel`, `/asset-tracking` | **All render, but none is linked.** The nav and landing page link a product only if a CMS title contains its name, and the CMS holds only four generic categories, so every link resolves to `/construction?id=…`. |
| Other pages | `/construction`, `/partners`, `/career`, `/courses`, `/course-details`, `/course-registration`, `/accelerator`, `/latest-news`, `/gallery`, `/privacy`, `/site-terms`, `/legal-of-service` | |
| Developer page | `/openai-chatbot` | Public, unlinked |

The front end also patches CMS text with a regex to delete "Smart Office Application" (`landingpage` source, l. 190–197).

### 4.3 Content inventory (what exists)

| Block | Content (verbatim highlights) | Quality |
|---|---|---|
| Hero slides | "Connecting the World Through Smart Technologies." · "Ensuring Employee Wellbeing and Workplace Environment" · "Chosen Among Future 100 Companies" | Generic. Slide 1's image is an **Adobe Stock comp with watermarks** (854×398, upscaled). |
| About | "Meerana is your Digital Transformation Partner" · "An Emarati [sic] Group of Companies" | No parent group found (DL-C02) |
| Mission/vision | "Build the most trusted community to deliver the highest quality technological services" (three variants across the site) | Pick one (DL-C05) |
| Solutions | 4 categories with **the same boilerplate subtitle ×4**; 23 list items (legacy: Metaverse/Blockchain, e-commerce, EV charger, Green Hub …) | Prune (DL-S01/S02) |
| Products (unlinked pages) | Mandoobee, Tasree3, Yisbir, **Nazoo**, Wasel and Asset Tracking pages, rebuilt in 2026 with mock dashboards | Claims need substantiation (§4.4) |
| News | 13 items, 2022-10-12 → **2024-09-13**; typos "Novemeber", "Decemeber", "recieving" | Stale for two years |
| Partners & clients | 32 undifferentiated logos (incl. Ministry of Interior, Cabinet Affairs, DEWA, ADIB, Emirates NBD …) | Permissions unknown (DL-R02) |
| Testimonials | 2 entries, **Lorem Ipsum** bodies | Delete |
| Team | 2 members (Founder & CEO; Digital Solution Partner) | Thin |
| Courses | "Course providers": FPT (4 courses, prices with **no currency**, `random_image_url_*` placeholders), SAS, Commvault, Botminds, Sprinklr (no courses) | Unfinished feature (DL-S04) |
| Contact | "Reach out effortlessly!…"; product checklist incl. "Voice Assistance", "Zing HR" | No ZingHR evidence (DL-S03) |
| Policies | "Privacy" is the **mobile app's** policy (GPS clock-in, camera OCR, microphone), dated 2024-12-06. "Site Terms" are **recruitment** T&Cs. "Legal of Service" is boilerplate. | Rewrite for PDPL (DL-T06) |
| Chatbot | Fallback answers call Yisbir "AI HR", Wasel "Logistics", Mandoobee "PRO Automation", NAZO "Document Management" | Wrong; remove |

### 4.4 Unsupported numbers currently published (product pages)

| Product | Published claims (source: product-page config objects in the bundle) |
|---|---|
| Yisbir | 99.2% AI detection accuracy · 10M+ hours processed · 500+ cameras supported · 24/7. Mock console: "24,331 videos", "98.6% AI accuracy", "842 workers on-site". |
| Mandoobee | 512+ active organisations · 50K+ happy users · 99.9% uptime. Public data: 50+ Android installs (EV-426). |
| Nazoo | "10x Faster Processing" · "100% Secure & Compliant" |
| Tasree3 | "Reduce process modeling time by up to 70%" · "100%" end-to-end visibility |
| yisbir.com | 95% search accuracy · 10x faster review. This **contradicts** meerana.ae's 99.2%. |

Rule going forward (`modern-ai-company` skill): **no number is published without a register row**. Demo numbers are labelled "sample data".

### 4.5 Brand consistency

| Item | Brand kit (Jun 2026) | Live homepage | Live product pages |
|---|---|---|---|
| Type | Poppins / Almarai | **Open Sans** (Google Fonts), Material Icons | Open Sans + Tailwind defaults |
| Colour | `#0D3BFF #071B36 #3FD0FF` | `#072FA5`, `#1A73E8`, `#202124`, `#333333` | Tailwind `slate-950`, `blue-600→indigo-600`, `purple-600→indigo-600`, `purple-500` pulses (YISBIR) |
| Imagery | Lattice, product cards, Dubai night | Stock (laptops, server racks), Adobe Stock comp, 3D globe | Mock dashboards, macOS dots, glassmorphism, **emoji icons** in the Yisbir mock (🎥 🔍 📊 🚨 ⚙️) |
| Logo | Raster lattice + wordmark | 1579×333 white PNG, **empty `alt`** | Same |

### 4.6 SEO and metadata

**Head and crawl files:**
- `<title>Meerana</title>` on every route, because routes are client-side with no per-route metadata.
- `<meta name="description" content="Web site created using create-react-app">`.
- No Open Graph or Twitter tags, no canonical, no structured data.
- `lang="en"` only; no Arabic.
- `theme-color #000000` (the CRA default). `apple-touch-icon /logo192.png` returns the HTML shell.
- No `robots.txt`, `sitemap.xml` or `manifest.json`. All three return the SPA shell with 200, as do unknown URLs (soft-404).

**Content and structure:**
- Content renders only after JS and API calls; the HTML has an empty `<div id="root">`.
- The homepage has at least 12 `<h1>`s: nav labels, slide titles and section labels such as "About Us", "Why Choose Us", "Solutions" (the probe truncated at 12). The H2 count is 1.

### 4.7 Accessibility (homepage sample)

- **31/31 images** have no `alt`, including the logo.
- Nav items are `<h1>` elements inside click handlers rather than links or buttons.
- The hamburger is a `<span>` with an `onClick` inside a button.
- Auto-advancing hero carousel; no pause control is evident.
- AOS hides content (`opacity:0`) until scrolled. With JS failure or reduced motion, sections stay blank; blank frames were captured during the audit.
- Footer body text is justified (`text-align: justify`).
- A scroll listener is added on every render without cleanup (`navbar` source).

### 4.8 Performance (measured)

- **Homepage decoded weight is about 6.5 MB across 48 requests.** The largest items:

| Asset | Size | Note |
|---|---|---|
| `bg-vector.png` | 2.39 MB | A PNG background |
| `main.js` | 1.92 MB | |
| `earth-night.jpg` | 0.70 MB | Globe texture |
| Open Sans woff2 | 0.21 MB | |
| `main.css` | 0.17 MB | |

- Hero slide 2 (`banner-02.webp`) is 4898×2276. Slide 1 is 854×398, stretched to full width.
- **A lab LCP number could not be produced from this environment.** The PageSpeed Insights UI stalled, and the PSI API returned HTTP 429. Run PSI from a normal connection before sign-off; the byte weights alone predict a poor mobile LCP.

### 4.9 Security and compliance (fix now, independent of the redesign; matches DL-T08)

| # | Finding | Evidence |
|---|---|---|
| 1 | **Public JS source map with full `sourcesContent`** (6.8 MB, 472 sources, 44 app files) | L: `/static/js/main.5717dfa4.js.map` |
| 2 | **Hard-coded third-party scraping API key** (scrapestack) in client code. Value redacted (43 chars). **Rotate it.** | Source `components/gallery/index.js` |
| 3 | Chatbot and "OpenAI" backends over **plain HTTP to a raw IP:port**; mixed-content risk | Source `chatbot/configs/ActionProvider.js`, `openai-chatbot/*` |
| 4 | Public developer page `/openai-chatbot` with an "API Key" input, model picker and "Dashboard (Dummy Data)" | L: route renders |
| 5 | HTTP is served without redirecting to HTTPS. No HSTS, CSP or X-Content-Type-Options headers observed. | `curl -I http://meerana.ae/` |
| 6 | Instagram scraped through a third-party scraping API (ToS risk) | `gallery` source |
| 7 | Form endpoints may return stored submissions on GET. **Not tested, by design.** The dev team should verify. | DL-T08 #3 |
| 8 | Third-party product content ("Remotioo Smart Gate", copied from Remootio) | DL-P02 / EV-431 |

### 4.10 Dead code and deprecated stack

**Deprecated stack:**
- CRA (deprecated 2025), Tailwind 3.3 (v4 is current), AOS (unmaintained), `react-chatbot-kit`.
- Material Icons (font) alongside lucide-react.

**Dead or unused code:**
- Commented-out nav items: OpenAI Chatbot, "New Mandobee", Careers, Testimonials.
- Unused `navigateToTest`.
- Two chatbot implementations.
- "Dashboard (Dummy Data)".
- Courses and Accelerator flows.
- A truncated source map (`App.js`, `index.js`, `wasel` partially missing).

---

## 5. YISBIR surfaces

### 5.1 yisbir.com (observed 2026-10-01)

**Build and layout:**
- Vite SPA (`/assets/index-*.js`); title "YISBIR"; **no meta description, Open Graph or canonical**.
- Body bg `#070A13`, text `#F8FAFC`. **Space Grotesk** 72/72 px H1 (−1.8 px) over **Inter** body. The brand kit says Montserrat + Tajawal.
- Hero: "Transform Your Video / Into Searchable Intelligence", with the second line in a **cyan→blue→purple gradient**.
- Cyan "Request Demo" + "Watch Video" CTAs, a pill badge, crosshair markers and a grid background.
- A mock browser with **macOS dots** reading "yisbir.ai/dashboard".

**Content:**
- **Stats:** 50+ languages · 95% search accuracy · 10x faster review · 24/7.
- **Features:** video indexing with face recognition · transcription in 50+ languages with speaker diarisation · OCR document scanning · person clips · secure downloads · library · access control · API.
- **Search types:** face, phrase, metadata, similarity, fuzzy, vector.
- **Process:** Upload → AI Processing → Search & Discover → Export & Share.
- **About:** "YISBIR is developed by Meerana Technologies … enhancing functionality **without requiring new hardware**."
- **Contact:** `info@yisbir.ai`. That domain does not exist, per DL-T08 #7.

**Assessment.** The content is the strongest YISBIR material. The visuals are the generic AI-startup template: gradient text, pill badge, Space Grotesk + Inter and macOS chrome. The hero text is invisible until its entrance animation runs, which delays LCP.

### 5.2 meerana.ae/yisbir

- **Hero:** "Turn Every Video into Intelligent Data." in Open Sans at 96 px / weight 900.
- **Modules:**
  - indexing, natural-language search, insights and alerts;
  - a **construction module**: missing helmets/vests, unsafe practices, restricted zones, falls, workers near hazards, after-hours intrusion, perimeter breaches, theft, vehicle anomalies;
  - **investigations**: search by person attributes (clothing/helmet/vest colour, *gender*), vehicle type/colour/**plate**, location and time.
- **Mock console:** "Yisbir Video AI Console v2.4", "Camera_04_HSE_Zone", "Person 99.2%", purple "Live System Connected", plus emoji nav.

### 5.3 demo.yisbir.com

- **Stack:** Django (CSRF tokens), Poppins, Font Awesome, Lottie and a Google Translate widget.
- **Access:** "Guest Login" (name, email, phone + reCAPTCHA) → **Video Analytics** / **Video Indexer**. Registration types: **Residential** and **Institution**.
- **Not entered.** It requires personal data and a CAPTCHA. Real dashboard recordings must come from Meerana (DL-A01).

### 5.4 Five positionings of one product

| # | Source | YISBIR is … |
|---|---|---|
| 1 | yisbir.com | "AI-Powered Video Intelligence"; About: "AI-Powered Operational Intelligence" |
| 2 | meerana.ae/yisbir | "AI-Powered Video Analytics & Indexing" + a construction site intelligence module |
| 3 | Brand PDF hexagon | "Operational Intelligence" |
| 4 | Brand PDF p.3 card | "Smart Gate & Access Control System" (copy error, DL-B01) |
| 5 | meerana.ae chatbot | "AI-powered talent acquisition and smart recruitment" (error) |

**Applied:**
- Descriptor: **"YISBIR — Operational Intelligence"**.
- Category: AI video intelligence.
- Lead with search; the real-time module is a chapter (DL-P01).
- Brief-only features (Deep Sort, people counting, mobile app) are marked `[CONFIRM]`.

---

## 6. Nazo (added 2026-10-04 at the user's request)

**URL:** `https://array-yo2.taild8e203.ts.net/admin` (a Tailscale-hosted instance).

**How it was observed:**
- Entered with the passwordless **demo** persona picker as a low-privilege **Viewer**.
- Browsed Inbox, Tracking and Archive read-only.
- Switched EN → AR → EN.
- No correspondence was created, approved, signed or sent.

### 6.1 What the product shows

| Area | Observed |
|---|---|
| Branding (tenant) | White-labelled **"U Sign — Correspondence, reimagined"**, "Correspondence management". The tenant logo is the **UAE federal emblem**. |
| Stack | Vite SPA, **Inter + IBM Plex Sans Arabic**, light theme (`#14213D` on `#F5F8FC`), theme toggle |
| Identity | Persona picker, "Demo access — no password". 12 demo personas across **Administrator, GM Office, DT Manager, Director, General Manager, Chairperson, Broadcaster, Viewer**. |
| Workspace IA | Inbox · New Correspondence · Sent by me · Tracking · Archive. ⌘K search. Notifications. Floating "New correspondence". |
| Inbox | SLA tiles: **Awaiting me · Due soon · Overdue · Signed this week**; "Awaiting your decision"; empty state "You're all caught up". |
| Tracking | "Live status of every correspondence". Cards/Table views. Columns: Correspondence · Status · **Progress (approver chain avatars)** · Requester · Updated. |
| Reference IDs | `TENANT/TYPE/YYYY/NNN`, with types **REQ** (approval), **CIR** (circular), **MEM** (committee decision), **HR** (announcement) |
| Statuses | **Signed & Complete · Active · Returned** |
| Archive | "Closed correspondence, **sealed and verifiable**", All archived / **My vault**, **Sealed / Unsealed + Verify**, signatory counts |
| AI assistant | Persistent right pane, "Context-aware, always on". Actions: **Summarize · Draft my comment · Anything missing? · What should I do?** Free-text "Ask U Sign". |
| Arabic | Full **RTL** mirroring (`dir="rtl"`, `lang="ar"`, IBM Plex Sans Arabic). Reference IDs stay LTR; Arabic dates. |

### 6.2 Implications

- **Status:** Nazo moves from "documented, availability unconfirmed" to **active product with a working demo**. Add it to the ecosystem as the fifth product, or as "also from Meerana". This is a positioning decision for Meerana.
- **Name:** NAZO (logo "NAZO · CRYSTAL CLEAR"; contact form) vs Nazoo (meerana.ae route) vs Nazo (the user's message, the evidence skill) vs U Sign (white-label tenant).
  - Working convention used in my deliverables: "**Nazo**" in running text and "NAZO" in the wordmark, pending DL-P08.
- **Do not reuse the tenant's branding in marketing.** That covers the UAE emblem, the "NEONAX" prefix (also a logo on the live partner wall) and the government-style demo data.
  - Capture marketing UI from a neutral, Meerana/Nazo-branded tenant with non-identifying sample data.
  - Until then, show it as **reconstructed** UI (`meerana-product-ui` provenance).
- **Honest proof points it unlocks:**
  - bilingual EN/AR with true RTL;
  - an approval chain with SLA states;
  - a sealed, verifiable archive;
  - an AI assistant with bounded actions.
- **No palette or type pair** exists for Nazo in the brand PDF. It uses the Meerana master layer until the brand owner defines one (new decision, see `DESIGN-DIRECTIONS.md` §7).
- **Hosting:** a `*.ts.net` Tailscale URL suits sales demos, not public linking. Don't publish it on the website.

---

## 7. Live vs workspace (summary matrix)

| Dimension | Live site(s) | Workspace | Gap |
|---|---|---|---|
| Brand | Open Sans, `#072FA5`, Tailwind defaults, purple gradients | Poppins/Almarai, `#0D3BFF/#071B36/#3FD0FF`, four sub-brands | Total |
| Products | Six product pages (orphaned) + 23 legacy service items | Four lead products + Nazo, with dossiers and evidence status | IA rebuild |
| YISBIR | Three surfaces, five positionings, conflicting stats | DL-P01 positioning | Consolidate |
| Proof | 32-logo wall, Lorem testimonials, stock ISO-style claims absent but badges in the workspace | 6 verified partners, 3 verified awards, no ISO evidence | Prune + verify |
| Imagery | Stock, watermark, AI-generated product media (DL-A03) | 2023–24 event photos (rights pending); no product or hardware photography | Commission capture |
| Arabic | None (yisbir.com none; Nazo demo has full RTL) | Brand specifies Almarai + product Arabic faces | Phase 2 Arabic (DL-L01); RTL-ready now |
| SEO | Default CRA metadata, no sitemap | Plan specifies the Next.js Metadata API, sitemap, robots | Rebuild |

---

## 8. Gaps, prioritised

**P0: blocks launch**
1. Vector master logos: Meerana and all five products (DL-B02, DL-B03).
2. Legal entity name (DL-C01) and HQ unit (DL-C06).
3. Substantiation or removal of **every** published number (§4.4); placeholder testimonials deleted.
4. Partner/client permissions (DL-R02); ISO certificates or no ISO mention (DL-R03).
5. YISBIR positioning sign-off (DL-P01) and face-recognition wording (DL-P07).
6. **Nazo: naming (DL-P08), tier in the portfolio, neutral demo tenant for captures.**
7. Real product UI recordings: Tasree3, Yisbir, Nazo (neutral tenant), Mandoobee confirmation (DL-A01/A02).
8. Security fixes on the live site (DL-T08). This is urgent and does not depend on the redesign.

**P1**
1. Current (2025–26) photography of people, deployments and hardware. All photos on file are 2023–24.
2. One customer story per lead product (none exists publicly).
3. PDPL-compliant privacy notice and cookie-less analytics (DL-T06/T07).
4. Phone number; Instagram handle; leadership consent (DL-C03/C04).
5. Wasel availability and hardware (DL-P02).

**P2**
1. Arabic transcreation plan (DL-L01).
2. A news cadence, or an "In the news" list only.
3. A Nazo sub-brand palette and type, if Nazo becomes a lead product.

---

## 9. Reusable vs rebuild

| Reuse | Rebuild / discard |
|---|---|
| Brand PDF palette, type, lattice geometry → `plan/design-tokens.json` (compiled to Tailwind v4 `@theme` in `ui-system`) | All code: the CRA app, AOS, globe, chatbot, Instagram scraper |
| Product copy from product-owned sources (tasree3.ae, yisbir.com, store listings) after evidence check | Stock and watermarked imagery; AI-generated product videos and covers (DL-A03) |
| Verified partners (6), awards (3) and events (DL-R04) | The 32-logo wall, Lorem testimonials, unverified stats, the legacy service list |
| Official raster logos, at or below native size, until vectors arrive | The CRA meta/SEO setup, the hamburger-only nav, heading structure |
| Selected event photos (`research/photo-curation.md`) after rights clearance | Legal pages (rewrite for website + PDPL) |
| Nazo demo IA and states (for a **reconstructed** UI); Mandoobee store screenshots (DL-A02) | The `/openai-chatbot` dev page; the courses/accelerator flows |
| The Oct 2 plan: IA H1–H11, storyboards, evidence gate, skills | Earlier drafts' devices: metaballs, telemetry, invented chips |

---

## 10. Questions for Meerana (owner in brackets)

1. **Nazo [leadership]:** is it a fifth lead product or "also from Meerana"? Which name and casing? Can we have a neutral demo tenant for screen capture?
2. **YISBIR [product + legal]:**
   - Approve the "Operational Intelligence / AI video intelligence" positioning.
   - Confirm the brief-only features: Deep Sort tracking, people counting, the mobile app.
   - Decide the face-search wording.
3. **Company facts [leadership]:** legal entity, HQ unit, phone, offices (India?), CEO name spelling.
4. **Proof [marketing]:** certificates for any ISO claim; permission for client logos; award certificates; photo rights.
5. **Assets [product owners]:**
   - vector logos;
   - screen recordings: Tasree3 app, Yisbir demo portal, Nazo, Mandoobee;
   - Wasel hardware photos, if the hardware is Meerana's.
6. **Stack [tech lead]:** approve the reconciliation decisions in `DESIGN-DIRECTIONS.md` §7 (Tailwind v4 + shadcn/ui vs CSS Modules; Lenis/Motion scope).

---

## Appendix A: method, limits and what was deliberately not done

| Area | What happened |
|---|---|
| Workspace | Read the PDF via text + PyMuPDF renders and image extraction. Extracted the zip **to the scratchpad only**. Contact sheets per folder; MD5 duplicate check. |
| meerana.ae | `curl` for HTML, headers and crawl files, bundle and source map. GET of the 14 **read-only** content endpoints the homepage itself calls. Browser rendering with computed-style probes; scroll screenshots. |
| meerana.ae: not done | **No requests to form endpoints**, so stored submissions could not be exposed. No form submissions. |
| yisbir.com / demo.yisbir.com | Rendered in the in-app browser (this shell's DNS could not resolve them; public DNS could). **No login and no CAPTCHA** on the demo portal. |
| Nazo demo | Entered the passwordless demo as a Viewer persona. Read-only navigation and a language toggle. Persona names and tenant data are intentionally not reproduced here. |
| Secrets | The API key was **redacted** (provider + length only). |
| PageSpeed | Could not complete: the UI stalled in a background tab, and the API returned HTTP 429. |
| Personal data | No individuals are named except where the register already does, and those references point to the register. Photo captions follow `research/photo-curation.md`. |

## Appendix B: evidence index

**Workspace:**
- `MEERANA-BRAND IDENTITY-04062026.pdf`
- `research/brand/` (pages, embedded images)
- `research/live-site/` (index.html, bundle, API snapshot, recovered sources)
- `research/sources/*.md`
- `plan/03-evidence-register.csv`
- `plan/05-conflict-decision-log.md`
- `research/photo-curation.md`
- `research/recovered/dark-draft-v2/images/img11.png` (Nazo logo)

**Live:**
- https://meerana.ae/ · /yisbir · /wasel · /mandobee · /asset-tracking · /openai-chatbot · `/static/js/main.5717dfa4.js(.map)` · `/asset-manifest.json`
- https://api.meerana.ae/allDataInfo/{14 read endpoints}.php
- https://yisbir.com/ · https://demo.yisbir.com/ (landing only)
- https://array-yo2.taild8e203.ts.net/admin → /inbox, /tracking, /archive (2026-10-04)

**Standards:**
- help.iso.org/en/articles/375997-can-i-use-the-iso-logo
- react.dev/blog/2025/02/14/sunsetting-create-react-app
- WCAG 2.2 (w3.org/TR/WCAG22)
- web.dev/articles/vitals
