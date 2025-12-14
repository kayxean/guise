import { useRef, useSyncExternalStore } from 'react';
import { shallowEqual } from './utils';

type State = Record<string, unknown>;

type Selector<T extends State, U> = (state: T) => U;

type SetState<T extends State> = (updater: Partial<T> | ((state: T) => Partial<T>)) => void;

interface StoreApi<T extends State> {
  getState: () => T;
  setState: SetState<T>;
  subscribe: (listener: () => void) => () => void;
}

type UseStore<T extends State> = {
  <U>(selector: Selector<T, U>): U;
  (): T;
};

export const createStore = <T extends State>(initialState: T): [UseStore<T>, StoreApi<T>] => {
  let state: T = initialState;
  const listeners = new Set<() => void>();

  const api: StoreApi<T> = {
    getState: () => state,

    setState: (updater) => {
      const nextPartial: Partial<T> = typeof updater === 'function' ? updater(state) : updater;

      const partialKeys = Object.keys(nextPartial) as Array<keyof T>;
      if (partialKeys.length === 0) return;

      let changed = false;
      const nextState: T = { ...state };

      for (const key of partialKeys) {
        if (Object.hasOwn(nextPartial, key)) {
          const nextValue = nextPartial[key];
          if (!Object.is(state[key], nextValue)) {
            (nextState[key] as T[keyof T]) = nextValue as T[keyof T];
            changed = true;
          }
        }
      }

      if (changed) {
        state = nextState;
        listeners.forEach((listener) => {
          listener();
        });
      }
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  const useStore: UseStore<T> = ((selector?: Selector<T, unknown>) => {
    const snapshot = selector || ((s: T) => s);

    const isEqual = selector
      ? <U>(a: U, b: U) =>
          typeof a === 'object' &&
          a !== null &&
          typeof b === 'object' &&
          b !== null &&
          !Array.isArray(a) &&
          !Array.isArray(b)
            ? shallowEqual(a, b)
            : Object.is(a, b)
      : Object.is;

    type U = ReturnType<typeof snapshot>;

    const cachedSelectedValue = useRef<U | undefined>(undefined);
    const lastProcessedStoreState = useRef<T | undefined>(undefined);

    const getSnapshot = () => {
      const currentStoreState = api.getState();
      const lastCheckedState = lastProcessedStoreState.current;

      if (currentStoreState === lastCheckedState) {
        return cachedSelectedValue.current as U;
      }

      const newSelectedSnapshot = snapshot(currentStoreState) as U;
      const oldSelectedSnapshot = cachedSelectedValue.current as U | undefined;

      if (isEqual(newSelectedSnapshot, oldSelectedSnapshot as U)) {
        lastProcessedStoreState.current = currentStoreState;
        return oldSelectedSnapshot as U;
      }

      cachedSelectedValue.current = newSelectedSnapshot;
      lastProcessedStoreState.current = currentStoreState;
      return newSelectedSnapshot;
    };

    const getServerSnapshot = () => snapshot(api.getState()) as U;

    return useSyncExternalStore(api.subscribe, getSnapshot, getServerSnapshot);
  }) as UseStore<T>;

  return [useStore, api];
};
