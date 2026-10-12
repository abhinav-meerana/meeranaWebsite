#!/usr/bin/env python3
"""motion_lint.py: static checks for motion anti-patterns (standard library only).

Usage
  python motion_lint.py path/to/file-or-dir [more paths] [--json]

Scans .css .scss .js .mjs .ts .tsx .jsx .html .htm files. Exits with code 1 when any FAIL is found.
Rules mirror .claude/skills/web-animations/SKILL.md. Heuristic by nature: review WARN/INFO by eye.
"""
import json
import re
import sys
from pathlib import Path

EXT = {".css", ".scss", ".js", ".mjs", ".ts", ".tsx", ".jsx", ".html", ".htm"}
ALLOWED_EASES = {"0.2,0,0,1", "0,0,0,1", "0.3,0,1,1"}
ALLOWED_DURS_MS = {0, 0.01, 160, 240, 420}

RULES = {
    "M01": ("FAIL", "Animating layout properties (width/height/top/left/margin/padding)", "Animate transform/opacity instead (translate, scale); use clip-path for reveals."),
    "M02": ("WARN", "transition: all", "List the exact properties (transform, opacity)."),
    "M03": ("FAIL", "Animating filter / backdrop-filter / box-shadow", "Remove; fade an overlay's opacity or use a pre-rendered state."),
    "M04": ("FAIL", "Global scroll-behavior: smooth alongside ScrollTrigger/Lenis", "Set html { scroll-behavior: auto }; let Lenis handle anchors (anchors: true)."),
    "M05": ("WARN", "Scroll/wheel/touch listener without { passive: true }", "Add { passive: true } or use IntersectionObserver / ScrollTrigger."),
    "M06": ("FAIL", "Deprecated or outdated API", "See web-animations references for the current API."),
    "M07": ("FAIL", "Animation present but no reduced-motion handling anywhere", "Add @media (prefers-reduced-motion) + JS matchMedia branch (gsap.matchMedia / MotionConfig reducedMotion='user')."),
    "M08": ("WARN", "Continuous loop without a visible pause control (WCAG 2.2.2)", "Add <button data-motion-control aria-pressed> that stops the loop; persist the choice."),
    "M09": ("WARN", "will-change on a broad selector", "Apply will-change only to the animating element during the active range."),
    "M10": ("FAIL", "More than one data-signature element (one signature motion per page)", "Keep one signature; demote others to quiet reveals or static."),
    "M11": ("FAIL", "ScrollTrigger used without gsap.registerPlugin", "gsap.registerPlugin(ScrollTrigger) (also prevents tree-shaking)."),
    "M12": ("WARN", "ReactLenis + gsap.ticker without autoRaf: false", "Pass options={{ autoRaf: false }} so only GSAP's ticker drives Lenis."),
    "M13": ("WARN", "Hero H1 hidden at load (opacity 0 / data-reveal)", "Keep the LCP text visible at first paint; animate transform only or nothing."),
    "M14": ("WARN", "Easing outside the token family", "Use --ease-standard / --ease-enter / --ease-exit."),
    "M15": ("INFO", "Duration outside the three tokens (160/240/420 ms)", "Use var(--dur-1|2|3)."),
}

LAYOUT_PROPS = r"(?<![\w-])(?:width|height|top|left|right|bottom|margin(?:-[a-z]+)?|padding(?:-[a-z]+)?)"  # not stroke-width etc.


def has_unconditional_raf_loop(text):
    """True when a function re-schedules itself with requestAnimationFrame without an `if` guard just before
    the call (a one-shot animation that stops after its duration is not a loop)."""
    for m in re.finditer(r"function\s+(\w+)\s*\([^)]*\)\s*\{", text):
        name, start = m.group(1), m.end()
        call = re.search(r"requestAnimationFrame\(\s*" + re.escape(name) + r"\s*\)", text[start:start + 4000])
        if call:
            before = text[start:start + call.start()][-160:]
            if not re.search(r"\bif\s*\(|\?\s*$|&&\s*$", before):
                return True
    return False


def scan_file(path, text, findings, agg):
    is_html = path.suffix in (".html", ".htm")
    lines = text.splitlines()

    def add(rule, lineno, snippet):
        sev, title, fix = RULES[rule]
        findings.append({"severity": sev, "rule": rule, "title": title, "file": str(path), "line": lineno,
                         "snippet": snippet.strip()[:140], "fix": fix})

    for i, line in enumerate(lines, 1):
        l = line.strip()
        if re.search(r"transition(?:-property)?\s*:[^;{}]*\b" + LAYOUT_PROPS + r"\b", l) and "transform" not in l.split(":")[0]:
            if not re.search(r"transition(?:-property)?\s*:\s*(?:opacity|transform)", l):
                add("M01", i, l)
        if re.search(r"gsap\.(?:to|from|fromTo)\([^)]*\b(?:width|height|top|left|marginTop|marginLeft)\s*:", l):
            add("M01", i, l)
        if re.search(r"transition(?:-property)?\s*:\s*all\b", l) or re.search(r"(?<![\w-])transition-all\b", l):
            add("M02", i, l)
        # Tailwind utility classes
        for m in re.finditer(r"(?<![\w-])duration-(\d+)\b", l):
            if int(m.group(1)) not in ALLOWED_DURS_MS:
                add("M15", i, l)
                break
        if re.search(r"transition(?:-property)?\s*:[^;{}]*\b(?:backdrop-filter|filter|box-shadow)\b", l) or \
           re.search(r"gsap\.(?:to|from|fromTo)\([^)]*\b(?:filter|boxShadow|backdropFilter)\s*:", l):
            add("M03", i, l)
        if re.search(r"scroll-behavior\s*:\s*smooth", l):
            agg["smooth_lines"].append((path, i, l))
        if re.search(r"addEventListener\(\s*['\"](?:scroll|wheel|touchmove|touchstart)['\"]", l) and "passive" not in l:
            add("M05", i, l)
        for pat, label in [(r"\bstaggerChildren\b", "staggerChildren (Motion: use delayChildren: stagger())"),
                           (r"\bstaggerDirection\b", "staggerDirection (Motion)"),
                           (r"from\s+['\"]framer-motion['\"]", "framer-motion import (use motion/react)"),
                           (r"@studio-freight/(?:react-)?lenis", "@studio-freight/lenis (use lenis)"),
                           (r"gsap-trial", "gsap-trial (all plugins are in gsap since 3.13)"),
                           (r"\bsmoothTouch\b", "smoothTouch (Lenis: syncTouch)"),
                           (r"<Image\b[^>]*\bpriority\b", "next/image priority (Next 16: preload / fetchPriority)")]:
            if re.search(pat, l):
                add("M06", i, f"{label}: {l}")
        if re.search(r"(?:^|[\s,{])(?:\*|html|body|section|main|div)\s*\{[^}]*will-change", l):
            add("M09", i, l)
        if is_html and re.search(r"<h1\b[^>]*(?:class=\"[^\"]*\bopacity-0\b|style=\"[^\"]*opacity\s*:\s*0|data-reveal)", l):
            add("M13", i, l)
        for m in re.finditer(r"cubic-bezier\(\s*([^)]+)\)", l):
            vals = ",".join(str(float(v)).rstrip("0").rstrip(".") if v.strip() not in ("0",) else "0" for v in m.group(1).split(","))
            norm = ",".join(("0" if float(v) == 0 else ("%g" % float(v))) for v in m.group(1).split(","))
            if norm not in ALLOWED_EASES:
                add("M14", i, l)
        if re.search(r"(?:transition|animation)(?:-duration)?\s*:", l) and "var(--dur" not in l:
            for m in re.finditer(r"(?<![\w.-])(\d*\.?\d+)(ms|s)\b", l):
                v = float(m.group(1)) * (1000 if m.group(2) == "s" else 1)
                if round(v, 2) not in ALLOWED_DURS_MS:
                    add("M15", i, l)
                    break

    tw_loop = re.search(r"(?<![\w-])animate-(?:pulse|spin|ping|bounce)\b", text)
    if tw_loop:
        agg["loop_where"].append(str(path))
    agg["anim"] |= bool(re.search(r"@keyframes|gsap\.(?:to|from|fromTo|timeline|set)\(|requestAnimationFrame\(|whileInView|\banimate\(|\btransition\s*:|(?<![\w-])transition(?:-all|-opacity|-transform|-colors)?\b(?![\w-]*\s*:)|(?<![\w-])animate-[a-z]", text))
    agg["reduced"] |= bool(re.search(r"prefers-reduced-motion|reducedMotion\s*=|useReducedMotion|respectReducedMotion|data-motion=\"reduce\"|(?<![\w-])motion-(?:reduce|safe):", text))
    agg["loop"] |= bool(re.search(r"animation-iteration-count\s*:\s*infinite|animation\s*:[^;]*\binfinite\b|repeat\s*:\s*-1", text)) or \
        has_unconditional_raf_loop(text) or bool(tw_loop)
    agg["control"] |= bool(re.search(r"data-motion-control|aria-label=\"[^\"]*[Pp]ause|>\s*Pause", text))
    # count the attribute on elements only (a JS selector such as '[data-signature]' is not a second signature)
    agg["signatures"] += len(re.findall(r"<[a-zA-Z][^<>]*\sdata-signature(?:[\s=>/])", text)) if is_html else 0
    # code usage only (comments that merely mention a library must not count)
    agg["st"] |= bool(re.search(r"ScrollTrigger\.(?:create|batch|refresh|update|getAll)|scrollTrigger\s*:|from\s+['\"]gsap/ScrollTrigger['\"]|gsap/ScrollTrigger", text))
    agg["register"] |= "registerPlugin(" in text
    agg["lenis"] |= bool(re.search(r"new\s+Lenis\s*\(|ReactLenis|from\s+['\"]lenis(?:/react)?['\"]|lenis(?:\.min)?\.js", text))
    agg["reactlenis"] |= "ReactLenis" in text
    agg["ticker"] |= "gsap.ticker.add" in text
    agg["autoraf_false"] |= bool(re.search(r"autoRaf\s*:\s*false", text))


def main(argv):
    for stream in (sys.stdout, sys.stderr):   # Windows consoles default to cp1252; reports contain → and ·
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    as_json = "--json" in argv
    paths = [Path(a) for a in argv if not a.startswith("--")]
    if not paths:
        print(__doc__)
        return 2
    files = []
    for p in paths:
        if p.is_dir():
            files += [f for f in p.rglob("*") if f.suffix in EXT and "node_modules" not in f.parts]
        elif p.suffix in EXT:
            files.append(p)
    findings = []
    agg = dict(anim=False, reduced=False, loop=False, control=False, signatures=0, st=False, register=False,
               lenis=False, reactlenis=False, ticker=False, autoraf_false=False, smooth_lines=[], loop_where=[])
    for f in files:
        try:
            scan_file(f, f.read_text(encoding="utf-8", errors="replace"), findings, agg)
        except OSError as e:
            print(f"skip {f}: {e}", file=sys.stderr)

    def add(rule, where="(project)", snippet=""):
        sev, title, fix = RULES[rule]
        findings.append({"severity": sev, "rule": rule, "title": title, "file": where, "line": 0, "snippet": snippet, "fix": fix})

    for (p, i, l) in agg["smooth_lines"]:
        sev = "FAIL" if (agg["st"] or agg["lenis"]) else "WARN"
        findings.append({"severity": sev, "rule": "M04", "title": RULES["M04"][1], "file": str(p), "line": i, "snippet": l, "fix": RULES["M04"][2]})
    if agg["anim"] and not agg["reduced"]:
        add("M07")
    if agg["loop"] and not agg["control"]:
        add("M08", snippet=("infinite Tailwind animate-* in: " + ", ".join(agg["loop_where"][:4])) if agg["loop_where"] else "")
    if agg["signatures"] > 1:
        add("M10", snippet=f"{agg['signatures']} data-signature attributes")
    if agg["st"] and not agg["register"]:
        add("M11")
    if agg["reactlenis"] and agg["ticker"] and not agg["autoraf_false"]:
        add("M12")

    order = {"FAIL": 0, "WARN": 1, "INFO": 2}
    findings.sort(key=lambda x: (order[x["severity"]], x["rule"], x["file"], x["line"]))
    fails = sum(1 for f in findings if f["severity"] == "FAIL")
    if as_json:
        print(json.dumps({"files": len(files), "fails": fails, "findings": findings}, indent=2))
    else:
        print(f"motion_lint: {len(files)} files, {len(findings)} findings ({fails} FAIL)\n")
        for f in findings:
            loc = f"{f['file']}:{f['line']}" if f["line"] else f["file"]
            print(f"[{f['severity']}] {f['rule']} {f['title']}\n    at  {loc}\n    {f['snippet']}\n    fix {f['fix']}\n")
        if not findings:
            print("No motion anti-patterns found.")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
