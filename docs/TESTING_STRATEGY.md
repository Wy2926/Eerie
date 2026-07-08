# Testing Strategy

## 测试金字塔

1. ECS core 单元测试。
2. Component/System 逻辑测试。
3. Balance config 校验。
4. Matter collision adapter 测试。
5. PixiJS 程序化资产 smoke test。
6. 浏览器主循环 smoke test。

## System 测试方式

System 测试应创建最小 World：

1. 创建实体。
2. 挂载必要 Component。
3. 执行指定 System。
4. 断言 Component 或事件变化。

## 物理测试方式

- 不测试 Matter.js 内部。
- 测试 adapter 是否正确创建 body、同步 transform、收集 collision event。
- 测试 Entity 销毁时 body registry 是否清理。

## PixiJS 资产测试

- 创建资产不报错。
- 返回 root Container。
- destroy 可重复安全调用。
- 不导入图片文件。

## 回归测试

每个 bug 修复至少满足一个：

- 新增单元测试。
- 新增 debug scene。
- 新增配置校验。
- 新增日志断言或 smoke test。
