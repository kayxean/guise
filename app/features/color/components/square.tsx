import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef } from 'react';
import { useRelativePointer } from '../hooks';

export function SquarePicker({
  x,
  y,
  hue,
  onSelect,
}: {
  x: number;
  y: number;
  hue: number;
  onSelect: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (workerRef.current) return;

    const worker = new Worker(new URL('../worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    const canvas = canvasRef.current;
    if (canvas && 'transferControlToOffscreen' in canvas) {
      try {
        const offscreen = canvas.transferControlToOffscreen();

        worker.postMessage(
          {
            type: 'INIT',
            payload: { canvas: offscreen },
          },
          [offscreen],
        );

        isInitialized.current = true;
      } catch (e) {
        console.warn(e);
        isInitialized.current = true;
      }
    }
  }, []);

  useEffect(() => {
    if (workerRef.current && isInitialized.current) {
      workerRef.current.postMessage({
        type: 'RENDER',
        payload: { hue, width: 182, height: 100 },
      });
    }
  }, [hue]);

  const handleMove = useCallback(
    (nx: number, ny: number) => onSelect(nx, 1 - ny),
    [onSelect],
  );

  const trackDragHandler = useRelativePointer(
    containerRef,
    handleMove,
    'crosshair',
  );

  const pointerDragHandler = useRelativePointer(
    containerRef,
    handleMove,
    'move',
  );

  const left = `${x * 100}%`;
  const top = `${(1 - y) * 100}%`;

  return (
    <div ref={containerRef} {...stylex.props(styles.layout)}>
      <canvas
        ref={canvasRef}
        width={182}
        height={100}
        {...stylex.props(styles.canvas)}
      />
      <button
        onPointerDown={trackDragHandler}
        type="button"
        tabIndex={-1}
        {...stylex.props(styles.track)}
      />
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          pointerDragHandler(e);
        }}
        type="button"
        tabIndex={-1}
        {...stylex.props(styles.pointer(left, top))}
      />
    </div>
  );
}

const styles = stylex.create({
  layout: {
    aspectRatio: '1.82 / 1',
    backgroundColor: '#000',
    position: 'relative',
    touchAction: 'none',
    width: '100%',
  },
  canvas: {
    display: 'block',
    imageRendering: 'auto',
    touchAction: 'none',
    width: '100%',
  },
  track: {
    backgroundColor: '#0000',
    bottom: 0,
    cursor: 'crosshair',
    left: 0,
    outline: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  pointer: (x: string, y: string) => ({
    backgroundColor: '#0000',
    borderColor: '#fff',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: 'move',
    height: 16,
    left: x,
    outline: 'none',
    position: 'absolute',
    top: y,
    transform: 'translate(-50%, -50%)',
    width: 16,
    willChange: 'left, top',
    zIndex: 2,
  }),
});
