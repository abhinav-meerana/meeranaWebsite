# Enterprise benchmark: Meerana M3 homepage vs 10 enterprise IT sites

Captured 2026-10-10 in headless Chrome at 1440×900 and 390×844, into `ent/`, `ent-m/` and `ent-metrics/`.

**Blocked sites.** SAP, Salesforce and ServiceNow returned Akamai "Access Denied" to headless Chrome, and Oracle returned an error page. WebFetch got 403 from SAP, Oracle and ServiceNow.
- † = Wayback snapshot: Oracle 2026-10-08, ServiceNow 2026-10-07, SAP 2026-09-30. SAP rendered blank, so only its nav and footer text are available.
- ‡ = WebFetch only (Salesforce, EU locale).
- Palantir's hero rendered empty: its poster image redirects to `/404`, per the console.

**Metrics.** One run, indicative only. I did not click any cookie banner.

## 1. Each site in one line

1. **Microsoft:** retail-first. A Surface hero with consumer and business CTAs, then about 20 product bands. **Steal:** CTAs split by buyer type.
2. **IBM:** an event hero, product tiles with outcome numbers, and case-study cards (Skechers, trivago). It offered our UAE session its Arabic regional site. **Steal:** proof cards with a name, one fact and one link.
3. **Oracle†:** the first screen is a product picker (Infrastructure ×4, Applications ×4) under a full-width search bar. Panels say where each product runs, with a persistent "Chat now / Call US Sales" box. **Steal:** the grouped product picker.
4. **SAP†:** the hero is UNVERIFIED. The footer shows Trust Center, Trials and demos, a phone number and a full legal row. **Steal:** open the footer with "Contact us" and a phone number.
5. **Salesforce‡:** "Get started with the #1 Agentic CRM", one sentence, "Start for free / Watch demo", then logos, stats, analysts and an FAQ. **Steal:** the closing "What is…?" FAQ.
6. **ServiceNow†:** "AI without workflows is just expensive advice", a paragraph, two CTAs and a product UI, then a logo bar, stat tiles and sticky Contact/Demo pills. **Steal:** the sticky Contact pill.
7. **Palantir:** "Sovereign AI Systems for Every Decision" over a video reel, then typographic product posters. On mobile, the nav sits in a bottom bar. **Steal:** the bottom thumb bar.
8. **Snowflake:** the textbook layout: claim, sentence, two CTAs and a real product UI. Customer numbers are footnoted "As of July 31, 2025". **Steal:** a dated footnote on every number.
9. **Databricks:** the same formula, with a logo bar right under the hero (Burberry, FDA, Heineken, Michelin) and a pause button on its animated UI. **Steal:** a proof bar touching the hero.
10. **NVIDIA:** a six-slide carousel with labelled progress tabs, then one band per industry. **Steal:** the tab anatomy (category, one-line title, progress bar) for our moments.

## 2. Comparison matrix (1 = poor, 5 = best in class; "–" = unverifiable)

| Dimension | MS | IBM | ORCL† | SAP† | CRM‡ | NOW† | PLTR | SNOW | DBX | NVDA | **MEE** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Five-second clarity | 3 | 3 | 4 | – | 5 | 4 | 3 | 4 | 5 | 3 | **2** |
| 2 Hero composition | 4 | 3 | 3 | – | – | 4 | 2 | 5 | 5 | 3 | **2** |
| 3 Navigation | 5 | 4 | 4 | 4 | – | 4 | 4 | 5 | 5 | 5 | **2** |
| 4 Product presentation | 4 | 4 | 4 | – | 4 | 4 | 4 | 4 | 5 | 4 | **3** |
| 5 Proof and trust | 3 | 5 | 4 | – | 5 | 5 | 4 | 5 | 5 | 4 | **1** |
| 6 Visual system | 4 | 5 | 4 | – | – | – | 4 | 4 | 4 | 4 | **2** |
| 7 Motion and 3D | 4 | 3 | 3 | – | – | – | 2 | 3 | 4 | 3 | **2** |
| 8 Density and length | 3 | 4 | 3 | – | 3 | 3 | 3 | 4 | 4 | 3 | **1** |
| 9 CTA and conversion | 5 | 4 | 5 | – | 5 | 5 | 3 | 5 | 5 | 4 | **2** |
| 10 Footer and legal | 5 | – | 4 | 5 | – | 5 | 5 | 4 | 4 | 5 | **1** |
| 11 Mobile | 4 | 3 | 3 | – | – | 4 | 3 | 4 | 5 | 3 | **2** |
| 12 Accessibility and performance | 4 | 3 | 4 | – | – | 4 | 2 | 3 | 4 | 4 | **3** |

Measured page length, in viewports: MS 6.6 · IBM 5.1 · PLTR 7.3 · SNOW 8.5 · DBX 7.0 · NVDA 9.7 · **Meerana 16.9**. Palantir transferred about 20 MB, and Snowflake's H1 is "CODE WORK". We get credit for skip links, reduced motion and a pause control. We lose it for 11 px mono labels and for loading the Tailwind browser runtime without `defer` (line 27).

## 3. Patterns they share that we lack

1. **The hero is one plain claim, one explanatory sentence, two CTAs and a real product UI** (DBX, SNOW, NOW, CRM).
2. **Proof sits directly under the hero:** a logo bar, stats or a customer list (DBX, NOW, Oracle "OCI Tech Customers").
3. **A utility cluster on the right of the nav:** search, a language or region globe, sign-in, Contact sales and a primary CTA (SNOW, DBX, NVDA, IBM, ORCL).
4. **Products are grouped into named categories** in both the nav and the first screen (Oracle Infrastructure/Applications; Palantir Sovereign AI → AIP, Foundry, Gotham).
5. **Each product gets a name, one outcome sentence and a link to its own page.** We have no product pages; every CTA is a `mailto:`.
6. **Trust is a named destination:** Trust Center (SNOW, SAP, PLTR), Security and Trust (DBX), Product Security (NVDA).
7. **A full legal footer:** Privacy, Terms, Cookie preferences, Accessibility, Sitemap, region and ©.
8. **One container of about 1,250–1,310 px** (Snowflake about 1252, Oracle about 1296, Databricks about 1312, measured from screenshots ±4 px).
9. **Pages run 5–10 viewports.**
10. **Motion shows the product and can be paused** (Databricks UI loop, IBM carousel).
11. **A persistent contact path:** sticky Contact/Demo (NOW), Chat/Call (ORCL), a phone number in the footer (SAP, DBX).
12. **A "What is X?" FAQ** near the end (CRM, DBX).

## 4. The 10 biggest gaps

1. **No proof anywhere. Severity P0.**
   - **Evidence:** d01–d18 show no award or partner. Compare `ent/databricks-hero.png` (logo bar under the hero) and `ent/servicenow-wayback-scroll.png`.
   - **Fix:** a proof strip right under the hero, as text placards with no logos.
     - Awards: "Future 100 · 2023 · [issuer]" and "Best small enterprise in the UAE · 2024 · [issuer]", with the issuers taken from the evidence register.
     - Partners: "Software AG · FPT Software · Commvault · CyberHive · Botminds · Dubai Chambers", each with its relationship type.
     - No counts.
2. **The hero says nothing and shows nothing. P0.**
   - **Evidence:** d01 pairs a slogan with coordinates, "Fig. 1" and abstract cubes. Compare `databricks-hero.png` and `snowflake-hero.png`.
   - **Fix:** H1 at most 8 words naming what we make and for whom, for example "AI products for government and enterprise". Add a lede of at most 25 words naming the product areas and deployment, checked against the evidence register. Show framed crops of real UI from Tasree3, Nazo and AI in a Box, labelled "Product screen". Push the lattice back or cut it.
3. **Conversion is `mailto:` with seven different verbs. P0.**
   - **Evidence:** prototype lines 981–1112 and 1202–1203. Compare the ServiceNow sticky pills, Oracle "Chat now" and Databricks "Contact Us".
   - **Fix:** one verb, "Request a briefing", opening a five-field form with the product preselected. Keep `info@meerana.ae` as a secondary text link, and pin a "Request a briefing" pill on screen.
4. **The nav is four anchor links. P0.**
   - **Evidence:** d01, compared with the `snowflake-hero.png` nav and the `oracle-wayback-hero.png` picker.
   - **Fix:** a Products panel in four groups (AI · Automation · IoT · Security), each product with one line, linking to product pages. The owner signs off the grouping and whether Asset Tracking stays. Then Company and Contact, a language switch, and "Request a briefing". Skip search until there are more than 20 pages.
5. **The footer has no legal links and shows "Prototype M3 · internal". P0.**
   - **Evidence:** d18, compared with the SAP, ServiceNow and NVIDIA footer text.
   - **Fix:** four columns: Products, Company, Contact (entity and address), and Legal (Privacy, Terms, Cookies, Accessibility). Add a language switch and "© 2026 Meerana Technologies LLC". The legal pages must exist before launch.
6. **Honesty labels contradict each other and expose internal IDs. P0.**
   - **Evidence:** d03 says "REAL APP UI" next to "app mock-up". d05 and d09 show "DV-03" and "DL-P13". Compare Snowflake's dated footnotes and ServiceNow's "See Disclaimers".
   - **Fix:** only three public labels: "Product screen", "Design concept · sample data" and "Illustration". Footnote any number with its source and date.
7. **No trust or deployment destination. P1.**
   - **Evidence:** our deployment lines are scattered across the cards. Compare the Trust Center links in the SNOW, SAP and PLTR footers.
   - **Fix:** a "Deployment & data" section: per-product on-premise/cloud/hybrid and language facts, reusing the evidence-tagged card lines. No ISO or SOC claims.
8. **The page is 16.9 viewports long, against 5–10. P1.**
   - **Evidence:** the `ent-metrics` run.
   - **Fix:** a budget of 8 viewports: hero 1, proof 0.3, products 2.5 (pin of at most 150vh, or a 2×3 grid), story 1.5, company 1, CTA and footer 1.
9. **No grid. P1.**
   - **Evidence:** d01–d17 have six different left edges, while competitors hold one container.
   - **Fix:** 1280 px max width, 12 columns, 80 px margins at 1440, 24 px gutters, 8 px spacing steps.
10. **Mobile has no CTA above the fold. P1.**
    - **Evidence:** m01 (the eyebrow breaks, and there is no CTA within 844 px) and m08 (the menu is a top sheet). Compare `ent-m/databricks-m.png` (two CTAs within 400 px) and `ent-m/palantir-m.png` (bottom bar).
    - **Fix:** H1, lede and primary CTA within 600 px, plus a bottom bar with Menu and "Request a briefing".

## 5. What not to copy

- **Scale stats** such as "85% of the Fortune 500" or "95B workflows". Never pad with counts.
- **Logo walls:** never show partner logos as if they were customers.
- **ServiceNow's mega menu** of about 60 headings. Ours is one panel of seven or fewer.
- **Event or carousel heroes** (IBM, NVIDIA, Microsoft). A new company must explain itself first.
- **Analyst badges and superlatives** such as "#1" or "the only platform".
- **Palantir's reel-only hero and 20 MB page.** When the reel fails, the hero is blank.
- **NVIDIA's full-screen cookie wall.** Make Reject as prominent as Accept.
- **Fake macOS window dots (Snowflake), personalised feeds (IBM) and homepage pricing (Oracle).**

## Sources

https://www.microsoft.com/en-us · https://www.ibm.com/us-en · https://www.oracle.com/ (blocked) and https://web.archive.org/web/20261008040523/https://www.oracle.com/ · https://www.sap.com/ (blocked) and https://web.archive.org/web/20260930095145/https://www.sap.com/index.html · https://www.salesforce.com/ (WebFetch) · https://www.servicenow.com/ (blocked) and https://web.archive.org/web/20261007230109/https://www.servicenow.com/ · https://www.palantir.com/ · https://www.snowflake.com/en/ · https://www.databricks.com/ · https://www.nvidia.com/en-us/
