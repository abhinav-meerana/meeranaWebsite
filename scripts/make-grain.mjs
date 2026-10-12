/**
 * Bake the film-grain tile.
 *
 * Writes public/textures/grain.png — a seamless, monochrome 256x256 noise tile.
 *
 * Why bake instead of using SVG feTurbulence at runtime: a live SVG filter or
 * shader grain is fill-rate bound at every viewport size, which is the worst
 * possible cost model. A baked tile is a single composited layer, effectively
 * free. See docs/DEPTH-DIRECTION-2026-10-10.md.
 *
 * Implementation is dependency-free: PNG is assembled by hand and compressed
 * with node:zlib, so this runs in CI without adding a build dependency.
 *
 * Usage: node scripts/make-grain.mjs
 */

import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SIZE = 128; // tile edge; grain repetition is invisible at 4.5% opacity, so 128 saves ~38 KB of transfer
const BLUR_PASSES = 1; // soften pure white noise so it reads as film, not static
const SIGMA = 46; // spread around mid-grey; higher = stronger grain

/* ---- gaussian noise (Box-Muller) ---------------------------------------- */
function makeNoise(size) {
  const px = new Float32Array(size * size);
  for (let i = 0; i < px.length; i += 2) {
    // Two uniforms in (0,1]; guard against log(0).
    const u1 = 1 - Math.random();
    const u2 = Math.random();
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * u2;
    px[i] = r * Math.cos(theta);
    if (i + 1 < px.length) px[i + 1] = r * Math.sin(theta);
  }
  return px;
}

/* Box blur that wraps at the edges, so the blurred tile still tiles seamlessly.
   A non-wrapping blur would darken the borders and produce a visible grid. */
function blurWrap(px, size, passes) {
  let src = px;
  for (let p = 0; p < passes; p++) {
    const dst = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const yy = (y + dy + size) % size;
            const xx = (x + dx + size) % size;
            sum += src[yy * size + xx];
          }
        }
        dst[y * size + x] = sum / 9;
      }
    }
    src = dst;
  }
  return src;
}

/* ---- PNG assembly ------------------------------------------------------- */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodeGrayscalePng(pixels, size) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); // width
  ihdr.writeUInt32BE(size, 4); // height
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // colour type 0 = greyscale
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  // Each scanline is prefixed with its filter byte (0 = None).
  const raw = Buffer.alloc(size * (size + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size + 1)] = 0;
    for (let x = 0; x < size; x++) raw[y * (size + 1) + 1 + x] = pixels[y * size + x];
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---- main --------------------------------------------------------------- */
const noise = blurWrap(makeNoise(SIZE), SIZE, BLUR_PASSES);

const px = new Uint8Array(SIZE * SIZE);
for (let i = 0; i < px.length; i++) {
  // Centre on mid-grey so `mix-blend-mode: overlay` pushes both directions
  // symmetrically: darker where the noise is negative, lighter where positive.
  const v = 128 + noise[i] * SIGMA;
  px[i] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

const outDir = path.join(process.cwd(), "public", "textures");
await mkdir(outDir, { recursive: true });
const outFile = path.join(outDir, "grain.png");
await writeFile(outFile, encodeGrayscalePng(px, SIZE));

console.log(`wrote ${outFile} (${SIZE}x${SIZE}, ${(await import("node:fs")).statSync(outFile).size} bytes)`);
