export type ColorSpace =
  | 'rgb'
  | 'hsl'
  | 'hsv'
  | 'hwb'
  | 'lab'
  | 'lch'
  | 'lrgb'
  | 'oklab'
  | 'oklch'
  | 'xyz50'
  | 'xyz65';

export type ColorArray = Float32Array & { readonly __length: 3 };

export type ColorMatrix<S extends ColorSpace = ColorSpace> = ColorArray & {
  readonly __space: S;
};

export type Color<S extends ColorSpace = ColorSpace> = {
  space: S;
  value: ColorMatrix<S>;
  alpha?: number;
};

export type ColorAdapter = (input: ColorArray, output: ColorArray) => void;

export type DeficiencyType =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';
