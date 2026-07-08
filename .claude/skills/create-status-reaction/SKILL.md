---
name: create-status-reaction
description: 新增基础状态（流血、燃烧、冰冻、中毒等）或状态反应（烧灼、碎裂、毒爆、连锁闪电、踩踏等）。状态与反应必须独立成系统并数据驱动。
argument-hint: "[status-or-reaction-id]"
---

# Create Status / Reaction Skill

> 设计约束（见 `docs/BUILD_SYSTEM.md`）：基础状态只是起点，重点是状态反应。玩家追求组合，不是数值。

## 架构

- 状态数据存于 Component（如 `StatusEffects`），逻辑在 `StatusSystem`。
- 反应检测与结算在 `ReactionSystem`（在 DamageSystem 之后、PickupSystem 之前）。
- 状态与反应配置在 `src/game/balance/`（StatusConfig / ReactionConfig）。
- 状态视觉由 VFX/渲染层处理，敌人逻辑与武器逻辑不感知状态实现细节。

## 基础状态必须包含

- config：id、duration、tickDamage/movementModifier、stackRule（refresh / stack / independent）。
- 附加入口：由武器命中或兵法效果统一施加，不在碰撞回调中直接改状态。
- 视觉提示：敌人身上的状态颜色，大量敌人时批量友好（对象池/共享 Graphics）。

## 状态反应必须包含

- config：inputs（两种状态）、effect（效果处理器 id）、consumesInputs。
- 触发规则：仅当两种输入状态共存时触发；明确是否消耗输入状态。
- 反应效果：如范围爆炸、连锁跳跃、群体控制，通过效果处理器实现，可被兵法放大。
- 明确可读的触发瞬间 VFX。

## 参考组合

流血+燃烧=烧灼；冰冻+重击=碎裂；中毒+燃烧=毒爆；潮湿+雷电=连锁闪电；恐惧+击退=踩踏。

## 禁止

- 不要把状态逻辑写进武器或敌人代码。
- 不要在 collision callback 中施加或结算状态。
- 不要每帧为每个状态创建新对象；状态 tick 用固定步进批量处理。

## 验证

- 状态持续时间与叠加规则正确。
- 反应仅在输入状态共存时触发，consumesInputs 行为正确。
- 500+ 敌人同时携带状态时帧率稳定。
- debug overlay 能显示实体当前状态。
