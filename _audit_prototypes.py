#!/usr/bin/env python3
"""Read-only audit of built artefacts in prototypes/ (Meerana audit).

Usage: python _audit_prototypes.py <section>
Sections: pages | links | media | a11y | resp | markers | sizes | all
"""
import base64
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(ROOT, "prototypes")
SRC = os.path.join(P, "src")

BUILT = [
    "index.html",
    "meerana-m1-quiet-futurist.html",
    "meerana-m2-operating-model.html",
    "meerana-m3-intelligent-ecosystem.html",
    "yisbir-y1-camera-chrome.html",
    "yisbir-y2-search-index.html",
    "_hero-wall-spike.html",
    "_m3-engine-test.html",
]


def read(p):
    with open(p, encoding="utf-8", errors="replace") as f:
        return f.read()


def pagesec():
    for name in BUILT:
        fp = os.path.join(P, name)
        h = read(fp)
        out = {"page": name, "bytes": os.path.getsize(fp)}

        # sections with depth scan
        secs = []
        depth = 0
        stack = []
        for m in re.finditer(r"<section\b[^>]*>|</section>|<h[1-6]\b[^>]*>.*?</h[1-6]>", h, re.S | re.I):
            tok = m.group(0)
            if tok.lower().startswith("<section"):
                depth += 1
                idm = re.search(r'id="([^"]*)"', tok)
                stack.append({"id": idm.group(1) if idm else None, "heading": None, "depth": depth})
                secs.append(stack[-1])
            elif tok.lower().startswith("</section"):
                if stack:
                    stack.pop()
                depth = max(0, depth - 1)
            else:
                if stack and stack[-1]["heading"] is None:
                    txt = re.sub(r"<[^>]+>", " ", tok)
                    txt = re.sub(r"\s+", " ", txt).strip()
                    stack[-1]["heading"] = txt[:90]
        out["sections"] = len(secs)
        out["section_list"] = secs

        t = re.search(r"<title[^>]*>(.*?)</title>", h, re.S | re.I)
        out["title"] = re.sub(r"\s+", " ", t.group(1)).strip() if t else None
        out["lang"] = (re.search(r'<html[^>]*\blang="([^"]*)"', h, re.I) or [None, None])[1] if re.search(r'<html[^>]*\blang="([^"]*)"', h, re.I) else None
        metas = re.findall(r"<meta\b[^>]*>", h, re.I)
        out["meta_description"] = any('name="description"' in m for m in metas)
        out["og_tags"] = sorted(set(re.findall(r'property="(og:[^"]+)"', h)))
        out["twitter_tags"] = sorted(set(re.findall(r'name="(twitter:[^"]+)"', h)))
        out["canonical"] = bool(re.search(r'<link\b[^>]*rel="canonical"', h, re.I))
        out["favicon"] = bool(re.search(r'<link\b[^>]*rel="[^"]*icon[^"]*"', h, re.I))
        out["viewport"] = bool(re.search(r'<meta\b[^>]*name="viewport"', h, re.I))
        out["h1"] = len(re.findall(r"<h1\b", h, re.I))
        heads = re.findall(r"<(h[1-6])\b", h, re.I)
        out["heading_counts"] = {f"h{i}": heads.count(f"h{i}") for i in range(1, 7)}
        scripts = re.findall(r"<script\b[^>]*>(.*?)</script>", h, re.S | re.I)
        tags = re.findall(r"<script\b[^>]*>", h, re.I)
        out["script_tags"] = len(tags)
        out["script_ext"] = [re.search(r'src="([^"]*)"', t).group(1) for t in tags if re.search(r'src="([^"]*)"', t)]
        out["js_inline_bytes"] = sum(len(s.encode()) for s in scripts)
        out["js_ext_bytes"] = 0
        for s in out["script_ext"]:
            if s.startswith(("http", "//", "data:")):
                continue
            f = os.path.join(P, s.lstrip("/"))
            if os.path.exists(f):
                out["js_ext_bytes"] += os.path.getsize(f)
        out["js_total_bytes"] = out["js_inline_bytes"] + out["js_ext_bytes"]
        sty = re.findall(r"<style\b[^>]*>(.*?)</style>", h, re.S | re.I)
        out["style_tags"] = len(sty)
        out["css_inline_bytes"] = sum(len(s.encode()) for s in sty)
        out["prefers_reduced_motion"] = len(re.findall(r"prefers-reduced-motion", h))
        out["media_queries"] = len(re.findall(r"@media", h))
        out["aria_label"] = len(re.findall(r"aria-label=", h))
        out["aria_labelledby"] = len(re.findall(r"aria-labelledby=", h))
        out["role_attr"] = len(re.findall(r"\brole=", h))
        out["aria_hidden"] = len(re.findall(r"aria-hidden=", h))
        imgs = re.findall(r"<img\b[^>]*>", h, re.I)
        out["imgs"] = len(imgs)
        out["img_no_alt"] = sum(1 for i in imgs if not re.search(r"\balt\s*=", i))
        out["img_empty_alt"] = sum(1 for i in imgs if re.search(r'\balt\s*=\s*""', i))
        out["img_src_datauri"] = sum(1 for i in imgs if re.search(r'src="data:', i))
        forms = re.findall(r"<form\b[^>]*>", h, re.I)
        inputs = re.findall(r"<(?:input|select|textarea)\b[^>]*>", h, re.I)
        out["forms"] = len(forms)
        out["form_controls"] = len(inputs)
        out["labels"] = len(re.findall(r"<label\b", h, re.I))
        out["controls_with_id"] = sum(1 for i in inputs if re.search(r'\bid="', i))
        out["buttons"] = len(re.findall(r"<button\b", h, re.I))
        out["skip_link"] = bool(re.search(r'skip', h, re.I))
        out["skip_link_samples"] = re.findall(r'<a[^>]*>[^<]*skip[^<]*</a>', h, re.I)[:3]
        # fixed widths
        fx = re.findall(r"(?<!max-)(?<!min-)\bwidth\s*:\s*(\d+)px", h)
        out["fixed_px_widths_ge100"] = sorted({int(v) for v in fx if int(v) >= 100})
        out["fixed_px_widths_all_distinct"] = len(set(fx))
        out["max_width_px"] = sorted({int(v) for v in re.findall(r"max-width\s*:\s*(\d+)px", h) if int(v) >= 100})
        out["min_width_ge320"] = sorted({int(v) for v in re.findall(r"min-width\s*:\s*(\d+)px", h) if int(v) >= 320})
        print(json.dumps(out, indent=1))


def classify(href):
    if href.startswith("http://") or href.startswith("https://") or href.startswith("//"):
        return "external"
    if href.startswith("data:"):
        return "datauri"
    if href.startswith("#"):
        return "anchor"
    if href.startswith("mailto:") or href.startswith("tel:"):
        return "contact"
    if href == "":
        return "empty"
    return "local"


def links():
    target_names = set(os.listdir(P))
    for name in BUILT:
        h = read(os.path.join(P, name))
        hrefs = re.findall(r'href="([^"]*)"', h)
        seen = {}
        for x in hrefs:
            seen[x] = seen.get(x, 0) + 1
        local = {k: v for k, v in seen.items() if classify(k) == "local"}
        print(f"\n### {name}  (hrefs total {len(hrefs)}, distinct {len(seen)})")
        for k, v in sorted(seen.items(), key=lambda kv: -kv[1]):
            c = classify(k)
            if c == "local":
                base = k.split("#")[0].split("?")[0]
                ok = os.path.exists(os.path.join(P, base)) if base else None
                print(f"  LOCAL x{v}  {k}  -> exists={ok}")
            elif c in ("external", "contact", "datauri"):
                print(f"  {c.upper()} x{v}  {k[:110]}")
            else:
                print(f"  {c.upper()} x{v}  {k[:110]}")
        ids = set(re.findall(r'\bid="([^"]*)"', h))
        for k in seen:
            if k.startswith("#") and len(k) > 1 and k[1:] not in ids:
                print(f"  !! DANGLING ANCHOR {k}")


def media():
    allrefs = 0
    for name in BUILT:
        fp = os.path.join(P, name)
        h = read(fp)
        refs = []  # (kind, url)
        for m in re.finditer(r"<img\b[^>]*>", h, re.I):
            tag = m.group(0)
            s = re.search(r'\bsrc="([^"]*)"', tag)
            if s:
                refs.append(("img", s.group(1)))
            for ss in re.findall(r'srcset="([^"]*)"', tag):
                for part in ss.split(","):
                    u = part.strip().split(" ")[0]
                    if u:
                        refs.append(("img-srcset", u))
        for m in re.finditer(r"<(video|audio|source)\b[^>]*>", h, re.I):
            tag = m.group(0)
            for a in ("src", "poster"):
                s = re.search(rf'\b{a}="([^"]*)"', tag)
                if s:
                    refs.append((f"{m.group(1).lower()}-{a}", s.group(1)))
        for m in re.finditer(r'url\((["\\\']?)([^)"\\\']+)\1\)', h):
            refs.append(("css-url", m.group(2).strip()))
        counts = {"datauri": 0, "external": 0, "missing": 0, "present": 0}
        data_bytes = 0
        present_bytes = 0
        present_files = set()
        missing = []
        big = []
        for kind, u in refs:
            u = u.strip().strip("'\"")
            if not u or u.startswith("about:"):
                continue
            allrefs += 1
            if u.startswith("data:"):
                counts["datauri"] += 1
                b64 = u.split(",", 1)[1] if "," in u else ""
                if ";base64" in u:
                    try:
                        data_bytes += len(base64.b64decode(b64, validate=False))
                    except Exception:
                        data_bytes += int(len(b64) * 3 / 4)
                else:
                    data_bytes += len(b64)
                continue
            if u.startswith(("http://", "https://", "//")):
                counts["external"] += 1
                continue
            path = u.split("#")[0].split("?")[0]
            fs = os.path.join(P, path.lstrip("/"))
            if os.path.exists(fs):
                counts["present"] += 1
                if fs not in present_files:
                    present_files.add(fs)
                    present_bytes += os.path.getsize(fs)
                    if os.path.getsize(fs) > 1024 * 1024:
                        big.append((os.path.getsize(fs), path))
            else:
                counts["missing"] += 1
                missing.append((kind, path))
        print(f"\n### {name}")
        print(f"  refs={len(refs)} present={counts['present']} missing={counts['missing']} "
              f"external={counts['external']} datauri={counts['datauri']}")
        print(f"  distinct local files={len(present_files)} bytes={present_bytes}  datauri bytes={data_bytes}")
        if missing:
            print(f"  MISSING: {sorted(set(missing))}")
        if big:
            print(f"  >1MB: {big}")
    print(f"\nTOTAL mdia/style refs scanned across 8 pages: {allrefs}")


def markers():
    pats = re.compile(r"\b(TODO|FIXME|XXX|TBD|WIP|lorem ipsum|PLACEHOLDER|placeholder|coming soon|pending import)\b", re.I)
    files = [os.path.join(P, n) for n in BUILT]
    for d in (SRC,):
        for f in sorted(os.listdir(d)):
            if f.endswith((".js", ".tpl.html", ".bak", ".json")):
                files.append(os.path.join(d, f))
    files.append(os.path.join(SRC, "build.py"))
    for f in files:
        if not os.path.exists(f):
            continue
        hits = []
        for i, line in enumerate(read(f).splitlines(), 1):
            m = pats.search(line)
            if m:
                hits.append((i, m.group(1), re.sub(r"\s+", " ", line.strip())[:170]))
        if hits:
            print(f"\n### {os.path.relpath(f, ROOT)}  ({len(hits)} hits)")
            for i, w, l in hits[:60]:
                print(f"  {i}: [{w}] {l}")
            if len(hits) > 60:
                print(f"  ... +{len(hits)-60} more")


def sizes():
    print("== built pages ==")
    for n in BUILT:
        fp = os.path.join(P, n)
        print(f"  {os.path.getsize(fp):>9}  {n}   mtime={os.path.getmtime(fp):.0f}")
    print("== src ==")
    for n in sorted(os.listdir(SRC)):
        fp = os.path.join(SRC, n)
        if os.path.isfile(fp):
            print(f"  {os.path.getsize(fp):>9}  src/{n}   mtime={os.path.getmtime(fp):.0f}")
    for sub in ("assets", "thumbs", "media"):
        base = os.path.join(P, sub) if sub != "assets" else os.path.join(SRC, "assets")
        if not os.path.isdir(base):
            continue
        print(f"== {sub} ==")
        for dp, _, fns in os.walk(base):
            for fn in sorted(fns):
                fp = os.path.join(dp, fn)
                sz = os.path.getsize(fp)
                flag = "  << >1MB" if sz > 1024 * 1024 else ""
                print(f"  {sz:>9}  {os.path.relpath(fp, ROOT)}{flag}")


if __name__ == "__main__":
    sec = sys.argv[1] if len(sys.argv) > 1 else "all"
    if sec in ("pages", "all"):
        pagesec()
    if sec in ("links", "all"):
        links()
    if sec in ("media", "all"):
        media()
    if sec in ("markers", "all"):
        markers()
    if sec in ("sizes", "all"):
        sizes()
