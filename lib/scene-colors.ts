/**
 * Colours for code that cannot read CSS custom properties: the WebGL and
 * canvas background layers, the option wheel's inline colours, and the
 * viewport `themeColor` metadata (FINAL-SPEC §7.3).
 *
 * Every value MIRRORS app/tokens.css, which stays the one place colours are
 * decided. Change a token there first, then the mirror here; the comment on
 * each line names the token it copies.
 */
export const SCENE = {
  /** --surface-page (= --meerana-midnight). Theme colour and canvas base. */
  page: "#061226",
  /** --meerana-navy. The brand deep navy. */
  navy: "#071b36",
  /** --meerana-navy-2. Secondary navy. */
  navy2: "#0a2348",
  /** --meerana-blue. Royal blue. */
  royal: "#0d3bff",
  /** --bends-start. The ColorBends band colour. */
  bends: "#0004a7",
  /** --meerana-blue: the band colour at the bottom of the page, where the
   *  base has turned --meerana-deep and the start colour would disappear. */
  bendsDeep: "#0d3bff",
  /** --meerana-cyan. The rim light. */
  cyan: "#3fd0ff",
  /** --cool-grey. Inactive wheel labels. */
  coolGrey: "#91a5c3",
  /** --meerana-white. Active wheel label. */
  white: "#ffffff",
  /** DotField gradient: --meerana-cyan and --meerana-blue at low alpha. */
  dotFrom: "rgba(63, 208, 255, 0.26)",
  dotTo: "rgba(13, 59, 255, 0.34)",
  /** DotField cursor glow: --meerana-navy-2. */
  dotGlow: "#0a2348",
} as const;

export type SceneColor = keyof typeof SCENE;
