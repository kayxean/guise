import type { KeyboardEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef } from 'react';
import { tabActions, useTabStore } from '../tabs';
import { useThemeStore } from '../themes';
import { chrome, dynamic } from '../tokens.stylex';
import { Icon } from './icons';

export function TabList() {
  const tabsList = useTabStore((state) => state.tabsList);
  const tabActive = useTabStore((state) => state.tabActive);

  const frame = useThemeStore((state) => state.frame);
  const toolbar = useThemeStore((state) => state.toolbar);
  const tab = useThemeStore((state) => state.tab);
  const background_tab = useThemeStore((state) => state.background_tab);
  const tab_background_text = useThemeStore(
    (state) => state.tab_background_text,
  );

  const lastIntentRef = useRef<'mount' | 'keyboard' | 'mouse' | null>('mount');
  const tabRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const onTabClick = (id: number) => {
    lastIntentRef.current = 'mouse';
    tabActions.activateTab(id);
  };
  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: number) => {
    lastIntentRef.current = 'keyboard';
    tabActions.navigateTab(e, id);
  };

  useLayoutEffect(() => {
    const intent = lastIntentRef.current;
    if (intent === 'mount') return;

    const ref = tabRefs.current[tabActive];
    if (!ref) return;

    if (intent === 'keyboard') {
      requestAnimationFrame(() => {
        ref.focus();
      });
    }

    const isMobile = window.innerWidth <= 768;
    requestAnimationFrame(() => {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: isMobile ? 'center' : 'nearest',
      });
    });

    lastIntentRef.current = null;
  }, [tabActive]);

  return (
    <div
      role="tablist"
      {...stylex.props(tab_list.layout, dynamic.bg(frame.default))}
    >
      <div role="none" {...stylex.props(tab_action.layout)}>
        <button
          type="button"
          role="tab"
          aria-label="Tab options"
          {...stylex.props(
            tab_action.button,
            dynamic.bg(toolbar.default),
            dynamic.text(tab.text),
          )}
        >
          <Icon name="arrow_down" {...stylex.props(tab_action.icon)} />
          <span
            {...stylex.props(
              tab_action.overlay,
              dynamic.image(
                `linear-gradient(90deg, ${frame.default} 70%, ${chrome.transparent})`,
              ),
            )}
          />
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
            onClick={() => onTabClick(t.id)}
            onKeyDown={(e) => onTabKeyDown(e, t.id)}
            {...stylex.props(
              tab_item.layout,
              isActive
                ? dynamic.bg(toolbar.default)
                : dynamic.bg(background_tab.default),
              isActive
                ? dynamic.text(tab.text)
                : dynamic.text_hover(tab_background_text.default, tab.text),
            )}
          >
            <Icon
              name={t.icon}
              {...stylex.props(tab_item.favicon, dynamic.text(toolbar.icon))}
            />
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
              <Icon name="close_small" {...stylex.props(tab_item.icon)} />
            </button>
            {isActive && (
              <div
                {...stylex.props(tab_item.status, dynamic.bg(toolbar.default))}
              >
                <span
                  {...stylex.props(
                    tab_item.corner,
                    tab_item.corner_left,
                    dynamic.border(toolbar.default),
                  )}
                ></span>
                <span {...stylex.props(tab_item.space)}></span>
                <span
                  {...stylex.props(
                    tab_item.corner,
                    tab_item.corner_right,
                    dynamic.border(toolbar.default),
                  )}
                ></span>
              </div>
            )}
          </div>
        );
      })}

      <div role="none" {...stylex.props(new_tab.layout)}>
        <button
          type="button"
          role="tab"
          aria-label="Open new tab"
          onClick={() => {
            tabActions.addTab();
          }}
          {...stylex.props(
            new_tab.button,
            dynamic.bg(background_tab.default),
            dynamic.text(tab_background_text.default),
          )}
        >
          <Icon name="add_small" {...stylex.props(new_tab.icon)} />
          <span
            {...stylex.props(
              new_tab.overlay,
              dynamic.image(
                `linear-gradient(-90deg, ${frame.default} 70%, ${chrome.transparent})`,
              ),
            )}
          />
        </button>
      </div>
    </div>
  );
}

const tab_list = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '.375rem',
    maxWidth: '100%',
    overflowX: 'auto',
    overscrollBehavior: 'contain',
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
  },
  button: {
    alignItems: 'center',
    borderRadius: '.625rem',
    display: 'inline-flex',
    height: '1.75rem',
    justifyContent: 'center',
    position: 'relative',
    width: '1.75rem',
    ':hover:after': {
      backgroundColor: chrome.button_hover,
      borderRadius: '.625rem',
      bottom: 0,
      content: '""',
      left: 0,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 2,
    },
  },
  icon: {
    height: '1.125rem',
    width: '1.125rem',
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

const tab_item = stylex.create({
  layout: {
    alignItems: 'center',
    borderRadius: '.625rem',
    display: 'flex',
    gap: '.375rem',
    height: '1.75rem',
    outline: 'none',
    padding: '0 .375rem',
    position: 'relative',
    scrollMarginLeft: '2.625rem',
    scrollMarginRight: '2.625rem',
    zIndex: 0,
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
    minWidth: {
      default: '6rem',
      '@media (width >= 48em)': '10.6rem',
    },
    userSelect: 'none',
  },
  button: {
    alignItems: 'center',
    backgroundColor: {
      default: chrome.transparent,
      ':hover': chrome.button_hover,
    },
    borderRadius: '50%',
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    height: '1.25rem',
    justifyContent: 'center',
    width: '1.25rem',
  },
  icon: {
    height: '1.25rem',
    width: '1.25rem',
  },
  status: {
    alignItems: 'flex-end',
    bottom: '-.375rem',
    display: 'flex',
    left: 0,
    height: '1rem',
    justifyContent: 'space-between',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    zIndex: -1,
  },
  space: {
    display: 'inline-flex',
    flexGrow: 1,
  },
  corner: {
    display: 'inline-flex',
    height: '.75rem',
    overflow: 'hidden',
    position: 'relative',
    width: '.75rem',
    ':after': {
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: '.375rem',
      borderColor: 'inherit',
      content: '""',
      height: '200%',
      position: 'absolute',
      top: 0,
      transform: 'scale(2.005)',
      width: '200%',
    },
  },
  corner_left: {
    marginLeft: '-.75rem',
    ':after': {
      right: '-100%',
      transformOrigin: 'bottom right',
    },
  },
  corner_right: {
    marginRight: '-.75rem',
    ':after': {
      left: '-100%',
      transformOrigin: 'bottom left',
    },
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
  },
  button: {
    alignItems: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'inline-flex',
    height: '1.75rem',
    justifyContent: 'center',
    position: 'relative',
    width: '1.75rem',
    ':hover:after': {
      backgroundColor: chrome.button_hover,
      borderRadius: '50%',
      bottom: 0,
      content: '""',
      left: 0,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 2,
    },
  },
  icon: {
    height: '1.125rem',
    width: '1.125rem',
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
