import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef } from 'react';
import { useRelativePointer } from '../hooks';

export function AlphaPicker({
  color,
  alpha,
  onSelect,
}: {
  color: string;
  alpha: number;
  onSelect: (a: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pointerRef.current) {
      pointerRef.current.style.left = `${alpha * 100}%`;
    }
  }, [alpha]);

  const handleMove = useCallback(
    (nx: number) => {
      if (pointerRef.current) {
        pointerRef.current.style.left = `${nx * 100}%`;
      }
      onSelect(nx);
    },
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

  return (
    <div ref={containerRef} {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.patterns)} />

      <button
        onPointerDown={trackDragHandler}
        type="button"
        tabIndex={-1}
        {...stylex.props(styles.track(color))}
      />

      <button
        ref={pointerRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          pointerDragHandler(e);
        }}
        type="button"
        tabIndex={-1}
        style={{
          left: `${alpha * 100}%`,
        }}
        {...stylex.props(styles.pointerBase)}
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
  patterns: {
    backgroundColor: '#fff',
    backgroundImage:
      'conic-gradient(#eee 0.25turn, #ccc 0.25turn 0.5turn, #eee 0.5turn 0.75turn, #ccc 0.75turn)',
    backgroundPosition: '0 0',
    backgroundSize: '14px 14px',
    borderRadius: 8,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  track: (color: string) => ({
    backgroundColor: '#0000',
    backgroundImage: `linear-gradient(90deg, #0000, ${color})`,
    borderRadius: 8,
    cursor: 'crosshair',
    height: '100%',
    outline: 'none',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  }),
  pointerBase: {
    backgroundColor: '#0000',
    borderColor: '#fff',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: 'ew-resize',
    height: 16,
    outline: 'none',
    position: 'absolute',
    top: 7,
    transform: 'translate(-50%, -50%)',
    width: 16,
    willChange: 'left',
    zIndex: 2,
  },
});
