/// <reference lib="webworker" />
import type { ColorSpace } from './core/types';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { hsvToRgb } from './adapters/srgb';

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    const incomingCanvas = payload.canvas as OffscreenCanvas;

    if (incomingCanvas) {
      canvas = incomingCanvas;
      ctx = incomingCanvas.getContext('2d', { alpha: false });
    }
    return;
  }

  if (type === 'RENDER' && ctx && canvas) {
    const { hue, width, height } = payload;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const [hR, hG, hB] = hsvToRgb([hue, 1, 1] as ColorSpace<'hsv'>);
    const [hRL, hGL, hBL] = rgbToLrgb([hR, hG, hB] as ColorSpace<'rgb'>);

    for (let row = 0; row < height; row++) {
      const v = 1 - row / (height - 1);
      const rowOffset = row * width * 4;
      for (let col = 0; col < width; col++) {
        const s = col / (width - 1);
        const rL = (v * (1 - s) + hRL * s) * v;
        const gL = (v * (1 - s) + hGL * s) * v;
        const bL = (v * (1 - s) + hBL * s) * v;

        const [r, g, b] = lrgbToRgb([rL, gL, bL] as ColorSpace<'lrgb'>);
        const i = rowOffset + col * 4;
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = b * 255;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
};
