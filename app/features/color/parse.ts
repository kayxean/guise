import type { ColorMode, ColorSpace, ColorValues } from './types';

const formatNumber = (num: number, fractionDigits = 2) => {
  const fixed = num.toFixed(fractionDigits);
  return parseFloat(fixed).toString();
};

export const parseCss = (mode: ColorMode, values: ColorSpace<ColorMode>, percent?: boolean, angle?: boolean): string => {
  const v1 = values[0];
  const v2 = values[1];
  const v3 = values[2];

  const isRgb = mode === 'rgb';
  const isHslHwb = mode === 'hsl' || mode === 'hwb';
  const isLabLch = mode === 'lab' || mode === 'lch';
  const isOklabOklch = mode === 'oklab' || mode === 'oklch';

  let c: string, t: string, x: string;

  if (isRgb) {
    return `rgb(${Math.round(v1 * 255)} ${Math.round(v2 * 255)} ${Math.round(v3 * 255)})`;
  }

  if (isHslHwb) {
    c = angle ? `${formatNumber(v1)}deg` : formatNumber(v1);
    t = percent ? `${formatNumber(v2 * 100)}%` : formatNumber(v2 * 100);
    x = percent ? `${formatNumber(v3 * 100)}%` : formatNumber(v3 * 100);
  } else if (isLabLch) {
    c = percent ? `${formatNumber(v1)}%` : formatNumber(v1);
    t = formatNumber(v2);
    x = mode === 'lch' && angle ? `${formatNumber(v3)}deg` : formatNumber(v3);
  } else if (isOklabOklch) {
    c = percent ? `${formatNumber(v1 * 100)}%` : formatNumber(v1 * 100);
    t = formatNumber(v2, 4);
    x = mode === 'oklch' && angle ? `${formatNumber(v3)}deg` : formatNumber(v3, 4);
  } else {
    throw new Error(`Unsupported mode: ${mode}`);
  }

  return `${mode}(${c} ${t} ${x})`;
};

export const parseColor = (css: string): { mode: ColorMode; values: ColorValues } => {
  const trimmed = css.trim();

  const isHexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

  if (isHexMatch) {
    let hex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;

    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {
      mode: 'rgb',
      values: [r / 255, g / 255, b / 255] as ColorValues,
    };
  }

  const match = trimmed.match(/^(?<mode>\w+)\((?<values>.+)\)$/);
  if (!match || !match.groups) {
    throw new Error(`Invalid CSS color string: ${css}`);
  }

  const mode = match.groups.mode.toLowerCase() as ColorMode;
  const valuesStr = match.groups.values.trim();
  const parts = valuesStr.split(/[\s,]+/);

  const values: ColorValues = parts.map((p) => parseFloat(p)) as ColorValues;

  if (values.some(Number.isNaN)) {
    throw new Error(`Invalid color values in string: ${css}`);
  }

  switch (mode) {
    case 'rgb':
      return { mode, values: [values[0] / 255, values[1] / 255, values[2] / 255] as ColorValues };
    case 'hsl':
    case 'hwb':
      return { mode, values: [values[0], values[1] / 100, values[2] / 100] as ColorValues };
    case 'lab':
    case 'lch':
      return { mode, values };
    case 'oklab':
    case 'oklch':
      return { mode, values: [values[0] / 100, values[1], values[2]] as ColorValues };
    default:
      mode satisfies never;
      throw new Error(`Unsupported color mode for parsing: ${mode}`);
  }
};
