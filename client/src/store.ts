import { createMiddleware, createReducer } from 'async-selector-kit';
import { applyMiddleware, createStore, combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  AsyncSelectorKit: createReducer(),
});

const middlewares = [createMiddleware()];

export type IState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer, applyMiddleware(...middlewares));
