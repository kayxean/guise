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

export function updateThemePath<T extends Record<string, unknown>>(
  obj: T,
  path: string[],
  value: string,
): T {
  if (path.length === 0) return obj;

  const newRoot = { ...obj };
  let current: Record<string, unknown> = newRoot;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const existingValue = current[key];

    const nextValue = { ...(existingValue as Record<string, unknown>) };

    current[key] = nextValue;
    current = nextValue;
  }

  current[path[path.length - 1]] = value;

  return newRoot;
}

export function getThemeValue(state: ThemeState, path: string[], subKeyOverride?: string): string {
  let current: unknown = state;
  const lastIndex = path.length - 1;

  for (let i = 0; i < lastIndex; i++) {
    if (typeof current === 'object' && current !== null) {
      current = (current as Record<string, unknown>)[path[i]];
    }
  }

  const finalKey = subKeyOverride ?? path[lastIndex];

  if (typeof current === 'object' && current !== null) {
    return (current as Record<string, string>)[finalKey] ?? '';
  }

  return '';
}

export function resolveDynamicPath(
  baseKey: keyof ThemeState,
  theme: ThemeState['theme'],
): string[] {
  const { incognito, inactive } = theme;

  if (baseKey === 'frame' || baseKey === 'background_tab' || baseKey === 'tab_background_text') {
    if (incognito) {
      return inactive ? [baseKey, 'incognito', 'inactive'] : [baseKey, 'incognito', 'default'];
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
        return getThemeValue(state, path, subKey);
      },
      [baseKey, subKey],
    ),
  );
}
