import type { System, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import type { ViewRegistry } from '../../core/render/viewRegistry';

/** Flushes pending entity destruction and releases their views and bodies. */
export class CleanupSystem implements System {
  readonly name = 'CleanupSystem';

  constructor(
    private views: ViewRegistry,
    private physics: PhysicsWorld,
  ) {}

  update(world: World): void {
    for (const entity of world.flushDestroyed()) {
      this.views.remove(entity);
      this.physics.removeBody(entity);
    }
  }
}
