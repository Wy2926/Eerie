import type { System, World } from '../../core/ecs/world';
import { TransformC, VelocityC } from '../components';

export class MovementSystem implements System {
  readonly name = 'MovementSystem';

  update(world: World, dt: number): void {
    for (const entity of world.query(TransformC, VelocityC)) {
      const t = world.getComponent(entity, TransformC)!;
      const v = world.getComponent(entity, VelocityC)!;
      t.x += (v.vx * dt) / 1000;
      t.y += (v.vy * dt) / 1000;
    }
  }
}
