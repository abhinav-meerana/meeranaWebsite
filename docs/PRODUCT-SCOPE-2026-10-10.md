# Product scope v2: six products (2026-10-10)

**Why this exists.** The owner's decisions of 2026-10-10 change the portfolio:
- Nazo, Tasree3, Agentic AI / AI in a Box and Yisbir are confirmed in scope [EV-536].
- Wasel is available and runs on Meerana's own controller [EV-530].
- Three product documentation packs were supplied (NAZO, TASREE3, Agentic AI).

This document updates `plan/04` (dossiers), `plan/06` (sitemap and homepage) and `plan/07` (storyboards) **without editing `plan/`**, per the workspace write-scope rule. Merge it into `plan/` only on approval.

**Evidence:** `plan/03-evidence-register.csv` + `docs/evidence-addendum-2026-10-10.csv` (EV-530–574) + `docs/DEMO-MEDIA-PLAN.md` (EV-520–525, proposed).

---

## 1. Portfolio at a glance

| # | Product | Status (2026-10-10) | Evidence strength | Real UI available | Public name |
|---|---|---|---|---|---|
| 1 | **Tasree3** | Active; flagship | ★★★★★ product site, live SaaS, **11 production screenshots** (EV-550) | **Yes**: recapture without IP call-outs | Tasree3 |
| 2 | **Yisbir** | Active; two pillars (indexing + live analytics) | ★★★★ product site, demo portal, demo film, owner scope (EV-533) | Demo film (needs a YISBIR rebrand and cleared media, B2/B3) | YISBIR / Yisbir |
| 3 | **Nazo** | Active; deployed nazo-api v0.2.0, **verified 2026-10-08** (EV-541) | ★★★★ IP documentation with a VERIFIED tier, demo film | Demo film (neutral tenant needed, B1); screenshot plan (EV-548) | **DV-03 open**: NAZO · "U Sign" · "NAZO AI" |
| 4 | **Mandoobee** | Active apps (Jul 2026) | ★★★ store listings, web app | Store screenshots, `smart-office-app.png` | Mandoobee |
| 5 | **AI in a Box** (Agentic AI) | Working demo (EV-520); platform spec is **planned** (EV-570) | ★★ demo film + spec; sovereignty claim unresolved (EV-571) | Demo stills and loops (clean beats) | **DV-01 open**: AI in a Box · Meerana OS · other |
| 6 | **Wasel** | **Available; Meerana's own controller** (owner, EV-530) | ★★ product page, brand sub-brand, owner confirmation | **None yet**: request app screens and controller photos | Wasel |

**Excluded (unchanged):** Smart/Asset Tracking, legacy offerings, Remootio (DL-P05, EV-431).

---

## 2. Dossiers for the new and changed products

### 2.1 Nazo (new in scope)

| Field | Content |
|---|---|
| **Name** | Running text "Nazo"; wordmark "NAZO"; the documentation also uses the identity **"U Sign — Correspondence, reimagined"** [EV-540]. Decide one public form (DV-03). |
| **Descriptor** | Correspondence & document workflow [EV-540] |
| **Positioning (proposed)** | "Nazo takes official correspondence from first draft to sealed, verifiable letter — in English and Arabic, with AI that drafts and checks while people decide." [EV-542–546] |
| **Business problem** | Official letters pass through several reviewers and signatories. Drafting is repetitive, status is opaque, and recipients cannot easily tell whether a document is genuine. [EV-543, EV-544] |
| **Users / buyer** | Requesters, reviewers, approvers, authorised signatories, administrators (roles observed: admin, requester, department manager, director, general manager) [EV-541]. **Buyers:** government entities and enterprises with formal correspondence (personal comments in the documentation; framing). |
| **Main workflow** | Draft from a bilingual template → reference allocated (registered) → review → approval → signature → SHA-256 seal → QR verification / archive. Reject, revise, redirect and skip are supported. [EV-543] |
| **Verified capabilities** | 14 role-scoped AI actions [EV-542]; bilingual EN/AR templates with twins and typed fields, versioned workflows, signature placement [EV-545]; tamper-evident sealing and QR verification [EV-544]; schema-checked AI output [EV-546]; vault with versions and signer lists; activity audit log [EV-541, EV-544] |
| **Deployment** | One host: application, database, vector store, **self-hosted AI model (vLLM)** and PDF renderer [EV-541]. Public wording (use-with-edit): "Nazo's AI model runs on the same servers as the application." |
| **Interfaces** | Demo film exists (DEMO-MEDIA-PLAN §2): AI template generator, templates, AI summary, suggested comments, EN↔AR. **Blocked:** real-ministry identity in the demo data (B1, EV-547). Clean screenshots are planned (EV-548). |
| **Palette** | Meerana master layer until a Nazo sub-brand exists (DD-07) |
| **Unresolved** | Public name (DV-03) · neutral demo tenant (DV-04) · relationship with "Neonax" (it is the demo tenant *and* on the live logo wall) · legal wording for e-signature validity (say "tamper-evident", not "legally binding", until reviewed) |

### 2.2 AI in a Box (Agentic AI) (new in scope)

| Field | Content |
|---|---|
| **Name** | Working name **"AI in a Box (Agentic AI)"**. The spec calls it "Enterprise Agentic AI Platform"; the demo UI shows "AI in a Box", "Meerana OS v2.7.4" and the assistant "Aria" [EV-574]. Other vendors use "AI in a Box" (EV-160). → **DV-01** |
| **Descriptor (proposed)** | Agentic AI for every employee |
| **Positioning (proposed)** | "AI in a Box gives every employee an AI agent that reads, drafts, schedules and reports — and asks before it acts." Built from EV-520 (demo) + EV-573 (approval-gated design). |
| **Business problem** | Knowledge work is buried in email, calendars, contracts and reports. Generic chatbots can't act, and agents that act without control are a governance risk. |
| **Users / buyer** | Executives and staff (a personal agent per employee); administrators; risk and compliance owners. **Buyer:** CIO/CDO of enterprises and government entities. |
| **What the demo shows** (EV-520) | Executive assistant home and briefing; scheduling with conflict resolution; **contract review with clause flags and fixes**; drafting formal letters; proactive approvals; report → PDF; voice commands; an agent matrix (five agents); a governance screen; integrations; EN / DE / AR with RTL. |
| **What the spec plans** (EV-572; *planned, not confirmed shipped*) | Per-employee agents; M365 mail and calendar; tasks; approval controls with exact-payload approval; memory with source references; knowledge with citations; audit and decision traceability (P0); collaboration, meetings and document generation (P1); voice, correspondence/EPC integration (P2) |
| **Distinctive value (honest)** | **Governance-first agents.** Consequential actions are approval-gated, every decision has a record of its evidence, and there is a user-facing trace from trigger to result [EV-573]. Publish it once the product owner confirms it is implemented in the shipping product. |
| **Deployment: CONFLICT** | The CEO's announcement says "runs entirely inside your organization… No public cloud" [EV-460]. The POC spec says Oracle Cloud, three VMs, **external inference API, "No local LLM hosting"** [EV-571]. **No sovereignty or on-premises claim for this product until resolved** (DL-P13 below). |
| **Interfaces** | Demo stills and loops (contract review 13.5 s; languages 13 s) in `docs/demo-media/`. Blocked beats: "Ministry of Finance" data (B5); a localhost URL and "National AI Policy" content (B12); third-party integrations naming (B15, DV-08). |
| **Palette** | Meerana master layer (like Nazo) until a sub-brand exists. **New decision:** DD-16 below. |
| **Unresolved** | Name (DV-01) · local-inference option (DL-P13) · which spec items are shipped · whether the "Aria" persona is public · integrations that may be named (DV-08) |

### 2.3 Tasree3 (updated with the IP documentation)

**New evidence:** EV-550–559.

| Change | Detail |
|---|---|
| **Real UI is now available** | 11 production screenshots (Consulting Demo tenant, release v0.0.0.0.2): sign-in with SSO and EN/AR; ingestion wizard (CSV, JSON, PDF, DOCX; HRMS); process catalogue (EPC, BPMN, VACD, Organization, Mining; Draft → Approved); BPMN editor with **Process Copilot**; governance with **AI summary of changes between versions**; mining canvas with KPIs, **primary bottleneck** and node inspector; **AI Copilot Consultant** + AI Analyst; 14 reports; Conformance Center; workflow history. [EV-551–557] |
| **Demo provenance upgrade** | `UI-tasree3-01…04` move from *illustrative* to **reconstructed from real screens** once clean recaptures (without the red IP call-outs) are supplied and approved (EV-550) |
| **Storyboard alignment** | The `plan/07` §1 walkthrough maps onto real screens: ① ingestion wizard → ② mining map + primary bottleneck → ③ AI Copilot "Generate Insights" → ④ BPMN editor + Process Copilot → ⑤ governance + AI change summary → output: Conformance Analysis Report |
| **Visual language** | The real app is light with **indigo/violet** accents [EV-559]. See **DD-15** below. |
| **Deployment wording** | Production SaaS runs on Azure with Azure OpenAI [EV-558]. Keep "Run it in your own cloud or data centre" (EV-407) only as an *option*; confirm on-premises delivery before using it as a headline. |
| **Sample data in screenshots** | "Power-outage restoration" log and "Employee Onboarding" pool. Neutral and usable once recaptured cleanly. |

### 2.4 Wasel (updated)

| Change | Detail |
|---|---|
| Status | **Available; Meerana's own controller hardware** (owner, EV-530). DL-P02 closed. |
| Page depth | The full `plan/07` §4 storyboard is unblocked. |
| 3D | `scenes/wasel-gate` can proceed. Model the controller **from real photos** (request A6). Until then, use a simplified enclosure without "illustrative hardware" wording, and replace it when photos arrive. |
| Still needed | App screenshots or recording (the app name in stores?), controller photos and spec, supported gate/door types |
| Unchanged | Never show face recognition or Remootio material (EV-106, EV-431) |

### 2.5 Yisbir (expanded)
See `docs/YISBIR-USE-CASES.md`:
- the two pillars;
- 20 detections with tiers;
- the insight layer;
- 17 verticals, led by universities, public safety, retail (product misplacement) and construction;
- the face-recognition toggle policy.

### 2.6 Mandoobee
Unchanged (plan/04 §3).

---

## 3. Storyboards for the two new product pages

Format as `plan/07`. All UI is provenance-labelled; sample data follows DV-04 (fictional organisations only).

### 3.1 Nazo · `/products/nazo` · Meerana master layer (navy · blue · cyan; light document canvas)

**Hero:**
- H1 (≤ 8 words, DD-12): **"The final approval, signed and sealed."** (DESIGN-DIRECTIONS Appendix A)
- Lede: "Nazo takes official correspondence from first draft to a sealed, QR-verifiable letter — in English and Arabic." [EV-543, EV-544, EV-545]
- CTA: "Request a Nazo demo".

| Beat | Visual | Copy (proposed) | Evidence | UI |
|---|---|---|---|---|
| 1 Problem | A letter with four signature boxes, three of them empty; a "Where is it now?" note | **"One letter. Four signatures. A week of chasing."** | framing of EV-543 | — |
| 2 People | Role chips: Requester · Reviewer · Director · Authorised signatory (neutral; no real entities) | "Every official letter passes through people with different responsibilities — and each needs the right information at the right step." | EV-541, EV-545 | — |
| 3 Product | Nazo wordmark (DV-03) on the master layer | "Nazo runs the whole correspondence lifecycle in one place." | EV-543 | — |
| 4 Interface | New correspondence: bilingual template, typed fields, AI action chips | "Start from an approved bilingual template; the fields do the formatting." | EV-545 | UI-nazo-01 (reconstructed from the demo, neutral tenant) |
| 5 Walkthrough | ① AI auto-fill + check errors → ② reference allocated → ③ reviewer gets an AI summary, a missing-information check and "what changed" → ④ director approves; signatory signs at the placed signature box → ⑤ sealed with SHA-256; QR added | ① "Draft faster: AI fills and checks the form — you decide." ② "Registered with a reference the moment it's sent." ③ "Reviewers see a summary, what's missing and what changed." ④ "Approve and sign in order." ⑤ "Sealed on signature: any later change is detectable." | EV-542, EV-543, EV-544, EV-546 | UI-nazo-02…04 |
| 6 Feature moments | AI suggestions are validated against the form before they are applied; EN ↔ AR twin documents; admins generate templates and workflows with AI | "AI that drafts, people who approve." | EV-546, EV-542, EV-545 | — |
| 7 Output | A phone scans the QR → verify page: "Valid · unchanged since sealing · sealed {sample date}" | "Recipients scan the QR to confirm it's genuine and unchanged." | EV-544 | UI-nazo-05 (verify page) |
| 8 Value / CTA | Bilingual · tamper-evident · self-hosted AI model · full audit log | CTA **"Request a Nazo demo"** | EV-541, EV-544 | — |

**Motion:**
- `M-nazo-01`: the signature boxes fill in sequence as the walkthrough scrolls (sticky stage, 5 steps).
- `M-nazo-02`: the seal moment. A hash string types once (≤ 600 ms), then a QR fades in.
- Reduced motion: final state plus step buttons. No 3D (the purpose test fails; a document flow reads better in 2D).

### 3.2 AI in a Box · `/products/{name per DV-01}` · Meerana master layer

**Hero:**
- H1 (proposed, ≤ 8 words): **"An AI agent for every desk."**
- Lede: "It reads, drafts, schedules and reports — and asks before it acts." [EV-520, EV-573*]
- CTA: "Book a briefing".
- \* EV-573 is used only once its implementation is confirmed.

| Beat | Visual | Copy (proposed) | Evidence | UI |
|---|---|---|---|---|
| 1 Problem | Morning inbox: unread mail, overlapping meetings, a contract awaiting review (sample counts) | **"Your morning, before your morning starts."** | framing | — |
| 2 People | Executive · analyst · assistant; an admin with a governance view | "Every employee gets an agent that knows their work — and only their work." | EV-572 (scoped memory; planned) → confirm | — |
| 3 Product | Name moment (DV-01) | — | — | — |
| 4 Interface | Assistant home + briefing (demo still `aibox-01`) | "One place to brief, ask and approve." | EV-520 | UI-aibox-01 (from demo, once the name is decided) |
| 5 Walkthrough | ① Contract review: clauses flagged with suggested fixes (loop `aibox-loop-contract-review`) → ② a scheduling conflict resolved as a **proposal** → ③ a drafted reply waits for approval of the exact text → ④ the report is generated as a PDF → ⑤ the trace: trigger → evidence → proposal → approval → result | ① "Contract review in minutes, every flag explained." ② "It proposes; you confirm." ③ "Nothing leaves your outbox without your approval." ④ "Reports drafted from the sources you're allowed to see." ⑤ "Every action has a record of why." | ① ② ④ EV-520; ③ ⑤ EV-573 (confirm implemented) | UI-aibox-02…05 |
| 6 Feature moments | Voice; EN / AR (DE); five specialised agents | "Speak or type, in Arabic or English." | EV-520 | — |
| 7 Output | An approval card plus its decision record | "Faster work, with a paper trail." | EV-573 (confirm) | — |
| 8 Value / CTA | Governance-first · multilingual · *deployment per DL-P13* | CTA **"Book a briefing"** | — | — |

**Do not publish (until resolved):**
- "No public cloud", "runs entirely inside your organisation" (DL-P13).
- Named third-party integrations (DV-08).
- "Ministry" demo data (B5, B12).

---

## 4. Consequences for the sitemap and homepage (updates `plan/06`)

**Sitemap:**
```
/products
   /products/tasree3        (flagship · story)   ↗ tasree3.ae
   /products/yisbir         (story; two pillars) ↗ yisbir.com (use cases, live analytics, insights, governance)
   /products/nazo           (story)              — name per DV-03
   /products/mandoobee      (story)              ↗ app stores
   /products/{ai-in-a-box}  (story)              — name per DV-01; deployment wording per DL-P13
   /products/wasel          (story)              — now unblocked (EV-530)
```

**Products menu:** six products in two rows of three. Each shows a logo or wordmark, a descriptor and one line.

**Homepage arc (outside-in, ending on the H1 promise).** H1: **"From the front gate to the final approval."** (7 words; DD-12)

| Chapter | Environment | Product | Interface moment |
|---|---|---|---|
| H4 | Perimeter | **Wasel** | App opens the gate; Bluetooth fallback |
| H5 | Cameras & video | **Yisbir** | A search hit → PPE compliance mini-chart (sample) |
| H6 | Workplace | **Mandoobee** | Clock in → the manager's attendance updates |
| H7 | Every desk | **AI in a Box** | Contract clause flagged → fix proposed → awaiting approval |
| H8 | Processes | **Tasree3** | Mined map → primary bottleneck → AI insight |
| H9 | Correspondence | **Nazo** | Signed → sealed → QR verified: "the final approval" |

Then:
- **H10** Deployed on your terms. AI in a Box appears **only after DL-P13**.
- **H11** Services.
- **H12** Proof.
- **H13** Contact.

**Length control:** six chapters at ~1 viewport each (one interface moment only) keeps desktop at ≈ 12 viewports. That is above the plan's ~11 target. Options:
- (a) accept ≈ 12;
- (b) merge Mandoobee and AI in a Box into one "workplace" chapter with two moments;
- (c) show Wasel as a compact strip.

**Recommendation: (a).** Each product has a distinct environment and evidence. Hard-pinned distance stays 0.

**Ecosystem model (H3):** six labelled zones.
- AI in a Box is shown as **its own zone ("every desk")**, *not* as a core powering the others. A "core" image would imply integrations that are only planned (EV-572 P2; DL-P06).

**Vertical slice:** **still Tasree3.** It is now stronger: the slice can use **reconstructed real UI** once clean recaptures arrive.
- Second slice candidate: **Nazo**. Its lifecycle is verified and its demo is strong; it needs the neutral tenant (B1).

---

## 5. New decisions raised by the documents

| ID | Decision | Evidence | Recommendation | Owner |
|---|---|---|---|---|
| **DL-P13** | AI in a Box deployment claim: the announcement says "no public cloud"; the POC spec uses OCI + an external inference API, "No local LLM hosting" | EV-460, EV-571 | Make no sovereignty, on-premises or "no cloud" claim for AI in a Box until Meerana confirms a shipped local-inference configuration. Nazo (self-hosted vLLM, EV-541) and Yisbir (on-prem option, EV-444) can carry the sovereignty story meanwhile. | AI in a Box product owner |
| **DL-P14** | Which AI in a Box spec features are shipped | EV-570, EV-572 | Publish demo-visible features only (EV-520). Mark the rest "on the roadmap", or omit. | Product owner |
| **DD-15** | Tasree3's real app uses indigo/violet; the brand PDF uses ink/orange/sky | EV-559, EV-302 | Product UI **inside device frames** stays faithful to the real app, which is what customers will see. Page chrome, chapter surfaces and the logo use the brand palette. Ask the brand owner whether the app will adopt the brand palette; if yes, recapture later. | Brand owner + Tasree3 PO |
| **DD-16** | AI in a Box visual identity | — | Meerana master layer (as Nazo, DD-07) until a sub-brand exists. No robot or brain imagery (`modern-ai-company`). | Brand owner |
| **DV-11** | Clean recaptures of the Tasree3 screens without IP call-out markings, on the "Consulting Demo" tenant | EV-550 | Request the 8 screens used in the storyboard, at 1440 px or larger | Tasree3 PO |
