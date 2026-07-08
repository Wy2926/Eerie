---
name: create-character
description: 新增可选明军角色（如锦衣卫、神机营、县衙捕快）。角色决定核心机制、初始武器和 Build 方向，不是属性模板。
argument-hint: "[character-id]"
---

# Create Character Skill

> 设计约束（见 `docs/prd/`）：角色真正决定玩法。同一把武器在不同角色手中最终 Build 完全不同。

## 角色必须包含

- balance config：id、startingWeaponId、coreMechanic、baseStats（hp/speed/pickupRadius）、buildAffinityTags、解锁成就（`src/game/balance/`）。
- 核心机制：改变规则的机制（如暴击/背刺/处决、火器/爆炸增益、控制/击退增强），实现为独立小 System 或效果处理器，不塞进 PlayerSystem。
- 初始武器：引用武器表中的普通武器；初始武器可被替换，其他角色也可解锁获得。
- buildAffinityTags：影响兵法三选一权重池偏向，但不锁死选择。
- PixiJS 程序化外观：成熟像素风明军剪影，与其他角色一眼区分；朝向、受击、机制触发反馈。

## 禁止

- 不要把角色做成纯属性差异模板。
- 不要给角色专属武器锁定（武器全共享）。
- 不要把核心机制逻辑散落在多个通用 System 的 if(characterId) 分支里。

## 验证

- 角色核心机制可被 debug overlay 观察。
- 初始武器可替换，替换后角色机制仍生效。
- 与至少一条兵法路线形成可成型 Build（记录一条代表流派）。
- 角色选择/解锁通过配置驱动。
