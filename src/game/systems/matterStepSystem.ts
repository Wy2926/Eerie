import type { System, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import { PhysicsRefC, TransformC } from '../components';

/** Steps Matter with the fixed delta and copies body positions back to Transform. */
export class MatterStepSystem implements System {
  readonly name = 'MatterStepSystem';

  constructor(private physics: PhysicsWorld) {}

  update(world: World, dt: number): void {
    this.physics.step(dt);
    for (const entity of world.query(TransformC, PhysicsRefC)) {
      const body = this.physics.getBody(entity);
      if (!body) continue;
      const t = world.getComponent(entity, TransformC)!;
      t.x = body.position.x;
      t.y = body.position.y;
      t.rotation = body.angle;
    }
  }
}
