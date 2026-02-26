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

      const rect = el.getBoundingClientRect();
      const originalCursor = document.body.style.cursor;

      if (cursor) {
        document.body.style.cursor = cursor;
      }

      el.setPointerCapture(e.pointerId);

      const trigger = (clientX: number, clientY: number) => {
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        onMoveRef.current(x, y);
      };

      trigger(e.clientX, e.clientY);

      let frameId: number;

      const move = (pe: PointerEvent) => {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => trigger(pe.clientX, pe.clientY));
      };

      const up = (pe: PointerEvent) => {
        document.body.style.cursor = originalCursor;
        cancelAnimationFrame(frameId);

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
