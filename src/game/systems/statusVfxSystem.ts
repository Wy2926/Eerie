import type { System, World } from '../../core/ecs/world';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { STATUSES } from '../balance/status';
import { StatusEffectsC } from '../components/gameplay';

/** 用 tint 批量表达敌人身上的状态颜色，避免额外 Graphics。 */
export class StatusVfxSystem implements System {
  readonly name = 'StatusVfxSystem';

  constructor(private views: ViewRegistry) {}

  update(world: World): void {
    for (const entity of world.query(StatusEffectsC)) {
      const view = this.views.get(entity);
      if (!view) continue;
      const effects = world.getComponent(entity, StatusEffectsC)!;
      if (effects.active.size === 0) {
        view.tint = 0xffffff;
        continue;
      }
      const firstStatus = [...effects.active.keys()][0];
      view.tint = STATUSES[firstStatus].color;
    }
  }
}
