import type { ColorFn, ColorMatrix, ColorSpace } from '../types';
import { multiplyMatrixVector } from '../matrix';

const M_SRGB: ColorMatrix = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041],
];

const M_SRGB_INV: ColorMatrix = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.876, 0.041556],
  [0.0556434, -0.2040259, 1.0572252],
];

export const xyzD65ToLrgb: ColorFn<'xyz65', 'lrgb'> = (input) => {
  return multiplyMatrixVector(M_SRGB_INV, input) as ColorSpace<'lrgb'>;
};

export const lrgbToXyzD65: ColorFn<'lrgb', 'xyz65'> = (input) => {
  return multiplyMatrixVector(M_SRGB, input) as ColorSpace<'xyz65'>;
};
