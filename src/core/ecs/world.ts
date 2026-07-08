export type Entity = number;

export interface ComponentType<T> {
  readonly id: number;
  readonly name: string;
  readonly _marker?: T;
}

let nextComponentId = 0;

export function defineComponent<T>(name: string): ComponentType<T> {
  return { id: nextComponentId++, name };
}

export interface System {
  readonly name: string;
  update(world: World, dt: number): void;
}

export interface SystemTiming {
  name: string;
  lastMs: number;
}

export class World {
  private nextEntity: Entity = 1;
  private alive = new Set<Entity>();
  private stores = new Map<number, Map<Entity, unknown>>();
  private systems: System[] = [];
  private timings: SystemTiming[] = [];
  private pendingDestroy = new Set<Entity>();

  createEntity(): Entity {
    const e = this.nextEntity++;
    this.alive.add(e);
    return e;
  }

  isAlive(entity: Entity): boolean {
    return this.alive.has(entity);
  }

  destroyEntity(entity: Entity): void {
    this.pendingDestroy.add(entity);
  }

  destroyEntityImmediate(entity: Entity): void {
    this.alive.delete(entity);
    for (const store of this.stores.values()) {
      store.delete(entity);
    }
  }

  flushDestroyed(): Entity[] {
    const destroyed = [...this.pendingDestroy];
    for (const e of destroyed) {
      this.destroyEntityImmediate(e);
    }
    this.pendingDestroy.clear();
    return destroyed;
  }

  addComponent<T>(entity: Entity, type: ComponentType<T>, value: T): void {
    let store = this.stores.get(type.id);
    if (!store) {
      store = new Map();
      this.stores.set(type.id, store);
    }
    store.set(entity, value);
  }

  getComponent<T>(entity: Entity, type: ComponentType<T>): T | undefined {
    return this.stores.get(type.id)?.get(entity) as T | undefined;
  }

  hasComponent<T>(entity: Entity, type: ComponentType<T>): boolean {
    return this.stores.get(type.id)?.has(entity) ?? false;
  }

  removeComponent<T>(entity: Entity, type: ComponentType<T>): void {
    this.stores.get(type.id)?.delete(entity);
  }

  query(...types: ComponentType<unknown>[]): Entity[] {
    if (types.length === 0) return [...this.alive];
    let smallest: Map<Entity, unknown> | undefined;
    for (const t of types) {
      const store = this.stores.get(t.id);
      if (!store || store.size === 0) return [];
      if (!smallest || store.size < smallest.size) smallest = store;
    }
    const result: Entity[] = [];
    outer: for (const entity of smallest!.keys()) {
      if (!this.alive.has(entity)) continue;
      for (const t of types) {
        if (!this.stores.get(t.id)!.has(entity)) continue outer;
      }
      result.push(entity);
    }
    return result;
  }

  addSystem(system: System): void {
    this.systems.push(system);
    this.timings.push({ name: system.name, lastMs: 0 });
  }

  get systemTimings(): readonly SystemTiming[] {
    return this.timings;
  }

  get entityCount(): number {
    return this.alive.size;
  }

  update(dt: number): void {
    for (let i = 0; i < this.systems.length; i++) {
      const start = performance.now();
      this.systems[i].update(this, dt);
      this.timings[i].lastMs = performance.now() - start;
    }
  }
}
