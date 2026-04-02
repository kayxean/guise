import { compositorActions } from './actions';
import { stateManager } from './store';

/**
 * Global keyboard event handler that translates physical key presses into compositor actions.
 */
export function handleKeyEvent(e: KeyboardEvent): void {
  // Only handle Alt-based shortcuts for now
  if (!e.altKey) return;

  const state = stateManager.snapshot();
  const activeWindowId = state.activeWindowId;
  const key = e.key.toLowerCase();

  // Workspace Switching & Moving (Alt + 1-9, Alt + Shift + 1-9)
  // Use KeyboardEvent.code instead of KeyboardEvent.key to avoid shifted symbols (!, @, etc.)
  const digitMatch = e.code.match(/^Digit([1-9])$/);
  if (digitMatch) {
    const digit = digitMatch[1];
    e.preventDefault();
    if (e.shiftKey) {
      if (activeWindowId) {
        compositorActions.moveWindow(activeWindowId, digit);
      }
    } else {
      compositorActions.switchWorkspace(digit);
    }
    return;
  }

  // Window Management
  switch (key) {
    case 'n': // New Window
      e.preventDefault();
      compositorActions.createWindow('terminal', `Terminal ${Math.floor(Math.random() * 100)}`);
      break;

    case 'w': // Close Window
      if (activeWindowId) {
        e.preventDefault();
        compositorActions.closeWindow(activeWindowId);
      }
      break;

    case 'f': // Toggle Floating (Smart: if any floating exists, focus/unfloat top one, or toggle active)
      e.preventDefault();
      if (activeWindowId) {
        compositorActions.floatWindow(activeWindowId);
      }
      break;

    case 'j': // Cycle Windows (Next)
      e.preventDefault();
      compositorActions.cycleWindow('next');
      break;

    case 'k': // Cycle Windows (Prev)
      e.preventDefault();
      compositorActions.cycleWindow('prev');
      break;

    case 'h': // Swap Left/Prev (Vim style)
    case 'l': // Swap Right/Next (Vim style)
      if (activeWindowId) {
        const ws = state.workspaces[state.activeWorkspaceId];
        const idx = ws.windowIds.indexOf(activeWindowId);
        if (idx !== -1) {
          const nextIdx =
            key === 'l'
              ? (idx + 1) % ws.windowIds.length
              : (idx - 1 + ws.windowIds.length) % ws.windowIds.length;
          const targetId = ws.windowIds[nextIdx];
          if (targetId && targetId !== activeWindowId) {
            compositorActions.swapWindows(activeWindowId, targetId);
          }
        }
      }
      break;
  }
}
