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

export interface WorkspaceState {
  workspaces: Record<string, Workspace>;
  windows: Record<string, WindowState>;
  activeWorkspaceId: string;
  activeWindowId: string | null;
  lastZIndex: number;
}

export interface WorkspaceActions {
  createWindow: (appId: string, title: string, focus?: boolean) => string;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  moveWindowToWorkspace: (windowId: string, workspaceId: string) => void;
  switchWorkspace: (workspaceId: string) => void;
  cycleWindow: (direction: 'next' | 'prev') => void;
  getActiveWindowId: () => string | null;
  setWindowFloating: (windowId: string, isFloating: boolean) => void;
  swapWindows: (windowIdA: string, windowIdB: string) => void;
  updateWindowSplit: (windowId: string, ratio: number) => void;
}

export type WorkspaceStore = [() => WorkspaceState & WorkspaceActions, WorkspaceActions];

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

export interface CompositorState extends WorkspaceState {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  lastZIndex: number;
}
