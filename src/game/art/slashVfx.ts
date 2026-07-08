import { Graphics } from 'pixi.js';

/** 绣春刀扇形刀光。 */
export function createSlashView(range: number, angle: number, arc: number): Graphics {
  const g = new Graphics();
  g.moveTo(0, 0)
    .arc(0, 0, range, angle - arc / 2, angle + arc / 2)
    .lineTo(0, 0)
    .fill({ color: 0xf5f0e6, alpha: 0.45 });
  return g;
}

/** 刀光拖尾伤害残留（暗红扇形）。 */
export function createTrailView(range: number, angle: number, arc: number): Graphics {
  const g = new Graphics();
  g.moveTo(0, 0)
    .arc(0, 0, range, angle - arc / 2, angle + arc / 2)
    .lineTo(0, 0)
    .fill({ color: 0xd63030, alpha: 0.18 });
  return g;
}
