import { useEffect, useCallback, memo } from 'react';
import { workspaceCompositorActions } from '~/lib/workspace';
import {
  useActiveWindowIds,
  useActiveWindowId,
  useActiveWorkspaceId,
  useAllWorkspaces,
  useWindowByIdSelector,
} from '~/lib/workspace/hooks';
import { handleKeyEvent } from '~/lib/workspace/dispatcher';

function generateWindowColor(windowId: string): string {
  const hash = windowId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 25%)`;
}

interface WindowComponentProps {
  windowId: string;
}

const WindowComponent = memo(
  function WindowComponent({ windowId }: WindowComponentProps) {
    const windowState = useWindowByIdSelector(windowId);
    const activeWindowId = useActiveWindowId();
    const activeWorkspaceId = useActiveWorkspaceId();

    if (!windowState || windowState.workspaceId !== activeWorkspaceId) {
      return null;
    }

    const isActive = activeWindowId === windowId;
    const bgColor = generateWindowColor(windowId);
    const borderColor = isActive ? '#00ff88' : '#444';

    return (
      <div
        style={{
          position: 'absolute',
          left: windowState.position.x,
          top: windowState.position.y,
          width: windowState.size.width,
          height: windowState.size.height,
          zIndex: windowState.zIndex,
          border: `3px solid ${borderColor}`,
          backgroundColor: bgColor,
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={() => workspaceCompositorActions.focusWindow(windowId)}
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
          <span>{windowState.title}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
            {windowId.slice(0, 6)}
          </span>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.windowId === nextProps.windowId;
  },
);

function WorkspaceBar() {
  const workspaces = useAllWorkspaces();
  const activeWorkspaceId = useActiveWorkspaceId();

  const handleSwitch = (id: string) => {
    workspaceCompositorActions.switchWorkspace(id);
  };

  const visibleWorkspaceIds = Object.keys(workspaces).sort();

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

export function Compositor() {
  const windowIds = useActiveWindowIds();

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.altKey || event.shiftKey) {
      handleKeyEvent(event);
    }
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
          onClick={() =>
            workspaceCompositorActions.createWindow('demo-app', `Window ${Date.now()}`)
          }
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
