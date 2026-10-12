/**
 * Download the generated product background plates.
 *
 * Uses node:https rather than global fetch: the presigned host is a
 * China-region object store, and undici's fetch fails to resolve it from this
 * environment while node:https succeeds. Verified: the same URL returns
 * HTTP 200 with a 429 KB JPEG over node:https.
 *
 * The URLs are presigned and time-limited, so they live in a JSON file rather
 * than in code.
 *
 * Usage: node scripts/fetch-bg.mjs scripts/bg-urls.json
 */

import { readFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import http from "node:https";
import path from "node:path";

const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/fetch-bg.mjs <urls.json>");
  process.exit(1);
}

const map = JSON.parse(await readFile(src, "utf8"));
const outDir = path.join(process.cwd(), "public", "media", "bg");
await mkdir(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.get(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        timeout: 60000,
        headers: { "User-Agent": "meerana-build/1.0" },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let body = "";
          res.on("data", (d) => (body += d));
          res.on("end", () =>
            reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 160)}`)),
          );
          return;
        }
        const file = createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(res.headers["content-length"])));
        file.on("error", reject);
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

for (const [product, url] of Object.entries(map)) {
  const dest = path.join(outDir, `raw-${product}.jpg`);
  try {
    const len = await download(url, dest);
    console.log(`${product.padEnd(12)} ok  ${(Number(len) / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.log(`${product.padEnd(12)} FAILED: ${err.message}`);
  }
}
