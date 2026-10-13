# Meerana website

The Meerana Technologies website: a **Next.js 16 static export** that opens on a
cinematic, product-first story — real Meerana interfaces moving from blur to
focus as you scroll — and settles into an interactive six-platform universe,
then a full landing page. Six product story pages, company, services and
contact pages complete the site.

> **Status (2026-10-12): cinematic redesign.** The homepage, global background
> and navigation were rebuilt from the 2026-10-12 brief. The audit, checklist,
> technical risks and copy decisions are in
> [`docs/REDESIGN-PLAN-2026-10-12.md`](docs/REDESIGN-PLAN-2026-10-12.md); what was
> built, the verification results and the known limitations are in
> [`docs/IMPLEMENTATION-REPORT-2026-10-12-redesign.md`](docs/IMPLEMENTATION-REPORT-2026-10-12-redesign.md)
> (raw outputs: [`docs/review/2026-10-12-redesign/`](docs/review/2026-10-12-redesign/)).
> The product story pages are unchanged apart from the shared nav and
> background (their open items: [`docs/STATUS-2026-10-12.md`](docs/STATUS-2026-10-12.md)).
>
> **Round 2 (2026-10-13):** coded product dashboards (Nazo, Yisbir operations
> and video indexing, Wasel, AI in a Box assistant and analytics) replace
> screenshots in the story and the platform section; the background no longer
> reacts to the cursor and deepens to a dark Meerana-logo blue towards the
> bottom; the desktop nav is React Bits PillNav. Details and decisions: the
> "Round 2" section of the implementation report. Open decisions and what to
> do next: [`docs/NEXT-STEPS-2026-10-13.md`](docs/NEXT-STEPS-2026-10-13.md).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # content gate, static export -> out/, then the RSC payload fix
npm start          # serve out/ on http://localhost:4173 (no extra dependency)
npm run verify     # redesign acceptance checks against :4173 (Playwright)
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | `content:check`, then the production static export to `out/` |
| `npm start` | serves `out/` on :4173 with `scripts/serve-out.mjs` (zero dependencies; replaced `npx serve`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | the project's CSS lint (`scripts/verify-css.mjs`): shared breakpoints only, raw colours only in `app/tokens.css`. ESLint is not installed; the old `next lint` script no longer exists in Next 16 |
| `npm run verify` | **`scripts/verify-redesign.mjs`**: the story (seven product beats, dashboards animating in), blur-to-focus, back/rapid scrolling, universe pointer response, background layers and the deep-blue transition, PillNav, option wheel (incl. real touch swipes), reduced motion, no-JS, console. `--only story,wheel` runs groups |
| `npm run verify:launch` | `scripts/verify-launch.mjs`: cross-route release gate — honesty grep, link crawl, console errors, overflow at 8 widths, keyboard focus, reduced motion, menus, motion budget, background gating, axe |
| `node scripts/verify-stage.mjs` | product-page stage checks (unchanged suite) |
| `node scripts/shoot-redesign.mjs` | review screenshots of every story stage and section at 1440 / 1366 / 820 / 390, reduced motion and open menus |
| `python scripts/package-zip.py` | builds `meerana-website-redesign.zip` from git's file list (respects `.gitignore`) and verifies it |

Both verifiers run against the built export on :4173 (`VERIFY_URL` overrides).
Headless Chromium renders with SwiftShader (software GL), so the suites wait on
exact signals (e.g. the story's progress bar equals scroll progress), not timers.

## Build-time switches (`lib/flags.ts`)

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_PREVIEW=1` | Preview build: footer note, and register items still `confirm-with-meerana` shown flagged "Unconfirmed". Never for production. |
| `NEXT_PUBLIC_ENQUIRY_API` | The enquiry endpoint (plan/11 §15). |
| `NEXT_PUBLIC_PRIVACY_URL` | The privacy notice. |

The contact form renders only when **both** are set; until then `/contact/`
offers email with the topic in the subject line. No `.env` file is needed to build.

---

## Architecture

```
app/
  layout.tsx            fonts, metadata, JSON-LD, motion-mode script, background, nav, footer
  page.tsx              homepage: CinematicStory, then Platforms, Solutions, Technology, Proof, About, Contact
  tokens.css            design tokens (the ONLY place raw colour lives)
  globals.css           type, buttons, focus, Tailwind sources
  background.css        the fixed background stack
  nav.css               PillNav, option wheel and dock
  dashboards.css        the coded product dashboards (one theme per product)
  cinematic.css         the story: static layout by default, cinematic under html[data-motion="full"]
  home.css              landing sections below the story
  sections.css          the scenario ("How it works")
  ui.css pages.css stage.css viz.css   shared UI, content pages, product pages
components/
  background/MeeranaInteractiveBackground.tsx   ColorBends + DotField + deep-blue layer + vignette/grain
  nav/SiteNav.tsx, useActiveSection.ts          PillNav ≥1024 px, wheel dock below; section sync
  dashboards/                                   coded product dashboards (1440 × 900 canvas) + DashboardFrame
  story/CinematicStory.tsx, poses.ts            the scroll story and its choreography data
  home/Sections.tsx, TiltScreen.tsx             landing sections; TiltedCard-style tilt
  reactbits/                                    adapted React Bits components + LICENSE.md
  stage/ sections/Scenario.tsx ui/ site/ contact/   product pages and shared pieces (kept)
content/
  story.ts              story copy and its screens (adapted copy is documented in the file)
  navigation.ts         every nav destination (real routes and section ids only)
  dashboards.ts         each dashboard's alt text, provenance and phone crop
  demo-data.ts          the dashboards' sample data (roles, not names; documented classes only)
  showcase.ts media.ts company.ts scenario.ts storyboards.ts   unchanged content registries
lib/
  pointer.ts            ONE pointer for the whole site (one listener, one sleeping rAF loop)
  jump.ts               instant, focus-moving jumps to homepage sections
  scene-colors.ts       token mirrors for WebGL/canvas code
scripts/                verifiers, serve-out, content gate, RSC post-export fix
```

### The story (blur to focus)

`components/story/CinematicStory.tsx` is one pinned scene built from
`components/story/poses.ts`:

| Keyframe | Copy | Stage |
|---|---|---|
| opening | **Complexity, Meet Clarity.** | one focal screen tipped back under the headline, six soft detail layers around it |
| reveal | **See Beyond the Interface.** | the focal screen sharpens, grows and comes forward; layers part outward |
| platforms | **Six Platforms. A World of Possibilities.** | all six platforms in one arrangement around the centred title |
| p0–p6 | each platform's verified caption | each platform comes forward sharp; the previous one recedes to a side, blurred. Yisbir has two beats: operations, then video indexing |
| capability | **Built to Move Ideas Forward.** | interface details gather around the centred message |
| next | **Explore What Comes Next.** | blur resolves; the six platforms begin to assemble |
| universe | **Different Platforms. One Bigger Picture.** | the settled six-platform universe, pointer-reactive |

How it works:

- **CSS sticky, not a GSAP pin.** The section is `100svh × (1 + length)` tall
  (7.4 screens of travel on landscape, 5.9 on portrait) and `.story-pin` is
  sticky. One `ScrollTrigger` scrubs **one** timeline; there is no pin-spacer, so
  resizing and scrolling back are plain CSS. A "Skip the intro" link and both
  navigations reach every section directly.
- **One source of poses.** Each screen's position, depth, rotation, scale,
  opacity and blur per keyframe live in `poses.ts`. The same numbers are written
  into the markup as custom properties, so CSS paints the opening composition
  before JavaScript, and GSAP's first frame is identical (both use the stage's
  container units).
- **One owner per property.** The timeline owns each `.sp` (transform,
  opacity, filter) and the copy; the pointer loop owns `.story-tilt` (scene
  rotation) and each `.sp-par` (depth parallax).
- **Copy.** Server-rendered word by word; words leave upward into blur and
  arrive from below out of it (React Bits BlurText's idea, scrubbed by GSAP).
  The DOM order is the reading order.
- **Blur budget.** Blur only where it reads; layers that would sit at ~10 %
  opacity are faded out instead (a faint blurred layer still costs a composite
  every frame); touch devices get a third of the blur; the opening loads only
  its own screens, the rest after the first scroll. Blur values are plain
  numbers — GSAP 3.15 will not interpolate `blur(3.00px)` (trailing zeros) and
  switches it at the tween's end instead (found and fixed by `npm run verify`).
- **Phones** use their own poses, with Yisbir's operations dashboard as the
  focal screen (the AI in a Box assistant is mostly text at 390 px).
- **Modes**, set on `<html data-motion>` before first paint by `app/layout.tsx`:
  `full` (cinematic), `reduced` (static layout: every beat in normal flow and the
  universe as a still 3D composition), `static` (the same, if the story has not
  started 8 s after load). Short landscape screens (under 500 px tall) always get
  the static layout.

### Coded product dashboards

`components/dashboards/` holds six DOM-built screens: Nazo admin overview,
Yisbir site operations, Yisbir video indexing, Wasel gate console, and the AI
in a Box assistant and analytics. Each is laid out on a fixed 1440 × 900
canvas and scaled with CSS `zoom` (the frame is a size container; the factor
is `100cqw ÷ 1440px`), so the text is rasterised at its final size and the
first paint needs no JavaScript. Frames narrower than 560 px show a readable
`crop` region instead of a shrunken desktop. Each frame is one image to
assistive technology (`role="img"` with a full description); the markup inside
is `aria-hidden` and `inert`. Bars grow and rows rise once, when the screen
first appears (the story timeline, or an IntersectionObserver elsewhere);
nothing loops.

Provenance per screen (`content/dashboards.ts`): **Interface reconstruction ·
sample data** where the owner supplied a real screen or recording (Nazo,
Yisbir video indexing, both AI in a Box screens), **Illustrative interface ·
sample data** where none exists (Yisbir operations, after the owner's Figma;
Wasel, after the 2026 brochures). Sample data lives in `content/demo-data.ts`
and is checked by `content:check` (no telemetry figures, plates, weapons,
faces, behaviour scoring, police/ministry/government tenants, or the banned AI
in a Box line).

### The six-platform universe

CSS 3D, not WebGL: the screens stay crisp DOM (screenshots and coded dashboards) with text alternatives, need no
textures or third GL context, and work without WebGL. The whole structure
turns with the pointer (≤ 7° Y, ≤ 5° X), each panel shifts by its own depth
(near panels more), smoothing comes from the shared pointer store, and it
eases back to rest when the pointer leaves. Coordinates are normalised to the
stage, which stays correct after the pin releases. Touch devices and reduced
motion get the still composition.

### Background (ColorBends + DotField)

`MeeranaInteractiveBackground` is fixed behind every route and mounted once in
the root layout, so it never resets:

1. a static midnight-navy base with a royal key light and a faint cyan rim (always painted);
2. **ColorBends** with the brief's configuration — `colors={["#0004a7"]}` (the
   real API; the brief's `color`), speed 0.4, frequency 1.8, noise 0.18,
   bandWidth 0.22, rotation 115, `fadeTop` 0.7, intensity 1.4 — rendered at
   half resolution, capped at 30 fps, paused when the tab is hidden;
3. **DotField** with the brief's configuration and navy/cyan colours, idle-throttled;
4. a **deep-blue layer** (`--meerana-deep`, the logo blue at about 22 %
   lightness) whose opacity follows scroll depth from the platform section to
   the bottom of the page; ColorBends' band colour blends towards brand blue
   with it;
5. vignette and baked grain.

Nothing reacts to the cursor (owner, 2026-10-13): no pointer glow, no dot
bulge, no colour following the pointer; the bands and dots still animate on
their own. Layers 2–3 run only with a fine pointer at ≥1024 px and without
Save-Data; phones and tablets get the static gradient (the deep-blue layer
runs everywhere). Reduced motion draws one still frame. A failed or lost
WebGL context falls back to the base.

### Navigation

- **≥1024 px — PillNav.** A centred row of glass pills: the logo, *Platforms*
  (a native button opening a panel of all six products and the overview),
  Solutions, Technology, About, Contact, and the "Talk to Meerana" pill →
  `/contact/`. The panel follows its button in the DOM (Tab moves into it),
  ArrowDown opens it and arrows move through it, Escape returns focus, and an
  outside click, focus leaving or navigation closes it.
- **<1024 px — the option wheel dock** (bottom-right) and a home mark.
  Collapsed, it shows the current section and lets the page scroll straight
  through it (wheel and touch). A tap expands it; dragging, the mouse wheel and
  arrows browse; a tap, Enter or Space goes. Selection follows the visible
  section (IntersectionObserver) without any feedback loop.
- Both are server-rendered; a media query shows one, so only one is ever focusable.

### React Bits

Sources were taken from the official registry (`DavidHDev/react-bits`, TS-CSS
builds) and adapted; each file's header lists every change.
[`components/reactbits/LICENSE.md`](components/reactbits/LICENSE.md) carries the
MIT + Commons Clause notice the licence requires (use inside this website only).

| Component | Used as | Why adapted / not used |
|---|---|---|
| ColorBends | background | `followPointer={false}`, colour blend towards a second palette (`colorsTo`, `mix`), render scale, fps cap, pause, still frame, `fadeTop`, error fallback |
| DotField | background | `interactive={false}` (no bulge, no glow), viewport coordinates for a fixed layer, idle throttling, pause |
| PillNav | desktop nav | `next/link`, a disclosure panel per pill (native button, aria-expanded/controls, Escape/outside/focus-out/route close, arrow keys), CTA pill, no mobile menu (the wheel covers it), reduced motion |
| OptionWheel | tablet/phone nav | controlled selection, browse vs commit, scroll/touch capture only while expanded, listbox semantics |
| BlurText, TiltedCard | ideas re-implemented | both need `motion`; GSAP and CSS do it without a second animation system |
| GradualBlur, ScrollStack | not used | stacked `backdrop-filter` over an animated canvas; ScrollStack's own smooth-scroll engine fights ScrollTrigger |

---

## Rules that must not be broken

1. **No raw colour outside `app/tokens.css`** (`npm run lint`).
2. **Every product claim carries an evidence id** (`plan/03-evidence-register.csv`);
   `content:check` runs before every build. Brief copy that would claim more
   than the register supports was adapted (`content/story.ts`): no
   cross-product integration is claimed ("Meerana Intelligence Layer" is
   do-not-use, EV-473).
3. **Owner-mandated lines stay verbatim** where they appear: "Built in the UAE.
   Engineered for the world." and "Together, let's build what comes next."
4. **Every screen carries one honest provenance label** from the `Provenance`
   union; the story adds one composition-level note.
5. **No heading depends on animation to be visible**: every heading is in the
   static HTML, readable with JavaScript off or reduced motion on.
6. **Storytelling copy over screens always has its own scrim.** (The previous
   rule "text never sits on an image" was superseded by the brief's centred,
   product-first composition; legibility is kept by per-block scrims and by
   keeping copy clear of the focal screen's detail.)
7. **No AI-generated product imagery** and no logos without written permission.
8. **No placeholder strings on a production build.**
9. **Dashboards show sample data only, labelled as such**: role labels instead
   of names, documented Yisbir detection classes only, no plates, faces,
   weapons, VIP/K9 boards, government tenants or telemetry figures.

## Held media

`output: "export"` publishes every file in `public/`. The two withdrawn images
(`mandoobee-phones-cutout.webp`, `card-yisbir-ppe.webp`) were still in
`public/media/v3` and therefore publicly reachable; on 2026-10-12 they were
moved to `media-src/held/v3/` (git-ignored, see `.gitignore`).

## Accessibility

- WCAG 2.2 AA target; `npm run verify:launch` runs axe on every route.
- Reduced motion: no pin, nothing blurred or moving, background still.
- No WebGL, a lost context, touch, Save-Data: the full page with the static background.
- No JS: all copy and the six platforms are in the static HTML.
- Visible focus rings; skip link first; the PillNav panel returns focus on Escape; the wheel is a labelled listbox.
- Each coded dashboard is one labelled image; its sample text is never read out or focusable.

## Toolchain

| Package | Version | Note |
|---|---|---|
| next | 16.4.0 | App Router, `output: 'export'` |
| react / react-dom | 19.3.0 | |
| three | 0.186.1 | ColorBends only |
| gsap | 3.15.0 | ScrollTrigger (story, product stage), PillNav hover and panel |
| typescript | 6.0.3 | |
| tailwindcss | 4.3.3 | scans only `app/`, `components/`, `content/`, `lib/` |
| playwright, @axe-core/playwright | dev | the verification suites |

`@react-three/fiber` and `@react-three/drei` were removed with the retired hero
room (nothing imports them).
