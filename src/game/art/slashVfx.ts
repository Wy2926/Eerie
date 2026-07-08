import { Graphics } from 'pixi.js';

/**
 * 绣春刀扇形刀光成品：三层结构——外缘亮白刀锋线、主体冷钢色渐层、内侧朱红衬光，
 * 保证在密集怪群上仍能一眼读出攻击范围与方向。
 */
export function createSlashView(range: number, angle: number, arc: number): Graphics {
  const g = new Graphics();
  const a0 = angle - arc / 2;
  const a1 = angle + arc / 2;
  // 内侧朱红衬光
  g.moveTo(0, 0)
    .arc(0, 0, range * 0.55, a0, a1)
    .lineTo(0, 0)
    .fill({ color: 0xc0392b, alpha: 0.22 });
  // 主体冷钢色
  g.moveTo(0, 0)
    .arc(0, 0, range, a0, a1)
    .lineTo(0, 0)
    .fill({ color: 0xdfe8ee, alpha: 0.3 });
  // 外缘刀锋亮线
  g.arc(0, 0, range - 1, a0, a1).stroke({ color: 0xffffff, width: 3, alpha: 0.9 });
  // 中线斩击轨迹
  g.arc(0, 0, range * 0.8, a0 + arc * 0.08, a1 - arc * 0.08).stroke({
    color: 0xf5f0e6,
    width: 2,
    alpha: 0.6,
  });
  return g;
}

/**
 * 刀光拖尾伤害残留成品：暗红残焰扇形 + 血色边界虚线感（危险区域明确可读）。
 */
export function createTrailView(range: number, angle: number, arc: number): Graphics {
  const g = new Graphics();
  const a0 = angle - arc / 2;
  const a1 = angle + arc / 2;
  g.moveTo(0, 0)
    .arc(0, 0, range, a0, a1)
    .lineTo(0, 0)
    .fill({ color: 0x8f1d1d, alpha: 0.22 });
  g.arc(0, 0, range - 1, a0, a1).stroke({ color: 0xd63030, width: 2, alpha: 0.55 });
  g.moveTo(0, 0)
    .arc(0, 0, range * 0.5, a0, a1)
    .lineTo(0, 0)
    .fill({ color: 0xd63030, alpha: 0.12 });
  return g;
}
