# Motion performance budget

## Budgets

| Metric | Budget | Source |
|---|---|---|
| LCP (mobile, p75) | ≤ 2.5 s | web.dev Core Web Vitals |
| INP | ≤ 200 ms | web.dev |
| CLS | ≤ 0.1 (target 0.05) | web.dev; `meerana-frontend` |
| Frame rate in chapters | ≥ 55 fps desktop; ≥ 45 fps mid-tier Android (4× CPU throttle trace) | `meerana-scroll-choreography` |
| Long tasks from scroll/animation handlers | none > 50 ms | |
| Per-frame JS in canvas loops | ≤ 4 ms | Leaves headroom in the 16.7 ms frame |
| Homepage initial JS | ≤ 180 KB gzip, excluding the lazy 3D chunk | `meerana-frontend` |
| 3D chunk | ≤ 250 KB gzip | `meerana-webgl-scenes` |

## Property rules
- **Composite-only:** `transform` (translate/scale/rotate) and `opacity`.
- **Never animate:**
  - `width`/`height`/`top`/`left`/`margin`/`padding` (layout);
  - `filter`, `backdrop-filter`, or `box-shadow` on large elements (paint);
  - `transition: all`.
- Prefer `clip-path: inset()` over animated `height` for disclosure; it's still paint, so keep it small.

## No layout thrash
- Read layout once (on resize and on fonts ready), cache it, and write in rAF.
- Never call `getBoundingClientRect()` inside a scroll handler or animation loop.
- Use IntersectionObserver for visibility, and `ResizeObserver` for size.
- Scroll listeners: `{ passive: true }`. Prefer ScrollTrigger or IntersectionObserver to raw scroll listeners.

## Canvas lifecycle template
```js
function createLoop(canvas, draw) {
  const ctx = canvas.getContext('2d', { alpha: true });
  let raf = 0, running = false, visible = true, dpr = Math.min(devicePixelRatio || 1, innerWidth < 768 ? 1.25 : 1.5);

  function resize() {
    const r = canvas.getBoundingClientRect();           // allowed here: resize only
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame(t) {
    if (!running) return;
    draw(ctx, t);                                        // no allocations in here
    raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  resize();
  return { start, stop };
}
```

## Mount after first paint (LCP-safe)
```js
const idle = 'requestIdleCallback' in window
  ? (cb) => requestIdleCallback(cb, { timeout: 1500 })
  : (cb) => setTimeout(cb, 200);                   // Safari / iOS lack rIC
requestAnimationFrame(() => idle(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // keep the poster
  mountCanvas();                                                         // fades in over the poster
}));
```

## Measuring
```js
// LCP element + time
new PerformanceObserver((l) => { const e = l.getEntries().at(-1); console.log('LCP', e.startTime, e.element); })
  .observe({ type: 'largest-contentful-paint', buffered: true });
// CLS
let cls = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; console.log('CLS', cls); })
  .observe({ type: 'layout-shift', buffered: true });
// Long tasks
new PerformanceObserver((l) => l.getEntries().forEach((e) => e.duration > 50 && console.warn('long task', e.duration)))
  .observe({ type: 'longtask', buffered: true });
```
- Chrome DevTools: Performance panel → CPU 4× slowdown → record scrolling through each chapter → check frames, long tasks and layout/paint.
- Field data: PageSpeed Insights or CrUX once live. This environment could not run PSI (HTTP 429), so run it from a normal connection.
