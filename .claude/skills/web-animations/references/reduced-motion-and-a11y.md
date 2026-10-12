# Reduced motion and accessible motion

## WCAG 2.2 mapping

| Criterion | Level | What it means for us |
|---|---|---|
| 2.2.2 Pause, Stop, Hide | **A** | Anything that **moves automatically, lasts > 5 s, and sits alongside other content** needs a visible mechanism to pause, stop or hide it. That covers camera-feed loops, tickers, carousels and ambient canvases. Content started by scrolling it into view counts as automatic. **`prefers-reduced-motion` is not a sufficient technique for 2.2.2.** Pausing only while hovered or focused is not a "mechanism". |
| 2.3.3 Animation from Interactions | AAA (we target it) | Motion triggered by interaction (scroll, hover) can be disabled. Satisfied by `prefers-reduced-motion` (C39/SCR40) or an on-page preference. Opacity and colour changes are not "motion". |
| 2.3.1 Three Flashes | A | Nothing flashes more than 3 times per second (alert pulses, REC dots: ≤ 1 Hz). |
| 1.4.11 Non-text Contrast | AA | Detection boxes, focus rings and pause buttons need ≥ 3:1 against adjacent colours |
| 2.4.7 / 2.4.11 Focus | AA | Pinned or sticky stages never hide or trap focus |

## Pause-control pattern (vanilla; adapt to React)
```html
<button type="button" data-motion-control aria-pressed="false" aria-controls="hero-canvas">Pause motion</button>
```
```js
const btn = document.querySelector('[data-motion-control]');
const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)');
let stored = null;
try { stored = localStorage.getItem('motion'); } catch {}
let paused = prefersReduce.matches || stored === 'paused';

function render() {
  btn.setAttribute('aria-pressed', String(paused));   // the label stays "Pause motion"; aria-pressed carries the state
  paused ? loop.stop() : loop.start();          // your loop API
}
btn.addEventListener('click', () => {
  paused = !paused;
  try { localStorage.setItem('motion', paused ? 'paused' : 'playing'); } catch {}
  render();
});
prefersReduce.addEventListener('change', (e) => { if (e.matches) { paused = true; render(); } });
render();
```

**Placement and behaviour:**
- Visible near the moving content.
- ≥ 44 × 44 px.
- Reachable by keyboard before the moving region.
- **Constant label.** The name stays "Pause motion" (or "Pause feed") and `aria-pressed` carries the state. The WAI-ARIA APG button pattern forbids changing a toggle button's label with its state, because a screen reader would announce "Play motion, pressed". Show the state visually with styling or an `aria-hidden` glyph. If you want a Pause/Play label swap instead, drop `aria-pressed`. Never use both.
- One-shot signatures (≤ 2.4 s, then rest) don't need it. Still offer "Replay".

## On-page "Reduce motion" toggle (site-wide)
- Some visitors can't change OS settings, for example on managed government laptops. Offer a header utility that sets `html[data-motion="reduce"]` and persists it.
- CSS (`motion-tokens.css`) and JS both respect it:
  `const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce';`

## Vestibular triggers to avoid entirely
- Parallax of foreground content.
- Zooming the whole viewport.
- Large-scale rotation or spinning.
- Scroll-jacking.
- Horizontal scroll sections driven by vertical scroll on mobile.
- Background video with camera movement behind text.

## What reduced motion should look like
| Element | Full motion | Reduced |
|---|---|---|
| Hero lattice / model | Assembles once | The settled poster, at full detail |
| Camera feed | Live-looking loop | A single annotated frame plus a step-through button |
| Search demo | Typewriter + ticks | Query pre-filled, results and ticks static |
| Reveals | 8 px rise + fade | Instant (or opacity ≤ 240 ms) |
| Carousels | Manual only, always | Manual only |
| Counters | Static anyway (we don't animate numbers) | Static |
