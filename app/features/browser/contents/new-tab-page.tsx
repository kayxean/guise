import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';
import { createToken } from '~/features/utils';
import { Icon } from '../components/icons';
import { chrome, colors } from '../tokens.stylex';

export function NewTabPage() {
  const input_id = useMemo(() => createToken(), []);

  return (
    <div {...stylex.props(new_tab_page.layout)}>
      <div {...stylex.props(navigation.layout)}>
        <a
          href="https://mail.google.com/mail/?tab=rm&ogbl"
          target="_blank"
          rel="noreferrer noopener"
          {...stylex.props(navigation.link)}
        >
          Gmail
        </a>
        <a
          href="https://www.google.com/imghp?hl=en&tab=ri&ogbl"
          target="_blank"
          rel="noreferrer noopener"
          {...stylex.props(navigation.link)}
        >
          Images
        </a>
        <div {...stylex.props(navigation.group)}>
          <a
            href="https://labs.google.com/search?source=ntp"
            target="_blank"
            rel="noreferrer noopener"
            {...stylex.props(navigation.button)}
          >
            <Icon name="search_labs" {...stylex.props(navigation.icon)} />
          </a>
          <button type="button" {...stylex.props(navigation.button)}>
            <Icon name="apps" {...stylex.props(navigation.icon)} />
          </button>
          <button type="button" {...stylex.props(navigation.button)}>
            <Icon name="person" {...stylex.props(navigation.person)} />
          </button>
        </div>
      </div>
      <div {...stylex.props(doodle.layout)}>
        <svg
          role="img"
          aria-label="Google"
          width={272}
          height={92}
          viewBox="0 0 272 92"
          {...stylex.props(doodle.image)}
        >
          <path
            d="M35.29 41.41V32H67C67.31 33.64 67.47 35.58 67.47 37.68C67.47 44.74 65.54 53.47 59.32 59.69C53.27 65.99 45.54 69.35 35.3 69.35C16.32 69.35 0.359985 53.89 0.359985 34.91C0.359985 15.93 16.32 0.469971 35.3 0.469971C45.8 0.469971 53.28 4.58997 58.9 9.95997L52.26 16.6C48.23 12.82 42.77 9.87997 35.29 9.87997C21.43 9.87997 10.59 21.05 10.59 34.91C10.59 48.77 21.43 59.94 35.29 59.94C44.28 59.94 49.4 56.33 52.68 53.05C55.34 50.39 57.09 46.59 57.78 41.4L35.29 41.41Z"
            fill="currentColor"
          />
          <path
            d="M115.75 47.18C115.75 59.95 105.76 69.36 93.5 69.36C81.24 69.36 71.25 59.95 71.25 47.18C71.25 34.32 81.24 25 93.5 25C105.76 25 115.75 34.32 115.75 47.18ZM106.01 47.18C106.01 39.2 100.22 33.74 93.5 33.74C86.78 33.74 80.99 39.2 80.99 47.18C80.99 55.08 86.78 60.62 93.5 60.62C100.22 60.62 106.01 55.07 106.01 47.18Z"
            fill="currentColor"
          />
          <path
            d="M163.75 47.18C163.75 59.95 153.76 69.36 141.5 69.36C129.24 69.36 119.25 59.95 119.25 47.18C119.25 34.33 129.24 25 141.5 25C153.76 25 163.75 34.32 163.75 47.18ZM154.01 47.18C154.01 39.2 148.22 33.74 141.5 33.74C134.78 33.74 128.99 39.2 128.99 47.18C128.99 55.08 134.78 60.62 141.5 60.62C148.22 60.62 154.01 55.07 154.01 47.18Z"
            fill="currentColor"
          />
          <path
            d="M209.75 26.34V66.16C209.75 82.54 200.09 89.23 188.67 89.23C177.92 89.23 171.45 82.04 169.01 76.16L177.49 72.63C179 76.24 182.7 80.5 188.66 80.5C195.97 80.5 200.5 75.99 200.5 67.5V64.31H200.16C197.98 67 193.78 69.35 188.48 69.35C177.39 69.35 167.23 59.69 167.23 47.26C167.23 34.74 177.39 25 188.48 25C193.77 25 197.97 27.35 200.16 29.96H200.5V26.35H209.75V26.34ZM201.19 47.26C201.19 39.45 195.98 33.74 189.35 33.74C182.63 33.74 177 39.45 177 47.26C177 54.99 182.63 60.62 189.35 60.62C195.98 60.62 201.19 54.99 201.19 47.26Z"
            fill="currentColor"
          />
          <path d="M225 3V68H215.5V3H225Z" fill="currentColor" />
          <path
            d="M262.02 54.48L269.58 59.52C267.14 63.13 261.26 69.35 251.1 69.35C238.5 69.35 229.09 59.61 229.09 47.17C229.09 33.98 238.58 24.99 250.01 24.99C261.52 24.99 267.15 34.15 268.99 39.1L270 41.62L240.35 53.9C242.62 58.35 246.15 60.62 251.1 60.62C256.06 60.62 259.5 58.18 262.02 54.48ZM238.75 46.5L258.57 38.27C257.48 35.5 254.2 33.57 250.34 33.57C245.39 33.57 238.5 37.94 238.75 46.5Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div {...stylex.props(search.layout)}>
        <div {...stylex.props(search.box)}>
          <button type="button" aria-label="Search" tabIndex={-1} {...stylex.props(search.button_left, search.query)}>
            <Icon name="search" {...stylex.props(search.icon)} />
          </button>
          <input
            id={input_id}
            type="search"
            placeholder="Search Google or type URL"
            autoComplete="off"
            spellCheck="false"
            {...stylex.props(search.input)}
          />
          <button type="button" aria-label="Microphone" {...stylex.props(search.button_right, search.mic)}>
            <Icon name="mic" {...stylex.props(search.icon)} />
          </button>
          <button type="button" aria-label="Camera" {...stylex.props(search.button_right, search.camera)}>
            <Icon name="camera" {...stylex.props(search.icon)} />
          </button>
          <button type="button" {...stylex.props(search.button_right, search.ai_mode)}>
            <Icon name="search_spark" {...stylex.props(search.icon)} />
            <span {...stylex.props(search.ai_label)}>AI Mode</span>
          </button>
        </div>
      </div>
      <div {...stylex.props(shortcuts.layout)}>
        <button type="button" {...stylex.props(shortcuts.button)}>
          <div {...stylex.props(shortcuts.view)}>
            <Icon name="add" {...stylex.props(shortcuts.icon)} />
          </div>
          <span {...stylex.props(shortcuts.text)}>Add shortcut</span>
        </button>
      </div>
    </div>
  );
}

const new_tab_page = stylex.create({
  layout: {
    alignContent: 'baseline',
    backgroundColor: colors.ntp_background,
    display: 'grid',
    gap: '1rem',
    minHeight: 'calc(100dvh - 7.625rem)',
  },
});

const navigation = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    gap: '.875rem',
    height: '4rem',
    justifyContent: 'flex-end',
    padding: '0 .875rem',
  },
  link: {
    color: chrome.ntp_link,
    display: {
      default: 'inline-flex',
      '@media (width <= 20em)': 'none',
    },
    fontSize: '.75rem',
    lineHeight: '1.5rem',
    padding: '0 .125rem',
    textDecoration: {
      default: 'none',
      ':hover': 'underline',
    },
  },
  group: {
    alignItems: 'center',
    display: 'flex',
    gap: '.5rem',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: {
      default: colors.ntp_background,
      ':hover': chrome.button_hover,
    },
    borderRadius: '50%',
    color: chrome.ntp_button_icon,
    cursor: 'pointer',
    display: 'inline-flex',
    height: '2.5rem',
    justifyContent: 'center',
    textDecoration: 'none',
    width: '2.5rem',
  },
  icon: {
    height: '1.5rem',
    width: '1.5rem',
  },
  person: {
    backgroundColor: chrome.ntp_profile_background,
    borderRadius: '50%',
    height: '2rem',
    width: '2rem',
  },
});

const doodle = stylex.create({
  layout: {
    alignItems: 'center',
    color: chrome.ntp_doodle,
    display: 'flex',
    justifyContent: 'center',
    padding: '1.5rem 1rem',
  },
  image: {
    height: {
      default: 'auto',
      '@media (width >= 20em)': '5.75rem',
    },
    width: {
      default: '12rem',
      '@media (width >= 20em)': '17rem',
    },
  },
});

const search = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 1rem',
  },
  box: {
    position: 'relative',
  },
  input: {
    appearance: 'none',
    backgroundColor: chrome.ntp_omnibox_background,
    borderRadius: '1.5rem',
    color: chrome.ntp_omnibox_text,
    fontSize: '1rem',
    height: '3rem',
    minWidth: {
      default: 'calc(100dvw - 2rem)',
      '@media (width >= 32em)': '28rem',
      '@media (width >= 40em)': '36rem',
      '@media (width >= 48em)': '45rem',
    },
    outline: 'none',
    paddingTop: '.063rem',
    paddingRight: {
      default: '.063rem',
      '@media (width >= 24em)': '5.5rem',
      '@media (width >= 40em)': '12.75rem',
    },
    paddingBottom: '.063rem',
    paddingLeft: {
      default: '1rem',
      '@media (width >= 20em)': '3.25rem',
    },
    width: '100%',
    '::placeholder': {
      color: chrome.ntp_omnibox_placeholder,
    },
  },
  button_left: {
    alignItems: 'center',
    backgroundColor: chrome.transparent,
    color: chrome.ntp_omnibox_action,
    cursor: 'pointer',
    display: {
      default: 'inline-flex',
      '@media (width <= 20em)': 'none',
    },
    height: '3rem',
    justifyContent: 'center',
    position: 'absolute',
    width: '2rem',
    zIndex: 2,
  },
  icon: {
    height: '1.25rem',
    width: '1.25rem',
  },
  query: {
    left: '.75rem',
    pointerEvents: 'none',
  },
  button_right: {
    alignItems: 'center',
    backgroundColor: chrome.transparent,
    color: chrome.ntp_omnibox_action_alt,
    cursor: 'pointer',
    display: {
      default: 'inline-flex',
      '@media (width <= 24em)': 'none',
    },
    height: '2rem',
    justifyContent: 'center',
    position: 'absolute',
    top: '.5rem',
    zIndex: 2,
  },
  mic: {
    right: {
      default: '3.125rem',
      '@media (width >= 40em)': '10.25rem',
    },
    width: '2rem',
  },
  camera: {
    right: {
      default: '.75rem',
      '@media (width >= 40em)': '7.75rem',
    },
    width: '2rem',
  },
  ai_mode: {
    display: {
      default: 'inline-flex',
      '@media (width <= 40em)': 'none',
    },
    backgroundColor: chrome.ntp_omnibox_ai_mode,
    borderRadius: '1rem',
    padding: '0 .75rem 0 .5rem',
    right: '.75rem',
  },
  ai_label: {
    fontSize: '1rem',
  },
});

const shortcuts = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: {
      default: colors.ntp_background,
      ':hover': chrome.button_hover,
    },
    borderRadius: '.375rem',
    display: 'inline-flex',
    color: chrome.ntp_button_icon,
    cursor: 'pointer',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    padding: '1rem',
  },
  view: {
    alignItems: 'center',
    backgroundColor: chrome.ntp_button_background,
    borderRadius: '50%',
    display: 'flex',
    height: '3rem',
    justifyContent: 'center',
    width: '3rem',
  },
  icon: {
    height: '1.25rem',
    width: '1.25rem',
  },
  text: {
    color: colors.ntp_text,
  },
});
