---
name: create-enemy
description: 新增类吸血鬼幸存者游戏中的敌人、精英怪或 Boss。包括 ECS 组件、AI、Matter.js 碰撞、PixiJS 程序化外观、掉落和波次配置。
argument-hint: "[enemy-id]"
---

# Create Enemy Skill

## 敌人必须包含

- balance config：id、名称、血量、速度、半径、接触伤害、XP、权重。
- ECS factory：创建 Transform、Health、EnemyTag、Movement/AI、PhysicsRef、RenderRef 等。
- AI 行为：默认向玩家移动；特殊敌人可以新增小 System。
- Matter.js 碰撞：圆形或简单 sensor/solid body。
- PixiJS 程序化外观：不得依赖图片。
- 掉落逻辑：通过 DropTable 或 XPValue，不要写死在死亡逻辑中。

## 精英和 Boss

- 精英使用 modifier，不复制整套普通怪代码。
- Boss 使用阶段数据，不要用大量 if 硬编码。
- Boss VFX 要有预警和清晰危险边界。

## 输出检查

- 是否加入波次池。
- 是否有对象池或批量性能考虑。
- 是否有 debug spawn 方式。
- 是否有基础测试或配置校验。
