import type { CharacterView } from './animatedView';
import { HumanoidRig } from './humanoidRig';
import { createPixelPart } from './pixelSprite';

/**
 * 锦衣卫动画素材（成熟像素风，参考 Skul: The Hero Slayer 的像素密度）：
 * 高密度像素网格 + 多级明暗着色 + 黑色描边，约 3~4 头身比例。
 * 部件独立（头/躯干/双手/双腿/绣春刀），由 HumanoidRig 状态机驱动。
 * 乌纱帽（含帽翅）+ 飞鱼服朱红金纹 + 前手持绣春刀。
 */
const PALETTE = {
  o: 0x14141a, // 描边
  h: 0x23232e, // 乌纱暗部
  H: 0x353544, // 乌纱亮部
  s: 0xe8c9a0, // 肤色
  S: 0xc9a377, // 肤色暗部
  e: 0x1b1b22, // 眼睛
  r: 0xb03028, // 飞鱼服朱红
  R: 0xd04a38, // 朱红亮部
  d: 0x7c221c, // 朱红暗部
  g: 0xd4a941, // 金纹/腰带
  G: 0x9c7a2c, // 金纹暗部
  w: 0xf5f0e6, // 高光/刀刃
  m: 0xb8c4cc, // 刀身
  M: 0x8894a0, // 刀身暗部
  b: 0x5a4632, // 刀柄
  k: 0x26262f, // 裤
  K: 0x1c1c24, // 裤暗部
  B: 0x3a2c20, // 靴
};

/** 逻辑像素 → 屏幕像素（更细网格换取更高细节密度） */
const S = 3;

// 头 16x13：乌纱帽带帽翅、脸部两级着色、锐利眼神
const HEAD_ROWS = [
  '....oooooooo....',
  '...ohhHHHHhho...',
  '..ohHHHHHHHHho..',
  'oohhHHHHHHHHhhoo',
  'hhohhhhhhhhhhohh',
  'oo.osssssssso.oo',
  '...osSssssSso...',
  '...oseossseso...',
  '...osssssssso...',
  '...oSssssssSo...',
  '...osSSSSSSso...',
  '....oossssoo....',
  '.....oooooo.....',
];

// 躯干 12x12：飞鱼服双肩、胸口金纹、束金腰带、下摆
const TORSO_ROWS = [
  '.oorrrrrroo.',
  'oorRRRRRRroo',
  'orrRRrrRRrro',
  'orrrrggrrrro',
  'orrggrrggrro',
  'ordrrrrrrdro',
  'ordrrrrrrdro',
  'oGggggggggGo',
  'orddddddddro',
  'orddrrrrddro',
  '.odddddddo..',
  '.ooooooooo..',
];

// 手臂 4x9：袖口渐暗 + 手
const ARM_ROWS = [
  'oRRo',
  'orro',
  'orro',
  'ordo',
  'ordo',
  'oddo',
  'osso',
  'osso',
  '.oo.',
];

// 腿 4x9：裤 + 皮靴
const LEG_ROWS = [
  'okko',
  'okko',
  'okKo',
  'okKo',
  'oKKo',
  'oBBo',
  'oBBo',
  'oBBo',
  'oooo',
];

// 绣春刀 3x16：刃口高光、刀身两级着色、金护手、缠柄
const SWORD_ROWS = [
  '.w.',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'wmM',
  'ggg',
  '.b.',
  '.b.',
  '.b.',
  '.g.',
];

export function createJinyiweiView(): CharacterView {
  const head = createPixelPart({ rows: HEAD_ROWS, palette: PALETTE, scale: S, pivotX: 8, pivotY: 12 });
  const torso = createPixelPart({ rows: TORSO_ROWS, palette: PALETTE, scale: S, pivotX: 6, pivotY: 0 });
  const armFront = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 1 });
  const armBack = createPixelPart({ rows: ARM_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 1 });
  const legFront = createPixelPart({ rows: LEG_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 0 });
  const legBack = createPixelPart({ rows: LEG_ROWS, palette: PALETTE, scale: S, pivotX: 2, pivotY: 0 });
  // 绣春刀：轴心在握把，装在前手末端，随挥砍一起旋转
  const weapon = createPixelPart({ rows: SWORD_ROWS, palette: PALETTE, scale: S, pivotX: 1.5, pivotY: 13 });
  weapon.position.set(0, 7.5 * S);

  return new HumanoidRig({
    parts: { head, torso, armFront, armBack, legFront, legBack, weapon },
    shoulder: { x: 5 * S, y: 1.5 * S },
    hip: { x: 2.5 * S, y: 10 * S },
    neck: { x: 0, y: 0.5 * S },
    strideAmp: 0.5,
    phaseSeed: 0,
    baseY: -7 * S,
  });
}
