import * as stylex from '@stylexjs/stylex';
import { BookmarkBar } from './components/bookmark-bar';
import { TabList } from './components/tab-list';
import { TabPanel } from './components/tab-panel';
import { Toolbar } from './components/toolbar';
import { useThemeStore } from './themes';
import { dynamic } from './tokens.stylex';

export function Browser() {
  const toolbar = useThemeStore((state) => state.toolbar);

  return (
    <div {...stylex.props(browser.layout)}>
      <div
        {...stylex.props(
          browser.navigation,
          dynamic.bg(toolbar.default),
          dynamic.shadow(`0 .25px 0 ${toolbar.icon}`),
        )}
      >
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
    position: 'relative',
    zIndex: 2,
  },
});
