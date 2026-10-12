# Lenis setup (lenis 1.3.26; verified 2026-10-01)

**Scope (DD-02):**
- **Not used on meerana.ae.** Native scroll is required there (`meerana-scroll-choreography`, `plan/11`).
- **Optional on yisbir.com**, for desktop wheel smoothing only.
- None of the six premium reference sites probed (Linear, Vercel, Stripe, Resend, Frame.io, Cuebric) uses Lenis (`docs/DESIGN-DIRECTIONS.md` §1.1), so treat it as polish, not identity.

## Decide first
Use Lenis only if all of these hold:
1. the page has scrubbed choreography that visibly stutters with discrete wheel steps on desktop;
2. touch devices keep native scroll (`syncTouch: false`);
3. a trace shows no INP or input-latency regression;
4. the decision is logged.

Otherwise, don't add it.

## Install
```bash
npm i lenis
```

**Outdated:**
- `@studio-freight/lenis` and `@studio-freight/react-lenis` are frozen in 2024.
- The options `smooth` and `smoothTouch` were renamed to `smoothWheel` and `syncTouch`.
- `2.0.0-dev.x` is not stable.

## Vanilla + GSAP ticker (prototypes, non-React)
```js
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  autoRaf: false,          // GSAP's ticker drives it; never two rAF loops
  smoothWheel: true,
  syncTouch: false,        // touch stays native (iOS stability)
  anchors: true,           // otherwise anchor links are prevented
  lerp: 0.1,               // default; lower = floatier, don't go below 0.08
  // respectReducedMotion: true  ← default since 1.3.26; never set to false
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));   // seconds → ms
gsap.ticker.lagSmoothing(0);
```

## React (Next.js App Router): client component
```tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
gsap.registerPlugin(ScrollTrigger);

function ScrollTriggerSync() { useLenis(ScrollTrigger.update); return null; }

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<LenisRef>(null);
  useEffect(() => {
    const update = (t: number) => ref.current?.lenis?.raf(t * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);
  return (
    <ReactLenis root ref={ref} options={{ autoRaf: false, syncTouch: false, anchors: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
```

**Gotchas:**
- In `lenis/react`, `autoRaf` effectively defaults to **true**. Pass `options={{ autoRaf: false }}` when GSAP drives it.
- Options containing functions (`easing`, `prevent`) must live in a client component.

## Nested scrollers and exclusions
```html
<ol class="event-list" data-lenis-prevent>…</ol>   <!-- also: data-lenis-prevent-wheel / -touch -->
```
Or use `prevent: (node) => node.closest('[data-native-scroll]') !== null`.

## Accessibility and behaviour
- **Reduced motion:** since 1.3.26, `prefers-reduced-motion: reduce` forces `lerp = 1` (no smoothing), and programmatic scrolls jump instantly. It's picked up live. On older versions you must branch manually; better to upgrade.
- **Keyboard, find-in-page, `position: sticky`:** these keep working because Lenis runs on native scroll. Still, test Tab focus scrolling, Page Down/Space, Home/End, and in-page anchors.
- **Known limits:**
  - no CSS scroll-snap (use `lenis/snap`);
  - smoothing pauses over iframes;
  - Safari caps it at 60 fps (30 fps in Low Power Mode).
- **No `scroll-behavior: smooth`** on `html` (Next 16 no longer overrides it during navigation, so remove it yourself).

## Kill switch
Disable or remove Lenis if any of these happen:
- INP worsens above 200 ms on the trace;
- input-to-scroll latency is visibly worse on a mid-tier laptop;
- assistive-tech testing finds focus or anchor problems;
- support tickets mention "laggy" or "floaty" scrolling.
