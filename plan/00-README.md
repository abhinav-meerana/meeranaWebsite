# Meerana website — concept & delivery plan

**Status:** plan delivered 2026-10-02. **Awaiting approval.** No implementation has started.
**Workspace:** `C:\Users\abhin\Desktop\meerana`

## Deliverables

| # | Deliverable | File |
|---|---|---|
| 1 | Skills inventory + created skill files | `plan/01-skills-inventory.md`, `.claude/skills/meerana-*/` (8 skills) |
| 2 | Research report + evidence register | `plan/02-research-report.md`, `plan/03-evidence-register.csv` (182 rows; `check_register.py` passes) |
| 3 | Product dossiers | `plan/04-product-dossiers.md` |
| 4 | Content conflict & decision log | `plan/05-conflict-decision-log.md` |
| 5 | Sitemap + complete homepage section plan | `plan/06-sitemap-and-homepage-plan.md` |
| 6 | Product-page storyboards | `plan/07-product-storyboards.md` |
| 7 | Scroll-animation specification | `plan/08-scroll-animation-spec.md` (+ per-product entries in 07 §6) |
| 8 | Design system & brand rules | `plan/09-design-system.md`, `plan/design-tokens.json` |
| 9 | Dashboard / UI / asset specification | `plan/10-dashboard-ui-asset-spec.md` |
| 10 | Technical architecture & file structure | `plan/11-technical-architecture.md` |
| 11 | Phased implementation backlog | `plan/12-implementation-backlog.md` |
| 12 | Acceptance criteria & launch checklist | `plan/13-acceptance-and-launch-checklist.md` |

### Supporting material in `research/`

| Path | Contents |
|---|---|
| `sources/` | Live-site extract, product web research, company web research, tech verification, company-profile text |
| `recovered/` | Figma Make v17 source + assets; Dark Draft v2 stripped HTML + images |
| `live-site/` | meerana.ae bundle, source-map app sources, API snapshot, product videos + keyframe sheets, company profile PDF |
| `brand/` | PDF page renders and the extracted embedded images, including the two hidden superseded boards |
| `captures/` | Full-page captures of both earlier drafts |
| `asset-inventory.csv` | 189 assets with dimensions, hashes, EXIF/GPS check, duplicates and notes |
| `photo-curation.md` | Event-photo shortlist, exclusions and privacy flags |
| `tools/build_register.py`, `tools/register_extra_rows.py` | Register build. Corrections are applied as auditable OVERRIDES. |

### Deterministic checks

```bash
python research/tools/build_register.py
```

```bash
python .claude/skills/meerana-evidence/scripts/check_register.py plan/03-evidence-register.csv
```

```bash
python .claude/skills/meerana-brand/scripts/contrast_check.py
```

---

## Executive summary

### Recommended creative direction: "The operating model"

The site is built from Meerana's own geometry: the **isometric parallelogram lattice** of the logo. It becomes an architectural-model language in brand navy, white and neutral.

- **3D is used only where space explains something:**
  - one ecosystem model showing *where* each product works (perimeter, cameras, workplace, processes);
  - the camera-coverage scene for Yisbir's site module;
  - the connectivity paths for Wasel, once its hardware is confirmed.
- Product chapters switch into each product's **documented sub-brand**: Tasree3 ink and orange, Yisbir abyss and aqua, Mandoobee mist and royal, Wasel brown and gold.
- Products differ by **user and workflow**, not colour.
- Every interface demo is a real, keyboard-operable DOM component, labelled real / reconstructed / illustrative, with non-identifying sample data.
- Surfaces are light or dark *by purpose*: dark for the hero, video and close; light for structure, process maps and reading.
- **Rejected from earlier drafts:**
  - neon glow, metaballs, sparks and gradual-blur overlays;
  - fake telemetry and invented names;
  - repeated product cards;
  - green Tasree3 and cyan Wasel.

### Strongest narrative opportunity

**"Built in the UAE. Deployed where your data has to stay."**

- Meerana's 2026 voice is sovereign, locally deployed AI.
- Each lead product carries a verifiable deployment fact:
  - Tasree3 runs in your own cloud or data centre.
  - Yisbir runs on-prem, cloud or hybrid on existing cameras.
  - Mandoobee runs on-prem, cloud or hybrid.
  - Wasel works locally and over Bluetooth.
- The flagship, Tasree3, is explicitly built for the UAE's **Zero Government Bureaucracy** agenda ("Zero bureaucracy. One process solution.").
- Combined with the outside-in journey ("from the front gate to the final approval") and Arabic product names with real meaning (Meerana itself glosses Yisbir and Tasree3), this is a story no generic SaaS template can tell, and every part of it is evidence-backed.

### Most serious risks

**Content:**
1. **Proof is thin.**
   - No named customers anywhere.
   - No public evidence of ISO 27001 or 22301.
   - SAP "Gold Partner" is unsupported.
   - Every client logo is unverified.
   - The proof section must rely on three verified awards and five verified partnerships.
2. **Wasel may not be a shipping product** in the way the site implies. There is no app and no hardware evidence, and the live site hosts copied third-party (Remootio) content.
3. **Yisbir's headline capability is face recognition.** That is a privacy and reputational decision under UAE PDPL.
4. **No real product UI is public** except Mandoobee's. Tasree3 and Yisbir demos stay *illustrative* until Meerana supplies recordings.
5. **Company facts conflict:**
   - The legal entity name is unconfirmed.
   - The UK company was dissolved in Nov 2025.
   - The HQ unit number differs between listings.
   - Draft stats are unsupported.
6. **All existing product videos and covers are AI-generated.** They can't be used as product evidence.

**Technical:**
1. **3D cost on mid-tier mobile:** mitigated by posters by default on phones, a lazy persistent canvas, and on-demand rendering.
2. **Static export limits:** redirects, headers and locale handling move to the host or CDN.
3. **Pinned or sticky scroll on iOS:** mitigated by `svh`/`lvh` units, sticky stages instead of hard pins, and no pins on the mobile homepage.
4. **The contact backend doesn't exist yet.** The contract is defined and a mock is ready.
5. **Live-site security exposures** (separate from the redesign, DL-T08): a public source map, a hard-coded API key, HTTP backends, a public developer page, and possibly readable form endpoints. **Recommend fixing now.**

### Decisions I need from you

The full list with options is in `05`. The approvals that unblock work, in order:

1. **Approve the direction and scope:**
   - the "operating model" lattice language with purpose-driven light/dark surfaces (DL-B05);
   - the sitemap (06 §2);
   - **Tasree3 as the vertical slice** (07 §7).
2. **Positioning:**
   - Tasree3 → "Zero bureaucracy. One process solution." / AI-native process management (DL-P10).
   - Yisbir → Operational intelligence: AI video indexing and search; construction is a module (DL-P01).
   - Mandoobee → Smart Office Application (DL-P04).
3. **Wasel:** is it commercially available, is the controller Meerana's own hardware, and what app do users install (DL-P02)? This decides a full story page vs a short "available on request" page.
4. **Portfolio scope:** confirm the exclusions — NAZO, Smart Tracking, AI in a Box and the legacy list (DL-P05).
5. **Services as four lines:** Consulting · Bespoke development · Technology partnerships · Staff augmentation (DL-S01).
6. **Company facts:**
   - legal entity name (trade licence) (DL-C01);
   - phone (DL-C04);
   - offices to list: UAE, and India if confirmed; not the UK (DL-C06);
   - CEO name spelling (DL-C03).
7. **Proof:**
   - approve the corrected award wording (DL-R01);
   - remove the SAP badge and unverified client logos (DL-R02);
   - confirm ISO only with certificates (DL-R03).
8. **Yisbir face recognition:** feature it, list it with access-control wording, or omit it (DL-P07).
9. **Assets:** vector logos, the Tasree3 app recording, award certificates, photo rights (10 §6).
10. **Infrastructure:**
    - hosting (DL-T01);
    - API host and region (DL-T04);
    - Turnstile (DL-T05);
    - cookieless analytics (DL-T07);
    - Arabic in phase 2 (DL-L01).
11. **Permission for me to pass DL-T08** (the live-site security fixes) to whoever maintains meerana.ae.

### First milestone after approval: **M1 — Tasree3 vertical slice** (12, ~4–5 weeks indicative)

**Foundations:**
- Next.js 16 static export, tokens, fonts.
- Content schema with the **evidence gate**.
- Header and footer, `DemoFrame`.
- A persistent WebGL stage with posters and fallbacks.
- CI with accessibility, performance and size budgets.
- The contact form against a mocked FastAPI contract.

**Slice:**
- Homepage hero, product index and the **3D ecosystem model** (all four zones).
- The Tasree3 chapter.
- The complete `/products/tasree3` page: mine → find → re-engineer → ask → govern, in illustrative UI labelled as such.
- Desktop, mobile, reduced-motion and no-WebGL modes.

**Exit gate:** performance traces on a mid-tier Android and an integrated-GPU laptop, an accessibility pass, and your review of story, motion and speed. Then we go broad.
