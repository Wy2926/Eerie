export interface FixedTimestepOptions {
  stepMs?: number;
  maxSubSteps?: number;
}

export const DEFAULT_STEP_MS = 1000 / 60;

/**
 * Fixed timestep accumulator. Feed variable frame deltas via `advance`;
 * it returns how many fixed steps to run, clamped to avoid spiral of death.
 */
export class FixedTimestep {
  readonly stepMs: number;
  private readonly maxSubSteps: number;
  private accumulator = 0;

  constructor(options: FixedTimestepOptions = {}) {
    this.stepMs = options.stepMs ?? DEFAULT_STEP_MS;
    this.maxSubSteps = options.maxSubSteps ?? 5;
  }

  advance(frameDeltaMs: number): number {
    this.accumulator += Math.max(0, frameDeltaMs);
    let steps = Math.floor(this.accumulator / this.stepMs);
    if (steps > this.maxSubSteps) {
      steps = this.maxSubSteps;
      this.accumulator = 0;
    } else {
      this.accumulator -= steps * this.stepMs;
    }
    return steps;
  }

  /** Interpolation factor [0,1) between the last and next fixed step. */
  get alpha(): number {
    return this.accumulator / this.stepMs;
  }
}
