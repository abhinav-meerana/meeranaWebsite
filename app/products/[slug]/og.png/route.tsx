import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SHOWCASE } from "@/content/showcase";
import { STORIES } from "@/content/storyboards";

/**
 * One Open Graph card per product (FINAL-SPEC §10), rendered once at build
 * time into the static export as out/products/<slug>/og.png.
 *
 * Why a route handler and not the `opengraph-image.tsx` file convention the
 * spec names: both export statically, but the convention writes an
 * extensionless file (out/products/<slug>/opengraph-image). Apache and `serve`
 * send no Content-Type for it, and LinkedIn and Facebook reject an og:image
 * without an image/* type. A `.png` path gets image/png from any static
 * host. lib/seo.ts points every product route's og:image here (DD-26g).
 *
 * The card is composed only from verified material: the product's name and
 * descriptor (content/showcase.ts), its accent, the white Meerana symbol from
 * public/brand and the product's own gallery screen, cropped, with that
 * screen's provenance label. No generated imagery, no people.
 *
 * Colours are read from app/tokens.css at build time, so no raw colour lives
 * outside the token file. Type is the renderer's bundled default face: the repo
 * has no Poppins TTF (next/font ships woff2 only, which the renderer cannot
 * read), and fetching one from the network is ruled out (§10).
 */

export const dynamic = "force-static";
export const dynamicParams = false;

const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

const ROOT = process.cwd();
const W = size.width;
const H = size.height;

/** `--name: value;` from tokens.css, following `var(--other)` references. */
function token(css: string, name: string, depth = 0): string {
  const m = css.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!m) throw new Error(`og.png: token --${name} not found in app/tokens.css`);
  const v = m[1].trim();
  const ref = v.match(/^var\(--([a-z0-9-]+)\)$/);
  return ref && depth < 4 ? token(css, ref[1], depth + 1) : v;
}

/** `#rrggbb` plus an alpha, as rgba(): the renderer has no color-mix(). */
function alpha(hex: string, a: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

async function dataUrl(publicPath: string) {
  const file = path.join(ROOT, "public", publicPath);
  const bytes = await readFile(file);
  return `data:${MIME[path.extname(file)] ?? "application/octet-stream"};base64,${bytes.toString("base64")}`;
}

/**
 * The screen as a PNG at the size it is drawn. The renderer cannot paint WebP,
 * and every v3 screen is WebP, so it is converted with the copy of `sharp` that
 * Next installs as an optional dependency (no new dependency). If that copy is
 * missing the card is drawn without the screen rather than failing the build.
 */
async function screenPng(publicPath: string, w: number, h: number) {
  if (path.extname(publicPath) !== ".webp") return dataUrl(publicPath);
  try {
    const { default: sharp } = await import("sharp");
    const png = await sharp(path.join(ROOT, "public", publicPath))
      .resize(w, h, { fit: "cover", position: "left top" })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    console.warn(`og.png: sharp unavailable, ${publicPath} left out of the card`);
    return null;
  }
}

/** The brand lattice: two 30° line families plus a sparse accent family
 * (the 224 px period used on the product pages), as one SVG. */
function lattice(line: string, accentLine: string) {
  const rows: string[] = [];
  const t = Math.tan(Math.PI / 6);
  const family = (step: number, stroke: string) => {
    for (let x = -H / t; x < W + H / t; x += step / Math.sin(Math.PI / 6)) {
      rows.push(`<line x1="${x.toFixed(1)}" y1="${H}" x2="${(x + H / t).toFixed(1)}" y2="0" stroke="${stroke}" stroke-width="1"/>`);
      rows.push(`<line x1="${x.toFixed(1)}" y1="0" x2="${(x + H / t).toFixed(1)}" y2="${H}" stroke="${stroke}" stroke-width="1"/>`);
    }
  };
  family(56, line);
  family(224, accentLine);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${rows.join("")}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const panel = SHOWCASE.find((p) => p.slug === slug);
  if (!panel) throw new Error(`og.png: no SHOWCASE entry for "${slug}"`);

  const css = await readFile(path.join(ROOT, "app", "tokens.css"), "utf8");
  const navy = token(css, "meerana-navy");
  const deep = token(css, "navy-950");
  const ink = token(css, "ink-950");
  const white = token(css, "meerana-white");
  const secondary = token(css, "navy-200");
  const muted = token(css, "navy-300");
  const cyan = token(css, "meerana-cyan");
  const accentName = panel.accent.match(/var\(--([a-z0-9-]+)\)/)?.[1] ?? "meerana-cyan";
  const accent = token(css, accentName);

  // The screen is drawn at a fixed height and bleeds off the right edge, so the
  // card always shows a crop of the real screen, never a letterboxed thumbnail.
  // Cut-outs (`bare`) are not framed screens and are left out: the only one is
  // the Mandoobee three-phone cut-out, withdrawn site-wide until cleared (D6).
  const screen = panel.shot.bare ? null : panel.shot;
  const shotH = 400;
  const shotW = screen ? Math.round((screen.width / screen.height) * shotH) : 0;

  const [symbol, shot] = await Promise.all([
    dataUrl("/brand/meerana-symbol-white.png"),
    screen ? screenPng(screen.src, shotW, shotH) : null,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          position: "relative",
          background: `linear-gradient(180deg, ${navy} 0%, ${deep} 100%)`,
          color: white,
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lattice(alpha(white, 0.05), alpha(accent, 0.16))}
          width={W}
          height={H}
          alt=""
          style={{ position: "absolute", left: 0, top: 0 }}
        />
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 0,
            width: 760,
            height: H,
            display: "flex",
            background: `radial-gradient(60% 55% at 55% 45%, ${alpha(accent, 0.22)}, transparent 70%)`,
          }}
        />

        {/* Copy column */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 64,
            bottom: 64,
            width: 520,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={symbol} width={66} height={36} alt="" />
            <span style={{ fontSize: 18, letterSpacing: 3, color: secondary, textTransform: "uppercase" }}>
              Meerana Technologies
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <span style={{ fontSize: 20, letterSpacing: 3, color: muted, textTransform: "uppercase" }}>
              {`Product ${panel.index} / 06`}
            </span>
            <div style={{ display: "flex", width: 96, height: 6, background: accent, marginTop: 22 }} />
            <span style={{ fontSize: panel.name.length > 9 ? 76 : 92, lineHeight: 1.02, letterSpacing: -2, marginTop: 26 }}>
              {panel.name}
            </span>
            <span style={{ fontSize: 34, lineHeight: 1.25, color: alpha(accent, 1), marginTop: 18, maxWidth: 500 }}>
              {panel.descriptor}
            </span>
          </div>

          <span style={{ fontSize: 20, color: muted, marginTop: 40, letterSpacing: 1 }}>
            {`meerana.ae/products/${panel.slug}`}
          </span>
        </div>

        {/* The real screen, cropped by the card edge, with its provenance. */}
        {screen && shot ? (
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 96,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                width: shotW,
                height: shotH,
                borderRadius: 16,
                border: `1px solid ${alpha(white, 0.18)}`,
                background: ink,
                overflow: "hidden",
                boxShadow: `0 40px 80px -40px ${alpha(deep, 0.9)}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shot} width={shotW} height={shotH} alt="" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
              <div style={{ display: "flex", width: 8, height: 8, background: cyan }} />
              <span style={{ fontSize: 17, letterSpacing: 2.5, color: secondary, textTransform: "uppercase" }}>
                {screen.provenance}
              </span>
            </div>
          </div>
        ) : (
          /* No framed screen to show: the product's own capability lines. */
          <div
            style={{
              position: "absolute",
              left: 680,
              top: 150,
              width: 440,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {panel.capabilities.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "22px 0",
                  borderTop: `1px solid ${alpha(white, 0.14)}`,
                  fontSize: 28,
                  color: secondary,
                }}
              >
                <div style={{ display: "flex", width: 14, height: 2, background: accent }} />
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
