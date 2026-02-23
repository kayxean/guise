import type { Color, ColorSpace } from '../types';
import { convertColor } from '../convert';
import { createMatrix, dropMatrix } from '../shared';

export function createHarmony<S extends ColorSpace>(
  input: Color<S>,
  variants: { name: string; ratios: number[] }[],
): { name: string; colors: Color<S>[] }[] {
  const { space, value, alpha = 1 } = input;

  let polarSpace: ColorSpace;
  let hIdx: number;

  if (space === 'oklch' || space === 'oklab') {
    polarSpace = 'oklch';
    hIdx = 2;
  } else if (space === 'lch' || space === 'lab') {
    polarSpace = 'lch';
    hIdx = 2;
  } else {
    polarSpace = 'hsl';
    hIdx = 0;
  }

  const polarMat = createMatrix(polarSpace);
  convertColor(value, polarMat, space, polarSpace);

  const baseH = polarMat[hIdx];
  const results: { name: string; colors: Color<S>[] }[] = [];

  for (let i = 0; i < variants.length; i++) {
    const { name, ratios } = variants[i];
    const colors: Color<S>[] = [];

    for (let j = 0; j < ratios.length; j++) {
      let h = (baseH + ratios[j]) % 360;
      if (h < 0) h += 360;

      const newMat = createMatrix(space);
      const originalH = polarMat[hIdx];

      polarMat[hIdx] = h;
      convertColor(polarMat, newMat, polarSpace, space);
      polarMat[hIdx] = originalH;

      colors.push({ space, value: newMat, alpha });
    }
    results.push({ name, colors });
  }

  dropMatrix(polarMat);
  return results;
}

export function mixColor<S extends ColorSpace>(
  start: Color<S>,
  end: Color<S>,
  t: number,
): Color<S> {
  const space = start.space;
  const w = t < 0 ? 0 : t > 1 ? 1 : t;

  const hIdx =
    space === 'hsl' || space === 'hwb'
      ? 0
      : space === 'lch' || space === 'oklch'
        ? 2
        : -1;

  const sV = start.value;
  const eV = end.value;
  const res = createMatrix(space);

  for (let c = 0; c < 3; c++) {
    const startVal = sV[c];
    let endVal = eV[c];

    if (c === hIdx) {
      const diff = endVal - startVal;
      if (diff > 180) endVal -= 360;
      else if (diff < -180) endVal += 360;

      let h = startVal + (endVal - startVal) * w;
      h %= 360;
      if (h < 0) h += 360;
      res[c] = h;
    } else {
      res[c] = startVal + (endVal - startVal) * w;
    }
  }

  const sA = start.alpha ?? 1;
  const eA = end.alpha ?? 1;

  return { space, value: res, alpha: sA + (eA - sA) * w };
}

export function createShades<S extends ColorSpace>(
  start: Color<S>,
  end: Color<S>,
  steps: number,
): Color<S>[] {
  if (steps <= 0) return [];
  if (steps === 1) {
    const val = createMatrix(start.space);
    val.set(start.value);
    return [{ space: start.space, value: val, alpha: start.alpha }];
  }

  const shades: Color<S>[] = [];
  const invTotal = 1 / (steps - 1);

  for (let i = 0; i < steps; i++) {
    shades.push(mixColor(start, end, i * invTotal));
  }

  return shades;
}

export function createScales<S extends ColorSpace>(
  stops: Color<S>[],
  steps: number,
): Color<S>[] {
  if (steps <= 0) return [];
  if (stops.length < 2) {
    return stops.map((s) => {
      const val = createMatrix(s.space);
      val.set(s.value);
      return { space: s.space, value: val, alpha: s.alpha };
    });
  }

  const scale: Color<S>[] = [];
  const totalSegments = stops.length - 1;
  const stepInterval = 1 / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const segmentRaw = i * stepInterval * totalSegments;
    let idx = segmentRaw | 0;
    if (idx >= totalSegments) idx = totalSegments - 1;

    scale.push(mixColor(stops[idx], stops[idx + 1], segmentRaw - idx));
  }

  return scale;
}
