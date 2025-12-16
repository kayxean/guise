import type { ColorFn, ColorSpace } from '../types';
import { DEG_TO_RAD, RAD_TO_DEG } from '../matrix';

export const lchToLab: ColorFn<'lch', 'lab'> = (input) => {
  const L = input[0];
  const c = input[1];
  const h = input[2];

  const d = h * DEG_TO_RAD;

  const A = c * Math.cos(d);
  const B = c * Math.sin(d);

  return [L, A, B] as ColorSpace<'lab'>;
};

export const labToLch: ColorFn<'lab', 'lch'> = (input) => {
  const L = input[0];
  const a = input[1];
  const b = input[2];

  const C = Math.sqrt(a * a + b * b);

  let H = Math.atan2(b, a) * RAD_TO_DEG;

  if (H < 0) {
    H += 360;
  }

  return [L, C, H] as ColorSpace<'lch'>;
};
