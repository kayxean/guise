import type { ReactNode } from 'react';
import type { WindowState } from './types';
import * as stylex from '@stylexjs/stylex';
import { memo, useMemo, useState, useCallback } from 'react';
import {
  useWindowSelector,
  useActiveWindowId,
  useActions,
  useStoreKey,
  useWorkspaceGaps,
} from './hooks';
import { stateManager, commit } from './store';
import { syncWorkspaceLayout } from './layout';

interface WindowShellProps {
  windowId: string;
  children?: ReactNode;
}

interface CompositorProps {
  renderApp: (windowId: string, appId: string) => ReactNode;
}

const styles = stylex.create({
  shell: (x: number, y: number, w: number, h: number, z: number, isDragging: boolean) => ({
    position: 'absolute',
    transform: `translate(${x}px, ${y}px)`,
    width: w,
    height: h,
    zIndex: z,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    pointerEvents: 'auto',
    transition: isDragging
      ? 'none'
      : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
  }),
  inner: (isActive: boolean, gap: number) => ({
    flex: 1,
    margin: gap,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: isActive ? '#00ff88' : 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive
      ? '0 24px 60px -12px rgba(0, 255, 136, 0.25), 0 0 0 1px rgba(0, 255, 136, 0.1)'
      : '0 8px 32px -12px rgba(0, 0, 0, 0.6)',
  }),
  titleBar: (isActive: boolean) => ({
    height: 36,
    background: isActive
      ? 'linear-gradient(90deg, rgba(0, 255, 136, 0.12) 0%, transparent 100%)'
      : 'rgba(255, 255, 255, 0.01)',
    color: isActive ? '#00ff88' : '#666',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 16,
    userSelect: 'none',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: isActive ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.03)',
    cursor: 'move',
  }),
  titleIcon: (isActive: boolean) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: isActive ? '#00ff88' : '#333',
    marginRight: 12,
    boxShadow: isActive ? '0 0 10px #00ff88' : 'none',
    transition: 'all 0.3s ease',
  }),
  titleText: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: 'Inter, sans-serif',
  },
  floatBadge: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 255, 136, 0.12)',
    borderRadius: 5,
    color: '#00ff88',
    fontWeight: 700,
    marginLeft: 12,
  },
  clientArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  resizeHandle: (cursor: string) => ({
    position: 'absolute',
    zIndex: 100,
    cursor,
    pointerEvents: 'auto',
  }),
  surface: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
});

const RESIZE_HANDLES = [
  { direction: 'top', cursor: 'ns-resize', style: { top: -6, left: 12, right: 12, height: 12 } },
  {
    direction: 'bottom',
    cursor: 'ns-resize',
    style: { bottom: -6, left: 12, right: 12, height: 12 },
  },
  { direction: 'left', cursor: 'ew-resize', style: { left: -6, top: 12, bottom: 12, width: 12 } },
  { direction: 'right', cursor: 'ew-resize', style: { right: -6, top: 12, bottom: 12, width: 12 } },
  {
    direction: 'top-left',
    cursor: 'nwse-resize',
    style: { top: -6, left: -6, width: 16, height: 16 },
  },
  {
    direction: 'top-right',
    cursor: 'nesw-resize',
    style: { top: -6, right: -6, width: 16, height: 16 },
  },
  {
    direction: 'bottom-left',
    cursor: 'nesw-resize',
    style: { bottom: -6, left: -6, width: 16, height: 16 },
  },
  {
    direction: 'bottom-right',
    cursor: 'nwse-resize',
    style: { bottom: -6, right: -6, width: 16, height: 16 },
  },
] as const;

/**
 * Decorator component that provides the window frame, titlebar, and resize handles.
 */
const WindowShell = memo(({ windowId, children }: WindowShellProps) => {
  const { focusWindow, resizeSplit, swapWindows } = useActions();
  const activeWindowId = useActiveWindowId();
  const gaps = useWorkspaceGaps();
  const win = useWindowSelector(windowId, (s) => s);

  const [isDragging, setIsDragging] = useState(false);

  if (!win) return null;
  const isActive = activeWindowId === windowId;
  const halfGap = gaps / 2;

  /**
   * Initializes a window resize operation via drag handles.
   */
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startRect = { ...win.rect };
    const currentRatio = 0.5;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newRatio = currentRatio;
      if (direction === 'right') {
        newRatio = currentRatio * (1 + deltaX / startRect.width);
      } else if (direction === 'left') {
        newRatio = currentRatio * (1 - deltaX / startRect.width);
      } else if (direction === 'bottom') {
        newRatio = currentRatio * (1 + deltaY / startRect.height);
      } else if (direction === 'top') {
        newRatio = currentRatio * (1 - deltaY / startRect.height);
      }

      if (newRatio !== currentRatio) {
        resizeSplit(windowId, newRatio);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /**
   * Initializes an Alt+Drag move operation for swapping window positions.
   */
  const handleDragStart = (e: React.MouseEvent) => {
    if (!e.altKey) return;
    e.preventDefault();
    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
      const shell = target?.closest('[data-window-id]');
      const targetId = shell?.getAttribute('data-window-id');

      if (targetId && targetId !== windowId) {
        swapWindows(windowId, targetId);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      onMouseOver={() => focusWindow(windowId)}
      onMouseDown={() => focusWindow(windowId)}
      data-window-id={windowId}
      {...stylex.props(
        styles.shell(
          win.rect.x,
          win.rect.y,
          win.rect.width,
          win.rect.height,
          win.zIndex,
          isDragging,
        ),
      )}
    >
      <div {...stylex.props(styles.inner(isActive, halfGap))}>
        {/* Title Bar */}
        <div onMouseDown={handleDragStart} {...stylex.props(styles.titleBar(isActive))}>
          <div {...stylex.props(styles.titleIcon(isActive))} />
          <span {...stylex.props(styles.titleText)}>{win.title}</span>
          {win.isFloating && <div {...stylex.props(styles.floatBadge)}>FLOAT</div>}
        </div>

        {/* Client Area */}
        <div {...stylex.props(styles.clientArea)}>{children}</div>

        {/* Resize Handles */}
        {isActive &&
          RESIZE_HANDLES.map((h) => (
            <div
              key={h.direction}
              onMouseDown={(e) => handleResizeStart(e, h.direction)}
              {...stylex.props(styles.resizeHandle(h.cursor))}
              style={h.style}
            />
          ))}
      </div>
    </div>
  );
});

/**
 * The main compositor component that renders the surface and manages its dimensions.
 */
export const Compositor = memo(({ renderApp }: CompositorProps) => {
  const activeWsId = useStoreKey('activeWorkspaceId');
  const allWindows = useStoreKey('windows');

  /**
   * Syncs the internal boundary state with the actual DOM container size.
   */
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          const current = stateManager.snapshot().viewport;

          if (Math.abs(width - current.width) > 1 || Math.abs(height - current.height) > 1) {
            const nextBoundary = { x: 0, y: 0, width, height };
            const nextWorkspaces = { ...stateManager.snapshot().workspaces };
            let nextWindows = { ...stateManager.snapshot().windows };

            Object.values(nextWorkspaces).forEach((ws) => {
              nextWindows = syncWorkspaceLayout(ws, nextWindows, nextBoundary);
            });

            commit({
              viewport: { width, height },
              windows: nextWindows,
            });
          }
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, []);

  const visibleWindows = useMemo(() => {
    return Object.values(allWindows)
      .filter((w: WindowState) => w.workspaceId === activeWsId)
      .sort((a: WindowState, b: WindowState) => a.zIndex - b.zIndex);
  }, [allWindows, activeWsId]);

  return (
    <div ref={containerRef} {...stylex.props(styles.surface)}>
      {visibleWindows.map((win: WindowState) => (
        <WindowShell key={win.id} windowId={win.id}>
          {renderApp(win.id, win.appId)}
        </WindowShell>
      ))}
    </div>
  );
});
