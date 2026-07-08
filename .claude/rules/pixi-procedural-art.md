---
paths:
  - "src/core/render/**/*.{ts,tsx,js,jsx}"
  - "src/game/art/**/*.{ts,tsx,js,jsx}"
  - "src/game/systems/**/*render*.{ts,tsx,js,jsx}"
  - "src/game/systems/**/*vfx*.{ts,tsx,js,jsx}"
---

# PixiJS Procedural Art Rules

本项目所有可见素材都由 PixiJS 代码绘制。

## 素材准则（强制）

- 新增任何技能、角色、武器、怪物、特效、掉落物、UI 装饰素材，必须使用 `.claude/skills/` 中对应的 skill 流程。
- 每个素材独立文件，放在 `src/game/art/`，导出 `createXxxView()` 工厂函数，用代码表达全部视觉。
- 禁止把绘制代码内联在 systems、factories 或 main 中；这些位置只允许调用 art 工厂函数。
- 现有素材文件示例：`jinyiwei.ts`、`wokou.ts`、`slashVfx.ts`、`swordWaveVfx.ts`、`xpGem.ts`。

## 禁止

- 不要导入图片素材：png、jpg、jpeg、webp、gif、svg。
- 不要使用 spritesheet、texture atlas 或外部贴图资源作为游戏资产。
- 不要让 Sprite 或 Graphics 保存玩法状态。
- 不要在 Pixi ticker 中实现核心玩法。
- 不要每帧重新创建完整角色、怪物或 VFX 容器。

## 推荐资产接口

```ts
export interface ProceduralViewOptions {
  seed?: number;
  palette?: string;
  scale?: number;
}

export function createPlayerView(options: ProceduralViewOptions): PIXI.Container {
  const root = new PIXI.Container();
  return root;
}
```

## 绘制风格

- 整体风格为 **像素化 Q 版**：用 Graphics 绘制大像素块网格（逻辑像素 1 格 ≈ 屏幕 3~4px），角色约 2 头身，调色板每实体 4~6 色。
- 关闭抗锯齿，缩放用最近邻（nearest），保持硬像素边缘；像素坐标对齐网格，避免亚像素模糊。
- 动画用少量帧的像素位移/翻转/挤压，由 ECS 组件驱动。
- 俯视角可读性优先于复杂细节。
- 使用剪影与调色板区分阵营、怪物类型、投射物危险度。
- 玩家：高对比轮廓、中心清晰、方向标识明显。
- 普通怪物：低复杂度、可批量渲染。
- 精英怪：额外轮廓、光环、缩放或粒子装饰。
- Boss：独特剪影、阶段性颜色或部件变化。
- 危险特效：预警圈、方向箭头、闪烁节奏。

## 性能

- 静态几何可缓存为 RenderTexture，但仍必须由 PixiJS 代码生成。
- 大量同类实体优先复用视图或对象池。
- VFX 使用 Lifetime + pooled Graphics。
- Debug 绘制必须能关闭。
