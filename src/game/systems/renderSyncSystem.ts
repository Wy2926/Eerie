import type { System, World } from '../../core/ecs/world';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { RenderRefC, TransformC } from '../components';

/** Copies ECS transforms to Pixi views. The only place render state is written. */
export class RenderSyncSystem implements System {
  readonly name = 'RenderSyncSystem';

  constructor(private views: ViewRegistry) {}

  update(world: World, _dt: number): void {
    for (const entity of world.query(TransformC, RenderRefC)) {
      const view = this.views.get(entity);
      if (!view) continue;
      const t = world.getComponent(entity, TransformC)!;
      view.position.set(Math.round(t.x), Math.round(t.y));
      view.rotation = t.rotation;
    }
  }
}
