import type { Color, ColorArray } from '../types';
import { convertColor } from '../convert';
import { createMatrix, dropMatrix } from '../shared';

export function isEqual(a: Color, b: Color, tolerance = 0.0001): boolean {
  if (a === b) return true;

  const alphaA = a.alpha ?? 1;
  const alphaB = b.alpha ?? 1;
  if (Math.abs(alphaA - alphaB) > tolerance) return false;

  const spaceA = a.space;
  const spaceB = b.space;
  const valA = a.value;

  if (spaceA === spaceB) {
    const valB = b.value;
    return (
      Math.abs(valA[0] - valB[0]) <= tolerance &&
      Math.abs(valA[1] - valB[1]) <= tolerance &&
      Math.abs(valA[2] - valB[2]) <= tolerance
    );
  }

  const tempMatrix = createMatrix(spaceA);
  convertColor(b.value, tempMatrix, spaceB, spaceA);

  const match =
    Math.abs(valA[0] - tempMatrix[0]) <= tolerance &&
    Math.abs(valA[1] - tempMatrix[1]) <= tolerance &&
    Math.abs(valA[2] - tempMatrix[2]) <= tolerance;

  dropMatrix(tempMatrix);
  return match;
}

export function getDistance(a: Color, b: Color): number {
  const spaceA = a.space;
  const spaceB = b.space;

  let matrixA: ColorArray = a.value;
  let matrixB: ColorArray = b.value;

  const tempA = spaceA !== 'oklab' ? createMatrix('oklab') : null;
  const tempB = spaceB !== 'oklab' ? createMatrix('oklab') : null;

  if (tempA) {
    convertColor(a.value, tempA, spaceA, 'oklab');
    matrixA = tempA;
  }

  if (tempB) {
    convertColor(b.value, tempB, spaceB, 'oklab');
    matrixB = tempB;
  }

  const dL = matrixA[0] - matrixB[0];
  const da = matrixA[1] - matrixB[1];
  const db = matrixA[2] - matrixB[2];

  const distance = Math.sqrt(dL * dL + da * da + db * db);

  if (tempA) dropMatrix(tempA);
  if (tempB) dropMatrix(tempB);

  return distance;
}
