# Balance Model

## 数值目标

平衡目标是保证玩家每 30 到 60 秒感受到一次成长，同时怪物压力逐步提高。

## 基础指标

| 指标 | 含义 | 用途 |
|---|---|---|
| TTK | Time To Kill 普通怪击杀时间 | 衡量武器输出 |
| XP/min | 每分钟经验 | 衡量升级节奏 |
| Enemy Count | 屏幕怪物数量 | 衡量压力和性能 |
| Damage Pressure | 玩家受击风险 | 衡量难度 |
| Upgrade Interval | 升级间隔 | 衡量成长频率 |
| Weapon Uptime | 武器有效输出占比 | 衡量爽感 |

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

## 武器配置建议

```ts
export interface WeaponConfig {
  id: string;
  cooldown: number;
  damage: number;
  range: number;
  duration?: number;
  projectileCount?: number;
  areaRadius?: number;
  tags: string[];
  levels: WeaponLevelConfig[];
}
```

## 升级权重

升级池应考虑：

- 玩家已有武器。
- 武器是否满级。
- 被动是否与武器协同。
- 当前局内时间。
- 稀有度权重。

## 调整数值流程

1. 说明当前体验问题。
2. 指定目标指标。
3. 修改配置表。
4. 运行 1 到 3 分钟 smoke playtest。
5. 记录结果。
