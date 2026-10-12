---
name: meerana-webgl-scenes
description: WebGL/3D scene design, asset pipeline and performance for the Meerana Technologies website using three.js via React Three Fiber. Use whenever designing, modelling, optimising, lighting, loading or debugging any 3D element — the ecosystem lattice, product objects (gate controller, phone, process graph, camera), scene transitions, GPU budgets, WebGL fallbacks, glTF/KTX2 assets — or when someone proposes adding 3D, particles or shaders anywhere on the site.
---

# Meerana WebGL scenes

## Purpose
Use 3D only where spatial form explains something: where a product operates, how parts relate, or how an object becomes an interface. Every scene must stay fast, accessible, and degrade cleanly.

## When to use
- Proposing a 3D element.
- Building scene geometry and materials.
- Exporting or optimising models.
- Implementing scene lifecycle.
- Diagnosing GPU or perf issues.
- Implementing fallbacks.

## Required inputs
- The storyboard beat and motion spec entry (`M-…`).
- Brand tokens (meerana-brand), for materials.
- The scene inventory and budgets in `plan/11-technical-architecture.md`.

## Purpose test (run before building)
Write one sentence: "This scene shows ___ that a static image or DOM layout could not." Accepted answers include:
- Spatial mapping of products to operating environments.
- An object resolving into its UI.
- Process structure as a navigable graph.

If the sentence is weak, use a static illustration or DOM.

## Visual language
- **Geometry vocabulary:** the Meerana logo's isometric parallelogram cell. Lattices, extrusions and instanced cells stand in for "systems". Product objects are simplified, architectural low-poly forms (gate barrier and controller, phone and desk, camera on a mast, graph nodes). Not photoreal, not sci-fi.
- **Materials:**
  - Matte "architectural model" surfaces in white, `#EDEDED` and navy tints.
  - Fine line edges.
  - Product accent colours only on the active product's elements.
  - At most one emissive accent per scene. No bloom-heavy neon.
- **Camera:** slow, purposeful moves along scripted paths. No free orbit in narrative sections. An optional constrained orbit is allowed only on product pages, behind an explicit "Explore model" control.

## Workflow
1. **Purpose test.** Then sketch the camera path against the beats.
2. **Geometry.** Build procedurally or model it, then export glTF and optimise:
   `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress ktx2`
   Use instancing for repeated cells.
3. **Budgets (per scene):**
   - Desktop: ≤ 150k triangles, ≤ 80 draw calls, textures ≤ 2048², GLB ≤ 1.5 MB transferred.
   - Mobile tier: ≤ 50k triangles, ≤ 40 draw calls, ≤ 1024² textures.
   - Shared three/R3F/drei chunk ≤ 250 KB gzip, lazy-loaded.
4. **Lifecycle.**
   - One `<Canvas>` per page. Scenes mount into DOM-tracked slots (drei `<View>`) or a sticky stage.
   - Mount when the slot is within ~1 viewport. Pause (`frameloop="demand"` + `invalidate()` on progress change) when off-screen. Dispose geometries and textures on route change.
   - Cap DPR at 1.5 desktop and 1.25 mobile, with adaptive DPR via `PerformanceMonitor`.
5. **Interface with scroll.**
   - Scenes expose imperative setters or read a progress ref in `useFrame`. They never attach scroll listeners.
   - The chapter's GSAP timeline is the single owner.
6. **Fallbacks.**
   - Detect WebGL2 support and `failIfMajorPerformanceCaveat`. Handle `webglcontextlost`.
   - On failure, render a pre-rendered poster (AVIF/WebP) or a short muted loop with identical composition.
   - All copy lives in the DOM, so fallbacks lose no information.
   - Reduced motion uses the poster plus discrete states.
7. **Accessibility.** The canvas is `aria-hidden="true"`. Every meaningful state has a DOM equivalent (caption, list, or step UI). Keyboard users never need to interact with the canvas.

## Expected outputs
- Scene components.
- Optimised assets in `public/3d/<scene>/` with a `README` of the source, poly counts and licence.
- Poster fallbacks.
- A perf trace for each scene.

## Quality checks / acceptance
- The purpose sentence is recorded in the scene's README.
- Budgets are verified with `renderer.info` and a network panel screenshot.
- LCP is never a canvas element. The hero renders meaningful DOM content and a poster before WebGL initialises.
- Killing WebGL (via `chrome://flags` or `failIfMajorPerformanceCaveat`) shows posters with no layout shift and no console errors.
- Memory stays flat across 10 route changes (no leaked contexts or textures).

## Project constraints
- Stack: three.js + @react-three/fiber + a minimal subset of @react-three/drei.
- No WebGPU-only features in v1 unless the tech verification says production-ready with WebGL fallback.
- No third-party 3D models without a licence recorded.
- Product objects must not misrepresent hardware. If Wasel's controller design is unknown, use a neutral generic enclosure labelled "illustrative" in the asset register.

## Failure modes and anti-patterns
- **Decorative noise:** particles, metaballs, starfields, globes and DNA helixes with no informational role.
- **Canvas-only content:** text or numbers rendered only in the canvas (not searchable, not accessible).
- **Multiple contexts:** several `<Canvas>` elements, each creating its own WebGL context. Mobile Safari will drop them.
- **Uncompressed assets:** 4K textures, uncompressed GLB, HDRI environment maps over 1 MB for matte scenes.
- **Unthrottled rendering:** a continuous render loop on hidden or off-screen scenes, draining battery.
- **Free orbit in narrative:** orbit controls in narrative sections, hijacking wheel or touch.
