# 02 — Research report

**Research date:** 2026-10-02.
**Register:** `03-evidence-register.csv` (182 rows; validator passes).
**Raw extracts:** `research/sources/`.

## 1. Scope and method

| Stream | What was done | Output |
|---|---|---|
| Existing material | Re-inventoried: the brand PDF, the ISO badge images, the event-photo zip (117 files), Dark Draft v2, Figma Make v17 (source recovered from its inline sourcemap), and captures | `research/asset-inventory.csv`, `research/photo-curation.md`, `research/recovered/` |
| Brand PDF verification | PyMuPDF extraction of vector swatch fills, text spans (font, size, colour) and embedded images, including two hidden boards | `.claude/skills/meerana-brand/references/brand-reference.md`, `research/brand/` |
| Live site | Full extraction of the meerana.ae bundle, its **publicly served source map**, all GET content APIs, and HEAD checks of 108 assets; download of the 6 product videos and the 2024 company profile PDF; keyframe audit of the videos | `research/sources/live-site-extract.md`, `company-profile-pdf-text.md`, `research/live-site/` |
| Product research (web) | tasree3.ae (EN/AR) and its app bundle, yisbir.com and its demo portal, app stores (Google Play, Apple lookup API), LinkedIn guest view, certificate transparency, press and directories | `research/sources/products-web-research.md` |
| Company proof (web) | Identity, awards (issuer sources), certification registries, partner directories (SAP, Microsoft, Botminds), company registries (UK Companies House, India MCA via Tofler), events, media | `research/sources/company-web-research.md` |
| Tech verification | Package versions (npm/PyPI), GSAP licence, Next.js static-export limits, R3F/WebGPU status, CSS scroll-timeline support, Core Web Vitals, bot protection, UAE PDPL, fonts | `research/sources/tech-verification.md` |

**Rules followed:**
- No logins, form submissions, CAPTCHA solving or consent acceptance.
- No access to endpoints that may hold personal data.
- Personal contact details encountered were not recorded.

**Not accessible (and therefore not claimed as checked):**

| Category | Sources |
|---|---|
| UAE government portals (TLS reset from this network) | MOHRE, Future 100, Ministry of Economy, WAM. Facts from them rest on press copies and search snippets, and are marked as such. |
| CAPTCHA- or login-gated | IAF CertSearch, UKAS, BSI; Instagram and X; LinkedIn history before about June 2026 |
| Blocked by error, rate limit or bot check | Crunchbase, Zawya, The EastAfrican, Wayback Machine (rate-limited) |
| Logged-in product areas | app.tasree3.ae, demo.yisbir.com, app.meerana.ae, hrms.meerana.ae |
| Exhibitor directories (POST search or expired TLS) | GITEX, Expand North Star |
| Figma | The Figma MCP connector returned resource links this session cannot read. The `plugin:figma` connector is not authorised. The Make source was recovered from the published preview's sourcemap instead. |

## 2. Source quality

| Source | Authority | Recency | Reliability notes |
|---|---|---|---|
| Brand PDF (Jun 2026) | **Visual authority** | Current | Vector values are exact. Contains errors: Yisbir subtitle, off-palette titles, "Tajwal", and two superseded hidden boards. |
| tasree3.ae (Jul 2026), yisbir.com (Jan 2026), app-store listings (Jul 2026) | **Product-owned**: highest for positioning | Current | Some internal contradictions (connector maturity; deployment wording) |
| www.meerana.ae (bundle Sep 2026; CMS data mixed-age) | Company claims | Mixed (news stops Sep 2024) | Orphaned product pages; chatbot fallback text is wrong; placeholder content is live |
| Company profile PDF (Jun 2024) | Company claims | Dated | Older portfolio (no Tasree3/Yisbir/Wasel); figures 04+ locations / 30+ workforce |
| Press (DMO, WAM copies, Al Bayan, Al Ittihad, FPT, Security MEA, Intelligent CISO, Entrepreneur ME) | Independent or issuer-adjacent | 2022–2025 | Strongest support for awards and partnerships |
| Registries (Companies House, Tofler/MCA, SAP and Microsoft partner finders, Certipedia) | Authoritative for what they cover | Current | Negative results are meaningful (SAP, Microsoft, ISO) |
| Product videos and cover images on meerana.ae | — | Aug–Sep 2026 | **AI-generated concept media** (Veo/Gemini watermarks, garbled UI text, third-party-looking brand names). **Not evidence of product behaviour.** |
| Dark Draft v2, Figma Make v17 | **Not evidence** | — | Contain invented telemetry, names, awards wording and certifications |

## 3. Key findings

### 3.1 The company

- **Identity:**
  - Founded in Dubai in **2022** (three agreeing sources).
  - Founder & CEO **Matar Almehairi**; the spelling varies across sources.
  - UAE operating name **"Meerana Information Technology"** (ميرانا لتقنية المعلومات); the footer says "Meerana Technologies LLC".
  - The legal form and licensing authority are not public (DL-C01).
- **Footprint:**
  - Dubai HQ: Blue Bay Tower, floor 17. The unit number conflicts: 1704 vs 1706.
  - An active **India** LLP (Chennai).
  - The **UK** company was **dissolved on 25 Nov 2025**.
  - Egypt is a company claim only; there is no evidence for KSA.
  - None of the draft's "5+ / 60+ / 40+ / 50+" figures can be verified.
- **Recognition:** see DL-R01.
  - **Future 100 (2023):** verified.
  - **Emirates Labour Market Award 2023, Workforce Wellbeing:** verified via snippet + press context.
  - **Best small enterprise in the UAE, Doha, Sept 2024:** verified. The draft's "Best SME in the GCC" overstates it.
- **Certifications:** **no public evidence of ISO 27001 or ISO 22301.** The only ISO 27001 in Meerana-related press belongs to CyberHive.
- **Partners:**
  - **Verified:** Software AG (2022), FPT Software (2024 MoU), Commvault (2024 VAP), CyberHive (2025 MoU), Botminds, plus Dubai Chambers as supporter.
  - **Not verified:** SAP (the "Gold Partner" badge is unsupported), Microsoft, other vendors, and **every client logo**.
- **Current strategic voice (2026):** sovereign / locally deployed AI ("building sovereign AI solutions and enterprise platforms, deployed locally and secured by design") and UAE government programmes (Zero Government Bureaucracy; AI in government operations).

### 3.2 The product portfolio

| Product | Reality | Note |
|---|---|---|
| **Tasree3** | Flagship, best documented. A bilingual product site and a live app; three modules (re-engineering, mining, governance); UAE Zero Government Bureaucracy framing; own-cloud or data-centre deployment. | No customers or screenshots public |
| **Yisbir** | Active. Its own site and demo portal. **The core is AI video indexing and search** (people, speech in 50+ languages, on-screen text). Construction safety is a vertical module. | Face recognition is a headline feature: privacy decision needed |
| **Mandoobee** | Active apps (iOS, Android, web), updated Jul 2026. Real screenshots exist. | Public adoption is small (50+ installs), contradicting unrendered "50K users" stats |
| **Wasel** | Described on meerana.ae and in the brand PDF only. No app, no hardware evidence. The live site also hosts copied content from a third-party gate controller (Remootio). | Availability and hardware must be confirmed |
| Others | NAZO (dormant), Smart/Asset Tracking (solution category), AI in a Box (announced), Tamkeen HRMS and Campus 360 (undocumented), a long list of legacy offerings | See DL-P05 |

### 3.3 Positioning conflicts (all logged in 05)

| Conflict | Resolution |
|---|---|
| Yisbir (four positionings) | Video intelligence / operational intelligence |
| Tasree3 ("AI-native" vs "AI-assisted"; governance added) | Product-site wording recommended |
| Mandoobee (smart office vs workplace platform vs PRO automation) | Brand descriptor recommended |
| "Mandoobi" | A 2023 press spelling; the Figma Make sentence is unsupported |
| Service categories (four schemes) | Products vs four service lines |
| Awards (misnamed, overstated) | Verified wording |
| Brand-PDF Yisbir subtitle | A copy error |

### 3.4 Interfaces and media

- **No real product interface is publicly visible except Mandoobee's** (store screenshots and one app mock-up).
- Tasree3's own site uses mock-ups it labels "illustrative". Tasree3 and Yisbir real UIs sit behind logins.
- **All six videos and the product cover images on meerana.ae are AI-generated concept media.** They show invented UI and capabilities, such as face recognition for Wasel.
- **Implication:** the new site must rely on labelled illustrative or reconstructed UI until Meerana supplies recordings, and must not reuse the AI media as product evidence.

### 3.5 The live site (context for the redesign)

**Content:**
- Product pages exist but are unreachable from navigation.
- The site doesn't link to tasree3.ae, yisbir.com or the app stores.
- The chatbot answers with wrong product descriptions.
- Placeholder testimonials and fake "trusted by" names are present.
- Legal pages are mismatched.

**Security, to fix independently (DL-T08):**
- A public source map.
- A hard-coded third-party API key.
- HTTP raw-IP backends.
- A public developer test page.
- Possibly readable form endpoints (not tested).
- A dead Yisbir contact domain.
- tasree3.com is for sale.

### 3.6 Narrative opportunities supported by evidence

1. **"Built in the UAE for a smarter future"** (brand) plus **sovereign deployment** (2026 company stance plus per-product facts). This is the strongest differentiator for government and regulated buyers.
2. **Zero bureaucracy:** Tasree3's explicit alignment with a named UAE programme gives the flagship a concrete public-sector story.
3. **Arabic product names with meaning:** Meerana itself explains Yisbir (probing) and writes Tasree3 as تسريع (acceleration). This is distinctive and authentic; Wasel and Mandoobee still need confirmation.
4. **One company across physical and digital operations:** gates, cameras, workplace, processes. A spatial ecosystem story that 3D can genuinely explain.

## 4. Register summary

**By class:**

| Class | Rows |
|---|---|
| verified-fact | 66 |
| company-claim | 88 |
| unknown | 17 |
| illustrative | 8 |
| interpretation | 2 |
| proposed-copy | 1 |

**By topic and public status:**

| Topic | ok-to-use | use-with-edit | confirm | internal | do-not-use | Total |
|---|---|---|---|---|---|---|
| product: Tasree3 | 14 | 3 | 3 | 4 | 2 | 26 |
| product: Yisbir | 8 | 7 | 0 | 2 | 4 | 21 |
| product: Mandoobee | 8 | 0 | 4 | 5 | 2 | 19 |
| product: Wasel | 4 | 1 | 0 | 2 | 5 | 12 |
| products: other (NAZO, tracking, AI in a Box, other) | 4 | 0 | 8 | 4 | 4 | 20 |
| company / legal / office / figure | 6 | 3 | 17 | 5 | 4 | 35 |
| awards / certifications | 2 | 1 | 0 | 1 | 5 | 9 |
| partners / clients | 6 | 0 | 3 | 0 | 2 | 11 |
| events | 2 | 1 | 5 | 0 | 0 | 8 |
| services | 2 | 3 | 5 | 1 | 0 | 11 |
| brand / assets | 5 | 0 | 1 | 2 | 2 | 10 |

**Reading:**
- Product facts for **Tasree3, Yisbir and Mandoobee** are largely usable now.
- **Company-level facts** (entity, offices, figures) and **proof** need Meerana's confirmation, or were found unsupported.

## 5. Recommendations for ongoing evidence work

1. Meerana assigns one owner per decision in 05. Answers are recorded as `decided` and reflected in the register (OVERRIDES in `research/tools/register_extra_rows.py`).
2. Request the items in 10 §6, prioritising A1, A2, A7 and A12.
3. Re-verify the blocked official sources from a UAE network: MOHRE winners page, Future 100 list, MoE releases.
4. Before launch, re-run `check_register.py`, and re-check product sites for changes (tasree3.ae, yisbir.com and the store listings change often).
