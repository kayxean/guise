import type { ComponentType, KeyboardEvent } from 'react';
import type { Icons } from './components/icons';
import { createStore } from '~/features/store';
import { CounterApp } from './contents/app-counter';
import { TodoApp } from './contents/app-todo';
import { NewTabPage } from './contents/new-tab-page';

interface Tab {
  id: number;
  ntp: boolean;
  url: string | null;
  title: string;
  icon: Icons;
  content: ComponentType;
}

interface TabState extends Record<string, unknown> {
  tabsList: Tab[];
  tabActive: number;
}

let nextTabId = 4;

const [useTabStore, apiTabStore] = createStore<TabState>({
  tabsList: [
    {
      id: 1,
      ntp: true,
      url: null,
      title: 'New Tab',
      icon: 'chrome',
      content: NewTabPage,
    },
    {
      id: 2,
      ntp: false,
      url: 'localhost:5173/counter',
      title: 'Counter',
      icon: 'globe',
      content: CounterApp,
    },
    {
      id: 3,
      ntp: false,
      url: 'localhost:5173/todo',
      title: 'Todo',
      icon: 'globe',
      content: TodoApp,
    },
  ],
  tabActive: 1,
});

export { useTabStore, apiTabStore };

export const tabActions = {
  addTab() {
    apiTabStore.setState((s) => {
      const newId = nextTabId++;
      return {
        tabsList: [
          ...s.tabsList,
          {
            id: newId,
            ntp: true,
            url: null,
            title: 'New Tab',
            icon: 'chrome',
            content: NewTabPage,
          },
        ],
        tabActive: newId,
      };
    });
  },

  closeTab(id: number) {
    apiTabStore.setState((s) => {
      const list = s.tabsList;
      const len = list.length;
      let closedIndex = -1;

      for (let i = 0; i < len; i++) {
        if (list[i].id === id) {
          closedIndex = i;
          break;
        }
      }

      if (closedIndex === -1) return s;

      const remaining = list.filter((t) => t.id !== id);
      let newActive = s.tabActive;

      if (id === s.tabActive) {
        if (remaining.length > 0) {
          const fallbackIndex = closedIndex === 0 ? 0 : closedIndex - 1;
          newActive = remaining[fallbackIndex].id;
        } else {
          newActive = -1;
        }
      }

      return {
        tabsList: remaining,
        tabActive: newActive,
      };
    });
  },

  activateTab(id: number) {
    if (apiTabStore.getState().tabActive !== id) {
      apiTabStore.setState({ tabActive: id });
    }
  },

  navigateTab(event: KeyboardEvent<HTMLElement>, tabId: number) {
    const { tabsList } = apiTabStore.getState();
    const len = tabsList.length;
    if (len === 0) return;

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
        nextIndex = (currentIndex - 1 + len) % len;
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % len;
        break;

      case 'Home':
        nextIndex = 0;
        break;

      case 'End':
        nextIndex = len - 1;
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
