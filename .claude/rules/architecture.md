# Architecture Rules

这些规则适用于整个项目。

## 分层

- `src/core` 只能包含通用引擎能力，不要依赖具体玩法。
- `src/game` 可以依赖 `src/core`，但 `src/core` 不能依赖 `src/game`。
- `src/game/art` 只放 PixiJS 程序化绘制资产。
- `src/game/balance` 只放数值配置、波次、升级池、武器数据。
- `src/game/features` 可以组织垂直切片，但不能绕过 ECS。

## 状态来源

- ECS Component 是游戏状态来源。
- PixiJS 视图是状态投影。
- Matter.js Body 是物理投影。
- RenderRef 和 PhysicsRef 只保存注册表 ID。

## 修改边界

- 不要为单个玩法重写 ECS core。
- 不要为单个怪物或武器修改全局循环。
- 新能力优先通过新增 Component、System、Factory、Balance config 实现。
- 公共 API 变化必须同步更新文档和相关测试。

## 命名

- Component 使用名词：`Health`, `Transform`, `WeaponSlots`。
- System 使用动作或领域名：`DamageSystem`, `EnemyAISystem`。
- Factory 使用 `createXEntity`。
- PixiJS 资产函数使用 `createXView` 或 `drawX`。
