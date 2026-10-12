---
name: meerana-narrative
description: Product narrative, information architecture and conversion planning for the Meerana Technologies website. Use whenever planning or revising the sitemap, navigation, homepage section order, a product chapter or product page storyboard, headlines and body copy, CTAs, or deciding how deep to tell a product's story (homepage chapter vs dedicated page). Trigger for asks like "rewrite the hero", "add a section about services", "storyboard the Wasel page", "what should the CTA be", or "the homepage feels repetitive".
---

# Meerana narrative & IA

## Purpose
Explain what Meerana does, how each product works, who uses it and why it matters. Do it in an order a buyer can follow without animation. Avoid the earlier drafts' failure: repeated product cards, slogans with no information, and invented proof.

## When to use
- Sitemap and navigation changes.
- Homepage section plans.
- Product storyboards.
- Copywriting.
- CTA and contact routing.
- Choosing narrative depth.

## Required inputs
- `plan/04-product-dossiers.md`: the facts you are allowed to tell.
- `plan/03-evidence-register.csv`: public status of each claim.
- `plan/05-conflict-decision-log.md`: positioning decisions (e.g. Yisbir).
- `plan/06-sitemap-and-homepage-plan.md` and `plan/07-product-storyboards.md`: current plans.
- Brand voice rules below.

## Workflow
1. **Start from the visitor's question.** Every section answers one question, such as "What is Meerana?", "Which product fits my problem?", "Does it work where I operate?", "Can I trust them?" or "How do I talk to them?". If you can't write the question, cut the section.
2. **Write the section spec** with the template in `references/templates.md`:
   - purpose and question
   - headline/copy
   - evidence IDs
   - composition
   - interaction
   - CTA and destination
   - assets
   - desktop/mobile behaviour
3. **Product storyboards** follow the 8 beats as a starting point:
   1. operational problem
   2. affected user and environment
   3. product introduced in its own brand language
   4. representative interface
   5. a meaningful task walked through
   6. features shown at the moment they're useful
   7. resulting output or decision
   8. verified value, proof and a product-specific CTA

   Make products differ by **user, environment and workflow**, not by accent colour.
4. **Choose depth per product.**
   - Homepage chapter: ≤ 1 pinned beat, problem → one interface moment → link. This keeps the homepage under ~9–11 viewport heights on desktop.
   - Product page: the full storyboard.
   - Documentation decides the depth. Thinly documented products get a factual card on a "More solutions" page, not an invented story.
5. **Direct access.** The navigation and a persistent product index let a visitor reach any product in ≤ 2 interactions from any scroll position. Each chapter has an anchor and a real product URL.
6. **Read-without-motion test.** Disable JS and CSS animation. The page must still read top-to-bottom in a sensible order, and every claim must be visible as text.
7. **CTA mapping.** CTAs name the next step and the product:
   - "Request a Tasree3 process discovery session"
   - "Book a Wasel site assessment"
   They route to `/contact` with `?interest=<slug>`, which preselects the form field. There's a maximum of one primary CTA per section.

## Voice and copy rules
- **Tone:** plain, specific, confident, enterprise-appropriate. Prefer verbs and nouns from the workflow ("open the gate", "approve the leave request", "find the bottleneck", "search footage by vest colour") over abstractions ("synergy", "next-gen", "revolutionary", "sovereign intelligence").
- **Approved positioning:** use the approved one-liners from the dossiers verbatim. Changes go through meerana-evidence.
- **No invented metrics, customers, testimonials, uptime or response times.** Benefits without a source are phrased as capabilities ("lets managers see…"), not outcomes ("cuts costs 34%").
- **Arabic:** write copy so it can be translated (no puns, idioms or English-only wordplay in headlines). The Arabic version is transcreated by a qualified translator, not machine-generated for launch.
- **Spellings:** use the canonical spellings from the dossiers (Tasree3 with the numeral 3, Mandoobee, Wasel, Yisbir, MEERANA in the logo but "Meerana" in running text).

## Expected outputs
- Section specs and storyboards in the template format.
- Copy decks with evidence IDs.
- A CTA map.
- Notes on anything blocked by missing evidence.

## Quality checks / acceptance
- Each homepage section answers a distinct question. No product card set appears more than once without new information.
- Any product is reachable from the hero in one click and from any scroll position via the header.
- Every claim in copy has an evidence ID with an acceptable status.
- The read-without-motion test passes.
- Homepage desktop length is ≤ ~11 viewport heights, including pins. Mobile is ≤ ~16 screens.
- Every CTA names a concrete next step and has a working destination.

## Project constraints
- Lead products are Wasel, Mandoobee, Tasree3 and Yisbir, as shown in the brand PDF hexagon. Others appear according to their status in the dossiers.
- Services (consulting, bespoke development, staff augmentation/outsourcing, reselling, managed services) are told as *how Meerana delivers*. They are not competing heroes.
- Proof is limited to verified awards, verified certifications, approved partner wording and verified events.

## Failure modes and anti-patterns
- **"Futuristic control room" theatre:** telemetry, status LEDs and fake logs standing in for explanation.
- **Card repetition:** the same four product cards in the hero, ticker, tabs and grid (Figma Make v17 did this).
- **Slogan stacks:** headlines that could belong to any company ("We engineer intelligence for the real world").
- **Implied integrations:** stories showing data flowing between products when that integration isn't documented.
- **Unverified scale:** claims of government-wide adoption or a client list built from a logo strip.
- **Forced journeys:** visitors have to scroll the whole journey to reach contact or a product.
