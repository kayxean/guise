import type { Workspace, WindowState, State, Actions } from './types';
import { useSyncExternalStore } from 'react';
import { compositorActions } from './compositor';
import { workspaceStore } from './store';

const cachedActions: Actions = compositorActions;

type SubscriberKey =
  | 'global'
  | 'windows'
  | 'workspaces'
  | 'activeWorkspaceId'
  | 'activeWindowId'
  | 'lastZIndex';

function getSelectorKeys(selector: Function): SubscriberKey[] {
  const source = selector.toString();
  const keys: SubscriberKey[] = [];

  if (source.includes('.windows')) keys.push('windows');
  if (source.includes('.workspaces')) keys.push('workspaces');
  if (source.includes('.activeWindowId')) keys.push('activeWindowId');
  if (source.includes('.activeWorkspaceId')) keys.push('activeWorkspaceId');
  if (source.includes('.lastZIndex')) keys.push('lastZIndex');

  return keys.length > 0 ? keys : ['windows'];
}

export function useWorkspace(): Workspace | null {
  const activeWorkspaceId = useStoreKey('activeWorkspaceId');
  const workspaces = useStoreKey('workspaces');
  return workspaces[activeWorkspaceId] ?? null;
}

export function useWindowIds(): string[] {
  const activeWorkspace = useWorkspace();
  return activeWorkspace?.windows ?? [];
}

export function useWindow(windowId: string): WindowState | null {
  const windows = useStoreKey('windows');
  return windows[windowId] ?? null;
}

export function useWindowSelector(windowId: string): WindowState | null {
  return useStoreSelector((state) => state.windows[windowId] ?? null);
}

export function useWindowId(): string | null {
  return useStoreKey('activeWindowId');
}

export function useWorkspaces(): Record<string, Workspace> {
  return useStoreKey('workspaces');
}

export function useWorkspaceId(): string {
  return useStoreKey('activeWorkspaceId');
}

export function useStore(): State & Actions {
  const state = workspaceStore.getState();
  return { ...state, ...cachedActions };
}

export function useStoreKey<K extends keyof State>(key: K): State[K] {
  return useSyncExternalStore(
    (onStoreChange: () => void) => workspaceStore.subscribeToKey(key, onStoreChange),
    () => workspaceStore.getState()[key],
    () => workspaceStore.getState()[key],
  );
}

export function useStoreSelector<T>(selector: (state: State) => T): T {
  const keys = getSelectorKeys(selector);

  return useSyncExternalStore(
    (onStoreChange: () => void) => {
      keys.forEach((key) => workspaceStore.subscribeToKey(key, onStoreChange));
      return () => {
        keys.forEach((key) => workspaceStore.unsubscribeFromKey(key, onStoreChange));
      };
    },
    () => selector(workspaceStore.getState()),
    () => selector(workspaceStore.getState()),
  );
}
