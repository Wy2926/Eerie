---
name: create-pixi-asset
description: 创建或修改完全由 PixiJS 代码绘制的游戏素材。适用于玩家、怪物、Boss、投射物、掉落、特效、UI 装饰等无图片资产工作。
argument-hint: "[asset-kind] [asset-name]"
---

# Create PixiJS Procedural Asset Skill

本项目所有素材必须由 PixiJS 代码绘制。

## 资产要求

每个资产必须满足：

- 由 PixiJS `Graphics`、`Container`、`Text`、`RenderTexture` 或程序化几何创建。
- 不导入图片、spritesheet 或外部贴图。
- 资产函数可重复调用。
- 返回值可被 RenderSystem 管理和销毁。
- 支持基本状态变化，例如朝向、受击、等级、精英变体或生命周期。

## 推荐步骤

1. 定义资产用途和屏幕可读性要求。
2. 设计剪影：玩家、普通怪、精英、Boss、投射物必须一眼区分。
3. 设计颜色语义：友方、敌方、危险、奖励、稀有度。
4. 创建 `createXView(options)` 或 `drawX(graphics, state)`。
5. 增加轻量动画入口，不要把玩法状态写进视图。
6. 如资产会大量出现，说明缓存或对象池策略。
7. 添加 smoke test 或 debug gallery 入口。

## 推荐接口

```ts
export interface AssetVisualState {
  time: number;
  facing?: number;
  healthRatio?: number;
  rarity?: string;
  variant?: string;
}

export interface ProceduralAsset {
  root: PIXI.Container;
  updateVisual?(state: AssetVisualState): void;
  destroy(): void;
}
```

## 禁止

- 不要使用 `Texture.from('player.png')`。
- 不要新增 `assets/images` 目录。
- 不要把 AI 生成图当成素材导入。
- 不要让视图自己决定伤害、碰撞或死亡。
