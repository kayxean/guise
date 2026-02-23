import type { ColorArray } from '../types';

const EPSILON = 0.008856451679035631;
const KAPPA = 903.2962962962963;

const WHITE_D50_X = 0.96422;
const WHITE_D50_Y = 1.0;
const WHITE_D50_Z = 0.82521;

const INV_D50_X = 1 / WHITE_D50_X;
const INV_D50_Z = 1 / WHITE_D50_Z;

export function xyz50ToLab(input: ColorArray, output: ColorArray): void {
  const xr = input[0] * INV_D50_X;
  const yr = input[1];
  const zr = input[2] * INV_D50_Z;

  const fx = xr > EPSILON ? Math.cbrt(xr) : (KAPPA * xr + 16) / 116;
  const fy = yr > EPSILON ? Math.cbrt(yr) : (KAPPA * yr + 16) / 116;
  const fz = zr > EPSILON ? Math.cbrt(zr) : (KAPPA * zr + 16) / 116;

  output[0] = 116 * fy - 16;
  output[1] = 500 * (fx - fy);
  output[2] = 200 * (fy - fz);
}

export function labToXyz50(input: ColorArray, output: ColorArray): void {
  const l = input[0];
  const a = input[1];
  const b = input[2];

  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const fx3 = fx * fx * fx;
  const fy3 = fy * fy * fy;
  const fz3 = fz * fz * fz;

  output[0] = (fx3 > EPSILON ? fx3 : (116 * fx - 16) / KAPPA) * WHITE_D50_X;
  output[1] = (l > KAPPA * EPSILON ? fy3 : l / KAPPA) * WHITE_D50_Y;
  output[2] = (fz3 > EPSILON ? fz3 : (116 * fz - 16) / KAPPA) * WHITE_D50_Z;
}
