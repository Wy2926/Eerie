# Roadmap

> 玩法方向见 `docs/prd/`、`docs/GAME_DESIGN.md`、`docs/BUILD_SYSTEM.md`。

## Phase 0: Project Skeleton

- Vite/TypeScript 项目启动。
- PixiJS app 初始化。
- Matter.js fixed timestep 初始化。
- 自研 ECS 最小实现。
- Debug overlay。

## Phase 1: First Playable Loop

- 玩家移动（首个角色，程序化绘制）。
- 基础倭寇程序化绘制，追踪玩家。
- 一把初始武器自动攻击。
- 碰撞和伤害。
- XP 掉落和拾取。
- 升级三选一兵法（先只含基础兵法 + 少量武器改造）。

## Phase 2: Build System Core

- 兵法五层框架：基础 / 武器改造 / 状态 / 规则 / 核心（数据驱动权重池）。
- 状态系统：流血、燃烧、冰冻、中毒等基础状态。
- 状态反应系统：烧灼、碎裂、毒爆、连锁闪电、踩踏。
- 兵法联动提示与成型（如 燃烧 + 毒爆 → 瘴焰）。
- 武器携带上限（主1 + 副2~3）与替换选择。

## Phase 3: Content Expansion

- 3 个角色（锦衣卫 / 神机营 / 县衙捕快）及核心机制。
- 5 种普通倭寇、2 种精英、1 个 Boss。
- 6 种定位化武器（长枪 / 火枪 / 弓 / 飞刀 / 重锤 / 绣春刀）。
- 规则兵法与核心兵法各首批实装。
- 10 分钟波次曲线。

## Phase 4: Polish and Performance

- 对象池。
- RenderTexture 缓存。
- 碰撞层优化。
- VFX 批量优化。
- Debug gallery。
- 平衡调参工具。

## Phase 5: Meta Progression

- 成就系统与成就解锁武器 / 角色。
- 隐藏武器与隐藏挑战。
- 无限模式。
