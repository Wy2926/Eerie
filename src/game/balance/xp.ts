/** 升到 level+1 所需经验 */
export function xpForNextLevel(level: number): number {
  return Math.floor(5 + level * 6 + level * level * 0.8);
}

/** XP 掉落磁吸速度（px/s） */
export const XP_MAGNET_SPEED = 420;
