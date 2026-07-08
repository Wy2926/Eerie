/**
 * 程序化动画数学工具：所有素材动画必须由 time 驱动，
 * 通过 lerp / easing / 正弦 / 噪声 / 贝塞尔连续插值，禁止瞬移式跳变。
 */

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 角度插值（最短路径） */
export function lerpAngle(a: number, b: number, t: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function easeInQuad(t: number): number {
  return t * t;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number {
  return t * t * t;
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

/** 带回弹的弹出（拾取/出生 pop） */
export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/** 0..1 正弦波（time 秒，freq Hz，phase 弧度） */
export function sin01(time: number, freq: number, phase = 0): number {
  return 0.5 + 0.5 * Math.sin(time * freq * Math.PI * 2 + phase);
}

function hash1(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** 一维平滑值噪声，返回 0..1，用于抖动/闪烁/摇曳 */
export function noise1(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash1(i), hash1(i + 1), u);
}

/** 二次贝塞尔插值 */
export function quadBezier(p0: number, p1: number, p2: number, t: number): number {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}
