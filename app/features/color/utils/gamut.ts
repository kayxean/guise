import type { Color, ColorSpace } from '../types';
import { createMatrix } from '../shared';

const CLAMP_BOUNDS: Partial<Record<ColorSpace, number[]>> = {
  rgb: [0, 1, 0, 1, 0, 1],
  lrgb: [0, 1, 0, 1, 0, 1],
  hsl: [0, 360, 0, 1, 0, 1],
  hwb: [0, 360, 0, 1, 0, 1],
  lab: [0, 100, -128, 128, -128, 128],
  lch: [0, 100, 0, 150, 0, 360],
  oklab: [0, 1, -0.4, 0.4, -0.4, 0.4],
  oklch: [0, 1, 0, 0.4, 0, 360],
  xyz50: [0, 1, 0, 1, 0, 1],
  xyz65: [0, 1, 0, 1, 0, 1],
};

export function clampColor<S extends ColorSpace>(
  color: Color<S>,
  mutate = true,
): Color<S> {
  const { value, space, alpha = 1 } = color;
  const bounds = CLAMP_BOUNDS[space];

  if (!bounds) return mutate ? color : { ...color, alpha };

  const resValue = mutate ? value : createMatrix(space);

  for (let i = 0; i < 3; i++) {
    const min = bounds[i * 2];
    const max = bounds[i * 2 + 1];
    let val = value[i];

    if (max === 360) {
      val = val % 360;
      if (val < 0) val += 360;
    } else {
      if (val < min) val = min;
      else if (val > max) val = max;
    }
    resValue[i] = val;
  }

  if (mutate) return color;

  return {
    space,
    value: resValue,
    alpha,
  };
}

export function checkGamut(color: Color, tolerance = 0.0001): boolean {
  const { value, space } = color;
  const bounds = CLAMP_BOUNDS[space];

  if (!bounds) return true;

  for (let i = 0; i < 3; i++) {
    const min = bounds[i * 2];
    const max = bounds[i * 2 + 1];

    if (max === 360) continue;

    const val = value[i];
    if (val < min - tolerance || val > max + tolerance) {
      return false;
    }
  }

  return true;
}
