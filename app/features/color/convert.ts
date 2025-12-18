import type { ColorMode, ColorSpace } from './types';
import { xyz50ToXyz65, xyz65ToXyz50 } from './adapters/cat';
import { labToXyz50, xyz50ToLab } from './adapters/d50';
import { lrgbToXyz65, oklabToXyz65, xyz65ToLrgb, xyz65ToOklab } from './adapters/d65';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { labToLch, lchToLab, oklabToOklch, oklchToOklab } from './adapters/polar';
import { hslToHsv, hsvToHsl, hsvToHwb, hsvToRgb, hwbToHsv, rgbToHsv } from './adapters/srgb';

const NATIVE_HUB: Record<ColorMode, 'xyz50' | 'xyz65'> = {
  rgb: 'xyz65',
  hsl: 'xyz65',
  hwb: 'xyz65',
  oklab: 'xyz65',
  oklch: 'xyz65',
  lab: 'xyz50',
  lch: 'xyz50',
};

export const toHub = <T extends ColorMode>(input: ColorSpace<T>, mode: T): ColorSpace<'xyz50' | 'xyz65'> => {
  switch (mode) {
    case 'rgb':
      return lrgbToXyz65(rgbToLrgb(input as ColorSpace<'rgb'>));
    case 'hsl':
      return lrgbToXyz65(rgbToLrgb(hsvToRgb(hslToHsv(input as ColorSpace<'hsl'>))));
    case 'hwb':
      return lrgbToXyz65(rgbToLrgb(hsvToRgb(hwbToHsv(input as ColorSpace<'hwb'>))));
    case 'oklab':
      return oklabToXyz65(input as ColorSpace<'oklab'>);
    case 'oklch':
      return oklabToXyz65(oklchToOklab(input as ColorSpace<'oklch'>));
    case 'lab':
      return labToXyz50(input as ColorSpace<'lab'>);
    case 'lch':
      return labToXyz50(lchToLab(input as ColorSpace<'lch'>));
    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }
};

export const fromHub = <T extends ColorMode>(input: ColorSpace<'xyz50' | 'xyz65'>, mode: T): ColorSpace<T> => {
  switch (mode) {
    case 'rgb':
      return lrgbToRgb(xyz65ToLrgb(input as ColorSpace<'xyz65'>)) as ColorSpace<T>;
    case 'hsl':
      return hsvToHsl(rgbToHsv(lrgbToRgb(xyz65ToLrgb(input as ColorSpace<'xyz65'>)))) as ColorSpace<T>;
    case 'hwb':
      return hsvToHwb(rgbToHsv(lrgbToRgb(xyz65ToLrgb(input as ColorSpace<'xyz65'>)))) as ColorSpace<T>;
    case 'oklab':
      return xyz65ToOklab(input as ColorSpace<'xyz65'>) as ColorSpace<T>;
    case 'oklch':
      return oklabToOklch(xyz65ToOklab(input as ColorSpace<'xyz65'>)) as ColorSpace<T>;
    case 'lab':
      return xyz50ToLab(input as ColorSpace<'xyz50'>) as ColorSpace<T>;
    case 'lch':
      return labToLch(xyz50ToLab(input as ColorSpace<'xyz50'>)) as ColorSpace<T>;
    default:
      throw new Error(`Unsupported target mode: ${mode}`);
  }
};

export const convert = <T extends ColorMode, R extends Exclude<ColorMode, T>>(
  input: ColorSpace<T>,
  from: T,
  to: R,
): ColorSpace<R> => {
  if (from === 'rgb' && to === 'hsl') return hsvToHsl(rgbToHsv(input as ColorSpace<'rgb'>)) as ColorSpace<R>;
  if (from === 'rgb' && to === 'hwb') return hsvToHwb(rgbToHsv(input as ColorSpace<'rgb'>)) as ColorSpace<R>;
  if (from === 'hsl' && to === 'rgb') return hsvToRgb(hslToHsv(input as ColorSpace<'hsl'>)) as ColorSpace<R>;
  if (from === 'hwb' && to === 'rgb') return hsvToRgb(hwbToHsv(input as ColorSpace<'hwb'>)) as ColorSpace<R>;

  if (from === 'lab' && to === 'lch') return labToLch(input as ColorSpace<'lab'>) as ColorSpace<R>;
  if (from === 'lch' && to === 'lab') return lchToLab(input as ColorSpace<'lch'>) as ColorSpace<R>;

  if (from === 'oklab' && to === 'oklch') return oklabToOklch(input as ColorSpace<'oklab'>) as ColorSpace<R>;
  if (from === 'oklch' && to === 'oklab') return oklchToOklab(input as ColorSpace<'oklch'>) as ColorSpace<R>;

  let current: ColorSpace<'xyz50' | 'xyz65'> = toHub(input, from);

  const sourceHub = NATIVE_HUB[from];
  const targetHub = NATIVE_HUB[to];

  if (sourceHub === 'xyz65' && targetHub === 'xyz50') {
    current = xyz65ToXyz50(current as ColorSpace<'xyz65'>);
  } else if (sourceHub === 'xyz50' && targetHub === 'xyz65') {
    current = xyz50ToXyz65(current as ColorSpace<'xyz50'>);
  }

  return fromHub(current, to);
};
