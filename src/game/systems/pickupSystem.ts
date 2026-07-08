import type { System, World } from '../../core/ecs/world';
import { CHARACTERS } from '../balance/characters';
import { XP_MAGNET_SPEED, xpForNextLevel } from '../balance/xp';
import { TransformC } from '../components';
import { PlayerBuildC, PlayerTagC, XpPickupC } from '../components/gameplay';

export class PickupSystem implements System {
  readonly name = 'PickupSystem';

  update(world: World, dt: number): void {
    const players = world.query(PlayerTagC, TransformC, PlayerBuildC);
    if (players.length === 0) return;
    const player = players[0];
    const playerT = world.getComponent(player, TransformC)!;
    const build = world.getComponent(player, PlayerBuildC)!;
    const pickupRadius = CHARACTERS[world.getComponent(player, PlayerTagC)!.characterId].pickupRadius;

    for (const entity of world.query(XpPickupC, TransformC)) {
      const pickup = world.getComponent(entity, XpPickupC)!;
      const t = world.getComponent(entity, TransformC)!;
      const dx = playerT.x - t.x;
      const dy = playerT.y - t.y;
      const dist = Math.hypot(dx, dy);
      if (!pickup.magnetized && dist <= pickupRadius) {
        pickup.magnetized = true;
      }
      if (pickup.magnetized) {
        const step = (XP_MAGNET_SPEED * dt) / 1000;
        if (dist <= step + 14) {
          build.xp += pickup.amount;
          while (build.xp >= build.xpToNext) {
            build.xp -= build.xpToNext;
            build.level += 1;
            build.xpToNext = xpForNextLevel(build.level);
            build.pendingLevelUps += 1;
          }
          world.destroyEntity(entity);
        } else {
          t.x += (dx / dist) * step;
          t.y += (dy / dist) * step;
        }
      }
    }
  }
}
