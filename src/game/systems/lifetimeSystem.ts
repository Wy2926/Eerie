import type { System, World } from '../../core/ecs/world';
import { LifetimeC } from '../components';

export class LifetimeSystem implements System {
  readonly name = 'LifetimeSystem';

  update(world: World, dt: number): void {
    for (const entity of world.query(LifetimeC)) {
      const lifetime = world.getComponent(entity, LifetimeC)!;
      lifetime.remainingMs -= dt;
      if (lifetime.remainingMs <= 0) {
        world.destroyEntity(entity);
      }
    }
  }
}
