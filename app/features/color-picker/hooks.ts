import { useCallback, useRef } from 'react';

export const useRelativePointer = (
  containerRef: React.RefObject<HTMLElement | null>,
  onMove: (x: number, y: number) => void,
  cursor?: React.CSSProperties['cursor'],
) => {
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  return useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el || e.button !== 0) return;

      const rect = el.getBoundingClientRect();
      const originalCursor = document.body.style.cursor;

      if (cursor) {
        document.body.style.cursor = cursor;
      }

      el.setPointerCapture(e.pointerId);

      const update = (clientX: number, clientY: number) => {
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        onMoveRef.current(x, y);
      };

      update(e.clientX, e.clientY);

      let rafId = 0;

      const onPointerMove = (pe: PointerEvent) => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => update(pe.clientX, pe.clientY));
      };

      const onPointerUp = (pe: PointerEvent) => {
        cancelAnimationFrame(rafId);
        document.body.style.cursor = originalCursor;

        el.releasePointerCapture(pe.pointerId);
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerup', onPointerUp);
        el.removeEventListener('pointercancel', onPointerUp);
      };

      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);
    },
    [containerRef, cursor],
  );
};
