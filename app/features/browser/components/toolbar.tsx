import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useState } from 'react';
import { createToken } from '~/features/utils';
import { useTabStore } from '../tabs';
import { useThemeStore } from '../themes';
import { chrome, dynamic } from '../tokens.stylex';
import { Icon } from './icons';

export function Toolbar() {
  const [pageUrl, setPageUrl] = useState('');
  const tabsList = useTabStore((state) => state.tabsList);
  const tabActive = useTabStore((state) => state.tabActive);

  const toolbar = useThemeStore((state) => state.toolbar);
  const omnibox = useThemeStore((state) => state.omnibox);

  const isNewTabPage = tabsList.find((t) => t.id === tabActive)?.ntp;
  const hasPageUrl = tabsList.find((t) => t.id === tabActive)?.url;

  const input_id = useMemo(() => createToken(), []);

  useEffect(() => {
    const currentPage = typeof hasPageUrl === 'string' ? hasPageUrl : '';
    setPageUrl(currentPage);
  }, [hasPageUrl]);

  return (
    <div role="menubar" {...stylex.props(tool_bar.layout)}>
      <button
        type="button"
        role="menuitem"
        aria-label="Back"
        {...stylex.props(
          tool_bar.button,
          dynamic.bg_hover(toolbar.default, chrome.button_hover),
          dynamic.text(toolbar.icon),
        )}
      >
        <Icon name="arrow_back" {...stylex.props(tool_bar.icon)} />
      </button>
      <button
        type="button"
        role="menuitem"
        aria-label="Refresh"
        {...stylex.props(
          tool_bar.button,
          dynamic.bg_hover(toolbar.default, chrome.button_hover),
          dynamic.text(toolbar.icon),
          tool_bar.desktop_only,
        )}
      >
        <Icon name="refresh" {...stylex.props(tool_bar.icon)} />
      </button>
      <div role="menu" {...stylex.props(omni_box.layout)}>
        <div role="none" {...stylex.props(omni_box.button_left)}>
          {isNewTabPage ? (
            <button
              type="button"
              role="menuitem"
              aria-label="Google Search"
              {...stylex.props(
                omni_box.button,
                dynamic.bg_hover(toolbar.default, chrome.button_hover),
                dynamic.text(omnibox.text),
              )}
            >
              <Icon name="google" {...stylex.props(omni_box.icon)} />
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              aria-label="Page Info"
              {...stylex.props(
                omni_box.button,
                dynamic.bg_hover(toolbar.default, chrome.button_hover),
                dynamic.text(omnibox.text),
              )}
            >
              <Icon name="page_info" {...stylex.props(omni_box.icon)} />
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
          {...stylex.props(
            omni_box.input,
            dynamic.bg_hover(omnibox.background, chrome.input_hover),
            dynamic.text(omnibox.text),
          )}
        />
        {!isNewTabPage && (
          <div role="none" {...stylex.props(omni_box.button_right)}>
            <button
              type="button"
              role="menuitem"
              aria-label="Install"
              {...stylex.props(
                omni_box.button,
                omni_box.action,
                dynamic.text(omnibox.text),
              )}
            >
              <Icon name="install_desktop" {...stylex.props(omni_box.icon)} />
            </button>
            <button
              type="button"
              role="menuitem"
              aria-label="Bookmark"
              {...stylex.props(
                omni_box.button,
                omni_box.action,
                dynamic.text(omnibox.text),
              )}
            >
              <Icon name="star" {...stylex.props(omni_box.icon)} />
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        role="menuitem"
        aria-label="Media controls"
        {...stylex.props(
          tool_bar.button,
          dynamic.bg_hover(toolbar.default, chrome.button_hover),
          dynamic.text(toolbar.icon),
          tool_bar.desktop_only,
        )}
      >
        <Icon name="queue_music" {...stylex.props(tool_bar.icon)} />
      </button>
      <button
        type="button"
        role="menuitem"
        aria-label="Profile"
        {...stylex.props(
          tool_bar.button,
          dynamic.bg_hover(toolbar.default, chrome.button_hover),
          dynamic.text(toolbar.icon),
          tool_bar.desktop_only,
        )}
      >
        <Icon name="account_circle" {...stylex.props(tool_bar.icon)} />
      </button>
      <button
        type="button"
        role="menuitem"
        aria-label="Settings"
        {...stylex.props(
          tool_bar.button,
          dynamic.bg_hover(toolbar.default, chrome.button_hover),
          dynamic.text(toolbar.icon),
        )}
      >
        <Icon name="more_vert" {...stylex.props(tool_bar.icon)} />
      </button>
    </div>
  );
}

const tool_bar = stylex.create({
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
    borderRadius: '50%',
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

const omni_box = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
  },
  input: {
    borderRadius: '1.25rem',
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
      default: chrome.transparent,
      ':hover': chrome.button_hover,
    },
  },
});
