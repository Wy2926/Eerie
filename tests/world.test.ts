import { describe, expect, it } from 'vitest';
import { defineComponent, World, type System } from '../src/core/ecs/world';

interface Pos {
  x: number;
}
interface Vel {
  v: number;
}

const PosC = defineComponent<Pos>('Pos');
const VelC = defineComponent<Vel>('Vel');

describe('World', () => {
  it('creates entities and queries by components', () => {
    const world = new World();
    const a = world.createEntity();
    const b = world.createEntity();
    world.addComponent(a, PosC, { x: 0 });
    world.addComponent(a, VelC, { v: 1 });
    world.addComponent(b, PosC, { x: 5 });

    expect(world.query(PosC)).toEqual([a, b]);
    expect(world.query(PosC, VelC)).toEqual([a]);
    expect(world.entityCount).toBe(2);
  });

  it('defers destruction until flush', () => {
    const world = new World();
    const a = world.createEntity();
    world.addComponent(a, PosC, { x: 0 });
    world.destroyEntity(a);
    expect(world.isAlive(a)).toBe(true);
    const destroyed = world.flushDestroyed();
    expect(destroyed).toEqual([a]);
    expect(world.isAlive(a)).toBe(false);
    expect(world.query(PosC)).toEqual([]);
  });

  it('runs systems in registration order and records timings', () => {
    const world = new World();
    const order: string[] = [];
    const makeSystem = (name: string): System => ({
      name,
      update: () => {
        order.push(name);
      },
    });
    world.addSystem(makeSystem('A'));
    world.addSystem(makeSystem('B'));
    world.update(16);
    expect(order).toEqual(['A', 'B']);
    expect(world.systemTimings.map((t) => t.name)).toEqual(['A', 'B']);
  });
});
