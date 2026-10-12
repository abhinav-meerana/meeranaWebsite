/**
 * Breakpoints, one set for CSS and JS. Width: 480/768/1024/1280. Height tiers: tight ≤620, compact ≤760, list ≤499.
 * DD-23 amended 2026-10-11 (client): horizontal stage and gallery from 1024×520 (was 1280×760).
 */
export const BP = { sm: 480, md: 768, lg: 1024, xl: 1280 } as const;
export const STAGE_MIN_H = 520;
export const LIST_MAX_H = 499;
/** @deprecated alias, kept for existing imports */
export const PIN_MIN_HEIGHT = STAGE_MIN_H;

const STAGE = `(min-width: ${BP.lg}px) and (min-height: ${STAGE_MIN_H}px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`;

export const MQ = {
  md: `(min-width: ${BP.md}px)`,
  lg: `(min-width: ${BP.lg}px)`,
  xl: `(min-width: ${BP.xl}px)`,
  /** Product stage (scrubbed horizontal story). */
  stage: STAGE,
  /** Homepage gallery pin: same gate as the stage. */
  pinned: STAGE,
  /** Automatic list view (landscape phones, 200% zoom). */
  listOnly: `(max-height: ${LIST_MAX_H}px)`,
  heroSplit: "(min-width: 900px) and (min-aspect-ratio: 5/4) and (min-height: 500px)",
  roomWebgl: "(min-width: 1024px) and (min-aspect-ratio: 5/4) and (min-height: 500px)",
  compact: "(max-height: 760px)",
  tight: "(max-height: 620px)",
  finePointer: "(hover: hover) and (pointer: fine)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
