export interface EnemyConfig {
  id: string;
  name: string;
  maxHp: number;
  moveSpeed: number;
  contactDamage: number;
  xp: number;
  /** 视图缩放（精英放大） */
  scale: number;
  elite: boolean;
}

export const ENEMIES: Record<string, EnemyConfig> = {
  wokou: {
    id: 'wokou',
    name: '倭寇杂兵',
    maxHp: 20,
    moveSpeed: 80,
    contactDamage: 8,
    xp: 1,
    scale: 1,
    elite: false,
  },
  wokouElite: {
    id: 'wokouElite',
    name: '倭寇精英',
    maxHp: 120,
    moveSpeed: 70,
    contactDamage: 15,
    xp: 8,
    scale: 1.5,
    elite: true,
  },
};
