import { Graphics } from 'pixi.js';
import type { VfxView } from './animatedView';
import { easeOutBack, sin01 } from './anim';

/**
 * XP 掉落玉髓：出生回弹弹出（easeOutBack）、悬浮上下漂浮（正弦）、
 * 高光切面流动闪烁、周期性十字星光。普通翠玉绿，高额琉璃蓝更大。
 * 掉落物常驻，progress 不用于消亡，仅时间驱动循环。
 */
class XpGemView implements VfxView {
  readonly root: Graphics;
  private born = 0;
  private phase = Math.random() * 100;

  constructor(private amount: number) {
    this.root = new Graphics();
  }

  update(dt: number, _progress: number, time: number): void {
    this.born = Math.min(1, this.born + dt / 250);
    const t = time + this.phase;
    const big = this.amount > 1;
    const r = (big ? 6 : 4.5) * easeOutBack(this.born);
    const body = big ? 0x4db8e8 : 0x63c96a;
    const dark = big ? 0x2a6e94 : 0x3a7a40;
    const light = big ? 0xbfe8ff : 0xc0f0c4;

    const bob = Math.sin(t * 2.2) * 2;
    const g = this.root;
    g.clear();

    if (big) {
      const glowPulse = sin01(t, 1.1);
      g.poly([0, -r - 2 + bob, r + 2, bob, 0, r + 2 + bob, -r - 2, bob]).fill({
        color: body,
        alpha: 0.15 + glowPulse * 0.2,
      });
    }
    g.poly([0, -r + bob, r, bob, 0, r + bob, -r, bob]).fill(dark);
    g.poly([0, -r + 1 + bob, r - 1, bob, 0, r - 1 + bob, -r + 1, bob]).fill(body);
    // 高光切面：亮度随时间流动
    g.poly([0, -r + 1 + bob, r - 1, bob, 0, bob]).fill({ color: light, alpha: 0.5 + sin01(t, 1.7) * 0.5 });

    // 周期性十字星光
    const sparkle = sin01(t, 0.5);
    if (sparkle > 0.9) {
      const s = (sparkle - 0.9) * 10;
      const len = r * 1.6 * s;
      g.moveTo(-len, bob - r * 0.4).lineTo(len, bob - r * 0.4).stroke({ color: 0xffffff, width: 1, alpha: s });
      g.moveTo(0, bob - r * 0.4 - len).lineTo(0, bob - r * 0.4 + len).stroke({ color: 0xffffff, width: 1, alpha: s });
    }
  }
}

export function createXpGemView(amount: number): VfxView {
  return new XpGemView(amount);
}
