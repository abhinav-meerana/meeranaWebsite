# Tech verification: Meerana marketing site (scroll storytelling + WebGL, static/SSG + FastAPI contact API)

Prepared: 2026-10-02. All sources accessed 2026-10-02 unless stated otherwise.

How this was checked:
- Package versions come from the npm registry (`npm view <pkg> version time dist-tags peerDependencies`) and the PyPI JSON API, both queried on 2026-10-02.
- Browser support comes from `@mdn/browser-compat-data` 8.1.4 (published 2026-10-01) and `web-features` 3.40.1 (Baseline status), both fetched from unpkg.
- Everything else comes from official docs, vendor pages and law-firm publications, as cited below.

Status tags:
- **[VERIFIED]**: confirmed against a primary or official source.
- **[PARTIAL]**: confirmed only through secondary sources, or with caveats.
- **[UNVERIFIED]**: could not be confirmed.

Legal and regulatory statements are research notes, not legal advice.

---

## 1. Latest stable versions and React compatibility [VERIFIED: npm registry, 2026-10-02]

| Package | Latest (`latest` tag) | Published | Peer deps / compatibility | Notes |
|---|---|---|---|---|
| next | **16.3.8** | 2026-09-30 | react / react-dom `^18.2.0 \|\| ^19.0.0`; Node `>=20.9.0` | Canary 16.4.0-canary.57. Next 16 supports Chrome/Edge/Firefox 111+ and Safari 16.4+ |
| react / react-dom | **19.3.0** | 2026-09-09 | n/a | `@types/react` 19.3.0 |
| typescript | **7.0.2** (native Go compiler) | 2026-07-08 | n/a | Latest 6.x is **6.0.3**. See the TypeScript notes below |
| three | **0.186.1** (r186) | 2026-09-24 | n/a | `@types/three` 0.186.0 |
| @react-three/fiber | **9.8.1** | 2026-09-24 | react / react-dom `>=19 <19.4`; three `>=0.156` | 9.8.0 (2026-09-22) added React 19.3 compatibility. v10 is still alpha (10.0.0-alpha.5, 2026-09-08; WebGPU/TSL-first) |
| @react-three/drei | **10.7.9** | 2026-09-25 | react `^19`; fiber `^9.0.0`; three `>=0.159` | Depends on three-stdlib `^2.35.6`. drei 11 is alpha (11.0.0-alpha.7) |
| @react-three/postprocessing | **3.1.3** | 2026-09-27 | react `^19`; fiber `>=9.7.0`; postprocessing `^6.36.0` | Uses `postprocessing` **6.39.5**, whose peer is three `>=0.168 <0.187`, so three is capped at r186 for now |
| gsap | **3.15.0** | 2026-04-13 | n/a | The public npm package ships SplitText.js, ScrollSmoother.js, MorphSVGPlugin.js, DrawSVGPlugin.js, ScrollTrigger.js and more (checked via the unpkg file listing) |
| @gsap/react | **2.1.2** | 2025-01-15 | gsap `^3.12.5`; react `>=17` | Provides `useGSAP` |
| lenis | **1.3.26** | 2026-08-05 | react `>=17` (optional, for `lenis/react`) | 2.0.0-dev.5 is on the `dev` tag |
| motion (formerly framer-motion) | **13.5.0** | 2026-10-01 | react `^18 \|\| ^19` | `motion` depends on `framer-motion` 13.5.0 |
| astro | **7.3.5** | 2026-09-24 | Node `>=22.12.0` | Astro 7.0 was released 2026-06-22 (Rust compiler, Vite 8 / Rolldown) |
| @astrojs/react | **7.0.0** | 2026-09-22 | react `^17 \|\| ^18 \|\| ^19` | |
| zod | **4.6.5** | 2026-09-13 | n/a | |
| @react-three/a11y | **3.0.0** | **2022-05-15** | fiber `>=8.0`, react `>=18` | **Effectively unmaintained.** No release in about 4.4 years. The repo is not archived, but recent commits are docs-only (latest 2026-08-20). It has never been tested against R3F 9 / React 19 |
| three-stdlib | **2.36.1** | 2025-11-10 | three `>=0.128` | Lightly maintained (type fixes in June 2026). Still pulled in by drei |
| meshoptimizer | **1.3.0** | 2026-09-25 | n/a | |
| @gltf-transform/cli | **4.5.1** | 2026-09-28 | Node `>=20` | `optimize` supports `--compress meshopt\|draco\|quantize` and `--texture-compress webp\|avif\|ktx2` (uses Sharp) |
| Backend (PyPI) | fastapi **0.142.2** (2026-09-30), pydantic **2.13.5** (2026-08-28), slowapi **0.1.10** (2026-06-13), fastapi-limiter **0.2.0** (2026-02-06), limits **5.8.0** (2026-02-05) | | | |

TypeScript notes:
- Next.js 16.3 type-checks with the project-local `tsc` CLI by default, which supports TS 6 and TS 7. The docs still label the `useTypeScriptCli` option experimental.
- typescript-eslint 8.71.0 declares the peer dependency `typescript >=4.8.4 <6.1.0`. **TypeScript 7 is therefore not supported by typescript-eslint.**

Sources:
- npm registry (`npm view`), 2026-10-02.
- https://github.com/pmndrs/react-three-fiber/releases (v9.8.0, v9.8.1, v10 alphas)
- https://r3f.docs.pmnd.rs/getting-started/installation: R3F 8 pairs with React 18, R3F 9 with React 19.
- https://nextjs.org/blog/next-16-3 (published 2026-08-03)
- https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli (lastUpdated 2026-08-03)
- https://nextjs.org/blog/next-16 (published 2025-10-21)
- https://astro.build/blog/astro-7/ (2026-06-22)
- https://gltf-transform.dev/cli
- https://pypi.org/pypi/{fastapi,pydantic,slowapi,fastapi-limiter,limits}/json

**Implication for this project:**
- Pin these versions: `next@16.3.x`, `react@19.3.x` (R3F's peer range stops at <19.4), `three@0.186.x` (pmndrs postprocessing stops at <0.187), and `typescript@~6.0.3` (use TS 7 only if you drop type-aware typescript-eslint).
- Do not adopt `@react-three/a11y`. Build accessibility in the DOM instead.
- Prefer `three/addons` over direct three-stdlib imports.

---

## 2. GSAP licensing today [VERIFIED]

**Everything is free, including former Club plugins.** Since GSAP 3.13 (blog post dated 2025-04-29), all of GSAP is free, commercial use included. That covers the formerly members-only plugins: SplitText, MorphSVG, ScrollSmoother, DrawSVG and the rest. All bonus plugins now ship in the public `gsap` npm package; this was confirmed in the gsap@3.15.0 file listing.

**License terms.** The license is the "Standard 'No Charge' GSAP License", owned by Webflow (effective 2025-04-30, last modified 2025-05-30).
- **Permitted uses:** any website, web application or digital interface. This explicitly includes companies that compete with Webflow in other lines of business.

**Restrictions:**
- **Prohibited uses** are GSAP inside no-code visual animation builders that compete with Webflow. The license wording is: "competes with Webflow’s visual animation building capabilities" (GSAP Standard License).
- You may not reverse-engineer GSAP to build such competitive products.
- You may not remove or alter GSAP's proprietary notices or branding.

**FAQ points:**
- Commercial use is covered by the standard license.
- AI-generated GSAP code is not a prohibited use.
- Niche visual tools that do not directly compete are generally acceptable; contact GSAP if unsure.

**Licence type.** This is a proprietary no-charge licence, not an OSI open-source licence.

**Older terms are gone.** The current page no longer has the pre-2025 clause that banned charging end users a fee. That wording survives only inside an HTML comment in the page source.

Sources:
- https://gsap.com/standard-license/
- https://gsap.com/licensing/
- https://gsap.com/blog/3-13/ (2025-04-29)
- https://unpkg.com/gsap@3.15.0/?meta

**Implication for this project:**
- ScrollTrigger, SplitText, ScrollSmoother, MorphSVG and DrawSVG can all be used on the Meerana marketing site at no cost.
- The only practical obligation is to keep GSAP's licence/notice comments intact in bundles.

---

## 3. Next.js static export (`output: 'export'`) limitations [VERIFIED: Next.js docs v16.3.8]

**Unsupported features** (they error in `next dev` when export is enabled):
- dynamic routes with `dynamicParams: true`, or without `generateStaticParams()`
- Route Handlers that rely on `Request`
- `cookies()`
- rewrites, redirects and headers set in `next.config`
- **Proxy** (Next 16 renamed `middleware.ts` to `proxy.ts`; `middleware.ts` is deprecated)
- ISR
- **Image Optimization with the default loader**
- Draft Mode
- **Server Actions**
- Intercepting Routes

**Supported features:**
- Server Components run at build time.
- Client Components work normally.
- Route Handlers are supported **only for `GET`**, with `export const dynamic = 'force-static'`, and they emit static files.
- `next/image` works with a **custom loader** (an image CDN) or with `images.unoptimized: true`, which serves source files as-is.

**i18n:**
- The App Router has no built-in i18n routing config. The documented pattern is `app/[lang]/...` plus `generateStaticParams`, with `<html lang={lang}>` in `app/[lang]/layout.tsx`. That pattern is fully static.
- The documented **locale detection/redirect uses `proxy.ts`, which is not available in static export.**
- The Pages Router `i18n` config explicitly does not integrate with `output: 'export'`.

**RTL.** Set `dir="rtl"` alongside `lang` in the `[lang]` root layout. This uses the same mechanism as `lang`, so it works without a server.

**`next/root-params`.** New in 16.3. It reads root params such as `[lang]` from Server Components. **[UNVERIFIED]** whether it works under `output: 'export'`; the `params` prop always works.

**Layouts persist across client-side navigation.** They keep state and do not re-render, so a WebGL canvas placed in a layout survives route changes.

Sources:
- https://nextjs.org/docs/app/guides/static-exports (lastUpdated 2026-08-25)
- https://nextjs.org/docs/app/guides/internationalization (lastUpdated 2026-06-10)
- https://nextjs.org/docs/pages/guides/internationalization (lastUpdated 2026-03-03)
- https://nextjs.org/docs/app/api-reference/components/image (lastUpdated 2026-08-25)
- https://nextjs.org/blog/next-16
- https://nextjs.org/docs/app/getting-started/layouts-and-pages

**Implication for this project:**
- Put redirects (`/` to `/en` or `/ar`), security headers (CSP, HSTS), 404 handling and trailing-slash policy in the **host/CDN config**.
- Pre-optimize images at build time (AVIF/WebP plus `unoptimized`) or use an image-CDN loader.
- Make the root `/` a language picker or a client-side redirect.
- Have the contact form POST cross-origin to FastAPI (needs a CORS allow-list), because there are no Server Actions or POST handlers.

---

## 4. R3F v9 + React 19 in the Next.js App Router; shared canvas; performance; fallback; WebGPU

### Compatibility [VERIFIED]

- R3F 9 pairs with React 19.
- 9.8.0 (2026-09-22) made R3F compatible with React 19.3, though not every new React API is supported. 9.8.1 fixed renderer disposal on unmount.
- v9 changes worth knowing:
  - The `gl` prop can be an async factory, which enables WebGPURenderer.
  - Types now come through `ThreeElements`.
  - Automatic sRGB conversion of texture props was removed.

### App Router notes [VERIFIED: Next docs; R3F docs]

- Canvas code must live in `'use client'` files.
- `next/dynamic` with `ssr: false` is **only allowed in Client Components**; it errors in Server Components. Use a client wrapper that does `dynamic(() => import('./Scene'), { ssr: false })`.
- R3F docs still suggest `transpilePackages: ['three']` for Next ≥13.1.

### One shared canvas vs many [VERIFIED: drei docs]

**drei `<View>`:**
- It uses `gl.scissor` to cut **one canvas and one WebGL context** into viewports. Each viewport is tied to a DOM element and follows it on scroll and resize.
- Render the views with `<View.Port/>` inside the Canvas.
- The canvas should ideally be full-screen with absolute or fixed positioning, either under or over the HTML.
- Point `eventSource` at a parent that contains both the HTML and the canvas.
- Set `frames={1}` for views that never move.
- The `track` prop is deprecated; use inline Views instead.

**Multiple `<Canvas>` elements:**
- Each canvas creates its own WebGL context.
- Chromium force-loses the oldest context when a per-page active-context cap is exceeded, and logs a too-many-contexts warning (seen in `webgl_rendering_context_base.cc`).
- The exact cap comes from GPU preferences. **[UNVERIFIED]** commonly cited figures such as 16 on desktop.

**Avoid drei `ScrollControls`.** It creates its own HTML scroll container in front of the canvas, which fights native page scroll and ScrollTrigger.

### Performance [VERIFIED: R3F/drei docs]

**Render on demand:**
- Use `frameloop="demand"` and call `invalidate()` when something changes.
- `invalidate()` only requests a frame; it does not render immediately.

**PerformanceMonitor:**
- Callbacks: `onIncline`, `onDecline`, `onChange` (factor 0–1) and `onFallback` (called after N flip-flops).
- Bounds default to [50, 60] fps, or [50, 90] fps on displays above 90 Hz.

**Adaptive quality:**
- `<Canvas performance={{ min: 0.5 }}>` combined with `regress()`.
- `<AdaptiveDpr/>` lowers DPR on regress.
- The default `dpr` is `[1, 2]`.

**Draw calls and loading:**
- Reuse geometries and materials, and use instancing.
- `useLoader` results are cached.

**GPU tiering:**
- `useDetectGPU` gives a GPU tier.
- **detect-gpu loads its benchmark data from unpkg by default**, so self-host it.

**Model loading:**
- drei `useGLTF` enables Draco and Meshopt by default.
- **The Draco decoder defaults to `https://www.gstatic.com/draco/...`**, so self-host it or prefer Meshopt.
- Compress models with `gltf-transform optimize --compress meshopt --texture-compress ktx2|webp`.

### WebGL fallback detection [VERIFIED]

- three.js manual: call `WebGL.isWebGL2Available()` (from `three/addons/capabilities/WebGL.js`) before initialising.
- R3F `<Canvas fallback={...}>` renders DOM content when GL is unsupported.
- WebGL2 has been Baseline "widely available" since 2024-03-20 (web-features).
- Recommended in addition:
  - Gate 3D on `prefers-reduced-motion` and GPU tier, and show a poster image or video otherwise.
  - Handle `webglcontextlost`.

### WebGPU status [VERIFIED]

**three.js manual (WebGPURenderer guide, added in r182):**
- WebGPURenderer is the next-generation renderer. It falls back to WebGL 2 automatically.
- You import it from `three/webgpu`, and it initialises asynchronously (`await renderer.init()` or `setAnimationLoop`).
- It does **not** support `ShaderMaterial`, `RawShaderMaterial`, `onBeforeCompile` or `EffectComposer`; these must be ported to TSL and node-based post-processing.
- The manual still describes the renderer as experimental, though much more mature than before.
- It states that **WebGLRenderer remains maintained and is the recommended choice for pure WebGL 2 apps**.

**Browser support (MDN BCD 8.1.4):**

| Browser | WebGPU support |
|---|---|
| Chrome/Edge 113+ | Windows, macOS, ChromeOS |
| Chrome/Edge 144+ | Adds Linux (Intel Gen12+ only) |
| Chrome Android 121+ | Yes |
| Safari and iOS Safari 26 | Yes |
| Firefox 141+ | Windows only (partial) |
| Firefox 145+ / 147+ | macOS on Apple silicon (Tahoe from 145, older macOS from 147) |
| Firefox | No Intel Macs, no Linux |
| Firefox Android | No |

WebGPU is therefore **not Baseline** (web-features).

**R3F and post-processing:**
- R3F v10 (WebGPU-first) is still alpha.
- pmndrs `postprocessing` 6.x is built around WebGLRenderer.

Sources:
- https://r3f.docs.pmnd.rs/getting-started/installation
- https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide
- https://r3f.docs.pmnd.rs/advanced/scaling-performance
- https://r3f.docs.pmnd.rs/api/canvas
- https://drei.docs.pmnd.rs/portals/view (source: github.com/pmndrs/drei/docs/portals/view.mdx)
- drei docs: controls/scroll-controls, performances/performance-monitor, performances/adaptive-dpr, misc/detect-gpu-use-detect-gpu, loaders/gltf-use-gltf
- https://github.com/pmndrs/drei/blob/master/src/core/Gltf.tsx
- https://nextjs.org/docs/app/guides/lazy-loading (lastUpdated 2026-03-10)
- https://threejs.org/manual/#en/webgl-compatibility-check
- https://threejs.org/manual/#en/webgpurenderer (source: github.com/mrdoob/three.js/manual/pages/webgpurenderer.html)
- https://github.com/mrdoob/three.js/releases (r182–r186)
- https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/modules/webgl/webgl_rendering_context_base.cc
- https://unpkg.com/detect-gpu/README.md

**Implication for this project:**
- Mount **one persistent, fixed, full-viewport `<Canvas>` in the `[lang]` layout** (client component, lazy-loaded with `ssr:false` after LCP).
- Then either:
  - use drei `<View>` placeholders in each section, or
  - use one scene whose camera/state is driven by ScrollTrigger progress (refs/zustand read in `useFrame`), with `frameloop="demand"` and `invalidate()` on scroll updates.
- Use **WebGLRenderer in production**. Treat WebGPU as R&D only.

---

## 5. GSAP ScrollTrigger best practices [VERIFIED unless tagged]

**`gsap.matchMedia()`**
- Setup code runs only while a media query matches. Animations and ScrollTriggers created inside are **reverted automatically** when it stops matching.
- Named conditions, such as `isDesktop`, `isMobile`, and `reduceMotion: "(prefers-reduced-motion: reduce)"`, are exposed through `context.conditions`.
- An optional scope (element or React ref) can be passed.
- In gsap-core 3.15.0 source, a `MatchMedia` instance registers itself with the active `gsap.context()`, so `useGSAP` cleanup reverts it.

**Mobile address bar:**
- With `ignoreMobileResize`, vertical resizes under 25% of viewport height on touch-only devices do not trigger `ScrollTrigger.refresh()`. This avoids jumps, at the cost of slightly stale positions.
- The option was added in 3.10.0. In the 3.15.0 source it is **on by default for touch-only devices** (`Observer.isTouch === 1`).
- `autoRefreshEvents` defaults to `visibilitychange,DOMContentLoaded,load,resize`.

**`ScrollTrigger.normalizeScroll()`** forces scrolling onto the JS thread.
- Benefits:
  - stops address-bar show/hide on most mobile devices
  - keeps pin updates synchronised
  - works around iOS Safari touch quirks and overscroll bounce
- Trade-offs:
  - gives up control during multi-touch and pinch
  - mobile scrollbars no longer auto-hide
  - still labelled experimental
- It is opt-in; native scroll is the default.

**Pinning pitfalls:**
- Don't animate the pinned element itself.
- Create triggers in page order.
- Use `anticipatePin: 1` against flashes.
- Use `pinReparent` only if needed.
- `pinType: fixed` is used only when the scroller is `<body>`.
- Use function-based `start`/`end` values for responsive layouts.
- Call `refresh()` after content or layout changes, including web-font load. **[recommendation]** Use `document.fonts.ready`.
- Don't use `scroll-behavior: smooth` on the root; it skews refresh measurement.
- Don't attach ScrollTriggers to child tweens of a timeline.
- Kill and recreate triggers on SPA navigation.

**Native scrolling:**
- ScrollTrigger does no scroll-jacking and works with native scroll and CSS scroll-snap. A smooth-scroll library is optional.
- If Lenis is used, the documented integration is:
  - `lenis.on('scroll', ScrollTrigger.update)`
  - drive `lenis.raf` from `gsap.ticker`
  - `gsap.ticker.lagSmoothing(0)`
- Lenis honours `prefers-reduced-motion` by default (`respectReducedMotion: true`).
- Lenis limitations: no native CSS scroll-snap (use `lenis/snap`), capped at 60 fps on Safari, no smooth scroll over iframes.

**React (`@gsap/react` `useGSAP`):**
- Drop-in replacement for `useEffect`/`useLayoutEffect`. It wraps `gsap.context()`, so animations, ScrollTriggers, Draggables and SplitText instances are reverted on unmount.
- Options: `scope`, `dependencies`, `revertOnUpdate`.
- Use `contextSafe()` for event-handler animations.
- It uses an isomorphic layout effect (SSR-safe), and App Router files need `"use client"`.
- It handles Strict Mode double invocation.

**Viewport units.** `svh`/`lvh`/`dvh` have been Baseline widely available since 2025-06-05. **[recommendation]** Size pinned panels with `100svh` or `100lvh` to reduce address-bar jumps.

Sources:
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.config()
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll()
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/resources/st-mistakes/
- https://gsap.com/resources/React/
- https://unpkg.com/gsap@3.15.0/src/ScrollTrigger.js (around line 1358)
- https://unpkg.com/gsap@3.15.0/src/gsap-core.js (around line 2978)
- https://github.com/darkroomengineering/lenis (README)
- web-features 3.40.1

**Implication for this project:**
- Use native scroll, ScrollTrigger, and `gsap.matchMedia()` with desktop, mobile and reduced-motion branches, all inside `useGSAP`.
- Do not enable `normalizeScroll` by default. Add it only if iOS pin jitter is unacceptable after testing.
- Lenis is optional polish, not a requirement.

---

## 6. CSS scroll-driven animations (`animation-timeline: scroll()/view()`)

**Support** (MDN BCD 8.1.4, published 2026-10-01) **[VERIFIED]**. This covers `animation-timeline` (`scroll()`/`view()`), `scroll-timeline`, `view-timeline` and `animation-range`.

| Browser | Status |
|---|---|
| Chrome/Edge 115+, Chrome Android 115+ | Supported |
| Samsung Internet 23+ | Supported |
| Safari and iOS Safari 26+ | Supported |
| Firefox | "preview" only: on by default in Nightly; behind `layout.css.scroll-driven-animations.enabled` in Beta and Release |
| Firefox Android | Not supported |

**Firefox status:**
- Firefox stable is **157.0** (released 2026-09-29), Beta 158 and Nightly 159 (Mozilla product-details).
- web-features: scroll-driven animations are **not Baseline**.
- Scroll-driven animations are an **Interop 2026 focus area** (announced 2026-02-12). A shipping date for Firefox stable is **[UNVERIFIED]**.

**caniuse discrepancy.** caniuse (data from Aug 2026) shows about 87% global support and marks "Firefox 160" as supported. That conflicts with BCD's preview-only status (likely a pre-release mapping). **[UNVERIFIED]** until Firefox ships it in stable.

Sources:
- https://unpkg.com/@mdn/browser-compat-data (data.json, v8.1.4)
- https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Experimental_features
- https://product-details.mozilla.org/1.0/firefox_versions.json
- https://web.dev/blog/interop-2026
- https://caniuse.com/mdn-css_properties_animation-timeline_scroll

**Implication for this project:**
- Yes, CSS can replace JS for **simple reveals, progress bars and parallax** as progressive enhancement:
  - wrap them in `@supports (animation-timeline: view())`
  - and in `@media (prefers-reduced-motion: no-preference)`
  - make content visible by default, so Firefox simply shows it without animation.
- Keep GSAP for pinning, scrubbed 3D camera paths, timeline choreography and SplitText.

---

## 7. Core Web Vitals thresholds [VERIFIED]

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| LCP | ≤2.5 s | 2.5–4 s | >4 s |
| INP | ≤200 ms | 200–500 ms | >500 ms |
| CLS | ≤0.1 | 0.1–0.25 | >0.25 |

- Thresholds are assessed at the **75th percentile**, with mobile and desktop segmented separately.
- INP became a stable Core Web Vital in 2024, replacing FID.
- Google Search Central's CWV page (last updated 2025-12-10) restates the same thresholds.

**2025–2026 changes.** There were **no threshold changes** in official sources. Chrome changed how the metrics are implemented:
- **LCP:**
  - M133: coarsened cross-origin `renderTime`
  - M143: fixed text paint timestamps
  - M147: candidates use the largest *painted* image instead of the largest pending one
  - M151: prompt LCP emission for video
- **INP:**
  - M133–135: event-timing tweaks
  - M144: `performance.interactionCount` became stable
  - M147, M148 and M150: interactionId and event-target refinements
- **CLS:**
  - M145: attribution in CSS pixels, with sources sorted by impact

**Blog claims rejected.** Some SEO blogs say "good" LCP was tightened to 2.0 s. Google's documentation does not support this: **[UNVERIFIED / treated as false]**.

Sources:
- https://web.dev/articles/vitals (last updated 2024-10-31)
- https://developers.google.com/search/docs/appearance/core-web-vitals (updated 2025-12-10)
- https://chromium.googlesource.com/chromium/src/+/main/docs/speed/metrics_changelog/ (lcp.md, inp.md, cls.md)

**Implication for this project:**
- The LCP element must be HTML text or an image, never the WebGL canvas. Defer the 3D chunk until after LCP.
- Keep GLTF parsing and shader compilation off interaction paths to protect INP.
- Reserve canvas and media boxes, and use size-adjusted font fallbacks, to protect CLS.

---

## 8. Bot protection for a public contact form; FastAPI rate limiting

| | Cloudflare Turnstile | hCaptcha | Google reCAPTCHA (now "Google Cloud Fraud Defense") |
|---|---|---|---|
| Cost | **Free:** unlimited challenges, up to 20 widgets, 10 hostnames per widget. Enterprise: custom. Does **not** require Cloudflare CDN/proxy | **Free** tier (vendor says most users get a visible challenge). **Pro** from $99/mo billed annually ($139 month-to-month) including 100k evaluations, then $0.99 per extra 1k. Enterprise: custom | **Essentials:** free up to 10,000 assessments/month per org. **Premium:** 10,001–100,000 for an $8 flat fee; above 100k, $1 per 1,000. **Enterprise:** $1 per 1,000 with a 12-month commitment |
| Server verify | `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` (secret, response, optional remoteip and idempotency_key). Token valid **5 min**, single use | `POST https://api.hcaptcha.com/siteverify` (form-encoded; secret, response; sitekey and remoteip recommended). Single use, about **120 s** expiry | Legacy `POST https://www.google.com/recaptcha/api/siteverify`. Token valid **2 min**, single use. That doc page is now marked deprecated and points to the Fraud Defense docs. v3 returns a score; you choose the threshold |
| Privacy | Privacy addendum (updated 2025-06-18): collects IP, TLS fingerprint, User-Agent and sitekey/origin. Cookies are strictly necessary only. Cloudflare acts as processor (you are controller), plus limited controller use to improve bot detection | GDPR page (updated 2024-01-15): processor role, does not sell or rent end-user personal data, minimal retention, analytics stored in the EU by default, DPF and SCCs | Sets the `_GRECAPTCHA` cookie. The badge may be hidden only if reCAPTCHA branding stays visible in the flow. Data goes to Google |

**FastAPI rate limiting:**

**slowapi 0.1.10** (MIT)
- An adaptation of flask-limiter on top of `limits`.
- Apply it with the `@limiter.limit("5/minute")` decorator. The endpoint must accept `request: Request`.
- Backends: memory, Redis, memcached.
- The docs still call it alpha-quality, while the README says it is used in production.

**fastapi-limiter 0.2.0**
- Now built on `pyrate-limiter`, used via `Depends(RateLimiter(...))`.
- **Its default identifier trusts the first `X-Forwarded-For` value, which can be spoofed** unless a trusted proxy overwrites the header.

**limits 5.8.0** is the underlying library.

**[recommendation]** Also apply an edge rate limit (CDN/WAF rule or nginx `limit_req`), plus a honeypot field, a minimum fill-time check and Pydantic validation.

Sources:
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/turnstile/plans/
- https://www.cloudflare.com/turnstile-privacy-policy/
- https://docs.hcaptcha.com/
- https://www.hcaptcha.com/pro
- https://www.hcaptcha.com/gdpr
- https://cloud.google.com/security/products/recaptcha#pricing
- https://developers.google.com/recaptcha/docs/verify (last updated 2024-10-14, marked deprecated)
- https://developers.google.com/recaptcha/docs/faq (updated 2026-04-02)
- https://slowapi.readthedocs.io/en/latest/
- https://pypi.org/project/fastapi-limiter/

**Implication for this project:**
- **Use Cloudflare Turnstile.** It is free, needs no proxy, has the lightest privacy footprint of the three, and verification from FastAPI is simple.
- FastAPI should:
  - verify the token with `siteverify` before any processing, with a timeout and `idempotency_key`
  - check `hostname`
  - rate-limit with slowapi backed by Redis, keyed on the trusted client IP (from the proxy's real-IP header, not raw `X-Forwarded-For`).
- Disclose Cloudflare in the privacy notice as a processor with cross-border transfer.

---

## 9. UAE PDPL: Federal Decree-Law No. 45 of 2021

### Status

**Basics:**
- Issued 20 Sep 2021; in force 2 Jan 2022 (Art. 31).
- Executive Regulations were due within 6 months (Art. 28).
- Controllers then get **6 months after the ERs are issued** to regularise, extendable once (Art. 29).
- Administrative violations and penalties are to be set by a separate Cabinet decision (Art. 26).

**Executive Regulations: NOT issued as of the latest reputable sources [PARTIAL]**
- DLA Piper (updated 2025-01-27): not published.
- Chambers *Data Protection & Privacy 2026* (BSA Law, 2026-03-10): not issued; the Data Office is not fully operational.
- Ashurst Perkins Coie *Data Bytes 67* (2026-07-17): ERs still pending.
- An ITSEC page reports checking the UAE legislation portal on 2026-09-23 and finding no ERs and no penalties decision.

**Contradictory claims [UNVERIFIED]:**
- Several vendor and SEO sites say the ERs were issued, citing inconsistent instruments (Cabinet Decision No. 33 of 2024; No. 83 of 2022).
- These contradict the law-firm sources and are treated as unreliable.
- The official portals (uaelegislation.gov.ae, u.ae, ai.gov.ae) were **not reachable from this environment** (Cloudflare 403 / connection reset). Primary-source confirmation therefore remains **[UNVERIFIED]**.
- Fine amounts circulating online (for example AED 20m) are **[UNVERIFIED]**; no penalties decision was found.

**Regulator:**
- The UAE Data Office never became fully operational.
- On **14 June 2026** the **Federal Authority for AI and Data** was established. It consolidates the AI Office, TDRA's digital-government sector and the UAE Data Office.
- Source for this: Ashurst Perkins Coie (2026-07-17). The founding decree number was not found **[PARTIAL]**.

### Scope (Art. 2)

**Who it covers:**
- data subjects who reside or have a place of business in the UAE
- UAE-based controllers and processors, wherever their data subjects are
- foreign controllers and processors handling data of UAE data subjects

**Exclusions:**
- government data and authorities
- security and judicial authorities
- purely personal use
- health data and banking/credit data that have their own legislation
- **companies in free zones with their own data-protection legislation** (DIFC, ADGM)

**Definition of personal data.** It explicitly lists online identifiers, so IP addresses and cookie IDs count.

### Key obligations for a contact form and analytics [VERIFIED against an unofficial English translation of the law (Amereller), paraphrased]

**Legal basis (Art. 4).** Consent is the default. There are 11 exceptions, including:
- processing necessary to take steps toward a contract **at the data subject's request** (4(10))
- legal obligations (4(11))

**Consent (Art. 1 definition, Art. 6):**
- It must be a specific, informed, unambiguous statement or clear affirmative action.
- The controller must be able to prove it.
- It must be clear, simple and accessible.
- It must state the right to withdraw, and withdrawal must be easy.

**Processing controls (Art. 5):**
- fair, transparent and lawful processing
- a specific purpose, with only compatible further use
- data minimisation
- accuracy and correction
- security
- **no retention after the purpose is fulfilled unless anonymised**

**Transparency (Art. 13):**
- *Before processing*, tell people the purposes, the recipients inside or outside the UAE, and the cross-border safeguards.
- On request, also provide retention criteria and how to complain.

**Controller duties (Art. 7):**
- technical and organisational security measures
- privacy by default
- a **record of processing**
- using only processors that give sufficient guarantees

**Breach notification (Art. 9).** Notify the Office **immediately** on becoming aware, and notify affected data subjects when their privacy is prejudiced. Detailed timelines are left to the ERs.

**DPO (Art. 10).** Required only for high-risk or new-technology processing, or large-scale or systematic processing of sensitive data. That is likely **not** triggered by a contact form (assessment).

**Cross-border transfers:**
- **Art. 22:** transfers are allowed to jurisdictions approved as adequate by the Office. **No adequacy list has been published.**
- **Art. 23:** alternatives are contractual safeguards, the **express consent** of the data subject, necessity for a contract with the data subject, legal claims, and a few others. Details are pending the ERs.

### DIFC / ADGM [VERIFIED for the law text; PARTIAL for interpretation]

**Business Bay is mainland Dubai,** so the federal PDPL applies, provided the company is licensed on the mainland rather than by the DIFC.

**DIFC Data Protection Law No. 5 of 2020** (consolidated July 2025, amended by DIFC Laws Amendment Law No. 1 of 2025). Art. 6(3) applies the law to:
- controllers and processors incorporated in the DIFC
- processing *in the DIFC* by others as part of stable arrangements

**2025 DIFC amendments:**
- Commentary from BSA Law (2025-07-21) and DLA Piper (2025-07-29) says they clarified extraterritorial reach (for example, to data of people who live or work in the DIFC) and added a private right of action.
- This matters only if Meerana processes data in or through the DIFC. Confirm with counsel.

**ADGM Data Protection Regulations 2021** apply to ADGM entities only.

Sources:
- Unofficial English translation of the law: https://protection-data.ae/wp-content/uploads/2023/10/federal-decret-law-45-uae.pdf
- https://www.dlapiperdataprotection.com/countries/uae-general/law.html (updated 2025-01-27)
- https://www.dlapiperdataprotection.com/countries/uae-general/transfer.html
- https://www.dlapiperdataprotection.com/countries/uae-general/online-privacy.html
- https://practiceguides.chambers.com/practice-guides/data-protection-privacy-2026/uae/trends-and-developments (2026-03-10)
- https://www.ashurstperkinscoie.com/en/insights/data-bytes-67-your-emea-data-privacy-update-for-july-2026/ (2026-07-17)
- https://itsecnow.com/regulators/pdpl-executive-regulations-2026
- https://www.trade.gov/market-intelligence/united-arab-emirates-allows-cross-border-data-flows-personal-data (2024-01-22)
- DIFC consolidated law PDF (July 2025): assets.difc.com .../data-protection-law.pdf
- https://bsalaw.com/insight/6984/
- https://privacymatters.dlapiper.com/2025/07/dubai-international-financial-centre-updates-to-the-difc-protection-laws/

**Implication for this project:**
- Collect only the fields needed to answer the enquiry. The legal basis for replying is a request toward a contract.
- Add a separate **unticked** consent checkbox for marketing follow-up.
- Link a bilingual privacy notice next to the submit button covering purposes, processors (hosting, email, Cloudflare) and cross-border transfers.
- Set a retention schedule (for example, delete unconverted enquiries after N months).
- Put processor agreements in place and keep a record of processing.
- Prepare a breach runbook.
- Consider UAE-region hosting for the FastAPI backend and database to simplify Art. 22/23.
- Re-check ER status before launch.

---

## 10. Privacy-friendly analytics; is a cookie banner needed?

**Plausible [VERIFIED]**
- No cookies, local storage or browser cache.
- Unique visitors are counted with a daily-rotating salted hash of salt, domain, IP and User-Agent. Raw IP and User-Agent are not stored.
- EU-hosted. The vendor states no cookie banner is needed under GDPR, PECR or CCPA.
- Cloud plan from **$9/month** for 10k pageviews, with a 30-day trial.
- Self-hostable Community Edition: AGPL-3.0, **v3.2.1** (2026-05-15).

**Umami [PARTIAL]**
- MIT licence, **v3.4.0** (2026-09-17). The README advertises cookie-free tracking.
- Self-host with Node and PostgreSQL, or use the cloud version.
- umami.is docs were unreachable from this environment, so the hashing and session details are **[UNVERIFIED]**.

**Matomo [PARTIAL]**
- GPL-3.0, **5.14.0** (2026-09-21). Cookies can be disabled.
- A CNIL consent-exempt configuration is possible: audience measurement only, no cross-referencing or sharing, IP anonymisation, cookie life ≤13 months, retention ≤25 months.
- These conditions come from secondary sources; matomo.org was unreachable.

**GA4 with Consent Mode v2 [VERIFIED]**
- Consent types: `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`.
- *Basic* mode blocks tags until consent.
- *Advanced* mode sends cookieless pings when consent is denied, which feed modelling (Google dev docs updated 2026-07-30).
- For EEA traffic Google requires collecting consent and passing v2 signals for ads and measurement features.
- A vendor blog reports a June 2026 change that makes consent mode the single control instead of Google Signals: **[UNVERIFIED]** against a Google primary source.

**Is a banner needed for cookieless analytics?**

*EU visitors:*
- ePrivacy Art. 5(3) covers any storage of or access to information on the device, not just cookies.
- EDPB Guidelines 2/2023 v2.0 (adopted 2024-10-07) explicitly analyse pixel and URL tracking, local processing, IP-only tracking and unique identifiers. So "cookieless" is not automatically exempt.
- Tools that store nothing on the device and build no persistent identifier (Plausible, Umami) are widely deployed without a banner. That is the vendors' position, and supervisory-authority views vary.

*UAE:*
- There is no cookie-specific rule. The PDPL is built around consent, and online identifiers count as personal data.
- GA4-style tracking therefore warrants consent. Aggregate cookieless analytics should still be disclosed in the privacy notice (legal judgement; confirm with counsel).

Sources:
- https://plausible.io/data-policy (Sep 2026)
- https://plausible.io/#pricing
- GitHub API releases for umami-software/umami, plausible/analytics and matomo-org/matomo
- https://github.com/umami-software/umami (README)
- https://matomo.org/faq/new-to-piwik/how-do-i-use-matomo-analytics-without-consent-or-cookie-banner/ (not reachable; secondary sources used)
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://support.google.com/analytics/answer/9976101
- https://support.google.com/tagmanager/answer/13695607
- https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf

**Implication for this project:**
- Start with **Plausible (EU cloud) or self-hosted Umami** (could be hosted in the UAE), which means no analytics consent banner.
- If paid media later needs GA4 or Ads, add a consent management platform with Consent Mode v2 at that point.

---

## 11. Arabic/RTL typography

**Almarai on Google Fonts [VERIFIED: Google Fonts metadata and CSS2 API]**
- **Weights: 300, 400, 700, 800 only.**
  - No 500 or 600; requesting 500 returns an error.
  - No italics.
- Static font, with no variable axes.
- Subsets: **arabic, latin**.
- Designers: Boutros Fonts / Mourad Boutros. Metadata lastModified 2025-09-02.

**Poppins on Google Fonts [VERIFIED]**
- **Weights: 100–900, each with an italic** (18 styles). Static font.
- Subsets: latin, latin-ext, devanagari. **No Arabic glyphs.**

**Delivery [VERIFIED]**
- The Google CSS2 API serves per-subset WOFF2 files with `unicode-range`.
- `next/font/google`:
  - **downloads the fonts at build time and self-hosts them**, so the browser makes no requests to Google
  - defaults to `display: 'swap'`
  - `preload: true` preloads only the listed `subsets`
  - requires `weight` for non-variable fonts
  - `adjustFontFallback: true` (the default) generates a size-adjusted fallback that reduces CLS
- web.dev guidance (2022-10-04):
  - Use WOFF2 only, and subset via `unicode-range`.
  - `font-display: optional` minimises layout shift; it blocks for at most about 100 ms and the web font may not be applied.
  - `swap` shows text fastest but can shift layout.
  - Preload only critical fonts.

**Logical CSS [VERIFIED: web-features]**
- Logical properties have been Baseline widely available since 2024-03-20:
  - `margin-inline-*`, `padding-inline-*`, `inset-inline-*`
  - `border-start-*` and related properties
  - `text-align: start|end`
- `:dir()` has been Baseline widely available since 2026-06-07.
- Set `<html lang="ar" dir="rtl">` per locale.

**Engineering notes [recommendations]**
- CSS transforms and GSAP `x`/`xPercent` are physical, not logical, so invert their sign in RTL.
- Test horizontal ScrollTrigger sections in RTL.
- Avoid letter-spacing on Arabic text.
- Give Arabic text a more generous line-height.
- Mirror only directional icons.

Sources:
- https://fonts.google.com/specimen/Almarai
- https://fonts.google.com/specimen/Poppins
- https://fonts.google.com/metadata/fonts
- https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap
- https://nextjs.org/docs/app/api-reference/components/font (lastUpdated 2025-08-06)
- https://web.dev/articles/font-best-practices
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- web-features 3.40.1

**Implication for this project:**
- Load **Almarai 400/700/800** (Arabic) and **Poppins 400/500/600** (English) through `next/font` as CSS variables.
- Preload only the active locale's subset.
- Use `swap` for display text and consider `optional` for body text.
- Write all layout with logical properties, and give GSAP x-offsets a direction multiplier.
