import { BINGFAS, type BingfaEffects } from '../balance/bingfa';
import { STATUSES } from '../balance/status';
import type { PlayerBuild } from '../components/gameplay';

export interface ResolvedBuild {
  damageMul: number;
  cooldownMul: number;
  maxHpAdd: number;
  rangeMul: number;
  arcMul: number;
  swordWave: boolean;
  doubleSlash: boolean;
  trail: boolean;
  applyBleed: boolean;
  bleedMaxStacks: number;
  executeThresholdVsBleed: number;
  yuezhanYueyong: boolean;
}

/** 把已获得兵法折算成当前 Build 数值/规则（纯函数，可测试）。 */
export function resolveBuild(build: PlayerBuild): ResolvedBuild {
  const r: ResolvedBuild = {
    damageMul: 1,
    cooldownMul: 1,
    maxHpAdd: 0,
    rangeMul: 1,
    arcMul: 1,
    swordWave: false,
    doubleSlash: false,
    trail: false,
    applyBleed: false,
    bleedMaxStacks: STATUSES.bleed.maxStacks,
    executeThresholdVsBleed: 0,
    yuezhanYueyong: false,
  };
  for (const [id, count] of build.bingfa) {
    const cfg = BINGFAS[id];
    if (!cfg) continue;
    const e: Partial<BingfaEffects> = cfg.effects;
    for (let i = 0; i < count; i++) {
      if (e.damageMul !== undefined) r.damageMul *= e.damageMul;
      if (e.cooldownMul !== undefined) r.cooldownMul *= e.cooldownMul;
      if (e.maxHpAdd !== undefined) r.maxHpAdd += e.maxHpAdd;
      if (e.rangeMul !== undefined) r.rangeMul *= e.rangeMul;
      if (e.arcMul !== undefined) r.arcMul *= e.arcMul;
    }
    if (e.swordWave) r.swordWave = true;
    if (e.doubleSlash) r.doubleSlash = true;
    if (e.trail) r.trail = true;
    if (e.applyBleed) r.applyBleed = true;
    if (e.bleedMaxStacks !== undefined) r.bleedMaxStacks = Math.max(r.bleedMaxStacks, e.bleedMaxStacks);
    if (e.executeThresholdVsBleed !== undefined) {
      r.executeThresholdVsBleed = Math.max(r.executeThresholdVsBleed, e.executeThresholdVsBleed);
    }
    if (e.yuezhanYueyong) r.yuezhanYueyong = true;
  }
  return r;
}
