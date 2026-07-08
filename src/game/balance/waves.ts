export interface WavePhase {
  /** 阶段开始时间（秒） */
  fromSec: number;
  enemyId: string;
  /** 每秒生成数 */
  spawnPerSec: number;
  /** 场上同类上限 */
  cap: number;
}

export const RUN_DURATION_SEC = 600;

export const WAVES: WavePhase[] = [
  { fromSec: 0, enemyId: 'wokou', spawnPerSec: 1, cap: 60 },
  { fromSec: 60, enemyId: 'wokou', spawnPerSec: 2, cap: 120 },
  { fromSec: 180, enemyId: 'wokou', spawnPerSec: 3.5, cap: 220 },
  { fromSec: 180, enemyId: 'wokouElite', spawnPerSec: 0.1, cap: 6 },
  { fromSec: 360, enemyId: 'wokou', spawnPerSec: 5, cap: 350 },
  { fromSec: 360, enemyId: 'wokouElite', spawnPerSec: 0.2, cap: 12 },
];

/** 生成点距玩家的最小/最大半径 */
export const SPAWN_RADIUS_MIN = 480;
export const SPAWN_RADIUS_MAX = 640;
