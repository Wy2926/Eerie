import { describe, expect, it } from 'vitest';
import { FixedTimestep } from '../src/core/time/fixedTimestep';

describe('FixedTimestep', () => {
  it('accumulates frame deltas into fixed steps', () => {
    const ts = new FixedTimestep({ stepMs: 10 });
    expect(ts.advance(5)).toBe(0);
    expect(ts.advance(5)).toBe(1);
    expect(ts.advance(25)).toBe(2);
    expect(ts.alpha).toBeCloseTo(0.5);
  });

  it('clamps runaway deltas to maxSubSteps', () => {
    const ts = new FixedTimestep({ stepMs: 10, maxSubSteps: 3 });
    expect(ts.advance(1000)).toBe(3);
    expect(ts.alpha).toBe(0);
  });

  it('ignores negative deltas', () => {
    const ts = new FixedTimestep({ stepMs: 10 });
    expect(ts.advance(-50)).toBe(0);
    expect(ts.alpha).toBe(0);
  });
});
