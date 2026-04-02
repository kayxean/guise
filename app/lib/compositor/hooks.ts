import { useSyncExternalStore, useMemo } from 'react';
import type { State, Workspace, WindowState, Actions } from './types';
import { stateManager } from './store';
import { compositorActions } from './actions';

/**
 * Subscribes to a specific top-level key in the state, triggering re-renders only on its modification.
 */
export function useStoreKey<K extends keyof State>(key: K): State[K] {
  return useSyncExternalStore(
    (onStoreChange) => stateManager.watchKey(key, onStoreChange),
    () => stateManager.snapshot()[key],
    () => stateManager.snapshot()[key],
  );
}

/**
 * Returns the currently active workspace object.
 */
export function useWorkspace(): Workspace {
  const workspaces = useStoreKey('workspaces');
  const activeId = useStoreKey('activeWorkspaceId');
  return workspaces[activeId];
}

/**
 * Returns the gap size for the active workspace.
 */
export function useWorkspaceGaps(): number {
  const ws = useWorkspace();
  return ws?.gaps ?? 8;
}

/**
 * Returns the ID of the window that currently has focus.
 */
export function useActiveWindowId(): string | null {
  return useStoreKey('activeWindowId');
}

/**
 * Returns a collection of all available workspaces.
 */
export function useWorkspaces(): Record<string, Workspace> {
  return useStoreKey('workspaces');
}

/**
 * Returns a stable reference to all compositor action dispatchers.
 */
export function useActions(): Actions {
  return useMemo(() => compositorActions, []);
}

/**
 * High-performance hook that only triggers re-renders when a specific window's data changes.
 */
export function useWindowSelector<T>(
  windowId: string,
  selector: (win: WindowState) => T,
): T | null {
  const value = useSyncExternalStore(
    (onStoreChange) => stateManager.watchWindow(windowId, onStoreChange),
    () => {
      const win = stateManager.snapshot().windows[windowId];
      return win ? selector(win) : null;
    },
    () => {
      const win = stateManager.snapshot().windows[windowId];
      return win ? selector(win) : null;
    },
  );

  return value;
}
