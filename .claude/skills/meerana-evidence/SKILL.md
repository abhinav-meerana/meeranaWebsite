---
name: meerana-evidence
description: Research and evidence validation for every factual statement on the Meerana Technologies website. Use whenever writing, editing, reviewing or approving copy or data about Meerana — products (Wasel, Mandoobee, Tasree3, Yisbir, Nazo, Smart Tracking, AI in a Box, Green Hub, Remotioo), services, awards, ISO certifications, partners/clients, company figures, offices, events or photos — and whenever sources disagree or a new source appears. Maintains the evidence register and conflict log. Trigger even for small asks like "add the awards" or "describe Yisbir in one line".
---

# Meerana evidence & research

## Purpose
Every public claim on the site must trace to evidence of appropriate strength. Earlier drafts invented telemetry, customer names, uptime figures and award wordings. This skill makes each claim auditable, and makes conflicts explicit rather than silently resolved.

## When to use
- Before writing or changing any factual copy, number, logo relationship, award, certification or caption.
- When researching Meerana or a product.
- When two sources conflict.
- When preparing copy for sign-off.

## Required inputs
- `plan/03-evidence-register.csv`: the register. Check it before researching anything.
- `research/sources/*.md`: raw research extracts (live site, product web research, company research, tech verification).
- `plan/05-conflict-decision-log.md`.
- `research/asset-inventory.csv`, for photos and logos.

## Source tiers
Rank sources per claim type. Recency and specificity break ties.

| Claim type | Strongest → weakest |
|---|---|
| Visual identity | Brand PDF (visible layer) → decision log → nothing else |
| Product positioning and features | Current product-owned property (product site, store listing by Meerana's developer account, brochure) → brand PDF product page → www.meerana.ae → press |
| Awards | Issuer's own publication or registry → reputable press → Meerana channels → drafts |
| Certifications | Certification-body certificate or registry (entity, scope, number, validity) → nothing else. A badge image is not evidence. |
| Partners and clients | Partner-programme directory or joint press release → Meerana site wording ("partners & clients" is ambiguous) → logo strips (never sufficient for "customer" or "partner") |
| Company figures | Meerana-confirmed current figure with date → live site (undated: treat as a claim needing confirmation) |
| Events | Organiser programme or press → dated photos → folder names (unreliable, e.g. "Paris visit") |

**Never evidence:** Figma Make v17 and Dark Draft v2. They are previous drafts that contain invented content. They may *point to* a claim to check.

## Workflow
1. **Search the register.** If the claim has a row with a current `public_status`, reuse it.
2. **Locate sources.** Use existing extracts first. If new research is needed:
   - Use WebSearch/WebFetch or the built-in browser. Record any URL you couldn't fetch as `inaccessible`, never as `checked`.
   - Quote verbatim, with location (URL + section, page number, or bundle offset).
3. **Classify the item** as one of:
   - `verified-fact`: an independent or authoritative source confirms it.
   - `company-claim`: Meerana states it; there is no independent confirmation.
   - `interpretation`: our synthesis of evidence.
   - `proposed-copy`: new wording derived from evidence.
   - `illustrative`: demo/sample content, never presented as fact.
   - `unknown`: needs confirmation.
4. **Rate confidence:**
   - `high`: authoritative and current.
   - `medium`: official but undated or indirect.
   - `low`: weak or ambiguous.
   - `none`.
5. **Record conflicts.** Reference other register IDs. Add a decision-log entry with the options, a recommendation with reasoning, and the decision owner (usually Meerana marketing or a product owner).
6. **Set `public_status`:**
   - `ok-to-use`: evidence is sufficient; still subject to client sign-off.
   - `use-with-edit`: wording must change.
   - `confirm-with-meerana`.
   - `internal-only`.
   - `do-not-use`.
7. **Validate.** Run `python .claude/skills/meerana-evidence/scripts/check_register.py plan/03-evidence-register.csv`. Fix all errors before handing off.
8. **Link copy to evidence.** Content entries in the site's content files carry `evidence: ["EV-###"]`. The build check (meerana-frontend) fails if any public claim cites a row that is not `ok-to-use` or `use-with-edit`.

## Expected outputs
- New or updated register rows (CSV, UTF-8; schema in `references/register-schema.md`).
- Decision-log entries for conflicts.
- A short research note naming what was checked, what was inaccessible, and what remains unknown.

## Quality checks / acceptance
- 100% of public numbers, awards, certifications, partner/client labels and product capability statements map to register rows.
- No `company-claim` is phrased as independent fact. "Meerana states…" style is acceptable; marketing voice is fine if the claim is Meerana's own.
- Dates are absolute (YYYY-MM-DD). The access date is recorded for every web source.
- The script passes. No duplicate IDs. Every `conflicts` reference resolves.

## Project constraints
- Company entity strings vary ("Meerana Technologies", "Meerana Information Technology LLC", "Meerana information Technology LLC"). Keep each source's variant verbatim in the register. The legal entity for the footer and form privacy notice is a pending decision.
- Event photos: verify the event, date and caption. Exclude images with private data (business cards, handwritten lists). Never identify a person by name in a caption without consent and a source.
- Synthetic demo data is `illustrative` and must be labelled on screen (see meerana-product-ui).

## Failure modes and anti-patterns
- **Draft text as evidence:** reusing persuasive draft lines ("Gov-Ready", "99.97% uptime", "2,450 nodes") because they read well.
- **Silent resolution:** choosing the best-sounding of conflicting wordings without logging it.
- **Badges and logos as proof:** "ISO 27001 certified" from a badge JPEG, or "our partners" from a logo strip.
- **Relative or inferred dates:** "last year", or a date taken from a folder name.
- **Uncited paraphrase:** paraphrase that drifts in meaning (e.g. "construction site intelligence" vs "video indexing" for Yisbir) without a source.
- **Repeating research:** researching again what the register already holds.
