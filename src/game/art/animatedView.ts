import type { Container } from 'pixi.js';

/** 角色动画状态机的全部状态。 */
export type CharacterAnimState = 'idle' | 'run' | 'attack' | 'skill' | 'dash' | 'hit' | 'death';

/** 每帧传入角色视图的只读可视状态（由 AnimationSystem 从 ECS 计算，不含玩法逻辑）。 */
export interface CharacterVisual {
  /** 全局时间（秒），驱动循环动画 */
  time: number;
  state: CharacterAnimState;
  /** 当前状态持续时间（秒） */
  stateTime: number;
  /** 有限状态（attack/hit/death）的进度 0..1；循环状态恒为 0 */
  stateProgress: number;
  /** 朝向角（弧度），用于翻转与挥击方向 */
  facing: number;
  /** 归一化移动速度 0..1 */
  moveSpeed: number;
  healthRatio: number;
}

/** 角色类动画视图：部件独立、由时间驱动、可被状态机控制。 */
export interface CharacterView {
  root: Container;
  update(dt: number, visual: CharacterVisual): void;
}

/** 特效类动画视图：progress 为生命周期进度 0..1，返回后由注册表统一销毁。 */
export interface VfxView {
  root: Container;
  update(dt: number, progress: number, time: number): void;
}
