export type BingfaCategory = 'basic' | 'weapon-mod' | 'status' | 'rule' | 'core';

export interface BingfaConfig {
  id: string;
  name: string;
  category: BingfaCategory;
  description: string;
  /** 效果处理由 BingfaEffects（PlayerBuild modifiers）数据驱动 */
  effects: Partial<BingfaEffects>;
  /** 可重复获得次数，默认 1 */
  maxCount?: number;
}

export interface BingfaEffects {
  damageMul: number;
  cooldownMul: number;
  maxHpAdd: number;
  rangeMul: number;
  arcMul: number;
  /** 挥刀释放短程刀气 */
  swordWave: boolean;
  /** 每次攻击挥两刀（反向补一刀） */
  doubleSlash: boolean;
  /** 刀光留下短暂伤害残留 */
  trail: boolean;
  /** 攻击附加流血 */
  applyBleed: boolean;
  /** 流血可叠加层数上限 */
  bleedMaxStacks: number;
  /** 流血敌人处决阈值提升到该值 */
  executeThresholdVsBleed: number;
  /** 生命越低攻速越快（每损失10%生命，冷却-4%） */
  yuezhanYueyong: boolean;
}

export const BINGFA_CATEGORY_WEIGHTS: Record<BingfaCategory, number> = {
  basic: 20,
  'weapon-mod': 30,
  status: 25,
  rule: 20,
  core: 5,
};

export const BINGFAS: Record<string, BingfaConfig> = {
  // 基础（4）
  gongjiTisheng: {
    id: 'gongjiTisheng',
    name: '厉兵秣马',
    category: 'basic',
    description: '攻击提升 20%',
    effects: { damageMul: 1.2 },
    maxCount: 3,
  },
  gongsuTisheng: {
    id: 'gongsuTisheng',
    name: '兵贵神速',
    category: 'basic',
    description: '攻速提升 15%',
    effects: { cooldownMul: 0.85 },
    maxCount: 3,
  },
  shengmingTisheng: {
    id: 'shengmingTisheng',
    name: '坚壁清野',
    category: 'basic',
    description: '生命上限 +25',
    effects: { maxHpAdd: 25 },
    maxCount: 3,
  },
  fanweiTisheng: {
    id: 'fanweiTisheng',
    name: '长驱直入',
    category: 'basic',
    description: '攻击范围提升 20%',
    effects: { rangeMul: 1.2 },
    maxCount: 3,
  },
  // 武器改造（4）
  daoguangKuoda: {
    id: 'daoguangKuoda',
    name: '横扫千军',
    category: 'weapon-mod',
    description: '刀光扇形角度增大 40%',
    effects: { arcMul: 1.4 },
    maxCount: 2,
  },
  jianqi: {
    id: 'jianqi',
    name: '刀气纵横',
    category: 'weapon-mod',
    description: '挥刀释放短程飞行刀气',
    effects: { swordWave: true },
  },
  lianzhan: {
    id: 'lianzhan',
    name: '连环双斩',
    category: 'weapon-mod',
    description: '每次攻击向身后补一刀',
    effects: { doubleSlash: true },
  },
  tuowei: {
    id: 'tuowei',
    name: '刀光拖尾',
    category: 'weapon-mod',
    description: '刀光留下短暂伤害残留',
    effects: { trail: true },
  },
  // 状态（2）
  jianxueFenghou: {
    id: 'jianxueFenghou',
    name: '见血封喉',
    category: 'status',
    description: '攻击附加流血（持续掉血）',
    effects: { applyBleed: true },
  },
  xueShangJiaXue: {
    id: 'xueShangJiaXue',
    name: '血上加血',
    category: 'status',
    description: '流血可叠加 2 层',
    effects: { bleedMaxStacks: 2 },
  },
  // 规则（2）
  chenqibing: {
    id: 'chenqibing',
    name: '趁其病要其命',
    category: 'rule',
    description: '流血中的敌人，处决阈值提升到 35%',
    effects: { executeThresholdVsBleed: 0.35 },
  },
  yuezhanYueyong: {
    id: 'yuezhanYueyong',
    name: '越战越勇',
    category: 'rule',
    description: '生命越低，攻速越快',
    effects: { yuezhanYueyong: true },
  },
};
