import type { Container } from 'pixi.js';
import type { Entity } from '../ecs/world';

/**
 * Maps entity ids to their Pixi views. The only place holding DisplayObjects
 * for gameplay entities; components store nothing but the entity id itself.
 */
export class ViewRegistry {
  private views = new Map<Entity, Container>();

  set(entity: Entity, view: Container): void {
    this.views.set(entity, view);
  }

  get(entity: Entity): Container | undefined {
    return this.views.get(entity);
  }

  remove(entity: Entity): void {
    const view = this.views.get(entity);
    if (view) {
      view.removeFromParent();
      view.destroy({ children: true });
      this.views.delete(entity);
    }
  }

  get size(): number {
    return this.views.size;
  }
}
