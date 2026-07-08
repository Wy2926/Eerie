# Technical Architecture

## 技术栈

- PixiJS：渲染、程序化绘制、场景层级、UI 展示。
- Matter.js：物理世界、碰撞、sensor、触发器。
- 自研 ECS：游戏状态、实体、组件、系统调度。
- TypeScript：默认语言。

## 总架构

```txt
Input
  ↓
ECS Systems
  ↓                 ↘
Physics Adapter       Render Adapter
  ↓                    ↓
Matter.js             PixiJS
```

ECS 是状态源。Matter.js 和 PixiJS 都只是投影。

## 核心模块

### `src/core/ecs`

- World
- EntityId
- Component storage
- Query
- System scheduler
- Event queue

不依赖 PixiJS、Matter.js 或具体玩法。

### `src/core/render`

- Pixi application
- Layer manager
- Camera
- Render registry
- View lifecycle
- Debug overlay

### `src/core/physics`

- Matter engine
- Fixed timestep
- Body registry
- Collision event adapter
- Collision categories

### `src/game/components`

纯数据组件。

### `src/game/systems`

玩法逻辑和同步逻辑。

### `src/game/art`

所有 PixiJS 程序化绘制资产。

### `src/game/balance`

所有数值配置。

## 推荐组件

- Transform
- Velocity
- Health
- Damage
- Faction
- PlayerTag
- EnemyTag
- PickupTag
- WeaponSlots
- WeaponCooldown
- Projectile
- Lifetime
- RenderRef
- PhysicsRef
- CollisionLayer
- XPValue
- MagnetRadius
- LevelState
- VfxState

## 推荐事件

- CollisionStarted
- DamageRequested
- EntityKilled
- PickupCollected
- ExperienceGained
- LevelUpRequested
- UpgradeSelected
- SpawnRequested
- VfxRequested

## 系统调度

系统顺序必须集中声明，不要分散注册。

```txt
InputSystem
PlayerIntentSystem
EnemyAISystem
WeaponCooldownSystem
WeaponFireSystem
SpawnWaveSystem
PhysicsSyncToMatterSystem
MatterStepSystem
CollisionEventSystem
DamageSystem
PickupSystem
LevelUpSystem
LifetimeSystem
CleanupSystem
RenderSyncSystem
VfxSystem
DebugOverlaySystem
```

## 同步策略

### ECS -> Matter

Transform、Velocity、PhysicsIntent 同步到 Matter Body。

### Matter -> ECS

Matter Body 的结果同步回 Transform。碰撞转成事件。

### ECS -> PixiJS

Transform、AnimationState、HealthRatio、Lifetime 同步到 View。

PixiJS 不反向修改玩法状态。
