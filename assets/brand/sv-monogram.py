"""SV monogram, 64-unit grid. S: centreline with a controlled width profile; V: thick left, thin right."""
import math, sys, json

GREEN = "#102922"; IVORY = "#f3ecdd"

def bez(p0, p1, p2, p3, n=32):
    out = []
    for i in range(n + 1):
        t = i / n; m = 1 - t
        out.append((m**3*p0[0]+3*m*m*t*p1[0]+3*m*t*t*p2[0]+t**3*p3[0], m**3*p0[1]+3*m*m*t*p1[1]+3*m*t*t*p2[1]+t**3*p3[1]))
    return out

def f(v): return f"{v:.2f}".rstrip("0").rstrip(".")

def poly(pts): return "M" + "L".join(f"{f(x)},{f(y)}" for x, y in pts) + "Z"

def s_centre(c):
    ty = c.get("s_top", 14.3)          # centreline of the top stroke
    tx, tyy = c.get("term", (29.6, 19.8))  # upper terminal
    return [
        ((tx, tyy), (tx - 0.6, ty + 2.0), (26.0, ty), (21.0, ty)),
        ((21.0, ty), (15.6, ty), (12.3, ty + 2.9), (12.3, ty + 6.9)),
        ((12.3, ty + 6.9), (12.3, 25.6), (16.2, 27.8), (21.2, 30.2)),
        ((21.2, 30.2), (26.8, 32.9), (30.9, 36.0), (30.9, 41.9)),
        ((30.9, 41.9), (30.9, 47.6), (26.4, 51.1), (20.6, 51.1)),
        ((20.6, 51.1), (15.4, 51.1), (11.6, 48.6), (10.9, 44.6)),
    ]
# stroke width at each segment boundary (and mid-points), in units
W_KEYS = [(0, 4.0), (0.25, 3.2), (1, 3.3), (1.6, 4.4), (2, 5.2), (2.6, 7.4), (3, 8.0), (3.4, 7.2), (4, 5.8), (4.5, 4.2), (5, 3.3), (5.75, 3.2), (6, 4.0)]

def width_at(u, scale, boost=0.0):
    for (a, wa), (b, wb) in zip(W_KEYS, W_KEYS[1:]):
        if a <= u <= b:
            k = (u - a) / (b - a); k = (1 - math.cos(math.pi * k)) / 2
            return (wa + (wb - wa) * k) * scale + boost
    return W_KEYS[-1][1] * scale + boost

def s_outline(c, dx, wscale):
    boost = c.get("boost", 0)
    pts, us = [], []
    for i, seg in enumerate(s_centre(c)):
        b = bez(*[(x + dx, y) for x, y in seg])
        for j, p in enumerate(b):
            if i and not j: continue
            pts.append(p); us.append(i + j / (len(b) - 1))
    left, right = [], []
    for k, (p, u) in enumerate(zip(pts, us)):
        a = pts[max(k - 1, 0)]; b2 = pts[min(k + 1, len(pts) - 1)]
        tx, ty = b2[0] - a[0], b2[1] - a[1]; n = math.hypot(tx, ty); tx, ty = tx / n, ty / n
        nx, ny = -ty, tx; w = width_at(u, wscale, boost) / 2
        left.append((p[0] + nx * w, p[1] + ny * w)); right.append((p[0] - nx * w, p[1] - ny * w))
    return poly(left + right[::-1]), pts[0], pts[-1]

def inter(p, p2, q, q2):
    x1, y1 = p; x2, y2 = p2; x3, y3 = q; x4, y4 = q2
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))

def v_shapes(c):
    vx = c["v_dx"]; top, bot = 12.9, 51.4
    lo, lw = 24.6 + vx, c["v_thick"]; ro, rw = 55.4 + vx, c["v_thin"]
    bx, bw = 40.4 + vx, c["v_bottom"]
    notch = inter((lo + lw, top), (bx + bw, bot), (ro - rw, top), (bx, bot))
    body = poly([(lo, top), (lo + lw, top), notch, (ro - rw, top), (ro, top), (bx + bw, bot), (bx, bot)])
    sh, sw = c["serif_h"], c["serif_w"]
    serifs = [
        poly([(lo - sw * c.get("lserif", 1), top), (lo + lw + sw * .6, top), (lo + lw + sw * .6, top + sh * .45), (lo + lw, top + sh * 1.1), (lo, top + sh * 1.1), (lo - sw * c.get("lserif", 1), top + sh * .45)]),
        poly([(ro - rw - sw * .7, top), (ro + sw * .9, top), (ro + sw * .9, top + sh * .45), (ro, top + sh * 1.1), (ro - rw, top + sh * 1.1), (ro - rw - sw * .7, top + sh * .45)]),
    ]
    return [body] + serifs

def s_shapes(c):
    body, t0, t1 = s_outline(c, c["s_dx"], c["s_w"])
    b = c["barb"]
    barbs = [
        poly([(t0[0] - b * .55, t0[1] + 1.2), (t0[0] + b * .55, t0[1] + 1.2), (t0[0] + b * .55, t0[1] - c["barb_h"]), (t0[0] - b * .55, t0[1] - c["barb_h"] + .8)]),
        poly([(t1[0] - b * .55, t1[1] - 1.2), (t1[0] + b * .55, t1[1] - 1.2), (t1[0] + b * .55, t1[1] + c["barb_h"] - .8), (t1[0] - b * .55, t1[1] + c["barb_h"])]),
    ] if c["barb"] else []
    return [body] + barbs

def group(paths, fill, halo=0):
    d = "".join(f'<path d="{p}"/>' for p in paths)
    if halo:
        return f'<g fill="{GREEN}" stroke="{GREEN}" stroke-width="{f(halo*2)}" stroke-linejoin="round">{d}</g>'
    return f'<g fill="{fill}">{d}</g>'

def svg(c, tile=True, rx=13):
    V, S = v_shapes(c), s_shapes(c)
    gap = c["gap"]; cy = c["cross_y"]; k = c.get("k", 1.08)
    def knock(paths):  # black copies, widened by the gap, for a mask
        d = "".join(f'<path d="{p}"/>' for p in paths)
        return f'<g fill="#000" stroke="#000" stroke-width="{f(gap*2)}" stroke-linejoin="round">{d}</g>'
    region = 'x="-16" y="-16" width="96" height="96"'
    out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">']
    out.append('<title>Studio Violins</title>')
    if tile: out.append(f'<rect width="64" height="64" rx="{rx}" fill="{GREEN}"/>')
    out.append(f'<g transform="translate(32 32) scale({k}) translate(-32.85 -32.7)">')
    out.append('<defs>'
               f'<clipPath id="sv-low"><rect x="-16" y="{cy}" width="96" height="96"/></clipPath>'
               f'<clipPath id="sv-high"><rect x="-16" y="-16" width="96" height="{cy+16}"/></clipPath>'
               # low down the S passes over the V; near the top the V passes over the S
               f'<mask id="sv-v" maskUnits="userSpaceOnUse" {region}><rect {region} fill="#fff"/><g clip-path="url(#sv-low)">{knock(S)}</g></mask>'
               f'<mask id="sv-s" maskUnits="userSpaceOnUse" {region}><rect {region} fill="#fff"/><g clip-path="url(#sv-high)">{knock(V)}</g></mask>'
               '</defs>')
    out.append(f'<g fill="{IVORY}" mask="url(#sv-v)">' + "".join(f'<path d="{p}"/>' for p in V) + '</g>')
    out.append(f'<g fill="{IVORY}" mask="url(#sv-s)">' + "".join(f'<path d="{p}"/>' for p in S) + '</g>')
    out.append('</g></svg>')
    return "".join(out)

if __name__ == "__main__":
    c = dict(v_dx=-5.0, v_thick=7.6, v_thin=3.6, v_bottom=3.0, serif_h=2.0, serif_w=3.0, s_dx=1.0, s_w=1.0, barb=1.7, barb_h=4.2, gap=1.3, cross_y=30)
    c.update(json.loads(sys.argv[1]) if len(sys.argv) > 2 else {})
    if "term" in c: c["term"] = tuple(c["term"])
    open(sys.argv[-1], "w").write(svg(c, tile=not c.get("notile"), rx=0 if c.get("square") else 13))
