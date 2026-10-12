---
name: web-animations
description: Motion rules for the Meerana and YISBIR marketing sites. Covers GSAP + ScrollTrigger, Motion (formerly Framer Motion), Lenis smooth scroll and plain CSS. Topics are scroll-triggered reveals, staggered entrances, easing and duration tokens (one easing family, max three durations), the "one signature motion per page" rule, Lenis setup with the GSAP ticker, reduced-motion fallbacks and pause controls (WCAG 2.2.2 / 2.3.3), LCP-safe hero motion, and a performance budget (transform/opacity only, no layout thrash, canvas lifecycle). Use it whenever you add, change, review or debug any animation, transition, scroll effect, parallax, hero motion, canvas loop, page transition or smooth scrolling, or when someone asks for "more wow", "make it feel premium", "add Lenis", or "why is it janky". On meerana.ae, meerana-scroll-choreography is stricter and wins (native scroll, GSAP only).
---

# Web animations

## Purpose
Motion explains: what happens first, what changes, what results. A page gets **one signature motion**. Everything else is a quiet reveal or nothing. Motion never hides content, never takes over the scroll, and never costs the page its LCP or INP.

## Relationship to project skills and decisions
| Topic | Rule source | Status |
|---|---|---|
| Choreography spec format (`M-` ids), pins, sticky stages, homepage pin limits | `meerana-scroll-choreography` | Authoritative for meerana.ae |
| Engine choice | **DD-03.** meerana.ae: GSAP + CSS only. Motion only in React app surfaces that need layout/exit animation. | Proposed, awaiting decision |
| Smooth scroll | **DD-02.** meerana.ae: native scroll. yisbir.com: optional Lenis (desktop wheel only, rules below). | Proposed |
| 3D / WebGL scenes | `meerana-webgl-scenes` (purpose test, budgets, lifecycle) | Authoritative |
| Reduced motion / a11y gate | `meerana-a11y-responsive` | Authoritative |

## Engine decision table
| Need | Use | Not |
|---|---|---|
| Hover, press, focus, state changes; simple enter/exit | **CSS** transitions, `@starting-style`, `tw-animate-css` classes | JS libraries |
| Below-the-fold reveals | **CSS + IntersectionObserver** (`references/motion-tokens.css`), or `ScrollTrigger.batch` if GSAP is already loaded | One ScrollTrigger per element |
| Scroll-linked choreography, sticky-stage steps, scrubbed timelines | **GSAP + ScrollTrigger** via `useGSAP` | CSS scroll-timeline on the same element |
| React component layout/exit animation in app-like UI (filter lists, dialogs with shared layout) | **Motion** (`motion/react`, LazyMotion) | GSAP on the same element |
| Wheel smoothing (yisbir.com only) | **Lenis**, driven by the GSAP ticker | ScrollSmoother, `scroll-behavior: smooth`, `normalizeScroll` by default |
| Signature canvas motion (lattice, camera feed) | **Plain rAF** with an explicit lifecycle (or R3F, per `meerana-webgl-scenes`) | Libraries for a single loop |

## Tokens (one easing family, three durations)

**Durations:**

| Token | Value | Use |
|---|---|---|
| `--dur-1` | 160 ms | State feedback, bracket snaps |
| `--dur-2` | 240 ms | Component enter/exit, reveals |
| `--dur-3` | 420 ms | One step of a section or signature sequence |

**Easings:**

| Token | Value | Use |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-enter` | `cubic-bezier(0, 0, 0, 1)` | Entrances |
| `--ease-exit` | `cubic-bezier(0.3, 0, 1, 1)` | Exits |

**GSAP equivalents:**
- Durations: `0.16 / 0.24 / 0.42`.
- Eases: `"power3.out"` ≈ enter. Better is a `CustomEase` matching the bezier. If CustomEase isn't loaded, use `"expo.out"` for enter and `"power2.inOut"` for standard, and record the choice.

**Limits:**
- Scrubbed scroll has no duration; smoothing ≤ 0.5 s.
- Stagger ≤ 60 ms per item; ≤ 8 items per group; total stagger ≤ 480 ms.
- No other durations or curves. Copy the tokens from `references/motion-tokens.css`.

## The signature rule
1. **Exactly one** element per page carries `data-signature` (the audit script counts them). Examples:
   - Meerana M1: the lattice assembles.
   - M2: the model builds.
   - YISBIR Y1: detection lock-on.
   - Y2: timeline ticks.
2. The signature has a one-sentence **purpose** in a code comment: "This shows ___ that static layout cannot".
3. It plays **once**, or it is a loop with a **visible pause control**. Any motion lasting more than 5 s alongside other content needs pause/stop/hide (WCAG 2.2.2, Level A). `prefers-reduced-motion` alone does not satisfy that criterion.
4. Everything else on the page is a quiet reveal (opacity + 8 px translate, `--dur-2`, `--ease-enter`) or static.

## LCP-safe hero motion
- The **LCP element is text or a poster image**, visible at first paint. Never animate the hero H1 from `opacity: 0`, from clipped masks, or with SplitText reveals. Invisible or clipped text is not painted, so LCP is delayed.
- Canvas and WebGL are never LCP candidates. Render an inline SVG or `<img>` **poster of the final frame** first, then mount the canvas after first paint:
  - `requestAnimationFrame` → `requestIdleCallback` (feature-detect; Safari lacks it, so fall back to `setTimeout(…, 200)`);
  - only if the hero is in view and reduced motion is off;
  - fade the canvas in over the poster at `--dur-2`.
- Under 768 px, prefer the poster (battery, LCP). Animate there only if the trace budget holds.
- Reserve the canvas box with `aspect-ratio`, so mounting causes no CLS.

## Reduced motion (every animation has this branch)
- **CSS:** `@media (prefers-reduced-motion: reduce)` collapses the duration tokens. Components also branch with `motion-safe:` / `motion-reduce:`.
- **JS:** check `matchMedia('(prefers-reduced-motion: reduce)')` and listen for `change`. Also honour an on-page toggle: `html[data-motion="reduce"]`, persisted in localStorage inside try/catch (`meerana-a11y-responsive`).
- **GSAP:** wrap timelines in `gsap.matchMedia()` with a `reduceMotion` condition that sets final states. Revert on unmount.
- **Motion:** use `<MotionConfig reducedMotion="user">`. It disables transform/layout animation only, so gate `useScroll` parallax manually with `useReducedMotion()`.
- **Lenis ≥ 1.3.26** honours reduced motion by default (`respectReducedMotion: true`). Don't override it.
- **Allowed under reduced motion:** opacity fades ≤ 240 ms, colour changes and final states. **Not allowed:** parallax, scrubbing, pinning, auto-advancing carousels, autoplaying video, animated counters, camera moves.

## Lenis (yisbir.com only, under DD-02)
Use it only when the page's signature benefits from wheel smoothing, and only in this configuration:
- `smoothWheel: true`, `syncTouch: false` (touch stays native), `anchors: true`, `autoRaf: false`;
- driven by `gsap.ticker` with `gsap.ticker.lagSmoothing(0)` and `lenis.on('scroll', ScrollTrigger.update)`;
- `data-lenis-prevent` on nested scrollers (event lists, code, maps);
- no `scroll-behavior: smooth` anywhere.

Remove Lenis if traces show worse INP or input latency, or if users report lag. Full setup is in `references/lenis-setup.md`.

## Performance budget
- Animate **`transform` and `opacity` only** (plus shader uniforms).
  - No animated `width`, `height`, `top`/`left`, `margin` or `padding`.
  - No animated `filter`, `backdrop-filter` or `box-shadow` on large elements.
  - No `transition: all`.
- **No layout thrash:** never read layout (`getBoundingClientRect`, `offsetHeight`) inside scroll or animation loops. Cache measurements on resize, or use IntersectionObserver.
- `will-change` only during the active range. Never on ancestors of pinned elements (it breaks `position: fixed`, per GSAP docs).
- **Canvas loops:**
  - pause off-screen (IntersectionObserver) and on `visibilitychange`;
  - cap DPR at 1.5 desktop and 1.25 mobile;
  - keep per-frame JS ≤ 4 ms;
  - no allocations in the loop.
- **Targets:**
  - ≥ 55 fps desktop and ≥ 45 fps on a mid-tier Android (Chrome trace, 4× CPU throttle);
  - no long tasks > 50 ms from scroll handlers;
  - LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (target 0.05).

## Workflow
1. Write the motion intent: section, purpose, trigger, states, reduced-motion branch, fallback (meerana.ae: the `M-` spec in `plan/08`).
2. Pick the engine from the table. Copy the tokens.
3. Implement with cleanup:
   - `useGSAP({ scope })`;
   - IntersectionObserver `disconnect`;
   - `cancelAnimationFrame` on unmount;
   - `ScrollTrigger.refresh()` after `document.fonts.ready` and hero images.
4. Add the reduced-motion branch and, for loops, the pause control.
5. Run `python .claude/skills/web-animations/scripts/motion_lint.py <files or dir>`. Fix every FAIL.
6. Trace: Chrome Performance at 4× CPU throttle, plus a reduced-motion pass and a no-JS pass (all content readable).

## References
- `references/motion-tokens.css`: tokens, keyframes, reveal utility (CSS + IntersectionObserver), reduced-motion overrides, pause-control CSS.
- `references/gsap-recipes.md`: install and licence, `useGSAP`, `matchMedia`, batch reveals, staggers, SplitText (safe use), sticky stages, common mistakes.
- `references/lenis-setup.md`: vanilla, React and GSAP setups; options; nested scroll; kill-switch criteria.
- `references/motion-react.md`: Motion 13 patterns (LazyMotion, `whileInView`, `stagger()`, exit/layout) and when not to use it.
- `references/reduced-motion-and-a11y.md`: WCAG mapping; the pause-control pattern; vestibular triggers.
- `references/performance-budget.md`: budgets, measurement snippets, canvas lifecycle template.
- `scripts/motion_lint.py`: static checks for motion anti-patterns (exit 1 on FAIL).

## Anti-patterns
- Scroll hijacking: snapping that fights the finger; slowed-down scroll; `normalizeScroll` by default.
- Character-by-character text reveals in a reading position; hero text appearing mid-scrub.
- Decorative loops: particles, metaballs, glows, marquee tickers with no information and no pause.
- Two engines writing the same property (GSAP and Motion on one element; CSS transitions on GSAP-animated properties).
- `staggerChildren` (deprecated in Motion), `@studio-freight/lenis`, `gsap-trial`, `priority` on next/image (Next 16).
