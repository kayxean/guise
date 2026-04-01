import { useEffect, useMemo } from 'react';
import {
  workspaceStoreActions,
  useActiveWindowIds,
  useActiveWorkspaceId,
  useAllWorkspaces,
  useWorkspaceStoreKey,
} from '~/lib/workspace';
import { Window } from '~/lib/window';
import { handleKeyEvent } from '~/lib/workspace/dispatcher';

function WorkspaceBar() {
  const workspaces = useAllWorkspaces();
  const activeWorkspaceId = useActiveWorkspaceId();

  const handleSwitch = (id: string) => {
    workspaceStoreActions.switchWorkspace(id);
  };

  const visibleWorkspaceIds = useMemo(() => Object.keys(workspaces).sort(), [workspaces]);

  return (
    <>
      {visibleWorkspaceIds.map((id) => {
        const workspace = workspaces[id];
        const windowCount = workspace.windows.length;
        const isActive = activeWorkspaceId === id;

        return (
          <button
            key={id}
            onClick={() => handleSwitch(id)}
            style={{
              padding: '4px 12px',
              backgroundColor: isActive ? '#007acc' : '#333',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {id} ({windowCount})
          </button>
        );
      })}
    </>
  );
}

function WindowsRenderer() {
  const tiledWindowIds = useActiveWindowIds();
  const activeWorkspaceId = useActiveWorkspaceId();
  const allWindows = useWorkspaceStoreKey('windows');

  const floatingWindowIds = useMemo(() => {
    const ids: string[] = [];
    for (const [id, win] of Object.entries(allWindows)) {
      if (win.workspaceId === activeWorkspaceId && win.isFloating) {
        ids.push(id);
      }
    }
    return ids;
  }, [allWindows, activeWorkspaceId]);

  const sortedWindowIds = useMemo(() => {
    const list = [
      ...tiledWindowIds.map((id) => ({ id, window: allWindows[id] })),
      ...floatingWindowIds.map((id) => ({ id, window: allWindows[id] })),
    ].filter((w) => w.window) as { id: string; window: (typeof allWindows)[string] }[];

    list.sort((a, b) => a.window.zIndex - b.window.zIndex);
    return list.map((w) => w.id);
  }, [tiledWindowIds, floatingWindowIds, allWindows]);

  return (
    <main
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {sortedWindowIds.map((id: string) => {
        const win = allWindows[id];
        if (!win) return null;

        return <Window key={id} windowId={id} />;
      })}
    </main>
  );
}

export function Windows() {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.shiftKey) {
      handleKeyEvent(event);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#121212',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#222',
          borderBottom: '1px solid #333',
        }}
      >
        <WorkspaceBar />
        <div style={{ flex: 1 }} />
        <button
          onClick={() => workspaceStoreActions.createWindow('demo-app', `Window ${Date.now()}`)}
          style={{
            padding: '6px 16px',
            backgroundColor: '#007acc',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          New Window
        </button>
      </nav>
      <WindowsRenderer />
      <div style={{ position: 'absolute', bottom: 40, left: 8, color: '#666', fontSize: '12px' }}>
        Alt+1-9: Switch workspace | Alt+Shift+1-9: Move window | Alt+j/k: Cycle windows
        <br />
        Alt+n: New window | Alt+w: Close window | Alt+F: Toggle floating | Alt+drag: Swap window
      </div>
    </div>
  );
}
