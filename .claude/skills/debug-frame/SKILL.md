---
name: debug-frame
description: 调试游戏主循环、帧率、ECS 系统顺序、Matter.js fixed timestep、PixiJS 渲染不同步、实体泄漏或碰撞异常。
argument-hint: "[symptom]"
---

# Debug Frame Skill

## 定位顺序

1. 确认主循环是否运行。
2. 确认 fixed timestep 是否稳定。
3. 确认 ECS System 顺序是否正确。
4. 确认 Entity/Component 是否存在。
5. 确认 Matter Body 是否存在且同步。
6. 确认 PixiJS View 是否存在且同步。
7. 确认 Cleanup 是否同时清理 Entity、Body、View。

## 常见症状

- 画面移动但碰撞不对：检查 PhysicsSync 和 MatterStep 顺序。
- 碰撞发生但没有伤害：检查 CollisionEventSystem 到 DamageSystem。
- 实体死亡但还显示：检查 CleanupSystem 和 Render registry。
- 掉帧：检查每帧分配、Graphics 创建、Body 数量。
- 武器冷却不稳定：检查 dt clamp 和 fixed/variable delta 混用。

## 输出要求

- 根因分类。
- 证据。
- 最小修复。
- 回归测试或 debug 场景。
