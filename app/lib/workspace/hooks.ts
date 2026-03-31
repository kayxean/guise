import { useWorkspaceStoreKey, useWorkspaceStoreSelector } from './store';
import type { Workspace, WindowState } from './types';

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
