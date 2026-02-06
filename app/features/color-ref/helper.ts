import type { ColorBuffer, ColorSpace } from './types';
import { xyz50ToXyz65, xyz65ToXyz50 } from './adapters/cat';
import { lrgbToXyz65, xyz65ToLrgb } from './adapters/d65';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { hsvToRgb, rgbToHsv } from './adapters/srgb';
import { applyAdapter, FROM_HUB, NATIVE_HUB, TO_HUB } from './convert';
import { createBuffer } from './shared';

export interface PickerValue {
  h: number;
  s: number;
  v: number;
  a: number;
}

const PICK_FROM_SCRATCH = createBuffer(new Float32Array(3));
const PICK_TO_SCRATCH = createBuffer(new Float32Array(3));

export function toPickerValue(color: ColorBuffer, mode: ColorSpace, alpha = 1) {
  applyAdapter(TO_HUB[mode], color, PICK_FROM_SCRATCH);

  if (NATIVE_HUB[mode] === 'xyz50') {
    xyz50ToXyz65(PICK_FROM_SCRATCH, PICK_FROM_SCRATCH);
  }

  applyAdapter(
    [xyz65ToLrgb, lrgbToRgb, rgbToHsv],
    PICK_FROM_SCRATCH,
    PICK_FROM_SCRATCH,
  );

  const h = PICK_FROM_SCRATCH[0];
  const s = PICK_FROM_SCRATCH[1];
  const v = PICK_FROM_SCRATCH[2];

  return { h, s, v, a: alpha };
}

export function fromPickerValue(color: PickerValue, mode: ColorSpace) {
  const hub65 = createBuffer([color.h, color.s, color.v]);

  applyAdapter([hsvToRgb, rgbToLrgb, lrgbToXyz65], hub65, PICK_TO_SCRATCH);

  if (NATIVE_HUB[mode] === 'xyz50') {
    xyz65ToXyz50(PICK_TO_SCRATCH, PICK_TO_SCRATCH);
  }

  applyAdapter(FROM_HUB[mode], PICK_TO_SCRATCH, PICK_TO_SCRATCH);

  return PICK_TO_SCRATCH;
}
