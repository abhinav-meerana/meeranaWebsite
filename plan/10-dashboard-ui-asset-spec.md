# 10 — Dashboard, UI & asset specification

**Governing skill:** `meerana-product-ui`. Charts inside demos follow the general `dataviz` skill. Tokens come from `design-tokens.json`.

## 1. Interface audit: what exists today

| Product | Real interface sources | Status / permission | Not usable (why) |
|---|---|---|---|
| **Tasree3** | app.tasree3.ae: live, login only (EV-411) | Recordings needed from Meerana (DL-A01) | tasree3.ae mock-ups (already labelled illustrative by Meerana; may inspire layout, but are not "real"); meerana.ae coded simulator (invented numbers); `tasree.mp4` (AI-generated); cover "BPM INSIGHTS" (AI art) |
| **Yisbir** | demo.yisbir.com: guest login (EV-449); yisbir.com dashboard image | Recordings or screenshots needed (DL-A01) | meerana.ae console (invented numbers); `yisbir.mp4` (stock/motion graphics, purple palette); cover "SENTINEL" (AI art) |
| **Mandoobee** | **Store screenshots** (8 Play, 8 iOS, Dec 2024) (EV-423); **`smart-office-app.png`** (Nov 2024) (EV-117); web app strings (EV-422) | Meerana-owned; needs approval and a v1.0.17 check (DL-A02) | `mandoobee_video.mp4` (AI-generated) |
| **Wasel** | **None** (no app in stores) (EV-430) | Ask whether an app exists (DL-P02) | `wasel.mp4` (AI-generated; garbled UI, face recognition); cover "OAKWOOD RESERVE" (AI art); meerana.ae coded mock |
| NAZO | None (subdomain dormant) | — | `nazo.mp4` (Veo watermark); mock uses a real bank name |

**Conclusion:**
- Only Mandoobee can be **reconstructed** from real screens today.
- Tasree3 and Yisbir need recordings. Until they arrive, use labelled **illustrative** UI built in each product's visual language, expressing only documented capabilities.
- Wasel UI is illustrative by necessity.

## 2. Provenance register

| UI id | Screen | Product | Provenance (v1) | Source / rationale | Label on screen |
|---|---|---|---|---|---|
| UI-tasree3-01 | Mining view (discovered map) | Tasree3 | illustrative → reconstructed when recordings arrive | EV-404, EV-402 | "Illustrative interface · sample data" |
| UI-tasree3-02 | Re-engineering compare (as-is / to-be + Lean moves) | Tasree3 | illustrative | EV-403 | same |
| UI-tasree3-03 | Ask & recommendations | Tasree3 | illustrative | EV-402 | same |
| UI-tasree3-04 | Governance pipeline & versions | Tasree3 | illustrative | EV-405 | same |
| UI-yisbir-01 | Library + search | Yisbir | illustrative | EV-442 | same |
| UI-yisbir-02 | Result detail: transcript hits & layers | Yisbir | illustrative | EV-440, EV-442 | same |
| UI-yisbir-03 | Site camera alert (module) | Yisbir | illustrative (rendered scene) | EV-133, EV-134 | same |
| UI-mandoobee-01 | Phone home | Mandoobee | **reconstructed** | EV-117, EV-423 | "Interface reconstruction — simplified · sample data" |
| UI-mandoobee-02 | Manager dashboard | Mandoobee | **reconstructed** (from "CEO Dashboard") | EV-117, EV-422 | same |
| UI-mandoobee-03 | AI assistant panel | Mandoobee | illustrative | EV-114, EV-421 | "Illustrative interface · sample data" |
| UI-wasel-01 | Mobile key | Wasel | illustrative | EV-103 | same |
| UI-wasel-02 | Admin log & roles | Wasel | illustrative | EV-103 | same |

The register lives in code as `demos/<product>/provenance.ts`. `content:check` fails if a screen has no provenance or no label component.

## 3. Screen specifications

### UI-tasree3-01 — Mining view

| | |
|---|---|
| **Layout** | Desktop: 960×600 frame. Left rail (48 px icons: Models, Mining, Governance, Reports); top bar (process name "Permit request (sample)", data period, "Sample data" chip). Canvas: a left-to-right process map. Right panel (280 px): variant list, case count, median duration. |
| **Navigation** | The rail is non-functional in the demo except "Mining" (active). Other icons show a tooltip "Explore in the full product". |
| **Widgets / controls** | Map nodes (activities) and edges (transitions; thickness = frequency); variant list (top 3 variants with share %); a "Show waits" toggle |
| **Data entities** | `Case{id}`, `Event{caseId, activity, ts}`, `Activity{name, dept}`, `Edge{from, to, count, medianWait}`, `Variant{path[], share}` |
| **User action** | Scroll (step ①) or "Discover" button: events stream in and the map draws. Then the "Show waits" toggle (step ②). |
| **State changes** | `empty → discovering (rows animate in) → discovered (map + variants) → waitsShown (orange edge + label "median wait 4.2 days · sample")` |
| **Feature demonstrated** | Discover as-is flows from event logs; reveal variants, rework loops and delays [EV-404, EV-402] |
| **Data note** | Synthetic: 6 activities, 3 variants. Numbers are internally consistent (the waits sum to the case duration). Labelled sample. |

### UI-tasree3-02 — Re-engineering compare

| | |
|---|---|
| **Layout** | Split view: "As-is (mined)" left, "To-be (draft)" right. A Lean-move chip bar on top: Eliminate · Simplify · Parallelize · Automate · Standardize. |
| **Controls** | Clicking a chip applies a pre-scripted transformation to the to-be model (Eliminate duplicate review; Parallelize two checks; Automate document validation). Undo. |
| **Data entities** | `Model{id, notation:'BPMN 2.0', version}`, `Change{type: LeanMove, target}` |
| **State changes** | `asIs → move1Applied → move2Applied → move3Applied`. Each shows a delta badge, *steps −1*, as a structural count only. No time savings are invented. |
| **Feature** | Re-engineering with Lean moves; BPMN modelling [EV-403, EV-402] |

### UI-tasree3-03 — Ask & recommendations

| | |
|---|---|
| **Layout** | A chat-style input above a recommendation list (3 cards) |
| **Controls** | A pre-filled question "Where do requests wait longest?" plus a Send button; each card expands to "why" |
| **Data entities** | `Recommendation{title, rationale, impact: 'High'/'Med', effort: 'Low'/'Med'}` |
| **State changes** | `idle → asked → answered (cards rank-ordered by impact/effort)` |
| **Feature** | Natural-language questions; recommendations ranked by impact and effort [EV-402] |
| **Rule** | Impact and effort shown as **qualitative labels**, not percentages |

### UI-tasree3-04 — Governance pipeline & versions

| | |
|---|---|
| **Layout** | A 4-column pipeline (Submit · In Review · Approved · Published); a version history list on the right (v1.0…v1.3) with an "immutable" lock icon and a "Rollback" button |
| **Controls** | Approve / Request changes buttons on the review card (demo only advances); Rollback opens a confirm sheet (no-op) |
| **Data entities** | `Submission{model, author: role, reviewer: role}`, `Version{n, ts, approvedBy: role}` |
| **State changes** | `submitted → inReview → approved → published (v1.3 created)` |
| **Feature** | Approval pipeline, roles, immutable versions, rollback [EV-405] |
| **People** | **Roles only** (Author, Reviewer, Approver). No names. |

### UI-yisbir-01 — Library + search

| | |
|---|---|
| **Layout** | Top search bar with type chips (Phrase · On-screen text · Object · Similar). A grid of 6 video cards (rendered thumbnails, generic titles "Site walkthrough 03 (sample)"). A filter rail (date, source, language). |
| **Controls** | The query input (pre-filled per step), chips, card click |
| **Data entities** | `Video{id, title, duration, source}`, `IndexLayer{type: people/speech/text/objects, status}`, `Hit{videoId, t, type, snippet, speaker?}` |
| **State changes** | `indexing (layers fill) → ready → searched("permit approved") → hits (3)` |
| **Feature** | Indexing workflow; phrase search across 50+ languages [EV-442, EV-440] |
| **Rule** | Thumbnails are rendered 3D frames or abstract stills. No real people, no faces. |

### UI-yisbir-02 — Result detail

| | |
|---|---|
| **Layout** | Player (rendered still + scrub bar with hit markers); transcript pane with highlighted phrase and speaker labels "Speaker 1 / Speaker 2"; a layers sidebar with toggles (Speech · On-screen text · Objects) |
| **Controls** | Clicking a hit marker jumps the transcript; toggling layers shows overlays (text boxes on a sign; object boxes) |
| **State changes** | `hit1 → hit2 → textLayerOn ("Gate 2" detected on sign)` |
| **Feature** | Speaker diarization, transcript search, on-screen text extraction [EV-442, EV-136] |

### UI-yisbir-03 — Site camera alert (construction module)

| | |
|---|---|
| **Layout** | Camera tile (rendered from the 3D site); overlay boxes on stylised figures (PPE status as icons); zone polygon; alert card (camera, zone, time, type) |
| **State changes** | `live → detection (vest missing) → zoneEntry → alertRaised → acknowledged` |
| **Feature** | HSE detections, restricted-zone entry, real-time alerts [EV-133, EV-134] |
| **Rule** | Figures are low-poly and non-identifiable. No face boxes. |

### UI-mandoobee-01 — Phone home (reconstructed)

| | |
|---|---|
| **Layout** | Mirrors the real home screen (EV-117): greeting with a role-based name ("Welcome, Employee"), EN/AR toggle, working-hours bar, "Swipe here to clock in" slider, attendance summary card, inbox tiles (Smart Document · Today Meeting · My Tasks), and a bottom nav (Home · Services · BOT · Chat · Notification) |
| **Controls** | Swipe slider (pointer and keyboard: Enter or Space to complete); tiles |
| **Data entities** | `Employee{role}`, `Attendance{status: in/out, mode: office/remote, ts}`, `InboxItem{type, count}` |
| **State changes** | `clockedOut → clockingIn → clockedIn(office, 08:30 sample)` |
| **Feature** | GPS/location-aware clock in/out; smart services; inbox [EV-115, EV-421, EV-422] |
| **Rule** | Replace the real screenshot's personal names and photo. Keep the layout, labels and colours faithful. |

### UI-mandoobee-02 — Manager dashboard (reconstructed)

| | |
|---|---|
| **Layout** | Desktop web-dashboard frame built from the "CEO Dashboard" phone screen's components: a total-workforce donut (office / remote / not yet), an approvals queue, a team list (role labels only) |
| **State changes** | Donut updates when UI-mandoobee-01 clocks in (`23/40 → 24/40`, sample); the approvals queue gains "Leave request · Employee" and → Approved |
| **Feature** | CEO dashboard, approvals [EV-117, EV-422] |

### UI-mandoobee-03 — AI assistant panel

| | |
|---|---|
| **Layout** | Chat panel with 3 suggestion chips (sample prompts), answer cards, an "AI document engine" action ("Draft a leave letter") |
| **State changes** | `idle → prompt → answer` |
| **Feature** | AI assistant, AI document engine, AI notes [EV-114, EV-421] |
| **Rule** | Answers are generic and sample (e.g. "You have 12 leave days remaining (sample)"). No real policy text. |

### UI-wasel-01 — Mobile key (illustrative)

| | |
|---|---|
| **Layout** | Gate selector (Main entrance · Visitor gate · Parking — generic); a large Open button; status line (Online via Cloud / Local network / Bluetooth); a connectivity indicator with three segments |
| **Controls** | Open; a "Simulate: Internet off" toggle and a "Simulate: Network off" toggle (clearly demo controls) |
| **Data entities** | `Gate{name, state: closed/opening/open}`, `Link{mode: cloud/lan/ble, available}` |
| **State changes** | `closed → opening → open → (autoclose not shown unless confirmed, EV-109)`; mode transitions `cloud → lan → ble` |
| **Feature** | Mobile app control; multi-mode connectivity; BLE fallback [EV-103] |

### UI-wasel-02 — Admin log & roles (illustrative)

| | |
|---|---|
| **Layout** | Table: time (sample) · gate · user role (Resident / Staff / Guard) · method (Cloud / LAN / Bluetooth) · result. A "Revoke key" action on a selected user (role only). |
| **State changes** | `log → rowSelected → keyRevoked` |
| **Feature** | Audit & activity logs; roles; access security [EV-103] |

## 4. Shared demo shell (`DemoFrame`)

- Frames: phone, browser/laptop, CCTV monitor.
- Each has a provenance label (bottom-left, always visible) and an "About this demo" disclosure explaining sample data.
- **Step controls:** Prev / Next + numbered steps (`aria-current`). The scroll timeline and buttons call the same `setStep()`.
- **Live region:** `aria-live="polite"` announces "Step 2 of 5: Find the bottleneck".
- **Sizes:**
  - Desktop frame max 960 px.
  - Tablet scales to 720 px.
  - Mobile uses phone variants or focused crops (≥ 14 px text; no shrunken desktop).

## 5. Synthetic data rules (enforced in review)

1. **Non-identifying.** Use roles ("Employee", "Reviewer", "Guard"), generic places ("Main entrance", "Zone B"), generic processes ("Permit request (sample)").
   - No personal names.
   - No real organisations.
   - No Emirates ID, passport or plate formats.
   - No faces.
2. **Purposeful.** Every number serves the task, e.g. a wait that reveals the bottleneck, or a head-count that changes on clock-in. The following are banned:
   - KPI tiles
   - uptime, latency, SLA
   - "nodes online"
   - growth percentages
   - accuracy percentages
3. **Consistent.** One dataset per product (`content/demo-data/<product>.ts`, zod-validated), shared by the homepage chapter and the product page. Values add up.
4. **Labelled.** The word "sample" appears in the frame. Any time or date is a fictional sample day.
5. **Qualitative where evidence is absent.** Impact and effort use High/Med/Low labels; outputs use structural counts ("steps −1"), never invented percentages.

## 6. Asset requirements & requests

| # | Asset | Needed for | Owner | Priority | Blocks | Interim fallback |
|---|---|---|---|---|---|---|
| A1 | Meerana logo masters (SVG/EPS; horizontal, stacked, symbol) + usage rules | All pages | Brand owner | P1 | Launch (B4) | 1579 px white PNG at ≤ native size |
| A2 | Product logos (colour, mono, vector) for Tasree3, Yisbir, Mandoobee, Wasel | Products | Brand owner | P1 (Tasree3: slice) | Launch | White rasters |
| A3 | Tasree3 app screen recordings (mining, re-engineering, governance), 1440 px wide, sample data, no personal data | Tasree3 demo → reconstructed | Tasree3 PO | P1 | — (slice ships illustrative) | Illustrative UI |
| A4 | Yisbir demo recordings (indexing, phrase search, OCR, site alerts) | Yisbir demo | Yisbir PO | P2 | — | Illustrative UI |
| A5 | Permission + current-version confirmation for Mandoobee store screenshots | Mandoobee demo | Mandoobee PO | P2 | — | Reconstruction from `smart-office-app.png` |
| A6 | Wasel facts: app name/screens, controller photos/specs | Wasel page | Wasel PO | P2 | Wasel page depth | Illustrative + "available on request" |
| A7 | Award certificates or official images (Future 100, ELMA 2023, Doha 2024) | Proof | Marketing | P1 | Proof section | Text-only award cards |
| A8 | Partner logos (official) + permission | Partners strip | Marketing | P2 | Partners section | Text list |
| A9 | Event photos with rights and consent (selection in `research/photo-curation.md`) | Company / proof | Marketing | P3 | Events strip | Text-only event list |
| A10 | Licensed night-Dubai photography (optional hero) | H1 | Marketing | P3 | — | Lattice-only hero |
| A11 | Avenir LT Pro webfont licence (optional) | Wasel display | Brand owner | P3 | — | Poppins SemiBold |
| A12 | Trade licence copy (entity name) | Footer, privacy, JSON-LD | Legal | P1 | Launch | — |

## 7. 3D asset list

| Scene | Content | Source | Budget (desktop / mobile tier) | Posters |
|---|---|---|---|---|
| `lattice` (shared) | Instanced parallelogram cells derived from the logo symbol (exact proportions from vector A1) | Procedural | ≤ 400 instances | — |
| `ecosystem` (home H3–H7) | 4 zones: gate & perimeter; site with crane and 4 camera masts; office building; department blocks with a process path | Procedural massing + 3 simple models (gate arm, crane, mast) | ≤ 120k tris · ≤ 60 draw calls / poster-only on mobile | 1 overview + 4 zone posters |
| `tasree3-departments` (product hero) | Reuses zone 4 | Shared | ≤ 30k tris | 1 |
| `yisbir-site` (module) | Reuses zone 2 + frustum cones + zone polygon; renders camera views for UI-yisbir-03 | Shared | ≤ 60k tris | 2 + camera-view AVIFs |
| `wasel-gate` (if DL-P02 is cleared) | Gate, generic controller enclosure (labelled illustrative), phone, router, cloud glyph, BLE ring | Simple models | ≤ 40k tris | 4 (one per mode) |

**Style:**
- Matte "architectural model" materials.
- At most one emissive accent per scene.
- No HDRI over 512 KB.
- No bloom-heavy post-processing.

**Licensing:** every scene's README records its source and licence.

## 8. Video

- **v1 uses no existing product videos** (DL-A03).
- **Future product videos** must be real screen captures or real footage:
  - ≤ 60 s;
  - muted autoplay only in reduced-motion-off mode, with visible controls;
  - burned-in captions (EN, plus AR in phase 2);
  - no personal data;
  - H.264 + AV1, ≤ 6 MB per clip.
