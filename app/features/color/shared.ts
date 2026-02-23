import type { Color, ColorArray, ColorMatrix, ColorSpace } from './types';
import { convertColor } from './convert';

const MAX_POOL_SIZE = 256;
const pool: ColorArray[] = [];

export function createMatrix<S extends ColorSpace>(_space?: S): ColorMatrix<S> {
  const arr = pool.pop() ?? new Float32Array(3);
  return arr as ColorMatrix<S>;
}

export function dropMatrix(arr: ColorArray): void {
  if (pool.length < MAX_POOL_SIZE) {
    pool.push(arr);
  }
}

export function createColor<S extends ColorSpace>(
  space: S,
  values: [number, number, number] | Float32Array | ColorArray,
  alpha = 1,
): Color<S> {
  const value = createMatrix(space);
  value.set(values);
  return { space, value, alpha };
}

export function dropColor(color: Color): void {
  dropMatrix(color.value);
}

export function cloneColor<S extends ColorSpace>(color: Color<S>): Color<S> {
  const copy = createMatrix(color.space);
  copy.set(color.value);
  return {
    space: color.space,
    value: copy,
    alpha: color.alpha,
  };
}

export function mutateColor<S extends ColorSpace>(color: Color, to: S): void {
  const from = color.space;
  if (from === (to as ColorSpace)) return;

  convertColor(color.value, color.value, from, to);

  (color as { space: ColorSpace }).space = to;
}

export function deriveColor<S extends ColorSpace>(
  color: Color,
  to: S,
): Color<S> {
  if (color.space === (to as ColorSpace)) {
    return cloneColor(color as Color<S>);
  }

  const newValue = createMatrix(to);
  convertColor(color.value, newValue, color.space, to);

  return {
    space: to,
    value: newValue,
    alpha: color.alpha,
  };
}

export function preallocatePool(size: number): void {
  const count = Math.min(size, MAX_POOL_SIZE - pool.length);
  for (let i = 0; i < count; i++) {
    pool.push(new Float32Array(3) as ColorArray);
  }
}

export function clearPool(): void {
  pool.length = 0;
}
