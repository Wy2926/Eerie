import { defineComponent } from '../../core/ecs/world';

export interface PlayerTag {
  characterId: string;
}

export interface Health {
  hp: number;
  maxHp: number;
}

export interface EnemyTag {
  enemyId: string;
}

export interface Facing {
  /** 朝向角度（弧度） */
  angle: number;
}

export interface WeaponState {
  weaponId: string;
  cooldownRemainingMs: number;
}

export interface XpPickup {
  amount: number;
  magnetized: boolean;
}

export interface StatusEffects {
  /** statusId -> { remainingMs, stacks, tickAccMs } */
  active: Map<string, { remainingMs: number; stacks: number; tickAccMs: number }>;
}

export interface PlayerBuild {
  /** 已获得兵法 id -> 次数 */
  bingfa: Map<string, number>;
  /** 已成型联动 id */
  synergies: Set<string>;
  level: number;
  xp: number;
  xpToNext: number;
  /** 待处理升级次数（>0 时弹三选一） */
  pendingLevelUps: number;
}

export interface DamageEvent {
  target: number;
  amount: number;
  /** 来自玩家武器的直接命中（可触发处决/附加状态） */
  fromPlayerHit: boolean;
}

export interface DamageInbox {
  events: DamageEvent[];
}

/** 短寿命攻击区域（刀光/刀气/拖尾），命中去重 */
export interface AttackArea {
  damage: number;
  fromPlayerHit: boolean;
  hitEntities: Set<number>;
  /** 'sector' 用扇形判定；'circle' 用半径判定 */
  shape: 'sector' | 'circle';
  x: number;
  y: number;
  radius: number;
  angle: number;
  arc: number;
  /** 是否随移动方向飞行（刀气） */
  vx: number;
  vy: number;
}

export const PlayerTagC = defineComponent<PlayerTag>('PlayerTag');
export const HealthC = defineComponent<Health>('Health');
export const EnemyTagC = defineComponent<EnemyTag>('EnemyTag');
export const FacingC = defineComponent<Facing>('Facing');
export const WeaponStateC = defineComponent<WeaponState>('WeaponState');
export const XpPickupC = defineComponent<XpPickup>('XpPickup');
export const StatusEffectsC = defineComponent<StatusEffects>('StatusEffects');
export const PlayerBuildC = defineComponent<PlayerBuild>('PlayerBuild');
export const DamageInboxC = defineComponent<DamageInbox>('DamageInbox');
export const AttackAreaC = defineComponent<AttackArea>('AttackArea');
