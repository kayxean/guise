import * as stylex from '@stylexjs/stylex';
import { Icon } from '~/icons/material';

const tabs = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '.375rem',
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

const action = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'sticky',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#242526',
    borderRadius: '.625rem',
    display: 'inline-flex',
    height: '1.75rem',
    justifyContent: 'center',
    width: '1.75rem',
  },
  icon: {
    height: '1.125rem',
    width: '1.125rem',
  },
});

const tab = stylex.create({
  layout: {
    alignItems: 'center',
    backgroundColor: '#242526',
    borderRadius: '.625rem',
    display: 'flex',
    gap: '.375rem',
    height: '1.75rem',
    padding: '0 .375rem',
  },
  favicon: {
    display: 'inline-flex',
    height: '1.125rem',
    width: '1.125rem',
  },
  title: {
    display: 'inline-flex',
    fontSize: '.875rem',
    fontWeight: 400,
    lineHeight: '1.125rem',
    minWidth: '10.625rem',
    userSelect: 'none',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    display: 'inline-flex',
    height: '1.125rem',
    justifyContent: 'center',
    width: '1.125rem',
  },
  icon: {
    height: '.875rem',
    width: '.875rem',
  },
});

export function Tabs() {
  return (
    <div {...stylex.props(tabs.layout)}>
      <div {...stylex.props(action.layout)}>
        <button type="button" {...stylex.props(action.button)}>
          <Icon name="arrow_down" {...stylex.props(action.icon)} />
        </button>
      </div>
      <div {...stylex.props(tab.layout)}>
        <Icon name="chrome" {...stylex.props(tab.favicon)} />
        <span {...stylex.props(tab.title)}>New Tab</span>
        <button type="button" {...stylex.props(tab.button)}>
          <Icon name="close" {...stylex.props(tab.icon)} />
        </button>
      </div>
      <div {...stylex.props(tab.layout)}>
        <Icon name="globe" {...stylex.props(tab.favicon)} />
        <span {...stylex.props(tab.title)}>Internet</span>
        <button type="button" {...stylex.props(tab.button)}>
          <Icon name="close" {...stylex.props(tab.icon)} />
        </button>
      </div>
    </div>
  );
}
