import type { Window } from './types';

export const createWindowData = (
  id: string,
  appId: string,
  title: string,
  workspaceId: string,
  position = { x: 0, y: 0 },
  size = { width: 800, height: 600 },
): Window => ({
  id,
  appId,
  title,
  workspaceId,
  isFocused: false,
  position,
  size,
  zIndex: 0,
});

export const getWindowsForWorkspace = (
  windows: Record<string, Window>,
  workspaceId: string,
): Window[] => {
  return Object.values(windows).filter((w) => w.workspaceId === workspaceId);
};

export const getFocusedWindow = (
  windows: Record<string, Window>,
  workspaceId: string,
): Window | null => {
  const workspaceWindows = getWindowsForWorkspace(windows, workspaceId);
  return workspaceWindows.find((w) => w.isFocused) ?? null;
};

export const getNextZIndex = (windows: Record<string, Window>): number => {
  const maxZ = Object.values(windows).reduce((max, w) => Math.max(max, w.zIndex), 0);
  return maxZ + 1;
};
