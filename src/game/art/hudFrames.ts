import { Container, Graphics, Text } from 'pixi.js';
import { sin01 } from './anim';

/** HUD 主题色：玄黑底、金饰边、宣纸白文字。 */
export const HUD_COLORS = {
  panel: 0x14141a,
  panelBorder: 0xd4a941,
  panelBorderDark: 0x6e5624,
  text: 0xf5f0e6,
  accent: 0xffd76b,
  hp: 0xd63030,
  hpDark: 0x5e1616,
  xp: 0x63c96a,
  xpDark: 0x25502a,
};

/**
 * 双线描金面板：外金线 + 内暗金线 + 半透明玄黑底。
 * 传入 time（秒）时金边会随时间呼吸微闪，四角描金点缓慢脉冲。
 */
export function drawPanel(g: Graphics, x: number, y: number, w: number, h: number, alpha = 0.92, time?: number): Graphics {
  const shimmer = time !== undefined ? 0.75 + sin01(time, 0.4) * 0.25 : 1;
  g.rect(x, y, w, h).fill({ color: HUD_COLORS.panel, alpha });
  g.rect(x, y, w, h).stroke({ color: HUD_COLORS.panelBorder, width: 2, alpha: shimmer });
  g.rect(x + 3, y + 3, w - 6, h - 6).stroke({ color: HUD_COLORS.panelBorderDark, width: 1 });
  if (time !== undefined) {
    const pulse = sin01(time, 0.7);
    const cornerAlpha = 0.5 + pulse * 0.5;
    for (const [cx, cy] of [
      [x + 1, y + 1],
      [x + w - 3, y + 1],
      [x + 1, y + h - 3],
      [x + w - 3, y + h - 3],
    ]) {
      g.rect(cx, cy, 2, 2).fill({ color: HUD_COLORS.accent, alpha: cornerAlpha });
    }
  }
  return g;
}

/** 带描边与刻度的资源条（血条/经验条通用）。 */
export function drawBar(
  g: Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  ratio: number,
  color: number,
  darkColor: number,
  time?: number,
): Graphics {
  g.rect(x, y, w, h).fill(0x0d0d12);
  const fillW = Math.max(0, Math.min(1, ratio)) * (w - 4);
  if (fillW > 0) {
    g.rect(x + 2, y + 2, fillW, h - 4).fill(darkColor);
    g.rect(x + 2, y + 2, fillW, Math.max(1, (h - 4) * 0.45)).fill(color);
    // 条头光标：随时间闪烁，提示当前进度位置
    if (time !== undefined && fillW > 3) {
      g.rect(x + fillW - 1, y + 2, 3, h - 4).fill({ color: 0xffffff, alpha: 0.25 + sin01(time, 2.2) * 0.4 });
    }
  }
  g.rect(x, y, w, h).stroke({ color: HUD_COLORS.panelBorderDark, width: 1 });
  // 四等分刻度
  for (let i = 1; i < 4; i++) {
    g.rect(x + (w / 4) * i, y + 1, 1, h - 2).fill({ color: 0x0d0d12, alpha: 0.6 });
  }
  return g;
}

export interface ChoiceCard {
  root: Container;
  bg: Graphics;
}

/** 兵法三选一卡片：描金面板 + 类别色签 + 序号、名称、描述文字。 */
export function createChoiceCard(
  width: number,
  height: number,
  index: number,
  categoryLabel: string,
  categoryColor: number,
  name: string,
  description: string,
): ChoiceCard {
  const root = new Container();
  const bg = new Graphics();
  drawPanel(bg, 0, 0, width, height);
  // 类别色签（左侧竖条）
  bg.rect(3, 3, 5, height - 6).fill(categoryColor);
  root.addChild(bg);

  const keyText = new Text({
    text: String(index + 1),
    style: { fontFamily: 'monospace', fontSize: 22, fill: HUD_COLORS.accent, fontWeight: 'bold' },
  });
  keyText.position.set(16, height / 2 - keyText.height / 2);
  const nameText = new Text({
    text: `${name}  ·  ${categoryLabel}`,
    style: { fontFamily: 'monospace', fontSize: 16, fill: HUD_COLORS.accent },
  });
  nameText.position.set(42, 10);
  const descText = new Text({
    text: description,
    style: {
      fontFamily: 'monospace',
      fontSize: 13,
      fill: HUD_COLORS.text,
      wordWrap: true,
      wordWrapWidth: width - 54,
    },
  });
  descText.position.set(42, 34);
  root.addChild(keyText, nameText, descText);
  return { root, bg };
}
