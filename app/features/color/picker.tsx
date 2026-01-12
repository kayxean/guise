import type { MouseEvent as ReactMouseEvent } from 'react';
import type { ColorMode, ColorSpace } from './core/types';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { xyz50ToXyz65, xyz65ToXyz50 } from './adapters/cat';
import { lrgbToXyz65, xyz65ToLrgb } from './adapters/d65';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { hsvToRgb, rgbToHsv } from './adapters/srgb';
import { FROM_HUB, NATIVE_HUB, TO_HUB } from './core/convert';

interface SquareProps {
  hsv: ColorSpace<'hsv'>;
  onSelect: (color: ColorSpace<'xyz65'>) => void;
}

interface PickerProps<T extends ColorMode> {
  color: ColorSpace<T>;
  mode: T;
  onUpdate: (color: ColorSpace<T>) => void;
}

export function SquarePicker({ hsv, onSelect }: SquareProps) {
  const [hue, saturation, value] = hsv;

  const containerRef = useRef<HTMLButtonElement>(null);

  const hueBaseHub = lrgbToXyz65(
    rgbToLrgb(hsvToRgb([hue, 1, 1] as ColorSpace<'hsv'>)),
  );

  const hueRgb = lrgbToRgb(xyz65ToLrgb(hueBaseHub));
  const cssBackground = `rgb(${hueRgb[0] * 255}, ${hueRgb[1] * 255}, ${hueRgb[2] * 255})`;

  const handleMove = (e: MouseEvent | ReactMouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const s = Math.max(0, Math.min(1, (e.clientX - left) / width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - top) / height));

    const hub: ColorSpace<'xyz65'> = lrgbToXyz65(
      rgbToLrgb(hsvToRgb([hue, s, v] as ColorSpace<'hsv'>)),
    );

    onSelect(hub);
  };

  const onMouseDown = (e: ReactMouseEvent<HTMLButtonElement>) => {
    handleMove(e);
    const moveHandler = (me: MouseEvent) => handleMove(me);
    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  };

  return (
    <div {...stylex.props(square.layout)}>
      <button
        aria-label="Select saturation and value"
        type="button"
        ref={containerRef}
        onMouseDown={onMouseDown}
        {...stylex.props(square.gradientArea(cssBackground))}
      />
      <span {...stylex.props(square.pointer(saturation, value))} />
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

  useEffect(() => {
    const hub = TO_HUB[mode](color);
    const nativeHub = NATIVE_HUB[mode];
    setHsv(getHsv(hub, nativeHub));
  }, [color, mode]);

  const handleSquareSelect = (input: ColorSpace<'xyz65'>) => {
    const targetHub = NATIVE_HUB[mode];

    const finalHub = targetHub === 'xyz50' ? xyz65ToXyz50(input) : input;

    const updatedColor = FROM_HUB[mode](finalHub) as ColorSpace<T>;

    onUpdate(updatedColor);

    const [_, s, v] = getHsv(input, 'xyz65');
    setHsv((prev) => [prev[0], s, v] as ColorSpace<'hsv'>);
  };

  return (
    <div>
      <SquarePicker hsv={hsv} onSelect={handleSquareSelect} />
    </div>
  );
}

const getHsv = (
  input: ColorSpace<'xyz50' | 'xyz65'>,
  nativeHub: 'xyz50' | 'xyz65',
): ColorSpace<'hsv'> => {
  const input65 =
    nativeHub === 'xyz50'
      ? xyz50ToXyz65(input as ColorSpace<'xyz50'>)
      : (input as ColorSpace<'xyz65'>);

  return rgbToHsv(lrgbToRgb(xyz65ToLrgb(input65)));
};

const square = stylex.create({
  layout: {
    height: 300,
    overflow: 'hidden',
    position: 'relative',
    userSelect: 'none',
    width: 300,
  },
  gradientArea: (color: string) => ({
    backgroundColor: color,
    backgroundImage:
      'linear-gradient(#0000,#000), linear-gradient(90deg,#fff,#0000)',
    cursor: 'crosshair',
    height: '100%',
    outline: 'none',
    width: '100%',
  }),
  pointer: (x: number, y: number) => ({
    borderColor: '#fff',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1.875,
    boxShadow: '0 0 4px rgba(0,0,0,0.4)',
    height: 16,
    left: `${x * 100}%`,
    pointerEvents: 'none',
    position: 'absolute',
    top: `${(1 - y) * 100}%`,
    transform: 'translate(-50%, -50%)',
    width: 16,
  }),
});
