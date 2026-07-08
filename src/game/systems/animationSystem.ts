import type { Entity, World } from '../../core/ecs/world';
import type { CharacterView, CharacterVisual, VfxView } from '../art/animatedView';
import { TransformC } from '../components';
import { AnimStateC, DyingC } from '../components/animation';
import { FacingC, HealthC } from '../components/gameplay';

interface VfxEntry {
  view: VfxView;
  elapsedMs: number;
  totalMs: number;
}

/**
 * 动画系统（帧阶段，不进 fixed timestep）：
 * 从 ECS 状态推导每个角色的动画状态机（Idle/Run/Attack/Hit/Death），
 * 以全局时间驱动所有已注册视图逐帧更新；特效按生命周期进度推进。
 * 视图注册表只存渲染对象，玩法状态始终以 ECS 为准。
 */
export class AnimationSystem {
  readonly name = 'AnimationSystem';
  private characters = new Map<Entity, CharacterView>();
  private vfx = new Map<Entity, VfxEntry>();
  private timeMs = 0;

  registerCharacter(entity: Entity, view: CharacterView): void {
    this.characters.set(entity, view);
  }

  registerVfx(entity: Entity, view: VfxView, totalMs: number): void {
    this.vfx.set(entity, { view, elapsedMs: 0, totalMs });
  }

  update(world: World, dtMs: number): void {
    this.timeMs += dtMs;
    const time = this.timeMs / 1000;

    for (const [entity, view] of this.characters) {
      if (!world.isAlive(entity)) {
        this.characters.delete(entity);
        continue;
      }
      const anim = world.getComponent(entity, AnimStateC);
      const t = world.getComponent(entity, TransformC);
      if (!anim || !t) continue;

      // 视觉移动速度：由位置差推导（ECS 是唯一状态源）
      const dist = Math.hypot(t.x - anim.prevX, t.y - anim.prevY);
      const speed = dtMs > 0 ? (dist * 1000) / dtMs : 0;
      const moveSpeed = Math.min(1, speed / anim.maxSpeed);
      if (dist > 0.5) {
        anim.facing = Math.atan2(t.y - anim.prevY, t.x - anim.prevX);
      }
      anim.prevX = t.x;
      anim.prevY = t.y;

      const facingC = world.getComponent(entity, FacingC);
      const facing = facingC ? facingC.angle : anim.facing;

      anim.attackMs = Math.max(0, anim.attackMs - dtMs);
      anim.hitMs = Math.max(0, anim.hitMs - dtMs);

      const health = world.getComponent(entity, HealthC);
      const healthRatio = health ? Math.max(0, health.hp / health.maxHp) : 1;

      const dying = world.getComponent(entity, DyingC);
      let visual: CharacterVisual;
      if (dying) {
        dying.elapsedMs += dtMs;
        const p = Math.min(1, dying.elapsedMs / dying.totalMs);
        visual = { time, state: 'death', stateTime: dying.elapsedMs / 1000, stateProgress: p, facing, moveSpeed: 0, healthRatio: 0 };
      } else if (anim.hitMs > 0) {
        const p = 1 - anim.hitMs / 200;
        visual = { time, state: 'hit', stateTime: p * 0.2, stateProgress: p, facing, moveSpeed, healthRatio };
      } else if (anim.attackMs > 0) {
        const p = 1 - anim.attackMs / anim.attackDurationMs;
        visual = { time, state: 'attack', stateTime: p, stateProgress: p, facing: anim.attackAngle, moveSpeed, healthRatio };
      } else if (moveSpeed > 0.05) {
        visual = { time, state: 'run', stateTime: 0, stateProgress: 0, facing, moveSpeed, healthRatio };
      } else {
        visual = { time, state: 'idle', stateTime: 0, stateProgress: 0, facing, moveSpeed: 0, healthRatio };
      }
      view.update(dtMs, visual);
    }

    for (const [entity, entry] of this.vfx) {
      if (!world.isAlive(entity)) {
        this.vfx.delete(entity);
        continue;
      }
      entry.elapsedMs += dtMs;
      const progress = entry.totalMs === Infinity ? 0 : Math.min(1, entry.elapsedMs / entry.totalMs);
      entry.view.update(dtMs, progress, time);
    }
  }
}
