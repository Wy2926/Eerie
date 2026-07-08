import { DebugOverlay } from './core/debug/overlay';
import { World } from './core/ecs/world';
import { PhysicsWorld } from './core/physics/physicsWorld';
import { createPixiApp } from './core/render/pixiApp';
import { ViewRegistry } from './core/render/viewRegistry';
import { FixedTimestep } from './core/time/fixedTimestep';
import { RUN_DURATION_SEC } from './game/balance/waves';
import { DamageInboxC } from './game/components/gameplay';
import { spawnPlayer } from './game/factories/entityFactory';
import { createGameState } from './game/gameState';
import { AnimationSystem } from './game/systems/animationSystem';
import { AttackHitSystem } from './game/systems/attackHitSystem';
import { applyChoice, rollChoices } from './game/systems/bingfaChoice';
import { CameraSystem } from './game/systems/cameraSystem';
import { CleanupSystem } from './game/systems/cleanupSystem';
import { DamageSystem } from './game/systems/damageSystem';
import { EnemyAISystem } from './game/systems/enemyAISystem';
import { Hud } from './game/systems/hud';
import { InputState } from './game/systems/inputSystem';
import { LifetimeSystem } from './game/systems/lifetimeSystem';
import { MatterStepSystem } from './game/systems/matterStepSystem';
import { PickupSystem } from './game/systems/pickupSystem';
import { PlayerIntentSystem } from './game/systems/playerIntentSystem';
import { RenderSyncSystem } from './game/systems/renderSyncSystem';
import { SpawnWaveSystem } from './game/systems/spawnWaveSystem';
import { StatusSystem } from './game/systems/statusSystem';
import { StatusVfxSystem } from './game/systems/statusVfxSystem';
import { WeaponFireSystem } from './game/systems/weaponFireSystem';
import { PlayerBuildC } from './game/components/gameplay';

const SYNERGY_BANNER_MS = 3000;

async function bootstrap(): Promise<void> {
  const { app, layers } = await createPixiApp();
  const world = new World();
  const physics = new PhysicsWorld();
  const views = new ViewRegistry();
  const timestep = new FixedTimestep();
  const input = new InputState();
  const state = createGameState();
  const overlay = new DebugOverlay(layers.ui);
  const hud = new Hud(layers.ui, () => app.screen.width, () => app.screen.height);
  const animation = new AnimationSystem();

  // 全局伤害事件收件箱实体
  const damageInboxEntity = world.createEntity();
  world.addComponent(damageInboxEntity, DamageInboxC, { events: [] });

  world.addSystem(new PlayerIntentSystem(input, physics));
  world.addSystem(new EnemyAISystem(physics));
  world.addSystem(new WeaponFireSystem(views, layers, animation));
  world.addSystem(new SpawnWaveSystem(state, views, physics, layers, animation));
  world.addSystem(new MatterStepSystem(physics));
  world.addSystem(new AttackHitSystem(damageInboxEntity));
  world.addSystem(new StatusSystem(damageInboxEntity));
  world.addSystem(new DamageSystem(state, physics, views, layers, animation, damageInboxEntity));
  world.addSystem(new PickupSystem());
  world.addSystem(new LifetimeSystem());
  world.addSystem(new CleanupSystem(views, physics));

  const renderSync = new RenderSyncSystem(views);
  const statusVfx = new StatusVfxSystem(views);
  const camera = new CameraSystem(layers.world, layers.vfx, () => app.screen.width, () => app.screen.height);

  const player = spawnPlayer(world, views, physics, layers, animation, 'jinyiwei', 0, 0);

  window.addEventListener('keydown', (e) => {
    if (state.phase !== 'choosing') return;
    const index = ['1', '2', '3'].indexOf(e.key);
    if (index < 0 || index >= state.choices.length) return;
    const build = world.getComponent(player, PlayerBuildC)!;
    const formed = applyChoice(build, state.choices[index]);
    if (formed.length > 0) {
      state.formedSynergyId = formed[0];
      state.formedSynergyMsRemaining = SYNERGY_BANNER_MS;
    }
    build.pendingLevelUps -= 1;
    state.choices = [];
    state.phase = 'running';
  });

  app.ticker.add((ticker) => {
    const frameDeltaMs = ticker.deltaMS;

    if (state.phase === 'running') {
      const steps = timestep.advance(frameDeltaMs);
      for (let i = 0; i < steps; i++) {
        state.elapsedMs += timestep.stepMs;
        world.update(timestep.stepMs);
      }
      if (state.elapsedMs >= RUN_DURATION_SEC * 1000 && state.phase === 'running') {
        state.phase = 'victory';
      }
      const build = world.getComponent(player, PlayerBuildC);
      if (build && build.pendingLevelUps > 0 && state.phase === 'running') {
        const choices = rollChoices(build).map((c) => c.id);
        if (choices.length > 0) {
          state.choices = choices;
          state.phase = 'choosing';
          hud.showChoices(choices);
        } else {
          build.pendingLevelUps = 0;
        }
      }
    }

    if (state.formedSynergyMsRemaining > 0) {
      state.formedSynergyMsRemaining -= frameDeltaMs;
    }

    animation.update(world, frameDeltaMs);
    renderSync.update(world, frameDeltaMs);
    statusVfx.update(world);
    camera.update(world);
    hud.update(world, state, frameDeltaMs);
    overlay.frame(frameDeltaMs, world, physics);
  });
}

void bootstrap();
