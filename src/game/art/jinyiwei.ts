import { Container } from 'pixi.js';
import { createPixelSprite } from './pixelSprite';

/**
 * 锦衣卫成品素材：2 头身 Q 版，乌纱帽 + 飞鱼服（朱红金边）+ 腰佩绣春刀。
 * 高对比深色描边保证俯视角下与敌人/地面一眼区分。
 */
const PALETTE = {
  o: 0x14141a, // 描边/乌纱
  h: 0x2b2b36, // 帽体暗部
  s: 0xe8c9a0, // 肤色
  e: 0x1b1b22, // 眼睛
  r: 0xc0392b, // 飞鱼服朱红
  d: 0x8f2a20, // 服装暗部
  g: 0xd4a941, // 金边/腰带
  w: 0xf5f0e6, // 高光
  m: 0xb8c4cc, // 刀身
  b: 0x5a4632, // 刀柄
};

const ROWS = [
  '...oooooo...',
  '..ohhhhhho..',
  '.oohhhhhhoo.',
  '..ossssssoo.',
  '..osessseo..',
  '..osssssso..',
  '..oosssso...',
  '.ogrrrrrrgo.',
  'ordrrggrrdro',
  'orrrgggrrrro',
  '.orrggggrro.',
  '.odrrggrrdob',
  '..orrrrrro.m',
  '..orr..rro.m',
  '..oo....oo.m',
  '..o......o..',
];

export function createJinyiweiView(): Container {
  return createPixelSprite({ rows: ROWS, palette: PALETTE, scale: 3 });
}
