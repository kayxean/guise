import type { WindowState, Workspace, TreeNode } from './types';
import { calculateLayout, getLeaves, removeLeaf, splitNode } from './tree';

const DEFAULT_SCREEN_WIDTH = 1920;
const DEFAULT_SCREEN_HEIGHT = 1080;

export const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const shallowEqual = (a: unknown, b: unknown): boolean => {
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

export const ensureWorkspace = (
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

export function getScreen(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: DEFAULT_SCREEN_WIDTH, height: DEFAULT_SCREEN_HEIGHT };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

export function getFloatingWindows(
  windows: Record<string, WindowState>,
  workspaceId: string,
): WindowState[] {
  const result: WindowState[] = [];
  for (const win of Object.values(windows)) {
    if (win.workspaceId === workspaceId && win.isFloating) {
      result.push(win);
    }
  }
  return result;
}

export function getTopFloating(
  windows: Record<string, WindowState>,
  workspaceId: string,
): WindowState | null {
  let top: WindowState | null = null;
  for (const win of Object.values(windows)) {
    if (win.workspaceId === workspaceId && win.isFloating) {
      if (!top || win.zIndex > top.zIndex) {
        top = win;
      }
    }
  }
  return top;
}

export function calculateZIndex(
  windows: Record<string, WindowState>,
  workspaceId: string,
  lastZIndex: number,
  isTargetFloating: boolean,
): number {
  if (isTargetFloating) {
    return lastZIndex + 1;
  }

  let minZIndex = Infinity;
  let hasFloating = false;

  for (const win of Object.values(windows)) {
    if (win.workspaceId === workspaceId && win.isFloating) {
      hasFloating = true;
      if (win.zIndex < minZIndex) {
        minZIndex = win.zIndex;
      }
    }
  }

  if (hasFloating) {
    return minZIndex - 1;
  }

  return lastZIndex + 1;
}

export function applyLayout(
  root: TreeNode | null,
  windows: Record<string, WindowState>,
): Record<string, WindowState> {
  if (!root) return {};

  const layout = calculateLayout(root);
  const windowIds = getLeaves(root);
  const updatedWindows: Record<string, WindowState> = {};

  for (const id of windowIds) {
    const rect = layout.get(id);
    const existingWindow = windows[id];
    if (rect && existingWindow) {
      updatedWindows[id] = {
        ...existingWindow,
        position: rect.position,
        size: rect.size,
      };
    }
  }

  return updatedWindows;
}

export function removeFromTree(
  workspace: Workspace,
  windowId: string,
  windows: Record<string, WindowState>,
): { workspace: Workspace; updatedWindows: Record<string, WindowState> } {
  const newRoot = workspace.root ? removeLeaf(workspace.root, windowId) : null;
  const updatedWindows = applyLayout(newRoot, windows);

  return {
    workspace: {
      ...workspace,
      root: newRoot,
      windows: newRoot ? getLeaves(newRoot) : [],
    },
    updatedWindows,
  };
}

export function addToTree(
  workspace: Workspace,
  windowId: string,
  windows: Record<string, WindowState>,
): { workspace: Workspace; updatedWindows: Record<string, WindowState> } {
  let newRoot = workspace.root;

  if (workspace.root) {
    newRoot = splitNode(workspace.root, workspace.windows.length - 1, windowId);
  } else {
    newRoot = { id: windowId, children: [null, null] };
  }

  const updatedWindows = applyLayout(newRoot, windows);

  return {
    workspace: {
      ...workspace,
      root: newRoot,
      windows: getLeaves(newRoot),
    },
    updatedWindows,
  };
}

export function updatePosition(
  workspace: Workspace,
  windows: Record<string, WindowState>,
): { workspace: Workspace; updatedWindows: Record<string, WindowState> } {
  if (!workspace.root) {
    return { workspace, updatedWindows: {} };
  }

  const updatedWindows = applyLayout(workspace.root, windows);

  return {
    workspace,
    updatedWindows,
  };
}

export function getRect(
  root: TreeNode | null,
  windowId: string,
): { position: { x: number; y: number }; size: { width: number; height: number } } | null {
  if (!root) return null;

  const layout = calculateLayout(root);
  return layout.get(windowId) ?? null;
}

export function recalculatePositions(
  workspace: Workspace,
  windows: Record<string, WindowState>,
): Record<string, WindowState> {
  if (!workspace.root) return {};

  const layout = calculateLayout(workspace.root);
  const updatedWindows: Record<string, WindowState> = {};

  for (const windowId of workspace.windows) {
    const rect = layout.get(windowId);
    const existingWindow = windows[windowId];
    if (rect && existingWindow) {
      updatedWindows[windowId] = {
        ...existingWindow,
        position: rect.position,
        size: rect.size,
      };
    }
  }

  return updatedWindows;
}
