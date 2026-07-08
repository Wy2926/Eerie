import Matter from 'matter-js';
import type { System, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import { ENEMIES } from '../balance/enemies';
import { TransformC } from '../components';
import { EnemyTagC, PlayerTagC } from '../components/gameplay';

export class EnemyAISystem implements System {
  readonly name = 'EnemyAISystem';

  constructor(private physics: PhysicsWorld) {}

  update(world: World): void {
    const players = world.query(PlayerTagC, TransformC);
    if (players.length === 0) return;
    const playerT = world.getComponent(players[0], TransformC)!;
    for (const entity of world.query(EnemyTagC, TransformC)) {
      const body = this.physics.getBody(entity);
      if (!body) continue;
      const tag = world.getComponent(entity, EnemyTagC)!;
      const speed = ENEMIES[tag.enemyId].moveSpeed;
      const t = world.getComponent(entity, TransformC)!;
      const dx = playerT.x - t.x;
      const dy = playerT.y - t.y;
      const dist = Math.hypot(dx, dy) || 1;
      Matter.Body.setVelocity(body, {
        x: (dx / dist) * (speed / 60),
        y: (dy / dist) * (speed / 60),
      });
    }
  }
}
