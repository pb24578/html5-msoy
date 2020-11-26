import { createMiddleware, createReducer } from 'async-selector-kit';
import { applyMiddleware, createStore, combineReducers } from '@reduxjs/toolkit';

import { reducer as UserReducer } from './shared/user/reducer';

const rootReducer = combineReducers({
  AsyncSelectorKit: createReducer(),
  user: UserReducer,
});

const middlewares = [createMiddleware()];

export type IState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer, applyMiddleware(...middlewares));
