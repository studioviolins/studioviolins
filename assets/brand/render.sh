#!/bin/zsh
# usage: render.sh file.svg size out.png — renders an SVG at an exact pixel size with headless Chrome (macOS).
# Working files go in a temporary folder, which is removed afterwards.
svg=$1; size=$2; out=${3:A}
tmp=$(mktemp -d)
html=$tmp/render.html
print -r -- "<!doctype html><html><head><style>html,body{margin:0;background:transparent}img{display:block;width:${size}px;height:${size}px}</style></head><body><img src=\"file://${svg:A}\"></body></html>" > $html
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --user-data-dir=$tmp/chrome --allow-file-access-from-files \
  --default-background-color=00000000 --window-size=$size,$size --screenshot=$out file://$html >/dev/null 2>&1
rm -rf $tmp
