import { combineReducers } from '@reduxjs/toolkit';
import indexModels from '../pages/Index/models/models';

/* reducers */
const reducers = {
  ...indexModels
};

/* 创建reducer */
export function createReducer(asyncReducers) {
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}