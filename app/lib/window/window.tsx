import { memo } from 'react';
import {
  useWindowByIdSelector,
  useActiveWindowId,
  workspaceCompositorActions,
  workspaceStoreSubscribers,
} from '~/lib/workspace';

const RESIZE_HANDLES = [
  {
    direction: 'top',
    style: { top: 0, left: '10%', right: '10%', height: '4px', cursor: 'ns-resize' },
  },
  {
    direction: 'bottom',
    style: { bottom: 0, left: '10%', right: '10%', height: '4px', cursor: 'ns-resize' },
  },
  {
    direction: 'left',
    style: { left: 0, top: '10%', bottom: '10%', width: '4px', cursor: 'ew-resize' },
  },
  {
    direction: 'right',
    style: { right: 0, top: '10%', bottom: '10%', width: '4px', cursor: 'ew-resize' },
  },
  {
    direction: 'top-left',
    style: { top: 0, left: 0, width: '12px', height: '12px', cursor: 'nwse-resize' },
  },
  {
    direction: 'top-right',
    style: { top: 0, right: 0, width: '12px', height: '12px', cursor: 'nesw-resize' },
  },
  {
    direction: 'bottom-left',
    style: { bottom: 0, left: 0, width: '12px', height: '12px', cursor: 'nesw-resize' },
  },
  {
    direction: 'bottom-right',
    style: { bottom: 0, right: 0, width: '12px', height: '12px', cursor: 'nwse-resize' },
  },
];

function generateWindowColor(windowId: string): string {
  const hash = windowId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 25%)`;
}

export const Window = memo(
  function Window({ windowId, children }: { windowId: string; children?: React.ReactNode }) {
    const windowState = useWindowByIdSelector(windowId);
    const activeWindowId = useActiveWindowId();
    const isActive = activeWindowId === windowId;

    const onResizeStart = (direction: string) => (e: React.MouseEvent) => {
      if (!isActive) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const activeWindowId = workspaceCompositorActions.getActiveWindowId();
      if (!activeWindowId) return;

      const state = workspaceStoreSubscribers.getState();
      const window = state.windows[activeWindowId];
      if (!window) return;

      const startWidth = window.size.width;
      const minWidth = 150;
      const minHeight = 100;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const activeId = workspaceCompositorActions.getActiveWindowId();
        if (!activeId) return;

        let newWidth = startWidth;
        let newHeight = window.size.height;
        const deltaX = moveEvent.clientX - startX;

        if (direction === 'right') newWidth = startWidth + deltaX;
        else if (direction === 'left') newWidth = startWidth - deltaX;
        else if (direction === 'bottom-right') {
          newWidth = startWidth + deltaX;
          newHeight = window.size.height + deltaX;
        } else if (direction === 'bottom-left') {
          newWidth = startWidth - deltaX;
          newHeight = window.size.height + deltaX;
        } else if (direction === 'top-right') {
          newWidth = startWidth + deltaX;
          newHeight = window.size.height - deltaX;
        } else if (direction === 'top-left') {
          newWidth = startWidth - deltaX;
          newHeight = window.size.height - deltaX;
        } else if (direction === 'bottom') newHeight = window.size.height + deltaX;
        else if (direction === 'top') newHeight = window.size.height - deltaX;

        newWidth = Math.max(newWidth, minWidth);
        newHeight = Math.max(newHeight, minHeight);

        const ratio = newWidth / (newWidth + startWidth);
        const clampedRatio = Math.max(0.1, Math.min(0.9, ratio));
        workspaceCompositorActions.updateWindowSplit(activeId, clampedRatio);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onDragStart = (e: React.MouseEvent) => {
      if (!isActive) return;
      if (!e.altKey) return;
      e.preventDefault();

      const activeWindowId = workspaceCompositorActions.getActiveWindowId();
      if (!activeWindowId) return;

      const onMouseMove = () => {
        const currentId = workspaceCompositorActions.getActiveWindowId();
        if (!currentId) return;

        const state = workspaceStoreSubscribers.getState();
        const workspace = state.workspaces[state.activeWorkspaceId];
        if (!workspace || workspace.windows.length <= 1) return;

        const currentIndex = workspace.windows.indexOf(currentId);
        if (currentIndex > 0) {
          const prevWindowId = workspace.windows[currentIndex - 1];
          workspaceCompositorActions.swapWindows(currentId, prevWindowId);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    if (!windowState) return null;

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
            cursor: isActive ? 'move' : 'default',
          }}
          onMouseDown={onDragStart}
        >
          <span>{windowState.title}</span>
          {windowState.isFloating && <span style={{ fontSize: '10px' }}>FLOAT</span>}
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children ?? (
            <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
              {windowId.slice(0, 6)}
            </span>
          )}
        </div>
        {RESIZE_HANDLES.map((handle) => (
          <div
            key={handle.direction}
            style={{
              position: 'absolute',
              ...handle.style,
              pointerEvents: isActive ? 'auto' : 'none',
            }}
            onMouseDown={onResizeStart(handle.direction)}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.windowId === nextProps.windowId,
);
