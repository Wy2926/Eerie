import { DebugOverlay } from './core/debug/overlay';
import { World } from './core/ecs/world';
import { PhysicsWorld } from './core/physics/physicsWorld';
import { createPixiApp } from './core/render/pixiApp';
import { ViewRegistry } from './core/render/viewRegistry';
import { FixedTimestep } from './core/time/fixedTimestep';
import { spawnArenaWalls, spawnDemoEntity } from './game/factories/demoFactory';
import { CleanupSystem } from './game/systems/cleanupSystem';
import { LifetimeSystem } from './game/systems/lifetimeSystem';
import { MatterStepSystem } from './game/systems/matterStepSystem';
import { RenderSyncSystem } from './game/systems/renderSyncSystem';

async function bootstrap(): Promise<void> {
  const { app, layers } = await createPixiApp();
  const world = new World();
  const physics = new PhysicsWorld();
  const views = new ViewRegistry();
  const timestep = new FixedTimestep();
  const overlay = new DebugOverlay(layers.ui);

  world.addSystem(new MatterStepSystem(physics));
  world.addSystem(new LifetimeSystem());
  world.addSystem(new CleanupSystem(views, physics));

  const renderSync = new RenderSyncSystem(views);

  const { width, height } = app.screen;
  spawnArenaWalls(physics, world, width, height);
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    spawnDemoEntity(
      world,
      views,
      physics,
      layers,
      width / 2 + Math.cos(angle) * 120,
      height / 2 + Math.sin(angle) * 120,
      Math.cos(angle) * 180,
      Math.sin(angle) * 180,
    );
  }

  app.ticker.add((ticker) => {
    const frameDeltaMs = ticker.deltaMS;
    const steps = timestep.advance(frameDeltaMs);
    for (let i = 0; i < steps; i++) {
      world.update(timestep.stepMs);
    }
    renderSync.update(world, frameDeltaMs);
    overlay.frame(frameDeltaMs, world, physics);
  });
}

void bootstrap();
