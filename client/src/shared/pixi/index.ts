import * as PIXI from 'pixi.js-legacy';

/**
 * The HTML id of the DOM element that will contain the PIXI app.
 */
export const appDOMId: string = 'game-client';

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
