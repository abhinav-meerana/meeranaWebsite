# Section formula: anatomy and examples

**Grid:** 12 columns; content max 1280 px; gutter `clamp(16px, 4vw, 48px)`.
**Section padding:** 96–160 px desktop, 64–96 px mobile.

## 1. Hero
```
[eyebrow: fact in mono]
H1 ≤ 8 words                                  │ product UI / signature visual (cols 7–12)
Lede ≤ 2 sentences (max 60ch)                 │ poster first; canvas or DOM demo after first paint
[Primary CTA]  Secondary CTA (text or outline)│ provenance label if UI is illustrative/reconstructed
[product index chips / zone labels]           │ [Pause/Replay] if animated
```

**Examples:**

| Page | Hero copy | Visual |
|---|---|---|
| **Meerana (M1)** | "From the front gate to the final approval." · "Meerana builds AI products for access control, video intelligence, workplace operations, process management and official correspondence. Built in the UAE and deployable on your own infrastructure." · CTAs: Explore the products / Talk to Meerana | The lattice assembling into 5 labelled zones |
| **YISBIR (Y2)** | "Search hours of video like a document." · CTAs: Try a sample search / Request a demo | A live DOM search with result cards and a 24 h index timeline |
| **Nazo (product page)** | "The final approval, signed and sealed." | Reconstructed tracking table: reference IDs, approver chain by role, statuses, Sealed · Verify |

## 2. Social proof band (directly after the hero)

**Variants, in order of strength:**
1. **Verified partner placards** (Meerana): name · relationship · year · source. No logos until permitted.
   - Data: Software AG (PartnerConnect, GITEX 2022) [EV-240] · FPT Software (strategic MoU, 2024) [EV-505] · CyberHive (MoU, 2025) [EV-507] · Dubai Chambers (supported by; trade missions) [EV-509, EV-261] · Commvault (Value Added Partner, 2024) [EV-506] · Botminds (regional partner) [EV-508].
2. **Verified recognition:** Future 100 (2023) [EV-202] · Best small enterprise in the UAE, Doha 2024 [EV-203] · ELMA 2023 [EV-200, confirm].
3. **Deployment facts** (YISBIR): "Runs on-premise, in your cloud, or hybrid · works with existing cameras" [EV-443, EV-444].

**Don't:**
- Grey logo carousels.
- Auto-scrolling marquees.
- "Trusted by 500+ organisations".
- Government emblems or logos without written approval (DL-R02).

## 3. Product demo
- **One task**, e.g.:
  - approve a leave request (Mandoobee);
  - find the bottleneck (Tasree3);
  - search footage for "permit approved" (Yisbir);
  - route a circular to signature (Nazo).
- A state machine with step buttons; scroll may drive it, but buttons must too. Use `aria-live="polite"` for step changes.
- Provenance label visible.

## 4. Feature sections (lead with a metric or a specific)
```
[metric / specific, display size]     [feature UI moment]
H2 ≤ 8 words
≤ 2 sentences
[optional link]
```

| Product | Lead | Sentence |
|---|---|---|
| Yisbir | **50+ languages** [EV-440] | "Transcripts are indexed with speaker turns, so a phrase is as searchable as a filename." |
| Tasree3 | **3 modules: re-engineer · mine · govern** [EV-401] | "Model the to-be process, mine how work actually runs, and publish only approved versions." |
| Nazo | **EN ⇄ AR, fully mirrored** (observed in the demo, 2026-10-04) | "Every screen works right-to-left, with reference numbers kept intact." |
| Deployment | **On-prem · cloud · hybrid** [EV-116, EV-444] | |

**Alternate layout** sides (text left / UI right, then reversed). Never three in a row with the same layout.

## 5. Verticals

| Brand | Verticals |
|---|---|
| Meerana | Government entities (Tasree3 Zero Government Bureaucracy alignment [EV-410]; Nazo correspondence) · Construction & infrastructure (Yisbir HSE module [EV-133]) · Residential communities & facilities (Wasel [EV-101, EV-104], pending DL-P02) · Enterprises & SMEs (Mandoobee, Tasree3 [EV-124]) |
| YISBIR | Construction & infrastructure · national and large organisations · data-sovereign organisations [EV-446] · archives and records teams (search) |

Each vertical: a named environment, one concrete scenario, and the product link.

## 6. Deployment and trust (enterprise/AI)
- A fact table per product (see `modern-tech-company/references/content-map.md`).
- Governance features: role-based access, audit logs, secure downloads, sealed archive.
- **No certification claims** without certificates (DL-R03).

## 7. Final CTA
- A dark close (`data-surface="dark"`).
- Headline ≤ 8 words: "Tell us what you want to run better."
- One primary CTA naming the product. Form fields per `plan/11` §15. Show direct contacts.
