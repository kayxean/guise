import type { State } from './types';

interface Subscribers {
  global: Set<() => void>;
  windows: Set<() => void>;
  workspaces: Set<() => void>;
  activeWorkspaceId: Set<() => void>;
  activeWindowId: Set<() => void>;
  lastZIndex: Set<() => void>;
}

export let store: State = {
  workspaces: { '1': { id: '1', name: '1', isActive: true, windows: [], root: null } },
  windows: {},
  activeWorkspaceId: '1',
  activeWindowId: null,
  lastZIndex: 0,
};

let subscribers: Subscribers | null = null;

const getSubscribers = (): Subscribers => {
  if (!subscribers) {
    subscribers = {
      global: new Set(),
      windows: new Set(),
      workspaces: new Set(),
      activeWorkspaceId: new Set(),
      activeWindowId: new Set(),
      lastZIndex: new Set(),
    };
  }
  return subscribers;
};

let rafHandle: number | null = null;
let pendingKeys: Set<keyof Subscribers> = new Set();

const notify = (): void => {
  if (rafHandle === null) {
    rafHandle = requestAnimationFrame(() => {
      rafHandle = null;
      const subs = getSubscribers();
      const keys = Array.from(pendingKeys);
      pendingKeys.clear();

      const hasChanges = keys.length > 0;
      if (hasChanges) {
        subs.global.forEach((fn) => fn());
        keys.forEach((key) => subs[key].forEach((fn) => fn()));
      }
    });
  }
};

const subscribe = (callback: () => void): (() => void) => {
  const subs = getSubscribers();
  subs.global.add(callback);
  return () => subs.global.delete(callback);
};

const subscribeToKey = (key: keyof Subscribers, callback: () => void): (() => void) => {
  const subs = getSubscribers();
  subs[key].add(callback);
  return () => subs[key].delete(callback);
};

const unsubscribeFromKey = (key: keyof Subscribers, callback: () => void): void => {
  const subs = getSubscribers();
  subs[key].delete(callback);
};

export const setStore = (updater: Partial<State>): void => {
  const keys: (keyof Subscribers)[] = [];
  let hasActualChanges = false;

  const newActiveWorkspaceId = updater.activeWorkspaceId;
  if (newActiveWorkspaceId !== undefined && newActiveWorkspaceId !== store.activeWorkspaceId) {
    store.activeWorkspaceId = newActiveWorkspaceId;
    keys.push('activeWorkspaceId');
    hasActualChanges = true;
  }
  const newActiveWindowId = updater.activeWindowId;
  if (newActiveWindowId !== undefined && newActiveWindowId !== store.activeWindowId) {
    store.activeWindowId = newActiveWindowId;
    keys.push('activeWindowId');
    hasActualChanges = true;
  }

  const newLastZIndex = updater.lastZIndex;
  if (newLastZIndex !== undefined && newLastZIndex !== store.lastZIndex) {
    store.lastZIndex = newLastZIndex;
    keys.push('lastZIndex');
    hasActualChanges = true;
  }
  const newWindows = updater.windows;
  if (newWindows !== undefined && newWindows !== store.windows) {
    store.windows = newWindows;
    keys.push('windows');
    hasActualChanges = true;
  }
  const newWorkspaces = updater.workspaces;
  if (newWorkspaces !== undefined && newWorkspaces !== store.workspaces) {
    store.workspaces = newWorkspaces;
    keys.push('workspaces');
    hasActualChanges = true;
  }

  if (hasActualChanges) {
    keys.forEach((key) => pendingKeys.add(key));
    notify();
  }
};

export const workspaceStore = {
  subscribe,
  subscribeToKey,
  unsubscribeFromKey,
  getState: () => store,
};
