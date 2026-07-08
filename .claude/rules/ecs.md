---
paths:
  - "src/core/ecs/**/*.{ts,tsx,js,jsx}"
  - "src/game/components/**/*.{ts,tsx,js,jsx}"
  - "src/game/systems/**/*.{ts,tsx,js,jsx}"
  - "src/game/factories/**/*.{ts,tsx,js,jsx}"
---

# ECS Rules

## Component

- Component 必须是纯数据结构。
- Component 不允许包含 update、render、destroy、handleInput、onCollision 方法。
- Component 不要持有 PixiJS DisplayObject 或 Matter.Body。
- 大量实体使用的 Component 要避免深层对象和可变数组。

推荐：

```ts
export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}
```

禁止：

```ts
export class Player {
  update() {}
  sprite: PIXI.Sprite;
}
```

## System

- System 是行为逻辑位置。
- System 只通过 World 查询和修改 Component。
- System 之间通过 Component 或事件队列通信，不直接互相调用复杂逻辑。
- System 顺序必须在调度器中显式声明。
- System update 的 `dt` 必须被 clamp。

## Entity Factory

- Factory 只负责创建实体并挂载初始组件。
- Factory 不要启动计时器、注册 Pixi ticker 或直接监听 DOM。
- Factory 可以创建 RenderRef/PhysicsRef 所需的描述，但实际视图和 Body 由 adapter/system 管理。

## ECS Core

- 修改 ECS core 前必须说明原因和兼容影响。
- ECS core 不应知道 Player、Enemy、Weapon、PixiJS、Matter.js。
- Query API 必须可测试，不能隐藏副作用。
