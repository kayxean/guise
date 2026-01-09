import * as stylex from '@stylexjs/stylex';
import { useTabStore } from '../tabs';
import { useThemeStore } from '../themes';
import { chrome, dynamic } from '../tokens.stylex';
import { Icon } from './icons';

export function BookmarkBar() {
  const tabsList = useTabStore((state) => state.tabsList);
  const tabActive = useTabStore((state) => state.tabActive);

  const toolbar = useThemeStore((state) => state.toolbar);
  const bookmark = useThemeStore((state) => state.bookmark);

  const isNewTabPage = tabsList.find((t) => t.id === tabActive)?.ntp;

  const bookmarks = ['Research', 'Service', 'Products', 'Design'];

  return (
    <div
      role="menubar"
      aria-hidden={!isNewTabPage}
      {...stylex.props(
        bookmark_bar.layout,
        !isNewTabPage && bookmark_bar.hidden,
      )}
    >
      <div role="none" {...stylex.props(tabs_group.layout)}>
        <button
          type="button"
          role="menuitem"
          aria-label="Tabs group"
          {...stylex.props(
            tabs_group.button,
            dynamic.bg_hover(toolbar.default, chrome.button_hover),
            dynamic.text(toolbar.icon),
          )}
        >
          <Icon name="grid_view" {...stylex.props(tabs_group.icon)} />
          <span
            {...stylex.props(
              tabs_group.overlay,
              dynamic.image(
                `linear-gradient(90deg, ${toolbar.default} 70%, ${chrome.transparent})`,
              ),
            )}
          />
        </button>
      </div>

      {bookmarks.map((b) => (
        <div key={b} role="none" {...stylex.props(bookmark_list.layout)}>
          <button
            type="button"
            role="menuitem"
            {...stylex.props(
              bookmark_list.button,
              dynamic.bg_hover(toolbar.default, chrome.button_hover),
              dynamic.text(bookmark.text),
            )}
          >
            <Icon name="globe" {...stylex.props(bookmark_list.icon)} />
            <span>{b}</span>
          </button>
        </div>
      ))}

      <div role="none" {...stylex.props(bookmark_alt.layout)}>
        <button
          type="button"
          role="menuitem"
          aria-label="All bookmarks"
          {...stylex.props(
            bookmark_alt.button,
            dynamic.bg_hover(toolbar.default, chrome.button_hover),
            dynamic.text(bookmark.text),
          )}
        >
          <Icon name="folder" {...stylex.props(bookmark_alt.icon)} />
          <span>All Bookmarks</span>
        </button>
      </div>
    </div>
  );
}

const bookmark_bar = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '.375rem',
    height: '2.125rem',
    maxWidth: '100%',
    overflowX: 'auto',
    padding: '0 .5rem .375rem .5rem',
    position: 'relative',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
  hidden: {
    display: 'none',
  },
});

const tabs_group = stylex.create({
  layout: {
    display: 'flex',
    left: 0,
    position: 'sticky',
    zIndex: 2,
  },
  button: {
    alignItems: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'inline-flex',
    height: '1.75rem',
    justifyContent: 'center',
    width: '1.75rem',
  },
  icon: {
    height: '1.25rem',
    width: '1.25rem',
  },
  overlay: {
    bottom: '-.375rem',
    left: '-.5rem',
    pointerEvents: 'none',
    position: 'absolute',
    right: '-.5rem',
    top: '-.375rem',
    zIndex: -1,
  },
});

const bookmark_list = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
  },
  button: {
    alignItems: 'center',
    borderRadius: '.875rem',
    cursor: 'pointer',
    display: 'inline-flex',
    gap: '.375rem',
    height: '1.75rem',
    justifyContent: 'center',
    padding: '0 .375rem',
  },
  icon: {
    height: '1.125rem',
    width: '1.125rem',
  },
});

const bookmark_alt = stylex.create({
  layout: {
    display: 'flex',
    flexShrink: 0,
    marginLeft: {
      default: null,
      '@media (width >= 48em)': 'auto',
    },
    position: {
      default: null,
      '@media (width >= 48em)': 'sticky',
    },
    right: 0,
    zIndex: 2,
  },
  button: {
    alignItems: 'center',
    borderRadius: '.875rem',
    cursor: 'pointer',
    display: 'inline-flex',
    gap: '.375rem',
    height: '1.75rem',
    justifyContent: 'center',
    padding: '0 .375rem',
  },
  icon: {
    height: '1.125rem',
    width: '1.125rem',
  },
});
