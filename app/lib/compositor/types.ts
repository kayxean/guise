/**
 * Defines the split orientation for a parent node in the tiling tree.
 */
export type SplitDirection = 'rows' | 'columns';

/**
 * A recursive node in the workspace tiling tree representing either a widow or a split.
 */
export type TreeNode =
  | {
      readonly type: 'leaf';
      readonly windowId: string;
    }
  | {
      readonly type: 'parent';
      readonly id: string;
      readonly direction: SplitDirection;
      readonly splitRatio: number;
      readonly children: readonly [TreeNode, TreeNode];
    };

/**
 * The internal state and geometry of a single application window.
 */
export interface WindowState {
  readonly id: string;
  readonly appId: string;
  readonly title: string;
  readonly workspaceId: string;
  readonly isFocused: boolean;
  readonly isFloating: boolean;
  readonly rect: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly zIndex: number;
  /**
   * Tracks the tiling context of this window for every workspace it has visited.
   */
  readonly workspaceContexts?: Record<
    string,
    {
      readonly siblingId: string | null;
      readonly direction: SplitDirection | null;
      readonly isFirstChild: boolean | null;
    }
  >;
}

/**
 * A virtual desktop container that manages a hierarchical tiling tree of windows.
 */
export interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly isActive: boolean;
  readonly windowIds: readonly string[];
  readonly root: TreeNode | null;
  readonly gaps: number;
}

/**
 * The global compositor state containing all windows, workspaces, and viewport settings.
 */
export interface State {
  readonly workspaces: Readonly<Record<string, Workspace>>;
  readonly windows: Readonly<Record<string, WindowState>>;
  readonly activeWorkspaceId: string;
  readonly activeWindowId: string | null;
  readonly lastZIndex: number;
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
  readonly config: {
    readonly gaps: number;
  };
}

/**
 * Core compositor actions for manipulating windows and workspaces.
 */
export interface Actions {
  createWindow: (appId: string, title: string, focus?: boolean) => void;
  focusWindow: (windowId: string) => void;
  closeWindow: (windowId: string) => void;
  floatWindow: (windowId: string) => void;
  moveWindow: (windowId: string, workspaceId: string) => void;
  cycleWindow: (direction: 'next' | 'prev') => void;
  swapWindows: (idA: string, idB: string) => void;
  switchWorkspace: (workspaceId: string) => void;
  resizeSplit: (nodeId: string, newRatio: number) => void;
}

export type StateKey = keyof State;
