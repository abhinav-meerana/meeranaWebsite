/**
 * Post-export fix for the RSC prefetch 404s.
 *
 * Next's client asks for per-segment payloads with DOTTED names, e.g.
 *   /services/__next.services.__PAGE__.txt
 *   /products/yisbir/__next.products.$d$slug.__PAGE__.txt
 * but a `next build` on Windows writes them as NESTED directories:
 *   out/services/__next.services/__PAGE__.txt
 *   out/products/yisbir/__next.products/$d$slug/__PAGE__.txt
 * so every <Link> prefetch 404s and the console fills with errors (plan/13 I4
 * requires zero). Observed on Windows 11 with Next 16.4.0; a Linux build is
 * expected to write dotted names already, in which case this script finds
 * nothing to do and exits cleanly.
 *
 * It flattens each `__next.*` directory into dotted sibling files, which are
 * exactly the URLs the client requests.
 */
import { readdir, rename, rm, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");

async function files(dir, base = "") {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}.${entry.name}` : entry.name;
    if (entry.isDirectory()) found.push(...(await files(path.join(dir, entry.name), rel)));
    else found.push({ from: path.join(dir, entry.name), name: rel });
  }
  return found;
}

async function walk(dir) {
  let moved = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      // Flatten: __next.products/$d$slug/__PAGE__.txt -> __next.products.$d$slug.__PAGE__.txt
      for (const f of await files(full, entry.name)) {
        await mkdir(dir, { recursive: true });
        await rename(f.from, path.join(dir, f.name));
        moved++;
      }
      await rm(full, { recursive: true, force: true });
    } else if (entry.name !== "_next") {
      moved += await walk(full);
    }
  }
  return moved;
}

try {
  await stat(OUT);
} catch {
  console.error("postexport-rsc: no out/ directory; run `next build` first.");
  process.exit(1);
}

const moved = await walk(OUT);
console.log(
  moved > 0
    ? `postexport-rsc: flattened ${moved} RSC payload file(s) to the dotted names the client requests.`
    : "postexport-rsc: nothing to flatten.",
);
