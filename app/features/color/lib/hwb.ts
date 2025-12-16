import type { ColorFn, ColorSpace } from '../types';

export const hsvToHwb: ColorFn<'hsv', 'hwb'> = (input) => {
  const H = input[0];
  const S = input[1];
  const V = input[2];

  const W = V * (1 - S);

  const B = 1 - V;

  return [H, W, B] as ColorSpace<'hwb'>;
};

export const hwbToHsv: ColorFn<'hwb', 'hsv'> = (input) => {
  const H = input[0];
  const W = input[1];
  const B = input[2];

  const sum = W + B;
  if (sum >= 1) {
    const V = 1 - B;
    return [H, 0, V] as ColorSpace<'hsv'>;
  }

  const V = 1 - B;

  const S = V === 0 ? 0 : (V - W) / V;

  return [H, S, V] as ColorSpace<'hsv'>;
};
