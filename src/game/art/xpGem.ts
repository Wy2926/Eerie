import { Graphics } from 'pixi.js';

/**
 * XP 掉落成品：菱形玉髓——深色描边 + 主体色 + 左上高光切面。
 * 普通为翠玉绿，高额为琉璃蓝并带外圈微光。
 */
export function createXpGemView(amount: number): Graphics {
  const g = new Graphics();
  const big = amount > 1;
  const r = big ? 6 : 4.5;
  const body = big ? 0x4db8e8 : 0x63c96a;
  const dark = big ? 0x2a6e94 : 0x3a7a40;
  const light = big ? 0xbfe8ff : 0xc0f0c4;
  if (big) {
    g.poly([0, -r - 2, r + 2, 0, 0, r + 2, -r - 2, 0]).fill({ color: body, alpha: 0.25 });
  }
  g.poly([0, -r, r, 0, 0, r, -r, 0]).fill(dark);
  g.poly([0, -r + 1, r - 1, 0, 0, r - 1, -r + 1, 0]).fill(body);
  g.poly([0, -r + 1, r - 1, 0, 0, 0]).fill({ color: light, alpha: 0.9 });
  return g;
}
