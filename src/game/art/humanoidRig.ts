import { Container, Graphics } from 'pixi.js';
import type { CharacterView, CharacterVisual } from './animatedView';
import { clamp01, easeInQuad, easeOutCubic, lerp, noise1 } from './anim';

/** 人形骨骼的独立部件；每个部件是独立 Graphics，轴心已在部件坐标系内设好。 */
export interface HumanoidParts {
  head: Graphics;
  torso: Graphics;
  armFront: Graphics;
  armBack: Graphics;
  legFront: Graphics;
  legBack: Graphics;
  /** 挂在前手上的武器（轴心=握把） */
  weapon?: Graphics;
}

export interface HumanoidRigOptions {
  parts: HumanoidParts;
  /** 肩关节相对躯干原点的偏移（px） */
  shoulder: { x: number; y: number };
  /** 髋关节相对躯干原点的偏移（px） */
  hip: { x: number; y: number };
  /** 头部（颈部轴心）相对躯干原点的偏移（px） */
  neck: { x: number; y: number };
  /** 步幅摆动幅度（弧度） */
  strideAmp?: number;
  /** 每个实例的相位差，避免群体同步摆动 */
  phaseSeed?: number;
}

/**
 * 通用人形动画骨骼：部件独立，全部动作由 time 连续插值驱动，
 * 支持 Idle / Run / Attack / Skill / Dash / Hit / Death 状态机。
 */
export class HumanoidRig implements CharacterView {
  readonly root: Container;
  private body: Container;
  private frontArmJoint: Container;
  private backArmJoint: Container;
  private frontLegJoint: Container;
  private backLegJoint: Container;
  private headJoint: Container;
  private o: HumanoidRigOptions;
  private phase: number;

  constructor(options: HumanoidRigOptions) {
    this.o = options;
    this.phase = options.phaseSeed ?? Math.random() * 100;
    const p = options.parts;
    this.root = new Container();
    this.body = new Container();
    this.root.addChild(this.body);

    this.backArmJoint = new Container();
    this.backArmJoint.position.set(-options.shoulder.x, options.shoulder.y);
    this.backArmJoint.addChild(p.armBack);

    this.backLegJoint = new Container();
    this.backLegJoint.position.set(-options.hip.x, options.hip.y);
    this.backLegJoint.addChild(p.legBack);

    this.frontLegJoint = new Container();
    this.frontLegJoint.position.set(options.hip.x, options.hip.y);
    this.frontLegJoint.addChild(p.legFront);

    this.headJoint = new Container();
    this.headJoint.position.set(options.neck.x, options.neck.y);
    this.headJoint.addChild(p.head);

    this.frontArmJoint = new Container();
    this.frontArmJoint.position.set(options.shoulder.x, options.shoulder.y);
    this.frontArmJoint.addChild(p.armFront);
    if (p.weapon) this.frontArmJoint.addChild(p.weapon);

    this.body.addChild(this.backArmJoint, this.backLegJoint, this.frontLegJoint, p.torso, this.headJoint, this.frontArmJoint);
  }

  update(_dt: number, v: CharacterVisual): void {
    const t = v.time + this.phase;
    const stride = this.o.strideAmp ?? 0.55;

    // 朝向翻转（连续插值避免瞬间镜像跳变）
    const targetFlip = Math.cos(v.facing) >= 0 ? 1 : -1;
    this.root.scale.x = lerp(this.root.scale.x, targetFlip, 0.35);

    if (v.state === 'death') {
      const p = easeInQuad(clamp01(v.stateProgress));
      this.body.rotation = lerp(0, Math.PI / 2, p);
      this.root.alpha = 1 - p;
      this.body.scale.y = lerp(1, 0.7, p);
      return;
    }

    const run = clamp01(v.moveSpeed);
    // 跑动频率随速度提升；idle 呼吸频率低
    const swing = Math.sin(t * (4 + run * 6) * 2) * stride * run;

    // 四肢：跑动摆动 ↔ 静止归零 连续插值
    this.frontLegJoint.rotation = swing;
    this.backLegJoint.rotation = -swing;
    this.backArmJoint.rotation = swing * 0.8;

    // 前手：攻击时用 easeOutCubic 做挥砍，其余时间随步伐摆动
    if (v.state === 'attack' || v.state === 'skill') {
      const p = easeOutCubic(clamp01(v.stateProgress));
      // 抬手 -> 挥落：-140° 到 +60°
      this.frontArmJoint.rotation = lerp(-2.4, 1.0, p);
    } else {
      this.frontArmJoint.rotation = lerp(this.frontArmJoint.rotation, -swing * 0.8, 0.25);
    }

    // 身体起伏：idle 慢呼吸 + run 弹跳，连续混合
    const idleBob = Math.sin(t * 1.6 * 2) * 0.8;
    const runBob = Math.abs(Math.sin(t * (4 + run * 6) * 2)) * 2.5;
    this.body.y = -lerp(idleBob * 0.5 + 0.5, runBob, run);
    this.body.rotation = lerp(this.body.rotation, run * targetFlip * 0.08, 0.2);
    const breath = 1 + Math.sin(t * 1.6 * 2) * 0.015 * (1 - run);
    this.body.scale.y = lerp(this.body.scale.y, breath, 0.3);

    // 头部：轻微点头/看向移动方向
    this.headJoint.rotation = Math.sin(t * (1.2 + run * 5) * 2) * (0.03 + run * 0.05);

    // 受击：噪声抖动 + 短促压缩
    if (v.state === 'hit') {
      const shake = (noise1(t * 40) - 0.5) * 4 * (1 - v.stateProgress);
      this.body.x = shake;
      this.body.scale.y *= 1 - 0.12 * (1 - v.stateProgress);
    } else {
      this.body.x = lerp(this.body.x, 0, 0.4);
    }

    // 低血量：整体轻微颤抖
    if (v.healthRatio < 0.3) {
      this.body.x += (noise1(t * 25 + 7) - 0.5) * 1.5;
    }

    // dash：前倾拉伸
    if (v.state === 'dash') {
      this.body.rotation = targetFlip * 0.25;
      this.body.scale.x = 1.1;
    } else {
      this.body.scale.x = lerp(this.body.scale.x, 1, 0.3);
    }

    this.root.alpha = 1;
  }
}
