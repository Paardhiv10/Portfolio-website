"""
Render an ASCII JSON asset to a PNG at the size it will actually occupy on
the page, so tone/resolution choices can be judged the way a visitor sees
them rather than as a wall of terminal text.

Usage: python scripts/preview_ascii.py [json_path] [css_px_width]
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent.parent
FONT = "/System/Library/Fonts/Menlo.ttc"  # stand-in for JetBrains Mono
SCALE = 2  # retina, so glyph detail is visible at these tiny sizes
ADVANCE = 0.6  # monospace advance as a fraction of em
LINE_HEIGHT = float(sys.argv[3]) if len(sys.argv) > 3 else 0.85
INK = (22, 48, 155)
PAPER = (240, 232, 221)


def main() -> None:
    src = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "src/content/ascii-campus.json")
    css_width = float(sys.argv[2]) if len(sys.argv) > 2 else 544.0

    data = json.loads(src.read_text())
    lines = data["lines"]
    cols = data["cols"]

    # the component sizes the font so `cols` glyphs exactly span the column
    font_px = css_width / (cols * ADVANCE) * SCALE
    font = ImageFont.truetype(FONT, font_px)
    cell_w = font_px * ADVANCE
    cell_h = font_px * LINE_HEIGHT

    img = Image.new("RGB", (round(css_width * SCALE), round(cell_h * len(lines))), PAPER)
    draw = ImageDraw.Draw(img)
    for y, line in enumerate(lines):
        for x, ch in enumerate(line):
            if ch != " ":
                draw.text((x * cell_w, y * cell_h), ch, font=font, fill=INK)

    out = ROOT / "scripts" / f"preview-{src.stem}.png"
    img.save(out)
    print(f"{out} — {img.size[0]}x{img.size[1]}, font {font_px:.2f}px @{SCALE}x")


if __name__ == "__main__":
    main()
