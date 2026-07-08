# Vampire Roguelike Claude Starter

这是一个面向 **PixiJS + Matter.js + 自研 ECS + 全 AI 开发** 的 Claude Code 启动规范包。

项目目标是制作一款以 **Q版明朝抗倭** 为背景的类《吸血鬼幸存者》俯视角肉鸽生存游戏：自动攻击 + 主动走位 + Roguelite Build。玩家扮演不同身份的明军，通过角色、武器、兵法（Build）、状态反应构筑战斗流派，对抗源源不断的倭寇。所有人物、怪物、特效、UI 装饰素材都由 PixiJS 代码绘制，不依赖图片素材。

产品需求按章节存放于 `docs/prd/`；设计提炼见 `docs/GAME_DESIGN.md` 与 `docs/BUILD_SYSTEM.md`。

## 放置方式

把本目录里的文件复制到你的游戏项目根目录：

```txt
<your-game>/
├── CLAUDE.md
├── .claude/
│   ├── rules/
│   ├── skills/
│   └── agents/
└── docs/
```

然后在项目根目录运行 Claude Code。

## 推荐启动顺序

1. 先让 Claude 阅读 `CLAUDE.md`。
2. 用 `/create-feature` 创建第一条可玩闭环。
3. 用 `/create-pixi-asset` 创建第一个玩家和怪物的 PixiJS 代码绘制资产。
4. 用 `/verify-game` 验证项目能启动、能更新 ECS、能渲染、能跑 Matter.js fixed timestep。
5. 每完成一个功能，用 `/game-code-review` 做架构边界检查。

## 强约束摘要

- ECS 是游戏状态唯一来源。
- PixiJS 只负责代码绘制和显示同步。
- Matter.js 只负责物理世界、碰撞和触发器。
- Component 只存数据。
- System 才能产生行为。
- 所有可见素材都必须由 PixiJS 代码绘制。
- 不要引入图片素材、Spritesheet、Texture Atlas 或外部美术文件。
- 不要让 AI 为了完成单个需求重写核心架构。

## 建议首个 MVP

首个可玩版本只做：

- 一个玩家实体。
- WASD / 方向键移动。
- 一种近战环绕武器或自动发射弹体。
- 一种基础追踪怪物（倭寇）。
- XP 掉落物。
- 升级三选一（兵法）。
- 10 分钟波次框架的最小版本。
- Debug overlay：FPS、实体数、body 数、系统耗时。
