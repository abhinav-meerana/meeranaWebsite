---
name: meerana-a11y-responsive
description: Responsive layout, accessibility (WCAG 2.2 AA), reduced-motion behaviour and RTL readiness for the Meerana Technologies website. Use whenever building or reviewing layouts, breakpoints, navigation, forms, interactive demos, scroll animations or 3D sections, and before any release — including "it breaks on mobile", "add the Arabic version", keyboard/screen-reader issues, focus problems, or reduced-motion handling. Acts as the quality gate other Meerana skills hand off to.
---

# Meerana responsive, accessibility & reduced motion

## Purpose
The experience must work for every visitor and device: phone, low-power laptop, keyboard-only, screen reader, reduced motion, and (when launched) Arabic RTL. Motion and 3D are enhancements on top of a complete, accessible document.

## When to use
- Any layout, component, form, demo, animation or 3D work.
- Pre-merge review.
- Release testing.

## Required inputs
- The component or page.
- Its motion spec (`M-…`) and UI spec (`UI-…`).
- The test matrix in `plan/13-acceptance-and-launch-checklist.md`.

## Workflow
1. **Layout.**
   - Mobile-first CSS. Breakpoints: 375 (base), 768, 1024, 1280, 1600+. Use container queries for components that move between columns.
   - Fluid type with `clamp()`. Body text min 16 px, line length 45–80 ch.
   - Touch targets ≥ 44×44 px. No hover-only information.
2. **Semantics.**
   - One `h1` per page and a logical heading order.
   - Landmarks: `header`, `nav`, `main`, `footer`; `section` with `aria-labelledby`.
   - Skip link to `main`.
   - Product index as a real `nav` list.
3. **Keyboard.**
   - Visible focus (≥ 3:1 against adjacent colours, never removed).
   - Logical tab order.
   - Pinned chapters never trap focus.
   - Demo steps are buttons. Tabs follow the WAI-ARIA tabs pattern. The mega-menu follows the disclosure pattern; not `role=menu`.
4. **Screen readers.**
   - Canvas `aria-hidden="true"`, with a DOM equivalent for meaningful states.
   - Demo step changes are announced via `aria-live="polite"`.
   - Images get meaningful `alt` text, or `alt=""` if decorative.
   - Partner logos have the organisation name as alt.
5. **Reduced motion.**
   - Under `prefers-reduced-motion: reduce`: no scrubbing, pinning, parallax, autoplaying video or animated counters.
   - Show final states, posters and step controls.
   - Also provide an on-page "Reduce motion" toggle that persists in `localStorage`, for users who don't set the OS flag.
6. **Forms.**
   - Labels are always visible (no placeholder-only fields).
   - Errors are linked via `aria-describedby`, with an error summary on submit.
   - Use `autocomplete` attributes.
   - CAPTCHA/bot protection must be accessible: invisible/managed challenge, never an image puzzle.
7. **RTL readiness** (even before Arabic launches):
   - Use logical properties (`margin-inline-start`, `inset-inline-end`). Directional icons mirror via `:dir(rtl)`.
   - `lang`/`dir` on `<html>`.
   - Almarai for Arabic.
   - Numerals: decide Western vs Eastern Arabic per decision log.
   - Animations that move "forward" respect reading direction.
8. **Test** with the matrix:
   - axe (automated)
   - keyboard pass
   - NVDA + Chrome on Windows and VoiceOver + Safari on iOS
   - 200% zoom and 320 px reflow
   - reduced motion
   - throttled CPU 4×
   - WebGL disabled

## Expected outputs
- An issues list with WCAG criterion references.
- Fixes.
- A signed-off checklist per page.

## Quality checks / acceptance
- axe: 0 serious or critical violations on every route.
- WCAG 2.2 AA manual checks pass: 1.4.3/1.4.11 contrast, 1.4.10 reflow, 2.1.1 keyboard, 2.4.7 and 2.4.11 focus, 2.2.2 pause/stop/hide, 2.3.3 animation from interactions, 2.5.8 target size, 3.3.x forms.
- At 320 px width and 200% zoom: no horizontal scroll and no clipped content.
- Reduced-motion mode: all content and all demo steps are reachable and nothing moves automatically.
- Lighthouse accessibility score ≥ 95 on every route. The manual checks are the gate; the score alone is not.

## Project constraints
- Bilingual by design: the Meerana and product brands specify Arabic faces.
- Government and enterprise visitors in the UAE may use assistive tech and older managed laptops. Test on a mid-tier Windows laptop with integrated graphics, not only on a MacBook Pro.

## Failure modes and anti-patterns
- **Hidden content:** content that only appears after an animation (invisible to screen readers and no-JS users).
- **Unlabelled controls:** custom scroll indicators or carousels without controls or labels. Auto-advancing carousels without pause.
- **Low-contrast styling:** cyan text on white, and thin Poppins weights at small sizes on navy (use ≥ 400 weight below 18 px).
- **Mobile pin bugs:** pins on mobile that fight the iOS address bar. Desktop layouts shrunk to fit phones.
- **Inaccessible bot checks:** CAPTCHAs that block keyboard or screen-reader users.
