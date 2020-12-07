import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import App from './App';
import { store } from './store';

ReactDOM.render(
  <Provider store={store} context={ReactReduxContext}>
    <App />
  </Provider>,
  document.getElementById('root'),
);