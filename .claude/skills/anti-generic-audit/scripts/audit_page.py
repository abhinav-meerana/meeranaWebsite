#!/usr/bin/env python3
"""audit_page.py: fail pages that look AI-generated or template-made, and propose a fix for each failure.

Usage
  python audit_page.py page.html [more files] [--brand meerana|yisbir] [--strict] [--json]

Inputs   .html/.htm (full parse); .jsx/.tsx/.js (className strings + JSX text via regex)
Output   a findings table with severity, check id, evidence and a SPECIFIC fix; exit 1 on any FAIL.
Score    100 − 15 per FAIL − 5 per WARN (floor 0). Verdict PASS requires zero FAIL.
Standard library only. Heuristic: a human still does the visual pass in references/checklist.md.

Conventions the audit understands (see SKILL.md):
  data-signature        the ONE signature-motion element on the page
  data-ev="EV-123"      the element's number/claim is backed by the evidence register
  data-illustrative     sample/demo UI (numbers inside are allowed if the label is visible)
  data-motion-control   the pause/play control for loops > 5 s
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
UTIL = "bg|text|from|via|to|border|ring|fill|stroke|outline|decoration|shadow|divide|placeholder|caret|accent"
TW_DEFAULT = re.compile(rf"(?<![\w-])(?:[a-z]+:)*({UTIL})-({PALETTE})-(50|100|200|300|400|500|600|700|800|900|950)(?:/\d+)?\b")
PURPLE_GRAD = re.compile(r"(?<![\w-])(?:from|via|to)-(?:purple|indigo|violet|fuchsia|pink)-\d+")
GRAD_CLASS = re.compile(r"(?<![\w-])bg-(?:gradient|linear|radial|conic)-to?-?[a-z]*|(?<![\w-])bg-(?:linear|radial|conic)-")
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U0001F000-\U0001F2FF\U00002600-\U000026FF\U0001F900-\U0001F9FF]")
DINGBAT = re.compile("[✀-➿]")
PLACEHOLDER = re.compile(r"\b(lorem ipsum|dolor sit amet|consectetur adipiscing|your company|company name|john doe|jane doe|placeholder text|insert (?:text|copy) here|tbd)\b|\bTODO\b|example\.com", re.I)
STOCK = re.compile(r"unsplash|pexels|shutterstock|istockphoto|gettyimages|adobestock|stock\.adobe|freepik|pixabay|depositphotos|dreamstime|123rf", re.I)
STOCK_ALT = re.compile(r"\b(robot|cyborg|ai brain|digital brain|neural network illustration|abstract technology|futuristic background|stock (?:photo|image))\b", re.I)
FILLER = ["revolutionary", "revolutionize", "cutting-edge", "cutting edge", "next-gen", "next-generation", "seamless", "seamlessly",
          "unleash", "supercharge", "game-changer", "game changing", "state-of-the-art", "world-class", "harness the power",
          "unlock the power", "synergy", "best-in-class", "innovative solutions", "empower your", "transform your business"]
NUMBER = re.compile(r"(?<![\w#.-])(\d{1,3}(?:[,.]\d{3})*(?:\.\d+)?\s?%|\d+(?:\.\d+)?\s?[xX](?=\W|$)|\d+(?:\.\d+)?\s?[KMB]\+|\d{2,}\+|24/7)")
NEON_HEX = re.compile(r"#(?:0052FF|00E5FF|7C3AED|8B5CF6|A855F7|6366F1|4F46E5)\b", re.I)
MAC_DOTS = re.compile(r"(?:bg-red-\d{3}|#ff5f57|#ff605c)[\s\S]{0,400}?(?:bg-(?:yellow|amber)-\d{3}|#febc2e|#ffbd44)[\s\S]{0,400}?(?:bg-green-\d{3}|#28c840|#00ca4e)", re.I)

GENERIC_FONTS = {"inter", "roboto", "arial", "helvetica", "open sans", "system-ui", "sans-serif", "lato", "montserrat?"}
BRAND_FONTS = {"meerana": {"poppins", "almarai"}, "yisbir": {"montserrat", "tajawal"}}

FIX_SEMANTIC = {
    ("bg", "dark"): "bg-surface-deep", ("bg", "mid"): "bg-surface-raised", ("bg", "light"): "bg-surface (data-surface=\"light\")",
    ("text", "dark"): "text-fg (light surface)", ("text", "mid"): "text-fg-muted", ("text", "light"): "text-fg-secondary",
    ("border", "any"): "border-line / border-line-strong",
}


def unconditional_raf_loop(text):
    """A function that re-schedules itself with requestAnimationFrame without an `if` guard = continuous loop."""
    for m in re.finditer(r"function\s+(\w+)\s*\([^)]*\)\s*\{", text):
        name, start = m.group(1), m.end()
        call = re.search(r"requestAnimationFrame\(\s*" + re.escape(name) + r"\s*\)", text[start:start + 4000])
        if call and not re.search(r"\bif\s*\(|\?\s*$|&&\s*$", text[start:start + call.start()][-160:]):
            return True
    return False


def semantic_fix(util, hue, shade):
    s = int(shade)
    tone = "dark" if s >= 900 else "mid" if s >= 600 else "light"
    if hue in ("blue", "indigo", "sky"):
        return "bg-action" if util == "bg" else "text-link / text-signal"
    if hue in ("purple", "violet", "fuchsia", "pink"):
        return "remove: no brand equivalent (brand uses blue/navy/cyan; YISBIR aqua/abyss)"
    p = util if util in ("bg", "text", "border", "ring", "fill", "stroke", "outline") else "text"
    if hue in ("red", "rose"):
        return f"{p}-danger (functional state only)"
    if hue in ("green", "emerald", "lime", "teal"):
        return f"{p}-success (functional state only); never a product colour (Tasree3 is orange/navy)"
    if hue in ("amber", "yellow", "orange"):
        return f"{p}-warning, or data-product=\"tasree3\" + {p}-product for Tasree3 orange"
    if hue == "cyan":
        return f"{p}-signal on dark surfaces (Meerana cyan #3FD0FF)"
    if util in ("border", "divide", "ring", "outline"):
        return FIX_SEMANTIC[("border", "any")]
    return FIX_SEMANTIC.get((util if util in ("bg", "text") else "text", tone), "a semantic token from ui-system")


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []          # (tag, attrs, element_id)
        self.elements = []       # dicts: tag, attrs, parent, children, text
        self.texts = []          # (text, element_id)
        self.styles, self.scripts, self.links, self.metas = [], [], [], []
        self.title = ""
        self.lang = None
        self._in = None

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        parent = self.stack[-1][2] if self.stack else None
        el = {"id": len(self.elements), "tag": tag, "attrs": a, "parent": parent, "children": [], "text": ""}
        self.elements.append(el)
        if parent is not None:
            self.elements[parent]["children"].append(el["id"])
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "link":
            self.links.append(a)
        if tag == "meta":
            self.metas.append(a)
        if tag in ("style", "script", "title"):
            self._in = tag
        if tag not in ("br", "img", "meta", "link", "input", "hr", "source", "wbr", "area", "base", "col", "embed", "param", "track"):
            self.stack.append((tag, a, el["id"]))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break
        if tag == self._in:
            self._in = None

    def handle_data(self, data):
        if self._in == "style":
            self.styles.append(data)
            return
        if self._in == "script":
            self.scripts.append(data)
            return
        if self._in == "title":
            self.title += data
            return
        if data.strip() and self.stack:
            eid = self.stack[-1][2]
            self.elements[eid]["text"] += data
            self.texts.append((data.strip(), eid))


def ancestors(page, eid):
    while eid is not None:
        yield page.elements[eid]
        eid = page.elements[eid]["parent"]


def text_of(page, eid, limit=200):
    out = []

    def walk(i):
        el = page.elements[i]
        if el["text"]:
            out.append(el["text"])
        for c in el["children"]:
            walk(c)
    walk(eid)
    return " ".join(" ".join(out).split())[:limit]


def audit(path, brand=None, strict=False):
    raw = path.read_text(encoding="utf-8", errors="replace")
    findings = []

    def add(sev, code, title, evidence, fix):
        findings.append({"severity": sev, "check": code, "title": title, "evidence": evidence[:300], "fix": fix})

    is_html = path.suffix.lower() in (".html", ".htm")
    page = Page() if is_html else None
    if is_html:
        page.feed(raw)
    classes_blob = " ".join(e["attrs"].get("class", "") for e in page.elements) if is_html else " ".join(re.findall(r"className=[{`'\"]+([^`'\"}]+)", raw))
    style_blob = "\n".join(page.styles) if is_html else raw
    script_blob = "\n".join(page.scripts) if is_html else raw
    visible_text = " ".join(t for t, _ in page.texts) if is_html else " ".join(re.findall(r">\s*([^<>{}]*[A-Za-z][^<>{}]*)\s*<", raw))

    # G01 default Tailwind palette
    hits = TW_DEFAULT.findall(classes_blob + " " + (raw if not is_html else ""))
    if hits:
        uniq = sorted({f"{u}-{h}-{s}" for u, h, s in hits})
        fixes = sorted({f"{u}-{h}-{s} → {semantic_fix(u, h, s)}" for u, h, s in hits})[:8]
        add("FAIL", "G01", f"Default Tailwind palette classes ({len(hits)} uses, {len(uniq)} distinct)",
            ", ".join(uniq[:12]), "Reset the palette (--color-*: initial) and use ui-system semantic tokens: " + "; ".join(fixes))

    # G02 purple/indigo gradients
    pg = PURPLE_GRAD.findall(classes_blob + " " + (raw if not is_html else ""))
    css_purple = re.findall(r"linear-gradient\([^)]*(?:purple|violet|indigo|#7c3aed|#8b5cf6|#a855f7|#6366f1)[^)]*\)", style_blob, re.I)
    if pg or css_purple:
        add("FAIL", "G02", "Purple/indigo gradient", ", ".join(sorted(set(pg))[:8] + css_purple[:2]),
            "Delete the gradient. The only brand gradient is the blue→navy→cyan→neutral ramp, used as a 1 px rule or lattice light (plan/09 §3). Use a flat bg-action for CTAs.")

    # G03 emoji as icons/bullets
    em = EMOJI.findall(visible_text)
    if em:
        add("FAIL", "G03", f"Emoji used as icons/bullets ({len(em)})", " ".join(sorted(set(em))[:12]),
            "Replace with Lucide icons (1.5 px stroke, 24 px grid) or plain text labels. One icon set only.")
    db = DINGBAT.findall(visible_text)
    if db and not em:
        add("WARN", "G03", f"Dingbat symbols in text ({len(db)})", " ".join(sorted(set(db))[:8]),
            "Prefer Lucide check/arrow icons with aria-hidden and a text label.")

    # G04 placeholder text
    ph = PLACEHOLDER.findall(raw)
    if ph:
        add("FAIL", "G04", "Placeholder / Lorem text", ", ".join(sorted({p if isinstance(p, str) else p[0] for p in ph})[:6]),
            "Replace with real copy that carries an evidence id (meerana-evidence), or delete the block. Never ship testimonials without a named, consenting source.")

    # G05 identical card grids (HTML only). A parent may opt out with data-audit-ok="G05" + a reason in the
    # report (e.g. the page's single product index); that is recorded as INFO, never silently skipped.
    if is_html:
        for el in page.elements:
            kids = [page.elements[c] for c in el["children"] if page.elements[c]["tag"] not in ("script", "style")]
            if len(kids) < 3:
                continue
            if "G05" in el["attrs"].get("data-audit-ok", ""):
                add("INFO", "G05", f"Repeated structure accepted by data-audit-ok ({el['tag']}.{el['attrs'].get('class', '')[:30]}, {len(kids)} items)",
                    text_of(page, kids[0]["id"], 80), "Justify in the audit report (e.g. single product index / evidence placards).")
                continue
            sigs = []
            for k in kids:
                child_tags = tuple(page.elements[c]["tag"] for c in k["children"])
                sigs.append((k["tag"], k["attrs"].get("class", ""), child_tags))
            common = max(set(sigs), key=sigs.count)
            n = sigs.count(common)
            if n >= 3 and common[2] and any(t in common[2] for t in ("h3", "h4", "p")) and len(common[2]) >= 2:
                has_icon = all(any(page.elements[c]["tag"] in ("svg", "img", "i") for c in k["children"]) for k in kids[:n])
                sev = "FAIL" if (n >= 3 and has_icon and len(set(len(text_of(page, k["id"])) // 40 for k in kids[:n])) <= 2) else "WARN"
                add(sev, "G05", f"Identical card grid ({n} cards: {common[0]}.{common[1][:40]} → {'/'.join(common[2])})",
                    text_of(page, kids[0]["id"], 120),
                    "Turn it into a bento with differentiated cells (2×2 / 2×1 / 1×1, each with different content: real UI, a list, a fact table), a placard rail, or a plain list. Never 3–4 identical icon+title+blurb cards.")
                break

    # G06 typography
    fams = set()
    for l in (page.links if is_html else []):
        href = l.get("href", "")
        if "fonts.googleapis.com" in href:
            fams |= {f.split(":")[0].replace("+", " ").lower() for f in re.findall(r"family=([^&]+)", href)}
    fams |= {f.strip().strip("'\"").lower() for decl in re.findall(r"font-family\s*:\s*([^;}{]+)", style_blob) for f in decl.split(",")}
    fams |= {m.lower() for m in re.findall(r"--font-[a-z-]+\s*:\s*['\"]?([A-Za-z0-9 ]+)", style_blob)}
    named = {f for f in fams if f and not f.startswith("var(") and f not in ("inherit", "initial", "ui-sans-serif", "sans-serif", "serif", "monospace", "ui-monospace", "system-ui")}
    if named and named <= {"inter", "roboto", "arial", "helvetica", "open sans", "lato"}:
        add("FAIL", "G06", "Generic-only typography (no display face)", ", ".join(sorted(named)),
            "Use the brand faces with a display treatment: Meerana Poppins 300/600 at the display-xl token (≤ 4.4rem for 8-word heroes), −0.035em (Almarai for Arabic); YISBIR Montserrat 500/600 + IBM Plex Mono for telemetry. Max 2–3 families.")
    elif brand and not (named & BRAND_FONTS[brand]) and is_html:
        add("WARN", "G06", f"Brand typeface missing for {brand}", ", ".join(sorted(named)) or "(none declared)",
            f"Load {' + '.join(sorted(BRAND_FONTS[brand]))} (meerana-brand / ui-system).")
    if brand and named & {"inter", "space grotesk", "jetbrains mono", "manrope"}:
        add("WARN", "G06", "Off-brand typeface from earlier drafts / template defaults", ", ".join(sorted(named & {"inter", "space grotesk", "jetbrains mono", "manrope"})),
            "Replace with the brand faces; Figma Make / Dark Draft fonts are not brand sources (meerana-brand).")

    # G07 stock imagery
    srcs = [e["attrs"].get("src", "") + " " + e["attrs"].get("srcset", "") for e in page.elements if e["tag"] in ("img", "source")] if is_html else re.findall(r"src=['\"{]+([^'\"}]+)", raw)
    stock = [s for s in srcs if STOCK.search(s)] + re.findall(r"url\(([^)]*(?:" + STOCK.pattern + r")[^)]*)\)", style_blob, re.I)
    alts = [e["attrs"].get("alt", "") for e in page.elements if e["tag"] == "img"] if is_html else re.findall(r"alt=['\"]([^'\"]*)", raw)
    stock_alt = [a for a in alts if STOCK_ALT.search(a)]
    if stock or stock_alt:
        add("FAIL", "G07", "Stock / generic AI imagery", ", ".join((stock + stock_alt)[:4]),
            "Show model output or product UI (labelled real/reconstructed/illustrative), lattice line art, or verified in-situ photography with rights cleared (research/photo-curation.md).")

    # G08 centred-everything
    if is_html:
        h1s = [e for e in page.elements if e["tag"] == "h1"]
        def centred(e):
            return any("text-center" in a["attrs"].get("class", "") or re.search(r"text-align\s*:\s*center", a["attrs"].get("style", "")) for a in ancestors(page, e["id"]))
        heads = [e for e in page.elements if e["tag"] in ("h1", "h2")]
        centred_heads = [h for h in heads if centred(h)]
        if h1s and centred(h1s[0]):
            add("WARN", "G08", "Centred hero", text_of(page, h1s[0]["id"], 80),
                "Left-align the hero on the 12-column grid: text in cols 1–6, product UI/visual in cols 7–12 (reference pattern P7).")
        if heads and len(centred_heads) / len(heads) > 0.6 and len(heads) >= 3:
            add("FAIL", "G08", f"Centred-everything layout ({len(centred_heads)}/{len(heads)} headings centred)", "",
                "Left-align section headers and content; reserve centring for one short closing statement.")

    # G09 signature interaction (count the attribute on elements; selectors in scripts don't count)
    sig = sum(1 for e in page.elements if "data-signature" in e["attrs"]) if is_html else len(re.findall(r"<[a-zA-Z][^<>]*\sdata-signature(?:[\s=>/])", raw))
    motion_present = bool(re.search(r"<canvas|requestAnimationFrame|gsap\.|@keyframes|animation\s*:", raw))
    if sig == 0:
        add("FAIL" if is_html else "WARN", "G09", "No declared signature interaction",
            "motion present but undeclared" if motion_present else "page is static",
            "Pick ONE signature motion that explains something (e.g. lattice assembly, model build, detection lock-on, index ticks); mark it data-signature; everything else quiet (web-animations).")
    elif sig > 1:
        add("FAIL", "G09", f"{sig} signature motions", "", "Keep one; demote the rest to quiet reveals or static.")

    # G10 glassmorphism
    glass = len(re.findall(r"backdrop-blur|backdrop-filter", raw))
    if glass >= 2:
        add("FAIL", "G10", f"Glassmorphism stacking ({glass} uses)", "", "Use opaque bg-surface-raised with a 1 px border-line; no backdrop-filter over moving content.")
    elif glass == 1:
        add("WARN", "G10", "Glass panel", "", "Prefer an opaque raised surface with a hairline border.")

    # G11 gradient CTAs
    if is_html:
        grad_btns = [e for e in page.elements if e["tag"] in ("a", "button") and (GRAD_CLASS.search(e["attrs"].get("class", "")) or "gradient" in e["attrs"].get("style", ""))]
        if grad_btns:
            add("FAIL", "G11", f"Gradient buttons ({len(grad_btns)})", text_of(page, grad_btns[0]["id"], 60),
                "Flat primary button: bg-action text-on-action hover:bg-action-hover, radius rounded-control; no glow shadow.")
    elif re.search(r"<(?:a|button)[^>]*className=[^>]*bg-gradient-to", raw):
        add("FAIL", "G11", "Gradient buttons", "", "Flat primary button: bg-action text-on-action.")

    # G12 fake OS chrome
    if MAC_DOTS.search(raw):
        add("FAIL", "G12", "macOS traffic-light window chrome around product UI", "",
            "Remove the fake OS chrome. Use the product's own chrome (camera ID + timecode for YISBIR, app header for Nazo) or a neutral 1 px frame with a provenance label.")

    # G13 unverified numbers
    unbacked = []
    if is_html:
        for t, eid in page.texts:
            for m in NUMBER.finditer(t):
                if not any("data-ev" in a["attrs"] or "data-illustrative" in a["attrs"] for a in ancestors(page, eid)):
                    unbacked.append(m.group(0))
    else:
        unbacked = NUMBER.findall(visible_text)
        # numbers held in string literals (stats/config objects rendered by JSX)
        for lit in re.findall(r"[\"']([^\"'\n]{1,40})[\"']", raw):
            if re.fullmatch(r"\s*(?:\d{1,3}(?:[,.]\d{3})*(?:\.\d+)?\s?%|\d+(?:\.\d+)?\s?[xX]|\d+(?:\.\d+)?\s?[KMB]\+|\d{2,}\+|24/7)\s*", lit):
                unbacked.append(lit.strip())
    if unbacked:
        add("FAIL" if strict else "WARN", "G13", f"Numbers without evidence ({len(unbacked)})", ", ".join(sorted(set(unbacked))[:12]),
            "Every public number needs a register row: add data-ev=\"EV-###\" (meerana-evidence). Demo numbers must sit inside a visibly labelled data-illustrative frame. Otherwise state the capability without a number.")

    # G14 filler phrases
    low = visible_text.lower()
    fl = [w for w in FILLER if w in low]
    ai_count = len(re.findall(r"\bai[- ]powered\b", low))
    if fl or ai_count > 2:
        add("WARN", "G14", "Filler / hype language", ", ".join(fl[:8] + ([f"'AI-powered' ×{ai_count}"] if ai_count > 2 else [])),
            "Replace with workflow verbs and nouns: 'search footage by vest colour', 'approve, sign and seal', 'find the bottleneck' (meerana-narrative; modern-ai-company honest-language).")

    if is_html:
        # G15 headline length
        for e in page.elements:
            if e["tag"] in ("h1", "h2"):
                words = len([w for w in text_of(page, e["id"]).split() if re.search(r"[\w؀-ۿ]", w)])  # dashes/punctuation aren't words
                if words > 8:
                    add("WARN", "G15", f"{e['tag'].upper()} longer than 8 words ({words})", text_of(page, e["id"], 90),
                        "Cut to ≤ 8 words; move the rest into the lede (landing-page copy rules).")
        # G16 h1 count
        n_h1 = sum(1 for e in page.elements if e["tag"] == "h1")
        if n_h1 != 1:
            add("FAIL", "G16", f"{n_h1} <h1> elements", "", "Exactly one h1 per page; nav labels and section titles are not h1.")
        # G17 alt
        no_alt = [e for e in page.elements if e["tag"] == "img" and "alt" not in e["attrs"]]
        if no_alt:
            add("FAIL", "G17", f"Images without alt ({len(no_alt)})", no_alt[0]["attrs"].get("src", "")[:80],
                "Add meaningful alt (logos: organisation name) or alt=\"\" for decoration.")
        # G20 metadata
        desc = next((m.get("content", "") for m in page.metas if m.get("name") == "description"), None)
        if not page.title.strip():
            add("WARN", "G20", "Missing <title>", "", "Add a specific title: '<Page> | Meerana Technologies'.")
        if desc is None:
            add("WARN", "G20", "Missing meta description", "", "Add a 140–160 character description with the positioning line.")
        elif "create-react-app" in desc.lower():
            add("FAIL", "G20", "Default CRA meta description", desc, "Replace with the real description (Next.js Metadata API).")
        if not page.lang:
            add("WARN", "G20", "Missing <html lang>", "", "Set lang and dir on <html>.")
        # G22 hidden LCP
        for e in page.elements:
            if e["tag"] == "h1" and (re.search(r"\bopacity-0\b", e["attrs"].get("class", "")) or "opacity:0" in e["attrs"].get("style", "").replace(" ", "") or "data-reveal" in e["attrs"]):
                add("FAIL", "G22", "Hero H1 hidden at first paint", text_of(page, e["id"], 60),
                    "Keep the LCP text visible at first paint; never reveal it from opacity 0 or a mask (web-animations).")
        # G21 ISO badges
        iso = [e for e in page.elements if e["tag"] == "img" and re.search(r"iso", e["attrs"].get("src", "") + e["attrs"].get("alt", ""), re.I)
               and re.search(r"certif|27001|22301|9001", e["attrs"].get("src", "") + e["attrs"].get("alt", ""), re.I)]
        if iso:
            add("FAIL", "G21", "ISO badge image", iso[0]["attrs"].get("src", "")[:80],
                "Never use the ISO logo or ISO-style roundels. With a certificate in hand: 'certified to ISO/IEC 27001:2022' + the certification body's mark per its rules (DL-R03).")

    # G18 / G19 motion accessibility
    anim = bool(re.search(r"@keyframes|requestAnimationFrame|gsap\.|animation\s*:|transition\s*:|(?<![\w-])animate-[a-z]|(?<![\w-])transition(?:-all)?\b", raw))
    reduced = bool(re.search(r"prefers-reduced-motion|motion-reduce:|motion-safe:|useReducedMotion|reducedMotion=", raw))
    if anim and not reduced:
        add("FAIL", "G18", "Motion without reduced-motion handling", "",
            "Add @media (prefers-reduced-motion: reduce) and a JS branch that renders final states (web-animations).")
    loop = bool(re.search(r"animation-iteration-count\s*:\s*infinite|animation\s*:[^;]*\binfinite\b|animate-(?:pulse|spin|ping|bounce)|repeat\s*:\s*-1", raw)) or unconditional_raf_loop(raw)
    if loop and not re.search(r"data-motion-control|[Pp]ause", raw):
        add("WARN", "G19", "Continuous animation without a pause control", "",
            "Add a visible 'Pause motion' button (aria-pressed) for loops longer than 5 s (WCAG 2.2.2).")

    # G24 neon / off-brand colours
    if brand == "meerana" and NEON_HEX.search(raw):
        add("FAIL", "G24", "Off-brand neon/purple hex", ", ".join(sorted(set(NEON_HEX.findall(raw)))[:6]),
            "Brand blue is #0D3BFF, cyan #3FD0FF, navy #071B36 (meerana-brand). Use semantic tokens, never raw hex.")

    # Page-level waivers: <html> or <body> data-audit-ok="G09 …" with data-audit-reason="…" (e.g. an internal index
    # page that should not have a signature motion). A waived finding is reported as INFO with the reason, never
    # dropped; a waiver without a reason is itself a WARN.
    if is_html:
        roots = [e for e in page.elements if e["tag"] in ("html", "body")]
        waived = set(" ".join(e["attrs"].get("data-audit-ok", "") for e in roots).split())
        reason = " ".join(e["attrs"].get("data-audit-reason", "") for e in roots).strip()
        for f in findings:
            if f["check"] in waived and f["severity"] in ("FAIL", "WARN"):
                if reason:
                    f["severity"], f["title"] = "INFO", "Waived at page level: " + f["title"]
                    f["evidence"] = ("reason: " + reason + (" · " + f["evidence"] if f["evidence"] else ""))[:300]
        if waived and not reason:
            add("WARN", "G00", "Page-level waiver without a reason", " ".join(sorted(waived)),
                "Add data-audit-reason=\"…\" next to data-audit-ok on <html>/<body>, or remove the waiver.")

    order = {"FAIL": 0, "WARN": 1, "INFO": 2}
    findings.sort(key=lambda f: (order[f["severity"]], f["check"]))
    fails = sum(f["severity"] == "FAIL" for f in findings)
    warns = sum(f["severity"] == "WARN" for f in findings)
    return {"file": str(path), "score": max(0, 100 - 15 * fails - 5 * warns), "verdict": "PASS" if fails == 0 else "FAIL",
            "fails": fails, "warns": warns, "findings": findings}


def main(argv):
    for stream in (sys.stdout, sys.stderr):   # Windows consoles default to cp1252; reports contain → and ·
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    brand = None
    if "--brand" in argv:
        brand = argv[argv.index("--brand") + 1]
    strict = "--strict" in argv
    files = [Path(a) for a in argv if not a.startswith("--") and a != brand]
    results = [audit(f, brand, strict) for f in files]
    if "--json" in argv:
        print(json.dumps(results, indent=2, ensure_ascii=False))
    else:
        for r in results:
            print(f"\n## {r['file']}  →  {r['verdict']}  (score {r['score']}/100 · {r['fails']} FAIL · {r['warns']} WARN)\n")
            if not r["findings"]:
                print("No generic-template markers found. Run the manual checklist (references/checklist.md).")
            for f in r["findings"]:
                print(f"[{f['severity']}] {f['check']} {f['title']}")
                if f["evidence"]:
                    print(f"    evidence: {f['evidence']}")
                print(f"    fix:      {f['fix']}\n")
    return 1 if any(r["verdict"] == "FAIL" for r in results) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
