import * as stylex from '@stylexjs/stylex';
import { BookmarkBar } from './core/bookmark-bar';
import { TabList } from './core/tab-list';
import { TabPanel } from './core/tab-panel';
import { Toolbar } from './core/toolbar';

export function Browser() {
  return (
    <div {...stylex.props(browser.layout)}>
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
