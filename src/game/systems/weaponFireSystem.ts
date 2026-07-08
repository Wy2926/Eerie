import { Graphics } from 'pixi.js';
import type { System, World } from '../../core/ecs/world';
import type { RenderLayers } from '../../core/render/pixiApp';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { WEAPONS } from '../balance/weapons';
import { LifetimeC, RenderRefC, TransformC } from '../components';
import { AttackAreaC, FacingC, HealthC, PlayerBuildC, PlayerTagC, WeaponStateC } from '../components/gameplay';
import { resolveBuild, type ResolvedBuild } from './build';

const SWORD_WAVE_SPEED = 360;
const SWORD_WAVE_LIFETIME_MS = 500;
const TRAIL_LIFETIME_MS = 600;

export class WeaponFireSystem implements System {
  readonly name = 'WeaponFireSystem';

  constructor(
    private views: ViewRegistry,
    private layers: RenderLayers,
  ) {}

  update(world: World, dt: number): void {
    for (const entity of world.query(PlayerTagC, WeaponStateC, FacingC, TransformC, PlayerBuildC)) {
      const weapon = world.getComponent(entity, WeaponStateC)!;
      const cfg = WEAPONS[weapon.weaponId];
      const build = resolveBuild(world.getComponent(entity, PlayerBuildC)!);

      let cooldownMul = build.cooldownMul;
      if (build.yuezhanYueyong) {
        const health = world.getComponent(entity, HealthC)!;
        const missingRatio = 1 - health.hp / health.maxHp;
        cooldownMul *= 1 - Math.min(0.4, missingRatio * 0.4);
      }

      weapon.cooldownRemainingMs -= dt;
      if (weapon.cooldownRemainingMs > 0) continue;
      weapon.cooldownRemainingMs = cfg.cooldownMs * cooldownMul;

      const t = world.getComponent(entity, TransformC)!;
      const facing = world.getComponent(entity, FacingC)!;
      this.spawnSlash(world, t.x, t.y, facing.angle, cfg.damage, cfg.range, cfg.arc, build);
      if (build.doubleSlash) {
        this.spawnSlash(world, t.x, t.y, facing.angle + Math.PI, cfg.damage, cfg.range, cfg.arc, build);
      }
      if (build.swordWave) {
        this.spawnSwordWave(world, t.x, t.y, facing.angle, cfg.damage * 0.6, build);
      }
    }
  }

  private spawnSlash(
    world: World,
    x: number,
    y: number,
    angle: number,
    baseDamage: number,
    baseRange: number,
    baseArc: number,
    build: ResolvedBuild,
  ): void {
    const damage = baseDamage * build.damageMul;
    const range = baseRange * build.rangeMul;
    const arc = baseArc * build.arcMul;
    const entity = world.createEntity();
    world.addComponent(entity, TransformC, { x, y, rotation: 0 });
    world.addComponent(entity, RenderRefC, { layer: 'vfx' });
    world.addComponent(entity, LifetimeC, { remainingMs: 150 });
    world.addComponent(entity, AttackAreaC, {
      damage,
      fromPlayerHit: true,
      hitEntities: new Set(),
      shape: 'sector',
      x,
      y,
      radius: range,
      angle,
      arc,
      vx: 0,
      vy: 0,
    });

    const g = new Graphics();
    g.moveTo(0, 0)
      .arc(0, 0, range, angle - arc / 2, angle + arc / 2)
      .lineTo(0, 0)
      .fill({ color: 0xf5f0e6, alpha: 0.45 });
    this.layers.vfx.addChild(g);
    this.views.set(entity, g);

    if (build.trail) {
      this.spawnTrail(world, x, y, angle, damage * 0.3, range, arc);
    }
  }

  private spawnTrail(
    world: World,
    x: number,
    y: number,
    angle: number,
    damage: number,
    range: number,
    arc: number,
  ): void {
    const entity = world.createEntity();
    world.addComponent(entity, TransformC, { x, y, rotation: 0 });
    world.addComponent(entity, RenderRefC, { layer: 'vfx' });
    world.addComponent(entity, LifetimeC, { remainingMs: TRAIL_LIFETIME_MS });
    world.addComponent(entity, AttackAreaC, {
      damage,
      fromPlayerHit: false,
      hitEntities: new Set(),
      shape: 'sector',
      x,
      y,
      radius: range,
      angle,
      arc,
      vx: 0,
      vy: 0,
    });
    const g = new Graphics();
    g.moveTo(0, 0)
      .arc(0, 0, range, angle - arc / 2, angle + arc / 2)
      .lineTo(0, 0)
      .fill({ color: 0xd63030, alpha: 0.18 });
    this.layers.vfx.addChild(g);
    this.views.set(entity, g);
  }

  private spawnSwordWave(world: World, x: number, y: number, angle: number, damage: number, build: ResolvedBuild): void {
    const entity = world.createEntity();
    world.addComponent(entity, TransformC, { x, y, rotation: angle });
    world.addComponent(entity, RenderRefC, { layer: 'vfx' });
    world.addComponent(entity, LifetimeC, { remainingMs: SWORD_WAVE_LIFETIME_MS });
    world.addComponent(entity, AttackAreaC, {
      damage: damage * build.damageMul,
      fromPlayerHit: true,
      hitEntities: new Set(),
      shape: 'circle',
      x,
      y,
      radius: 18,
      angle,
      arc: 0,
      vx: Math.cos(angle) * SWORD_WAVE_SPEED,
      vy: Math.sin(angle) * SWORD_WAVE_SPEED,
    });
    const g = new Graphics();
    g.arc(0, 0, 16, angle - 0.6, angle + 0.6).stroke({ color: 0xbfe8ff, width: 4, alpha: 0.9 });
    this.layers.vfx.addChild(g);
    this.views.set(entity, g);
  }
}
