# Balance Model

> 玩法方向见 `docs/prd/`、`docs/BUILD_SYSTEM.md`。本文件定义数值与配置结构方向。

## 数值目标

平衡目标是保证玩家每 30 到 60 秒感受到一次成长（升级三选一兵法），同时倭寇压力逐步提高。数值服务于 Build 成型，而非最强武器：所有武器平等，成长全部来自兵法。

## 基础指标

| 指标 | 含义 | 用途 |
|---|---|---|
| TTK | Time To Kill 普通怪击杀时间 | 衡量武器输出 |
| XP/min | 每分钟经验 | 衡量升级节奏 |
| Enemy Count | 屏幕怪物数量 | 衡量压力和性能 |
| Damage Pressure | 玩家受击风险 | 衡量难度 |
| Upgrade Interval | 升级间隔 | 衡量成长频率 |
| Weapon Uptime | 武器有效输出占比 | 衡量爽感 |
| Build 成型时间 | 状态反应/联动首次触发时间 | 衡量 Build 乐趣节奏 |

## 波次配置建议

```ts
export interface WaveConfig {
  startTime: number;
  endTime: number;
  spawnBudgetPerSecond: number;
  maxAlive: number;
  entries: Array<{
    enemyId: string;
    weight: number;
    eliteChance?: number;
  }>;
}
```

## 怪物配置建议

```ts
export interface EnemyConfig {
  id: string;
  hp: number;
  speed: number;
  radius: number;
  contactDamage: number;
  xp: number;
  mass?: number;
  tags: string[];
}
```

## 角色配置建议

```ts
export interface CharacterConfig {
  id: string;              // jinyiwei / shenjiying / bukuai ...
  startingWeaponId: string;
  coreMechanic: string;    // 引用机制 id，机制逻辑在专属 System
  baseStats: { hp: number; speed: number; pickupRadius: number };
  buildAffinityTags: string[]; // 影响兵法权重池的偏向
}
```

## 武器配置建议

武器无品质、无强化、无升星，区别仅在玩法定位（tags 表达：control / burst / ranged / ricochet / knockup 等）。

```ts
export interface WeaponConfig {
  id: string;
  slot: 'primary' | 'secondary';
  cooldown: number;
  damage: number;
  range: number;
  duration?: number;
  projectileCount?: number;
  areaRadius?: number;
  tags: string[];
  unlockAchievementId?: string; // 全部通过成就解锁
  hidden?: boolean;             // 隐藏武器不在列表展示
}
```

携带上限：主武器 1 把 + 副武器 2~3 把；上限后获得新武器必须替换。

## 兵法配置建议

```ts
export type BingfaCategory =
  | 'basic'      // 基础兵法 ~20%
  | 'weapon-mod' // 武器改造 ~30%
  | 'status'     // 状态兵法 ~25%
  | 'rule'       // 规则兵法 ~20%
  | 'core';      // 核心兵法 ~5%

export interface BingfaConfig {
  id: string;
  category: BingfaCategory;
  weight: number;
  requiresTags?: string[];   // 需要已有武器/状态/兵法
  excludesIds?: string[];
  effects: BingfaEffect[];   // 数据驱动效果，机制类效果引用效果处理器 id
}
```

三选一权重池按类别比例抽取（基础20% / 武器改造30% / 状态25% / 规则20% / 核心5%），并根据玩家已有武器、状态、兵法协同调整权重。

## 状态与状态反应配置建议

```ts
export interface StatusConfig {
  id: string;        // bleed / burn / freeze / poison / wet ...
  duration: number;
  tickDamage?: number;
  movementModifier?: number;
  stackRule: 'refresh' | 'stack' | 'independent';
}

export interface ReactionConfig {
  id: string;              // scorch / shatter / poison-burst / chain-lightning / trample
  inputs: [string, string]; // 例如 ['poison', 'burn']
  effect: string;           // 引用反应效果处理器 id
  consumesInputs: boolean;
}

export interface SynergyConfig {
  id: string;               // 兵法联动，例如 zhang-yan（瘴焰）
  requires: string[];       // 例如 ['burn-bingfa', 'poison-burst-bingfa']
  grants: string;           // 联动成型后获得的持续规则
}
```

## 升级权重

升级池应考虑：

- 玩家已有武器与武器 tags。
- 已有状态与可触发的状态反应。
- 已有兵法与可成型的联动。
- 当前局内时间与类别比例。
- 核心兵法出现频率控制（约5%，且一局有限次）。

## 调整数值流程

1. 说明当前体验问题。
2. 指定目标指标。
3. 修改配置表（`src/game/balance/`）。
4. 运行 1 到 3 分钟 smoke playtest。
5. 记录结果。
