import { Container, Graphics, Text } from 'pixi.js';
import type { World } from '../../core/ecs/world';
import { BINGFAS } from '../balance/bingfa';
import { SYNERGIES } from '../balance/status';
import { RUN_DURATION_SEC } from '../balance/waves';
import { HealthC, PlayerBuildC, PlayerTagC } from '../components/gameplay';
import type { GameState } from '../gameState';

/**
 * DOM 无关的最小 HUD：血条、经验条、计时、三选一面板、联动成型提示、胜负画面。
 * 只读取 ECS/GameState，不写玩法状态（选择结果通过回调交给外部）。
 */
export class Hud {
  private root: Container;
  private hpBar: Graphics;
  private xpBar: Graphics;
  private timeText: Text;
  private choicePanel: Container;
  private choiceTexts: Text[] = [];
  private banner: Text;
  private endText: Text;

  constructor(
    parent: Container,
    private screenWidth: () => number,
    private screenHeight: () => number,
  ) {
    this.root = new Container();
    parent.addChild(this.root);

    this.hpBar = new Graphics();
    this.xpBar = new Graphics();
    this.root.addChild(this.hpBar, this.xpBar);

    this.timeText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 18, fill: 0xf5f0e6 },
    });
    this.root.addChild(this.timeText);

    this.choicePanel = new Container();
    this.choicePanel.visible = false;
    this.root.addChild(this.choicePanel);

    this.banner = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 26, fill: 0xffd76b, align: 'center' },
    });
    this.banner.visible = false;
    this.root.addChild(this.banner);

    this.endText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 40, fill: 0xf5f0e6, align: 'center' },
    });
    this.endText.visible = false;
    this.root.addChild(this.endText);
  }

  update(world: World, state: GameState): void {
    const w = this.screenWidth();
    const players = world.query(PlayerTagC, HealthC, PlayerBuildC);
    if (players.length > 0) {
      const health = world.getComponent(players[0], HealthC)!;
      const build = world.getComponent(players[0], PlayerBuildC)!;

      this.hpBar.clear();
      this.hpBar
        .rect(16, this.screenHeight() - 40, 200, 14)
        .fill(0x3a3a44)
        .rect(16, this.screenHeight() - 40, 200 * Math.max(0, health.hp / health.maxHp), 14)
        .fill(0xd63030);

      this.xpBar.clear();
      this.xpBar
        .rect(0, 0, w, 8)
        .fill(0x3a3a44)
        .rect(0, 0, w * Math.min(1, build.xp / build.xpToNext), 8)
        .fill(0x7fe07f);
    }

    const totalSec = Math.floor(state.elapsedMs / 1000);
    const remain = Math.max(0, RUN_DURATION_SEC - totalSec);
    this.timeText.text = `${String(Math.floor(remain / 60)).padStart(2, '0')}:${String(remain % 60).padStart(2, '0')}`;
    this.timeText.position.set(w / 2 - 25, 16);

    this.choicePanel.visible = state.phase === 'choosing';

    if (state.formedSynergyId && state.formedSynergyMsRemaining > 0) {
      this.banner.visible = true;
      this.banner.text = `兵法联动成型：${SYNERGIES[state.formedSynergyId].name}！\n${SYNERGIES[state.formedSynergyId].description}`;
      this.banner.position.set(w / 2 - this.banner.width / 2, 90);
    } else {
      this.banner.visible = false;
    }

    if (state.phase === 'victory' || state.phase === 'defeat') {
      this.endText.visible = true;
      this.endText.text = state.phase === 'victory' ? '大捷！倭寇溃退' : '力战殉国';
      this.endText.position.set(w / 2 - this.endText.width / 2, this.screenHeight() / 2 - 40);
    }
  }

  showChoices(choices: string[]): void {
    this.choicePanel.removeChildren();
    this.choiceTexts = [];
    const w = this.screenWidth();
    const panelW = 320;
    const title = new Text({
      text: '升级！选择兵法（按 1 / 2 / 3）',
      style: { fontFamily: 'monospace', fontSize: 20, fill: 0xffd76b },
    });
    title.position.set(w / 2 - title.width / 2, 150);
    this.choicePanel.addChild(title);
    choices.forEach((id, i) => {
      const cfg = BINGFAS[id];
      const bg = new Graphics();
      bg.rect(w / 2 - panelW / 2, 200 + i * 90, panelW, 76).fill({ color: 0x1b1b22, alpha: 0.92 });
      bg.rect(w / 2 - panelW / 2, 200 + i * 90, panelW, 76).stroke({ color: 0xd4a941, width: 2 });
      const text = new Text({
        text: `${i + 1}. [${cfg.category}] ${cfg.name}\n${cfg.description}`,
        style: { fontFamily: 'monospace', fontSize: 15, fill: 0xf5f0e6, wordWrap: true, wordWrapWidth: panelW - 24 },
      });
      text.position.set(w / 2 - panelW / 2 + 12, 210 + i * 90);
      this.choicePanel.addChild(bg, text);
      this.choiceTexts.push(text);
    });
  }
}
