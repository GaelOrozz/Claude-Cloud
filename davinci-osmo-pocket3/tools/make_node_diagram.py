#!/usr/bin/env python3
"""Dibuja el árbol de nodos de la plantilla en ../docs/node-tree.svg."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))

NODES = [
    ("01", "IN", "LUT P3 D-Log M → DWG/DI", "in"),
    ("02", "EXPO", "Exposición (HDR Exposure / Offset)", "fix"),
    ("03", "WB", "Balance de blancos (Temp / Tint)", "fix"),
    ("04", "CONTRASTE", "Contrast + Pivot 0.336 / Curvas", "fix"),
    ("05", "SAT", "Saturación / Color Slice / HSV", "fix"),
    ("06", "PIEL", "Calificador de piel (vacío)", "fix"),
    ("07", "VENTANAS", "Viñeta / power windows (vacío)", "fix"),
    ("08", "OUT", "CST DWG/DI → Rec.709 Gamma 2.4", "out"),
    ("09", "LOOK", "LUT KYROS · Key Output Gain 0.65", "look"),
    ("10", "FINISH", "Altas mate, sat final, grano", "look"),
    ("11", "IPHONE", "LUT ENCODE → iPhone (no tocar)", "out"),
]
COLORS = {  # relleno, borde
    "in": ("#dbeafe", "#1d4ed8"),
    "fix": ("#f1f5f9", "#475569"),
    "out": ("#ffedd5", "#c2410c"),
    "look": ("#ede9fe", "#6d28d9"),
}

PER_ROW = 6
NW, NH, GAP = 208, 96, 36
W = 80 + PER_ROW * NW + (PER_ROW - 1) * GAP
ROW_Y = (120, 330)


def node_xy(i):
    row, col = divmod(i, PER_ROW)
    if row == 1:
        col = PER_ROW - 1 - col  # vuelta en "S"
    return 40 + col * (NW + GAP), ROW_Y[row]


def main():
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 520" font-family="Helvetica, Arial, sans-serif">',
           f'<rect width="{W}" height="520" fill="#ffffff"/>',
           '<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">'
           '<path d="M0,0 L10,5 L0,10 z" fill="#334155"/></marker></defs>',
           '<text x="40" y="44" font-size="24" font-weight="700" fill="#0f172a">PowerGrade · Osmo Pocket 3 D-Log M → Rec.709 (redes, iPhone)</text>',
           '<text x="40" y="74" font-size="15" fill="#475569">Timeline: DaVinci WG/Intermediate · Output: Rec.709 (Scene) · Color science: DaVinci YRGB</text>']
    # zonas
    x2, _ = node_xy(1)
    x6, _ = node_xy(5)
    out.append(f'<rect x="{x2 - 12}" y="96" width="{x6 + NW - x2 + 24}" height="{NH + 44}" rx="14" fill="none" stroke="#16a34a" stroke-dasharray="6 5"/>')
    out.append(f'<text x="{x2}" y="{96 + NH + 36}" font-size="13" fill="#16a34a">aquí corriges: espacio DaVinci Wide Gamut / Intermediate</text>')
    x7, _ = node_xy(6)
    out.append(f'<rect x="{x7 - 12}" y="306" width="{NW + 24}" height="{NH + 44}" rx="14" fill="none" stroke="#16a34a" stroke-dasharray="6 5"/>')
    x9, _ = node_xy(8)
    x10, _ = node_xy(9)
    out.append(f'<rect x="{x10 - 12}" y="306" width="{x9 + NW - x10 + 24}" height="{NH + 44}" rx="14" fill="none" stroke="#6d28d9" stroke-dasharray="6 5"/>')
    out.append(f'<text x="{x10}" y="{306 + NH + 36}" font-size="13" fill="#6d28d9">look en espacio de pantalla (Rec.709 G2.4)</text>')
    # flechas
    for i in range(len(NODES) - 1):
        (xa, ya), (xb, yb) = node_xy(i), node_xy(i + 1)
        if ya == yb:
            if xb > xa:
                out.append(f'<line x1="{xa + NW}" y1="{ya + NH / 2}" x2="{xb - 2}" y2="{yb + NH / 2}" stroke="#334155" stroke-width="2.5" marker-end="url(#a)"/>')
            else:
                out.append(f'<line x1="{xa}" y1="{ya + NH / 2}" x2="{xb + NW + 2}" y2="{yb + NH / 2}" stroke="#334155" stroke-width="2.5" marker-end="url(#a)"/>')
        else:
            out.append(f'<path d="M{xa + NW / 2},{ya + NH} C{xa + NW / 2},{ya + NH + 60} {xb + NW / 2},{yb - 60} {xb + NW / 2},{yb - 2}" '
                       f'fill="none" stroke="#334155" stroke-width="2.5" marker-end="url(#a)"/>')
    # nodos
    for i, (num, name, desc, kind) in enumerate(NODES):
        x, y = node_xy(i)
        fill, stroke = COLORS[kind]
        out.append(f'<rect x="{x}" y="{y}" width="{NW}" height="{NH}" rx="10" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
        out.append(f'<text x="{x + 14}" y="{y + 32}" font-size="20" font-weight="700" fill="{stroke}">{num} {name}</text>')
        words, lines, cur = desc.split(), [], ""
        for w in words:
            if len(cur) + len(w) + 1 > 24:
                lines.append(cur)
                cur = w
            else:
                cur = f"{cur} {w}".strip()
        lines.append(cur)
        for k, line in enumerate(lines[:2]):
            out.append(f'<text x="{x + 14}" y="{y + 58 + k * 20}" font-size="14" fill="#1e293b">{line}</text>')
    out.append('<text x="40" y="500" font-size="13" fill="#64748b">Fotos DNG: 01 IN y 11 IPHONE apagados, 08 OUT → sRGB. Para público Android/TV: apaga 11 y pon el Output en Rec.709 Gamma 2.4.</text>')
    out.append("</svg>")
    path = os.path.join(HERE, "..", "docs", "node-tree.svg")
    with open(path, "w") as f:
        f.write("\n".join(out))
    print("escrito", os.path.abspath(path))


if __name__ == "__main__":
    main()
