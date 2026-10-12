# 12 — Phased implementation backlog

**Governing skill:** `meerana-frontend` (sequencing, definition of done).

**Tracks:**

| Code | Track |
|---|---|
| **FE** | frontend |
| **3D** | WebGL |
| **DS** | design system and visual design |
| **CT** | content and evidence |
| **BE** | backend (FastAPI) |
| **QA** | quality |
| **M** | Meerana inputs |

**Release tags:**
- **E** = v1 essential
- **V** = v1 visual enhancement (can slip without breaking the story)
- **L** = later

**Sizes** are indicative relative effort for a small team (1 designer, 2 frontend, 1 WebGL/creative developer, part-time backend and QA): S ≈ ≤ 2 days, M ≈ 3–5 days, L ≈ 1–2 weeks.

## Dependency overview

```
Phase 0  Decisions & inputs (M) ──────────────┐  (runs in parallel with everything; gates content)
Phase 1  Foundations (FE/DS/3D/CT/BE) ─────────┤  ← can start immediately after plan approval
                                               ▼
Milestone M1  Vertical slice: Home H1–H3 + H7 (Tasree3) + /products/tasree3  ← review gate
                                               ▼
Phase 2  Breadth: Mandoobee → Yisbir → Wasel*, H8–H11, Services, Company, Products, Contact, Privacy
         + BE contact service (parallel)
                                               ▼
Phase 3  Hardening, content freeze, launch
                                               ▼
Phase 4  Enhancements (Arabic, extra scenes, reconstructions, CMS…)
* Wasel depth depends on DL-P02.
```

---

## Phase 0: Decisions and inputs (start now, in parallel)

| ID | Item | Owner | Blocks | Tag |
|---|---|---|---|---|
| P0-01 | Approve the plan, creative direction (09, DL-B05) and vertical slice (07 §7) | Meerana | Everything | E |
| P0-02 | Decide DL-P01 (Yisbir), DL-P10 (Tasree3), DL-P04 (Mandoobee) descriptors | Product owners | Copy for M1 (P10), Phase 2 | E |
| P0-03 | Answer DL-P02 (Wasel availability and hardware) and DL-P05 (portfolio scope) | Leadership | Wasel page; product list | E |
| P0-04 | Supply logo masters and product logos (A1, A2) | Brand owner | Launch | E |
| P0-05 | Trade-licence entity name (DL-C01, A12), phone (DL-C04), offices (DL-C06) | Legal / admin | Footer, privacy, company page | E |
| P0-06 | Award certificates (A7); partner permissions (A8); photo rights (A9) | Marketing | Proof sections | E |
| P0-07 | Tasree3 app recordings (A3) | Tasree3 PO | Swap illustrative → reconstructed (not blocking) | V |
| P0-08 | Hosting / API region / analytics / bot protection (DL-T01, T04, T05, T07); retention and privacy review (DL-T06) | IT / legal | Launch | E |
| P0-09 | **Fix live-site exposures (DL-T08)**: rotate the API key, remove source maps, check form endpoints, fix `info@yisbir.ai`, remove Remootio content, secure tasree3.com | Meerana IT | — (urgent, separate) | E |

## Phase 1: Foundations (can start immediately after approval)

| ID | Item | Track | Depends on | Size | Tag |
|---|---|---|---|---|---|
| F-01 | Scaffold Next.js 16 App Router, static export, TS 6.0.3 strict, ESLint, Prettier. Pin react 19.3.x, three 0.186.x. | FE | — | S | E |
| F-02 | Token pipeline: `design-tokens.json` → `tokens.css` (primitive/derived/semantic; `data-surface`, `data-product`); a lint rule that bans raw hex | FE/DS | F-01 | M | E |
| F-03 | Fonts via `next/font`: Poppins 400/500/600; Almarai 400/700/800 (`/ar` only); Exo 2 (1 weight, Tasree3 route) | FE | F-01 | S | E |
| F-04 | Content schema (zod) + `evidence-to-ts` (CSV → TS) + `content:check` (production/preview modes) | FE/CT | F-01 | M | E |
| F-05 | Layout shell: skip link, `SiteHeader` + Products disclosure menu, `SiteFooter`, motion-preference toggle | FE/DS | F-02, F-03 | M | E |
| F-06 | Core components: Button, SectionHeader, Picture (sharp pipeline), ProofCard, PartnerGrid, StepList | FE/DS | F-02 | M | E |
| F-07 | `DemoFrame` core: frames, ProvenanceLabel, step controls, `useDemoMachine`, `aria-live` | FE | F-06 | M | E |
| F-08 | Motion foundations: `gsap.ts`, `useChapterTimeline` (matchMedia branches, skip link, refresh after fonts), CSS entrance utility | FE | F-01 | M | E |
| F-09 | `PersistentStage` in the root layout: WebGL2 pre-flight, lazy chunk, `View.Port`, error boundary, context-loss handling, `PerformanceMonitor`; `SceneSlot` with posters | 3D/FE | F-01 | L | E |
| F-10 | Lattice primitive: measure the cell from the vector logo (A1; provisional geometry if absent); instanced mesh; materials per tokens | 3D | F-09 | M | E |
| F-11 | CI: typecheck, lint, `content:check`, Vitest, Playwright (chromium/webkit/mobile), axe, Lighthouse CI budgets, size-limit; preview deploys | FE/QA | F-01 | M | E |
| F-12 | Contact form client: zod schema mirroring the contract (11 §15), Turnstile widget, honeypot, timing, idempotency key, MSW mock covering 202/409/422/429/503 | FE | F-06 | M | E |
| F-13 | FastAPI service skeleton to the contract: pydantic models, Turnstile verification, slowapi + Redis, CORS allowlist, storage, email notify, OpenAPI → contract tests | BE | DL-T04 | L | E |
| F-14 | Evidence register stays current: build script + validator in the repo `/evidence` (moved from plan) | CT | F-04 | S | E |

## Milestone M1: Vertical slice (Tasree3)

**Scope:** homepage H1 (hero), H2 (index), H3 (ecosystem stage with all 4 zones), H7 (Tasree3 chapter); `/products/tasree3` complete. The other chapters are stubbed as static sections.

| ID | Item | Track | Depends on | Blocked by | Size | Tag |
|---|---|---|---|---|---|---|
| S-01 | Ecosystem scene (4 zones, procedural) + 5 posters | 3D | F-09, F-10 | — | L | E |
| S-02 | H1 hero + M-home-01 (lattice assembly; idle-deferred after LCP) | FE/3D | F-05, S-01 | A1 (fallback ok) | M | E |
| S-03 | H2 product index | FE/DS | F-06 | A2 (fallback ok) | S | E |
| S-04 | H3 ecosystem chapter + M-home-03 sticky stage + legend | FE/3D | S-01, F-08 | — | M | E |
| S-05 | Tasree3 demo dataset + state machine (`tasree3Demo`, 5 steps) + UI-tasree3-01..04 (SVG/DOM) | FE/DS | F-07 | DL-P10 (copy only) | L | E |
| S-06 | H7 chapter (zone fly-in → DemoFrame FLIP → exit) | FE/3D | S-04, S-05 | — | M | E |
| S-07 | `/products/tasree3`: 8 beats, M-tasree3-01..03, hero scene (`tasree3-departments`), value/CTA | FE/3D/DS | S-05, S-01 | DL-P10 | L | E |
| S-08 | Mobile mode (step buttons, posters, no sticky) + reduced-motion mode + no-WebGL mode for all slice sections | FE | S-02..S-07 | — | M | E |
| S-09 | Slice QA: Lighthouse/CWV budgets, frame-rate traces (integrated-GPU laptop, mid-tier Android), axe + keyboard + NVDA/VoiceOver pass, visual snapshots | QA | S-08 | — | M | E |
| S-10 | **Review gate with Meerana:** story, motion, performance and mobile. Decide whether to proceed as specified or adjust (e.g. reduce 3D). | All | S-09 | — | — | E |

**M1 exit criteria:**
- Acceptance criteria 13-C1, C2, D1–D5, E1–E2, F1 (slice routes) and G1–G3 (slice routes) pass.
- Meerana approves the direction.

## Phase 2: Breadth (after M1; partly parallel)

| ID | Item | Track | Depends on | Blocked by | Size | Tag |
|---|---|---|---|---|---|---|
| B-01 | Mandoobee: dataset; UI-mandoobee-01..03 (reconstructed); H6; `/products/mandoobee` | FE/DS | M1 | DL-P04; A5 (fallback ok) | L | E |
| B-02 | Yisbir: dataset; UI-yisbir-01..03; H5; `/products/yisbir` (without the module scene) | FE/DS | M1 | **DL-P01, DL-P07** | L | E |
| B-03 | Yisbir construction-module scene (`yisbir-site`) + camera-view renders | 3D | S-01 | DL-P07 | M | V |
| B-04 | Wasel: H4 + `/products/wasel` (story **or** fact page per DL-P02); UI-wasel-01..02 | FE/DS | M1 | **DL-P02** | M–L | E |
| B-05 | Wasel scene (`wasel-gate`) | 3D | S-01 | DL-P02 | M | V |
| B-06 | H8 Deployed on your terms | FE/CT | F-06 | DL-P12 approval | S | E |
| B-07 | H9 Services section + `/services` | FE/CT | F-06 | DL-S01..S03 | M | E |
| B-08 | H10 Proof + `/company` (about, offices, recognition, partners, events, news list) | FE/CT | F-06 | DL-R01, R02, R04; DL-C01..C06; A7–A9 | M | E |
| B-09 | `/products` index (+ NAZO fact page if DL-P05) | FE | F-06 | DL-P05/P08 | S–M | E |
| B-10 | H11 + `/contact` (wired to staging FastAPI) + `/privacy` | FE/BE | F-12, F-13 | DL-T06 | M | E |
| B-11 | SEO: metadata, JSON-LD (verified fields only), sitemap, robots, OG images | FE | pages | DL-C01 | M | E |
| B-12 | Redirect map + outbound links (tasree3.ae, yisbir.com, stores) at the host | FE/IT | DL-T01/T02 | — | S | E |
| B-13 | Analytics (cookieless) events per 11 §16 | FE | DL-T07 | — | S | E |

**Parallelism:**
- B-01, B-02 and B-04 can run in parallel on separate developers once their decisions land.
- B-06 to B-09 can be built by a third developer.
- F-13 and B-10 (backend) run in parallel from Phase 1.

## Phase 3: Hardening and launch

| ID | Item | Track | Tag |
|---|---|---|---|
| H-01 | Content freeze; production `content:check`; Meerana sign-off on every evidence row (13-A1, A2) | CT/M | E |
| H-02 | Full QA matrix (11 §19), fix P1/P2 | QA/FE | E |
| H-03 | Performance pass on all routes; budget sign-off | FE | E |
| H-04 | Security headers, CSP, privacy/consent verification, contact pipeline end-to-end in staging | FE/BE | E |
| H-05 | Launch checklist (13) → go-live → week-1 monitoring | All | E |

## Phase 4: Enhancements (post-launch)

| ID | Item | Depends on | Tag |
|---|---|---|---|
| L-01 | Arabic `/ar` (transcreation; Almarai; RTL QA; product Arabic display faces) | DL-L01 | L |
| L-02 | Swap illustrative Tasree3/Yisbir UIs for reconstructions from recordings | A3, A4 | L |
| L-03 | Bilingual name-meaning moments for all products | DL-P11 | L |
| L-04 | Integration stories (e.g. Mandoobee gate pass ↔ Wasel), if documented | DL-P06 | L |
| L-05 | "Sovereign AI" / AI in a Box section, when a spec exists | DL-P05 | L |
| L-06 | CMS evaluation (if marketing needs self-service edits) | DL-T03 | L |
| L-07 | Case studies (only with named, consenting customers) | Meerana | L |
| L-08 | Real product videos (screen captures with captions) | A3/A4 | L |

---

## What is blocked, what can start, what waits

| | Items |
|---|---|
| **Can start immediately** (after plan approval) | F-01 to F-12, F-14, S-01, S-03, S-05 (state machine and SVG with placeholder copy), F-13 (if DL-T04 is set) |
| **Blocked by evidence or decisions** | Tasree3 final copy (DL-P10) · Yisbir everything (DL-P01, DL-P07) · Wasel depth (DL-P02) · proof sections (DL-R01–R04) · footer/legal (DL-C01, DL-T06) · services wording (DL-S01) |
| **Blocked by assets** (fallbacks exist) | Logos (A1, A2) · real UIs (A3–A6) · award images (A7) · partner logos (A8) · photos (A9) |
| **First release (v1 essential)** | Homepage H1–H11; 3–4 product pages (Wasel per DL-P02); services, company, products, contact, privacy; evidence gate; a11y, reduced-motion and no-WebGL modes; performance budgets; contact pipeline; redirects; SEO |
| **Should wait (later)** | Arabic; Yisbir and Wasel scenes if their decisions lag (V); reconstructions from recordings; name-meaning moments; integration stories; AI in a Box; CMS; news; case studies |

**Indicative timeline** (to validate at M1, not a commitment):
- Foundations + M1: ~4–5 weeks.
- Phase 2: ~4–6 weeks (depends on decision turnaround).
- Phase 3: ~2 weeks.
- v1 lands ~10–13 weeks after approval, provided the Phase 0 inputs arrive by the end of M1.
