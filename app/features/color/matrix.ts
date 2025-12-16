import type { ColorMatrix, ColorValues } from './types';

export const multiplyMatrixVector = (matrix: ColorMatrix, vector: ColorValues): ColorValues => {
  const result: ColorValues = [0, 0, 0];

  for (let i = 0; i < 3; i++) {
    result[i] = matrix[i][0] * vector[0] + matrix[i][1] * vector[1] + matrix[i][2] * vector[2];
  }

  return result;
};

export const RAD_TO_DEG = 180 / Math.PI;
export const DEG_TO_RAD = Math.PI / 180;
