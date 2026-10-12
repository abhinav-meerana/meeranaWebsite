# Process the generated background plates into web-ready assets.
#
# Steps:
#   1. Swap Tasree3/Nazo: the orange plate belongs to Tasree3 (its brand accent
#      is #FD5D01); Nazo has no defined accent, so it takes the neutral navy
#      architectural corridor. This corrects a mapping error made when the
#      plates were first generated.
#   2. Resize to 1920w and 1280w, convert to WebP.
#   3. Bake a mild navy multiply so each plate is dark enough for white type at
#      AA contrast before any CSS scrim is applied. The CSS scrim then only has
#      to handle legibility, not rescue contrast from scratch.
#
# Usage: python scripts/process-bg.py

from PIL import Image, ImageEnhance
import os

# Raw plates live outside public/ so they are never deployed: they are the
# source for re-processing, not site assets. Moved here after generation because
# 2.6 MB of unreferenced JPEGs have no business shipping.
SRC = "media-src/bg"
OUT = "public/media/bg"
WIDTHS = [1920, 1280]

# product -> raw file stem
MAPPING = {
    "tasree3": "raw-nazo",      # orange flowing process -> Tasree3 (#FD5D01)
    "nazo": "raw-tasree3",      # neutral architectural corridor -> Nazo
    "mandoobee": "raw-mandoobee",
    "yisbir": "raw-yisbir",
    "wasel": "raw-wasel",
    "aibox": "raw-aibox",
    "hero": "raw-hero",
}

# Brand navy the plates are multiplied toward.
NAVY = (7, 27, 54)
MULTIPLY_STRENGTH = 0.30


def tint_navy(im):
    """Multiply toward brand navy while preserving luminance relationships."""
    navy = Image.new("RGB", im.size, NAVY)
    return Image.blend(im, Image.blend(im, navy, 0.55), MULTIPLY_STRENGTH)


def main():
    os.makedirs(OUT, exist_ok=True)
    for product, stem in MAPPING.items():
        src = os.path.join(SRC, stem + ".jpg")
        if not os.path.exists(src):
            print("%-12s SKIP (no %s)" % (product, src))
            continue

        im = Image.open(src).convert("RGB")
        im = tint_navy(im)
        # Slightly deepen contrast so the plates read cinematic, not washed out.
        im = ImageEnhance.Contrast(im).enhance(1.06)

        for w in WIDTHS:
            h = round(im.height * (w / float(im.width)))
            resized = im.resize((w, h), Image.LANCZOS)
            out = os.path.join(OUT, "%s-%d.webp" % (product, w))
            resized.save(out, "WEBP", quality=78, method=6)
            print(
                "%-12s %5dx%-5d -> %-24s %7.1f KB"
                % (product, w, h, os.path.basename(out), os.path.getsize(out) / 1024.0)
            )


if __name__ == "__main__":
    main()
