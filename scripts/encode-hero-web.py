"""Web encode of the 60 fps hero loop (1548×1440, made in OpenArt from the 688×640
cropped loop that build-hero-video.py's crop and loop points produce).

Colour grade only — the same grade as build-hero-video.py — with no denoise and
no sharpening, so the footage's detail is passed through untouched.

Usage: python3 scripts/encode-hero-web.py SRC OUT_DIR
"""

import subprocess
import sys

SRC, OUT = sys.argv[1], sys.argv[2]

GRADE = ",".join([
    "curves=master='0/0 0.12/0.105 0.5/0.5 0.7/0.685 0.85/0.785 1/0.86'",
    "colorbalance=rs=-0.03:gs=0.015:bs=0.0:rm=0.02:gm=0.0:bm=-0.02:bh=-0.03",
    "huesaturation=saturation=-0.4:colors=m+b:strength=2",
    "colorchannelmixer=rr=0.927:rg=0.092:rb=0.023:gr=0.042:gg=0.962:gb=0.020:br=0.033:bg=0.064:bb=0.896",
    "eq=saturation=0.97:contrast=1.04",
])

subprocess.run([
    "ffmpeg", "-v", "error", "-y", "-i", SRC, "-an",
    "-vf", f"{GRADE},format=yuv420p",
    "-c:v", "libx264", "-profile:v", "high", "-level", "5.0", "-pix_fmt", "yuv420p",
    "-crf", "23", "-preset", "veryslow", "-tune", "film",
    "-g", "120", "-movflags", "+faststart",
    f"{OUT}/nick-hero.mp4",
], check=True)
# Poster = first frame, so there's no jump when playback starts.
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/nick-hero.mp4", "-frames:v", "1", "-q:v", "3", f"{OUT}/nick-hero-poster.jpg"], check=True)
print("done")
