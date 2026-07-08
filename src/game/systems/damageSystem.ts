import Matter from 'matter-js';
import type { System, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import type { RenderLayers } from '../../core/render/pixiApp';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { CHARACTERS } from '../balance/characters';
import { ENEMIES } from '../balance/enemies';
import { STATUSES, XUEYU_SPLASH_RADIUS } from '../balance/status';
import { TransformC } from '../components';
import {
  DamageInboxC,
  EnemyTagC,
  HealthC,
  PlayerBuildC,
  PlayerTagC,
  StatusEffectsC,
} from '../components/gameplay';
import { spawnXp } from '../factories/entityFactory';
import type { GameState } from '../gameState';
import { resolveBuild } from './build';
import { applyStatus } from './statusSystem';

const CONTACT_DAMAGE_INTERVAL_MS = 500;

/**
 * 结算所有伤害事件：接触伤害、命中伤害、状态 tick、处决与死亡。
 * 碰撞回调只收集事件，本系统统一消费。
 */
export class DamageSystem implements System {
  readonly name = 'DamageSystem';
  private contactCooldown = new Map<number, number>();

  constructor(
    private state: GameState,
    private physics: PhysicsWorld,
    private views: ViewRegistry,
    private layers: RenderLayers,
    private damageInboxEntity: number,
  ) {}

  update(world: World, dt: number): void {
    for (const [entity, ms] of this.contactCooldown) {
      const next = ms - dt;
      if (next <= 0) this.contactCooldown.delete(entity);
      else this.contactCooldown.set(entity, next);
    }

    // 敌人-玩家接触伤害（来自 Matter 碰撞事件）
    for (const event of this.physics.drainCollisions()) {
      const pair = [event.entityA, event.entityB];
      for (const [self, other] of [
        [pair[0], pair[1]],
        [pair[1], pair[0]],
      ]) {
        if (!world.hasComponent(self, PlayerTagC) || !world.hasComponent(other, EnemyTagC)) continue;
        if (this.contactCooldown.has(other)) continue;
        this.contactCooldown.set(other, CONTACT_DAMAGE_INTERVAL_MS);
        const enemyCfg = ENEMIES[world.getComponent(other, EnemyTagC)!.enemyId];
        world.getComponent(this.damageInboxEntity, DamageInboxC)!.events.push({
          target: self,
          amount: enemyCfg.contactDamage,
          fromPlayerHit: false,
        });
      }
    }

    const players = world.query(PlayerTagC);
    const player = players[0];
    const playerBuild = player !== undefined ? world.getComponent(player, PlayerBuildC)! : undefined;
    const resolved = playerBuild ? resolveBuild(playerBuild) : undefined;
    const character = player !== undefined ? CHARACTERS[world.getComponent(player, PlayerTagC)!.characterId] : undefined;

    const inbox = world.getComponent(this.damageInboxEntity, DamageInboxC)!;
    const events = inbox.events;
    inbox.events = [];

    for (const event of events) {
      const health = world.getComponent(event.target, HealthC);
      if (!health || !world.isAlive(event.target)) continue;
      health.hp -= event.amount;

      const isEnemy = world.hasComponent(event.target, EnemyTagC);
      if (isEnemy && event.fromPlayerHit && resolved && character) {
        // 命中附加流血
        if (resolved.applyBleed) {
          applyStatus(world, event.target, 'bleed', resolved.bleedMaxStacks);
        }
        // 处决：流血敌人阈值可被规则兵法提高
        const bleeding = world.getComponent(event.target, StatusEffectsC)?.active.has('bleed') ?? false;
        const threshold = Math.max(
          character.executeThreshold,
          bleeding ? resolved.executeThresholdVsBleed : 0,
        );
        if (health.hp > 0 && health.hp / health.maxHp < threshold) {
          health.hp = 0;
          this.flashExecute(world, event.target);
        }
      }

      if (health.hp <= 0) {
        if (isEnemy) {
          this.onEnemyDeath(world, event.target, playerBuild?.synergies.has('xueyuZhuilie') ?? false, resolved?.bleedMaxStacks ?? 1);
        } else if (world.hasComponent(event.target, PlayerTagC)) {
          this.state.phase = 'defeat';
        }
      }
    }
  }

  private onEnemyDeath(world: World, entity: number, xueyuActive: boolean, bleedMaxStacks: number): void {
    const t = world.getComponent(entity, TransformC)!;
    const cfg = ENEMIES[world.getComponent(entity, EnemyTagC)!.enemyId];
    spawnXp(world, this.views, this.layers, t.x, t.y, cfg.xp);

    // 血狱追猎：流血敌人死亡向周围溅射流血
    const wasBleeding = world.getComponent(entity, StatusEffectsC)?.active.has('bleed') ?? false;
    if (xueyuActive && wasBleeding) {
      for (const other of world.query(EnemyTagC, TransformC, StatusEffectsC)) {
        if (other === entity) continue;
        const ot = world.getComponent(other, TransformC)!;
        if (Math.hypot(ot.x - t.x, ot.y - t.y) <= XUEYU_SPLASH_RADIUS) {
          applyStatus(world, other, 'bleed', bleedMaxStacks);
        }
      }
    }
    world.destroyEntity(entity);
  }

  private flashExecute(world: World, entity: number): void {
    const t = world.getComponent(entity, TransformC);
    const body = this.physics.getBody(entity);
    if (t && body) {
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
    }
    const view = this.views.get(entity);
    if (view) view.tint = STATUSES.bleed.color;
  }
}
