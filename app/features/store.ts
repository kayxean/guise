import { useMemo, useRef, useSyncExternalStore } from 'react';
import { shallowEqual } from './utils';

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

function hasStateChanged<T extends State>(
  current: T,
  next: Partial<T>,
): boolean {
  const keys = Object.keys(next);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!Object.is(current[key], next[key as keyof T])) {
      return true;
    }
  }
  return false;
}

function notify(listeners: Set<() => void>) {
  const list = Array.from(listeners);
  for (let i = 0; i < list.length; i++) {
    list[i]();
  }
}

export function createStore<T extends State>(
  initialState: T,
): [UseStore<T>, StoreApi<T>] {
  let state = initialState;
  const listeners = new Set<() => void>();
  let rafHandle: number | null = null;

  const api: StoreApi<T> = {
    getState: () => state,
    setState: (updater) => {
      const nextPartial =
        typeof updater === 'function'
          ? (updater as (s: T) => Partial<T>)(state)
          : updater;

      if (hasStateChanged(state, nextPartial)) {
        state = { ...state, ...nextPartial };

        if (rafHandle !== null) {
          cancelAnimationFrame(rafHandle);
        }

        rafHandle = requestAnimationFrame(() => {
          rafHandle = null;
          notify(listeners);
        });
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
    const selectorRef = useRef(selector);
    selectorRef.current = selector;

    const [getSnapshot, getServerSnapshot] = useMemo(() => {
      const cache = {
        lastState: undefined as T | undefined,
        lastSlice: undefined as U | undefined,
      };

      const getCurrentSnapshot = (): U => {
        const currentState = api.getState();
        const sliceSelector = (selectorRef.current || ((s: T) => s)) as (
          state: T,
        ) => U;

        if (currentState === cache.lastState && cache.lastSlice !== undefined) {
          return cache.lastSlice;
        }

        const nextSlice = sliceSelector(currentState);

        if (
          cache.lastSlice !== undefined &&
          shallowEqual(cache.lastSlice, nextSlice)
        ) {
          cache.lastState = currentState;
          return cache.lastSlice;
        }

        cache.lastState = currentState;
        cache.lastSlice = nextSlice;
        return nextSlice;
      };

      return [getCurrentSnapshot, getCurrentSnapshot];
    }, []);

    return useSyncExternalStore(api.subscribe, getSnapshot, getServerSnapshot);
  }) as UseStore<T>;

  return [useStore, api];
}
