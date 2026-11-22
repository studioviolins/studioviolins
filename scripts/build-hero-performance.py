"""Build the audible "Watch & listen" clip: one complete phrase, picture and sound in sync.

Picture: the 60 fps loop made in OpenArt from the 688×640 crop (same framing as
the muted preview, so it lines up with the photograph in the same way).
Sound: the concert audio for 29:10–29:39 (nick-audio-2910-2939-29s.m4a).

Sync: the audio file starts at 29:10.000. Frame j of the 60 fps loop is concert
time 29:10.0333 + j/60 (the loop starts one frame after 29:10). Cross-checking
Nick's bow speed against the music puts them within a frame of each other, so
the audio is cut at exactly the same concert time as the first picture frame.

Phrase: begins after a breath at 29:13.90 and ends on a cadence that has died
away by 29:32.78 (the next phrase starts at 29:32.90), all inside the static
camera shot (the camera starts to pan at 29:38.2).

Processing: colour grade only (same as the preview); audio gets a flat +6 dB
(−25.8 → about −20 LUFS, true peak about −5 dBFS), a 0.12 s fade-in and a fade-out
over the last note's decay. Nothing generative.

Usage: python3 scripts/build-hero-performance.py LOOP_60FPS AUDIO OUT_DIR
"""

import subprocess
import sys

LOOP, AUDIO, OUT = sys.argv[1], sys.argv[2], sys.argv[3]

FPS = 60
LOOP_ORIGIN = 10.0 + 1 / 30   # concert seconds after 29:00 at loop frame 0
AUDIO_ORIGIN = 10.0           # concert seconds after 29:00 at audio sample 0

FIRST_FRAME = 225             # 29:13.783 — just before the phrase's first note at 29:13.90
FRAMES = 1140                 # 19.0 s → 29:32.783, before the next phrase at 29:32.90
START = LOOP_ORIGIN + FIRST_FRAME / FPS
DURATION = FRAMES / FPS
AUDIO_START = START - AUDIO_ORIGIN

FADE_IN = 0.12
FADE_OUT = 0.8

GRADE = ",".join([
    "curves=master='0/0 0.12/0.105 0.5/0.5 0.7/0.685 0.85/0.785 1/0.86'",
    "colorbalance=rs=-0.03:gs=0.015:bs=0.0:rm=0.02:gm=0.0:bm=-0.02:bh=-0.03",
    "huesaturation=saturation=-0.4:colors=m+b:strength=2",
    "colorchannelmixer=rr=0.927:rg=0.092:rb=0.023:gr=0.042:gg=0.962:gb=0.020:br=0.033:bg=0.064:bb=0.896",
    "eq=saturation=0.97:contrast=1.04",
])

graph = (
    f"[0:v]trim=start_frame={FIRST_FRAME}:end_frame={FIRST_FRAME + FRAMES},setpts=PTS-STARTPTS,"
    f"{GRADE},format=yuv420p[v];"
    f"[1:a]atrim=start={AUDIO_START:.4f}:duration={DURATION:.4f},asetpts=PTS-STARTPTS,"
    f"volume=6dB,afade=t=in:d={FADE_IN},afade=t=out:st={DURATION - FADE_OUT:.4f}:d={FADE_OUT}[a]"
)

subprocess.run([
    "ffmpeg", "-v", "error", "-y", "-i", LOOP, "-i", AUDIO,
    "-filter_complex", graph, "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-profile:v", "high", "-level", "5.0", "-pix_fmt", "yuv420p",
    "-crf", "23", "-preset", "veryslow", "-tune", "film", "-g", "120",
    "-c:a", "aac", "-b:a", "160k",
    "-movflags", "+faststart",
    f"{OUT}/nick-performance.mp4",
], check=True)
print(f"done: concert 29:{START:05.2f} → 29:{START + DURATION:05.2f} ({DURATION:.2f} s)")
