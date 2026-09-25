"""Builds the favicon set from the design's mark PNGs, following the brand system:
aspect ratio preserved (never stretched), centred on a cream tile with 22% corner radius,
single-tone coral mark at 16-48px (the two-tone split disappears at that size).
Run: python scripts/make-icons.py"""
from PIL import Image, ImageDraw
import os
D = os.path.join(os.path.dirname(__file__), '..')
CREAM = (250, 238, 218, 255)

def tile(size, mark_file, radius=True, pad=0.16):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    bg = Image.new('RGBA', (size, size), CREAM)
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=round(size * 0.22) if radius else 0, fill=255)
    img.paste(bg, (0, 0), mask)
    mark = Image.open(os.path.join(D, 'Website Design', 'assets', mark_file)).convert('RGBA')
    box = size * (1 - 2 * pad)
    scale = min(box / mark.width, box / mark.height)
    mw, mh = round(mark.width * scale), round(mark.height * scale)
    mark = mark.resize((mw, mh), Image.LANCZOS)
    img.alpha_composite(mark, ((size - mw) // 2, (size - mh) // 2))
    return img

app = os.path.join(D, 'src', 'app')
os.path.exists(os.path.join(app, 'favicon.ico')) and os.remove(os.path.join(app, 'favicon.ico'))
tile(512, 'mark-twotone.png').save(os.path.join(app, 'icon.png'))
tile(180, 'mark-twotone.png', radius=False, pad=0.14).save(os.path.join(app, 'apple-icon.png'))
small = [tile(s, 'mark-orange.png', pad=0.12) for s in (48, 32, 16)]
small[0].save(os.path.join(app, 'favicon.ico'), sizes=[(48, 48), (32, 32), (16, 16)], append_images=small[1:])
print('icons written')
