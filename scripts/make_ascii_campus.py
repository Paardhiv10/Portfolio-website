"""
Convert the campus amphitheatre render into an ASCII character grid.

Two inputs, deliberately:

  * college1.png is the original 1920x1080 render and carries the detail that
    makes the piece readable — the concentric rings of the decking, the
    balustrades, the arcade under the balcony. Working from the 666px
    background-removed preview instead throws all of that away before the
    ramp ever sees it, and the result is a grey blob with a dark rim.
  * amphitheatre-cutout.png is that same frame after background removal. Only
    its alpha is used, upscaled, as the silhouette. Keying the silhouette off
    luminance instead would punch holes through the structure's own black
    roofs, which sit at the same value as the backdrop.

Output: src/content/ascii-campus.json
"""

import json
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).parent.parent
SRC = ROOT / "assets" / "source" / "college1.png"
MASK_SRC = ROOT / "assets" / "source" / "amphitheatre-cutout.png"
OUT = ROOT / "src" / "content" / "ascii-campus.json"

# dark -> light. Same ramp family as the hero portrait so the two pieces share
# a visual language; ten well-separated steps beat a long gradient ramp, whose
# middle entries differ by too little ink to tell apart at this size.
RAMP = " .:-=+*#%@"

# Legibility here is set by how many pixels each glyph gets on screen, not by
# how many cells the grid has: past a point, more columns just shrinks the type
# until the whole thing greys out. At 140 columns in a ~650px slot each glyph
# advances ~9 device pixels on a retina display, which is the size at which
# these shapes actually resolve.
COLS = 140
# Glyph width/height as rendered: JetBrains Mono advances 0.6em and the
# component sets leading-[0.85]. The tight leading is deliberate — it buys
# vertical sampling resolution for free, and the ramp has no descenders to clip.
CELL_ASPECT = 0.73
MASK_THRESHOLD = 128
# Sharpen at the scale of the decking rings (~15px apart in the source) so they
# survive the downsample. A small radius sharpens grain the ramp can't show
# anyway and leaves the rings exactly as smeared as before.
UNSHARP = (12, 220, 2)  # radius, percent, threshold
# The white point sits at the 80th percentile, not the 98th: the lit decking is
# brighter than most of the subject, and letting it clip to blank paper is what
# makes the rings read as drawn lines instead of dissolving into a grey field.
BLACK_POINT, WHITE_POINT = 0.05, 0.80
GAMMA = 1.0


def main() -> None:
    detail = Image.open(SRC).convert("L")
    mask = Image.open(MASK_SRC).convert("RGBA").split()[3]

    # the cutout is the same frame at lower resolution, so its alpha upscales
    # onto the original 1:1
    mask = mask.resize(detail.size, Image.Resampling.LANCZOS)

    bbox = mask.getbbox()
    assert bbox, "fully transparent mask?"
    detail = detail.crop(bbox)
    mask = mask.crop(bbox)

    detail = detail.filter(ImageFilter.UnsharpMask(*UNSHARP))

    w, h = detail.size
    rows = round(COLS * (h / w) * CELL_ASPECT)

    gray_small = detail.resize((COLS, rows), Image.Resampling.BOX)
    mask_small = mask.resize((COLS, rows), Image.Resampling.BOX)
    gray_px = gray_small.load()
    mask_px = mask_small.load()

    # Stretch the subject's own range across the ramp. The render is lit
    # theatrically and its luminance sits in a narrow band; mapping raw values
    # leaves almost everything on two or three characters.
    subject = [
        gray_px[x, y]
        for y in range(rows)
        for x in range(COLS)
        if mask_px[x, y] >= MASK_THRESHOLD
    ]
    subject.sort()
    lo = subject[int(len(subject) * BLACK_POINT)]
    hi = subject[int(len(subject) * WHITE_POINT)]
    span = max(1, hi - lo)

    lines: list[str] = []
    for y in range(rows):
        row: list[str] = []
        for x in range(COLS):
            if mask_px[x, y] < MASK_THRESHOLD:
                row.append(" ")
                continue
            norm = min(1.0, max(0.0, (gray_px[x, y] - lo) / span))
            # invert: dark pixel -> dense char (higher ramp index)
            idx = int(((1 - norm) ** GAMMA) * (len(RAMP) - 1) + 0.5)
            row.append(RAMP[max(0, min(len(RAMP) - 1, idx))])
        lines.append("".join(row).rstrip() or " ")

    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"cols": COLS, "rows": len(lines), "lines": lines}, indent=0)
    )
    print(f"wrote {OUT} — {COLS}x{len(lines)}")


if __name__ == "__main__":
    main()
