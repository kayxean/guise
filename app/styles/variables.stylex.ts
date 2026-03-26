import * as stylex from '@stylexjs/stylex';

/**
 * Semantic colors for UI components.
 */
export const colors = stylex.defineVars({
  brand: stylex.types.color('oklch(50% 0.15 250)'),
  accent: stylex.types.color('oklch(60% 0.15 280)'),
  tint: stylex.types.color('oklch(80% 0.1 250)'),
  surface: stylex.types.color('oklch(98% 0 0)'),
  surfaceSubtle: stylex.types.color('oklch(95% 0 0)'),
  text: stylex.types.color('oklch(20% 0 0)'),
  textSubtle: stylex.types.color('oklch(45% 0 0)'),
  textMuted: stylex.types.color('oklch(65% 0 0)'),
  line: stylex.types.color('oklch(85% 0 0)'),
  lineSubtle: stylex.types.color('oklch(80% 0 0)'),
  link: stylex.types.color('oklch(50% 0.15 250)'),
  linkSubtle: stylex.types.color('oklch(60% 0.15 250)'),
  linkMuted: stylex.types.color('oklch(40% 0.15 250)'),
  icon: stylex.types.color('oklch(65% 0.03 0)'),
  iconMuted: stylex.types.color('oklch(50% 0.03 0)'),
  hidden: stylex.types.color('#0000'),
  success: stylex.types.color('oklch(60% 0.15 150)'),
  warning: stylex.types.color('oklch(70% 0.15 80)'),
  error: stylex.types.color('oklch(55% 0.15 30)'),
  info: stylex.types.color('oklch(60% 0.15 220)'),
});

/**
 * Font families for text and code.
 */
export const fonts = stylex.defineVars({
  flex: 'Google Sans Flex, sans-serif',
  code: 'Google Sans Code, monospace',
  sans: 'Geist, sans-serif',
  mono: 'Geist Mono, monospace',
});

/**
 * Elevation values for depth and layering.
 */
export const shadows = stylex.defineVars({
  xs: '0 0.0625rem 0.125rem oklch(0% 0 0 / 0.05)',
  sm: '0 0.125rem 0.375rem oklch(0% 0 0 / 0.08)',
  md: '0 0.25rem 0.5rem oklch(0% 0 0 / 0.1)',
  lg: '0 0.5rem 1rem oklch(0% 0 0 / 0.11)',
  xl: '0 1rem 1.5rem oklch(0% 0 0 / 0.12)',
});
