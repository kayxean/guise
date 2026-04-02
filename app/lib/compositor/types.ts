export type SplitDirection = 'rows' | 'columns';

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
  readonly lastTiledSiblingId?: string | null;
  readonly lastTiledDirection?: SplitDirection | null;
  readonly lastTiledIsFirstChild?: boolean | null;
}

export interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly isActive: boolean;
  readonly windowIds: readonly string[];
  readonly root: TreeNode | null;
  readonly gaps: number;
}

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
