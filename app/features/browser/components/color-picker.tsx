import type { ThemeState } from '../themes';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  formatCss,
  fromPickerValue,
  parseColor,
  toPickerValue,
} from '~/features/color';
import {
  AlphaPicker,
  HuePicker,
  SquarePicker,
} from '~/features/color/components';
import {
  apiThemeStore,
  getThemeValue,
  resolveDynamicPath,
  updateThemePath,
  useThemeStore,
} from '../themes';

interface ChromiumPickerProps {
  baseKey: keyof ThemeState;
  label?: string;
}

export function ChromiumPicker({ baseKey, label }: ChromiumPickerProps) {
  const themeContext = useThemeStore((s) => s.theme);
  const lastInteractionTime = useRef(0);

  const activePath = useMemo(
    () => resolveDynamicPath(baseKey, themeContext),
    [baseKey, themeContext],
  );

  const cssValue = useThemeStore(
    useCallback(
      (state: ThemeState) => getThemeValue(state, activePath) ?? '#000000',
      [activePath],
    ),
  );

  const [localPicker, setLocalPicker] = useState(() => {
    const { alpha, mode, values } = parseColor(cssValue);
    return toPickerValue(values, mode, alpha);
  });

  useEffect(() => {
    const isInteracting = Date.now() - lastInteractionTime.current < 100;
    if (isInteracting) return;

    const { alpha, mode, values } = parseColor(cssValue);
    setLocalPicker(toPickerValue(values, mode, alpha));
  }, [cssValue]);

  const onPickerChange = useCallback(
    (updates: Partial<typeof localPicker>) => {
      lastInteractionTime.current = Date.now();

      setLocalPicker((prev) => {
        const next = { ...prev, ...updates };

        const colorValues = fromPickerValue(next, 'rgb');
        const newCss = formatCss('rgb', colorValues, next.a, true);

        if (newCss !== cssValue) {
          apiThemeStore.setState((state: ThemeState) => {
            const category = activePath[0] as keyof ThemeState;
            return {
              [category]: updateThemePath(
                state[category],
                activePath.slice(1),
                newCss,
              ),
            };
          });
        }

        return next;
      });
    },
    [activePath, cssValue],
  );

  const solidColor = useMemo(
    () =>
      formatCss(
        'rgb',
        fromPickerValue({ ...localPicker, a: 1 }, 'rgb'),
        1,
        true,
      ),
    [localPicker],
  );

  return (
    <div {...stylex.props(styles.layout)}>
      {label && <div {...stylex.props(styles.label)}>{label}</div>}

      <div {...stylex.props(styles.pathIndicator)}>
        {activePath.join(' / ')}
      </div>

      <div {...stylex.props(styles.preview(solidColor))} />

      <div>{solidColor}</div>

      <SquarePicker
        hue={localPicker.h}
        x={localPicker.s}
        y={localPicker.v}
        onSelect={(s, v) => onPickerChange({ s, v })}
      />

      <HuePicker hue={localPicker.h} onSelect={(h) => onPickerChange({ h })} />

      <AlphaPicker
        alpha={localPicker.a}
        color={solidColor}
        onSelect={(a) => onPickerChange({ a })}
      />
    </div>
  );
}

const styles = stylex.create({
  layout: {
    backgroundColor: '#282828',
    borderRadius: '.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '.75rem',
    padding: '1rem .5rem',
    width: '100%',
  },
  label: {
    color: '#efefef',
    fontSize: '.875rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  pathIndicator: {
    color: '#666',
    fontFamily: 'Google Sans Code, monospace',
    fontSize: '.75rem',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  preview: (color: string) => ({
    backgroundColor: color,
    borderRadius: '.25rem',
    height: '3rem',
    width: '3rem',
  }),
});
