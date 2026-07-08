---
paths:
  - "src/**/*.{ts,tsx,js,jsx}"
---

# Performance Rules

## 帧预算

目标：普通桌面浏览器 60 FPS，实体数逐步扩展到 500+。

## 热点约束

- 不要在每帧热点循环中创建临时对象。
- 不要在每帧使用高开销 filter/map/reduce 处理大量实体。
- 不要为大量怪物逐个创建复杂 Graphics。
- 不要每帧 new Matter.Body。
- 不要在系统循环中频繁读写 DOM。

## 对象池

以下对象优先池化：

- Projectile entity
- VFX view
- Damage number
- Pickup view
- Collision event object
- Temporary vector

## Profiling

性能改动必须说明：

- 优化的热点。
- 影响的系统。
- 预期收益。
- 可能副作用。
- 如何验证。
