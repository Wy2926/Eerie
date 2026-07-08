import Matter from 'matter-js';
import type { System, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import { CHARACTERS } from '../balance/characters';
import { FacingC, PlayerTagC } from '../components/gameplay';
import type { InputState } from './inputSystem';

export class PlayerIntentSystem implements System {
  readonly name = 'PlayerIntentSystem';

  constructor(
    private input: InputState,
    private physics: PhysicsWorld,
  ) {}

  update(world: World): void {
    for (const entity of world.query(PlayerTagC, FacingC)) {
      const tag = world.getComponent(entity, PlayerTagC)!;
      const speed = CHARACTERS[tag.characterId].moveSpeed;
      const body = this.physics.getBody(entity);
      if (!body) continue;
      const move = this.input.moveVector;
      Matter.Body.setVelocity(body, {
        x: (move.x * speed) / 60,
        y: (move.y * speed) / 60,
      });
      if (move.x !== 0 || move.y !== 0) {
        world.getComponent(entity, FacingC)!.angle = Math.atan2(move.y, move.x);
      }
    }
  }
}
