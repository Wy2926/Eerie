import type { System, World } from '../../core/ecs/world';
import type { RenderLayers } from '../../core/render/pixiApp';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { WEAPONS } from '../balance/weapons';
import { createSlashView, createTrailView } from '../art/slashVfx';
import { createSwordWaveView } from '../art/swordWaveVfx';
import { LifetimeC, RenderRefC, TransformC } from '../components';
import { AttackAreaC, EnemyTagC, FacingC, HealthC, PlayerBuildC, PlayerTagC, WeaponStateC } from '../components/gameplay';
import { resolveBuild, type ResolvedBuild } from './build';

const SWORD_WAVE_SPEED = 360;
const SWORD_WAVE_LIFETIME_MS = 500;
const TRAIL_LIFETIME_MS = 600;
/** 自动瞄准搜索半径 */
const AIM_RADIUS = 320;

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
      const aimAngle = this.aimAtNearestEnemy(world, t.x, t.y) ?? facing.angle;
      this.spawnSlash(world, t.x, t.y, aimAngle, cfg.damage, cfg.range, cfg.arc, build);
      if (build.doubleSlash) {
        this.spawnSlash(world, t.x, t.y, aimAngle + Math.PI, cfg.damage, cfg.range, cfg.arc, build);
      }
      if (build.swordWave) {
        this.spawnSwordWave(world, t.x, t.y, aimAngle, cfg.damage * 0.6, build);
      }
    }
  }

  /** 自动瞄准：朝最近的敌人方向攻击，无敌人时回退到移动朝向。 */
  private aimAtNearestEnemy(world: World, x: number, y: number): number | undefined {
    let bestDist = AIM_RADIUS;
    let bestAngle: number | undefined;
    for (const enemy of world.query(EnemyTagC, TransformC)) {
      const et = world.getComponent(enemy, TransformC)!;
      const dist = Math.hypot(et.x - x, et.y - y);
      if (dist < bestDist) {
        bestDist = dist;
        bestAngle = Math.atan2(et.y - y, et.x - x);
      }
    }
    return bestAngle;
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

    const g = createSlashView(range, angle, arc);
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
    const g = createTrailView(range, angle, arc);
    this.layers.vfx.addChild(g);
    this.views.set(entity, g);
  }

  private spawnSwordWave(world: World, x: number, y: number, angle: number, damage: number, build: ResolvedBuild): void {
    const entity = world.createEntity();
    world.addComponent(entity, TransformC, { x, y, rotation: 0 });
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
    const g = createSwordWaveView(angle);
    this.layers.vfx.addChild(g);
    this.views.set(entity, g);
  }
}
