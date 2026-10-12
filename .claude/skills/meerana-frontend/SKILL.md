---
name: meerana-frontend
description: Frontend architecture, implementation sequencing and testing for the Meerana Technologies website (Next.js App Router static export, TypeScript, React Three Fiber, GSAP ScrollTrigger, typed content with evidence IDs, FastAPI contact contract). Use whenever scaffolding, adding routes or components, defining content schemas, wiring the contact form, setting performance budgets, writing tests/CI, planning implementation order, or reviewing a pull request for this site. Trigger for "start building", "add a product page", "set up the repo", "why is the bundle so big", or "is this ready to ship".
---

# Meerana frontend architecture & delivery

## Purpose
Turn the approved plan into a maintainable, fast, testable site where content lives in the DOM, every public claim is evidence-linked, 3D and motion are lazy enhancements, and releases are gated by automated checks.

## When to use
- Scaffolding.
- Adding pages, components or content.
- Integrating the contact API.
- Setting budgets.
- Writing tests and CI.
- Sequencing work.
- Code review.

## Required inputs
- `plan/11-technical-architecture.md`: stack, routes, file structure, schemas, contracts, budgets.
- `plan/12-implementation-backlog.md`: phase, dependencies and status.
- `plan/13-acceptance-and-launch-checklist.md`.
- Outputs of the other Meerana skills for the feature being built.

## Workflow
1. **Check the backlog item's dependencies.** Don't build features blocked by evidence or assets. Use the documented placeholder strategy instead (poster, labelled illustrative UI, `confirm-with-meerana` copy kept out of production builds).
2. **Content first.**
   - Add or modify typed content in `content/` (zod schemas in `content/schema.ts`).
   - Public claims carry `evidence: EvidenceId[]`.
   - Run `npm run content:check`. It validates schemas and cross-checks evidence IDs against `plan/03-evidence-register.csv` statuses.
3. **Component boundaries.**
   - Server components render content.
   - Client components exist only for interactive islands: `ChapterTimeline`, `ProductDemo`, `SceneSlot`, `ContactForm`, `MegaNav`.
   - The R3F canvas is created once per page in a client `StageProvider` and loaded via `next/dynamic` with `ssr: false`.
4. **Motion and 3D.** Follow meerana-scroll-choreography and meerana-webgl-scenes. Timelines are colocated with sections; scenes live in `scenes/`.
5. **Contact.** Implement against the contract in the architecture doc (`POST /v1/enquiries`):
   - client-side validation that mirrors the server schema
   - Turnstile (or the chosen provider) token
   - honeypot field
   - idempotency key
   - graceful error states
   - no PII in analytics events
6. **Tests and CI** (all required to merge):
   - `tsc --noEmit`
   - ESLint
   - `content:check`
   - unit tests (Vitest) for schemas and state machines
   - Playwright e2e on chromium, webkit and mobile emulation: navigation, product deep links, demo steps by keyboard, reduced-motion mode, WebGL-disabled mode, contact form with a mocked API
   - axe via Playwright
   - Lighthouse CI budgets
   - bundle-size check
7. **Perf verification.** Profile each chapter in Chrome Performance with 4× CPU throttle. Record the results in the PR.

## Expected outputs
- Code.
- Content entries.
- Tests.
- CI configuration.
- PR notes with perf, a11y and evidence checks.

## Quality checks / acceptance (budgets)
- Mobile (Moto G Power-class, 4G profile): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. The target is CLS ≤ 0.05.
- Initial JS ≤ 180 KB gzip on the homepage, excluding the lazy 3D chunk.
- 3D chunk ≤ 250 KB gzip. Scene assets follow the WebGL skill budgets.
- Lighthouse (mobile): Performance ≥ 85 on 3D routes and ≥ 95 elsewhere. Accessibility ≥ 95. SEO ≥ 95. Best Practices ≥ 95.
- Zero console errors on every route, with and without WebGL.
- `content:check` passes. No production build contains content with status `confirm-with-meerana` / `do-not-use`. A preview build may show it with a visible "UNCONFIRMED" flag.

## Project constraints
- Stack: Next.js (App Router, `output: 'export'`), TypeScript strict, React Three Fiber + minimal drei, GSAP/ScrollTrigger with `@gsap/react`, CSS Modules + CSS custom properties (tokens). Tailwind is not used; the design system lives in tokens.
- No Lenis or Framer Motion. Any new dependency needs a justification line in the PR.
- The contact backend (FastAPI) may not exist yet. Code against the contract and a mock (MSW) and never hard-code credentials.
- Analytics: privacy-friendly, configured per the decision log. No third-party trackers before consent where consent is required.
- Images: build-time responsive AVIF/WebP via a sharp script, because `next/image` optimisation is unavailable in static export.

## Failure modes and anti-patterns
- **Recovered code in production:** shipping Figma Make v17 code (MetaBalls, ClickSpark, GradualBlur, fake console data). Salvage only the content schema ideas and verified copy.
- **Client-heavy pages:** `"use client"` at page level, which pushes all content into hydration.
- **Wasteful canvases:** one canvas per section; leaking WebGL contexts between routes.
- **Untestable motion:** animations without reduced-motion branches or tests.
- **Content in components:** hard-coded content strings without evidence IDs.
- **Over-trusting the client:** a form that trusts client validation, or exposes API keys in the bundle.
