import { Container, Graphics } from 'pixi.js';

/** Screen pixels per logical pixel of the pixel-art grid. */
export const PIXEL_SCALE = 4;

export interface PixelSpriteOptions {
  /** Rows of single-character color keys; ' ' or '.' means transparent. */
  rows: string[];
  palette: Record<string, number>;
  scale?: number;
}

export interface PixelPartOptions extends PixelSpriteOptions {
  /** 旋转/缩放轴心，网格坐标（可为小数） */
  pivotX: number;
  pivotY: number;
}

/**
 * 绘制一个可独立动画的像素部件：Graphics 原点即部件轴心，
 * 供角色分层骨骼（头/躯干/手/腿/武器）单独旋转、位移、缩放。
 */
export function createPixelPart(options: PixelPartOptions): Graphics {
  const scale = options.scale ?? PIXEL_SCALE;
  const g = new Graphics();
  for (let y = 0; y < options.rows.length; y++) {
    const row = options.rows[y];
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      if (key === ' ' || key === '.') continue;
      const color = options.palette[key];
      if (color === undefined) continue;
      g.rect((x - options.pivotX) * scale, (y - options.pivotY) * scale, scale, scale).fill(color);
    }
  }
  return g;
}

/**
 * Draws a pixel-art sprite from a character grid using Graphics rectangles.
 * All art in this project is procedural — no image assets.
 */
export function createPixelSprite(options: PixelSpriteOptions): Container {
  const scale = options.scale ?? PIXEL_SCALE;
  const root = new Container();
  const g = new Graphics();
  const height = options.rows.length;
  for (let y = 0; y < height; y++) {
    const row = options.rows[y];
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      if (key === ' ' || key === '.') continue;
      const color = options.palette[key];
      if (color === undefined) continue;
      g.rect(x * scale, y * scale, scale, scale).fill(color);
    }
  }
  const width = Math.max(...options.rows.map((r) => r.length));
  g.position.set((-width * scale) / 2, (-height * scale) / 2);
  root.addChild(g);
  return root;
}
