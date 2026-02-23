import type { Color, ColorSpace } from './types';
import { createColor } from './shared';

const INV_255 = 1 / 255;
const INV_100 = 1 / 100;

function fastParseHex(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const len = hex.length;
  const num = Number.parseInt(hex, 16);

  if (len === 3) {
    return {
      r: ((num >> 8) & 0xf) * 17,
      g: ((num >> 4) & 0xf) * 17,
      b: (num & 0xf) * 17,
      a: 255,
    };
  }
  if (len === 4) {
    return {
      r: ((num >> 12) & 0xf) * 17,
      g: ((num >> 8) & 0xf) * 17,
      b: ((num >> 4) & 0xf) * 17,
      a: (num & 0xf) * 17,
    };
  }
  if (len === 6) {
    return {
      r: (num >> 16) & 0xff,
      g: (num >> 8) & 0xff,
      b: num & 0xff,
      a: 255,
    };
  }
  if (len === 8) {
    return {
      r: (num >> 24) & 0xff,
      g: (num >> 16) & 0xff,
      b: (num >> 8) & 0xff,
      a: num & 0xff,
    };
  }
  throw new Error(`Invalid Hex length: ${len}`);
}

export function parseColor(css: string): Color {
  const trimmed = css.trim();

  if (trimmed[0] === '#') {
    const hex = trimmed.slice(1);
    const { r, g, b, a } = fastParseHex(hex);
    return {
      ...createColor('rgb', [r * INV_255, g * INV_255, b * INV_255]),
      alpha: a * INV_255,
    };
  }

  const openParen = trimmed.indexOf('(');
  const closeParen = trimmed.lastIndexOf(')');

  if (openParen !== -1 && closeParen !== -1) {
    let spaceName = trimmed.slice(0, openParen).toLowerCase();
    const content = trimmed.slice(openParen + 1, closeParen);

    const parts = content.split(/[,\s/]+/).filter(Boolean);

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

    return {
      ...createColor(space, [v0, v1, v2]),
      alpha: Math.max(0, Math.min(1, alpha)),
    };
  }

  throw new Error(`Invalid format: ${css}`);
}
