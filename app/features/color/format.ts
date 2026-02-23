import type { Color } from './types';

const F_FACTORS = new Float32Array([1, 10, 100, 1000, 10000, 100000, 1000000]);

function roundTo(val: number, precision: number): number {
  const f =
    precision < F_FACTORS.length ? F_FACTORS[precision] : 10 ** precision;
  return Math.round(val * f) / f;
}

export function formatCss(
  color: Color,
  alpha?: number,
  asHex?: boolean,
  precision = 2,
): string {
  const { space, value } = color;

  if (asHex && space === 'rgb') {
    const r = (value[0] * 255 + 0.5) | 0;
    const g = (value[1] * 255 + 0.5) | 0;
    const b = (value[2] * 255 + 0.5) | 0;
    const rgbHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

    if (alpha !== undefined && alpha < 1) {
      const a = (alpha * 255 + 0.5) | 0;
      return `#${rgbHex}${a.toString(16).padStart(2, '0')}`;
    }
    return `#${rgbHex}`;
  }

  const n1 = roundTo(value[0], precision);
  const n2 = roundTo(value[1], precision);
  const n3 = roundTo(value[2], precision);

  let suffix = '';
  if (alpha !== undefined && alpha < 1) {
    suffix = ` / ${roundTo(alpha, precision)}`;
  }

  switch (space) {
    case 'rgb': {
      const r = (value[0] * 255 + 0.5) | 0;
      const g = (value[1] * 255 + 0.5) | 0;
      const b = (value[2] * 255 + 0.5) | 0;
      return `rgb(${r} ${g} ${b}${suffix})`;
    }

    case 'hsl':
    case 'hwb': {
      const s = roundTo(value[1] * 100, precision);
      const b = roundTo(value[2] * 100, precision);
      return `${space}(${n1}deg ${s}% ${b}%${suffix})`;
    }

    case 'lab':
      return `lab(${roundTo(value[0] * 100, precision)}% ${n2} ${n3}${suffix})`;

    case 'lch':
      return `lch(${roundTo(value[0] * 100, precision)}% ${n2} ${n3}deg${suffix})`;

    case 'oklab': {
      const l = roundTo(value[0] * 100, precision);
      return `oklab(${l}% ${n2} ${n3}${suffix})`;
    }

    case 'oklch': {
      const l = roundTo(value[0] * 100, precision);
      return `oklch(${l}% ${n2} ${n3}deg${suffix})`;
    }

    case 'lrgb':
      return `color(srgb-linear ${n1} ${n2} ${n3}${suffix})`;

    case 'xyz65':
      return `color(xyz-d65 ${n1} ${n2} ${n3}${suffix})`;

    case 'xyz50':
      return `color(xyz-d50 ${n1} ${n2} ${n3}${suffix})`;

    default:
      return `color(${space} ${n1} ${n2} ${n3}${suffix})`;
  }
}
