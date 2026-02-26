import type { ThemeState } from '../themes';
import { useCallback, useMemo } from 'react';
import { ColorPicker } from '~/color-picker';
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

  const activePath = useMemo(
    () => resolveDynamicPath(baseKey, themeContext),
    [baseKey, themeContext],
  );

  const subLabel = useMemo(() => activePath.join(' / '), [activePath]);

  const cssValue = useThemeStore(
    useCallback(
      (state: ThemeState) => getThemeValue(state, activePath) ?? '#000000',
      [activePath],
    ),
  );

  const handleUpdate = useCallback(
    (newCss: string) => {
      apiThemeStore.setState((state: ThemeState) => {
        const category = activePath[0] as keyof ThemeState;
        return {
          ...state,
          [category]: updateThemePath(
            state[category],
            activePath.slice(1),
            newCss,
          ),
        };
      });
    },
    [activePath],
  );

  return (
    <ColorPicker
      label={label}
      subLabel={subLabel}
      value={cssValue}
      onChange={handleUpdate}
    />
  );
}
