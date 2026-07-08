# AI Development Workflow

## 日常任务流程

1. 描述目标和限制。
2. 让 Claude 识别任务类型。
3. 调用对应 skill。
4. 先生成计划。
5. 小步修改。
6. 运行验证。
7. 做代码审查。
8. 更新文档。

## 常用 skill

- `/create-feature`：新增玩法切片。
- `/create-pixi-asset`：新增程序化绘制资产。
- `/create-enemy`：新增怪物。
- `/create-weapon`：新增武器。
- `/create-vfx`：新增特效。
- `/balance-roguelike`：调整数值。
- `/debug-frame`：调试主循环、碰撞、渲染同步。
- `/game-code-review`：代码审查。
- `/verify-game`：手动验证。

## 常用 subagent

- `ecs-architect`：架构拆分和边界审查。
- `pixi-asset-artist`：程序化美术设计。
- `gameplay-designer`：玩法和平衡。
- `performance-auditor`：性能审查。
- `bug-hunter`：bug 定位。

## 提示词模板

```txt
请使用 /create-feature 实现 [功能名]。
约束：
- 保持 ECS 是状态源。
- PixiJS 只做程序化绘制。
- Matter.js 使用 fixed timestep。
- 数值写入 balance config。
- 完成后运行验证并做架构边界自查。
```

```txt
请使用 /create-pixi-asset 创建 [资产名]。
要求：
- 不使用图片。
- 使用 PixiJS Graphics/Container 绘制。
- 说明剪影、颜色语义和性能策略。
- 给出 debug gallery 展示方式。
```

```txt
请使用 /debug-frame 定位 [问题]。
先判断问题属于 ECS、Matter、Pixi、输入、时间步、配置还是清理流程。
不要直接猜修复。
```
