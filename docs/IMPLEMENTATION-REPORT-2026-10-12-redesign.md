# Implementation report — cinematic redesign (2026-10-12)

Plan, audit and risk register: [`REDESIGN-PLAN-2026-10-12.md`](REDESIGN-PLAN-2026-10-12.md).
Raw verification output: [`review/2026-10-12-redesign/`](review/2026-10-12-redesign/).

## What was built

| Area | Where |
|---|---|
| Cinematic story: opening + five stages + six product beats + the six-platform universe, one GSAP timeline over a CSS-sticky scene | `components/story/CinematicStory.tsx`, `components/story/poses.ts`, `content/story.ts`, `app/cinematic.css` |
| Global interactive background: static navy base, ColorBends, DotField, pointer glow, vignette/grain | `components/background/MeeranaInteractiveBackground.tsx`, `app/background.css`, `lib/pointer.ts` |
| Responsive navigation: CardNav ≥1024 px, option-wheel dock below, section sync | `components/nav/*`, `content/navigation.ts`, `app/nav.css`, `lib/jump.ts` |
| Adapted React Bits components + licence notice | `components/reactbits/*` |
| Landing page: platforms, solutions, technology (deployment + the existing scenario), proof, about, contact | `components/home/*`, `app/home.css`, `app/page.tsx` |
| Footer: Explore column | `components/site/SiteFooter.tsx` |
| Verification: `verify-redesign.mjs` (new), `verify-launch.mjs` (groups rewritten for the new design), `shoot-redesign.mjs`, `serve-out.mjs`, `package-zip.py` | `scripts/` |

Removed (nothing imported them): the hero room (`components/room/*`), hero,
gallery and old header (`components/sections/Hero|Showcase|Sections.tsx`,
`components/site/Header.tsx`, `app/hero|showcase|header.css`),
`LatticeField`, the homepage-only verifiers `verify-home.mjs` /
`verify-landing.mjs`, and the `@react-three/fiber` / `@react-three/drei`
dependencies. All are recoverable from git history.

## Verification (all against the production export, `npm run build` + `npm start`)

| Command | Result |
|---|---|
| `npm run build` | ✅ content gate passed; 25 static pages exported |
| `npm run typecheck` | ✅ no errors |
| `npm run lint` (CSS lint) | ✅ shared breakpoints only; no raw colour outside `tokens.css` |
| `node scripts/content-check.mjs --html out` | ✅ passed on the exported HTML (EV-520 remains owner-pending, as before) |
| `npm run verify` (`verify-redesign.mjs`) | ✅ 189 checks: 188 passed in the full final run; the 1 failure (the glow read 42 px short of the cursor after a fixed 800 ms wait under software GL) was a harness timing issue — the check now polls and the group passed 7/7 on rerun |
| `npm run verify:launch` (`verify-launch.mjs`) | ✅ **118/118 in one uninterrupted run**: lint, honesty, links, console (12 routes × 3 viewports, 0 errors), overflow (8 widths × 6 routes), keyboard (3 viewports × 40 Tab stops), reduced, menus, motion budget, background gating, axe (11 routes × 3 viewports, 0 serious/critical) |
| `external` group of verify-launch | not run (makes outbound requests to third-party press and app-store sites) |
| ESLint | not available: `next lint` was removed in Next 16 and ESLint is not installed (pre-existing); `npm run lint` now runs the project's CSS lint |

### Final run on the delivered build (`docs/review/2026-10-12-redesign/final-*.txt`)

| Step | Output file | Result |
|---|---|---|
| build | `final-build.txt` | exit 0, content gate passed |
| typecheck | `final-typecheck.txt` | exit 0 |
| CSS lint | `final-lint.txt` | exit 0 |
| verify-redesign (all groups) | `final-verify-redesign.txt` | 188 passed, 1 failed (harness wait, see above) |
| verify-redesign background (rerun after the harness fix) | `final-verify-redesign-background-rerun.txt` | 7 passed, 0 failed |
| verify-launch (all groups except `external`) | `final-verify-launch.txt` | 118 passed, 0 failed |

What `verify-redesign` measures, by group: **story** (desktop, laptop, phone:
opening composition of real screens with layered blur, centred headline,
every stage's copy alone on screen, focal sharpening and growth, each platform
in focus with the previous receding, progressive mid-transition blur, scroll
back, rapid random scrolling, accessibility of off-screen beats, release into
the landing page) · **universe** (six sharp loaded panels, unequal prominence,
overlaps, distinct depths, labels, pointer rotation left/right and up/down,
depth-aware parallax, ≤ 8°, return to rest) · **background** (ColorBends WebGL
alive and animating, DotField painting, fixed and non-interactive, glow follows
the pointer, static on touch) · **cardnav** (native toggle, open/stagger, 14
links, real CTA, Escape + focus return, keyboard, outside click, rapid
toggling, resize, link close) · **wheel** (phone and tablet: touch swipe and
mouse wheel pass through when collapsed, tap expands, expanded wheel captures
drags without navigating, tap navigates, selection follows scrolling with no
feedback loop, keyboard, Escape, route navigation) · **reduced** · **nojs** ·
**console**.

### A note on reruns (honest accounting)

Headless Chromium renders with SwiftShader (software GL). A live homepage
(WebGL background + blurred 3D layers) costs several CPU cores there, so when
a test group left several pages open the machine starved: page loads hit the
90 s timeout and the story's 8-second safety fallback fired. The first full
`verify-launch` run therefore reported 79 passed / 9 failed; every one of those
nine was in a group that keeps pages open. The groups were changed to close
each page as soon as it is measured; the final uninterrupted run then passed
118/118 (earlier outputs kept: `verify-launch-output.txt`,
`verify-launch-rerun*.txt`, `verify-launch-axe-output.txt`). The same
starvation affected an earlier `verify-redesign` run (the story's 8 s fallback
fired at 1280×720); the suite now closes each viewport's page too. Each route also loads in 50–150 ms in
isolation. This is a property of software rendering, not of the site, but it
also prompted real optimisations (below).

## Bugs found by the new suite and fixed

- **Blur-to-focus jumped instead of resolving.** GSAP 3.15 does not interpolate
  a filter whose end value has trailing zeros (`blur(3.00px)`); it switches at
  the tween's end. Values are now plain numbers; a mid-transition check
  (3 px → 1.51 px → 0 px) guards it.
- **Phone opening showed an empty dark box** (the AI in a Box matrix at 390 px);
  the narrow layout's focal screen is now Yisbir's dashboard.
- **Tablet: tapping beside the labels did not open the wheel**; the whole
  collapsed wheel is the tap target now.
- **Story headings were removed from the accessibility tree** while off screen
  (`visibility: hidden`); copy now hides by opacity, its links take clicks only
  while live, and keyboard focus inside off-screen copy scrolls it into view.
- **Withdrawn media were publicly reachable** (static export ships all of
  `public/`); moved to the git-ignored `media-src/held/`.
- **Script load failure waited 8 s** before the static layout; it now switches at once.

## Performance work

- ColorBends renders at half resolution, capped at 30 fps, paused when the tab
  is hidden, one still frame under reduced motion; ColorBends, DotField and
  three.js load only on fine-pointer desktops (≥1024 px, no Save-Data, >4 GB).
- Layers that would sit at ~10 % opacity with a large blur are faded fully out
  (a faint blurred layer still costs a blurred composite every frame).
- Touch devices use a third of the blur; the opening fetches only its own
  screens (the AI in a Box focal screen at high priority); the rest load on the
  first scroll or 2.5 s after load.
- One pointer listener and one sleeping rAF loop for the whole site; no React
  state on pointer movement.

## Decisions and deviations from the brief

- **Copy accuracy.** "Connected" removed from the opening line; stage 2 uses the
  brief's own fallback ("six distinct digital platforms"); stage 3 names the
  verified domains; stage 4's headline is the universe's, revealed last after
  the stage-5 transition, to avoid a duplicate heading. "Connected technology"
  is presented as per-product deployment facts plus the existing one-product
  scenario: the register supports no cross-product integration (EV-473, DD-20).
- **Owner-mandated hero H1** ("We engineer intelligence for the real world.") is
  replaced by the brief's opening; other mandated lines are kept verbatim.
- **Universe in CSS 3D**, not React Three Fiber (crisp, accessible, no third GL
  context, works without WebGL).
- **BlurText / TiltedCard** re-implemented without `motion`; **GradualBlur** and
  **ScrollStack** not used (reasons in the README).
- **The wheel is a dock** that expands on tap, so a collapsed wheel never
  captures page scrolling; the expanded wheel captures drags and the mouse wheel.
- **Homepage length**: about 20 screens at 1440×900 (the story is 8 of them).
  The previous 8.5-screen budget belonged to the retired design.

## Known limitations

- The product story pages (`/products/*`) were not redesigned; they carry the
  new nav and background. Their open items (settle checks) are unchanged:
  `docs/STATUS-2026-10-12.md`.
- Some copy remains PROVISIONAL pending owner approval (service summaries,
  `/products/` heading), as before.
- Real-device GPU profiling was not possible here (headless software GL only);
  frame rates on real hardware should be confirmed on a mid-range laptop and phone.
- `docs/review/**/*.png|json` are git-ignored by the project, so screenshots and
  JSON results are regenerated rather than shipped (`node scripts/shoot-redesign.mjs`).

## Round 2 (2026-10-13): dashboards, deep blue, PillNav

The owner's round-2 decisions, and what changed. This section supersedes the
CardNav and pointer-glow rows above.

| Owner decision | What was built | Where |
|---|---|---|
| "Remove the light change while moving the cursor, keep the animation" | The pointer glow layer is gone; ColorBends runs with `followPointer={false}`, DotField with `interactive={false}` (no bulge, no glow). The bands and the sparkle still animate on their own. The platform panels' glare is removed (the tilt stays). | `components/background/*`, `components/reactbits/ColorBends.tsx`, `DotField.tsx`, `components/home/*` |
| "Transition to dark blue towards the bottom … closer to the Meerana logo and darker" | A deep layer in `--meerana-deep` (#031A6B: the logo blue #0D3BFF / #0436CA at about 22 % lightness) with a darker floor (#020E45) fades in by scroll depth, from the platform section to the bottom (smoothstep). ColorBends' band colour blends towards brand blue with it. Tokens are documented as derived. | `app/tokens.css`, `app/background.css`, `lib/scene-colors.ts` |
| "The navbar looks bad, find a better React Bits one" (desktop); "for mobile keep it" | React Bits **PillNav** replaces CardNav at ≥1024 px: logo, a Platforms pill that opens a panel of all six products and the overview, Solutions, Technology, About, Contact, and a "Talk to Meerana" pill. The option wheel stays on tablets and phones. | `components/reactbits/PillNav.tsx`, `components/nav/SiteNav.tsx`, `content/navigation.ts`, `app/nav.css` |
| Proper dashboards for each product | Six coded dashboards (DOM, 1440 × 900 canvas scaled with CSS `zoom`, phone crops). In the story they replace the Nazo, Yisbir, Wasel and AI in a Box screenshots and the governance detail; in the platform section they are the main (and second) screen for those four platforms. Mandoobee and Tasree3 keep their real screenshots. | `components/dashboards/*`, `content/dashboards.ts`, `content/demo-data.ts`, `app/dashboards.css` |
| Nazo: "edit it or make new in the same format" (the supplied Admin Overview screenshot) | **Interface reconstruction**: the same layout (sidebar with Workspace/Manage, KPI tiles, Build with AI, Recent activity timeline, AI assistant panel). The tenant's emblem and product name are replaced by Nazo's; every person by a role. An "In progress" card fills the empty column with three items at different stages. | `NazoOverview.tsx` |
| Yisbir: the Figma file, "instead of agent matrix, use a different screen, like the analytics page and chat interface" | **Yisbir site operations** follows the Figma's command-centre format (alert queue, restricted zones, live camera zone, PPE compliance, alerts by type), rebuilt for a generic logistics site with documented classes only. Labelled **illustrative** (the Figma is a proposed design). AI in a Box: the agent matrix is replaced by its **assistant (chat)** as the opening's focal screen and its **analytics** page as a detail. | `YisbirOperations.tsx`, `AiBox.tsx` |
| "In Yisbir there is also a product called video indexing" | **Yisbir video indexing** (reconstruction of the indexing UI in the owner's recording): a question answered from video, audio and documents with its sources and match scores, results by type and a mini player. It gets its own story beat (p4) with its own caption, so the story now has seven product beats; the arrangement and the universe still show one screen per platform. | `YisbirIndexing.tsx`, `components/story/poses.ts`, `content/story.ts` |
| Wasel brochures and logo | **Wasel gate console** (illustrative: no Wasel screen exists) built from the brochures: gate states, gate types, the three connectivity modes with Bluetooth as the offline fallback, temperature/humidity, the auto-close timer, the audit trail (time, trigger source, command), admin master keys, role-based users and QR key sharing. The official logo raster (308 × 308, white) is used unmodified, shown at 92 px. | `WaselConsole.tsx`, `public/brand/wasel-logo-white.png` |

### What was left out, and why

- From the **"dubaiPolice" Figma**: police and government marks, the licence-plate
  / ANPR boards, face matching, behaviour scoring, weapons, VIP and K9 boards and
  named officers (the project's compliance list and the meerana-product-ui rule
  "documented detection classes only").
- From the **Nazo screenshot**: the tenant's emblem, product name and personal names.
- From the **indexing and AI in a Box recordings**: the ministry's documents and
  people on camera (replaced by neutral site-safety media), the latency figure,
  and the AI in a Box footer line that is banned on the site.
- From the **Wasel brochures**: the personal contact details.

### Decision for the owner: Wasel colours

The 2026 Wasel brochure uses a blue palette; the brand identity PDF (the visual
authority, meerana-brand skill) gives Wasel brown / sand / copper / ivory and
rules out cyan. The console follows the brand PDF. If the brochure's blue is the
newer Wasel identity, the five `--dw-*` tokens and the Wasel primitives in
`app/tokens.css` are the only places to change.

### Story changes

- Seven product beats (`FOCUS_SEQ`: Mandoobee, Tasree3, Nazo, Yisbir operations,
  Yisbir video indexing, Wasel, AI in a Box); the story is 7.4 screens of travel
  on landscape and 5.9 on portrait (was 7 / 5.6).
- A dashboard's bars and rows animate in the first time its screen appears on the
  stage (the timeline flips `data-focus`); scrubbing back before that moment
  resets it. Nothing in a dashboard loops, because every animated pixel inside a
  blurred 3D layer re-rasterises the layer.

### Verification (round 2)

All against the production export (`npm run build` + `npm start`), 2026-10-13.
Raw output: `review/2026-10-12-redesign/round2-*.txt`.

| Command | Result |
|---|---|
| `npm run build` | ✅ content gate passed (now also checks the dashboards' sample data and specs); static export |
| `npm run typecheck` | ✅ no errors |
| `npm run lint` (CSS lint) | ✅ shared breakpoints only; no raw colour outside `tokens.css` (all dashboard colours are tokens) |
| `content-check.mjs --html out` | ✅ passed on the exported HTML |
| `npm run verify` (`verify-redesign.mjs`) | ✅ **226/226 in one run**: story at 1440×900, 1280×720 and 390×844 (seven beats, each dashboard animating in on its beat, Yisbir indexing absent from the arrangement and the universe), universe, background (no cursor light, ColorBends animating, deep blue 0 → 0.5 → 1 down the page), PillNav (panel, keyboard, Escape/outside/focus-out close, navigation), wheel, reduced motion, no-JS, console |
| `npm run verify:launch` (all groups except `external`) | ✅ **118/118**: lint, honesty, links, console, overflow, keyboard, reduced, menus (PillNav + wheel), motion budget (7.4 / 5.9 screens), background gating, axe (0 serious/critical) |
| `external` group | not run (it makes outbound requests to third-party press and app-store sites) |

Found and fixed during round 2: the Platforms panel was rendered after the CTA,
so Tab skipped it — it now sits right after its button; Wasel's audit trail
contradicted the gate states (a "Closed" gate whose last command was "Open") —
the sample rows were made consistent; Yisbir's queue filter said "Status: Open"
over resolved rows — now "Status: All".
