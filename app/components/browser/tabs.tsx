import * as stylex from '@stylexjs/stylex';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { MaterialIcons } from '~/icons/material';
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

type TabItems = {
  id: number;
  title: string;
  icon: MaterialIcons;
};

export function Tabs() {
  const [tabsList, setTabsList] = useState<TabItems[]>([
    { id: 1, title: 'New Tab', icon: 'chrome' },
    { id: 2, title: 'Internet', icon: 'globe' },
  ]);

  const [tabActive, setTabActive] = useState(1);

  const tabRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const activeTabElement = tabRefs.current[tabActive];
    if (activeTabElement) {
      const isMobile = window.innerWidth <= 768;

      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        inline: isMobile ? 'center' : 'nearest',
        block: 'nearest',
      });
    }
  }, [tabActive]);

  const setTabFocus = (tabId: number) => {
    const activeTabElement = tabRefs.current[tabId];
    if (activeTabElement) {
      activeTabElement.focus();
    }
  };

  const handleAddTab = () => {
    const newId = Date.now();
    setTabsList([...tabsList, { id: newId, title: 'New Tab', icon: 'chrome' }]);
    setTabActive(newId);
    setTabFocus(tabActive);
  };

  const handleCloseTab = (tabId: number) => {
    setTabsList((prevTabs) => {
      const closedIndex = prevTabs.findIndex((tab) => tab.id === tabId);
      const remainingTabs = prevTabs.filter((tab) => tab.id !== tabId);

      let newActiveId = tabActive;
      if (tabId === tabActive) {
        if (remainingTabs.length > 0) {
          const fallbackIndex = Math.max(0, closedIndex - 1);
          newActiveId = remainingTabs[fallbackIndex].id;
        } else {
          newActiveId = -1;
        }
      }

      setTabActive(newActiveId);
      if (newActiveId !== -1) {
        setTabFocus(newActiveId);
      }
      return remainingTabs;
    });
  };

  const getNextIndex = (key: string, currentIndex: number, length: number) => {
    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        return currentIndex > 0 ? currentIndex - 1 : length - 1;
      case 'ArrowDown':
      case 'ArrowRight':
        return currentIndex < length - 1 ? currentIndex + 1 : 0;
      case 'Home':
        return 0;
      case 'End':
        return length - 1;
      default:
        return currentIndex;
    }
  };

  const handleTabKeyNavigation = (
    event: KeyboardEvent<HTMLDivElement>,
    tabId: number,
  ) => {
    const currentIndex = tabsList.findIndex((t) => t.id === tabId);

    if (event.key === 'Delete') {
      event.preventDefault();
      handleCloseTab(tabId);
      return;
    }

    const nextIndex = getNextIndex(event.key, currentIndex, tabsList.length);
    if (nextIndex !== currentIndex) {
      event.preventDefault();
      const nextId = tabsList[nextIndex].id;
      setTabActive(nextId);
      setTabFocus(nextId);
    }
  };

  return (
    <div role="tablist" {...stylex.props(tab_list.layout)}>
      <div {...stylex.props(tab_action.layout)}>
        <button type="button" {...stylex.props(tab_action.button)}>
          <Icon name="arrow_down" {...stylex.props(tab_action.icon)} />
        </button>
      </div>

      {tabsList.map((t) => (
        <div
          key={t.id}
          ref={(el: HTMLDivElement | null) => {
            tabRefs.current[t.id] = el;
          }}
          role="tab"
          aria-selected={tabActive === t.id}
          tabIndex={tabActive === t.id ? 0 : -1}
          onClick={() => setTabActive(t.id)}
          onKeyDown={(e) => handleTabKeyNavigation(e, t.id)}
          {...stylex.props(
            tab_item.layout,
            tabActive === t.id ? tab_item.active : tab_item.inactive,
          )}
        >
          <Icon name={t.icon} {...stylex.props(tab_item.favicon)} />
          <span {...stylex.props(tab_item.title)}>{t.title}</span>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              handleCloseTab(t.id);
            }}
            {...stylex.props(tab_item.button)}
          >
            <Icon name="close" {...stylex.props(tab_item.icon)} />
          </button>
        </div>
      ))}

      <div {...stylex.props(new_tab.layout)}>
        <button
          type="button"
          onClick={handleAddTab}
          {...stylex.props(new_tab.button)}
        >
          <Icon name="add" {...stylex.props(new_tab.icon)} />
        </button>
      </div>
    </div>
  );
}
