# Product cards

**Card anatomy:**
- official logo (white raster on the product's dark surface, or a mask colourway per DD-09);
- descriptor (label style);
- one line (≤ 2 sentences);
- three capabilities (mono list);
- deployment fact;
- primary link + outbound link.

The accent is a 2 px top rule (`border-t-2 border-product`). Each card sets `data-product`.

**Logo files** (all raster; vectors requested, DL-B03):
- `research/brand/pdf-images/p3_x58_205x205.png` (Wasel)
- `p3_x144_279x67.png` (Yisbir)
- `p3_x143_644x271.png` (Mandoobee)
- `p3_x57_308x308.png` (Tasree3)
- `research/recovered/dark-draft-v2/images/img11.png` (Nazo, 108×120; confirm it is official)

---

## Wasel · `data-product="wasel"` · status: available; Meerana's own controller (owner, 2026-10-10, EV-530)
| Field | Content |
|---|---|
| Descriptor | Smart gate & access control [EV-100] |
| One line | Open, monitor and manage gates from your phone, with Bluetooth fallback when the internet is down. [EV-100, EV-103] |
| Capabilities | Role-based access · real-time gate status · audit trail [EV-101–103] |
| Deployment | Cloud, local network, or Bluetooth when offline [EV-103]; Meerana's own IoT gate controller [EV-530] (photos pending) |
| Links | `/products/wasel` · "Book a Wasel site assessment" |
| Never | Face recognition (seen only in the AI-generated video, EV-106); Remootio content (EV-431) |

## Yisbir · `data-product="yisbir"` · status: active
| Field | Content |
|---|---|
| Descriptor | Operational intelligence [EV-131] |
| One line | Search hours of video by what is said, what appears on screen and what happens in frame — and turn live camera events into insight. [EV-440, EV-442, EV-533, EV-534] |
| Capabilities | Two pillars plus an insight layer (`docs/YISBIR-USE-CASES.md`): video indexing and search (transcripts in 50+ languages, OCR) · live camera analytics (fire and smoke, PPE, uniform, headcount attendance, zones) · insight dashboards [EV-440, EV-442, EV-133, EV-138, EV-534] |
| Deployment | On-premise, cloud or hybrid; works with existing cameras [EV-443, EV-444] |
| Links | `/products/yisbir` · yisbir.com ↗ (use cases by vertical) |
| Never | Face recognition as a headline or in demos (an optional module, off unless switched on, EV-535); gender or plate overlays (DL-P07); accuracy percentages (EV-447) |

## Mandoobee · `data-product="mandoobee"` · status: active
| Field | Content |
|---|---|
| Descriptor | Smart office application [EV-112] |
| One line | Attendance, requests, tasks, documents and an AI assistant in one workplace app. [EV-113, EV-421] |
| Capabilities | Clock in / out with location · leave and service requests with approvals · documents, meetings and minutes [EV-421, EV-422] |
| Deployment | On-premise, cloud or hybrid [EV-116] |
| Links | `/products/mandoobee` · App Store / Google Play |
| Never | "512+ organisations", "50K+ users" (EV-1190); "Arabic" until mobile is confirmed (DL-P04) |

## Tasree3 · `data-product="tasree3"` · status: active (flagship)
| Field | Content |
|---|---|
| Descriptor | AI-native process management [DL-P10] |
| One line | Zero bureaucracy. One process solution. [EV-400] |
| Capabilities | Re-engineer · mine · govern, on one platform [EV-401–405] |
| Deployment | Your own cloud or data centre, in the region you choose [EV-407] |
| Links | `/products/tasree3` · tasree3.ae ↗ |
| Never | Green or teal colour (`meerana-brand`); "70% faster" (unsourced) |

## Nazo · `data-product="nazo"` · status: active; deployed system verified 2026-10-08 (EV-541); naming DL-P08 / DV-03 (NAZO · "U Sign" · "NAZO AI")
| Field | Content |
|---|---|
| Descriptor | Correspondence & document workflow [EV-540] |
| Lifecycle | Draft → registered → review → approval → signed → SHA-256 sealed → QR-verified archive [EV-543, EV-544] |
| One line | Route, approve, sign and seal official correspondence, in English and Arabic. [EV-141, EV-142; demo observed 2026-10-04] |
| Capabilities | Approval chains with due / overdue tracking · e-signature and a sealed, verifiable archive · AI assistant: summarise, draft a comment, check what's missing (demo) |
| Deployment | On-premises or cloud [EV-142]; its AI model runs on the same servers as the application (self-hosted) [EV-541] |
| Links | `/products/nazo` (after DL-P05/P08) · "Request a Nazo walkthrough" |
| Never | The demo tenant's UAE emblem or "NEONAX" prefix; persona names; "10x faster" / "100% secure & compliant" (live-page claims without evidence) |
| UI to show | Reconstructed tracking table: reference `ORG/REQ/2026/031`, approver chain as **role initials**, status pills, Sealed · Verify; EN ⇄ AR toggle (component-inventory: `ApprovalTrack`, `SealBadge`, `AssistantPanel`) |

## AI in a Box (Agentic AI) · Meerana master layer (DD-16) · status: working demo (EV-520); platform spec planned (EV-570); name DV-01
| Field | Content |
|---|---|
| Descriptor | Agentic AI for every employee *(proposed)* |
| One line | An AI agent for every desk: it reads, drafts, schedules and reports — and asks before it acts. [EV-520; "asks before it acts" = EV-573, publish once confirmed implemented] |
| Capabilities | Contract review with clause flags · scheduling and drafting as proposals · approvals, voice, EN/AR [EV-520] |
| Deployment | **No claim yet.** The "no public cloud" announcement (EV-460) conflicts with the POC spec (OCI, external inference, EV-571). See DL-P13. |
| Links | `/products/{name per DV-01}` · "Book a briefing" |
| Never | Robot or brain imagery; "Ministry" demo data (B5); named integrations before DV-08; spec features presented as shipped (DL-P14) |

## Hi Legal · **legacy: do not publish**
| Field | Content |
|---|---|
| What it was | A legal management application: legal workflows, document management, litigation case tracking, contract management (live chatbot text; 2023–24 profile) |
| Evidence | Dormant app, 10+ installs [EV-472]; absent from the June 2026 brand ecosystem |
| Treatment | Excluded (DL-P05). The brief listed it as a "known product", but the workspace overrides that. Reinstate only on Meerana's instruction, with current material. |
