# Coding Standards

## TypeScript

- 默认使用 TypeScript。
- 不要使用 `any` 绕过设计，除非有明确边界并写注释。
- 公共类型放在靠近使用处，跨模块共享再提升到 core 或 shared。
- 配置数据使用明确 interface。

## 文件组织

- 一个 System 一个文件。
- 一个核心 Component 一个文件或按领域小组组织。
- Factory 只创建实体初始状态。
- Balance config 不与 System 混放。

## 错误处理

- 不要吞异常。
- Debug 模式下提供清晰错误信息。
- 对不存在的 RenderRef/PhysicsRef 要能安全处理并记录。

## 注释

- 注释解释设计原因，不重复代码做了什么。
- 复杂系统顶部写执行时机和依赖组件。
- TODO 必须包含原因和后续动作。

## Git 和提交

- 不要自动 `git push`。
- 不要重写历史。
- 提交前运行验证命令。
