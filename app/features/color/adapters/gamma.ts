import type { ColorArray } from '../types';

const INV_12_92 = 1 / 12.92;
const INV_1_055 = 1 / 1.055;
const GAMMA_EXP = 2.4;
const GAMMA_COMP = 1 / 2.4;

export function rgbToLrgb(input: ColorArray, output: ColorArray): void {
  const r = input[0],
    g = input[1],
    b = input[2];

  output[0] =
    r <= 0.04045 ? r * INV_12_92 : ((r + 0.055) * INV_1_055) ** GAMMA_EXP;
  output[1] =
    g <= 0.04045 ? g * INV_12_92 : ((g + 0.055) * INV_1_055) ** GAMMA_EXP;
  output[2] =
    b <= 0.04045 ? b * INV_12_92 : ((b + 0.055) * INV_1_055) ** GAMMA_EXP;
}

export function lrgbToRgb(input: ColorArray, output: ColorArray): void {
  const lr = input[0],
    lg = input[1],
    lb = input[2];

  const cr = lr < 0 ? 0 : lr;
  const cg = lg < 0 ? 0 : lg;
  const cb = lb < 0 ? 0 : lb;

  output[0] = cr <= 0.0031308 ? cr * 12.92 : 1.055 * cr ** GAMMA_COMP - 0.055;
  output[1] = cg <= 0.0031308 ? cg * 12.92 : 1.055 * cg ** GAMMA_COMP - 0.055;
  output[2] = cb <= 0.0031308 ? cb * 12.92 : 1.055 * cb ** GAMMA_COMP - 0.055;
}
