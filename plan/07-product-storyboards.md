# 07 — Product storyboards

**Governing skills:** `meerana-narrative` (beats, copy), `meerana-product-ui` (screens, provenance), `meerana-scroll-choreography` + `meerana-webgl-scenes` (motion ids `M-<slug>-NN`; conventions in 08).

**Conventions:**
- All copy is *proposed* and cites the register.
- UI ids (`UI-…`) are specified in 10.
- Every demo shows its provenance label.
- Sample data is non-identifying (10 §5).

## 0. Depth: homepage chapter vs product page

| | Homepage chapter | Product page |
|---|---|---|
| Goal | Recognise the problem; see one interface moment; click through | Understand the workflow end-to-end; judge fit; enquire |
| Beats | Problem → product → 1 interface moment → link | All 8 beats |
| Length | ~1.2 viewports desktop · ~1.8 screens mobile | ~6–8 viewports desktop · ~10–12 screens mobile |
| 3D | The shared ecosystem stage (product zone) | Only where the purpose test passes (reusing the zone asset) |
| Interaction | 2–3 demo steps | 4–5-step walkthrough + feature moments |

**Trade-off:**
- A single interface moment per homepage chapter keeps the homepage at ~11 viewports.
- Visitors aren't pushed through four product tours they didn't choose.
- Depth is one click away, on a page that can afford eight beats.
- The chapter and the page share the same demo component and dataset. The moment seen on the homepage is step 1 of the full walkthrough, so the click is rewarded with continuity rather than repetition.

**Products differ by workflow, not colour:**

| Product | Users (buyer) | Environment | Core verbs | Demo modality | 3D on product page |
|---|---|---|---|---|---|
| **Tasree3** | Process owners, excellence, compliance, approvers (government entities, enterprises) | Departments and their systems' event data | *mine, re-engineer, govern* | Process map, side-by-side models, approval pipeline | Hero only: departments with cross-functional process paths (EV-403) |
| **Yisbir** | Investigators, security/HSE, archive teams (national and large organisations) | Camera networks and video archives, on-prem | *index, search, alert, export* | Video library, search, transcript hits, site camera alert | Construction module only: camera coverage + zone |
| **Mandoobee** | Employees, managers, HR (HR director / COO) | Offices, hybrid and field teams | *clock in, request, approve, sign* | Phone + manager dashboard (reconstructed from real screens) | None (DOM) |
| **Wasel** | Residents, staff, guards, facility managers (communities, FM companies) | Gates, doors, barriers | *open, allow, revoke* | Phone app + admin log; physical gate | Gate + connectivity paths (pending DL-P02) |

---

## 1. Tasree3 — storyboard · `/products/tasree3` · **vertical slice**

**Positioning (proposed):**
> "Tasree3 helps organisations remove bureaucracy by re-engineering, mining and governing their processes on one AI-native platform — deployed in their own cloud or data centre." [EV-400, EV-401, EV-407]

**Brand language:**
- An ink `#001731` intro band and a white analytical canvas.
- **Orange `#FD5D01` marks only problems** (waits, loops, bottlenecks). Sky `#009BFD` marks normal flow.
- Display: Exo 2 (one weight). Body: Poppins.
- Never green or teal.

**Hero:**
- **"Zero bureaucracy. One process solution."** (the product's own line, EV-400).
- Sub-line: "Re-engineer, mine and govern every process on one AI-native platform — designed and developed in the UAE." [EV-401, EV-410]
- Name moment (DL-P11 ✔): **تسريع** — *acceleration*.
- CTAs:
  - "Request a process discovery session" → `/contact?interest=tasree3`
  - "Visit tasree3.ae ↗" (DL-T02)

| Beat | Visual | Copy (proposed) | Evidence | Motion / UI |
|---|---|---|---|---|
| **1 Problem** | Left: the "approved" 6-step flow of a sample *permit request* (clean). Right: the same process as it really runs (loops, waits). Labelled "Sample process — illustrative data". | **"Every process has a version nobody drew."** On paper, six steps. In practice: loops, waits and workarounds. | EV-404 ("audits it against the process you approved"), EV-402 ("hidden variants and rework loops") | M-tasree3-01 |
| **2 People & place** | Department lanes (Intake · Review · Finance · Approval) and role chips (Process Owner · Reviewer · Approver) | "Process owners and approvers need facts about how work really flows across departments — not workshop guesses." | EV-405 (roles), EV-403 (cross-functional) | — |
| **3 Product intro** | Three module tiles on ink: **Re-engineering · Mining · Governance** around "one AI-native core" | "Three modules. One AI-native core." | EV-401 | M-tasree3-02 (tiles assemble from lattice cells) |
| **4 Interface** | `UI-tasree3-01`: the mining view. The discovered map draws as sample event rows stream in. | "Connect your systems. Tasree3 mines how the process actually runs from their event data." | EV-404 | M-tasree3-03 step ① |
| **5 Walkthrough** (sticky, 5 steps) | ① **Mine**: variants appear; line weight = frequency.<br>② **Find**: the wait between *Review* and *Approval* turns orange; a rework loop pulses once.<br>③ **Re-engineer**: Lean moves are applied as chips (*Eliminate* duplicate review · *Parallelize* two checks · *Automate* document validation). The to-be model appears beside the as-is (`UI-tasree3-02`).<br>④ **Ask**: natural-language question "Where do requests wait longest?" → a ranked recommendation card (impact/effort) (`UI-tasree3-03`).<br>⑤ **Govern**: Submit → In Review → Approved → Published; version "v1.3 · immutable"; "Rollback" shown (`UI-tasree3-04`). | ① "See every path the work actually takes."<br>② "Spot where cases wait — and where they loop back."<br>③ "Redesign with proven moves: eliminate, simplify, parallelize, automate, standardize."<br>④ "Ask in plain language. Get recommendations ranked by impact and effort."<br>⑤ "Approve and publish the new process — every version kept, every change traceable." | ① EV-404, EV-402 ② EV-402 ③ EV-403 ④ EV-402 ⑤ EV-405 | M-tasree3-03 (sticky stage; SVG + DOM; state machine `tasree3Demo`) |
| **6 Feature moments** | Compact panel "Built for enterprise process work": APQC L1–L4 benchmarking · BPMN 2.0 / EPC / value chains · co-editing with live presence · Arabic and RTL · SSO (Entra ID, SAML, OIDC) · export to PDF/Excel/PowerPoint | One line each | EV-403, EV-402, EV-123, EV-408 | — |
| **7 Output** | The conformance audit replays the approved model against new event data. The score gauge is labelled *illustrative*. A report cover with export icons. | "Then keep it honest: Tasree3 replays the approved process against reality and reports where they drift." | EV-404 (conformance audit), EV-402 (export) | — |
| **8 Value, proof, CTA** | Three value blocks: **Zero-bureaucracy ready** (UAE origin + programme alignment) · **Your infrastructure** (own cloud or data centre, your LLM endpoint) · **Secure by design** (encryption at rest, RBAC, SIEM logging). CTA band. | "Built in the UAE for the Zero Government Bureaucracy agenda." *(alignment; never "endorsed")* · "Run it in your own cloud or data centre, in the region you choose." · CTA: **"Request a process discovery session"** | EV-410, EV-407, EV-408 | — |

**3D (hero only, `scenes/tasree3-departments`):**
- **Purpose sentence:** *processes cut across departments; the scene shows department blocks (lattice cells) with one process path weaving between them, which is the cross-functional view Tasree3 maps (EV-403).*
- Reuses the homepage ecosystem's zone-4 geometry.
- ≤ 30k triangles.
- Mobile and reduced motion use the poster.

**Excluded on purpose:**
- "70% faster modelling" and the tasree3.ae example metrics (EV-125, EV-412).
- The connector list until confirmed (EV-409).
- "ISO 9001 aligned" (EV-406), to avoid confusion with certification.

**Missing assets and fallbacks:**

| Missing | Fallback |
|---|---|
| Real screens (app.tasree3.ae) | Illustrative SVG UI in the Tasree3 visual language, labelled. Replace with reconstructions when recordings arrive (DL-A01). |
| Colour/vector Tasree3 logo | White raster at native size (DL-B03) |
| Exo 2 licence | None needed (OFL) |

---

## 2. Yisbir — storyboard · `/products/yisbir`

**Descriptor:** Operational intelligence · AI video intelligence (DL-P01).

**Positioning (proposed):**
> "Yisbir indexes video with AI — who appears, what is said in 50+ languages, what text is on screen — so teams can search hours of footage in seconds, on their own infrastructure." [EV-440, EV-442, EV-444]

**Brand language:**
- Abyss `#00132D` surfaces; aqua `#43DAFE` for highlights and detections.
- Yisbir blue `#0045F8` on white sections only.
- Display: Montserrat (one weight).

**Hero:**
- "Turn hours of video into searchable intelligence." (adapts yisbir.com H1, EV-440)
- Name moment (DL-P11 ✔): **يسبر** — *to probe, to examine in depth* (EV-445).
- CTAs:
  - "Request a Yisbir demo" → `/contact?interest=yisbir`
  - "Visit yisbir.com ↗" (after EV-448 is fixed)

| Beat | Visual | Copy (proposed) | Evidence | Motion / UI |
|---|---|---|---|---|
| **1 Problem** | A wall of video tiles (rendered, generic); a counter of unreviewed hours (labelled *illustrative*) | **"Hours of footage. One minute that matters."** Nobody can watch it all, and nobody can search it — until it's indexed. | EV-440 ("turning hours of footage into instantly accessible knowledge") | M-yisbir-01 |
| **2 People & place** | Three role cards: Investigations · Operations & HSE · Records & archives. A "stays on your infrastructure" badge. | "For national and large organisations whose video can't leave their own data centres." | EV-446, EV-443, EV-444 | — |
| **3 Product intro** | One video frame splits into **index layers**: People · Speech · On-screen text · Objects & events | "Yisbir reads every layer of your video: who appears, what's said, what's written, what happens." | EV-442 | M-yisbir-02 (layers separate in 2.5D; DOM transforms) |
| **4 Interface** | `UI-yisbir-01` video library + search bar (illustrative) | "Search video the way you search documents." | EV-442 (search types) | — |
| **5 Walkthrough** (sticky, 5 steps) | ① **Index**: upload/connect → processing bar fills the four layers.<br>② **Phrase search**: query "permit approved" (sample) → transcript hits across 3 recordings with timestamps and "Speaker 1/2" labels.<br>③ **On-screen text**: query "Gate 2" → frames where the sign is visible.<br>④ **Real-time on site** (construction module): a site camera flags a missing vest and a restricted-zone entry → alert card.<br>⑤ **Export & share**: a clip package with access control and secure download. | ① "Upload or connect your sources — Yisbir indexes them automatically."<br>② "Find any phrase, in 50+ languages, with who said it and when."<br>③ "Read the text in the frame — signs, screens, documents."<br>④ "On sites, the same AI watches live: missing helmets or vests, restricted zones, falls."<br>⑤ "Share exactly the clips that matter, with access control." | ① EV-442 workflow ② EV-440, EV-442 ③ EV-442 (document scanning/OCR), EV-136 (metadata: text) ④ EV-133, EV-134 ⑤ EV-442 (Secure Downloads, Access Control) | M-yisbir-03; `UI-yisbir-01..03` |
| **6 Feature moments** | Panel: similarity and semantic (vector) search · scene-change detection · video summarisation · API integration · role-based access. *Person search* appears only per DL-P07. | One line each | EV-442, EV-136 | — |
| **7 Output** | An "Investigation package": 3 clips, transcript excerpts, timeline, export log | "From a question to an evidence-ready package — without replaying the day." *(qualitative)* | EV-442, EV-133 ("Accelerate Incident Investigations") | — |
| **8 Value, proof, CTA** | Three value blocks: **Multimodal search** · **On your infrastructure** ("cloud, on-premise, and hybrid"; "no hardware changes required") · **Ready for sites** (construction HSE and security module) | CTA: **"Request a Yisbir demo"** | EV-440, EV-444, EV-133 | — |

**3D (construction module only, `scenes/yisbir-site`):**
- **Purpose sentence:** *shows how fixed cameras cover a site and how a restricted zone drawn on the ground appears in the camera view.*
- Reuses homepage zone-2 geometry.
- ≤ 60k triangles.
- The camera view is rendered from the same scene, so overlays align and no real people or footage are used.

**Sensitive capabilities:**
- No faces, no gender search and no plates in any demo.
- Face recognition and person clips are listed only per DL-P07.

**Missing assets and fallbacks:**

| Missing | Fallback |
|---|---|
| Real UI (demo.yisbir.com) | Illustrative UI, labelled. Request recordings (DL-A01). |
| Real footage | Rendered scene views |
| Colour logo | White raster |

---

## 3. Mandoobee — storyboard · `/products/mandoobee`

**Descriptor:** Smart Office Application [EV-112].

**Positioning (proposed):**
> "Mandoobee brings attendance, HR requests, tasks, documents, meetings and an AI assistant into one workplace app — on web and mobile." [EV-113, EV-421]

**Brand language:**
- Mist `#F0F4F9` surfaces; royal `#0D3D91` text and bands; azure `#047AFF` accents (large/UI only).
- Display: Kufam (one weight).

**Hero:**
- "Your whole working day, in one app." *(proposed)*
- Store badges (EV-420).
- CTA: "See Mandoobee in a demo" → `/contact?interest=mandoobee`.

| Beat | Visual | Copy (proposed) | Evidence | Motion / UI |
|---|---|---|---|---|
| **1 Problem** | Five app icons, paper forms and sticky notes collapse into one Mandoobee icon | **"Too many tools. Not enough productivity."** (live page heading) | EV-113 page; pain points PRODWEB §2.4 | M-mandoobee-01 |
| **2 People & place** | Three role cards: Employee (phone) · Manager (dashboard) · HR & admin | "Employees act from anywhere. Managers see and approve. HR keeps records that don't live in drawers." | EV-421, EV-422 | — |
| **3 Product intro** | Mandoobee brand panel with logo and store badges | "Mandoobee — iOS, Android and web." | EV-420 | — |
| **4 Interface** | `UI-mandoobee-01` phone home (**reconstructed** from real screenshots) + `UI-mandoobee-02` manager dashboard (reconstructed from "CEO Dashboard") | "One home screen for everything an employee needs." | EV-117, EV-423 | — |
| **5 Walkthrough** (a working day; sample times) | 08:30 **Clock in** — "Clocked in · Office" (location-aware).<br>09:10 **Request leave** — Smart Services.<br>09:12 **Approve** — the manager's queue updates.<br>11:00 **Sign a document** — review → sign → archive.<br>15:00 **Minutes of meeting** — draft → sign MOM → share. | "Swipe to clock in — at the office or remote." · "Requests in two taps." · "Approvals from one queue." · "Review, sign and archive without printing." · "Minutes, signed and shared." | EV-115, EV-421, EV-422 | M-mandoobee-02 (time rail; DOM state swaps) |
| **6 Feature moments** | AI panel: AI document engine · OCR & scan · AI note assistant · AI assistant prompts (sample: "How many leave days do I have left?") | "AI that handles the paperwork around the work." | EV-114, EV-421 | `UI-mandoobee-03` |
| **7 Output** | End-of-day summary: attendance recorded, request approved, document signed, minutes shared | "One day. No paper chase." | EV-116 | — |
| **8 Value, proof, CTA** | Deployment (on-premise, cloud, hybrid) · white-label · bilingual (subject to EV-427) · store badges · CTA | CTA: **"See Mandoobee in a demo"** | EV-116, EV-420 | — |

**3D:** none. The purpose test fails; real app states explain a working day better.

**Excluded:** adoption figures (EV-426, EV-1190), placeholder "trusted by" names, and pricing (EV-425).

**Missing assets and fallbacks:**

| Missing | Fallback |
|---|---|
| Permission to use store screenshots; confirmation they match v1.0.17 | Reconstructions with neutral names, labelled "Interface reconstruction — simplified" (DL-A02) |

---

## 4. Wasel — storyboard · `/products/wasel` · *depth gated by DL-P02*

**Positioning (company):**
> "WASEL is an IoT door and gate management solution that modernizes access control through multi-mode connectivity, real-time monitoring, and secure role-based access." [EV-101]

**Proposed one-liner:**
> "Open gates and doors from your phone — with real-time status, a full audit trail and Bluetooth fallback when the internet is down." [EV-102, EV-103]

**Brand language:**
- Brown `#6B3E26` surfaces; sand text; copper line work; ivory sections.
- Display: Avenir LT Pro only if licensed, otherwise Poppins 600 (DL-B04).

| Beat | Visual | Copy (proposed) | Evidence | Motion / UI |
|---|---|---|---|---|
| **1 Problem** | Dusk; a gate; a phone showing "No connection" | **"The gate is closed. The internet is down."** Access apps that need one connection fail at the worst moment. | EV-103 ("never get locked out during internet downtime") | M-wasel-01 |
| **2 People & place** | A community with several gates; role chips Resident · Staff · Guard · Facility manager | "Communities, villas, offices and multi-gate sites need many people through many gates — with a record of every opening." | EV-101, EV-104 | M-wasel-02 |
| **3 Product intro** | Wasel brand panel ("Powered by meerana") | "Wasel connects a controller at every gate to a mobile app, the cloud and your local network — with Bluetooth as the fallback." | EV-102 | — |
| **4 Interface** | `UI-wasel-01` phone "mobile key" (illustrative) + `UI-wasel-02` admin log (illustrative) | "One app for every gate you're allowed through." | EV-103 | M-wasel-03 |
| **5 Walkthrough** | ① Open via cloud (path lights phone→cloud→controller).<br>② Internet down → local network.<br>③ No network → BLE ring in range → opens.<br>④ Manager reviews the log (who / when / method) and revokes a lost phone's key. | ① "Tap to open — through the cloud." ② "No internet? The local network takes over." ③ "No network at all? Bluetooth opens it from a few metres away." ④ "Every opening on record; revoke access instantly." | EV-103 | M-wasel-04 |
| **6 Feature moments** | Sensors (position, temperature, humidity) · OTA provisioning · encrypted keys · multi-gate management | One line each | EV-103 | — |
| **7 Output** | Gate open; log row highlighted; "Key revoked" | "Opened. Logged. Lost phone locked out." | EV-103 | — |
| **8 Value, CTA** | Benefits; environments; hardware block (only with confirmed facts) | CTA: **"Talk to us about your gates"** | EV-103, EV-104 | — |

**3D (`scenes/wasel-gate`):**
- **Purpose sentence:** *shows the alternative command paths (cloud, local network, Bluetooth range) between phone and gate controller; distance matters for Bluetooth.*
- The controller is a **neutral, labelled-illustrative enclosure** until DL-P02 confirms the hardware.
- ≤ 40k triangles.

**Gate:**
- If Meerana can't confirm availability, the page ships as a shorter "Available on request" fact page without the walkthrough.
- Face recognition (seen only in the AI video) is never shown.

---

## 5. Supporting products (only if confirmed, DL-P05)

**NAZO** — `ProductFactPage`:
- **Hero:** "Correspondence & workflow management" (EV-141).
- **Sections:**
  - *Create:* templates, initiation with AI assistance.
  - *Route & approve:* workflows, e-signatures, signature authority.
  - *Find & keep:* OCR search, document management, vault with audit trail.
- **Use cases:** EV-142.
- **Deployment:** on-premises or cloud.
- **CTA.**
- No badges ("10x", "100% secure" are excluded, EV-143). No demo in v1.

---

## 6. Motion entries per product (conventions in 08)

| id | Purpose | Trigger / range | Pin | Mobile | Reduced motion | Fallback | Perf risk |
|---|---|---|---|---|---|---|---|
| M-tasree3-01 | The approved flow vs the as-is tangle | `top 70% → center` | none | Static pair | Static | — | SVG stroke animation ≤ 300 segments |
| M-tasree3-02 | Module tiles assemble from cells | `top 75% → top 40%` | none | CSS fade | Static | — | — |
| M-tasree3-03 | 5-step walkthrough | 5 × 45vh of text past the sticky stage | sticky stage | Step buttons; no sticky | Step buttons | DOM/SVG only | Re-render only changed SVG groups; precompute layouts |
| M-tasree3-hero | Departments with process path (3D) | Hero; scrub `top top → bottom top` | none | Poster | Poster | Poster | Shares geometry with ecosystem zone 4 |
| M-yisbir-01 | Unreviewed video wall | Hero | none | Poster | Poster | Poster | Single texture atlas |
| M-yisbir-02 | Frame splits into index layers | `top 70% → top 30%` | none | Stacked static layers | Static | — | 4 DOM layers, transform only |
| M-yisbir-03 | 5-step walkthrough | 5 × 45vh | sticky stage | Step buttons | Step buttons | DOM | Thumbnails as AVIF sprites |
| M-yisbir-site | Camera coverage + zone (construction module) | `top 70% → bottom 40%` | sticky | Poster | Poster | Poster | Transparent cones sorted; no overdraw stacking |
| M-mandoobee-01 | Tools collapse into one app | `top 75% → center` | none | CSS on intersection | Static | — | — |
| M-mandoobee-02 | Working-day time rail | 5 × 45vh | sticky (device frames) | Step buttons + swipe | Step buttons | — | Swap state, not whole dashboards |
| M-wasel-01..04 | Problem, place, controller → app, connectivity paths | as before | sticky (04) | Step buttons; posters | Step buttons | 2D SVG path diagram | Instanced path segments |

---

## 7. Vertical slice: **Tasree3**

**Build first (milestone M1):**
- Homepage H1–H3 (hero, product index, the ecosystem stage with all four zones).
- The H7 Tasree3 chapter.
- The full `/products/tasree3` page.

**Why Tasree3:**

1. **Strongest evidence:**
   - A product-owned bilingual site and a live app (EV-400–EV-411).
   - Positioning is clear once DL-P10 is approved.
   - Nothing in its story depends on an unanswered hardware or privacy question.
2. **Meerana's current flagship,** with the most distinctive UAE narrative: Zero Government Bureaucracy, sovereign deployment, Arabic.
3. **It still exercises every risky system:**
   - The shared 3D ecosystem stage and the zone transition (homepage).
   - A sticky-stage scroll walkthrough driving an SVG/DOM state machine.
   - Sub-brand theming (ink/orange, Exo 2).
   - Provenance labelling.
   - Mobile step-button mode, reduced motion, and the WebGL fallback.
   - The performance budget on mid-tier Android.

**Why not the others:**
- **Wasel:** availability and hardware are unconfirmed (DL-P02).
- **Yisbir:** privacy wording is pending (DL-P07).
- **Mandoobee:** lacks 3D, so it would leave the riskiest system untested. It is the natural second slice, because its real screenshots enable the first "reconstructed" demo.

**Slice blockers and mitigations:**

| Blocker | Mitigation |
|---|---|
| DL-P10 approval | Copy is drafted for both descriptor options |
| Vector Tasree3 logo (DL-B03) | Raster fallback |
| Real app recordings (DL-A01) | Ship the slice with labelled illustrative UI; swap later |
