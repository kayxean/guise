import type { WindowState, Workspace } from './types';
import type { TreeNode } from './types';
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

export const ensureWorkspaceExists = (
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

export function getScreenDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: DEFAULT_SCREEN_WIDTH, height: DEFAULT_SCREEN_HEIGHT };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

export function getFloatingWindowsInWorkspace(
  windows: Record<string, WindowState>,
  workspaceId: string,
): WindowState[] {
  return Object.values(windows).filter((w) => w.workspaceId === workspaceId && w.isFloating);
}

export function getTopFloatingWindow(
  windows: Record<string, WindowState>,
  workspaceId: string,
): WindowState | null {
  const floatingWindows = getFloatingWindowsInWorkspace(windows, workspaceId);
  if (floatingWindows.length === 0) return null;

  return floatingWindows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), floatingWindows[0]);
}

export function calculateZIndexWithFloating(
  windows: Record<string, WindowState>,
  workspaceId: string,
  lastZIndex: number,
  isTargetFloating: boolean,
): number {
  const floatingWindows = getFloatingWindowsInWorkspace(windows, workspaceId);
  const hasFloatingWindows = floatingWindows.length > 0;

  if (hasFloatingWindows && !isTargetFloating) {
    const minFloatingZIndex = Math.min(...floatingWindows.map((w) => w.zIndex));
    return minFloatingZIndex - 1;
  }

  return lastZIndex + 1;
}

export function applyLayoutToWindows(
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

export function removeWindowFromTree(
  workspace: Workspace,
  windowId: string,
  windows: Record<string, WindowState>,
): { workspace: Workspace; updatedWindows: Record<string, WindowState> } {
  const newRoot = workspace.root ? removeLeaf(workspace.root, windowId) : null;
  const updatedWindows = applyLayoutToWindows(newRoot, windows);

  return {
    workspace: {
      ...workspace,
      root: newRoot,
      windows: newRoot ? getLeaves(newRoot) : [],
    },
    updatedWindows,
  };
}

export function addWindowToTree(
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

  const updatedWindows = applyLayoutToWindows(newRoot, windows);

  return {
    workspace: {
      ...workspace,
      root: newRoot,
      windows: getLeaves(newRoot),
    },
    updatedWindows,
  };
}

export function updateWindowPositionInTree(
  workspace: Workspace,
  windows: Record<string, WindowState>,
): { workspace: Workspace; updatedWindows: Record<string, WindowState> } {
  if (!workspace.root) {
    return { workspace, updatedWindows: {} };
  }

  const updatedWindows = applyLayoutToWindows(workspace.root, windows);

  return {
    workspace,
    updatedWindows,
  };
}

export function getWindowRectFromLayout(
  root: TreeNode | null,
  windowId: string,
): { position: { x: number; y: number }; size: { width: number; height: number } } | null {
  if (!root) return null;

  const layout = calculateLayout(root);
  return layout.get(windowId) ?? null;
}

export function recalculateAllWindowPositions(
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
