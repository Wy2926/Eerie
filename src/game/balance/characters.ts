export interface CharacterConfig {
  id: string;
  name: string;
  startingWeaponId: string;
  maxHp: number;
  moveSpeed: number;
  pickupRadius: number;
  /** Enemies below this HP ratio die instantly to this character's hits. */
  executeThreshold: number;
}

export const CHARACTERS: Record<string, CharacterConfig> = {
  jinyiwei: {
    id: 'jinyiwei',
    name: '锦衣卫',
    startingWeaponId: 'xiuchundao',
    maxHp: 100,
    moveSpeed: 220,
    pickupRadius: 60,
    executeThreshold: 0.2,
  },
};
