---
name: landing-page
description: Section formula and copy rules for high-converting tech landing pages on meerana.ae and yisbir.com (and product pages such as Nazo, Tasree3, Mandoobee, Wasel). The formula is hero (positioning + dual CTA, with product demo UI as the hero visual), social proof band, feature sections that each lead with a metric or a checkable specific, verticals, then a final CTA. Copy rules are max 8-word headlines, 2-sentence cards, numbers over adjectives (verified numbers only), and British English. It also covers LCP-safe hero rules, CTA mapping and SEO metadata. Use it when planning, writing, wireframing, building or reviewing a landing page, homepage, product page, hero, section order, headline, CTA or page copy — including "make the homepage convert", "write the hero", "what sections do we need", "shorten this copy", or "add social proof".
---

# Landing page formula

## Purpose
A visitor should understand **what this is, whether it fits them, and what to do next** within one screen. Every section below answers one buyer question, using real product UI and verified facts.

## Relationship to project skills
| Topic | Authority |
|---|---|
| Section-by-section plan for meerana.ae (H1–H11), storyboards, CTA map | `meerana-narrative` + `plan/06`/`07`. **This skill's formula is the template; the plan is the instance.** |
| Every number, partner, award, capability | `meerana-evidence` (register ids; `ok-to-use` / `use-with-edit` only) |
| Visual system, components | `ui-system`; brand kit `modern-tech-company`; AI-specific rules `modern-ai-company` |
| Motion | `web-animations` (one signature; LCP-safe) |
| Final gate | `anti-generic-audit` → `meerana-a11y-responsive` |

## The formula (in order)
| # | Section | Buyer question | Must contain | Never |
|---|---|---|---|---|
| 1 | **Hero** | What is it, and is it for me? | • Eyebrow (a fact)<br>• H1 ≤ 8 words (positioning)<br>• Lede ≤ 2 sentences<br>• **Dual CTA:** self-serve ("Explore the products", "Try a sample search") + human ("Talk to Meerana", "Request a demo")<br>• **Product demo UI or the brand's own geometry as the visual**<br>• A product index or chips for direct access | Slogans; stock or abstract art; two filled buttons; centred layout; hidden LCP text |
| 2 | **Social proof band** | Who vouches for them? | Verified partners with relationship and year (museum placards for Meerana), verified awards, or deployment facts. Directly after the hero. | Unlabelled logo walls; client logos without permission; "trusted by" without evidence; ISO roundels |
| 3 | **Product demo** (if not already the hero visual) | Show me it working | One real task, step by step, with a provenance label | Dashboards full of KPIs; fake OS chrome |
| 4…n | **Feature sections** (2–4) | What does it do for my problem? | **Lead with a metric or a checkable specific** (`references/copy-rules.md`), then a ≤ 2-sentence explanation, then the UI moment where the feature is useful | Icon + title + blurb grids; adjectives as headlines |
| n+1 | **Verticals** | Does it work where I operate? | 3–4 named environments or buyers from evidence. Each gets one concrete scenario and a link. | Industry lists without substance |
| n+2 | **Deployment and trust** (enterprise/AI) | Where does my data live? Who controls it? | A per-product deployment fact table; governance features | Implied certifications |
| last | **Final CTA** | How do I start? | One clear next step that names the product: "Request a Tasree3 process discovery session". Form or contact route with `?interest=`. | "Get started today!" with no object |

**Section count:** a homepage runs to ≤ ~11 desktop viewports (`meerana-narrative`). A product page tells the full storyboard (`plan/07`).

## Copy rules (short form; full rules and rewrites in `references/copy-rules.md`)
1. **Headlines ≤ 8 words.** Display lines carry one idea. Positioning detail goes in the lede.
2. **Cards: two sentences, maximum.** Sentence 1 says what it does. Sentence 2 says what it changes for the user, or the proof.
3. **Numbers over adjectives**, but only numbers with an `EV-` id. With no registered metric, lead with a checkable specific:
   - a count of documented capabilities;
   - languages;
   - deployment modes;
   - modules.
4. **British English** (organisation, optimise, programme, centre, licence [n.], colour). Use Western digits on English pages; Arabic numerals per DL-L02.
5. Use **canonical names**: Tasree3, Mandoobee, Wasel/WASEL, Yisbir/YISBIR, Nazo/NAZO (pending DL-P08), and "Meerana" in running text.
6. No hype words (`references/copy-rules.md` §4). "AI-powered" at most once per page.
7. CTAs are verbs + objects: "Explore the products", "Request a demo", "Try a sample search", "Book a Wasel site assessment".

## LCP-safe hero rules
- The LCP element is the **H1 text** or a **poster image**. It is visible at first paint and never animated from opacity 0 or a mask.
- Product UI in the hero is **DOM** (crisp, accessible), or a poster `<img>` with `fetchPriority="high"`. In Next 16, `priority` is deprecated; use `preload` or `fetchPriority`.
- Canvas and WebGL mount **after first paint** over an identical poster. The box is reserved with `aspect-ratio`.
- The fonts are `next/font` (self-hosted, `display: swap`, size-adjusted fallback): Poppins, plus Almarai only where Arabic renders.
- Budget: mobile LCP ≤ 2.5 s; CLS ≤ 0.1.

## SEO and metadata (every landing page)
- `title` (template "%s | Meerana Technologies"), a 140–160 character `description`, canonical, Open Graph and Twitter image.
- `lang`/`dir`; `hreflang` once Arabic ships.
- JSON-LD: `Organization` on home (legal name per DL-C01); `SoftwareApplication` or `Product` on product pages, using **evidence-backed fields only**.
- `sitemap.ts`, `robots.ts`; real 404s; 301s from legacy routes (DL-T02).
- Snippets: `references/seo-metadata.md`.

## Workflow
1. Write the **question list** for the page: one question per section. Cut sections that have no question.
2. Pull facts from the register. Mark each copy line with its `EV-` id.
3. Wireframe with `references/section-formula.md`. Pick the hero archetype from `references/hero-patterns.md`.
4. Write copy with the rules. Run the 8-word and 2-sentence checks.
5. Build with `ui-system` components. One signature motion (`web-animations`).
6. Run `anti-generic-audit` (`--strict` for production). Then go through `references/qa-checklist.md`.

## Files
- `references/section-formula.md`: anatomy, variants, do/don't per section, with Meerana/YISBIR/Nazo examples.
- `references/copy-rules.md`: rules, the metric ladder, a British English list, banned words, and before/after rewrites from the live sites.
- `references/hero-patterns.md`: four hero archetypes with wireframes and LCP notes.
- `references/seo-metadata.md`: Next.js 16 Metadata API, JSON-LD, sitemap/robots, and the live-site fix list.
- `references/qa-checklist.md`: pre-review checks.
