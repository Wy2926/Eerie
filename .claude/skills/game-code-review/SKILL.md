---
name: game-code-review
description: 审查 PixiJS + Matter.js + 自研 ECS 肉鸽项目的代码改动，重点检查架构边界、性能、素材规则、物理同步、数据驱动约束和测试缺口。
argument-hint: "[scope]"
---

# Game Code Review Skill

## 审查重点

1. ECS 边界是否被破坏。
2. PixiJS 是否只负责绘制和显示同步。
3. Matter.js 是否只负责物理和碰撞事件。
4. 是否引入了图片素材或外部贴图。
5. 是否把数值硬编码到 System。
6. 是否产生每帧分配热点。
7. 是否缺少清理 Body/View 的逻辑。
8. 是否缺少测试或最小验证。
9. 角色、武器、兵法、状态、反应、联动是否数据驱动（`src/game/balance/`），而非硬编码在 System。
10. 是否违反设计约束：武器品质/强化、状态逻辑散落在武器代码、兵法效果写死。

## 风险等级

- Blocker：会破坏架构、无法构建、数据丢失、安全风险。
- Major：会造成明显 bug、性能问题、状态不一致。
- Minor：命名、组织、文档或可维护性问题。

## 输出格式

- 总体结论。
- Blocker 列表。
- Major 列表。
- Minor 列表。
- 建议修改顺序。
- 可以接受的技术债。
