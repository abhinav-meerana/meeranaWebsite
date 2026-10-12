# Homepage design benchmark: M3 against ten tech and AI sites

2026-10-10. Captures: `benchmarks/design/` (1440×900) and `benchmarks/design-m/` (390×844). Metrics come from a read-only DOM probe (H1 style, `scrollHeight`, `scrollWidth`, resource timing). No banners were clicked.

**Caveats:** OpenAI serves headless Chrome a Cloudflare challenge (`openai-hero.png`), so it was captured read-only in the in-app browser (`openai-*-pane.jpg`). G42's hero media was blank after 16 s and Scale's desktop video never painted; treat both hero scores as UNVERIFIED.

## 1. Strategy, and the one thing to steal

- **apple.com.** One product per full-bleed tile, two CTAs each. *Steal:* footnoted claims ("…in a wearable.¹").
- **stripe.com.** Dense and gridded, with real product UI everywhere. *Steal:* a logo band inside the first viewport (y≈690) and a *true* live figure ("Global GDP running on Stripe").
- **linear.app.** The app *is* the hero (full-width UI at y≈528). *Steal:* hairline isometric "FIG 0.1–0.3" drawings, our motif done static and monochrome.
- **vercel.com.** Monochrome, one shader, logos at the fold. *Steal:* the silent fallback ("Hero shader unavailable" logged; the static triangle still rendered).
- **openai.com.** The product is the hero (a live composer). *Steal:* a labelled sample query visitors can run.
- **anthropic.com.** Warm, editorial, 3.7 viewports long. *Steal:* mono only for metadata keys in ruled rows.
- **scale.com.** Enterprise and government proof: NVIDIA, Meta, DIU and CDAO (per WebFetch of https://scale.com). *Steal:* model output as the hero video (on mobile, annotated "SUV" boxes).
- **anduril.com.** Documentary video, product photography, navigation by domain (Sea, Land, Air). *Steal:* product tiles that are an image and a name.
- **g42.ai.** A slow, news-led corporate site (load 15.6 s, 3.9 MB). *Steal:* named programmes as proof (Malaffi, Hassantuk, per WebFetch of https://www.g42.ai).
- **cloudflare.com.** One claim, one CTA, proof straight after. *Steal:* switching 3D off on software GPUs (console: "3D Globe disabled due to software rendering").

## 2. Comparison matrix (1–5)

| Dimension | Apple | Stripe | Linear | Vercel | OpenAI | Anthropic | Scale | Anduril | G42 | Cloudflare | **Meerana** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Five-second clarity | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 2 | 5 | **2** |
| 2 Hero composition | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 2 | 4 | **3** |
| 3 Navigation | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 4 | 2 | 5 | **3** |
| 4 Product presentation | 5 | 5 | 5 | 4 | 5 | 3 | 3 | 5 | 2 | 3 | **3** |
| 5 Proof and trust | 3 | 5 | 3 | 5 | 3 | 3 | 5 | 2 | 4 | 5 | **1** |
| 6 Visual system | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 3 | 4 | **2** |
| 7 Motion and 3D | 4 | 4 | 4 | 4 | 3 | 3 | 3 | 4 | 2 | 4 | **3** |
| 8 Density, rhythm, length | 5 | 4 | 5 | 5 | 4 | 5 | 3 | 4 | 3 | 4 | **2** |
| 9 CTA and conversion | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 2 | 3 | 5 | **3** |
| 10 Footer | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 3 | 5 | **1** |
| 11 Mobile | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 4 | 2 | 5 | **3** |
| 12 Accessibility and performance | 4 | 3 | 5 | 4 | 3 | 5 | 2 | 2 | 1 | 3 | **3** |
| **Total /60** | 56 | 54 | 56 | 56 | 50 | 51 | 43 | 45 | 29 | 52 | **29** |

**Measured** (H1 px/weight/tracking; length in 900 px viewports):

| Site | H1 | Length |
|---|---|---|
| Apple | hidden H1 | 6.6 |
| Stripe | 48/300/−0.02em | 16.2 |
| Linear | 64/510/−0.022em | 11.1 |
| Vercel | 64/400/−0.06em | 5.9 |
| OpenAI | no H1 | 7.0 |
| Anthropic | 61/700/0 | 3.7 |
| Scale | probe found no H1 | ≈12.5 |
| Anduril | renders the literal "@[shortTitle]" | 5.8 |
| G42 | empty H1 | 12.1 |
| Cloudflare | 56/500/−0.025em | 7.8 |
| **Meerana** | **70.4/300/−0.035em** | **16.9** |

## 3. Craft details our page lacks

1. **Headline.** Benchmarks: 56–64 px, weight 400–510, tracking −0.02 to −0.03em, line-height 1.0. Ours, Poppins 300 at 70 px, blooms thin on navy. Use 64 px, 400, −0.03em.
2. **Subhead.** Linear, Vercel, Cloudflare and Anthropic put one sentence under the H1. We have none.
3. **Proof at the fold.** Stripe's logos sit at y≈690, Vercel's at y≈838. Ours appear nowhere.
4. **1 px rules, not filled slabs.** Stripe uses dashed column lines, Linear column rules, and Cloudflare bordered tiles with corner ticks. Ours are navy slabs with a 16–24 px radius, nested up to three deep.
5. **Mono for keys only.** Compare Anthropic's DATE/CATEGORY rows and Linear's grey ~11 px FIG labels. We have 59 uppercase text nodes.
6. **Type scale.** Use at most 7 sizes. We have 13 distinct computed sizes.
7. **Glass.** Use it on the nav only, or nowhere. We have 24 `backdrop-filter` elements, several over a live canvas.
8. **Large, crisp product UI.** Linear's hero UI is about 1,320 px wide. Our screens are about 617 px inside a card, and AI in a Box's UI text is about 5 px (d09).
9. **One accent, for interaction only.** Vercel and Linear are monochrome. Our cyan marks labels, links, tabs, dots, chips and active states.
10. **Sentence case.** Apple, Linear and Vercel use it everywhere except tiny keys. Our island reads "02 · MANDOOBEE" in mono caps.
11. **Footnote-style honesty.** Apple's ¹ beats our outlined "SAMPLE" pills. Use one caption line under the frame: "Sample data, illustrative scenario."
12. **Footer.** The norm is 4–6 columns, a 1 px top rule and a legal row. Ours is a floating one-line slab.
13. **No horizontal overflow.** Every benchmark's mobile `scrollWidth` equals the viewport; ours is **8,208 px at 1440** (the pinned track leaks). Add `overflow-x: clip` to `#products`.
14. **3D guard.** Keep our `failIfMajorPerformanceCaveat` probe, and make the poster match the live frame, as Vercel's fallback does.

## 4. The 10 biggest gaps

| # | Sev | Gap | Evidence: ours vs theirs | Exact fix (within the honesty rules) |
|---|---|---|---|---|
| 1 | P0 | No proof | A grep of the prototype finds no partner or award. Stripe, Vercel and Cloudflare show logos or a figure at or near the fold. | A "Partners" band under the hero: Software AG, FPT Software, Commvault, CyberHive, Botminds, Dubai Chambers (monochrome logos only with permission, UNVERIFIED; else text). Add "Future 100, 2023 · Best small enterprise in the UAE, 2024". Never "clients" or "trusted by". |
| 2 | P0 | Unclear in five seconds | "We engineer intelligence for the real world" names no buyer, market or product, and there is no subhead. Cloudflare and Linear state category and audience. | An H1 of ≤8 words naming category and buyer, e.g. "AI products for UAE enterprise and government", plus a subhead naming the products and on-premise or cloud deployment. |
| 3 | P0 | Product UI buried | Real screens sit at about 43% width in cards on a pinned sideways track, with mid-word crops (d05). Linear's and OpenAI's hero *is* the product. | Put one real screen in the hero, at least 1,100 px wide as a 2× crop: AI in a Box contract review, captioned "Demo recording". Show the products as a tile grid. |
| 4 | P0 | Too long | 16.9 viewports for six sections vs a benchmark median of 7.4; the sample story alone is about 5. | At most 9 viewports; the story becomes one scrubbed pin of 150vh or less. |
| 5 | P1 | Footer is a toast | d18 vs apple-, linear-, cloudflare-footer. | Full width; Products, Company, Contact, Legal columns plus an awards line. Link only pages that exist. |
| 6 | P1 | Visual noise | 13 sizes, 59 caps nodes, 24 glass elements, nested slabs. | A 64/40/28/20/16/14/12 scale. Mono at 12 px for keys only. Surfaces: 1 px rgba(255,255,255,.08) on #071B36, no gradient fills, one level of nesting. |
| 7 | P1 | Nav degrades after the hero | From d03 to d18 it shrinks to logo, spinner ring, chapter readout, "II" and hamburger. Apple, Linear, Vercel, OpenAI and Anthropic keep their links at 1.6 viewports; Cloudflare keeps logo plus CTA. | Freeze the contents: logo, Products (a menu listing every product), Offices, How it works, Contact, CTA. Replace the chapter readout with a 2 px progress line. |
| 8 | P1 | 3D outranks the copy | The white cubes are the brightest pixels in d01, and abstract voxels show no product. | See §5. |
| 9 | P1 | Weak CTA | "Talk to Meerana" appears three times; the final CTA has two buttons to the same `mailto:`. Vercel pairs "Deploy now" with "Talk to sales". | Primary "Book a briefing" to a contact route, secondary "See the products". Final CTA: one button plus the email as a text link. Keep the product-specific CTAs. |
| 10 | P1 | Mobile chrome | The eyebrow splits into three columns with a dangling "·" (m01); about 250 px of dead space precedes each story card (m05–m07); the menu is glass on glass (m08). Linear fits H1, subhead and product UI within 844 px. | Block eyebrow, `text-wrap: balance`, posters inline per step, solid menu sheet. |

## 5. Where our ambition helps or hurts

**3D scene: reduce and restyle.** Benchmarks that use the GPU confine it to one moment, subordinate to the copy: Vercel's hero triangle, Stripe's hero gradient, Cloudflare's globe section (literally its network, disabled on weak GPUs). Linear shows our isometric idea works as static hairline art. None runs a fixed full-page scene behind every section. Keep the isometric language, but run WebGL only in the hero and one scrubbed how-it-works sequence, and stop the loop elsewhere. Use edge-lit hairlines, nothing brighter than navy-200, one cyan element per frame.

**Island nav: restyle.** No benchmark swaps its links for a status readout; most keep a quiet persistent bar. Keep the pill as a signature, freeze its contents, and move Pause motion to a labelled control beside the scene.

**Horizontal gallery: cut the pin.** No benchmark pins a horizontal gallery on its homepage; Anduril, Apple and Stripe use grids or stacked tiles with expanders. Use a two-column tile grid opening the existing lightbox (keep it), or unpin the scroll-snap row already in the CSS.

**Keep:** skip links, `<main>`, reduced-motion handling, the Pause control and the honest labels. These beat Scale, Anduril (H1 renders "@[shortTitle]"), G42 (empty H1) and OpenAI (no H1). Keep the live office clocks too, our one genuinely live data; Stripe's counter shows that can look premium. Restyle them as a ruled table.
