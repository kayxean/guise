import type { KeyboardEvent, ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import type { Icons } from './components/icons';
import { LocalHost } from './contents/localhost';
import { NewTabPage } from './contents/new-tab-page';
import { createStore } from './store';

type TabState = {
  tabsList: {
    id: number;
    ntp: boolean;
    url: string | null;
    title: string;
    icon: Icons;
    content: ReactNode;
  }[];
  tabActive: number;
};

export const tabStore = createStore<TabState>({
  tabsList: [
    {
      id: 1,
      ntp: true,
      url: null,
      title: 'New Tab',
      icon: 'chrome',
      content: <NewTabPage />,
    },
    {
      id: 2,
      ntp: false,
      url: 'localhost:3000',
      title: 'Internet',
      icon: 'globe',
      content: <LocalHost />,
    },
  ],
  tabActive: 1,
});

export function useTabStore() {
  return useSyncExternalStore(tabStore.subscribe, tabStore.getSnapshot);
}

export const tabActions = {
  addTab() {
    tabStore.setState((s) => {
      const maxId =
        s.tabsList.length > 0 ? Math.max(...s.tabsList.map((t) => t.id)) : 0;

      const newId = maxId + 1;

      return {
        ...s,
        tabsList: [
          ...s.tabsList,
          {
            id: newId,
            ntp: true,
            url: null,
            title: 'New Tab',
            icon: 'chrome',
            content: <NewTabPage />,
          },
        ],
        tabActive: newId,
      };
    });
  },

  closeTab(id: number) {
    tabStore.setState((s) => {
      const closedIndex = s.tabsList.findIndex((t) => t.id === id);
      const remaining = s.tabsList.filter((t) => t.id !== id);

      let newActive = s.tabActive;
      if (id === s.tabActive) {
        if (remaining.length > 0) {
          const fallbackIndex = Math.max(0, closedIndex - 1);
          newActive = remaining[fallbackIndex].id;
        } else {
          newActive = -1;
        }
      }

      return {
        ...s,
        tabsList: remaining,
        tabActive: newActive,
      };
    });
  },

  activateTab(id: number) {
    tabStore.setState((s) => ({ ...s, tabActive: id }));
  },

  navigateTab(event: KeyboardEvent<HTMLDivElement>, tabId: number) {
    const { tabsList } = tabStore.getSnapshot();
    const currentIndex = tabsList.findIndex((t) => t.id === tabId);

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'Delete':
      case 'w':
        event.preventDefault();
        tabActions.closeTab(tabId);
        return;

      case 't':
        event.preventDefault();
        tabActions.addTab();
        return;

      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabsList.length - 1;
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = currentIndex < tabsList.length - 1 ? currentIndex + 1 : 0;
        break;

      case 'Home':
        nextIndex = 0;
        break;

      case 'End':
        nextIndex = tabsList.length - 1;
        break;

      default:
        return;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      tabActions.activateTab(tabsList[nextIndex].id);
    }
  },
};
