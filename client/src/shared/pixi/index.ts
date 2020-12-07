import * as PIXI from 'pixi.js-legacy';

const app = new PIXI.Application();

/**
 * Resizes the Pixi App to the parent's dimensions.
 */
export const resizePixiApp = () => {
  const parent = app.view.parentElement;
  if (parent) {
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
  }
};

export default app;
