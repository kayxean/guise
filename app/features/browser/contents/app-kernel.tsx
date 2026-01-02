import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createStore } from '~/features/store';

const GRID_SIZE = 256;
const initialState = Object.fromEntries(Array.from({ length: GRID_SIZE }, (_, i) => [`cell_${i}`, 0]));

const [useStore, api] = createStore(initialState);

function Cell({ id }: { id: string }) {
  const value = useStore(useCallback((s) => s[id] as number, [id]));

  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div {...stylex.props(styles.cell, value > 0 && styles.activeCell)}>
      <div {...stylex.props(styles.renderLabel)}>{renderCount.current}</div>
      <span {...stylex.props(styles.cellValue)}>{value.toString(16).toUpperCase()}</span>
    </div>
  );
}

export function KernelApp() {
  const [isActive, setIsActive] = useState(false);
  const [fps, setFps] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsActive(entry.isIntersecting), { threshold: 0.1 });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const loop = () => {
      frameCount++;
      const now = performance.now();

      if (now - lastTime > 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      api.setState(() => {
        const next: Record<string, number> = {};
        for (let i = 0; i < 15; i++) {
          const randomId = `cell_${Math.floor(Math.random() * GRID_SIZE)}`;
          next[randomId] = Math.floor(Math.random() * 255);
        }
        return next;
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isActive]);

  return (
    <div role="application" tabIndex={-1} ref={containerRef} {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.brand)}>
          <span {...stylex.props(styles.title)}>KERNEL_DIAGNOSTIC_V1</span>
          <span {...stylex.props(styles.subtitle)}>REACTIVE_STATE_STRESS_TEST</span>
        </div>
        <div {...stylex.props(styles.metrics)}>
          <div {...stylex.props(styles.metricItem)}>
            STATUS:{' '}
            <span {...stylex.props(isActive ? styles.statusLive : styles.statusIdle)}>
              {isActive ? 'PRESSURE_ON' : 'SUSPENDED'}
            </span>
          </div>
          <div {...stylex.props(styles.metricItem)}>
            FREQ: <span {...stylex.props(fps < 30 ? styles.alert : styles.normal)}>{fps} FPS</span>
          </div>
        </div>
      </div>

      <div {...stylex.props(styles.grid)}>
        {Object.keys(initialState).map((id) => (
          <Cell key={id} id={id} />
        ))}
      </div>

      <div {...stylex.props(styles.log)}>
        {'>'} SEEDING_STATE_CHANNELS... OK <br />
        {'>'} ATTACHING_LISTENERS... [{GRID_SIZE}] <br />
        {'>'} SHALLOW_EQUAL_OPTIMIZATION... ENABLED
      </div>
    </div>
  );
}

const styles = stylex.create({
  layout: {
    color: '#00ff41',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Google Sans Code", ui-monospace, monospace',
    height: '100%',
    gap: '.875rem',
    maxHeight: 'calc(100dvh - 5.5rem)',
    outline: 'none',
    overflowY: 'auto',
    userSelect: 'none',
  },
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '.875rem .875rem 0 .875rem',
  },
  brand: { display: 'flex', flexDirection: 'column' },
  title: { fontSize: '1rem', fontWeight: 700, letterSpacing: '1px' },
  subtitle: { fontSize: '.625rem', color: '#666' },
  metrics: { textAlign: 'right', fontSize: '.625rem' },
  metricItem: { marginBottom: '.125rem' },
  statusLive: { color: '#ff4141', fontWeight: 700 },
  statusIdle: { color: '#3399ff' },
  normal: { color: '#00ff41' },
  alert: { color: '#ff4141', fontWeight: 700 },
  grid: {
    alignSelf: 'center',
    backgroundColor: '#111',
    display: 'grid',
    gap: '.125rem',
    gridTemplateColumns: {
      default: 'repeat(8, 1fr)',
      '@media (width >= 48em)': 'repeat(16, 1fr)',
      '@media (width >= 64em)': 'repeat(32, 1fr)',
    },
    padding: '0 .125rem',
    width: '100%',
  },
  cell: {
    alignItems: 'center',
    aspectRatio: '1/1',
    backgroundColor: '#0a0a0a',
    borderColor: '#1a1a1a',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  activeCell: {
    backgroundColor: '#002200',
    borderColor: '#00ff41',
  },
  renderLabel: {
    color: '#333',
    fontSize: 'clamp(.5rem, 1.5vw, .625rem)',
    left: '.125rem',
    position: 'absolute',
    top: '.125rem',
  },
  cellValue: {
    fontSize: 'clamp(.625rem, 3.5vw, 1.125rem)',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 700,
  },
  log: {
    color: '#444',
    fontSize: '.75rem',
    lineHeight: '1.4',
  },
});
