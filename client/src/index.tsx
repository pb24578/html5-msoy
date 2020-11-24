import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import app, { appDOMId } from './shared/pixi';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

document.getElementById(appDOMId)?.append(app.view);
