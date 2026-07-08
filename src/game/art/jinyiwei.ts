import type { CharacterView } from './animatedView';
import { HumanoidRig } from './humanoidRig';
import { createPixelPart } from './pixelSprite';

/**
 * 锦衣卫动画素材：部件独立（头/躯干/双手/双腿/绣春刀），
 * 由 HumanoidRig 状态机驱动 Idle / Run / Attack / Hit / Death。
 * 乌纱帽 + 飞鱼服朱红金边 + 前手持绣春刀。
 */
const PALETTE = {
  o: 0x14141a, // 描边/乌纱
  h: 0x2b2b36, // 帽体暗部
  s: 0xe8c9a0, // 肤色
  e: 0x1b1b22, // 眼睛
  r: 0xc0392b, // 飞鱼服朱红
  d: 0x8f2a20, // 服装暗部
  g: 0xd4a941, // 金边/腰带
  w: 0xf5f0e6, // 高光/刀刃
  m: 0xb8c4cc, // 刀身
  b: 0x5a4632, // 刀柄
};

const S = 3;

const HEAD_ROWS = [
  '..oooo..',
  '.ohhhho.',
  'ohhhhhho',
  '.ossssoo',
  '.oseseo.',
  '.osssso.',
  '..oooo..',
];

const TORSO_ROWS = [
  'ogrrrrgo',
  'ordrrdro',
  'orrggrro',
  'oggggggo',
];

const ARM_ROWS = ['rr', 'rr', 'dr', 'ss'];

const LEG_ROWS = ['kk', 'kk', 'oo'];

const SWORD_ROWS = ['w', 'm', 'm', 'm', 'm', 'g', 'b'];

const LEG_PALETTE = { ...PALETTE, k: 0x1b1b22 };

export function createJinyiweiView(): CharacterView {
  const head = createPixelPart({ rows: HEAD_ROWS, palette: PALETTE, scale: S, pivotX: 4, pivotY: 7 });
  const torso = createPixelPart({ rows: TORSO_ROWS, palette: PALETTE, scale: S, pivotX: 4, pivotY: 0 });
  const armFront = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 1, pivotY: 0.5 });
  const armBack = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 1, pivotY: 0.5 });
  const legFront = createPixelPart({ rows: LEG_ROWS, palette: LEG_PALETTE, scale: S, pivotX: 1, pivotY: 0 });
  const legBack = createPixelPart({ rows: LEG_ROWS, palette: LEG_PALETTE, scale: S, pivotX: 1, pivotY: 0 });
  // 绣春刀：轴心在握把，装在前手末端，随挥砍一起旋转
  const weapon = createPixelPart({ rows: SWORD_ROWS, palette: PALETTE, scale: S, pivotX: 0.5, pivotY: 6 });
  weapon.position.set(0, 3.5 * S);

  return new HumanoidRig({
    parts: { head, torso, armFront, armBack, legFront, legBack, weapon },
    shoulder: { x: 3.5 * S, y: 0.5 * S },
    hip: { x: 1.5 * S, y: 4 * S },
    neck: { x: 0, y: 0 },
    strideAmp: 0.5,
    phaseSeed: 0,
  });
}
