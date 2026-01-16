import type { ColorMode, ColorSpace } from './core/types';
import { xyz50ToXyz65, xyz65ToXyz50 } from './adapters/cat';
import { lrgbToXyz65, xyz65ToLrgb } from './adapters/d65';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { hsvToRgb, rgbToHsv } from './adapters/srgb';
import { FROM_HUB, NATIVE_HUB, TO_HUB } from './core/convert';

export interface PickerValue {
  h: number;
  s: number;
  v: number;
  a: number;
}

export const toPickerValue = <T extends ColorMode>(
  color: ColorSpace<T>,
  mode: T,
  alpha = 1,
): PickerValue => {
  const hub = TO_HUB[mode](color);

  const xyz65 =
    NATIVE_HUB[mode] === 'xyz50'
      ? xyz50ToXyz65(hub as ColorSpace<'xyz50'>)
      : (hub as ColorSpace<'xyz65'>);

  const [h, s, v] = rgbToHsv(lrgbToRgb(xyz65ToLrgb(xyz65)));

  return { h, s, v, a: alpha };
};

export const fromPickerValue = <T extends ColorMode>(
  picker: PickerValue,
  mode: T,
): ColorSpace<T> => {
  const srgb = hsvToRgb([picker.h, picker.s, picker.v] as ColorSpace<'hsv'>);

  const lrgb = rgbToLrgb(srgb);
  const hub65 = lrgbToXyz65(lrgb);

  const targetHub = NATIVE_HUB[mode];
  const finalHub = targetHub === 'xyz50' ? xyz65ToXyz50(hub65) : hub65;

  return FROM_HUB[mode](finalHub) as ColorSpace<T>;
};
