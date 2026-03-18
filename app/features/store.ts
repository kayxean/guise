import { useCallback, useRef, useSyncExternalStore } from 'react';

type State = Record<string, unknown>;
type Selector<T extends State, U> = (state: T) => U;
type StateUpdater<T extends State> = Partial<T> | ((state: T) => Partial<T>);

interface StoreApi<T extends State> {
  getState: () => T;
  setState: (updater: StateUpdater<T>) => void;
  subscribe: (listener: () => void) => () => void;
}

interface UseStore<T extends State> {
  (): T;
  <U>(selector: Selector<T, U>): U;
}

function hasStateChanged<T extends State>(current: T, nextPartial: Partial<T>): boolean {
  for (const key in nextPartial) {
    const prev = current[key];
    const next = nextPartial[key];

    if (Object.is(prev, next)) continue;

    if (prev instanceof Float32Array && next instanceof Float32Array) {
      if (prev.length !== next.length) return true;
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== next[i]) return true;
      }
      continue;
    }

    return true;
  }
  return false;
}

function notify(listeners: Set<() => void>) {
  for (const listener of listeners) {
    listener();
  }
}

export function createStore<T extends State>(initialState: T): [UseStore<T>, StoreApi<T>] {
  let state = initialState;
  const listeners = new Set<() => void>();
  let rafHandle: number | null = null;

  const api: StoreApi<T> = {
    getState: () => state,
    setState: (updater) => {
      const nextPartial =
        typeof updater === 'function' ? (updater as (s: T) => Partial<T>)(state) : updater;

      if (hasStateChanged(state, nextPartial)) {
        state = { ...state, ...nextPartial };

        if (rafHandle === null) {
          rafHandle = requestAnimationFrame(() => {
            rafHandle = null;
            notify(listeners);
          });
        }
      }
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
        if (listeners.size === 0 && rafHandle !== null) {
          cancelAnimationFrame(rafHandle);
          rafHandle = null;
        }
      };
    },
  };

  const useStore = (<U>(selector?: Selector<T, U>): U | T => {
    const apiState = api.getState();

    const lastStateRef = useRef<T>(apiState);
    const lastSelectedStateRef = useRef<U | T>(selector ? selector(apiState) : apiState);

    const getSnapshot = useCallback(() => {
      const currentState = api.getState();

      if (Object.is(currentState, lastStateRef.current)) {
        return lastSelectedStateRef.current;
      }

      const nextSelection = selector ? selector(currentState) : currentState;

      lastStateRef.current = currentState;
      lastSelectedStateRef.current = nextSelection;

      return nextSelection;
    }, [selector]);

    return useSyncExternalStore(api.subscribe, getSnapshot, getSnapshot);
  }) as UseStore<T>;

  return [useStore, api];
}
