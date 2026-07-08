---
name: create-weapon
description: 新增自动攻击武器。武器无品质、定位化（控制/爆发/远程/弹射/击飞），受携带上限约束，成长全部来自兵法。适用于冷却、目标选择、投射物、范围伤害、持续场、环绕物、连锁等能力。
argument-hint: "[weapon-id]"
---

# Create Weapon Skill

> 设计约束（见 `docs/prd/`、`docs/BUILD_SYSTEM.md`）：没有垃圾武器，只有不同 Build。武器无品质、无强化、无升星；区别仅在玩法定位。所有武器全角色共享；携带上限为主武器 1 + 副武器 2~3；成长全部来自兵法（武器改造/状态/规则/核心）；获取通过成就解锁，存在隐藏武器。

## 武器结构

每个武器必须拆分为：

- Weapon config：基础数值、定位标签（tags）、slot（主/副）、解锁成就、是否隐藏。
- Cooldown state：不要散落计时器。
- Targeting：最近敌人、随机敌人、方向、环绕、范围内全部等。
- Attack spawn：生成投射物、区域或持续效果实体。
- Hit handling：通过 Collision/Damage system 结算。
- VFX：PixiJS 程序化特效。
- Bingfa hooks：武器改造兵法（穿透/分裂/剑气等）与状态附加通过 modifier 合成，不写死在武器内。

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
- 不要把兵法效果写死在 WeaponFireSystem。
- 不要给武器加品质、稀有度或独立强化曲线。
- 不要为每个武器创建完全重复的大型系统，优先复用通用模式。

## 验证

- 武器能在无敌人时安全空转。
- 有敌人时自动触发。
- 冷却稳定，不受帧率变化影响。
- 命中和销毁不泄漏 Entity、Body、View。
