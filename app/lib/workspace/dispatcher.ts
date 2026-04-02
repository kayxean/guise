import { compositorActions } from './compositor';
import { workspaceStore } from './store';
import { getTopFloating } from './utils';

const getDispatcherHandlers = (): Record<string, () => void> => ({
  j: () => compositorActions.cycleWindow('next'),
  k: () => compositorActions.cycleWindow('prev'),
  f: () => {
    const state = workspaceStore.getState();
    const activeWorkspaceId = state.activeWorkspaceId;

    const topFloating = getTopFloating(state.windows, activeWorkspaceId);

    if (topFloating) {
      compositorActions.setFloating(topFloating.id, false);
    } else {
      const activeWindowId = state.activeWindowId;
      if (activeWindowId) {
        const windowState = state.windows[activeWindowId];
        if (windowState) {
          compositorActions.setFloating(activeWindowId, !windowState.isFloating);
        }
      }
    }
  },
  n: () => compositorActions.createWindow('demo-app', `Window ${Date.now()}`),
  w: () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.closeWindow(activeWindowId);
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
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '1');
  },
  '@': () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '2');
  },
  '#': () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '3');
  },
  $: () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '4');
  },
  '%': () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '5');
  },
  '^': () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '6');
  },
  '&': () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '7');
  },
  '*': () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '8');
  },
  '(': () => {
    const state = workspaceStore.getState();
    const activeWindowId = state.activeWindowId;
    if (activeWindowId) compositorActions.moveWindow(activeWindowId, '9');
  },
});

let handlers: Record<string, () => void> | null = null;

const getHandlers = (): Record<string, () => void> => {
  if (!handlers) {
    handlers = getDispatcherHandlers();
  }
  return handlers;
};

export const handleKeyEvent = (event: KeyboardEvent): boolean => {
  if (!event.altKey && !event.shiftKey) {
    return false;
  }

  const key = event.key.toLowerCase();
  const handlersMap = getHandlers();

  if (handlersMap[key]) {
    event.preventDefault();
    handlersMap[key]();
    return true;
  }

  return false;
};

export const isModifierKeyPressed = (event: KeyboardEvent): boolean => {
  return event.altKey || event.shiftKey;
};
