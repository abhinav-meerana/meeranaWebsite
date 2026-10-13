#!/usr/bin/env python3
"""
Package the project as meerana-website-redesign.zip.

The file list is git's own view of the working tree:
    git ls-files --cached --others --exclude-standard
so everything .gitignore excludes stays out — node_modules/, .next/, out/,
.env*, build caches, held media, review screenshots, zip archives — and
.git/ itself is never listed. Files staged for deletion are not listed.

    python scripts/package-zip.py [output.zip]

Then it re-opens the archive, tests every member's CRC, and checks that the
files a build needs are present.
"""
import pathlib
import subprocess
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "meerana-website-redesign.zip"
TOP = "meerana-website-redesign"

REQUIRED = [
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "README.md",
    "app/layout.tsx",
    "app/page.tsx",
    "app/tokens.css",
    "app/cinematic.css",
    "app/background.css",
    "app/nav.css",
    "app/home.css",
    "components/story/CinematicStory.tsx",
    "components/story/poses.ts",
    "components/background/MeeranaInteractiveBackground.tsx",
    "components/nav/SiteNav.tsx",
    "components/reactbits/ColorBends.tsx",
    "components/reactbits/DotField.tsx",
    "components/reactbits/PillNav.tsx",
    "components/reactbits/OptionWheel.tsx",
    "components/reactbits/LICENSE.md",
    "components/home/Sections.tsx",
    "content/story.ts",
    "content/navigation.ts",
    "content/dashboards.ts",
    "content/demo-data.ts",
    "components/dashboards/DashboardFrame.tsx",
    "app/dashboards.css",
    "public/brand/wasel-logo-white.png",
    "lib/pointer.ts",
    "public/media/v3/card-aibox-agent-matrix.webp",
    "scripts/verify-redesign.mjs",
    "scripts/serve-out.mjs",
    "docs/REDESIGN-PLAN-2026-10-12.md",
]
FORBIDDEN_PARTS = {"node_modules", ".next", "out", ".git"}
FORBIDDEN_NAMES = {".env", ".env.local"}


def files():
    raw = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=ROOT, check=True, capture_output=True,
    ).stdout.decode("utf8")
    for rel in sorted(filter(None, raw.split("\0"))):
        path = ROOT / rel
        if path.is_file() and path.resolve() != OUT.resolve():
            yield rel, path


def main():
    listed = list(files())
    bad = [r for r, _ in listed if FORBIDDEN_PARTS & set(pathlib.PurePosixPath(r).parts) or pathlib.PurePosixPath(r).name in FORBIDDEN_NAMES or r.endswith(".zip")]
    if bad:
        sys.exit(f"refusing to package: {bad[:5]}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for rel, path in listed:
            z.write(path, f"{TOP}/{rel}")
    with zipfile.ZipFile(OUT) as z:
        broken = z.testzip()
        names = {n[len(TOP) + 1:] for n in z.namelist()}
    missing = [r for r in REQUIRED if r not in names]
    size = OUT.stat().st_size
    print(f"wrote {OUT} — {len(names)} files, {size / 1e6:.2f} MB")
    print(f"CRC test: {'ok' if broken is None else 'FAILED at ' + broken}")
    print(f"required files: {'all present' if not missing else 'MISSING ' + ', '.join(missing)}")
    sys.exit(0 if broken is None and not missing and size > 0 else 1)


if __name__ == "__main__":
    main()
