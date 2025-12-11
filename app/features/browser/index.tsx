import * as stylex from '@stylexjs/stylex';
import { BookmarkBar } from './components/bookmark-bar';
import { TabList } from './components/tab-list';
import { TabPanel } from './components/tab-panel';
import { Toolbar } from './components/toolbar';
import { Theme } from './theme';

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
    backgroundColor: '#121314',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderColor: '#242526',
  },
});
