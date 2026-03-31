import { compositorActions } from './stores';

let activeWindowIdRef: string | null = null;

export const updateActiveWindowId = (id: string | null) => {
  activeWindowIdRef = id;
};

export const getDispatcherHandlers = () => {
  const handlers: Record<string, () => void> = {
    j: () => compositorActions.cycleWindow('next'),
    k: () => compositorActions.cycleWindow('prev'),
    n: () => compositorActions.createWindow('demo-app', `Window ${Date.now()}`),
    w: () => {
      if (activeWindowIdRef) compositorActions.closeWindow(activeWindowIdRef);
    },
    '1': () => compositorActions.switchWorkspace('1'),
    '2': () => compositorActions.switchWorkspace('2'),
    '3': () => compositorActions.switchWorkspace('3'),
    '4': () => compositorActions.switchWorkspace('4'),
    '5': () => compositorActions.switchWorkspace('5'),
    '6': () => compositorActions.switchWorkspace('6'),
    '7': () => compositorActions.switchWorkspace('7'),
    '8': () => compositorActions.switchWorkspace('8'),
    '9': () => compositorActions.switchWorkspace('9'),
    '!': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '1');
    },
    '@': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '2');
    },
    '#': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '3');
    },
    $: () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '4');
    },
    '%': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '5');
    },
    '^': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '6');
    },
    '&': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '7');
    },
    '*': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '8');
    },
    '(': () => {
      if (activeWindowIdRef) compositorActions.moveWindowToWorkspace(activeWindowIdRef, '9');
    },
  };

  return handlers;
};

export const handleKeyEvent = (event: KeyboardEvent): boolean => {
  const handlers = getDispatcherHandlers();
  const key = event.key;

  if (handlers[key]) {
    event.preventDefault();
    handlers[key]();
    return true;
  }

  return false;
};
