/**
 * CSS lint (FINAL-SPEC §3.1, §10): every `@media` width or height value in
 * app/*.css is one of the shared breakpoints, and raw colours live only in
 * app/tokens.css. No browser; runs in a second.
 *
 *   node scripts/verify-css.mjs
 *
 * Allowed media values: 479 480 599 600 767 768 1023 1024 1279 1280 (width),
 * 499 500 520 620 700 760 (height), plus the three hero-tier values §7 itself
 * mandates and §3.1's list leaves out: 900 (`MQ.heroSplit`), 580 (S-tight)
 * and 640 (the optional hero link); and 359/360, the phone list break that
 * §4.9 mandates ("Lists switch to 2 columns at ≥360 px wide"). `prefers-*`, `hover`, `pointer`,
 * `orientation`, `forced-colors`, aspect ratios and `print` are not px values
 * and are ignored. A raw colour is a hex literal, rgb()/rgba() or hsl()/hsla()
 * with literal numbers; `color-mix()` over tokens and `transparent` are fine,
 * and so is black inside a `mask-image` (it is alpha, not colour: §4.3's own
 * floor mask uses it).
 * Comments are stripped before either check.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const APP = path.join(process.cwd(), "app");
const ALLOWED = new Set([479, 480, 599, 600, 767, 768, 1023, 1024, 1279, 1280, 499, 500, 520, 620, 700, 760, 900, 580, 640, 359, 360]);

const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
const lineOf = (text, index) => text.slice(0, index).split("\n").length;
/** The property a value at `index` belongs to (text after the last `;` or `{`). */
const propertyAt = (text, index) => {
  const start = Math.max(text.lastIndexOf(";", index), text.lastIndexOf("{", index)) + 1;
  return text.slice(start, index).split(":")[0].trim();
};

export async function lintCss() {
  const files = (await readdir(APP)).filter((f) => f.endsWith(".css")).sort();
  const media = [];
  const colours = [];
  for (const f of files) {
    const css = strip(await readFile(path.join(APP, f), "utf8"));
    for (const m of css.matchAll(/@media[^{]+/g)) {
      for (const v of m[0].matchAll(/(?:min|max)-(?:width|height)\s*:\s*([\d.]+)px/g)) {
        if (!ALLOWED.has(Number(v[1]))) media.push(`${f}:${lineOf(css, m.index)} ${v[0]}`);
      }
      for (const v of m[0].matchAll(/(?:min|max)-(?:width|height)\s*:\s*([\d.]+)(em|rem)/g)) {
        media.push(`${f}:${lineOf(css, m.index)} ${v[0]} (use px from the shared set)`);
      }
    }
    if (f === "tokens.css") continue;
    for (const c of css.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(\s*[\d.]/g)) {
      if (/^(-webkit-)?mask/.test(propertyAt(css, c.index))) continue;
      colours.push(`${f}:${lineOf(css, c.index)} ${c[0]}`);
    }
  }
  return { files, media, colours };
}

/* Run directly: print and exit non-zero on any finding. */
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("verify-css.mjs")) {
  const { files, media, colours } = await lintCss();
  console.log(`verify-css: ${files.length} stylesheets in app/`);
  console.log(media.length ? `  FAIL  @media values outside the shared set (${media.length}):` : "  PASS  every @media value is a shared breakpoint");
  for (const m of media) console.log(`        ${m}`);
  console.log(colours.length ? `  FAIL  raw colours outside app/tokens.css (${colours.length}):` : "  PASS  no raw colour outside app/tokens.css");
  for (const c of colours) console.log(`        ${c}`);
  process.exit(media.length || colours.length ? 1 : 0);
}
