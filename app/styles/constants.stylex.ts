import * as stylex from '@stylexjs/stylex';

/**
 * Container query width thresholds for responsive layouts.
 */
export const breakpoints = stylex.defineConsts({
  /** @value 256px */
  '3xs': '@container (width >= 16em)',
  /** @value 288px */
  '2xs': '@container (width >= 18em)',
  /** @value 320px */
  xs: '@container (width >= 20em)',
  /** @value 384px */
  sm: '@container (width >= 24em)',
  /** @value 448px */
  md: '@container (width >= 28em)',
  /** @value 512px */
  lg: '@container (width >= 32em)',
  /** @value 576px */
  xl: '@container (width >= 36em)',
  /** @value 672px */
  '2xl': '@container (width >= 42em)',
  /** @value 768px */
  '3xl': '@container (width >= 48em)',
  /** @value 896px */
  '4xl': '@container (width >= 56em)',
  /** @value 1024px */
  '5xl': '@container (width >= 64em)',
  /** @value 1152px */
  '6xl': '@container (width >= 72em)',
  /** @value 1280px */
  '7xl': '@container (width >= 80em)',
  /** @value 1536px */
  '8xl': '@container (width >= 96em)',
  /** @value 1792px */
  '9xl': '@container (width >= 112em)',
  /** @value 2048px */
  '10xl': '@container (width >= 128em)',
});

/**
 * Fixed sizes for containers, cards, and layout wrapper elements.
 */
export const dimensions = stylex.defineConsts({
  /** @value 96px */
  '3xs': '6rem',
  /** @value 128px */
  '2xs': '8rem',
  /** @value 256px */
  xs: '16rem',
  /** @value 320px */
  sm: '20rem',
  /** @value 480px */
  md: '30rem',
  /** @value 560px */
  lg: '35rem',
  /** @value 640px */
  xl: '40rem',
  /** @value 768px */
  '2xl': '48rem',
  /** @value 960px */
  '3xl': '60rem',
  /** @value 1080px */
  '4xl': '67.5rem',
  /** @value 1280px */
  '5xl': '80rem',
  /** @value 1440px */
  '6xl': '90rem',
  /** @value 100% */
  full: '100%',
});

/**
 * Animation timing curves for smooth motion.
 */
export const easings = stylex.defineConsts({
  emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
  accelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
  linear: 'linear(0, 1)',
  smooth:
    'linear(0, 0.0018, 0.0069 1.16%, 0.0262 2.32%, 0.0642, 0.1143 5.23%, 0.2244 7.84%, 0.5881 15.68%, 0.6933, 0.7839, 0.8591, 0.9191 26.13%, 0.9693, 1.0044 31.93%, 1.0234, 1.0358 36.58%, 1.0434 39.19%, 1.046 42.39%, 1.0446 44.71%, 1.0404 47.61%, 1.0118 61.84%, 1.0028 69.39%, 0.9981 80.42%, 0.9991 99.87%)',
  snappy:
    'linear(0, 0.0039 0.87%, 0.0195, 0.0446, 0.0766 4.35%, 0.1546 6.68%, 0.4668 15.1%, 0.5684 18.29%, 0.648 21.19%, 0.7215, 0.7817 27.58%, 0.8339 31.06%, 0.8776 34.84%, 0.8964 36.87%, 0.9147, 0.9298, 0.9424 43.84%, 0.954, 0.9633 49.06%, 0.9723, 0.9791 55.45%, 0.9888 62.42%, 0.9949 71.13%, 0.9982 82.45%, 0.9997 99.87%)',
  bouncy:
    'linear(0, 0.0039 0.87%, 0.0199, 0.0459 3.19%, 0.0892 4.65%, 0.1865 7.26%, 0.5218 15.39%, 0.6249, 0.7132, 0.7864, 0.8453 27%, 0.8955, 0.9328, 0.9596 36.58%, 0.9706 38.32%, 0.9808 40.35%, 0.9946 44.42%, 1.003 49.35%, 1.0056 53.13%, 1.0063 58.06%, 1.0014 80.71%, 1.0001 99.87%)',
});

/**
 * Font weight values for text hierarchy.
 */
export const grades = stylex.defineConsts({
  /** @value 100 */
  thin: 100,
  /** @value 200 */
  extraLight: 200,
  /** @value 300 */
  light: 300,
  /** @value 400 */
  normal: 400,
  /** @value 500 */
  medium: 500,
  /** @value 600 */
  semibold: 600,
  /** @value 700 */
  bold: 700,
  /** @value 800 */
  extraBold: 800,
  /** @value 900 */
  black: 900,
});

/**
 * Line height multipliers for text readability and spacing.
 */
export const leadings = stylex.defineConsts({
  /** @value 1 */
  none: 1,
  /** @value 1.25 */
  tight: 1.25,
  /** @value 1.5 */
  base: 1.5,
  /** @value 1.75 */
  relaxed: 1.75,
  /** @value 2 */
  loose: 2,
});

/**
 * Z-index values for stacking order.
 */
export const layers = stylex.defineConsts({
  /** @value -1 */
  hide: -1,
  /** @value 0 */
  base: 0,
  /** @value 1 */
  relative: 1,
  /** @value 100 */
  sticky: 100,
  /** @value 200 */
  popover: 200,
  /** @value 300 */
  overlay: 300,
  /** @value 400 */
  modal: 400,
  /** @value 500 */
  tooltip: 500,
  /** @value 600 */
  alert: 600,
  /** @value 700 */
  shell: 700,
  /** @value 800 */
  portal: 800,
  /** @value 900 */
  fixed: 900,
  /** @value 1000 */
  max: 1000,
});

/**
 * Corner rounding values for buttons, cards, and containers.
 */
export const radius = stylex.defineConsts({
  /** @value 6px */
  '3xs': '0.375rem',
  /** @value 8px */
  '2xs': '0.5rem',
  /** @value 12px */
  xs: '0.75rem',
  /** @value 14px */
  sm: '0.875rem',
  /** @value 16px */
  md: '1rem',
  /** @value 20px */
  lg: '1.25rem',
  /** @value 24px */
  xl: '1.5rem',
  /** @value 32px */
  '2xl': '2rem',
  /** @value 48px */
  '3xl': '3rem',
  /** @value 64px */
  '4xl': '4rem',
  /** @value 50% */
  full: '50%',
});

/**
 * Component-level sizing for buttons, inputs, icons, and small UI elements.
 */
export const scales = stylex.defineConsts({
  /** @value 8px */
  '3xs': '0.5rem',
  /** @value 12px */
  '2xs': '0.75rem',
  /** @value 14px */
  xs: '0.875rem',
  /** @value 16px */
  sm: '1rem',
  /** @value 18px */
  md: '1.125rem',
  /** @value 20px */
  lg: '1.25rem',
  /** @value 24px */
  xl: '1.5rem',
  /** @value 28px */
  '2xl': '1.75rem',
  /** @value 32px */
  '3xl': '2rem',
  /** @value 36px */
  '4xl': '2.25rem',
  /** @value 40px */
  '5xl': '2.5rem',
  /** @value 48px */
  '6xl': '3rem',
  /** @value 56px */
  '7xl': '3.5rem',
  /** @value 64px */
  '8xl': '4rem',
  /** @value 72px */
  '9xl': '4.5rem',
  /** @value 80px */
  '10xl': '5rem',
});

/**
 * Font size values for text hierarchy. From captions to headings.
 */
export const sizes = stylex.defineConsts({
  /** @value 8px */
  '3xs': '0.5rem',
  /** @value 12px */
  '2xs': '0.75rem',
  /** @value 14px */
  xs: '0.875rem',
  /** @value 16px */
  sm: '1rem',
  /** @value 18px */
  md: '1.125rem',
  /** @value 20px */
  lg: '1.25rem',
  /** @value 24px */
  xl: '1.5rem',
  /** @value 32px */
  '2xl': '2rem',
  /** @value 36px */
  '3xl': '2.25rem',
  /** @value 40px */
  '4xl': '2.5rem',
  /** @value 48px */
  '5xl': '3rem',
  /** @value 56px */
  '6xl': '3.5rem',
  /** @value 64px */
  '7xl': '4rem',
  /** @value 72px */
  '8xl': '4.5rem',
  /** @value 80px */
  '9xl': '5rem',
  /** @value 96px */
  '10xl': '6rem',
});

/**
 * Spacing values for padding, margin, gap, and position properties.
 */
export const spacings = stylex.defineConsts({
  /** @value 8px */
  '3xs': '0.5rem',
  /** @value 12px */
  '2xs': '0.75rem',
  /** @value 14px */
  xs: '0.875rem',
  /** @value 16px */
  sm: '1rem',
  /** @value 24px */
  md: '1.5rem',
  /** @value 32px */
  lg: '2rem',
  /** @value 40px */
  xl: '2.5rem',
  /** @value 48px */
  '2xl': '3rem',
  /** @value 56px */
  '3xl': '3.5rem',
  /** @value 64px */
  '4xl': '4rem',
  /** @value 72px */
  '5xl': '4.5rem',
  /** @value 80px */
  '6xl': '5rem',
});

/**
 * Border width values for outlines and dividers.
 */
export const strokes = stylex.defineConsts({
  /** @value 0.5px */
  xs: '0.5px',
  /** @value 1px */
  sm: '1px',
  /** @value 2px */
  md: '2px',
  /** @value 4px */
  lg: '4px',
  /** @value 8px */
  xl: '8px',
});

/**
 * Duration values for animations and transitions.
 */
export const timings = stylex.defineConsts({
  /** @value 0ms */
  instant: '0ms',
  /** @value 100ms */
  faster: '100ms',
  /** @value 200ms */
  fast: '200ms',
  /** @value 300ms */
  normal: '300ms',
  /** @value 500ms */
  slow: '500ms',
  /** @value 1000ms */
  slower: '1000ms',
});

/**
 * Letter spacing adjustments for typography.
 */
export const trackings = stylex.defineConsts({
  /** @value -0.05 */
  tighter: -0.05,
  /** @value -0.025 */
  tight: -0.025,
  /** @value 0 */
  normal: 0,
  /** @value 0.025 */
  wide: 0.025,
  /** @value 0.05 */
  wider: 0.05,
  /** @value 0.1 */
  widest: 0.1,
});

/**
 * Opacity values for overlays and disabled states.
 */
export const transparency = stylex.defineConsts({
  /** @value 0.4 */
  disabled: 0.4,
  /** @value 0.6 */
  muted: 0.6,
  /** @value 0.64 */
  overlay: 0.64,
  /** @value 0.8 */
  surface: 0.8,
  /** @value 0.9 */
  emphasis: 0.9,
});

/**
 * Viewport units for full-screen layouts and hero sections.
 */
export const viewports = stylex.defineConsts({
  /** @value 100% */
  full: '100%',
  /** @value 100dvh */
  dvh: '100dvh',
  /** @value 100dvw */
  dvw: '100dvw',
  /** @value 100svh */
  svh: '100svh',
  /** @value 100svw */
  svw: '100svw',
});
