import { workspaceStoreSubscribers } from '~/lib/workspace/store';
import { workspaceCompositorActions } from '~/lib/workspace';
import { getTopFloatingWindow } from './utils';

export const getActiveWindowId = () => workspaceStoreSubscribers.getActiveWindowId();

const getDispatcherHandlers = (): Record<string, () => void> => ({
  j: () => workspaceCompositorActions.cycleWindow('next'),
  k: () => workspaceCompositorActions.cycleWindow('prev'),
  f: () => {
    const state = workspaceStoreSubscribers.getState();
    const activeWorkspaceId = state.activeWorkspaceId;

    const topFloating = getTopFloatingWindow(state.windows, activeWorkspaceId);

    if (topFloating) {
      workspaceCompositorActions.setWindowFloating(topFloating.id, false);
    } else {
      const activeWindowId = getActiveWindowId();
      if (activeWindowId) {
        const windowState = state.windows[activeWindowId];
        if (windowState) {
          workspaceCompositorActions.setWindowFloating(activeWindowId, !windowState.isFloating);
        }
      }
    }
  },
  n: () => workspaceCompositorActions.createWindow('demo-app', `Window ${Date.now()}`),
  w: () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.closeWindow(activeWindowId);
  },
  '1': () => workspaceCompositorActions.switchWorkspace('1'),
  '2': () => workspaceCompositorActions.switchWorkspace('2'),
  '3': () => workspaceCompositorActions.switchWorkspace('3'),
  '4': () => workspaceCompositorActions.switchWorkspace('4'),
  '5': () => workspaceCompositorActions.switchWorkspace('5'),
  '6': () => workspaceCompositorActions.switchWorkspace('6'),
  '7': () => workspaceCompositorActions.switchWorkspace('7'),
  '8': () => workspaceCompositorActions.switchWorkspace('8'),
  '9': () => workspaceCompositorActions.switchWorkspace('9'),
  '!': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '1');
  },
  '@': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '2');
  },
  '#': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '3');
  },
  $: () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '4');
  },
  '%': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '5');
  },
  '^': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '6');
  },
  '&': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '7');
  },
  '*': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '8');
  },
  '(': () => {
    const activeWindowId = getActiveWindowId();
    if (activeWindowId) workspaceCompositorActions.moveWindowToWorkspace(activeWindowId, '9');
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

  const key = event.key;
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
