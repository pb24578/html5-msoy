import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import App from './App';
import { store } from './store';
import app, { appDOMId, resizePixiApp } from './shared/pixi';

ReactDOM.render(
  <Provider store={store} context={ReactReduxContext}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

const pixiContainer = document.getElementById(appDOMId);
if (pixiContainer) {
  pixiContainer.append(app.view);
  resizePixiApp();
}
