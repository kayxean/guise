import type { WorkspaceState } from './types';
import { workspaceCompositorActions } from './compositor';

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

const notify = () => {
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

  if ('activeWorkspaceId' in updater) {
    keys.push('activeWorkspaceId');
    hasActualChanges = true;
  }
  if ('activeWindowId' in updater) {
    keys.push('activeWindowId');
    hasActualChanges = true;
  }

  if ('lastZIndex' in updater && updater.lastZIndex !== compositor.lastZIndex) {
    keys.push('lastZIndex');
    hasActualChanges = true;
  }
  if ('windows' in updater && updater.windows !== compositor.windows) {
    keys.push('windows');
    hasActualChanges = true;
  }
  if ('workspaces' in updater && updater.workspaces !== compositor.workspaces) {
    keys.push('workspaces');
    hasActualChanges = true;
  }

  if (hasActualChanges) {
    compositor = { ...compositor, ...updater };
    keys.forEach((key) => pendingKeys.add(key));
    notify();
  }
};

export const workspaceStoreActions = workspaceCompositorActions;

export const workspaceStoreSubscribers = {
  subscribe,
  subscribeToKey,
  getState: () => compositor,
  getActiveWindowId: () => activeWindowIdRef,
};
