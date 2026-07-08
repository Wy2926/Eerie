import Matter from 'matter-js';
import type { Entity, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import type { RenderLayers } from '../../core/render/pixiApp';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { createPixelSprite } from '../art/pixelSprite';
import { PhysicsRefC, RenderRefC, TransformC, VelocityC } from '../components';

const DEMO_PALETTE = {
  r: 0xc0392b,
  k: 0x1b1b22,
  g: 0xd4a941,
  s: 0xe8c9a0,
};

const DEMO_ROWS = [
  '..kkkk..',
  '.kssssk.',
  '.ksksks.',
  '.kssssk.',
  'rrrrrrrr',
  'rrgrrgrr',
  'rrrrrrrr',
  '.rr..rr.',
];

/**
 * Spawns a placeholder chibi pixel figure that drifts and bounces via Matter,
 * proving ECS + render + physics wiring end to end.
 */
export function spawnDemoEntity(
  world: World,
  views: ViewRegistry,
  physics: PhysicsWorld,
  layers: RenderLayers,
  x: number,
  y: number,
  vx: number,
  vy: number,
): Entity {
  const entity = world.createEntity();
  world.addComponent(entity, TransformC, { x, y, rotation: 0 });
  world.addComponent(entity, VelocityC, { vx, vy });
  world.addComponent(entity, RenderRefC, { layer: 'world' });
  world.addComponent(entity, PhysicsRefC, { hasBody: true });

  const view = createPixelSprite({ rows: DEMO_ROWS, palette: DEMO_PALETTE });
  layers.world.addChild(view);
  views.set(entity, view);

  const body = Matter.Bodies.rectangle(x, y, 32, 32, {
    frictionAir: 0,
    friction: 0,
    restitution: 1,
  });
  Matter.Body.setVelocity(body, { x: vx / 60, y: vy / 60 });
  physics.addBody(entity, body);

  return entity;
}

export function spawnArenaWalls(physics: PhysicsWorld, world: World, width: number, height: number): void {
  const thickness = 60;
  const options: Matter.IChamferableBodyDefinition = { isStatic: true, restitution: 1 };
  const walls = [
    Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, options),
    Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, options),
    Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, options),
    Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, options),
  ];
  for (const wall of walls) {
    physics.addBody(world.createEntity(), wall);
  }
}
