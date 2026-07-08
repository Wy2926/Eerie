import { Container, Graphics, Text } from 'pixi.js';
import type { World } from '../../core/ecs/world';
import { BINGFAS, type BingfaCategory } from '../balance/bingfa';
import { SYNERGIES } from '../balance/status';
import { RUN_DURATION_SEC } from '../balance/waves';
import { HUD_COLORS, createChoiceCard, drawBar, drawPanel } from '../art/hudFrames';
import { HealthC, PlayerBuildC, PlayerTagC } from '../components/gameplay';
import type { GameState } from '../gameState';

const CATEGORY_LABELS: Record<BingfaCategory, string> = {
  basic: '基础',
  'weapon-mod': '武器改造',
  status: '状态',
  rule: '规则',
  core: '核心',
};

const CATEGORY_COLORS: Record<BingfaCategory, number> = {
  basic: 0x8a9aa8,
  'weapon-mod': 0x4db8e8,
  status: 0xd63030,
  rule: 0xd4a941,
  core: 0xb56be8,
};

/**
 * 成品 HUD：描金玄黑面板体系——血条面板、顶部经验条、时刻牌、
 * 三选一兵法卡片（类别色签）、联动成型横幅与胜负画面。
 * 只读取 ECS/GameState，不写玩法状态（选择通过键盘由外部处理）。
 */
export class Hud {
  private root: Container;
  private hpPanel: Graphics;
  private hpText: Text;
  private levelText: Text;
  private xpBar: Graphics;
  private timePanel: Graphics;
  private timeText: Text;
  private choicePanel: Container;
  private bannerPanel: Container;
  private bannerText: Text;
  private endPanel: Container;
  private endText: Text;
  private endSubText: Text;

  constructor(
    parent: Container,
    private screenWidth: () => number,
    private screenHeight: () => number,
  ) {
    this.root = new Container();
    parent.addChild(this.root);

    this.hpPanel = new Graphics();
    this.xpBar = new Graphics();
    this.timePanel = new Graphics();
    this.root.addChild(this.xpBar, this.hpPanel, this.timePanel);

    this.hpText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 13, fill: HUD_COLORS.text },
    });
    this.levelText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 13, fill: HUD_COLORS.accent },
    });
    this.timeText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 20, fill: HUD_COLORS.text, fontWeight: 'bold' },
    });
    this.root.addChild(this.hpText, this.levelText, this.timeText);

    this.choicePanel = new Container();
    this.choicePanel.visible = false;
    this.root.addChild(this.choicePanel);

    this.bannerPanel = new Container();
    this.bannerText = new Text({
      text: '',
      style: {
        fontFamily: 'monospace',
        fontSize: 22,
        fill: HUD_COLORS.accent,
        align: 'center',
        fontWeight: 'bold',
      },
    });
    this.bannerPanel.visible = false;
    this.root.addChild(this.bannerPanel);

    this.endPanel = new Container();
    this.endText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 44, fill: HUD_COLORS.text, align: 'center', fontWeight: 'bold' },
    });
    this.endSubText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 16, fill: HUD_COLORS.accent, align: 'center' },
    });
    this.endPanel.visible = false;
    this.root.addChild(this.endPanel);
  }

  update(world: World, state: GameState): void {
    const w = this.screenWidth();
    const h = this.screenHeight();
    const players = world.query(PlayerTagC, HealthC, PlayerBuildC);
    if (players.length > 0) {
      const health = world.getComponent(players[0], HealthC)!;
      const build = world.getComponent(players[0], PlayerBuildC)!;

      this.hpPanel.clear();
      drawPanel(this.hpPanel, 12, h - 64, 248, 52, 0.85);
      drawBar(this.hpPanel, 22, h - 36, 228, 16, health.hp / health.maxHp, HUD_COLORS.hp, HUD_COLORS.hpDark);
      this.hpText.text = `${Math.max(0, Math.ceil(health.hp))} / ${health.maxHp}`;
      this.hpText.position.set(22, h - 58);
      this.levelText.text = `Lv.${build.level}`;
      this.levelText.position.set(250 - this.levelText.width, h - 58);

      this.xpBar.clear();
      drawBar(this.xpBar, 0, 0, w, 10, build.xp / build.xpToNext, HUD_COLORS.xp, HUD_COLORS.xpDark);
    }

    const totalSec = Math.floor(state.elapsedMs / 1000);
    const remain = Math.max(0, RUN_DURATION_SEC - totalSec);
    this.timeText.text = `${String(Math.floor(remain / 60)).padStart(2, '0')}:${String(remain % 60).padStart(2, '0')}`;
    this.timePanel.clear();
    drawPanel(this.timePanel, w / 2 - 48, 16, 96, 34, 0.85);
    this.timeText.position.set(w / 2 - this.timeText.width / 2, 22);

    this.choicePanel.visible = state.phase === 'choosing';

    if (state.formedSynergyId && state.formedSynergyMsRemaining > 0) {
      const synergy = SYNERGIES[state.formedSynergyId];
      this.bannerText.text = `兵法联动成型：${synergy.name}！\n${synergy.description}`;
      this.bannerPanel.visible = true;
      this.bannerPanel.removeChildren();
      const bg = new Graphics();
      drawPanel(bg, 0, 0, this.bannerText.width + 48, this.bannerText.height + 28, 0.92);
      this.bannerText.position.set(24, 14);
      this.bannerPanel.addChild(bg, this.bannerText);
      this.bannerPanel.position.set(w / 2 - (this.bannerText.width + 48) / 2, 84);
    } else {
      this.bannerPanel.visible = false;
    }

    if (state.phase === 'victory' || state.phase === 'defeat') {
      this.endPanel.visible = true;
      this.endPanel.removeChildren();
      this.endText.text = state.phase === 'victory' ? '大捷！倭寇溃退' : '力战殉国';
      this.endSubText.text = state.phase === 'victory' ? '海疆暂靖，另择兵法再战' : '刷新页面，重整旗鼓';
      const dim = new Graphics();
      dim.rect(0, 0, w, h).fill({ color: 0x0a0a0e, alpha: 0.6 });
      const panelW = Math.max(this.endText.width, this.endSubText.width) + 96;
      const panel = new Graphics();
      drawPanel(panel, w / 2 - panelW / 2, h / 2 - 80, panelW, 150);
      this.endText.position.set(w / 2 - this.endText.width / 2, h / 2 - 56);
      this.endSubText.position.set(w / 2 - this.endSubText.width / 2, h / 2 + 16);
      this.endPanel.addChild(dim, panel, this.endText, this.endSubText);
    }
  }

  showChoices(choices: string[]): void {
    this.choicePanel.removeChildren();
    const w = this.screenWidth();
    const cardW = 360;
    const cardH = 84;

    const title = new Text({
      text: '升 级 · 选 择 兵 法（按 1 / 2 / 3）',
      style: { fontFamily: 'monospace', fontSize: 20, fill: HUD_COLORS.accent, fontWeight: 'bold' },
    });
    const titleBg = new Graphics();
    drawPanel(titleBg, w / 2 - title.width / 2 - 20, 132, title.width + 40, 40, 0.9);
    title.position.set(w / 2 - title.width / 2, 142);
    this.choicePanel.addChild(titleBg, title);

    choices.forEach((id, i) => {
      const cfg = BINGFAS[id];
      const card = createChoiceCard(
        cardW,
        cardH,
        i,
        CATEGORY_LABELS[cfg.category],
        CATEGORY_COLORS[cfg.category],
        cfg.name,
        cfg.description,
      );
      card.root.position.set(w / 2 - cardW / 2, 192 + i * (cardH + 14));
      this.choicePanel.addChild(card.root);
    });
  }
}
