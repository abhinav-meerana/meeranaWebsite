# Next steps (2026-10-13)

State at handover: the cinematic redesign and the round-2 changes (coded
product dashboards, no cursor lighting, the deep-blue fade, PillNav) are built
and verified on the production export. The details are in
[`IMPLEMENTATION-REPORT-2026-10-12-redesign.md`](IMPLEMENTATION-REPORT-2026-10-12-redesign.md),
with the round-2 section at the end.

Verification on the final build: `verify-redesign` passed 226/226 and
`verify-launch` passed 118/118 (axe included). Typecheck, CSS lint and the
content gate are clean. Raw output is in `review/2026-10-12-redesign/round2-*.txt`.

## 1. Review and merge

```bash
npm ci
npm run build      # content gate + static export to out/
npm start          # http://localhost:4173
npm run verify     # optional: the redesign acceptance suite (Playwright)
```

Review on desktop and on a phone. The homepage story, the platforms section,
and the Platforms panel in the desktop navigation carry the most change.

## 2. Decisions waiting on the owner

| # | Decision | Default in the build | Where to change it |
|---|---|---|---|
| 1 | **Wasel colours.** The 2026 brochure uses blue; the brand identity PDF gives Wasel brown, sand, copper and ivory, and says never cyan. | Brand PDF palette | Wasel primitives and `--dw-*` in `app/tokens.css` |
| 2 | **Showing reconstructions of real screens.** Nazo (from the supplied screenshot), Yisbir video indexing and both AI in a Box screens (from the demo recordings) are rebuilt in code and labelled "Interface reconstruction · sample data". | Shown, labelled | `content/dashboards.ts` |
| 3 | **Showing proposed designs.** Yisbir site operations (after the Figma) and the Wasel console (after the brochures) are labelled "Illustrative interface · sample data". | Shown, labelled | `content/dashboards.ts` |
| 4 | **EV-520**: the AI in a Box contract-review rows are still owner-pending in the evidence register. | No callouts | `plan/03-evidence-register.csv` |
| 5 | **PROVISIONAL copy**: the service summaries and the `/products/` heading. | Shown as drafted | `content/company.ts`, `content/showcase.ts` |
| 6 | Earlier open items (homepage length, short phones, a Tasree3 line). | Unchanged | `STATUS-2026-10-12.md` |

## 3. Assets that would upgrade the dashboards

- **Wasel**: real app or admin screen captures. These would turn the console from
  illustrative into a reconstruction.
- **Yisbir operations**: a capture of the shipping operations screen. For the same
  reason, it would turn the screen from illustrative into a reconstruction.
- **Mandoobee**: the manager web dashboard, so the homepage can show both the
  mobile app and the web surface.
- **Logos in vector form** (all current logos are white rasters; the Wasel logo
  is 308 × 308 px and is shown at 92 px).
- Written permission for any customer or partner logos (none are shown).

## 4. Engineering

- **Real-device performance check.** Every measurement so far ran in headless
  Chromium with software GL. Confirm frame rates on a mid-range laptop and a
  mid-range phone, especially the story's blurred layers and ColorBends.
- **The `external` link check** (`node scripts/verify-launch.mjs --only external`).
  It needs network access and was not run here.
- **Product pages (`/products/*`)** were not redesigned; they carry the new
  navigation and background. Their open settle-check items are in
  `STATUS-2026-10-12.md`. The coded dashboards (`DashboardFrame` with
  `content/demo-data.ts`) can be reused there.
- **Browser support for the dashboards.** The scaling uses CSS `zoom` with
  container units and `tan(atan2())` (Chrome/Edge 111+, Safari 15.4+, Firefox
  126+). Older browsers fall back to a fixed half-size scale.
- **Contact form.** Set `NEXT_PUBLIC_ENQUIRY_API` and `NEXT_PUBLIC_PRIVACY_URL`;
  until both are set, `/contact/` offers email.
- **CI.** There are no GitHub workflows yet. A minimal job would run
  `npm ci && npm run typecheck && npm run lint && npm run build`. The Playwright
  suites need a browser install and take 10–15 minutes under software GL.
- **ESLint** is not installed (Next 16 removed `next lint`); add a flat config if
  JavaScript linting is wanted.
- **Line endings.** The checkout uses `core.autocrlf=true`; a `.gitattributes`
  (`* text=auto eol=lf`) would make this independent of each machine.
- **Arabic / RTL** version: not started.

## 5. Deploy

`out/` is a complete static site after `npm run build`. Any static host works
(trailing-slash routes, e.g. `/products/nazo/`). Remove nothing from `public/`
without checking it: `output: "export"` publishes every file in it.
