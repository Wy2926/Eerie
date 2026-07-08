import Matter from 'matter-js';
import { Graphics } from 'pixi.js';
import type { Entity, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import type { RenderLayers } from '../../core/render/pixiApp';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { CHARACTERS } from '../balance/characters';
import { ENEMIES } from '../balance/enemies';
import { WEAPONS } from '../balance/weapons';
import { xpForNextLevel } from '../balance/xp';
import { createJinyiweiView, createWokouView } from '../art/characters';
import { PhysicsRefC, RenderRefC, TransformC } from '../components';
import {
  EnemyTagC,
  FacingC,
  HealthC,
  PlayerBuildC,
  PlayerTagC,
  StatusEffectsC,
  WeaponStateC,
  XpPickupC,
} from '../components/gameplay';

const PLAYER_GROUP = -1;

export function spawnPlayer(
  world: World,
  views: ViewRegistry,
  physics: PhysicsWorld,
  layers: RenderLayers,
  characterId: string,
  x: number,
  y: number,
): Entity {
  const cfg = CHARACTERS[characterId];
  const entity = world.createEntity();
  world.addComponent(entity, TransformC, { x, y, rotation: 0 });
  world.addComponent(entity, RenderRefC, { layer: 'world' });
  world.addComponent(entity, PhysicsRefC, { hasBody: true });
  world.addComponent(entity, PlayerTagC, { characterId });
  world.addComponent(entity, HealthC, { hp: cfg.maxHp, maxHp: cfg.maxHp });
  world.addComponent(entity, FacingC, { angle: 0 });
  world.addComponent(entity, WeaponStateC, {
    weaponId: cfg.startingWeaponId,
    cooldownRemainingMs: WEAPONS[cfg.startingWeaponId].cooldownMs,
  });
  world.addComponent(entity, PlayerBuildC, {
    bingfa: new Map(),
    synergies: new Set(),
    level: 1,
    xp: 0,
    xpToNext: xpForNextLevel(1),
    pendingLevelUps: 0,
  });

  const view = createJinyiweiView();
  layers.world.addChild(view);
  views.set(entity, view);

  const body = Matter.Bodies.circle(x, y, 12, {
    frictionAir: 0,
    friction: 0,
    inertia: Infinity,
  });
  physics.addBody(entity, body);
  return entity;
}

export function spawnEnemy(
  world: World,
  views: ViewRegistry,
  physics: PhysicsWorld,
  layers: RenderLayers,
  enemyId: string,
  x: number,
  y: number,
): Entity {
  const cfg = ENEMIES[enemyId];
  const entity = world.createEntity();
  world.addComponent(entity, TransformC, { x, y, rotation: 0 });
  world.addComponent(entity, RenderRefC, { layer: 'world' });
  world.addComponent(entity, PhysicsRefC, { hasBody: true });
  world.addComponent(entity, EnemyTagC, { enemyId });
  world.addComponent(entity, HealthC, { hp: cfg.maxHp, maxHp: cfg.maxHp });
  world.addComponent(entity, StatusEffectsC, { active: new Map() });

  const view = createWokouView(3 * cfg.scale);
  layers.world.addChild(view);
  views.set(entity, view);

  const body = Matter.Bodies.circle(x, y, 10 * cfg.scale, {
    frictionAir: 0,
    friction: 0,
    inertia: Infinity,
  });
  physics.addBody(entity, body);
  return entity;
}

export function spawnXp(
  world: World,
  views: ViewRegistry,
  layers: RenderLayers,
  x: number,
  y: number,
  amount: number,
): Entity {
  const entity = world.createEntity();
  world.addComponent(entity, TransformC, { x, y, rotation: 0 });
  world.addComponent(entity, RenderRefC, { layer: 'world' });
  world.addComponent(entity, XpPickupC, { amount, magnetized: false });

  const g = new Graphics();
  const size = amount > 1 ? 8 : 6;
  g.rect(-size / 2, -size / 2, size, size).fill(amount > 1 ? 0x64d8ff : 0x7fe07f);
  layers.world.addChild(g);
  views.set(entity, g);
  return entity;
}

export { PLAYER_GROUP };
