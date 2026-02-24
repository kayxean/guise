import { useCallback } from 'react';
import { createStore } from '~/features/store';

export interface ThemeState extends Record<string, unknown> {
  theme: {
    mode: 'dark' | 'light';
    inactive: boolean;
    incognito: boolean;
  };
  background_tab: {
    default: string;
    inactive: string;
    incognito: {
      default: string;
      inactive: string;
    };
  };
  frame: {
    default: string;
    inactive: string;
    incognito: {
      default: string;
      inactive: string;
    };
  };
  bookmark: {
    text: string;
  };
  ntp: {
    background: string;
    text: string;
  };
  omnibox: {
    background: string;
    text: string;
  };
  tab_background_text: {
    default: string;
    inactive: string;
    incognito: {
      default: string;
      inactive: string;
    };
  };
  tab: {
    text: string;
  };
  toolbar: {
    default: string;
    icon: string;
    text: string;
  };
}

const [useThemeStore, apiThemeStore] = createStore<ThemeState>({
  theme: {
    mode: 'dark',
    inactive: false,
    incognito: false,
  },
  background_tab: {
    default: '#121314',
    inactive: '#121314',
    incognito: {
      default: '#121314',
      inactive: '#121314',
    },
  },
  frame: {
    default: '#020304',
    inactive: '#020304',
    incognito: {
      default: '#020304',
      inactive: '#020304',
    },
  },
  bookmark: {
    text: '#A4A5A6',
  },
  ntp: {
    background: '#121314',
    text: '#A4A5A6',
  },
  omnibox: {
    background: '#242526',
    text: '#A4A5A6',
  },
  tab_background_text: {
    default: '#A4A5A6',
    inactive: '#A4A5A6',
    incognito: {
      default: '#A4A5A6',
      inactive: '#A4A5A6',
    },
  },
  tab: {
    text: '#F2F3F4',
  },
  toolbar: {
    default: '#121314',
    icon: '#727374',
    text: '#A4A5A6',
  },
});

export { useThemeStore, apiThemeStore };

export function updateThemePath<T>(
  obj: T,
  path: string[],
  value: string,
  index = 0,
): T {
  const key = path[index] as keyof T;

  if (index === path.length - 1) {
    return { ...obj, [key]: value };
  }

  return {
    ...obj,
    [key]: updateThemePath(obj[key], path, value, index + 1),
  };
}

export function getThemeValue(state: ThemeState, path: string[]): string {
  let current: unknown = state;
  for (let i = 0; i < path.length; i++) {
    current = (current as Record<string, unknown>)?.[path[i]];
  }
  return current as string;
}

export function resolveDynamicPath(
  baseKey: keyof ThemeState,
  theme: ThemeState['theme'],
): string[] {
  const { incognito, inactive } = theme;

  if (
    baseKey === 'frame' ||
    baseKey === 'background_tab' ||
    baseKey === 'tab_background_text'
  ) {
    if (incognito) {
      return inactive
        ? [baseKey, 'incognito', 'inactive']
        : [baseKey, 'incognito', 'default'];
    }

    return inactive ? [baseKey, 'inactive'] : [baseKey, 'default'];
  }

  switch (baseKey) {
    case 'toolbar':
      return ['toolbar', 'default'];
    case 'ntp':
      return ['ntp', 'background'];
    case 'omnibox':
      return ['omnibox', 'background'];
    case 'bookmark':
      return ['bookmark', 'text'];
    case 'tab':
      return ['tab', 'text'];
    default:
      return [baseKey as string, 'default'];
  }
}

export function useResolvedColor(baseKey: keyof ThemeState, subKey?: string) {
  return useThemeStore(
    useCallback(
      (state: ThemeState) => {
        const path = resolveDynamicPath(baseKey, state.theme);

        if (subKey) {
          path[path.length - 1] = subKey;
        }

        return getThemeValue(state, path);
      },
      [baseKey, subKey],
    ),
  );
}
