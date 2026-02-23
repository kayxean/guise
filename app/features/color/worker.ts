/// <reference lib="webworker" />
import type { ColorArray } from './types';
import { lrgbToRgb, rgbToLrgb } from './adapters/gamma';
import { hsvToRgb } from './adapters/srgb';

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

const MEMORY = new Float32Array(15);
const hsvInput = MEMORY.subarray(0, 3) as unknown as ColorArray;
const hRgb = MEMORY.subarray(3, 6) as unknown as ColorArray;
const hLrgb = MEMORY.subarray(6, 9) as unknown as ColorArray;
const calcBuffer = MEMORY.subarray(9, 12) as unknown as ColorArray;
const outRgb = MEMORY.subarray(12, 15) as unknown as ColorArray;

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    canvas = payload.canvas;
    ctx =
      canvas?.getContext('2d', {
        alpha: false,
        desynchronized: true,
        willReadFrequently: false,
      }) ?? null;
    return;
  }

  if (type === 'RENDER' && ctx && canvas) {
    const { hue, width, height } = payload;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const imageData = ctx.createImageData(width, height);
    const buf32 = new Uint32Array(imageData.data.buffer);

    const hue360 = hue <= 1 ? hue * 360 : hue;

    hsvInput[0] = hue360;
    hsvInput[1] = 1;
    hsvInput[2] = 1;

    hsvToRgb(hsvInput, hRgb);
    rgbToLrgb(hRgb, hLrgb);

    const hRL = hLrgb[0],
      hGL = hLrgb[1],
      hBL = hLrgb[2];
    const wInv = 1 / (width - 1);
    const hInv = 1 / (height - 1);

    for (let row = 0; row < height; row++) {
      const v = 1 - row * hInv;
      const rowOffset = row * width;
      const vv = v * v;
      const vshRL = v * hRL,
        vshGL = v * hGL,
        vshBL = v * hBL;

      for (let col = 0; col < width; col++) {
        const s = col * wInv;
        const oneMinusS = 1 - s;

        calcBuffer[0] = vv * oneMinusS + s * vshRL;
        calcBuffer[1] = vv * oneMinusS + s * vshGL;
        calcBuffer[2] = vv * oneMinusS + s * vshBL;

        lrgbToRgb(calcBuffer, outRgb);

        buf32[rowOffset + col] =
          0xff000000 |
          (((outRgb[2] * 255 + 0.5) | 0) << 16) |
          (((outRgb[1] * 255 + 0.5) | 0) << 8) |
          ((outRgb[0] * 255 + 0.5) | 0);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
};
