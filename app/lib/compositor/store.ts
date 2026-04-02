import type { State, StateKey } from './types';

/**
 * The internal, source-of-truth state for the compositor.
 */
let internalState: State = {
  workspaces: {
    '1': {
      id: '1',
      name: '1',
      isActive: true,
      windowIds: [],
      root: null,
      gaps: 8,
    },
  },
  windows: {},
  activeWorkspaceId: '1',
  activeWindowId: null,
  lastZIndex: 10,
  viewport: {
    width: 1920,
    height: 1080,
  },
  config: {
    gaps: 8,
  },
};

const keyObservers = new Map<StateKey, Set<() => void>>();
const rootObservers = new Set<() => void>();
const windowObservers = new Map<string, Set<() => void>>();

let rafHandle: number | null = null;
const dirtyKeys = new Set<StateKey>();

/**
 * Triggers re-renders for all observers affected by the recent state changes.
 */
const dispatch = (): void => {
  if (rafHandle !== null) return;

  rafHandle = requestAnimationFrame(() => {
    const currentDirty = new Set(dirtyKeys);
    dirtyKeys.clear();
    rafHandle = null;

    for (const key of currentDirty) {
      keyObservers.get(key)?.forEach((emit) => emit());

      if (key === 'windows') {
        windowObservers.forEach((emits) => {
          emits.forEach((emit) => emit());
        });
      }
    }

    rootObservers.forEach((emit) => emit());
  });
};

/**
 * Updates the state and schedules a notify dispatch on the next frame.
 */
export const commit = (payload: Partial<State>): void => {
  let hasChanges = false;
  const nextState = { ...internalState };

  for (const k in payload) {
    const key = k as StateKey;
    const newValue = payload[key];

    if (newValue !== undefined && newValue !== internalState[key]) {
      Object.assign(nextState, { [key]: newValue });
      dirtyKeys.add(key);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    internalState = nextState;
    dispatch();
  }
};

/**
 * Provides access to state snapshots and subscription mechanisms.
 */
export const stateManager = {
  /**
   * Returns a read-only snapshot of the current state.
   */
  snapshot: (): State => internalState,

  /**
   * Subscribes a callback to changes in a specific top-level state key.
   */
  watchKey: (key: StateKey, callback: () => void): (() => void) => {
    if (!keyObservers.has(key)) keyObservers.set(key, new Set());
    keyObservers.get(key)!.add(callback);
    return () => {
      keyObservers.get(key)?.delete(callback);
    };
  },

  /**
   * Subscribes a callback to changes in a specific window ID.
   */
  watchWindow: (windowId: string, callback: () => void): (() => void) => {
    if (!windowObservers.has(windowId)) windowObservers.set(windowId, new Set());
    windowObservers.get(windowId)!.add(callback);
    return () => {
      windowObservers.get(windowId)?.delete(callback);
      if (windowObservers.get(windowId)?.size === 0) {
        windowObservers.delete(windowId);
      }
    };
  },
};
