import { useSyncExternalStore } from 'react';
import { workspaceStoreSubscribers } from './store';
import type { Workspace, WindowState, WorkspaceState, WorkspaceActions } from './types';
import { workspaceCompositorActions } from './compositor';

const cachedActions: WorkspaceActions = workspaceCompositorActions;

export function useActiveWorkspace(): Workspace | null {
  const activeWorkspaceId = useWorkspaceStoreKey('activeWorkspaceId');
  const workspaces = useWorkspaceStoreKey('workspaces');
  return workspaces[activeWorkspaceId] ?? null;
}

export function useActiveWindowIds(): string[] {
  const activeWorkspace = useActiveWorkspace();
  return activeWorkspace?.windows ?? [];
}

export function useWindowById(windowId: string): WindowState | null {
  const windows = useWorkspaceStoreKey('windows');
  return windows[windowId] ?? null;
}

export function useWindowByIdSelector(windowId: string): WindowState | null {
  return useWorkspaceStoreSelector((state) => state.windows[windowId] ?? null);
}

export function useActiveWindowId(): string | null {
  return useWorkspaceStoreKey('activeWindowId');
}

export function useAllWorkspaces(): Record<string, Workspace> {
  return useWorkspaceStoreKey('workspaces');
}

export function useActiveWorkspaceId(): string {
  return useWorkspaceStoreKey('activeWorkspaceId');
}

export function useWorkspaceStore(): WorkspaceState & WorkspaceActions {
  const state = workspaceStoreSubscribers.getState();
  return { ...state, ...cachedActions };
}

export function useWorkspaceStoreKey<K extends keyof WorkspaceState>(key: K): WorkspaceState[K] {
  return useSyncExternalStore(
    (onStoreChange: () => void) => workspaceStoreSubscribers.subscribeToKey(key, onStoreChange),
    () => workspaceStoreSubscribers.getState()[key],
    () => workspaceStoreSubscribers.getState()[key],
  );
}

export function useWorkspaceStoreSelector<T>(selector: (state: WorkspaceState) => T): T {
  return useSyncExternalStore(
    (onStoreChange: () => void) =>
      workspaceStoreSubscribers.subscribeToKey('windows', onStoreChange),
    () => selector(workspaceStoreSubscribers.getState()),
    () => selector(workspaceStoreSubscribers.getState()),
  );
}
