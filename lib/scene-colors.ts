/**
 * Colours for code that cannot read CSS custom properties: the three.js room
 * and the viewport `themeColor` metadata (FINAL-SPEC §7.3).
 *
 * Every value MIRRORS app/tokens.css, which stays the one place colours are
 * decided. Change a token there first, then the mirror here; the comment on
 * each line names the token it copies.
 */
export const SCENE = {
  /** --meerana-navy (= --surface-page). Fog, so far panels dissolve into the page. */
  page: "#071b36",
  /** --meerana-cyan. The rim light: the room and the copy share one light source. */
  cyan: "#3fd0ff",
  /** --scene-lattice. The floor and back-wall hairlines. */
  lattice: "#16405f",
  /** --scene-key. Key light, a cool white. */
  key: "#dbe8ff",
  /** --scene-fill. Fill light, so shadow sides are never black. */
  fill: "#6f9fd0",
  /** --scene-ambient. Ambient, a desaturated sky. */
  ambient: "#8fb0d8",
} as const;

export type SceneColor = keyof typeof SCENE;
