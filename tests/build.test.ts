import { describe, expect, it } from 'vitest';
import type { PlayerBuild } from '../src/game/components/gameplay';
import { applyChoice, rollChoices } from '../src/game/systems/bingfaChoice';
import { resolveBuild } from '../src/game/systems/build';

function makeBuild(): PlayerBuild {
  return {
    bingfa: new Map(),
    synergies: new Set(),
    level: 1,
    xp: 0,
    xpToNext: 10,
    pendingLevelUps: 0,
  };
}

describe('resolveBuild', () => {
  it('stacks repeatable basic bingfa multiplicatively', () => {
    const build = makeBuild();
    build.bingfa.set('gongjiTisheng', 2);
    const r = resolveBuild(build);
    expect(r.damageMul).toBeCloseTo(1.44);
  });

  it('applies rule and status bingfa flags', () => {
    const build = makeBuild();
    build.bingfa.set('jianxueFenghou', 1);
    build.bingfa.set('chenqibing', 1);
    build.bingfa.set('xueShangJiaXue', 1);
    const r = resolveBuild(build);
    expect(r.applyBleed).toBe(true);
    expect(r.executeThresholdVsBleed).toBeCloseTo(0.35);
    expect(r.bleedMaxStacks).toBe(2);
  });
});

describe('rollChoices', () => {
  it('returns three distinct choices', () => {
    const choices = rollChoices(makeBuild());
    expect(choices).toHaveLength(3);
    expect(new Set(choices.map((c) => c.id)).size).toBe(3);
  });

  it('excludes bingfa at maxCount', () => {
    const build = makeBuild();
    build.bingfa.set('jianqi', 1);
    for (let i = 0; i < 50; i++) {
      const choices = rollChoices(build);
      expect(choices.some((c) => c.id === 'jianqi')).toBe(false);
    }
  });
});

describe('applyChoice', () => {
  it('forms 血狱追猎 when both required bingfa acquired', () => {
    const build = makeBuild();
    expect(applyChoice(build, 'jianxueFenghou')).toEqual([]);
    expect(applyChoice(build, 'chenqibing')).toEqual(['xueyuZhuilie']);
    expect(build.synergies.has('xueyuZhuilie')).toBe(true);
    // 不重复成型
    expect(applyChoice(build, 'gongjiTisheng')).toEqual([]);
  });
});
