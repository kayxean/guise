import type { ColorFn, ColorSpace } from '../types';

export const hsvToHsl: ColorFn<'hsv', 'hsl'> = (input) => {
  const H = input[0];
  const s = input[1];
  const v = input[2];

  const L = v * (1 - s / 2);

  let S: number;
  if (L === 0 || L === 1) {
    S = 0;
  } else {
    S = (v - L) / Math.min(L, 1 - L);
  }

  return [H, S, L] as ColorSpace<'hsl'>;
};

export const hslToHsv: ColorFn<'hsl', 'hsv'> = (input) => {
  const H = input[0];
  const s = input[1];
  const l = input[2];

  const V = l + s * Math.min(l, 1 - l);

  let S: number;
  if (V === 0) {
    S = 0;
  } else {
    S = 2 * (1 - l / V);
  }

  return [H, S, V] as ColorSpace<'hsv'>;
};
