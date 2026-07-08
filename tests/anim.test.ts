import { describe, expect, it } from 'vitest';
import {
  clamp01,
  easeInQuad,
  easeOutBack,
  easeOutCubic,
  lerp,
  lerpAngle,
  noise1,
  quadBezier,
  sin01,
} from '../src/game/art/anim';

describe('anim 插值工具', () => {
  it('lerp 端点与中点正确', () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  it('lerpAngle 走最短路径跨越 ±π', () => {
    const r = lerpAngle(Math.PI - 0.1, -Math.PI + 0.1, 0.5);
    expect(Math.abs(Math.cos(r) - Math.cos(Math.PI))).toBeLessThan(0.01);
  });

  it('easing 函数端点归一', () => {
    for (const fn of [easeInQuad, easeOutCubic, easeOutBack]) {
      expect(fn(0)).toBeCloseTo(0, 5);
      expect(fn(1)).toBeCloseTo(1, 5);
    }
  });

  it('easeOutBack 中段有过冲回弹', () => {
    expect(easeOutBack(0.8)).toBeGreaterThan(1);
  });

  it('sin01 始终在 0..1 区间且随时间变化', () => {
    const a = sin01(0.1, 1);
    const b = sin01(0.35, 1);
    expect(a).not.toBeCloseTo(b, 3);
    for (let t = 0; t < 3; t += 0.07) {
      const v = sin01(t, 1.7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('noise1 确定性、区间 0..1 且连续', () => {
    expect(noise1(1.23)).toBe(noise1(1.23));
    for (let x = 0; x < 5; x += 0.11) {
      const v = noise1(x);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
      expect(Math.abs(noise1(x + 0.001) - v)).toBeLessThan(0.05);
    }
  });

  it('quadBezier 经过端点并受控制点牵引', () => {
    expect(quadBezier(0, 5, 10, 0)).toBe(0);
    expect(quadBezier(0, 5, 10, 1)).toBe(10);
    expect(quadBezier(0, 20, 10, 0.5)).toBeGreaterThan(5);
  });

  it('clamp01 截断越界值', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.4)).toBe(0.4);
  });
});
