import { Graphics } from 'pixi.js';
import type { VfxView } from './animatedView';
import { easeOutCubic, lerp, noise1 } from './anim';

const RIBBON_SEGMENTS = 10;

/**
 * 绣春刀挥砍特效：刀刃从扇形一侧实时扫到另一侧（easeOutCubic），
 * 身后拖出逐渐消散的 Ribbon 轨迹，刀尖带火花粒子。全程逐帧重绘、时间驱动。
 */
class SlashVfxView implements VfxView {
  readonly root: Graphics;
  private history: number[] = [];

  constructor(
    private range: number,
    private angle: number,
    private arc: number,
  ) {
    this.root = new Graphics();
  }

  update(_dt: number, progress: number, time: number): void {
    const g = this.root;
    const a0 = this.angle - this.arc / 2;
    const sweep = easeOutCubic(progress);
    const bladeAngle = a0 + this.arc * sweep;
    this.history.push(bladeAngle);
    if (this.history.length > RIBBON_SEGMENTS) this.history.shift();

    g.clear();

    // Ribbon 轨迹：刀刃扫过的历史位置构成渐隐条带
    const inner = this.range * 0.3;
    for (let i = 0; i < this.history.length - 1; i++) {
      const ageFade = (i + 1) / this.history.length;
      const aA = this.history[i];
      const aB = this.history[i + 1];
      g.poly([
        Math.cos(aA) * inner, Math.sin(aA) * inner,
        Math.cos(aA) * this.range, Math.sin(aA) * this.range,
        Math.cos(aB) * this.range, Math.sin(aB) * this.range,
        Math.cos(aB) * inner, Math.sin(aB) * inner,
      ]).fill({ color: 0xdfe8ee, alpha: 0.28 * ageFade * (1 - progress * 0.5) });
    }

    // 当前刀刃：亮白主刃 + 冷钢衬线
    const fade = 1 - easeOutCubic(Math.max(0, progress - 0.7) / 0.3);
    g.moveTo(Math.cos(bladeAngle) * inner, Math.sin(bladeAngle) * inner)
      .lineTo(Math.cos(bladeAngle) * this.range, Math.sin(bladeAngle) * this.range)
      .stroke({ color: 0xffffff, width: 3, alpha: 0.95 * fade });
    const back = bladeAngle - this.arc * 0.06;
    g.moveTo(Math.cos(back) * inner * 1.2, Math.sin(back) * inner * 1.2)
      .lineTo(Math.cos(back) * this.range * 0.96, Math.sin(back) * this.range * 0.96)
      .stroke({ color: 0xbfd4de, width: 2, alpha: 0.5 * fade });

    // 刀尖火花：噪声抖动的短命亮点
    for (let i = 0; i < 3; i++) {
      const n = noise1(time * 30 + i * 17.3);
      const r = this.range * lerp(0.85, 1.05, n);
      const a = bladeAngle + (noise1(time * 25 + i * 7.7) - 0.5) * 0.25;
      g.circle(Math.cos(a) * r, Math.sin(a) * r, 1.5).fill({
        color: 0xfff2c8,
        alpha: 0.8 * fade * n,
      });
    }
  }
}

export function createSlashVfx(range: number, angle: number, arc: number): VfxView {
  return new SlashVfxView(range, angle, arc);
}
