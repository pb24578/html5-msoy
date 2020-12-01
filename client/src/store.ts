import { createMiddleware, createReducer } from 'async-selector-kit';
import { applyMiddleware, createStore, combineReducers } from '@reduxjs/toolkit';

import { reducer as ChatReducer } from './components/chat/reducer';
import { reducer as GameReducer } from './components/game/reducer';
import { reducer as UserReducer } from './shared/user/reducer';

const rootReducer = combineReducers({
  AsyncSelectorKit: createReducer(),
  chat: ChatReducer,
  game: GameReducer,
  user: UserReducer,
});

const middlewares = [createMiddleware()];

export type IState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer, applyMiddleware(...middlewares));
