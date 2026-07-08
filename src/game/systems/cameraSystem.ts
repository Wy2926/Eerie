import type { Container } from 'pixi.js';
import type { System, World } from '../../core/ecs/world';
import { TransformC } from '../components';
import { PlayerTagC } from '../components/gameplay';

/** 让 world 层跟随玩家（玩家保持屏幕中心）。 */
export class CameraSystem implements System {
  readonly name = 'CameraSystem';

  constructor(
    private worldLayer: Container,
    private vfxLayer: Container,
    private screenWidth: () => number,
    private screenHeight: () => number,
  ) {}

  update(world: World): void {
    const players = world.query(PlayerTagC, TransformC);
    if (players.length === 0) return;
    const t = world.getComponent(players[0], TransformC)!;
    const ox = Math.round(this.screenWidth() / 2 - t.x);
    const oy = Math.round(this.screenHeight() / 2 - t.y);
    this.worldLayer.position.set(ox, oy);
    this.vfxLayer.position.set(ox, oy);
  }
}
