import { useSyncExternalStore } from 'react';
import type { Workspace, WindowState, TreeNode, WorkspaceActions } from './types';
import { getLeaves, splitNode, splitNodeAtWindow, removeLeaf, calculateLayout } from './tree';

interface WorkspaceState {
  workspaces: Record<string, Workspace>;
  windows: Record<string, WindowState>;
  activeWorkspaceId: string;
  activeWindowId: string | null;
  lastZIndex: number;
}

interface Subscribers {
  global: Set<() => void>;
  windows: Set<() => void>;
  workspaces: Set<() => void>;
  activeWorkspaceId: Set<() => void>;
  activeWindowId: Set<() => void>;
  lastZIndex: Set<() => void>;
}

let state: WorkspaceState = {
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
        // Sync activeWindowIdRef immediately for dispatcher
        activeWindowIdRef = state.activeWindowId;

        subscribers.global.forEach((fn) => fn());
        keys.forEach((key) => subscribers[key].forEach((fn) => fn()));
      }
    });
  }
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const shallowEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if ((a as Record<string, unknown>)[key] !== (b as Record<string, unknown>)[key]) return false;
  }

  return true;
};

const setState = (updater: Partial<WorkspaceState>): void => {
  const keys: (keyof Subscribers)[] = [];
  let hasActualChanges = false;

  // CRITICAL: Always process these regardless of shallowEqual
  // These are essential for user interaction (workspace/window switching)
  if ('activeWorkspaceId' in updater) {
    keys.push('activeWorkspaceId');
    hasActualChanges = true;
  }
  if ('activeWindowId' in updater) {
    keys.push('activeWindowId');
    hasActualChanges = true;
  }

  // NON-CRITICAL: Can use shallowEqual optimization
  // These are data-heavy and can be optimized
  if ('lastZIndex' in updater && updater.lastZIndex !== state.lastZIndex) {
    keys.push('lastZIndex');
    hasActualChanges = true;
  }
  if ('windows' in updater && !shallowEqual(updater.windows, state.windows)) {
    keys.push('windows');
    hasActualChanges = true;
  }
  if ('workspaces' in updater && !shallowEqual(updater.workspaces, state.workspaces)) {
    keys.push('workspaces');
    hasActualChanges = true;
  }

  if (hasActualChanges) {
    state = { ...state, ...updater };
    keys.forEach((key) => pendingKeys.add(key));
    notify();
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

const ensureWorkspaceExists = (
  workspaces: Record<string, Workspace>,
  workspaceId: string,
): Record<string, Workspace> => {
  if (workspaces[workspaceId]) return workspaces;

  const result = { ...workspaces };
  result[workspaceId] = {
    id: workspaceId,
    name: workspaceId,
    isActive: false,
    windows: [],
    root: null,
  };
  return result;
};

let lastKnownDimensions: { width: number; height: number } | null = null;

const recalculateWindowPositions = () => {
  const currentDimensions = { width: window.innerWidth, height: window.innerHeight };

  if (
    lastKnownDimensions &&
    lastKnownDimensions.width === currentDimensions.width &&
    lastKnownDimensions.height === currentDimensions.height
  ) {
    return;
  }
  lastKnownDimensions = currentDimensions;

  const activeWorkspace = state.workspaces[state.activeWorkspaceId];
  if (!activeWorkspace?.root) return;

  const layout = calculateLayout(activeWorkspace.root);
  const repositionedWindows: Record<string, WindowState> = {};
  let hasChanges = false;

  for (const windowId of activeWorkspace.windows) {
    const rect = layout.get(windowId);
    const existingWindow = state.windows[windowId];
    if (rect && existingWindow) {
      const newWindow = {
        ...existingWindow,
        position: rect.position,
        size: rect.size,
      };
      if (
        newWindow.position.x !== existingWindow.position.x ||
        newWindow.position.y !== existingWindow.position.y ||
        newWindow.size.width !== existingWindow.size.width ||
        newWindow.size.height !== existingWindow.size.height
      ) {
        hasChanges = true;
      }
      repositionedWindows[windowId] = newWindow;
    }
  }

  if (hasChanges) {
    setState({ windows: { ...state.windows, ...repositionedWindows } });
  }
};

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(recalculateWindowPositions, 16);
  });
}

const createWindow = (appId: string, title: string, shouldFocus = true): string => {
  const activeWorkspace = state.workspaces[state.activeWorkspaceId];
  const newWindowId = generateId();
  const nextZIndex = state.lastZIndex + 1;

  let layoutTree: TreeNode | null = null;
  let windowIdsInWorkspace: string[] = [];

  if (activeWorkspace.windows.length === 0) {
    layoutTree = { id: newWindowId, children: [null, null] };
    windowIdsInWorkspace = [newWindowId];
  } else if (activeWorkspace.root) {
    const focusedWindowId = state.activeWindowId;
    const isFocusedWindowInActiveWorkspace =
      focusedWindowId && activeWorkspace.windows.includes(focusedWindowId);

    if (isFocusedWindowInActiveWorkspace) {
      layoutTree = splitNodeAtWindow(activeWorkspace.root, focusedWindowId, newWindowId);
    } else {
      const insertPosition = activeWorkspace.windows.length - 1;
      layoutTree = splitNode(activeWorkspace.root, insertPosition, newWindowId);
    }

    const treeLeaves = getLeaves(layoutTree);
    windowIdsInWorkspace = treeLeaves;
  } else {
    layoutTree = { id: activeWorkspace.windows[0], children: [null, null] };
    for (let i = 1; i < activeWorkspace.windows.length; i++) {
      layoutTree = splitNode(layoutTree, i - 1, activeWorkspace.windows[i]);
    }
    layoutTree = splitNode(layoutTree, activeWorkspace.windows.length - 1, newWindowId);
    const treeLeaves = getLeaves(layoutTree);
    windowIdsInWorkspace = treeLeaves;
  }

  const layout = calculateLayout(layoutTree);
  const createdWindows: Record<string, WindowState> = {};

  for (const [id, rect] of layout) {
    const existingWindow = state.windows[id];
    const isNewWindow = id === newWindowId;
    createdWindows[id] = {
      ...existingWindow,
      id,
      position: rect.position,
      size: rect.size,
      isFocused: isNewWindow ? shouldFocus : (existingWindow?.isFocused ?? false),
      zIndex: isNewWindow ? nextZIndex : (existingWindow?.zIndex ?? 0),
    };
  }

  createdWindows[newWindowId] = {
    id: newWindowId,
    appId,
    title,
    workspaceId: state.activeWorkspaceId,
    isFocused: shouldFocus,
    position: layout.get(newWindowId)?.position ?? { x: 0, y: 0 },
    size: layout.get(newWindowId)?.size ?? {
      width: typeof window !== 'undefined' ? window.innerWidth : 1920,
      height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    },
    zIndex: nextZIndex,
  };

  const updatedActiveWorkspace = {
    ...activeWorkspace,
    windows: windowIdsInWorkspace,
    root: layoutTree,
  };

  setState({
    windows: { ...state.windows, ...createdWindows },
    workspaces: {
      ...state.workspaces,
      [state.activeWorkspaceId]: updatedActiveWorkspace,
    },
    activeWindowId: shouldFocus ? newWindowId : state.activeWindowId,
    lastZIndex: nextZIndex,
  });

  return newWindowId;
};

const closeWindow = (windowId: string): void => {
  const targetWindow = state.windows[windowId];
  if (!targetWindow) return;

  const sourceWorkspace = state.workspaces[targetWindow.workspaceId];
  const remainingWindowIds = sourceWorkspace.windows.filter((id) => id !== windowId);

  if (!sourceWorkspace.root || remainingWindowIds.length === 0) {
    const removedWindows = { ...state.windows };
    delete removedWindows[windowId];

    for (const id of sourceWorkspace.windows) {
      if (id !== windowId) {
        delete removedWindows[id];
      }
    }

    const isActiveWorkspace = state.activeWorkspaceId === targetWindow.workspaceId;
    const updatedWorkspaces = { ...state.workspaces };
    updatedWorkspaces[targetWindow.workspaceId] = {
      ...sourceWorkspace,
      windows: [],
      root: null,
    };

    setState({
      windows: removedWindows,
      workspaces: updatedWorkspaces,
      activeWindowId: isActiveWorkspace ? null : state.activeWindowId,
    });
    return;
  }

  let layoutTree = removeLeaf(sourceWorkspace.root, windowId);
  const layout = calculateLayout(layoutTree);
  const closedWindows: Record<string, WindowState> = { ...state.windows };

  delete closedWindows[windowId];

  for (const id of remainingWindowIds) {
    const rect = layout.get(id);
    if (rect && closedWindows[id]) {
      closedWindows[id] = { ...closedWindows[id], position: rect.position, size: rect.size };
    }
  }

  const closedWindowIndex = sourceWorkspace.windows.indexOf(windowId);
  const nextFocusedWindowId =
    state.activeWindowId === windowId
      ? remainingWindowIds.length > 0
        ? remainingWindowIds[Math.max(0, closedWindowIndex - 1)]
        : null
      : state.activeWindowId;

  if (remainingWindowIds.length === 0) {
    const isActiveWorkspace = state.activeWorkspaceId === targetWindow.workspaceId;
    const updatedWorkspaces = { ...state.workspaces };
    updatedWorkspaces[targetWindow.workspaceId] = {
      ...sourceWorkspace,
      windows: [],
      root: null,
    };

    setState({
      windows: closedWindows,
      workspaces: updatedWorkspaces,
      activeWindowId: isActiveWorkspace ? null : nextFocusedWindowId,
    });
    return;
  }

  setState({
    windows: { ...state.windows, ...closedWindows },
    workspaces: {
      ...state.workspaces,
      [targetWindow.workspaceId]: {
        ...sourceWorkspace,
        windows: remainingWindowIds,
        root: layoutTree,
      },
    },
    activeWindowId: nextFocusedWindowId,
  });
};

const focusWindow = (windowId: string): void => {
  const targetWindow = state.windows[windowId];
  if (!targetWindow) return;

  // Only focus if window is in current active workspace
  // This prevents mouse hover from switching workspaces during keyboard navigation
  if (targetWindow.workspaceId !== state.activeWorkspaceId) {
    return;
  }

  const nextZIndex = state.lastZIndex + 1;

  setState({
    windows: {
      ...state.windows,
      [windowId]: { ...targetWindow, isFocused: true, zIndex: nextZIndex },
    },
    activeWindowId: windowId,
    activeWorkspaceId: targetWindow.workspaceId,
    lastZIndex: nextZIndex,
  });
};

const moveWindowToWorkspace = (windowId: string, targetWorkspaceId: string): void => {
  const movingWindow = state.windows[windowId];
  if (!movingWindow) return;

  let workspaces = state.workspaces;
  let destinationWorkspaceId = targetWorkspaceId;

  if (
    !workspaces[targetWorkspaceId] ||
    (workspaces[targetWorkspaceId].windows.length === 0 && !workspaces[targetWorkspaceId].root)
  ) {
    workspaces = ensureWorkspaceExists(workspaces, targetWorkspaceId);
  }

  const targetWorkspace = workspaces[destinationWorkspaceId];
  const sourceWorkspace = workspaces[movingWindow.workspaceId];

  if (sourceWorkspace.id === destinationWorkspaceId) return;

  let sourceLayoutTree: TreeNode | null = sourceWorkspace.root
    ? removeLeaf(sourceWorkspace.root, windowId)
    : null;

  const sourceWorkspaceAfterMove: Workspace = {
    ...sourceWorkspace,
    windows: sourceWorkspace.windows.filter((id) => id !== windowId),
    root: sourceLayoutTree,
  };

  let targetLayoutTree: TreeNode | null = null;
  let windowIdsInTarget: string[] = [];

  if (targetWorkspace.windows.length === 0) {
    targetLayoutTree = { id: windowId, children: [null, null] };
    windowIdsInTarget = [windowId];
  } else if (targetWorkspace.root) {
    const insertPosition = targetWorkspace.windows.length - 1;
    targetLayoutTree = splitNode(targetWorkspace.root, insertPosition, windowId);
    windowIdsInTarget = getLeaves(targetLayoutTree);
  } else {
    targetLayoutTree = { id: targetWorkspace.windows[0], children: [null, null] };
    for (let i = 1; i < targetWorkspace.windows.length; i++) {
      targetLayoutTree = splitNode(targetLayoutTree, i - 1, targetWorkspace.windows[i]);
    }
    targetLayoutTree = splitNode(targetLayoutTree, targetWorkspace.windows.length - 1, windowId);
    windowIdsInTarget = getLeaves(targetLayoutTree);
  }

  const targetWorkspaceAfterMove: Workspace = {
    ...targetWorkspace,
    windows: windowIdsInTarget,
    root: targetLayoutTree,
  };

  const sourceLayout = calculateLayout(sourceWorkspaceAfterMove.root);
  const targetLayout = calculateLayout(targetWorkspaceAfterMove.root);

  const movedWindows = { ...state.windows };

  for (const [id, rect] of sourceLayout) {
    if (movedWindows[id]) {
      movedWindows[id] = {
        ...movedWindows[id],
        position: rect.position,
        size: rect.size,
      };
    }
  }

  for (const [id, rect] of targetLayout) {
    if (movedWindows[id]) {
      movedWindows[id] = {
        ...movedWindows[id],
        position: rect.position,
        size: rect.size,
        workspaceId: id === windowId ? destinationWorkspaceId : movedWindows[id].workspaceId,
        isFocused: id === windowId,
      };
    }
  }

  const workspacesAfterMove = { ...workspaces };
  workspacesAfterMove[movingWindow.workspaceId] = {
    ...sourceWorkspaceAfterMove,
    windows: sourceWorkspaceAfterMove.windows,
    root: sourceWorkspaceAfterMove.root,
  };
  workspacesAfterMove[destinationWorkspaceId] = targetWorkspaceAfterMove;

  setState({
    windows: { ...state.windows, ...movedWindows },
    workspaces: workspacesAfterMove,
    activeWorkspaceId: destinationWorkspaceId,
    activeWindowId: windowId,
    lastZIndex: state.lastZIndex + 1,
  });
};

const switchWorkspace = (workspaceId: string): void => {
  let workspaces = state.workspaces;
  let targetWorkspaceId = workspaceId;

  if (!workspaces[workspaceId]) {
    workspaces = ensureWorkspaceExists(workspaces, workspaceId);
  }

  const targetWorkspace = workspaces[targetWorkspaceId];
  const currentWorkspace = workspaces[state.activeWorkspaceId];
  const nextFocusedWindowId =
    targetWorkspace.windows.length > 0 ? targetWorkspace.windows[0] : null;

  const workspacesAfterSwitch: Record<string, Workspace> = { ...workspaces };

  if (currentWorkspace) {
    if (currentWorkspace.windows.length === 0 && currentWorkspace.id !== targetWorkspaceId) {
      delete workspacesAfterSwitch[state.activeWorkspaceId];
    } else {
      workspacesAfterSwitch[state.activeWorkspaceId] = {
        ...currentWorkspace,
        isActive: false,
      };
    }
  }
  workspacesAfterSwitch[targetWorkspaceId] = { ...targetWorkspace, isActive: true };

  setState({
    workspaces: workspacesAfterSwitch,
    activeWorkspaceId: targetWorkspaceId,
    activeWindowId: nextFocusedWindowId,
  });

  setTimeout(recalculateWindowPositions, 0);
};

const cycleWindow = (direction: 'next' | 'prev'): void => {
  const activeWorkspace = state.workspaces[state.activeWorkspaceId];
  if (activeWorkspace.windows.length === 0) return;

  const currentIndex = activeWorkspace.windows.indexOf(state.activeWindowId ?? '');
  const nextIndex =
    direction === 'next'
      ? (currentIndex + 1) % activeWorkspace.windows.length
      : (currentIndex - 1 + activeWorkspace.windows.length) % activeWorkspace.windows.length;

  focusWindow(activeWorkspace.windows[nextIndex]);
};

const actions: WorkspaceActions = {
  createWindow,
  closeWindow,
  focusWindow,
  moveWindowToWorkspace,
  switchWorkspace,
  cycleWindow,
  getActiveWindowId: () => state.activeWindowId,
};

export const useWorkspaceStore = (): WorkspaceState & WorkspaceActions => {
  return { ...state, ...actions };
};

export function useWorkspaceStoreKey<K extends keyof WorkspaceState>(key: K): WorkspaceState[K] {
  return useSyncExternalStore(
    (onStoreChange) => subscribeToKey(key, onStoreChange),
    () => state[key],
    () => state[key],
  );
}

export function useWorkspaceStoreSelector<T>(selector: (state: WorkspaceState) => T): T {
  return useSyncExternalStore(
    (onStoreChange) => subscribeToKey('windows', onStoreChange),
    () => selector(state),
    () => selector(state),
  );
}

export const workspaceStoreActions = actions;

export const workspaceStoreSubscribers = {
  subscribe,
  subscribeToKey,
  getState: () => state,
  getActiveWindowId: () => activeWindowIdRef,
};
