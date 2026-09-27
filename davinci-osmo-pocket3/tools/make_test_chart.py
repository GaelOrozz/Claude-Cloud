#!/usr/bin/env python3
"""
Crea una carta de prueba codificada en D-Log M (Pocket 3) para comprobar la
plantilla dentro de Resolve, y una vista previa de cómo debería verse.

Salidas (en ../docs):
  P3_DLogM_test_chart.tif   16-bit, valores D-Log M -> impórtala y aplica el PowerGrade
  preview_chart.png         arriba: log plano | medio: plantilla sin look | abajo: + KYROS (si se pasa --look)

La carta tiene una ColorChecker (24 parches) y una escala de grises en stops
(-6 ... +3.5 alrededor del gris medio). Tras IN + OUT, los grises deben verse
neutros y el gris medio (0 stops) cerca de 0.45 en Rec.709 gamma 2.2.
"""
import argparse
import os

import numpy as np
import tifffile
from PIL import Image, ImageDraw, ImageFont

from generate_luts import (P3_NATIVE_TO_DWG, apply_trilinear, di_to_linear,
                           p3_dlogm_to_linear, read_cube)

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(HERE, "..", "docs")
LUTS = os.path.join(HERE, "..", "LUTs")

# ColorChecker Classic (valores sRGB 8-bit de referencia, D65)
COLORCHECKER = [
    (115, 82, 68), (194, 150, 130), (98, 122, 157), (87, 108, 67), (133, 128, 177), (103, 189, 170),
    (214, 126, 44), (80, 91, 166), (193, 90, 99), (94, 60, 108), (157, 188, 64), (224, 163, 46),
    (56, 61, 150), (70, 148, 73), (175, 54, 60), (231, 199, 31), (187, 86, 149), (8, 133, 161),
    (243, 243, 242), (200, 200, 200), (160, 160, 160), (122, 122, 121), (85, 85, 85), (52, 52, 52),
]


def primaries_to_xyz(prim, white=(0.3127, 0.3290)):
    def xyz(x, y):
        return np.array([x / y, 1.0, (1 - x - y) / y])
    m = np.stack([xyz(*p) for p in prim], axis=1)
    s = np.linalg.solve(m, xyz(*white))
    return m * s


REC709_TO_XYZ = primaries_to_xyz([(0.64, 0.33), (0.30, 0.60), (0.15, 0.06)])
DWG_TO_XYZ = primaries_to_xyz([(0.8000, 0.3130), (0.1682, 0.9877), (0.0790, -0.1155)])
REC709_TO_DWG = np.linalg.solve(DWG_TO_XYZ, REC709_TO_XYZ)
DWG_TO_REC709 = np.linalg.inv(REC709_TO_DWG)
DWG_TO_NATIVE = np.linalg.inv(P3_NATIVE_TO_DWG)

_XS = np.linspace(0.0, 1.0, 200001)
_YS = p3_dlogm_to_linear(_XS)


def linear_to_p3_dlogm(lin):
    return np.interp(lin, _YS, _XS)


def srgb_to_linear(v):
    v = np.asarray(v, dtype=np.float64)
    return np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)


def build_chart(w=1920, h=1080):
    """Devuelve la carta en lineal de escena DWG (0.18 = gris medio)."""
    img = np.full((h, w, 3), 0.18 * 2 ** -2.5)  # fondo gris oscuro
    pw, ph, gap = 240, 200, 20
    x0 = (w - (6 * pw + 5 * gap)) // 2
    y0 = 60
    for i, c in enumerate(COLORCHECKER):
        lin709 = srgb_to_linear(np.array(c) / 255.0)
        r, col = divmod(i, 6)
        x, y = x0 + col * (pw + gap), y0 + r * (ph + gap)
        img[y:y + ph, x:x + pw] = REC709_TO_DWG @ lin709
    stops = np.arange(-6.0, 4.0, 0.5)
    sw = w // len(stops)
    for i, s in enumerate(stops):
        img[y0 + 4 * (ph + gap):, i * sw:(i + 1) * sw] = 0.18 * 2 ** s
    return img


def to_display(di_img):
    """DWG/DI -> Rec.709 gamma 2.2 con un hombro simple (no es el tone mapping de Resolve), solo para la vista previa."""
    lin = di_to_linear(di_img) @ DWG_TO_REC709.T
    lin = np.clip(lin, 0, None)
    lin = lin / (1 + lin / 4.0) * 1.25  # hombro suave para no recortar la escala
    return np.clip(lin, 0, 1) ** (1 / 2.2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--look", help="LUT creativo Rec.709 (p.ej. KYROS) para la 3a fila de la vista previa")
    ap.add_argument("--look-gain", type=float, default=1.0)
    args = ap.parse_args()
    os.makedirs(DOCS, exist_ok=True)

    dwg_lin = build_chart()
    native = dwg_lin @ DWG_TO_NATIVE.T
    dlogm = linear_to_p3_dlogm(np.clip(native, p3_dlogm_to_linear(0.0), None))
    tif = (np.clip(dlogm, 0, 1) * 65535).round().astype(np.uint16)
    tifffile.imwrite(os.path.join(DOCS, "P3_DLogM_test_chart.tif"), tif, photometric="rgb", compression="lzw")

    lut = read_cube(os.path.join(LUTS, "P3_DLogM_to_DWG-DI_65.cube"))
    di = apply_trilinear(lut, dlogm)
    disp = to_display(di)

    # comprobación: el gris medio vuelve a 0.18 lineal y los grises son neutros
    mid = di_to_linear(di[1000, 12 * (1920 // 20) + 48])  # parche de 0 stops
    print("gris medio lineal tras IN:", np.round(mid, 4))
    patches = []
    for i, c in enumerate(COLORCHECKER):
        r, col = divmod(i, 6)
        x, y = (1920 - (6 * 240 + 5 * 20)) // 2 + col * 260 + 120, 60 + r * 220 + 100
        back = di_to_linear(di[y, x]) @ DWG_TO_REC709.T
        patches.append(np.abs(back - srgb_to_linear(np.array(c) / 255.0)).max())
    print("error máx ColorChecker ida y vuelta (lineal):", round(float(max(patches)), 5))

    rows = [np.clip(dlogm, 0, 1), disp]
    if args.look:
        look = read_cube(args.look)
        graded = apply_trilinear(look, disp)
        rows.append(disp + (graded - disp) * args.look_gain)
    labels = ["1 - D-Log M tal cual sale de la camara (plano)",
              "2 - IN + OUT: conversion tecnica, sin look",
              f"3 - + LOOK KYROS al {args.look_gain:.0%}"]
    small = []
    for r, text in zip(rows, labels):
        im = Image.fromarray((r * 255).round().astype(np.uint8)).resize((960, 540))
        draw = ImageDraw.Draw(im)
        draw.rectangle([0, 0, 960, 34], fill=(0, 0, 0))
        draw.text((12, 6), text, fill=(255, 255, 255), font=_font(20))
        small.append(np.asarray(im))
    Image.fromarray(np.concatenate(small, axis=0)).save(os.path.join(DOCS, "preview_chart.png"))
    print("listo:", os.path.abspath(DOCS))


def _font(size):
    try:
        return ImageFont.truetype("DejaVuSans.ttf", size)
    except OSError:
        return ImageFont.load_default()


if __name__ == "__main__":
    main()
