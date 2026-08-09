"""
Convert the background-removed portrait into an ASCII character grid.
Output: src/content/ascii-portrait.json — a plain data asset imported at build time.
Density (dark->light) maps to character density, not to a flattened image,
so it stays crisp text in the browser and can be recolored/animated in CSS.
"""

import json
from pathlib import Path

from PIL import Image

SRC = Path(__file__).parent.parent / "assets" / "source" / "portrait-cutout.png"
OUT = Path(__file__).parent.parent / "src" / "content" / "ascii-portrait.json"

# dark -> light. Fewer, well-chosen ramp steps read better at small sizes
# than a long gradient ramp.
RAMP = " .:-=+*#%@"

COLS = 100
CELL_ASPECT = 0.55  # glyph width/height for a typical monospace font
ALPHA_THRESHOLD = 24  # below this alpha, treat the cell as background (space)


def bounding_box(img: Image.Image) -> tuple[int, int, int, int]:
    alpha = img.split()[3]
    bbox = alpha.getbbox()
    assert bbox, "fully transparent image?"
    left, top, right, bottom = bbox
    # small breathing room around the subject
    pad_x = int((right - left) * 0.04)
    pad_y_top = int((bottom - top) * 0.03)
    pad_y_bottom = int((bottom - top) * 0.01)
    return (
        max(0, left - pad_x),
        max(0, top - pad_y_top),
        min(img.width, right + pad_x),
        min(img.height, bottom + pad_y_bottom),
    )


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    img = img.crop(bounding_box(img))

    w, h = img.size
    rows = round(COLS * (h / w) * CELL_ASPECT)

    gray = img.convert("L").resize((COLS, rows), Image.Resampling.BOX)
    alpha = img.split()[3].resize((COLS, rows), Image.Resampling.BOX)

    gray_px = gray.load()
    alpha_px = alpha.load()

    lines: list[str] = []
    for y in range(rows):
        row_chars = []
        for x in range(COLS):
            a = alpha_px[x, y]
            if a < ALPHA_THRESHOLD:
                row_chars.append(" ")
                continue
            lum = gray_px[x, y]  # 0 dark .. 255 light
            # invert: dark pixel -> dense char (higher ramp index)
            idx = int((255 - lum) / 256 * len(RAMP))
            idx = max(0, min(len(RAMP) - 1, idx))
            row_chars.append(RAMP[idx])
        lines.append("".join(row_chars).rstrip() or " ")

    # trim fully-blank rows from top/bottom
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"cols": COLS, "rows": len(lines), "lines": lines}, indent=0)
    )
    print(f"wrote {OUT} — {COLS}x{len(lines)}")

    # quick terminal preview
    for line in lines:
        print(line)


if __name__ == "__main__":
    main()
