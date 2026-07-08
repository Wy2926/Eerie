# Character Spec: <Character Id>

> 角色不是属性模板，而是真正决定玩法：核心机制、初始武器、Build 方向。

## Fantasy

一句话说明角色身份与体验（明军身份，如锦衣卫 / 神机营 / 县衙捕快）。

## Core Mechanic

- 机制描述（改变规则，而不是加数值）：
- 机制触发条件：
- 机制与走位/自动攻击的关系：

## Starting Weapon

- 初始武器 id（可被替换，其他角色也可获得该武器）：

## Build Direction

- 擅长方向（如 暴击/处决、火器/爆炸、控制/击退）：
- buildAffinityTags（影响兵法权重池偏向）：
- 代表性成型 Build：

## Base Stats

| Field | Value |
|---|---|
| hp |  |
| speed |  |
| pickupRadius |  |

## Unlock

- 解锁成就（或默认可用）：

## PixiJS Procedural Art

- 剪影（成熟像素风明军，需与其他角色一眼区分）：
- 主色：
- 动画（朝向、受击、机制反馈）：

## ECS

- Components:
- Systems（核心机制专属 System）:

## Verification

- [ ] 核心机制可被 debug overlay 观察
- [ ] 初始武器可被替换
- [ ] 与至少一条兵法路线形成成型 Build
