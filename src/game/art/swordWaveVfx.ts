import { Graphics } from 'pixi.js';
import type { VfxView } from './animatedView';
import { lerp, noise1, sin01 } from './anim';

/**
 * 刀气纵横：飞行的三层新月刀气——出膛急速展开（缩放插值）、
 * 飞行中辉光脉冲与噪声颤动、尾段渐隐，身后拖出渐灭的残影粒子。
 */
class SwordWaveVfxView implements VfxView {
  readonly root: Graphics;

  constructor(private angle: number) {
    this.root = new Graphics();
  }

  update(_dt: number, progress: number, time: number): void {
    const g = this.root;
    g.clear();

    // 出膛展开 + 尾段消散
    const grow = lerp(0.5, 1.15, Math.min(1, progress * 4));
    const fade = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
    const wobble = (noise1(time * 12) - 0.5) * 0.1;
    const a0 = this.angle - 0.7 + wobble;
    const a1 = this.angle + 0.7 + wobble;
    const pulse = sin01(time, 6);

    g.arc(0, 0, 20 * grow, a0, a1).stroke({ color: 0x7fc4e8, width: 7, alpha: (0.2 + pulse * 0.15) * fade });
    g.arc(0, 0, 18 * grow, a0 + 0.06, a1 - 0.06).stroke({ color: 0xbfe8ff, width: 4, alpha: 0.85 * fade });
    g.arc(0, 0, 16 * grow, a0 + 0.16, a1 - 0.16).stroke({ color: 0xffffff, width: 2, alpha: 0.95 * fade });

    // 残影粒子：沿反方向散布，随生命周期后移渐灭
    for (let i = 0; i < 4; i++) {
      const back = 10 + i * 9 + progress * 20;
      const jitter = (noise1(time * 20 + i * 11.7) - 0.5) * 10;
      const px = -Math.cos(this.angle) * back + Math.cos(this.angle + Math.PI / 2) * jitter;
      const py = -Math.sin(this.angle) * back + Math.sin(this.angle + Math.PI / 2) * jitter;
      g.circle(px, py, 2 - i * 0.35).fill({ color: 0xbfe8ff, alpha: 0.5 * fade * (1 - i / 4) });
    }
  }
}

export function createSwordWaveVfx(angle: number): VfxView {
  return new SwordWaveVfxView(angle);
}
