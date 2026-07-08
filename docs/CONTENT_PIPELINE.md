# Content Pipeline

## 原则

本项目不使用传统图片素材管线。所有可见内容都由 PixiJS 代码绘制。

## 资产分类

- Player view
- Enemy view
- Boss view
- Weapon projectile view
- Area effect view
- Pickup view
- UI ornament view
- Debug view

## 资产目录

```txt
src/game/art/
├── player/
├── enemies/
├── weapons/
├── pickups/
├── vfx/
├── ui/
└── shared/
```

## 资产函数规范

```ts
export interface CreateViewOptions {
  seed?: number;
  variant?: string;
  palette?: string;
  scale?: number;
}

export interface GameView {
  root: PIXI.Container;
  update?(state: unknown): void;
  destroy(): void;
}
```

## 视觉语义

- 玩家：明亮、中心清晰、轮廓稳定。
- 敌人：颜色低于玩家但剪影明显。
- 精英：描边、光环或脉冲。
- Boss：更大、更复杂、阶段变化明显。
- 危险区域：红色/橙色预警、脉冲边界。
- XP：高亮小宝石、可吸附动效。

## 缓存策略

- 少量独特对象：直接 Graphics。
- 大量重复敌人：生成一次后复用，或绘制到 RenderTexture。
- 高频 VFX：对象池。
- Debug 图形：可关闭。

## 禁止资产

- 图片文件作为游戏资产。
- AI 生成图导入项目。
- Spritesheet。
- Texture atlas。
- 外部美术包。

## 允许例外

- 字体可使用系统字体或项目明确许可字体。
- PixiJS 运行时内部纹理可使用。
- 由 PixiJS 代码生成的 RenderTexture 可使用。
