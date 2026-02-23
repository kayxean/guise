import type { Color, ColorSpace } from '../types';
import { convertColor } from '../convert';
import { createMatrix, dropMatrix } from '../shared';

export interface PickerValue {
  h: number;
  s: number;
  v: number;
  a: number;
}

export type PickerSubscriber = (val: PickerValue, color: Color) => void;

export function toPicker(color: Color): PickerValue {
  const hsv = createMatrix('hsv');
  convertColor(color.value, hsv, color.space, 'hsv');

  const res = {
    h: hsv[0],
    s: hsv[1],
    v: hsv[2],
    a: color.alpha ?? 1,
  };

  dropMatrix(hsv);
  return res;
}

export function fromPicker<S extends ColorSpace>(
  val: PickerValue,
  space: S,
): Color {
  const hsv = createMatrix('hsv');
  hsv.set([val.h, val.s, val.v]);

  const dest = createMatrix(space);
  convertColor(hsv, dest, 'hsv', space);

  dropMatrix(hsv);

  return {
    space,
    value: dest,
    alpha: val.a,
  };
}

export function createPicker(init: Color, target?: ColorSpace) {
  const val: PickerValue = toPicker(init);
  const space: ColorSpace = target ?? init.space;
  const subs = new Set<PickerSubscriber>();

  const notify = () => {
    const color = fromPicker(val, space);
    const snap = { ...val };

    for (const fn of subs) {
      fn(snap, color);
    }

    dropMatrix(color.value);
  };

  return {
    update: (x: number, y: number, type: 'sv' | 'h' | 'a') => {
      if (type === 'sv') {
        val.s = x;
        val.v = 1 - y;
      } else if (type === 'h') {
        val.h = x * 360;
      } else if (type === 'a') {
        val.a = x;
      }
      notify();
    },

    assign: (next: Color) => {
      const nextVal = toPicker(next);
      if (
        nextVal.h === val.h &&
        nextVal.s === val.s &&
        nextVal.v === val.v &&
        nextVal.a === val.a
      ) {
        return;
      }

      Object.assign(val, nextVal);
      notify();
    },

    subscribe: (fn: PickerSubscriber) => {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },

    getValue: () => ({ ...val }),
    getHue: () => val.h,
    getSaturation: () => val.s,
    getBrightness: () => val.v,
    getAlpha: () => val.a,

    getSolid: () => fromPicker({ ...val, a: 1 }, space),
    getColor: () => fromPicker(val, space),
  };
}
