import type { System, World } from '../../core/ecs/world';
import { TransformC } from '../components';
import { AttackAreaC, DamageInboxC, EnemyTagC } from '../components/gameplay';

function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return Math.abs(d);
}

/** 攻击区域（刀光/刀气/拖尾）对敌人的几何命中判定，产生伤害事件。 */
export class AttackHitSystem implements System {
  readonly name = 'AttackHitSystem';

  constructor(private damageInboxEntity: number) {}

  update(world: World, dt: number): void {
    const inbox = world.getComponent(this.damageInboxEntity, DamageInboxC)!;
    const enemies = world.query(EnemyTagC, TransformC);
    for (const attackEntity of world.query(AttackAreaC)) {
      const area = world.getComponent(attackEntity, AttackAreaC)!;
      if (area.vx !== 0 || area.vy !== 0) {
        area.x += (area.vx * dt) / 1000;
        area.y += (area.vy * dt) / 1000;
        const t = world.getComponent(attackEntity, TransformC);
        if (t) {
          t.x = area.x;
          t.y = area.y;
        }
      }
      for (const enemy of enemies) {
        if (area.hitEntities.has(enemy)) continue;
        const et = world.getComponent(enemy, TransformC)!;
        const dx = et.x - area.x;
        const dy = et.y - area.y;
        const dist = Math.hypot(dx, dy);
        let hit = false;
        if (area.shape === 'circle') {
          hit = dist <= area.radius + 12;
        } else {
          hit = dist <= area.radius + 12 && angleDiff(Math.atan2(dy, dx), area.angle) <= area.arc / 2 + 0.2;
        }
        if (hit) {
          area.hitEntities.add(enemy);
          inbox.events.push({ target: enemy, amount: area.damage, fromPlayerHit: area.fromPlayerHit });
        }
      }
    }
  }
}
