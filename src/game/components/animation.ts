import { defineComponent } from '../../core/ecs/world';

/** 角色动画状态数据（纯数据；状态机推进在 AnimationSystem）。 */
export interface AnimState {
  /** 攻击动作剩余毫秒（WeaponFireSystem 触发） */
  attackMs: number;
  attackDurationMs: number;
  /** 攻击挥击方向（弧度） */
  attackAngle: number;
  /** 受击反馈剩余毫秒（DamageSystem 触发） */
  hitMs: number;
  /** 上一帧位置，用于计算视觉移动速度 */
  prevX: number;
  prevY: number;
  /** 最近一次移动方向（弧度），无 Facing 组件的实体用它 */
  facing: number;
  /** 归一化移动速度的参考最大速度（px/s） */
  maxSpeed: number;
}

/** 死亡演出中：实体保留到动画结束（配合 Lifetime），期间不再参与判定。 */
export interface Dying {
  elapsedMs: number;
  totalMs: number;
}

export const AnimStateC = defineComponent<AnimState>('AnimState');
export const DyingC = defineComponent<Dying>('Dying');
