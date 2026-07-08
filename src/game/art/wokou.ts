import { Graphics, type Container } from 'pixi.js';
import type { CharacterView, CharacterVisual } from './animatedView';
import { sin01 } from './anim';
import { HumanoidRig } from './humanoidRig';
import { createPixelPart } from './pixelSprite';

/**
 * 倭寇动画素材（成熟像素风，参考 Skul: The Hero Slayer 的像素密度）：
 * 高密度像素网格 + 多级明暗着色 + 黑色描边，凶悍浪人剪影——
 * 月代头顶髻、破旧胴衣、缠布护腕、打刀。部件独立，由 HumanoidRig 驱动，
 * 每个实例随机相位避免群体同步。精英变体：红头巾 + 呼吸脉冲的金色光环。
 */
const PALETTE = {
  o: 0x17140f, // 描边
  k: 0x33291f, // 发髻
  K: 0x241c14, // 发髻暗部
  s: 0xd9b48f, // 肤色
  S: 0xb08d66, // 肤色暗部
  e: 0x241d16, // 眼睛
  c: 0x8c2019, // 疤痕
  b: 0x6e5f4b, // 破衣褐
  B: 0x84745e, // 破衣亮部
  d: 0x4a4038, // 衣服暗部/补丁
  n: 0x3a332c, // 缠布/裤
  N: 0x2c2620, // 缠布暗部
  m: 0xaeb6ba, // 刀身
  M: 0x7e888e, // 刀身暗部
  w: 0xe8ecee, // 刃口高光
  r: 0xa8322a, // 精英红头巾
  R: 0xc4463a, // 头巾亮部
};

// 头 12x12：月代 + 顶髻（精英为红头巾）、狠戾眼神、面颊疤痕
const HEAD_ROWS = [
  '....okko....',
  '....oKKo....',
  '..oooooooo..',
  '.otttttttto.',
  '.otTttttTto.',
  'osssssssssso',
  'osSssssssSso',
  'oseossssesso',
  'osssssscssso',
  'oSsssssssSso',
  '.osSSSSSSso.',
  '..oooooooo..',
];

// 躯干 12x11：破旧胴衣、错落补丁、腰间缠布
const TORSO_ROWS = [
  '.oobbbbbboo.',
  'oobBBbbBBboo',
  'obbbbddbbbbo',
  'obdbbbbbbdbo',
  'obbbbbdbbbbo',
  'obddbbbbddbo',
  'oNnnnnnnnnNo',
  'obdddddddbo.',
  'obbdbbbbdbo.',
  '.oddddddddo.',
  '.oooooooooo.',
];

// 手臂 4x8：破袖 + 缠布护腕 + 手
const ARM_ROWS = [
  'oBbo',
  'obbo',
  'obdo',
  'onno',
  'oNno',
  'osso',
  'osso',
  '.oo.',
];

// 腿 4x8：缠布裤 + 赤足草鞋
const LEG_ROWS = [
  'onno',
  'onno',
  'onNo',
  'oNNo',
  'onno',
  'osso',
  'oSSo',
  'oooo',
];

// 打刀 3x12：刃口高光、刀身两级着色、缠柄
const KNIFE_ROWS = [
  '.w.',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'ooo',
  '.n.',
  '.N.',
  '.n.',
];

function headRows(elite: boolean): string[] {
  return HEAD_ROWS.map((row) => row.replace(/t/g, elite ? 'r' : 'k').replace(/T/g, elite ? 'R' : 'K'));
}

class WokouView implements CharacterView {
  private rig: HumanoidRig;
  private aura?: Graphics;
  private auraScale: number;
  readonly root: Container;

  constructor(scale: number, elite: boolean) {
    const S = scale;
    this.auraScale = S;
    const head = createPixelPart({ rows: headRows(elite), palette: PALETTE, scale: S, pivotX: 6, pivotY: 11 });
    const torso = createPixelPart({ rows: TORSO_ROWS, palette: PALETTE, scale: S, pivotX: 6, pivotY: 0 });
    const armFront = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 1 });
    const armBack = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 1 });
    const legFront = createPixelPart({ rows: LEG_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 0 });
    const legBack = createPixelPart({ rows: LEG_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 0 });
    const weapon = createPixelPart({ rows: KNIFE_ROWS, palette: PALETTE, scale: S, pivotX: 1.5, pivotY: 10 });
    weapon.position.set(0, 6.5 * S);

    this.rig = new HumanoidRig({
      parts: { head, torso, armFront, armBack, legFront, legBack, weapon },
      shoulder: { x: 5 * S, y: 1.5 * S },
      hip: { x: 2.5 * S, y: 9 * S },
      neck: { x: 0, y: 0.5 * S },
      strideAmp: 0.65,
      baseY: -6 * S,
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
      const radius = (16 + pulse * 2.5) * this.auraScale;
      this.aura.clear();
      for (let i = 0; i < 3; i++) {
        const base = v.time * 1.5 + (i * Math.PI * 2) / 3;
        this.aura.arc(0, 4 * this.auraScale, radius, base, base + 1.6).stroke({
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
