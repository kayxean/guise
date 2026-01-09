import { useMemo, useSyncExternalStore } from 'react';
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

export const createStore = <T extends State>(
  initialState: T,
): [UseStore<T>, StoreApi<T>] => {
  let state = initialState;
  const listeners = new Set<() => void>();
  let idleHandle: number | null = null;

  const api: StoreApi<T> = {
    getState: () => state,
    setState: (updater) => {
      const nextPartial =
        typeof updater === 'function'
          ? (updater as (s: T) => Partial<T>)(state)
          : updater;

      let hasChanged = false;

      for (const key in nextPartial) {
        if (Object.hasOwn(nextPartial, key)) {
          if (!Object.is(state[key], nextPartial[key as keyof T])) {
            hasChanged = true;
            break;
          }
        }
      }

      if (hasChanged) {
        state = { ...state, ...nextPartial };

        if (idleHandle !== null) cancelIdleCallback(idleHandle);

        idleHandle = requestIdleCallback(
          () => {
            idleHandle = null;
            for (const l of listeners) {
              l();
            }
          },
          { timeout: 100 },
        );
      }
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
        if (listeners.size === 0 && idleHandle !== null) {
          cancelIdleCallback(idleHandle);
          idleHandle = null;
        }
      };
    },
  };

  const useStore = (<U>(selector?: Selector<T, U>): U | T => {
    const sliceSelector = (selector || ((s: T) => s)) as (state: T) => U;

    const [getSnapshot, getServerSnapshot] = useMemo(() => {
      const cache = {
        lastState: undefined as T | undefined,
        lastSlice: undefined as U | undefined,
      };

      const getCurrentSnapshot = (): U => {
        const currentState = api.getState();

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
    }, [sliceSelector]);

    return useSyncExternalStore(api.subscribe, getSnapshot, getServerSnapshot);
  }) as UseStore<T>;

  return [useStore, api];
};
