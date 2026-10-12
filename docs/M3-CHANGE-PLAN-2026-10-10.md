# M3 change plan: after the professional review round (2026-10-10)

**Inputs:**
- Four specialist reviews (visual design, components, 3D/motion, brand/UX/mobile).
- Two benchmarks against 20 top software companies:
  - **Enterprise:** Microsoft, IBM, Oracle, SAP, Salesforce, ServiceNow, Palantir, Snowflake, Databricks, NVIDIA.
  - **Design-led:** Apple, Stripe, Linear, Vercel, OpenAI, Anthropic, Scale, Anduril, G42, Cloudflare.
- One judge pass that checked every P0/P1 claim against the screenshots, the code and the evidence register.

**Full detail** (exact values, file lines, acceptance checks): [`review/m3-2026-10-10/JUDGE-VERDICT.md`](review/m3-2026-10-10/JUDGE-VERDICT.md).
**Raw reviews:** [`review/m3-2026-10-10/reviews/`](review/m3-2026-10-10/reviews/) · **benchmarks:** [`review/m3-2026-10-10/benchmarks/`](review/m3-2026-10-10/benchmarks/).

---

## 1. Where we stand

| | Score /60 |
|---|---|
| M3 today (judged) | **23** |
| Enterprise benchmark (ENT) / design benchmark (DESIGN) scores for M3 | 23 / 29 |
| Median of the 20 benchmark sites | **49.5** |
| M3 after this plan (target) | **46** |
| Linear, Vercel, Apple | 56 |

**Why it reads "like MS Paint":** the ranked root causes, all verified.
1. **No design system.** 9 control heights, 9 radii, 13+ type sizes, boxes nested 3 deep, 8 different pill styles.
2. **Unlit 3D.** Flat face colours, 42 % fog even at the centre, an outline on every cube, one fixed camera. The white cubes outshine the headline.
3. **Layout built on viewport arithmetic.** Columns 182 px wide at 1024 px; cards clipped at 1024×768. The pinned gallery makes the page **8,208 px wide** and holds the reader for **750vh**.
4. **Unchecked labels and media.**
   - Internal codes are visible on the page: "DL-P13", "DV-01", "DV-03", "v4 film".
   - Mandoobee carries contradictory labels.
   - Three compliance problems that every reviewer missed:
     - the Yisbir boards show licence plates, a "Weapon armory" tile and an "Armed trespass" incident;
     - the AI in a Box screens say "Sovereignty in Your Hands", which DL-P13 forbids;
     - a Nazo template shows a government trademark letter.
5. **Labels louder than content.** About 60 uppercase mono strings and 4 position counters for one gallery.
6. **No five-second answer.** No sentence says what Meerana makes, there is no proof, and there are 7 different CTA verbs, all `mailto:`.
7. **Broken pacing.** 16.9 screens long (median 7.4). Each hero moment is readable for only 0.6 s.

**What all 20 top sites do that we don't:**
- one plain claim plus one sentence, two CTAs and real product UI in the hero;
- proof right under the hero;
- one container of about 1,280 px on a 12-column grid;
- 7–8 type sizes;
- one accent colour, used only for interaction;
- 1 px borders instead of stacked boxes;
- sentence-case labels;
- the nav stays visible;
- a full footer;
- 5–10 screens long;
- motion that shows the product and can be paused.

**Where we already beat several of them:** reduced-motion support, a pause control, skip links and honest provenance labels. OpenAI, Anduril, G42 and Scale have missing or broken H1s.

---

## 2. What stays, and what changes

| Your requirement | Benchmark pressure | Resolution |
|---|---|---|
| "Pure 3D page" | Limit 3D to the hero plus one sequence | **Keep one continuous 3D world.** It is the differentiator, and no benchmark has one. Adopt the benchmarks' **discipline**: proper lighting, nothing brighter than light grey, one cyan accent per frame, never behind body text without a solid card. It pauses while the gallery is showing. Formations go from 21 to 12. |
| Horizontal product scrolling with fade | "Cut the pin" (none of the 20 sites pins a sideways gallery) | **Keep it, tighter:** one 250vh pin, down from 750vh, with snap per card. Cards fade 0.35 ↔ 1. Below 1280×760, and under reduced motion, it becomes a native swipe rail. *Decision 1.* |
| Dynamic Island nav | Keep the links visible | On desktop the island **keeps its links at all times** and narrows after the hero. Live activity drops in as a row below the links for ≤ 2 s. The compact pill is used only below 1280 px. |
| "Keep the cards solid; glass only where necessary" | Remove most boxes | Compatible. Solid cards stay for the **6 product cards, the 5 story steps, the lightbox and the menu sheet**. All other boxes go. Glass is used **only** on the island and its sheet. |
| "Don't add more content" | Add a lede, proof, form, FAQ, mega menu | **Net-content rule.** The footer is structural, so it goes in. Lede and proof are *Decisions 4–5*, paid for by cuts. **Rejected:** form (no backend), FAQ, mega menu, trust page, language switch. |
| Mandated copy (H1, moments, layer sequence, UAE line, story, CTA line) | Some reviewers rewrite the H1 | **All kept verbatim.** |

---

## 3. Decisions I need from you (recommended default first)

1. **Gallery pin exception:** allow one 250vh pin, above the 150vh rule but within the 300vh page total. *Default: approve.* Without it the gallery is a swipe rail.
2. **Asset Tracking → Wasel** in the six-product layer. Asset Tracking is excluded in the plan (DL-P05) and has no screens or logo; Wasel is confirmed and is already the IoT moment. *Default: swap*, giving Mandoobee → Tasree3 → Nazo → Yisbir → Wasel → AI in a Box.
3. **"Meerana Intelligence Layer"** as a portfolio heading with the caption "Six products. Each one deploys on its own." The register marks the phrase do-not-use, because it implies integration. *Default: keep it, with the caption.*
4. **A one-line hero lede**, register-checked: "An AI-powered ecosystem of six enterprise products — for AI, automation, IoT and security." It is paid for by removing the coordinates, "Fig. 1", Replay, and the moment numbers and captions. *Default: approve.*
5. **Proof, as text-only placards** in "Built in the UAE", with the wording verified in the register:
   - "Selected for Future 100 (2023)";
   - "Best small enterprise in the UAE — GCC Labour Ministers Committee ceremony, Doha (September 2024)";
   - "Emirates Labour Market Award 2023", only after the certificate is seen;
   - Software AG PartnerConnect (2022);
   - FPT Software MoU (2024);
   - Commvault Value Added Partner (GITEX 2024);
   - CyberHive MoU (2025);
   - Botminds regional partner;
   - "Supported by Dubai Chambers".

   No logos, client names, ISO or founder until permissions exist. *Default: approve.*
6. **The Yisbir boards** from the "dubaiPolice" Figma file are client-specific and show plates and weapons. *Default: publish only crops of evidenced detections (PPE, attendance/zones, fire and smoke); keep the full boards internal until permission.*
7. **Demo media:** mask and crop now, or re-record on neutral demo tenants. *Default: mask "Sovereignty in Your Hands" and the government template now; re-record later.*
8. **Figma for motion.** The Figma connector is connected; I used it to pull the Yisbir boards. The file contains **no motion data**, though. To use Figma for motion, a designer would author keyframes there, and I'd implement them via `get_motion_context`. *Default: motion stays in code (GSAP/WebGL); Figma remains the source for product screens.*

---

## 4. The plan

The effort column gives working-time estimates for me, in sequence.

| Phase | What changes | Effort | Outcome |
|---|---|---|---|
| **0 · Bugs, hygiene, compliance** | Fix the 8,208 px overflow. Remove internal codes from visible text. One honest caption per card ("Product screen · demo data", "App mock-up", "Design concept · sample data", "Illustration"). Mask or crop the J1–J3 media. Fix the moment tiles (no collision, one progress bar, longer hold). Desktop layout from 1280 px, not 1024. One chapter label instead of 4 counters. Fade content under the island. Fixed "Pause motion" label with a pause/play icon; the menu icon becomes ×. | ≈ 1 day | Nothing clipped or overflowing at 390/1024/1366/1440; no internal or contradictory labels; compliant media |
| **1 · Design system** | **Grid:** 12 columns, max width 1280, one left edge. **Spacing:** 4/8/12/16/24/32/48/64/96/128. **Type:** 8 sizes (72 display at 300, 44 H2 at 400, 28 / 20 / 16 / 14 / 13 / 12 mono-data). **Colour:** cyan for interaction only. **Components:** one card recipe (solid navy, 1 px line, radius 24), one button scale (48/44/32), one caption style (no bordered pills), one segmented control, radii 4/8/16/24/pill, nav glass to the Apple/Raycast recipe. | ≈ 1.5 days | Looks like one system: ≤ 8 type sizes, ≤ 5 radii, ≤ 2 glass elements |
| **2 · Page architecture** | Hero: eyebrow, H1, lede (Decision 4), two CTAs, moments as a ruled row, all in the hero. Layer header on one line. "Built in the UAE" becomes an offices table plus proof placards (Decision 5). Story: intro merged into step 1, 5 × 60vh, one sample label. CTA: no card, one button plus an email link. Full footer on the grid. Two CTA verb patterns. | ≈ 1 day | ≤ 10 screens (from 16.9); five-second clarity |
| **3 · Product gallery rebuild** | Six cards (Decision 2). 250vh pin with snap (Decision 1). Fades without 3D-blurring the text. Card anatomy: logo slot → one line → three plain capabilities → deploy line → CTA. Media in 7 of 12 columns, re-cropped at 16:10 with no mid-word cuts: Mandoobee phones cut out, AI in a Box cropped to the review panel, Wasel as a hairline drawing. The 3D pauses during the gallery. Solid lightbox. | ≈ 1.5 days | Real product UI reads as the strongest thing on the page |
| **4 · 3D art direction and motion** | **Lighting:** a real key light with blue-shifted shadows; fog fixed; chamfered edges instead of outlines; baked ambient occlusion and contact shadows. **Space:** a light-pool backdrop and a faint floor grid. **Objects:** one object per shape, no stacked cubes, with rotation, so the gate arm opens, the camera turns and smoke drifts as soft billboards. **Camera:** a planned shot for each chapter instead of one fixed view. **Morphs:** cells lift, travel and settle on curves; smoke cells become the dashboard bars. **Scroll:** story steps scrub with scroll. **Lines:** 2 px flow lines; solid chips with leader lines, at most 2 on screen; lighting moods (dim on "Problem", the light switches on at "AI detects"). | ≈ 2.5–3 days | 3D reads as an architectural model, not Minecraft; motion above the benchmark median |
| **5 · Mobile and tablet** | Breakpoints: one column below 768; stacked from 768 to 1279 (no pin); desktop from 1280. No fixed stage on phones: an inline poster per section, no empty gaps. Hero CTA above the fold. Product cards lead with the logo, using single-tile crops. Full-height menu sheet with focus trap and Esc. | ≈ 1 day | No gap > 96 px; CTA within 600 px on a 390 px phone |
| **6 · Quality gates** | Overflow, focus, contrast, 44 px targets; nothing under 12 px; Pause stops everything; Tailwind precompiled at build (removes the blocking runtime); Lighthouse a11y ≥ 95 and perf ≥ 85; real-GPU and mid-range Android traces. | ≈ 0.5 day + device time | Shippable prototype; ready for a second judge pass against the benchmarks |

**Checkpoints:**
1. After Phases 0–2: a fresh screenshot set for your review.
2. After Phases 3–4: a second judge pass against the same 20 benchmarks, with the scorecard updated.

**Production backlog (not in the prototype):**
- the enquiry form (`POST /v1/enquiries`) and product pages;
- legal pages (privacy, terms, cookies, accessibility);
- Arabic;
- partner logos once permitted;
- re-recorded neutral demos;
- clean Tasree3 captures.

---

## 5. Target scorecard

| Dimension | Today | After plan | Benchmark median |
|---|---|---|---|
| Five-second clarity | 2 | 4 | 4 |
| Hero composition | 2 | 4 | 4 |
| Navigation | 2 | 4 | 5 |
| Product presentation | 3 | 4 | 4 |
| Proof and trust | 1 | 3 (4 with logos) | 4 |
| Visual system | 2 | 4 | 4 |
| Motion and 3D | 2 | 4 | 3 |
| Density and length | 1 | 4 | 4 |
| CTA and conversion | 2 | 3 (4 with the form) | 5 |
| Footer | 1 | 4 (5 with legal pages) | 5 |
| Mobile | 2 | 4 | 4 |
| Accessibility and performance | 3 | 4 | 3.5 |
| **Total** | **23** | **46** | **49.5** |

What remains below the median after the plan is proof (needs permissions), CTA (needs the backend) and footer (needs legal pages). Those are launch dependencies, not design work.
