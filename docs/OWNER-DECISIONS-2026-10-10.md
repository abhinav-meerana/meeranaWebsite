# Owner decisions: 2026-10-10

These are the owner's answers to the "decisions I need" list from the 2026-10-02 plan (`plan/00-README.md`), recorded with their consequences.

**Where things are recorded:**
- **Evidence:** `docs/evidence-addendum-2026-10-10.csv` (EV-530–574). It validates together with `plan/03` (214 rows, 0 errors).
- **Detail:** `docs/PRODUCT-SCOPE-2026-10-10.md`, `docs/YISBIR-USE-CASES.md`.
- **Write scope:** per the workspace rule, `plan/` and the `meerana-*` skills were **not** edited. Merging these decisions into `plan/03` and `plan/05` is a one-step job once approved (§4).

## 1. Decisions received

| Plan item | Owner's answer | Recorded as | What changed |
|---|---|---|---|
| Product scope (opening line) | "nazo, tashree [Tasree3] and agentic ai, ai in a box, yisbir…" | EV-536 | **Six products:** Tasree3, Yisbir, Nazo, Mandoobee, AI in a Box (Agentic AI), Wasel. DL-P05 exclusions reversed. Nazo and AI in a Box get product pages and homepage chapters. |
| Yisbir positioning | "media indexing and cctv camera analytics with all the use cases you can imagine… universities… police… supermarkets and retail… product misplacements" | EV-533 | Yisbir = **two pillars + an insight layer**. 17-vertical use-case catalogue with evidence tiers: `docs/YISBIR-USE-CASES.md`. |
| 3 · Wasel availability and hardware | "yes" | EV-530 | DL-P02 **closed**: available, Meerana's own controller. The Wasel story page and gate scene are unblocked. Still needed: app screens and controller photos. |
| 4 · Product scope and service lines | "I have attached them" | EV-540–574 | NAZO, TASREE3 and Agentic AI docs analysed. **Service lines:** no change requested, so the four lines (DL-S01) are kept. |
| 5 · Entity, phone, offices | "Take it from the existing website, meerana.ae" | EV-531, EV-532 | **Entity** "Meerana Technologies LLC". **Address** "#1704, Blue Bay Tower, Business Bay, Dubai, UAE". **Email** info@meerana.ae. **No phone** (the site has none). **Offices** Dubai, London, Egypt, Chennai. |
| 6 · Face recognition | "it's a toggleable feature; focus on every other detection — fire, attendance, uniform, PPE — not just detection but using that data for insights" | EV-534, EV-535 | DL-P07 direction set: face recognition is an **optional module, off unless switched on**, absent from heroes and demos. The site leads with fire, PPE, uniform, attendance (headcount mode first) and an **insight layer** (YISBIR-USE-CASES §4, §6). |
| 7 · Live-site security findings | "Ignore them" | — | DL-T08 **closed, no action**. `plan/13` launch item 11a is waived. I won't raise it again. |

## 2. Things to know about these decisions (one line each)

- **London office:** the UK company at that address (MEERANA LTD) was dissolved on 2025-11-25 (EV-502). I've kept London as you instructed; tell me if it should go.
- **AI in a Box deployment:** the new spec runs on Oracle Cloud with an external AI provider and "No local LLM hosting" (EV-571). That contradicts the "no public cloud" announcement (EV-460). Until it's resolved, the site makes **no sovereignty claim** for it (DL-P13).
- **AI in a Box features:** the spec says its features are *planned*, not implemented (EV-570). The site shows only what the demo shows (EV-520) until you confirm what's shipped (DL-P14).
- **Tasree3 screenshots:** these are real and excellent, but carry red IP call-out markings. Clean recaptures are needed for the web (DV-11). The real app is indigo/violet, not the brand orange. The plan keeps the app UI faithful inside frames and the brand palette on the page (DD-15).
- **Police and universities:** the use cases are written evidence-first (search, evidence packages, headcount attendance, safety). Surveillance framing and exam monitoring are left out (YISBIR-USE-CASES §5.1–5.2).
- **Owner-stated detections:** uniform compliance and product misplacement are new. They show as *owner-stated* until the product owner confirms they run in production (YISBIR-USE-CASES §8).

## 3. Still open (only what blocks work)

| # | Decision | Why it matters | Where |
|---|---|---|---|
| 1 | Approve the direction, the sitemap (now six products) and **Tasree3 as the first build** | Unblocks implementation | `plan/07` §7, PRODUCT-SCOPE §4 |
| 2 | Tasree3 descriptor ("Zero bureaucracy. One process solution." / AI-native process management) and Mandoobee ("Smart Office Application") | Final copy for the slice | DL-P10, DL-P04 |
| 3 | Public names: **AI in a Box** (DV-01) and **NAZO / U Sign** (DV-03) | Product pages and media can't publish without them | PRODUCT-SCOPE §2.1–2.2 |
| 4 | AI in a Box: is a local-inference (on-premises) configuration shipped? Which spec features are live? | Deployment wording and feature list | DL-P13, DL-P14 |
| 5 | Model readiness for uniform, product misplacement, extended PPE and headcount attendance | Moves them from *owner-stated* to *documented* | YISBIR-USE-CASES §8 |
| 6 | Assets: clean Tasree3 recaptures; Wasel app screens and controller photos; vector logos | Real UI in the slice; Wasel page | DV-11, plan/10 A1, A2, A6 |
| 7 | Earlier items from the other briefs: DD-01…14 (DESIGN-DIRECTIONS §7) and DV-02, DV-04…10 (DEMO-MEDIA-PLAN) | Styling stack, demo-data policy, video rules | those documents |

## 4. Merge step (on your approval)

To make `plan/` current:
1. Append the addendum rows to `plan/03` (`research/tools/register_extra_rows.py`), plus OVERRIDES that close:
   - EV-002, EV-005: entity and phone per EV-531;
   - EV-015: offices per EV-532;
   - EV-160: AI in a Box status per EV-520 and EV-574;
   - EV-430: Wasel per EV-530.
2. Add DL-P13, DL-P14 and DL-T08 (closed) to `plan/05`, and mark DL-P02, DL-P05, DL-P07, DL-C01, DL-C04 and DL-C06 as decided.
3. Regenerate and validate.
