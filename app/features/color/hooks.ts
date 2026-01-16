import { useCallback, useRef } from 'react';

export const useRelativePointer = (
  containerRef: React.RefObject<HTMLElement | null>,
  onMove: (x: number, y: number) => void,
  cursor?: React.CSSProperties['cursor'],
) => {
  const onMoveRef = useRef<typeof onMove>(onMove);
  onMoveRef.current = onMove;

  return useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const originalCursor = el.style.cursor;
      const originalUserSelect = el.style.userSelect;

      if (cursor) {
        el.style.cursor = cursor;
      }
      el.style.userSelect = 'none';

      el.setPointerCapture(e.pointerId);

      const trigger = (pe: PointerEvent | React.PointerEvent) => {
        const rect = el.getBoundingClientRect();

        const x = Math.max(
          0,
          Math.min(1, (pe.clientX - rect.left) / rect.width),
        );
        const y = Math.max(
          0,
          Math.min(1, (pe.clientY - rect.top) / rect.height),
        );

        onMoveRef.current(x, y);
      };

      trigger(e);

      const move = (pe: PointerEvent) => {
        requestAnimationFrame(() => trigger(pe));
      };

      const up = (pe: PointerEvent) => {
        el.style.cursor = originalCursor;
        el.style.userSelect = originalUserSelect;

        el.releasePointerCapture(pe.pointerId);

        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [containerRef, cursor],
  );
};
