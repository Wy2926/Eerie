import { Graphics, type Container } from 'pixi.js';
import type { CharacterView, CharacterVisual } from './animatedView';
import { sin01 } from './anim';
import { HumanoidRig } from './humanoidRig';
import { createPixelPart } from './pixelSprite';

/**
 * 倭寇动画素材：部件独立（头/躯干/双手/双腿/短刀），
 * 由 HumanoidRig 状态机驱动 Run / Hit / Death；每个实例随机相位避免群体同步。
 * 精英变体：红头巾 + 呼吸脉冲的金色光环。
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

const HEAD_ROWS = [
  '...kk...',
  '..oooo..',
  '.otttto.',
  '.osssso.',
  '.oseseo.',
  '.osssso.',
  '..oooo..',
];

const TORSO_ROWS = [
  'obbbbbbo',
  'obdbbdbo',
  'obbbbbbo',
  'oddddddo',
];

const ARM_ROWS = ['bb', 'bb', 'ss'];

const LEG_ROWS = ['bb', 'dd', 'oo'];

const KNIFE_ROWS = ['m', 'm', 'm', 'o'];

function headRows(elite: boolean): string[] {
  return HEAD_ROWS.map((row) => row.replace(/t/g, elite ? 'r' : 'k'));
}

class WokouView implements CharacterView {
  private rig: HumanoidRig;
  private aura?: Graphics;
  readonly root: Container;

  constructor(scale: number, elite: boolean) {
    const S = scale;
    const head = createPixelPart({ rows: headRows(elite), palette: PALETTE, scale: S, pivotX: 4, pivotY: 7 });
    const torso = createPixelPart({ rows: TORSO_ROWS, palette: PALETTE, scale: S, pivotX: 4, pivotY: 0 });
    const armFront = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 1, pivotY: 0.5 });
    const armBack = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 1, pivotY: 0.5 });
    const legFront = createPixelPart({ rows: LEG_ROWS, palette: PALETTE, scale: S, pivotX: 1, pivotY: 0 });
    const legBack = createPixelPart({ rows: LEG_ROWS, palette: PALETTE, scale: S, pivotX: 1, pivotY: 0 });
    const weapon = createPixelPart({ rows: KNIFE_ROWS, palette: PALETTE, scale: S, pivotX: 0.5, pivotY: 3.5 });
    weapon.position.set(0, 2.5 * S);

    this.rig = new HumanoidRig({
      parts: { head, torso, armFront, armBack, legFront, legBack, weapon },
      shoulder: { x: 3.5 * S, y: 0.5 * S },
      hip: { x: 1.5 * S, y: 4 * S },
      neck: { x: 0, y: 0 },
      strideAmp: 0.65,
    });
    this.root = this.rig.root;

    if (elite) {
      this.aura = new Graphics();
      this.root.addChildAt(this.aura, 0);
    }
  }

  update(dt: number, v: CharacterVisual): void {
    this.rig.update(dt, v);
    if (this.aura) {
      // 精英光环：半径与透明度随时间脉冲，缓慢旋转的三段弧
      const pulse = sin01(v.time, 1.2);
      const radius = 26 + pulse * 4;
      this.aura.clear();
      for (let i = 0; i < 3; i++) {
        const base = v.time * 1.5 + (i * Math.PI * 2) / 3;
        this.aura.arc(0, 6, radius, base, base + 1.6).stroke({
          color: 0xd4a941,
          width: 2,
          alpha: 0.45 + pulse * 0.35,
        });
      }
      this.aura.alpha = v.state === 'death' ? 1 - v.stateProgress : 1;
    }
  }
}

export function createWokouView(scale = 3, elite = false): CharacterView {
  return new WokouView(scale, elite);
}
