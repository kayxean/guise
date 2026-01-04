import * as stylex from '@stylexjs/stylex';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { createStore } from '~/features/store';
import { terminal } from '../tokens.stylex';

interface MemoryPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

type DiagnosticLogs = {
  core_map: string;
  jank_events: number;
  selector_hit: number;
  peak_latency: number;
  heap: number;
  heap_delta: number;
};

const [useStore, api] = createStore<Record<string, number>>({});

const Cell = memo(
  ({ id }: { id: string }) => {
    const value = useStore((s) => (s[id] as number) || 0);

    return (
      <div {...stylex.props(styles.cell, value > 0 ? styles.activeCell : styles.inactiveCell)} id={`cell-${id}`}>
        <span {...stylex.props(styles.cellValue)}>{value.toString(16).toUpperCase()}</span>
      </div>
    );
  },
  (prev, next) => prev.id === next.id,
);

export function KernelApp() {
  const [gridSize, setGridSize] = useState<number>(256);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [batchEnabled, setBatchEnabled] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(0);

  const [diagnostics, setDiagnostics] = useState<DiagnosticLogs>({
    core_map: '0x0 NODES',
    jank_events: 0,
    selector_hit: 0,
    peak_latency: 0,
    heap: 0,
    heap_delta: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const peakLatency = useRef<number>(0);
  const jankCount = useRef<number>(0);
  const initialHeap = useRef<number>(0);
  const updateBuffer = useRef<Record<string, number>>({});

  const columns = useMemo(() => {
    if (gridSize === 128) return 8;
    if (gridSize === 512) return 16;
    return Math.sqrt(gridSize) | 0;
  }, [gridSize]);

  useEffect(() => {
    const initialState: Record<string, number> = {};
    for (let i = 0; i < gridSize; i++) initialState[`cell_${i}`] = 0;
    api.setState(initialState);

    jankCount.current = 0;
    peakLatency.current = 0;
    updateBuffer.current = {};

    const perf = performance as MemoryPerformance;
    initialHeap.current = perf.memory ? perf.memory.usedJSHeapSize : 0;

    setDiagnostics({
      core_map: `${columns}x${(gridSize / columns) | 0} NODES`,
      jank_events: 0,
      selector_hit: 100,
      peak_latency: 0,
      heap: initialHeap.current,
      heap_delta: 0,
    });
  }, [gridSize, columns]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsActive(entry.isIntersecting), { threshold: 0.0 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive || isFrozen) return;

    let frameCount = 0;
    let totalUpdatesInSecond = 0;
    let lastTime = performance.now();
    let lastFrameTime = performance.now();
    let rafId: number;

    const loop = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;

      if (delta > 16.67) jankCount.current++;
      lastFrameTime = now;
      frameCount++;

      const updateCount = Math.max(5, (gridSize * 0.05) | 0);
      totalUpdatesInSecond += updateCount;

      const t0 = performance.now();

      for (let i = 0; i < updateCount; i++) {
        const id = `cell_${(Math.random() * gridSize) | 0}`;
        updateBuffer.current[id] = (Math.random() * 255) | 0;
      }

      if (batchEnabled) {
        if (frameCount % 4 === 0) {
          api.setState({ ...updateBuffer.current });
          updateBuffer.current = {};
        }
      } else {
        api.setState({ ...updateBuffer.current });
        updateBuffer.current = {};
      }

      const latency = performance.now() - t0;
      if (latency > peakLatency.current) peakLatency.current = latency;

      if (now - lastTime > 1000) {
        const totalPossibleChecks = gridSize * frameCount;

        const hitRate = totalPossibleChecks > 0 ? (1 - totalUpdatesInSecond / totalPossibleChecks) * 100 : 100;

        const perf = performance as MemoryPerformance;
        const currentHeap = perf.memory?.usedJSHeapSize || 0;

        setFps(frameCount);
        setDiagnostics((prev) => ({
          ...prev,
          jank_events: jankCount.current,
          selector_hit: hitRate,
          peak_latency: peakLatency.current,
          heap: currentHeap,
          heap_delta: currentHeap - initialHeap.current,
        }));

        totalUpdatesInSecond = 0;
        frameCount = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, isFrozen, gridSize, batchEnabled]);

  const cellElements = useMemo(() => {
    const elements = [];
    for (let i = 0; i < gridSize; i++) {
      const id = `cell_${i}`;
      elements.push(<Cell key={id} id={id} />);
    }
    return elements;
  }, [gridSize]);

  return (
    <div role="application" ref={containerRef} {...stylex.props(styles.layout)}>
      <div>
        <div>
          <h2>KERNEL_DIAGNOSTIC_V2</h2>
          <div {...stylex.props(styles.buttonGroup)}>
            <p>CAPACITY:</p>
            {[64, 128, 256, 512, 1024].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setGridSize(size)}
                style={{ fontWeight: gridSize === size ? 700 : 400 }}
              >
                {size}
              </button>
            ))}
          </div>
          <div {...stylex.props(styles.buttonGroup)}>
            <button
              type="button"
              onClick={() => setBatchEnabled(!batchEnabled)}
              style={{ color: batchEnabled ? terminal.green : terminal.yellow, cursor: 'pointer' }}
            >
              {`BATCH: ${batchEnabled ? 'ON' : 'OFF'}`}
            </button>
            <button
              type="button"
              onClick={() => setIsFrozen(!isFrozen)}
              style={{ color: isFrozen ? terminal.blue : terminal.white, cursor: 'pointer' }}
            >
              {isFrozen ? 'RESUME' : 'FREEZE'}
            </button>
          </div>
        </div>

        <div>
          <p>
            STATUS:{' '}
            <span style={{ color: isFrozen ? terminal.yellow : terminal.green }}>{isFrozen ? 'PAUSED' : 'STRESS_TEST'}</span>
          </p>
          <p>
            REFRESH: <span>{isFrozen ? 0 : fps}Hz</span>
          </p>
        </div>

        <div>
          <p>{`CORE_MAP: ${diagnostics.core_map}`}</p>
          <p style={{ color: diagnostics.jank_events > 0 ? terminal.red : terminal.green }}>
            {`JANK_EVENTS: ${diagnostics.jank_events}`}
          </p>
          <p>{`SELECTOR_HIT: ${diagnostics.selector_hit.toFixed(2)}%`}</p>
          <p>{`PEAK_LATENCY: ${diagnostics.peak_latency.toFixed(2)}ms`}</p>
          <p>{`HEAP_USAGE: ${Math.round(diagnostics.heap / 1024 / 1024)}MB`}</p>
          <p style={{ color: diagnostics.heap_delta / 1024 / 1024 > 10 ? terminal.red : terminal.gray }}>
            {`HEAP_DELTA: ${diagnostics.heap_delta >= 0 ? '+' : ''}${Math.round(diagnostics.heap_delta / 1024 / 1024)}MB`}
          </p>
        </div>
      </div>

      <div {...stylex.props(styles.preview)}>
        <div {...stylex.props(styles.grid, styles.dynamicGrid(columns))}>{cellElements}</div>
      </div>
    </div>
  );
}

const styles = stylex.create({
  layout: {
    backgroundColor: terminal.background,
    display: {
      default: 'flex',
      '@media (width >= 80em)': 'grid',
    },
    flexDirection: 'column',
    gridTemplateColumns: {
      default: null,
      '@media (width >= 80em)': '24rem 1fr',
    },
    height: '100dvh',
    gap: '1rem',
    overflow: 'hidden',
  },
  buttonGroup: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  preview: {
    height: '100%',
    overflow: 'auto',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gap: '1px',
    width: '100%',
  },
  dynamicGrid: (columnCount: number) => ({
    gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
  }),
  cell: {
    alignItems: 'center',
    aspectRatio: '1/1',
    display: 'flex',
    justifyContent: 'center',
    padding: '.25rem',
  },
  activeCell: {
    backgroundColor: terminal.green,
  },
  inactiveCell: {
    backgroundColor: terminal.red,
  },
  cellValue: {
    color: terminal.black,
    fontFamily: '"Google Sans Code", monospace',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1,
    userSelect: 'none',
  },
});
