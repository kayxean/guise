export interface TreeNode {
  id: string;
  children: [TreeNode | null, TreeNode | null];
  splitRatio?: number;
}

export interface Workspace {
  id: string;
  name: string;
  isActive: boolean;
  windows: string[];
  root: TreeNode | null;
}

export interface State {
  workspaces: Record<string, Workspace>;
  windows: Record<string, WindowState>;
  activeWorkspaceId: string;
  activeWindowId: string | null;
  lastZIndex: number;
}

export interface Actions {
  createWindow: (appId: string, title: string, focus?: boolean) => string;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  moveWindow: (windowId: string, workspaceId: string) => void;
  switchWorkspace: (workspaceId: string) => void;
  cycleWindow: (direction: 'next' | 'prev') => void;
  setFloating: (windowId: string, isFloating: boolean) => void;
  swapWindow: (windowIdA: string, windowIdB: string) => void;
  splitWindow: (windowId: string, ratio: number) => void;
}

export type Store = [() => State & Actions, Actions];

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  workspaceId: string;
  isFocused: boolean;
  isFloating: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}
