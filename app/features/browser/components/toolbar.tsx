import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useState } from 'react';
import { useTabStore } from '../tabs';
import { chrome, colors } from '../tokens.stylex';
import { Icon } from './icons';
import { createToken } from '~/lib/utils';

export function Toolbar() {
  const [pageUrl, setPageUrl] = useState('');
  const tabsList = useTabStore((state) => state.tabsList);
  const tabActive = useTabStore((state) => state.tabActive);

  const isNewTabPage = tabsList.find((t) => t.id === tabActive)?.ntp;
  const hasPageUrl = tabsList.find((t) => t.id === tabActive)?.url;

  const input_id = useMemo(() => createToken(), []);

  useEffect(() => {
    const currentPage = typeof hasPageUrl === 'string' ? hasPageUrl : '';
    setPageUrl(currentPage);
  }, [hasPageUrl]);

  return (
    <div role="menubar" {...stylex.props(toolbar.layout)}>
      <button type="button" role="menuitem" aria-label="Back" {...stylex.props(toolbar.button)}>
        <Icon name="arrow_back" {...stylex.props(toolbar.icon)} />
      </button>
      <button
        type="button"
        role="menuitem"
        aria-label="Refresh"
        {...stylex.props(toolbar.button, toolbar.desktop_only)}
      >
        <Icon name="refresh" {...stylex.props(toolbar.icon)} />
      </button>
      <div role="menu" {...stylex.props(omnibox.layout)}>
        <div role="none" {...stylex.props(omnibox.button_left)}>
          {isNewTabPage ? (
            <button
              type="button"
              role="menuitem"
              aria-label="Google Search"
              {...stylex.props(omnibox.button, omnibox.action)}
            >
              <Icon name="google" {...stylex.props(omnibox.icon)} />
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              aria-label="Page Info"
              {...stylex.props(omnibox.button, omnibox.action)}
            >
              <Icon name="page_info" {...stylex.props(omnibox.icon)} />
            </button>
          )}
        </div>
        <input
          id={input_id}
          type="text"
          placeholder="Search Google or type URL"
          value={pageUrl}
          autoComplete="off"
          spellCheck="false"
          onChange={(e) => setPageUrl(e.target.value)}
          {...stylex.props(omnibox.input)}
        />
        {!isNewTabPage && (
          <div role="none" {...stylex.props(omnibox.button_right)}>
            <button
              type="button"
              role="menuitem"
              aria-label="Install"
              {...stylex.props(omnibox.button, omnibox.action_alt)}
            >
              <Icon name="install_desktop" {...stylex.props(omnibox.icon)} />
            </button>
            <button
              type="button"
              role="menuitem"
              aria-label="Bookmark"
              {...stylex.props(omnibox.button, omnibox.action_alt)}
            >
              <Icon name="star" {...stylex.props(omnibox.icon)} />
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        role="menuitem"
        aria-label="Media controls"
        {...stylex.props(toolbar.button, toolbar.desktop_only)}
      >
        <Icon name="queue_music" {...stylex.props(toolbar.icon)} />
      </button>
      <button
        type="button"
        role="menuitem"
        aria-label="Profile"
        {...stylex.props(toolbar.button, toolbar.desktop_only)}
      >
        <Icon name="account_circle" {...stylex.props(toolbar.icon)} />
      </button>
      <button type="button" role="menuitem" aria-label="Settings" {...stylex.props(toolbar.button)}>
        <Icon name="more_vert" {...stylex.props(toolbar.icon)} />
      </button>
    </div>
  );
}

const toolbar = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '.375rem',
    height: '3rem',
    maxWidth: '100%',
    overflowX: 'auto',
    padding: '.375rem',
    position: 'relative',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
  button: {
    alignItems: 'center',
    backgroundColor: {
      default: colors.toolbar,
      ':hover': chrome.button_hover,
    },
    borderRadius: '50%',
    color: colors.toolbar_button_icon,
    cursor: 'pointer',
    display: 'inline-flex',
    height: '2.25rem',
    justifyContent: 'center',
    width: '2.25rem',
  },
  icon: {
    height: '1.25rem',
    width: '1.25rem',
  },
  desktop_only: {
    display: {
      default: 'none',
      '@media (width >= 32em)': 'inline-flex',
    },
  },
});

const omnibox = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
  },
  input: {
    backgroundColor: {
      default: colors.omnibox_background,
      ':hover': chrome.input_hover,
    },
    borderRadius: '1.25rem',
    color: colors.omnibox_text,
    fontSize: '.875rem',
    height: '2.25rem',
    outline: 'none',
    paddingTop: '.063rem',
    paddingRight: {
      default: '.063rem',
      '@media (width >= 20em)': '4.875rem',
    },
    paddingBottom: '.063rem',
    paddingLeft: {
      default: '1rem',
      '@media (width >= 20em)': '2.375rem',
    },
    width: '100%',
    '::placeholder': {
      color: chrome.omnibox_placeholder,
    },
  },
  button_left: {
    alignItems: 'center',
    display: 'flex',
    left: '.375rem',
    position: 'absolute',
    zIndex: 2,
  },
  button_right: {
    alignItems: 'center',
    display: 'flex',
    gap: '.375rem',
    position: 'absolute',
    right: '.75rem',
    zIndex: 2,
  },
  button: {
    alignItems: 'center',
    borderRadius: '50%',
    color: colors.omnibox_text,
    cursor: 'pointer',
    display: {
      default: 'none',
      '@media (width >= 20em)': 'inline-flex',
    },
    height: '1.5rem',
    justifyContent: 'center',
    width: '1.5rem',
  },
  icon: {
    height: '1.125rem',
    width: '1.125rem',
  },
  action: {
    backgroundColor: {
      default: colors.toolbar,
      ':hover': chrome.button_hover,
    },
  },
  action_alt: {
    backgroundColor: {
      default: chrome.transparent,
      ':hover': chrome.button_hover,
    },
  },
});
