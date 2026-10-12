---
name: modern-tech-company
description: The Meerana Technologies brand kit for the website. Covers positioning, messaging hierarchy, tone (confident, precise, British English, UAE enterprise and government market), canonical product names, product cards for Wasel, Yisbir, Mandoobee, Tasree3, Nazo and AI in a Box (plus the legacy Hi Legal record), the museum-placard partner band (Software AG, FPT Software, CyberHive, Dubai Chambers, Commvault, Botminds), the services bento grid, and the content map from sitemap to sections to evidence. Use it whenever you write or design anything that speaks as Meerana — homepage, about or company page, product cards, partner or awards sections, services, footer, boilerplate, social copy, pitch text — or when someone asks "how should Meerana sound", "write the about section", "add our partners", "make a product card", or "what are our products". Pair it with meerana-evidence for facts and meerana-brand for visual governance.
---

# Modern tech company: the Meerana brand kit

## Purpose
Make Meerana read as a **specific, credible, UAE-built enterprise technology company**:
- a company with six products, real partners and a sovereign-deployment stance, stated per product and never as a blanket claim;
- not "an innovative digital transformation partner" that could be anyone.

## Sources (in authority order)
1. `meerana-evidence` + `plan/03-evidence-register.csv`: facts (EV ids).
2. `meerana-brand` + the brand PDF: visual identity.
3. `plan/05` decision log (DL ids) and `docs/DESIGN-DIRECTIONS.md` §7 (DD ids): decisions.
4. The owner's decisions, recorded in `docs/OWNER-DECISIONS-2026-10-10.md`:
   - 2026-10-04: **Nazo is a Meerana product** (identity "U Sign", EV-540).
   - 2026-10-10: **six products**, adding AI in a Box / Agentic AI (EV-536).
   - 2026-10-10: Wasel is available on Meerana's own controller (EV-530).
   - 2026-10-10: Yisbir is media indexing **and** CCTV analytics (EV-533).
   - 2026-10-10: company details follow the live website (EV-531, EV-532).

## Positioning
**Built in the UAE. Deployed where your data has to stay.** [EV-007, EV-461]

> Meerana Technologies builds AI products for the whole operation — access control, video intelligence, workplace operations, agentic AI for every desk, process management and official correspondence — and delivers the consulting, engineering and partnerships to put them to work. Founded in Dubai in 2022.
> [EV-020, EV-006, product dossiers]

**Messaging hierarchy:**
1. **What** — six products for six operating environments: perimeter, cameras, workplace, every desk, processes, correspondence. Homepage order: `docs/PRODUCT-SCOPE-2026-10-10.md` §4.
2. **Where** — built in the UAE; each product deployable on the customer's own infrastructure (DL-P12 fact table).
3. **Proof** — six verified partners, three verified recognitions, real product UI.
4. **How** — four service lines: consulting · bespoke development · technology partnerships · staff augmentation (DL-S01).

## Tone and voice
| Do | Don't |
|---|---|
| Confident, precise, formal-friendly; short declaratives | Hype, exclamation marks, slang, puns |
| British English (organisation, programme, centre, licence) | US spellings on Meerana pages |
| Verbs from the work: open the gate, search the footage, approve the leave, find the bottleneck, sign and seal | "empower", "unlock", "seamless", "revolutionary" |
| "Meerana" for company facts; "you / your team" for the buyer | "We are the most trusted community…" |
| Respect the market: government and regulated buyers value sovereignty, Arabic parity, governance and named programmes (Zero Government Bureaucracy [EV-410]) | Implied government endorsements, emblems, unverified client logos |

Full guide: `references/positioning-and-voice.md`.

## Canonical names
- **Tasree3** (with the numeral; Arabic تسريع, "acceleration" [EV-414]).
- **Yisbir** in text / **YISBIR** in the wordmark (from "al-sabr", probing [EV-445]).
- **Mandoobee** (never Mandoobi or Mandobee).
- **Wasel** / **WASEL**.
- **Nazo** / **NAZO** (identity "U Sign — Correspondence, reimagined" [EV-540]; final public form DL-P08 / DV-03).
- **AI in a Box**: working name. The UI says "Meerana OS"; the final name is DV-01.
- **Meerana** in running text; MEERANA only in the logo.

## Product cards
Six current products plus one legacy record. Full specs and copy are in `references/product-cards.md`.

| Product | Descriptor | One line (proposed, evidence-backed) | Palette (`data-product`) |
|---|---|---|---|
| Wasel | Smart gate & access control | Open, monitor and manage gates from your phone, with Bluetooth fallback when the internet is down. [EV-100, EV-103] | wasel (brown · sand · copper · ivory) |
| Yisbir | Operational intelligence | Search hours of video like a document, and turn live camera events — fire, PPE, uniform, attendance — into insight. [EV-131, EV-440, EV-442, EV-534] | yisbir (abyss · aqua · blue) |
| Mandoobee | Smart office application | Attendance, requests, tasks, documents and an AI assistant in one workplace app. [EV-112, EV-421] | mandoobee (royal · azure · mist) |
| Tasree3 | AI-native process management | Zero bureaucracy. One process solution. [EV-400] | tasree3 (ink · orange · sky) |
| Nazo | Correspondence & document workflow | Route, approve, sign and seal official correspondence, in English and Arabic. [EV-541–545] | nazo (Meerana master layer until defined, DD-07) |
| AI in a Box | Agentic AI for every employee *(proposed)* | An AI agent for every desk that reads, drafts and reports — and asks before it acts. [EV-520; EV-573 once confirmed] | Meerana master layer (DD-16) |
| *Hi Legal* | *Legal management app: legacy* | *Do not publish* (DL-P05; 10+ installs, dormant [EV-472]). A record template is kept for completeness. | — |

**Card rules:**
- Official logo (raster ≤ native size until vectors arrive) + descriptor (label style) + one line (≤ 2 sentences) + "Explore →".
- The accent is only a 2 px top rule.
- **This is the only product card set on the page** (`meerana-narrative`).

## Partner band: museum placards
- **Not** a logo carousel. Each verified relationship becomes a **placard**, like a museum label:
  `index no. · partner name · relationship · year · source`.
- Set in a light "gallery wall" band (`data-surface="light"`, neutral `#EDEDED`) with generous whitespace and hairline rules.
- Logos are optional: shown only once supplied **and** permitted (DL-R02, DD-10).
- Spec and data: `references/partner-band.md`.

## Services bento
The four service lines in an asymmetric bento:
- Consulting 2×2;
- Bespoke development 2×1;
- Technology partnerships 1×1, linking to the placards;
- Staff augmentation 1×1;
- plus a bridge cell "Process re-engineering → Tasree3".

Each cell: a title, ≤ 2 sentences, and a mono list. No identical cells. Spec: `references/services-bento.md`.

## Content map
Sitemap → sections → question → content → evidence → status for meerana.ae, including the Nazo additions. See `references/content-map.md`.

## Quality checks
- Every factual line carries an EV id, or is marked *proposed copy* awaiting sign-off.
- Product names are canonical. British English throughout.
- No partner or client logo without permission, no ISO mention without certificates, no figures without dated confirmation (DL-C07).
- `anti-generic-audit` passes, including the V1 "swap-the-logo" test: the page must be untrue for any other company.

## Failure modes
- **"Digital transformation partner" boilerplate** (the live About block). It says nothing specific.
- **Inflated proof:** a 32-logo wall, "trusted community", overstated award names.
- **Product sprawl:** listing the 20+ legacy offerings, or confusing services with products.
- **Stale or wrong facts:** "Emarati Group" (DL-C02); the 2024 copyright footer.
  - Entity "Meerana Technologies LLC"; no phone until one is supplied (EV-531).
  - Offices follow the live website by owner decision: Dubai, London, Egypt, Chennai (EV-532). The dissolved UK company (EV-502) is a logged residual risk, not a blocker.
- **Blanket sovereignty:** "all our products run on-premises". State deployment per product. AI in a Box has no deployment claim until DL-P13.
