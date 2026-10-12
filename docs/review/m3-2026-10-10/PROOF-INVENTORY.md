# M3 proof inventory: everything from meerana.ae (2026-10-10, v3)

**Owner directive (today):** "regarding proof, bring everything from meerana.ae for now, we'll change later if needed".
**What this overrides:** JUDGE-VERDICT §4a "Never: logos (DL-R02); client names or logos (EV-243)". The override applies to the **prototype only**. The register statuses below still apply at launch.

**Data file:** `prototypes/src/m3_proof.json`. `build.py m3_proof()` reads it on every `python build.py m3`.

**No longer "safe by default".** At 15:23 the build owner changed `m3_proof()` to apply the owner's "bring everything" directive. Two things now render that v2 had held back:
- the ELMA placard, although its certificate has not been seen;
- the site's reselling-portfolio lines, which are a company claim only.

v3 records this in the JSON (`_meta.rendered_by_build`, `_meta.owner_choice_note`, `summary`, and a `rendered_by_build` flag on each award and partner record) and in the table below. Both are visible **by owner choice, prototype only**.

| Array | Rendered by build.py (15:23 version)? | What it holds |
|---|---|---|
| `logos[]` | yes: `<li title=label><img src=file alt=name>` | the wall: 29 white marks in recommended order |
| `logos_government[]` | no | the 3 colour state-emblem lockups (MOHRE, MoI/Dubai Civil Defence, Cabinet Affairs), held off the wall (§2b) |
| `awards[]` | yes: `h4 = title`, caption = `issuer`, no image | 2 placards with the §4a wording |
| `awards_withheld[]` | **partly**: every entry whose `withheld_reason` lacks "never promote" | ELMA **is rendered** (the certificate check is still open). The EV-201 item is never rendered |
| `partner_text[]` | yes: partner + relationship | the 6 ok-to-use §4a partner lines |
| `partner_text_site_only[]` | **yes**, after `partner_text[]`, under the template's "Partnerships" heading | the 4 reselling-portfolio lines: Kofax, AgilePoint, Confluent, SAP |
| `site_mentions_not_partnerships[]` | no | SAS and Sprinklr (course providers) and Zing HR (an integration) |
| `site_copy`, `news`, `stats`, `not_proof`, `testimonials_ref` | no | site wording and records, for reference |
| `testimonials` | no (empty) | moved research-side, see `testimonials_ref` |

**What a viewer sees** (build.py's real `m3_proof()`, simulated in §8):
- 29 logos with the caption "As published on meerana.ae (retrieved 2 October 2026).";
- 3 award placards;
- 10 partner rows.

Site wording is stored in `site_*` fields (`site_title`, `site_date`, `site_issuer`, `site_image_copy`) and in `text_as_site`. build.py reads none of these, so the site's typos and its do-not-use wording cannot leak into the page.

**Web media:**
- `prototypes/media/m3/proof/logos/` holds 35 files:
  - 32 `<slug>.webp`: the 29 white marks on the wall and the 3 colour lockups in `logos_government[]`;
  - 3 `<slug>.white.webp` alternates for the lockups, for use only after a legal check.
- `prototypes/media/m3/proof/awards/` holds 4 files. None is rendered, because the placards are text only.

**Originals:** `research/live-site/proof-originals/{logos,awards,other}/`.
- These are byte-for-byte copies of `https://www.meerana.ae/assets/*`.
- All 41 match the byte lengths in the 2026-10-02 HEAD check.
- 13 files were already on disk: 10 logos plus new01, new02 and news12. All 13 have the same SHA-256 hash as the fetched copies.

**Research-side records:** `research/live-site/proof-originals/site-records.json` holds the verbatim testimonials (placeholder text with personal names) and the 5 personal LinkedIn news URLs. It is never a build input.

**Failed downloads:** none. All 41 files were fetched with HTTP 200:
- 36 proof files: 32 logos and 4 award images;
- 5 non-proof files: banner-02, herobg5, partner01, partner02 and testi-01.

### v3 changes (fixer, after the second verification)

1. **Data and build agree again.** The JSON `_meta` and this file now describe what the 15:23 build actually renders: 3 placards (`summary.awards_rendered: 3`) and 10 partner rows (`partner_lines_rendered: 10`).
   - ELMA stays visible, because that is the build owner's stated intent. Its `withheld_reason` now says the §4a condition is still open.
   - **To hide ELMA**, add "never promote" to its `withheld_reason` or remove the record; build.py skips either.
2. **Partner rows relabelled.**
   - The 4 portfolio lines now read "Reselling portfolio — …". This uses the site's own frame: Managed Services, "Reselling Hardware & Software", which the register files as "Reselling portfolio vendors" (EV-034). The rows no longer read as verified partnerships.
   - SAP's product names now use SAP's own spelling (S/4HANA, Business ByDesign, SuccessFactors). The site's spelling is kept in `text_as_site`.
   - SAS, Sprinklr and Zing HR moved to `site_mentions_not_partnerships[]`, so "Course provider" and "Integration" no longer appear under "Partnerships". Each record has a `suggested_line`, ready if the owner wants it under a fitting heading.
   - With 10 rows, the 2-column list fills evenly (13 left a gap).
3. **No tooltip leak.** build.py puts `label` (or else `name`) into the `<li title>`, so `label` is a hover tooltip that viewers see.
   - `label` is now the same as `name` on every logo.
   - The "b" mark has an empty label, so it has no tooltip and an empty alt.
   - The internal wording "Unidentified ('b' mark)" moved to `label_internal`.
4. **State-emblem lockups off the wall.** MOHRE, MoI/Dubai Civil Defence and Cabinet Affairs moved from `logos[]` to `logos_government[]`.
   - On the wall they were the only colour marks, and their text was about 4 CSS px tall.
   - Each record keeps its full data, plus `row_display_css`: the size at which its text reads (180×48, 207×44 and 180×51). See §2b.
   - The wall is now a consistent monochrome set of 29.
5. **Re-trimmed.** agilepoint.webp went from 240×56 to 239×56, and magrudys.webp from 240×68 to 240×67. Each crop removed one fully transparent edge and was otherwise pixel-identical. `px`, `display_css` and the slot legibility were recomputed. All 35 files now have an alpha bounding box equal to the canvas.
6. **Names = the mark's text.** `name` is the alt text, so it now holds only what the mark shows:
   - "General Civil Aviation Authority" (was "UAE … (GCAA)");
   - "Dubai Electricity & Water Authority" (was "… (DEWA)");
   - "UAE Ministry of Human Resources & Emiratisation" (was "… (MOHRE)");
   - "UAE Ministry of Interior, Dubai Civil Defense", with the mark's spelling "Defense".

   The acronym forms moved to `inferred_identity`. `name_note` now states the rule: "United Arab Emirates" may be shortened to "UAE", and nothing else is added.
7. **Not changed (template owner):** `display_css` is still advisory. The template ignores it (§8).

The v3 patch is `proof-fix3/make_json_v3.py` in the session scratchpad. It runs on top of the v2 output and refuses any other input. It asserts the following:
- no internal codes or internal words ("unidentified", "likely", "inferred", "[sic]", the site typos) in any field the build renders;
- no personal names or Lorem text anywhere in the file.

### v2 changes (earlier fixer pass, kept for the record)

Items 1 and 2 were partly overtaken by the 15:23 build change; see v3 items 1 and 2.

1. **Awards:** `awards[]` was cut to Future 100 and Best small enterprise, with the §4a wording and no image. ELMA and the EV-201 item moved to `awards_withheld[]`. The site's own fields were renamed `site_*`.
2. **Partner lines:** the 6 ok-to-use lines stayed in `partner_text[]`. The 7 site-only lines moved to `partner_text_site_only[]`.
3. **Logo names** stopped adding inferred identities:
   - "Dell", not "Dell Technologies";
   - "Ruya", not "Ruya (bank)";
   - "Moro", not "Moro Hub";
   - an empty name for the "b" mark.

   Guesses moved to `inferred_identity`.
4. **State-emblem lockups:** these now use colour files, the mark as published with only the page-white removed. No emblem is recoloured. The white versions were kept as `<slug>.white.webp`; the white MoI file had reduced its wreath emblem to an unreadable disc.
5. **Legibility:** measured at the build's real slot (§2c).
6. **Personal data:** the testimonial names and the 5 personal-slug LinkedIn URLs were moved out of the build input.
7. **Display flags:** every news item got a `display` flag.
8. **Cache cleanup:** the stray `prototypes/src/__pycache__/` was removed, and all checks run with `python -B`.

---

## 1. Recommended display order (strongest first)

1. **Award placards, text only, using the §4a wording.**
   - "Selected for Future 100 (2023)", captioned "UAE Ministry of Economy & the Government Development and the Future Office" (EV-202, ok).
   - "Best small enterprise in the UAE", captioned "Honoured at the GCC Labour Ministers Committee ceremony, Doha (September 2024)" (EV-203, ok).
   - "Emirates Labour Market Award 2023 (MOHRE)", captioned "Workforce Wellbeing & Quality of Life" (EV-200, use-with-edit).
     - **Rendered by owner choice**, but the §4a condition (the certificate has been seen) is still open.
     - Hide this placard first if marketing cannot confirm the certificate.
   - Each title and caption, joined by " — ", give the §4a wording.
2. **Verified partner lines** (`partner_text[]`): Software AG, Commvault, FPT Software, Botminds, Dubai Chambers and CyberHive. All six are ok-to-use as text.
3. **Reselling-portfolio lines** (`partner_text_site_only[]`): Kofax, AgilePoint, Confluent and SAP.
   - These are company claims only (EV-034, confirm-with-meerana).
   - **SAP is the riskiest**: Meerana is not in SAP Partner Finder, and "SAP Gold Partner" is do-not-use (EV-242). Drop it first.
4. **Logo wall, tiers 1 to 6** (`logos[]`, 29; table §2a):
   - verified partners;
   - technology vendors named in the site text;
   - recognised enterprises;
   - government bodies;
   - associations;
   - lesser-known or unidentified marks.
5. **Government row** (`logos_government[]`, 3): only if the template adds a larger, separate row (§2b), and only once legal has cleared the use.

**Lowest-risk demo set:** the 2 ok placards, the 6 verified partner lines and logo tiers 1 and 2 (7 logos). Every other logo needs written permission before the page goes public.

**Layout notes for the template owner:**
- **Awards:** the 3 placards now fill the 3-column grid.
- **Wall:** 29 logos leave a short last row: 5 of 8 at 1440 px, and 1 of 4 at 1024 px, where the "b" mark sits alone. Two fixes:
  - centre the last row, e.g. with `flex-wrap` and `justify-content: center`;
  - or render the government row below the wall.
- **Sizing:** emit `width`/`height` from `display_css` (§8).

---

## 2. Logos (32): the meerana.ae `/partners` grid

Every logo sits on the site in one unlabelled grid headed "Partners  & Clients" (the footer calls it "Clients & Partners"). The grid is grayscale with `alt=""`. **No logo is labelled client, partner or vendor anywhere on the site.**

The 32 records are split into two arrays:
- `logos[]`: the 29 white marks on the wall (§2a);
- `logos_government[]`: the 3 colour lockups held off the wall (§2b).

The API's 32 logo files map one-to-one onto these 32 records.

Column notes:
- "Name / alt" is the `name` field. The build uses it as the image's alt text and, through `label`, as the hover tooltip. It gives the mark's own text.
- "Profile": the logo also appears on page 19 ("Our Partners & Clients") of the company profile PDF on meerana.ae. That PDF is the same company source as the site, so it is not independent proof.
- "Home": the logo is one of the first 4, which the home page shows.

### 2a. The wall (`logos[]`, 29, in recommended order)

| # | Web file | Name / alt | ID conf. | What the site says beyond the grid | EV · status | Risk | Flags |
|---|---|---|---|---|---|---|---|
| **Tier 1: relationship independently verified** |||||||
| 1 | software-ag.webp | Software AG | high | News 12 Oct 2022 "Software AG, Meerana sign partnership"; Managed Services list. Profile | EV-240 ok (text) · EV-241 logo confirm | low | Past tense only. Status after 2022 not verified |
| 2 | commvault.webp | Commvault | high | Managed Services "Commvault - Data Security & Back up Platforms"; course provider. Profile | EV-506 ok · EV-241 | low | — |
| 3 | botminds.webp | Botminds | high | Course provider. Profile | EV-508 ok · EV-241 | low | Same category as Nazo (document AI). botminds.ai lists Meerana as a partner |
| **Tier 2: vendors named in site text (company claim only)** |||||||
| 4 | confluent.webp | Confluent | high | "Confluent - Data Streaming Platform". Profile | EV-034 confirm | medium | Not in Confluent's partner directory |
| 5 | kofax.webp | Kofax | high | "Kofax - Robotic Automation Platform". Profile | EV-034 confirm | medium | **Outdated brand:** Kofax is now Tungsten Automation |
| 6 | agilepoint.webp | AgilePoint | high | "Agilepoint - No Code Low Code". Profile | EV-034 confirm | medium | Not in AgilePoint's partner directory. Same category as Tasree3 |
| 7 | sas.webp | SAS | high | Course provider card, with no courses. Not in the profile | EV-041 confirm | medium | Courses are outside v1 scope (DL-S04) |
| **Tier 3: recognised enterprises, relationship not stated** |||||||
| 8 | dell.webp | Dell | high | None (Managed Services mentions PC resale but never names Dell). Home, Profile | EV-241 confirm | medium | The circle mark reads DELL (Dell Technologies). Unclear whether Dell is a client or a vendor |
| 9 | emirates-nbd.webp | Emirates NBD | high | None. Home, Profile | EV-243 confirm | **high** | Regulated bank, so it implies a client endorsement. The brand may require the navy plate: this file has been converted to a white mark |
| 10 | adib.webp | Abu Dhabi Islamic Bank (ADIB) | high | None. Profile | EV-243 · EV-145 | **high** | Regulated bank. The mark shows "ADIB" and the full name in Arabic. ADIB is also demo data in the live Nazoo mock ("Official Letter to ADIB Bank", do-not-use) |
| 11 | ruya.webp | Ruya | medium | None. Not in the profile, so added later | EV-241 confirm | **high** | Inferred from the wordmark and the filename "ruyabank": likely Ruya Community Islamic Bank. Unconfirmed |
| 12 | jumbo.webp | Jumbo | medium | None. Profile | EV-241 confirm | medium | Probably Jumbo Electronics (UAE). Unconfirmed |
| 13 | magrudys.webp | Magrudy's | high | None. Profile | EV-241 confirm | medium | Tagline unreadable at 1x (§2c). Re-trimmed in v3 |
| **Tier 4: government and semi-government (endorsement risk)** |||||||
| 14 | dewa.webp | Dubai Electricity & Water Authority | high | None. Home, Profile | EV-243 confirm | **high** | A government authority (DEWA, in `inferred_identity`). With Digital DEWA and Moro, one group may appear 3 times. English line unreadable at 1x |
| 15 | digital-dewa.webp | Digital DEWA | high | None. Home, Profile | EV-243 confirm | **high** | **Corrects the extract**: the file `dewa.png` is the Digital DEWA mark, not a second DEWA logo |
| 16 | moro.webp | Moro | medium | None. Profile | EV-241 confirm | **high** | The wordmark reads "M( )RO". It is likely Moro Hub, a DEWA-group company, but that is unconfirmed. **Tier 4 and the high risk are precautionary** and assume that identity. **Possible competitor** in cloud, data-centre and managed services |
| 17 | gcaa.webp | General Civil Aviation Authority | high | None. Profile | EV-243 confirm | **high** | **Resolves "uncertain"**: the image reads "GENERAL CIVIL AVIATION AUTHORITY" plus the Arabic name. The UAE GCAA is in `inferred_identity`. English line unreadable at 1x |
| **Tier 5: associations and non-profits** |||||||
| 18 | uae-inventors-association.webp | UAE Inventors Association | high | News Jul 2023 "CEO contribution as deputy chairman of UAE innovation association". Profile | EV-023 use-with-edit | medium | An affiliation of the CEO, not a client. Founder consent is needed (EV-013) |
| 19 | dar-al-ber-society.webp | Dar Al Ber Society | high | None. Profile | EV-241 confirm | medium | A charity. The relationship is not stated |
| **Tier 6: lesser-known or uncertain** |||||||
| 20 | almuetamadah-real-estate.webp | Almuetamadah Real Estate | medium | None. Profile | EV-241 | medium | Name read from the logo. Not researched. English line unreadable at 1x |
| 21 | digitalx.webp | DigitalX | low | None. Profile | EV-241 | medium | Unknown whether this is a company or an event brand. Possible peer |
| 22 | smartxhub.webp | SmartXHub | low | None. Profile | EV-241 | medium | Entity unknown. Possible peer |
| 23 | sabeel-technologies.webp | Sabeel Technologies | medium | None. Profile | EV-241 | medium | **Possible competitor** (an IT/VR firm). Tagline unreadable at 1x |
| 24 | indus-novateur.webp | Indus Novateur | medium | None. Profile | EV-241 | medium | **Possible competitor** (an IT firm). Not researched |
| 25 | neonax.webp | Neonax | medium | None. Profile | EV-547 · EV-241 | **high** | "NEONAX" is also the **demo tenant in the Nazo media** (EV-547). If Neonax is a real organisation, that media shows its data. Possible peer. Tagline unreadable at 1x |
| 26 | cronos-international.webp | Cronos International | low | None. Profile | EV-241 | medium | Entity unknown. Possible peer |
| 27 | modon-global.webp | MODON global | low | None. Not in the profile | EV-241 | medium | Entity unknown. **Not** Abu Dhabi's Modon Holding (different mark) |
| 28 | src.webp | SRC | low | None. Profile | EV-241 | medium | Initials only. **Unidentified** |
| 29 | unidentified-b.webp | *(empty: decorative alt, no tooltip)* | none | None. Profile | EV-241 | medium | A "b" monogram with no wordmark. `label` is empty; the internal wording is in `label_internal`. Give it a name once Meerana identifies it |

### 2b. Government row, held off the wall (`logos_government[]`, 3)

These three lockups carry the UAE federal emblem.
- **Off the wall:** they are colour files, so that no state emblem is recoloured. In the wall's 139×40 cell their text renders about 4 CSS px tall. They were the only colour marks on a white wall and read as smudges.
- **Where they belong:** in a separate, larger row at `row_display_css`, the smallest size at which their text reads. If the template has no such row, drop them.
- **White versions:** the `.white.webp` files recolour a state emblem. Use them only after a legal check. The white MoI file is unusable either way.

| # | Web file (colour) | Name / alt | `row_display_css` | What the site says beyond the grid | EV · status | Risk | Flags |
|---|---|---|---|---|---|---|---|
| G1 | mohre.webp | UAE Ministry of Human Resources & Emiratisation | 180×48 | MOHRE is also the issuer named in two award news items. Profile | EV-200 · EV-241 | **high** | A federal ministry (MOHRE, in `inferred_identity`). Putting the award issuer on a client wall implies MOHRE is a client |
| G2 | moi-dubai-civil-defence.webp | UAE Ministry of Interior, Dubai Civil Defense | 207×44 | None. Profile | EV-243 confirm | **high** | An interior ministry: the highest endorsement sensitivity. 4 lines of caps. The name keeps the mark's spelling "Defense" |
| G3 | ministry-of-cabinet-affairs.webp | UAE Ministry of Cabinet Affairs | 180×51 | None. Profile | EV-243 confirm | **high** | A federal ministry. 2 lines of caps |

To put them back on the wall, append the three records to `logos[]`. build.py renders `logos[]` only.

**Logo risk counts (all 32):**
- 11 high:
  - 3 banks;
  - 7 government or DEWA-group bodies (Moro included as a precaution);
  - Neonax.

  8 of the 11 are on the wall; the other 3 are the government row.
- 18 medium.
- 3 low.
- Every logo needs permission to use it (EV-241, DL-R02).

### 2c. Legibility in the build's real slot

**The slot:** at 1440 px, the template's `.logos` grid gives each logo a cell 139 CSS px wide, with `img max-height: 40px` and opacity 0.72. The JSON's `display_css` is advisory, and the template does not read it. So legibility was measured at 139×40, at 1x.

**The rule:**
- Caps lines need about 6 CSS px of cap height to read.
- Mixed-case lines need about 9 CSS px from ascender to descender.

**The fields:**
- `mono_legible`: every text line in the mark reads at 1x.
- `identity_legible_1x`: the part that identifies the organisation reads.
- `legibility.display_css_legible`: the size at which the smallest line would read.

| Logo | Where | Unreadable at 1x | ≈ CSS px | Identity still reads? | Readable from |
|---|---|---|---|---|---|
| MOHRE | government row | 3 lines of caps | 4.6 | **no**: every federal body shares the falcon | 180×48 |
| MoI / Dubai Civil Defence | government row | 4 lines of caps | 4.1 | **no**: only the wreath emblem (colour file) | 207×44 |
| Cabinet Affairs | government row | 2 lines of caps | 4.6 | **no** | 180×51 |
| General Civil Aviation Authority | wall | English line | 4.1 | yes: wing mark and Arabic line | 206×49 |
| Dubai Electricity & Water Authority | wall | English line | 6.4 (mixed) | yes: ring mark and Arabic line | 199×48 |
| Sabeel Technologies | wall | tagline | 6.4 (mixed) | yes | 199×49 |
| Magrudy's | wall | tagline | 8.7 (mixed) | yes | 147×41 |
| Neonax | wall | tagline | 4.1 | yes | 182×59 |
| Almuetamadah Real Estate | wall | English line | 4.6 | yes: Arabic name and mark | 180×42 |

**What this means:**
- Every logo on the wall now identifies its organisation at 1x. Six still carry a secondary line (an English name or a tagline) that only reads at about 1.5x.
- The three lockups whose identity did not read at 1x are the government row (§2b).
- Wall previews at 1440 px and 1024 px are in the session scratchpad: `proof-fix3/shots/v3-wall.png` and `v3-wall-1024.png`.

---

## 3. Awards (4 items on the site, which are 3 distinct honours)

The site has no awards section. These items appear only in hero slides and news cards.

| # | Array | Rendered as | Title as on the site (`site_title`, verbatim) | Date as on the site | EV · status |
|---|---|---|---|---|---|
| 1 | `awards[0]` | **Selected for Future 100 (2023)** / UAE Ministry of Economy & the Government Development and the Future Office | "Meerana Selected Among 100 Future Companies". Hero: "Chosen Among Future 100 Companies" | "Decemeber 2, 2023" [sic] | EV-202 **ok**. A selection: never call it an "award" or "Top 100" |
| 2 | `awards[1]` | **Best small enterprise in the UAE** / Honoured at the GCC Labour Ministers Committee ceremony, Doha (September 2024) | "Meerana received the award for Best Small Enterprise" | "September 5, 2024" | EV-203 **ok**. Never "best in the GCC" |
| 3 | `awards_withheld[0]` | **rendered by owner choice** (build.py, 15:23): **Emirates Labour Market Award 2023 (MOHRE)** / Workforce Wellbeing & Quality of Life | "Winning MOHRE Award for Workforce wellbeing, Quality of Life". Hero: "MOHRE Award Recognizes Our Dedication to Workforce Wellbeing!" | "November 23, 2023" | EV-200 use-with-edit. **The §4a condition is still open**: use only after the certificate has been seen. The official 2023 winners list names "Meerana Information Technology" |
| 4 | `awards_withheld[1]` | never rendered (`withheld_reason` contains "Never promote") | "Meerana recieving award from MOHRE UAE" [sic] | "September 13, 2024" | EV-201 **do-not-use**. Probably the local handover of #2. Never "MOHRE 2024" |

**Image notes:** none of the award images is rendered. Each record keeps its copy path in `site_image_copy`.
- **Faces:**
  - news12 shows 3 identifiable people (senior officials). news13 shows 5.
  - The web copies (`news12-faces-masked.webp`, `news13-faces-masked.webp`) have their faces pixelated and blurred.
  - The unmasked originals stay in `research/` only.
  - Masked officials look like a defect on a benchmark-grade page, so the placards are text only.
- **Resolution:**
  - new01 and new02 are only 285 px wide on meerana.ae. They were **not upscaled**, because the template's 16:9 cover crop would blur them and cut them to a strip.
  - new02 also lists 99 other company names.
- **Hero slide images:** these were checked and are **not award images**.
  - `banner-02.webp` is a stock silhouette photo.
  - `herobg5.webp` is an exhibition-booth photo with identifiable faces.
  - Both are kept in the originals folder only.

---

## 4. Partner lines (10 rendered, under the template's "Partnerships" heading)

**Verified (`partner_text[]`, all ok-to-use, §4a wording):**

| Partner | Line rendered | Site wording | EV · status |
|---|---|---|---|
| Software AG | Joined Software AG's PartnerConnect programme (2022) | "Software AG, Meerana sign partnership" | EV-240 ok |
| Commvault | Value Added Partner for Commvault — announced at GITEX Global 2024 | "Commvault - Data Security & Back up Platforms" | EV-506 ok |
| FPT Software | Strategic partnership (MoU) with FPT Software, 2024 | FPT course-provider blurb; no logo | EV-505 ok |
| Botminds | Regional partner — Botminds | course-provider blurb | EV-508 ok |
| Dubai Chambers | Supported by Dubai Chambers | "Dubai Dreamers: From Dubai to the World with Meerana Technologies" video | EV-509 ok (a host, not a partner) |
| CyberHive | MoU with CyberHive, 2025 — Dubai Business Forum, London | **not on meerana.ae** (verified in press) | EV-507 ok. Never attribute CyberHive's ISO 27001 to Meerana |

**Reselling portfolio (`partner_text_site_only[]`, rendered by owner choice, company claim only):**

These are framed with the site's own section, Managed Services, "Reselling Hardware & Software". They therefore do not read as verified partnerships.

| Partner | Line rendered | Site wording (`text_as_site`) | EV · status | Flag |
|---|---|---|---|---|
| Kofax | Reselling portfolio — Robotic Automation Platform | "Kofax - Robotic Automation Platform" | EV-034 confirm | **Outdated brand:** Kofax is now Tungsten Automation |
| AgilePoint | Reselling portfolio — No Code Low Code | "Agilepoint - No Code Low Code" | EV-034 confirm | Not in AgilePoint's partner directory |
| Confluent | Reselling portfolio — Data Streaming Platform | "Confluent - Data Streaming Platform" | EV-034 confirm | Not in Confluent's partner directory |
| SAP | Reselling portfolio — Ariba, S/4HANA, Business ByDesign, Business One, C4C, SuccessFactors | "SAP Ariba, S/4 Hana, Business  By design, Business One, C4C, Success Factors" | EV-034 confirm · EV-242 | **Highest risk:** not in SAP Partner Finder, and "SAP Gold Partner" is do-not-use. Product names corrected to SAP's spelling. Drop first |

**Not rendered (`site_mentions_not_partnerships[]`):** these are not partnerships, so they left the rendered array in v3.

| Name | What the site says | `suggested_line` if the owner wants it shown (under a fitting heading) |
|---|---|---|
| SAS | Course provider on /courses, with no courses listed (EV-041) | Listed as a training-course provider on meerana.ae (no courses listed) |
| Sprinklr | Course provider on /courses, with no courses listed (EV-041) | Listed as a training-course provider on meerana.ae (no courses listed) |
| Zing HR | "We provide Zing HR integration …" (chatbot; contact form) | Meerana offers a Zing HR integration |

The JSON keeps site-level copy under `site_copy`. The build does not render it:
- the partners heading, title and intro ("We are proud to partner with a wide range of organizations…");
- About;
- Vision;
- Why Choose Us;
- the experience banner;
- the Dubai Chambers video.

---

## 5. News (13 items, verbatim; not rendered by the build)

| id | Date as on the site | Headline | EV · status | `display` | Flag |
|---|---|---|---|---|---|
| 1 | October 12, 2022 | Software AG, Meerana sign partnership | EV-240 ok | true | — |
| 2 | July 2023 | CEO contribution as deputy chairman of UAE innovation association | EV-023 use-with-edit | true | The association's own title is Vice President. Founder consent needed |
| 3 | Novemeber 15, 2023 [sic] | MEERANA's strategic expansion into Kenya and Rwanda | EV-266 **do-not-use** | **false** | Sponsored placement |
| 4 | November 23, 2023 | Ministry of economy Korea and Qatar stands | EV-264 confirm | true | — |
| 5 | November 23, 2023 | Winning MOHRE Award for Workforce wellbeing, Quality of Life | EV-200 use-with-edit | **false** | Keep the site headline off the page. The ELMA placard renders with the judge's wording (owner choice); the certificate check is still open |
| 6 | Decemeber 2, 2023 [sic] | Meerana Selected Among 100 Future Companies | EV-202 ok | true | — |
| 7 | May 6, 2024 | Jakarta visit: Enhancing bilateral cooperation and expressing gratitude. | EV-261 use-with-edit | true | Personal LinkedIn post: URL held research-side |
| 8 | May 9, 2024 | Vietnam visit: Fostering international trade relations and collaboration. | EV-261 use-with-edit | true | Personal LinkedIn post: URL held research-side |
| 9 | May 24, 2024 | Paris visit: Strategic partnerships with the Ministry of Economy. | EV-262 confirm | true | Staff member's personal post: URL held research-side |
| 10 | June 4-7, 2024 | St. Petersburg visit: Discussing global economic and trade matters. | EV-260 confirm | true | Personal post: URL held research-side. Dates conflict (SPIEF ran 5–8 June). A forum in Russia: the owner should judge whether it fits the brand |
| 11 | August 22, 2024 | Lithuania visit: Strengthening B2B relations, exploring new opportunities | EV-263 confirm | true | Staff member's personal post: URL held research-side |
| 12 | September 5, 2024 | Meerana received the award for Best Small Enterprise | EV-203 ok | true | — |
| 21 | September 13, 2024 | Meerana recieving award from MOHRE UAE [sic] | EV-201 **do-not-use** | **false** | — |

`display: true` does not approve a headline. Every item that is not ok-to-use carries a `display_note`: the register condition must be met first, and the site headline is not approved wording.

The newest item is from September 2024, so a news strip would look about 2 years stale.

---

## 6. Stats and testimonials

**Company statistics:** **meerana.ae renders no company-level statistics.**
- The `experienceInfo` and `chooseusInfo` records contain no figures.
- The profile PDF on meerana.ae has "04+ Location", "30+ Workforce" and a "Dubai SME" badge (EV-016, EV-017 and EV-019, all confirm-with-meerana). The UK company was dissolved (EV-502).

**Product claims rendered on the site:** these are stored in `stats` so they are traceable, but all of them are do-not-use or confirm.
- "10x Faster Processing" and "100% Secure & Compliant" (Nazoo, EV-143 do-not-use).
- "Reduce process modeling time by up to 70%" (EV-125 confirm).
- "100% End-to-End Visibility" (EV-126 do-not-use).
- "Reduced asset retrieval and lookup times by 90%" (EV-154 do-not-use).

**Testimonials:** **both are placeholders.**
- The text is Lorem Ipsum, attached to two personal names with a city each.
- The avatar is a stock photo (`testi-01.png`).
- The home page fetches them but never renders them.
- The verbatim records are held only in `research/live-site/proof-originals/site-records.json`. In `m3_proof.json`, `testimonials` is empty and `testimonials_ref` points to that file. **Never display.**

**Not proof:**
- `partner01.webp` and `partner02.webp` are stock photos on /partners.
- The Mandoobee bundle contains placeholder company names ("TechSolutions", "InnoWave", "DigitalCorp", "NextGen", "AlphaSoft", "CloudSync") that are never rendered.

---

## 7. Risk flags, by type

- **Visible by owner choice (prototype only):**
  - the ELMA placard: the §4a condition, that the certificate has been seen, is still open;
  - the 4 reselling-portfolio lines: EV-034, confirm-with-meerana, with SAP the riskiest.

  Both were put on the page by the build owner under the "bring everything" directive. Hide both before any public use unless Meerana confirms them.
- **Government endorsement (7):**
  - on the wall: DEWA, Digital DEWA, Moro (if it is Moro Hub) and GCAA;
  - in the government row, which is not rendered: MOHRE, MoI/Dubai Civil Defence and Cabinet Affairs.

  Each implies a government endorsement that the site never states. EV-243 says: "Never label as clients or imply endorsement without written confirmation."
- **State emblem (3):** MOHRE, MoI and Cabinet Affairs carry a UAE state emblem.
  - They are now off the wall (§2b).
  - If they are shown, use the colour files at `row_display_css` in their own row.
  - The white reversed versions (`<slug>.white.webp`) need legal approval before use. Placing a government lockup on navy may itself fall outside its brand rules, so the legal check applies to the colour files too.
- **Regulated banks (3):** Emirates NBD, ADIB and Ruya. These banks have strict brand-use rules.
- **Uncertain identification:**
  - Medium confidence: Ruya, Jumbo, Moro. Their `name` (the alt text) shows only what the mark reads; guesses sit in `inferred_identity`.
  - Low confidence: DigitalX, SmartXHub, Cronos International, MODON global.
  - Unidentified: SRC, and the "b" mark (empty alt, no tooltip).
  - Two corrections to the extract: `dewa.png` is Digital DEWA, and `generalCivil.png` is the GCAA.
- **Possible competitors or peers:** Moro, Sabeel Technologies, Indus Novateur, Neonax, DigitalX, SmartXHub and Cronos International. These are IT or digital-services firms whose relationship to Meerana is unknown. AgilePoint and Botminds are vendors in the same categories as Tasree3 and Nazo.
- **Placeholder names:** both testimonials (held research-side), the Mandoobee "trustedBy" names, and NEONAX as the Nazo demo tenant.
- **People:** award photos news12 and news13, and hero `herobg5`, show identifiable people. Only face-masked copies are in the prototype media, and none is rendered.
- **Personal names:** five news URLs are personal LinkedIn posts by the CEO and a staff member. They are not in the build input; they are in `site-records.json` only.
- **Typos on the site:** "Decemeber", "Novemeber", "recieving", "Emarati", and the double space in "Partners  & Clients". These are kept verbatim in the `site_*` and `*_as_site` fields, which the build does not read.
- **Outdated brand:** Kofax is now Tungsten Automation. Its logo and its portfolio line both render.
- **Legibility:** 6 logos on the wall have a secondary line below 1x legibility, but all identify their organisation. The 3 lockups that do not identify at 1x are off the wall (§2c).

---

## 8. How the logos were converted

**White marks (29 logos, the wall).** The pipeline lives in the session scratchpad at `proof/tools/logos.py`. It takes these steps:
1. Composite each logo onto white.
2. Estimate the background colour from the border.
3. Map colour distance from the background to alpha, with an adaptive stretch so the solid parts of the mark become fully white.
4. Trim, fit inside 240×96 and save as lossless WebP.

Exceptions:
- **Logos on a solid plate:** Emirates NBD (navy), DigitalX (grey), Almuetamadah (teal) and MODON (charcoal) are cropped to the plate, and the plate colour is used as the background.
  - The white text and marks survive this, but the plate itself is lost.
  - For DigitalX the threshold was tuned so its outline "X" stays solid.
- **Transparent source:** Ruya's source has a transparent background. It is composited first so the white swirl stays a cut-out.
- **v3 re-trim:** `proof-fix3/retrim.py` cropped agilepoint.webp and magrudys.webp to their alpha > 0 bounding box. The crop is lossless and otherwise pixel-identical.

**Colour marks (3 state-emblem lockups, the government row).** The pipeline is `proof-fix/emblem_colour.py` in the session scratchpad.
1. Split the lockup at its first wide blank column, into the emblem and the text.
2. Remove the background. Two kinds of near-white pixel go:
   - those connected to the image border;
   - every near-white pixel in the text block, such as letter counters.
3. Keep the whites enclosed inside the emblem, such as the flag stripe and the MoI disc.
4. Give a 2-px band round the background a coverage alpha, and un-mix its colour from white so no white halo shows on navy.
5. Trim, fit inside 240×96 with Lanczos on premultiplied RGBA, and save as lossless WebP.

All emblem and text colours are unchanged.

**Regeneration order:** running `logos.py` again rewrites all 32 `<slug>.webp` files as white marks, the 3 emblem lockups included. To regenerate:
1. Run `logos.py`.
2. Copy the 3 emblem `<slug>.webp` files to `<slug>.white.webp`.
3. Run `emblem_colour.py`, then copy its `<slug>.colour.webp` output over `<slug>.webp`.
4. Run `proof-fix3/retrim.py <logo dir> agilepoint.webp magrudys.webp`. It is safe on any file and skips files that are already trimmed.
5. Run `proof-fix/make_json_v2.py`, then `proof-fix3/make_json_v3.py <workspace>`.

The scripts live in the session scratchpad only, because the project folders were outside the write scope. Move them into the project if the proof needs regenerating later.

**Visual check:**
- All 32 were checked on navy #071B36 at native size, and in the template's own 139×40 slot at 0.72 opacity.
- **Correction to v1:** v1 said no conversion harmed legibility. In fact the white MoI conversion merged the eagle and the wreath into a disc. That is why the three emblem lockups use colour files.

**Optical sizing:** each entry has a `display_css` field (w×h in CSS px). This sizes the logos to equal optical weight:
- lockups made of small text are drawn larger;
- dense monograms (SRC, "b", Dell) are drawn smaller;
- the widest is 160 px.

The template does not read `display_css` at present.
- **What happens now:** wide wordmarks fill the whole 139 px cell (software-ag 139×26, botminds 139×20), while monograms stop at the 40 px height cap (Dell 40×40, "b" 39×40).
- **The fix (template/build owner):** emit `width` and `height` from `display_css` on each `<img>` and centre it in its cell. This also removes layout shift.

**How v3 was checked:**
- **Files:** `proof-fix3/check_v3.py` found the following.
  - The 32 records (`logos[]` + `logos_government[]`) map one-to-one onto the 32 API logo files, with no duplicates.
  - Every web file exists, matches `px`, fits 240×96 and is lossless WebP.
  - Every web file's alpha bounding box equals its canvas.
  - The 29 wall files are pure white; the 3 government files are colour.
  - `label` equals `name` on every record.
  - Every original matches its stored SHA-256.
  - No file in the logos folder is unreferenced.
- **Build output:** `proof-fix3/sim_build.py` ran build.py's real `m3_proof()` (the 15:23 version) with `python -B` against v3. The visible output was:
  - 29 logos: alts and tooltips are the names; the "b" mark has neither;
  - 3 placards: Future 100, Best small enterprise and ELMA, with no images;
  - 10 partner rows: the 6 verified lines, then the 4 "Reselling portfolio — …" lines.

  None of these appears in that output: "Course provider", "Integration", "Unidentified", EV/DL/DV codes, "Decemeber", "recieving", the EV-201 item, or award images. No `__pycache__` was created.
- **Browser check:** the current built page, with its three proof blocks swapped for that output, was screenshotted in headless Chrome. The shots are in the session scratchpad: `proof-fix3/shots/v3-wall.png` and `v3-awards.png` at 1440×900, and `v3-wall-1024.png` at 1024×900.
  - All 29 logos load, and the wall is monochrome.
  - The 3 placards fill their row, and the 10 partner rows fill the 2-column list.
  - The short last row of the wall is noted in §1.
- **Not rebuilt:** the built page itself, because the page, its template and build.py belong to another worker. The next `python build.py m3` picks up v3.
