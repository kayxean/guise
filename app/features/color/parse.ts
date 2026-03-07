import type { Color, ColorSpace } from './types';
import { createColor } from './shared';

const INV_255 = 1 / 255;
const INV_100 = 1 / 100;

function parseHex(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const len = hex.length;

  if (len <= 4) {
    const n = Number.parseInt(hex, 16);
    const r = (len === 3 ? (n >> 8) & 0xf : (n >> 12) & 0xf) * 17;
    const g = (len === 3 ? (n >> 4) & 0xf : (n >> 8) & 0xf) * 17;
    const b = (len === 3 ? n & 0xf : (n >> 4) & 0xf) * 17;
    const a = len === 4 ? (n & 0xf) * 17 : 255;
    return { r, g, b, a };
  }

  const n = Number.parseInt(hex, 16) >>> 0;
  if (len === 6) {
    return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff, a: 255 };
  }
  return {
    r: (n >> 24) & 0xff,
    g: (n >> 16) & 0xff,
    b: (n >> 8) & 0xff,
    a: n & 0xff,
  };
}

export function parseColor(css: string): Color {
  const trimmed = css.trim();

  if (trimmed[0] === '#') {
    const { r, g, b, a } = parseHex(trimmed.slice(1));
    const color = createColor('rgb', [r * INV_255, g * INV_255, b * INV_255]);
    color.alpha = a * INV_255;
    return color;
  }

  const openParen = trimmed.indexOf('(');
  if (openParen === -1) throw new Error(`Invalid format: ${css}`);

  const closeParen = trimmed.lastIndexOf(')');
  let spaceName = trimmed.slice(0, openParen).toLowerCase();
  const content = trimmed.slice(openParen + 1, closeParen);

  const parts = content.split(/[\s,/]+/).filter(Boolean);

  let space: ColorSpace;
  let offset = 0;

  if (spaceName === 'color') {
    const profile = parts[0];
    offset = 1;
    if (profile === 'srgb-linear') space = 'lrgb';
    else if (profile === 'xyz' || profile === 'xyz-d65') space = 'xyz65';
    else if (profile === 'xyz-d50') space = 'xyz50';
    else space = profile as ColorSpace;
  } else {
    if (spaceName.length > 3 && spaceName.endsWith('a')) {
      spaceName = spaceName.slice(0, -1);
    }
    space = spaceName as ColorSpace;
  }

  let v0 = Number.parseFloat(parts[offset]);
  let v1 = Number.parseFloat(parts[offset + 1]);
  let v2 = Number.parseFloat(parts[offset + 2]);
  const rawA = parts[offset + 3];

  if (space === 'rgb') {
    v0 *= INV_255;
    v1 *= INV_255;
    v2 *= INV_255;
  } else if (space === 'hsl' || space === 'hwb') {
    v1 *= INV_100;
    v2 *= INV_100;
  } else if (
    space === 'lab' ||
    space === 'lch' ||
    space === 'oklab' ||
    space === 'oklch'
  ) {
    v0 *= INV_100;
  }

  let alpha = 1;
  if (rawA !== undefined) {
    alpha = rawA.endsWith('%')
      ? Number.parseFloat(rawA) * INV_100
      : Number.parseFloat(rawA);
  }

  const color = createColor(space, [v0, v1, v2]);
  color.alpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
  return color;
}
