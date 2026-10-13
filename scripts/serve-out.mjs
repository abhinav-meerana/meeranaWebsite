#!/usr/bin/env node
/**
 * Serves the static export (out/) on http://localhost:4173, with no
 * dependencies. `npm start` used to run `npx serve out`, which downloads an
 * undeclared package on first use; the verification scripts only need a plain
 * static server that resolves `/route/` to `/route/index.html`.
 *
 *   node scripts/serve-out.mjs [dir=out] [port=4173]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(process.argv[2] ?? "out");
const PORT = Number(process.argv[3] ?? process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const base = join(ROOT, clean);
  if (!base.startsWith(ROOT)) return null;
  for (const candidate of [base, join(base, "index.html"), `${base}.html`]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? "/");
  if (!file) {
    const notFound = await resolveFile("/404.html");
    res.writeHead(404, { "content-type": TYPES[".html"] });
    res.end(notFound ? await readFile(notFound) : "Not found");
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "cache-control": "no-cache",
  });
  res.end(await readFile(file));
}).listen(PORT, () => {
  console.log(`serve-out: ${ROOT} on http://localhost:${PORT}`);
});
