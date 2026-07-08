---
name: create-weapon
description: 新增自动攻击武器、进化武器或被动升级。适用于冷却、目标选择、投射物、范围伤害、持续场、环绕物、连锁等能力。
argument-hint: "[weapon-id]"
---

# Create Weapon Skill

## 武器结构

每个武器必须拆分为：

- Weapon config：基础数值、等级成长、标签。
- Cooldown state：不要散落计时器。
- Targeting：最近敌人、随机敌人、方向、环绕、范围内全部等。
- Attack spawn：生成投射物、区域或持续效果实体。
- Hit handling：通过 Collision/Damage system 结算。
- VFX：PixiJS 程序化特效。
- Upgrade effects：通过 modifier 合成。

## 常见武器类型

- Orbit：围绕玩家旋转。
- Projectile：自动发射。
- Aura：玩家周围持续伤害。
- Slash：近战扇形或圆弧。
- Chain：命中后跳跃。
- Field：地面持续区域。

## 禁止

- 不要在武器配置中保存 PixiJS 对象。
- 不要在投射物视图中处理命中。
- 不要把升级效果写死在 WeaponFireSystem。
- 不要为每个武器创建完全重复的大型系统，优先复用通用模式。

## 验证

- 武器能在无敌人时安全空转。
- 有敌人时自动触发。
- 冷却稳定，不受帧率变化影响。
- 命中和销毁不泄漏 Entity、Body、View。
