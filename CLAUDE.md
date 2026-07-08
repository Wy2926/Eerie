# CLAUDE.md

本项目是一个 **PixiJS + Matter.js + 自研 ECS** 的俯视角肉鸽生存游戏：以 **Q版明朝抗倭** 为背景，自动攻击 + 主动走位 + Roguelite Build（兵法系统）。玩法参考《吸血鬼幸存者》类型，但代码和架构必须保持原创。产品需求见 `docs/prd/`，设计提炼见 `docs/GAME_DESIGN.md` 与 `docs/BUILD_SYSTEM.md`。

所有人物、怪物、特效、掉落物、UI 装饰素材都必须由 PixiJS 代码绘制。默认使用 TypeScript；如果项目选择纯 JavaScript，仍保持同样目录和边界。

## Claude 工作方式

- 修改代码前先判断任务属于：ECS、PixiJS 绘制资产、Matter.js 物理、玩法、性能、测试、文档。
- 先给出简短计划，再编辑文件。
- 不要修改与当前任务无关的文件。
- 不要绕过类型检查、lint、测试或构建错误。
- 发现架构冲突时，先修边界，再实现功能。
- 美术风格为“像素化 Q 版”：PixiJS 程序化绘制大像素块，2 头身比例，受限调色板，硬像素边缘（nearest 缩放、关闭抗锯齿）；细则见 `.claude/rules/pixi-procedural-art.md` 与 `docs/prd/02-mvp-first-slice.md`。
- 对不明确的玩法数值，先实现可配置数据表，不要把数值散落在系统中。

## 架构不变量

- ECS 是游戏状态唯一来源。
- Entity 只是 ID，不要做成继承体系。
- Component 只存数据，不包含 update、render、handleInput 等行为。
- System 执行逻辑和副作用。
- PixiJS DisplayObject 不是业务状态源。
- Matter.Body 不是业务状态源。
- PixiJS 和 Matter.js 之间只能通过 Adapter/System 与 ECS 同步。
- 游戏逻辑、物理、渲染三者必须分层。
- 系统执行顺序必须显式、稳定、可测试。

## 目录约定

```txt
src/
├── core/
│   ├── ecs/          # World, Entity, Component, System, Query
│   ├── render/       # PixiJS app, layers, camera, render adapter
│   ├── physics/      # Matter.js engine, body registry, collision adapter
│   ├── time/         # fixed timestep, frame budget
│   └── debug/        # overlay, profiling, diagnostics
└── game/
    ├── components/   # pure data components
    ├── systems/      # gameplay systems
    ├── factories/    # entity factories
    ├── art/          # PixiJS procedural drawing assets only
    ├── balance/      # numbers, waves, upgrades, weapons
    └── features/     # vertical gameplay slices
```

## PixiJS 程序化素材规则

- **素材准则（强制）**：新增任何技能、角色、武器、怪物、特效、掉落物、UI 装饰素材，必须使用 `.claude/skills/` 中对应的 skill 流程（create-pixi-asset / create-vfx / create-character / create-enemy / create-weapon / create-bingfa 等）。
- **一素材一文件（强制）**：每个素材必须有独立文件放在 `src/game/art/`，用 JS/TS 代码（PixiJS Graphics/Container）表达，导出 `createXxxView()` 工厂函数；禁止把绘制代码内联在系统、工厂或 main 中。

- 禁止引入 `.png`、`.jpg`、`.webp`、spritesheet、texture atlas 作为游戏资产。
- 允许使用 PixiJS `Graphics`、`Container`、`Text`、`RenderTexture` 和程序化几何。
- 资产函数必须可复用、可销毁、可测试。
- 资产代码放在 `src/game/art/` 或 `src/core/render/`。
- 玩法状态不能写进 Sprite、Graphics 或 Container。
- 动画由 ECS 组件驱动，例如 `AnimationState`、`Facing`、`HealthRatio`、`Lifetime`。
- 特效优先使用对象池，不要每帧大量 new Graphics。

## Matter.js 规则

- Matter.js 使用 fixed timestep，默认 60Hz。
- 不要用 Pixi ticker 的 variable delta 直接推进 `Matter.Engine.update`。
- 碰撞回调只收集事件，不直接销毁 Entity。
- `PhysicsRef` 只能保存 bodyId，不要让 Component 直接持有业务逻辑 Body。
- Body 创建、销毁、同步必须集中在 Physics adapter/System。

## 玩法规则

- 玩家移动是核心输入；攻击默认自动化。不增加操作复杂度，只增加决策深度。
- 核心公式：角色 × 武器 × 兵法 × 状态反应 = Build。升级三选一的内容是兵法，80% 是机制而非数值。
- 怪物生成必须数据驱动：时间、权重、上限、精英、Boss。
- 角色、武器、兵法、状态、状态反应、联动必须数据驱动（`src/game/balance/`）。
- 武器无品质、无强化；携带上限为主武器 1 + 副武器 2~3，成长全部来自兵法。
- 每个武器至少拆成：配置、冷却、目标选择、生成攻击实体、命中处理、VFX。
- 怪物 AI 默认简单、可批量运行，避免复杂寻路。
- 掉落物、XP、磁吸、升级选择要独立成系统；状态与状态反应也要独立成系统（StatusSystem / ReactionSystem），不要散落在武器逻辑中。
- 不要把所有玩法塞进 PlayerSystem 或 GameSystem。

## 推荐系统顺序

1. InputSystem
2. PlayerIntentSystem
3. EnemyAISystem
4. WeaponCooldownSystem
5. WeaponFireSystem
6. SpawnWaveSystem
7. PhysicsSyncToMatterSystem
8. MatterStepSystem
9. CollisionEventSystem
10. DamageSystem
11. StatusSystem
12. ReactionSystem
13. PickupSystem
14. LevelUpSystem
15. LifetimeSystem
16. CleanupSystem
17. RenderSyncSystem
18. VfxSystem
19. DebugOverlaySystem

## 禁止事项

- 不要引入 Phaser、Three.js 或其他游戏引擎。
- 不要新增全局状态管理库。
- 不要把 PixiJS 对象放进玩法 Component，除非是明确的 `RenderRef` ID。
- 不要把 Matter.Body 放进玩法 Component，除非是明确的 `PhysicsRef` ID。
- 不要在 collision callback 中直接改血量、删实体或生成奖励。
- 不要每帧创建大量临时对象、数组、Graphics、Body。
- 不要自动升级依赖版本，除非任务明确要求。
- 不要提交密钥、令牌、私有 URL 或本地路径。

## 完成定义

每次任务完成前必须自查：

- TypeScript 能通过。
- 架构边界未被破坏。
- 关键逻辑有测试或最小验证场景。
- Debug overlay 或日志能辅助定位问题。
- 新增玩法数据在 `src/game/balance/` 中可配置。
- 新增 PixiJS 资产不依赖图片文件。
