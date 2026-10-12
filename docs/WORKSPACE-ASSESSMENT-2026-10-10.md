# Meerana website — workspace assessment

**Date:** 2026-10-10 · **Scope:** `C:\Users\abhin\Desktop\meerana`, excluding `smart-library-video/`
**Method:** read the plan, research and review documents; inspected the built HTML; ran the project's own gates; opened and visually verified the actual media files that ship.

---

## 1. What this workspace actually is

It is **not a website codebase**. It is a *very* thorough pre-production and design-prototype pack: a research library, a 13-document plan, an evidence register, eight bespoke skills, and three single-file HTML homepage prototypes.

There is **no application**: no `package.json`, no framework config, no `.git`, no CI, no tests, no backend. Everything that renders today is a standalone `.html` file opened from disk.

That distinction is the single most important fact for the ratings in §5.

---

## 2. Done — verified as present and working

### 2.1 Planning and research (the strongest part of the workspace)

| Deliverable | State |
|---|---|
| `plan/` — 13 documents + sitemap, storyboards, scroll spec, design system, tech architecture, backlog, launch checklist | Complete (`plan/00-README.md`) |
| Evidence register | `plan/03-evidence-register.csv` — **182 rows, 0 errors**, status counts `ok-to-use` 61 / `confirm-with-meerana` 46 / `internal-only` 26 / `use-with-edit` 19 / `do-not-use` 30 |
| Owner decisions + addendum | `docs/OWNER-DECISIONS-2026-10-10.md`, `docs/evidence-addendum-2026-10-10.csv` (EV-530–574) |
| Research library | `research/` — 189 assets inventoried, live-site extract, source maps, brand PDF renders, photo curation, captured earlier drafts |
| Product scope + use cases | `docs/PRODUCT-SCOPE-2026-10-10.md`, `docs/YISBIR-USE-CASES.md` |
| Project skills | `.claude/skills/meerana-*` (8) plus supporting `landing-page`, `ui-system`, `web-animations`, `anti-generic-audit` |

### 2.2 Prototypes

| File | What it is | Size |
|---|---|---|
| `prototypes/index.html` | Hub for the four hero directions | 33 KB |
| `prototypes/meerana-m1-quiet-futurist.html` | Direction 1 | 177 KB |
| `prototypes/meerana-m2-operating-model.html` | Direction 2 | 154 KB |
| `prototypes/meerana-m3-intelligent-ecosystem.html` | **Chosen direction, the live one** | 353 KB / 2,483 lines |
| `prototypes/yisbir-y1-camera-chrome.html`, `y2-search-index.html` | Yisbir module prototypes | 87 / 107 KB |
| `prototypes/_hero-wall-spike.html` | Hero 3D wall spike — **the best-executed piece in the workspace** | 88 KB |

The M3 page contains a real, populated homepage: header/island nav, hero with H1 and four moment buttons, product proof (32 logos, 3 awards, 13 partner lines), a six-product gallery with a 250vh pin and mobile rail, an offices table with live clocks, a five-step story, CTA and footer. Reduced-motion, pause control and skip links are wired.

### 2.3 Media — the newest and best work, and it is not in the page

`prototypes/media/m3/v3/` holds **38 files / 4.5 MB** of professionally re-cropped product UI: 17 hero-wall tiles, card crops, mobile crops, masked loops (AV1 + MP4), and a phone cut-out. Reviewed on the contact sheets, these read as **genuine enterprise dashboards** — the occupancy trend, PPE compliance, fire-and-smoke, BPMN and conformance panels are credible product-grade UI, not mock-ups.

### 2.4 Deterministic gates — I re-ran all four

| Gate | Result |
|---|---|
| `motion_lint.py` | **0 FAIL** (1 WARN: off-token spring easing; 1 INFO: 1.6s flow duration) |
| `audit_page.py --brand meerana --strict` | **PASS — 100/100, 0 FAIL, 0 WARN** |
| `contrast.py --gate` | **64 pairs checked, 0 failing** |
| `check_register.py` | **182 rows, 0 errors** |

The contrast and evidence pipelines are genuinely production-grade discipline.

### 2.5 Completed review cycle

Four specialist reviews (`docs/review/m3-2026-10-10/reviews/`), two benchmarks against 20 top companies, and a judge pass that produced a **verified ledger of 47 findings (L01–L47) plus 7 the six reviewers missed (J1–J7)**. That is unusually rigorous self-scrutiny.

---

## 3. Pending — and three of them are live compliance failures

### 3.1 🔴 P0 — I visually confirmed all three in the **current build**, not just the spike

These are not backlog items. They are on the page right now.

**J1 — Yisbir boards are client-derived surveillance material.**
`prototypes/media/m3/yisbir-safety.webp` and `yisbir-security.webp` are rendered in the gallery today. Readable on screen:

- `ANPR PLATE DETECTION` with a **table of licence plate numbers** (8681 1292, 8681 1486, 1220 8699, 2091 1525 …)
- **`WEAPON ARMORY — SECURED`** tile
- `Armed trespass attempt` (CRITICAL), `Armed trespass attempt — bay 3/7-9`
- `Military-grade perimeter defense`, `GUARD FORCE DEPLOYMENT`, `EXECUTIVE PROTECTION STATUS` (VIP-ALPHA / VIP-BETA / VIP-GAMMA, `E140 Escort`), `K9 UNIT DEPLOYMENT` with named handlers and dogs, `Drone detected in airspace`, `Encrypted communications hub`
- Full-screen dark screenshot (`yisbir-security`) is *entirely* this — there is no compliant content in it at all

The source is the `dubaiPolice` Figma. `docs/review/m3-2026-10-10/JUDGE-VERDICT.md` records that all six specialist reviewers **missed** this and that it needs client permission plus removal of plates, weapons and armed-incident content.

**J2 — AI in a Box media carry a forbidden claim.**
`aibox-agent-matrix.webp` (in the gallery today) shows the sub-brand line **"AI in a Box. Sovereignty in Your Hands"** under the logo and in the UI footer. `docs/OWNER-DECISIONS-2026-10-10.md` §2 records DL-P13: the site makes **no sovereignty claim** for AI in a Box until its cloud-vs-on-prem contradiction (EV-571 vs EV-460) is resolved.

**J3 — Nazo media show a government tenant.**
`nazo-template-generator.webp` (in the gallery today) offers `Trademark Registration Approval`, `Official Circular — Circular to Ministry departments and licensed establishments`, `Foreign Company Branch Licence Endorsement — jointly signed by the Sector Director and the Undersecretary`. EV-547 marks this `do-not-use`.

**Why this matters more than the design score:** J1/J2/J3 are legal and reputational exposures that a competent reviewer would have caught, they passed through six reviews, and **the fix (the v3 media) is already sitting on disk unused.**

### 3.2 🔴 The hero wall was never ported

The spike is built, screenshotted and verified. The shipped page still carries the provisional wall with the **old media**, and the gap is visible:

| | Shipped page | Hero-wall spike |
|---|---|---|
| Look | flat navy cubes, no tiles | 13 product screens on a tilted table-top plane, drafting grid, scrims, hover tags |
| Media | old `.webp` crops | v3 crops |

Measured in the built HTML: **67 references to old media, 0 references to `media/m3/v3/`.** The 4.5 MB of new work is entirely unreferenced.

### 3.3 🟠 Engine and layout items still open

- `NEXT-TASK-PROMPT-2026-10-10.md` §3 lists as outstanding: one instance per object (4.6), camera rig (4.7), scroll scrub (4.9), 2 px flow lines and lighting moods (4.11), and cutting 21 formations to 12.
- The rAF loop still does not stop when the hero is off-screen or the tab is hidden (the verifier's open issue).
- Layout is partly still viewport arithmetic; the update to a true 12-column grid from 1280 px is incomplete.
- Tailwind is loaded as a **runtime browser build**, not precompiled — a blocking script and a known console error on `file://`.

### 3.4 🟠 Accessibility gaps still present in the built page

`aria-live` **0**, focus trap **0**, `:disabled` **0**, only **2** `focus-visible` rules — against 143 `aria-*` attributes and a working lightbox and menu sheet. The foundations are there; the dialog/menu keyboard contracts are not finished.

### 3.5 🟠 SEO and metadata are absent

No `canonical`, no Open Graph, no Twitter card, no JSON-LD. Title is `Meerana · M3 Intelligent Ecosystem · homepage prototype`. That is correct for a prototype and **incomplete for a launch**.

### 3.6 🔴 Production build does not exist at all

`package.json`, `next.config.*`, `tailwind.config.*`, `tsconfig.json`, `.git`, `.github`, tests, `playwright.config`, sitemap, robots — **none present.** The plan (`plan/11`) specifies a Next.js static export with CI budgets. Zero of it is started.

---

## 4. Pending — not started (production backlog)

Per `docs/M3-CHANGE-PLAN-2026-10-10.md` §4 and `plan/06`:

1. **Enquiry form + `POST /v1/enquiries` backend** — every CTA is currently a `mailto:`; there are 9 of them across 7 verbs.
2. **Product pages — 6 of them** (`/products/tasree3|yisbir|mandoobee|wasel|nazo|ai-in-a-box`). None exist.
3. **`/services`, `/company`, `/contact`** — planned, none built.
4. **Legal pages** — `/privacy` (required by the form and analytics under UAE PDPL), terms, cookies, accessibility.
5. **Arabic / RTL** — phase 2 per DL-L01; `lang="ar"` and `dir="rtl"` appear zero times.
6. **Logo permissions** — 11 high-risk marks (banks, government bodies, DEWA group, Neonax) need written permission; the 3 state emblems need a legal check.
7. **Re-recorded neutral demos** and **clean Tasree3 recaptures** (current ones carry red IP call-out markings; the real app is indigo, not brand orange).
8. **Redirect map, sitemap.xml, robots.txt, analytics, hosting, DNS/TLS, security headers.**

Also open in `docs/OWNER-DECISIONS-2026-10-10.md` §3: the Tasree3/Mandoobee descriptors, the public names for AI in a Box and NAZO, and whether a local-inference AI in a Box configuration actually ships.

---

## 5. Ratings

Reference points from the workspace's own scoring: the judge scored **M3 at 23/60** against a 12-dimension design scorecard, with a target of **46/60** after the change plan and a **20-site benchmark median of 49.5/60** (Linear, Vercel and Apple at 56). On a 1–10 scale that is **3.8 today, 7.7 target, 8.25 median**.

I am rating three different questions — a CEO cares whether it sells, a CTO whether it can ship, a developer whether it is built well. They do not agree, and the disagreement is the useful output.

### CEO — **4 / 10**

| Dimension | Score | Why |
|---|---|---|
| Positioning and story | **8** | "We engineer intelligence for the real world", six products, sovereign-UAE deployment, real Arabic product names. Genuinely differentiated — no template tells this story. |
| Visual distinctiveness | **7** | One continuous 3D isometric world built from the logo cell. No benchmark has one. |
| Proof and trust | **3** | No named customers, no ISO, no permitted client logos, and the 11 highest-value logos are the ones that need permission. Three awards and 13 partner lines is thin for enterprise sales. |
| Conversion path | **2** | No form, no CRM, no lead capture. Nine `mailto:` links and seven different CTA verbs. |
| Completeness (is it a company website?) | **2** | One of roughly fourteen planned pages exists. No product pages, no services, no legal, no Arabic. |

**Verdict:** as a **direction to show** it is a strong 8. As a **website to sell from** it is a 2. Weighted and honest: **4/10**. Nothing here can take an enquiry yet.

### CTO — **3 / 10**

| Dimension | Score | Why |
|---|---|---|
| Production codebase | **1** | No framework, no package.json, no repo, no CI, no tests, no environments. Every morning starts from zero. |
| Backend and integration | **1** | Contact contract is designed and mocked; no endpoint, no analytics, no hosting, no security headers, no redirect map. |
| Content correctness pipeline | **8** | Evidence register with a schema and a passing validator, plus provenance labelling on every screen. This is the thing most startups get wrong and you got right. |
| Frontend architecture | **3** | 353 KB single HTML with ~100 KB inline JS and a blocking Tailwind runtime build. Not modular, not testable, not tree-shaken. |
| 3D/performance engineering | **5** | The approach is sound — WebGL plus posters, reduced motion, pause, DPR caps. The execution is unverified: no real-GPU or mid-tier-Android trace exists. |
| SEO and observability | **2** | No canonical, OG, JSON-LD, sitemap, robots or RUM. |

**Verdict: 3/10.** Not because the engineering thinking is bad — it is good — but because **none of it has crossed into a shippable artifact**. There is a large, well-documented plan and a prototype, and no system underneath. Plus a P0 process failure: client-derived surveillance imagery reached the rendered page and six reviews missed it.

### Senior web developer — **5 / 10**

| Dimension | Score | Why |
|---|---|---|
| Code hygiene and tokens | **7** | Tokens exist and are mostly respected; the strict audit returns a clean 100/100 and 0 contrast failures. |
| Design-system rigour | **6** | Won up from 13+ type sizes and 9 radii to a mostly-collapsed scale — but raw `13px`×13, `14px`×10, `12px`×5 sizes and raw `14px`/`4px` radii still leak, and breakpoints are scattered across 479/767/1023/1279. |
| Accessibility implementation | **5** | Skip links, reduced motion, pause, 143 `aria-*` attributes and a real pause control — against zero `aria-live`, no focus trap, no `:disabled` and two `focus-visible` rules. Dialog and menu keyboard contracts unfinished. |
| 3D craft | **4** as shipped / **8** as available | The engine v3 upgrade is real work. The shipped page renders the old unlit version; the best piece in the workspace is a file nobody opens. |
| Honesty and labelling discipline | **8** | "Product screen · demo data", "Design concept · sample data", "Illustration" on every card. Rare and valuable. |
| Compliance and QA process | **3** | Three P0 compliance failures shipped and survived a six-reviewer round. The best fix was already built and simply not applied. |

**Verdict: 5/10.** The craft instincts and the documentation are well above average; the follow-through is not. This is a prototype that was reviewed more thoroughly than it was finished.

---

## 6. Why the three scores disagree — and what to do about it

The CEO scores lowest on *completeness* and *conversion*; the CTO scores lowest on *infrastructure*; the developer scores lowest on *process follow-through*. They are all describing the same single fact:

> **The thinking is at 9/10, the prototype is at 5/10, and the product is at 1/10. The bottleneck is not vision or analysis — it is finishing and shipping.**

### The three things I would do next, in this order

1. **Remove J1/J2/J3 from the page today** — not re-crop, *remove*. Swap the Yisbir and Nazo cards to the already-approved v3 crops (PPE, attendance, fire-and-smoke, the neutral AI-drafting loop) and drop the AI in a Box sovereignty line. This is a legal exposure, it is unblocked, and it needs no permission.
2. **Port the hero wall and switch the page to v3 media.** `python -B prototypes/src/build.py m3` plus the port described in `NEXT-TASK-PROMPT-2026-10-10.md` §1. 4.5 MB of finished, better work is one build step away from being visible.
3. **Start the production repo before more design iteration.** A repo, the framework, static export, tokens, one product page and the enquiry endpoint. Until that exists, every hour spent on the prototype raises the score the CEO cares about least.

**Rating of the workspace as an engineering-and-design effort: 7/10. Rating of it as a website: 2/10.**
