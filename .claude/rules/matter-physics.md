---
paths:
  - "src/core/physics/**/*.{ts,tsx,js,jsx}"
  - "src/game/systems/**/*physics*.{ts,tsx,js,jsx}"
  - "src/game/components/**/*physics*.{ts,tsx,js,jsx}"
  - "src/game/systems/**/*collision*.{ts,tsx,js,jsx}"
---

# Matter.js Physics Rules

## Fixed Timestep

- Matter.js 必须使用 fixed timestep，默认 `1000 / 60` ms。
- 渲染帧 delta 不能直接传给 `Matter.Engine.update`。
- 切后台或掉帧后要限制累计步数，避免死亡螺旋。

## Body 管理

- Body 创建和销毁必须通过 Physics adapter 或 PhysicsSystem。
- ECS Component 只保存 `bodyId`，不要直接保存 Matter.Body。
- Body 的 label、plugin 或 metadata 只能用于查回 entityId，不作为业务状态源。
- 销毁 Entity 时必须清理 Body 注册表。

## 碰撞

- Matter collision callback 只写入碰撞事件队列。
- Damage、Pickup、Knockback、Trigger 都在 ECS System 中处理。
- 不要在 collision callback 中直接删实体、加经验、扣血或播放特效。
- 触发器和实体碰撞层必须数据驱动。

## 类吸血鬼玩法注意

- 大量怪物时，避免为每个怪物使用复杂多边形碰撞体。
- 普通怪物默认圆形或胶囊近似。
- Projectile 和 Pickup 可使用 sensor body。
- 远程攻击和范围伤害优先用触发器，不要制造重物理模拟。
