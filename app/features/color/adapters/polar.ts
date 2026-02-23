import type { ColorArray } from '../types';

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

function toPolar(input: ColorArray, output: ColorArray): void {
  const a = input[1];
  const b = input[2];

  const chroma = Math.sqrt(a * a + b * b);
  let hue = Math.atan2(b, a) * RAD_TO_DEG;

  if (hue < 0) hue += 360;

  output[0] = input[0];
  output[1] = chroma;
  output[2] = hue;
}

function toCartesian(input: ColorArray, output: ColorArray): void {
  const L = input[0];
  const C = input[1];
  const hRad = input[2] * DEG_TO_RAD;

  output[0] = L;
  output[1] = C * Math.cos(hRad);
  output[2] = C * Math.sin(hRad);
}

export const labToLch = toPolar;
export const oklabToOklch = toPolar;
export const lchToLab = toCartesian;
export const oklchToOklab = toCartesian;
