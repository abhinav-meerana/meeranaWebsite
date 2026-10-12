# Reviewer B: brand, UX and mobile (enterprise / government lens)

## 1. Five-second test

**What a CIO sees.** A navy screen, a cluster of flat grey and cyan cubes, a slogan, and four 13 px tiles. After five seconds they still can't say what Meerana sells, who buys it or how it is deployed. The only clue is the small product names in the tray. The page reads like a 3D studio's showreel, not a vendor you would shortlist for a tender.

**Why it feels immature:**
- **The 3D looks like placeholder art.** The white and grey cubes are untextured and flat-shaded, so they look like default primitives. The same voxels stand in for smoke, people, gates and warehouses, so none of it is recognisable (d02b, d12).
- **Nothing has rank.** Nav, counters, tags, capabilities, tabs and buttons are all the same rounded pill. Every card has the same radius and the same fill.
- **The type reads like a code editor.** Display text is Poppins Light. About a dozen uppercase labels per screen are set in the system mono, which renders as Consolas on Windows.
- **Back-office notes are on the public page:** "DL-P13", "name DV-03", "scope under review", "pending", "Tasree3 v4 film".
- **The page has voids and breaks.** Some full viewports hold a single 8-word card. Mobile has 200–400 px of empty navy per section. The layout breaks at 1024 px.
- **There is no proof at all,** even though verified awards and partnerships exist in the evidence register.

## 2. Findings

| ID | Shots | Area | Sev | Problem | Exact fix |
|---|---|---|---|---|---|
| B01 | d01 t01 m01 | Hero | P0 | Only a slogan: nothing says what Meerana makes, for whom, or how it is deployed. | Add a lede of at most 22 words under the H1. Proposed, check against evidence: "Meerana Technologies builds AI, automation, IoT and video-intelligence products, deployed on-premise or in your cloud." Cut "25.1876°N… Fig. 1… Replay". Eyebrow becomes "Meerana Technologies · Dubai". |
| B02 | d01 d02 d02b d19 | Scene | P0 | The moment visuals don't read: AI is a striped slab, Automation is orange blocks. | Keep the lattice only as the hero backdrop: one material (dark metal with cyan emissive edges) and no flat white cubes. Each moment shows a framed crop of real UI: AI in a Box clause flag, Tasree3 BPMN, a Yisbir detection, and the Wasel drawing labelled "Illustration". |
| B03 | t01 d19-t3 | Moments tray | P0 | At 1024 px "Automation" overprints "IoT" and captions wrap to 4 lines. Two progress bars are lit at once. | Below 1280 px use a 2×2 grid; above it, 4 columns of at least 150 px. One-line captions. Only one active state; autoplay runs once, then stops. |
| B04 | d04–d09 | Gallery labels | P0 | Internal notes are public: DL-P13, DV-01/03, "v4 film", "Yisbir Figma", "scope under review", "pending", "to be confirmed". | Delete every "Source ·" caption and every decision ID. Allowed labels: "Product screen", "Design concept · sample data", "Illustration". If a fact is unknown, leave the line out. |
| B05 | d03 | Mandoobee | P0 | The "Real app UI" badge contradicts the "app mock-up" caption. | Label it "App mock-up", or replace it with real captures. |
| B06 | d07 d08 | Wasel, Asset Tracking | P0 | Cube drawings plus "pending" read as vapourware. Asset Tracking has no logo. PRODUCT-SCOPE-2026-10-10 excludes it (DL-P05), but the reviewer lists it. | The owner decides. Until then, drop Asset Tracking. For Wasel, use a line drawing of the controller in the same frame style as the screens, captioned "Illustration", with no status text. |
| B07 | all, d10 | Trust / offices | P0 | There is no proof, though the register holds ok-to-use items: Future 100 (2023) and Best small enterprise in the UAE (2024) (DL-R01). Partners Software AG, FPT Software, Commvault, CyberHive and Botminds are verified (DL-R02). Founder Eng. Matar Al Mehairi is verified (EV-013). The live office clocks are decoration. | In "Built in the UAE", add text-only placards giving issuer, year and relationship type. No logos until permission is given, no ISO (no evidence), no counts. Remove the clocks; use one line: "Dubai (HQ) · London · Egypt · Chennai" plus the legal entity. Add a one-line proof strip at the foot of the hero. |
| B08 | t02 | Tablet gallery | P0 | At 1024×768 the pinned card overflows: the deployment line and the CTA are cut off, and the screenshot spills out. | Pin only at 1280 px wide and 760 px tall or more. From 768 to 1279 px, use a native snap rail with a 45/55 two-column card at auto height. |
| B09 | t03 | Tablet story | P0 | The column is `min(28rem, 50vw−330px)`, about 182 px, so the heading sets one word per line. | Side-by-side layout only at 1280 px and up. Below that, put the poster above the card, with the card at most 560 px wide. |
| B10 | m04–m07, d10–d16 | Mobile layout, island | P0 | The fixed stage takes the top 44% and sections are padded 46svh, which leaves voids. The previous card covers the map (the "Headquarters" label is hidden), and text runs under the island. | Below 1024 px, drop the fixed stage. Place each poster inline in the flow (aspect-ratio 4/3, max 38svh) above its card. Remove `min-height:100svh` and the padding-top; space sections 64 px apart. Add a 96 px scroll-margin and fade content under the island. |
| B11 | d03–d09 | Card hierarchy | P1 | There are no scannable facts. The Tasree3 line is a slogan. About 130 px is dead space (d04). The static capability pills look like the clickable tabs. | One fixed template: logo + category → one outcome sentence (at most 18 words) → 3 capabilities as a hairline-bullet list (not pills) → a spec strip "Deploys · Languages · Works with", filled from evidence only → one CTA. |
| B12 | d03–d09 | Wayfinding | P1 | Four position indicators (island, chip row, "01/07" pill, card "01/07"). The "→" separators suggest a pipeline. | Keep the chip row (as tabs) and the arrow buttons. Delete the card-level index and the product name in the island. Replace the arrows with spacing. |
| B13 | d03–d09 | Product CTAs | P1 | Seven different verbs, all of them mailto links. | Use one pattern: "Request a [Product] briefing", opening the form with that product preselected. |
| B14 | m02 m03 | Mobile cards | P1 | The screenshot comes first and the logo about 450 px later. The Yisbir board is illegible at 300 px. Tabs wrap to two rows. | Order: logo → line → screen → capabilities → CTA. Use mobile-specific 4:3 crops (one Yisbir tile). Tabs in a single scrolling row. |
| B15 | m01 | Mobile hero | P1 | The eyebrow breaks into 3 columns with orphan dots. No CTA above the fold. The island shows "01 ·". | Eyebrow on one line (`nowrap`). Scene at most 28svh. Order: H1 → lede → primary CTA → 2×2 moments. Island: 18 px logo plus menu only. |
| B16 | m08 | Mobile menu | P1 | The sheet drops from the top, out of thumb reach. It has four anchors and no products, language or strong CTA. The "II" pause icon beside the hamburger reads as a second menu. | Full-height sheet: a 2-column product grid, Company, How it works, an EN/عربي switch, the labelled pause toggle, and a primary CTA in the bottom 25%. Close button (X), Esc and a focus trap. |
| B17 | d11–d16 | Story pacing | P1 | About 5.3 viewports for about 70 words; the intro takes a whole screen. Each step carries 3 labels (eyebrow, numeral, rail) and 2 "sample" marks. | Merge the intro into step 1. One pinned section of 5 × 50vh. Keep the numeral, the title and the rail. Show "Sample scenario · illustrative data" once for the section; keep "Sample data" only on the table. |
| B18 | d14 | Story claim | P2 | "Automation acts" names no product but implies an integration. | Name Tasree3 only if the Yisbir → Tasree3 integration is evidenced; otherwise call it Yisbir alerting. |
| B19 | d17 m07 | Final CTA | P1 | Both buttons open the same mailto. On mobile the buttons sit below the fold. | Primary: a 5-field form (name, organisation, work email, product interest, message) plus consent. Secondary: a text link, "or email info@meerana.ae". Drop the cubes on mobile. |
| B20 | d18 | Footer | P1 | One floating line, including "Prototype M3 · internal". | An anchored 4-column footer: Products (6), Company, Contact, Legal (Privacy, Terms, Cookies, Accessibility). Add the entity and address, an EN/AR switch and ©. |
| B21 | all | Copy density, type | P1 | 10–14 uppercase mono strings per screen. Poppins 300 is thin on navy. | At most 2 mono items per viewport. Deployment lines in 14 px sans. At most 3 scene chips at once. Load Plex Mono or drop it. H1 and display text at weight 400. |
| B22 | all | Accessibility | P1 | Honesty labels are 11 px uppercase (`.tag`, `.chip`). The product index is hidden below 768 px. The pause icon has no visible label. Focus inside the clip-path island is untested. | Labels at least 13 px, sentence case. Keep a visible 6-logo index strip on mobile. Show "Pause motion" as text at 1280 px and up. Test focus on the island, gallery and lightbox. |
| B23 | d01 d03 | Taxonomy | P2 | The four moments and the product sequence don't connect. EV-473 marks "Meerana Intelligence Layer" as do-not-use. | Keep the reviewer's order, but tag each card with its moment and make the tiles jump to their cards. The owner signs off the heading as a new phrase, never as a product name. |

## 3. Ideal page outline

The target is about 10 viewports, down from about 17 today.

1. **Hero, 1 viewport.** H1, lede, two CTAs, moments as tiles that link to products, a text proof strip.
2. **Meerana Intelligence Layer, about 4 viewports.** About 55vh of scroll per card.
3. **Story, about 3 viewports.**
4. **Built in the UAE, about 1.2 viewports.** Offices, entity, founder, awards, partners, deployment options.
5. **CTA, 1 viewport.** Form plus email.
6. **Footer, 0.5 viewport.**

Moving the story ahead of "Built in the UAE" changes the reviewer's order, so the reviewer needs to confirm it.

## 4. Mobile notes

- **Breakpoints:** under 768 px one column; 768–1279 px stacked with no pinning; 1280 px and up pinned desktop.
- **No fixed stage below 1024 px.** Posters sit inline, with no 100svh sections.
- **First screen:** H1, lede and primary CTA within 600 px.
- **Product rail:** logo first, a sticky strip of logo chips, and paddle buttons within thumb reach.
- **Story:** about 1.5 screens at most.
- **Sticky bottom bar:** "Request a briefing".
- **Menu:** full-height sheet with a close button (X).
- **Legibility:** at least 14 px for card text and 13 px for labels; no uppercase mono for honesty labels.
- **Lightbox:** full screen; single-tile Yisbir crops.
