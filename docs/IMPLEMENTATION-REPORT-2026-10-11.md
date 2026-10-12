# Implementation report: audit to build, 2026-10-11

Companion to [`AUDIT-IMPLEMENTATION-PROMPT-2026-10-11.md`](AUDIT-IMPLEMENTATION-PROMPT-2026-10-11.md).
Everything below was measured against the built static export (`npm run build`,
served by `npm start` on :4173) in headless Chromium with a software GPU, unless
it says otherwise. Raw output is in [`review/2026-10-11/`](review/2026-10-11/).

## Verdict in one paragraph

The build now matches the audit's quality bar on honesty, navigation,
accessibility, motion budgets and performance, and the checks that prove it are
automated (`node scripts/verify-launch.mjs`). It is **not** finished as a launch
site: the enquiry form cannot go live, the logo is still a raster, three pages
carry provisional copy the owner has to approve, and the visual direction is only
partly delivered (see "Not done"). Nothing was verified on a real device, with a
screen reader, or on the production host.

## What changed

**Honesty (P0)**
- The prototype footer, the "retrieved 2 October" line and every "to be confirmed"
  string are gone. AI in a Box has no Deploys row (the field is omitted, not
  flagged), and its value beat no longer says "being confirmed".
- The stats counter (6 / 4 / 32) and `CountUp` are removed.
- The six mislabelled "Product screen · demo data" beats are now "Illustrative
  diagram…". `Provenance` is a typed union, so a mislabel fails `tsc`.
- `BeatVisual` draws only data carried by its beat. The fallback labels that put
  Nazo's vocabulary on Yisbir's pages are deleted.
- Client and government logos, the demo videos, the AI-generated plates and every
  unreferenced screenshot left `public/` (to `media-src/held/`, with a README).
  `public/` is 1.1 MB, down from 5.8 MB.

**Journey**
- `/contact/` exists and every enquiry button lands on it with `?interest=` set.
  `/company/`, `/services/`, a branded 404, `/privacy/` (noindex shell, unlinked),
  a shared footer, sitemap, robots, favicon, apple icon, Open Graph image and
  Organization JSON-LD (verified fields only).
- Header: the official symbol replaces the gradient square; "Products" opens a
  router panel on desktop (arrow keys, Escape returns focus); the mobile sheet
  traps focus and returns it, and `aria-controls` resolves while it is closed.
- All six products are reachable in two interactions from any page.

**Homepage**
- H1 is static and never animates. The lede, moments and buttons settle once with
  CSS (opacity and an 8px lift); none of it runs under reduced motion.
- Gallery: pins at ≥1280×760 for exactly 2.5 × the viewport; one wheel notch moves
  one card; the dimmed neighbours are `inert`; previous/next buttons and a live
  counter work in both modes; below that, or under reduced motion, a native snap
  rail. Every card links to its product page and to `/contact/?interest=`.
- 3D room: right-hand side only, so it cannot overlap the copy; six panels instead
  of eight; stops rendering off-screen; not requested at all below 1280px, with
  Save-Data, or with ≤4 GB device memory. Those get one real screen (71 KB).
- "How it works": one connected sequence with a sticky screen column and the three
  real Yisbir screens; inline screens on mobile. "World" merges the partner lists.
- Page length: 8.7 viewports at 1440×900 (was 13.7).

**Product pages**: the visual sits in its own columns (never under the copy, no
scrim), only the active visual is visible, real screens in the hero and the
interface beats, per-product closing lines, `lang="ar" dir="rtl"` on the Arabic
names, a keyboard-navigable chapter rail, and GSAP is not downloaded below 1024px.

**Engineering**: `source(none)` for Tailwind (global CSS 172 KB → 31 KB raw, 12 KB
gzip total); `motion`, `ogl`, `@gsap/react` and 16 React Bits components removed;
`next.config.ts` inlines CSS; `scripts/postexport-rsc.mjs` fixes the RSC prefetch
404s (see "Findings worth knowing").

## Measured

| Check | Result |
|---|---|
| `verify-launch.mjs` (final build) | **70 of 70 checks pass**: honesty grep, 20 internal links, console, 7 widths, keyboard, reduced motion, menus, pin budget, wheel/next, 3D gating, axe (`review/2026-10-11/verify-launch-output.txt`) |
| Enquiry form, against a mock API | client validation and focus, 202 success, 422 field error, 503 email fallback, honeypot hidden, payload matches plan/11 §15 (idempotency key, `elapsed_ms` ≥ 3000, consent, source, UTM). The privacy link was not verified: my shell rewrote the test URL. |
| Lighthouse, mobile preset, `/` | Performance 94, Accessibility 100, Best Practices 100, SEO 100; CLS 0.003; TBT 70 ms; LCP 2.2–3.0 s over three runs |
| Lighthouse, mobile, `/products/yisbir/` | 95 / 100 / 100 / 100; CLS 0; LCP 2.7 s |
| Lighthouse, mobile, `/contact/` | 90 / 100 / 100 / 100; CLS 0; LCP 2.6 s |
| Homepage JS, gzip | 154 KB (budget 180) |
| 3D chunk, gzip | 243 KB (budget 250) |
| axe (WCAG 2.2 A/AA), 10 routes × 2 widths | 0 serious or critical |
| Console errors, 11 routes × 3 widths | 0 |
| Horizontal overflow, 7 widths 320–1920 | none |

**LCP is the open number.** Lighthouse's simulated mobile LCP varies 2.2–3.0 s
between runs of the same build (the observed LCP in each run was under 0.3 s on
localhost). The budget is ≤2.5 s. It needs a run against the real host before it
can be called met or missed.

## Findings worth knowing

1. **`scroll-behavior: smooth` fights ScrollTrigger.** With it on, snapping and
   programmatic moves walked the page to the end of the pin while tabbing through
   the gallery. It is removed globally. ScrollTrigger's own `snap` had the same
   effect with focus jumps, so settling is done in `Showcase.tsx` instead.
2. **The RSC prefetch 404s are a Windows export quirk (observed, not proven).**
   `next build` on Windows 11 wrote `__next.services/__PAGE__.txt`; the client
   requests `__next.services.__PAGE__.txt`. `postexport-rsc.mjs` flattens them. On
   a Linux build it should find nothing to do. Verify on the real host.
3. **A `clip-path` animation on a gradient layer cost the product page 8.7 s of
   Lighthouse TBT** (software raster, 4× CPU). It is now opacity and transform
   only.
4. **Dimming text fails contrast.** Inactive gallery cards (opacity 0.35) and
   scenario steps (0.45) failed axe. Cards are now `inert`; steps are not dimmed.
5. **A page-level `openGraph` object drops the file-convention image.** `pageMeta()`
   sets it explicitly.
6. **`useSearchParams` in a static export** needs Suspense and left a gap the
   contact panel popped into (CLS 0.204). The query string is read after mount.
7. **GSAP's ticker keeps a frame loop running while idle** (about 60 callbacks a
   second on the homepage, measured). It is not the 3D loop, which stops (0 frames
   after scrolling past the hero), but it is a small constant main-thread cost.
8. **Mandoobee's azure measures 4.48:1** as 12px text. Small accent text mixes in
   20% white (`.accent-text`).

## Provisional copy (needs owner approval)

Marked `PROVISIONAL` in code.
- `/contact/` lede: "Tell us what you want to see. We'll reply from info@meerana.ae."
- `/company/` lede, composed from the founding year, the six-product scope and
  the brand line.
- `/services/`: the H1, lede and the four one-line summaries (the capability lists
  are from the register, EV-030/031/032/033).
- Product-page closing lines: "See Yisbir on your own cameras.", "…Wasel on your
  own gates.", "…AI in a Box on your own documents.", "…Nazo on your own
  correspondence.", "…Mandoobee with your own team." (Tasree3's is unchanged.)
- AI in a Box value-beat body: "A person decides, and every step leaves a trace."
  (replaced an internal note).
- Sample data in diagrams, labelled "Illustrative diagram · sample data": the
  Yisbir search results, the Wasel gate list, the Nazo "version approved/signed:
  unknown" contrast.
- Company events: the Dubai Business Forum USA note paraphrases EV-512.

## Not done, and why

- **No git, no CI.** `git init` needs the owner's approval. A snapshot is at
  `.backup/pre-audit-impl-2026-10-11.tgz` (git-ignored).
- **The visual direction is partly delivered.** The lattice field, the annotation
  voice, solid cards and the real symbol are in. Not done: redrawing the diagrams
  in the isometric line language (they are restyled, not redrawn); re-skinning the
  3D floor as the lattice (it is still `gridHelper`); the lattice stroke-draw on the
  homepage (the signature motion is a fade-and-settle on product-page heroes);
  composition variants per product beyond a different media slot.
- **Not built (P2/P3 or "wait"):** `/products/` index, Dynamic Island, route
  transitions, per-product Open Graph images, a fifth hero moment (the header
  router and gallery links already reach all six).
- **Deviations:** per-panel skip links became one gallery skip link, because
  dimmed cards are inert; "All six products" links to `/#products`; the lattice
  path in "How it works" is vertical.
- **Open token decision:** DD-14's `#1B2D46` raised surface vs the current
  `--navy-900`. Left as is; recorded in `tokens.css`.
- **The H1 weight** (Poppins 300 per JUDGE §3g vs the heavier weight in the build)
  is untouched; it needs an owner ruling.
- **Not verified:** real devices, VoiceOver/NVDA, Safari/Firefox, the production
  host, compressed-transfer timings, the 3D room on a real GPU (all runs used a
  software renderer), the enquiry form against a real endpoint.

## Blocked on the owner or on assets

| Blocker | What it blocks |
|---|---|
| Enquiry API host, Turnstile decision, retention and privacy text (DL-T04/05/06) | The form. It is built and flag-gated; the email fallback ships. The server `interest` enum must add `nazo`, `ai-in-a-box` and `partnership` (JUDGE J7). |
| Vector logo masters (DL-B02/B03) | A proper header lockup, favicon and Open Graph art. The current marks are the official white raster, cropped, never recoloured. |
| Written logo permissions, partner relationship confirmations | Any partner or client logo. SAS, Sprinklr and Zing HR were dropped (not partnerships); Kofax, AgilePoint, Confluent and SAP show only in a preview build, flagged "Unconfirmed". |
| Native-resolution captures (Mandoobee, Tasree3 without IP markings, Wasel app and controller) | Replacing the cut-out and the illustration. |
| AI in a Box: public name, deployment options, live features (DV-01, DL-P13/14) | Its Deploys row. |
| Service descriptions, company mission, leadership consent, verified socials | Fuller `/services/` and `/company/`. |
| Award certificates | The Emirates Labour Market Award is shown on the owner's "bring everything from meerana.ae" instruction, but EV-200 says use only after the certificate is seen. |
| London office sign-off | The UK company was dissolved on 2025-11-25 (EV-502); London is shown on the owner's instruction. |
| Case studies | None exist, so none are shown. |
| Owner rulings: direction and sitemap approval, the 250vh pin, "Intelligence Layer" (EV-473 says do-not-use), section order | Final sign-off. |

## Housekeeping

- The static server on :4173 stopped during the session (not by anything I ran
  deliberately); I restarted it with `npx serve out -l 4173`.
- A `next dev` server on :3000 (not mine) was already running and was left alone.
- `docs/review/2026-10-11/` holds before/after screenshots (11 routes × 3 widths),
  three Lighthouse reports and the suite output.

## Release switches

`NEXT_PUBLIC_PREVIEW=1` (internal review build), `NEXT_PUBLIC_ENQUIRY_API` and
`NEXT_PUBLIC_PRIVACY_URL` (form on only when both are set). See `lib/flags.ts`.
