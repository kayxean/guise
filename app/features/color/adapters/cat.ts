import type { ColorArray } from '../types';

const M_CAT_65_TO_50 = new Float32Array([
  1.0478112, 0.0228866, -0.050127, 0.0295424, 0.9904844, -0.0170491, -0.0092345,
  0.0150436, 0.7521316,
]);

const M_CAT_50_TO_65 = new Float32Array([
  0.9555766, -0.0230393, 0.0631636, -0.0282895, 1.0099416, 0.0210077, 0.0122982,
  -0.020483, 1.3299098,
]);

export function multiplyMatrixVector(
  matrix: Float32Array,
  vector: ColorArray,
  output: ColorArray,
): void {
  const v0 = vector[0],
    v1 = vector[1],
    v2 = vector[2];

  output[0] = matrix[0] * v0 + matrix[1] * v1 + matrix[2] * v2;
  output[1] = matrix[3] * v0 + matrix[4] * v1 + matrix[5] * v2;
  output[2] = matrix[6] * v0 + matrix[7] * v1 + matrix[8] * v2;
}

export function xyz65ToXyz50(input: ColorArray, output: ColorArray): void {
  multiplyMatrixVector(M_CAT_65_TO_50, input, output);
}

export function xyz50ToXyz65(input: ColorArray, output: ColorArray): void {
  multiplyMatrixVector(M_CAT_50_TO_65, input, output);
}
