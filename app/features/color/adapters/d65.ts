import type { ColorArray } from '../types';
import { multiplyMatrixVector } from './cat';

const M_SRGB = new Float32Array([
  0.4124564, 0.3575761, 0.1804375, 0.2126729, 0.7151522, 0.072175, 0.0193339,
  0.119192, 0.9503041,
]);

const M_SRGB_INV = new Float32Array([
  3.2404542, -1.5371385, -0.4985314, -0.969266, 1.876, 0.041556, 0.0556434,
  -0.2040259, 1.0572252,
]);

export function xyz65ToLrgb(input: ColorArray, output: ColorArray): void {
  multiplyMatrixVector(M_SRGB_INV, input, output);
}

export function lrgbToXyz65(input: ColorArray, output: ColorArray): void {
  multiplyMatrixVector(M_SRGB, input, output);
}

export function xyz65ToOklab(input: ColorArray, output: ColorArray): void {
  const x = input[0],
    y = input[1],
    z = input[2];

  const l_pre = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m_pre = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s_pre = 0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z;

  const l = Math.cbrt(l_pre);
  const m = Math.cbrt(m_pre);
  const s = Math.cbrt(s_pre);

  output[0] = 0.2104542553 * l + 0.7936177046 * m - 0.0040704681 * s;
  output[1] = 1.9779984951 * l - 2.4285921822 * m + 0.4505936871 * s;
  output[2] = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
}

export function oklabToXyz65(input: ColorArray, output: ColorArray): void {
  const L = input[0],
    a = input[1],
    b = input[2];

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  output[0] = 1.2270138511 * l3 - 0.5577999807 * m3 + 0.281256149 * s3;
  output[1] = -0.0405801784 * l3 + 1.1122568696 * m3 - 0.0716766787 * s3;
  output[2] = -0.0763812845 * l3 - 0.4214819784 * m3 + 1.5861632204 * s3;
}
