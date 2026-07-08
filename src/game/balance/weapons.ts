export interface WeaponConfig {
  id: string;
  name: string;
  /** 定位标签，例如 melee-slash / control / burst */
  role: string;
  cooldownMs: number;
  damage: number;
  /** 扇形半径（px） */
  range: number;
  /** 扇形角度（弧度） */
  arc: number;
  /** 刀光持续显示时间 */
  slashDurationMs: number;
}

export const WEAPONS: Record<string, WeaponConfig> = {
  xiuchundao: {
    id: 'xiuchundao',
    name: '绣春刀',
    role: 'melee-slash',
    cooldownMs: 900,
    damage: 12,
    range: 90,
    arc: Math.PI * 0.7,
    slashDurationMs: 150,
  },
};
