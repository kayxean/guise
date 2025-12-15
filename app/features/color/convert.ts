import type { ColorFn, ColorFormat, ColorMode, ColorSpace } from './types';
import { hslToHsv, hsvToHsl } from './mode/hsl';
import { hsvToRgb, rgbToHsv } from './mode/hsv';
import { hsvToHwb, hwbToHsv } from './mode/hwb';
import { labToXyz50, xyz50ToLab } from './mode/lab';
import { labToLch, lchToLab } from './mode/lch';
import { lrgbToRgb, rgbToLrgb } from './mode/lrgb';
import { lrgbToOklab, oklabToLrgb } from './mode/oklab';
import { oklabToOklch, oklchToOklab } from './mode/oklch';
import { lrgbToXyz50, xyz50ToLrgb } from './mode/xyz50';
import { lrgbToXyz65, xyz50ToXyz65, xyz65ToLrgb, xyz65ToXyz50 } from './mode/xyz65';

const compose = <T extends ColorMode, R extends ColorMode>(
  converter: Array<(input: ColorSpace<any>) => ColorSpace<any>>,
): ((input: ColorSpace<T>) => ColorSpace<R>) => {
  return (input: ColorSpace<T>) => converter.reduce((acc, fn) => fn(acc), input) as ColorSpace<R>;
};

const rgbToHsl = compose<'rgb', 'hsl'>([rgbToHsv, hsvToHsl]);
const rgbToHwb = compose<'rgb', 'hwb'>([rgbToHsv, hsvToHwb]);
const rgbToLab = compose<'rgb', 'lab'>([rgbToLrgb, lrgbToXyz50, xyz50ToLab]);
const rgbToLch = compose<'rgb', 'lch'>([rgbToLrgb, lrgbToXyz50, xyz50ToLab, labToLch]);
const rgbToOklab = compose<'rgb', 'oklab'>([rgbToLrgb, lrgbToOklab]);
const rgbToOklch = compose<'rgb', 'oklch'>([rgbToLrgb, lrgbToOklab, oklabToOklch]);

const hslToRgb = compose<'hsl', 'rgb'>([hslToHsv, hsvToRgb]);
const hslToHwb = compose<'hsl', 'hwb'>([hslToHsv, hsvToHwb]);
const hslToLab = compose<'hsl', 'lab'>([hslToRgb, rgbToLab]);
const hslToLch = compose<'hsl', 'lch'>([hslToRgb, rgbToLch]);
const hslToOklab = compose<'hsl', 'oklab'>([hslToRgb, rgbToOklab]);
const hslToOklch = compose<'hsl', 'oklch'>([hslToRgb, rgbToOklch]);

const hwbToRgb = compose<'hwb', 'rgb'>([hwbToHsv, hsvToRgb]);
const hwbToHsl = compose<'hwb', 'hsl'>([hwbToHsv, hsvToHsl]);
const hwbToLab = compose<'hwb', 'lab'>([hwbToRgb, rgbToLab]);
const hwbToLch = compose<'hwb', 'lch'>([hwbToRgb, rgbToLch]);
const hwbToOklab = compose<'hwb', 'oklab'>([hwbToRgb, rgbToOklab]);
const hwbToOklch = compose<'hwb', 'oklch'>([hwbToRgb, rgbToOklch]);

const labToRgb = compose<'lab', 'rgb'>([labToXyz50, xyz50ToLrgb, lrgbToRgb]);
const labToHsl = compose<'lab', 'hsl'>([labToRgb, rgbToHsl]);
const labToHwb = compose<'lab', 'hwb'>([labToRgb, rgbToHwb]);
const labToOklab = compose<'lab', 'oklab'>([labToXyz50, xyz65ToLrgb, xyz50ToXyz65, lrgbToOklab]);
const labToOklch = compose<'lab', 'oklch'>([labToOklab, oklabToOklch]);

const lchToRgb = compose<'lch', 'rgb'>([lchToLab, labToRgb]);
const lchToHsl = compose<'lch', 'hsl'>([lchToLab, labToHsl]);
const lchToHwb = compose<'lch', 'hwb'>([lchToLab, labToHwb]);
const lchToOklab = compose<'lch', 'oklab'>([lchToLab, labToOklab]);
const lchToOklch = compose<'lch', 'oklch'>([lchToLab, labToOklch]);

const oklabToRgb = compose<'oklab', 'rgb'>([oklabToLrgb, lrgbToRgb]);
const oklabToHsl = compose<'oklab', 'hsl'>([oklabToRgb, rgbToHsl]);
const oklabToHwb = compose<'oklab', 'hwb'>([oklabToRgb, rgbToHwb]);
const oklabToLab = compose<'oklab', 'lab'>([oklabToLrgb, lrgbToXyz65, xyz65ToXyz50, xyz50ToLab]);
const oklabToLch = compose<'oklab', 'lch'>([oklabToLab, labToLch]);

const oklchToRgb = compose<'oklch', 'rgb'>([oklchToOklab, oklabToRgb]);
const oklchToHsl = compose<'oklch', 'hsl'>([oklchToOklab, oklabToHsl]);
const oklchToHwb = compose<'oklch', 'hwb'>([oklchToOklab, oklabToHwb]);
const oklchToLab = compose<'oklch', 'lab'>([oklchToOklab, oklabToLab]);
const oklchToLch = compose<'oklch', 'lch'>([oklchToOklab, oklabToLch]);

const converter: { [T in ColorMode]: { [X in Exclude<ColorMode, T>]: ColorFn<T, X> } } = {
  rgb: {
    hsl: rgbToHsl,
    hwb: rgbToHwb,
    lab: rgbToLab,
    lch: rgbToLch,
    oklab: rgbToOklab,
    oklch: rgbToOklch,
  },
  hsl: {
    rgb: hslToRgb,
    hwb: hslToHwb,
    lab: hslToLab,
    lch: hslToLch,
    oklab: hslToOklab,
    oklch: hslToOklch,
  },
  hwb: {
    rgb: hwbToRgb,
    hsl: hwbToHsl,
    lab: hwbToLab,
    lch: hwbToLch,
    oklab: hwbToOklab,
    oklch: hwbToOklch,
  },
  lab: {
    rgb: labToRgb,
    hsl: labToHsl,
    hwb: labToHwb,
    lch: labToLch,
    oklab: labToOklab,
    oklch: labToOklch,
  },
  lch: {
    rgb: lchToRgb,
    hsl: lchToHsl,
    hwb: lchToHwb,
    lab: lchToLab,
    oklab: lchToOklab,
    oklch: lchToOklch,
  },
  oklab: {
    rgb: oklabToRgb,
    hsl: oklabToHsl,
    hwb: oklabToHwb,
    lab: oklabToLab,
    lch: oklabToLch,
    oklch: oklabToOklch,
  },
  oklch: {
    rgb: oklchToRgb,
    hsl: oklchToHsl,
    hwb: oklchToHwb,
    lab: oklchToLab,
    lch: oklchToLch,
    oklab: oklchToOklab,
  },
};

const convertColor = <T extends ColorMode, X extends Exclude<ColorMode, T>>(
  input: ColorFormat<T>,
  output: X,
): ColorFormat<X> => {
  const [mode, ...value] = input;
  const color = converter[mode][output];

  return [output, ...color(value as ColorSpace<T>)] as ColorFormat<X>;
};

const convertHue = <T extends ColorMode>(input: ColorFormat<T>): ColorFormat<'hsl' | 'hwb' | 'lch' | 'oklch'> => {
  const [mode, ...value] = input;
  let output: ColorFormat<'hsl' | 'hwb' | 'lch' | 'oklch'>;

  if (mode === 'rgb') {
    output = ['hsl', ...rgbToHsl(value as ColorSpace<'rgb'>)] as ColorFormat<'hsl'>;
  } else if (mode === 'lab') {
    output = ['lch', ...labToLch(value as ColorSpace<'lab'>)] as ColorFormat<'lch'>;
  } else if (mode === 'oklab') {
    output = ['oklch', ...oklabToOklch(value as ColorSpace<'oklab'>)] as ColorFormat<'oklch'>;
  } else {
    output = input as ColorFormat<'hsl' | 'hwb' | 'lch' | 'oklch'>;
  }

  return output;
};

export { converter, convertColor, convertHue };
