import * as stylex from '@stylexjs/stylex';
import { BookmarkBar } from './components/bookmark-bar';
import { TabList } from './components/tab-list';
import { TabPanel } from './components/tab-panel';
import { Toolbar } from './components/toolbar';
import { Theme } from './theme';
import { colors } from './tokens.stylex';

export function Browser() {
  return (
    <div {...stylex.props(browser.layout)}>
      <Theme />
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
