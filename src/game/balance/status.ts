export interface StatusConfig {
  id: string;
  name: string;
  durationMs: number;
  /** 每次 tick 伤害（tick 间隔 500ms） */
  tickDamage: number;
  maxStacks: number;
  /** 状态提示颜色 */
  color: number;
}

export const STATUS_TICK_MS = 500;

export const STATUSES: Record<string, StatusConfig> = {
  bleed: {
    id: 'bleed',
    name: '流血',
    durationMs: 3000,
    tickDamage: 2,
    maxStacks: 1,
    color: 0xd63030,
  },
};

export interface SynergyConfig {
  id: string;
  name: string;
  /** 需要同时拥有的兵法 id */
  requires: string[];
  description: string;
}

export const SYNERGIES: Record<string, SynergyConfig> = {
  xueyuZhuilie: {
    id: 'xueyuZhuilie',
    name: '血狱追猎',
    requires: ['jianxueFenghou', 'chenqibing'],
    description: '流血敌人死亡时，向周围敌人溅射流血',
  },
};

/** 血狱追猎溅射半径 */
export const XUEYU_SPLASH_RADIUS = 100;
