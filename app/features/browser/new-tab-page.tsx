import * as stylex from '@stylexjs/stylex';
import { Icon } from '~/icons/material';

const new_tab_page = stylex.create({
  layout: {
    alignContent: 'baseline',
    backgroundColor: '#242526',
    display: 'grid',
    gap: '2rem',
    minHeight: 'calc(100dvh - 6.25rem)',
  },
});

const navigation = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    gap: '1rem',
    height: '4rem',
    justifyContent: 'flex-end',
    padding: '0 .875rem',
  },
  link: {
    color: '#f2f3f4',
    fontSize: '.75rem',
    lineHeight: '1.5rem',
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
      default: '#242526',
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
    backgroundColor: '#242526',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    height: '5.75rem',
    width: '17rem',
  },
});

const search = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
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
    minWidth: '30rem',
    padding: '.063rem 5.5rem .063rem 3.25rem',
    width: '100%',
  },
  button: {
    backgroundColor: '#0000',
    color: '#020304',
    height: '3rem',
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
  },
  mic: {
    right: '3rem',
  },
  camera: {
    right: '.75rem',
  },
});

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
        <Icon
          name="google_logo"
          width={272}
          height={92}
          {...stylex.props(doodle.image)}
        />
      </div>
      <div {...stylex.props(search.layout)}>
        <div {...stylex.props(search.box)}>
          <input
            id={input_id}
            type="search"
            placeholder="Search Google or type URL"
            autoComplete="off"
            spellCheck="false"
            {...stylex.props(search.input)}
          />
          <button type="button" {...stylex.props(search.button, search.query)}>
            <Icon name="search" {...stylex.props(search.icon)} />
          </button>
          <button type="button" {...stylex.props(search.button, search.mic)}>
            <Icon name="mic" {...stylex.props(search.icon)} />
          </button>
          <button type="button" {...stylex.props(search.button, search.camera)}>
            <Icon name="camera" {...stylex.props(search.icon)} />
          </button>
        </div>
      </div>
    </div>
  );
}
