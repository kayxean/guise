import * as stylex from '@stylexjs/stylex';
import { Icon } from '../components/button';
import { Doodle } from '../components/doodle';

export function NewTabPage() {
  const input_id = new Date().toISOString();

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
        <Doodle {...stylex.props(doodle.image)} />
      </div>
      <div {...stylex.props(search.layout)}>
        <div {...stylex.props(search.box)}>
          <button
            type="button"
            aria-label="Search"
            tabIndex={-1}
            {...stylex.props(search.button_left, search.query)}
          >
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
          <button
            type="button"
            aria-label="Microphone"
            tabIndex={-1}
            {...stylex.props(search.button_right, search.mic)}
          >
            <Icon name="mic" {...stylex.props(search.icon)} />
          </button>
          <button
            type="button"
            aria-label="Camera"
            tabIndex={-1}
            {...stylex.props(search.button_right, search.camera)}
          >
            <Icon name="camera" {...stylex.props(search.icon)} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            {...stylex.props(search.button_right, search.ai_mode)}
          >
            <Icon name="search_spark" {...stylex.props(search.icon)} />
            <span {...stylex.props(search.ai_label)}>AI Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const new_tab_page = stylex.create({
  layout: {
    alignContent: 'baseline',
    backgroundColor: '#121314',
    display: 'grid',
    gap: '2.5rem',
    minHeight: 'calc(100dvh - 7.688rem)',
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
    color: '#f2f3f4',
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
      default: '#121314',
      ':hover': '#464748',
    },
    borderRadius: '50%',
    color: '#f2f3f4',
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
    backgroundColor: '#000',
    borderRadius: '50%',
    height: '2rem',
    width: '2rem',
  },
});

const doodle = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 1rem',
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
    backgroundColor: '#f2f3f4',
    borderRadius: '1.5rem',
    color: '#020304',
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
  },
  button_left: {
    alignItems: 'center',
    backgroundColor: '#0000',
    color: '#020304',
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
    backgroundColor: '#0000',
    color: '#020304',
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
    backgroundColor: '#e1e2e3',
    borderRadius: '1rem',
    padding: '0 .75rem 0 .5rem',
    right: '.75rem',
  },
  ai_label: {
    fontSize: '1rem',
  },
});
