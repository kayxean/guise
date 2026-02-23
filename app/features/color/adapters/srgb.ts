import type { ColorArray } from '../types';

const INV_255 = 1 / 255;
const INV_60 = 1 / 60;

export function rgbToHsv(input: ColorArray, output: ColorArray): void {
  const r = input[0],
    g = input[1],
    b = input[2];
  const v = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = v - min;

  let h = 0;
  let s = 0;

  if (v !== 0) {
    s = c / v;
  }

  if (c !== 0) {
    const invC = 1 / c;
    if (v === r) h = (g - b) * invC;
    else if (v === g) h = (b - r) * invC + 2;
    else h = (r - g) * invC + 4;

    h *= 60;
    if (h < 0) h += 360;
  }

  output[0] = h;
  output[1] = s;
  output[2] = v;
}

export function hsvToRgb(input: ColorArray, output: ColorArray): void {
  const h60 = input[0] * INV_60;
  const s = input[1],
    v = input[2];

  if (s === 0) {
    output[0] = output[1] = output[2] = v;
    return;
  }

  const c = v * s;
  const x = c * (1 - Math.abs((h60 % 2) - 1));
  const m = v - c;
  const f = Math.floor(h60) % 6;

  let r = 0,
    g = 0,
    b = 0;

  if (f === 0) {
    r = c;
    g = x;
  } else if (f === 1) {
    r = x;
    g = c;
  } else if (f === 2) {
    g = c;
    b = x;
  } else if (f === 3) {
    g = x;
    b = c;
  } else if (f === 4) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  output[0] = r + m;
  output[1] = g + m;
  output[2] = b + m;
}

export function hsvToHsl(input: ColorArray, output: ColorArray): void {
  const h = input[0],
    s = input[1],
    v = input[2];
  const l = v * (1 - s * 0.5);
  let sL = 0;
  if (l > 0 && l < 1) {
    sL = (v - l) / Math.min(l, 1 - l);
  }
  output[0] = h;
  output[1] = sL;
  output[2] = l;
}

export function hslToHsv(input: ColorArray, output: ColorArray): void {
  const h = input[0],
    s = input[1],
    l = input[2];
  const v = l + s * Math.min(l, 1 - l);
  const sV = v === 0 ? 0 : 2 * (1 - l / v);
  output[0] = h;
  output[1] = sV;
  output[2] = v;
}

export function hsvToHwb(input: ColorArray, output: ColorArray): void {
  const h = input[0],
    s = input[1],
    v = input[2];
  output[0] = h;
  output[1] = v * (1 - s);
  output[2] = 1 - v;
}

export function hwbToHsv(input: ColorArray, output: ColorArray): void {
  const h = input[0],
    w = input[1],
    b = input[2];
  const v = 1 - b;
  const s = v === 0 ? 0 : (v - w) / v;
  output[0] = h;
  output[1] = s < 0 ? 0 : s;
  output[2] = v;
}

export function rgbToHex(input: ColorArray, denote = false): string {
  const r = (input[0] * 255 + 0.5) | 0;
  const g = (input[1] * 255 + 0.5) | 0;
  const b = (input[2] * 255 + 0.5) | 0;

  const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return denote ? `#${hex}` : hex;
}

export function hexToRgb(input: string, output: ColorArray): void {
  const clean = input.startsWith('#') ? input.slice(1) : input;
  let num: number;

  if (clean.length === 3) {
    const r = clean[0],
      g = clean[1],
      b = clean[2];
    num = parseInt(r + r + g + g + b + b, 16);
  } else {
    num = parseInt(clean, 16);
  }

  output[0] = ((num >> 16) & 255) * INV_255;
  output[1] = ((num >> 8) & 255) * INV_255;
  output[2] = (num & 255) * INV_255;
}
