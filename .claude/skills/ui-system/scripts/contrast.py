#!/usr/bin/env python3
"""WCAG 2.x contrast checker for the Meerana / YISBIR token set. Standard library only.

Usage
  python contrast.py "#FFFFFF" "#071B36"            # one pair, any hex values
  python contrast.py --gate                         # check every pair in contrast-pairs.json
  python contrast.py --gate --markdown              # same, printed as a Markdown table

The gate resolves token names (e.g. "--navy-300") from references/tokens.css and exits
with code 1 when any pair is below its required minimum. Run it whenever tokens change.

Thresholds (WCAG 2.2): 4.5:1 normal text; 3:1 large text (>= 24px, or >= 18.66px bold)
and non-text UI boundaries / meaningful graphics (SC 1.4.11). Ratios are not rounded
before comparison (4.499 fails 4.5).
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOKENS = HERE.parent / "references" / "tokens.css"
PAIRS = HERE.parent / "references" / "contrast-pairs.json"


def hex_to_rgb(value):
    value = value.strip().lstrip("#")
    if len(value) == 3:
        value = "".join(c * 2 for c in value)
    if not re.fullmatch(r"[0-9a-fA-F]{6}", value):
        raise ValueError(f"not a 6-digit hex colour: {value!r}")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def luminance(rgb):
    def channel(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (channel(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg):
    hi, lo = sorted((luminance(hex_to_rgb(fg)), luminance(hex_to_rgb(bg))), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def load_tokens(path=TOKENS):
    """First declaration wins: primitives and derived values are declared once in :root."""
    tokens = {}
    for name, val in re.findall(r"(--[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{3,6})\b", path.read_text(encoding="utf-8")):
        tokens.setdefault(name, val.upper())
    return tokens


def resolve(ref, tokens):
    if ref.startswith("#"):
        return ref.upper()
    if ref in tokens:
        return tokens[ref]
    raise KeyError(f"token {ref} not found in {TOKENS.name}")


def verdict(r):
    if r >= 7:
        return "AAA"
    if r >= 4.5:
        return "AA"
    if r >= 3:
        return "AA-large / UI"
    return "FAIL"


def gate(markdown=False):
    tokens = load_tokens()
    pairs = json.loads(PAIRS.read_text(encoding="utf-8"))["pairs"]
    failures = 0
    if markdown:
        print("| Context | Use | Foreground | Background | Ratio | Required | Result |")
        print("|---|---|---|---|---|---|---|")
    for p in pairs:
        fg, bg = resolve(p["fg"], tokens), resolve(p["bg"], tokens)
        r = ratio(fg, bg)
        need = float(p.get("min", 4.5))
        ok = r >= need
        failures += 0 if ok else 1
        status = "pass" if ok else "**FAIL**"
        if markdown:
            print(f"| {p['context']} | {p['use']} | `{p['fg']}` {fg} | `{p['bg']}` {bg} | {r:.2f} | {need} | {status} |")
        else:
            print(f"{'PASS' if ok else 'FAIL'}  {r:6.2f} (min {need})  {p['context']:<16} {p['use']}  [{p['fg']} on {p['bg']}]")
    print(f"\n{len(pairs)} pairs checked, {failures} failing.")
    return 1 if failures else 0


def main(argv):
    for stream in (sys.stdout, sys.stderr):   # Windows consoles default to cp1252; reports contain → and ·
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    if argv[0] == "--gate":
        return gate(markdown="--markdown" in argv)
    if len(argv) >= 2:
        r = ratio(argv[0], argv[1])
        print(f"{argv[0]} on {argv[1]}: {r:.2f}:1  {verdict(r)}")
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
