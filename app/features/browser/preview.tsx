import * as stylex from '@stylexjs/stylex';
import { BookmarkBar } from './components/bookmark-bar';
import { TabList } from './components/tab-list';
import { TabPanel } from './components/tab-panel';
import { Toolbar } from './components/toolbar';
import { useResolvedColor } from './themes';
import { dynamic } from './tokens.stylex';

export function BrowserPreview() {
  const toolbarBg = useResolvedColor('toolbar', 'default');
  const toolbarIcon = useResolvedColor('toolbar', 'icon');

  return (
    <div {...stylex.props(browser.layout)}>
      <div
        {...stylex.props(
          browser.navigation,
          dynamic.bg(toolbarBg),
          dynamic.shadow(`0 .25px 0 ${toolbarIcon}`),
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
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  navigation: {
    position: 'relative',
    zIndex: 2,
    flexShrink: 0,
  },
});
