# 05 — Content conflict & decision log

**How to read:** each conflict lists:
- the evidence on each side (`EV-…` → `03-evidence-register.csv`);
- the options;
- my recommendation **with its reasoning**;
- the decision owner;
- what it blocks.

**Status:**
- `open`: needs a decision.
- `recommended`: my proposal, awaiting approval.
- `decided`: record who decided and when.

**Blocks:**
- **L**: launch.
- **S**: the vertical slice (Tasree3, 07 §7).
- **—**: non-blocking.

Nothing here is resolved silently. Where I recommend wording, the evidence supports it; it was not chosen because it sounds best.

**Source hierarchy used for positioning:**
1. The current product-owned property: tasree3.ae, yisbir.com, the app-store listings.
2. The brand PDF (visual authority and sub-brand descriptors).
3. www.meerana.ae: company claims; the bundle was rebuilt Sep 2026, but content is mixed-age.
4. Press.
5. Drafts (never evidence).

---

## A. Products

### DL-P01 — Yisbir positioning *(Blocks: L)* · **recommended**

| Source | Says | EV |
|---|---|---|
| yisbir.com (product site, Jan 2026) | "AI-Powered Video Intelligence" · "Transform Your Video Into Searchable Intelligence" · indexes video with face recognition, transcription in 50+ languages, semantic search; About: "Pioneering AI-Powered Operational Intelligence" | EV-440, EV-441, EV-442 |
| LinkedIn launch (Jun 2026) | "Agentic AI-powered video indexing system… fully on-premise" | EV-443 |
| Brand PDF p1 hexagon (visible) | "YISBIR — OPERATIONAL INTELLIGENCE" | EV-131 |
| Brand PDF p3 card (visible) | "SMART GATE & ACCESS CONTROL SYSTEM" | EV-130 |
| meerana.ae `/yisbir` | "AI-Powered Video Analytics & Indexing", plus a construction module "AI-Powered Construction Site Intelligence Platform" | EV-132, EV-133 |
| meerana.ae chatbot | "AI-powered talent acquisition and smart recruitment matching platform" / "Yisbir (AI HR)" | EV-139 |
| Drafts | "AI Video Indexing & Analytics Platform" / "AI-Powered Construction Site Intelligence" | EV-1390 |

**Analysis:**
- **The page-3 subtitle is a copy error.** It repeats Wasel's subtitle verbatim. A superseded board hidden in the same PDF reads "Operational Intelligence through AI".
- **The chatbot answer is an error.** It is fallback text that contradicts every dated source.
- **The core product is AI video indexing and search.** Every dated product-specific source agrees: the product site, the launch post, the demo portal and the meerana.ae page.
- "Operational intelligence" is the brand descriptor, and the About framing on yisbir.com.
- Construction safety is a documented **vertical module** on meerana.ae, not the identity. Figma Make over-narrowed it.

**Recommendation:**
- **Descriptor:** *Yisbir — Operational Intelligence* (brand).
- **Category line:** "AI video intelligence".
- **One-liner (proposed):** "Yisbir indexes video with AI — who appears, what is said in 50+ languages, what text is on screen — so teams can search hours of footage in seconds, on their own infrastructure." [EV-440, EV-442, EV-444]
- **Story:** lead with search and indexing. The construction and security module is the real-time chapter.

**Also:**
- The brand owner corrects PDF p3 (DL-B01).
- Meerana fixes the chatbot and the dead `info@yisbir.ai` address (DL-T08).

**Owner:** Yisbir product owner + brand owner.

### DL-P02 — Wasel: availability, hardware, and the Remootio content *(Blocks: L for the Wasel page)* · **open**

**Known (company claims):**
- Mobile app, IoT gate controller, cloud, local network, BLE fallback, sensors, OTA provisioning, roles and audit logs (EV-101–EV-103).
- Brand PDF sub-brand and a promo video (Aug 2026).

**Gaps:**
- No Wasel app in either store.
- No hardware model, spec or photo (EV-430).
- The video is AI-generated and shows face recognition that no written source claims (EV-106).
- meerana.ae `/accelerator` shows "Remotioo Smart Gate", which is **Remootio**, a third-party product by Assemblabs Ltd, with its text and image copied (EV-108, EV-431).

**Questions for Meerana:**
1. Is Wasel commercially available today?
2. Is its controller Meerana's own hardware, or a third-party device (Remootio or another)?
3. What app do users install?

**Recommendation:**
- Keep Wasel in the ecosystem (it is one of the brand's four).
- Describe only the documented capabilities.
- Show the controller as a neutral, labelled-illustrative enclosure until real hardware is confirmed.
- Never show face recognition.
- If Wasel is not yet available, label the page "Available on request" or move it to a later release.
- Remove the Remootio content from the live site regardless (DL-T08).

**Owner:** Wasel product owner.

### DL-P03 — "Mandoobi, listed … as Mandoobee" *(Blocks: L)* · **recommended**

**Evidence:**
- "Mandoobee" is the current official name: both app stores (developer "Meerana Information Technology", updated Jul 2026), the web app, the brand PDF and the site (EV-110, EV-420).
- "Mandoobi" appears in 2023 press (the Entrepreneur ME Future 100 profile) (EV-424).
- The specific sentence comes only from Figma Make (EV-111).

**Recommendation:**
- Delete the sentence.
- Use **Mandoobee** everywhere.
- The route is `/products/mandoobee`, with a redirect from `/mandobee`.
- "Mandoobi" can be kept internally as a search alias (for site search or SEO), never as copy.

**Owner:** content lead.

### DL-P04 — Mandoobee descriptor *(Blocks: L)* · **recommended**

| Source | Wording | EV |
|---|---|---|
| Brand PDF; web-app login | "Smart Office Application" | EV-112, EV-422 |
| meerana.ae | "AI-Powered Workplace Platform" / "Smart Office Solution" | EV-113 |
| App stores | "Business Application with features: …" | EV-421 |
| Chatbot | "PRO Automation" | EV-119 |

**Recommendation:**
- **Descriptor:** "Smart Office Application" (brand-approved and in-product).
- **One-liner** (adapted from EV-113/EV-421): "Mandoobee brings attendance, HR requests, tasks, documents, meetings and an AI assistant into one workplace app — on web and mobile."

**Conditions:**
- Say "Arabic and English" only after the mobile apps' Arabic UI is confirmed. The App Store metadata lists English only (EV-427).
- No adoption figures: public data shows 50+ Android installs (EV-426).

**Ask:** whether PRO / government-transaction automation is intended. "Mandoob" is the Gulf term for a company PRO.

**Owner:** Mandoobee product owner.

### DL-P05 — Which products appear, and how deeply *(Blocks: L)* · **recommended**

| Item | Evidence status | Recommended v1 treatment |
|---|---|---|
| **Tasree3** | Best documented: product site (EN/AR), live app, June 2026 launch (EV-400–EV-416) | Lead product; full story page; **vertical slice** |
| **Yisbir** | Product site, demo portal, June 2026 launch (EV-440–EV-449) | Lead product; full story page |
| **Mandoobee** | Store apps (Jul 2026), web app, real screenshots (EV-420–EV-427) | Lead product; full story page |
| **Wasel** | meerana.ae page, brand sub-brand, AI promo video; no app or hardware evidence (EV-430) | Lead product **in the ecosystem and homepage chapter**; product page depth depends on DL-P02 answers |
| NAZO / Nazoo | meerana.ae page + video; dormant subdomain (EV-450) | Fact page only if Meerana confirms it is active; otherwise exclude |
| Smart / Asset Tracking | meerana.ae page (orphaned), no video (EV-455) | Exclude from v1; mention "IoT asset tracking" under bespoke IoT solutions if active |
| AI in a Box | LinkedIn announcement only (EV-160, EV-460) | Exclude as a product. If Meerana wants it, show a short "Sovereign AI" note on the deployment section once a spec exists. |
| Tamkeen HRMS, Campus 360 | Live but undocumented (EV-470, EV-471) | Exclude; ask about their status |
| Hi Legal, Real Estate & E-Commerce, EV Charger, Green Hub, Warehouse Mgmt, AMI, Meet Your Dream, AI Summarizer/Podcast/STT, Mandoobee Bot | Legacy (2023–24 profile; dormant apps) | Exclude |
| VoC Solution using Gen AI | meerana.ae Bespoke Products detail | Services → bespoke development, if active |
| Remootio ("Remotioo") | Third-party (EV-431) | Never present as a Meerana product |

**Reasoning:** depth follows documentation. The brand system defines four sub-brands, and three of them have strong, current, product-owned evidence.

**Owner:** Meerana leadership.

### DL-P06 — Cross-product integrations *(Blocks: —)* · **open**

**Hints:**
- Mandoobee 2024: "Control IoT Smart Pass" (EV-115).
- 2024 Enterprise plan: "IoT Gate Pass" (EV-425).
- Tasree3 lists "Tamkeen HRMS" as a connector (EV-470).

None is publicly documented as a shipping integration.

**Recommendation:**
- Present the ecosystem as **one company, one design language, four operating environments**.
- Add integration stories only when Meerana documents them. Mandoobee ↔ Wasel gate pass would be a strong one.

**Owner:** CTO.

### DL-P07 — Sensitive Yisbir capabilities: face recognition, person and gender search, plates *(Blocks: L for the Yisbir page)* · **open**

**Evidence:** face recognition, face search and person clips are headline features on yisbir.com (EV-440, EV-442). meerana.ae adds gender attribute and plate search (EV-135, EV-136).

**Risk:**
- PDPL: biometric data is sensitive.
- Reputation, especially with public-sector buyers.

**Recommendation:**
- The public demo uses phrase/transcript search, on-screen text, object and PPE detection, zones and time only. People are rendered as non-identifiable figures.
- Face search is mentioned in the feature list only after Meerana and legal agree on wording. Suggested: "Person search for authorised investigations, with role-based access control" [EV-442 Access Control].
- No gender or plate demo.

**Owner:** Yisbir product owner + legal.

### DL-P08 — NAZO vs Nazoo *(Blocks: L only if included)* · **open**
- **Evidence:** EV-140, EV-450.
- **Recommendation:** decide only if NAZO is in scope (DL-P05). If so, use the video/logo name **NAZO**.

### DL-P09 — Smart Tracking vs Asset Tracking; workforce tracking *(Blocks: —)* · **recommended**
- Excluded from v1 (DL-P05).
- "Workforce tracking" is not documented for this product. Staff location is a Mandoobee and Campus 360 feature. Never imply it.

### DL-P10 — Tasree3 descriptor *(Blocks: L, S)* · **recommended**

| Source | Wording | EV |
|---|---|---|
| tasree3.ae (product site, Jul 2026) | "AI-Native Process Management Platform" · "Zero bureaucracy. One process solution." · "the sovereign, agentic, AI-native platform for enterprise process management, model, mine, govern and optimize every process on one intelligent core" | EV-400 |
| Brand PDF (Jun 2026) | "AI ASSISTED PROCESS MINING & PROCESS ENGINEERING"; hexagon "AI PROCESS INTELLIGENCE" | EV-121 |
| meerana.ae | "AI-Assisted Process Mining & Process Engineering" / "AI Process Intelligence" | EV-122 |
| App title | "Tasree3 Process Reengineering" | PRODWEB |

**Conflict:** "AI-native" (product site) vs "AI-assisted" (brand and corporate site). Also, the modules now include **governance**, which is wider than "mining & engineering".

**Recommendation:**
- Lead with the product site's hero, **"Zero bureaucracy. One process solution."**
- Descriptor: **"AI-native process management"**, with "re-engineering · mining · governance".
- Keep "AI Process Intelligence" as the brand-hexagon label in the ecosystem diagram.

**Reasoning:** tasree3.ae is the newest, product-owned, bilingual source, and it describes the shipped app's three modules.

**Ask the brand owner** to update the PDF p3 subtitle to match.

**Owner:** Tasree3 product owner.

### DL-P11 — Arabic name meanings as a narrative device *(Blocks: —)* · **recommended (partial)**

| Name | Meaning | Status |
|---|---|---|
| Yisbir | Meerana's own launch post: the name "derives from 'al-sabr' (probing) to express the depth of monitoring and analysis" (EV-445) | ✔ usable, with that gloss |
| Tasree3 | Written "منصة تسريع (Tasree3)" by Meerana; تسريع = acceleration. Supports "accelerating Business Process Reengineering" (EV-414, EV-415). | ✔ usable |
| Wasel | واصل ("arriving / connected") | My interpretation; confirm |
| Mandoobee | مندوبي ("my representative / my PRO") | My interpretation; confirm |

**Recommendation:**
- Use a small bilingual name moment in each product hero once all four are confirmed.
- Until then, only for Yisbir and Tasree3.

**Owner:** brand owner.

### DL-P12 — "Deployed on your terms": a sovereignty section *(Blocks: —)* · **recommended**

**Evidence:**
- Meerana's own 2026 stance: "building sovereign AI solutions and enterprise platforms, deployed locally and secured by design" (EV-461).
- Product deployment facts:
  - Tasree3: "your own cloud or data centre, in the region you choose" (EV-407).
  - Yisbir: cloud, on-premise or hybrid, "no hardware changes required" (EV-444).
  - Mandoobee: on-premise, cloud or hybrid (EV-116).
  - Wasel: local network and Bluetooth when offline (EV-103).

**Recommendation:**
- Add one homepage section (H8, see 06) presenting these **per product, factually**.
- This replaces Figma Make's invented "Gov-Ready / ISO-Aligned / Sovereign" banner with an evidence-backed version.
- No certifications are implied.

**Owner:** marketing.

---

## B. Services

### DL-S01 — Service categories *(Blocks: L)* · **recommended**

| Source | Categories |
|---|---|
| Live site (EV-030..033) | Consultation · Bespoke Products · Our Unique Products · Managed Services (= Reselling Hardware & Software + Staff Augmentation) |
| Profile 2024 | Digital Consultation & Software Warehouse · Bespoke Products · Managed Services (+ "Outsourcing of AI, Metaverse and IT skills") · Our Unique Products |
| Dark draft | Digital Consulting · Outsourcing Services · Hardware & Software Reselling · Bespoke Solutions |
| Figma Make | Consultation · Bespoke Products · Unique Products · Managed Services |

**Recommendation:** split **Products** (Meerana IP) from **Services**. Services become four lines:

1. **Consulting**: data management, data centre, customer experience, digital transformation, enterprise IT architecture, process re-engineering [EV-030].
2. **Bespoke development**: software and cloud, ERP, RPA, data services, cybersecurity testing, IoT solutions, digital channels [EV-031, pruned per DL-S02].
3. **Technology partnerships & reselling**:
   - Verified: Software AG (PartnerConnect, 2022) [EV-240] and Commvault (Value Added Partner, 2024) [EV-506].
   - Other vendors only after DL-R02.
4. **Staff augmentation**: includes the profile's "outsourcing" wording [EV-032, EV-033].

"Our Unique Products" dissolves into Products or is retired. Don't use "Managed services" as a heading unless Meerana operates managed services (support, monitoring).

**Owner:** leadership.

### DL-S02 — Prune legacy bespoke items *(Blocks: —)* · **recommended**
- Remove "Metaverse, Blockchain and AI" (NFT, crypto) and "E-Commerce" unless they are active.
- **Owner:** leadership.

### DL-S03 — FinTech, Visitor Management, HR Tech with ZingHR, Voice of Customer *(Blocks: —)* · **recommended**
- These appear only in the dark draft (EV-037). There is no ZingHR evidence anywhere (EV-038).
- **Exclude** unless Meerana supplies current material.
- Visitor management would belong under Wasel, if anywhere.

### DL-S04 — Courses, Accelerator, Gallery, Careers *(Blocks: —)* · **recommended**
- Exclude Courses, Accelerator and Gallery.
- Careers: a simple page only if hiring.

---

## C. Company

| ID | Topic | Evidence | Recommendation | Blocks |
|---|---|---|---|---|
| DL-C00 | Content sign-off owner | 65 register rows need Meerana confirmation (46) or wording edits (19); every row used in production needs sign-off | Name one approver per area (company, each product, legal, marketing). Approvals are recorded in the register via OVERRIDES with name and date. | **L** |
| DL-C01 | Legal entity name | "Meerana Information Technology" verified as the UAE operating name (EV-500); footer "Meerana Technologies LLC"; Tasree3 terms name no Meerana entity (EV-416) | Use the trade-licence name in the footer, privacy notice and JSON-LD; supply a licence copy | **L** |
| DL-C02 | "An Emarati Group of Companies" | No parent group found (EV-012) | Drop, or name the group | — |
| DL-C03 | Leadership | Founder & CEO verified; spellings vary (EV-013) | Pick one spelling (most press uses "Matar Almehairi"); add a section only with consent | — |
| DL-C04 | Phone; response commitment | Phone only in the draft (EV-005) | Confirm the number; publish an SLA only if Meerana commits to one | L |
| DL-C05 | Mission wording | 3 variants (EV-011) | Pick one | — |
| DL-C06 | Offices | UAE HQ verified; India LLP active (EV-501); **UK company dissolved Nov 2025** (EV-502); Egypt boilerplate only (EV-503); KSA none; HQ unit 1704 vs 1706 (EV-003) | Publish UAE HQ (+ India, if confirmed); no UK; confirm the unit number | L (company page) |
| DL-C07 | Company figures | 2024 profile: 04+ locations, 30+ workforce; LinkedIn 51–200 band; draft 5+/60+/40+/50+ unsupported (EV-016–EV-018, EV-504) | No stats row unless Meerana confirms dated figures | — |
| DL-C08 | Founding year | 2022, three agreeing sources (EV-020) | ✔ usable: "Founded in Dubai in 2022" | — |

---

## D. Recognition, partners, events

### DL-R01 — Awards *(Blocks: L for the proof section)* · **recommended (evidence resolved)**

| Publish as | Evidence | Status |
|---|---|---|
| "Selected for **Future 100** (2023) — UAE Ministry of Economy & the Government Development and the Future Office" | EV-202 (high) | ok-to-use |
| "**Emirates Labour Market Award** 2023 (MOHRE) — Workforce Wellbeing & Quality of Life" | EV-200 (medium; the official winners page was blocked from this network, snippet + press context) | use-with-edit: confirm with the certificate |
| "**Best small enterprise in the UAE** — honoured at the GCC Labour Ministers Committee ceremony, Doha (September 2024)" | EV-203 (high: Al Bayan, Al Ittihad) | ok-to-use |
| ~~"The Best SME Company in GCC, Qatar 2024"~~ / ~~"Best SME in UAE, MOHRE 2024"~~ | One honour, overstated (EV-204) | Replaced by the row above |
| ~~"Best employee environment Reward for 2023"~~ | Misnamed (EV-204) | Replaced by the ELMA row |

**Owner:** marketing (supply certificate images for the award cards).

### DL-R02 — Partners and clients *(Blocks: L for the partners section)* · **recommended**

**Verified, publishable:**

| Partner | Relationship | EV |
|---|---|---|
| Software AG | PartnerConnect, signed GITEX 2022 | EV-240 |
| FPT Software | Strategic MoU, 2024 | EV-505 |
| Commvault | Value Added Partner, GITEX 2024 | EV-506 |
| CyberHive | MoU, 2025 | EV-507 |
| Botminds | Regional partner | EV-508 |
| Dubai Chambers | "Supported by" | EV-509 |

**Not verified:**
- SAP: **remove the "Gold Partner" badge** (EV-242).
- Microsoft (EV-510), Dell, Cisco, Huawei, Kofax (now Tungsten Automation), Confluent, AgilePoint, SAS, Avaya, Moro Hub, Digital DEWA, DigitalX, ZingHR.
- **Every client logo** (EV-243).

**Recommendation:**
- Show only verified partners, with relationship labels.
- Show client logos only with written permission, under "Selected clients".
- Government entities in particular need explicit approval.

**Owner:** marketing + account owners.

### DL-R03 — ISO certifications *(Blocks: L for any ISO mention)* · **open**
- **Evidence:** no public evidence. Certipedia: none. IAF and UKAS are CAPTCHA-gated and were not run. The only ISO 27001 in Meerana-related press is **CyberHive's** (EV-220, EV-221, EV-507).
- **Recommendation:** make no ISO mention until Meerana supplies, for each standard:
  - the certificate (entity, standard version, scope, certification body + accreditation, number, validity);
  - the certification body's mark-use rules.
- Never use stock badges.
- **Owner:** compliance.

### DL-R04 — Events and captions *(Blocks: L for the events strip)* · **recommended**

| Event | Evidence | Use? |
|---|---|---|
| Dubai International Chamber trade mission, Vietnam (May 2024), which led to the FPT MoU | EV-261, EV-505 (high) | ✔ |
| GITEX Global 2022 (Software AG signing) and 2024 (Commvault partnership) | EV-513 (high) | ✔ |
| Dubai Business Forum – USA, New York (Nov 2025) | EV-512 (high) | ✔ |
| Future 100 ceremony (Dec 2023), Museum of the Future | EV-202 | ✔ (with the award) |
| COMEUP Seoul (Nov 2023, UAE Ministry of Economy stand); VivaTech Paris (May 2024, MoE booth); Lithuania (Aug 2024) | EV-264, EV-262, EV-263 (medium) | Only with Meerana confirmation + photo rights |
| SPIEF 2024 | EV-260 (low: panel unverified; the site's dates are wrong) | Only if Meerana provides the session record; caption "St. Petersburg International Economic Forum, June 2024" without "panel" until proven |
| Dubai Chamber pavilion kiosk (Oct 2024); China; Nord Security | EV-265 (unverified) | Exclude until verified |

**Photos:** rights holders and consent per `research/photo-curation.md`.

**Owner:** marketing.

---

## E. Brand

| ID | Decision | Recommendation | Blocks |
|---|---|---|---|
| DL-B01 | Brand PDF errors | Correct the Yisbir p3 subtitle (→ "Operational Intelligence"); align the Tasree3 subtitle with DL-P10; fix the "Tajwal" label | — |
| DL-B02 | Vector master logos + usage rules | Request SVG/EPS of all lockups, plus clear space, minimum size and misuse rules | **L** |
| DL-B03 | Product logos in colour/mono/vector | Request all four | **L** (S: Tasree3) |
| DL-B04 | Avenir LT Pro webfont licence (Wasel) | Confirm the licence, or approve Poppins SemiBold as the substitute | — |
| DL-B05 | Visual direction | Approve purpose-driven light/dark surfaces (09 §8) and the lattice "architectural model" language | **S** |
| DL-B06 | Off-palette product media | The Yisbir promo uses purple; the Tasree3 concept board uses teal; the live site uses `#072FA5`/Open Sans. The new site follows the PDF palette only. | — |

## F. Assets

| ID | Decision | Recommendation | Blocks |
|---|---|---|---|
| DL-A01 | Real product interfaces | Request screen recordings of app.tasree3.ae (S), demo.yisbir.com, the Mandoobee app and web app, and the Wasel app (if any) | **S** for Tasree3 |
| DL-A02 | Mandoobee real screenshots (store + `smart-office-app.png`) | Approve use and confirm they match v1.0.17. Names in the shots are replaced in reconstructions. | — |
| DL-A03 | AI-generated videos and cover banners | Don't use them on the new site (invented UI, face recognition, third-party-looking brand names) | — |
| DL-A04 | Event photo rights and consent | Confirm per selected image | L (events) |
| DL-A05 | Hardware photography | Wasel controller (if Meerana's) and Yisbir deployments | — |

## G. Language

| ID | Decision | Recommendation | Blocks |
|---|---|---|---|
| DL-L01 | Arabic at launch? | Phase 2, with RTL-ready architecture from day one. Tasree3 already has an Arabic product site to borrow terminology from. | — |
| DL-L02 | Numerals on Arabic pages | Western digits unless Meerana prefers Eastern Arabic | — |
| DL-L03 | Product names in Arabic script | Keep Latin wordmarks (as tasree3.ae/ar does, EV-415); Arabic names appear only in name-meaning moments | — |

## H. Technical

| ID | Decision | Recommendation | Blocks |
|---|---|---|---|
| DL-T01 | Hosting | Static export on a CDN host with PR previews; redirects and headers configured at the host | L |
| DL-T02 | Redirect map + outbound links | 301s for `/mandobee`, `/yisbir`, `/tasree3`, `/nazoo`, `/wasel`, `/asset-tracking`, `/partners`, `/latest-news`, `/career`, `/privacy`, `/construction?id=*`. Link to tasree3.ae, yisbir.com and the app stores (EV-474). | L |
| DL-T03 | CMS | No CMS in v1; revisit later | — |
| DL-T04 | Contact API host/region | FastAPI at `api.meerana.ae/v1` (new path) or a new subdomain, in a UAE region. Note that tasree3 and Mandoobee backends already run in Azure UAE North (PRODWEB analysis). | L |
| DL-T05 | Bot protection | Cloudflare Turnstile | L |
| DL-T06 | Retention + privacy review | Legal sets the retention period and reviews the notice. PDPL Executive Regulations are still pending, so design to the law's principles. | L |
| DL-T07 | Analytics | Cookieless (Plausible or self-hosted Umami) | — |

### DL-T08 — Live-site and property issues to fix now, independent of the redesign · **urgent, separate**

1. A third-party scraping API key is hard-coded in the public bundle. **Rotate it** and move it server-side.
2. The JS and CSS **source maps are publicly served**.
3. **Check that `api.meerana.ae/allDataInfo/*` form endpoints don't return submitted personal data** via GET. Not tested, by design.
4. The chatbot backend runs on plain HTTP via a raw IP, and gives wrong product descriptions ("Yisbir (AI HR)", "Wasel (Logistics)").
5. A public developer page `/openai-chatbot` has an API-key field.
6. Remootio's copyrighted text and image appear under "Remotioo Smart Gate".
7. `info@yisbir.ai` bounces (yisbir.ai doesn't exist).
8. tasree3.com is **for sale**, while the Tasree3 app references tasree3.com subdomains.
9. The staging site `uat1.meerana.ae` is indexed and shows old pricing.
10. Lorem Ipsum testimonials sit in the API.
11. The footer Instagram link is probably wrong.
12. The HQ unit number is inconsistent across listings.

Details: `research/sources/live-site-extract.md` §13, §17, §19; `products-web-research.md` §10; `company-web-research.md` (incidental observations).

## I. Round 3 (2026-10-11): horizontal product stories and the responsive landing

The binding spec is `docs/r2/FINAL-SPEC.md`. The full entries, with what checks each one, are in `docs/DESIGN-DIRECTIONS.md` §7 "Round 3". The D numbers refer to the client questions in FINAL-SPEC §14, where the other open questions (D4–D16) are listed.

| ID | Decision | Resolution | Status | Blocks |
|---|---|---|---|---|
| DD-26a | Product-page scroll length (D1) | Product pages are exempt from the 300vh pin budget. Each scene costs one step, `clamp(480px, 70svh, 720px)`: about 6,240 px for Tasree3 at 1366×657, one wheel notch per scene. The homepage keeps ≤ 300vh. | recommended, built; client approval pending | — |
| DD-26b | Horizontal gate (D2; amends DD-23) | Horizontal stage and gallery from ≥ 1024×520 with a fine pointer and motion allowed (was 1280×760). This covers 1366×768 at 125% scaling. | decided (client, 2026-10-11) | L |
| DD-26c | Reduced motion (D3) | A static horizontal rail, never vertical: no GSAP, instant jumps, every scene complete. | recommended, built; client to confirm their OS setting | — |
| DD-26d | One gate | `MQ.stage` = `MQ.pinned`. Shared height tiers (tight ≤ 620, compact ≤ 760). CSS sticky plus one un-pinned trigger, no GSAP `pin`. Stage mode only after GSAP builds. CSS `@media` values come from the shared set (lint). | decided (design lead) | — |
| DD-26e | The rail | Native snap rail for touch, < 1024 wide, 500–519 tall and reduced motion. No inner vertical scroller, ≥ 44 px controls. It is the no-JS layout. | decided (design lead) | — |
| DD-26f | List view | Automatic only at `max-height: 499px` (landscape phones, 200% zoom) and in print. Otherwise opt-in and stored (`meerana:view`). | decided (design lead) | — |
| DD-26g | Product OG images | `app/products/[slug]/og.png/route.tsx` exports `out/products/<slug>/og.png` (1200×630). The spec's `opengraph-image.tsx` exports an extensionless file that static hosts serve with no image Content-Type, which LinkedIn and Facebook reject. | decided (F) | — |
