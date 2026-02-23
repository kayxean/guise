import type { Color, ColorSpace } from '../types';
import { convertColor } from '../convert';
import { createMatrix, dropMatrix } from '../shared';
import { createScales } from './palette';

const APCA_SCALE = 1.14;
const DARK_THRESH = 0.022;
const DARK_CLAMP = 1414 / 1000;

export function getLuminanceD65(color: Color): number {
  const xyz = createMatrix('xyz65');
  convertColor(color.value, xyz, color.space, 'xyz65');
  const y = xyz[1];
  dropMatrix(xyz);
  return y;
}

function getSapcV(y: number): number {
  return y > DARK_THRESH ? y : y + (DARK_THRESH - y) ** DARK_CLAMP;
}

function calculateLc(v_t: number, v_b: number): number {
  return v_b > v_t
    ? (v_b ** 0.56 - v_t ** 0.57) * APCA_SCALE
    : (v_b ** 0.65 - v_t ** 0.62) * APCA_SCALE;
}

export function checkContrast(text: Color, background: Color): number {
  const vt = getSapcV(getLuminanceD65(text));
  const vb = getSapcV(getLuminanceD65(background));
  const Lc = calculateLc(vt, vb);

  const res = Math.abs(Lc) < 0.001 ? 0 : Lc * 100;
  return Math.round(res * 100) / 100;
}

export function getContrastRating(contrast: number): string {
  const rate = Math.abs(contrast);
  if (rate >= 90) return 'platinum';
  if (rate >= 75) return 'gold';
  if (rate >= 60) return 'silver';
  if (rate >= 45) return 'bronze';
  if (rate >= 30) return 'ui';
  return 'fail';
}

export function matchContrast<S extends ColorSpace>(
  color: Color<S>,
  background: Color,
  targetContrast: number,
): Color<S> {
  const yb = getLuminanceD65(background);
  const vb = getSapcV(yb);
  const isDarkBg = yb < 0.5;

  const oklchMat = createMatrix('oklch');
  convertColor(color.value, oklchMat, color.space, 'oklch');

  const chroma = oklchMat[1];
  const hue = oklchMat[2];

  let low = isDarkBg ? oklchMat[0] : 0;
  let high = isDarkBg ? 1 : oklchMat[0];
  let bestL = oklchMat[0];

  const testMat = createMatrix('oklch');
  testMat[1] = chroma;
  testMat[2] = hue;

  const testCol: Color<'oklch'> = { space: 'oklch', value: testMat };

  for (let i = 0; i < 12; i++) {
    testMat[0] = (low + high) * 0.5;
    const vt = getSapcV(getLuminanceD65(testCol));
    const Lc = calculateLc(vt, vb);

    if (Math.abs(Lc * 100) < targetContrast) {
      if (isDarkBg) low = testMat[0];
      else high = testMat[0];
    } else {
      bestL = testMat[0];
      if (isDarkBg) high = testMat[0];
      else low = testMat[0];
    }
  }

  const resValue = createMatrix(color.space);
  testMat[0] = bestL;
  convertColor(testMat, resValue, 'oklch', color.space);

  dropMatrix(oklchMat);
  dropMatrix(testMat);

  return { space: color.space, value: resValue, alpha: color.alpha };
}

export function checkContrastBulk(
  background: Color,
  colors: Color[],
): { color: Color; contrast: number; rating: string }[] {
  const vb = getSapcV(getLuminanceD65(background));

  return colors.map((color) => {
    const vt = getSapcV(getLuminanceD65(color));
    const Lc = calculateLc(vt, vb);
    const contrast = Math.abs(Lc) < 0.001 ? 0 : Math.round(Lc * 10000) / 100;

    return {
      color,
      contrast,
      rating: getContrastRating(contrast),
    };
  });
}

export function matchScales<S extends ColorSpace>(
  stops: Color<S>[],
  background: Color,
  targetContrast: number,
  steps: number,
): Color<S>[] {
  const scale = createScales(stops, steps);
  return scale.map((s) => matchContrast(s, background, targetContrast));
}
