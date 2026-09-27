#!/usr/bin/env python3
"""
Pasa un frame de un clip D-Log M real del Pocket 3 por la plantilla y guarda
una comparación (por defecto en ./preview_clip.png):

  1. D-Log M plano (como sale de la cámara)
  2. CST "DJI D-Log / D-Gamut" de Resolve (el preset equivocado, para comparar)
  3. Plantilla: IN (LUT) -> OUT aproximado a Rec.709
  4. Plantilla + LOOK KYROS (si se pasa --look)

El OUT es una aproximación del CST DaVinci Wide Gamut -> Rec.709 con tone
mapping "DaVinci" (Blackmagic no publica la curva exacta), sólo para previsualizar.

Uso:
  python3 preview_clip.py CLIP.mp4 [--time 0.7] [--look KYROS_SOFT.cube --look-gain 0.65]
  (necesita ffmpeg; si no está en el PATH: pip install imageio-ffmpeg)
"""
import argparse
import os
import shutil
import subprocess

import numpy as np
from PIL import Image, ImageDraw

from generate_luts import apply_trilinear, di_to_linear, read_cube
from make_test_chart import DWG_TO_REC709, REC709_TO_XYZ, _font, primaries_to_xyz

HERE = os.path.dirname(os.path.abspath(__file__))
LUTS = os.path.join(HERE, "..", "LUTs")

# D-Log / D-Gamut (whitepaper DJI Zenmuse X7) = lo que trae Resolve como "DJI D-Log"
D_GAMUT_TO_XYZ = primaries_to_xyz([(0.71, 0.31), (0.21, 0.88), (0.09, -0.08)])
D_GAMUT_TO_REC709 = np.linalg.solve(REC709_TO_XYZ, D_GAMUT_TO_XYZ)


def dlog_to_linear(x):
    return np.where(x <= 0.14, (x - 0.0929) / 6.025, (10 ** (3.89616 * x - 2.27752) - 0.0108) / 0.9892)


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def read_frame(clip, t):
    """Frame en RGB 0-1 con niveles de video normalizados (igual que Resolve)."""
    probe = subprocess.run([ffmpeg_exe(), "-hide_banner", "-i", clip], capture_output=True, text=True).stderr
    w, h = next(tok for tok in probe.replace(",", " ").split() if "x" in tok and tok.split("x")[0].isdigit()
                 and tok.split("x")[1].isdigit()).split("x")
    w, h = int(w), int(h)
    raw = subprocess.run(
        [ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-ss", str(t), "-i", clip, "-frames:v", "1",
         "-vf", "scale=in_range=tv:out_range=pc:in_color_matrix=bt709:flags=accurate_rnd+full_chroma_int",
         "-pix_fmt", "rgb48le", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<u2").reshape(h, w, 3).astype(np.float64) / 65535.0


def tone_map(lin):
    """Hombro fílmico por canal: gris 0.18 -> ~0.118 lineal de pantalla (≈0.41 en gamma 2.4)."""
    x = np.clip(lin, 0, None) * 0.60
    y = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14)
    return np.clip(y, 0, 1)


def gamut_compress(rgb):
    """Lleva los valores negativos (fuera de Rec.709) hacia la luminancia."""
    luma = rgb @ np.array([0.2126, 0.7152, 0.0722])
    lo = rgb.min(-1)
    k = np.where(lo < 0, luma / np.maximum(luma - lo, 1e-6), 1.0)[..., None]
    return luma[..., None] + (rgb - luma[..., None]) * np.clip(k, 0, 1)


def to_rec709(lin709, gamma=2.4):
    return tone_map(gamut_compress(lin709)) ** (1 / gamma)


def template(dlogm, lut):
    di = apply_trilinear(lut, dlogm)
    return di, to_rec709(di_to_linear(di) @ DWG_TO_REC709.T)


def wrong_cst(dlogm):
    return to_rec709(dlog_to_linear(dlogm) @ D_GAMUT_TO_REC709.T)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip")
    ap.add_argument("--time", type=float, default=0.7)
    ap.add_argument("--look")
    ap.add_argument("--look-gain", type=float, default=0.65)
    ap.add_argument("--out", default="preview_clip.png")
    args = ap.parse_args()

    frame = read_frame(args.clip, args.time)
    h, w = frame.shape[:2]
    step = max(1, w // 1280)
    frame = frame[::step, ::step]

    lut = read_cube(os.path.join(LUTS, "P3_DLogM_to_DWG-DI_65.cube"))
    di, conv = template(frame, lut)
    rows = [("1 - D-Log M original (plano)", frame),
            ("2 - CST 'DJI D-Log' de Resolve (preset equivocado)", wrong_cst(frame)),
            ("3 - Plantilla: IN + OUT (sin look)", conv)]
    if args.look:
        look = read_cube(args.look)
        graded = conv + (apply_trilinear(look, conv) - conv) * args.look_gain
        rows.append((f"4 - Plantilla + LOOK KYROS al {args.look_gain:.0%}", graded))

    tiles = []
    for text, img in rows:
        im = Image.fromarray((np.clip(img, 0, 1) * 255).round().astype(np.uint8)).resize((960, 540))
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 960, 34], fill=(0, 0, 0))
        d.text((12, 6), text, fill=(255, 255, 255), font=_font(20))
        tiles.append(np.asarray(im))
    grid = np.concatenate([np.concatenate(tiles[i:i + 2], axis=1) for i in range(0, len(tiles), 2)], axis=0)
    Image.fromarray(grid).save(args.out)
    print("guardado", os.path.abspath(args.out))


if __name__ == "__main__":
    main()
