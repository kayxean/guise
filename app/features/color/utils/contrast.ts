import type { ColorMode, ColorSpace } from '../core/types';
import { xyz50ToXyz65 } from '../adapters/cat';
import { convertColor, NATIVE_HUB, TO_HUB } from '../core/convert';
import { createScales } from './palette';

const APCA_SCALE = 1.14;
const DARK_THRESH = 0.022;
const DARK_CLAMP = 1414 / 1000;

export const getLuminanceD65 = <T extends ColorMode>(
  color: ColorSpace<T>,
  mode: T,
): number => {
  let xyz = TO_HUB[mode](color);

  if (NATIVE_HUB[mode] === 'xyz50') {
    xyz = xyz50ToXyz65(xyz as ColorSpace<'xyz50'>);
  }

  return xyz[1];
};

export const checkContrast = <T extends ColorMode>(
  text: ColorSpace<T>,
  background: ColorSpace<T>,
  mode: T,
): number => {
  const yt = getLuminanceD65(text, mode);
  const yb = getLuminanceD65(background, mode);

  const vt = yt > DARK_THRESH ? yt : yt + (DARK_THRESH - yt) ** DARK_CLAMP;
  const vb = yb > DARK_THRESH ? yb : yb + (DARK_THRESH - yb) ** DARK_CLAMP;

  let contrast = 0;

  if (vb > vt) {
    contrast = (vb ** 0.56 - vt ** 0.57) * APCA_SCALE;
  } else {
    contrast = (vb ** 0.65 - vt ** 0.62) * APCA_SCALE;
  }

  const res = Math.abs(contrast) < 0.1 ? 0 : contrast * 100;

  return Number(res.toFixed(2));
};

export const getContrastRating = (contrast: number): string => {
  const rate = Math.abs(contrast);

  if (rate >= 90) return 'platinum';
  if (rate >= 75) return 'gold';
  if (rate >= 60) return 'silver';
  if (rate >= 45) return 'bronze';
  if (rate >= 30) return 'ui';

  return 'fail';
};

export const checkContrastBulk = <T extends ColorMode>(
  background: ColorSpace<T>,
  colors: ColorSpace<T>[],
  mode: T,
): { color: ColorSpace<T>; contrast: number; rating: string }[] => {
  const interpolate: {
    color: ColorSpace<T>;
    contrast: number;
    rating: string;
  }[] = [];

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    const contrast = checkContrast(color, background, mode);
    const rating = getContrastRating(contrast);

    interpolate.push({ color, contrast, rating });
  }

  return interpolate;
};

export const matchContrast = <T extends ColorMode>(
  color: ColorSpace<T>,
  background: ColorSpace<T>,
  mode: T,
  targetContrast: number,
): ColorSpace<T> => {
  const currentContrast = checkContrast(color, background, mode);

  if (Math.abs(currentContrast) >= targetContrast) return color;

  const needsReversion = mode !== 'oklch';
  const polarValues = (
    needsReversion
      ? convertColor(color, mode, 'oklch' as Exclude<ColorMode, T>)
      : color
  ) as ColorSpace<'oklch'>;

  const lightness = polarValues[0];
  const chroma = polarValues[1];
  const hue = polarValues[2];

  const luminance = getLuminanceD65(background, mode);
  const isDark = luminance < 0.5;

  let low = isDark ? lightness : 0;
  let high = isDark ? 1 : lightness;
  let bestL = lightness;

  for (let i = 0; i < 10; i++) {
    const t = (low + high) / 2;
    const rotated = [t, chroma, hue] as ColorSpace<'oklch'>;

    const res = (
      needsReversion
        ? convertColor(rotated, 'oklch', mode as Exclude<ColorMode, 'oklch'>)
        : rotated
    ) as ColorSpace<T>;

    const testContrast = checkContrast(res, background, mode);

    if (Math.abs(testContrast) < targetContrast) {
      if (isDark) low = t;
      else high = t;
    } else {
      bestL = t;
      if (isDark) high = t;
      else low = t;
    }
  }

  const rotated = [bestL, chroma, hue] as ColorSpace<'oklch'>;

  if (needsReversion) {
    return convertColor(
      rotated,
      'oklch',
      mode as Exclude<ColorMode, 'oklch'>,
    ) as ColorSpace<T>;
  }

  return rotated as unknown as ColorSpace<T>;
};

export const matchScales = <T extends ColorMode>(
  stops: ColorSpace<T>[],
  background: ColorSpace<T>,
  mode: T,
  targetContrast: number,
  steps: number,
): ColorSpace<T>[] => {
  const scale = createScales(stops, mode, steps);
  const interpolate: ColorSpace<T>[] = [];

  for (let i = 0; i < scale.length; i++) {
    interpolate.push(matchContrast(scale[i], background, mode, targetContrast));
  }

  return interpolate;
};
