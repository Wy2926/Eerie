import Matter from 'matter-js';
import type { Entity } from '../ecs/world';

export interface CollisionEvent {
  entityA: Entity;
  entityB: Entity;
}

/**
 * Owns the Matter.js engine. Body creation, destruction and stepping are
 * centralized here; collision callbacks only collect events for systems
 * to consume — they never mutate gameplay state.
 */
export class PhysicsWorld {
  readonly engine: Matter.Engine;
  private bodies = new Map<Entity, Matter.Body>();
  private bodyToEntity = new Map<number, Entity>();
  private pendingCollisions: CollisionEvent[] = [];

  constructor() {
    this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        const a = this.bodyToEntity.get(pair.bodyA.id);
        const b = this.bodyToEntity.get(pair.bodyB.id);
        if (a !== undefined && b !== undefined) {
          this.pendingCollisions.push({ entityA: a, entityB: b });
        }
      }
    });
  }

  addBody(entity: Entity, body: Matter.Body): void {
    this.bodies.set(entity, body);
    this.bodyToEntity.set(body.id, entity);
    Matter.Composite.add(this.engine.world, body);
  }

  getBody(entity: Entity): Matter.Body | undefined {
    return this.bodies.get(entity);
  }

  removeBody(entity: Entity): void {
    const body = this.bodies.get(entity);
    if (body) {
      Matter.Composite.remove(this.engine.world, body);
      this.bodyToEntity.delete(body.id);
      this.bodies.delete(entity);
    }
  }

  /** Must be called with the fixed timestep delta only. */
  step(fixedDeltaMs: number): void {
    Matter.Engine.update(this.engine, fixedDeltaMs);
  }

  drainCollisions(): CollisionEvent[] {
    const events = this.pendingCollisions;
    this.pendingCollisions = [];
    return events;
  }

  get bodyCount(): number {
    return this.bodies.size;
  }
}
