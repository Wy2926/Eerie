import { Graphics } from 'pixi.js';

/** XP 掉落方块：普通绿色，高额蓝色并更大。 */
export function createXpGemView(amount: number): Graphics {
  const g = new Graphics();
  const size = amount > 1 ? 8 : 6;
  g.rect(-size / 2, -size / 2, size, size).fill(amount > 1 ? 0x64d8ff : 0x7fe07f);
  return g;
}
