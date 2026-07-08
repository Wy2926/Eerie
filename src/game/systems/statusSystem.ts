import type { System, World } from '../../core/ecs/world';
import { STATUS_TICK_MS, STATUSES } from '../balance/status';
import { DamageInboxC, StatusEffectsC } from '../components/gameplay';

/** 独立结算所有状态的持续时间与 tick 伤害。 */
export class StatusSystem implements System {
  readonly name = 'StatusSystem';

  constructor(private damageInboxEntity: number) {}

  update(world: World, dt: number): void {
    const inbox = world.getComponent(this.damageInboxEntity, DamageInboxC)!;
    for (const entity of world.query(StatusEffectsC)) {
      const effects = world.getComponent(entity, StatusEffectsC)!;
      for (const [statusId, state] of effects.active) {
        const cfg = STATUSES[statusId];
        state.remainingMs -= dt;
        state.tickAccMs += dt;
        while (state.tickAccMs >= STATUS_TICK_MS) {
          state.tickAccMs -= STATUS_TICK_MS;
          inbox.events.push({
            target: entity,
            amount: cfg.tickDamage * state.stacks,
            fromPlayerHit: false,
          });
        }
        if (state.remainingMs <= 0) {
          effects.active.delete(statusId);
        }
      }
    }
  }
}

export function applyStatus(world: World, entity: number, statusId: string, maxStacks: number): void {
  const effects = world.getComponent(entity, StatusEffectsC);
  if (!effects) return;
  const cfg = STATUSES[statusId];
  const existing = effects.active.get(statusId);
  if (existing) {
    existing.remainingMs = cfg.durationMs;
    existing.stacks = Math.min(maxStacks, existing.stacks + 1);
  } else {
    effects.active.set(statusId, { remainingMs: cfg.durationMs, stacks: 1, tickAccMs: 0 });
  }
}
