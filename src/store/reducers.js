import { combineReducers } from '@reduxjs/toolkit';
import indexReducers from '../pages/Index/reducers/reducers';

/* reducers */
const reducers = {
  ...indexReducers
};

/* 创建reducer */
export function createReducer(asyncReducers) {
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}