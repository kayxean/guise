import * as stylex from '@stylexjs/stylex';
import { Icon } from '~/icons/material';

const bookmark_bar = stylex.create({
  layout: {
    alignItems: 'center',
    backgroundColor: '#000000',
    color: '#a4a5a6',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '.375rem',
    height: '2.5rem',
    maxWidth: '100%',
    overflowX: 'auto',
    padding: '0 .5rem',
    position: 'relative',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const tabs_group = stylex.create({
  layout: {
    display: 'flex',
    left: 0,
    position: 'sticky',
    zIndex: 2,
    ':after': {
      backgroundImage: 'linear-gradient(90deg, #000 70%, #0000)',
      bottom: '-.375rem',
      content: '""',
      left: '-.5rem',
      pointerEvents: 'none',
      position: 'absolute',
      right: '-.5rem',
      top: '-.375rem',
      zIndex: -1,
    },
  },
  button: {
    alignItems: 'center',
    backgroundColor: {
      default: '#242526',
      ':hover': '#464748',
    },
    borderRadius: '50%',
    color: 'inherit',
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
});

const bookmark_list = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
  },
  button: {
    alignItems: 'center',
    backgroundColor: {
      default: '#242526',
      ':hover': '#464748',
    },
    borderRadius: '.875rem',
    color: 'inherit',
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
    backgroundColor: {
      default: '#242526',
      ':hover': '#464748',
    },
    borderRadius: '.875rem',
    color: 'inherit',
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

export function BookmarkBar() {
  const bookmarks = ['Research', 'Service', 'Products', 'Design'];

  return (
    <div role="menubar" {...stylex.props(bookmark_bar.layout)}>
      <div role="none" {...stylex.props(tabs_group.layout)}>
        <button
          type="button"
          role="menuitem"
          aria-label="Tabs group"
          {...stylex.props(tabs_group.button)}
        >
          <Icon name="grid_view" {...stylex.props(tabs_group.icon)} />
        </button>
      </div>

      {bookmarks.map((b) => (
        <div key={b} role="none" {...stylex.props(bookmark_list.layout)}>
          <button
            type="button"
            role="menuitem"
            {...stylex.props(bookmark_list.button)}
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
          {...stylex.props(bookmark_alt.button)}
        >
          <Icon name="folder" {...stylex.props(bookmark_alt.icon)} />
          <span>All Bookmarks</span>
        </button>
      </div>
    </div>
  );
}
