import { createMiddleware, createReducer } from 'async-selector-kit';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore, combineReducers } from '@reduxjs/toolkit';

import { reducer as ChatReducer } from './components/chat/reducer';
import { reducer as WorldReducer } from './components/world/reducer';
import { reducer as UserReducer } from './shared/user/reducer';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  AsyncSelectorKit: createReducer(),
  router: connectRouter(history),
  chat: ChatReducer,
  world: WorldReducer,
  user: UserReducer,
});

const middlewares = [createMiddleware(), routerMiddleware(history)];

export type IState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer, applyMiddleware(...middlewares));
