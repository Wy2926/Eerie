import { Container, Text } from 'pixi.js';
import type { World } from '../ecs/world';
import type { PhysicsWorld } from '../physics/physicsWorld';

export class DebugOverlay {
  readonly view: Container;
  private text: Text;
  private frames = 0;
  private fpsWindowMs = 0;
  private fps = 0;
  enabled = true;

  constructor(parent: Container) {
    this.view = new Container();
    this.text = new Text({
      text: '',
      style: {
        fontFamily: 'monospace',
        fontSize: 12,
        fill: 0x9fef9f,
      },
    });
    this.text.position.set(8, 8);
    this.view.addChild(this.text);
    parent.addChild(this.view);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F3' || e.key === '`') {
        e.preventDefault();
        this.enabled = !this.enabled;
        this.view.visible = this.enabled;
      }
    });
  }

  frame(frameDeltaMs: number, world: World, physics: PhysicsWorld): void {
    this.frames++;
    this.fpsWindowMs += frameDeltaMs;
    if (this.fpsWindowMs >= 500) {
      this.fps = Math.round((this.frames * 1000) / this.fpsWindowMs);
      this.frames = 0;
      this.fpsWindowMs = 0;
    }
    if (!this.enabled) return;
    const timings = world.systemTimings
      .map((t) => `${t.name}: ${t.lastMs.toFixed(2)}ms`)
      .join('\n');
    this.text.text = [
      `FPS: ${this.fps}`,
      `Entities: ${world.entityCount}`,
      `Bodies: ${physics.bodyCount}`,
      '--- systems ---',
      timings,
    ].join('\n');
  }
}
