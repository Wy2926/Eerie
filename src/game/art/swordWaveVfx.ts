import { Graphics } from 'pixi.js';

/** 刀气纵横：飞行的弧形刀气。 */
export function createSwordWaveView(angle: number): Graphics {
  const g = new Graphics();
  g.arc(0, 0, 16, angle - 0.6, angle + 0.6).stroke({ color: 0xbfe8ff, width: 4, alpha: 0.9 });
  return g;
}
