export type RunPhase = 'running' | 'choosing' | 'victory' | 'defeat';

export interface GameState {
  phase: RunPhase;
  elapsedMs: number;
  /** 当前三选一候选兵法 id（choosing 阶段有效） */
  choices: string[];
  /** 最近成型的联动 id（用于全屏提示） */
  formedSynergyId: string | null;
  formedSynergyMsRemaining: number;
}

export function createGameState(): GameState {
  return {
    phase: 'running',
    elapsedMs: 0,
    choices: [],
    formedSynergyId: null,
    formedSynergyMsRemaining: 0,
  };
}
