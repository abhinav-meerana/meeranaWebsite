"""WCAG 2.x contrast matrix for Meerana brand + product tokens.

Usage:
    python contrast_check.py              # print key pairs with pass/fail
    python contrast_check.py --all        # every fg/bg combination inside each palette group
    python contrast_check.py "#0D3BFF" "#071B36"   # ad-hoc pair

Thresholds: AA normal text 4.5, AA large text (>=24px or >=18.66px bold) 3.0,
non-text UI components / meaningful graphics 3.0, AAA normal 7.0.
"""
import itertools
import sys

TOKENS = {
    "meerana": {
        "blue": "#0D3BFF", "navy": "#071B36", "cyan": "#3FD0FF",
        "neutral": "#EDEDED", "white": "#FFFFFF",
    },
    "wasel": {"brown": "#6B3E26", "sand": "#D9C1A3", "copper": "#C58A52", "ivory": "#F7F4EF"},
    "mandoobee": {"royal": "#0D3D91", "azure": "#047AFF", "slate": "#6C819A", "mist": "#F0F4F9"},
    "tasree3": {"ink": "#001731", "sky": "#009BFD", "orange": "#FD5D01", "white": "#FFFFFF"},
    "yisbir": {"blue": "#0045F8", "aqua": "#43DAFE", "abyss": "#00132D", "white": "#FFFFFF"},
}

KEY_PAIRS = [
    ("meerana.blue", "meerana.white"), ("meerana.blue", "meerana.neutral"),
    ("meerana.navy", "meerana.white"), ("meerana.navy", "meerana.neutral"),
    ("meerana.cyan", "meerana.navy"), ("meerana.white", "meerana.navy"),
    ("meerana.blue", "meerana.navy"), ("meerana.white", "meerana.blue"),
    ("meerana.cyan", "meerana.white"), ("meerana.navy", "meerana.cyan"),
    ("wasel.brown", "wasel.ivory"), ("wasel.sand", "wasel.brown"),
    ("wasel.copper", "wasel.brown"), ("wasel.copper", "wasel.ivory"), ("wasel.ivory", "wasel.brown"),
    ("mandoobee.royal", "mandoobee.mist"), ("mandoobee.azure", "mandoobee.mist"),
    ("mandoobee.slate", "mandoobee.mist"), ("meerana.white", "mandoobee.royal"),
    ("tasree3.orange", "tasree3.ink"), ("tasree3.orange", "tasree3.white"),
    ("tasree3.sky", "tasree3.ink"), ("tasree3.ink", "tasree3.white"), ("tasree3.white", "tasree3.orange"),
    ("yisbir.aqua", "yisbir.abyss"), ("yisbir.blue", "yisbir.white"),
    ("yisbir.white", "yisbir.blue"), ("yisbir.blue", "yisbir.abyss"),
]


def _lin(c: float) -> float:
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def ratio(fg: str, bg: str) -> float:
    a, b = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (a + 0.05) / (b + 0.05)


def verdict(r: float) -> str:
    if r >= 7:
        return "AAA text"
    if r >= 4.5:
        return "AA text"
    if r >= 3:
        return "large text / UI only"
    return "FAIL (decorative only)"


def resolve(name: str) -> str:
    if name.startswith("#"):
        return name
    group, key = name.split(".")
    return TOKENS[group][key]


def main(argv):
    if len(argv) == 3 and argv[1].startswith("#"):
        r = ratio(argv[1], argv[2])
        print(f"{argv[1]} on {argv[2]}: {r:.2f}:1  {verdict(r)}")
        return
    pairs = KEY_PAIRS
    if "--all" in argv:
        pairs = []
        for group, vals in TOKENS.items():
            for fg, bg in itertools.permutations(vals, 2):
                pairs.append((f"{group}.{fg}", f"{group}.{bg}"))
    for fg, bg in pairs:
        r = ratio(resolve(fg), resolve(bg))
        print(f"{fg:<18} on {bg:<18} {r:5.2f}:1  {verdict(r)}")


if __name__ == "__main__":
    main(sys.argv)
