import type { WindowState, Workspace, WorkspaceActions } from './types';
import type { TreeNode } from './types';
import {
  getLeaves,
  splitNode,
  splitNodeAtWindow,
  removeLeaf,
  calculateLayout,
  findParentNode,
  updateNodeSplitRatio,
  swapNodes,
} from './tree';
import {
  getScreenDimensions,
  calculateZIndexWithFloating,
  applyLayoutToWindows,
  removeWindowFromTree,
  addWindowToTree,
  getWindowRectFromLayout,
  recalculateAllWindowPositions,
  generateId,
  ensureWorkspaceExists,
} from './utils';
import { setCompositor, compositor } from './store';

let lastKnownDimensions: { width: number; height: number } | null = null;

export const recalculateWindowPositions = () => {
  const currentDimensions = getScreenDimensions();

  if (
    lastKnownDimensions &&
    lastKnownDimensions.width === currentDimensions.width &&
    lastKnownDimensions.height === currentDimensions.height
  ) {
    return;
  }
  lastKnownDimensions = currentDimensions;

  const activeWorkspace = compositor.workspaces[compositor.activeWorkspaceId];
  if (!activeWorkspace?.root) return;

  const updatedWindows = recalculateAllWindowPositions(activeWorkspace, compositor.windows);

  const hasChanges = Object.keys(updatedWindows).some((id) => {
    const newWin = updatedWindows[id];
    const oldWin = compositor.windows[id];
    return (
      newWin.position.x !== oldWin.position.x ||
      newWin.position.y !== oldWin.position.y ||
      newWin.size.width !== oldWin.size.width ||
      newWin.size.height !== oldWin.size.height
    );
  });

  if (hasChanges) {
    setCompositor({ windows: { ...compositor.windows, ...updatedWindows } });
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
  const activeWorkspace = compositor.workspaces[compositor.activeWorkspaceId];
  const newWindowId = generateId();
  const nextZIndex = compositor.lastZIndex + 1;

  let layoutTree: TreeNode | null = null;
  let windowIdsInWorkspace: string[] = [];

  if (activeWorkspace.windows.length === 0) {
    layoutTree = { id: newWindowId, children: [null, null] };
    windowIdsInWorkspace = [newWindowId];
  } else if (activeWorkspace.root) {
    const focusedWindowId = compositor.activeWindowId;
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
    const existingWindow = compositor.windows[id];
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
    workspaceId: compositor.activeWorkspaceId,
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

  setCompositor({
    windows: { ...compositor.windows, ...createdWindows },
    workspaces: {
      ...compositor.workspaces,
      [compositor.activeWorkspaceId]: updatedActiveWorkspace,
    },
    activeWindowId: shouldFocus ? newWindowId : compositor.activeWindowId,
    lastZIndex: nextZIndex,
  });

  return newWindowId;
};

export const closeWindow = (windowId: string): void => {
  const targetWindow = compositor.windows[windowId];
  if (!targetWindow) return;

  const sourceWorkspace = compositor.workspaces[targetWindow.workspaceId];
  const remainingWindowIds = sourceWorkspace.windows.filter((id) => id !== windowId);

  if (!sourceWorkspace.root || remainingWindowIds.length === 0) {
    const removedWindows = { ...compositor.windows };
    delete removedWindows[windowId];

    for (const id of sourceWorkspace.windows) {
      if (id !== windowId) {
        delete removedWindows[id];
      }
    }

    const isActiveWorkspace = compositor.activeWorkspaceId === targetWindow.workspaceId;
    const updatedWorkspaces = { ...compositor.workspaces };
    updatedWorkspaces[targetWindow.workspaceId] = {
      ...sourceWorkspace,
      windows: [],
      root: null,
    };

    setCompositor({
      windows: removedWindows,
      workspaces: updatedWorkspaces,
      activeWindowId: isActiveWorkspace ? null : compositor.activeWindowId,
    });
    return;
  }

  let layoutTree = removeLeaf(sourceWorkspace.root, windowId);
  const layout = calculateLayout(layoutTree);
  const closedWindows: Record<string, WindowState> = { ...compositor.windows };

  delete closedWindows[windowId];

  for (const id of remainingWindowIds) {
    const rect = layout.get(id);
    if (rect && closedWindows[id]) {
      closedWindows[id] = { ...closedWindows[id], position: rect.position, size: rect.size };
    }
  }

  const closedWindowIndex = sourceWorkspace.windows.indexOf(windowId);
  const nextFocusedWindowId =
    compositor.activeWindowId === windowId
      ? remainingWindowIds.length > 0
        ? remainingWindowIds[Math.max(0, closedWindowIndex - 1)]
        : null
      : compositor.activeWindowId;

  if (remainingWindowIds.length === 0) {
    const isActiveWorkspace = compositor.activeWorkspaceId === targetWindow.workspaceId;
    const updatedWorkspaces = { ...compositor.workspaces };
    updatedWorkspaces[targetWindow.workspaceId] = {
      ...sourceWorkspace,
      windows: [],
      root: null,
    };

    setCompositor({
      windows: closedWindows,
      workspaces: updatedWorkspaces,
      activeWindowId: isActiveWorkspace ? null : nextFocusedWindowId,
    });
    return;
  }

  setCompositor({
    windows: { ...compositor.windows, ...closedWindows },
    workspaces: {
      ...compositor.workspaces,
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
  const targetWindow = compositor.windows[windowId];
  if (!targetWindow) return;

  if (targetWindow.workspaceId !== compositor.activeWorkspaceId) {
    return;
  }

  const nextZIndex = calculateZIndexWithFloating(
    compositor.windows,
    compositor.activeWorkspaceId,
    compositor.lastZIndex,
    targetWindow.isFloating,
  );

  const updatedWindows = { ...compositor.windows };
  if (compositor.activeWindowId && compositor.activeWindowId !== windowId) {
    const prevWindow = updatedWindows[compositor.activeWindowId];
    if (prevWindow) {
      updatedWindows[compositor.activeWindowId] = {
        ...prevWindow,
        isFocused: false,
      };
    }
  }

  updatedWindows[windowId] = { ...targetWindow, isFocused: true, zIndex: nextZIndex };

  setCompositor({
    windows: updatedWindows,
    activeWindowId: windowId,
    activeWorkspaceId: targetWindow.workspaceId,
    lastZIndex: nextZIndex,
  });
};

export const moveWindowToWorkspace = (windowId: string, targetWorkspaceId: string): void => {
  const movingWindow = compositor.windows[windowId];
  if (!movingWindow) return;

  let workspaces = compositor.workspaces;
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

  const movedWindows = { ...compositor.windows };

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

  setCompositor({
    windows: { ...compositor.windows, ...movedWindows },
    workspaces: workspacesAfterMove,
    activeWorkspaceId: destinationWorkspaceId,
    activeWindowId: windowId,
    lastZIndex: compositor.lastZIndex + 1,
  });
};

export const switchWorkspace = (workspaceId: string): void => {
  let workspaces = compositor.workspaces;
  let targetWorkspaceId = workspaceId;

  if (!workspaces[workspaceId]) {
    workspaces = ensureWorkspaceExists(workspaces, workspaceId);
  }

  const targetWorkspace = workspaces[targetWorkspaceId];
  const currentWorkspace = workspaces[compositor.activeWorkspaceId];
  const nextFocusedWindowId =
    targetWorkspace.windows.length > 0 ? targetWorkspace.windows[0] : null;

  const workspacesAfterSwitch: Record<string, Workspace> = { ...workspaces };

  if (currentWorkspace) {
    if (currentWorkspace.windows.length === 0 && currentWorkspace.id !== targetWorkspaceId) {
      delete workspacesAfterSwitch[compositor.activeWorkspaceId];
    } else {
      workspacesAfterSwitch[compositor.activeWorkspaceId] = {
        ...currentWorkspace,
        isActive: false,
      };
    }
  }
  workspacesAfterSwitch[targetWorkspaceId] = { ...targetWorkspace, isActive: true };

  setCompositor({
    workspaces: workspacesAfterSwitch,
    activeWorkspaceId: targetWorkspaceId,
    activeWindowId: nextFocusedWindowId,
  });

  setTimeout(recalculateWindowPositions, 0);
};

export const cycleWindow = (direction: 'next' | 'prev'): void => {
  const activeWorkspace = compositor.workspaces[compositor.activeWorkspaceId];
  if (activeWorkspace.windows.length === 0) return;

  const currentIndex = activeWorkspace.windows.indexOf(compositor.activeWindowId ?? '');
  const nextIndex =
    direction === 'next'
      ? (currentIndex + 1) % activeWorkspace.windows.length
      : (currentIndex - 1 + activeWorkspace.windows.length) % activeWorkspace.windows.length;

  focusWindow(activeWorkspace.windows[nextIndex]);
};

export const setWindowFloating = (windowId: string, isFloating: boolean): void => {
  const targetWindow = compositor.windows[windowId];
  if (!targetWindow) return;

  const workspace = compositor.workspaces[targetWindow.workspaceId];
  if (!workspace) return;

  if (isFloating) {
    const { width: screenWidth, height: screenHeight } = getScreenDimensions();
    const centerX = (screenWidth - targetWindow.size.width) / 2;
    const centerY = (screenHeight - targetWindow.size.height) / 2;
    const nextZIndex = compositor.lastZIndex + 1;

    const { workspace: updatedWorkspace, updatedWindows } = removeWindowFromTree(
      workspace,
      windowId,
      compositor.windows,
    );

    setCompositor({
      windows: {
        ...compositor.windows,
        ...updatedWindows,
        [windowId]: {
          ...targetWindow,
          isFloating,
          position: { x: centerX, y: centerY },
          zIndex: nextZIndex,
        },
      },
      workspaces: {
        ...compositor.workspaces,
        [targetWindow.workspaceId]: updatedWorkspace,
      },
      lastZIndex: nextZIndex,
    });
  } else {
    if (workspace.windows.includes(windowId)) {
      return;
    }

    const { workspace: updatedWorkspace, updatedWindows } = addWindowToTree(
      workspace,
      windowId,
      compositor.windows,
    );

    const rect = getWindowRectFromLayout(updatedWorkspace.root, windowId);
    const newPosition = rect?.position ?? targetWindow.position;
    const newSize = rect?.size ?? targetWindow.size;

    setCompositor({
      windows: {
        ...compositor.windows,
        ...updatedWindows,
        [windowId]: { ...targetWindow, isFloating, position: newPosition, size: newSize },
      },
      workspaces: {
        ...compositor.workspaces,
        [targetWindow.workspaceId]: updatedWorkspace,
      },
    });
  }
};

export const swapWindows = (windowIdA: string, windowIdB: string): void => {
  const workspace = compositor.workspaces[compositor.activeWorkspaceId];
  if (!workspace?.root) return;

  if (!workspace.windows.includes(windowIdA) || !workspace.windows.includes(windowIdB)) {
    return;
  }

  const swappedRoot = swapNodes(workspace.root, windowIdA, windowIdB);
  const updatedWindows = applyLayoutToWindows(swappedRoot, compositor.windows);

  setCompositor({
    windows: { ...compositor.windows, ...updatedWindows },
    workspaces: {
      ...compositor.workspaces,
      [compositor.activeWorkspaceId]: {
        ...workspace,
        root: swappedRoot,
        windows: getLeaves(swappedRoot),
      },
    },
  });
};

export const updateWindowSplit = (windowId: string, ratio: number): void => {
  const workspace = compositor.workspaces[compositor.activeWorkspaceId];
  if (!workspace?.root) return;

  if (!workspace.windows.includes(windowId)) return;

  const parentNode = findParentNode(workspace.root, windowId);
  if (!parentNode) return;

  const updatedRoot = updateNodeSplitRatio(workspace.root, windowId, ratio);
  const updatedWindows = applyLayoutToWindows(updatedRoot, compositor.windows);

  setCompositor({
    windows: { ...compositor.windows, ...updatedWindows },
    workspaces: {
      ...compositor.workspaces,
      [compositor.activeWorkspaceId]: {
        ...workspace,
        root: updatedRoot,
      },
    },
  });
};

export const workspaceCompositorActions: WorkspaceActions = {
  createWindow,
  closeWindow,
  focusWindow,
  moveWindowToWorkspace,
  switchWorkspace,
  cycleWindow,
  getActiveWindowId: () => compositor.activeWindowId,
  setWindowFloating,
  swapWindows,
  updateWindowSplit,
};
