import type { ColorFn, ColorSpace } from '../types';

export const rgbToHsv: ColorFn<'rgb', 'hsv'> = (input) => {
  const R = input[0];
  const G = input[1];
  const B = input[2];

  const V = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const C = V - min;

  const S = V === 0 ? 0 : C / V;

  let H: number;
  if (C === 0) {
    H = 0;
  } else if (V === R) {
    H = (G - B) / C;
  } else if (V === G) {
    H = (B - R) / C + 2;
  } else {
    H = (R - G) / C + 4;
  }

  H *= 60;
  if (H < 0) {
    H += 360;
  }

  return [H, S, V] as ColorSpace<'hsv'>;
};

export const hsvToRgb: ColorFn<'hsv', 'rgb'> = (input) => {
  const H = input[0] / 60;
  const S = input[1];
  const V = input[2];

  if (S === 0) {
    return [V, V, V] as ColorSpace<'rgb'>;
  }

  const C = V * S;
  const X = C * (1 - Math.abs((H % 2) - 1));
  const m = V - C;

  let c: number, t: number, x: number;

  const f = Math.floor(H);

  if (f === 0 || f === 6) {
    [c, t, x] = [C, X, 0];
  } else if (f === 1) {
    [c, t, x] = [X, C, 0];
  } else if (f === 2) {
    [c, t, x] = [0, C, X];
  } else if (f === 3) {
    [c, t, x] = [0, X, C];
  } else if (f === 4) {
    [c, t, x] = [X, 0, C];
  } else {
    [c, t, x] = [C, 0, X];
  }

  const R = c + m;
  const G = t + m;
  const B = x + m;

  return [R, G, B] as ColorSpace<'rgb'>;
};
