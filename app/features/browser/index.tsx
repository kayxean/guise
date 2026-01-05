import type { CSSProperties } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useColorStore } from './color';
import { BookmarkBar } from './components/bookmark-bar';
import { TabList } from './components/tab-list';
import { TabPanel } from './components/tab-panel';
import { Toolbar } from './components/toolbar';
import { colors } from './tokens.stylex';

type ColorTokens = typeof colors;
type ColorKey = keyof ColorTokens;

const getVarName = (stylexVar: string) => stylexVar.replace(/^var\(/, '').replace(/\)$/, '');

export function Browser() {
  const chrome = useColorStore((state) => state);

  const dynamicStyles = (Object.keys(chrome) as ColorKey[]).reduce(
    (acc, key) => {
      const token = colors[key];
      if (token && typeof token.toString === 'function') {
        const varName = getVarName(token.toString());
        acc[varName as keyof CSSProperties] = chrome[key as keyof typeof chrome] as string;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  const stylexProps = stylex.props(browser.layout);

  return (
    <div {...stylexProps} style={{ ...stylexProps.style, ...dynamicStyles }}>
      <div {...stylex.props(browser.navigation)}>
        <TabList />
        <Toolbar />
        <BookmarkBar />
      </div>
      <TabPanel />
    </div>
  );
}

const browser = stylex.create({
  layout: {
    position: 'relative',
  },
  navigation: {
    backgroundColor: colors.toolbar,
    boxShadow: `0 .25px 0 ${colors.toolbar_button_icon}`,
    position: 'relative',
    zIndex: 2,
  },
});
