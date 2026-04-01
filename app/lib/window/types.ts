import type { ReactNode } from 'react';

export interface WindowProps {
  windowId: string;
  children?: ReactNode;
}

export type ResizeDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPosition: { x: number; y: number };
}

export interface ResizeState {
  isResizing: boolean;
  direction: ResizeDirection | null;
  startX: number;
  startY: number;
  startSize: { width: number; height: number };
  startPosition: { x: number; y: number };
}
