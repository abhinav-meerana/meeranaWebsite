# Motion (formerly Framer Motion): React patterns (motion 13.4.x; verified 2026-10-01)

**Scope (DD-03):**
- **Not on meerana.ae** (GSAP + CSS only).
- Allowed in **React app surfaces** that need component **layout or exit** animation: filter lists, shared-element dialogs, reordering, presence.
- Never for scroll choreography that GSAP owns. Never two engines on one element.

## Install and import
```bash
npm install motion          # replaces framer-motion (same version line); uninstall framer-motion
```
```tsx
import { motion, AnimatePresence, MotionConfig, useReducedMotion, stagger } from "motion/react";
// In a Server Component file, use: import * as motion from "motion/react-client"
```

## Providers (client), with reduced motion on
```tsx
"use client";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
export function MotionProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
```

**Notes:**
- `reducedMotion` defaults to `"never"`, so opting in to `"user"` is mandatory.
- `"user"` disables transform and layout animations only. Opacity and colour still animate, which is acceptable.
- `useScroll`/`useTransform` parallax is **not** covered. Gate it with `useReducedMotion()`.

## Bundle size (official, Rollup min+gz)

| Setup | Size |
|---|---|
| Full `motion` component | "impossible … smaller than 34kb" |
| `m` + `LazyMotion` | ~4.6 kB initial render |
| + `domAnimation` | +15 kB |
| + `domMax` (adds drag and layout) | +25 kB |

Use `import * as m from "motion/react-m"` inside `LazyMotion strict`. `strict` throws if a full `motion.*` component slips in.

## Reveal in view (app surfaces only; marketing reveals use CSS)
```tsx
<m.div
  initial={{ opacity: 0, y: 8 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.24, ease: [0, 0, 0, 1] }}
/>
```

## Staggered children (current API)
```tsx
const list = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { delayChildren: stagger(0.06) } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0, 0, 0, 1] } } };
```

**Deprecated:**
- `staggerChildren` → `delayChildren: stagger(…)`.
- `staggerDirection: -1` → `delayChildren: stagger(…, { from: "last" })`.

## Exit and layout
```tsx
<AnimatePresence mode="popLayout">
  {results.map((r) => (
    <m.li key={r.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }} />
  ))}
</AnimatePresence>
```
- Durations come from the three tokens only: 0.16 / 0.24 / 0.42.
- Layout animation needs `domMax`.

## Don'ts
- No `motion.*` on elements that GSAP or ScrollTrigger animate.
- No `whileHover` scale on large cards (it causes layout jitter). Use a 2 px translate, or colour only.
- No infinite `animate` loops without a pause control (WCAG 2.2.2).
