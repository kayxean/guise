import { createStore } from '~/features/store';

interface ThemeState extends Record<string, unknown> {
  theme: {
    mode: 'dark' | 'light';
    inactive: boolean;
    incognito: boolean;
  };
  background_tab: {
    default: string;
    incative: string;
    incognito: {
      default: string;
      inactive: string;
    };
  };
  frame: {
    default: string;
    incative: string;
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
    incative: '#121314',
    incognito: {
      default: '#121314',
      inactive: '#121314',
    },
  },
  frame: {
    default: '#020304',
    incative: '#020304',
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
