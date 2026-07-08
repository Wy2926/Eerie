---
name: create-feature
description: 为 PixiJS + Matter.js + 自研 ECS 的类吸血鬼肉鸽游戏新增一个可玩的垂直切片功能。适用于新增玩家能力、怪物机制、掉落、升级、波次、UI 交互或系统级玩法。
argument-hint: "[feature-name]"
---

# Create Gameplay Feature Skill

用于新增一个可玩的游戏功能。目标是小步提交、保持 ECS 边界、可以运行验证。

## 流程

1. 识别功能类型：角色、敌人（倭寇）、武器、兵法、状态/状态反应、掉落、升级、波次、UI、VFX、调试。若属于兵法/状态/角色，优先使用对应专用 skill（create-bingfa / create-status-reaction / create-character）。
2. 列出需要新增或修改的 Component。
3. 列出需要新增或修改的 System。
4. 列出是否需要 PixiJS 程序化资产。
5. 列出是否需要 Matter.js body、sensor 或 collision event。
6. 列出 balance config 入口。
7. 先实现最小可玩闭环，再补边界情况。
8. 更新相关 docs 或注释。
9. 运行类型检查、测试或最小启动验证。

## 必须遵守

- 不要修改 ECS core，除非功能无法通过现有 API 实现。
- 不要把 PixiJS DisplayObject 放进玩法 Component。
- 不要在 collision callback 中做业务结算。
- 不要把数值写死在 System 中。
- 不要把多个无关功能合并到一个巨大 System。

## 输出格式

完成后返回：

- 修改文件列表。
- 新增 Component。
- 新增 System。
- 玩法数据入口。
- 验证方式。
- 架构边界自查结果。
