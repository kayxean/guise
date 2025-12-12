type Listener = () => void;

export function createStore<T>(initialState: T) {
  let state = initialState;

  const listeners = new Set<Listener>();

  const getSnapshot = () => state;

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  const setState = (update: (prev: T) => T) => {
    const next = update(state);
    state = next;

    for (const listen of listeners) listen();
  };

  return { getSnapshot, subscribe, setState };
}
