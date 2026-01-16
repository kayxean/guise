import * as stylex from '@stylexjs/stylex';
import { useCallback, useRef } from 'react';
import { useRelativePointer } from '../hooks';

export function HuePicker({
  hue,
  onSelect,
}: {
  hue: number;
  onSelect: (h: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (nx: number) => onSelect(nx * 360),
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
    'ew-resize',
  );

  const left = `${(hue / 360) * 100}%`;

  return (
    <div ref={containerRef} {...stylex.props(styles.layout)}>
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
        {...stylex.props(styles.pointer(left))}
      />
    </div>
  );
}

const styles = stylex.create({
  layout: {
    alignItems: 'center',
    display: 'flex',
    height: 14,
    position: 'relative',
    touchAction: 'none',
    width: '100%',
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
    cursor: 'ew-resize',
    height: 16,
    left: x,
    outline: 'none',
    position: 'absolute',
    top: 7,
    transform: 'translate(-50%, -50%)',
    width: 16,
    willChange: 'left',
    zIndex: 2,
  }),
});
