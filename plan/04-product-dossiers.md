# 04 — Product dossiers

**Basis:** register rows `EV-…` (see `03-evidence-register.csv`) and raw extracts in `research/sources/`. All web sources were accessed 2026-10-02.

**Wording conventions:**
- "Claims" are Meerana's own statements.
- "Verified" means independently confirmed.
- "Proposed" means my wording, built from the cited evidence and awaiting sign-off.

**Status vocabulary:**

| Status | Meaning |
|---|---|
| **Active standalone product** | A product-owned property plus recent activity |
| **Documented, availability unconfirmed** | Described by Meerana, but no public app, hardware or customer evidence |
| **Solution category** | A capability Meerana delivers, not a branded product |
| **Legacy** | No meaningful activity since 2024 |
| **Insufficiently documented / announced** | Too little to describe responsibly |

## Portfolio at a glance

| Product | Status | Evidence strength | Real UI available | v1 treatment |
|---|---|---|---|---|
| **Tasree3** | Active standalone product (launched Jun 2026) | ★★★★ product site EN/AR, live app, launch posts | Behind login (app.tasree3.ae). The public site uses illustrative mock-ups. | Lead + **vertical slice** |
| **Yisbir** | Active standalone product (site Jan 2026; launch Jun 2026) | ★★★ product site, demo portal, launch post | Behind login (demo.yisbir.com) | Lead |
| **Mandoobee** | Active standalone product (apps updated Jul 2026); low public adoption | ★★★ store listings, web app, real screenshots | **Yes**: store screenshots and `smart-office-app.png` | Lead |
| **Wasel** | Documented, availability unconfirmed | ★★ product page, brand sub-brand, AI promo video | None (no app in stores) | Lead in the ecosystem; page depth per DL-P02 |
| NAZO / Nazoo | Documented, availability unconfirmed | ★★ product page, AI video | None | Fact page if confirmed (DL-P05) |
| Smart / Asset Tracking | Solution category | ★ page only (orphaned) | None | Exclude v1 |
| AI in a Box | Announced concept | ★ LinkedIn posts | None | Exclude v1 |
| Tamkeen HRMS, Campus 360 | Undocumented live apps | ★ | Login shells | Ask Meerana |
| Hi Legal, Real Estate, EV Charger, Green Hub, Warehouse, AMI, Meet Your Dream, AI Summarizer/Podcast/STT | Legacy | ★ | Some store screenshots (Hi Legal) | Exclude |
| "Remotioo Smart Gate" | **Third-party (Remootio, Assemblabs Ltd)** | — | — | Never present as Meerana |

---

## 1. Tasree3

| Field | Content |
|---|---|
| **Canonical name** | **Tasree3** (numeral 3; never "Tasree" or "TASREE3" in running text). Arabic تسريع ("acceleration") is used by Meerana on LinkedIn, but the Arabic product site keeps the Latin name (EV-415). |
| **Positioning (proposed)** | "Tasree3 helps organisations remove bureaucracy by re-engineering, mining and governing their processes on one AI-native platform — deployed in their own cloud or data centre." [EV-400, EV-401, EV-407] |
| **Product's own line** | "Zero bureaucracy. One process solution." [EV-400] |
| **Business problem** | Processes accumulate needless steps, waits and workarounds. The documented "approved" process differs from how work actually runs. Changes are slow to model, approve and govern. [EV-404, EV-410] |
| **Primary users / buyer** | **Users:** process owners and process-excellence, transformation, compliance and finance teams. The demo UI shows the roles "Process Owner, Finance, Compliance" and the governance roles Viewer, Author, Reviewer, Endorser, Approver, Admin [EV-405]. **Buyers:** government entities (UAE Zero Government Bureaucracy alignment, EV-410), enterprises and SMEs [EV-124, PRODWEB §1.4]. |
| **Operating environment** | Departments and their systems: ERP, ITSM and CRM event data. Cloud or the customer's own data centre. [EV-407, EV-409] |
| **Main workflows** | **1. Re-engineer:** model in Value Chains / EPC / BPMN 2.0; APQC L1–L4 benchmarking; Lean redesign moves Eliminate · Simplify · Parallelize · Automate · Standardize [EV-403].<br>**2. Mine:** connect source systems, discover as-is flows, variants and bottlenecks, run a conformance audit against the approved model [EV-404].<br>**3. Govern:** Submit → In Review → Approved → Published, with immutable versions and rollback [EV-405].<br>**Across all three:** AI recommendations ranked by impact and effort, natural-language questions, reports, co-editing [EV-402]. |
| **Verified capabilities** (company claims, product-owned) | EV-400–EV-405, EV-407, EV-408, plus the meerana.ae list EV-123. Independently verified: none (no third-party reviews). |
| **Inputs / outputs / integrations** | **Inputs:** event logs from source systems ("Connect your source systems…") [EV-404]; process models.<br>**Outputs:** process models, conformance scores, recommendations, reports exported to PDF/Excel/PowerPoint [EV-402].<br>**Integrations:** SSO via Entra ID / SAML 2.0 / OIDC [EV-408]; connectors listed for SAP S/4HANA & ECC, Oracle, Dynamics 365, ServiceNow, Salesforce, REST/DB. Maturity is contradictory (EV-409). Bring-your-own LLM, including local endpoints (PRODWEB §1.6). |
| **Interfaces available** | **Real:** app.tasree3.ae, login only (EV-411). **Public:** tasree3.ae CSS/SVG mock-ups explicitly labelled "illustrative". The meerana.ae coded simulator and the AI-generated video are not usable (EV-128, EV-129). → Request screen recordings (DL-A01). |
| **Distinctive value (evidence-based)** | **1.** Re-engineering, mining and governance in one product, where competitors often split them [EV-401; the comparison is interpretation]. **2.** Built in the UAE, explicitly for the Zero Government Bureaucracy agenda [EV-410]. **3.** Sovereign deployment: own cloud/data centre and own LLM endpoint [EV-407, PRODWEB §1.6]. **4.** Arabic product site and RTL support [EV-123, EV-415]. |
| **Deployment** | "Run it in your own cloud or data centre, in the region you choose, under your rules." [EV-407]. Security: encryption at rest, RBAC, SIEM-compatible logging [EV-408]. |
| **Proof** | No named clients, case studies or certifications. Metrics on both sites are illustrative or unsourced (EV-412, EV-125, EV-126). "ISO 9001 aligned" is a product-capability claim, not a certification (EV-406). |
| **Unresolved** | Delivered on-prem deployments? · Production-ready connectors? · Pricing model? · Customers or pilots for a case study? · Contracting entity (Terms name "Tasree3", EV-416) · tasree3.com domain risk (EV-413) · "AI-native" vs "AI-assisted" (DL-P10) |

## 2. Yisbir

| Field | Content |
|---|---|
| **Canonical name** | **Yisbir** in running text; **YISBIR** in the wordmark. Arabic يسبر, from "al-sabr" (probing), per Meerana [EV-445]. |
| **Descriptor** | "Operational Intelligence" (brand) · category "AI video intelligence" [EV-131, EV-440, EV-441] |
| **Positioning (proposed)** | "Yisbir indexes video with AI — who appears, what is said in 50+ languages, what text is on screen — so teams can search hours of footage in seconds and act on what it shows, on their own infrastructure." [EV-440, EV-442, EV-444] |
| **Business problem** | Organisations hold hours of camera and recorded video that nobody can review. Finding a moment, a person, a phrase or a document is manual and slow, and real-time risks are missed. [EV-440, EV-133] |
| **Primary users / buyer** | **Users:** security and investigations teams, operations/HSE teams (construction module), archive/media and records teams. **Buyers:** "national and large organizations", "organizations that prioritize data sovereignty" [EV-446]; construction & infrastructure operators (module) [EV-133]. |
| **Operating environment** | Camera networks and video archives, on-premises, cloud or hybrid; "works with your existing infrastructure, no hardware changes required" [EV-444]. Construction sites, gates, yards (module) [EV-133]. |
| **Main workflows** | **Index & search:** Upload Content → AI Processing → Search & Discover → Export & Share [EV-442]. Search types: phrase/transcript, metadata, similarity, fuzzy & synonym, vector, face (sensitive, DL-P07).<br>**Real-time site module:** detect PPE violations, restricted-zone entry, falls; alert; investigate by attributes, location, time [EV-133–EV-135]. |
| **Verified capabilities** (company claims) | EV-440, EV-442 (product site); EV-132–EV-136 (meerana.ae). Independently verified: none. |
| **Inputs / outputs / integrations** | **Inputs:** video files and camera streams, audio, on-screen documents. **Outputs:** searchable index, transcripts with speaker diarization, person clips, alerts, exports ("Secure Downloads"). **Integrations:** "Seamless API integration" [EV-442]. |
| **Interfaces available** | **Real:** demo.yisbir.com (guest login) [EV-449]; yisbir.com dashboard image. **Not usable:** meerana.ae coded console (invented numbers), AI promo video (EV-138), cover banner "SENTINEL" (EV-305). → Request recordings (DL-A01). |
| **Distinctive value** | **1.** Multimodal indexing (vision + speech in 50+ languages + documents) in one search [EV-440, EV-442]. **2.** Runs fully on-premises "with minimal GPU overhead" [EV-443; yisbir.com also offers cloud/hybrid, EV-444]. **3.** A ready vertical module for construction HSE and site security [EV-133, EV-134]. |
| **Deployment** | Cloud, on-premise, hybrid [EV-444]. The LinkedIn launch emphasises fully on-premise [EV-443]. GPU sizing unknown. |
| **Proof** | No clients or case studies. Accuracy figures are mutually inconsistent and unsourced, so do-not-use (EV-447). |
| **Unresolved** | Face-recognition governance and wording (DL-P07) · GPU/hardware sizing · clients · `info@yisbir.ai` broken (EV-448) · what indexer.yisbir.com is |

## 3. Mandoobee

| Field | Content |
|---|---|
| **Canonical name** | **Mandoobee** (store titles, web app, brand PDF). Not "Mandobee" (old route) or "Mandoobi" (2023 press) [EV-110, EV-424]. |
| **Descriptor** | "Smart Office Application" [EV-112, EV-422] |
| **Positioning (proposed)** | "Mandoobee brings attendance, HR requests, tasks, documents, meetings and an AI assistant into one workplace app — on web and mobile." [EV-113, EV-421] |
| **Business problem** | "Too Many Tools. Not Enough Productivity": switching between apps, delayed approvals, no real-time visibility, repetitive manual tasks, paper-based processes [EV-113 page context, EV-116]. |
| **Primary users / buyer** | **Users:** employees (mobile), managers and executives ("CEO Dashboard"), HR/admin [EV-117, EV-422]. **Buyers:** HR directors / COOs of UAE businesses (2024 positioning "Tailored to the unique needs of UAE businesses", PRODWEB §2.4). |
| **Operating environment** | Offices, hybrid and remote work, field teams. iOS, Android, web. |
| **Main workflows** | Clock in/out with location ("Clocked In From Office / Remote") → leave and service requests → manager approvals → documents (create, review, sign, archive) → meetings and minutes (Sign MOM) → AI assistant / AI notes / OCR [EV-115, EV-421, EV-422]. |
| **Verified capabilities** | EV-114–EV-116, EV-421, EV-422 (company claims + app strings). Store listings are first-party facts [EV-420]. |
| **Inputs / outputs / integrations** | **Inputs:** employee actions, documents (OCR/scan). **Outputs:** attendance records, approvals, signed documents, minutes, payroll reports [EV-421, EV-422]. **Integrations:** "White-labeling, customization, and third-party integrations" claimed [EV-116]; none named. The 2024 plans excluded third-party integration [EV-425]. |
| **Interfaces available** | **Real:** store screenshots (8 Play, 8 iOS from Dec 2024) [EV-423]; `smart-office-app.png` (Nov 2024) [EV-117]; web app (login). → The best real-UI evidence in the portfolio (DL-A02). |
| **Distinctive value** | **1.** One app for HR self-service, work and documents, plus AI document tools [EV-114, EV-421]. **2.** Deployment flexibility: on-premise, cloud or hybrid [EV-116]. **3.** Bilingual (web confirmed; mobile to confirm) [EV-427]. **4.** White-labelling [EV-116]. |
| **Deployment** | On-premise, cloud or hybrid [EV-116]. The backend runs on Azure (UAE North endpoint observed; analysis). |
| **Proof** | None product-specific. Adoption: 50+ Android installs, 2 iOS ratings [EV-426]. Never publish "512+ organisations / 50K users" (EV-1190). |
| **Unresolved** | Arabic in mobile apps? · PRO-automation intent? · relation to Campus 360 and Tamkeen HRMS (EV-470, EV-471) · Wasel "IoT Gate Pass" integration status (EV-425) · current pricing |

## 4. Wasel

| Field | Content |
|---|---|
| **Canonical name** | **Wasel** in running text; **WASEL** in the wordmark; logo lockup "Powered by www.meerana.ae" (brand PDF). |
| **Descriptor** | "Smart Gate & Access Control System" [EV-100] |
| **Positioning (company)** | "WASEL is an IoT door and gate management solution that modernizes access control through multi-mode connectivity, real-time monitoring, and secure role-based access." [EV-101] |
| **Positioning (proposed)** | "Wasel lets residents, staff and guards open gates and doors from their phones — with real-time status, a full audit trail and Bluetooth fallback when the internet is down." [EV-102, EV-103] |
| **Business problem** | Multi-gate sites depend on remotes, cards and guards. Visibility of who opened what is poor, and app-based access fails when connectivity drops [EV-103 framing]. |
| **Primary users / buyer** | **Users:** residents, staff, guards, facility managers. **Buyers:** residential communities, villas and apartments, commercial facilities, multi-gate operators [EV-101, EV-104]. |
| **Operating environment** | Gates, doors, barriers, parking, loading docks, construction perimeters [EV-104]. |
| **Main workflows** | Open/close from the app → status and sensor monitoring → role-based access and user management → audit log review → device provisioning (OTA) → offline BLE access when the network fails [EV-103]. |
| **Verified capabilities** | Company claims only (EV-101–EV-104). **No independent or product-owned evidence beyond meerana.ae and the brand PDF** (EV-430). |
| **Inputs / outputs / integrations** | **Inputs:** app commands, sensors (position, temperature, humidity). **Outputs:** gate actions, alerts, logs. **Integrations:** parking ticketing and toll billing are mentioned as deployments (EV-104), so confirm before use. |
| **Interfaces available** | **None real.** The promo video is AI-generated (EV-106); the cover is AI art (EV-305); the coded mock is illustrative (EV-109). |
| **Distinctive value** | Multi-mode connectivity with offline BLE fallback, so users are never locked out [EV-103]. |
| **Deployment / hardware** | An "Industrial-grade hardware controller unit with plug-and-play connections" is claimed [EV-103]. No model, spec or photo. Possible relationship to the third-party Remootio controller is unknown (EV-108, EV-431). |
| **Proof** | None. |
| **Unresolved** | Commercial availability · app name/stores · controller origin (own vs OEM) · certifications · install base · the meaning of "Powered by www.meerana.ae" · Mandoobee "IoT Gate Pass" link (DL-P02, DL-P06) |

---

## 5. Supporting and excluded items (short dossiers)

| Item | What the evidence says | Status → treatment |
|---|---|---|
| **NAZO / Nazoo** | "Correspondence & Workflow Management System": initiate, track, approve, e-sign and archive official communications; templates; OCR search; vault with audit trail; on-prem or cloud [EV-141, EV-142]. Subdomain dormant; video AI-generated [EV-144, EV-450]. | Documented, availability unconfirmed → fact page only if confirmed (DL-P05, DL-P08) |
| **Smart / Asset Tracking** | "RFID & IoT Powered Asset Tracking System"; GPS, BLE beacons, passive RFID; geofencing; maintenance; CRM/ERP integration [EV-151, EV-153]. The page's stats equal its demo numbers [EV-455]. No workforce tracking. | Solution category → exclude v1 (mention under bespoke IoT if active) |
| **AI in a Box** | "an AI platform that runs entirely inside your organization… Meerana AI in a Box. Sovereignty in Your Hands." (CEO, Jul 2026) [EV-460] | Announced concept → exclude v1; possible note in the deployment section later |
| **Tamkeen HRMS** | "Multi-tenant SaaS HRMS — Hire-to-Retire"; a Tasree3 connector [EV-470] | Undocumented → ask |
| **Campus 360** | Education-sector attendance, location, meetings and tasks app [EV-471] | Undocumented on the site → ask |
| **Hi Legal; Real Estate & E-Commerce; EV Charger; Green Hub; Warehouse Mgmt; AMI; Meet Your Dream; AI Summarizer / Podcast / STT; Mandoobee Bot** | 2023–24 profile and "Our Unique Products"; dormant apps (Hi Legal 10+ installs) [EV-035, EV-170, EV-472] | Legacy → exclude |
| **"Remotioo Smart Gate"** | Copied from Remootio (Assemblabs Ltd, Hungary) [EV-431] | Third-party → never present; remove from the live site |
| **"Meerana Intelligence Layer"** | Not found anywhere [EV-473] | Draft concept → do not use |

## 6. Services and solution categories (dossier)

| Service line | Evidence | Status | Notes |
|---|---|---|---|
| **Consulting** | Data management, data centre, customer experience & happiness, digital transformation, enterprise IT architecture [EV-030]; process re-engineering (profile 2024) | Active (company claim) | Natural bridge to Tasree3 |
| **Bespoke development** | ERP, data services, software development, cloud, RPA, e-commerce, metaverse/blockchain/AI, cybersecurity testing, IoT applications, digital connect, VoC with Gen AI [EV-031] | Active, with legacy items | Prune per DL-S02 |
| **Technology partnerships & reselling** | Reseller list on the site [EV-034]. Verified partners: Software AG [EV-240], Commvault [EV-506], FPT Software MoU [EV-505], CyberHive MoU [EV-507], Botminds [EV-508] | Active | Publish verified relationships only (DL-R02) |
| **Staff augmentation / outsourcing** | "Staff Augmentation" [EV-032]; "Outsourcing of AI, Metaverse and IT skills" (2024) [EV-033] | Active | One line, "Staff augmentation" |
| FinTech (UAE PASS, e-KYC, payments) | Dark draft only [EV-037] | Unknown | Exclude unless documented (DL-S03) |
| Visitor management | Dark draft only; Wasel mentions "visitor passes" | Unknown | Exclude, or fold into Wasel if confirmed |
| HR tech with ZingHR | Dark draft + chatbot line only; no ZingHR evidence [EV-038] | Unverified | Exclude |
| Voice of Customer (Gen AI) | Bespoke Products detail page [EV-031] | Company claim | Under bespoke development, if active |
| Courses, Accelerator | Live but unlinked or legacy [EV-040, EV-041] | — | Exclude (DL-S04) |
