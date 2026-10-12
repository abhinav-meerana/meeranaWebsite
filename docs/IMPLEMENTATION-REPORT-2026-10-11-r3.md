# Implementation report: horizontal product stories and responsive landing (round 3)

Companion to [`r2/FINAL-SPEC.md`](r2/FINAL-SPEC.md), which is binding. Decisions are
DD-26a…g in [`DESIGN-DIRECTIONS.md`](DESIGN-DIRECTIONS.md) §7 and
[`../plan/05-conflict-decision-log.md`](../plan/05-conflict-decision-log.md) §I. The
motion ids are listed in [`../plan/08-scroll-animation-spec.md`](../plan/08-scroll-animation-spec.md),
"Round 3".

**Status: build phase.** The six owners (A–F, FINAL-SPEC §11) are still working in
parallel. Everything below was measured against the **dev server** (:3000), so
bundle sizes, timings, the export itself and `out/` checks are not covered yet.
Phase 2 (integration: delete the adapter, `Story.tsx`, `story.css` and
`BeatVisual.tsx`, run `npm run build`, run every check on :4173) replaces the
results section with build numbers.

## How to verify

All scripts run Playwright Chromium with a software GPU (`--use-angle=swiftshader`)
against `VERIFY_URL` (default `http://localhost:4173`, the static build). Each
check is filed under its FINAL-SPEC §12 id. A per-id summary and a JSON copy
(`docs/review/2026-10-11-r3/<script>-results.json`) are written at the end.
Screenshots go to `docs/review/2026-10-11-r3/<WxH>/`.

| Script | Covers | Typical run |
|---|---|---|
| `node scripts/verify-stage.mjs [--quick] [--full] [--slug s] [--vp WxH] [--only …]` | P-01…P-22: the product column of the §12.1 matrix, all 6 products | `--quick`: 3 stage viewports + 1 rail; all viewports by default; `--full` also runs the interaction checks at every stage viewport |
| `node scripts/verify-home.mjs` (alias `verify-landing.mjs`) | H-01…H-05, G-01…G-08, S-01…S-03, the §3.3 token table (T-3.3), homepage axe | every §12.1 row plus 1024×560 and 320×568 |
| `node scripts/verify-launch.mjs [--only …]` | Cross-route release gate: CSS lint, honesty over `out/`, links, sitemap, per-product OG (X-01), console, overflow, keyboard, reduced motion, menus, pin budget, GPU loading rules, axe | needs `out/` (build) |
| `node scripts/verify-css.mjs` | §3.1 `@media` value lint and "raw colours only in tokens.css" | one second, no browser |
| `node scripts/selftest-settle.mjs`, `node scripts/selftest-choreo.mjs` | A's unit tests for `lib/settle.ts` and `choreo.ts` (P-22 runs the second) | node only |

On the dev server set `VERIFY_URL=http://localhost:3000`. The scripts then
allow for on-demand compilation: the 1.5 s mode budget becomes 15 s, with the
real time noted, and P-18 is reported as not run.

## What F delivered

- **`/products/` index** (`app/products/page.tsx`, `.pi-*` in `app/pages.css`):
  - the H1, the register-checked lede, and an in-page strip of the six products (from 1024 px);
  - six ruled rows that alternate the screen side, each with accent tick, index, name, descriptor, gallery line, Deploys (when the register has it), a real screen (eager for the first two), "Explore {name} →" and "Request a briefing";
  - an `ItemList` JSON-LD with names and URLs only.
  - It is listed in `app/sitemap.ts`; `/contact/` and the header link to it.
  - Every line of copy comes from `content/showcase.ts`. The heading is PROVISIONAL (marked in code).
- **Per-product Open Graph cards:** `app/products/[slug]/og.png/route.tsx` renders `out/products/<slug>/og.png`, 1200×630, from verified material only. `lib/seo.ts` `pageMeta` selects the card from the path and keeps the `image?: string | false` override. See DD-26g for why this replaces the spec's `opengraph-image.tsx`. It was checked with a throwaway static export under Next 16.4: `out/p/<slug>/og.png` is written as a PNG, and the page's `og:image` points at it.
- **Company page (phase-2 item, done early):** a poster-first player for the Dubai Chambers feature (EV-022). Nothing is requested from YouTube until the poster is pressed. It then loads the `youtube-nocookie.com` player with no autoplay and moves focus into it. The poster is drawn in CSS (no thumbnail, no faces). Without JavaScript the caption's link still works.
- **Narrow pages** (contact, privacy, 404) now sit on the container's left edge, under the logo, instead of in a centred box.
- **Verification:**
  - `verify-stage.mjs` and `verify-home.mjs` are new; `verify-lib.mjs` is the shared harness with the §3.3 and §12.1 tables; `verify-css.mjs` is the lint.
  - `verify-launch.mjs` is rewritten for the new structure: the "1280×720 rail = PASS" assertion is gone; the pin is asserted at 1093×529, 1280×601, 1366×657, 1536×730 and 1920×937; product pages are checked against P-02; the homepage keeps ≤ 300vh and ≤ 8.5 screens at 1440×900; OG cards must be 1200×630 and served as `image/png`; route screenshots are saved.
  - `verify-story.mjs`, `verify-page1.mjs`, `verify-pages.mjs` and `verify-showcase.mjs` are retired (copies in `.backup/2026-10-11-r3/scripts/`).
- **Docs:** DD-26a…g, the plan/08 pointer and this report.

## Results on the dev server (build phase, 2026-10-12)

Raw logs are in [`review/2026-10-11-r3/dev-runs/`](review/2026-10-11-r3/dev-runs/) and screenshots in `review/2026-10-11-r3/<WxH>/`.

The machine was shared with five other owners' browsers and dev compiles during these runs:
- Scrubs were often still moving 1–5 s after a scroll.
- One browser crashed for lack of memory.
- Interaction windows ran at 3× (printed in every summary).

Every interaction failure listed as "not reproduced" below was re-run alone and behaved correctly. The build run in phase 2 is the real measurement.

**Homepage (`verify-home.mjs`; 1024×520, 1366×657, 1920×937, 390×844, 1366×657 reduced)**

| Ids | Result |
|---|---|
| T-3.3 (§3.3 tokens, rendered header = `--header-h`) | pass at every viewport run |
| H-01, H-02, H-04 | pass (H1 three lines at the §3.3 size; S-tier hero = innerHeight; CTA above the fold; scrim = `--surface-page`) |
| H-03 | pass at 1024×520 and 1366×657. **Fail at 1920×937, but the spec table is at fault:** the measured column left (1069) equals the §7.2 formula with `--content-max` 1382 px (316.8 + 684.8 + 67.2), while the §7.4 table says 1020. The 2560 row agrees with the formula. |
| H-05 | pass: no three.js below the gate; reduced motion gives `demand` and a still room. DPR ≤ 1.5 not measured on dev (no canvas within the wait). |
| G-01…G-08 | pass. G-03 at 1024×520 has the controls flush with the bottom edge (520.3 px), which is now within the 0.5 px tolerance. |
| S-01, S-02, S-03 | pass: one scenario shot per step; CTA on screen under the header; total pin 2.90 × innerHeight; footer ≤ 720 px at 390×844 |
| homepage axe | 0 serious or critical |

**Product pages (`verify-stage.mjs`)**

| Ids | Result |
|---|---|
| P-01, P-02 | pass for all 6 products at 1024×520, 1366×657 and 1920×937 (mode, `--ps-content-h` per §12.1, scene width, `.ps` height). On dev the mode settles in 1.6–8 s, so the 1.5 s build budget is unverified. The List view preference survives a reload (it takes about 7 s on dev). |
| P-03, P-19 | **Fail at 1920×937 by 1.1–1.4 px on every product:** the step is 655.9 px, so integer scroll positions leave the track up to 1.46 px off (request to A). At 1366×657, some scenes were still moving after the wait (load). |
| P-04 | pass except where a scene was still arriving (load) |
| P-05, P-06 | layer ratios and `matrix3d` entrance pass. The floor's monotonic check was a harness read of starved frames; it is now fixed to read only once the scrub has landed. |
| P-07, P-08, P-09, P-10, P-11 | yisbir at 1366×657 passes P-08, P-09 and P-10 (except back/forward) and lands the long jump. The other failures are "still moving" under load. Not reproduced alone: wheel 45/100 advances one scene, all eight keys move ±1 and are `preventDefault`ed, and back restores the scene. The cut exists, but its dip came at 0.9–1.9 s under load instead of ≤ 150 ms; re-measure on the build. |
| P-12, P-14, P-15, P-21, P-22 | pass |
| P-13 | **Fail:** the `usecases` scene is taller than 100svh at 390×844 on Mandoobee (940), Tasree3 (1026), Nazo (890) and Wasel (916) |
| P-16 | content-check passes and scene counts match §5.2. **Fail:** Yisbir ships the PREVIEW-only "Headcount attendance" item inside the page's RSC payload (it is not rendered, but it is in the HTML). |
| P-17 | one H1 per page; `.ps-body` contrast ≥ 4.5:1. **Fail:** axe color-contrast on `.boundary-caption` in Yisbir's list and static-rail views |
| P-18 | not run (dev) |
| P-20 | pass on Tasree3 and Yisbir at 1366×657. **Fail** on Mandoobee at 1024×520: `transform-origin` is written with changing values |

**Release gate (`verify-launch.mjs`, the groups that work without `out/`)**
- `lint` fails on `app/viz.css` `max-width: 359px`. No raw colour outside `tokens.css`.
- `links` pass: 21 internal links, all anchors (including `/products/`), sitemap with `/products/`, OG and canonical on every route, and 11 unique titles. Six unique `og.png` cards, each 1200×630, served as `image/png` (X-01).
- `external` pass: both Mandoobee store links and all press links resolve.
- `menus` pass.
- `honesty`, `console`, `overflow`, `keyboard`, `reduced`, `pin`, `gpu` and `axe` wait for the build.

**F's pages:** `/products/`, `/company/` and `/contact/` have 0 axe serious or critical issues at 1366×657 and 390×844, exactly one H1, and 40 visible, outlined Tab stops. There is no horizontal overflow on `/products/` at 390, 1024, 1366, 1920 and 2560 wide, or on `/company/` and `/contact/` at 390 and 1366 (and 1920 for contact). The video poster makes no YouTube request until it is pressed; after that, focus is inside the player.

## Not verified

- Anything that needs the build: bundle budgets and long tasks (P-18), honesty
  over `out/`, the exported OG files and their Content-Type on :4173, CLS, and
  link status codes on the static host.
- X-02 (manual): the client's 1366×768 Windows laptop in Edge and Chrome at 100%
  and 125% scaling, with a mouse wheel and a Precision touchpad, with "Animation
  effects" off, and NVDA.
- Facebook and LinkedIn previews of the OG cards. They need the public host.

## Requests to other owners (from these runs)

- **A:**
  - P-03/P-19 at 1920×937: make the step a whole number of pixels, or snap the track to `−i × clientWidth` when a scene settles. `clamp(480px, 70svh, 720px)` gives 655.9 px there, which leaves 1.1–1.4 px of the next scene in view.
  - P-20: set `transform-origin` once per element (in CSS, or a constant per hook class), not per tween.
  - P-16: pass only `visibleScenes()` output (no `status: "confirm"` items) from the server page to `ProductStage`, so PREVIEW-only text never reaches the RSC payload. B may prefer to do this in the adapter.
  - P-11: re-check the cut timing on the build.
- **B:**
  - `app/viz.css` `@media (max-width: 359px)` is outside the shared breakpoint set. Use 479 or 480, or drop the query.
  - `.boundary-caption` fails AA contrast in list and static rail.
  - The `usecases` scene must fit 100svh at 390×844 (§4.9 hides echo-only diagrams below 768 px).
- **C:** none for H-03 at 1024 and 1366. At 1920×937 the implementation follows §7.2. The lead should correct the §7.4 table row (column left 1069, not 1020) or the formula.
- **Lead:** the spec's `opengraph-image.tsx` was replaced by a `.png` route handler (DD-26g). Record `scripts/selftest-settle.mjs` and `selftest-choreo.mjs` under A in §11.
