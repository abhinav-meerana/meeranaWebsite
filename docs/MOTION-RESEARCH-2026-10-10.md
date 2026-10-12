# Motion research and animation tooling (2026-10-10)

Two research passes were run for the M3 prototype, on the owner's request of 2026-10-10:
- (A) the world's best-designed motion websites;
- (B) MCP servers and repositories for scroll and component animation.

Facts were checked on the live sites (computed styles, the sites' own CSS) or in GitHub's API on 2026-10-10. Anything not verified is marked **UNVERIFIED**. Nothing here was installed.

---

## A. Reference sites: what they actually do

| Site | Recognition | Signature motion | Scroll | Nav | Timing (inspected) | Reduced motion |
|---|---|---|---|---|---|---|
| **Igloo Inc** (igloo.inc) | Awwwards SOTY 2024 tag + Developer Award; Animations 9.6 / Accessibility 6.6 | Procedural ice blocks per project; VDB particles; transitions blend chromatic aberration, displacement and frost; text scramble shifts SDF glyphs in WebGL | Virtual (body `overflow:hidden`), three r165 | — | — | none |
| **Lando Norris** (landonorris.com, OFF+BRAND) | SOTY 2025 tag; SOTD 17 Nov 2025; Accessibility 7.0 | Helmet mask over the portrait (render targets); 24 track visualisations from 490 points | Lenis; CSS-sticky hero in a 2× parent; horizontal section pinned with CSS sticky (3,143 px parent) | — | `cubic-bezier(.19,1,.22,1)`; Rive for buttons and page transitions | — |
| **Lusion v3** (lusion.co) | SOTY 2023 tag; Animations 10 / WPO 9 / Accessibility 7.4 | Cursor-reactive physics cluster (blue/black/white) after a counter preloader | Virtual, three r158 | "LET'S TALK" pill + pill menu; duplicated labels for a roll-over swap | `(.35,0,0,1)`, `(.4,0,.1,1)` | none |
| **Opal Tadpole** | SOTY 2024 tag | Single-page 3D product site with micro-interactions (closest model for Wasel's hardware) | UNVERIFIED (site blocked the check) | | | |
| **Apple** AirPods Pro / Vision Pro | — | Image-sequence scrub; sticky chapters (5 sticky rules on Vision Pro) | Native | Glass global nav: `saturate(180%) blur(20px)` on `rgba(22,22,23,.8)`, only inside `@supports` | .24/.32 s on `(.4,0,.6,1)`, 80–160 ms delays | Every autoplaying element has a Play/Pause control (14 on AirPods Pro) |
| **Linear** | — | Two-tone headlines (white claim, grey continuation); real product UI | Native, no WebGL | Fixed header, `blur(20px)` on `#0b0b0bcc`, 1 px `rgba(255,255,255,.08)` hairline | 18 ease tokens; main `.16s (.25,.46,.45,.94)` | 37 rules |
| **Stripe** | — | three r178 wave canvas; bento of real product UI | Native | — | `.3s (.25,1,.5,1)`, only inside `prefers-reduced-motion: no-preference` | 85 blocks |
| **Vercel** | — | — | Native, sticky 64 px header | — | `(.4,0,.2,1)`, `(.32,.72,0,1)` | 16 rules |
| **Raycast** | — | The real app in its window | Native | **Floating island** inset 16 px, radius 16; fill `linear-gradient(137deg, rgba(17,18,20,.75), rgba(12,13,15,.9))`, `blur(5px)`, 1 px `rgba(255,255,255,.06)` border, `inset 0 1px 1px rgba(255,255,255,.15)` | `(.23,1,.32,1)`, .3 s | — |
| **basement.studio** | award UNVERIFIED | Baked KTX2 lightmaps in three r180 | Native, 4 sticky sections | — | — | — |

**Sources:**
- Awwwards sites of the year: https://www.awwwards.com/websites/sites_of_the_year/
- Igloo case study: https://www.awwwards.com/igloo-inc-case-study.html
- Codrops on Lando and Gubrica: https://tympanus.net/codrops/2025/12/05/from-illusions-to-optimization-the-creative-webgl-worlds-of-adrian-gubrica/
- The sites themselves: apple.com/airpods-pro, linear.app, stripe.com, vercel.com, raycast.com, basement.studio
- Apple Liquid Glass: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/
- Apple HIG, materials: https://developer.apple.com/design/human-interface-guidelines/materials

### Techniques worth adopting (and how M3 uses them)
1. **One persistent WebGL stage, kept in sync with the DOM.** Lusion, Igloo and Lando all do this. M3 already does: one fixed canvas, rendered on demand.
2. **An authored camera path, scrubbed by scroll.** A master timeline (`ease:"none"`) moves a camera along a CatmullRom path, with `snap:"labelsDirectional"`. *Candidate for M3's chapter transitions.*
3. **Native scroll.** Linear, Stripe, Vercel and Apple all use it; Lenis is optional. Virtual scroll breaks anchors and find-in-page. M3 stays native (DD-02).
4. **CSS-sticky chapters** (Lando): a parent of (steps + 1) × 100svh with a sticky child; ScrollTrigger only reads progress. No pin-spacer reflow. *Candidate replacement for M3's GSAP pin.*
5. **Masked line reveals for headings**, e.g. GSAP SplitText `mask:"lines"`, `autoSplit`. Never on the LCP H1.
6. **The real product UI as the hero visual** (Raycast, Stripe, Linear). M3's product gallery now shows the real screens.
7. **A small easing system.** The reference sites cluster at 160–320 ms with one ease-out curve; durations stay small.
8. **Motion as opt-in.** Wrap motion in `prefers-reduced-motion: no-preference` (Stripe), and give every autoplaying element a pause control (Apple).
9. **Bake, compress, budget** (KTX2 lightmaps, Draco GLBs).
10. **Fake expensive optics** with cheap shaders, not real refraction.
11. **Rive for small UI states** (Lando's buttons). Measure the runtime cost first.
12. **CSS scroll-driven reveals** (`animation-timeline: view()`), now in Safari 26 and Chromium, behind `@supports`. M3 uses this on the mobile product rail.

### Premium glass (where it is used)
- **Recipe:**
  - fill `linear-gradient(137deg, navy .72 → .88)`;
  - `backdrop-filter: saturate(180%) blur(20px)`, applied only inside `@supports`;
  - a 1 px white inner border at 6–8 %;
  - an `inset 0 1px 1px` white highlight at 15 % on the top edge.
- **Rules (Apple HIG):**
  - Keep glass out of the content layer.
  - Never stack glass on glass.
  - Use a dimming layer when the background is bright.
  - Check 4.5:1 contrast against the worst-case background.
  - Honour `prefers-reduced-transparency`.
- **Owner decision (revised 2026-10-10):** cards are solid; glass only where necessary (DD-22).
- **Refraction ("Liquid Glass"):** `backdrop-filter:url(#svg)` with `feDisplacementMap`. Chromium only, with a per-element map cost. If used at all, limit it to the nav pill.

### Dynamic Island spec
- **States:**
  - *Expanded* at the top;
  - *Compact* on scroll: logo, chapter, menu;
  - *Contextual* inside a chapter (live activity);
  - *Open*: the menu panel.
- **Morph:** never tween width or height. Use GSAP Flip with `scale:true`, Motion `layout`, or a clip-path. Springs of about 0.5 s. Label cross-fades of 160 ms.
- **Live Activities:** cap these animations at about 2 s (Apple HIG).
- **Accessibility:** a real `<nav>`, `aria-expanded`, Esc to close, return focus on close, and no aria-live chapter announcements.

### Horizontal gallery spec
- **Desktop:** pin and tween `x: -(scrollWidth - innerWidth)` with `ease:"none"`, `invalidateOnRefresh` and `anticipatePin`. Per-card fades use `containerAnimation` (linear container; no pin or snap inside it). Opacity 0.35 → 1 near the centre; never fade to 0.
- **Mobile, touch and reduced motion:** a native `scroll-snap` rail with labelled paddle buttons (Apple).
- **Keyboard:** on `focusin`, scroll the page to that card's position. No auto-rotation.

### Anti-patterns these sites avoid
- Virtual scroll on content sites.
- Missing reduced-motion support: the SOTY sites score 6.6–7.4 on accessibility.
- Glass everywhere, or glass on glass.
- Autoplay without a pause control.
- Morphs that animate width or height.
- Swapping `img.src` per frame in image sequences.
- Long preloaders.

---

## B. Animation MCP servers and repositories

| # | Tool | Repo · stars · last commit · licence | What it gives | Cost | Verdict |
|---|---|---|---|---|---|
| 1 | **GSAP AI Skills** (official) | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) · ~16.1k · 2026-04-21 · MIT | 8 skills (core, timeline, ScrollTrigger incl. horizontal `containerAnimation`, plugins, React, performance) | Free | **Install.** Matches the stack |
| 2 | **shadcn MCP** | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) · ~125k · 2026-10-07 · MIT | Search, view and install from 434 registries: React Bits, Aceternity, Magic UI, Cult UI, Motion Primitives, glass and GSAP registries | Free | **Install.** Read source now; install after the Next.js move |
| 3 | **Context7** | [upstash/context7](https://github.com/upstash/context7) · ~62.8k · MIT | Current docs (GSAP, three, R3F, Next) | Free; key optional | Optional |
| 4 | **Figma MCP** (official) | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | `get_design_context`, `get_motion_context` (keyframes → CSS / motion.dev) | Paid Dev/Full seat | Connected. The Yisbir file has **no motion data** (`get_motion_context` returned none) |
| 5 | Motion AI Kit | [motiondivision/motion](https://github.com/motiondivision/motion) · ~33.9k · MIT | Docs MCP + skill; Motion+ is $399 | Mixed | Defer. Conflicts with the GSAP-only rule (DD-03) |
| 6 | 21st MCP (formerly Magic MCP) | [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp) · ~6.0k · ISC | Component search and generation | Credits | Skip |
| 7 | Magic UI MCP | [magicuidesign/mcp](https://github.com/magicuidesign/mcp) · ~206 · MIT | Registry tools | Free | Redundant with shadcn |
| 8 | React Bits | [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) · ~48.8k · MIT + Commons Clause | ScrollReveal, GlassSurface, PillNav… via shadcn | Free / Pro | Read only. Its ScrollReveal cleanup kills **every** ScrollTrigger on the page |
| 9 | Rive / Spline / LottieFiles MCPs | official docs | Authoring tools | — | Skip for now. Spline's desktop app rewrites `~/.claude.json` on its own |
| 10 | threejs-devtools-mcp | [DmitriyGolub/threejs-devtools-mcp](https://github.com/DmitriyGolub/threejs-devtools-mcp) · 117 · MIT | Scene inspection | Free | Debugging only |

**Components worth porting:**
- **Dynamic Island:** Cult UI `dynamic-island` (springs width and height, so it has a layout cost); Motion Primitives `morphing-popover`; Aceternity `resizable-navbar`. Vanilla route: GSAP Flip.
- **Horizontal gallery:** the GSAP `containerAnimation` pattern, per the official docs.
- **Liquid Glass:** [naughtyduk/liquidGL](https://github.com/naughtyduk/liquidGL) (~935 stars, MIT, vanilla, with WebGL and backdrop-filter fallbacks; best fit for the prototype); [AndrewPrifer/liquid-dom](https://github.com/AndrewPrifer/liquid-dom) (React 19 / R3F, for the Next.js phase); the [kube.io write-up](https://kube.io/blog/liquid-glass-css-svg/).

**Install commands** (not run; the owner decides):
```
/plugin marketplace add greensock/gsap-skills
npx shadcn@latest mcp init --client claude
```
