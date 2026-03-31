import { workspaceStoreActions, workspaceStoreSubscribers } from '~/lib/workspace/store';

export const getActiveWindowId = () => workspaceStoreSubscribers.getActiveWindowId();

export const getDispatcherHandlers = () => {
  const handlers: Record<string, () => void> = {
    j: () => workspaceStoreActions.cycleWindow('next'),
    k: () => workspaceStoreActions.cycleWindow('prev'),
    n: () => workspaceStoreActions.createWindow('demo-app', `Window ${Date.now()}`),
    w: () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.closeWindow(activeWindowId);
    },
    '1': () => workspaceStoreActions.switchWorkspace('1'),
    '2': () => workspaceStoreActions.switchWorkspace('2'),
    '3': () => workspaceStoreActions.switchWorkspace('3'),
    '4': () => workspaceStoreActions.switchWorkspace('4'),
    '5': () => workspaceStoreActions.switchWorkspace('5'),
    '6': () => workspaceStoreActions.switchWorkspace('6'),
    '7': () => workspaceStoreActions.switchWorkspace('7'),
    '8': () => workspaceStoreActions.switchWorkspace('8'),
    '9': () => workspaceStoreActions.switchWorkspace('9'),
    '!': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '1');
    },
    '@': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '2');
    },
    '#': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '3');
    },
    $: () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '4');
    },
    '%': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '5');
    },
    '^': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '6');
    },
    '&': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '7');
    },
    '*': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '8');
    },
    '(': () => {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) workspaceStoreActions.moveWindowToWorkspace(activeWindowId, '9');
    },
  };

  return handlers;
};

export const handleKeyEvent = (event: KeyboardEvent): boolean => {
  if (!event.altKey && !event.shiftKey) {
    return false;
  }

  const handlers = getDispatcherHandlers();
  const key = event.key;

  if (handlers[key]) {
    event.preventDefault();
    handlers[key]();
    return true;
  }

  return false;
};

export const isModifierKeyPressed = (event: KeyboardEvent): boolean => {
  return event.altKey || event.shiftKey;
};
