---
name: create-bingfa
description: 新增兵法（升级三选一的内容）或兵法联动。兵法分五层：基础、武器改造、状态、规则、核心。80% 是机制而非数值。
argument-hint: "[bingfa-id]"
---

# Create Bingfa Skill

> 设计约束（见 `docs/prd/`、`docs/BUILD_SYSTEM.md`）：兵法不是装备、不是遗物，而是改变规则。优先改变攻击方式和游戏规则，而不是加数字。

## 兵法五层

| 类别 | 占比 | 作用 |
|---|---|---|
| basic 基础 | ~20% | 保底数值（攻击/攻速/暴击/生命/经验/射程/冷却/投射物+1） |
| weapon-mod 武器改造 | ~30% | 改变攻击规则（穿透/折返/分裂/追踪/爆炸/剑气/旋风等） |
| status 状态 | ~25% | 附加状态，服务状态反应（用 create-status-reaction 定义状态本体） |
| rule 规则 | ~20% | 改变游戏规则（借刀杀人/越战越勇/军阵/穷追猛打等） |
| core 核心 | ~5% | 直接决定 Build（一人成军/左右开弓/万箭齐发等），极少出现 |

## 兵法必须包含

- balance config：id、category、weight、requiresTags、excludesIds、effects（`src/game/balance/`）。
- 效果实现：数据驱动的 modifier 或效果处理器 id，不写死在 WeaponFireSystem / LevelUpSystem。
- 三选一权重池接入：按五层比例抽取，考虑已有武器/状态/兵法协同。
- 联动定义（若有）：SynergyConfig（requires + grants），成型时给出明确提示（如 燃烧 + 毒爆 → 瘴焰）。
- UI 文案：名称、类别、一句话规则描述。

## 禁止

- 不要把兵法效果写成散落在多个 System 的 if 分支；用统一的 modifier/效果处理器注册。
- 不要让基础数值类兵法超过整体 20% 比例。
- 不要给核心兵法设置高出现率。
- 不要在兵法中直接引用 PixiJS / Matter 对象。

## 验证

- 出现在正确类别的权重池，前置不满足时不出现。
- 效果可被 debug overlay 或日志观察。
- 联动提示在条件满足时正确触发。
- 移除/替换武器后相关兵法效果正确失效或转移。
