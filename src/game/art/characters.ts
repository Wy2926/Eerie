import type { Container } from 'pixi.js';
import { createPixelSprite } from './pixelSprite';

const JINYIWEI_PALETTE = {
  k: 0x1b1b22, // 玄黑
  r: 0xc0392b, // 飞鱼服朱红
  g: 0xd4a941, // 金饰边
  s: 0xe8c9a0, // 肤色
  w: 0xf5f0e6, // 高光
};

const JINYIWEI_ROWS = [
  '..kkkk..',
  '.kkkkkk.',
  '.kssssk.',
  '.ksksks.',
  '.kssssk.',
  'grrrrrrg',
  'rrgrrgrr',
  'rrrrrrrr',
  '.rrggrr.',
  '.kk..kk.',
];

export function createJinyiweiView(): Container {
  return createPixelSprite({ rows: JINYIWEI_ROWS, palette: JINYIWEI_PALETTE, scale: 3 });
}

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
