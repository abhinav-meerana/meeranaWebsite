# Content map: meerana.ae

**Basis:** `plan/06` (IA H1–H11, the authoritative instance) + Nazo (user, 2026-10-04) + `docs/DESIGN-DIRECTIONS.md` (M1/M2).

**Status values:**
- `ok` = evidence ok-to-use;
- `edit` = use-with-edit;
- `confirm` = needs Meerana confirmation;
- `blocked` = needs a decision.

## Sitemap
```
/                         home (M1 hero + M2 model section, recommended)
/products                 index of 5 products (+ outbound: tasree3.ae, yisbir.com, app stores)
/products/tasree3         story page (vertical slice candidate)
/products/yisbir          story page → links to yisbir.com
/products/mandoobee       story page
/products/wasel           story or fact page (DL-P02)
/products/nazo            story page (NEW; DL-P05/P08 naming + tier)
/services                 four service lines (bento + detail)
/company                  about · offices · recognition · partners · events · in the news
/contact                  form (?interest=) + direct contacts
/privacy                  PDPL-aligned website notice
/ar/…                     phase 2 (DL-L01)
```

## Home: section map
| # | Section | Question | Content | Evidence | Status |
|---|---|---|---|---|---|
| 1 | Hero | Who is Meerana? | "From the front gate to the final approval." + lede + dual CTA + 5 zone labels | EV-006/007, EV-020, product rows | ok (copy proposed) |
| 2 | Partner placards | Who vouches? | 6 placards | EV-240/505/506/507/508/509 | ok |
| 3 | Product index | Which product fits? | 5 cards (`product-cards.md`) | dossiers | ok / Wasel confirm / Nazo naming |
| 4 | Ecosystem model (light) | Where would these sit? | Isometric model, 5 zones; **no data lines between products** | DL-P06 | ok |
| 5–9 | Chapters: Wasel → Yisbir → Mandoobee → Tasree3 → **Nazo** | What does each do, for whom? | One interface moment each (provenance-labelled) | dossiers; Nazo demo | per product |
| 10 | Deployed on your terms | Where does our data live? | Fact table (below) | EV-407/444/116/103/142 | ok |
| 11 | Services bento | Can they build the rest? | `services-bento.md` | EV-030–034 | edit |
| 12 | Recognition | Can we trust them? | 3 award placards (+ Dubai Dreamers feature, EV-022) | EV-202/200/203 | ok / confirm EV-200 |
| 13 | Contact | How do I start? | Form + info@meerana.ae + address | EV-003 (unit), DL-C04 | confirm |

**Narrative order note.** With Nazo, the outside-in arc ends at the archive: perimeter → cameras → workplace → processes → **correspondence** ("the final approval, signed and sealed"). Tasree3 stays the flagship slice per the plan unless Nazo is promoted (`docs/DESIGN-DIRECTIONS.md` §9).

## Deployment fact table
| Product | Deployment | Evidence |
|---|---|---|
| Tasree3 | Your own cloud or data centre, in the region you choose; bring your own AI model endpoint | EV-407; PRODWEB §1.6 |
| Yisbir | On-premise, cloud or hybrid; works with existing cameras ("no hardware changes required") | EV-443, EV-444 |
| Mandoobee | On-premise, cloud or hybrid | EV-116 |
| Wasel | Cloud, local network, or Bluetooth when offline | EV-103 |
| Nazo | On-premises or cloud | EV-142 (confirm current) |

## Company page: fact checklist
| Fact | Content | Status |
|---|---|---|
| Founded | Founded in Dubai in 2022 [EV-020] | ok |
| HQ | Blue Bay Tower, Business Bay, Dubai | Unit 1704 vs 1706: confirm (DL-C06) |
| Offices | UAE (+ India if confirmed). **Not** the UK (dissolved 2025-11-25, EV-502); **not** Egypt (claim only, EV-503). | confirm |
| Legal entity | Per trade licence (DL-C01) | blocked |
| Leadership | Founder & CEO, with consent and a spelling decision (DL-C03) | confirm |
| Recognition, partners | As above | ok |
| Events | Max 3 verified (DL-R04): Vietnam trade mission 2024; GITEX 2022 & 2024; Dubai Business Forum – USA 2025 | ok / photo rights |
