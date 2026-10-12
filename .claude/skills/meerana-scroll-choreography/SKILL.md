---
name: meerana-scroll-choreography
description: Scroll-driven storytelling and animation choreography for the Meerana Technologies website — specifying and implementing scroll reveals, pinned chapters, product reveals, dashboard step-throughs, and transitions with GSAP ScrollTrigger on native scroll. Use whenever adding, changing, debugging or reviewing any scroll-linked or entrance animation, pinning, scrub timelines, section transitions, or the motion spec, and whenever someone asks for "more wow", smooth scrolling, parallax, or a product reveal.
---

# Meerana scroll choreography

## Purpose
Motion explains sequence and cause: what the product does first, then next, then what results. It never gates content, never takes control of the scroll, and never exists only to decorate.

## When to use
- Writing or changing any entry in `plan/08-scroll-animation-spec.md`.
- Implementing timelines.
- Debugging jank or pin bugs.
- Reviewing a motion proposal.

## Required inputs
- The section spec or storyboard beat (meerana-narrative), which says what the motion must explain.
- The motion spec entry (`M-…` id).
- Scene hooks from meerana-webgl-scenes, if 3D is involved.
- UI states from meerana-product-ui, if dashboards are involved.

## Spec format
Every major animation gets an entry with these fields:

| Field | Content |
|---|---|
| id / beat | `M-home-…` or `M-<product>-…` and the storyboard beat |
| Narrative purpose | One sentence. "Looks cool" is not a purpose. |
| Trigger and range | ScrollTrigger `start`/`end` in viewport terms, e.g. `top 70%` → `bottom 30%` |
| States | Initial → intermediate → final (what is visible and readable at each) |
| Pin | One of:<br>• **none**<br>• **sticky stage**: a visual is `position: sticky` while narrative text scrolls past it; the reader is still moving through content, so it may span a whole chapter.<br>• **hard pin**: nothing scrolls; scroll only drives animation. Desktop ≤ 150vh per instance and ≤ 300vh total per page. Mobile: no hard pins over 100vh, none on the homepage. |
| Movement | Camera / object / typography / UI, and who owns each |
| Exit | The handoff to the next section |
| Mobile | The alternative behaviour |
| Reduced motion | The alternative behaviour |
| Fallback | Loading and failure state |
| Perf risks | e.g. layout thrash, overdraw, big textures |

## Implementation rules
1. **Native scroll only.**
   - No Lenis, ScrollSmoother or scroll hijacking.
   - No `normalizeScroll` unless a specific mobile bug requires it and the decision is logged.
   - Scrub smoothing ≤ 0.5 s, so the content tracks the finger.
2. **One owner per section.**
   - A single GSAP timeline per chapter drives DOM and 3D.
   - 3D scenes expose setters (`setProgress(p)`, `setStep(i)`) and never read scroll directly.
   - Don't mix CSS scroll-timelines and GSAP on the same element.
3. **Responsive and accessible by construction.**
   - Wrap timelines in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` and breakpoint conditions.
   - Reduced-motion branches render the final, readable state with discrete step controls.
4. **React integration.** Use `useGSAP` with a scope ref. Kill timelines and ScrollTriggers on unmount. Call `ScrollTrigger.refresh()` after fonts and above-the-fold images load.
5. **Text stays readable.**
   - Body text never moves while it's being read.
   - Transforms apply to containers before or after the reading position, not during.
   - Opacity never stays below 1 for text in its reading range.
6. **Pins are skippable.**
   - Every pinned chapter has a "Skip to next section" link and its own anchor.
   - Keyboard focus moving into a pinned chapter scrolls it to its final state rather than trapping focus.
7. **Simple reveals.** Prefer CSS (`@starting-style`/transitions via IntersectionObserver class toggles, or CSS `animation-timeline: view()` where supported and progressive). Reserve GSAP for choreography.
8. **Performance.**
   - Animate only `transform` and `opacity` (and shader uniforms).
   - No animated `filter: blur`, no `backdrop-filter` over moving content, and no box-shadow animation on large elements.
   - `will-change` only during the active range.

## Expected outputs
- Spec entries with `M-` ids.
- Timeline code colocated with its section component.
- Recordings or screenshots of the initial, mid and final states for review.

## Quality checks / acceptance
- At 375 px and 1440 px, every section's final state is reachable and readable by normal scrolling, with no horizontal overflow.
- With `prefers-reduced-motion: reduce`, nothing scrubs or pins. All content and step controls are present.
- Total pinned distance on the homepage is ≤ 300vh (desktop) and ≤ 100vh (mobile).
- The animation frame budget holds: ≥ 55 fps desktop and ≥ 45 fps on a mid-tier Android in a Chrome performance trace of each chapter. There are no long tasks over 50 ms caused by scroll handlers.
- Browser back/forward and anchor links land on the correct, fully rendered section state.

## Project constraints
- GSAP + ScrollTrigger is the single choreography engine. Don't add Motion/Framer Motion, AOS, or a second smooth-scroll library.
- Animations demonstrate verified workflows only. Data-flow lines between products are not allowed unless the integration is documented in the dossiers.

## Failure modes and anti-patterns
- **Long pins:** pins longer than the story beat; users feel stuck.
- **Scroll-speed games:** the page scrolling slower or faster than the finger, or snapping that fights the user.
- **Hidden text:** text revealed character-by-character during reading, or headlines that only appear mid-scrub.
- **Decorative noise:** particles, glows and blur trails with no narrative purpose. The metaballs, click sparks and gradual-blur overlays from Figma Make v17 are rejected.
- **iOS address-bar jank:** pins that jump when the iOS address bar collapses. Use `svh`/`lvh` units and test on a real device.
- **Duplicate timelines:** competing timelines writing the same property, and leaking ScrollTriggers across route changes.
