import type { Container } from 'pixi.js';
import { createPixelSprite } from './pixelSprite';

const WOKOU_PALETTE = {
  k: 0x2b2b26,
  b: 0x6e5f4b, // 破衣褐
  d: 0x4a4038,
  s: 0xd9b48f,
  m: 0x8a8a80, // 短刀
};

const WOKOU_ROWS = [
  '..kkkk..',
  '.kssssk.',
  '.ksksks.',
  '.kssssk.',
  'bbbbbbbm',
  'bdbbdbbm',
  'bbbbbbb.',
  '.bb..bb.',
];

export function createWokouView(scale = 3): Container {
  return createPixelSprite({ rows: WOKOU_ROWS, palette: WOKOU_PALETTE, scale });
}
