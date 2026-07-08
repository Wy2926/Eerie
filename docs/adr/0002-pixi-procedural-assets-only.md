# ADR 0002: PixiJS Procedural Assets Only

## Status

Accepted

## Context

项目要求所有人物、怪物、特效和 UI 装饰素材都由 PixiJS 代码绘制，不使用外部图片资产。

## Decision

游戏资产必须通过 PixiJS Graphics、Container、Text、RenderTexture 或程序化几何创建。

禁止将图片、spritesheet、texture atlas 作为游戏资产导入。

## Consequences

优点：

- 资产完全可由 AI 生成和迭代。
- 风格统一。
- 版本控制轻量。
- 不依赖外部美术管线。

代价：

- 对程序化美术规范要求高。
- 复杂角色细节需要通过几何和动画表达。
- 大量 Graphics 需要缓存和对象池优化。
