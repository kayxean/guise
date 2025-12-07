import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import { tabActions, useTabStore } from './store';
import { Icon } from '~/icons/material';

const tab_list = stylex.create({
  layout: {
    alignItems: 'center',
    backgroundColor: '#000000',
    color: '#a4a5a6',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '.375rem',
    maxWidth: '100%',
    overflowX: 'auto',
    padding: '.375rem .5rem',
    position: 'relative',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const tab_action = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
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
    borderRadius: '.625rem',
    color: 'inherit',
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

const tab_item = stylex.create({
  active: {
    color: '#f2f3f4',
  },
  inactive: {
    color: {
      default: '#a4a5a6',
      ':hover': '#f2f3f4',
    },
  },
  layout: {
    alignItems: 'center',
    backgroundColor: '#242526',
    borderRadius: '.625rem',
    display: 'flex',
    gap: '.375rem',
    height: '1.75rem',
    padding: '0 .375rem',
    scrollMarginLeft: '2.625rem',
    scrollMarginRight: '2.625rem',
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
    backgroundColor: {
      default: '#242526',
      ':hover': '#464748',
    },
    borderRadius: '50%',
    color: 'inherit',
    cursor: 'pointer',
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

const new_tab = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'sticky',
    right: 0,
    zIndex: 2,
    ':after': {
      backgroundImage: 'linear-gradient(-90deg, #000 70%, #0000)',
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
    height: '.875rem',
    width: '.875rem',
  },
});

export function TabList() {
  const { tabsList, tabActive } = useTabStore();

  const tabRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const ref = tabRefs.current[tabActive];
    if (ref) {
      ref.focus();
      const isMobile = window.innerWidth <= 768;
      ref.scrollIntoView({
        behavior: 'smooth',
        inline: isMobile ? 'center' : 'nearest',
        block: 'nearest',
      });
    }
  }, [tabActive]);

  return (
    <div role="tablist" {...stylex.props(tab_list.layout)}>
      <div role="none" {...stylex.props(tab_action.layout)}>
        <button
          type="button"
          aria-label="Tab options"
          {...stylex.props(tab_action.button)}
        >
          <Icon name="arrow_down" {...stylex.props(tab_action.icon)} />
        </button>
      </div>

      {tabsList.map((t) => {
        const isActive = tabActive === t.id;
        return (
          <div
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${t.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => tabActions.activateTab(t.id)}
            onKeyDown={(e) => tabActions.navigateTab(e, t.id)}
            {...stylex.props(
              tab_item.layout,
              isActive ? tab_item.active : tab_item.inactive,
            )}
          >
            <Icon name={t.icon} {...stylex.props(tab_item.favicon)} />
            <span {...stylex.props(tab_item.title)}>{t.title}</span>
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                tabActions.closeTab(t.id);
              }}
              {...stylex.props(tab_item.button)}
            >
              <Icon name="close" {...stylex.props(tab_item.icon)} />
            </button>
          </div>
        );
      })}

      <div role="none" {...stylex.props(new_tab.layout)}>
        <button
          type="button"
          aria-label="Open new tab"
          onClick={() => {
            tabActions.addTab();
          }}
          {...stylex.props(new_tab.button)}
        >
          <Icon name="add" {...stylex.props(new_tab.icon)} />
        </button>
      </div>
    </div>
  );
}
