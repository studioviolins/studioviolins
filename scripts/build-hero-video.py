"""Build the Studio Violins hero loop from the concert recording.

Conventional processing only (ffmpeg): crop, light denoise, restrained
sharpening, grade. Nothing generative, no frame synthesis, no restoration.

Usage: python3 build_hero.py SRC OUT_DIR [--preview]
"""

import subprocess
import sys

SRC, OUT = sys.argv[1], sys.argv[2]
PREVIEW = "--preview" in sys.argv

FPS = 30
DECODE_FROM = 9.0  # seconds into the source file; frame indices below are relative to this

# Loop chosen by frame matching on Nick's bow arm: at 10.033 s and 37.033 s the bow
# sits at the same angle and keeps moving the same way for ~8 frames. The camera is
# locked off from 10.0 s to 38.1 s (it starts panning at 38.2 s), so nothing here
# touches the camera move.
START = 10.033
END = 37.033
DISSOLVE = 8  # frames (0.27 s): tail → head, only at the loop seam

# Native-resolution crop around Nick's upper body: source x 0–688, y 180–820.
# Stops short of x ≈ 700, where the next violinist's arm comes into frame, so that
# player is gone from the file itself rather than hidden in CSS. Headroom above
# Nick and room for the bow's full travel (motion map: x 78–468, y 370–816).
# The page lines his face up with the close-up photograph; it never shows more
# than ~2× the source pixels.
CROP = "crop=688:640:0:180"

CLEAN = ",".join([
    # Light spatial + gentle temporal denoise. Temporal strength kept low so the
    # moving bow doesn't smear.
    "hqdn3d=luma_spatial=1.2:chroma_spatial=1.6:luma_tmp=1.8:chroma_tmp=2.4",
    # Restrained luma-only sharpening (lighter than before: the page enlarges it up to 2×).
    "unsharp=lx=5:ly=5:la=0.45:cx=5:cy=5:ca=0",
])

GRADE = ",".join([
    # Soften the bright walls, flowers and music: compress only the top highlights;
    # mid-tones (Nick's face, the violin) keep their original brightness.
    "curves=master='0/0 0.12/0.105 0.5/0.5 0.7/0.685 0.85/0.785 1/0.86'",
    # Shadows lean gently towards the site green (#102922); mid-tones stay warm for
    # skin and violin; highlights lose a little blue so whites read as warm ivory.
    "colorbalance=rs=-0.03:gs=0.015:bs=0.0:rm=0.02:gm=0.0:bm=-0.02:bh=-0.03",
    # Quieten the pink flowers and the blue music folder without touching skin.
    "huesaturation=saturation=-0.4:colors=m+b:strength=2",
    # Warm the whole picture slightly towards the close-up photograph's golden
    # light: a 12% blend towards a sepia tone (the same maths as CSS sepia(0.12)),
    # with a touch of contrast.
    "colorchannelmixer=rr=0.927:rg=0.092:rb=0.023:gr=0.042:gg=0.962:gb=0.020:br=0.033:bg=0.064:bb=0.896",
    "eq=saturation=0.97:contrast=1.04",
    # Light falloff around Nick is done in CSS (feathered, per breakpoint).
])

head = f"trim=start_frame={round((START - DECODE_FROM) * FPS)}:end_frame={round((END - DECODE_FROM) * FPS)},setpts=PTS-STARTPTS"
tail_start = round((END - DECODE_FROM) * FPS)
tail = f"trim=start_frame={tail_start}:end_frame={tail_start + DISSOLVE},setpts=PTS-STARTPTS"

graph = (
    f"[0:v]fps={FPS},{CROP},{CLEAN},{GRADE},format=yuv420p,split=2[a][b];"
    f"[a]{tail}[tail];[b]{head}[head];"
    # Output opens on the tail dissolving into the head, so the last frame of the
    # file flows straight into the first when the browser loops it.
    f"[tail][head]xfade=transition=fade:duration={DISSOLVE / FPS:.4f}:offset=0[out]"
)

common = ["ffmpeg", "-v", "error", "-y", "-ss", str(DECODE_FROM), "-i", SRC, "-an", "-filter_complex", graph, "-map", "[out]"]

if PREVIEW:
    subprocess.run([*common, "-c:v", "libx264", "-crf", "16", "-preset", "fast", f"{OUT}/hero-preview.mp4"], check=True)
else:
    subprocess.run([
        *common,
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p",
        "-crf", "22", "-preset", "veryslow", "-tune", "film",
        "-g", "60", "-movflags", "+faststart",
        f"{OUT}/nick-hero.mp4",
    ], check=True)
    # Poster = the first frame the browser shows, so there's no jump when playback starts.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/nick-hero.mp4", "-frames:v", "1", "-q:v", "3", f"{OUT}/nick-hero-poster.jpg"], check=True)
print("done")
