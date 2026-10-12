# GSAP recipes (gsap 3.15, @gsap/react 2.1.2; verified 2026-10-01)

## Install and licence
```bash
npm install gsap @gsap/react
```

**Licence:**
- Since 3.13 (Apr 2025), **all plugins are free**, including SplitText, ScrollSmoother, MorphSVG and DrawSVG, and they ship in the public `gsap` package.
- The licence is GSAP's "Standard 'no charge' license" (gsap.com/standard-license). It is **not MIT**. It forbids use in no-code visual animation builders that compete with Webflow. A marketing site is fine.

**Outdated advice:**
- `gsap-trial`, the `npm.greensock.com` registry and "Club GSAP required" are all obsolete.

## Register once (client module)
```ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);   // registering also prevents tree-shaking the plugin
```

## Component pattern: scoped, auto-cleaned, with a reduced-motion branch
```tsx
export function Chapter({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 1024px)",
      },
      (ctx) => {
        const { reduce, desktop } = ctx.conditions as Record<string, boolean>;
        if (reduce) {
          gsap.set(".step", { autoAlpha: 1, y: 0 });   // final readable state
          return;
        }
        gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top 70%",
            end: desktop ? "bottom 30%" : "bottom 60%",
            scrub: 0.5,                               // ≤ 0.5 s smoothing (meerana-scroll-choreography)
          },
        })
          .from(".step", { y: 8, autoAlpha: 0, duration: 0.24, ease: "expo.out", stagger: 0.06 });
      }
    );
    return () => mm.revert();
  }, { scope });

  return <section ref={scope}>{children}</section>;
}
```

**Notes:**
- `useGSAP` reverts every tween, ScrollTrigger and SplitText created inside it when the component unmounts.
- Event-driven tweens created later must be wrapped in `contextSafe(...)`.
- Explicitly revert `gsap.matchMedia()`. The docs don't guarantee it is collected by the context.

## Batch reveals (many elements, one observer)
```ts
ScrollTrigger.batch("[data-reveal]", {
  start: "top 85%",
  once: true,
  onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.24, ease: "expo.out", stagger: 0.06, overwrite: true }),
});
```
- Set the initial hidden state in CSS under `html.js-motion` (see `motion-tokens.css`), not in JS after load. That avoids a flash, and content stays visible without JS.
- Batch can't be used with `scrub`, `snap` or `animation`.

## Staggered entrance (once, above or near the fold)
```ts
gsap.from(".placard", { y: 8, autoAlpha: 0, duration: 0.24, ease: "expo.out", stagger: { each: 0.06, from: "start" } });
```
Limits: ≤ 8 items, 60 ms each. Never stagger the LCP heading.

## SplitText (3.13+ API): below the fold only
```ts
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
SplitText.create(".section-title", {
  type: "lines",
  mask: "lines",           // clipping wrappers for line reveals
  autoSplit: true,         // re-split on font load / resize
  aria: "auto",            // aria-label on parent, aria-hidden on pieces
  onSplit(self) {
    return gsap.from(self.lines, { yPercent: 100, duration: 0.42, ease: "expo.out", stagger: 0.06 });
  },
});
```

**Rules:**
- **Never on the hero H1 or LCP text.** Masked text is unpainted, so LCP is delayed.
- Never on links inside text: `aria:"auto"` drops nested semantics. Use `aria:"hidden"` plus a screen-reader duplicate.

## Sticky stage instead of a hard pin
- Prefer CSS `position: sticky` for the stage and let the text scroll past it. Drive the stage's step from ScrollTriggers on the text blocks:
  `ScrollTrigger.create({ trigger: block, start: "top 60%", onEnter: () => setStep(i), onEnterBack: () => setStep(i) })`
- Use a hard `pin` only with an `M-` spec and the limits in `meerana-scroll-choreography`:
  - desktop ≤ 150vh each and ≤ 300vh per page;
  - none on the mobile homepage.

## Refresh and lifecycle
```ts
document.fonts.ready.then(() => ScrollTrigger.refresh());                       // after webfonts
window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true }); // after hero images
```
Create ScrollTriggers in page order, or set `refreshPriority`.

## Common mistakes (from gsap.com/resources/st-mistakes)
- **Triggers inside timeline child tweens.** Put the `scrollTrigger` on the timeline instead.
- **Stale `end` values.** Use a function-based `end` together with `invalidateOnRefresh: true` for responsive layouts.
- **Conflicting scroll settings.** `scroll-behavior: smooth` on `html` and `content-visibility: auto` on measured sections both break position calculations.
- **CSS transitions on GSAP-animated properties.** Remove them.
- **Animating non-transform properties.** Prefer `x`/`y`/`scale`/`rotation`/`autoAlpha`; `filter` and `boxShadow` are CPU-heavy.
- **`will-change` on an ancestor of a pinned element.** It breaks `position: fixed`.
