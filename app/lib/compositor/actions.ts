import type { Actions, WindowState, State } from './types';
import {
  generateId,
  addLeaf,
  removeLeaf,
  getTreeLeafIds,
  findNearestSiblingId,
  findSiblingId,
  getParentDirection,
  isWindowFirstChild,
  syncWorkspaceLayout,
  swapWindowIds,
  updateNodeSplit,
} from './layout';
import { stateManager, commit } from './store';

/**
 * Utility to derive a full x/y/w/h rect from the state's current viewport dimensions.
 */
const getViewportRect = (state: State): WindowState['rect'] => ({
  x: 0,
  y: 0,
  width: state.viewport.width,
  height: state.viewport.height,
});

/**
 * Creates a new window, inserts it into the active workspace's layout tree, and focuses it.
 */
export const createWindow: Actions['createWindow'] = (appId, title, focus = true) => {
  const state = stateManager.snapshot();
  const ws = state.workspaces[state.activeWorkspaceId];
  const newId = generateId();
  const nextZ = state.lastZIndex + 1;
  const viewport = getViewportRect(state);

  const activeWin = state.activeWindowId ? state.windows[state.activeWindowId] : null;
  const targetWin = activeWin && !activeWin.isFloating ? activeWin : state.windows[ws.windowIds[0]];

  const newRoot = addLeaf(ws.root, newId, targetWin?.id || null, viewport);
  const newWin: WindowState = {
    id: newId,
    appId,
    title,
    workspaceId: state.activeWorkspaceId,
    isFocused: focus,
    isFloating: false,
    rect: viewport,
    zIndex: nextZ,
  };

  const updatedWindows = syncWorkspaceLayout(
    { ...ws, root: newRoot },
    { ...state.windows, [newId]: newWin },
    viewport,
  );

  commit({
    windows: updatedWindows,
    workspaces: {
      ...state.workspaces,
      [state.activeWorkspaceId]: {
        ...ws,
        root: newRoot,
        windowIds: getTreeLeafIds(newRoot),
      },
    },
    activeWindowId: focus ? newId : state.activeWindowId,
    lastZIndex: nextZ,
  });
};

/**
 * Removes a window from the state and the layout tree, updating the focus to the nearest sibling.
 */
export const closeWindow: Actions['closeWindow'] = (windowId) => {
  const state = stateManager.snapshot();
  const win = state.windows[windowId];
  if (!win) return;

  const viewport = getViewportRect(state);
  const ws = state.workspaces[win.workspaceId];
  const nextWindows = { ...state.windows };
  delete nextWindows[windowId];

  // If the window was tiled, update the tree. If it was floating, the tree remains unchanged.
  const newRoot = ws.root ? removeLeaf(ws.root, windowId) : null;
  const finalWindows = syncWorkspaceLayout({ ...ws, root: newRoot }, nextWindows, viewport);

  // Focus management logic
  let nextFocusedId = state.activeWindowId;
  if (state.activeWindowId === windowId) {
    // 1. Try to find a sibling in the tiling tree
    nextFocusedId = ws.root ? findNearestSiblingId(ws.root, windowId) : null;

    // 2. Fallback: If no sibling found (e.g. was floating or last tiled window),
    // focus any remaining window in the same workspace.
    if (!nextFocusedId) {
      const remainingWsWindows = Object.values(finalWindows)
        .filter((w) => w.workspaceId === win.workspaceId)
        .sort((a, b) => b.zIndex - a.zIndex); // Prefer top-most (likely floating)

      nextFocusedId = remainingWsWindows.length > 0 ? remainingWsWindows[0].id : null;
    }
  }

  commit({
    windows: finalWindows,
    workspaces: {
      ...state.workspaces,
      [win.workspaceId]: {
        ...ws,
        root: newRoot,
        windowIds: getTreeLeafIds(newRoot),
      },
    },
    activeWindowId: nextFocusedId,
  });
};

/**
 * Updates the focus state and z-index of a window, bringing it to the front.
 */
export const focusWindow: Actions['focusWindow'] = (windowId) => {
  const state = stateManager.snapshot();
  const win = state.windows[windowId];
  if (!win) return;

  if (state.activeWindowId === windowId && win.isFocused) return;

  const nextZ = state.lastZIndex + 1;
  const nextWindows = { ...state.windows };

  if (state.activeWindowId && nextWindows[state.activeWindowId]) {
    nextWindows[state.activeWindowId] = { ...nextWindows[state.activeWindowId], isFocused: false };
  }

  nextWindows[windowId] = { ...win, isFocused: true, zIndex: nextZ };

  commit({
    windows: nextWindows,
    activeWindowId: windowId,
    lastZIndex: nextZ,
  });
};

/**
 * Transfers a window from its current workspace to a target workspace.
 */
export const moveWindow: Actions['moveWindow'] = (windowId, targetWorkspaceId) => {
  const state = stateManager.snapshot();
  const win = state.windows[windowId];
  if (!win || win.workspaceId === targetWorkspaceId) return;

  const viewport = getViewportRect(state);
  const sourceWs = state.workspaces[win.workspaceId];
  const sourceRoot = sourceWs.root ? removeLeaf(sourceWs.root, windowId) : null;
  const sourceWindowIds = getTreeLeafIds(sourceRoot);

  const workspaces = { ...state.workspaces };

  if (sourceWindowIds.length === 0) {
    delete workspaces[sourceWs.id];
  } else {
    workspaces[sourceWs.id] = {
      ...sourceWs,
      root: sourceRoot,
      windowIds: sourceWindowIds,
      isActive: false,
    };
  }

  let targetWs = state.workspaces[targetWorkspaceId] || {
    id: targetWorkspaceId,
    name: targetWorkspaceId,
    isActive: false,
    windowIds: [],
    root: null,
    gaps: state.config.gaps,
  };
  const targetRoot = addLeaf(targetWs.root, windowId, null, viewport);

  let nextWindows = { ...state.windows };

  nextWindows[windowId] = { ...win, workspaceId: targetWorkspaceId, isFocused: true };
  const nextZ = state.lastZIndex + 1;
  nextWindows[windowId] = { ...nextWindows[windowId], zIndex: nextZ };

  nextWindows = syncWorkspaceLayout({ ...sourceWs, root: sourceRoot }, nextWindows, viewport);
  nextWindows = syncWorkspaceLayout({ ...targetWs, root: targetRoot }, nextWindows, viewport);

  commit({
    windows: nextWindows,
    workspaces: {
      ...workspaces,
      [targetWorkspaceId]: {
        ...targetWs,
        root: targetRoot,
        windowIds: getTreeLeafIds(targetRoot),
        isActive: true,
      },
    },
    activeWindowId: windowId,
    activeWorkspaceId: targetWorkspaceId,
    lastZIndex: nextZ,
  });
};

/**
 * Switches the active viewport to a different workspace, cleaning up the old one if it's empty.
 */
export const switchWorkspace: Actions['switchWorkspace'] = (workspaceId) => {
  const state = stateManager.snapshot();
  if (state.activeWorkspaceId === workspaceId) return;

  const currentWs = state.workspaces[state.activeWorkspaceId];
  const workspaces = { ...state.workspaces };

  if (currentWs && currentWs.windowIds.length === 0) {
    delete workspaces[state.activeWorkspaceId];
  } else if (currentWs) {
    workspaces[state.activeWorkspaceId] = { ...currentWs, isActive: false };
  }

  if (!workspaces[workspaceId]) {
    workspaces[workspaceId] = {
      id: workspaceId,
      name: workspaceId,
      isActive: true,
      windowIds: [],
      root: null,
      gaps: state.config.gaps,
    };
  } else {
    workspaces[workspaceId] = { ...workspaces[workspaceId], isActive: true };
  }

  commit({
    activeWorkspaceId: workspaceId,
    workspaces,
    activeWindowId: workspaces[workspaceId].windowIds[0] || null,
  });
};

/**
 * Cycles focus between all tiled and floating windows in the active workspace.
 */
export const cycleWindow: Actions['cycleWindow'] = (direction) => {
  const state = stateManager.snapshot();
  const ws = state.workspaces[state.activeWorkspaceId];

  const tiledIds = ws.windowIds;
  const floatingIds = Object.values(state.windows)
    .filter((w) => w.workspaceId === ws.id && w.isFloating)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((w) => w.id);

  const allIds = [...tiledIds, ...floatingIds];
  if (allIds.length < 1) return;

  const currentIdx = allIds.indexOf(state.activeWindowId || '');
  let nextIdx: number;

  if (currentIdx === -1) {
    nextIdx = 0;
  } else {
    nextIdx =
      direction === 'next'
        ? (currentIdx + 1) % allIds.length
        : (currentIdx - 1 + allIds.length) % allIds.length;
  }

  focusWindow(allIds[nextIdx]);
};

/**
 * Toggles a window between tiled and floating states.
 */
export const floatWindow: Actions['floatWindow'] = (windowId) => {
  const state = stateManager.snapshot();
  const win = state.windows[windowId];
  if (!win) return;

  const viewport = getViewportRect(state);
  const ws = state.workspaces[win.workspaceId];
  const becomingFloating = !win.isFloating;

  let newRoot = ws.root;
  let nextWindows = { ...state.windows };

  if (becomingFloating) {
    const siblingId = ws.root ? findSiblingId(ws.root, windowId) : null;
    const parentDir = ws.root ? getParentDirection(ws.root, windowId) : null;
    const isFirst = ws.root ? isWindowFirstChild(ws.root, windowId) : null;

    newRoot = ws.root ? removeLeaf(ws.root, windowId) : null;
    nextWindows[windowId] = {
      ...win,
      isFloating: true,
      lastTiledSiblingId: siblingId,
      lastTiledDirection: parentDir,
      lastTiledIsFirstChild: isFirst,
      zIndex: state.lastZIndex + 1,
      rect: {
        x: viewport.width * 0.25,
        y: viewport.height * 0.25,
        width: viewport.width * 0.5,
        height: viewport.height * 0.5,
      },
    };
  } else {
    const targetId = win.lastTiledSiblingId;
    newRoot = addLeaf(
      ws.root,
      windowId,
      targetId || null,
      viewport,
      win.lastTiledDirection,
      win.lastTiledIsFirstChild,
    );

    nextWindows[windowId] = {
      ...win,
      isFloating: false,
      lastTiledSiblingId: null,
      lastTiledDirection: null,
      lastTiledIsFirstChild: null,
    };
  }

  const finalWindows = syncWorkspaceLayout({ ...ws, root: newRoot }, nextWindows, viewport);

  commit({
    windows: finalWindows,
    workspaces: {
      ...state.workspaces,
      [ws.id]: { ...ws, root: newRoot, windowIds: getTreeLeafIds(newRoot) },
    },
    lastZIndex: state.lastZIndex + 1,
  });
};

/**
 * Swaps the positions of two windows within the tiling tree.
 */
export const swapWindows: Actions['swapWindows'] = (idA, idB) => {
  const state = stateManager.snapshot();
  const ws = state.workspaces[state.activeWorkspaceId];
  if (!ws.root || !ws.windowIds.includes(idA) || !ws.windowIds.includes(idB)) return;

  const viewport = getViewportRect(state);
  const newRoot = swapWindowIds(ws.root, idA, idB);
  const updatedWindows = syncWorkspaceLayout({ ...ws, root: newRoot }, state.windows, viewport);

  commit({
    windows: updatedWindows,
    workspaces: {
      ...state.workspaces,
      [ws.id]: { ...ws, root: newRoot, windowIds: getTreeLeafIds(newRoot) },
    },
  });
};

/**
 * Modifies the split ratio of a node to resize windows.
 */
export const resizeSplit: Actions['resizeSplit'] = (nodeId, newRatio) => {
  const state = stateManager.snapshot();
  const ws = state.workspaces[state.activeWorkspaceId];
  if (!ws.root) return;

  const viewport = getViewportRect(state);
  const newRoot = updateNodeSplit(ws.root, nodeId, newRatio);
  const updatedWindows = syncWorkspaceLayout({ ...ws, root: newRoot }, state.windows, viewport);

  commit({
    windows: updatedWindows,
    workspaces: {
      ...state.workspaces,
      [ws.id]: { ...ws, root: newRoot },
    },
  });
};

/**
 * Exported object containing all compositor dispatch actions.
 */
export const compositorActions: Actions = {
  createWindow,
  focusWindow,
  closeWindow,
  floatWindow,
  moveWindow,
  cycleWindow,
  swapWindows,
  switchWorkspace,
  resizeSplit,
};
