import type { ColorMode, ColorSpace } from './core/types';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import { xyz50ToXyz65, xyz65ToXyz50 } from './adapters/cat';
import { lrgbToXyz65, xyz65ToLrgb } from './adapters/d65';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { hsvToRgb, rgbToHsv } from './adapters/srgb';
import { FROM_HUB, NATIVE_HUB, TO_HUB } from './core/convert';

interface UIState {
  h: number;
  x: number;
  y: number;
}

const getUIState = <T extends ColorMode>(
  color: ColorSpace<T>,
  mode: T,
): UIState => {
  const hub = TO_HUB[mode](color);
  const xyz65 =
    NATIVE_HUB[mode] === 'xyz50'
      ? xyz50ToXyz65(hub as ColorSpace<'xyz50'>)
      : (hub as ColorSpace<'xyz65'>);

  const [h, s, v] = rgbToHsv(lrgbToRgb(xyz65ToLrgb(xyz65)));
  return { h, x: s, y: v };
};

const useRelativePointer = (
  containerRef: React.RefObject<HTMLElement | null>,
  onMove: (x: number, y: number) => void,
) => {
  const onMoveRef = useRef<typeof onMove>(onMove);
  onMoveRef.current = onMove;

  return useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const trigger = (pe: PointerEvent | React.PointerEvent) => {
        const { height, left, top, width } = el.getBoundingClientRect();
        const nx = Math.max(0, Math.min(1, (pe.clientX - left) / width));
        const ny = Math.max(0, Math.min(1, (pe.clientY - top) / height));
        onMoveRef.current(nx, ny);
      };

      trigger(e);

      const move = (pe: PointerEvent) => trigger(pe);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };

      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerup', up);
    },
    [containerRef],
  );
};

export function ColorPicker<T extends ColorMode>({
  color,
  mode,
  onUpdate,
}: {
  color: ColorSpace<T>;
  mode: T;
  onUpdate: (c: ColorSpace<T>) => void;
}) {
  const [ui, setUi] = useState<UIState>(() => getUIState(color, mode));

  const lastInteractionTime = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastInteractionTime.current > 100) {
      setUi(getUIState(color, mode));
    }
  }, [color, mode]);

  const coreUpdate = useCallback(
    (h: number, x: number, y: number) => {
      lastInteractionTime.current = Date.now();

      setUi({ h, x, y });

      const [r, g, b] = hsvToRgb([h, 1, 1] as ColorSpace<'hsv'>);
      const lrgbHue = rgbToLrgb([r, g, b] as ColorSpace<'rgb'>);
      const mixedLrgb = lrgbHue.map(
        (chan) => (y * (1 - x) + chan * x) * y,
      ) as ColorSpace<'lrgb'>;

      const hub65 = lrgbToXyz65(mixedLrgb);
      const targetHub = NATIVE_HUB[mode];
      const finalHub = targetHub === 'xyz50' ? xyz65ToXyz50(hub65) : hub65;

      onUpdate(FROM_HUB[mode](finalHub) as ColorSpace<T>);
    },
    [mode, onUpdate],
  );

  return (
    <div style={{ width: 300 }}>
      <SquarePicker ui={ui} onSelect={(x, y) => coreUpdate(ui.h, x, y)} />
      <HuePicker ui={ui} onSelect={(h) => coreUpdate(h, ui.x, ui.y)} />
    </div>
  );
}

export function SquarePicker({
  ui,
  onSelect,
}: {
  ui: UIState;
  onSelect: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('./canvas.worker.ts', import.meta.url),
        { type: 'module' },
      );

      const canvas = canvasRef.current;
      if (canvas && 'transferControlToOffscreen' in canvas) {
        try {
          const offscreen = canvas.transferControlToOffscreen();
          workerRef.current.postMessage(
            { type: 'INIT', payload: { canvas: offscreen } },
            [offscreen],
          );
        } catch (e) {
          console.warn(e);
        }
      }
    }

    workerRef.current.postMessage({
      type: 'RENDER',
      payload: { hue: ui.h, width: 100, height: 100 },
    });
  }, [ui.h]);

  const onPointerDown = useRelativePointer(
    containerRef,
    useCallback((nx, ny) => onSelect(nx, 1 - ny), [onSelect]),
  );

  return (
    <div ref={containerRef} {...stylex.props(squareStyles.layout)}>
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        {...stylex.props(squareStyles.canvas)}
      />
      <button
        onPointerDown={onPointerDown}
        type="button"
        {...stylex.props(squareStyles.overlay)}
      />
      <span
        {...stylex.props(
          squareStyles.pointer(`${ui.x * 100}%`, `${(1 - ui.y) * 100}%`),
        )}
      />
    </div>
  );
}

export function HuePicker({
  ui,
  onSelect,
}: {
  ui: UIState;
  onSelect: (h: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useRelativePointer(
    containerRef,
    useCallback((nx) => onSelect(nx * 360), [onSelect]),
  );

  const left = `${(ui.h / 360) * 100}%`;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      {...stylex.props(hueStyles.layout)}
    >
      <button tabIndex={-1} type="button" {...stylex.props(hueStyles.track)} />
      <button type="button" {...stylex.props(hueStyles.pointer(left))} />
    </div>
  );
}

const squareStyles = stylex.create({
  layout: {
    aspectRatio: '1.822 / 1',
    position: 'relative',
    touchAction: 'none',
    userSelect: 'none',
    width: '100%',
  },
  canvas: {
    display: 'block',
    height: '100%',
    imageRendering: 'auto',
    width: '100%',
  },
  overlay: {
    backgroundColor: '#0000',
    position: 'absolute',
    inset: 0,
    cursor: 'crosshair',
    outline: 'none',
  },
  pointer: (x: string, y: string) => ({
    borderColor: '#fff',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: '0 0 4px #0006',
    height: 14,
    left: x,
    pointerEvents: 'none',
    position: 'absolute',
    top: y,
    transform: 'translate(-50%, -50%)',
    width: 14,
    willChange: 'left, top',
  }),
});

const hueStyles = stylex.create({
  layout: {
    height: 16,
    marginTop: 12,
    position: 'relative',
    touchAction: 'none',
    width: 300,
  },
  track: {
    backgroundImage:
      'linear-gradient(90deg,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)',
    borderRadius: 8,
    cursor: 'crosshair',
    height: '100%',
    outline: 'none',
    width: '100%',
  },
  pointer: (x: string) => ({
    backgroundColor: '#0000',
    borderColor: '#fff',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: '0 0 4px #0006',
    cursor: 'ew-resize',
    height: 14,
    left: x,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 14,
    willChange: 'left',
  }),
});
