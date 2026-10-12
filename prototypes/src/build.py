"""Build the four self-contained hero prototypes into <workspace>/prototypes/.
- Inlines ui-system/references/tokens.css (validates the token file under the Tailwind v4 browser build)
- Inlines official raster logos (cropped to alpha bounds, shown at <= native size)
- Generates deterministic geometry: M1 lattice (SVG poster + JSON for canvas), M2 isometric model,
  Y1 camera scene (poster + JSON), Y2 sample index (pre-rendered results + JSON)."""
import base64, io, json, math, os, random, re, subprocess
from PIL import Image

SRC = os.path.dirname(os.path.abspath(__file__))              # prototypes/src
WS = os.path.dirname(os.path.dirname(SRC))                     # workspace root
ASSETS = os.path.join(SRC, "assets")                           # logos extracted from the brand PDF, page 3
OUT = os.path.join(WS, "prototypes")
os.makedirs(OUT, exist_ok=True)


def logo(path, pad=2, top=None):
    im = Image.open(path).convert("RGBA")
    if top:                                                    # drop stray marks below the lockup (Mandoobee raster)
        im = im.crop((0, 0, im.width, top))
    x0, y0, x1, y1 = im.getchannel("A").getbbox()
    im = im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode(), im.size


LOGOS = {
    "MEERANA_H": logo(os.path.join(WS, "research", "recovered", "figma-make-v17", "public-meerana-assets", "MEERANA-Logo-final-transparent-white-08.png")),
    "YISBIR": logo(os.path.join(ASSETS, "yisbir-white.png"), pad=1),
    "MANDOOBEE": logo(os.path.join(ASSETS, "mandoobee.png")),
    "MANDOOBEE_CLEAN": logo(os.path.join(ASSETS, "mandoobee.png"), top=230),
    "TASREE3": logo(os.path.join(ASSETS, "tasree3.png")),
    "WASEL": logo(os.path.join(ASSETS, "wasel.png"), pad=0),
    "NAZO": logo(os.path.join(WS, "research", "recovered", "dark-draft-v2", "images", "img11.png")),
}

# ---------------------------------------------------------------- M1 lattice
def m1_lattice():
    s, N, M = 34.0, 10, 13
    W, H = 600.0, 520.0
    pts = {}
    total_w = N * s + M * s / 2
    total_h = M * s * math.sqrt(3) / 2
    x0, y0 = (W - total_w) / 2, (H - total_h) / 2
    for j in range(M + 1):
        for i in range(N + 1):
            x = x0 + i * s + (M - j) * s / 2
            y = y0 + j * s * math.sqrt(3) / 2
            pts[(i, j)] = (round(x, 2), round(y, 2))
    keep = {k: v for k, v in pts.items() if (k[0] - k[1]) % 3 != 0}
    keys = list(keep.keys())
    idx = {k: n for n, k in enumerate(keys)}
    nodes = [keep[k] for k in keys]
    edges = []
    nb = [(1, 0), (0, 1), (-1, 1)]
    for k in keys:
        for d in nb:
            k2 = (k[0] + d[0], k[1] + d[1])
            if k2 in keep:
                edges.append((idx[k], idx[k2]))
    # zones: hexagon centres (removed points) whose six neighbours exist
    six = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, -1), (-1, 1)]
    want = [("wasel", "01", "Perimeter", "Wasel", (2, 11)), ("yisbir", "02", "Cameras", "Yisbir", (2, 5)),
            ("mandoobee", "03", "Workplace", "Mandoobee", (5, 8)), ("tasree3", "04", "Processes", "Tasree3", (8, 11)),
            ("nazo", "05", "Correspondence", "Nazo", (8, 2))]
    zones = []
    for slug, no, env, prod, (ti, tj) in want:
        best = None
        for (i, j), p in pts.items():
            if (i - j) % 3 == 0 and all((i + a, j + b) in keep for a, b in six):
                dd = (i - ti) ** 2 + (j - tj) ** 2
                if best is None or dd < best[0]:
                    best = (dd, (i, j))
        ci, cj = best[1]
        ring = [(ci + 1, cj), (ci + 1, cj - 1), (ci, cj - 1), (ci - 1, cj), (ci - 1, cj + 1), (ci, cj + 1)]
        hexpts = [keep[r] for r in ring]
        cx, cy = pts[(ci, cj)]
        zones.append({"slug": slug, "no": no, "env": env, "product": prod, "cx": cx, "cy": cy,
                      "hex": [idx[r] for r in ring], "px": round(cx / W * 100, 2), "py": round(cy / H * 100, 2)})
    # poster SVG (identical styling to the canvas end-state)
    parts = [f'<svg class="poster" viewBox="0 0 {W:g} {H:g}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">',
             '<g stroke="#3FD0FF" stroke-opacity=".28" stroke-width="1" fill="none">']
    for a, b in edges:
        (xa, ya), (xb, yb) = nodes[a], nodes[b]
        parts.append(f'<line x1="{xa}" y1="{ya}" x2="{xb}" y2="{yb}"/>')
    parts.append('</g><g fill="#B5BBC3" fill-opacity=".75">')
    for x, y in nodes:
        parts.append(f'<circle cx="{x}" cy="{y}" r="1.6"/>')
    parts.append("</g>")
    for z in zones:
        poly = " ".join(f"{nodes[n][0]},{nodes[n][1]}" for n in z["hex"])
        parts.append(f'<g class="zone" data-zone="{z["slug"]}"><polygon points="{poly}" fill="#3FD0FF" fill-opacity=".07" stroke="#3FD0FF" stroke-width="1.5"/>'
                     f'<circle cx="{z["cx"]}" cy="{z["cy"]}" r="2.6" fill="#FFFFFF"/></g>')
    parts.append("</svg>")
    data = {"w": W, "h": H, "nodes": nodes, "edges": edges, "zones": [{k: z[k] for k in ("slug", "hex", "cx", "cy")} for z in zones]}
    return "".join(parts), json.dumps(data, separators=(",", ":")), zones


# ---------------------------------------------------------------- M2 isometric model
def m2_model():
    u = 30.0
    c30, s30 = math.cos(math.radians(30)), math.sin(math.radians(30))
    ox, oy = 300.0, 120.0

    def P(x, y, z):
        return (round(ox + (x - y) * c30 * u, 2), round(oy + (x + y) * s30 * u - z * u, 2))

    def poly(points, **attrs):
        a = " ".join(f'{k.replace("_", "-")}="{v}"' for k, v in attrs.items())
        return '<polygon points="' + " ".join(f"{p[0]},{p[1]}" for p in points) + f'" {a}/>'

    def box(x, y, z, w, d, h, top="#FFFFFF", left="#EDEDED", right="#DFE3E8", stroke="#9CA4AF"):
        t = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
        lf = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]
        rt = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
        return (poly(lf, fill=left, stroke=stroke, stroke_width=".8", stroke_linejoin="round") +
                poly(rt, fill=right, stroke=stroke, stroke_width=".8", stroke_linejoin="round") +
                poly(t, fill=top, stroke=stroke, stroke_width=".8", stroke_linejoin="round"))

    out = [f'<svg class="model" viewBox="0 0 600 470" aria-hidden="true" focusable="false">']
    # plinth + lattice grid on top
    out.append('<g class="plinth">' + box(0, 0, -0.5, 10, 9, 0.5, top="#F5F6F7", left="#E4E7EB", right="#D5DAE0", stroke="#9CA4AF"))
    g = ['<g stroke="#C1C6CD" stroke-width=".6">']
    for i in range(1, 10):
        a, b = P(i, 0, 0), P(i, 9, 0)
        g.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}"/>')
    for j in range(1, 9):
        a, b = P(0, j, 0), P(10, j, 0)
        g.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}"/>')
    g.append("</g></g>")
    out.append("".join(g))
    zones = []
    # back → front painter order; build delays front → back (set in CSS via --d)
    # 05 Nazo: vault + seal (back)
    z = ['<g class="zone build" data-zone="nazo" style="--d:4">', box(0.6, 0.6, 0, 1.8, 1.8, 1.5)]
    cx, cy = P(1.5, 1.5, 1.5)
    z.append(f'<ellipse cx="{cx}" cy="{cy}" rx="16" ry="9" fill="none" stroke="#0D3BFF" stroke-width="1.4"/>'
             f'<path d="M{cx-6},{cy} l4,3 l8,-6" fill="none" stroke="#0D3BFF" stroke-width="1.4" stroke-linecap="round"/></g>')
    out.append("".join(z))
    # 04 Tasree3: department blocks + orange process path
    z = ['<g class="zone build" data-zone="tasree3" style="--d:3">']
    blocks = [(4.4, 1.0), (6.4, 1.0), (8.0, 2.6)]
    for bx, by in blocks:
        z.append(box(bx, by, 0, 1.1, 1.1, 0.9))
    pth = [P(4.95, 1.55, 0.9), P(6.95, 1.55, 0.9), P(8.55, 3.15, 0.9)]
    z.append('<polyline class="t3path" points="' + " ".join(f"{p[0]},{p[1]}" for p in pth) +
             '" fill="none" stroke="#FD5D01" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>')
    mx, my = (pth[1][0] + pth[2][0]) / 2, (pth[1][1] + pth[2][1]) / 2
    z.append(f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="4" fill="#FD5D01"/></g>')
    out.append("".join(z))
    # 03 Mandoobee: office block with window grid
    z = ['<g class="zone build" data-zone="mandoobee" style="--d:2">', box(1.0, 3.6, 0, 2.6, 2.0, 2.3)]
    for k in range(1, 4):
        a, b = P(1.0 + k * 0.65, 5.6, 0.25), P(1.0 + k * 0.65, 5.6, 2.05)
        z.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="#C1C6CD" stroke-width=".7"/>')
    for k in range(1, 4):
        a, b = P(1.0, 5.6, k * 0.6), P(3.6, 5.6, k * 0.6)
        z.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="#C1C6CD" stroke-width=".7"/>')
    z.append("</g>")
    out.append("".join(z))
    # 02 Yisbir: camera masts with view cones
    z = ['<g class="zone build" data-zone="yisbir" style="--d:1">']
    for mx_, my_, cone in [(0.3, 8.4, [(0.6, 8.0), (3.4, 6.2), (2.2, 8.6)]), (9.5, 0.3, [(9.2, 0.7), (7.0, 3.6), (9.4, 2.6)])]:
        poly_pts = [P(a, b, 0) for a, b in cone]
        z.append(poly(poly_pts, fill="#43DAFE", fill_opacity=".16", stroke="#43DAFE", stroke_width=".8", stroke_dasharray="3 3"))
        z.append(box(mx_ - 0.08, my_ - 0.08, 0, 0.16, 0.16, 2.6))
        z.append(box(mx_ - 0.25, my_ - 0.15, 2.6, 0.5, 0.3, 0.28, top="#FFFFFF", left="#C1C6CD", right="#B5BBC3"))
    z.append("</g>")
    out.append("".join(z))
    # 01 Wasel: gate posts + barrier arm + low perimeter wall (front)
    z = ['<g class="zone build" data-zone="wasel" style="--d:0">']
    for wx in [0.6, 1.5, 2.4, 3.3]:                       # perimeter wall, left of the gate
        z.append(box(wx, 8.55, 0, 0.8, 0.3, 0.45))
    z.append(box(4.1, 8.5, 0, 0.3, 0.3, 1.3))              # gate post (left)
    z.append(box(4.4, 8.59, 1.0, 2.7, 0.12, 0.12, top="#C58A52", left="#C58A52", right="#B07A47", stroke="#6B3E26"))  # barrier arm
    z.append(box(7.1, 8.5, 0, 0.3, 0.3, 1.3))              # gate post (right)
    for wx in [7.6, 8.5]:                                  # perimeter wall, right of the gate
        z.append(box(wx, 8.55, 0, 0.8, 0.3, 0.45))
    z.append("</g>")
    out.append("".join(z))
    # quiet zone numerals (aria-hidden; DOM list carries the meaning)
    for slug, no, (x, y, zz) in [("nazo", "05", (1.5, 0.2, 2.2)), ("tasree3", "04", (6.9, 0.4, 1.7)),
                                   ("mandoobee", "03", (1.0, 3.6, 2.9)), ("yisbir", "02", (9.6, 0.1, 3.6)), ("wasel", "01", (4.3, 8.4, 2.0))]:
        px, py = P(x, y, zz)
        out.append(f'<text class="znum" data-zone="{slug}" x="{px}" y="{py}">{no}</text>')
    out.append("</svg>")
    return "".join(out)


# ---------------------------------------------------------------- Y1 camera scene
def y1_scene():
    """Runs proto/y1_scene.js under node: the same module the page runs, so the poster (t = 0) and the
    first canvas frame are produced by identical code. Returns the module source + the generated parts."""
    js = os.path.join(SRC, "y1_scene.js")
    out = json.loads(subprocess.run(["node", js], capture_output=True, text=True, encoding="utf-8", check=True).stdout)
    return open(js, encoding="utf-8").read(), out


# ---------------------------------------------------------------- Y2 sample index
def y2_index():
    """Runs proto/y2_index.js under node: the page's own search module renders the default results,
    so the pre-rendered HTML and in-page searches share one renderer."""
    js = os.path.join(SRC, "y2_index.js")
    out = json.loads(subprocess.run(["node", js], capture_output=True, text=True, encoding="utf-8", check=True).stdout)
    return open(js, encoding="utf-8").read(), out


# ---------------------------------------------------------------- M3 intelligent ecosystem
def m3_scene():
    """Runs m3_scene.js under node: the page's own formation library draws the hero poster, so the first
    paint and the first WebGL frame are the same shape. The dashboard table is built from the same sample data."""
    js = os.path.join(SRC, "m3_scene.js")
    out = json.loads(subprocess.run(["node", js], capture_output=True, text=True, encoding="utf-8", check=True).stdout)
    smp = out["sample"]
    rows = ['<thead><tr><th scope="col">Zone</th>' + "".join(f'<th scope="col" class="text-center">{b}</th>' for b in smp["bands"]) +
            '<th scope="col" class="text-end">Total</th></tr></thead><tbody>']
    hot_zone, hot_total, hot_after = None, 0, 0
    for z, ev in zip(smp["zones"], smp["events"]):
        tot = sum(ev)
        if tot > hot_total:
            hot_zone, hot_total, hot_after = z, tot, ev[0] + ev[3]
        hot = ' class="hot"' if z == "Bay 3" else ""
        rows.append(f'<tr{hot}><th scope="row">{z}</th>' + "".join(f'<td class="n h{min(n, 3)}">{n}</td>' for n in ev) + f'<td class="tot">{tot}</td></tr>')
    rows.append("</tbody>")
    insight = f"{hot_zone}: {hot_after} of {hot_total} events between 18:00 and 06:00."
    return open(js, encoding="utf-8").read(), out, "".join(rows), insight


# ---------------------------------------------------------------- M3 v3: cards, wall and proof from data manifests
def _load_json(name):
    path = os.path.join(SRC, name)
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def _esc(t):
    return (str(t or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))


def _slug(t):
    t = re.sub(r"[^a-z0-9]", "", str(t or "").lower())
    return {"aiinabox": "aibox", "agenticai": "aibox", "ai": "aibox"}.get(t, t)


def _media_path(f, sub):
    f = str(f).replace("\\", "/")
    if "media/" in f:
        f = f[f.index("media/"):]
    return f if f.startswith("media/") else "media/m3/" + sub + "/" + f


def m3_media_index():
    """m3_media.json (media agent) grouped by (product slug, use); empty when absent."""
    data = _load_json("m3_media.json") or []
    items = data.get("items", data) if isinstance(data, dict) else data
    idx = {}
    for it in items:
        if not isinstance(it, dict) or not it.get("file"):
            continue
        idx.setdefault((_slug(it.get("product")), str(it.get("use", "card")).lower()), []).append(it)
    return idx


ZOOM_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>'


def m3_cards(posters):
    prods = _load_json("m3_products.json")["products"]
    idx, out, wall_fallback = m3_media_index(), [], []
    for i, p in enumerate(prods):
        shots = []
        for it in idx.get((p["slug"], "loop"), []) + idx.get((p["slug"], "card"), []):
            shots.append({"file": _media_path(it["file"], "v3"), "caption": it.get("caption", ""), "alt": it.get("alt", ""),
                          "tab": it.get("tab_label") or it.get("tab") or "", "poster": it.get("poster"), "w": it.get("w"), "h": it.get("h"),
                          "contain": it.get("contain")})
        if not shots:
            shots = [dict(x) for x in p["fallback"]]
        frame = []
        for j, sh in enumerate(shots):
            on = " is-on" if j == 0 else ""
            cap, alt = _esc(sh.get("caption")), _esc(sh.get("alt"))
            if sh.get("poster") in posters:
                frame.append(posters[sh["poster"]].replace('class="m3p ', 'class="m3p shot%s " data-caption="%s" data-title="%s" role="img" aria-label="%s" ' % (on, cap, alt, alt), 1))
            elif str(sh.get("file", "")).endswith(".mp4"):
                pst = _media_path(sh.get("poster") or sh["file"][:-4] + ".poster.webp", "v3")
                frame.append('<video class="shot%s" muted playsinline loop preload="none" poster="%s" data-caption="%s" data-title="%s" aria-label="%s">'
                             '<source src="%s" type="video/mp4"></video>' % (on, pst, cap, alt, alt, sh["file"]))
            else:
                wh = (' width="%s" height="%s"' % (sh["w"], sh["h"])) if sh.get("w") else ""
                frame.append('<img class="shot%s%s" src="%s"%s loading="lazy" decoding="async" data-caption="%s" data-title="%s" alt="%s">'
                             % (on, " contain" if sh.get("contain") else "", sh["file"], wh, cap, alt, alt))
                wall_fallback.append({"file": sh["file"], "product": p["slug"], "alt": sh.get("alt", ""), "caption": sh.get("caption", "")})
        tabs = ""
        if len(shots) > 1:
            tabs = '<div class="seg" data-tabs role="group" aria-label="%s screens">%s</div>' % (_esc(p["name"]), "".join(
                '<button type="button" aria-pressed="%s">%s</button>' % ("true" if j == 0 else "false", _esc(x.get("tab") or "Screen %d" % (j + 1)))
                for j, x in enumerate(shots)))
        first_cap = shots[0].get("caption", "")
        cap_cls = "cap screen" if (first_cap.startswith("Product screen") or first_cap.startswith("App")) else "cap"
        if p.get("logo"):
            k = p["logo"]
            logo = '<img src="{{LOGO_%s}}" width="{{LOGO_%s_W}}" height="{{LOGO_%s_H}}" alt="%s">' % (k, k, k, _esc(p["name"]))
        else:
            logo = '<span class="word">%s</span>' % _esc(p["name"])
        deploy = ('<dl class="pc-deploy"><dt>Deploys</dt><dd data-ev="%s">%s</dd></dl>' % (p["deploy_ev"], _esc(p["deploy"]))) if p.get("deploy") else ""
        attr = (' data-product="%s"' % p["accent_attr"]) if p.get("accent_attr") else ""
        subject = (p["name"] + " briefing").replace(" ", "%20")
        out.append("\n".join([
            '          <li class="pcard card %s"%s data-i="%d" data-slug="%s">' % (p.get("accent_class", ""), attr, i, p["slug"]),
            '            <div class="pc-info">',
            '              <h3 class="pc-logo">%s</h3>' % logo,
            '              <p class="pc-desc" data-ev="%s">%s</p>' % (p["desc_ev"], _esc(p["desc"])),
            '              <p class="pc-line" data-ev="%s">%s</p>' % (p["line_ev"], _esc(p["line"])),
            '              <ul class="pc-caps" data-ev="%s">%s</ul>' % (p["caps_ev"], "".join("<li>%s</li>" % _esc(c) for c in p["caps"])),
            '              %s' % deploy,
            '              <a class="btn btn-secondary btn-md pc-cta" href="mailto:info@meerana.ae?subject=%s">%s <span class="arr" aria-hidden="true">&#8594;</span></a>' % (subject, _esc(p["cta"])),
            '            </div>',
            '            <figure class="pc-media">',
            '              <div class="pc-frame" data-zoom>%s</div>' % "".join(frame),
            '              <figcaption class="pc-meta">%s<span class="%s" data-cap>%s</span><button type="button" class="icon-btn bordered" data-zoom-btn aria-label="Open %s screens full size">%s</button></figcaption>'
            % (tabs, cap_cls, _esc(first_cap), _esc(p["name"]), ZOOM_SVG),
            '            </figure>',
            '          </li>']))
    return "\n".join(out), wall_fallback


def m3_wall(wall_fallback):
    idx = m3_media_index()
    tiles = [dict(file=_media_path(it["file"], "v3"), product=_slug(it.get("product")), alt=it.get("alt", ""), caption=it.get("caption", ""))
             for (slug, use), items in sorted(idx.items()) if use == "wall" for it in items]
    if not tiles:
        tiles = wall_fallback
    tiles = sorted(tiles, key=lambda t: t["file"])
    cols = [[], [], []]
    for k, t in enumerate(tiles):
        cols[k % 3].append(t)

    def tile(t, n, dup):
        extra = ' tabindex="-1" aria-hidden="true"' if dup else ""
        load = ' loading="lazy"' if (n > 5 or dup) else ""
        return ('<button type="button" class="wall-tile" data-product="%s" data-full="%s" data-title="%s"%s aria-label="Open screen: %s">'
                '<img src="%s" alt=""%s decoding="async"></button>' % (t["product"], t["file"], _esc(t["alt"]), extra, _esc(t["alt"]), t["file"], load))
    html, n = ['<div class="hero-wall" data-wall role="region" aria-label="Product screens">', '<div class="wall-plane">'], 0
    for c in cols:
        html.append('<div class="wall-col">')
        for t in c:
            html.append(tile(t, n, False))
            n += 1
        for t in c:
            html.append(tile(t, n, True))
        html.append('</div>')
    html.append('</div><p class="wall-cap cap">Product screens · demo data and design concepts</p></div>')
    return "".join(html)


def m3_proof():
    """Proof as published on meerana.ae (owner, 2026-10-10: "bring everything from meerana.ae for now").
    Renders the judge-worded awards plus the site's Labour Market award (held only for its certificate), the verified
    partner lines plus the site's own portfolio lines. Never: placeholder testimonials, the EV-201 duplicate award."""
    data = _load_json("m3_proof.json") or {}
    logos, awards, partners = [], [], []
    for lg in data.get("logos", []):
        f = lg.get("web_file") or lg.get("file")
        if not f:
            continue
        logos.append('<li title="%s"><img src="%s" alt="%s" loading="lazy" decoding="async"></li>'
                     % (_esc(lg.get("label") or lg.get("name") or ""), _media_path(f, "proof/logos"), _esc(lg.get("name") or "")))
    award_items = list(data.get("awards", []))
    for w in data.get("awards_withheld", []):
        if "never promote" in str(w.get("withheld_reason", "")).lower() or not w.get("title"):
            continue
        award_items.append(w)
    for aw in award_items:
        awards.append('<li class="award card"><div class="award-body"><h4>%s</h4><p class="t-cap mt-2">%s</p></div></li>'
                      % (_esc(aw.get("title")), _esc(aw.get("issuer") or "")))
    for pt in list(data.get("partner_text", [])) + list(data.get("partner_text_site_only", [])):
        nm, rel = pt.get("partner") or "", pt.get("relationship") or pt.get("text_as_site") or ""
        if nm and rel.lower().startswith(nm.lower() + " - "):
            rel = rel[len(nm) + 3:]
        partners.append("<li><b>%s</b><span>%s</span></li>" % (_esc(nm), _esc(rel)))
    note = '<p class="t-cap mt-6">As published on meerana.ae (retrieved 2 October 2026).</p>'
    logos_html = ('<ul class="logos" data-audit-ok="G05">%s</ul>%s' % ("".join(logos), note)) if logos else '<p class="t-cap mt-4">Logos pending import.</p>'
    awards_html = ('<ul class="awards" data-audit-ok="G05">%s</ul>' % "".join(awards)) if awards else ""
    partners_html = ('<ul class="partners-text" data-audit-ok="G05">%s</ul>' % "".join(partners)) if partners else ""
    return logos_html, awards_html, partners_html


# ---------------------------------------------------------------- render
def render(tpl_name, out_name, extra):
    tpl = open(os.path.join(SRC, tpl_name), encoding="utf-8").read()
    tokens = open(os.path.join(WS, ".claude", "skills", "ui-system", "references", "tokens.css"), encoding="utf-8").read()
    rep = {"TOKENS_CSS": tokens}
    for k, (uri, size) in LOGOS.items():
        rep[f"LOGO_{k}"] = uri
        rep[f"LOGO_{k}_W"] = str(size[0])
        rep[f"LOGO_{k}_H"] = str(size[1])
    rep.update(extra)
    html = re.sub(r"\{\{([A-Z0-9_]+)\}\}", lambda m: rep[m.group(1)], tpl)
    html = re.sub(r"\{\{(LOGO_[A-Z0-9_]+)\}\}", lambda m: rep[m.group(1)], html)   # logo placeholders inside generated parts
    open(os.path.join(OUT, out_name), "w", encoding="utf-8").write(html)
    print(out_name, f"{len(html)/1024:.0f} KB")


if __name__ == "__main__":
    import sys
    only = set(sys.argv[1:])                      # e.g. `python build.py m3` rebuilds one prototype
    if os.path.exists(os.path.join(SRC, "m3.tpl.html")) and (not only or "m3" in only):
        m3js, m3, m3rows, m3insight = m3_scene()
        posters = {"iot": m3["posterIot"].replace("panel-poster", ""), "assets": m3["posterAssets"].replace("panel-poster", "")}
        cards, wall_fb = m3_cards(posters)
        logos_html, awards_html, partners_html = m3_proof()
        render("m3.tpl.html", "meerana-m3-intelligent-ecosystem.html", {"M3_SCENE_JS": m3js, "M3_HERO_POSTER": m3["poster"],
               "M3_CARDS": cards, "M3_HERO_WALL": m3_wall(wall_fb), "M3_PROOF_LOGOS": logos_html, "M3_PROOF_AWARDS": awards_html,
               "M3_PROOF_PARTNERS": partners_html,
               "M3_DASH_ROWS": m3rows, "M3_DASH_INSIGHT": m3insight, "M3_POSTER_IOT": m3["posterIot"], "M3_POSTER_ASSETS": m3["posterAssets"],
               "M3_ENGINE_JS": open(os.path.join(SRC, "m3_engine.js"), encoding="utf-8").read()})
    if only and "m3" in only and len(only) == 1:
        sys.exit(0)
    svg, data, zones = m1_lattice()
    zl = "".join(
        f'<a class="zone-label" href="#product-{z["slug"]}" data-zone="{z["slug"]}" style="--px:{z["px"]}%;--py:{z["py"]}%">'
        f'<span class="font-mono">{z["no"]}</span> <span class="env">{z["env"].upper()}</span> <span class="prod">{z["product"]}</span></a>'
        for z in zones)
    if os.path.exists(os.path.join(SRC, "m1.tpl.html")):
        render("m1.tpl.html", "meerana-m1-quiet-futurist.html", {"M1_LATTICE_SVG": svg, "M1_LATTICE_JSON": data, "M1_ZONE_LABELS": zl})
    if os.path.exists(os.path.join(SRC, "m2.tpl.html")):
        render("m2.tpl.html", "meerana-m2-operating-model.html", {"M2_MODEL_SVG": m2_model()})
    y1js, y1 = y1_scene()
    if os.path.exists(os.path.join(SRC, "y1.tpl.html")):
        render("y1.tpl.html", "yisbir-y1-camera-chrome.html", {"Y1_SCENE_JS": y1js, "Y1_STATIC_SVG": y1["scene"],
               "Y1_POSTER_SVG": y1["poster"], "Y1_EVENTS_DEFAULT": y1["events"],
               "Y1_COUNT_ZONE": str(y1["inZone"]), "Y1_COUNT_PPE": str(y1["ppe"])})
    if os.path.exists(os.path.join(SRC, "y2.tpl.html")):
        y2js, y2 = y2_index()
        c = y2["counts"]
        render("y2.tpl.html", "yisbir-y2-search-index.html", {
            "Y2_INDEX_JS": y2js, "Y2_QUERY": y2["q"], "Y2_RESULTS_DEFAULT": y2["results"], "Y2_TICKS_DEFAULT": y2["ticks"],
            "Y2_STATUS_DEFAULT": y2["status"], "Y2_N_ALL": str(c["ALL"]), "Y2_N_TRANSCRIPT": str(c["TRANSCRIPT"]),
            "Y2_N_OCR": str(c["ON-SCREEN TEXT"]), "Y2_N_OBJECT": str(c["OBJECT"]),
            # the Y1 frame at t = 0 doubles as the "Also live" thumbnail (labels hidden by CSS at that size)
            "Y1_THUMB_SVG": y1["scene"].replace('class="scene', 'class="th-scene', 1) + y1["poster"].replace('class="poster"', 'class="th-poster"', 1)})
    if os.path.exists(os.path.join(SRC, "index.tpl.html")):
        render("index.tpl.html", "index.html", {})
