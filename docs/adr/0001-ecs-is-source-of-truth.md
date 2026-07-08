# ADR 0001: ECS Is the Source of Truth

## Status

Accepted

## Context

本项目同时使用 PixiJS 和 Matter.js。如果没有明确状态边界，AI 很容易把玩法状态写入 PixiJS DisplayObject 或 Matter.Body，导致渲染、物理和玩法互相污染。

## Decision

ECS Component 是游戏状态唯一来源。

- PixiJS 是显示投影。
- Matter.js 是物理投影。
- RenderRef 和 PhysicsRef 只保存注册表 ID。
- System 负责同步。

## Consequences

优点：

- 状态清晰。
- 便于测试。
- 便于 AI 修改局部功能。
- 便于替换渲染或物理实现。

代价：

- 需要维护同步系统。
- 初期代码量略多。
