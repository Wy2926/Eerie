import { Graphics } from 'pixi.js';

/**
 * 刀气纵横成品：三层新月刀气——外圈淡青辉光、主体冷青刃、中心亮白刃芯，
 * 飞行方向由弧线开口朝向表达。
 */
export function createSwordWaveView(angle: number): Graphics {
  const g = new Graphics();
  const a0 = angle - 0.7;
  const a1 = angle + 0.7;
  g.arc(0, 0, 20, a0, a1).stroke({ color: 0x7fc4e8, width: 7, alpha: 0.25 });
  g.arc(0, 0, 18, a0 + 0.06, a1 - 0.06).stroke({ color: 0xbfe8ff, width: 4, alpha: 0.85 });
  g.arc(0, 0, 16, a0 + 0.16, a1 - 0.16).stroke({ color: 0xffffff, width: 2, alpha: 0.95 });
  return g;
}
