import { Container, Graphics } from 'pixi.js';
import { createPixelSprite } from './pixelSprite';

/**
 * 倭寇成品素材：矮壮 Q 版，束发髻 + 破衣 + 短刀，低复杂度可批量渲染。
 * 精英变体：更大体型 + 红头巾 + 金色轮廓光环，一眼可辨。
 */
const PALETTE = {
  o: 0x17140f, // 描边
  k: 0x33291f, // 发髻
  s: 0xd9b48f, // 肤色
  e: 0x241d16, // 眼睛
  b: 0x6e5f4b, // 破衣褐
  d: 0x4a4038, // 衣服暗部/补丁
  m: 0xaeb6ba, // 短刀
  r: 0xa8322a, // 精英红头巾
};

const ROWS = [
  '....ok......',
  '..oookoo....',
  '.otttttto...',
  '.osssssso...',
  '.osesseso...',
  '.osssssso...',
  '..ossss.om..',
  '.obbbbbboom.',
  'obdbbbbdbom.',
  'obbbdbbbbo..',
  '.obbbbbbo...',
  '..obb.bbo...',
  '..oo...oo...',
];

function rowsFor(elite: boolean): string[] {
  // 头巾行：普通用发色，精英用红头巾
  return ROWS.map((row) => row.replace(/t/g, elite ? 'r' : 'k'));
}

export function createWokouView(scale = 3, elite = false): Container {
  const root = createPixelSprite({ rows: rowsFor(elite), palette: PALETTE, scale });
  if (elite) {
    const aura = new Graphics();
    aura.circle(0, 2 * scale, 8.5 * scale).stroke({ color: 0xd4a941, width: 2, alpha: 0.8 });
    aura.circle(0, 2 * scale, 9.5 * scale).stroke({ color: 0xd4a941, width: 1, alpha: 0.35 });
    root.addChildAt(aura, 0);
  }
  return root;
}
