# Status / Reaction Spec: <Id>

> 基础状态只是起点，重点是状态反应。玩家追求的是组合，不是数值。

## Kind

基础状态 / 状态反应 / 兵法联动

## Fantasy

一句话说明体验（如：中毒 + 燃烧 = 毒爆）。

## 基础状态（若适用）

| Field | Value |
|---|---|
| duration |  |
| tickDamage |  |
| movementModifier |  |
| stackRule | refresh / stack / independent |

## 状态反应（若适用）

- inputs（两种状态）：
- 反应效果：
- consumesInputs：是 / 否
- 视觉反馈（PixiJS 程序化）：

## 兵法联动（若适用）

- requires（所需兵法）：
- 联动名称与成型后的持续规则：
- 联动提示时机：

## Balance

- 触发频率预期：
- 与哪些武器 / 角色协同最强：
- 失衡风险与限制：

## ECS

- Components（状态数据）:
- Systems（StatusSystem / ReactionSystem 挂接点）:
- Events:

## Verification

- [ ] 状态图标/视觉可辨识
- [ ] 反应仅在两种状态共存时触发
- [ ] 大量敌人同时触发时性能稳定
