import type { WorkspaceState } from './types';

interface Subscribers {
  global: Set<() => void>;
  windows: Set<() => void>;
  workspaces: Set<() => void>;
  activeWorkspaceId: Set<() => void>;
  activeWindowId: Set<() => void>;
  lastZIndex: Set<() => void>;
}

export let compositor: WorkspaceState = {
  workspaces: { '1': { id: '1', name: '1', isActive: true, windows: [], root: null } },
  windows: {},
  activeWorkspaceId: '1',
  activeWindowId: null,
  lastZIndex: 0,
};

let subscribers: Subscribers = {
  global: new Set(),
  windows: new Set(),
  workspaces: new Set(),
  activeWorkspaceId: new Set(),
  activeWindowId: new Set(),
  lastZIndex: new Set(),
};

let rafHandle: number | null = null;
let pendingKeys: Set<keyof Subscribers> = new Set();
let activeWindowIdRef: string | null = null;

const notify = (): void => {
  if (rafHandle === null) {
    rafHandle = requestAnimationFrame(() => {
      rafHandle = null;
      const keys = Array.from(pendingKeys);
      pendingKeys.clear();

      const hasChanges = keys.length > 0;
      if (hasChanges) {
        activeWindowIdRef = compositor.activeWindowId;

        subscribers.global.forEach((fn) => fn());
        keys.forEach((key) => subscribers[key].forEach((fn) => fn()));
      }
    });
  }
};

const subscribe = (callback: () => void): (() => void) => {
  subscribers.global.add(callback);
  return () => subscribers.global.delete(callback);
};

const subscribeToKey = (key: keyof Subscribers, callback: () => void): (() => void) => {
  subscribers[key].add(callback);
  return () => subscribers[key].delete(callback);
};

export const setCompositor = (updater: Partial<WorkspaceState>): void => {
  const keys: (keyof Subscribers)[] = [];
  let hasActualChanges = false;

  const newActiveWorkspaceId = updater.activeWorkspaceId;
  if (newActiveWorkspaceId !== undefined && newActiveWorkspaceId !== compositor.activeWorkspaceId) {
    compositor.activeWorkspaceId = newActiveWorkspaceId;
    keys.push('activeWorkspaceId');
    hasActualChanges = true;
  }
  const newActiveWindowId = updater.activeWindowId;
  if (newActiveWindowId !== undefined && newActiveWindowId !== compositor.activeWindowId) {
    compositor.activeWindowId = newActiveWindowId;
    keys.push('activeWindowId');
    hasActualChanges = true;
  }

  const newLastZIndex = updater.lastZIndex;
  if (newLastZIndex !== undefined && newLastZIndex !== compositor.lastZIndex) {
    compositor.lastZIndex = newLastZIndex;
    keys.push('lastZIndex');
    hasActualChanges = true;
  }
  const newWindows = updater.windows;
  if (newWindows !== undefined && newWindows !== compositor.windows) {
    compositor.windows = newWindows;
    keys.push('windows');
    hasActualChanges = true;
  }
  const newWorkspaces = updater.workspaces;
  if (newWorkspaces !== undefined && newWorkspaces !== compositor.workspaces) {
    compositor.workspaces = newWorkspaces;
    keys.push('workspaces');
    hasActualChanges = true;
  }

  if (hasActualChanges) {
    keys.forEach((key) => pendingKeys.add(key));
    notify();
  }
};

export const workspaceStoreSubscribers = {
  subscribe,
  subscribeToKey,
  getState: () => compositor,
  getActiveWindowId: () => activeWindowIdRef,
};
