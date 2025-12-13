type Listener = () => void;

type Updater<T> = T | ((prev: T) => T);

export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  const getSnapshot = () => state;

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const setState = (updater: Updater<T>) => {
    const nextState = typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater;

    if (Object.is(nextState, state)) {
      return;
    }

    state = nextState;

    listeners.forEach((listener) => {
      listener();
    });
  };

  return { getSnapshot, subscribe, setState };
}
