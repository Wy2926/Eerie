---
name: verify-game
description: 验证 PixiJS + Matter.js + 自研 ECS 游戏项目在当前改动后仍能构建、启动、运行主循环、渲染程序化资产并推进 fixed timestep。
disable-model-invocation: true
argument-hint: "[optional-focus]"
---

# Verify Game Skill

这个 skill 只在用户手动调用 `/verify-game` 时执行。

## 验证步骤

1. 查看 package scripts，确定 test、typecheck、lint、build、dev 命令。
2. 优先运行无副作用命令：typecheck、lint、test、build。
3. 如果有浏览器验证能力，启动 dev server 并检查主循环 smoke test。
4. 检查是否存在图片资产导入。
5. 检查是否存在明显架构违规：Pixi 对象进 Component、Matter.Body 进 Component。
6. 检查对象清理：Entity、Body、View 是否成对释放。

## 不允许

- 不要运行部署、发布、上传、git push。
- 不要删除用户文件。
- 不要自动修改依赖版本。

## 输出格式

- 运行的命令。
- 通过项。
- 失败项。
- 需要修复的最短路径。
