# ADR 0003: Matter.js Uses Fixed Timestep

## Status

Accepted

## Context

浏览器帧率不稳定时，如果直接用 variable delta 推进物理模拟，碰撞、移动和武器冷却会出现不稳定行为。

## Decision

Matter.js 使用 fixed timestep，默认 60Hz。

渲染帧负责累积时间，物理系统按固定步长推进，并限制每帧最大步数。

## Consequences

优点：

- 物理更稳定。
- 更容易复现 bug。
- 更容易写测试和 debug。

代价：

- 需要插值或同步策略。
- 掉帧时需要处理积压步数。
