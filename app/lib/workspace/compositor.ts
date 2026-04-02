import type { WindowState, Workspace, Actions, TreeNode } from './types';
import {
  getLeaves,
  splitNode,
  splitAtWindow,
  removeLeaf,
  calculateLayout,
  findParentNode,
  updateSplitRatio,
  swapNodes,
} from './tree';
import {
  getScreen,
  calculateZIndex,
  applyLayout,
  removeFromTree,
  addToTree,
  getRect,
  recalculatePositions,
  generateId,
  ensureWorkspace,
} from './utils';
import { setStore, store } from './store';

let lastKnownDimensions: { width: number; height: number } | null = null;

export const recalculateWindowPositions = () => {
  const currentDimensions = getScreen();

  if (
    lastKnownDimensions &&
    lastKnownDimensions.width === currentDimensions.width &&
    lastKnownDimensions.height === currentDimensions.height
  ) {
    return;
  }
  lastKnownDimensions = currentDimensions;

  const activeWorkspace = store.workspaces[store.activeWorkspaceId];
  if (!activeWorkspace?.root) return;

  const updatedWindows = recalculatePositions(activeWorkspace, store.windows);

  const hasChanges = Object.keys(updatedWindows).some((id) => {
    const newWin = updatedWindows[id];
    const oldWin = store.windows[id];
    return (
      newWin.position.x !== oldWin.position.x ||
      newWin.position.y !== oldWin.position.y ||
      newWin.size.width !== oldWin.size.width ||
      newWin.size.height !== oldWin.size.height
    );
  });

  if (hasChanges) {
    setStore({ windows: { ...store.windows, ...updatedWindows } });
  }
};

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(recalculateWindowPositions, 16);
  });
}

export const createWindow = (appId: string, title: string, shouldFocus = true): string => {
  const activeWorkspace = store.workspaces[store.activeWorkspaceId];
  const newWindowId = generateId();
  const nextZIndex = store.lastZIndex + 1;

  let layoutTree: TreeNode | null = null;
  let windowIdsInWorkspace: string[] = [];

  if (activeWorkspace.windows.length === 0) {
    layoutTree = { id: newWindowId, children: [null, null] };
    windowIdsInWorkspace = [newWindowId];
  } else if (activeWorkspace.root) {
    const focusedWindowId = store.activeWindowId;
    const isFocusedWindowInActiveWorkspace =
      focusedWindowId && activeWorkspace.windows.includes(focusedWindowId);

    if (isFocusedWindowInActiveWorkspace) {
      layoutTree = splitAtWindow(activeWorkspace.root, focusedWindowId, newWindowId);
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
    const existingWindow = store.windows[id];
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
    workspaceId: store.activeWorkspaceId,
    isFocused: shouldFocus,
    isFloating: false,
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

  setStore({
    windows: { ...store.windows, ...createdWindows },
    workspaces: {
      ...store.workspaces,
      [store.activeWorkspaceId]: updatedActiveWorkspace,
    },
    activeWindowId: shouldFocus ? newWindowId : store.activeWindowId,
    lastZIndex: nextZIndex,
  });

  return newWindowId;
};

export const closeWindow = (windowId: string): void => {
  const targetWindow = store.windows[windowId];
  if (!targetWindow) return;

  const sourceWorkspace = store.workspaces[targetWindow.workspaceId];
  const remainingWindowIds = sourceWorkspace.windows.filter((id) => id !== windowId);

  if (!sourceWorkspace.root || remainingWindowIds.length === 0) {
    const removedWindows = { ...store.windows };
    delete removedWindows[windowId];

    for (const id of sourceWorkspace.windows) {
      if (id !== windowId) {
        delete removedWindows[id];
      }
    }

    const isActiveWorkspace = store.activeWorkspaceId === targetWindow.workspaceId;
    const updatedWorkspaces = { ...store.workspaces };
    updatedWorkspaces[targetWindow.workspaceId] = {
      ...sourceWorkspace,
      windows: [],
      root: null,
    };

    setStore({
      windows: removedWindows,
      workspaces: updatedWorkspaces,
      activeWindowId: isActiveWorkspace ? null : store.activeWindowId,
    });
    return;
  }

  let layoutTree = removeLeaf(sourceWorkspace.root, windowId);
  const layout = calculateLayout(layoutTree);
  const closedWindows: Record<string, WindowState> = { ...store.windows };

  delete closedWindows[windowId];

  for (const id of remainingWindowIds) {
    const rect = layout.get(id);
    if (rect && closedWindows[id]) {
      closedWindows[id] = { ...closedWindows[id], position: rect.position, size: rect.size };
    }
  }

  const closedWindowIndex = sourceWorkspace.windows.indexOf(windowId);
  const nextFocusedWindowId =
    store.activeWindowId === windowId
      ? remainingWindowIds.length > 0
        ? remainingWindowIds[Math.max(0, closedWindowIndex - 1)]
        : null
      : store.activeWindowId;

  if (remainingWindowIds.length === 0) {
    const isActiveWorkspace = store.activeWorkspaceId === targetWindow.workspaceId;
    const updatedWorkspaces = { ...store.workspaces };
    updatedWorkspaces[targetWindow.workspaceId] = {
      ...sourceWorkspace,
      windows: [],
      root: null,
    };

    setStore({
      windows: closedWindows,
      workspaces: updatedWorkspaces,
      activeWindowId: isActiveWorkspace ? null : nextFocusedWindowId,
    });
    return;
  }

  setStore({
    windows: { ...store.windows, ...closedWindows },
    workspaces: {
      ...store.workspaces,
      [targetWindow.workspaceId]: {
        ...sourceWorkspace,
        windows: remainingWindowIds,
        root: layoutTree,
      },
    },
    activeWindowId: nextFocusedWindowId,
  });
};

export const focusWindow = (windowId: string): void => {
  const targetWindow = store.windows[windowId];
  if (!targetWindow) return;

  if (targetWindow.workspaceId !== store.activeWorkspaceId) {
    return;
  }

  const nextZIndex = calculateZIndex(
    store.windows,
    store.activeWorkspaceId,
    store.lastZIndex,
    targetWindow.isFloating,
  );

  const updatedWindows = { ...store.windows };
  if (store.activeWindowId && store.activeWindowId !== windowId) {
    const prevWindow = updatedWindows[store.activeWindowId];
    if (prevWindow) {
      updatedWindows[store.activeWindowId] = {
        ...prevWindow,
        isFocused: false,
      };
    }
  }

  updatedWindows[windowId] = { ...targetWindow, isFocused: true, zIndex: nextZIndex };

  setStore({
    windows: updatedWindows,
    activeWindowId: windowId,
    activeWorkspaceId: targetWindow.workspaceId,
    lastZIndex: nextZIndex,
  });
};

export const moveWindow = (windowId: string, targetWorkspaceId: string): void => {
  const movingWindow = store.windows[windowId];
  if (!movingWindow) return;

  let stores = store.workspaces;
  let destinationWorkspaceId = targetWorkspaceId;

  if (
    !stores[targetWorkspaceId] ||
    (stores[targetWorkspaceId].windows.length === 0 && !stores[targetWorkspaceId].root)
  ) {
    stores = ensureWorkspace(stores, targetWorkspaceId);
  }

  const targetWorkspace = stores[destinationWorkspaceId];
  const sourceWorkspace = stores[movingWindow.workspaceId];

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

  const movedWindows = { ...store.windows };

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

  const storesAfterMove = { ...stores };
  storesAfterMove[movingWindow.workspaceId] = {
    ...sourceWorkspaceAfterMove,
    windows: sourceWorkspaceAfterMove.windows,
    root: sourceWorkspaceAfterMove.root,
  };
  storesAfterMove[destinationWorkspaceId] = targetWorkspaceAfterMove;

  setStore({
    windows: { ...store.windows, ...movedWindows },
    workspaces: storesAfterMove,
    activeWorkspaceId: destinationWorkspaceId,
    activeWindowId: windowId,
    lastZIndex: store.lastZIndex + 1,
  });
};

export const switchWorkspace = (workspaceId: string): void => {
  let stores = store.workspaces;
  let targetWorkspaceId = workspaceId;

  if (!stores[workspaceId]) {
    stores = ensureWorkspace(stores, workspaceId);
  }

  const targetWorkspace = stores[targetWorkspaceId];
  const currentWorkspace = stores[store.activeWorkspaceId];
  const nextFocusedWindowId =
    targetWorkspace.windows.length > 0 ? targetWorkspace.windows[0] : null;

  const storesAfterSwitch: Record<string, Workspace> = { ...stores };

  if (currentWorkspace) {
    if (currentWorkspace.windows.length === 0 && currentWorkspace.id !== targetWorkspaceId) {
      delete storesAfterSwitch[store.activeWorkspaceId];
    } else {
      storesAfterSwitch[store.activeWorkspaceId] = {
        ...currentWorkspace,
        isActive: false,
      };
    }
  }
  storesAfterSwitch[targetWorkspaceId] = { ...targetWorkspace, isActive: true };

  setStore({
    workspaces: storesAfterSwitch,
    activeWorkspaceId: targetWorkspaceId,
    activeWindowId: nextFocusedWindowId,
  });

  setTimeout(recalculateWindowPositions, 0);
};

export const cycleWindow = (direction: 'next' | 'prev'): void => {
  const activeWorkspace = store.workspaces[store.activeWorkspaceId];
  if (activeWorkspace.windows.length === 0) return;

  const currentIndex = activeWorkspace.windows.indexOf(store.activeWindowId ?? '');
  const nextIndex =
    direction === 'next'
      ? (currentIndex + 1) % activeWorkspace.windows.length
      : (currentIndex - 1 + activeWorkspace.windows.length) % activeWorkspace.windows.length;

  focusWindow(activeWorkspace.windows[nextIndex]);
};

export const setFloating = (windowId: string, isFloating: boolean): void => {
  const targetWindow = store.windows[windowId];
  if (!targetWindow) return;

  const ws = store.workspaces[targetWindow.workspaceId];
  if (!ws) return;

  if (isFloating) {
    const { width: screenWidth, height: screenHeight } = getScreen();
    const centerX = (screenWidth - targetWindow.size.width) / 2;
    const centerY = (screenHeight - targetWindow.size.height) / 2;
    const nextZIndex = store.lastZIndex + 1;

    const { workspace: updatedWorkspace, updatedWindows } = removeFromTree(
      ws,
      windowId,
      store.windows,
    );

    setStore({
      windows: {
        ...store.windows,
        ...updatedWindows,
        [windowId]: {
          ...targetWindow,
          isFloating,
          position: { x: centerX, y: centerY },
          zIndex: nextZIndex,
        },
      },
      workspaces: {
        ...store.workspaces,
        [targetWindow.workspaceId]: updatedWorkspace,
      },
      lastZIndex: nextZIndex,
    });
  } else {
    if (ws.windows.includes(windowId)) {
      return;
    }

    const { workspace: updatedWs, updatedWindows } = addToTree(ws, windowId, store.windows);

    const rect = getRect(updatedWs.root, windowId);
    const newPosition = rect?.position ?? targetWindow.position;
    const newSize = rect?.size ?? targetWindow.size;

    setStore({
      windows: {
        ...store.windows,
        ...updatedWindows,
        [windowId]: { ...targetWindow, isFloating, position: newPosition, size: newSize },
      },
      workspaces: {
        ...store.workspaces,
        [targetWindow.workspaceId]: updatedWs,
      },
    });
  }
};

export const swapWindow = (windowIdA: string, windowIdB: string): void => {
  const ws = store.workspaces[store.activeWorkspaceId];
  if (!ws?.root) return;

  if (!ws.windows.includes(windowIdA) || !ws.windows.includes(windowIdB)) {
    return;
  }

  const swappedRoot = swapNodes(ws.root, windowIdA, windowIdB);
  const updatedWindows = applyLayout(swappedRoot, store.windows);

  setStore({
    windows: { ...store.windows, ...updatedWindows },
    workspaces: {
      ...store.workspaces,
      [store.activeWorkspaceId]: {
        ...ws,
        root: swappedRoot,
        windows: getLeaves(swappedRoot),
      },
    },
  });
};

export const splitWindow = (windowId: string, ratio: number): void => {
  const ws = store.workspaces[store.activeWorkspaceId];
  if (!ws?.root) return;

  if (!ws.windows.includes(windowId)) return;

  const parentNode = findParentNode(ws.root, windowId);
  if (!parentNode) return;

  const updatedRoot = updateSplitRatio(ws.root, windowId, ratio);
  const updatedWindows = applyLayout(updatedRoot, store.windows);

  setStore({
    windows: { ...store.windows, ...updatedWindows },
    workspaces: {
      ...store.workspaces,
      [store.activeWorkspaceId]: {
        ...ws,
        root: updatedRoot,
      },
    },
  });
};

export const compositorActions: Actions = {
  createWindow,
  closeWindow,
  focusWindow,
  moveWindow,
  switchWorkspace,
  cycleWindow,
  setFloating,
  swapWindow,
  splitWindow,
};
