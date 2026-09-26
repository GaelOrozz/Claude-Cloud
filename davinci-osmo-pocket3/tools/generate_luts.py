#!/usr/bin/env python3
"""
Genera el LUT de entrada para DJI Osmo Pocket 3:
    D-Log M (Pocket 3)  ->  DaVinci Wide Gamut / DaVinci Intermediate

Por qué un LUT y no un CST nativo: DaVinci Resolve no trae D-Log M en el
Color Space Transform (el "DJI D-Log" de Resolve es otro perfil y satura de
más), y DJI no publica la fórmula de D-Log M. Este LUT usa el ajuste por
ingeniería inversa de Thatcher Freeman (github.com/thatcherfreeman/dwg-transforms,
"DJI Pocket 3 D-Log M to DWG"), hecho con clips del Pocket 3 y una ColorChecker.

El resultado cae en DWG/DI, así que la salida a Rec.709 / sRGB se hace con el
CST nativo de Resolve (sin LUT, sin pérdidas).

Uso:
    python3 generate_luts.py            # escribe ../LUTs/*.cube y valida
    python3 generate_luts.py --size 33
"""
import argparse
import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "LUTs")


# --- D-Log M (Pocket 3) -> lineal de escena (0.18 = gris medio) -------------
def p3_dlogm_to_linear(x):
    x = np.asarray(x, dtype=np.float64)
    x_shift = -2.428226947784424
    y_shift = 0.9327186346054077
    scale = 5.612990379333496
    slope = 1.0151796340942383
    slope2 = 1.8734303712844849
    intercept = 0.5178895592689514
    cut = 0.6034245491027832
    tmp = np.power(2.0, x * scale + y_shift) + x_shift
    out = np.where(tmp < cut, tmp * slope + intercept, tmp * slope2)
    return out * 0.18 / 12.4054


# Primarias nativas estimadas del Pocket 3 -> DaVinci Wide Gamut (D65)
P3_NATIVE_TO_DWG = np.array([
    [0.69848738, 0.19665509, 0.10485752],
    [-0.00579783, 1.00886749, -0.00306966],
    [0.03929425, 0.20805949, 0.75264626],
])


# --- DaVinci Intermediate (whitepaper Blackmagic DWG/DI) --------------------
DI_A, DI_B, DI_C, DI_M, DI_LIN_CUT = 0.0075, 7.0, 0.07329248, 10.44426855, 0.00262409
DI_LOG_CUT = 0.02740668


def linear_to_di(x):
    x = np.asarray(x, dtype=np.float64)
    safe = np.maximum(x + DI_A, 1e-10)
    return np.where(x > DI_LIN_CUT, (np.log2(safe) + DI_B) * DI_C, x * DI_M)


def di_to_linear(y):
    y = np.asarray(y, dtype=np.float64)
    return np.where(y > DI_LOG_CUT, np.power(2.0, y / DI_C - DI_B) - DI_A, y / DI_M)


def p3_dlogm_to_dwg_di(rgb):
    lin = p3_dlogm_to_linear(rgb)
    dwg = lin @ P3_NATIVE_TO_DWG.T
    return linear_to_di(dwg)


# --- Escritura / lectura .cube ---------------------------------------------
def lattice(size):
    g = np.linspace(0.0, 1.0, size)
    b, gg, r = np.meshgrid(g, g, g, indexing="ij")  # R varía más rápido
    return np.stack([r, gg, b], axis=-1)


def write_cube(path, title, table, comments=()):
    size = table.shape[0]
    with open(path, "w", newline="\n") as f:
        for c in comments:
            f.write(f"# {c}\n")
        f.write(f'TITLE "{title}"\n')
        f.write(f"LUT_3D_SIZE {size}\n")
        f.write("DOMAIN_MIN 0.0 0.0 0.0\nDOMAIN_MAX 1.0 1.0 1.0\n\n")
        for row in table.reshape(-1, 3):
            f.write(f"{row[0]:.6f} {row[1]:.6f} {row[2]:.6f}\n")


def read_cube(path):
    size, rows = None, []
    for line in open(path):
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("LUT_3D_SIZE"):
            size = int(s.split()[1])
        elif s[0].isdigit() or s[0] == "-":
            rows.append([float(v) for v in s.split()])
    return np.array(rows).reshape(size, size, size, 3)


def apply_trilinear(lut, rgb):
    n = lut.shape[0]
    x = np.clip(np.asarray(rgb, dtype=np.float64), 0, 1) * (n - 1)
    i0 = np.clip(np.floor(x).astype(int), 0, n - 2)
    f = x - i0
    r0, g0, b0 = i0[..., 0], i0[..., 1], i0[..., 2]
    fr, fg, fb = f[..., 0:1], f[..., 1:2], f[..., 2:3]
    c = lambda db, dg, dr: lut[b0 + db, g0 + dg, r0 + dr]
    c00 = c(0, 0, 0) * (1 - fr) + c(0, 0, 1) * fr
    c10 = c(0, 1, 0) * (1 - fr) + c(0, 1, 1) * fr
    c01 = c(1, 0, 0) * (1 - fr) + c(1, 0, 1) * fr
    c11 = c(1, 1, 0) * (1 - fr) + c(1, 1, 1) * fr
    return (c00 * (1 - fg) + c10 * fg) * (1 - fb) + (c01 * (1 - fg) + c11 * fg) * fb


# --- Validación --------------------------------------------------------------
def validate(path):
    lut = read_cube(path)
    rng = np.random.default_rng(7)
    samples = rng.random((200_000, 3))
    err = np.abs(apply_trilinear(lut, samples) - p3_dlogm_to_dwg_di(samples))
    # 1 stop en DaVinci Intermediate = 0.07329 de valor de código
    print(f"  error máx vs. fórmula exacta: {err.max():.5f}  ({err.max() / DI_C:.3f} stops)")
    print(f"  error medio:                 {err.mean():.6f}  ({err.mean() / DI_C:.4f} stops)")

    gray = apply_trilinear(lut, np.array([[0.40, 0.40, 0.40]]))[0]
    print(f"  gris medio D-Log M 0.40 -> DI {np.round(gray, 4)} (ideal 0.3360 en DI)")
    white = p3_dlogm_to_dwg_di(np.array([1.0, 1.0, 1.0]))
    print(f"  blanco D-Log M 1.0 -> DI {np.round(white, 4)} "
          f"(= {np.log2(di_to_linear(white[1]) / 0.18):.2f} stops sobre gris medio)")
    ramp = apply_trilinear(lut, np.repeat(np.linspace(0, 1, 11)[:, None], 3, 1))
    neutral = np.abs(ramp - ramp.mean(1, keepdims=True)).max()
    print(f"  neutralidad (desvío máx de grises): {neutral:.6f}")
    return err.max()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", type=int, default=65, choices=(17, 33, 65))
    args = ap.parse_args()
    os.makedirs(OUT_DIR, exist_ok=True)

    table = p3_dlogm_to_dwg_di(lattice(args.size))
    name = f"P3_DLogM_to_DWG-DI_{args.size}.cube"
    path = os.path.join(OUT_DIR, name)
    write_cube(
        path,
        "DJI Osmo Pocket 3 D-Log M to DaVinci WG-Intermediate",
        table,
        comments=(
            "INPUT: DJI Osmo Pocket 3 D-Log M (10-bit, niveles de video normalizados por Resolve)",
            "OUTPUT: DaVinci Wide Gamut / DaVinci Intermediate (espacio de trabajo)",
            "Salida a Rec.709/sRGB: usar el CST nativo DWG/DI -> Rec.709 al final del arbol",
            "Curva/matriz: ajuste por ingenieria inversa de Thatcher Freeman (dwg-transforms)",
            "Generado por tools/generate_luts.py",
        ),
    )
    print(f"Escrito {name}")
    validate(path)


if __name__ == "__main__":
    main()
