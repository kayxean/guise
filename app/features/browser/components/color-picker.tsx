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
      apiThemeStore.setState((state) =>
        updateThemePath(state, activePath, newCss),
      );
    },
    [activePath],
  );

  return (
    <ColorPicker
      label={label}
      subLabel={subLabel}
      value={cssValue}
      onChange={handleUpdate}
      allowedMode={['hex', 'rgb', 'hsl']}
    />
  );
}
