import type { Color } from './types';

const F_FACTORS = new Float32Array([1, 10, 100, 1000, 10000, 100000, 1000000]);

function roundTo(val: number, precision: number): number {
  const f =
    precision < F_FACTORS.length ? F_FACTORS[precision] : 10 ** precision;
  return Math.round(val * f) / f;
}

function toHex(r: number, g: number, b: number, a?: number): string {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  const padding = '000000'.slice(0, 6 - hex.length);

  if (a !== undefined && a < 255) {
    const alphaHex = a.toString(16);
    const alphaPadding = alphaHex.length === 1 ? '0' : '';
    return `#${padding}${hex}${alphaPadding}${alphaHex}`;
  }
  return `#${padding}${hex}`;
}

export function formatCss(
  color: Color,
  asHex?: boolean,
  precision = 2,
): string {
  const { space, value, alpha } = color;

  if (asHex && (space === 'rgb' || space === 'lrgb')) {
    const r = (value[0] * 255 + 0.5) | 0;
    const g = (value[1] * 255 + 0.5) | 0;
    const b = (value[2] * 255 + 0.5) | 0;
    const a = alpha !== undefined ? (alpha * 255 + 0.5) | 0 : undefined;
    return toHex(r, g, b, a);
  }

  const hasAlpha = alpha !== undefined && alpha < 1;
  const suffix = hasAlpha ? ` / ${roundTo(alpha, precision)}` : '';

  switch (space) {
    case 'rgb': {
      const r = (value[0] * 255 + 0.5) | 0;
      const g = (value[1] * 255 + 0.5) | 0;
      const b = (value[2] * 255 + 0.5) | 0;
      return `rgb(${r} ${g} ${b}${suffix})`;
    }

    case 'hsl':
    case 'hwb': {
      const h = roundTo(value[0], precision);
      const s = roundTo(value[1] * 100, precision);
      const b = roundTo(value[2] * 100, precision);
      return `${space}(${h}deg ${s}% ${b}%${suffix})`;
    }

    case 'lab':
    case 'oklab': {
      const isOk = space === 'oklab';
      const l = roundTo(isOk ? value[0] * 100 : value[0], precision);
      const a = roundTo(value[1], precision);
      const b = roundTo(value[2], precision);
      return `${space}(${l}% ${a} ${b}${suffix})`;
    }

    case 'lch':
    case 'oklch': {
      const isOk = space === 'oklch';
      const l = roundTo(isOk ? value[0] * 100 : value[0], precision);
      const c = roundTo(value[1], precision);
      const h = roundTo(value[2], precision);
      return `${space}(${l}% ${c} ${h}deg${suffix})`;
    }

    case 'lrgb':
    case 'xyz65':
    case 'xyz50': {
      const name =
        space === 'lrgb'
          ? 'srgb-linear'
          : space === 'xyz65'
            ? 'xyz-d65'
            : 'xyz-d50';
      return `color(${name} ${roundTo(value[0], precision)} ${roundTo(value[1], precision)} ${roundTo(value[2], precision)}${suffix})`;
    }

    default:
      return `color(${space} ${roundTo(value[0], precision)} ${roundTo(value[1], precision)} ${roundTo(value[2], precision)}${suffix})`;
  }
}
