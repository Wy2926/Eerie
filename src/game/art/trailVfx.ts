import { Graphics } from 'pixi.js';
import type { VfxView } from './animatedView';
import { easeOutQuad, lerp, noise1 } from './anim';

interface Ember {
  angle: number;
  radiusFrac: number;
  size: number;
  phase: number;
  drift: number;
}

/**
 * 刀光拖尾伤害残留：扇形血焰余烬场——每颗余烬独立噪声闪烁、
 * 缓慢外漂并随生命周期渐熄。逐帧重绘、时间驱动。
 */
class TrailVfxView implements VfxView {
  readonly root: Graphics;
  private embers: Ember[] = [];

  constructor(
    private range: number,
    angle: number,
    arc: number,
  ) {
    this.root = new Graphics();
    const count = Math.max(8, Math.floor(arc * 10));
    for (let i = 0; i < count; i++) {
      this.embers.push({
        angle: angle - arc / 2 + arc * ((i + Math.random()) / count),
        radiusFrac: 0.35 + Math.random() * 0.6,
        size: 1.5 + Math.random() * 2,
        phase: Math.random() * 100,
        drift: 6 + Math.random() * 14,
      });
    }
  }

  update(_dt: number, progress: number, time: number): void {
    const g = this.root;
    g.clear();
    const globalFade = 1 - easeOutQuad(progress);

    for (const e of this.embers) {
      const flicker = noise1(time * 8 + e.phase);
      const r = this.range * e.radiusFrac + progress * e.drift;
      const x = Math.cos(e.angle) * r;
      const y = Math.sin(e.angle) * r - progress * 4; // 余烬微微上浮
      const alpha = globalFade * lerp(0.15, 0.7, flicker);
      g.circle(x, y, e.size * lerp(0.6, 1, flicker)).fill({ color: 0xd63030, alpha });
      g.circle(x, y, e.size * 0.45).fill({ color: 0xff8a5c, alpha: alpha * 0.8 });
    }
  }
}

export function createTrailVfx(range: number, angle: number, arc: number): VfxView {
  return new TrailVfxView(range, angle, arc);
}
