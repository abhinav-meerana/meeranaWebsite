# Redesign plan — cinematic, product-first homepage (2026-10-12)

Written before any source change, from an audit of the cloned repository.

## 1. Audit findings (verified, not assumed)

| Area | Finding |
|---|---|
| Framework | Next.js **16.4.0** App Router, `output: "export"` (static), `trailingSlash`, React **19.3.0**, TypeScript 6.0.3, Tailwind 4.3.3 (scans `app/ components/ content/ lib/` only). |
| Package manager | npm (`package-lock.json`). Node 24.13.1 locally. |
| Animation | GSAP 3.15.0 (ScrollTrigger, ScrollToPlugin), CSS. No smooth-scroll library, no `scroll-behavior: smooth` (documented conflict with ScrollTrigger). |
| 3D | three 0.186.1 + @react-three/fiber 9.8.1 + drei 10.7.9, used **only** by the hero "room" (`components/room/*`). |
| Routes | `/`, `/products/`, `/products/[slug]/` ×6 (horizontal "stage" story pages), `/company/`, `/services/`, `/contact/`, `/privacy/` (noindex shell), 404, sitemap, robots, icons, OG images. |
| Navigation | `components/site/Header.tsx`: desktop Products router panel + mobile focus-trapped sheet. |
| Content rules | Every claim cites an evidence id (`plan/03-evidence-register.csv`); every screen has a typed provenance label (`content/media.ts`); `scripts/content-check.mjs` runs before every build and rejects banned strings and withdrawn media. **"Meerana Intelligence Layer" is do-not-use (EV-473) and there is no verified cross-product integration (DD-20).** |
| Assets | 17 reviewed screens in `public/media/v3` covering all six products (Wasel is an honest illustration — no photographic screen exists). Two images are withdrawn and must never ship (`mandoobee-phones-cutout`, `card-yisbir-ppe.webp`). |
| Forms | Contact form renders only when `NEXT_PUBLIC_ENQUIRY_API` and `NEXT_PUBLIC_PRIVACY_URL` are set; otherwise email-only. Preserve. |
| Baseline build | `npm run build` ✅, `tsc --noEmit` ✅, `content:check` ✅. |
| Baseline lint | ❌ pre-existing: `next lint` no longer exists in Next 16 and ESLint is not installed (`Invalid project directory provided … \lint`). |
| `npm start` | Relied on `npx serve` (undeclared download). Replaced by a zero-dependency `scripts/serve-out.mjs`. |
| Status doc | `docs/STATUS-2026-10-12.md`: product-stage settle checks were failing when round 2 stopped. Out of scope here except where shared code changes. |

### React Bits (official source, `DavidHDev/react-bits`, TS-CSS registry)

| Component | Real API / deps | Decision |
|---|---|---|
| ColorBends | three; `colors: string[]` (not `color`); **no `fadeTop` prop**; pointer listener bound to its own container; continuous rAF at DPR ≤ 2 | Adapt: shared pointer source (layer is `pointer-events:none`), render-scale cap, pause when hidden / off-screen, single static frame under reduced motion, `fadeTop` implemented as a CSS mask. |
| DotField | Canvas 2D, no deps; page-coordinate mouse maths (wrong for a fixed layer); redraws every frame | Adapt: viewport coordinates from the shared pointer, idle throttling, pause when hidden. |
| BlurText | needs `motion` | Not installed and would be a second animation system. Re-implemented as word-level blur driven by the one GSAP timeline. |
| GradualBlur | stacked `backdrop-filter` layers | Rejected: backdrop blur over an animated WebGL canvas re-blurs every frame. |
| ScrollStack | own smooth-scroll engine | Rejected (fights ScrollTrigger). The GSAP sticky composition is the "equivalent". |
| TiltedCard | needs `motion` | Re-implemented as a CSS-variable pointer tilt. |
| CardNav | gsap + react-icons; `div role=button` hamburger; hard-coded no-op "Get Started"; fixed 260 px desktop height; no Escape/outside-click/focus return; `<a>` for routes | Adapt: native button, configurable CTA link, measured height, Escape/outside click/route change close, focus return, reduced motion, rapid-toggle safe; inline SVG arrow instead of adding react-icons. |
| OptionWheel | no deps; root `touch-action:none`; non-passive wheel listener with unconditional `preventDefault()`; uncontrolled (`defaultSelected`) | Adapt: controlled `selected` without remounting, commit-on-settle navigation (no feedback loop), wheel/touch captured only while the dock is expanded. |

Licence: MIT + Commons Clause — use inside a website is allowed; the notice ships in `components/reactbits/LICENSE.md`.

## 2. Implementation checklist

- [x] Shared pointer store (`lib/pointer.ts`): one passive listener, normalised coordinates, one rAF loop that sleeps when settled.
- [x] `MeeranaInteractiveBackground`: static navy base → ColorBends (WebGL) → DotField (2D) → pointer glow → vignette/grain. Fine-pointer desktop only for the live layers; static gradient on touch, reduced motion, no WebGL.
- [x] Desktop `CardNav` (≥1024 px) and tablet/mobile `OptionWheel` dock (<1024 px), one `SiteNav` switching by CSS so the HTML is identical for everyone (no hydration mismatch).
- [x] Cinematic story (`#top`): opening + five stages, six product sub-beats, centred copy, blur-to-focus, one GSAP timeline, CSS-sticky pin, ends in the six-platform 3D universe with pointer-reactive tilt and depth parallax.
- [x] Static fallback for reduced motion / no JS / init failure (all copy readable, universe as a still composition).
- [x] Landing sections: Platforms (#platforms), Solutions (#solutions), Technology (#technology, existing scenario kept), Proof (#proof), About (#about), Contact (#contact), footer.
- [x] Remove the retired hero room, gallery and header (and R3F/drei) once nothing imports them.
- [x] Verification: build, typecheck, content check, CSS lint, Playwright checks (desktop/tablet/mobile, nav, scroll, pointer, reduced motion, console/hydration, overflow, axe).
- [x] README update and verified ZIP (`meerana-website-redesign.zip`).

## 3. Technical risks and mitigations

| Risk | Mitigation |
|---|---|
| ScrollTrigger pinning (pin-spacer reflow, resize, back-scroll) | CSS `position: sticky` inside a tall section (the pattern the old gallery proved); ScrollTrigger only scrubs one timeline; `invalidateOnRefresh`; everything reverts in `gsap.context`. |
| Feeling trapped in a long pin | ~6.5 screens on desktop, ~4.5 on phones; "Skip the intro" link; nav reaches every section directly. |
| Blur cost | Blur only on a few elements at a time, blurred layers use the 1200 px files, `will-change` on animated layers, max blur halved on touch devices, none under reduced motion. |
| Two canvases + a 3D scene | Universe is CSS 3D (crisp, accessible, no third GL context); ColorBends renders below DPR 1; both background layers pause when the tab is hidden. |
| Global pointer tracking | One listener; CSS custom properties written on the background root and the universe only, never on `:root` per frame; no React state on pointer move. |
| WebGL unavailable / lost | Probe before mounting; error boundary; the static navy gradient is always painted underneath. |
| Responsive navigation | CardNav and the wheel both server-render; a media query decides which is displayed, so only one is in the accessibility tree. |
| Touch interaction | Wheel captures wheel/touch only while expanded; collapsed it is a tap target and page scrolling passes through. |
| Hydration | No viewport-dependent markup; motion mode set by an inline `<head>` script on `<html>` (already `suppressHydrationWarning`) before first paint, with a timeout fallback to the static layout if the bundle never initialises. |
| Screenshot loading | Explicit width/height everywhere; only the opening screens load eagerly (focal at high priority); later screens are deferred until the reader starts scrolling. |

## 4. Copy decisions (factual accuracy)

- "One connected ecosystem…" → **"One ecosystem. Purpose-built technology. A clearer way forward."** "Ecosystem" is the verified brand line (EV-006); "connected" would imply an integration the register does not support (EV-473, DD-20).
- Stage 2 supporting line uses the brief's own fallback: **"Explore six distinct digital platforms, each built for a different need."**
- Stage 3 supporting line names the verified domains: AI, automation, IoT and security.
- The brief gives stage 4 and the final 3D universe the same headline. To avoid a duplicate heading, the stage-5 transition copy ("Explore What Comes Next.") plays as the 3D panels assemble, and **"Different Platforms. One Bigger Picture."** is revealed last, as the settled universe's heading. Supporting line: "Explore the products and possibilities behind Meerana."
- Owner-mandated lines are kept below the story: "Built in the UAE. Engineered for the world." and "Together, let's build what comes next."
- "Connected technology" (§11 C) is **not** built as a cross-product claim. The Technology section keeps the verified one-product scenario and each product's own deployment fact.

## 5. Found and fixed during verification

- **Blur jumped instead of resolving.** GSAP 3.15 does not interpolate a
  filter whose end value has trailing zeros (`blur(3.00px)` from
  `toFixed(2)`); it switches at the tween's end. Blur values are now plain
  numbers; `verify-redesign` samples mid-transition to keep it that way.
- **Phones: dark focal screen.** The AI in a Box matrix read as an empty box at
  390 px; the narrow layout uses Yisbir's dashboard as its focal screen.
- **Collapsed wheel ignored taps beside the labels** (tablet): the whole
  collapsed wheel is now the tap target.
- **Inactive beats were `visibility: hidden`**, which removed their headings
  from the accessibility tree; copy is now hidden by opacity, its links take
  clicks only while live, and focus inside off-screen copy scrolls it into view.
- **Near-invisible blurred layers** (≈12 % opacity) still cost a blurred
  composite every frame; they now fade fully out, and ColorBends is capped at
  30 fps so it does not force the compositor to re-blur the story each frame.
- **Withdrawn media were still published** (`public/` ships whole under static
  export); moved to `media-src/held/` (git-ignored).
