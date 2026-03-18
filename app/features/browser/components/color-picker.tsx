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

export function ChromiumPicker({
  baseKey,
  path,
  label,
}: {
  baseKey: keyof ThemeState;
  path?: string[];
  label?: string;
}) {
  const themeContext = useThemeStore((s) => s.theme as ThemeState['theme']);

  const activePath = useMemo(() => {
    const p = path ?? resolveDynamicPath(baseKey, themeContext);

    const isBaseLevel =
      ['frame', 'background_tab', 'tab_background_text'].includes(p[0]) && p.length === 1;

    const isIncognitoBranch = p.includes('incognito') && p[p.length - 1] === 'incognito';

    return isBaseLevel || isIncognitoBranch ? [...p, 'default'] : p;
  }, [baseKey, themeContext, path]);

  const manifestKey = useMemo(() => {
    return activePath.filter((segment) => segment !== 'default').join('_');
  }, [activePath]);

  const cssValue = useThemeStore(
    useCallback((state: ThemeState) => getThemeValue(state, activePath) ?? '#000000', [activePath]),
  );

  const handleUpdate = useCallback(
    (newCss: string) => {
      if (path) {
        const isIncognito = path.includes('incognito');
        const isInactive = path.includes('inactive');

        if (themeContext.incognito !== isIncognito || themeContext.inactive !== isInactive) {
          apiThemeStore.setState((state) => ({
            ...state,
            theme: {
              ...state.theme,
              incognito: isIncognito,
              inactive: isInactive,
            },
          }));
        }
      }

      apiThemeStore.setState((state) => updateThemePath(state, activePath, newCss));
    },
    [activePath, path, themeContext.incognito, themeContext.inactive],
  );

  return (
    <ColorPicker
      label={label}
      id={manifestKey}
      value={cssValue}
      onChange={handleUpdate}
      allowedMode={['hex', 'rgb', 'hsl']}
    />
  );
}
