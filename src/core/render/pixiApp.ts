import { Application, Container, TextureSource } from 'pixi.js';

export interface RenderLayers {
  background: Container;
  world: Container;
  vfx: Container;
  ui: Container;
}

export interface PixiRenderContext {
  app: Application;
  layers: RenderLayers;
}

export async function createPixiApp(): Promise<PixiRenderContext> {
  TextureSource.defaultOptions.scaleMode = 'nearest';

  const app = new Application();
  await app.init({
    resizeTo: window,
    background: '#101014',
    antialias: false,
    roundPixels: true,
  });
  document.body.appendChild(app.canvas);

  const layers: RenderLayers = {
    background: new Container(),
    world: new Container(),
    vfx: new Container(),
    ui: new Container(),
  };
  app.stage.addChild(layers.background, layers.world, layers.vfx, layers.ui);

  return { app, layers };
}
