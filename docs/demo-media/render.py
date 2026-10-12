"""Render the review set from cutlist.json into docs/demo-media/{stills,clips}/.

Stills: exact-frame grab, crop to the UI, WebP q85 at source resolution.
Loops (silent, per docs/DEMO-MEDIA-PLAN.md §6): crop, scale to 1280 px wide, 30 fps, no audio track,
  H.264 High (CRF 24, 2 s GOP, +faststart) and AV1 (SVT-AV1 CRF 38, preset 6), plus a WebP poster of the first frame.
Multi-segment loops are joined with hard cuts. Needs ffmpeg 8 with libx264, libsvtav1 and libwebp.
Usage: python docs/demo-media/render.py [id ...]"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CUT = json.load(open(os.path.join(HERE, "cutlist.json"), encoding="utf-8"))
ONLY = set(sys.argv[1:])
os.makedirs(os.path.join(HERE, "stills"), exist_ok=True)
os.makedirs(os.path.join(HERE, "clips"), exist_ok=True)


def run(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def crop_f(c):
    x, y, w, h = c
    return f"crop={w}:{h}:{x}:{y}"


for s in CUT["stills"]:
    if ONLY and s["id"] not in ONLY:
        continue
    out = os.path.join(HERE, "stills", s["id"] + ".webp")
    run(["-ss", str(s["t"]), "-i", CUT["sources"][s["src"]], "-frames:v", "1", "-vf", crop_f(s["crop"]),
         "-c:v", "libwebp", "-quality", "85", out])
    print(f"still  {s['id']:34s} {os.path.getsize(out) / 1024:7.0f} KB")

for L in CUT["loops"]:
    if ONLY and L["id"] not in ONLY:
        continue
    src = CUT["sources"][L["src"]]
    ins, chains = [], []
    for i, (a, b) in enumerate(L["segments"]):
        ins += ["-ss", str(a), "-t", str(b - a), "-i", src]
        chains.append(f"[{i}:v]{crop_f(L['crop'])},scale=1280:-2:flags=lanczos,fps=30,setsar=1,format=yuv420p[v{i}]")
    n = len(L["segments"])
    graph = ";".join(chains) + ";" + "".join(f"[v{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[out]"
    base = os.path.join(HERE, "clips", L["id"])
    run([*ins, "-filter_complex", graph, "-map", "[out]", "-an", "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
         "-crf", "24", "-g", "60", "-movflags", "+faststart", base + ".mp4"])
    run([*ins, "-filter_complex", graph, "-map", "[out]", "-an", "-c:v", "libsvtav1", "-preset", "6", "-crf", "38",
         "-g", "60", "-movflags", "+faststart", base + ".av1.mp4"])
    run(["-i", base + ".mp4", "-frames:v", "1", "-c:v", "libwebp", "-quality", "80", base + ".poster.webp"])
    dur = sum(b - a for a, b in L["segments"])
    print(f"loop   {L['id']:34s} {dur:5.1f} s  h264 {os.path.getsize(base + '.mp4') / 1024:6.0f} KB  "
          f"av1 {os.path.getsize(base + '.av1.mp4') / 1024:6.0f} KB  poster {os.path.getsize(base + '.poster.webp') / 1024:4.0f} KB")
