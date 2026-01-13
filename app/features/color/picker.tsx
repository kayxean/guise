import type { PointerEvent as ReactPointerEvent } from 'react';
import type { ColorMode, ColorSpace } from './core/types';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { xyz50ToXyz65, xyz65ToXyz50 } from './adapters/cat';
import { lrgbToXyz65, xyz65ToLrgb } from './adapters/d65';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { hsvToRgb, rgbToHsv } from './adapters/srgb';
import { FROM_HUB, NATIVE_HUB, TO_HUB } from './core/convert';

interface SquareProps {
  hsv: ColorSpace<'hsv'>;
  onSelect: (s: number, v: number) => void;
}

interface HueProps {
  hsv: ColorSpace<'hsv'>;
  onSelect: (h: number) => void;
}

interface PickerProps<T extends ColorMode> {
  color: ColorSpace<T>;
  mode: T;
  onUpdate: (color: ColorSpace<T>) => void;
}

const useRelativePointer = (onMove: (x: number, y: number) => void) => {
  return useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      const trigger = (pe: PointerEvent | ReactPointerEvent) => {
        const { left, top, width, height } = el.getBoundingClientRect();
        onMove(
          Math.max(0, Math.min(1, (pe.clientX - left) / width)),
          Math.max(0, Math.min(1, (pe.clientY - top) / height)),
        );
      };

      trigger(e);
      const move = (pe: PointerEvent) => trigger(pe);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [onMove],
  );
};

export function SquarePicker({ hsv, onSelect }: SquareProps) {
  const [h, s, v] = hsv;

  const bg = useMemo(() => {
    const [r, g, b] = hsvToRgb([h, 1, 1] as ColorSpace<'hsv'>);
    return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
  }, [h]);

  const handleMove = useCallback(
    (x: number, y: number) => {
      onSelect(x, 1 - y);
    },
    [onSelect],
  );

  const onPointerDown = useRelativePointer(handleMove);

  return (
    <div {...stylex.props(squareStyles.layout)}>
      <button
        onPointerDown={onPointerDown}
        type="button"
        {...stylex.props(squareStyles.area(bg))}
      />
      <span {...stylex.props(squareStyles.pointer(s, v))} />
    </div>
  );
}

export function HuePicker({ hsv, onSelect }: HueProps) {
  const [h] = hsv;

  const handleMove = useCallback(
    (x: number) => {
      onSelect(x * 360);
    },
    [onSelect],
  );

  const onPointerDown = useRelativePointer(handleMove);

  return (
    <div {...stylex.props(hueStyles.layout)}>
      <button
        onPointerDown={onPointerDown}
        type="button"
        {...stylex.props(hueStyles.track)}
      />
      <span {...stylex.props(hueStyles.pointer(h))} />
    </div>
  );
}

export function ColorPicker<T extends ColorMode>({
  color,
  mode,
  onUpdate,
}: PickerProps<T>) {
  const [hsv, setHsv] = useState<ColorSpace<'hsv'>>([
    0, 0, 0,
  ] as ColorSpace<'hsv'>);
  const lastValidHue = useRef(0);
  const isInteracting = useRef(false);
  const interactionTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (isInteracting.current) return;

    const hub = TO_HUB[mode](color);
    const [h, s, v] = getHsvFromHub(hub, NATIVE_HUB[mode]);

    setHsv((prev) => {
      const [prevH, prevS, prevV] = prev;
      const hueDist = Math.abs(((h - prevH + 540) % 360) - 180);

      if (
        hueDist < 0.1 &&
        Math.abs(s - prevS) < 0.001 &&
        Math.abs(v - prevV) < 0.001
      ) {
        return prev;
      }

      const isExtreme = s < 0.01 || v < 0.01;
      if (!isExtreme) lastValidHue.current = h;

      return [isExtreme ? lastValidHue.current : h, s, v] as ColorSpace<'hsv'>;
    });
  }, [color, mode]);

  const coreUpdate = useCallback(
    (h: number, s: number, v: number) => {
      isInteracting.current = true;
      lastValidHue.current = h;

      if (interactionTimeout.current)
        window.clearTimeout(interactionTimeout.current);
      interactionTimeout.current = window.setTimeout(() => {
        isInteracting.current = false;
      }, 100);

      const [r, g, b] = hsvToRgb([h, 1, 1] as ColorSpace<'hsv'>);
      const lrgbHue = rgbToLrgb([r, g, b] as ColorSpace<'rgb'>);
      const lrgbNeutral = [v, v, v] as ColorSpace<'lrgb'>;

      const finalLrgb = lrgbNeutral.map(
        (chan, i) => (chan * (1 - s) + lrgbHue[i] * s) * v,
      ) as ColorSpace<'lrgb'>;

      const hub65 = lrgbToXyz65(finalLrgb);
      const target = NATIVE_HUB[mode];
      const finalHub = target === 'xyz50' ? xyz65ToXyz50(hub65) : hub65;

      onUpdate(FROM_HUB[mode](finalHub) as ColorSpace<T>);
      setHsv([h, s, v] as ColorSpace<'hsv'>);
    },
    [mode, onUpdate],
  );

  const onSelectSquare = useCallback(
    (s: number, v: number) => {
      coreUpdate(hsv[0], s, v);
    },
    [hsv, coreUpdate],
  );

  const onSelectHue = useCallback(
    (h: number) => {
      coreUpdate(h, hsv[1], hsv[2]);
    },
    [hsv, coreUpdate],
  );

  return (
    <div>
      <SquarePicker hsv={hsv} onSelect={onSelectSquare} />
      <HuePicker hsv={hsv} onSelect={onSelectHue} />
    </div>
  );
}

function getHsvFromHub(
  input: ColorSpace<'xyz50' | 'xyz65'>,
  native: 'xyz50' | 'xyz65',
): ColorSpace<'hsv'> {
  const i65 =
    native === 'xyz50'
      ? xyz50ToXyz65(input as ColorSpace<'xyz50'>)
      : (input as ColorSpace<'xyz65'>);

  return rgbToHsv(lrgbToRgb(xyz65ToLrgb(i65)));
}

const squareStyles = stylex.create({
  layout: {
    aspectRatio: '18 / 9',
    position: 'relative',
    touchAction: 'none',
    userSelect: 'none',
    width: '100%',
  },
  area: (color: string) => ({
    backgroundColor: color,
    backgroundImage:
      'linear-gradient(#0000,#000), linear-gradient(90deg,#fff,#0000)',
    cursor: 'crosshair',
    height: '100%',
    outline: 'none',
    width: '100%',
  }),
  pointer: (s: number, v: number) => ({
    borderColor: '#fff',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1.875,
    boxShadow: '0 0 4px #0006',
    height: 16,
    left: `${s * 100}%`,
    pointerEvents: 'none',
    position: 'absolute',
    top: `${(1 - v) * 100}%`,
    transform: 'translate(-50%, -50%)',
    width: 16,
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
  pointer: (h: number) => ({
    backgroundColor: '#fff',
    borderColor: '#000',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1.875,
    boxShadow: '0 0 3px #0005',
    height: 18,
    left: `${(h / 360) * 100}%`,
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'none',
    width: 18,
  }),
});
