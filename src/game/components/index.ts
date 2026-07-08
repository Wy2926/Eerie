import { defineComponent } from '../../core/ecs/world';

export interface Transform {
  x: number;
  y: number;
  rotation: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface RenderRef {
  layer: 'background' | 'world' | 'vfx' | 'ui';
}

export interface PhysicsRef {
  hasBody: boolean;
}

export interface Lifetime {
  remainingMs: number;
}

export const TransformC = defineComponent<Transform>('Transform');
export const VelocityC = defineComponent<Velocity>('Velocity');
export const RenderRefC = defineComponent<RenderRef>('RenderRef');
export const PhysicsRefC = defineComponent<PhysicsRef>('PhysicsRef');
export const LifetimeC = defineComponent<Lifetime>('Lifetime');
