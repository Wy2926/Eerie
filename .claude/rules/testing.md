---
paths:
  - "src/**/*.{ts,tsx,js,jsx}"
  - "tests/**/*.{ts,tsx,js,jsx}"
---

# Testing Rules

## 优先级

1. ECS core 单元测试。
2. System 逻辑测试。
3. Balance config 校验。
4. Physics adapter 事件转换测试。
5. PixiJS 资产 smoke test。
6. 浏览器运行验证。

## Bug 修复流程

- 先定位状态源：ECS、Matter.js、PixiJS、输入、时间步、配置。
- 复现问题后再修复。
- 修复后添加最小回归测试或 debug 场景。
- 不要用随机延时、吞异常或重置全局状态掩盖问题。

## 验证标准

- 构建通过。
- 测试通过。
- 无新的 TypeScript 错误。
- 主循环能启动并渲染至少一个 ECS entity。
- Matter fixed timestep 能稳定推进。
