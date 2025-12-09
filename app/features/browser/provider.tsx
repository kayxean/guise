import * as stylex from '@stylexjs/stylex';
import { BookmarkBar } from './bookmark-bar';
import { TabList } from './tab-list';
import { TabPanel } from './tab-panel';
import { Toolbar } from './toolbar';

const browser = stylex.create({
  layout: {
    position: 'relative',
  },
  navigation: {
    backgroundColor: '#121314',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderColor: '#242526',
    paddingBottom: '.375rem',
  },
});

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
