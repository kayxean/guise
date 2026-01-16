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

export const updateThemePath = <T>(
  obj: T,
  path: string[],
  value: string,
): T => {
  const [first, ...rest] = path;
  if (!first) return obj;

  const key = first as keyof T;

  if (rest.length === 0) {
    return { ...obj, [key]: value };
  }

  return {
    ...obj,
    [key]: updateThemePath(obj[key], rest, value),
  };
};

export const getThemeValue = (state: ThemeState, path: string[]): string => {
  return path.reduce((acc: unknown, key: string) => {
    return (acc as Record<string, unknown>)?.[key];
  }, state) as string;
};

export const resolveDynamicPath = (
  baseKey: keyof ThemeState,
  theme: ThemeState['theme'],
): string[] => {
  const { incognito, inactive } = theme;

  const hasNesting = [
    'frame',
    'background_tab',
    'tab_background_text',
  ].includes(baseKey as string);

  if (hasNesting) {
    const path: string[] = [baseKey as string];
    if (incognito) {
      path.push('incognito');
    }
    const stateKey = inactive ? 'inactive' : 'default';
    path.push(stateKey);
    return path;
  }

  const simpleKeyMap: Partial<Record<keyof ThemeState, string>> = {
    toolbar: 'default',
    ntp: 'background',
    omnibox: 'background',
    bookmark: 'text',
    tab: 'text',
  };

  if (baseKey in simpleKeyMap) {
    return [baseKey as string, simpleKeyMap[baseKey] as string];
  }

  return [baseKey as string, 'default'];
};

export const useResolvedColor = (
  baseKey: keyof ThemeState,
  subKey?: string,
) => {
  return useThemeStore(
    useCallback(
      (state: ThemeState) => {
        const path = resolveDynamicPath(baseKey, state.theme);

        if (subKey) {
          const specificPath = [...path.slice(0, -1), subKey];
          return getThemeValue(state, specificPath);
        }

        return getThemeValue(state, path);
      },
      [baseKey, subKey],
    ),
  );
};
