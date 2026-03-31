import { createStore } from '~/utils/store';
import type {
  CompositorState,
  CompositorActions,
  CompositorStore,
  Window,
  Workspace,
  TreeNode,
} from './types';

const generateId = () => Math.random().toString(36).substring(2, 9);

function isLeaf(node: TreeNode): boolean {
  return !node.children[0] && !node.children[1];
}

function getLeaves(node: TreeNode, list: string[] = []): string[] {
  if (isLeaf(node)) {
    list.push(node.id);
    return list;
  }
  const [left, right] = node.children;
  if (left) getLeaves(left, list);
  if (right) getLeaves(right, list);
  return list;
}

function splitNode(root: TreeNode, targetIndex: number, newId: string): TreeNode {
  const leaves = getLeaves(root);
  const targetId = leaves[targetIndex];

  function replace(node: TreeNode): TreeNode {
    if (isLeaf(node)) {
      if (node.id === targetId) {
        return {
          id: `split_${newId}`,
          children: [
            { id: targetId, children: [null, null] },
            { id: newId, children: [null, null] },
          ],
        };
      }
      return node;
    }

    const [left, right] = node.children;
    const newLeft = left ? replace(left) : null;
    const newRight = right ? replace(right) : null;

    if (newLeft !== left || newRight !== right) {
      return { ...node, children: [newLeft, newRight] };
    }
    return node;
  }

  return replace(root);
}

function splitNodeAtWindow(root: TreeNode, targetId: string, newId: string): TreeNode {
  function replace(node: TreeNode): TreeNode {
    if (isLeaf(node)) {
      if (node.id === targetId) {
        return {
          id: `split_${newId}`,
          children: [
            { id: targetId, children: [null, null] },
            { id: newId, children: [null, null] },
          ],
        };
      }
      return node;
    }

    const [left, right] = node.children;
    const newLeft = left ? replace(left) : null;
    const newRight = right ? replace(right) : null;

    if (newLeft !== left || newRight !== right) {
      return { ...node, children: [newLeft, newRight] };
    }
    return node;
  }

  return replace(root);
}

function removeLeaf(root: TreeNode, targetId: string): TreeNode | null {
  if (root.id === targetId && !root.children[0] && !root.children[1]) {
    return null;
  }

  const [left, right] = root.children;

  if (left?.id === targetId) {
    if (!right) return null;
    return right;
  }
  if (right?.id === targetId) {
    if (!left) return null;
    return left;
  }

  if (left && right) {
    const newLeft = removeLeaf(left, targetId);
    const newRight = removeLeaf(right, targetId);
    if (newLeft !== left || newRight !== right) {
      if (!newLeft) return newRight;
      if (!newRight) return newLeft;
      return { ...root, children: [newLeft, newRight] };
    }
  }

  return root;
}

function applyLayout(
  node: TreeNode,
  x: number,
  y: number,
  w: number,
  h: number,
  result: Map<
    string,
    { position: { x: number; y: number }; size: { width: number; height: number } }
  >,
): void {
  if (isLeaf(node)) {
    result.set(node.id, { position: { x, y }, size: { width: w, height: h } });
    return;
  }

  const [left, right] = node.children;
  if (w > h) {
    const halfW = w / 2;
    if (left) applyLayout(left, x, y, halfW, h, result);
    if (right) applyLayout(right, x + halfW, y, halfW, h, result);
  } else {
    const halfH = h / 2;
    if (left) applyLayout(left, x, y, w, halfH, result);
    if (right) applyLayout(right, x, y + halfH, w, halfH, result);
  }
}

function calculateLayout(
  root: TreeNode | null,
): Map<string, { position: { x: number; y: number }; size: { width: number; height: number } }> {
  const result = new Map();
  if (!root) return result;
  applyLayout(root, 0, 0, window.innerWidth, window.innerHeight, result);
  return result;
}

function createCompositorStore(): CompositorStore {
  const defaultWorkspaces: Record<string, Workspace> = {
    '1': { id: '1', name: '1', isActive: true, windows: [], root: null },
  };

  const ensureWorkspace = (
    workspaces: Record<string, Workspace>,
    workspaceId: string,
  ): Record<string, Workspace> => {
    if (workspaces[workspaceId]) return workspaces;

    const newWorkspaces = { ...workspaces };
    newWorkspaces[workspaceId] = {
      id: workspaceId,
      name: workspaceId,
      isActive: false,
      windows: [],
      root: null,
    };
    return newWorkspaces;
  };

  const initialState: CompositorState = {
    workspaces: defaultWorkspaces,
    windows: {},
    activeWorkspaceId: '1',
    activeWindowId: null,
    lastZIndex: 0,
  };

  const [useStore, api] = createStore<CompositorState>(initialState);

  const refreshLayout = () => {
    const state = api.getState();
    const ws = state.workspaces[state.activeWorkspaceId];
    if (!ws.root) return;

    const layout = calculateLayout(ws.root);
    const newWindows: Record<string, Window> = { ...state.windows };

    for (const id of ws.windows) {
      const rect = layout.get(id);
      const existing = newWindows[id];
      if (rect && existing) {
        newWindows[id] = { ...existing, position: rect.position, size: rect.size };
      }
    }

    if (Object.keys(newWindows).length > 0) {
      api.setState({ windows: newWindows });
    }
  };

  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(refreshLayout, 16);
    });
  }

  const createWindow = (appId: string, title: string, focus = true): string => {
    const state = api.getState();
    const ws = state.workspaces[state.activeWorkspaceId];
    const windowId = generateId();
    const newZIndex = state.lastZIndex + 1;

    let newRoot: TreeNode | null = null;
    let windowIds: string[] = [];

    if (ws.windows.length === 0) {
      newRoot = { id: windowId, children: [null, null] };
      windowIds = [windowId];
    } else if (ws.root) {
      const activeWinId = state.activeWindowId;
      const isActiveInCurrentWorkspace = activeWinId && ws.windows.includes(activeWinId);

      if (isActiveInCurrentWorkspace) {
        newRoot = splitNodeAtWindow(ws.root, activeWinId, windowId);
      } else {
        const insertIndex = ws.windows.length - 1;
        newRoot = splitNode(ws.root, insertIndex, windowId);
      }

      const leaves = getLeaves(newRoot);
      windowIds = leaves;
    } else {
      newRoot = { id: ws.windows[0], children: [null, null] };
      for (let i = 1; i < ws.windows.length; i++) {
        newRoot = splitNode(newRoot, i - 1, ws.windows[i]);
      }
      newRoot = splitNode(newRoot, ws.windows.length - 1, windowId);
      const leaves = getLeaves(newRoot);
      windowIds = leaves;
    }

    const layout = calculateLayout(newRoot);
    const newWindows: Record<string, Window> = {};

    for (const [id, rect] of layout) {
      const existing = state.windows[id];
      const isNew = id === windowId;
      newWindows[id] = {
        ...existing,
        id,
        position: rect.position,
        size: rect.size,
        isFocused: isNew ? focus : (existing?.isFocused ?? false),
        zIndex: isNew ? newZIndex : (existing?.zIndex ?? 0),
      };
    }

    newWindows[windowId] = {
      id: windowId,
      appId,
      title,
      workspaceId: state.activeWorkspaceId,
      isFocused: focus,
      position: layout.get(windowId)?.position ?? { x: 0, y: 0 },
      size: layout.get(windowId)?.size ?? {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      zIndex: newZIndex,
    };

    api.setState({
      windows: { ...state.windows, ...newWindows },
      workspaces: {
        ...state.workspaces,
        [state.activeWorkspaceId]: { ...ws, windows: windowIds, root: newRoot },
      },
      activeWindowId: focus ? windowId : state.activeWindowId,
      lastZIndex: newZIndex,
    });

    return windowId;
  };

  const closeWindow = (windowId: string): void => {
    const state = api.getState();
    const win = state.windows[windowId];
    if (!win) return;

    const ws = state.workspaces[win.workspaceId];
    const newWindowIds = ws.windows.filter((id) => id !== windowId);

    if (!ws.root || newWindowIds.length === 0) {
      const newWindows = { ...state.windows };
      delete newWindows[windowId];

      for (const id of ws.windows) {
        if (id !== windowId) {
          delete newWindows[id];
        }
      }

      api.setState({
        windows: newWindows,
        workspaces: {
          ...state.workspaces,
          [win.workspaceId]: { ...ws, windows: [], root: null },
        },
        activeWindowId: state.activeWorkspaceId === win.workspaceId ? null : state.activeWindowId,
      });
      return;
    }

    let newRoot = removeLeaf(ws.root, windowId);

    const layout = calculateLayout(newRoot);
    const newWindows: Record<string, Window> = { ...state.windows };

    delete newWindows[windowId];

    for (const id of newWindowIds) {
      const rect = layout.get(id);
      if (rect && newWindows[id]) {
        newWindows[id] = { ...newWindows[id], position: rect.position, size: rect.size };
      }
    }

    const closedIndex = ws.windows.indexOf(windowId);
    const newActiveWindowId =
      state.activeWindowId === windowId
        ? newWindowIds.length > 0
          ? newWindowIds[Math.max(0, closedIndex - 1)]
          : null
        : state.activeWindowId;

    api.setState({
      windows: { ...state.windows, ...newWindows },
      workspaces: {
        ...state.workspaces,
        [win.workspaceId]: { ...ws, windows: newWindowIds, root: newRoot },
      },
      activeWindowId: newActiveWindowId,
    });
  };

  const focusWindow = (windowId: string): void => {
    const state = api.getState();
    const win = state.windows[windowId];
    if (!win) return;

    const newZIndex = state.lastZIndex + 1;

    api.setState({
      windows: {
        ...state.windows,
        [windowId]: { ...win, isFocused: true, zIndex: newZIndex },
      },
      activeWindowId: windowId,
      activeWorkspaceId: win.workspaceId,
      lastZIndex: newZIndex,
    });
  };

  const moveWindowToWorkspace = (windowId: string, workspaceId: string): void => {
    const state = api.getState();
    const win = state.windows[windowId];
    if (!win) return;

    let targetWorkspaceId = workspaceId;
    let workspaces = state.workspaces;

    if (
      !workspaces[workspaceId] ||
      (workspaces[workspaceId].windows.length === 0 && !workspaces[workspaceId].root)
    ) {
      workspaces = ensureWorkspace(workspaces, workspaceId);
    }

    const targetWs = workspaces[targetWorkspaceId];
    const sourceWs = workspaces[win.workspaceId];

    if (sourceWs.id === targetWorkspaceId) return;

    let newSourceRoot: TreeNode | null = sourceWs.root ? removeLeaf(sourceWs.root, windowId) : null;

    const newSourceWs = {
      ...sourceWs,
      windows: sourceWs.windows.filter((id) => id !== windowId),
      root: newSourceRoot,
    };

    let newTargetRoot: TreeNode | null = null;
    let targetWindowIds: string[] = [];

    if (targetWs.windows.length === 0) {
      newTargetRoot = { id: windowId, children: [null, null] };
      targetWindowIds = [windowId];
    } else if (targetWs.root) {
      const insertIndex = targetWs.windows.length - 1;
      newTargetRoot = splitNode(targetWs.root, insertIndex, windowId);
      targetWindowIds = getLeaves(newTargetRoot);
    } else {
      newTargetRoot = { id: targetWs.windows[0], children: [null, null] };
      for (let i = 1; i < targetWs.windows.length; i++) {
        newTargetRoot = splitNode(newTargetRoot, i - 1, targetWs.windows[i]);
      }
      newTargetRoot = splitNode(newTargetRoot, targetWs.windows.length - 1, windowId);
      targetWindowIds = getLeaves(newTargetRoot);
    }

    const newTargetWs = {
      ...targetWs,
      windows: targetWindowIds,
      root: newTargetRoot,
    };

    const sourceLayout = calculateLayout(newSourceWs.root);
    const targetLayout = calculateLayout(newTargetWs.root);

    const newWindows = { ...state.windows };

    for (const [id, rect] of sourceLayout) {
      if (newWindows[id]) {
        newWindows[id] = {
          ...newWindows[id],
          position: rect.position,
          size: rect.size,
        };
      }
    }

    for (const [id, rect] of targetLayout) {
      if (newWindows[id]) {
        newWindows[id] = {
          ...newWindows[id],
          position: rect.position,
          size: rect.size,
          workspaceId: id === windowId ? targetWorkspaceId : newWindows[id].workspaceId,
          isFocused: id === windowId,
        };
      }
    }

    api.setState({
      windows: { ...state.windows, ...newWindows },
      workspaces: {
        ...workspaces,
        [win.workspaceId]: newSourceWs,
        [targetWorkspaceId]: newTargetWs,
      },
      activeWorkspaceId: targetWorkspaceId,
      activeWindowId: windowId,
      lastZIndex: state.lastZIndex + 1,
    });
  };

  const switchWorkspace = (workspaceId: string): void => {
    const state = api.getState();
    let workspaces = state.workspaces;
    let targetWorkspaceId = workspaceId;

    if (!workspaces[workspaceId]) {
      workspaces = ensureWorkspace(workspaces, workspaceId);
    }

    const ws = workspaces[targetWorkspaceId];
    const currentWs = workspaces[state.activeWorkspaceId];
    const newActiveWindowId = ws.windows.length > 0 ? ws.windows[0] : null;

    api.setState({
      workspaces: {
        ...workspaces,
        [state.activeWorkspaceId]: { ...currentWs, isActive: false },
        [targetWorkspaceId]: { ...ws, isActive: true },
      },
      activeWorkspaceId: targetWorkspaceId,
      activeWindowId: newActiveWindowId,
    });

    setTimeout(refreshLayout, 0);
  };

  const cycleWindow = (direction: 'next' | 'prev'): void => {
    const state = api.getState();
    const ws = state.workspaces[state.activeWorkspaceId];
    if (ws.windows.length === 0) return;

    const currentIndex = ws.windows.indexOf(state.activeWindowId ?? '');
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % ws.windows.length
        : (currentIndex - 1 + ws.windows.length) % ws.windows.length;

    focusWindow(ws.windows[nextIndex]);
  };

  const actions: CompositorActions = {
    createWindow,
    closeWindow,
    focusWindow,
    moveWindowToWorkspace,
    switchWorkspace,
    cycleWindow,
    getActiveWindowId: () => api.getState().activeWindowId,
  };

  return [() => ({ ...useStore(), ...actions }), actions];
}

export const [useCompositor, compositorActions] = createCompositorStore();
