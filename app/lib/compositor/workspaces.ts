import type { Workspace } from './types';

export const createWorkspace = (id: string, name: string): Workspace => ({
  id,
  name,
  isActive: false,
  windows: [],
  root: null,
});

export const getActiveWorkspace = (workspaces: Record<string, Workspace>): Workspace | null => {
  return Object.values(workspaces).find((w) => w.isActive) ?? null;
};

export const getWorkspaceIds = (workspaces: Record<string, Workspace>): string[] => {
  return Object.keys(workspaces).sort();
};
