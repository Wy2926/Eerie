import { BINGFA_CATEGORY_WEIGHTS, BINGFAS, type BingfaCategory, type BingfaConfig } from '../balance/bingfa';
import { SYNERGIES } from '../balance/status';
import type { PlayerBuild } from '../components/gameplay';

function available(build: PlayerBuild): BingfaConfig[] {
  return Object.values(BINGFAS).filter((cfg) => {
    const count = build.bingfa.get(cfg.id) ?? 0;
    return count < (cfg.maxCount ?? 1);
  });
}

/** 按五层类别权重抽取三选一兵法（同一次不重复）。 */
export function rollChoices(build: PlayerBuild, rng: () => number = Math.random): BingfaConfig[] {
  const pool = available(build);
  const choices: BingfaConfig[] = [];
  while (choices.length < 3 && pool.length > 0) {
    const byCategory = new Map<BingfaCategory, BingfaConfig[]>();
    for (const cfg of pool) {
      if (choices.includes(cfg)) continue;
      const list = byCategory.get(cfg.category) ?? [];
      list.push(cfg);
      byCategory.set(cfg.category, list);
    }
    if (byCategory.size === 0) break;
    let totalWeight = 0;
    for (const category of byCategory.keys()) {
      totalWeight += BINGFA_CATEGORY_WEIGHTS[category];
    }
    let roll = rng() * totalWeight;
    let pickedCategory: BingfaCategory | undefined;
    for (const category of byCategory.keys()) {
      roll -= BINGFA_CATEGORY_WEIGHTS[category];
      if (roll <= 0) {
        pickedCategory = category;
        break;
      }
    }
    const list = byCategory.get(pickedCategory ?? [...byCategory.keys()][0])!;
    choices.push(list[Math.floor(rng() * list.length)]);
  }
  return choices;
}

/** 应用选择，返回新成型的联动 id 列表。 */
export function applyChoice(build: PlayerBuild, bingfaId: string): string[] {
  build.bingfa.set(bingfaId, (build.bingfa.get(bingfaId) ?? 0) + 1);
  const formed: string[] = [];
  for (const synergy of Object.values(SYNERGIES)) {
    if (build.synergies.has(synergy.id)) continue;
    if (synergy.requires.every((id) => build.bingfa.has(id))) {
      build.synergies.add(synergy.id);
      formed.push(synergy.id);
    }
  }
  return formed;
}
