/// <reference lib="webworker" />
import type { ColorArray } from '@kayxean/chromatrix/types';
import { lrgbToRgb, rgbToLrgb } from '@kayxean/chromatrix/adapters/gamma';
import { hsvToRgb } from '@kayxean/chromatrix/adapters/srgb';

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let canvas: OffscreenCanvas | null = null;
let pendingFrame: { hue: number; width: number; height: number } | null = null;

let imageData: ImageData | null = null;
let buf32: Uint32Array | null = null;

const MEMORY = new Float32Array(15);
const hsvInput = MEMORY.subarray(0, 3) as unknown as ColorArray;
const hRgb = MEMORY.subarray(3, 6) as unknown as ColorArray;
const hLrgb = MEMORY.subarray(6, 9) as unknown as ColorArray;
const calcBuffer = MEMORY.subarray(9, 12) as unknown as ColorArray;
const outRgb = MEMORY.subarray(12, 15) as unknown as ColorArray;

function render() {
  if (!ctx || !canvas || !pendingFrame) return;

  const { hue, width, height } = pendingFrame;
  pendingFrame = null;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    imageData = null;
    buf32 = null;
  }

  if (!imageData || !buf32) {
    imageData = ctx.createImageData(width, height);
    buf32 = new Uint32Array(imageData.data.buffer);
  }

  const targetBuf = buf32;
  const targetImg = imageData;

  const hue360 = hue <= 1 ? hue * 360 : hue;
  hsvInput[0] = hue360;
  hsvInput[1] = 1;
  hsvInput[2] = 1;

  hsvToRgb(hsvInput, hRgb);
  rgbToLrgb(hRgb, hLrgb);

  const hRL = hLrgb[0];
  const hGL = hLrgb[1];
  const hBL = hLrgb[2];

  const wDiv = width > 1 ? width - 1 : 1;
  const hDiv = height > 1 ? height - 1 : 1;
  const wInv = 1 / wDiv;
  const hInv = 1 / hDiv;

  for (let row = 0; row < height; row++) {
    const v = 1 - row * hInv;
    const rowOffset = row * width;
    const vv = v * v;

    const vshRL = vv * hRL;
    const vshGL = vv * hGL;
    const vshBL = vv * hBL;

    for (let col = 0; col < width; col++) {
      const sRaw = col * wInv;
      const s = sRaw ** 0.32;

      const oneMinusS = 1 - s;

      calcBuffer[0] = vv * oneMinusS + s * vshRL;
      calcBuffer[1] = vv * oneMinusS + s * vshGL;
      calcBuffer[2] = vv * oneMinusS + s * vshBL;

      lrgbToRgb(calcBuffer, outRgb);

      targetBuf[rowOffset + col] =
        0xff000000 |
        (((outRgb[2] * 255 + 0.5) | 0) << 16) |
        (((outRgb[1] * 255 + 0.5) | 0) << 8) |
        ((outRgb[0] * 255 + 0.5) | 0);
    }
  }

  ctx.putImageData(targetImg, 0, 0);
}

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    canvas = payload.canvas;
    if (canvas) {
      ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
      });
      if (pendingFrame) {
        requestAnimationFrame(render);
      }
    }
  }

  if (type === 'RENDER') {
    const isFirst = pendingFrame === null;
    pendingFrame = payload;
    if (isFirst && ctx) {
      requestAnimationFrame(render);
    }
  }
};
