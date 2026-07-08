import { Container, Graphics } from 'pixi.js';

/** Screen pixels per logical pixel of the pixel-art grid. */
export const PIXEL_SCALE = 4;

export interface PixelSpriteOptions {
  /** Rows of single-character color keys; ' ' or '.' means transparent. */
  rows: string[];
  palette: Record<string, number>;
  scale?: number;
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
