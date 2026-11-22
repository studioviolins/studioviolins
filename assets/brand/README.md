# SV monogram

Studio Violins' favicon and app icon: an interlocking serif **S** and **V** in warm ivory (`#f3ecdd`) on deep green
(`#102922`), drawn on a 64-unit grid. The S passes over the V's left arm low down; the V passes over the S near the
top. Ground-coloured gaps between them are SVG masks, so each file is a single self-contained vector.

The website's wordmark is unchanged; this mark is for icons only.

| File | Use | Where it ships |
| --- | --- | --- |
| `sv-monogram.svg` | Master: rounded tile, scale 1.08 | `public/icons/icon-192.png`, `icon-512.png` (manifest, purpose "any") |
| `sv-monogram-small.svg` | Small-size cut: slightly heavier strokes, wider gaps, scale 1.12, for 16–48 px | `app/icon.svg`; `app/favicon.ico` (16, 32, 48) |
| `sv-monogram-square.svg` | Square tile, scale 1.0 (iOS rounds the corners itself) | `app/apple-icon.png` (180) |
| `sv-monogram-maskable.svg` | Square tile, scale 0.8, inside the maskable safe zone | `public/icons/icon-maskable-512.png` |

`app/manifest.ts` lists the manifest icons. Next.js adds the `icon`, `apple-touch-icon` and `manifest` links from the
files in `app/` itself, so nothing is set by hand in `app/layout.tsx`.

## Regenerating

`sv-monogram.py` writes each SVG from a JSON of settings; these reproduce the files above exactly:

```bash
B='"v_dx": -1.8, "s_dx": 0.5, "cross_y": 24, "barb": 0, "lserif": 0.5'
python3 sv-monogram.py "{$B, \"k\": 1.08}" sv-monogram.svg
python3 sv-monogram.py "{$B, \"k\": 1.12, \"boost\": 0.7, \"v_thin\": 4.3, \"v_thick\": 8.0, \"gap\": 1.5}" sv-monogram-small.svg
python3 sv-monogram.py "{$B, \"k\": 1.0, \"square\": true}" sv-monogram-square.svg
python3 sv-monogram.py "{$B, \"k\": 0.8, \"square\": true}" sv-monogram-maskable.svg
```

`render.sh file.svg size out.png` renders an SVG at an exact pixel size with headless Chrome (macOS path). The ICO is
three PNG entries (16, 32, 48) rendered from `sv-monogram-small.svg` and packed with a standard ICONDIR header.
