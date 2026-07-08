---
name: balance-roguelike
description: 调整类吸血鬼幸存者肉鸽游戏的数值平衡，包括怪物波次、XP 曲线、武器成长、升级权重、生存压力和难度节奏。
argument-hint: "[balance-topic]"
---

# Balance Roguelike Skill

## 平衡目标

- 前 30 秒让玩家理解移动和自动攻击。
- 1 到 3 分钟引入升级选择和第一轮压力。
- 3 到 8 分钟增加怪物密度、精英和武器协同。
- 8 到 10 分钟提供 Boss 或高压收束。

## 数值原则

- 所有数值写入 `src/game/balance/`。
- 使用曲线或表，而不是散落 magic number。
- 每个调整说明目标体验和验证方式。
- 同时关注击杀速度、受伤频率、升级速度、屏幕拥挤度。

## 检查指标

- TTK：普通怪平均击杀时间。
- XP/min：每分钟经验获取。
- Level cadence：升级间隔。
- Enemy count：屏幕实体数量。
- Damage pressure：玩家每分钟受击风险。
- Weapon uptime：武器有效输出占比。

## 输出格式

- 当前问题。
- 调整数值。
- 影响的配置文件。
- 预期体验变化。
- 如何验证。
