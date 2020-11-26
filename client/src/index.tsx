import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import app, { appDOMId, resizePixiApp } from './shared/pixi';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

const pixiContainer = document.getElementById(appDOMId);
if (pixiContainer) {
  pixiContainer.append(app.view);
  resizePixiApp();
}
