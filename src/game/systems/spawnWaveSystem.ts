import type { System, World } from '../../core/ecs/world';
import type { PhysicsWorld } from '../../core/physics/physicsWorld';
import type { RenderLayers } from '../../core/render/pixiApp';
import type { ViewRegistry } from '../../core/render/viewRegistry';
import { SPAWN_RADIUS_MAX, SPAWN_RADIUS_MIN, WAVES } from '../balance/waves';
import { TransformC } from '../components';
import { EnemyTagC, PlayerTagC } from '../components/gameplay';
import { spawnEnemy } from '../factories/entityFactory';
import type { GameState } from '../gameState';

export class SpawnWaveSystem implements System {
  readonly name = 'SpawnWaveSystem';
  private spawnAcc = new Map<string, number>();

  constructor(
    private state: GameState,
    private views: ViewRegistry,
    private physics: PhysicsWorld,
    private layers: RenderLayers,
  ) {}

  update(world: World, dt: number): void {
    const players = world.query(PlayerTagC, TransformC);
    if (players.length === 0) return;
    const playerT = world.getComponent(players[0], TransformC)!;
    const elapsedSec = this.state.elapsedMs / 1000;

    const counts = new Map<string, number>();
    for (const entity of world.query(EnemyTagC)) {
      const id = world.getComponent(entity, EnemyTagC)!.enemyId;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }

    // 每个敌人取当前时间下最新的波次阶段
    const activePhase = new Map<string, { spawnPerSec: number; cap: number }>();
    for (const phase of WAVES) {
      if (elapsedSec >= phase.fromSec) {
        activePhase.set(phase.enemyId, { spawnPerSec: phase.spawnPerSec, cap: phase.cap });
      }
    }

    for (const [enemyId, phase] of activePhase) {
      const acc = (this.spawnAcc.get(enemyId) ?? 0) + (phase.spawnPerSec * dt) / 1000;
      let toSpawn = Math.floor(acc);
      this.spawnAcc.set(enemyId, acc - toSpawn);
      const current = counts.get(enemyId) ?? 0;
      toSpawn = Math.min(toSpawn, phase.cap - current);
      for (let i = 0; i < toSpawn; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = SPAWN_RADIUS_MIN + Math.random() * (SPAWN_RADIUS_MAX - SPAWN_RADIUS_MIN);
        spawnEnemy(
          world,
          this.views,
          this.physics,
          this.layers,
          enemyId,
          playerT.x + Math.cos(angle) * radius,
          playerT.y + Math.sin(angle) * radius,
        );
      }
    }
  }
}
