---
name: meerana-product-ui
description: Product interface and dashboard reconstruction for Meerana product demonstrations (Wasel app and admin, Mandoobee web/mobile, Tasree3 process views, Yisbir video analytics). Use whenever designing, building or reviewing any product screen, dashboard, mock UI, demo data set or interactive product walkthrough on the Meerana website — including requests to "add a dashboard", "make the screens look real", "show live data", or to reuse UI from Figma Make or concept boards.
---

# Meerana product UI demonstrations

## Purpose
Show how each product is used: real screens where they exist, faithful reconstructions where they are documented, and clearly labelled illustrative UI where nothing is available. The demos must never imply that a proposed interface is the shipping product, or that sample data is real operational data.

## When to use
- Any product screen or dashboard on the site.
- Demo data sets.
- Interactive walkthroughs.
- Reviewing visual "proof" panels.

## Required inputs
- The product dossier (`plan/04-product-dossiers.md`): verified capabilities and available interfaces.
- `plan/10-dashboard-ui-asset-spec.md`: screen specs and provenance register.
- Real screenshots or recordings supplied by Meerana, if any (status in `research/asset-inventory.csv`).
- Brand tokens (meerana-brand). For charts, also use the general `dataviz` skill.

## Provenance levels
Record one per screen and per widget.

| Level | Meaning | On-screen label |
|---|---|---|
| `real` | A permission-cleared screenshot or recording of the shipping product | None required (caption with product/version if useful) |
| `reconstructed` | Rebuilt in code from real screenshots or documentation; layout and fields match the source | "Interface reconstruction — simplified" |
| `illustrative` | Proposed UI expressing a documented capability; no source screen exists | "Illustrative interface · sample data" |

## Workflow
1. **Audit first.** List what exists for the product: store screenshots, product site imagery, cover banners, videos (e.g. `/assets/wasel.mp4` on meerana.ae), and Meerana-supplied captures. Note permission status.
2. **Choose the task, not the dashboard.** Each demo shows one meaningful task from the storyboard (beat 5), such as approving a leave request, opening a gate offline, finding a bottleneck, or searching footage. Design the minimum screens for that task.
3. **Write the screen spec**:
   - layout
   - navigation
   - widgets and controls
   - data entities
   - user action
   - state changes
   - the feature demonstrated
   - source or rationale
   - provenance level
4. **Model state explicitly.** Each demo is a small state machine (`idle → step1 → … → done`). Steps can be driven by scroll (through the chapter timeline) *and* by buttons (for keyboard and reduced motion).
5. **Synthetic data rules.**
   - **Non-identifying:** use role labels ("Visitor", "Site supervisor", "Finance approver"), generic site names ("Gate 2 — North entrance"), and dates relative to a fictional sample day. No real-sounding personal names, no real organisations, no Emirates ID or plate formats that could match real people.
   - **Purposeful:** every number exists because the task needs it, e.g. a queue count that makes the bottleneck visible. No decorative KPIs, uptime, latency, "nodes online", or growth percentages.
   - **Consistent:** one dataset per product in `content/demo-data/<product>.ts`, validated by schema and reused across the homepage and product pages.
6. **Build in DOM** (React components with semantic markup), not canvas.
   - Use product tokens for accents.
   - Use Poppins/Almarai for UI text, unless real screenshots show the product's own UI font.
   - Charts follow the `dataviz` skill.
7. **Label.** The provenance label is visible near the UI, not hidden in a tooltip. The demos section also has an explanatory note.

## Expected outputs
- Screen specs (UI-<product>-NN).
- The provenance register.
- React demo components with state machines.
- Demo data files.
- Asset requests for missing real screens.

## Quality checks / acceptance
- 100% of screens have a provenance level. Every `reconstructed` screen cites its source file. `illustrative` screens carry the on-screen label.
- No personal names, real customer names, live-looking telemetry, uptime/latency/SLA figures, or random filler numbers. Grep the demo data for such fields during review.
- Every demo is operable by keyboard (Tab/Enter/Space/arrow keys), announces step changes via an `aria-live="polite"` region, and works with reduced motion via step buttons.
- Screens render crisply at 1× and 2× DPR and adapt at 375 px. Mobile shows the phone variant or a focused crop, never an unreadable shrunken desktop.

## Project constraints
- The Figma Make v17 console panels contain invented data and are rejected, as is the PDF concept board UI with invented numbers. Examples: "Ahmed Al-Rashidi", "2,450 nodes", "99.97% uptime", "247 gates", "1,842 events/hour".
- Mandoobee: show the mobile app for employee tasks and the web dashboard for managers, if documentation confirms both surfaces.
- Yisbir: detection overlays must match documented detection classes only (e.g. helmet/vest/restricted zone, as documented). Don't invent classes such as face recognition.

## Failure modes and anti-patterns
- **Busy screens:** dense screens full of KPIs that demonstrate nothing.
- **Fake realism:** fake real-looking logs, names and timestamps that read as live operations.
- **Product confusion:** a reconstruction styled so closely that visitors assume it's a screenshot of a different version than the real product.
- **Untestable demos:** demos usable only by scrolling; inaccessible to keyboard or screen-reader users.
- **Images of UI:** screenshots of UI text as images without equivalent text (inaccessible and blurry).
