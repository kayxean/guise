import { useEffect, useCallback, useState } from 'react';
import { useCompositor, compositorActions } from '~/lib/compositor/stores';
import { handleKeyEvent, updateActiveWindowId } from '~/lib/compositor/dispatcher';
import { getVisibleWorkspaceIds } from '~/lib/compositor/workspaces';

function WindowComponent({ windowId }: { windowId: string }) {
  const state = useCompositor();
  const window = state.windows[windowId];

  if (!window || window.workspaceId !== state.activeWorkspaceId) {
    return null;
  }

  const isActive = state.activeWindowId === windowId;

  const colorHash = windowId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = colorHash % 360;
  const bgColor = `hsl(${hue}, 60%, 25%)`;
  const borderColor = isActive ? '#00ff88' : '#444';

  return (
    <div
      style={{
        position: 'absolute',
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        border: `3px solid ${borderColor}`,
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => compositorActions.focusWindow(windowId)}
    >
      <div
        style={{
          padding: '4px 8px',
          backgroundColor: isActive ? '#00ff88' : '#333',
          color: '#000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{window.title}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
          {windowId.slice(0, 6)}
        </span>
      </div>
    </div>
  );
}

function WorkspaceBar() {
  const state = useCompositor();
  const workspaceIds = getVisibleWorkspaceIds(state.workspaces);
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(null);

  const handleSwitch = (id: string) => {
    setOptimisticActiveId(id);
    compositorActions.switchWorkspace(id);
  };

  const activeWorkspaceId = optimisticActiveId ?? state.activeWorkspaceId;

  return (
    <>
      {workspaceIds.map((id) => {
        const workspace = state.workspaces[id];
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

export function Compositor() {
  const state = useCompositor();
  const activeWorkspace = state.workspaces[state.activeWorkspaceId];
  const windowIds = activeWorkspace?.windows ?? [];

  useEffect(() => {
    updateActiveWindowId(state.activeWindowId);
  }, [state.activeWindowId]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    handleKeyEvent(event);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

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
          onClick={() => compositorActions.createWindow('demo-app', `Window ${Date.now()}`)}
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
      <main
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {windowIds.map((id) => (
          <WindowComponent key={id} windowId={id} />
        ))}
      </main>
      <div style={{ position: 'absolute', bottom: 40, left: 8, color: '#666', fontSize: '12px' }}>
        Alt+1-9: Switch workspace | Alt+Shift+1-9: Move window | Alt+j/k: Cycle windows
        <br />
        Alt+n: New window | Alt+w: Close window | Hover to focus
      </div>
    </div>
  );
}
