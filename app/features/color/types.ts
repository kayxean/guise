type ColorKind = 'rgb' | 'hsl' | 'hsv' | 'hwb' | 'lab' | 'lch' | 'lrgb' | 'oklab' | 'oklch' | 'xyz50' | 'xyz65';

type ColorSpace<T extends ColorKind> = [number, number, number] & {
  readonly type: T;
};

type ColorMode = Exclude<ColorKind, 'hsv' | 'lrgb' | 'xyz50' | 'xyz65'>;

type ColorFormat<T extends ColorKind> = [T, number, number, number];

type ColorFn<T extends ColorKind, X extends Exclude<ColorKind, T>> = (input: ColorSpace<T>) => ColorSpace<X>;

export type { ColorKind, ColorSpace, ColorMode, ColorFormat, ColorFn };
