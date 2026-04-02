import type { Workspace } from './types';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useCallback, memo } from 'react';
import { Compositor } from './render';
import { useWorkspaces, useStoreKey, useActions } from './hooks';
import { handleKeyEvent } from './dispatcher';

const styles = stylex.create({
  terminal: {
    padding: 24,
    color: '#ddd',
    fontSize: 13,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: 'rgba(2, 2, 2, 0.4)',
  },
  terminalHeader: {
    color: '#00ff88',
    marginBottom: 16,
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  terminalIcon: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#00ff88',
    borderRadius: 3,
  },
  terminalContent: {
    flex: 1,
    lineHeight: '1.6',
  },
  idTag: {
    marginBottom: 12,
    opacity: 0.6,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  idKey: {
    color: '#0088ff',
    fontWeight: 700,
  },
  bufferBox: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.04)',
    marginTop: 12,
  },
  bufferHeader: {
    color: '#444',
    fontSize: 10,
    marginBottom: 10,
    fontWeight: 800,
    letterSpacing: '0.1em',
  },
  bufferStream: {
    opacity: 0.7,
    fontSize: 12,
    fontFamily: '"JetBrains Mono", monospace',
  },
  streamLine: (color?: string) => ({
    color: color ?? 'inherit',
  }),
  terminalFooter: {
    marginTop: 'auto',
    fontSize: 10,
    color: '#333',
    fontWeight: 700,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'rgba(255,255,255,0.03)',
    paddingTop: 12,
    display: 'flex',
    justifyContent: 'space-between',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    backdropFilter: 'blur(12px)',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
    zIndex: 1000,
  },
  logo: {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: '0.1em',
    color: '#00ff88',
    marginRight: 12,
  },
  logoSub: {
    opacity: 0.5,
  },
  workspaceList: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  wsButton: (isActive: boolean) => ({
    backgroundColor: isActive ? '#00ff88' : 'rgba(255, 255, 255, 0.03)',
    color: isActive ? '#000' : '#888',
    border: 'none',
    minWidth: 24,
    height: 24,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: isActive ? 0 : 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  }),
  hintList: {
    display: 'flex',
    gap: 16,
    fontSize: 10,
    fontWeight: 600,
    color: '#444',
    letterSpacing: '0.05em',
  },
  hint: {
    color: '#666',
  },
  hintAction: {
    opacity: 0.5,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  clock: {
    fontSize: 11,
    color: '#00ff88',
    opacity: 0.8,
    fontWeight: 700,
  },
  demoRoot: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
    color: '#fff',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
  },
  contentMain: {
    flex: 1,
    position: 'relative',
  },
  bgAccent: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(circle at 50% -20%, rgba(0, 255, 136, 0.05) 0%, transparent 60%)',
    zIndex: 0,
  },
});

// --- Sub-components for better performance and stability ---

const TerminalApp = memo(({ windowId, appId }: { windowId: string; appId: string }) => {
  // Stable PID per instance
  const pid = useMemo(() => Math.floor(Math.random() * 90000) + 10000, []);

  return (
    <div {...stylex.props(styles.terminal)}>
      <div {...stylex.props(styles.terminalHeader)}>
        <div {...stylex.props(styles.terminalIcon)} />
        {appId.toUpperCase()}
      </div>

      <div {...stylex.props(styles.terminalContent)}>
        <div {...stylex.props(styles.idTag)}>
          <span {...stylex.props(styles.idKey)}>id:</span> {windowId}
        </div>

        <div {...stylex.props(styles.bufferBox)}>
          <div {...stylex.props(styles.bufferHeader)}>BUFFER_STREAM</div>
          <div {...stylex.props(styles.bufferStream)}>
            <div {...stylex.props(styles.streamLine('#00ff88'))}>
              &gt; Initializing XWayland server...
            </div>
            <div>&gt; Listening on fd 4</div>
            <div {...stylex.props(styles.streamLine('#0088ff'))}>
              &gt; Memory map: 0x7f9a2c000000
            </div>
            <div {...stylex.props(styles.streamLine('#ffcc00'))}>
              &gt; Warning: VSync skipped frame
            </div>
            <div>&gt; Rendering active...</div>
          </div>
        </div>
      </div>

      <div {...stylex.props(styles.terminalFooter)}>
        <span>PID: {pid}</span>
        <span>STATUS: STABLE</span>
      </div>
    </div>
  );
});

const StatusBar = memo(
  ({
    workspaces,
    activeWorkspaceId,
    switchWorkspace,
  }: {
    workspaces: Record<string, Workspace>;
    activeWorkspaceId: string;
    switchWorkspace: (id: string) => void;
  }) => (
    <header {...stylex.props(styles.statusBar)}>
      <div {...stylex.props(styles.logo)}>
        GUISE <span {...stylex.props(styles.logoSub)}>COMPOSITOR</span>
      </div>

      <div {...stylex.props(styles.workspaceList)}>
        {Object.keys(workspaces).map((id) => (
          <button
            key={id}
            onClick={() => switchWorkspace(id)}
            {...stylex.props(styles.wsButton(id === activeWorkspaceId))}
          >
            {id}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div {...stylex.props(styles.hintList)}>
        <span {...stylex.props(styles.hint)}>
          ALT+N <span {...stylex.props(styles.hintAction)}>NEW</span>
        </span>
        <span {...stylex.props(styles.hint)}>
          ALT+W <span {...stylex.props(styles.hintAction)}>CLOSE</span>
        </span>
        <span {...stylex.props(styles.hint)}>
          ALT+F <span {...stylex.props(styles.hintAction)}>FLOAT</span>
        </span>
        <span {...stylex.props(styles.hint)}>
          ALT+J/K <span {...stylex.props(styles.hintAction)}>MOVE</span>
        </span>
      </div>

      <div {...stylex.props(styles.divider)} />

      <div {...stylex.props(styles.clock)}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </header>
  ),
);

export function CompositorDemo() {
  const workspaces = useWorkspaces();
  const activeWorkspaceId = useStoreKey('activeWorkspaceId');
  const { switchWorkspace } = useActions();

  // Unified global keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyEvent);
    return () => window.removeEventListener('keydown', handleKeyEvent);
  }, []);

  // Stable render function to prevent remounts
  const renderApp = useCallback(
    (windowId: string, appId: string) => <TerminalApp windowId={windowId} appId={appId} />,
    [],
  );

  return (
    <div {...stylex.props(styles.demoRoot)}>
      <StatusBar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        switchWorkspace={switchWorkspace}
      />

      <main {...stylex.props(styles.contentMain)}>
        <Compositor renderApp={renderApp} />
      </main>

      {/* Background Accent */}
      <div {...stylex.props(styles.bgAccent)} />
    </div>
  );
}
